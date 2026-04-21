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
                        // View-based push — the surrounding stack (Profile)
                        // uses view-based NavigationLinks too, and mixing in a
                        // value-based `.navigationDestination(for: UUID.self)`
                        // here was causing the detail to push and this list
                        // to re-appear on top of it.
                        ForEach(pastClaims) { claim in
                            NavigationLink {
                                DriverClaimDetailView(claim: claim)
                            } label: {
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
    }
}

#Preview {
    NavigationStack {
        DriverClaimsListView()
    }
    .environment(ClaimStore())
}
