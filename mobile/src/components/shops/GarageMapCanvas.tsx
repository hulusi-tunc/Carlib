// The Shops map surface, with an Android guard.
//
// Google Maps (Android) throws IllegalStateException and kills the process when
// no com.google.android.geo.API_KEY is present in the manifest, so rendering
// MapView unconditionally crashes the whole app on the Shops tab. Apple Maps
// (iOS) needs no key. When the key is absent we render a neutral backdrop
// instead — the garage list/carousel panel on top stays fully usable.
import Constants from 'expo-constants';
import React, { forwardRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { type Region } from 'react-native-maps';

import { RemixIcon } from '@/components/RemixIcon';
import type { Garage } from '@/models/types';
import { GarageMarker } from '@/components/shops/GaragePin';
import { spacing, text, useTheme } from '@/theme';

const androidMapsKey =
  Constants.expoConfig?.android?.config?.googleMaps?.apiKey ?? undefined;

/** False only on Android without a configured Google Maps key. */
export const mapsAvailable = Platform.OS !== 'android' || Boolean(androidMapsKey);

export interface GarageMapCanvasProps {
  region: Region;
  garages: Garage[];
  selectedId: string | null;
  onSelect: (garageId: string) => void;
}

export const GarageMapCanvas = forwardRef<MapView, GarageMapCanvasProps>(
  function GarageMapCanvas({ region, garages, selectedId, onSelect }, ref) {
    const { colors } = useTheme();

    if (!mapsAvailable) {
      return (
        <View style={[StyleSheet.absoluteFill, styles.fallback, { backgroundColor: colors.carlibAccent }]}>
          <RemixIcon name="mapPinLine" size={32} color={colors.carlibLabel} />
          <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
            Map unavailable
          </Text>
        </View>
      );
    }

    return (
      <MapView
        ref={ref}
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        showsCompass={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        pitchEnabled={false}
      >
        {garages.map((garage) => (
          <GarageMarker
            key={garage.id}
            garage={garage}
            selected={garage.id === selectedId}
            onPress={onSelect}
          />
        ))}
      </MapView>
    );
  },
);

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
});
