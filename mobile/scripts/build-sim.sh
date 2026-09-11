#!/usr/bin/env bash
# Release build onto a simulator, with the JS bundle guaranteed fresh.
#
# Xcode's "Bundle React Native code and images" phase is skipped when no native
# input changed, so JS-only edits (and EXPO_PUBLIC_* values in .env.local) can
# silently ship a stale bundle. Deleting the built bundle forces the phase.
#
# Usage: scripts/build-sim.sh [simulator-udid]
#   CARLIB_SEED=<seed email>  auto-signs-in that seed user (screenshot harness)
#   CARLIB_TAB=shops|profile  lands on that tab
#   CARLIB_THEME=dark|light   forces the theme mode
#   CARLIB_ROUTES=/a,/b       after sign-in, pushes each route in turn (screenshot slideshow)
#   CARLIB_ROUTE_DWELL=5000   ms between those pushes
#   CARLIB_PREBUILD=1         re-run prebuild first — REQUIRED after changing app.json
#                             icon/splash config, which run:ios/run:android do NOT refresh
set -euo pipefail

cd "$(dirname "$0")/.."

UDID="${1:-376030DA-3086-4262-B661-C2AA5C28AB77}"
DERIVED="$HOME/Library/Developer/Xcode/DerivedData"

if [[ -n "${CARLIB_SEED:-}" ]]; then
  {
    echo "EXPO_PUBLIC_CARLIB_SEED=$CARLIB_SEED"
    [[ -n "${CARLIB_TAB:-}" ]] && echo "EXPO_PUBLIC_CARLIB_TAB=$CARLIB_TAB"
    [[ -n "${CARLIB_THEME:-}" ]] && echo "EXPO_PUBLIC_CARLIB_THEME=$CARLIB_THEME"
    [[ -n "${CARLIB_ROUTES:-}" ]] && echo "EXPO_PUBLIC_CARLIB_ROUTES=$CARLIB_ROUTES"
    [[ -n "${CARLIB_ROUTE_DWELL:-}" ]] && echo "EXPO_PUBLIC_CARLIB_ROUTE_DWELL=$CARLIB_ROUTE_DWELL"
  } > .env.local
  echo "seeded login: $CARLIB_SEED ${CARLIB_TAB:+(tab: $CARLIB_TAB)}"
else
  rm -f .env.local
fi

find "$DERIVED" -path '*/Release-iphonesimulator/Carlib.app/main.jsbundle' -delete 2>/dev/null || true
if [[ -n "${CARLIB_PREBUILD:-}" ]]; then
  LANG=en_US.UTF-8 npx expo prebuild -p ios
fi

rm -rf "${TMPDIR:-/tmp}/metro-cache"

# Build with xcodebuild and install/launch through simctl. `expo run:ios` would
# also open a dev-client URL after launching, which iOS 26 answers with an
# "Open in Carlib?" prompt — fatal for unattended screenshots.
mkdir -p .expo
XCODE_LOG=.expo/xcodebuild.log
DEVELOPER_DIR="${DEVELOPER_DIR:-/Applications/Xcode.app/Contents/Developer}" \
  xcodebuild -workspace ios/Carlib.xcworkspace -scheme Carlib -configuration Release \
  -destination "id=$UDID" build > "$XCODE_LOG" 2>&1 \
  || { grep -E "error:|\*\* BUILD" "$XCODE_LOG" | tail -20; echo "xcodebuild failed — full log: $XCODE_LOG"; exit 1; }
grep -E "^\*\* BUILD" "$XCODE_LOG"
APP=$(find "$DERIVED" -maxdepth 6 -type d -path '*/Release-iphonesimulator/Carlib.app' | head -1)
[[ -n "$APP" ]] || { echo "built Carlib.app not found under $DERIVED"; exit 1; }
xcrun simctl boot "$UDID" >/dev/null 2>&1 || true
xcrun simctl install "$UDID" "$APP"
xcrun simctl launch "$UDID" com.carlib.fr
