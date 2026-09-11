import { Stack } from 'expo-router';
import React from 'react';

import { useTheme } from '@/theme';

export default function TabStackLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.carlibScreenBg },
      }}
    />
  );
}
