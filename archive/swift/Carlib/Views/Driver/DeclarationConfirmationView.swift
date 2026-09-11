import SwiftUI

/// Success screen after submitting a declaration.
struct DeclarationConfirmationView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(spacing: CarlibSpacing.xxl) {
            Spacer()

            RemixIcon.checkboxCircleFill.view(size: 80, color: .statusCompleted)

            VStack(spacing: CarlibSpacing.sm) {
                Text(verbatim: L10n.Declaration.confirmationTitle)
                    .font(CarlibFont.displayMedium())
                    .multilineTextAlignment(.center)

                Text(verbatim: L10n.Declaration.confirmationSubtitle)
                    .font(CarlibFont.bodyMedium())
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, CarlibSpacing.xl)
            }

            CarlibCard(variant: .flat) {
                HStack {
                    Text(verbatim: L10n.Declaration.confirmationReference)
                        .font(CarlibFont.bodySmall())
                        .foregroundStyle(.secondary)
                    Spacer()
                    Text("SIN-2026-\(String(format: "%04d", Int.random(in: 1...9999)))")
                        .font(CarlibFont.bodyMedium(.medium))
                }
            }
            .padding(.horizontal, CarlibSpacing.screenHorizontal)

            Spacer()

            CarlibButton(label: L10n.Declaration.confirmationCtaHome, variant: .primary) {
                appState.pendingDriverTab = .home
                dismiss()
            }
            .padding(.horizontal, CarlibSpacing.screenHorizontal)
            .padding(.bottom, CarlibSpacing.xxl)
        }
    }
}

#Preview {
    DeclarationConfirmationView()
        .environment(AppState())
}
