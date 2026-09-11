# Archived SwiftUI app

The original Carlib iOS app (SwiftUI, iOS 26, XcodeGen). It was superseded by
the React Native port in `mobile/`, which is the product. This copy is kept
as the design reference the port was verified against — read it, don't ship it.

- Last buildable state: git tag `swift-final`.
- Build for a side-by-side check (from this directory):

  ```bash
  xcodegen generate
  DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcodebuild \
    -project Carlib.xcodeproj -scheme Carlib \
    -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build
  ```

  `Carlib/App/DebugScreenshotHelper.swift` honours `CARLIB_SEED`, `CARLIB_TAB`
  and `CARLIB_SHEET` launch env vars (pass them as `SIMCTL_CHILD_*` to
  `xcrun simctl launch`).
- `mobile/scripts/gen-remixicon-glyphmap.js` still reads
  `Carlib/DesignSystem/RemixIcon.swift` from here to regenerate the icon glyph
  map — the only thing in `mobile/` that points at this directory.
