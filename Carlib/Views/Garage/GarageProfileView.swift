import SwiftUI

/// Garage profile — business info, specialties, availability settings.
struct GarageProfileView: View {
    @Environment(AppState.self) private var appState
    @AppStorage("app_theme") private var selectedTheme: String = AppTheme.light.rawValue
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
                                RemixIcon.toolsFill.view(size: 22, color: .brandYellowDark)
                            }
                        VStack(alignment: .leading, spacing: 2) {
                            Text(garage.name)
                                .font(CarlibFont.bodyLarge(.medium))
                            HStack(spacing: 4) {
                                RemixIcon.starFill.view(size: 11, color: .brandYellow)
                                Text(String(format: "%.1f", garage.rating ?? 0))
                                    .font(CarlibFont.bodySmall(.medium))
                                Text("(\(garage.reviewCount) \(L10n.GarageDetail.reviews))")
                                    .font(CarlibFont.caption())
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                }

                Section {
                    Label {
                        Text(garage.address)
                    } icon: {
                        RemixIcon.mapPinLine.view(size: 18, color: .carlibPrimaryBlue)
                    }
                    Label {
                        Text(garage.phone)
                    } icon: {
                        RemixIcon.phoneLine.view(size: 18, color: .carlibPrimaryBlue)
                    }
                } header: {
                    Text(verbatim: L10n.GarageProfile.sectionInfo)
                }

                Section {
                    ForEach(RepairSpecialty.allCases, id: \.self) { specialty in
                        HStack {
                            Text(specialty.localizedName)
                            Spacer()
                            if garage.specialties.contains(specialty) {
                                RemixIcon.checkLine.view(size: 16, color: .brandYellow)
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
                            RemixIcon.focus2Line.view(size: 18, color: .carlibPrimaryBlue)
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
                                        RemixIcon.imageLine.view(size: 22, color: .secondary)
                                    }
                            }
                            // Add button
                            RoundedRectangle(cornerRadius: CarlibRadius.sm)
                                .strokeBorder(style: StrokeStyle(lineWidth: 1.5, dash: [6]))
                                .foregroundStyle(Color(.systemGray3))
                                .frame(width: 100, height: 75)
                                .overlay {
                                    RemixIcon.addLine.view(size: 22, color: .brandYellow)
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
                            RemixIcon.checkboxCircleFill.view(size: 18, color: .carlibPrimaryBlue)
                        }
                        Spacer()
                        Text("12")
                            .foregroundStyle(.secondary)
                    }
                    HStack {
                        Label {
                            Text(verbatim: L10n.GarageProfile.statsRating)
                        } icon: {
                            RemixIcon.starFill.view(size: 18, color: .brandYellow)
                        }
                        Spacer()
                        Text(String(format: "%.1f", garage.rating ?? 0))
                            .foregroundStyle(.secondary)
                    }
                } header: {
                    Text(verbatim: L10n.GarageProfile.sectionStats)
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
