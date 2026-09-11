// Port of Carlib/Views/Driver/DeclarationConfirmationView.swift — success
// screen shown as a full-screen modal after submitting a declaration. The CTA
// pops the whole declaration flow back to the home tab root (iOS set
// pendingDriverTab = .home and dismissed the cover).
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CarlibButton } from '@/components/CarlibButton';
import { CarlibCard } from '@/components/CarlibCard';
import { RemixIcon } from '@/components/RemixIcon';
import { carlibFont, spacing, text, useTheme } from '@/theme';

function randomReference(): string {
  // Swift: "SIN-2026-" + String(format: "%04d", Int.random(in: 1...9999)).
  const n = Math.floor(Math.random() * 9999) + 1;
  return `SIN-2026-${String(n).padStart(4, '0')}`;
}

export default function DeclareConfirmScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [reference] = useState(randomReference);

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}
      edges={['top', 'bottom']}
    >
      <Stack.Screen options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />

      <View style={styles.spacer} />

      <RemixIcon
        name="checkboxCircleFill"
        size={80}
        color={colors.status.completed.fg}
        style={styles.icon}
      />

      <View style={styles.titleGroup}>
        <Text style={[text.title1, styles.centered, { color: colors.carlibDark }]}>
          {t('declaration.confirmationTitle')}
        </Text>
        <Text style={[text.body, styles.centered, styles.subtitle, { color: colors.carlibSecondary }]}>
          {t('declaration.confirmationSubtitle')}
        </Text>
      </View>

      <CarlibCard variant="flat" style={styles.referenceCard}>
        <View style={styles.referenceRow}>
          <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
            {t('declaration.confirmationReference')}
          </Text>
          <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>{reference}</Text>
        </View>
      </CarlibCard>

      <View style={styles.spacer} />

      <CarlibButton
        label={t('declaration.confirmationCtaHome')}
        onPress={() => router.dismissTo('/home')}
        style={styles.cta}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: spacing.xxl,
  },
  spacer: { flex: 1 },
  icon: { alignSelf: 'center' },
  titleGroup: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  centered: { textAlign: 'center' },
  subtitle: { paddingHorizontal: spacing.xl },
  referenceCard: { marginHorizontal: spacing.screenHorizontal },
  referenceRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cta: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.xxl,
  },
});
