import SwiftUI

/// Main tab navigation for the garage experience.
struct GarageTabView: View {
    @Environment(AppState.self) private var appState
    @State private var selectedTab: GarageTab = .dashboard

    var body: some View {
        TabView(selection: $selectedTab) {
            Tab(L10n.GarageTab.dashboard, systemImage: "square.grid.2x2.fill", value: .dashboard) {
                GarageDashboardView()
            }

            Tab(L10n.GarageTab.claims, systemImage: "doc.text.fill", value: .claims) {
                GarageClaimsListView()
            }

            Tab(L10n.GarageTab.planning, systemImage: "calendar", value: .planning) {
                GaragePlanningView()
            }

            Tab(L10n.GarageTab.profile, systemImage: "building.2.fill", value: .profile) {
                GarageProfileView()
            }
        }
        .tint(.carlibPrimaryBlue)
        .onChange(of: appState.pendingGarageTab) { _, newValue in
            if let tab = newValue {
                selectedTab = tab
                appState.pendingGarageTab = nil
            }
        }
    }
}

enum GarageTab: Hashable {
    case dashboard
    case claims
    case planning
    case profile
}

#Preview {
    GarageTabView()
        .environment(AppState())
        .environment(ClaimStore())
}
