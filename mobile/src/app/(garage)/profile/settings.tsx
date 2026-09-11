// Thin wrapper — shared settings content with the garage stack's own hrefs.
import React from 'react';

import { SettingsScreen } from '@/components/settings/SettingsScreen';

export default function GarageSettingsRoute() {
  return (
    <SettingsScreen
      languageHref="/(garage)/profile/language"
      changePasswordHref="/(garage)/profile/change-password"
      notificationsHref="/(garage)/profile/notifications"
    />
  );
}
