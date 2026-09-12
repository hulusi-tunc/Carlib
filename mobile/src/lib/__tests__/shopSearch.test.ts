import {
  SEARCH_RADIUS_KM,
  SEARCH_RADIUS_MAX_KM,
  distanceFromOrigin,
  nextRadius,
  rankGarages,
  type SearchOrigin,
} from '@/lib/shopSearch';
import type { Garage } from '@/models/types';

function garage(id: string, latitude: number, longitude: number): Garage {
  return {
    id,
    name: id,
    address: '',
    location: { latitude, longitude },
    dialCode: '+33',
    phone: '',
    specialties: [],
    photos: [],
    isAvailable: true,
    coverageRadiusKm: 10,
  };
}

// Around Place de la République, Paris.
const ORIGIN: SearchOrigin = { kind: 'device', coords: { latitude: 48.867, longitude: 2.363 } };
const NEAR = garage('near', 48.87, 2.37); // < 1 km
const MID = garage('mid', 48.95, 2.45); // ~11 km
const FAR = garage('far', 45.764, 4.8357); // Lyon, ~390 km

describe('rankGarages', () => {
  it('keeps shops inside the radius, nearest first', () => {
    const ranked = rankGarages([FAR, MID, NEAR], ORIGIN, SEARCH_RADIUS_KM);
    expect(ranked.map((entry) => entry.garage.id)).toEqual(['near', 'mid']);
    expect(ranked[0].distanceKm).toBeLessThan(ranked[1].distanceKm ?? Infinity);
  });

  it('widens with the radius', () => {
    expect(rankGarages([FAR], ORIGIN, SEARCH_RADIUS_MAX_KM)).toHaveLength(0);
    expect(rankGarages([FAR], ORIGIN, 500)).toHaveLength(1);
  });

  it('keeps store order and no distance without an origin', () => {
    const none: SearchOrigin = { kind: 'none', reason: 'denied' };
    for (const origin of [null, none]) {
      const ranked = rankGarages([FAR, NEAR], origin, SEARCH_RADIUS_KM);
      expect(ranked.map((entry) => entry.garage.id)).toEqual(['far', 'near']);
      expect(ranked.every((entry) => entry.distanceKm === undefined)).toBe(true);
    }
  });

  it('uses the file address like a device fix', () => {
    const file: SearchOrigin = { kind: 'file', coords: ORIGIN.coords, address: 'x' };
    expect(rankGarages([NEAR], file, SEARCH_RADIUS_KM)[0].distanceKm).toBeDefined();
  });
});

describe('nextRadius', () => {
  it('doubles up to the maximum, then stops', () => {
    expect(nextRadius(30)).toBe(60);
    expect(nextRadius(60)).toBe(120);
    expect(nextRadius(100)).toBe(120);
    expect(nextRadius(120)).toBeNull();
  });
});

describe('distanceFromOrigin', () => {
  it('is undefined without coordinates', () => {
    expect(distanceFromOrigin(null, NEAR.location)).toBeUndefined();
    expect(distanceFromOrigin({ kind: 'none', reason: 'unavailable' }, NEAR.location)).toBeUndefined();
    expect(distanceFromOrigin(ORIGIN, NEAR.location)).toBeLessThan(1);
  });
});
