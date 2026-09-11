// Port of Carlib/Views/Garage/GarageDashboardView.swift — garage cockpit tab.
// Status banner + 4-KPI strip above the fold, then new-request pager, today's
// schedule preview and active jobs. All copy is Text(verbatim:) on iOS, so it
// stays hardcoded here too (accident type labels are the one localized piece).
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import PagerView, { type PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import CarlibLogo from '../../../../assets/images/carlib-logo.svg';
import HomeTopBgDark from '../../../../assets/images/home-top-bg-dark.svg';
import { CarBrandLogo } from '@/components/CarBrandLogo';
import { CarlibStatusBadge } from '@/components/CarlibStatusBadge';
import { PressableScale } from '@/components/PressableScale';
import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import { relativeFormatted, timeFormatted } from '@/lib/dates';
import { ACCIDENT_KEY, type ClaimStatus } from '@/models/enums';
import type { Claim, TimeSlot } from '@/models/types';
import {
  selectAvailableClaims,
  selectGarageClaims,
  selectPastClaims,
  slotsForDate,
  useClaimStore,
} from '@/stores/claimStore';
import { useAppStore } from '@/stores/appStore';
import { carlibFont, radius, text, useTheme, type ColorTokens } from '@/theme';
import { TAB_BAR_SCROLL_PADDING } from '@/components/tabBarStyle';

// Intrinsic asset sizes, for aspect-correct full-width rendering.
const TOP_BG_LIGHT = { width: 1179, height: 774 };
const TOP_BG_DARK = { width: 391, height: 255 };
const LOGO = { width: 43, height: 14 };

// Fixed pager height — header (~60) + spacing (12) + button row (~48) +
// internal padding (28). Keeps the pager from pinching cards (iOS: 172).
const REQUEST_CARD_HEIGHT = 172;

// Demo fills the schedule rows with realistic customer + car text.
// Real data will come when bookings attach customer/vehicle info (iOS parity).
const DEMO_CUSTOMERS = [
  'Sophie Durand — Peugeot 308',
  'Jean Leclerc — Renault Clio V',
  'Marie Bernard — Volkswagen Golf',
];
const DEMO_LABELS = ['Drop-off', 'Pickup', 'Drop-off'];

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

function vehicleTitle(claim: Claim): string {
  const v = claim.vehicleInfo;
  return v != null ? `${v.brand} ${v.model}` : 'Vehicle';
}

// SwiftUI .spring(response: 0.35): stiffness = (2π/0.35)² ≈ 322,
// damping = 2·0.825·√322 ≈ 30.
const DOT_SPRING = { mass: 1, stiffness: 322, damping: 30 } as const;

function PageDot({ active }: { active: boolean }) {
  const { colors } = useTheme();
  const width = useSharedValue(active ? 18 : 6);
  useEffect(() => {
    width.value = withSpring(active ? 18 : 6, DOT_SPRING);
  }, [active, width]);
  const animatedStyle = useAnimatedStyle(() => ({ width: width.value }));
  return (
    <Animated.View
      style={[
        styles.pageDot,
        animatedStyle,
        { backgroundColor: active ? colors.carlibDark : colors.carlibCardBorder },
      ]}
    />
  );
}

function KpiDivider() {
  const { colors } = useTheme();
  return <View style={[styles.kpiDivider, { backgroundColor: colors.carlibCardBorder }]} />;
}

function KpiBlock({
  value,
  label,
  accent,
  onPress,
}: {
  value: string;
  label: string;
  accent: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <PressableScale scale={0.96} haptic="light" onPress={onPress} style={styles.kpiBlock}>
      <Text style={[text.title2, { color: accent }]}>{value}</Text>
      <Text style={[text.micro, { color: colors.carlibSecondary }]}>{label}</Text>
    </PressableScale>
  );
}

// Shared section header: text-only brand link action (no pill chrome) so
// stacked sections don't create visual noise.
function SectionHeader({
  title,
  badge,
  actionLabel,
  onAction,
}: {
  title: string;
  badge?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[text.title3, { color: colors.carlibDark }]}>{title}</Text>
      {badge != null && (
        <View style={[styles.sectionBadge, { backgroundColor: colors.brandYellow }]}>
          <Text style={[text.caption, { color: '#000000' }]}>{badge}</Text>
        </View>
      )}
      <View style={styles.spacer} />
      {actionLabel != null && onAction != null && (
        <PressableScale scale={0.96} haptic="light" onPress={onAction}>
          <Text style={[text.caption, { color: colors.carlibDark }]}>{actionLabel}</Text>
        </PressableScale>
      )}
    </View>
  );
}

function EmptyRow({
  icon,
  title,
  subtitle,
}: {
  icon: RemixIconName;
  title: string;
  subtitle: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.emptyRow, { backgroundColor: colors.tileSecondary }]}>
      <View style={[styles.emptyIconDisc, { backgroundColor: `${colors.brandYellow}1F` }]}>
        <RemixIcon name={icon} size={20} color={colors.brandYellow} />
      </View>
      <View style={styles.emptyText}>
        <Text style={[text.callout, { color: colors.carlibDark }]}>{title}</Text>
        <Text style={[text.microBody, { color: colors.carlibSecondary }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

function RequestCard({
  claim,
  onOpen,
  onDecline,
}: {
  claim: Claim;
  onOpen: () => void;
  onDecline: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const subtitle =
    claim.accidentType != null
      ? t(`accidentTypeLabel.${ACCIDENT_KEY[claim.accidentType]}`)
      : 'Repair request';
  return (
    <View style={[styles.requestCard, { backgroundColor: `${colors.tileSecondary}80` }]}>
      {/* Tapping the header opens the claim detail — the whole card is
          clickable, not just the two buttons below. */}
      <PressableScale scale={0.99} haptic="none" onPress={onOpen} style={styles.requestHeader}>
        <View style={[styles.requestLogoDisc, { backgroundColor: colors.tileSecondary }]}>
          <CarBrandLogo brand={claim.vehicleInfo?.brand ?? ''} size={32} />
        </View>
        <View style={styles.requestTitleBlock}>
          <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
            {vehicleTitle(claim)}
          </Text>
          <Text style={[text.footnote, { color: colors.carlibSecondary }]}>{subtitle}</Text>
        </View>
        <Text style={[text.caption, { color: colors.carlibSecondary }]}>
          {relativeFormatted(claim.createdAt)}
        </Text>
      </PressableScale>

      <View style={styles.requestActions}>
        <PressableScale
          scale={0.96}
          onPress={onDecline}
          style={[styles.requestActionButton, { backgroundColor: colors.tileSecondary }]}
        >
          <Text style={[text.callout, { color: colors.carlibDark }]}>Decline</Text>
        </PressableScale>
        <PressableScale
          scale={0.96}
          haptic="medium"
          onPress={onOpen}
          style={[styles.requestActionButton, { backgroundColor: colors.brandYellow }]}
        >
          <Text style={[text.callout, { color: '#000000' }]}>Review</Text>
        </PressableScale>
      </View>
    </View>
  );
}

function ScheduleRow({
  slot,
  index,
  onPress,
}: {
  slot: TimeSlot;
  index: number;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <PressableScale scale={0.99} haptic="none" onPress={onPress} style={styles.scheduleRow}>
      <View style={styles.scheduleTimeFrame}>
        <View style={styles.scheduleTimeStack}>
          <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
            {timeFormatted(slot.startTime)}
          </Text>
          <Text style={[text.micro, { color: colors.carlibSecondary }]}>
            {DEMO_LABELS[index % DEMO_LABELS.length]}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.scheduleBar,
          { backgroundColor: index === 0 ? colors.brandYellow : colors.carlibCardBorder },
        ]}
      />
      <Text
        style={[text.callout, styles.scheduleCustomer, { color: colors.carlibDark }]}
        numberOfLines={1}
      >
        {DEMO_CUSTOMERS[index % DEMO_CUSTOMERS.length]}
      </Text>
      <RemixIcon name="arrowRightLine" size={14} color={colors.carlibSecondary} />
    </PressableScale>
  );
}

function JobRow({ claim, onPress }: { claim: Claim; onPress: () => void }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const subtitle =
    claim.accidentType != null
      ? t(`accidentTypeLabel.${ACCIDENT_KEY[claim.accidentType]}`)
      : 'Repair';
  return (
    <PressableScale scale={0.99} haptic="none" onPress={onPress} style={styles.jobRow}>
      <View style={[styles.jobLogoDisc, { backgroundColor: colors.tileSecondary }]}>
        <CarBrandLogo brand={claim.vehicleInfo?.brand ?? ''} size={28} />
      </View>
      <View style={styles.jobTitleBlock}>
        <Text style={[text.callout, { color: colors.carlibDark }]}>{vehicleTitle(claim)}</Text>
        <Text style={[text.microBody, { color: colors.carlibSecondary }]}>{subtitle}</Text>
      </View>
      <CarlibStatusBadge
        claimStatus={claim.status}
        label={t(`claimStatusLabel.${STATUS_KEY[claim.status]}`)}
      />
    </PressableScale>
  );
}

export default function GarageDashboardScreen() {
  const { colors, scheme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [now] = useState(() => new Date());
  const availableClaims = useClaimStore(useShallow(selectAvailableClaims));
  const garageClaims = useClaimStore(useShallow(selectGarageClaims));
  const pastClaims = useClaimStore(useShallow(selectPastClaims));
  const todaySlots = useClaimStore(useShallow(slotsForDate(now)));
  const declineClaim = useClaimStore((s) => s.declineClaim);
  const setPendingGarageTab = useAppStore((s) => s.setPendingGarageTab);

  const pagerRef = useRef<PagerView>(null);
  const [requestIndex, setRequestIndex] = useState(0);

  const bookedTodaySlots = todaySlots.filter((slot) => !slot.isAvailable);

  const newRequestsCount = availableClaims.length;
  const inProgressCount = garageClaims.filter(
    (claim) => claim.status === 'en_reparation' || claim.status === 'pris_en_charge',
  ).length;
  const todayAppointmentsCount = bookedTodaySlots.length;
  const completedThisMonthCount = pastClaims.filter((claim) => claim.status === 'termine').length;

  // Keep the selected page valid if a card is declined/accepted: clamp for
  // render, move the pager as a side effect — its onPageSelected then
  // re-syncs requestIndex.
  const safeRequestIndex =
    newRequestsCount > 0 ? Math.min(requestIndex, newRequestsCount - 1) : 0;
  useEffect(() => {
    if (newRequestsCount > 0 && safeRequestIndex !== requestIndex) {
      pagerRef.current?.setPageWithoutAnimation(safeRequestIndex);
    }
  }, [newRequestsCount, requestIndex, safeRequestIndex]);

  const bannerKicker = [
    `${newRequestsCount} new`,
    `${todayAppointmentsCount} today`,
    `${inProgressCount} in shop`,
  ].join(' • ');

  const openClaim = (id: string) => router.push(`/(garage)/dashboard/claim/${id}`);
  const goToClaims = () => setPendingGarageTab('claims');
  const goToSchedule = () => setPendingGarageTab('schedule');

  const handlePageSelected = (e: PagerViewOnPageSelectedEvent) => {
    setRequestIndex(e.nativeEvent.position);
  };

  const scheduleRows = bookedTodaySlots.slice(0, 3);
  const activeJobs = garageClaims.slice(0, 3);

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      {/* Warm halftone wash anchored to the top, under the status bar. */}
      <View pointerEvents="none" style={styles.topBg}>
        {scheme === 'dark' ? (
          <HomeTopBgDark width={width} height={(width * TOP_BG_DARK.height) / TOP_BG_DARK.width} />
        ) : (
          <Image
            source={require('../../../../assets/images/home-top-bg.png')}
            contentFit="cover"
            style={{ width, height: (width * TOP_BG_LIGHT.height) / TOP_BG_LIGHT.width }}
          />
        )}
      </View>

      {/* Carlib logo — stands in for the iOS toolbar principal item. */}
      <View style={[styles.logoBar, { marginTop: insets.top }]}>
        <CarlibLogo width={(16 * LOGO.width) / LOGO.height} height={16} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Status banner — kicker dot + counts + dark primary action. */}
        <View style={styles.banner}>
          <View style={styles.bannerKicker}>
            <View
              style={[
                styles.bannerDot,
                {
                  backgroundColor:
                    newRequestsCount > 0 ? colors.status.completed.fg : colors.carlibSecondary,
                },
              ]}
            />
            <Text
              style={[text.caption, styles.bannerKickerText, { color: colors.carlibSecondary }]}
              numberOfLines={1}
            >
              {bannerKicker}
            </Text>
          </View>
          {newRequestsCount > 0 && (
            <PressableScale
              scale={0.95}
              haptic="light"
              onPress={goToClaims}
              style={[styles.bannerCta, { backgroundColor: colors.carlibDark }]}
            >
              <Text style={[text.caption, { color: colors.carlibScreenBg }]}>Review</Text>
              <RemixIcon name="arrowRightLine" size={14} color={colors.carlibScreenBg} />
            </PressableScale>
          )}
        </View>

        {/* KPI strip — green = fresh, yellow = active work, neutral rest. */}
        <View style={[styles.kpiStrip, { backgroundColor: colors.tileSecondary }]}>
          <KpiBlock
            value={`${newRequestsCount}`}
            label="New"
            accent={newRequestsCount > 0 ? colors.status.completed.fg : colors.carlibSecondary}
            onPress={goToClaims}
          />
          <KpiDivider />
          <KpiBlock
            value={`${inProgressCount}`}
            label="In repair"
            accent={inProgressCount > 0 ? colors.brandYellow : colors.carlibSecondary}
            onPress={goToClaims}
          />
          <KpiDivider />
          <KpiBlock
            value={`${todayAppointmentsCount}`}
            label="Today"
            accent={colors.carlibDark}
            onPress={goToSchedule}
          />
          <KpiDivider />
          <KpiBlock
            value={`${completedThisMonthCount}`}
            label="Month"
            accent={colors.carlibDark}
            onPress={goToClaims}
          />
        </View>

        {/* New requests — swipe carousel so the shop can triage without
            tapping in. Custom dots below (cleaner than floating ones). */}
        {availableClaims.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="New requests"
              badge={`${newRequestsCount}`}
              actionLabel="See all"
              onAction={goToClaims}
            />
            <PagerView
              ref={pagerRef}
              style={styles.pager}
              initialPage={0}
              onPageSelected={handlePageSelected}
            >
              {availableClaims.map((claim) => (
                <View key={claim.id} style={styles.page}>
                  <RequestCard
                    claim={claim}
                    onOpen={() => openClaim(claim.id)}
                    onDecline={() => declineClaim(claim.id)}
                  />
                </View>
              ))}
            </PagerView>
            {availableClaims.length > 1 && (
              <View style={styles.dots}>
                {availableClaims.map((claim, index) => (
                  <PageDot key={claim.id} active={index === safeRequestIndex} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Today's schedule — next 2-3 appointments inline. */}
        <View style={styles.section}>
          <SectionHeader title="Today's schedule" />
          {scheduleRows.length === 0 ? (
            <EmptyRow
              icon="calendarCheckFill"
              title="Nothing on the books today"
              subtitle="Free day — enjoy the breathing room."
            />
          ) : (
            <View style={[styles.rowsCard, { backgroundColor: `${colors.tileSecondary}80` }]}>
              {scheduleRows.map((slot, index) => (
                <React.Fragment key={slot.id}>
                  <ScheduleRow slot={slot} index={index} onPress={goToSchedule} />
                  {index < scheduleRows.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          )}
        </View>

        {/* In the shop — active jobs inline list. */}
        <View style={styles.section}>
          <SectionHeader title="In the shop" />
          {activeJobs.length === 0 ? (
            <EmptyRow
              icon="toolsFill"
              title="No cars in the bay"
              subtitle="Accept a request to start a new job."
            />
          ) : (
            <View style={[styles.rowsCard, { backgroundColor: `${colors.tileSecondary}80` }]}>
              {activeJobs.map((claim, index) => (
                <React.Fragment key={claim.id}>
                  <JobRow claim={claim} onPress={() => openClaim(claim.id)} />
                  {index < activeJobs.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    opacity: 0.2,
  },
  logoBar: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: TAB_BAR_SCROLL_PADDING,
    gap: 20,
  },
  spacer: { flex: 1 },

  // Status banner
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerKicker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bannerDot: { width: 6, height: 6, borderRadius: 3 },
  bannerKickerText: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
  bannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
  },

  // KPI strip
  kpiStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: radius.lg,
  },
  kpiBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  kpiDivider: { width: 1, height: 28, borderRadius: 0.5 },

  // Sections
  section: { gap: 9 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionBadge: {
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: radius.full,
  },

  // New requests pager
  pager: { height: REQUEST_CARD_HEIGHT },
  page: { paddingHorizontal: 2 },
  requestCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    justifyContent: 'space-between',
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requestLogoDisc: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestTitleBlock: { flex: 1, gap: 2 },
  requestActions: { flexDirection: 'row', gap: 8 },
  requestActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: radius.full,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 2,
  },
  pageDot: { height: 6, borderRadius: radius.full },

  // Today's schedule
  rowsCard: { borderRadius: 14, overflow: 'hidden' },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 0 },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    height: 56,
  },
  scheduleTimeFrame: { width: 72, alignItems: 'flex-start' },
  scheduleTimeStack: { alignItems: 'center', gap: 2 },
  scheduleBar: { width: 2, height: 28 },
  scheduleCustomer: { flex: 1 },

  // Active jobs
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    height: 60,
  },
  jobLogoDisc: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobTitleBlock: { flex: 1, gap: 2 },

  // Empty rows
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
  },
  emptyIconDisc: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: { flex: 1, gap: 2 },
});
