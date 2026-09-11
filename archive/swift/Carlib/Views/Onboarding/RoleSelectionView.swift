import SwiftUI

/// Role selection — Revolut-style: back arrow, top-left title, large cards, bottom-pinned Continue + terms.
struct RoleSelectionView: View {
    @Environment(AppState.self) private var appState
    @State private var selectedRole: UserRole?

    var body: some View {
        ZStack {
            Color.carlibScreenBg.ignoresSafeArea()

            VStack(alignment: .leading, spacing: 0) {
                // Back button
                Button {
                    appState.signOut()
                } label: {
                    RemixIcon.arrowLeftLine.view(size: 24, color: .carlibDark)
                        .frame(width: 44, height: 44)
                }
                .padding(.leading, 12)
                .padding(.top, 8)

                // Title — top-left, Revolut-style large bold
                Text(verbatim: "How will you\nuse Carlib?")
                    .font(CarlibFont.display())
                    .foregroundStyle(.carlibDark)
                    .padding(.horizontal, 24)
                    .padding(.top, 8)

                // Role cards
                VStack(spacing: 12) {
                    roleCard(
                        role: .driver,
                        icon: .carLine,
                        title: L10n.Role.driverTitle,
                        description: L10n.Role.driverDescription
                    )

                    roleCard(
                        role: .garage,
                        icon: .wrenchLine,
                        title: L10n.Role.garageTitle,
                        description: L10n.Role.garageDescription
                    )
                }
                .padding(.horizontal, 24)
                .padding(.top, 32)

                Spacer()

                // Terms text
                Text(verbatim: L10n.Auth.termsDisclaimer)
                    .font(CarlibFont.caption())
                    .foregroundStyle(.carlibLabel)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: .infinity)
                    .padding(.horizontal, 40)
                    .padding(.bottom, 12)

                // Continue button — brand yellow, full width
                Button {
                    guard let role = selectedRole else { return }
                    withAnimation(.easeInOut(duration: 0.3)) {
                        appState.userRole = role
                    }
                } label: {
                    Text(verbatim: L10n.Role.continueButton)
                        .font(CarlibFont.body(.medium))
                        .foregroundStyle(selectedRole != nil ? .black : .carlibLabel)
                        .frame(maxWidth: .infinity)
                        .frame(height: 54)
                        .background(
                            selectedRole != nil ? Color.brandYellow : Color.tileSecondary,
                            in: Capsule()
                        )
                }
                .disabled(selectedRole == nil)
                .padding(.horizontal, 24)
                .padding(.bottom, 32)
            }
        }
    }

    // MARK: - Role Card

    private func roleCard(role: UserRole, icon: RemixIcon, title: String, description: String) -> some View {
        let isSelected = selectedRole == role

        return Button {
            withAnimation(.easeInOut(duration: 0.2)) {
                selectedRole = role
            }
        } label: {
            HStack(spacing: 16) {
                // Remix icon in circle
                Circle()
                    .fill(isSelected ? Color.brandYellow.opacity(0.15) : Color.carlibCardBorder)
                    .frame(width: 48, height: 48)
                    .overlay {
                        icon.view(size: 22, color: isSelected ? .brandYellow : .carlibSecondary)
                    }

                // Text
                VStack(alignment: .leading, spacing: 3) {
                    Text(verbatim: title)
                        .font(CarlibFont.bodyLarge(.medium))
                        .foregroundStyle(.carlibDark)

                    Text(verbatim: description)
                        .font(CarlibFont.caption())
                        .foregroundStyle(.carlibSecondary)
                        .lineLimit(2)
                }

                Spacer()

                // Radio circle
                ZStack {
                    Circle()
                        .strokeBorder(isSelected ? Color.brandYellow : Color.carlibCardBorder, lineWidth: 2)
                        .frame(width: 22, height: 22)

                    if isSelected {
                        Circle()
                            .fill(Color.brandYellow)
                            .frame(width: 12, height: 12)
                    }
                }
            }
            .padding(16)
            .background(
                RoundedRectangle(cornerRadius: 14)
                    .fill(Color.tileSecondary)
                    .overlay {
                        if isSelected {
                            RoundedRectangle(cornerRadius: 14)
                                .strokeBorder(Color.brandYellow.opacity(0.4), lineWidth: 1.5)
                        }
                    }
            )
        }
        .buttonStyle(.pressable(scale: 0.98, haptic: .light))
    }
}

#Preview {
    RoleSelectionView()
        .environment(AppState())
}
