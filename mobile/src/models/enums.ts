// Ported from Carlib/Models/*.swift.
// IMPORTANT: the string literals are the Swift enums' FRENCH raw values —
// they are the persistence/wire format and must stay identical. UI labels
// come from i18n, never from these values.

export const CLAIM_STATUSES = [
  'brouillon', // draft
  'soumis', // submitted
  'en_recherche', // matched
  'accepte', // accepted
  'pris_en_charge', // inProgress
  'en_reparation', // repairing
  'termine', // completed
  'annule', // cancelled
  'expire', // expired
] as const;
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

/** A file still being handled — it blocks account deletion and counts as open in the vehicle space. */
export const OPEN_CLAIM_STATUSES: readonly ClaimStatus[] = [
  'soumis',
  'en_recherche',
  'accepte',
  'pris_en_charge',
  'en_reparation',
];

export function isClaimOpen(status: ClaimStatus): boolean {
  return OPEN_CLAIM_STATUSES.includes(status);
}

export const BOOKING_STATUSES = [
  'en_attente', // pending
  'confirme', // confirmed
  'arrive', // arrivedAtGarage
  'depose', // vehicleDroppedOff
  'replanifie', // rescheduled
  'annule_conducteur', // cancelledByDriver
  'annule_garage', // cancelledByGarage
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const REPAIR_STATUSES = [
  'diagnostic', // diagnostic
  'attente_pieces', // waitingParts
  'en_cours', // repairing
  'controle', // qualityCheck
  'pret', // readyForPickup
] as const;
export type RepairStatus = (typeof REPAIR_STATUSES)[number];

/** Vehicle document types (CARLIB-USERDOCS-01); French raw values like the other enums. */
export const DOCUMENT_TYPES = ['carte_grise', 'facture', 'rapport', 'autre'] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const ACCIDENT_TYPES = [
  'collision',
  'stationnement', // parking
  'vandalisme', // vandalism
  'intemperies', // weather
  'autre', // other
] as const;
export type AccidentType = (typeof ACCIDENT_TYPES)[number];

/** i18n key per accident type: `t(`accidentTypeLabel.${ACCIDENT_KEY[type]}`)`. */
export const ACCIDENT_KEY = {
  collision: 'collision',
  stationnement: 'parking',
  vandalisme: 'vandalism',
  intemperies: 'weather',
  autre: 'other',
} as const satisfies Record<AccidentType, string>;

export const REPAIR_SPECIALTIES = [
  'carrosserie', // bodywork
  'peinture', // painting
  'mecanique', // mechanics
  'vitrage', // windshield
  'detailing',
] as const;
export type RepairSpecialty = (typeof REPAIR_SPECIALTIES)[number];

export type UserRole = 'conducteur' | 'carrossier'; // driver | garage

export type AuthStatus = 'unknown' | 'unauthenticated' | 'authenticated' | 'sessionExpired';

/**
 * ClaimStatus → position in the 5-stage home-hero journey
 * (draft/submitted→1, matched→2, accepted/inProgress→3, repairing→4,
 * completed→5, cancelled/expired→0).
 */
export const CLAIM_STAGE_INDEX: Record<ClaimStatus, number> = {
  brouillon: 1,
  soumis: 1,
  en_recherche: 2,
  accepte: 3,
  pris_en_charge: 3,
  en_reparation: 4,
  termine: 5,
  annule: 0,
  expire: 0,
};

export const CLAIM_TOTAL_STAGES = 5;
