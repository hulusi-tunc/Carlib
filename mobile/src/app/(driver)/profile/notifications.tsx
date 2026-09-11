// Thin wrapper for the shared notification-settings sheet.
import { Stack } from 'expo-router';
import React from 'react';

import { NotificationSettingsSheet } from '@/components/settings/NotificationSettingsSheet';

export default function DriverNotificationsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [1],
        }}
      />
      <NotificationSettingsSheet />
    </>
  );
}
