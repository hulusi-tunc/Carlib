import '@/i18n';

import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { ThemeProvider, useTheme } from '@/theme';

// The root is a plain Slot (no navigator): NativeTabs must never be nested
// inside a Stack (expo/expo#42364 — iOS Release icon corruption). The (auth)
// group owns its own Stack; (driver)/(garage) render NativeTabs directly.
function ThemedShell() {
  const { scheme } = useTheme();
  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedShell />
    </ThemeProvider>
  );
}
