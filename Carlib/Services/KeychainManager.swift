import Foundation
import Security

/// Minimal Keychain wrapper — stores/retrieves session tokens securely.
enum KeychainManager {
    private static let service = "com.carlib.app"

    static func save(key: String, data: Data) -> Bool {
        delete(key: key) // remove existing before saving
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlock
        ]
        return SecItemAdd(query as CFDictionary, nil) == errSecSuccess
    }

    static func load(key: String) -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        var result: AnyObject?
        guard SecItemCopyMatching(query as CFDictionary, &result) == errSecSuccess else { return nil }
        return result as? Data
    }

    @discardableResult
    static func delete(key: String) -> Bool {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key
        ]
        return SecItemDelete(query as CFDictionary) == errSecSuccess
    }

    // Convenience for string tokens
    static func saveToken(_ token: String) {
        save(key: "session_token", data: Data(token.utf8))
    }

    static func loadToken() -> String? {
        guard let data = load(key: "session_token") else { return nil }
        return String(data: data, encoding: .utf8)
    }

    static func deleteToken() {
        delete(key: "session_token")
    }

    // User profile
    static func saveUser(_ user: User) {
        if let data = try? JSONEncoder().encode(user) {
            save(key: "current_user", data: data)
        }
    }

    static func loadUser() -> User? {
        guard let data = load(key: "current_user"),
              let user = try? JSONDecoder().decode(User.self, from: data) else { return nil }
        return user
    }

    static func deleteUser() {
        delete(key: "current_user")
    }

    static func clearAll() {
        deleteToken()
        deleteUser()
    }
}
