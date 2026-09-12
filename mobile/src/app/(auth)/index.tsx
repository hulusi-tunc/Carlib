// Ported from Carlib/Views/Onboarding/SplashView.swift. Always dark regardless
// of theme: the yellow splash glow rises from below the screen while the
// wordmark settles in, then a subtle breathe pulse runs during the auth check.
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { checkExistingSession } from '@/services/auth';
import { defaultUsers } from '@/services/defaultUsers';
import { useAppStore } from '@/stores/appStore';
import { ThemeScope } from '@/theme';
import { homeForRole } from '@/lib/routes';

import CarlibLogo from '../../../assets/images/carlib-logo.svg';

// SplashView hardcodes Color(red: 0.102, ...) = #1a1a1a for the backdrop.
const BACKGROUND = '#1a1a1a';
// SwiftUI .easeOut / .easeInOut curves.
const easeOut = Easing.bezier(0, 0, 0.58, 1);
const easeInOut = Easing.bezier(0.42, 0, 0.58, 1);

export default function Splash() {
  const router = useRouter();
  const completeAuth = useAppStore((state) => state.completeAuth);
  const setPendingDriverTab = useAppStore((state) => state.setPendingDriverTab);
  const { width, height } = useWindowDimensions();

  const glowOpacity = useSharedValue(0);
  const glowProgress = useSharedValue(0); // 0 = raised, 1 = settled
  const wordmarkOpacity = useSharedValue(0);
  const wordmarkScale = useSharedValue(0.9);
  const breathe = useSharedValue(1);

  const raisedOffset = height * 0.08;

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [
      // translateY before rotate so the rise happens in screen space.
      { translateY: raisedOffset * (1 - glowProgress.value) },
      { rotate: '42.45deg' },
    ],
  }));

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
    transform: [{ scale: wordmarkScale.value * breathe.value }],
  }));

  useEffect(() => {
    // Stage 1 — glow rises + fades in.
    glowOpacity.set(withTiming(1, { duration: 900, easing: easeOut }));
    glowProgress.set(withTiming(1, { duration: 900, easing: easeOut }));
    // Stage 2 — wordmark settles in ~250ms after the glow starts.
    wordmarkOpacity.set(withDelay(250, withTiming(1, { duration: 600, easing: easeOut })));
    wordmarkScale.set(withDelay(250, withTiming(1, { duration: 600, easing: easeOut })));
    // Stage 3 — ongoing breathe while we wait on the auth check.
    breathe.set(
      withDelay(
      900,
      withRepeat(withTiming(1.03, { duration: 1400, easing: easeInOut }), -1, true),
      ),
    );
  }, [glowOpacity, glowProgress, wordmarkOpacity, wordmarkScale, breathe]);

  useEffect(() => {
    let cancelled = false;
    // SplashView waits 0.3s + 1.2s before resolving the session.
    const timer = setTimeout(() => {
      // RN port of DebugScreenshotHelper: building with
      // EXPO_PUBLIC_CARLIB_SEED=<seed email> force-signs-in that seed user
      // (skips SecureStore) for screenshot automation.
      const seedEmail = process.env.EXPO_PUBLIC_CARLIB_SEED;
      const seed = seedEmail ? defaultUsers.find((c) => c.email === seedEmail) : undefined;
      if (seed) {
        if (!cancelled) {
          completeAuth(seed.user);
          router.replace(
            (seed.user.role == null ? '/role-selection' : homeForRole(seed.user.role)) as never,
          );
          // Landing on another tab goes through the pending-tab intent, like the
          // app's own cross-flow switches: a replace aimed straight at the tab
          // while the NativeTabs shell is still mounting leaves it on Home.
          const seedTab = process.env.EXPO_PUBLIC_CARLIB_TAB;
          if (seedTab === 'shops' || seedTab === 'profile') setPendingDriverTab(seedTab);
          // Twin of CARLIB_SHEET: EXPO_PUBLIC_CARLIB_ROUTES pushes each route
          // in turn, EXPO_PUBLIC_CARLIB_ROUTE_DWELL ms apart (default 5000), so
          // one build can be captured screen by screen.
          const routeList: string = process.env.EXPO_PUBLIC_CARLIB_ROUTES ?? '';
          const routes = routeList
            .split(',')
            .map((route) => route.trim())
            .filter(Boolean);
          const dwell = Number(process.env.EXPO_PUBLIC_CARLIB_ROUTE_DWELL ?? 5000);
          routes.forEach((route, index) => {
            setTimeout(() => router.push(route as never), dwell * (index + 1));
          });
        }
        return;
      }
      void checkExistingSession().then((user) => {
        if (cancelled) return;
        if (user) {
          completeAuth(user);
          router.replace((user.role != null ? homeForRole(user.role) : '/role-selection') as never);
        } else {
          router.replace('/welcome');
        }
      });
    }, 1500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [completeAuth, router, setPendingDriverTab]);

  const glowWidth = width * 2.2;
  const glowHeight = height * 2.2;
  const glowFrame = {
    width: glowWidth,
    height: glowHeight,
    left: width / 2 - glowWidth / 2,
    // Resting center sits at screenHeight * 1.15 (SplashView finalY).
    top: height * 1.15 - glowHeight / 2,
  };

  return (
    <ThemeScope scheme="dark">
      <View style={styles.container}>
        <StatusBar style="light" />
        <Animated.Image
          source={require('../../../assets/images/onboarding-splash.png')}
          resizeMode="cover"
          accessible={false}
          style={[styles.glow, glowFrame, glowStyle]}
        />
        <Animated.View style={wordmarkStyle}>
          <CarlibLogo width={120} height={39} />
        </Animated.View>
      </View>
    </ThemeScope>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    pointerEvents: 'none',
  },
});
