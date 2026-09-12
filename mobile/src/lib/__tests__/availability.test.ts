import { addDays, addHours } from 'date-fns';

import { SEARCH_HORIZON_DAYS, isGarageBookable } from '@/lib/availability';
import type { Garage, TimeSlot } from '@/models/types';

const NOW = new Date('2026-09-12T10:00:00Z');

const shop: Garage = {
  id: 'g1',
  name: 'Shop',
  address: '',
  location: { latitude: 0, longitude: 0 },
  dialCode: '+33',
  phone: '',
  specialties: [],
  photos: [],
  isAvailable: true,
  coverageRadiusKm: 10,
};

function slot(start: Date, overrides: Partial<TimeSlot> = {}): TimeSlot {
  return {
    id: start.toISOString(),
    garageId: 'g1',
    date: start,
    startTime: start,
    endTime: addHours(start, 1),
    isAvailable: true,
    isBlocked: false,
    ...overrides,
  };
}

describe('isGarageBookable', () => {
  it('needs an open slot inside the horizon', () => {
    expect(isGarageBookable(shop, [slot(addDays(NOW, 2))], NOW)).toBe(true);
    expect(isGarageBookable(shop, [], NOW)).toBe(false);
    expect(isGarageBookable(shop, [slot(addDays(NOW, SEARCH_HORIZON_DAYS + 1))], NOW)).toBe(false);
  });

  it('ignores past, taken and blocked slots', () => {
    expect(isGarageBookable(shop, [slot(addHours(NOW, -1))], NOW)).toBe(false);
    expect(isGarageBookable(shop, [slot(addDays(NOW, 1), { isAvailable: false })], NOW)).toBe(false);
    expect(isGarageBookable(shop, [slot(addDays(NOW, 1), { isBlocked: true })], NOW)).toBe(false);
  });

  it('is never available when the profile says closed', () => {
    expect(isGarageBookable({ ...shop, isAvailable: false }, [slot(addDays(NOW, 1))], NOW)).toBe(
      false,
    );
  });

  it('only counts the shop’s own slots', () => {
    expect(isGarageBookable(shop, [slot(addDays(NOW, 1), { garageId: 'other' })], NOW)).toBe(false);
  });
});
