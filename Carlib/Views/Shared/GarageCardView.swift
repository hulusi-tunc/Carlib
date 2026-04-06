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
                // Photo placeholder
                RoundedRectangle(cornerRadius: CarlibRadius.sm)
                    .fill(Color(.systemGray5))
                    .frame(width: 160, height: 90)
                    .overlay {
                        Image(systemName: "building.2.fill")
                            .font(.title2)
                            .foregroundStyle(.secondary)
                    }

                Text(garage.name)
                    .font(CarlibFont.bodySmall(.semibold))
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
                // Photo placeholder
                RoundedRectangle(cornerRadius: CarlibRadius.sm)
                    .fill(Color(.systemGray5))
                    .frame(width: 80, height: 80)
                    .overlay {
                        Image(systemName: "building.2.fill")
                            .font(.title3)
                            .foregroundStyle(.secondary)
                    }

                VStack(alignment: .leading, spacing: CarlibSpacing.xxs) {
                    Text(garage.name)
                        .font(CarlibFont.bodyLarge(.semibold))
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
            Image(systemName: "star.fill")
                .font(.system(size: 10))
                .foregroundStyle(.brandYellow)
            if let rating = garage.rating {
                Text(String(format: "%.1f", rating))
                    .font(CarlibFont.caption(.semibold))
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
