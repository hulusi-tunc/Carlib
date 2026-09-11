// Port of Carlib/Views/Driver/DeclarationFlowView.swift — guided accident
// declaration, 4 steps. Next is always enabled (iOS parity: no validation).
// Photos hold picker file URIs (migration plan §5), not image data.
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CarlibButton } from '@/components/CarlibButton';
import { CarlibCard } from '@/components/CarlibCard';
import { CarlibTextField } from '@/components/CarlibTextField';
import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import { ACCIDENT_TYPES, type AccidentType } from '@/models/enums';
import type { Claim, PhotoAttachment, VehicleInfo } from '@/models/types';
import { useClaimStore } from '@/stores/claimStore';
import { carlibFont, fontFamilies, radius, spacing, text, useTheme } from '@/theme';

const TOTAL_STEPS = 4;

// Mirrors the AccidentType icon extension in ClaimCardView.swift.
const ACCIDENT_ICON: Record<AccidentType, RemixIconName> = {
  collision: 'carLine',
  stationnement: 'parkingBoxLine',
  vandalisme: 'alarmWarningLine',
  intemperies: 'thunderstormsLine',
  autre: 'questionLine',
};

// French raw value → English i18n key (accidentTypeLabel.* uses Swift case names).
const ACCIDENT_KEY = {
  collision: 'collision',
  stationnement: 'parking',
  vandalisme: 'vandalism',
  intemperies: 'weather',
  autre: 'other',
} as const satisfies Record<AccidentType, string>;

function randomId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const r = (Math.random() * 16) | 0;
    const v = char === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function DeclareScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const addClaim = useClaimStore((s) => s.addClaim);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<AccidentType | null>(null);
  const [photos, setPhotos] = useState<PhotoAttachment[]>([]);
  const [licensePlate, setLicensePlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');

  async function pickPhotos() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 8,
      quality: 0.7,
    });
    if (result.canceled) return;
    const picked: PhotoAttachment[] = result.assets.map((asset) => ({
      id: randomId(),
      imageUri: asset.uri,
      caption: '',
      timestamp: new Date(),
    }));
    setPhotos((prev) => [...prev, ...picked].slice(0, 8));
  }

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  }

  function submitClaim() {
    // Swift Int(year): nil unless the whole string is a number.
    const trimmedYear = year.trim();
    const parsedYear = /^\d+$/.test(trimmedYear) ? Number(trimmedYear) : undefined;
    const hasVehicleInfo = [licensePlate, brand, model, year, color].some(
      (field) => field.trim().length > 0,
    );
    const vehicleInfo: VehicleInfo | undefined = hasVehicleInfo
      ? { licensePlate, brand, model, year: parsedYear, color }
      : undefined;
    const now = new Date();
    const claim: Claim = {
      id: randomId(),
      status: 'soumis',
      accidentType: selectedType ?? undefined,
      description:
        selectedType != null ? t(`accidentTypeLabel.${ACCIDENT_KEY[selectedType]}`) : '',
      photos,
      vehicleInfo,
      createdAt: now,
      updatedAt: now,
    };
    addClaim(claim);
    router.push('/home/declare-confirm');
  }

  const divider = (
    <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />
  );

  function summaryRow(label: string, value: string) {
    return (
      <View style={styles.summaryRow}>
        <Text style={[text.footnote, { color: colors.carlibSecondary }]}>{label}</Text>
        <Text style={[carlibFont(13, 'medium'), { color: colors.carlibDark }]}>{value}</Text>
      </View>
    );
  }

  const placeholderCount = Math.max(0, 3 - photos.length);

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('declaration.title'),
          headerStyle: { backgroundColor: colors.carlibScreenBg },
          headerShadowVisible: false,
          headerTintColor: colors.carlibDark,
          headerTitleStyle: { fontFamily: fontFamilies.medium, fontSize: 17 },
          headerBackButtonDisplayMode: 'minimal',
        }}
      />

      <View style={styles.progressWrap}>
        <View style={[styles.progressTrack, { backgroundColor: colors.tileSecondary }]}>
          <View style={{ flex: currentStep, backgroundColor: colors.brandYellow }} />
          <View style={{ flex: TOTAL_STEPS - currentStep }} />
        </View>
      </View>
      <Text style={[text.caption, styles.stepLabel, { color: colors.carlibSecondary }]}>
        {t('declaration.stepProgress', { current: currentStep, total: TOTAL_STEPS })}
      </Text>

      <ScrollView contentContainerStyle={styles.content}>
        {currentStep === 1 && (
          <View style={styles.step}>
            <Text style={[text.title2, { color: colors.carlibDark }]}>
              {t('declaration.step1Title')}
            </Text>
            <Text style={[text.body, { color: colors.carlibSecondary }]}>
              {t('declaration.step1Subtitle')}
            </Text>
            <View style={styles.grid}>
              {ACCIDENT_TYPES.map((type) => {
                const selected = selectedType === type;
                return (
                  <Pressable
                    key={type}
                    onPress={() => setSelectedType(type)}
                    style={[
                      styles.typeCard,
                      {
                        backgroundColor: selected ? colors.brandYellowLight : colors.tileSecondary,
                        borderColor: selected ? colors.brandYellow : 'transparent',
                      },
                    ]}
                  >
                    <RemixIcon name={ACCIDENT_ICON[type]} size={28} color={colors.carlibDark} />
                    <Text style={[carlibFont(13, 'medium'), { color: colors.carlibDark }]}>
                      {t(`accidentTypeLabel.${ACCIDENT_KEY[type]}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.step}>
            <Text style={[text.title2, { color: colors.carlibDark }]}>
              {t('declaration.step2Title')}
            </Text>
            <Text style={[text.body, { color: colors.carlibSecondary }]}>
              {t('declaration.step2Subtitle')}
            </Text>
            <View style={styles.grid}>
              <Pressable
                onPress={() => void pickPhotos()}
                style={[styles.addPhotoCard, { borderColor: colors.carlibCardBorder }]}
              >
                <RemixIcon name="cameraFill" size={28} color={colors.brandYellow} />
                <Text style={[text.caption, { color: colors.carlibDark }]}>
                  {t('declaration.photosAdd')}
                </Text>
              </Pressable>
              {photos.map((photo) => (
                <View key={photo.id} style={styles.photoCell}>
                  <Image
                    source={{ uri: photo.imageUri }}
                    style={styles.photoImage}
                    contentFit="cover"
                  />
                  <Pressable
                    onPress={() => removePhoto(photo.id)}
                    hitSlop={8}
                    style={styles.photoRemove}
                  >
                    {/* Sits on top of the photo thumbnail, not on a themed
                        surface — stays white in both light and dark. */}
                    <RemixIcon name="closeCircleFill" size={22} color="#FFFFFF" />
                  </Pressable>
                </View>
              ))}
              {Array.from({ length: placeholderCount }, (_, index) => (
                <View
                  key={`placeholder-${index}`}
                  style={[styles.photoPlaceholder, { backgroundColor: colors.tileSecondary }]}
                >
                  <RemixIcon name="imageLine" size={24} color={colors.carlibSecondary} />
                </View>
              ))}
            </View>
            {photos.length > 0 && (
              <Text style={[text.caption, { color: colors.carlibSecondary }]}>
                {photos.length}/8
              </Text>
            )}
            <Text style={[text.caption, { color: colors.carlibSecondary }]}>
              {t('declaration.photosHint')}
            </Text>
          </View>
        )}

        {currentStep === 3 && (
          <View style={styles.step}>
            <Text style={[text.title2, { color: colors.carlibDark }]}>
              {t('declaration.step3Title')}
            </Text>
            <Text style={[text.body, { color: colors.carlibSecondary }]}>
              {t('declaration.step3Subtitle')}
            </Text>
            <View style={styles.form}>
              <CarlibTextField
                label={t('declaration.vehiclePlate')}
                placeholder="AA-123-BB"
                value={licensePlate}
                onChangeText={setLicensePlate}
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
            </View>
          </View>
        )}

        {currentStep === 4 && (
          <View style={styles.step}>
            <Text style={[text.title2, { color: colors.carlibDark }]}>
              {t('declaration.step4Title')}
            </Text>
            <Text style={[text.body, { color: colors.carlibSecondary }]}>
              {t('declaration.step4Subtitle')}
            </Text>
            <CarlibCard variant="flat">
              <View style={styles.summaryBody}>
                {summaryRow(
                  t('declaration.summaryType'),
                  selectedType != null
                    ? t(`accidentTypeLabel.${ACCIDENT_KEY[selectedType]}`)
                    : '—',
                )}
                {divider}
                {summaryRow(t('declaration.summaryPhotos'), String(photos.length))}
                {divider}
                {summaryRow(
                  t('declaration.summaryPlate'),
                  licensePlate.length === 0 ? '—' : licensePlate,
                )}
                {divider}
                {summaryRow(
                  t('declaration.summaryVehicle'),
                  brand.length === 0 ? '—' : `${brand} ${model}`,
                )}
              </View>
            </CarlibCard>
            <Text style={[text.caption, styles.disclaimer, { color: colors.carlibSecondary }]}>
              {t('declaration.summaryDisclaimer')}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: spacing.screenHorizontal + insets.bottom }]}>
        {currentStep > 1 && (
          <CarlibButton
            label={t('declaration.back')}
            variant="secondary"
            onPress={() => setCurrentStep((step) => step - 1)}
            style={styles.footerButton}
          />
        )}
        <CarlibButton
          label={currentStep < TOTAL_STEPS ? t('declaration.next') : t('declaration.submit')}
          onPress={() => {
            if (currentStep < TOTAL_STEPS) {
              setCurrentStep((step) => step + 1);
            } else {
              submitClaim();
            }
          }}
          style={styles.footerButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  progressWrap: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
  },
  progressTrack: {
    height: 4,
    borderRadius: radius.full,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  stepLabel: {
    textAlign: 'center',
    marginTop: spacing.xxs,
  },
  content: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.xl,
  },
  step: { gap: spacing.lg },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
  },
  typeCard: {
    width: '48%',
    height: 100,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  addPhotoCard: {
    width: '48%',
    height: 120,
    borderRadius: radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  photoCell: {
    width: '48%',
    height: 120,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.md,
  },
  photoRemove: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  photoPlaceholder: {
    width: '48%',
    height: 120,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: { gap: spacing.md },
  summaryBody: {
    alignSelf: 'stretch',
    gap: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
  disclaimer: { textAlign: 'center' },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.screenHorizontal,
  },
  footerButton: { flex: 1 },
});
