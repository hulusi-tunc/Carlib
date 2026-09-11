// Port of the ContentUnavailableView pattern the iOS app uses for empty and
// not-found states: 48pt icon, title, description, centered on the screen.
import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import { spacing, text, useTheme } from '@/theme';

export interface EmptyStateProps {
  icon: RemixIconName;
  title: string;
  description: string;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({ icon, title, description, style }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: colors.carlibScreenBg }, style]}>
      <RemixIcon name={icon} size={48} color={colors.carlibSecondary} />
      <Text style={[text.title3, styles.centered, { color: colors.carlibDark }]}>{title}</Text>
      <Text style={[text.footnote, styles.centered, { color: colors.carlibSecondary }]}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xxl,
  },
  centered: { textAlign: 'center' },
});
