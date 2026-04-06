import SwiftUI

/// Reusable section header with title and optional trailing action.
struct CarlibSectionHeader: View {
    let title: String
    var actionLabel: String?
    var action: (() -> Void)?

    var body: some View {
        HStack {
            Text(verbatim: title)
                .font(CarlibFont.headingSmall())

            Spacer()

            if let actionLabel, let action {
                Button(action: action) {
                    Text(verbatim: actionLabel)
                        .font(CarlibFont.bodySmall(.medium))
                        .foregroundStyle(.brandYellow)
                }
            }
        }
        .padding(.horizontal, CarlibSpacing.screenHorizontal)
    }
}

#Preview {
    VStack(spacing: CarlibSpacing.lg) {
        CarlibSectionHeader(title: "Garages à proximité", actionLabel: "Voir tout") {}
        CarlibSectionHeader(title: "Mes sinistres")
    }
}
