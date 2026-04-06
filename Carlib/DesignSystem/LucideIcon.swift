import SwiftUI

/// Consistent icon component using SF Symbols with geometric styling.
/// Uses regular weight for clean, Lucide-like line icons.
struct CarlibIconView: View {
    let systemName: String
    var size: CGFloat = 24

    var body: some View {
        Image(systemName: systemName)
            .font(.system(size: size, weight: .regular))
            .imageScale(.medium)
    }
}

/// Centralized icon references — consistent naming, easy to swap later.
enum CarlibIcon {
    // Tab bar
    static let home = "house"
    static let report = "plus"
    static let claims = "doc.text"
    static let profile = "person"

    // Home screen
    static let carFront = "car.front.waves.up"
    static let triangleAlert = "exclamationmark.triangle"
    static let mapPin = "mappin.circle"
    static let car = "car"
    static let chevronRight = "chevron.right"
    static let arrowRight = "arrow.right"

    // Status
    static let send = "paperplane"
    static let wrench = "wrench"
    static let checkCircle = "checkmark.circle"
    static let calendar = "calendar"
}
