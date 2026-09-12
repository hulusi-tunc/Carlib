// In-app notification centre (CARLIB-NOTIFS-01): every key step of a file
// lands here whatever the OS push permission says. Push delivery itself is
// backend work; this store is what the bell badge and the centre read.
import { create } from 'zustand';

import type { AppNotification, NotificationAudience } from '@/models/types';

export interface NotificationState {
  notifications: AppNotification[];
  push: (notification: AppNotification) => void;
  markRead: (id: string) => void;
  markAllRead: (audience: NotificationAudience) => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  push: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications] })),
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((item) =>
        item.id === id && !item.read ? { ...item, read: true } : item,
      ),
    })),
  markAllRead: (audience) =>
    set((state) => ({
      notifications: state.notifications.map((item) =>
        item.audience === audience && !item.read ? { ...item, read: true } : item,
      ),
    })),
}));

/** Curried selector — pair with useShallow, it builds a new array. */
export function selectForAudience(audience: NotificationAudience) {
  return (state: NotificationState): AppNotification[] =>
    state.notifications.filter((item) => item.audience === audience);
}

export function selectUnreadCount(audience: NotificationAudience) {
  return (state: NotificationState): number =>
    state.notifications.filter((item) => item.audience === audience && !item.read).length;
}
