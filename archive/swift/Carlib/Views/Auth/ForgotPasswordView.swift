import SwiftUI

/// Forgot password — email reset link.
struct ForgotPasswordView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var email = ""
    @State private var sent = false

    var body: some View {
        ZStack {
            Color.carlibScreenBg.ignoresSafeArea()

            VStack(spacing: 24) {
                Text(verbatim: L10n.ForgotPassword.title)
                    .font(CarlibFont.title1())
                    .foregroundStyle(.carlibDark)
                    .padding(.top, 24)

                Text(verbatim: L10n.ForgotPassword.subtitle)
                    .font(CarlibFont.body())
                    .foregroundStyle(.carlibSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 20)

                if sent {
                    VStack(spacing: 12) {
                        RemixIcon.checkboxCircleFill.view(size: 48, color: .statusCompleted)
                        Text(verbatim: L10n.ForgotPassword.success)
                            .font(CarlibFont.body(.medium))
                            .foregroundStyle(.carlibDark)
                            .multilineTextAlignment(.center)
                    }
                    .padding(.top, 20)
                } else {
                    CarlibTextField(
                        label: L10n.ForgotPassword.email,
                        placeholder: "you@example.com",
                        text: $email,
                        keyboardType: .emailAddress
                    )
                    .padding(.horizontal, 20)

                    CarlibButton(
                        label: L10n.ForgotPassword.send,
                        variant: .primary,
                        isDisabled: email.isEmpty
                    ) {
                        withAnimation { sent = true }
                    }
                    .padding(.horizontal, 20)
                }

                Spacer()
            }
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
    NavigationStack { ForgotPasswordView() }
}
