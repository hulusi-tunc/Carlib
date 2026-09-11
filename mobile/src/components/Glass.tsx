// The single glass abstraction from the migration plan (§2): Liquid Glass on
// iOS 26+, opaque themed card everywhere else (Android, older iOS, Reduce
// Transparency). Rules enforced here: uniform borderRadius only; never fade a
// GlassView via opacity (kills the effect) — toggle glassEffectStyle instead.
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
  type GlassStyle,
} from 'expo-glass-effect';
import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

const deviceSupportsGlass =
  Platform.OS === 'ios' && isGlassEffectAPIAvailable() && isLiquidGlassAvailable();

/** True when GlassView will actually render glass (and the user hasn't reduced transparency). */
export function useGlassAvailable(): boolean {
  const [reduceTransparency, setReduceTransparency] = useState(false);

  useEffect(() => {
    if (!deviceSupportsGlass) return;
    let mounted = true;
    AccessibilityInfo.isReduceTransparencyEnabled().then((v) => {
      if (mounted) setReduceTransparency(v);
    });
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduceTransparency);
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return deviceSupportsGlass && !reduceTransparency;
}

export interface GlassProps {
  children?: React.ReactNode;
  /** Uniform radius only — per-corner radii are broken on GlassView. */
  borderRadius?: number;
  glassEffectStyle?: GlassStyle;
  tintColor?: string;
  isInteractive?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Extra styling for the non-glass fallback card (overrides the themed default). */
  fallbackStyle?: StyleProp<ViewStyle>;
}

export function Glass({
  children,
  borderRadius = 24,
  glassEffectStyle = 'regular',
  tintColor,
  isInteractive,
  style,
  fallbackStyle,
}: GlassProps) {
  const glass = useGlassAvailable();
  const { colors } = useTheme();

  if (glass) {
    return (
      <GlassView
        glassEffectStyle={glassEffectStyle}
        tintColor={tintColor}
        isInteractive={isInteractive}
        style={[{ borderRadius, overflow: 'hidden' }, style]}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <View
      style={[
        {
          borderRadius,
          overflow: 'hidden',
          backgroundColor: colors.tileSecondary,
          borderWidth: 1,
          borderColor: colors.carlibCardBorder,
        },
        style,
        fallbackStyle,
      ]}
    >
      {children}
    </View>
  );
}
