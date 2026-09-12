// Port of Carlib/Views/Driver/DeclarationConfirmationView.swift — success
// screen shown as a full-screen modal after submitting a declaration. The CTA
// pops the whole declaration flow back to the home tab root (iOS set
// pendingDriverTab = .home and dismissed the cover).
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CarlibButton } from '@/components/CarlibButton';
import { CarlibCard } from '@/components/CarlibCard';
import { RemixIcon } from '@/components/RemixIcon';
import { claimReference } from '@/models/types';
import { useClaimStore } from '@/stores/claimStore';
import { useHidesTabBar } from '@/stores/uiStore';
import { carlibFont, spacing, text, useTheme } from '@/theme';

export default function DeclareConfirmScreen() {
  // Swift .fullScreenCover: the confirmation covers the tab bar too.
  useHidesTabBar();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { claimId } = useLocalSearchParams<{ claimId?: string }>();
  const claim = useClaimStore((s) => s.claims.find((item) => item.id === claimId));
  const reference = claim != null ? claimReference(claim) : null;

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

      {reference != null && (
        <CarlibCard variant="flat" style={styles.referenceCard}>
          <View style={styles.referenceRow}>
            <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
              {t('declaration.confirmationReference')}
            </Text>
            <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>{reference}</Text>
          </View>
        </CarlibCard>
      )}

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
