// Port of Carlib/Views/Driver/DriverClaimsListView.swift — archive of past
// claims (completed, cancelled, expired). The home stack hides native headers,
// so the inline nav title + back chevron are drawn here.
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { ClaimCard } from '@/components/ClaimCard';
import { RemixIcon } from '@/components/RemixIcon';
import { selectPastClaims, useClaimStore } from '@/stores/claimStore';
import { carlibFont, spacing, text, useTheme } from '@/theme';

export default function DriverClaimsListScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const pastClaims = useClaimStore(useShallow(selectPastClaims));

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
          <RemixIcon name="arrowLeftSLine" size={26} color={colors.carlibDark} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.carlibDark }]}>
          {t('driverClaims.title')}
        </Text>
        <View style={styles.backButton} />
      </View>

      {pastClaims.length === 0 ? (
        // ContentUnavailableView port: icon + title + description, centered.
        <View style={styles.empty}>
          <RemixIcon name="inboxLine" size={48} color={colors.carlibSecondary} />
          <Text style={[text.title3, styles.centered, { color: colors.carlibDark }]}>
            {t('driverClaims.emptyTitle')}
          </Text>
          <Text style={[text.footnote, styles.centered, { color: colors.carlibSecondary }]}>
            {t('driverClaims.emptyDescription')}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {pastClaims.map((claim) => (
            <Pressable key={claim.id} onPress={() => router.push(`/home/claim/${claim.id}`)}>
              <ClaimCard claim={claim} />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: spacing.xxs,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...carlibFont(17, 'medium'),
    flex: 1,
    textAlign: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xxl,
  },
  centered: { textAlign: 'center' },
  list: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
