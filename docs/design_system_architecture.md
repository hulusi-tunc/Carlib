# Carlib Design System Architecture

**Platform:** iOS 26 (SwiftUI, iPhone only, Portrait only)
**Language:** Swift (zero external dependencies)
**Locale:** French only (assurance/carrosserie vocabulary)
**Version:** 1.0
**Date:** April 2026

---

## Table of Contents

1. [Token Architecture](#1-token-architecture)
2. [Component Inventory](#2-component-inventory)
3. [Component Hierarchy and Dependencies](#3-component-hierarchy-and-dependencies)
4. [State Management Architecture](#4-state-management-architecture)
5. [Shared vs. Role-Specific Patterns](#5-shared-vs-role-specific-patterns)
6. [Status Flow System](#6-status-flow-system)
7. [Accessibility Architecture](#7-accessibility-architecture)
8. [Build Priority](#8-build-priority)

---

## 1. Token Architecture

The token system is implemented entirely in Swift using enums with static properties, Color/Font extensions, and SwiftUI Environment values. No external dependencies. Tokens are the single source of truth consumed by every component in the app.

### 1.1 Architecture Tiers

```
Tier 1: Raw Palette        Enum CarlibPalette — raw Color values, never used directly in views
Tier 2: Semantic Tokens     Extension on Color/Font — semantic meaning, the primary API for all views
Tier 3: Component Tokens    Per-component structs — sparse overrides only where needed
```

**Implementation pattern:** Each tier is a separate Swift file within a `DesignSystem/Tokens/` directory. Tier 2 references Tier 1. Tier 3 references Tier 2. Views only ever reference Tier 2 or Tier 3.

### 1.2 Color Tokens

#### Tier 1: Raw Palette

Implementation as an enum with nested enums per hue. Each case holds a SwiftUI `Color` defined via Asset Catalog entries for future dark mode support.

```
CarlibPalette
  .blue      — .50, .100, .200, .300, .400, .500, .600, .700, .800, .900
  .green     — .50, .100, .200, .300, .400, .500, .600, .700, .800, .900
  .amber     — .50, .100, .200, .300, .400, .500, .600, .700, .800, .900
  .red       — .50, .100, .200, .300, .400, .500, .600, .700, .800, .900
  .gray      — .50, .100, .200, .300, .400, .500, .600, .700, .800, .900
  .white
  .black
```

**Rationale for palette choices:**
- **Blue:** calming, trust-building — appropriate for post-accident stress context. Aligns with insurance industry norms (AXA, Allianz, Doctolib).
- **Green:** success, completion, forward progress — repair complete states.
- **Amber (not red):** attention without panic — pending states, warnings. Red is avoided for primary alerts because it triggers danger associations in a post-accident user.
- **Red:** reserved exclusively for destructive actions (delete, cancel) and form validation errors.
- **Gray:** neutral scale for text, borders, backgrounds, disabled states.

Colors are defined in the Xcode Asset Catalog with both "Any Appearance" and "Dark" variants pre-structured (even if dark mode ships later). This avoids a retrofit migration.

#### Tier 2: Semantic Color Tokens

Implementation as a `Color` extension with static computed properties.

| Swift Property | Maps To | Usage |
|---|---|---|
| `Color.carlibPrimary` | `blue.600` | Primary buttons, links, active tab, brand anchor |
| `Color.carlibPrimarySubtle` | `blue.50` | Primary tinted backgrounds, selected row highlights |
| `Color.carlibPrimaryHover` | `blue.700` | Button pressed state (on press, not hover — iOS has no hover) |
| `Color.carlibSecondary` | `gray.700` | Secondary buttons, secondary text emphasis |
| `Color.carlibSurfaceDefault` | `white` | Screen backgrounds, card backgrounds |
| `Color.carlibSurfaceElevated` | `white` | Elevated card surfaces (combined with shadow) |
| `Color.carlibSurfaceMuted` | `gray.50` | Section backgrounds, input field backgrounds, grouped table bg |
| `Color.carlibBorderDefault` | `gray.200` | Default borders on cards, inputs, dividers |
| `Color.carlibBorderStrong` | `gray.400` | Emphasized borders, active input borders |
| `Color.carlibBorderFocus` | `blue.500` | Focus ring color (accessibility) |
| `Color.carlibTextPrimary` | `gray.900` | Headings, body text, primary content |
| `Color.carlibTextSecondary` | `gray.600` | Helper text, metadata, timestamps, secondary labels |
| `Color.carlibTextTertiary` | `gray.400` | Placeholder text, disabled text |
| `Color.carlibTextInverse` | `white` | Text on primary/dark backgrounds |
| `Color.carlibTextLink` | `blue.600` | Interactive text links |
| `Color.carlibSuccess` | `green.600` | Success states, "termine" status, confirmation |
| `Color.carlibSuccessSubtle` | `green.50` | Success tinted backgrounds |
| `Color.carlibWarning` | `amber.600` | Warning states, "en attente" status, expiring slots |
| `Color.carlibWarningSubtle` | `amber.50` | Warning tinted backgrounds |
| `Color.carlibError` | `red.600` | Error states, destructive actions, form validation |
| `Color.carlibErrorSubtle` | `red.50` | Error tinted backgrounds |
| `Color.carlibInfo` | `blue.500` | Informational states, tips, guidance |
| `Color.carlibInfoSubtle` | `blue.50` | Info tinted backgrounds |

#### Tier 2: Status-Specific Color Tokens

| Swift Property | Maps To | Status |
|---|---|---|
| `Color.carlibStatusPending` | `amber.500` | En attente |
| `Color.carlibStatusPendingBg` | `amber.50` | En attente background |
| `Color.carlibStatusAssigned` | `blue.500` | Attribue / Confirme |
| `Color.carlibStatusAssignedBg` | `blue.50` | Attribue background |
| `Color.carlibStatusInProgress` | `blue.700` | En cours / En reparation |
| `Color.carlibStatusInProgressBg` | `blue.50` | In progress background |
| `Color.carlibStatusCompleted` | `green.600` | Termine / Pret |
| `Color.carlibStatusCompletedBg` | `green.50` | Completed background |
| `Color.carlibStatusCancelled` | `red.500` | Annule |
| `Color.carlibStatusCancelledBg` | `red.50` | Cancelled background |
| `Color.carlibStatusDraft` | `gray.400` | Brouillon / Expire |
| `Color.carlibStatusDraftBg` | `gray.50` | Draft background |

### 1.3 Typography Tokens

**Font family:** SF Pro (system font via `Font.system()`). SF Pro is the native iOS typeface, requires zero bundling, supports all French diacriticals perfectly (e, e, a, i, o, u, c, oe, ae), provides full weight range, excellent tabular figures for prices/distances, and is optimized for Dynamic Type scaling. Using the system font also eliminates an open blocker (brand font choice not yet decided by client).

Implementation as a `Font` extension with static computed properties, using `Font.system(size:weight:design:)` with `.rounded` design available as an alternative variant if the brand direction calls for warmth.

| Swift Property | Size | Weight | Design | Line Spacing | Usage |
|---|---|---|---|---|---|
| `Font.carlibDisplay` | 32 | `.bold` | `.default` | 1.2 | Landing hero, splash only |
| `Font.carlibH1` | 28 | `.bold` | `.default` | 1.25 | Screen titles: "Declarer un sinistre" |
| `Font.carlibH2` | 22 | `.semibold` | `.default` | 1.3 | Section headings: "Garages a proximite" |
| `Font.carlibH3` | 18 | `.semibold` | `.default` | 1.35 | Card titles, subsections: garage name |
| `Font.carlibH4` | 16 | `.semibold` | `.default` | 1.4 | List item titles, field group labels |
| `Font.carlibBodyLarge` | 16 | `.regular` | `.default` | 1.5 | Primary body text, descriptions |
| `Font.carlibBodyMedium` | 14 | `.regular` | `.default` | 1.5 | Secondary body text, addresses |
| `Font.carlibBodySmall` | 12 | `.regular` | `.default` | 1.5 | Captions, metadata, timestamps |
| `Font.carlibLabelLarge` | 16 | `.medium` | `.default` | 1.4 | Button text, large labels |
| `Font.carlibLabelMedium` | 14 | `.medium` | `.default` | 1.4 | Form labels, tab labels |
| `Font.carlibLabelSmall` | 12 | `.medium` | `.default` | 1.4 | Small labels, badge text |
| `Font.carlibOverline` | 11 | `.semibold` | `.default` | 1.6 | Section overlines, step labels (uppercased in view) |
| `Font.carlibCaption` | 11 | `.regular` | `.default` | 1.5 | Timestamps, footnotes, helper text |

**Dynamic Type mapping:** Every font token uses `.dynamicTypeSize(...)` range support so the system scales gracefully. The typography extension wraps each definition with a `@ScaledMetric` equivalent using `Font.system(.body).leading(.loose)` patterns where appropriate, and provides explicit `DynamicTypeSize` range clamping at the view level (minimum `.xSmall`, maximum `.accessibility3`).

**French text sizing note:** French labels average 20% longer than English equivalents. All layout using typography tokens must accommodate wrapping. No truncation of status labels or navigation text — use `lineLimit(nil)` or `fixedSize(horizontal: false, vertical: true)` where needed.

### 1.4 Spacing Tokens

Base unit: **4pt** (aligned with the 4pt iOS grid).

Implementation as an enum `CarlibSpacing` with `CGFloat` static properties.

| Swift Property | Value | Named Alias | Usage |
|---|---|---|---|
| `CarlibSpacing.none` | 0 | — | Reset spacing |
| `CarlibSpacing.xxxs` | 2 | — | Hairline gaps (border offsets) |
| `CarlibSpacing.xxs` | 4 | xs | Icon-to-text gap, tight inline spacing |
| `CarlibSpacing.xs` | 8 | s | Compact spacing, chip internal padding, between badge elements |
| `CarlibSpacing.sm` | 12 | — | Input inner padding, small card padding |
| `CarlibSpacing.md` | 16 | m | Standard component padding, horizontal margins, list item vertical padding |
| `CarlibSpacing.lg` | 24 | l | Card body padding, section spacing |
| `CarlibSpacing.xl` | 32 | xl | Section spacing, between card groups |
| `CarlibSpacing.xxl` | 48 | xxl | Screen top/bottom padding, major section breaks |
| `CarlibSpacing.xxxl` | 64 | — | Hero spacing, visual breathing room |

**Layout constants (also in CarlibSpacing):**

| Swift Property | Value | Usage |
|---|---|---|
| `CarlibSpacing.screenHorizontalPadding` | 16 | Left + right margin on all screens (32 total on 375pt) |
| `CarlibSpacing.cardPadding` | 16 | Internal card padding |
| `CarlibSpacing.sectionGap` | 24 | Vertical gap between content sections |
| `CarlibSpacing.tabBarHeight` | 56 | Bottom tab bar content height (before safe area) |
| `CarlibSpacing.topBarHeight` | 56 | Top navigation bar height |
| `CarlibSpacing.buttonHeight` | 52 | Standard button height (meets 44pt minimum + visual padding) |
| `CarlibSpacing.buttonHeightStress` | 56 | Button height in declaration flow (post-accident, larger targets) |
| `CarlibSpacing.inputHeight` | 48 | Text input field height |
| `CarlibSpacing.minTouchTarget` | 44 | Minimum touch target per iOS HIG |

### 1.5 Border Radius Tokens

Implementation as an enum `CarlibRadius` with `CGFloat` static properties.

| Swift Property | Value | Usage |
|---|---|---|
| `CarlibRadius.none` | 0 | No rounding |
| `CarlibRadius.xs` | 4 | Small elements, inner chip corners |
| `CarlibRadius.sm` | 8 | Inputs, small cards, thumbnails |
| `CarlibRadius.md` | 12 | Standard cards, modals, buttons |
| `CarlibRadius.lg` | 16 | Bottom sheets top corners, large cards |
| `CarlibRadius.xl` | 24 | Pills, floating action buttons, chips |
| `CarlibRadius.full` | .infinity | Circular elements (avatars, status dots, notification badges) |

### 1.6 Shadow / Elevation Tokens

Implementation as a ViewModifier `CarlibElevation` with preset levels. Each level defines a SwiftUI `.shadow()` combination.

| Swift Property | Radius | Y Offset | Opacity | Usage |
|---|---|---|---|---|
| `CarlibElevation.none` | 0 | 0 | 0 | Flat surfaces |
| `CarlibElevation.xs` | 2 | 1 | 0.06 | Subtle lift: focused inputs, divider shadow |
| `CarlibElevation.sm` | 4 | 2 | 0.08 | Cards resting on surface |
| `CarlibElevation.md` | 8 | 4 | 0.10 | Elevated cards, floating elements |
| `CarlibElevation.lg` | 16 | 8 | 0.12 | Bottom sheets, modals |
| `CarlibElevation.xl` | 32 | 12 | 0.16 | Full-screen overlays, dialogs |

**Implementation note:** Each level applies two shadow passes — a "key shadow" (tighter, more opaque) and an "ambient shadow" (wider, more diffuse) — to match the iOS 26 material design language. Implemented as a custom ViewModifier so views call `.carlibElevation(.md)`.

### 1.7 Animation Tokens

Implementation as an enum `CarlibMotion` exposing `Animation` and `Duration` values. All animations respect `UIAccessibility.isReduceMotionEnabled` via an Environment key check.

#### Duration

| Swift Property | Value | Usage |
|---|---|---|
| `CarlibMotion.durationFast` | 0.15s | Micro-interactions: toggle, checkbox, badge appear |
| `CarlibMotion.durationNormal` | 0.25s | Standard transitions: sheet present, screen push |
| `CarlibMotion.durationSlow` | 0.40s | Complex animations: status stepper advance, map zoom |
| `CarlibMotion.durationEmphasis` | 0.60s | Celebration: success confirmation, completion animation |

#### Curve Presets (as `Animation` values)

| Swift Property | Curve | Usage |
|---|---|---|
| `CarlibMotion.standard` | `.easeInOut(duration: 0.25)` | Most transitions |
| `CarlibMotion.decelerate` | `.easeOut(duration: 0.25)` | Elements entering screen (bottom sheet appearing) |
| `CarlibMotion.accelerate` | `.easeIn(duration: 0.20)` | Elements leaving screen (sheet dismissal) |
| `CarlibMotion.spring` | `.spring(response: 0.35, dampingFraction: 0.8)` | Interactive elements: button press, pin bounce |
| `CarlibMotion.springGentle` | `.spring(response: 0.5, dampingFraction: 0.75)` | Larger movements: sheet drag, card expand |

#### Reduce Motion Handling

A property wrapper `@CarlibReduceMotion` (built on `@Environment(\.accessibilityReduceMotion)`) that components use to conditionally replace animations with instant state changes. When reduce motion is on:
- All `withAnimation` calls use `.linear(duration: 0)` (instant)
- Parallax effects are disabled
- Map auto-zoom completes instantly
- Progress stepper advance is instant with no sliding
- Status timeline entries appear without animation

### 1.8 Theme Propagation via Environment

The entire token system is injected into the SwiftUI view hierarchy via a custom `EnvironmentKey`:

```
CarlibTheme (stored in @Environment)
  .colorScheme   — light / dark
  .role          — .driver / .garage
  .typography    — the font token set
  .spacing       — the spacing token set
```

**Why Environment over singleton:** Environment allows previews to override tokens, enables per-view theming in Xcode previews, and follows Apple's recommended SwiftUI pattern. It also enables future role-based theming without refactoring.

**Implementation:** A `CarlibTheme` struct conforming to `EnvironmentKey` is set at the app root via `.environment(\.carlibTheme, theme)`. All components read tokens from the environment, not from static globals.

---

## 2. Component Inventory

### 2.0 File Organization

```
DesignSystem/
  Tokens/
    CarlibPalette.swift
    CarlibColors.swift          (Color extension — semantic tokens)
    CarlibTypography.swift      (Font extension — semantic tokens)
    CarlibSpacing.swift
    CarlibRadius.swift
    CarlibElevation.swift
    CarlibMotion.swift
    CarlibTheme.swift           (Environment key + theme struct)
  Foundation/
    CarlibButton.swift
    CarlibIcon.swift
    CarlibText.swift            (Typography wrapper)
    CarlibSurface.swift         (Card/surface container)
    CarlibAvatar.swift
    CarlibDivider.swift
    CarlibSkeleton.swift
  Input/
    CarlibTextField.swift
    CarlibTextArea.swift
    CarlibSelect.swift
    CarlibDatePicker.swift
    CarlibTimeSlotPicker.swift
    CarlibCheckbox.swift
    CarlibRadioGroup.swift
    CarlibToggle.swift
    CarlibSearchInput.swift
    CarlibPhoneInput.swift
    CarlibLicensePlateInput.swift
    CarlibPhotoCapture.swift
    CarlibLocationInput.swift
    CarlibFormGroup.swift
    CarlibFilterChipGroup.swift
  Navigation/
    CarlibTabBar.swift
    CarlibTopBar.swift
    CarlibBackCloseHeader.swift
    CarlibBottomSheet.swift
    CarlibSegmentedTab.swift
  DataDisplay/
    CarlibGarageCard.swift
    CarlibClaimCard.swift
    CarlibVehicleInfoCard.swift
    CarlibBookingCard.swift
    CarlibStatCard.swift
    CarlibProfileCard.swift
    CarlibEmptyState.swift
    CarlibErrorState.swift
    CarlibLoadingState.swift
    CarlibListItem.swift
    CarlibImageGallery.swift
  StatusFeedback/
    CarlibStatusBadge.swift
    CarlibProgressStepper.swift
    CarlibStatusTimeline.swift
    CarlibToast.swift
    CarlibInlineAlert.swift
    CarlibProgressBar.swift
    CarlibNotificationBadge.swift
  Map/
    CarlibMapView.swift
    CarlibGarageMarker.swift
    CarlibUserMarker.swift
    CarlibMapCallout.swift
    CarlibMapListToggle.swift
  Calendar/
    CarlibCalendarGrid.swift
    CarlibTimeSlotGrid.swift
    CarlibAvailabilityRow.swift
    CarlibBookingSummary.swift
    CarlibWeekStrip.swift
  Media/
    CarlibCameraOverlay.swift
    CarlibPhotoThumbnail.swift
    CarlibPhotoGuide.swift
    CarlibImageViewer.swift
  Communication/
    CarlibChatBubble.swift
    CarlibNotificationCard.swift
    CarlibNotificationList.swift
  Onboarding/
    CarlibSplashScreen.swift
    CarlibOnboardingCarousel.swift
    CarlibLoginForm.swift
    CarlibRegistrationForm.swift
    CarlibRoleSelector.swift
  Modal/
    CarlibDialog.swift
    CarlibActionSheet.swift
    CarlibFullScreenModal.swift
```

### 2.1 Foundation Components

These are the atomic primitives. Every other component in the system is composed from these.

#### F01 — CarlibButton

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Custom View wrapping `Button` |
| **Variants** | `.primary`, `.secondary`, `.ghost`, `.destructive`, `.iconOnly` |
| **Sizes** | `.large` (52pt height), `.medium` (44pt height), `.small` (36pt height) |
| **States** | default, pressed (via `ButtonStyle`), disabled (`.opacity(0.4)` + non-interactive), loading (spinner replaces label) |
| **Content** | Text label (required for non-icon-only), optional leading icon, optional trailing icon |
| **Accessibility** | `accessibilityLabel` derived from text or explicitly provided for icon-only. Button role automatic. Loading state announced via `accessibilityValue("Chargement en cours")` |
| **Tokens consumed** | `carlibPrimary` / `carlibError` for bg, `carlibTextInverse` for text, `carlibRadius.md`, `carlibLabelLarge` for font, `CarlibMotion.spring` for press animation |

#### F02 — CarlibIcon

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `Image(systemName:)` from SF Symbols |
| **Sizes** | `.small` (16pt), `.medium` (20pt), `.large` (24pt), `.xlarge` (32pt) |
| **Styles** | `.filled`, `.outlined` (SF Symbols fill/regular variants) |
| **Color** | Inherits from `.foregroundStyle()` context — no hardcoded color |
| **Domain icons** | SF Symbols covers most needs: `car.fill`, `wrench.and.screwdriver`, `camera.fill`, `mappin.circle`, `calendar`, `clock`, `checkmark.circle.fill`, `xmark.circle.fill`, `bell.fill`, `person.fill`, `photo.on.rectangle`. Where SF Symbols lacks domain-specific icons (e.g., body damage areas), custom symbols are added to the asset catalog following the SF Symbols template grid |
| **Accessibility** | Decorative icons get `accessibilityHidden(true)`. Informational icons get explicit `accessibilityLabel` in French |

#### F03 — CarlibText

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `Text` with font token applied |
| **Purpose** | Convenience wrapper ensuring all text uses semantic typography tokens. Prevents raw `Font.system()` calls in feature code |
| **API** | `CarlibText("Declarer un sinistre", style: .h1)` — style enum maps to `Font.carlibH1`, `Font.carlibBodyMedium`, etc. |
| **Color** | Defaults to `Color.carlibTextPrimary`, overridable via `.foregroundStyle()` |
| **Accessibility** | Inherits Dynamic Type support from underlying font tokens. Does not truncate by default. |

#### F04 — CarlibSurface

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Custom View applying background + corner radius + shadow |
| **Variants** | `.flat` (border, no shadow), `.elevated` (shadow, no border), `.muted` (gray background, no border) |
| **Elevation levels** | `.none`, `.sm`, `.md`, `.lg` — maps to `CarlibElevation` |
| **Corner radius** | Default `CarlibRadius.md` (12pt), configurable |
| **Content** | Generic `@ViewBuilder` body — surface is a container, not a specific card |
| **Tap handling** | Optional `onTap` closure that adds press animation and accessible button role |

#### F05 — CarlibAvatar

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `AsyncImage` (for remote URLs) clipped to circle, with fallback initial text |
| **Sizes** | `.xs` (24pt), `.sm` (32pt), `.md` (40pt), `.lg` (56pt), `.xl` (80pt) |
| **Content** | Image URL, initials fallback (first letter of name on `carlibPrimarySubtle` background), placeholder SF Symbol (`person.fill`) |
| **States** | loading (skeleton shimmer), loaded (image), error (initials fallback) |

#### F06 — CarlibDivider

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `Rectangle` with 1pt height |
| **Variants** | `.fullBleed` (edge-to-edge), `.inset` (with horizontal padding) |
| **Color** | `Color.carlibBorderDefault` |

#### F07 — CarlibSkeleton

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Custom View with shimmer animation |
| **Shapes** | `.text(lines:)`, `.circle(diameter:)`, `.rectangle(width:height:)`, `.card`, `.listItem` |
| **Animation** | Linear gradient sweep using `CarlibMotion.durationSlow`, repeating. Disabled when reduce motion is on (shows static gray instead). |
| **Color** | `Color.carlibSurfaceMuted` base with `Color.carlibBorderDefault` highlight sweep |

### 2.2 Input and Form Components

#### I01 — CarlibTextField

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `TextField` / `SecureField` wrapped in form group layout |
| **Variants** | default, with prefix icon, with suffix icon, with character count, password (secure) |
| **States** | empty (placeholder), filled, focused (blue border via `@FocusState`), error (red border + error message), disabled (reduced opacity, non-interactive), read-only |
| **Tokens** | `inputHeight` (48pt), `carlibRadius.sm`, `carlibBorderDefault` (default) / `carlibBorderFocus` (focused) / `carlibError` (error), `carlibBodyLarge` for input text, `carlibLabelMedium` for label, `carlibBodySmall` for helper/error text |
| **Accessibility** | Label is always visible (never placeholder-only). Error text is connected via `accessibilityHint`. Focus state is managed via `@FocusState` with `accessibilityFocused` for programmatic focus |

#### I02 — CarlibTextArea

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `TextEditor` wrapped with CarlibTextField styling |
| **Features** | Auto-grow up to max height, character count display, min 3 lines |
| **States** | Same as CarlibTextField |

#### I03 — CarlibSelect

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Button triggering a bottom sheet with option list |
| **Variants** | single-select, searchable (with CarlibSearchInput in sheet header) |
| **States** | unselected (placeholder), selected (value displayed), disabled |
| **Pattern** | Displays selected value in a CarlibTextField-styled container. Tap opens CarlibBottomSheet with scrollable options list. Selected option has checkmark. |
| **Accessibility** | Announced as "menu contextuel" with selected value. Options list in sheet uses `accessibilityAddTraits(.isSelected)` for current selection |

#### I04 — CarlibDatePicker

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Custom calendar view (not native `DatePicker` — needs custom styling) |
| **Variants** | calendar month view, inline compact, bottom sheet presentation |
| **Features** | Disabled dates (past, unavailable), today indicator, range selection (for garage availability) |
| **Tokens** | `carlibPrimary` for selected date, `carlibSurfaceMuted` for disabled dates, `carlibStatusCompleted` for available dates |

#### I05 — CarlibTimeSlotPicker

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `LazyVGrid` of tappable time slot chips |
| **States per slot** | available (tappable, primary border), unavailable (grayed, non-tappable), selected (primary fill + white text), booked (blue fill, for garage view) |
| **Layout** | 2-column or 3-column grid depending on slot count. Grouped by morning/afternoon with section headers |

#### I06 — CarlibCheckbox

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Custom `Toggle` with checkbox style via `ToggleStyle` |
| **States** | unchecked, checked (checkmark icon on primary bg), disabled |
| **Size** | 24pt box, 44pt minimum touch target |

#### I07 — CarlibRadioGroup

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `Picker` with custom segment style, or VStack of custom radio items |
| **Variants** | vertical list (default), horizontal chips |
| **States per option** | unselected, selected (primary ring + dot), disabled |

#### I08 — CarlibToggle

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Native `Toggle` with custom `ToggleStyle` matching design system colors |
| **Colors** | On: `carlibPrimary`, Off: `carlibBorderDefault` |
| **Accessibility** | Native Toggle accessibility is preserved |

#### I09 — CarlibSearchInput

| Attribute | Specification |
|---|---|
| **SwiftUI base** | CarlibTextField with search icon prefix, clear button suffix |
| **Features** | Debounced input (300ms), clear button when text exists, cancel button that dismisses keyboard |
| **States** | empty, active (typing), results available, no results |

#### I10 — CarlibPhoneInput

| Attribute | Specification |
|---|---|
| **SwiftUI base** | CarlibTextField with `.keyboardType(.phonePad)` and French format mask |
| **Format** | `+33 6 XX XX XX XX` — auto-formats as user types |
| **Validation** | French mobile (06/07) and landline patterns |

#### I11 — CarlibLicensePlateInput

| Attribute | Specification |
|---|---|
| **SwiftUI base** | CarlibTextField with `.textInputAutocapitalization(.characters)` and format mask |
| **Format** | `AA-123-AA` French SIV format with auto-hyphenation |
| **Visual** | Styled to resemble a French license plate (blue EU strip on left) |

#### I12 — CarlibPhotoCapture

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Button triggering camera (via `UIImagePickerController` wrapped in `UIViewControllerRepresentable`) or photo library picker (via `PhotosPicker` from PhotosUI) |
| **Layout** | Grid of photo thumbnail slots + "add photo" button |
| **Features** | Multiple photo support, per-photo delete, per-photo upload progress, required vs optional photos indicated |
| **States** | empty (add CTA), capturing (camera active), uploading (progress ring), complete (thumbnail), error (retry) |

#### I13 — CarlibLocationInput

| Attribute | Specification |
|---|---|
| **SwiftUI base** | CarlibTextField with location icon + map preview |
| **Features** | "Utiliser ma position actuelle" button (CoreLocation), address text input with autocomplete (MapKit `MKLocalSearchCompleter`), bidirectional sync with map pin |
| **States** | empty, detecting location (spinner), location set (address + mini map), manual entry |

#### I14 — CarlibFormGroup

| Attribute | Specification |
|---|---|
| **SwiftUI base** | VStack container |
| **Content** | Label (CarlibText .labelMedium), input (any input component via `@ViewBuilder`), helper text (optional, `.carlibTextSecondary`), error text (optional, `.carlibError`) |
| **Spacing** | 4pt between label and input, 4pt between input and helper/error |

#### I15 — CarlibFilterChipGroup

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Horizontal `ScrollView` with `LazyHStack` of chip buttons |
| **Variants** | single-select (one active at a time), multi-select (toggle each independently) |
| **Chip states** | inactive (outline style), active (primary fill), with count badge |
| **Sizing** | Auto-width per text content, minimum 44pt height |

### 2.3 Navigation Components

#### N01 — CarlibTabBar

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `TabView` with custom `tabViewStyle` or custom bottom bar |
| **Tabs (Driver)** | Accueil, Declarer, Suivi, Profil — 4 tabs |
| **Tabs (Garage)** | Tableau de bord, Sinistres, Planning, Profil — 4 tabs |
| **Tab anatomy** | SF Symbol icon (24pt) + French label below (CarlibText .caption) |
| **States** | active (primary color, filled icon), inactive (gray.400, outlined icon) |
| **Notification badge** | CarlibNotificationBadge overlaid on icon (count or dot) |
| **Height** | 56pt content + safe area inset bottom |

#### N02 — CarlibTopBar

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Custom View (not relying on NavigationBar customization — too fragile). Placed in view body. |
| **Variants** | standard (title + optional right action), large (collapsible title, scrolls away), search (inline search field) |
| **Content** | Title (CarlibText .h2 or .h1 for large), optional leading icon (back/menu), optional trailing icon(s) (notification bell, filter) |
| **Height** | 56pt |

#### N03 — CarlibBackCloseHeader

| Attribute | Specification |
|---|---|
| **SwiftUI base** | HStack with back/close button + title |
| **Variants** | back arrow (for pushed screens), close X (for modals/sheets) |
| **Right action** | Optional trailing button (e.g., "Sauvegarder") |
| **Accessibility** | Back button: "Retour". Close button: "Fermer". Announced with screen title. |

#### N04 — CarlibBottomSheet

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `.sheet()` with `presentationDetents([.medium, .large])` and `presentationDragIndicator(.visible)` (iOS 16+). For peek state: custom presentation detent at fractional height. |
| **Detents** | `.peek` (compact preview, ~200pt), `.half` (scrollable list), `.full` (nearly full screen) |
| **Content** | Drag handle at top, optional sticky header, scrollable body, optional sticky footer with CTA |
| **Corner radius** | `CarlibRadius.lg` on top corners |
| **Elevation** | `CarlibElevation.lg` |

#### N05 — CarlibSegmentedTab

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Custom segmented control (not native Picker — needs custom styling) |
| **Variants** | underline style (for page-level tabs), pill style (for inline toggles) |
| **Count** | 2-4 segments |
| **States** | selected (primary underline or filled pill), unselected (gray text) |
| **Animation** | Sliding indicator animation using `matchedGeometryEffect` |

### 2.4 Data Display Components

#### D01 — CarlibGarageCard

| Attribute | Specification |
|---|---|
| **SwiftUI base** | CarlibSurface containing structured content |
| **Variants** | compact (in search list — 80pt height), expanded (in detail sheet) |
| **Content** | Leading: garage photo thumbnail (CarlibAvatar or image). Title: garage name (CarlibText .h3). Subtitle: distance + specialties. Trailing: availability badge (CarlibStatusBadge) + chevron |
| **States** | default, pressed (scale animation), loading (CarlibSkeleton .listItem) |
| **Accessibility** | Entire card is a single button with combined label: "{name}, {distance}, {availability}" |

#### D02 — CarlibClaimCard

| Attribute | Specification |
|---|---|
| **SwiftUI base** | CarlibSurface with structured content |
| **Variants** | driver view (status + vehicle + date), garage view (status + vehicle + distance + accept/refuse CTA) |
| **Content** | Leading: status dot or vehicle photo. Title: "Sinistre #{id}" or vehicle description. Metadata: date, location. Trailing: CarlibStatusBadge |
| **States** | default, pressed, loading (skeleton) |

#### D03 — CarlibVehicleInfoCard

| Attribute | Specification |
|---|---|
| **SwiftUI base** | CarlibSurface |
| **Content** | License plate display (styled like French plate), make/model, photo thumbnail if available |
| **Variants** | read-only (display), editable (with edit button leading to form) |

#### D04 — CarlibBookingCard

| Attribute | Specification |
|---|---|
| **SwiftUI base** | CarlibSurface |
| **Content** | Date + time (large, prominent), garage name, address, mini map preview, status badge, dossier reference number |
| **Variants** | upcoming (primary accent), past (muted), cancelled (error accent) |

#### D05 — CarlibStatCard (Garage only)

| Attribute | Specification |
|---|---|
| **SwiftUI base** | CarlibSurface |
| **Content** | Large number (CarlibText .display or .h1), label text, optional trend indicator (arrow up/down with color) |
| **Usage** | Garage dashboard — active dossiers count, completed this week, average time |

#### D06 — CarlibProfileCard

| Attribute | Specification |
|---|---|
| **SwiftUI base** | VStack with CarlibAvatar + name + contact info |
| **Variants** | compact (in lists), expanded (profile screen header) |
| **Actions** | Call, message, edit buttons |

#### D07 — CarlibEmptyState

| Attribute | Specification |
|---|---|
| **SwiftUI base** | VStack centered in parent |
| **Content** | SF Symbol icon (large, 64pt, `carlibTextTertiary`), title (CarlibText .h3), description (CarlibText .bodyMedium, .carlibTextSecondary), optional CTA button (CarlibButton .primary) |
| **Examples** | "Aucun sinistre en cours" (driver home), "Aucun garage dans cette zone" (search), "Aucune notification" (notification center) |
| **Accessibility** | Entire block is a single group. CTA button is the focus target. |

#### D08 — CarlibErrorState

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Same layout as CarlibEmptyState |
| **Content** | Error icon (exclamationmark.triangle, `carlibError`), title, error description, "Reessayer" retry button |
| **Variants** | network error, server error, permission denied, resource not found |

#### D09 — CarlibLoadingState

| Attribute | Specification |
|---|---|
| **SwiftUI base** | ProgressView or CarlibSkeleton |
| **Variants** | full screen (centered spinner + "Chargement..." label), inline skeleton (per-content-type shimmer placeholders), pull-to-refresh (built into ScrollView via `.refreshable`) |

#### D10 — CarlibListItem

| Attribute | Specification |
|---|---|
| **SwiftUI base** | HStack within a Button |
| **Variants** | single-line (title only), two-line (title + subtitle), three-line (title + subtitle + metadata) |
| **Leading** | Optional: icon, avatar, status dot, thumbnail |
| **Trailing** | Optional: chevron, toggle, badge, metadata text |
| **States** | default, pressed (background highlight), selected (checkmark) |
| **Height** | Auto-sized, minimum 44pt (touch target) |
| **Divider** | Optional CarlibDivider below, inset |

#### D11 — CarlibImageGallery

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `ScrollView(.horizontal)` with `LazyHStack` of thumbnails, or `LazyVGrid` for grid layout |
| **Variants** | horizontal scroll (inline preview), grid (2-3 columns, photo management) |
| **Tap behavior** | Opens CarlibImageViewer (full-screen swipeable gallery) |
| **States** | loading (skeleton thumbnails), loaded, empty (CarlibEmptyState "Aucune photo") |

### 2.5 Status and Feedback Components

#### S01 — CarlibStatusBadge

| Attribute | Specification |
|---|---|
| **SwiftUI base** | HStack with dot + text in rounded container |
| **Sizes** | `.small` (20pt height), `.medium` (28pt height) |
| **Variants** | `.filled` (colored background + white text), `.outlined` (colored border + colored text), `.dotOnly` (just the colored dot, no text) |
| **Status mapping** | Takes a `CarlibStatus` enum value — color, icon, and French label are all derived from the enum. See Section 6 for the complete mapping. |
| **Accessibility** | Announced as "Statut: {label}". Color is never the sole indicator — always has text label. |

#### S02 — CarlibProgressStepper

| Attribute | Specification |
|---|---|
| **SwiftUI base** | HStack of step indicators connected by lines |
| **Orientation** | horizontal (for declaration flow, fits 4 steps) |
| **Step states** | completed (checkmark, `carlibStatusCompleted`), current (filled dot, `carlibPrimary`, pulsing glow when reduce motion is off), upcoming (empty circle, `carlibBorderDefault`), error (X mark, `carlibError`) |
| **Step count** | 2-5 steps. Labels appear below each step (CarlibText .caption). |
| **Animation** | Step completion animates the checkmark and slides the connector fill. Disabled under reduce motion. |
| **Accessibility** | Each step is announced: "Etape {n} sur {total}: {label}, {state}". The component is grouped as a single progressbar role. |

#### S03 — CarlibStatusTimeline

| Attribute | Specification |
|---|---|
| **SwiftUI base** | VStack of timeline entries connected by vertical lines |
| **Entry anatomy** | Leading: icon (checkmark for done, pulsing dot for current, empty dot for upcoming). Center: label + optional description. Trailing: timestamp. |
| **States per entry** | completed, current (highlighted, pulsing dot), upcoming (muted), error |
| **Orientation** | vertical only (horizontal does not fit content) |
| **Animation** | New entry animates in from bottom when status updates arrive. Disabled under reduce motion. |
| **Accessibility** | Each entry is announced in sequence. Current step is announced with "Etape actuelle". |

#### S04 — CarlibToast

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Overlay view presented from top or bottom of screen |
| **Variants** | `.success` (green), `.error` (red), `.warning` (amber), `.info` (blue) |
| **Content** | Icon + message text. Optional action button (e.g., "Annuler"). |
| **Behavior** | Auto-dismiss after 4 seconds. Swipe to dismiss. Action button prevents auto-dismiss. |
| **Accessibility** | Uses `AccessibilityNotification.Announcement` to announce the message. Respects `accessibilityReduceMotion` for entry animation. |
| **Implementation** | Global toast manager as an `@Observable` object in the Environment, presenting toasts via an overlay at the root view level. |

#### S05 — CarlibInlineAlert

| Attribute | Specification |
|---|---|
| **SwiftUI base** | HStack with icon + text in colored surface |
| **Variants** | `.info`, `.success`, `.warning`, `.error` |
| **Content** | Icon (auto from variant), title (optional), message, optional action link |
| **Dismissible** | Optional close button |
| **Tokens** | Background: `carlibInfoSubtle`/`carlibSuccessSubtle`/etc. Text: corresponding strong color. Radius: `carlibRadius.sm` |

#### S06 — CarlibProgressBar

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `GeometryReader` based bar |
| **Variants** | determinate (with percentage), indeterminate (sliding animation) |
| **Tokens** | Track: `carlibSurfaceMuted`. Fill: `carlibPrimary`. Height: 4pt. Radius: `carlibRadius.full` |

#### S07 — CarlibNotificationBadge

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `overlay` modifier on target view |
| **Variants** | dot (boolean, 8pt red circle), count (numeric, minimum 16pt pill with white number) |
| **Position** | Top-trailing corner of parent, with slight offset |
| **Accessibility** | Count: "{n} notifications non lues". Dot: "Nouvelle notification". |

### 2.6 Map Components

All map components use MapKit's native SwiftUI `Map` view (available from iOS 17). No external map SDK needed.

#### M01 — CarlibMapView

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `Map` with `MapContentBuilder` |
| **Features** | User location tracking (`.userLocation` annotation), custom camera position, zoom controls |
| **Configuration** | Standard map style (not satellite). Optionally filtered to show relevant area only. |
| **Interaction** | Pan, pinch-to-zoom, double-tap zoom — all native MapKit gestures |

#### M02 — CarlibGarageMarker

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `Annotation` within Map content |
| **Variants** | default (wrench icon in colored circle), selected (larger, primary color, raised), clustered (circle with count number) |
| **Color coding** | Available soon: `carlibStatusCompleted` (green). Limited: `carlibStatusPending` (amber). Unavailable: `carlibTextTertiary` (gray). |
| **Tap** | Selects marker, triggers callout or bottom sheet expansion |
| **Size** | 32pt default, 40pt selected. Minimum 44pt touch target via transparent hit area. |

#### M03 — CarlibUserMarker

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `MapUserLocationButton` or custom annotation |
| **Visual** | Blue pulsing dot with accuracy circle (standard iOS behavior) |

#### M04 — CarlibMapCallout

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Custom view presented as overlay near selected marker |
| **Content** | Garage name, distance, availability indicator, "Voir" CTA |
| **Behavior** | Appears on marker tap, dismissed on map tap elsewhere |
| **Sizing** | Compact card, maximum 200pt wide |

#### M05 — CarlibMapListToggle

| Attribute | Specification |
|---|---|
| **SwiftUI base** | CarlibSegmentedTab with two segments: "Carte" / "Liste" |
| **Position** | Top of search results area, above map or list |
| **Animation** | Crossfade between map and list views |

### 2.7 Calendar and Scheduling Components

#### C01 — CarlibCalendarGrid

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Custom `LazyVGrid` (7 columns for days of week) |
| **Variants** | month view (standard calendar), week view (single row) |
| **Day cell states** | normal (tappable), selected (primary circle), today (primary outline), disabled (past/unavailable, gray, non-tappable), has-availability (green dot), booked (blue dot) |
| **Navigation** | Left/right arrows or swipe to change month/week |
| **First day of week** | Monday (French convention) |
| **Locale** | French month names, day abbreviations (Lun, Mar, Mer, Jeu, Ven, Sam, Dim) |

#### C02 — CarlibTimeSlotGrid

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `LazyVGrid` (2 or 3 columns) |
| **Slot states** | available (primary border, tappable), booked (blue fill, shows driver name for garage view), blocked (gray hatched, non-tappable), selected (primary fill, white text) |
| **Grouping** | Morning (before 12:00) / Afternoon (12:00-18:00) section headers |
| **Time format** | 24h format per French convention (09:00, 14:30) |

#### C03 — CarlibAvailabilityRow (Garage only)

| Attribute | Specification |
|---|---|
| **SwiftUI base** | HStack: day label + CarlibToggle + time range display |
| **Usage** | Garage sets recurring weekly availability. Each row = one day. |
| **Interaction** | Toggle on/off, tap time range to edit start/end time |

#### C04 — CarlibBookingSummary

| Attribute | Specification |
|---|---|
| **SwiftUI base** | CarlibSurface with structured booking details |
| **Content** | Date (prominent), time, garage name, garage address, mini map, dossier reference |
| **Actions** | "Confirmer la reservation" CTA, "Modifier" secondary button |
| **Variants** | confirmation (before confirm), confirmed (after confirm, with checkmark), cancelled |

#### C05 — CarlibWeekStrip

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Horizontal `ScrollView` with day pills |
| **Day pill** | Day abbreviation + date number. Today highlighted. Selected has primary background. |
| **Navigation** | Swipe horizontal, arrows for prev/next week |

### 2.8 Media Components

#### P01 — CarlibCameraOverlay

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `ZStack` overlay on camera preview (`UIViewControllerRepresentable` wrapping `AVCaptureSession`) |
| **Content** | Semi-transparent guide frame showing which photo angle is needed (text label: "Photo avant du vehicule"), capture button (large, 72pt, white circle), flash toggle, gallery import button, photo counter ("3/5") |
| **Guide frames** | Silhouette outlines for: front, rear, left side, right side, damage close-up |
| **Stress UX** | Oversized capture button, high contrast text, no complex gestures required |
| **Accessibility** | VoiceOver announces current guide: "Prenez une photo de l'avant du vehicule. Photo 2 sur 5." Capture button: "Prendre la photo." |

#### P02 — CarlibPhotoThumbnail

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `AsyncImage` clipped to rounded rectangle |
| **Size** | 72pt x 72pt (in grid), 48pt x 48pt (in inline strip) |
| **Overlays** | Delete X button (top-right), upload progress ring (center), error retry icon (center), checkmark (completed) |
| **States** | uploading, uploaded, error, placeholder (empty slot with + icon) |

#### P03 — CarlibPhotoGuide

| Attribute | Specification |
|---|---|
| **SwiftUI base** | VStack or horizontal strip of required photo types |
| **Content** | Per-angle: icon + label + status (pending/captured). E.g., "Avant" with car-front icon, green checkmark when captured |
| **Usage** | Shown before and during photo capture in declaration Step 2 |

#### P04 — CarlibImageViewer

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Full-screen modal with `TabView(.page)` for swipe between images |
| **Gestures** | Swipe left/right (next/prev), pinch-to-zoom (`MagnifyGesture`), double-tap toggle zoom, drag to dismiss (pull down) |
| **Chrome** | Close button (top-left), image counter ("2/5", top-center), share button (top-right). Auto-hides on tap, shows on tap. |
| **Background** | Solid black |

### 2.9 Communication Components

#### CM01 — CarlibChatBubble (Should-have, V1)

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Custom shaped View with directional tail |
| **Variants** | sent (right-aligned, primary bg), received (left-aligned, muted bg), system (centered, no bubble) |

#### CM02 — CarlibNotificationCard

| Attribute | Specification |
|---|---|
| **SwiftUI base** | CarlibListItem with notification-specific content |
| **Content** | Type icon (color-coded), title, body (2-line max), relative timestamp ("Il y a 2h"), unread dot |
| **Interaction** | Tap navigates to relevant screen (deep link). Swipe left to archive. |
| **States** | unread (bold title, dot), read (normal weight, no dot) |

#### CM03 — CarlibNotificationList

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `List` grouped by date section ("Aujourd'hui", "Hier", date) |
| **Header** | CarlibTopBar with "Notifications" title + "Tout marquer comme lu" action |
| **Empty** | CarlibEmptyState "Aucune notification" |

### 2.10 Onboarding and Auth Components

#### O01 — CarlibSplashScreen

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Full-screen view with logo/wordmark + subtle loading indicator |
| **Duration** | Displayed while app initializes + auth check. Minimum 1.5s to avoid flash. |
| **Background** | `carlibPrimary` or white — depends on brand direction |

#### O02 — CarlibOnboardingCarousel (Should-have)

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `TabView(.page)` with dot indicators |
| **Slides** | 3 max: value proposition, how it works, CTA to get started |
| **Actions** | "Passer" (skip) top-right, "Suivant" / "Commencer" bottom |

#### O03 — CarlibLoginForm

| Attribute | Specification |
|---|---|
| **SwiftUI base** | VStack of CarlibFormGroups |
| **Fields** | Email/phone (CarlibTextField), password (CarlibTextField secure), "Mot de passe oublie?" link |
| **CTA** | "Se connecter" CarlibButton .primary, full width |
| **States** | idle, loading (button spinner), error (inline alert for wrong credentials) |

#### O04 — CarlibRegistrationForm

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Multi-step form with CarlibProgressStepper |
| **Steps** | Step 1: role selection (CarlibRoleSelector). Step 2: personal info. Step 3: role-specific info (vehicle for driver, garage info for carrossier). |
| **Persistence** | Draft saved locally between steps (SwiftData) |

#### O05 — CarlibRoleSelector

| Attribute | Specification |
|---|---|
| **SwiftUI base** | VStack or HStack of two large tappable cards |
| **Options** | "Je suis conducteur" (car icon + description), "Je suis carrossier" (wrench icon + description) |
| **Visual** | Large cards (minimum 120pt height), illustration/icon, title, short description |
| **Selection** | Primary border + checkmark on selected card, scale animation |
| **Accessibility** | RadioGroup semantics — one of two options |

### 2.11 Modal and Overlay Components

#### MO01 — CarlibDialog

| Attribute | Specification |
|---|---|
| **SwiftUI base** | Custom `.overlay()` with dimmed background (not native `.alert()` — needs custom styling) |
| **Variants** | confirmation ("Confirmer la reservation?"), destructive ("Annuler le sinistre?"), info |
| **Content** | Title, body text, primary CTA, secondary CTA (optional) |
| **Behavior** | Dimmed background, tap outside to dismiss (unless destructive), focus trapped |
| **Accessibility** | `accessibilityAddTraits(.isModal)`. Focus moves to dialog on appear, returns to trigger on dismiss. |

#### MO02 — CarlibActionSheet

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `.confirmationDialog()` (native iOS action sheet) |
| **Content** | List of actions + "Annuler" cancel button |
| **Usage** | Context menus, photo source selection ("Appareil photo" / "Bibliotheque") |

#### MO03 — CarlibFullScreenModal

| Attribute | Specification |
|---|---|
| **SwiftUI base** | `.fullScreenCover()` |
| **Content** | CarlibBackCloseHeader (close X) + scrollable body + optional sticky footer CTA |
| **Usage** | Claim detail view, photo viewer, complex forms |

---

## 3. Component Hierarchy and Dependencies

### 3.1 Dependency Tree

```
Level 0 — Tokens (no dependencies)
  CarlibPalette, CarlibColors, CarlibTypography, CarlibSpacing, CarlibRadius,
  CarlibElevation, CarlibMotion, CarlibTheme

Level 1 — Foundation Primitives (depend only on tokens)
  CarlibButton, CarlibIcon, CarlibText, CarlibSurface, CarlibAvatar,
  CarlibDivider, CarlibSkeleton

Level 2 — Basic Composites (depend on Level 0 + Level 1)
  CarlibTextField, CarlibTextArea, CarlibCheckbox, CarlibRadioGroup,
  CarlibToggle, CarlibSearchInput, CarlibFormGroup, CarlibListItem,
  CarlibStatusBadge, CarlibNotificationBadge, CarlibDivider,
  CarlibProgressBar, CarlibInlineAlert, CarlibSegmentedTab,
  CarlibBackCloseHeader, CarlibTopBar

Level 3 — Complex Composites (depend on Level 0 + 1 + 2)
  CarlibSelect (TextField + BottomSheet + ListItem)
  CarlibPhoneInput (TextField + format logic)
  CarlibLicensePlateInput (TextField + format logic)
  CarlibFilterChipGroup (Button + ScrollView)
  CarlibBottomSheet (BackCloseHeader + Surface + content slot)
  CarlibDialog (Surface + Button + Text)
  CarlibToast (Surface + Icon + Text + animation)
  CarlibEmptyState (Icon + Text + Button)
  CarlibErrorState (Icon + Text + Button)
  CarlibLoadingState (Skeleton or ProgressView)
  CarlibPhotoThumbnail (AsyncImage + overlay icons)
  CarlibProgressStepper (Icon + Text + connector lines)
  CarlibCalendarGrid (Text + Button per day cell)
  CarlibTimeSlotPicker (Button grid)
  CarlibWeekStrip (Button strip in ScrollView)

Level 4 — Feature Composites (depend on Level 0-3)
  CarlibTabBar (Icon + Text + NotificationBadge)
  CarlibGarageCard (Surface + Avatar + Text + StatusBadge)
  CarlibClaimCard (Surface + Text + StatusBadge + PhotoThumbnail)
  CarlibVehicleInfoCard (Surface + Text + LicensePlateInput display)
  CarlibBookingCard (Surface + Text + StatusBadge)
  CarlibStatCard (Surface + Text)
  CarlibProfileCard (Avatar + Text + Button)
  CarlibStatusTimeline (StatusBadge + Text + Icon + connector lines)
  CarlibNotificationCard (ListItem + StatusBadge + timestamp)
  CarlibNotificationList (List + NotificationCard + EmptyState)
  CarlibImageGallery (ScrollView + PhotoThumbnail)
  CarlibPhotoGuide (Icon + Text + StatusBadge per angle)
  CarlibAvailabilityRow (Toggle + Text + TimePicker)
  CarlibBookingSummary (Surface + Text + Button + mini map)
  CarlibTimeSlotGrid (TimeSlotPicker + section headers)
  CarlibMapCallout (Surface + Text + Button)
  CarlibMapListToggle (SegmentedTab)

Level 5 — Screen-Level Composites (depend on Level 0-4)
  CarlibMapView (Map + GarageMarker + UserMarker + MapCallout)
  CarlibCameraOverlay (Camera preview + guide frame + PhotoThumbnail strip)
  CarlibImageViewer (TabView + gesture handlers)
  CarlibPhotoCapture (PhotoThumbnail grid + CameraOverlay trigger)
  CarlibLocationInput (TextField + MapView mini + CoreLocation)
  CarlibDatePicker (CalendarGrid + BottomSheet)
  CarlibLoginForm (FormGroup + TextField + Button)
  CarlibRegistrationForm (ProgressStepper + FormGroups + RoleSelector)
  CarlibRoleSelector (Surface + Icon + Text + RadioGroup semantics)
  CarlibSplashScreen (Image/Text + loading indicator)
  CarlibOnboardingCarousel (TabView + Text + Button)
  CarlibFullScreenModal (BackCloseHeader + scrollable content + footer)
  CarlibActionSheet (native confirmationDialog)
```

### 3.2 Build Order

Components must be built bottom-up through the dependency tree. The exact implementation order within each level is flexible, but no component at Level N should be started before its dependencies at Level N-1 are complete.

```
Week 1:   Level 0 (Tokens)           → Level 1 (Foundation)
Week 2:   Level 2 (Basic composites)
Week 3:   Level 3 (Complex composites)
Week 4:   Level 4 (Feature composites)
Week 5+:  Level 5 (Screen-level composites)
```

---

## 4. State Management Architecture

### 4.1 Overview

The state architecture follows Apple's recommended SwiftUI patterns for iOS 26, using `@Observable` (Observation framework) over `ObservableObject`/`@Published`, and SwiftData for persistence. No external state management libraries.

### 4.2 Layer Architecture

```
Layer 1: SwiftData Models           — persistent domain data
Layer 2: @Observable ViewModels     — screen-level business logic
Layer 3: @State / @Binding          — component-level UI state
Layer 4: @Environment               — theme, services, global state
```

### 4.3 Component-Level State (@State / @Binding)

Design system components manage their own internal UI state via `@State` and expose observable state changes via `@Binding` or callback closures.

| Pattern | When to Use | Example |
|---|---|---|
| `@State private var` | Internal-only state not visible to parent | CarlibTextField: `@State private var isFocused: Bool` |
| `@Binding var` | Two-way state shared with parent | CarlibTextField: `@Binding var text: String` |
| `@FocusState` | Keyboard focus management | CarlibTextField: `@FocusState private var fieldFocused: Bool` |
| Callback closures | One-way events from component to parent | CarlibButton: `var action: () -> Void` |

**Component state is always ephemeral.** No design system component persists its own state. Persistence is the responsibility of the ViewModel layer above.

### 4.4 ViewModel State (@Observable)

Each screen (not each component) has a ViewModel using the `@Observable` macro. The ViewModel manages screen-level state, calls services, and transforms domain data for display.

| Pattern | When to Use | Example |
|---|---|---|
| `@Observable class XViewModel` | Screen-level state and logic | `DeclarationViewModel` manages the 4-step flow state |
| `@State private var viewModel` | ViewModel ownership in the view | `@State private var viewModel = GarageSearchViewModel()` |
| Computed properties on @Observable | Derived UI state | `var canSubmit: Bool { allFieldsValid && !isLoading }` |

**ViewModel responsibilities:**
- Hold the current screen state (loading, loaded, error, empty)
- Transform domain models into display models
- Validate form inputs
- Call services/repositories
- Never reference SwiftUI views or UIKit

**Naming convention:** `{ScreenName}ViewModel` — e.g., `DeclarationStepOneViewModel`, `GarageSearchViewModel`, `RepairTrackingViewModel`.

### 4.5 Domain Models (SwiftData)

SwiftData models represent the persistent entities. They are the source of truth for data that survives app restarts.

| Model | Key Properties | Role |
|---|---|---|
| `User` | id, role (driver/garage), name, email, phone | Both |
| `Vehicle` | id, licensePlate, make, model, photo | Driver |
| `Claim` (Sinistre) | id, status, accidentType, description, location, photos, vehicleId, garageId, createdAt | Both |
| `Garage` | id, name, address, location, specialties, coverageZone, photos, ownerId | Garage |
| `Booking` (RendezVous) | id, claimId, garageId, date, timeSlot, status | Both |
| `RepairStatus` | id, claimId, status, updatedAt, updatedBy | Both |
| `Notification` | id, type, title, body, isRead, linkedEntityId, createdAt | Both |
| `TimeSlot` | id, garageId, dayOfWeek, startTime, endTime, isBlocked | Garage |
| `ClaimDraft` | partial claim data for declaration in progress | Driver |

**SwiftData container** is initialized at the App level and injected via `.modelContainer()`.

**Queries** use `@Query` in views for reactive data binding, or `ModelContext` in ViewModels for imperative fetch/save operations.

### 4.6 Environment for Global State

| Environment Key | Type | Purpose |
|---|---|---|
| `\.carlibTheme` | `CarlibTheme` | Token propagation (colors, fonts, spacing) |
| `\.carlibUserRole` | `CarlibUserRole` (.driver / .garage) | Role-based routing and content adaptation |
| `\.carlibToastManager` | `CarlibToastManager` (@Observable) | Global toast presentation queue |
| `\.modelContext` | `ModelContext` | SwiftData context (injected by `.modelContainer()`) |

### 4.7 Universal Screen State Pattern

Every data-driven screen follows the same state pattern. This is enforced by a generic enum and a convenience ViewModifier:

```
enum ScreenState<T> {
    case idle
    case loading
    case loaded(T)
    case empty
    case error(CarlibError)
}
```

A `CarlibContentView` wrapper applies the pattern: show CarlibLoadingState for `.loading`, CarlibEmptyState for `.empty`, CarlibErrorState for `.error`, and the actual content for `.loaded`. This ensures every screen handles all four states without forgetting any.

### 4.8 Navigation Architecture

Navigation uses `NavigationStack` with typed `NavigationPath` for deep-link support. Each role (driver/garage) has its own NavigationStack within its tab.

| Component | SwiftUI Pattern | Notes |
|---|---|---|
| Root routing | `if role == .driver { DriverTabView } else { GarageTabView }` | Role-based root view |
| Tab navigation | `TabView` with selection binding | Each tab owns its own `NavigationStack` |
| Screen push | `.navigationDestination(for:)` with typed route enum | Type-safe navigation |
| Modal presentation | `.sheet()` / `.fullScreenCover()` | For flows that should not push (photo viewer, filters) |
| Deep links | `NavigationPath` manipulation from notification handler | Notification tap resolves to a route and appends to path |

---

## 5. Shared vs. Role-Specific Patterns

### 5.1 Architecture Principle

The design system is a **single library** serving both roles. There are no "driver components" or "garage components" — there are only **Carlib components** with role-specific **configuration**. The difference between roles is expressed through:

1. **Content** — different data shown in the same component
2. **Tab structure** — different tabs in CarlibTabBar
3. **Feature availability** — certain screens/flows only accessible by one role
4. **Information density** — garage views may show more data per screen

The design system itself does **not** branch on role. The feature-layer views consume design system components and pass role-appropriate data.

### 5.2 Shared Foundation (100% reused)

| Category | Components | Usage |
|---|---|---|
| **All tokens** | Colors, typography, spacing, radius, shadows, animations | Identical token set for both roles |
| **All foundation** | Button, Icon, Text, Surface, Avatar, Divider, Skeleton | Identical |
| **All inputs** | TextField, TextArea, Checkbox, RadioGroup, Toggle, SearchInput, FormGroup | Identical |
| **Navigation shell** | TabBar (different tab config), TopBar, BackCloseHeader, BottomSheet, SegmentedTab | Same component, different configuration |
| **Status system** | StatusBadge, StatusTimeline, ProgressStepper | Same component, same statuses. Driver views are read-only. Garage views add update actions above the component. |
| **Feedback** | Toast, InlineAlert, ProgressBar, NotificationBadge, EmptyState, ErrorState, LoadingState | Identical |
| **Modals** | Dialog, ActionSheet, FullScreenModal | Identical |
| **Lists** | ListItem, NotificationCard, NotificationList | Identical |
| **Media** | ImageGallery, ImageViewer, PhotoThumbnail | Identical |
| **Cards** | ClaimCard, BookingCard, ProfileCard | Same component with variant prop (driver view vs. garage view) |

### 5.3 Driver-Only Features (components shared, screens unique)

These screens are only accessible when `carlibUserRole == .driver`. The components they use are shared — only the feature-layer views are driver-specific.

| Feature | Unique Screen Views | Design System Components Used |
|---|---|---|
| **Claim declaration flow** | DeclarationStep1-4, DeclarationSummary, DeclarationConfirmation | ProgressStepper, FormGroup, all inputs, CameraOverlay, PhotoGuide, LocationInput, LicensePlateInput, Button |
| **Garage search** | GarageSearchScreen (map + list), GarageFilterSheet | MapView, GarageMarker, UserMarker, MapCallout, MapListToggle, GarageCard, FilterChipGroup, BottomSheet |
| **Booking flow** | BookingCalendarScreen, BookingConfirmationScreen | CalendarGrid, TimeSlotGrid, WeekStrip, BookingSummary, Dialog |
| **Repair tracking** | RepairTrackingScreen | StatusTimeline, StatusBadge, NotificationCard |
| **Vehicle profile** | VehicleProfileScreen | VehicleInfoCard, LicensePlateInput |

### 5.4 Garage-Only Features (components shared, screens unique)

These screens are only accessible when `carlibUserRole == .garage`.

| Feature | Unique Screen Views | Design System Components Used |
|---|---|---|
| **Incoming claims** | AvailableClaimsScreen, ClaimDetailScreen | ClaimCard (garage variant), ListItem, FilterChipGroup, BottomSheet |
| **Accept/refuse** | Within ClaimDetailScreen | Dialog (.destructive for refuse), Button, Toast |
| **Planning** | PlanningWeekScreen, PlanningDayScreen | CalendarGrid (week view), TimeSlotGrid (with booked slots), WeekStrip |
| **Availability management** | AvailabilityScreen | AvailabilityRow, Toggle, CalendarGrid |
| **Status updates** | Within DossierDetailScreen | StatusBadge, Button ("Passer a l'etape suivante"), Dialog, Toast |
| **Dashboard** | GarageDashboardScreen | StatCard, ClaimCard (compact), ListItem |
| **Garage profile** | GarageProfileEditScreen | FormGroup, TextField, TextArea, ImageGallery, PhotoThumbnail |

### 5.5 Role-Based Theming Strategy

Same tokens, same components, different **application ratios**:

| Aspect | Driver App | Garage Portal |
|---|---|---|
| **Background weight** | 85% white/light, 15% color | 75% white/light, 25% color (more structured) |
| **Information density** | Low-medium: large cards, generous spacing, max 3 actions per screen | Medium-high: denser lists, more data per card, dashboard grids |
| **Primary action language** | Guidance-oriented: "Suivant", "Reserver", "Declarer" | Operations-oriented: "Accepter", "Mettre a jour", "Planifier" |
| **Empty states** | Emotionally reassuring: "Tout est en ordre, aucun sinistre en cours" | Operationally informative: "Aucun dossier en attente dans votre zone" |
| **Tab count** | 4 tabs | 4 tabs |
| **Navigation depth** | Shallow (3 levels max) | Moderate (4 levels in dossier detail) |

This differentiation is handled entirely at the **feature layer**, not in the design system. The design system provides the same spacing, the same card component, the same button. The feature views choose how densely to pack them.

---

## 6. Status Flow System

### 6.1 Unified Status Enum

All three status flows are unified into a single `CarlibStatus` enum. Each case carries its French label, color token, SF Symbol icon name, and the flow it belongs to. This single enum is the source of truth consumed by CarlibStatusBadge, CarlibStatusTimeline, CarlibNotificationCard, and all status-related views.

### 6.2 Flow 1: Claim Status (Statut du sinistre)

The master lifecycle governing a claim from creation to completion.

```
brouillon → soumis → enAttente → attribue → planifie → enReparation → termine
                                    |                                     |
                                    → expire                              → litige
                                    → annule
```

| Enum Case | French Label | Color Token | SF Symbol | Description |
|---|---|---|---|---|
| `.claimDraft` | Brouillon | `carlibStatusDraft` | `square.and.pencil` | Claim started, not submitted |
| `.claimSubmitted` | Soumis | `carlibInfo` | `paperplane.fill` | Submitted, entering the system |
| `.claimPending` | En attente | `carlibStatusPending` | `clock.fill` | Visible to garages, awaiting acceptance |
| `.claimAssigned` | Attribue | `carlibStatusAssigned` | `person.fill.checkmark` | A garage has accepted |
| `.claimScheduled` | Planifie | `carlibStatusAssigned` | `calendar.badge.checkmark` | Drop-off appointment confirmed |
| `.claimInRepair` | En reparation | `carlibStatusInProgress` | `wrench.and.screwdriver.fill` | Vehicle at garage, repair in progress |
| `.claimCompleted` | Termine | `carlibStatusCompleted` | `checkmark.circle.fill` | Repair finished, vehicle ready |
| `.claimCancelled` | Annule | `carlibStatusCancelled` | `xmark.circle.fill` | Cancelled by driver |
| `.claimExpired` | Expire | `carlibStatusDraft` | `clock.badge.xmark` | No garage accepted in time |

### 6.3 Flow 2: Booking Status (Statut du rendez-vous)

Tied to a specific claim-garage pair.

```
demande → confirme → rappelEnvoye → vehiculeDepose → termine
            |
            → annule
            → replanifie
```

| Enum Case | French Label | Color Token | SF Symbol | Description |
|---|---|---|---|---|
| `.bookingRequested` | Demande | `carlibStatusPending` | `calendar.badge.clock` | Slot requested by driver |
| `.bookingConfirmed` | Confirme | `carlibStatusCompleted` | `calendar.badge.checkmark` | Confirmed by both parties |
| `.bookingReminderSent` | Rappel envoye | `carlibInfo` | `bell.badge` | Automated reminder (24h before) |
| `.bookingVehicleDropped` | Vehicule depose | `carlibStatusInProgress` | `car.fill` | Driver has dropped off vehicle |
| `.bookingCompleted` | Termine | `carlibStatusCompleted` | `checkmark.circle.fill` | Appointment fulfilled |
| `.bookingCancelled` | Annule | `carlibStatusCancelled` | `xmark.circle.fill` | Appointment cancelled |
| `.bookingRescheduled` | Replanifie | `carlibStatusPending` | `calendar.badge.exclamationmark` | Moved to new date |

### 6.4 Flow 3: Repair Status (Statut de la reparation)

Sub-statuses within the `claimInRepair` state, managed exclusively by the garage.

```
receptionne → diagnostic → travauxEnCours → controleQualite → pret
```

| Enum Case | French Label | Color Token | SF Symbol | Description |
|---|---|---|---|---|
| `.repairReceived` | Receptionne | `carlibStatusAssigned` | `tray.and.arrow.down.fill` | Vehicle received at garage |
| `.repairDiagnostic` | Diagnostic | `carlibInfo` | `magnifyingglass` | Assessment in progress |
| `.repairInProgress` | Travaux en cours | `carlibStatusInProgress` | `wrench.and.screwdriver.fill` | Active repair work |
| `.repairQualityCheck` | Controle qualite | `carlibInfo` | `checkmark.shield.fill` | Final inspection |
| `.repairReady` | Pret | `carlibStatusCompleted` | `checkmark.circle.fill` | Ready for pickup |

### 6.5 Status-to-Visual Mapping Rules

1. **Color is never the sole indicator.** Every status display uses: colored dot + text label + icon. The CarlibStatusBadge component enforces this — there is no mode where only a color dot is shown without at least an accessible label.

2. **Icon + color + label are all derived from the enum case.** Feature views never manually specify "show green dot with text Termine" — they pass `.claimCompleted` and the component resolves all three.

3. **Status-specific backgrounds.** When a status badge sits on a tinted card (e.g., confirmation card), the card background uses the `*Bg` variant of the status color token (e.g., `carlibStatusCompletedBg` — a very light green). The badge text uses the strong variant.

4. **Timeline connector colors.** In CarlibStatusTimeline, the connector line between completed steps uses `carlibStatusCompleted`. The connector after the current step uses `carlibBorderDefault`. This provides a visual "fill" effect showing progress.

5. **Notification mapping.** Every status transition generates a notification. The notification card displays the icon and color of the **destination** status. The notification text uses templates from a localized string catalog (see Section 6.7).

### 6.6 Status Progression Logic

The CarlibStatus enum provides a `nextStatus` computed property that returns the valid next status (or nil if terminal). This is used by the garage "Passer a l'etape suivante" button to determine what to show.

| Current | Next | Trigger (User Action) |
|---|---|---|
| `.claimPending` | `.claimAssigned` | Garage taps "Accepter" |
| `.claimAssigned` | `.claimScheduled` | Driver confirms booking |
| `.claimScheduled` | `.claimInRepair` | Garage taps "Vehicule receptionne" |
| `.claimInRepair` | `.claimCompleted` | Garage advances through repair sub-statuses to `.repairReady` |
| `.repairReceived` | `.repairDiagnostic` | Garage taps "Passer a l'etape suivante" |
| `.repairDiagnostic` | `.repairInProgress` | Garage taps "Passer a l'etape suivante" |
| `.repairInProgress` | `.repairQualityCheck` | Garage taps "Passer a l'etape suivante" |
| `.repairQualityCheck` | `.repairReady` | Garage taps "Passer a l'etape suivante" |

### 6.7 Status Notification Templates

French notification copy templates stored in a `CarlibStatusStrings` constant or localized string catalog:

| Transition | Recipient | French Template |
|---|---|---|
| pending → assigned | Driver | "Le garage {garageName} a accepte votre dossier." |
| pending → assigned | Garage | "Vous avez accepte le dossier #{claimId}." |
| assigned → scheduled | Both | "Rendez-vous confirme le {date} a {time} chez {garageName}." |
| scheduled → inRepair | Driver | "Votre vehicule est pris en charge par {garageName}." |
| repair substatus change | Driver | "Mise a jour : {repairStatusLabel}." |
| inRepair → completed | Driver | "Votre vehicule est pret ! Contactez {garageName} pour le recuperer." |
| booking reminder | Driver | "Rappel : rendez-vous demain a {time} chez {garageName}." |
| new claim in zone | Garage | "Nouveau sinistre disponible dans votre zone ({distance} km)." |

---

## 7. Accessibility Architecture

### 7.1 Standards

| Standard | Level | Rationale |
|---|---|---|
| **WCAG 2.2** | **AA** minimum | European Accessibility Act (EAA) compliance. French RGAA alignment. |
| **iOS Accessibility APIs** | Full support | VoiceOver, Dynamic Type, Reduce Motion, Bold Text, Increase Contrast |

Accessibility is not a layer added later — it is built into every token and every component from the foundation level up.

### 7.2 Dynamic Type Support

**Strategy:** All typography tokens use `Font.system()` which automatically scales with Dynamic Type. Views accommodate text growth through flexible layouts.

| Implementation | Detail |
|---|---|
| **Range clamping** | Apply `.dynamicTypeSize(.xSmall ... .accessibility3)` at the root view to set a supported range. Components within this range must not break. |
| **No fixed heights for text containers** | Cards, list items, form groups all use flexible height. `fixedSize(horizontal: false, vertical: true)` where needed to prevent truncation. |
| **Scrollable where needed** | At very large type sizes, content that normally fits on screen may require scrolling. All screens are wrapped in ScrollView (or List, which scrolls natively). |
| **Testing requirement** | Every component is previewed at minimum 3 type sizes: default, `.xxxLarge`, `.accessibility1`. Xcode Previews include these variants. |
| **Label truncation policy** | Navigation tab labels and status badge labels are allowed to truncate only at `.accessibility3` and above. All other text never truncates. |

### 7.3 VoiceOver Support

| Area | Implementation Pattern |
|---|---|
| **Labels** | Every interactive element has an `accessibilityLabel` in French. Buttons: action verb ("Declarer un sinistre"). Links: destination ("Voir le profil du garage"). Status badges: "Statut : {label}". |
| **Hints** | Complex actions get `accessibilityHint`: "Appuyez deux fois pour declarer un nouveau sinistre." Hints describe what will happen, not how to interact. |
| **Values** | Progress indicators use `accessibilityValue`: "Etape 2 sur 4". Sliders, counters: current numeric value. |
| **Traits** | `.isButton` (automatic for Button), `.isHeader` (on section titles), `.isSelected` (on active tab, selected filter), `.isModal` (on dialogs and sheets), `.updatesFrequently` (on real-time status) |
| **Grouping** | Card content is grouped with `accessibilityElement(children: .combine)` so VoiceOver reads the card as one unit: "{garage name}, {distance}, {availability}". Individual elements within are not separately focusable unless they have their own actions. |
| **Ordering** | `accessibilitySortPriority` ensures logical reading order: status first, then title, then metadata, then actions. |
| **Announcements** | Status changes, toast appearances, and form errors trigger `AccessibilityNotification.Announcement` with French text. |
| **Language** | All accessibility labels are in French. No English fallbacks. The app declares French as its language. |

### 7.4 Reduce Motion

| Pattern | Standard Behavior | Reduce Motion Behavior |
|---|---|---|
| Screen transitions | Push/pop with slide animation | Instant crossfade |
| Bottom sheet presentation | Slide up with spring | Instant appear |
| Status stepper advance | Checkmark animation + connector fill slide | Instant state change |
| Toast presentation | Slide in from top/bottom | Instant appear |
| Skeleton shimmer | Gradient sweep animation | Static gray rectangle |
| Map auto-zoom | Animated camera move | Instant camera position |
| Button press | Scale spring animation | Opacity change only |
| Photo capture success | Checkmark animation on thumbnail | Instant checkmark |
| Status timeline new entry | Slide in from bottom | Instant appear |

**Implementation:** A shared `@Environment(\.accessibilityReduceMotion)` check is wrapped in a convenience property `CarlibMotion.isReduceMotionEnabled`. All animation calls in the design system check this property and substitute instant transitions when true.

### 7.5 Color Contrast

| Rule | Specification | Enforcement |
|---|---|---|
| **Body text on backgrounds** | Minimum 4.5:1 contrast ratio | All `carlibText*` tokens on all `carlibSurface*` tokens are pre-validated. |
| **Large text (18pt+ or 14pt+ bold)** | Minimum 3:1 contrast ratio | Heading tokens on surface tokens are pre-validated. |
| **UI components** | Minimum 3:1 contrast ratio against adjacent colors | Status badge borders, input field borders, icon colors are all validated. |
| **Status colors on their subtle backgrounds** | Each `carlibStatus*` on its `carlibStatus*Bg` is validated at 4.5:1 minimum. | |
| **Color not the sole indicator** | Every status, every form error, every state change uses color + icon + text | Enforced by component API — CarlibStatusBadge has no "dot only without label" mode exposed to feature code (the `.dotOnly` variant still has an accessibilityLabel). |

### 7.6 Focus Management

| Scenario | Behavior |
|---|---|
| **Dialog opens** | Focus moves to dialog title. Focus is trapped within dialog. Tab cycles through dialog elements only. |
| **Dialog closes** | Focus returns to the element that triggered the dialog. |
| **Bottom sheet opens** | Focus moves to sheet content. Dimmed background is not focusable. |
| **Bottom sheet closes** | Focus returns to trigger. |
| **Form error on submit** | Focus moves to the first field with an error via `@FocusState`. Error is announced via `AccessibilityNotification.Announcement`. |
| **Status change notification** | If status view is visible, announce the change. Do not move focus — the user may be elsewhere. |
| **Declaration step advance** | Focus moves to the first input of the new step. Previous step content is no longer focusable. |
| **Toast appears** | Announced via notification. Focus does not move — toasts are non-modal. |

**Implementation:** `@FocusState` bindings and `@AccessibilityFocusState` bindings are defined at the screen level. The design system provides focusable components; the feature layer manages focus flow between them.

### 7.7 Touch Targets

| Context | Minimum Size | Rationale |
|---|---|---|
| **Standard interactive elements** | 44 x 44 pt | iOS HIG minimum |
| **Declaration flow (post-accident)** | 48 x 48 pt preferred, 56 pt for primary CTA | User may be stressed, hands shaking, low light conditions |
| **Gap between targets** | 8 pt minimum | Prevents accidental taps |
| **Map markers** | 32 pt visual, 44 pt hit area (transparent expansion) | Visual density on map, but accessible tap target |

### 7.8 Post-Accident Stress Accessibility

The driver's declaration flow operates under unique accessibility constraints — the user may be in acute stress, shaking, in poor lighting, with reduced cognitive capacity. The design system addresses this at the component level:

| Need | Design System Response |
|---|---|
| **Reduced cognitive load** | Maximum 3 actions per screen (PRD mandate). CarlibProgressStepper shows exactly where the user is and how much remains. |
| **Motor impairment (shaking)** | Oversized buttons in declaration flow (56pt `buttonHeightStress`). No drag-and-drop. No precision gestures. Photo capture has an oversized 72pt shutter button. |
| **Low light conditions** | Camera overlay has high-contrast white text on semi-transparent dark background. Status text uses maximum contrast ratios. |
| **Reassurance** | Success states use gentle green + checkmark. Copy is calming: "Tout est transmis" rather than technical language. Progress is always visible — the user never wonders what happens next. |
| **Error recovery** | All form data is preserved on error. Network failures queue locally and retry. Draft claims survive app termination via SwiftData. |

---

## 8. Build Priority

### 8.1 Phase 1 — Wireframe Foundation (Weeks 1-3)

**Goal:** All components needed to build functional wireframes for both driver and garage flows. Components at this stage may use placeholder colors/final tokens are not required if brand identity is still pending. Wireframe components are structural — correct spacing, correct hierarchy, correct interaction patterns.

#### Week 1: Tokens + Foundation

| Priority | Component | Rationale |
|---|---|---|
| 1 | CarlibTheme + all token files | Everything depends on this |
| 2 | CarlibText | Every screen has text |
| 3 | CarlibButton | Every screen has actions |
| 4 | CarlibIcon | Every component uses icons |
| 5 | CarlibSurface | Cards, containers everywhere |
| 6 | CarlibDivider | List and section separation |
| 7 | CarlibSkeleton | Loading states needed from day one |
| 8 | CarlibAvatar | Garage cards, profile displays |

#### Week 2: Inputs + Navigation + Status

| Priority | Component | Rationale |
|---|---|---|
| 9 | CarlibTextField + CarlibFormGroup | Declaration flow, all forms |
| 10 | CarlibSelect | Accident type selection |
| 11 | CarlibRadioGroup | Accident type selection variant |
| 12 | CarlibSearchInput | Garage search |
| 13 | CarlibFilterChipGroup | Garage search filters |
| 14 | CarlibTabBar | App navigation shell |
| 15 | CarlibTopBar | Screen headers |
| 16 | CarlibBackCloseHeader | Sub-screen navigation |
| 17 | CarlibBottomSheet | Garage detail, filters |
| 18 | CarlibStatusBadge | Status display throughout app |
| 19 | CarlibListItem | Lists in both roles |
| 20 | CarlibEmptyState | DoD requires all empty states |
| 21 | CarlibErrorState | DoD requires all error states |
| 22 | CarlibLoadingState | DoD requires all loading states |

#### Week 3: Flow-Specific Components

| Priority | Component | Rationale |
|---|---|---|
| 23 | CarlibProgressStepper | Declaration flow (US01) |
| 24 | CarlibLicensePlateInput | Declaration Step 3 (US01) |
| 25 | CarlibPhoneInput | Registration |
| 26 | CarlibLocationInput | Declaration Step 4 (US01) |
| 27 | CarlibPhotoThumbnail | Declaration Step 2 (US01) |
| 28 | CarlibPhotoGuide | Declaration Step 2 (US01) |
| 29 | CarlibGarageCard | Garage search (US02) |
| 30 | CarlibClaimCard | Claim lists (US04, US05) |
| 31 | CarlibCalendarGrid | Booking + planning (US03, US06) |
| 32 | CarlibTimeSlotPicker | Booking + planning (US03, US06) |
| 33 | CarlibWeekStrip | Calendar navigation |
| 34 | CarlibBookingSummary | Booking confirmation (US03) |
| 35 | CarlibStatusTimeline | Repair tracking (US04) |
| 36 | CarlibDialog | Confirmations throughout |
| 37 | CarlibToast | Feedback throughout |
| 38 | CarlibInlineAlert | Form validation, system messages |

### 8.2 Phase 2 — High Fidelity (Weeks 4-6)

**Goal:** All remaining components + visual polish with confirmed brand identity. Components receive final colors, typography refinement, animation polish, and accessibility audit.

#### Week 4: Remaining Components

| Priority | Component | Rationale |
|---|---|---|
| 39 | CarlibCameraOverlay | Photo capture (US01) — most complex UI |
| 40 | CarlibImageGallery | Photo display in dossiers |
| 41 | CarlibImageViewer | Full-screen photo review |
| 42 | CarlibMapView + CarlibGarageMarker + CarlibUserMarker | Map interface (US02) |
| 43 | CarlibMapCallout | Map interaction |
| 44 | CarlibMapListToggle | Map/list toggle |
| 45 | CarlibVehicleInfoCard | Vehicle display |
| 46 | CarlibBookingCard | Booking display |
| 47 | CarlibNotificationCard | Notification center |
| 48 | CarlibNotificationList | Notification center |
| 49 | CarlibNotificationBadge | Tab badge indicators |

#### Week 5: Garage-Specific + Remaining

| Priority | Component | Rationale |
|---|---|---|
| 50 | CarlibStatCard | Garage dashboard |
| 51 | CarlibAvailabilityRow | Garage availability management |
| 52 | CarlibTimeSlotGrid | Garage planning detail |
| 53 | CarlibProfileCard | Profile screens |
| 54 | CarlibSegmentedTab | View toggles |
| 55 | CarlibTextArea | Description fields |
| 56 | CarlibCheckbox | Multi-select filters |
| 57 | CarlibToggle | Notification preferences |
| 58 | CarlibDatePicker | Date selection |
| 59 | CarlibPhotoCapture | Full capture flow (combines camera + thumbnails) |

#### Week 6: Onboarding + Auth + Polish

| Priority | Component | Rationale |
|---|---|---|
| 60 | CarlibSplashScreen | App launch |
| 61 | CarlibRoleSelector | Onboarding |
| 62 | CarlibLoginForm | Authentication |
| 63 | CarlibRegistrationForm | Account creation |
| 64 | CarlibOnboardingCarousel | First-launch experience |
| 65 | CarlibActionSheet | Context actions |
| 66 | CarlibFullScreenModal | Complex detail views |
| 67 | CarlibProgressBar | Upload progress |
| 68 | CarlibChatBubble | Messaging (Should-have) |

### 8.3 Phase 3 — Accessibility Audit + Documentation (Week 7)

| Task | Scope |
|---|---|
| **Contrast audit** | Test every color token combination at WCAG AA |
| **VoiceOver audit** | Navigate every component with VoiceOver. Verify all labels are in French, all states are announced, all focus management works. |
| **Dynamic Type audit** | Test every component at 3 type sizes (default, xxxLarge, accessibility1). Fix any layout breakage. |
| **Reduce Motion audit** | Toggle reduce motion and verify all animations are disabled or replaced with instant transitions. |
| **Touch target audit** | Verify every interactive element meets 44pt minimum. Verify declaration flow meets 48pt+ recommendation. |
| **State coverage audit** | Verify every data-driven component has loading, empty, error, and loaded states. |
| **Component documentation** | Each component gets a doc comment: purpose, variants, states, accessibility notes, usage example. |

### 8.4 Critical Path Summary

```
Brand identity decision (BLOCKER)
  ↓
Token definitions (Week 1, Day 1-2)
  ↓
Foundation components (Week 1, Day 2-5)
  ↓
Input + Navigation + Status (Week 2) ←── Attribution logic decision feeds marketplace patterns
  ↓
Flow-specific components (Week 3)
  ↓
All wireframe screens can be built
  ↓
High-fidelity components (Week 4-6) ←── Brand identity must be confirmed by now
  ↓
Accessibility audit (Week 7)
  ↓
Development handoff ready
```

### 8.5 MVP vs. Post-MVP Components

| Category | MVP (Must) | Post-MVP (Should/Could) |
|---|---|---|
| Foundation | All 7 components | — |
| Input | 13 of 15 (Toggle and TextArea can defer) | Toggle, TextArea |
| Navigation | All 5 | Breadcrumb (only if web portal) |
| Data Display | All 11 | — |
| Status/Feedback | 6 of 7 (ProgressBar can defer) | ProgressBar |
| Map | All 5 | — |
| Calendar | All 5 | — |
| Media | All 4 | — |
| Communication | NotificationCard, NotificationList | ChatBubble |
| Onboarding | RoleSelector, LoginForm, RegistrationForm | OnboardingCarousel, SplashScreen |
| Modal | Dialog, ActionSheet, FullScreenModal | — |
| **Total MVP** | **~72 components** | **~6 deferred** |

---

## Appendix A: Token File Naming Convention

```
DesignSystem/Tokens/
  CarlibPalette.swift          — enum CarlibPalette (raw color values)
  CarlibColors.swift           — extension Color (semantic tokens)
  CarlibTypography.swift       — extension Font (semantic tokens)
  CarlibSpacing.swift          — enum CarlibSpacing (spacing scale)
  CarlibRadius.swift           — enum CarlibRadius (border radius scale)
  CarlibElevation.swift        — struct CarlibElevation: ViewModifier
  CarlibMotion.swift           — enum CarlibMotion (animation presets)
  CarlibTheme.swift            — struct CarlibTheme + EnvironmentKey
  CarlibStatus.swift           — enum CarlibStatus (unified status system)
```

## Appendix B: Component Naming Convention

| Entity | Convention | Example |
|---|---|---|
| **Component file** | `Carlib{Name}.swift` | `CarlibButton.swift` |
| **Component struct** | `Carlib{Name}` | `struct CarlibButton: View` |
| **Variant enum** | `Carlib{Name}Variant` | `enum CarlibButtonVariant` |
| **Size enum** | `Carlib{Name}Size` | `enum CarlibButtonSize` |
| **ViewModel** | `{Screen}ViewModel` | `class DeclarationViewModel` |
| **SwiftData model** | `{Entity}` (no prefix) | `@Model class Claim` |
| **Token enum/extension** | `Carlib{TokenCategory}` | `enum CarlibSpacing` |

## Appendix C: Xcode Preview Strategy

Every design system component includes Xcode Previews showing:

1. All variants (primary, secondary, ghost, etc.)
2. All states (default, pressed, disabled, loading, error)
3. Three Dynamic Type sizes (default, .xxxLarge, .accessibility1)
4. Light and dark appearance (even before dark mode ships — validates token structure)
5. French content with real domain text ("Declarer un sinistre", not "Lorem ipsum")

Preview groups are organized as:
```
#Preview("CarlibButton — Variants") { ... }
#Preview("CarlibButton — States") { ... }
#Preview("CarlibButton — Accessibility") { ... }
```

## Appendix D: Decision Log

| Decision | Choice | Rationale |
|---|---|---|
| Font family | SF Pro (system) | Zero bundling, perfect French support, Dynamic Type native, eliminates brand font blocker |
| Map SDK | MapKit (native) | Zero dependencies, sufficient for MVP, SwiftUI-native API |
| State management | @Observable + SwiftData | Apple recommended for iOS 17+, no external libraries |
| Navigation | NavigationStack + typed paths | Supports deep links, type-safe routing |
| Color storage | Asset Catalog | Enables dark mode support without code changes |
| Component prefix | `Carlib` | Avoids collision with SwiftUI types (Button, Text, etc.) |
| Bottom sheet | Native `.sheet()` with `presentationDetents` | Avoids custom sheet implementation, native feel |
| Reduce motion | Environment check + instant transitions | WCAG AAA recommended, critical for stress context |

---

*End of Design System Architecture — Carlib v1.0*
*Generated: April 2026 | Agent: Design System Architect*
