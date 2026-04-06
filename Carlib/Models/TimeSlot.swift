import Foundation

/// A bookable time slot at a garage.
struct TimeSlot: Identifiable, Codable {
    let id: UUID
    var garageId: UUID
    var date: Date
    var startTime: Date
    var endTime: Date
    var isAvailable: Bool
    var isBlocked: Bool

    init(
        id: UUID = UUID(),
        garageId: UUID = UUID(),
        date: Date = .now,
        startTime: Date = .now,
        endTime: Date = .now,
        isAvailable: Bool = true,
        isBlocked: Bool = false
    ) {
        self.id = id
        self.garageId = garageId
        self.date = date
        self.startTime = startTime
        self.endTime = endTime
        self.isAvailable = isAvailable
        self.isBlocked = isBlocked
    }
}
