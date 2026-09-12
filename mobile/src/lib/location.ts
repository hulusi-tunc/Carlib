// Device position, shared by the declaration's location step
// (CARLIB-CLAIMDECL-01) and the shop search (CARLIB-PROSEARCH-01).
import * as Location from 'expo-location';

import type { Coordinate } from '@/models/types';

// A simulator with no location set, or a device indoors, can leave
// getCurrentPositionAsync pending; the UI must not wait longer than this.
const FIX_TIMEOUT_MS = 8000;

export type CurrentPosition =
  | { status: 'granted'; coords: Coordinate }
  /** The driver refused the permission — or it is still undecided and `prompt` was false. */
  | { status: 'denied' }
  /** Permission granted but no fix (location services off, timeout). */
  | { status: 'unavailable' };

export type CurrentAddress =
  | { status: 'granted'; coords: Coordinate; address: string | null }
  | { status: 'denied' }
  | { status: 'unavailable' };

export interface PositionOptions {
  /** Show the system dialog when the permission is undecided. False = only use an existing grant. */
  prompt?: boolean;
}

/** Foreground position. iOS and Android never re-prompt once the driver has refused. */
export async function getCurrentPosition({
  prompt = true,
}: PositionOptions = {}): Promise<CurrentPosition> {
  const permission = prompt
    ? await Location.requestForegroundPermissionsAsync()
    : await Location.getForegroundPermissionsAsync();
  if (!permission.granted) return { status: 'denied' };
  try {
    const position = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      new Promise<never>((_resolve, reject) =>
        setTimeout(() => reject(new Error('location fix timed out')), FIX_TIMEOUT_MS),
      ),
    ]);
    return {
      status: 'granted',
      coords: { latitude: position.coords.latitude, longitude: position.coords.longitude },
    };
  } catch {
    return { status: 'unavailable' };
  }
}

/** Position plus a reverse-geocoded address when the geocoder answers. */
export async function getCurrentAddress(): Promise<CurrentAddress> {
  const position = await getCurrentPosition();
  if (position.status !== 'granted') return position;
  let address: string | null = null;
  try {
    const [place] = await Location.reverseGeocodeAsync(position.coords);
    address = place ? formatAddress(place) : null;
  } catch {
    address = null; // a position without an address still counts as located
  }
  return { status: 'granted', coords: position.coords, address };
}

/** "12 rue de la Roquette, 75011 Paris" from a geocoder result; empty parts are skipped. */
export function formatAddress(place: Location.LocationGeocodedAddress): string {
  const street = [place.streetNumber, place.street].filter(Boolean).join(' ');
  const city = [place.postalCode, place.city].filter(Boolean).join(' ');
  return [street, city].filter(Boolean).join(', ');
}
