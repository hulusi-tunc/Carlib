// Thin wrapper — the detail content is shared with the dashboard stack.
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { GarageClaimDetail } from '@/components/garage/GarageClaimDetail';

export default function GarageClaimsDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <GarageClaimDetail claimId={id} />;
}
