import { Stack } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { stackHeaderOptions } from '@/components/stackHeaderOptions';
import { useTheme } from '@/theme';

export default function ProfileStackLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <Stack screenOptions={stackHeaderOptions(colors)}>
      {/* Tab root draws its own large title. */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ title: t('settings.title') }} />
      <Stack.Screen name="vehicle/[id]" options={{ title: t('vehicleDetail.title') }} />
      <Stack.Screen name="gallery" options={{ title: 'Gallery' }} />
      {/* Form sheets never get a native bar — they keep their own title rows. */}
      <Stack.Screen name="edit" options={{ headerShown: false }} />
      <Stack.Screen name="change-password" options={{ headerShown: false }} />
      <Stack.Screen name="language" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
    </Stack>
  );
}
