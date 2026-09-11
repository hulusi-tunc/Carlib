// Port of PolestarTile.swift — Polestar-inspired dashboard tile, icon at bottom corner.
import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { PressableScale } from '@/components/PressableScale';
import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import { radius, spacing, text, useTheme } from '@/theme';

export type PolestarTileVariant = 'primary' | 'secondary';
export type PolestarTileIconPosition = 'bottomLeading' | 'bottomTrailing';

export interface PolestarTileProps {
  title: string;
  subtitle?: string;
  icon: RemixIconName;
  iconPosition?: PolestarTileIconPosition;
  /** Defaults to the 34pt / 40%-alpha PolestarTile icon; the home shortcuts use 40pt solid. */
  iconSize?: number;
  iconColor?: string;
  variant?: PolestarTileVariant;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function PolestarTile({
  title,
  subtitle,
  icon,
  iconPosition = 'bottomLeading',
  iconSize = 34,
  iconColor,
  variant = 'secondary',
  onPress,
  style,
}: PolestarTileProps) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';

  return (
    <PressableScale
      scale={0.97}
      haptic="light"
      onPress={onPress}
      style={[
        styles.tile,
        { backgroundColor: isPrimary ? colors.tilePrimary : colors.tileSecondary },
        style,
      ]}
    >
      <RemixIcon
        name={icon}
        size={iconSize}
        // 0.4 alpha on carlibLabel via #RRGGBBAA suffix (0.4 × 255 = 0x66).
        color={iconColor ?? (isPrimary ? 'rgba(0, 0, 0, 0.2)' : `${colors.carlibLabel}66`)}
        style={[
          styles.icon,
          iconPosition === 'bottomLeading' ? styles.iconLeading : styles.iconTrailing,
        ]}
      />

      <View style={styles.textBlock}>
        {/* Yellow fill doesn't adapt to dark mode — explicit black, not carlibDark. */}
        <Text style={[text.title3, { color: isPrimary ? '#000000' : colors.carlibDark }]}>
          {title}
        </Text>
        {subtitle != null && (
          <Text
            style={[
              text.footnote,
              { color: isPrimary ? 'rgba(0, 0, 0, 0.6)' : colors.brandYellow },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  tile: {
    height: spacing.tileHeight,
    borderRadius: radius.lg,
    padding: spacing.tilePadding,
  },
  textBlock: {
    alignSelf: 'stretch',
    gap: 4,
  },
  icon: {
    position: 'absolute',
    bottom: spacing.tilePadding,
  },
  iconLeading: { left: spacing.tilePadding },
  iconTrailing: { right: spacing.tilePadding },
});
