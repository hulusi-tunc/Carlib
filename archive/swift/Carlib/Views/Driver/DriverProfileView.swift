import SwiftUI

/// Driver profile — rebuilt in the same language as the Garage profile.
/// Warm hero card up top (avatar + name + member chip), quick stats strip,
/// tappable vehicle cards as the centerpiece, then compact navigation
/// cards for history / notifications / about / sign-out.
struct DriverProfileView: View {
    @Environment(AppState.self) private var appState
    @Environment(ClaimStore.self) private var claimStore

    private let driverDialCode = "+33"
    private let driverPhone = "6 12 34 56 78"

    @State private var showEditSheet = false
    @State private var pushSettings = false
    @State private var pushGarage = false
    @State private var showAddVehicle = false

    private var driverName: String {
        let name = appState.currentUser?.fullName ?? ""
        return name.isEmpty ? "Driver" : name
    }

    private var driverEmail: String {
        appState.currentUser?.email ?? ""
    }

    private var avatarSeed: String {
        appState.currentUser?.id.uuidString ?? "driver-default"
    }

    private var memberSince: String {
        guard let date = appState.currentUser?.createdAt else { return "—" }
        return date.formatted(.dateTime.month(.abbreviated).year().locale(Locale(identifier: "en_US")))
    }

    private var totalClaims: Int { claimStore.claims.count }
    private var activeClaims: Int { claimStore.activeClaims.count }
    private var vehicleCount: Int { claimStore.vehicles.count }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    heroCard
                    quickStats
                    vehiclesSection
                    quickLinks
                    aboutSection
                    signOutCard
                }
                .padding(.horizontal, 20)
                .padding(.top, 12)
                .padding(.bottom, 40)
            }
            .background(Color.carlibScreenBg)
            .navigationTitle(Text(verbatim: L10n.Profile.title))
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    HStack(spacing: 6) {
                        NavigationLink {
                            SettingsView()
                        } label: {
                            RemixIcon.settings3Line.view(size: 20, color: .carlibDark)
                        }
                        .buttonStyle(.pressable(scale: 0.92, haptic: .light))

                        Button {
                            showEditSheet = true
                        } label: {
                            Text(verbatim: "Edit Profile")
                                .font(CarlibFont.body(.medium))
                                .foregroundStyle(.carlibDark)
                        }
                        .buttonStyle(.pressable(scale: 0.96, haptic: .light))
                    }
                }
            }
            .sheet(isPresented: $showEditSheet) {
                DriverProfileEditView(
                    name: driverName,
                    email: driverEmail,
                    dialCode: driverDialCode,
                    phone: driverPhone
                )
            }
            .navigationDestination(isPresented: $pushSettings) {
                SettingsView()
            }
            .navigationDestination(isPresented: $pushGarage) {
                MyGarageView()
            }
            .sheet(isPresented: $showAddVehicle) {
                AddVehicleSheet()
            }
            .onAppear {
                #if DEBUG
                if DebugScreenshotFlags.sheet != nil {
                    pushSettings = true
                }
                #endif
            }
        }
    }

    // MARK: - Hero

    /// Warm tinted card with avatar, name, email and a soft member chip.
    /// No cover photo — drivers don't have a "business" to showcase, so the
    /// avatar does the visual work.
    private var heroCard: some View {
        HStack(spacing: 14) {
            DummyImage(
                kind: .person,
                seed: avatarSeed,
                pixelWidth: 240,
                pixelHeight: 240
            )
            .frame(width: 72, height: 72)
            .clipShape(Circle())
            .overlay {
                Circle().strokeBorder(Color.carlibDark.opacity(0.12), lineWidth: 2)
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(verbatim: driverName)
                    .font(CarlibFont.title2())
                    .foregroundStyle(.carlibDark)

                Text(verbatim: driverEmail)
                    .font(CarlibFont.footnote())
                    .foregroundStyle(.carlibSecondary)
                    .lineLimit(1)

                HStack(spacing: 6) {
                    RemixIcon.userLine.view(size: 11, color: .carlibDark)
                    Text(verbatim: "Driver · Member since \(memberSince)")
                        .font(CarlibFont.caption(.medium))
                        .foregroundStyle(.carlibDark)
                }
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(Color.carlibScreenBg.opacity(0.6), in: Capsule())
                .padding(.top, 2)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            LinearGradient(
                colors: [
                    Color.brandYellow.opacity(0.35),
                    Color.brandYellow.opacity(0.15)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            ),
            in: RoundedRectangle(cornerRadius: 18)
        )
    }

    // MARK: - Quick stats

    private var quickStats: some View {
        HStack(spacing: 8) {
            statBlock(value: "\(totalClaims)", label: "Claims")
            divider
            statBlock(value: "\(activeClaims)", label: "Active")
            divider
            statBlock(value: "\(vehicleCount)", label: "Vehicles")
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

    // MARK: - Vehicles (the centerpiece)

    /// The driver's vehicles are the most important actionable content on
    /// this page — so they get their own section with large tappable rows,
    /// a "Manage" link (top-right of the header) that routes to `MyGarageView`,
    /// and an "Add new vehicle" CTA at the bottom that opens AddVehicleSheet.
    private var vehiclesSection: some View {
        VStack(alignment: .leading, spacing: 9) {
            sectionHeader("My vehicles", actionLabel: "Manage") {
                pushGarage = true
            }

            VStack(spacing: 8) {
                ForEach(claimStore.vehicles) { vehicle in
                    NavigationLink {
                        VehicleDetailView(vehicle: vehicle)
                    } label: {
                        vehicleRow(vehicle)
                    }
                    .buttonStyle(.plain)
                }

                Button {
                    showAddVehicle = true
                } label: {
                    HStack {
                        RemixIcon.addLine.view(size: 16, color: .carlibDark)
                        Text(verbatim: "Add new vehicle")
                            .font(CarlibFont.callout(.medium))
                            .foregroundStyle(.carlibDark)
                        Spacer()
                        RemixIcon.arrowRightLine.view(size: 14, color: .carlibSecondary)
                    }
                    .padding(14)
                    .background(Color.tileSecondary.opacity(0.5), in: RoundedRectangle(cornerRadius: 14))
                    .overlay {
                        RoundedRectangle(cornerRadius: 14)
                            .strokeBorder(
                                style: StrokeStyle(lineWidth: 1, dash: [5])
                            )
                            .foregroundStyle(Color.carlibCardBorder)
                    }
                }
                .buttonStyle(.pressable(scale: 0.98, haptic: .light))
            }
        }
    }

    private func vehicleRow(_ vehicle: Vehicle) -> some View {
        HStack(spacing: 12) {
            CarBrandLogo(brand: vehicle.info.brand, size: 32)
                .frame(width: 48, height: 48)
                .background(Color.brandYellow.opacity(0.12), in: Circle())

            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 6) {
                    Text(verbatim: "\(vehicle.info.brand) \(vehicle.info.model)")
                        .font(CarlibFont.body(.medium))
                        .foregroundStyle(.carlibDark)
                    if vehicle.isDefault {
                        Text(verbatim: "Default")
                            .font(CarlibFont.caption(.medium))
                            .foregroundStyle(.black)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 2)
                            .background(Color.brandYellow, in: Capsule())
                    }
                }

                if let nickname = vehicle.nickname {
                    Text(verbatim: nickname)
                        .font(CarlibFont.footnote())
                        .foregroundStyle(.carlibSecondary)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            VStack(alignment: .trailing, spacing: 4) {
                Text(verbatim: vehicle.info.licensePlate)
                    .font(CarlibFont.caption(.medium))
                    .foregroundStyle(.carlibDark)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color.tileSecondary, in: Capsule())

                RemixIcon.arrowRightLine.view(size: 14, color: .carlibSecondary)
            }
        }
        .padding(14)
        .background(Color.tileSecondary.opacity(0.5), in: RoundedRectangle(cornerRadius: 14))
        .contentShape(Rectangle())
    }

    // MARK: - Quick links (history + notifications)

    private var quickLinks: some View {
        VStack(spacing: 10) {
            NavigationLink {
                DriverClaimsListView()
            } label: {
                linkRow(
                    icon: .historyLine,
                    title: L10n.Profile.historyRow,
                    subtitle: "Past claims and their outcomes"
                )
            }
            .buttonStyle(.plain)

            NavigationLink {
                SettingsView()
            } label: {
                linkRow(
                    icon: .settings3Line,
                    title: L10n.Settings.profileRowTitle,
                    subtitle: L10n.Settings.profileRowSubtitle
                )
            }
            .buttonStyle(.plain)
        }
    }

    private func linkRow(icon: RemixIcon, title: String, subtitle: String) -> some View {
        HStack(spacing: 12) {
            icon.view(size: 20, color: .brandYellow)
                .frame(width: 44, height: 44)
                .background(Color.brandYellow.opacity(0.12), in: Circle())

            VStack(alignment: .leading, spacing: 2) {
                Text(verbatim: title)
                    .font(CarlibFont.body(.medium))
                    .foregroundStyle(.carlibDark)
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

    // MARK: - About

    /// Terms + Privacy + Version collapsed into one card with a divider
    /// between each row. Keeps these low-priority links from eating three
    /// separate sections.
    private var aboutSection: some View {
        VStack(alignment: .leading, spacing: 9) {
            sectionHeader("About", actionLabel: nil, action: nil)

            VStack(spacing: 0) {
                aboutRow(icon: .fileTextLine, title: L10n.ProfileAbout.terms, trailing: nil)
                Divider().overlay(Color.carlibCardBorder)
                aboutRow(icon: .shieldCheckLine, title: L10n.ProfileAbout.privacy, trailing: nil)
                Divider().overlay(Color.carlibCardBorder)
                aboutRow(icon: .informationLine, title: L10n.ProfileAbout.version, trailing: "0.1.0")
            }
            .background(Color.tileSecondary.opacity(0.5), in: RoundedRectangle(cornerRadius: 14))
        }
    }

    private func aboutRow(icon: RemixIcon, title: String, trailing: String?) -> some View {
        HStack(spacing: 12) {
            icon.view(size: 18, color: .carlibSecondary)
                .frame(width: 32, height: 32)

            Text(verbatim: title)
                .font(CarlibFont.body())
                .foregroundStyle(.carlibDark)

            Spacer()

            if let trailing {
                Text(verbatim: trailing)
                    .font(CarlibFont.footnote())
                    .foregroundStyle(.carlibSecondary)
            } else {
                RemixIcon.arrowRightLine.view(size: 14, color: .carlibSecondary)
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 12)
    }

    // MARK: - Sign out

    private var signOutCard: some View {
        Button(role: .destructive) {
            appState.signOut()
        } label: {
            HStack(spacing: 12) {
                RemixIcon.logoutBoxLine.view(size: 18, color: .destructiveRed)
                    .frame(width: 44, height: 44)
                    .background(Color.destructiveRed.opacity(0.1), in: Circle())

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

    // MARK: - Shared section header

    @ViewBuilder
    private func sectionHeader(_ title: String, actionLabel: String?, action: (() -> Void)?) -> some View {
        HStack {
            Text(verbatim: title)
                .font(CarlibFont.title3())
                .foregroundStyle(.carlibDark)
            Spacer()
            if let actionLabel, let action {
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

#Preview {
    DriverProfileView()
        .environment(AppState())
        .environment(ClaimStore())
}
