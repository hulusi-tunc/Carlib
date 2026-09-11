// Port of Carlib/Views/Garage/GarageProfileView.swift — cover-photo hero with
// scrim + Open/Closed chip, completeness ring, 4-stat strip, tappable contact
// cards, specialty chips, coverage card, photo strip, settings + sign out.
// Verbatim (non-L10n) Swift strings stay hardcoded here for parity.
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { DummyImage } from '@/components/DummyImage';
import { PressableScale } from '@/components/PressableScale';
import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import { openMaps, openTel } from '@/lib/links';
import { fromDialCode } from '@/models/countryDialCodes';
import type { RepairSpecialty } from '@/models/enums';
import { signOut } from '@/services/auth';
import { garages as seedGarages, garageYearsActive } from '@/services/mockData';
import { useAppStore } from '@/stores/appStore';
import { useClaimStore } from '@/stores/claimStore';
import { carlibFont, spacing, text, useTheme } from '@/theme';
import { TAB_BAR_SCROLL_PADDING } from '@/components/tabBarStyle';

// Signed-in garage persona: MockData garages[0] — Carrosserie Dupont.
const GARAGE_ID = '00000001-0000-0000-0000-000000000001';

const SPECIALTY_KEY = {
  carrosserie: 'bodywork',
  peinture: 'painting',
  mecanique: 'mechanics',
  vitrage: 'windshield',
  detailing: 'detailing',
} as const satisfies Record<RepairSpecialty, string>;

const RING_SIZE = 44;
const RING_STROKE = 3;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function SectionTitle({ title, actionLabel, onAction }: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionHeaderRow}>
      <Text style={[text.title3, { color: colors.carlibDark }]}>{title}</Text>
      {actionLabel != null && onAction != null && (
        <PressableScale scale={0.96} haptic="light" onPress={onAction}>
          <Text style={[carlibFont(13, 'medium'), { color: colors.carlibDark }]}>
            {actionLabel}
          </Text>
        </PressableScale>
      )}
    </View>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.statBlock}>
      <Text style={[text.statValue, { color: colors.carlibDark }]}>{value}</Text>
      <Text style={[text.micro, { color: colors.carlibSecondary }]}>{label}</Text>
    </View>
  );
}

function ContactCard({ icon, title, titleNode, subtitle, onPress }: {
  icon: RemixIconName;
  title?: string;
  titleNode?: React.ReactNode;
  subtitle: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tileCard, { backgroundColor: `${colors.tileSecondary}80` }]}
    >
      <View style={[styles.iconDisc, { backgroundColor: `${colors.brandYellow}1F` }]}>
        <RemixIcon name={icon} size={20} color={colors.brandYellow} />
      </View>
      <View style={styles.rowBody}>
        {titleNode ?? (
          <Text
            numberOfLines={2}
            style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}
          >
            {title}
          </Text>
        )}
        <Text style={[text.footnote, { color: colors.carlibSecondary }]}>{subtitle}</Text>
      </View>
      <RemixIcon name="arrowRightLine" size={16} color={colors.carlibSecondary} />
    </Pressable>
  );
}

export default function GarageProfileScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();

  const resetToSignedOut = useAppStore((s) => s.resetToSignedOut);
  const garage =
    useClaimStore((s) => s.garages.find((g) => g.id === GARAGE_ID)) ?? seedGarages[0]!;
  const completedRepairs = useClaimStore(
    (s) =>
      s.claims.filter((c) => c.assignedGarageId === garage.id && c.status === 'termine').length,
  );

  const yearsActive = garageYearsActive[garage.id] ?? 1;
  const country = fromDialCode(garage.dialCode);
  const heroWidth = windowWidth - spacing.lg * 2;

  // Swift: 3 base fields always filled from mock, +1 per optional section.
  const filled =
    3 +
    (garage.specialties.length > 0 ? 1 : 0) +
    (garage.coverageRadiusKm > 0 ? 1 : 0) +
    (garage.photos.length > 0 ? 1 : 0);
  const completeness = Math.trunc((filled / 6) * 100);

  const openEdit = () => router.push('/(garage)/profile/edit');

  const callPhone = () => {
    const e164 = `${garage.dialCode}${garage.phone}`.replace(/[^0-9+]/g, '');
    openTel(e164);
  };

  const handleSignOut = async () => {
    await signOut();
    resetToSignedOut();
    router.replace('/welcome');
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]} edges={['top']}>
      {/* Nav bar — large title + Edit trailing action (Swift toolbar). */}
      <View style={styles.navBar}>
        <Text style={[text.largeTitle, { color: colors.carlibDark }]}>
          {t('garageProfile.title')}
        </Text>
        <PressableScale scale={0.96} haptic="light" onPress={openEdit}>
          <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>Edit</Text>
        </PressableScale>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Hero cover ── */}
        <View style={styles.heroCard}>
          <DummyImage kind="garage" seed={garage.id} width={heroWidth} height={180} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.55)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroContent}>
            <View style={styles.availabilityChip}>
              <View
                style={[
                  styles.availabilityDot,
                  {
                    backgroundColor: garage.isAvailable
                      ? colors.status.completed.fg
                      : colors.status.cancelled.fg,
                  },
                ]}
              />
              <Text style={[text.caption, styles.availabilityLabel]}>
                {garage.isAvailable ? 'Open' : 'Closed'}
              </Text>
            </View>
            <Text numberOfLines={2} style={[text.cardHero, styles.heroName]}>
              {garage.name}
            </Text>
          </View>
        </View>

        {/* ── Completeness strip ── */}
        <View style={[styles.completenessStrip, { backgroundColor: `${colors.tileSecondary}80` }]}>
          <View style={styles.ringWrap}>
            <Svg width={RING_SIZE} height={RING_SIZE}>
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                stroke={colors.carlibCardBorder}
                strokeWidth={RING_STROKE}
                fill="none"
              />
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                stroke={colors.brandYellow}
                strokeWidth={RING_STROKE}
                strokeLinecap="round"
                strokeDasharray={`${(RING_CIRCUMFERENCE * completeness) / 100} ${RING_CIRCUMFERENCE}`}
                transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
                fill="none"
              />
            </Svg>
            <Text style={[carlibFont(11, 'medium'), styles.ringLabel, { color: colors.carlibDark }]}>
              {`${completeness}%`}
            </Text>
          </View>

          <View style={styles.rowBody}>
            <Text style={[text.callout, { color: colors.carlibDark }]}>
              {`Profile ${completeness}% complete`}
            </Text>
            <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
              Add photos to make your listing stand out.
            </Text>
          </View>

          <PressableScale
            scale={0.92}
            haptic="light"
            onPress={openEdit}
            style={[styles.completenessAction, { backgroundColor: colors.tileSecondary }]}
          >
            <RemixIcon name="arrowRightLine" size={16} color={colors.carlibDark} />
          </PressableScale>
        </View>

        {/* ── Quick stats ── */}
        <View style={[styles.statsStrip, { backgroundColor: colors.tileSecondary }]}>
          <StatBlock value={String(completedRepairs)} label="Repairs" />
          <View style={[styles.statDivider, { backgroundColor: colors.carlibCardBorder }]} />
          <StatBlock value={String(garage.specialties.length)} label="Specialties" />
          <View style={[styles.statDivider, { backgroundColor: colors.carlibCardBorder }]} />
          <StatBlock value={`${Math.trunc(garage.coverageRadiusKm)}km`} label="Coverage" />
          <View style={[styles.statDivider, { backgroundColor: colors.carlibCardBorder }]} />
          <StatBlock value={`${yearsActive}y`} label="Active" />
        </View>

        {/* ── Contact ── */}
        <View style={styles.section}>
          <SectionTitle title="Contact" />
          <View style={styles.cardList}>
            <ContactCard
              icon="mapPinLine"
              title={garage.address}
              subtitle="Tap to open in Maps"
              onPress={() => openMaps(garage.address)}
            />
            <ContactCard
              icon="phoneLine"
              titleNode={
                <View style={styles.phoneRow}>
                  <Text style={styles.phoneFlag}>{country.flag}</Text>
                  <Text style={[carlibFont(15, 'medium'), { color: colors.carlibSecondary }]}>
                    {garage.dialCode}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}
                  >
                    {garage.phone}
                  </Text>
                </View>
              }
              subtitle="Tap to call"
              onPress={callPhone}
            />
          </View>
        </View>

        {/* ── Specialties ── */}
        <View style={styles.section}>
          <SectionTitle title="Specialties" actionLabel="Edit" onAction={openEdit} />
          <View style={styles.chipsWrap}>
            {garage.specialties.map((specialty) => (
              <View
                key={specialty}
                style={[
                  styles.specialtyChip,
                  {
                    backgroundColor: `${colors.brandYellow}2E`,
                    borderColor: `${colors.brandYellow}59`,
                  },
                ]}
              >
                <Text style={[carlibFont(13, 'medium'), { color: colors.carlibDark }]}>
                  {t(`specialty.${SPECIALTY_KEY[specialty]}`)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Coverage ── */}
        <View style={styles.section}>
          <SectionTitle title="Service area" />
          <View style={[styles.tileCard, { backgroundColor: `${colors.tileSecondary}80` }]}>
            <View style={[styles.iconDisc, { backgroundColor: `${colors.brandYellow}1F` }]}>
              <RemixIcon name="focus2Line" size={22} color={colors.brandYellow} />
            </View>
            <View style={styles.rowBody}>
              <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
                {`${Math.trunc(garage.coverageRadiusKm)} km radius`}
              </Text>
              <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
                Accept claims within this distance.
              </Text>
            </View>
          </View>
        </View>

        {/* ── Photos ── */}
        <View style={styles.section}>
          <SectionTitle title="Photos" actionLabel="Manage" onAction={openEdit} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photoStrip}
            contentContainerStyle={styles.photoStripContent}
          >
            <PressableScale
              scale={0.97}
              haptic="light"
              onPress={openEdit}
              style={[
                styles.addPhotoTile,
                {
                  backgroundColor: `${colors.brandYellow}1A`,
                  borderColor: `${colors.brandYellow}80`,
                },
              ]}
            >
              <RemixIcon name="addLine" size={24} color={colors.brandYellow} />
              <Text style={[carlibFont(13, 'medium'), { color: colors.carlibDark }]}>Add</Text>
            </PressableScale>
            {garage.photos.map((photo) => (
              <DummyImage
                key={photo.id}
                kind="garage"
                seed={photo.id}
                width={120}
                height={120}
                borderRadius={14}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Settings + sign out ── */}
        <View style={styles.cardList}>
          <Pressable
            onPress={() => router.push('/(garage)/profile/settings')}
            style={[styles.tileCard, { backgroundColor: `${colors.tileSecondary}80` }]}
          >
            <View style={styles.settingsIconFrame}>
              <RemixIcon name="settings3Line" size={18} color={colors.carlibDark} />
            </View>
            <View style={styles.rowBody}>
              <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
                {t('settings.profileRowTitle')}
              </Text>
              <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
                {t('settings.profileRowSubtitle')}
              </Text>
            </View>
            <RemixIcon name="arrowRightLine" size={16} color={colors.carlibSecondary} />
          </Pressable>

          <Pressable
            onPress={handleSignOut}
            style={[styles.tileCard, { backgroundColor: `${colors.tileSecondary}80` }]}
          >
            <RemixIcon name="logoutBoxLine" size={18} color={colors.destructiveRed} />
            <Text style={[carlibFont(15, 'medium'), styles.signOutLabel, { color: colors.destructiveRed }]}>
              {t('profile.logout')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  content: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: TAB_BAR_SCROLL_PADDING,
  },
  heroCard: {
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
  },
  heroContent: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    padding: spacing.md,
    gap: spacing.xs,
    alignItems: 'flex-start',
  },
  // The chip and the name sit on the cover photo under a dark gradient scrim —
  // that surface never adapts, so these literals stay theme-invariant.
  availabilityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availabilityLabel: {
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroName: { color: '#FFFFFF' },
  completenessStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: 14,
    borderRadius: 14,
  },
  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabel: { position: 'absolute' },
  completenessAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 14,
    paddingHorizontal: spacing.xs,
    borderRadius: 16,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statDivider: { width: 1, height: 24 },
  section: { gap: 9 },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardList: { gap: 10 },
  tileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: 14,
    borderRadius: 14,
  },
  iconDisc: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1, gap: 2 },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  phoneFlag: { fontSize: 18 },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  specialtyChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    borderRadius: 9999,
    borderWidth: 1,
  },
  photoStrip: { marginHorizontal: -spacing.lg },
  photoStripContent: {
    gap: 10,
    paddingHorizontal: spacing.lg,
  },
  addPhotoTile: {
    width: 120,
    height: 120,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  settingsIconFrame: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutLabel: { flex: 1 },
});
