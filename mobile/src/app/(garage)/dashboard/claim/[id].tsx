// Thin wrapper — same detail content as the claims stack, mounted here so the
// dashboard's Review action pushes inside its own tab stack.
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { GarageClaimDetail } from '@/components/garage/GarageClaimDetail';

export default function GarageDashboardClaimDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <GarageClaimDetail claimId={id} />;
}
