import SwiftUI

/// Garage profile edit form.
struct GarageProfileEditView: View {
    @Environment(\.dismiss) private var dismiss

    @State private var name: String
    @State private var address: String
    @State private var phone: String
    @State private var coverageRadius: Double
    @State private var selectedSpecialties: Set<RepairSpecialty>

    init(garage: Garage) {
        _name = State(initialValue: garage.name)
        _address = State(initialValue: garage.address)
        _phone = State(initialValue: garage.phone)
        _coverageRadius = State(initialValue: garage.coverageRadiusKm)
        _selectedSpecialties = State(initialValue: Set(garage.specialties))
    }

    var body: some View {
        NavigationStack {
            Form {
                Section(L10n.GarageProfileEdit.name) {
                    TextField(L10n.GarageProfileEdit.name, text: $name)
                }

                Section(L10n.GarageProfileEdit.address) {
                    TextField(L10n.GarageProfileEdit.address, text: $address)
                }

                Section(L10n.GarageProfileEdit.phone) {
                    TextField(L10n.GarageProfileEdit.phone, text: $phone)
                        .keyboardType(.phonePad)
                }

                Section(L10n.GarageProfileEdit.coverageRadius) {
                    HStack {
                        Slider(value: $coverageRadius, in: 5...50, step: 5)
                            .tint(.carlibPrimaryBlue)
                        Text("\(Int(coverageRadius)) km")
                            .font(CarlibFont.body(.medium))
                            .frame(width: 60)
                    }
                }

                Section(L10n.GarageProfileEdit.specialties) {
                    ForEach(RepairSpecialty.allCases, id: \.self) { specialty in
                        Button {
                            if selectedSpecialties.contains(specialty) {
                                selectedSpecialties.remove(specialty)
                            } else {
                                selectedSpecialties.insert(specialty)
                            }
                        } label: {
                            HStack {
                                Text(specialty.localizedName)
                                    .foregroundStyle(.primary)
                                Spacer()
                                if selectedSpecialties.contains(specialty) {
                                    RemixIcon.checkLine.view(size: 16, color: .carlibPrimaryBlue)
                                }
                            }
                        }
                    }
                }
            }
            .navigationTitle(Text(verbatim: L10n.GarageProfileEdit.title))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(L10n.Common.cancel) { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button(L10n.GarageProfileEdit.save) {
                        // In-memory only for MVP — no persistence
                        dismiss()
                    }
                    .fontWeight(.medium)
                }
            }
        }
    }
}

#Preview {
    GarageProfileEditView(garage: MockData.garages[0])
}
