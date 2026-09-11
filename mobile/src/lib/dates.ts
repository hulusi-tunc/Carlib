// Ported from Carlib/Extensions/DateFormatting.swift. Output is pinned to
// en-US regardless of app language, matching the hardcoded en_US locale on iOS.
// (daysFromNow/hoursFromNow seed helpers live in services/mockData.)
import { format, formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

const EN_US = { locale: enUS } as const;

/** "Mon, Apr 7" */
export function shortFormatted(date: Date): string {
  return format(date, 'EEE, MMM d', EN_US);
}

/** "Apr 7" — month + day only, for list rows where the weekday is clutter. */
export function monthDayFormatted(date: Date): string {
  return format(date, 'MMM d', EN_US);
}

/** "April 7, 2026" */
export function longFormatted(date: Date): string {
  return format(date, 'MMMM d, yyyy', EN_US);
}

/** "2:30 PM" */
export function timeFormatted(date: Date): string {
  return format(date, 'h:mm a', EN_US);
}

/** "2 days ago", "in 5 hours" — RelativeDateTimeFormatter-style full units. */
export function relativeFormatted(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true, locale: enUS });
}
