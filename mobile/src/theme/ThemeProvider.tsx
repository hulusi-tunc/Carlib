// Replaces the iOS app_theme @AppStorage + .preferredColorScheme wiring.
// Persisted default is 'light' (NOT 'system') to match the iOS fallback —
// first-run on an OS-dark device must render light, like the Swift app.
// <ThemeScope scheme="dark"> replicates SwiftUI's per-screen
// .preferredColorScheme forces (Splash always dark, WelcomeCarousel always light).
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type ColorTokens } from './colors';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'app_theme';
const DEFAULT_MODE: ThemeMode = 'light';

interface ThemeContextValue {
  /** The user's stored preference (Settings chips). */
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** The effective scheme after resolving 'system' and any ThemeScope force. */
  scheme: ColorScheme;
  colors: ColorTokens;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Screenshot harness: EXPO_PUBLIC_CARLIB_THEME forces a mode at build time.
const FORCED_MODE: ThemeMode | null = (() => {
  const forced = process.env.EXPO_PUBLIC_CARLIB_THEME;
  return forced === 'dark' || forced === 'light' || forced === 'system' ? forced : null;
})();

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(() => FORCED_MODE ?? DEFAULT_MODE);

  useEffect(() => {
    if (FORCED_MODE != null) return;
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'system' || stored === 'light' || stored === 'dark') {
        setModeState(stored);
      }
    });
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  const scheme: ColorScheme =
    mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode,
      scheme,
      colors: scheme === 'dark' ? darkColors : lightColors,
    }),
    [mode, setMode, scheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Forces a scheme for a subtree — Splash is always dark, WelcomeCarousel always light. */
export function ThemeScope({
  scheme,
  children,
}: {
  scheme: ColorScheme;
  children: React.ReactNode;
}) {
  const parent = useTheme();
  const value = useMemo<ThemeContextValue>(
    () => ({
      mode: parent.mode,
      setMode: parent.setMode,
      scheme,
      colors: scheme === 'dark' ? darkColors : lightColors,
    }),
    [parent.mode, parent.setMode, scheme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
