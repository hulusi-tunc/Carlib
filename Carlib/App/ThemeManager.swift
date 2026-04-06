import SwiftUI

/// Persisted theme preference — system, dark, or light.
enum AppTheme: String, CaseIterable {
    case system
    case dark
    case light

    var label: String {
        switch self {
        case .system: L10n.Profile.appearanceSystem
        case .dark: L10n.Profile.appearanceDark
        case .light: L10n.Profile.appearanceLight
        }
    }

    var icon: String {
        switch self {
        case .system: "circle.lefthalf.filled"
        case .dark: "moon.fill"
        case .light: "sun.max.fill"
        }
    }

    var colorScheme: ColorScheme? {
        switch self {
        case .system: nil
        case .dark: .dark
        case .light: .light
        }
    }
}
