import SwiftUI

/// Garage-facing claim detail — accept/decline/status actions are live.
struct GarageClaimDetailView: View {
    let claim: Claim
    @Environment(ClaimStore.self) private var claimStore
    @Environment(\.dismiss) private var dismiss
    @State private var showAcceptDialog = false
    @State private var showStatusDialog = false

    private var isAvailable: Bool {
        [.submitted, .matched].contains(claim.status)
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: CarlibSpacing.sectionSpacing) {
                CarlibStatusBadge(claimStatus: claim.status)
                    .padding(.horizontal, CarlibSpacing.screenHorizontal)

                // Description
                CarlibCard(variant: .flat) {
                    VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
                        Text(verbatim: L10n.GarageClaimDetail.sectionDescription)
                            .font(CarlibFont.headingSmall())
                        if let type = claim.accidentType {
                            HStack(spacing: CarlibSpacing.xs) {
                                type.icon.view(size: 16, color: .brandYellow)
                                Text(type.localizedName)
                                    .font(CarlibFont.bodyMedium(.medium))
                            }
                        }
                        Text(claim.description)
                            .font(CarlibFont.bodyMedium())
                            .foregroundStyle(.secondary)
                    }
                }
                .padding(.horizontal, CarlibSpacing.screenHorizontal)

                // Vehicle
                if let vehicle = claim.vehicleInfo {
                    CarlibCard(variant: .flat) {
                        VStack(alignment: .leading, spacing: CarlibSpacing.xs) {
                            Text(verbatim: L10n.ClaimDetail.sectionVehicle)
                                .font(CarlibFont.headingSmall())
                            infoRow(icon: .carFill, text: "\(vehicle.brand) \(vehicle.model)")
                            infoRow(icon: .hashtag, text: vehicle.licensePlate)
                            if let year = vehicle.year {
                                infoRow(icon: .calendarLine, text: "\(year)")
                            }
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
                                    RoundedRectangle(cornerRadius: CarlibRadius.sm)
                                        .fill(Color.tileSecondary)
                                        .frame(width: 120, height: 90)
                                        .overlay {
                                            VStack(spacing: 4) {
                                                RemixIcon.imageLine.view(size: 18, color: .secondary)
                                                Text(photo.caption)
                                                    .font(CarlibFont.caption())
                                                    .foregroundStyle(.secondary)
                                            }
                                        }
                                }
                            }
                            .padding(.horizontal, CarlibSpacing.screenHorizontal)
                        }
                    }
                }

                // Location
                CarlibCard(variant: .flat) {
                    HStack(spacing: CarlibSpacing.sm) {
                        RemixIcon.mapPinFill.view(size: 20, color: .brandYellow)
                        VStack(alignment: .leading, spacing: 2) {
                            Text(verbatim: L10n.GarageClaimDetail.sectionLocation)
                                .font(CarlibFont.caption(.medium))
                                .foregroundStyle(.secondary)
                            Text("Paris 11e — 48.856, 2.352")
                                .font(CarlibFont.bodyMedium())
                        }
                    }
                }
                .padding(.horizontal, CarlibSpacing.screenHorizontal)

                // Actions
                if isAvailable {
                    VStack(spacing: CarlibSpacing.sm) {
                        CarlibButton(label: L10n.GarageClaimDetail.actionAccept, icon: .checkboxCircleFill, variant: .primary) {
                            showAcceptDialog = true
                        }
                        CarlibButton(label: L10n.GarageClaimDetail.actionRefuse, variant: .ghost) {
                            claimStore.declineClaim(id: claim.id)
                            dismiss()
                        }
                    }
                    .padding(.horizontal, CarlibSpacing.screenHorizontal)
                } else {
                    CarlibButton(label: L10n.GarageClaimDetail.actionUpdateStatus, icon: .refreshLine, variant: .secondary) {
                        showStatusDialog = true
                    }
                    .padding(.horizontal, CarlibSpacing.screenHorizontal)
                }
            }
            .padding(.top, CarlibSpacing.md)
            .padding(.bottom, CarlibSpacing.xxl)
        }
        .navigationTitle(Text(verbatim: L10n.GarageClaimDetail.title))
        .navigationBarTitleDisplayMode(.inline)
        .confirmationDialog(
            Text(verbatim: L10n.GarageClaimDetail.acceptTitle),
            isPresented: $showAcceptDialog
        ) {
            Button(L10n.GarageClaimDetail.acceptConfirm) {
                claimStore.acceptClaim(id: claim.id, garageId: MockData.garages[0].id)
                dismiss()
            }
            Button(L10n.Common.cancel, role: .cancel) {}
        } message: {
            Text(verbatim: L10n.GarageClaimDetail.acceptMessage)
        }
        .confirmationDialog(
            Text(verbatim: L10n.GarageClaimDetail.statusTitle),
            isPresented: $showStatusDialog
        ) {
            ForEach(RepairStatus.allCases, id: \.self) { status in
                Button(status.localizedName) {
                    claimStore.updateRepairStatus(id: claim.id, to: status)
                    dismiss()
                }
            }
            Button(L10n.Common.cancel, role: .cancel) {}
        }
    }

    private func infoRow(icon: RemixIcon, text: String) -> some View {
        HStack(spacing: CarlibSpacing.xs) {
            icon.view(size: 14, color: .secondary)
                .frame(width: 20)
            Text(text)
                .font(CarlibFont.bodySmall())
        }
    }
}

#Preview {
    NavigationStack {
        GarageClaimDetailView(claim: MockData.claims[1])
    }
    .environment(ClaimStore())
}
