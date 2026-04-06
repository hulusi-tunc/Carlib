import SwiftUI

/// Capsule-shaped status badge for claim, booking, and repair statuses.
struct CarlibStatusBadge: View {
    let text: String
    let color: Color
    let backgroundColor: Color
    var icon: String?

    var body: some View {
        HStack(spacing: CarlibSpacing.xxs) {
            if let icon {
                Image(systemName: icon)
                    .font(.system(size: 10, weight: .semibold))
            }
            Text(text)
                .font(CarlibFont.caption(.semibold))
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
            self.color = .statusDraft; self.backgroundColor = .statusDraftBg; self.icon = "pencil"
        case .submitted:
            self.color = .statusSubmitted; self.backgroundColor = .statusSubmittedBg; self.icon = "paperplane.fill"
        case .matched:
            self.color = .statusMatched; self.backgroundColor = .statusMatchedBg; self.icon = "magnifyingglass"
        case .accepted:
            self.color = .statusAccepted; self.backgroundColor = .statusAcceptedBg; self.icon = "checkmark.circle.fill"
        case .inProgress:
            self.color = .statusInProgress; self.backgroundColor = .statusInProgressBg; self.icon = "car.fill"
        case .repairing:
            self.color = .statusRepairing; self.backgroundColor = .statusRepairingBg; self.icon = "wrench.fill"
        case .completed:
            self.color = .statusCompleted; self.backgroundColor = .statusCompletedBg; self.icon = "checkmark.seal.fill"
        case .cancelled:
            self.color = .statusCancelled; self.backgroundColor = .statusCancelledBg; self.icon = "xmark.circle.fill"
        case .expired:
            self.color = .statusExpired; self.backgroundColor = .statusExpiredBg; self.icon = "clock.badge.xmark"
        }
    }

    init(bookingStatus: BookingStatus) {
        self.text = bookingStatus.localizedName
        switch bookingStatus {
        case .pending:
            self.color = .statusMatched; self.backgroundColor = .statusMatchedBg; self.icon = "clock.fill"
        case .confirmed:
            self.color = .statusAccepted; self.backgroundColor = .statusAcceptedBg; self.icon = "checkmark.circle.fill"
        case .arrivedAtGarage:
            self.color = .statusInProgress; self.backgroundColor = .statusInProgressBg; self.icon = "mappin.circle.fill"
        case .vehicleDroppedOff:
            self.color = .statusCompleted; self.backgroundColor = .statusCompletedBg; self.icon = "car.fill"
        case .rescheduled:
            self.color = .statusMatched; self.backgroundColor = .statusMatchedBg; self.icon = "calendar.badge.clock"
        case .cancelledByDriver, .cancelledByGarage:
            self.color = .statusCancelled; self.backgroundColor = .statusCancelledBg; self.icon = "xmark.circle.fill"
        }
    }

    init(repairStatus: RepairStatus) {
        self.text = repairStatus.localizedName
        switch repairStatus {
        case .diagnostic:
            self.color = .statusSubmitted; self.backgroundColor = .statusSubmittedBg; self.icon = "stethoscope"
        case .waitingParts:
            self.color = .statusMatched; self.backgroundColor = .statusMatchedBg; self.icon = "shippingbox.fill"
        case .repairing:
            self.color = .statusRepairing; self.backgroundColor = .statusRepairingBg; self.icon = "wrench.fill"
        case .qualityCheck:
            self.color = .statusInProgress; self.backgroundColor = .statusInProgressBg; self.icon = "checkmark.shield.fill"
        case .readyForPickup:
            self.color = .statusCompleted; self.backgroundColor = .statusCompletedBg; self.icon = "hand.thumbsup.fill"
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
