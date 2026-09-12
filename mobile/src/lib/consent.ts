// Privacy consent (CARLIB-USERAUTH-03): recorded with a timestamp and the
// version of the policy accepted before the first file can be submitted.
// Withdrawing puts the account in read-only — no new file until the policy
// is accepted again. Marketing consent is separate and off by default.
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Placeholder v1 until legal delivers the text — an input we defaulted for the PM. */
export const POLICY_VERSION = '1.0';
const STORAGE_KEY = 'privacy_consent';

export interface PrivacyConsent {
  policyVersion: string;
  /** ISO timestamp. */
  acceptedAt: string;
  marketing: boolean;
  withdrawnAt?: string;
}

export async function loadConsent(): Promise<PrivacyConsent | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw == null) return null;
    const parsed = JSON.parse(raw) as Partial<PrivacyConsent>;
    return typeof parsed.policyVersion === 'string' && typeof parsed.acceptedAt === 'string'
      ? {
          policyVersion: parsed.policyVersion,
          acceptedAt: parsed.acceptedAt,
          marketing: parsed.marketing === true,
          withdrawnAt: typeof parsed.withdrawnAt === 'string' ? parsed.withdrawnAt : undefined,
        }
      : null;
  } catch {
    return null;
  }
}

export async function saveConsent(consent: PrivacyConsent): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
}

/** True when the current policy version is accepted and not withdrawn. */
export function consentCoversFiles(consent: PrivacyConsent | null | undefined): boolean {
  return (
    consent != null && consent.withdrawnAt == null && consent.policyVersion === POLICY_VERSION
  );
}
