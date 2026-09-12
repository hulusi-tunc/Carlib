// Ported from Carlib/Models/*.swift. Dates are Date objects in memory (as in
// Swift); anything persisted as JSON (SecureStore user) must revive them on
// load. One deliberate change from iOS (migration plan §5): claim photos hold
// file URIs from the image picker, not in-memory image data.
import type {
  AccidentType,
  BookingStatus,
  ClaimStatus,
  DocumentType,
  RepairSpecialty,
  RepairStatus,
  UserRole,
} from './enums';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role?: UserRole;
  appleUserIdentifier?: string;
  createdAt: Date;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface PhotoAttachment {
  id: string;
  /** File URI from expo-image-picker (Swift stored Data; seed photos have none). */
  imageUri?: string;
  caption: string;
  timestamp: Date;
}

export interface VehicleInfo {
  licensePlate: string;
  brand: string;
  model: string;
  year?: number;
  color: string;
}

export interface Vehicle {
  id: string;
  info: VehicleInfo;
  nickname?: string;
  isDefault: boolean;
}

export interface Claim {
  id: string;
  status: ClaimStatus;
  accidentType?: AccidentType;
  description: string;
  photos: PhotoAttachment[];
  location?: Coordinate;
  /** One-line address of the incident — geocoded from `location` or typed by the driver. */
  address?: string;
  vehicleInfo?: VehicleInfo;
  assignedGarageId?: string;
  /** Denormalized on the claim, separate from the bookings array — matches iOS. */
  bookingStatus?: BookingStatus;
  repairStatus?: RepairStatus;
  driverName?: string;
  driverPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Garage {
  id: string;
  name: string;
  address: string;
  location: Coordinate;
  dialCode: string;
  phone: string;
  specialties: RepairSpecialty[];
  photos: PhotoAttachment[];
  isAvailable: boolean;
  coverageRadiusKm: number;
}

export interface Booking {
  id: string;
  claimId?: string;
  garageId: string;
  slotId: string;
  status: BookingStatus;
  createdAt: Date;
}

export interface TimeSlot {
  id: string;
  garageId: string;
  claimId?: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  isBlocked: boolean;
}

/** A file attached to a vehicle (CARLIB-USERDOCS-01). Replacing keeps the old one, dated. */
export interface VehicleDocument {
  id: string;
  vehicleId: string;
  type: DocumentType;
  name: string;
  uri: string;
  mimeType: string;
  size: number;
  addedAt: Date;
  /** The version this one replaced, when any. */
  previousId?: string;
  /** Set on the old version when a newer one replaced it — never erased. */
  replacedAt?: Date;
}

export type NotificationAudience = 'driver' | 'garage';
export type NotificationKind =
  | 'fileCreated'
  | 'bookingConfirmed'
  | 'bookingChanged'
  | 'bookingCancelled'
  | 'takenUp';

/** One entry of the in-app notification centre (CARLIB-NOTIFS-01). */
export interface AppNotification {
  id: string;
  audience: NotificationAudience;
  kind: NotificationKind;
  claimId: string;
  /** Copy parameters: the file reference always, the shop and the slot when relevant. */
  params: { reference: string; garage?: string; date?: string };
  createdAt: Date;
  read: boolean;
}

export interface CountryDialCode {
  /** ISO alpha-2 (e.g. "FR"). */
  id: string;
  dialCode: string;
  name: string;
  flag: string;
}

/** "AA-123-BB", "aa123bb" and "AA 123 BB" are the same plate. */
export function plateKey(plate: string): string {
  return plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function vehicleDisplayName(vehicle: Vehicle): string {
  return vehicle.nickname ?? `${vehicle.info.brand} ${vehicle.info.model}`;
}

/**
 * "SIN-2026-0417" — the file reference quoted to the driver on the confirmation
 * and on every booking. Derived from the claim, so it is the same everywhere it
 * is shown (Swift's confirmation drew a random number and never kept it).
 */
export function claimReference(claim: Pick<Claim, 'id' | 'createdAt'>): string {
  let hash = 0;
  for (const char of claim.id) hash = (hash * 31 + char.charCodeAt(0)) % 9999;
  return `SIN-${claim.createdAt.getFullYear()}-${String(hash + 1).padStart(4, '0')}`;
}

export function garageFormattedPhone(garage: Garage): string {
  return garage.phone ? `${garage.dialCode} ${garage.phone}` : '';
}
