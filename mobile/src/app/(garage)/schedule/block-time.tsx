// Port of GaragePlanningView.blockTimeSheet — marks part (or all) of a day
// unavailable by writing a blocked TimeSlot. The reason chips are presentation
// only: Swift never stores the BlockReason on the slot, and TimeSlot has no
// field for it. The day's opening hours arrive as params because the weekly
// template lives in the calendar screen's local state (as in Swift's @State).
import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { set, startOfDay } from 'date-fns';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CarlibButton } from '@/components/CarlibButton';
import { CarlibCard } from '@/components/CarlibCard';
import { PressableScale } from '@/components/PressableScale';
import { longFormatted } from '@/lib/dates';
import { useClaimStore } from '@/stores/claimStore';
import { carlibFont, radius, spacing, text, useTheme } from '@/theme';

// Signed-in garage persona: MockData garages[0] — Carrosserie Dupont.
const GARAGE_ID = '00000001-0000-0000-0000-000000000001';

const BLOCK_REASONS = [
  { id: 'lunch', key: 'garagePlanning.blockReasonLunch' },
  { id: 'vacation', key: 'garagePlanning.blockReasonVacation' },
  { id: 'training', key: 'garagePlanning.blockReasonTraining' },
  { id: 'maintenance', key: 'garagePlanning.blockReasonMaintenance' },
  { id: 'other', key: 'garagePlanning.blockReasonOther' },
] as const;

type BlockReason = (typeof BLOCK_REASONS)[number]['id'];

function randomId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const r = (Math.random() * 16) | 0;
    const v = char === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function parseHour(value: string | undefined, fallback: number): number {
  const hour = Number(value);
  return value != null && Number.isFinite(hour) ? hour : fallback;
}

export default function BlockTimeSheet() {
  const { t } = useTranslation();
  const { colors, scheme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string; openHour?: string; closeHour?: string }>();
  const addTimeSlot = useClaimStore((s) => s.addTimeSlot);

  const day = useMemo(() => {
    const ms = Number(params.date);
    return params.date != null && Number.isFinite(ms) ? new Date(ms) : startOfDay(new Date());
  }, [params.date]);

  // Swift falls back to 0…23 when the day has no hours entry.
  const openHour = parseHour(params.openHour, 0);
  const closeHour = parseHour(params.closeHour, 23);

  const [allDay, setAllDay] = useState(false);
  const [reason, setReason] = useState<BlockReason>('lunch');
  // Swift prepareBlockTime: 12:00 → 13:00 on the selected day.
  const [startTime, setStartTime] = useState(() =>
    set(day, { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 }),
  );
  const [endTime, setEndTime] = useState(() =>
    set(day, { hours: 13, minutes: 0, seconds: 0, milliseconds: 0 }),
  );

  const save = () => {
    const start = allDay
      ? set(day, { hours: openHour, minutes: 0, seconds: 0, milliseconds: 0 })
      : startTime;
    const end = allDay
      ? set(day, { hours: closeHour, minutes: 0, seconds: 0, milliseconds: 0 })
      : endTime;
    addTimeSlot({
      id: randomId(),
      garageId: GARAGE_ID,
      date: day,
      startTime: start,
      endTime: end,
      isAvailable: false,
      isBlocked: true,
    });
    router.back();
  };

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

  const divider = <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />;

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      <Stack.Screen
        options={{
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.5, 1],
        }}
      />

      {/* Inline nav bar — centered title + leading Cancel (Swift toolbar). */}
      <View style={styles.toolbar}>
        <Text style={[carlibFont(17, 'medium'), { color: colors.carlibDark }]}>
          {t('garagePlanning.blockTimeTitle')}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.cancel}>
          <Text style={[carlibFont(17, 'regular'), { color: colors.carlibSecondary }]}>
            {t('common.cancel')}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <CarlibCard style={styles.dateCard}>
          <Text style={[text.caption, { color: colors.carlibLabel }]}>
            {t('garagePlanning.addDate')}
          </Text>
          <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
            {longFormatted(day)}
          </Text>
        </CarlibCard>

        <CarlibCard style={styles.stretch}>
          <View style={styles.row}>
            <Text style={[text.body, styles.spacer, { color: colors.carlibDark }]}>
              {t('garagePlanning.blockAllDay')}
            </Text>
            <Switch
              value={allDay}
              onValueChange={setAllDay}
              // Off track must follow the app theme, not the OS appearance.
              trackColor={{ false: colors.carlibCardBorder, true: colors.brandYellow }}
            />
          </View>
          {!allDay && (
            <>
              {divider}
              {timeRow(t('garagePlanning.addStart'), startTime, setStartTime)}
              {divider}
              {timeRow(t('garagePlanning.addEnd'), endTime, setEndTime)}
            </>
          )}
        </CarlibCard>

        <CarlibCard style={styles.reasonCard}>
          <Text style={[text.caption, { color: colors.carlibLabel }]}>
            {t('garagePlanning.blockReason')}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.stretch}
            contentContainerStyle={styles.reasonRow}
          >
            {BLOCK_REASONS.map((option) => {
              const selected = reason === option.id;
              return (
                <PressableScale
                  key={option.id}
                  scale={0.95}
                  haptic="light"
                  onPress={() => setReason(option.id)}
                  style={[
                    styles.reasonChip,
                    { backgroundColor: selected ? colors.carlibDark : colors.carlibCardBorder },
                  ]}
                >
                  <Text
                    style={[
                      carlibFont(13, 'medium'),
                      { color: selected ? colors.carlibScreenBg : colors.carlibDark },
                    ]}
                  >
                    {t(option.key)}
                  </Text>
                </PressableScale>
              );
            })}
          </ScrollView>
        </CarlibCard>

        <CarlibButton label={t('common.save')} onPress={save} style={styles.save} />
      </ScrollView>
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
  dateCard: { gap: spacing.xxs },
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
  reasonCard: { gap: spacing.sm },
  reasonRow: { gap: spacing.xxs },
  reasonChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },
  save: { marginTop: spacing.xxs },
});
