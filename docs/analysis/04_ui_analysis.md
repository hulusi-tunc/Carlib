# 04 -- UI Design Analysis: Carlib

**Project:** Carlib -- Mobile-first marketplace for post-accident driver-to-body-shop connection (France)
**PRD Version:** v0.1 Draft, March 2026
**Analysis Date:** April 2026
**Analyst Role:** UI Designer Agent (Visual Systems)

---

## Table of Contents

1. [Visual Identity Requirements](#1-visual-identity-requirements)
2. [Color System Considerations](#2-color-system-considerations)
3. [Typography Needs](#3-typography-needs)
4. [Screen Inventory](#4-screen-inventory)
5. [Layout & Grid Considerations](#5-layout--grid-considerations)
6. [Visual Hierarchy Challenges](#6-visual-hierarchy-challenges)
7. [Landing Page Visual Requirements](#7-landing-page-visual-requirements)
8. [Recommendations -- Decisions Needed Before Phase 2](#8-recommendations--decisions-needed-before-phase-2-ui)

---

## 1. Visual Identity Requirements

### What the PRD Says

The PRD provides **design principles** but no concrete visual identity:

| PRD Reference | What It States |
|---|---|
| Section 5.0 | "Identite Visuelle & Moodboard" -- references AI-generated maquettes from Emergent tool, produced by the client. These are labeled as "base de discussion et non de brief design valide." |
| Section 5.1 | Four design principles: Rassurant & grand public, Zero friction, Coherence totale (shared design system), Entierement en francais. |
| Section 8.2 | DoD requires: design system documented, colors/typography/spacing applied coherently. |
| Question #1 (Section 9) | **Status: OPEN** -- "Identite visuelle : charte graphique Carlib a definir ou confirmer avant le demarrage UI. Logo existant ?" |

### What Is Explicitly Missing

The following visual identity elements have **zero definition** in the PRD:

| Missing Element | Impact on UI Phase | Urgency |
|---|---|---|
| **Logo** | Blocks header design, favicon, splash screen, app icon | Critical -- blocks Phase 2 start |
| **Brand colors** | Blocks entire color system, all component styling | Critical |
| **Typography choice** | Blocks all text rendering, hierarchy system | Critical |
| **Tone of voice** | Affects microcopy styling, empty states, error messages | High |
| **Iconography style** | Affects navigation, status indicators, action buttons | High |
| **Photography / illustration direction** | Affects onboarding, landing page, empty states | Medium |
| **Brand personality keywords** | Guides all subjective design decisions | High |
| **App icon** | Required for store listing mockups, prototype polish | Medium |
| **Naming convention** | "Carlib" confirmed, but tagline/descriptor undefined | Low |

### Key Finding

The PRD explicitly flags visual identity as an **open blocker** (Question #1). The Emergent maquettes exist but are not validated. Phase 2 (UI) cannot begin without resolving this. The kickoff ateliers must include a visual identity workshop or the client must provide a brand brief.

### Recommendation

Before any high-fidelity work begins, the team needs at minimum:
- A confirmed logo (or interim wordmark)
- 1 primary color + 1 secondary color direction
- A typeface decision (or shortlist of 2-3)
- Confirmed brand personality attributes (e.g., "calme, fiable, moderne, accessible")

---

## 2. Color System Considerations

### The Emotional Context: Post-Accident Stress

Carlib's primary user -- the "conducteur sinistre" -- arrives at the app in a state of **acute stress, confusion, and urgency**. The PRD uses the words "stressant," "rassurante," and "guidee" repeatedly. This is not a casual browsing experience. The color system must serve as **emotional infrastructure**.

### Psychological Color Framework for Carlib

| Emotional Need | Color Direction | Rationale | Avoid |
|---|---|---|---|
| **Calm after shock** | Cool blues, soft teals | Blue lowers heart rate perception, signals trust. Used by insurance (AXA, Allianz), healthcare. | Aggressive reds, harsh oranges -- associated with danger, the accident itself |
| **Trust & reliability** | Deep navy, confident blue | Signals institutional seriousness. The user is trusting Carlib with a financial/legal process. | Trendy pastels that feel unserious for a 3000EUR+ repair |
| **Progress & positivity** | Warm greens, soft emeralds | Green for success states, completion, "everything is handled." Repair progress = forward momentum. | Neon greens (too tech/gaming) |
| **Urgency without panic** | Warm amber (not red) for alerts | Red signals STOP/danger -- triggering in a post-accident context. Amber = attention without fear. | Pure red for primary CTAs or status alerts |
| **Professionalism** | Neutral grays, slate tones | Body shops/garages need to see Carlib as a professional B2B tool, not a consumer toy. | Playful palettes that undermine B2B credibility |

### Proposed Color System Architecture

```
Primary:        Trust blue (hero actions, headers, brand anchoring)
Secondary:      Calm teal or warm green (progress, success, reassurance)
Neutral:        Slate gray scale (text, borders, backgrounds, cards)
Semantic:
  - Success:    Soft green (repair complete, booking confirmed)
  - Warning:    Warm amber (action needed, expiring slot)
  - Error:      Muted red-orange (form errors, failed uploads -- NOT aggressive red)
  - Info:       Light blue (tips, guidance, helper text)
Accent:         One warm accent (CTA buttons on landing page, differentiator)
```

### Dual-Interface Color Considerations

The PRD mandates a shared design system across driver app and garage portal. However, the emotional contexts differ:

| Aspect | Driver App | Garage Portal |
|---|---|---|
| **Emotional tone** | Reassuring, warm, guided | Professional, efficient, structured |
| **Color weight** | Lighter backgrounds, softer tones | Can tolerate higher contrast, denser UI |
| **Primary use of color** | Guide attention to next step | Organize information density |
| **Status colors** | Reassurance-oriented (green = "your car is being handled") | Operations-oriented (green = "ready for action") |

**Recommendation:** Use the same palette but different **application ratios**. The driver app should be 80% white/light with color used sparingly for guidance. The garage portal can be 70% light / 30% structured color for data organization.

### Dark Mode Consideration

The PRD does not mention dark mode. However:
- Accidents happen at night. A post-accident user on the roadside with a blinding white screen is a usability failure.
- France's hours of darkness in winter (17:00-08:00) overlap with commute times.
- **Recommendation:** Plan the color system with dark mode tokens from day one, even if dark mode ships in V2. This means defining colors as semantic tokens (`surface-primary`, `text-on-surface`) rather than raw hex values.

---

## 3. Typography Needs

### French Language Requirements

French text has specific typographic demands that affect font selection:

| French Characteristic | Design Implication |
|---|---|
| **Diacritics** (e, e, e, a, u, c, o, i) | Font must render all accented characters cleanly at small sizes. Test: "Reparation vehicule -- declaree" |
| **Longer words** than English | "Disponibilites" (15 chars) vs "Availability" (12). Labels need ~20% more horizontal space. |
| **Formal register** in insurance/legal context | "Votre sinistre a ete transmis au garage selectionne" -- longer sentences, more formal tone. |
| **Special punctuation** (guillemets, espaces insecables) | Font must handle << >> and thin non-breaking spaces before : ; ! ? per French typographic rules. |
| **Mixed-case proper nouns** | Garage names, street addresses, insurance company names -- variable length, capitalization. |

### Mobile-First Typography Scale

For a mobile-first app with dense information (forms, lists, status cards), the type scale must be tight but legible:

| Level | Suggested Size (rem) | Usage | Weight |
|---|---|---|---|
| **Display** | 2.0 (32px) | Landing page hero headline only | Bold |
| **H1** | 1.75 (28px) | Screen titles: "Declarer un sinistre" | Semibold |
| **H2** | 1.375 (22px) | Section headers: "Garages a proximite" | Semibold |
| **H3** | 1.125 (18px) | Card titles: garage name, dossier ID | Medium |
| **Body** | 1.0 (16px) | Primary content: descriptions, instructions | Regular |
| **Body Small** | 0.875 (14px) | Secondary info: addresses, timestamps, metadata | Regular |
| **Caption** | 0.75 (12px) | Labels, hints, helper text under form fields | Regular / Medium |
| **Overline** | 0.6875 (11px) | Status badges, category tags, step indicators | Semibold / Uppercase |

### Font Selection Criteria

Given the context (French, mobile, insurance/automotive, stress scenario):

| Criterion | Rationale |
|---|---|
| **Excellent French diacritic support** | Non-negotiable. Many Google Fonts have mediocre accent rendering. |
| **High x-height** | Improves legibility at 14px on mobile. Critical for older users (garage owners, 45+ persona). |
| **Clean at small sizes** | Status labels, timestamps, and metadata rendered at 11-12px must remain crisp. |
| **Multiple weights (400, 500, 600, 700 minimum)** | Hierarchy without size change. Especially for data-dense garage portal. |
| **Sans-serif** | Appropriate for mobile UI, modern/professional tone. Serif would skew too formal/editorial. |
| **Good numeric rendering** | Prices (EUR), dates, phone numbers, distances (km) are everywhere. Tabular figures preferred. |

### Font Shortlist Considerations

| Font Family | Strengths for Carlib | Potential Concerns |
|---|---|---|
| **Inter** | Designed for screens, excellent French support, tabular figures, many weights, open source. Industry standard. | Very common -- less distinctive brand feel. |
| **Plus Jakarta Sans** | Geometric warmth, friendly yet professional. Good weight range. | Slightly less proven for dense data tables. |
| **Nunito Sans** | Rounded terminals add warmth (reassurance), good French support. | May feel too soft for the B2B garage portal. |
| **Source Sans 3** | Adobe's open-source workhorse. Excellent at small sizes, strong French/European support. | Slightly utilitarian -- less personality. |
| **Outfit** | Modern geometric, clean, good weight range. Feels contemporary. | Newer typeface, less battle-tested. |

**Recommendation:** Consider Inter as the system font for reliability and data density, or Plus Jakarta Sans if the brand leans toward a warmer, more distinctive personality. A two-font system (display + body) adds complexity without clear benefit for a mobile MVP -- stick to a single family.

---

## 4. Screen Inventory

The PRD specifies **20+ driver screens** and **15+ garage screens**. Below is a comprehensive inventory derived from all user stories, user flows, and functional requirements in the PRD.

### 4.1 Shared / Global Screens

| # | Screen | Notes |
|---|---|---|
| S-01 | Splash screen | App launch, brand moment |
| S-02 | Onboarding / Welcome (multi-step) | Role selection: "Je suis conducteur" / "Je suis garage" |
| S-03 | Sign-up / Account creation | Email, phone, password. Role-specific fields. |
| S-04 | Login | Email + password, biometric option |
| S-05 | Forgot password | Email reset flow |
| S-06 | Notifications center | Push notification history, read/unread states |
| S-07 | Settings / Preferences | Language, notifications, account management |
| S-08 | Profile edit | Shared structure, role-specific content |
| S-09 | Legal / CGU | Terms and conditions, privacy policy (French legal requirements) |
| S-10 | Error / offline state | Network error, server error, empty states |

### 4.2 Driver App Screens (Conducteur)

| # | Screen | User Story | Flow |
|---|---|---|---|
| D-01 | Home / Dashboard | -- | Hub: active sinistre status, quick actions |
| D-02 | Declare sinistre -- Step 1: Accident type | US01 | Type selection: collision, stationnement, bris de glace, etc. |
| D-03 | Declare sinistre -- Step 2: Photo capture | US01 | Guided camera overlay, multi-angle prompts |
| D-04 | Declare sinistre -- Step 3: Vehicle info | US01 | Make, model, plate, insurance. Pre-fillable fields. |
| D-05 | Declare sinistre -- Step 4: Location & details | US01 | Map pin, date/time, description field |
| D-06 | Declare sinistre -- Summary / Review | US01 | All info consolidated before submission |
| D-07 | Declaration confirmation | US01 | Success state, next steps explained |
| D-08 | Garage search -- Map view | US02 | Map with garage pins, user location, radius |
| D-09 | Garage search -- List view | US02 | Filterable/sortable list of garages with distance, availability |
| D-10 | Garage filters | US02 | Distance, availability, specialties, type of repair |
| D-11 | Garage detail / Profile card | US02 | Name, photos, specialties, ratings, zone, availability summary |
| D-12 | Booking -- Calendar view | US03 | Available slots from selected garage, week/day view |
| D-13 | Booking -- Time slot selection | US03 | Specific date + time confirmation |
| D-14 | Booking confirmation | US03, US09 | Recap: garage name, date, address, dossier number. Dossier transmitted. |
| D-15 | Repair tracking -- Status view | US04 | Status pipeline: en attente > pris en charge > en reparation > termine |
| D-16 | Repair tracking -- Detail / timeline | US04 | Timestamped status updates, garage contact info |
| D-17 | Dossier history / My sinistres | -- | List of past and active dossiers |
| D-18 | Dossier detail (archived) | -- | Read-only view of completed sinistre |
| D-19 | Vehicle profile | -- | My vehicle info, editable. Future: multi-vehicle. |
| D-20 | Garage contact / Messaging | US09 | Contact info or in-app messaging with assigned garage |
| D-21 | Rating / Review (post-repair) | -- | Post-repair feedback (MVP or V2) |
| D-22 | Push notification detail | US04 | Deep link from notification to relevant status/screen |

**Driver total: 22 screens** (excluding shared screens)

### 4.3 Garage Portal Screens (Carrossier)

| # | Screen | User Story | Flow |
|---|---|---|---|
| G-01 | Dashboard / Overview | -- | Hub: active dossiers count, today's schedule, pending requests |
| G-02 | Available sinistres -- List | US05 | Incoming dossiers in zone, filterable by type, distance, urgency |
| G-03 | Sinistre detail (pre-acceptance) | US05 | Full dossier view: photos, vehicle, location, driver info |
| G-04 | Accept / Refuse dossier | US05 | Confirmation modal or screen. Accept = dossier assigned. |
| G-05 | Active dossiers -- My dossiers | -- | List of all accepted/in-progress dossiers |
| G-06 | Dossier detail (active) | US07 | Full dossier with status update controls |
| G-07 | Status update | US07 | Change status: en attente > pris en charge > en reparation > termine |
| G-08 | Planning -- Week view | US06 | Calendar with booked slots, blocked slots, available slots |
| G-09 | Planning -- Day detail | US06 | Detailed view of a single day's appointments |
| G-10 | Manage availability | US06 | Add/remove/block time slots. Recurring availability settings. |
| G-11 | Garage profile -- View | US08 | Public profile preview (what drivers see) |
| G-12 | Garage profile -- Edit | US08 | Name, address, photos, specialties, zone, description |
| G-13 | Garage photos management | US08 | Upload, reorder, delete photos of the shop |
| G-14 | Zone de couverture / Service area | US08 | Map-based zone definition or radius setting |
| G-15 | Dossier history / Archive | -- | Completed dossiers, searchable |
| G-16 | Statistics / Activity summary | -- | Number of dossiers, completion rate, average time (simple MVP metrics) |
| G-17 | Client contact / Messaging | -- | Communication with assigned driver |

**Garage total: 17 screens** (excluding shared screens)

### 4.4 Landing Page (Marketing)

| # | Screen / Section | Reference |
|---|---|---|
| L-01 | Landing page -- Full page | US10, Section 5.0 |

Sections within: Hero, Problem, Solution, How it works (3 steps), Benefits garages, Garage sign-up form, Footer.

### 4.5 Total Screen Count Summary

| Category | Count |
|---|---|
| Shared / Global | 10 |
| Driver App | 22 |
| Garage Portal | 17 |
| Landing Page | 1 (multi-section) |
| **Total unique screens** | **50** |

With empty states, error states, loading states, and modals per DoD requirements (Section 8.2), the actual **deliverable count expands to approximately 80-100 artboards** in Figma.

---

## 5. Layout & Grid Considerations

### 5.1 Base Grid System

For a mobile-first app targeting iOS and Android:

| Property | Value | Rationale |
|---|---|---|
| **Base unit** | 4px | Industry standard. All spacing = multiples of 4. |
| **Column grid** | 4 columns | Standard for mobile (375px viewport). |
| **Gutter** | 16px | Comfortable for touch, not too sparse. |
| **Margin** | 16px (left + right) | = 32px total. Leaves 343px content area on 375px screen. |
| **Content width** | 343px | Effective content zone. |
| **Safe area** | iOS: 47px top, 34px bottom. Android: 24px top, varies bottom. | Must account for notch, home indicator, system bars. |

### 5.2 Screen Type Grid Patterns

Different screen types in Carlib require different layout strategies:

#### Forms (Declaration flow, profile edit, booking)

```
Pattern: Single-column stacked form
- Full-width input fields
- 16px vertical spacing between fields
- 24px spacing between field groups
- Sticky bottom CTA button (56px height)
- Step indicator at top (fixed)
- Keyboard-aware: content scrolls above keyboard
```

Key challenge: The 4-step declaration flow (D-02 to D-05) must feel short despite collecting substantial data. Strategy: progressive disclosure, pre-filled fields, smart defaults.

#### Maps (Garage search, zone de couverture)

```
Pattern: Map + bottom sheet
- Map fills full viewport
- Bottom sheet (draggable): collapsed (shows 2-3 items) / half / full
- Filter bar between map and sheet
- Current location FAB button
- Garage pins with minimal data tooltip on tap
```

Reference pattern: Google Maps, Uber, Doctolib. French users are familiar with this paradigm.

#### Lists (Sinistres, dossiers, garage results)

```
Pattern: Filterable scrolling list with cards
- Sticky top: screen title + filter/sort bar (48px)
- Card items: 80-120px height, full width
- Card anatomy: leading visual (status dot or photo), title, subtitle, trailing metadata
- Pull-to-refresh
- Infinite scroll or pagination (depending on data volume)
- Empty state illustration when list is empty
```

#### Calendar / Planning (Booking, availability management)

```
Pattern: Horizontal date selector + time slot grid
- Top: month/week navigation
- Horizontal scrolling date pills (today highlighted)
- Below: available time slots as tappable cards
- Color coding: available (green), booked (blue), blocked (gray)
- For garage: week view grid similar to Google Calendar
```

The garage planning screen (G-08) is the most complex layout in the app. It needs to display:
- 7 days horizontally
- Time slots vertically (09:00-18:00)
- Bookings as colored blocks with driver name
- Available slots as tappable empty blocks
- Blocked slots as hatched/grayed blocks

This requires a **custom calendar component** that works on mobile. Consider: horizontal scrolling week view with fixed time column.

#### Dashboards (Driver home, garage overview)

```
Pattern: Scrolling card stack
- Top: greeting + active status summary card (hero card)
- Below: quick action buttons (2-3, horizontal)
- Below: recent activity / upcoming items (list)
- Tab bar at bottom for navigation
```

### 5.3 Navigation Structure

| App | Pattern | Tabs |
|---|---|---|
| **Driver** | Bottom tab bar (4 tabs) | Home, Declarer, Suivi, Profil |
| **Garage** | Bottom tab bar (4-5 tabs) | Dashboard, Sinistres, Planning, Dossiers, Profil |

Bottom tab bar height: 56px + safe area. Icons with labels. Active state = filled icon + color, inactive = outline + gray.

### 5.4 Responsive Considerations

The PRD says "mobile-first." Question #3 (open) asks whether the garage portal should also work on web/tablet. Planning considerations:

| Viewport | Driver App | Garage Portal |
|---|---|---|
| **Mobile (375-428px)** | Primary. Single column. | Primary for field work. |
| **Tablet (768-1024px)** | Nice-to-have. Same layout, wider cards. | **Likely needed** for workshop use. Side-by-side layouts. |
| **Desktop (1024px+)** | Not planned. | Possible V2. Multi-panel layout. |

**Recommendation:** Design the garage portal components so they can reflow into a 2-column layout at tablet breakpoint. Use a 12-column grid at tablet size, collapsing to 4 columns on mobile.

---

## 6. Visual Hierarchy Challenges

### Ranked by Complexity

#### Tier 1 -- High Hierarchy Complexity

**1. Garage Planning -- Week View (G-08)**

The single most complex screen. Must display:
- Temporal data on two axes (days x hours)
- Three slot states (available, booked, blocked)
- Booked slots must show driver name + vehicle info
- Must be scannable at a glance
- Must support touch interaction (tap to view/edit)
- Must work on a 375px-wide screen

Hierarchy challenge: How to make today's column prominent, booked slots scannable, and available slots inviting -- all in a dense grid. Color becomes the primary differentiator.

**2. Sinistre Declaration -- Photo Capture (D-03)**

A camera overlay UI that must:
- Guide the user to photograph specific angles (front, rear, sides, damage close-up)
- Show which photos are taken and which remain
- Display guidance text without obscuring the viewfinder
- Work in various lighting conditions (daytime, nighttime, rain)
- Handle both landscape damage (wide shots) and detail damage (close-ups)

Hierarchy challenge: Balancing instruction text, camera viewfinder, progress indicators, and action buttons in a single screen. Must be operable under stress with potentially shaking hands.

**3. Garage Dashboard (G-01)**

A summary screen that must surface:
- Number of new sinistres waiting for response
- Today's schedule (upcoming appointments)
- Active dossiers requiring status updates
- Overall activity metrics

Hierarchy challenge: Multiple competing data types. What gets the user's attention first? Likely: "new incoming dossiers" (revenue) then "today's schedule" (operations).

#### Tier 2 -- Medium Hierarchy Complexity

**4. Garage Search -- Map + List (D-08, D-09)**

Dual-view screen (map or list, with toggle). The map view has a bottom sheet with garage previews. Each garage preview must show: name, distance, availability, specialty, and a CTA -- all in ~80px card height.

**5. Repair Tracking -- Status Pipeline (D-15)**

A status visualization that must:
- Show 4 stages clearly (en attente / pris en charge / en reparation / termine)
- Indicate current stage prominently
- Show estimated timing (if available)
- Provide context for what each stage means

**6. Dossier Detail (G-03, G-06)**

A dense information screen combining: driver info, vehicle details, accident photos (gallery), location map, status controls, and communication actions. Must be scannable without scrolling endlessly.

#### Tier 3 -- Standard Hierarchy

**7. Declaration flow steps (D-02, D-04, D-05)** -- Standard form hierarchy with step indicators.

**8. Booking calendar (D-12)** -- Standard date/time picker with availability overlay.

**9. Profile screens (D-19, G-11, G-12)** -- Standard profile card + edit form.

### General Hierarchy Principles for Carlib

| Principle | Application |
|---|---|
| **One primary action per screen** | PRD says "maximum 3 actions par ecran." Hierarchy must make the primary action unmistakable. |
| **Status is always visible** | Repair status, dossier status, booking status -- these should be the first thing the eye lands on via color + position. |
| **Progress is always visible** | Step indicators in the declaration flow. The user must never wonder "how much more?" |
| **Stress-tolerant tap targets** | Minimum 48x48px touch targets. In the post-accident flow, consider 56px minimum. Generous spacing. |

---

## 7. Landing Page Visual Requirements

### Purpose (from PRD)

The landing page is a B2B sales tool targeting **garage owners**. Its goal: "comprendre la valeur de la plateforme en 30 secondes et exprimer mon interet" (US10). It is NOT a consumer-facing page (at MVP stage). The primary audience is Mohamed D., 45, garage owner, visiting on mobile or desktop after a sales call or email.

### Content Structure (PRD Section 5.0)

| Section | Content | Visual Need |
|---|---|---|
| **Hero** | "Promesse simple, visuel prototype, CTA 'Je suis un garage interesse'" | App mockup in device frame. Bold headline. Single visible CTA above fold. |
| **Problem** | "Complexite sinistre, dependance assurance, perte de temps garages" | 3 pain points. Icons or illustrations. Short text. Emotional resonance with garage owner frustrations. |
| **Solution** | "Declaration mobile, mise en relation, planning simplifie" | Mirror the 3 pain points with 3 solutions. Before/after framing. |
| **How it Works** | "3 etapes illustrees" | Step 1-2-3 layout. Numbers or icons. App screenshots showing each step. |
| **Benefits Garages** | Garage-specific value propositions | Bullet points or cards. Concrete metrics if available ("recevez des dossiers qualifies"). |
| **Form** | "Formulaire de recueil des premiers partenaires" | Simple form: garage name, contact name, phone, email, city. Minimal fields. Trust signals nearby. |
| **Footer** | Legal, contact, social | Standard footer. Mentions legales (required by French law). |

### Visual Design Considerations

**1. Device mockups in hero:** Show the app running on a phone. This is the primary "credibility builder" for the commercial meetings. The mockup must look polished -- it represents the product vision.

**2. Above-the-fold priority:** The CTA "Je suis un garage interesse" must be visible without scrolling on both mobile and desktop. The PRD DoD (Section 8.2) explicitly states: "CTA visible au-dessus de la ligne de flottaison."

**3. Desktop-first exception:** Unlike the app, the landing page may be primarily viewed on desktop (garage owners at their desk, checking email, clicking a link from a sales deck). Design desktop layout first, adapt to mobile.

**4. French legal requirements:** RGPD compliance notice on the form. Mentions legales link. Cookie consent banner (if analytics are used).

**5. Trust signals:** The page must establish credibility for what is essentially a new, unproven platform. Consider:
- "Developpe par Digital Unicorn" (agency credibility)
- Security/privacy messaging
- Number of garages already interested (social proof, when available)
- Professional photography or illustrations (not stock photos of generic handshakes)

**6. Page length:** Aim for 5-7 viewport-heights total on desktop. Not a micro-site, not a novel. Each section should be one viewport or less.

### Landing Page Grid

| Viewport | Grid | Content Width |
|---|---|---|
| Desktop (1440px) | 12 columns, 1200px max-width, 24px gutters | Centered content |
| Tablet (768px) | 8 columns | Full-width with 32px margins |
| Mobile (375px) | 4 columns | Full-width with 16px margins |

---

## 8. Recommendations -- Decisions Needed Before Phase 2 (UI)

The following decisions are **blockers or near-blockers** for high-fidelity design. They should be resolved during Phase 0 (kickstart) or early Phase 1 (UX).

### Critical Decisions (Block Phase 2 Start)

| # | Decision | Owner | Details |
|---|---|---|---|
| **R-01** | **Logo and wordmark** | Client | Is there an existing logo? If not, is logo design in scope for Digital Unicorn? A wordmark is acceptable for MVP. The name "Carlib" has good typographic potential (short, balanced). |
| **R-02** | **Primary brand color** | Client + UI | Blue direction? Green direction? The Emergent maquettes may suggest a direction -- these must be shared and discussed at kickoff. |
| **R-03** | **Typeface selection** | UI Designer | Should be decided in the first days of Phase 2. Requires testing with French text, especially long insurance/legal strings. |
| **R-04** | **Garage portal platform** (Q#3 from PRD) | Client + PM | Mobile-only or also tablet/web? This fundamentally changes the layout system and the number of deliverables. If tablet is needed, add ~30% to the garage screen count. |

### High-Priority Decisions (Needed During Phase 2)

| # | Decision | Owner | Details |
|---|---|---|---|
| **R-05** | **Iconography system** | UI Designer | Custom icons? Open-source set (Lucide, Phosphor)? The app needs ~40-60 unique icons (navigation, status, vehicle parts, accident types, garage amenities). |
| **R-06** | **Illustration style** | UI Designer | Empty states, onboarding, error screens, landing page -- all need illustrations. Flat? Isometric? Hand-drawn? Line art? This sets a tone. |
| **R-07** | **Photo handling direction** | UI + UX | The photo capture flow (D-03) is the most visually distinctive screen. Camera overlay design, photo grid display in dossiers, thumbnail cropping -- all need definition. |
| **R-08** | **Status color mapping** | UI Designer | The 4 repair statuses (en attente, pris en charge, en reparation, termine) each need a distinct, accessible color. These colors cascade through the entire app (badges, timeline, notifications). Propose: gray, blue, amber, green. |
| **R-09** | **Map visual style** | UI Designer | Mapbox vs Google Maps vs Apple Maps? Custom map styling to match brand colors? Pin/marker design for garages? |
| **R-10** | **Dark mode strategy** | UI + PM | Not in MVP scope but token architecture should support it from day one. Confirm: plan for it or explicitly exclude? |

### Design System Scope Decisions

| # | Decision | Details |
|---|---|---|
| **R-11** | **Component library depth** | The PRD says "design system simple et scalable." Define what "simple" means: just tokens and base components (buttons, inputs, cards, badges)? Or also complex components (calendar, map bottom sheet, photo capture overlay)? |
| **R-12** | **Figma structure** | One Figma file or multiple? Suggested: 1 Design System file + 1 Driver App file + 1 Garage Portal file + 1 Landing Page file. |
| **R-13** | **Handoff format** | The brief mentions "brief developpement." Should the design system be annotated for a specific tech stack (React Native? Flutter? Native iOS/Android?) or platform-agnostic? |

### Summary: Phase 2 Pre-Requisites Checklist

Before high-fidelity UI design begins, confirm the following are resolved:

- [ ] Emergent maquettes from client reviewed and discussed
- [ ] Logo / wordmark confirmed or interim direction agreed
- [ ] Brand color palette direction approved (2-3 options presented)
- [ ] Typeface selected and tested with French content
- [ ] Garage portal platform decision (mobile only vs. tablet/web)
- [ ] Attribution logic confirmed (auto-assign vs. driver selection) -- affects marketplace UI
- [ ] Design system scope defined ("simple et scalable" = what exactly?)
- [ ] Illustration / iconography direction decided
- [ ] Figma file structure set up with proper naming conventions

---

## Appendix A: Competitive Visual Landscape

For context, these are adjacent apps in the French market that Carlib's audience already uses:

| App | Category | Visual Character | Relevance |
|---|---|---|---|
| **Doctolib** | Healthcare marketplace | Blue trust palette, clean white UI, bottom sheet maps, calendar booking. | Closest UX paradigm to Carlib (search > profile > book). French users know this pattern. |
| **MesDepanneurs** | Home repair marketplace | Utilitarian, dated UI. Opportunity for Carlib to differentiate. | Direct competitor pattern (marketplace for trades). |
| **Mon Garage** | Garage finder | Basic directory. No marketplace features. | Low visual bar -- easy to surpass. |
| **Constat Amiable (official)** | Accident declaration | Functional but bureaucratic. Government app feel. | Users expect this process to be painful. Carlib can surprise. |
| **Waze / Google Maps** | Maps | Users expect responsive map experiences with smooth interactions. | Map interaction benchmarks. |
| **AXA / Allianz apps** | Insurance | Corporate blue, conservative, trust-oriented. | Color and tone benchmarks for the insurance-adjacent space. |

**Key insight:** There is no well-designed, modern reference in the French accident/repair space. Carlib has an opportunity to set the standard, but must balance innovation with familiarity. The Doctolib pattern (marketplace with booking) is the closest proven model that French mobile users trust.

---

## Appendix B: Accessibility Baseline

The PRD DoD (Section 8.2) states: "Accessibilite verifiee." The following accessibility considerations should be embedded in the visual system from the start:

| Requirement | WCAG Level | Impact on Visual Design |
|---|---|---|
| **Color contrast** 4.5:1 for text, 3:1 for large text and UI components | AA | All color combinations must be tested. Semantic colors (status badges) need dark-on-light or light-on-dark pairings. |
| **Color is not the only indicator** | AA | Status states must use color + icon or color + text. Never color alone. |
| **Touch target size** 44x44px minimum (iOS) / 48x48dp (Android) | -- | Affects button sizing, list item tap areas, map pin sizes. |
| **Text resizing** up to 200% without loss of content | AA | Layout must accommodate dynamic type / font scaling. |
| **Focus indicators** for keyboard/assistive navigation | AA | Design visible focus rings for all interactive elements. |
| **Motion** respect reduced-motion preferences | AAA (recommended) | Animations should be enhancing, not essential. Provide alternatives. |

**Post-accident-specific accessibility note:** A stressed user may have reduced cognitive capacity, impaired fine motor control (shaking hands), or be in a low-light environment. The visual design should:
- Use large, high-contrast action buttons
- Minimize required precision (no small toggles, no drag-and-drop in the declaration flow)
- Provide clear visual feedback for every action (button press states, loading indicators, success confirmations)

---

*This analysis is based on PRD Carlib v0.1 (Draft, March 2026). All recommendations are subject to revision after the kickoff ateliers and review of the client's Emergent maquettes.*
