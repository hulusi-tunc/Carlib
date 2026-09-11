// Port of CarlibCard.swift — reusable card container.
import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { radius, spacing, useTheme } from '@/theme';

export type CarlibCardVariant = 'flat' | 'elevated';

export interface CarlibCardProps {
  variant?: CarlibCardVariant;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function CarlibCard({ variant = 'flat', style, children }: CarlibCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: colors.tileSecondary },
        // SwiftUI strokeBorder doesn't inset content; RN borders do — keep content at 16.
        variant === 'elevated' && {
          padding: spacing.cardPadding - 1,
          borderWidth: 1,
          borderColor: colors.carlibCardBorder,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: spacing.cardPadding,
    borderRadius: radius.lg,
    alignSelf: 'stretch',
    alignItems: 'flex-start',
  },
});
