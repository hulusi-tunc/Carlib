// Port of Carlib/Views/Auth/ForgotPasswordView.swift — UI-only fake success,
// no service call exists (matches iOS).
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CarlibButton } from '@/components/CarlibButton';
import { CarlibTextField } from '@/components/CarlibTextField';
import { RemixIcon } from '@/components/RemixIcon';
import { carlibFont, spacing, text, useTheme } from '@/theme';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      <Stack.Screen
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.5, 1.0],
          sheetGrabberVisible: true,
        }}
      />
      <View style={styles.toolbar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={[styles.cancel, { color: colors.carlibSecondary }]}>
            {t('common.cancel')}
          </Text>
        </Pressable>
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[text.title1, styles.centered, { color: colors.carlibDark }]}>
            {t('forgotPassword.title')}
          </Text>

          <Text style={[text.body, styles.centered, { color: colors.carlibSecondary }]}>
            {t('forgotPassword.subtitle')}
          </Text>

          {sent ? (
            <View style={styles.success}>
              <RemixIcon name="checkboxCircleFill" size={48} color={colors.status.completed.fg} />
              <Text style={[styles.successText, { color: colors.carlibDark }]}>
                {t('forgotPassword.success')}
              </Text>
            </View>
          ) : (
            <>
              <CarlibTextField
                label={t('forgotPassword.email')}
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <CarlibButton
                label={t('forgotPassword.send')}
                onPress={() => setSent(true)}
                isDisabled={email.length === 0}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  cancel: carlibFont(17, 'regular'),
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  centered: { textAlign: 'center' },
  success: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.lg,
  },
  successText: {
    ...carlibFont(15, 'medium'),
    textAlign: 'center',
  },
});
