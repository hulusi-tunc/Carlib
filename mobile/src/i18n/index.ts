import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { changeLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import fr from './fr.json';

export type AppLanguage = 'en' | 'fr';

// Mirrors Swift AppLanguage.displayName / .flag (labels are language-invariant).
export const APP_LANGUAGES: readonly { code: AppLanguage; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

// Same key the iOS app uses in UserDefaults.
const STORAGE_KEY = 'app_language';

export const resources = {
  en: { translation: en },
  fr: { translation: fr },
} as const;

// Call-site formatting conventions (Swift formatted these inside L10n):
// - driverHome.fileNumber — pass the number pre-padded (%02d):
//   t('driverHome.fileNumber', { n: String(n).padStart(2, '0') })
// - driverHome.distanceAway — pass km pre-formatted (%.1f):
//   t('driverHome.distanceAway', { km: km.toFixed(1) })
// Plural keys (pass count): driverHome.repairBody, driverHome.shortcutMyGarageCars,
// garagePlanning.bayBooked (label only — render the number separately).
// i18next's named `use` export collides with React 19's `use` hook under
// rules-of-hooks, so the method form stays.
// eslint-disable-next-line import/no-named-as-default-member
void i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // iOS app defaults to English regardless of device locale
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  initAsync: false, // resources are inline — init synchronously for first render
});

void AsyncStorage.getItem(STORAGE_KEY)
  .then((stored) => {
    if ((stored === 'en' || stored === 'fr') && stored !== i18n.language) {
      return changeLanguage(stored).then(() => undefined);
    }
    return undefined;
  })
  .catch(() => undefined);

export async function setAppLanguage(lang: AppLanguage): Promise<void> {
  await changeLanguage(lang);
  await AsyncStorage.setItem(STORAGE_KEY, lang);
}

export { i18n };
export default i18n;
