// RN counterpart of Carlib/DesignSystem/RemixIcon.swift.
// Names are the Swift enum case names (homeLine, toolsFill, _24HoursFill…) so
// call sites mirror the iOS code 1:1. The glyph map is generated from the
// Swift enum by scripts/gen-remixicon-glyphmap.js.
import { createIconSet } from '@expo/vector-icons';

import glyphMap from '@/assets/icons/remixicon-glyphmap.json';

export type RemixIconName = keyof typeof glyphMap;

export const RemixIcon = createIconSet(glyphMap, 'remixicon', 'remixicon.ttf');
