import SwiftUI

/// Email sign up — name, email, password.
struct SignUpView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.dismiss) private var dismiss
    @State private var fullName = ""
    @State private var email = ""
    @State private var password = ""
    @State private var authService = AuthService()

    private var isValid: Bool {
        !fullName.isEmpty && !email.isEmpty && password.count >= 8
    }

    var body: some View {
        ZStack {
            Color.carlibScreenBg.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    Text(verbatim: L10n.SignUp.title)
                        .font(CarlibFont.title1())
                        .foregroundStyle(.carlibDark)
                        .padding(.top, 24)

                    // Form
                    VStack(spacing: 16) {
                        CarlibTextField(
                            label: L10n.SignUp.fullName,
                            placeholder: "Laurent Dupont",
                            text: $fullName,
                            contentType: .name
                        )

                        CarlibTextField(
                            label: L10n.SignUp.email,
                            placeholder: "you@example.com",
                            text: $email,
                            keyboardType: .emailAddress,
                            contentType: .emailAddress
                        )

                        CarlibSecureField(
                            label: L10n.SignUp.password,
                            placeholder: "••••••••",
                            text: $password,
                            hint: L10n.SignUp.passwordHint
                        )
                    }
                    .padding(.horizontal, 20)

                    // Error
                    if let error = authService.errorMessage {
                        Text(verbatim: error)
                            .font(CarlibFont.caption())
                            .foregroundStyle(.destructiveRed)
                            .padding(.horizontal, 20)
                    }

                    // Create account button
                    CarlibButton(
                        label: L10n.SignUp.createAccount,
                        variant: .primary,
                        isLoading: authService.isLoading,
                        isDisabled: !isValid
                    ) {
                        Task {
                            if let user = await authService.signUp(
                                fullName: fullName,
                                email: email,
                                password: password
                            ) {
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
    }
}

#Preview {
    NavigationStack {
        SignUpView()
    }
    .environment(AppState())
}
