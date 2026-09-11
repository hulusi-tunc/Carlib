// Ported from Carlib/Services/ClaimStore.swift. Mutable in-memory store
// seeded from mock data; all mutations are synchronous and immutable.
import { isSameDay } from 'date-fns';
import { create } from 'zustand';

import type { ClaimStatus, RepairStatus } from '@/models/enums';
import type {
  Booking,
  Claim,
  Garage,
  PhotoAttachment,
  TimeSlot,
  Vehicle,
} from '@/models/types';
import {
  claims as seedClaims,
  garages as seedGarages,
  generateTimeSlots,
  vehicles as seedVehicles,
} from '@/services/mockData';

// Matches Swift's UUID() for on-the-fly PhotoAttachment defaults.
function randomId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const r = (Math.random() * 16) | 0;
    const v = char === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface ClaimStoreState {
  claims: Claim[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  vehicles: Vehicle[];
  garages: Garage[];
  addClaim: (claim: Claim) => void;
  acceptClaim: (id: string, garageId: string) => void;
  declineClaim: (id: string) => void;
  cancelClaim: (id: string) => void;
  updateClaimStatus: (id: string, status: ClaimStatus) => void;
  updateRepairStatus: (id: string, status: RepairStatus) => void;
  addVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (id: string) => void;
  setDefaultVehicle: (id: string) => void;
  addTimeSlot: (slot: TimeSlot) => void;
  removeTimeSlot: (id: string) => void;
  setSlotBlocked: (id: string, blocked: boolean) => void;
  updateSlotTimes: (id: string, start: Date, end: Date) => void;
  addBooking: (booking: Booking) => void;
  addGaragePhoto: (garageId: string, photo?: PhotoAttachment) => void;
  removeGaragePhoto: (garageId: string, photoId: string) => void;
  updateGarage: (garage: Garage) => void;
}

function updateClaim(claims: Claim[], id: string, mutate: (claim: Claim) => Claim): Claim[] {
  return claims.map((claim) => (claim.id === id ? mutate(claim) : claim));
}

export const useClaimStore = create<ClaimStoreState>()((set) => ({
  claims: [...seedClaims],
  timeSlots: generateTimeSlots(),
  bookings: [],
  vehicles: [...seedVehicles],
  garages: [...seedGarages],

  // Claim mutations

  addClaim: (claim) => set((state) => ({ claims: [claim, ...state.claims] })),

  // Accepting only tags the claim; the Booking is created later in the
  // booking flow (matches iOS — no Booking record here).
  acceptClaim: (id, garageId) =>
    set((state) => ({
      claims: updateClaim(state.claims, id, (claim) => ({
        ...claim,
        status: 'accepte',
        assignedGarageId: garageId,
        bookingStatus: 'en_attente',
        updatedAt: new Date(),
      })),
    })),

  // For MVP, just remove from available — in real app, hide from this garage only
  declineClaim: (id) =>
    set((state) => ({
      claims: updateClaim(state.claims, id, (claim) => ({ ...claim, updatedAt: new Date() })),
    })),

  cancelClaim: (id) =>
    set((state) => ({
      claims: updateClaim(state.claims, id, (claim) => ({
        ...claim,
        status: 'annule',
        updatedAt: new Date(),
      })),
    })),

  updateClaimStatus: (id, status) =>
    set((state) => ({
      claims: updateClaim(state.claims, id, (claim) => ({
        ...claim,
        status,
        updatedAt: new Date(),
      })),
    })),

  // Repair status drives claim status: 'pret' completes the claim, any other
  // repair state forces 'en_reparation' (matches iOS coupling).
  updateRepairStatus: (id, status) =>
    set((state) => ({
      claims: updateClaim(state.claims, id, (claim) => ({
        ...claim,
        repairStatus: status,
        status: status === 'pret' ? 'termine' : 'en_reparation',
        updatedAt: new Date(),
      })),
    })),

  // Vehicle mutations

  addVehicle: (vehicle) =>
    set((state) => ({
      vehicles: [
        ...state.vehicles,
        state.vehicles.length === 0 ? { ...vehicle, isDefault: true } : vehicle,
      ],
    })),

  removeVehicle: (id) =>
    set((state) => {
      const remaining = state.vehicles.filter((vehicle) => vehicle.id !== id);
      if (remaining.length > 0 && !remaining.some((vehicle) => vehicle.isDefault)) {
        return {
          vehicles: remaining.map((vehicle, index) =>
            index === 0 ? { ...vehicle, isDefault: true } : vehicle,
          ),
        };
      }
      return { vehicles: remaining };
    }),

  setDefaultVehicle: (id) =>
    set((state) => ({
      vehicles: state.vehicles.map((vehicle) => ({ ...vehicle, isDefault: vehicle.id === id })),
    })),

  // Time slot mutations

  addTimeSlot: (slot) => set((state) => ({ timeSlots: [...state.timeSlots, slot] })),

  removeTimeSlot: (id) =>
    set((state) => ({ timeSlots: state.timeSlots.filter((slot) => slot.id !== id) })),

  // Blocking also closes the slot; unblocking deliberately does NOT restore
  // isAvailable (matches iOS).
  setSlotBlocked: (id, blocked) =>
    set((state) => ({
      timeSlots: state.timeSlots.map((slot) =>
        slot.id === id
          ? { ...slot, isBlocked: blocked, isAvailable: blocked ? false : slot.isAvailable }
          : slot,
      ),
    })),

  updateSlotTimes: (id, start, end) =>
    set((state) => ({
      timeSlots: state.timeSlots.map((slot) =>
        slot.id === id ? { ...slot, startTime: start, endTime: end } : slot,
      ),
    })),

  // Booking mutations

  addBooking: (booking) =>
    set((state) => ({
      bookings: [...state.bookings, booking],
      timeSlots: state.timeSlots.map((slot) =>
        slot.id === booking.slotId ? { ...slot, isAvailable: false } : slot,
      ),
    })),

  // Garage mutations

  addGaragePhoto: (garageId, photo) =>
    set((state) => ({
      garages: state.garages.map((garage) =>
        garage.id === garageId
          ? {
              ...garage,
              photos: [
                ...garage.photos,
                photo ?? { id: randomId(), caption: '', timestamp: new Date() },
              ],
            }
          : garage,
      ),
    })),

  removeGaragePhoto: (garageId, photoId) =>
    set((state) => ({
      garages: state.garages.map((garage) =>
        garage.id === garageId
          ? { ...garage, photos: garage.photos.filter((photo) => photo.id !== photoId) }
          : garage,
      ),
    })),

  updateGarage: (garage) =>
    set((state) => ({
      garages: state.garages.map((existing) => (existing.id === garage.id ? garage : existing)),
    })),
}));

// Selectors — port of the Swift computed filters.

const ACTIVE_STATUSES: readonly ClaimStatus[] = [
  'soumis',
  'en_recherche',
  'accepte',
  'pris_en_charge',
  'en_reparation',
];
const PAST_STATUSES: readonly ClaimStatus[] = ['termine', 'annule', 'expire'];
const AVAILABLE_STATUSES: readonly ClaimStatus[] = ['soumis', 'en_recherche'];
const GARAGE_STATUSES: readonly ClaimStatus[] = [
  'accepte',
  'pris_en_charge',
  'en_reparation',
  'termine',
];

export function selectActiveClaims(state: ClaimStoreState): Claim[] {
  return state.claims.filter((claim) => ACTIVE_STATUSES.includes(claim.status));
}

export function selectPastClaims(state: ClaimStoreState): Claim[] {
  return state.claims.filter((claim) => PAST_STATUSES.includes(claim.status));
}

export function selectAvailableClaims(state: ClaimStoreState): Claim[] {
  return state.claims.filter((claim) => AVAILABLE_STATUSES.includes(claim.status));
}

export function selectGarageClaims(state: ClaimStoreState): Claim[] {
  return state.claims.filter(
    (claim) => GARAGE_STATUSES.includes(claim.status) && claim.assignedGarageId != null,
  );
}

export function selectDefaultVehicle(state: ClaimStoreState): Vehicle | undefined {
  return state.vehicles.find((vehicle) => vehicle.isDefault) ?? state.vehicles[0];
}

/** Curried selector: `useClaimStore(slotsForDate(date, garageId))`. */
export function slotsForDate(date: Date, garageId?: string) {
  return (state: ClaimStoreState): TimeSlot[] =>
    state.timeSlots.filter(
      (slot) => isSameDay(slot.date, date) && (garageId == null || slot.garageId === garageId),
    );
}

/** Curried selector: `useClaimStore(availableSlots(garageId))`. */
export function availableSlots(garageId: string) {
  return (state: ClaimStoreState): TimeSlot[] =>
    state.timeSlots.filter(
      (slot) => slot.garageId === garageId && slot.isAvailable && !slot.isBlocked,
    );
}
