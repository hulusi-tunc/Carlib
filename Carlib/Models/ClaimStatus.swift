import Foundation

/// Claim lifecycle states.
/// Flow: draft → submitted → matched → accepted → inProgress → repairing → completed
enum ClaimStatus: String, Codable, CaseIterable {
    case draft = "brouillon"
    case submitted = "soumis"
    case matched = "en_recherche"
    case accepted = "accepte"
    case inProgress = "pris_en_charge"
    case repairing = "en_reparation"
    case completed = "termine"
    case cancelled = "annule"
    case expired = "expire"

    var localizedName: String {
        switch self {
        case .draft: L10n.ClaimStatusLabel.draft
        case .submitted: L10n.ClaimStatusLabel.submitted
        case .matched: L10n.ClaimStatusLabel.matched
        case .accepted: L10n.ClaimStatusLabel.accepted
        case .inProgress: L10n.ClaimStatusLabel.inProgress
        case .repairing: L10n.ClaimStatusLabel.repairing
        case .completed: L10n.ClaimStatusLabel.completed
        case .cancelled: L10n.ClaimStatusLabel.cancelled
        case .expired: L10n.ClaimStatusLabel.expired
        }
    }
}
