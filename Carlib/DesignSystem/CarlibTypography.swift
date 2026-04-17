import SwiftUI

/// Carlib typography scale — Aeonik (CoType Foundry).
/// Revolut-inspired: light carousel headlines, bold form titles, clean hierarchy.
///
/// Font files in Resources/Fonts/:
///   - Aeonik-Regular.otf
///   - Aeonik-Medium.otf
///   - Aeonik-Bold.otf
///   - Aeonik-Light.otf
///
/// Registered in project.yml under UIAppFonts.
/// If Aeonik is not installed, falls back to system font.
enum CarlibFont {

    // MARK: - Font Family

    private static let familyName = "Aeonik"

    /// Whether Aeonik is available at runtime.
    static let isCustomFontAvailable: Bool = {
        UIFont.familyNames.contains(where: { $0.localizedCaseInsensitiveContains(familyName) })
    }()

    private static func font(size: CGFloat, weight: Font.Weight) -> Font {
        if isCustomFontAvailable {
            return .custom(postScriptName(for: weight), size: size)
        }
        return .system(size: size, weight: weight)
    }

    private static func uiFont(size: CGFloat, weight: UIFont.Weight) -> UIFont {
        if isCustomFontAvailable,
           let font = UIFont(name: postScriptName(for: weight), size: size) {
            return font
        }
        return .systemFont(ofSize: size, weight: weight)
    }

    /// Maps SwiftUI Font.Weight to Aeonik PostScript names.
    private static func postScriptName(for weight: Font.Weight) -> String {
        switch weight {
        case .light, .ultraLight, .thin:
            return "Aeonik-Light"
        case .regular:
            return "Aeonik-Regular"
        case .medium:
            return "Aeonik-Medium"
        case .semibold, .bold, .heavy, .black:
            return "Aeonik-Bold"
        default:
            return "Aeonik-Regular"
        }
    }

    /// Overload for UIFont.Weight (used in uiFont helper).
    private static func postScriptName(for weight: UIFont.Weight) -> String {
        switch weight {
        case .ultraLight, .thin, .light:
            return "Aeonik-Light"
        case .regular:
            return "Aeonik-Regular"
        case .medium:
            return "Aeonik-Medium"
        case .semibold, .bold, .heavy, .black:
            return "Aeonik-Bold"
        default:
            return "Aeonik-Regular"
        }
    }

    // MARK: - Revolut-style Scale

    // Large Title — carousel headlines, hero text, greeting
    // Revolut: ~28pt medium
    static func largeTitle(_ weight: Font.Weight = .medium) -> Font {
        font(size: 28, weight: weight)
    }

    // Title 1 — form/action page titles ("Create your account", "Phone number")
    // Revolut: ~26pt medium
    static func title1(_ weight: Font.Weight = .medium) -> Font {
        font(size: 26, weight: weight)
    }

    // Title 2 — section headers, card titles
    // Revolut: ~22pt medium
    static func title2(_ weight: Font.Weight = .medium) -> Font {
        font(size: 22, weight: weight)
    }

    // Title 3 — subsection headers, tile titles
    // Revolut: ~17pt medium
    static func title3(_ weight: Font.Weight = .medium) -> Font {
        font(size: 17, weight: weight)
    }

    // Body — primary text, descriptions, input values
    // Revolut: ~15pt regular
    static func body(_ weight: Font.Weight = .regular) -> Font {
        font(size: 15, weight: weight)
    }

    // Callout — button labels, form labels, links
    // Revolut: ~14pt medium
    static func callout(_ weight: Font.Weight = .medium) -> Font {
        font(size: 14, weight: weight)
    }

    // Footnote — helper text, timestamps, subtitles
    // Revolut: ~13pt regular, often muted gray
    static func footnote(_ weight: Font.Weight = .regular) -> Font {
        font(size: 13, weight: weight)
    }

    // Caption — badges, uppercase labels, smallest readable text
    // Bumped from 11 to 13 for post-accident stress context readability
    static func caption(_ weight: Font.Weight = .medium) -> Font {
        font(size: 13, weight: weight)
    }

    // MARK: - Special Styles

    // Hero number — decorative large stat
    static func heroNumber() -> Font {
        font(size: 48, weight: .bold)
    }

    // Amount — financial/numeric display
    static func amount(_ weight: Font.Weight = .bold) -> Font {
        font(size: 36, weight: weight)
    }

    // MARK: - Legacy API

    static func display(_ weight: Font.Weight = .medium) -> Font { largeTitle(weight) }
    static func displayLarge(_ weight: Font.Weight = .medium) -> Font { largeTitle(weight) }
    static func displayMedium(_ weight: Font.Weight = .medium) -> Font { title1(weight) }
    static func title(_ weight: Font.Weight = .medium) -> Font { title2(weight) }
    static func headingLarge(_ weight: Font.Weight = .medium) -> Font { title1(weight) }
    static func headingMedium(_ weight: Font.Weight = .medium) -> Font { title2(weight) }
    static func headingSmall(_ weight: Font.Weight = .medium) -> Font { title3(weight) }
    static func bodyLarge(_ weight: Font.Weight = .regular) -> Font { body(weight) }
    static func bodyMedium(_ weight: Font.Weight = .regular) -> Font { body(weight) }
    static func bodySmall(_ weight: Font.Weight = .regular) -> Font { footnote(weight) }
    static func label() -> Font { caption(.medium) }
    static func tileTitle() -> Font { title3() }
    static func tileStatus() -> Font { footnote() }
    static func heroLarge() -> Font { font(size: 72, weight: .medium) }
    static func heroStatus() -> Font { title3(.medium) }
}

// MARK: - Section header modifier

extension View {
    func sectionHeaderStyle() -> some View {
        self
            .font(CarlibFont.caption(.medium))
            .tracking(0.8)
            .textCase(.uppercase)
            .foregroundStyle(Color.carlibLabel)
    }
}

// MARK: - Debug: Print available Aeonik variants

#if DEBUG
enum AeonikDebug {
    static func printAvailableFonts() {
        for family in UIFont.familyNames.sorted() {
            if family.localizedCaseInsensitiveContains("Aeonik") {
                print("Font family: \(family)")
                for name in UIFont.fontNames(forFamilyName: family) {
                    print("   > \(name)")
                }
            }
        }
        if !UIFont.familyNames.contains(where: { $0.localizedCaseInsensitiveContains("Aeonik") }) {
            print("WARNING: Aeonik not found — using system font fallback")
        }
    }
}
#endif
