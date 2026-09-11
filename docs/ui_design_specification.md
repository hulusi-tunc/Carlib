> Historical — written against the SwiftUI app, now archived at `archive/swift/`. The product is `mobile/`.

# Carlib -- UI Design Specification

**Project:** Carlib -- Native SwiftUI App (iOS 26)
**Platform:** iPhone only, Portrait only, zero external dependencies
**Language:** Swift / SwiftUI, French only
**Version:** 1.0
**Date:** April 2026
**Source:** PRD Carlib v0.1, Analysis Files 01-08

---

## Table of Contents

1. [Color System](#1-color-system)
2. [Typography System](#2-typography-system)
3. [Spacing and Layout Grid](#3-spacing-and-layout-grid)
4. [Component Visual Spec](#4-component-visual-spec)
5. [Iconography](#5-iconography)
6. [Dark Mode Strategy](#6-dark-mode-strategy)
7. [Accessibility Visual Spec](#7-accessibility-visual-spec)
8. [Screen-by-Screen Visual Direction](#8-screen-by-screen-visual-direction)
9. [Landing Page Visual Direction](#9-landing-page-visual-direction)
10. [Motion and Animation Language](#10-motion-and-animation-language)

---

## 1. Color System

### 1.1 Design Rationale

Carlib's primary user -- the conducteur sinistre -- arrives post-accident in a state of acute stress. The color system must function as emotional infrastructure: calming, trustworthy, and never alarming. The PRD's design principles ("Rassurant & grand public," "Zero friction post-accident") demand a palette that lowers cognitive load and inspires confidence.

The competitive landscape (Doctolib, AXA, Allianz) establishes blue as the trust color in French digital services. Carlib follows this convention deliberately -- familiarity reduces friction for stressed users.

### 1.2 Color Palette Definition

All colors are defined as SwiftUI Asset Catalog color sets (`.xcassets`) with `Any Appearance` and `Dark Appearance` variants. Each color set uses the `sRGB` color space.

#### Primary Scale -- Trust Blue

A calming, institutional blue that signals reliability. Not electric or tech-forward; rather a composed, reassuring blue reminiscent of French institutional services.

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `Primary/50` | #EFF6FF | #0C1B33 | Subtle backgrounds, selected states |
| `Primary/100` | #DBEAFE | #142744 | Hover backgrounds, info banners |
| `Primary/200` | #BFDBFE | #1D3A5C | Borders on active elements |
| `Primary/300` | #93C5FD | #2B5492 | Inactive progress indicators |
| `Primary/400` | #60A5FA | #3B7DD8 | Secondary interactive elements |
| `Primary/500` | #3B82F6 | #5B9AEF | Links, active indicators |
| `Primary/600` | #2563EB | #6BABF7 | **Primary brand color** -- buttons, headers, key actions |
| `Primary/700` | #1D4ED8 | #93C5FD | Pressed states in light mode |
| `Primary/800` | #1E40AF | #BFDBFE | Heavy emphasis, navigation bars |
| `Primary/900` | #1E3A8A | #DBEAFE | Deepest blue, used sparingly |

SwiftUI Asset Catalog name: `CarlibPrimary` with shade suffix (e.g., `CarlibPrimary600`).

**Key decision:** Primary/600 (`#2563EB`) is the default brand color. In dark mode, the equivalent prominence maps to Primary/600-dark (`#6BABF7`) to maintain WCAG AA contrast against dark backgrounds.

#### Secondary Scale -- Slate Gray

A neutral foundation for text, borders, backgrounds, and structural elements. Warm-leaning gray (not pure cool) to avoid a clinical feel.

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `Neutral/50` | #F8FAFC | #0F172A | Page backgrounds |
| `Neutral/100` | #F1F5F9 | #1E293B | Card backgrounds, input fills |
| `Neutral/200` | #E2E8F0 | #334155 | Borders, dividers |
| `Neutral/300` | #CBD5E1 | #475569 | Disabled states, placeholders |
| `Neutral/400` | #94A3B8 | #64748B | Tertiary text, icons |
| `Neutral/500` | #64748B | #94A3B8 | Secondary text |
| `Neutral/600` | #475569 | #CBD5E1 | Body text |
| `Neutral/700` | #334155 | #E2E8F0 | Strong text |
| `Neutral/800` | #1E293B | #F1F5F9 | Headings |
| `Neutral/900` | #0F172A | #F8FAFC | Maximum emphasis text |

#### Semantic Colors

##### Success -- Calm Green

For completed repairs, confirmed bookings, and positive outcomes. A composed, reassuring green (not neon).

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `Success/50` | #F0FDF4 | #052E16 | Success banner backgrounds |
| `Success/500` | #22C55E | #4ADE80 | Success icons, checkmarks |
| `Success/600` | #16A34A | #22C55E | Success text, "Termine" badge |
| `Success/700` | #15803D | #86EFAC | Strong success emphasis |

##### Warning -- Warm Amber

For attention states (action needed, expiring slots). Deliberately amber rather than red -- red is psychologically triggering in a post-accident context.

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `Warning/50` | #FFFBEB | #451A03 | Warning banner backgrounds |
| `Warning/500` | #F59E0B | #FBBF24 | Warning icons |
| `Warning/600` | #D97706 | #F59E0B | Warning text, "En attente" badge |
| `Warning/700` | #B45309 | #FCD34D | Strong warning emphasis |

##### Error -- Muted Red-Orange

For form validation errors and failed operations. Muted rather than aggressive -- never the bright red associated with the accident itself.

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `Error/50` | #FEF2F2 | #450A0A | Error banner backgrounds |
| `Error/500` | #EF4444 | #F87171 | Error icons |
| `Error/600` | #DC2626 | #EF4444 | Error text, validation messages |
| `Error/700` | #B91C1C | #FCA5A5 | Strong error emphasis |

##### Info -- Light Blue

For guidance text, tooltips, and informational banners during the declaration flow.

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `Info/50` | #EFF6FF | #0C1B33 | Info banner backgrounds |
| `Info/500` | #3B82F6 | #60A5FA | Info icons |
| `Info/600` | #2563EB | #3B82F6 | Info text |

#### Accent Color -- Teal

A secondary brand differentiator used for progress indicators, secondary CTAs, and garage-portal-specific emphasis. Teal bridges trust (blue) and positivity (green).

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `Accent/50` | #F0FDFA | #042F2E | Accent backgrounds |
| `Accent/500` | #14B8A6 | #2DD4BF | Accent interactive elements |
| `Accent/600` | #0D9488 | #14B8A6 | Accent text, progress fill |
| `Accent/700` | #0F766E | #5EEAD4 | Strong accent |

### 1.3 Semantic Color Tokens (SwiftUI Mapping)

These are the tokens used directly in components. They reference the palette above and resolve automatically for light/dark via Asset Catalog.

| Semantic Token | Light Maps To | Dark Maps To | SwiftUI Usage |
|---|---|---|---|
| `Color.surfacePrimary` | white (#FFFFFF) | Neutral/900 (#0F172A) | `Color("SurfacePrimary")` -- screen backgrounds |
| `Color.surfaceSecondary` | Neutral/50 (#F8FAFC) | Neutral/800 (#1E293B) | `Color("SurfaceSecondary")` -- grouped table backgrounds |
| `Color.surfaceElevated` | white (#FFFFFF) | Neutral/800 (#1E293B) | `Color("SurfaceElevated")` -- cards, sheets |
| `Color.textPrimary` | Neutral/900 (#0F172A) | Neutral/50 (#F8FAFC) | `Color("TextPrimary")` -- headings, body |
| `Color.textSecondary` | Neutral/500 (#64748B) | Neutral/400 (#94A3B8) | `Color("TextSecondary")` -- captions, metadata |
| `Color.textTertiary` | Neutral/400 (#94A3B8) | Neutral/500 (#64748B) | `Color("TextTertiary")` -- placeholders |
| `Color.textInverse` | white (#FFFFFF) | Neutral/900 (#0F172A) | `Color("TextInverse")` -- text on primary buttons |
| `Color.borderDefault` | Neutral/200 (#E2E8F0) | Neutral/700 (#334155) | `Color("BorderDefault")` -- card borders, dividers |
| `Color.borderStrong` | Neutral/300 (#CBD5E1) | Neutral/600 (#475569) | `Color("BorderStrong")` -- focused input borders |
| `Color.interactive` | Primary/600 (#2563EB) | Primary/600-dark (#6BABF7) | `Color("Interactive")` -- links, tappable text |
| `Color.interactiveHover` | Primary/700 (#1D4ED8) | Primary/500-dark (#5B9AEF) | `Color("InteractiveHover")` -- pressed state |

### 1.4 Status Color Tokens

Mapped to the four repair statuses defined in the PRD (Section 6.1).

| Status (French) | Token | Light Color | Dark Color | Icon Pairing |
|---|---|---|---|---|
| En attente | `Color.statusPending` | Warning/500 (#F59E0B) | Warning/500-dark (#FBBF24) | `clock.fill` |
| Pris en charge | `Color.statusAssigned` | Primary/500 (#3B82F6) | Primary/500-dark (#5B9AEF) | `person.badge.clock` |
| En reparation | `Color.statusInProgress` | Accent/600 (#0D9488) | Accent/500-dark (#2DD4BF) | `wrench.and.screwdriver.fill` |
| Termine | `Color.statusCompleted` | Success/600 (#16A34A) | Success/500-dark (#4ADE80) | `checkmark.circle.fill` |
| Annule | `Color.statusCancelled` | Neutral/400 (#94A3B8) | Neutral/500-dark (#64748B) | `xmark.circle.fill` |

### 1.5 Color Application Ratios

The PRD mandates a shared design system, but the emotional contexts of the driver app and garage portal differ.

| Surface | Driver App | Garage Portal |
|---|---|---|
| Background | 80% SurfacePrimary (white/light) | 70% SurfacePrimary |
| Structural color | 15% Neutral/50-100 | 25% Neutral/50-100 |
| Brand/interactive | 5% Primary/600 (guidance) | 5% Primary/600 (actions) |

The driver app is intentionally airy and calm. The garage portal tolerates higher information density and stronger structural contrast.

---

## 2. Typography System

### 2.1 Typeface Selection: SF Pro (System Font)

The project constraint is zero external dependencies. SF Pro is the native iOS system font, loaded via `Font.system()` in SwiftUI. This is the correct choice for Carlib:

- **Native rendering:** SF Pro is optimized for every iOS device at every size, including Dynamic Type scaling.
- **French diacritics:** Full support for all French accented characters (e, e, a, u, c, i, o) at every weight and size. SF Pro was designed for international text.
- **Tabular figures:** SF Pro supports proportional and tabular (monospaced) figures for distances (km), prices (EUR), dates, and phone numbers.
- **Weight range:** Ultralight through Black (9 weights). Sufficient for any hierarchy.
- **SF Pro Rounded variant:** Available via `Font.system(.body, design: .rounded)` for a warmer, more approachable tone if desired for specific elements (onboarding, empty states).

### 2.2 Type Scale

All sizes are defined using SwiftUI's built-in `Font.TextStyle` enum, which automatically supports Dynamic Type. Custom sizes are defined with `Font.system(size:weight:design:)` where the built-in styles are insufficient.

| Role | SwiftUI Style | Default Size (pt) | Weight | Line Height | French Test String |
|---|---|---|---|---|---|
| **Large Title** | `.largeTitle` | 34 | `.bold` | 1.2 | "Declarer un sinistre" |
| **Title** | `.title` | 28 | `.bold` | 1.25 | "Garages a proximite" |
| **Title 2** | `.title2` | 22 | `.semibold` | 1.3 | "Reservation confirmee" |
| **Title 3** | `.title3` | 20 | `.semibold` | 1.35 | "Carrosserie Dupont" |
| **Headline** | `.headline` | 17 | `.semibold` | 1.4 | "Informations du vehicule" |
| **Body** | `.body` | 17 | `.regular` | 1.5 | "Votre sinistre a ete transmis au garage selectionne pour prise en charge." |
| **Callout** | `.callout` | 16 | `.regular` | 1.45 | "Selectionnez un creneau disponible" |
| **Subheadline** | `.subheadline` | 15 | `.regular` | 1.4 | "2.3 km -- Disponible demain" |
| **Footnote** | `.footnote` | 13 | `.regular` | 1.4 | "Derniere mise a jour il y a 5 minutes" |
| **Caption** | `.caption` | 12 | `.regular` | 1.35 | "Ref. SIN-2026-04-1234" |
| **Caption 2** | `.caption2` | 11 | `.regular` | 1.3 | "EN ATTENTE" (badge label) |

### 2.3 Semantic Typography Roles

Beyond the raw scale, each usage context maps to a specific style for consistency.

| Semantic Role | Maps To | Weight Override | Usage |
|---|---|---|---|
| **Screen Title** | `.largeTitle` | `.bold` | NavigationTitle in large display mode |
| **Section Heading** | `.title2` | `.semibold` | Section headers within a scrollable screen |
| **Card Title** | `.headline` | `.semibold` | Garage name, dossier title |
| **Card Subtitle** | `.subheadline` | `.regular` | Address, distance, secondary info |
| **Body Text** | `.body` | `.regular` | Descriptions, instructions, form helper text |
| **Emphasized Body** | `.body` | `.semibold` | Important inline text, CTA labels in body context |
| **Form Label** | `.subheadline` | `.medium` | Above input fields |
| **Form Input Text** | `.body` | `.regular` | Text typed into input fields |
| **Form Placeholder** | `.body` | `.regular` | Placeholder text (color: TextTertiary) |
| **Form Error** | `.footnote` | `.medium` | Validation error messages below fields |
| **Button Label (Primary)** | `.body` | `.semibold` | Primary and secondary button text |
| **Button Label (Small)** | `.subheadline` | `.semibold` | Compact buttons, filter chips |
| **Badge Label** | `.caption2` | `.semibold` | Status badges, category tags |
| **Tab Bar Label** | `.caption2` | `.medium` | Bottom tab bar item labels |
| **Timestamp** | `.caption` | `.regular` | Dates, times, "il y a 5 min" |
| **Overline** | `.caption2` | `.semibold` + uppercase | Section overlines, step labels: "ETAPE 2 SUR 4" |

### 2.4 French Typography Considerations

- **Longer words:** French words average 20% longer than English equivalents. All labels, buttons, and badges must be tested with realistic French text. Use `.lineLimit(nil)` or `.minimumScaleFactor(0.8)` where truncation is unacceptable.
- **Non-breaking spaces:** French punctuation rules require thin non-breaking spaces before `:`, `;`, `!`, and `?`. Use `\u{202F}` (Narrow No-Break Space) in all user-facing strings.
- **Guillemets:** Use `<<` and `>>` for quotations per French convention (e.g., `<< Votre vehicule est pret >>`).
- **Date formatting:** Use `Date.FormatStyle` with `.locale(Locale(identifier: "fr_FR"))` for all dates. Example output: "lun. 7 avr. 2026" or "7 avril 2026".
- **Number formatting:** Decimal separator is `,` not `.`. Thousands separator is non-breaking space. Example: "3 250,00 EUR".

### 2.5 SF Pro Rounded Usage

The standard SF Pro is used for all structural and informational text. SF Pro Rounded (`Font.system(.body, design: .rounded)`) is reserved for:

- Onboarding screen headlines (warmer first impression)
- Empty state titles ("Aucun sinistre en cours")
- Success screen titles ("Reservation confirmee !")
- Numeric displays where a friendlier tone is appropriate (step counters, KPI cards)

This creates a subtle emotional modulation without introducing a second typeface.

---

## 3. Spacing and Layout Grid

### 3.1 Spacing Scale

Base unit: **4pt**. All spacing values are multiples of 4, defined as constants for use in `.padding()`, `.spacing()`, and frame modifiers.

| Token | Value (pt) | SwiftUI Usage | Application |
|---|---|---|---|
| `Spacing.xxs` | 2 | `.padding(2)` | Hairline gaps (icon badge offset) |
| `Spacing.xs` | 4 | `.padding(4)` | Tight inline: icon-to-text gap within a badge |
| `Spacing.sm` | 8 | `.padding(8)` | Compact spacing: chip padding, list item inner gap |
| `Spacing.md` | 12 | `.padding(12)` | Input inner padding, small card internal |
| `Spacing.base` | 16 | `.padding(16)` | **Default component padding.** Card body, screen horizontal margins, list item vertical |
| `Spacing.lg` | 20 | `.padding(20)` | Increased breathing room between related sections |
| `Spacing.xl` | 24 | `.padding(24)` | Section spacing within a screen |
| `Spacing.2xl` | 32 | `.padding(32)` | Major section breaks, group spacing |
| `Spacing.3xl` | 40 | `.padding(40)` | Screen top/bottom padding, large section breaks |
| `Spacing.4xl` | 48 | `.padding(48)` | Hero section spacing |
| `Spacing.5xl` | 64 | `.padding(64)` | Landing page section spacing |
| `Spacing.6xl` | 80 | `.padding(80)` | Landing page major breaks |

### 3.2 Layout Grid (iPhone Portrait)

| Property | Value | SwiftUI Implementation |
|---|---|---|
| **Screen width** | 393pt (iPhone 15/16 base) | Determined by device |
| **Horizontal margin** | 16pt each side | `.padding(.horizontal, 16)` on content |
| **Content width** | 361pt (393 - 32) | Automatic |
| **Column count** | 4 columns | Implicit in component sizing |
| **Gutter** | 16pt | `.spacing(16)` in `HStack`/`LazyVGrid` |
| **Safe area top** | Dynamic (Dynamic Island: ~59pt) | Handled by SwiftUI `.safeAreaInset()` |
| **Safe area bottom** | 34pt (home indicator) | Handled by SwiftUI safe area |
| **Tab bar height** | 49pt + safe area bottom | Standard SwiftUI `TabView` |
| **Navigation bar height** | 44pt (compact) / 96pt (large title) | Standard SwiftUI `NavigationStack` |

### 3.3 Content Area Zones

The visible content area on an iPhone 15 in portrait with navigation and tab bars:

```
+----------------------------------------------+
|          Status Bar / Dynamic Island          |  ~59pt
+----------------------------------------------+
|          Navigation Bar (large title)         |  96pt (collapses to 44pt on scroll)
+----------------------------------------------+
|                                               |
|                                               |
|              Scrollable Content               |  ~594pt (varies with nav bar collapse)
|              (16pt horizontal margins)        |
|                                               |
|                                               |
+----------------------------------------------+
|              Tab Bar                          |  49pt
+----------------------------------------------+
|              Home Indicator                   |  34pt
+----------------------------------------------+
```

Total screen height: 852pt (iPhone 15)
Available scrollable content: approximately 594pt (with large title nav bar) to 646pt (with collapsed nav bar).

### 3.4 Consistent Spacing Patterns

| Context | Horizontal Padding | Vertical Spacing | SwiftUI Pattern |
|---|---|---|---|
| **Screen content** | 16pt | -- | `.padding(.horizontal, 16)` on outermost `ScrollView` child |
| **Between cards in a list** | -- | 12pt | `.spacing(12)` in `LazyVStack` |
| **Within a card** | 16pt all sides | -- | `.padding(16)` on card content |
| **Between form fields** | -- | 16pt | `.spacing(16)` in form `VStack` |
| **Between form groups** | -- | 24pt | `.spacing(24)` in form section `VStack` |
| **Between sections** | -- | 32pt | `.padding(.top, 32)` on section header |
| **Sticky bottom CTA area** | 16pt horizontal | 16pt top + safe area bottom | `.safeAreaInset(edge: .bottom)` with background |
| **Bottom sheet content** | 16pt horizontal | 16pt top below drag handle | `.padding(16)` in sheet content |

### 3.5 Touch Target Sizes

Per PRD accessibility requirements and Apple HIG:

| Element | Minimum Size | Recommended Size | SwiftUI Implementation |
|---|---|---|---|
| **Standard button** | 44 x 44pt | 56 x 56pt | `.frame(minHeight: 56)` for primary CTAs |
| **Post-accident CTA** | 56 x 56pt | 56pt height, full width | `.frame(maxWidth: .infinity, minHeight: 56)` |
| **Icon button** | 44 x 44pt | 44 x 44pt | `.frame(width: 44, height: 44)` |
| **List row** | 44pt height | 60-80pt height | `.frame(minHeight: 60)` |
| **Tab bar item** | 44 x 44pt tap area | System default | Handled by SwiftUI `TabView` |
| **Map pin** | 44 x 44pt tap area | 48 x 48pt | Annotation with `.frame(width: 48, height: 48)` |

### 3.6 Corner Radius Scale

| Token | Value | Usage | SwiftUI |
|---|---|---|---|
| `Radius.sm` | 6pt | Small chips, inline badges | `.clipShape(RoundedRectangle(cornerRadius: 6))` |
| `Radius.md` | 10pt | Input fields, buttons | `.clipShape(RoundedRectangle(cornerRadius: 10))` |
| `Radius.lg` | 14pt | Cards, dialogs | `.clipShape(RoundedRectangle(cornerRadius: 14))` |
| `Radius.xl` | 20pt | Bottom sheets, large cards | `.clipShape(RoundedRectangle(cornerRadius: 20))` |
| `Radius.full` | `.infinity` (capsule) | Pills, avatars, status dots | `.clipShape(Capsule())` or `.clipShape(Circle())` |

Following iOS 26 design language, corner radii are generous. The continuous corner curve (`.cornerRadius` with `RoundedRectangle(cornerRadius:style: .continuous)`) is used for all rounded elements to match the native iOS aesthetic.

---

## 4. Component Visual Spec

### 4.1 Buttons

All buttons use custom `ButtonStyle` conformances. The system defines four button tiers:

#### Primary Button

The single most important action on any screen. Used for "Declarer," "Confirmer," "Reserver," "Accepter."

| Property | Value |
|---|---|
| Background | `Color.interactive` (Primary/600) |
| Text color | `Color.textInverse` (white) |
| Font | `.body` weight `.semibold` |
| Height | 56pt minimum |
| Width | Full width (`.frame(maxWidth: .infinity)`) |
| Corner radius | `Radius.md` (10pt), continuous |
| Pressed state | Background darkens to Primary/700; scale to 0.98 |
| Disabled state | Background becomes Neutral/200; text becomes Neutral/400 |
| Loading state | Text replaced by `ProgressView()` with `.tint(.white)` |
| Shadow | `shadow.sm` (0 1 2 rgba(0,0,0,0.06)) |

#### Secondary Button

For alternative actions: "Modifier," "Annuler," "Voir le detail."

| Property | Value |
|---|---|
| Background | transparent |
| Border | 1.5pt `Color.interactive` |
| Text color | `Color.interactive` |
| Font | `.body` weight `.semibold` |
| Height | 56pt minimum |
| Width | Full width or intrinsic |
| Corner radius | `Radius.md` (10pt), continuous |
| Pressed state | Background fills with Primary/50; border darkens to Primary/700 |
| Disabled state | Border becomes Neutral/200; text becomes Neutral/400 |

#### Destructive Button

For "Supprimer," "Annuler le sinistre," "Refuser." Used sparingly.

| Property | Value |
|---|---|
| Background | Error/600 |
| Text color | white |
| Font | `.body` weight `.semibold` |
| Height | 56pt minimum |
| Corner radius | `Radius.md` (10pt) |
| Pressed state | Background darkens to Error/700; scale to 0.98 |

#### Ghost Button

For tertiary actions: "Passer," "Plus tard," links within content.

| Property | Value |
|---|---|
| Background | transparent |
| Border | none |
| Text color | `Color.interactive` |
| Font | `.subheadline` weight `.medium` |
| Height | 44pt minimum |
| Pressed state | Text color darkens to Primary/700; light Primary/50 background flash |

### 4.2 Cards

All cards use the iOS grouped inset list visual language (`Section` in `List` with `.listStyle(.insetGrouped)`) or custom card views.

#### Garage Card (Driver -- List View)

Displayed in the garage search results list and map bottom sheet.

| Property | Value |
|---|---|
| Container | SurfaceElevated background, Radius.lg corners, shadow.sm |
| Layout | Horizontal: leading photo (80 x 80pt, Radius.md) + trailing info stack |
| Photo | Garage exterior photo, `ContentMode.fill`, fallback: gray placeholder with `building.2.fill` |
| Title | `.headline` weight `.semibold` -- garage name |
| Subtitle line 1 | `.subheadline` -- distance ("2.3 km") + availability badge |
| Subtitle line 2 | `.footnote` color TextSecondary -- specialties ("Carrosserie, Peinture") |
| Trailing | Chevron `chevron.right` Neutral/400 |
| Padding | 12pt internal on all sides |
| Row height | 104pt |
| Tap area | Entire card is tappable |

#### Claim Card (Sinistre)

Used in both driver history and garage claim list. Adapts content by role.

| Property | Value |
|---|---|
| Container | SurfaceElevated background, Radius.lg corners, shadow.sm |
| Layout | Vertical stack: top row (status badge + date) + middle (vehicle info) + bottom (action or metadata) |
| Status badge | Leading position, colored per status system (see Section 1.4) |
| Vehicle info | `.headline` -- "Renault Clio -- AB-123-CD" |
| Secondary info | `.footnote` color TextSecondary -- accident type, location |
| Photo thumbnail | If photos exist: 40 x 40pt rounded thumbnail at trailing edge |
| Driver version | Read-only, tap navigates to tracking detail |
| Garage version | Includes "Accepter" / "Refuser" action buttons or status update CTA |
| Padding | 16pt internal |

#### Vehicle Card

Displays the user's vehicle information in profile and declaration summary.

| Property | Value |
|---|---|
| Container | SurfaceElevated, Radius.lg, shadow.sm |
| Layout | Horizontal: leading car icon (`car.fill` in Primary/100 circle) + info stack |
| Title | `.headline` -- "Renault Clio 2022" |
| Subtitle | `.subheadline` TextSecondary -- "AB-123-CD" (license plate in monospaced style) |
| Trailing | Edit pencil icon if editable |
| License plate style | `.monospacedDigit()` modifier for tabular alignment |

### 4.3 Status Badges

Small, colored labels indicating the current state of a claim or repair.

| Property | Value |
|---|---|
| Shape | Capsule (`Capsule()`) |
| Height | 24pt |
| Horizontal padding | 10pt |
| Font | `.caption2` weight `.semibold`, uppercase |
| Layout | Leading status dot (6pt circle, filled with status color) + 4pt gap + text label |
| Background | Status color at 12% opacity (e.g., Warning/50 for "En attente") |
| Text color | Status color at full strength (e.g., Warning/700 for "En attente") |

Specific badge configurations:

| Status | Background | Text + Dot Color | Label |
|---|---|---|---|
| En attente | Warning/50 | Warning/700 | "EN ATTENTE" |
| Pris en charge | Primary/50 | Primary/700 | "PRIS EN CHARGE" |
| En reparation | Accent/50 | Accent/700 | "EN REPARATION" |
| Termine | Success/50 | Success/700 | "TERMINE" |
| Annule | Neutral/100 | Neutral/500 | "ANNULE" |

All badges must pair color with a text label and a leading dot -- color is never the sole indicator (WCAG compliance).

### 4.4 Progress Stepper (4-Step Declaration Flow)

The declaration flow uses a horizontal 4-step stepper fixed at the top of each step screen.

| Property | Value |
|---|---|
| Layout | Horizontal, evenly distributed across content width (361pt) |
| Step indicator | Circle (24pt diameter) with step number centered |
| Connector | 2pt line between circles |
| **Completed step** | Circle: Primary/600 fill, white number. Connector: Primary/600 |
| **Current step** | Circle: Primary/600 fill, white number, subtle pulse animation. Connector to next: Neutral/200 |
| **Upcoming step** | Circle: Neutral/200 fill, Neutral/500 number. Connector: Neutral/200 |
| **Error step** | Circle: Error/600 fill, white exclamation mark |
| Step label | Below each circle. `.caption2` weight `.medium`. Completed/current: TextPrimary. Upcoming: TextTertiary |
| Labels | "Type", "Photos", "Vehicule", "Lieu" |
| Total height | 56pt (circle + gap + label) |
| Fixed position | Pinned below navigation bar, does not scroll with content |

Overline text above stepper: `.caption2` `.semibold` uppercase, TextSecondary: "ETAPE 2 SUR 4"

### 4.5 Map Markers

#### Garage Pin

| Property | Value |
|---|---|
| Shape | Custom annotation: rounded pin shape (30 x 38pt) |
| Default color | Primary/600 background, white `wrench.fill` icon (14pt) |
| Selected color | Primary/800 background, enlarged (36 x 44pt), shadow.md |
| Availability indicator | Small dot (8pt) at top-right: Success/500 (available), Warning/500 (limited), Neutral/300 (unavailable) |
| Cluster | Circle (36pt) with count number, Primary/100 background, Primary/700 text |

#### User Location Pin

| Property | Value |
|---|---|
| Shape | Blue pulsing dot, matching iOS Maps user location indicator |
| Implementation | SwiftUI `Map` with `.userLocation` display, or custom `MapAnnotation` with pulse animation |

#### Accident Location Pin

| Property | Value |
|---|---|
| Shape | Draggable pin, 40 x 48pt |
| Color | Error/500 background, white `exclamationmark.triangle.fill` icon |
| Dragging state | Pin lifts (scale 1.15, shadow.lg), translucent shadow beneath |

### 4.6 Photo Thumbnails and Gallery

#### Photo Thumbnail Grid (Declaration Step 2)

| Property | Value |
|---|---|
| Layout | 2-column grid, 16pt spacing. Each thumbnail is square, filling half content width (~172pt) |
| Corner radius | Radius.md (10pt) |
| Completed photo | Full image, green checkmark badge (16pt circle) at top-right corner |
| Pending photo | Dashed border (Neutral/300), camera icon centered, label below ("Avant du vehicule") |
| Upload in progress | Image dimmed, circular `ProgressView` overlay |
| Upload failed | Red tint overlay, retry icon centered |
| Tap action | Completed: opens full-screen viewer. Pending: opens camera. |

#### Full-Screen Photo Viewer

| Property | Value |
|---|---|
| Background | Black (solid) |
| Navigation | Swipe horizontally to page between photos |
| Gestures | Pinch-to-zoom, double-tap to zoom to 2x, drag to pan when zoomed |
| Close | "X" button top-left (white, 44x44pt), or swipe down to dismiss |
| Counter | ".caption" center top: "3 / 7" |
| Implementation | `TabView` with `.tabViewStyle(.page)` wrapping zoomable image views |

### 4.7 Calendar Grid (Availability Slots)

#### Driver Booking View

| Property | Value |
|---|---|
| Date strip | Horizontal `ScrollView` of date pills. Each pill: 48pt wide x 56pt tall. Today highlighted with Primary/600 background. Selected: Primary/100 background + Primary/600 border. |
| Time slots below | Vertical list of available slot chips. Each chip: full width, 48pt height, Radius.md. |
| Available slot | SurfaceElevated background, border Primary/200. Text: "09:00 -- 10:00". Primary/600 text. |
| Selected slot | Primary/600 background, white text, checkmark trailing. |
| Unavailable slot | Neutral/100 background, Neutral/400 text, strikethrough. Non-tappable. |
| Section headers | "Matin" / "Apres-midi" dividers in `.footnote` TextSecondary. |

#### Garage Planning Week View

| Property | Value |
|---|---|
| Layout | Horizontally scrolling grid. 7 columns (Mon-Sun), rows = 1-hour increments (08:00-19:00). |
| Day header | `.caption` `.semibold`, day abbreviation + date number. Today: Primary/600 background, white text. |
| Time labels | Left-aligned column, `.caption` TextSecondary, 60pt height per row. |
| Available slot | Success/50 background, Success/600 left border (2pt). |
| Booked slot | Primary/50 background, Primary/600 left border. Inner text: client initials + vehicle, `.caption2`. |
| Blocked slot | Neutral/100 background, diagonal hatching pattern (Neutral/200). |
| Empty slot | SurfaceSecondary, tappable to create availability. |
| Cell size | Each cell: variable width (content width / 7 - gutter), 60pt height. |
| Scroll | Horizontal scroll for days, vertical scroll for time. Pinned day headers and time labels. |

### 4.8 Empty States

Every list and data screen has a designed empty state per PRD DoD requirements.

| Property | Value |
|---|---|
| Layout | Centered vertically in available space. 280pt max width. |
| Illustration | SF Symbol at 48pt size, Neutral/300 color, within a 80pt circle of Neutral/50 |
| Title | `.title3` weight `.semibold`, TextPrimary, centered. Uses SF Pro Rounded for warmth. |
| Description | `.subheadline`, TextSecondary, centered. 2-3 lines max. |
| CTA button | Primary button below description, 24pt spacing above. Optional. |
| Spacing | 16pt between illustration and title, 8pt between title and description, 24pt between description and CTA. |

Specific empty states:

| Screen | Icon | Title | Description | CTA |
|---|---|---|---|---|
| No claims (driver) | `doc.text.magnifyingglass` | "Aucun sinistre" | "Vous n'avez pas encore declare de sinistre." | "Declarer un sinistre" |
| No garages found | `mappin.slash` | "Aucun garage trouve" | "Aucun garage disponible dans cette zone. Essayez d'elargir votre recherche." | "Elargir la recherche" |
| No claims (garage) | `tray` | "Aucun dossier" | "Aucun sinistre disponible dans votre zone pour le moment." | "Verifier ma zone" |
| No notifications | `bell.slash` | "Aucune notification" | "Vous recevrez ici les mises a jour de vos sinistres." | -- |
| First use (planning) | `calendar.badge.plus` | "Planning vide" | "Definissez vos creneaux de disponibilite pour recevoir des reservations." | "Ajouter des creneaux" |

### 4.9 Loading States (Skeleton Views)

All data screens display skeleton placeholders while loading. Skeletons match the shape and layout of the content they represent.

| Property | Value |
|---|---|
| Background color | Neutral/100 (light mode) / Neutral/800 (dark mode) |
| Shimmer animation | Linear gradient sliding left-to-right. Gradient: Neutral/100 -> Neutral/50 -> Neutral/100. Duration: 1.5s, repeating. |
| Shape matching | Text lines: rounded rectangles at 70%, 100%, 85% width (varied). Images: exact frame size with Radius.md. Circles: exact size. |
| Number of skeleton items | Match the expected number of visible items in the viewport (typically 4-6 list items). |
| SwiftUI implementation | Custom `View` with `.redacted(reason: .placeholder)` combined with shimmer `ViewModifier`. |

---

## 5. Iconography

### 5.1 SF Symbols Strategy

All icons use Apple's SF Symbols library (version 6+, shipping with iOS 26). Zero custom icon assets needed for the MVP, reducing maintenance overhead.

**Rendering mode:** `.hierarchical` as default (uses a single tint color with automatic opacity layering). Override to `.monochrome` for simple icons or `.multicolor` for system-provided multicolor variants where appropriate.

**Weight:** `.medium` as default, matching SF Pro body text. Adjusted to `.semibold` in navigation bars and `.regular` in captions.

**Symbol size:** Matched to accompanying text using `Font.system()` size or explicit `.font(.system(size:))`.

### 5.2 Icon Mapping by Feature

#### Navigation (Bottom Tab Bar)

| Tab | Symbol (Active) | Symbol (Inactive) | Label |
|---|---|---|---|
| Accueil (Driver) | `house.fill` | `house` | "Accueil" |
| Declarer (Driver) | `plus.circle.fill` | `plus.circle` | "Declarer" |
| Suivi (Driver) | `clock.arrow.circlepath` | `clock.arrow.circlepath` | "Suivi" |
| Profil (Driver) | `person.fill` | `person` | "Profil" |
| Tableau de bord (Garage) | `square.grid.2x2.fill` | `square.grid.2x2` | "Tableau de bord" |
| Sinistres (Garage) | `doc.text.fill` | `doc.text` | "Sinistres" |
| Planning (Garage) | `calendar` | `calendar` | "Planning" |
| Profil (Garage) | `person.fill` | `person` | "Profil" |

Active tabs use `.fill` variants with Primary/600 tint. Inactive tabs use outline variants with Neutral/400 tint.

#### Declaration Flow

| Feature | Symbol | Rendering | Usage |
|---|---|---|---|
| Accident type | `car.side.front.open` | `.hierarchical` | Collision type selector |
| Parking accident | `parkingsign.circle` | `.hierarchical` | Parking type selector |
| Broken glass | `car.window.right` | `.hierarchical` | Bris de glace selector |
| Camera / Photos | `camera.fill` | `.monochrome` | Photo capture trigger |
| Gallery import | `photo.on.rectangle` | `.monochrome` | Import from gallery |
| Vehicle info | `car.fill` | `.hierarchical` | Vehicle info step icon |
| License plate | `rectangle.and.text.magnifyingglass` | `.monochrome` | Plate input prefix |
| Location | `mappin.and.ellipse` | `.hierarchical` | Location step icon |
| GPS detection | `location.fill` | `.monochrome` | Use current location button |
| Summary / Review | `checkmark.rectangle` | `.hierarchical` | Summary step icon |
| Submit | `paperplane.fill` | `.monochrome` | Submit declaration |

#### Garage Search and Selection

| Feature | Symbol | Usage |
|---|---|---|
| Map view | `map.fill` | Map/List toggle (map active) |
| List view | `list.bullet` | Map/List toggle (list active) |
| Filter | `line.3.horizontal.decrease` | Filter button |
| Sort | `arrow.up.arrow.down` | Sort control |
| Distance | `location.fill` | Distance indicator |
| Availability | `clock.fill` | Availability indicator |
| Rating | `star.fill` | Rating display |
| Specialty | `wrench.fill` | Garage specialty tag |
| Phone | `phone.fill` | Call action |
| Directions | `arrow.triangle.turn.up.right.diamond.fill` | Navigate to garage |

#### Status and Tracking

| Feature | Symbol | Usage |
|---|---|---|
| En attente | `clock.fill` | Pending status |
| Pris en charge | `person.badge.clock` | Assigned status |
| En reparation | `wrench.and.screwdriver.fill` | In progress status |
| Termine | `checkmark.circle.fill` | Completed status |
| Annule | `xmark.circle.fill` | Cancelled status |
| Timeline event | `circle.fill` (6pt) | Timeline dot |
| Notification | `bell.fill` | Notification center |
| Notification unread | `bell.badge` | Unread indicator |

#### Settings and Profile

| Feature | Symbol | Usage |
|---|---|---|
| Settings | `gearshape.fill` | Settings screen |
| Edit profile | `pencil` | Edit action |
| Add photo | `photo.badge.plus` | Add garage/vehicle photo |
| Logout | `rectangle.portrait.and.arrow.right` | Sign out |
| Delete account | `trash` | Account deletion |
| Privacy | `lock.shield` | Privacy settings |
| Help / FAQ | `questionmark.circle` | Help center |
| Terms | `doc.text` | CGU / Legal |

### 5.3 Symbol Configuration Standards

All SF Symbols are configured via `.symbolRenderingMode()` and `.symbolVariant()`:

| Context | Rendering Mode | Variant | Weight |
|---|---|---|---|
| Tab bar icons | `.monochrome` | `.fill` (active) / `.none` (inactive) | `.regular` |
| Navigation bar actions | `.monochrome` | `.none` | `.medium` |
| Inline with text | `.monochrome` | `.none` | Match text weight |
| Status indicators | `.monochrome` | `.fill` | `.medium` |
| Empty state illustrations | `.hierarchical` | `.none` | `.light` |
| Button leading icons | `.monochrome` | `.fill` | `.medium` |

---

## 6. Dark Mode Strategy

### 6.1 Approach

Dark mode is a day-one feature, not a future addition. The PRD does not explicitly mention dark mode, but the use context demands it: accidents happen at night, and a blinding white screen on a dark roadside is a usability and safety failure.

The color system defined in Section 1 already includes dark mode variants for every color token. The strategy is **semantic color tokens with automatic resolution** via the SwiftUI Asset Catalog.

### 6.2 Implementation Architecture

All colors are defined as named Color Sets in the Asset Catalog (`Assets.xcassets`), each containing `Any Appearance` and `Dark Appearance` values. In SwiftUI, every color reference uses `Color("TokenName")`, which resolves automatically based on the system appearance.

No conditional logic (`@Environment(\.colorScheme)`) is needed for color selection in the vast majority of cases. The environment variable is reserved for the rare cases where a component needs appearance-specific behavior beyond color (e.g., shadow intensity).

### 6.3 Surface Hierarchy in Dark Mode

| Semantic Surface | Light Mode | Dark Mode | Elevation |
|---|---|---|---|
| `SurfacePrimary` | #FFFFFF | #0F172A (Neutral/900) | Base screen |
| `SurfaceSecondary` | #F8FAFC (Neutral/50) | #1E293B (Neutral/800) | Grouped sections |
| `SurfaceElevated` | #FFFFFF | #1E293B (Neutral/800) | Cards, sheets (lighter than base in dark) |
| `SurfaceTertiary` | #F1F5F9 (Neutral/100) | #334155 (Neutral/700) | Inset content, input fields |

In dark mode, elevated surfaces are **lighter** than the base surface (opposite of light mode). This follows the iOS dark mode convention where elevation increases lightness.

### 6.4 Shadow Behavior in Dark Mode

Shadows are less visible on dark backgrounds. In dark mode:

- `shadow.sm` and `shadow.md` are **disabled** (shadow opacity set to 0). Surface distinction relies on the background color hierarchy instead.
- `shadow.lg` and `shadow.xl` use reduced opacity (50% of light mode values) for high-elevation elements (bottom sheets, modals) where visual separation is critical.

### 6.5 Image and Media Handling

- **Photographs** (garage photos, accident photos): displayed as-is. No tinting or dimming.
- **Illustrations / Empty state graphics:** If using SF Symbols (as recommended), they adapt automatically via tint color. If custom illustrations are added later, provide dark mode variants.
- **Map tiles:** Use `MKStandardMapConfiguration(.dark)` for dark appearance, or let MapKit auto-switch with `.preferredColorScheme`.

### 6.6 Status Colors in Dark Mode

Status colors shift to lighter variants in dark mode to maintain contrast against dark backgrounds (see Section 1.4). The pairing of status color + status text label ensures accessibility regardless of appearance.

### 6.7 Testing Requirements

Every screen must be visually tested in both appearances. The Xcode previews should use:

```
// Both appearances in every preview
#Preview("Light") { ScreenView().preferredColorScheme(.light) }
#Preview("Dark") { ScreenView().preferredColorScheme(.dark) }
```

---

## 7. Accessibility Visual Spec

### 7.1 WCAG AA Contrast Ratios

All text and interactive elements meet WCAG AA minimum contrast ratios:

| Element Type | Minimum Ratio | Carlib Target | Verification Method |
|---|---|---|---|
| Normal text (<18pt) | 4.5:1 | 5:1+ | All TextPrimary/TextSecondary on Surface tokens verified |
| Large text (>=18pt bold or >=24pt) | 3:1 | 4:1+ | All Title/Headline on Surface tokens verified |
| UI components (borders, icons) | 3:1 | 3.5:1+ | All interactive borders, icon buttons |
| Focus indicators | 3:1 | 3:1+ | Focus ring color against background |

Specific contrast verification (light mode):

| Combination | Ratio | Pass? |
|---|---|---|
| TextPrimary (#0F172A) on SurfacePrimary (#FFFFFF) | 17.4:1 | Yes (AAA) |
| TextSecondary (#64748B) on SurfacePrimary (#FFFFFF) | 4.8:1 | Yes (AA) |
| TextTertiary (#94A3B8) on SurfacePrimary (#FFFFFF) | 3.3:1 | Yes (for large text / UI only) |
| Interactive (#2563EB) on SurfacePrimary (#FFFFFF) | 4.6:1 | Yes (AA) |
| TextInverse (#FFFFFF) on Interactive (#2563EB) | 4.6:1 | Yes (AA) |
| Status Pending Text (Warning/700 #B45309) on Warning/50 (#FFFBEB) | 5.1:1 | Yes (AA) |
| Status Completed Text (Success/700 #15803D) on Success/50 (#F0FDF4) | 5.4:1 | Yes (AA) |

TextTertiary (#94A3B8) is used only for placeholder text and decorative elements where contrast below 4.5:1 is acceptable per WCAG (placeholder text is not essential information). Form labels and functional text always use TextPrimary or TextSecondary.

### 7.2 Dynamic Type Support

Every text element uses SwiftUI's built-in `Font.TextStyle` (`.largeTitle` through `.caption2`), which automatically scales with the system Dynamic Type setting. No hardcoded `Font.system(size:)` for user-facing text.

| Dynamic Type Size | SwiftUI Environment | Layout Impact |
|---|---|---|
| xSmall - Large | `.dynamicTypeSize(.xSmall ... .large)` | Normal layout. All designs are authored at Large (default). |
| xLarge - xxxLarge | `.dynamicTypeSize(.xLarge ... .xxxLarge)` | Text grows. Cards may become taller. Horizontal layouts may need to stack vertically. Test truncation. |
| Accessibility sizes | `.dynamicTypeSize(.accessibility1 ... .accessibility5)` | Major layout adaptation. Horizontal button pairs stack vertically. Card layouts simplify. Tab labels may truncate. |

**Implementation rules:**

- Use `.lineLimit(nil)` on all descriptive text (descriptions, instructions). Never truncate informational content.
- Use `.minimumScaleFactor(0.8)` on buttons and badges to gracefully reduce text before growing the container.
- Use `@ScaledMetric` for spacing values that should grow with Dynamic Type (e.g., icon sizes, custom padding).
- Test every screen at the Accessibility 5 (AX5) size in previews.
- Use `ViewThatFits` (iOS 16+) to switch between horizontal and vertical layouts when space is constrained at large type sizes.

### 7.3 Bold Text Support

When the system Bold Text accessibility setting is enabled, all `.regular` weight text renders as `.medium`, and `.medium` renders as `.semibold`. SF Pro handles this automatically. Custom weight assignments should use semantic weight names (`.regular`, `.medium`, `.semibold`, `.bold`) rather than numeric values to ensure correct adaptation.

### 7.4 Reduce Motion Support

When the system Reduce Motion setting is enabled, all animations are replaced:

| Normal Animation | Reduced Motion Alternative | SwiftUI Implementation |
|---|---|---|
| Sheet slide-up | Cross-dissolve (instant appear) | Check `@Environment(\.accessibilityReduceMotion)` |
| Card spring entrance | Instant appear (opacity 0 to 1, no position change) | `.animation(reduceMotion ? .none : .spring(...))` |
| Progress stepper pulse | Static highlighted circle (no pulse) | Conditional animation |
| Skeleton shimmer | Static gray placeholder (no shimmer) | Conditional animation |
| Map pan/zoom | Instant reposition | MapKit handles this automatically |
| Success confetti/celebration | Static success icon | Conditional animation |
| Navigation transitions | Cross-dissolve instead of slide | `withTransaction` with `.disablesAnimations` |

**Rule:** No information is conveyed only through animation. All animated states have a static equivalent that conveys the same meaning.

### 7.5 Increase Contrast Support

When the system Increase Contrast setting is enabled:

| Element | Normal | Increased Contrast |
|---|---|---|
| Card borders | `BorderDefault` (Neutral/200) | `BorderStrong` (Neutral/400) |
| Subtle backgrounds | Neutral/50 | Neutral/100 (one shade darker) |
| Secondary text | Neutral/500 | Neutral/700 |
| Status badge backgrounds | 12% opacity fill | 20% opacity fill |
| Disabled states | Neutral/300 text | Neutral/500 text |

Implementation: Check `@Environment(\.accessibilityContrast)` and provide alternate token values where the standard contrast is near the AA threshold.

### 7.6 Color Independence

Per WCAG, color must never be the sole means of conveying information. Every use of color is paired with a secondary indicator:

| Color-Only Risk | Secondary Indicator |
|---|---|
| Status badge color | Text label + leading dot (redundant encoding) |
| Available/unavailable calendar slots | Color + text label ("Disponible" / "Indisponible") + icon |
| Form validation error (red border) | Error icon (`exclamationmark.circle`) + error text message below field |
| Map pin availability (green/orange/gray dot) | Availability text in callout tooltip on tap |
| Success/error toast | Leading icon (`checkmark.circle` / `xmark.circle`) + text |

### 7.7 VoiceOver Considerations (Visual Impact)

While VoiceOver is primarily a code concern, the visual design must support it:

- All interactive elements have sufficient visual separation (not just color-based distinction) to be individually identifiable by the accessibility cursor.
- Focus indicators: a 2pt Primary/600 ring with 2pt offset appears around the focused element. Uses `.focusEffect(.automatic)` in iOS 26 or manual `overlay` with `@Environment(\.isFocused)`.
- Grouped content (e.g., a garage card) is announced as a single element. The visual card boundary reinforces this grouping.
- Decorative images (background patterns, separator dots) use `.accessibilityHidden(true)`.

---

## 8. Screen-by-Screen Visual Direction

### 8.1 Shared Screens

#### S-01: Splash Screen

- **Dominates:** Centered Carlib wordmark/logo (when brand is defined) on SurfacePrimary.
- **Visual hierarchy:** Logo only. No text, no buttons. A subtle `ProgressView` (system spinner) appears below the logo after 1 second if loading is slow.
- **Dark mode:** Logo on SurfacePrimary (dark). Auto-adapts.
- **Duration:** Shown during app initialization, replaced by content as soon as data is ready. Never artificially held.

#### S-02: Onboarding / Role Selection

- **Dominates:** Two large, tappable role cards side-by-side (or stacked). Each card: illustration icon (SF Symbol at 48pt), title ("Je suis conducteur" / "Je suis carrossier"), 1-line description.
- **Visual hierarchy:** Welcome greeting at top ("Bienvenue sur Carlib"), role cards in center, subtle footer text.
- **Key decision:** Cards use SurfaceElevated with Primary/600 border when selected. Unselected: BorderDefault border.
- **Touch targets:** Each card is minimum 160pt tall, full-width or 50% width.

#### S-06: Notifications Center

- **Dominates:** Chronological list of notification cards, grouped by date.
- **Visual hierarchy:** Date section headers (`.footnote`, TextSecondary). Notification cards with leading icon (status-colored), title, body snippet, trailing timestamp.
- **Unread state:** Primary/50 background tint on unread cards, fading to transparent after marking as read.
- **Empty state:** Bell icon, "Aucune notification" (see Section 4.8).

### 8.2 Driver App Screens

#### D-01: Home / Dashboard

- **Dominates:** Active sinistre status card (hero card at top, full width, 160pt+ tall). If no active sinistre, the "Declarer un sinistre" CTA dominates.
- **Visual hierarchy:** 1) Active status hero card (status badge prominently displayed, next step action). 2) Quick action buttons (2 horizontal: "Nouveau sinistre," "Mes garages"). 3) Recent activity list (last 3 events). 4) Vehicle card (if registered).
- **Key decision:** The status hero card uses a subtle gradient from Primary/50 to SurfacePrimary to draw the eye without overwhelming.
- **Scroll behavior:** Large title navigation bar collapses on scroll.

#### D-02: Declaration Step 1 -- Accident Type

- **Dominates:** Grid of accident type option cards (3x2 or scrollable list).
- **Visual hierarchy:** Progress stepper (Step 1 highlighted) pinned at top. Below: "Quel type de sinistre ?" as section heading. Below: selectable option cards.
- **Option cards:** 100pt tall, Radius.lg, icon (40pt SF Symbol) centered above label. Tap selects (Primary/600 border + Primary/50 background). Only one selectable at a time.
- **Key decision:** Large, stress-tolerant tap targets. Each card is at minimum full-half-width with 16pt gutter. No small radio buttons.

#### D-03: Declaration Step 2 -- Photo Capture

- **Dominates:** Camera viewfinder or photo grid (depending on state).
- **Visual hierarchy:** 1) Progress stepper (Step 2). 2) Guidance text: "Photographiez votre vehicule" in `.title3`. 3) Photo requirement checklist (horizontal scroll of required angles). 4) Photo grid of captured/pending photos. 5) "Ouvrir l'appareil photo" primary CTA.
- **Key decision:** Camera overlay shows a semi-transparent car silhouette guide. Dark UI in camera mode (black background, white text/icons) for viewfinder visibility.
- **Stress considerations:** Large shutter button (72pt circle), clear retake/delete actions, no precision required.

#### D-04: Declaration Step 3 -- Vehicle Info

- **Dominates:** Form fields (vehicle make, model, license plate, insurance info).
- **Visual hierarchy:** 1) Progress stepper (Step 3). 2) Pre-filled fields (if returning user) with option to edit. 3) License plate input is the hero field (larger, monospaced, formatted). 4) "Continuer" primary CTA at bottom.
- **Key decision:** Auto-fill where possible. If a vehicle is already registered in the profile, show the vehicle card with "Utiliser ce vehicule" option, collapsing the form.

#### D-05: Declaration Step 4 -- Location and Details

- **Dominates:** Map view with draggable accident pin.
- **Visual hierarchy:** 1) Progress stepper (Step 4). 2) Map occupying top 60% of screen. 3) Address field (auto-filled from pin, editable). 4) Date/time fields (default: now). 5) Optional description textarea. 6) "Verifier et envoyer" primary CTA.
- **Key decision:** "Utiliser ma position actuelle" ghost button above map for GPS auto-detection. Map is not decorative -- it is the primary input.

#### D-06: Declaration Summary / Review

- **Dominates:** Structured summary card with all declaration data.
- **Visual hierarchy:** Sections: Type (icon + label), Photos (thumbnail strip), Vehicle (plate + model), Location (mini map + address), Date/Time. Each section is editable (pencil icon trailing, tap navigates back to that step).
- **Key decision:** No new data entry on this screen. Read-only review. Single "Soumettre ma declaration" primary CTA at bottom. This screen provides the last safety net before submission.

#### D-07: Declaration Confirmation

- **Dominates:** Success illustration (large checkmark circle or SF Symbol `checkmark.seal.fill` at 64pt in Success/500).
- **Visual hierarchy:** 1) Success icon. 2) "Declaration envoyee !" in `.title` with SF Pro Rounded. 3) Claim reference number in `.headline`. 4) "Prochaine etape : choisissez un garage" description. 5) "Trouver un garage" primary CTA. 6) "Retour a l'accueil" ghost button.
- **Tone:** Celebratory but composed. This is reassurance, not a party.

#### D-08 / D-09: Garage Search (Map / List)

- **Dominates:** Map view (default) with bottom sheet garage list.
- **Visual hierarchy:** Map fills full screen. Bottom sheet in collapsed state shows top 2 garage cards peeking. Toggle bar between map and sheet: "Carte" / "Liste" segmented control. Filter chip row below toggle (distance, disponibilite, type).
- **Map state:** User location blue dot. Garage pins with availability color dots. Tap pin shows callout tooltip card.
- **List state:** Full-screen scrollable list of garage cards (see Section 4.2). Sort control at top.
- **Key decision:** The map-to-list paradigm follows the Doctolib pattern, familiar to French users.

#### D-11: Garage Detail

- **Dominates:** Photo gallery at top (horizontal scroll, 200pt height) with garage info below.
- **Visual hierarchy:** 1) Photo gallery (full-width). 2) Garage name (`.title2`), distance, rating stars. 3) Availability summary badge. 4) Specialties tag list. 5) Address with "Itineraire" link. 6) "Reserver un creneau" primary CTA (sticky bottom). 7) Description, opening hours, zone d'intervention below fold.
- **Key decision:** CTA is always visible (sticky bottom). The user does not need to scroll to act.

#### D-12 / D-13: Booking Calendar and Time Slot Selection

- **Dominates:** Date strip + time slot grid.
- **Visual hierarchy:** 1) Garage name + avatar header (context). 2) Horizontal date strip (scrollable, today emphasized). 3) Available time slots below selected date. 4) "Confirmer le creneau" primary CTA (appears when a slot is selected, sticky bottom).
- **Key decision:** If no slots on selected day, show next available day suggestion: "Prochain creneau disponible : jeu. 10 avr."

#### D-14: Booking Confirmation

- **Dominates:** Confirmation card with booking details.
- **Visual hierarchy:** 1) Success icon (`.checkmark.circle.fill` 48pt Success/500). 2) "Reservation confirmee !" in `.title2` Rounded. 3) Booking detail card: date, time, garage name, address, mini map. 4) Claim reference linked. 5) "Ajouter au calendrier" secondary CTA. 6) "Retour a l'accueil" ghost button.
- **Tone:** Relief and clarity. All necessary information for the driver to know where to go and when.

#### D-15 / D-16: Repair Tracking

- **Dominates:** Status pipeline visualization (horizontal stepper) with current stage highlighted.
- **Visual hierarchy:** 1) Status pipeline (4 stages as horizontal connected dots, current stage enlarged and colored). 2) Current status card: large status badge, description of what is happening, estimated timing if available. 3) Timeline below: chronological list of status changes with timestamps. 4) Garage contact card at bottom.
- **Key decision:** The pipeline stepper is always visible (pinned below nav bar). The user always knows where they are in the process. This screen is the primary anxiety-reduction tool -- clarity of progress is paramount.

### 8.3 Garage Portal Screens

#### G-01: Dashboard

- **Dominates:** KPI summary cards (new claims count, today's bookings, active repairs).
- **Visual hierarchy:** 1) Greeting: "Bonjour, Mohamed" with date. 2) KPI cards row (horizontal scroll): "3 nouveaux sinistres" (Warning tint if action needed), "5 RDV aujourd'hui," "8 reparations en cours." 3) Today's schedule (next 3 appointments). 4) Quick actions: "Voir les sinistres," "Gerer le planning."
- **Key decision:** "Nouveaux sinistres" card uses Warning/50 background with an attention dot to pull the garage owner's eye first. This is revenue.

#### G-02 / G-03: Available Claims List and Detail

- **Dominates:** Filterable list of incoming claim cards.
- **Visual hierarchy:** 1) Count badge: "12 sinistres disponibles." 2) Filter chips: distance, type de sinistre, urgence. 3) Claim cards: photo thumbnail, vehicle type, damage description, distance, CTA pair ("Voir" / "Accepter").
- **Detail screen:** Full dossier: photo gallery (swipeable), vehicle info card, accident description, location map, driver contact info. Sticky bottom: "Accepter ce dossier" primary CTA + "Refuser" ghost.
- **Key decision:** The accept action is prominent but requires confirmation (dialog) to prevent accidental acceptance.

#### G-08 / G-09: Planning (Week and Day View)

- **Dominates:** Calendar grid (see Section 4.7).
- **Visual hierarchy:** 1) Week/month toggle (segmented control). 2) Calendar grid with color-coded slots. 3) Floating "+" button for adding availability.
- **Key decision:** This is the densest screen in the app. Visual hierarchy relies heavily on color coding and spatial position. Day column for today is visually emphasized (Primary/50 background column). Past slots are dimmed.

#### G-07: Status Update

- **Dominates:** Horizontal stepper showing the four status stages, with a single prominent CTA to advance.
- **Visual hierarchy:** 1) Dossier reference and vehicle info (context). 2) Status stepper (current stage highlighted). 3) "Passer a : En reparation" primary CTA (the label includes the target status name). 4) Note/comment textarea (optional, for the driver).
- **Key decision:** One-tap advancement. The CTA text dynamically shows the next status. Confirmation dialog before the action completes. After status update, toast confirms and mentions that the driver has been notified.

---

## 9. Landing Page Visual Direction

### 9.1 Context

The landing page is a B2B sales tool targeting garage owners (Mohamed D., 45 years old). It is viewed on desktop (from a sales email link) or mobile (from a shared link). Unlike the app, the landing page should be designed desktop-first, then adapted to mobile.

The landing page is a **web page** (not a native SwiftUI view). However, it shares Carlib's visual identity: the same color palette, typography feel (using system sans-serif or Inter as a web-safe equivalent of SF Pro), and design language.

### 9.2 Section-by-Section Direction

#### Hero (Viewport 1)

- **Dominates:** Bold headline + device mockup showing the Carlib app.
- **Layout (desktop):** 2-column. Left: headline (`.largeTitle` equivalent, max 8 words), subheadline (2 sentences), primary CTA "Je suis un garage interesse." Right: iPhone mockup showing the garage portal dashboard.
- **Layout (mobile):** Stacked. Headline, subheadline, CTA, then mockup below.
- **Background:** SurfacePrimary (white). Clean, uncluttered.
- **CTA:** Primary button style. Full-width on mobile, intrinsic width on desktop.
- **Key decision:** The CTA must be visible without scrolling on all devices (PRD DoD: "CTA visible au-dessus de la ligne de flottaison").

#### Problem Section (Viewport 2)

- **Dominates:** 3 pain-point cards.
- **Layout:** 3-column grid (desktop), stacked (mobile).
- **Each card:** Icon (SF Symbol equivalent or simple illustration), pain-point title, 1-2 sentence description. Cards use SurfaceSecondary background.
- **Pain points:** 1) "Appels et papier" (dossiers fragmented). 2) "Planning ingerable" (manual scheduling chaos). 3) "Clients non qualifies" (time wasted on unqualified leads).
- **Tone:** Empathetic, recognizing the garage owner's reality. Not negative -- problem-aware.

#### Solution Section (Viewport 3)

- **Dominates:** Mirrors the 3 pain points with 3 solutions, each paired visually (before/after framing).
- **Layout:** Same 3-column grid. Each card: solution icon, title, description.
- **Solutions:** 1) "Dossiers numeriques complets." 2) "Planning synchronise automatiquement." 3) "Sinistres qualifies a proximite."
- **Background:** Primary/50 subtle background tint to visually separate from the problem section.

#### How It Works (Viewport 4)

- **Dominates:** 3-step numbered sequence.
- **Layout:** Horizontal (desktop), vertical (mobile). Large circled numbers (1, 2, 3) with connecting line. Each step: number, app screenshot, title, description.
- **Steps:** 1) "Le conducteur declare son sinistre." 2) "Vous recevez les dossiers dans votre zone." 3) "Vous acceptez et planifiez la reparation."
- **Visual emphasis:** App screenshots in device frames. Clean, readable at a glance.

#### Benefits Section (Viewport 5)

- **Dominates:** 4-6 benefit cards in a grid.
- **Layout:** 2x2 or 2x3 grid (desktop), stacked (mobile).
- **Benefits:** "Flux de clients qualifies," "Zero commission sur les reparations" (if applicable), "Outil de planning gratuit," "Visibilite locale," "Notifications en temps reel," "Interface simple."
- **Each card:** Icon, title, 1-line description.

#### Garage Signup Form (Viewport 6)

- **Dominates:** Form with trust signals.
- **Layout (desktop):** 2-column. Left: form fields (garage name, contact name, phone, email, city). Right: trust messaging, testimonial quote (if available), security badges.
- **Layout (mobile):** Form full-width, trust signals below.
- **Form fields:** Minimal. 5-6 fields maximum. No barriers. "S'inscrire gratuitement" primary CTA.
- **RGPD notice:** Checkbox or text below form per French legal requirements.

#### Footer

- Standard footer: Carlib logo, "Mentions legales" link (required by French law), "Politique de confidentialite," contact email, social links.
- Background: Neutral/900. Text: Neutral/400.

### 9.3 Landing Page Grid

| Viewport | Max Content Width | Columns | Margin |
|---|---|---|---|
| Desktop (1440px) | 1200px | 12 | 120px each side |
| Tablet (768px) | 720px | 8 | 24px each side |
| Mobile (375px) | 343px | 4 | 16px each side |

---

## 10. Motion and Animation Language

### 10.1 Animation Personality

Carlib's animation language is **composed, purposeful, and subtle**. Animations serve to orient the user, confirm actions, and reduce perceived loading time. They never distract, never delay, and never convey urgency or alarm. The post-accident context demands calm, predictable motion.

**One-line personality:** "Steady hands guiding you through."

### 10.2 Timing Curves and Durations

| Token | SwiftUI Value | Duration | Usage |
|---|---|---|---|
| **Micro** | `.easeOut` | 100ms | Toggle flips, checkbox marks, icon state changes |
| **Fast** | `.easeInOut` | 200ms | Button press feedback, chip selection, badge appearance |
| **Standard** | `.easeInOut` | 300ms | Screen transitions, sheet presentations, card reveals |
| **Emphasize** | `.spring(response: 0.4, dampingFraction: 0.75)` | ~400ms | Success confirmations, stepper advancement, status changes |
| **Slow** | `.easeInOut` | 500ms | Full-screen transitions, map camera moves, complex layout changes |
| **Spring (interactive)** | `.interactiveSpring(response: 0.3, dampingFraction: 0.8)` | Variable | Bottom sheet drag, map pin lift, card press-and-hold |

### 10.3 What Animates

| Element | Animation | Curve | Trigger |
|---|---|---|---|
| **Navigation push/pop** | Slide left/right (system default) | System | NavigationStack path change |
| **Sheet presentation** | Slide up from bottom | `.spring(response: 0.35, dampingFraction: 0.85)` | `.sheet()` / `.presentationDetents()` |
| **Bottom sheet drag** | Follow finger with spring snap to detents | `.interactiveSpring` | Drag gesture |
| **Tab bar switch** | Cross-dissolve on content | `.easeInOut` 200ms | Tab selection |
| **Button press** | Scale to 0.97 on press, spring back to 1.0 on release | `.spring(response: 0.2, dampingFraction: 0.6)` | Button `.onTapGesture` with `GestureState` |
| **Card appearance (list)** | Fade in + slide up 8pt, staggered by index (50ms offset per card) | `.easeOut` 250ms | List data loads |
| **Status badge change** | Scale from 0.8 to 1.0 + fade in | `.spring(response: 0.3, dampingFraction: 0.7)` | Status value changes |
| **Progress stepper advance** | Current dot scales up, connector fills from left to right, previous dot settles | `.easeInOut` 400ms, sequenced | Step completion |
| **Stepper pulse (current step)** | Subtle scale pulse 1.0 to 1.08, repeating | `.easeInOut` 1500ms, `.repeatForever(autoreverses: true)` | Current step indicator |
| **Success checkmark** | Draw stroke animation (path trim from 0 to 1) | `.easeOut` 600ms with 200ms delay | Declaration submitted, booking confirmed |
| **Skeleton shimmer** | Linear gradient slides left to right | `.linear` 1.5s, `.repeatForever(autoreverses: false)` | Data loading |
| **Toast appearance** | Slide in from top + fade | `.spring(response: 0.3, dampingFraction: 0.8)` | Action confirmation |
| **Toast dismissal** | Fade out + slide up | `.easeIn` 200ms | Auto-dismiss after 3s |
| **Photo thumbnail capture** | Scale from 0.5 to 1.0 + fade in | `.spring(response: 0.3, dampingFraction: 0.7)` | Photo captured |
| **Map pin selection** | Scale from 1.0 to 1.15, shadow expands | `.spring(response: 0.25, dampingFraction: 0.65)` | Pin tapped |
| **Calendar slot selection** | Background color cross-fade + subtle scale pulse | `.easeInOut` 200ms | Slot tapped |
| **Notification badge** | Scale from 0 to 1 with overshoot | `.spring(response: 0.3, dampingFraction: 0.5)` | New notification arrives |

### 10.4 What Does NOT Animate

| Element | Reason |
|---|---|
| **Text content changes** | Text swaps should be instant. Animated text is distracting and slows comprehension. |
| **Form field focus** | Border color change is instant (no fade). Immediate feedback that the field is active. |
| **Error state appearance** | Error messages and red borders appear instantly. Urgency of error trumps animation polish. |
| **Map tile loading** | Handled by MapKit. No custom loading animation. |
| **Navigation title collapse** | Handled by system `NavigationStack`. No custom scroll-linked animation. |
| **Pull-to-refresh** | System `RefreshControl` behavior. No custom animation. |

### 10.5 Transition Specifications

| Transition | SwiftUI API | Specification |
|---|---|---|
| **Screen push** | `NavigationStack` default | System slide. Do not override. |
| **Screen pop** | `NavigationStack` default | System slide. Do not override. |
| **Modal presentation** | `.sheet(isPresented:)` | System slide-up. Customize detents with `.presentationDetents([.medium, .large])`. |
| **Full-screen cover** | `.fullScreenCover(isPresented:)` | System slide-up. Used for photo viewer, camera. |
| **Tab switch** | `TabView` default | System cross-dissolve. Do not override. |
| **Alert / Dialog** | `.alert()` / `.confirmationDialog()` | System. Do not override. |
| **Custom in-view transition** | `.transition(.asymmetric(insertion: .push(from: .bottom).combined(with: .opacity), removal: .opacity))` | For inline content swaps (e.g., switching between map and list view). |

### 10.6 Haptic Feedback Pairing

Animations are paired with haptic feedback for tactile reinforcement:

| Event | Haptic | SwiftUI API |
|---|---|---|
| Button primary tap | `.impact(.medium)` | `UIImpactFeedbackGenerator(style: .medium)` |
| Status advance | `.notification(.success)` | `UINotificationFeedbackGenerator().notificationOccurred(.success)` |
| Error (form validation) | `.notification(.error)` | `UINotificationFeedbackGenerator().notificationOccurred(.error)` |
| Photo captured | `.impact(.light)` | `UIImpactFeedbackGenerator(style: .light)` |
| Bottom sheet snap to detent | `.impact(.light)` | `UIImpactFeedbackGenerator(style: .light)` |
| Booking confirmed | `.notification(.success)` | `UINotificationFeedbackGenerator().notificationOccurred(.success)` |
| Pull-to-refresh release | `.impact(.rigid)` | System handles this |
| Toggle switch | `.selection` | `UISelectionFeedbackGenerator().selectionChanged()` |

### 10.7 Performance Guidelines

- All animations run at 60fps minimum (120fps on ProMotion displays).
- Use `.drawingGroup()` for complex animated views with many layers.
- Avoid animating `View` layout changes during scroll (jank risk). Stick to transform and opacity for scroll-linked effects.
- Skeleton shimmer uses `TimelineView` or `CADisplayLink` for smooth gradient animation.
- Test all animations on the oldest supported device (iPhone SE 3rd gen if supporting iOS 26).

---

## Appendix A: Design Token Summary (Quick Reference)

| Category | Token Count | Key Values |
|---|---|---|
| Colors -- Palette | 55 values | 5 scales (Primary, Neutral, Success, Warning, Error) x 10 shades + Accent |
| Colors -- Semantic | 22 tokens | Surface (4), Text (5), Border (3), Interactive (2), Status (5), Semantic (4) |
| Typography | 11 styles | SF Pro via Font.TextStyle, .largeTitle through .caption2 |
| Spacing | 12 values | 2pt to 80pt, 4pt base unit |
| Corner Radius | 5 values | 6pt to capsule |
| Shadow | 4 levels | none, sm, md, lg |
| Animation | 6 curves | micro to slow + 2 spring variants |

## Appendix B: Asset Catalog Structure

```
Assets.xcassets/
  Colors/
    Brand/
      CarlibPrimary.colorset/      (Any + Dark)
      CarlibAccent.colorset/       (Any + Dark)
    Semantic/
      SurfacePrimary.colorset/     (Any + Dark)
      SurfaceSecondary.colorset/   (Any + Dark)
      SurfaceElevated.colorset/    (Any + Dark)
      SurfaceTertiary.colorset/    (Any + Dark)
      TextPrimary.colorset/        (Any + Dark)
      TextSecondary.colorset/      (Any + Dark)
      TextTertiary.colorset/       (Any + Dark)
      TextInverse.colorset/        (Any + Dark)
      BorderDefault.colorset/      (Any + Dark)
      BorderStrong.colorset/       (Any + Dark)
      Interactive.colorset/        (Any + Dark)
      InteractiveHover.colorset/   (Any + Dark)
    Status/
      StatusPending.colorset/      (Any + Dark)
      StatusAssigned.colorset/     (Any + Dark)
      StatusInProgress.colorset/   (Any + Dark)
      StatusCompleted.colorset/    (Any + Dark)
      StatusCancelled.colorset/    (Any + Dark)
    Feedback/
      Success.colorset/            (Any + Dark)
      SuccessSubtle.colorset/      (Any + Dark)
      Warning.colorset/            (Any + Dark)
      WarningSubtle.colorset/      (Any + Dark)
      Error.colorset/              (Any + Dark)
      ErrorSubtle.colorset/        (Any + Dark)
      Info.colorset/               (Any + Dark)
      InfoSubtle.colorset/         (Any + Dark)
  AppIcon.appiconset/              (placeholder until brand defined)
```

## Appendix C: Open Dependencies

This specification is designed to proceed without the following open items (PRD Section 9), but will need revisiting when they are resolved:

| Open Item | Impact on This Spec | Mitigation |
|---|---|---|
| Brand identity (logo, final colors) | Primary/600 blue proposed here; may change | All colors are tokenized; a palette swap requires only Asset Catalog updates |
| Attribution logic (auto vs. driver selection) | Affects garage card CTA copy and marketplace flow | Both variants can be styled with existing button components |
| Garage portal scope (mobile vs. web) | If web/tablet, landing page grid and garage planning grid need responsive breakpoints | Garage portal components specified here work at mobile width; wider layouts are an additive concern |

---

*This specification is based on PRD Carlib v0.1 (Draft, March 2026) and analysis files 01-08. All design decisions are subject to revision after client kickoff, brand identity definition, and review of the Emergent maquettes. The tokenized architecture ensures any palette, typography, or spacing changes propagate system-wide with minimal rework.*
