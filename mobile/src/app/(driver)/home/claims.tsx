// Port of Carlib/Views/Driver/DriverClaimsListView.swift — archive of past
// claims (completed, cancelled, expired). The home stack hides native headers,
// so the inline nav title + back chevron are drawn here.
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

import { ClaimCard } from '@/components/ClaimCard';
import { EmptyState } from '@/components/EmptyState';
import { selectPastClaims, useClaimStore } from '@/stores/claimStore';
import { spacing, useTheme } from '@/theme';

export default function DriverClaimsListScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const pastClaims = useClaimStore(useShallow(selectPastClaims));

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      {pastClaims.length === 0 ? (
        <EmptyState
          icon="inboxLine"
          title={t('driverClaims.emptyTitle')}
          description={t('driverClaims.emptyDescription')}
        />
      ) : (
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.list}>
          {pastClaims.map((claim) => (
            <Pressable key={claim.id} onPress={() => router.push(`/home/claim/${claim.id}`)}>
              <ClaimCard claim={claim} />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
