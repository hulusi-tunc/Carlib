# Carlib -- Interaction Design Analysis

**Version:** 1.0
**Date:** April 2026
**Author:** Interaction Designer Agent
**Source:** PRD Carlib v0.1 (Digital Unicorn -- Phase Design UX/UI)

---

## Table of Contents

1. [State Inventory](#1-state-inventory)
2. [Interaction Patterns Needed](#2-interaction-patterns-needed)
3. [Critical Transitions](#3-critical-transitions)
4. [Gesture & Input Patterns](#4-gesture--input-patterns)
5. [Real-Time & Notification Logic](#5-real-time--notification-logic)
6. [Error Handling Scenarios](#6-error-handling-scenarios)
7. [Edge Cases](#7-edge-cases)
8. [Recommendations](#8-recommendations)

---

## 1. State Inventory

Every screen in Carlib must account for multiple states. Below is a complete inventory mapped to every major screen and flow in both the driver (conducteur) and garage (carrossier) interfaces.

### 1.1 Shared / Global States

These states apply across the entire application regardless of role.

| State | Description | Trigger |
|-------|-------------|---------|
| **App Launch / Splash** | Brand identity moment while the app initializes, checks authentication token, loads cached data | App opened cold or from background after token expiry |
| **Offline Mode** | Banner or overlay indicating no network; cached data shown where possible, write actions queued | Device loses connectivity |
| **Session Expired** | Soft lock screen requesting re-authentication | Token expires during active use |
| **Force Update** | Blocking modal requiring app store update | API version mismatch detected |
| **Maintenance** | Full-screen informational state with estimated return time | Server-side flag |
| **Permission Request** | System dialogs for camera, location, notifications -- with pre-permission explanation screens | First use of feature requiring the permission |
| **Deep Link Landing** | App opened via push notification or external link; resolves to correct screen with loading indicator | User taps notification or shared link |

### 1.2 Onboarding & Authentication

| Screen | Loading | Empty / First-Use | Error | Success | Partial |
|--------|---------|-------------------|-------|---------|---------|
| **Welcome / Role Selection** | Skeleton while checking if returning user | First launch: animated value proposition carousel (3 slides max per PRD "comprendre en 30 secondes") | Network error on role submission | Role confirmed, transition to registration | -- |
| **Registration (Driver)** | Spinner on form submission | Empty form with smart placeholder text in French | Validation errors inline (email format, phone format, required fields); server error toast | Account created, auto-login, redirect to home | Partially filled form preserved on back-navigation |
| **Registration (Garage)** | Spinner on form submission; address geocoding indicator | Empty form; SIRET lookup field with helper text | SIRET not found; address not geocodable; duplicate account | Account created, profile completion prompt | Multi-step form with draft saving |
| **Login** | Spinner on credential check | Empty fields with "Connexion" CTA disabled until valid input | Wrong credentials (specific message); account locked; network failure | Redirect to home with cached data | Biometric prompt (Face ID / Touch ID) if previously configured |

### 1.3 Driver Flow -- Claim Declaration (Parcours Declaration)

The declaration is a 4-step guided flow (US01). Each step needs its own state set.

| Screen / Step | Loading | Empty / First-Use | Error | Success | Partial / In-Progress |
|---------------|---------|-------------------|-------|---------|----------------------|
| **Step 1 -- Accident Type Selection** | -- (static content) | First declaration: tooltip explaining each type | -- | Type selected, visual confirmation, auto-advance | -- |
| **Step 2 -- Photo Capture** | Processing indicator per photo (upload/compression) | Camera viewfinder with overlay guide showing which angle to capture (front, rear, left, right, damage close-up) | Camera permission denied; photo upload failed (retry per photo); storage full | Green checkmark per captured photo; thumbnail grid | Some photos taken, others pending; "skip for now" option with warning |
| **Step 3 -- Vehicle & Accident Info** | Pre-fill loading (fetching saved vehicle data) | Empty form; license plate field with OCR option | Plate not recognized; required fields missing on "next" | Fields validated, summary preview | Previously saved vehicle auto-populated; editable |
| **Step 4 -- Location & Summary** | Geocoding current position; reverse geocode to address | Map centered on current location with draggable pin | GPS unavailable (manual address fallback); geocode failure | Full claim summary card with all info; "Soumettre" CTA | Location refined manually vs. auto-detected |
| **Declaration Submitted** | Submission spinner (full-screen with reassuring copy) | -- | Submission failed (retry CTA; data preserved locally) | Success animation; claim reference number displayed; next step prompt ("Trouver un garage") | -- |

### 1.4 Driver Flow -- Garage Selection (Parcours Selection Garage)

| Screen | Loading | Empty | Error | Success | Partial |
|--------|---------|-------|-------|---------|---------|
| **Garage List + Map** | Skeleton cards + map shimmer; "Recherche de garages..." | No garages found in area (expand radius CTA; adjust filters CTA) | Location services off; network error on search | List populated with distance, availability, rating | Partial results while more load (pagination / infinite scroll) |
| **Garage Filters** | -- (local state) | Default filter state (all types, sorted by distance) | -- | Filters applied, list updates | Active filter chips visible; clear-all option |
| **Garage Detail Card** | Content loading skeleton | -- (should always have data if reachable) | Image load failure (placeholder); network error loading reviews | Full profile displayed: name, photos, specialties, distance, availability slots | -- |
| **Garage Comparison** (implied) | -- | Fewer than 2 garages to compare | -- | Side-by-side or sequential comparison view | -- |

### 1.5 Driver Flow -- Booking (Parcours Reservation)

| Screen | Loading | Empty | Error | Success | Partial |
|--------|---------|-------|-------|---------|---------|
| **Calendar / Slot Selection** | Loading available slots from garage API | No available slots this week/month ("Aucun creneau disponible -- contacter le garage?") | Slot became unavailable between display and selection (conflict); network error | Slot selected, visual highlight, "Confirmer" CTA enabled | Multiple weeks navigable; past dates greyed out |
| **Booking Confirmation** | Submission spinner | -- | Booking conflict (slot taken by another user); server error | Confirmation screen with: date, time, garage name, address, claim reference, map thumbnail | -- |
| **Booking Confirmed (Recap)** | -- | -- | -- | Summary card; "Ajouter au calendrier" CTA; push notification scheduled | -- |

### 1.6 Driver Flow -- Repair Tracking (Suivi Reparation)

| Screen | Loading | Empty | Error | Success | Active |
|--------|---------|-------|-------|---------|--------|
| **Status Dashboard** | Skeleton with progress bar placeholder | First visit before any claim: "Aucun sinistre en cours" with CTA to declare | Network error refreshing status | Current status prominently displayed with timeline | Real-time status: en attente / pris en charge / en reparation / termine |
| **Status Timeline / History** | Loading past events | No history yet (claim just submitted) | Failed to load history | Chronological list of all status changes with timestamps | New status entry animates in on push update |
| **Completion / Vehicle Ready** | -- | -- | -- | Celebratory state: "Votre vehicule est pret!" with pickup instructions, garage contact, map link | Rating prompt after pickup |

### 1.7 Garage Flow -- Incoming Claims (Consultation Sinistres)

| Screen | Loading | Empty | Error | Success | Active |
|--------|---------|-------|-------|---------|--------|
| **Available Claims List** | Skeleton list with shimmer | "Aucun sinistre disponible dans votre zone" (check zone settings CTA) | Network/server error | List of claims with: vehicle type, damage type, distance, urgency indicator | New claim notification badge; real-time list update |
| **Claim Detail** | Loading full dossier | -- | Dossier data incomplete (photos missing) | Full dossier: photos (zoomable), vehicle info, accident description, location map, driver contact | -- |
| **Accept / Decline Action** | Submission spinner on accept | -- | Claim already taken by another garage (race condition); network error | "Dossier accepte" confirmation; auto-added to planning | Decline requires optional reason |

### 1.8 Garage Flow -- Planning & Availability (Gestion Disponibilites)

| Screen | Loading | Empty | Error | Success | Active |
|--------|---------|-------|-------|---------|--------|
| **Week View Calendar** | Loading existing slots and bookings | First use: empty calendar with onboarding tooltip ("Definissez vos creneaux disponibles") | Sync error with booking system | Calendar populated with color-coded slots (available / booked / blocked) | Drag to create/extend slot; tap to edit |
| **Month View Calendar** | Loading month data | Same first-use state | Same error handling | Month overview with density indicators | Navigation between months |
| **Slot Creation / Edit** | -- | New slot form with smart defaults (business hours) | Conflict with existing booking | Slot created/updated, visual confirmation on calendar | -- |
| **Slot Blocking** | -- | -- | Cannot block slot with existing booking (warning) | Slot marked as blocked (different visual style) | -- |

### 1.9 Garage Flow -- Repair Status Management

| Screen | Loading | Empty | Error | Success |
|--------|---------|-------|-------|---------|
| **Active Repairs List** | Skeleton list | "Aucune reparation en cours" | Network error | List of active repairs with current status badge |
| **Status Update Action** | Sending update spinner | -- | Failed to send update (retry); notification delivery failure (silent retry) | Status updated; confirmation that driver has been notified |
| **Status History per Repair** | Loading history | -- | Network error | Timeline of all status changes with timestamps and actor |

### 1.10 Garage Flow -- Profile Management

| Screen | Loading | Empty | Error | Success |
|--------|---------|-------|-------|---------|
| **Garage Profile View** | Loading profile data | First setup: guided profile completion flow | Network error loading profile | Full profile displayed with edit affordances |
| **Garage Profile Edit** | Saving changes indicator | -- | Photo upload failed; required field missing; address geocode failure | Changes saved confirmation toast | 
| **Photo Gallery Management** | Uploading indicator per photo | No photos yet: "Ajoutez des photos de votre atelier" | Upload failed (retry per photo); file too large | Photos in reorderable grid |

### 1.11 Driver & Garage -- Notifications Center

| Screen | Loading | Empty | Error | Success |
|--------|---------|-------|-------|---------|
| **Notification List** | Skeleton list | "Aucune notification" with illustration | Failed to load | Chronological list with read/unread styling |
| **Notification Detail / Deep Link** | Loading target screen | -- | Target resource no longer exists (claim cancelled, etc.) | Navigated to relevant screen |

---

## 2. Interaction Patterns Needed

### 2.1 Photo Capture Flow (Declaration Step 2)

This is the most interaction-heavy part of the driver experience. It must work under stress (post-accident context).

**Pattern: Guided Multi-Photo Capture**

| Aspect | Specification |
|--------|--------------|
| **Trigger** | User reaches step 2 of declaration |
| **Camera overlay** | Semi-transparent guide frame showing which angle is expected (e.g., silhouette of car front). Text label: "Photo avant du vehicule" |
| **Capture sequence** | Minimum 3 photos recommended (front, rear, damage). Optional additional photos. Non-blocking -- user can skip with warning |
| **Feedback per capture** | Shutter animation; thumbnail appears in strip at bottom; green checkmark overlay on captured angles |
| **Review** | Tap thumbnail to review full-size; retake button per photo; delete with confirmation |
| **Upload behavior** | Background upload starts immediately after each capture; progress ring on thumbnail; retry on failure |
| **Quality check** | Optional: blur detection warning ("Photo floue, voulez-vous reprendre?") |
| **Fallback** | "Importer depuis la galerie" option for photos already taken |

### 2.2 Map & Location Interaction (Garage Selection + Declaration)

**Pattern: Interactive Map with List Sync**

| Aspect | Specification |
|--------|--------------|
| **Map type** | Standard map tiles (Mapbox or Google Maps) with custom Carlib pins |
| **List-map sync** | Tapping a list item highlights and centers the corresponding map pin; tapping a map pin scrolls to and highlights the list item |
| **Map gestures** | Pan, pinch-to-zoom, double-tap zoom, rotate (standard map SDK gestures) |
| **Current location** | Blue pulsing dot for user position; "Recentrer" button to return to current location |
| **Garage pins** | Color-coded by availability (green = available soon, orange = limited, grey = unavailable); cluster pins at low zoom levels |
| **Radius indicator** | Optional circle showing search radius; expandable via slider or "Elargir la recherche" CTA |
| **Declaration map** | Draggable pin on map to set accident location; address text field synced bidirectionally with pin position |
| **Bottom sheet** | Map screen uses a draggable bottom sheet: collapsed = list header with count; half = scrollable list; full = list fills screen (map hidden) |

### 2.3 Calendar Booking (Driver Side)

**Pattern: Slot-Based Calendar Picker**

| Aspect | Specification |
|--------|--------------|
| **View** | Horizontal date strip (next 14 days) at top; available time slots below as tappable chips |
| **Available slot** | Tappable chip with time range; primary color |
| **Unavailable slot** | Greyed-out chip; non-tappable; optional "Pourquoi?" tooltip |
| **Selected slot** | Highlighted chip with checkmark; "Confirmer" CTA appears / becomes enabled |
| **Day navigation** | Horizontal swipe on date strip; arrows for previous/next week |
| **No slots for day** | "Aucun creneau disponible ce jour" message under date; next available date suggested |
| **Confirmation** | Bottom sheet or modal with booking summary; "Confirmer la reservation" primary CTA; "Modifier" secondary CTA |

### 2.4 Calendar Management (Garage Side)

**Pattern: Week/Month Planning Grid**

| Aspect | Specification |
|--------|--------------|
| **Week view** | 7-column grid; rows = time slots (30min or 1h increments); swipe left/right to navigate weeks |
| **Slot creation** | Tap-and-drag on empty cell to create availability block; bottom sheet to confirm time range |
| **Slot blocking** | Long-press on available slot to block; or multi-select mode to block range |
| **Booked slots** | Distinct color (e.g., blue); show driver name / vehicle; tappable for detail |
| **Available slots** | Green background; created by garage owner |
| **Blocked slots** | Hatched or grey pattern; non-bookable |
| **Sync indicator** | Small icon showing last sync time; manual refresh via pull-to-refresh |
| **Conflict resolution** | If a booking arrives for a slot being edited, real-time update with toast notification |

### 2.5 Status Update Flow (Garage Side)

**Pattern: Linear Status Stepper with One-Tap Advance**

| Aspect | Specification |
|--------|--------------|
| **Status progression** | Linear: En attente --> Pris en charge --> En reparation --> Termine |
| **Current status** | Highlighted step on horizontal stepper |
| **Advance action** | Prominent CTA: "Passer a l'etape suivante" with next status label |
| **Confirmation** | Confirmation dialog: "Confirmer le passage a [Statut]? Le conducteur sera notifie." |
| **Undo window** | 5-minute undo option via toast: "Statut mis a jour. Annuler?" (prevents accidental advances) |
| **Regression** | Ability to move status backward with mandatory reason (edge case: wrong update) |

### 2.6 Status Tracking (Driver Side)

**Pattern: Animated Progress Timeline**

| Aspect | Specification |
|--------|--------------|
| **Visual** | Vertical timeline with nodes for each status; completed nodes filled with checkmark; current node pulsing; future nodes outlined |
| **Animation** | When status changes (via push or poll), new node animates in with a satisfying micro-animation (scale + fade + confetti on "Termine") |
| **Timestamps** | Each node shows date/time of status change |
| **Expandable** | Tap a node to see details (e.g., garage note, estimated completion) |
| **Pull to refresh** | Manual refresh of status |
| **Empty state** | Before first status update: "Votre dossier a ete soumis. En attente de prise en charge par un garage." |

### 2.7 Claim Acceptance (Garage Side -- Marketplace)

**Pattern: Tinder-Style or Action-Card Pattern**

| Aspect | Specification |
|--------|--------------|
| **Card display** | Claim summary card with key info visible at a glance (vehicle, damage type, distance, photos thumbnail) |
| **Actions** | Two prominent buttons: "Accepter" (green) / "Refuser" (red/grey); or swipe right/left |
| **Detail expansion** | Tap card to expand to full detail before deciding |
| **Accept flow** | Tap "Accepter" --> confirmation dialog --> spinner --> success or conflict error |
| **Race condition handling** | If claim was accepted by another garage during viewing: "Ce dossier n'est plus disponible" with return to list |
| **Batch awareness** | Badge showing how many garages can see this claim (creates appropriate urgency without pressure) |

---

## 3. Critical Transitions

### 3.1 Driver Flow Transitions

```
[Splash] --> [Welcome / Role Selection] --> [Registration] --> [Home (empty)]
                                                                    |
                                                            [Declare Claim]
                                                                    |
                                                    [Step 1: Type] --> [Step 2: Photos]
                                                                            |
                                                            [Step 3: Vehicle Info] --> [Step 4: Location]
                                                                                            |
                                                                                [Summary & Submit]
                                                                                        |
                                                                        [Submission Success]
                                                                                |
                                                                    [Garage Selection]
                                                                        |           |
                                                                [Map View]    [List View]
                                                                        |           |
                                                                    [Garage Detail]
                                                                            |
                                                                [Calendar / Booking]
                                                                            |
                                                                [Booking Confirmed]
                                                                            |
                                                                [Status Tracking] <-- [Push Notifications]
                                                                            |
                                                                [Vehicle Ready / Pickup]
                                                                            |
                                                                    [Rating / Review]
```

**Key transition details:**

| Transition | Type | Behavior |
|-----------|------|----------|
| Declaration steps (1-4) | Horizontal slide with progress bar | Forward: slide left; Back: slide right; progress bar animates continuously |
| Declaration --> Success | Full-screen success overlay | Lottie/animated checkmark; auto-dismiss after 2s or tap to continue |
| Success --> Garage Selection | Push navigation | "Trouver un garage" CTA triggers forward navigation |
| Map <--> List | Tab switch or bottom sheet drag | Seamless; selected garage persists across views |
| Garage list --> Garage detail | Bottom sheet expansion or push | Bottom sheet pattern preferred on mobile (maintains map context) |
| Garage detail --> Calendar | Push navigation within bottom sheet or new screen | Depends on bottom sheet vs. full-screen detail |
| Booking confirmation | Modal overlay on calendar screen | Prevents accidental back-navigation before seeing confirmation |
| Status update arrival | In-app banner + timeline animation | If on status screen: animate new node; if elsewhere: in-app notification banner |

### 3.2 Garage Flow Transitions

```
[Splash] --> [Welcome / Role Selection] --> [Registration] --> [Profile Setup]
                                                                    |
                                                            [Dashboard / Home]
                                                            /       |         \
                                        [Available Claims]  [Planning]  [Active Repairs]
                                                |               |              |
                                        [Claim Detail]  [Slot Management] [Repair Detail]
                                                |                              |
                                        [Accept/Decline]              [Status Update]
                                                |
                                        [Booking Added to Planning]
```

**Key transition details:**

| Transition | Type | Behavior |
|-----------|------|----------|
| Dashboard tabs | Bottom tab bar switch | No animation or cross-fade; preserves scroll position per tab |
| Claims list --> Claim detail | Push navigation or expandable card | Photos gallery loads progressively |
| Accept claim | In-place state change + modal | Card state changes from "available" to "accepted"; confirmation modal |
| Planning slot creation | Bottom sheet or inline expansion | Tap empty slot --> bottom sheet with time picker |
| Status update | In-place stepper animation | Stepper advances with progress animation; toast confirms notification sent |
| New claim notification | Badge + list prepend | Red badge on claims tab; new claim slides in at top of list |

### 3.3 Cross-Role Transitions (Shared States)

| Event | Driver sees | Garage sees |
|-------|-------------|-------------|
| Claim submitted | Success screen --> waiting state | New claim appears in available list |
| Garage accepts claim | Push notification --> status updates to "Pris en charge" | Confirmation --> claim moves to active repairs |
| Booking confirmed | Confirmation screen with details | New booking appears on calendar |
| Status changed | Push notification --> timeline updates | Confirmation toast; driver notified indicator |
| Repair completed | Push notification --> "Vehicule pret" screen | Claim moved to completed archive |

---

## 4. Gesture & Input Patterns

### 4.1 Standard Mobile Gestures

| Gesture | Where Used | Behavior |
|---------|-----------|----------|
| **Pull-to-refresh** | Claims list (garage), garage list (driver), status screen, notifications list | Standard iOS/Android pull-to-refresh with loading indicator; haptic feedback on trigger threshold |
| **Swipe left/right** | Declaration steps navigation; calendar week navigation; possible claim accept/decline (garage) | Horizontal pagination with resistance at boundaries |
| **Pinch-to-zoom** | Map view; photo viewer (claim photos, garage photos) | Standard zoom behavior; double-tap to toggle between 1x and 2x zoom |
| **Long press** | Calendar slot to block (garage); photo to delete (declaration); message to copy | Haptic feedback on activation; context menu appears |
| **Tap** | All buttons, cards, list items, map pins, calendar slots | Standard touch target minimum 44x44pt; visual press state (opacity change or scale) |
| **Double tap** | Map (zoom in); photo (toggle zoom) | Standard map and image viewer behavior |
| **Swipe to dismiss** | Bottom sheets; photo viewer; modals | Drag down to dismiss with velocity detection; snap-back if released without sufficient velocity |
| **Drag** | Map pan; bottom sheet height; accident location pin; calendar slot creation (garage) | Continuous position tracking with momentum |
| **Swipe horizontal on cards** | Notification dismissal; possible claim cards (garage) | Reveal action buttons or dismiss with threshold |

### 4.2 Input Patterns

| Input | Where Used | Specification |
|-------|-----------|---------------|
| **License plate input** | Declaration step 3 | Uppercase auto-formatting; French plate format mask (AA-123-AA); optional camera OCR |
| **Phone number input** | Registration | French format with +33 prefix; numeric keyboard; real-time formatting |
| **Address input** | Registration (garage); declaration location | Autocomplete with geocoding API; debounced search (300ms); recent addresses |
| **SIRET input** | Garage registration | 14-digit numeric field with validation against official registry |
| **Search input** | Garage search (driver); claims filter (garage) | Debounced (300ms); clear button; recent/suggested searches |
| **Date/time picker** | Calendar booking; availability management | Native date/time picker or custom slot-based picker; locale: fr-FR |
| **Photo input** | Declaration; garage profile | Camera capture or gallery import; crop/rotate before upload; compression for bandwidth |
| **Text areas** | Accident description; decline reason; garage bio | Character count; auto-growing height; keyboard-aware scrolling |

### 4.3 Haptic Feedback Patterns

| Event | Haptic Type |
|-------|------------|
| Photo captured | Light impact |
| Status change received | Medium impact |
| Booking confirmed | Success notification |
| Error encountered | Error notification |
| Pull-to-refresh threshold reached | Light impact |
| Long press activated | Medium impact |
| Swipe action threshold reached | Light impact |

---

## 5. Real-Time & Notification Logic

### 5.1 Push Notification Matrix

| Event | Recipient | Priority | Content Template | Deep Link Target |
|-------|-----------|----------|-----------------|-----------------|
| New claim in zone | Garage | High | "Nouveau sinistre a {distance}km -- {vehicle_type}, {damage_type}" | Claim detail screen |
| Claim accepted by garage | Driver | High | "{garage_name} a accepte votre dossier" | Status tracking screen |
| Claim declined by all garages | Driver | High | "Aucun garage n'a accepte votre dossier. Elargir la recherche?" | Garage selection screen (wider radius) |
| Booking confirmed | Driver | High | "RDV confirme le {date} a {time} chez {garage_name}" | Booking recap screen |
| Booking confirmed | Garage | Medium | "Nouvelle reservation le {date} a {time} -- {driver_name}" | Planning screen |
| Booking reminder (24h before) | Driver | Medium | "Rappel: RDV demain a {time} chez {garage_name}" | Booking recap screen |
| Booking reminder (24h before) | Garage | Low | "Rappel: {driver_name} attendu demain a {time}" | Planning screen |
| Status: Pris en charge | Driver | High | "Votre vehicule est pris en charge par {garage_name}" | Status tracking screen |
| Status: En reparation | Driver | Medium | "La reparation de votre vehicule a commence" | Status tracking screen |
| Status: Termine | Driver | High | "Votre vehicule est pret! Contactez {garage_name} pour le recuperer" | Vehicle ready screen |
| Claim expired (no garage accepted within X hours) | Driver | High | "Votre dossier n'a pas trouve de garage. Que souhaitez-vous faire?" | Claim management screen |
| New message (future V2) | Both | Medium | "Nouveau message de {sender_name}" | Conversation screen |

### 5.2 Real-Time Update Strategy

| Mechanism | Use Case | Specification |
|-----------|---------|---------------|
| **Push notifications** | All cross-role events (status changes, bookings, new claims) | FCM (Android) + APNs (iOS); silent push to trigger background data refresh |
| **Polling fallback** | Status screen when app is in foreground | Poll every 30 seconds when on status screen; every 5 minutes on other screens |
| **WebSocket (future)** | Real-time claim availability (marketplace race condition) | For V2 or if race conditions are frequent; shows "Claim taken" in real time |
| **Optimistic UI** | Status updates (garage side); booking confirmation | Show success state immediately; rollback on server error |
| **Background refresh** | Claim list (garage); status (driver) | iOS Background App Refresh + Android WorkManager for periodic sync |

### 5.3 Notification Permission Strategy

| Step | Timing | Approach |
|------|--------|----------|
| **Pre-permission screen** | After first claim declaration (driver) or first claim acceptance (garage) | Custom screen explaining value: "Activez les notifications pour suivre votre reparation en temps reel" with benefit list |
| **System prompt** | After user taps "Activer" on pre-permission screen | Standard OS permission dialog |
| **Denied handling** | If user denies | Fallback to in-app notification center + banner; periodic reminder (max once per session) to enable notifications via settings |
| **Settings deep link** | If user later wants to enable | "Activer les notifications" row in app settings linking to OS notification settings |

---

## 6. Error Handling Scenarios

### 6.1 Declaration Flow Errors

| Error Scenario | Detection | User-Facing Message | Recovery Action | Severity |
|---------------|-----------|--------------------|-----------------|----|
| **Camera permission denied** | OS permission check returns denied | "Carlib a besoin de votre appareil photo pour documenter le sinistre" | "Ouvrir les reglages" button linking to OS settings; or "Importer depuis la galerie" alternative | High |
| **Camera hardware failure** | Camera API error | "Impossible d'acceder a l'appareil photo" | Gallery import fallback | High |
| **Photo upload failure** | Network error on upload | Orange retry icon on thumbnail; "Echec de l'envoi" | Per-photo retry button; queued retry on reconnection | Medium |
| **Photo too blurry** | Client-side blur detection (optional) | "Cette photo semble floue. Reprendre?" | Retake or keep option | Low |
| **GPS unavailable** | Location API returns error or times out after 10s | "Impossible de determiner votre position" | Manual address input field appears; map remains interactive for pin placement | High |
| **GPS inaccurate** | Accuracy > 100m | "Position approximative. Ajustez le curseur sur la carte si besoin." | Draggable pin on map; address input field | Medium |
| **License plate OCR failure** | OCR returns low confidence or no result | "Plaque non reconnue" | Manual input field (already visible as fallback) | Low |
| **Form validation errors** | Client-side validation on "Suivant" tap | Inline red error messages per field; scroll to first error | User corrects fields; errors clear on valid input | Medium |
| **Submission network failure** | Server timeout or 5xx | "Envoi echoue. Votre dossier est sauvegarde localement." | "Reessayer" CTA; local storage preserves all form data and photos | Critical |
| **Duplicate claim detection** | Server returns 409 | "Un sinistre similaire existe deja pour ce vehicule" | View existing claim CTA; or "Creer quand meme" if different incident | Medium |

### 6.2 Garage Selection & Booking Errors

| Error Scenario | Detection | User-Facing Message | Recovery Action | Severity |
|---------------|-----------|--------------------|-----------------|----|
| **No garages in area** | Empty search results | "Aucun garage disponible dans cette zone" | "Elargir la recherche" CTA (increases radius); filter adjustment suggestion | High |
| **All garages fully booked** | All garages return no available slots | "Aucun creneau disponible cette semaine" | Show next available date per garage; "Etre notifie quand un creneau se libere" option | High |
| **Booking slot conflict** | 409 Conflict on booking attempt | "Ce creneau vient d'etre reserve. Choisissez un autre horaire." | Return to slot selection with refreshed availability | High |
| **Garage no longer available** | Garage deactivated between list view and detail | "Ce garage n'est plus disponible sur Carlib" | Return to list with garage removed | Medium |
| **Map loading failure** | Map tile server error | Static fallback with address list only; "Carte indisponible" message | List view as primary; retry map button | Medium |
| **Geocoding failure** | Geocoder API error | Address shown without map pin | List-only view with distance shown as approximate | Low |

### 6.3 Garage-Side Errors

| Error Scenario | Detection | User-Facing Message | Recovery Action | Severity |
|---------------|-----------|--------------------|-----------------|----|
| **Claim already accepted (race condition)** | 409 on accept | "Ce dossier a deja ete pris en charge par un autre garage" | Return to claims list; claim removed from available list | High |
| **Status update failure** | Network error on status change | "Mise a jour echouee. Le conducteur n'a pas ete notifie." | Retry button; queued retry on reconnection | High |
| **Calendar sync failure** | Booking data out of sync | "Impossible de synchroniser le planning. Derniere synchro: {time}" | Manual refresh; pull-to-refresh; automatic retry | Medium |
| **Double booking conflict** | Slot already booked on availability toggle | "Ce creneau contient deja une reservation" | Cannot block; show booking details; offer to contact driver | Medium |
| **Photo upload failure (profile)** | Network error on gallery upload | "Photo non envoyee" | Per-photo retry; queued upload | Low |
| **SIRET validation failure** | API returns invalid or not found | "Numero SIRET invalide ou non reconnu" | Manual entry with bypass option (pending admin validation) | Medium |

### 6.4 System-Level Errors

| Error Scenario | Detection | User-Facing Message | Recovery Action | Severity |
|---------------|-----------|--------------------|-----------------|----|
| **No internet connection** | Network reachability monitor | Persistent top banner: "Pas de connexion internet" | Offline mode: cached data visible; write actions queued; auto-retry on reconnect | Critical |
| **Intermittent connection** | Repeated request timeouts | "Connexion instable" banner | Automatic retry with exponential backoff; user can force refresh | High |
| **Server down (5xx)** | Multiple API calls failing | Full-screen error: "Service temporairement indisponible" | "Reessayer" CTA; auto-retry every 30s; push notification when service restored | Critical |
| **API version mismatch** | 426 response | "Veuillez mettre a jour l'application" | Direct link to App Store / Play Store | Critical |
| **Storage full** | OS storage check before photo capture | "Espace insuffisant pour prendre des photos" | Guide to free space; suggest gallery import of lower-res existing photos | High |
| **Authentication expired** | 401 response | Soft lock: "Session expiree. Reconnectez-vous." | Login screen with preserved navigation state; biometric re-auth if configured | Medium |

---

## 7. Edge Cases

### 7.1 Declaration Edge Cases

| Edge Case | Current PRD Coverage | Recommended Handling |
|-----------|---------------------|---------------------|
| **User starts declaration but abandons mid-flow** | Not covered | Auto-save draft locally; "Reprendre ma declaration" card on home screen; drafts expire after 7 days |
| **Multiple simultaneous claims (same user)** | Not covered | Allow multiple active claims; home screen shows claim selector or list; each claim independently tracked |
| **Claim for someone else's vehicle** | Not covered | "Ce n'est pas mon vehicule" option in vehicle info step; simplified flow without plate pre-fill |
| **Accident with multiple vehicles** | Not covered | Single claim per vehicle; optional "Autre vehicule implique" field for insurance purposes |
| **Photos taken before opening app** | Not covered | "Importer depuis la galerie" must be prominent; auto-suggest recent photos (last 30 min) from camera roll |
| **Very old accident (not real-time)** | Not covered | Date of accident field (defaults to today); warning if > 5 days old: "Pour un traitement optimal, declarez dans les 5 jours" |
| **No damage photos possible (dark, rain)** | Not covered | "Je ne peux pas prendre de photos maintenant" option; claim submitted without photos; garage contacted to arrange photo session |
| **User changes phone mid-claim** | Not covered | Account-based data persistence; login on new device recovers claim state |

### 7.2 Garage Selection Edge Cases

| Edge Case | Current PRD Coverage | Recommended Handling |
|-----------|---------------------|---------------------|
| **Only 1 garage in area** | Not covered | Skip comparison; direct to single garage detail with "Seul garage disponible a proximite" label |
| **Garage closes between search and booking** | Not covered | Real-time availability check at booking time; error state if closed: "Ce garage est actuellement ferme" |
| **User at country border (garages in different countries)** | Not covered | Filter to France-only garages; or configurable country in settings for future expansion |
| **User in area with no Carlib garages at all** | Not covered | "Carlib n'est pas encore disponible dans votre zone. Etre notifie du lancement?" waitlist CTA |
| **GPS spoofing / VPN location** | Not covered | Server-side distance validation; flag anomalous location patterns |
| **Garage has perfect availability but poor reviews (future)** | Not covered | No rating system in MVP; plan for rating weight in sort algorithm for V2 |

### 7.3 Booking Edge Cases

| Edge Case | Current PRD Coverage | Recommended Handling |
|-----------|---------------------|---------------------|
| **Driver wants to cancel booking** | Not covered | Cancel CTA on booking recap; cancellation policy (e.g., free > 24h before, confirmation required < 24h); garage notified of cancellation |
| **Driver wants to reschedule** | Not covered | "Modifier mon RDV" CTA; opens calendar with current slot highlighted; old slot released on new confirmation |
| **Garage cancels a booking** | Not covered | Push notification to driver: "Votre RDV a ete annule par le garage. Choisir un nouveau creneau?"; reason displayed if provided |
| **Driver no-shows** | Not covered | Garage marks no-show; driver notified; repeated no-shows could affect account (future); booking freed for others |
| **Booking in the past (time zone edge)** | Not covered | Prevent booking slots < 2 hours from now; timezone-aware slot display |
| **Public holidays (garage closed)** | Not covered | French public holiday database; garages can bulk-block holiday dates; prevent booking on blocked dates |
| **Booking for immediate / urgent repair** | Not covered | "Urgent" flag on claim; garages with same-day availability highlighted; "Depannage immediat" flow (future) |

### 7.4 Status Tracking Edge Cases

| Edge Case | Current PRD Coverage | Recommended Handling |
|-----------|---------------------|---------------------|
| **Garage forgets to update status** | Not covered | Automated reminder to garage if no status change in X days (configurable); driver can "ping" garage: "Demander une mise a jour" |
| **Repair takes much longer than expected** | Not covered | Estimated completion date field (optional, set by garage); notification if estimate passes without "Termine" status |
| **Garage wants to add sub-statuses** | Not covered | MVP: keep 4 statuses only. V2: allow custom sub-statuses (e.g., "En attente de pieces", "Peinture en cours") |
| **Driver disputes repair quality** | Not covered | Out of MVP scope; V2: dispute/complaint flow; for MVP: garage contact info always visible |
| **Vehicle totaled (not repairable)** | Not covered | Additional status: "Non reparable" with explanation field; insurance liaison guidance (future) |
| **Multiple repairs on same vehicle** | Not covered | Each claim is independent; vehicle history view aggregating past claims (future) |

### 7.5 Marketplace Logic Edge Cases

| Edge Case | Current PRD Coverage | Recommended Handling |
|-----------|---------------------|---------------------|
| **Attribution model undefined** | Flagged as open question #2 in PRD | Design both flows: (A) first-to-accept auto-attribution; (B) driver selects from interested garages. Make UI adaptable to either with feature flag |
| **No garage accepts within timeout** | Not covered | Escalation flow: widen geographic radius automatically; notify driver with options (widen search, contact support, try again later) |
| **Garage accepts then becomes unavailable** | Not covered | Garage can "release" a dossier back to marketplace; driver notified; claim status reverts to "En attente" |
| **Multiple garages accept simultaneously** | Partially covered ("premier acceptant") | If auto-attribution: first server-received acceptance wins; others get "Dossier deja attribue". If driver-selects: queue of interested garages presented to driver |
| **Claim visibility window** | Not covered | Claims visible for configurable duration (e.g., 48h); expired claims archived; driver prompted to re-declare or contact support |
| **Garage coverage zone overlap** | Not covered | A claim can appear for multiple garages in overlapping zones; each sees it independently |

### 7.6 Account & Authentication Edge Cases

| Edge Case | Current PRD Coverage | Recommended Handling |
|-----------|---------------------|---------------------|
| **User registers as wrong role** | Not covered | Role switch option in settings (requires re-verification for garage); or separate apps/entry points per role |
| **User wants both roles (driver who owns a garage)** | Not covered | Allow dual-role accounts; role switcher in profile/settings; separate home screens per role |
| **Account deletion (GDPR)** | Not covered but legally required | Settings > "Supprimer mon compte" with data deletion confirmation; 30-day grace period; active claims must be resolved first |
| **Garage owner has multiple locations** | Not covered | Multi-location garage profile; switch between locations; separate calendars per location |
| **Minor user (< 18)** | Not covered | Age verification at registration (date of birth); minors cannot create claims (legal implications of insurance declarations) |

---

## 8. Recommendations

### 8.1 Define Before Wireframing

The following interaction patterns and decisions MUST be resolved before beginning wireframe production. Each unresolved item introduces divergent design paths.

#### Priority 1 -- Blocking Decisions

| # | Decision | Impact | Recommendation |
|---|----------|--------|----------------|
| 1 | **Attribution model (open question #2 in PRD)** | Completely changes the garage selection flow and marketplace UI for both roles | Design the driver flow assuming "driver selects from interested garages" (more flexible UX); make the garage acceptance flow compatible with both models via feature flag. This gives the driver more agency (aligned with "zero friction" principle) and is easier to simplify later (auto-assign = auto-select first) than the reverse |
| 2 | **Garage interface form factor (open question #3 in PRD)** | Determines if garage flow is designed for phone-only or responsive to tablet/desktop | Recommend mobile-first with responsive breakpoints. Garages will use the app in-workshop (mobile/tablet). Calendar management strongly benefits from a wider screen. Design mobile-first but ensure calendar grid works at tablet width |
| 3 | **Claim draft persistence** | Affects data architecture and offline capability | Implement local draft auto-save from step 1 of declaration. A user in a post-accident stress context may be interrupted at any point. Losing progress would be a critical friction violation |
| 4 | **Photo requirements (minimum/maximum)** | Impacts declaration flow completion criteria | Recommend: minimum 1 photo required to submit, 3-5 recommended with guided prompts, maximum 10. Allow submit without photos only with explicit "Je ne peux pas prendre de photos" toggle and reason |

#### Priority 2 -- Design System Patterns

| # | Pattern | Why Define Early |
|---|---------|-----------------|
| 5 | **Bottom sheet behavior** | Used in garage detail, booking confirmation, slot creation, filters. Must define: peek heights, snap points, dismiss behavior, interaction with content behind |
| 6 | **Toast / snackbar system** | Used for: status update confirmation, error feedback, undo actions, sync status. Must define: position, duration, action button behavior, stacking rules, priority levels |
| 7 | **Loading skeleton system** | Every list and detail screen needs consistent skeleton patterns. Define: card skeleton, list skeleton, map skeleton, calendar skeleton, profile skeleton |
| 8 | **Empty state illustration system** | 10+ empty states needed. Define: consistent illustration style, copy tone (reassuring, actionable), CTA placement |
| 9 | **Badge and notification indicator system** | Tab bar badges, list item indicators, status badges. Define: color coding, number display rules, dismissal behavior |
| 10 | **Progress indicator system** | Declaration stepper, repair status stepper, upload progress, loading spinners. Define: linear vs. circular, determinate vs. indeterminate, color and animation consistency |

#### Priority 3 -- Micro-Interaction Specifications

| # | Interaction | Specification Needed |
|---|------------|---------------------|
| 11 | **Photo capture animation** | Shutter feedback, thumbnail slide-in, progress ring, success checkmark -- define the full sequence |
| 12 | **Status change animation** | Timeline node appearance, progress bar fill, pulse effect on current status -- must feel rewarding and informative |
| 13 | **Booking confirmation celebration** | Success state for booking: confetti? checkmark animation? calendar drop? Define the emotional moment |
| 14 | **Map pin clustering and selection** | Cluster break-apart animation, selected pin scale/bounce, deselect transition |
| 15 | **Pull-to-refresh custom animation** | Brand-aligned refresh indicator (e.g., car-themed spinner) vs. standard platform spinner |
| 16 | **Swipe-to-action thresholds** | Distance and velocity thresholds for swipe actions on cards; visual feedback during swipe (color reveal, icon scale) |

### 8.2 Interaction Principles to Codify

Based on the PRD analysis, the following principles should guide all interaction decisions:

1. **Stress-Aware Design** -- The driver is post-accident. Every interaction must assume reduced cognitive capacity: larger touch targets, fewer choices per screen, forgiving input (undo, retry, draft save), reassuring copy.

2. **Progressive Disclosure** -- Never show all information at once. Use bottom sheets, expandable cards, and step-by-step flows. The PRD's "maximum 3 actions per screen" rule must be strictly enforced.

3. **Offline-Resilient** -- Accidents happen in areas with poor connectivity. Photo capture, form input, and claim drafts must work fully offline. Sync when connected. Never lose user data.

4. **Instant Feedback** -- Every tap, swipe, and submission must have immediate visual and haptic feedback. Use optimistic UI updates for status changes. Never leave the user wondering "did that work?"

5. **Notification as Navigation** -- Push notifications are primary re-engagement. Every notification must deep-link to the exact relevant screen. In-app notification center serves as backup for missed pushes.

6. **Race-Condition Transparency** -- The marketplace model means multiple garages compete for claims. UI must handle the inherent race condition gracefully: real-time availability, conflict resolution messaging, and no dead-end states.

7. **Symmetry of Information** -- When a garage updates status, the driver sees it. When a driver books, the garage sees it. Both parties must always have the same understanding of the claim state. Design bidirectional confirmation for every state change.

### 8.3 Prototype Testing Priorities

The following interactions carry the highest risk and should be prototype-tested on real mobile devices before finalizing the design:

| Priority | Interaction | Test Focus |
|----------|-----------|------------|
| 1 | Photo capture flow under stress | Can users capture 3+ usable photos in under 2 minutes with the guided overlay? Test outdoors, in poor lighting, with simulated stress |
| 2 | Garage selection (map + list + bottom sheet) | Is the map-list synchronization intuitive? Can users find and compare garages in under 1 minute? Test the bottom sheet drag zones |
| 3 | Calendar booking flow | Can users identify available slots and complete booking in under 30 seconds? Test with sparse availability to verify empty state handling |
| 4 | Status tracking comprehension | Do users understand the 4-status model? Is the timeline visualization clear? Test with notifications arriving mid-session |
| 5 | Garage claim acceptance (race condition) | Does the "claim already taken" error feel fair and not frustrating? Test the flow of seeing a claim, spending time reviewing, then finding it unavailable |
| 6 | Garage calendar management | Can a garage owner set up a week of availability in under 3 minutes? Test slot creation, blocking, and conflict scenarios on phone-sized screen |

### 8.4 Animation Performance Budget

All animations must respect the following performance constraints for a smooth 60fps experience on mid-range devices:

| Animation Type | Duration | Easing | Max Concurrent |
|---------------|----------|--------|----------------|
| Screen transition (push/pop) | 300ms | ease-in-out | 1 |
| Bottom sheet snap | 250ms | spring (damping: 0.8) | 1 |
| Card expansion | 200ms | ease-out | 1 |
| Loading skeleton shimmer | 1500ms loop | linear | Unlimited (GPU-accelerated) |
| Success checkmark (Lottie) | 800ms | built-in | 1 |
| Status node appearance | 400ms | spring (damping: 0.7) | 1 |
| Toast enter/exit | 200ms / 150ms | ease-out / ease-in | 2 max stacked |
| Photo thumbnail slide-in | 200ms | ease-out | 1 |
| Map pin bounce (selection) | 300ms | spring | 1 |
| Pull-to-refresh indicator | Variable | linear | 1 |

### 8.5 Accessibility Interaction Requirements

| Requirement | Specification |
|------------|---------------|
| **Minimum touch target** | 44x44 points (iOS) / 48x48 dp (Android) for all interactive elements |
| **Gesture alternatives** | Every swipe action must have a tap-based alternative (button) for motor accessibility |
| **Screen reader flow** | Declaration steps must be navigable via VoiceOver/TalkBack with meaningful labels in French |
| **Reduced motion** | Respect OS "Reduce Motion" setting: replace animations with fades, disable parallax and spring effects |
| **Color independence** | Status indicators must not rely on color alone: add icons (checkmark, clock, wrench, flag) to each status |
| **Keyboard navigation** | For tablet/web garage interface: full keyboard navigation support on calendar and forms |
| **Text scaling** | All screens must support Dynamic Type / system font scaling up to 200% without layout breakage |
| **Contrast ratios** | WCAG AA minimum (4.5:1 for body text, 3:1 for large text and UI components) |

---

## Appendix A: State Machine -- Claim Lifecycle

```
                                    [DRAFT]
                                      |
                                  (user submits)
                                      |
                                      v
                                  [SUBMITTED]
                                   /      \
                  (garage accepts)     (timeout / no garage)
                        |                    |
                        v                    v
                  [ATTRIBUTED]          [EXPIRED]
                        |                    |
                (booking confirmed)   (user re-declares
                        |              or widens search)
                        v
                    [BOOKED]
                        |
                  (vehicle received)
                        |
                        v
                  [EN REPARATION]
                        |
                    (repair done)
                        |
                        v
                    [TERMINE]
                        |
                  (vehicle picked up)
                        |
                        v
                    [ARCHIVE]
```

**Possible regressions:**
- ATTRIBUTED --> SUBMITTED (garage releases dossier)
- BOOKED --> ATTRIBUTED (booking cancelled by either party)
- Any state --> [CANCELLED] (user cancels claim)

## Appendix B: State Machine -- Garage Availability Slot

```
    [AVAILABLE]
      /    \
(booked)  (blocked)
    |         |
    v         v
[BOOKED]  [BLOCKED]
    |         |
(cancelled) (unblocked)
    |         |
    v         v
[AVAILABLE] [AVAILABLE]
```

## Appendix C: Notification Quiet Hours & Frequency Caps

| Rule | Specification |
|------|---------------|
| **Quiet hours** | No push notifications between 22:00 and 07:00 (user timezone) unless marked URGENT |
| **URGENT exceptions** | Claim acceptance, booking cancellation by garage, vehicle ready |
| **Frequency cap** | Maximum 8 push notifications per day per user |
| **Batching** | Non-urgent notifications batch and send at next reasonable window (08:00, 12:00, 18:00) |
| **Driver preference** | Settings screen: notification toggle per category (status updates, reminders, marketing) |
| **Garage preference** | Settings screen: notification toggle per category (new claims, bookings, reminders) |

---

*This analysis is based on PRD Carlib v0.1 (Draft, March 2026) by Digital Unicorn. All open questions from Section 9 of the PRD are flagged where they impact interaction design decisions. This document should be updated as those questions are resolved.*
