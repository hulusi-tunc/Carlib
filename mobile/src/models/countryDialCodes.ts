// Ported from Carlib/Models/CountryDialCode.swift — Swift order, FR first.
import type { CountryDialCode } from '@/models/types';

export const defaultCountryDialCode: CountryDialCode = {
  id: 'FR',
  dialCode: '+33',
  name: 'France',
  flag: '🇫🇷',
};

export const countryDialCodes: CountryDialCode[] = [
  defaultCountryDialCode,
  { id: 'BE', dialCode: '+32', name: 'Belgium', flag: '🇧🇪' },
  { id: 'CH', dialCode: '+41', name: 'Switzerland', flag: '🇨🇭' },
  { id: 'LU', dialCode: '+352', name: 'Luxembourg', flag: '🇱🇺' },
  { id: 'MC', dialCode: '+377', name: 'Monaco', flag: '🇲🇨' },
  { id: 'DE', dialCode: '+49', name: 'Germany', flag: '🇩🇪' },
  { id: 'IT', dialCode: '+39', name: 'Italy', flag: '🇮🇹' },
  { id: 'ES', dialCode: '+34', name: 'Spain', flag: '🇪🇸' },
  { id: 'PT', dialCode: '+351', name: 'Portugal', flag: '🇵🇹' },
  { id: 'NL', dialCode: '+31', name: 'Netherlands', flag: '🇳🇱' },
  { id: 'GB', dialCode: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { id: 'IE', dialCode: '+353', name: 'Ireland', flag: '🇮🇪' },
  { id: 'US', dialCode: '+1', name: 'United States', flag: '🇺🇸' },
  { id: 'TR', dialCode: '+90', name: 'Türkiye', flag: '🇹🇷' },
];

export function fromDialCode(code: string): CountryDialCode {
  return countryDialCodes.find((country) => country.dialCode === code) ?? defaultCountryDialCode;
}
