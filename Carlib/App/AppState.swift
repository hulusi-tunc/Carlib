import SwiftUI

/// Central app state — auth, role, navigation.
@Observable
final class AppState {
    // MARK: - Auth

    var authStatus: AuthStatus = .unknown
    var currentUser: User?

    // MARK: - Onboarding

    var userRole: UserRole? {
        get { currentUser?.role }
        set {
            if var user = currentUser {
                user.role = newValue
                currentUser = user
                KeychainManager.saveUser(user)
            }
        }
    }

    @ObservationIgnored
    var hasSeenWelcome: Bool {
        get { UserDefaults.standard.bool(forKey: "has_seen_welcome") }
        set { UserDefaults.standard.set(newValue, forKey: "has_seen_welcome") }
    }

    var isOnboarded: Bool {
        get { authStatus == .authenticated && userRole != nil }
        set { } // no-op for backward compat
    }

    // MARK: - Navigation

    var pendingDriverTab: DriverTab?
    var pendingGarageTab: GarageTab?

    // MARK: - Derived

    var isAuthenticated: Bool {
        authStatus == .authenticated
    }

    var needsRoleSelection: Bool {
        isAuthenticated && userRole == nil
    }

    // MARK: - Actions

    func completeAuth(user: User) {
        currentUser = user
        authStatus = .authenticated
    }

    func signOut() {
        KeychainManager.clearAll()
        currentUser = nil
        authStatus = .unauthenticated
    }
}
