// Ported from Carlib/Services/DefaultUsers.swift.
// Placeholder credential store. Plaintext passwords are acceptable here because
// this is a mock used for local testing — replace with a real backend before ship.
import type { User } from '@/models/types';

export interface Credential {
  email: string;
  password: string;
  user: User;
}

export const defaultUsers: Credential[] = [
  {
    email: 'driver@carlib.fr',
    password: 'password',
    user: {
      id: '11111111-1111-1111-1111-111111111111',
      fullName: 'Sophie Martin',
      email: 'driver@carlib.fr',
      phone: '+33 6 12 34 56 78',
      role: 'conducteur',
      createdAt: new Date(),
    },
  },
  {
    email: 'thomas@carlib.fr',
    password: 'password',
    user: {
      id: '22222222-2222-2222-2222-222222222222',
      fullName: 'Thomas Dubois',
      email: 'thomas@carlib.fr',
      phone: '+33 6 23 45 67 89',
      role: 'conducteur',
      createdAt: new Date(),
    },
  },
  {
    email: 'garage@carlib.fr',
    password: 'password',
    user: {
      id: '33333333-3333-3333-3333-333333333333',
      fullName: 'Atelier Dubois',
      email: 'garage@carlib.fr',
      phone: '+33 1 42 00 12 34',
      role: 'carrossier',
      createdAt: new Date(),
    },
  },
  {
    email: 'mediterranee@carlib.fr',
    password: 'password',
    user: {
      id: '44444444-4444-4444-4444-444444444444',
      fullName: 'Garage Méditerranée',
      email: 'mediterranee@carlib.fr',
      phone: '+33 4 91 00 56 78',
      role: 'carrossier',
      createdAt: new Date(),
    },
  },
];

export function authenticate(email: string, password: string): User | null {
  const normalized = email.trim().toLowerCase();
  const match = defaultUsers.find(
    (credential) => credential.email.toLowerCase() === normalized && credential.password === password,
  );
  return match?.user ?? null;
}

export function isSeedEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return defaultUsers.some((credential) => credential.email.toLowerCase() === normalized);
}
