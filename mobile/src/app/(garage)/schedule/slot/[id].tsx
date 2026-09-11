// Port of GaragePlanningView.SlotDetailSheet — one slot: appointment (with the
// linked claim's customer, vehicle and status) or a block. Detents follow the
// Swift [.medium, .large]; the claim card alone overflows a half sheet.
// "Mark as arrived" is the same non-destructive demo toggle as on iOS — it just
// clears the blocked flag rather than advancing the booking status.
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CarlibButton } from '@/components/CarlibButton';
import { CarlibCard } from '@/components/CarlibCard';
import { CarlibStatusBadge } from '@/components/CarlibStatusBadge';
import { PressableScale } from '@/components/PressableScale';
import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import { longFormatted, timeFormatted } from '@/lib/dates';
import { openTel } from '@/lib/links';
import { ACCIDENT_KEY, type ClaimStatus } from '@/models/enums';
import type { Claim } from '@/models/types';
import { useClaimStore } from '@/stores/claimStore';
import { carlibFont, radius, spacing, text, useTheme, type ColorTokens } from '@/theme';

const STATUS_KEY = {
  brouillon: 'draft',
  soumis: 'submitted',
  en_recherche: 'matched',
  accepte: 'accepted',
  pris_en_charge: 'inProgress',
  en_reparation: 'repairing',
  termine: 'completed',
  annule: 'cancelled',
  expire: 'expired',
} as const satisfies Record<ClaimStatus, keyof ColorTokens['status']>;

// Swift dial()/text(): keep digits and '+' only.
function phoneDigits(phone: string): string {
  return phone.replace(/[^+0-9]/g, '');
}

function initials(name: string | undefined): string {
  if (name == null || name === '') return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

function vehicleLabel(claim: Claim): string {
  const vehicle = claim.vehicleInfo;
  if (vehicle == null) return '—';
  return `${vehicle.brand} ${vehicle.model}\n${vehicle.licensePlate}`;
}

export default function SlotDetailSheet() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const slot = useClaimStore((s) => s.timeSlots.find((item) => item.id === id));
  const claim = useClaimStore((s) => s.claims.find((item) => item.id === slot?.claimId));
  const setSlotBlocked = useClaimStore((s) => s.setSlotBlocked);
  const removeTimeSlot = useClaimStore((s) => s.removeTimeSlot);

  // Our own actions delete the slot; the guard must not double-navigate then.
  const leaving = useRef(false);

  useEffect(() => {
    if (slot == null && !leaving.current && router.canGoBack()) router.back();
  }, [slot, router]);
  if (slot == null) return null;

  const blocked = slot.isBlocked;
  const kindColor = blocked ? colors.status.cancelled : colors.status.inProgress;
  const kindIcon: RemixIconName = blocked ? 'forbidLine' : 'carFill';
  const kindLabel = blocked ? t('garagePlanning.blocked') : t('garagePlanning.appointment');
  const kindSubtitle = blocked
    ? t('garagePlanning.blockedSubtitle')
    : t('garagePlanning.appointmentSubtitle');

  const markArrived = () => {
    setSlotBlocked(slot.id, false);
    router.back();
  };

  const reschedule = () => {
    // Swift drops the old slot and reopens the add sheet prefilled with it.
    leaving.current = true;
    removeTimeSlot(slot.id);
    router.replace(
      `/(garage)/schedule/add-slot?date=${slot.date.getTime()}` +
        `&start=${slot.startTime.getTime()}&end=${slot.endTime.getTime()}`,
    );
  };

  const removeSlot = () => {
    leaving.current = true;
    removeTimeSlot(slot.id);
    router.back();
  };

  const contactButton = (icon: RemixIconName, label: string, onPress: () => void) => (
    <PressableScale
      scale={0.97}
      haptic="light"
      onPress={onPress}
      style={[styles.contactButton, { backgroundColor: colors.tileSecondary }]}
    >
      <RemixIcon name={icon} size={16} color={colors.carlibDark} />
      <Text style={[text.callout, { color: colors.carlibDark }]}>{label}</Text>
    </PressableScale>
  );

  const detailRow = (label: string, value: string) => (
    <View style={styles.detailRow}>
      <Text style={[text.caption, { color: colors.carlibLabel }]}>{label}</Text>
      <Text
        style={[carlibFont(15, 'medium'), styles.detailValue, { color: colors.carlibDark }]}
      >
        {value}
      </Text>
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

      {/* Inline nav bar — centered title + leading Done (Swift toolbar). */}
      <View style={styles.toolbar}>
        <Text style={[carlibFont(17, 'medium'), { color: colors.carlibDark }]}>
          {t('garagePlanning.slotDetailsTitle')}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.done}>
          <Text style={[carlibFont(17, 'medium'), { color: colors.carlibDark }]}>
            {t('common.done')}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── Hero ── */}
        <CarlibCard style={styles.heroCard}>
          <CarlibStatusBadge
            text={kindLabel}
            color={kindColor.fg}
            backgroundColor={kindColor.bg}
            icon={kindIcon}
          />

          <Text style={[text.title1, { color: colors.carlibDark }]}>
            {`${timeFormatted(slot.startTime)} – ${timeFormatted(slot.endTime)}`}
          </Text>
          <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
            {longFormatted(slot.date)}
          </Text>

          {blocked && (
            <Text style={[text.body, styles.blockedNote, { color: colors.carlibSecondary }]}>
              {kindSubtitle}
            </Text>
          )}
        </CarlibCard>

        {!blocked && claim != null && (
          <>
            {/* ── Quick contact ── */}
            <CarlibCard style={styles.contactCard}>
              <View style={styles.contactHeader}>
                <View style={[styles.avatar, { backgroundColor: colors.brandYellowLight }]}>
                  <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
                    {initials(claim.driverName)}
                  </Text>
                </View>
                <View style={styles.contactText}>
                  <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
                    {claim.driverName ?? t('garagePlanning.walkInTitle')}
                  </Text>
                  {claim.driverPhone != null && (
                    <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
                      {claim.driverPhone}
                    </Text>
                  )}
                </View>
              </View>

              {claim.driverPhone != null && (
                <View style={styles.contactActions}>
                  {contactButton('phoneLine', t('garagePlanning.actionCall'), () =>
                    openTel(phoneDigits(claim.driverPhone ?? '')),
                  )}
                  {contactButton('messageLine', t('garagePlanning.actionMessage'), () => {
                    void Linking.openURL(`sms:${phoneDigits(claim.driverPhone ?? '')}`).catch(
                      () => undefined,
                    );
                  })}
                </View>
              )}
            </CarlibCard>

            {/* ── Claim details ── */}
            <CarlibCard style={styles.detailsCard}>
              {detailRow(t('garagePlanning.vehicle'), vehicleLabel(claim))}
              {claim.accidentType != null && (
                <>
                  {divider}
                  {detailRow(
                    t('garagePlanning.accidentType'),
                    t(`accidentTypeLabel.${ACCIDENT_KEY[claim.accidentType]}`),
                  )}
                </>
              )}
              {claim.description !== '' && (
                <>
                  {divider}
                  <View style={styles.descriptionBlock}>
                    <Text style={[text.caption, { color: colors.carlibLabel }]}>
                      {t('garagePlanning.claimDescription')}
                    </Text>
                    <Text style={[text.body, { color: colors.carlibDark }]}>
                      {claim.description}
                    </Text>
                  </View>
                </>
              )}
              {divider}
              <View style={styles.statusRow}>
                <Text style={[text.caption, styles.spacer, { color: colors.carlibLabel }]}>
                  {t('garagePlanning.claimStatus')}
                </Text>
                <CarlibStatusBadge
                  claimStatus={claim.status}
                  label={t(`claimStatusLabel.${STATUS_KEY[claim.status]}`)}
                />
              </View>
            </CarlibCard>
          </>
        )}

        {/* ── Walk-in notice ── */}
        {!blocked && claim == null && (
          <CarlibCard style={styles.walkInCard}>
            <RemixIcon name="informationLine" size={18} color={colors.carlibSecondary} />
            <Text style={[text.footnote, styles.spacer, { color: colors.carlibSecondary }]}>
              {t('garagePlanning.walkInSubtitle')}
            </Text>
          </CarlibCard>
        )}

        {/* ── Actions ── */}
        <View style={styles.actions}>
          {blocked ? (
            <CarlibButton
              label={t('garagePlanning.actionRemoveBlock')}
              icon="checkboxCircleFill"
              onPress={removeSlot}
            />
          ) : (
            <>
              <CarlibButton
                label={t('garagePlanning.actionMarkArrived')}
                icon="checkboxCircleFill"
                onPress={markArrived}
              />
              <CarlibButton
                label={t('garagePlanning.actionReschedule')}
                icon="calendarScheduleLine"
                variant="secondary"
                onPress={reschedule}
              />
              <CarlibButton
                label={t('garagePlanning.actionCancelAppt')}
                icon="closeCircleFill"
                variant="destructive"
                onPress={removeSlot}
              />
            </>
          )}
        </View>
      </ScrollView>
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
  done: { position: 'absolute', left: spacing.screenHorizontal },
  content: {
    padding: spacing.screenHorizontal,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },

  heroCard: { gap: spacing.sm },
  blockedNote: { paddingTop: spacing.xxs },

  contactCard: { gap: spacing.sm },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactText: { flex: 1, gap: 2 },
  contactActions: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: spacing.xxs,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    height: 44,
    borderRadius: radius.full,
  },

  detailsCard: { gap: spacing.md },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    gap: spacing.sm,
  },
  detailValue: { flex: 1, textAlign: 'right' },
  descriptionBlock: { gap: spacing.xxs },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: spacing.sm,
  },
  divider: { height: StyleSheet.hairlineWidth, alignSelf: 'stretch' },

  walkInCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  actions: { gap: spacing.xxs },
});
