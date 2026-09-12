// Whether a shop can take a booking (CARLIB-PROSEARCH-01): open in its
// profile AND at least one open slot inside the search horizon. A shop with
// slots only beyond the horizon, or none at all, is never shown as available.
import { addDays } from 'date-fns';

import type { Garage, TimeSlot } from '@/models/types';

/** Days ahead a search looks for an open slot — an input defaulted for the PM. */
export const SEARCH_HORIZON_DAYS = 14;

export function isGarageBookable(garage: Garage, timeSlots: TimeSlot[], now: Date): boolean {
  if (!garage.isAvailable) return false;
  const horizonEnd = addDays(now, SEARCH_HORIZON_DAYS);
  return timeSlots.some(
    (slot) =>
      slot.garageId === garage.id &&
      slot.isAvailable &&
      !slot.isBlocked &&
      slot.startTime > now &&
      slot.startTime <= horizonEnd,
  );
}
