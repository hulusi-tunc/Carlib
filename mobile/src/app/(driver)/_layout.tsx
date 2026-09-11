// Driver tab shell: NativeTabs = real UITabBarController → Liquid Glass tab bar
// on iOS 26, Material 3 bottom nav on Android. Icons are Remixicon glyphs via
// the VectorIcon helper.
import { useRouter } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { CarlibIcon } from '@/components/icons';
import { RemixIcon } from '@/components/RemixIcon';
import { tabBarStyleProps } from '@/components/tabBarStyle';
import { useAppStore } from '@/stores/appStore';
import { useShopsUiStore } from '@/stores/shopsUiStore';
import { useTheme } from '@/theme';

const { Trigger } = NativeTabs;

export default function DriverTabsLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const pendingDriverTab = useAppStore((s) => s.pendingDriverTab);
  const setPendingDriverTab = useAppStore((s) => s.setPendingDriverTab);
  // Shops drawer expanded → hide the bar (SwiftUI .toolbar(.hidden, for: .tabBar)).
  const shopsPanelExpanded = useShopsUiStore((s) => s.panelExpanded);

  // Cross-flow tab intents (AppState.pendingDriverTab): navigate, then clear.
  useEffect(() => {
    if (!pendingDriverTab) return;
    router.navigate(`/${pendingDriverTab}`);
    setPendingDriverTab(null);
  }, [pendingDriverTab, router, setPendingDriverTab]);

  return (
    <NativeTabs hidden={shopsPanelExpanded} {...tabBarStyleProps(colors)}>
      <Trigger name="home">
        <Trigger.Icon src={<Trigger.VectorIcon family={RemixIcon} name={CarlibIcon.home} />} />
        <Trigger.Label>{t('driverTab.home')}</Trigger.Label>
      </Trigger>
      <Trigger name="shops">
        <Trigger.Icon src={<Trigger.VectorIcon family={RemixIcon} name={CarlibIcon.shops} />} />
        <Trigger.Label>{t('driverTab.shops')}</Trigger.Label>
      </Trigger>
      <Trigger name="profile">
        <Trigger.Icon src={<Trigger.VectorIcon family={RemixIcon} name={CarlibIcon.profile} />} />
        <Trigger.Label>{t('driverTab.profile')}</Trigger.Label>
      </Trigger>
    </NativeTabs>
  );
}
