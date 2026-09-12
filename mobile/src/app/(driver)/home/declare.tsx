// Guided accident declaration, rebuilt to the Phase 2 stories
// (CARLIB-CLAIMDECL-01, CARLIB-PHOTOCAP-01): type → photos → where and what →
// validation. Next stays disabled until the step's mandatory fields are filled,
// submission is guarded on the accident type, and the vehicle is picked from
// the profile (CARLIB-USERAUTH-02) rather than typed. Photos hold picker file
// URIs (migration plan §5), not image data.
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CarBrandLogo } from '@/components/CarBrandLogo';
import { CarlibButton } from '@/components/CarlibButton';
import { CarlibCard } from '@/components/CarlibCard';
import { CarlibTextField } from '@/components/CarlibTextField';
import { Glass } from '@/components/Glass';
import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import { useHeaderHeight } from '@/lib/header';
import { getCurrentAddress } from '@/lib/location';
import { ACCIDENT_KEY, ACCIDENT_TYPES, type AccidentType } from '@/models/enums';
import type { Claim, Coordinate, PhotoAttachment } from '@/models/types';
import { useClaimStore } from '@/stores/claimStore';
import { carlibFont, radius, spacing, text, useTheme } from '@/theme';

const TOTAL_STEPS = 4;
/** The four angles a file needs (CARLIB-PHOTOCAP-01); the hint copy names them too. */
const PHOTO_ANGLES = ['Front', 'Rear', 'Left', 'Right'] as const;
const MIN_PHOTOS = PHOTO_ANGLES.length;
const MAX_PHOTOS = 8;
// Footer = one 52pt button row plus its padding; the scroll content clears it.
const FOOTER_HEIGHT = 52 + spacing.screenHorizontal * 2;
// Swift .animation(.easeInOut(0.25), value: currentStep): steps cross-fade.
const STEP_FADE_IN = FadeIn.duration(250);
const STEP_FADE_OUT = FadeOut.duration(250);

// Mirrors the AccidentType icon extension in ClaimCardView.swift.
const ACCIDENT_ICON: Record<AccidentType, RemixIconName> = {
  collision: 'carLine',
  stationnement: 'parkingBoxLine',
  vandalisme: 'alarmWarningLine',
  intemperies: 'thunderstormsLine',
  autre: 'questionLine',
};

type LocateState = 'idle' | 'locating' | 'granted' | 'denied' | 'unavailable';

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
  // Not a ScrollView root: pad below the transparent native bar by hand.
  const headerHeight = useHeaderHeight();
  const addClaim = useClaimStore((s) => s.addClaim);
  const vehicles = useClaimStore((s) => s.vehicles);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<AccidentType | null>(null);
  const [typeMissing, setTypeMissing] = useState(false);
  const [photos, setPhotos] = useState<PhotoAttachment[]>([]);
  const [cameraDenied, setCameraDenied] = useState(false);
  const [locate, setLocate] = useState<LocateState>('idle');
  const [coords, setCoords] = useState<Coordinate | null>(null);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  // The profile's default vehicle unless the driver picked another. Derived, so a
  // vehicle added mid-flow from the sheet shows up without an effect.
  const selectedVehicle =
    vehicles.find((vehicle) => vehicle.id === vehicleId) ??
    vehicles.find((vehicle) => vehicle.isDefault) ??
    vehicles[0];

  // CLAIMDECL-01: Next is disabled until the step's mandatory fields are filled.
  const canContinue =
    currentStep === 1
      ? selectedType != null
      : currentStep === 2
        ? photos.length >= MIN_PHOTOS
        : currentStep === 3
          ? address.trim().length > 0 || coords != null
          : selectedVehicle != null;

  function addPhotos(assets: ImagePicker.ImagePickerAsset[]) {
    const picked: PhotoAttachment[] = assets.map((asset) => ({
      id: randomId(),
      imageUri: asset.uri,
      caption: '',
      timestamp: new Date(),
    }));
    setPhotos((prev) => [...prev, ...picked].slice(0, MAX_PHOTOS));
  }

  async function pickFromLibrary() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: Math.max(1, MAX_PHOTOS - photos.length),
      quality: 0.7,
    });
    if (!result.canceled) addPhotos(result.assets);
  }

  // PHOTOCAP-01: a refused camera is stated, and the library still works.
  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setCameraDenied(true);
      return;
    }
    setCameraDenied(false);
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) addPhotos(result.assets);
  }

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  }

  // CLAIMDECL-01: a refused or failed position falls back to a typed address.
  async function locateDriver() {
    setLocate('locating');
    const result = await getCurrentAddress();
    if (result.status !== 'granted') {
      setLocate(result.status);
      return;
    }
    setCoords(result.coords);
    const found = result.address;
    if (found) setAddress((current) => (current.length > 0 ? current : found));
    setLocate('granted');
  }

  function goNext() {
    if (currentStep === TOTAL_STEPS) {
      submitClaim();
      return;
    }
    const next = currentStep + 1;
    setCurrentStep(next);
    if (next === 3 && locate === 'idle') void locateDriver();
  }

  function submitClaim() {
    // CLAIMDECL-01: no type → the offending step is shown and highlighted.
    if (selectedType == null) {
      setTypeMissing(true);
      setCurrentStep(1);
      return;
    }
    const now = new Date();
    const claim: Claim = {
      id: randomId(),
      status: 'soumis',
      accidentType: selectedType,
      description: description.trim() || t(`accidentTypeLabel.${ACCIDENT_KEY[selectedType]}`),
      photos,
      location: coords ?? undefined,
      address: address.trim() || undefined,
      vehicleInfo: selectedVehicle?.info,
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
        <Text
          style={[carlibFont(13, 'medium'), styles.summaryValue, { color: colors.carlibDark }]}
          numberOfLines={2}
        >
          {value}
        </Text>
      </View>
    );
  }

  const locateCopy =
    locate === 'locating'
      ? t('declaration.locationLocating')
      : locate === 'granted'
        ? t('declaration.locationFound')
        : locate === 'denied'
          ? t('declaration.locationDenied')
          : locate === 'unavailable'
            ? t('declaration.locationUnavailable')
            : '';
  const locationSummary =
    address.trim() ||
    (coords != null ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : '—');

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg, paddingTop: headerHeight }]}>
      <View style={styles.progressWrap}>
        <View style={[styles.progressTrack, { backgroundColor: colors.tileSecondary }]}>
          <View style={{ flex: currentStep, backgroundColor: colors.brandYellow }} />
          <View style={{ flex: TOTAL_STEPS - currentStep }} />
        </View>
      </View>
      <Text style={[text.caption, styles.stepLabel, { color: colors.carlibSecondary }]}>
        {t('declaration.stepProgress', { current: currentStep, total: TOTAL_STEPS })}
      </Text>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: FOOTER_HEIGHT + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
      >
        {currentStep === 1 && (
          <Animated.View style={styles.step} entering={STEP_FADE_IN} exiting={STEP_FADE_OUT}>
            <Text style={[text.title2, { color: colors.carlibDark }]}>
              {t('declaration.step1Title')}
            </Text>
            <Text style={[text.body, { color: colors.carlibSecondary }]}>
              {t('declaration.step1Subtitle')}
            </Text>
            {typeMissing && (
              <Text style={[text.caption, { color: colors.destructiveRed }]}>
                {t('declaration.typeRequired')}
              </Text>
            )}
            <View style={styles.grid}>
              {ACCIDENT_TYPES.map((type) => {
                const selected = selectedType === type;
                return (
                  <Pressable
                    key={type}
                    onPress={() => {
                      setSelectedType(type);
                      setTypeMissing(false);
                    }}
                    style={[
                      styles.typeCard,
                      {
                        backgroundColor: selected ? colors.brandYellowLight : colors.tileSecondary,
                        borderColor: selected
                          ? colors.brandYellow
                          : typeMissing
                            ? colors.destructiveRed
                            : 'transparent',
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
          </Animated.View>
        )}

        {currentStep === 2 && (
          <Animated.View style={styles.step} entering={STEP_FADE_IN} exiting={STEP_FADE_OUT}>
            <Text style={[text.title2, { color: colors.carlibDark }]}>
              {t('declaration.step2Title')}
            </Text>
            <Text style={[text.body, { color: colors.carlibSecondary }]}>
              {t('declaration.photosHint')}
            </Text>
            <View style={styles.actionRow}>
              <Pressable
                onPress={() => void takePhoto()}
                style={[styles.actionCard, { borderColor: colors.carlibCardBorder }]}
              >
                <RemixIcon name="cameraFill" size={24} color={colors.brandYellow} />
                <Text style={[text.caption, { color: colors.carlibDark }]}>
                  {t('declaration.photosTake')}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => void pickFromLibrary()}
                style={[styles.actionCard, { borderColor: colors.carlibCardBorder }]}
              >
                <RemixIcon name="imageAddLine" size={24} color={colors.brandYellow} />
                <Text style={[text.caption, { color: colors.carlibDark }]}>
                  {t('declaration.photosChoose')}
                </Text>
              </Pressable>
            </View>
            {cameraDenied && (
              <Text style={[text.caption, { color: colors.destructiveRed }]}>
                {t('declaration.photosCameraDenied')}
              </Text>
            )}
            <View style={styles.grid}>
              {photos.map((photo, index) => (
                <View key={photo.id} style={styles.photoCell}>
                  <Image
                    source={{ uri: photo.imageUri }}
                    style={styles.photoImage}
                    contentFit="cover"
                  />
                  {index < MIN_PHOTOS && (
                    <View style={styles.angleTag}>
                      {/* On the photo itself, not a themed surface — white on a scrim. */}
                      <Text style={[text.micro, { color: '#FFFFFF' }]}>
                        {t(`declaration.photoAngle${PHOTO_ANGLES[index]}`)}
                      </Text>
                    </View>
                  )}
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
              {PHOTO_ANGLES.slice(photos.length).map((angle) => (
                <View
                  key={`placeholder-${angle}`}
                  style={[styles.photoPlaceholder, { backgroundColor: colors.tileSecondary }]}
                >
                  <RemixIcon name="imageLine" size={24} color={colors.carlibSecondary} />
                  <Text style={[text.caption, { color: colors.carlibSecondary }]}>
                    {t(`declaration.photoAngle${angle}`)}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={[text.caption, { color: colors.carlibSecondary }]}>
              {photos.length < MIN_PHOTOS
                ? t('declaration.photosMinimum', { count: MIN_PHOTOS })
                : t('declaration.photosCount', { count: photos.length, max: MAX_PHOTOS })}
            </Text>
          </Animated.View>
        )}

        {currentStep === 3 && (
          <Animated.View style={styles.step} entering={STEP_FADE_IN} exiting={STEP_FADE_OUT}>
            <Text style={[text.title2, { color: colors.carlibDark }]}>
              {t('declaration.step3Title')}
            </Text>
            <Text style={[text.body, { color: colors.carlibSecondary }]}>
              {t('declaration.step3Subtitle')}
            </Text>
            {locateCopy.length > 0 && (
              <View style={styles.locateRow}>
                <RemixIcon
                  name={locate === 'granted' ? 'mapPinFill' : 'mapPinLine'}
                  size={18}
                  color={locate === 'granted' ? colors.brandYellow : colors.carlibSecondary}
                />
                <Text style={[text.caption, styles.locateText, { color: colors.carlibSecondary }]}>
                  {locateCopy}
                </Text>
              </View>
            )}
            <View style={styles.form}>
              <CarlibTextField
                label={t('declaration.addressLabel')}
                placeholder={t('declaration.addressPlaceholder')}
                value={address}
                onChangeText={setAddress}
              />
              <CarlibTextField
                label={t('declaration.descriptionLabel')}
                placeholder={t('declaration.descriptionPlaceholder')}
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>
          </Animated.View>
        )}

        {currentStep === 4 && (
          <Animated.View style={styles.step} entering={STEP_FADE_IN} exiting={STEP_FADE_OUT}>
            <Text style={[text.title2, { color: colors.carlibDark }]}>
              {t('declaration.step4Title')}
            </Text>
            <Text style={[text.body, { color: colors.carlibSecondary }]}>
              {t('declaration.step4Subtitle')}
            </Text>

            <View style={styles.vehicleBlock}>
              <Text style={[text.callout, { color: colors.carlibSecondary }]}>
                {t('declaration.vehicleLabel')}
              </Text>
              {vehicles.length === 0 ? (
                <View style={styles.vehicleBlock}>
                  <Text style={[text.body, { color: colors.carlibSecondary }]}>
                    {t('declaration.vehicleNone')}
                  </Text>
                  <CarlibButton
                    label={t('declaration.vehicleAdd')}
                    variant="secondary"
                    onPress={() => router.push('/home/add-vehicle')}
                  />
                </View>
              ) : (
                vehicles.map((vehicle) => {
                  const selected = vehicle.id === selectedVehicle?.id;
                  return (
                    <Pressable
                      key={vehicle.id}
                      onPress={() => setVehicleId(vehicle.id)}
                      style={[
                        styles.vehicleRow,
                        {
                          backgroundColor: selected ? colors.brandYellowLight : colors.tileSecondary,
                          borderColor: selected ? colors.brandYellow : 'transparent',
                        },
                      ]}
                    >
                      <CarBrandLogo brand={vehicle.info.brand} size={32} />
                      <View style={styles.vehicleText}>
                        <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
                          {`${vehicle.info.brand} ${vehicle.info.model}`}
                        </Text>
                        <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
                          {vehicle.info.licensePlate}
                        </Text>
                      </View>
                      {selected && (
                        <RemixIcon name="checkboxCircleFill" size={20} color={colors.brandYellow} />
                      )}
                    </Pressable>
                  );
                })
              )}
            </View>

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
                {summaryRow(t('declaration.summaryLocation'), locationSummary)}
                {divider}
                {summaryRow(t('declaration.summaryDescription'), description.trim() || '—')}
                {divider}
                {summaryRow(
                  t('declaration.summaryVehicle'),
                  selectedVehicle != null
                    ? `${selectedVehicle.info.brand} ${selectedVehicle.info.model} · ${selectedVehicle.info.licensePlate}`
                    : '—',
                )}
              </View>
            </CarlibCard>
            <Text style={[text.caption, styles.disclaimer, { color: colors.carlibSecondary }]}>
              {t('declaration.summaryDisclaimer')}
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Pinned action bar over the scrolling step — the same glass inset the
          repair-status sheet uses. Opaque where glass is unavailable. */}
      <Glass
        borderRadius={0}
        style={styles.footerBar}
        fallbackStyle={{ borderWidth: 0, backgroundColor: colors.carlibScreenBg }}
      >
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
            onPress={goNext}
            isDisabled={!canContinue}
            style={styles.footerButton}
          />
        </View>
      </Glass>
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
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  actionCard: {
    flex: 1,
    height: 88,
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
  angleTag: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.full,
    // 45% black scrim over the photo, like the lightbox chips' fallback.
    backgroundColor: '#00000073',
  },
  photoPlaceholder: {
    width: '48%',
    height: 120,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
  },
  locateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  locateText: { flex: 1 },
  form: { gap: spacing.md },
  vehicleBlock: { gap: spacing.sm },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 2,
  },
  vehicleText: { flex: 1, gap: 2 },
  summaryBody: {
    alignSelf: 'stretch',
    gap: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  summaryValue: { flex: 1, textAlign: 'right' },
  divider: {
    height: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
  disclaimer: { textAlign: 'center' },
  footerBar: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.screenHorizontal,
  },
  footerButton: { flex: 1 },
});
