// Port of Carlib/Views/Driver/DriverProfileEditView.swift as a formSheet —
// avatar with reroll/remove, name/email fields, phone with a dial-code
// selector. Swift's Menu+Picker becomes a searchable inline dropdown over
// countryDialCodes. Save is a VISUAL NO-OP (intentional iOS parity).
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { DummyImage } from '@/components/DummyImage';
import { PressableScale } from '@/components/PressableScale';
import { RemixIcon } from '@/components/RemixIcon';
import { countryDialCodes, fromDialCode } from '@/models/countryDialCodes';
import { useAppStore } from '@/stores/appStore';
import { carlibFont, radius, spacing, text, useTheme } from '@/theme';

// Fresh v4-shaped seed for the avatar reroll (Swift used UUID().uuidString).
function randomSeed(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const r = (Math.random() * 16) | 0;
    const v = char === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function FieldLabel({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.fieldLabel, { color: colors.carlibSecondary }]}>
      {label.toUpperCase()}
    </Text>
  );
}

function LabeledField({ label, value, onChangeText, placeholder, keyboardType = 'default' }: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
}) {
  const { colors } = useTheme();
  const isEmail = keyboardType === 'email-address';
  return (
    <View style={styles.fieldGroup}>
      <FieldLabel label={label} />
      <TextInput
        style={[styles.fieldInput, text.body, { backgroundColor: colors.tileSecondary, color: colors.carlibDark }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.carlibLabel}
        keyboardType={keyboardType}
        autoCapitalize={isEmail ? 'none' : 'words'}
        autoCorrect={!isEmail}
      />
    </View>
  );
}

function EditCard({ title, subtitle, children }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.editCard, { backgroundColor: `${colors.tileSecondary}80` }]}>
      <View style={styles.editCardHeader}>
        <Text style={[text.title3, { color: colors.carlibDark }]}>{title}</Text>
        {subtitle != null && (
          <Text style={[text.footnote, { color: colors.carlibSecondary }]}>{subtitle}</Text>
        )}
      </View>
      {children}
    </View>
  );
}

export default function DriverProfileEditSheet() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);

  // Initial values mirror what DriverProfileView passed to the Swift sheet.
  const [name, setName] = useState(currentUser?.fullName || 'Driver');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [dialCode, setDialCode] = useState('+33');
  const [phone, setPhone] = useState('6 12 34 56 78');
  const [avatarSeed, setAvatarSeed] = useState('sophie-durand');

  const [countryOpen, setCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState('');

  const country = fromDialCode(dialCode);
  const filteredCountries = useMemo(() => {
    const query = countryQuery.trim().toLowerCase();
    if (query === '') return countryDialCodes;
    return countryDialCodes.filter(
      (option) => option.name.toLowerCase().includes(query) || option.dialCode.includes(query),
    );
  }, [countryQuery]);

  const selectCountry = (code: string) => {
    setDialCode(code);
    Haptics.selectionAsync();
    setCountryOpen(false);
    setCountryQuery('');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      <Stack.Screen
        options={{
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [1],
        }}
      />

      {/* Inline nav bar — Cancel / title / Save (Swift toolbar). */}
      <View style={styles.toolbar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.toolbarSide}>
          <Text style={[carlibFont(17, 'regular'), { color: colors.carlibSecondary }]}>
            {t('common.cancel')}
          </Text>
        </Pressable>
        <Text style={[carlibFont(17, 'medium'), styles.toolbarTitle, { color: colors.carlibDark }]}>
          {t('driverProfileEdit.title')}
        </Text>
        {/* Visual no-op save — intentional parity with the iOS sheet. */}
        <Pressable onPress={() => router.back()} hitSlop={12} style={[styles.toolbarSide, styles.toolbarTrailing]}>
          <Text style={[carlibFont(17, 'medium'), { color: colors.carlibDark }]}>
            {t('common.save')}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Avatar ── */}
        <EditCard
          title={t('driverProfileEdit.sectionAvatar')}
          subtitle={t('driverProfileEdit.sectionAvatarSubtitle')}
        >
          <View style={styles.avatarRow}>
            <View>
              <DummyImage
                kind="person"
                seed={avatarSeed}
                width={84}
                height={84}
                borderRadius={42}
                style={[styles.avatarBorder, { borderColor: colors.carlibCardBorder }]}
              />
              <View
                style={[
                  styles.cameraBadge,
                  { backgroundColor: colors.brandYellow, borderColor: colors.carlibScreenBg },
                ]}
              >
                {/* Badge fill is brandYellow (non-adapting), so the glyph stays literal black. */}
                <RemixIcon name="cameraLine" size={14} color="#000000" />
              </View>
            </View>

            <View style={styles.avatarActions}>
              <PressableScale
                scale={0.95}
                haptic="light"
                onPress={() => setAvatarSeed(randomSeed())}
                style={[styles.avatarChip, { backgroundColor: colors.tileSecondary }]}
              >
                <RemixIcon name="refreshLine" size={14} color={colors.carlibDark} />
                <Text style={[carlibFont(13, 'medium'), { color: colors.carlibDark }]}>
                  {t('driverProfileEdit.changePhoto')}
                </Text>
              </PressableScale>
              <PressableScale
                scale={0.95}
                haptic="light"
                onPress={() => setAvatarSeed('default-avatar')}
                style={[styles.avatarChip, { backgroundColor: `${colors.destructiveRed}14` }]}
              >
                <RemixIcon name="deleteBinLine" size={14} color={colors.destructiveRed} />
                <Text style={[carlibFont(13, 'medium'), { color: colors.destructiveRed }]}>
                  {t('driverProfileEdit.removePhoto')}
                </Text>
              </PressableScale>
            </View>
          </View>
        </EditCard>

        {/* ── Identity ── */}
        <EditCard
          title={t('driverProfileEdit.sectionIdentity')}
          subtitle={t('driverProfileEdit.sectionIdentitySubtitle')}
        >
          <View style={styles.fields}>
            <LabeledField
              label={t('driverProfileEdit.name')}
              value={name}
              onChangeText={setName}
              placeholder={t('driverProfileEdit.namePlaceholder')}
            />
            <LabeledField
              label={t('driverProfileEdit.email')}
              value={email}
              onChangeText={setEmail}
              placeholder={t('driverProfileEdit.emailPlaceholder')}
              keyboardType="email-address"
            />

            {/* Phone + dial-code selector */}
            <View style={styles.fieldGroup}>
              <FieldLabel label={t('driverProfileEdit.phone')} />
              <View style={styles.phoneRow}>
                <Pressable
                  onPress={() => setCountryOpen((open) => !open)}
                  style={[styles.countryChip, { backgroundColor: colors.tileSecondary }]}
                >
                  <Text style={styles.flag}>{country.flag}</Text>
                  <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
                    {country.dialCode}
                  </Text>
                  <RemixIcon
                    name={countryOpen ? 'arrowUpSLine' : 'arrowDownSLine'}
                    size={14}
                    color={colors.carlibSecondary}
                  />
                </Pressable>
                <TextInput
                  style={[styles.phoneInput, text.body, { backgroundColor: colors.tileSecondary, color: colors.carlibDark }]}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="6 12 34 56 78"
                  placeholderTextColor={colors.carlibLabel}
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                />
              </View>

              {countryOpen && (
                <View style={[styles.dropdown, { backgroundColor: colors.carlibScreenBg, borderColor: colors.carlibCardBorder }]}>
                  <View style={[styles.dropdownSearch, { backgroundColor: colors.tileSecondary }]}>
                    <RemixIcon name="searchLine" size={16} color={colors.carlibSecondary} />
                    <TextInput
                      style={[styles.dropdownSearchInput, text.body, { color: colors.carlibDark }]}
                      value={countryQuery}
                      onChangeText={setCountryQuery}
                      placeholder="Country"
                      placeholderTextColor={colors.carlibLabel}
                      autoCorrect={false}
                      autoCapitalize="none"
                    />
                  </View>
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                    {filteredCountries.map((option) => (
                      <Pressable
                        key={option.id}
                        onPress={() => selectCountry(option.dialCode)}
                        style={styles.dropdownRow}
                      >
                        <Text style={styles.flag}>{option.flag}</Text>
                        <Text style={[text.body, styles.dropdownName, { color: colors.carlibDark }]}>
                          {option.name}
                        </Text>
                        <Text style={[text.body, { color: colors.carlibSecondary }]}>
                          {option.dialCode}
                        </Text>
                        {option.dialCode === dialCode && (
                          <RemixIcon name="checkLine" size={16} color={colors.brandYellow} />
                        )}
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </EditCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: spacing.md,
  },
  toolbarSide: { width: 64 },
  toolbarTrailing: { alignItems: 'flex-end' },
  toolbarTitle: {
    flex: 1,
    textAlign: 'center',
  },
  content: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  editCard: {
    alignSelf: 'stretch',
    gap: 14,
    padding: spacing.md,
    borderRadius: 16,
  },
  editCardHeader: { gap: spacing.xxs },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarBorder: { borderWidth: 1 },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarActions: {
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  avatarChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 9999,
  },
  fields: { gap: spacing.sm },
  fieldGroup: { gap: 6 },
  fieldLabel: {
    ...carlibFont(11, 'medium'),
    letterSpacing: 0.8,
  },
  fieldInput: {
    height: 48,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 0,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  countryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 48,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  flag: { fontSize: 20 },
  phoneInput: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 0,
  },
  dropdown: {
    marginTop: spacing.xxs,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  dropdownSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 40,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  dropdownSearchInput: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  dropdownList: { maxHeight: 264 },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 10,
  },
  dropdownName: { flex: 1 },
});
