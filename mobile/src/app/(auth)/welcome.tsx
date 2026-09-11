// Port of WelcomeCarouselView.swift — Instagram-Stories onboarding carousel.
// Always light (Swift forces .preferredColorScheme(.light)).
// The Swift screen renders these strings with Text(verbatim:) — deliberately
// unlocalized, and absent from L10n.Welcome — so they stay hardcoded here
// instead of going through t('welcome.*').
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import CarlibLogo from '../../../assets/images/carlib-logo.svg';
import { CarlibButton } from '@/components/CarlibButton';
import { radius, spacing, text, ThemeScope, useTheme } from '@/theme';

const SLIDE_DURATION_MS = 4000;
const TICK_MS = 30;

interface Slide {
  headline: string;
  background: number;
}

const SLIDES: Slide[] = [
  {
    headline: 'Declare your accident in minutes',
    background: require('../../../assets/images/welcome-bg-1.png'),
  },
  {
    headline: 'Find a garage nearby',
    background: require('../../../assets/images/welcome-bg-2.png'),
  },
  {
    headline: 'Track repairs in real-time',
    background: require('../../../assets/images/welcome-bg-3.png'),
  },
  {
    headline: 'Trusted by garages in France',
    background: require('../../../assets/images/welcome-bg-4.png'),
  },
];

// Capsule filled by scaleX; RN scales from center, so a translateX recenters
// the scaled fill onto the left edge.
// Swift redraws the fill at 33fps via scaleEffect(x:); here the timer writes a
// shared value and the fill follows it on the UI thread — no React re-render.
function ProgressSegment({
  index,
  currentPage,
  progress,
}: {
  index: number;
  currentPage: number;
  progress: SharedValue<number>;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const fillStyle = useAnimatedStyle(() => {
    const fill = index < currentPage ? 1 : index === currentPage ? progress.value : 0;
    return {
      transform: [{ translateX: (-(1 - fill) * trackWidth) / 2 }, { scaleX: fill }],
    };
  });
  return (
    <View
      style={styles.segmentTrack}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
    >
      <Animated.View style={[styles.segmentFill, fillStyle]} />
    </View>
  );
}

function WelcomeCarousel() {
  const { colors } = useTheme();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const storyProgress = useSharedValue(0);
  const pausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopTimer() {
    if (timerRef.current != null) clearInterval(timerRef.current);
    timerRef.current = null;
  }

  function startTimer() {
    storyProgress.set(0);
    pausedRef.current = false;
    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;
      const next = storyProgress.get() + TICK_MS / SLIDE_DURATION_MS;
      if (next >= 1) {
        goNext();
      } else {
        storyProgress.set(next);
      }
    }, TICK_MS);
  }

  function restartTimer() {
    stopTimer();
    startTimer();
  }

  function goNext() {
    setCurrentPage((page) => (page < SLIDES.length - 1 ? page + 1 : 0));
    restartTimer();
  }

  function goBack() {
    setCurrentPage((page) => (page > 0 ? page - 1 : page));
    restartTimer();
  }

  function pause() {
    pausedRef.current = true;
  }

  function resume() {
    pausedRef.current = false;
  }

  function openSignUp() {
    stopTimer();
    router.push('/sign-up');
  }

  function openSignIn() {
    stopTimer();
    router.push('/sign-in');
  }

  // onAppear/onDisappear equivalent; also resumes after an auth sheet closes.
  useFocusEffect(
    useCallback(() => {
      startTimer();
      return () => stopTimer();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const slide = SLIDES[currentPage] ?? SLIDES[0]!;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <Image
        source={slide.background}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={250}
        accessibilityElementsHidden
      />
      {/* White → transparent top gradient keeps progress bars and headline legible. */}
      <LinearGradient
        colors={['#FFFFFF', 'rgba(255,255,255,0)']}
        locations={[0, 0.386]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
        <View style={styles.progressRow}>
          {SLIDES.map((_, i) => (
            <ProgressSegment key={i} index={i} currentPage={currentPage} progress={storyProgress} />
          ))}
        </View>

        <View style={styles.welcomeRow}>
          <Text style={[text.footnote, { color: colors.carlibSecondary }]}>Welcome to</Text>
          <View accessible accessibilityLabel="Carlib">
            <CarlibLogo width={43} height={14} />
          </View>
        </View>

        <Animated.Text
          key={currentPage}
          entering={FadeIn.duration(250)}
          exiting={FadeOut.duration(250)}
          style={[text.largeTitle, styles.headline]}
        >
          {slide.headline}
        </Animated.Text>

        {/* Tap left half = previous, right half = next; hold ≥0.2s pauses. */}
        <View style={styles.gestureLayer}>
          <Pressable
            style={styles.gestureHalf}
            onPress={goBack}
            onLongPress={pause}
            onPressOut={resume}
            delayLongPress={200}
          />
          <Pressable
            style={styles.gestureHalf}
            onPress={goNext}
            onLongPress={pause}
            onPressOut={resume}
            delayLongPress={200}
          />
        </View>

        <View style={styles.ctas}>
          <CarlibButton label="Create account" variant="primary" onPress={openSignUp} />
          <CarlibButton label="Log in" variant="secondary" onPress={openSignIn} />
        </View>
      </SafeAreaView>
    </View>
  );
}

export default function WelcomeScreen() {
  return (
    <ThemeScope scheme="light">
      <WelcomeCarousel />
    </ThemeScope>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'stretch',
  },
  progressRow: {
    flexDirection: 'row',
    gap: spacing.xxs,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  segmentTrack: {
    flex: 1,
    height: 3,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.15)',
    overflow: 'hidden',
  },
  segmentFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.full,
    backgroundColor: '#000000',
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  headline: {
    color: '#000000',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  gestureLayer: {
    flex: 1,
    flexDirection: 'row',
  },
  gestureHalf: {
    flex: 1,
  },
  ctas: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
