// Port of Carlib/Views/Shared/RepairStatusSheet.swift — a "Next step" card that
// advances one stage, plus a radio timeline to jump anywhere. Swift presented it
// as a .sheet owned by the row; here it is a formSheet route keyed by claimId.
// All copy is Text(verbatim:) on iOS, so it stays hardcoded (stage names and
// Cancel are the localized pieces).
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CarlibButton } from '@/components/CarlibButton';
import { Glass } from '@/components/Glass';
import { PressableScale } from '@/components/PressableScale';
import { RemixIcon } from '@/components/RemixIcon';
import { REPAIR_STATUSES, type RepairStatus } from '@/models/enums';
import { useClaimStore } from '@/stores/claimStore';
import { carlibFont, radius, spacing, text, useTheme } from '@/theme';

const REPAIR_KEY = {
  diagnostic: 'diagnostic',
  attente_pieces: 'waitingParts',
  en_cours: 'repairing',
  controle: 'qualityCheck',
  pret: 'ready',
} as const satisfies Record<RepairStatus, string>;

// Swift `description(for:)` — hardcoded, not L10n.
const STAGE_DESCRIPTION: Record<RepairStatus, string> = {
  diagnostic: 'Assessing the damage and preparing the estimate.',
  attente_pieces: 'Parts ordered — work resumes on arrival.',
  en_cours: 'Bodywork and paint in progress.',
  controle: 'Final inspection before handover.',
  pret: 'Vehicle washed and ready for the driver.',
};

// Swift `nextStage`: no current stage means the pipeline hasn't started;
// the last stage has nowhere left to advance.
function nextStage(current: RepairStatus | undefined): RepairStatus | undefined {
  if (current == null) return 'diagnostic';
  const index = REPAIR_STATUSES.indexOf(current);
  if (index < 0 || index >= REPAIR_STATUSES.length - 1) return undefined;
  return REPAIR_STATUSES[index + 1];
}

function StageRow({
  status,
  isLast,
  isSelected,
  isCurrent,
  onPress,
}: {
  status: RepairStatus;
  isLast: boolean;
  isSelected: boolean;
  isCurrent: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <PressableScale
      scale={0.98}
      haptic="light"
      onPress={onPress}
      style={[styles.stageRow, isSelected && { backgroundColor: `${colors.brandYellow}14` }]}
    >
      <View style={styles.stageRail}>
        <View
          style={[
            styles.stageCircle,
            { borderColor: isSelected ? colors.brandYellow : colors.carlibCardBorder },
          ]}
        >
          {isSelected && <View style={[styles.stageDot, { backgroundColor: colors.brandYellow }]} />}
        </View>
        {!isLast && (
          <View style={[styles.stageConnector, { backgroundColor: colors.carlibCardBorder }]} />
        )}
      </View>

      <View style={styles.stageText}>
        <View style={styles.stageTitleRow}>
          <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
            {t(`repairStatusLabel.${REPAIR_KEY[status]}`)}
          </Text>
          {isCurrent && (
            <View style={[styles.currentPill, { backgroundColor: colors.tileSecondary }]}>
              <Text style={[text.caption, { color: colors.carlibSecondary }]}>Current</Text>
            </View>
          )}
        </View>
        <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
          {STAGE_DESCRIPTION[status]}
        </Text>
      </View>

      <RemixIcon
        name="arrowRightSLine"
        size={18}
        color={isSelected ? colors.brandYellow : `${colors.carlibLabel}80`}
      />
    </PressableScale>
  );
}

export default function RepairStatusSheetRoute() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { claimId } = useLocalSearchParams<{ claimId: string }>();

  const claim = useClaimStore((s) => s.claims.find((c) => c.id === claimId));
  const updateRepairStatus = useClaimStore((s) => s.updateRepairStatus);
  const currentStatus = claim?.repairStatus;

  const [selection, setSelection] = useState<RepairStatus>(currentStatus ?? 'diagnostic');
  const [userPickedStage, setUserPickedStage] = useState(false);

  useEffect(() => {
    if (claim == null && router.canGoBack()) router.back();
  }, [claim, router]);
  if (claim == null) return null;

  const next = nextStage(currentStatus);
  const showSave = userPickedStage && selection !== currentStatus;

  const commit = (status: RepairStatus) => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateRepairStatus(claim.id, status);
    router.back();
  };

  const pickStage = (status: RepairStatus) => {
    if (selection !== status) void Haptics.selectionAsync();
    setSelection(status);
    setUserPickedStage(true);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      <Stack.Screen
        options={{
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.5, 1],
        }}
      />

      {/* Inline nav bar — Cancel + inline title (Swift toolbar). */}
      <View style={styles.toolbar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.toolbarSide}>
          <Text style={[carlibFont(17, 'regular'), { color: colors.carlibSecondary }]}>
            {t('common.cancel')}
          </Text>
        </Pressable>
        <Text style={[carlibFont(17, 'medium'), styles.toolbarTitle, { color: colors.carlibDark }]}>
          Update status
        </Text>
        <View style={styles.toolbarSide} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          // Swift's safeAreaInset reserved this space for us.
          { paddingBottom: 28 + (showSave ? 80 + insets.bottom : 0) },
        ]}
      >
        <View style={styles.header}>
          <Text style={[text.title1, { color: colors.carlibDark }]}>Where are you?</Text>
          <Text style={[text.body, { color: colors.carlibSecondary }]}>
            Tap to advance — the driver gets notified instantly.
          </Text>
        </View>

        {/* ── Next step (primary CTA) ── */}
        {next != null && (
          <PressableScale
            scale={0.98}
            haptic="medium"
            onPress={() => commit(next)}
            style={[
              styles.nextCard,
              { backgroundColor: colors.tileSecondary, borderColor: `${colors.brandYellow}59` },
            ]}
          >
            <View style={styles.nextKicker}>
              <RemixIcon name="arrowRightCircleFill" size={14} color={colors.brandYellow} />
              <Text style={[styles.kicker, { color: colors.brandYellow }]}>NEXT STEP</Text>
            </View>

            <View style={styles.nextTitleBlock}>
              <Text style={[text.sectionProminent, { color: colors.carlibDark }]}>
                {`Move to ${t(`repairStatusLabel.${REPAIR_KEY[next]}`)}`}
              </Text>
              <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
                {STAGE_DESCRIPTION[next]}
              </Text>
            </View>

            <View style={[styles.advanceButton, { backgroundColor: colors.brandYellow }]}>
              <Text style={[carlibFont(15, 'medium'), styles.onYellow]}>Advance</Text>
              <RemixIcon name="arrowRightLine" size={16} color="#000000" />
            </View>
          </PressableScale>
        )}

        {/* ── Stage list (secondary) ── */}
        <Text style={[styles.kicker, styles.sectionLabel, { color: colors.carlibSecondary }]}>
          {next == null ? 'PICK A STAGE' : 'OR JUMP TO ANOTHER STAGE'}
        </Text>

        <View style={styles.stageList}>
          {REPAIR_STATUSES.map((status, index) => (
            <StageRow
              key={status}
              status={status}
              isLast={index === REPAIR_STATUSES.length - 1}
              isSelected={selection === status}
              isCurrent={currentStatus === status}
              onPress={() => pickStage(status)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Save bar — Swift safeAreaInset over .ultraThinMaterial. */}
      {showSave && (
        // Translate only: an opacity fade on a glass view's parent kills the effect.
        <Animated.View
          entering={SlideInDown.springify()}
          exiting={SlideOutDown}
          style={styles.saveBar}
        >
          <Glass
            borderRadius={0}
            fallbackStyle={{ borderWidth: 0, backgroundColor: colors.carlibScreenBg }}
          >
            <View style={[styles.saveBarInner, { paddingBottom: spacing.md + insets.bottom }]}>
              <CarlibButton label="Save update" onPress={() => commit(selection)} />
            </View>
          </Glass>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: spacing.lg,
  },
  toolbarSide: { width: 72 },
  toolbarTitle: {
    flex: 1,
    textAlign: 'center',
  },
  content: { paddingTop: spacing.xs },

  header: {
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  kicker: {
    ...carlibFont(13, 'medium'),
    letterSpacing: 1.2,
  },
  sectionLabel: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },

  // Next step card
  nextCard: {
    gap: 14,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: 18,
    borderWidth: 1,
  },
  nextKicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  nextTitleBlock: { gap: 6 },
  advanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    borderRadius: radius.full,
  },
  onYellow: { color: '#000000' },

  // Stage list
  stageList: { paddingHorizontal: spacing.lg },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  stageRail: {
    width: 26,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  stageCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  stageConnector: {
    width: 2,
    flex: 1,
    minHeight: spacing.lg,
  },
  stageText: { flex: 1, gap: 2 },
  stageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  currentPill: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radius.full,
  },

  // Save bar
  saveBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  saveBarInner: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
});
