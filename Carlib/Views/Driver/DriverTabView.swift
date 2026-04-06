import SwiftUI

/// Main tab navigation for the driver experience.
/// Only main pages in the tab bar — "Report" is accessed from the Home screen.
struct DriverTabView: View {
    @Environment(AppState.self) private var appState
    @State private var selectedTab: DriverTab = .home

    var body: some View {
        TabView(selection: $selectedTab) {
            Tab(L10n.DriverTab.home, systemImage: CarlibIcon.home, value: .home) {
                DriverHomeView()
                    .environment(appState)
            }

            Tab(L10n.DriverTab.claims, systemImage: CarlibIcon.claims, value: .claims) {
                DriverClaimsListView()
            }

            Tab(L10n.DriverTab.profile, systemImage: CarlibIcon.profile, value: .profile) {
                DriverProfileView()
            }
        }
        .tint(.carlibPrimaryBlue)
        .onChange(of: appState.pendingDriverTab) { _, newValue in
            if let tab = newValue {
                selectedTab = tab
                appState.pendingDriverTab = nil
            }
        }
    }
}

enum DriverTab: Hashable {
    case home
    case claims
    case profile
}

#Preview {
    DriverTabView()
        .environment(AppState())
        .environment(ClaimStore())
}
