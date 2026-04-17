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

    /// "The file" header — lives at the top of the home screen and changes
    /// per claim state. All five states are wired up. Currently rendering
    /// state 5 for development; data-driven dispatch comes later.
    @ViewBuilder
    private var fileSection: some View {
        readyForPickupFileHeader
    }

    /// State 1 — empty / all clear. Figma 144:678.
    private var emptyFileHeader: some View {
        VStack(alignment: .leading, spacing: 4) {
            kickerChip(color: .statusCompleted, label: "All clear")

            Text(verbatim: "Nothing on file right now.")
                .font(.custom("Aeonik-Medium", size: 22))
                .foregroundStyle(.carlibDark)
                .multilineTextAlignment(.leading)
                .fixedSize(horizontal: false, vertical: true)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 20)
    }

    /// State 2 — waiting. Figma 144:1000.
    private var waitingFileHeader: some View {
        activeFileHeader(
            kicker: "Waiting",
            accent: .brandYellow,
            stage: 2,
            total: 5,
            headline: "Your claim is being reviewed.",
            body: "We're looking for an available body shop 34 min elapsed.",
            ctaLabel: "View claim",
            ctaAction: {}
        )
    }

    /// State 3 — accepted. Figma 145:458.
    private var acceptedFileHeader: some View {
        activeFileHeader(
            kicker: "Accepted",
            accent: .brandYellow,
            stage: 3,
            total: 5,
            headline: "Your claim is being reviewed.",
            body: "We're looking for an available body shop 34 min elapsed.",
            ctaLabel: "View claim"
        )
    }

    /// State 4 — in repair. Figma 145:569.
    private var inRepairFileHeader: some View {
        activeFileHeader(
            kicker: "In repair",
            accent: .brandYellow,
            stage: 4,
            total: 5,
            headline: "Your Peugeot 308 is\nin good hands.",
            garageCard: GarageInfoCardData(
                etaLabel: "Ready Thursday, Apr 17",
                etaAccent: .brandYellow,
                garageName: "Garage Martin",
                distance: "2.4 km away"
            ),
            ctaLabel: "View claim"
        )
    }

    /// State 5 — ready for pickup. Figma 146:736.
    private var readyForPickupFileHeader: some View {
        activeFileHeader(
            kicker: "Ready for pickup",
            accent: .statusCompleted,
            headline: "Your Peugeot 308 is\nready to pick up.",
            garageCard: GarageInfoCardData(
                etaLabel: "Come pick it up",
                etaAccent: .statusCompleted,
                garageName: "Garage Martin",
                distance: "2.4 km away"
            ),
            ctaLabel: "View claim"
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
                        Text(verbatim: "Report damage")
                            .font(CarlibFont.title3())
                            .foregroundStyle(.black)
                        Text(verbatim: "Declare in a few minutes\nand find a garage nearby")
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
                title: "My Garage",
                subtitle: "1 car",
                icon: .carFill,
                action: { path.append(DriverHomeDestination.myGarage) }
            )

            // Find Body Shop tile — same shape but with the Paris map
            // texture pinned to the bottom of the tile, behind the icon.
            shortcutTile(
                title: "Find Body Shop",
                subtitle: "Near you",
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
    /// Figma 144:669. Hardcoded with the three sample rows from the design
    /// for now; the data-driven version comes when the dispatcher lands.
    private var recentFilesSection: some View {
        VStack(alignment: .leading, spacing: 9) {
            // Header row
            HStack {
                Text(verbatim: "Recent Files")
                    .font(.custom("Aeonik-Medium", size: 17))
                    .foregroundStyle(.carlibDark)

                Spacer(minLength: 8)

                Button {
                    // Will route to the full claims history once wired up.
                } label: {
                    HStack(spacing: 4) {
                        Text(verbatim: "See all files")
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

            // Hardcoded sample rows mirroring the Figma copy.
            VStack(spacing: 0) {
                recentFileRow(date: "Mar 12", title: "Parking damage", status: .completed)
                Divider().overlay(Color.carlibCardBorder)
                recentFileRow(date: "Feb 03", title: "Glass break", status: .completed)
                Divider().overlay(Color.carlibCardBorder)
                recentFileRow(date: "Jan 14", title: "Collision", status: .cancelled)
            }
        }
    }

    private enum RecentRowStatus {
        case completed, cancelled

        var label: String {
            switch self {
            case .completed: "Completed"
            case .cancelled: "Cancelled"
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
