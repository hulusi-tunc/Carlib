// Port of Carlib/Views/Garage/GarageClaimDetailView.swift — status-tinted
// hero with Accept/Refuse pair (available) or the Update-status block (active
// cases), tracking stepper, description, photo strip, vehicle and location
// cards. Shared content rendered by thin dashboard/claims route wrappers.
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CarBrandLogo } from '@/components/CarBrandLogo';
import { CarlibStatusBadge } from '@/components/CarlibStatusBadge';
import { claimPhotoURL } from '@/components/DummyImage';
import { PressableScale } from '@/components/PressableScale';
import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import { StatusTimeline } from '@/components/StatusTimeline';
import { shortFormatted } from '@/lib/dates';
import { ACCIDENT_KEY, type AccidentType, type ClaimStatus, type RepairStatus } from '@/models/enums';
import type { PhotoAttachment } from '@/models/types';
import { garages } from '@/services/mockData';
import { useClaimStore } from '@/stores/claimStore';
import { carlibFont, spacing, text, useTheme, type ColorTokens } from '@/theme';

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

const ACCIDENT_ICON: Record<AccidentType, RemixIconName> = {
  collision: 'carLine',
  stationnement: 'parkingBoxLine',
  vandalisme: 'alarmWarningLine',
  intemperies: 'thunderstormsLine',
  autre: 'questionLine',
};

const REPAIR_KEY = {
  diagnostic: 'diagnostic',
  attente_pieces: 'waitingParts',
  en_cours: 'repairing',
  controle: 'qualityCheck',
  pret: 'ready',
} as const satisfies Record<RepairStatus, string>;

// Swift: [.submitted, .matched] / [.accepted, .inProgress, .repairing].
const AVAILABLE_STATUSES: readonly ClaimStatus[] = ['soumis', 'en_recherche'];
const ACTIVE_STATUSES: readonly ClaimStatus[] = ['accepte', 'pris_en_charge', 'en_reparation'];

// Signed-in garage persona — MockData garages[0], Carrosserie Dupont.
const DUPONT_GARAGE_ID = garages[0].id;

export interface GarageClaimDetailProps {
  claimId?: string;
}

export function GarageClaimDetail({ claimId }: GarageClaimDetailProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const claim = useClaimStore((s) => s.claims.find((c) => c.id === claimId));
  const acceptClaim = useClaimStore((s) => s.acceptClaim);
  const declineClaim = useClaimStore((s) => s.declineClaim);

  useEffect(() => {
    if (claim == null && router.canGoBack()) router.back();
  }, [claim, router]);
  if (claim == null) return null;

  const statusKey = STATUS_KEY[claim.status];
  const statusColor = colors.status[statusKey].fg;
  const vehicle = claim.vehicleInfo;
  const isAvailable = AVAILABLE_STATUSES.includes(claim.status);
  const isActiveCase = ACTIVE_STATUSES.includes(claim.status);

  const handleRefuse = () => {
    void Haptics.selectionAsync();
    declineClaim(claim.id);
    router.back();
  };

  const handleAccept = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    acceptClaim(claim.id, DUPONT_GARAGE_ID);
    router.back();
  };

  const openStatusSheet = () => {
    router.push(`/(garage)/claims/repair-status?claimId=${claim.id}`);
  };

  const openLightbox = (index: number) => {
    router.push(`/(garage)/claims/lightbox?claimId=${claim.id}&index=${index}`);
  };

  const sectionLabel = (label: string) => (
    <Text style={[styles.sectionLabel, { color: colors.carlibSecondary }]}>{label}</Text>
  );

  const renderPhotoTile = (photo: PhotoAttachment, index: number) => (
    <PressableScale key={photo.id} scale={0.96} haptic="light" onPress={() => openLightbox(index)}>
      <View style={[styles.photoTile, { backgroundColor: colors.tileSecondary }]}>
        <RemixIcon
          name="imageLine"
          size={22}
          color={`${colors.carlibLabel}99`}
          style={styles.photoPlaceholder}
        />
        <Image
          source={{ uri: photo.imageUri ?? claimPhotoURL(photo.id, 600, 450) }}
          contentFit="cover"
          transition={{ duration: 250, timing: 'ease-out' }}
          style={StyleSheet.absoluteFill}
        />
        {photo.caption !== '' && (
          <View style={styles.captionPill}>
            <Text style={[text.caption, styles.captionText]}>{photo.caption}</Text>
          </View>
        )}
      </View>
    </PressableScale>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      {/* Fixed hero backdrop — Swift LinearGradient 0.14 → 0.04 → screenBg. */}
      <LinearGradient
        colors={[`${statusColor}24`, `${statusColor}0A`, colors.carlibScreenBg]}
        style={styles.heroGradient}
        pointerEvents="none"
      />

      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 44, paddingBottom: spacing.xxxl }}
      >
        {/* ── Hero header ── */}
        <View style={styles.hero}>
          {vehicle != null ? (
            <View style={[styles.logoCircle, { backgroundColor: colors.tileSecondary }]}>
              <CarBrandLogo brand={vehicle.brand} size={52} />
            </View>
          ) : (
            <View style={[styles.statusCircle, { backgroundColor: `${statusColor}26` }]}>
              <RemixIcon
                name={claim.accidentType != null ? ACCIDENT_ICON[claim.accidentType] : 'questionLine'}
                size={28}
                color={statusColor}
              />
            </View>
          )}

          <View style={styles.heroText}>
            {/* Bare wrapper: the badge's own alignSelf would pin it left. */}
            <View>
              <CarlibStatusBadge claimStatus={claim.status} label={t(`claimStatusLabel.${statusKey}`)} />
            </View>

            {vehicle != null && (
              <>
                <Text style={[text.title1, { color: colors.carlibDark }]}>
                  {`${vehicle.brand} ${vehicle.model}`}
                </Text>
                <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
                  {vehicle.licensePlate}
                </Text>
              </>
            )}

            {claim.accidentType != null && (
              <View style={styles.accidentRow}>
                <RemixIcon
                  name={ACCIDENT_ICON[claim.accidentType]}
                  size={14}
                  color={colors.carlibSecondary}
                />
                <Text style={[text.callout, { color: colors.carlibSecondary }]}>
                  {t(`accidentTypeLabel.${ACCIDENT_KEY[claim.accidentType]}`)}
                </Text>
              </View>
            )}
          </View>

          {/* ── Primary action block ── */}
          {isAvailable && (
            <View style={styles.actionRow}>
              <View style={styles.actionSlot}>
                <PressableScale
                  scale={0.97}
                  haptic="light"
                  onPress={handleRefuse}
                  style={[styles.actionButton, { backgroundColor: colors.tileSecondary }]}
                >
                  <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
                    {t('garageClaimDetail.actionRefuse')}
                  </Text>
                </PressableScale>
              </View>
              <View style={styles.actionSlot}>
                <PressableScale
                  scale={0.97}
                  haptic="medium"
                  onPress={handleAccept}
                  style={[styles.actionButton, { backgroundColor: colors.brandYellow }]}
                >
                  <Text style={[carlibFont(15, 'medium'), styles.onYellow]}>
                    {t('garageClaimDetail.actionAccept')}
                  </Text>
                  <RemixIcon name="checkLine" size={16} color="#000000" />
                </PressableScale>
              </View>
            </View>
          )}

          {isActiveCase && (
            <PressableScale
              scale={0.98}
              haptic="light"
              onPress={openStatusSheet}
              style={[styles.updateBlock, { backgroundColor: colors.tileSecondary }]}
            >
              <View style={[styles.updateIconCircle, { backgroundColor: `${colors.brandYellow}24` }]}>
                <RemixIcon name="toolsFill" size={16} color={colors.brandYellow} />
              </View>
              <View style={styles.updateTextCol}>
                {/* Hardcoded in Swift (not L10n) — kept verbatim. */}
                <Text style={[text.caption, { color: colors.carlibSecondary }]}>Current stage</Text>
                <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
                  {claim.repairStatus != null
                    ? t(`repairStatusLabel.${REPAIR_KEY[claim.repairStatus]}`)
                    : 'Not set'}
                </Text>
              </View>
              <View style={[styles.updateChip, { backgroundColor: colors.brandYellow }]}>
                <Text style={[text.callout, styles.onYellow]}>Update</Text>
                <RemixIcon name="arrowRightLine" size={14} color="#000000" />
              </View>
            </PressableScale>
          )}
        </View>

        <View style={styles.sections}>
          {/* ── Tracking ── */}
          {claim.status !== 'brouillon' && (
            <View style={styles.section}>
              {sectionLabel('TRACKING')}
              <StatusTimeline claim={claim} />
            </View>
          )}

          {/* ── Description ── */}
          <View style={styles.section}>
            {sectionLabel('DESCRIPTION')}
            <View style={[styles.card, { backgroundColor: colors.tileSecondary }]}>
              {claim.accidentType != null && (
                <View style={styles.cardAccidentRow}>
                  <RemixIcon
                    name={ACCIDENT_ICON[claim.accidentType]}
                    size={16}
                    color={colors.brandYellow}
                  />
                  <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
                    {t(`accidentTypeLabel.${ACCIDENT_KEY[claim.accidentType]}`)}
                  </Text>
                </View>
              )}
              <Text style={[text.body, { color: colors.carlibDark }]}>{claim.description}</Text>
              <View style={styles.timeRow}>
                <RemixIcon name="timeLine" size={12} color={colors.carlibSecondary} />
                <Text style={[text.caption, { color: colors.carlibSecondary }]}>
                  {shortFormatted(claim.createdAt)}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Photos ── */}
          {claim.photos.length > 0 && (
            <View style={styles.photosSection}>
              <View style={styles.photosHeader}>
                {sectionLabel('PHOTOS')}
                <Text style={[text.caption, { color: colors.carlibSecondary }]}>
                  {String(claim.photos.length)}
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.photosRow}
              >
                {claim.photos.map(renderPhotoTile)}
              </ScrollView>
            </View>
          )}

          {/* ── Vehicle ── */}
          {vehicle != null && (
            <View style={styles.section}>
              {sectionLabel('VEHICLE')}
              <View style={[styles.card, styles.vehicleRow, { backgroundColor: colors.tileSecondary }]}>
                <View style={[styles.vehicleLogoCircle, { backgroundColor: colors.carlibCardBorder }]}>
                  <CarBrandLogo brand={vehicle.brand} size={32} />
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

          {/* ── Location — hardcoded demo data in Swift, kept verbatim. ── */}
          <View style={styles.section}>
            {sectionLabel('LOCATION')}
            <View style={[styles.card, styles.locationRow, { backgroundColor: colors.tileSecondary }]}>
              <View style={[styles.locationIconCircle, { backgroundColor: `${colors.brandYellow}24` }]}>
                <RemixIcon name="mapPinFill" size={18} color={colors.brandYellow} />
              </View>
              <View style={styles.vehicleText}>
                <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>Paris 11e</Text>
                <Text style={[text.caption, { color: colors.carlibSecondary }]}>48.856, 2.352</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

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
  hero: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 20,
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
  heroText: { alignItems: 'center', gap: 6 },
  accidentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'stretch',
    paddingTop: 4,
  },
  actionSlot: { flex: 1 },
  actionButton: {
    alignSelf: 'stretch',
    height: 52,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  onYellow: { color: '#000000' },
  updateBlock: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 16,
    marginTop: 4,
  },
  updateIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateTextCol: { flex: 1 },
  updateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  sections: { gap: 24, paddingTop: 24 },
  section: {
    gap: 12,
    paddingHorizontal: 20,
  },
  sectionLabel: {
    ...carlibFont(13, 'medium'),
    letterSpacing: 1.2,
  },
  card: {
    gap: 10,
    padding: 14,
    borderRadius: 14,
  },
  cardAccidentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 2,
  },
  photosSection: { gap: 12 },
  photosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  photosRow: {
    gap: 10,
    paddingHorizontal: 20,
  },
  photoTile: {
    width: 180,
    height: 135,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholder: { opacity: 0.6 },
  // Caption sits on top of the photo, not on a themed surface — the scrim and
  // its white text stay fixed in both schemes (Swift: .white on black 0.55).
  captionPill: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#0000008C',
  },
  captionText: { color: '#FFFFFF' },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
