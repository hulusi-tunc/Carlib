import SwiftUI

/// Garage-facing claim detail — hero with status + primary action on top,
/// timeline stepper, description, photos, vehicle, location.
/// Accept/Decline or Update Status always sits next to the status badge.
struct GarageClaimDetailView: View {
    let claim: Claim
    @Environment(ClaimStore.self) private var claimStore
    @Environment(\.dismiss) private var dismiss
    @State private var showStatusSheet = false
    @State private var lightboxIndex: LightboxIndex?

    private var isAvailable: Bool {
        [.submitted, .matched].contains(claim.status)
    }

    private var isActiveCase: Bool {
        [.accepted, .inProgress, .repairing].contains(claim.status)
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                heroHeader

                VStack(alignment: .leading, spacing: 24) {
                    if claim.status != .draft {
                        timelineSection
                    }

                    descriptionSection

                    if !claim.photos.isEmpty {
                        photosSection
                    }

                    if let vehicle = claim.vehicleInfo {
                        vehicleSection(vehicle)
                    }

                    locationSection
                }
                .padding(.top, 24)
                .padding(.bottom, 40)
            }
        }
        .background(Color.carlibScreenBg)
        .navigationBarTitleDisplayMode(.inline)
        .toolbarBackground(.hidden, for: .navigationBar)
        .sheet(isPresented: $showStatusSheet) {
            RepairStatusSheet(currentStatus: claim.repairStatus) { newStatus in
                claimStore.updateRepairStatus(id: claim.id, to: newStatus)
            }
        }
        .fullScreenCover(item: $lightboxIndex) { item in
            PhotoLightboxView(photos: claim.photos, initialIndex: item.value)
        }
    }

    // MARK: - Hero

    private var heroHeader: some View {
        VStack(spacing: 16) {
            if let v = claim.vehicleInfo {
                CarBrandLogo(brand: v.brand, size: 52)
                    .padding(12)
                    .background(Circle().fill(Color.tileSecondary))
            } else {
                ZStack {
                    Circle()
                        .fill(statusColor.opacity(0.15))
                        .frame(width: 64, height: 64)
                    accidentIcon.view(size: 28, color: statusColor)
                }
            }

            VStack(spacing: 6) {
                CarlibStatusBadge(claimStatus: claim.status)

                if let v = claim.vehicleInfo {
                    Text(verbatim: "\(v.brand) \(v.model)")
                        .font(.custom("Aeonik-Medium", size: 26))
                        .foregroundStyle(.carlibDark)
                    Text(verbatim: v.licensePlate)
                        .font(CarlibFont.footnote())
                        .foregroundStyle(.carlibSecondary)
                }

                if let type = claim.accidentType {
                    HStack(spacing: 6) {
                        type.icon.view(size: 14, color: .carlibSecondary)
                        Text(verbatim: type.localizedName)
                            .font(CarlibFont.callout())
                            .foregroundStyle(.carlibSecondary)
                    }
                    .padding(.top, 2)
                }
            }

            primaryActionBlock
                .padding(.top, 4)
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 12)
        .padding(.bottom, 24)
        .padding(.horizontal, 20)
        .background(
            LinearGradient(
                colors: [
                    statusColor.opacity(0.14),
                    statusColor.opacity(0.04),
                    Color.carlibScreenBg
                ],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea(edges: .top)
        )
    }

    @ViewBuilder
    private var primaryActionBlock: some View {
        if isAvailable {
            HStack(spacing: 10) {
                Button {
                    UISelectionFeedbackGenerator().selectionChanged()
                    claimStore.declineClaim(id: claim.id)
                    dismiss()
                } label: {
                    Text(verbatim: L10n.GarageClaimDetail.actionRefuse)
                        .font(CarlibFont.body(.medium))
                        .foregroundStyle(.carlibDark)
                        .frame(maxWidth: .infinity)
                        .frame(height: 52)
                        .background(Color.tileSecondary, in: Capsule())
                }
                .buttonStyle(.pressable(scale: 0.97, haptic: .light))

                Button {
                    UINotificationFeedbackGenerator().notificationOccurred(.success)
                    claimStore.acceptClaim(id: claim.id, garageId: MockData.garages[0].id)
                    dismiss()
                } label: {
                    HStack(spacing: 8) {
                        Text(verbatim: L10n.GarageClaimDetail.actionAccept)
                            .font(CarlibFont.body(.medium))
                        RemixIcon.checkLine.view(size: 16, color: .black)
                    }
                    .foregroundStyle(.black)
                    .frame(maxWidth: .infinity)
                    .frame(height: 52)
                    .background(Color.brandYellow, in: Capsule())
                }
                .buttonStyle(.pressable(scale: 0.97, haptic: .medium))
            }
        } else if isActiveCase {
            Button {
                showStatusSheet = true
            } label: {
                HStack(spacing: 12) {
                    RemixIcon.toolsFill.view(size: 16, color: .brandYellow)
                        .frame(width: 32, height: 32)
                        .background(Color.brandYellow.opacity(0.14), in: Circle())

                    VStack(alignment: .leading, spacing: 0) {
                        Text(verbatim: "Current stage")
                            .font(CarlibFont.caption())
                            .foregroundStyle(.carlibSecondary)
                        Text(verbatim: claim.repairStatus?.localizedName ?? "Not set")
                            .font(CarlibFont.body(.medium))
                            .foregroundStyle(.carlibDark)
                    }

                    Spacer(minLength: 8)

                    HStack(spacing: 4) {
                        Text(verbatim: "Update")
                            .font(CarlibFont.callout(.medium))
                        RemixIcon.arrowRightLine.view(size: 14, color: .black)
                    }
                    .foregroundStyle(.black)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(Color.brandYellow, in: Capsule())
                }
                .padding(10)
                .background(Color.tileSecondary, in: RoundedRectangle(cornerRadius: 16))
                .contentShape(RoundedRectangle(cornerRadius: 16))
            }
            .buttonStyle(.pressable(scale: 0.98, haptic: .light))
        }
    }

    // MARK: - Timeline

    private var timelineSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(verbatim: "TRACKING")
                .font(CarlibFont.caption(.medium))
                .tracking(1.2)
                .foregroundStyle(.carlibSecondary)

            StatusTimelineView(claim: claim)
        }
        .padding(.horizontal, 20)
    }

    // MARK: - Description

    private var descriptionSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(verbatim: "DESCRIPTION")
                .font(CarlibFont.caption(.medium))
                .tracking(1.2)
                .foregroundStyle(.carlibSecondary)

            VStack(alignment: .leading, spacing: 10) {
                if let type = claim.accidentType {
                    HStack(spacing: 8) {
                        type.icon.view(size: 16, color: .brandYellow)
                        Text(type.localizedName)
                            .font(CarlibFont.body(.medium))
                            .foregroundStyle(.carlibDark)
                    }
                }
                Text(claim.description)
                    .font(CarlibFont.body())
                    .foregroundStyle(.carlibDark)
                    .fixedSize(horizontal: false, vertical: true)

                HStack(spacing: 6) {
                    RemixIcon.timeLine.view(size: 12, color: .carlibSecondary)
                    Text(claim.createdAt.shortFormatted)
                        .font(CarlibFont.caption())
                        .foregroundStyle(.carlibSecondary)
                }
                .padding(.top, 2)
            }
            .padding(14)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.tileSecondary, in: RoundedRectangle(cornerRadius: 14))
        }
        .padding(.horizontal, 20)
    }

    // MARK: - Photos

    private var photosSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text(verbatim: "PHOTOS")
                    .font(CarlibFont.caption(.medium))
                    .tracking(1.2)
                    .foregroundStyle(.carlibSecondary)
                Spacer()
                Text(verbatim: "\(claim.photos.count)")
                    .font(CarlibFont.caption(.medium))
                    .foregroundStyle(.carlibSecondary)
            }
            .padding(.horizontal, 20)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 10) {
                    ForEach(Array(claim.photos.enumerated()), id: \.element.id) { index, photo in
                        Button {
                            lightboxIndex = LightboxIndex(value: index)
                        } label: {
                            photoTile(for: photo)
                        }
                        .buttonStyle(.pressable(scale: 0.96, haptic: .light))
                    }
                }
                .padding(.horizontal, 20)
            }
        }
    }

    @ViewBuilder
    private func photoTile(for photo: PhotoAttachment) -> some View {
        let shape = RoundedRectangle(cornerRadius: 12)
        ZStack(alignment: .bottomLeading) {
            if let data = photo.imageData, let image = UIImage(data: data) {
                Image(uiImage: image).resizable().aspectRatio(contentMode: .fill)
            } else {
                AsyncImage(
                    url: DummyImage.claimPhotoURL(photoId: photo.id, pixelWidth: 600, pixelHeight: 450),
                    transaction: Transaction(animation: .easeOut(duration: 0.25))
                ) { phase in
                    switch phase {
                    case .success(let image):
                        image.resizable().aspectRatio(contentMode: .fill)
                    case .empty, .failure:
                        Color.tileSecondary.overlay {
                            RemixIcon.imageLine.view(size: 22, color: .carlibLabel.opacity(0.6))
                        }
                    @unknown default:
                        Color.tileSecondary
                    }
                }
            }

            if !photo.caption.isEmpty {
                Text(photo.caption)
                    .font(CarlibFont.caption(.medium))
                    .foregroundStyle(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(.black.opacity(0.55), in: Capsule())
                    .padding(10)
            }
        }
        .frame(width: 180, height: 135)
        .clipShape(shape)
        .contentShape(shape)
    }

    // MARK: - Vehicle

    private func vehicleSection(_ vehicle: VehicleInfo) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(verbatim: "VEHICLE")
                .font(CarlibFont.caption(.medium))
                .tracking(1.2)
                .foregroundStyle(.carlibSecondary)

            HStack(spacing: 14) {
                CarBrandLogo(brand: vehicle.brand, size: 32)
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
                            Text(verbatim: "·").foregroundStyle(.carlibLabel)
                            Text(verbatim: "\(year)")
                                .font(CarlibFont.caption())
                                .foregroundStyle(.carlibSecondary)
                        }
                    }
                }

                Spacer()
            }
            .padding(14)
            .background(Color.tileSecondary, in: RoundedRectangle(cornerRadius: 14))
        }
        .padding(.horizontal, 20)
    }

    // MARK: - Location

    private var locationSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(verbatim: "LOCATION")
                .font(CarlibFont.caption(.medium))
                .tracking(1.2)
                .foregroundStyle(.carlibSecondary)

            HStack(spacing: 12) {
                RemixIcon.mapPinFill.view(size: 18, color: .brandYellow)
                    .frame(width: 36, height: 36)
                    .background(Color.brandYellow.opacity(0.14), in: Circle())

                VStack(alignment: .leading, spacing: 2) {
                    Text(verbatim: "Paris 11e")
                        .font(CarlibFont.body(.medium))
                        .foregroundStyle(.carlibDark)
                    Text(verbatim: "48.856, 2.352")
                        .font(CarlibFont.caption())
                        .foregroundStyle(.carlibSecondary)
                }

                Spacer()
            }
            .padding(14)
            .background(Color.tileSecondary, in: RoundedRectangle(cornerRadius: 14))
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

    private var accidentIcon: RemixIcon {
        switch claim.accidentType {
        case .collision: .carLine
        case .parking: .parkingBoxLine
        case .vandalism: .alarmWarningLine
        case .weather: .thunderstormsLine
        case .other, .none: .questionLine
        }
    }

    private struct LightboxIndex: Identifiable {
        let value: Int
        var id: Int { value }
    }
}

#Preview {
    NavigationStack {
        GarageClaimDetailView(claim: MockData.claims[1])
    }
    .environment(ClaimStore())
}
