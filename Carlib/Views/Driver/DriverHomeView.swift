import SwiftUI

/// Navigation destinations reachable from the Home tab.
enum DriverHomeDestination: Hashable {
    case claimDetail(UUID)
    case garageSearch
    case myGarage
    case createReport
}

/// Driver home — Polestar-inspired dark dashboard with tile grid.
/// Navigation: tiles push views or switch tabs.
struct DriverHomeView: View {
    @Environment(ClaimStore.self) private var claimStore
    @State private var path = NavigationPath()

    private var vehicle: VehicleInfo {
        claimStore.defaultVehicle?.info ?? MockData.vehicle308
    }

    private let gridColumns = [
        GridItem(.flexible(), spacing: CarlibSpacing.tileGap),
        GridItem(.flexible(), spacing: CarlibSpacing.tileGap),
    ]

    var body: some View {
        NavigationStack(path: $path) {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    heroArea
                    reportCTA
                    tileGrid
                    if !claimStore.pastClaims.isEmpty { recentSection }
                }
                .padding(.bottom, 40)
            }
            .background(Color.carlibScreenBg)
            .navigationDestination(for: DriverHomeDestination.self) { destination in
                switch destination {
                case .claimDetail(let id):
                    if let claim = claimStore.claims.first(where: { $0.id == id }) {
                        DriverClaimDetailView(claim: claim)
                    }
                case .garageSearch:
                    GarageSearchView()
                case .myGarage:
                    MyGarageView()
                case .createReport:
                    DeclarationFlowView()
                }
            }
        }
    }

    // MARK: - Hero Area

    private var heroArea: some View {
        ZStack(alignment: .topTrailing) {
            Text(verbatim: vehicle.model)
                .font(.system(size: 96, weight: .bold))
                .foregroundStyle(.white.opacity(0.06))
                .offset(x: 20, y: -10)

            VStack(alignment: .leading, spacing: 8) {
                Text(verbatim: "\(vehicle.brand) \(vehicle.model)")
                    .font(.system(size: 15))
                    .foregroundStyle(.carlibSecondary)

                Text(verbatim: L10n.DriverHome.greeting("Laurent"))
                    .font(.system(size: 28, weight: .bold))
                    .foregroundStyle(.white)

                HStack(spacing: 8) {
                    if let claim = claimStore.activeClaims.first {
                        Circle()
                            .fill(Color.carlibPrimaryBlue)
                            .frame(width: 8, height: 8)
                        Text(verbatim: claim.status.localizedName)
                            .font(.system(size: 14, weight: .medium))
                            .foregroundStyle(Color.carlibPrimaryBlue)
                    } else {
                        Circle()
                            .fill(Color.statusCompleted)
                            .frame(width: 8, height: 8)
                        Text(verbatim: "Ready")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundStyle(.carlibSecondary)
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
        .padding(.bottom, 8)
    }

    // MARK: - Tile Grid

    // MARK: - Report CTA (main action)

    private var reportCTA: some View {
        Button {
            path.append(DriverHomeDestination.createReport)
        } label: {
            HStack(spacing: 16) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(L10n.DriverHome.heroTitle)
                        .font(.system(size: 20, weight: .bold))
                        .foregroundStyle(.white)
                    Text(L10n.DriverHome.heroSubtitle)
                        .font(CarlibFont.caption())
                        .foregroundStyle(.white.opacity(0.7))
                }
                Spacer()
                Image(systemName: CarlibIcon.arrowRight)
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundStyle(.white)
                    .frame(width: 48, height: 48)
                    .background(.white.opacity(0.15), in: Circle())
            }
            .padding(20)
            .background(
                LinearGradient(
                    colors: [Color.carlibPrimaryBlue, Color.carlibPrimaryDarkBlue],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                ),
                in: RoundedRectangle(cornerRadius: CarlibRadius.lg)
            )
        }
        .buttonStyle(.plain)
        .padding(.horizontal, 20)
    }

    // MARK: - Tile Grid

    private var tileGrid: some View {
        LazyVGrid(columns: gridColumns, spacing: CarlibSpacing.tileGap) {
            // Tile 1: Active Claim
            if let claim = claimStore.activeClaims.first {
                PolestarTile(
                    title: L10n.DriverHome.sectionActive,
                    subtitle: claim.status.localizedName,
                    icon: CarlibIcon.wrench,
                    iconAlignment: .bottomTrailing,
                    variant: .secondary
                ) {
                    path.append(DriverHomeDestination.claimDetail(claim.id))
                }
            } else {
                PolestarTile(
                    title: L10n.DriverHome.emptyTitle,
                    icon: CarlibIcon.checkCircle,
                    iconAlignment: .bottomTrailing,
                    variant: .secondary
                ) {}
            }

            // Tile 2: My Garage (multi-car)
            PolestarTile(
                title: "My Garage",
                subtitle: "\(claimStore.vehicles.count) car\(claimStore.vehicles.count == 1 ? "" : "s")",
                icon: CarlibIcon.car,
                iconAlignment: .bottomTrailing,
                variant: .secondary
            ) {
                path.append(DriverHomeDestination.myGarage)
            }

            // Tile 3: Find Body Shop
            PolestarTile(
                title: L10n.DriverHome.sectionQuickFind,
                icon: CarlibIcon.mapPin,
                iconAlignment: .bottomLeading,
                variant: .secondary
            ) {
                path.append(DriverHomeDestination.garageSearch)
            }
        }
        .padding(.horizontal, 20)
    }

    // MARK: - Recent Activity

    private var recentSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(verbatim: "RECENT")
                .sectionHeaderStyle()
                .padding(.horizontal, 20)
                .padding(.top, 8)

            VStack(spacing: 0) {
                ForEach(Array(claimStore.pastClaims.prefix(3).enumerated()), id: \.element.id) { index, claim in
                    if index > 0 {
                        Divider()
                            .overlay(Color.carlibCardBorder)
                            .padding(.leading, 20)
                    }

                    HStack {
                        Text(verbatim: claim.createdAt.shortFormatted)
                            .font(.system(size: 13))
                            .foregroundStyle(.carlibSecondary)
                            .frame(width: 72, alignment: .leading)

                        if let type = claim.accidentType {
                            Text(verbatim: type.localizedName)
                                .font(.system(size: 15, weight: .medium))
                                .foregroundStyle(.white)
                        }

                        Spacer()

                        CarlibStatusBadge(claimStatus: claim.status)
                    }
                    .padding(.horizontal, 20)
                    .padding(.vertical, 14)
                }
            }
        }
    }
}

#Preview {
    DriverHomeView()
        .environment(ClaimStore())
}
