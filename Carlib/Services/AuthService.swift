import SwiftUI
import AuthenticationServices

/// Handles authentication — Sign in with Apple + email/password.
/// Placeholder implementation: email/password validates against `DefaultUsers`.
/// Replace with real backend before ship.
@MainActor @Observable
final class AuthService {
    var isLoading = false
    var errorMessage: String?

    // MARK: - Check Existing Session

    func checkExistingSession() -> (AuthStatus, User?) {
        if let user = KeychainManager.loadUser(), KeychainManager.loadToken() != nil {
            return (.authenticated, user)
        }
        return (.unauthenticated, nil)
    }

    // MARK: - Sign In with Apple

    func handleAppleSignIn(result: Result<ASAuthorization, Error>, completion: @escaping (User?) -> Void) {
        switch result {
        case .success(let auth):
            if let credential = auth.credential as? ASAuthorizationAppleIDCredential {
                let user = User(
                    fullName: [credential.fullName?.givenName, credential.fullName?.familyName]
                        .compactMap { $0 }.joined(separator: " "),
                    email: credential.email ?? "",
                    appleUserIdentifier: credential.user
                )
                // Persist
                KeychainManager.saveToken("apple_\(credential.user)")
                KeychainManager.saveUser(user)
                completion(user)
            }
        case .failure(let error):
            errorMessage = error.localizedDescription
            completion(nil)
        }
    }

    // MARK: - Email Sign Up (placeholder — password is not persisted)

    func signUp(fullName: String, email: String, password: String) async -> User? {
        isLoading = true
        errorMessage = nil

        try? await Task.sleep(for: .seconds(1))

        guard !email.isEmpty, password.count >= 8 else {
            errorMessage = "Invalid email or password (8+ characters)"
            isLoading = false
            return nil
        }

        if DefaultUsers.hasEmail(email) {
            errorMessage = "An account with this email already exists"
            isLoading = false
            return nil
        }

        let user = User(fullName: fullName, email: email)
        KeychainManager.saveToken("email_\(UUID().uuidString)")
        KeychainManager.saveUser(user)
        isLoading = false
        return user
    }

    // MARK: - Email Sign In

    func signIn(email: String, password: String) async -> User? {
        isLoading = true
        errorMessage = nil

        try? await Task.sleep(for: .seconds(1))

        guard !email.isEmpty, !password.isEmpty else {
            errorMessage = L10n.SignIn.errorInvalid
            isLoading = false
            return nil
        }

        if let seed = DefaultUsers.authenticate(email: email, password: password) {
            KeychainManager.saveToken("email_\(UUID().uuidString)")
            KeychainManager.saveUser(seed)
            isLoading = false
            return seed
        }

        // Returning sign-up user: we never persisted their password, so accept
        // any password as long as the Keychain-stored email matches.
        if let stored = KeychainManager.loadUser(),
           stored.email.lowercased() == email.lowercased(),
           !DefaultUsers.hasEmail(stored.email) {
            KeychainManager.saveToken("email_\(UUID().uuidString)")
            isLoading = false
            return stored
        }

        errorMessage = L10n.SignIn.errorInvalid
        isLoading = false
        return nil
    }

    // MARK: - Update User Role

    func updateRole(_ role: UserRole, for user: User) -> User {
        var updated = user
        updated.role = role
        KeychainManager.saveUser(updated)
        return updated
    }

    // MARK: - Sign Out

    func signOut() {
        KeychainManager.clearAll()
    }
}
