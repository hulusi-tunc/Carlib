// CarouselGarageCard + ListGarageRow from GarageSearchView.swift — the two
// row treatments inside the shops bottom panel.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DummyImage } from '@/components/DummyImage';
import { RemixIcon } from '@/components/RemixIcon';
import type { Garage } from '@/models/types';
import { garageDistances } from '@/services/mockData';
import { carlibFont, text, useTheme } from '@/theme';

/** 6-digit hex token + 0–1 alpha → 8-digit hex. */
export function withAlpha(hex: string, alpha: number): string {
  const byte = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${byte}`;
}

export const CAROUSEL_CARD_HEIGHT = 118;

function distanceLabel(garageId: string): string {
  return `${(garageDistances[garageId] ?? 0).toFixed(1)} km`;
}

function AvailabilityRow({ garage }: { garage: Garage }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dotColor = garage.isAvailable ? colors.status.completed.fg : colors.status.cancelled.fg;
  return (
    <View style={styles.metaRow}>
      <View style={[styles.availabilityDot, { backgroundColor: dotColor }]} />
      <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
        {garage.isAvailable ? t('garageCard.available') : t('garageCard.unavailable')}
      </Text>
    </View>
  );
}

export interface CarouselGarageCardProps {
  garage: Garage;
  width: number;
}

export function CarouselGarageCard({ garage, width }: CarouselGarageCardProps) {
  const { colors } = useTheme();
  const neighbourhood = garage.address.split(',').pop()?.trim() ?? '';

  return (
    <View
      style={[
        styles.card,
        {
          width,
          backgroundColor: withAlpha(colors.tileSecondary, 0.6),
          borderColor: colors.carlibCardBorder,
        },
      ]}
    >
      <DummyImage kind="garage" seed={garage.id} width={90} height={90} borderRadius={12} />

      <View style={styles.cardBody}>
        <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]} numberOfLines={1}>
          {garage.name}
        </Text>
        <View style={styles.metaRow}>
          <RemixIcon name="mapPinLine" size={12} color={colors.carlibSecondary} />
          <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
            {distanceLabel(garage.id)}
          </Text>
        </View>
        <AvailabilityRow garage={garage} />
        <View style={styles.spacer} />
        <Text style={[text.footnote, { color: colors.carlibLabel }]} numberOfLines={1}>
          {neighbourhood}
        </Text>
      </View>

      <RemixIcon name="arrowRightSLine" size={18} color={colors.carlibLabel} />
    </View>
  );
}

export interface ListGarageRowProps {
  garage: Garage;
  selected: boolean;
}

export function ListGarageRow({ garage, selected }: ListGarageRowProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.row,
        selected
          ? {
              backgroundColor: withAlpha(colors.brandYellow, 0.12),
              borderColor: colors.brandYellow,
              borderWidth: 1.5,
            }
          : {
              backgroundColor: withAlpha(colors.tileSecondary, 0.6),
              borderColor: colors.carlibCardBorder,
              borderWidth: 1,
            },
      ]}
    >
      <DummyImage kind="garage" seed={garage.id} width={72} height={72} borderRadius={12} />

      <View style={styles.rowBody}>
        <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]} numberOfLines={1}>
          {garage.name}
        </Text>
        <View style={styles.metaRow}>
          <RemixIcon name="mapPinLine" size={11} color={colors.carlibSecondary} />
          <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
            {distanceLabel(garage.id)}
          </Text>
        </View>
        <Text style={[text.footnote, { color: colors.carlibSecondary }]} numberOfLines={1}>
          {garage.address}
        </Text>
        <AvailabilityRow garage={garage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 14,
    height: CAROUSEL_CARD_HEIGHT,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardBody: {
    flex: 1,
    alignSelf: 'stretch',
    gap: 6,
  },
  spacer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 12,
    borderRadius: 14,
  },
  rowBody: {
    flex: 1,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
