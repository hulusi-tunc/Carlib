// RN counterpart of Carlib/DesignSystem/DummyImage.swift.
// Swift hashed seeds with `hashValue`, which is randomly seeded per launch so
// seed→image was never actually stable; here FNV-1a 32-bit over the cleaned
// seed makes selection deterministic across launches (deliberate migration fix).
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { RemixIcon } from '@/components/RemixIcon';
import { useTheme } from '@/theme';

// Curated body-shop / mechanic photos from Unsplash. Rotated by seed so the
// same garage always renders the same frame.
const garagePhotoIds = [
  'photo-1618312980096-873bd19759a0',
  'photo-1591278169757-deac26e49555',
  'photo-1605822167835-d32696aef686',
  'photo-1619642737579-a7474bee1044',
  'photo-1618312980084-67efa94d67b6',
  'photo-1610569762946-397458bd058a',
  'photo-1610569762813-6bfcb54ad25c',
  'photo-1596986952526-3be237187071',
  'photo-1727893119356-1702fe921cf9',
  'photo-1615906655593-ad0386982a0f',
  'photo-1727893294198-e85137574f5b',
  'photo-1676018366904-c083ed678e60',
  'photo-1487754180451-c456f719a1fc',
] as const;

// Curated car-damage photos from Unsplash for claim attachments.
const damagePhotoIds = [
  'photo-1597328290883-50c5787b7c7e',
  'photo-1673187139211-1e7ec3dd60ec',
  'photo-1673187139612-6bf684a74815',
  'photo-1745845979138-be64a85272a5',
  'photo-1484136540910-d66bb475348d',
  'photo-1687867451910-28941a460f35',
  'photo-1591497108596-436c1a1a5c8e',
  'photo-1613042964418-89c800809319',
  'photo-1683446748468-eba61cda9473',
  'photo-1684413770726-4ce2b66c3ab0',
] as const;

function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function cleanSeed(seed: string): string {
  return seed.replace(/[- ]/g, '').toLowerCase();
}

function pickPhotoId(pool: readonly string[], seed: string): string {
  return pool[fnv1a32(cleanSeed(seed)) % pool.length] as string;
}

// `auto=format&fit=crop` lets Unsplash serve the best format + crop to the
// exact aspect ratio we requested.
function unsplashURL(photoId: string, width: number, height: number): string {
  return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&q=80&auto=format&fit=crop`;
}

function garageURL(seed: string, pixelWidth: number, pixelHeight: number): string {
  return unsplashURL(pickPhotoId(garagePhotoIds, seed), pixelWidth, pixelHeight);
}

// pravatar serves ~70 real photos indexed 1...70.
function personURL(seed: string, pixelWidth: number): string {
  const index = (fnv1a32(cleanSeed(seed)) % 70) + 1;
  return `https://i.pravatar.cc/${pixelWidth}?img=${index}`;
}

/** Damage photo for a claim, deterministic by photo id so the same attachment
 * renders the same frame across cards, detail and lightbox. */
export function claimPhotoURL(photoId: string, pixelWidth = 600, pixelHeight = 400): string {
  return unsplashURL(pickPhotoId(damagePhotoIds, photoId), pixelWidth, pixelHeight);
}

export type DummyImageKind = 'garage' | 'person';

export interface DummyImageProps {
  kind: DummyImageKind;
  seed: string;
  width: number;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

// Swift component defaults: pixelWidth 600 / pixelHeight 400 for both kinds
// (the URL resolution is independent of the displayed frame).
const PIXEL_WIDTH = 600;
const PIXEL_HEIGHT = 400;

export function DummyImage({ kind, seed, width, height, borderRadius = 0, style }: DummyImageProps) {
  const { colors } = useTheme();
  const uri =
    kind === 'garage' ? garageURL(seed, PIXEL_WIDTH, PIXEL_HEIGHT) : personURL(seed, PIXEL_WIDTH);

  return (
    <View
      style={[
        styles.container,
        { width, height, borderRadius, backgroundColor: colors.tileSecondary },
        style,
      ]}
    >
      <RemixIcon
        name={kind === 'garage' ? 'storeFill' : 'userFill'}
        size={22}
        color={colors.carlibLabel}
        style={styles.placeholderIcon}
      />
      <Image
        source={{ uri }}
        contentFit="cover"
        transition={{ duration: 250, timing: 'ease-out' }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  placeholderIcon: {
    opacity: 0.6,
  },
});
