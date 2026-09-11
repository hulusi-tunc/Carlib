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

LANG=en_US.UTF-8 npx expo run:ios \
  --configuration Release --no-bundler --device "$UDID"
