// Thin wrapper for the shared language sheet (medium detent, like the iOS sheet).
import { Stack } from 'expo-router';
import React from 'react';

import { LanguageSheet } from '@/components/settings/LanguageSheet';

export default function DriverLanguageRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.5],
        }}
      />
      <LanguageSheet />
    </>
  );
}
