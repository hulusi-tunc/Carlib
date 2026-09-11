import Foundation

/// Repair sub-statuses (within an active claim).
enum RepairStatus: String, Codable, CaseIterable {
    case diagnostic = "diagnostic"
    case waitingParts = "attente_pieces"
    case repairing = "en_cours"
    case qualityCheck = "controle"
    case readyForPickup = "pret"

    var localizedName: String {
        switch self {
        case .diagnostic: L10n.RepairStatusLabel.diagnostic
        case .waitingParts: L10n.RepairStatusLabel.waitingParts
        case .repairing: L10n.RepairStatusLabel.repairing
        case .qualityCheck: L10n.RepairStatusLabel.qualityCheck
        case .readyForPickup: L10n.RepairStatusLabel.ready
        }
    }
}
