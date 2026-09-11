// Port of Carlib/Views/Driver/DriverHomeView.swift — driver home tab.
// Hero "file" section picks its state from the top active claim by lifecycle
// priority: ready-for-pickup > in-repair > accepted > waiting > empty.
import { addDays } from 'date-fns';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import CarlibLogo from '../../../../assets/images/carlib-logo.svg';
import HomeTopBgDark from '../../../../assets/images/home-top-bg-dark.svg';
import { ClaimCard } from '@/components/ClaimCard';
import { Glass } from '@/components/Glass';
import { PolestarTile } from '@/components/PolestarTile';
import { PressableScale } from '@/components/PressableScale';
import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import { relativeFormatted, shortFormatted } from '@/lib/dates';
import { openMaps, openTel } from '@/lib/links';
import { CLAIM_STAGE_INDEX, CLAIM_TOTAL_STAGES } from '@/models/enums';
import type { Claim, Garage } from '@/models/types';
import { distanceForGarage, garageForId } from '@/services/mockData';
import { useAppStore } from '@/stores/appStore';
import { selectPastClaims, useClaimStore } from '@/stores/claimStore';
import { carlibFont, radius, spacing, text, useTheme } from '@/theme';
import { TAB_BAR_SCROLL_PADDING } from '@/components/tabBarStyle';

// Intrinsic asset sizes, for aspect-correct full-width rendering.
const TOP_BG_LIGHT = { width: 1179, height: 774 };
const TOP_BG_DARK = { width: 391, height: 255 };
const LOGO = { width: 43, height: 14 };
const BARRICADES_ASPECT = 342 / 208;

// Swift heroPriority: readyForPickup 5 > in repair 4 > accepted 3 > waiting 2.
function heroPriority(claim: Claim): number {
  if (claim.status === 'termine' && claim.repairStatus === 'pret') return 5;
  switch (claim.status) {
    case 'en_reparation':
    case 'pris_en_charge':
      return 4;
    case 'accepte':
      return 3;
    case 'soumis':
    case 'en_recherche':
      return 2;
    default:
      return 0;
  }
}

function topActiveClaim(claims: Claim[]): Claim | undefined {
  let best: Claim | undefined;
  let bestPriority = 0;
  for (const claim of claims) {
    const priority = heroPriority(claim);
    if (priority > bestPriority) {
      best = claim;
      bestPriority = priority;
    }
  }
  return best;
}

// Swift callGarage: e164 from dialCode+phone, digits and '+' only.
function callGarage(garage: Garage): void {
  openTel(`${garage.dialCode}${garage.phone}`.replace(/[^0-9+]/g, ''));
}

function KickerChip({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.kicker}>
      <View style={[styles.kickerDot, { backgroundColor: color }]} />
      <Text style={[text.caption, styles.kickerLabel, { color }]}>{label}</Text>
    </View>
  );
}

function StageIndicator({ current, accent }: { current: number; accent: string }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <View style={styles.stageRow}>
      <Text style={[text.caption, { color: colors.carlibLabel }]}>
        {t('driverHome.stageProgress', { current, total: CLAIM_TOTAL_STAGES })}
      </Text>
      <View style={styles.stageDots}>
        {Array.from({ length: CLAIM_TOTAL_STAGES }, (_, index) => (
          <View
            key={index}
            style={[
              styles.stageDot,
              { backgroundColor: index < current ? accent : colors.carlibCardBorder },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function GarageActionButton({ icon, onPress }: { icon: RemixIconName; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <PressableScale
      scale={0.92}
      haptic="light"
      onPress={onPress}
      style={[styles.garageAction, { backgroundColor: colors.tileSecondary }]}
    >
      <RemixIcon name={icon} size={18} color={colors.carlibDark} />
    </PressableScale>
  );
}

interface GarageCardData {
  etaLabel: string;
  etaAccent: string;
  garage: Garage;
}

function GarageInfoCard({ data }: { data: GarageCardData }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const garage = data.garage;
  return (
    <View style={[styles.garageCard, { backgroundColor: colors.carlibAccent }]}>
      <View style={styles.etaRow}>
        <View style={[styles.etaBar, { backgroundColor: data.etaAccent }]} />
        <Text style={[carlibFont(15, 'medium'), { color: data.etaAccent }]}>{data.etaLabel}</Text>
      </View>
      <View style={styles.garageRow}>
        <View style={styles.garageText}>
          <Text style={[text.callout, { color: colors.carlibDark }]}>{garage.name}</Text>
          <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
            {t('driverHome.distanceAway', { km: distanceForGarage(garage.id) })}
          </Text>
        </View>
        <View style={styles.garageActions}>
          <GarageActionButton icon="phoneLine" onPress={() => callGarage(garage)} />
          <GarageActionButton icon="mapPinLine" onPress={() => openMaps(garage.address)} />
        </View>
      </View>
    </View>
  );
}

function PillCta({ label, onPress }: { label: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      style={[styles.pillCta, { backgroundColor: colors.tileSecondary }]}
    >
      <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>{label}</Text>
      <RemixIcon name="arrowRightLine" size={16} color={colors.carlibDark} />
    </PressableScale>
  );
}

interface ActiveFileHeaderProps {
  kicker: string;
  accent: string;
  stage?: number;
  headline: string;
  body?: string;
  garageCard?: GarageCardData;
  ctaLabel: string;
  onPress: () => void;
}

function ActiveFileHeader({
  kicker,
  accent,
  stage,
  headline,
  body,
  garageCard,
  ctaLabel,
  onPress,
}: ActiveFileHeaderProps) {
  const { colors } = useTheme();
  return (
    <PressableScale scale={0.99} haptic="none" onPress={onPress} style={styles.hero}>
      <View style={styles.heroKickerRow}>
        <KickerChip color={accent} label={kicker} />
        {stage != null && stage > 0 && <StageIndicator current={stage} accent={accent} />}
      </View>
      <View style={styles.headlineBlock}>
        <Text style={[text.title2, { color: colors.carlibDark }]}>{headline}</Text>
        {body != null && (
          <Text style={[text.body, { color: colors.carlibSecondary }]}>{body}</Text>
        )}
      </View>
      {garageCard != null && <GarageInfoCard data={garageCard} />}
      <PillCta label={ctaLabel} onPress={onPress} />
    </PressableScale>
  );
}

function HeroSection({ claim, onOpen }: { claim?: Claim; onOpen: (id: string) => void }) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  if (claim == null) {
    return (
      <View style={styles.heroEmpty}>
        <KickerChip color={colors.status.completed.fg} label={t('driverHome.emptyFileKicker')} />
        <Text style={[text.title2, { color: colors.carlibDark }]}>
          {t('driverHome.emptyFileHeadline')}
        </Text>
      </View>
    );
  }

  const stage = CLAIM_STAGE_INDEX[claim.status];
  const garage = garageForId(claim.assignedGarageId);
  const vehicleLabel =
    claim.vehicleInfo != null
      ? `${claim.vehicleInfo.brand} ${claim.vehicleInfo.model}`
      : t('driverHome.recentFallbackTitle');
  const open = () => onOpen(claim.id);

  if (claim.status === 'termine' && claim.repairStatus === 'pret') {
    return (
      <ActiveFileHeader
        kicker={t('driverHome.readyForPickupKicker')}
        accent={colors.status.completed.fg}
        headline={t('driverHome.readyForPickupHeadline', { vehicle: vehicleLabel })}
        garageCard={
          garage != null
            ? {
                etaLabel: t('driverHome.comePickUp'),
                etaAccent: colors.status.completed.fg,
                garage,
              }
            : undefined
        }
        ctaLabel={t('driverHome.viewClaim')}
        onPress={open}
      />
    );
  }

  if (claim.status === 'en_reparation' || claim.status === 'pris_en_charge') {
    return (
      <ActiveFileHeader
        kicker={t('driverHome.repairKicker')}
        accent={colors.brandYellow}
        stage={stage}
        headline={t('driverHome.repairHeadline', { vehicle: vehicleLabel })}
        garageCard={
          garage != null
            ? {
                etaLabel: t('driverHome.readyBy', {
                  date: shortFormatted(addDays(claim.updatedAt, 4)),
                }),
                etaAccent: colors.brandYellow,
                garage,
              }
            : undefined
        }
        ctaLabel={t('driverHome.viewClaim')}
        onPress={open}
      />
    );
  }

  if (claim.status === 'accepte') {
    return (
      <ActiveFileHeader
        kicker={t('driverHome.acceptedKicker')}
        accent={colors.brandYellow}
        stage={stage}
        headline={
          garage != null
            ? t('driverHome.acceptedHeadline', { garage: garage.name })
            : t('driverHome.waitingHeadline')
        }
        body={t('driverHome.acceptedBody')}
        ctaLabel={t('driverHome.viewClaim')}
        onPress={open}
      />
    );
  }

  // Waiting — 'soumis' / 'en_recherche'.
  return (
    <ActiveFileHeader
      kicker={t('driverHome.waitingKicker')}
      accent={colors.brandYellow}
      stage={stage}
      headline={t('driverHome.waitingHeadline')}
      body={t('driverHome.waitingBody', { elapsed: relativeFormatted(claim.createdAt) })}
      ctaLabel={t('driverHome.viewClaim')}
      onPress={open}
    />
  );
}

export default function DriverHomeScreen() {
  const { t } = useTranslation();
  const { colors, scheme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const currentUser = useAppStore((s) => s.currentUser);
  const setPendingDriverTab = useAppStore((s) => s.setPendingDriverTab);
  const heroClaim = useClaimStore((s) => topActiveClaim(s.claims));
  const vehicleCount = useClaimStore((s) => s.vehicles.length);
  const pastClaims = useClaimStore(useShallow(selectPastClaims));

  const firstName = currentUser?.fullName.trim().split(/\s+/)[0] ?? '';
  const recentClaims = pastClaims.slice(0, 3);
  const openClaim = (id: string) => router.push(`/home/claim/${id}`);

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      {/* Warm halftone wash anchored to the top, under the status bar. */}
      <View pointerEvents="none" style={styles.topBg}>
        {scheme === 'dark' ? (
          <HomeTopBgDark
            width={width}
            height={(width * TOP_BG_DARK.height) / TOP_BG_DARK.width}
          />
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

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[text.title2, styles.greeting, { color: colors.carlibDark }]}>
          {t('driverHome.greeting', { name: firstName })}
        </Text>

        <HeroSection claim={heroClaim} onOpen={openClaim} />

        <View style={styles.middleStack}>
          {/* Report damage CTA — always bright: yellow is mode-agnostic. */}
          <PressableScale
            scale={0.97}
            haptic="medium"
            onPress={() => router.push('/home/declare')}
            style={styles.reportCta}
          >
            <LinearGradient
              colors={['#FFFBED', '#FFF7D1', colors.brandYellow]}
              locations={[0, 0.45, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Image
              source={require('../../../../assets/images/report-cta-barricades.png')}
              contentFit="contain"
              style={styles.barricades}
            />
            <View style={styles.reportCtaContent}>
              <View style={styles.reportCtaText}>
                <Text style={[text.title3, { color: '#000000' }]}>
                  {t('driverHome.reportCtaTitle')}
                </Text>
                <Text style={[text.footnote, { color: 'rgba(0, 0, 0, 0.6)' }]}>
                  {t('driverHome.reportCtaBody')}
                </Text>
              </View>
              {/* Frosted arrow chip over the always-bright yellow tile. */}
              <Glass
                borderRadius={24}
                style={styles.arrowChip}
                fallbackStyle={styles.arrowChipFallback}
              >
                <View style={styles.arrowChipTint} />
                <RemixIcon name="arrowRightLine" size={22} color="#000000" />
              </Glass>
            </View>
          </PressableScale>

          <View style={styles.shortcutsRow}>
            <PolestarTile
              title={t('driverHome.shortcutMyGarageTitle')}
              subtitle={t('driverHome.shortcutMyGarageCars', { count: vehicleCount })}
              icon="carFill"
              iconPosition="bottomTrailing"
              onPress={() => router.push('/home/my-garage')}
              style={styles.shortcutFlex}
            />
            {/* Local PolestarTile clone: the map texture must sit between the
                tile fill and the content, which PolestarTile can't host. RN has
                no .colorInvert(), so dark mode swaps in a pre-inverted asset
                (scripts/gen-dark-map.js) at the same 0.35 opacity as iOS. */}
            <PressableScale
              scale={0.97}
              haptic="light"
              onPress={() => setPendingDriverTab('shops')}
              style={[styles.shortcutTile, { backgroundColor: colors.tileSecondary }]}
            >
              <Image
                source={
                  scheme === 'dark'
                    ? require('../../../../assets/images/find-shop-map-dark.png')
                    : require('../../../../assets/images/find-shop-map.png')
                }
                contentFit="cover"
                style={[StyleSheet.absoluteFill, scheme === 'dark' && styles.mapDark]}
              />
              <View style={styles.shortcutText}>
                <Text style={[text.title3, { color: colors.carlibDark }]}>
                  {t('driverHome.shortcutFindShopTitle')}
                </Text>
                <Text style={[text.footnote, { color: colors.brandYellow }]}>
                  {t('driverHome.shortcutFindShopSubtitle')}
                </Text>
              </View>
              <RemixIcon
                name="map2Fill"
                size={34}
                color={`${colors.carlibLabel}66`}
                style={styles.shortcutIcon}
              />
            </PressableScale>
          </View>
        </View>

        {recentClaims.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={[text.title3, { color: colors.carlibDark }]}>
                {t('driverHome.recentFilesTitle')}
              </Text>
              <PressableScale
                scale={0.94}
                haptic="light"
                onPress={() => router.push('/home/claims')}
                style={[styles.seeAllPill, { backgroundColor: colors.tileSecondary }]}
              >
                <Text style={[text.callout, { color: colors.carlibDark }]}>
                  {t('driverHome.recentFilesSeeAll')}
                </Text>
                <RemixIcon name="arrowRightLine" size={16} color={colors.carlibDark} />
              </PressableScale>
            </View>
            <View style={styles.recentList}>
              {recentClaims.map((claim) => (
                <PressableScale
                  key={claim.id}
                  scale={0.98}
                  haptic="light"
                  onPress={() => openClaim(claim.id)}
                >
                  <ClaimCard claim={claim} />
                </PressableScale>
              ))}
            </View>
          </View>
        )}
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
    paddingTop: 4,
    paddingBottom: TAB_BAR_SCROLL_PADDING,
    gap: 24,
  },
  greeting: { paddingHorizontal: 20 },

  // Hero "file" section
  hero: { paddingHorizontal: 20, gap: 12 },
  heroEmpty: { paddingHorizontal: 20, gap: 4 },
  heroKickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  headlineBlock: { gap: 4 },
  kicker: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  kickerDot: { width: 6, height: 6, borderRadius: 3 },
  kickerLabel: { letterSpacing: 1.4, textTransform: 'uppercase' },
  stageRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stageDots: { flexDirection: 'row', gap: 4 },
  stageDot: { width: 9, height: 9, borderRadius: 4.5 },
  garageCard: {
    padding: 12,
    borderRadius: radius.md,
    gap: 12,
  },
  etaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  etaBar: { width: 3, height: 17, borderRadius: radius.full },
  garageRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  garageText: { flex: 1, gap: 2 },
  garageActions: { flexDirection: 'row', gap: 12 },
  garageAction: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radius.full,
  },

  // Report damage CTA + shortcuts
  middleStack: { paddingHorizontal: 20, gap: 12 },
  reportCta: {
    height: 104,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  barricades: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    aspectRatio: BARRICADES_ASPECT,
  },
  reportCtaContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  reportCtaText: { flex: 1, gap: 4 },
  arrowChip: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowChipFallback: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  arrowChipTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Theme-invariant on purpose: sits on the always-yellow report CTA.
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  shortcutsRow: { flexDirection: 'row', gap: spacing.tileGap },
  shortcutFlex: { flex: 1 },
  shortcutTile: {
    flex: 1,
    height: spacing.tileHeight,
    borderRadius: radius.lg,
    padding: spacing.tilePadding,
    overflow: 'hidden',
  },
  shortcutText: { gap: 4 },
  shortcutIcon: {
    position: 'absolute',
    bottom: spacing.tilePadding,
    right: spacing.tilePadding,
  },
  mapDark: { opacity: 0.35 },

  // Recent files
  recentSection: { paddingHorizontal: 20, gap: 9 },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  seeAllPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  recentList: { gap: 12 },
});
