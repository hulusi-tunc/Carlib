import Foundation

/// A user's vehicle — separate from VehicleInfo (which is claim-level data).
/// Users can own multiple vehicles.
struct Vehicle: Identifiable, Codable, Hashable {
    let id: UUID
    var info: VehicleInfo
    var nickname: String?
    var isDefault: Bool

    init(
        id: UUID = UUID(),
        info: VehicleInfo,
        nickname: String? = nil,
        isDefault: Bool = false
    ) {
        self.id = id
        self.info = info
        self.nickname = nickname
        self.isDefault = isDefault
    }

    var displayName: String {
        nickname ?? "\(info.brand) \(info.model)"
    }

    /// SF Symbol for the vehicle type — visual variety in the garage.
    var iconName: String {
        let brand = info.brand.lowercased()
        if brand.contains("tesla") { return "car.side" }
        if brand.contains("bmw") || brand.contains("mercedes") || brand.contains("audi") { return "car.side" }
        return "car.side"
    }
}
