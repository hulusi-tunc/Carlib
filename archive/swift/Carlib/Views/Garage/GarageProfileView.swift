import SwiftUI

/// Garage profile — rebuilt to feel like "this is my shop", not a settings page.
/// Hero card up top, tappable contact rows, specialty chips, a photo gallery,
/// and a completeness nudge so owners keep the profile sharp.
struct GarageProfileView: View {
    @Environment(AppState.self) private var appState
    @Environment(ClaimStore.self) private var claimStore
    @State private var showEditSheet = false
    private let garageId = MockData.garages[0].id

    private var garage: Garage {
        claimStore.garage(id: garageId) ?? MockData.garages[0]
    }

    private var completedRepairs: Int {
        claimStore.claims.filter {
            $0.assignedGarageId == garage.id && $0.status == .completed
        }.count
    }

    private var yearsActive: Int {
        MockData.garageYearsActive[garage.id] ?? 1
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    heroCard
                    completenessStrip
                    quickStats
                    contactSection
                    specialtiesSection
                    coverageSection
                    photosSection
                    settingsFooter
                }
                .padding(.horizontal, 20)
                .padding(.top, 12)
                .padding(.bottom, 40)
            }
            .background(Color.carlibScreenBg)
            .navigationTitle(Text(verbatim: L10n.GarageProfile.title))
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showEditSheet = true
                    } label: {
                        Text(verbatim: "Edit")
                            .font(CarlibFont.body(.medium))
                    }
                }
            }
            .sheet(isPresented: $showEditSheet) {
                GarageProfileEditView(garageId: garage.id)
            }
        }
    }

    // MARK: - Hero

    /// Full-bleed cover with the shop name + availability chip. Feels like
    /// the owner is looking at their own listing from a driver's POV.
    private var heroCard: some View {
        ZStack(alignment: .bottomLeading) {
            DummyImage(
                kind: .garage,
                seed: garage.id.uuidString,
                pixelWidth: 800,
                pixelHeight: 480
            )
            .frame(height: 180)
            .frame(maxWidth: .infinity)
            .clipped()

            // Gradient scrim for text legibility on photo
            LinearGradient(
                colors: [.clear, .black.opacity(0.55)],
                startPoint: .top,
                endPoint: .bottom
            )

            VStack(alignment: .leading, spacing: 8) {
                HStack(spacing: 6) {
                    Circle()
                        .fill(garage.isAvailable ? Color.statusCompleted : Color.statusCancelled)
                        .frame(width: 6, height: 6)
                    Text(verbatim: garage.isAvailable ? "Open" : "Closed")
                        .font(CarlibFont.caption(.medium))
                        .tracking(1.2)
                        .textCase(.uppercase)
                        .foregroundStyle(.white)
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 5)
                .background(.black.opacity(0.35), in: Capsule())

                Text(verbatim: garage.name)
                    .font(CarlibFont.cardHero())
                    .foregroundStyle(.white)
                    .lineLimit(2)
                    .multilineTextAlignment(.leading)
            }
            .padding(16)
        }
        .frame(height: 180)
        .clipShape(RoundedRectangle(cornerRadius: 18))
    }

    // MARK: - Completeness

    /// Subtle nudge that encourages the shop to keep filling in profile
    /// fields. Computed from which optional fields are filled.
    private var completeness: Int {
        var filled = 3 // name, address, phone always set from mock
        if !garage.specialties.isEmpty { filled += 1 }
        if garage.coverageRadiusKm > 0 { filled += 1 }
        if !garage.photos.isEmpty { filled += 1 }
        let total = 6
        return Int((Double(filled) / Double(total)) * 100)
    }

    private var completenessStrip: some View {
        HStack(spacing: 12) {
            ZStack {
                Circle()
                    .stroke(Color.carlibCardBorder, lineWidth: 3)
                Circle()
                    .trim(from: 0, to: CGFloat(completeness) / 100)
                    .stroke(Color.brandYellow, style: StrokeStyle(lineWidth: 3, lineCap: .round))
                    .rotationEffect(.degrees(-90))
                Text(verbatim: "\(completeness)%")
                    .font(CarlibFont.micro(.medium))
                    .foregroundStyle(.carlibDark)
            }
            .frame(width: 44, height: 44)

            VStack(alignment: .leading, spacing: 2) {
                Text(verbatim: "Profile \(completeness)% complete")
                    .font(CarlibFont.callout())
                    .foregroundStyle(.carlibDark)
                Text(verbatim: "Add photos to make your listing stand out.")
                    .font(CarlibFont.footnote())
                    .foregroundStyle(.carlibSecondary)
            }

            Spacer(minLength: 0)

            Button {
                showEditSheet = true
            } label: {
                RemixIcon.arrowRightLine.view(size: 16, color: .carlibDark)
                    .frame(width: 32, height: 32)
                    .background(Color.tileSecondary, in: Circle())
            }
            .buttonStyle(.pressable(scale: 0.92, haptic: .light))
        }
        .padding(14)
        .background(Color.tileSecondary.opacity(0.5), in: RoundedRectangle(cornerRadius: 14))
    }

    // MARK: - Quick stats

    private var quickStats: some View {
        HStack(spacing: 8) {
            statBlock(value: "\(completedRepairs)", label: "Repairs")
            divider
            statBlock(value: "\(garage.specialties.count)", label: "Specialties")
            divider
            statBlock(value: "\(Int(garage.coverageRadiusKm))km", label: "Coverage")
            divider
            statBlock(value: "\(yearsActive)y", label: "Active")
        }
        .padding(.vertical, 14)
        .padding(.horizontal, 8)
        .background(Color.tileSecondary, in: RoundedRectangle(cornerRadius: 16))
    }

    private func statBlock(value: String, label: String) -> some View {
        VStack(spacing: 2) {
            Text(verbatim: value)
                .font(CarlibFont.statValue())
                .foregroundStyle(.carlibDark)
            Text(verbatim: label)
                .font(CarlibFont.micro())
                .foregroundStyle(.carlibSecondary)
        }
        .frame(maxWidth: .infinity)
    }

    private var divider: some View {
        RoundedRectangle(cornerRadius: 0.5)
            .fill(Color.carlibCardBorder)
            .frame(width: 1, height: 24)
    }

    // MARK: - Contact (tappable actions)

    private var contactSection: some View {
        VStack(alignment: .leading, spacing: 9) {
            sectionHeader("Contact")

            VStack(spacing: 10) {
                contactCard(
                    icon: .mapPinLine,
                    title: garage.address,
                    subtitle: "Tap to open in Maps",
                    action: openMaps
                )
                phoneCard
            }
        }
    }

    private func contactCard(icon: RemixIcon, title: String, subtitle: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 12) {
                icon.view(size: 20, color: .brandYellow)
                    .frame(width: 44, height: 44)
                    .background(Color.brandYellow.opacity(0.12), in: Circle())

                VStack(alignment: .leading, spacing: 2) {
                    Text(verbatim: title)
                        .font(CarlibFont.body(.medium))
                        .foregroundStyle(.carlibDark)
                        .lineLimit(2)
                        .multilineTextAlignment(.leading)
                    Text(verbatim: subtitle)
                        .font(CarlibFont.footnote())
                        .foregroundStyle(.carlibSecondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                RemixIcon.arrowRightLine.view(size: 16, color: .carlibSecondary)
            }
            .padding(14)
            .background(Color.tileSecondary.opacity(0.5), in: RoundedRectangle(cornerRadius: 14))
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    private func openMaps() {
        let encoded = garage.address.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        if let url = URL(string: "http://maps.apple.com/?q=\(encoded)") {
            UIApplication.shared.open(url)
        }
    }

    private var phoneCard: some View {
        let country = CountryDialCode.from(dialCode: garage.dialCode)
        return Button(action: callPhone) {
            HStack(spacing: 12) {
                RemixIcon.phoneLine.view(size: 20, color: .brandYellow)
                    .frame(width: 44, height: 44)
                    .background(Color.brandYellow.opacity(0.12), in: Circle())

                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 8) {
                        Text(verbatim: country.flag)
                            .font(.system(size: 18))
                        Text(verbatim: garage.dialCode)
                            .font(CarlibFont.body(.medium))
                            .foregroundStyle(.carlibSecondary)
                        Text(verbatim: garage.phone)
                            .font(CarlibFont.body(.medium))
                            .foregroundStyle(.carlibDark)
                            .lineLimit(1)
                    }
                    Text(verbatim: "Tap to call")
                        .font(CarlibFont.footnote())
                        .foregroundStyle(.carlibSecondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                RemixIcon.arrowRightLine.view(size: 16, color: .carlibSecondary)
            }
            .padding(14)
            .background(Color.tileSecondary.opacity(0.5), in: RoundedRectangle(cornerRadius: 14))
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    private func callPhone() {
        let e164 = "\(garage.dialCode)\(garage.phone)".filter { $0.isNumber || $0 == "+" }
        if let url = URL(string: "tel://\(e164)") {
            UIApplication.shared.open(url)
        }
    }

    // MARK: - Specialties (chips)

    private var specialtiesSection: some View {
        VStack(alignment: .leading, spacing: 9) {
            sectionHeader("Specialties", action: { showEditSheet = true }, actionLabel: "Edit")

            WrappingHStack(spacing: 8, lineSpacing: 8) {
                ForEach(garage.specialties, id: \.self) { specialty in
                    Text(verbatim: specialty.localizedName)
                        .font(CarlibFont.footnote(.medium))
                        .foregroundStyle(.carlibDark)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 7)
                        .background(Color.brandYellow.opacity(0.18), in: Capsule())
                        .overlay {
                            Capsule()
                                .strokeBorder(Color.brandYellow.opacity(0.35), lineWidth: 1)
                        }
                }
            }
        }
    }

    // MARK: - Coverage

    private var coverageSection: some View {
        VStack(alignment: .leading, spacing: 9) {
            sectionHeader("Service area")

            HStack(spacing: 12) {
                RemixIcon.focus2Line.view(size: 22, color: .brandYellow)
                    .frame(width: 44, height: 44)
                    .background(Color.brandYellow.opacity(0.12), in: Circle())

                VStack(alignment: .leading, spacing: 2) {
                    Text(verbatim: "\(Int(garage.coverageRadiusKm)) km radius")
                        .font(CarlibFont.body(.medium))
                        .foregroundStyle(.carlibDark)
                    Text(verbatim: "Accept claims within this distance.")
                        .font(CarlibFont.footnote())
                        .foregroundStyle(.carlibSecondary)
                }
                Spacer(minLength: 0)
            }
            .padding(14)
            .background(Color.tileSecondary.opacity(0.5), in: RoundedRectangle(cornerRadius: 14))
        }
    }

    // MARK: - Photos

    /// Horizontal photo carousel. When the shop has photos we render them
    /// with an "Add" affordance up front; when it doesn't, we only show the
    /// single add tile so the empty state reads as an invitation, not a grid
    /// of placeholders.
    private var photosSection: some View {
        VStack(alignment: .leading, spacing: 9) {
            sectionHeader("Photos", action: { showEditSheet = true }, actionLabel: "Manage")

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 10) {
                    addPhotoTile
                    ForEach(garage.photos) { photo in
                        photoTile(for: photo)
                    }
                }
            }
            .scrollClipDisabled()
        }
    }

    private var addPhotoTile: some View {
        Button {
            showEditSheet = true
        } label: {
            VStack(spacing: 6) {
                RemixIcon.addLine.view(size: 24, color: .brandYellow)
                Text(verbatim: "Add")
                    .font(CarlibFont.footnote(.medium))
                    .foregroundStyle(.carlibDark)
            }
            .frame(width: 120, height: 120)
            .background(Color.brandYellow.opacity(0.1), in: RoundedRectangle(cornerRadius: 14))
            .overlay {
                RoundedRectangle(cornerRadius: 14)
                    .strokeBorder(
                        style: StrokeStyle(lineWidth: 1.5, dash: [6])
                    )
                    .foregroundStyle(Color.brandYellow.opacity(0.5))
            }
        }
        .buttonStyle(.pressable(scale: 0.97, haptic: .light))
    }

    private func photoTile(for photo: PhotoAttachment) -> some View {
        DummyImage(
            kind: .garage,
            seed: photo.id.uuidString,
            pixelWidth: 240,
            pixelHeight: 240
        )
        .frame(width: 120, height: 120)
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }

    // MARK: - Settings footer

    private var settingsFooter: some View {
        VStack(spacing: 10) {
            NavigationLink {
                SettingsView()
            } label: {
                HStack(spacing: 12) {
                    RemixIcon.settings3Line.view(size: 18, color: .carlibDark)
                        .frame(width: 28, height: 28)
                    VStack(alignment: .leading, spacing: 2) {
                        Text(verbatim: L10n.Settings.profileRowTitle)
                            .font(CarlibFont.body(.medium))
                            .foregroundStyle(.carlibDark)
                        Text(verbatim: L10n.Settings.profileRowSubtitle)
                            .font(CarlibFont.footnote())
                            .foregroundStyle(.carlibSecondary)
                    }
                    Spacer()
                    RemixIcon.arrowRightLine.view(size: 16, color: .carlibSecondary)
                }
                .padding(14)
                .background(Color.tileSecondary.opacity(0.5), in: RoundedRectangle(cornerRadius: 14))
            }
            .buttonStyle(.plain)

            Button(role: .destructive) {
                appState.signOut()
            } label: {
                HStack {
                    RemixIcon.logoutBoxLine.view(size: 18, color: .destructiveRed)
                    Text(verbatim: L10n.Profile.logout)
                        .font(CarlibFont.body(.medium))
                        .foregroundStyle(.destructiveRed)
                    Spacer()
                }
                .padding(14)
                .background(Color.tileSecondary.opacity(0.5), in: RoundedRectangle(cornerRadius: 14))
            }
            .buttonStyle(.plain)
        }
    }

    // MARK: - Helpers

    @ViewBuilder
    private func sectionHeader(_ title: String, action: (() -> Void)? = nil, actionLabel: String? = nil) -> some View {
        HStack {
            Text(verbatim: title)
                .font(CarlibFont.title3())
                .foregroundStyle(.carlibDark)
            Spacer()
            if let action, let actionLabel {
                Button(action: action) {
                    Text(verbatim: actionLabel)
                        .font(CarlibFont.caption(.medium))
                        .foregroundStyle(.carlibDark)
                }
                .buttonStyle(.pressable(scale: 0.96, haptic: .light))
            }
        }
    }
}

// MARK: - Wrapping HStack for chips

/// Simple flow layout so specialty chips wrap to multiple lines.
private struct WrappingHStack: Layout {
    var spacing: CGFloat = 8
    var lineSpacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let maxWidth = proposal.width ?? .infinity
        var x: CGFloat = 0
        var y: CGFloat = 0
        var rowHeight: CGFloat = 0
        var totalHeight: CGFloat = 0
        var maxRowWidth: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > maxWidth, x > 0 {
                y += rowHeight + lineSpacing
                totalHeight = y
                x = 0
                rowHeight = 0
            }
            rowHeight = max(rowHeight, size.height)
            x += size.width + spacing
            maxRowWidth = max(maxRowWidth, x)
        }
        totalHeight = y + rowHeight
        return CGSize(width: maxRowWidth, height: totalHeight)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x: CGFloat = bounds.minX
        var y: CGFloat = bounds.minY
        var rowHeight: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > bounds.maxX, x > bounds.minX {
                y += rowHeight + lineSpacing
                x = bounds.minX
                rowHeight = 0
            }
            subview.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(size))
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
    }
}

#Preview {
    GarageProfileView()
        .environment(AppState())
        .environment(ClaimStore())
}
