// Shops-tab state shared across screens: the panel's expanded flag (the
// (driver) tab layout hides the native tab bar behind it) and the search
// origin + radius, which Home and the shop detail read to show distances.
import { create } from 'zustand';

import { SEARCH_RADIUS_KM, type SearchOrigin } from '@/lib/shopSearch';

export interface ShopsUiState {
  panelExpanded: boolean;
  setPanelExpanded: (expanded: boolean) => void;
  /** Null until a screen has resolved it — see resolveSearchOrigin. */
  origin: SearchOrigin | null;
  setOrigin: (origin: SearchOrigin) => void;
  radiusKm: number;
  setRadiusKm: (radiusKm: number) => void;
}

export const useShopsUiStore = create<ShopsUiState>()((set) => ({
  panelExpanded: false,
  setPanelExpanded: (expanded) => set({ panelExpanded: expanded }),
  origin: null,
  setOrigin: (origin) => set({ origin }),
  radiusKm: SEARCH_RADIUS_KM,
  setRadiusKm: (radiusKm) => set({ radiusKm }),
}));
