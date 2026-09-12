// The in-app notification centre (CARLIB-NOTIFS-01), shared by both roles;
// the route wrappers say where a tapped file opens.
import { useRouter, type Href } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { EmptyState } from '@/components/EmptyState';
import { RemixIcon, type RemixIconName } from '@/components/RemixIcon';
import { relativeFormatted } from '@/lib/dates';
import type { AppNotification, NotificationAudience, NotificationKind } from '@/models/types';
import { selectForAudience, useNotificationStore } from '@/stores/notificationStore';
import { carlibFont, radius, spacing, text, useTheme } from '@/theme';

const KIND_ICON: Record<NotificationKind, RemixIconName> = {
  fileCreated: 'fileTextLine',
  bookingConfirmed: 'calendarCheckLine',
  bookingChanged: 'calendarEventLine',
  bookingCancelled: 'calendarCloseLine',
  takenUp: 'toolsLine',
};

function NotificationRow({ item, onPress }: { item: AppNotification; onPress: () => void }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.row, !item.read && { backgroundColor: `${colors.brandYellow}14` }]}
    >
      <View style={[styles.iconDisc, { backgroundColor: colors.tileSecondary }]}>
        <RemixIcon name={KIND_ICON[item.kind]} size={20} color={colors.brandYellow} />
      </View>
      <View style={styles.body}>
        <Text style={[carlibFont(15, 'medium'), { color: colors.carlibDark }]} numberOfLines={2}>
          {t(`notifications.${item.audience}.${item.kind}Title`, item.params)}
        </Text>
        <Text style={[text.footnote, { color: colors.carlibSecondary }]} numberOfLines={3}>
          {t(`notifications.${item.audience}.${item.kind}Body`, item.params)}
        </Text>
        <Text style={[text.caption, { color: colors.carlibLabel }]}>
          {relativeFormatted(item.createdAt)}
        </Text>
      </View>
      {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.brandYellow }]} />}
    </Pressable>
  );
}

export interface NotificationCenterProps {
  audience: NotificationAudience;
  /** Where a tapped entry opens its file. */
  claimHref: (claimId: string) => Href;
}

export function NotificationCenter({ audience, claimHref }: NotificationCenterProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const items = useNotificationStore(useShallow(selectForAudience(audience)));
  const markRead = useNotificationStore((s) => s.markRead);

  const open = (item: AppNotification) => {
    markRead(item.id);
    router.push(claimHref(item.claimId));
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      style={[styles.list, { backgroundColor: colors.carlibScreenBg }]}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={items.length === 0 ? styles.emptyContent : styles.content}
      ItemSeparatorComponent={() => (
        <View style={[styles.divider, { backgroundColor: colors.carlibCardBorder }]} />
      )}
      ListEmptyComponent={
        <EmptyState
          icon="notificationOffLine"
          title={t('notifications.emptyTitle')}
          description={t('notifications.emptyBody')}
        />
      }
      renderItem={({ item }) => <NotificationRow item={item} onPress={() => open(item)} />}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  content: { paddingVertical: spacing.sm },
  emptyContent: { flexGrow: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
  },
  iconDisc: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 3 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: spacing.screenHorizontal + 40 + spacing.sm,
  },
});
