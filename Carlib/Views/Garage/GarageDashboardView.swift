import SwiftUI

/// Navigation destinations reachable from the Garage dashboard.
enum GarageDashboardDestination: Hashable {
    case claimDetail(UUID)
    case planning
}

/// Garage dashboard — designed as a cockpit. A shop owner should see the
/// numbers that matter, the next appointment, the cars in the bay, and
/// any inbound requests at first glance. We keep the emotional hero header
/// as a slim banner and put operational density above the fold.
struct GarageDashboardView: View {
    @Environment(AppState.self) private var appState
    @Environment(ClaimStore.self) private var claimStore
    @State private var path = NavigationPath()
    @State private var newRequestIndex: Int = 0

    private var newRequestsCount: Int {
        claimStore.availableClaims.count
    }

    private var inProgressCount: Int {
        claimStore.garageClaims.filter { $0.status == .repairing || $0.status == .inProgress }.count
    }

    private var todayAppointmentsCount: Int {
        claimStore.slotsForDate(.now).filter { !$0.isAvailable }.count
    }

    private var completedThisMonthCount: Int {
        claimStore.pastClaims.filter { $0.status == .completed }.count
    }

    var body: some View {
        NavigationStack(path: $path) {
            ZStack(alignment: .top) {
                Color.carlibScreenBg.ignoresSafeArea()

                Image("HomeTopBg")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(maxWidth: .infinity, alignment: .top)
                    .opacity(0.2)
                    .ignoresSafeArea(edges: .top)
                    .allowsHitTesting(false)
                    .accessibilityHidden(true)

                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        statusBanner
                        kpiStrip
                        newRequestsSection
                        todaysScheduleSection
                        activeJobsSection
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 16)
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
            .navigationDestination(for: GarageDashboardDestination.self) { dest in
                switch dest {
                case .claimDetail(let id):
                    if let claim = claimStore.claims.first(where: { $0.id == id }) {
                        GarageClaimDetailView(claim: claim)
                    }
                case .planning:
                    GaragePlanningView()
                }
            }
        }
    }

// MARK: - Status Banner (slim, replaces huge pulse)

    /// Single-row compact header that sets the tone without eating the
    /// fold. Kicker dot + counts + brand-yellow primary action.
    private var statusBanner: some View {
        HStack(spacing: 12) {
            HStack(spacing: 10) {
                Circle()
                    .fill(newRequestsCount > 0 ? Color.statusCompleted : Color.carlibSecondary)
                    .frame(width: 6, height: 6)
                Text(verbatim: bannerKicker)
                    .font(CarlibFont.caption(.medium))
                    .tracking(1.2)
                    .textCase(.uppercase)
                    .foregroundStyle(.carlibSecondary)
                    .lineLimit(1)
            }

            Spacer(minLength: 8)

            if newRequestsCount > 0 {
                Button {
                    appState.pendingGarageTab = .claims
                } label: {
                    HStack(spacing: 6) {
                        Text(verbatim: "Review")
                            .font(CarlibFont.caption(.medium))
                        RemixIcon.arrowRightLine.view(size: 14, color: .carlibScreenBg)
                    }
                    .foregroundStyle(.carlibScreenBg)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 7)
                    .background(Color.carlibDark, in: Capsule())
                }
                .buttonStyle(.pressable(scale: 0.95, haptic: .light))
            }
        }
    }

    private var bannerKicker: String {
        let parts = [
            "\(newRequestsCount) new",
            "\(todayAppointmentsCount) today",
            "\(inProgressCount) in shop",
        ]
        return parts.joined(separator: " • ")
    }

    // MARK: - KPI Strip (top-of-fold)

    /// 4 compact at-a-glance metrics. Each block is tappable and routes to
    /// the place where the underlying data lives.
    /// Color semantics:
    ///   - New         → `statusCompleted` (green = fresh / go)
    ///   - In repair   → `brandYellow` (brand attention = active work)
    ///   - Today/Month → neutral dark
    private var kpiStrip: some View {
        HStack(spacing: 8) {
            kpiBlock(
                value: "\(newRequestsCount)",
                label: "New",
                accent: newRequestsCount > 0 ? .statusCompleted : .carlibSecondary,
                action: { appState.pendingGarageTab = .claims }
            )
            kpiDivider
            kpiBlock(
                value: "\(inProgressCount)",
                label: "In repair",
                accent: inProgressCount > 0 ? .brandYellow : .carlibSecondary,
                action: { appState.pendingGarageTab = .claims }
            )
            kpiDivider
            kpiBlock(
                value: "\(todayAppointmentsCount)",
                label: "Today",
                accent: .carlibDark,
                action: { appState.pendingGarageTab = .planning }
            )
            kpiDivider
            kpiBlock(
                value: "\(completedThisMonthCount)",
                label: "Month",
                accent: .carlibDark,
                action: { appState.pendingGarageTab = .claims }
            )
        }
        .padding(.vertical, 14)
        .padding(.horizontal, 8)
        .background(Color.tileSecondary, in: RoundedRectangle(cornerRadius: 16))
    }

    private func kpiBlock(value: String, label: String, accent: Color, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(spacing: 2) {
                Text(verbatim: value)
                    .font(.custom("Aeonik-Medium", size: 22))
                    .foregroundStyle(accent)
                Text(verbatim: label)
                    .font(.custom("Aeonik-Regular", size: 11))
                    .foregroundStyle(.carlibSecondary)
            }
            .frame(maxWidth: .infinity)
            .contentShape(Rectangle())
        }
        .buttonStyle(.pressable(scale: 0.96, haptic: .light))
    }

    private var kpiDivider: some View {
        RoundedRectangle(cornerRadius: 0.5)
            .fill(Color.carlibCardBorder)
            .frame(width: 1, height: 28)
    }

    // MARK: - New Requests (inline preview of first request)

    /// Horizontal swipe carousel of pending requests — shop can triage
    /// through them without tapping in. Page dots below show position.
    @ViewBuilder
    private var newRequestsSection: some View {
        let requests = Array(claimStore.availableClaims)
        if !requests.isEmpty {
            VStack(alignment: .leading, spacing: 9) {
                sectionHeader(
                    title: "New requests",
                    badge: "\(newRequestsCount)",
                    actionLabel: "See all",
                    action: { appState.pendingGarageTab = .claims }
                )

                // Page-style TabView → native swipe snap + iOS gestures.
                // Height is fixed so the container doesn't jump when cards
                // change size (the carousel itself manages page sizing).
                TabView(selection: $newRequestIndex) {
                    ForEach(Array(requests.enumerated()), id: \.element.id) { index, claim in
                        requestCard(for: claim)
                            .padding(.horizontal, 2)
                            .tag(index)
                    }
                }
                .tabViewStyle(.page(indexDisplayMode: .never))
                .frame(height: requestCardHeight)

                // Custom page dots sit below the card (cleaner than the
                // default iOS indicators which float over the content).
                if requests.count > 1 {
                    HStack(spacing: 6) {
                        ForEach(0..<requests.count, id: \.self) { index in
                            Capsule()
                                .fill(index == newRequestIndex ? Color.carlibDark : Color.carlibCardBorder)
                                .frame(
                                    width: index == newRequestIndex ? 18 : 6,
                                    height: 6
                                )
                                .animation(.spring(response: 0.35), value: newRequestIndex)
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding(.top, 2)
                }
            }
            .onChange(of: requests.count) { _, newCount in
                // Keep the selected page valid if a card is declined/accepted.
                if newRequestIndex >= newCount && newCount > 0 {
                    newRequestIndex = newCount - 1
                }
            }
        }
    }

    /// Fixed card height — header (~60pt) + spacing (12) + button row (~48pt)
    /// + internal padding (28). Keeps the TabView from pinching cards.
    private var requestCardHeight: CGFloat { 172 }

    private func requestCard(for claim: Claim) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            // Tapping the card header (avatar + vehicle info + timestamp)
            // also opens the claim detail — so the whole card is clickable,
            // not just the two buttons below.
            Button {
                path.append(GarageDashboardDestination.claimDetail(claim.id))
            } label: {
                HStack(spacing: 12) {
                    CarBrandLogo(brand: claim.vehicleInfo?.brand ?? "", size: 32)
                        .frame(width: 48, height: 48)
                        .background(Color.tileSecondary, in: Circle())

                    VStack(alignment: .leading, spacing: 2) {
                        Text(verbatim: vehicleTitle(claim))
                            .font(CarlibFont.body(.medium))
                            .foregroundStyle(.carlibDark)
                        Text(verbatim: claim.accidentType?.localizedName ?? "Repair request")
                            .font(CarlibFont.footnote())
                            .foregroundStyle(.carlibSecondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)

                    Text(verbatim: claim.createdAt.relativeFormatted)
                        .font(CarlibFont.caption(.medium))
                        .foregroundStyle(.carlibSecondary)
                }
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)

            HStack(spacing: 8) {
                Button {
                    claimStore.declineClaim(id: claim.id)
                } label: {
                    Text(verbatim: "Decline")
                        .font(CarlibFont.callout(.medium))
                        .foregroundStyle(.carlibDark)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color.tileSecondary, in: Capsule())
                }
                .buttonStyle(.pressable(scale: 0.96))

                Button {
                    path.append(GarageDashboardDestination.claimDetail(claim.id))
                } label: {
                    Text(verbatim: "Review")
                        .font(CarlibFont.callout(.medium))
                        .foregroundStyle(.black)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color.brandYellow, in: Capsule())
                }
                .buttonStyle(.pressable(scale: 0.96, haptic: .medium))
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.tileSecondary.opacity(0.5), in: RoundedRectangle(cornerRadius: 14))
    }

    // MARK: - Today's Schedule (inline preview)

    /// Instead of a shortcut tile that hides the schedule behind a tap,
    /// show the next 2-3 appointments right here with time + customer.
    private var todaysScheduleSection: some View {
        VStack(alignment: .leading, spacing: 9) {
            sectionHeader(
                title: "Today's schedule",
                badge: nil,
                actionLabel: nil,
                action: nil
            )

            let todaySlots = claimStore.slotsForDate(.now).filter { !$0.isAvailable }.prefix(3)

            if todaySlots.isEmpty {
                emptyRow(
                    icon: .calendarCheckFill,
                    title: "Nothing on the books today",
                    subtitle: "Free day — enjoy the breathing room."
                )
            } else {
                VStack(spacing: 0) {
                    ForEach(Array(todaySlots.enumerated()), id: \.element.id) { index, slot in
                        scheduleRow(slot: slot, index: index)
                        if index < todaySlots.count - 1 {
                            Divider().overlay(Color.carlibCardBorder)
                        }
                    }
                }
                .background(Color.tileSecondary.opacity(0.5), in: RoundedRectangle(cornerRadius: 14))
            }
        }
    }

    private func scheduleRow(slot: TimeSlot, index: Int) -> some View {
        // Demo fills the row with realistic-looking customer + car text.
        // Real data will come when bookings attach customer/vehicle info.
        let demoCustomers = ["Sophie Durand — Peugeot 308", "Jean Leclerc — Renault Clio V", "Marie Bernard — Volkswagen Golf"]
        let demoLabels = ["Drop-off", "Pickup", "Drop-off"]

        return Button {
            appState.pendingGarageTab = .planning
        } label: {
            HStack(spacing: 14) {
                VStack(spacing: 2) {
                    Text(verbatim: slot.startTime.timeFormatted)
                        .font(.custom("Aeonik-Medium", size: 15))
                        .foregroundStyle(.carlibDark)
                    Text(verbatim: demoLabels[index % demoLabels.count])
                        .font(.custom("Aeonik-Regular", size: 11))
                        .foregroundStyle(.carlibSecondary)
                }
                .frame(width: 72, alignment: .leading)

                Rectangle()
                    .fill(index == 0 ? Color.brandYellow : Color.carlibCardBorder)
                    .frame(width: 2, height: 28)

                Text(verbatim: demoCustomers[index % demoCustomers.count])
                    .font(.custom("Aeonik-Medium", size: 14))
                    .foregroundStyle(.carlibDark)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .lineLimit(1)

                RemixIcon.arrowRightLine.view(size: 14, color: .carlibSecondary)
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 12)
            .frame(height: 56)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    // MARK: - Active Jobs (inline list)

    private var activeJobsSection: some View {
        VStack(alignment: .leading, spacing: 9) {
            sectionHeader(
                title: "In the shop",
                badge: nil,
                actionLabel: nil,
                action: nil
            )

            let active = claimStore.garageClaims.prefix(3)

            if active.isEmpty {
                emptyRow(
                    icon: .toolsFill,
                    title: "No cars in the bay",
                    subtitle: "Accept a request to start a new job."
                )
            } else {
                VStack(spacing: 0) {
                    ForEach(Array(active.enumerated()), id: \.element.id) { index, claim in
                        jobRow(claim: claim)
                        if index < active.count - 1 {
                            Divider().overlay(Color.carlibCardBorder)
                        }
                    }
                }
                .background(Color.tileSecondary.opacity(0.5), in: RoundedRectangle(cornerRadius: 14))
            }
        }
    }

    private func jobRow(claim: Claim) -> some View {
        Button {
            path.append(GarageDashboardDestination.claimDetail(claim.id))
        } label: {
            HStack(spacing: 12) {
                CarBrandLogo(brand: claim.vehicleInfo?.brand ?? "", size: 28)
                    .frame(width: 40, height: 40)
                    .background(Color.tileSecondary, in: Circle())

                VStack(alignment: .leading, spacing: 2) {
                    Text(verbatim: vehicleTitle(claim))
                        .font(.custom("Aeonik-Medium", size: 14))
                        .foregroundStyle(.carlibDark)
                    Text(verbatim: claim.accidentType?.localizedName ?? "Repair")
                        .font(.custom("Aeonik-Regular", size: 12))
                        .foregroundStyle(.carlibSecondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                CarlibStatusBadge(claimStatus: claim.status)
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 10)
            .frame(height: 60)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    private func vehicleTitle(_ claim: Claim) -> String {
        guard let v = claim.vehicleInfo else { return "Vehicle" }
        return "\(v.brand) \(v.model)"
    }

    // MARK: - Shared section header

    /// Shared section header. Action is a text-only brand link (no pill
    /// chrome) so stacked sections don't create visual noise.
    @ViewBuilder
    private func sectionHeader(
        title: String,
        badge: String?,
        actionLabel: String?,
        action: (() -> Void)?
    ) -> some View {
        HStack(spacing: 8) {
            Text(verbatim: title)
                .font(.custom("Aeonik-Medium", size: 17))
                .foregroundStyle(.carlibDark)

            if let badge {
                Text(verbatim: badge)
                    .font(CarlibFont.caption(.medium))
                    .foregroundStyle(.black)
                    .padding(.horizontal, 7)
                    .padding(.vertical, 1)
                    .background(Color.brandYellow, in: Capsule())
            }

            Spacer(minLength: 8)

            if let actionLabel, let action {
                Button(action: action) {
                    Text(verbatim: actionLabel)
                        .font(.custom("Aeonik-Medium", size: 13))
                        .foregroundStyle(.carlibDark)
                }
                .buttonStyle(.pressable(scale: 0.96, haptic: .light))
            }
        }
    }

    private func emptyRow(icon: RemixIcon, title: String, subtitle: String) -> some View {
        HStack(spacing: 12) {
            icon.view(size: 20, color: .brandYellow)
                .frame(width: 40, height: 40)
                .background(Color.brandYellow.opacity(0.12), in: Circle())
            VStack(alignment: .leading, spacing: 2) {
                Text(verbatim: title)
                    .font(.custom("Aeonik-Medium", size: 14))
                    .foregroundStyle(.carlibDark)
                Text(verbatim: subtitle)
                    .font(.custom("Aeonik-Regular", size: 12))
                    .foregroundStyle(.carlibSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
            Spacer(minLength: 0)
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.tileSecondary, in: RoundedRectangle(cornerRadius: 14))
    }
}

#Preview {
    GarageDashboardView()
        .environment(AppState())
        .environment(ClaimStore())
}
