import SwiftUI

/// Vehicle detail — displays vehicle info, read-only for MVP.
struct VehicleDetailView: View {
    let vehicle: VehicleInfo

    var body: some View {
        List {
            Section {
                HStack(spacing: 14) {
                    CarBrandLogo(brand: vehicle.brand, size: 44)
                        .frame(width: 56, height: 56)
                        .background(Color.tileSecondary, in: Circle())

                    VStack(alignment: .leading, spacing: 2) {
                        Text(verbatim: "\(vehicle.brand) \(vehicle.model)")
                            .font(CarlibFont.title())
                            .foregroundStyle(.carlibDark)
                        if let year = vehicle.year {
                            Text(verbatim: "\(year)")
                                .font(CarlibFont.caption())
                                .foregroundStyle(.carlibSecondary)
                        }
                    }
                }
            }

            Section {
                row(label: L10n.VehicleDetail.plate, value: vehicle.licensePlate)
                row(label: L10n.VehicleDetail.brand, value: vehicle.brand)
                row(label: L10n.VehicleDetail.model, value: vehicle.model)
                if let year = vehicle.year {
                    row(label: L10n.VehicleDetail.year, value: "\(year)")
                }
                row(label: L10n.VehicleDetail.color, value: vehicle.color)
            }
        }
        .navigationTitle(Text(verbatim: L10n.VehicleDetail.title))
        .navigationBarTitleDisplayMode(.inline)
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
        VehicleDetailView(vehicle: MockData.vehicle308)
    }
}
