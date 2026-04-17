import SwiftUI

/// Reusable garage card — compact (horizontal carousel) and full (vertical list) variants.
struct GarageCardView: View {
    let garage: Garage
    var variant: Variant = .full
    var distance: Double?

    enum Variant {
        case compact
        case full
    }

    var body: some View {
        switch variant {
        case .compact:
            compactView
        case .full:
            fullView
        }
    }

    // MARK: - Compact (horizontal carousel)

    private var compactView: some View {
        CarlibCard(variant: .elevated) {
            VStack(alignment: .leading, spacing: CarlibSpacing.xs) {
                // Photo
                DummyImage(
                    kind: .garage,
                    seed: garage.id.uuidString,
                    pixelWidth: 480,
                    pixelHeight: 270
                )
                .frame(width: 160, height: 90)
                .clipShape(RoundedRectangle(cornerRadius: CarlibRadius.sm))

                Text(garage.name)
                    .font(CarlibFont.bodySmall(.medium))
                    .lineLimit(1)

                HStack(spacing: CarlibSpacing.xxs) {
                    ratingView
                    if let distance {
                        Text("•")
                            .foregroundStyle(.secondary)
                        Text(String(format: "%.1f km", distance))
                            .font(CarlibFont.caption())
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .frame(width: 160)
        }
    }

    // MARK: - Full (vertical list)

    private var fullView: some View {
        CarlibCard(variant: .flat) {
            HStack(spacing: CarlibSpacing.md) {
                // Photo
                DummyImage(
                    kind: .garage,
                    seed: garage.id.uuidString,
                    pixelWidth: 240,
                    pixelHeight: 240
                )
                .frame(width: 80, height: 80)
                .clipShape(RoundedRectangle(cornerRadius: CarlibRadius.sm))

                VStack(alignment: .leading, spacing: CarlibSpacing.xxs) {
                    Text(garage.name)
                        .font(CarlibFont.bodyLarge(.medium))
                        .lineLimit(1)

                    HStack(spacing: CarlibSpacing.xs) {
                        ratingView
                        if let distance {
                            Text("•")
                                .foregroundStyle(.secondary)
                            Text(String(format: "%.1f km", distance))
                                .font(CarlibFont.bodySmall())
                                .foregroundStyle(.secondary)
                        }
                    }

                    // Specialties chips
                    HStack(spacing: CarlibSpacing.xxs) {
                        ForEach(garage.specialties.prefix(3), id: \.self) { specialty in
                            Text(specialty.localizedName)
                                .font(CarlibFont.caption())
                                .padding(.horizontal, CarlibSpacing.xs)
                                .padding(.vertical, 2)
                                .background(Color(.systemGray6), in: Capsule())
                        }
                    }

                    // Availability
                    HStack(spacing: CarlibSpacing.xxs) {
                        Circle()
                            .fill(garage.isAvailable ? Color.statusCompleted : Color.statusCancelled)
                            .frame(width: 8, height: 8)
                        Text(garage.isAvailable ? L10n.GarageCard.available : L10n.GarageCard.unavailable)
                            .font(CarlibFont.caption())
                            .foregroundStyle(.secondary)
                    }
                }

                Spacer(minLength: 0)
            }
        }
    }

    // MARK: - Subviews

    private var ratingView: some View {
        HStack(spacing: 2) {
            RemixIcon.starFill.view(size: 11, color: .brandYellow)
            if let rating = garage.rating {
                Text(String(format: "%.1f", rating))
                    .font(CarlibFont.caption(.medium))
            }
            Text("(\(garage.reviewCount))")
                .font(CarlibFont.caption())
                .foregroundStyle(.secondary)
        }
    }
}

#Preview("Full") {
    ScrollView {
        VStack(spacing: CarlibSpacing.sm) {
            ForEach(MockData.garages) { garage in
                GarageCardView(
                    garage: garage,
                    variant: .full,
                    distance: MockData.distance(for: garage.id)
                )
            }
        }
        .padding()
    }
}

#Preview("Compact") {
    ScrollView(.horizontal) {
        HStack(spacing: CarlibSpacing.sm) {
            ForEach(MockData.garages) { garage in
                GarageCardView(
                    garage: garage,
                    variant: .compact,
                    distance: MockData.distance(for: garage.id)
                )
            }
        }
        .padding()
    }
}
