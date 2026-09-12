// Port of Carlib/Views/Driver/BookingFlowView.swift as an expo-router
// formSheet: inline graphical calendar, horizontal slot chips, Confirm →
// addBooking → native success alert. Unlike iOS the booking attaches to a
// file (`claimId`, else the latest open claim) and the confirmation quotes
// its date, time, address and reference (CARLIB-BOOKING-01). Reached with
// `rescheduleId` it moves an existing appointment instead (BOOKING-02).
// Section headers are verbatim uppercase strings exactly as in Swift.
import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

import { CarlibButton } from '@/components/CarlibButton';
import { BOOKING_NOTICE_HOURS } from '@/lib/bookingRules';
import { longFormatted, timeFormatted } from '@/lib/dates';
import { claimReference } from '@/models/types';
import {
  selectClaimToBook,
  slotsForDate,
  useClaimStore,
  type BookingResult,
} from '@/stores/claimStore';
import { carlibFont, radius, sectionHeaderText, spacing, text, useTheme } from '@/theme';

// Same v4-UUID shape the store/mock data use for fresh ids.
function randomId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const r = (Math.random() * 16) | 0;
    const v = char === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function BookingSheet() {
  const { t } = useTranslation();
  const { colors, scheme } = useTheme();
  const router = useRouter();
  const { garageId, claimId, rescheduleId } = useLocalSearchParams<{
    garageId: string;
    claimId?: string;
    rescheduleId?: string;
  }>();
  const garage = useClaimStore((s) => s.garages.find((g) => g.id === garageId));
  const addBooking = useClaimStore((s) => s.addBooking);
  const rescheduleBooking = useClaimStore((s) => s.rescheduleBooking);
  const explicitClaim = useClaimStore((s) => s.claims.find((c) => c.id === claimId));
  const fallbackClaim = useClaimStore(selectClaimToBook);
  const claim = explicitClaim ?? fallbackClaim;

  const [minimumDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const daySlots = useClaimStore(useShallow(slotsForDate(selectedDate, garageId)));
  const openSlots = useMemo(
    () => daySlots.filter((slot) => slot.isAvailable && !slot.isBlocked),
    [daySlots],
  );

  useEffect(() => {
    if (garage == null && router.canGoBack()) router.back();
  }, [garage, router]);
  if (garage == null) return null;

  const confirm = () => {
    const slot = openSlots.find((item) => item.id === selectedSlotId);
    if (slot == null) return;
    const now = new Date();
    const result: BookingResult =
      rescheduleId != null
        ? rescheduleBooking(rescheduleId, slot.id, now)
        : addBooking({
            id: randomId(),
            claimId: claim?.id,
            garageId: garage.id,
            slotId: slot.id,
            // BOOKING-01: confirmed at once, no action from the shop.
            status: 'confirme',
            createdAt: now,
          });
    if (!result.ok) {
      // The store already dropped a taken slot, so the chips refresh on their own.
      setSelectedSlotId(null);
      if (result.reason === 'notice_period') {
        Alert.alert(
          t('booking.noticeTitle'),
          t('booking.noticeMessage', { hours: BOOKING_NOTICE_HOURS }),
        );
      } else {
        Alert.alert(t('booking.slotTakenTitle'), t('booking.slotTakenMessage'));
      }
      return;
    }
    const details = t('booking.successDetails', {
      date: longFormatted(slot.date),
      time: timeFormatted(slot.startTime),
      address: garage.address,
    });
    const reference =
      claim != null
        ? `\n${t('booking.successReference', { reference: claimReference(claim) })}`
        : '';
    Alert.alert(
      rescheduleId != null ? t('booking.rescheduledTitle') : t('booking.successTitle'),
      `${details}${reference}`,
      [{ text: 'OK', onPress: () => router.back() }],
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      {/* Inline nav bar — title + Cancel, matching the Swift toolbar. */}
      <View style={styles.toolbar}>
        <Text
          numberOfLines={1}
          style={[carlibFont(17, 'medium'), styles.title, { color: colors.carlibDark }]}
        >
          {rescheduleId != null
            ? t('booking.rescheduleTitleAt', { name: garage.name })
            : t('booking.titleAt', { name: garage.name })}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.cancel}>
          <Text style={[carlibFont(17, 'regular'), { color: colors.carlibSecondary }]}>
            {t('common.cancel')}
          </Text>
        </Pressable>
      </View>

      {/* ── Date picker ── */}
      <View style={styles.dateSection}>
        <Text style={[sectionHeaderText, { color: colors.carlibLabel }]}>SELECT DATE</Text>
        <DateTimePicker
          value={selectedDate}
          onValueChange={(_event, date) => setSelectedDate(date)}
          mode="date"
          display="inline"
          presentation="inline"
          minimumDate={minimumDate}
          accentColor={colors.brandYellow}
          themeVariant={scheme}
          style={styles.datePicker}
        />
      </View>

      <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />

      {/* ── Time slots ── */}
      <View style={styles.slotsSection}>
        <Text style={[sectionHeaderText, styles.slotsHeader, { color: colors.carlibLabel }]}>
          AVAILABLE SLOTS
        </Text>
        {openSlots.length === 0 ? (
          <Text style={[text.body, styles.emptySlots, { color: colors.carlibSecondary }]}>
            {t('booking.noSlots')}
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.slotsRow}
          >
            {openSlots.map((slot) => {
              const selected = selectedSlotId === slot.id;
              return (
                <Pressable
                  key={slot.id}
                  onPress={() => setSelectedSlotId(slot.id)}
                  style={[
                    styles.slotChip,
                    { backgroundColor: selected ? colors.brandYellow : colors.tileSecondary },
                  ]}
                >
                  {/* Selected fill is brand yellow, which never adapts — ink stays
                      explicitly black in both themes (Swift's .white predates the
                      blue→yellow rebrand of carlibPrimaryBlue). */}
                  <Text
                    style={[
                      carlibFont(15, 'medium'),
                      { color: selected ? '#000000' : colors.carlibDark },
                    ]}
                  >
                    {timeFormatted(slot.startTime)}
                  </Text>
                  <Text
                    style={[
                      text.caption,
                      { color: selected ? 'rgba(0, 0, 0, 0.6)' : colors.carlibSecondary },
                    ]}
                  >
                    {`— ${timeFormatted(slot.endTime)}`}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      <View style={styles.spacer} />

      {/* ── Confirm ── */}
      <View style={styles.footer}>
        <CarlibButton
          label={t('booking.confirm')}
          icon="calendarEventLine"
          isDisabled={selectedSlotId == null}
          onPress={confirm}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  toolbar: {
    minHeight: 44,
    marginTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginHorizontal: 72,
  },
  cancel: {
    position: 'absolute',
    left: spacing.screenHorizontal,
  },
  dateSection: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
  },
  datePicker: { alignSelf: 'stretch' },
  divider: { height: StyleSheet.hairlineWidth },
  slotsSection: { gap: spacing.sm },
  slotsHeader: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.screenHorizontal,
  },
  emptySlots: {
    alignSelf: 'stretch',
    textAlign: 'center',
    paddingVertical: spacing.xxl,
  },
  slotsRow: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
  },
  slotChip: {
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  spacer: { flex: 1 },
  footer: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.xxl,
  },
});
