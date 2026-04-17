import Foundation
import CoreLocation

/// Static mock data for lo-fi screens. All content in French with realistic Paris-area data.
enum MockData {

    // MARK: - Vehicles

    static let vehicleClio = VehicleInfo(
        licensePlate: "AA-123-BB",
        brand: "Renault",
        model: "Clio V",
        year: 2021,
        color: "Gris Platine"
    )

    static let vehicle308 = VehicleInfo(
        licensePlate: "BC-456-CD",
        brand: "Peugeot",
        model: "308",
        year: 2019,
        color: "Bleu Virtuel"
    )

    static let vehicleGolf = VehicleInfo(
        licensePlate: "DE-789-EF",
        brand: "Volkswagen",
        model: "Golf 8",
        year: 2022,
        color: "Noir Intense"
    )

    // MARK: - User Vehicles
    // Realistic household: one daily driver, one secondary. Multi-vehicle is an edge
    // case the UI should handle, but the seed models the common case.

    static let vehicles: [Vehicle] = [
        Vehicle(
            id: UUID(uuidString: "20000001-0000-0000-0000-000000000001")!,
            info: vehicle308,
            nickname: "Daily",
            isDefault: true
        ),
        Vehicle(
            id: UUID(uuidString: "20000002-0000-0000-0000-000000000002")!,
            info: vehicleClio,
            nickname: nil,
            isDefault: false
        ),
    ]

    // MARK: - Garages

    static let garages: [Garage] = [
        Garage(
            id: UUID(uuidString: "00000001-0000-0000-0000-000000000001")!,
            name: "Carrosserie Dupont",
            address: "47 rue de la Roquette, 75011 Paris",
            location: CLLocationCoordinate2D(latitude: 48.8566, longitude: 2.3746),
            phone: "01 43 55 12 34",
            specialties: [.bodywork, .painting],
            photos: [],
            rating: 4.5,
            reviewCount: 47,
            isAvailable: true,
            coverageRadiusKm: 15
        ),
        Garage(
            id: UUID(uuidString: "00000002-0000-0000-0000-000000000002")!,
            name: "Garage Martin & Fils",
            address: "12 avenue Daumesnil, 75012 Paris",
            location: CLLocationCoordinate2D(latitude: 48.8432, longitude: 2.3725),
            phone: "01 44 67 89 01",
            specialties: [.bodywork, .painting, .mechanics, .windshield],
            photos: [],
            rating: 4.8,
            reviewCount: 89,
            isAvailable: true,
            coverageRadiusKm: 20
        ),
        Garage(
            id: UUID(uuidString: "00000003-0000-0000-0000-000000000003")!,
            name: "Auto Repair Express",
            address: "85 boulevard Voltaire, 75011 Paris",
            location: CLLocationCoordinate2D(latitude: 48.8610, longitude: 2.3680),
            phone: "01 55 28 90 12",
            specialties: [.bodywork, .mechanics],
            photos: [],
            rating: 4.2,
            reviewCount: 23,
            isAvailable: true,
            coverageRadiusKm: 10
        ),
        Garage(
            id: UUID(uuidString: "00000004-0000-0000-0000-000000000004")!,
            name: "SOS Carrosserie Paris 12",
            address: "156 rue de Charenton, 75012 Paris",
            location: CLLocationCoordinate2D(latitude: 48.8395, longitude: 2.3890),
            phone: "01 43 42 11 22",
            specialties: [.bodywork],
            photos: [],
            rating: 3.9,
            reviewCount: 12,
            isAvailable: false,
            coverageRadiusKm: 8
        ),
    ]

    /// Simulated distances from user (km).
    static let garageDistances: [UUID: Double] = [
        UUID(uuidString: "00000001-0000-0000-0000-000000000001")!: 2.3,
        UUID(uuidString: "00000002-0000-0000-0000-000000000002")!: 1.8,
        UUID(uuidString: "00000003-0000-0000-0000-000000000003")!: 5.1,
        UUID(uuidString: "00000004-0000-0000-0000-000000000004")!: 8.4,
    ]

    // MARK: - Claims

    static let claims: [Claim] = [
        // Draft — just started
        Claim(
            id: UUID(uuidString: "10000001-0000-0000-0000-000000000001")!,
            status: .draft,
            accidentType: .collision,
            description: "Collision à un carrefour, pare-chocs arrière enfoncé",
            photos: [],
            location: CLLocationCoordinate2D(latitude: 48.8566, longitude: 2.3522),
            vehicleInfo: vehicleClio,
            createdAt: .daysFromNow(0),
            updatedAt: .daysFromNow(0)
        ),
        // Submitted — waiting for match
        Claim(
            id: UUID(uuidString: "10000002-0000-0000-0000-000000000002")!,
            status: .submitted,
            accidentType: .parking,
            description: "Rayure profonde côté passager sur parking souterrain",
            photos: [
                PhotoAttachment(caption: "Côté passager"),
                PhotoAttachment(caption: "Détail rayure"),
                PhotoAttachment(caption: "Vue arrière"),
            ],
            location: CLLocationCoordinate2D(latitude: 48.8601, longitude: 2.3500),
            vehicleInfo: vehicle308,
            createdAt: .daysFromNow(-1),
            updatedAt: .daysFromNow(-1)
        ),
        // Accepted — garage assigned, booking pending
        Claim(
            id: UUID(uuidString: "10000003-0000-0000-0000-000000000003")!,
            status: .accepted,
            accidentType: .collision,
            description: "Accrochage en marche arrière, aile avant gauche touchée",
            photos: [
                PhotoAttachment(caption: "Aile avant gauche"),
                PhotoAttachment(caption: "Vue de face"),
            ],
            location: CLLocationCoordinate2D(latitude: 48.8450, longitude: 2.3750),
            vehicleInfo: vehicleClio,
            assignedGarageId: UUID(uuidString: "00000001-0000-0000-0000-000000000001")!,
            bookingStatus: .confirmed,
            createdAt: .daysFromNow(-3),
            updatedAt: .daysFromNow(-1)
        ),
        // In repair
        Claim(
            id: UUID(uuidString: "10000004-0000-0000-0000-000000000004")!,
            status: .repairing,
            accidentType: .vandalism,
            description: "Rétroviseur arraché et portière rayée — acte de vandalisme",
            photos: [
                PhotoAttachment(caption: "Rétroviseur"),
                PhotoAttachment(caption: "Portière"),
                PhotoAttachment(caption: "Vue d'ensemble"),
            ],
            location: CLLocationCoordinate2D(latitude: 48.8530, longitude: 2.3690),
            vehicleInfo: vehicleGolf,
            assignedGarageId: UUID(uuidString: "00000002-0000-0000-0000-000000000002")!,
            bookingStatus: .vehicleDroppedOff,
            repairStatus: .repairing,
            createdAt: .daysFromNow(-7),
            updatedAt: .daysFromNow(-1)
        ),
        // Completed
        Claim(
            id: UUID(uuidString: "10000005-0000-0000-0000-000000000005")!,
            status: .completed,
            accidentType: .weather,
            description: "Grêle — nombreux impacts sur le capot et le toit",
            photos: [
                PhotoAttachment(caption: "Capot"),
                PhotoAttachment(caption: "Toit"),
            ],
            location: CLLocationCoordinate2D(latitude: 48.8650, longitude: 2.3400),
            vehicleInfo: vehicle308,
            assignedGarageId: UUID(uuidString: "00000002-0000-0000-0000-000000000002")!,
            bookingStatus: .vehicleDroppedOff,
            repairStatus: .readyForPickup,
            createdAt: .daysFromNow(-21),
            updatedAt: .daysFromNow(-2)
        ),
        // Cancelled
        Claim(
            id: UUID(uuidString: "10000006-0000-0000-0000-000000000006")!,
            status: .cancelled,
            accidentType: .other,
            description: "Sinistre annulé — prise en charge directe par l'assurance",
            photos: [],
            vehicleInfo: vehicleClio,
            createdAt: .daysFromNow(-14),
            updatedAt: .daysFromNow(-12)
        ),
    ]

    /// Claims filtered for driver "active" view.
    static var activeClaims: [Claim] {
        claims.filter { [.submitted, .matched, .accepted, .inProgress, .repairing].contains($0.status) }
    }

    /// Claims filtered for driver "completed" view.
    static var pastClaims: [Claim] {
        claims.filter { [.completed, .cancelled, .expired].contains($0.status) }
    }

    /// Claims visible to garages (available to accept).
    static var availableClaims: [Claim] {
        claims.filter { [.submitted, .matched].contains($0.status) }
    }

    /// Claims already accepted by a garage.
    static var garageClaims: [Claim] {
        claims.filter { [.accepted, .inProgress, .repairing, .completed].contains($0.status) && $0.assignedGarageId != nil }
    }

    // MARK: - Time Slots

    static var timeSlots: [TimeSlot] {
        let garageId = UUID(uuidString: "00000001-0000-0000-0000-000000000001")!
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: .now)

        return (0..<5).flatMap { dayOffset -> [TimeSlot] in
            guard let date = calendar.date(byAdding: .day, value: dayOffset, to: today) else { return [] }
            return [
                TimeSlot(
                    garageId: garageId,
                    date: date,
                    startTime: calendar.date(bySettingHour: 9, minute: 0, second: 0, of: date) ?? date,
                    endTime: calendar.date(bySettingHour: 10, minute: 30, second: 0, of: date) ?? date,
                    isAvailable: dayOffset != 1,
                    isBlocked: false
                ),
                TimeSlot(
                    garageId: garageId,
                    date: date,
                    startTime: calendar.date(bySettingHour: 11, minute: 0, second: 0, of: date) ?? date,
                    endTime: calendar.date(bySettingHour: 12, minute: 30, second: 0, of: date) ?? date,
                    isAvailable: true,
                    isBlocked: dayOffset == 3
                ),
                TimeSlot(
                    garageId: garageId,
                    date: date,
                    startTime: calendar.date(bySettingHour: 14, minute: 0, second: 0, of: date) ?? date,
                    endTime: calendar.date(bySettingHour: 15, minute: 30, second: 0, of: date) ?? date,
                    isAvailable: dayOffset != 0,
                    isBlocked: false
                ),
            ]
        }
    }

    // MARK: - Helpers

    static func garage(for id: UUID?) -> Garage? {
        guard let id else { return nil }
        return garages.first { $0.id == id }
    }

    static func distance(for garageId: UUID) -> Double {
        garageDistances[garageId] ?? 0
    }
}
