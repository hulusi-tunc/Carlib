import SwiftUI

/// Splash — dark charcoal background with a yellow splash glow and the
/// "Carlib" wordmark centered in white. Always dark regardless of system theme.
///
/// Staged entrance: the yellow glow rises up from below and fades in first,
/// then the wordmark fades in and scales from 0.9 → 1.0. A subtle "breathe"
/// pulse on the wordmark keeps the screen feeling alive during the auth
/// check delay.
struct SplashView: View {
    @Environment(AppState.self) private var appState

    @State private var wordmarkOpacity: Double = 0
    @State private var wordmarkScale: CGFloat = 0.9
    @State private var wordmarkBreathe: CGFloat = 1.0
    @State private var glowOpacity: Double = 0
    @State private var glowOffsetProgress: CGFloat = 0 // 0 = raised, 1 = final

    private let backgroundColor = Color(red: 0.102, green: 0.102, blue: 0.102) // #1a1a1a

    var body: some View {
        ZStack {
            backgroundColor.ignoresSafeArea()

            GeometryReader { geo in
                let raisedOffset = geo.size.height * 0.08
                let finalY = geo.size.height + geo.size.height * 0.15
                Image("OnboardingSplash")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: geo.size.width * 2.2, height: geo.size.height * 2.2)
                    .rotationEffect(.degrees(42.45))
                    .position(
                        x: geo.size.width / 2,
                        y: finalY + raisedOffset * (1 - glowOffsetProgress)
                    )
                    .opacity(glowOpacity)
                    .allowsHitTesting(false)
                    .accessibilityHidden(true)
            }
            .ignoresSafeArea()

            Text(verbatim: "Carlib")
                .font(.custom("Aeonik-Medium", size: 42))
                .foregroundStyle(.white)
                .opacity(wordmarkOpacity)
                .scaleEffect(wordmarkScale * wordmarkBreathe)
        }
        .preferredColorScheme(.dark)
        .onAppear {
            // Stage 1 — glow rises + fades in.
            withAnimation(.easeOut(duration: 0.9)) {
                glowOpacity = 1.0
                glowOffsetProgress = 1.0
            }

            // Stage 2 — wordmark settles in ~250ms after the glow starts.
            withAnimation(.easeOut(duration: 0.6).delay(0.25)) {
                wordmarkOpacity = 1.0
                wordmarkScale = 1.0
            }

            // Stage 3 — subtle ongoing breathe so the screen doesn't feel
            // frozen while we wait on the auth check.
            withAnimation(
                .easeInOut(duration: 1.4)
                    .repeatForever(autoreverses: true)
                    .delay(0.9)
            ) {
                wordmarkBreathe = 1.03
            }

            Task {
                try? await Task.sleep(for: .seconds(0.3))
                #if DEBUG
                if DebugScreenshotFlags.isActive {
                    withAnimation(.easeInOut(duration: 0.2)) {
                        appState.applyDebugScreenshotFlagsIfNeeded()
                    }
                    return
                }
                #endif
                try? await Task.sleep(for: .seconds(1.2))
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
