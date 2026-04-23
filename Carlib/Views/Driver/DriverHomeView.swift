import SwiftUI

/// Navigation destinations reachable from the Home tab.
enum DriverHomeDestination: Hashable {
    case claimDetail(UUID)
    case myGarage
    case createReport
}

/// Driver home — rebuilt section by section from the Figma.
/// Currently ships only the empty "file" status header at the top.
struct DriverHomeView: View {
    @Environment(ClaimStore.self) private var claimStore
    @Environment(AppState.self) private var appState
    @Environment(\.colorScheme) private var colorScheme
    // Typed path array (vs. the type-erased `NavigationPath`) — this is
    // what makes SwiftUI see the `navigationDestination(for:)` declaration
    // and the `path.append(...)` as matching. With `NavigationPath` in
    // release builds we'd sometimes get "no matching navigationDestination"
    // warnings and a white page + yellow triangle placeholder.
    @State private var path: [DriverHomeDestination] = []

    var body: some View {
        NavigationStack(path: $path) {
            ZStack(alignment: .top) {
                Color.carlibScreenBg.ignoresSafeArea()

                // Warm halftone wash anchored to the top. The asset catalog
                // ships both light and dark variants, so the asset system picks
                // the right one automatically based on the active appearance.
                Image("HomeTopBg")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(maxWidth: .infinity, alignment: .top)
                    .opacity(0.2)
                    .ignoresSafeArea(edges: .top)
                    .allowsHitTesting(false)
                    .accessibilityHidden(true)

                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        fileSection
                        VStack(spacing: 12) {
                            reportDamageCTA
                            shortcutsRow
                        }
                        .padding(.horizontal, 20)
                        recentFilesSection
                            .padding(.horizontal, 20)
                    }
                    .padding(.top, 4)
                    .padding(.bottom, 40)
                }
            }
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Image("CarlibLogo")
                        .renderingMode(.original)
                        .resizable()
                        .scaledToFit()
                        .frame(height: 16)
                        .accessibilityLabel("Carlib")
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .navigationDestination(for: DriverHomeDestination.self) { destination in
                // Re-inject the @Observable environments at each branch. On
                // TestFlight / release builds the navigationDestination
                // closure can drop inherited env values during the compiler's
                // optimization pass, which shows up as a white page +
                // yellow-triangle crash when a pushed view reads them.
                switch destination {
                case .claimDetail(let id):
                    if let claim = claimStore.claims.first(where: { $0.id == id }) {
                        DriverClaimDetailView(claim: claim)
                            .environment(claimStore)
                            .environment(appState)
                    } else {
                        missingClaimPlaceholder
                            .environment(claimStore)
                            .environment(appState)
                    }
                case .myGarage:
                    MyGarageView()
                        .environment(claimStore)
                        .environment(appState)
                case .createReport:
                    DeclarationFlowView()
                        .environment(claimStore)
                        .environment(appState)
                }
            }
        }
    }

/// Rendered when a deep-linked claim id is no longer in the store —
    /// keeps the navigation stack from pushing onto a blank scene.
    private var missingClaimPlaceholder: some View {
        ContentUnavailableView {
            Label {
                Text(verbatim: L10n.DriverClaims.emptyTitle)
            } icon: {
                RemixIcon.inboxLine.view(size: 48, color: .carlibSecondary)
            }
        } description: {
            Text(verbatim: L10n.DriverClaims.emptyDescription)
        }
        .background(Color.carlibScreenBg)
    }

    // MARK: - Garage actions (call / directions)

    private func callGarage(_ garage: Garage) {
        let e164 = "\(garage.dialCode)\(garage.phone)".filter { $0.isNumber || $0 == "+" }
        if let url = URL(string: "tel://\(e164)") {
            UIApplication.shared.open(url)
        }
    }

    private func openMaps(for garage: Garage) {
        let encoded = garage.address.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        if let url = URL(string: "http://maps.apple.com/?q=\(encoded)") {
            UIApplication.shared.open(url)
        }
    }

    // MARK: - File Section

    /// "The file" header — lives at the top of the home screen and picks the
    /// right state based on the top active claim in the store.
    @ViewBuilder
    private var fileSection: some View {
        if let claim = topActiveClaim {
            if claim.status == .completed && claim.repairStatus == .readyForPickup {
                readyForPickupFileHeader(for: claim)
            } else if claim.status == .repairing || claim.status == .inProgress {
                inRepairFileHeader(for: claim)
            } else if claim.status == .accepted {
                acceptedFileHeader(for: claim)
            } else if claim.status == .submitted || claim.status == .matched {
                waitingFileHeader(for: claim)
            } else {
                emptyFileHeader
            }
        } else {
            emptyFileHeader
        }
    }

    /// Top active claim by lifecycle priority: ready-for-pickup > in-repair >
    /// accepted > waiting. Cancelled, expired and draft claims never surface
    /// as the hero.
    private var topActiveClaim: Claim? {
        claimStore.claims
            .filter { heroPriority($0) > 0 }
            .max(by: { heroPriority($0) < heroPriority($1) })
    }

    private func heroPriority(_ claim: Claim) -> Int {
        if claim.status == .completed && claim.repairStatus == .readyForPickup { return 5 }
        switch claim.status {
        case .repairing, .inProgress: return 4
        case .accepted: return 3
        case .submitted, .matched: return 2
        default: return 0
        }
    }

    /// State 1 — empty / all clear. Figma 144:678.
    private var emptyFileHeader: some View {
        VStack(alignment: .leading, spacing: 4) {
            kickerChip(color: .statusCompleted, label: L10n.DriverHome.emptyFileKicker)

            Text(verbatim: L10n.DriverHome.emptyFileHeadline)
                .font(CarlibFont.title2())
                .foregroundStyle(.carlibDark)
                .multilineTextAlignment(.leading)
                .fixedSize(horizontal: false, vertical: true)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 20)
    }

    /// State 2 — waiting for a garage to pick up the claim. Figma 144:1000.
    private func waitingFileHeader(for claim: Claim) -> some View {
        activeFileHeader(
            kicker: L10n.DriverHome.waitingKicker,
            accent: .brandYellow,
            stage: 2,
            total: 5,
            headline: L10n.DriverHome.waitingHeadline,
            body: L10n.DriverHome.waitingBody(claim.createdAt.relativeFormatted),
            ctaLabel: L10n.DriverHome.viewClaim,
            ctaAction: { path.append(DriverHomeDestination.claimDetail(claim.id)) }
        )
    }

    /// State 3 — garage accepted, awaiting drop-off. Figma 145:458.
    private func acceptedFileHeader(for claim: Claim) -> some View {
        let garage = claim.assignedGarageId.flatMap(MockData.garage(for:))
        let headline = garage.map { L10n.DriverHome.acceptedHeadline($0.name) }
            ?? L10n.DriverHome.waitingHeadline
        return activeFileHeader(
            kicker: L10n.DriverHome.acceptedKicker,
            accent: .brandYellow,
            stage: 3,
            total: 5,
            headline: headline,
            body: L10n.DriverHome.acceptedBody,
            ctaLabel: L10n.DriverHome.viewClaim,
            ctaAction: { path.append(DriverHomeDestination.claimDetail(claim.id)) }
        )
    }

    /// State 4 — vehicle being repaired at the assigned garage. Figma 145:569.
    private func inRepairFileHeader(for claim: Claim) -> some View {
        let vehicleLabel = claim.vehicleInfo.map { "\($0.brand) \($0.model)" }
            ?? L10n.DriverHome.recentFallbackTitle
        let garage = claim.assignedGarageId.flatMap(MockData.garage(for:))
        let etaDate = Calendar.current.date(byAdding: .day, value: 4, to: claim.updatedAt)
            ?? claim.updatedAt
        return activeFileHeader(
            kicker: L10n.DriverHome.repairKicker,
            accent: .brandYellow,
            stage: 4,
            total: 5,
            headline: L10n.DriverHome.repairHeadline(vehicleLabel),
            garageCard: garage.map { g in
                GarageInfoCardData(
                    etaLabel: L10n.DriverHome.readyBy(etaDate.shortFormatted),
                    etaAccent: .brandYellow,
                    garageName: g.name,
                    distance: L10n.DriverHome.distanceAway(MockData.distance(for: g.id)),
                    onCall: { callGarage(g) },
                    onDirections: { openMaps(for: g) }
                )
            },
            ctaLabel: L10n.DriverHome.viewClaim,
            ctaAction: { path.append(DriverHomeDestination.claimDetail(claim.id)) }
        )
    }

    /// State 5 — repair complete, ready to pick up. Figma 146:736.
    private func readyForPickupFileHeader(for claim: Claim) -> some View {
        let vehicleLabel = claim.vehicleInfo.map { "\($0.brand) \($0.model)" }
            ?? L10n.DriverHome.recentFallbackTitle
        let garage = claim.assignedGarageId.flatMap(MockData.garage(for:))
        return activeFileHeader(
            kicker: L10n.DriverHome.readyForPickupKicker,
            accent: .statusCompleted,
            headline: L10n.DriverHome.readyForPickupHeadline(vehicleLabel),
            garageCard: garage.map { g in
                GarageInfoCardData(
                    etaLabel: L10n.DriverHome.comePickUp,
                    etaAccent: .statusCompleted,
                    garageName: g.name,
                    distance: L10n.DriverHome.distanceAway(MockData.distance(for: g.id)),
                    onCall: { callGarage(g) },
                    onDirections: { openMaps(for: g) }
                )
            },
            ctaLabel: L10n.DriverHome.viewClaim,
            ctaAction: { path.append(DriverHomeDestination.claimDetail(claim.id)) }
        )
    }

    /// Shared layout for the "active claim" file states (states 2 through 5).
    /// Stage indicator, body copy and garage card are all optional so each
    /// state can compose only the rows it needs.
    private func activeFileHeader(
        kicker: String,
        accent: Color,
        stage: Int? = nil,
        total: Int? = nil,
        headline: String,
        body: String? = nil,
        garageCard: GarageInfoCardData? = nil,
        ctaLabel: String,
        ctaAction: @escaping () -> Void = {}
    ) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            // Row 1: kicker (+ optional stage indicator)
            if let stage, let total {
                HStack(alignment: .center) {
                    kickerChip(color: accent, label: kicker)
                    Spacer(minLength: 8)
                    stageIndicator(current: stage, total: total, accent: accent)
                }
            } else {
                kickerChip(color: accent, label: kicker)
            }

            // Row 2: headline (+ optional body)
            VStack(alignment: .leading, spacing: 4) {
                Text(verbatim: headline)
                    .font(CarlibFont.title2())
                    .foregroundStyle(.carlibDark)
                    .multilineTextAlignment(.leading)
                    .fixedSize(horizontal: false, vertical: true)

                if let body {
                    Text(verbatim: body)
                        .font(CarlibFont.body())
                        .foregroundStyle(.carlibSecondary)
                        .multilineTextAlignment(.leading)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            // Row 3: optional garage info card
            if let garageCard {
                garageInfoCard(garageCard)
            }

            // Row 4: primary CTA
            pillCTA(label: ctaLabel, action: ctaAction)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 20)
    }

    /// Translucent card sitting between the headline and the CTA, surfaces
    /// the ETA banner plus the assigned garage with quick call/directions
    /// actions. Figma 145:696 (in repair) / 146:751 (ready for pickup).
    private func garageInfoCard(_ data: GarageInfoCardData) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            // ETA pill — vertical bar + accented label
            HStack(spacing: 8) {
                Capsule()
                    .fill(data.etaAccent)
                    .frame(width: 3, height: 17)
                Text(verbatim: data.etaLabel)
                    .font(CarlibFont.body(.medium))
                    .foregroundStyle(data.etaAccent)
            }

            // Garage row — name/distance on the left, action buttons on the right
            HStack(alignment: .center) {
                VStack(alignment: .leading, spacing: 2) {
                    Text(verbatim: data.garageName)
                        .font(CarlibFont.callout(.medium))
                        .foregroundStyle(.carlibDark)
                    Text(verbatim: data.distance)
                        .font(CarlibFont.footnote())
                        .foregroundStyle(.carlibSecondary)
                }

                Spacer(minLength: 8)

                HStack(spacing: 12) {
                    garageActionButton(icon: .phoneLine, action: data.onCall)
                    garageActionButton(icon: .mapPinLine, action: data.onDirections)
                }
            }
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.carlibAccent, in: RoundedRectangle(cornerRadius: 12))
    }

    private func garageActionButton(icon: RemixIcon, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            icon.view(size: 18, color: .carlibDark)
                .frame(width: 38, height: 38)
                .background(Color.tileSecondary, in: Circle())
        }
        .buttonStyle(.pressable(scale: 0.92, haptic: .light))
    }

    // MARK: - File Section helpers

    /// Small uppercase status chip used at the top of every file state.
    private func kickerChip(color: Color, label: String) -> some View {
        HStack(spacing: 10) {
            Circle()
                .fill(color)
                .frame(width: 6, height: 6)
            Text(verbatim: label)
                .font(CarlibFont.caption(.medium))
                .tracking(1.4)
                .textCase(.uppercase)
                .foregroundStyle(color)
        }
    }

    /// "Stage X of Y" label paired with a five-dot progress ribbon.
    /// Filled dots use the accent color, unfilled use the card border color.
    private func stageIndicator(current: Int, total: Int, accent: Color) -> some View {
        HStack(spacing: 10) {
            Text(verbatim: "Stage \(current) of \(total)")
                .font(CarlibFont.caption())
                .foregroundStyle(.carlibLabel)

            HStack(spacing: 4) {
                ForEach(0..<total, id: \.self) { index in
                    Circle()
                        .fill(index < current ? accent : Color.carlibCardBorder)
                        .frame(width: 9, height: 9)
                }
            }
        }
    }

    /// Full-width pill button used as the file section's primary action.
    private func pillCTA(label: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 8) {
                Text(verbatim: label)
                    .font(CarlibFont.body(.medium))
                RemixIcon.arrowRightLine.view(size: 16, color: .carlibDark)
            }
            .foregroundStyle(.carlibDark)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .padding(.horizontal, 20)
            .background(Color.tileSecondary, in: Capsule())
        }
        .buttonStyle(.pressable())
    }

    // MARK: - Report Damage CTA (Section 2)

    /// Full-width tile that primes the user to start a new declaration.
    /// Cream→yellow gradient bleeds across the tile with the road-barricade
    /// illustration sitting on the right. Tile stays bright in both themes
    /// on purpose: brand yellow is mode-agnostic, and the fixed `.black`
    /// copy/icons need a light surface to sit on. Figma 132:421.
    private var reportDamageCTA: some View {
        Button {
            path.append(DriverHomeDestination.createReport)
        } label: {
            ZStack {
                // Layer 1 — cream→yellow gradient, drawn in code so it
                // adapts the same way in light and dark mode (yellow is
                // intentionally fixed across themes).
                LinearGradient(
                    stops: [
                        .init(color: Color(red: 1.0, green: 0.985, blue: 0.93), location: 0),
                        .init(color: Color(red: 1.0, green: 0.97, blue: 0.82), location: 0.45),
                        .init(color: .brandYellow, location: 1.0),
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )

                // Layer 2 — barricades, anchored to the right edge
                Image("ReportCtaBarricades")
                    .resizable()
                    .scaledToFit()
                    .frame(maxWidth: .infinity, alignment: .trailing)
                    .allowsHitTesting(false)
                    .accessibilityHidden(true)

                // Layer 3 — foreground content
                HStack(spacing: 16) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(verbatim: L10n.DriverHome.reportCtaTitle)
                            .font(CarlibFont.title3())
                            .foregroundStyle(.black)
                        Text(verbatim: L10n.DriverHome.reportCtaBody)
                            .font(CarlibFont.footnote())
                            .foregroundStyle(.black.opacity(0.6))
                            .multilineTextAlignment(.leading)
                            .fixedSize(horizontal: false, vertical: true)
                    }

                    Spacer(minLength: 0)

                    // Frosted glass arrow button — tinted white chip over
                    // the yellow gradient, readable in both themes because
                    // the tile itself is always bright.
                    ZStack {
                        Circle().fill(.ultraThinMaterial)
                        Circle().fill(Color.white.opacity(0.4))
                        RemixIcon.arrowRightLine.view(size: 22, color: .black)
                    }
                    .frame(width: 48, height: 48)
                }
                .padding(20)
            }
            .frame(height: 104)
            .clipShape(RoundedRectangle(cornerRadius: 16))
        }
        .buttonStyle(.pressable(scale: 0.97, haptic: .medium))
    }

    /// Paris map texture behind the Find Body Shop tile icon. The PNG
    /// is a light-mode asset (light bg + grey streets), so in dark mode
    /// we invert the colors and dim it so the streets read as a subtle
    /// dark pattern on the dark tile instead of painting a light square.
    @ViewBuilder
    private var findShopMapOverlay: some View {
        let image = Image("FindShopMap")
            .resizable()
            .scaledToFill()
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottom)
            .allowsHitTesting(false)
            .accessibilityHidden(true)

        if colorScheme == .dark {
            image
                .colorInvert()
                .opacity(0.35)
        } else {
            image
        }
    }

    // MARK: - Shortcuts Row (Section 3)

    /// Two square shortcut tiles below the Report Damage CTA. Figma 131:518.
    private var shortcutsRow: some View {
        HStack(spacing: 12) {
            // My Garage tile
            shortcutTile(
                title: L10n.DriverHome.shortcutMyGarageTitle,
                subtitle: L10n.DriverHome.shortcutMyGarageCars(claimStore.vehicles.count),
                icon: .carFill,
                action: { path.append(DriverHomeDestination.myGarage) }
            )

            // Find Body Shop tile — same shape but with the Paris map
            // texture pinned to the bottom of the tile, behind the icon.
            // In dark mode the texture is inverted so its light streets
            // flip to dark streets on the dark tile fill.
            shortcutTile(
                title: L10n.DriverHome.shortcutFindShopTitle,
                subtitle: L10n.DriverHome.shortcutFindShopSubtitle,
                icon: .map2Fill,
                backgroundOverlay: {
                    findShopMapOverlay
                },
                action: { appState.pendingDriverTab = .shops }
            )
        }
    }

    /// Square home shortcut tile. Title + yellow subtitle top-left, large
    /// 40pt icon bottom-right, optional background overlay layered between
    /// the tile fill and the foreground content.
    private func shortcutTile<Overlay: View>(
        title: String,
        subtitle: String,
        icon: RemixIcon,
        @ViewBuilder backgroundOverlay: () -> Overlay = { EmptyView() },
        action: @escaping () -> Void
    ) -> some View {
        Button(action: action) {
            ZStack {
                Color.tileSecondary
                backgroundOverlay()

                VStack(alignment: .leading, spacing: 0) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(verbatim: title)
                            .font(CarlibFont.title3())
                            .foregroundStyle(.carlibDark)
                        Text(verbatim: subtitle)
                            .font(CarlibFont.footnote())
                            .foregroundStyle(Color.brandYellow)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)

                    Spacer(minLength: 0)

                    HStack {
                        Spacer(minLength: 0)
                        icon.view(size: 40, color: .carlibDark)
                    }
                }
                .padding(16)
            }
            .frame(height: 180)
            .frame(maxWidth: .infinity)
            .clipShape(RoundedRectangle(cornerRadius: 16))
        }
        .buttonStyle(.pressable(scale: 0.97, haptic: .light))
    }

    // MARK: - Recent Files (Section 4)

    /// Recent claims list with a "See all files" pill in the header.
    /// Figma 144:669. Bound to `claimStore.pastClaims`.
    @ViewBuilder
    private var recentFilesSection: some View {
        let rows = Array(claimStore.pastClaims.prefix(3))
        if !rows.isEmpty {
            VStack(alignment: .leading, spacing: 9) {
                // Header row
                HStack {
                    Text(verbatim: L10n.DriverHome.recentFilesTitle)
                        .font(CarlibFont.title3())
                        .foregroundStyle(.carlibDark)

                    Spacer(minLength: 8)

                    NavigationLink {
                        DriverClaimsListView()
                            .environment(claimStore)
                            .environment(appState)
                    } label: {
                        HStack(spacing: 4) {
                            Text(verbatim: L10n.DriverHome.recentFilesSeeAll)
                                .font(CarlibFont.callout())
                            RemixIcon.arrowRightLine.view(size: 16, color: .carlibDark)
                        }
                        .foregroundStyle(.carlibDark)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(Color.tileSecondary, in: Capsule())
                    }
                    .buttonStyle(.pressable(scale: 0.94, haptic: .light))
                }

                // Real rows pulled from past claims (completed, cancelled, expired).
                VStack(spacing: 0) {
                    ForEach(Array(rows.enumerated()), id: \.element.id) { index, claim in
                        if index > 0 {
                            Divider().overlay(Color.carlibCardBorder)
                        }
                        Button {
                            path.append(DriverHomeDestination.claimDetail(claim.id))
                        } label: {
                            recentFileRow(
                                date: claim.updatedAt.monthDayFormatted,
                                title: claim.accidentType?.localizedName
                                    ?? L10n.DriverHome.recentFallbackTitle,
                                status: RecentRowStatus(claim.status)
                            )
                        }
                        .buttonStyle(.pressable(scale: 0.98, haptic: .light))
                    }
                }
            }
        }
    }

    private enum RecentRowStatus {
        case completed, cancelled

        init(_ status: ClaimStatus) {
            switch status {
            case .completed: self = .completed
            case .cancelled, .expired: self = .cancelled
            default: self = .completed
            }
        }

        var label: String {
            switch self {
            case .completed: L10n.DriverHome.recentStatusCompleted
            case .cancelled: L10n.DriverHome.recentStatusCancelled
            }
        }

        var color: Color {
            switch self {
            case .completed: .statusCompleted
            case .cancelled: .statusCancelled
            }
        }

        var background: Color {
            switch self {
            case .completed: .statusCompletedBg
            case .cancelled: .statusCancelledBg
            }
        }
    }

    /// One row in the Recent Files list — date column, title, status pill.
    private func recentFileRow(date: String, title: String, status: RecentRowStatus) -> some View {
        HStack(spacing: 12) {
            Text(verbatim: date)
                .font(CarlibFont.footnote())
                .foregroundStyle(.carlibSecondary)
                .frame(width: 72, alignment: .leading)

            Text(verbatim: title)
                .font(CarlibFont.body(.medium))
                .foregroundStyle(.carlibDark)
                .frame(maxWidth: .infinity, alignment: .leading)

            recentStatusPill(status)
        }
        .frame(height: 52)
    }

    /// Compact pill rendered on the right side of each Recent Files row.
    private func recentStatusPill(_ status: RecentRowStatus) -> some View {
        HStack(spacing: 4) {
            Circle()
                .fill(status.color)
                .frame(width: 6, height: 6)
            Text(verbatim: status.label)
                .font(CarlibFont.caption(.medium))
                .foregroundStyle(status.color)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 4)
        .background(status.background, in: Capsule())
    }
}

/// Data passed to the garage info card embedded in the file section.
private struct GarageInfoCardData {
    let etaLabel: String
    let etaAccent: Color
    let garageName: String
    let distance: String
    var onCall: () -> Void = {}
    var onDirections: () -> Void = {}
}

#Preview {
    DriverHomeView()
        .environment(ClaimStore())
}
