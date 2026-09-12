// Bell + unread badge for the tab roots' logo bars; opens the centre.
import { useRouter, type Href } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/PressableScale';
import { RemixIcon } from '@/components/RemixIcon';
import type { NotificationAudience } from '@/models/types';
import { selectUnreadCount, useNotificationStore } from '@/stores/notificationStore';
import { carlibFont, radius, useTheme } from '@/theme';

export function NotificationBell({
  audience,
  href,
}: {
  audience: NotificationAudience;
  href: Href;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const unread = useNotificationStore(selectUnreadCount(audience));

  return (
    <PressableScale
      scale={0.92}
      haptic="light"
      accessibilityLabel={t('notifications.title')}
      onPress={() => router.push(href)}
      style={styles.button}
    >
      <RemixIcon name="notificationLine" size={22} color={colors.carlibDark} />
      {unread > 0 && (
        <View
          style={[
            styles.badge,
            { backgroundColor: colors.brandYellow, borderColor: colors.carlibScreenBg },
          ]}
        >
          {/* Brand yellow never adapts, so its ink stays explicitly black. */}
          <Text style={[carlibFont(11, 'medium'), { color: '#000000' }]}>
            {unread > 9 ? '9+' : String(unread)}
          </Text>
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
