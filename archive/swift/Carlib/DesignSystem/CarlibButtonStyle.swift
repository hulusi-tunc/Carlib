import SwiftUI
import UIKit

/// Apple-style pressable feedback: subtle scale-down on press + soft haptic on touch-down.
///
/// Default: 0.96 scale, `.soft` haptic, spring animation.
/// Use `.buttonStyle(.pressable)` or `.buttonStyle(.pressable(scale:haptic:))`.
struct PressableButtonStyle: ButtonStyle {
    var scale: CGFloat = 0.96
    var haptic: UIImpactFeedbackGenerator.FeedbackStyle = .soft

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? scale : 1.0)
            .animation(.spring(response: 0.28, dampingFraction: 0.72), value: configuration.isPressed)
            .onChange(of: configuration.isPressed) { _, pressed in
                guard pressed else { return }
                let generator = UIImpactFeedbackGenerator(style: haptic)
                generator.impactOccurred()
            }
    }
}

extension ButtonStyle where Self == PressableButtonStyle {
    /// Apple-style pressable feedback — scale down + soft haptic on touch.
    /// Call as `.buttonStyle(.pressable())` or `.buttonStyle(.pressable(scale: 0.97, haptic: .light))`.
    static func pressable(
        scale: CGFloat = 0.96,
        haptic: UIImpactFeedbackGenerator.FeedbackStyle = .soft
    ) -> PressableButtonStyle {
        PressableButtonStyle(scale: scale, haptic: haptic)
    }
}
