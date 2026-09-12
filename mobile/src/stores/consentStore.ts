// The driver's privacy consent, hydrated from storage by the driver shell.
import { create } from 'zustand';

import {
  POLICY_VERSION,
  consentCoversFiles,
  loadConsent,
  saveConsent,
  type PrivacyConsent,
} from '@/lib/consent';

export interface ConsentState {
  /** undefined = not loaded yet; null = never given. */
  consent: PrivacyConsent | null | undefined;
  hydrate: () => Promise<void>;
  accept: (marketing: boolean) => Promise<void>;
  setMarketing: (marketing: boolean) => Promise<void>;
  withdraw: () => Promise<void>;
}

export const useConsentStore = create<ConsentState>()((set, get) => ({
  consent: undefined,
  hydrate: async () => {
    set({ consent: await loadConsent() });
  },
  accept: async (marketing) => {
    const consent: PrivacyConsent = {
      policyVersion: POLICY_VERSION,
      acceptedAt: new Date().toISOString(),
      marketing,
    };
    await saveConsent(consent);
    set({ consent });
  },
  setMarketing: async (marketing) => {
    const current = get().consent;
    if (current == null) return;
    const consent = { ...current, marketing };
    await saveConsent(consent);
    set({ consent });
  },
  withdraw: async () => {
    const current = get().consent;
    if (current == null) return;
    const consent: PrivacyConsent = {
      ...current,
      marketing: false,
      withdrawnAt: new Date().toISOString(),
    };
    await saveConsent(consent);
    set({ consent });
  },
}));

export function selectCanCreateFiles(state: ConsentState): boolean {
  return consentCoversFiles(state.consent);
}
