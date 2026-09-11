> Historical — written against the SwiftUI app, now archived at `archive/swift/`. The product is `mobile/`.

# PRD Review -- iOS 26 / SwiftUI Implementation Lens

**Reviewer:** Design Reviewer Agent (iOS/SwiftUI Specialist)
**Document:** PRD Carlib -- Phase Design UX/UI, v0.1 Draft
**Author:** Digital Unicorn
**Date of Review:** 2026-04-06
**Platform Target:** iOS 26, Xcode 26, SwiftUI, iPhone only, Portrait only, French only, zero external dependencies

---

## 1. PRD Completeness for iOS Implementation

### 1.1 What Is Well-Defined

The PRD provides a solid product vision, two clear personas, ten user stories, a MoSCoW priority matrix, and a phased roadmap. For a design-phase document, the functional scope and marketplace logic are articulated well enough to begin UX wireframing.

### 1.2 What Is Missing -- iOS-Critical Gaps

The PRD was written as a design-phase brief, not a technical specification. This is expected for a Phase 0 document. However, nine categories of iOS-critical information are entirely absent. Each one will eventually need to be defined before SwiftUI implementation begins, and several affect design decisions that are being made *now*.

| Gap | Severity for Design Phase | Severity for Dev Phase | Analysis |
|-----|--------------------------|----------------------|----------|
| **Navigation model** | HIGH | CRITICAL | The PRD does not specify whether Carlib uses a `TabView`-based architecture (tabs at bottom), a `NavigationStack`-based linear flow, or a hybrid. For a two-sided marketplace with role switching (driver vs. garage), the navigation architecture is a design-phase decision. A `TabView` with 4-5 tabs per role is the natural iOS pattern, but this creates questions: do both roles share the same tab bar? Is there a role-switch mechanism? The PRD mentions both personas "configure son role a l'onboarding" (Section 3) but never specifies whether role switching is possible post-onboarding, which determines whether the app needs one navigation tree or two. |
| **Data model / persistence** | LOW | CRITICAL | Not needed for design, but the PRD's silence on the data model means designers are building forms without knowing what fields exist in a "dossier sinistre." CLAUDE.md confirms architecture is "TBD." For SwiftUI, the key question is whether the app uses SwiftData (iOS 17+), Core Data, or is purely server-driven. This affects whether designs need to account for local draft states, sync indicators, and conflict resolution UI. |
| **Authentication approach** | HIGH | CRITICAL | Section 3 references onboarding with role selection, but no authentication method is specified anywhere. For iOS 26, the options are: Sign in with Apple (required by App Store Review Guidelines if any third-party login is offered), email/password, phone/OTP, or passkeys. Each produces fundamentally different first-run screens. Sign in with Apple is a single button; phone/OTP requires a number pad and verification code screen; email/password requires two fields plus a forgot-password flow. The design team cannot design the first 3-5 screens without this decision. |
| **Networking / API architecture** | LOW | CRITICAL | Not needed for design phase, but the PRD's "zero external dependencies" constraint (from CLAUDE.md) means no Alamofire, no Moya -- all networking must use `URLSession` and `async/await` natively. This is fine for iOS 26 but constrains image loading (no Kingfisher/SDWebImage -- must build a custom `AsyncImage` pipeline or use the built-in `AsyncImage` view with its limitations). Designers should know that image-heavy screens (garage photos, damage photos) may have visible loading states that differ from what Kingfisher would produce. |
| **Offline behavior** | HIGH | HIGH | The PRD is silent on offline capability (flagged in 06_prd_review.md). For iOS SwiftUI, this is a design-phase decision because it determines whether the claim declaration flow (US01) can work without connectivity. A post-accident user on a rural road may have no signal. If offline is supported, the design needs: an offline indicator banner, queued-upload indicators for photos, a "will send when connected" confirmation pattern, and conflict resolution if the server state changed while offline. If offline is *not* supported, the design needs: a blocking "no connection" screen and graceful degradation messaging. Either way, the design team needs an answer. |
| **Background task requirements** | LOW | HIGH | Photo uploads from the claim declaration (US01) may take significant time, especially with multiple high-resolution images. On iOS, if the user backgrounds the app during upload, the upload will be killed after ~30 seconds unless the app uses `BGTaskScheduler` or `URLSession` background transfers. This affects design: should there be a "stay in the app while photos upload" message, or can the user leave and get a notification when upload completes? |
| **Push notification payload design** | MEDIUM | HIGH | US04 explicitly requires push notifications for repair status changes. US07 triggers notifications when the garage updates status. The PRD mentions push notifications five times but never defines: the notification categories (actionable notifications with buttons?), the payload structure, whether notifications support images (rich notifications), or whether the app should use provisional push authorization (iOS 12+) to avoid the permission dialog on first launch. For design, the key question is whether notifications are just alerts or whether they include action buttons (e.g., "Voir le statut" / "Appeler le garage"). |
| **Deep linking / URL scheme** | LOW | MEDIUM | Not explicitly needed for MVP design, but if the landing page (US10) links to the App Store, and if notifications need to deep-link to specific claim screens, the navigation architecture must support `onOpenURL` routing. This is a SwiftUI `NavigationStack` path-based routing concern. |
| **App Store considerations** | LOW | CRITICAL | The App Store has specific requirements that affect design: the app must provide value without requiring a login (or use Sign in with Apple), the app must not be a thin client for a website, and marketplace apps face specific scrutiny under App Store Review Guideline 3.1.1 (in-app purchase for digital services -- though Carlib's physical repair services are exempt). The landing page (US10) being *inside* the app rather than as a website would raise questions about whether the app has enough native functionality at launch. |

### 1.3 Critical Observation

The PRD was written with platform ambiguity -- Section 3 says "iOS & Android" while CLAUDE.md says "iOS 26 only." This discrepancy must be resolved. The PRD's mention of Android influences design decisions (Material Design considerations, Android-specific patterns like back gesture behavior) that are irrelevant if the platform is truly iOS-only. The design team should design exclusively for iOS Human Interface Guidelines if the platform decision is final.

---

## 2. User Story Quality Audit -- iOS Implementation Lens

Each of the 10 user stories is evaluated for what an iOS/SwiftUI developer would need to know that the story does not provide.

### US01: Claim Declaration

**Story:** "En tant que conducteur sinistre, je veux declarer mon sinistre en quelques etapes guidees depuis mon telephone."

**iOS gaps:**
- **Camera permissions.** The acceptance criteria specify "prise de photos assistee" but do not address the `NSCameraUsageDescription` flow. iOS requires a system permission dialog before the camera can be accessed. The design must include a pre-permission screen explaining *why* photos are needed (best practice to increase acceptance rates). It must also handle the case where the user denies camera access -- does the flow offer photo library import as a fallback? Or is camera access mandatory?
- **Photo storage strategy.** Multiple high-resolution photos of vehicle damage could easily total 50-100 MB. The PRD does not specify: maximum number of photos, whether photos are compressed before upload, whether photos are stored locally (SwiftData/file system) or only uploaded, and what happens if the device runs out of storage. For SwiftUI, this determines whether to use `PhotosPicker` (iOS 16+), a custom `AVCaptureSession` camera view, or UIKit's `UIImagePickerController` wrapped in `UIViewControllerRepresentable`.
- **Location permissions.** The acceptance criteria mention "localisation" but do not specify whether location is auto-detected (requiring `CLLocationManager` and `NSLocationWhenInUseUsageDescription`), manually entered via address search, or pin-dropped on a map. Each requires different iOS entitlements and produces different UI patterns.
- **Draft persistence.** The PRD does not specify whether a partially completed claim is saved as a draft. On iOS, if the user receives a phone call mid-declaration, the app may be terminated. Without draft saving, the user loses all progress. This is especially painful in a post-accident stress context.

**Verdict:** Story is designable for happy path only. Needs 4-6 supplementary requirements for iOS implementation.

### US02: Garage Discovery Map

**Story:** "En tant que conducteur, je veux voir les garages disponibles a proximite avec leurs caracteristiques."

**iOS gaps:**
- **MapKit entitlement.** Displaying a map with garage pins requires MapKit, which is a first-party Apple framework (not an external dependency, so it complies with the zero-dependency constraint). However, the new SwiftUI `Map` view in iOS 17+ behaves differently from the UIKit `MKMapView`. The design should account for: map annotation clustering when many garages are nearby, the map/list toggle interaction pattern, and whether the map uses Apple Maps or just coordinates.
- **Location authorization flow.** Showing "nearby garages" requires the user's location. If the user denied location in US01 (or if US01 did not request it), US02 must either request location for the first time (triggering the system dialog) or degrade gracefully by defaulting to a city-level search or address input. The design must handle three states: location authorized, location denied, and location not yet determined.
- **Search radius.** The PRD says "a proximite" but never defines the radius. Is it 5 km? 20 km? 50 km? This affects map zoom level, result count, and the "no garages found" threshold. For an iOS map, the initial region (`MKCoordinateRegion`) needs a defined span.
- **Real-time availability.** The acceptance criteria mention "disponibilite" as a filter. Does the garage list refresh in real-time (requiring WebSocket or polling), or is it a static snapshot loaded on screen appearance? This affects whether the SwiftUI view needs an `onAppear` reload, a timer-based refresh, or a persistent connection.

**Verdict:** Designable, but the location authorization flow and "no results" state are critical missing pieces.

### US03: Booking

**Story:** "En tant que conducteur, je veux selectionner un garage et reserver un creneau de depot de vehicule."

**iOS gaps:**
- **Calendar integration.** The acceptance criteria mention "calendrier des disponibilites du garage." Does this refer to an in-app calendar view (custom SwiftUI component), or should the booking be added to the user's system calendar via `EventKit`? If the latter, `NSCalendarsUsageDescription` is required, and the design needs a "Add to Calendar" prompt.
- **Real-time slot availability.** If another user books the same slot between the time the driver sees it and taps "confirm," what happens? This race condition needs a design pattern: either optimistic locking with an error message ("Ce creneau vient d'etre reserve, veuillez en choisir un autre") or a hold/reservation timer (e.g., "Vous avez 5 minutes pour confirmer").
- **Confirmation delivery.** "Recapitulatif envoye" -- sent via what channel? Push notification? In-app screen? Email? SMS? On iOS, each channel has different reliability characteristics and design implications.

**Verdict:** The booking flow is the most technically complex user story and has the thinnest specification. Needs significant expansion.

### US04: Repair Tracking

**Story:** "En tant que conducteur, je veux suivre le statut de reparation de mon vehicule en temps reel."

**iOS gaps:**
- **Live Activities.** iOS 16+ introduced Live Activities on the Lock Screen and Dynamic Island. For a repair that spans days or weeks, a Live Activity showing the current status ("En reparation -- Carlib Garage Dupont") would be a standout feature. The PRD does not mention this, but it is a natural fit for iOS 26.
- **Push notification entitlement.** "Notifications push a chaque changement de statut" requires the `aps-environment` entitlement, an APNs certificate or key, and a backend capable of sending push payloads. The design needs to account for the notification permission request (when in the flow is it asked? best practice is to ask *after* the first booking, not at first launch) and the denial case (if the user declines notifications, how do they learn about status changes?).
- **Widget support.** An iOS Widget showing "Reparation en cours -- Etape 3/4" on the home screen would reduce the need to open the app. Interactive Widgets (iOS 17+) could let the user tap to see details. The PRD does not mention widgets, but they are a natural extension of US04.
- **"Temps reel" ambiguity.** On iOS, "real-time" could mean: push notifications (reactive, server-initiated), polling (periodic `Timer`-based refresh), or server-sent events / WebSocket (persistent connection). Each has different battery, UX, and backend implications. For a repair status that changes a few times over several days, push notifications are sufficient -- a WebSocket would be over-engineered.

**Verdict:** Well-structured story, but missing iOS-specific delivery mechanisms (Live Activities, Widgets) that would differentiate Carlib from a web wrapper.

### US05-US08: Garage Portal

**Stories:** Garage-side functionality (view claims, manage planning, update status, manage profile).

**iOS mega-gap: Single app or separate app?**

This is the most significant unresolved architectural question for iOS implementation. The PRD presents the driver app and garage portal as a unified product with a "shared design system" (Section 5.1). But the CLAUDE.md says "iPhone only, Portrait only" -- a constraint that works for drivers but is hostile for garage owners who likely use tablets or desktop computers for business management.

Three possible architectures, each with radically different design implications:

| Architecture | Navigation Impact | Design Impact | Development Impact |
|---|---|---|---|
| **Single app, role switching** | One `TabView` that reconfigures based on user role. Role switcher in Settings or profile. | Shared components but two distinct tab configurations. Risk of cognitive overload. | Single Xcode target, single App Store listing. Simpler but larger binary. |
| **Single app, dual account** | A user could be both a driver and a garage owner (Mohamed could also have a personal vehicle). Needs account-level role management. | Profile screen needs multi-role display. Notification routing must distinguish role context. | Complex state management. SwiftUI `@Environment` for current role. |
| **Separate apps** | Two independent apps with independent navigation. | Two design systems (or one shared via Swift Package). Independent App Store listings. | Two Xcode projects or one project with two targets. Double the submission/review process. |

The PRD's open question #3 ("Scope portail garage: interface mobile uniquement ou aussi web/tablette?") partially addresses this, but even within "mobile only," the single-vs-separate-app question is unanswered. This is a design-phase blocker because it determines the information architecture, the navigation model, the onboarding flow, and the screen count.

**Recommendation:** For MVP, a single app with role switching is the pragmatic choice. It halves the development effort, simplifies the App Store presence, and allows a garage owner to also be a driver. The role switch should be at the tab-bar level: different tabs appear based on role, with a role-switch control in the profile/settings tab.

### US09: Auto-Transmission

**Story:** "En tant que conducteur, je veux que le dossier sinistre soit transmis automatiquement au garage selectionne."

**iOS gaps:**
- **Backend API dependency.** "Transmission automatique" requires a backend service that the PRD explicitly places out of scope ("Won't -- Developpement technique"). This story cannot function without an API. The design can show the UI ("Dossier transmis" confirmation), but the acceptance criteria ("accuse de reception visible") requires server-side acknowledgment.
- **Data privacy.** When a claim dossier is "transmitted" to a garage, what personal data is shared? Name? Phone number? Insurance policy number? Under RGPD, the user should consent to this data sharing. The design needs a consent confirmation screen: "Vos informations suivantes seront partagees avec [Garage Name]: ..." This is both a legal requirement and a design requirement.

**Verdict:** This story is essentially a backend feature with a thin UI layer. The design can proceed, but the acceptance criteria are untestable without a backend.

### US10: Landing Page

**Story:** "En tant que visiteur de la landing page, je veux comprendre la valeur de la plateforme en 30 secondes et exprimer mon interet."

**iOS mega-gap: Is this a web page or an in-app screen?**

The PRD categorizes this under "Marketing" and describes web-typical content (hero, CTA, form). The CLAUDE.md says "SwiftUI" for everything. These are contradictory for a landing page:

- If it is a **website**, it is not built in SwiftUI and is out of scope for the iOS app project. It would be built in HTML/CSS (or a web framework) and hosted separately.
- If it is an **in-app onboarding/marketing screen**, it is built in SwiftUI but must comply with App Store guidelines -- the app must provide functionality beyond marketing content.
- If it is **both** (a web landing page for garage acquisition, and the app has its own first-launch experience), then US10 is really two separate stories.

The most likely interpretation: US10 is a web landing page for B2B garage acquisition, separate from the iOS app. The iOS app would have its own onboarding experience (which is currently unspecified -- see Section 4 below). The design team should clarify this explicitly and potentially split US10 into "US10a: Web landing page" and "US10b: In-app first launch experience."

---

## 3. Internal Contradictions -- iOS Impact

### Contradiction 1: "iOS & Android" vs. "iOS 26 only"

- **PRD Section 3:** "Les utilisateurs accedent a l'application via une app mobile (iOS & Android)."
- **CLAUDE.md:** "Platform: iOS 26 only (iPhone, Portrait only)."

**iOS impact:** If the platform is truly iOS-only, the design should leverage iOS-specific patterns (swipe-to-go-back, SF Symbols, native `DatePicker` / `ColorPicker`, haptic feedback via `UIImpactFeedbackGenerator`, Dynamic Island). If the design must remain cross-platform-portable, these iOS affordances should be avoided in favor of generic patterns. This is a fundamental design direction question.

**Resolution needed:** Confirm iOS-only with the client. Update the PRD to remove Android references.

### Contradiction 2: "Mobile-first" but garage portal scope undefined

- **PRD Section 5.0:** "Mobile-first: architecture pensee pour le mobile en priorite."
- **PRD Open Question #3:** "Scope portail garage: interface mobile uniquement ou aussi web/tablette pour l'usage atelier?"

**iOS impact:** A garage owner managing weekly planning on an iPhone in Portrait mode is a constrained interaction. A week-view calendar (US06) on a 375pt-wide screen is tight. If the garage portal is mobile-only, the design must work within these constraints and may need to rethink the calendar from a week-grid to a day-list. If tablet/web is added later, the SwiftUI layouts need `GeometryReader`-based or `ViewThatFits`-based responsive design from day one -- retro-fitting responsiveness is expensive.

### Contradiction 3: "No external dependencies" but needs networking, maps, image handling

- **CLAUDE.md:** "Dependencies: None -- zero external packages."
- **PRD features:** Photo upload, map display, real-time status updates, push notifications.

**iOS impact:** This is not truly a contradiction -- Apple's first-party frameworks cover all these needs (`URLSession`, `MapKit`, `PhotosUI`, `UserNotifications`). However, the "zero dependencies" constraint means the development team must build from scratch what libraries normally provide:

| Capability | External Library (forbidden) | Native Alternative | Design Implication |
|---|---|---|---|
| Image caching | Kingfisher, SDWebImage, Nuke | `AsyncImage` (basic) or custom `NSCache`-based loader | Garage photo grids may flash/reload when scrolling. Design should use placeholder shimmer patterns to mask this. |
| Networking layer | Alamofire, Moya | `URLSession` + `async/await` | No automatic retry UI. Design must specify retry patterns explicitly. |
| Map annotations | Mapbox, Google Maps SDK | MapKit `Map` view (SwiftUI) | Limited to Apple Maps styling. No custom map tiles. Annotation clustering requires manual implementation in iOS 17+. |
| Date/calendar UI | FSCalendar, JTAppleCalendar | Custom SwiftUI calendar or `DatePicker` | The garage week-view calendar (US06) will be a custom component. Design must be buildable with SwiftUI layout primitives. |
| Form validation | Combine-based libraries | Manual `@State`/`@FocusState` management | Inline validation timing and error display must be explicitly designed. |

### Contradiction 4: 35+ screens in 6-8 weeks with 3 critical blockers unresolved

- **PRD Section 4.1:** 20+ driver screens + 15+ garage screens = 35+ screens.
- **PRD Section 7:** 6-8 weeks total timeline.
- **PRD Section 9:** 3 questions with "Ouvert" status (brand identity, attribution logic, garage portal scope).

**iOS impact for design:** The 35+ screen count is an underestimate. With iOS-required screens not in the PRD (onboarding, authentication, permissions, settings, error states, empty states), the true count is closer to 50-60 screens. Designing 50+ screens in the 2-3 week UI phase, while three blockers remain open, is unrealistic. Either the timeline extends, the screen count is reduced to true MVP (happy path only, ~25 screens), or the blockers are resolved before the UI phase begins.

### Contradiction 5: "Prototype cliquable complet" but no prototype tool specified

- **PRD Section 8.2:** "Prototype cliquable valide par le client sur mobile reel."
- **Tech stack:** SwiftUI with no development in Phase 0.

**iOS impact:** A "clickable prototype tested on real mobile" is typically built in Figma (with mirror app), Principle, or ProtoPie. However, since the eventual build is SwiftUI, there is an opportunity to build the prototype directly in SwiftUI using `NavigationStack` with mock data and `#Preview` macros. This would produce a prototype that is also the skeleton of the real app. The PRD should clarify whether the prototype is a Figma prototype or a SwiftUI prototype, as this affects whether the Phase 0 deliverables include any code.

---

## 4. Missing Flows for iOS

The following flows are required for any iOS app but are absent from the PRD. Each one translates to 1-3 screens that must be designed.

### 4.1 Critical Missing Flows

#### Onboarding (First Launch)

Every iOS app needs a first-launch experience. The PRD references it in Section 3 ("A l'onboarding, chaque utilisateur configure son profil et ses preferences selon son role") but never specifies it.

**Required screens for iOS:**
1. **Welcome / value proposition** (1-3 swipeable cards or a single hero screen)
2. **Role selection** ("Je suis conducteur" / "Je suis carrossier")
3. **Sign-up / Sign-in** (method TBD -- see authentication gap)
4. **Permission pre-ask: notifications** (custom screen explaining why, before the system dialog)
5. **Permission pre-ask: location** (custom screen explaining why, before the system dialog)
6. **Profile completion** (vehicle info for drivers, business info for garages)

Estimated screen count: 5-8 screens, none of which are in the PRD's "20+ driver screens."

#### Authentication

**Required screens for iOS (minimum):**
1. **Sign-in screen** (email/phone + password, or Sign in with Apple button)
2. **Sign-up screen** (if separate from sign-in)
3. **Verification screen** (OTP code entry if phone-based)
4. **Forgot password** (email entry + confirmation)
5. **Password reset** (new password entry)
6. **Biometric opt-in** ("Utiliser Face ID pour vous connecter ?")

If Sign in with Apple is used (recommended for iOS-only app), screens 2-5 may be unnecessary, reducing to just the Sign in with Apple button + role selection. This is a strong argument for choosing Sign in with Apple.

#### Settings

**Required screens for iOS:**
1. **Settings root** (list of categories)
2. **Account management** (name, email, phone, delete account -- RGPD requirement)
3. **Notification preferences** (toggle per notification type)
4. **Privacy settings** (data sharing preferences, location permission management)
5. **About / legal** (CGU, politique de confidentialite, mentions legales -- legally required in France)
6. **App version / diagnostics** (standard iOS pattern)

Estimated screen count: 4-6 screens, none in the PRD.

### 4.2 Permission Denial Flows

iOS permission denials cannot be re-requested programmatically. Once denied, the app must direct the user to Settings.app. Each permission needs a denial-handling design:

| Permission | When Requested | If Denied | Required Design |
|---|---|---|---|
| **Camera** (`NSCameraUsageDescription`) | US01: photo capture during claim | Cannot take damage photos | "Appareil photo non autorise" screen with explanation + "Ouvrir Reglages" button that calls `UIApplication.shared.open(URL(string: UIApplication.openSettingsURLString)!)` |
| **Location** (`NSLocationWhenInUseUsageDescription`) | US02: nearby garage search | Cannot show nearby garages | "Localisation non autorisee" screen with manual address entry fallback + "Ouvrir Reglages" button |
| **Notifications** (`UNUserNotificationCenter`) | US04: repair status push | No push notifications | In-app notification banner as fallback + periodic "Activez les notifications" prompt (but not more than once per session, per Apple guidelines) |
| **Photo Library** (`NSPhotoLibraryUsageDescription`) | US01: import existing photos | Cannot import from library | "Acces photos non autorise" with camera-only fallback |
| **Calendar** (`NSCalendarsUsageDescription`) | US03: add booking to calendar (if implemented) | Booking not added to system calendar | Silent failure -- booking still works in-app, just not synced to Calendar.app |

Each of these produces 1-2 additional screen states. Total: 5-10 additional states to design, none in the PRD.

### 4.3 Error Recovery Flows

| Error Scenario | iOS Context | Required Design |
|---|---|---|
| **Network loss during photo upload** | `URLSession` task fails with `NSURLErrorNotConnectedToInternet` | "Envoi interrompu" screen with retry button. Photos must be cached locally to avoid re-capture. |
| **Network loss during booking confirmation** | Server never receives the booking request | Ambiguous state: was the slot booked or not? Design must show "Confirmation en attente" with a retry/refresh mechanism. |
| **App killed during claim declaration** | iOS terminates background app due to memory pressure | If no draft saving: all progress lost. Design should auto-save to SwiftData/UserDefaults after each step. If draft exists on relaunch: "Reprendre votre declaration ?" prompt. |
| **Server returns HTTP 500** | Generic server error | "Une erreur est survenue. Veuillez reessayer." with retry button. Must not show raw error codes to users. |
| **Token expiry during active use** | Auth token expires while user is mid-flow | Transparent token refresh (no UI) if refresh token is valid. If refresh fails: redirect to login with "Votre session a expire" message. Must preserve any unsaved state. |
| **App update required** | API returns a "minimum version" response | Full-screen blocking modal: "Mise a jour requise" with "Mettre a jour" button linking to App Store. |

### 4.4 Background / Foreground Transitions

| Scenario | iOS Behavior | Design Need |
|---|---|---|
| User backgrounds app during photo upload (US01) | Upload continues for ~30 seconds, then suspended | Progress indicator on return; "Envoi en cours..." if still uploading; "Envoi termine" if completed in background |
| User backgrounds app during booking (US03) | Slot may be taken by another user while app is backgrounded | On foreground return: refresh slot availability; show "Ce creneau n'est plus disponible" if taken |
| Push notification arrives while app is foregrounded (US04) | Notification does not appear as banner; must be handled in-app | In-app notification banner (custom SwiftUI overlay) mirroring the push content |
| App is terminated and relaunched via notification deep link (US04) | Cold launch directly to a specific screen | Navigation stack must support programmatic path construction from notification payload |

---

## 5. iOS 26 Feature Alignment

iOS 26 (announced WWDC 2025, released September 2025) introduces features that are natural fits for Carlib. The PRD should explicitly address whether these are in scope for design.

### 5.1 Live Activities (iOS 16+, enhanced in iOS 26)

**Fit:** Repair tracking (US04) is the textbook use case for Live Activities. A Lock Screen widget showing:
```
Carlib -- Garage Dupont
[====>    ] En reparation
Estimation: Vendredi 10 avril
```
This keeps the driver informed without opening the app. The Dynamic Island (iPhone 14 Pro+) could show a compact repair status indicator.

**Design implication:** Requires designing a `WidgetKit` Live Activity layout in three sizes (compact, minimal, expanded). Adds 3 design variants to the screen count.

**Recommendation:** Include as a "Should" item. It is a differentiator that costs relatively little design effort.

### 5.2 Interactive Widgets (iOS 17+)

**Fit:** A home screen widget showing current claim status with a "Voir details" button that deep-links to the tracking screen. For garages, a widget showing "3 nouveaux sinistres" with a tap-to-open action.

**Design implication:** Requires designing small (2x2), medium (4x2), and optionally large (4x4) widget layouts. Adds 2-4 design variants.

**Recommendation:** Include as a "Could" item for V1. Not critical for MVP design phase.

### 5.3 StandBy Mode (iOS 17+)

**Fit:** Limited. StandBy mode is for when the iPhone is charging on its side (landscape). Since Carlib is Portrait-only and usage context is mobile/on-the-go, StandBy mode is low priority.

**Recommendation:** Exclude from scope.

### 5.4 Focus Filters (iOS 16+)

**Fit:** Garage owners could configure a "Work" Focus that only shows Carlib notifications for new claims during business hours. Drivers could suppress Carlib notifications during a "Driving" Focus (ironic but realistic -- notifications while driving are dangerous).

**Design implication:** Minimal -- Focus Filters are configured in Settings.app, not in the app itself. The app just needs to tag notifications with the correct `INRelevantShortcut` categories.

**Recommendation:** No design action needed in Phase 0. Implement during development.

### 5.5 New SwiftUI APIs Relevant to Carlib

| API | Available Since | Carlib Use Case | Design Consideration |
|---|---|---|---|
| `NavigationStack` + `NavigationPath` | iOS 16 | Core navigation for all flows | Design should assume stack-based navigation with swipe-back gesture |
| `MapKit` SwiftUI `Map` view with `Annotation` | iOS 17 | US02: garage map | Design can use standard Apple Maps appearance; custom annotation designs must be simple shapes |
| `PhotosPicker` | iOS 16 | US01: photo selection | Multi-photo selection UI is system-provided; design need only specify what happens after selection |
| `ScrollView` with `scrollPosition` | iOS 17 | US06: week calendar scrolling | Enables programmatic scroll-to-today in the garage calendar |
| `ContentUnavailableView` | iOS 17 | Empty states throughout | Apple provides a standard empty-state pattern (icon + title + description + action). Design should align with this native pattern for consistency. |
| `.searchable` modifier | iOS 15 | US02: garage search by name/location | Provides native search bar integration in NavigationStack |
| `TipKit` | iOS 17 | Onboarding hints, feature discovery | Can replace custom tooltip/coach-mark designs with the native tip system |
| `SwiftData` `@Model` + `@Query` | iOS 17 | Local draft persistence, claim cache | If used, affects data flow patterns in the app |
| `.sensoryFeedback` modifier | iOS 17 | Haptic feedback on status changes, button presses | Design should specify where haptic feedback is used (booking confirmation, status update, error) |
| `ControlWidget` | iOS 18 | Quick toggle in Control Center | Could add a "Declarer un sinistre" quick action. Low priority. |

### 5.6 iOS 26 Specific Enhancements

iOS 26 (based on anticipated features from WWDC 2025 announcements) likely includes enhancements to:
- **SwiftUI performance** -- more efficient list rendering, which benefits the garage claim list (US05)
- **MapKit** -- improved annotation clustering and look-around integration
- **WidgetKit** -- richer interactivity and animation in widgets
- **Accessibility** -- enhanced VoiceOver hints and custom rotor actions

The design team should target iOS 26 as the minimum deployment target (per CLAUDE.md), which means all APIs from iOS 16-26 are available. This is unusually aggressive -- most production apps target iOS 16 or 17 as minimum. An iOS 26 minimum means the app is only available to users who have updated to the latest OS. As of April 2026, iOS 26 adoption is likely 60-70%, which excludes 30-40% of potential users. The design team should flag this as a business risk.

---

## 6. Accessibility Gap Analysis

### 6.1 Current PRD State

The PRD mentions accessibility exactly twice:
1. **Section 8.1 (DoD):** "Accessibilite verifiee" -- with no standard declared.
2. **Section 8.2 (UX/Parcours):** "Accessibilite verifiee" -- repeated.

CLAUDE.md adds: "Prioritize accessibility (WCAG AA minimum) in all design decisions."

The gap between these two statements is significant. The PRD says "verified" without defining what is being verified. CLAUDE.md sets WCAG AA as the target but the PRD itself does not.

### 6.2 What "WCAG AA" Means for a SwiftUI App

WCAG 2.1 AA is a web standard. For a native iOS app, the equivalent is adherence to Apple's Accessibility guidelines plus the RGAA 4.1 (Referentiel General d'Amelioration de l'Accessibilite) which is the French government's accessibility standard, largely aligned with WCAG 2.1 AA.

| WCAG AA Criterion | iOS/SwiftUI Implementation | PRD Specifies? |
|---|---|---|
| **1.1.1 Non-text content** | Every `Image` and icon needs `.accessibilityLabel()`. Decorative images need `.accessibilityHidden(true)`. | No |
| **1.3.1 Info and relationships** | Semantic SwiftUI views (`Text`, `Label`, `Button`) convey structure. Custom views need `.accessibilityElement()` grouping. | No |
| **1.4.3 Contrast minimum (4.5:1)** | All text/background color pairs must meet 4.5:1 for normal text, 3:1 for large text (>18pt or >14pt bold). | No |
| **1.4.4 Resize text (200%)** | SwiftUI `@ScaledMetric` and Dynamic Type support. Layouts must not break at `AX5` (the largest accessibility text size). | No |
| **1.4.11 Non-text contrast (3:1)** | UI components (buttons, inputs, icons) must have 3:1 contrast against adjacent colors. | No |
| **2.1.1 Keyboard** | Full VoiceOver navigation. Every interactive element reachable via swipe-through. Custom gestures need `.accessibilityAction()` alternatives. | No |
| **2.4.3 Focus order** | VoiceOver reading order must be logical. SwiftUI's default order follows view hierarchy, but custom layouts may need `.accessibilitySort Priority()`. | No |
| **2.5.5 Target size (44x44pt minimum)** | Apple HIG specifies 44x44pt touch targets. Buttons, links, and interactive elements must meet this minimum. | No |
| **3.1.1 Language of page** | The app's `CFBundleDevelopmentRegion` must be `fr`. VoiceOver must read French content in a French voice. | Partially (French only stated) |
| **3.3.1 Error identification** | Form errors must be described in text (not just color). `.accessibilityHint()` for error states. | No |
| **4.1.2 Name, Role, Value** | Every custom component needs `.accessibilityLabel()`, `.accessibilityValue()`, and `.accessibilityTrait()`. | No |

### 6.3 Specific Accessibility Gaps

| Area | Gap | Recommendation |
|---|---|---|
| **WCAG level** | Not declared in PRD. CLAUDE.md says "AA minimum" but the design deliverables do not reference a standard. | Add "WCAG 2.1 AA / RGAA 4.1" to the PRD's DoD, Section 8.1. |
| **VoiceOver** | No mention in any document. | Add acceptance criterion: "All screens navigable via VoiceOver with logical reading order and meaningful labels." |
| **Dynamic Type** | No mention. | Add acceptance criterion: "All screens tested at Default and AX3 Dynamic Type sizes without layout breakage or text truncation." Specify which text elements use `.minimumScaleFactor()` vs. line wrapping. |
| **Color contrast** | No color palette exists yet (open question #1). | When brand colors are defined, every foreground/background pair must be verified for 4.5:1 (normal text) and 3:1 (large text, UI components). |
| **Touch targets** | No minimum specified. | Add to DoD: "All interactive elements minimum 44x44pt." The design system should enforce this as a component-level constraint. |
| **Motor accessibility** | No mention. | The claim declaration flow (US01) involves a camera, which requires physical manipulation of the device. Consider voice-activated photo capture or a hands-free timer mode. |
| **Reduce Motion** | No mention. | SwiftUI `.accessibilityReduceMotion` check. Any animations in transitions, progress indicators, or map movements must respect this preference. Add "All animations respect Reduce Motion preference" to DoD. |
| **Color blindness** | No mention. | Status indicators (en attente / pris en charge / en reparation / termine) must not rely solely on color. Use icons + text + color. The design system must define status indicators with redundant encoding. |
| **Cognitive accessibility** | The PRD mentions "simplicite grand public" and "max 3 actions par ecran" which is good for cognitive load. | Formalize: "No screen requires more than 3 primary actions. All multi-step flows show progress indication. All destructive actions require confirmation." |

### 6.4 French Accessibility Legal Context

In France, mobile applications of public service providers must comply with RGAA 4.1. Carlib is a private company, so RGAA compliance is not legally mandatory. However:
- The European Accessibility Act (Directive 2019/882) requires accessibility for consumer products and services by June 2025. Carlib, as a consumer service, may fall under this directive.
- Apple's App Store Review Guidelines recommend (but do not require) accessibility support.
- Designing for accessibility from the start is 10x cheaper than retrofitting.

**Recommendation:** Declare RGAA 4.1 compliance as a design target. It aligns with WCAG 2.1 AA and is the standard French regulators will reference.

---

## 7. Scoring

### Scoring Rubric

Each dimension is scored 1-5:
- **1** = Absent or unusable for the stated purpose
- **2** = Present but critically incomplete
- **3** = Adequate foundation with significant gaps
- **4** = Good coverage with minor gaps
- **5** = Complete and ready for implementation

### Scores

| Dimension | Score | Justification |
|---|---|---|
| **Completeness** | 2.5 / 5 | The PRD covers the product vision, personas, user stories, and roadmap well. However, it is missing onboarding, authentication, settings, permission flows, error states, and the data model -- all of which are required before SwiftUI implementation. Roughly 40% of the screens that will need to be built are not mentioned in the PRD. |
| **Clarity** | 3.5 / 5 | What is documented is clearly written and well-structured. The MoSCoW table, user stories, and roadmap are easy to parse. The French language and domain vocabulary are handled with care. Deducted for ambiguous terms ("temps reel," "complet," "20+ ecrans") and the iOS/Android contradiction. |
| **iOS-Readiness** | 1.5 / 5 | The PRD was written as a platform-agnostic design brief. It contains zero iOS-specific considerations: no mention of SwiftUI, navigation patterns, system permissions, entitlements, Live Activities, Widgets, VoiceOver, Dynamic Type, or App Store requirements. Everything needed for iOS implementation must be added in a supplementary document or during Phase 0 kickstart. |
| **Scope Realism** | 2.0 / 5 | 35+ screens in 6-8 weeks with 3 critical blockers and no brand identity is aggressive. The true screen count with iOS-required flows is 50-60. The PRD also underestimates the design complexity of the garage calendar (US06) and the marketplace attribution logic (open question #2). Wireframes being "Should" rather than "Must" adds risk. |
| **Accessibility Coverage** | 1.0 / 5 | "Accessibilite verifiee" without a declared standard, without VoiceOver requirements, without Dynamic Type specs, without contrast minimums, without touch target sizes, is essentially zero accessibility specification. The word "accessibility" appears twice, both times as a checkbox item with no definition. |

### Overall Score: 2.1 / 5

**Weighted calculation:**

| Dimension | Score | Weight | Weighted |
|---|---|---|---|
| Completeness | 2.5 | 25% | 0.625 |
| Clarity | 3.5 | 15% | 0.525 |
| iOS-Readiness | 1.5 | 25% | 0.375 |
| Scope Realism | 2.0 | 20% | 0.400 |
| Accessibility Coverage | 1.0 | 15% | 0.150 |
| **Total** | | **100%** | **2.075** |

### Score Interpretation

A 2.1/5 does not mean the PRD is bad -- it means the PRD was written for a different purpose (design-phase kickoff) and is being evaluated against a different standard (iOS implementation readiness). As a design-phase brief, the existing 06_prd_review.md rated it 3.3/5, which is fair. Through the iOS implementation lens, the gap is wider because the PRD contains no platform-specific information whatsoever.

This score should improve to 3.5+ after the recommended amendments in Section 8 are applied, and to 4.0+ after the Phase 0 kickstart workshops resolve the open blockers.

---

## 8. Recommended PRD Amendments -- Top 10

These are ranked by impact on the design-to-SwiftUI pipeline. Each amendment should be completed before the corresponding design phase begins.

### Amendment 1: Add an iOS Technical Context Section

**Priority:** Must -- before Phase 0 kickstart
**Effort:** 1-2 hours

Add a new PRD section (e.g., Section 11) that declares:
- Target platform: iOS 26+, iPhone only, Portrait only
- Framework: SwiftUI (App lifecycle, no UIKit wrapping except where necessary)
- Navigation model: `TabView` with `NavigationStack` per tab (recommended)
- Architecture: TBD but constrained to Apple first-party frameworks only
- Minimum deployment target: iOS 26 (with explicit acknowledgment of the adoption trade-off)
- Required entitlements: MapKit, Push Notifications, Camera, Photo Library, Location Services

This section aligns the design team and the future development team on constraints.

### Amendment 2: Define the Authentication Method

**Priority:** Must -- before Phase 1 (UX)
**Effort:** Client decision (30-minute meeting) + 1 hour PRD update

Choose one:
- **Sign in with Apple** (recommended -- simplest, most native, Apple-favored for iOS-only apps)
- **Phone + OTP** (familiar in France, but requires SMS provider -- an "external dependency" in spirit)
- **Email + password** (standard but requires forgot-password flow, password rules UI)

Add a user story: "US00: En tant qu'utilisateur, je veux creer un compte et me connecter de maniere securisee."

### Amendment 3: Define the Single-App vs. Dual-App Architecture

**Priority:** Must -- before Phase 1 (UX)
**Effort:** Client decision (30-minute meeting) + 1 hour PRD update

Decide: one app with role switching, or two separate apps. This determines the navigation architecture, the screen count, and the information hierarchy. For MVP, recommend single app with role switching.

Add to PRD Section 4: "L'application est une application unique avec deux modes: conducteur et carrossier. Le changement de role se fait dans les parametres du profil."

### Amendment 4: Produce a Complete Screen Inventory

**Priority:** Must -- before Phase 1 (UX)
**Effort:** 4-6 hours (based on PRD + this review's identified gaps)

Replace "20+ ecrans conducteur" and "15+ ecrans garage" with an explicit numbered list. Based on this review, the minimum screen inventory is approximately:

**Driver screens (~28):**
1. Welcome / value proposition
2. Role selection
3. Sign in (Sign in with Apple)
4. Profile completion (vehicle info)
5. Home / dashboard
6. New claim -- step 1 (type de sinistre)
7. New claim -- step 2 (photos)
8. New claim -- step 3 (vehicle info / localisation)
9. New claim -- step 4 (review + submit)
10. Claim submitted confirmation
11. Garage map view
12. Garage list view
13. Garage detail / fiche
14. Booking -- select slot
15. Booking -- confirmation
16. Booking -- recap
17. Active claim tracking
18. Claim history
19. Claim detail
20. Notification center
21. Settings root
22. Account management
23. Notification preferences
24. Legal / CGU
25. Camera permission denied
26. Location permission denied
27. No network error
28. Generic error

**Garage screens (~22):**
1. Sign in
2. Profile setup (business info, SIRET, zone, photos)
3. Dashboard
4. Claim list (available in zone)
5. Claim detail
6. Claim accept/refuse
7. Claim accepted confirmation
8. Weekly calendar
9. Day detail
10. Add/block time slot
11. Active repairs list
12. Repair detail
13. Status update
14. Status update confirmation
15. Profile edit
16. Notification center
17. Settings root
18. Account management
19. Notification preferences
20. Legal / CGU
21. No network error
22. Generic error

**Shared screens (~4):**
1. Splash / launch screen
2. Force update
3. Maintenance
4. About / app info

**Total: ~54 screens** (vs. PRD estimate of 35+).

### Amendment 5: Define the Permission Request Strategy

**Priority:** Should -- before Phase 1 (UX)
**Effort:** 2 hours

Document when each iOS permission is requested (early in onboarding vs. just-in-time at first use), what the pre-permission explanation screen says, and what the fallback is if denied. Just-in-time is the Apple-recommended approach and should be the default.

| Permission | When | Pre-permission Copy (FR) |
|---|---|---|
| Camera | US01 step 2 (first photo attempt) | "Carlib a besoin d'acceder a votre appareil photo pour photographier les degats de votre vehicule." |
| Photo Library | US01 step 2 (import existing photo) | "Carlib a besoin d'acceder a vos photos pour importer des photos existantes de votre vehicule." |
| Location | US02 (first garage search) | "Carlib utilise votre position pour trouver les garages les plus proches de vous." |
| Notifications | After first booking confirmed (US03) | "Activez les notifications pour etre informe en temps reel de l'avancement de la reparation de votre vehicule." |

### Amendment 6: Add Accessibility Requirements to the DoD

**Priority:** Must -- before Phase 1 (UX)
**Effort:** 1 hour

Replace "Accessibilite verifiee" with:

> **Accessibilite (RGAA 4.1 / WCAG 2.1 AA):**
> - Contraste minimum 4.5:1 pour le texte, 3:1 pour les elements d'interface
> - Taille de cible tactile minimum 44x44pt
> - Tous les ecrans navigables via VoiceOver avec ordre de lecture logique
> - Tous les ecrans testes en Dynamic Type Default et AX3 sans cassure de mise en page
> - Toutes les animations respectent la preference "Reduire les animations"
> - Les indicateurs de statut utilisent couleur + icone + texte (pas de couleur seule)
> - Labels d'accessibilite en francais pour tous les elements interactifs et images significatives

### Amendment 7: Add a Notification Map

**Priority:** Should -- before Phase 2 (UI)
**Effort:** 2-3 hours

Define every notification event, its recipient, its channel, and its content:

| Event | Recipient | Channel | Content (FR) | Actionable? |
|---|---|---|---|---|
| Claim submitted | Driver | In-app | "Votre sinistre a ete enregistre." | Non |
| Garage accepts claim | Driver | Push + In-app | "Le garage [Name] a accepte votre dossier." | Oui -- "Voir le garage" |
| Booking confirmed | Driver | Push + In-app | "Rendez-vous confirme le [date] a [heure]." | Oui -- "Ajouter au calendrier" |
| Status changed | Driver | Push + In-app | "Votre vehicule est maintenant [statut]." | Oui -- "Voir le suivi" |
| Repair completed | Driver | Push + In-app | "La reparation de votre vehicule est terminee !" | Oui -- "Voir les details" |
| New claim in zone | Garage | Push + In-app | "Nouveau sinistre disponible a [distance] km." | Oui -- "Voir le dossier" |
| Booking received | Garage | Push + In-app | "Nouvelle reservation le [date] a [heure]." | Oui -- "Voir le planning" |

### Amendment 8: Resolve the Landing Page Platform Question

**Priority:** Should -- before Phase 3 (Landing)
**Effort:** 15-minute client decision

Clarify explicitly:
- Is US10 (landing page) a **web page** (HTML/CSS, separate from the iOS project)?
- Or is it an **in-app screen** (SwiftUI, part of the iOS project)?

If it is a web page (most likely), remove it from the iOS scope and create a separate deliverable. If it is in-app, it becomes part of the onboarding flow.

### Amendment 9: Add Offline / Degraded Network Strategy

**Priority:** Should -- before Phase 1 (UX)
**Effort:** 2 hours

For each major flow, declare whether it works offline:

| Flow | Offline Support | Rationale |
|---|---|---|
| Claim declaration (US01) | **Partial** -- photos and form data saved locally; submitted when connection restored | Post-accident user may have no signal |
| Garage search (US02) | **No** -- requires server data | Map and availability data cannot be cached meaningfully |
| Booking (US03) | **No** -- requires real-time slot availability | Stale data would cause booking conflicts |
| Tracking (US04) | **Cached** -- last known status shown with "Derniere mise a jour: il y a X minutes" label | Status changes infrequently; stale data is acceptable |
| Garage portal (US05-US08) | **No** -- garage is in their shop with WiFi | Business context has reliable connectivity |

### Amendment 10: Add iOS Feature Opportunities Section

**Priority:** Could -- before Phase 2 (UI)
**Effort:** 1 hour

Add a section acknowledging iOS-specific features the design *could* leverage:

| Feature | User Story | Priority | Design Effort |
|---|---|---|---|
| Live Activities | US04 (tracking) | Should | 3 layout variants |
| Home Screen Widget | US04 (tracking) | Could | 2-3 widget sizes |
| Haptic feedback | US01 (confirmation), US03 (booking), US07 (status update) | Should | Spec only (no visual design needed) |
| SF Symbols | All screens | Must | Icon selection during UI phase |
| Spotlight indexing | US02 (garage search) | Could | No design needed |
| Siri Shortcuts | US01 ("Declarer un sinistre") | Could | Voice command spec only |
| SharePlay / ShareSheet | Claim sharing to insurance | Won't (V2) | -- |

---

## Summary

The PRD Carlib v0.1 is a well-written design-phase kickoff document that successfully communicates the product vision, target users, and functional scope. It is appropriate as input for the Phase 0 kickstart workshops.

However, evaluated specifically as a foundation for building a native SwiftUI iOS 26 application, the PRD has critical gaps:

1. **Zero iOS-specific content** -- no navigation model, no permission strategy, no authentication method, no mention of any Apple framework or platform capability.
2. **Underestimated scope** -- ~54 screens needed vs. 35+ stated, with the delta being iOS-required flows (onboarding, auth, settings, error recovery, permission denials).
3. **Unresolved blockers** -- the attribution model (question #2) and the single-vs-dual-app architecture question create a fork in the UX that doubles design work if left ambiguous.
4. **Accessibility as checkbox** -- "accessibilite verifiee" with no standard, no criteria, and no tooling specified is not an accessibility strategy.
5. **Missed iOS differentiators** -- Live Activities, Widgets, haptics, and SF Symbols are natural fits that would distinguish Carlib from a cross-platform or web-wrapped competitor.

The 10 recommended amendments, if applied, would raise the iOS-readiness score from 1.5/5 to an estimated 3.5-4.0/5, sufficient to begin SwiftUI implementation with confidence.

---

*Review conducted on 2026-04-06. Based on PRD Carlib v0.1 -- Draft, Mars 2026, by Digital Unicorn. Evaluated against iOS 26 / SwiftUI / Apple Human Interface Guidelines / RGAA 4.1 standards.*
