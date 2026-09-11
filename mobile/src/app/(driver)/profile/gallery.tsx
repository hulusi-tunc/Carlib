// Dev-only design-system gallery (moved from the Phase-0 index route): every
// component rendered in light and dark on both platforms, with a live Liquid
// Glass check.
import { ImageBackground } from 'expo-image';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CarBrandLogo } from '@/components/CarBrandLogo';
import { CarlibButton } from '@/components/CarlibButton';
import { CarlibCard } from '@/components/CarlibCard';
import { CarlibSectionHeader } from '@/components/CarlibSectionHeader';
import { CarlibStatusBadge } from '@/components/CarlibStatusBadge';
import { CarlibSecureField, CarlibTextField } from '@/components/CarlibTextField';
import { DummyImage } from '@/components/DummyImage';
import { Glass, useGlassAvailable } from '@/components/Glass';
import { PolestarTile } from '@/components/PolestarTile';
import { RemixIcon } from '@/components/RemixIcon';
import { CarlibIcon } from '@/components/icons';
import { BOOKING_STATUSES, CLAIM_STATUSES, REPAIR_STATUSES } from '@/models/enums';
import {
  sectionHeaderText,
  spacing,
  text,
  useTheme,
  type ThemeMode,
} from '@/theme';

const THEME_MODES: ThemeMode[] = ['system', 'light', 'dark'];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[sectionHeaderText, { color: colors.carlibLabel, marginBottom: spacing.sm }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function Gallery() {
  const { colors, mode, setMode, scheme } = useTheme();
  const glassAvailable = useGlassAvailable();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.carlibScreenBg }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.screenHorizontal, paddingBottom: spacing.huge }}
      >
        <Text style={[text.largeTitle, { color: colors.carlibDark, marginVertical: spacing.md }]}>
          Design system
        </Text>

        <Section title="Theme">
          <View style={styles.row}>
            {THEME_MODES.map((m) => (
              <CarlibButton
                key={m}
                label={m}
                variant={mode === m ? 'primary' : 'secondary'}
                onPress={() => setMode(m)}
                style={{ flex: 1 }}
              />
            ))}
          </View>
          <Text style={[text.footnote, { color: colors.carlibSecondary, marginTop: spacing.xs }]}>
            scheme: {scheme} · liquid glass: {glassAvailable ? 'available' : 'fallback'}
          </Text>
        </Section>

        <Section title="Typography">
          <Text style={[text.largeTitle, { color: colors.carlibDark }]}>Large title 28</Text>
          <Text style={[text.title2, { color: colors.carlibDark }]}>Title2 22 medium</Text>
          <Text style={[text.title3, { color: colors.carlibDark }]}>Title3 17 medium</Text>
          <Text style={[text.body, { color: colors.carlibDark }]}>Body 15 regular — Aeonik</Text>
          <Text style={[text.footnote, { color: colors.carlibSecondary }]}>Footnote 13 secondary</Text>
          <Text style={[text.caption, { color: colors.carlibLabel }]}>Caption 13 medium label</Text>
        </Section>

        <Section title="Buttons">
          <View style={{ gap: spacing.sm }}>
            <CarlibButton label="Primary" onPress={() => {}} />
            <CarlibButton label="Secondary" variant="secondary" icon={CarlibIcon.calendar} onPress={() => {}} />
            <CarlibButton label="Ghost" variant="ghost" onPress={() => {}} />
            <CarlibButton label="Destructive" variant="destructive" onPress={() => {}} />
            <CarlibButton label="Loading" isLoading onPress={() => {}} />
            <CarlibButton label="Disabled" isDisabled onPress={() => {}} />
          </View>
        </Section>

        <Section title="Text fields">
          <View style={{ gap: spacing.md }}>
            <CarlibTextField
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <CarlibSecureField
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              hint="At least 8 characters"
            />
            <CarlibTextField
              label="With error"
              placeholder="Plate"
              value=""
              onChangeText={() => {}}
              error="This field is required"
            />
          </View>
        </Section>

        <Section title="Cards">
          <View style={{ gap: spacing.sm }}>
            <CarlibCard>
              <Text style={[text.title3, { color: colors.carlibDark }]}>Flat card</Text>
              <Text style={[text.footnote, { color: colors.carlibSecondary }]}>tileSecondary fill, radius 16</Text>
            </CarlibCard>
            <CarlibCard variant="elevated">
              <Text style={[text.title3, { color: colors.carlibDark }]}>Elevated card</Text>
              <Text style={[text.footnote, { color: colors.carlibSecondary }]}>1pt border, no shadow</Text>
            </CarlibCard>
          </View>
          <CarlibSectionHeader title="Section header" actionLabel="See all" onAction={() => {}} />
        </Section>

        <Section title="Status badges — claim">
          <View style={styles.wrapRow}>
            {CLAIM_STATUSES.map((s) => (
              <CarlibStatusBadge key={s} claimStatus={s} />
            ))}
          </View>
        </Section>

        <Section title="Status badges — booking">
          <View style={styles.wrapRow}>
            {BOOKING_STATUSES.map((s) => (
              <CarlibStatusBadge key={s} bookingStatus={s} />
            ))}
          </View>
        </Section>

        <Section title="Status badges — repair">
          <View style={styles.wrapRow}>
            {REPAIR_STATUSES.map((s) => (
              <CarlibStatusBadge key={s} repairStatus={s} />
            ))}
          </View>
        </Section>

        <Section title="Tiles">
          <View style={styles.row}>
            <PolestarTile
              title="My Garage"
              subtitle="2 cars"
              icon={CarlibIcon.car}
              variant="primary"
              onPress={() => {}}
              style={{ flex: 1 }}
            />
            <PolestarTile
              title="Find Body Shop"
              subtitle="6 nearby"
              icon={CarlibIcon.shops}
              iconPosition="bottomTrailing"
              onPress={() => {}}
              style={{ flex: 1 }}
            />
          </View>
        </Section>

        <Section title="Car brand logos">
          <View style={styles.wrapRow}>
            {['Peugeot', 'Renault', 'BMW', 'Tesla', 'Citroën', 'vw', 'Unknown'].map((b) => (
              <View key={b} style={styles.logoCell}>
                <CarBrandLogo brand={b} size={40} />
                <Text style={[text.micro, { color: colors.carlibLabel }]}>{b}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Dummy images">
          <View style={styles.row}>
            <DummyImage kind="garage" seed="atelier-dubois" width={160} height={100} borderRadius={12} />
            <DummyImage kind="person" seed="sophie-martin" width={100} height={100} borderRadius={9999} />
          </View>
        </Section>

        <Section title="Liquid glass">
          <ImageBackground
            source={require('../../../../assets/images/welcome-bg-1.png')}
            style={styles.glassBackdrop}
            imageStyle={{ borderRadius: 16 }}
          >
            <Glass borderRadius={16} style={styles.glassPanel}>
              <RemixIcon name={CarlibIcon.wrenchFilled} size={20} color={colors.carlibDark} />
              <Text style={[text.title3, { color: colors.carlibDark }]}>
                {glassAvailable ? 'GlassView — iOS 26 Liquid Glass' : 'Opaque fallback card'}
              </Text>
            </Glass>
          </ImageBackground>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.sectionSpacing,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.tileGap,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    alignItems: 'flex-start',
  },
  logoCell: {
    alignItems: 'center',
    gap: 4,
    width: 64,
  },
  glassBackdrop: {
    height: 180,
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  glassPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.md,
  },
});
