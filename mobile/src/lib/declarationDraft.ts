// CARLIB-CLAIMDECL-02: a declaration in progress is saved at every step
// transition and restored on the next opening; a draft older than 30 days is
// purged and the driver told. Stored locally — the AC keeps data on the device
// until a sync exists, so nothing here depends on a backend.
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AccidentType } from '@/models/enums';
import type { Coordinate, PhotoAttachment } from '@/models/types';

const STORAGE_KEY = 'declaration_draft';
const DRAFT_VERSION = 1;
export const DRAFT_MAX_AGE_DAYS = 30;

export interface DeclarationDraft {
  /** The step the driver was on when the draft was saved. */
  step: number;
  type: AccidentType | null;
  photos: PhotoAttachment[];
  coords: Coordinate | null;
  address: string;
  description: string;
  vehicleId: string | null;
}

interface StoredDraft extends Omit<DeclarationDraft, 'photos'> {
  version: number;
  savedAt: string;
  photos: (Omit<PhotoAttachment, 'timestamp'> & { timestamp: string })[];
}

export type LoadedDraft =
  | { status: 'none' }
  | { status: 'restored'; draft: DeclarationDraft; savedAt: Date }
  | { status: 'expired'; savedAt: Date };

export async function saveDraft(draft: DeclarationDraft, now = new Date()): Promise<void> {
  const stored: StoredDraft = {
    ...draft,
    version: DRAFT_VERSION,
    savedAt: now.toISOString(),
    photos: draft.photos.map((photo) => ({ ...photo, timestamp: photo.timestamp.toISOString() })),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

export async function clearDraft(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

/** Reads the draft; an unreadable, outdated or expired one is cleared on the way out. */
export async function loadDraft(now = new Date()): Promise<LoadedDraft> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw == null) return { status: 'none' };
  let stored: StoredDraft;
  try {
    stored = JSON.parse(raw) as StoredDraft;
  } catch {
    await clearDraft();
    return { status: 'none' };
  }
  if (stored.version !== DRAFT_VERSION) {
    await clearDraft();
    return { status: 'none' };
  }
  const savedAt = new Date(stored.savedAt);
  const ageDays = (now.getTime() - savedAt.getTime()) / 86_400_000;
  if (Number.isNaN(ageDays) || ageDays > DRAFT_MAX_AGE_DAYS) {
    await clearDraft();
    return { status: 'expired', savedAt };
  }
  return {
    status: 'restored',
    savedAt,
    draft: {
      step: stored.step,
      type: stored.type,
      photos: stored.photos.map((photo) => ({ ...photo, timestamp: new Date(photo.timestamp) })),
      coords: stored.coords,
      address: stored.address,
      description: stored.description,
      vehicleId: stored.vehicleId,
    },
  };
}
