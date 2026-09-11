// Port of Carlib/Views/Auth/SignInView.swift; Apple button treatment follows
// AuthGatewayView.swift (52pt, capsule, divider with "or").
import * as AppleAuthentication from 'expo-apple-authentication';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
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
import { signIn, signInWithApple } from '@/services/auth';
import { useAppStore } from '@/stores/appStore';
import { carlibFont, spacing, text, useTheme } from '@/theme';
import { homeForRole } from '@/lib/routes';

export default function SignInScreen() {
  const { t } = useTranslation();
  const { colors, scheme } = useTheme();
  const completeAuth = useAppStore((s) => s.completeAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    AppleAuthentication.isAvailableAsync()
      .then(setAppleAvailable)
      .catch(() => setAppleAvailable(false));
  }, []);

  function finishAuth(user: User) {
    completeAuth(user);
    router.dismissAll();
    router.replace((user.role ? homeForRole(user.role) : '/role-selection') as never);
  }

  async function handleSignIn() {
    setError(null);
    setIsLoading(true);
    try {
      finishAuth(await signIn(email, password));
    } catch {
      setError(t('signIn.errorInvalid'));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAppleSignIn() {
    setError(null);
    try {
      const user = await signInWithApple();
      if (user) finishAuth(user); // null = cancelled or unavailable
    } catch (e) {
      // Parity with AuthService.handleAppleSignIn — raw error text, no L10n.
      setError(e instanceof Error ? e.message : t('signIn.errorInvalid'));
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
            {t('signIn.title')}
          </Text>

          <View style={styles.form}>
            <CarlibTextField
              label={t('signIn.email')}
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            <CarlibSecureField
              label={t('signIn.password')}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
            />
            <Pressable
              style={styles.forgotRow}
              onPress={() => router.push('/forgot-password')}
              hitSlop={8}
            >
              <Text style={[text.caption, { color: colors.brandYellow }]}>
                {t('signIn.forgotPassword')}
              </Text>
            </Pressable>
          </View>

          {error != null && (
            <Text style={[text.caption, styles.centered, { color: colors.destructiveRed }]}>
              {error}
            </Text>
          )}

          <CarlibButton
            label={t('signIn.signIn')}
            onPress={() => void handleSignIn()}
            isLoading={isLoading}
            isDisabled={email.length === 0 || password.length === 0}
          />

          {appleAvailable && (
            <>
              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: colors.carlibCardBorder }]} />
                <Text style={[text.caption, { color: colors.carlibLabel }]}>{t('auth.or')}</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.carlibCardBorder }]} />
              </View>
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                // Swift uses .white; the outline only exists to separate the white
                // capsule from a white screen, so drop it on the dark background.
                buttonStyle={
                  scheme === 'dark'
                    ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                    : AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE
                }
                cornerRadius={26}
                style={styles.appleButton}
                onPress={() => void handleAppleSignIn()}
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
  form: { gap: spacing.md },
  forgotRow: { alignSelf: 'flex-end' },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dividerLine: { flex: 1, height: 0.5 },
  appleButton: { height: 52, alignSelf: 'stretch' },
});
