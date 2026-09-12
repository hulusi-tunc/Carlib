// Device position as a one-line address. Shared by the declaration's location
// step (CARLIB-CLAIMDECL-01) and the shop search (CARLIB-PROSEARCH-01).
import * as Location from 'expo-location';

import type { Coordinate } from '@/models/types';

export type CurrentAddress =
  | { status: 'granted'; coords: Coordinate; address: string | null }
  /** The driver refused the permission. */
  | { status: 'denied' }
  /** Permission granted but no fix (location services off, timeout, geocoder down). */
  | { status: 'unavailable' };

/** Foreground position plus a reverse-geocoded address when the geocoder answers. */
export async function getCurrentAddress(): Promise<CurrentAddress> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) return { status: 'denied' };
  try {
    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const coords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
    let address: string | null = null;
    try {
      const [place] = await Location.reverseGeocodeAsync(coords);
      address = place ? formatAddress(place) : null;
    } catch {
      address = null; // a position without an address still counts as located
    }
    return { status: 'granted', coords, address };
  } catch {
    return { status: 'unavailable' };
  }
}

/** "12 rue de la Roquette, 75011 Paris" from a geocoder result; empty parts are skipped. */
export function formatAddress(place: Location.LocationGeocodedAddress): string {
  const street = [place.streetNumber, place.street].filter(Boolean).join(' ');
  const city = [place.postalCode, place.city].filter(Boolean).join(' ');
  return [street, city].filter(Boolean).join(', ');
}
