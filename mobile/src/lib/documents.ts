// Vehicle documents (CARLIB-USERDOCS-01): PDF, JPG or PNG under a size cap,
// rejected with the limit named. Picking goes through the system document
// picker so PDFs are reachable, not only photos.
import * as DocumentPicker from 'expo-document-picker';

export const ACCEPTED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'] as const;
/** Per-file cap — an input we defaulted for the PM. */
export const MAX_DOCUMENT_MB = 10;

export interface PickedDocument {
  name: string;
  uri: string;
  mimeType: string;
  size: number;
}

export type PickResult =
  | { status: 'picked'; document: PickedDocument }
  | { status: 'cancelled' }
  | { status: 'rejected'; reason: 'format' | 'size' };

export async function pickVehicleDocument(): Promise<PickResult> {
  const result = await DocumentPicker.getDocumentAsync({
    type: [...ACCEPTED_DOCUMENT_TYPES],
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled) return { status: 'cancelled' };
  const asset = result.assets[0];
  if (asset == null) return { status: 'cancelled' };
  const mimeType = asset.mimeType ?? '';
  // The picker's type filter is advisory on some platforms; the rule is enforced here.
  if (!(ACCEPTED_DOCUMENT_TYPES as readonly string[]).includes(mimeType)) {
    return { status: 'rejected', reason: 'format' };
  }
  const size = asset.size ?? 0;
  if (size > MAX_DOCUMENT_MB * 1024 * 1024) return { status: 'rejected', reason: 'size' };
  return { status: 'picked', document: { name: asset.name, uri: asset.uri, mimeType, size } };
}

/** "340 KB", "1.2 MB". */
export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
