import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  POLICY_VERSION,
  consentCoversFiles,
  loadConsent,
  saveConsent,
  type PrivacyConsent,
} from '@/lib/consent';
import { beforeEach, describe, expect, it } from '@jest/globals';

const accepted: PrivacyConsent = {
  policyVersion: POLICY_VERSION,
  acceptedAt: '2026-09-12T10:00:00.000Z',
  marketing: false,
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('consentCoversFiles', () => {
  it('requires the current version, not withdrawn', () => {
    expect(consentCoversFiles(accepted)).toBe(true);
    expect(consentCoversFiles(null)).toBe(false);
    expect(consentCoversFiles(undefined)).toBe(false);
    expect(consentCoversFiles({ ...accepted, withdrawnAt: '2026-09-13T00:00:00.000Z' })).toBe(false);
    expect(consentCoversFiles({ ...accepted, policyVersion: '0.9' })).toBe(false);
  });
});

describe('storage', () => {
  it('round-trips a record', async () => {
    await saveConsent({ ...accepted, marketing: true });
    expect(await loadConsent()).toEqual({ ...accepted, marketing: true, withdrawnAt: undefined });
  });

  it('is null when nothing or garbage is stored', async () => {
    expect(await loadConsent()).toBeNull();
    await AsyncStorage.setItem('privacy_consent', '{not json');
    expect(await loadConsent()).toBeNull();
    await AsyncStorage.setItem('privacy_consent', JSON.stringify({ marketing: true }));
    expect(await loadConsent()).toBeNull();
  });
});
