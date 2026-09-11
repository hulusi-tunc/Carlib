// Carousel page indicator — a 6pt dot that widens into a pill when active.
// The dashboard request pager springs (GarageDashboardView.swift); the shops
// carousel eases over 0.2s (GarageSearchView.swift:431).
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const DOT = 6;
// Swift .spring(response: 0.35, dampingFraction: 0.85).
const DOT_SPRING = { mass: 1, stiffness: 322, damping: 30 } as const;
const DOT_EASE = { duration: 200, easing: Easing.inOut(Easing.ease) } as const;

export interface PageDotProps {
  active: boolean;
  activeColor: string;
  inactiveColor: string;
  /** Pill width when active. */
  activeWidth?: number;
  /** Match the curve the Swift screen used. */
  curve?: 'spring' | 'ease';
}

export function PageDot({
  active,
  activeColor,
  inactiveColor,
  activeWidth = 18,
  curve = 'spring',
}: PageDotProps) {
  const width = useSharedValue(active ? activeWidth : DOT);
  useEffect(() => {
    const to = active ? activeWidth : DOT;
    width.set(curve === 'spring' ? withSpring(to, DOT_SPRING) : withTiming(to, DOT_EASE));
  }, [active, activeWidth, curve, width]);
  const animatedStyle = useAnimatedStyle(() => ({ width: width.value }));
  return (
    <Animated.View
      style={[styles.dot, animatedStyle, { backgroundColor: active ? activeColor : inactiveColor }]}
    />
  );
}

const styles = StyleSheet.create({
  dot: { height: DOT, borderRadius: DOT / 2 },
});
