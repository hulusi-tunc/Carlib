import '@/i18n';

import { Slot, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, useReducedMotion } from 'react-native-reanimated';

import { ThemeProvider, useTheme } from '@/theme';

// The root is a plain Slot (no navigator): NativeTabs must never be nested
// inside a Stack (expo/expo#42364 — iOS Release icon corruption). The (auth)
// group owns its own Stack; (driver)/(garage) render NativeTabs directly.
//
// Shell changes — splash → role shell, sign-out — cross-fade like Swift's
// .animation(.easeInOut(0.3), value: authStatus). Keyed on the top-level
// segment, which changes exactly when the shell does. Only the (auth) shell
// fades out: a UITabBarController lingering after unmount is the expo#41025
// flicker path, so the tab shells cut and the incoming shell fades over the
// screen background.
function ThemedShell() {
  const { scheme, colors } = useTheme();
  const group = useSegments()[0] ?? '(auth)';
  const duration = useReducedMotion() ? 0 : 300;
  return (
    <View style={[styles.root, { backgroundColor: colors.carlibScreenBg }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Animated.View
        key={group}
        style={StyleSheet.absoluteFill}
        entering={FadeIn.duration(duration)}
        exiting={group === '(auth)' ? FadeOut.duration(duration) : undefined}
      >
        <Slot />
      </Animated.View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedShell />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
