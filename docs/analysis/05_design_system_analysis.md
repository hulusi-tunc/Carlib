# 05 -- Design System Analysis: Carlib

**Project:** Carlib -- Marketplace de mise en relation assures / carrossiers
**Version:** v0.1
**Date:** Avril 2026
**Author:** Design System Architect Agent
**Source:** PRD Carlib v0.1 (Phase Design UX/UI) -- Digital Unicorn

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Component Inventory](#2-component-inventory)
3. [Token Requirements](#3-token-requirements)
4. [Shared vs. Unique Patterns](#4-shared-vs-unique-patterns)
5. [Status System](#5-status-system)
6. [Notification & Messaging Components](#6-notification--messaging-components)
7. [Accessibility Requirements](#7-accessibility-requirements)
8. [Scalability Considerations](#8-scalability-considerations)
9. [Recommendations & Build Priority](#9-recommendations--build-priority)

---

## 1. Executive Summary

Carlib requires a **unified, mobile-first design system** serving two distinct user interfaces -- a **driver app** (iOS & Android) and a **garage portal** (mobile-first, possibly responsive to tablet/web per open question #3 in the PRD) -- sharing a common visual language. The system must handle a specialized domain vocabulary (sinistre, carrossier, prise en charge) entirely in French, support stressed post-accident contexts requiring calming and guided UX, and be architected for future extension toward insurance integrations and V2 features.

This analysis identifies **78+ discrete UI components** organized into 14 categories, defines a complete token architecture, maps shared versus role-specific patterns, systematizes three interconnected status flows, and provides a prioritized build roadmap.

### Design Principles Derived from PRD

| Principle | PRD Source | Token / Component Implication |
|---|---|---|
| Simplicite grand public | Section 5.0 -- max 3 actions per screen | Large touch targets, clear hierarchy, minimal cognitive load |
| Zero friction post-accident | Section 5.1 -- rassurante, guidee, rapide | Progress steppers, pre-filled fields, calming color palette |
| Double interface coherente | Section 5.1 -- design system partage | Single token set, shared component library, role-based variants |
| Mobile-first | Section 5.0 -- architecture mobile en priorite | 375px base grid, touch-optimized spacing, native-feel components |
| Entierement en francais | Section 5.1 -- tous les libelles traduits | French-ready typography (accents, ligatures), i18n token layer |

---

## 2. Component Inventory

### 2.1 Foundation Components

These are atomic building blocks referenced by all higher-level components.

| # | Component | Variants / States | Used In | Priority |
|---|---|---|---|---|
| F01 | **Button** | Primary, Secondary, Ghost, Destructive, Icon-only; States: default, hover, pressed, focused, disabled, loading | Everywhere | Must |
| F02 | **Icon** | 24px, 20px, 16px; Filled, Outlined; System + domain-specific (car, wrench, camera, map-pin, calendar) | Everywhere | Must |
| F03 | **Typography** | Display, Heading (H1-H4), Body (lg, md, sm), Caption, Label, Overline | Everywhere | Must |
| F04 | **Spacing System** | 4px base unit scale | Everywhere | Must |
| F05 | **Divider** | Horizontal, Vertical; Full-bleed, Inset | Lists, cards | Must |
| F06 | **Surface / Card** | Flat, Elevated (shadow levels 1-3), Outlined; Interactive, Static | Everywhere | Must |
| F07 | **Avatar** | Sizes: xs (24), sm (32), md (40), lg (56), xl (80); Image, Initials, Placeholder | Profile, chat, garage cards | Must |
| F08 | **Skeleton Loader** | Text, Circle, Rectangle, Card, List-item | All data screens | Must |

### 2.2 Input & Form Components

Critical for the declaration flow (driver) and profile management (garage).

| # | Component | Variants / States | PRD Reference | Priority |
|---|---|---|---|---|
| I01 | **Text Input** | Default, Filled, Error, Disabled, Read-only; With/without helper text, prefix/suffix icon, character count | US01, US08 | Must |
| I02 | **Textarea** | Auto-grow, Character limit, Error | Claim description, messaging | Must |
| I03 | **Select / Dropdown** | Single-select, Searchable; Native mobile bottom-sheet variant | Sinistre type, filters | Must |
| I04 | **Date Picker** | Calendar view, Inline, Bottom-sheet; Disabled dates, Range selection | US03, US06 | Must |
| I05 | **Time Slot Picker** | Grid layout, Horizontal scroll; Available, Unavailable, Selected | US03, US06 | Must |
| I06 | **Checkbox** | Default, Checked, Indeterminate, Disabled, Error | Filters, forms | Must |
| I07 | **Radio Group** | Vertical list, Horizontal chips; Selected, Unselected, Disabled | Sinistre type selection | Must |
| I08 | **Toggle / Switch** | On, Off, Disabled; With label | Notification prefs, availability | Should |
| I09 | **Search Input** | With clear button, With filter chips; Empty, Active, Results | Garage search (US02) | Must |
| I10 | **Phone Number Input** | French format (+33), With country flag, Validation | Onboarding | Must |
| I11 | **License Plate Input** | French format (AA-123-AA), Auto-uppercase, Validation | US01 -- Vehicle info | Must |
| I12 | **Photo Capture Input** | Camera trigger, Gallery fallback, Preview thumbnail, Delete, Re-take; Multi-photo grid | US01 -- Photo assistee | Must |
| I13 | **Location Input** | Map pin + address autocomplete, Current location button, Manual entry | US01 -- Localisation | Must |
| I14 | **Form Group** | Label, Input, Helper text, Error message; Stacked, Inline | All forms | Must |
| I15 | **Filter Chip Group** | Single-select, Multi-select; Scrollable horizontal row | US02 -- Distance, disponibilite | Must |

### 2.3 Navigation Components

| # | Component | Variants / States | Used In | Priority |
|---|---|---|---|---|
| N01 | **Bottom Tab Bar** | 3-5 tabs; Active, Inactive, Badge (notification count) | Driver app, Garage portal | Must |
| N02 | **Top App Bar** | Standard (title + actions), Large (collapsible), Search variant | All screens | Must |
| N03 | **Back / Close Header** | Back arrow, Close X, Title, Optional right action | Modal screens, sub-flows | Must |
| N04 | **Bottom Sheet** | Peek, Half, Full; Draggable handle; With sticky header/footer | Garage details, filters, actions | Must |
| N05 | **Tab Bar (Segmented)** | 2-4 segments; Underline, Pill; Scrollable for overflow | Garage portal views (semaine/mois), sinistre tabs | Must |
| N06 | **Breadcrumb** | Text links, Chevron separator | Garage portal web (if applicable) | Could |

### 2.4 Data Display Components

| # | Component | Variants / States | PRD Reference | Priority |
|---|---|---|---|---|
| D01 | **Garage Card** | Compact (list), Expanded (detail); With photo, rating, distance, availability tag | US02 | Must |
| D02 | **Sinistre / Claim Card** | Driver view (summary), Garage view (actionable); With status badge, date, vehicle info, photo thumbnail | US04, US05 | Must |
| D03 | **Vehicle Info Card** | License plate, Make/Model, Photo; Editable, Read-only | US01, US09 | Must |
| D04 | **Booking Confirmation Card** | Date, Time, Garage name, Address, Map preview, Status | US03 | Must |
| D05 | **Stat / KPI Card** | Number, Label, Trend indicator; For garage dashboard | Garage portal | Should |
| D06 | **Profile Card** | Avatar, Name, Contact info, Action buttons | US08 | Must |
| D07 | **Empty State** | Illustration, Title, Description, CTA button | DoD -- etats vides | Must |
| D08 | **Error State** | Illustration, Title, Description, Retry button | DoD -- erreur reseau | Must |
| D09 | **Loading State** | Full screen spinner, Inline skeleton, Pull-to-refresh | DoD -- chargement | Must |
| D10 | **List Item** | Single-line, Two-line, Three-line; With avatar/icon, chevron, meta info | All list screens | Must |
| D11 | **Image Gallery** | Horizontal scroll, Grid; Thumbnail, Full-screen viewer, Pinch-zoom | Sinistre photos, garage photos | Must |

### 2.5 Status & Feedback Components

| # | Component | Variants / States | PRD Reference | Priority |
|---|---|---|---|---|
| S01 | **Status Badge** | Colors per status; Sizes: sm, md; Dot indicator, Text label | US04, US07, Section 6.3 | Must |
| S02 | **Progress Stepper** | Horizontal, Vertical; Steps: completed, current, upcoming, error; 4-step max per PRD | US01 -- Flow en 4 etapes | Must |
| S03 | **Status Timeline** | Vertical timeline; Step: completed (check), current (pulse), upcoming (dot) | US04 -- Suivi reparation | Must |
| S04 | **Toast / Snackbar** | Success, Error, Warning, Info; Auto-dismiss, With action button | Confirmation actions | Must |
| S05 | **Inline Alert / Banner** | Info, Success, Warning, Error; Dismissible, Persistent; With icon and action | Validation, system messages | Must |
| S06 | **Progress Bar** | Determinate, Indeterminate; With percentage label | Photo upload, claim submission | Should |
| S07 | **Notification Badge** | Dot (boolean), Count (numeric); On icons, tabs, list items | N01 tab bar, claim updates | Must |

### 2.6 Map Components

| # | Component | Variants / States | PRD Reference | Priority |
|---|---|---|---|---|
| M01 | **Map View** | Full screen, Embedded (card); With user location marker | US02 -- Liste + carte | Must |
| M02 | **Map Marker -- Garage** | Default, Selected, Clustered; With availability indicator | US02 | Must |
| M03 | **Map Marker -- User** | Current location pulsing dot | US02, US01 location | Must |
| M04 | **Map Callout / Tooltip** | Garage name, distance, CTA; Compact card overlay | US02 | Must |
| M05 | **Map + List Toggle** | Segmented control: Carte / Liste | US02 | Must |

### 2.7 Calendar & Scheduling Components

| # | Component | Variants / States | PRD Reference | Priority |
|---|---|---|---|---|
| C01 | **Calendar Grid** | Month view, Week view; Selectable days, Blocked days, Today indicator | US03, US06 | Must |
| C02 | **Time Slot Grid** | Available, Booked, Blocked, Selected; Morning/Afternoon grouping | US03, US06 | Must |
| C03 | **Availability Toggle Row** | Day label + toggle + time range; For garage availability management | US06 | Must |
| C04 | **Booking Summary** | Date, Time, Duration, Location; Confirmation and cancellation variants | US03 | Must |
| C05 | **Week Strip** | Horizontal scrollable week days, Selected day highlighted | US06 -- Vue semaine | Must |

### 2.8 Photo & Media Components

| # | Component | Variants / States | PRD Reference | Priority |
|---|---|---|---|---|
| P01 | **Camera Overlay** | Guided frame (show car outline), Flash toggle, Switch camera | US01 -- Prise de photos assistee | Must |
| P02 | **Photo Thumbnail** | With delete X, Upload progress ring, Error retry; Grid layout | US01 | Must |
| P03 | **Photo Requirement Guide** | Checklist of required angles (front, rear, sides, damage); Completed/Pending indicators | US01 | Must |
| P04 | **Full-screen Image Viewer** | Swipe, Pinch-zoom, Close, Share | Sinistre dossier review | Must |

### 2.9 Communication Components

| # | Component | Variants / States | PRD Reference | Priority |
|---|---|---|---|---|
| CM01 | **Chat Bubble** | Sent, Received; Text, Image, System message | Implied by garage-driver communication | Should |
| CM02 | **Notification Card** | Unread, Read; Status change, Booking, Message types; With timestamp | US04, US07 -- notifications push | Must |
| CM03 | **Notification Center List** | Grouped by date, Swipe actions (mark read, archive) | Push notification center | Must |
| CM04 | **Push Notification Preview** | System-level notification: icon, title, body, action | US04 -- Notifications push | Must |

### 2.10 Onboarding & Auth Components

| # | Component | Variants / States | PRD Reference | Priority |
|---|---|---|---|---|
| O01 | **Splash Screen** | Logo, Loading indicator | App launch | Must |
| O02 | **Onboarding Carousel** | Paginated slides, Skip, Next, Get Started; Dot indicators | First launch | Should |
| O03 | **Login Form** | Email/Phone, Password, Forgot password link, Social login buttons | Auth | Must |
| O04 | **Registration Form** | Multi-step: Role selection (Conducteur / Carrossier), Personal info, Vehicle info (driver) / Garage info (carrossier) | Section 3 -- Onboarding par role | Must |
| O05 | **OTP / Verification Input** | 4-6 digit input, Auto-advance, Resend timer, Error | Phone verification | Should |
| O06 | **Role Selector** | Two large cards: Conducteur / Carrossier; Illustration, description | Section 3 -- chaque utilisateur configure selon son role | Must |

### 2.11 Modal & Overlay Components

| # | Component | Variants / States | PRD Reference | Priority |
|---|---|---|---|---|
| MO01 | **Dialog / Modal** | Confirmation, Destructive, Info; Title, Body, Primary + Secondary actions | Accept/Refuse sinistre (US05) | Must |
| MO02 | **Bottom Sheet (content)** | Filter panel, Detail preview, Action menu | Garage filters, quick actions | Must |
| MO03 | **Full-screen Modal** | With back/close header, scrollable content, sticky footer CTA | Claim detail, photo viewer | Must |
| MO04 | **Action Sheet** | List of actions, Cancel button; iOS-style bottom menu | Context menus | Must |
| MO05 | **Tooltip** | Directional (top, bottom, left, right); Info icon trigger | Helper text for domain terms | Should |

### 2.12 Landing Page Components (Marketing)

| # | Component | Variants / States | PRD Reference | Priority |
|---|---|---|---|---|
| L01 | **Hero Section** | Headline, Subheadline, CTA button, Device mockup image | Section 5.0 -- Hero | Must |
| L02 | **How It Works (3-step)** | Icon + Number + Title + Description; Horizontal/Vertical layout | Section 5.0 -- 3 etapes | Must |
| L03 | **Benefits Grid** | Icon + Title + Description cards; 2x2 or 3-column | Section 5.0 -- Benefices garages | Must |
| L04 | **Garage Signup Form** | Name, Email, Phone, Garage name, City, Message; Submit CTA | Section 5.0 -- Formulaire recueil | Must |
| L05 | **Social Proof Section** | Testimonial cards, Partner logos, Stats counters | Landing page | Should |
| L06 | **Sticky CTA Bar** | Fixed bottom bar with CTA on mobile; Desktop: header CTA | Above fold requirement | Must |
| L07 | **Footer** | Links, Legal, Contact, Social; Responsive | Landing page | Must |

### 2.13 Marketplace-Specific Components

| # | Component | Variants / States | PRD Reference | Priority |
|---|---|---|---|---|
| MK01 | **Garage Result Card** | Photo, Name, Distance, Availability badge, Rating, Specialties tags, CTA | US02 | Must |
| MK02 | **Garage Detail Sheet** | Full profile: photos, specialties, availability calendar, zone, contact | US02 -- Fiche garage | Must |
| MK03 | **Claim Dossier View** | Complete sinistre dossier: photos, vehicle info, description, status, timeline | US05, US09 | Must |
| MK04 | **Attribution Indicator** | Shows claim assignment state: available to multiple / attributed to one | Section 6.3 | Must |
| MK05 | **Quick Accept/Refuse** | Swipe or button pair for garage to accept/refuse a claim | US05 -- Accepter/Refuser | Must |

### 2.14 Component Count Summary

| Category | Count | Must | Should | Could |
|---|---|---|---|---|
| Foundation | 8 | 8 | 0 | 0 |
| Input & Form | 15 | 14 | 1 | 0 |
| Navigation | 6 | 5 | 0 | 1 |
| Data Display | 11 | 10 | 1 | 0 |
| Status & Feedback | 7 | 6 | 1 | 0 |
| Map | 5 | 5 | 0 | 0 |
| Calendar & Scheduling | 5 | 5 | 0 | 0 |
| Photo & Media | 4 | 4 | 0 | 0 |
| Communication | 4 | 3 | 1 | 0 |
| Onboarding & Auth | 6 | 4 | 2 | 0 |
| Modal & Overlay | 5 | 4 | 1 | 0 |
| Landing Page | 7 | 5 | 2 | 0 |
| Marketplace-Specific | 5 | 5 | 0 | 0 |
| **TOTAL** | **88** | **78** | **9** | **1** |

---

## 3. Token Requirements

### 3.1 Token Architecture

The token system follows a **three-tier architecture**: Global (raw values) > Alias (semantic meaning) > Component (component-specific overrides).

```
Tier 1: Global Tokens     (raw values -- never used directly in components)
Tier 2: Alias Tokens       (semantic references -- primary interface for designers/devs)
Tier 3: Component Tokens   (component-specific overrides -- sparse, only where needed)
```

### 3.2 Color Tokens

#### Global Palette

| Token Name | Purpose | Suggested Direction |
|---|---|---|
| `color.blue.[50-900]` | Primary brand scale | Calming, trustworthy -- suited to post-accident context |
| `color.green.[50-900]` | Success scale | Positive status, completion |
| `color.amber.[50-900]` | Warning scale | Attention, pending states |
| `color.red.[50-900]` | Error / Destructive scale | Errors, cancellations, urgent |
| `color.gray.[50-900]` | Neutral scale | Backgrounds, borders, disabled states |
| `color.white` | Base white | Backgrounds |
| `color.black` | Base black | Text |

#### Semantic / Alias Tokens

| Token Name | Maps To | Usage |
|---|---|---|
| `color.primary` | `color.blue.600` | Primary buttons, links, active states |
| `color.primary.subtle` | `color.blue.50` | Primary backgrounds, highlights |
| `color.primary.hover` | `color.blue.700` | Button hover state |
| `color.primary.pressed` | `color.blue.800` | Button pressed state |
| `color.secondary` | `color.gray.700` | Secondary buttons, secondary text |
| `color.surface.default` | `color.white` | Card and screen backgrounds |
| `color.surface.elevated` | `color.white` | Elevated card surfaces |
| `color.surface.muted` | `color.gray.50` | Section backgrounds, input backgrounds |
| `color.border.default` | `color.gray.200` | Default borders |
| `color.border.strong` | `color.gray.400` | Emphasized borders |
| `color.border.focus` | `color.blue.500` | Focus ring |
| `color.text.primary` | `color.gray.900` | Headings, body text |
| `color.text.secondary` | `color.gray.600` | Helper text, metadata |
| `color.text.tertiary` | `color.gray.400` | Placeholder text |
| `color.text.inverse` | `color.white` | Text on dark/primary backgrounds |
| `color.text.link` | `color.blue.600` | Interactive text links |
| `color.success` | `color.green.600` | Success states, "termine" status |
| `color.success.subtle` | `color.green.50` | Success background |
| `color.warning` | `color.amber.600` | Warning states, "en attente" status |
| `color.warning.subtle` | `color.amber.50` | Warning background |
| `color.error` | `color.red.600` | Error states, destructive actions |
| `color.error.subtle` | `color.red.50` | Error background |
| `color.info` | `color.blue.500` | Informational states |
| `color.info.subtle` | `color.blue.50` | Info background |

#### Status-Specific Color Tokens

| Token Name | Usage |
|---|---|
| `color.status.pending` | En attente -- amber |
| `color.status.assigned` | Attribue -- blue |
| `color.status.inProgress` | En cours / En reparation -- blue.700 |
| `color.status.completed` | Termine -- green |
| `color.status.cancelled` | Annule -- red |

### 3.3 Typography Tokens

| Token | Size (px) | Weight | Line Height | Usage |
|---|---|---|---|---|
| `type.display` | 32 | 700 (Bold) | 1.2 | Hero headings, splash |
| `type.h1` | 26 | 700 (Bold) | 1.25 | Screen titles |
| `type.h2` | 22 | 600 (Semi) | 1.3 | Section headings |
| `type.h3` | 18 | 600 (Semi) | 1.35 | Card titles, subsections |
| `type.h4` | 16 | 600 (Semi) | 1.4 | List item titles |
| `type.body.lg` | 16 | 400 (Regular) | 1.5 | Primary body text |
| `type.body.md` | 14 | 400 (Regular) | 1.5 | Secondary body text |
| `type.body.sm` | 12 | 400 (Regular) | 1.5 | Captions, metadata |
| `type.label.lg` | 16 | 500 (Medium) | 1.4 | Button text, large labels |
| `type.label.md` | 14 | 500 (Medium) | 1.4 | Form labels, tabs |
| `type.label.sm` | 12 | 500 (Medium) | 1.4 | Small labels, badges |
| `type.overline` | 11 | 600 (Semi) | 1.6 | Section overlines, uppercase |
| `type.caption` | 11 | 400 (Regular) | 1.5 | Timestamps, footnotes |

**Font family recommendation:** A geometric sans-serif with excellent French diacritical support (e.g., Inter, Outfit, or Instrument Sans). Must render accents (e, e, a, o, u, c) crisply at all sizes.

### 3.4 Spacing Tokens

Base unit: **4px**

| Token | Value | Usage |
|---|---|---|
| `space.0` | 0px | Reset |
| `space.1` | 4px | Tight inline spacing, icon-to-text gap |
| `space.2` | 8px | Compact spacing, chip padding |
| `space.3` | 12px | Input inner padding, small card padding |
| `space.4` | 16px | Standard component padding, list item vertical |
| `space.5` | 20px | Section spacing (small) |
| `space.6` | 24px | Card body padding, section spacing (medium) |
| `space.8` | 32px | Section spacing (large) |
| `space.10` | 40px | Major section breaks |
| `space.12` | 48px | Screen top/bottom padding |
| `space.16` | 64px | Hero spacing, major visual breaks |
| `space.20` | 80px | Landing page section spacing |

### 3.5 Border Radius Tokens

| Token | Value | Usage |
|---|---|---|
| `radius.none` | 0px | No rounding |
| `radius.sm` | 4px | Small elements, chips inner |
| `radius.md` | 8px | Inputs, small cards |
| `radius.lg` | 12px | Cards, modals |
| `radius.xl` | 16px | Bottom sheets, large cards |
| `radius.2xl` | 24px | Floating action buttons, pills |
| `radius.full` | 9999px | Circular elements (avatars, dots) |

### 3.6 Shadow / Elevation Tokens

| Token | Value | Usage |
|---|---|---|
| `shadow.none` | none | Flat surfaces |
| `shadow.sm` | 0 1px 2px rgba(0,0,0,0.06) | Subtle lift: inputs focused, small cards |
| `shadow.md` | 0 2px 8px rgba(0,0,0,0.08) | Cards, elevated surfaces |
| `shadow.lg` | 0 4px 16px rgba(0,0,0,0.12) | Bottom sheets, modals |
| `shadow.xl` | 0 8px 32px rgba(0,0,0,0.16) | Full-screen modals, floating elements |

### 3.7 Breakpoint Tokens

| Token | Value | Usage |
|---|---|---|
| `breakpoint.sm` | 375px | Base mobile (iPhone SE / standard) |
| `breakpoint.md` | 428px | Large phone (iPhone Pro Max, Android large) |
| `breakpoint.lg` | 768px | Tablet portrait (garage portal, if applicable) |
| `breakpoint.xl` | 1024px | Tablet landscape / small desktop |
| `breakpoint.2xl` | 1280px | Desktop (landing page) |

### 3.8 Motion / Animation Tokens

| Token | Value | Usage |
|---|---|---|
| `motion.duration.fast` | 150ms | Micro-interactions (toggle, checkbox) |
| `motion.duration.normal` | 250ms | Standard transitions (screen, sheet) |
| `motion.duration.slow` | 400ms | Complex animations (stepper, map zoom) |
| `motion.easing.standard` | cubic-bezier(0.4, 0, 0.2, 1) | Most transitions |
| `motion.easing.decelerate` | cubic-bezier(0, 0, 0.2, 1) | Elements entering screen |
| `motion.easing.accelerate` | cubic-bezier(0.4, 0, 1, 1) | Elements leaving screen |

### 3.9 Z-Index Tokens

| Token | Value | Usage |
|---|---|---|
| `z.base` | 0 | Default content |
| `z.dropdown` | 100 | Dropdowns, tooltips |
| `z.sticky` | 200 | Sticky headers, bottom bars |
| `z.sheet` | 300 | Bottom sheets |
| `z.modal` | 400 | Modals, dialogs |
| `z.toast` | 500 | Toasts, snackbars |
| `z.overlay` | 600 | Full-screen overlays |

---

## 4. Shared vs. Unique Patterns

### 4.1 Architecture Overview

The PRD explicitly mandates a **shared design system** (Section 5.0: "double interface coherente") with a single token foundation. The differentiation happens at the **pattern level**, not the component level.

```
                   SHARED DESIGN SYSTEM
          +---------------------------------+
          |  Tokens (color, type, space)    |
          |  Foundation Components          |
          |  Input Components               |
          |  Navigation Shell               |
          |  Status Badges                  |
          |  Notification Components        |
          +---------------------------------+
                 /                  \
    +-----------------+    +-----------------+
    |  DRIVER APP     |    |  GARAGE PORTAL  |
    |  (Mobile)       |    |  (Mobile+)      |
    +-----------------+    +-----------------+
    | Claim Stepper   |    | Claim List/Grid |
    | Photo Capture   |    | Availability Mgr|
    | Garage Search   |    | Planning View   |
    | Booking Flow    |    | Status Updater  |
    | Status Tracker  |    | Garage Profile  |
    | Map View        |    | KPI Dashboard   |
    +-----------------+    +-----------------+
```

### 4.2 Shared Components (Used by Both Apps)

| Component | Driver Context | Garage Context |
|---|---|---|
| **Button (all variants)** | CTA: "Declarer", "Reserver" | CTA: "Accepter", "Mettre a jour" |
| **Status Badge** | Displays claim status | Updates claim status |
| **Status Timeline** | Views repair progress (read-only) | Views/updates repair progress |
| **Card (all variants)** | Garage card, Booking card | Sinistre card, Planning card |
| **List Item** | Garage list, History list | Claim list, Booking list |
| **Avatar** | Garage avatar display | Driver avatar display |
| **Form Inputs (all)** | Claim declaration, Booking | Profile management, Filters |
| **Top App Bar** | Screen titles, back navigation | Screen titles, back navigation |
| **Bottom Tab Bar** | Accueil / Sinistres / Profil | Tableau de bord / Sinistres / Planning / Profil |
| **Bottom Sheet** | Garage details overlay | Claim details overlay |
| **Dialog / Modal** | Booking confirmation | Accept/Refuse confirmation |
| **Toast / Snackbar** | "Sinistre declare!" | "Dossier accepte!" |
| **Notification Card** | Status change alerts | New claim alerts |
| **Empty State** | "Aucun sinistre" | "Aucun dossier" |
| **Error / Loading States** | Network errors, Loading | Network errors, Loading |
| **Image Gallery** | View garage photos, View claim photos | View/manage claim photos, Manage gallery |
| **Skeleton Loader** | All data screens | All data screens |

### 4.3 Driver-Only Components

| Component | Reason for Exclusivity |
|---|---|
| **Photo Capture (Camera Overlay)** | Only drivers photograph accidents |
| **Photo Requirement Guide** | Guided photo capture is driver-side |
| **License Plate Input** | Vehicle registration is driver-side |
| **Location Input (accident)** | Accident location capture |
| **Garage Search + Map** | Marketplace search is driver-initiated |
| **Map Markers (garage, user)** | Map view is driver-side in MVP |
| **Map Callout** | Part of garage search |
| **Map + List Toggle** | Driver garage search UI |
| **Booking Flow (date + time selection)** | Driver selects slots |
| **Booking Confirmation Card** | Driver receives confirmation |
| **Progress Stepper (declaration)** | 4-step claim stepper is driver-only |
| **Claim Declaration Summary** | Pre-submission review |

### 4.4 Garage-Only Components

| Component | Reason for Exclusivity |
|---|---|
| **Availability Toggle Row** | Garage manages own availability |
| **Calendar Grid (management)** | Garage manages scheduling (week/month) |
| **Week Strip (planning)** | Planning navigation |
| **Quick Accept/Refuse** | Garage decision on claims |
| **Attribution Indicator** | Marketplace assignment visibility |
| **KPI / Stat Card** | Garage performance dashboard |
| **Claim Dossier View (full)** | Garage reviews complete dossier |
| **Status Update Button** | Only garages change repair status |
| **Specialties Tag Editor** | Garage profile management |
| **Zone d'intervention Selector** | Garage coverage area config |
| **Planning Day View** | Daily schedule view |

### 4.5 Shared Pattern Library

| Pattern | Description | Used In |
|---|---|---|
| **List + Filter + Sort** | Scrollable list with sticky filter chips and sort control | Garage search (driver), Claim list (garage) |
| **Detail Sheet** | Bottom sheet expanding to full screen with sticky CTA footer | Garage detail (driver), Claim detail (garage) |
| **Confirmation Flow** | Review summary > Confirm dialog > Success toast > Updated state | Booking (driver), Accept claim (garage) |
| **Pull-to-Refresh** | Swipe down to refresh list data | All list views |
| **Infinite Scroll** | Load more items on scroll | Long lists |
| **Search + Results** | Search input > Loading > Results list / Empty state | Garage search, Claim search |
| **Settings List** | Grouped list items with toggles, navigation chevrons | Notification prefs, Account settings |

---

## 5. Status System

### 5.1 Status Flow Overview

The PRD defines **three interconnected status flows** that must be systematized into a coherent, unified status architecture.

### 5.2 Flow 1: Claim Status (Sinistre)

This is the **master status** governing the claim lifecycle.

```
[Brouillon] --> [Soumis] --> [En attente] --> [Attribue] --> [Planifie] --> [En reparation] --> [Termine]
                                  |                                              |
                                  +--> [Expire]                                  +--> [Litige]
                                  +--> [Annule]
```

| Status Key | French Label | English Equivalent | Color Token | Icon | Description |
|---|---|---|---|---|---|
| `draft` | Brouillon | Draft | `color.gray.400` | `edit` | Claim started but not submitted |
| `submitted` | Soumis | Submitted | `color.info` | `send` | Claim submitted, pending garage visibility |
| `pending` | En attente | Pending | `color.status.pending` | `clock` | Visible to garages, awaiting acceptance |
| `assigned` | Attribue | Assigned | `color.status.assigned` | `user-check` | Garage has accepted the claim |
| `scheduled` | Planifie | Scheduled | `color.status.assigned` | `calendar-check` | Drop-off appointment booked |
| `in_repair` | En reparation | In Repair | `color.status.inProgress` | `wrench` | Vehicle at garage, repair underway |
| `completed` | Termine | Completed | `color.status.completed` | `check-circle` | Repair finished, vehicle ready |
| `cancelled` | Annule | Cancelled | `color.status.cancelled` | `x-circle` | Claim cancelled by driver |
| `expired` | Expire | Expired | `color.gray.400` | `clock-off` | No garage accepted in time |

### 5.3 Flow 2: Booking Status (Rendez-vous)

Tied to a specific claim and garage pair.

```
[Propose] --> [Confirme] --> [Rappel envoye] --> [Vehicule depose] --> [Termine]
                  |
                  +--> [Annule]
                  +--> [Replanifie]
```

| Status Key | French Label | Color Token | Description |
|---|---|---|---|
| `proposed` | Propose | `color.warning` | Slot requested by driver, awaiting confirmation |
| `confirmed` | Confirme | `color.success` | Slot confirmed by both parties |
| `reminder_sent` | Rappel envoye | `color.info` | Automated reminder sent (24h before) |
| `vehicle_dropped` | Vehicule depose | `color.status.inProgress` | Driver has dropped off vehicle |
| `completed` | Termine | `color.status.completed` | Appointment fulfilled |
| `cancelled` | Annule | `color.status.cancelled` | Appointment cancelled |
| `rescheduled` | Replanifie | `color.warning` | Appointment moved to new date |

### 5.4 Flow 3: Repair Status (Reparation)

Sub-statuses within the `in_repair` claim state, managed by the garage.

```
[Reception] --> [Diagnostic] --> [En cours] --> [Controle qualite] --> [Pret]
```

| Status Key | French Label | Color Token | Description |
|---|---|---|---|
| `received` | Receptionne | `color.status.assigned` | Vehicle received at garage |
| `diagnostic` | Diagnostic | `color.info` | Assessment in progress |
| `in_progress` | Travaux en cours | `color.status.inProgress` | Active repair work |
| `quality_check` | Controle qualite | `color.info` | Final inspection |
| `ready` | Pret | `color.status.completed` | Ready for pickup |

### 5.5 Unified Status Component Specification

To avoid building separate badge/timeline components for each flow, the design system provides a **single, polymorphic status component** with the following anatomy:

#### Status Badge

```
+---------------------------------------+
|  [dot]  [label]                       |
+---------------------------------------+
```

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `status` | StatusKey (enum) | Yes | One of the status keys from any flow |
| `size` | `sm` / `md` | No (default: `md`) | Small: 20px height, Medium: 28px height |
| `variant` | `filled` / `outlined` / `dot-only` | No (default: `filled`) | Visual treatment |
| `flow` | `claim` / `booking` / `repair` | No | Used to resolve label and color from status key |

#### Status Timeline

```
  [check]  Sinistre soumis           12 mars 14:30
     |
  [check]  Garage attribue           12 mars 16:00
     |
  [pulse]  En reparation             13 mars 09:00    <-- current
     |
  [ dot ]  Termine                   --
```

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `steps` | StatusTimelineStep[] | Yes | Array of { status, label, timestamp, isCurrent } |
| `orientation` | `vertical` / `horizontal` | No (default: `vertical`) | Layout direction |
| `size` | `sm` / `md` | No (default: `md`) | Compact or standard |

### 5.6 Status-to-Notification Mapping

Every status transition should trigger a notification. This mapping ensures consistency:

| From Status | To Status | Notification Recipient | Message Template |
|---|---|---|---|
| `submitted` | `pending` | Driver | "Votre sinistre est visible par les garages a proximite." |
| `pending` | `assigned` | Driver | "Le garage {name} a accepte votre dossier." |
| `pending` | `assigned` | Garage | "Vous avez accepte le dossier #{id}." |
| `assigned` | `scheduled` | Both | "Rendez-vous confirme le {date} a {time}." |
| `scheduled` | `in_repair` | Driver | "Votre vehicule est pris en charge par {garage}." |
| (repair sub) | (repair sub) | Driver | "Mise a jour : {repair_status_label}." |
| `in_repair` | `completed` | Driver | "Votre vehicule est pret ! Contactez {garage}." |

---

## 6. Notification & Messaging Components

### 6.1 Notification Types

| Type | Trigger | Channel | Component |
|---|---|---|---|
| **Status Change** | Any status transition (see Section 5.6) | Push + In-app | CM02 Notification Card |
| **Booking Reminder** | 24h and 2h before appointment | Push + In-app | CM04 Push Preview |
| **New Claim Available** | New sinistre in garage zone | Push + In-app | CM02 Notification Card |
| **Claim Accepted** | Garage accepts a sinistre | Push + In-app | CM02 Notification Card |
| **Message Received** | New chat message (V1+) | Push + In-app | CM01 Chat Bubble |
| **System Announcement** | App updates, maintenance | In-app banner | S05 Inline Alert |

### 6.2 Notification Center Architecture

```
+------------------------------------------+
|  [Back]     Notifications     [Mark all]  |
+------------------------------------------+
|                                          |
|  AUJOURD'HUI                             |
|  +--------------------------------------+|
|  | [icon] Garage ABC a accepte votre   ||
|  |        dossier #1234                 ||
|  |        Il y a 2h               [dot] ||
|  +--------------------------------------+|
|  | [icon] Rendez-vous confirme pour     ||
|  |        le 15 mars a 10h00            ||
|  |        Il y a 5h                     ||
|  +--------------------------------------+|
|                                          |
|  HIER                                    |
|  +--------------------------------------+|
|  | [icon] Votre sinistre est visible    ||
|  |        par les garages               ||
|  |        Hier, 16:42                   ||
|  +--------------------------------------+|
+------------------------------------------+
```

### 6.3 Notification Card Anatomy

| Element | Token | Details |
|---|---|---|
| Container | `surface.default`, `radius.lg` | Full-width, horizontal padding `space.4` |
| Icon | 24px, color mapped to notification type | Status-specific icon |
| Title | `type.label.md`, `color.text.primary` | Bold notification headline |
| Body | `type.body.md`, `color.text.secondary` | Description, truncated to 2 lines |
| Timestamp | `type.caption`, `color.text.tertiary` | Relative time ("Il y a 2h") or absolute |
| Unread Dot | `color.primary`, 8px circle | Right-aligned, only when unread |
| Swipe Left | Reveal "Archiver" action | Destructive color background |

### 6.4 In-App Messaging (V1 / Should-Have)

The PRD implies driver-garage communication for coordination. A minimal chat component set:

| Component | Specification |
|---|---|
| **Chat Screen** | Top bar with contact name, Scrollable message list, Bottom input bar with send button |
| **Sent Bubble** | Right-aligned, `color.primary` background, `color.text.inverse` text, `radius.lg` with bottom-right squared |
| **Received Bubble** | Left-aligned, `color.surface.muted` background, `color.text.primary` text, `radius.lg` with bottom-left squared |
| **System Message** | Center-aligned, `type.caption`, `color.text.tertiary`, no bubble |
| **Image Message** | Thumbnail with `radius.md`, tap to expand to P04 Full-screen Image Viewer |
| **Typing Indicator** | Three animated dots in received bubble style |
| **Input Bar** | Text input + Attach (photo) + Send button; Sticky bottom, keyboard-aware |

---

## 7. Accessibility Requirements

### 7.1 Standards & Compliance

| Standard | Level | Rationale |
|---|---|---|
| **WCAG 2.1** | **AA** (minimum) | European Accessibility Act (EAA) compliance; French RGAA alignment |
| **RGAA 4.1** | Partial | French government accessibility framework -- relevant for any public-facing French service |
| **iOS Accessibility** | Full support | VoiceOver, Dynamic Type, Reduce Motion, Bold Text |
| **Android Accessibility** | Full support | TalkBack, Font scaling, Reduce animations |

### 7.2 Color & Contrast Requirements

| Requirement | Specification | Tokens Affected |
|---|---|---|
| **Text contrast ratio** | Minimum 4.5:1 for body text, 3:1 for large text (18px+/bold 14px+) | All `color.text.*` on all `color.surface.*` |
| **Non-text contrast** | Minimum 3:1 for UI components and graphical objects | Icons, borders, status badges, map markers |
| **Color not sole indicator** | Status must be communicated through color + icon + text label | Status badges must always include label, not just colored dot |
| **Status badge accessibility** | Each status badge uses: color + icon + text + optional pattern | `S01` component spec |
| **Dark mode** | Not required for MVP, but token architecture must support future dark theme | Tier 2 alias tokens enable theme switching |

### 7.3 Touch Target Requirements

| Requirement | Specification | Components Affected |
|---|---|---|
| **Minimum touch target** | 44x44 pt (iOS) / 48x48 dp (Android) | All interactive elements |
| **Spacing between targets** | Minimum 8px gap | Button groups, list items, filter chips |
| **Post-accident context** | Recommended 48x48 pt minimum for claim declaration flow (stressed user, possibly shaking hands) | Photo Capture buttons, Stepper navigation |

### 7.4 Typography & Readability

| Requirement | Specification |
|---|---|
| **Minimum body text size** | 14px (never smaller for meaningful content) |
| **Dynamic Type support** | All text must scale from 85% to 135% without layout breakage |
| **Line height** | Minimum 1.5x for body text (already in token spec) |
| **French diacriticals** | Font must render all French accents cleanly: e e a i o u c oe ae |
| **Maximum line length** | 60-80 characters for optimal readability |
| **Text alignment** | Left-aligned for body text (French reads left-to-right). No justified text on mobile. |

### 7.5 Screen Reader Requirements

| Requirement | Specification |
|---|---|
| **Language declaration** | `lang="fr"` on all screens; VoiceOver French voice by default |
| **Semantic structure** | Proper heading hierarchy (H1 > H2 > H3), landmark regions |
| **Image alt text** | All decorative images: `aria-hidden`. All informational images: descriptive alt text in French |
| **Status announcements** | Status changes must be announced via `aria-live="polite"` regions |
| **Form labels** | Every input must have a visible label + programmatic association. Placeholder text is not a label. |
| **Error announcements** | Form errors must be announced immediately and linked to the offending field |
| **Custom component roles** | Bottom sheets: `role="dialog"`. Tab bars: `role="tablist"`. Status badges: appropriate `aria-label` |
| **Photo capture guidance** | Camera overlay must provide audio guidance for visually impaired users: "Prenez une photo de l'avant du vehicule" |

### 7.6 Navigation & Focus Management

| Requirement | Specification |
|---|---|
| **Focus trapping** | Modals and bottom sheets must trap focus within the overlay |
| **Focus restoration** | When a modal closes, focus returns to the trigger element |
| **Skip navigation** | Not required for mobile apps but recommended for landing page |
| **Logical tab order** | Left-to-right, top-to-bottom; stepper steps in order |
| **Visible focus indicator** | 2px `color.border.focus` ring on all focusable elements |

### 7.7 Motion & Animation

| Requirement | Specification |
|---|---|
| **Reduce Motion** | Respect OS-level `prefers-reduced-motion`. Replace animations with instant state changes. |
| **No auto-playing** | No auto-playing video or animation. Map auto-zoom must be interruptible. |
| **Flash content** | No content flashing more than 3 times per second |

### 7.8 Accessibility Testing Checklist

| Test | Tool / Method | Frequency |
|---|---|---|
| Color contrast | Figma plugin (Stark / A11y) | Every design review |
| Screen reader | VoiceOver (iOS), TalkBack (Android) | Every prototype test |
| Keyboard navigation | External keyboard on mobile | Every new flow |
| Dynamic Type scaling | iOS/Android accessibility settings | Every new screen |
| Touch target audit | Figma measurement | Every component spec |
| French language review | Native French speaker | Every release |

---

## 8. Scalability Considerations

### 8.1 V2 Feature Impact on Design System

The PRD explicitly mentions future evolution (Section 10). Here is how V2 features impact component planning:

| Future Feature | PRD Reference | Design System Impact |
|---|---|---|
| **Insurance Integration** | Section 3.3 (persona tertiaire), Section 4.1 (V2) | New persona view, Insurer dashboard components, Claim dossier export format, New status states (insurer review, approved, rejected) |
| **Geographic Expansion** | Section 10 -- Etape 3 | Multi-language token layer (i18n), Locale-specific formatting (date, phone, currency), Potential RTL support |
| **Rating & Review System** | Implied by marketplace model | Star rating component, Review card, Rating input, Aggregate score display |
| **Payment / Commission** | Section 9 -- Question #6 (modele de revenus) | Payment method input, Invoice/Receipt card, Pricing display, Subscription tier badge |
| **In-app Messaging (full)** | Implied | Rich message types (file, location, quote), Conversation threads, Read receipts, Message reactions |
| **Vehicle History** | Section 1 -- "historique, entretien, relation garage" | Vehicle timeline, Service record card, Maintenance reminder |
| **Multi-vehicle Support** | Natural evolution | Vehicle switcher, Vehicle list component |
| **Garage Analytics Dashboard** | Natural evolution for garage retention | Chart components (line, bar, pie), Data table, Date range picker, Export button |
| **Web/Tablet Garage Portal** | Section 9 -- Question #3 | Responsive layout system, Sidebar navigation, Multi-column layouts, Desktop-optimized inputs |

### 8.2 Token Architecture for Scale

| Decision | Rationale |
|---|---|
| **Three-tier tokens** | Global > Alias > Component allows theme switching without touching component code |
| **Semantic naming** | `color.primary` not `color.blue` at alias level -- enables complete rebrand |
| **Role-based token subsets** | Future: `theme.driver.*` and `theme.garage.*` allow per-role theming if needed |
| **Platform tokens** | Export tokens to: CSS custom properties (web), iOS asset catalog, Android resources |
| **Dark mode readiness** | All alias tokens reference global tokens; swapping to dark only requires remapping alias layer |

### 8.3 Component Architecture for Scale

| Decision | Rationale |
|---|---|
| **Composition over variants** | Build small composable primitives (Card > CardHeader > CardBody > CardFooter) rather than monolithic variants |
| **Slot-based patterns** | Components accept children/slots for content flexibility without new variants |
| **Status as enum, not hardcoded** | Status system uses string enum keys; adding new statuses only requires token additions |
| **Separate layout from content** | Grid, Stack, and Cluster layout components decouple positioning from UI elements |
| **Icon system as separate package** | Icons managed independently; new icons added without touching component library |

### 8.4 Multi-Platform Strategy

```
                     DESIGN TOKENS (JSON / YAML)
                              |
            +--Figma Variables (design tool)
            |
            +--CSS Custom Properties (landing page, web portal)
            |
            +--iOS Swift Package (driver app iOS)
            |
            +--Android Resource (driver app Android)
            |
            +--React Native / Flutter Theme (if cross-platform)
```

**Recommendation:** Use a tool like Style Dictionary or Tokens Studio to maintain a single source of truth for tokens, exporting to all target platforms.

### 8.5 Versioning Strategy

| Aspect | Approach |
|---|---|
| **Semantic versioning** | Components follow semver: MAJOR (breaking).MINOR (feature).PATCH (fix) |
| **Changelog** | Every component change documented with before/after visuals |
| **Deprecation policy** | Old variants marked deprecated for 2 release cycles before removal |
| **Breaking changes** | Major version bumps require migration guide |

---

## 9. Recommendations & Build Priority

### 9.1 Phased Build Roadmap

The design system should be built incrementally, aligned with the PRD's phased delivery (Section 7.1).

#### Phase 0: Foundations (Week 1-2, aligned with PRD Phase 0 - Kickstart)

**Goal:** Establish the design system skeleton so all subsequent work uses tokens and shared primitives.

| # | Deliverable | Effort | Dependency |
|---|---|---|---|
| 1 | **Token definitions** (color, type, space, radius, shadow, motion) | 2 days | Brand identity confirmation (PRD Q#1) |
| 2 | **Figma setup** (variables, text styles, color styles, grid) | 1 day | Tokens |
| 3 | **Icon audit & system** (define grid, keylines, export pipeline) | 1 day | None |
| 4 | **Foundation components** (Button, Icon, Typography, Surface/Card, Avatar, Divider) | 3 days | Tokens |
| 5 | **Naming convention guide** | 0.5 day | None |

#### Phase 1: Driver UX Components (Week 3-5, aligned with PRD Phase 1 - UX)

**Goal:** Build all components needed for driver wireframes and user flows.

| # | Deliverable | Effort | Dependency |
|---|---|---|---|
| 6 | **Input & Form components** (all 15 from Section 2.2) | 4 days | Foundation |
| 7 | **Navigation shell** (Bottom Tab Bar, Top App Bar, Back/Close Header) | 2 days | Foundation |
| 8 | **Progress Stepper** (4-step declaration flow) | 1 day | Foundation |
| 9 | **Photo Capture components** (Camera Overlay, Thumbnail, Requirement Guide) | 2 days | Foundation |
| 10 | **Map components** (Map View, Markers, Callout, Toggle) | 2 days | Foundation |
| 11 | **Status Badge + Timeline** (unified status system) | 2 days | Tokens (status colors) |
| 12 | **Calendar + Time Slot** components | 2 days | Foundation |
| 13 | **Garage Card + Detail Sheet** | 1 day | Card, Badge, Calendar |
| 14 | **Empty / Error / Loading states** | 1 day | Foundation |
| 15 | **Bottom Sheet + Modal + Action Sheet** | 2 days | Foundation |
| 16 | **Booking Confirmation Card** | 0.5 day | Card, Badge |

#### Phase 2: Garage Portal Components (Week 5-7, aligned with PRD Phase 2 - UI)

**Goal:** Build garage-specific components and high-fidelity screens.

| # | Deliverable | Effort | Dependency |
|---|---|---|---|
| 17 | **Claim Dossier View** | 2 days | Status system, Image Gallery |
| 18 | **Quick Accept/Refuse pattern** | 1 day | Button, Dialog |
| 19 | **Availability Management** (Calendar Grid, Toggle Row, Week Strip) | 2 days | Calendar components |
| 20 | **Planning Day View** | 1 day | Calendar, List Item |
| 21 | **Garage Profile Editor** | 1 day | Form components, Image Gallery |
| 22 | **KPI / Stat Cards** | 0.5 day | Card, Typography |
| 23 | **Notification Center + Cards** | 1.5 days | List Item, Badge |
| 24 | **Attribution Indicator** | 0.5 day | Badge |

#### Phase 3: Landing Page & Polish (Week 7-8, aligned with PRD Phase 3 - Landing)

| # | Deliverable | Effort | Dependency |
|---|---|---|---|
| 25 | **Landing page components** (Hero, How It Works, Benefits, Form, Footer) | 2 days | Foundation |
| 26 | **Responsive layout tokens** (breakpoints, grid for desktop) | 1 day | Tokens |
| 27 | **Accessibility audit** (full pass across all components) | 2 days | All components |
| 28 | **Documentation** (component specs, usage guidelines, do/don't) | 2 days | All components |
| 29 | **Prototype handoff preparation** (interaction specs, dev brief) | 1 day | All above |

### 9.2 Critical Path Dependencies

```
Brand Identity (PRD Q#1) --> Tokens --> Foundation --> ALL other components
                                                        |
                    Attribution Logic (PRD Q#2) --------+--> Marketplace patterns
                                                        |
                    Portal Scope (PRD Q#3) -------------+--> Responsive tokens
```

**Blocker alert:** The PRD has three open questions (#1, #2, #3) that directly impact the design system. The brand identity (#1) blocks token definition entirely. These must be resolved at kickoff.

### 9.3 Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Brand identity not defined before UI phase | High (PRD Q#1 is open) | Blocks all color/type tokens | Use provisional palette (calming blue + neutral) with easy swap via alias tokens |
| Garage portal scope unclear (mobile vs. web) | Medium (PRD Q#3) | Impacts responsive tokens and navigation | Build mobile-first; use breakpoint tokens that can extend to tablet/desktop |
| Attribution logic undecided | Medium (PRD Q#2) | Impacts marketplace components | Design both patterns (auto-assign + driver-select) as variants of the same component |
| Feature creep into design system | Medium | Delays delivery | Strict MoSCoW on components; "Could" items deferred to V1 |

### 9.4 Naming Convention Recommendations

| Entity | Convention | Example |
|---|---|---|
| **Tokens** | dot-separated, lowercase, category-first | `color.primary`, `space.4`, `type.body.md` |
| **Components** | PascalCase, compound names hyphenated | `StatusBadge`, `GarageCard`, `PhotoCapture` |
| **Variants** | camelCase prop values | `variant="filled"`, `size="md"` |
| **States** | Standard CSS pseudo-class names | `default`, `hover`, `focus`, `active`, `disabled` |
| **Icons** | kebab-case, action or noun first | `car-front`, `wrench`, `calendar-check`, `map-pin` |
| **Figma layers** | Slash-separated category/name | `Button/Primary/Default`, `Badge/Status/Pending` |
| **CSS classes** | BEM or utility-first (per framework choice) | `.btn--primary`, `.badge--status-pending` |

### 9.5 Tooling Recommendations

| Tool | Purpose | Priority |
|---|---|---|
| **Figma** | Design tool, component library, prototyping | Must (PRD-mandated) |
| **Figma Variables** | Token management within Figma | Must |
| **Tokens Studio** (or Style Dictionary) | Token export to all platforms | Should |
| **Figma Component Library** | Shared library across driver + garage files | Must |
| **Storybook** (or equivalent) | Component documentation for development handoff | Should (Phase 4+) |
| **Accessibility plugin (Stark)** | Automated contrast and accessibility checks | Must |

### 9.6 Success Metrics for the Design System

| Metric | Target | Measurement |
|---|---|---|
| **Token coverage** | 100% of raw values replaced by tokens | Audit: no hardcoded values in Figma |
| **Component reuse** | >70% of screens built entirely from library components | Count custom vs. library instances |
| **Accessibility compliance** | WCAG AA on 100% of components | Automated + manual audit |
| **Design consistency** | Zero visual inconsistencies between driver app and garage portal | Cross-app visual review |
| **Designer adoption** | All designers use library components (no detached instances) | Figma analytics |
| **State coverage** | 100% of components have all required states designed | Checklist per component |
| **Empty/Error/Loading** | 100% of data screens have all three states | DoD checklist |

---

## Appendix A: Component-to-User-Story Traceability

| User Story | Components Required |
|---|---|
| **US01** -- Declarer sinistre | Progress Stepper, Photo Capture, Photo Requirement Guide, Location Input, License Plate Input, Text Input, Select, Form Group, Button, Top App Bar |
| **US02** -- Voir garages | Map View, Map Markers, Map Callout, Map+List Toggle, Garage Card, Search Input, Filter Chip Group, Bottom Sheet |
| **US03** -- Reserver creneau | Calendar Grid, Time Slot Picker, Booking Confirmation Card, Dialog, Toast |
| **US04** -- Suivre statut | Status Timeline, Status Badge, Notification Card, Push Preview |
| **US05** -- Consulter sinistres (garage) | Claim Card (actionable), List Item, Filter Chip Group, Quick Accept/Refuse, Dialog |
| **US06** -- Gerer planning | Calendar Grid, Week Strip, Availability Toggle Row, Time Slot Grid |
| **US07** -- Mettre a jour statut | Status Badge, Button (status update), Dialog, Toast |
| **US08** -- Profil garage | Profile Card, Text Input, Textarea, Image Gallery, Toggle, Form Group |
| **US09** -- Transmission dossier | Claim Dossier View, Vehicle Info Card, Image Gallery, Status Badge |
| **US10** -- Landing page | Hero Section, How It Works, Benefits Grid, Garage Signup Form, Footer, Sticky CTA Bar |

## Appendix B: State Matrix for Critical Components

Every component must be designed for the following states. An "X" indicates the state applies to that component.

| Component | Default | Hover | Pressed | Focused | Disabled | Loading | Error | Empty | Success |
|---|---|---|---|---|---|---|---|---|---|
| Button | X | X | X | X | X | X | - | - | - |
| Text Input | X | X | - | X | X | - | X | - | X |
| Photo Capture | X | - | X | - | - | X | X | X | X |
| Garage Card | X | X | X | X | - | X | - | - | - |
| Claim Card | X | X | X | X | - | X | - | - | - |
| Status Badge | X | - | - | - | - | - | - | - | - |
| Calendar Day | X | X | X | X | X | - | - | - | X |
| Time Slot | X | X | X | X | X | - | - | - | - |
| Map Marker | X | - | X | X | - | - | - | - | - |
| Bottom Sheet | X | - | - | X | - | X | X | X | - |
| List View | X | - | - | - | - | X | X | X | - |
| Notification Card | X | X | X | X | - | - | - | - | - |

---

*End of Design System Analysis -- Carlib v0.1*
*Generated: Avril 2026 | Agent: Design System Architect*
