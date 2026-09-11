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
}
