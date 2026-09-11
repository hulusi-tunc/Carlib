// Map pin from GarageSearchView.swift `pinLabel(for:)` — yellow tools circle,
// 34pt resting / 44pt selected, rendered inside a fixed 44pt container so the
// marker never re-anchors when the selection changes.
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';

import { RemixIcon } from '@/components/RemixIcon';
import type { Garage } from '@/models/types';
import { useTheme } from '@/theme';

const PIN_CONTAINER = 44;

export interface GarageMarkerProps {
  garage: Garage;
  selected: boolean;
  onPress: (garageId: string) => void;
}

export function GarageMarker({ garage, selected, onPress }: GarageMarkerProps) {
  const { colors } = useTheme();
  // Android markers are snapshots — re-enable view tracking only around the
  // selection change, then freeze again. iOS tracks continuously.
  const [tracks, setTracks] = useState(Platform.OS === 'ios');
  const prevSelected = useRef(selected);

  useEffect(() => {
    if (Platform.OS === 'ios') return undefined;
    if (prevSelected.current === selected) return undefined;
    prevSelected.current = selected;
    setTracks(true);
    const timer = setTimeout(() => setTracks(false), 350);
    return () => clearTimeout(timer);
  }, [selected]);

  const size = selected ? 44 : 34;

  return (
    <Marker
      coordinate={garage.location}
      anchor={{ x: 0.5, y: 1 }}
      centerOffset={{ x: 0, y: -PIN_CONTAINER / 2 }}
      tracksViewChanges={tracks}
      onPress={() => onPress(garage.id)}
    >
      <View style={styles.container}>
        <View
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              backgroundColor: selected ? colors.brandYellow : colors.carlibScreenBg,
              borderWidth: selected ? 0 : 2,
              borderColor: colors.brandYellow,
            },
          ]}
        >
          <RemixIcon
            name="toolsFill"
            size={selected ? 18 : 14}
            // Explicit black on the yellow fill — brand surfaces don't adapt.
            color={selected ? '#000000' : colors.brandYellow}
          />
        </View>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: {
    width: PIN_CONTAINER,
    height: PIN_CONTAINER,
    alignItems: 'center',
    justifyContent: 'center',
    // Swift: .shadow(color: .black.opacity(0.35), radius: 6, y: 2)
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  circle: {
    borderRadius: PIN_CONTAINER / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
