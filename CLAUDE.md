# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product

Carlib is an iOS marketplace app for automobile accident claim declaration in France, connecting drivers with body shops (carrossiers). Two-sided platform:
- **Drivers:** Declare accidents, find nearby garages, book drop-off slots, track repairs
- **Body shops:** Consult claims, accept cases, manage planning, update repair status

Note: Despite the French market, the in-app copy is currently **English** (was originally planned as French-only). Some French assets remain (Info.plist permission strings, PRD docs).

## Tech Stack

- **Platform:** iOS 26+, iPhone Portrait only
- **Framework:** SwiftUI + `@Observable` (Swift 6)
- **Project generator:** XcodeGen (`project.yml` is the source of truth — regenerate with `xcodegen generate`)
- **Dependencies:** Zero external packages
- **Persistence:** Keychain (auth/user), UserDefaults (theme, welcome flag), in-memory mock store (`ClaimStore`) for claims/bookings/vehicles
- **Fonts:** Aeonik (CoType Foundry) + Remixicon icon font in `Carlib/Resources/Fonts/`

## Build & Run

```bash
# Regenerate Xcode project after editing project.yml (adding files, resources, Info.plist keys)
xcodegen generate

# Build for simulator
xcodebuild -project Carlib.xcodeproj -scheme Carlib -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build

# Build for device (requires signing team configured in Xcode GUI)
xcodebuild -project Carlib.xcodeproj -scheme Carlib -destination 'generic/platform=iOS' build

# Open in Xcode
open Carlib.xcodeproj
```

**If `xcodebuild` fails with "tool 'xcodebuild' requires Xcode…":** the active developer dir points to CommandLineTools. Prefix the command with `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer` (e.g. `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcodebuild … build`) or run `sudo xcode-select -s /Applications/Xcode.app` once.

**Important:** XcodeGen regenerates `Info.plist` from `project.yml` — do NOT edit `Info.plist` directly. Add Info.plist keys under `targets.Carlib.info.properties` in `project.yml` instead (e.g., `UIAppFonts`, usage descriptions).

**No test target exists.** The scheme builds the app only; don't waste time hunting for `swift test` / `xcodebuild test` recipes.

## Architecture

### App flow
`CarlibApp` → `RootView` routes based on `AppState.authStatus`:
- `.unknown` → `SplashView` (checks Keychain session)
- `.unauthenticated` / `.sessionExpired` → `WelcomeCarouselView` (Revolut-style stories + auth sheets)
- `.authenticated` + no role → `RoleSelectionView`
- `.authenticated` + `userRole == .driver` → `DriverTabView` (Home, Claims, Profile)
- `.authenticated` + `userRole == .garage` → `GarageTabView` (Dashboard, Claims, Schedule, Profile)

### State management
Two `@Observable` classes injected via `.environment(...)` at the root:
- **`AppState`** ([Carlib/App/AppState.swift](Carlib/App/AppState.swift)) — auth status, current user, navigation intents (`pendingDriverTab`/`pendingGarageTab` for cross-flow tab switching)
- **`ClaimStore`** ([Carlib/Services/ClaimStore.swift](Carlib/Services/ClaimStore.swift)) — mutable in-memory store seeded from `MockData`. Holds claims, vehicles, bookings, time slots. All CRUD is synchronous and in-memory — no backend.

Access in views via `@Environment(AppState.self)` / `@Environment(ClaimStore.self)`.

### Services
- **`AuthService`** — Sign in with Apple + mock email/password. Persists session via `KeychainManager`.
- **`KeychainManager`** — Thin wrapper for storing user + token in Keychain.
- **`MockData`** — Seed data for vehicles, claims, garages, time slots.

### Models
Domain models in `Carlib/Models/`. Three interconnected status systems drive most UI state:
- **`ClaimStatus`** (9 states): draft → submitted → matched → accepted → inProgress → repairing → completed (+ cancelled, expired)
- **`BookingStatus`** (7 states): pending, confirmed, arrivedAtGarage, vehicleDroppedOff, rescheduled, cancelledByDriver, cancelledByGarage
- **`RepairStatus`** (5 states): diagnostic, waitingParts, repairing, qualityCheck, readyForPickup

Each status has a `localizedName` (via `L10n`) and maps to colors in `CarlibStatusBadge`.

### View organization
```
Carlib/Views/
  Onboarding/   # Splash, WelcomeCarousel, RoleSelection, OnboardingView
  Auth/         # Gateway, SignIn, SignUp, ForgotPassword
  Driver/       # DriverTabView + Home, Claims, Profile, Declaration, Booking, Garage*, Vehicle*, MyGarage
  Garage/       # GarageTabView + Dashboard, Claims, Planning, Profile
  Shared/       # Reusable cards (ClaimCard, GarageCard), StatusTimeline, NotificationSettings
  Landing/      # (reserved for B2B landing — currently unused)
```

## Design System

Located in `Carlib/DesignSystem/`. Revolut-inspired, **light-mode default** with adaptive dark mode support (dark theme toggle currently disabled).

### Tokens
- **`CarlibColors`** — All colors use `adaptive(light:dark:)` helper for light/dark mode support. Raw RGB is avoided in views; use token names like `.carlibDark`, `.carlibSecondary`, `.carlibScreenBg`, `.tileSecondary`, `.brandYellow`.
- **`CarlibTypography`** (`CarlibFont`) — Aeonik-based scale. **All titles default to `.medium` weight** per current design direction. Scale: `largeTitle` (28), `title1` (26), `title2` (22), `title3` (17), `body` (15), `callout` (14), `footnote` (13), `caption` (11). Legacy aliases (`display`, `heading*`, `bodyLarge`, etc.) remain and map to the new scale.
- **`CarlibSpacing`** — 4pt base. `minTouchTarget = 48` (post-accident stress context).
- **`CarlibRadius`** — `xs`(4) through `xl`(24) + `full`.

### Components
Custom components in `DesignSystem/Components/`:
- `CarlibButton` — 4 variants (primary/secondary/ghost/destructive), **pill-shaped** (`Capsule()`), 52pt height, adapts for light/dark (primary flips: white-on-black in light, black-on-white in dark)
- `CarlibTextField` / `CarlibSecureField` — **Fixed 52pt height**, filled background (`tileSecondary`), **no stroke borders**
- `CarlibCard`, `CarlibStatusBadge`, `CarlibSectionHeader`, `PolestarTile`
- `CarBrandLogo` — Maps vehicle brand names (Peugeot, Renault, BMW, Tesla, etc.) to logo images from asset catalog. Falls back to `RemixIcon.carLine`. Usage: `CarBrandLogo(brand: "Peugeot", size: 48)`.
- `DummyImage` — Network-loaded placeholder images for prototyping (garage photos via picsum.photos, person avatars via pravatar.cc). Usage: `DummyImage(kind: .garage, seed: garage.id.uuidString)`.

### Button Style
`PressableButtonStyle` in `CarlibButtonStyle.swift` — scale-down + haptic feedback on press. Used everywhere via `.buttonStyle(.pressable())` or `.buttonStyle(.pressable(scale: 0.97, haptic: .light))`.

Design philosophy: **Custom** buttons/cards/badges/text fields. **Native iOS** for sheets, popovers, alerts, pickers, navigation.

### Icons
- **`RemixIcon`** — Auto-generated enum with 3,229 Remixicon glyphs. Font loaded via `remixicon.ttf`. Usage: `RemixIcon.homeLine.view(size: 24, color: .orange)`.
- **`CarlibIcon`** (in `LucideIcon.swift`) — Legacy SF Symbols name constants still used by some views.
- Note: Swift files shouldn't be regenerated casually — `RemixIcon.swift` is generated from `remixicon.glyph.json`.

## Localization

- All user-facing strings live in **`Carlib/Resources/Strings.swift`** as nested `L10n.*` enums. Never hardcode strings in views — use `L10n.Auth.signIn`, `L10n.DriverHome.greeting("Name")`, etc.
- There's also `Localizable.xcstrings` (String Catalog) but most copy currently flows through the `L10n` enum.
- Development language is set to `fr` in `project.yml` but UI copy is English. Info.plist permission strings remain in French.

### Extensions
- **`DateFormatting`** (`Carlib/Extensions/`) — `Date.shortFormatted` ("Mon, Apr 7"), `.longFormatted`, `.timeFormatted`, `.relativeFormatted` ("2 days ago"). All hardcoded to `en_US` locale. Also provides `Date.daysFromNow(_:)` / `.hoursFromNow(_:)` for test data.

## Conventions & gotchas

- **Use design tokens, not raw values.** No hardcoded colors, no `.system()` fonts in views (use `CarlibFont.*`).
- **Weight consistency:** Titles and emphasis text default to `.medium`. Avoid `.bold` / `.semibold` overrides unless intentional (e.g., CTA buttons use `.medium`, hero numbers can use `.bold`).
- **Adaptive colors:** When adding new colors, use the `adaptive(light:dark:)` helper in `CarlibColors.swift`. Hardcoded `.white` / `.black` in views breaks light mode — use `.carlibDark` for text on surfaces.
- **Text on colored backgrounds** (e.g., yellow CTA) should use explicit `.black` / `.white` since they don't adapt.
- **Editing `project.yml`** requires running `xcodegen generate` and reopening Xcode. Resources under `Carlib/Resources/Fonts` are picked up automatically.
- **SwiftUI environment objects:** Any view that uses `ClaimStore` must provide it in `#Preview` — missing environment crashes previews.
- **`@Observable` pattern:** Use `@Environment(ClaimStore.self) private var claimStore`, not `@ObservedObject`. Classes are marked `@Observable`, not `ObservableObject`.
- **Tab-switching from within a tab:** Use `appState.pendingGarageTab = .claims` / `appState.pendingDriverTab = .home`. The `GarageTabView` / `DriverTabView` observes these and flips the native `TabView` selection. Inside a tab use `path.append(...)` to push onto the tab's own nav stack instead.
- **No rating / review system.** It was removed because it's absent from the PRD; `Garage.rating` / `reviewCount` no longer exist. Do not reintroduce stars, review counts, or a "Reputation" section without confirming with the product owner — design-quality review explicitly flagged this feature as out of scope.

## Figma / design source

The product design lives in a Figma file that the Claude Figma MCP server edits. Key references:

- **File:** `Carlib — App Design` — `fileKey` `71sAiKhZ2mWg1I7NSzORg3`
- **Icon library:** `HT icon lib (Copy)` — a **remote team library** subscribed to the file. Discover icons via `search_design_system` with `includeLibraryKeys: ["lk-1cc70db821d4c22449c51299d022329fc13768343adeda4016d85a2fb010b94860ca4f96523c3ef6ad20af979ce0f5d032399958bb00692bb6f960ca5f3292dd"]`. Naming mirrors Remixicon (`home-4-line`, `notification-line`, `moon-line`, etc.).
- **Other libraries subscribed:** Apple's `iOS and iPadOS 26` UI kit — prefer real Apple components (Status bar - iPhone, Toolbar - Top - Sheet, Toggle - Switch, Tab Bar - iPhone) for iOS chrome instead of drawing primitives.
- **Frame naming convention:** `NN — Role · Screen` (e.g., `24 — Declaration · Confirmation`, `33 — Garage · Dashboard`). Keep the numbering stable so the Driver flow reads top-to-bottom in Section 1.

## Marketing website (`web/`)

Separate Next.js 16 marketing site for Carlib. Its own toolchain, lives under `web/` and has a nested `CLAUDE.md` → `AGENTS.md` warning that **Next.js 16 has breaking changes**; read `node_modules/next/dist/docs/` before guessing APIs.

- **Stack:** Next.js 16.2 (Turbopack), React 19.2, Tailwind v4 (`@tailwindcss/postcss`), TypeScript 5
- **Scripts (run from `web/`):** `npm run dev` (port 3000 by default — note a long-running dev server is often already up; check `lsof -i :3000` before starting a second one), `npm run build`, `npm run start`, `npm run lint`
- **Structure:** `src/app/` (App Router: `page.tsx` is the marketing home, `layout.tsx` wires fonts), `src/components/` (`PerspectiveHero.tsx` is the hero with Driver/Shop toggle + scroll-linked iOS notification cards; `FeatureBento.tsx`, `primitives.tsx` for shared `Card`/`Kicker`/`PillButton`/`SectionHeader`), `src/lib/`
- **Design parity:** The web components must imitate the real iOS app (tile rows, typography scale, brand yellow accents). Reference `Carlib/Views/Driver/DriverProfileView.swift` and `Carlib/DesignSystem/` when styling — tile rows are `rounded-[14px]` with ~44pt icon discs in `brand-yellow-soft`, 15pt medium title, 13pt secondary subtitle.
- **Client components:** Anything using `useEffect`/`useState`/scroll needs `"use client"` at top of the file. `PerspectiveHero` is a client component; the page shell is server.

## Docs

- `docs/PRD_Carlib_v0.1_4.pdf` — Original Digital Unicorn PRD (March 2026)
- `docs/analysis/` — 8 specialist analysis files (research, strategy, interaction, UI, design system, PRD review, ops, design copilot)

## Claude Code plugin setup

This repo also ships with a design-oriented Claude Code template — 123 skills, 27 commands, 8 agents. See `README.md` and `setup.sh`. Skills auto-load from `.claude/skills/`; `setup.sh` installs marketplace plugins (optional; skills work without it). MCP servers: Puppeteer + Chrome DevTools (`.mcp.json`).
