// Emits the in-app notifications for a file's key steps (CARLIB-NOTIFS-01):
// creation, booking, confirmation, modification and take-up by a shop. Called
// from the claim store's mutations — one direction; the store never reads
// notifications back. Each entry carries the file reference and the centre
// opens the file when it is tapped.
import { longFormatted, timeFormatted } from '@/lib/dates';
import {
  claimReference,
  type Claim,
  type Garage,
  type NotificationAudience,
  type NotificationKind,
  type TimeSlot,
} from '@/models/types';
import { useNotificationStore } from '@/stores/notificationStore';

// Same v4-UUID shape the store and mock data use for fresh ids.
function randomId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const r = (Math.random() * 16) | 0;
    const v = char === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function notify(
  audience: NotificationAudience,
  kind: NotificationKind,
  claim: Claim,
  context: { garage?: Garage; slot?: TimeSlot } = {},
): void {
  useNotificationStore.getState().push({
    id: randomId(),
    audience,
    kind,
    claimId: claim.id,
    params: {
      reference: claimReference(claim),
      garage: context.garage?.name,
      date:
        context.slot != null
          ? `${longFormatted(context.slot.date)} · ${timeFormatted(context.slot.startTime)}`
          : undefined,
    },
    createdAt: new Date(),
    read: false,
  });
}
