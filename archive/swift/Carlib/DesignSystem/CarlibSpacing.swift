import SwiftUI

/// Carlib spacing tokens. Base unit: 4pt.
enum CarlibSpacing {
    /// 4pt
    static let xxs: CGFloat = 4
    /// 8pt
    static let xs: CGFloat = 8
    /// 12pt
    static let sm: CGFloat = 12
    /// 16pt
    static let md: CGFloat = 16
    /// 20pt
    static let lg: CGFloat = 20
    /// 24pt
    static let xl: CGFloat = 24
    /// 32pt
    static let xxl: CGFloat = 32
    /// 40pt
    static let xxxl: CGFloat = 40
    /// 48pt
    static let huge: CGFloat = 48

    /// Minimum touch target for post-accident stress context.
    static let minTouchTarget: CGFloat = 48

    /// Screen horizontal padding.
    static let screenHorizontal: CGFloat = 16

    /// Card internal padding.
    static let cardPadding: CGFloat = 16

    /// Section spacing.
    static let sectionSpacing: CGFloat = 24

    // MARK: - Tiles (Polestar grid)

    /// Gap between grid tiles.
    static let tileGap: CGFloat = 12
    /// Standard tile height.
    static let tileHeight: CGFloat = 180
    /// Tile internal padding.
    static let tilePadding: CGFloat = 16
}
