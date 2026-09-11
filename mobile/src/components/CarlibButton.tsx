// Port of CarlibButton.swift — Revolut-style pill button, no strokes, weight
// hierarchy through fill. Primary flips (black-on-white in dark, white-on-black
// in light); ghost hugs its content instead of filling the row.
import { ActivityIndicator, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { PressableScale } from '@/components/PressableScale';
import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import { carlibFont, radius, spacing, useTheme, type ColorScheme, type ColorTokens } from '@/theme';

export type CarlibButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

export interface CarlibButtonProps {
  label: string;
  onPress: () => void;
  variant?: CarlibButtonVariant;
  icon?: RemixIconName;
  isLoading?: boolean;
  isDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

function variantColors(
  variant: CarlibButtonVariant,
  scheme: ColorScheme,
  colors: ColorTokens,
): { fg: string; bg: string } {
  switch (variant) {
    case 'primary':
      return scheme === 'dark'
        ? { fg: '#000000', bg: '#FFFFFF' }
        : { fg: '#FFFFFF', bg: '#000000' };
    case 'secondary':
      return { fg: colors.carlibDark, bg: colors.tileSecondary };
    case 'ghost':
      return { fg: colors.brandYellow, bg: 'transparent' };
    case 'destructive':
      return { fg: '#FFFFFF', bg: colors.destructiveRed };
  }
}

export function CarlibButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  isLoading = false,
  isDisabled = false,
  style,
}: CarlibButtonProps) {
  const { colors, scheme } = useTheme();
  const { fg, bg } = variantColors(variant, scheme, colors);

  return (
    <PressableScale
      scale={0.96}
      haptic="soft"
      onPress={onPress}
      disabled={isDisabled || isLoading}
      style={[
        styles.container,
        variant === 'ghost' ? styles.hugContent : styles.fullWidth,
        { backgroundColor: bg },
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon != null && <RemixIcon name={icon} size={18} color={fg} />}
          <Text style={[styles.label, { color: fg }]}>{label}</Text>
        </>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  fullWidth: { alignSelf: 'stretch' },
  hugContent: { alignSelf: 'center' },
  disabled: { opacity: 0.5 },
  label: carlibFont(15, 'medium'),
});
