// Form sheet: the privacy policy and consent (CARLIB-USERAUTH-03).
import { Stack } from 'expo-router';
import React from 'react';

import { PrivacyConsentSheet } from '@/components/settings/PrivacyConsentSheet';

export default function PrivacyRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [1],
        }}
      />
      <PrivacyConsentSheet />
    </>
  );
}
