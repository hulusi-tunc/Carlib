import SwiftUI

@main
struct CarlibApp: App {
    @State private var appState = AppState()
    @State private var claimStore = ClaimStore()
    @AppStorage("app_theme") private var selectedTheme: String = AppTheme.light.rawValue

    private var colorScheme: ColorScheme? {
        AppTheme(rawValue: selectedTheme)?.colorScheme
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
                .environment(\.locale, Locale(identifier: "en_US"))
                .preferredColorScheme(colorScheme)
        }
    }
}
