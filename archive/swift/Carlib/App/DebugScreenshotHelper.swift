#if DEBUG
import SwiftUI

/// Debug helper for generating screenshots of specific screens without manual
/// navigation. Controlled by launch env vars:
///   CARLIB_SEED=driver@carlib.fr       → force-sign-in as that seed user
///   CARLIB_TAB=profile|home            → switch to that tab after launch
///   CARLIB_SHEET=settings|language|    → open that sheet after landing
///                password|notifications|
///                delete
///
/// This file compiles out of release builds.
enum DebugScreenshotFlags {
    static let seedEmail = ProcessInfo.processInfo.environment["CARLIB_SEED"]
    static let tab = ProcessInfo.processInfo.environment["CARLIB_TAB"]
    static let sheet = ProcessInfo.processInfo.environment["CARLIB_SHEET"]

    static var isActive: Bool { seedEmail != nil }
}

extension AppState {
    @MainActor
    func applyDebugScreenshotFlagsIfNeeded() {
        guard let email = DebugScreenshotFlags.seedEmail else { return }
        guard let cred = DefaultUsers.all.first(where: { $0.email == email }) else { return }
        currentUser = cred.user
        authStatus = .authenticated
        if DebugScreenshotFlags.tab == "profile" {
            pendingDriverTab = .profile
            pendingGarageTab = .profile
        }
    }
}
#endif
