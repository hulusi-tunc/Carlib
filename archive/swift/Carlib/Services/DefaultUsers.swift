import Foundation

// Placeholder credential store. Plaintext passwords are acceptable here because
// this is a mock used for local testing — replace with a real backend before ship.
enum DefaultUsers {
    struct Credential {
        let email: String
        let password: String
        let user: User
    }

    static let all: [Credential] = [
        Credential(
            email: "driver@carlib.fr",
            password: "password",
            user: User(
                id: UUID(uuidString: "11111111-1111-1111-1111-111111111111")!,
                fullName: "Sophie Martin",
                email: "driver@carlib.fr",
                phone: "+33 6 12 34 56 78",
                role: .driver
            )
        ),
        Credential(
            email: "thomas@carlib.fr",
            password: "password",
            user: User(
                id: UUID(uuidString: "22222222-2222-2222-2222-222222222222")!,
                fullName: "Thomas Dubois",
                email: "thomas@carlib.fr",
                phone: "+33 6 23 45 67 89",
                role: .driver
            )
        ),
        Credential(
            email: "garage@carlib.fr",
            password: "password",
            user: User(
                id: UUID(uuidString: "33333333-3333-3333-3333-333333333333")!,
                fullName: "Atelier Dubois",
                email: "garage@carlib.fr",
                phone: "+33 1 42 00 12 34",
                role: .garage
            )
        ),
        Credential(
            email: "mediterranee@carlib.fr",
            password: "password",
            user: User(
                id: UUID(uuidString: "44444444-4444-4444-4444-444444444444")!,
                fullName: "Garage Méditerranée",
                email: "mediterranee@carlib.fr",
                phone: "+33 4 91 00 56 78",
                role: .garage
            )
        )
    ]

    static func authenticate(email: String, password: String) -> User? {
        let normalized = email.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        return all.first { $0.email.lowercased() == normalized && $0.password == password }?.user
    }

    static func hasEmail(_ email: String) -> Bool {
        let normalized = email.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        return all.contains { $0.email.lowercased() == normalized }
    }
}
