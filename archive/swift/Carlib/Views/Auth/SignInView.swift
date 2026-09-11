import SwiftUI

/// Email + password sign in.
struct SignInView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.dismiss) private var dismiss
    @State private var email = ""
    @State private var password = ""
    @State private var authService = AuthService()
    @State private var showForgotPassword = false

    var body: some View {
        ZStack {
            Color.carlibScreenBg.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    VStack(spacing: 8) {
                        Text(verbatim: L10n.SignIn.title)
                            .font(CarlibFont.title1())
                            .foregroundStyle(.carlibDark)
                    }
                    .padding(.top, 24)

                    // Form
                    VStack(spacing: 16) {
                        CarlibTextField(
                            label: L10n.SignIn.email,
                            placeholder: "you@example.com",
                            text: $email,
                            keyboardType: .emailAddress,
                            contentType: .emailAddress
                        )

                        CarlibSecureField(
                            label: L10n.SignIn.password,
                            placeholder: "••••••••",
                            text: $password
                        )

                        HStack {
                            Spacer()
                            Button(L10n.SignIn.forgotPassword) {
                                showForgotPassword = true
                            }
                            .font(CarlibFont.caption(.medium))
                            .foregroundStyle(.brandYellow)
                        }
                    }
                    .padding(.horizontal, 20)

                    // Error
                    if let error = authService.errorMessage {
                        Text(verbatim: error)
                            .font(CarlibFont.caption())
                            .foregroundStyle(.destructiveRed)
                            .padding(.horizontal, 20)
                    }

                    // Sign in button
                    CarlibButton(
                        label: L10n.SignIn.signIn,
                        variant: .primary,
                        isLoading: authService.isLoading,
                        isDisabled: email.isEmpty || password.isEmpty
                    ) {
                        Task {
                            if let user = await authService.signIn(email: email, password: password) {
                                withAnimation {
                                    appState.completeAuth(user: user)
                                    dismiss()
                                }
                            }
                        }
                    }
                    .padding(.horizontal, 20)

                    Spacer()
                }
            }
            .scrollDismissesKeyboard(.interactively)
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button(L10n.Common.cancel) { dismiss() }
                    .foregroundStyle(.carlibSecondary)
            }
        }
        .sheet(isPresented: $showForgotPassword) {
            NavigationStack { ForgotPasswordView() }
                .presentationDetents([.medium])
        }
    }
}

#Preview {
    NavigationStack {
        SignInView()
    }
    .environment(AppState())
}
