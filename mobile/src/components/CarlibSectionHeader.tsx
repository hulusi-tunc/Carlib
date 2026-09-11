// Port of CarlibSectionHeader.swift — title row with optional trailing action.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { carlibFont, spacing, text, useTheme } from '@/theme';

export interface CarlibSectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function CarlibSectionHeader({ title, actionLabel, onAction }: CarlibSectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <Text style={[text.title3, { color: colors.carlibDark }]}>{title}</Text>
      {actionLabel != null && onAction != null && (
        <Pressable
          onPress={onAction}
          hitSlop={12}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Text style={[styles.actionLabel, { color: colors.brandYellow }]}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
  },
  // SwiftUI default Button press dim.
  pressed: {
    opacity: 0.3,
  },
  actionLabel: carlibFont(13, 'medium'),
});
