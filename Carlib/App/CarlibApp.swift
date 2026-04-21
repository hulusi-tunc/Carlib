import SwiftUI

@main
struct CarlibApp: App {
    @State private var appState = AppState()
    @State private var claimStore = ClaimStore()
    @AppStorage("app_theme") private var selectedTheme: String = AppTheme.light.rawValue
    @AppStorage("app_language") private var selectedLanguage: String = AppLanguage.en.rawValue

    private var colorScheme: ColorScheme? {
        AppTheme(rawValue: selectedTheme)?.colorScheme
    }

    private var locale: Locale {
        AppLanguage(rawValue: selectedLanguage) == .fr ? Locale(identifier: "fr_FR") : Locale(identifier: "en_US")
    }

    init() {
        #if DEBUG
        AeonikDebug.printAvailableFonts()
        #endif
    }

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(appState)
                .environment(claimStore)
                .environment(\.locale, locale)
                .preferredColorScheme(colorScheme)
                .id(selectedLanguage)
        }
    }
}
