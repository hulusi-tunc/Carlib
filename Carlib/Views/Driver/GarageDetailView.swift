import SwiftUI

/// Driver-facing garage detail/profile with booking.
struct GarageDetailView: View {
    let garage: Garage
    @Environment(ClaimStore.self) private var claimStore
    @State private var showBookingSheet = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: CarlibSpacing.sectionSpacing) {
                // Header
                VStack(alignment: .leading, spacing: CarlibSpacing.xs) {
                    Text(garage.name)
                        .font(CarlibFont.headingLarge())

                    HStack(spacing: CarlibSpacing.sm) {
                        HStack(spacing: 4) {
                            Image(systemName: "star.fill")
                                .foregroundStyle(.brandYellow)
                            if let rating = garage.rating {
                                Text(String(format: "%.1f", rating))
                                    .font(CarlibFont.bodyMedium(.semibold))
                            }
                            Text("(\(garage.reviewCount) \(L10n.GarageDetail.reviews))")
                                .font(CarlibFont.bodySmall())
                                .foregroundStyle(.secondary)
                        }

                        Text("•")
                            .foregroundStyle(.secondary)

                        Text(String(format: "%.1f km", MockData.distance(for: garage.id)))
                            .font(CarlibFont.bodySmall())
                            .foregroundStyle(.secondary)
                    }
                }
                .padding(.horizontal, CarlibSpacing.screenHorizontal)

                // Photos carousel placeholder
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: CarlibSpacing.sm) {
                        ForEach(0..<3, id: \.self) { _ in
                            RoundedRectangle(cornerRadius: CarlibRadius.md)
                                .fill(Color.tileSecondary)
                                .frame(width: 240, height: 160)
                                .overlay {
                                    Image(systemName: "building.2.fill")
                                        .font(.largeTitle)
                                        .foregroundStyle(.carlibSecondary)
                                }
                        }
                    }
                    .padding(.horizontal, CarlibSpacing.screenHorizontal)
                }

                // Info
                CarlibCard(variant: .flat) {
                    VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
                        infoRow(icon: "mappin.circle.fill", text: garage.address)
                        Divider()
                        infoRow(icon: "phone.circle.fill", text: garage.phone)
                        Divider()
                        infoRow(icon: "location.circle.fill", text: L10n.GarageDetail.coverage(Int(garage.coverageRadiusKm)))
                    }
                }
                .padding(.horizontal, CarlibSpacing.screenHorizontal)

                // Specialties
                VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
                    Text(verbatim: L10n.GarageDetail.sectionSpecialties)
                        .font(CarlibFont.headingSmall())
                        .padding(.horizontal, CarlibSpacing.screenHorizontal)

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: CarlibSpacing.xs) {
                            ForEach(garage.specialties, id: \.self) { specialty in
                                Text(specialty.localizedName)
                                    .font(CarlibFont.bodySmall(.medium))
                                    .padding(.horizontal, CarlibSpacing.sm)
                                    .padding(.vertical, CarlibSpacing.xs)
                                    .background(Color.brandYellowLight, in: Capsule())
                            }
                        }
                        .padding(.horizontal, CarlibSpacing.screenHorizontal)
                    }
                }

                // Available slots preview
                VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
                    Text(verbatim: L10n.GarageDetail.sectionSlots)
                        .font(CarlibFont.headingSmall())
                        .padding(.horizontal, CarlibSpacing.screenHorizontal)

                    let slots = claimStore.availableSlots(for: garage.id).prefix(4)
                    if slots.isEmpty {
                        Text(verbatim: L10n.Booking.noSlots)
                            .font(CarlibFont.bodySmall())
                            .foregroundStyle(.carlibSecondary)
                            .padding(.horizontal, CarlibSpacing.screenHorizontal)
                    } else {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: CarlibSpacing.xs) {
                                ForEach(Array(slots)) { slot in
                                    VStack(spacing: CarlibSpacing.xxs) {
                                        Text(slot.date.shortFormatted)
                                            .font(CarlibFont.caption(.medium))
                                        Text("\(slot.startTime.timeFormatted) — \(slot.endTime.timeFormatted)")
                                            .font(CarlibFont.bodySmall(.semibold))
                                    }
                                    .padding(.horizontal, CarlibSpacing.sm)
                                    .padding(.vertical, CarlibSpacing.xs)
                                    .background(Color.tileSecondary, in: RoundedRectangle(cornerRadius: CarlibRadius.sm))
                                }
                            }
                            .padding(.horizontal, CarlibSpacing.screenHorizontal)
                        }
                    }
                }

                // CTA — Book Appointment
                CarlibButton(
                    label: L10n.GarageDetail.ctaBook,
                    icon: "calendar.badge.plus",
                    variant: .primary
                ) {
                    showBookingSheet = true
                }
                .padding(.horizontal, CarlibSpacing.screenHorizontal)
            }
            .padding(.top, CarlibSpacing.md)
            .padding(.bottom, CarlibSpacing.xxl)
        }
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showBookingSheet) {
            BookingFlowView(garage: garage)
                .presentationDetents([.large])
        }
    }

    private func infoRow(icon: String, text: String) -> some View {
        HStack(spacing: CarlibSpacing.sm) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundStyle(.brandYellow)
                .frame(width: 28)
            Text(text)
                .font(CarlibFont.bodyMedium())
        }
    }
}

#Preview {
    NavigationStack {
        GarageDetailView(garage: MockData.garages[0])
    }
    .environment(ClaimStore())
}
