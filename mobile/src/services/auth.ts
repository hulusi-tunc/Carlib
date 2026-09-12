// Ported from Carlib/Services/AuthService.swift. Pure async functions — screens
// own loading state, app-store updates, and error translation. Failures reject
// with an Error whose message is an i18n key.
import * as AppleAuthentication from 'expo-apple-authentication';

import type { UserRole } from '@/models/enums';
import type { User } from '@/models/types';
import { authenticate, isSeedEmail } from '@/services/defaultUsers';
import { clearSession, loadSession, saveSession, saveUser } from '@/services/secureStore';

const SIGN_IN_ERROR = 'signIn.errorInvalid';
// AuthService.swift hardcodes these two messages in English with no L10n entry;
// the keys extrapolate the signIn.errorInvalid convention.
const SIGN_UP_INVALID_ERROR = 'signUp.errorInvalid';
const SIGN_UP_EXISTS_ERROR = 'signUp.errorExists';
const SIGN_IN_LOCKED_ERROR = 'signIn.errorLocked';

// CARLIB-USERAUTH-01: three consecutive failures lock the account for five
// minutes. Kept in memory until a backend owns it, so a restart clears it.
const LOCKOUT_FAILURES = 3;
const LOCKOUT_MINUTES = 5;
const failures = new Map<string, { count: number; lockedUntil: number }>();

function lockKey(email: string): string {
  return email.trim().toLowerCase();
}

/** Minutes left on the lock, or 0 when the account may try again. */
export function signInLockMinutes(email: string, now = Date.now()): number {
  const entry = failures.get(lockKey(email));
  if (entry == null || entry.lockedUntil <= now) return 0;
  return Math.ceil((entry.lockedUntil - now) / 60_000);
}

function recordFailure(email: string, now = Date.now()): void {
  const key = lockKey(email);
  const count = (failures.get(key)?.count ?? 0) + 1;
  failures.set(
    key,
    count >= LOCKOUT_FAILURES
      ? { count: 0, lockedUntil: now + LOCKOUT_MINUTES * 60_000 }
      : { count, lockedUntil: 0 },
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function uuid(): string {
  // Expo's winter runtime does not polyfill WebCrypto on Hermes; Math.random
  // is acceptable for mock session ids.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export async function checkExistingSession(): Promise<User | null> {
  const session = await loadSession();
  return session?.user ?? null;
}

/** Rejects with 'signIn.errorInvalid' on failure, 'signIn.errorLocked' while locked out. */
export async function signIn(email: string, password: string): Promise<User> {
  if (signInLockMinutes(email) > 0) throw new Error(SIGN_IN_LOCKED_ERROR);
  await delay(1000);

  if (!email || !password) throw new Error(SIGN_IN_ERROR);

  const seed = authenticate(email, password);
  if (seed) {
    failures.delete(lockKey(email));
    await saveSession(seed, `email_${uuid()}`);
    return seed;
  }

  // Returning sign-up user: sign-up never persists a password, so ANY password
  // is accepted when the stored email matches a non-seed account. INTENTIONAL
  // parity with the iOS implementation — PRODUCT-REVIEW FLAG: replace with real
  // credential checks once a backend exists.
  const stored = (await loadSession())?.user;
  if (stored && stored.email.toLowerCase() === email.toLowerCase() && !isSeedEmail(stored.email)) {
    failures.delete(lockKey(email));
    await saveSession(stored, `email_${uuid()}`);
    return stored;
  }

  recordFailure(email);
  throw new Error(SIGN_IN_ERROR);
}

/** Rejects with 'signUp.errorInvalid' or 'signUp.errorExists'. */
export async function signUp(fullName: string, email: string, password: string): Promise<User> {
  await delay(1000);

  if (!email || password.length < 8) throw new Error(SIGN_UP_INVALID_ERROR);
  if (isSeedEmail(email)) throw new Error(SIGN_UP_EXISTS_ERROR);

  // The password is intentionally never stored (matches iOS).
  const user: User = { id: uuid(), fullName, email, createdAt: new Date() };
  await saveSession(user, `email_${uuid()}`);
  return user;
}

/** Returns null when Apple sign-in is unavailable or the user cancels. */
export async function signInWithApple(): Promise<User | null> {
  if (!(await AppleAuthentication.isAvailableAsync())) return null;

  let credential: AppleAuthentication.AppleAuthenticationCredential;
  try {
    credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
  } catch (error) {
    if ((error as { code?: string }).code === 'ERR_REQUEST_CANCELED') return null;
    throw error;
  }

  const user: User = {
    id: uuid(),
    fullName: [credential.fullName?.givenName, credential.fullName?.familyName]
      .filter((part): part is string => part != null)
      .join(' '),
    email: credential.email ?? '',
    appleUserIdentifier: credential.user,
    createdAt: new Date(),
  };
  await saveSession(user, `apple_${credential.user}`);
  return user;
}

export async function updateRole(role: UserRole, user: User): Promise<User> {
  const updated: User = { ...user, role };
  await saveUser(updated);
  return updated;
}

export async function signOut(): Promise<void> {
  await clearSession();
}
