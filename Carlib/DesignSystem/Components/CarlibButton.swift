import SwiftUI

/// Custom Carlib button with brand styling.
/// Use for all CTAs. Native iOS used for sheets, popovers, alerts.
struct CarlibButton: View {
    let label: String
    var icon: String?
    var variant: Variant = .primary
    var isLoading: Bool = false
    var isDisabled: Bool = false
    var action: () -> Void

    enum Variant {
        case primary
        case secondary
        case ghost
        case destructive
    }

    var body: some View {
        Button(action: action) {
            Group {
                if isLoading {
                    ProgressView()
                        .tint(foregroundColor)
                } else {
                    if let icon {
                        Label {
                            Text(verbatim: label)
                        } icon: {
                            Image(systemName: icon)
                        }
                    } else {
                        Text(verbatim: label)
                    }
                }
            }
            .font(CarlibFont.bodyLarge(.semibold))
            .frame(maxWidth: variant == .ghost ? nil : .infinity)
            .frame(minHeight: CarlibSpacing.minTouchTarget)
            .foregroundStyle(foregroundColor)
            .background(backgroundColor, in: RoundedRectangle(cornerRadius: CarlibRadius.md))
            .overlay {
                if variant == .secondary {
                    RoundedRectangle(cornerRadius: CarlibRadius.md)
                        .strokeBorder(Color.brandCharcoal.opacity(0.3), lineWidth: 1.5)
                }
            }
        }
        .disabled(isDisabled || isLoading)
        .opacity(isDisabled ? 0.4 : 1.0)
    }

    private var foregroundColor: Color {
        switch variant {
        case .primary: .brandCharcoal
        case .secondary: .brandCharcoal
        case .ghost: .brandYellow
        case .destructive: .white
        }
    }

    private var backgroundColor: Color {
        switch variant {
        case .primary: .brandYellow
        case .secondary: .clear
        case .ghost: .clear
        case .destructive: .destructiveRed
        }
    }
}

#Preview("All Variants") {
    VStack(spacing: CarlibSpacing.md) {
        CarlibButton(label: "Déclarer un sinistre", icon: "plus.circle.fill", variant: .primary) {}
        CarlibButton(label: "Retour", variant: .secondary) {}
        CarlibButton(label: "Voir tout", variant: .ghost) {}
        CarlibButton(label: "Se déconnecter", icon: "rectangle.portrait.and.arrow.right", variant: .destructive) {}
        CarlibButton(label: "Chargement...", variant: .primary, isLoading: true) {}
        CarlibButton(label: "Désactivé", variant: .primary, isDisabled: true) {}
    }
    .padding()
}
