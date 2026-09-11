import SwiftUI

/// Main tab navigation for the garage experience.
struct GarageTabView: View {
    @Environment(AppState.self) private var appState
    @State private var selectedTab: GarageTab = .dashboard

    var body: some View {
        TabView(selection: $selectedTab) {
            Tab(value: GarageTab.dashboard) {
                GarageDashboardView()
            } label: {
                Label {
                    Text(verbatim: L10n.GarageTab.dashboard)
                } icon: {
                    CarlibIcon.dashboard.image(size: 24)
                }
            }

            Tab(value: GarageTab.claims) {
                GarageClaimsListView()
            } label: {
                Label {
                    Text(verbatim: L10n.GarageTab.claims)
                } icon: {
                    CarlibIcon.claims.image(size: 24)
                }
            }

            Tab(value: GarageTab.planning) {
                GaragePlanningView()
            } label: {
                Label {
                    Text(verbatim: L10n.GarageTab.planning)
                } icon: {
                    CarlibIcon.planning.image(size: 24)
                }
            }

            Tab(value: GarageTab.profile) {
                GarageProfileView()
            } label: {
                Label {
                    Text(verbatim: L10n.GarageTab.profile)
                } icon: {
                    CarlibIcon.shop.image(size: 24)
                }
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
