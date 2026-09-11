import Foundation

/// Authentication lifecycle.
enum AuthStatus: Equatable {
    case unknown          // app launched, checking Keychain
    case unauthenticated  // no session
    case authenticated    // valid session
    case sessionExpired   // was logged in, token expired
}
