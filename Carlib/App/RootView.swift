import SwiftUI

/// Root view handling role-based routing.
/// Routes to onboarding, driver experience, or garage portal
/// based on the current app state.
struct RootView: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        Group {
            if !appState.isOnboarded {
                OnboardingView()
            } else if let role = appState.userRole {
                switch role {
                case .driver:
                    DriverTabView()
                case .garage:
                    GarageTabView()
                }
            }
        }
        .animation(.easeInOut, value: appState.isOnboarded)
        .animation(.easeInOut, value: appState.userRole)
    }
}
