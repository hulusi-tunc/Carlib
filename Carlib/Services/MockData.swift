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

    static let vehicleC3 = VehicleInfo(
        licensePlate: "FG-012-HI",
        brand: "Citroën",
        model: "C3",
        year: 2023,
        color: "Rouge Élixir"
    )

    // MARK: - User Vehicles

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
            nickname: "Weekend",
            isDefault: false
        ),
        Vehicle(
            id: UUID(uuidString: "20000003-0000-0000-0000-000000000003")!,
            info: vehicleC3,
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
            specialties: [.bodywork, .painting, .detailing],
            photos: [
                PhotoAttachment(caption: "Devanture"),
                PhotoAttachment(caption: "Baie de carrosserie"),
                PhotoAttachment(caption: "Cabine de peinture"),
                PhotoAttachment(caption: "Espace d'accueil"),
            ],
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
            isAvailable: false,
            coverageRadiusKm: 8
        ),
        Garage(
            id: UUID(uuidString: "00000005-0000-0000-0000-000000000005")!,
            name: "Atelier des Batignolles",
            address: "38 rue des Batignolles, 75017 Paris",
            location: CLLocationCoordinate2D(latitude: 48.8847, longitude: 2.3218),
            phone: "01 42 93 56 18",
            specialties: [.bodywork, .painting, .mechanics, .windshield, .detailing],
            photos: [
                PhotoAttachment(caption: "Façade atelier"),
                PhotoAttachment(caption: "Cabine de peinture"),
                PhotoAttachment(caption: "Zone carrosserie"),
                PhotoAttachment(caption: "Accueil client"),
            ],
            isAvailable: true,
            coverageRadiusKm: 25
        ),
        Garage(
            id: UUID(uuidString: "00000006-0000-0000-0000-000000000006")!,
            name: "Carrosserie République",
            address: "5 rue de Bretagne, 75003 Paris",
            location: CLLocationCoordinate2D(latitude: 48.8632, longitude: 2.3621),
            phone: "01 48 87 24 65",
            specialties: [.detailing],
            photos: [
                PhotoAttachment(caption: "Atelier detailing"),
                PhotoAttachment(caption: "Finition"),
            ],
            isAvailable: true,
            coverageRadiusKm: 12
        ),
    ]

    /// Simulated distances from user (km).
    static let garageDistances: [UUID: Double] = [
        UUID(uuidString: "00000001-0000-0000-0000-000000000001")!: 2.3,
        UUID(uuidString: "00000002-0000-0000-0000-000000000002")!: 1.8,
        UUID(uuidString: "00000003-0000-0000-0000-000000000003")!: 5.1,
        UUID(uuidString: "00000004-0000-0000-0000-000000000004")!: 8.4,
        UUID(uuidString: "00000005-0000-0000-0000-000000000005")!: 3.6,
        UUID(uuidString: "00000006-0000-0000-0000-000000000006")!: 0.9,
    ]

    /// Years the shop has been operating (shown in Garage Profile stats).
    static let garageYearsActive: [UUID: Int] = [
        UUID(uuidString: "00000001-0000-0000-0000-000000000001")!: 12,
        UUID(uuidString: "00000002-0000-0000-0000-000000000002")!: 27,
        UUID(uuidString: "00000003-0000-0000-0000-000000000003")!: 6,
        UUID(uuidString: "00000004-0000-0000-0000-000000000004")!: 4,
        UUID(uuidString: "00000005-0000-0000-0000-000000000005")!: 18,
        UUID(uuidString: "00000006-0000-0000-0000-000000000006")!: 3,
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
            createdAt: .hoursFromNow(-2),
            updatedAt: .hoursFromNow(-2)
        ),
        // Matched — inbound request fresh in the inbox
        Claim(
            id: UUID(uuidString: "10000010-0000-0000-0000-000000000010")!,
            status: .matched,
            accidentType: .collision,
            description: "Collision par l'arrière à un feu rouge, coffre enfoncé",
            photos: [
                PhotoAttachment(caption: "Coffre"),
                PhotoAttachment(caption: "Pare-chocs arrière"),
            ],
            location: CLLocationCoordinate2D(latitude: 48.8558, longitude: 2.3700),
            vehicleInfo: vehicleGolf,
            driverName: "Marie Bernard",
            driverPhone: "+33 6 45 67 89 10",
            createdAt: .hoursFromNow(-4),
            updatedAt: .hoursFromNow(-4)
        ),
        // Submitted — minor glass break, been waiting a while
        Claim(
            id: UUID(uuidString: "10000011-0000-0000-0000-000000000011")!,
            status: .submitted,
            accidentType: .vandalism,
            description: "Vitre latérale arrière brisée pendant la nuit",
            photos: [
                PhotoAttachment(caption: "Vitre cassée"),
            ],
            location: CLLocationCoordinate2D(latitude: 48.8470, longitude: 2.3820),
            vehicleInfo: vehicleClio,
            driverName: "Thomas Petit",
            driverPhone: "+33 6 98 76 54 32",
            createdAt: .hoursFromNow(-12),
            updatedAt: .hoursFromNow(-12)
        ),
        // Matched — urgent, just came in
        Claim(
            id: UUID(uuidString: "10000012-0000-0000-0000-000000000012")!,
            status: .matched,
            accidentType: .collision,
            description: "Aile avant droite à remplacer suite à choc latéral",
            photos: [
                PhotoAttachment(caption: "Aile avant droite"),
                PhotoAttachment(caption: "Détail dommage"),
                PhotoAttachment(caption: "Plaque arrachée"),
            ],
            location: CLLocationCoordinate2D(latitude: 48.8590, longitude: 2.3680),
            vehicleInfo: vehicle308,
            driverName: "Léa Moreau",
            driverPhone: "+33 6 11 22 33 44",
            createdAt: .hoursFromNow(-1),
            updatedAt: .hoursFromNow(-1)
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
            driverName: "Laurent Cassagne",
            driverPhone: "+33 6 12 34 56 78",
            createdAt: .daysFromNow(-3),
            updatedAt: .daysFromNow(-1)
        ),
        // Accepted — second appointment today at our garage
        Claim(
            id: UUID(uuidString: "10000007-0000-0000-0000-000000000007")!,
            status: .accepted,
            accidentType: .parking,
            description: "Portière arrière enfoncée sur parking de supermarché",
            photos: [
                PhotoAttachment(caption: "Portière arrière"),
            ],
            location: CLLocationCoordinate2D(latitude: 48.8490, longitude: 2.3780),
            vehicleInfo: vehicle308,
            assignedGarageId: UUID(uuidString: "00000001-0000-0000-0000-000000000001")!,
            bookingStatus: .rescheduled,
            driverName: "Sophie Laurent",
            driverPhone: "+33 6 78 90 12 34",
            createdAt: .daysFromNow(-2),
            updatedAt: .daysFromNow(0)
        ),
        // Accepted — appointment tomorrow at our garage
        Claim(
            id: UUID(uuidString: "10000008-0000-0000-0000-000000000008")!,
            status: .accepted,
            accidentType: .collision,
            description: "Aile avant droite cabossée suite à collision latérale",
            photos: [
                PhotoAttachment(caption: "Aile avant droite"),
                PhotoAttachment(caption: "Vue générale"),
            ],
            location: CLLocationCoordinate2D(latitude: 48.8525, longitude: 2.3695),
            vehicleInfo: vehicleGolf,
            assignedGarageId: UUID(uuidString: "00000001-0000-0000-0000-000000000001")!,
            bookingStatus: .pending,
            driverName: "Philippe Durand",
            driverPhone: "+33 6 23 45 67 89",
            createdAt: .daysFromNow(-1),
            updatedAt: .daysFromNow(0)
        ),
        // In repair — already at our garage
        Claim(
            id: UUID(uuidString: "10000009-0000-0000-0000-000000000009")!,
            status: .repairing,
            accidentType: .vandalism,
            description: "Rayures multiples sur capot et pare-chocs avant",
            photos: [
                PhotoAttachment(caption: "Capot"),
                PhotoAttachment(caption: "Pare-chocs"),
            ],
            location: CLLocationCoordinate2D(latitude: 48.8548, longitude: 2.3702),
            vehicleInfo: vehicleClio,
            assignedGarageId: UUID(uuidString: "00000001-0000-0000-0000-000000000001")!,
            bookingStatus: .vehicleDroppedOff,
            repairStatus: .repairing,
            driverName: "Inès Moreau",
            driverPhone: "+33 6 89 01 23 45",
            createdAt: .daysFromNow(-5),
            updatedAt: .daysFromNow(0)
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
        // Cancelled by driver — insurer took it over directly
        Claim(
            id: UUID(uuidString: "10000006-0000-0000-0000-000000000006")!,
            status: .cancelled,
            accidentType: .other,
            description: "Sinistre annulé — prise en charge directe par l'assurance",
            photos: [],
            vehicleInfo: vehicleClio,
            bookingStatus: .cancelledByDriver,
            createdAt: .daysFromNow(-14),
            updatedAt: .daysFromNow(-12)
        ),
        // In progress — just arrived at the shop, diagnostic underway
        Claim(
            id: UUID(uuidString: "10000013-0000-0000-0000-000000000013")!,
            status: .inProgress,
            accidentType: .collision,
            description: "Choc latéral droit — longeron à évaluer après démontage",
            photos: [
                PhotoAttachment(caption: "Longeron"),
                PhotoAttachment(caption: "Portière avant"),
            ],
            location: CLLocationCoordinate2D(latitude: 48.8560, longitude: 2.3710),
            vehicleInfo: vehicleGolf,
            assignedGarageId: UUID(uuidString: "00000001-0000-0000-0000-000000000001")!,
            bookingStatus: .arrivedAtGarage,
            repairStatus: .diagnostic,
            driverName: "Camille Rousseau",
            driverPhone: "+33 6 54 32 10 98",
            createdAt: .daysFromNow(-4),
            updatedAt: .hoursFromNow(-2)
        ),
        // In progress — waiting on parts from the supplier
        Claim(
            id: UUID(uuidString: "10000014-0000-0000-0000-000000000014")!,
            status: .inProgress,
            accidentType: .collision,
            description: "Pare-chocs avant et optique gauche à remplacer",
            photos: [
                PhotoAttachment(caption: "Pare-chocs"),
                PhotoAttachment(caption: "Optique gauche"),
                PhotoAttachment(caption: "Calandre"),
            ],
            location: CLLocationCoordinate2D(latitude: 48.8480, longitude: 2.3760),
            vehicleInfo: vehicle308,
            assignedGarageId: UUID(uuidString: "00000002-0000-0000-0000-000000000002")!,
            bookingStatus: .vehicleDroppedOff,
            repairStatus: .waitingParts,
            driverName: "Julien Martin",
            driverPhone: "+33 6 44 55 66 77",
            createdAt: .daysFromNow(-6),
            updatedAt: .daysFromNow(-1)
        ),
        // Repairing — quality check before pickup
        Claim(
            id: UUID(uuidString: "10000015-0000-0000-0000-000000000015")!,
            status: .repairing,
            accidentType: .collision,
            description: "Aile arrière gauche redressée et repeinte",
            photos: [
                PhotoAttachment(caption: "Aile arrière"),
                PhotoAttachment(caption: "Zone repeinte"),
            ],
            location: CLLocationCoordinate2D(latitude: 48.8540, longitude: 2.3705),
            vehicleInfo: vehicleClio,
            assignedGarageId: UUID(uuidString: "00000001-0000-0000-0000-000000000001")!,
            bookingStatus: .vehicleDroppedOff,
            repairStatus: .qualityCheck,
            driverName: "Nadia Benali",
            driverPhone: "+33 6 33 22 11 00",
            createdAt: .daysFromNow(-9),
            updatedAt: .hoursFromNow(-6)
        ),
        // Expired — declined by nearby shops, request timed out
        Claim(
            id: UUID(uuidString: "10000016-0000-0000-0000-000000000016")!,
            status: .expired,
            accidentType: .parking,
            description: "Éraflure mineure sur parking — aucun garage n'a répondu dans les délais",
            photos: [
                PhotoAttachment(caption: "Éraflure portière"),
            ],
            vehicleInfo: vehicleC3,
            createdAt: .daysFromNow(-32),
            updatedAt: .daysFromNow(-18)
        ),
        // Cancelled by garage — shop had to decline after accepting
        Claim(
            id: UUID(uuidString: "10000017-0000-0000-0000-000000000017")!,
            status: .cancelled,
            accidentType: .collision,
            description: "Annulée par le garage — atelier en sous-effectif cette semaine",
            photos: [
                PhotoAttachment(caption: "Aile avant"),
            ],
            vehicleInfo: vehicleClio,
            assignedGarageId: UUID(uuidString: "00000003-0000-0000-0000-000000000003")!,
            bookingStatus: .cancelledByGarage,
            createdAt: .daysFromNow(-8),
            updatedAt: .daysFromNow(-5)
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

    /// Time slot seed for the booking flow. Every slot reflects its real state:
    /// - `claimId != nil` → already booked, `isAvailable = false`
    /// - `isBlocked == true` → lunch / vacation, `isAvailable = false`
    /// - otherwise → open, `isAvailable = true`
    ///
    /// Multiple garages are seeded so the driver-side booking flow has options
    /// across different shops, not just Carrosserie Dupont.
    static var timeSlots: [TimeSlot] {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: .now)

        func slot(
            garageId: UUID,
            dayOffset: Int,
            startHour: Int,
            startMinute: Int = 0,
            endHour: Int,
            endMinute: Int = 0,
            claimId: UUID? = nil,
            isBlocked: Bool = false
        ) -> TimeSlot? {
            guard let date = calendar.date(byAdding: .day, value: dayOffset, to: today) else { return nil }
            return TimeSlot(
                garageId: garageId,
                claimId: claimId,
                date: date,
                startTime: calendar.date(bySettingHour: startHour, minute: startMinute, second: 0, of: date) ?? date,
                endTime: calendar.date(bySettingHour: endHour, minute: endMinute, second: 0, of: date) ?? date,
                isAvailable: claimId == nil && !isBlocked,
                isBlocked: isBlocked
            )
        }

        let dupontId    = UUID(uuidString: "00000001-0000-0000-0000-000000000001")!
        let martinId    = UUID(uuidString: "00000002-0000-0000-0000-000000000002")!
        let expressId   = UUID(uuidString: "00000003-0000-0000-0000-000000000003")!
        let batignollesId = UUID(uuidString: "00000005-0000-0000-0000-000000000005")!
        let republiqueId  = UUID(uuidString: "00000006-0000-0000-0000-000000000006")!

        let laurentId  = UUID(uuidString: "10000003-0000-0000-0000-000000000003")!
        let sophieId   = UUID(uuidString: "10000007-0000-0000-0000-000000000007")!
        let philippeId = UUID(uuidString: "10000008-0000-0000-0000-000000000008")!
        let inesId     = UUID(uuidString: "10000009-0000-0000-0000-000000000009")!

        var slots: [TimeSlot?] = []

        // Carrosserie Dupont — signed-in garage. Dense today schedule with
        // linked appointments so the Garage dashboard looks busy.
        slots += [
            // Today — 2 linked + 1 lunch block + 2 open walk-ins
            slot(garageId: dupontId, dayOffset: 0, startHour: 9,  endHour: 10, endMinute: 30, claimId: laurentId),
            slot(garageId: dupontId, dayOffset: 0, startHour: 11, endHour: 12, claimId: sophieId),
            slot(garageId: dupontId, dayOffset: 0, startHour: 12, endHour: 13, isBlocked: true),
            slot(garageId: dupontId, dayOffset: 0, startHour: 15, endHour: 16, endMinute: 30),
            slot(garageId: dupontId, dayOffset: 0, startHour: 17, endHour: 18),
            // Tomorrow — 1 linked + 2 open
            slot(garageId: dupontId, dayOffset: 1, startHour: 9,  endHour: 10, endMinute: 30, claimId: philippeId),
            slot(garageId: dupontId, dayOffset: 1, startHour: 11, endHour: 12),
            slot(garageId: dupontId, dayOffset: 1, startHour: 14, endHour: 15, endMinute: 30),
            // +2 days — linked repair follow-up + 1 open
            slot(garageId: dupontId, dayOffset: 2, startHour: 10, endHour: 11, endMinute: 30, claimId: inesId),
            slot(garageId: dupontId, dayOffset: 2, startHour: 14, endHour: 15),
            // +3 days — training block + 1 open in morning
            slot(garageId: dupontId, dayOffset: 3, startHour: 9,  endHour: 10, endMinute: 30),
            slot(garageId: dupontId, dayOffset: 3, startHour: 14, endHour: 18, isBlocked: true),
            // +4 to +6 days — open slots
            slot(garageId: dupontId, dayOffset: 4, startHour: 9,  endHour: 10, endMinute: 30),
            slot(garageId: dupontId, dayOffset: 4, startHour: 14, endHour: 15),
            slot(garageId: dupontId, dayOffset: 5, startHour: 9,  endHour: 10, endMinute: 30),
            slot(garageId: dupontId, dayOffset: 5, startHour: 15, endHour: 16, endMinute: 30),
            slot(garageId: dupontId, dayOffset: 6, startHour: 10, endHour: 11, endMinute: 30),
        ]

        // Garage Martin & Fils — open across the next 7 days for the driver flow.
        for dayOffset in 1...7 {
            slots.append(slot(garageId: martinId, dayOffset: dayOffset, startHour: 9,  endHour: 10))
            slots.append(slot(garageId: martinId, dayOffset: dayOffset, startHour: 11, endHour: 12))
            slots.append(slot(garageId: martinId, dayOffset: dayOffset, startHour: 14, endHour: 15))
            slots.append(slot(garageId: martinId, dayOffset: dayOffset, startHour: 16, endHour: 17))
        }

        // Auto Repair Express — sparser, has a Friday block.
        for dayOffset in 1...5 {
            slots.append(slot(garageId: expressId, dayOffset: dayOffset, startHour: 10, endHour: 11))
            slots.append(slot(garageId: expressId, dayOffset: dayOffset, startHour: 15, endHour: 16))
        }
        slots.append(slot(garageId: expressId, dayOffset: 3, startHour: 13, endHour: 18, isBlocked: true))

        // Atelier des Batignolles — busy shop, slots every morning and afternoon.
        for dayOffset in 1...7 {
            slots.append(slot(garageId: batignollesId, dayOffset: dayOffset, startHour: 9,  endHour: 10, endMinute: 30))
            slots.append(slot(garageId: batignollesId, dayOffset: dayOffset, startHour: 14, endHour: 15, endMinute: 30))
        }

        // Carrosserie République — weekend-friendly detailing shop.
        for dayOffset in 2...7 {
            slots.append(slot(garageId: republiqueId, dayOffset: dayOffset, startHour: 11, endHour: 13))
            slots.append(slot(garageId: republiqueId, dayOffset: dayOffset, startHour: 15, endHour: 17))
        }

        return slots.compactMap { $0 }
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
