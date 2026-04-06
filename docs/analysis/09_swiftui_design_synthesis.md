# Carlib -- SwiftUI Strategic Design Synthesis
## Native iOS 26 Implementation -- Senior Design Partner Analysis

**Date:** April 2026
**Author:** Designer Copilot (Senior Product Designer -- SwiftUI Native)
**Source:** PRD Carlib v0.1, 8 specialist analyses (4,686 lines), CLAUDE.md project context
**Target:** iOS 26, Xcode 26, iPhone only, Portrait only, Swift, SwiftUI, zero external dependencies, French only
**Status:** Pre-implementation strategic synthesis -- specification only, no code

---

## Table of Contents

1. [First Impressions & Strategic Assessment](#1-first-impressions--strategic-assessment)
2. [The 5 Hardest Design Problems](#2-the-5-hardest-design-problems)
3. [Mental Model Mapping](#3-mental-model-mapping)
4. [10 Critical Design Decisions](#4-10-critical-design-decisions)
5. [Competitive Design References](#5-competitive-design-references)
6. [Information Architecture -- SwiftUI Navigation Tree](#6-information-architecture--swiftui-navigation-tree)
7. [Content Strategy](#7-content-strategy)
8. [iOS 26 Feature Strategy](#8-ios-26-feature-strategy)
9. [Design Risk Matrix](#9-design-risk-matrix)
10. [Recommended Next Steps](#10-recommended-next-steps)

---

## 1. First Impressions & Strategic Assessment

### What Excites Me

**This is a near-perfect SwiftUI project.** After reviewing the PRD, all eight specialist analyses, and the project constraints, my honest reaction is that Carlib is one of those rare projects where the platform choice and the product vision genuinely reinforce each other. Here is why:

**The "no external dependencies" constraint is a gift, not a limitation.** iOS 26 ships with everything Carlib needs: MapKit for garage discovery, PhotosUI for damage capture, SwiftData for offline claim drafts, ActivityKit for Live Activities repair tracking, and WidgetKit for glanceable status. By staying within Apple's framework ecosystem, Carlib gets dark mode, Dynamic Type, VoiceOver, and reduced motion support essentially for free. Every third-party dependency a marketplace app typically reaches for -- maps SDK, image picker, local database, push infrastructure -- is built into the platform. Zero dependencies means zero supply chain risk, faster build times, and a smaller binary.

**SwiftUI's declarative model matches the product's information architecture.** Carlib has two clearly separated user roles (driver, garage), each with a small number of core screens (12-15 per role), connected by a shared status system. This maps naturally to SwiftUI's `TabView` + `NavigationStack` paradigm. The role-based tab structure, the 4-step declaration flow as a `NavigationStack` with programmatic path management, the garage detail as a `.sheet` or `.navigationDestination` -- these are not force-fits. They are the patterns SwiftUI was built for.

**The post-accident context demands native.** A web app or cross-platform framework would compromise on exactly the things that matter most in a crisis: camera access speed, haptic feedback, GPS reliability, offline capability, and push notification timeliness. Native SwiftUI gives Carlib the fastest path from "user opens app" to "photos captured and location recorded."

**The French-only constraint simplifies enormously.** No localization architecture. No string catalogs with multiple languages. Every label, every accessibility hint, every VoiceOver description is in French. This means the team can focus on getting the domain vocabulary exactly right -- "sinistre," "prise en charge," "constat amiable" -- without the overhead of translation management. French punctuation rules (non-breaking spaces before colons, semicolons, exclamation marks, question marks) can be enforced at the String extension level once.

### What Concerns Me

**The PRD was written for "iOS & Android" but the implementation is iOS-only.** The original PRD (section 3) says "les utilisateurs accedent a l'application via une app mobile (iOS & Android)." The CLAUDE.md and project constraints say iOS only. This is the correct strategic choice for an MVP -- ship one platform excellently rather than two platforms adequately -- but it has not been discussed with the client as far as I can tell. If the client expects Android, this needs to be surfaced immediately. It also means every garage partner who uses Android cannot use the app, which directly impacts the marketplace's supply side.

**Two audiences in one SwiftUI binary is architecturally complex.** A driver and a garage owner share the same app download, but their entire experience is different: different tabs, different navigation stacks, different data models, different notification categories, different onboarding flows. In SwiftUI, this means a root-level `@State` or `@AppStorage` role selection that conditionally renders entirely different `TabView` configurations. This is doable but requires disciplined architecture from the first commit. If the role-switching logic is sloppy, it will leak into every view.

**The 50-screen count is aggressive for a first SwiftUI project.** The analyses identify 50 unique screens (10 shared, 22 driver, 17 garage, 1 landing). With empty/error/loading states, that is 150+ view variants. For a team building their first SwiftUI app, this is a lot. The risk is not SwiftUI complexity per se -- it is the combinatorial explosion of states that SwiftUI forces you to handle explicitly. SwiftUI does not let you ignore states the way UIKit sometimes did. Every `Optional` value, every `Task` loading state, every error condition must be represented in the view tree.

**The 3 interconnected status systems will fight SwiftUI's unidirectional data flow.** The design system analysis (05) identifies 3 status systems: Claim (9 states), Booking (7 states), Repair (5 states). These interact: a booking status change can trigger a claim status change, which triggers a repair status change, which triggers push notifications on both sides of the marketplace. In SwiftUI, this means either a well-designed `@Observable` state machine shared across views, or a tangled mess of `@State` variables that drift out of sync. The state machine approach is the only viable option, and it must be designed before any views are built.

**The client's preference for yellow as a primary color will create accessibility debt.** Yellow on white fails WCAG contrast requirements. Yellow on dark backgrounds can work but requires careful shade selection. In SwiftUI, color is defined through `Color` assets with automatic light/dark variants, which means the yellow must be specified as a color pair (light mode variant, dark mode variant) from day one. If yellow is the brand color, it should be reserved for accents and highlights, never for text or primary action buttons on light backgrounds. This is a conversation that needs to happen in the kickoff, not after 30 screens have been designed.

**No backend exists yet.** The PRD is a design-phase document. There is no API, no server, no database. When SwiftUI development begins, the team will need to decide: build with mock data and swap in a real backend later? Or build the backend in parallel? This decision affects every `@Observable` model, every `async` function, every error state. My recommendation: build with a protocol-based repository layer from the start. Define `ClaimRepository`, `GarageRepository`, `BookingRepository` as Swift protocols. Implement them with in-memory mock data for development. Swap in real implementations later. This is a SwiftUI architecture decision that shapes the entire codebase.

### Overall Strategic Assessment

Carlib is a well-scoped, genuinely useful product entering an under-digitized vertical with a clear first-mover advantage in the French market. The decision to build native SwiftUI on iOS 26 is strategically sound: it maximizes the quality of the post-accident experience (where native capabilities matter most) while minimizing the surface area of the technical build (one platform, one language, zero dependencies).

The three hard blockers identified in earlier analyses -- attribution model, brand identity, and product identity ambiguity -- remain the critical path items. No SwiftUI architecture decision can proceed until the attribution model is resolved, because it determines whether the garage selection flow is a comparison-shopping interface (driver chooses) or a dispatch notification interface (system assigns). These are structurally different view hierarchies.

**My confidence level for this project: 7.5/10.** The product-market fit hypothesis is strong. The platform choice is right. The scope is ambitious but achievable. The main risks are organizational (unresolved blockers, scope creep) rather than technical.

---

## 2. The 5 Hardest Design Problems

### Problem 1: Designing for Post-Accident Stress in SwiftUI

**Why this is the hardest problem in the app.** The primary use case -- declaring an accident -- happens at the worst possible moment. The user is standing on the side of a road, heart racing, possibly injured, possibly in the rain, possibly at night, possibly with a screaming child in the car. Their hands are shaking. Their cognitive capacity is at its lowest. And they are being asked to open an app they have never used before and complete a multi-step process involving their camera, GPS, and form fields.

This is not a normal UX problem. It is a crisis-interface problem. The design must work when the user's prefrontal cortex is offline and their amygdala is driving.

**How SwiftUI specifically helps:**

- **Haptic feedback via `sensoryFeedback` modifier.** Every successful step completion should trigger `.success` haptics. Every error should trigger `.warning`. This provides non-visual confirmation that the user's actions registered. In a stress state, visual feedback alone is insufficient -- the user may not be focusing on the screen.
- **Large touch targets via native sizing.** SwiftUI buttons and controls default to comfortable touch sizes. The declaration flow should use full-width buttons (`Button { } label: { }.frame(maxWidth: .infinity)`) with a minimum 56pt height (not the 44pt Apple minimum -- stress contexts demand 48-56pt).
- **Progressive disclosure via `NavigationStack` with programmatic path.** The 4-step declaration flow should be a `NavigationStack` with a `@State` path binding. Each step is a single-purpose view. The user cannot see step 3 from step 1. Cognitive load stays minimal.
- **Dark mode from day one.** The `@Environment(\.colorScheme)` is automatic in SwiftUI. Every screen works in dark mode without extra effort if colors are defined as asset catalog color sets. Accidents happen at night; the app must not blind the user.
- **Reduced motion support.** `@Environment(\.accessibilityReduceMotion)` lets the app suppress animations for users who have enabled reduced motion. In a stress context, even users without this setting may find animations disorienting. Consider defaulting to minimal animation in the declaration flow regardless of the system setting.

**What SwiftUI does not solve:**

- **One-handed use.** SwiftUI does not have a built-in concept of "thumb zone." The declaration flow must be designed so that all primary actions (buttons, the camera shutter, the "Next" button) are in the bottom third of the screen. This is a layout discipline, not a framework feature.
- **Offline photo capture.** SwiftUI's `PhotosPicker` requires no network, but uploading photos does. The architecture must separate capture (immediate, local) from upload (deferred, network-dependent). `SwiftData` can store captured images as `Data` blobs until connectivity returns.
- **Sound design.** A calm, reassuring confirmation tone after submitting a declaration would be powerful in a crisis context. SwiftUI does not handle audio; this requires `AVFoundation`. Worth the small dependency on a system framework.

**Design principle for this problem:** "One action, one screen, one breath." Every screen in the declaration flow should be completable in a single focused action, with a single primary button, and enough visual breathing room that the user feels calm rather than rushed.

### Problem 2: Two Audiences in One App -- Role-Based Architecture in SwiftUI

**The structural challenge.** Carlib serves two fundamentally different users -- a consumer in crisis and a professional managing a business -- from a single app binary. In SwiftUI, this means the `@main` `App` struct must branch into completely different view hierarchies based on the user's role.

**Architecture pattern: Role-gated root view.**

The app's root `ContentView` should evaluate the authenticated user's role and render entirely different `TabView` configurations:

```
App
  |-- Authentication (shared)
  |-- Role Gate
      |-- Driver TabView
      |   |-- Tab: Accueil (NavigationStack)
      |   |-- Tab: Mes Sinistres (NavigationStack)
      |   |-- Tab: Profil (NavigationStack)
      |
      |-- Garage TabView
          |-- Tab: Tableau de bord (NavigationStack)
          |-- Tab: Dossiers (NavigationStack)
          |-- Tab: Planning (NavigationStack)
          |-- Tab: Mon Garage (NavigationStack)
```

This is not a "settings toggle." It is a complete app-within-an-app bifurcation. The two `TabView` configurations share zero tabs. They share a design system (colors, typography, component styles) and a few shared views (auth, onboarding, settings), but their navigation stacks, data models, and notification handlers are distinct.

**Why this is hard in SwiftUI:**

- **State ownership ambiguity.** Both roles interact with the same underlying data objects (claims, bookings, garages) but from different perspectives. A `Claim` object looks different to a driver (my claim, one garage) versus a garage (one of many available claims, many drivers). The `@Observable` models must be designed with both perspectives in mind from the start.
- **Navigation stack contamination.** If a driver view and a garage view accidentally share a `NavigationStack`, pushing a destination from one role's context could land in the other role's navigation. Each role must have completely isolated navigation stacks.
- **Deep links must be role-aware.** A push notification that says "Nouveau dossier disponible" must deep-link to the garage's Dossiers tab, not the driver's Mes Sinistres tab. The deep link resolver must check the current role before navigating.

**Design implication: Shared design system, separate navigation.** The design system (tokens, components, typography) is shared. The navigation architecture is completely separate. This means two Figma prototype flows, two sets of wireframes, and -- critically -- two sets of usability tests.

### Problem 3: Marketplace Cold Start -- Empty States and Value Demonstration

**The existential problem.** When Carlib launches, it will have zero claims and possibly fewer than 10 garages in any given area. The first users -- both drivers and garages -- will see empty lists, blank maps, and missing reviews. In SwiftUI, empty states are not just UX decisions; they are `View` implementations that must be as polished as populated states.

**SwiftUI-specific approach:**

- **`ContentUnavailableView` (iOS 17+).** Apple provides a native empty state component. Use it as the base pattern for every list that can be empty. Customize the systemImage, title, and description for each context. This gives Carlib a native, iOS-consistent feel for empty states.
- **`ContentUnavailableView` with action buttons.** For the driver's "no garages nearby" state, the `ContentUnavailableView` should include a "Elargir la zone de recherche" button. For the garage's "no claims available" state, include "Verifier ma zone de couverture."
- **Populated-looking empty states.** The cold-start risk is that the app feels dead. Mitigation: in the driver's Accueil tab, show educational content ("Comment se passe une declaration ?" as a card), nearby garage count (even if it is "3 garages partenaires a moins de 20 km"), and a prominent "Declarer un sinistre" button. The screen should never feel empty even when no active claim exists.
- **Mock data during onboarding.** Consider showing a brief walkthrough with populated example data during first-run onboarding, so the user understands what the populated experience looks like before encountering empty states in their own context.

**The garage side is more critical.** A garage that signs up and sees zero claims for 3 days will churn. The garage dashboard must provide value even with zero inbound claims: a view of their public profile ("voici comment les conducteurs vous voient"), their planning calendar (useful even without Carlib bookings), and a claim volume forecast for their area ("15 sinistres declares dans votre zone ce mois -- vous serez notifie des prochains"). The forecast can be seeded from public accident statistics data.

### Problem 4: Trust Building Through UI -- How SwiftUI's Native Feel Helps

**The trust equation.** A driver is being asked to hand their car -- often their second most valuable asset -- to a stranger they found on an app. The UI itself is a trust signal. An app that feels polished, native, and "official" earns more trust than one that feels like a side project.

**Where SwiftUI native feel directly builds trust:**

- **System typography.** SF Pro, with its optical sizes and weight range, is what every Apple-designed app uses. When Carlib uses the system font via `Font.body`, `Font.headline`, `Font.largeTitle`, it looks like it belongs on the device. It looks like Apple built it. This subconscious association with Apple's design quality is a powerful trust signal, especially for non-tech-savvy users.
- **System navigation patterns.** Back buttons, swipe-to-go-back, pull-to-refresh, standard sheet presentations -- users have muscle memory for these. By using SwiftUI's default navigation behaviors, Carlib benefits from years of iOS training the user has already done. Trust comes from predictability.
- **System UI chrome.** The status bar, the home indicator, the safe area insets -- SwiftUI handles these automatically. An app that respects system chrome looks professional. An app that fights it looks amateur.
- **Sign in with Apple.** The most trusted auth mechanism on iOS. It signals "Apple vetted this." It eliminates password management. It provides a verified email. For a post-accident context, reducing the login to a FaceID confirmation is invaluable.

**Where native feel is not enough:**

- **Photos of real garages.** System UI polish means nothing if the garage profiles show placeholder silhouettes instead of real workshop photos. Trust in the garage partner is built by visual evidence: photos of the workshop, the team, the equipment. The design system must enforce photo requirements for garage profiles and display them prominently.
- **Ratings and review indicators.** SwiftUI does not provide a star rating component. A custom `RatingView` must be built. It should show the average rating, the review count, and handle the "no reviews yet" case gracefully (not "0 etoiles" but "Nouveau partenaire" with a badge).
- **Certifications and verification badges.** A "Garage verifie" badge next to the garage name, similar to how Doctolib shows verified practitioners, provides institutional trust. This is a custom component but should feel like a native system element.

### Problem 5: Online-to-Offline Handoff -- Digital Booking to Physical Car Drop-Off

**The break point.** Every digital marketplace that involves a physical service has a "last mile" problem. For Carlib, it is the moment when the driver arrives at the garage to drop off their car. The app experience ends; the physical experience begins. If this transition is poorly designed, the entire digital journey feels hollow.

**SwiftUI capabilities for the handoff:**

- **MapKit integration for "get directions."** The garage detail view should include a `Map` view with the garage location pinned, and a "Itineraire" button that opens Apple Maps with turn-by-turn directions. In SwiftUI, this is `MKMapItem.openInMaps(launchOptions:)`. Simple but critical.
- **Live Activity for appointment day.** On the day of the drop-off appointment, a Live Activity on the lock screen shows: garage name, appointment time, address, and a "Appeler le garage" button. The driver does not need to open the app to see their appointment details. This is the strongest handoff mechanism iOS offers.
- **Check-in confirmation.** When the driver arrives at the garage, both parties need to confirm the vehicle handoff. This could be a simple "Je suis arrive" button on the driver's side that sends a notification to the garage, and a "Vehicule receptionne" button on the garage's side that triggers the claim status to advance. In SwiftUI, this is a pair of `Button` actions that update a shared backend state.
- **Post-drop-off reassurance.** After the vehicle is dropped off, the driver's app transitions to the repair tracking view. The Live Activity updates from "Rendez-vous aujourd'hui" to "Vehicule depose -- en attente de prise en charge." The driver can see that the system acknowledged the handoff.

**What SwiftUI cannot solve:**

- **The garage's technology readiness.** If the garage owner does not have the app open, does not check notifications, or is too busy to tap "Vehicule receptionne," the digital handoff fails silently. Mitigation: the system should auto-advance the status after a time window (e.g., if the garage does not confirm within 2 hours of the appointment, send a reminder notification; after 4 hours, auto-advance to "depose" and flag for review).
- **The physical experience.** If the driver arrives and the garage looks nothing like its photos, or the staff is rude, or the workshop is disorganized, no amount of UI polish will save the experience. Trust signals in the app create expectations that the physical experience must meet. The garage onboarding process must set quality standards and the rating system must enforce them.

---

## 3. Mental Model Mapping

### The Driver's Current Mental Model

The existing analysis (08) maps this well. Let me reframe it specifically through the lens of what SwiftUI can reshape.

**Current model: "Bureaucratic obstacle course"**

```
Accident --> Panic --> Paper (constat amiable) --> Phone call (assurance) -->
Waiting (expert) --> Searching (Google, word of mouth) --> More phone calls -->
Drop off car --> Radio silence --> More phone calls --> Get car back
```

This model is characterized by **channel switching** (paper, phone, in-person, phone again), **information asymmetry** (the driver never knows what is happening), and **no single system of record** (information lives in the driver's head, the insurer's system, the garage's notebook).

**Target model: "Guided digital companion"**

```
Accident --> Open Carlib --> Guided capture (photos + location) -->
Browse garages (map + list) --> Book slot --> Drop off car -->
Watch progress (Live Activity) --> Get car back --> Rate garage
```

This model is characterized by **a single channel** (the app), **real-time transparency** (status visible at all times), and **a persistent record** (all claim data, photos, communications in one place).

### How SwiftUI Bridges the Gap

The bridge is not a feature list. It is a set of **interaction paradigms** that replace old behaviors:

| Old Behavior | Replacement Paradigm | SwiftUI Mechanism |
|---|---|---|
| Fill out paper constat | Guided photo capture with overlay instructions | `PhotosUI`, custom camera view with overlay |
| Call insurance company | (Not replaced in MVP -- but Carlib generates a shareable claim summary) | `ShareLink` to export claim PDF |
| Search Google for garages | Integrated map + list with filters | `MapKit` + `List` with `Searchable` |
| Call multiple garages | Browse garage profiles with availability calendars | `NavigationStack` with `GarageDetailView` |
| Wait for phone call from garage | Push notification when status changes | `UserNotifications` + `ActivityKit` |
| Call garage for updates | Real-time status in app | `@Observable` status model + pull-to-refresh |
| No record of anything | Full claim history with photos and timeline | `SwiftData` + `NavigationStack` history |

### The Garage Owner's Mental Model Shift

**Current: "The phone rings, I deal with it"**

The garage owner's current workflow is entirely reactive and analog. Claims arrive by phone. Information is in the owner's head. Planning is on a paper calendar or a whiteboard. Client communication is ad hoc.

**Target: "The app notifies me, I respond in one tap"**

The shift is from reactive-analog to proactive-digital. But the key design insight is: **the garage owner must perceive less work, not more.** If Carlib feels like "another system I have to maintain," it will fail. Every garage-side interaction must be faster than the phone call it replaces.

| Old Behavior | New Behavior | Time Saved |
|---|---|---|
| Answer phone, write down details | Tap notification, see full dossier | 5 minutes per call |
| Mentally track which cars are where | Glance at dashboard with status list | 10 minutes per day |
| Call client with update | Tap "Statut suivant" -- client notified automatically | 3 minutes per update |
| Manage calendar in head / on paper | Week view with drag-to-block slots | 15 minutes per week |

This "time saved" framing should be reflected in the onboarding copy and the landing page value proposition.

---

## 4. 10 Critical Design Decisions

### Decision 1: Attribution Model -- Driver Selection (Recommended)

**Options:**
- (A) Driver selects garage from list (marketplace model)
- (B) System auto-assigns to first garage that accepts (dispatch model)
- (C) Hybrid: garages express interest, driver selects from interested garages

**Recommendation: Option A for MVP, with Option C as the V2 evolution.**

**Rationale:** In a post-accident context, giving the driver a sense of control is psychologically important. "I chose this garage" creates ownership and reduces anxiety. The dispatch model removes agency at the moment the user needs it most. Additionally, driver selection generates richer engagement data: which garages are viewed, compared, and ultimately chosen. This data is invaluable for understanding marketplace dynamics.

**SwiftUI architecture impact:**

- Option A requires a `GarageListView` with sorting, filtering, and a `GarageDetailView` with booking capability. This is a standard `List` + `NavigationStack` pattern.
- Option B would require a `MatchingView` with a loading state ("Recherche d'un garage...") and a result state ("X Carrosserie prend en charge votre dossier"). Simpler view hierarchy but less user engagement.
- Option C requires a two-phase flow: `SubmittedView` (waiting for garage interest) then `InterestedGaragesListView` (selecting from those who responded). This adds an async waiting state that is harder to design well.

**Impact on navigation tree:** Option A means the garage selection view is part of the declaration flow (step 4 of 4). Option B means it is a separate post-declaration waiting screen. Option C means it is a deferred action triggered by a push notification.

### Decision 2: Single App vs. Two Apps

**Options:**
- (A) Single app binary with role-based UI switching
- (B) Two separate apps: "Carlib" (driver) and "Carlib Pro" (garage)

**Recommendation: Single app for MVP. Plan for separation in V2.**

**Rationale:** Two separate App Store listings doubles the marketing surface, doubles the review process, and doubles the maintenance burden. For an MVP with limited resources, a single binary is pragmatic. The role-based UI architecture described in Problem 2 above handles the separation cleanly within one app.

However, the architecture should be designed so that splitting into two apps later is painless. This means: no shared state between role-specific view hierarchies, no imports of garage-specific components in driver-specific views, and a clean module boundary between the two experiences.

**SwiftUI architecture impact:**

- Single app: root `ContentView` uses `@AppStorage("userRole")` or an `@Observable` auth state to switch between `DriverTabView` and `GarageTabView`. The app binary contains both view hierarchies.
- Two apps: each binary contains only its role-specific views plus shared design system components. Shared code lives in a Swift package.
- **Recommendation for architecture**: even with a single app, organize the code into three Swift packages from day one: `CarlibShared` (design system, models, networking), `CarlibDriver` (driver views), `CarlibGarage` (garage views). The main app target imports all three. If you ever need to split, each app target imports `CarlibShared` plus its role-specific package.

### Decision 3: Auth Strategy

**Options:**
- (A) Sign in with Apple only
- (B) Phone number (SMS OTP) only
- (C) Sign in with Apple + phone number
- (D) Email + password

**Recommendation: Sign in with Apple as primary, phone number (SMS OTP) as fallback.**

**Rationale:** Sign in with Apple is the fastest auth flow on iOS -- a single FaceID confirmation. It is trusted. It requires no typing. For a post-accident context where the user's hands may be shaking, minimizing typing is paramount. Phone number OTP is the fallback for users who have not set up Sign in with Apple or who created their account on a different device.

Email + password is rejected. It requires typing (bad in stress context), it requires password management (friction), and it creates a password reset flow that adds screens and complexity.

**SwiftUI architecture impact:**

- Sign in with Apple: `SignInWithAppleButton` (SwiftUI native). Handles the entire auth flow in 3 lines of code. Returns user ID, email, and name.
- Phone OTP: requires a `TextField` for phone input, a `TextField` for OTP code, and a timer for code expiration. More views, more state management.
- The auth state should be managed by an `@Observable AuthManager` that publishes `.authenticated(role: .driver)`, `.authenticated(role: .garage)`, or `.unauthenticated`. The root `ContentView` observes this and renders the appropriate view hierarchy.

**Critical UX decision: allow declaration before auth.** The user should be able to start the declaration flow (photos + basic info) before creating an account. Account creation is required only at the point of submitting the claim to garages. This "delayed auth" pattern maximizes completion rates in the stress context.

### Decision 4: Navigation Model

**Recommendation: `TabView` at root, `NavigationStack` per tab, `.sheet` for modal flows.**

**Detailed structure:**

**Driver App:**
- 3 tabs: Accueil, Mes Sinistres, Profil
- The declaration flow is presented as a `.fullScreenCover` from the Accueil tab, not as a pushed destination. Rationale: the declaration is a modal task that the user should complete or explicitly dismiss. Pushing it onto a navigation stack allows accidental back-navigation that could cause data loss.
- Garage detail during declaration is a `.sheet` within the declaration flow, not a pushed destination. This keeps the declaration context visible (via the sheet's detents).

**Garage App:**
- 4 tabs: Tableau de bord, Dossiers, Planning, Mon Garage
- Claim detail is pushed via `.navigationDestination` within the Dossiers tab.
- Planning slot editing is a `.sheet` from the Planning tab.

**When to use each presentation:**

| Presentation | When to Use | Examples in Carlib |
|---|---|---|
| `.navigationDestination` | Drilling into detail from a list | Claim detail, garage detail, booking detail |
| `.sheet` (half-detent) | Quick reference or action without losing context | Garage detail during map browsing, filter selection, status change confirmation |
| `.sheet` (large detent) | Forms or multi-step sub-tasks | Edit profile, edit garage info, photo review |
| `.fullScreenCover` | Immersive modal flows that should not be accidentally dismissed | Declaration flow, camera capture, onboarding |
| `.alert` / `.confirmationDialog` | Destructive or irreversible actions | Cancel booking, reject claim, delete account |

### Decision 5: Offline-First or Online-Required?

**Recommendation: Online-required with selective offline capability.**

**Rationale:** A true offline-first architecture (every action works offline and syncs later) is enormously complex. It requires conflict resolution, queue management, and a sync engine. For an MVP, this is over-engineering.

However, two specific scenarios demand offline capability:
1. **Photo capture during declaration.** The user may have poor connectivity at the accident site. Photos must be capturable and stored locally regardless of network state. Upload happens when connectivity returns.
2. **Claim draft saving.** If the user starts a declaration and loses connectivity mid-flow, their progress must not be lost. The draft should persist in `SwiftData` and sync when connectivity returns.

**SwiftUI architecture impact:**

- Use `SwiftData` with `@Model` classes for `ClaimDraft`, which stores captured photos as `Data` and form field values as properties.
- Use `NWPathMonitor` (via an `@Observable NetworkMonitor`) to track connectivity state and show a non-intrusive banner ("Mode hors ligne -- vos donnees seront envoyees automatiquement") when offline.
- All read operations (viewing claim status, browsing garages, checking planning) require connectivity. Show a clear offline state with a retry button.
- Write operations that touch the backend (submit claim, accept claim, change status) also require connectivity, with the exception of photo capture and draft saving as noted above.

### Decision 6: Photo Flow -- Camera-First

**Recommendation: Camera-first with gallery fallback.**

**Rationale:** The user is at the accident scene. The damage is in front of them. The natural action is to point the phone's camera at the damage and take photos. Presenting the gallery first would require the user to take photos in the system camera app, then switch to Carlib, then find the photos -- three extra steps of friction.

**SwiftUI implementation approach:**

- Present a custom camera view (using `AVFoundation` `AVCaptureSession` wrapped in a `UIViewControllerRepresentable`) with overlay guides showing which angle to capture: "Vue avant," "Vue arriere," "Zone de degats (gros plan)."
- After each capture, show a thumbnail in a horizontal scroll bar at the bottom. Minimum 3 photos required to proceed.
- Provide a "Ajouter depuis la galerie" button (using `PhotosPicker` from `PhotosUI`) for cases where photos were already taken.
- Store each photo as a `Data` blob in a `SwiftData` `ClaimDraft` immediately upon capture -- no upload needed at this stage.
- Image compression should happen on capture (target ~500KB per photo for preview, keep the original for upload). Use `UIImage.jpegData(compressionQuality: 0.7)`.

**Guided capture overlay:** This is the differentiating UX moment. The overlay should show a wireframe outline of a car with the current capture zone highlighted. As each angle is captured, its zone turns green (checkmark). The user can see at a glance which angles are complete and which remain.

### Decision 7: Map vs. List Primary View for Garages

**Recommendation: Map primary, list secondary, with a toggle.**

**Rationale:** The user's primary mental model after an accident is spatial: "Where is the nearest garage?" A map answers this instantly. A list sorted by distance answers it less intuitively. However, the map alone does not convey garage details (ratings, availability, specialties). The list provides this density.

**SwiftUI implementation:**

- Default view: `Map` (MapKit for SwiftUI) with annotation markers for each garage. The map is centered on the user's current location (or the accident location if different).
- Bottom sheet (`.sheet` with `.presentationDetents([.fraction(0.3), .medium, .large])`) shows a scrollable `List` of garages sorted by distance.
- The user can drag the sheet up to see more list, or drag it down to see more map. This is the "Apple Maps" interaction pattern and is natively supported in SwiftUI.
- A segmented control or toggle in the sheet header allows switching to list-only mode for users who prefer scanning a list.
- Tapping a map annotation scrolls the list to that garage. Tapping a list row highlights the corresponding map annotation. Bidirectional coordination.

This is the Uber/Google Maps/Doctolib pattern and French users are familiar with it.

### Decision 8: Notification Strategy

**Recommendation: Push notifications for status changes and time-sensitive events only. No marketing notifications in MVP.**

**Push-worthy events:**

| Event | Recipient | Urgency | Deep Link Target |
|---|---|---|---|
| Claim submitted -- garages reviewing | Driver | Low | Driver > Mes Sinistres > Claim detail |
| Garage accepted your claim | Driver | High | Driver > Mes Sinistres > Claim detail > Garage info |
| Booking confirmed | Driver + Garage | High | Respective claim/booking detail |
| Appointment reminder (J-1) | Driver + Garage | Medium | Claim/booking detail with map/directions |
| Vehicle received at garage | Driver | Medium | Repair tracking view |
| Repair status changed | Driver | Medium | Repair tracking view |
| Repair complete -- vehicle ready | Driver | High | Repair tracking view with pickup instructions |
| New claim available in zone | Garage | Medium | Garage > Dossiers > Available > Claim detail |
| Rating received | Garage | Low | Garage > Mon Garage > Avis |

**Notifications that should NOT be push:**
- Marketing messages, tips, or promotions
- "You haven't declared a claim in a while" re-engagement
- Generic "Check out new features" announcements

**SwiftUI architecture impact:**

- Register for push notifications during onboarding (after role selection, not before).
- Use `UNUserNotificationCenter` with custom notification categories for actionable notifications (e.g., "Accepter" / "Refuser" actions on a new claim notification for garages).
- Deep link handling: the `App` struct's `.onOpenURL` modifier resolves notification payloads to navigation paths. Each deep link maps to a specific `NavigationStack` path.

### Decision 9: Onboarding Length

**Recommendation: Zero-screen onboarding for drivers. 3-screen guided setup for garages.**

**Driver rationale:** The driver may be opening the app for the first time at the accident scene. They do not have time for a carousel of features. The onboarding IS the declaration flow. The app should open to Accueil with a prominent "Declarer un sinistre" button and nothing else demanding attention. Feature education happens contextually, through tooltips and inline instructions, not through a separate onboarding flow.

For returning drivers (already have an account, no active claim), Accueil shows their vehicle info, past claims (if any), and the declaration button. Still no onboarding carousel.

**Garage rationale:** The garage owner signs up in a non-urgent context (likely after a sales meeting or seeing the landing page). They have time and motivation to set up their profile. The 3-screen onboarding:
1. "Completez votre profil" (name, photos, specialties, address)
2. "Definissez votre zone" (map with adjustable radius)
3. "Indiquez vos disponibilites" (week view calendar)

Each screen should be skippable ("Completer plus tard") but the completion percentage should be visible on the dashboard ("Profil 40% complet -- completez-le pour apparaitre dans les recherches").

**SwiftUI architecture impact:**

- Driver onboarding: none. The `DriverTabView` renders immediately after auth. Contextual `TipKit` tips can introduce features inline.
- Garage onboarding: a `NavigationStack` presented as `.fullScreenCover` on first login for garages. The `@AppStorage("garageOnboardingComplete")` flag controls presentation.

### Decision 10: Landing Page -- Separate Website

**Recommendation: Separate website, not an in-app screen.**

**Rationale:** The landing page serves a fundamentally different purpose than the app. It is a B2B sales tool for garage partner acquisition. It needs to be: indexable by search engines (Google), sharable via URL, viewable on desktop (garages may discover it during a web search or receive the URL via email from a sales rep), and updatable without an App Store review cycle.

None of these requirements align with an in-app screen. A landing page inside the app would not be indexed, could not be shared with non-users, and would only be visible to people who already downloaded the app (defeating its purpose).

**Build it as a static website** (HTML/CSS, or a lightweight framework like Astro/Hugo). Deploy it independently from the iOS app. Include a "Telecharger l'application" link that deep-links to the App Store.

**SwiftUI impact:** Zero. The landing page is not part of the SwiftUI codebase. The only connection is a "Visiter carlib.fr" link in the app's Profil/Settings, which opens a `Link(destination: URL("https://carlib.fr"))`.

---

## 5. Competitive Design References

For each major flow, I identify the best-in-class iOS app to study for interaction patterns, along with what specifically to extract for Carlib.

### Declaration Flow: Lemonade (Insurance)

**Why Lemonade, not a forms app.** Lemonade's claim filing flow is the closest analogue: a multi-step guided process, completed on mobile, in a stressful context (post-loss), with photo capture required. Their implementation uses a conversational UI pattern -- questions are presented one at a time, with generous spacing and a calm color palette.

**What to extract for Carlib:**
- One question per screen with large, clear typography
- Calm color palette (blues, whites) -- not aggressive reds
- Progress indicator that shows completion without creating pressure
- Photo capture with inline instructions
- Ability to save and resume later

**SwiftUI parallel:** `NavigationStack` with a custom `ProgressView` at the top showing step 1/4, 2/4, etc. Each step is a single `View`. Forward navigation is programmatic (triggered by completing the step), backward navigation is via standard back button.

### Garage Finding: Doctolib

**Why Doctolib.** It is the app French users already trust for finding and booking local service professionals. The mental model transfer from "find a doctor" to "find a body shop" is nearly direct. Doctolib's map + list hybrid, its filter system (specialty, availability, distance), and its professional profile pages are exactly the patterns Carlib needs.

**What to extract for Carlib:**
- Map + list hybrid with bottom sheet (list slides up over map)
- Filter chips in a horizontal scroll bar (distance, availability, specialty)
- Professional profile with: photo, name, rating, address, availability calendar, reviews
- "Prendre rendez-vous" button prominently placed on profile
- Real availability calendar (not a "call for appointment" dead end)

**SwiftUI parallel:** `Map` with `Annotation` markers + a `.sheet` with presentation detents for the garage list. `ScrollView(.horizontal)` for filter chips. `NavigationStack` destination for `GarageDetailView`.

### Booking: Doctolib + Calendly

**Why both.** Doctolib for the user-facing slot selection UX (day picker + available time slots). Calendly for the garage-side availability management (block/unblock time ranges, recurring availability patterns).

**What to extract for Carlib:**
- Driver side: horizontally scrollable day picker (like Doctolib's date selector), with available time slots shown as tappable chips below the selected day. No calendar grid -- it is too complex for a stressed user.
- Garage side: week view calendar grid with drag-to-create availability blocks. Toggle for recurring patterns ("Tous les mardis, 8h-18h").

**SwiftUI parallel:**
- Driver: horizontal `ScrollView` of `DateButton` views + vertical `LazyVGrid` of `TimeSlotButton` views.
- Garage: custom `WeekCalendarView` using a `LazyVGrid` with 7 columns. Each cell is tappable/draggable to set availability.

### Status Tracking: Uber

**Why Uber.** The mental model is identical: "I handed over something valuable (my body in an Uber, my car at a garage) and I want to know what is happening at every moment." Uber's real-time map, its step-by-step status timeline, and its push notifications at each status change are the gold standard.

**What to extract for Carlib:**
- Status timeline with clear labels and timestamps
- Current status prominently displayed at the top (large text, distinct color)
- Estimated completion indicators (if possible)
- Direct contact button (call garage)
- Push notification at each status transition

**SwiftUI parallel:** A `StatusTimelineView` with a vertical list of status steps. The current step is highlighted with the primary color and a pulsing indicator. Past steps show green checkmarks and timestamps. Future steps are grayed out. The entire view is inside a `ScrollView` within the claim detail `NavigationStack` destination.

### Professional Dashboard: Square (Point of Sale)

**Why Square.** Square's dashboard for small business owners is the closest analogue to what Mohamed (the garage owner persona) needs: a glanceable overview of today's activity, actionable items requiring attention, and quick access to detailed views. Square is designed for busy professionals who check their phone between customers, which matches the garage owner's usage pattern.

**What to extract for Carlib:**
- Top section: key metrics (dossiers en cours, termines ce mois, prochain RDV)
- Middle section: actionable items ("3 nouveaux dossiers disponibles")
- Bottom section: recent activity feed
- Everything tappable for drill-down
- Information density appropriate for professional context (more data per screen than driver side)

**SwiftUI parallel:** `ScrollView` with `Section` blocks. Each section contains either a `LazyVGrid` of metric cards or a `List` of actionable items. The dashboard is the first tab of the garage `TabView`.

---

## 6. Information Architecture -- SwiftUI Navigation Tree

### Root Architecture

```
CarlibApp (@main App)
|
|-- WindowGroup
    |-- RootView
        |-- if authState == .unauthenticated
        |   |-- AuthView (NavigationStack)
        |   |   |-- WelcomeView (role selection: Conducteur / Garage)
        |   |   |-- SignInWithAppleView
        |   |   |-- PhoneAuthView
        |   |   |   |-- PhoneInputView
        |   |   |   |-- OTPVerificationView
        |   |   |-- AccountCreationView (name, vehicle info for driver)
        |
        |-- if authState == .authenticated(role: .driver)
        |   |-- DriverTabView
        |
        |-- if authState == .authenticated(role: .garage)
            |-- GarageTabView
```

### Driver Tab View (3 Tabs)

```
DriverTabView (TabView)
|
|-- Tab 1: Accueil
|   |-- NavigationStack(path: $accueilPath)
|   |   |-- AccueilView
|   |   |   |-- ActiveClaimCard (if claim in progress)
|   |   |   |   |-- .navigationDestination --> ClaimDetailView
|   |   |   |-- "Declarer un sinistre" Button
|   |   |   |   |-- .fullScreenCover --> DeclarationFlow
|   |   |   |-- NearbyGaragesPreview (count + map snippet)
|   |   |   |-- EducationalContentCard (for first-time users)
|
|-- Tab 2: Mes Sinistres
|   |-- NavigationStack(path: $sinistresPath)
|   |   |-- ClaimListView
|   |   |   |-- List of ClaimCardView (sorted by date, active first)
|   |   |   |-- ContentUnavailableView (if empty)
|   |   |   |-- .navigationDestination(for: Claim.ID) --> ClaimDetailView
|   |   |       |-- ClaimSummarySection
|   |   |       |-- AssignedGarageCard
|   |   |       |   |-- .sheet --> GarageDetailView
|   |   |       |-- StatusTimelineView
|   |   |       |-- PhotoGalleryView
|   |   |       |-- ActionsSection (call garage, cancel, share PDF)
|   |   |       |-- if status == .completed --> RatingPromptView
|
|-- Tab 3: Profil
    |-- NavigationStack(path: $profilPath)
    |   |-- ProfilView
    |   |   |-- VehicleInfoSection
    |   |   |   |-- .navigationDestination --> EditVehicleView
    |   |   |-- InsuranceInfoSection
    |   |   |   |-- .navigationDestination --> EditInsuranceView
    |   |   |-- NotificationPreferencesRow
    |   |   |   |-- .navigationDestination --> NotificationSettingsView
    |   |   |-- HelpRow --> .navigationDestination --> FAQView
    |   |   |-- LegalRow --> .navigationDestination --> LegalView
    |   |   |-- DeleteAccountRow --> .confirmationDialog
    |   |   |-- SignOutRow --> .confirmationDialog
```

### Declaration Flow (Modal -- fullScreenCover)

```
DeclarationFlow (.fullScreenCover from Accueil)
|
|-- NavigationStack(path: $declarationPath)
    |-- Step1_AccidentTypeView
    |   |-- Type selection grid (collision, stationnement, vandalisme, etc.)
    |   |-- "Suivant" button advances path
    |
    |-- Step2_PhotoCaptureView
    |   |-- Camera view with overlay guides
    |   |-- Thumbnail strip of captured photos
    |   |-- "Ajouter depuis la galerie" (PhotosPicker)
    |   |-- Minimum 3 photos to enable "Suivant"
    |
    |-- Step3_VehicleInfoView
    |   |-- Pre-filled from profile (if available)
    |   |-- License plate input (formatted)
    |   |-- Make / model (searchable picker)
    |   |-- Date and location (auto-populated from GPS)
    |   |-- "Votre vehicule peut-il rouler ?" toggle
    |   |-- Description (optional TextEditor)
    |
    |-- Step4_GarageSelectionView
    |   |-- Map + List hybrid (same as Garage tab pattern)
    |   |-- .sheet(detents: [.fraction(0.3), .medium, .large])
    |   |   |-- GarageListView (within declaration context)
    |   |-- .navigationDestination --> GarageDetailView
    |   |   |-- GarageProfileSection
    |   |   |-- AvailabilityCalendarView
    |   |   |-- "Reserver ce creneau" --> SlotSelectionView
    |   |       |-- Day picker (horizontal scroll)
    |   |       |-- Time slot grid
    |   |       |-- "Confirmer" button
    |
    |-- DeclarationSummaryView
    |   |-- Full recap of all entered data
    |   |-- Edit buttons per section (goes back to step)
    |   |-- "Soumettre" button
    |   |   |-- if not authenticated --> AuthView as .sheet
    |   |   |-- if authenticated --> submit claim
    |
    |-- DeclarationConfirmationView
        |-- Success animation (Lottie-free -- use SwiftUI animations)
        |-- Claim reference number
        |-- "Voir mon dossier" button (dismisses flow, navigates to Mes Sinistres)
```

### Garage Tab View (4 Tabs)

```
GarageTabView (TabView)
|
|-- Tab 1: Tableau de bord
|   |-- NavigationStack(path: $dashboardPath)
|   |   |-- GarageDashboardView
|   |   |   |-- MetricsGrid (dossiers en cours, termines, prochain RDV)
|   |   |   |-- NewClaimsBadge (tappable --> Dossiers tab)
|   |   |   |-- TodayScheduleList
|   |   |   |-- RecentActivityFeed
|   |   |   |   |-- .navigationDestination(for: Claim.ID) --> GarageClaimDetailView
|
|-- Tab 2: Dossiers
|   |-- NavigationStack(path: $dossiersPath)
|   |   |-- DossiersView
|   |   |   |-- Picker (segmented): Disponibles | En cours | Termines
|   |   |   |-- List of ClaimCardView (garage perspective)
|   |   |   |-- ContentUnavailableView (per segment, if empty)
|   |   |   |-- .navigationDestination(for: Claim.ID) --> GarageClaimDetailView
|   |   |       |-- DossierPhotosSection (zoomable)
|   |   |       |-- VehicleInfoSection
|   |   |       |-- DriverContactSection
|   |   |       |-- if status == .disponible --> AcceptRejectActions
|   |   |       |   |-- "Accepter" button --> .confirmationDialog
|   |   |       |   |-- "Refuser" button --> .confirmationDialog (optional reason)
|   |   |       |-- if status == .enCours --> StatusUpdateSection
|   |   |           |-- StatusStepper (tap to advance)
|   |   |           |-- .confirmationDialog for each status change
|
|-- Tab 3: Planning
|   |-- NavigationStack(path: $planningPath)
|   |   |-- PlanningView
|   |   |   |-- Picker (segmented): Semaine | Mois
|   |   |   |-- WeekCalendarView (default)
|   |   |   |   |-- Time slots with color coding
|   |   |   |   |-- Booked slots showing client name
|   |   |   |   |-- Tap empty slot --> .sheet --> CreateSlotView
|   |   |   |   |-- Tap booked slot --> .sheet --> BookingDetailView
|   |   |   |-- MonthCalendarView (overview)
|   |   |       |-- Days with booking density indicators
|   |   |       |-- Tap day --> scrolls week view to that day
|
|-- Tab 4: Mon Garage
    |-- NavigationStack(path: $garagePath)
    |   |-- GarageProfileView
    |   |   |-- ProfileCompletionBanner (if < 100%)
    |   |   |-- PhotoGallerySection
    |   |   |   |-- .navigationDestination --> EditPhotosView
    |   |   |-- InfoSection (name, address, phone, hours)
    |   |   |   |-- .navigationDestination --> EditInfoView
    |   |   |-- SpecialtiesSection
    |   |   |   |-- .navigationDestination --> EditSpecialtiesView
    |   |   |-- CoverageZoneSection (map with radius)
    |   |   |   |-- .navigationDestination --> EditZoneView
    |   |   |-- ReviewsSection (read-only)
    |   |   |   |-- .navigationDestination --> AllReviewsView
    |   |   |-- SettingsSection
    |   |   |   |-- NotificationPreferencesRow
    |   |   |   |-- SubscriptionRow
    |   |   |   |-- HelpRow --> FAQView
    |   |   |   |-- LegalRow --> LegalView
    |   |   |   |-- SignOutRow
```

### Deep Link Paths

| Deep Link URI | Target | Behavior |
|---|---|---|
| `carlib://driver/claims/{claimId}` | Driver > Mes Sinistres > ClaimDetail | Switches to Mes Sinistres tab, pushes claim detail |
| `carlib://driver/claims/{claimId}/status` | Driver > Mes Sinistres > ClaimDetail (scrolled to status) | Same as above, auto-scrolls to status section |
| `carlib://garage/dossiers/{claimId}` | Garage > Dossiers > ClaimDetail | Switches to Dossiers tab, pushes claim detail |
| `carlib://garage/dossiers/available` | Garage > Dossiers (Disponibles segment) | Switches to Dossiers tab, selects Disponibles segment |
| `carlib://garage/planning/{date}` | Garage > Planning (specific date) | Switches to Planning tab, navigates to date |

---

## 7. Content Strategy

### Tone of Voice Framework

**Core principle: "Un ami competent, pas un robot administratif."**

The tone should feel like a knowledgeable friend who happens to understand insurance and car repair -- not a government form, not a chatbot, not a marketing pitch. Calm, direct, human, and always pointing toward the next action.

| Dimension | Driver Context | Garage Context |
|---|---|---|
| **Register** | Reassuring, guiding, personal ("On vous guide") | Professional, efficient, respectful ("Gerez vos dossiers") |
| **Complexity** | Simple, no jargon without explanation | Domain-appropriate vocabulary (sinistre, prise en charge) |
| **Urgency** | Calm but purposeful ("Prenez votre temps, on sauvegarde tout") | Action-oriented ("3 nouveaux dossiers -- consultez-les") |
| **Address** | Vouvoiement ("vous") -- formal but warm | Vouvoiement -- professional respect |
| **Personality** | Empathetic companion | Reliable business tool |

### Key Screen Titles

| Screen | Title | Rationale |
|---|---|---|
| Driver home (no claim) | **Bonjour, [Prenom]** | Personal, warm. The subtitle changes contextually: "Tout est en ordre" (no claim) or "Votre dossier avance" (active claim). |
| Driver home (active claim) | **Votre dossier** | Direct, no ambiguity. Shows status card immediately. |
| Declaration step 1 | **Que s'est-il passe ?** | Conversational question, not form label. Reduces the feeling of filling out paperwork. |
| Declaration step 2 | **Prenez quelques photos** | Instruction as title. Soft imperative. |
| Declaration step 3 | **Informations du vehicule** | Factual. This is the "form" step -- tone is clear and efficient. |
| Declaration step 4 | **Choisissez un garage** | Active voice, driver has control. |
| Declaration summary | **Recapitulatif** | Standard French administrative term -- familiar and expected. |
| Declaration confirmation | **C'est envoye !** | Relief moment. Celebratory but not excessive. |
| Garage dashboard | **Tableau de bord** | Professional standard. No need for cleverness here. |
| Garage available claims | **Dossiers disponibles** | Factual, efficient. Badge count in tab bar provides urgency. |
| Garage claim detail | **Dossier #[ref]** | Reference-centric. Professional context demands precision. |

### Status Labels

| Status (Internal) | Driver-Facing Label | Garage-Facing Label |
|---|---|---|
| `submitted` | **Dossier envoye** | **Nouveau dossier** |
| `garageAssigned` | **Garage confirme** | **Dossier accepte** |
| `appointmentBooked` | **Rendez-vous confirme** | **RDV planifie** |
| `vehicleDroppedOff` | **Vehicule depose** | **Vehicule receptionne** |
| `repairInProgress` | **En cours de reparation** | **Reparation en cours** |
| `repairComplete` | **Vehicule pret** | **Reparation terminee** |
| `vehiclePickedUp` | **Termine** | **Dossier clos** |

Note: the labels are subtly different between roles. The driver sees outcome-oriented language ("Vehicule pret" -- I can go get my car). The garage sees process-oriented language ("Reparation terminee" -- I finished my work).

### Notification Copy

**Driver notifications:**

| Event | Push Title | Push Body |
|---|---|---|
| Claim submitted | Dossier envoye | Les garages a proximite consultent votre dossier. |
| Garage confirmed | Bonne nouvelle | [Garage] prend en charge votre vehicule. |
| Booking confirmed | RDV confirme | [Date] a [heure] chez [Garage]. |
| Reminder (J-1) | Rappel | Votre rendez-vous chez [Garage] est demain a [heure]. |
| Vehicle received | Vehicule depose | [Garage] a bien receptionne votre vehicule. |
| Repair started | Reparation lancee | [Garage] a commence a travailler sur votre vehicule. |
| Repair complete | Vehicule pret ! | Votre reparation est terminee. Contactez [Garage] pour le retrait. |
| Rating request (J+2) | Votre avis compte | Comment s'est passee votre experience chez [Garage] ? |

**Garage notifications:**

| Event | Push Title | Push Body |
|---|---|---|
| New claim available | Nouveau sinistre | [Type] a [X] km de votre garage. |
| Booking confirmed | Nouveau RDV | [Prenom N.] le [date] a [heure]. |
| Reminder (J-1) | Rappel | Reception du vehicule de [Prenom N.] demain a [heure]. |
| Rating received | Nouvel avis | Un client a laisse un avis sur votre garage. |

### Error Message Tone

**Principle: Never blame the user. Always suggest a next action. Always save their data.**

| Situation | Message |
|---|---|
| Network lost during declaration | **Pas de connexion.** Vos donnees sont sauvegardees. Elles seront envoyees automatiquement des que la connexion sera retablie. |
| Photo upload failed | **Photo non envoyee.** Verifiez votre connexion et reessayez. La photo est conservee sur votre telephone. |
| Slot no longer available | **Ce creneau vient d'etre reserve.** Choisissez un autre horaire parmi les creneaux disponibles. |
| No garages in area | **Aucun garage disponible dans votre zone.** Elargissez votre recherche ou revenez plus tard -- nous vous previendrons des qu'un garage sera disponible. |
| GPS permission denied | **Localisation desactivee.** Pour trouver les garages pres de vous, activez la localisation dans les reglages ou saisissez une adresse manuellement. |
| Session expired | **Session expiree.** Reconnectez-vous pour continuer. Vos donnees ont ete sauvegardees. |
| Camera permission denied | **Acces a la camera refuse.** Pour prendre des photos de votre vehicule, autorisez l'acces a la camera dans Reglages > Carlib. |
| Server error | **Un probleme est survenu.** Reessayez dans quelques instants. Si le probleme persiste, contactez notre support. |

### CTA Button Labels

| Action | Label | Style |
|---|---|---|
| Start declaration | **Declarer un sinistre** | Primary, full-width, prominent |
| Next step in flow | **Suivant** | Primary, full-width |
| Submit declaration | **Soumettre mon dossier** | Primary, full-width, with completion feeling |
| Select garage | **Choisir ce garage** | Primary, full-width |
| Confirm booking | **Confirmer le rendez-vous** | Primary, full-width |
| Accept claim (garage) | **Accepter le dossier** | Primary, green-tinted |
| Reject claim (garage) | **Refuser** | Secondary, destructive |
| Update status (garage) | **Mettre a jour le statut** | Primary |
| Call garage | **Appeler le garage** | Secondary with phone icon |
| Get directions | **Itineraire** | Secondary with map icon |
| Rate garage | **Donner mon avis** | Primary |
| Sign out | **Se deconnecter** | Destructive text button |
| Delete account | **Supprimer mon compte** | Destructive, behind confirmation dialog |

---

## 8. iOS 26 Feature Strategy

### Live Activities -- Repair Tracking

**Product value:** The driver's single biggest anxiety is "what is happening to my car?" A Live Activity on the lock screen and Dynamic Island provides the answer without opening the app. It is the most visible, persistent status indicator iOS offers.

**Implementation plan:**

- **Trigger:** Live Activity starts when the booking is confirmed (status: `appointmentBooked`).
- **Initial state:** Shows garage name, appointment date/time, and countdown to appointment.
- **Updates:** Each status change (`vehicleDroppedOff`, `repairInProgress`, `repairComplete`) updates the Live Activity with the new status label and a progress indicator.
- **End state:** Live Activity ends 4 hours after `vehiclePickedUp` status or when the driver taps "Termine" in the app.
- **Dynamic Island (compact):** Garage initial + progress bar. Example: "XC" + [=====---]
- **Dynamic Island (expanded):** Current status + garage name + estimated completion (if available).
- **Lock screen:** Status label + progress steps (like Uber's ride tracking).

**Technical consideration:** Live Activities have a 4KB payload limit for remote updates. Status updates fit easily. Do not try to push photo data through a Live Activity.

### Interactive Widgets -- Quick Claim Status

**Product value:** A widget on the home screen lets the driver glance at their claim status without opening the app. For the garage owner, a widget shows today's appointment count and any pending claims.

**Widget family recommendations:**

| Widget | Family | Content |
|---|---|---|
| Driver: Claim status | `systemSmall` | Current status icon + label. Tap opens claim detail. |
| Driver: Claim status | `systemMedium` | Status + garage name + next action hint ("Deposez votre vehicule le 15 avril"). |
| Garage: Today's schedule | `systemMedium` | Next 2-3 appointments with times. |
| Garage: Pending claims | `systemSmall` | Badge count of available claims. Tap opens Dossiers. |

**Interactive elements (iOS 17+):** The garage widget could include a "Voir les dossiers" button that deep-links directly to the available claims list.

### MapKit -- Garage Discovery

**Product value:** The map is the primary interface for garage selection. MapKit for SwiftUI (improved in iOS 17+) provides the full mapping stack without any third-party dependency.

**Capabilities to leverage:**

- `Map` with `Annotation` for garage markers with custom pin views (showing the garage's rating as a number badge)
- `MapCameraPosition` for programmatic camera control (center on user location, then widen to show nearest garages)
- `MKLocalSearch` for address autocomplete in the location input during declaration
- `MKLookAroundScene` for Street View-style preview of the garage location (helps driver find the garage on arrival)
- `MKRoute` for distance/ETA calculation between user and garage (displayed on garage cards)

### PhotosUI -- Damage Photo Capture

**Product value:** Photo quality determines whether a garage can assess the damage remotely. Poor photos mean wasted time for both parties.

**Capabilities to leverage:**

- `PhotosPicker` for gallery selection (fallback to camera-first approach)
- Custom `AVCaptureSession` for guided camera with overlay (not PhotosUI, but AVFoundation)
- `PHPickerFilter` to restrict to images only (no videos)
- Automatic HEIF-to-JPEG conversion for upload compatibility

### SwiftData -- Offline Claim Drafts

**Product value:** A driver at an accident scene may have poor connectivity. Their declaration progress must be saved locally and survive app termination.

**Implementation plan:**

- `@Model ClaimDraft` with properties for each declaration step: accident type, photos (as `Data` array), vehicle info, location, description.
- Each field auto-saves to SwiftData on input (no explicit save button).
- When the user submits the declaration with connectivity, the draft is uploaded and then marked as `synced`.
- If the user closes the app mid-declaration and reopens later, the draft is restored and the flow resumes from where they left off.
- Drafts older than 30 days without submission are auto-deleted (with a notification warning at 25 days).

### Push Notifications -- Status Updates

**Product value:** The notification is the primary touchpoint between status changes. A well-designed notification strategy keeps both sides of the marketplace engaged without being annoying.

**Capabilities to leverage:**

- `UNNotificationCategory` with custom actions: garage can "Accepter" or "Consulter" a new claim directly from the notification.
- `UNNotificationSound.default` for standard notifications; custom sounds for high-priority events (claim accepted, vehicle ready).
- Notification grouping by claim ID (so multiple updates for the same claim stack together).
- Provisional notifications (iOS 12+) for first-time push permission -- show notifications in Notification Center without prompting for permission. Full permission requested when the user engages.

### Spotlight Integration -- Search Claims and Garages

**Product value:** The driver can search "mon sinistre" or "garage carrosserie" in Spotlight and find their active claim or nearby garages without opening the app.

**Implementation plan:**

- Index active claims as `CSSearchableItem` with title "Sinistre #[ref] -- [status]" and description including garage name and date.
- Index the user's assigned garage as a searchable item with the garage name and address.
- Spotlight results deep-link to the relevant screen in the app.
- Keep the index small -- only active claims and current garage assignment. Do not index historical data.

### TipKit -- Contextual Feature Discovery

**Product value:** Rather than a multi-screen onboarding, TipKit lets Carlib introduce features when they are relevant. "Did you know you can filter garages by specialty?" appears the first time the user opens the garage list, not during onboarding.

**Tips to implement:**

| Tip | Trigger | Screen |
|---|---|---|
| "Ajoutez votre vehicule pour gagner du temps" | Driver opens app for first time, no vehicle saved | Accueil |
| "Filtrez par specialite pour trouver le bon garage" | Driver opens garage list with > 5 results | Garage list |
| "Ajoutez des photos pour attirer plus de clients" | Garage profile has 0 photos | Mon Garage |
| "Bloquez vos jours de fermeture" | Garage opens Planning for first time | Planning |

---

## 9. Design Risk Matrix

| # | Risk | Severity | Likelihood | SwiftUI-Specific Impact | Mitigation |
|---|---|---|---|---|---|
| 1 | **Role-switching architecture leaks state between driver and garage views** | Critical | Medium | Shared `@Observable` objects could expose garage data to driver views or vice versa. Navigation stacks could push wrong destinations. | Strict module separation: `CarlibDriver` and `CarlibGarage` Swift packages. No cross-imports. Shared state only through protocols defined in `CarlibShared`. |
| 2 | **50-screen scope exceeds SwiftUI team capacity** | High | High | Every SwiftUI view requires explicit handling of all states (loading, error, empty, populated). 50 screens x 4 states = 200 view configurations. | Cut to 30 screens for MVP (15 driver, 15 garage). Prioritize the critical path: declaration > garage selection > booking > tracking. Build remaining screens as iterations. |
| 3 | **Offline photo capture fails silently when SwiftData runs out of space** | High | Low | Large `Data` blobs (photos) in SwiftData can hit device storage limits. Failed saves could lose captured photos without user awareness. | Compress photos to ~500KB on capture. Limit draft to 10 photos maximum. Show clear storage warnings. Store photos as file URLs referencing the app's documents directory rather than inline `Data` in SwiftData. |
| 4 | **Live Activity payload exceeds 4KB limit, causing silent update failures** | Medium | Medium | Status update payloads that include garage info, timestamps, and localized strings can approach the limit. | Keep Live Activity payloads minimal: status enum + timestamp only. All display strings are generated client-side from the status enum. |
| 5 | **Yellow brand color fails accessibility on both light and dark backgrounds** | High | High | SwiftUI `Color` assets with light/dark variants must pass WCAG AA contrast against their respective background colors. Yellow typically fails against white (light mode) and against dark gray (dark mode). | Use yellow exclusively for accent/highlight elements (icons, badges, progress bars), never for text or button labels. Primary action buttons use a dark navy or indigo that passes contrast everywhere. Present this rationale to the client at kickoff with visual examples. |
| 6 | **Deep link resolution conflicts between driver and garage notification handlers** | Medium | Medium | A push notification arriving while the user has the wrong role active (or is unauthenticated) could crash or navigate to wrong screen. | Deep link resolver checks auth state and role before navigation. If wrong role: show a toast "Connectez-vous en tant que [role] pour voir ce contenu." If unauthenticated: save the deep link target and execute after auth. |
| 7 | **Guided camera overlay distorts on different iPhone screen sizes** | Medium | Medium | SwiftUI `GeometryReader` values differ across iPhone SE, iPhone 15, iPhone 15 Pro Max. Camera overlay guides could misalign with camera preview. | Design overlay guides as proportional (percentage-based) rather than absolute pixel positions. Test on the three extremes: SE (smallest), standard (15), and Max (largest). |
| 8 | **French text truncation in navigation bars and buttons** | Medium | High | French text is typically 15-25% longer than English. "Declarer un sinistre" is 22 characters; button labels may overflow on smaller devices. | Use `lineLimit(1)` with `minimumScaleFactor(0.8)` for button labels. Test all copy on iPhone SE (smallest screen). Favor short labels over descriptive ones. |
| 9 | **SwiftData model migration complexity as the schema evolves** | High | Medium | Adding fields to `@Model ClaimDraft` after users have existing drafts requires schema migration. SwiftData's lightweight migration handles added optional properties but not renamed or removed properties. | Design the initial data model with expansion in mind. All properties that might change are `Optional`. Never rename or remove properties -- deprecate and add new ones. Document the schema versioning strategy before the first release. |
| 10 | **Marketplace status state machine becomes inconsistent across devices** | Critical | Medium | The 3 interconnected status systems (Claim, Booking, Repair) must stay synchronized between driver and garage apps (which are the same binary). If one device updates a status and the other has stale data, the UI shows conflicting information. | Status is server-authoritative. No local status mutations without server confirmation. Use `async/await` with server round-trips for every status change. Poll or use WebSockets for real-time updates. `@Observable` status models refresh on `Task` completion, never optimistically. |

---

## 10. Recommended Next Steps

### Priority 1: Resolve the Three Hard Blockers (Before Any SwiftUI Work)

These decisions gate the entire architecture. No `NavigationStack`, no `@Model`, no `TabView` can be built until these are resolved.

1. **Decide the attribution model.** My recommendation: driver selects (Option A). But any decision is better than no decision. The entire garage selection flow -- the most complex view hierarchy in the app -- depends on this.

2. **Define brand identity minimums.** Not a full brand book. Just: primary color (not yellow for primary -- suggest navy/indigo with yellow accent), secondary color, and typeface decision (SF Pro is the recommendation -- zero cost, zero dependency, native feel, excellent French character support).

3. **Clarify product identity.** Is Carlib a "claim declaration tool" or a "garage marketplace"? This determines the Accueil tab design: a big "Declarer" button (claim tool) vs. a garage discovery feed (marketplace). My recommendation: marketplace first, with declaration as the entry flow. The value proposition is finding and booking the right garage, not filling out a form.

### Priority 2: Define the Data Model (Week 1)

Before any views are built, define the Swift `@Model` types:

- `User` (id, name, phone, email, role, vehicle info, insurance info)
- `Vehicle` (plate, make, model, year, color)
- `ClaimDraft` (local-only, for in-progress declarations)
- `Claim` (id, type, photos, vehicle, location, date, status, assignedGarage, booking)
- `Garage` (id, name, address, coordinates, photos, specialties, coverageRadius, rating, reviewCount)
- `Booking` (id, claimId, garageId, date, timeSlot, status)
- `StatusEvent` (id, claimId, status, timestamp, actor)

Define these as Swift protocols first (for the repository layer), then as concrete `@Model` types for SwiftData, and as `Codable` structs for API responses. This triple definition -- protocol, local model, API model -- prevents the common SwiftUI mistake of coupling views directly to network responses.

### Priority 3: Build the Navigation Skeleton (Week 2)

Before any screen content, build the empty shell:

1. `CarlibApp` with `RootView` that switches on auth state
2. `DriverTabView` with 3 tabs, each containing an empty `NavigationStack`
3. `GarageTabView` with 4 tabs, each containing an empty `NavigationStack`
4. `DeclarationFlow` as a `fullScreenCover` with 4 empty steps
5. Deep link resolver that can navigate to any screen from a URL

This skeleton validates the navigation architecture before any UI work begins. Every team member can see the app structure, navigate between screens (even if they are placeholder views), and verify that tab switching, stack pushing, and sheet presenting all work correctly.

### Priority 4: Design System Implementation (Week 2-3)

Build the shared design system as a Swift package (`CarlibDesignSystem`):

- Color tokens (primary, secondary, semantic, neutral) as `Color` extension
- Typography scale as `Font` extension (using SF Pro with defined sizes for largeTitle, headline, body, caption, etc.)
- Spacing scale (4px base unit: 4, 8, 12, 16, 24, 32, 48)
- Component library: `CarlibButton` (primary, secondary, destructive, ghost), `CarlibCard`, `CarlibTextField`, `StatusBadge`, `RatingView`, `GarageCard`, `ClaimCard`
- Empty state component wrapping `ContentUnavailableView`
- Haptic feedback helper (`UIImpactFeedbackGenerator` wrapper)

### Priority 5: Critical Path Screens (Weeks 3-5)

Build the screens that prove the value proposition, in this order:

1. **Declaration flow (Steps 1-4)** -- proves the driver-side value
2. **Garage list + map** -- proves the marketplace works
3. **Garage detail + booking** -- proves the transaction works
4. **Status tracking** -- proves the ongoing value
5. **Garage dashboard + claim acceptance** -- proves the garage-side value
6. **Garage planning** -- proves the operational value

### Priority 6: Polish and Edge Cases (Weeks 5-7)

- All empty states
- All error states
- All loading states (skeleton views)
- Dark mode verification on every screen
- Dynamic Type verification (up to AX5)
- VoiceOver audit on critical flows
- French text overflow check on iPhone SE
- Live Activity implementation
- Widget implementation
- Notification handling and deep links

### Priority 7: Usability Testing (Week 7-8)

- Test the declaration flow with 5 non-technical French-speaking users in a simulated stress context (timer, ambient noise, standing)
- Test the garage flow with 3 actual body shop owners on their own devices
- Measure: task completion rate, time to complete, SUS score, subjective stress level
- Iterate on the top 3 findings

### What NOT to Build in MVP

- In-app chat between driver and garage (use phone call)
- Insurance integration of any kind
- Payment processing
- Multi-language support
- iPad support
- Android app
- Admin panel
- Analytics dashboard
- Garage comparison view
- Vehicle history beyond current claim
- Integration with external calendar systems (Apple Calendar, Google Calendar)

---

## Summary

Carlib is a strong product concept meeting a real market need, and SwiftUI on iOS 26 is the right platform choice. The primary risks are organizational (unresolved blockers, scope creep) rather than technical. The 5 hardest design problems -- stress-context interaction, dual-audience architecture, cold-start marketplace, trust-building, and online-to-offline handoff -- all have clear SwiftUI-native solutions if the architecture is set up correctly from the first commit.

The single most important recommendation: **resolve the attribution model before writing any SwiftUI code.** Every navigation path, every data model, every notification, and every screen in the garage selection flow depends on this decision. A week spent debating attribution saves a month of rework.

The second most important recommendation: **start with the navigation skeleton, not the screens.** SwiftUI apps succeed or fail based on their navigation architecture. Get the `TabView` / `NavigationStack` / `.sheet` / `.fullScreenCover` hierarchy right first. Fill in screen content second. This is the opposite of how most teams work (designing individual screens first, then figuring out how to connect them), and it is the right approach for SwiftUI.

Build for the stressed driver standing in the rain first. Everything else follows.

---

*This synthesis is based on PRD Carlib v0.1 (March 2026), 8 specialist analyses (April 2026), and iOS 26 / SwiftUI platform capabilities as of April 2026. It is a strategic design specification -- no code, no Figma files, no wireframes. It should be reviewed with the full project team before implementation begins.*
