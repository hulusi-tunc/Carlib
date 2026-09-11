// Port of CarlibTextField.swift + CarlibSecureField.swift.
// No focus styling — deliberate (the Swift fields track focus but never style it).
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from 'react-native';

import { RemixIcon } from '@/components/RemixIcon';
import { radius, spacing, text, useTheme } from '@/theme';

export interface CarlibTextFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: KeyboardTypeOptions;
  textContentType?: TextInputProps['textContentType'];
  error?: string;
}

export function CarlibTextField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  textContentType,
  error,
}: CarlibTextFieldProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[text.callout, { color: colors.carlibSecondary }]}>{label}</Text>
      <TextInput
        style={[styles.input, text.body, { backgroundColor: colors.tileSecondary, color: colors.carlibDark }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.carlibLabel}
        keyboardType={keyboardType}
        textContentType={textContentType}
        autoCorrect={false}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
      />
      {error != null && (
        <Text style={[text.caption, { color: colors.destructiveRed }]}>{error}</Text>
      )}
    </View>
  );
}

export interface CarlibSecureFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  hint?: string;
  error?: string;
}

export function CarlibSecureField({
  label,
  placeholder,
  value,
  onChangeText,
  hint,
  error,
}: CarlibSecureFieldProps) {
  const { colors } = useTheme();
  const [revealed, setRevealed] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[text.callout, { color: colors.carlibSecondary }]}>{label}</Text>
      <View style={[styles.row, { backgroundColor: colors.tileSecondary }]}>
        <TextInput
          style={[styles.rowInput, text.body, { color: colors.carlibDark }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.carlibLabel}
          secureTextEntry={!revealed}
          textContentType="password"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Pressable onPress={() => setRevealed((r) => !r)} hitSlop={12}>
          <RemixIcon
            name={revealed ? 'eyeOffLine' : 'eyeLine'}
            size={18}
            color={colors.carlibSecondary}
          />
        </Pressable>
      </View>
      {error != null ? (
        <Text style={[text.caption, { color: colors.destructiveRed }]}>{error}</Text>
      ) : hint != null ? (
        <Text style={[text.caption, { color: colors.carlibLabel }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  input: {
    height: 52,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    // Android TextInput ships with default vertical padding.
    paddingVertical: 0,
  },
  row: {
    height: 52,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowInput: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
});
