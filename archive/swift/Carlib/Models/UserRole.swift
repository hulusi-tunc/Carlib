import Foundation

/// The two primary user roles in the Carlib marketplace.
enum UserRole: String, Codable, CaseIterable {
    case driver = "conducteur"
    case garage = "carrossier"

    var localizedName: String {
        switch self {
        case .driver: L10n.Onboarding.roleDriver
        case .garage: L10n.Onboarding.roleGarage
        }
    }
}
