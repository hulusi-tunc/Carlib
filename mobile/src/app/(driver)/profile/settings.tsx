// Thin wrapper — content lives in components/settings so the garage profile
// stack can reuse it with its own hrefs.
import React from 'react';

import { SettingsScreen } from '@/components/settings/SettingsScreen';

export default function DriverSettingsRoute() {
  return (
    <SettingsScreen
      languageHref="/profile/language"
      changePasswordHref="/profile/change-password"
      notificationsHref="/profile/notifications"
    />
  );
}
