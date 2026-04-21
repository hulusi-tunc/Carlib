import SwiftUI

/// Premium claim row card — left status color bar + better hierarchy + Remix Icons.
/// When `enablePhotoLightbox` is on, tapping a thumbnail opens a fullscreen
/// viewer and long-press reveals a context-menu preview — without stealing
/// the surrounding row tap for navigation.
struct ClaimCardView: View {
    let claim: Claim
    var showGarage: Bool = true
    var enablePhotoLightbox: Bool = false
    var actions: Actions = .none

    enum Actions {
        case none
        /// Available request — quick accept/decline inline.
        case request(accept: () -> Void, decline: () -> Void)
        /// Active case — shows current repair stage + tap to update.
        case inProgress(currentStatus: RepairStatus?, update: () -> Void)
    }

    @State private var lightboxIndex: LightboxIndex?

    var body: some View {
        HStack(spacing: 0) {
            Rectangle()
                .fill(statusColor)
                .frame(width: 4)

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

                if !claim.photos.isEmpty {
                    photoStrip
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

                actionsRow
            }
            .padding(.leading, 14)
            .padding(.trailing, 16)
            .padding(.vertical, 14)
        }
        .background(Color.tileSecondary)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .fullScreenCover(item: $lightboxIndex) { item in
            PhotoLightboxView(photos: claim.photos, initialIndex: item.value)
        }
    }

    @ViewBuilder
    private var actionsRow: some View {
        switch actions {
        case .none:
            EmptyView()

        case let .request(accept, decline):
            VStack(spacing: 10) {
                Divider().overlay(Color.carlibCardBorder)
                HStack(spacing: 8) {
                    Button {
                        UISelectionFeedbackGenerator().selectionChanged()
                        decline()
                    } label: {
                        Text(verbatim: "Decline")
                            .font(CarlibFont.callout(.medium))
                            .foregroundStyle(.carlibDark)
                            .frame(maxWidth: .infinity)
                            .frame(height: 40)
                            .background(Color.carlibScreenBg, in: Capsule())
                    }
                    .buttonStyle(.pressable(scale: 0.97, haptic: .light))

                    Button {
                        UINotificationFeedbackGenerator().notificationOccurred(.success)
                        accept()
                    } label: {
                        HStack(spacing: 6) {
                            Text(verbatim: "Accept")
                                .font(CarlibFont.callout(.medium))
                            RemixIcon.checkLine.view(size: 14, color: .black)
                        }
                        .foregroundStyle(.black)
                        .frame(maxWidth: .infinity)
                        .frame(height: 40)
                        .background(Color.brandYellow, in: Capsule())
                    }
                    .buttonStyle(.pressable(scale: 0.97, haptic: .medium))
                }
            }
            .padding(.top, 4)

        case let .inProgress(currentStatus, update):
            VStack(spacing: 10) {
                Divider().overlay(Color.carlibCardBorder)
                Button(action: update) {
                    HStack(spacing: 10) {
                        RemixIcon.toolsFill.view(size: 14, color: .brandYellow)
                            .frame(width: 28, height: 28)
                            .background(Color.brandYellow.opacity(0.14), in: Circle())

                        VStack(alignment: .leading, spacing: 0) {
                            Text(verbatim: "Current stage")
                                .font(CarlibFont.caption())
                                .foregroundStyle(.carlibSecondary)
                            Text(verbatim: currentStatus?.localizedName ?? "Not set")
                                .font(CarlibFont.callout(.medium))
                                .foregroundStyle(.carlibDark)
                        }

                        Spacer(minLength: 8)

                        HStack(spacing: 4) {
                            Text(verbatim: "Update")
                                .font(CarlibFont.caption(.medium))
                            RemixIcon.arrowRightLine.view(size: 12, color: .carlibDark)
                        }
                        .foregroundStyle(.carlibDark)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Color.carlibScreenBg, in: Capsule())
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 8)
                    .background(Color.carlibScreenBg.opacity(0.6), in: RoundedRectangle(cornerRadius: 10))
                    .contentShape(RoundedRectangle(cornerRadius: 10))
                }
                .buttonStyle(.pressable(scale: 0.98, haptic: .light))
            }
            .padding(.top, 4)
        }
    }

    private var photoStrip: some View {
        let visible = Array(claim.photos.prefix(3))
        let overflow = max(claim.photos.count - visible.count, 0)
        return HStack(spacing: 6) {
            ForEach(Array(visible.enumerated()), id: \.element.id) { index, photo in
                thumbnailButton(for: photo, index: index)
            }
            if overflow > 0 {
                overflowChip(count: overflow, startIndex: visible.count)
            }
            Spacer(minLength: 0)
        }
    }

    @ViewBuilder
    private func thumbnailButton(for photo: PhotoAttachment, index: Int) -> some View {
        if enablePhotoLightbox {
            Button {
                lightboxIndex = LightboxIndex(value: index)
            } label: {
                photoThumb(for: photo)
            }
            .buttonStyle(.pressable(scale: 0.94, haptic: .light))
            .contextMenu {
                Button {
                    lightboxIndex = LightboxIndex(value: index)
                } label: {
                    Label("Open photo", systemImage: "arrow.up.left.and.arrow.down.right")
                }
            } preview: {
                photoPreview(for: photo)
            }
        } else {
            photoThumb(for: photo)
        }
    }

    @ViewBuilder
    private func overflowChip(count: Int, startIndex: Int) -> some View {
        let chip = Text(verbatim: "+\(count)")
            .font(CarlibFont.caption(.medium))
            .foregroundStyle(.carlibDark)
            .frame(width: 56, height: 56)
            .background(Color.carlibScreenBg, in: RoundedRectangle(cornerRadius: 10))

        if enablePhotoLightbox {
            Button {
                lightboxIndex = LightboxIndex(value: startIndex)
            } label: {
                chip
            }
            .buttonStyle(.pressable(scale: 0.94, haptic: .light))
        } else {
            chip
        }
    }

    @ViewBuilder
    private func photoThumb(for photo: PhotoAttachment) -> some View {
        let shape = RoundedRectangle(cornerRadius: 10)
        ZStack {
            if let data = photo.imageData, let image = UIImage(data: data) {
                Image(uiImage: image)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } else {
                AsyncImage(
                    url: URL(string: "https://picsum.photos/seed/\(photo.id.uuidString)/200/200"),
                    transaction: Transaction(animation: .easeOut(duration: 0.2))
                ) { phase in
                    switch phase {
                    case .success(let image):
                        image.resizable().aspectRatio(contentMode: .fill)
                    case .empty, .failure:
                        Color.carlibScreenBg.overlay {
                            RemixIcon.imageLine.view(size: 16, color: .carlibLabel.opacity(0.6))
                        }
                    @unknown default:
                        Color.carlibScreenBg
                    }
                }
            }
        }
        .frame(width: 56, height: 56)
        .clipShape(shape)
        .contentShape(shape)
    }

    @ViewBuilder
    private func photoPreview(for photo: PhotoAttachment) -> some View {
        Group {
            if let data = photo.imageData, let image = UIImage(data: data) {
                Image(uiImage: image)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
            } else {
                AsyncImage(
                    url: URL(string: "https://picsum.photos/seed/\(photo.id.uuidString)/800/800")
                ) { phase in
                    switch phase {
                    case .success(let image):
                        image.resizable().aspectRatio(contentMode: .fit)
                    case .empty:
                        Color.tileSecondary.overlay { ProgressView() }
                    case .failure:
                        Color.tileSecondary.overlay {
                            RemixIcon.imageLine.view(size: 28, color: .carlibLabel.opacity(0.6))
                        }
                    @unknown default:
                        Color.tileSecondary
                    }
                }
            }
        }
        .frame(width: 320, height: 320)
    }

    private struct LightboxIndex: Identifiable {
        let value: Int
        var id: Int { value }
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
