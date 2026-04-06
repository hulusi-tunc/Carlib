import SwiftUI

/// Vertical status timeline showing claim progression.
struct StatusTimelineView: View {
    let steps: [Step]

    struct Step: Identifiable {
        let id = UUID()
        let label: String
        let date: String?
        let state: StepState
    }

    enum StepState {
        case completed
        case current
        case upcoming
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ForEach(Array(steps.enumerated()), id: \.element.id) { index, step in
                HStack(alignment: .top, spacing: CarlibSpacing.md) {
                    // Indicator column
                    VStack(spacing: 0) {
                        circle(for: step.state)

                        if index < steps.count - 1 {
                            Rectangle()
                                .fill(lineColor(for: step.state))
                                .frame(width: 2, height: 32)
                        }
                    }
                    .frame(width: 24)

                    // Content
                    VStack(alignment: .leading, spacing: 2) {
                        Text(step.label)
                            .font(step.state == .current ? CarlibFont.bodyMedium(.semibold) : CarlibFont.bodyMedium())
                            .foregroundStyle(step.state == .upcoming ? .secondary : .primary)

                        if let date = step.date {
                            Text(date)
                                .font(CarlibFont.caption())
                                .foregroundStyle(.secondary)
                        }
                    }
                    .padding(.bottom, index < steps.count - 1 ? CarlibSpacing.sm : 0)
                }
            }
        }
    }

    @ViewBuilder
    private func circle(for state: StepState) -> some View {
        switch state {
        case .completed:
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 20))
                .foregroundStyle(.statusCompleted)
        case .current:
            Circle()
                .fill(Color.brandYellow)
                .frame(width: 20, height: 20)
                .overlay {
                    Circle()
                        .fill(.white)
                        .frame(width: 8, height: 8)
                }
        case .upcoming:
            Circle()
                .fill(Color(.systemGray4))
                .frame(width: 20, height: 20)
        }
    }

    private func lineColor(for state: StepState) -> Color {
        state == .completed ? .statusCompleted : Color(.systemGray4)
    }
}

// MARK: - Convenience for Claim

extension StatusTimelineView {
    init(claim: Claim) {
        let allSteps: [(ClaimStatus, String)] = [
            (.draft, ClaimStatus.draft.localizedName),
            (.submitted, ClaimStatus.submitted.localizedName),
            (.matched, ClaimStatus.matched.localizedName),
            (.accepted, ClaimStatus.accepted.localizedName),
            (.inProgress, ClaimStatus.inProgress.localizedName),
            (.repairing, ClaimStatus.repairing.localizedName),
            (.completed, ClaimStatus.completed.localizedName),
        ]

        let currentIndex = allSteps.firstIndex { $0.0 == claim.status } ?? 0

        self.steps = allSteps.enumerated().map { index, pair in
            let state: StepState
            if index < currentIndex { state = .completed }
            else if index == currentIndex { state = .current }
            else { state = .upcoming }

            let date: String? = index <= currentIndex ? claim.updatedAt.shortFormatted : nil

            return Step(label: pair.1, date: date, state: state)
        }
    }
}

#Preview {
    StatusTimelineView(claim: MockData.claims[3]) // repairing claim
        .padding()
}
