import Foundation

/// A confirmed appointment at a garage.
struct Booking: Identifiable, Codable {
    let id: UUID
    var claimId: UUID?
    var garageId: UUID
    var slotId: UUID
    var status: BookingStatus
    var createdAt: Date

    init(
        id: UUID = UUID(),
        claimId: UUID? = nil,
        garageId: UUID,
        slotId: UUID,
        status: BookingStatus = .pending,
        createdAt: Date = .now
    ) {
        self.id = id
        self.claimId = claimId
        self.garageId = garageId
        self.slotId = slotId
        self.status = status
        self.createdAt = createdAt
    }
}
