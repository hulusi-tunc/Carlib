import SwiftUI

/// Archive of the driver's past claims (completed, cancelled, expired).
/// Accessed from Profile — the active claim lives in the Home dossier,
/// so this view is an archive, not a workspace.
struct DriverClaimsListView: View {
    @Environment(ClaimStore.self) private var claimStore

    private var pastClaims: [Claim] {
        claimStore.pastClaims
    }

    var body: some View {
        Group {
            if pastClaims.isEmpty {
                ContentUnavailableView {
                    Label {
                        Text(verbatim: L10n.DriverClaims.emptyTitle)
                    } icon: {
                        RemixIcon.inboxLine.view(size: 48, color: .carlibSecondary)
                    }
                } description: {
                    Text(verbatim: L10n.DriverClaims.emptyDescription)
                }
            } else {
                ScrollView {
                    VStack(spacing: CarlibSpacing.sm) {
                        ForEach(pastClaims) { claim in
                            NavigationLink(value: claim.id) {
                                ClaimCardView(claim: claim)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.horizontal, CarlibSpacing.screenHorizontal)
                    .padding(.top, CarlibSpacing.sm)
                }
            }
        }
        .navigationTitle(Text(verbatim: L10n.DriverClaims.title))
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(for: UUID.self) { claimId in
            if let claim = claimStore.claims.first(where: { $0.id == claimId }) {
                DriverClaimDetailView(claim: claim)
            }
        }
    }
}

#Preview {
    NavigationStack {
        DriverClaimsListView()
    }
    .environment(ClaimStore())
}
