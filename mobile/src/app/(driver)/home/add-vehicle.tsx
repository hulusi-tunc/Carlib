// Port of AddVehicleSheet (Carlib/Views/Driver/MyGarageView.swift) — form
// sheet adding a vehicle to the store. The store promotes the first vehicle
// ever added to default, matching iOS.
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

import { CarlibTextField } from '@/components/CarlibTextField';
import type { Vehicle } from '@/models/types';
import { useClaimStore } from '@/stores/claimStore';
import { carlibFont, sectionHeaderText, spacing, useTheme } from '@/theme';

// Matches Swift's UUID() for new Vehicle ids.
function randomId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const r = (Math.random() * 16) | 0;
    const v = char === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function AddVehicleScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const addVehicle = useClaimStore((s) => s.addVehicle);

  const [plate, setPlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [nickname, setNickname] = useState('');

  const canSave = plate.length > 0 && brand.length > 0 && model.length > 0;

  function save() {
    // Swift Int(year): nil unless the whole string is a number.
    const trimmedYear = year.trim();
    const vehicle: Vehicle = {
      id: randomId(),
      info: {
        licensePlate: plate,
        brand,
        model,
        year: /^\d+$/.test(trimmedYear) ? Number(trimmedYear) : undefined,
        color,
      },
      nickname: nickname.length === 0 ? undefined : nickname,
      isDefault: false,
    };
    addVehicle(vehicle);
    router.back();
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      <Stack.Screen
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.5, 1],
          sheetGrabberVisible: true,
        }}
      />
      <View style={styles.toolbar}>
        <View style={styles.toolbarSide}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={[styles.toolbarButton, { color: colors.carlibSecondary }]}>
              {t('common.cancel')}
            </Text>
          </Pressable>
        </View>
        <Text style={[styles.toolbarTitle, { color: colors.carlibDark }]}>Add Vehicle</Text>
        <View style={[styles.toolbarSide, styles.toolbarTrailing]}>
          <Pressable onPress={save} hitSlop={12} disabled={!canSave}>
            <Text
              style={[
                styles.toolbarSave,
                { color: colors.brandYellow },
                !canSave && styles.disabled,
              ]}
            >
              {t('common.save')}
            </Text>
          </Pressable>
        </View>
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
          <Text style={[sectionHeaderText, { color: colors.carlibLabel }]}>Vehicle Details</Text>
          <CarlibTextField
            label={t('declaration.vehiclePlate')}
            placeholder="AA-123-BB"
            value={plate}
            onChangeText={setPlate}
          />
          <CarlibTextField
            label={t('declaration.vehicleBrand')}
            placeholder="Renault"
            value={brand}
            onChangeText={setBrand}
          />
          <CarlibTextField
            label={t('declaration.vehicleModel')}
            placeholder="Clio V"
            value={model}
            onChangeText={setModel}
          />
          <CarlibTextField
            label={t('declaration.vehicleYear')}
            placeholder="2021"
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
          />
          <CarlibTextField
            label={t('declaration.vehicleColor')}
            placeholder="Gris Platine"
            value={color}
            onChangeText={setColor}
          />

          <Text style={[sectionHeaderText, styles.optionalHeader, { color: colors.carlibLabel }]}>
            Optional
          </Text>
          <CarlibTextField
            label="Nickname"
            placeholder="e.g. Daily, Weekend"
            value={nickname}
            onChangeText={setNickname}
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
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  toolbarSide: { flex: 1 },
  toolbarTrailing: { alignItems: 'flex-end' },
  toolbarButton: carlibFont(17, 'regular'),
  toolbarTitle: carlibFont(17, 'medium'),
  toolbarSave: carlibFont(17, 'medium'),
  disabled: { opacity: 0.4 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  optionalHeader: { paddingTop: spacing.xs },
});
