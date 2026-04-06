import SwiftUI

/// Detail view for a single driver claim with working actions.
struct DriverClaimDetailView: View {
    let claim: Claim
    @Environment(ClaimStore.self) private var claimStore
    @Environment(\.dismiss) private var dismiss
    @State private var showCancelDialog = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: CarlibSpacing.sectionSpacing) {
                CarlibStatusBadge(claimStatus: claim.status)
                    .padding(.horizontal, CarlibSpacing.screenHorizontal)

                // Timeline
                CarlibCard(variant: .flat) {
                    VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
                        Text(verbatim: L10n.ClaimDetail.sectionTimeline)
                            .font(CarlibFont.headingSmall())
                        StatusTimelineView(claim: claim)
                    }
                }
                .padding(.horizontal, CarlibSpacing.screenHorizontal)

                // Vehicle info
                if let vehicle = claim.vehicleInfo {
                    CarlibCard(variant: .flat) {
                        VStack(alignment: .leading, spacing: CarlibSpacing.xs) {
                            Text(verbatim: L10n.ClaimDetail.sectionVehicle)
                                .font(CarlibFont.headingSmall())
                            infoRow(icon: "car.fill", text: "\(vehicle.brand) \(vehicle.model)")
                            infoRow(icon: "number", text: vehicle.licensePlate)
                            if let year = vehicle.year {
                                infoRow(icon: "calendar", text: "\(year)")
                            }
                            infoRow(icon: "paintpalette.fill", text: vehicle.color)
                        }
                    }
                    .padding(.horizontal, CarlibSpacing.screenHorizontal)
                }

                // Photos
                if !claim.photos.isEmpty {
                    VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
                        CarlibSectionHeader(title: L10n.ClaimDetail.sectionPhotos)
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: CarlibSpacing.sm) {
                                ForEach(claim.photos) { photo in
                                    if let data = photo.imageData, let uiImage = UIImage(data: data) {
                                        Image(uiImage: uiImage)
                                            .resizable()
                                            .scaledToFill()
                                            .frame(width: 120, height: 90)
                                            .clipShape(RoundedRectangle(cornerRadius: CarlibRadius.sm))
                                    } else {
                                        RoundedRectangle(cornerRadius: CarlibRadius.sm)
                                            .fill(Color.tileSecondary)
                                            .frame(width: 120, height: 90)
                                            .overlay {
                                                VStack(spacing: 4) {
                                                    Image(systemName: "photo")
                                                        .foregroundStyle(.secondary)
                                                    Text(photo.caption)
                                                        .font(CarlibFont.caption())
                                                        .foregroundStyle(.secondary)
                                                }
                                            }
                                    }
                                }
                            }
                            .padding(.horizontal, CarlibSpacing.screenHorizontal)
                        }
                    }
                }

                // Assigned garage
                if let garage = MockData.garage(for: claim.assignedGarageId) {
                    CarlibCard(variant: .elevated) {
                        VStack(alignment: .leading, spacing: CarlibSpacing.xs) {
                            Text(verbatim: L10n.ClaimDetail.sectionGarage)
                                .font(CarlibFont.headingSmall())
                            infoRow(icon: "building.2.fill", text: garage.name)
                            infoRow(icon: "mappin", text: garage.address)
                            infoRow(icon: "phone.fill", text: garage.phone)
                        }
                    }
                    .padding(.horizontal, CarlibSpacing.screenHorizontal)

                    CarlibButton(
                        label: L10n.ClaimDetail.actionContact,
                        icon: "phone.fill",
                        variant: .ghost
                    ) {
                        let digits = garage.phone.filter(\.isNumber)
                        if let url = URL(string: "tel://\(digits)") {
                            UIApplication.shared.open(url)
                        }
                    }
                    .padding(.horizontal, CarlibSpacing.screenHorizontal)
                }

                // Cancel action
                if [.draft, .submitted, .matched, .accepted].contains(claim.status) {
                    CarlibButton(
                        label: L10n.ClaimDetail.actionCancel,
                        variant: .destructive
                    ) {
                        showCancelDialog = true
                    }
                    .padding(.horizontal, CarlibSpacing.screenHorizontal)
                }
            }
            .padding(.top, CarlibSpacing.md)
            .padding(.bottom, CarlibSpacing.xxl)
        }
        .navigationTitle(Text(verbatim: L10n.ClaimDetail.title))
        .navigationBarTitleDisplayMode(.inline)
        .confirmationDialog(
            Text(verbatim: L10n.ClaimDetail.cancelTitle),
            isPresented: $showCancelDialog
        ) {
            Button(L10n.ClaimDetail.cancelConfirm, role: .destructive) {
                claimStore.cancelClaim(id: claim.id)
                dismiss()
            }
            Button(L10n.Common.cancel, role: .cancel) {}
        } message: {
            Text(verbatim: L10n.ClaimDetail.cancelMessage)
        }
    }

    private func infoRow(icon: String, text: String) -> some View {
        HStack(spacing: CarlibSpacing.xs) {
            Image(systemName: icon)
                .font(.caption)
                .foregroundStyle(.secondary)
                .frame(width: 20)
            Text(text)
                .font(CarlibFont.bodySmall())
        }
    }
}

#Preview {
    NavigationStack {
        DriverClaimDetailView(claim: MockData.claims[3])
    }
    .environment(ClaimStore())
}
