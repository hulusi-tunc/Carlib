import SwiftUI

/// Placeholder password-change sheet built with the app's design system
/// (CarlibSecureField + CarlibButton) so it matches the sign-in / sign-up
/// screens rather than iOS Form defaults.
struct ChangePasswordView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(AppState.self) private var appState

    @State private var current = ""
    @State private var newPassword = ""
    @State private var confirm = ""
    @State private var currentError: String?
    @State private var newError: String?
    @State private var confirmError: String?
    @State private var showSuccess = false

    private var canSubmit: Bool {
        !current.isEmpty && newPassword.count >= 8 && !confirm.isEmpty
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                intro
                fields
                Spacer(minLength: 8)
                CarlibButton(
                    label: L10n.ChangePassword.save,
                    variant: .primary,
                    isDisabled: !canSubmit,
                    action: submit
                )
            }
            .padding(.horizontal, 20)
            .padding(.top, 12)
            .padding(.bottom, 40)
        }
        .background(Color.carlibScreenBg)
        .navigationTitle(Text(verbatim: L10n.ChangePassword.title))
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button(L10n.Common.cancel) { dismiss() }
                    .foregroundStyle(.carlibDark)
            }
        }
        .alert(
            Text(verbatim: L10n.ChangePassword.successTitle),
            isPresented: $showSuccess
        ) {
            Button(L10n.Common.done) { dismiss() }
        } message: {
            Text(verbatim: L10n.ChangePassword.successBody)
        }
    }

    // MARK: - Intro

    private var intro: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(verbatim: L10n.ChangePassword.title)
                .font(CarlibFont.title2())
                .foregroundStyle(.carlibDark)
            if let email = appState.currentUser?.email, !email.isEmpty {
                Text(verbatim: email)
                    .font(CarlibFont.footnote())
                    .foregroundStyle(.carlibSecondary)
            }
        }
    }

    // MARK: - Fields

    private var fields: some View {
        VStack(alignment: .leading, spacing: 16) {
            CarlibSecureField(
                label: L10n.ChangePassword.current,
                placeholder: "••••••••",
                text: $current,
                error: currentError
            )

            CarlibSecureField(
                label: L10n.ChangePassword.new,
                placeholder: "••••••••",
                text: $newPassword,
                hint: L10n.ChangePassword.hint,
                error: newError
            )

            CarlibSecureField(
                label: L10n.ChangePassword.confirm,
                placeholder: "••••••••",
                text: $confirm,
                error: confirmError
            )
        }
    }

    // MARK: - Submit

    private func submit() {
        currentError = nil
        newError = nil
        confirmError = nil

        guard newPassword.count >= 8 else {
            newError = L10n.ChangePassword.errorTooShort
            return
        }
        guard newPassword == confirm else {
            confirmError = L10n.ChangePassword.errorMismatch
            return
        }

        // Verify current password for seed accounts. Sign-up users never had
        // their password persisted, so we accept any non-empty string for
        // them — placeholder behavior until a real backend lands.
        if let email = appState.currentUser?.email,
           DefaultUsers.hasEmail(email),
           DefaultUsers.authenticate(email: email, password: current) == nil {
            currentError = L10n.ChangePassword.errorCurrentWrong
            return
        }

        showSuccess = true
    }
}

#Preview {
    NavigationStack {
        ChangePasswordView()
            .environment(AppState())
    }
}
