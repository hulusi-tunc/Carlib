// RN counterpart of Carlib/DesignSystem/CarBrandLogo.swift.
// Metro only bundles statically analyzable require() calls, so the logo map is
// spelled out per brand instead of built from the normalized name.
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { RemixIcon } from '@/components/RemixIcon';
import { useTheme } from '@/theme';

const logos = {
  audi: require('../../assets/images/car-brands/audi.png'),
  bmw: require('../../assets/images/car-brands/bmw.png'),
  citroen: require('../../assets/images/car-brands/citroen.png'),
  dacia: require('../../assets/images/car-brands/dacia.png'),
  fiat: require('../../assets/images/car-brands/fiat.png'),
  ford: require('../../assets/images/car-brands/ford.png'),
  hyundai: require('../../assets/images/car-brands/hyundai.png'),
  kia: require('../../assets/images/car-brands/kia.png'),
  mercedes_benz: require('../../assets/images/car-brands/mercedes_benz.png'),
  nissan: require('../../assets/images/car-brands/nissan.png'),
  opel: require('../../assets/images/car-brands/opel.png'),
  peugeot: require('../../assets/images/car-brands/peugeot.png'),
  renault: require('../../assets/images/car-brands/renault.png'),
  seat: require('../../assets/images/car-brands/seat.png'),
  skoda: require('../../assets/images/car-brands/skoda.png'),
  tesla: require('../../assets/images/car-brands/tesla.png'),
  toyota: require('../../assets/images/car-brands/toyota.png'),
  volkswagen: require('../../assets/images/car-brands/volkswagen.png'),
} as const;

// Normalized brand name → logo key, mirroring the Swift assetName(for:) table.
const brandAliases: Record<string, keyof typeof logos> = {
  peugeot: 'peugeot',
  renault: 'renault',
  volkswagen: 'volkswagen',
  vw: 'volkswagen',
  citroen: 'citroen',
  citroën: 'citroen',
  bmw: 'bmw',
  mercedes: 'mercedes_benz',
  'mercedes-benz': 'mercedes_benz',
  'mercedes benz': 'mercedes_benz',
  toyota: 'toyota',
  ford: 'ford',
  fiat: 'fiat',
  opel: 'opel',
  audi: 'audi',
  dacia: 'dacia',
  tesla: 'tesla',
  hyundai: 'hyundai',
  kia: 'kia',
  nissan: 'nissan',
  seat: 'seat',
  skoda: 'skoda',
  škoda: 'skoda',
};

export interface CarBrandLogoProps {
  brand: string;
  size?: number;
}

export function CarBrandLogo({ brand, size = 32 }: CarBrandLogoProps) {
  const { colors } = useTheme();
  const key = brandAliases[brand.toLowerCase().trim()];

  if (key === undefined) {
    return (
      <View style={[styles.fallback, { width: size, height: size }]}>
        <RemixIcon name="carLine" size={size * 0.6} color={colors.carlibSecondary} />
      </View>
    );
  }

  return (
    <Image source={logos[key]} contentFit="contain" style={{ width: size, height: size }} />
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
