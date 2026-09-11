> Historical — written against the SwiftUI app, now archived at `archive/swift/`. The product is `mobile/`.

# Carlib -- SwiftUI Native Implementation: Delivery & Operations Analysis

**Document version:** 1.0  
**Date:** 2026-04-06  
**Source:** PRD Carlib v0.1, existing analysis files 01-08, CLAUDE.md project spec  
**Analyst role:** Design Operations Lead  
**Target:** iOS 26, Xcode 26, SwiftUI, iPhone only, Portrait only, zero external dependencies, French only

---

## Table of Contents

1. [SwiftUI Project Structure](#1-swiftui-project-structure)
2. [Implementation Phasing](#2-implementation-phasing)
3. [Effort Estimation](#3-effort-estimation)
4. [Risk Register](#4-risk-register)
5. [Quality Assurance Checklist](#5-quality-assurance-checklist)
6. [Blocker Resolution Timeline](#6-blocker-resolution-timeline)
7. [Dev Handoff Spec](#7-dev-handoff-spec)

---

## 1. SwiftUI Project Structure

### 1.1 Xcode Project Organization

The project uses a single Xcode target (no separate app extensions in MVP) with a feature-based folder structure that mirrors the two-sided marketplace architecture. Role-based routing (driver vs. garage) is the primary architectural axis.

```
Carlib/
|
|-- Carlib.xcodeproj
|
|-- Carlib/                              # Main app target
|   |
|   |-- App/
|   |   |-- CarlibApp.swift              # @main App entry point, WindowGroup
|   |   |-- AppState.swift               # Observable root state (auth, role, onboarding)
|   |   |-- AppRouter.swift              # Top-level NavigationStack / role-based routing
|   |   |-- ContentView.swift            # Role switch: DriverTabView vs GarageTabView
|   |
|   |-- Core/
|   |   |-- Auth/
|   |   |   |-- Views/
|   |   |   |   |-- WelcomeView.swift            # Role selection (conducteur/carrossier)
|   |   |   |   |-- LoginView.swift               # Email/phone + password
|   |   |   |   |-- RegistrationView.swift         # Multi-step, role-aware
|   |   |   |   |-- ForgotPasswordView.swift
|   |   |   |-- Models/
|   |   |   |   |-- User.swift                     # SwiftData @Model
|   |   |   |   |-- AuthState.swift
|   |   |   |-- ViewModels/
|   |   |   |   |-- AuthViewModel.swift
|   |   |
|   |   |-- Onboarding/
|   |   |   |-- Views/
|   |   |   |   |-- OnboardingCarouselView.swift
|   |   |   |   |-- DriverOnboardingView.swift
|   |   |   |   |-- GarageOnboardingView.swift
|   |   |   |-- ViewModels/
|   |   |       |-- OnboardingViewModel.swift
|   |   |
|   |   |-- Navigation/
|   |       |-- DriverTabView.swift               # TabView: Accueil, Declarer, Suivi, Profil
|   |       |-- GarageTabView.swift                # TabView: Dashboard, Sinistres, Planning, Profil
|   |       |-- NavigationRouter.swift             # Programmatic NavigationPath management
|   |       |-- DeepLinkHandler.swift              # Push notification -> screen resolution
|   |
|   |-- Features/
|   |   |
|   |   |-- Declaration/                          # Driver: sinistre declaration (4-step flow)
|   |   |   |-- Views/
|   |   |   |   |-- DeclarationFlowView.swift      # Container with progress stepper
|   |   |   |   |-- Step1AccidentTypeView.swift
|   |   |   |   |-- Step2PhotoCaptureView.swift
|   |   |   |   |-- Step3VehicleInfoView.swift
|   |   |   |   |-- Step4LocationView.swift
|   |   |   |   |-- DeclarationSummaryView.swift
|   |   |   |   |-- DeclarationSuccessView.swift
|   |   |   |-- Models/
|   |   |   |   |-- Declaration.swift              # SwiftData @Model
|   |   |   |   |-- AccidentType.swift
|   |   |   |   |-- VehicleInfo.swift
|   |   |   |-- ViewModels/
|   |   |   |   |-- DeclarationViewModel.swift
|   |   |   |-- Services/
|   |   |       |-- PhotoCaptureService.swift       # Camera + PhotosUI integration
|   |   |       |-- LocationService.swift           # CLLocationManager wrapper
|   |   |
|   |   |-- GarageSearch/                          # Driver: find and select a garage
|   |   |   |-- Views/
|   |   |   |   |-- GarageSearchView.swift          # Container: map + list toggle
|   |   |   |   |-- GarageMapView.swift             # MapKit SwiftUI Map
|   |   |   |   |-- GarageListView.swift            # Filtered scrollable list
|   |   |   |   |-- GarageFilterSheet.swift         # Bottom sheet with filter chips
|   |   |   |   |-- GarageDetailSheet.swift         # Bottom sheet: garage profile
|   |   |   |-- Models/
|   |   |   |   |-- Garage.swift                    # SwiftData @Model
|   |   |   |   |-- GarageFilter.swift
|   |   |   |-- ViewModels/
|   |   |       |-- GarageSearchViewModel.swift
|   |   |
|   |   |-- Booking/                               # Driver: calendar slot selection
|   |   |   |-- Views/
|   |   |   |   |-- BookingCalendarView.swift        # Date strip + time slot grid
|   |   |   |   |-- TimeSlotPickerView.swift
|   |   |   |   |-- BookingConfirmationView.swift
|   |   |   |   |-- BookingRecapView.swift
|   |   |   |-- Models/
|   |   |   |   |-- Booking.swift                   # SwiftData @Model
|   |   |   |   |-- TimeSlot.swift
|   |   |   |-- ViewModels/
|   |   |       |-- BookingViewModel.swift
|   |   |
|   |   |-- Tracking/                              # Driver: repair status tracking
|   |   |   |-- Views/
|   |   |   |   |-- StatusDashboardView.swift
|   |   |   |   |-- StatusTimelineView.swift
|   |   |   |   |-- VehicleReadyView.swift
|   |   |   |-- Models/
|   |   |   |   |-- RepairStatus.swift
|   |   |   |   |-- StatusEvent.swift
|   |   |   |-- ViewModels/
|   |   |       |-- TrackingViewModel.swift
|   |   |
|   |   |-- GaragePortal/                          # Garage-side features
|   |   |   |-- Dashboard/
|   |   |   |   |-- GarageDashboardView.swift
|   |   |   |   |-- GarageDashboardViewModel.swift
|   |   |   |-- Claims/
|   |   |   |   |-- AvailableClaimsListView.swift
|   |   |   |   |-- ClaimDetailView.swift
|   |   |   |   |-- AcceptDeclineView.swift
|   |   |   |   |-- ActiveDossiersView.swift
|   |   |   |   |-- ClaimsViewModel.swift
|   |   |   |-- Planning/
|   |   |   |   |-- WeekPlanningView.swift
|   |   |   |   |-- DayDetailView.swift
|   |   |   |   |-- AvailabilityManagementView.swift
|   |   |   |   |-- SlotEditorSheet.swift
|   |   |   |   |-- PlanningViewModel.swift
|   |   |   |-- StatusUpdate/
|   |   |   |   |-- StatusUpdateView.swift
|   |   |   |   |-- StatusUpdateViewModel.swift
|   |   |   |-- Profile/
|   |   |       |-- GarageProfileView.swift
|   |   |       |-- GarageProfileEditView.swift
|   |   |       |-- GaragePhotoManagerView.swift
|   |   |       |-- ServiceAreaView.swift
|   |   |       |-- GarageProfileViewModel.swift
|   |   |
|   |   |-- Landing/                               # Landing page (garage acquisition)
|   |   |   |-- Views/
|   |   |   |   |-- LandingPageView.swift           # ScrollView-based marketing page
|   |   |   |   |-- HeroSectionView.swift
|   |   |   |   |-- HowItWorksSectionView.swift
|   |   |   |   |-- BenefitsSectionView.swift
|   |   |   |   |-- GarageSignupFormView.swift
|   |   |   |-- ViewModels/
|   |   |       |-- LandingViewModel.swift
|   |   |
|   |   |-- Notifications/
|   |   |   |-- Views/
|   |   |   |   |-- NotificationCenterView.swift
|   |   |   |   |-- NotificationRowView.swift
|   |   |   |-- Models/
|   |   |   |   |-- AppNotification.swift           # SwiftData @Model
|   |   |   |-- ViewModels/
|   |   |       |-- NotificationViewModel.swift
|   |   |
|   |   |-- Profile/                               # Shared profile (driver + settings)
|   |   |   |-- Views/
|   |   |   |   |-- DriverProfileView.swift
|   |   |   |   |-- SettingsView.swift
|   |   |   |   |-- VehicleProfileView.swift
|   |   |   |   |-- DossierHistoryView.swift
|   |   |   |   |-- DossierArchiveDetailView.swift
|   |   |   |-- ViewModels/
|   |   |       |-- ProfileViewModel.swift
|   |   |
|   |   |-- Shared/                                # Cross-feature shared views
|   |       |-- SplashView.swift
|   |       |-- LegalView.swift
|   |       |-- OfflineView.swift
|   |       |-- ForceUpdateView.swift
|   |
|   |-- DesignSystem/                              # Local design system (see 1.2)
|   |
|   |-- Services/                                  # App-wide services
|   |   |-- Networking/
|   |   |   |-- APIClient.swift                    # URLSession-based, no dependencies
|   |   |   |-- APIEndpoint.swift                  # Endpoint definitions
|   |   |   |-- APIError.swift
|   |   |   |-- NetworkMonitor.swift               # NWPathMonitor wrapper
|   |   |   |-- RequestBuilder.swift
|   |   |   |-- ResponseDecoder.swift
|   |   |-- Persistence/
|   |   |   |-- DataController.swift               # SwiftData ModelContainer setup
|   |   |   |-- MigrationPlan.swift
|   |   |-- Location/
|   |   |   |-- LocationManager.swift              # CLLocationManager + async/await
|   |   |   |-- GeocodingService.swift             # CLGeocoder wrapper
|   |   |-- Camera/
|   |   |   |-- CameraManager.swift                # AVFoundation camera session
|   |   |   |-- PhotoPickerService.swift           # PhotosUI PHPickerViewController
|   |   |   |-- ImageCompressor.swift              # Bandwidth-aware compression
|   |   |-- Notifications/
|   |   |   |-- PushNotificationManager.swift      # UNUserNotificationCenter
|   |   |   |-- NotificationRouter.swift           # Notification -> deep link resolution
|   |   |-- Haptics/
|   |       |-- HapticManager.swift                # UIImpactFeedbackGenerator patterns
|   |
|   |-- Utilities/
|   |   |-- Extensions/
|   |   |   |-- Date+French.swift                  # fr_FR locale formatting
|   |   |   |-- String+Validation.swift            # License plate, SIRET, phone validation
|   |   |   |-- View+Loading.swift                 # Loading/error state modifiers
|   |   |   |-- View+Accessibility.swift           # VoiceOver helpers
|   |   |-- Helpers/
|   |   |   |-- LicensePlateFormatter.swift        # AA-123-AA format mask
|   |   |   |-- PhoneNumberFormatter.swift         # +33 format
|   |   |   |-- SIRETValidator.swift               # 14-digit validation
|   |   |   |-- FrenchCopyConstants.swift           # Centralized French strings
|   |   |-- Protocols/
|   |       |-- LoadableState.swift                # Generic loading/loaded/error/empty enum
|   |       |-- Refreshable.swift
|   |
|   |-- Resources/
|       |-- Assets.xcassets/
|       |   |-- Colors/                            # Color sets (see 1.3)
|       |   |-- Images/                            # App-specific imagery
|       |   |-- AppIcon.appiconset/
|       |-- Localizable.xcstrings                  # French-only string catalog
|       |-- Info.plist
|       |-- Carlib.entitlements
|
|-- CarlibTests/                                   # Unit tests
|   |-- Features/
|   |-- Services/
|   |-- ViewModels/
|
|-- CarlibUITests/                                 # UI tests
|   |-- Flows/
|   |-- Accessibility/
|
|-- Packages/                                      # Local Swift packages (optional)
    |-- CarlibDesignSystem/                        # If extracted as package (see 1.2)
```

### 1.2 Design System Organization

Two viable approaches for the design system in a zero-external-dependency SwiftUI project. Recommendation: **Option A for MVP, migrate to Option B when team grows.**

#### Option A: Folder within App Target (Recommended for MVP)

Simpler setup, no package overhead, single-developer-friendly. The design system lives as a folder inside the main target.

```
Carlib/DesignSystem/
|
|-- Tokens/
|   |-- CarlibColors.swift              # Color extension with semantic names
|   |-- CarlibTypography.swift          # Font styles as ViewModifiers
|   |-- CarlibSpacing.swift             # CGFloat constants (4px base unit)
|   |-- CarlibRadius.swift              # Corner radius constants
|   |-- CarlibShadows.swift             # Shadow definitions
|   |-- CarlibAnimations.swift          # Duration + easing curves
|
|-- Components/
|   |-- Buttons/
|   |   |-- CarlibButton.swift          # Primary, Secondary, Ghost, Destructive, Icon-only
|   |   |-- CarlibButtonStyle.swift     # ButtonStyle implementations
|   |-- Inputs/
|   |   |-- CarlibTextField.swift       # Styled text field with error/helper
|   |   |-- CarlibTextArea.swift        # Auto-growing text area
|   |   |-- CarlibSearchField.swift     # Search with clear + filter
|   |   |-- LicensePlateField.swift     # French plate format AA-123-AA
|   |   |-- PhoneNumberField.swift      # +33 formatted input
|   |   |-- SIRETField.swift            # 14-digit SIRET input
|   |   |-- PhotoCaptureInput.swift     # Camera trigger + gallery + grid
|   |   |-- LocationInput.swift         # Map pin + address autocomplete
|   |-- Cards/
|   |   |-- CarlibCard.swift            # Base card (flat, elevated, outlined)
|   |   |-- GarageCard.swift            # Garage listing card with photo, distance, availability
|   |   |-- ClaimCard.swift             # Sinistre card (driver view vs garage view)
|   |   |-- BookingCard.swift           # Booking confirmation card
|   |   |-- VehicleInfoCard.swift       # License plate, make/model
|   |   |-- StatCard.swift              # KPI for garage dashboard
|   |-- Navigation/
|   |   |-- CarlibTabBar.swift          # Custom tab bar if default is insufficient
|   |   |-- CarlibTopBar.swift          # App bar variants (standard, large, search)
|   |   |-- BackCloseHeader.swift       # Modal/sub-flow header
|   |   |-- SegmentedTabBar.swift       # Semaine/Mois toggle, List/Map toggle
|   |-- Status/
|   |   |-- StatusBadge.swift           # Color-coded status pill (all flows)
|   |   |-- ProgressStepper.swift       # 4-step horizontal stepper (declaration)
|   |   |-- StatusTimeline.swift        # Vertical timeline with nodes
|   |   |-- CarlibToast.swift           # Success/error/warning/info snackbar
|   |   |-- InlineAlert.swift           # Banner with icon + action
|   |   |-- ProgressRing.swift          # Photo upload progress
|   |-- Feedback/
|   |   |-- SkeletonLoader.swift        # Shimmer loading placeholders
|   |   |-- EmptyStateView.swift        # Illustration + title + description + CTA
|   |   |-- ErrorStateView.swift        # Illustration + retry CTA
|   |   |-- LoadingStateView.swift      # Full-screen or inline spinner
|   |-- Sheets/
|   |   |-- DraggableBottomSheet.swift  # Peek/Half/Full draggable sheet
|   |   |-- CarlibDialog.swift          # Confirmation/destructive/info modal
|   |   |-- ActionSheet.swift           # iOS action sheet styled
|   |-- Calendar/
|   |   |-- CalendarGrid.swift          # Month/week view with selectable days
|   |   |-- TimeSlotGrid.swift          # Available/booked/blocked slots
|   |   |-- WeekStrip.swift             # Horizontal scrollable date strip
|   |   |-- BookingSummary.swift        # Date + time + location recap
|   |-- Map/
|   |   |-- GarageMapView.swift         # MapKit Map wrapper with annotations
|   |   |-- GarageMapMarker.swift       # Custom annotation with availability color
|   |   |-- UserLocationMarker.swift    # Blue pulsing dot
|   |   |-- MapCallout.swift            # Garage name + distance tooltip
|   |-- Media/
|   |   |-- CameraOverlay.swift         # Guided frame for photo capture
|   |   |-- PhotoThumbnail.swift        # With delete, progress ring, error retry
|   |   |-- PhotoRequirementGuide.swift # Checklist of required angles
|   |   |-- FullScreenImageViewer.swift # Swipe, pinch-zoom, close
|   |-- Lists/
|       |-- CarlibListItem.swift        # 1-line, 2-line, 3-line with icon/chevron
|       |-- FilterChipGroup.swift       # Scrollable horizontal filter chips
|       |-- NotificationCard.swift      # Unread/read with timestamp
|
|-- Modifiers/
|   |-- LoadingModifier.swift           # .loading(isLoading) overlay
|   |-- ErrorModifier.swift             # .error(message, retry:) overlay
|   |-- EmptyModifier.swift             # .empty(when:, content:)
|   |-- ShimmerModifier.swift           # .shimmer() animation effect
|   |-- HapticModifier.swift            # .haptic(style:) on tap
|   |-- KeyboardAwareModifier.swift     # Scroll content above keyboard
|
|-- Previews/
    |-- DesignSystemCatalog.swift        # #Preview-based component gallery
    |-- TokenPreview.swift               # Color/type/spacing visual reference
```

#### Option B: Local Swift Package (Team Scale)

When the team grows beyond one developer, extracting the design system into a local Swift Package enforces a clean dependency boundary and enables independent testing.

```
Packages/CarlibDesignSystem/
|
|-- Package.swift                        # platforms: [.iOS(.v26)]
|-- Sources/CarlibDesignSystem/
|   |-- Tokens/                          # Same structure as Option A
|   |-- Components/
|   |-- Modifiers/
|   |-- Resources/                       # Colors, images bundled in package
|-- Tests/CarlibDesignSystemTests/
```

The main app target adds `CarlibDesignSystem` as a local package dependency. Components are imported via `import CarlibDesignSystem`.

**Why Option A for MVP:** A single developer managing one Xcode target avoids the overhead of package resolution, cross-module access control (`public` on everything), and separate test targets. The folder structure achieves the same logical separation. Migrate to Option B when a second developer joins or when the design system is shared across multiple targets (e.g., widget extension).

### 1.3 Asset Organization

#### Color Sets (Assets.xcassets/Colors/)

Organized to mirror the three-tier token architecture from the design system analysis (05_design_system_analysis.md Section 3):

```
Colors/
|-- Brand/
|   |-- Primary.colorset               # color.primary -> blue.600
|   |-- PrimarySubtle.colorset         # color.primary.subtle -> blue.50
|   |-- Secondary.colorset
|-- Semantic/
|   |-- Success.colorset               # color.success -> green.600
|   |-- SuccessSubtle.colorset
|   |-- Warning.colorset               # color.warning -> amber.600
|   |-- WarningSubtle.colorset
|   |-- Error.colorset                 # color.error -> muted red-orange (NOT aggressive red)
|   |-- ErrorSubtle.colorset
|   |-- Info.colorset
|   |-- InfoSubtle.colorset
|-- Surface/
|   |-- SurfaceDefault.colorset        # White
|   |-- SurfaceElevated.colorset
|   |-- SurfaceMuted.colorset          # gray.50
|-- Text/
|   |-- TextPrimary.colorset           # gray.900
|   |-- TextSecondary.colorset         # gray.600
|   |-- TextTertiary.colorset          # gray.400
|   |-- TextInverse.colorset           # White
|   |-- TextLink.colorset              # blue.600
|-- Border/
|   |-- BorderDefault.colorset         # gray.200
|   |-- BorderStrong.colorset          # gray.400
|   |-- BorderFocus.colorset           # blue.500
|-- Status/
    |-- StatusPending.colorset         # Amber
    |-- StatusAssigned.colorset        # Blue
    |-- StatusInProgress.colorset      # Blue.700
    |-- StatusCompleted.colorset       # Green
    |-- StatusCancelled.colorset       # Red
```

Each `.colorset` supports Any Appearance only for MVP (no dark mode). The token-based architecture means adding dark mode later requires only updating the color set variants, not touching any SwiftUI views.

#### SF Symbols Strategy

The zero-external-dependency constraint means SF Symbols is the icon system. Domain-specific mapping:

| Domain Concept | SF Symbol | Usage |
|---|---|---|
| Accident/Sinistre | `car.side.front.open` | Claim declaration, history |
| Camera/Photo | `camera.fill` | Photo capture step |
| Garage/Wrench | `wrench.and.screwdriver.fill` | Garage portal, repair |
| Map/Location | `mappin.and.ellipse` | Garage search, location |
| Calendar/Booking | `calendar` | Booking, planning |
| Status: Pending | `clock.fill` | En attente |
| Status: In Progress | `wrench.fill` | En reparation |
| Status: Complete | `checkmark.circle.fill` | Termine |
| Notification | `bell.fill` | Notification center |
| Profile | `person.crop.circle` | User profile |
| Search | `magnifyingglass` | Garage search |
| Filter | `line.3.horizontal.decrease` | Filter sheet |
| Phone | `phone.fill` | Contact garage |
| Arrow back | `chevron.left` | Navigation back |
| Close | `xmark` | Dismiss modal |
| Add | `plus` | Create slot, add photo |
| Settings | `gearshape` | Settings screen |

Where SF Symbols lack a domain match (e.g., specific car damage types), use a custom image asset in `Images/` rather than introducing an external icon library.

#### Localization

Single-language (French) via `Localizable.xcstrings` (Xcode 15+ String Catalog format). All user-facing strings are centralized, never hardcoded in views. Structure:

```
Keys organized by feature:
  auth.welcome.title = "Bienvenue sur Carlib"
  auth.login.email_placeholder = "Adresse e-mail"
  declaration.step1.title = "Type de sinistre"
  declaration.step2.camera_prompt = "Prenez une photo de l'avant du vehicule"
  garage_search.empty_state = "Aucun garage disponible dans votre zone"
  status.pending = "En attente"
  status.in_repair = "En reparation"
  status.completed = "Termine"
  error.network = "Connexion impossible. Verifiez votre connexion internet."
  error.retry = "Reessayer"
```

Even for a French-only app, using the String Catalog enables future localization and catches hardcoded strings in code review.

---

## 2. Implementation Phasing

### 2.1 Mapping Design Phases to SwiftUI Development

The PRD defines a 5-phase design process. Below is how SwiftUI implementation maps to each phase, assuming a single iOS developer begins work alongside or shortly after the design phase.

#### Phase 0 -- Kickstart (Weeks 1-2): Foundation Setup

**SwiftUI work that can begin immediately (no design dependency):**

| Task | Details | Days |
|---|---|---|
| Xcode project setup | Create project, folder structure, Swift 6 strict concurrency, iOS 26 deployment target | 0.5 |
| SwiftData schema (draft) | User, Declaration, Garage, Booking, RepairStatus, Notification models based on PRD user stories | 2 |
| APIClient skeleton | URLSession async/await, endpoint enum, error types, request builder | 1.5 |
| NetworkMonitor | NWPathMonitor wrapper, @Observable, offline state detection | 0.5 |
| LocationManager | CLLocationManager async wrapper, permission handling | 1 |
| Navigation skeleton | Role-based TabView, NavigationStack per tab, NavigationPath router | 1 |
| LoadableState enum | Generic `enum LoadableState<T> { case idle, loading, loaded(T), error(Error), empty }` | 0.5 |
| French string constants | Centralized string keys for all known PRD copy (labels, CTAs, status names) | 1 |
| **Phase 0 dev total** | | **8 days** |

**Blocked on Phase 0 design outcomes:** Data model fields depend on kickstart workshops (what exactly is in a claim dossier). Preliminary schema can be drafted from PRD user stories, refined after persona validation.

#### Phase 1 -- UX Wireframes (Weeks 3-5): SwiftUI Prototyping at Wireframe Fidelity

**Key insight:** SwiftUI itself is a prototyping tool. Wireframe-fidelity screens with real navigation and data flow can be built faster in SwiftUI than a clickable Figma prototype for a developer who is already building the app. This serves dual purpose: validates navigation architecture AND produces production-ready view skeletons.

**What can be prototyped during Phase 1:**

| Feature | SwiftUI Prototype Scope | Design Dependency | Days |
|---|---|---|---|
| Auth flow | Login, Registration, Role Selection with real NavigationStack transitions | Wireframe structure (not visual polish) | 2 |
| Declaration flow (4 steps) | Step-by-step with ProgressStepper, form fields, forward/back navigation | Step sequence and field list from UX wireframes | 3 |
| Garage search | Map + List toggle, filter sheet, garage detail bottom sheet with MapKit | Wireframe layout, filter categories | 3 |
| Booking | Date strip + time slot grid, confirmation sheet | Slot structure from UX wireframes | 2 |
| Tracking | Status timeline view with mock data, push notification simulation | Status state machine from UX | 1.5 |
| Garage portal: Claims | List, detail, accept/decline flow | Wireframe structure | 2 |
| Garage portal: Planning | Week calendar grid (the hardest UI component) | Wireframe layout | 3 |
| Garage portal: Status update | Linear stepper with tap-to-advance | Wireframe flow | 1 |
| **Phase 1 dev total** | | | **17.5 days** |

**What cannot be built during Phase 1:** Final component styling (colors, typography, spacing), photo capture camera overlay (needs UI spec), skeleton loaders (need visual spec), landing page (needs design system + marketing copy).

#### Phase 2 -- UI / Design System (Weeks 5-7): Production Fidelity

**Prerequisite: Design system tokens exported as Swift-ready values (see Section 7).**

Phase 2 is the highest-effort development phase. The design system must be tokenized before any production-fidelity work begins.

| Task | Dependency | Days |
|---|---|---|
| **Design system tokens in code** | Color sets from Figma, typography scale, spacing | 2 |
| **Foundation components** | Token values confirmed | 4 |
| - CarlibButton (5 variants x 6 states) | | |
| - CarlibTextField, TextArea, SearchField | | |
| - CarlibCard (3 variants) | | |
| - StatusBadge, ProgressStepper, StatusTimeline | | |
| - CarlibToast, InlineAlert | | |
| - SkeletonLoader, EmptyStateView, ErrorStateView | | |
| **Domain components** | Foundation components + HiFi specs | 5 |
| - GarageCard, ClaimCard, BookingCard | | |
| - LicensePlateField, PhoneNumberField, SIRETField | | |
| - PhotoCaptureInput, CameraOverlay, PhotoThumbnail | | |
| - CalendarGrid, TimeSlotGrid, WeekStrip | | |
| - GarageMapMarker, MapCallout | | |
| **Apply design system to all wireframe screens** | Components built, HiFi specs delivered | 8 |
| - Restyle all Phase 1 prototype views to HiFi | | |
| - Add empty/error/loading states to every screen | | |
| - Implement all state variants (4x per screen) | | |
| **Camera + Photos integration** | Photo capture UI spec | 3 |
| **Landing page** | Landing page design + marketing copy | 2 |
| **Phase 2 dev total** | | **24 days** |

#### Phase 3 -- Landing Page (Week 7-8): Parallel Track

If the landing page is in-app (e.g., shown to unauthenticated visitors or as a "learn more" section), it is built as a SwiftUI ScrollView with sections. If it is a web page, it is out of scope for the iOS developer.

| Task | Days |
|---|---|
| Landing page view (if in-app) | 2 (already counted above) |
| Garage signup form with validation | 1 |
| **Phase 3 dev total** | **1-3 days** (overlap with Phase 2) |

#### Phase 4 -- Finalization (Week 8-9): Polish and Handoff

| Task | Days |
|---|---|
| Accessibility pass (VoiceOver labels, Dynamic Type, Reduce Motion) | 3 |
| French string audit (zero-typo verification) | 1 |
| Device testing matrix (see Section 5) | 2 |
| Performance profiling (Instruments: launch, memory, scrolling) | 1.5 |
| Prototype on physical device for client demo | 0.5 |
| Bug fixes from QA | 3 |
| **Phase 4 dev total** | **11 days** |

### 2.2 Critical Path Analysis

```
CRITICAL PATH (longest sequential chain):

[Brand Identity Decision] -----> [Design System Tokens] -----> [Component Build] -----> [HiFi Screen Application]
     (Phase 0, Day 1-10)          (Phase 2, Day 1-2)          (Phase 2, Day 3-11)      (Phase 2, Day 12-19)
                                        |
                                        |  PARALLEL TRACK:
                                        +-----> [Camera/Photos Integration]
                                        +-----> [Calendar Component Build]
                                        +-----> [MapKit Integration]

[Attribution Logic Decision] ---> [Marketplace Flow UX] -----> [Garage Search + Claims Implementation]
     (Phase 0, must resolve)       (Phase 1)                    (Phase 2)
```

**The single longest serial dependency is: Brand Identity -> Design Tokens -> Component Library -> Screen Application.** Any delay in brand identity cascades through the entire implementation timeline. This matches the finding in the existing ops analysis (07_ops_delivery_analysis.md, R01).

### 2.3 Parallelization Map

| Parallel Track A | Parallel Track B | Parallel Track C | When |
|---|---|---|---|
| SwiftData schema + APIClient | Location/Camera service wrappers | Navigation skeleton | Phase 0 |
| Declaration flow prototype | Garage search prototype (MapKit) | Garage portal claims list | Phase 1 |
| Design system tokens in code | Calendar component (hardest) | Photo capture integration | Phase 2 early |
| Driver HiFi screens | Garage HiFi screens | Landing page | Phase 2 mid |
| Accessibility pass | Device testing | French string audit | Phase 4 |

**For a single developer**, true parallelism is impossible. The table above represents the optimal **sequencing** -- work on Track A first, switch to Track B when blocked on design deliverables for Track A. With a two-developer team, Tracks A and B can literally run in parallel.

---

## 3. Effort Estimation

### 3.1 Screen Count Breakdown

Derived from the UI analysis (04_ui_analysis.md Section 4) and adjusted for the SwiftUI implementation where some Figma "screens" map to states within a single SwiftUI view.

#### Shared / Global Views

| # | View | States (empty/loaded/loading/error) | SwiftUI Complexity | Days |
|---|---|---|---|---|
| S-01 | SplashView | 1 (loading only) | Low | 0.25 |
| S-02 | WelcomeView (role selection) | 1 (static) | Low | 0.5 |
| S-03 | RegistrationView (multi-step, role-aware) | 4 (per step x 2 roles) | High | 2 |
| S-04 | LoginView | 4 | Medium | 1 |
| S-05 | ForgotPasswordView | 3 | Low | 0.5 |
| S-06 | NotificationCenterView | 4 | Medium | 1.5 |
| S-07 | SettingsView | 1 (static list) | Low | 0.5 |
| S-08 | ProfileEditView | 4 | Medium | 1 |
| S-09 | LegalView | 1 (static) | Low | 0.25 |
| S-10 | OfflineView / ErrorView | 2 | Low | 0.5 |
| | **Shared subtotal** | | | **8 days** |

#### Driver Views

| # | View | States | SwiftUI Complexity | Days |
|---|---|---|---|---|
| D-01 | DriverHomeView (dashboard) | 4 | Medium | 1.5 |
| D-02 | Step1AccidentTypeView | 2 | Low | 0.5 |
| D-03 | Step2PhotoCaptureView | 4 (+ camera integration) | **Very High** | 3 |
| D-04 | Step3VehicleInfoView | 4 (pre-fill + validation) | Medium | 1 |
| D-05 | Step4LocationView (map + geocoding) | 4 | High | 2 |
| D-06 | DeclarationSummaryView | 2 | Medium | 1 |
| D-07 | DeclarationSuccessView | 1 (+ animation) | Low | 0.5 |
| D-08 | GarageMapView | 4 (+ MapKit annotations) | **Very High** | 3 |
| D-09 | GarageListView | 4 | Medium | 1 |
| D-10 | GarageFilterSheet | 2 | Medium | 1 |
| D-11 | GarageDetailSheet | 4 | Medium | 1.5 |
| D-12 | BookingCalendarView | 4 | High | 2 |
| D-13 | TimeSlotPickerView | 3 | Medium | 1 |
| D-14 | BookingConfirmationView | 3 | Low | 0.5 |
| D-15 | StatusDashboardView | 4 | Medium | 1.5 |
| D-16 | StatusTimelineView | 4 | Medium | 1.5 |
| D-17 | DossierHistoryView | 4 | Medium | 1 |
| D-18 | DossierArchiveDetailView | 3 | Low | 0.5 |
| D-19 | VehicleProfileView | 4 | Medium | 1 |
| D-20 | GarageContactView | 2 | Low | 0.5 |
| D-21 | RatingView (post-repair) | 3 | Medium | 1 |
| D-22 | DeclarationFlowView (container + stepper) | 1 | Medium | 1 |
| | **Driver subtotal** | | | **27 days** |

#### Garage Portal Views

| # | View | States | SwiftUI Complexity | Days |
|---|---|---|---|---|
| G-01 | GarageDashboardView | 4 | Medium | 1.5 |
| G-02 | AvailableClaimsListView | 4 | Medium | 1.5 |
| G-03 | ClaimDetailView (pre-acceptance) | 4 (+ photo gallery) | High | 2 |
| G-04 | AcceptDeclineView | 3 (+ race condition handling) | Medium | 1 |
| G-05 | ActiveDossiersView | 4 | Medium | 1 |
| G-06 | DossierDetailView (active) | 4 | Medium | 1.5 |
| G-07 | StatusUpdateView | 3 | Medium | 1 |
| G-08 | WeekPlanningView | 4 | **Very High** (custom calendar grid) | 4 |
| G-09 | DayDetailView | 3 | Medium | 1 |
| G-10 | AvailabilityManagementView | 4 | High | 2 |
| G-11 | GarageProfileView | 3 | Low | 0.5 |
| G-12 | GarageProfileEditView | 4 | Medium | 1.5 |
| G-13 | GaragePhotoManagerView | 4 | High | 2 |
| G-14 | ServiceAreaView (map-based zone) | 3 | High | 2 |
| G-15 | DossierArchiveView | 4 | Medium | 1 |
| G-16 | StatisticsView | 3 | Medium | 1 |
| G-17 | GarageContactView | 2 | Low | 0.5 |
| | **Garage subtotal** | | | **24.5 days** |

#### Landing Page

| # | View | Days |
|---|---|---|
| L-01 | LandingPageView (multi-section scroll) | 2 |
| | GarageSignupFormView (with validation) | 1 |
| | **Landing subtotal** | **3 days** |

### 3.2 Component Build Effort

Based on the 88-component inventory from the design system analysis (05_design_system_analysis.md Section 2.14):

| Category | Component Count | Must Build | Avg Days/Component | Total Days |
|---|---|---|---|---|
| Foundation (Button, Typography, Spacing, Card, Avatar, Skeleton, Divider, Icon) | 8 | 8 | 0.5 | 4 |
| Input & Form (TextField, TextArea, Select, DatePicker, Search, Phone, Plate, Photo, Location, etc.) | 15 | 14 | 0.75 | 10.5 |
| Navigation (TabBar, TopBar, BackClose, BottomSheet, SegmentedTab) | 5 | 5 | 0.5 | 2.5 |
| Data Display (GarageCard, ClaimCard, VehicleCard, BookingCard, EmptyState, ErrorState, ListItem, ImageGallery) | 11 | 10 | 0.5 | 5 |
| Status & Feedback (StatusBadge, ProgressStepper, StatusTimeline, Toast, InlineAlert, ProgressBar, NotificationBadge) | 7 | 6 | 0.75 | 4.5 |
| Map (MapView, GarageMarker, UserMarker, Callout, MapListToggle) | 5 | 5 | 1 | 5 |
| Calendar (CalendarGrid, TimeSlotGrid, AvailabilityToggle, BookingSummary, WeekStrip) | 5 | 5 | 1.25 | 6.25 |
| Photo & Media (CameraOverlay, PhotoThumbnail, PhotoGuide, FullScreenViewer) | 4 | 4 | 1 | 4 |
| Communication (NotificationCard, NotificationList, PushPreview) | 3 | 3 | 0.5 | 1.5 |
| Onboarding & Auth (Splash, Carousel, Login, Registration, RoleSelector) | 5 | 4 | 0.5 | 2 |
| Modal & Overlay (Dialog, BottomSheet, FullScreenModal, ActionSheet) | 4 | 4 | 0.5 | 2 |
| Landing Page (Hero, HowItWorks, Benefits, SignupForm, StickyBar, Footer) | 6 | 5 | 0.5 | 2.5 |
| Marketplace (GarageResultCard, GarageDetailSheet, ClaimDossier, Attribution, QuickAccept) | 5 | 5 | 0.75 | 3.75 |
| **TOTALS** | **83** | **78** | | **54 days** |

**Note:** Component effort overlaps significantly with screen effort -- building a screen builds its components. The numbers above represent isolated component development time. In practice, components are built as screens need them, so the true additional effort beyond screen builds is approximately 40% of the component total (components shared across multiple screens). This gives an adjusted component-only overhead of approximately **22 days**.

### 3.3 Navigation and Routing Complexity

| Concern | Complexity | Notes |
|---|---|---|
| Role-based root routing (driver vs. garage) | Medium | ContentView switches between DriverTabView and GarageTabView based on authenticated user role. Single `@Observable` AppState. |
| Per-tab NavigationStack | Medium | Each tab maintains its own NavigationPath. Standard iOS pattern. 4 tabs per role = 8 NavigationStacks. |
| Declaration flow (multi-step within single NavigationStack) | Medium-High | 4-step flow with forward/back navigation, draft saving on back, validation gating on forward. Consider a dedicated sub-NavigationStack or paged TabView. |
| Deep linking from push notifications | High | Notification payload must resolve to: specific claim, specific booking, specific status screen. Requires a DeepLinkHandler that translates notification userInfo into a NavigationPath. |
| Bottom sheet navigation (garage detail from map) | Medium | iOS 16.4+ `presentationDetents` handles peek/half/full. Navigation within a sheet (detail -> booking) requires a sheet-internal NavigationStack. |
| Modal presentation management | Medium | Multiple overlapping sheet presentations (e.g., filter sheet on top of map, then garage detail). SwiftUI allows only one `.sheet` per view -- use `item`-based presentation or a presentation coordinator. |
| Cross-role state sync | Low for MVP | Driver and garage are separate accounts. No real-time cross-role state sync needed in the client app. Server handles state propagation. |
| **Routing total effort estimate** | | **5 days** |

### 3.4 Data Model Complexity (SwiftData)

| Model | Fields (estimated) | Relationships | Complexity | Notes |
|---|---|---|---|---|
| User | 12 (id, role, email, phone, name, avatar, vehicleId, garageId, pushToken, createdAt, etc.) | -> Vehicle (optional), -> Garage (optional) | Medium | Role-polymorphic: driver has vehicle, garage has garage profile |
| Vehicle | 8 (id, plate, make, model, year, insuranceRef, ownerId, photoURL) | -> User | Low | |
| Declaration (Sinistre) | 20+ (id, type, status, photos[], vehicleId, location, description, createdAt, garageId, bookingId, etc.) | -> Vehicle, -> Garage (optional), -> Booking (optional), -> StatusEvent[] | **High** | Central domain model. Status is an enum with 9 values. Draft saving required. |
| Garage | 18 (id, name, address, lat, lon, phone, siret, photos[], specialties[], zone, availability, rating, description, etc.) | -> Declaration[], -> Booking[] | High | Search, filter, sort. Zone is geographic. |
| Booking | 10 (id, declarationId, garageId, date, timeSlot, status, confirmedAt, etc.) | -> Declaration, -> Garage | Medium | Status enum with 7 values. |
| TimeSlot | 6 (id, garageId, date, startTime, endTime, status) | -> Garage | Low | Status: available/booked/blocked |
| StatusEvent | 6 (id, declarationId, status, timestamp, actor, note) | -> Declaration | Low | Append-only timeline |
| AppNotification | 8 (id, type, title, body, isRead, createdAt, deepLinkTarget, relatedId) | None (standalone) | Low | Local persistence for notification center |
| **SwiftData total effort** | | | | **5 days** (schema + migrations + DataController) |

**SwiftData-specific concerns for Carlib:**

1. **Complex queries:** Garage search requires geospatial filtering (garages within X km). SwiftData uses `#Predicate` which does not support geographic distance calculations. Solution: fetch all garages, filter in-memory by CLLocation distance, or use a server-side geospatial query and cache results.
2. **Status enum persistence:** SwiftData handles `Codable` enums natively. The three-flow status system (claim/booking/repair) maps to three Swift enums.
3. **Draft saving:** Partially completed declarations must persist across app kills. SwiftData supports this via immediate model insertion with a `draft` status.
4. **Relationship complexity:** Declaration -> Garage -> Booking -> StatusEvent forms a 4-level relationship chain. SwiftData handles this but query performance should be profiled.

### 3.5 Total Effort Summary

| Category | Person-Days |
|---|---|
| **Phase 0: Foundation** (project setup, SwiftData, APIClient, services, navigation skeleton) | 8 |
| **Phase 1: Wireframe-Fidelity Prototypes** (all screens with navigation, mock data) | 17.5 |
| **Phase 2: Design System + Production Fidelity** | |
| - Design system tokens in code | 2 |
| - Component library (adjusted for screen overlap) | 22 |
| - Apply HiFi to all screens (driver + garage + shared + landing) | 24 (absorbed in screen + component build) |
| - Camera/Photos integration | 3 |
| - MapKit integration (absorbed in screen build) | 0 (already counted) |
| **Phase 3: Landing page** | 3 |
| **Phase 4: Polish** | |
| - Accessibility pass | 3 |
| - Device testing + French audit | 3 |
| - Performance profiling | 1.5 |
| - Bug fixes | 3 |
| **Navigation/routing** | 5 |
| **SwiftData schema + persistence** | 5 |
| **Networking layer** | 3 |
| **Total raw estimate** | **103 days** |
| **Contingency (20% for unknowns, iOS 26 beta issues, design iteration)** | 20.5 |
| **GRAND TOTAL** | **~124 person-days** |

At 5 working days/week:

| Team Size | Calendar Duration | Notes |
|---|---|---|
| 1 developer | ~25 weeks (6 months) | Not viable for a competitive launch |
| 1 developer (with design overlap starting Phase 1) | ~18-20 weeks | Starts building during design phase |
| 2 developers | ~13-15 weeks | One on driver features, one on garage portal + design system |
| 2 developers + 1 part-time (design system) | ~10-12 weeks | Optimal for this scope |

**Recommendation for the dev brief:** Budget **120-130 person-days** for the iOS implementation. A 2-developer team working for 13-15 weeks is the realistic minimum for quality delivery. A solo developer scenario pushes to 5-6 months which is likely too slow for market validation.

---

## 4. Risk Register

### 4.1 SwiftUI and iOS 26 Specific Risks

| # | Risk | Likelihood | Impact | Phase | Mitigation |
|---|---|---|---|---|---|
| **R-SW01** | **iOS 26 beta instability during development** -- If dev starts before iOS 26 GM (expected September 2026), SwiftUI APIs may change, crash, or behave inconsistently across beta releases. | High (if building pre-GM) | High | All | Pin Xcode beta version for the team. Avoid bleeding-edge iOS 26 APIs until beta 4+. Use `if #available` for iOS 26-only features. Maintain an "API change" log. Budget 5 days for GM migration. |
| **R-SW02** | **MapKit SwiftUI limitations** -- SwiftUI Map (MapKit) has historically lagged behind UIKit MKMapView in feature support. Custom annotations, callouts, and overlay interactivity may be limited or require UIViewRepresentable bridging. | Medium | Medium | Phase 1-2 | Prototype MapKit integration in Phase 0 as a spike (0.5 days). If SwiftUI Map is insufficient for custom garage markers with availability indicators, plan for a UIViewRepresentable wrapper around MKMapView. This adds ~2 days. |
| **R-SW03** | **Camera/PhotosUI integration complexity** -- AVFoundation camera session management (guided overlay, multi-photo capture, quality detection) is UIKit-based. Integrating a custom camera view in SwiftUI requires UIViewControllerRepresentable. PhotosUI PHPickerViewController is also UIKit. | Medium | Medium | Phase 2 | Use UIViewControllerRepresentable for the camera session. The guided overlay (car silhouette) is a SwiftUI overlay on top. Budget 3 days specifically for camera integration. Test on physical devices early -- Simulator camera is non-functional. |
| **R-SW04** | **SwiftData maturity for this use case** -- SwiftData is relatively new (iOS 17+). Complex queries, migration stability, and performance with relationship-heavy models may surface unexpected issues. | Medium | Medium | All | Keep the SwiftData schema flat where possible. Avoid deeply nested relationships. Profile query performance with Instruments early. Have a fallback plan: if SwiftData proves unreliable for complex garage search queries, use a lightweight server-side API + in-memory cache pattern instead. |
| **R-SW05** | **No external dependencies constraint: networking** -- Without Alamofire or similar, the networking layer must be hand-built using URLSession. This includes request building, response decoding, retry logic, authentication token management, and multipart upload (photos). | Low (well-understood) | Low | Phase 0 | URLSession with async/await is mature and well-documented. The constraint is a feature, not a bug -- it eliminates dependency management overhead. Budget 3 days for a robust APIClient. Photo upload (multipart form) is the most complex part -- budget 1 extra day. |
| **R-SW06** | **No external dependencies constraint: image caching** -- Without SDWebImage/Kingfisher, garage photos and claim photos must be loaded and cached manually. | Medium | Medium | Phase 2 | Build a lightweight image cache using `URLCache` (disk) + `NSCache` (memory). SwiftUI `AsyncImage` handles basic URL image loading but lacks disk caching. A custom `CachedAsyncImage` view (~50 lines) solves this. Budget 1 day. |
| **R-SW07** | **No external dependencies constraint: image compression** -- Photo uploads from camera (12MP+ on modern iPhones) need compression before upload. Without a library, use `UIImage.jpegData(compressionQuality:)` and `ImageIO` framework for resizing. | Low | Low | Phase 2 | Standard UIKit APIs (`UIImage.jpegData`, `CGImageSource`) handle this. Budget 0.5 days. |
| **R-SW08** | **Custom calendar component complexity** -- The garage week planning view (G-08) is a custom calendar grid that does not exist in SwiftUI natively. Building a performant, interactive week-view calendar from scratch is a significant effort. | High | High | Phase 2 | This is the single hardest UI component in the app. Budget 4 full days. Build it early, test performance with 50+ slots. Consider a simplified version for MVP (day list instead of week grid) if timeline is tight. |
| **R-SW09** | **Bottom sheet stacking in SwiftUI** -- The garage search screen requires a map with a draggable bottom sheet (list), and tapping a garage opens another sheet (detail). SwiftUI does not natively support stacked/nested sheets well. | Medium | Medium | Phase 2 | Use `.sheet(item:)` for the detail sheet and a custom DraggableBottomSheet (GeometryReader + DragGesture) for the list overlay on the map. Avoid relying on `.presentationDetents` for the map overlay -- it conflicts with the detail sheet. Budget 1.5 days for the sheet stacking solution. |
| **R-SW10** | **Swift 6 strict concurrency** -- iOS 26 / Xcode 26 likely enforces Swift 6 strict concurrency by default. All `@Observable` classes, network calls, and location/camera callbacks must be properly annotated for sendability and actor isolation. | Medium | Medium | All | Enable strict concurrency warnings from day one (`SWIFT_STRICT_CONCURRENCY = complete`). Annotate view models as `@MainActor`. Use `Sendable` for data models. Fix warnings incrementally, not at the end. |
| **R-SW11** | **Single-developer risk: bus factor of 1** -- A solo developer illness, departure, or burnout stalls the entire project. No code review, no knowledge sharing, no pair debugging. | Medium | Critical | All | Document architecture decisions in code comments and a brief ADR (Architecture Decision Record) file. Use descriptive commit messages. If budget allows, schedule a weekly 1-hour code review with an external senior iOS developer. Prefer convention over configuration (standard SwiftUI patterns over clever abstractions). |
| **R-SW12** | **Design-to-code delta: Figma designs not implementable in SwiftUI** -- Some design decisions (custom animations, non-standard transitions, complex gesture interactions) may be disproportionately expensive in SwiftUI. | Medium | Medium | Phase 2 | Establish a design-dev feedback loop during Phase 2. The developer should review HiFi designs BEFORE sign-off and flag implementation concerns. Create a "SwiftUI feasibility" column in the design review checklist. |

### 4.2 Risk Heat Map

```
                    LOW Impact     MEDIUM Impact    HIGH Impact     CRITICAL Impact
                   +----------------------------------------------------------+
  HIGH Likelihood  |               | R-SW01 (beta) | R-SW08 (cal)  |               |
                   |               | R-SW09 (sheet)|               |               |
                   +----------------------------------------------------------+
  MED Likelihood   |               | R-SW02 (map)  | R-SW04 (data) | R-SW11 (bus)  |
                   |               | R-SW03 (cam)  |               |               |
                   |               | R-SW06 (img$) |               |               |
                   |               | R-SW10 (conc) |               |               |
                   |               | R-SW12 (delta)|               |               |
                   +----------------------------------------------------------+
  LOW Likelihood   | R-SW05 (net)  |               |               |               |
                   | R-SW07 (comp) |               |               |               |
                   +----------------------------------------------------------+
```

**Top 3 risks to address immediately:**
1. R-SW08 (Calendar component) -- Spike it in Phase 0/1 to validate feasibility.
2. R-SW01 (iOS 26 beta) -- Lock Xcode version, avoid bleeding-edge APIs.
3. R-SW11 (Single-developer) -- Establish documentation practice and external review.

---

## 5. Quality Assurance Checklist

### 5.1 Device Testing Matrix

The app targets iPhone only, Portrait only. Test across the active iPhone size classes:

| Device | Screen Size | Resolution | Priority | Why |
|---|---|---|---|---|
| iPhone 16 Pro | 6.3" | 1206 x 2622 | **Primary** | Current flagship, likely 60%+ of users |
| iPhone 16 | 6.1" | 1179 x 2556 | **Primary** | Standard model, high market share |
| iPhone SE (3rd gen) | 4.7" | 750 x 1334 | **Required** | Smallest supported screen. Tests layout compression, text truncation, touch target crowding. Critical for form-heavy screens. |
| iPhone 16 Pro Max | 6.9" | 1320 x 2868 | **Secondary** | Largest screen. Tests that layouts expand gracefully, maps utilize space. |
| iPhone 15 | 6.1" | 1179 x 2556 | **Secondary** | Previous generation, verifies backward compat within iOS 26. |
| iPhone 16 Plus | 6.7" | 1290 x 2796 | **Optional** | Large non-Pro. |

**Testing protocol per device:**
- [ ] All 5 core flows complete without crash (declaration, garage search, booking, tracking, garage accept)
- [ ] All forms submit correctly with French-accented input
- [ ] Map loads and responds to gestures (pan, zoom, tap marker)
- [ ] Camera capture and photo gallery import work
- [ ] Push notification deep links resolve to correct screen
- [ ] Rotation locked to portrait (verify `.supportedInterfaceOrientations` in Info.plist)
- [ ] Bottom safe area respected (home indicator)
- [ ] Dynamic Island / status bar interactions work correctly

### 5.2 Accessibility Audit

Based on WCAG 2.1 AA and Apple's iOS accessibility guidelines. The existing design system analysis (05_design_system_analysis.md Section 7) mandates this.

#### VoiceOver

- [ ] Every interactive element has a descriptive `accessibilityLabel` in French
- [ ] Images have `accessibilityLabel` describing content, or are marked `.accessibilityHidden(true)` if decorative
- [ ] Status badges use `accessibilityLabel` combining status name + status meaning (e.g., "En attente -- votre dossier est en cours de traitement")
- [ ] Map annotations are focusable and announce garage name + distance
- [ ] Stepper progress announces "Etape 2 sur 4 -- Prise de photos"
- [ ] Custom components (calendar grid, time slots) implement `accessibilityElement(children:)` correctly
- [ ] Navigation between screens is announced ("Ecran: Declaration de sinistre")
- [ ] Swipe-to-dismiss gestures have alternative tappable controls
- [ ] Toast notifications are announced via `AccessibilityNotification.Announcement`
- [ ] Form validation errors are announced when they appear

#### Dynamic Type

- [ ] All text uses `.font(.carlibBody)` (custom font style) or system text styles, never hardcoded point sizes
- [ ] Layout adapts from `xSmall` through `xxxLarge` accessibility sizes without truncation of critical information
- [ ] Buttons remain tappable at all Dynamic Type sizes (minimum 44x44pt touch target)
- [ ] Card layouts reflow gracefully (horizontal -> vertical stack at large sizes)
- [ ] Status badges remain readable at all sizes
- [ ] Calendar week view degrades gracefully at large text sizes (consider showing fewer days or switching to day view)
- [ ] Test at: Default, xLarge, AX3 (three checkpoints cover the range)

#### Reduce Motion

- [ ] `@Environment(\.accessibilityReduceMotion)` is checked before all custom animations
- [ ] Status timeline pulse animation disabled with Reduce Motion
- [ ] Page transitions use crossfade instead of slide when Reduce Motion is on
- [ ] Declaration success animation (confetti/checkmark) replaced with static success state
- [ ] Skeleton shimmer animation replaced with static placeholder when Reduce Motion is on

#### Color and Contrast

- [ ] All text on all backgrounds meets 4.5:1 contrast ratio (body text) or 3:1 (large text/headings)
- [ ] Status is never communicated by color alone (always color + icon + text label)
- [ ] Interactive elements have non-color visual indicators (shape, border, icon)
- [ ] Test with Settings > Accessibility > Display > Increase Contrast enabled
- [ ] Test with Settings > Accessibility > Display > Differentiate Without Color enabled
- [ ] Focus/selection states use border or shape change, not just color change

#### Touch Targets

- [ ] All tappable elements: minimum 44x44pt (Apple HIG)
- [ ] Calendar time slots: minimum 44pt height even when dense
- [ ] Map markers: minimum 44x44pt tap area (even if visual marker is smaller)
- [ ] Filter chips: minimum 44pt height, adequate horizontal padding
- [ ] Close/dismiss buttons on sheets and modals: 44x44pt minimum

### 5.3 Performance Benchmarks

| Metric | Target | Tool | Screen/Flow |
|---|---|---|---|
| Cold launch to interactive | < 1.5s | Instruments > App Launch | Splash -> Home |
| Warm launch | < 0.5s | Instruments > App Launch | Background -> Foreground |
| List scroll frame rate | 60fps sustained, no drops below 45fps | Instruments > Core Animation | Garage list, Claims list, Notification list |
| Map rendering | < 1s to full tile load on WiFi | Instruments > Network | Garage search map view |
| Photo capture to thumbnail | < 0.5s | Custom timing | Declaration Step 2 |
| Photo compression (12MP -> upload-ready) | < 2s per photo | Custom timing | Declaration Step 2 |
| Screen transition | < 0.3s | Instruments > SwiftUI | Any NavigationStack push/pop |
| Memory ceiling | < 150MB during normal use | Instruments > Allocations | Full app usage session |
| Memory during photo gallery (10+ photos) | < 250MB | Instruments > Allocations | Claim detail with photo gallery |
| SwiftData query (garage list, 100 items) | < 100ms | Instruments > SwiftData | Garage search |
| Network request (API call, typical) | < 2s on 4G, < 5s on 3G | Instruments > Network | Any data fetch |

### 5.4 Localization QA (French)

Even for a single-language app, French has specific QA requirements:

- [ ] **Diacritics rendering:** Verify all accented characters display correctly at all font sizes (e, e, a, u, c, o, i)
- [ ] **String length overflow:** French labels are ~20% longer than English equivalents. Verify no truncation on:
  - Navigation bar titles (e.g., "Gestion des disponibilites" is 28 characters)
  - Button text (e.g., "Confirmer la reservation" is 24 characters)
  - Status badges (e.g., "En reparation" is 14 characters)
  - Tab bar labels
- [ ] **French typography rules:** Verify non-breaking spaces before `:`, `;`, `!`, `?` (French typographic convention)
- [ ] **Date formatting:** `DateFormatter.dateStyle` with `Locale(identifier: "fr_FR")`:
  - "Lundi 15 mars 2026" (not "Monday March 15, 2026")
  - "15 mars" (not "Mar 15")
  - "14h30" (not "2:30 PM") -- 24-hour time
- [ ] **Number formatting:** Decimal separator is comma: "3,5 km" (not "3.5 km")
- [ ] **Currency formatting:** "150,00 EUR" with non-breaking space before EUR
- [ ] **Phone number display:** "+33 6 12 34 56 78" (French mobile format)
- [ ] **Address formatting:** French postal format: "12 rue de la Republique, 75001 Paris"
- [ ] **Legal text:** CGU, mentions legales, politique de confidentialite -- all in proper French
- [ ] **Zero-typo verification:** Full proofread by native French speaker (DoD requirement)
- [ ] **Guillemets:** Use French quotation marks << >> where applicable, not " "
- [ ] **Test with Pseudolocation:** Xcode scheme > Options > App Language > Pseudolanguages to detect hardcoded strings

### 5.5 Network Condition Testing

Post-accident users may have poor connectivity. This is a critical QA dimension.

| Condition | How to Simulate | What to Verify |
|---|---|---|
| **No network** | Airplane mode | Offline banner appears. Cached data (previous garages, saved drafts) is accessible. Write actions (declaration submission) are queued and retry when online. Camera still works for photo capture. |
| **Slow network (3G)** | Network Link Conditioner: 3G profile | All screens show loading states. No blank white screens. Progress indicators visible for photo upload. Timeout errors are graceful (not crashes). |
| **Intermittent network** | Network Link Conditioner: 100% packet loss toggle | Mid-submission failure is handled: data preserved locally, retry CTA shown. Map tiles handle partial load. |
| **WiFi -> cellular handoff** | Start on WiFi, disable WiFi | In-progress uploads resume. No duplicate submissions. NetworkMonitor detects transition. |
| **Very slow photo upload** | Network Link Conditioner: Edge profile | Photo upload progress ring visible. User can continue declaration while photos upload in background. Cancellation of individual photo upload works. |
| **Server error (500)** | Mock API response | Error state shown with retry CTA. No crash. No data loss. Stack trace not shown to user. |
| **Server unreachable (timeout)** | Mock 30s+ response time | Timeout after configurable interval (15s recommended). Error state with retry. Relevant French error message. |

**Tool:** Xcode > Network Link Conditioner (requires Apple Developer profile installed on device). Also available: Settings > Developer > Network Link Conditioner on device.

---

## 6. Blocker Resolution Timeline

### 6.1 Decision Matrix: What Must Be Resolved Before Which Phase

| # | Open Question (from PRD Section 9) | Blocks Design Phase | Blocks Dev Phase | Must Resolve By | Proposed Default if Delayed |
|---|---|---|---|---|---|
| **Q1** | Brand identity (logo, colors, fonts) | Phase 2 (UI) | Phase 2 dev (design system tokens) | **End of Phase 0 (Week 2)** | Use a placeholder brand: "Carlib blue" (#3B82F6, Tailwind blue-500), Inter font, temporary wordmark. This allows dev to proceed with token structure. Replace values when brand is finalized. Cost of delay: 2-3 days to re-skin if brand changes significantly. |
| **Q2** | Attribution logic (auto-first-accept vs. driver-selects) | Phase 1 (UX wireframes for marketplace flow) | Phase 1 dev (garage search + claims flow) | **End of Phase 0, Week 1** | Default to **driver-selects** model. Rationale: aligns with existing user stories (US02/US03 assume driver browses and chooses), provides better UX control for drivers in stress, simpler to implement (no real-time race condition for auto-attribution). If client later wants auto-attribution, it is an additive feature, not a rewrite. |
| **Q3** | Garage portal scope (mobile-only vs. web/tablet) | Phase 1 (affects screen count and layout patterns) | Phase 0 dev (project structure: one target vs. multi-platform) | **End of Phase 0, Week 2** | Default to **mobile-only (iPhone)**. This matches the CLAUDE.md constraint ("iPhone only"). Tablet/web is a V2 concern. The design system token architecture supports future responsive adaptation without rework. |
| **Q4** | Insurance role in MVP | Phase 1 (declaration flow fields) | Phase 1 dev (data model) | **End of Phase 0, Week 2** | Default to **excluded from MVP** (already stated in PRD). Add a single optional "Numero de contrat assurance" field in the declaration form for forward compatibility. No insurance-specific screens. |
| **Q5** | Geographic scope (national, regional, city) | Phase 3 (landing page copy) | Not a dev blocker | **Phase 3 (Week 7)** | Default to **regional pilot** (Ile-de-France or client's home region). Affects only marketing copy and initial garage seeding, not app architecture. |
| **Q6** | Revenue model (commission, subscription, freemium) | Phase 2 (if pricing screens needed) | Phase 2 dev (if billing UI needed) | **End of Phase 1 (Week 5)** | Default to **no billing UI in MVP**. The prototype is for market validation, not revenue collection. Billing screens can be added in the development phase once the model is confirmed. This removes 2-5 screens from the design scope. |
| **Q7** | Client Emergent mockups not shared | Phase 0 (workshop baseline) | Not a direct dev blocker | **Before kickoff (Day 1)** | If not received by Day 3 of Phase 0, proceed without them. The design team starts from PRD requirements and design principles. Mockups can be incorporated as inspiration when they arrive, but they do not gate progress. |
| **Q8** | Kickoff date not set | Everything | Everything | **Immediately** | Cannot default. This is an administrative blocker. Escalate to PM. Propose a date and force a response. |

### 6.2 Decision Cascade Diagram

```
WEEK 0 (Pre-kickoff)
  |-- Q8 (Kickoff date) -- MUST resolve to start anything
  |-- Q7 (Emergent mockups) -- request immediately, proceed without if not received by Day 3
  |
WEEK 1 (Phase 0, Sprint 0.1)
  |-- Q2 (Attribution logic) -- MUST resolve before any UX wireframing
  |       Default if stalled: driver-selects model
  |
WEEK 2 (Phase 0, Sprint 0.2)
  |-- Q1 (Brand identity) -- MUST resolve before Phase 2 (UI)
  |       Default if stalled: placeholder brand, swap later
  |-- Q3 (Garage portal scope) -- MUST resolve before Phase 1 screen inventory
  |       Default if stalled: mobile-only
  |-- Q4 (Insurance in MVP) -- Confirm exclusion in writing
  |
WEEK 5 (Phase 1 end)
  |-- Q6 (Revenue model) -- decide to avoid adding billing screens in Phase 2
  |       Default if stalled: no billing UI in MVP
  |
WEEK 7 (Phase 3 start)
  |-- Q5 (Geographic scope) -- needed for landing page copy only
  |       Default if stalled: "France metropolitaine" (generic)
```

### 6.3 Escalation Protocol

If a blocker is not resolved by its deadline:

1. **Day of deadline:** PM sends formal written escalation to client with: blocker description, proposed default, timeline impact of delay, and a 48-hour response window.
2. **48 hours after deadline:** If no response, the team proceeds with the proposed default. The default decision is documented in writing and shared with the client. The team states: "We are proceeding with [default]. If you wish to change this, please respond by [date]. Changes after [phase] will impact timeline and budget."
3. **Post-phase-start change:** If the client reverses a default decision after work has begun, a formal change request is logged with effort impact. The PM quotes additional days and timeline shift before any rework begins.

---

## 7. Dev Handoff Spec

### 7.1 What a SwiftUI Developer Needs from the Design Phase

The design phase (Phase 0-4 per the PRD) produces Figma deliverables. For a SwiftUI implementation, the developer needs more than organized Figma files. Below is the complete handoff specification.

### 7.2 Token Values as Swift Code

The design system tokens defined in Figma must be exported as Swift-ready values, not just Figma variable names. This is the single most impactful handoff artifact.

**Required deliverable: A `CarlibTokens.swift` reference file** (or equivalent documentation) containing:

#### Colors (map to Asset Catalog color sets)

```
Format needed:
  Token name: color.primary
  Hex value: #3B82F6
  RGB: (59, 130, 246)
  Asset Catalog name: Primary
  SwiftUI reference: Color("Primary") or Color.carlibPrimary

Full list: all 30+ semantic color tokens from Section 3.2 of 05_design_system_analysis.md
```

#### Typography (map to SwiftUI Font definitions)

```
Format needed:
  Token name: type.h1
  Font family: [chosen font, e.g., Inter]
  Weight: Semibold (600)
  Size: 28px -> 28pt in SwiftUI
  Line height: 1.25 -> lineSpacing = (28 * 1.25) - 28 = 7pt
  Letter spacing: [if any]
  SwiftUI: .font(.custom("Inter-SemiBold", size: 28))

Note: If using system font (SF Pro), provide: .font(.title) with .fontWeight(.semibold)
Full list: all 13 typography tokens from Section 3.3 of 05_design_system_analysis.md
```

#### Spacing

```
Format needed:
  Token name: space.4
  Value: 16px -> 16pt in SwiftUI
  SwiftUI: .padding(CarlibSpacing.md) or .padding(16)

Full list: all 12 spacing tokens from Section 3.4
```

#### Border Radius

```
Format needed:
  Token name: radius.lg
  Value: 12px -> 12pt
  SwiftUI: .clipShape(RoundedRectangle(cornerRadius: 12))

Full list: all 7 radius tokens from Section 3.5
```

#### Shadows

```
Format needed:
  Token name: shadow.md
  X offset: 0
  Y offset: 2
  Blur: 8
  Color: black, opacity 0.08
  SwiftUI: .shadow(color: .black.opacity(0.08), radius: 4, x: 0, y: 2)

Full list: all 5 shadow tokens from Section 3.6
```

#### Animation Durations and Easing

```
Format needed:
  Token name: motion.duration.normal
  Value: 250ms -> 0.25s
  Easing: cubic-bezier(0.4, 0, 0.2, 1) -> SwiftUI Animation.easeInOut(duration: 0.25)

Full list: all 6 motion tokens from Section 3.8
```

**Delivery format:** A shared document (Notion, Google Docs, or markdown in the repo) with all values. Ideally, the design team provides a draft `CarlibTokens.swift` file that the developer can drop into the project. This eliminates transcription errors.

### 7.3 Component Specs with SwiftUI API References

For each of the 78 Must-build components (05_design_system_analysis.md Section 2), the developer needs:

| Spec Element | What It Contains | Example (StatusBadge) |
|---|---|---|
| **Visual spec** | Figma component with all variants visible | Filled, outlined, dot-only x sm/md x each status |
| **Anatomy diagram** | Labeled parts of the component | [dot 8px] [4px gap] [label text] |
| **Token mapping** | Which tokens apply to which part | Background: `color.status.{statusKey}`, Text: `type.label.sm`, Radius: `radius.full`, Padding: `space.1` horizontal, `space.0.5` vertical |
| **State table** | All states and their visual treatment | default, disabled (opacity 0.4) |
| **SwiftUI API hint** | Suggested SwiftUI primitives | `HStack` with `Circle` + `Text`. Use `@ViewBuilder` for variant switching. Conform to `View`. |
| **Interaction spec** | Tap, long-press, swipe behaviors | StatusBadge is non-interactive (read-only). |
| **Accessibility spec** | VoiceOver label pattern, trait | `.accessibilityLabel("Statut: \(statusLabel)")`, `.accessibilityAddTraits(.isStaticText)` |

**Priority components requiring detailed specs** (highest implementation complexity):

1. **ProgressStepper** (S02) -- Horizontal 4-step stepper with completed/current/upcoming/error states. SwiftUI hint: `HStack` with `ForEach`, `Capsule()` connectors, `Circle()` nodes with conditional overlay.
2. **StatusTimeline** (S03) -- Vertical timeline with pulse animation on current node. SwiftUI hint: `VStack` with custom `TimelineNode` view, `GeometryReader` for connector lines.
3. **CalendarGrid** (C01) -- Month/week view with selectable/blocked days. SwiftUI hint: `LazyVGrid(columns: Array(repeating: .init(.flexible()), count: 7))` with `DateComponents` math.
4. **DraggableBottomSheet** (N04) -- Peek/half/full draggable. SwiftUI hint: `.presentationDetents([.fraction(0.3), .medium, .large])` on `.sheet()`, or custom `GeometryReader` + `DragGesture` for map overlay use case.
5. **CameraOverlay** (P01) -- Guided frame over camera preview. SwiftUI hint: `UIViewControllerRepresentable` for `AVCaptureSession`, SwiftUI `ZStack` overlay for guide frame.
6. **GarageMapView** (M01) -- Map with custom annotations. SwiftUI hint: `Map(coordinateRegion:annotationItems:)` with custom `MapAnnotation` content views. Test clustering behavior.

### 7.4 Navigation Flow Diagrams

The developer needs a visual diagram showing every screen-to-screen transition, organized by role and tab. The interaction analysis (03_interaction_analysis.md Section 3) provides the textual flow. This must be exported as a visual diagram.

**Required diagrams:**

1. **App-level routing** -- Launch -> Auth check -> Role switch -> TabView
2. **Driver: Declaration flow** -- Step 1 -> Step 2 -> Step 3 -> Step 4 -> Summary -> Submit -> Success -> Garage Search
3. **Driver: Garage search -> Booking** -- Map/List -> Detail Sheet -> Calendar -> Confirmation
4. **Driver: Tracking** -- Status Dashboard -> Timeline -> Vehicle Ready
5. **Garage: Claims** -- Available List -> Detail -> Accept/Decline -> Active Dossiers
6. **Garage: Planning** -- Week View -> Day Detail -> Slot Editor
7. **Cross-role: Notification deep links** -- Push payload -> Screen resolution table

**Format:** Figma flow diagram, Mermaid syntax, or draw.io export. Must show NavigationStack push/pop vs. sheet presentation vs. tab switch for each transition.

### 7.5 Data Model Schema

The developer needs the data model before screens can be connected to real data. Based on the PRD and interaction analysis, the minimum schema:

**Required deliverable: Entity-Relationship diagram + field list**

| Entity | Key Fields | Relationships |
|---|---|---|
| **User** | id, role (driver/garage), email, phone, firstName, lastName, avatarURL, pushToken, createdAt | -> Vehicle (if driver), -> GarageProfile (if garage) |
| **Vehicle** | id, licensePlate, make, model, year, color, insuranceRef, photoURL, ownerId | -> User |
| **GarageProfile** | id, name, siret, address, latitude, longitude, phone, description, specialties[], photos[], serviceRadius, rating, isVerified | -> User |
| **Declaration** | id, accidentType, status, photos[], vehicleId, latitude, longitude, address, description, date, createdAt, updatedAt, driverId, garageId?, bookingId? | -> Vehicle, -> GarageProfile?, -> Booking?, -> StatusEvent[] |
| **Booking** | id, declarationId, garageId, date, startTime, endTime, status, createdAt, confirmedAt, cancelledAt | -> Declaration, -> GarageProfile |
| **TimeSlot** | id, garageId, date, startTime, endTime, slotStatus (available/booked/blocked) | -> GarageProfile, -> Booking? |
| **StatusEvent** | id, declarationId, fromStatus, toStatus, timestamp, actorId, actorRole, note | -> Declaration |
| **AppNotification** | id, userId, type, title, body, isRead, createdAt, deepLinkType, deepLinkId | -> User |

**Status enums (three flows, as defined in 05_design_system_analysis.md Section 5):**

- `ClaimStatus`: draft, submitted, pending, assigned, scheduled, in_repair, completed, cancelled, expired
- `BookingStatus`: proposed, confirmed, reminder_sent, vehicle_dropped, completed, cancelled, rescheduled
- `RepairStatus`: received, diagnostic, in_progress, quality_check, ready

### 7.6 API Contract

Even if the backend is not yet built, the developer needs an API contract to build the networking layer and mock data. This enables building production views against a contract that the backend team implements later.

**Required deliverable: OpenAPI / Swagger spec or equivalent endpoint table**

| Endpoint | Method | Request | Response | Used By |
|---|---|---|---|---|
| `/auth/register` | POST | `{ email, phone, password, role, firstName, lastName }` | `{ user, token }` | Registration |
| `/auth/login` | POST | `{ email, password }` | `{ user, token }` | Login |
| `/declarations` | POST | `{ accidentType, photos[], vehicleId, lat, lon, address, description }` | `{ declaration }` | Declaration submit |
| `/declarations/{id}` | GET | -- | `{ declaration, statusEvents[] }` | Tracking |
| `/declarations/{id}` | PATCH | `{ status }` (garage only) | `{ declaration }` | Status update |
| `/garages/search` | GET | `?lat=&lon=&radius=&specialty=&available=` | `{ garages[] }` | Garage search |
| `/garages/{id}` | GET | -- | `{ garage, timeSlots[] }` | Garage detail |
| `/garages/{id}/slots` | GET | `?from=&to=` | `{ timeSlots[] }` | Booking calendar |
| `/bookings` | POST | `{ declarationId, garageId, slotId }` | `{ booking }` | Booking creation |
| `/bookings/{id}` | PATCH | `{ status }` | `{ booking }` | Booking update |
| `/garages/me/claims` | GET | `?status=&radius=` | `{ declarations[] }` | Garage: available claims |
| `/garages/me/claims/{id}/accept` | POST | -- | `{ declaration }` | Garage: accept claim |
| `/garages/me/claims/{id}/decline` | POST | `{ reason? }` | `{ }` | Garage: decline claim |
| `/garages/me/slots` | GET/POST/PATCH/DELETE | Slot CRUD | `{ timeSlots[] }` | Garage: availability mgmt |
| `/garages/me/profile` | GET/PATCH | Profile fields | `{ garage }` | Garage: profile mgmt |
| `/notifications` | GET | `?page=&limit=` | `{ notifications[] }` | Notification center |
| `/notifications/{id}/read` | PATCH | -- | `{ }` | Mark as read |
| `/upload/photo` | POST | Multipart form (image data) | `{ url }` | Photo upload |

**For MVP development without a backend:** The developer builds a `MockAPIClient` conforming to the same protocol as the real `APIClient`, returning hardcoded JSON responses. This allows full UI development and testing. When the backend is ready, swap `MockAPIClient` for the real implementation.

### 7.7 Handoff Checklist Summary

| Deliverable | Format | Delivered By | Consumed By | Required Before |
|---|---|---|---|---|
| Figma file (organized, named) | Figma link | Design team | Developer | Phase 2 dev start |
| Token values document | Markdown/Notion with Swift-ready values | Design team | Developer | Phase 2 dev start |
| Component specs (78 Must components) | Figma component page with annotations | Design team | Developer | Phase 2 dev start (can deliver incrementally) |
| Navigation flow diagrams | Visual diagram (Figma/Mermaid) | UX designer | Developer | Phase 1 dev start |
| Data model schema | ER diagram + field table | PM + UX | Developer | Phase 0 dev start (draft), Phase 1 (final) |
| API contract | OpenAPI spec or endpoint table | PM (with tech input) | Developer | Phase 1 dev start (can mock) |
| French copy (all strings) | Spreadsheet or String Catalog | UX/Copywriter | Developer | Phase 2 dev mid-point |
| Accessibility requirements | Checklist with targets | Design team | Developer | Phase 0 (declared standard), Phase 2 (detailed specs) |
| Screen state inventory | Table: screen x state (empty/loaded/loading/error) | UX designer | Developer | Phase 1 end |

---

## Appendix A: SwiftUI Component-to-Design-System Mapping Quick Reference

| Design System Component (05 analysis) | SwiftUI Implementation Strategy |
|---|---|
| F01 Button | Custom `ButtonStyle` with `@Environment(\.isEnabled)` for state |
| F06 Surface/Card | `VStack` with `.background(...)`, `.clipShape(RoundedRectangle(...))`, `.shadow(...)` |
| F08 Skeleton Loader | Custom `ViewModifier` with `Redacted` + shimmer animation |
| I01 Text Input | Custom wrapper around `TextField` with validation state, helper text |
| I12 Photo Capture Input | `UIViewControllerRepresentable` for camera, `PHPickerViewController` for gallery |
| I13 Location Input | `Map` + `TextField` with `CLGeocoder` autocomplete |
| N01 Bottom Tab Bar | SwiftUI `TabView` with `tabItem` |
| N04 Bottom Sheet | `.sheet(isPresented:)` with `.presentationDetents()` OR custom `DragGesture` overlay |
| S02 Progress Stepper | Custom `HStack` with `ForEach` over steps |
| S03 Status Timeline | Custom `VStack` with vertical line + node circles |
| M01 Map View | `Map(coordinateRegion:annotationItems:)` |
| M02 Map Marker | `MapAnnotation` with custom content view |
| C01 Calendar Grid | `LazyVGrid(columns: 7)` with date math |
| P01 Camera Overlay | `ZStack`: `UIViewControllerRepresentable` camera + SwiftUI overlay |
| P04 Full-screen Image Viewer | `TabView(.page)` with pinch zoom via `MagnifyGesture` |

---

## Appendix B: File Count Estimate

| Category | Estimated Swift Files |
|---|---|
| App (entry, state, router) | 4 |
| Core (Auth, Onboarding, Navigation) | 12 |
| Features (Declaration, GarageSearch, Booking, Tracking, GaragePortal, Landing, Notifications, Profile, Shared) | 65 |
| Design System (Tokens, Components, Modifiers) | 45 |
| Services (Networking, Persistence, Location, Camera, Notifications, Haptics) | 15 |
| Utilities (Extensions, Helpers, Protocols) | 12 |
| Resources (Assets, Strings, Plists) | 4 (non-Swift) |
| Tests | 25 |
| **Total** | **~182 Swift files** |

This is a medium-sized iOS project. It is manageable for a solo developer but benefits significantly from a second developer to parallelize the driver and garage feature modules.

---

**End of Analysis**

*This document should be reviewed alongside:*
- `docs/analysis/03_interaction_analysis.md` (state inventory, transitions, gestures)
- `docs/analysis/04_ui_analysis.md` (screen inventory, layout patterns)
- `docs/analysis/05_design_system_analysis.md` (component inventory, token architecture)
- `docs/analysis/07_ops_delivery_analysis.md` (design phase delivery, risk register)
- `docs/PRD_Carlib_v0.1_4.pdf` (source PRD)
