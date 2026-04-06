import Foundation

/// Booking lifecycle states.
enum BookingStatus: String, Codable, CaseIterable {
    case pending = "en_attente"
    case confirmed = "confirme"
    case arrivedAtGarage = "arrive"
    case vehicleDroppedOff = "depose"
    case rescheduled = "replanifie"
    case cancelledByDriver = "annule_conducteur"
    case cancelledByGarage = "annule_garage"

    var localizedName: String {
        switch self {
        case .pending: L10n.BookingStatusLabel.pending
        case .confirmed: L10n.BookingStatusLabel.confirmed
        case .arrivedAtGarage: L10n.BookingStatusLabel.arrived
        case .vehicleDroppedOff: L10n.BookingStatusLabel.droppedOff
        case .rescheduled: L10n.BookingStatusLabel.rescheduled
        case .cancelledByDriver: L10n.BookingStatusLabel.cancelledByDriver
        case .cancelledByGarage: L10n.BookingStatusLabel.cancelledByGarage
        }
    }
}
