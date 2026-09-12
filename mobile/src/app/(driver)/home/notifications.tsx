import React from 'react';

import { NotificationCenter } from '@/components/notifications/NotificationCenter';

export default function DriverNotificationCenterRoute() {
  return <NotificationCenter audience="driver" claimHref={(id) => `/home/claim/${id}`} />;
}
