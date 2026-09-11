// App-wide chrome state the two tab layouts observe.
import { useEffect } from 'react';
import { create } from 'zustand';

export interface UiState {
  /** Set while a full-screen modal is up — the native tab bar hides, as under SwiftUI's fullScreenCover. */
  tabBarHidden: boolean;
  setTabBarHidden: (hidden: boolean) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  tabBarHidden: false,
  setTabBarHidden: (hidden) => set({ tabBarHidden: hidden }),
}));

/** Hides the tab bar for as long as the calling screen is mounted. */
export function useHidesTabBar() {
  const setTabBarHidden = useUiStore((s) => s.setTabBarHidden);
  useEffect(() => {
    setTabBarHidden(true);
    return () => setTabBarHidden(false);
  }, [setTabBarHidden]);
}
