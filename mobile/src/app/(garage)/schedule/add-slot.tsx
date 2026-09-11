// Port of GaragePlanningView.addSlotSheet — new appointment on the selected
// day. Swift builds the slot with isAvailable: false / isBlocked: false, so the
// shop's own bookings never surface in the driver-facing availability list.
// The selected day (and, when rescheduling, the original times) arrive as
// epoch-ms query params from the calendar.
import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { set, startOfDay } from 'date-fns';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CarlibButton } from '@/components/CarlibButton';
import { CarlibCard } from '@/components/CarlibCard';
import { longFormatted } from '@/lib/dates';
import { useClaimStore } from '@/stores/claimStore';
import { carlibFont, spacing, text, useTheme } from '@/theme';

// Signed-in garage persona: MockData garages[0] — Carrosserie Dupont.
const GARAGE_ID = '00000001-0000-0000-0000-000000000001';

function randomId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const r = (Math.random() * 16) | 0;
    const v = char === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function parseDate(value: string | undefined, fallback: Date): Date {
  const ms = Number(value);
  return value != null && Number.isFinite(ms) ? new Date(ms) : fallback;
}

export default function AddSlotSheet() {
  const { t } = useTranslation();
  const { colors, scheme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string; start?: string; end?: string }>();
  const addTimeSlot = useClaimStore((s) => s.addTimeSlot);

  const day = useMemo(() => parseDate(params.date, startOfDay(new Date())), [params.date]);
  // Swift prepareNewSlot: 09:00 → 10:00 on the selected day.
  const [startTime, setStartTime] = useState(() =>
    parseDate(params.start, set(day, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 })),
  );
  const [endTime, setEndTime] = useState(() =>
    parseDate(params.end, set(day, { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 })),
  );

  const save = () => {
    addTimeSlot({
      id: randomId(),
      garageId: GARAGE_ID,
      date: day,
      startTime,
      endTime,
      isAvailable: false,
      isBlocked: false,
    });
    router.back();
  };

  const timeRow = (label: string, value: Date, onChange: (date: Date) => void) => (
    <View style={styles.timeRow}>
      <Text style={[text.body, styles.spacer, { color: colors.carlibDark }]}>{label}</Text>
      {/* 'compact' is the iOS style SwiftUI's .hourAndMinute DatePicker uses in
          a row; Android falls back to its default clock presentation. */}
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

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      <Stack.Screen
        options={{
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.5],
        }}
      />

      {/* Inline nav bar — centered title + leading Cancel (Swift toolbar). */}
      <View style={styles.toolbar}>
        <Text style={[carlibFont(17, 'medium'), { color: colors.carlibDark }]}>
          {t('garagePlanning.addTitle')}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.cancel}>
          <Text style={[carlibFont(17, 'regular'), { color: colors.carlibSecondary }]}>
            {t('common.cancel')}
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <CarlibCard style={styles.dateCard}>
          <Text style={[text.caption, { color: colors.carlibLabel }]}>
            {t('garagePlanning.addDate')}
          </Text>
          <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
            {longFormatted(day)}
          </Text>
        </CarlibCard>

        <CarlibCard style={styles.timesCard}>
          {timeRow(t('garagePlanning.addStart'), startTime, setStartTime)}
          <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />
          {timeRow(t('garagePlanning.addEnd'), endTime, setEndTime)}
        </CarlibCard>

        <CarlibButton label={t('common.save')} onPress={save} style={styles.save} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  spacer: { flex: 1 },
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
  dateCard: { gap: spacing.sm },
  timesCard: { alignSelf: 'stretch' },
  timeRow: {
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
  save: { marginTop: spacing.xxs },
});
