import React from 'react';

import { NotificationCenter } from '@/components/notifications/NotificationCenter';

export default function GarageNotificationCenterRoute() {
  return <NotificationCenter audience="garage" claimHref={(id) => `/dashboard/claim/${id}`} />;
}
