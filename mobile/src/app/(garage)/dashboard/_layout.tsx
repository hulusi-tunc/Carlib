import { Stack } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { stackHeaderOptions } from '@/components/stackHeaderOptions';
import { useTheme } from '@/theme';

export default function GarageDashboardStackLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <Stack screenOptions={stackHeaderOptions(colors)}>
      {/* Tab root draws its own large title. */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* Swift .toolbarBackground(.hidden): chevron only, over the status hero. */}
      <Stack.Screen name="claim/[id]" options={{ title: '' }} />
      <Stack.Screen name="notifications" options={{ title: t('notifications.title') }} />
    </Stack>
  );
}
