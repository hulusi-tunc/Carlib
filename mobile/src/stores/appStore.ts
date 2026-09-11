// Ported from Carlib/App/AppState.swift. Pure state only — persistence
// (SecureStore) lives in the auth service; screens orchestrate both.
import { create } from 'zustand';

import type { AuthStatus, UserRole } from '@/models/enums';
import type { User } from '@/models/types';

export type DriverTab = 'home' | 'shops' | 'profile';
export type GarageTab = 'dashboard' | 'claims' | 'schedule' | 'profile';

export interface AppStoreState {
  authStatus: AuthStatus;
  currentUser: User | null;
  pendingDriverTab: DriverTab | null;
  pendingGarageTab: GarageTab | null;
  completeAuth: (user: User) => void;
  resetToSignedOut: () => void;
  setCurrentUser: (user: User | null) => void;
  setPendingDriverTab: (tab: DriverTab | null) => void;
  setPendingGarageTab: (tab: GarageTab | null) => void;
}

export const useAppStore = create<AppStoreState>()((set) => ({
  authStatus: 'unknown',
  currentUser: null,
  pendingDriverTab: null,
  pendingGarageTab: null,
  completeAuth: (user) => set({ currentUser: user, authStatus: 'authenticated' }),
  resetToSignedOut: () => set({ currentUser: null, authStatus: 'unauthenticated' }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setPendingDriverTab: (tab) => set({ pendingDriverTab: tab }),
  setPendingGarageTab: (tab) => set({ pendingGarageTab: tab }),
}));

export function selectIsAuthenticated(state: AppStoreState): boolean {
  return state.authStatus === 'authenticated';
}

export function selectUserRole(state: AppStoreState): UserRole | undefined {
  return state.currentUser?.role;
}

export function selectNeedsRoleSelection(state: AppStoreState): boolean {
  return selectIsAuthenticated(state) && selectUserRole(state) == null;
}
