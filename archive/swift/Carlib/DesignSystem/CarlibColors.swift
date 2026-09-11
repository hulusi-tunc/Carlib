import SwiftUI

/// Carlib color tokens — adaptive for light and dark mode.
/// Brand color: #F5B700 (golden yellow).
extension Color {
    // MARK: - Brand (Asset Catalog)

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

// MARK: - Adaptive helper

private func adaptive(light: UIColor, dark: UIColor) -> Color {
    Color(uiColor: UIColor { $0.userInterfaceStyle == .dark ? dark : light })
}

private func rgb(_ r: CGFloat, _ g: CGFloat, _ b: CGFloat) -> UIColor {
    UIColor(red: r, green: g, blue: b, alpha: 1)
}

// MARK: - Brand & Semantic Colors

extension ShapeStyle where Self == Color {

    // MARK: - Primary (Golden Yellow — client brand color)

    /// Primary brand — #F5B700 golden yellow.
    static var carlibPrimaryBlue: Color { Color(red: 0.961, green: 0.718, blue: 0.0) }
    /// Pressed/darker yellow.
    static var carlibPrimaryDarkBlue: Color { Color(red: 0.800, green: 0.600, blue: 0.0) }
    /// Dark yellow tint for selected states.
    static var carlibPrimaryLightBlue: Color {
        adaptive(
            light: rgb(1.0, 0.95, 0.85),   // warm cream
            dark: rgb(0.20, 0.15, 0.0)      // dark amber
        )
    }

    // MARK: - Text

    /// Primary text — black on light, white on dark.
    static var carlibDark: Color {
        adaptive(light: rgb(0.0, 0.0, 0.0), dark: rgb(1.0, 1.0, 1.0))
    }
    /// Secondary text — gray, adapts for contrast.
    static var carlibSecondary: Color {
        adaptive(
            light: rgb(0.40, 0.42, 0.45),   // #666B73
            dark: rgb(0.612, 0.639, 0.686)   // #9CA3AF
        )
    }
    /// Section header labels — muted.
    static var carlibLabel: Color {
        adaptive(
            light: rgb(0.55, 0.57, 0.60),   // #8C9199
            dark: rgb(0.420, 0.447, 0.502)   // #6B7280
        )
    }

    // MARK: - Surfaces

    /// Screen background.
    static var carlibScreenBg: Color {
        adaptive(
            light: rgb(1.0, 1.0, 1.0),      // white
            dark: rgb(0.059, 0.059, 0.059)   // #0F0F0F
        )
    }
    /// Card/tile border.
    static var carlibCardBorder: Color {
        adaptive(
            light: rgb(0.91, 0.91, 0.92),   // #E8E8EB
            dark: rgb(0.165, 0.165, 0.165)   // #2A2A2A
        )
    }
    /// Dark surface accent.
    static var carlibAccent: Color {
        adaptive(
            light: rgb(0.96, 0.96, 0.97),   // #F5F5F7
            dark: rgb(0.118, 0.118, 0.118)   // #1E1E1E
        )
    }
    /// Inactive tab bar.
    static var carlibTabInactive: Color {
        adaptive(
            light: rgb(0.55, 0.57, 0.60),
            dark: rgb(0.420, 0.447, 0.502)
        )
    }

    // MARK: - Tiles

    /// Primary tile fill — brand yellow (same in both modes).
    static var tilePrimary: Color { Color(red: 0.961, green: 0.718, blue: 0.0) }
    /// Secondary tile fill.
    static var tileSecondary: Color {
        adaptive(
            light: rgb(0.945, 0.945, 0.955),  // #F1F1F4
            dark: rgb(0.118, 0.118, 0.118)    // #1E1E1E
        )
    }

    // MARK: - Legacy Aliases

    static var brandYellow: Color { .carlibPrimaryBlue }
    static var brandYellowDark: Color { .carlibPrimaryDarkBlue }
    static var brandYellowLight: Color { .carlibPrimaryLightBlue }
    static var brandCharcoal: Color { .carlibDark }

    // MARK: - Status Colors (foreground)

    static var statusDraft: Color { Color(red: 0.60, green: 0.60, blue: 0.62) }
    static var statusDraftBg: Color {
        adaptive(light: rgb(0.94, 0.94, 0.95), dark: rgb(0.15, 0.15, 0.16))
    }

    static var statusSubmitted: Color { Color(red: 0.38, green: 0.58, blue: 0.95) }
    static var statusSubmittedBg: Color {
        adaptive(light: rgb(0.92, 0.95, 1.0), dark: rgb(0.06, 0.10, 0.18))
    }

    static var statusMatched: Color { Color(red: 0.95, green: 0.70, blue: 0.20) }
    static var statusMatchedBg: Color {
        adaptive(light: rgb(1.0, 0.96, 0.88), dark: rgb(0.18, 0.13, 0.04))
    }

    static var statusAccepted: Color { Color(red: 0.25, green: 0.75, blue: 0.70) }
    static var statusAcceptedBg: Color {
        adaptive(light: rgb(0.90, 0.98, 0.97), dark: rgb(0.04, 0.15, 0.14))
    }

    static var statusInProgress: Color { Color(red: 0.40, green: 0.56, blue: 0.92) }
    static var statusInProgressBg: Color {
        adaptive(light: rgb(0.92, 0.95, 1.0), dark: rgb(0.06, 0.10, 0.18))
    }

    static var statusRepairing: Color { Color(red: 0.95, green: 0.65, blue: 0.15) }
    static var statusRepairingBg: Color {
        adaptive(light: rgb(1.0, 0.96, 0.90), dark: rgb(0.18, 0.12, 0.03))
    }

    static var statusCompleted: Color { Color(red: 0.30, green: 0.78, blue: 0.42) }
    static var statusCompletedBg: Color {
        adaptive(light: rgb(0.92, 0.98, 0.93), dark: rgb(0.04, 0.16, 0.06))
    }

    static var statusCancelled: Color { Color(red: 0.90, green: 0.35, blue: 0.35) }
    static var statusCancelledBg: Color {
        adaptive(light: rgb(1.0, 0.93, 0.93), dark: rgb(0.18, 0.06, 0.06))
    }

    static var statusExpired: Color { Color(red: 0.55, green: 0.55, blue: 0.57) }
    static var statusExpiredBg: Color {
        adaptive(light: rgb(0.94, 0.94, 0.95), dark: rgb(0.14, 0.14, 0.15))
    }

    // MARK: - Semantic

    static var destructiveRed: Color { Color(red: 0.90, green: 0.30, blue: 0.30) }
    static var destructiveRedBg: Color {
        adaptive(light: rgb(1.0, 0.93, 0.93), dark: rgb(0.18, 0.06, 0.06))
    }
}
