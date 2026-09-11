// Port of PressableButtonStyle (CarlibButtonStyle.swift): scale-down + haptic
// on touch-down only. Spring tuned to SwiftUI spring(response: 0.28,
// dampingFraction: 0.72): stiffness = (2π/0.28)² ≈ 503, damping = 2·0.72·√503 ≈ 32.
import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Platform, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const SPRING = { mass: 1, stiffness: 503, damping: 32 } as const;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type PressHaptic = 'soft' | 'light' | 'medium' | 'none';

const IOS_IMPACT: Record<Exclude<PressHaptic, 'none'>, Haptics.ImpactFeedbackStyle> = {
  soft: Haptics.ImpactFeedbackStyle.Soft,
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
};

function fireHaptic(haptic: PressHaptic) {
  if (haptic === 'none') return;
  if (Platform.OS === 'android') {
    // Docs recommend the AndroidHaptics presets over the Vibrator fallback.
    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Context_Click);
  } else {
    Haptics.impactAsync(IOS_IMPACT[haptic]);
  }
}

export interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  /** Pressed scale — 0.96 for buttons, 0.97 for tiles (iOS defaults). */
  scale?: number;
  haptic?: PressHaptic;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function PressableScale({
  scale = 0.96,
  haptic = 'soft',
  style,
  onPressIn,
  onPressOut,
  children,
  ...rest
}: PressableScaleProps) {
  const pressed = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressed.value }],
  }));

  const handlePressIn = useCallback<NonNullable<PressableProps['onPressIn']>>(
    (e) => {
      pressed.set(withSpring(scale, SPRING));
      fireHaptic(haptic);
      onPressIn?.(e);
    },
    [haptic, onPressIn, pressed, scale],
  );

  const handlePressOut = useCallback<NonNullable<PressableProps['onPressOut']>>(
    (e) => {
      pressed.set(withSpring(1, SPRING));
      onPressOut?.(e);
    },
    [onPressOut, pressed],
  );

  // One element that is both the pressable and the animated box, so `style`
  // lands where callers expect: layout (flex, width) reaches the touch target
  // instead of an inner wrapper, and the hit area matches the visual box.
  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
