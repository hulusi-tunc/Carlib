import SwiftUI

/// List of driver's claims with live data from ClaimStore.
struct DriverClaimsListView: View {
    @Environment(ClaimStore.self) private var claimStore
    @State private var filter: ClaimFilter = .active

    enum ClaimFilter: CaseIterable {
        case active, past

        var localizedName: String {
            switch self {
            case .active: L10n.DriverClaims.filterActive
            case .past: L10n.DriverClaims.filterPast
            }
        }
    }

    private var filteredClaims: [Claim] {
        switch filter {
        case .active: claimStore.activeClaims
        case .past: claimStore.pastClaims
        }
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                Picker(L10n.DriverClaims.filter, selection: $filter) {
                    ForEach(ClaimFilter.allCases, id: \.self) { f in
                        Text(f.localizedName)
                    }
                }
                .pickerStyle(.segmented)
                .padding(.horizontal, CarlibSpacing.screenHorizontal)
                .padding(.vertical, CarlibSpacing.sm)

                if filteredClaims.isEmpty {
                    ContentUnavailableView(
                        L10n.DriverClaims.emptyTitle,
                        systemImage: "doc.text",
                        description: Text(verbatim: L10n.DriverClaims.emptyDescription)
                    )
                } else {
                    ScrollView {
                        VStack(spacing: CarlibSpacing.sm) {
                            ForEach(filteredClaims) { claim in
                                NavigationLink(value: claim.id) {
                                    ClaimCardView(claim: claim)
                                }
                                .buttonStyle(.plain)
                            }
                        }
                        .padding(.horizontal, CarlibSpacing.screenHorizontal)
                        .padding(.top, CarlibSpacing.sm)
                    }
                }
            }
            .navigationTitle(Text(verbatim: L10n.DriverClaims.title))
            .navigationDestination(for: UUID.self) { claimId in
                if let claim = claimStore.claims.first(where: { $0.id == claimId }) {
                    DriverClaimDetailView(claim: claim)
                }
            }
        }
    }
}

#Preview {
    DriverClaimsListView()
        .environment(ClaimStore())
}
