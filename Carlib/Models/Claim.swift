import Foundation
import CoreLocation

/// A sinistre declaration created by a driver.
struct Claim: Identifiable, Codable {
    let id: UUID
    var status: ClaimStatus
    var accidentType: AccidentType?
    var description: String
    var photos: [PhotoAttachment]
    var location: CLLocationCoordinate2D?
    var vehicleInfo: VehicleInfo?
    var assignedGarageId: UUID?
    var bookingStatus: BookingStatus?
    var repairStatus: RepairStatus?
    var driverName: String?
    var driverPhone: String?
    var createdAt: Date
    var updatedAt: Date

    init(
        id: UUID = UUID(),
        status: ClaimStatus = .draft,
        accidentType: AccidentType? = nil,
        description: String = "",
        photos: [PhotoAttachment] = [],
        location: CLLocationCoordinate2D? = nil,
        vehicleInfo: VehicleInfo? = nil,
        assignedGarageId: UUID? = nil,
        bookingStatus: BookingStatus? = nil,
        repairStatus: RepairStatus? = nil,
        driverName: String? = nil,
        driverPhone: String? = nil,
        createdAt: Date = .now,
        updatedAt: Date = .now
    ) {
        self.id = id
        self.status = status
        self.accidentType = accidentType
        self.description = description
        self.photos = photos
        self.location = location
        self.vehicleInfo = vehicleInfo
        self.assignedGarageId = assignedGarageId
        self.bookingStatus = bookingStatus
        self.repairStatus = repairStatus
        self.driverName = driverName
        self.driverPhone = driverPhone
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}

enum AccidentType: String, Codable, CaseIterable {
    case collision = "collision"
    case parking = "stationnement"
    case vandalism = "vandalisme"
    case weather = "intemperies"
    case other = "autre"

    var localizedName: String {
        switch self {
        case .collision: L10n.AccidentTypeLabel.collision
        case .parking: L10n.AccidentTypeLabel.parking
        case .vandalism: L10n.AccidentTypeLabel.vandalism
        case .weather: L10n.AccidentTypeLabel.weather
        case .other: L10n.AccidentTypeLabel.other
        }
    }
}

struct PhotoAttachment: Identifiable, Codable {
    let id: UUID
    var imageData: Data?
    var caption: String
    var timestamp: Date

    init(id: UUID = UUID(), imageData: Data? = nil, caption: String = "", timestamp: Date = .now) {
        self.id = id
        self.imageData = imageData
        self.caption = caption
        self.timestamp = timestamp
    }
}

struct VehicleInfo: Codable, Hashable {
    var licensePlate: String
    var brand: String
    var model: String
    var year: Int?
    var color: String
}

// MARK: - CLLocationCoordinate2D Codable

extension CLLocationCoordinate2D: @retroactive Codable {
    enum CodingKeys: String, CodingKey {
        case latitude, longitude
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let latitude = try container.decode(Double.self, forKey: .latitude)
        let longitude = try container.decode(Double.self, forKey: .longitude)
        self.init(latitude: latitude, longitude: longitude)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(latitude, forKey: .latitude)
        try container.encode(longitude, forKey: .longitude)
    }
}

// MARK: - Claim Hashable (required for NavigationPath)

extension Claim: Hashable {
    static func == (lhs: Claim, rhs: Claim) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }
}
