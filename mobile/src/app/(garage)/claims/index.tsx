// Port of Carlib/Views/Garage/GarageClaimsListView.swift — Requests / My Cases
// behind a capsule segmented filter. The Swift row owned a local .sheet for the
// repair-status update; here Update pushes the repair-status route instead, and
// photo taps push the lightbox (Swift set enablePhotoLightbox: true).
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { ClaimCard } from '@/components/ClaimCard';
import { PressableScale } from '@/components/PressableScale';
import { RemixIcon } from '@/components/RemixIcon';
import { garages } from '@/services/mockData';
import { selectAvailableClaims, selectGarageClaims, useClaimStore } from '@/stores/claimStore';
import { radius, spacing, text, useTheme } from '@/theme';
import { TAB_BAR_SCROLL_PADDING } from '@/components/tabBarStyle';

type GarageClaimFilter = 'available' | 'accepted';
const FILTERS: readonly GarageClaimFilter[] = ['available', 'accepted'];

// Signed-in garage persona — MockData garages[0], Carrosserie Dupont.
const DUPONT_GARAGE_ID = garages[0].id;

// SwiftUI .spring(response: 0.3, dampingFraction: 0.85):
// stiffness = (2π/0.3)² ≈ 439, damping = 2·0.85·√439 ≈ 36.
const FILTER_SPRING = { mass: 1, stiffness: 439, damping: 36 } as const;

const SWITCHER_PADDING = 4;
const SWITCHER_GAP = 4;
const SEGMENT_HEIGHT = 40;

/** Swift `filterSwitcher`: tileSecondary capsule track, selected segment drawn
 *  as a screen-bg capsule with a soft shadow that springs between slots. */
function FilterSwitcher({
  selected,
  onSelect,
}: {
  selected: GarageClaimFilter;
  onSelect: (filter: GarageClaimFilter) => void;
}) {
  const { t } = useTranslation();
  const { colors, scheme } = useTheme();
  const [trackWidth, setTrackWidth] = useState(0);

  const segmentWidth =
    trackWidth > 0
      ? (trackWidth - SWITCHER_PADDING * 2 - SWITCHER_GAP * (FILTERS.length - 1)) / FILTERS.length
      : 0;
  const selectedIndex = FILTERS.indexOf(selected);

  const offset = useSharedValue(0);
  useEffect(() => {
    offset.value = withSpring(selectedIndex * (segmentWidth + SWITCHER_GAP), FILTER_SPRING);
  }, [offset, segmentWidth, selectedIndex]);
  const pillStyle = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));

  return (
    <View
      style={[styles.switcher, { backgroundColor: colors.tileSecondary }]}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
    >
      {segmentWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.switcherPill,
            scheme === 'light' && styles.switcherPillShadow,
            pillStyle,
            { width: segmentWidth, backgroundColor: colors.carlibScreenBg },
          ]}
        />
      )}
      {FILTERS.map((filter) => (
        <View key={filter} style={styles.switcherSlot}>
          <PressableScale
            scale={0.97}
            haptic="light"
            onPress={() => onSelect(filter)}
            style={styles.switcherSegment}
          >
            <Text
              style={[
                text.callout,
                { color: selected === filter ? colors.carlibDark : colors.carlibSecondary },
              ]}
            >
              {t(
                filter === 'available'
                  ? 'garageClaims.filterAvailable'
                  : 'garageClaims.filterAccepted',
              )}
            </Text>
          </PressableScale>
        </View>
      ))}
    </View>
  );
}

export default function GarageClaimsListScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<GarageClaimFilter>('available');

  const availableClaims = useClaimStore(useShallow(selectAvailableClaims));
  const garageClaims = useClaimStore(useShallow(selectGarageClaims));
  const acceptClaim = useClaimStore((s) => s.acceptClaim);
  const declineClaim = useClaimStore((s) => s.declineClaim);

  const isAvailable = filter === 'available';
  const claims = isAvailable ? availableClaims : garageClaims;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]} edges={['top']}>
      {/* Swift .navigationTitle — the tab stack hides native headers. */}
      <View style={styles.navBar}>
        <Text style={[text.largeTitle, { color: colors.carlibDark }]}>{t('garageClaims.title')}</Text>
      </View>

      <View style={styles.switcherWrap}>
        <FilterSwitcher selected={filter} onSelect={setFilter} />
      </View>

      {claims.length === 0 ? (
        // ContentUnavailableView port: icon + title + description, centered.
        <View style={styles.empty}>
          <RemixIcon
            name={isAvailable ? 'searchLine' : 'folderLine'}
            size={48}
            color={colors.carlibSecondary}
          />
          <Text style={[text.title3, styles.centered, { color: colors.carlibDark }]}>
            {t(
              isAvailable
                ? 'garageClaims.emptyAvailableTitle'
                : 'garageClaims.emptyAcceptedTitle',
            )}
          </Text>
          <Text style={[text.footnote, styles.centered, { color: colors.carlibSecondary }]}>
            {t(
              isAvailable
                ? 'garageClaims.emptyAvailableDescription'
                : 'garageClaims.emptyAcceptedDescription',
            )}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {claims.map((claim) => (
            <Pressable key={claim.id} onPress={() => router.push(`/(garage)/claims/claim/${claim.id}`)}>
              <ClaimCard
                claim={claim}
                showGarage={false}
                onPressPhoto={(index) =>
                  router.push(`/(garage)/claims/lightbox?claimId=${claim.id}&index=${index}`)
                }
                actions={
                  isAvailable
                    ? {
                        type: 'request',
                        onAccept: () => acceptClaim(claim.id, DUPONT_GARAGE_ID),
                        onDecline: () => declineClaim(claim.id),
                      }
                    : {
                        type: 'inProgress',
                        currentStatus: claim.repairStatus,
                        onUpdate: () =>
                          router.push(`/(garage)/claims/repair-status?claimId=${claim.id}`),
                      }
                }
              />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  navBar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  switcherWrap: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.sm,
  },
  switcher: {
    flexDirection: 'row',
    gap: SWITCHER_GAP,
    padding: SWITCHER_PADDING,
    borderRadius: radius.full,
  },
  switcherPill: {
    position: 'absolute',
    left: SWITCHER_PADDING,
    top: SWITCHER_PADDING,
    height: SEGMENT_HEIGHT,
    borderRadius: radius.full,
  },
  // Swift: .shadow(color: .black.opacity(0.06), radius: 6, x: 0, y: 2).
  // Light only: a 6% black shadow reads as nothing on the dark screen bg, and
  // the Android elevation just muddies the track under the pill.
  switcherPillShadow: {
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  switcherSlot: { flex: 1 },
  switcherSegment: {
    alignSelf: 'stretch',
    height: SEGMENT_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xxl,
  },
  centered: { textAlign: 'center' },
  list: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
    paddingBottom: TAB_BAR_SCROLL_PADDING,
  },
});
