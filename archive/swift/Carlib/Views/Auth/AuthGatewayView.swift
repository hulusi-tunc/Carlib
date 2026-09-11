import SwiftUI
import AuthenticationServices

/// Auth entry point — Sign in with Apple + email options.
struct AuthGatewayView: View {
    @Environment(AppState.self) private var appState
    @State private var showSignIn = false
    @State private var showSignUp = false

    var body: some View {
        ZStack {
            Color.carlibScreenBg.ignoresSafeArea()

            VStack(spacing: 32) {
                Spacer()

                // Logo + welcome
                VStack(spacing: 12) {
                    Circle()
                        .fill(Color.brandYellow)
                        .frame(width: 64, height: 64)
                        .overlay {
                            RemixIcon.carFill.view(size: 28, color: .black)
                        }

                    Text(verbatim: L10n.Auth.welcomeTitle)
                        .font(CarlibFont.title1())
                        .foregroundStyle(.carlibDark)
                }

                Spacer()

                // Auth buttons
                VStack(spacing: 16) {
                    // Sign in with Apple
                    SignInWithAppleButton(.signIn) { request in
                        request.requestedScopes = [.fullName, .email]
                    } onCompletion: { result in
                        let authService = AuthService()
                        authService.handleAppleSignIn(result: result) { user in
                            if let user {
                                withAnimation { appState.completeAuth(user: user) }
                            }
                        }
                    }
                    .signInWithAppleButtonStyle(.white)
                    .frame(height: 52)
                    .cornerRadius(14)
                    .padding(.horizontal, 20)

                    // Divider
                    HStack(spacing: 12) {
                        Rectangle().fill(Color.carlibCardBorder).frame(height: 0.5)
                        Text(verbatim: L10n.Auth.or)
                            .font(CarlibFont.caption())
                            .foregroundStyle(.carlibLabel)
                        Rectangle().fill(Color.carlibCardBorder).frame(height: 0.5)
                    }
                    .padding(.horizontal, 20)

                    // Email sign in
                    CarlibButton(label: L10n.Auth.signInWithEmail, variant: .secondary) {
                        showSignIn = true
                    }
                    .padding(.horizontal, 20)

                    // Create account
                    CarlibButton(label: L10n.Auth.createAccount, variant: .ghost) {
                        showSignUp = true
                    }
                    .padding(.horizontal, 20)
                }

                // Terms
                Text(verbatim: L10n.Auth.termsDisclaimer)
                    .font(CarlibFont.caption())
                    .foregroundStyle(.carlibLabel)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 40)
                    .padding(.bottom, 32)
            }
        }
        .sheet(isPresented: $showSignIn) {
            NavigationStack { SignInView() }
                .presentationDetents([.large])
        }
        .sheet(isPresented: $showSignUp) {
            NavigationStack { SignUpView() }
                .presentationDetents([.large])
        }
    }
}

#Preview {
    AuthGatewayView()
        .environment(AppState())
}
