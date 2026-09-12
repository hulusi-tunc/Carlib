// Ported from Carlib/Services/MockData.swift. Static mock data for lo-fi
// screens. All content in French with realistic Paris-area data.
import { addDays, addHours, set, startOfDay } from 'date-fns';

import { defaultCountryDialCode } from '@/models/countryDialCodes';
import type {
  Claim,
  Garage,
  PhotoAttachment,
  TimeSlot,
  Vehicle,
  VehicleInfo,
} from '@/models/types';

export function daysFromNow(days: number): Date {
  return addDays(new Date(), days);
}

export function hoursFromNow(hours: number): Date {
  return addHours(new Date(), hours);
}

// Random ids match iOS, where seed PhotoAttachments/TimeSlots get fresh UUIDs
// per launch/generation.
function randomId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const r = (Math.random() * 16) | 0;
    const v = char === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function photo(caption: string): PhotoAttachment {
  return { id: randomId(), caption, timestamp: new Date() };
}

// MARK: Vehicles

export const vehicleClio: VehicleInfo = {
  licensePlate: 'AA-123-BB',
  brand: 'Renault',
  model: 'Clio V',
  year: 2021,
  color: 'Gris Platine',
};

export const vehicle308: VehicleInfo = {
  licensePlate: 'BC-456-CD',
  brand: 'Peugeot',
  model: '308',
  year: 2019,
  color: 'Bleu Virtuel',
};

export const vehicleGolf: VehicleInfo = {
  licensePlate: 'DE-789-EF',
  brand: 'Volkswagen',
  model: 'Golf 8',
  year: 2022,
  color: 'Noir Intense',
};

export const vehicleC3: VehicleInfo = {
  licensePlate: 'FG-012-HI',
  brand: 'Citroën',
  model: 'C3',
  year: 2023,
  color: 'Rouge Élixir',
};

export const vehicles: Vehicle[] = [
  {
    id: '20000001-0000-0000-0000-000000000001',
    info: vehicle308,
    nickname: 'Daily',
    isDefault: true,
  },
  {
    id: '20000002-0000-0000-0000-000000000002',
    info: vehicleClio,
    nickname: 'Weekend',
    isDefault: false,
  },
  {
    id: '20000003-0000-0000-0000-000000000003',
    info: vehicleC3,
    isDefault: false,
  },
];

// MARK: Garages

const frDialCode = defaultCountryDialCode.dialCode;

export const garages: Garage[] = [
  {
    id: '00000001-0000-0000-0000-000000000001',
    name: 'Carrosserie Dupont',
    address: '47 rue de la Roquette, 75011 Paris',
    location: { latitude: 48.8566, longitude: 2.3746 },
    dialCode: frDialCode,
    phone: '01 43 55 12 34',
    specialties: ['carrosserie', 'peinture', 'detailing'],
    photos: [
      photo('Devanture'),
      photo('Baie de carrosserie'),
      photo('Cabine de peinture'),
      photo("Espace d'accueil"),
    ],
    isAvailable: true,
    coverageRadiusKm: 15,
  },
  {
    id: '00000002-0000-0000-0000-000000000002',
    name: 'Garage Martin & Fils',
    address: '12 avenue Daumesnil, 75012 Paris',
    location: { latitude: 48.8432, longitude: 2.3725 },
    dialCode: frDialCode,
    phone: '01 44 67 89 01',
    specialties: ['carrosserie', 'peinture', 'mecanique', 'vitrage'],
    photos: [],
    isAvailable: true,
    coverageRadiusKm: 20,
  },
  {
    id: '00000003-0000-0000-0000-000000000003',
    name: 'Auto Repair Express',
    address: '85 boulevard Voltaire, 75011 Paris',
    location: { latitude: 48.861, longitude: 2.368 },
    dialCode: frDialCode,
    phone: '01 55 28 90 12',
    specialties: ['carrosserie', 'mecanique'],
    photos: [],
    isAvailable: true,
    coverageRadiusKm: 10,
  },
  {
    id: '00000004-0000-0000-0000-000000000004',
    name: 'SOS Carrosserie Paris 12',
    address: '156 rue de Charenton, 75012 Paris',
    location: { latitude: 48.8395, longitude: 2.389 },
    dialCode: frDialCode,
    phone: '01 43 42 11 22',
    specialties: ['carrosserie'],
    photos: [],
    isAvailable: false,
    coverageRadiusKm: 8,
  },
  {
    id: '00000005-0000-0000-0000-000000000005',
    name: 'Atelier des Batignolles',
    address: '38 rue des Batignolles, 75017 Paris',
    location: { latitude: 48.8847, longitude: 2.3218 },
    dialCode: frDialCode,
    phone: '01 42 93 56 18',
    specialties: ['carrosserie', 'peinture', 'mecanique', 'vitrage', 'detailing'],
    photos: [
      photo('Façade atelier'),
      photo('Cabine de peinture'),
      photo('Zone carrosserie'),
      photo('Accueil client'),
    ],
    isAvailable: true,
    coverageRadiusKm: 25,
  },
  {
    id: '00000006-0000-0000-0000-000000000006',
    name: 'Carrosserie République',
    address: '5 rue de Bretagne, 75003 Paris',
    location: { latitude: 48.8632, longitude: 2.3621 },
    dialCode: frDialCode,
    phone: '01 48 87 24 65',
    specialties: ['detailing'],
    photos: [photo('Atelier detailing'), photo('Finition')],
    isAvailable: true,
    coverageRadiusKm: 12,
  },
];

/** Years the shop has been operating (shown in Garage Profile stats). */
export const garageYearsActive: Record<string, number> = {
  '00000001-0000-0000-0000-000000000001': 12,
  '00000002-0000-0000-0000-000000000002': 27,
  '00000003-0000-0000-0000-000000000003': 6,
  '00000004-0000-0000-0000-000000000004': 4,
  '00000005-0000-0000-0000-000000000005': 18,
  '00000006-0000-0000-0000-000000000006': 3,
};

// MARK: Claims

export const claims: Claim[] = [
  // Draft — just started
  {
    id: '10000001-0000-0000-0000-000000000001',
    status: 'brouillon',
    accidentType: 'collision',
    description: 'Collision à un carrefour, pare-chocs arrière enfoncé',
    photos: [],
    location: { latitude: 48.8566, longitude: 2.3522 },
    vehicleInfo: vehicleClio,
    createdAt: daysFromNow(0),
    updatedAt: daysFromNow(0),
  },
  // Submitted — waiting for match
  {
    id: '10000002-0000-0000-0000-000000000002',
    status: 'soumis',
    accidentType: 'stationnement',
    description: 'Rayure profonde côté passager sur parking souterrain',
    photos: [photo('Côté passager'), photo('Détail rayure'), photo('Vue arrière')],
    location: { latitude: 48.8601, longitude: 2.35 },
    vehicleInfo: vehicle308,
    createdAt: hoursFromNow(-2),
    updatedAt: hoursFromNow(-2),
  },
  // Matched — inbound request fresh in the inbox
  {
    id: '10000010-0000-0000-0000-000000000010',
    status: 'en_recherche',
    accidentType: 'collision',
    description: "Collision par l'arrière à un feu rouge, coffre enfoncé",
    photos: [photo('Coffre'), photo('Pare-chocs arrière')],
    location: { latitude: 48.8558, longitude: 2.37 },
    vehicleInfo: vehicleGolf,
    driverName: 'Marie Bernard',
    driverPhone: '+33 6 45 67 89 10',
    createdAt: hoursFromNow(-4),
    updatedAt: hoursFromNow(-4),
  },
  // Submitted — minor glass break, been waiting a while
  {
    id: '10000011-0000-0000-0000-000000000011',
    status: 'soumis',
    accidentType: 'vandalisme',
    description: 'Vitre latérale arrière brisée pendant la nuit',
    photos: [photo('Vitre cassée')],
    location: { latitude: 48.847, longitude: 2.382 },
    vehicleInfo: vehicleClio,
    driverName: 'Thomas Petit',
    driverPhone: '+33 6 98 76 54 32',
    createdAt: hoursFromNow(-12),
    updatedAt: hoursFromNow(-12),
  },
  // Matched — urgent, just came in
  {
    id: '10000012-0000-0000-0000-000000000012',
    status: 'en_recherche',
    accidentType: 'collision',
    description: 'Aile avant droite à remplacer suite à choc latéral',
    photos: [photo('Aile avant droite'), photo('Détail dommage'), photo('Plaque arrachée')],
    location: { latitude: 48.859, longitude: 2.368 },
    vehicleInfo: vehicle308,
    driverName: 'Léa Moreau',
    driverPhone: '+33 6 11 22 33 44',
    createdAt: hoursFromNow(-1),
    updatedAt: hoursFromNow(-1),
  },
  // Accepted — garage assigned, booking pending
  {
    id: '10000003-0000-0000-0000-000000000003',
    status: 'accepte',
    accidentType: 'collision',
    description: 'Accrochage en marche arrière, aile avant gauche touchée',
    photos: [photo('Aile avant gauche'), photo('Vue de face')],
    location: { latitude: 48.845, longitude: 2.375 },
    vehicleInfo: vehicleClio,
    assignedGarageId: '00000001-0000-0000-0000-000000000001',
    bookingStatus: 'confirme',
    driverName: 'Laurent Cassagne',
    driverPhone: '+33 6 12 34 56 78',
    createdAt: daysFromNow(-3),
    updatedAt: daysFromNow(-1),
  },
  // Accepted — second appointment today at our garage
  {
    id: '10000007-0000-0000-0000-000000000007',
    status: 'accepte',
    accidentType: 'stationnement',
    description: 'Portière arrière enfoncée sur parking de supermarché',
    photos: [photo('Portière arrière')],
    location: { latitude: 48.849, longitude: 2.378 },
    vehicleInfo: vehicle308,
    assignedGarageId: '00000001-0000-0000-0000-000000000001',
    bookingStatus: 'replanifie',
    driverName: 'Sophie Laurent',
    driverPhone: '+33 6 78 90 12 34',
    createdAt: daysFromNow(-2),
    updatedAt: daysFromNow(0),
  },
  // Accepted — appointment tomorrow at our garage
  {
    id: '10000008-0000-0000-0000-000000000008',
    status: 'accepte',
    accidentType: 'collision',
    description: 'Aile avant droite cabossée suite à collision latérale',
    photos: [photo('Aile avant droite'), photo('Vue générale')],
    location: { latitude: 48.8525, longitude: 2.3695 },
    vehicleInfo: vehicleGolf,
    assignedGarageId: '00000001-0000-0000-0000-000000000001',
    bookingStatus: 'en_attente',
    driverName: 'Philippe Durand',
    driverPhone: '+33 6 23 45 67 89',
    createdAt: daysFromNow(-1),
    updatedAt: daysFromNow(0),
  },
  // In repair — already at our garage
  {
    id: '10000009-0000-0000-0000-000000000009',
    status: 'en_reparation',
    accidentType: 'vandalisme',
    description: 'Rayures multiples sur capot et pare-chocs avant',
    photos: [photo('Capot'), photo('Pare-chocs')],
    location: { latitude: 48.8548, longitude: 2.3702 },
    vehicleInfo: vehicleClio,
    assignedGarageId: '00000001-0000-0000-0000-000000000001',
    bookingStatus: 'depose',
    repairStatus: 'en_cours',
    driverName: 'Inès Moreau',
    driverPhone: '+33 6 89 01 23 45',
    createdAt: daysFromNow(-5),
    updatedAt: daysFromNow(0),
  },
  // In repair
  {
    id: '10000004-0000-0000-0000-000000000004',
    status: 'en_reparation',
    accidentType: 'vandalisme',
    description: 'Rétroviseur arraché et portière rayée — acte de vandalisme',
    photos: [photo('Rétroviseur'), photo('Portière'), photo("Vue d'ensemble")],
    location: { latitude: 48.853, longitude: 2.369 },
    vehicleInfo: vehicleGolf,
    assignedGarageId: '00000002-0000-0000-0000-000000000002',
    bookingStatus: 'depose',
    repairStatus: 'en_cours',
    createdAt: daysFromNow(-7),
    updatedAt: daysFromNow(-1),
  },
  // Completed
  {
    id: '10000005-0000-0000-0000-000000000005',
    status: 'termine',
    accidentType: 'intemperies',
    description: 'Grêle — nombreux impacts sur le capot et le toit',
    photos: [photo('Capot'), photo('Toit')],
    location: { latitude: 48.865, longitude: 2.34 },
    vehicleInfo: vehicle308,
    assignedGarageId: '00000002-0000-0000-0000-000000000002',
    bookingStatus: 'depose',
    repairStatus: 'pret',
    createdAt: daysFromNow(-21),
    updatedAt: daysFromNow(-2),
  },
  // Cancelled by driver — insurer took it over directly
  {
    id: '10000006-0000-0000-0000-000000000006',
    status: 'annule',
    accidentType: 'autre',
    description: "Sinistre annulé — prise en charge directe par l'assurance",
    photos: [],
    vehicleInfo: vehicleClio,
    bookingStatus: 'annule_conducteur',
    createdAt: daysFromNow(-14),
    updatedAt: daysFromNow(-12),
  },
  // In progress — just arrived at the shop, diagnostic underway
  {
    id: '10000013-0000-0000-0000-000000000013',
    status: 'pris_en_charge',
    accidentType: 'collision',
    description: 'Choc latéral droit — longeron à évaluer après démontage',
    photos: [photo('Longeron'), photo('Portière avant')],
    location: { latitude: 48.856, longitude: 2.371 },
    vehicleInfo: vehicleGolf,
    assignedGarageId: '00000001-0000-0000-0000-000000000001',
    bookingStatus: 'arrive',
    repairStatus: 'diagnostic',
    driverName: 'Camille Rousseau',
    driverPhone: '+33 6 54 32 10 98',
    createdAt: daysFromNow(-4),
    updatedAt: hoursFromNow(-2),
  },
  // In progress — waiting on parts from the supplier
  {
    id: '10000014-0000-0000-0000-000000000014',
    status: 'pris_en_charge',
    accidentType: 'collision',
    description: 'Pare-chocs avant et optique gauche à remplacer',
    photos: [photo('Pare-chocs'), photo('Optique gauche'), photo('Calandre')],
    location: { latitude: 48.848, longitude: 2.376 },
    vehicleInfo: vehicle308,
    assignedGarageId: '00000002-0000-0000-0000-000000000002',
    bookingStatus: 'depose',
    repairStatus: 'attente_pieces',
    driverName: 'Julien Martin',
    driverPhone: '+33 6 44 55 66 77',
    createdAt: daysFromNow(-6),
    updatedAt: daysFromNow(-1),
  },
  // Repairing — quality check before pickup
  {
    id: '10000015-0000-0000-0000-000000000015',
    status: 'en_reparation',
    accidentType: 'collision',
    description: 'Aile arrière gauche redressée et repeinte',
    photos: [photo('Aile arrière'), photo('Zone repeinte')],
    location: { latitude: 48.854, longitude: 2.3705 },
    vehicleInfo: vehicleClio,
    assignedGarageId: '00000001-0000-0000-0000-000000000001',
    bookingStatus: 'depose',
    repairStatus: 'controle',
    driverName: 'Nadia Benali',
    driverPhone: '+33 6 33 22 11 00',
    createdAt: daysFromNow(-9),
    updatedAt: hoursFromNow(-6),
  },
  // Expired — declined by nearby shops, request timed out
  {
    id: '10000016-0000-0000-0000-000000000016',
    status: 'expire',
    accidentType: 'stationnement',
    description: "Éraflure mineure sur parking — aucun garage n'a répondu dans les délais",
    photos: [photo('Éraflure portière')],
    vehicleInfo: vehicleC3,
    createdAt: daysFromNow(-32),
    updatedAt: daysFromNow(-18),
  },
  // Cancelled by garage — shop had to decline after accepting
  {
    id: '10000017-0000-0000-0000-000000000017',
    status: 'annule',
    accidentType: 'collision',
    description: 'Annulée par le garage — atelier en sous-effectif cette semaine',
    photos: [photo('Aile avant')],
    vehicleInfo: vehicleClio,
    assignedGarageId: '00000003-0000-0000-0000-000000000003',
    bookingStatus: 'annule_garage',
    createdAt: daysFromNow(-8),
    updatedAt: daysFromNow(-5),
  },
];

/** Claims filtered for driver "active" view. */
export const activeClaims: Claim[] = claims.filter((claim) =>
  ['soumis', 'en_recherche', 'accepte', 'pris_en_charge', 'en_reparation'].includes(claim.status),
);

/** Claims filtered for driver "completed" view. */
export const pastClaims: Claim[] = claims.filter((claim) =>
  ['termine', 'annule', 'expire'].includes(claim.status),
);

/** Claims visible to garages (available to accept). */
export const availableClaims: Claim[] = claims.filter((claim) =>
  ['soumis', 'en_recherche'].includes(claim.status),
);

/** Claims already accepted by a garage. */
export const garageClaims: Claim[] = claims.filter(
  (claim) =>
    ['accepte', 'pris_en_charge', 'en_reparation', 'termine'].includes(claim.status) &&
    claim.assignedGarageId != null,
);

// MARK: Time slots

/**
 * Time slot seed for the booking flow. Every slot reflects its real state:
 * - claimId != null → already booked, isAvailable = false
 * - isBlocked → lunch / vacation, isAvailable = false
 * - otherwise → open, isAvailable = true
 *
 * Multiple garages are seeded so the driver-side booking flow has options
 * across different shops, not just Carrosserie Dupont.
 */
export function generateTimeSlots(now?: Date): TimeSlot[] {
  const today = startOfDay(now ?? new Date());

  function slot(options: {
    garageId: string;
    dayOffset: number;
    startHour: number;
    startMinute?: number;
    endHour: number;
    endMinute?: number;
    claimId?: string;
    isBlocked?: boolean;
  }): TimeSlot {
    const date = addDays(today, options.dayOffset);
    const isBlocked = options.isBlocked ?? false;
    return {
      id: randomId(),
      garageId: options.garageId,
      claimId: options.claimId,
      date,
      startTime: set(date, {
        hours: options.startHour,
        minutes: options.startMinute ?? 0,
        seconds: 0,
        milliseconds: 0,
      }),
      endTime: set(date, {
        hours: options.endHour,
        minutes: options.endMinute ?? 0,
        seconds: 0,
        milliseconds: 0,
      }),
      isAvailable: options.claimId == null && !isBlocked,
      isBlocked,
    };
  }

  const dupontId = '00000001-0000-0000-0000-000000000001';
  const martinId = '00000002-0000-0000-0000-000000000002';
  const expressId = '00000003-0000-0000-0000-000000000003';
  const batignollesId = '00000005-0000-0000-0000-000000000005';
  const republiqueId = '00000006-0000-0000-0000-000000000006';

  const laurentId = '10000003-0000-0000-0000-000000000003';
  const sophieId = '10000007-0000-0000-0000-000000000007';
  const philippeId = '10000008-0000-0000-0000-000000000008';
  const inesId = '10000009-0000-0000-0000-000000000009';

  const slots: TimeSlot[] = [];

  // Carrosserie Dupont — signed-in garage. Dense today schedule with
  // linked appointments so the Garage dashboard looks busy.
  slots.push(
    // Today — 2 linked + 1 lunch block + 2 open walk-ins
    slot({ garageId: dupontId, dayOffset: 0, startHour: 9, endHour: 10, endMinute: 30, claimId: laurentId }),
    slot({ garageId: dupontId, dayOffset: 0, startHour: 11, endHour: 12, claimId: sophieId }),
    slot({ garageId: dupontId, dayOffset: 0, startHour: 12, endHour: 13, isBlocked: true }),
    slot({ garageId: dupontId, dayOffset: 0, startHour: 15, endHour: 16, endMinute: 30 }),
    slot({ garageId: dupontId, dayOffset: 0, startHour: 17, endHour: 18 }),
    // Tomorrow — 1 linked + 2 open
    slot({ garageId: dupontId, dayOffset: 1, startHour: 9, endHour: 10, endMinute: 30, claimId: philippeId }),
    slot({ garageId: dupontId, dayOffset: 1, startHour: 11, endHour: 12 }),
    slot({ garageId: dupontId, dayOffset: 1, startHour: 14, endHour: 15, endMinute: 30 }),
    // +2 days — linked repair follow-up + 1 open
    slot({ garageId: dupontId, dayOffset: 2, startHour: 10, endHour: 11, endMinute: 30, claimId: inesId }),
    slot({ garageId: dupontId, dayOffset: 2, startHour: 14, endHour: 15 }),
    // +3 days — training block + 1 open in morning
    slot({ garageId: dupontId, dayOffset: 3, startHour: 9, endHour: 10, endMinute: 30 }),
    slot({ garageId: dupontId, dayOffset: 3, startHour: 14, endHour: 18, isBlocked: true }),
    // +4 to +6 days — open slots
    slot({ garageId: dupontId, dayOffset: 4, startHour: 9, endHour: 10, endMinute: 30 }),
    slot({ garageId: dupontId, dayOffset: 4, startHour: 14, endHour: 15 }),
    slot({ garageId: dupontId, dayOffset: 5, startHour: 9, endHour: 10, endMinute: 30 }),
    slot({ garageId: dupontId, dayOffset: 5, startHour: 15, endHour: 16, endMinute: 30 }),
    slot({ garageId: dupontId, dayOffset: 6, startHour: 10, endHour: 11, endMinute: 30 }),
  );

  // Garage Martin & Fils — open across the next 7 days for the driver flow.
  for (let dayOffset = 1; dayOffset <= 7; dayOffset += 1) {
    slots.push(
      slot({ garageId: martinId, dayOffset, startHour: 9, endHour: 10 }),
      slot({ garageId: martinId, dayOffset, startHour: 11, endHour: 12 }),
      slot({ garageId: martinId, dayOffset, startHour: 14, endHour: 15 }),
      slot({ garageId: martinId, dayOffset, startHour: 16, endHour: 17 }),
    );
  }

  // Auto Repair Express — sparser, has a Friday block.
  for (let dayOffset = 1; dayOffset <= 5; dayOffset += 1) {
    slots.push(
      slot({ garageId: expressId, dayOffset, startHour: 10, endHour: 11 }),
      slot({ garageId: expressId, dayOffset, startHour: 15, endHour: 16 }),
    );
  }
  slots.push(slot({ garageId: expressId, dayOffset: 3, startHour: 13, endHour: 18, isBlocked: true }));

  // Atelier des Batignolles — busy shop, slots every morning and afternoon.
  for (let dayOffset = 1; dayOffset <= 7; dayOffset += 1) {
    slots.push(
      slot({ garageId: batignollesId, dayOffset, startHour: 9, endHour: 10, endMinute: 30 }),
      slot({ garageId: batignollesId, dayOffset, startHour: 14, endHour: 15, endMinute: 30 }),
    );
  }

  // Carrosserie République — weekend-friendly detailing shop.
  for (let dayOffset = 2; dayOffset <= 7; dayOffset += 1) {
    slots.push(
      slot({ garageId: republiqueId, dayOffset, startHour: 11, endHour: 13 }),
      slot({ garageId: republiqueId, dayOffset, startHour: 15, endHour: 17 }),
    );
  }

  return slots;
}

// MARK: Helpers

export function garageForId(id?: string): Garage | undefined {
  if (id == null) return undefined;
  return garages.find((garage) => garage.id === id);
}

