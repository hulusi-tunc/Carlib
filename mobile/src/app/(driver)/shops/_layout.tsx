import { Stack } from 'expo-router';
import React from 'react';

import { useTheme } from '@/theme';

export default function ShopsStackLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.carlibScreenBg },
      }}
    >
      <Stack.Screen
        name="garage/booking"
        options={{
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [1],
        }}
      />
    </Stack>
  );
}
