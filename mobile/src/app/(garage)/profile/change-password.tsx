// Thin wrapper for the shared change-password sheet.
import { Stack } from 'expo-router';
import React from 'react';

import { ChangePasswordSheet } from '@/components/settings/ChangePasswordSheet';

export default function GarageChangePasswordRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [1],
        }}
      />
      <ChangePasswordSheet />
    </>
  );
}
