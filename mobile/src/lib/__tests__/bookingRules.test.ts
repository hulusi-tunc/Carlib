import { addHours, addMinutes } from 'date-fns';

import { BOOKING_NOTICE_HOURS, canChangeBooking } from '@/lib/bookingRules';
import type { TimeSlot } from '@/models/types';
import { describe, expect, it } from '@jest/globals';

const NOW = new Date('2026-09-12T10:00:00Z');

function slotStarting(start: Date): TimeSlot {
  return {
    id: 's',
    garageId: 'g',
    date: start,
    startTime: start,
    endTime: addHours(start, 1),
    isAvailable: false,
    isBlocked: false,
  };
}

describe('canChangeBooking', () => {
  it('stays open until exactly the notice period before the slot', () => {
    expect(canChangeBooking(slotStarting(addHours(NOW, BOOKING_NOTICE_HOURS)), NOW)).toBe(true);
    expect(canChangeBooking(slotStarting(addHours(NOW, BOOKING_NOTICE_HOURS * 2)), NOW)).toBe(true);
  });

  it('closes inside the notice period', () => {
    expect(
      canChangeBooking(slotStarting(addMinutes(addHours(NOW, BOOKING_NOTICE_HOURS), -1)), NOW),
    ).toBe(false);
    expect(canChangeBooking(slotStarting(addHours(NOW, -1)), NOW)).toBe(false);
  });
});
