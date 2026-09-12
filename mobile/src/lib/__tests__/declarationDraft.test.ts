import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDays } from 'date-fns';

import {
  DRAFT_MAX_AGE_DAYS,
  clearDraft,
  loadDraft,
  saveDraft,
  type DeclarationDraft,
} from '@/lib/declarationDraft';
import { beforeEach, describe, expect, it } from '@jest/globals';

const NOW = new Date('2026-09-12T10:00:00Z');
const draft: DeclarationDraft = {
  step: 3,
  type: null,
  photos: [],
  coords: { latitude: 48.86, longitude: 2.35 },
  address: '12 rue de la Roquette, 75011 Paris',
  description: 'Percuté à un feu rouge',
  vehicleId: null,
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('declaration draft', () => {
  it('restores what was saved, with the save time', async () => {
    await saveDraft(draft, NOW);
    expect(await loadDraft(addDays(NOW, 1))).toEqual({ status: 'restored', draft, savedAt: NOW });
  });

  it('expires after the maximum age and clears itself', async () => {
    await saveDraft(draft, NOW);
    expect(await loadDraft(addDays(NOW, DRAFT_MAX_AGE_DAYS + 1))).toEqual({
      status: 'expired',
      savedAt: NOW,
    });
    expect(await loadDraft(addDays(NOW, DRAFT_MAX_AGE_DAYS + 1))).toEqual({ status: 'none' });
  });

  it('is gone after clearDraft', async () => {
    await saveDraft(draft, NOW);
    await clearDraft();
    expect(await loadDraft(NOW)).toEqual({ status: 'none' });
  });

  it('drops a record it cannot read', async () => {
    await AsyncStorage.setItem('declaration_draft', '{broken');
    expect(await loadDraft(NOW)).toEqual({ status: 'none' });
  });
});
