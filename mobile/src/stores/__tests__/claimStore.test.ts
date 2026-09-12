import { addDays, addHours } from 'date-fns';

import type { Booking, Claim, TimeSlot } from '@/models/types';
import { claims as seedClaims, generateTimeSlots } from '@/services/mockData';
import {
  bookingForClaim,
  selectClaimToBook,
  useClaimStore,
} from '@/stores/claimStore';
import { useNotificationStore } from '@/stores/notificationStore';

const NOW = new Date('2026-09-12T10:00:00Z');
const MARTIN = '00000002-0000-0000-0000-000000000002';

function openSlot(): TimeSlot {
  const slot = useClaimStore
    .getState()
    .timeSlots.find((item) => item.garageId === MARTIN && item.isAvailable && !item.isBlocked);
  if (slot == null) throw new Error('mock data has no open slot at Martin & Fils');
  return slot;
}

function booking(claim: Claim, slot: TimeSlot): Booking {
  return {
    id: 'b1',
    claimId: claim.id,
    garageId: MARTIN,
    slotId: slot.id,
    status: 'confirme',
    createdAt: NOW,
  };
}

beforeEach(() => {
  useClaimStore.setState({
    claims: [...seedClaims],
    timeSlots: generateTimeSlots(NOW),
    bookings: [],
    documents: [],
  });
  useNotificationStore.setState({ notifications: [] });
});

describe('addBooking', () => {
  it('takes the slot for the file and confirms at once', () => {
    const claim = selectClaimToBook(useClaimStore.getState());
    if (claim == null) throw new Error('no bookable claim in mock data');
    const slot = openSlot();

    const result = useClaimStore.getState().addBooking(booking(claim, slot));
    expect(result.ok).toBe(true);

    const state = useClaimStore.getState();
    const taken = state.timeSlots.find((item) => item.id === slot.id);
    expect(taken).toMatchObject({ isAvailable: false, claimId: claim.id });
    expect(state.claims.find((item) => item.id === claim.id)).toMatchObject({
      assignedGarageId: MARTIN,
      bookingStatus: 'confirme',
    });
    expect(bookingForClaim(claim.id)(state)?.id).toBe('b1');
    // Both parties hear about it.
    const audiences = useNotificationStore.getState().notifications.map((n) => n.audience);
    expect(audiences.sort()).toEqual(['driver', 'garage']);
  });

  it('refuses a slot taken between display and validation', () => {
    const claim = selectClaimToBook(useClaimStore.getState());
    if (claim == null) throw new Error('no bookable claim in mock data');
    const slot = openSlot();
    useClaimStore.getState().addBooking({ ...booking(claim, slot), id: 'first', claimId: undefined });

    const result = useClaimStore.getState().addBooking(booking(claim, slot));
    expect(result).toEqual({ ok: false, reason: 'slot_taken' });
    expect(useClaimStore.getState().bookings).toHaveLength(1);
  });
});

describe('cancelBooking', () => {
  it('releases the slot when outside the notice period', () => {
    const claim = selectClaimToBook(useClaimStore.getState());
    if (claim == null) throw new Error('no bookable claim in mock data');
    const slot = openSlot();
    useClaimStore.getState().addBooking(booking(claim, slot));

    const result = useClaimStore.getState().cancelBooking('b1', addDays(slot.startTime, -2));
    expect(result.ok).toBe(true);
    const state = useClaimStore.getState();
    expect(state.timeSlots.find((item) => item.id === slot.id)).toMatchObject({
      isAvailable: true,
      claimId: undefined,
    });
    expect(state.bookings[0].status).toBe('annule_conducteur');
    expect(bookingForClaim(claim.id)(state)).toBeUndefined();
  });

  it('is refused inside the notice period', () => {
    const claim = selectClaimToBook(useClaimStore.getState());
    if (claim == null) throw new Error('no bookable claim in mock data');
    const slot = openSlot();
    useClaimStore.getState().addBooking(booking(claim, slot));

    const result = useClaimStore.getState().cancelBooking('b1', addHours(slot.startTime, -2));
    expect(result).toEqual({ ok: false, reason: 'notice_period' });
    expect(useClaimStore.getState().bookings[0].status).toBe('confirme');
  });
});

describe('rescheduleBooking', () => {
  it('moves the appointment and frees the old slot', () => {
    const claim = selectClaimToBook(useClaimStore.getState());
    if (claim == null) throw new Error('no bookable claim in mock data');
    const first = openSlot();
    useClaimStore.getState().addBooking(booking(claim, first));
    const second = openSlot(); // the next open one — the first is taken now
    expect(second.id).not.toBe(first.id);

    const result = useClaimStore
      .getState()
      .rescheduleBooking('b1', second.id, addDays(first.startTime, -2));
    expect(result.ok).toBe(true);
    const state = useClaimStore.getState();
    expect(state.timeSlots.find((item) => item.id === first.id)?.isAvailable).toBe(true);
    expect(state.timeSlots.find((item) => item.id === second.id)).toMatchObject({
      isAvailable: false,
      claimId: claim.id,
    });
    expect(state.bookings[0]).toMatchObject({ slotId: second.id, status: 'replanifie' });
  });
});

describe('documents', () => {
  it('keeps the replaced version, dated', () => {
    const store = useClaimStore.getState();
    const input = {
      vehicleId: 'v1',
      type: 'carte_grise' as const,
      name: 'cg.pdf',
      uri: 'file:///cg.pdf',
      mimeType: 'application/pdf',
      size: 1000,
    };
    const v1 = store.addDocument(input);
    const v2 = useClaimStore.getState().replaceDocument(v1.id, { ...input, name: 'cg-v2.pdf' });

    const documents = useClaimStore.getState().documents;
    expect(documents).toHaveLength(2);
    expect(documents.find((item) => item.id === v1.id)?.replacedAt).toBeInstanceOf(Date);
    expect(v2.previousId).toBe(v1.id);
    expect(v2.replacedAt).toBeUndefined();
  });
});
