// Ported from Carlib/Services/ClaimStore.swift. Mutable in-memory store
// seeded from mock data; all mutations are synchronous and immutable.
import { isSameDay } from 'date-fns';
import { create } from 'zustand';

import { canChangeBooking } from '@/lib/bookingRules';
import type { BookingStatus, ClaimStatus, RepairStatus } from '@/models/enums';
import {
  plateKey,
  type Booking,
  type Claim,
  type Garage,
  type PhotoAttachment,
  type TimeSlot,
  type Vehicle,
} from '@/models/types';
import {
  claims as seedClaims,
  garages as seedGarages,
  generateTimeSlots,
  vehicles as seedVehicles,
} from '@/services/mockData';
import { notify } from '@/services/notifications';

// Matches Swift's UUID() for on-the-fly PhotoAttachment defaults.
function randomId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const r = (Math.random() * 16) | 0;
    const v = char === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Outcome of a booking mutation — the UI explains every refusal (CARLIB-BOOKING-01/02). */
export type BookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; reason: 'slot_taken' | 'notice_period' | 'not_found' };

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
  addBooking: (booking: Booking) => BookingResult;
  cancelBooking: (bookingId: string, now: Date) => BookingResult;
  rescheduleBooking: (bookingId: string, slotId: string, now: Date) => BookingResult;
  addGaragePhoto: (garageId: string, photo?: PhotoAttachment) => void;
  removeGaragePhoto: (garageId: string, photoId: string) => void;
  updateGarage: (garage: Garage) => void;
}

function updateClaim(claims: Claim[], id: string, mutate: (claim: Claim) => Claim): Claim[] {
  return claims.map((claim) => (claim.id === id ? mutate(claim) : claim));
}

// A booked slot leaves the shop's offer and carries the file it was booked for,
// which is how the garage planning shows the appointment (CARLIB-BOOKING-03).
function takeSlot(slots: TimeSlot[], slotId: string, claimId: string | undefined): TimeSlot[] {
  return slots.map((slot) =>
    slot.id === slotId ? { ...slot, isAvailable: false, claimId } : slot,
  );
}

function releaseSlot(slots: TimeSlot[], slotId: string): TimeSlot[] {
  return slots.map((slot) =>
    slot.id === slotId ? { ...slot, isAvailable: true, claimId: undefined } : slot,
  );
}

function isOpen(slot: TimeSlot | undefined): slot is TimeSlot {
  return slot != null && slot.isAvailable && !slot.isBlocked;
}

// BOOKING-02: both parties hear about every booking, change and cancellation.
function notifyBooking(
  state: Pick<ClaimStoreState, 'claims' | 'garages' | 'timeSlots'>,
  booking: Booking,
  kind: 'bookingConfirmed' | 'bookingChanged' | 'bookingCancelled',
): void {
  const claim = state.claims.find((item) => item.id === booking.claimId);
  if (claim == null) return;
  const garage = state.garages.find((item) => item.id === booking.garageId);
  const slot = state.timeSlots.find((item) => item.id === booking.slotId);
  notify('driver', kind, claim, { garage, slot });
  notify('garage', kind, claim, { garage, slot });
}

function withBookingStatus(claims: Claim[], booking: Booking, status: BookingStatus): Claim[] {
  if (booking.claimId == null) return claims;
  return updateClaim(claims, booking.claimId, (claim) => ({
    ...claim,
    assignedGarageId: booking.garageId,
    bookingStatus: status,
    updatedAt: new Date(),
  }));
}

export const useClaimStore = create<ClaimStoreState>()((set, get) => ({
  claims: [...seedClaims],
  timeSlots: generateTimeSlots(),
  bookings: [],
  vehicles: [...seedVehicles],
  garages: [...seedGarages],

  // Claim mutations

  addClaim: (claim) => {
    set((state) => ({ claims: [claim, ...state.claims] }));
    notify('driver', 'fileCreated', claim);
    notify('garage', 'fileCreated', claim);
  },

  // Accepting only tags the claim; the Booking is created later in the
  // booking flow (matches iOS — no Booking record here).
  acceptClaim: (id, garageId) => {
    set((state) => ({
      claims: updateClaim(state.claims, id, (claim) => ({
        ...claim,
        status: 'accepte',
        assignedGarageId: garageId,
        bookingStatus: 'en_attente',
        updatedAt: new Date(),
      })),
    }));
    const { claims, garages } = get();
    const claim = claims.find((item) => item.id === id);
    const garage = garages.find((item) => item.id === garageId);
    if (claim) {
      notify('driver', 'takenUp', claim, { garage });
      notify('garage', 'takenUp', claim, { garage });
    }
  },

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

  // Booking mutations — CARLIB-BOOKING-01/02/03. A booking is refused when
  // the slot went between display and validation; cancel and reschedule stay
  // open until the notice period and release the slot immediately.

  addBooking: (booking) => {
    if (!isOpen(get().timeSlots.find((slot) => slot.id === booking.slotId))) {
      return { ok: false, reason: 'slot_taken' };
    }
    set((state) => ({
      bookings: [...state.bookings, booking],
      timeSlots: takeSlot(state.timeSlots, booking.slotId, booking.claimId),
      claims: withBookingStatus(state.claims, booking, booking.status),
    }));
    notifyBooking(get(), booking, 'bookingConfirmed');
    return { ok: true, booking };
  },

  cancelBooking: (bookingId, now) => {
    const { bookings, timeSlots } = get();
    const booking = bookings.find((item) => item.id === bookingId);
    const slot = timeSlots.find((item) => item.id === booking?.slotId);
    if (booking == null || slot == null) return { ok: false, reason: 'not_found' };
    if (!canChangeBooking(slot, now)) return { ok: false, reason: 'notice_period' };
    const cancelled: Booking = { ...booking, status: 'annule_conducteur' };
    set((state) => ({
      bookings: state.bookings.map((item) => (item.id === bookingId ? cancelled : item)),
      timeSlots: releaseSlot(state.timeSlots, booking.slotId),
      claims: withBookingStatus(state.claims, cancelled, 'annule_conducteur'),
    }));
    notifyBooking(get(), cancelled, 'bookingCancelled');
    return { ok: true, booking: cancelled };
  },

  rescheduleBooking: (bookingId, slotId, now) => {
    const { bookings, timeSlots } = get();
    const booking = bookings.find((item) => item.id === bookingId);
    const current = timeSlots.find((item) => item.id === booking?.slotId);
    if (booking == null || current == null) return { ok: false, reason: 'not_found' };
    if (!canChangeBooking(current, now)) return { ok: false, reason: 'notice_period' };
    if (!isOpen(timeSlots.find((item) => item.id === slotId))) {
      return { ok: false, reason: 'slot_taken' };
    }
    const moved: Booking = { ...booking, slotId, status: 'replanifie' };
    set((state) => ({
      bookings: state.bookings.map((item) => (item.id === bookingId ? moved : item)),
      timeSlots: takeSlot(releaseSlot(state.timeSlots, booking.slotId), slotId, booking.claimId),
      claims: withBookingStatus(state.claims, moved, 'replanifie'),
    }));
    notifyBooking(get(), moved, 'bookingChanged');
    return { ok: true, booking: moved };
  },

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

const CANCELLED_BOOKING: readonly BookingStatus[] = ['annule_conducteur', 'annule_garage'];
const BOOKABLE_CLAIM: readonly ClaimStatus[] = ['soumis', 'en_recherche', 'accepte'];

export function isBookingLive(booking: Booking): boolean {
  return !CANCELLED_BOOKING.includes(booking.status);
}

/** Curried selector: the live (not cancelled) booking on a file, if any. */
export function bookingForClaim(claimId: string) {
  return (state: ClaimStoreState): Booking | undefined =>
    state.bookings.find((booking) => booking.claimId === claimId && isBookingLive(booking));
}

/** Curried selector: the files declared for a plate — the vehicle's stable identity. Pair with useShallow. */
export function claimsForVehicle(licensePlate: string) {
  const key = plateKey(licensePlate);
  return (state: ClaimStoreState): Claim[] =>
    key === ''
      ? []
      : state.claims.filter(
          (claim) => claim.vehicleInfo != null && plateKey(claim.vehicleInfo.licensePlate) === key,
        );
}

function hasAppointment(claim: Claim, bookings: Booking[]): boolean {
  if (bookingForClaim(claim.id)({ bookings } as ClaimStoreState) != null) return true;
  // Seed claims carry a denormalised bookingStatus with no Booking record (iOS parity).
  return claim.bookingStatus != null && !CANCELLED_BOOKING.includes(claim.bookingStatus);
}

/** The file a new booking attaches to: the latest open claim without an appointment. */
export function selectClaimToBook(state: ClaimStoreState): Claim | undefined {
  return state.claims
    .filter((claim) => BOOKABLE_CLAIM.includes(claim.status) && !hasAppointment(claim, state.bookings))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
}

/** Curried selector: `useClaimStore(availableSlots(garageId))`. */
export function availableSlots(garageId: string) {
  return (state: ClaimStoreState): TimeSlot[] =>
    state.timeSlots.filter(
      (slot) => slot.garageId === garageId && slot.isAvailable && !slot.isBlocked,
    );
}
