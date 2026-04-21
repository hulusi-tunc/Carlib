import Foundation

extension Date {
    private static let enLocale = Locale(identifier: "en_US")

    /// "Mon, Apr 7" style
    var shortFormatted: String {
        formatted(.dateTime.weekday(.abbreviated).day().month(.abbreviated).locale(Self.enLocale))
    }

    /// "Apr 7" style — month + day only, for list rows where the weekday is clutter.
    var monthDayFormatted: String {
        formatted(.dateTime.month(.abbreviated).day().locale(Self.enLocale))
    }

    /// "April 7, 2026"
    var longFormatted: String {
        formatted(.dateTime.month(.wide).day().year().locale(Self.enLocale))
    }

    /// "2:30 PM"
    var timeFormatted: String {
        formatted(.dateTime.hour().minute().locale(Self.enLocale))
    }

    /// "2 days ago", "today", etc.
    var relativeFormatted: String {
        let f = RelativeDateTimeFormatter()
        f.locale = Self.enLocale
        f.unitsStyle = .full
        return f.localizedString(for: self, relativeTo: .now)
    }

    /// Helper to create dates relative to now.
    static func daysFromNow(_ days: Int) -> Date {
        Calendar.current.date(byAdding: .day, value: days, to: .now) ?? .now
    }

    static func hoursFromNow(_ hours: Int) -> Date {
        Calendar.current.date(byAdding: .hour, value: hours, to: .now) ?? .now
    }
}
