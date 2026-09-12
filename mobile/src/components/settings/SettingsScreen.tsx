// Port of Carlib/Views/Shared/SettingsView.swift — tile-card settings shared
// by both roles; route wrappers supply the sheet hrefs for their own stack.
// Alpha suffixes on 6-digit hex tokens: 0.5→80, 0.12→1F, 0.1→1A.
import * as Haptics from 'expo-haptics';
import { useRouter, type Href } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { PressableScale } from '@/components/PressableScale';
import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import { ACCIDENT_KEY, type ClaimStatus } from '@/models/enums';
import { claimReference, type Claim } from '@/models/types';
import { signOut } from '@/services/auth';
import { useAppStore } from '@/stores/appStore';
import { useClaimStore } from '@/stores/claimStore';
import { carlibFont, radius, spacing, text, useTheme } from '@/theme';

// Swift AppTheme.allCases order + icons (ThemeManager.swift).
const THEME_OPTIONS = [
  { mode: 'system', icon: 'contrastFill', labelKey: 'profile.appearanceSystem' },
  { mode: 'dark', icon: 'moonFill', labelKey: 'profile.appearanceDark' },
  { mode: 'light', icon: 'sunFill', labelKey: 'profile.appearanceLight' },
] as const;

// USERAUTH-02: a file still being handled blocks deletion; the driver sees which.
const OPEN_STATUSES: readonly ClaimStatus[] = [
  'soumis',
  'en_recherche',
  'accepte',
  'pris_en_charge',
  'en_reparation',
];

function selectOpenClaims(state: { claims: Claim[] }): Claim[] {
  return state.claims.filter((claim) => OPEN_STATUSES.includes(claim.status));
}

function ThemeChip({ option }: { option: (typeof THEME_OPTIONS)[number] }) {
  const { t } = useTranslation();
  const { colors, mode, setMode } = useTheme();
  const isSelected = mode === option.mode;
  // Selected chip is always yellow with black content, in both schemes.
  const fg = isSelected ? '#000000' : colors.carlibDark;

  return (
    <View style={styles.chipWrap}>
      <PressableScale
        scale={0.97}
        haptic="light"
        onPress={() => {
          setMode(option.mode);
          void Haptics.selectionAsync();
        }}
        style={[
          styles.chip,
          { backgroundColor: isSelected ? colors.brandYellow : `${colors.tileSecondary}80` },
        ]}
      >
        <RemixIcon name={option.icon} size={22} color={fg} />
        <Text style={[carlibFont(13, 'medium'), { color: fg }]}>{t(option.labelKey)}</Text>
      </PressableScale>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[text.title3, { color: colors.carlibDark }]}>{title}</Text>
      {children}
    </View>
  );
}

function TileRow({
  icon,
  title,
  onPress,
}: {
  icon: RemixIconName;
  title: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <PressableScale
      scale={0.98}
      haptic="light"
      onPress={onPress}
      style={[styles.tileRow, { backgroundColor: `${colors.tileSecondary}80` }]}
    >
      <View style={[styles.iconDisc, { backgroundColor: `${colors.brandYellow}1F` }]}>
        <RemixIcon name={icon} size={20} color={colors.brandYellow} />
      </View>
      <Text style={[carlibFont(15, 'medium'), styles.rowTitle, { color: colors.carlibDark }]}>
        {title}
      </Text>
      <RemixIcon name="arrowRightLine" size={16} color={colors.carlibSecondary} />
    </PressableScale>
  );
}

export interface SettingsScreenProps {
  languageHref: Href;
  changePasswordHref: Href;
  notificationsHref: Href;
}

export function SettingsScreen({
  languageHref,
  changePasswordHref,
  notificationsHref,
}: SettingsScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const resetToSignedOut = useAppStore((s) => s.resetToSignedOut);
  const openClaims = useClaimStore(useShallow(selectOpenClaims));

  const confirmDelete = () => {
    if (openClaims.length > 0) {
      const files = openClaims
        .map((claim) => {
          const label =
            claim.accidentType != null
              ? t(`accidentTypeLabel.${ACCIDENT_KEY[claim.accidentType]}`)
              : claim.description;
          return `${claimReference(claim)} · ${label}`;
        })
        .join('\n');
      Alert.alert(
        t('settings.deleteAccountBlockedTitle'),
        t('settings.deleteAccountBlockedMessage', { files }),
      );
      return;
    }
    Alert.alert(
      t('settings.deleteAccountConfirmTitle'),
      t('settings.deleteAccountConfirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.deleteAccount'),
          style: 'destructive',
          onPress: () => {
            void signOut().then(() => {
              resetToSignedOut();
              router.replace('/welcome');
            });
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <Section title={t('settings.sectionAppearance')}>
          <View style={styles.chipRow}>
            {THEME_OPTIONS.map((option) => (
              <ThemeChip key={option.mode} option={option} />
            ))}
          </View>
        </Section>

        <Section title={t('settings.sectionLanguage')}>
          <TileRow
            icon="translate2"
            title={t('profile.languageCurrent')}
            onPress={() => router.push(languageHref)}
          />
        </Section>

        <Section title={t('settings.sectionAccount')}>
          <TileRow
            icon="lockLine"
            title={t('settings.changePassword')}
            onPress={() => router.push(changePasswordHref)}
          />
        </Section>

        <Section title={t('settings.sectionNotifications')}>
          <TileRow
            icon="notificationLine"
            title={t('settings.notificationPreferences')}
            onPress={() => router.push(notificationsHref)}
          />
        </Section>

        {/* Danger zone — Swift uses .buttonStyle(.plain): no scale, no haptic. */}
        <Pressable
          onPress={confirmDelete}
          style={[styles.tileRow, { backgroundColor: `${colors.tileSecondary}80` }]}
        >
          <View style={[styles.iconDisc, { backgroundColor: `${colors.destructiveRed}1A` }]}>
            <RemixIcon name="deleteBinLine" size={18} color={colors.destructiveRed} />
          </View>
          <Text style={[carlibFont(15, 'medium'), styles.rowTitle, { color: colors.destructiveRed }]}>
            {t('settings.deleteAccount')}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
    gap: spacing.sectionSpacing,
  },
  section: { gap: 9 },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  chipWrap: { flex: 1 },
  chip: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: 14,
  },
  tileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: 14,
    borderRadius: 14,
  },
  iconDisc: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { flex: 1 },
});
