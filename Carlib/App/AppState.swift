import SwiftUI

/// Central app state managing user role, authentication, and cross-tab navigation.
@Observable
final class AppState {
    var userRole: UserRole?
    var isOnboarded: Bool = false

    /// Set by deep views to programmatically switch driver tabs.
    var pendingDriverTab: DriverTab?
    /// Set by deep views to programmatically switch garage tabs.
    var pendingGarageTab: GarageTab?

    var isAuthenticated: Bool {
        userRole != nil && isOnboarded
    }
}
