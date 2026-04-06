# Carlib — Gap Analysis: App vs PRD

**Date:** April 2026  
**Method:** Compared 43 Swift source files against PRD v0.1 user stories (US01–US10) and design analysis docs.

---

## Summary

| Category | Required | Built | Missing | Coverage |
|----------|----------|-------|---------|----------|
| Driver screens | 19 | 10 | 9 | 53% |
| Garage screens | 13 | 6 | 7 | 46% |
| Shared screens | 3 | 1 | 2 | 33% |
| End-to-end flows | 9 | 0 complete | 9 | 0% |
| User stories | 10 | 3 partial | 7 | ~15% |

---

## MISSING PAGES

### Driver Side — 9 missing screens

| # | Screen | PRD Ref | Priority | Notes |
|---|--------|---------|----------|-------|
| 1 | **Booking Flow** (slot selection + confirmation) | US03 | MUST | GarageDetailView has "Book" button but no booking sheet, no slot picker, no confirmation |
| 2 | **Garage Map View** (real MapKit) | US02 | MUST | GarageSearchView has placeholder gray box instead of Map |
| 3 | **Photo Capture** (guided camera overlay) | US01 | MUST | DeclarationFlowView step 2 has empty photo slots, no camera/PhotosPicker integration |
| 4 | **Location Picker** (map for accident location) | US01 | MUST | Step 4 of declaration should have map-based location, currently missing entirely |
| 5 | **Auth / Sign-in Screen** | — | MUST | No authentication — onboarding goes straight to role selection with no login |
| 6 | **Vehicle Management** (add/edit vehicles) | US03 | SHOULD | Profile shows one hardcoded vehicle, no add/edit capability |
| 7 | **Notification Preferences** | US04 | SHOULD | Profile links to "Preferences" but no actual screen |
| 8 | **Permission Request Screens** (camera, location, notifications) | — | MUST | No permission flows — app will crash when accessing camera/location |
| 9 | **Onboarding Carousel** (feature walkthrough) | — | SHOULD | Current onboarding is just role selection, no feature explanation |

### Garage Side — 7 missing screens

| # | Screen | PRD Ref | Priority | Notes |
|---|--------|---------|----------|-------|
| 10 | **Garage Onboarding / Registration** (SIRET, business info) | US08 | MUST | No signup flow — garage users go straight to dashboard |
| 11 | **Profile Edit Mode** (edit name, address, photos, specialties) | US08 | MUST | GarageProfileView is read-only, no editing |
| 12 | **Availability Management** (set weekly hours, block dates) | US06 | MUST | GaragePlanningView shows slots but can't actually create/save them |
| 13 | **Claim Accept/Decline Confirmation** | US05 | MUST | Dialogs exist but actions are empty `{}` |
| 14 | **Status Update Flow** (repair progression) | US07 | MUST | Dialog exists but action is empty `{}` |
| 15 | **Coverage Zone Map** (set intervention radius on map) | US08 | SHOULD | Profile shows radius as number, no map picker |
| 16 | **Garage Photo Upload** (atelier photos) | US08 | SHOULD | Placeholder photo grid, no PhotosPicker |

### Shared — 2 missing screens

| # | Screen | PRD Ref | Priority | Notes |
|---|--------|---------|----------|-------|
| 17 | **Landing Page** (garage recruitment) | US10 | MUST | Not built at all — PRD requires hero, how-it-works, benefits, signup form |
| 18 | **Settings / Legal** (terms, privacy policy content) | — | SHOULD | Profile links exist but lead nowhere |

---

## MISSING FLOWS (end-to-end)

### Flow 1: Declaration → Garage Selection → Booking (US01 + US02 + US03)
**Status: BROKEN** — Declaration submits but doesn't navigate to garage selection. Garage search exists but isn't reachable from declaration. Booking doesn't exist.

| Step | Exists? | Functional? |
|------|---------|-------------|
| Home → tap "Report Damage" | Yes (tile) | No (`// TODO`) |
| Declaration step 1 (type) | Yes | Yes |
| Declaration step 2 (photos) | Yes (UI) | No (no camera) |
| Declaration step 3 (vehicle) | Yes | Yes |
| Declaration step 4 (location) | **Missing** | — |
| Declaration recap | Yes | Yes (hardcoded ref#) |
| Confirmation → garage search | **Missing** | — |
| Garage list/map | Yes (list only) | Partial (no map) |
| Garage detail | Yes | Yes (display only) |
| Booking slot selection | **Missing** | — |
| Booking confirmation | **Missing** | — |
| Return to home with active claim | **Missing** | — |

### Flow 2: Real-Time Repair Tracking (US04)
**Status: DISPLAY ONLY** — Timeline renders from mock data, no push notifications, no real-time updates.

| Step | Exists? | Functional? |
|------|---------|-------------|
| View active claim from home | Yes | No (`// TODO` on tile) |
| Claims list → claim detail | Yes | Yes |
| Status timeline | Yes | Display only |
| Push notifications on status change | **Missing** | — |
| Live Activities on lock screen | **Missing** | — |
| Contact garage (phone call) | Yes (button) | No (empty `{}`) |

### Flow 3: Garage Accepts Claim (US05 + US09)
**Status: UI EXISTS, NO LOGIC** — Accept/refuse buttons show confirmation dialogs but actions are empty.

| Step | Exists? | Functional? |
|------|---------|-------------|
| Dashboard → new claim alert | Yes (display) | No real alerts |
| Claims list (available) | Yes | Yes (mock data) |
| Claim detail with photos | Yes | Yes (display) |
| Accept button + dialog | Yes | No (empty `{}`) |
| Auto-notification to driver | **Missing** | — |
| Claim moves to "In Progress" | **Missing** | — |

### Flow 4: Garage Manages Planning (US06)
**Status: READ ONLY** — Calendar shows slots, add sheet exists but doesn't save.

| Step | Exists? | Functional? |
|------|---------|-------------|
| Calendar view | Yes | Yes (display) |
| View slots per day | Yes | Yes (mock data) |
| Add slot sheet | Yes | No (save is `{}`) |
| Block/unblock dates | **Missing** | — |
| Sync with bookings | **Missing** | — |

### Flow 5: Garage Updates Repair Status (US07)
**Status: UI EXISTS, NO LOGIC**

| Step | Exists? | Functional? |
|------|---------|-------------|
| Active claim detail | Yes | Yes (display) |
| Status update button | Yes | No (empty `{}`) |
| Status picker dialog | Yes | No (empty `{}`) |
| Auto-notification to driver | **Missing** | — |

### Flow 6: Garage Profile Setup (US08)
**Status: READ ONLY** — Shows profile but no editing.

### Flow 7: Auto Claim Transmission (US09)
**Status: NOT IMPLEMENTED** — No backend, no transmission logic.

### Flow 8: Landing Page (US10)
**Status: NOT BUILT** — Empty `Landing/` folder exists in project.

### Flow 9: Authentication
**Status: NOT BUILT** — App goes straight from role selection to main tabs.

---

## NAVIGATION GAPS

| From → To | Status |
|-----------|--------|
| Home tile "Report Damage" → DeclarationFlowView | **Broken** (`// TODO`) |
| Home tile "Active Claim" → DriverClaimDetailView | **Broken** (`// TODO`) |
| Home tile "Find Garage" → GarageSearchView | **Broken** (`// TODO`) |
| Home tile "My Vehicle" → Vehicle detail | **Broken** (`// TODO`) |
| Declaration confirmation → Garage Search | **Missing** |
| Declaration confirmation → Claims list | **Missing** (only dismisses) |
| GarageDetailView "Book" → Booking flow | **Missing** |
| DriverClaimDetailView "Contact" → Phone call | **Broken** (empty `{}`) |
| GarageClaimDetailView "Accept" → Claim state change | **Broken** (empty `{}`) |
| GarageClaimDetailView "Update Status" → Status change | **Broken** (empty `{}`) |
| GaragePlanningView "Save" → Slot creation | **Broken** (empty `{}`) |
| GarageDashboard "See All" → Claims list | **Broken** (empty `{}`) |

---

## PRIORITY ORDER FOR IMPLEMENTATION

### Phase 1: Wire the navigation (make flows navigable end-to-end)
1. Connect Home tiles to actual destinations (DriverHomeView)
2. Connect declaration confirmation to garage search
3. Build booking flow (slot picker sheet + confirmation)
4. Connect "See All" / "Contact" / "Accept" actions

### Phase 2: Build missing MUST screens
5. Photo capture (Camera/PhotosPicker in declaration step 2)
6. Location picker (MapKit in declaration step 4)
7. Garage map view (real MapKit in GarageSearchView)
8. Authentication flow (Sign in with Apple)
9. Garage profile edit mode
10. Landing page

### Phase 3: Backend integration
11. Claim submission → persist with SwiftData
12. Accept/decline → state mutation
13. Status update → state mutation + notification
14. Slot creation → persist
15. Push notification setup

### Phase 4: Polish
16. Permission request screens
17. Onboarding carousel
18. Vehicle management (add/edit)
19. Notification preferences
20. Settings / legal content
