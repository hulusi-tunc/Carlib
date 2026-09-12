import { Stack } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { stackHeaderOptions } from '@/components/stackHeaderOptions';
import { useTheme } from '@/theme';

export default function HomeStackLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <Stack screenOptions={stackHeaderOptions(colors)}>
      {/* Tab root draws its own large title. */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="claims" options={{ title: t('driverClaims.title') }} />
      <Stack.Screen name="my-garage" options={{ title: t('driverHome.shortcutMyGarageTitle') }} />
      <Stack.Screen name="declare" options={{ title: t('declaration.title') }} />
      <Stack.Screen name="notifications" options={{ title: t('notifications.title') }} />
      {/* Swift .toolbarBackground(.hidden): chevron only, over the status hero. */}
      <Stack.Screen name="claim/[id]" options={{ title: '' }} />
      <Stack.Screen name="declare-confirm" options={{ headerShown: false }} />
      {/* Form sheets never get a native bar — they keep their own title rows. */}
      <Stack.Screen name="add-vehicle" options={{ headerShown: false }} />
      <Stack.Screen name="privacy" options={{ headerShown: false }} />
      <Stack.Screen
        name="claim/booking"
        options={{
          headerShown: false,
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [1],
        }}
      />
    </Stack>
  );
}
