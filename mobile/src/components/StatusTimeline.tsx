// Port of Carlib/Views/Shared/StatusTimelineView.swift — horizontal 5-step
// progress stepper (Uber/delivery-style claim tracking). The rendered short
// labels are verbatim in Swift too; the full claimStatusLabel L10n strings
// (never rendered on iOS either) become accessibility labels here.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { RemixIcon } from '@/components/RemixIcon';
import { shortFormatted } from '@/lib/dates';
import { CLAIM_STAGE_INDEX } from '@/models/enums';
import type { Claim } from '@/models/types';
import { carlibFont, useTheme } from '@/theme';

type StepState = 'completed' | 'current' | 'upcoming';

const STEPS = [
  { labelKey: 'submitted', short: 'Sent' },
  { labelKey: 'matched', short: 'Matched' },
  { labelKey: 'accepted', short: 'Accepted' },
  { labelKey: 'repairing', short: 'Repair' },
  { labelKey: 'completed', short: 'Done' },
] as const;

export interface StatusTimelineProps {
  claim: Claim;
}

export function StatusTimeline({ claim }: StatusTimelineProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  // Stage 1-5 → step index 0-4; cancelled/expired (stage 0) pin to step 0,
  // matching the Swift `?? 0` fallback.
  const currentIndex = Math.max(CLAIM_STAGE_INDEX[claim.status] - 1, 0);

  const stateFor = (index: number): StepState => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'upcoming';
  };

  const renderDot = (state: StepState) => {
    switch (state) {
      case 'completed':
        return (
          <View style={[styles.completedDot, { backgroundColor: colors.status.completed.fg }]}>
            {/* Green dot fill is identical in both schemes → check stays white. */}
            <RemixIcon name="checkLine" size={12} color="#FFFFFF" />
          </View>
        );
      case 'current':
        return (
          <View style={[styles.currentHalo, { backgroundColor: `${colors.brandYellow}33` }]}>
            <View style={[styles.currentDot, { backgroundColor: colors.brandYellow }]} />
          </View>
        );
      case 'upcoming':
        return <View style={[styles.upcomingDot, { backgroundColor: colors.carlibCardBorder }]} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dotsRow}>
        {STEPS.map((step, index) => (
          <React.Fragment key={step.labelKey}>
            {renderDot(stateFor(index))}
            {index < STEPS.length - 1 && (
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor:
                      stateFor(index) === 'completed'
                        ? colors.status.completed.fg
                        : colors.carlibCardBorder,
                  },
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>

      <View style={styles.labelsRow}>
        {STEPS.map((step, index) => {
          const state = stateFor(index);
          return (
            <View
              key={step.labelKey}
              style={styles.labelColumn}
              accessibilityLabel={t(`claimStatusLabel.${step.labelKey}`)}
            >
              <Text
                style={[
                  carlibFont(13, state === 'current' ? 'medium' : 'regular'),
                  { color: state === 'upcoming' ? colors.carlibLabel : colors.carlibDark },
                ]}
              >
                {step.short}
              </Text>
              {index <= currentIndex && (
                <Text style={[carlibFont(10, 'regular'), { color: colors.carlibSecondary }]}>
                  {shortFormatted(claim.updatedAt)}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12, alignSelf: 'stretch' },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: { flex: 1, height: 2 },
  completedDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentHalo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentDot: { width: 16, height: 16, borderRadius: 8 },
  upcomingDot: { width: 14, height: 14, borderRadius: 7 },
  labelsRow: { flexDirection: 'row' },
  labelColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
});
