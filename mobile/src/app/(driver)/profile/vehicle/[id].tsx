// Port of Carlib/Views/Driver/VehicleDetailView.swift — vehicle info rows plus
// "Set as default" (hidden when already default, success haptic) and "Delete
// vehicle" (Alert-confirmed, pops the stack). The iOS List becomes grouped
// tileSecondary cards, matching this port's other detail screens.
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CarBrandLogo } from '@/components/CarBrandLogo';
import { RemixIcon } from '@/components/RemixIcon';
import { useClaimStore } from '@/stores/claimStore';
import { carlibFont, spacing, text, useTheme } from '@/theme';

function InfoRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.infoRow}>
      <Text style={[text.body, { color: colors.carlibSecondary }]}>{label}</Text>
      <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>{value}</Text>
    </View>
  );
}

export default function VehicleDetailScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const vehicle = useClaimStore((s) => s.vehicles.find((v) => v.id === id));
  const setDefaultVehicle = useClaimStore((s) => s.setDefaultVehicle);
  const removeVehicle = useClaimStore((s) => s.removeVehicle);

  useEffect(() => {
    if (vehicle == null && router.canGoBack()) router.back();
  }, [vehicle, router]);
  if (vehicle == null) return null;

  const handleSetDefault = () => {
    setDefaultVehicle(vehicle.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete this vehicle?',
      `This will remove ${vehicle.info.brand} ${vehicle.info.model} from your garage. This action can't be undone.`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            removeVehicle(vehicle.id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]} edges={['top']}>
      {/* Inline nav bar — the profile stack hides native headers. */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
          <RemixIcon name="arrowLeftSLine" size={26} color={colors.carlibDark} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.carlibDark }]}>
          {t('vehicleDetail.title')}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Identity card ── */}
        <View style={[styles.card, styles.identityCard, { backgroundColor: `${colors.tileSecondary}80` }]}>
          <View style={[styles.logoCircle, { backgroundColor: colors.tileSecondary }]}>
            <CarBrandLogo brand={vehicle.info.brand} size={44} />
          </View>
          <View style={styles.identityText}>
            <View style={styles.nameRow}>
              <Text style={[text.title2, { color: colors.carlibDark }]}>
                {`${vehicle.info.brand} ${vehicle.info.model}`}
              </Text>
              {vehicle.isDefault && (
                <View style={[styles.defaultBadge, { backgroundColor: colors.brandYellow }]}>
                  {/* brandYellow does not adapt, so this stays literal black in both themes. */}
                  <Text style={[carlibFont(13, 'medium'), { color: '#000000' }]}>Default</Text>
                </View>
              )}
            </View>
            {vehicle.info.year != null && (
              <Text style={[text.caption, { color: colors.carlibSecondary }]}>
                {String(vehicle.info.year)}
              </Text>
            )}
          </View>
        </View>

        {/* ── Info rows ── */}
        <View style={[styles.card, { backgroundColor: `${colors.tileSecondary}80` }]}>
          <InfoRow label={t('vehicleDetail.plate')} value={vehicle.info.licensePlate} />
          <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />
          <InfoRow label={t('vehicleDetail.brand')} value={vehicle.info.brand} />
          <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />
          <InfoRow label={t('vehicleDetail.model')} value={vehicle.info.model} />
          {vehicle.info.year != null && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />
              <InfoRow label={t('vehicleDetail.year')} value={String(vehicle.info.year)} />
            </>
          )}
          <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />
          <InfoRow label={t('vehicleDetail.color')} value={vehicle.info.color} />
        </View>

        {/* ── Actions ── */}
        <View style={[styles.card, { backgroundColor: `${colors.tileSecondary}80` }]}>
          {!vehicle.isDefault && (
            <>
              <Pressable onPress={handleSetDefault} style={styles.actionRow}>
                <RemixIcon name="starLine" size={18} color={colors.brandYellow} />
                <Text style={[text.body, { color: colors.carlibDark }]}>Set as default</Text>
              </Pressable>
              <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />
            </>
          )}
          <Pressable onPress={confirmDelete} style={styles.actionRow}>
            <RemixIcon name="deleteBinLine" size={18} color={colors.destructiveRed} />
            <Text style={[text.body, { color: colors.destructiveRed }]}>Delete vehicle</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: spacing.xxs,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...carlibFont(17, 'medium'),
    flex: 1,
    textAlign: 'center',
  },
  content: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: spacing.md,
  },
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: spacing.md,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityText: { flex: 1, gap: 2 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  defaultBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingVertical: 14,
  },
  divider: { height: StyleSheet.hairlineWidth },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
  },
});
