import Foundation

/// Authenticated user profile.
struct User: Codable, Identifiable, Equatable {
    let id: UUID
    var fullName: String
    var email: String
    var phone: String?
    var role: UserRole?
    var appleUserIdentifier: String?
    var createdAt: Date

    init(
        id: UUID = UUID(),
        fullName: String = "",
        email: String = "",
        phone: String? = nil,
        role: UserRole? = nil,
        appleUserIdentifier: String? = nil,
        createdAt: Date = .now
    ) {
        self.id = id
        self.fullName = fullName
        self.email = email
        self.phone = phone
        self.role = role
        self.appleUserIdentifier = appleUserIdentifier
        self.createdAt = createdAt
    }
}
