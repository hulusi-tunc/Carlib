// Deep-link helpers for call / directions actions.
// openURL().catch() only — canOpenURL would require LSApplicationQueriesSchemes
// (iOS) / package-visibility queries (Android) and adds nothing here.
import { Linking, Platform } from 'react-native';

export function openTel(phone: string): void {
  Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`).catch(() => undefined);
}

export function openMaps(query: string): void {
  const q = encodeURIComponent(query);
  if (Platform.OS === 'ios') {
    Linking.openURL(`http://maps.apple.com/?q=${q}`).catch(() => undefined);
    return;
  }
  Linking.openURL(`geo:0,0?q=${q}`).catch(() => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`).catch(() => undefined);
  });
}
