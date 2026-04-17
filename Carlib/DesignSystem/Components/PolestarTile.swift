import SwiftUI
import UIKit

/// Polestar-inspired dashboard tile — bold, colored, icon at bottom corner.
struct PolestarTile: View {
    let title: String
    var subtitle: String?
    let icon: RemixIcon
    var iconAlignment: IconAlignment = .bottomLeading
    var variant: TileVariant = .secondary
    var action: () -> Void

    enum TileVariant {
        case primary   // orange fill
        case secondary // dark gray fill
    }

    enum IconAlignment {
        case bottomLeading
        case bottomTrailing
    }

    var body: some View {
        Button(action: action) {
            ZStack(alignment: iconZAlignment) {
                // Icon — large, semi-transparent
                icon.view(
                    size: 34,
                    color: variant == .primary ? .black.opacity(0.2) : .carlibLabel.opacity(0.4)
                )
                .padding(CarlibSpacing.tilePadding)

                // Text content — top-left
                VStack(alignment: .leading, spacing: 4) {
                    Text(verbatim: title)
                        .font(CarlibFont.tileTitle())
                        .foregroundStyle(.carlibDark)

                    if let subtitle {
                        Text(verbatim: subtitle)
                            .font(CarlibFont.tileStatus())
                            .foregroundStyle(variant == .primary ? .black.opacity(0.6) : Color.carlibPrimaryBlue)
                    }

                    Spacer()
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(CarlibSpacing.tilePadding)
            }
            .frame(maxWidth: .infinity)
            .frame(height: CarlibSpacing.tileHeight)
            .background(tileColor, in: RoundedRectangle(cornerRadius: CarlibRadius.lg))
        }
        .buttonStyle(PressableButtonStyle(scale: 0.97, haptic: .light))
    }

    private var tileColor: Color {
        switch variant {
        case .primary: .tilePrimary
        case .secondary: .tileSecondary
        }
    }

    private var iconZAlignment: Alignment {
        switch iconAlignment {
        case .bottomLeading: .bottomLeading
        case .bottomTrailing: .bottomTrailing
        }
    }
}

#Preview {
    VStack(spacing: CarlibSpacing.tileGap) {
        HStack(spacing: CarlibSpacing.tileGap) {
            PolestarTile(
                title: "Report Damage",
                subtitle: "Declare now",
                icon: .errorWarningLine,
                variant: .primary
            ) {}

            PolestarTile(
                title: "Active Claim",
                subtitle: "In Repair",
                icon: .toolsLine,
                iconAlignment: .bottomTrailing
            ) {}
        }

        HStack(spacing: CarlibSpacing.tileGap) {
            PolestarTile(
                title: "Find Garage",
                icon: .mapPinLine
            ) {}

            PolestarTile(
                title: "My Vehicle",
                subtitle: "BC-456-CD",
                icon: .carLine,
                iconAlignment: .bottomTrailing
            ) {}
        }
    }
    .padding()
    .background(Color.carlibScreenBg)
}
