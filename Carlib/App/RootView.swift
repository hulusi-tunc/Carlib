import SwiftUI

/// Root router — splash → welcome/auth → role → main app.
struct RootView: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        Group {
            switch appState.authStatus {
            case .unknown:
                SplashView()

            case .unauthenticated, .sessionExpired:
                // Revolut-style: carousel + auth on same screen
                WelcomeCarouselView()

            case .authenticated:
                if appState.needsRoleSelection {
                    RoleSelectionView()
                } else if appState.userRole == .driver {
                    DriverTabView()
                } else if appState.userRole == .garage {
                    GarageTabView()
                }
            }
        }
        .animation(.easeInOut(duration: 0.3), value: appState.authStatus)
        .animation(.easeInOut(duration: 0.3), value: appState.userRole)
    }
}

#Preview {
    RootView()
        .environment(AppState())
        .environment(ClaimStore())
}
