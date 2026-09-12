// Driver-side booking rules (CARLIB-BOOKING-02). The notice period is a
// back-office parameter in the target system; 24 h is the default we chose
// for the PM until it is configurable.
import type { TimeSlot } from '@/models/types';

export const BOOKING_NOTICE_HOURS = 24;

/** Reschedule and cancel stay open until the notice period before the slot starts. */
export function canChangeBooking(slot: TimeSlot, now: Date): boolean {
  return slot.startTime.getTime() - now.getTime() >= BOOKING_NOTICE_HOURS * 60 * 60 * 1000;
}
