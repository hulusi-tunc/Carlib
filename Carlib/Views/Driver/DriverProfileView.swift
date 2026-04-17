import SwiftUI

/// Driver profile and settings.
struct DriverProfileView: View {
    @Environment(AppState.self) private var appState
    @Environment(ClaimStore.self) private var claimStore
    @AppStorage("app_theme") private var selectedTheme: String = AppTheme.light.rawValue

    var body: some View {
        NavigationStack {
            List {
                // Header
                Section {
                    HStack(spacing: CarlibSpacing.md) {
                        DummyImage(
                            kind: .person,
                            seed: "sophie-durand",
                            pixelWidth: 200,
                            pixelHeight: 200
                        )
                        .frame(width: 56, height: 56)
                        .clipShape(Circle())

                        VStack(alignment: .leading, spacing: 2) {
                            Text("Sophie Durand")
                                .font(CarlibFont.bodyLarge(.medium))
                            Text("sophie.durand@email.com")
                                .font(CarlibFont.bodySmall())
                                .foregroundStyle(.secondary)
                        }
                    }
                }

                Section {
                    ForEach(claimStore.vehicles) { vehicle in
                        NavigationLink {
                            VehicleDetailView(vehicle: vehicle.info)
                        } label: {
                            HStack {
                                Label {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("\(vehicle.info.brand) \(vehicle.info.model)")
                                        if vehicle.isDefault {
                                            Text("Default")
                                                .font(CarlibFont.caption(.medium))
                                                .foregroundStyle(.carlibPrimaryBlue)
                                        }
                                    }
                                } icon: {
                                    RemixIcon.carFill.view(size: 18, color: .carlibPrimaryBlue)
                                }
                                Spacer()
                                Text(vehicle.info.licensePlate)
                                    .font(CarlibFont.bodySmall())
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }

                    NavigationLink {
                        MyGarageView()
                    } label: {
                        Label {
                            Text("Manage vehicles")
                        } icon: {
                            RemixIcon.addCircleLine.view(size: 18, color: .carlibPrimaryBlue)
                        }
                    }
                } header: {
                    Text(verbatim: L10n.Profile.sectionVehicle)
                }

                Section {
                    NavigationLink {
                        DriverClaimsListView()
                    } label: {
                        Label {
                            Text(verbatim: L10n.Profile.historyRow)
                        } icon: {
                            RemixIcon.historyLine.view(size: 18, color: .carlibPrimaryBlue)
                        }
                    }
                } header: {
                    Text(verbatim: L10n.Profile.sectionHistory)
                }

                Section {
                    NavigationLink {
                        NotificationSettingsView()
                    } label: {
                        Label {
                            Text(verbatim: L10n.Profile.preferences)
                        } icon: {
                            RemixIcon.notificationLine.view(size: 18, color: .carlibPrimaryBlue)
                        }
                    }
                } header: {
                    Text(verbatim: L10n.Profile.sectionNotifications)
                }

                Section {
                    HStack {
                        Label {
                            Text(verbatim: L10n.Profile.sectionLanguage)
                        } icon: {
                            RemixIcon.globalLine.view(size: 18, color: .carlibPrimaryBlue)
                        }
                        Spacer()
                        Text(verbatim: L10n.Profile.languageCurrent)
                            .foregroundStyle(.secondary)
                    }
                } header: {
                    Text(verbatim: L10n.Profile.sectionLanguage)
                }


                Section {
                    Label {
                        Text(verbatim: L10n.ProfileAbout.terms)
                    } icon: {
                        RemixIcon.fileTextLine.view(size: 18, color: .carlibPrimaryBlue)
                    }
                    Label {
                        Text(verbatim: L10n.ProfileAbout.privacy)
                    } icon: {
                        RemixIcon.shieldKeyholeLine.view(size: 18, color: .carlibPrimaryBlue)
                    }
                    HStack {
                        Label {
                            Text(verbatim: L10n.ProfileAbout.version)
                        } icon: {
                            RemixIcon.informationLine.view(size: 18, color: .carlibPrimaryBlue)
                        }
                        Spacer()
                        Text("0.1.0")
                            .foregroundStyle(.secondary)
                    }
                } header: {
                    Text(verbatim: L10n.ProfileAbout.section)
                }

                Section {
                    Button(role: .destructive) {
                        appState.signOut()
                    } label: {
                        Label {
                            Text(verbatim: L10n.Profile.logout)
                        } icon: {
                            RemixIcon.logoutBoxLine.view(size: 18, color: .destructiveRed)
                        }
                    }
                }
            }
            .navigationTitle(Text(verbatim: L10n.Profile.title))
        }
    }
}

#Preview {
    DriverProfileView()
        .environment(AppState())
        .environment(ClaimStore())
}
