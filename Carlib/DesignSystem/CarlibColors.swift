import SwiftUI

/// Carlib color tokens — Polestar-inspired dark theme.
/// Near-black background, orange accent, high-contrast white text.
extension Color {
    // MARK: - Brand (Asset Catalog — override in Assets.xcassets if needed)

    static let carlibPrimary = Color("CarlibPrimary")
    static let carlibPrimaryDark = Color("CarlibPrimaryDark")
    static let carlibPrimaryLight = Color("CarlibPrimaryLight")

    // MARK: - Semantic

    static let carlibSuccess = Color("CarlibSuccess")
    static let carlibWarning = Color("CarlibWarning")
    static let carlibError = Color("CarlibError")
    static let carlibInfo = Color("CarlibInfo")

    // MARK: - Neutral

    static let carlibBackground = Color("CarlibBackground")
    static let carlibSurface = Color("CarlibSurface")
    static let carlibTextPrimary = Color("CarlibTextPrimary")
    static let carlibTextSecondary = Color("CarlibTextSecondary")
    static let carlibBorder = Color("CarlibBorder")
}

// MARK: - Polestar Dark Theme

extension ShapeStyle where Self == Color {

    // MARK: - Primary (Orange)

    /// Primary accent — Polestar orange.
    static var carlibPrimaryBlue: Color { Color(red: 0.976, green: 0.451, blue: 0.086) } // #F97316
    /// Pressed/darker orange.
    static var carlibPrimaryDarkBlue: Color { Color(red: 0.918, green: 0.345, blue: 0.047) } // #EA580C
    /// Dark orange tint for selected states.
    static var carlibPrimaryLightBlue: Color { Color(red: 0.263, green: 0.078, blue: 0.027) } // #431407

    // MARK: - Text

    /// Primary text — white on dark.
    static var carlibDark: Color { .white }
    /// Secondary text — medium gray.
    static var carlibSecondary: Color { Color(red: 0.612, green: 0.639, blue: 0.686) } // #9CA3AF
    /// Section header labels — muted.
    static var carlibLabel: Color { Color(red: 0.420, green: 0.447, blue: 0.502) } // #6B7280

    // MARK: - Surfaces

    /// Screen background — near-black.
    static var carlibScreenBg: Color { Color(red: 0.059, green: 0.059, blue: 0.059) } // #0F0F0F
    /// Card/tile border — subtle dark.
    static var carlibCardBorder: Color { Color(red: 0.165, green: 0.165, blue: 0.165) } // #2A2A2A
    /// Dark surface (was beige accent).
    static var carlibAccent: Color { Color(red: 0.118, green: 0.118, blue: 0.118) } // #1E1E1E
    /// Inactive tab bar.
    static var carlibTabInactive: Color { Color(red: 0.420, green: 0.447, blue: 0.502) } // #6B7280

    // MARK: - Tiles

    /// Primary tile fill — orange.
    static var tilePrimary: Color { Color(red: 0.976, green: 0.451, blue: 0.086) } // #F97316
    /// Secondary tile fill — dark gray.
    static var tileSecondary: Color { Color(red: 0.118, green: 0.118, blue: 0.118) } // #1E1E1E

    // MARK: - Legacy Aliases

    static var brandYellow: Color { .carlibPrimaryBlue }
    static var brandYellowDark: Color { .carlibPrimaryDarkBlue }
    static var brandYellowLight: Color { .carlibPrimaryLightBlue }
    static var brandCharcoal: Color { .carlibDark }

    // MARK: - Status Colors (foreground — high saturation, dark-safe)

    static var statusDraft: Color { Color(red: 0.60, green: 0.60, blue: 0.62) }
    static var statusDraftBg: Color { Color(red: 0.15, green: 0.15, blue: 0.16) }

    static var statusSubmitted: Color { Color(red: 0.38, green: 0.58, blue: 0.95) }
    static var statusSubmittedBg: Color { Color(red: 0.06, green: 0.10, blue: 0.18) }

    static var statusMatched: Color { Color(red: 0.95, green: 0.70, blue: 0.20) }
    static var statusMatchedBg: Color { Color(red: 0.18, green: 0.13, blue: 0.04) }

    static var statusAccepted: Color { Color(red: 0.25, green: 0.75, blue: 0.70) }
    static var statusAcceptedBg: Color { Color(red: 0.04, green: 0.15, blue: 0.14) }

    static var statusInProgress: Color { Color(red: 0.40, green: 0.56, blue: 0.92) }
    static var statusInProgressBg: Color { Color(red: 0.06, green: 0.10, blue: 0.18) }

    static var statusRepairing: Color { Color(red: 0.95, green: 0.65, blue: 0.15) }
    static var statusRepairingBg: Color { Color(red: 0.18, green: 0.12, blue: 0.03) }

    static var statusCompleted: Color { Color(red: 0.30, green: 0.78, blue: 0.42) }
    static var statusCompletedBg: Color { Color(red: 0.04, green: 0.16, blue: 0.06) }

    static var statusCancelled: Color { Color(red: 0.90, green: 0.35, blue: 0.35) }
    static var statusCancelledBg: Color { Color(red: 0.18, green: 0.06, blue: 0.06) }

    static var statusExpired: Color { Color(red: 0.55, green: 0.55, blue: 0.57) }
    static var statusExpiredBg: Color { Color(red: 0.14, green: 0.14, blue: 0.15) }

    // MARK: - Semantic

    static var destructiveRed: Color { Color(red: 0.90, green: 0.30, blue: 0.30) }
    static var destructiveRedBg: Color { Color(red: 0.18, green: 0.06, blue: 0.06) }
}
