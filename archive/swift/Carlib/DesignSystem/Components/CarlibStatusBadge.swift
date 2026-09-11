import SwiftUI

/// Capsule-shaped status badge for claim, booking, and repair statuses.
struct CarlibStatusBadge: View {
    let text: String
    let color: Color
    let backgroundColor: Color
    var icon: RemixIcon?

    var body: some View {
        HStack(spacing: CarlibSpacing.xxs) {
            if let icon {
                icon.view(size: 11, color: color)
            }
            Text(text)
                .font(CarlibFont.caption(.medium))
        }
        .foregroundStyle(color)
        .padding(.horizontal, CarlibSpacing.xs)
        .padding(.vertical, CarlibSpacing.xxs)
        .background(backgroundColor, in: Capsule())
    }
}

// MARK: - Convenience Initializers

extension CarlibStatusBadge {
    init(claimStatus: ClaimStatus) {
        self.text = claimStatus.localizedName
        switch claimStatus {
        case .draft:
            self.color = .statusDraft; self.backgroundColor = .statusDraftBg; self.icon = .pencilLine
        case .submitted:
            self.color = .statusSubmitted; self.backgroundColor = .statusSubmittedBg; self.icon = .sendPlaneFill
        case .matched:
            self.color = .statusMatched; self.backgroundColor = .statusMatchedBg; self.icon = .searchLine
        case .accepted:
            self.color = .statusAccepted; self.backgroundColor = .statusAcceptedBg; self.icon = .checkboxCircleFill
        case .inProgress:
            self.color = .statusInProgress; self.backgroundColor = .statusInProgressBg; self.icon = .carFill
        case .repairing:
            self.color = .statusRepairing; self.backgroundColor = .statusRepairingBg; self.icon = .toolsFill
        case .completed:
            self.color = .statusCompleted; self.backgroundColor = .statusCompletedBg; self.icon = .verifiedBadgeFill
        case .cancelled:
            self.color = .statusCancelled; self.backgroundColor = .statusCancelledBg; self.icon = .closeCircleFill
        case .expired:
            self.color = .statusExpired; self.backgroundColor = .statusExpiredBg; self.icon = .timeFill
        }
    }

    init(bookingStatus: BookingStatus) {
        self.text = bookingStatus.localizedName
        switch bookingStatus {
        case .pending:
            self.color = .statusMatched; self.backgroundColor = .statusMatchedBg; self.icon = .timeFill
        case .confirmed:
            self.color = .statusAccepted; self.backgroundColor = .statusAcceptedBg; self.icon = .checkboxCircleFill
        case .arrivedAtGarage:
            self.color = .statusInProgress; self.backgroundColor = .statusInProgressBg; self.icon = .mapPinFill
        case .vehicleDroppedOff:
            self.color = .statusCompleted; self.backgroundColor = .statusCompletedBg; self.icon = .carFill
        case .rescheduled:
            self.color = .statusMatched; self.backgroundColor = .statusMatchedBg; self.icon = .calendarScheduleLine
        case .cancelledByDriver, .cancelledByGarage:
            self.color = .statusCancelled; self.backgroundColor = .statusCancelledBg; self.icon = .closeCircleFill
        }
    }

    init(repairStatus: RepairStatus) {
        self.text = repairStatus.localizedName
        switch repairStatus {
        case .diagnostic:
            self.color = .statusSubmitted; self.backgroundColor = .statusSubmittedBg; self.icon = .stethoscopeLine
        case .waitingParts:
            self.color = .statusMatched; self.backgroundColor = .statusMatchedBg; self.icon = .archiveFill
        case .repairing:
            self.color = .statusRepairing; self.backgroundColor = .statusRepairingBg; self.icon = .toolsFill
        case .qualityCheck:
            self.color = .statusInProgress; self.backgroundColor = .statusInProgressBg; self.icon = .shieldCheckFill
        case .readyForPickup:
            self.color = .statusCompleted; self.backgroundColor = .statusCompletedBg; self.icon = .thumbUpFill
        }
    }
}

#Preview("Claim Statuses") {
    VStack(alignment: .leading, spacing: CarlibSpacing.xs) {
        ForEach(ClaimStatus.allCases, id: \.self) { status in
            CarlibStatusBadge(claimStatus: status)
        }
    }
    .padding()
}
