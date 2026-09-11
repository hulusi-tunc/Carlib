// Port of Carlib/Views/Driver/DriverProfileView.swift — yellow-gradient hero
// card, quick-stats strip, vehicle rows, quick links, about card, sign-out.
// Verbatim (non-L10n) Swift strings stay hardcoded here for parity.
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { CarBrandLogo } from '@/components/CarBrandLogo';
import { CarlibButton } from '@/components/CarlibButton';
import { DummyImage } from '@/components/DummyImage';
import { PressableScale } from '@/components/PressableScale';
import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import type { Vehicle } from '@/models/types';
import { signOut } from '@/services/auth';
import { useAppStore } from '@/stores/appStore';
import { selectActiveClaims, useClaimStore } from '@/stores/claimStore';
import { carlibFont, spacing, text, useTheme } from '@/theme';
import { TAB_BAR_SCROLL_PADDING } from '@/components/tabBarStyle';

const APP_VERSION = '0.1.0';

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

function VehicleRow({ vehicle, onPress }: { vehicle: Vehicle; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.tileRow, { backgroundColor: `${colors.tileSecondary}80` }]}>
      <View style={[styles.vehicleLogoDisc, { backgroundColor: `${colors.brandYellow}1F` }]}>
        <CarBrandLogo brand={vehicle.info.brand} size={32} />
      </View>

      <View style={styles.rowBody}>
        <View style={styles.vehicleNameRow}>
          <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
            {`${vehicle.info.brand} ${vehicle.info.model}`}
          </Text>
          {vehicle.isDefault && (
            <View style={[styles.defaultBadge, { backgroundColor: colors.brandYellow }]}>
              {/* brandYellow does not adapt, so this stays literal black in both themes. */}
              <Text style={[carlibFont(13, 'medium'), { color: '#000000' }]}>Default</Text>
            </View>
          )}
        </View>
        {vehicle.nickname != null && (
          <Text style={[text.footnote, { color: colors.carlibSecondary }]}>{vehicle.nickname}</Text>
        )}
      </View>

      <View style={styles.vehicleTrailing}>
        <View style={[styles.plateBadge, { backgroundColor: colors.tileSecondary }]}>
          <Text style={[carlibFont(13, 'medium'), { color: colors.carlibDark }]}>
            {vehicle.info.licensePlate}
          </Text>
        </View>
        <RemixIcon name="arrowRightLine" size={14} color={colors.carlibSecondary} />
      </View>
    </Pressable>
  );
}

function LinkRow({ icon, title, subtitle, onPress }: {
  icon: RemixIconName;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.tileRow, { backgroundColor: `${colors.tileSecondary}80` }]}>
      <View style={[styles.linkIconDisc, { backgroundColor: `${colors.brandYellow}1F` }]}>
        <RemixIcon name={icon} size={20} color={colors.brandYellow} />
      </View>
      <View style={styles.rowBody}>
        <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>{title}</Text>
        <Text style={[text.footnote, { color: colors.carlibSecondary }]}>{subtitle}</Text>
      </View>
      <RemixIcon name="arrowRightLine" size={16} color={colors.carlibSecondary} />
    </Pressable>
  );
}

function AboutRow({ icon, title, trailing }: {
  icon: RemixIconName;
  title: string;
  trailing?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.aboutRow}>
      <View style={styles.aboutIconFrame}>
        <RemixIcon name={icon} size={18} color={colors.carlibSecondary} />
      </View>
      <Text style={[text.body, styles.aboutTitle, { color: colors.carlibDark }]}>{title}</Text>
      {trailing != null ? (
        <Text style={[text.footnote, { color: colors.carlibSecondary }]}>{trailing}</Text>
      ) : (
        <RemixIcon name="arrowRightLine" size={14} color={colors.carlibSecondary} />
      )}
    </View>
  );
}

export default function DriverProfileScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();

  const currentUser = useAppStore((s) => s.currentUser);
  const resetToSignedOut = useAppStore((s) => s.resetToSignedOut);
  const claims = useClaimStore(useShallow((s) => s.claims));
  const vehicles = useClaimStore(useShallow((s) => s.vehicles));
  const activeClaims = useClaimStore(useShallow(selectActiveClaims));

  const driverName = currentUser?.fullName || 'Driver';
  const driverEmail = currentUser?.email ?? '';
  const avatarSeed = currentUser?.id ?? 'driver-default';
  // Swift: .dateTime.month(.abbreviated).year() in en_US → "Apr 2026".
  const memberSince =
    currentUser?.createdAt != null ? format(currentUser.createdAt, 'MMM yyyy', { locale: enUS }) : '—';

  const handleSignOut = async () => {
    await signOut();
    resetToSignedOut();
    router.replace('/welcome');
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]} edges={['top']}>
      {/* Nav bar — title + settings / edit trailing actions (Swift toolbar). */}
      <View style={styles.navBar}>
        <Text style={[text.largeTitle, { color: colors.carlibDark }]}>{t('profile.title')}</Text>
        <View style={styles.navActions}>
          <PressableScale
            scale={0.92}
            haptic="light"
            onPress={() => router.push('/profile/settings')}
            style={styles.navIconButton}
          >
            <RemixIcon name="settings3Line" size={20} color={colors.carlibDark} />
          </PressableScale>
          <PressableScale scale={0.96} haptic="light" onPress={() => router.push('/profile/edit')}>
            <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>Edit Profile</Text>
          </PressableScale>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Hero card ── */}
        <LinearGradient
          colors={[`${colors.brandYellow}59`, `${colors.brandYellow}26`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <DummyImage
            kind="person"
            seed={avatarSeed}
            width={72}
            height={72}
            borderRadius={36}
            style={[styles.avatarBorder, { borderColor: `${colors.carlibDark}1F` }]}
          />
          <View style={styles.heroText}>
            <Text style={[text.title2, { color: colors.carlibDark }]}>{driverName}</Text>
            <Text numberOfLines={1} style={[text.footnote, { color: colors.carlibSecondary }]}>
              {driverEmail}
            </Text>
            <View style={[styles.memberChip, { backgroundColor: `${colors.carlibScreenBg}99` }]}>
              <RemixIcon name="userLine" size={11} color={colors.carlibDark} />
              <Text style={[carlibFont(13, 'medium'), { color: colors.carlibDark }]}>
                {`Driver · Member since ${memberSince}`}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Quick stats ── */}
        <View style={[styles.statsStrip, { backgroundColor: colors.tileSecondary }]}>
          <StatBlock value={String(claims.length)} label="Claims" />
          <View style={[styles.statDivider, { backgroundColor: colors.carlibCardBorder }]} />
          <StatBlock value={String(activeClaims.length)} label="Active" />
          <View style={[styles.statDivider, { backgroundColor: colors.carlibCardBorder }]} />
          <StatBlock value={String(vehicles.length)} label="Vehicles" />
        </View>

        {/* ── Vehicles (the centerpiece) ── */}
        <View style={styles.section}>
          <SectionTitle
            title="My vehicles"
            actionLabel="Manage"
            onAction={() => router.push('/home/my-garage')}
          />
          <View style={styles.vehicleList}>
            {vehicles.map((vehicle) => (
              <VehicleRow
                key={vehicle.id}
                vehicle={vehicle}
                onPress={() => router.push(`/profile/vehicle/${vehicle.id}`)}
              />
            ))}
            {/* iOS opened AddVehicleSheet; vehicle management lives in My Garage here. */}
            <PressableScale
              scale={0.98}
              haptic="light"
              onPress={() => router.push('/home/my-garage')}
              style={[
                styles.addVehicleRow,
                { backgroundColor: `${colors.tileSecondary}80`, borderColor: colors.carlibCardBorder },
              ]}
            >
              <RemixIcon name="addLine" size={16} color={colors.carlibDark} />
              <Text style={[text.callout, styles.addVehicleLabel, { color: colors.carlibDark }]}>
                Add new vehicle
              </Text>
              <RemixIcon name="arrowRightLine" size={14} color={colors.carlibSecondary} />
            </PressableScale>
          </View>
        </View>

        {/* ── Quick links ── */}
        <View style={styles.linkList}>
          <LinkRow
            icon="historyLine"
            title={t('profile.historyRow')}
            subtitle="Past claims and their outcomes"
            onPress={() => router.push('/home/claims')}
          />
          <LinkRow
            icon="settings3Line"
            title={t('settings.profileRowTitle')}
            subtitle={t('settings.profileRowSubtitle')}
            onPress={() => router.push('/profile/settings')}
          />
        </View>

        {/* ── About ── */}
        <View style={styles.section}>
          <SectionTitle title={t('profileAbout.section')} />
          <View style={[styles.aboutCard, { backgroundColor: `${colors.tileSecondary}80` }]}>
            <AboutRow icon="fileTextLine" title={t('profileAbout.terms')} />
            <View style={[styles.aboutDivider, { backgroundColor: colors.carlibCardBorder }]} />
            <AboutRow icon="shieldCheckLine" title={t('profileAbout.privacy')} />
            <View style={[styles.aboutDivider, { backgroundColor: colors.carlibCardBorder }]} />
            <AboutRow icon="informationLine" title={t('profileAbout.version')} trailing={APP_VERSION} />
          </View>
        </View>

        {/* ── Sign out ── */}
        <Pressable
          onPress={handleSignOut}
          style={[styles.tileRow, { backgroundColor: `${colors.tileSecondary}80` }]}
        >
          <View style={[styles.linkIconDisc, { backgroundColor: `${colors.destructiveRed}1A` }]}>
            <RemixIcon name="logoutBoxLine" size={18} color={colors.destructiveRed} />
          </View>
          <Text style={[carlibFont(15, 'medium'), { color: colors.destructiveRed }]}>
            {t('profile.logout')}
          </Text>
        </Pressable>

        {__DEV__ && (
          <CarlibButton
            label="Design system"
            variant="ghost"
            onPress={() => router.push('/profile/gallery')}
          />
        )}
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
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navIconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: TAB_BAR_SCROLL_PADDING,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: spacing.md,
    borderRadius: 18,
  },
  avatarBorder: { borderWidth: 2 },
  heroText: { flex: 1, gap: spacing.xxs },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: 9999,
    marginTop: 2,
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
  vehicleList: { gap: spacing.xs },
  tileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: 14,
    borderRadius: 14,
  },
  vehicleLogoDisc: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1, gap: 2 },
  vehicleNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  defaultBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  vehicleTrailing: {
    alignItems: 'flex-end',
    gap: spacing.xxs,
  },
  plateBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  addVehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addVehicleLabel: { flex: 1 },
  linkIconDisc: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkList: { gap: 10 },
  aboutCard: { borderRadius: 14 },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: spacing.sm,
  },
  aboutIconFrame: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutTitle: { flex: 1 },
  aboutDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 14,
  },
});
