// Port of Carlib/Views/Shared/NotificationSettingsView.swift. Toggle state is
// local-only prototype state (no persistence, no push registration) — parity
// with the iOS placeholder behavior.
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import { carlibFont, radius, spacing, text, useTheme } from '@/theme';

function ToggleRow({
  icon,
  title,
  value,
  onValueChange,
  enabled,
}: {
  icon: RemixIconName;
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  enabled: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.toggleRow, !enabled && styles.dimmed]}>
      <View style={[styles.iconDisc, { backgroundColor: `${colors.brandYellow}1F` }]}>
        <RemixIcon name={icon} size={18} color={colors.brandYellow} />
      </View>
      <Text style={[carlibFont(15, 'medium'), styles.rowTitle, { color: colors.carlibDark }]}>
        {title}
      </Text>
      {/* The native switch follows the OS appearance, not our in-app theme
          (app.json userInterfaceStyle: automatic), so the off track has to come
          from the tokens or it renders light-grey on a dark card. */}
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={!enabled}
        trackColor={{ false: colors.carlibCardBorder, true: colors.brandYellow }}
        ios_backgroundColor={colors.carlibCardBorder}
      />
    </View>
  );
}

export function NotificationSettingsSheet() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState(true);
  const [bookingReminders, setBookingReminders] = useState(true);
  const [newMatches, setNewMatches] = useState(true);

  const cardBg = `${colors.tileSecondary}80`;

  return (
    <View style={[styles.screen, { backgroundColor: colors.carlibScreenBg }]}>
      {/* Inline nav bar — centered title + trailing Done (Swift toolbar). */}
      <View style={styles.toolbar}>
        <Text style={[carlibFont(17, 'medium'), { color: colors.carlibDark }]}>
          {t('notificationSettings.title')}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.done}>
          <Text style={[carlibFont(17, 'medium'), { color: colors.carlibDark }]}>
            {t('common.done')}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <Text style={[text.title2, { color: colors.carlibDark }]}>
            {t('notificationSettings.title')}
          </Text>
          {/* Hardcoded in Swift (not in L10n) — kept verbatim. */}
          <Text style={[text.footnote, { color: colors.carlibSecondary }]}>
            Choose which updates Carlib sends to your device.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <ToggleRow
            icon="notificationLine"
            title={t('notificationSettings.pushEnabled')}
            value={pushEnabled}
            onValueChange={setPushEnabled}
            enabled
          />
        </View>

        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <ToggleRow
            icon="fileListLine"
            title={t('notificationSettings.statusUpdates')}
            value={statusUpdates}
            onValueChange={setStatusUpdates}
            enabled={pushEnabled}
          />
          <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />
          <ToggleRow
            icon="calendarEventLine"
            title={t('notificationSettings.bookingReminders')}
            value={bookingReminders}
            onValueChange={setBookingReminders}
            enabled={pushEnabled}
          />
          <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />
          <ToggleRow
            icon="sparklingLine"
            title={t('notificationSettings.newMatches')}
            value={newMatches}
            onValueChange={setNewMatches}
            enabled={pushEnabled}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  toolbar: {
    minHeight: 44,
    marginTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  done: {
    position: 'absolute',
    right: spacing.lg,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  intro: { gap: 6 },
  card: { borderRadius: 14 },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: spacing.sm,
  },
  dimmed: { opacity: 0.5 },
  iconDisc: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { flex: 1 },
});
