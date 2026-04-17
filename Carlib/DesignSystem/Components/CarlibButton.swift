import SwiftUI
import UIKit

/// Revolut-style button — clean, no strokes, weight hierarchy through fill.
struct CarlibButton: View {
    let label: String
    var icon: RemixIcon?
    var variant: Variant = .primary
    var isLoading: Bool = false
    var isDisabled: Bool = false
    var action: () -> Void

    enum Variant {
        case primary     // white fill, black text
        case secondary   // dark gray fill, white text
        case ghost       // no fill, accent text
        case destructive // red fill, white text
    }

    var body: some View {
        Button(action: action) {
            Group {
                if isLoading {
                    ProgressView()
                        .tint(foregroundColor)
                } else {
                    if let icon {
                        HStack(spacing: 8) {
                            icon.view(size: 18, color: foregroundColor)
                            Text(verbatim: label)
                        }
                    } else {
                        Text(verbatim: label)
                    }
                }
            }
            .font(CarlibFont.body(.medium))
            .frame(maxWidth: variant == .ghost ? nil : .infinity)
            .frame(height: 52)
            .foregroundStyle(foregroundColor)
            .background(backgroundColor, in: Capsule())
        }
        .buttonStyle(.pressable())
        .disabled(isDisabled || isLoading)
        .opacity(isDisabled ? 0.5 : 1.0)
    }

    @Environment(\.colorScheme) private var colorScheme

    private var foregroundColor: Color {
        switch variant {
        case .primary: colorScheme == .dark ? .black : .white
        case .secondary: colorScheme == .dark ? .white : .black
        case .ghost: .brandYellow
        case .destructive: .white
        }
    }

    private var backgroundColor: Color {
        switch variant {
        case .primary: colorScheme == .dark ? .white : .black
        case .secondary: Color.tileSecondary
        case .ghost: .clear
        case .destructive: .destructiveRed
        }
    }
}

#Preview("All Variants") {
    VStack(spacing: 12) {
        CarlibButton(label: "Create account", variant: .primary) {}
        CarlibButton(label: "Log in", variant: .secondary) {}
        CarlibButton(label: "See all", variant: .ghost) {}
        CarlibButton(label: "Delete account", variant: .destructive) {}
        CarlibButton(label: "Loading...", variant: .primary, isLoading: true) {}
        CarlibButton(label: "Disabled", variant: .primary, isDisabled: true) {}
    }
    .padding(.horizontal, 24)
    .background(Color.carlibScreenBg)
}
