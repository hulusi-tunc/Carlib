// Ported from Carlib/Views/Onboarding/RoleSelectionView.swift — Revolut-style:
// back arrow, top-left title, large radio cards, bottom-pinned Continue + terms.
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/PressableScale';
import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import type { UserRole } from '@/models/enums';
import { signOut, updateRole } from '@/services/auth';
import { useAppStore } from '@/stores/appStore';
import { carlibFont, radius, spacing, text, useTheme } from '@/theme';
import { homeForRole } from '@/lib/routes';

interface RoleCardProps {
  role: UserRole;
  icon: RemixIconName;
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: (role: UserRole) => void;
}

function RoleCard({ role, icon, title, description, isSelected, onSelect }: RoleCardProps) {
  const { colors } = useTheme();
  // Swift: brandYellow.opacity(0.15) disc fill, .opacity(0.4) selected border.
  const yellow15 = `${colors.brandYellow}26`;
  const yellow40 = `${colors.brandYellow}66`;

  return (
    <PressableScale
      scale={0.98}
      haptic="light"
      onPress={() => onSelect(role)}
      style={[
        styles.card,
        {
          backgroundColor: colors.tileSecondary,
          borderColor: isSelected ? yellow40 : 'transparent',
        },
      ]}
    >
      <View
        style={[
          styles.iconDisc,
          { backgroundColor: isSelected ? yellow15 : colors.carlibCardBorder },
        ]}
      >
        <RemixIcon
          name={icon}
          size={22}
          color={isSelected ? colors.brandYellow : colors.carlibSecondary}
        />
      </View>

      <View style={styles.cardText}>
        <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>{title}</Text>
        <Text numberOfLines={2} style={[text.caption, { color: colors.carlibSecondary }]}>
          {description}
        </Text>
      </View>

      <View
        style={[
          styles.radioOuter,
          { borderColor: isSelected ? colors.brandYellow : colors.carlibCardBorder },
        ]}
      >
        {isSelected && <View style={[styles.radioInner, { backgroundColor: colors.brandYellow }]} />}
      </View>
    </PressableScale>
  );
}

export default function RoleSelectionScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);
  const resetToSignedOut = useAppStore((s) => s.resetToSignedOut);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleBack = async () => {
    await signOut();
    resetToSignedOut();
    router.replace('/welcome');
  };

  const handleContinue = async () => {
    if (selectedRole == null || currentUser == null) return;
    const updated = await updateRole(selectedRole, currentUser);
    setCurrentUser(updated);
    router.replace(homeForRole(selectedRole) as never);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      <Pressable onPress={() => void handleBack()} style={styles.backButton} hitSlop={8}>
        <RemixIcon name="arrowLeftSLine" size={24} color={colors.carlibDark} />
      </Pressable>

      <Text style={[text.largeTitle, styles.title, { color: colors.carlibDark }]}>
        {t('role.title')}
      </Text>

      <View style={styles.cards}>
        <RoleCard
          role="conducteur"
          icon="carLine"
          title={t('role.driverTitle')}
          description={t('role.driverDescription')}
          isSelected={selectedRole === 'conducteur'}
          onSelect={setSelectedRole}
        />
        <RoleCard
          role="carrossier"
          icon="wrenchLine"
          title={t('role.garageTitle')}
          description={t('role.garageDescription')}
          isSelected={selectedRole === 'carrossier'}
          onSelect={setSelectedRole}
        />
      </View>

      <View style={styles.spacer} />

      <Text style={[text.caption, styles.terms, { color: colors.carlibLabel }]}>
        {t('auth.termsDisclaimer')}
      </Text>

      {/* Bespoke yellow CTA (Swift builds this inline, not via CarlibButton):
          54pt capsule, brandYellow when enabled, tileSecondary when not. */}
      <PressableScale
        scale={0.96}
        haptic="soft"
        disabled={selectedRole == null}
        onPress={() => void handleContinue()}
        style={[
          styles.continueButton,
          { backgroundColor: selectedRole != null ? colors.brandYellow : colors.tileSecondary },
        ]}
      >
        <Text
          style={[
            carlibFont(15, 'medium'),
            { color: selectedRole != null ? '#000000' : colors.carlibLabel },
          ]}
        >
          {t('role.continueButton')}
        </Text>
      </PressableScale>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
    marginTop: spacing.xs,
  },
  title: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
  },
  cards: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  iconDisc: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    gap: 3,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
  },
  spacer: {
    flex: 1,
  },
  terms: {
    textAlign: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingBottom: spacing.sm,
  },
  continueButton: {
    height: 54,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xxl,
  },
});
