import SwiftUI

/// Premium claim row card — left status color bar + better hierarchy + Remix Icons.
struct ClaimCardView: View {
    let claim: Claim
    var showGarage: Bool = true

    var body: some View {
        HStack(spacing: 0) {
            // Left color bar
            RoundedRectangle(cornerRadius: 2)
                .fill(statusColor)
                .frame(width: 4)
                .padding(.vertical, 6)

            VStack(alignment: .leading, spacing: 10) {
                // Top row: status + date
                HStack {
                    CarlibStatusBadge(claimStatus: claim.status)
                    Spacer()
                    Text(claim.createdAt.relativeFormatted)
                        .font(CarlibFont.caption())
                        .foregroundStyle(.carlibSecondary)
                }

                // Main: accident icon + type + description
                HStack(spacing: 12) {
                    Circle()
                        .fill(statusColor.opacity(0.12))
                        .frame(width: 44, height: 44)
                        .overlay {
                            accidentIcon.view(size: 20, color: statusColor)
                        }

                    VStack(alignment: .leading, spacing: 3) {
                        Text(claim.accidentType?.localizedName ?? "—")
                            .font(CarlibFont.body(.medium))
                            .foregroundStyle(.carlibDark)
                        Text(claim.description)
                            .font(CarlibFont.caption())
                            .foregroundStyle(.carlibSecondary)
                            .lineLimit(2)
                    }
                }

                // Vehicle with brand logo
                if let vehicle = claim.vehicleInfo {
                    HStack(spacing: 6) {
                        CarBrandLogo(brand: vehicle.brand, size: 16)
                        Text("\(vehicle.brand) \(vehicle.model)")
                            .font(CarlibFont.caption())
                            .foregroundStyle(.carlibSecondary)
                        Text("·").foregroundStyle(.carlibLabel)
                        Text(vehicle.licensePlate)
                            .font(CarlibFont.caption())
                            .foregroundStyle(.carlibSecondary)
                    }
                }

                // Garage
                if showGarage, let garage = MockData.garage(for: claim.assignedGarageId) {
                    HStack(spacing: 6) {
                        RemixIcon.mapPinLine.view(size: 14, color: .brandYellow)
                        Text(garage.name)
                            .font(CarlibFont.caption(.medium))
                            .foregroundStyle(.carlibDark)
                    }
                }
            }
            .padding(.leading, 14)
            .padding(.trailing, 16)
            .padding(.vertical, 14)
        }
        .background(Color.tileSecondary, in: RoundedRectangle(cornerRadius: 14))
    }

    private var statusColor: Color {
        switch claim.status {
        case .draft: .statusDraft
        case .submitted: .statusSubmitted
        case .matched: .statusMatched
        case .accepted: .statusAccepted
        case .inProgress: .statusInProgress
        case .repairing: .statusRepairing
        case .completed: .statusCompleted
        case .cancelled: .statusCancelled
        case .expired: .statusExpired
        }
    }

    private var accidentIcon: RemixIcon {
        switch claim.accidentType {
        case .collision: .carLine
        case .parking: .parkingBoxLine
        case .vandalism: .alarmWarningLine
        case .weather: .thunderstormsLine
        case .other, .none: .questionLine
        }
    }
}

// MARK: - AccidentType Icon Mapping

extension AccidentType {
    var icon: RemixIcon {
        switch self {
        case .collision: .carLine
        case .parking: .parkingBoxLine
        case .vandalism: .alarmWarningLine
        case .weather: .thunderstormsLine
        case .other: .questionLine
        }
    }
}

#Preview {
    ScrollView {
        VStack(spacing: 12) {
            ForEach(MockData.claims) { claim in
                ClaimCardView(claim: claim)
            }
        }
        .padding(20)
    }
    .background(Color.carlibScreenBg)
}
