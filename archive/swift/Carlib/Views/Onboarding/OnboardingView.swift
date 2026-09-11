import SwiftUI

/// Onboarding flow — role selection and initial setup.
struct OnboardingView: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        NavigationStack {
            VStack(spacing: CarlibSpacing.xxl) {
                Spacer()

                // Logo placeholder
                RemixIcon.carFill.view(size: 64, color: .brandYellow)

                Text(verbatim: L10n.Onboarding.welcomeTitle)
                    .font(CarlibFont.displayLarge())
                    .multilineTextAlignment(.center)

                Text(verbatim: L10n.Onboarding.welcomeSubtitle)
                    .font(CarlibFont.bodyLarge())
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, CarlibSpacing.xl)

                Spacer()

                VStack(spacing: CarlibSpacing.md) {
                    CarlibButton(
                        label: L10n.Onboarding.roleDriver,
                        icon: .userFill,
                        variant: .primary
                    ) {
                        appState.userRole = .driver
                        appState.isOnboarded = true
                    }

                    CarlibButton(
                        label: L10n.Onboarding.roleGarage,
                        icon: .toolsFill,
                        variant: .secondary
                    ) {
                        appState.userRole = .garage
                        appState.isOnboarded = true
                    }
                }
                .padding(.horizontal, CarlibSpacing.screenHorizontal)
                .padding(.bottom, CarlibSpacing.xxl)
            }
        }
    }
}

#Preview {
    OnboardingView()
        .environment(AppState())
}
