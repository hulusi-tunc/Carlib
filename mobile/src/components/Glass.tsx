// The single glass abstraction from the migration plan (§2): Liquid Glass on
// iOS 26+, opaque themed card everywhere else (Android, older iOS, Reduce
// Transparency). Rules enforced here: uniform borderRadius only; never fade a
// GlassView via opacity (kills the effect) — toggle glassEffectStyle instead.
import {
  GlassContainer,
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
  type GlassEffectStyleConfig,
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
  /** A string, or `{ style, animate, animationDuration }` to animate between styles. */
  glassEffectStyle?: GlassStyle | GlassEffectStyleConfig;
  tintColor?: string;
  isInteractive?: boolean;
  /** Defaults to the app's resolved scheme, so a ThemeScope-forced subtree gets matching glass. */
  colorScheme?: 'light' | 'dark';
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
  colorScheme,
  style,
  fallbackStyle,
}: GlassProps) {
  const glass = useGlassAvailable();
  const { colors, scheme } = useTheme();

  if (glass) {
    return (
      <GlassView
        glassEffectStyle={glassEffectStyle}
        tintColor={tintColor}
        isInteractive={isInteractive}
        colorScheme={colorScheme ?? scheme}
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
          // The plan's Android fallback is an elevated opaque card, not blur mimicry.
          elevation: Platform.OS === 'android' ? 2 : 0,
        },
        style,
        fallbackStyle,
      ]}
    >
      {children}
    </View>
  );
}

export interface GlassGroupProps {
  children?: React.ReactNode;
  /** Distance at which sibling glass views start merging into each other. */
  spacing?: number;
  style?: StyleProp<ViewStyle>;
}

/** GlassContainer on glass-capable devices (lets sibling Glass views morph), a plain View elsewhere. */
export function GlassGroup({ children, spacing, style }: GlassGroupProps) {
  const glass = useGlassAvailable();
  if (glass) {
    return (
      <GlassContainer spacing={spacing} style={style}>
        {children}
      </GlassContainer>
    );
  }
  return <View style={style}>{children}</View>;
}
