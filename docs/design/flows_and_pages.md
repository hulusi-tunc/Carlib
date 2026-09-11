# Carlib — Flows & Pages

Single source of truth for the screen inventory and user flows. Every Figma frame and every SwiftUI view should match a row in the tables below.

**Scope:** MVP (v0.1). Scale: ~50 unique screens across Shared (10), Driver (22), Garage (17), and Landing (1).

**Figma file:** [Carlib — App Design](https://www.figma.com/design/71sAiKhZ2mWg1I7NSzORg3/Carlib-%E2%80%94-App-Design)

---

## 1. Page inventory

### 1.1 Shared / global (S)

| ID | Screen | SwiftUI view | Notes |
|---|---|---|---|
| S-01 | Splash | [SplashView.swift](../../archive/swift/Carlib/Views/Onboarding/SplashView.swift) | App launch, logo animation |
| S-02 | Welcome carousel | [WelcomeCarouselView.swift](../../archive/swift/Carlib/Views/Onboarding/WelcomeCarouselView.swift) | 3–4 value slides |
| S-03 | Role selection | [RoleSelectionView.swift](../../archive/swift/Carlib/Views/Onboarding/RoleSelectionView.swift) | Driver / Garage split |
| S-04 | Onboarding wrapper | [OnboardingView.swift](../../archive/swift/Carlib/Views/Onboarding/OnboardingView.swift) | Container |
| S-05 | Auth gateway | [AuthGatewayView.swift](../../archive/swift/Carlib/Views/Auth/AuthGatewayView.swift) | Sign in / sign up CTA |
| S-06 | Sign in | [SignInView.swift](../../archive/swift/Carlib/Views/Auth/SignInView.swift) | Email + password |
| S-07 | Sign up | [SignUpView.swift](../../archive/swift/Carlib/Views/Auth/SignUpView.swift) | Role-specific fields |
| S-08 | Forgot password | [ForgotPasswordView.swift](../../archive/swift/Carlib/Views/Auth/ForgotPasswordView.swift) | Email reset |
| S-09 | Notifications settings | [NotificationSettingsView.swift](../../archive/swift/Carlib/Views/Shared/NotificationSettingsView.swift) | Push toggles |
| S-10 | Error / offline | — | Global error & empty states |

### 1.2 Driver app (D)

| ID | Screen | SwiftUI view | Flow |
|---|---|---|---|
| D-01 | Driver tab bar | [DriverTabView.swift](../../archive/swift/Carlib/Views/Driver/DriverTabView.swift) | Shell |
| D-02 | Home / dashboard | [DriverHomeView.swift](../../archive/swift/Carlib/Views/Driver/DriverHomeView.swift) | Active claim + quick actions |
| D-03 | Declaration — type | [DeclarationFlowView.swift](../../archive/swift/Carlib/Views/Driver/DeclarationFlowView.swift) | Step 1 of 4 |
| D-04 | Declaration — photos | DeclarationFlowView | Step 2 of 4 |
| D-05 | Declaration — vehicle | DeclarationFlowView | Step 3 of 4 |
| D-06 | Declaration — location | DeclarationFlowView | Step 4 of 4 |
| D-07 | Declaration — review | DeclarationFlowView | Summary |
| D-08 | Declaration confirmation | [DeclarationConfirmationView.swift](../../archive/swift/Carlib/Views/Driver/DeclarationConfirmationView.swift) | Success state |
| D-09 | Claims list | [DriverClaimsListView.swift](../../archive/swift/Carlib/Views/Driver/DriverClaimsListView.swift) | Active + past |
| D-10 | Claim detail | [DriverClaimDetailView.swift](../../archive/swift/Carlib/Views/Driver/DriverClaimDetailView.swift) | Status + actions |
| D-11 | Garage search — list | [GarageSearchView.swift](../../archive/swift/Carlib/Views/Driver/GarageSearchView.swift) | Sortable list |
| D-12 | Garage search — map | GarageSearchView | Map view toggle |
| D-13 | Garage filters | GarageSearchView | Distance, type, specialties |
| D-14 | Garage detail | [GarageDetailView.swift](../../archive/swift/Carlib/Views/Driver/GarageDetailView.swift) | Profile, photos, slots |
| D-15 | Booking flow — calendar | [BookingFlowView.swift](../../archive/swift/Carlib/Views/Driver/BookingFlowView.swift) | Pick date |
| D-16 | Booking flow — slot | BookingFlowView | Pick time |
| D-17 | Booking confirmation | BookingFlowView | Success + dossier # |
| D-18 | My garage | [MyGarageView.swift](../../archive/swift/Carlib/Views/Driver/MyGarageView.swift) | Assigned garage info |
| D-19 | Vehicle detail | [VehicleDetailView.swift](../../archive/swift/Carlib/Views/Driver/VehicleDetailView.swift) | My vehicle |
| D-20 | Profile | [DriverProfileView.swift](../../archive/swift/Carlib/Views/Driver/DriverProfileView.swift) | Account, settings |
| D-21 | Status timeline | [StatusTimelineView.swift](../../archive/swift/Carlib/Views/Shared/StatusTimelineView.swift) | Shared with Garage |
| D-22 | Push notification detail | — | Deep link target |

### 1.3 Garage portal (G)

| ID | Screen | SwiftUI view | Flow |
|---|---|---|---|
| G-01 | Garage tab bar | [GarageTabView.swift](../../archive/swift/Carlib/Views/Garage/GarageTabView.swift) | Shell |
| G-02 | Dashboard | [GarageDashboardView.swift](../../archive/swift/Carlib/Views/Garage/GarageDashboardView.swift) | Pending + today |
| G-03 | Claims list | [GarageClaimsListView.swift](../../archive/swift/Carlib/Views/Garage/GarageClaimsListView.swift) | Incoming + active |
| G-04 | Claim detail | [GarageClaimDetailView.swift](../../archive/swift/Carlib/Views/Garage/GarageClaimDetailView.swift) | Accept/refuse + status |
| G-05 | Accept modal | GarageClaimDetailView | Confirmation |
| G-06 | Status update sheet | GarageClaimDetailView | Change repair stage |
| G-07 | Planning — week | [GaragePlanningView.swift](../../archive/swift/Carlib/Views/Garage/GaragePlanningView.swift) | Week calendar |
| G-08 | Planning — day | GaragePlanningView | Day detail |
| G-09 | Availability editor | GaragePlanningView | Add/block slots |
| G-10 | Profile view | [GarageProfileView.swift](../../archive/swift/Carlib/Views/Garage/GarageProfileView.swift) | Public preview |
| G-11 | Profile edit | [GarageProfileEditView.swift](../../archive/swift/Carlib/Views/Garage/GarageProfileEditView.swift) | Form |
| G-12 | Photos management | GarageProfileEditView | Upload grid |
| G-13 | Zone de couverture | GarageProfileEditView | Map radius |
| G-14 | Claim history | GarageClaimsListView | Archived |
| G-15 | Stats | GarageDashboardView | Simple KPIs |
| G-16 | Driver messaging | — | MVP or V2 |
| G-17 | Empty states | — | Variants of dashboard, planning, claims |

### 1.4 Landing (L)

| ID | Screen | Notes |
|---|---|---|
| L-01 | B2B landing page | Desktop-first, garage recruitment tool |

### 1.5 Shared UI components (non-page)

| ID | Component | File |
|---|---|---|
| C-01 | ClaimCardView | [ClaimCardView.swift](../../archive/swift/Carlib/Views/Shared/ClaimCardView.swift) |
| C-02 | GarageCardView | [GarageCardView.swift](../../archive/swift/Carlib/Views/Shared/GarageCardView.swift) |
| C-03 | StatusTimelineView | [StatusTimelineView.swift](../../archive/swift/Carlib/Views/Shared/StatusTimelineView.swift) |

---

## 2. Flows

### 2.1 Cold start → authenticated (shared)

```
S-01 Splash
  → S-02 Welcome carousel
    → S-03 Role selection
      → S-05 Auth gateway
        → S-06 Sign in      ─┐
        → S-07 Sign up      ─┼→ D-01 / G-01 (role-based shell)
        → S-08 Forgot pwd   ─┘
```

### 2.2 Driver — declare a claim (critical path)

```
D-02 Home
  → D-03 Declaration type
    → D-04 Photos (camera overlay, multi-angle)
      → D-05 Vehicle info (make, model, plate, insurance)
        → D-06 Location & description (map pin, date/time)
          → D-07 Review summary
            → D-08 Confirmation
              → D-10 Claim detail (status: submitted)
```

### 2.3 Driver — find & book a garage

```
D-02 Home ──┐
D-10 Claim ─┴→ D-11 Garage search (list)
                ⇅ D-12 Map view
                ↓ D-13 Filters
              → D-14 Garage detail
                → D-15 Calendar
                  → D-16 Slot picker
                    → D-17 Booking confirmation
                      → D-10 Claim detail (status: matched → accepted)
```

### 2.4 Driver — track repair

```
Push notification → D-22 → D-10 Claim detail
                              ↓
                            D-21 Status timeline (submitted → matched → accepted → in-progress → repairing → completed)
```

### 2.5 Garage — accept incoming claim (critical path)

```
Push notification → G-01 shell
  → G-02 Dashboard (new claim badge)
    → G-03 Claims list (incoming)
      → G-04 Claim detail (pre-acceptance: photos, vehicle, location)
        → G-05 Accept modal
          → G-04 Claim detail (active)
            → G-06 Status update sheet
              (repeat: diagnostic → waiting parts → repairing → quality check → ready for pickup)
```

### 2.6 Garage — manage planning

```
G-01 shell
  → G-07 Week view
    ⇅ G-08 Day detail
    → G-09 Availability editor (add/block/recurring)
```

### 2.7 Garage — manage profile

```
G-01 shell
  → G-10 Profile view (read-only preview)
    → G-11 Profile edit
      → G-12 Photos management
      → G-13 Zone de couverture
```

### 2.8 Landing page funnel (B2B)

```
L-01 Hero
  → Problem → Solution → How it works → Benefits → Sign-up form → Success
```

---

## 3. State coverage per screen

Every page needs these state variants in Figma (and empty-state handling in SwiftUI):

| State | When |
|---|---|
| **Default** | Populated, happy path |
| **Empty** | No data yet (e.g. no claims, no bookings) |
| **Loading** | Skeleton or spinner |
| **Error** | Network / server error |
| **Offline** | No connectivity |

**Deliverable count:** ~50 screens × 2–3 states avg ≈ **100–130 Figma frames**.

---

## 4. Status systems

Three interconnected status machines power the claim/booking/repair UX. All nine states map to the `StatusBadge` component in Figma.

| System | States | Component token |
|---|---|---|
| **Claim** | draft → submitted → matched → accepted → in-progress → completed / cancelled / expired | `status/*` |
| **Booking** | pending → confirmed → arrived → dropped off → (rescheduled / cancelled) | reuses claim colors |
| **Repair** | diagnostic → waiting parts → repairing → quality check → ready for pickup | reuses claim colors |

See [CarlibStatusBadge.swift](../../archive/swift/Carlib/DesignSystem/Components/CarlibStatusBadge.swift) for the canonical color mapping.

---

## 5. Unresolved blockers

These decisions still fork the UX and should be closed before further screen work:

1. **Attribution model** — auto-assign (first garage accepts) vs. driver selects. Affects D-11→D-14 flow.
2. **Messaging scope** — in-app chat (G-16) vs. deep link to phone/email in MVP.
3. **Multi-vehicle support** — D-19 MVP shows single vehicle; multi-vehicle is V2.
