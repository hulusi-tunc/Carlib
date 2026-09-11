// Ported from Carlib/DesignSystem/CarlibTypography.swift.
// Aeonik has no semibold cut — semibold collapses to Bold, matching iOS.
// SwiftUI computed line heights implicitly; RN needs them explicit (~1.25x).
import type { TextStyle } from 'react-native';

export type FontWeight = 'light' | 'regular' | 'medium' | 'bold';

export const fontFamilies: Record<FontWeight, string> = {
  light: 'Aeonik-Light',
  regular: 'Aeonik-Regular',
  medium: 'Aeonik-Medium',
  bold: 'Aeonik-Bold',
};

export function carlibFont(size: number, weight: FontWeight = 'medium'): TextStyle {
  return {
    fontFamily: fontFamilies[weight],
    fontSize: size,
    lineHeight: Math.round(size * 1.25),
  };
}

// Core scale — all titles default to .medium per current design direction.
export const text = {
  largeTitle: carlibFont(28, 'medium'),
  title1: carlibFont(26, 'medium'),
  title2: carlibFont(22, 'medium'),
  title3: carlibFont(17, 'medium'),
  body: carlibFont(15, 'regular'),
  callout: carlibFont(14, 'medium'),
  footnote: carlibFont(13, 'regular'),
  // Deliberately bumped from 11 for post-accident readability.
  caption: carlibFont(13, 'medium'),
  // Off-scale styles
  heroNumber: carlibFont(48, 'bold'),
  amount: carlibFont(36, 'bold'),
  splashHero: carlibFont(42, 'medium'),
  cardHero: carlibFont(24, 'medium'),
  sectionProminent: carlibFont(20, 'medium'),
  statValue: carlibFont(18, 'medium'),
  statValueLarge: carlibFont(36, 'medium'),
  micro: carlibFont(11, 'regular'),
  microBody: carlibFont(12, 'regular'),
  heroLarge: carlibFont(72, 'medium'),
} satisfies Record<string, TextStyle>;

export type TextToken = keyof typeof text;

/** Swift `sectionHeaderStyle()`: caption + tracking 0.8 + UPPERCASE + carlibLabel color (apply color at call site). */
export const sectionHeaderText: TextStyle = {
  ...carlibFont(13, 'medium'),
  letterSpacing: 0.8,
  textTransform: 'uppercase',
};
