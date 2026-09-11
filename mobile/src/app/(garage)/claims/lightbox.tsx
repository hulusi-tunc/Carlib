// Port of Carlib/Views/Shared/PhotoLightboxView.swift — fullscreen swipeable
// photo viewer for a claim's attachments. Always black (Swift hardcodes it), so
// the subtree is forced dark; pinch-zoom is deliberately left out to keep the
// gesture surface simple, matching iOS v1. Swipe-down to dismiss comes from the
// modal presentation, exactly like .fullScreenCover.
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PagerView, { type PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { claimPhotoURL } from '@/components/DummyImage';
import { Glass } from '@/components/Glass';
import { PressableScale } from '@/components/PressableScale';
import { RemixIcon } from '@/components/RemixIcon';
import { useClaimStore } from '@/stores/claimStore';
import { carlibFont, radius, spacing, ThemeScope } from '@/theme';

function Lightbox() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { claimId, index } = useLocalSearchParams<{ claimId: string; index?: string }>();

  const photos = useClaimStore((s) => s.claims.find((c) => c.id === claimId)?.photos);
  const count = photos?.length ?? 0;

  // Swift clamped initialIndex into range.
  const [start] = useState(() => Math.max(0, Math.min(Number(index ?? 0) || 0, count - 1)));
  const [current, setCurrent] = useState(start);

  useEffect(() => {
    if (count === 0 && router.canGoBack()) router.back();
  }, [count, router]);
  if (photos == null || count === 0) return <View style={styles.screen} />;

  const caption = photos[current]?.caption ?? '';

  return (
    <View style={styles.screen}>
      <PagerView
        style={StyleSheet.absoluteFill}
        initialPage={start}
        onPageSelected={(e: PagerViewOnPageSelectedEvent) => setCurrent(e.nativeEvent.position)}
      >
        {photos.map((photo) => (
          <View key={photo.id} style={styles.page}>
            <Image
              source={{ uri: photo.imageUri ?? claimPhotoURL(photo.id, 1200, 1200) }}
              contentFit="contain"
              transition={{ duration: 250, timing: 'ease-out' }}
              style={styles.photo}
            />
          </View>
        ))}
      </PagerView>

      {/* Counter pill + close (Swift .overlay(alignment: .top)). */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.xs }]}>
        {count > 1 ? (
          <Glass borderRadius={radius.full} colorScheme="dark" style={styles.counterPill} fallbackStyle={styles.onPhotoChip}>
            <Text style={[carlibFont(13, 'medium'), styles.onPhoto]}>
              {`${current + 1} / ${count}`}
            </Text>
          </Glass>
        ) : (
          <View />
        )}
        <PressableScale
          scale={0.9}
          haptic="light"
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <Glass
            borderRadius={20}
            colorScheme="dark"
            style={StyleSheet.absoluteFill}
            fallbackStyle={styles.onPhotoChip}
          />
          <RemixIcon name="closeLine" size={22} color="#FFFFFF" />
        </PressableScale>
      </View>

      {/* Caption pill above the page indicator (Swift TabView .page dots). */}
      <View
        pointerEvents="none"
        style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.sm }]}
      >
        {caption !== '' && (
          <Glass borderRadius={radius.full} colorScheme="dark" style={styles.captionPill} fallbackStyle={styles.onPhotoCaption}>
            <Text style={[carlibFont(15, 'medium'), styles.onPhoto, styles.captionText]}>
              {caption}
            </Text>
          </Glass>
        )}
        {count > 1 && (
          <View style={styles.dots}>
            {photos.map((photo, i) => (
              <View key={photo.id} style={[styles.dot, i === current ? styles.dotOn : styles.dotOff]} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

export default function ClaimPhotoLightboxRoute() {
  return (
    <ThemeScope scheme="dark">
      <Stack.Screen options={{ presentation: 'fullScreenModal' }} />
      {/* Swift .statusBarHidden(true) */}
      <StatusBar hidden />
      <Lightbox />
    </ThemeScope>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: { width: '100%', height: '100%' },
  onPhoto: { color: '#FFFFFF' },

  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
  },
  // The chips' pre-glass fills — still the look where glass is unavailable.
  onPhotoChip: { backgroundColor: '#00000073', borderWidth: 0 },
  onPhotoCaption: { backgroundColor: '#00000080', borderWidth: 0 },
  counterPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  captionPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  captionText: { textAlign: 'center' },
  dots: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: '#00000073',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  dotOn: { opacity: 1 },
  dotOff: { opacity: 0.4 },
});
