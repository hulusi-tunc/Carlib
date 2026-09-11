// Port of Carlib/Views/Driver/GarageSearchView.swift — Shops tab.
// Full-screen Apple map + a draggable bottom panel: collapsed it is a floating
// Liquid-Glass card (carousel) hovering above the tab bar; expanded it is a
// full-screen opaque surface (list) and the tab bar hides via shopsUiStore.
// The panel is a fixed-size surface that is only ever TRANSLATED — the layout
// flips at settle and the translation re-bases so the top edge stays put.
import { useRouter } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  type ViewToken,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import type MapView from 'react-native-maps';
import Animated, {
  FadeIn,
  runOnJS,
  useAnimatedStyle,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
  useReducedMotion,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glass } from '@/components/Glass';
import { PageDot } from '@/components/PageDot';
import { PressableScale } from '@/components/PressableScale';
import { RemixIcon } from '@/components/RemixIcon';
import {
  CAROUSEL_CARD_HEIGHT,
  CarouselGarageCard,
  ListGarageRow,
  withAlpha,
} from '@/components/shops/GarageSearchCards';
import type { Garage } from '@/models/types';
import { useClaimStore } from '@/stores/claimStore';
import { useShopsUiStore } from '@/stores/shopsUiStore';
import { carlibFont, fontFamilies, text, useTheme } from '@/theme';
import { GarageMapCanvas } from '@/components/shops/GarageMapCanvas';

const COLLAPSED_HEIGHT = 300;
const CAROUSEL_GAP = 12;
const CAROUSEL_MARGIN = 20;
const PANEL_MARGIN_H = 12;
const PANEL_MARGIN_BOTTOM = 10;

const PARIS_REGION = {
  latitude: 48.856,
  longitude: 2.37,
  latitudeDelta: 0.035,
  longitudeDelta: 0.035,
};
const FOCUS_DELTA = 0.012;

// SwiftUI spring(response: 0.38, dampingFraction: 0.84).
const SETTLE_SPRING = { mass: 1, stiffness: 273, damping: 28 } as const;
const FLING_VELOCITY = 500;
// Swift contentMidpoint: the content flips to the list once the drag passes
// halfway between the two resting heights. Hysteresis stops it flip-flopping
// at the seam.
const MORPH_MIDPOINT = 0.5;
const MORPH_HYSTERESIS = 0.06;

function filterGarages(garages: Garage[], searchText: string): Garage[] {
  if (!searchText) return garages;
  const query = searchText.trim().toLowerCase();
  return garages.filter(
    (garage) =>
      garage.name.toLowerCase().includes(query) || garage.address.toLowerCase().includes(query),
  );
}

function CarouselSeparator() {
  return <View style={{ width: CAROUSEL_GAP }} />;
}

export default function GarageSearchScreen() {
  const { colors } = useTheme();
  // Reanimated springs/timings already honour the OS Reduce Motion setting
  // (ReduceMotion.System is the default); the map camera and the programmatic
  // carousel scroll are the two non-Reanimated moves, so they are gated here.
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();

  const garages = useClaimStore((s) => s.garages);
  const setPanelExpanded = useShopsUiStore((s) => s.setPanelExpanded);

  const [expanded, setExpanded] = useState(false);
  // Live content state during a drag (Swift isContentExpanded). `expanded`
  // stays the settled truth for the glass surface, frame, insets and tab bar.
  const [contentExpanded, setContentExpanded] = useState(false);
  const liveExpanded = useSharedValue(false);
  const [searchText, setSearchText] = useState('');
  // Swift onAppear: the first shop starts selected.
  const [selectedId, setSelectedId] = useState<string | null>(() => garages[0]?.id ?? null);
  const [containerSize, setContainerSize] = useState({
    width: window.width,
    height: window.height,
  });

  const mapRef = useRef<MapView>(null);
  const carouselRef = useRef<FlatList<Garage>>(null);
  // Breaks the pin ↔ carousel feedback loop: while a programmatic carousel
  // scroll is in flight, viewability changes must not drive the selection.
  const programmaticScroll = useRef(false);
  const scrollSettleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectionFromCarousel = useRef(false);
  const pendingRebase = useRef<number | null>(null);

  // Latest values for callbacks created once (the gesture, the viewability
  // pair) — synced after commit rather than written during render.
  const expandedRef = useRef(expanded);
  const selectedIdRef = useRef(selectedId);
  useLayoutEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);
  useLayoutEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const ty = useSharedValue(0);

  // Distance the panel's top edge travels between the two resting layouts.
  const travel = Math.max(
    0,
    containerSize.height - (insets.bottom + PANEL_MARGIN_BOTTOM + COLLAPSED_HEIGHT),
  );
  const cardWidth = containerSize.width - PANEL_MARGIN_H * 2 - CAROUSEL_MARGIN * 2;
  const cardStride = cardWidth + CAROUSEL_GAP;

  const filteredGarages = useMemo(() => filterGarages(garages, searchText), [garages, searchText]);

  // Swift onChange(searchText): keep the selection inside the filtered set.
  const onSearchChange = useCallback(
    (next: string) => {
      setSearchText(next);
      const nextFiltered = filterGarages(garages, next);
      if (selectedId != null && !nextFiltered.some((garage) => garage.id === selectedId)) {
        setSelectedId(nextFiltered[0]?.id ?? null);
      }
    },
    [garages, selectedId],
  );

  // Selection → camera + carousel. Camera always follows; the carousel only
  // scrolls when the selection did NOT originate from the carousel itself.
  useEffect(() => {
    if (selectedId == null) return;
    const garage = garages.find((g) => g.id === selectedId);
    if (garage) {
      mapRef.current?.animateToRegion(
        {
          latitude: garage.location.latitude,
          longitude: garage.location.longitude,
          latitudeDelta: FOCUS_DELTA,
          longitudeDelta: FOCUS_DELTA,
        },
        reduceMotion ? 0 : 400,
      );
    }
    if (selectionFromCarousel.current) {
      selectionFromCarousel.current = false;
      return;
    }
    const index = filteredGarages.findIndex((g) => g.id === selectedId);
    if (index >= 0) {
      programmaticScroll.current = true;
      carouselRef.current?.scrollToOffset({ offset: index * cardStride, animated: !reduceMotion });
      if (scrollSettleTimer.current) clearTimeout(scrollSettleTimer.current);
      scrollSettleTimer.current = setTimeout(() => {
        programmaticScroll.current = false;
      }, 700);
    }
    // Intentionally selection-driven only — mirrors Swift onChange(selectedGarageId).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(
    () => () => {
      if (scrollSettleTimer.current) clearTimeout(scrollSettleTimer.current);
      setPanelExpanded(false);
    },
    [setPanelExpanded],
  );

  const [viewabilityConfigCallbackPairs] = useState(() => [
    {
      viewabilityConfig: { itemVisiblePercentThreshold: 60 },
      onViewableItemsChanged: ({ viewableItems }: { viewableItems: ViewToken<Garage>[] }) => {
        if (programmaticScroll.current) return;
        const first = viewableItems.find((token) => token.isViewable);
        const id = first?.item?.id;
        if (id != null && id !== selectedIdRef.current) {
          selectionFromCarousel.current = true;
          setSelectedId(id);
        }
      },
    },
  ]);

  // Settle to a resting state. When the surface flips, the translation is
  // re-based in the same commit (useLayoutEffect below) so the top edge is
  // continuous, then springs home. Same state → just spring back.
  const settle = useCallback(
    (next: boolean) => {
      liveExpanded.set(next);
      setContentExpanded(next);
      if (next === expandedRef.current) {
        ty.set(withSpring(0, SETTLE_SPRING));
        return;
      }
      pendingRebase.current = next ? travel + ty.get() : ty.get() - travel;
      setExpanded(next);
      setPanelExpanded(next);
    },
    [liveExpanded, setPanelExpanded, travel, ty],
  );

  useLayoutEffect(() => {
    if (pendingRebase.current == null) return;
    ty.set(pendingRebase.current);
    pendingRebase.current = null;
    ty.set(withSpring(0, SETTLE_SPRING));
  }, [expanded, ty]);

  // The worklets hand off to `settle` through runOnJS, i.e. in gesture-event
  // context. The compiler's refs rule cannot see through runOnJS and reports
  // `settle` (which reads a ref) as a render-time access, so it is disabled
  // on the two handlers that reference it.
  const panelGesture = useMemo(() => {
    const pan = Gesture.Pan()
      .onUpdate((event) => {
        'worklet';
        ty.set(Math.min(0, Math.max(-travel, event.translationY)));
      })
      // eslint-disable-next-line react-hooks/refs
      .onEnd((event) => {
        'worklet';
        let shouldExpand: boolean;
        if (event.velocityY < -FLING_VELOCITY) shouldExpand = true;
        else if (event.velocityY > FLING_VELOCITY) shouldExpand = false;
        else shouldExpand = -ty.get() > travel * MORPH_MIDPOINT;
        runOnJS(settle)(shouldExpand);
      });
    // eslint-disable-next-line react-hooks/refs
    const tap = Gesture.Tap().onEnd(() => {
      'worklet';
      runOnJS(settle)(true);
    });
    return Gesture.Race(pan, tap);
  }, [settle, travel, ty]);

  // Mid-drag morph: flip the content at the midpoint while the finger is
  // down. Ignored once settled expanded — the translation is re-based then.
  useAnimatedReaction(
    () => (travel > 0 ? -ty.get() / travel : 0),
    (progress) => {
      if (expanded) return;
      const next = liveExpanded.get()
        ? progress > MORPH_MIDPOINT - MORPH_HYSTERESIS
        : progress > MORPH_MIDPOINT + MORPH_HYSTERESIS;
      if (next !== liveExpanded.get()) {
        liveExpanded.set(next);
        runOnJS(setContentExpanded)(next);
      }
    },
    [expanded, travel],
  );

  const focusGarage = useCallback(
    (garageId: string) => {
      setSelectedId(garageId);
      if (expandedRef.current) settle(false);
    },
    [settle],
  );

  const openDetail = useCallback(
    (garageId: string) => {
      // Swift openDetail: expand the panel first, so the detail pops back onto the list.
      settle(true);
      router.push(`/shops/garage/${garageId}`);
    },
    [router, settle],
  );

  const panelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
  }));

  const shopsCount = filteredGarages.length;
  const selectedIndex = filteredGarages.findIndex((garage) => garage.id === selectedId);

  const dragHandle = (
    <GestureDetector gesture={panelGesture}>
      <View style={styles.handleArea}>
        <View style={[styles.handleBar, { backgroundColor: withAlpha(colors.carlibLabel, 0.45) }]} />
      </View>
    </GestureDetector>
  );

  const navBar = (
    <View style={styles.navBar}>
      <Text style={[text.title3, styles.navTitle, { color: colors.carlibDark }]}>Body shops</Text>
      <PressableScale
        scale={0.94}
        haptic="light"
        onPress={() => settle(false)}
        style={[styles.backButton, { backgroundColor: colors.tileSecondary }]}
      >
        <RemixIcon name="arrowLeftSLine" size={20} color={colors.carlibDark} />
      </PressableScale>
    </View>
  );

  const searchField = (
    <View style={styles.searchWrap}>
      <View style={[styles.searchField, { backgroundColor: withAlpha(colors.tileSecondary, 0.6) }]}>
        <RemixIcon name="searchLine" size={16} color={colors.carlibLabel} />
        <TextInput
          style={[styles.searchInput, { color: colors.carlibDark }]}
          value={searchText}
          onChangeText={onSearchChange}
          placeholder="Search shops"
          placeholderTextColor={colors.carlibLabel}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <Pressable onPress={() => setSearchText('')} hitSlop={8}>
            <RemixIcon name="closeCircleFill" size={16} color={colors.carlibLabel} />
          </Pressable>
        )}
      </View>
    </View>
  );

  const emptyResults = (
    <View style={styles.empty}>
      <RemixIcon name="searchEyeLine" size={28} color={colors.carlibLabel} />
      <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]}>No shops match</Text>
      <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
        Try a different name or neighbourhood.
      </Text>
    </View>
  );

  const pageDots =
    shopsCount > 1 ? (
      <View style={styles.dotsRow}>
        {filteredGarages.map((garage) => (
          <PageDot
            key={garage.id}
            active={garage.id === selectedId}
            activeWidth={16}
            curve="ease"
            activeColor={colors.carlibDark}
            inactiveColor={withAlpha(colors.carlibLabel, 0.3)}
          />
        ))}
      </View>
    ) : null;

  const carouselBody = (
    <View style={styles.carouselSection}>
      <View style={styles.carouselHeader}>
        <Text style={[text.caption, styles.nearbyLabel, { color: colors.carlibLabel }]}>
          {`${shopsCount} shop${shopsCount === 1 ? '' : 's'} nearby`}
        </Text>
        <Pressable onPress={() => settle(true)} hitSlop={8} style={styles.listButton}>
          <Text style={[text.caption, { color: colors.carlibLabel }]}>List</Text>
          <RemixIcon name="arrowUpSLine" size={12} color={colors.carlibLabel} />
        </Pressable>
      </View>

      {shopsCount === 0 ? (
        emptyResults
      ) : (
        <>
          <FlatList
            ref={carouselRef}
            data={filteredGarages}
            keyExtractor={(garage) => garage.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={cardStride}
            snapToAlignment="start"
            decelerationRate="fast"
            style={styles.carousel}
            contentContainerStyle={styles.carouselContent}
            ItemSeparatorComponent={CarouselSeparator}
            getItemLayout={(_data, index) => ({
              length: cardStride,
              offset: cardStride * index,
              index,
            })}
            initialScrollIndex={selectedIndex > 0 ? selectedIndex : 0}
            viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
            onMomentumScrollEnd={() => {
              programmaticScroll.current = false;
            }}
            renderItem={({ item }) => (
              <Pressable onPress={() => openDetail(item.id)}>
                <CarouselGarageCard garage={item} width={cardWidth} />
              </Pressable>
            )}
          />
          {pageDots}
        </>
      )}
    </View>
  );

  const listBody = (
    <View style={styles.flex}>
      <Text style={[text.footnote, styles.foundLabel, { color: colors.carlibSecondary }]}>
        {`${shopsCount} shop${shopsCount === 1 ? '' : 's'} found`}
      </Text>
      {shopsCount === 0 ? (
        <View style={styles.emptyExpanded}>{emptyResults}</View>
      ) : (
        <FlatList
          data={filteredGarages}
          keyExtractor={(garage) => garage.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: 24 + insets.bottom }]}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSelectedId(item.id);
                openDetail(item.id);
              }}
            >
              <ListGarageRow garage={item} selected={item.id === selectedId} />
            </Pressable>
          )}
        />
      )}
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.flex}>
      <View
        style={[styles.flex, { backgroundColor: colors.carlibScreenBg }]}
        onLayout={(event) =>
          setContainerSize({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
          })
        }
      >
        <GarageMapCanvas
          ref={mapRef}
          region={PARIS_REGION}
          garages={garages}
          selectedId={selectedId}
          onSelect={focusGarage}
        />

        <Animated.View
          style={[
            expanded
              ? styles.panelExpanded
              : [styles.panelCollapsed, { bottom: insets.bottom + PANEL_MARGIN_BOTTOM }],
            panelAnimatedStyle,
          ]}
        >
          <Glass
            borderRadius={expanded ? 0 : 24}
            glassEffectStyle={expanded ? 'none' : 'regular'}
            style={styles.flex}
            fallbackStyle={
              expanded ? { backgroundColor: colors.carlibScreenBg, borderWidth: 0 } : undefined
            }
          >
            {/* Expanded surface is opaque — an underlay, never a glass fade. */}
            {expanded && (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.carlibScreenBg }]} />
            )}
            <View style={[styles.flex, expanded && { paddingTop: insets.top }]}>
              <Animated.View key={`header-${contentExpanded}`} entering={FadeIn.duration(160)}>
                {contentExpanded ? navBar : dragHandle}
              </Animated.View>
              {searchField}
              <Animated.View
                key={`body-${contentExpanded}`}
                entering={FadeIn.duration(160)}
                style={styles.flex}
              >
                {contentExpanded ? listBody : carouselBody}
              </Animated.View>
            </View>
          </Glass>
        </Animated.View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  panelCollapsed: {
    position: 'absolute',
    left: PANEL_MARGIN_H,
    right: PANEL_MARGIN_H,
    height: COLLAPSED_HEIGHT,
    // Swift: .shadow(color: .black.opacity(0.20), radius: 18, y: 4)
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
  },
  panelExpanded: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  handleArea: {
    alignItems: 'center',
    paddingVertical: 8,
    alignSelf: 'stretch',
  },
  handleBar: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
  },
  navBar: {
    height: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 6,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: 15,
  },
  carouselSection: {
    gap: 8,
  },
  carouselHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  nearbyLabel: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  carousel: {
    height: CAROUSEL_CARD_HEIGHT,
    flexGrow: 0,
  },
  carouselContent: {
    paddingHorizontal: CAROUSEL_MARGIN,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 6,
    paddingBottom: 14,
  },
  foundLabel: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  empty: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 24,
  },
  emptyExpanded: {
    paddingTop: 40,
  },
});
