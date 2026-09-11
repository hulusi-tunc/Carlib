// Garage tab shell — mirrors (driver)/_layout: NativeTabs with Remixicon
// glyphs, Liquid Glass on iOS 26 / Material 3 on Android.
import { useRouter } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { CarlibIcon } from '@/components/icons';
import { RemixIcon } from '@/components/RemixIcon';
import { tabBarStyleProps } from '@/components/tabBarStyle';
import { useAppStore } from '@/stores/appStore';
import { useUiStore } from '@/stores/uiStore';
import { useTheme } from '@/theme';

const { Trigger } = NativeTabs;

export default function GarageTabsLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const pendingGarageTab = useAppStore((s) => s.pendingGarageTab);
  const setPendingGarageTab = useAppStore((s) => s.setPendingGarageTab);
  const tabBarHidden = useUiStore((s) => s.tabBarHidden);

  // Cross-flow tab intents (AppState.pendingGarageTab): navigate, then clear.
  useEffect(() => {
    if (!pendingGarageTab) return;
    router.navigate(`/(garage)/${pendingGarageTab}` as never);
    setPendingGarageTab(null);
  }, [pendingGarageTab, router, setPendingGarageTab]);

  return (
    <NativeTabs hidden={tabBarHidden} {...tabBarStyleProps(colors)}>
      <Trigger name="dashboard">
        <Trigger.Icon src={<Trigger.VectorIcon family={RemixIcon} name={CarlibIcon.dashboard} />} />
        <Trigger.Label>{t('garageTab.dashboard')}</Trigger.Label>
      </Trigger>
      <Trigger name="claims">
        <Trigger.Icon src={<Trigger.VectorIcon family={RemixIcon} name={CarlibIcon.claims} />} />
        <Trigger.Label>{t('garageTab.claims')}</Trigger.Label>
      </Trigger>
      <Trigger name="schedule">
        <Trigger.Icon src={<Trigger.VectorIcon family={RemixIcon} name={CarlibIcon.planning} />} />
        <Trigger.Label>{t('garageTab.planning')}</Trigger.Label>
      </Trigger>
      <Trigger name="profile">
        <Trigger.Icon src={<Trigger.VectorIcon family={RemixIcon} name={CarlibIcon.profile} />} />
        <Trigger.Label>{t('garageTab.profile')}</Trigger.Label>
      </Trigger>
    </NativeTabs>
  );
}
