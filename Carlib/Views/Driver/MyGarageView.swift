import SwiftUI

/// "My Garage" — game-like view where users see their cars
/// as 3D-perspective cards they can swipe through.
struct MyGarageView: View {
    @Environment(ClaimStore.self) private var claimStore
    @State private var selectedIndex: Int = 0
    @State private var showAddVehicle = false

    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("MY GARAGE")
                        .sectionHeaderStyle()
                    Text("\(claimStore.vehicles.count) vehicle\(claimStore.vehicles.count == 1 ? "" : "s")")
                        .font(CarlibFont.caption())
                        .foregroundStyle(.carlibSecondary)
                }
                Spacer()
                Button {
                    showAddVehicle = true
                } label: {
                    RemixIcon.addCircleFill.view(size: 24, color: .carlibPrimaryBlue)
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
            .padding(.bottom, 8)

            if claimStore.vehicles.isEmpty {
                emptyGarage
            } else {
                // 3D Car Card Carousel. Page dots drawn custom below so they
                // adapt to the light theme and don't hug the card edge.
                TabView(selection: $selectedIndex) {
                    ForEach(Array(claimStore.vehicles.enumerated()), id: \.element.id) { index, vehicle in
                        VehicleCard3D(
                            vehicle: vehicle,
                            isDefault: vehicle.isDefault,
                            onSetDefault: {
                                withAnimation(.spring(response: 0.4)) {
                                    claimStore.setDefaultVehicle(id: vehicle.id)
                                }
                            }
                        )
                        .tag(index)
                    }
                }
                .tabViewStyle(.page(indexDisplayMode: .never))
                .frame(height: 300)

                if claimStore.vehicles.count > 1 {
                    pageDots
                        .padding(.top, 4)
                        .padding(.bottom, 8)
                }

                // Vehicle info below card
                if selectedIndex < claimStore.vehicles.count {
                    vehicleInfoPanel(claimStore.vehicles[selectedIndex])
                }
            }

            Spacer(minLength: 0)
        }
        .background(Color.carlibScreenBg)
        .navigationTitle(Text(verbatim: "My Garage"))
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showAddVehicle) {
            AddVehicleSheet()
        }
    }

    // MARK: - Page Dots

    /// Custom page indicator — SwiftUI's built-in dots use a white tint that
    /// disappears against the light screen background.
    private var pageDots: some View {
        HStack(spacing: 6) {
            ForEach(0..<claimStore.vehicles.count, id: \.self) { index in
                Circle()
                    .fill(index == selectedIndex ? Color.carlibDark : Color.carlibCardBorder)
                    .frame(width: index == selectedIndex ? 8 : 6, height: index == selectedIndex ? 8 : 6)
                    .animation(.spring(response: 0.3, dampingFraction: 0.7), value: selectedIndex)
            }
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - Empty State

    private var emptyGarage: some View {
        VStack(spacing: 20) {
            Spacer()
            RemixIcon.carLine.view(size: 64, color: .carlibSecondary.opacity(0.3))

            Text("No vehicles yet")
                .font(CarlibFont.title())
                .foregroundStyle(.carlibDark)

            Text("Add your first car to get started")
                .font(CarlibFont.body())
                .foregroundStyle(.carlibSecondary)

            CarlibButton(label: "Add Vehicle", icon: .addLine, variant: .primary) {
                showAddVehicle = true
            }
            .padding(.horizontal, 40)

            Spacer()
        }
    }

    // MARK: - Info Panel

    private func vehicleInfoPanel(_ vehicle: Vehicle) -> some View {
        VStack(spacing: 16) {
            // Quick stats row
            HStack(spacing: 0) {
                statItem(
                    value: "\(vehicle.info.year ?? 0)",
                    label: "YEAR"
                )
                Divider()
                    .frame(height: 32)
                    .overlay(Color.carlibCardBorder)
                statItem(
                    value: vehicle.info.color,
                    label: "COLOR"
                )
                Divider()
                    .frame(height: 32)
                    .overlay(Color.carlibCardBorder)
                statItem(
                    value: vehicle.info.licensePlate,
                    label: "PLATE"
                )
            }
            .padding(.vertical, 12)
            .background(Color.tileSecondary, in: RoundedRectangle(cornerRadius: CarlibRadius.lg))
            .padding(.horizontal, 20)

            // Active claims for this vehicle
            let vehicleClaims = claimStore.activeClaims.filter {
                $0.vehicleInfo?.licensePlate == vehicle.info.licensePlate
            }

            if !vehicleClaims.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text("ACTIVE CLAIMS")
                        .sectionHeaderStyle()
                        .padding(.horizontal, 20)

                    ForEach(vehicleClaims) { claim in
                        HStack {
                            CarlibStatusBadge(claimStatus: claim.status)
                            Spacer()
                            if let type = claim.accidentType {
                                Text(type.localizedName)
                                    .font(CarlibFont.caption())
                                    .foregroundStyle(.carlibSecondary)
                            }
                        }
                        .padding(.horizontal, 20)
                        .padding(.vertical, 8)
                    }
                }
            }
        }
        .padding(.top, 8)
    }

    private func statItem(value: String, label: String) -> some View {
        VStack(spacing: 4) {
            Text(value)
                .font(CarlibFont.body(.medium))
                .foregroundStyle(.carlibDark)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
            Text(label)
                .font(CarlibFont.label())
                .tracking(0.8)
                .foregroundStyle(.carlibLabel)
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - 3D Vehicle Card

struct VehicleCard3D: View {
    let vehicle: Vehicle
    let isDefault: Bool
    var onSetDefault: () -> Void

    @State private var appeared = false

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 24)
                .fill(Color.tileSecondary)
                .overlay {
                    RoundedRectangle(cornerRadius: 24)
                        .strokeBorder(Color.carlibCardBorder, lineWidth: 1)
                }

            VStack(alignment: .leading, spacing: 0) {
                // Top: Default badge + set-default action
                HStack {
                    if isDefault {
                        Text("DEFAULT")
                            .font(CarlibFont.label())
                            .tracking(1)
                            .foregroundStyle(.brandYellow)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(Color.brandYellow.opacity(0.15), in: Capsule())
                    }
                    Spacer()
                    if !isDefault {
                        Button {
                            onSetDefault()
                        } label: {
                            Text("Set Default")
                                .font(CarlibFont.caption(.medium))
                                .foregroundStyle(.carlibSecondary)
                        }
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 20)

                Spacer()

                // Center: real brand logo, not a placeholder icon.
                HStack {
                    Spacer()
                    CarBrandLogo(brand: vehicle.info.brand, size: 120)
                        .rotation3DEffect(.degrees(appeared ? 0 : -15), axis: (x: 0, y: 1, z: 0))
                        .scaleEffect(appeared ? 1.0 : 0.9)
                    Spacer()
                }

                Spacer()

                // Bottom: nickname (optional), vehicle name, plate badge.
                HStack(alignment: .bottom) {
                    VStack(alignment: .leading, spacing: 4) {
                        if let nickname = vehicle.nickname {
                            Text(nickname)
                                .font(CarlibFont.caption(.medium))
                                .foregroundStyle(.brandYellow)
                        }
                        Text(verbatim: "\(vehicle.info.brand) \(vehicle.info.model)")
                            .font(CarlibFont.title())
                            .foregroundStyle(.carlibDark)
                    }

                    Spacer()

                    Text(vehicle.info.licensePlate)
                        .font(CarlibFont.caption(.medium))
                        .foregroundStyle(.carlibDark)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Color.carlibScreenBg, in: RoundedRectangle(cornerRadius: 8))
                        .overlay {
                            RoundedRectangle(cornerRadius: 8)
                                .strokeBorder(Color.carlibCardBorder, lineWidth: 1)
                        }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 20)
            }
        }
        .frame(height: 280)
        .padding(.horizontal, 24)
        .rotation3DEffect(.degrees(2), axis: (x: 1, y: 0, z: 0), perspective: 0.5)
        .shadow(color: .black.opacity(isDefault ? 0.10 : 0.05), radius: 20, y: 10)
        .onAppear {
            withAnimation(.spring(response: 0.6, dampingFraction: 0.7).delay(0.1)) {
                appeared = true
            }
        }
    }
}

// MARK: - Add Vehicle Sheet

struct AddVehicleSheet: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(ClaimStore.self) private var claimStore

    @State private var plate = ""
    @State private var brand = ""
    @State private var model = ""
    @State private var year = ""
    @State private var color = ""
    @State private var nickname = ""

    var body: some View {
        NavigationStack {
            Form {
                Section("Vehicle Details") {
                    TextField("License Plate", text: $plate)
                        .textInputAutocapitalization(.characters)
                    TextField("Brand", text: $brand)
                    TextField("Model", text: $model)
                    TextField("Year", text: $year)
                        .keyboardType(.numberPad)
                    TextField("Color", text: $color)
                }

                Section("Optional") {
                    TextField("Nickname (e.g. Daily, Weekend)", text: $nickname)
                }
            }
            .navigationTitle("Add Vehicle")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(L10n.Common.cancel) { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button(L10n.Common.save) {
                        let info = VehicleInfo(
                            licensePlate: plate,
                            brand: brand,
                            model: model,
                            year: Int(year),
                            color: color
                        )
                        let vehicle = Vehicle(
                            info: info,
                            nickname: nickname.isEmpty ? nil : nickname
                        )
                        claimStore.addVehicle(vehicle)
                        dismiss()
                    }
                    .disabled(plate.isEmpty || brand.isEmpty || model.isEmpty)
                    .fontWeight(.medium)
                }
            }
        }
        .presentationDetents([.medium, .large])
    }
}

#Preview {
    NavigationStack {
        MyGarageView()
            .environment(ClaimStore())
    }
}
