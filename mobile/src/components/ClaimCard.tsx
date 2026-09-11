// Port of Carlib/Views/Shared/ClaimCardView.swift — premium claim row card
// with a 4pt status-colored left edge bar. The iOS long-press context-menu
// photo preview + fullscreen lightbox are replaced by a plain `onPressPhoto`
// tap callback (the target screen decides what to open).
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CarBrandLogo } from '@/components/CarBrandLogo';
import { CarlibStatusBadge } from '@/components/CarlibStatusBadge';
import { claimPhotoURL } from '@/components/DummyImage';
import { PressableScale } from '@/components/PressableScale';
import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import { relativeFormatted } from '@/lib/dates';
import { ACCIDENT_KEY, type AccidentType, type ClaimStatus, type RepairStatus } from '@/models/enums';
import type { Claim, PhotoAttachment } from '@/models/types';
import { garageForId } from '@/services/mockData';
import { carlibFont, radius, text, useTheme, type ColorTokens } from '@/theme';

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

export type ClaimCardActions =
  /** Available request — quick accept/decline inline. */
  | { type: 'request'; onAccept: () => void; onDecline: () => void }
  /** Active case — shows current repair stage + tap to update. */
  | { type: 'inProgress'; currentStatus?: RepairStatus; onUpdate: () => void };

export interface ClaimCardProps {
  claim: Claim;
  showGarage?: boolean;
  actions?: ClaimCardActions;
  /** Tap on a photo thumb / "+n" chip (index into claim.photos). */
  onPressPhoto?: (index: number) => void;
}

export function ClaimCard({ claim, showGarage = true, actions, onPressPhoto }: ClaimCardProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const statusKey = STATUS_KEY[claim.status];
  const statusColor = colors.status[statusKey].fg;
  const garage = showGarage ? garageForId(claim.assignedGarageId) : undefined;
  const visible = claim.photos.slice(0, 3);
  const overflow = Math.max(claim.photos.length - visible.length, 0);

  const renderThumb = (photo: PhotoAttachment, index: number) => {
    const thumb = (
      <View style={[styles.thumb, { backgroundColor: colors.carlibScreenBg }]}>
        <RemixIcon
          name="imageLine"
          size={16}
          color={colors.carlibLabel}
          style={styles.thumbPlaceholder}
        />
        <Image
          source={{ uri: photo.imageUri ?? claimPhotoURL(photo.id, 200, 200) }}
          contentFit="cover"
          transition={{ duration: 200, timing: 'ease-out' }}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
    if (onPressPhoto == null) return <View key={photo.id}>{thumb}</View>;
    return (
      <PressableScale
        key={photo.id}
        scale={0.94}
        haptic="light"
        onPress={() => onPressPhoto(index)}
      >
        {thumb}
      </PressableScale>
    );
  };

  const renderActions = () => {
    if (actions == null) return null;

    if (actions.type === 'request') {
      const handleDecline = () => {
        void Haptics.selectionAsync();
        actions.onDecline();
      };
      const handleAccept = () => {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        actions.onAccept();
      };
      return (
        <View style={styles.actionsBlock}>
          <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />
          <View style={styles.requestRow}>
            <View style={styles.requestSlot}>
              <PressableScale
                scale={0.97}
                haptic="light"
                onPress={handleDecline}
                style={[styles.requestButton, { backgroundColor: colors.carlibScreenBg }]}
              >
                <Text style={[text.callout, { color: colors.carlibDark }]}>Decline</Text>
              </PressableScale>
            </View>
            <View style={styles.requestSlot}>
              <PressableScale
                scale={0.97}
                haptic="medium"
                onPress={handleAccept}
                style={[styles.requestButton, { backgroundColor: colors.brandYellow }]}
              >
                {/* brandYellow fill is the same in both schemes → content stays black. */}
                <Text style={[text.callout, { color: '#000000' }]}>Accept</Text>
                <RemixIcon name="checkLine" size={14} color="#000000" />
              </PressableScale>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.actionsBlock}>
        <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />
        <PressableScale
          scale={0.98}
          haptic="light"
          onPress={actions.onUpdate}
          style={[styles.updateRow, { backgroundColor: `${colors.carlibScreenBg}99` }]}
        >
          <View style={[styles.updateIconCircle, { backgroundColor: `${colors.brandYellow}24` }]}>
            <RemixIcon name="toolsFill" size={14} color={colors.brandYellow} />
          </View>
          <View style={styles.updateText}>
            <Text style={[text.caption, { color: colors.carlibSecondary }]}>Current stage</Text>
            <Text style={[text.callout, { color: colors.carlibDark }]}>
              {actions.currentStatus != null
                ? t(`repairStatusLabel.${REPAIR_KEY[actions.currentStatus]}`)
                : 'Not set'}
            </Text>
          </View>
          <View style={[styles.updateChip, { backgroundColor: colors.carlibScreenBg }]}>
            <Text style={[text.caption, { color: colors.carlibDark }]}>Update</Text>
            <RemixIcon name="arrowRightLine" size={12} color={colors.carlibDark} />
          </View>
        </PressableScale>
      </View>
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.tileSecondary }]}>
      <View style={[styles.edge, { backgroundColor: statusColor }]} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <CarlibStatusBadge
            claimStatus={claim.status}
            label={t(`claimStatusLabel.${statusKey}`)}
          />
          <Text style={[text.caption, { color: colors.carlibSecondary }]}>
            {relativeFormatted(claim.createdAt)}
          </Text>
        </View>

        <View style={styles.mainRow}>
          <View style={[styles.iconCircle, { backgroundColor: `${statusColor}1F` }]}>
            <RemixIcon
              name={claim.accidentType != null ? ACCIDENT_ICON[claim.accidentType] : 'questionLine'}
              size={20}
              color={statusColor}
            />
          </View>
          <View style={styles.mainText}>
            <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>
              {claim.accidentType != null
                ? t(`accidentTypeLabel.${ACCIDENT_KEY[claim.accidentType]}`)
                : '—'}
            </Text>
            <Text
              style={[text.caption, { color: colors.carlibSecondary }]}
              numberOfLines={2}
            >
              {claim.description}
            </Text>
          </View>
        </View>

        {claim.photos.length > 0 && (
          <View style={styles.photoRow}>
            {visible.map(renderThumb)}
            {overflow > 0 &&
              (onPressPhoto != null ? (
                <PressableScale
                  scale={0.94}
                  haptic="light"
                  onPress={() => onPressPhoto(visible.length)}
                >
                  <View style={[styles.overflowChip, { backgroundColor: colors.carlibScreenBg }]}>
                    <Text style={[text.caption, { color: colors.carlibDark }]}>{`+${overflow}`}</Text>
                  </View>
                </PressableScale>
              ) : (
                <View style={[styles.overflowChip, { backgroundColor: colors.carlibScreenBg }]}>
                  <Text style={[text.caption, { color: colors.carlibDark }]}>{`+${overflow}`}</Text>
                </View>
              ))}
          </View>
        )}

        {claim.vehicleInfo != null && (
          <View style={styles.metaRow}>
            <CarBrandLogo brand={claim.vehicleInfo.brand} size={16} />
            <Text style={[text.caption, { color: colors.carlibSecondary }]}>
              {`${claim.vehicleInfo.brand} ${claim.vehicleInfo.model}`}
            </Text>
            <Text style={[text.caption, { color: colors.carlibLabel }]}>·</Text>
            <Text style={[text.caption, { color: colors.carlibSecondary }]}>
              {claim.vehicleInfo.licensePlate}
            </Text>
          </View>
        )}

        {garage != null && (
          <View style={styles.metaRow}>
            <RemixIcon name="mapPinLine" size={14} color={colors.brandYellow} />
            <Text style={[text.caption, { color: colors.carlibDark }]}>{garage.name}</Text>
          </View>
        )}

        {renderActions()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    overflow: 'hidden',
  },
  edge: { width: 4 },
  content: {
    flex: 1,
    paddingLeft: 14,
    paddingRight: 16,
    paddingVertical: 14,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainText: { flex: 1, gap: 3 },
  photoRow: { flexDirection: 'row', gap: 6 },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbPlaceholder: { opacity: 0.6 },
  overflowChip: {
    width: 56,
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionsBlock: { gap: 10, paddingTop: 4 },
  divider: { height: StyleSheet.hairlineWidth, alignSelf: 'stretch' },
  requestRow: { flexDirection: 'row', gap: 8 },
  requestSlot: { flex: 1 },
  requestButton: {
    alignSelf: 'stretch',
    height: 40,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  updateRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  updateIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateText: { flex: 1 },
  updateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
});
