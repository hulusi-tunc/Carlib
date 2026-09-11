// Port of Carlib/Views/Shared/LanguagePickerView.swift. setAppLanguage flips
// every t() on the next render — the RN equivalent of the app_language .id()
// rebuild in CarlibApp.
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/PressableScale';
import { RemixIcon } from '@/components/RemixIcon';
import { APP_LANGUAGES, setAppLanguage } from '@/i18n';
import { carlibFont, radius, spacing, text, useTheme } from '@/theme';

export function LanguageSheet() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      {/* Inline nav bar — centered title + trailing Done (Swift toolbar). */}
      <View style={styles.toolbar}>
        <Text style={[carlibFont(17, 'medium'), { color: colors.carlibDark }]}>
          {t('settings.sectionLanguage')}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.done}>
          <Text style={[carlibFont(17, 'medium'), { color: colors.carlibDark }]}>
            {t('common.done')}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <Text style={[text.title2, { color: colors.carlibDark }]}>
            {t('settings.sectionLanguage')}
          </Text>
          <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
            {t('settings.languageNote')}
          </Text>
        </View>

        <View style={styles.list}>
          {APP_LANGUAGES.map((lang) => {
            const isSelected = i18n.language === lang.code;
            return (
              <PressableScale
                key={lang.code}
                scale={0.98}
                haptic="light"
                onPress={() => {
                  if (isSelected) return;
                  void setAppLanguage(lang.code);
                  void Haptics.selectionAsync();
                }}
                style={[
                  styles.row,
                  {
                    backgroundColor: isSelected
                      ? `${colors.brandYellow}1F`
                      : `${colors.tileSecondary}80`,
                  },
                ]}
              >
                <View style={[styles.flagDisc, { backgroundColor: colors.tileSecondary }]}>
                  <Text style={styles.flag}>{lang.flag}</Text>
                </View>
                <Text style={[carlibFont(15, 'medium'), styles.rowTitle, { color: colors.carlibDark }]}>
                  {lang.label}
                </Text>
                {isSelected && (
                  <View style={[styles.checkDisc, { backgroundColor: colors.brandYellow }]}>
                    {/* brandYellow disc is the same in both schemes → check stays black. */}
                    <RemixIcon name="checkLine" size={20} color="#000000" />
                  </View>
                )}
              </PressableScale>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  toolbar: {
    minHeight: 44,
    marginTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  done: {
    position: 'absolute',
    right: spacing.lg,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  intro: { gap: 6 },
  list: { gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: 14,
    borderRadius: 14,
  },
  flagDisc: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flag: { fontSize: 24 },
  rowTitle: { flex: 1 },
  checkDisc: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
