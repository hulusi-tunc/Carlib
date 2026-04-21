import SwiftUI

/// List of available and accepted claims — live from ClaimStore.
struct GarageClaimsListView: View {
    @Environment(ClaimStore.self) private var claimStore
    @State private var selectedFilter: GarageClaimFilter = .available
    @State private var path = NavigationPath()

    private var filteredClaims: [Claim] {
        switch selectedFilter {
        case .available: claimStore.availableClaims
        case .accepted: claimStore.garageClaims
        }
    }

    var body: some View {
        NavigationStack(path: $path) {
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
                                GarageClaimRow(
                                    claim: claim,
                                    filter: selectedFilter,
                                    path: $path
                                )
                            }
                        }
                        .padding(.horizontal, CarlibSpacing.screenHorizontal)
                        .padding(.top, CarlibSpacing.sm)
                        .padding(.bottom, CarlibSpacing.md)
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

/// Row wrapper so each claim owns its own status-sheet state independently.
private struct GarageClaimRow: View {
    let claim: Claim
    let filter: GarageClaimFilter
    @Binding var path: NavigationPath
    @Environment(ClaimStore.self) private var claimStore
    @State private var showStatusSheet = false

    var body: some View {
        ClaimCardView(
            claim: claim,
            showGarage: false,
            enablePhotoLightbox: true,
            actions: cardActions
        )
        .contentShape(RoundedRectangle(cornerRadius: 14))
        .onTapGesture {
            path.append(claim.id)
        }
        .sheet(isPresented: $showStatusSheet) {
            RepairStatusSheet(currentStatus: claim.repairStatus) { newStatus in
                claimStore.updateRepairStatus(id: claim.id, to: newStatus)
            }
        }
    }

    private var cardActions: ClaimCardView.Actions {
        switch filter {
        case .available:
            return .request(
                accept: {
                    claimStore.acceptClaim(
                        id: claim.id,
                        garageId: MockData.garages[0].id
                    )
                },
                decline: {
                    claimStore.declineClaim(id: claim.id)
                }
            )
        case .accepted:
            return .inProgress(
                currentStatus: claim.repairStatus,
                update: { showStatusSheet = true }
            )
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
