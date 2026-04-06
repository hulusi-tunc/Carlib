import SwiftUI

/// Reusable claim row card — used in both driver and garage claim lists.
struct ClaimCardView: View {
    let claim: Claim
    var showGarage: Bool = true

    var body: some View {
        CarlibCard(variant: .flat) {
            VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
                // Top row: status + date
                HStack {
                    CarlibStatusBadge(claimStatus: claim.status)
                    Spacer()
                    Text(claim.createdAt.relativeFormatted)
                        .font(CarlibFont.caption())
                        .foregroundStyle(.secondary)
                }

                // Accident type + description
                HStack(spacing: CarlibSpacing.xs) {
                    Image(systemName: claim.accidentType?.iconName ?? "questionmark.circle")
                        .font(.title3)
                        .foregroundStyle(.brandYellow)
                        .frame(width: 32, height: 32)

                    VStack(alignment: .leading, spacing: 2) {
                        Text(claim.accidentType?.localizedName ?? "—")
                            .font(CarlibFont.bodyMedium(.semibold))
                        Text(claim.description)
                            .font(CarlibFont.bodySmall())
                            .foregroundStyle(.secondary)
                            .lineLimit(2)
                    }
                }

                // Vehicle info
                if let vehicle = claim.vehicleInfo {
                    HStack(spacing: CarlibSpacing.xxs) {
                        Image(systemName: "car.fill")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                        Text("\(vehicle.brand) \(vehicle.model) — \(vehicle.licensePlate)")
                            .font(CarlibFont.caption())
                            .foregroundStyle(.secondary)
                    }
                }

                // Assigned garage
                if showGarage, let garage = MockData.garage(for: claim.assignedGarageId) {
                    HStack(spacing: CarlibSpacing.xxs) {
                        Image(systemName: "building.2.fill")
                            .font(.caption)
                            .foregroundStyle(.brandYellow)
                        Text(garage.name)
                            .font(CarlibFont.caption(.medium))
                    }
                }
            }
        }
    }
}

// MARK: - AccidentType Icon Mapping

extension AccidentType {
    var iconName: String {
        switch self {
        case .collision: "car.2.fill"
        case .parking: "parkingsign.circle.fill"
        case .vandalism: "exclamationmark.triangle.fill"
        case .weather: "cloud.bolt.rain.fill"
        case .other: "questionmark.circle.fill"
        }
    }
}

#Preview {
    ScrollView {
        VStack(spacing: CarlibSpacing.sm) {
            ForEach(MockData.claims) { claim in
                ClaimCardView(claim: claim)
            }
        }
        .padding()
    }
}
