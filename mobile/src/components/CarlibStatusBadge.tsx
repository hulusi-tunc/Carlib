// Ported from Carlib/DesignSystem/Components/CarlibStatusBadge.swift.
// One polymorphic component replaces the three Swift convenience inits; the
// status→(color, icon) mapping is copied case-for-case. Built-in labels are
// the English L10n fallbacks — pass `label` once i18n lands (Phase 1).
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import type { BookingStatus, ClaimStatus, RepairStatus } from '@/models/enums';
import { radius, spacing, text, useTheme, type ColorTokens } from '@/theme';

type StatusColorKey = keyof ColorTokens['status'];

interface StatusSpec {
  color: StatusColorKey;
  icon: RemixIconName;
  label: string;
}

const claimStatusSpecs: Record<ClaimStatus, StatusSpec> = {
  brouillon: { color: 'draft', icon: 'pencilLine', label: 'Draft' },
  soumis: { color: 'submitted', icon: 'sendPlaneFill', label: 'Submitted' },
  en_recherche: { color: 'matched', icon: 'searchLine', label: 'Searching' },
  accepte: { color: 'accepted', icon: 'checkboxCircleFill', label: 'Accepted' },
  pris_en_charge: { color: 'inProgress', icon: 'carFill', label: 'In Progress' },
  en_reparation: { color: 'repairing', icon: 'toolsFill', label: 'Repairing' },
  termine: { color: 'completed', icon: 'verifiedBadgeFill', label: 'Completed' },
  annule: { color: 'cancelled', icon: 'closeCircleFill', label: 'Cancelled' },
  expire: { color: 'expired', icon: 'timeFill', label: 'Expired' },
};

const bookingStatusSpecs: Record<BookingStatus, StatusSpec> = {
  en_attente: { color: 'matched', icon: 'timeFill', label: 'Pending' },
  confirme: { color: 'accepted', icon: 'checkboxCircleFill', label: 'Confirmed' },
  arrive: { color: 'inProgress', icon: 'mapPinFill', label: 'Arrived at Shop' },
  depose: { color: 'completed', icon: 'carFill', label: 'Vehicle Dropped Off' },
  replanifie: { color: 'matched', icon: 'calendarScheduleLine', label: 'Rescheduled' },
  annule_conducteur: { color: 'cancelled', icon: 'closeCircleFill', label: 'Cancelled by Driver' },
  annule_garage: { color: 'cancelled', icon: 'closeCircleFill', label: 'Cancelled by Shop' },
};

const repairStatusSpecs: Record<RepairStatus, StatusSpec> = {
  diagnostic: { color: 'submitted', icon: 'stethoscopeLine', label: 'Diagnostic' },
  attente_pieces: { color: 'matched', icon: 'archiveFill', label: 'Waiting for Parts' },
  en_cours: { color: 'repairing', icon: 'toolsFill', label: 'Repairing' },
  controle: { color: 'inProgress', icon: 'shieldCheckFill', label: 'Quality Check' },
  pret: { color: 'completed', icon: 'thumbUpFill', label: 'Ready for Pickup' },
};

export type CarlibStatusBadgeProps = {
  /** Overrides the built-in English label (i18n). */
  label?: string;
} & (
  | { claimStatus: ClaimStatus; bookingStatus?: never; repairStatus?: never }
  | { claimStatus?: never; bookingStatus: BookingStatus; repairStatus?: never }
  | { claimStatus?: never; bookingStatus?: never; repairStatus: RepairStatus }
);

function resolveSpec(props: CarlibStatusBadgeProps): StatusSpec {
  if (props.claimStatus !== undefined) return claimStatusSpecs[props.claimStatus];
  if (props.bookingStatus !== undefined) return bookingStatusSpecs[props.bookingStatus];
  return repairStatusSpecs[props.repairStatus];
}

export function CarlibStatusBadge(props: CarlibStatusBadgeProps) {
  const { colors } = useTheme();
  const spec = resolveSpec(props);
  const { fg, bg } = colors.status[spec.color];

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <RemixIcon name={spec.icon} size={11} color={fg} />
      <Text style={[text.caption, { color: fg }]}>{props.label ?? spec.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    // SwiftUI badges hug their content — prevent stretching in column layouts.
    alignSelf: 'flex-start',
    gap: spacing.xxs,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },
});
