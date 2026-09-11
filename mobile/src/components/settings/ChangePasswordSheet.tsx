// Port of Carlib/Views/Shared/ChangePasswordView.swift. Success is a visual-only
// no-op — nothing persists (INTENTIONAL iOS parity; no backend). Current password
// is only verified for seed accounts, exactly like the Swift DefaultUsers check.
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CarlibButton } from '@/components/CarlibButton';
import { CarlibSecureField } from '@/components/CarlibTextField';
import { authenticate, isSeedEmail } from '@/services/defaultUsers';
import { useAppStore } from '@/stores/appStore';
import { carlibFont, spacing, text, useTheme } from '@/theme';

export function ChangePasswordSheet() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);

  const [current, setCurrent] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [currentError, setCurrentError] = useState<string | undefined>();
  const [newError, setNewError] = useState<string | undefined>();
  const [confirmError, setConfirmError] = useState<string | undefined>();

  const canSubmit = current.length > 0 && newPassword.length >= 8 && confirm.length > 0;

  const submit = () => {
    setCurrentError(undefined);
    setNewError(undefined);
    setConfirmError(undefined);

    if (newPassword.length < 8) {
      setNewError(t('changePassword.errorTooShort'));
      return;
    }
    if (newPassword !== confirm) {
      setConfirmError(t('changePassword.errorMismatch'));
      return;
    }

    // Sign-up users never had a password persisted, so any non-empty string
    // passes for them — placeholder until a real backend lands (iOS parity).
    const email = currentUser?.email;
    if (email && isSeedEmail(email) && authenticate(email, current) == null) {
      setCurrentError(t('changePassword.errorCurrentWrong'));
      return;
    }

    Alert.alert(t('changePassword.successTitle'), t('changePassword.successBody'), [
      { text: t('common.done'), onPress: () => router.back() },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      {/* Inline nav bar — centered title + leading Cancel (Swift toolbar). */}
      <View style={styles.toolbar}>
        <Text style={[carlibFont(17, 'medium'), { color: colors.carlibDark }]}>
          {t('changePassword.title')}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.cancel}>
          <Text style={[carlibFont(17, 'regular'), { color: colors.carlibDark }]}>
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
          <View style={styles.intro}>
            <Text style={[text.title2, { color: colors.carlibDark }]}>
              {t('changePassword.title')}
            </Text>
            {currentUser?.email ? (
              <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
                {currentUser.email}
              </Text>
            ) : null}
          </View>

          <View style={styles.fields}>
            <CarlibSecureField
              label={t('changePassword.current')}
              placeholder="••••••••"
              value={current}
              onChangeText={setCurrent}
              error={currentError}
            />
            <CarlibSecureField
              label={t('changePassword.new')}
              placeholder="••••••••"
              value={newPassword}
              onChangeText={setNewPassword}
              hint={t('changePassword.hint')}
              error={newError}
            />
            <CarlibSecureField
              label={t('changePassword.confirm')}
              placeholder="••••••••"
              value={confirm}
              onChangeText={setConfirm}
              error={confirmError}
            />
          </View>

          <CarlibButton
            label={t('changePassword.save')}
            variant="primary"
            isDisabled={!canSubmit}
            onPress={submit}
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
    minHeight: 44,
    marginTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: {
    position: 'absolute',
    left: spacing.lg,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  intro: { gap: 6 },
  fields: { gap: spacing.md },
});
