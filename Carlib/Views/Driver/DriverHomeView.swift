import SwiftUI

/// Navigation destinations reachable from the Home tab.
enum DriverHomeDestination: Hashable {
    case claimDetail(UUID)
    case garageSearch
    case myGarage
    case createReport
}

/// Driver home — rebuilt section by section from the Figma.
/// Currently ships only the empty "file" status header at the top.
struct DriverHomeView: View {
    @Environment(ClaimStore.self) private var claimStore
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            ZStack(alignment: .top) {
                Color.carlibScreenBg.ignoresSafeArea()

                // Faded yellow dot pattern anchored to the top of the screen.
                // Bleeds into the status bar area and fades out as it goes
                // down. Sits behind the scrolling content so it stays put
                // while the file section scrolls.
                Image("HomeTopBg")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(maxWidth: .infinity, alignment: .top)
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
                    .padding(.top, 20)
                    .padding(.bottom, 40)
                }
            }
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
                .font(.custom("Aeonik-Medium", size: 22))
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
                    distance: L10n.DriverHome.distanceAway(MockData.distance(for: g.id))
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
                    distance: L10n.DriverHome.distanceAway(MockData.distance(for: g.id))
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
                    .font(.custom("Aeonik-Medium", size: 22))
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
        .overlay {
            RoundedRectangle(cornerRadius: 12)
                .strokeBorder(Color.carlibCardBorder, lineWidth: 1)
        }
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
    /// Yellow gradient bleeds across the tile with the road-barricade
    /// illustration sitting on the right. A frosted glass arrow button
    /// pins to the right edge. Figma 132:421.
    private var reportDamageCTA: some View {
        Button {
            path.append(DriverHomeDestination.createReport)
        } label: {
            ZStack {
                // Layer 1 — base tile color (under the gradient so the
                // light/dark tile token still shows through any transparency)
                Color.tileSecondary

                // Layer 2 — yellow gradient blob, full bleed
                Image("ReportCtaGradient")
                    .resizable()
                    .scaledToFill()
                    .allowsHitTesting(false)
                    .accessibilityHidden(true)

                // Layer 3 — barricades, anchored to the right edge
                Image("ReportCtaBarricades")
                    .resizable()
                    .scaledToFit()
                    .frame(maxWidth: .infinity, alignment: .trailing)
                    .allowsHitTesting(false)
                    .accessibilityHidden(true)

                // Layer 4 — foreground content
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

                    // Frosted glass arrow button — ultra-thin material
                    // tinted with 40% white to match the 76% white + 2.1pt
                    // blur from the Figma spec.
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
            shortcutTile(
                title: L10n.DriverHome.shortcutFindShopTitle,
                subtitle: L10n.DriverHome.shortcutFindShopSubtitle,
                icon: .map2Fill,
                backgroundOverlay: {
                    Image("FindShopMap")
                        .resizable()
                        .scaledToFill()
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottom)
                        .allowsHitTesting(false)
                        .accessibilityHidden(true)
                },
                action: { path.append(DriverHomeDestination.garageSearch) }
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
                            .font(.custom("Aeonik-Medium", size: 17))
                            .foregroundStyle(.carlibDark)
                        Text(verbatim: subtitle)
                            .font(.custom("Aeonik-Regular", size: 13))
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
                        .font(.custom("Aeonik-Medium", size: 17))
                        .foregroundStyle(.carlibDark)

                    Spacer(minLength: 8)

                    Button {
                        // Will route to the full claims history once wired up.
                    } label: {
                        HStack(spacing: 4) {
                            Text(verbatim: L10n.DriverHome.recentFilesSeeAll)
                                .font(.custom("Aeonik-Medium", size: 14))
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
                .font(.custom("Aeonik-Regular", size: 13))
                .foregroundStyle(.carlibSecondary)
                .frame(width: 72, alignment: .leading)

            Text(verbatim: title)
                .font(.custom("Aeonik-Medium", size: 15))
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
                .font(.custom("Aeonik-Medium", size: 13))
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
