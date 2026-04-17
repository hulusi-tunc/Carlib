import SwiftUI

/// Reusable card container — dark theme variants.
struct CarlibCard<Content: View>: View {
    var variant: Variant = .flat
    @ViewBuilder var content: () -> Content

    enum Variant {
        case flat      // dark surface + subtle border
        case elevated  // dark surface + lighter border
    }

    var body: some View {
        content()
            .padding(CarlibSpacing.cardPadding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background {
                switch variant {
                case .flat:
                    RoundedRectangle(cornerRadius: CarlibRadius.lg)
                        .fill(Color.tileSecondary)
                case .elevated:
                    RoundedRectangle(cornerRadius: CarlibRadius.lg)
                        .fill(Color.tileSecondary)
                        .strokeBorder(Color.carlibCardBorder, lineWidth: 1)
                }
            }
    }
}

#Preview {
    VStack(spacing: CarlibSpacing.md) {
        CarlibCard(variant: .flat) {
            Text("Flat card")
                .foregroundStyle(.carlibDark)
        }
        CarlibCard(variant: .elevated) {
            Text("Elevated card")
                .foregroundStyle(.carlibDark)
        }
    }
    .padding()
    .background(Color.carlibScreenBg)
}
