// Where the shop search is centred and how far it looks (CARLIB-PROSEARCH-01).
//
// The origin follows the story's order: the device position, then the address
// recorded on the driver's latest file, then nothing (distances are hidden
// rather than faked). The radius starts at SEARCH_RADIUS_KM and widens on
// request up to SEARCH_RADIUS_MAX_KM; past that Carlib support takes the file
// (Epic 16 — the automatic 24 h widening and its countdown are backend work).
import { distanceKm } from '@/lib/geo';
import { getCurrentPosition } from '@/lib/location';
import type { Claim, Coordinate, Garage } from '@/models/types';

/** Default radius — an input we defaulted for the PM (Phase 2 decisions page). */
export const SEARCH_RADIUS_KM = 30;
export const SEARCH_RADIUS_MAX_KM = 120;

export type SearchOrigin =
  | { kind: 'device'; coords: Coordinate }
  /** Geolocation unavailable — centred on the address of the driver's latest file. */
  | { kind: 'file'; coords: Coordinate; address?: string }
  | { kind: 'none'; reason: 'denied' | 'unavailable' };

export interface RankedGarage {
  garage: Garage;
  /** Undefined when no origin is known. */
  distanceKm?: number;
}

export async function resolveSearchOrigin(
  claims: Claim[],
  options: { prompt: boolean },
): Promise<SearchOrigin> {
  const position = await getCurrentPosition({ prompt: options.prompt });
  if (position.status === 'granted') return { kind: 'device', coords: position.coords };
  const file = latestLocatedClaim(claims);
  if (file?.location != null) return { kind: 'file', coords: file.location, address: file.address };
  return { kind: 'none', reason: position.status };
}

function latestLocatedClaim(claims: Claim[]): Claim | undefined {
  return claims
    .filter((claim) => claim.location != null)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
}

export function originCoords(origin: SearchOrigin | null): Coordinate | null {
  return origin != null && origin.kind !== 'none' ? origin.coords : null;
}

export function distanceFromOrigin(
  origin: SearchOrigin | null,
  point: Coordinate,
): number | undefined {
  const coords = originCoords(origin);
  return coords == null ? undefined : distanceKm(coords, point);
}

/**
 * Shops within `radiusKm` of the origin, nearest first. Without an origin every
 * shop is kept, in store order, with no distance.
 */
export function rankGarages(
  garages: Garage[],
  origin: SearchOrigin | null,
  radiusKm: number,
): RankedGarage[] {
  const coords = originCoords(origin);
  if (coords == null) return garages.map((garage) => ({ garage }));
  return garages
    .map((garage) => ({ garage, distanceKm: distanceKm(coords, garage.location) }))
    .filter((entry) => entry.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/** The next widening step, or null once the search already spans the maximum. */
export function nextRadius(radiusKm: number): number | null {
  return radiusKm >= SEARCH_RADIUS_MAX_KM ? null : Math.min(radiusKm * 2, SEARCH_RADIUS_MAX_KM);
}
