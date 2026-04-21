import SwiftUI
import CoreLocation

/// Mutable in-memory data store. Seeds from MockData, supports all CRUD operations.
/// Injected via `.environment(claimStore)` from CarlibApp.
@Observable
final class ClaimStore {
    var claims: [Claim]
    var timeSlots: [TimeSlot]
    var bookings: [Booking]
    var vehicles: [Vehicle]

    init() {
        self.claims = MockData.claims
        self.timeSlots = MockData.timeSlots
        self.bookings = []
        self.vehicles = MockData.vehicles
    }

    // MARK: - Vehicle

    var defaultVehicle: Vehicle? {
        vehicles.first(where: { $0.isDefault }) ?? vehicles.first
    }

    func addVehicle(_ vehicle: Vehicle) {
        var v = vehicle
        if vehicles.isEmpty { v.isDefault = true }
        vehicles.append(v)
    }

    func removeVehicle(id: UUID) {
        vehicles.removeAll { $0.id == id }
        if !vehicles.isEmpty && !vehicles.contains(where: { $0.isDefault }) {
            vehicles[0].isDefault = true
        }
    }

    func setDefaultVehicle(id: UUID) {
        for i in vehicles.indices {
            vehicles[i].isDefault = (vehicles[i].id == id)
        }
    }

    // MARK: - Computed Filters

    var activeClaims: [Claim] {
        claims.filter { [.submitted, .matched, .accepted, .inProgress, .repairing].contains($0.status) }
    }

    var pastClaims: [Claim] {
        claims.filter { [.completed, .cancelled, .expired].contains($0.status) }
    }

    var availableClaims: [Claim] {
        claims.filter { [.submitted, .matched].contains($0.status) }
    }

    var garageClaims: [Claim] {
        claims.filter { [.accepted, .inProgress, .repairing, .completed].contains($0.status) && $0.assignedGarageId != nil }
    }

    // MARK: - Claim Mutations

    func addClaim(_ claim: Claim) {
        claims.insert(claim, at: 0)
    }

    func acceptClaim(id: UUID, garageId: UUID) {
        guard let index = claims.firstIndex(where: { $0.id == id }) else { return }
        claims[index].status = .accepted
        claims[index].assignedGarageId = garageId
        claims[index].bookingStatus = .pending
        claims[index].updatedAt = .now
    }

    func declineClaim(id: UUID) {
        // For MVP, just remove from available — in real app, hide from this garage only
        guard let index = claims.firstIndex(where: { $0.id == id }) else { return }
        claims[index].updatedAt = .now
    }

    func cancelClaim(id: UUID) {
        guard let index = claims.firstIndex(where: { $0.id == id }) else { return }
        claims[index].status = .cancelled
        claims[index].updatedAt = .now
    }

    func updateClaimStatus(id: UUID, to status: ClaimStatus) {
        guard let index = claims.firstIndex(where: { $0.id == id }) else { return }
        claims[index].status = status
        claims[index].updatedAt = .now
    }

    func updateRepairStatus(id: UUID, to status: RepairStatus) {
        guard let index = claims.firstIndex(where: { $0.id == id }) else { return }
        claims[index].repairStatus = status
        if status == .readyForPickup {
            claims[index].status = .completed
        } else {
            claims[index].status = .repairing
        }
        claims[index].updatedAt = .now
    }

    // MARK: - Time Slot Mutations

    func addTimeSlot(_ slot: TimeSlot) {
        timeSlots.append(slot)
    }

    func removeTimeSlot(id: UUID) {
        timeSlots.removeAll { $0.id == id }
    }

    func setSlotBlocked(id: UUID, blocked: Bool) {
        guard let idx = timeSlots.firstIndex(where: { $0.id == id }) else { return }
        timeSlots[idx].isBlocked = blocked
        if blocked {
            timeSlots[idx].isAvailable = false
        }
    }

    func updateSlotTimes(id: UUID, start: Date, end: Date) {
        guard let idx = timeSlots.firstIndex(where: { $0.id == id }) else { return }
        timeSlots[idx].startTime = start
        timeSlots[idx].endTime = end
    }

    func slotsForDate(_ date: Date, garageId: UUID? = nil) -> [TimeSlot] {
        timeSlots.filter {
            Calendar.current.isDate($0.date, inSameDayAs: date)
            && (garageId == nil || $0.garageId == garageId)
        }
    }

    func availableSlots(for garageId: UUID) -> [TimeSlot] {
        timeSlots.filter { $0.garageId == garageId && $0.isAvailable && !$0.isBlocked }
    }

    // MARK: - Booking Mutations

    func addBooking(_ booking: Booking) {
        bookings.append(booking)
        // Mark the slot as no longer available
        if let slotIndex = timeSlots.firstIndex(where: { $0.id == booking.slotId }) {
            timeSlots[slotIndex].isAvailable = false
        }
    }
}
