import SwiftUI

/// Vehicle detail — displays vehicle info plus ownership actions:
/// "Set as default" (hidden when the vehicle is already the default) and
/// "Delete vehicle" (red, confirmed via alert). Both write back to the
/// injected `ClaimStore`. Delete pops the nav stack on success.
struct VehicleDetailView: View {
    @Environment(ClaimStore.self) private var claimStore
    @Environment(\.dismiss) private var dismiss

    let vehicle: Vehicle

    @State private var showDeleteConfirm = false

    /// Re-read from the store so the isDefault state stays fresh after the
    /// user taps "Set as default" without popping the screen.
    private var current: Vehicle {
        claimStore.vehicles.first(where: { $0.id == vehicle.id }) ?? vehicle
    }

    var body: some View {
        List {
            Section {
                HStack(spacing: 14) {
                    CarBrandLogo(brand: current.info.brand, size: 44)
                        .frame(width: 56, height: 56)
                        .background(Color.tileSecondary, in: Circle())

                    VStack(alignment: .leading, spacing: 2) {
                        HStack(spacing: 6) {
                            Text(verbatim: "\(current.info.brand) \(current.info.model)")
                                .font(CarlibFont.title())
                                .foregroundStyle(.carlibDark)
                            if current.isDefault {
                                Text(verbatim: "Default")
                                    .font(CarlibFont.caption(.medium))
                                    .foregroundStyle(.black)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 2)
                                    .background(Color.brandYellow, in: Capsule())
                            }
                        }
                        if let year = current.info.year {
                            Text(verbatim: "\(year)")
                                .font(CarlibFont.caption())
                                .foregroundStyle(.carlibSecondary)
                        }
                    }
                }
            }

            Section {
                row(label: L10n.VehicleDetail.plate, value: current.info.licensePlate)
                row(label: L10n.VehicleDetail.brand, value: current.info.brand)
                row(label: L10n.VehicleDetail.model, value: current.info.model)
                if let year = current.info.year {
                    row(label: L10n.VehicleDetail.year, value: "\(year)")
                }
                row(label: L10n.VehicleDetail.color, value: current.info.color)
            }

            Section {
                if !current.isDefault {
                    Button {
                        withAnimation {
                            claimStore.setDefaultVehicle(id: current.id)
                        }
                        UINotificationFeedbackGenerator().notificationOccurred(.success)
                    } label: {
                        Label {
                            Text(verbatim: "Set as default")
                                .foregroundStyle(.carlibDark)
                        } icon: {
                            RemixIcon.starLine.view(size: 18, color: .brandYellow)
                        }
                    }
                }

                Button(role: .destructive) {
                    showDeleteConfirm = true
                } label: {
                    Label {
                        Text(verbatim: "Delete vehicle")
                    } icon: {
                        RemixIcon.deleteBinLine.view(size: 18, color: .destructiveRed)
                    }
                }
            }
        }
        .navigationTitle(Text(verbatim: L10n.VehicleDetail.title))
        .navigationBarTitleDisplayMode(.inline)
        .alert(
            Text(verbatim: "Delete this vehicle?"),
            isPresented: $showDeleteConfirm
        ) {
            Button(L10n.Common.cancel, role: .cancel) { }
            Button(L10n.Common.delete, role: .destructive) {
                claimStore.removeVehicle(id: current.id)
                dismiss()
            }
        } message: {
            Text(verbatim: "This will remove \(current.info.brand) \(current.info.model) from your garage. This action can't be undone.")
        }
    }

    private func row(label: String, value: String) -> some View {
        HStack {
            Text(verbatim: label)
                .font(CarlibFont.body())
                .foregroundStyle(.carlibSecondary)
            Spacer()
            Text(verbatim: value)
                .font(CarlibFont.body(.medium))
                .foregroundStyle(.carlibDark)
        }
    }
}

#Preview {
    NavigationStack {
        VehicleDetailView(vehicle: MockData.vehicles[0])
    }
    .environment(ClaimStore())
}
