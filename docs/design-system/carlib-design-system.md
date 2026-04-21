# Carlib Design System Specification

**Status:** Source of truth for the Figma library build.
**Audit scope:** `Carlib/DesignSystem/`, `Carlib/Views/Shared/`, `Carlib/Models/*Status.swift`, `Carlib/Resources/`.
**Platforms:** iOS 26+, iPhone Portrait only. SwiftUI + `@Observable`.
**Theme:** Light-mode default; adaptive dark mode supported via `UITraitCollection.userInterfaceStyle`. Dark-mode toggle is currently disabled in the app shell but tokens resolve for both modes.

All values below are derived from code only. No invented tokens. Every row cites file and line numbers to stay verifiable.

---

## Table of Contents

1. Foundations
   1. Color tokens
   2. Typography
   3. Spacing
   4. Radius
   5. Elevation / shadow
   6. Motion
2. Icons
3. Components
   1. CarlibButton
   2. CarlibTextField
   3. CarlibSecureField
   4. CarlibCard
   5. CarlibStatusBadge
   6. CarlibSectionHeader
   7. PolestarTile
   8. CarBrandLogo
   9. DummyImage
   10. PressableButtonStyle
   11. ClaimCardView (composite)
   12. GarageCardView (composite)
   13. StatusTimelineView (composite)
4. Status systems
5. Figma library plan
6. Gaps & inconsistencies

---

## 1. Foundations

### 1.1 Color tokens

All adaptive colors are built with a private helper:

```swift
private func adaptive(light: UIColor, dark: UIColor) -> Color
```
Source: `Carlib/DesignSystem/CarlibColors.swift:30-32`.

Tokens are exposed as static properties on two APIs:

- `Color.*` (asset-catalog backed, lines 5–26) — legacy names referencing colorsets that **do not exist** in the asset catalog. See Gaps.
- `ShapeStyle where Self == Color` (lines 40–180) — programmatic tokens used everywhere in the codebase. These are the canonical tokens.

Values are expressed in the source as normalized RGB (0.0–1.0). Hex values in the tables below are rounded from the code.

#### Brand

| Token | Light | Dark | Source (adaptive?) | Usage |
|---|---|---|---|---|
| `carlibPrimaryBlue` (a.k.a. `brandYellow`) | `#F5B700` | `#F5B700` | No — fixed | Primary brand yellow. Used on `PolestarTile.primary`, `tilePrimary`, ghost-button text, accent strokes, progress dots. `CarlibColors.swift:45, 122`. |
| `carlibPrimaryDarkBlue` (a.k.a. `brandYellowDark`) | `#CC9900` | `#CC9900` | No — fixed | Pressed/darker yellow. `CarlibColors.swift:47, 123`. |
| `carlibPrimaryLightBlue` (a.k.a. `brandYellowLight`) | `#FFF2D9` (warm cream) | `#332600` (dark amber) | Yes | Selected states, subtle yellow tint. `CarlibColors.swift:49-54, 124`. |
| `tilePrimary` | `#F5B700` | `#F5B700` | No — fixed | Primary tile fill (brand yellow). `CarlibColors.swift:111`. |

Note: the `Blue` suffix on primary tokens is a **legacy artifact** from a prior blue brand and should be read as "primary"; the actual color is golden yellow. See Gaps.

#### Surface

| Token | Light | Dark | Adaptive | Usage |
|---|---|---|---|---|
| `carlibScreenBg` | `#FFFFFF` | `#0F0F0F` | Yes | Root screen background. `CarlibColors.swift:80-85`. |
| `carlibAccent` | `#F5F5F7` | `#1E1E1E` | Yes | Dark surface accent. `CarlibColors.swift:94-99`. |
| `tileSecondary` | `#F1F1F4` | `#1E1E1E` | Yes | Secondary tile fill, card fill, text-field fill. `CarlibColors.swift:113-118`. |
| `carlibCardBorder` | `#E8E8EB` | `#2A2A2A` | Yes | Card borders, divider overlays. `CarlibColors.swift:87-92`. |

#### Text

| Token | Light | Dark | Adaptive | Usage |
|---|---|---|---|---|
| `carlibDark` (a.k.a. `brandCharcoal`) | `#000000` | `#FFFFFF` | Yes | Primary text on surfaces. `CarlibColors.swift:59-61, 125`. |
| `carlibSecondary` | `#666B73` | `#9CA3AF` | Yes | Secondary text, labels, captions. `CarlibColors.swift:63-68`. |
| `carlibLabel` | `#8C9199` | `#6B7280` | Yes | Section headers, muted labels (placeholders in overflow chips). `CarlibColors.swift:70-75`. |
| `carlibTabInactive` | `#8C9199` | `#6B7280` | Yes | Inactive tab-bar items. Identical RGB to `carlibLabel`. `CarlibColors.swift:101-106`. |

#### Status (foreground / background pairs)

Each status has a **foreground** color (for text + icon inside the badge) and a **Bg** suffix (fill behind the capsule). Foreground values are fixed (not adaptive); backgrounds adapt light/dark.

| Status | FG (fixed) | Bg light | Bg dark | Source |
|---|---|---|---|---|
| `statusDraft` | `#999999` | `#F0F0F2` | `#26262A` | `CarlibColors.swift:129-132` |
| `statusSubmitted` | `#6194F2` | `#EBF2FF` | `#0F1A2E` | `:134-137` |
| `statusMatched` | `#F2B333` | `#FFF5E0` | `#2E2108` | `:139-142` |
| `statusAccepted` | `#40BFB3` | `#E5FAF7` | `#0A2624` | `:144-147` |
| `statusInProgress` | `#668FEB` | `#EBF2FF` | `#0F1A2E` | `:149-152` |
| `statusRepairing` | `#F2A626` | `#FFF5E6` | `#2E1F08` | `:154-157` |
| `statusCompleted` | `#4DC76B` | `#EBFAED` | `#0A290F` | `:159-162` |
| `statusCancelled` | `#E65959` | `#FFEDED` | `#2E0F0F` | `:164-167` |
| `statusExpired` | `#8C8C91` | `#F0F0F2` | `#242426` | `:169-172` |

#### Semantic

| Token | Light | Dark | Adaptive | Usage |
|---|---|---|---|---|
| `destructiveRed` | `#E64D4D` | `#E64D4D` | No — fixed | Destructive button fill, error text (`CarlibTextField.error`, `CarlibSecureField.error`). `CarlibColors.swift:176`. |
| `destructiveRedBg` | `#FFEDED` | `#2E0F0F` | Yes | Destructive background tint (not currently consumed by components; identical to `statusCancelledBg`). `CarlibColors.swift:177-179`. |

#### Legacy aliases (resolve to canonical tokens)

| Alias | Resolves to | Source |
|---|---|---|
| `brandYellow` | `carlibPrimaryBlue` | `CarlibColors.swift:122` |
| `brandYellowDark` | `carlibPrimaryDarkBlue` | `:123` |
| `brandYellowLight` | `carlibPrimaryLightBlue` | `:124` |
| `brandCharcoal` | `carlibDark` | `:125` |

Legacy asset-catalog names declared but **never resolved** (see Gaps): `carlibPrimary`, `carlibPrimaryDark`, `carlibPrimaryLight`, `carlibSuccess`, `carlibWarning`, `carlibError`, `carlibInfo`, `carlibBackground`, `carlibSurface`, `carlibTextPrimary`, `carlibTextSecondary`, `carlibBorder`. `CarlibColors.swift:5-26`.

---

### 1.2 Typography

Family: **Aeonik** (CoType Foundry), with system-font fallback if not registered.
Source: `Carlib/DesignSystem/CarlibTypography.swift`.

Registered fonts in `project.yml:48-53`:
- `Aeonik-Regular.otf` → PostScript `Aeonik-Regular`
- `Aeonik-Medium.otf` → PostScript `Aeonik-Medium`
- `Aeonik-Bold.otf` → PostScript `Aeonik-Bold`
- `Aeonik-Light.otf` → PostScript `Aeonik-Light`
- `remixicon.ttf` → PostScript `remixicon`

**Weight mapping** (`CarlibTypography.swift:41-70`): `ultraLight/thin/light → Light`, `regular → Regular`, `medium → Medium`, `semibold/bold/heavy/black → Bold`. There is no semibold; semibold calls are rendered with `Aeonik-Bold`.

**Titles default to `.medium`** per the overall design direction. This is enforced in the helper defaults: `largeTitle/title1/title2/title3/callout/caption` all default to `.medium`; `body/footnote` default to `.regular`.

Line-height is **not specified**; SwiftUI's default leading is used. No letter-spacing except in `sectionHeaderStyle` (see below).

#### Canonical scale

| Role | Size (pt) | Default weight | Family | When to use | Source |
|---|---|---|---|---|---|
| `largeTitle` | 28 | Medium | Aeonik | Carousel headlines, hero greeting | `CarlibTypography.swift:76-78` |
| `title1` | 26 | Medium | Aeonik | Form/page titles ("Create your account", "Phone number") | `:82-84` |
| `title2` | 22 | Medium | Aeonik | Section headers, card titles | `:88-90` |
| `title3` | 17 | Medium | Aeonik | Subsection headers, tile titles | `:94-96` |
| `body` | 15 | Regular | Aeonik | Primary text, descriptions, input values, button labels | `:100-102` |
| `callout` | 14 | Medium | Aeonik | Form labels, inline action labels, links | `:106-108` |
| `footnote` | 13 | Regular | Aeonik | Helper text, timestamps, subtitles | `:112-114` |
| `caption` | 13 | Medium | Aeonik | Badges, uppercase section labels, smallest readable text. **Note: size is 13, not 11** — bumped for post-accident stress context. | `:118-120` |

#### Display styles (special)

| Role | Size | Default weight | Usage | Source |
|---|---|---|---|---|
| `heroNumber` | 48 | Bold | Decorative large stat | `:125-127` |
| `amount` | 36 | Bold | Financial/numeric display | `:130-132` |
| `heroLarge` (legacy) | 72 | Medium | Extreme hero | `:149` |

#### Section header modifier

`.sectionHeaderStyle()` (`CarlibTypography.swift:155-163`) applies:
- font: `caption(.medium)` → 13pt Medium
- tracking: `0.8`
- case: `uppercase`
- color: `carlibLabel`

#### Legacy aliases (backwards compatibility)

All map to the canonical scale above: `display → largeTitle`, `displayLarge → largeTitle`, `displayMedium → title1`, `title → title2`, `headingLarge → title1`, `headingMedium → title2`, `headingSmall → title3`, `bodyLarge → body`, `bodyMedium → body`, `bodySmall → footnote`, `label → caption(.medium)`, `tileTitle → title3`, `tileStatus → footnote`, `heroStatus → title3(.medium)`. Source: `CarlibTypography.swift:136-150`.

Do **not** introduce new callsites that depend on these aliases — prefer the canonical names in Figma variable naming.

---

### 1.3 Spacing

Base unit: **4pt**. Source: `Carlib/DesignSystem/CarlibSpacing.swift`.

| Token | Value | Usage |
|---|---|---|
| `xxs` | 4 | Inner gaps (icon ↔ text inside badges, status indicator dots). |
| `xs` | 8 | Tight chip padding, compact gaps. |
| `sm` | 12 | Card-level vertical gaps, horizontal chip rows. |
| `md` | 16 | Standard inter-section gap. Also equals `screenHorizontal` and `cardPadding`. |
| `lg` | 20 | Form-level separation. |
| `xl` | 24 | Section spacing (equal to `sectionSpacing`). |
| `xxl` | 32 | Major sectional breaks. |
| `xxxl` | 40 | Page-level spacing. |
| `huge` | 48 | Rare; equal to `minTouchTarget`. |
| `minTouchTarget` | 48 | Minimum interactive target — elevated from Apple's 44 for post-accident stress context. |
| `screenHorizontal` | 16 | Screen-edge horizontal padding. |
| `cardPadding` | 16 | Default `CarlibCard` internal padding. |
| `sectionSpacing` | 24 | Space between form/page sections. |
| `tileGap` | 12 | Gap between grid tiles (Polestar grid). |
| `tileHeight` | 180 | Fixed tile height. |
| `tilePadding` | 16 | Tile internal padding. |

Source lines: `:5-43`.

---

### 1.4 Radius

Source: `Carlib/DesignSystem/CarlibRadius.swift`.

| Token | Value (pt) | Used by |
|---|---|---|
| `none` | 0 | (not currently consumed) |
| `xs` | 4 | Fine detail (not actively used in components) |
| `sm` | 8 | `GarageCardView` photo thumbnails (`GarageCardView.swift:36, 65`) |
| `md` | 12 | `CarlibTextField`/`CarlibSecureField` fill (hardcoded `cornerRadius: 12`, `CarlibTextField.swift:29`, `CarlibSecureField.swift:43` — not referencing the token). |
| `lg` | 16 | `CarlibCard`, `PolestarTile` (`CarlibCard.swift:20, 23`; `PolestarTile.swift:52`) |
| `xl` | 24 | Reserved for sheets/overlays (not actively consumed in code) |
| `full` | 9999 | Capsule fallback — **components use `Capsule()` shape directly** (buttons, badges) rather than this value. |

Source lines: `:5-11`.

Additional shapes used directly without going through the token:
- Capsule — `CarlibButton` (`CarlibButton.swift:41`), `CarlibStatusBadge` (`CarlibStatusBadge.swift:21`), inline row CTAs in `ClaimCardView`.
- Photo-strip thumbnails — `RoundedRectangle(cornerRadius: 10)` hardcoded (`ClaimCardView.swift:226, 242`).
- Claim card shell — `RoundedRectangle(cornerRadius: 14)` hardcoded (`ClaimCardView.swift:94`).
- Photo lightbox uses circles and capsules directly.

See Gaps for ad-hoc radii.

---

### 1.5 Elevation / shadow

**No shadow system exists.** There are no `.shadow(...)` modifiers, no `.elevation` tokens, and no shadow properties in any component in `Carlib/DesignSystem/` or the shared cards. Depth is expressed via background fill differentiation (`carlibScreenBg` vs `tileSecondary`) and hairline borders (`carlibCardBorder`, 1pt). `CarlibCard.elevated` adds a 1pt stroke border — this is the only "elevation" signal and no drop-shadow accompanies it.

Recommendation for Figma: do not create a shadow token collection unless a new design decision is made.

---

### 1.6 Motion

Single motion primitive: `PressableButtonStyle` in `Carlib/DesignSystem/CarlibButtonStyle.swift`.

| Property | Default | Override call site pattern |
|---|---|---|
| `scale` (pressed) | `0.96` | `.pressable(scale: 0.97, haptic: .light)` |
| `haptic` (on touch-down) | `.soft` (UIKit `UIImpactFeedbackGenerator.FeedbackStyle`) | `.pressable(scale:haptic:)` |
| Animation | `.spring(response: 0.28, dampingFraction: 0.72)` | fixed |
| Trigger | `configuration.isPressed` transition to `true` | fixed |

Source: `CarlibButtonStyle.swift:8-33`.

Observed override variants in views: `scale: 0.97, haptic: .light` (PolestarTile, inline action pills), `scale: 0.98, haptic: .light` (inProgress row button), `scale: 0.94, haptic: .light` (photo thumbnails), `scale: 0.9, haptic: .light` (close button in lightbox). `scale: 0.97, haptic: .medium` is used for the "Accept" action (`ClaimCardView.swift:137`).

Other motion constants found in code:
- `AsyncImage` transitions: `.easeOut(duration: 0.25)` (`DummyImage.swift:34`, `PhotoLightboxView.swift:81`).
- Photo-strip thumbs: `.easeOut(duration: 0.2)` (`ClaimCardView.swift:251`).
- No global motion token system (no `CarlibMotion` enum).

---

## 2. Icons

### Library

**Remixicon v4.x** — 3,229 glyphs loaded from `remixicon.ttf`. Font registered as PostScript name `remixicon`. Source: `Carlib/DesignSystem/RemixIcon.swift`.

- The `RemixIcon` enum is **auto-generated** from `remixicon.glyph.json` and **must not be hand-edited**. `RemixIcon.swift:5-7`.
- Glyphs are stored as `String` rawValues pointing to private-use codepoints (e.g. `.homeLine = "\u{EE0F}"`).
- A semantic registry `CarlibIcon` in `Carlib/DesignSystem/LucideIcon.swift` maps role-based names (tab bar, actions, navigation, vehicle, status, time, content, profile) to concrete `RemixIcon` cases. This is the preferred API for stable product surfaces — rotating the underlying glyph is safe as long as the semantic alias stays.

### Rendering helpers (`RemixIcon.swift:3243-3280`)

| Helper | Returns | Purpose |
|---|---|---|
| `.view(size:color:)` | `some View` (Text-backed) | Inline use in SwiftUI. Default size `24`, default color `.primary`. |
| `.uiImage(size:)` | `UIImage` (template) | Needed for tab-bar items, `Label(systemImage:)` replacements, `ContentUnavailableView` — any API that requires a raster `Image`/`UIImage`. |
| `.image(size:)` | `Image` (template) | SwiftUI-wrapped rasterized glyph. |

Template rendering is enforced for rasterized variants so hosts can tint the glyph with their own foreground style.

### Size conventions (observed in code)

| Context | Size (pt) | Examples |
|---|---|---|
| Badge inline icon | 11 | `CarlibStatusBadge.swift:13` |
| Thumbnail accessory | 14 | Vehicle meta-row in `ClaimCardView.swift:80` |
| Input affordance | 18 | Password reveal toggle, `CarlibSecureField.swift:38` |
| Button leading icon | 18 | `CarlibButton.swift:29` |
| Card meta icon | 20 | Accident icon on `ClaimCardView.swift:45` |
| Overlay close | 22 | Lightbox close (`PhotoLightboxView.swift:47`) |
| Default | 24 | `RemixIcon.view()` default |
| Tile accent | 34 | `PolestarTile.swift:27` |
| Empty-state | 48 | Lightbox failure (`PhotoLightboxView.swift:93`) |

### Color conventions

- Tab bar and tile accents: `carlibLabel.opacity(0.4)` (secondary tile) or `black.opacity(0.2)` (primary tile).
- Status badge icons inherit the status foreground color.
- Input trailing icons: `carlibSecondary`.
- Lightbox chrome: `.white` on black overlays.
- Status-timeline check glyph: `.white` on `statusCompleted` fill.

### Style policy

- All UI icons route through `RemixIcon` (line + fill variants). **No SF Symbols in app chrome.** `LucideIcon.swift:3-5`.
- Line variants for unselected / default states, fill variants for active / selected / success states. Pairing observed in tab bar, status badges, timeline, tile content.

### Accessibility

The current `view(size:color:)` helper returns a raw `Text` with no `.accessibilityLabel`. This is sufficient for decorative icons but purely-icon buttons (e.g. password reveal, lightbox close) currently have no label — see Accessibility Gaps.

---

## 3. Components

### 3.1 CarlibButton

Source: `Carlib/DesignSystem/Components/CarlibButton.swift`.

**Purpose.** Capsule-shaped CTA with four semantic variants. Revolut-inspired: no strokes, weight hierarchy through fill.

**Anatomy.**
- Outer `Capsule()` fill.
- Inner `HStack` of optional icon (18pt) + label. Uses `ProgressView` in loading state (tinted to match foreground).
- Fixed height **52pt**. Width expands via `frame(maxWidth: .infinity)` except for `.ghost`, which is intrinsic-width.
- Label typography: `CarlibFont.body(.medium)` → 15pt Medium.

**Props.**

| Prop | Type | Default | Required | Notes |
|---|---|---|---|---|
| `label` | `String` | — | Yes | Verbatim. |
| `icon` | `RemixIcon?` | `nil` | No | Leading 18pt icon, 8pt spacing. |
| `variant` | `Variant` | `.primary` | No | `primary / secondary / ghost / destructive`. |
| `isLoading` | `Bool` | `false` | No | Swaps content for spinner; disables taps. |
| `isDisabled` | `Bool` | `false` | No | Disables taps; reduces opacity to `0.5`. |
| `action` | `() -> Void` | — | Yes | Triggered on press. |

**Variants × adaptive fills.**

| Variant | Background (light) | Background (dark) | Foreground (light) | Foreground (dark) | Source |
|---|---|---|---|---|---|
| `primary` | `.black` | `.white` | `.white` | `.black` | `:61, 52` |
| `secondary` | `tileSecondary` | `tileSecondary` (adaptive) | `.black` | `.white` | `:62, 53` |
| `ghost` | clear | clear | `brandYellow` | `brandYellow` | `:63, 54` |
| `destructive` | `destructiveRed` | `destructiveRed` | `.white` | `.white` | `:64, 56` |

The primary variant **flips** between light/dark via `@Environment(\.colorScheme)` — black-on-white in light, white-on-black in dark — rather than through adaptive tokens. Secondary relies on token adaptivity of `tileSecondary` + `colorScheme` for text color.

**States.**

| State | Treatment |
|---|---|
| Default | Full opacity, pressable. |
| Pressed | `PressableButtonStyle` — scale `0.96`, soft haptic. |
| Disabled | Opacity `0.5`, `.disabled(true)`. Fill and foreground unchanged otherwise. |
| Loading | Content replaced with `ProgressView().tint(foregroundColor)`; `.disabled(true)`. |
| Focus / hover | Not implemented (iOS touch). |

**Tokens consumed.** `CarlibFont.body(.medium)`, `tileSecondary`, `brandYellow`, `destructiveRed`, hardcoded `.white` / `.black`. Shape is `Capsule()` (not token-driven).

**A11y.** Native `Button` role. No explicit `.accessibilityLabel` on the view; relies on `label` being legible text. Loading state does not announce busy.

---

### 3.2 CarlibTextField

Source: `Carlib/DesignSystem/Components/CarlibTextField.swift`.

**Purpose.** Single-line text input with external label, filled pill-rect field, and inline error.

**Anatomy (top → bottom).**
1. Label — `CarlibFont.callout(.medium)` (14pt Medium), color `carlibSecondary`.
2. Field — `TextField` with horizontal 16pt padding, **fixed height 52pt**, filled `tileSecondary` on `RoundedRectangle(cornerRadius: 12)`. **No stroke border.**
3. Error (optional) — `CarlibFont.caption()` (13pt Medium), `destructiveRed`.
4. Inter-element vertical spacing: `6pt` (`VStack(spacing: 6)`).

**Props.**

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `String` | — | External field label. |
| `placeholder` | `String` | — | Inline placeholder. |
| `text` | `Binding<String>` | — | Bound value. |
| `keyboardType` | `UIKeyboardType` | `.default` | |
| `contentType` | `UITextContentType?` | `nil` | Autofill hint. |
| `error` | `String?` | `nil` | Inline error string. |

**Behavior.**
- `autocorrectionDisabled()`, `textInputAutocapitalization(keyboardType == .emailAddress ? .never : .words)` (line 25).
- `@FocusState` tracked internally but not currently surfaced visually.

**States.** No explicit visual treatment for focused / filled / disabled. Error appears when `error != nil`. See Gaps.

**Tokens consumed.** `CarlibFont.callout(.medium)`, `CarlibFont.body()`, `CarlibFont.caption()`, `carlibSecondary`, `tileSecondary`, `destructiveRed`. Radius 12pt is hardcoded (should use `CarlibRadius.md`).

---

### 3.3 CarlibSecureField

Source: `Carlib/DesignSystem/Components/CarlibSecureField.swift`.

**Purpose.** Password input with reveal toggle. Mirrors `CarlibTextField` structure.

**Anatomy.** Same shell as `CarlibTextField` with an `HStack`:
- Left: `TextField` or `SecureField` (swapped via `@State isRevealed`).
- Right: eye-toggle button using `RemixIcon.eyeLine` / `.eyeOffLine` at 18pt, color `carlibSecondary`.

**Props.**

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `String` | — | |
| `placeholder` | `String` | — | |
| `text` | `Binding<String>` | — | |
| `hint` | `String?` | `nil` | Muted help text (`carlibLabel`). Suppressed while `error` is set. |
| `error` | `String?` | `nil` | Mutually exclusive with `hint`. |

**Behavior.**
- `textContentType(.password)`, `autocorrectionDisabled()`, `textInputAutocapitalization(.never)`.
- Toggle swaps the field type but does not announce reveal state to AX — see Gaps.

**Tokens consumed.** Same set as `CarlibTextField`, plus `carlibLabel` and `RemixIcon.eyeLine/eyeOffLine`.

---

### 3.4 CarlibCard

Source: `Carlib/DesignSystem/Components/CarlibCard.swift`.

**Purpose.** Container that wraps arbitrary content in a `tileSecondary` fill.

**Variants.**
| Variant | Visual treatment |
|---|---|
| `.flat` | `tileSecondary` fill, no border. |
| `.elevated` | `tileSecondary` fill + 1pt `carlibCardBorder` stroke. |

**Anatomy.**
- Padding: `CarlibSpacing.cardPadding` (16pt) on all sides.
- Shape: `RoundedRectangle(cornerRadius: CarlibRadius.lg)` — 16pt.
- Width: `maxWidth: .infinity`, `alignment: .leading`.
- No shadow in either variant. Elevation signal is the border alone.

**Tokens consumed.** `tileSecondary`, `carlibCardBorder`, `CarlibSpacing.cardPadding`, `CarlibRadius.lg`.

---

### 3.5 CarlibStatusBadge

Source: `Carlib/DesignSystem/Components/CarlibStatusBadge.swift`.

**Purpose.** Capsule pill conveying claim / booking / repair lifecycle state.

**Anatomy.**
- `HStack(spacing: CarlibSpacing.xxs)` → optional 11pt icon + label.
- Label typography: `CarlibFont.caption(.medium)` — 13pt Medium.
- Padding: `8pt` horizontal, `4pt` vertical.
- Fill: `Capsule()` with status-specific `backgroundColor`.
- Foreground (text + icon) uses the status `color`.

**Props.**
| Prop | Type | Required | Notes |
|---|---|---|---|
| `text` | `String` | Yes | Badge label. |
| `color` | `Color` | Yes | Foreground color. |
| `backgroundColor` | `Color` | Yes | Capsule fill. |
| `icon` | `RemixIcon?` | No | Leading glyph at 11pt. |

**Convenience initializers.** `init(claimStatus:)`, `init(bookingStatus:)`, `init(repairStatus:)` map each enum case to its `{color, backgroundColor, icon}` triple. See §4 for full tables.

**Tokens consumed.** All `status*` and `status*Bg` pairs; `CarlibFont.caption(.medium)`; `CarlibSpacing.xxs/xs`.

**A11y.** No `.accessibilityLabel` or role. For screen readers the text alone is read — consider prefixing with "Status:" in a future update.

---

### 3.6 CarlibSectionHeader

Source: `Carlib/DesignSystem/Components/CarlibSectionHeader.swift`.

**Purpose.** Row with a section title and an optional trailing text action (e.g. "See all").

**Anatomy.**
- `HStack` with title → `Spacer` → optional action button.
- Title typography: `CarlibFont.headingSmall()` (legacy alias for `title3()` — 17pt Medium).
- Action typography: `CarlibFont.bodySmall(.medium)` (= `footnote(.medium)` — 13pt Medium), color `brandYellow`.
- Horizontal padding: `CarlibSpacing.screenHorizontal` (16pt).

**Props.**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `String` | — | |
| `actionLabel` | `String?` | `nil` | Shown only if both `actionLabel` and `action` are set. |
| `action` | `(() -> Void)?` | `nil` | |

**Note.** Separate from the `.sectionHeaderStyle()` view-modifier (§1.2), which renders an **uppercased muted caption** style — the two are distinct patterns.

---

### 3.7 PolestarTile

Source: `Carlib/DesignSystem/Components/PolestarTile.swift`.

**Purpose.** Polestar-inspired dashboard tile — large colored surface with a bold text block top-left and a large semi-transparent glyph in a bottom corner.

**Anatomy.**
- Outer `Button` → `ZStack` with aligned content.
- Background fill by variant (see below), `RoundedRectangle(cornerRadius: CarlibRadius.lg)` (16pt).
- Content block (VStack, top-leading): `title` → optional `subtitle` → `Spacer`. Padding `CarlibSpacing.tilePadding` (16pt).
- Decorative icon: 34pt glyph at `iconAlignment` (`.bottomLeading` default, or `.bottomTrailing`), with `CarlibSpacing.tilePadding` inset.
- Fixed height: `CarlibSpacing.tileHeight` (180pt), `maxWidth: .infinity`.

**Variants.**
| Variant | Background | Title color | Subtitle color | Decorative icon color |
|---|---|---|---|---|
| `.primary` | `tilePrimary` (`#F5B700`) | `carlibDark` | `.black.opacity(0.6)` | `.black.opacity(0.2)` |
| `.secondary` | `tileSecondary` (adaptive) | `carlibDark` | `carlibPrimaryBlue` (brand yellow) | `carlibLabel.opacity(0.4)` |

**Props.**
| Prop | Type | Default |
|---|---|---|
| `title` | `String` | — |
| `subtitle` | `String?` | `nil` |
| `icon` | `RemixIcon` | — (required decorative glyph) |
| `iconAlignment` | `.bottomLeading` / `.bottomTrailing` | `.bottomLeading` |
| `variant` | `.primary / .secondary` | `.secondary` |
| `action` | `() -> Void` | — |

**States.** `PressableButtonStyle(scale: 0.97, haptic: .light)`. No disabled state.

**Tokens consumed.** `tilePrimary`, `tileSecondary`, `carlibDark`, `carlibLabel`, `carlibPrimaryBlue`, `CarlibFont.tileTitle` (= `title3()` = 17pt Medium), `CarlibFont.tileStatus` (= `footnote()` = 13pt Regular), `CarlibSpacing.tileHeight/tilePadding`, `CarlibRadius.lg`.

---

### 3.8 CarBrandLogo

Source: `Carlib/DesignSystem/CarBrandLogo.swift`.

**Purpose.** Render a vehicle-brand mark by resolving a brand-name string against the `CarBrands` asset folder; fall back to a Remix car glyph.

**Props.**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `brand` | `String` | — | Case-insensitive, trimmed. |
| `size` | `CGFloat` | `32` | Square. |

**Anatomy.** `Image(assetName).resizable().scaledToFit()` at `size × size`, or `RemixIcon.carLine` at `size * 0.6` colored `carlibSecondary`.

**Supported brands** (`CarBrandLogo.swift:25-49`): Peugeot, Renault, Volkswagen (`vw` alias), Citroën (`citroen` alias), BMW, Mercedes (`mercedes` / `mercedes-benz` / `mercedes benz` aliases → `mercedes_benz` asset), Toyota, Ford, Fiat, Opel, Audi, Dacia, Tesla, Hyundai, Kia, Nissan, SEAT, Škoda (`skoda` / `škoda` → `skoda`).

Assets verified present in `Carlib/Resources/Assets.xcassets/CarBrands/`.

**A11y.** No `.accessibilityLabel`; decorative.

---

### 3.9 DummyImage

Source: `Carlib/DesignSystem/DummyImage.swift`.

**Purpose.** Network-loaded placeholder image for prototyping, seeded deterministically so the same entity always resolves to the same image.

**Kinds.**
| Kind | URL template | Notes |
|---|---|---|
| `.garage` | `https://picsum.photos/seed/{cleanSeed}/{pixelWidth}/{pixelHeight}` | Generic stock photo. |
| `.person` | `https://i.pravatar.cc/{pixelWidth}?img={1...70}` | Real-face avatars; index derived from `abs(seed.hashValue) % 70 + 1`. |

**Props.**
| Prop | Type | Default |
|---|---|---|
| `kind` | `.garage / .person` | — |
| `seed` | `String` | — |
| `pixelWidth` | `Int` | `600` |
| `pixelHeight` | `Int` | `400` |

**States.**
- `.success` — `.resizable().aspectRatio(contentMode: .fill)`.
- `.empty` / `.failure` — placeholder `Rectangle().fill(tileSecondary)` with overlay `RemixIcon.storeFill` (garage) or `.userFill` (person) at 22pt, `carlibLabel.opacity(0.6)`.

**Prototyping-only.** Swap with real imagery before production.

---

### 3.10 PressableButtonStyle

Source: `Carlib/DesignSystem/CarlibButtonStyle.swift`.

Documented in §1.6. Consumed by every custom button in the system either directly (`.buttonStyle(.pressable(...))`) or implicitly (through `CarlibButton`, `PolestarTile`).

---

### 3.11 ClaimCardView (composite)

Source: `Carlib/Views/Shared/ClaimCardView.swift`.

**Purpose.** Row-style summary of a claim. Three actions modes; optional photo strip with lightbox.

**Anatomy (left → right).**
1. **Status color bar** — 4pt × full-height rectangle, fill = status foreground color.
2. **Content column** (padding: leading 14, trailing 16, vertical 14):
   a. Top row — `CarlibStatusBadge(claimStatus:)` + relative date (`caption`, `carlibSecondary`).
   b. Main row — 44pt circle with accident-type glyph (status fg at 20pt, bg `statusColor.opacity(0.12)`) + title (`body(.medium)`, `carlibDark`) + description (`caption`, `carlibSecondary`, 2-line clamp).
   c. Optional photo strip (up to 3 thumbs + `+N` overflow).
   d. Optional vehicle meta row (16pt `CarBrandLogo` + brand/model · plate).
   e. Optional garage row (`mapPinLine` 14pt brand-yellow + garage name, `caption(.medium)`).
   f. Optional actions row (see below).
3. Shell: `tileSecondary` background, `RoundedRectangle(cornerRadius: 14)` clip.

**Actions modes.**

| Mode | Visual |
|---|---|
| `.none` | No actions row. |
| `.request(accept, decline)` | Divider + two capsule buttons (40pt height). **Decline**: `carlibScreenBg` capsule fill, `carlibDark` text. **Accept**: `brandYellow` capsule fill, `.black` text, trailing `checkLine` at 14pt. `UISelectionFeedbackGenerator` on decline, `UINotificationFeedbackGenerator.success` on accept. |
| `.inProgress(currentStatus, update)` | Divider + pressable row with circular `toolsFill` badge (28pt on `brandYellow.opacity(0.14)`), two-line text ("Current stage" + status name), and a compact "Update" capsule chip with trailing arrow. |

**Photo strip.**
- Up to 3 thumbnails, each 56×56pt, `RoundedRectangle(cornerRadius: 10)`.
- `+N` overflow chip same size, `carlibScreenBg` fill, `caption(.medium)` label.
- With `enablePhotoLightbox: true`, thumbnail tap opens a `PhotoLightboxView` `.fullScreenCover`; long-press reveals a 320×320 context-menu preview.
- Without local `imageData`, loads `https://picsum.photos/seed/{photo.id}/200/200` (thumb) or `/800/800` (preview). `ClaimCardView.swift:250, 280`.

**Tokens consumed.** All status FG colors, `brandYellow`, `carlibDark`, `carlibSecondary`, `carlibLabel`, `carlibCardBorder`, `carlibScreenBg`, `tileSecondary`, `CarlibFont.caption/body/callout`, `CarlibStatusBadge`, `CarBrandLogo`, `PressableButtonStyle` overrides.

---

### 3.12 GarageCardView (composite)

Source: `Carlib/Views/Shared/GarageCardView.swift`.

**Variants.**
| Variant | Layout | Fixed width | Shell |
|---|---|---|---|
| `.compact` | Vertical stack: 160×90 photo → name → distance. | 160pt | `CarlibCard(.elevated)` |
| `.full` | Horizontal: 80×80 photo → name / distance / up-to-3 specialty chips / availability indicator. | flexible | `CarlibCard(.flat)` |

**Chip anatomy** (`.full` only). `caption` label on `Color(.systemGray6)` capsule with 8pt horizontal, 2pt vertical padding. Note: `.systemGray6` is a UIKit system color — **not a Carlib token**. See Gaps.

**Availability indicator.** 8pt circle, `statusCompleted` (available) or `statusCancelled` (unavailable), + `caption` label.

**Tokens consumed.** `CarlibCard`, `DummyImage`, `CarlibFont.bodySmall/bodyLarge/caption`, `CarlibRadius.sm`, `statusCompleted`, `statusCancelled`, `CarlibSpacing.xxs/xs/md/sm`. Uses system `.secondary` foreground, not `carlibSecondary`.

---

### 3.13 StatusTimelineView (composite)

Source: `Carlib/Views/Shared/StatusTimelineView.swift`.

**Purpose.** Horizontal stepper (Uber/delivery-style) with 5 stops for a claim journey.

**Anatomy.**
- Row 1: alternating `stepDot(for:)` circles and 2pt horizontal rectangles filling gaps. Line color: `statusCompleted` when the preceding step is complete, else `carlibCardBorder`.
- Row 2: per-step `VStack` with short label (`caption`, weight `.medium` if current, `.regular` otherwise) and optional date (`system(size: 10)`, `carlibSecondary`).

**Step dot by state.**
| State | Visual |
|---|---|
| `.completed` | 22pt `statusCompleted` circle with `checkLine` 12pt white glyph. |
| `.current` | 28pt `brandYellow.opacity(0.2)` halo + 16pt `brandYellow` inner circle. |
| `.upcoming` | 14pt `carlibCardBorder` circle. |

**Convenience initializer.** `init(claim:)` builds the 5-step list `[Submitted → Matched → Accepted → Repair → Done]` and derives `.completed` / `.current` / `.upcoming` per index.

**Tokens consumed.** `statusCompleted`, `brandYellow`, `carlibCardBorder`, `carlibDark`, `carlibLabel`, `carlibSecondary`, `CarlibFont.caption`, raw `system(size: 10)` for date (inconsistent — see Gaps).

---

## 4. Status systems

Three enums define lifecycle states and drive badge colors, timeline states, and claim card bars. All backing raw values are French strings (legacy from the original bilingual plan); display names come from `L10n.*StatusLabel.*`.

### 4.1 ClaimStatus

Source: `Carlib/Models/ClaimStatus.swift`. **9 states**, mapped to 5 journey stages via `stageIndex`.

| Case | Raw | Stage | Badge FG | Badge Bg | Badge icon |
|---|---|---|---|---|---|
| `.draft` | `brouillon` | 1 | `statusDraft` | `statusDraftBg` | `pencilLine` |
| `.submitted` | `soumis` | 1 | `statusSubmitted` | `statusSubmittedBg` | `sendPlaneFill` |
| `.matched` | `en_recherche` | 2 | `statusMatched` | `statusMatchedBg` | `searchLine` |
| `.accepted` | `accepte` | 3 | `statusAccepted` | `statusAcceptedBg` | `checkboxCircleFill` |
| `.inProgress` | `pris_en_charge` | 3 | `statusInProgress` | `statusInProgressBg` | `carFill` |
| `.repairing` | `en_reparation` | 4 | `statusRepairing` | `statusRepairingBg` | `toolsFill` |
| `.completed` | `termine` | 5 | `statusCompleted` | `statusCompletedBg` | `verifiedBadgeFill` |
| `.cancelled` | `annule` | 0 | `statusCancelled` | `statusCancelledBg` | `closeCircleFill` |
| `.expired` | `expire` | 0 | `statusExpired` | `statusExpiredBg` | `timeFill` |

Total stages for journey UI: `5`. Source: `ClaimStatus.swift:43`.

### 4.2 BookingStatus

Source: `Carlib/Models/BookingStatus.swift`. **7 states.** Shares color tokens with `ClaimStatus`.

| Case | Raw | Badge FG | Badge Bg | Badge icon |
|---|---|---|---|---|
| `.pending` | `en_attente` | `statusMatched` | `statusMatchedBg` | `timeFill` |
| `.confirmed` | `confirme` | `statusAccepted` | `statusAcceptedBg` | `checkboxCircleFill` |
| `.arrivedAtGarage` | `arrive` | `statusInProgress` | `statusInProgressBg` | `mapPinFill` |
| `.vehicleDroppedOff` | `depose` | `statusCompleted` | `statusCompletedBg` | `carFill` |
| `.rescheduled` | `replanifie` | `statusMatched` | `statusMatchedBg` | `calendarScheduleLine` |
| `.cancelledByDriver` | `annule_conducteur` | `statusCancelled` | `statusCancelledBg` | `closeCircleFill` |
| `.cancelledByGarage` | `annule_garage` | `statusCancelled` | `statusCancelledBg` | `closeCircleFill` |

### 4.3 RepairStatus

Source: `Carlib/Models/RepairStatus.swift`. **5 states** (sub-states within `inProgress` / `repairing` claims).

| Case | Raw | Badge FG | Badge Bg | Badge icon |
|---|---|---|---|---|
| `.diagnostic` | `diagnostic` | `statusSubmitted` | `statusSubmittedBg` | `stethoscopeLine` |
| `.waitingParts` | `attente_pieces` | `statusMatched` | `statusMatchedBg` | `archiveFill` |
| `.repairing` | `en_cours` | `statusRepairing` | `statusRepairingBg` | `toolsFill` |
| `.qualityCheck` | `controle` | `statusInProgress` | `statusInProgressBg` | `shieldCheckFill` |
| `.readyForPickup` | `pret` | `statusCompleted` | `statusCompletedBg` | `thumbUpFill` |

### 4.4 Timeline state palette

| Step state | Dot visual | Connector |
|---|---|---|
| `completed` | 22pt `statusCompleted` + white `checkLine` | `statusCompleted` 2pt line |
| `current` | 28pt `brandYellow.opacity(0.2)` halo + 16pt `brandYellow` core | n/a (next connector is `carlibCardBorder`) |
| `upcoming` | 14pt `carlibCardBorder` | `carlibCardBorder` 2pt line |

---

## 5. Figma library plan

### Collections and modes

Create a single Carlib variable collection with modes **Light** and **Dark**.

- **Color collection — modes: Light, Dark.** Every `adaptive(...)` token becomes one variable with two mode values. Fixed-value tokens (e.g. `carlibPrimaryBlue`, `destructiveRed`, all status foreground colors) are published as the same value in both modes so callsites can reference them without branching.
- **Dimension collection — single mode.** Spacing, radius, sizing, tile heights, touch targets.
- **Typography** — text styles, not variables. Build as composed styles referencing font variables (family / size / weight).

### Variable naming

Use slash hierarchy (Figma's native grouping):

```
color/brand/primary                 → carlibPrimaryBlue / brandYellow
color/brand/primary-pressed         → carlibPrimaryDarkBlue
color/brand/primary-tint            → carlibPrimaryLightBlue

color/surface/screen                → carlibScreenBg
color/surface/tile                  → tileSecondary
color/surface/tile-primary          → tilePrimary
color/surface/accent                → carlibAccent
color/border/card                   → carlibCardBorder

color/text/primary                  → carlibDark
color/text/secondary                → carlibSecondary
color/text/label                    → carlibLabel
color/text/tab-inactive             → carlibTabInactive

color/status/draft/fg               → statusDraft
color/status/draft/bg               → statusDraftBg
… (submitted, matched, accepted, in-progress, repairing, completed, cancelled, expired)

color/semantic/destructive/fg       → destructiveRed
color/semantic/destructive/bg       → destructiveRedBg

space/xxs … space/huge              → CarlibSpacing
space/screen-horizontal             → screenHorizontal
space/card-padding                  → cardPadding
space/section                       → sectionSpacing
space/tile/gap|height|padding       → tile*
size/min-touch-target               → minTouchTarget

radius/xs | sm | md | lg | xl | full → CarlibRadius
```

Text styles: `text/largeTitle`, `text/title1`, `text/title2`, `text/title3`, `text/body`, `text/callout`, `text/footnote`, `text/caption`, `text/hero-number`, `text/amount`. Each style specifies `Aeonik-{Weight}` family + size. Record the "titles default to Medium" rule in the library description.

### Component sets vs single components

| Figma unit | Carlib components | Variant properties |
|---|---|---|
| Component set | `Button` | `variant` (primary / secondary / ghost / destructive), `state` (default / pressed / disabled / loading), `has-icon` (bool). |
| Component set | `TextField` | `type` (text / secure), `state` (default / focused / filled / error), `has-error` (bool), `has-hint` (bool). |
| Component set | `Card` | `variant` (flat / elevated). |
| Component set | `Status Badge` | `status` (9 claim + 7 booking + 5 repair = 21 variants), `with-icon` (bool). |
| Component set | `Polestar Tile` | `variant` (primary / secondary), `icon-alignment` (bottomLeading / bottomTrailing), `has-subtitle` (bool). |
| Component set | `Claim Card` | `actions` (none / request / inProgress), `has-photos` (bool), `has-garage` (bool). |
| Component set | `Garage Card` | `variant` (compact / full). |
| Component set | `Timeline` | `step-state` (completed / current / upcoming) as a nested step component; the parent is a 5-stop layout. |
| Single component | `Section Header` | slot for optional action label. |
| Single component | `Car Brand Logo` | with an exposed `brand` text field; logos as library images. |
| Single component | `Dummy Image` | placeholder-only; marked as prototype asset. |

### Iconography

Publish the full Remixicon set (3,229 glyphs) as a Figma library asset page, keyed by the enum case names in `RemixIcon.swift`. Follow the existing subscribed team library "HT icon lib (Copy)" as the delivery target — do not duplicate if it already hosts the set.

### Motion

Figma cannot express `PressableButtonStyle` fidelity (spring + haptic). Document the press feedback as a specification note attached to every interactive component: `scale 0.96 · spring(response 0.28, damping 0.72) · UIImpactFeedbackGenerator(style: .soft)`. Prototype with a "smart animate" 150ms ease, clearly labeled as approximation.

### Things that don't express cleanly in Figma

- **Adaptive fills on `CarlibButton.primary` / `.secondary`** — currently driven by `@Environment(\.colorScheme)` rather than tokens. Express by splitting each variant into mode-aware fill tokens (`color/button/primary/bg` = black in Light, white in Dark).
- **Haptic feedback** — not representable. Note inline.
- **`DummyImage`** network behaviour — represent as static placeholder.
- **`.systemGray6`** chip fill in `GarageCardView` — this is a UIKit system color that Figma can't pick up. Replace with an explicit token before exporting (see Gaps).

---

## 6. Gaps & inconsistencies

Findings flagged during the audit. None were normalized in code — they are listed so the Figma build can make explicit decisions and the codebase can schedule cleanup.

### Colors

1. **Dead asset-catalog color references.** `CarlibColors.swift:5-26` declares `Color("CarlibPrimary")`, `Color("CarlibSuccess")`, `Color("CarlibBackground")`, etc., but there are **no color sets** in `Carlib/Resources/Assets.xcassets/Colors/` (the directory is empty). Any code path using these `Color(...)` initializers will render black at runtime. Consumers in the codebase don't appear to use them — but they should be deleted or backed by assets.
2. **Misleading legacy naming.** Primary brand tokens are named `carlibPrimaryBlue`, `carlibPrimaryDarkBlue`, `carlibPrimaryLightBlue` yet the actual color is golden yellow (`#F5B700`). The doc comments admit this. Consider renaming to `carlibPrimary{,Dark,Light}` for the next refactor. Figma names should use the cleaner `color/brand/primary*` path.
3. **`destructiveRedBg`** equals `statusCancelledBg`. If intent is different, introduce distinct values; otherwise collapse.
4. **`carlibTabInactive`** has identical RGB to `carlibLabel`. Consolidate or keep distinct intentionally.
5. **Status FG colors are fixed across modes.** This means e.g. `statusSubmitted = #6194F2` sits on both light (`#EBF2FF`) and dark (`#0F1A2E`) backgrounds. Contrast in dark mode is acceptable but should be verified (WCAG AA, see Accessibility notes below).
6. **`GarageCardView` uses `Color(.systemGray6)`** for specialty chips (line 85). This is a UIKit system color, not a Carlib token. Replace with `tileSecondary` or introduce a `color/surface/chip` token.
7. **Hardcoded `.black` / `.white` in components.** `CarlibButton` uses `.black` / `.white` directly (lines 52-56, 61-65). `PolestarTile.primary` uses `.black.opacity(0.2)` / `.black.opacity(0.6)`. These are intentional (text on a brand-yellow surface stays black in both modes), but document them as "on-yellow" tokens in Figma (e.g. `color/text/on-primary`, `color/text/on-primary/muted`).

### Radius

8. **Hardcoded radii bypass tokens.** `CarlibTextField.swift:29` and `CarlibSecureField.swift:43` use `cornerRadius: 12` — should be `CarlibRadius.md`. `ClaimCardView.swift:94` uses `14` (not a token), `:226, 242` use `10` (not a token). Consider adding `radius/card-shell` (14) and `radius/thumbnail` (10), or adjusting to existing tokens.

### Typography

9. **Raw `system(size: 10)` in StatusTimelineView** (`:47`). Below the smallest token (`caption` = 13pt). Either introduce a smaller caption token or lift the date to 13pt for consistency (and accessibility).
10. **Mixed legacy vs canonical font APIs.** New components (`PolestarTile`, `GarageCardView`, `CarlibSectionHeader`) still call `tileTitle()`, `tileStatus()`, `bodyLarge()`, `bodySmall()`, `headingSmall()`. Figma should expose only the canonical scale; codebase cleanup to follow.
11. **Semibold silently becomes bold.** The weight mapper collapses `.semibold`, `.bold`, `.heavy`, `.black` to Aeonik-Bold. If a semibold weight is ever needed, add `Aeonik-SemiBold.otf` and branch the map.

### Components

12. **`CarlibTextField` / `CarlibSecureField` have no focus-state styling.** `@FocusState` is captured but not visualized. Designers will expect a focused vs default visual in Figma — decide whether to add (e.g. border stroke in `brandYellow`) or explicitly document "no focus ring".
13. **No disabled state for `CarlibTextField` / `CarlibSecureField` / `PolestarTile` / `CarlibCard`.** Only `CarlibButton` handles `isDisabled`.
14. **`CarlibStatusBadge` size is not variable-driven.** Single size (13pt text, 8/4pt padding). No `sm` / `md` variants. Fine for now; document.
15. **`CarlibSectionHeader` uses `bodySmall(.medium)` for its action label** (13pt Medium, brand-yellow). Other "inline action" treatments elsewhere use `callout(.medium)` (14pt). Unify.

### Accessibility

16. **Icon-only buttons lack labels.** Password reveal toggle, lightbox close. Add `.accessibilityLabel(...)`.
17. **Status badges do not announce context.** VoiceOver reads the status word alone ("Submitted") without "Status:" prefix.
18. **`CarlibButton.isLoading` does not announce busy state.** Consider `.accessibilityAddTraits(.updatesFrequently)` or `accessibilityLabel("Loading")`.
19. **Touch target of `CarlibStatusBadge` and inline 40pt capsule buttons** in `ClaimCardView` (Decline / Accept) falls below the stated `minTouchTarget` of 48pt.
20. **Contrast check pending.** Status FG/Bg pairs look fine at a glance but have not been formally audited to WCAG AA (4.5:1 normal, 3:1 large). Run contrast audit before Figma publish — the Figma library description should call out known pairs that pass and any that may need tuning.

### Build / assets

21. **The `Assets.xcassets/Colors` folder is empty.** Remove the empty folder or populate it with the legacy color sets so `Color("Carlib*")` references work.
22. **No shadow tokens exist.** If future cards/overlays need shadow, introduce a small `CarlibShadow` enum rather than ad-hoc `.shadow(...)` calls.

---

## Appendix — files audited

- `Carlib/DesignSystem/CarlibColors.swift`
- `Carlib/DesignSystem/CarlibTypography.swift`
- `Carlib/DesignSystem/CarlibSpacing.swift`
- `Carlib/DesignSystem/CarlibRadius.swift`
- `Carlib/DesignSystem/CarlibButtonStyle.swift`
- `Carlib/DesignSystem/CarBrandLogo.swift`
- `Carlib/DesignSystem/DummyImage.swift`
- `Carlib/DesignSystem/LucideIcon.swift`
- `Carlib/DesignSystem/RemixIcon.swift`
- `Carlib/DesignSystem/Components/CarlibButton.swift`
- `Carlib/DesignSystem/Components/CarlibTextField.swift`
- `Carlib/DesignSystem/Components/CarlibSecureField.swift`
- `Carlib/DesignSystem/Components/CarlibCard.swift`
- `Carlib/DesignSystem/Components/CarlibStatusBadge.swift`
- `Carlib/DesignSystem/Components/CarlibSectionHeader.swift`
- `Carlib/DesignSystem/Components/PolestarTile.swift`
- `Carlib/Views/Shared/ClaimCardView.swift`
- `Carlib/Views/Shared/GarageCardView.swift`
- `Carlib/Views/Shared/StatusTimelineView.swift`
- `Carlib/Views/Shared/PhotoLightboxView.swift`
- `Carlib/Models/ClaimStatus.swift`
- `Carlib/Models/BookingStatus.swift`
- `Carlib/Models/RepairStatus.swift`
- `Carlib/Resources/Assets.xcassets/` (verified Colors subfolder is empty; CarBrands populated)
- `project.yml` (font registration)
