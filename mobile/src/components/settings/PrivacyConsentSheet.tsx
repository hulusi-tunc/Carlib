// Privacy policy + consent sheet (CARLIB-USERAUTH-03): the placeholder policy
// text, the accepted version and date, the separate marketing toggle, and
// accept / withdraw. Reached from Profile › About and from the declaration's
// validation step.
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { CarlibButton } from '@/components/CarlibButton';
import { POLICY_VERSION, consentCoversFiles } from '@/lib/consent';
import { shortFormatted } from '@/lib/dates';
import { useConsentStore } from '@/stores/consentStore';
import { carlibFont, radius, spacing, text, useTheme } from '@/theme';

export function PrivacyConsentSheet() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const consent = useConsentStore((s) => s.consent);
  const accept = useConsentStore((s) => s.accept);
  const setMarketing = useConsentStore((s) => s.setMarketing);
  const withdraw = useConsentStore((s) => s.withdraw);
  const covers = consentCoversFiles(consent);

  const status =
    consent == null
      ? t('privacy.statusNone')
      : consent.withdrawnAt != null
        ? t('privacy.statusWithdrawn', { date: shortFormatted(new Date(consent.withdrawnAt)) })
        : t('privacy.statusAccepted', {
            version: consent.policyVersion,
            date: shortFormatted(new Date(consent.acceptedAt)),
          });

  const confirmWithdraw = () => {
    Alert.alert(t('privacy.withdrawTitle'), t('privacy.withdrawMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('privacy.withdraw'), style: 'destructive', onPress: () => void withdraw() },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      <View style={styles.toolbar}>
        <Text
          numberOfLines={1}
          style={[carlibFont(17, 'medium'), styles.title, { color: colors.carlibDark }]}
        >
          {t('privacy.title')}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.close}>
          <Text style={[carlibFont(17, 'regular'), { color: colors.carlibSecondary }]}>
            {t('common.done')}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[text.body, { color: colors.carlibDark }]}>{t('privacy.policyIntro')}</Text>

        <View style={[styles.statusCard, { backgroundColor: colors.tileSecondary }]}>
          <Text style={[text.footnote, { color: colors.carlibSecondary }]}>{status}</Text>
        </View>

        <View style={[styles.toggleRow, { backgroundColor: colors.tileSecondary }]}>
          <View style={styles.toggleText}>
            <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
              {t('privacy.marketing')}
            </Text>
            <Text style={[text.caption, { color: colors.carlibSecondary }]}>
              {t('privacy.marketingHint')}
            </Text>
          </View>
          <Switch
            value={consent?.marketing === true}
            disabled={!covers}
            onValueChange={(value) => void setMarketing(value)}
            trackColor={{ true: colors.brandYellow }}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {covers ? (
          <Pressable onPress={confirmWithdraw} hitSlop={8} style={styles.withdraw}>
            <Text style={[text.body, { color: colors.destructiveRed }]}>{t('privacy.withdraw')}</Text>
          </Pressable>
        ) : (
          <CarlibButton
            label={t('privacy.accept', { version: POLICY_VERSION })}
            icon="shieldCheckLine"
            onPress={() => void accept(false).then(() => router.back())}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  toolbar: {
    minHeight: 44,
    marginTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { textAlign: 'center', marginHorizontal: 72 },
  close: { position: 'absolute', right: spacing.screenHorizontal },
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  statusCard: {
    borderRadius: radius.md,
    padding: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  toggleText: { flex: 1, gap: 2 },
  footer: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.xxl,
  },
  withdraw: { alignItems: 'center', paddingVertical: spacing.sm },
});
