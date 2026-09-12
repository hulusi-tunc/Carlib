// Port of Carlib/Views/Driver/VehicleDetailView.swift, grown into the vehicle
// space of CARLIB-VEHPORTAL-02: one place for a vehicle's open files, upcoming
// appointments and history, with a switcher when the driver has several
// vehicles and an explicit state for every empty section. The info rows,
// "Set as default" and "Delete vehicle" are the original port; the iOS List
// becomes grouped tileSecondary cards like the other detail screens.
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

import { CarBrandLogo } from '@/components/CarBrandLogo';
import { CarlibStatusBadge } from '@/components/CarlibStatusBadge';
import { PressableScale } from '@/components/PressableScale';
import { RecentFileRow } from '@/components/RecentFileRow';
import { RemixIcon } from '@/components/RemixIcon';
import { longFormatted, shortFormatted, timeFormatted } from '@/lib/dates';
import { isClaimOpen } from '@/models/enums';
import { vehicleDisplayName, type Booking, type Claim, type TimeSlot } from '@/models/types';
import { claimsForVehicle, isBookingLive, useClaimStore } from '@/stores/claimStore';
import { carlibFont, spacing, text, useTheme } from '@/theme';

function InfoRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.infoRow}>
      <Text style={[text.body, { color: colors.carlibSecondary }]}>{label}</Text>
      <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>{value}</Text>
    </View>
  );
}

function latest(dates: Date[]): Date | undefined {
  return dates.reduce<Date | undefined>(
    (best, date) => (best == null || date > best ? date : best),
    undefined,
  );
}

// VEHPORTAL-02: every section states its last update and never renders blank.
function Section({
  title,
  updatedAt,
  empty,
  children,
}: {
  title: string;
  updatedAt?: Date;
  empty: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[text.title3, { color: colors.carlibDark }]}>{title}</Text>
        <Text style={[text.caption, { color: colors.carlibLabel }]}>
          {updatedAt != null
            ? t('vehicleSpace.updated', { date: shortFormatted(updatedAt) })
            : t('vehicleSpace.neverUpdated')}
        </Text>
      </View>
      <View style={[styles.card, { backgroundColor: `${colors.tileSecondary}80` }]}>
        {children ?? (
          <Text style={[text.footnote, styles.emptyText, { color: colors.carlibSecondary }]}>
            {empty}
          </Text>
        )}
      </View>
    </View>
  );
}

function BookingRow({
  booking,
  slot,
  garageName,
  onPress,
}: {
  booking: Booking;
  slot: TimeSlot;
  garageName?: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={styles.bookingRow}>
      <View style={styles.bookingText}>
        <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
          {`${longFormatted(slot.date)} · ${timeFormatted(slot.startTime)}`}
        </Text>
        {garageName != null && (
          <Text style={[text.caption, { color: colors.carlibSecondary }]}>{garageName}</Text>
        )}
      </View>
      <CarlibStatusBadge bookingStatus={booking.status} />
    </Pressable>
  );
}

export default function VehicleSpaceScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const vehicles = useClaimStore((s) => s.vehicles);
  // The switcher changes the vehicle in place; the route keeps the one it opened with.
  const [selectedId, setSelectedId] = useState(id);
  const vehicle = vehicles.find((item) => item.id === selectedId) ?? vehicles.find((item) => item.id === id);
  const setDefaultVehicle = useClaimStore((s) => s.setDefaultVehicle);
  const removeVehicle = useClaimStore((s) => s.removeVehicle);
  const bookings = useClaimStore((s) => s.bookings);
  const timeSlots = useClaimStore((s) => s.timeSlots);
  const garages = useClaimStore((s) => s.garages);
  const claims = useClaimStore(useShallow(claimsForVehicle(vehicle?.info.licensePlate ?? '')));
  const [now] = useState(() => new Date());

  const openClaims = useMemo(() => claims.filter((claim) => isClaimOpen(claim.status)), [claims]);
  const pastClaims = useMemo(
    () =>
      claims
        .filter((claim) => !isClaimOpen(claim.status) && claim.status !== 'brouillon')
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
    [claims],
  );
  const upcoming = useMemo(() => {
    const claimIds = new Set(claims.map((claim) => claim.id));
    return bookings
      .filter((booking) => booking.claimId != null && claimIds.has(booking.claimId))
      .filter(isBookingLive)
      .map((booking) => ({ booking, slot: timeSlots.find((slot) => slot.id === booking.slotId) }))
      .filter((entry): entry is { booking: Booking; slot: TimeSlot } => entry.slot != null)
      .filter((entry) => entry.slot.startTime >= now)
      .sort((a, b) => a.slot.startTime.getTime() - b.slot.startTime.getTime());
  }, [bookings, claims, now, timeSlots]);

  useEffect(() => {
    if (vehicle == null && router.canGoBack()) router.back();
  }, [vehicle, router]);
  if (vehicle == null) return null;

  const handleSetDefault = () => {
    setDefaultVehicle(vehicle.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const confirmDelete = () => {
    Alert.alert(
      t('vehicleDetail.deleteTitle'),
      t('vehicleDetail.deleteMessage', { name: `${vehicle.info.brand} ${vehicle.info.model}` }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            removeVehicle(vehicle.id);
            router.back();
          },
        },
      ],
    );
  };

  const openClaim = (claim: Claim) => router.push(`/home/claim/${claim.id}`);
  const divider = <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />;

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        {/* ── Switcher — several vehicles, one space ── */}
        {vehicles.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.switcher}
          >
            {vehicles.map((item) => {
              const selected = item.id === vehicle.id;
              return (
                <PressableScale
                  key={item.id}
                  scale={0.96}
                  haptic="light"
                  onPress={() => setSelectedId(item.id)}
                  style={[
                    styles.chip,
                    { backgroundColor: selected ? colors.brandYellow : `${colors.tileSecondary}80` },
                  ]}
                >
                  {/* brandYellow does not adapt, so the selected ink stays literal black. */}
                  <Text
                    style={[carlibFont(13, 'medium'), { color: selected ? '#000000' : colors.carlibDark }]}
                  >
                    {vehicleDisplayName(item)}
                  </Text>
                </PressableScale>
              );
            })}
          </ScrollView>
        )}

        {/* ── Identity card ── */}
        <View style={[styles.card, styles.identityCard, { backgroundColor: `${colors.tileSecondary}80` }]}>
          <View style={[styles.logoCircle, { backgroundColor: colors.tileSecondary }]}>
            <CarBrandLogo brand={vehicle.info.brand} size={44} />
          </View>
          <View style={styles.identityText}>
            <View style={styles.nameRow}>
              <Text style={[text.title2, { color: colors.carlibDark }]}>
                {`${vehicle.info.brand} ${vehicle.info.model}`}
              </Text>
              {vehicle.isDefault && (
                <View style={[styles.defaultBadge, { backgroundColor: colors.brandYellow }]}>
                  {/* brandYellow does not adapt, so this stays literal black in both themes. */}
                  <Text style={[carlibFont(13, 'medium'), { color: '#000000' }]}>
                    {t('vehicleDetail.defaultBadge')}
                  </Text>
                </View>
              )}
            </View>
            {vehicle.info.year != null && (
              <Text style={[text.caption, { color: colors.carlibSecondary }]}>
                {String(vehicle.info.year)}
              </Text>
            )}
          </View>
        </View>

        {/* ── Open files ── */}
        <Section
          title={t('vehicleSpace.sectionOpen')}
          updatedAt={latest(openClaims.map((claim) => claim.updatedAt))}
          empty={t('vehicleSpace.emptyOpen')}
        >
          {openClaims.length > 0
            ? openClaims.map((claim, index) => (
                <React.Fragment key={claim.id}>
                  {index > 0 && divider}
                  <RecentFileRow claim={claim} onPress={() => openClaim(claim)} />
                </React.Fragment>
              ))
            : null}
        </Section>

        {/* ── Upcoming appointments ── */}
        <Section
          title={t('vehicleSpace.sectionBookings')}
          updatedAt={latest(upcoming.map((entry) => entry.booking.createdAt))}
          empty={t('vehicleSpace.emptyBookings')}
        >
          {upcoming.length > 0
            ? upcoming.map(({ booking, slot }, index) => (
                <React.Fragment key={booking.id}>
                  {index > 0 && divider}
                  <BookingRow
                    booking={booking}
                    slot={slot}
                    garageName={garages.find((garage) => garage.id === booking.garageId)?.name}
                    onPress={() => router.push(`/home/claim/${booking.claimId}`)}
                  />
                </React.Fragment>
              ))
            : null}
        </Section>

        {/* ── History — closed files land here on their own ── */}
        <Section
          title={t('vehicleSpace.sectionHistory')}
          updatedAt={latest(pastClaims.map((claim) => claim.updatedAt))}
          empty={t('vehicleSpace.emptyHistory')}
        >
          {pastClaims.length > 0
            ? pastClaims.map((claim, index) => (
                <React.Fragment key={claim.id}>
                  {index > 0 && divider}
                  <RecentFileRow claim={claim} onPress={() => openClaim(claim)} />
                </React.Fragment>
              ))
            : null}
        </Section>

        {/* ── Info rows ── */}
        <View style={[styles.card, { backgroundColor: `${colors.tileSecondary}80` }]}>
          <InfoRow label={t('vehicleDetail.plate')} value={vehicle.info.licensePlate} />
          {divider}
          <InfoRow label={t('vehicleDetail.brand')} value={vehicle.info.brand} />
          {divider}
          <InfoRow label={t('vehicleDetail.model')} value={vehicle.info.model} />
          {vehicle.info.year != null && (
            <>
              {divider}
              <InfoRow label={t('vehicleDetail.year')} value={String(vehicle.info.year)} />
            </>
          )}
          {divider}
          <InfoRow label={t('vehicleDetail.color')} value={vehicle.info.color} />
        </View>

        {/* ── Actions ── */}
        <View style={[styles.card, { backgroundColor: `${colors.tileSecondary}80` }]}>
          {!vehicle.isDefault && (
            <>
              <Pressable onPress={handleSetDefault} style={styles.actionRow}>
                <RemixIcon name="starLine" size={18} color={colors.brandYellow} />
                <Text style={[text.body, { color: colors.carlibDark }]}>
                  {t('vehicleDetail.setDefault')}
                </Text>
              </Pressable>
              {divider}
            </>
          )}
          <Pressable onPress={confirmDelete} style={styles.actionRow}>
            <RemixIcon name="deleteBinLine" size={18} color={colors.destructiveRed} />
            <Text style={[text.body, { color: colors.destructiveRed }]}>
              {t('vehicleDetail.deleteVehicle')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  switcher: { gap: spacing.xs },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 9999,
  },
  section: { gap: 9 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: spacing.md,
  },
  emptyText: { paddingVertical: 14 },
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: spacing.md,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityText: { flex: 1, gap: 2 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  defaultBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingVertical: 14,
  },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 12,
  },
  bookingText: { flex: 1, gap: 2 },
  divider: { height: StyleSheet.hairlineWidth },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
  },
});
