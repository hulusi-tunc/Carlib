import { Stack } from 'expo-router';
import React from 'react';

import { stackHeaderOptions } from '@/components/stackHeaderOptions';
import { useTheme } from '@/theme';

export default function GarageClaimsStackLayout() {
  const { colors } = useTheme();
  return (
    <Stack screenOptions={stackHeaderOptions(colors)}>
      {/* Tab root draws its own large title. */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* Swift .toolbarBackground(.hidden): chevron only, over the status hero. */}
      <Stack.Screen name="claim/[id]" options={{ title: '' }} />
      {/* Full-screen lightbox and the repair-status sheet keep their own chrome. */}
      <Stack.Screen name="lightbox" options={{ headerShown: false }} />
      <Stack.Screen name="repair-status" options={{ headerShown: false }} />
    </Stack>
  );
}
