import SwiftUI

/// Garage profile — business info, specialties, availability settings.
struct GarageProfileView: View {
    @Environment(AppState.self) private var appState
    @AppStorage("app_theme") private var selectedTheme: String = AppTheme.dark.rawValue
    @State private var showEditSheet = false
    private let garage = MockData.garages[0]

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
                                Image(systemName: "wrench.and.screwdriver.fill")
                                    .font(.title3)
                                    .foregroundStyle(.brandYellowDark)
                            }
                        VStack(alignment: .leading, spacing: 2) {
                            Text(garage.name)
                                .font(CarlibFont.bodyLarge(.semibold))
                            HStack(spacing: 4) {
                                Image(systemName: "star.fill")
                                    .font(.caption)
                                    .foregroundStyle(.brandYellow)
                                Text(String(format: "%.1f", garage.rating ?? 0))
                                    .font(CarlibFont.bodySmall(.semibold))
                                Text("(\(garage.reviewCount) \(L10n.GarageDetail.reviews))")
                                    .font(CarlibFont.caption())
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                }

                Section {
                    Label(garage.address, systemImage: "mappin")
                    Label(garage.phone, systemImage: "phone")
                } header: {
                    Text(verbatim: L10n.GarageProfile.sectionInfo)
                }

                Section {
                    ForEach(RepairSpecialty.allCases, id: \.self) { specialty in
                        HStack {
                            Text(specialty.localizedName)
                            Spacer()
                            if garage.specialties.contains(specialty) {
                                Image(systemName: "checkmark")
                                    .foregroundStyle(.brandYellow)
                            }
                        }
                    }
                } header: {
                    Text(verbatim: L10n.GarageProfile.sectionSpecialties)
                }

                Section {
                    HStack {
                        Label {
                            Text(verbatim: L10n.GarageProfile.coverage)
                        } icon: {
                            Image(systemName: "location.circle")
                        }
                        Spacer()
                        Text("\(Int(garage.coverageRadiusKm)) km")
                            .foregroundStyle(.secondary)
                    }
                } header: {
                    Text(verbatim: L10n.GarageProfile.sectionZone)
                }

                Section {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: CarlibSpacing.sm) {
                            ForEach(0..<3, id: \.self) { _ in
                                RoundedRectangle(cornerRadius: CarlibRadius.sm)
                                    .fill(Color(.systemGray5))
                                    .frame(width: 100, height: 75)
                                    .overlay {
                                        Image(systemName: "photo")
                                            .foregroundStyle(.secondary)
                                    }
                            }
                            // Add button
                            RoundedRectangle(cornerRadius: CarlibRadius.sm)
                                .strokeBorder(style: StrokeStyle(lineWidth: 1.5, dash: [6]))
                                .foregroundStyle(Color(.systemGray3))
                                .frame(width: 100, height: 75)
                                .overlay {
                                    Image(systemName: "plus")
                                        .foregroundStyle(.brandYellow)
                                }
                        }
                    }
                    .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 0))
                } header: {
                    Text(verbatim: L10n.GarageProfile.sectionPhotos)
                }

                Section {
                    HStack {
                        Label {
                            Text(verbatim: L10n.GarageProfile.statsCompleted)
                        } icon: {
                            Image(systemName: "checkmark.circle.fill")
                        }
                        Spacer()
                        Text("12")
                            .foregroundStyle(.secondary)
                    }
                    HStack {
                        Label {
                            Text(verbatim: L10n.GarageProfile.statsRating)
                        } icon: {
                            Image(systemName: "star.fill")
                        }
                        Spacer()
                        Text(String(format: "%.1f", garage.rating ?? 0))
                            .foregroundStyle(.secondary)
                    }
                } header: {
                    Text(verbatim: L10n.GarageProfile.sectionStats)
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
            .navigationTitle(Text(verbatim: L10n.GarageProfile.title))
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showEditSheet = true
                    } label: {
                        Text("Edit")
                    }
                }
            }
            .sheet(isPresented: $showEditSheet) {
                GarageProfileEditView(garage: garage)
            }
        }
    }
}

#Preview {
    GarageProfileView()
        .environment(AppState())
}
