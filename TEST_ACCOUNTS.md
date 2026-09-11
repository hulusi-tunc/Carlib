# Test Accounts

Placeholder credentials for local sign-in. Source of truth: [mobile/src/services/defaultUsers.ts](mobile/src/services/defaultUsers.ts) (the archived SwiftUI app keeps its copy in `archive/swift/Carlib/Services/DefaultUsers.swift`).

> These are mock accounts — passwords live in plaintext in the source. Replace with real auth before ship.

## Drivers

| Email | Password | Name |
|---|---|---|
| `driver@carlib.fr` | `password` | Sophie Martin |
| `thomas@carlib.fr` | `password` | Thomas Dubois |

## Body shops (garages)

| Email | Password | Name |
|---|---|---|
| `garage@carlib.fr` | `password` | Atelier Dubois |
| `mediterranee@carlib.fr` | `password` | Garage Méditerranée |

## Behavior

- Signing in as any of these lands **directly** in the matching tab view — role is pre-assigned, so `RoleSelectionView` is skipped.
- Wrong password → shows "Invalid email or password".
- Sign-up still works for any other email; those users stay signed in via Keychain but can't sign back in after sign-out (password isn't persisted).
- Sign-up is rejected if the email collides with a default account above.
