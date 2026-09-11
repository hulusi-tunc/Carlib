import { Stack } from 'expo-router';
import React from 'react';

import { useTheme } from '@/theme';

export default function AuthLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.carlibScreenBg },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen
        name="sign-in"
        options={{
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [1],
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [1],
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.5, 1],
        }}
      />
      <Stack.Screen name="role-selection" />
    </Stack>
  );
}
