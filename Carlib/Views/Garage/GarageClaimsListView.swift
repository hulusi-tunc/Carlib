import SwiftUI

/// List of available and accepted claims — live from ClaimStore.
struct GarageClaimsListView: View {
    @Environment(ClaimStore.self) private var claimStore
    @State private var selectedFilter: GarageClaimFilter = .available

    private var filteredClaims: [Claim] {
        switch selectedFilter {
        case .available: claimStore.availableClaims
        case .accepted: claimStore.garageClaims
        }
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                Picker(L10n.GarageClaims.filter, selection: $selectedFilter) {
                    ForEach(GarageClaimFilter.allCases, id: \.self) { filter in
                        Text(filter.localizedName)
                    }
                }
                .pickerStyle(.segmented)
                .padding(.horizontal, CarlibSpacing.screenHorizontal)
                .padding(.vertical, CarlibSpacing.sm)

                if filteredClaims.isEmpty {
                    ContentUnavailableView {
                        Label {
                            Text(verbatim: selectedFilter == .available
                                ? L10n.GarageClaims.emptyAvailableTitle
                                : L10n.GarageClaims.emptyAcceptedTitle)
                        } icon: {
                            (selectedFilter == .available ? RemixIcon.searchLine : RemixIcon.folderLine)
                                .view(size: 48, color: .carlibSecondary)
                        }
                    } description: {
                        Text(verbatim: selectedFilter == .available
                            ? L10n.GarageClaims.emptyAvailableDescription
                            : L10n.GarageClaims.emptyAcceptedDescription)
                    }
                } else {
                    ScrollView {
                        VStack(spacing: CarlibSpacing.sm) {
                            ForEach(filteredClaims) { claim in
                                NavigationLink(value: claim.id) {
                                    ClaimCardView(claim: claim, showGarage: false)
                                }
                                .buttonStyle(.plain)
                            }
                        }
                        .padding(.horizontal, CarlibSpacing.screenHorizontal)
                        .padding(.top, CarlibSpacing.sm)
                    }
                }
            }
            .navigationTitle(Text(verbatim: L10n.GarageClaims.title))
            .navigationDestination(for: UUID.self) { claimId in
                if let claim = claimStore.claims.first(where: { $0.id == claimId }) {
                    GarageClaimDetailView(claim: claim)
                }
            }
        }
    }
}

enum GarageClaimFilter: CaseIterable {
    case available
    case accepted

    var localizedName: String {
        switch self {
        case .available: L10n.GarageClaims.filterAvailable
        case .accepted: L10n.GarageClaims.filterAccepted
        }
    }
}

#Preview {
    GarageClaimsListView()
        .environment(ClaimStore())
}
