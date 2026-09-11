// Port of Carlib/Views/Garage/GarageProfileEditView.swift as a formSheet —
// business-info fields with dial-code dropdown, specialty chip toggles, a
// stepper-style coverage card (Swift Slider 5–50 step 5; no RN slider dep),
// and a 3-column photo grid with camera/library add + confirm delete.
// Unlike the Swift MVP no-op, Save persists via claimStore.updateGarage
// (photo add/remove writes immediately, matching iOS).
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { DummyImage } from '@/components/DummyImage';
import { PressableScale } from '@/components/PressableScale';
import { RemixIcon } from '@/components/RemixIcon';
import { countryDialCodes, fromDialCode } from '@/models/countryDialCodes';
import { REPAIR_SPECIALTIES, type RepairSpecialty } from '@/models/enums';
import type { PhotoAttachment } from '@/models/types';
import { garages as seedGarages } from '@/services/mockData';
import { useClaimStore } from '@/stores/claimStore';
import { carlibFont, radius, spacing, text, useTheme } from '@/theme';

// Signed-in garage persona: MockData garages[0] — Carrosserie Dupont.
const GARAGE_ID = '00000001-0000-0000-0000-000000000001';

const SPECIALTY_KEY = {
  carrosserie: 'bodywork',
  peinture: 'painting',
  mecanique: 'mechanics',
  vitrage: 'windshield',
  detailing: 'detailing',
} as const satisfies Record<RepairSpecialty, string>;

const RADIUS_MIN = 5;
const RADIUS_MAX = 50;
const RADIUS_STEP = 5;
const GRID_GAP = 10;

// Matches Swift's UUID() for picked PhotoAttachments.
function randomId(): string {
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

export default function GarageProfileEditSheet() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();

  // Seed from the live store (Swift seeded from MockData; the store persists
  // here, so re-opening the sheet must show the saved values).
  const storeGarage =
    useClaimStore((s) => s.garages.find((g) => g.id === GARAGE_ID)) ?? seedGarages[0]!;
  const addGaragePhoto = useClaimStore((s) => s.addGaragePhoto);
  const removeGaragePhoto = useClaimStore((s) => s.removeGaragePhoto);
  const updateGarage = useClaimStore((s) => s.updateGarage);
  const photos = storeGarage.photos;

  const [name, setName] = useState(storeGarage.name);
  const [address, setAddress] = useState(storeGarage.address);
  const [dialCode, setDialCode] = useState(storeGarage.dialCode);
  const [phone, setPhone] = useState(storeGarage.phone);
  const [coverageRadius, setCoverageRadius] = useState(storeGarage.coverageRadiusKm);
  const [selectedSpecialties, setSelectedSpecialties] = useState<Set<RepairSpecialty>>(
    () => new Set(storeGarage.specialties),
  );
  const [countryOpen, setCountryOpen] = useState(false);

  const country = fromDialCode(dialCode);
  // formSheet width == window width on iPhone; sheet pad 20 + card pad 16.
  const tileSize = Math.floor(
    (windowWidth - spacing.lg * 2 - spacing.md * 2 - GRID_GAP * 2) / 3,
  );

  const toggleSpecialty = (specialty: RepairSpecialty) => {
    setSelectedSpecialties((prev) => {
      const next = new Set(prev);
      if (next.has(specialty)) {
        next.delete(specialty);
      } else {
        next.add(specialty);
      }
      return next;
    });
  };

  const selectCountry = (code: string) => {
    setDialCode(code);
    void Haptics.selectionAsync();
    setCountryOpen(false);
  };

  const stepRadius = (delta: number) => {
    setCoverageRadius((value) =>
      Math.min(RADIUS_MAX, Math.max(RADIUS_MIN, value + delta)),
    );
  };

  const addPickedPhoto = (uri: string) => {
    const photo: PhotoAttachment = {
      id: randomId(),
      imageUri: uri,
      caption: '',
      timestamp: new Date(),
    };
    addGaragePhoto(GARAGE_ID, photo);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.9,
    });
    const asset = result.assets?.[0];
    if (result.canceled || asset == null) return;
    addPickedPhoto(asset.uri);
  };

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
    });
    const asset = result.assets?.[0];
    if (result.canceled || asset == null) return;
    addPickedPhoto(asset.uri);
  };

  // Swift confirmationDialog → native Alert choice sheet.
  const promptAddPhoto = () => {
    Alert.alert('Add a photo', undefined, [
      { text: 'Take Photo', onPress: () => void takePhoto() },
      { text: 'Choose from Library', onPress: () => void pickFromLibrary() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const confirmRemovePhoto = (photoId: string) => {
    Alert.alert('Remove this photo?', undefined, [
      { text: 'Remove', style: 'destructive', onPress: () => removeGaragePhoto(GARAGE_ID, photoId) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSave = () => {
    updateGarage({
      ...storeGarage,
      name,
      address,
      dialCode,
      phone,
      coverageRadiusKm: coverageRadius,
      specialties: REPAIR_SPECIALTIES.filter((s) => selectedSpecialties.has(s)),
    });
    router.back();
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
          {t('garageProfileEdit.title')}
        </Text>
        <Pressable onPress={handleSave} hitSlop={12} style={[styles.toolbarSide, styles.toolbarTrailing]}>
          <Text style={[carlibFont(17, 'medium'), { color: colors.carlibDark }]}>
            {t('garageProfileEdit.save')}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Business info ── */}
        <EditCard title="Business info">
          <View style={styles.fields}>
            <View style={styles.fieldGroup}>
              <FieldLabel label="Shop name" />
              <TextInput
                style={[styles.fieldInput, text.body, { backgroundColor: colors.tileSecondary, color: colors.carlibDark }]}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Carrosserie Dupont"
                placeholderTextColor={colors.carlibLabel}
              />
            </View>

            <View style={styles.fieldGroup}>
              <FieldLabel label="Address" />
              <TextInput
                style={[styles.fieldInput, text.body, { backgroundColor: colors.tileSecondary, color: colors.carlibDark }]}
                value={address}
                onChangeText={setAddress}
                placeholder="Street, ZIP city"
                placeholderTextColor={colors.carlibLabel}
              />
            </View>

            {/* Phone + dial-code selector (Swift Menu+Picker → inline dropdown). */}
            <View style={styles.fieldGroup}>
              <FieldLabel label="Phone" />
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
                  placeholder="1 43 55 12 34"
                  placeholderTextColor={colors.carlibLabel}
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                />
              </View>

              {countryOpen && (
                <View style={[styles.dropdown, { backgroundColor: colors.carlibScreenBg, borderColor: colors.carlibCardBorder }]}>
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                    {countryDialCodes.map((option) => (
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

        {/* ── Specialties ── */}
        <EditCard title="Specialties" subtitle="Tap to toggle — these show on your listing.">
          <View style={styles.chipsWrap}>
            {REPAIR_SPECIALTIES.map((specialty) => {
              const isOn = selectedSpecialties.has(specialty);
              return (
                <PressableScale
                  key={specialty}
                  scale={0.95}
                  haptic="light"
                  onPress={() => toggleSpecialty(specialty)}
                  style={[
                    styles.specialtyChip,
                    { backgroundColor: isOn ? `${colors.brandYellow}33` : colors.tileSecondary },
                  ]}
                >
                  {isOn && <RemixIcon name="checkLine" size={14} color={colors.carlibDark} />}
                  <Text style={[carlibFont(13, 'medium'), { color: colors.carlibDark }]}>
                    {t(`specialty.${SPECIALTY_KEY[specialty]}`)}
                  </Text>
                </PressableScale>
              );
            })}
          </View>
        </EditCard>

        {/* ── Service area ── */}
        <EditCard title="Service area" subtitle="How far you're willing to take jobs from.">
          <View style={styles.coverageBody}>
            <View style={styles.coverageValueRow}>
              <Text style={[text.statValueLarge, { color: colors.carlibDark }]}>
                {`${Math.trunc(coverageRadius)}`}
              </Text>
              <Text style={[text.callout, styles.coverageUnit, { color: colors.carlibSecondary }]}>
                km radius
              </Text>
              <PressableScale
                scale={0.92}
                haptic="light"
                disabled={coverageRadius <= RADIUS_MIN}
                onPress={() => stepRadius(-RADIUS_STEP)}
                style={[
                  styles.stepButton,
                  { backgroundColor: colors.tileSecondary },
                  coverageRadius <= RADIUS_MIN && styles.stepDisabled,
                ]}
              >
                <RemixIcon name="subtractLine" size={18} color={colors.carlibDark} />
              </PressableScale>
              <PressableScale
                scale={0.92}
                haptic="light"
                disabled={coverageRadius >= RADIUS_MAX}
                onPress={() => stepRadius(RADIUS_STEP)}
                style={[
                  styles.stepButton,
                  { backgroundColor: colors.tileSecondary },
                  coverageRadius >= RADIUS_MAX && styles.stepDisabled,
                ]}
              >
                <RemixIcon name="addLine" size={18} color={colors.carlibDark} />
              </PressableScale>
            </View>

            <View style={[styles.track, { backgroundColor: colors.carlibCardBorder }]}>
              <View
                style={[
                  styles.trackFill,
                  {
                    backgroundColor: colors.brandYellow,
                    width: `${((coverageRadius - RADIUS_MIN) / (RADIUS_MAX - RADIUS_MIN)) * 100}%`,
                  },
                ]}
              />
            </View>

            <View style={styles.trackLabels}>
              <Text style={[text.caption, { color: colors.carlibSecondary }]}>5 km</Text>
              <Text style={[text.caption, { color: colors.carlibSecondary }]}>50 km</Text>
            </View>
          </View>
        </EditCard>

        {/* ── Photos ── */}
        <EditCard
          title="Photos"
          subtitle="Shops with 3+ photos get 40% more leads. Tap × to remove."
        >
          <View style={styles.photoGrid}>
            <PressableScale
              scale={0.95}
              haptic="light"
              onPress={promptAddPhoto}
              style={[
                styles.addPhotoTile,
                {
                  width: tileSize,
                  height: tileSize,
                  backgroundColor: `${colors.brandYellow}1A`,
                  borderColor: `${colors.brandYellow}80`,
                },
              ]}
            >
              <RemixIcon name="addLine" size={22} color={colors.brandYellow} />
              <Text style={[carlibFont(13, 'medium'), { color: colors.carlibDark }]}>Add</Text>
            </PressableScale>

            {photos.map((photo) => (
              <View key={photo.id} style={[styles.photoTile, { width: tileSize, height: tileSize }]}>
                {photo.imageUri != null ? (
                  <Image
                    source={{ uri: photo.imageUri }}
                    contentFit="cover"
                    style={StyleSheet.absoluteFill}
                  />
                ) : (
                  <DummyImage
                    kind="garage"
                    seed={photo.id}
                    width={tileSize}
                    height={tileSize}
                    borderRadius={radius.md}
                  />
                )}
                <PressableScale
                  scale={0.9}
                  haptic="light"
                  onPress={() => confirmRemovePhoto(photo.id)}
                  style={styles.deleteButton}
                >
                  <RemixIcon name="closeLine" size={14} color="#FFFFFF" />
                </PressableScale>
              </View>
            ))}
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
  toolbarSide: { width: 92 },
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
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  specialtyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 9999,
  },
  coverageBody: { gap: spacing.sm },
  coverageValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  coverageUnit: { flex: 1 },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDisabled: { opacity: 0.4 },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 2,
  },
  trackLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  addPhotoTile: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  photoTile: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  // Overlays the photo tile itself — a surface that never adapts, so the scrim
  // disc and its white glyph stay theme-invariant.
  deleteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
});
