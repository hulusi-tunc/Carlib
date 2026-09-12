# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product

Carlib is a marketplace app for automobile accident claim declaration in France, connecting drivers with body shops (carrossiers). Two-sided platform:
- **Drivers:** Declare accidents, find nearby garages, book drop-off slots, track repairs
- **Body shops:** Consult claims, accept cases, manage planning, update repair status

The product is the React Native app in **`mobile/`** (iOS + Android). The original SwiftUI app it was ported from is archived under `archive/swift/` — a design reference, not something to build on (see the appendix at the end). `web/` is the marketing site.

In-app copy is **bilingual EN + FR** (`mobile/src/i18n/{en,fr}.json`, ~400 keys, i18next); the language picker is in Settings. The PRD and the native permission strings are French.

## Tech stack (`mobile/`)

- **Expo SDK 57** / React Native 0.86 / React 19, TypeScript strict, React Compiler on (`experiments.reactCompiler`), `@/*` path alias
- **expo-router** with `NativeTabs` (`expo-router/unstable-native-tabs`) — a real `UITabBarController`, so the tab bar is Liquid Glass on iOS 26 and Material 3 on Android
- **zustand** stores, **Reanimated 4** + gesture-handler, **expo-glass-effect**, expo-image, expo-secure-store, react-native-maps, `@expo/ui` (inline date pickers)
- No backend: an in-memory mock store seeded from `src/services/mockData.ts`; session in SecureStore; theme/language in AsyncStorage
- Fonts: Aeonik (CoType Foundry) + the Remixicon icon font, embedded via the `expo-font` config plugin
- Expo Go is **not** supported (frozen at SDK 54) — development builds only

## Build & run

```bash
cd mobile
npx tsc --noEmit                      # type-check — must be clean before every commit
npx expo lint                         # ESLint incl. React Compiler rules — must be clean (was 22 problems → 0)

scripts/build-sim.sh <simulator-udid> # Release build → iOS simulator (see below)
scripts/build-android.sh              # Release build → a running Android emulator
```

**Use the wrapper scripts, not `expo run:*` directly.** They exist because of real traps:
- Xcode silently **skips the JS bundle phase** when no native input changed, so JS-only edits ship a stale bundle. The script deletes the built bundle to force re-bundling.
- `expo run:ios` opens a dev-client URL after launching; iOS 26 answers any custom-scheme open with an **"Open in Carlib?" prompt nothing can dismiss unattended**. The script builds with `xcodebuild` and installs/launches through `simctl` instead. The same prompt is why `simctl openurl` deep links are useless here — use the screenshot harness below.
- The Android Gradle plugin **cannot use JDK 26**; the script pins `JAVA_HOME` to Android Studio's JDK 21 and defaults `ANDROID_HOME` (prebuild regenerates `android/` without `local.properties`).
- `ios/` and `android/` are **generated** (CNG) and carry absolute paths. After moving or fresh-cloning the repo, run each script once with `CARLIB_PREBUILD=1`; edit `app.json`, never the native projects. `CARLIB_PREBUILD=1` is also required after changing icon/splash config.

**Simulators:** several may be booted on this machine (other projects use their own). Always address a device by UDID — never `booted` — and give Carlib a dedicated one (`xcrun simctl create Carlib-Claude com.apple.CoreSimulator.SimDeviceType.iPhone-17-Pro <ios-26-runtime>`). Android: `CARLIB_ANDROID_DEVICE=<avd name>` picks the emulator; the script otherwise grabs whichever AVD exists.

**No test target exists** (decision: parity is verified on device). Don't hunt for jest/Maestro recipes.

### Signing in, and jumping straight to a screen

Auth is mocked. Seed credentials live in `mobile/src/services/defaultUsers.ts` and are tabulated in `TEST_ACCOUNTS.md` — `driver@carlib.fr` / `garage@carlib.fr`, password `password`. Seed users carry a role, so signing in as one lands directly in that tab shell. Sign-up works for any other email, but the password is never persisted.

The screenshot harness (`src/app/(auth)/index.tsx`, baked in at bundle time via `.env.local`) is driven by the build scripts' env vars:
- `CARLIB_SEED=<seed email>` force-signs-in that user · `CARLIB_TAB=shops|profile` lands on a tab · `CARLIB_THEME=dark|light|system`
- `CARLIB_ROUTES=/home/claims,/profile/settings,…` pushes each route in turn, `CARLIB_ROUTE_DWELL` ms apart (default 5000) — one build, then `xcrun simctl io <udid> screenshot` on a timer. Routes are group-less (`/home/…`, `/shops/…`, `/claims/…`); `/profile/…` resolves inside the signed-in role's group.
- **Persisted state** (drafts, theme, language) can be seeded from outside: terminate the app, write `<container>/Library/Application Support/com.carlib.fr/RCTAsyncLocalStorage_V1/manifest.json` (`xcrun simctl get_app_container <udid> com.carlib.fr data`; a JSON map of key → value string, values under 1 KB inline), relaunch. AsyncStorage 2.x reads there, not `Documents/`. This is how mid-flow screens (a declaration at step 3) are reached without taps.
- `simctl` on a long-lived simulator can hang (`launch`, `get_app_container`); time-box every call and reboot the device (`shutdown` + `boot`) when it does.
- **Location:** `xcrun simctl location <udid> set 48.86,2.35` gives the app a fix; `clear` removes it (the first fix then times out after 8 s → "unavailable"). Answer the permission dialog from outside with `xcrun simctl privacy <udid> grant|revoke|reset location com.carlib.fr` — the dialog itself cannot be tapped by the harness. Revoke + relaunch exercises the file-address fallback of the shop search.

## Architecture

### Route groups and shells
```
src/app/
  _layout.tsx        # ThemeProvider + a bare <Slot>. NO navigator here: NativeTabs must never sit inside a Stack
                     # (expo/expo#42364). Shell switches cross-fade, keyed on the top-level segment.
  (auth)/            # splash (index) → welcome carousel → sign-in/up (form sheets) → role-selection
  (driver)/          # NativeTabs: home · shops · profile        ← deliberately NOT the Swift Home/Claims/Profile
  (garage)/          # NativeTabs: dashboard · claims · schedule · profile
```
Each tab has its own `Stack` (`(driver)/home/_layout.tsx` etc.). Driver claims live under `(driver)/home/claims` and `(driver)/home/claim/[id]` — don't "fix" the driver tabs back to the Swift layout.

### Navigation chrome
- **Native headers** for pushed screens come from `src/components/stackHeaderOptions.ts` (transparent bar, Liquid Glass on iOS 26, `headerBlurEffect` only below 26, chevron-only back, Aeonik title). Titles are set in the **layout's** `Stack.Screen` — an in-screen `Stack.Screen` applies after first commit and flashes the route name.
- Scrolling screens use `contentInsetAdjustmentBehavior="automatic"`; non-scrolling roots pad with `useHeaderHeight()` from `src/lib/header.ts` (react-navigation is vendored inside expo-router 57; the deep import lives there). Hero screens (claim details) keep content at y=0 under a title-less transparent bar (Swift `.toolbarBackground(.hidden)`).
- **Form sheets never get a native bar** (react-native-screens presents them without a navigation controller) — sheet routes keep their own grabber + title row and are marked `headerShown: false`.
- Tab roots draw their own large titles (Swift used large-title bars there — a candidate for `headerLargeTitle`).
- Cross-flow tab switching: `useAppStore().setPendingDriverTab('shops')` / `setPendingGarageTab('claims')`; the tab layouts navigate and clear the intent. Inside a tab use `router.push`.

### State
Three zustand stores in `src/stores/`: `appStore` (auth status, current user, the pending-tab intents — the `AppState` port), `claimStore` (claims, vehicles, bookings, slots, garages — the `ClaimStore` port; everything synchronous and in-memory, **lost on restart by design**), `shopsUiStore` (the map drawer's expanded state, which hides the tab bar). Services in `src/services/`: `auth`, `defaultUsers`, `mockData`, `secureStore`.

### Models
`src/models/enums.ts` string literals are the Swift enums' **French raw values** (`'pris_en_charge'`, `'annule'`, `'carrossier'`) — never change them; labels come from i18n. `ACCIDENT_KEY` maps them to `accidentTypeLabel.*` keys. Three status systems drive most UI: `ClaimStatus` (9), `BookingStatus` (7), `RepairStatus` (5); `CarlibStatusBadge` maps each to `colors.status[key]`.

## Design system (`mobile/src/theme/`, `mobile/src/components/`)

A token-for-token port of the Swift design system. Revolut-inspired, light default, full dark mode (Settings has a System/Dark/Light picker; `useTheme()` returns `{ colors, scheme, mode, setMode }`, `ThemeScope` forces a subtree — splash is always dark, welcome always light).

- **Colors:** `colors.carlibDark`, `carlibSecondary`, `carlibLabel`, `carlibScreenBg`, `tileSecondary`, `carlibCardBorder`, `brandYellow`, `colors.status[key].{fg,bg}`. Use tokens, not raw values. Explicit `#000000`/`'#fff'` only on surfaces that don't adapt (brand yellow, the always-black lightbox, scrims) — every such literal carries a comment.
- **Typography:** `text.*` styles and `carlibFont(size, weight)` in `typography.ts` mirror `CarlibTypography` (largeTitle 28 … body 15, footnote 13, caption 13/medium, micro 11). **Titles default to medium**; no bold except hero numbers.
- **Spacing** (`spacing.xxs`=4 … `huge`=48, `minTouchTarget` 48, `tileHeight` 180) and **radius** (`xs` 4 … `xl` 24, `full`).
- **Components** mirror the Swift ones 1:1: `CarlibButton` (4 variants, pill, 52pt), `CarlibTextField`/`CarlibSecureField` (52pt, filled, no stroke), `CarlibCard`, `CarlibStatusBadge` (three status forms + Swift's free-form `text/color/backgroundColor/icon`), `CarlibSectionHeader`, `PolestarTile`, `CarBrandLogo`, `DummyImage`, `ClaimCard`, `GarageCard`, `StatusTimeline`, `RecentFileRow`, `EmptyState` (the `ContentUnavailableView` port), `PageDot`, `PressableScale` (the `PressableButtonStyle` port: press spring + haptic), `Glass`.
- **`Glass`** (`src/components/Glass.tsx`) is the one Liquid Glass abstraction: `GlassView` on iOS 26+ when Reduce Transparency is off, an opaque themed card everywhere else. Rules it enforces: uniform `borderRadius` only; **never animate opacity on a glass view or its parent** (kills the effect) — translate or switch `glassEffectStyle` instead; glass on contained floating surfaces, never full screens.
- Philosophy: **custom** buttons/cards/badges/fields; **native** sheets, alerts, pickers, headers, tabs.

### Icons
`src/components/RemixIcon.tsx` loads `remixicon.ttf` with the glyph map in `assets/icons/remixicon-glyphmap.json` (3,228 glyphs; names are the Swift camelCase cases, `homeLine`). `scripts/gen-remixicon-glyphmap.js` regenerates it from the archived `RemixIcon.swift`. `CarlibIcon` semantic aliases: `src/components/icons.ts`.

### Motion
- Reanimated 4 treats every spring/timing/repeat/layout animation as `ReduceMotion.System` **by default** — don't add `reduceMotion` config. Only non-Reanimated motion (map camera, programmatic scrolls) needs a `useReducedMotion()` gate.
- Swift springs are converted exactly: `stiffness = (2π/response)²`, `damping = 2·ζ·√stiffness`; layout animations take `.springify().stiffness(k).damping(c)`. Comment the Swift source on every constant.
- Image load crossfades are fine under Reduce Motion (a fade is the safe alternative).

## Conventions & gotchas

- **React Compiler lint rules apply** (`expo lint`): write shared values with `.set()`/`.get()` outside `useAnimatedStyle`; no `setState` in effects (derive in render, or move it to the event handler); no ref reads during render (sync latest-value refs in `useLayoutEffect`); FlatList viewability pairs from a lazy `useState`. Two reasoned `eslint-disable` lines exist in the shops drawer where the rule can't see through `runOnJS`.
- **Intent parity, not pixel parity** with the archived Swift app: keep RN's fixes (Sunday-toggle reopen, week-strip dark contrast, photo removal + counter, persisting garage-profile Save, localized copy Swift hardcoded). Don't re-import Swift bugs or layout quirks.
- **No rating / review system.** Removed as absent from the PRD; don't reintroduce stars or a "Reputation" section without the product owner.
- **Google Maps key (Android, outstanding):** the Shops map needs `android.config.googleMaps.apiKey` in `app.json`; without it `GarageMapCanvas` renders a localized "Map unavailable" backdrop. iOS uses Apple Maps.
- Commits: atomic, `type(scope): what` + a body that says why; stage explicit paths; never push `main`; no AI co-author trailer (the client receives the log). No Jira trailer on this project (product-owner decision).

## Figma / design source

- **File:** `Carlib — App Design` — `fileKey` `71sAiKhZ2mWg1I7NSzORg3`
- **Icon library:** `HT icon lib (Copy)` — remote team library; discover icons via `search_design_system` with `includeLibraryKeys: ["lk-1cc70db821d4c22449c51299d022329fc13768343adeda4016d85a2fb010b94860ca4f96523c3ef6ad20af979ce0f5d032399958bb00692bb6f960ca5f3292dd"]`. Naming mirrors Remixicon (`home-4-line`, `notification-line`).
- **Also subscribed:** Apple's `iOS and iPadOS 26` UI kit — prefer real Apple components for iOS chrome.
- **Frame naming:** `NN — Role · Screen` (e.g. `24 — Declaration · Confirmation`). Keep numbering stable.

## Marketing website (`web/`)

Separate Next.js 16 marketing site with its own toolchain and a nested `CLAUDE.md` → `AGENTS.md` warning that **Next.js 16 has breaking changes**; read `node_modules/next/dist/docs/` before guessing APIs.

- **Stack:** Next.js 16.2 (Turbopack), React 19.2, Tailwind v4, TypeScript 5
- **Scripts (from `web/`):** `npm run dev` (port 3000 — check `lsof -i :3000` first; a dev server is often already up), `npm run build`, `npm run start`, `npm run lint`
- **Structure:** `src/app/` (App Router; `page.tsx` home, `layout.tsx` fonts), `src/components/` (`PerspectiveHero.tsx` with the Driver/Shop toggle, `FeatureBento.tsx`, `primitives.tsx`), `src/lib/`
- **Design parity:** imitate the app — reference `mobile/src/theme/` and the profile tile rows (`rounded-[14px]`, ~44pt icon discs in `brand-yellow-soft`, 15pt medium title, 13pt secondary subtitle).
- Anything using `useEffect`/`useState`/scroll needs `"use client"`.

## Archived SwiftUI app (`archive/swift/`)

The original iOS-only app (SwiftUI + `@Observable`, Swift 6, iOS 26, XcodeGen, zero packages), archived when the RN port reached parity. Tag **`swift-final`** marks its last buildable commit. Keep it for side-by-side checks; don't develop it.

- Build from `archive/swift/`: `xcodegen generate` then `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcodebuild -project Carlib.xcodeproj -scheme Carlib -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build`. XcodeGen regenerates `Info.plist` from `project.yml` — never edit it directly. Install the `.app` on a **separate** simulator: it shares the `com.carlib.fr` bundle id with the RN app.
- `Carlib/App/DebugScreenshotHelper.swift` (DEBUG builds) honours `CARLIB_SEED`, `CARLIB_TAB=profile|home`, `CARLIB_SHEET=settings|language|password|notifications|delete`, passed as `SIMCTL_CHILD_*` env to `xcrun simctl launch`.
- Layout: `Carlib/App` (`CarlibApp`, `RootView`, `AppState`), `Views/{Onboarding,Auth,Driver,Garage,Shared}`, `DesignSystem/` (`CarlibColors`, `CarlibTypography`, `CarlibSpacing`, `CarlibRadius`, `Components/`), `Services/` (`ClaimStore`, `AuthService`, `KeychainManager`, `MockData`, `DefaultUsers`), `Resources/Strings.swift` (`L10n.*`, `tr(en, fr)`, ~394 keys).
- Driver tabs there are Home / Claims / Profile — the one structural difference from the RN app.

## Docs

- `docs/PRD_Carlib_v0.1_4.pdf` — original Digital Unicorn PRD (March 2026)
- `docs/RN_MIGRATION_PLAN.md` — the researched port plan (stack, Liquid Glass strategy, phased build, risk register); still the reference for Stage 3 glass work
- `docs/analysis/` — 15 analysis files, all written against the **SwiftUI** app: `01`–`08` the generic disciplines, `09_*` the SwiftUI passes, `10_gap_analysis.md` a Swift-vs-PRD gap list from April 2026 (not an RN parity list)
- `docs/design/flows_and_pages.md` — screen inventory and flow map (links into `archive/swift/`); `docs/design-system/carlib-design-system.md`, `docs/design_system_architecture.md`, `docs/ui_design_specification.md` — the written design-system spec both apps implement. Check them before inventing a token or component.

## Claude Code plugin setup

This repo also ships a design-oriented Claude Code template — 123 skills, 27 commands, 8 agents. See `README.md` and `setup.sh`. Skills auto-load from `.claude/skills/`; MCP servers: Puppeteer + Chrome DevTools (`.mcp.json`).
