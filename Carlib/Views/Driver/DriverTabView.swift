import SwiftUI

/// Main tab navigation for the driver experience.
/// Three tabs: Home (claim dossier + CTA), Shops (browse body shops), Profile.
/// "Report" is triggered from the Home CTA, not a tab — declaration is an event, not a destination.
struct DriverTabView: View {
    @Environment(AppState.self) private var appState
    @State private var selectedTab: DriverTab = .home

    var body: some View {
        TabView(selection: $selectedTab) {
            Tab(value: DriverTab.home) {
                DriverHomeView()
                    .environment(appState)
            } label: {
                Label {
                    Text(verbatim: L10n.DriverTab.home)
                } icon: {
                    CarlibIcon.home.image(size: 24)
                }
            }

            Tab(value: DriverTab.shops) {
                NavigationStack {
                    GarageSearchView()
                }
            } label: {
                Label {
                    Text(verbatim: L10n.DriverTab.shops)
                } icon: {
                    CarlibIcon.shops.image(size: 24)
                }
            }

            Tab(value: DriverTab.profile) {
                DriverProfileView()
            } label: {
                Label {
                    Text(verbatim: L10n.DriverTab.profile)
                } icon: {
                    CarlibIcon.profile.image(size: 24)
                }
            }
        }
        .tint(.carlibPrimaryBlue)
        .onChange(of: appState.pendingDriverTab) { _, newValue in
            if let tab = newValue {
                selectedTab = tab
                appState.pendingDriverTab = nil
            }
        }
        .onAppear {
            if let tab = appState.pendingDriverTab {
                selectedTab = tab
                appState.pendingDriverTab = nil
            }
        }
    }
}

enum DriverTab: Hashable {
    case home
    case shops
    case profile
}

#Preview {
    DriverTabView()
        .environment(AppState())
        .environment(ClaimStore())
}
