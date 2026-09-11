// Port of Carlib/Views/Driver/MyGarageView.swift — game-like garage where
// vehicles are 3D-perspective cards swiped through a pager. Custom page dots
// (SwiftUI's built-in dots disappear against the light background) and a
// per-vehicle stats strip + active claims below the carousel.
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import PagerView, { type PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { useShallow } from 'zustand/react/shallow';

import { CarBrandLogo } from '@/components/CarBrandLogo';
import { CarlibButton } from '@/components/CarlibButton';
import { ClaimCard } from '@/components/ClaimCard';
import { RemixIcon } from '@/components/RemixIcon';
import { useHeaderHeight } from '@/lib/header';
import type { Vehicle } from '@/models/types';
import { selectActiveClaims, useClaimStore } from '@/stores/claimStore';
import { carlibFont, radius, sectionHeaderText, spacing, text, useTheme } from '@/theme';

// SwiftUI spring(response: 0.6, dampingFraction: 0.7): stiffness = (2π/0.6)²,
// damping = 2·0.7·√stiffness.
const ENTRANCE_SPRING = { mass: 1, stiffness: 110, damping: 15 } as const;
// SwiftUI spring(response: 0.3, dampingFraction: 0.7).
const DOT_SPRING = { mass: 1, stiffness: 439, damping: 29 } as const;

// SwiftUI rotation3DEffect(perspective: 0.5) on a ~340pt card ≈ m34 of
// -0.5/340 → RN perspective ≈ 700pt.
const CARD_PERSPECTIVE = 700;

export default function MyGarageScreen() {
  const { t } = useTranslation();
  // The section header is not a ScrollView: pad below the transparent native bar.
  const headerHeight = useHeaderHeight();
  const { colors } = useTheme();
  const router = useRouter();
  const vehicles = useClaimStore((s) => s.vehicles);
  const activeClaims = useClaimStore(useShallow(selectActiveClaims));
  const setDefaultVehicle = useClaimStore((s) => s.setDefaultVehicle);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedVehicle = selectedIndex < vehicles.length ? vehicles[selectedIndex] : undefined;
  const vehicleClaims =
    selectedVehicle == null
      ? []
      : activeClaims.filter(
          (claim) => claim.vehicleInfo?.licensePlate === selectedVehicle.info.licensePlate,
        );

  function handleSetDefault(id: string) {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setDefaultVehicle(id);
  }

  function handlePageSelected(e: PagerViewOnPageSelectedEvent) {
    setSelectedIndex(e.nativeEvent.position);
  }

  const addVehicle = () => router.push('/home/add-vehicle');

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg, paddingTop: headerHeight }]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[sectionHeaderText, { color: colors.carlibLabel }]}>
            {t('driverHome.shortcutMyGarageTitle')}
          </Text>
          <Text style={[text.caption, { color: colors.carlibSecondary }]}>
            {`${vehicles.length} vehicle${vehicles.length === 1 ? '' : 's'}`}
          </Text>
        </View>
        <Pressable onPress={addVehicle} hitSlop={12} style={({ pressed }) => pressed && styles.pressedDim}>
          <RemixIcon name="addCircleFill" size={24} color={colors.brandYellow} />
        </Pressable>
      </View>

      {vehicles.length === 0 ? (
        <View style={styles.empty}>
          <RemixIcon name="carLine" size={64} color={`${colors.carlibSecondary}4D`} />
          <Text style={[text.title2, { color: colors.carlibDark }]}>No vehicles yet</Text>
          <Text style={[text.body, { color: colors.carlibSecondary }]}>
            Add your first car to get started
          </Text>
          <CarlibButton label="Add Vehicle" icon="addLine" onPress={addVehicle} style={styles.emptyCta} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <PagerView style={styles.pager} initialPage={0} onPageSelected={handlePageSelected}>
            {vehicles.map((vehicle) => (
              <View key={vehicle.id} style={styles.page}>
                <VehicleCard3D
                  vehicle={vehicle}
                  isDefault={vehicle.isDefault}
                  onSetDefault={() => handleSetDefault(vehicle.id)}
                />
              </View>
            ))}
          </PagerView>

          {vehicles.length > 1 && (
            <View style={styles.dots}>
              {vehicles.map((vehicle, index) => (
                <PageDot key={vehicle.id} active={index === selectedIndex} />
              ))}
            </View>
          )}

          {selectedVehicle != null && (
            <View style={styles.infoPanel}>
              <View style={[styles.statsStrip, { backgroundColor: colors.tileSecondary }]}>
                <StatItem value={`${selectedVehicle.info.year ?? 0}`} label="Year" />
                <View style={[styles.statDivider, { backgroundColor: colors.carlibCardBorder }]} />
                <StatItem value={selectedVehicle.info.color} label="Color" />
                <View style={[styles.statDivider, { backgroundColor: colors.carlibCardBorder }]} />
                <StatItem value={selectedVehicle.info.licensePlate} label="Plate" />
              </View>

              {vehicleClaims.length > 0 && (
                <View style={styles.claimsSection}>
                  <Text style={[sectionHeaderText, styles.claimsHeader, { color: colors.carlibLabel }]}>
                    Active Claims
                  </Text>
                  {vehicleClaims.map((claim) => (
                    <View key={claim.id} style={styles.claimRow}>
                      <ClaimCard claim={claim} />
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

interface VehicleCard3DProps {
  vehicle: Vehicle;
  isDefault: boolean;
  onSetDefault: () => void;
}

function VehicleCard3D({ vehicle, isDefault, onSetDefault }: VehicleCard3DProps) {
  const { colors } = useTheme();
  const appeared = useSharedValue(0);

  useEffect(() => {
    appeared.value = withDelay(100, withSpring(1, ENTRANCE_SPRING));
  }, [appeared]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 600 },
      { rotateY: `${interpolate(appeared.value, [0, 1], [-15, 0])}deg` },
      { scale: interpolate(appeared.value, [0, 1], [0.9, 1]) },
    ],
  }));

  return (
    <View style={[styles.card, { backgroundColor: colors.tileSecondary }]}>
      <View style={styles.cardTopRow}>
        {isDefault ? (
          <View style={[styles.defaultBadge, { backgroundColor: `${colors.brandYellow}26` }]}>
            <Text style={[text.caption, { color: colors.brandYellow }]}>Default</Text>
          </View>
        ) : (
          <Pressable
            onPress={onSetDefault}
            hitSlop={12}
            style={({ pressed }) => [styles.setDefaultButton, pressed && styles.pressedDim]}
          >
            <Text style={[text.caption, { color: colors.carlibSecondary }]}>Set Default</Text>
          </Pressable>
        )}
      </View>

      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <CarBrandLogo brand={vehicle.info.brand} size={120} />
      </Animated.View>

      <View style={styles.cardBottomRow}>
        <View style={styles.nameBlock}>
          {vehicle.nickname != null && (
            <Text style={[text.caption, { color: colors.brandYellow }]}>{vehicle.nickname}</Text>
          )}
          <Text style={[text.title2, { color: colors.carlibDark }]}>
            {`${vehicle.info.brand} ${vehicle.info.model}`}
          </Text>
        </View>
        <View style={[styles.plateChip, { backgroundColor: colors.carlibScreenBg }]}>
          <Text style={[text.caption, { color: colors.carlibDark }]}>
            {vehicle.info.licensePlate}
          </Text>
        </View>
      </View>
    </View>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.statItem}>
      <Text
        style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {value}
      </Text>
      <Text style={[sectionHeaderText, { color: colors.carlibLabel }]}>{label}</Text>
    </View>
  );
}

function PageDot({ active }: { active: boolean }) {
  const { colors } = useTheme();
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(active ? 1 : 0, DOT_SPRING);
  }, [active, progress]);

  const style = useAnimatedStyle(() => {
    const size = interpolate(progress.value, [0, 1], [6, 8]);
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.carlibCardBorder, colors.carlibDark],
      ),
    };
  });

  return <Animated.View style={style} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  headerText: { gap: spacing.xxs },
  // SwiftUI default Button press dim.
  pressedDim: { opacity: 0.3 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingBottom: spacing.huge,
  },
  emptyCta: {
    alignSelf: 'stretch',
    marginHorizontal: spacing.xxxl,
  },
  scrollContent: { paddingBottom: spacing.xl },
  // Extra height around the 280pt card mirrors the iOS 340pt TabView frame.
  pager: { height: 340 },
  page: {
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  card: {
    height: 280,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    justifyContent: 'space-between',
    // Persistent x-axis tilt of the Swift VehicleCard3D.
    transform: [{ perspective: CARD_PERSPECTIVE }, { rotateX: '2deg' }],
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  defaultBadge: {
    paddingHorizontal: 10,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },
  setDefaultButton: { marginLeft: 'auto' },
  logoWrap: { alignItems: 'center' },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  nameBlock: { gap: spacing.xxs, flexShrink: 1 },
  plateChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: spacing.xxs,
    paddingBottom: spacing.xs,
  },
  infoPanel: {
    paddingTop: spacing.xs,
    gap: spacing.md,
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xxs,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 32,
  },
  claimsSection: { gap: spacing.xs },
  claimsHeader: { paddingHorizontal: spacing.lg },
  claimRow: { paddingHorizontal: spacing.lg },
});
