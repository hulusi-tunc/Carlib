import SwiftUI

/// Driver profile and settings.
struct DriverProfileView: View {
    @Environment(AppState.self) private var appState
    @AppStorage("app_theme") private var selectedTheme: String = AppTheme.dark.rawValue
    private let mockVehicle = MockData.vehicleClio

    var body: some View {
        NavigationStack {
            List {
                // Header
                Section {
                    HStack(spacing: CarlibSpacing.md) {
                        Circle()
                            .fill(Color.brandYellowLight)
                            .frame(width: 56, height: 56)
                            .overlay {
                                Text("SD")
                                    .font(CarlibFont.headingMedium())
                                    .foregroundStyle(.brandYellowDark)
                            }
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Sophie Durand")
                                .font(CarlibFont.bodyLarge(.semibold))
                            Text("sophie.durand@email.com")
                                .font(CarlibFont.bodySmall())
                                .foregroundStyle(.secondary)
                        }
                    }
                }

                Section {
                    HStack {
                        Label("\(mockVehicle.brand) \(mockVehicle.model)", systemImage: "car.fill")
                        Spacer()
                        Text(mockVehicle.licensePlate)
                            .font(CarlibFont.bodySmall())
                            .foregroundStyle(.secondary)
                    }
                } header: {
                    Text(verbatim: L10n.Profile.sectionVehicle)
                }

                Section {
                    NavigationLink {
                        NotificationSettingsView()
                    } label: {
                        Label {
                            Text(verbatim: L10n.Profile.preferences)
                        } icon: {
                            Image(systemName: "bell")
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
                            Image(systemName: "globe")
                        }
                        Spacer()
                        Text(verbatim: L10n.Profile.languageCurrent)
                            .foregroundStyle(.secondary)
                    }
                } header: {
                    Text(verbatim: L10n.Profile.sectionLanguage)
                }

                Section {
                    Picker(selection: $selectedTheme) {
                        ForEach(AppTheme.allCases, id: \.rawValue) { theme in
                            Label(theme.label, systemImage: theme.icon)
                                .tag(theme.rawValue)
                        }
                    } label: {
                        Label {
                            Text(verbatim: L10n.Profile.sectionAppearance)
                        } icon: {
                            Image(systemName: "circle.lefthalf.filled")
                        }
                    }
                } header: {
                    Text(verbatim: L10n.Profile.sectionAppearance)
                }

                Section {
                    Label {
                        Text(verbatim: L10n.ProfileAbout.terms)
                    } icon: {
                        Image(systemName: "doc.text")
                    }
                    Label {
                        Text(verbatim: L10n.ProfileAbout.privacy)
                    } icon: {
                        Image(systemName: "lock.shield")
                    }
                    HStack {
                        Label {
                            Text(verbatim: L10n.ProfileAbout.version)
                        } icon: {
                            Image(systemName: "info.circle")
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
                        appState.userRole = nil
                        appState.isOnboarded = false
                    } label: {
                        Label {
                            Text(verbatim: L10n.Profile.logout)
                        } icon: {
                            Image(systemName: "rectangle.portrait.and.arrow.right")
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
}
