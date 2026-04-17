import SwiftUI

/// Premium claim detail — hero header + horizontal stepper + clean info cards.
struct DriverClaimDetailView: View {
    let claim: Claim
    @Environment(ClaimStore.self) private var claimStore
    @Environment(\.dismiss) private var dismiss
    @State private var showCancelDialog = false

    private var garage: Garage? {
        MockData.garage(for: claim.assignedGarageId)
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                // ── Hero Header ──
                heroHeader

                VStack(alignment: .leading, spacing: 24) {
                    // ── Horizontal Progress Stepper ──
                    VStack(alignment: .leading, spacing: 12) {
                        Text(verbatim: "TRACKING")
                            .sectionHeaderStyle()

                        StatusTimelineView(claim: claim)
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 24)

                    // ── Vehicle Card ──
                    if let vehicle = claim.vehicleInfo {
                        vehicleCard(vehicle)
                    }

                    // ── Photos ──
                    if !claim.photos.isEmpty {
                        photosSection
                    }

                    // ── Garage Card ──
                    if let garage {
                        garageCard(garage)
                    }

                    // ── Actions ──
                    actionsSection
                }
                .padding(.bottom, 40)
            }
        }
        .background(Color.carlibScreenBg)
        .navigationBarTitleDisplayMode(.inline)
        .toolbarBackground(.hidden, for: .navigationBar)
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

    // MARK: - Hero Header

    private var heroHeader: some View {
        VStack(spacing: 12) {
            // Brand logo or status icon
            if let v = claim.vehicleInfo {
                CarBrandLogo(brand: v.brand, size: 56)
                    .padding(12)
                    .background(
                        Circle()
                            .fill(Color.tileSecondary)
                    )
            } else {
                ZStack {
                    Circle()
                        .fill(statusColor.opacity(0.15))
                        .frame(width: 64, height: 64)
                    statusIcon.view(size: 28, color: statusColor)
                }
            }

            // Status label
            CarlibStatusBadge(claimStatus: claim.status)

            // Vehicle name
            if let v = claim.vehicleInfo {
                Text(verbatim: "\(v.brand) \(v.model)")
                    .font(CarlibFont.title(.bold))
                    .foregroundStyle(.carlibDark)

                Text(verbatim: v.licensePlate)
                    .font(CarlibFont.caption())
                    .foregroundStyle(.carlibSecondary)
            }

            // Accident type
            if let type = claim.accidentType {
                Text(verbatim: type.localizedName)
                    .font(CarlibFont.body())
                    .foregroundStyle(.carlibSecondary)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 16)
        .padding(.bottom, 32)
        .background(
            LinearGradient(
                colors: [statusColor.opacity(0.12), statusColor.opacity(0.04), Color.carlibScreenBg],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea(edges: .top)
        )
    }

    // MARK: - Vehicle Card

    private func vehicleCard(_ vehicle: VehicleInfo) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(verbatim: "VEHICLE")
                .sectionHeaderStyle()

            HStack(spacing: 14) {
                CarBrandLogo(brand: vehicle.brand, size: 36)
                    .frame(width: 44, height: 44)
                    .background(Color.carlibCardBorder, in: Circle())

                VStack(alignment: .leading, spacing: 2) {
                    Text(verbatim: "\(vehicle.brand) \(vehicle.model)")
                        .font(CarlibFont.body(.medium))
                        .foregroundStyle(.carlibDark)
                    HStack(spacing: 8) {
                        Text(verbatim: vehicle.licensePlate)
                            .font(CarlibFont.caption())
                            .foregroundStyle(.carlibSecondary)
                        if let year = vehicle.year {
                            Text(verbatim: "·")
                                .foregroundStyle(.carlibLabel)
                            Text(verbatim: "\(year)")
                                .font(CarlibFont.caption())
                                .foregroundStyle(.carlibSecondary)
                        }
                    }
                }

                Spacer()
            }
            .padding(16)
            .background(Color.tileSecondary, in: RoundedRectangle(cornerRadius: 14))
        }
        .padding(.horizontal, 20)
    }

    // MARK: - Photos

    private var photosSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(verbatim: "PHOTOS")
                .sectionHeaderStyle()
                .padding(.horizontal, 20)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 10) {
                    ForEach(claim.photos) { photo in
                        if let data = photo.imageData, let uiImage = UIImage(data: data) {
                            Image(uiImage: uiImage)
                                .resizable()
                                .scaledToFill()
                                .frame(width: 140, height: 105)
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                        } else {
                            RoundedRectangle(cornerRadius: 12)
                                .fill(Color.tileSecondary)
                                .frame(width: 140, height: 105)
                                .overlay {
                                    VStack(spacing: 4) {
                                        RemixIcon.imageLine.view(size: 24, color: .carlibSecondary)
                                        Text(photo.caption)
                                            .font(CarlibFont.caption())
                                            .foregroundStyle(.carlibSecondary)
                                    }
                                }
                        }
                    }
                }
                .padding(.horizontal, 20)
            }
        }
    }

    // MARK: - Garage Card

    private func garageCard(_ garage: Garage) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(verbatim: "BODY SHOP")
                .sectionHeaderStyle()

            VStack(spacing: 0) {
                // Garage info
                HStack(spacing: 14) {
                    Circle()
                        .fill(Color.tileSecondary)
                        .frame(width: 44, height: 44)
                        .overlay {
                            RemixIcon.mapPinLine.view(size: 20, color: .carlibPrimaryBlue)
                        }

                    VStack(alignment: .leading, spacing: 2) {
                        Text(verbatim: garage.name)
                            .font(CarlibFont.body(.medium))
                            .foregroundStyle(.carlibDark)
                        Text(verbatim: garage.address)
                            .font(CarlibFont.caption())
                            .foregroundStyle(.carlibSecondary)
                    }

                    Spacer()

                    if let rating = garage.rating {
                        HStack(spacing: 2) {
                            RemixIcon.starFill.view(size: 14, color: .brandYellow)
                            Text(String(format: "%.1f", rating))
                                .font(CarlibFont.caption(.medium))
                                .foregroundStyle(.carlibDark)
                        }
                    }
                }
                .padding(16)

                Divider().overlay(Color.carlibCardBorder)

                // Contact row — tappable
                Button {
                    let digits = garage.phone.filter(\.isNumber)
                    if let url = URL(string: "tel://\(digits)") {
                        UIApplication.shared.open(url)
                    }
                } label: {
                    HStack(spacing: 12) {
                        RemixIcon.phoneLine.view(size: 18, color: .carlibPrimaryBlue)
                        Text(verbatim: garage.phone)
                            .font(CarlibFont.body())
                            .foregroundStyle(.carlibDark)
                        Spacer()
                        RemixIcon.arrowRightSLine.view(size: 18, color: .carlibSecondary)
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 14)
                }
            }
            .background(Color.tileSecondary, in: RoundedRectangle(cornerRadius: 14))
        }
        .padding(.horizontal, 20)
    }

    // MARK: - Actions

    private var actionsSection: some View {
        VStack(spacing: 12) {
            if garage != nil {
                CarlibButton(
                    label: L10n.ClaimDetail.actionContact,
                    icon: .phoneFill,
                    variant: .primary
                ) {
                    if let garage {
                        let digits = garage.phone.filter(\.isNumber)
                        if let url = URL(string: "tel://\(digits)") {
                            UIApplication.shared.open(url)
                        }
                    }
                }
            }

            if [.draft, .submitted, .matched, .accepted].contains(claim.status) {
                Button {
                    showCancelDialog = true
                } label: {
                    Text(verbatim: L10n.ClaimDetail.actionCancel)
                        .font(CarlibFont.body())
                        .foregroundStyle(.destructiveRed)
                }
                .padding(.top, 4)
            }
        }
        .padding(.horizontal, 20)
    }

    // MARK: - Helpers

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

    private var statusIcon: RemixIcon {
        switch claim.status {
        case .draft: .draftLine
        case .submitted: .sendPlaneLine
        case .matched: .searchLine
        case .accepted: .checkDoubleLine
        case .inProgress: .carLine
        case .repairing: .wrenchLine
        case .completed: .checkboxCircleLine
        case .cancelled: .closeLine
        case .expired: .timeLine
        }
    }
}

#Preview {
    NavigationStack {
        DriverClaimDetailView(claim: MockData.claims[3])
    }
    .environment(ClaimStore())
}
