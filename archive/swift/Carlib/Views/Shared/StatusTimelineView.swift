import SwiftUI

/// Horizontal progress stepper — Uber/delivery-style claim tracking.
struct StatusTimelineView: View {
    let steps: [Step]

    struct Step: Identifiable {
        let id = UUID()
        let label: String
        let shortLabel: String
        let date: String?
        let state: StepState
    }

    enum StepState {
        case completed, current, upcoming
    }

    var body: some View {
        VStack(spacing: 12) {
            // Horizontal dots + lines
            HStack(spacing: 0) {
                ForEach(Array(steps.enumerated()), id: \.element.id) { index, step in
                    // Dot
                    stepDot(for: step.state)

                    // Line (between dots, not after last)
                    if index < steps.count - 1 {
                        Rectangle()
                            .fill(step.state == .completed ? Color.statusCompleted : Color.carlibCardBorder)
                            .frame(height: 2)
                    }
                }
            }

            // Labels below
            HStack(spacing: 0) {
                ForEach(Array(steps.enumerated()), id: \.element.id) { index, step in
                    VStack(spacing: 2) {
                        Text(verbatim: step.shortLabel)
                            .font(CarlibFont.caption(step.state == .current ? .medium : .regular))
                            .foregroundStyle(step.state == .upcoming ? .carlibLabel : .carlibDark)

                        if let date = step.date {
                            Text(verbatim: date)
                                .font(.system(size: 10))
                                .foregroundStyle(.carlibSecondary)
                        }
                    }
                    .frame(maxWidth: .infinity)
                }
            }
        }
    }

    @ViewBuilder
    private func stepDot(for state: StepState) -> some View {
        switch state {
        case .completed:
            ZStack {
                Circle()
                    .fill(Color.statusCompleted)
                    .frame(width: 22, height: 22)
                RemixIcon.checkLine.view(size: 12, color: .white)
            }
        case .current:
            ZStack {
                Circle()
                    .fill(Color.brandYellow.opacity(0.2))
                    .frame(width: 28, height: 28)
                Circle()
                    .fill(Color.brandYellow)
                    .frame(width: 16, height: 16)
            }
        case .upcoming:
            Circle()
                .fill(Color.carlibCardBorder)
                .frame(width: 14, height: 14)
        }
    }
}

// MARK: - Convenience for Claim

extension StatusTimelineView {
    init(claim: Claim) {
        let allSteps: [(ClaimStatus, String, String)] = [
            (.submitted, ClaimStatus.submitted.localizedName, "Sent"),
            (.matched, ClaimStatus.matched.localizedName, "Matched"),
            (.accepted, ClaimStatus.accepted.localizedName, "Accepted"),
            (.repairing, ClaimStatus.repairing.localizedName, "Repair"),
            (.completed, ClaimStatus.completed.localizedName, "Done"),
        ]

        let currentIndex = allSteps.firstIndex { $0.0 == claim.status }
            ?? allSteps.firstIndex { $0.0.rawValue >= claim.status.rawValue }
            ?? 0

        self.steps = allSteps.enumerated().map { index, tuple in
            let state: StepState
            if index < currentIndex { state = .completed }
            else if index == currentIndex { state = .current }
            else { state = .upcoming }

            let date: String? = index <= currentIndex ? claim.updatedAt.shortFormatted : nil

            return Step(label: tuple.1, shortLabel: tuple.2, date: date, state: state)
        }
    }
}

#Preview {
    StatusTimelineView(claim: MockData.claims[3])
        .padding()
        .background(Color.carlibScreenBg)
}
