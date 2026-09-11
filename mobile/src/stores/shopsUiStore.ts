// UI bridge between the shops map screen and the (driver) tab layout: the
// layout observes panelExpanded to hide the native tab bar while the bottom
// panel covers the full screen.
import { create } from 'zustand';

export interface ShopsUiState {
  panelExpanded: boolean;
  setPanelExpanded: (expanded: boolean) => void;
}

export const useShopsUiStore = create<ShopsUiState>()((set) => ({
  panelExpanded: false,
  setPanelExpanded: (expanded) => set({ panelExpanded: expanded }),
}));
