// Port of Carlib/Views/Auth/SignUpView.swift.
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
import { CarlibSecureField, CarlibTextField } from '@/components/CarlibTextField';
import type { User } from '@/models/types';
import { signUp } from '@/services/auth';
import { useAppStore } from '@/stores/appStore';
import { carlibFont, spacing, text, useTheme } from '@/theme';
import { homeForRole } from '@/lib/routes';

export default function SignUpScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const completeAuth = useAppStore((s) => s.completeAuth);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = fullName.length > 0 && email.length > 0 && password.length >= 8;

  function finishAuth(user: User) {
    completeAuth(user);
    router.dismissAll();
    router.replace((user.role ? homeForRole(user.role) : '/role-selection') as never);
  }

  async function handleSignUp() {
    setError(null);
    setIsLoading(true);
    try {
      finishAuth(await signUp(fullName, email, password));
    } catch (e) {
      const key = e instanceof Error ? e.message : '';
      setError(
        key === 'signUp.errorInvalid' || key === 'signUp.errorExists'
          ? t(key)
          : t('signIn.errorInvalid'),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      <Stack.Screen
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [1.0],
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
            {t('signUp.title')}
          </Text>

          <View style={styles.form}>
            <CarlibTextField
              label={t('signUp.fullName')}
              placeholder="Laurent Dupont"
              value={fullName}
              onChangeText={setFullName}
              textContentType="name"
            />
            <CarlibTextField
              label={t('signUp.email')}
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            <CarlibSecureField
              label={t('signUp.password')}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              hint={t('signUp.passwordHint')}
            />
          </View>

          {error != null && (
            <Text style={[text.caption, styles.centered, { color: colors.destructiveRed }]}>
              {error}
            </Text>
          )}

          <CarlibButton
            label={t('signUp.createAccount')}
            onPress={() => void handleSignUp()}
            isLoading={isLoading}
            isDisabled={!isValid}
          />
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
  form: { gap: spacing.md },
});
