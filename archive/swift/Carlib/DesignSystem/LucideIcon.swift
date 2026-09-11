import SwiftUI

/// Centralized icon registry — all UI icons map to RemixIcon cases.
/// No SF Symbols anywhere in app chrome. Use RemixIcon directly for one-off glyphs,
/// or CarlibIcon for semantic roles that may change glyph over time.
enum CarlibIcon {
    // Tab bar
    static let home: RemixIcon = .homeLine
    static let shops: RemixIcon = .mapPinLine
    static let profile: RemixIcon = .userLine
    static let dashboard: RemixIcon = .dashboardLine
    static let claims: RemixIcon = .fileListLine
    static let planning: RemixIcon = .calendarLine
    static let shop: RemixIcon = .store2Line

    // Actions
    static let report: RemixIcon = .addLine
    static let add: RemixIcon = .addLine
    static let addCircle: RemixIcon = .addCircleLine
    static let close: RemixIcon = .closeLine
    static let check: RemixIcon = .checkLine
    static let search: RemixIcon = .searchLine
    static let edit: RemixIcon = .editLine

    // Navigation chevrons
    static let chevronRight: RemixIcon = .arrowRightSLine
    static let chevronDown: RemixIcon = .arrowDownSLine
    static let chevronUp: RemixIcon = .arrowUpSLine
    static let chevronLeft: RemixIcon = .arrowLeftSLine
    static let arrowRight: RemixIcon = .arrowRightLine
    static let arrowLeft: RemixIcon = .arrowLeftLine

    // Contact & location
    static let mapPin: RemixIcon = .mapPinLine
    static let mapPinFilled: RemixIcon = .mapPinFill
    static let phone: RemixIcon = .phoneLine
    static let phoneFilled: RemixIcon = .phoneFill

    // Vehicle
    static let car: RemixIcon = .carLine
    static let carFilled: RemixIcon = .carFill
    static let carFront: RemixIcon = .carLine

    // Claim & status
    static let triangleAlert: RemixIcon = .errorWarningLine
    static let send: RemixIcon = .sendPlaneLine
    static let sendFilled: RemixIcon = .sendPlaneFill
    static let wrench: RemixIcon = .toolsLine
    static let wrenchFilled: RemixIcon = .toolsFill
    static let checkCircle: RemixIcon = .checkboxCircleLine
    static let checkCircleFilled: RemixIcon = .checkboxCircleFill
    static let closeCircleFilled: RemixIcon = .closeCircleFill
    static let shieldCheck: RemixIcon = .shieldCheckFill
    static let thumbUp: RemixIcon = .thumbUpFill
    static let verified: RemixIcon = .verifiedBadgeFill
    static let archiveBox: RemixIcon = .archiveFill
    static let stethoscope: RemixIcon = .stethoscopeLine

    // Time
    static let calendar: RemixIcon = .calendarLine
    static let calendarCheck: RemixIcon = .calendarCheckFill
    static let calendarSchedule: RemixIcon = .calendarScheduleLine
    static let clock: RemixIcon = .timeLine
    static let clockFilled: RemixIcon = .timeFill
    static let history: RemixIcon = .historyLine

    // Content
    static let photo: RemixIcon = .imageLine
    static let photoFilled: RemixIcon = .imageFill
    static let camera: RemixIcon = .cameraFill
    static let file: RemixIcon = .fileTextLine
    static let inbox: RemixIcon = .inboxLine
    static let pencil: RemixIcon = .pencilLine

    // Profile & settings
    static let bell: RemixIcon = .notificationLine
    static let globe: RemixIcon = .globalLine
    static let contrast: RemixIcon = .contrastFill
    static let info: RemixIcon = .informationLine
    static let lock: RemixIcon = .shieldKeyholeLine
    static let logout: RemixIcon = .logoutBoxLine
    static let building: RemixIcon = .storeLine
    static let buildingFilled: RemixIcon = .storeFill
    static let star: RemixIcon = .starFill
    static let eye: RemixIcon = .eyeLine
    static let eyeOff: RemixIcon = .eyeOffLine
}
