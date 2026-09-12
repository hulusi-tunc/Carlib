// Great-circle helpers for the shop search (CARLIB-PROSEARCH-01).
import type { Region } from 'react-native-maps';

import type { Coordinate } from '@/models/types';

const EARTH_RADIUS_KM = 6371;
const KM_PER_DEGREE_LATITUDE = 111;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Haversine distance in km — within 0.3% at city scale, which is all the UI shows. */
export function distanceKm(a: Coordinate, b: Coordinate): number {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** "2.3 km" under 10 km, "48 km" beyond — tenths stop meaning anything at that range. */
export function formatDistance(km: number): string {
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

/** A map region showing `radiusKm` around `center` in every direction. */
export function regionAround(center: Coordinate, radiusKm: number): Region {
  const latitudeDelta = (radiusKm * 2) / KM_PER_DEGREE_LATITUDE;
  const longitudeDelta = latitudeDelta / Math.cos(toRadians(center.latitude));
  return { ...center, latitudeDelta, longitudeDelta };
}
