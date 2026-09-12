// Port of Carlib/Views/Shared/GarageCardView.swift — compact (horizontal
// carousel) and full (vertical list) variants. Additions over iOS per the
// migration plan: the full variant shows the address plus icon-only call /
// directions actions (no L10n keys exist for those labels — Swift had none).
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CarlibCard } from '@/components/CarlibCard';
import { DummyImage } from '@/components/DummyImage';
import { PressableScale } from '@/components/PressableScale';
import { RemixIcon } from '@/components/RemixIcon';
import { openMaps, openTel } from '@/lib/links';
import type { RepairSpecialty } from '@/models/enums';
import { garageFormattedPhone, type Garage } from '@/models/types';
import { isGarageBookable } from '@/lib/availability';
import { formatDistance } from '@/lib/geo';
import { distanceFromOrigin } from '@/lib/shopSearch';
import { useClaimStore } from '@/stores/claimStore';
import { useShopsUiStore } from '@/stores/shopsUiStore';
import { carlibFont, radius, spacing, text, useTheme } from '@/theme';

const SPECIALTY_KEY = {
  carrosserie: 'bodywork',
  peinture: 'painting',
  mecanique: 'mechanics',
  vitrage: 'windshield',
  detailing: 'detailing',
} as const satisfies Record<RepairSpecialty, string>;

export type GarageCardVariant = 'compact' | 'full';

export interface GarageCardProps {
  garage: Garage;
  variant?: GarageCardVariant;
  /** km override; by default the distance from the shared search origin, hidden when unknown. */
  distance?: number;
}

export function GarageCard({ garage, variant = 'full', distance }: GarageCardProps) {
  const { t } = useTranslation();
  const { colors, scheme } = useTheme();

  const origin = useShopsUiStore((s) => s.origin);
  const km = distance ?? distanceFromOrigin(origin, garage.location);
  const [now] = useState(() => new Date());
  const available = useClaimStore((s) => isGarageBookable(garage, s.timeSlots, now));
  // carlibAccent === tileSecondary in dark, so the chip would melt into the
  // card it sits on; step down to screenBg there. Light keeps the accent fill.
  const chipBg = scheme === 'dark' ? colors.carlibScreenBg : colors.carlibAccent;

  if (variant === 'compact') {
    return (
      <CarlibCard variant="elevated">
        <View style={styles.compactColumn}>
          <DummyImage
            kind="garage"
            seed={garage.id}
            width={160}
            height={90}
            borderRadius={radius.sm}
          />
          <Text style={[carlibFont(13, 'medium'), { color: colors.carlibDark }]} numberOfLines={1}>
            {garage.name}
          </Text>
          {km != null && (
            <Text style={[text.caption, { color: colors.carlibSecondary }]}>
              {formatDistance(km)}
            </Text>
          )}
        </View>
      </CarlibCard>
    );
  }

  return (
    <CarlibCard variant="flat">
      <View style={styles.fullRow}>
        <DummyImage
          kind="garage"
          seed={garage.id}
          width={80}
          height={80}
          borderRadius={radius.sm}
        />

        <View style={styles.fullInfo}>
          <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]} numberOfLines={1}>
            {garage.name}
          </Text>
          <Text style={[text.footnote, { color: colors.carlibSecondary }]} numberOfLines={1}>
            {garage.address}
          </Text>
          {km != null && (
            <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
              {formatDistance(km)}
            </Text>
          )}

          <View style={styles.chipsRow}>
            {garage.specialties.slice(0, 3).map((specialty) => (
              <View
                key={specialty}
                style={[styles.chip, { backgroundColor: chipBg }]}
              >
                <Text style={[text.caption, { color: colors.carlibDark }]}>
                  {t(`specialty.${SPECIALTY_KEY[specialty]}`)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.availabilityRow}>
            <View
              style={[
                styles.availabilityDot,
                {
                  backgroundColor: available
                    ? colors.status.completed.fg
                    : colors.status.cancelled.fg,
                },
              ]}
            />
            <Text style={[text.caption, { color: colors.carlibSecondary }]}>
              {available ? t('garageCard.available') : t('garageCard.unavailable')}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <PressableScale
            scale={0.94}
            haptic="light"
            accessibilityLabel="Call"
            onPress={() => openTel(garageFormattedPhone(garage))}
            style={[styles.actionDisc, { backgroundColor: colors.carlibScreenBg }]}
          >
            <RemixIcon name="phoneLine" size={16} color={colors.carlibDark} />
          </PressableScale>
          <PressableScale
            scale={0.94}
            haptic="light"
            accessibilityLabel="Directions"
            onPress={() => openMaps(`${garage.name}, ${garage.address}`)}
            style={[styles.actionDisc, { backgroundColor: colors.carlibScreenBg }]}
          >
            <RemixIcon name="directionLine" size={16} color={colors.carlibDark} />
          </PressableScale>
        </View>
      </View>
    </CarlibCard>
  );
}

const styles = StyleSheet.create({
  compactColumn: {
    width: 160,
    gap: spacing.xs,
  },
  fullRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: spacing.md,
  },
  fullInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.xxs,
  },
  chip: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actions: {
    justifyContent: 'center',
    gap: spacing.xs,
  },
  actionDisc: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
