import Foundation
import CoreLocation

/// A carrosserie registered on the platform.
struct Garage: Identifiable, Codable {
    let id: UUID
    var name: String
    var address: String
    var location: CLLocationCoordinate2D
    var phone: String
    var specialties: [RepairSpecialty]
    var photos: [PhotoAttachment]
    var rating: Double?
    var reviewCount: Int
    var isAvailable: Bool
    var coverageRadiusKm: Double

    init(
        id: UUID = UUID(),
        name: String = "",
        address: String = "",
        location: CLLocationCoordinate2D = CLLocationCoordinate2D(latitude: 0, longitude: 0),
        phone: String = "",
        specialties: [RepairSpecialty] = [],
        photos: [PhotoAttachment] = [],
        rating: Double? = nil,
        reviewCount: Int = 0,
        isAvailable: Bool = true,
        coverageRadiusKm: Double = 20
    ) {
        self.id = id
        self.name = name
        self.address = address
        self.location = location
        self.phone = phone
        self.specialties = specialties
        self.photos = photos
        self.rating = rating
        self.reviewCount = reviewCount
        self.isAvailable = isAvailable
        self.coverageRadiusKm = coverageRadiusKm
    }
}

enum RepairSpecialty: String, Codable, CaseIterable {
    case bodywork = "carrosserie"
    case painting = "peinture"
    case mechanics = "mecanique"
    case windshield = "vitrage"
    case detailing = "detailing"

    var localizedName: String {
        switch self {
        case .bodywork: L10n.Specialty.bodywork
        case .painting: L10n.Specialty.painting
        case .mechanics: L10n.Specialty.mechanics
        case .windshield: L10n.Specialty.windshield
        case .detailing: L10n.Specialty.detailing
        }
    }
}
