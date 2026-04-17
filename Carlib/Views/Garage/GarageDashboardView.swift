import SwiftUI

/// Garage dashboard — KPIs with live data from ClaimStore.
struct GarageDashboardView: View {
    @Environment(AppState.self) private var appState
    @Environment(ClaimStore.self) private var claimStore

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: CarlibSpacing.sectionSpacing) {
                    // KPI cards
                    LazyVGrid(columns: [.init(), .init()], spacing: CarlibSpacing.md) {
                        DashboardKPICard(
                            title: L10n.GarageDashboard.kpiNew,
                            value: "\(claimStore.availableClaims.count)",
                            icon: .fileAddLine
                        )
                        DashboardKPICard(
                            title: L10n.GarageDashboard.kpiInProgress,
                            value: "\(claimStore.garageClaims.filter { $0.status == .repairing }.count)",
                            icon: .toolsFill
                        )
                        DashboardKPICard(
                            title: L10n.GarageDashboard.kpiTodayAppointments,
                            value: "\(claimStore.slotsForDate(.now).filter { !$0.isAvailable }.count)",
                            icon: .calendarLine
                        )
                        DashboardKPICard(
                            title: L10n.GarageDashboard.kpiCompletedThisMonth,
                            value: "\(claimStore.pastClaims.filter { $0.status == .completed }.count)",
                            icon: .checkboxCircleFill
                        )
                    }
                    .padding(.horizontal, CarlibSpacing.screenHorizontal)

                    // Pending claims
                    VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
                        CarlibSectionHeader(
                            title: L10n.GarageDashboard.sectionPending,
                            actionLabel: L10n.Common.seeAll
                        ) {
                            appState.pendingGarageTab = .claims
                        }

                        let pending = claimStore.availableClaims.prefix(2)
                        if pending.isEmpty {
                            CarlibCard(variant: .flat) {
                                Text(verbatim: L10n.GarageDashboard.todayEmpty)
                                    .font(CarlibFont.bodySmall())
                                    .foregroundStyle(.secondary)
                            }
                            .padding(.horizontal, CarlibSpacing.screenHorizontal)
                        } else {
                            ForEach(Array(pending)) { claim in
                                ClaimCardView(claim: claim, showGarage: false)
                                    .padding(.horizontal, CarlibSpacing.screenHorizontal)
                            }
                        }
                    }

                    // Today's schedule
                    VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
                        CarlibSectionHeader(title: L10n.GarageDashboard.sectionToday)

                        let todaySlots = claimStore.slotsForDate(.now).filter { !$0.isAvailable }

                        if todaySlots.isEmpty {
                            CarlibCard(variant: .flat) {
                                HStack(spacing: CarlibSpacing.sm) {
                                    RemixIcon.calendarCheckFill.view(size: 20, color: .brandYellow)
                                    Text(verbatim: L10n.GarageDashboard.todayEmpty)
                                        .font(CarlibFont.bodySmall())
                                        .foregroundStyle(.secondary)
                                }
                            }
                            .padding(.horizontal, CarlibSpacing.screenHorizontal)
                        } else {
                            ForEach(todaySlots) { slot in
                                CarlibCard(variant: .flat) {
                                    HStack {
                                        VStack(alignment: .leading, spacing: 2) {
                                            Text("\(slot.startTime.timeFormatted) — \(slot.endTime.timeFormatted)")
                                                .font(CarlibFont.bodyMedium(.medium))
                                        }
                                        Spacer()
                                        CarlibStatusBadge(bookingStatus: .confirmed)
                                    }
                                }
                                .padding(.horizontal, CarlibSpacing.screenHorizontal)
                            }
                        }
                    }
                }
                .padding(.top, CarlibSpacing.md)
                .padding(.bottom, CarlibSpacing.xxl)
            }
            .navigationTitle(Text(verbatim: L10n.GarageDashboard.title))
        }
    }
}

struct DashboardKPICard: View {
    let title: String
    let value: String
    let icon: RemixIcon

    var body: some View {
        CarlibCard(variant: .elevated) {
            VStack(alignment: .leading, spacing: CarlibSpacing.xs) {
                icon.view(size: 22, color: .brandYellow)
                Text(value)
                    .font(CarlibFont.displayMedium())
                Text(title)
                    .font(CarlibFont.caption(.medium))
                    .foregroundStyle(.secondary)
            }
        }
    }
}

#Preview {
    GarageDashboardView()
        .environment(AppState())
        .environment(ClaimStore())
}
