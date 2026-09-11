// Port of GaragePlanningView.HoursEditor — one weekday's opening times and bay
// capacity. LIMITATION (documented, not an oversight): the weekly DayHours
// template is local @State in the Swift view and local React state in the
// calendar screen, and there is no store to write through, so Save closes the
// sheet without persisting. Wiring it up means introducing a schedule store,
// which is outside this route's scope.
import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { set } from 'date-fns';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CarlibButton } from '@/components/CarlibButton';
import { CarlibCard } from '@/components/CarlibCard';
import { PressableScale } from '@/components/PressableScale';
import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import { carlibFont, spacing, text, useTheme } from '@/theme';

// DateFormatter.standaloneWeekdaySymbols pinned to en_US, indexed weekday - 1
// (1 = Sunday … 7 = Saturday, the Calendar convention the calendar screen uses).
const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const MIN_BAYS = 1;
const MAX_BAYS = 20;

function parseNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return value != null && Number.isFinite(parsed) ? parsed : fallback;
}

export default function DayHoursSheet() {
  const { t } = useTranslation();
  const { colors, scheme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    weekday?: string;
    openHour?: string;
    openMinute?: string;
    closeHour?: string;
    closeMinute?: string;
    bays?: string;
  }>();

  const weekday = parseNumber(params.weekday, 2);
  // Swift anchors both pickers to today and only reads back hour + minute.
  const [openTime, setOpenTime] = useState(() =>
    set(new Date(), {
      hours: parseNumber(params.openHour, 8),
      minutes: parseNumber(params.openMinute, 0),
      seconds: 0,
      milliseconds: 0,
    }),
  );
  const [closeTime, setCloseTime] = useState(() =>
    set(new Date(), {
      hours: parseNumber(params.closeHour, 18),
      minutes: parseNumber(params.closeMinute, 0),
      seconds: 0,
      milliseconds: 0,
    }),
  );
  const [bays, setBays] = useState(() => parseNumber(params.bays, 5));

  const timeRow = (label: string, value: Date, onChange: (date: Date) => void) => (
    <View style={styles.row}>
      <Text style={[text.body, styles.spacer, { color: colors.carlibDark }]}>{label}</Text>
      <DateTimePicker
        value={value}
        onValueChange={(_event, date) => onChange(date)}
        mode="time"
        display="compact"
        presentation="inline"
        accentColor={colors.brandYellow}
        themeVariant={scheme}
        style={styles.picker}
      />
    </View>
  );

  const stepper = (icon: RemixIconName, enabled: boolean, onPress: () => void) => (
    <PressableScale
      scale={0.9}
      haptic="light"
      onPress={onPress}
      disabled={!enabled}
      style={[
        styles.stepper,
        { backgroundColor: colors.tileSecondary },
        !enabled && styles.stepperDisabled,
      ]}
    >
      <RemixIcon name={icon} size={18} color={enabled ? colors.carlibDark : colors.carlibSecondary} />
    </PressableScale>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      <Stack.Screen
        options={{
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.5],
        }}
      />

      {/* Inline nav bar — day name + leading Cancel (Swift toolbar). */}
      <View style={styles.toolbar}>
        <Text style={[carlibFont(17, 'medium'), { color: colors.carlibDark }]}>
          {WEEKDAY_NAMES[weekday - 1]}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.cancel}>
          <Text style={[carlibFont(17, 'regular'), { color: colors.carlibSecondary }]}>
            {t('common.cancel')}
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <CarlibCard style={styles.stretch}>
          {timeRow(t('garagePlanning.openTime'), openTime, setOpenTime)}
          <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />
          {timeRow(t('garagePlanning.closeTime'), closeTime, setCloseTime)}
        </CarlibCard>

        <CarlibCard style={styles.capacityCard}>
          <View style={styles.capacityText}>
            <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
              {t('garagePlanning.capacity')}
            </Text>
            <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
              {t('garagePlanning.capacityHint')}
            </Text>
          </View>

          <View style={styles.capacityRow}>
            {stepper('subtractLine', bays > MIN_BAYS, () =>
              setBays((current) => Math.max(MIN_BAYS, current - 1)),
            )}
            <Text style={[text.title2, styles.bayCount, { color: colors.carlibDark }]}>{bays}</Text>
            {stepper('addLine', bays < MAX_BAYS, () =>
              setBays((current) => Math.min(MAX_BAYS, current + 1)),
            )}
            <View style={styles.spacer} />
            <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
              {t(bays === 1 ? 'garagePlanning.bay' : 'garagePlanning.bays')}
            </Text>
          </View>
        </CarlibCard>

        <CarlibButton label={t('common.save')} onPress={() => router.back()} style={styles.save} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  spacer: { flex: 1 },
  stretch: { alignSelf: 'stretch' },
  toolbar: {
    minHeight: 44,
    marginTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: { position: 'absolute', left: spacing.screenHorizontal },
  content: {
    padding: spacing.screenHorizontal,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: 36,
  },
  picker: { width: 110, height: 36 },
  divider: {
    height: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginVertical: spacing.sm,
  },
  capacityCard: { gap: spacing.sm },
  capacityText: { gap: 2 },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: spacing.md,
  },
  bayCount: { minWidth: 48, textAlign: 'center' },
  stepper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperDisabled: { opacity: 0.5 },
  save: { marginTop: spacing.xxs },
});
