// Port of Carlib/Views/Driver/GarageDetailView.swift — photo carousel, info
// card (tappable call / directions rows), specialty chips, slot preview and a
// bottom-pinned Book CTA. Two deliberate deltas from iOS: the coverage-radius
// row is replaced by years active (per migration plan), and the Book button is
// pinned instead of scrolling with the content.
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { CarlibButton } from '@/components/CarlibButton';
import { CarlibCard } from '@/components/CarlibCard';
import { DummyImage } from '@/components/DummyImage';
import { EmptyState } from '@/components/EmptyState';
import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import { shortFormatted, timeFormatted } from '@/lib/dates';
import { formatDistance } from '@/lib/geo';
import { openMaps, openTel } from '@/lib/links';
import { distanceFromOrigin } from '@/lib/shopSearch';
import type { RepairSpecialty } from '@/models/enums';
import { garageFormattedPhone } from '@/models/types';
import { garageYearsActive } from '@/services/mockData';
import { availableSlots, useClaimStore } from '@/stores/claimStore';
import { useShopsUiStore } from '@/stores/shopsUiStore';
import { carlibFont, radius, spacing, text, useTheme } from '@/theme';

// Raw enum values are French; en.json keys are English.
const SPECIALTY_KEY = {
  carrosserie: 'bodywork',
  peinture: 'painting',
  mecanique: 'mechanics',
  vitrage: 'windshield',
  detailing: 'detailing',
} as const satisfies Record<RepairSpecialty, string>;

const PHOTO_WIDTH = 240;

export default function GarageDetailScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const garage = useClaimStore((s) => s.garages.find((g) => g.id === id));
  // Swift prefix(4) — the horizontal preview shows the first few open slots.
  const slots = useClaimStore(useShallow(availableSlots(id ?? ''))).slice(0, 4);
  const origin = useShopsUiStore((s) => s.origin);

  if (garage == null) {
    return (
      <EmptyState
        icon="storeLine"
        title={t('garageDetail.notFoundTitle')}
        description={t('garageDetail.notFoundBody')}
      />
    );
  }

  // PROSEARCH-02: an unknown distance hides the row rather than showing 0 km.
  const km = distanceFromOrigin(origin, garage.location);
  const years = garageYearsActive[garage.id] ?? 0;

  const infoRow = (icon: RemixIconName, label: string, onPress?: () => void) => (
    <Pressable style={styles.infoRow} onPress={onPress} disabled={onPress == null}>
      <View style={styles.infoIcon}>
        <RemixIcon name={icon} size={20} color={colors.brandYellow} />
      </View>
      <Text style={[text.body, styles.infoLabel, { color: colors.carlibDark }]}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      <ScrollView
        style={styles.flex}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={[text.title1, { color: colors.carlibDark }]}>{garage.name}</Text>
          {km != null && (
            <View style={styles.distanceRow}>
              <RemixIcon name="mapPinLine" size={14} color={colors.carlibSecondary} />
              <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
                {formatDistance(km)}
              </Text>
            </View>
          )}
        </View>

        {/* ── Photos carousel ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={PHOTO_WIDTH + spacing.sm}
          decelerationRate="fast"
          contentContainerStyle={styles.photosRow}
        >
          {[0, 1, 2].map((index) => (
            <DummyImage
              key={index}
              kind="garage"
              seed={`${garage.id}-photo-${index}`}
              width={PHOTO_WIDTH}
              height={160}
              borderRadius={radius.md}
            />
          ))}
        </ScrollView>

        {/* ── Info card ── */}
        <View style={styles.cardWrap}>
          <CarlibCard variant="flat">
            <View style={styles.infoColumn}>
              {infoRow('mapPinFill', garage.address, () =>
                openMaps(`${garage.name}, ${garage.address}`),
              )}
              <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />
              {infoRow('phoneFill', garageFormattedPhone(garage), () =>
                openTel(garageFormattedPhone(garage)),
              )}
              <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />
              {/* iOS GarageProfileView hardcodes its "Active" stat label — no L10n key. */}
              {infoRow('historyLine', `${years} years active`)}
            </View>
          </CarlibCard>
        </View>

        {/* ── Specialties ── */}
        <View style={styles.subsection}>
          <Text style={[text.title3, styles.sectionTitle, { color: colors.carlibDark }]}>
            {t('garageDetail.sectionSpecialties')}
          </Text>
          <View style={styles.chipsWrap}>
            {garage.specialties.map((specialty) => (
              <View
                key={specialty}
                style={[styles.specialtyChip, { backgroundColor: colors.brandYellowLight }]}
              >
                <Text style={[carlibFont(13, 'medium'), { color: colors.carlibDark }]}>
                  {t(`specialty.${SPECIALTY_KEY[specialty]}`)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Available slots preview ── */}
        <View style={styles.subsection}>
          <Text style={[text.title3, styles.sectionTitle, { color: colors.carlibDark }]}>
            {t('garageDetail.sectionSlots')}
          </Text>
          {slots.length === 0 ? (
            <Text style={[text.footnote, styles.sectionTitle, { color: colors.carlibSecondary }]}>
              {t('booking.noSlots')}
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.slotsRow}
            >
              {slots.map((slot) => (
                <View key={slot.id} style={[styles.slotChip, { backgroundColor: colors.tileSecondary }]}>
                  <Text style={[text.caption, { color: colors.carlibDark }]}>
                    {shortFormatted(slot.date)}
                  </Text>
                  <Text style={[carlibFont(13, 'medium'), { color: colors.carlibDark }]}>
                    {`${timeFormatted(slot.startTime)} — ${timeFormatted(slot.endTime)}`}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* ── Bottom-pinned CTA ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <CarlibButton
          label={t('garageDetail.ctaBook')}
          icon="calendarEventLine"
          onPress={() => router.push(`/shops/garage/booking?garageId=${garage.id}`)}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  content: {
    gap: spacing.sectionSpacing,
    paddingBottom: spacing.xl,
  },
  header: {
    gap: spacing.xs,
    paddingHorizontal: spacing.screenHorizontal,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  photosRow: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
  },
  cardWrap: { paddingHorizontal: spacing.screenHorizontal },
  infoColumn: {
    alignSelf: 'stretch',
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoIcon: {
    width: 28,
    alignItems: 'center',
  },
  infoLabel: { flex: 1 },
  divider: { height: StyleSheet.hairlineWidth },
  subsection: { gap: spacing.sm },
  sectionTitle: { paddingHorizontal: spacing.screenHorizontal },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.screenHorizontal,
  },
  specialtyChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  slotsRow: {
    gap: spacing.xs,
    paddingHorizontal: spacing.screenHorizontal,
  },
  slotChip: {
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  footer: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
  },
});
