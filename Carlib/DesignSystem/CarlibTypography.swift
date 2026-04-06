import SwiftUI

/// Carlib typography scale — Aeonik (CoType Foundry).
/// Polestar-inspired: clean grotesque, minimal, confident.
///
/// Font files required in Resources/Fonts/:
///   - Aeonik-Regular.otf
///   - Aeonik-Medium.otf
///   - Aeonik-Bold.otf
///   - Aeonik-Light.otf (optional)
///
/// These must also be listed in Info.plist under UIAppFonts.
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

    // MARK: - Display (main greeting, hero)

    static func display(_ weight: Font.Weight = .bold) -> Font {
        font(size: 32, weight: weight)
    }

    // MARK: - Title (card titles, section names)

    static func title(_ weight: Font.Weight = .medium) -> Font {
        font(size: 22, weight: weight)
    }

    // MARK: - Body (descriptions)

    static func body(_ weight: Font.Weight = .regular) -> Font {
        font(size: 16, weight: weight)
    }

    // MARK: - Caption (labels, dates)

    static func caption(_ weight: Font.Weight = .regular) -> Font {
        font(size: 13, weight: weight)
    }

    // MARK: - Label (section headers — uppercase + letter-spacing)

    static func label() -> Font {
        font(size: 11, weight: .medium)
    }

    // MARK: - Tile Typography

    static func tileTitle() -> Font {
        font(size: 15, weight: .medium)
    }

    static func tileStatus() -> Font {
        font(size: 13, weight: .regular)
    }

    // MARK: - Hero (decorative large number)

    static func heroLarge() -> Font {
        font(size: 72, weight: .bold)
    }

    static func heroStatus() -> Font {
        font(size: 18, weight: .medium)
    }

    // MARK: - Legacy API

    static func displayLarge(_ weight: Font.Weight = .bold) -> Font { display(weight) }
    static func displayMedium(_ weight: Font.Weight = .bold) -> Font { display(weight) }
    static func headingLarge(_ weight: Font.Weight = .semibold) -> Font { title(weight) }
    static func headingMedium(_ weight: Font.Weight = .semibold) -> Font { title(weight) }
    static func headingSmall(_ weight: Font.Weight = .semibold) -> Font { font(size: 17, weight: weight) }
    static func bodyLarge(_ weight: Font.Weight = .regular) -> Font { font(size: 17, weight: weight) }
    static func bodyMedium(_ weight: Font.Weight = .regular) -> Font { font(size: 15, weight: weight) }
    static func bodySmall(_ weight: Font.Weight = .regular) -> Font { caption(weight) }
}

// MARK: - Swiss-style section header modifier

extension View {
    func sectionHeaderStyle() -> some View {
        self
            .font(CarlibFont.label())
            .tracking(1)
            .textCase(.uppercase)
            .foregroundStyle(Color.carlibLabel)
    }
}

// MARK: - Debug: Print available Aeonik variants

#if DEBUG
enum AeonikDebug {
    static func printAvailableFonts() {
        for family in UIFont.familyNames.sorted() {
            if family.localizedCaseInsensitiveContains("aeonik") {
                print("📝 Font family: \(family)")
                for name in UIFont.fontNames(forFamilyName: family) {
                    print("   → \(name)")
                }
            }
        }
        if !UIFont.familyNames.contains(where: { $0.localizedCaseInsensitiveContains("aeonik") }) {
            print("⚠️ Aeonik not found — using system font fallback")
        }
    }
}
#endif
