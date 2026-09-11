// Port of Carlib/Views/Driver/DriverClaimDetailView.swift — status-tinted
// 380pt hero gradient fixed behind the scroll (toolbarBackground(.hidden)
// look), horizontal stepper, vehicle/photos/garage cards and cancel action.
// Photo taps are no-ops for now — the fullscreen lightbox is a later phase.
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CarBrandLogo } from '@/components/CarBrandLogo';
import { CarlibButton } from '@/components/CarlibButton';
import { CarlibStatusBadge } from '@/components/CarlibStatusBadge';
import { claimPhotoURL } from '@/components/DummyImage';
import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import { StatusTimeline } from '@/components/StatusTimeline';
import { openTel } from '@/lib/links';
import { fromDialCode } from '@/models/countryDialCodes';
import type { AccidentType, ClaimStatus } from '@/models/enums';
import { garageFormattedPhone, type Garage } from '@/models/types';
import { garageForId } from '@/services/mockData';
import { useClaimStore } from '@/stores/claimStore';
import { carlibFont, sectionHeaderText, spacing, text, useTheme, type ColorTokens } from '@/theme';

// ClaimStatus → status color token, which doubles as the claimStatusLabel key.
const STATUS_KEY = {
  brouillon: 'draft',
  soumis: 'submitted',
  en_recherche: 'matched',
  accepte: 'accepted',
  pris_en_charge: 'inProgress',
  en_reparation: 'repairing',
  termine: 'completed',
  annule: 'cancelled',
  expire: 'expired',
} as const satisfies Record<ClaimStatus, keyof ColorTokens['status']>;

// Swift statusIcon switch, case for case.
const STATUS_ICON: Record<ClaimStatus, RemixIconName> = {
  brouillon: 'draftLine',
  soumis: 'sendPlaneLine',
  en_recherche: 'searchLine',
  accepte: 'checkDoubleLine',
  pris_en_charge: 'carLine',
  en_reparation: 'wrenchLine',
  termine: 'checkboxCircleLine',
  annule: 'closeLine',
  expire: 'timeLine',
};

const ACCIDENT_KEY = {
  collision: 'collision',
  stationnement: 'parking',
  vandalisme: 'vandalism',
  intemperies: 'weather',
  autre: 'other',
} as const satisfies Record<AccidentType, string>;

// Swift: [.draft, .submitted, .matched, .accepted].contains(claim.status)
const CANCELLABLE: readonly ClaimStatus[] = ['brouillon', 'soumis', 'en_recherche', 'accepte'];

function callGarage(garage: Garage) {
  // Swift builds an E.164 tel: URL by stripping everything but digits and '+'.
  openTel(`${garage.dialCode}${garage.phone}`.replace(/[^+0-9]/g, ''));
}

export default function DriverClaimDetailScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const claim = useClaimStore((s) => s.claims.find((c) => c.id === id));
  const cancelClaim = useClaimStore((s) => s.cancelClaim);

  useEffect(() => {
    if (claim == null && router.canGoBack()) router.back();
  }, [claim, router]);
  if (claim == null) return null;

  const statusKey = STATUS_KEY[claim.status];
  const statusColor = colors.status[statusKey].fg;
  const garage = garageForId(claim.assignedGarageId);
  const vehicle = claim.vehicleInfo;

  const confirmCancel = () => {
    Alert.alert(t('claimDetail.cancelTitle'), t('claimDetail.cancelMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('claimDetail.cancelConfirm'),
        style: 'destructive',
        onPress: () => {
          cancelClaim(claim.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      {/* Fixed backdrop — content scrolls over it, matching the Swift
          .background(alignment: .top) gradient. */}
      <LinearGradient
        colors={[`${statusColor}1F`, `${statusColor}0A`, colors.carlibScreenBg]}
        style={styles.heroGradient}
        pointerEvents="none"
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 44, paddingBottom: spacing.xxxl },
        ]}
      >
        {/* ── Hero header ── */}
        <View style={styles.hero}>
          {vehicle != null ? (
            <View style={[styles.logoCircle, { backgroundColor: colors.tileSecondary }]}>
              <CarBrandLogo brand={vehicle.brand} size={56} />
            </View>
          ) : (
            <View style={[styles.statusCircle, { backgroundColor: `${statusColor}26` }]}>
              <RemixIcon name={STATUS_ICON[claim.status]} size={28} color={statusColor} />
            </View>
          )}

          {/* Bare wrapper: the badge's own alignSelf would pin it left. */}
          <View>
            <CarlibStatusBadge
              claimStatus={claim.status}
              label={t(`claimStatusLabel.${statusKey}`)}
            />
          </View>

          {vehicle != null && (
            <>
              <Text style={[carlibFont(22, 'bold'), { color: colors.carlibDark }]}>
                {`${vehicle.brand} ${vehicle.model}`}
              </Text>
              <Text style={[text.caption, { color: colors.carlibSecondary }]}>
                {vehicle.licensePlate}
              </Text>
            </>
          )}

          {claim.accidentType != null && (
            <Text style={[text.body, { color: colors.carlibSecondary }]}>
              {t(`accidentTypeLabel.${ACCIDENT_KEY[claim.accidentType]}`)}
            </Text>
          )}
        </View>

        <View style={styles.sections}>
          {/* ── Tracking stepper ── */}
          <View style={[styles.section, styles.trackingSection]}>
            <Text style={[sectionHeaderText, { color: colors.carlibLabel }]}>TRACKING</Text>
            <StatusTimeline claim={claim} />
          </View>

          {/* ── Vehicle card ── */}
          {vehicle != null && (
            <View style={styles.section}>
              <Text style={[sectionHeaderText, { color: colors.carlibLabel }]}>VEHICLE</Text>
              <View style={[styles.vehicleRow, { backgroundColor: colors.tileSecondary }]}>
                <View style={[styles.vehicleLogoCircle, { backgroundColor: colors.carlibCardBorder }]}>
                  <CarBrandLogo brand={vehicle.brand} size={36} />
                </View>
                <View style={styles.vehicleText}>
                  <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
                    {`${vehicle.brand} ${vehicle.model}`}
                  </Text>
                  <View style={styles.plateRow}>
                    <Text style={[text.caption, { color: colors.carlibSecondary }]}>
                      {vehicle.licensePlate}
                    </Text>
                    {vehicle.year != null && (
                      <>
                        <Text style={[text.caption, { color: colors.carlibLabel }]}>·</Text>
                        <Text style={[text.caption, { color: colors.carlibSecondary }]}>
                          {String(vehicle.year)}
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* ── Photos ── */}
          {claim.photos.length > 0 && (
            <View style={styles.photosSection}>
              <Text style={[sectionHeaderText, styles.photosHeader, { color: colors.carlibLabel }]}>
                PHOTOS
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.photosRow}
              >
                {claim.photos.map((photo) => (
                  <View key={photo.id} style={[styles.photo, { backgroundColor: colors.tileSecondary }]}>
                    <View style={styles.photoPlaceholder}>
                      <RemixIcon name="imageLine" size={24} color={colors.carlibSecondary} />
                      <Text style={[text.caption, { color: colors.carlibSecondary }]}>
                        {photo.caption}
                      </Text>
                    </View>
                    <Image
                      source={{ uri: photo.imageUri ?? claimPhotoURL(photo.id) }}
                      contentFit="cover"
                      transition={{ duration: 200, timing: 'ease-out' }}
                      style={StyleSheet.absoluteFill}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* ── Assigned body shop ── */}
          {garage != null && (
            <View style={styles.section}>
              <Text style={[sectionHeaderText, { color: colors.carlibLabel }]}>BODY SHOP</Text>
              <View style={[styles.garageCard, { backgroundColor: colors.tileSecondary }]}>
                <View style={styles.garageRow}>
                  <View style={[styles.garageIconCircle, { backgroundColor: colors.tileSecondary }]}>
                    <RemixIcon name="mapPinLine" size={20} color={colors.brandYellow} />
                  </View>
                  <View style={styles.garageText}>
                    <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
                      {garage.name}
                    </Text>
                    <Text style={[text.caption, { color: colors.carlibSecondary }]}>
                      {garage.address}
                    </Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />

                <Pressable onPress={() => callGarage(garage)} style={styles.contactRow}>
                  <RemixIcon name="phoneLine" size={18} color={colors.brandYellow} />
                  <Text style={styles.flag}>{fromDialCode(garage.dialCode).flag}</Text>
                  <Text style={[text.body, styles.phoneNumber, { color: colors.carlibDark }]}>
                    {garageFormattedPhone(garage)}
                  </Text>
                  <RemixIcon name="arrowRightSLine" size={18} color={colors.carlibSecondary} />
                </Pressable>
              </View>
            </View>
          )}

          {/* ── Actions ── */}
          <View style={styles.section}>
            {garage != null && (
              <CarlibButton
                label={t('claimDetail.actionContact')}
                icon="phoneFill"
                onPress={() => callGarage(garage)}
              />
            )}
            {CANCELLABLE.includes(claim.status) && (
              <Pressable onPress={confirmCancel} hitSlop={8} style={styles.cancelButton}>
                <Text style={[text.body, { color: colors.destructiveRed }]}>
                  {t('claimDetail.actionCancel')}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating back chevron over the transparent header area. */}
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        style={[styles.backButton, { top: insets.top }]}
      >
        <RemixIcon name="arrowLeftSLine" size={26} color={colors.carlibDark} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380,
  },
  content: {},
  backButton: {
    position: 'absolute',
    left: spacing.xxs,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 16,
    paddingBottom: 32,
  },
  logoCircle: {
    padding: 12,
    borderRadius: 9999,
  },
  statusCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sections: { gap: 24 },
  section: {
    gap: 12,
    paddingHorizontal: 20,
  },
  trackingSection: { paddingTop: 24 },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 14,
  },
  vehicleLogoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleText: { flex: 1, gap: 2 },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  photosSection: { gap: 12 },
  photosHeader: { paddingHorizontal: 20 },
  photosRow: {
    gap: 10,
    paddingHorizontal: 20,
  },
  photo: {
    width: 140,
    height: 105,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholder: {
    alignItems: 'center',
    gap: 4,
  },
  garageCard: { borderRadius: 14, overflow: 'hidden' },
  garageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  garageIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  garageText: { flex: 1, gap: 2 },
  divider: { height: StyleSheet.hairlineWidth },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  flag: { fontSize: 16 },
  phoneNumber: { flex: 1 },
  cancelButton: {
    alignSelf: 'center',
    paddingTop: 4,
  },
});
