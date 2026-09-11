import Foundation

/// Small curated set of country dial codes for phone-number entry.
/// France first since Carlib launches in FR; surrounding markets follow.
struct CountryDialCode: Identifiable, Hashable, Codable {
    /// ISO 3166-1 alpha-2, used as the stable id.
    let id: String
    let dialCode: String
    let name: String
    let flag: String

    static let all: [CountryDialCode] = [
        .init(id: "FR", dialCode: "+33",  name: "France",         flag: "🇫🇷"),
        .init(id: "BE", dialCode: "+32",  name: "Belgium",        flag: "🇧🇪"),
        .init(id: "CH", dialCode: "+41",  name: "Switzerland",    flag: "🇨🇭"),
        .init(id: "LU", dialCode: "+352", name: "Luxembourg",     flag: "🇱🇺"),
        .init(id: "MC", dialCode: "+377", name: "Monaco",         flag: "🇲🇨"),
        .init(id: "DE", dialCode: "+49",  name: "Germany",        flag: "🇩🇪"),
        .init(id: "IT", dialCode: "+39",  name: "Italy",          flag: "🇮🇹"),
        .init(id: "ES", dialCode: "+34",  name: "Spain",          flag: "🇪🇸"),
        .init(id: "PT", dialCode: "+351", name: "Portugal",       flag: "🇵🇹"),
        .init(id: "NL", dialCode: "+31",  name: "Netherlands",    flag: "🇳🇱"),
        .init(id: "GB", dialCode: "+44",  name: "United Kingdom", flag: "🇬🇧"),
        .init(id: "IE", dialCode: "+353", name: "Ireland",        flag: "🇮🇪"),
        .init(id: "US", dialCode: "+1",   name: "United States",  flag: "🇺🇸"),
        .init(id: "TR", dialCode: "+90",  name: "Türkiye",        flag: "🇹🇷"),
    ]

    static let `default` = all.first { $0.id == "FR" }!

    /// Look up a country by dial code; falls back to the default country.
    static func from(dialCode: String) -> CountryDialCode {
        all.first { $0.dialCode == dialCode } ?? .default
    }
}
