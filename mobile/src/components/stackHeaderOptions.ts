// Shared native-stack header options for every card-push screen, replacing the
// hand-drawn back-chevron rows. SwiftUI gave these screens an inline
// navigation bar; on iOS 26 the native bar is Liquid Glass for free.
//
// iOS 26+: the bar owns its material — setting headerBlurEffect would overlap
// the scroll-edge effect (react-navigation native-stack types.d.ts). Older
// iOS: 'regular' = systemMaterial behind a transparent bar. Android: opaque.
// Form sheets never get a native bar (react-native-screens presents them
// without a navigation controller), so sheet routes keep their own title rows.
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import type { Stack } from 'expo-router';
import type { ComponentProps } from 'react';
import { Platform } from 'react-native';

import { fontFamilies, type ColorTokens } from '@/theme';

type StackScreenOptions = Exclude<
  ComponentProps<typeof Stack.Screen>['options'],
  undefined | ((...args: never[]) => unknown)
>;

const liquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

export interface StackHeaderVariant {
  /** Opaque bar (escape hatch if a group shows the expo#41025 glass flicker). */
  opaque?: boolean;
}

export function stackHeaderOptions(
  colors: ColorTokens,
  { opaque = false }: StackHeaderVariant = {},
): StackScreenOptions {
  const transparent = Platform.OS === 'ios' && !opaque;
  return {
    headerShown: true,
    headerTransparent: transparent,
    headerBlurEffect: transparent && !liquidGlass ? 'regular' : undefined,
    headerStyle: transparent ? undefined : { backgroundColor: colors.carlibScreenBg },
    headerShadowVisible: false,
    headerTintColor: colors.carlibDark,
    headerTitleStyle: { fontFamily: fontFamilies.medium, fontSize: 17, color: colors.carlibDark },
    headerTitleAlign: 'center',
    // SwiftUI inline bar: chevron only, no back title.
    headerBackButtonDisplayMode: 'minimal',
    contentStyle: { backgroundColor: colors.carlibScreenBg },
  };
}
