import SwiftUI

/// Revolut-style splash — pure black, centered wordmark, minimal.
struct SplashView: View {
    @Environment(AppState.self) private var appState
    @State private var opacity: Double = 0

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            Text(verbatim: "Carlib")
                .font(CarlibFont.display())
                .foregroundStyle(.carlibDark)
                .opacity(opacity)
        }
        .onAppear {
            withAnimation(.easeIn(duration: 0.5)) {
                opacity = 1.0
            }

            Task {
                try? await Task.sleep(for: .seconds(1.5))
                let authService = AuthService()
                let (status, user) = authService.checkExistingSession()
                withAnimation(.easeInOut(duration: 0.3)) {
                    if let user {
                        appState.currentUser = user
                    }
                    appState.authStatus = status
                }
            }
        }
    }
}

#Preview {
    SplashView()
        .environment(AppState())
}
