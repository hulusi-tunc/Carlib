import { distanceKm, formatDistance, regionAround } from '@/lib/geo';
import { describe, expect, it } from '@jest/globals';

const PARIS = { latitude: 48.8566, longitude: 2.3522 };
const LYON = { latitude: 45.764, longitude: 4.8357 };

describe('distanceKm', () => {
  it('is zero for the same point', () => {
    expect(distanceKm(PARIS, PARIS)).toBe(0);
  });

  it('matches the great-circle Paris → Lyon distance', () => {
    expect(distanceKm(PARIS, LYON)).toBeCloseTo(392, -1); // ±5 km
  });

  it('is symmetric', () => {
    expect(distanceKm(PARIS, LYON)).toBeCloseTo(distanceKm(LYON, PARIS), 6);
  });
});

describe('formatDistance', () => {
  it('keeps tenths under 10 km and rounds beyond', () => {
    expect(formatDistance(2.34)).toBe('2.3 km');
    expect(formatDistance(9.99)).toBe('10.0 km');
    expect(formatDistance(48.2)).toBe('48 km');
  });
});

describe('regionAround', () => {
  it('spans the radius on both sides of the centre', () => {
    const region = regionAround(PARIS, 30);
    expect(region.latitude).toBe(PARIS.latitude);
    expect(region.latitudeDelta).toBeCloseTo(60 / 111, 3);
    // Longitude degrees shrink with latitude, so the delta grows.
    expect(region.longitudeDelta).toBeGreaterThan(region.latitudeDelta);
  });
});
