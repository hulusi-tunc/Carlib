// Shared NativeTabs styling for both role shells.
//
// The tint mirrors SwiftUI's `.tint(.carlibPrimaryBlue)` (brand yellow) on
// DriverTabView / GarageTabView — without it the bar falls back to iOS system
// blue. disableTransparentOnScrollEdge only affects iOS <= 18, where the bar
// would otherwise lose its background at the scroll edge; on iOS 26 the
// floating Liquid Glass bar manages its own material and ignores
// backgroundColor / blurEffect (verified — do not re-add them expecting an
// opaque bar).
import type { ColorTokens } from '@/theme';
import { fontFamilies } from '@/theme';

export function tabBarStyleProps(colors: ColorTokens) {
  return {
    tintColor: colors.brandYellow,
    iconColor: {
      default: colors.carlibTabInactive,
      selected: colors.brandYellow,
    },
    labelStyle: {
      default: {
        fontFamily: fontFamilies.medium,
        fontSize: 11,
        color: colors.carlibTabInactive,
      },
      selected: {
        fontFamily: fontFamilies.medium,
        fontSize: 11,
        color: colors.brandYellow,
      },
    },
    disableTransparentOnScrollEdge: true,
    // iOS 26: the floating bar shrinks to the active tab while scrolling down.
    minimizeBehavior: 'onScrollDown',
  } as const;
}

/**
 * Bottom padding for scroll content inside a tab, so the last row clears the
 * floating Liquid Glass bar (its height is not measurable from JS — documented
 * NativeTabs limitation).
 */
export const TAB_BAR_SCROLL_PADDING = 72;
