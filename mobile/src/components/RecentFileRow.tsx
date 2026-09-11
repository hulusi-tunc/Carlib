// Port of DriverHomeView.swift recentFileRow / RecentRowStatus — the compact
// Recent Files row: date column, title, two-state status pill. Every status
// except cancelled and expired reads as "completed" here, exactly as on iOS.
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/PressableScale';
import { monthDayFormatted } from '@/lib/dates';
import { ACCIDENT_KEY, type ClaimStatus } from '@/models/enums';
import type { Claim } from '@/models/types';
import { carlibFont, radius, spacing, text, useTheme } from '@/theme';

type RecentRowStatus = 'completed' | 'cancelled';

/** Swift RecentRowStatus.init — cancelled + expired collapse to cancelled, the rest to completed. */
export function recentRowStatus(status: ClaimStatus): RecentRowStatus {
  return status === 'annule' || status === 'expire' ? 'cancelled' : 'completed';
}

export interface RecentFileRowProps {
  claim: Claim;
  onPress: () => void;
}

export function RecentFileRow({ claim, onPress }: RecentFileRowProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const status = recentRowStatus(claim.status);
  const { fg, bg } = colors.status[status];
  const title =
    claim.accidentType != null
      ? t(`accidentTypeLabel.${ACCIDENT_KEY[claim.accidentType]}`)
      : t('driverHome.recentFallbackTitle');

  return (
    <PressableScale scale={0.98} haptic="light" onPress={onPress} style={styles.row}>
      <Text style={[text.footnote, styles.date, { color: colors.carlibSecondary }]}>
        {monthDayFormatted(claim.updatedAt)}
      </Text>
      <Text
        style={[carlibFont(15, 'medium'), styles.title, { color: colors.carlibDark }]}
        numberOfLines={1}
      >
        {title}
      </Text>
      <View style={[styles.pill, { backgroundColor: bg }]}>
        <View style={[styles.dot, { backgroundColor: fg }]} />
        <Text style={[text.caption, { color: fg }]}>
          {t(
            status === 'completed'
              ? 'driverHome.recentStatusCompleted'
              : 'driverHome.recentStatusCancelled',
          )}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { height: 52, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  date: { width: 72 },
  title: { flex: 1 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: 10,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
