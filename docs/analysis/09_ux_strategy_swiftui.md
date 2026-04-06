# Carlib -- UX Strategy for Native SwiftUI Implementation

**Document:** Comprehensive UX Strategy Analysis -- SwiftUI / iOS 26  
**Date:** 2026-04-06  
**Source:** PRD Carlib v0.1 (Digital Unicorn, March 2026) + 8 prior analysis documents  
**Author:** UX Strategist Agent  
**Platform:** iOS 26, Xcode 26, iPhone only, Portrait only, Swift, zero external dependencies, French only

---

## Table of Contents

1. [Product Identity Resolution](#1-product-identity-resolution)
2. [Information Architecture](#2-information-architecture)
3. [Navigation Strategy for SwiftUI](#3-navigation-strategy-for-swiftui)
4. [Attribution Model Recommendation](#4-attribution-model-recommendation)
5. [MVP Scope Tightening](#5-mvp-scope-tightening)
6. [Onboarding & Auth Strategy](#6-onboarding--auth-strategy)
7. [Notification & Real-Time Strategy](#7-notification--real-time-strategy)
8. [Offline & Error Strategy](#8-offline--error-strategy)
9. [Key UX Metrics](#9-key-ux-metrics)
10. [Open Question Impact Analysis](#10-open-question-impact-analysis)

---

## 1. Product Identity Resolution

### The Core Tension

The PRD describes Carlib simultaneously as "une application de declaration de sinistre automobile" (a claim declaration tool) and "une plateforme de mise en relation entre assures et carrossiers" (a driver-to-garage marketplace). These are fundamentally different products with different competitive landscapes, user expectations, and technical architectures.

### Recommendation: Carlib Is a Marketplace With a Declaration On-Ramp

Carlib should be positioned as a **driver-to-garage marketplace** where claim declaration serves as the **entry point to the marketplace funnel**, not as the product itself. The declaration flow is the mechanism that generates demand (qualified leads for garages), but the core value proposition is the matching, booking, and tracking experience.

**Rationale:**

| Dimension | Declaration Tool | Marketplace (Recommended) |
|---|---|---|
| Competitive moat | Workflow efficiency (easily replicated) | Network density (defensible) |
| Revenue potential | Per-use fee (low frequency, low LTV) | Commission + subscription (recurring) |
| User retention | Near-zero (one accident every 5-10 years) | Moderate (vehicle ecosystem, referrals) |
| Insurance dependency | Critical (declaration has legal meaning) | Moderate (can work outside insurer flow) |
| Growth engine | Marketing-driven (acquire users before accident) | Supply-driven (garages attract drivers) |

### SwiftUI Navigation Architecture Impact

This identity decision directly shapes the app's navigation hierarchy:

- **If declaration tool:** The app centers on a single linear flow (declare > submit > done). A simple `NavigationStack` with no tab bar. The app is essentially a wizard.
- **If marketplace (recommended):** The app needs a persistent `TabView` with multiple entry points -- home/dashboard, garage discovery, active claims, and profile. The declaration is a modal flow (`fullScreenCover`) launched from the home tab, not the app's root.

**The marketplace identity means the `TabView` is the root of the navigation, not a `NavigationStack`.** This is the single most consequential architectural decision for the SwiftUI implementation.

### Naming Implication

The term "declaration de sinistre" carries legal weight in French insurance law. If Carlib uses this phrase, users may believe it satisfies their legal obligation to declare to their insurer (5-day deadline under the Code des Assurances). **Recommendation:** Use "signalement" or "demande de prise en charge" instead of "declaration" throughout the app. This avoids legal ambiguity and reinforces Carlib's marketplace positioning rather than a quasi-official insurance function.

---

## 2. Information Architecture

### 2.1 Role-Based Routing in a Single SwiftUI App

Carlib serves two distinct personas (driver and garage owner) within a single iOS app. The recommended approach is **role-based routing at the app root**, where the `@Observable` user session model determines which `TabView` configuration is presented.

```
App Launch
    |
    v
AuthGate (checks for stored session)
    |
    +--> No session --> OnboardingFlow (role selection + auth)
    |
    +--> Session exists --> RoleRouter
                              |
                              +--> role == .driver  --> DriverTabView
                              |
                              +--> role == .garage  --> GarageTabView
```

This is a **single app binary** with two distinct tab structures. There is no need for separate targets or apps. The `@Observable` pattern in iOS 26 makes role-dependent UI reactivity straightforward without external state management libraries.

### 2.2 Driver Tab Structure (4 Tabs)

```
DriverTabView
|
|-- [Tab 1] Accueil (Home)
|   |-- Active claim summary card (if exists)
|   |-- Primary CTA: "Signaler un sinistre" --> fullScreenCover
|   |-- Recent activity feed
|   |-- Quick access: upcoming booking
|
|-- [Tab 2] Mes Dossiers (My Claims)
|   |-- NavigationStack
|       |-- List: active + past claims
|       |-- Detail: claim summary, garage info, status timeline
|       |   |-- Photos gallery
|       |   |-- Garage contact (phone deep link)
|       |   |-- Cancel/modify actions
|
|-- [Tab 3] Garages
|   |-- NavigationStack
|       |-- Map + List (toggle or bottom sheet)
|       |-- Filters (sheet)
|       |-- Garage detail
|       |   |-- Photos, specialties, availability
|       |   |-- Ratings (future)
|       |   |-- "Choisir ce garage" CTA (context-dependent)
|
|-- [Tab 4] Profil
|   |-- NavigationStack
|       |-- Personal info
|       |-- Vehicle info (immatriculation, marque, modele)
|       |-- Insurance info (optional: nom assureur, numero contrat)
|       |-- Notification preferences
|       |-- Aide / FAQ
|       |-- Legal (CGU, politique de confidentialite)
|       |-- Deconnexion
|       |-- Supprimer mon compte (RGPD Art. 17)

--- MODAL FLOW (not a tab) ---

Declaration Flow (fullScreenCover from Home tab)
|
|-- Step 1: Type de sinistre (selection grid)
|-- Step 2: Photos (guided camera capture)
|-- Step 3: Informations vehicule + accident
|-- Step 4: Localisation (map + address)
|-- Recap + Submit
|-- Success --> transition to Garage Selection (within flow or tab switch)
```

**Why 4 tabs, not 3:** The Garages tab exists independently from the declaration flow because drivers may want to browse garages before having an accident (pre-selection, bookmarking). This supports the marketplace mental model -- garages are discoverable, not just assigned. If analytics later show this tab gets negligible standalone traffic, it can be absorbed into the home tab.

### 2.3 Garage Tab Structure (4 Tabs)

```
GarageTabView
|
|-- [Tab 1] Tableau de bord (Dashboard)
|   |-- KPIs: dossiers en cours, a venir, termines ce mois
|   |-- Today's appointments
|   |-- Unread notifications badge
|   |-- New available claims alert
|
|-- [Tab 2] Dossiers (Claims)
|   |-- NavigationStack
|       |-- Segmented control: Disponibles | En cours | Termines
|       |-- Available claims list (filterable by proximity, type)
|       |   |-- Claim detail (photos, vehicle info, location map)
|       |   |-- Accept / Decline actions
|       |-- Active claims list
|       |   |-- Claim detail with status stepper
|       |   |-- Status update action
|       |-- Completed claims archive
|
|-- [Tab 3] Planning
|   |-- NavigationStack
|       |-- Week view calendar (default)
|       |-- Month overview toggle
|       |-- Slot creation (tap empty cell --> sheet)
|       |-- Slot blocking (long-press)
|       |-- Booked slots with driver info
|       |-- Sync indicator
|
|-- [Tab 4] Mon Garage (Profile)
|   |-- NavigationStack
|       |-- Garage information (nom, adresse, SIRET)
|       |-- Photo gallery (atelier photos)
|       |-- Specialties / repair types
|       |-- Zone d'intervention (radius on map)
|       |-- Horaires d'ouverture
|       |-- Ratings received (read-only)
|       |-- Notification preferences
|       |-- Subscription / account
|       |-- Aide / FAQ
|       |-- Deconnexion
```

### 2.4 NavigationStack vs. NavigationSplitView Decision

**Use `NavigationStack` throughout. Do not use `NavigationSplitView`.**

Rationale:
- The app is **iPhone only, Portrait only**. `NavigationSplitView` is designed for iPad/Mac or landscape layouts where a sidebar-detail pattern makes sense. On iPhone Portrait, `NavigationSplitView` collapses to a stack anyway, adding complexity with zero benefit.
- Every tab contains a linear drill-down hierarchy (list > detail > sub-detail), which is exactly what `NavigationStack` with `NavigationPath` is designed for.
- `NavigationStack` supports type-safe navigation with `navigationDestination(for:)`, making deep linking from push notifications straightforward.

### 2.5 Landing Page (US10)

The landing page (page vitrine for garage acquisition) is **not part of the native app**. It is a web page. However, if the team decides to embed a landing-style onboarding experience within the app itself (for first-launch), it should be a **non-interactive, ScrollView-based view** presented as part of the onboarding flow, not a tab.

---

## 3. Navigation Strategy for SwiftUI

### 3.1 Navigation Pattern Map

Each user story is mapped to a specific SwiftUI navigation pattern.

| User Story | Persona | Navigation Pattern | SwiftUI Implementation | Rationale |
|---|---|---|---|---|
| **US01** Declaration | Driver | Modal linear flow | `fullScreenCover` containing a `NavigationStack` with 4-step progression | The declaration is a focused, interruptible task. `fullScreenCover` prevents accidental tab switches during a stress-context flow. A `NavigationStack` inside the cover enables back-navigation between steps. |
| **US02** Garage list + map | Driver | Tab content with drill-down | `NavigationStack` inside Garages tab; Map view uses `Map` (MapKit SwiftUI); bottom sheet via `.sheet` or custom `DraggableSheet` | Map + list is a common pattern in iOS. The bottom sheet (draggable) allows map to stay visible while browsing the list. |
| **US03** Booking | Driver | Sheet or push within flow | `.sheet` presented from garage detail containing calendar slot picker; confirmation via `NavigationStack` push | Booking is a sub-task of garage selection. A sheet keeps the user oriented within the garage context. |
| **US04** Repair tracking | Driver | Tab content (Mes Dossiers) | `NavigationStack` with status timeline view as a pushed detail | This is a persistent, repeatedly-accessed view. It belongs in the tab hierarchy, not a modal. Pull-to-refresh via `.refreshable` modifier. |
| **US05** Garage claim list | Garage | Tab content with segmented control | `NavigationStack` inside Dossiers tab; `Picker` with `.segmented` style for Available/En cours/Termines | Claim list is the garage's primary workspace. Segmented control provides instant switching between claim states without navigation. |
| **US06** Garage planning | Garage | Tab content | `NavigationStack` inside Planning tab; custom calendar grid view | The planning view is a persistent tool, not a one-time flow. Tab placement ensures it is always one tap away. |
| **US07** Status updates | Garage | In-place action within detail | Status stepper component within claim detail view; confirmation via `.alert` or `.confirmationDialog` | Status update is a quick action, not a navigation event. It should happen in-place with a confirmation dialog to prevent accidental changes. |
| **US08** Garage profile | Garage | Tab content with edit mode | `NavigationStack` inside Mon Garage tab; `EditButton` or custom edit toggle; photo upload via `PhotosPicker` | Profile management is a settings-like experience -- pushed views within a tab stack. |
| **US09** Auto-transmission | Driver/System | Background action with feedback | No dedicated screen; status card in Mes Dossiers updates to show "Dossier transmis"; push notification confirms | Auto-transmission is a system event, not a user-facing flow. The UI reflects its outcome, not its process. |
| **US10** Landing page | Visitor | Web page (external) or onboarding carousel | If in-app: `TabView` with `.tabViewStyle(.page)` for carousel; `Form` for garage interest submission | This is not part of the core app navigation. It is either a web page or a first-launch onboarding experience. |

### 3.2 iOS 26 Navigation Patterns -- When to Use What

| Pattern | When to Use in Carlib | When NOT to Use |
|---|---|---|
| **TabView** | App root for both roles (DriverTabView, GarageTabView). Each tab contains its own NavigationStack. | Do not nest TabViews inside sheets or other TabViews. |
| **NavigationStack** | Inside every tab. For all drill-down sequences (list > detail > sub-detail). For the declaration flow inside the fullScreenCover. | Do not use a single global NavigationStack wrapping the TabView -- each tab manages its own stack independently. |
| **NavigationPath** | For programmatic navigation within a tab (e.g., deep linking from a push notification to a specific claim detail). | Not needed for simple push/pop -- use `NavigationLink(value:)` with `navigationDestination(for:)` for type-safe routing. |
| **.sheet** | Filters (garage filters, claim filters). Booking calendar. Slot creation (garage planning). Settings sub-pages. | Do not use for the declaration flow -- it is too easily dismissed via swipe-down. Use fullScreenCover instead. |
| **.fullScreenCover** | Declaration flow (4-step wizard). Onboarding/auth flow (before the user reaches the TabView). Photo capture (camera interface). | Do not use for simple detail views or settings -- it removes the parent context entirely. |
| **.confirmationDialog** | Status change confirmation (garage). Booking cancellation (driver). Destructive actions (delete account, delete claim). | Do not use for informational content -- use .alert instead. |
| **.alert** | Error messages. Network failure notifications. Successful submission confirmations (brief). | Do not use for complex interactions (forms, pickers). |
| **.inspector** (iOS 17+) | Not applicable. Inspector is for iPadOS/macOS side panel. Carlib is iPhone Portrait only. | Do not use anywhere. |
| **.popover** | Not recommended for iPhone. Popovers become sheets on compact size class. Use `.sheet` directly for clarity. | Avoid on iPhone -- behavior differs from user expectation. |

### 3.3 Deep Linking Architecture

Push notifications must deep link to specific screens. This requires a centralized navigation coordinator.

**Pattern: `NavigationPath`-based deep linking per tab**

Each tab's `NavigationStack` holds a `@State` (or `@Bindable`) `NavigationPath`. When a push notification arrives:

1. The `AppDelegate` or `UNUserNotificationCenterDelegate` receives the notification payload.
2. A shared `DeepLinkRouter` (an `@Observable` class injected into the environment) parses the payload into a `DeepLink` enum value.
3. The `RoleRouter` switches to the correct tab (e.g., Mes Dossiers for a status update notification).
4. The tab's `NavigationStack` appends the correct destination value to its `NavigationPath`.

Deep link targets:

| Notification Type | Target Tab | Target View |
|---|---|---|
| Claim accepted by garage | Driver > Mes Dossiers | ClaimDetailView(claimId) |
| Status changed | Driver > Mes Dossiers | ClaimDetailView(claimId) with status timeline visible |
| Booking confirmed | Driver > Mes Dossiers | BookingRecapView(bookingId) |
| Booking reminder | Driver > Mes Dossiers | BookingRecapView(bookingId) |
| New claim in zone | Garage > Dossiers | ClaimDetailView(claimId) in Available segment |
| New booking received | Garage > Planning | PlanningView focused on booking date |

### 3.4 State Restoration

iOS 26 supports `@SceneStorage` for state restoration. Each tab should persist:
- Its `NavigationPath` (serialized)
- The active segmented control selection (garage Dossiers tab)
- Scroll position (via `ScrollPosition`)
- Any in-progress form data (declaration draft saved to SwiftData)

This ensures that if the user switches apps (common during a stressful post-accident scenario -- calling insurance, checking messages) and iOS terminates the app, they return to exactly where they left off.

---

## 4. Attribution Model Recommendation

### The Two Models

**Model A -- Driver Selects Garage:** The driver browses available garages, compares them, and actively chooses one. This is the Doctolib/Airbnb pattern.

**Model B -- Auto-First-Accept:** The driver submits a claim, all garages in the coverage zone are notified, and the first garage to accept "wins" the dossier. This is the Uber/dispatch pattern.

### Recommendation: Driver-Selects (Model A) for MVP

**Model A (driver selection) is recommended for the MVP.** Here is the detailed rationale:

#### UX Research Principles Supporting Driver Selection

1. **Perceived control reduces anxiety.** Carlib's primary user is a stressed post-accident driver. Research on decision-making under stress (Kahneman, Klein) shows that giving users a sense of agency -- even if constrained -- significantly reduces anxiety. Presenting 3-5 garages and letting the driver choose gives them a feeling of control in a situation where they feel powerless.

2. **Trust requires comparison signals.** A marketplace where users cannot compare providers fails the basic trust threshold. Drivers need to see garage photos, specialties, distance, and (eventually) ratings to trust the platform. Auto-attribution removes the comparison step, which means the driver must trust Carlib's algorithm blindly -- an unrealistic ask for a new, unknown app.

3. **Cold-start friendliness.** In the early marketplace with few garages, auto-attribution could assign a driver to the only garage in range -- with no alternative. If the driver dislikes that garage's profile, they have no recourse. Driver selection lets the user make an informed choice even when options are limited.

4. **Garage motivation.** When garages know drivers are comparing them, they are motivated to maintain complete profiles, upload quality photos, and provide good service (for future ratings). Auto-attribution removes this incentive.

5. **Simpler implementation.** Auto-first-accept requires real-time race condition handling (multiple garages accepting simultaneously), conflict resolution, and complex notification choreography. Driver selection is a simpler request-response pattern.

#### SwiftUI UX Implications of Each Model

| Dimension | Driver Selects (Recommended) | Auto-First-Accept |
|---|---|---|
| **Garage list screen** | Required. Rich garage cards with photos, distance, specialties, availability indicator. Implemented as `NavigationStack` push from map/list. | Not needed. Replaced by a waiting screen ("Recherche d'un garage en cours..."). |
| **Garage detail screen** | Required. Full profile with photo gallery, specialties, zone map, ratings placeholder. | Minimal. Only shown after attribution to confirm the assigned garage. |
| **Map interaction** | Interactive. Pins for each garage, tap to preview, tap preview to see detail. Custom `Map` with `Annotation` views. | Minimal. Map only shows the assigned garage after attribution. |
| **Booking flow** | Driver picks a time slot from the selected garage's calendar. Sheet-based picker. | Garage proposes a time, driver confirms. Push notification-driven. |
| **Declaration flow ending** | Declaration submits, then transitions to garage selection (within the same fullScreenCover flow or tab switch). | Declaration submits, then shows a waiting animation while the system finds a garage. |
| **Real-time requirements** | Low. Garage availability is fetched on-demand when the driver views the list. | High. Must handle real-time race conditions: multiple garages accepting simultaneously, locking, rollback. |
| **Push notification complexity** | Moderate. Notify driver when garage confirms booking. | High. Notify all garages of new claim, handle accept/reject responses, notify driver of outcome, handle timeouts. |

#### Future Path to Hybrid Model

For V2, consider a hybrid: the driver can either select a garage manually or tap "Carlib recommande" to auto-assign based on proximity, availability, and rating. This gives experienced users a shortcut without removing the comparison option. In SwiftUI, this is simply an additional CTA on the garage list screen that triggers the auto-assignment logic and navigates directly to the booking confirmation.

---

## 5. MVP Scope Tightening

### 5.1 Current PRD Scope Assessment

The PRD marks 14 of 19 deliverables as Must-Have. This is not prioritization -- it is a wish list. A realistic MVP for a single SwiftUI app serving both roles must be ruthlessly scoped.

### 5.2 Recommended MVP Scope

#### Tier 1 -- Must Ship (Core Loop)

These features constitute the minimum viable marketplace loop: a driver can declare, find a garage, book, and track. A garage can see claims, accept, manage planning, and update status.

| Feature | User Stories | Screens (Driver) | Screens (Garage) |
|---|---|---|---|
| Auth + role selection | New (not in PRD) | 3 (welcome, sign in, role select) | Shared |
| Driver declaration (4-step) | US01 | 6 (type, photos, info, location, recap, success) | -- |
| Garage list + map | US02 | 3 (map/list, filters sheet, garage detail) | -- |
| Booking | US03 | 2 (calendar picker, confirmation) | -- |
| Repair tracking | US04 | 2 (claim detail, status timeline) | -- |
| Claim consultation | US05 | -- | 3 (available list, claim detail, accept/decline) |
| Planning | US06 | -- | 2 (week view, slot creation sheet) |
| Status updates | US07 | -- | 1 (status stepper within claim detail) |
| Garage profile | US08 | -- | 3 (profile view, edit, photo management) |
| Auto-transmission | US09 | 0 (background) | 0 (background) |
| Home / dashboard | Implied | 1 | 1 |
| Profile / settings | Implied | 1 | 1 |
| **Total** | | **18** | **11** |

**Total unique screens: approximately 29** (some shared: auth, settings patterns). This is below the PRD's "20+ driver, 15+ garage" targets and is achievable.

#### Tier 2 -- Should Ship (Defer if Timeline Pressured)

| Feature | Rationale for Deferral |
|---|---|
| Rating/review system | Requires critical mass of completed repairs to be useful. Design the UI placeholder but defer implementation. |
| Notification preferences granularity | Ship with sensible defaults; allow toggling all notifications on/off. Granular control per notification type can come in V1.1. |
| Month view for garage planning | Week view is sufficient for MVP. Month view is a convenience feature. |
| Vehicle history (multi-vehicle support) | First MVP assumes one vehicle per driver. Add vehicle management later. |
| Driver-to-garage messaging | Show garage phone number with tap-to-call. In-app messaging is a large engineering scope for marginal MVP value. |

#### Tier 3 -- Won't Ship in MVP

| Feature | Rationale |
|---|---|
| Insurance integration (API or in-app) | Confirmed out of scope by PRD. Avoid even optional insurance fields in MVP to prevent legal ambiguity. |
| Landing page (web) | This is a web deliverable, not a native app feature. Build separately. |
| Design system formalization | Design patterns will emerge from building the app. Formalize them post-MVP. |
| Garage analytics dashboard | Garages need claims and bookings before analytics are useful. |
| Constat amiable digitization | Legally complex. Carlib should not touch the official accident report process. |
| Multi-language support | French only per PRD. Do not invest in i18n infrastructure yet, but use `String(localized:)` from day one to make future localization possible. |

### 5.3 Screen Count Comparison

| Source | Driver Screens | Garage Screens | Total |
|---|---|---|---|
| PRD target | 20+ | 15+ | 35+ |
| This recommendation | 18 | 11 | 29 |
| Reduction | ~10% | ~27% | ~17% |

The reduction comes primarily from deferring month view, analytics, messaging, and granular settings. Every screen in the MVP serves the core marketplace loop.

---

## 6. Onboarding & Auth Strategy

### 6.1 The Onboarding Dilemma

Carlib faces a classic marketplace onboarding tension: **should the user create an account before seeing value, or after?**

For a post-accident context, the answer is nuanced. A driver who just had an accident will not tolerate a lengthy sign-up flow before getting help. A garage owner signing up proactively has more patience.

### 6.2 Recommended Flow: Value-First, Auth-at-Commitment

```
Driver Flow:
App Launch --> 3-screen value carousel (skippable) --> Role Selection
    |
    v
"Signaler un sinistre" (accessible WITHOUT auth)
    |
    v
Complete declaration steps 1-4 (data stored locally in SwiftData)
    |
    v
Step 5: "Pour envoyer votre dossier, creez un compte" --> Auth Gate
    |
    v
Sign in with Apple / Phone number OTP --> Account created
    |
    v
Declaration submitted --> Garage selection flow
```

```
Garage Flow:
App Launch --> 3-screen value carousel --> Role Selection
    |
    v
Auth Gate FIRST (garage registration requires verification)
    |
    v
Sign in with Apple / Phone number OTP --> Account created
    |
    v
Profile completion wizard (nom, adresse, SIRET, specialites, photos)
    |
    v
Profile approved (or pending verification) --> Dashboard
```

**Key difference:** Drivers see value (complete declaration) before being asked to authenticate. Garages authenticate first because their registration involves business verification (SIRET).

### 6.3 Auth Strategy: No External Dependencies

The project constraint is **zero external packages**. This rules out Firebase Auth, Auth0, and any third-party auth SDK. The viable options are:

| Method | Feasibility | Recommendation |
|---|---|---|
| **Sign in with Apple** | Built into iOS. `AuthenticationServices` framework is a system framework, not an external dependency. One-tap sign-in. Provides a stable user ID and optional email relay. | **Primary method.** Required for App Store compliance (if any third-party sign-in is offered, Sign in with Apple must also be offered -- but since it is the only option, this is satisfied). |
| **Phone number OTP** | Requires a backend to send SMS (Twilio, AWS SNS, etc.). The OTP verification logic runs server-side. The iOS client uses a simple `TextField` with `.textContentType(.oneTimeCode)` for auto-fill from SMS. No external iOS dependency needed. | **Secondary method.** Useful for users who share a family Apple ID or prefer phone-based auth. Requires backend SMS service. |
| **Email + password** | Requires custom backend for password hashing, reset flows, etc. More friction for the user. | **Not recommended for MVP.** Adds complexity (password reset flow, security concerns) with no benefit over Sign in with Apple + OTP. |
| **Biometric unlock (Face ID)** | Subsequent launches. Store auth token in Keychain; use `LAContext` to authenticate before retrieving it. | **Recommended for returning users.** Not a sign-up method but a session resumption method. |

### 6.4 SwiftUI Implementation Notes

**Onboarding carousel:** Use `TabView` with `.tabViewStyle(.page)` for the 3-screen value intro. Include `.indexViewStyle(.page(backgroundDisplayMode: .always))` for page indicators. Add a "Passer" (Skip) button persistently visible.

**Role selection screen:** Two large tappable cards ("Je suis conducteur" / "Je suis carrossier") using a simple `enum UserRole` that gets written to `SwiftData` on selection. This role determines which `TabView` variant is presented by the `RoleRouter`.

**Auth gate:** Present as a `.fullScreenCover` when the user reaches the commitment point (declaration submission for drivers, initial registration for garages). Use `SignInWithAppleButton` from `AuthenticationServices` for the primary CTA.

**Session persistence:** Store the auth token in `Keychain` (using the Security framework, no external dependency). Store the user profile and role in `SwiftData`. On app launch, the `AuthGate` view checks for a valid Keychain token; if found, skip to `RoleRouter`. If expired or missing, present the auth flow.

### 6.5 Role Switching

Some users may be both a driver and a garage owner (e.g., Mohamed gets into an accident in his personal car). The MVP should **not** support role switching. Each account has one role, selected at sign-up. If a user needs both roles, they create two accounts (one per Apple ID or phone number). Role switching can be added in V2 with a profile menu option.

---

## 7. Notification & Real-Time Strategy

### 7.1 Push Notification Matrix

| Event | Recipient | Priority | iOS Category | Actions | User Story |
|---|---|---|---|---|---|
| **Claim submitted** (confirmation) | Driver | High | `claim_submitted` | View claim | US01 |
| **New claim in zone** | Garage | High | `new_claim` | Accept, View | US05 |
| **Claim accepted by garage** | Driver | High | `claim_accepted` | View garage, Call | US05/US09 |
| **Booking confirmed** | Driver | High | `booking_confirmed` | View details, Add to Calendar | US03 |
| **Booking confirmed** | Garage | Medium | `booking_received` | View planning | US03 |
| **Booking reminder (24h)** | Driver | Medium | `booking_reminder` | View details | US03 |
| **Booking reminder (24h)** | Garage | Low | `booking_reminder` | View planning | US06 |
| **Status: Pris en charge** | Driver | High | `status_update` | View status | US04/US07 |
| **Status: En reparation** | Driver | Medium | `status_update` | View status | US04/US07 |
| **Status: Termine** | Driver | High | `status_complete` | View details, Call garage | US04/US07 |
| **Claim expired (no garage accepted)** | Driver | High | `claim_expired` | Retry, Expand radius | US05 |
| **All garages declined** | Driver | High | `claim_declined` | Retry, Expand radius | US05 |

### 7.2 iOS Notification Features

**Notification Categories and Actions:** Use `UNNotificationCategory` to define actionable notifications. For the `new_claim` category (garage), provide "Accepter" and "Voir" actions so the garage owner can accept a claim directly from the notification without opening the app.

**Notification Grouping:** Group by claim ID using `threadIdentifier`. All notifications related to a single claim (status updates, booking confirmations) group together in Notification Center. Set the summary format to "Dossier #%u -- %u notifications".

**Time-Sensitive Notifications:** Mark `claim_accepted`, `status_complete`, and `new_claim` as time-sensitive (`.timeSensitive` interruption level) so they break through Focus modes. Other notifications use `.active` (default).

**Provisional Notifications (iOS 12+):** Request provisional authorization at first launch. This delivers notifications to Notification Center silently (no banner, no sound) without requiring the user to grant permission. When the user sees one, they can choose to keep or turn off. This is ideal for a first-launch experience where the user has not yet seen enough value to grant full notification permission.

### 7.3 Live Activities (US04 -- Repair Tracking)

Live Activities are an ideal fit for repair status tracking. When a garage updates the status of a repair, the driver's Lock Screen and Dynamic Island show a persistent, updating widget.

**Recommended Live Activity:**

| Context | Display |
|---|---|
| **Lock Screen (expanded)** | Garage name, current status (e.g., "En reparation"), progress bar (4 steps), estimated completion (if available) |
| **Dynamic Island (compact)** | Car icon + status label ("En reparation") |
| **Dynamic Island (expanded)** | Garage name, current status, progress bar, "Appeler" button |

**Implementation:** Use `ActivityKit` to start a Live Activity when a claim transitions to "Pris en charge" and end it when the status reaches "Termine". Updates arrive via push notifications to the Live Activity (APNs push-to-start or update tokens). This requires no external dependency -- `ActivityKit` is a system framework.

**When to end the Live Activity:** Automatically end 1 hour after "Termine" status, or when the driver taps "J'ai recupere mon vehicule" in the app.

### 7.4 Background App Refresh

Use `BGTaskScheduler` to schedule periodic background refresh:

| Task | Frequency | Purpose | User Story |
|---|---|---|---|
| Claim status poll | Every 15 minutes (when active claim exists) | Ensure status timeline is up to date even if push notification was missed | US04 |
| Available claims refresh | Every 30 minutes (garage) | Pre-fetch new claims so the list is fresh when the garage opens the app | US05 |
| Booking reminder check | Once daily | Schedule local notifications for upcoming bookings if push was missed | US03 |

### 7.5 Notification Permission Timing

**Do not request notification permission at first launch.** Wait until the user has experienced value:

- **Drivers:** Request after successful declaration submission ("Activez les notifications pour suivre votre reparation en temps reel"). This is the moment of maximum motivation.
- **Garages:** Request after profile completion ("Activez les notifications pour recevoir les nouveaux dossiers sinistre"). This is when the garage is ready to receive claims.

Present a custom pre-permission screen explaining the benefit before triggering the system `UNUserNotificationCenter.requestAuthorization()` prompt. If denied, fall back to in-app notification center (badge on Mes Dossiers tab or Dashboard tab).

---

## 8. Offline & Error Strategy

### 8.1 Offline Capability Scope

A post-accident driver may have degraded connectivity (rural area, underground parking, overwhelmed cell tower near a highway accident). The app must handle this gracefully.

**Offline-capable (read + write):**

| Feature | Offline Behavior | Sync Strategy |
|---|---|---|
| Declaration steps 1-3 (type, photos, vehicle info) | Fully functional offline. Data stored in SwiftData. Photos stored in app sandbox. | On reconnection, upload queued data with retry logic. |
| Declaration step 4 (location) | GPS works offline. Map tiles may not load -- show a text-only address input fallback. | Reverse geocoding happens on submission (server-side). |
| Declaration submission | Queue locally. Show "En attente d'envoi -- votre dossier sera transmis des que la connexion sera retablie." | Submit automatically on reconnection. Show success when server confirms. |

**Offline-capable (read only, from cache):**

| Feature | Offline Behavior |
|---|---|
| Active claim detail + status timeline | Show cached version with "Derniere mise a jour: [timestamp]" label. |
| Garage profile (if previously viewed) | Show cached data. Availability may be stale -- show warning. |
| Booking confirmation | Show cached confirmation. It is already confirmed server-side. |
| Garage dashboard (garage side) | Show cached KPIs and today's appointments. |

**Requires connectivity (no offline support):**

| Feature | Why |
|---|---|
| Garage list/map search | Requires server query for proximity search + real-time availability. Show "Connexion requise pour rechercher des garages." |
| Booking (slot selection) | Requires real-time availability check to prevent conflicts. |
| Claim acceptance (garage) | Real-time action with race condition implications. |
| Status updates (garage) | Must notify the driver in real time. |

### 8.2 SwiftData Architecture for Offline Support

Use `SwiftData` as the local persistence layer. Key models:

| Model | Purpose | Sync Behavior |
|---|---|---|
| `UserProfile` | Cached user/garage profile | Write-through: update local and remote on edit |
| `ClaimDraft` | In-progress declaration (before submission) | Local-only until submission. Deleted after successful server submission. |
| `Claim` | Submitted claims with status history | Server-authoritative. Cache updates from server. Local read for offline. |
| `GarageProfile` | Cached garage profiles for offline viewing | Cache on first view. TTL: 24 hours. |
| `Booking` | Active bookings | Server-authoritative. Cache for offline display. |
| `PendingAction` | Queued write actions (declaration submission, status update) | Processed on reconnection in FIFO order. Deleted after server confirmation. |

**`PendingAction` pattern:** When the user performs a write action offline, create a `PendingAction` entity in SwiftData with the action type, payload, and timestamp. A `NetworkMonitor` (using `NWPathMonitor` from the Network framework -- system framework, no dependency) observes connectivity. On reconnection, a background task processes the queue.

### 8.3 Observation Framework for State Management

iOS 26 uses the `@Observable` macro (Observation framework) as the standard state management approach. No external dependencies (Combine, TCA, etc.) are needed.

**Recommended architecture:**

| Layer | Role | SwiftUI Integration |
|---|---|---|
| `@Observable class SessionManager` | Auth state, current user, role | `@Environment` injection at app root |
| `@Observable class ClaimFlowModel` | Declaration wizard state (steps, form data, photos) | `@State` in the declaration fullScreenCover |
| `@Observable class NetworkMonitor` | Connectivity state, pending action queue | `@Environment` injection; drives UI banners |
| `@Observable class DeepLinkRouter` | Notification deep link targets | `@Environment` injection; consumed by RoleRouter |
| SwiftData `@Query` | Read from local database | Direct in views for lists (claims, bookings, garages) |

**No global store is needed.** Each observable model is scoped to its domain. Views observe only what they need. This avoids the over-centralization problem that plagues Redux/TCA patterns and is aligned with Apple's recommended architecture for SwiftUI apps.

### 8.4 Error Handling UX Patterns

| Error Type | SwiftUI Presentation | User Message (French) | Recovery |
|---|---|---|---|
| **No internet** | Persistent banner at top of screen (custom `ViewModifier`) | "Pas de connexion internet" | Auto-dismiss on reconnection. Queued actions process automatically. |
| **Intermittent connection** | Toast notification (custom `ViewModifier`) | "Connexion instable" | Automatic retry with exponential backoff. |
| **Server error (5xx)** | Full-screen `ContentUnavailableView` (iOS 17+) | "Service temporairement indisponible. Reessayez dans quelques instants." | "Reessayer" button. |
| **API version mismatch** | `.alert` with single action | "Une mise a jour est disponible. Veuillez mettre a jour Carlib." | "Mettre a jour" opens App Store deep link. |
| **Form validation** | Inline red text below each field | Field-specific messages (e.g., "Format de plaque invalide") | User corrects the field; error clears on valid input. |
| **Photo upload failure** | Orange retry icon on photo thumbnail | "Echec de l'envoi" | Per-photo retry button. Auto-retry on reconnection. |
| **GPS unavailable** | Inline fallback in location step | "Impossible de determiner votre position. Saisissez l'adresse manuellement." | Manual address input field appears. |
| **Camera denied** | `.alert` with Settings deep link | "Carlib a besoin de l'appareil photo pour documenter le sinistre." | "Ouvrir les reglages" action. "Importer depuis la galerie" fallback. |
| **Booking slot conflict (409)** | `.alert` | "Ce creneau vient d'etre reserve. Choisissez un autre horaire." | Refresh available slots automatically. |
| **Claim already taken (409)** | `.alert` with list return | "Ce dossier a deja ete pris en charge par un autre garage." | Return to available claims list. |
| **Storage full** | `.alert` | "Espace de stockage insuffisant pour prendre des photos." | Suggest deleting old photos or using gallery import. |

### 8.5 ContentUnavailableView for Empty States

iOS 17+ provides `ContentUnavailableView` as a standard component for empty states. Use it consistently:

| Screen | Empty State Message | CTA |
|---|---|---|
| Driver > Mes Dossiers (no claims) | "Aucun dossier en cours" | "Signaler un sinistre" |
| Driver > Garages (no results) | "Aucun garage trouve dans cette zone" | "Elargir la recherche" |
| Garage > Dossiers Disponibles (no claims) | "Aucun sinistre disponible dans votre zone" | "Verifier ma zone d'intervention" |
| Garage > Planning (empty calendar) | "Definissez vos creneaux pour recevoir des reservations" | "Ajouter un creneau" |
| Notifications (empty) | "Aucune notification" | None (informational) |
| Garage > Dossiers Termines (no completed) | "Aucun dossier termine pour le moment" | None |

---

## 9. Key UX Metrics

### 9.1 North Star Metric

**"Reparations Completees"** -- the number of claims that traverse the full lifecycle: declaration > garage match > booking > repair completion. This single metric captures marketplace health end-to-end.

### 9.2 iOS-Specific Metrics Framework

| Category | Metric | Target (MVP) | Measurement Method | Why It Matters |
|---|---|---|---|---|
| **Acquisition** | App download-to-first-action rate | >40% | Custom Analytics (no Firebase -- track via backend API calls) | Measures onboarding effectiveness. First action = declaration started (driver) or profile completed (garage). |
| **Declaration funnel** | Time to complete declaration (4 steps) | <5 minutes | Timestamp deltas on step transitions (backend events) | Core UX quality signal. Post-accident users abandon if it takes too long. |
| **Declaration funnel** | Declaration completion rate (started vs. submitted) | >70% | Backend funnel events | Drop-off identifies friction points in the wizard. |
| **Declaration funnel** | Step-by-step drop-off | Identify worst step | Per-step backend events | Photo step is likely the highest drop-off -- validate and optimize. |
| **Matching** | Time from declaration to garage selection | <15 minutes | Backend timestamps | Speed of the marketplace. Longer = lost engagement. |
| **Matching** | Garage selection rate (declarations that result in a selected garage) | >60% | Backend | Measures garage supply adequacy. Low rate = supply problem. |
| **Booking** | Booking completion rate (garage selected to booking confirmed) | >80% | Backend | Low rate suggests availability mismatch or UX friction in calendar. |
| **Tracking** | Notification open rate (status update notifications) | >50% | APNs delivery + app open attribution | Measures engagement with the tracking feature. |
| **Tracking** | Live Activity engagement (if implemented) | Track "expanded" events | ActivityKit analytics | Validates whether Live Activities add value. |
| **Garage supply** | Active garages (logged in within 7 days) | Track absolute count | Backend session tracking | Marketplace viability indicator. |
| **Garage supply** | Average garage response time to new claims | <2 hours | Backend timestamps | Quality signal. Slow response = poor driver experience. |
| **Garage supply** | Claim acceptance rate | >40% | Backend | Low rate = lead quality issue or garage UX friction. |
| **Retention** | Driver return rate (second claim OR referral) | Low (expected -- accidents are rare) | Backend | Natural frequency is low. Measure referrals as a proxy for satisfaction. |
| **Retention** | Garage weekly active usage | >3 sessions/week | Backend session tracking | Garages must check the app regularly for the marketplace to function. |
| **Satisfaction** | App Store rating | >4.2 stars | App Store Connect | Public perception. Below 4.0 kills acquisition. |
| **Satisfaction** | In-app rating prompt response | Track via `SKStoreReviewController` | System API (fire after first completed repair) | Timing of the prompt matters -- ask at the moment of delight (vehicle ready). |
| **System health** | Crash-free session rate | >99.5% | MetricKit + Xcode Organizer | Below 99% triggers App Store ranking penalty. |
| **System health** | App launch time | <1.5 seconds (warm), <3 seconds (cold) | MetricKit `MXAppLaunchMetric` | Slow launches erode trust, especially for a stress-context app. |
| **Offline** | Offline declaration submissions (queued then synced) | Track count | Backend (detect delayed submissions) | Validates whether offline support is needed and used. |

### 9.3 Analytics Implementation Without External Dependencies

Since no external dependencies are allowed (no Firebase Analytics, no Mixpanel), analytics must be implemented via:

1. **Backend event tracking:** The app sends structured event payloads to the Carlib backend API on user actions (declaration started, step completed, garage selected, booking confirmed, etc.). The backend stores and aggregates these.
2. **MetricKit:** Use `MXMetricManager` to collect system-level performance metrics (launch time, hang rate, disk writes). This is a system framework.
3. **App Store Connect:** App analytics (downloads, sessions, retention) are available without any SDK.
4. **`SKStoreReviewController`:** For in-app rating prompts. Request review after the first completed repair (status = "Termine"). Limit to 3 prompts per 365-day period (system-enforced).

---

## 10. Open Question Impact Analysis

The PRD lists 8 open questions. For each, I provide a recommended default decision and analyze its impact on the SwiftUI architecture.

### Question 1 -- Brand Identity (Visual Charter)

**Status:** Open (Owner: Client)

**Recommended Default:** Proceed with a "design token placeholder" approach. Define the color system, typography, and spacing as SwiftUI design tokens (custom `Color` and `Font` extensions) with placeholder values. Use a blue-dominant palette (calming, trust-signaling -- see UI Analysis doc 04) with a system font (SF Pro) until the brand charter is confirmed. When the client delivers the brand identity, update the token values in one file.

**SwiftUI Architecture Impact:**
- Define all colors as `Color("tokenName")` from an Asset Catalog, or as `static let` extensions on `Color` in a `DesignTokens` file. Never use hardcoded color literals in views.
- Define all text styles as `Font` extensions (`Font.carlib.heading1`, `Font.carlib.body`, etc.). If a custom font is later chosen, update one file.
- Define all spacing as `CGFloat` constants (`Spacing.sm = 8`, `Spacing.md = 16`, etc.).
- **Impact level: LOW.** Brand identity does not block SwiftUI development if tokens are used correctly. It blocks visual polish, not architecture.

### Question 2 -- Attribution Logic

**Status:** Open (Owner: Client + PM)

**Recommended Default:** Driver-selects-garage (Model A). See Section 4 for full rationale.

**SwiftUI Architecture Impact:**
- **HIGH IMPACT.** This determines whether the app needs a garage list/map/detail flow (Model A) or a waiting/dispatch screen (Model B). These are completely different view hierarchies.
- Model A requires: `GarageListView`, `GarageMapView`, `GarageDetailView`, `GarageFilterSheet`, `CalendarPickerView`. Approximately 5-6 views.
- Model B requires: `WaitingForGarageView`, `AssignedGarageView`. Approximately 2 views, but with complex real-time notification handling.
- **If this question remains unresolved:** Build Model A (driver selection). It is the superset -- all Model A views are needed even if Model B is later added as a "Carlib recommande" shortcut.

### Question 3 -- Garage Portal Scope (Mobile Only vs. Web/Tablet)

**Status:** Open (Owner: Client + PM)

**Recommended Default:** Mobile only (iPhone) for MVP. The project constraint already specifies "iPhone only, Portrait only." This question is already answered by the technical constraints.

**SwiftUI Architecture Impact:**
- **NONE for MVP.** The app is iPhone Portrait only. No iPad, no web, no responsive layouts needed.
- For V2, if a tablet/web version is desired, the garage portal could be rebuilt as a SwiftUI app for iPad (using `NavigationSplitView` for sidebar-detail) or as a web app (separate codebase).
- **Note:** Body shop owners who prefer a larger screen can use their iPad with the iPhone app in compatibility mode. Not ideal, but functional for MVP.

### Question 4 -- Insurance Involvement in MVP

**Status:** To confirm (Owner: PM > Client)

**Recommended Default:** **No insurance involvement in MVP.** Do not include insurance-related fields (assureur name, policy number) in the declaration form. This avoids the legal ambiguity of Carlib being perceived as an insurance intermediary (which would require ORIAS registration in France).

**SwiftUI Architecture Impact:**
- **LOW.** Removing insurance fields from the declaration form reduces Step 3 complexity. No insurance-related views, no data model fields.
- If later added (V2), insurance fields can be appended to the `ClaimDraft` SwiftData model and the Step 3 form. The navigation structure does not change.
- **Content strategy impact:** All copy must carefully avoid implying that Carlib replaces the official insurance declaration. Use "signalement" not "declaration." Include a disclaimer: "Carlib ne remplace pas votre declaration aupres de votre assureur."

### Question 5 -- Geographic Scope (National vs. Regional vs. City Pilot)

**Status:** In progress (Owner: Client + PM)

**Recommended Default:** **City pilot (single metro area).** Recommend Lyon, Toulouse, or Bordeaux -- large enough for density (50+ body shops in metro area), small enough for manageable garage recruitment (target: 15-20 garages at launch).

**SwiftUI Architecture Impact:**
- **MINIMAL.** The app architecture is geography-agnostic. The garage list filters by proximity to the user's location regardless of whether coverage is one city or national.
- If city-pilot: set a default search radius of 25km. If national: set default to 50km.
- The only UI impact is the empty state messaging: "Aucun garage disponible dans votre zone. Carlib est actuellement disponible a Lyon et ses environs." This localized messaging requires a backend configuration, not an app architecture change.

### Question 6 -- Revenue Model

**Status:** In progress (Owner: Client + PM)

**Recommended Default:** **Commission per completed repair (lead-gen model)** for MVP. The garage pays nothing upfront. Carlib takes a percentage (5-15%) of each repair facilitated through the platform. This aligns incentives (Carlib only earns when value is delivered) and removes adoption friction for garages.

**SwiftUI Architecture Impact:**
- **LOW for MVP.** A commission model requires no garage-facing pricing UI. The commission is handled backend/billing, not in-app.
- If subscription model were chosen instead: would need `SubscriptionView`, `PricingView`, paywall logic (using `StoreKit 2` -- system framework, no dependency). This adds 3-4 screens and a `StoreKit` integration.
- If freemium: would need feature-gating logic (limit number of visible claims for free-tier garages). Adds conditional UI rendering complexity.
- **Recommendation:** Build with zero monetization UI in the app for MVP. Handle billing externally (invoicing, backend). Add in-app monetization surfaces in V1.1 once the model is validated.

### Question 7 -- Emergent AI Mockups (Client's Existing Screens)

**Status:** To do (Owner: Client)

**Recommended Default:** **Proceed without them.** The existing analysis documents (01-08) provide sufficient design direction. If the client shares them later, they serve as reference material, not as binding design specifications. The PRD explicitly states they are "base de discussion et non de brief design valide."

**SwiftUI Architecture Impact:**
- **NONE.** Mockups inform visual design, not app architecture. The SwiftUI view hierarchy, navigation patterns, and data models are determined by the user stories and information architecture, not by mockup screenshots.

### Question 8 -- Kickoff Date

**Status:** Open (Owner: PM)

**Recommended Default:** **As soon as Question #2 (attribution model) is resolved.** This is the only true architectural blocker. All other open questions can be resolved in parallel with Phase 1 work.

**SwiftUI Architecture Impact:**
- **NONE.** This is a scheduling question, not a technical one.

---

## Summary: Critical Path Decisions

| Priority | Decision | Default | Architecture Impact | Blocks |
|---|---|---|---|---|
| **P0** | Attribution model (#2) | Driver selects | HIGH -- determines core view hierarchy | All marketplace flow development |
| **P1** | Insurance in MVP (#4) | No insurance | LOW -- content/legal, not architecture | Declaration form content |
| **P1** | Auth method | Sign in with Apple + Phone OTP | MEDIUM -- determines auth flow views | All authenticated features |
| **P2** | Brand identity (#1) | Placeholder tokens (blue palette, SF Pro) | LOW -- swap tokens when ready | Visual polish only |
| **P2** | Revenue model (#6) | Commission (no in-app UI) | LOW -- backend billing only | Nothing for MVP |
| **P3** | Geographic scope (#5) | City pilot | MINIMAL -- config, not architecture | Marketing, not development |
| **P3** | Garage portal scope (#3) | iPhone only (per project constraints) | NONE | Nothing |
| **P3** | Emergent mockups (#7) | Proceed without | NONE | Nothing |

---

## Appendix A: SwiftUI View Hierarchy Summary

```
CarlibApp (@main)
|
|-- WindowGroup
    |
    |-- AuthGate (@Observable SessionManager via @Environment)
        |
        +--> No session
        |    |
        |    |-- OnboardingCarousel (TabView .page style)
        |    |-- RoleSelectionView
        |    |-- AuthView (fullScreenCover)
        |        |-- SignInWithAppleButton
        |        |-- PhoneOTPView
        |
        +--> Session exists --> RoleRouter
                                  |
                                  +--> .driver --> DriverTabView
                                  |                |
                                  |                |-- Tab: HomeView
                                  |                |   |-- NavigationStack
                                  |                |   |-- ActiveClaimCard
                                  |                |   |-- "Signaler" CTA --> DeclarationFlow (fullScreenCover)
                                  |                |       |-- Step1TypeView
                                  |                |       |-- Step2PhotosView
                                  |                |       |-- Step3InfoView
                                  |                |       |-- Step4LocationView
                                  |                |       |-- RecapView
                                  |                |       |-- SuccessView --> GarageSelectionFlow
                                  |                |
                                  |                |-- Tab: ClaimsListView
                                  |                |   |-- NavigationStack
                                  |                |   |-- ClaimDetailView
                                  |                |       |-- StatusTimelineView
                                  |                |       |-- BookingRecapView
                                  |                |
                                  |                |-- Tab: GaragesView
                                  |                |   |-- NavigationStack
                                  |                |   |-- MapListToggleView
                                  |                |   |-- GarageDetailView
                                  |                |   |-- CalendarPickerView (sheet)
                                  |                |   |-- BookingConfirmationView
                                  |                |
                                  |                |-- Tab: DriverProfileView
                                  |                    |-- NavigationStack
                                  |                    |-- VehicleInfoView
                                  |                    |-- NotificationPrefsView
                                  |                    |-- LegalView
                                  |
                                  +--> .garage --> GarageTabView
                                                   |
                                                   |-- Tab: DashboardView
                                                   |   |-- NavigationStack
                                                   |   |-- KPICardsView
                                                   |   |-- TodayAppointmentsView
                                                   |
                                                   |-- Tab: GarageClaimsView
                                                   |   |-- NavigationStack
                                                   |   |-- SegmentedControl: Available | Active | Completed
                                                   |   |-- ClaimDetailView
                                                   |       |-- AcceptDeclineView
                                                   |       |-- StatusStepperView
                                                   |
                                                   |-- Tab: PlanningView
                                                   |   |-- NavigationStack
                                                   |   |-- WeekCalendarView
                                                   |   |-- SlotCreationSheet (sheet)
                                                   |
                                                   |-- Tab: GarageProfileView
                                                       |-- NavigationStack
                                                       |-- ProfileEditView
                                                       |-- PhotoGalleryView
                                                       |-- ZoneMapView
                                                       |-- NotificationPrefsView
```

## Appendix B: SwiftData Model Sketch

```
@Model ClaimDraft        -- In-progress declaration (local only until submission)
@Model Claim             -- Submitted claim with status history (synced with server)
@Model Booking           -- Confirmed booking (synced with server)
@Model UserProfile       -- Driver or garage profile (synced with server)
@Model GarageCache       -- Cached garage profiles for offline viewing (TTL: 24h)
@Model PendingAction     -- Queued write actions for offline-to-online sync
@Model NotificationLog   -- Local notification history for in-app notification center
```

## Appendix C: Framework Usage (Zero External Dependencies)

| Need | System Framework | Notes |
|---|---|---|
| UI | SwiftUI | App lifecycle, all views |
| Local persistence | SwiftData | All local models, offline cache |
| State management | Observation (`@Observable`) | No Combine, no TCA, no third-party |
| Auth (Sign in with Apple) | AuthenticationServices | `SignInWithAppleButton` |
| Auth (biometric) | LocalAuthentication | Face ID session resumption |
| Auth (token storage) | Security (Keychain) | Secure token persistence |
| Maps | MapKit (`Map` SwiftUI view) | Garage map, location picker |
| Camera | AVFoundation + SwiftUI | Photo capture in declaration |
| Photo picker | PhotosUI (`PhotosPicker`) | Gallery import fallback |
| Location | CoreLocation | GPS for declaration + garage proximity |
| Push notifications | UserNotifications | APNs registration, categories, actions |
| Live Activities | ActivityKit | Repair tracking on Lock Screen |
| Background tasks | BackgroundTasks (`BGTaskScheduler`) | Periodic data refresh |
| Network monitoring | Network (`NWPathMonitor`) | Offline detection |
| In-app review | StoreKit (`SKStoreReviewController`) | Rating prompt |
| Performance metrics | MetricKit | Launch time, crash rate, disk writes |
| Calendar integration | EventKit | "Add booking to calendar" action |
| Phone calls | UIKit (`UIApplication.open(tel:)`) | Tap-to-call garage |

---

*This UX strategy document is based on PRD Carlib v0.1 (March 2026, Digital Unicorn) and 8 prior analysis documents produced during Phase 0 Kickstart. It is intended as a comprehensive architectural and UX guide for the native SwiftUI implementation. All recommendations should be validated with the project stakeholders before implementation begins.*
