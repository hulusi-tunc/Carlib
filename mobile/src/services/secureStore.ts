// Ported from Carlib/Services/KeychainManager.swift — same two keys, and the
// same contract: a session is valid iff BOTH keys exist.
import * as SecureStore from 'expo-secure-store';

import type { User } from '@/models/types';

const TOKEN_KEY = 'session_token';
const USER_KEY = 'current_user';

// Matches iOS kSecAttrAccessibleAfterFirstUnlock.
const writeOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

interface StoredUser extends Omit<User, 'createdAt'> {
  createdAt: string;
}

function reviveUser(raw: string): User | null {
  try {
    const parsed = JSON.parse(raw) as StoredUser;
    return { ...parsed, createdAt: new Date(parsed.createdAt) };
  } catch {
    return null;
  }
}

export async function saveUser(user: User): Promise<void> {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user), writeOptions);
}

export async function saveSession(user: User, token: string): Promise<void> {
  await Promise.all([SecureStore.setItemAsync(TOKEN_KEY, token, writeOptions), saveUser(user)]);
}

export async function loadSession(): Promise<{ user: User; token: string } | null> {
  const [token, rawUser] = await Promise.all([
    SecureStore.getItemAsync(TOKEN_KEY),
    SecureStore.getItemAsync(USER_KEY),
  ]);
  if (!token || !rawUser) return null;
  const user = reviveUser(rawUser);
  if (!user) return null;
  return { user, token };
}

export async function clearSession(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
}
