// The Shops map surface, with an Android guard.
//
// Google Maps (Android) throws IllegalStateException and kills the process when
// no com.google.android.geo.API_KEY is present in the manifest, so rendering
// MapView unconditionally crashes the whole app on the Shops tab. Apple Maps
// (iOS) needs no key. When the key is absent we render a neutral backdrop
// instead — the garage list/carousel panel on top stays fully usable.
import Constants from 'expo-constants';
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';

import { RemixIcon } from '@/components/RemixIcon';
import type { Coordinate, Garage } from '@/models/types';
import { GarageMarker } from '@/components/shops/GaragePin';
import { spacing, text, useTheme } from '@/theme';

const androidMapsKey =
  Constants.expoConfig?.android?.config?.googleMaps?.apiKey ?? undefined;

/** False only on Android without a configured Google Maps key. */
export const mapsAvailable = Platform.OS !== 'android' || Boolean(androidMapsKey);

const ORIGIN_ANCHOR = { x: 0.5, y: 0.5 };

export interface GarageMapCanvasProps {
  region: Region;
  garages: Garage[];
  selectedId: string | null;
  onSelect: (garageId: string) => void;
  /** The system's own position dot — only once the driver has granted location. */
  showsUserLocation?: boolean;
  /** Search centre when it is the file's address rather than the device. */
  fileOrigin?: Coordinate | null;
}

export const GarageMapCanvas = forwardRef<MapView, GarageMapCanvasProps>(
  function GarageMapCanvas(
    { region, garages, selectedId, onSelect, showsUserLocation = false, fileOrigin = null },
    ref,
  ) {
    const { colors } = useTheme();
    const { t } = useTranslation();

    if (!mapsAvailable) {
      return (
        <View style={[StyleSheet.absoluteFill, styles.fallback, { backgroundColor: colors.carlibAccent }]}>
          <RemixIcon name="mapPinLine" size={32} color={colors.carlibLabel} />
          <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
            {t('garageSearch.mapUnavailable')}
          </Text>
        </View>
      );
    }

    return (
      <MapView
        ref={ref}
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        showsUserLocation={showsUserLocation}
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
        {fileOrigin != null && (
          <Marker coordinate={fileOrigin} anchor={ORIGIN_ANCHOR} tracksViewChanges={false}>
            <View
              style={[
                styles.originDot,
                { backgroundColor: colors.carlibDark, borderColor: colors.carlibScreenBg },
              ]}
            />
          </Marker>
        )}
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
  originDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
});
