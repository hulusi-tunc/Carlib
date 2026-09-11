> Historical — written against the SwiftUI app, now archived at `archive/swift/`. The product is `mobile/`.

# Carlib -- Interaction Design Specification for Native SwiftUI (iOS 26)

**Version:** 1.0
**Date:** 6 avril 2026
**Author:** Interaction Designer Agent
**Platform:** iOS 26, Xcode 26, SwiftUI, iPhone only, Portrait only
**Source:** PRD Carlib v0.1, Existing analyses (01-08)

---

## Table of Contents

1. [Complete State Inventory](#1-complete-state-inventory)
2. [Gesture Patterns](#2-gesture-patterns)
3. [Transition & Animation Spec](#3-transition--animation-spec)
4. [Input Patterns](#4-input-patterns)
5. [Haptic Feedback Map](#5-haptic-feedback-map)
6. [Real-Time & Push Notification Design](#6-real-time--push-notification-design)
7. [Error Handling Interaction Patterns](#7-error-handling-interaction-patterns)
8. [Photo Capture Flow](#8-photo-capture-flow)
9. [Map Interaction](#9-map-interaction)
10. [Calendar & Booking Interaction](#10-calendar--booking-interaction)
11. [Edge Cases](#11-edge-cases)

---

## 1. Complete State Inventory

Every screen in Carlib requires five baseline states: **empty**, **loading**, **loaded**, **error**, and **no-network**. SwiftUI state management uses the Observation framework (`@Observable`, `@State`, `@Binding`, `@Environment`) introduced in iOS 17 and refined in iOS 26.

### 1.1 State Management Architecture

| Layer | SwiftUI Mechanism | Scope | Usage in Carlib |
|---|---|---|---|
| **View-local state** | `@State` | Single view | Form field values, toggle states, sheet presentation, selected tab |
| **Child-to-parent binding** | `@Binding` | Parent-child pair | Stepper current step, selected date passed to slot picker, filter toggles |
| **Shared observable model** | `@Observable` (macro, Observation framework) | Across view hierarchy | ClaimDraft, GarageSearchModel, BookingModel, RepairStatusModel |
| **App-wide singletons** | `@Environment(\.modelContext)` with SwiftData; custom `@Environment` keys | Entire app | AuthenticationState, NetworkMonitor, NotificationManager, UserProfile |
| **Navigation state** | `NavigationStack` with `NavigationPath` (typed) | Per NavigationStack | Driver flow path, garage flow path, deep-link resolution |
| **Persistence** | SwiftData `@Model` + `@Query` | Disk-backed | ClaimDraft (offline), CachedGarageList, NotificationHistory |

### 1.2 Global Observable Models

```
@Observable class AppState {
    var authStatus: AuthStatus          // .unauthenticated, .authenticated(User), .sessionExpired
    var networkStatus: NetworkStatus    // .connected, .disconnected, .degraded
    var forceUpdateRequired: Bool
    var maintenanceMode: Bool
}

@Observable class ClaimFlowState {
    var currentStep: ClaimStep          // .type, .photos, .vehicleInfo, .location, .summary
    var draft: ClaimDraft?              // SwiftData @Model, persisted locally
    var submissionStatus: AsyncStatus   // .idle, .loading, .success(ClaimID), .failure(Error)
}

@Observable class GarageSearchState {
    var garages: AsyncStatus<[Garage]>  // .idle, .loading, .loaded([Garage]), .error(Error)
    var selectedGarage: Garage?
    var filters: GarageFilters
    var mapRegion: MKCoordinateRegion
    var viewMode: GarageViewMode        // .map, .list
}
```

**AsyncStatus pattern** used throughout:

```
enum AsyncStatus<T> {
    case idle
    case loading
    case loaded(T)
    case error(AppError)
}
```

### 1.3 Screen-by-Screen State Matrix -- Driver Flow

#### D-01: Home / Dashboard

| State | Condition | UI Presentation | SwiftUI Implementation |
|---|---|---|---|
| **Empty (first use)** | No active claims, no history | Illustration + "Declarer un sinistre" CTA centered | `ContentUnavailableView` with custom label and action |
| **Loading** | Fetching active claims on app launch or pull-to-refresh | Shimmer skeleton: 1 hero card + 2 action buttons placeholder | Custom `ShimmerView` using `.redacted(reason: .placeholder)` on a template layout |
| **Loaded (active claim)** | 1+ active claims exist | Hero status card (current claim) + quick actions + recent activity list | Standard `ScrollView` + `LazyVStack` with data binding from `@Observable` model |
| **Loaded (no active, has history)** | Past claims only | "Aucun sinistre en cours" card + history list + "Nouveau sinistre" CTA | Conditional rendering via `if/else` on model state |
| **Error** | API call failed | `ContentUnavailableView` with "Impossible de charger" + "Reessayer" button | `.refreshable` modifier + manual retry button calling `Task { await model.refresh() }` |
| **No network** | NetworkMonitor reports `.disconnected` | Persistent banner at top: "Pas de connexion" + cached data shown below | `@Environment(NetworkMonitor.self)` observed; banner using `.safeAreaInset(edge: .top)` |

#### D-02 to D-06: Declaration Flow (4 Steps + Summary)

Each step shares a common container with a `ProgressView`-style step indicator.

| State | Step 1 (Type) | Step 2 (Photos) | Step 3 (Vehicle) | Step 4 (Location) | Summary |
|---|---|---|---|---|---|
| **Empty** | Grid of accident types, none selected. `@State private var selectedType: AccidentType?` | Camera viewfinder with overlay guide. No photos yet. Thumbnail strip empty. | Empty form. If returning user: pre-fill from `@Query` on saved Vehicle. `@State` per field. | Map centered on current location (or France center if no GPS). Draggable pin. Empty description. | Read-only compilation of all steps. All data from `@Binding` or shared `@Observable ClaimFlowState`. |
| **Loading** | N/A (static) | Per-photo: upload progress ring on thumbnail. `@State private var uploadProgress: [UUID: Double]` | Pre-fill loading: skeleton on vehicle fields while fetching saved data. | Geocoding spinner on address field while resolving pin position. `@State private var isGeocoding = false` | Submission spinner: full-screen overlay with reassuring message. |
| **Loaded** | One type highlighted with checkmark. "Suivant" CTA enabled. | 1-5 thumbnails with green checkmarks. Photo requirement checklist updating. | All fields populated and validated. Green checkmarks inline. | Pin placed, address resolved, description filled. | All data displayed. "Soumettre" CTA prominent. |
| **Error** | N/A | Camera permission denied alert. Individual photo upload failure (orange retry badge). Blur detection warning. | Inline validation errors per field (red text below field). Plate OCR failure (manual fallback). | GPS unavailable (manual address input appears). Geocode failure (address text without map). | Submission failure: "Erreur d'envoi" alert with "Reessayer" and "Sauvegarder en brouillon" actions. |
| **No network** | Banner + continue anyway (draft mode). | Photos captured locally, queued for upload. Orange "En attente d'envoi" badges. | Form fillable offline (all local state). | Map tiles may not load: "Carte indisponible" placeholder. Address manual entry only. | "Vous etes hors ligne. Votre declaration sera envoyee automatiquement." info banner. Submit queues locally. |

**Draft persistence:** `ClaimDraft` is a SwiftData `@Model`. Every step auto-saves on field change via `onChange(of:)` modifier writing to the model context. Draft survives app kill, backgrounding, and phone restart.

#### D-08/D-09: Garage Search (Map + List)

| State | Map View | List View |
|---|---|---|
| **Empty** | Map loads but no garage pins. "Aucun garage dans cette zone." overlay. "Elargir la recherche" CTA. | `ContentUnavailableView`: "Aucun garage disponible" + filter adjustment suggestion. |
| **Loading** | Map tiles loading + shimmer pins (grey placeholder dots). Bottom sheet in peek position shows skeleton cards. | `ForEach` over placeholder array with `.redacted(reason: .placeholder)` on `GarageCardView`. |
| **Loaded** | Garage `Annotation` pins on `Map`. Selected pin enlarges. Bottom sheet scrollable with `GarageCardView` list. | `List` of `GarageCardView` items with distance, availability badge, specialty tags. |
| **Error** | Map loads but "Erreur de recherche" toast. Retry affordance. | `ContentUnavailableView` with retry. |
| **No network** | Cached garage data shown with "Donnees hors ligne" badge. Map tiles from cache (MapKit caches recently viewed areas). | Cached list with "Derniere mise a jour: {time}" label. |

#### D-12/D-13: Booking (Calendar + Slot Selection)

| State | Calendar View | Slot Selection |
|---|---|---|
| **Empty** | Calendar header with no highlighted dates. "Chargement des disponibilites..." | "Aucun creneau disponible ce jour." Message + "Jour suivant" CTA. |
| **Loading** | Date strip loads. Slot area shows skeleton grid. | Slots shimmer while refreshing after day change. |
| **Loaded** | Dates with availability get green dot indicator. Tappable. Past dates greyed + disabled. | Time chips: available (primary color, tappable), unavailable (grey, disabled). Selected chip highlighted with checkmark. "Confirmer" CTA enabled. |
| **Error** | "Impossible de charger les disponibilites" inline message. Retry. | Slot conflict on confirm: alert "Ce creneau vient d'etre reserve." Return to slot view, refresh. |
| **No network** | "Connexion requise pour voir les disponibilites." Full-screen message (cannot show stale availability). | Cannot confirm offline. "Reservation impossible hors ligne." |

#### D-15/D-16: Repair Tracking

| State | Status Dashboard | Timeline Detail |
|---|---|---|
| **Empty** | Claim just submitted. Status: "En attente." Single node on timeline. | No history entries yet. "Votre dossier vient d'etre soumis." |
| **Loading** | Skeleton: progress bar placeholder + timeline skeleton. | Pull-to-refresh active. |
| **Loaded** | Animated progress bar at correct stage. Current status node pulses. 4-stage stepper: en attente / pris en charge / en reparation / termine. | Chronological list of timestamped status changes. Expandable detail per node. |
| **Error** | Stale cached status shown + "Actualisation impossible" banner. | Same pattern. |
| **No network** | Last known status from SwiftData cache. "Statut potentiellement obsolete." | Cached timeline. |

### 1.4 Screen-by-Screen State Matrix -- Garage Flow

#### G-01: Garage Dashboard

| State | Condition | UI Presentation |
|---|---|---|
| **Empty (first use)** | No claims, no bookings, profile incomplete | Guided setup: "Completez votre profil pour recevoir des dossiers" + profile completion progress ring |
| **Loading** | Fetching dashboard data | Hero card skeleton + 3 stat card skeletons + list skeleton |
| **Loaded** | Active data present | KPI cards (new claims count, today's bookings, active repairs) + today's schedule list + "Voir les sinistres" CTA |
| **Error** | API failure | `ContentUnavailableView` with retry |
| **No network** | Offline | Cached data + "Hors ligne" banner + write actions queued indicator |

#### G-02/G-03: Available Claims List + Detail

| State | Claims List | Claim Detail |
|---|---|---|
| **Empty** | "Aucun sinistre disponible dans votre zone." + "Verifier mes parametres de zone" CTA | N/A (unreachable without list item) |
| **Loading** | Skeleton list items with shimmer | Full-screen skeleton: photo gallery placeholder + info card placeholders |
| **Loaded** | Cards with: vehicle type icon, damage type, distance badge, time badge. Badge shows number of garages viewing claim. | Complete dossier: photo gallery (horizontally scrollable), vehicle info, accident description, location mini-map, driver info (limited). "Accepter" / "Refuser" CTAs. |
| **Error** | Retry on list load failure | "Dossier indisponible" if data load fails |
| **No network** | Cached claim list (may be stale). "Donnees hors ligne" banner. Accept action queued. | Cached detail if previously viewed. "Acceptation impossible hors ligne" if never cached. |

#### G-04: Accept / Decline Action

| State | Description | SwiftUI Implementation |
|---|---|---|
| **Idle** | Two buttons visible: "Accepter" (primary, green) / "Refuser" (secondary, grey) | Standard `Button` views with `.buttonStyle` |
| **Loading (accepting)** | "Accepter" button shows `ProgressView()` spinner. "Refuser" disabled. | `.disabled(isAccepting)` + `ProgressView()` overlay |
| **Success** | "Dossier accepte" confirmation with checkmark animation. Auto-navigates to active dossiers. | `withAnimation(.spring)` + navigation via `NavigationPath.append()` after 1.5s delay |
| **Race condition error** | Alert: "Ce dossier a deja ete pris en charge par un autre garage." | `.alert("Dossier indisponible", isPresented: $showConflictAlert)` |
| **Network error** | Toast: "Echec de la prise en charge. Reessayer?" | Custom toast overlay with retry action |

#### G-08/G-09: Planning (Week/Month View)

| State | Week View | Day Detail |
|---|---|---|
| **Empty (first use)** | Empty grid with onboarding tooltip: "Appuyez sur un creneau pour definir vos disponibilites." | No appointments. "Aucun rendez-vous ce jour." |
| **Loading** | Grid structure visible, cells shimmer. | Slot list shimmers. |
| **Loaded** | Color-coded grid: green (available), blue (booked with driver name), grey/hatched (blocked). Today's column highlighted. | List of appointments with time, driver name, vehicle, status badge. |
| **Error** | "Synchronisation echouee" banner above grid. Stale data shown. Last sync timestamp. | Same pattern. |
| **No network** | Cached calendar. "Modifications en attente de synchronisation" indicator. Changes queued in SwiftData. | Same. |

#### G-07: Status Update

| State | Description |
|---|---|
| **Idle** | Horizontal 4-step stepper. Current step highlighted + pulsing. "Etape suivante: {status}" CTA below. |
| **Confirming** | Confirmation sheet: "Confirmer le passage a {status}? Le conducteur sera notifie automatiquement." Two actions: "Confirmer" / "Annuler". |
| **Loading** | Stepper animates forward. CTA shows spinner. |
| **Success** | Stepper settles on new step. Toast: "Statut mis a jour. Annuler?" with 5-second undo window. |
| **Undo window** | Toast with countdown. Tapping "Annuler" reverts stepper with reverse animation. |
| **Error** | Stepper springs back to previous step. Alert: "Mise a jour echouee. Le conducteur n'a pas ete notifie." Retry CTA. |

### 1.5 Shared States Across All Screens

| State | Trigger | SwiftUI Implementation |
|---|---|---|
| **Session expired** | 401 API response | `@Environment(AppState.self)` sets `.sessionExpired`. Root view presents `.fullScreenCover` with login. Navigation state preserved in `@SceneStorage`. |
| **Force update** | 426 API response | Non-dismissible `.fullScreenCover` with App Store deep link via `UIApplication.shared.open(appStoreURL)`. |
| **Maintenance** | Server flag | `ContentUnavailableView` with estimated return time. Polled every 60s. |
| **Permission request** | First camera/location/notification use | Pre-permission screen via `.sheet`. Explains value in French. On tap: triggers system `AVCaptureDevice.requestAccess` / `CLLocationManager.requestWhenInUseAuthorization` / `UNUserNotificationCenter.requestAuthorization`. |

---

## 2. Gesture Patterns

### 2.1 Gesture-to-Screen Mapping

| Gesture | SwiftUI API | Screens Used | Behavior Detail |
|---|---|---|---|
| **Pull-to-refresh** | `.refreshable { await model.refresh() }` | D-01 (Home), D-08/D-09 (Garage list), D-15 (Status tracking), G-01 (Dashboard), G-02 (Claims list), G-05 (Active dossiers), G-08 (Planning), Notification center | Standard iOS rubber-band pull. Triggers `async` reload. Haptic on threshold (system default). Spinner replaces content header during load. |
| **Swipe actions (trailing)** | `.swipeActions(edge: .trailing)` on list rows | G-02 (Claims list: "Accepter" / "Refuser"), Notification list ("Marquer lu" / "Archiver"), D-17 (Dossier history: "Archiver") | Trailing swipe reveals action buttons. Full swipe triggers primary action. Destructive actions use `.tint(.red)`. Non-destructive use `.tint(.blue)`. |
| **Swipe actions (leading)** | `.swipeActions(edge: .leading)` on list rows | G-02 (Claims list: quick "Accepter" one-swipe), G-05 (Active dossiers: quick "Statut suivant") | Leading swipe for positive/forward actions. Full swipe triggers immediately. |
| **Context menu (long press)** | `.contextMenu { }` | D-03 (Photo thumbnail: "Reprendre" / "Supprimer"), G-08 (Calendar slot: "Bloquer" / "Modifier" / "Supprimer"), D-17 (Dossier: "Voir details" / "Archiver") | System long-press with haptic. Preview shown for photos/cards (`.contextMenu` with preview). Menu items with SF Symbols icons. |
| **Pinch-to-zoom** | `MagnifyGesture` composed with `DragGesture` | D-03 (Photo review full-screen), G-03 (Claim photos full-screen), G-11 (Garage photos) | Applied to `Image` in full-screen viewer. `@GestureState` tracks scale. Bounded: min 1.0x, max 5.0x. Double-tap toggles between 1x and 2x via `withAnimation(.spring)`. |
| **Drag (vertical)** | `DragGesture` (custom, or system `.presentationDetents`) | Map bottom sheet (D-08), Garage detail sheet, Filter sheet, Booking confirmation sheet | Bottom sheets use `.sheet` with `.presentationDetents([.fraction(0.3), .medium, .large])`. Custom drag for slot creation on garage calendar. |
| **Drag (horizontal)** | `DragGesture` on custom container | G-08 (Week view: navigate weeks), D-12 (Date strip: scroll dates) | Horizontal paging with `.scrollTargetBehavior(.paging)` on `ScrollView(.horizontal)`. Resistance at boundaries via `DragGesture` with spring-back. |
| **Tap** | `Button` / `.onTapGesture` / `NavigationLink` | All interactive elements | Minimum 44x44pt touch target enforced via `.frame(minWidth: 44, minHeight: 44)`. Visual feedback: `.buttonStyle(.automatic)` provides system highlight. Custom styles add scale: `.scaleEffect(isPressed ? 0.96 : 1.0)`. |
| **Double-tap** | `.onTapGesture(count: 2)` | Map view (zoom in), Photo viewer (toggle zoom) | On map: `MapCameraPosition` animated to zoom in 2x on tapped coordinate. On photo: toggle `@State var scale` between 1.0 and 2.0 with `.animation(.spring)`. |
| **Scroll** | `ScrollView` / `List` | Nearly all screens | Vertical scroll default. Horizontal for date strip, photo thumbnails, filter chips. `.scrollIndicators(.hidden)` for horizontal strips. `.scrollDismissesKeyboard(.interactively)` on forms. |
| **Keyboard dismiss** | `.scrollDismissesKeyboard(.interactively)` + toolbar dismiss | All form screens (D-03 vehicle, D-04 location, registration, garage profile edit) | Interactive dismiss on scroll. Explicit "OK" toolbar button via `.toolbar { ToolbarItemGroup(placement: .keyboard) { Button("OK") { focusState = nil } } }`. |

### 2.2 Gesture Accessibility Alternatives

Every gesture-based interaction has a tap-based alternative for motor accessibility:

| Gesture | Alternative | Implementation |
|---|---|---|
| Swipe actions on list rows | Tap row to open detail, then use explicit buttons | Detail view always contains the same actions as swipe |
| Pinch-to-zoom | Double-tap to toggle zoom; zoom buttons in toolbar | Accessible toolbar items with `.accessibilityLabel("Agrandir")` |
| Drag to create calendar slot | Tap empty slot to open time picker sheet | `.onTapGesture` on empty cell triggers `.sheet` |
| Pull-to-refresh | Explicit "Actualiser" button in toolbar/navigation bar | `ToolbarItem(placement: .topBarTrailing) { Button("Actualiser") { ... } }` |
| Bottom sheet drag | Detent buttons or close button | `.presentationDragIndicator(.visible)` + explicit "Fermer" button |

### 2.3 Reduced Motion Support

When `UIAccessibility.isReduceMotionEnabled` is true (checked via `@Environment(\.accessibilityReduceMotion)`):

| Standard Behavior | Reduced Motion Alternative |
|---|---|
| Slide transitions between declaration steps | Cross-dissolve (`opacity` transition) |
| Spring animations on buttons and cards | Instant state change (no animation) |
| Pulsing status node | Static highlighted node with bold ring |
| Confetti on "Termine" status | Static checkmark with green background |
| Map pin bounce on selection | Instant scale to selected size |
| Photo thumbnail slide-in | Instant appear |
| Skeleton shimmer animation | Static grey placeholders |

Implementation: wrap all animations in a check:

```
withAnimation(reduceMotion ? .none : .spring(duration: 0.3)) { ... }
```

Or use the iOS 26 `.animation(.default, body:)` modifier which respects the system setting automatically.

---

## 3. Transition & Animation Spec

### 3.1 Navigation Transitions

iOS 26 introduces enhanced `NavigationTransition` protocol. Carlib uses custom transitions for key flows.

| Transition | Context | SwiftUI API | Duration | Curve |
|---|---|---|---|---|
| **Standard push/pop** | All hierarchical navigation (list to detail, tab content) | Default `NavigationStack` transition (system slide) | 350ms (system) | System spring |
| **Declaration step forward** | Step 1 to 2 to 3 to 4 | `.navigationTransition(.slide)` or custom `AnyNavigationTransition` sliding left | 300ms | `.easeInOut` |
| **Declaration step backward** | Back button within flow | Reverse slide (right) -- system default for `NavigationStack` pop | 300ms | `.easeInOut` |
| **Modal presentation** | Confirmation dialogs, filter sheets, booking confirmation | `.sheet` with system presentation (slide up from bottom) | 350ms (system) | System spring |
| **Full-screen cover** | Photo viewer, camera, login on session expiry | `.fullScreenCover` (system: slide up) | 400ms (system) | System spring |
| **Tab switch** | Bottom tab bar navigation (driver: Accueil/Declarer/Suivi/Profil) | `TabView` with default transition. No animation between tabs. State preserved per tab via `@State` in each tab root. | Instant | N/A |
| **Map-to-list toggle** | D-08/D-09 garage search view mode | Custom: `.transition(.asymmetric(insertion: .opacity, removal: .opacity))` on each view within `if/else` block | 200ms | `.easeInOut` |

### 3.2 Micro-Interaction Animations

#### Photo Capture Sequence (D-03)

| Step | Animation | Properties | Duration | Curve | SwiftUI |
|---|---|---|---|---|---|
| Shutter press | Screen flash (white overlay fading) | `opacity`: 0.6 to 0 | 150ms | `.easeOut` | Overlay `Color.white.opacity(shutterFlash ? 0.6 : 0)` with `withAnimation(.easeOut(duration: 0.15))` |
| Thumbnail slide-in | New thumbnail slides from camera area into strip | `offset.x`: from screen center to strip position; `scale`: 0.3 to 1.0 | 300ms | `.spring(duration: 0.3, bounce: 0.2)` | `.matchedGeometryEffect(id: photoID, in: namespace)` between camera overlay and thumbnail strip |
| Upload progress | Ring fills around thumbnail | `trim(from: 0, to: progress)` on `Circle().stroke()` | Continuous, data-driven | `.linear` | `Circle().trim(from: 0, to: uploadProgress).stroke(lineWidth: 3).animation(.linear, value: uploadProgress)` |
| Upload success | Checkmark appears over thumbnail | `scale`: 0 to 1; `opacity`: 0 to 1 | 400ms | `.spring(duration: 0.4, bounce: 0.3)` | Green checkmark `Image(systemName: "checkmark.circle.fill")` with `.transition(.scale.combined(with: .opacity))` |
| Upload failure | Orange retry badge pulses once | `scale`: 1.0 to 1.2 to 1.0 | 600ms | `.easeInOut` repeating 1x | `.scaleEffect(uploadFailed ? 1.2 : 1.0).animation(.easeInOut(duration: 0.3).repeatCount(2, autoreverses: true))` |

#### Status Change Animation (D-15, G-07)

| Step | Animation | Properties | Duration | Curve | SwiftUI |
|---|---|---|---|---|---|
| Progress bar fill | Bar width extends to next status position | `frame(width:)` animated | 600ms | `.spring(duration: 0.6, bounce: 0.15)` | `GeometryReader` + animated width from model |
| New node appearance | Node scales up from 0 with fade | `scale` + `opacity` | 500ms | `.spring(duration: 0.5, bounce: 0.25)` | `.transition(.scale.combined(with: .opacity))` inside `if status >= .thisStage` block |
| Previous nodes settle | Already-visible nodes get checkmark + color fill | `foregroundStyle` crossfade | 300ms | `.easeInOut` | `.animation(.easeInOut(duration: 0.3), value: currentStatus)` |
| "Termine" celebration | Final node + confetti-like particle burst (or large checkmark) | Custom: `scale` 0 to 1.2 to 1.0 + confetti `EmitterLayer` via `UIViewRepresentable` | 1000ms total | `.spring(duration: 0.5)` for checkmark; linear for particles | Checkmark: `withAnimation(.spring(duration: 0.5, bounce: 0.3))`. Particles: lightweight `Canvas` animation or `TimelineView`. Respects `accessibilityReduceMotion`. |

#### Booking Confirmation (D-14)

| Step | Animation | Duration | Curve |
|---|---|---|---|
| Confirmation card slides up | `.transition(.move(edge: .bottom).combined(with: .opacity))` | 400ms | `.spring(duration: 0.4, bounce: 0.2)` |
| Checkmark draws | `trim(from: 0, to: 1)` on checkmark `Path` | 500ms | `.easeOut` |
| Detail fields fade in sequentially | Stagger: date, then time, then garage name, each 100ms delay | 200ms each, 100ms stagger | `.easeOut` with `.delay(index * 0.1)` |
| "Ajouter au calendrier" CTA appears | `.transition(.opacity)` | 300ms | `.easeIn` after 800ms delay |

#### Bottom Sheet Snap Points

| Detent | Height | Usage |
|---|---|---|
| **Peek** | `.fraction(0.15)` (~120pt) | Map view: shows "X garages disponibles" header |
| **Quarter** | `.fraction(0.35)` (~280pt) | Map view: shows 2-3 garage cards scrollable |
| **Half** | `.medium` (~50%) | Garage detail preview, filter panel |
| **Full** | `.large` | Full garage detail, full list, camera overlay guide |

SwiftUI: `.presentationDetents([.fraction(0.15), .fraction(0.35), .medium, .large])` with `.presentationBackgroundInteraction(.enabled(upThrough: .fraction(0.35)))` to allow map interaction when sheet is in peek/quarter.

#### Card Interactions

| Interaction | Animation | SwiftUI |
|---|---|---|
| Card press/tap | Scale down to 0.97, opacity to 0.9 | Custom `ButtonStyle`: `.scaleEffect(configuration.isPressed ? 0.97 : 1.0).opacity(configuration.isPressed ? 0.9 : 1.0).animation(.easeInOut(duration: 0.1), value: configuration.isPressed)` |
| Card appear in list | Fade in + slight slide up | `.transition(.opacity.combined(with: .move(edge: .bottom)))` with `.animation(.easeOut(duration: 0.25).delay(Double(index) * 0.05))` for staggered list load |
| Swipe action reveal | System default `.swipeActions` animation | System-managed |
| Card deletion | Collapse height + fade | `.transition(.asymmetric(insertion: .slide, removal: .opacity.combined(with: .scale(scale: 0.8))))` |

### 3.3 Matched Geometry Transitions

| Context | Source | Destination | Shared Properties | SwiftUI |
|---|---|---|---|---|
| Garage card in list to garage detail | `GarageCardView` in list | `GarageDetailView` as sheet/push | Photo thumbnail, garage name text | `@Namespace var garageTransition`. Source: `.matchedGeometryEffect(id: garage.id, in: garageTransition)` on photo and name. Destination: same. Wrap in `NavigationLink` with custom `navigationTransition`. |
| Photo thumbnail to full-screen viewer | Small thumbnail in strip | Full-screen `Image` | Image frame, corner radius | `@Namespace var photoNamespace`. Source thumbnail: `.matchedGeometryEffect(id: photo.id, in: photoNamespace)`. Viewer: same. Requires `NavigationTransition` or `.fullScreenCover` coordination. |
| Claim card to claim detail | Card in claims list | Full claim dossier view | Status badge, vehicle type icon | Same pattern with `@Namespace`. |

### 3.4 Performance Budget

| Animation Type | Target FPS | Max Duration | Max Concurrent |
|---|---|---|---|
| Navigation transition | 60fps | 400ms | 1 |
| Spring animations (buttons, cards) | 60fps | 300ms | 3 |
| Skeleton shimmer | 60fps | 1500ms loop (GPU-composited) | Unlimited |
| Progress bar fill | 60fps | 600ms | 1 |
| Photo upload ring | 60fps | Data-driven (continuous) | 5 (one per visible thumbnail) |
| Confetti / particle effect | 60fps | 1000ms | 1 |
| List appear stagger | 60fps | 50ms per item, max 500ms total | 10 items |

All animations use `withAnimation` (main actor) or `.animation` (declarative) to stay on the main thread's composition pipeline. Heavy operations (image processing, network) are `async` on background tasks.

---

## 4. Input Patterns

### 4.1 License Plate (Plaque d'immatriculation)

**French SIV format:** AA-123-AA (2 letters, 3 digits, 2 letters, hyphen-separated)

| Aspect | Specification | SwiftUI Implementation |
|---|---|---|
| **Field type** | Formatted text field with auto-uppercase and auto-hyphen insertion | `TextField("AA-123-AA", text: $plateText).textInputAutocapitalization(.characters).keyboardType(.asciiCapable).onChange(of: plateText) { formatPlate() }` |
| **Formatting logic** | On each keystroke: strip non-alphanumeric, uppercase, insert hyphens at positions 2 and 5 | Custom `formatPlate()` function in view model. Example: "ab123cd" becomes "AB-123-CD". |
| **Validation** | Regex: `^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$`. Validate on field exit (`.onSubmit`) and on "Suivant" tap. | `@State private var plateError: String?`. Red border + error text below on invalid. |
| **Max length** | 9 characters (with hyphens) | `.onChange(of: plateText) { if plateText.count > 9 { plateText = String(plateText.prefix(9)) } }` |
| **OCR fallback** | Button next to field: "Scanner la plaque" opens camera with VisionKit `DataScannerViewController` | `DataScannerViewController` via `UIViewControllerRepresentable`. Scans for `.barcode` and `.text`. On recognized plate text, auto-fills field. |
| **Accessibility** | `.accessibilityLabel("Plaque d'immatriculation, format deux lettres tiret trois chiffres tiret deux lettres")` | On text field |
| **Pre-fill** | If user has saved vehicle in profile, pre-fill from SwiftData `@Query` | Automatic on step load |

### 4.2 Phone Number (Numero de telephone)

**French format:** +33 6 XX XX XX XX or 06 XX XX XX XX

| Aspect | Specification | SwiftUI Implementation |
|---|---|---|
| **Field type** | Numeric field with +33 prefix and space formatting | `TextField("6 12 34 56 78", text: $phoneText).keyboardType(.phonePad)`. Prefix "+33" shown as non-editable `Text` to the left of the field. |
| **Formatting** | Auto-insert spaces every 2 digits after the leading digit. "612345678" displays as "6 12 34 56 78". | `onChange(of: phoneText) { formatPhone() }` strips spaces, re-inserts at correct positions. |
| **Validation** | 9 digits after country code. Must start with 6 or 7 (mobile). Regex: `^[67][0-9]{8}$` on stripped input. | Inline error: "Numero de mobile invalide." |
| **Auto-detect** | No auto-detect from SIM. User enters manually. | -- |
| **Accessibility** | `.accessibilityLabel("Numero de telephone mobile francais")` `.keyboardType(.phonePad)` | Standard |

### 4.3 Address (Adresse)

**MapKit Search Completer for French addresses.**

| Aspect | Specification | SwiftUI Implementation |
|---|---|---|
| **Autocomplete** | As user types, suggest French addresses using `MKLocalSearchCompleter` | Custom `@Observable AddressSearchModel` wrapping `MKLocalSearchCompleter`. `completer.resultTypes = .address`. `completer.region` set to France bounding box. |
| **Debounce** | 300ms debounce on keystroke before triggering completer | `.onChange(of: addressText) { ... }` with `Task.cancel()` / `Task.sleep(for: .milliseconds(300))` pattern |
| **Results display** | Dropdown list below text field showing matched addresses | `List` overlay (using `.overlay` or `ZStack`) with `ForEach(completer.results)`. Each row shows street + city. |
| **Selection** | Tap result to select. Field fills with full address. Map pin updates. | `onTapGesture` sets `selectedAddress`, triggers `MKLocalSearch` to get `CLLocationCoordinate2D`, updates `@Binding` for map pin. |
| **Bidirectional sync** | Dragging map pin reverse-geocodes to address. Typing address forward-geocodes to pin. | `CLGeocoder().reverseGeocodeLocation()` on pin drag end. `MKLocalSearch` on address selection. |
| **Fallback** | If completer fails, user can type freeform address. | Text field always editable. Completer results are suggestions, not requirements. |
| **Locale** | `completer.language = "fr"` to prefer French results | Set on completer initialization |

### 4.4 SIRET (Numero SIRET)

**French business identification: 14 digits (SIREN 9 digits + NIC 5 digits).**

| Aspect | Specification | SwiftUI Implementation |
|---|---|---|
| **Field type** | Numeric, 14 digits, formatted as XXX XXX XXX XXXXX | `TextField("XXX XXX XXX XXXXX", text: $siretText).keyboardType(.numberPad)` |
| **Formatting** | Spaces after digits 3, 6, 9 for readability | `onChange(of: siretText) { formatSIRET() }` |
| **Validation (client)** | Luhn algorithm on SIREN portion (first 9 digits). Length = 14 digits. | Client-side: immediate red border if length wrong or Luhn fails. |
| **Validation (server)** | API call to INSEE/SIRENE API to verify business exists and is active | `async` call on field exit or "Valider" button. Shows spinner on field. On failure: "SIRET non trouve dans le registre officiel." |
| **Accessibility** | `.accessibilityLabel("Numero SIRET a 14 chiffres de votre entreprise")` | On text field |

### 4.5 Date/Time Pickers

| Context | Component | SwiftUI Implementation |
|---|---|---|
| **Accident date** (Declaration step 4) | Date picker, defaults to today, max = today, min = today - 30 days | `DatePicker("Date de l'accident", selection: $accidentDate, in: ...Date.now, displayedComponents: .date).datePickerStyle(.compact).environment(\.locale, Locale(identifier: "fr_FR"))` |
| **Accident time** (Declaration step 4) | Time picker, optional, defaults to current time | `DatePicker("Heure approximative", selection: $accidentTime, displayedComponents: .hourAndMinute)` |
| **Booking slot** (D-12/D-13) | Custom slot picker (not native DatePicker) -- see Section 10 | Custom grid of `Button` chips per available time slot |
| **Availability management** (G-10) | Start/end time pickers for defining available ranges | Two `DatePicker` with `.datePickerStyle(.wheel)` in a `.sheet`, for start and end time. Validated: end > start. |

All pickers use `.environment(\.locale, Locale(identifier: "fr_FR"))` and `.environment(\.calendar, Calendar(identifier: .gregorian))`.

### 4.6 Photo Capture

Detailed in Section 8. Summary of APIs:

| API | Usage |
|---|---|
| `PhotosUI.PhotosPicker` | Gallery import fallback. Multi-selection. `.filter(.images)`. |
| `AVFoundation` camera via `UIViewControllerRepresentable` | Custom camera with overlay guides. Not `PhotosPicker` or `UIImagePickerController` -- those lack overlay capability. |
| `VisionKit.DataScannerViewController` | License plate OCR (optional). |
| `SwiftUI.TransferRepresentation` / `PhotosPickerItem.loadTransferable(type: Data.self)` | Async image loading from picker results. |

### 4.7 Form Keyboard Management

| Aspect | Implementation |
|---|---|
| **Focus management** | `@FocusState private var focusedField: FormField?` enum with a case per field. Toolbar "Suivant"/"Precedent" buttons to advance focus. |
| **Keyboard avoidance** | System default in SwiftUI (auto-scrolls for focused field). Additional: `.scrollDismissesKeyboard(.interactively)` on `ScrollView`. |
| **Keyboard dismiss** | Toolbar "OK" button: `.toolbar { ToolbarItemGroup(placement: .keyboard) { Spacer(); Button("OK") { focusedField = nil } } }` |
| **Return key** | `.submitLabel(.next)` on intermediate fields, `.submitLabel(.done)` on last field. `.onSubmit { advanceFocus() }` |

---

## 5. Haptic Feedback Map

All haptics use the UIKit feedback generators called from SwiftUI via wrapper functions. Haptics respect the system "System Haptics" setting automatically.

### 5.1 Haptic Generator Types

| Generator | SwiftUI Invocation | Character |
|---|---|---|
| `UIImpactFeedbackGenerator(style: .light)` | Subtle physical touch. Confirms a minor interaction. | Taps, thresholds, selections. |
| `UIImpactFeedbackGenerator(style: .medium)` | Moderate physical feedback. Confirms a meaningful action. | Long-press activation, status changes. |
| `UIImpactFeedbackGenerator(style: .heavy)` | Strong physical feedback. Emphasizes critical moments. | Errors requiring attention. |
| `UINotificationFeedbackGenerator` `.notificationOccurred(.success)` | System success pattern. | Booking confirmed, claim submitted, status "Termine". |
| `UINotificationFeedbackGenerator` `.notificationOccurred(.warning)` | System warning pattern. | Slot conflict, approaching deadline. |
| `UINotificationFeedbackGenerator` `.notificationOccurred(.error)` | System error pattern. | Submission failure, network error on critical action. |
| `UISelectionFeedbackGenerator` `.selectionChanged()` | Very subtle tick. | Scrolling through options, picker changes, filter toggle. |

### 5.2 Action-to-Haptic Mapping

#### Driver Flow

| User Action | Haptic | Rationale |
|---|---|---|
| Select accident type (Step 1) | `selection.selectionChanged()` | Subtle confirmation of selection |
| Photo captured (shutter) | `impact.light` | Mimics physical camera shutter |
| Photo upload complete | `impact.light` | Background event, subtle confirmation |
| Photo upload failed | `notification.warning` | Draws attention to retry needed |
| Form field validation error | `notification.error` | Emphasizes correction needed |
| "Suivant" between declaration steps | `impact.light` | Confirms forward progress |
| Claim submitted successfully | `notification.success` | Major milestone -- satisfying confirmation |
| Claim submission failed | `notification.error` | Critical failure, user must act |
| Garage selected on map (pin tap) | `selection.selectionChanged()` | Subtle selection feedback |
| Garage list card tapped | `impact.light` | Navigation feedback |
| Booking slot selected | `selection.selectionChanged()` | Selection among options |
| Booking confirmed | `notification.success` | Major milestone |
| Booking conflict (slot taken) | `notification.error` | Frustrating moment, acknowledge it |
| Pull-to-refresh threshold reached | System default (built into `.refreshable`) | System standard |
| Status change received (in-app) | `impact.medium` | Important update, moderate emphasis |
| Repair "Termine" notification | `notification.success` | Celebratory moment |

#### Garage Flow

| User Action | Haptic | Rationale |
|---|---|---|
| New claim appears in list | `impact.medium` | Revenue opportunity, get attention |
| "Accepter" dossier confirmed | `notification.success` | Successful business action |
| "Accepter" race condition (already taken) | `notification.error` | Frustrating, acknowledge it |
| "Refuser" dossier confirmed | `impact.light` | Minor action, subtle feedback |
| Calendar slot created (tap or drag release) | `impact.light` | Confirming creation |
| Calendar slot blocked | `impact.medium` | More significant than creation |
| Status advanced to next step | `notification.success` | Forward progress in repair |
| Status update failed | `notification.error` | Critical -- driver not notified |
| Status undo triggered (within 5s window) | `impact.medium` | Regression action, moderate feedback |
| Planning sync completed | `impact.light` | Background event, subtle |
| Long-press on calendar slot | `impact.medium` | Context menu activation |

### 5.3 Implementation Pattern

```
// Centralized haptic manager
@Observable class HapticManager {
    func impact(_ style: UIImpactFeedbackGenerator.FeedbackStyle) {
        let generator = UIImpactFeedbackGenerator(style: style)
        generator.prepare()
        generator.impactOccurred()
    }
    
    func notification(_ type: UINotificationFeedbackGenerator.FeedbackType) {
        let generator = UINotificationFeedbackGenerator()
        generator.prepare()
        generator.notificationOccurred(type)
    }
    
    func selection() {
        let generator = UISelectionFeedbackGenerator()
        generator.prepare()
        generator.selectionChanged()
    }
}
```

Injected via `@Environment(HapticManager.self)` and called inline with `withAnimation` blocks.

---

## 6. Real-Time & Push Notification Design

### 6.1 Push Notification Content Matrix

All notifications are in French. Content follows Apple's guidelines: title (bold, short), body (1-2 sentences), optional subtitle.

| Event | Recipient | Category ID | Title | Body | Actions | Deep Link |
|---|---|---|---|---|---|---|
| Claim submitted | Driver | `claim_submitted` | "Sinistre declare" | "Votre dossier #{ref} a ete soumis. Vous serez notifie des que un garage le prendra en charge." | -- | D-15 (status tracking) |
| New claim in zone | Garage | `new_claim` | "Nouveau sinistre" | "{damage_type} -- {vehicle_type} a {distance}km de votre atelier." | "Voir le dossier" / "Ignorer" | G-03 (claim detail) |
| Claim accepted by garage | Driver | `claim_accepted` | "Dossier pris en charge" | "{garage_name} a accepte votre dossier. Reservez votre creneau de depot." | "Reserver un creneau" / "Voir les details" | D-12 (booking) |
| Booking confirmed | Driver | `booking_confirmed` | "Rendez-vous confirme" | "Le {date} a {time} chez {garage_name}, {address}." | "Ajouter au calendrier" / "Voir le recap" | D-14 (booking confirmation) |
| Booking confirmed | Garage | `booking_received` | "Nouvelle reservation" | "{driver_name} -- {vehicle_type}, le {date} a {time}." | "Voir le planning" | G-09 (day detail) |
| Booking reminder (24h) | Driver | `booking_reminder` | "Rappel rendez-vous" | "Demain a {time} chez {garage_name}. N'oubliez pas vos documents." | "Voir le recap" / "Modifier" | D-14 |
| Status: Pris en charge | Driver | `status_pris_en_charge` | "Vehicule pris en charge" | "Votre vehicule est desormais chez {garage_name}." | "Suivre la reparation" | D-15 |
| Status: En reparation | Driver | `status_en_reparation` | "Reparation en cours" | "La reparation de votre vehicule a commence chez {garage_name}." | "Suivre la reparation" | D-15 |
| Status: Termine | Driver | `status_termine` | "Vehicule pret !" | "La reparation est terminee. Contactez {garage_name} pour recuperer votre vehicule." | "Appeler le garage" / "Voir les details" | D-15 (completion state) |
| Claim expired | Driver | `claim_expired` | "Dossier sans reponse" | "Aucun garage n'a accepte votre dossier. Souhaitez-vous elargir la recherche ?" | "Elargir la recherche" / "Contacter le support" | D-08 (garage search, wider radius) |
| Booking cancelled by garage | Driver | `booking_cancelled` | "Rendez-vous annule" | "{garage_name} a annule votre rendez-vous du {date}. Choisissez un nouveau creneau." | "Nouveau creneau" | D-12 |

### 6.2 Interactive Notification Actions

Defined via `UNNotificationCategory` and `UNNotificationAction` in `AppDelegate` or app init.

```
// Category: new_claim (Garage)
UNNotificationCategory(
    identifier: "new_claim",
    actions: [
        UNNotificationAction(identifier: "view_claim", title: "Voir le dossier", options: .foreground),
        UNNotificationAction(identifier: "dismiss_claim", title: "Ignorer", options: .destructive)
    ],
    intentIdentifiers: []
)

// Category: status_termine (Driver)
UNNotificationCategory(
    identifier: "status_termine",
    actions: [
        UNNotificationAction(identifier: "call_garage", title: "Appeler le garage", options: .foreground),
        UNNotificationAction(identifier: "view_details", title: "Voir les details", options: .foreground)
    ],
    intentIdentifiers: []
)

// Category: booking_confirmed (Driver)
UNNotificationCategory(
    identifier: "booking_confirmed",
    actions: [
        UNNotificationAction(identifier: "add_calendar", title: "Ajouter au calendrier", options: .foreground),
        UNNotificationAction(identifier: "view_recap", title: "Voir le recap", options: .foreground)
    ],
    intentIdentifiers: []
)
```

### 6.3 Live Activities for Repair Tracking

Live Activities (via ActivityKit) provide persistent, glanceable repair status on the Lock Screen and Dynamic Island.

**When active:** From the moment a garage accepts a claim until repair is marked "Termine" (or 1 hour after "Termine" to allow pickup coordination).

| Live Activity Element | Content | Update Trigger |
|---|---|---|
| **Compact leading** (Dynamic Island) | Car icon SF Symbol `car.side` | Static |
| **Compact trailing** (Dynamic Island) | Current status abbreviated: "En att." / "Pris" / "Rep." / "Pret" | Push token update |
| **Expanded** (Dynamic Island) | Garage name + current status + time since last update | Push token update |
| **Lock Screen widget** | 4-step progress bar (same as D-15). Garage name. Last update timestamp. | Push token update |
| **Lock Screen expanded** (tap) | Full status detail: step descriptions, garage contact button, estimated time if available | Push token update |

**SwiftUI implementation:**

```
// ActivityAttributes
struct RepairTrackingAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var currentStatus: RepairStatus    // .enAttente, .prisEnCharge, .enReparation, .termine
        var garageName: String
        var lastUpdate: Date
        var estimatedCompletion: Date?
    }
    var claimReference: String
    var vehicleDescription: String
}

// Start activity on claim acceptance
let activity = try Activity.request(
    attributes: attributes,
    content: .init(state: initialState, staleDate: nil),
    pushType: .token
)

// Update via push notification (server sends to activity push token)
```

**Stale handling:** If no update received in 24 hours, Live Activity shows "Derniere mise a jour il y a {time}" in dimmed text. System may dismiss after 8 hours of staleness.

### 6.4 Background App Refresh

| Task | Trigger | Action | SwiftUI/API |
|---|---|---|---|
| Status poll | `BGAppRefreshTask` scheduled every 15 min when claim is active | Fetch latest claim status from API. If changed, post local notification (if push missed). Update SwiftData cache. | `BGTaskScheduler.shared.register(forTaskWithIdentifier:)` in App init. `scheduleAppRefresh()` after each fetch. |
| Queued upload retry | `BGProcessingTask` when network available | Retry failed photo uploads and queued claim submissions from offline mode. | `BGProcessingTask` with `.requiresNetworkConnectivity = true`. |
| Claim list refresh (garage) | `BGAppRefreshTask` every 30 min | Fetch new claims in zone. Badge app icon if new claims available. | `UNUserNotificationCenter.setBadgeCount()` |
| Calendar sync (garage) | `BGProcessingTask` | Sync local calendar changes (created offline) with server. | Merge SwiftData local changes with server state. |

### 6.5 In-App Notification Handling

When a push arrives while the app is in the foreground:

| Context | Behavior | SwiftUI Implementation |
|---|---|---|
| User on any screen except the relevant one | In-app banner at top of screen. Auto-dismisses in 5 seconds. Tap navigates to relevant screen. | Custom `NotificationBannerView` shown via `.safeAreaInset(edge: .top)` on the root view, controlled by `@Observable NotificationManager`. |
| User already on the relevant screen | No banner. Data updates in-place with animation (e.g., status timeline gets new node). Subtle haptic (`impact.medium`). | Model updates via `@Observable`. SwiftUI diffing handles UI update. `withAnimation(.spring)` wraps model mutation. |
| User in a modal/sheet | Banner overlays the modal. Tap dismisses modal first, then navigates. | `overlay` on `WindowGroup` root, above sheet layer. |

Implementation uses `UNUserNotificationCenterDelegate.userNotificationCenter(_:willPresent:)` returning `.banner` for system banner, or suppressing and showing custom in-app UI.

---

## 7. Error Handling Interaction Patterns

### 7.1 Error Classification and Presentation

| Error Type | Severity | Presentation Pattern | SwiftUI API | Duration |
|---|---|---|---|---|
| **Inline validation** | Low | Red text below the field. Red border on field. | `Text(errorMessage).foregroundStyle(.red).font(.caption)` below `TextField`. Field border: `.overlay(RoundedRectangle().stroke(hasError ? .red : .clear))` | Persistent until corrected |
| **Field-level server error** | Medium | Same as inline, but triggered after async call | Same visual. Set `@State var fieldError: String?` in async completion. | Persistent until corrected or retried |
| **Action failure (toast)** | Medium | Toast/snackbar at bottom of screen. Auto-dismisses. Optional retry action. | Custom `ToastView` shown via `.safeAreaInset(edge: .bottom)` controlled by `@State var toast: ToastMessage?`. Auto-dismiss via `Task.sleep(for: .seconds(4))`. | 4 seconds (action toast: until dismissed) |
| **Blocking error (alert)** | High | System alert dialog. Title + message + action buttons. | `.alert(title, isPresented: $showAlert) { Button("Reessayer") { retry() }; Button("Annuler", role: .cancel) { } } message: { Text(errorDetail) }` | Until user acts |
| **Full-screen error** | Critical | Full screen replacement of content. Illustration + title + description + retry CTA. | `ContentUnavailableView { Label("Service indisponible", systemImage: "wifi.slash") } description: { Text("...") } actions: { Button("Reessayer") { ... } }` | Until resolved |
| **Persistent banner** | Info/Warning | Non-dismissible bar at top of screen. | `.safeAreaInset(edge: .top) { BannerView("Pas de connexion") }` controlled by `@Environment(NetworkMonitor.self)` | Until condition resolves |

### 7.2 Network Error Patterns

| Scenario | Detection | UI Pattern | Recovery |
|---|---|---|---|
| **Complete offline** | `NWPathMonitor` reports `.unsatisfied` | Top banner: orange background, "Pas de connexion internet" with wifi.slash icon. All write actions queue locally. Read shows cached data. | Auto-dismiss banner when connectivity returns. Queued actions sync automatically. Toast: "Connexion retablie. Synchronisation en cours..." |
| **Request timeout** (single) | URLSession timeout (15s default) | Toast: "La requete a expire. Reessayer?" with retry action button. | Tap retry re-issues request. |
| **Intermittent connection** | 3+ timeouts in 60 seconds | Banner: "Connexion instable" (yellow). Automatic exponential backoff. | Self-healing. Banner clears after 2 consecutive successful requests. |
| **Server error (5xx)** | HTTP 500-599 | If partial data available: show cached + error toast. If no data: full-screen `ContentUnavailableView`. | "Reessayer" button. Auto-retry after 30s, 60s, 120s (exponential). |
| **API version mismatch (426)** | HTTP 426 | Non-dismissible full-screen: "Mise a jour requise" + App Store button. | `UIApplication.shared.open(appStoreURL)` |

### 7.3 Form Validation Error Flow

**Timing:** Validation runs on two triggers:
1. **On field exit** (`.onSubmit` or focus change via `@FocusState`): validates individual field.
2. **On "Suivant" / "Soumettre" tap**: validates all fields. Scrolls to first error.

**Scroll to first error:** `ScrollViewReader` with `.scrollTo(firstErrorFieldID, anchor: .center)` + set `@FocusState` to that field.

**Error clearing:** Error disappears immediately when user begins editing the field (`onChange(of: fieldValue) { clearError(for: field) }`).

**Visual states per field:**

| State | Border Color | Helper Text | Icon |
|---|---|---|---|
| Default | `color.border.default` (grey) | Hint text in grey | None |
| Focused | `color.primary` (blue) | Hint text in grey | None |
| Valid | `color.success` (green) | "Valide" in green (optional, only on key fields like plate/SIRET) | Checkmark |
| Error | `color.error` (red) | Error message in red | Exclamation triangle |
| Disabled | `color.border.default` at 50% opacity | N/A | None |

### 7.4 Error Copy Guidelines (French)

All error messages follow a pattern: **What happened** + **What to do**.

| Error Type | Pattern | Example |
|---|---|---|
| Required field | "Ce champ est obligatoire." | "Ce champ est obligatoire." |
| Format error | "{Champ} : format invalide. {Format attendu}." | "Plaque : format invalide. Attendu : AA-123-AA." |
| Network on action | "Echec de {action}. Verifiez votre connexion et reessayez." | "Echec de l'envoi. Verifiez votre connexion et reessayez." |
| Conflict (race condition) | "{Ressource} n'est plus disponible. {Alternative}." | "Ce creneau n'est plus disponible. Choisissez un autre horaire." |
| Server error | "Service temporairement indisponible. Reessayez dans quelques instants." | Same |
| Permission denied | "Carlib a besoin de {permission} pour {purpose}. {Action}." | "Carlib a besoin de votre appareil photo pour documenter le sinistre. Ouvrir les reglages?" |

### 7.5 Retry Patterns

| Pattern | When Used | Implementation |
|---|---|---|
| **Immediate retry** (button) | Single request failure (submit claim, book slot, update status) | `Button("Reessayer") { Task { await retryAction() } }` in alert or toast |
| **Auto-retry with backoff** | Network recovery, background sync | `for delay in [1, 2, 4, 8, 16] { try await Task.sleep(for: .seconds(delay)); try await action(); break }` |
| **Queued retry** | Offline writes (photo upload, claim submission, status update) | SwiftData `@Model` with `syncStatus: .pending`. Background task processes queue on connectivity. |
| **Pull-to-refresh retry** | List/data reload after error | `.refreshable { await model.refresh() }` -- same as normal refresh, also handles error recovery |

---

## 8. Photo Capture Flow

### 8.1 Overview

The photo capture flow (Declaration Step 2) is the most interaction-intensive part of the driver experience. It must work under post-accident stress: large targets, clear guidance, forgiving of mistakes, and resilient to poor connectivity.

### 8.2 Capture Sequence (4-Step Guided)

| Step | Label (French) | Camera Overlay | Guidance Text |
|---|---|---|---|
| 1 | "Vue avant" | Semi-transparent car silhouette (front view) centered in viewfinder | "Photographiez l'avant de votre vehicule" |
| 2 | "Vue arriere" | Car silhouette (rear view) | "Photographiez l'arriere de votre vehicule" |
| 3 | "Vue laterale" | Car silhouette (side view) | "Photographiez le cote endommage" |
| 4 | "Detail des degats" | Magnifying glass icon / zoom frame | "Photographiez les degats de pres" |
| 5+ | "Photo supplementaire" | No overlay (free capture) | "Ajoutez d'autres photos si necessaire" |

**Minimum required:** 1 photo (to allow submission in difficult conditions).
**Recommended:** 4 photos (guided steps).
**Maximum:** 10 photos.

### 8.3 Camera Implementation

**Why not `PhotosPicker` or `UIImagePickerController`:** Neither supports custom camera overlays (the car silhouette guide). A custom `AVCaptureSession` via `UIViewControllerRepresentable` is required.

| Component | Implementation |
|---|---|
| **Camera preview** | `AVCaptureVideoPreviewLayer` wrapped in `UIViewRepresentable`. Fills screen below the guidance area. |
| **Overlay guide** | SwiftUI `overlay` on the camera view. Semi-transparent `Image` of car silhouette. `@State var currentStep: PhotoStep` controls which silhouette. `.opacity(0.3)` for non-intrusive guide. |
| **Capture button** | Large (80pt diameter) circle button at bottom center. `Button` with custom style. `.frame(width: 80, height: 80)`. White ring with inner circle that scales on press. |
| **Flash toggle** | Top-left: `Button` with `bolt.fill` / `bolt.slash.fill` SF Symbols. Toggles `AVCaptureDevice.torchMode`. |
| **Close / cancel** | Top-right: "X" button. Dismisses camera. Draft photos preserved. |
| **Thumbnail strip** | Bottom horizontal strip: `ScrollView(.horizontal)` with captured photo thumbnails. Green checkmark overlay on completed steps. Tappable to review. |
| **Progress indicator** | Row of dots above thumbnail strip. Filled = captured, outlined = remaining. `ForEach(photoSteps)` with circle views. |
| **Shutter feedback** | On capture: white flash overlay (150ms), haptic (`impact.light`), system shutter sound (unless muted). |

### 8.4 Photo Review Sub-Flow

Triggered by tapping a thumbnail in the strip, or automatically after capture if quality check is enabled.

| Element | Behavior | SwiftUI |
|---|---|---|
| **Full-screen preview** | Photo fills screen. Pinch-to-zoom enabled (`MagnifyGesture`). | `Image(uiImage:).resizable().scaledToFit()` with `MagnifyGesture` and `DragGesture` for pan while zoomed. |
| **"Reprendre" button** | Bottom-left. Returns to camera at the same step. Previous photo discarded. | `Button("Reprendre") { retakePhoto(for: step) }` |
| **"Valider" button** | Bottom-right. Confirms photo. Advances to next step. | `Button("Valider") { confirmPhoto(); advanceStep() }` |
| **Blur warning** (optional) | If client-side blur detection triggers (using `CIFilter` or Vision framework), yellow banner: "Cette photo semble floue." | Banner above buttons with "Reprendre" emphasized. Not blocking -- user can still validate. |
| **Dismiss** | Swipe down to dismiss review, keep photo. | `.gesture(DragGesture().onEnded { if $0.translation.height > 100 { dismissReview() } })` or use `fullScreenCover` default dismiss. |

### 8.5 Upload Behavior

| Aspect | Specification |
|---|---|
| **Timing** | Upload begins immediately after each photo is confirmed. Background upload. User can continue capturing next photo. |
| **Compression** | JPEG at 0.7 quality. Max dimension 2048px (longer edge). Estimated size: 200-500KB per photo. |
| **Progress** | Circular progress ring around thumbnail: `Circle().trim(from: 0, to: progress).stroke()`. Animated with `.animation(.linear, value: progress)`. |
| **Success** | Progress ring completes. Green checkmark overlay fades in (`.transition(.opacity)`). |
| **Failure** | Orange badge with retry icon. Tapping thumbnail shows option: "Reessayer l'envoi" / "Supprimer". |
| **Offline** | Photos saved locally (SwiftData `@Model` with image `Data`). Queued for upload. "En attente d'envoi" label on thumbnails. Upload resumes on connectivity. |
| **Concurrent uploads** | Max 2 concurrent uploads (to avoid bandwidth saturation on mobile). Queue managed by `TaskGroup` with `maxConcurrentTasks: 2`. |

### 8.6 Gallery Import Alternative

| Element | SwiftUI |
|---|---|
| **Trigger** | "Importer depuis la galerie" button below the capture area (always visible) OR presented when camera permission denied. |
| **Picker** | `PhotosPicker(selection: $selectedPhotos, maxSelectionCount: 10 - capturedCount, matching: .images)` |
| **Post-selection** | Selected photos appear in thumbnail strip. No guided overlay (since photos already taken). Upload begins immediately. |
| **Smart suggestion** | If camera permission granted, also show "Photos recentes" (last 30 minutes) as suggestion chips above the gallery button. Uses `PHAsset` fetch with date filter. |

### 8.7 Accessibility for Photo Capture

| Requirement | Implementation |
|---|---|
| **VoiceOver** | Capture button: `.accessibilityLabel("Prendre une photo. Etape \(currentStep) sur \(totalSteps): \(stepDescription)")`. Thumbnail: `.accessibilityLabel("Photo \(index). \(uploaded ? "Envoyee" : "En cours d'envoi")")`. |
| **Reduced motion** | No shutter flash animation. Instant thumbnail appearance (no slide-in). |
| **Motor accessibility** | Large capture button (80pt). No required gestures -- all actions are tappable buttons. Review accessible via tap, not swipe. |
| **Low vision** | High-contrast overlay guides (white silhouette on dark semi-transparent background). Large guidance text (18pt minimum). |

---

## 9. Map Interaction

### 9.1 MapKit for SwiftUI (iOS 26)

Carlib uses the native SwiftUI `Map` view (introduced iOS 17, enhanced in iOS 26). No third-party map libraries.

### 9.2 Map View Architecture (D-08)

```
Map(position: $cameraPosition, interactionModes: .all) {
    // User location
    UserAnnotation()
    
    // Garage annotations
    ForEach(garages) { garage in
        Annotation(garage.name, coordinate: garage.coordinate) {
            GarageMapPin(garage: garage, isSelected: selectedGarage?.id == garage.id)
        }
    }
    
    // Route preview (if garage selected)
    if let route = selectedRoute {
        MapPolyline(route.polyline)
            .stroke(.blue, lineWidth: 5)
    }
}
.mapStyle(.standard(elevation: .flat, pointsOfInterest: .excludingAll))
.mapControls {
    MapUserLocationButton()
    MapCompass()
    MapScaleView()
}
```

### 9.3 Map Interactions

| Interaction | Gesture | Behavior | SwiftUI API |
|---|---|---|---|
| **Pan** | `DragGesture` (system) | Standard map pan. Map loads new tiles as needed. | Built into `Map` `interactionModes: .all` |
| **Zoom** | Pinch (`MagnifyGesture`, system) | Standard zoom. At low zoom: garage pins cluster. At high zoom: individual pins. | Built into `Map`. Clustering via `MapAnnotation` grouping logic. |
| **Double-tap zoom** | `.onTapGesture(count: 2)` (system) | Zooms in 2x centered on tap point. | Built into `Map` |
| **Tap garage pin** | `onTapGesture` on `Annotation` content view | Pin enlarges/highlights. Bottom sheet slides to quarter detent showing garage preview card. Map camera animates to center on pin. | `withAnimation(.spring) { selectedGarage = garage; cameraPosition = .camera(MapCamera(centerCoordinate: garage.coordinate, distance: 2000)) }`. Sheet detent changes. |
| **Tap empty map** | Background tap | Deselects current garage. Bottom sheet returns to peek. | `@State var selectedGarage: Garage? = nil`. Sheet detent adjusts. |
| **Recenter on user** | `MapUserLocationButton` tap | Camera animates to user location. | System `MapUserLocationButton()` control. |
| **List-map sync** | Tap garage card in bottom sheet list | Map camera animates to that garage pin. Pin highlights. | `withAnimation { cameraPosition = .camera(...); selectedGarage = garage }` |

### 9.4 Garage Map Pin Design

| State | Visual | Size |
|---|---|---|
| **Default** | Circular pin with garage icon. Color indicates availability: green (available soon), orange (limited), grey (unavailable). | 32pt diameter |
| **Selected** | Enlarged pin with garage name label below. Blue ring. Slight bounce animation on selection. | 44pt diameter + label |
| **Cluster** | Circle with count number. Color = blended availability of grouped garages. | 36pt diameter |

Pin view is a custom SwiftUI view used as `Annotation` content:

```
struct GarageMapPin: View {
    let garage: Garage
    let isSelected: Bool
    
    var body: some View {
        Circle()
            .fill(availabilityColor)
            .frame(width: isSelected ? 44 : 32, height: isSelected ? 44 : 32)
            .overlay(Image(systemName: "wrench.and.screwdriver").foregroundStyle(.white))
            .shadow(radius: isSelected ? 4 : 2)
            .animation(.spring(duration: 0.3), value: isSelected)
    }
}
```

### 9.5 Map + List Toggle

| Element | Implementation |
|---|---|
| **Toggle control** | `Picker("Vue", selection: $viewMode) { Text("Carte").tag(GarageViewMode.map); Text("Liste").tag(GarageViewMode.list) }.pickerStyle(.segmented)` placed in the navigation bar or above the content area. |
| **Transition** | `if viewMode == .map { MapView().transition(.opacity) } else { ListView().transition(.opacity) }` with `withAnimation(.easeInOut(duration: 0.2))` on viewMode change. |
| **State preservation** | Selected garage persists across toggle. Scroll position in list preserved via `@State`. Map camera position preserved via `@State`. |

### 9.6 Filter Sheet

Presented as a `.sheet` with `.presentationDetents([.medium])` from a filter button in the toolbar.

| Filter | Type | SwiftUI Component |
|---|---|---|
| **Distance** | Slider: 5km / 10km / 20km / 50km | `Slider(value: $maxDistance, in: 5...50, step: 5)` with distance labels. Or segmented: `Picker` with `.pickerStyle(.segmented)`. |
| **Disponibilite** | Toggle: "Disponible cette semaine" | `Toggle("Disponible cette semaine", isOn: $availableThisWeek)` |
| **Type de reparation** | Multi-select chips | `FlowLayout` (custom or `Layout` protocol) with toggleable chip buttons matching specialties. |
| **Tri** | Single-select: distance / disponibilite / nom | `Picker("Trier par", selection: $sortBy) { ... }` |

Active filters shown as removable chips below the navigation bar: `ScrollView(.horizontal) { HStack { ForEach(activeFilters) { FilterChipView(filter, onRemove: { ... }) } } }`.

### 9.7 Route Preview

When a garage is selected and the driver considers booking:

| Element | Implementation |
|---|---|
| **Trigger** | Tap "Itineraire" on garage detail card |
| **Route calculation** | `MKDirections.Request` with source = user location, destination = garage coordinate. `transportType = .automobile`. |
| **Display** | `MapPolyline(route.polyline).stroke(.blue, lineWidth: 5)` overlaid on map. |
| **Info** | Estimated time + distance shown in a card overlay at bottom: "15 min -- 8 km". |
| **Open in Maps** | "Ouvrir dans Plans" button: `MKMapItem(placemark:).openInMaps(launchOptions: [MKLaunchOptionsDirectionsModeKey: MKLaunchOptionsDirectionsModeDriving])` |

### 9.8 Declaration Location Map (D-05)

| Element | Implementation |
|---|---|
| **Initial state** | Map centered on user's current location (if GPS available) or center of France (if not). Draggable pin at center. |
| **Pin drag** | `MapAnnotation` with `DragGesture`. On drag end: reverse geocode to update address field. Haptic: `selection.selectionChanged()` on drag start. |
| **Address sync** | Bidirectional: address text field uses `MKLocalSearchCompleter` (Section 4.3). Selecting an address moves pin. Moving pin updates address. |
| **GPS indicator** | If GPS active: blue pulsing dot for user position. If GPS unavailable: no dot, manual placement required. |

---

## 10. Calendar & Booking Interaction

### 10.1 Driver Booking Flow (D-12 / D-13)

#### Date Selection Strip

A horizontally scrollable strip of date cells showing the next 14+ days.

| Element | Implementation |
|---|---|
| **Container** | `ScrollView(.horizontal, showsIndicators: false)` with `LazyHStack(spacing: 8)`. |
| **Date cell** | Custom view: day name abbreviation (lun./mar./mer.) + day number. Size: 52x68pt. |
| **Today** | Highlighted ring in primary color. "Aujourd'hui" label below strip. |
| **Date with availability** | Green dot indicator below date number. Tappable. |
| **Date without availability** | No dot. Grey text. Tappable (shows "Aucun creneau" message). |
| **Past dates** | Not shown (strip starts at today). |
| **Navigation** | Horizontal scroll. `.scrollTargetBehavior(.viewAligned)` for snap-to-cell behavior. |
| **Selected date** | Filled primary color background. White text. `@State var selectedDate: Date`. |

#### Time Slot Grid

Below the date strip, showing available slots for the selected date.

| Element | Implementation |
|---|---|
| **Container** | `ScrollView(.vertical)` with `LazyVGrid(columns: [GridItem(.adaptive(minimum: 100))], spacing: 12)`. Two columns of slot chips. |
| **Available slot** | Chip/card: "09:00 - 10:00". Primary color outline. Tappable. `Button` with chip style. |
| **Unavailable slot** | Grey chip. Strikethrough or muted text. `.disabled(true)`. |
| **Selected slot** | Primary color filled background. White text. Checkmark icon. `@State var selectedSlot: TimeSlot?`. Haptic: `selection.selectionChanged()`. |
| **No slots for day** | `ContentUnavailableView("Aucun creneau disponible", systemImage: "calendar.badge.exclamationmark")` with "Jour suivant" CTA. |
| **Morning/Afternoon grouping** | `Section("Matin") { ... } Section("Apres-midi") { ... }` headers. |

#### Confirmation Flow

| Step | UI | Trigger |
|---|---|---|
| **CTA appears** | "Confirmer la reservation" button at bottom. `.safeAreaInset(edge: .bottom)`. Enabled only when date + slot selected. | `selectedSlot != nil` |
| **Tap confirm** | Button shows `ProgressView()`. Entire screen dimmed slightly. | `@State var isBooking = false` |
| **Success** | Confirmation sheet slides up (`.sheet`). Contains: checkmark animation, date, time, garage name, address, mini-map. "Ajouter au calendrier" + "Voir le recap" CTAs. Haptic: `notification.success`. | Navigation or sheet |
| **Conflict error** | Alert: "Ce creneau vient d'etre reserve par un autre utilisateur. Choisissez un autre horaire." Haptic: `notification.error`. Slot grid refreshes. | `.alert` |

### 10.2 Garage Planning View (G-08)

The most complex screen in the app. A week-view calendar grid showing slots and bookings.

#### Week View Layout

```
HStack(spacing: 0) {
    // Time column (fixed)
    VStack {
        ForEach(timeSlots) { slot in   // 08:00, 09:00, ..., 18:00
            Text(slot.formatted)
                .frame(height: cellHeight)
        }
    }
    .frame(width: 50)
    
    // Day columns (scrollable horizontally)
    ScrollView(.horizontal, showsIndicators: false) {
        HStack(spacing: 1) {
            ForEach(weekDays) { day in
                VStack(spacing: 1) {
                    // Day header
                    DayHeaderView(day: day, isToday: day.isToday)
                    
                    // Time cells
                    ForEach(timeSlots) { slot in
                        CalendarCellView(
                            day: day, 
                            slot: slot, 
                            booking: bookings[day]?[slot],
                            availability: availability[day]?[slot]
                        )
                        .frame(height: cellHeight)
                    }
                }
            }
        }
    }
    .scrollTargetBehavior(.paging)
}
```

#### Cell States

| State | Visual | Interaction |
|---|---|---|
| **Available** | Green background (light). Empty or "Disponible" label at small size. | Tap: opens booking detail or creates block. Long-press: context menu ("Bloquer", "Modifier les horaires"). |
| **Booked** | Blue background. Driver name + vehicle type abbreviated. | Tap: opens booking detail sheet with driver info, vehicle, claim reference. |
| **Blocked** | Grey with diagonal hatch pattern. "Bloque" label. | Tap: "Debloquer ce creneau?" confirmation. Long-press: context menu. |
| **Past** | Muted version of above states. Non-interactive. | No tap action. |
| **Today column** | Subtle highlight border or background tint to distinguish from other days. | Same interactions as available/booked/blocked. |

#### Week Navigation

| Action | Gesture | Implementation |
|---|---|---|
| Next week | Swipe left on calendar grid, or ">" button in header | `withAnimation(.spring) { currentWeekStart = currentWeekStart.addingDays(7) }`. Horizontal paging via `ScrollView` with `.scrollTargetBehavior(.paging)`. |
| Previous week | Swipe right, or "<" button. Cannot go before current week. | Same, minus 7. Disabled state on "<" if current week. |
| Jump to today | "Aujourd'hui" button in header | `withAnimation(.spring) { currentWeekStart = Date.now.startOfWeek }`. Scrolls to today column. |

#### Slot Creation (Garage)

| Method | Interaction | Implementation |
|---|---|---|
| **Tap empty cell** | Tap on available time cell | Opens `.sheet` with time range picker: start time (pre-filled to cell time), end time (default: +1 hour). "Creer le creneau" CTA. |
| **Drag to extend** | Drag from one cell down to another | `DragGesture` on cells. Highlights range during drag. On release: same sheet pre-filled with drag range. Haptic: `selection.selectionChanged()` per cell crossed. |
| **Recurring slots** | Toggle in creation sheet | "Repeter chaque semaine" toggle. If on: applies to future weeks until manually removed. |

### 10.3 Availability Display Design

| Visual Element | Driver View (D-12) | Garage View (G-08) |
|---|---|---|
| **Color: available** | Primary color (blue) chip | Green cell background |
| **Color: booked** | N/A (driver doesn't see others' bookings) | Blue cell with driver info |
| **Color: blocked** | Grey chip, disabled | Grey/hatched cell |
| **Color: selected** | Primary filled chip with checkmark | Blue ring on selected cell |
| **Color: today** | Ring on date in strip | Column highlight in grid |

### 10.4 Calendar Integration

After booking confirmation, offer to add to the device calendar:

```
Button("Ajouter au calendrier") {
    let store = EKEventStore()
    let event = EKEvent(eventStore: store)
    event.title = "RDV Carlib - \(garageName)"
    event.startDate = bookingDate
    event.endDate = bookingDate.addingTimeInterval(3600)
    event.location = garageAddress
    event.notes = "Dossier #\(claimReference)\nAdresse: \(garageAddress)"
    // Request calendar access and save
}
```

Uses `EventKit`. Permission requested on first use with pre-permission explanation.

---

## 11. Edge Cases

### 11.1 Simultaneous Claim Acceptance (Race Condition)

**Scenario:** Garage A and Garage B both view the same claim. Garage A taps "Accepter." Garage B taps "Accepter" 2 seconds later.

| Actor | Server Behavior | Client Behavior |
|---|---|---|
| **Garage A** (first) | 200 OK. Claim status set to "attribue" with garage A. | Confirmation screen. Haptic: `notification.success`. Claim moves to "Mes dossiers." |
| **Garage B** (second) | 409 Conflict response. Body: `{ "error": "claim_already_accepted", "accepted_by": "hidden" }` | Alert: "Ce dossier a deja ete pris en charge par un autre garage." Haptic: `notification.error`. On dismiss: return to claims list. Claim removed from available list (pulled from server). |
| **Driver** | Push notification: "Votre dossier a ete accepte par {garage A name}." | Status screen updates to "Pris en charge." Live Activity updates. |

**Prevention measures:**
- Claims list shows "Vu par X garages" badge to create awareness of competition.
- Server uses optimistic locking: claim has a `version` field. Accept request must include current `version`. If mismatched, 409.
- Client shows "Derniere mise a jour: il y a {X}s" to indicate freshness.
- If WebSocket (V2): real-time "taken" event removes claim from other garages' lists instantly.

### 11.2 Booking During Garage Closure

**Scenario:** Driver views garage availability, then the garage blocks the slot the driver is about to confirm.

| Step | State | Handling |
|---|---|---|
| 1. Driver loads slot grid | Fresh data from API. Slot shows available. | Normal display. |
| 2. Garage blocks the slot (from their planning view) | Server marks slot as blocked. | Driver's view is now stale. |
| 3. Driver taps "Confirmer la reservation" | Client sends booking request. Server responds 409 (slot no longer available). | Alert: "Ce creneau n'est plus disponible. Les disponibilites ont ete mises a jour." Slot grid refreshes automatically. Haptic: `notification.error`. |

**Prevention measures:**
- Slot grid auto-refreshes every 30 seconds when visible (polling).
- On "Confirmer" tap, a pre-flight availability check is the first step before payment/booking.
- Consider "soft reservation" / hold: tapping a slot could place a 5-minute hold (V2 complexity).

### 11.3 Photo Upload Failure Mid-Flow

**Scenario:** Driver captures 3 photos. Photo 1 uploads successfully. Photo 2 fails (network drop). Driver continues to capture photo 3. Photo 3 uploads. Declaration submitted.

| Photo | Status | UI State | Recovery |
|---|---|---|---|
| Photo 1 | Uploaded | Green checkmark on thumbnail | Done |
| Photo 2 | Failed | Orange retry badge. Pulsing. | Auto-retry on reconnection. Manual retry via tap. |
| Photo 3 | Uploaded | Green checkmark | Done |

**Declaration submission with pending uploads:**
- On "Soumettre": if any photo has `syncStatus == .pending` or `.failed`, show warning: "1 photo en attente d'envoi. Soumettre quand meme?"
- If user confirms: claim submitted with available photos. Failed photo queued for background upload. Claim marked as "incomplete photos" server-side.
- If user cancels: returns to photo step to retry.
- Background: `BGProcessingTask` retries failed uploads when connectivity available. Server accepts late photo additions to a claim within 24 hours.

### 11.4 App Backgrounding During Declaration

**Scenario:** Driver is on step 3 of declaration. Receives a phone call. App goes to background for 15 minutes. Returns.

| Timing | Behavior | Implementation |
|---|---|---|
| **Immediate background** | All form data auto-saved to SwiftData `ClaimDraft`. Current step stored. Photo uploads pause. | `@Environment(\.scenePhase)` `.onChange(of: scenePhase)` triggers `saveToSwiftData()` on `.background`. |
| **Return within 5 minutes** | App resumes exactly where left off. All state intact. Photo uploads resume. | SwiftUI state preserved by system (process not killed). |
| **Return after 5-30 minutes** | Process may have been killed. App relaunches. Splash screen. Auto-detects draft. "Reprendre ma declaration" prompt on home screen. | `@Query` for `ClaimDraft` with `.status == .inProgress`. Home screen shows draft card: "Declaration en cours -- Etape 3/4. Reprendre?" |
| **Return after 30+ minutes** | Same as above, but API token may have expired. | Token refresh on launch. If fails: re-login then restore draft. Navigation state restored from `@SceneStorage`. |
| **Never returns (draft abandoned)** | Draft remains in SwiftData. | Draft card persists on home screen for 7 days. After 7 days: soft-delete with "Votre brouillon a expire" message if user returns. |

### 11.5 Interrupted Booking

**Scenario:** Driver selects a slot, taps "Confirmer", then app crashes or network drops during the booking API call.

| Outcome | Detection | Handling |
|---|---|---|
| **Booking succeeded on server, but client didn't receive response** | On next app launch: fetch active bookings. New booking detected. | Home screen: "Reservation confirmee" card. Push notification should have been sent. If push was received, deep-link to D-14. |
| **Booking failed on server** | On next app launch: no new booking in API response. | Home screen: draft or last-viewed garage still shown. "Votre reservation n'a pas pu etre finalisee. Reessayer?" prompt. Navigate back to slot selection with refreshed data. |
| **Network dropped mid-request, outcome unknown** | Client: request timed out. Server state unknown. | Client stores "pending booking" in SwiftData with details. On next connectivity: `GET /bookings?claim_id=X` to check. If booking exists: confirm to user. If not: prompt retry. |

**Idempotency:** Booking API should accept an `idempotency_key` (UUID generated client-side before the request). If the same key is sent twice, server returns the existing booking rather than creating a duplicate.

### 11.6 Multiple Claims Edge Case

**Scenario:** Driver has one active claim (in repair) and gets into a second accident.

| Aspect | Handling |
|---|---|
| **Home screen** | Shows both claims as cards in a scrollable list. Each with its own status badge. Active claim (in repair) at top. New claim below. |
| **Tab bar "Suivi"** | Shows claim selector (segment control or list). Each claim has its own status timeline. |
| **Declaration flow** | "Nouveau sinistre" always available. New declaration is independent. Can use saved vehicle info or enter new vehicle. |
| **Notifications** | Each notification includes claim reference. Deep-link resolves to the correct claim's detail. |
| **Live Activity** | One Live Activity per active claim. Both appear on Lock Screen. Each independently updatable. |

### 11.7 Garage Accepts Then Becomes Unavailable

**Scenario:** Garage accepts a claim and driver books a slot. Then the garage marks itself as unavailable (closed for vacation, etc.).

| Step | Handling |
|---|---|
| 1. Garage tries to block a slot that has a booking | Error: "Ce creneau contient une reservation. Contactez le conducteur avant de bloquer." Two options: "Contacter le conducteur" / "Annuler la reservation et bloquer". |
| 2. If garage cancels booking | Push to driver: "Votre RDV du {date} a ete annule par {garage_name}. Raison: {reason}. Choisissez un nouveau creneau." Deep-link to D-12 (slot selection) for the same garage, or D-08 (garage search) if garage is fully unavailable. |
| 3. If garage releases the claim entirely | Claim reverts to "en attente" in the marketplace. Driver notified: "Le garage {name} ne peut plus prendre en charge votre dossier. Nous recherchons un autre garage." Automatic widened search or re-listing. |
| 4. Driver perspective | Status screen shows regression: "Attribue" step unchecked, back to "En attente." Explanatory text: "Le garage initial n'est plus disponible. Votre dossier est a nouveau visible par les garages de votre zone." |

### 11.8 Slow/Large Photo Processing

**Scenario:** User's phone is older (A13/A14 chip). 10 photos at high resolution cause processing lag.

| Aspect | Handling |
|---|---|
| **Compression** | Run on background thread: `Task.detached(priority: .userInitiated) { compressImage(image) }`. Never block main thread. |
| **Progress** | Show activity indicator on thumbnail during compression (before upload begins). |
| **Memory** | Process one photo at a time. Release `UIImage` after compression to `Data`. Never hold 10 full-resolution `UIImage` in memory. |
| **Thumbnail generation** | Generate 150x150pt thumbnail immediately for strip display. Full-size processing happens asynchronously. |
| **Fallback** | If compression fails (out of memory): reduce max dimension to 1024px and retry. If still fails: alert user to free storage. |

### 11.9 Deep Link Resolution Failures

**Scenario:** User taps a push notification deep-linking to a claim that no longer exists (cancelled, expired, or error).

| Cause | Handling |
|---|---|
| Claim cancelled | Navigate to dossier history. Show toast: "Ce dossier a ete annule." |
| Claim expired | Navigate to home. Show alert: "Ce dossier a expire. Souhaitez-vous declarer a nouveau?" |
| API error on fetch | Navigate to home. Show toast: "Impossible de charger le dossier. Reessayez plus tard." |
| Invalid deep link format | Navigate to home. No error shown (silent fallback). Log to analytics. |

Implementation: all deep-link navigation goes through a `DeepLinkRouter` observable that validates the target exists before navigating. If validation fails, falls back to home screen with appropriate messaging.

### 11.10 Timezone and Locale Edge Cases

| Case | Handling |
|---|---|
| **User in overseas France** (DOM-TOM with different timezone) | All times displayed in local device timezone. Server stores UTC. Conversion at display layer: `Text(date, format: .dateTime.hour().minute())` automatically uses device locale. |
| **Garage and driver in different timezones** | Rare in metropolitan France (single timezone). If DOM-TOM: booking times always shown in the garage's timezone with explicit label: "Heure locale du garage." |
| **Daylight saving time transition** | Use `Calendar` and `DateComponents` for all date math, never raw `TimeInterval` addition. Booking slots straddling DST transition show correct times. |
| **French locale formatting** | `Locale(identifier: "fr_FR")` enforced app-wide via `.environment(\.locale)` on root view. 24-hour time format. "lundi 7 avril 2026" date format. |

---

## Appendix A: SwiftUI API Reference Summary

| Category | APIs Used |
|---|---|
| **Navigation** | `NavigationStack`, `NavigationPath`, `NavigationLink`, `NavigationDestination`, `NavigationTransition` (iOS 26) |
| **Presentation** | `.sheet`, `.fullScreenCover`, `.alert`, `.confirmationDialog`, `.popover` |
| **Layout** | `ScrollView`, `LazyVStack`, `LazyVGrid`, `GeometryReader`, `ViewThatFits`, `Layout` protocol |
| **Data** | `@Observable`, `@State`, `@Binding`, `@Environment`, `@Query` (SwiftData), `@FocusState`, `@SceneStorage`, `@Namespace` |
| **Animation** | `withAnimation`, `.animation()`, `.transition()`, `.matchedGeometryEffect`, `spring(duration:bounce:)`, `PhaseAnimator`, `KeyframeAnimator`, `TimelineView` |
| **Gestures** | `TapGesture`, `LongPressGesture`, `DragGesture`, `MagnifyGesture`, `.swipeActions`, `.contextMenu`, `.refreshable` |
| **MapKit** | `Map`, `MapCamera`, `MapCameraPosition`, `Annotation`, `MapPolyline`, `MapUserLocationButton`, `MapCompass`, `MKLocalSearchCompleter`, `MKDirections` |
| **Photos** | `PhotosPicker`, `AVCaptureSession` (via `UIViewControllerRepresentable`), `VisionKit.DataScannerViewController` |
| **Calendar** | `DatePicker`, `EKEventStore`, custom calendar grid views |
| **Haptics** | `UIImpactFeedbackGenerator`, `UINotificationFeedbackGenerator`, `UISelectionFeedbackGenerator` |
| **Notifications** | `UNUserNotificationCenter`, `UNNotificationCategory`, `UNNotificationAction`, `ActivityKit` (Live Activities) |
| **Background** | `BGTaskScheduler`, `BGAppRefreshTask`, `BGProcessingTask` |
| **Accessibility** | `@Environment(\.accessibilityReduceMotion)`, `.accessibilityLabel()`, `.accessibilityHint()`, `.accessibilityAction()`, Dynamic Type (automatic with system fonts) |

## Appendix B: Animation Easing Curves Reference

| Curve Name | SwiftUI API | Usage |
|---|---|---|
| **System spring** | `.spring` (default parameters) | Navigation transitions, sheet presentation |
| **Bouncy spring** | `.spring(duration: 0.4, bounce: 0.3)` | Success animations (checkmark, booking confirmation) |
| **Snappy spring** | `.spring(duration: 0.3, bounce: 0.1)` | Button press, card interactions |
| **Smooth ease-in-out** | `.easeInOut(duration: 0.25)` | Opacity crossfades (map/list toggle, skeleton to content) |
| **Quick ease-out** | `.easeOut(duration: 0.2)` | Element appearance, toast enter |
| **Quick ease-in** | `.easeIn(duration: 0.15)` | Element disappearance, toast exit |
| **Linear** | `.linear` | Progress bar fill, upload ring, shimmer loop |
| **Interactive spring** | `.interactiveSpring(duration: 0.25)` | During drag gestures (responsive to finger) |

## Appendix C: Claim & Repair State Machines (SwiftUI-Ready)

### Claim Lifecycle States

```
enum ClaimStatus: String, Codable, CaseIterable {
    case brouillon = "brouillon"          // Local draft
    case soumis = "soumis"                // Submitted to server
    case enAttente = "en_attente"         // Waiting for garage acceptance
    case attribue = "attribue"            // Garage accepted
    case reserve = "reserve"              // Booking confirmed
    case enReparation = "en_reparation"   // Vehicle being repaired
    case termine = "termine"              // Repair complete
    case archive = "archive"              // Picked up, closed
    case expire = "expire"               // No garage accepted in time
    case annule = "annule"               // Cancelled by driver
}
```

### Repair Status (Garage-Managed)

```
enum RepairStatus: String, Codable, CaseIterable {
    case enAttente = "en_attente"         // Vehicle not yet received
    case prisEnCharge = "pris_en_charge"  // Vehicle received at garage
    case enReparation = "en_reparation"   // Repair work in progress
    case termine = "termine"              // Repair complete, vehicle ready
}
```

### Valid Transitions

```
ClaimStatus.validTransitions: [ClaimStatus: [ClaimStatus]] = [
    .brouillon: [.soumis, .annule],
    .soumis: [.enAttente, .annule],
    .enAttente: [.attribue, .expire, .annule],
    .attribue: [.reserve, .enAttente, .annule],   // enAttente = garage released
    .reserve: [.enReparation, .attribue, .annule], // attribue = booking cancelled
    .enReparation: [.termine],
    .termine: [.archive],
    .expire: [.enAttente],  // driver re-declares or widens search
    .annule: [],            // terminal
    .archive: []            // terminal
]
```

---

*This specification is based on PRD Carlib v0.1 (Draft, Mars 2026) by Digital Unicorn and the existing analysis documents (01-08). All SwiftUI APIs reference iOS 26 / Xcode 26. No external dependencies are used. All text content is in French as required. This document should be updated as PRD open questions (attribution model, garage portal scope, visual identity) are resolved.*
