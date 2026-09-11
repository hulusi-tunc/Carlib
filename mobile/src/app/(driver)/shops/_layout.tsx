import { Stack } from 'expo-router';
import React from 'react';

import { stackHeaderOptions } from '@/components/stackHeaderOptions';
import { useTheme } from '@/theme';

export default function ShopsStackLayout() {
  const { colors } = useTheme();
  return (
    <Stack screenOptions={stackHeaderOptions(colors)}>
      {/* The map screen hides the bar (Swift .toolbar(.hidden)). */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* GarageDetailView: inline bar, chevron only. */}
      <Stack.Screen name="garage/[id]" options={{ title: '' }} />
      <Stack.Screen
        name="garage/booking"
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
