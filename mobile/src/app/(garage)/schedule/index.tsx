// Port of Carlib/Views/Garage/GaragePlanningView.swift — the shop's schedule:
// a Calendar/Hours capsule switcher over the signed-in garage's slots. The four
// Swift sheets are routes here (add-slot, block-time, hours, slot/[id]).
// The weekly DayHours template stays in local React state, exactly as the Swift
// keeps it in @State — nothing writes it to claimStore.
import { addDays, getDay, isSameDay, startOfDay, startOfWeek, format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { CarlibButton } from '@/components/CarlibButton';
import { CarlibCard } from '@/components/CarlibCard';
import { PressableScale } from '@/components/PressableScale';
import { RemixIcon } from '@/components/RemixIcon';
import { longFormatted, shortFormatted, timeFormatted } from '@/lib/dates';
import type { Claim, TimeSlot } from '@/models/types';
import { slotsForDate, useClaimStore } from '@/stores/claimStore';
import { TAB_BAR_SCROLL_PADDING } from '@/components/tabBarStyle';
import {
  carlibFont,
  radius,
  sectionHeaderText,
  spacing,
  text,
  useTheme,
  type ColorTokens,
} from '@/theme';

// Signed-in garage persona: MockData garages[0] — Carrosserie Dupont.
// (The Swift reads every garage's slots here; scoping to the signed-in shop is
// the only reading that makes sense for a shop-facing planner.)
const GARAGE_ID = '00000001-0000-0000-0000-000000000001';

type Mode = 'calendar' | 'hours';
type Density = 'closed' | 'open' | 'light' | 'busy' | 'full';

/** Swift DayHours — weekday follows Calendar: 1 = Sunday … 7 = Saturday. */
interface DayHours {
  weekday: number;
  isOpen: boolean;
  openHour: number;
  openMinute: number;
  closeHour: number;
  closeMinute: number;
  bays: number;
}

// DayHours.defaultWeek, already in the Monday-first order Swift sorts into.
const DEFAULT_WEEK: readonly DayHours[] = [
  { weekday: 2, isOpen: true, openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0, bays: 5 },
  { weekday: 3, isOpen: true, openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0, bays: 5 },
  { weekday: 4, isOpen: true, openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0, bays: 5 },
  { weekday: 5, isOpen: true, openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0, bays: 5 },
  { weekday: 6, isOpen: true, openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0, bays: 4 },
  { weekday: 7, isOpen: true, openHour: 9, openMinute: 0, closeHour: 13, closeMinute: 0, bays: 2 },
  { weekday: 1, isOpen: false, openHour: 0, openMinute: 0, closeHour: 0, closeMinute: 0, bays: 0 },
];

// DateFormatter.standaloneWeekdaySymbols pinned to en_US, indexed weekday - 1.
const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// SwiftUI .spring(response:dampingFraction:) → stiffness = (2π/response)²,
// damping = 2 · fraction · √stiffness.
const MODE_SPRING = { mass: 1, stiffness: 438, damping: 36 } as const; // 0.3 / 0.85
const BAR_SPRING = { mass: 1, stiffness: 247, damping: 27 } as const; // 0.4 / 0.85

const SLOT_TIME_WIDTH = 64;
const WEEK_CELL_HEIGHT = 72;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function hoursLabel(day: DayHours): string {
  return `${pad(day.openHour)}:${pad(day.openMinute)} – ${pad(day.closeHour)}:${pad(day.closeMinute)}`;
}

function hoursFor(week: readonly DayHours[], date: Date): DayHours | undefined {
  return week.find((day) => day.weekday === getDay(date) + 1);
}

function densityColor(density: Density, colors: ColorTokens): string {
  switch (density) {
    case 'closed':
      return colors.carlibCardBorder;
    case 'open':
      // Swift: .carlibSecondary.opacity(0.4)
      return `${colors.carlibSecondary}66`;
    case 'light':
      return colors.status.completed.fg;
    case 'busy':
      return colors.status.matched.fg;
    case 'full':
      return colors.status.cancelled.fg;
  }
}

function ModeSwitcher({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [trackWidth, setTrackWidth] = useState(0);
  const segment = trackWidth > 0 ? (trackWidth - spacing.xxs * 2) / 2 : 0;
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withSpring(mode === 'calendar' ? 0 : segment, MODE_SPRING);
  }, [mode, segment, offset]);

  const pillStyle = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));

  return (
    <View
      style={[styles.modeTrack, { backgroundColor: colors.tileSecondary }]}
      onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
    >
      {segment > 0 && (
        <Animated.View
          style={[
            styles.modePill,
            styles.modePillShadow,
            pillStyle,
            { width: segment, backgroundColor: colors.carlibScreenBg },
          ]}
        />
      )}
      {(['calendar', 'hours'] as const).map((value) => (
        <PressableScale
          key={value}
          scale={0.97}
          haptic="light"
          onPress={() => onChange(value)}
          style={styles.modeSegment}
        >
          <Text
            style={[
              text.callout,
              { color: mode === value ? colors.carlibDark : colors.carlibSecondary },
            ]}
          >
            {value === 'calendar' ? t('garagePlanning.modeCalendar') : t('garagePlanning.modeHours')}
          </Text>
        </PressableScale>
      ))}
    </View>
  );
}

function CapacityBar({ progress, full }: { progress: number; full: boolean }) {
  const { colors } = useTheme();
  const [trackWidth, setTrackWidth] = useState(0);
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withSpring(trackWidth * progress, BAR_SPRING);
  }, [progress, trackWidth, width]);

  const fillStyle = useAnimatedStyle(() => ({ width: width.value }));

  return (
    <View
      style={[styles.barTrack, { backgroundColor: colors.carlibCardBorder }]}
      onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
    >
      <Animated.View
        style={[
          styles.barFill,
          fillStyle,
          { backgroundColor: full ? colors.status.cancelled.fg : colors.brandYellow },
        ]}
      />
    </View>
  );
}

function WeekDayCell({
  date,
  isSelected,
  density,
  onPress,
}: {
  date: Date;
  isSelected: boolean;
  density: Density;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <PressableScale
      scale={0.94}
      haptic="light"
      onPress={onPress}
      style={[
        styles.weekCell,
        { backgroundColor: isSelected ? colors.brandYellow : colors.tileSecondary },
      ]}
    >
      {/* Selected cell is a brandYellow fill — a non-adapting surface, so its
          labels stay explicitly black instead of following carlibDark. */}
      <Text
        style={[
          text.caption,
          { color: isSelected ? '#000000' : colors.carlibSecondary },
        ]}
      >
        {format(date, 'EEEEE', { locale: enUS })}
      </Text>
      <Text style={[text.title3, { color: isSelected ? '#000000' : colors.carlibDark }]}>
        {format(date, 'd')}
      </Text>
      <View style={[styles.densityDot, { backgroundColor: densityColor(density, colors) }]} />
    </PressableScale>
  );
}

function SlotRow({
  slot,
  claim,
  onPress,
}: {
  slot: TimeSlot;
  claim: Claim | undefined;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const kindColor = slot.isBlocked ? colors.status.cancelled.fg : colors.status.inProgress.fg;

  const driverName = claim?.driverName ?? '';
  const primary = slot.isBlocked
    ? t('garagePlanning.blocked')
    : driverName !== ''
      ? driverName
      : t('garagePlanning.walkInTitle');

  const vehicle = claim?.vehicleInfo;
  const secondary = slot.isBlocked
    ? t('garagePlanning.blockedSubtitle')
    : vehicle != null
      ? `${vehicle.brand} ${vehicle.model} · ${vehicle.licensePlate}`
      : t('garagePlanning.walkInSubtitle');

  return (
    <PressableScale scale={0.98} haptic="light" onPress={onPress}>
      <CarlibCard style={styles.slotCard}>
        <View style={styles.slotTimes}>
          <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
            {timeFormatted(slot.startTime)}
          </Text>
          <Text style={[text.caption, { color: colors.carlibSecondary }]}>
            {timeFormatted(slot.endTime)}
          </Text>
        </View>

        {/* Swift: kind color at 60% opacity. */}
        <View style={[styles.slotBar, { backgroundColor: `${kindColor}99` }]} />

        <View style={styles.slotLabels}>
          <RemixIcon name={slot.isBlocked ? 'forbidLine' : 'carFill'} size={14} color={kindColor} />
          <View style={styles.slotLabelStack}>
            <Text
              numberOfLines={1}
              style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}
            >
              {primary}
            </Text>
            <Text numberOfLines={1} style={[text.footnote, { color: colors.carlibSecondary }]}>
              {secondary}
            </Text>
          </View>
        </View>

        <RemixIcon name="arrowRightSLine" size={16} color={colors.carlibSecondary} />
      </CarlibCard>
    </PressableScale>
  );
}

function DayHoursRow({
  day,
  onToggle,
  onPress,
}: {
  day: DayHours;
  onToggle: () => void;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    // Swift disables the whole row when closed; the Switch stays live here so a
    // closed day can be reopened (SwiftUI's .disabled would trap it shut).
    <PressableScale scale={0.98} haptic="light" onPress={onPress} disabled={!day.isOpen}>
      <CarlibCard style={styles.dayRow}>
        <View style={styles.dayRowText}>
          <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
            {WEEKDAY_NAMES[day.weekday - 1]}
          </Text>
          {day.isOpen ? (
            <View style={styles.dayRowMeta}>
              <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
                {hoursLabel(day)}
              </Text>
              <View style={[styles.metaDot, { backgroundColor: colors.carlibSecondary }]} />
              <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
                {`${day.bays} ${t(day.bays === 1 ? 'garagePlanning.bay' : 'garagePlanning.bays')}`}
              </Text>
            </View>
          ) : (
            <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
              {t('garagePlanning.closed')}
            </Text>
          )}
        </View>

        <Switch
          value={day.isOpen}
          onValueChange={onToggle}
          // Off track must follow the app theme, not the OS appearance.
          trackColor={{ false: colors.carlibCardBorder, true: colors.brandYellow }}
        />
        <RemixIcon
          name="arrowRightSLine"
          size={18}
          color={colors.carlibSecondary}
          style={{ opacity: day.isOpen ? 1 : 0 }}
        />
      </CarlibCard>
    </PressableScale>
  );
}

export default function GarageScheduleScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>('calendar');
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [week, setWeek] = useState<readonly DayHours[]>(DEFAULT_WEEK);

  const daySlots = useClaimStore(useShallow(slotsForDate(selectedDate, GARAGE_ID)));
  const allSlots = useClaimStore(useShallow((s) => s.timeSlots));
  const claims = useClaimStore(useShallow((s) => s.claims));

  const slots = useMemo(
    () => [...daySlots].sort((a, b) => a.startTime.getTime() - b.startTime.getTime()),
    [daySlots],
  );
  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
    [weekStart],
  );

  const dayHours = hoursFor(week, selectedDate);
  const isClosed = dayHours?.isOpen !== true;
  const total = dayHours?.isOpen === true ? dayHours.bays : 0;
  const booked = slots.filter((slot) => !slot.isBlocked).length;
  const progress = total > 0 ? Math.min(booked / total, 1) : 0;
  const isToday = isSameDay(selectedDate, new Date());

  const density = (date: Date): Density => {
    const day = hoursFor(week, date);
    if (day == null || !day.isOpen) return 'closed';
    if (day.bays <= 0) return 'open';
    const count = allSlots.filter(
      (slot) => slot.garageId === GARAGE_ID && isSameDay(slot.date, date),
    ).length;
    const ratio = count / day.bays;
    if (ratio >= 1) return 'full';
    if (ratio >= 0.5) return 'busy';
    if (ratio > 0) return 'light';
    return 'open';
  };

  const openAddSlot = () =>
    router.push(`/(garage)/schedule/add-slot?date=${selectedDate.getTime()}`);

  const openBlockTime = () =>
    router.push(
      `/(garage)/schedule/block-time?date=${selectedDate.getTime()}` +
        `&openHour=${dayHours?.openHour ?? 0}&closeHour=${dayHours?.closeHour ?? 23}`,
    );

  const openDayHours = (day: DayHours) =>
    router.push(
      `/(garage)/schedule/hours?weekday=${day.weekday}&openHour=${day.openHour}` +
        `&openMinute=${day.openMinute}&closeHour=${day.closeHour}` +
        `&closeMinute=${day.closeMinute}&bays=${day.bays}`,
    );

  const toggleDay = (weekday: number) =>
    setWeek((current) =>
      current.map((day) => (day.weekday === weekday ? { ...day, isOpen: !day.isOpen } : day)),
    );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Nav title + primary action — the tab stack hides native headers. */}
        <View style={styles.header}>
          <Text style={[text.largeTitle, styles.headerTitle, { color: colors.carlibDark }]}>
            {t('garagePlanning.title')}
          </Text>
          {mode === 'calendar' && (
            <PressableScale
              scale={0.92}
              haptic="light"
              onPress={openAddSlot}
              style={styles.headerAction}
            >
              <RemixIcon name="addLine" size={20} color={colors.brandYellow} />
            </PressableScale>
          )}
        </View>

        <View style={styles.padded}>
          <ModeSwitcher mode={mode} onChange={setMode} />
        </View>

        {mode === 'calendar' ? (
          <>
            {/* ── Capacity hero ── */}
            <View style={styles.padded}>
              <CarlibCard style={styles.heroCard}>
                <View style={styles.heroHeader}>
                  <View style={styles.heroHeaderText}>
                    <Text style={[sectionHeaderText, { color: colors.carlibLabel }]}>
                      {isToday ? t('garagePlanning.today') : shortFormatted(selectedDate)}
                    </Text>
                    <Text style={[text.title3, { color: colors.carlibDark }]}>
                      {longFormatted(selectedDate)}
                    </Text>
                  </View>
                  <RemixIcon
                    name="calendarScheduleLine"
                    size={22}
                    color={colors.carlibSecondary}
                  />
                </View>

                {isClosed ? (
                  <View style={styles.heroClosed}>
                    <Text style={[text.title2, { color: colors.carlibDark }]}>
                      {t('garagePlanning.dayClosed')}
                    </Text>
                    <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
                      {t('garagePlanning.dayClosedDescription')}
                    </Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.heroCounts}>
                      <Text
                        style={[
                          text.amount,
                          {
                            color:
                              booked > total ? colors.status.cancelled.fg : colors.carlibDark,
                          },
                        ]}
                      >
                        {booked}
                      </Text>
                      <Text style={[text.title2, { color: colors.carlibSecondary }]}>
                        {`/ ${total}`}
                      </Text>
                      <View style={styles.spacer} />
                      <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
                        {t('garagePlanning.bayBooked', { count: booked })}
                      </Text>
                    </View>

                    <CapacityBar progress={progress} full={progress >= 1} />

                    {booked > total && (
                      <View
                        style={[
                          styles.overbooked,
                          { backgroundColor: colors.status.cancelled.bg },
                        ]}
                      >
                        <RemixIcon name="alertLine" size={14} color={colors.status.cancelled.fg} />
                        <Text
                          style={[
                            carlibFont(13, 'medium'),
                            styles.overbookedText,
                            { color: colors.status.cancelled.fg },
                          ]}
                        >
                          {t('garagePlanning.overbookedWarning')}
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </CarlibCard>
            </View>

            {/* ── Week strip ── */}
            <View style={styles.weekSection}>
              <View style={[styles.padded, styles.weekHeader]}>
                <Text style={[text.footnote, styles.spacer, { color: colors.carlibSecondary }]}>
                  {`${shortFormatted(weekStart)} — ${shortFormatted(addDays(weekStart, 6))}`}
                </Text>
                <PressableScale
                  scale={0.9}
                  haptic="light"
                  onPress={() => setWeekStart((current) => addDays(current, -7))}
                  style={[styles.weekArrow, { backgroundColor: colors.tileSecondary }]}
                >
                  <RemixIcon name="arrowLeftSLine" size={20} color={colors.carlibDark} />
                </PressableScale>
                <PressableScale
                  scale={0.9}
                  haptic="light"
                  onPress={() => setWeekStart((current) => addDays(current, 7))}
                  style={[styles.weekArrow, { backgroundColor: colors.tileSecondary }]}
                >
                  <RemixIcon name="arrowRightSLine" size={20} color={colors.carlibDark} />
                </PressableScale>
              </View>

              <View style={[styles.padded, styles.weekRow]}>
                {weekDates.map((date) => (
                  <WeekDayCell
                    key={date.toISOString()}
                    date={date}
                    isSelected={isSameDay(date, selectedDate)}
                    density={density(date)}
                    onPress={() => setSelectedDate(startOfDay(date))}
                  />
                ))}
              </View>
            </View>

            {/* ── Slots ── */}
            <View style={[styles.padded, styles.slotsSection]}>
              <View style={styles.slotsHeader}>
                {/* Verbatim in Swift — not an L10n key. */}
                <Text style={[sectionHeaderText, styles.spacer, { color: colors.carlibLabel }]}>
                  Slots
                </Text>
                {slots.length > 0 && (
                  <Text style={[text.caption, { color: colors.carlibSecondary }]}>
                    {slots.length}
                  </Text>
                )}
              </View>

              {slots.length === 0 ? (
                <CarlibCard style={styles.emptyCard}>
                  <RemixIcon name="timeLine" size={32} color={colors.carlibSecondary} />
                  <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
                    {t('garagePlanning.emptyTitle')}
                  </Text>
                  <Text
                    style={[text.footnote, styles.centered, { color: colors.carlibSecondary }]}
                  >
                    {t('garagePlanning.emptyDescription')}
                  </Text>
                </CarlibCard>
              ) : (
                <View style={styles.slotList}>
                  {slots.map((slot) => (
                    <SlotRow
                      key={slot.id}
                      slot={slot}
                      claim={claims.find((claim) => claim.id === slot.claimId)}
                      onPress={() => router.push(`/(garage)/schedule/slot/${slot.id}`)}
                    />
                  ))}
                </View>
              )}

              {!isClosed && (
                <View style={styles.slotActions}>
                  <CarlibButton
                    label={t('garagePlanning.addAppointment')}
                    icon="addLine"
                    variant="secondary"
                    onPress={openAddSlot}
                  />
                  <CarlibButton
                    label={t('garagePlanning.blockTime')}
                    icon="forbidLine"
                    variant="secondary"
                    onPress={openBlockTime}
                  />
                </View>
              )}
            </View>
          </>
        ) : (
          /* ── Weekly hours ── */
          <View style={styles.hoursSection}>
            <View style={[styles.padded, styles.hoursIntro]}>
              <Text style={[text.title2, { color: colors.carlibDark }]}>
                {t('garagePlanning.hoursTitle')}
              </Text>
              <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
                {t('garagePlanning.hoursDescription')}
              </Text>
            </View>

            <View style={[styles.padded, styles.hoursList]}>
              {week.map((day) => (
                <DayHoursRow
                  key={day.weekday}
                  day={day}
                  onToggle={() => toggleDay(day.weekday)}
                  onPress={() => openDayHours(day)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: TAB_BAR_SCROLL_PADDING, gap: spacing.lg },
  padded: { paddingHorizontal: spacing.screenHorizontal },
  spacer: { flex: 1 },
  centered: { textAlign: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xs,
  },
  headerTitle: { flex: 1 },
  headerAction: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Mode switcher
  modeTrack: {
    flexDirection: 'row',
    gap: spacing.xxs,
    padding: spacing.xxs,
    borderRadius: radius.full,
  },
  modeSegment: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modePill: {
    position: 'absolute',
    left: spacing.xxs,
    top: spacing.xxs,
    height: 40,
    borderRadius: radius.full,
  },
  // Swift .shadow(color: .black.opacity(0.06), radius: 6, y: 2). A no-op in dark
  // (black on black) by design — there the pill separates by tone instead:
  // carlibScreenBg sits darker than the tileSecondary track.
  modePillShadow: {
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // Capacity hero
  heroCard: { gap: spacing.md },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    gap: spacing.sm,
  },
  heroHeaderText: { flex: 1, gap: 2 },
  heroClosed: { gap: spacing.xs },
  heroCounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    alignSelf: 'stretch',
    gap: spacing.xs,
  },
  barTrack: {
    alignSelf: 'stretch',
    height: 8,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  barFill: { height: 8, borderRadius: radius.full },
  overbooked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
  },
  overbookedText: { flexShrink: 1 },

  // Week strip
  weekSection: { gap: spacing.sm },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  weekArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekRow: { flexDirection: 'row', gap: spacing.xxs },
  weekCell: {
    flex: 1,
    height: WEEK_CELL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    borderRadius: radius.md,
  },
  densityDot: { width: 6, height: 6, borderRadius: 3 },

  // Slots
  slotsSection: { gap: spacing.sm },
  slotsHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  slotList: { gap: spacing.xxs },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  slotTimes: { width: SLOT_TIME_WIDTH, gap: 2 },
  slotBar: { width: 3, alignSelf: 'stretch', borderRadius: 1.5 },
  slotLabels: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  slotLabelStack: { flex: 1, gap: spacing.xxs },
  slotActions: { gap: spacing.xxs, paddingTop: spacing.sm },
  // Swift adds .padding(.vertical, md) on top of the card's own 16.
  emptyCard: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxl,
  },

  // Weekly hours
  hoursSection: { gap: spacing.md },
  hoursIntro: { gap: spacing.xs },
  hoursList: { gap: spacing.xxs },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dayRowText: { flex: 1, gap: 2 },
  dayRowMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  metaDot: { width: 3, height: 3, borderRadius: 1.5 },
});
