import SwiftUI
import UIKit

/// Bottom sheet for moving a case along the repair pipeline.
/// Primary affordance is a single "Advance to next stage" CTA so shop
/// owners don't have to know the stepper circles are tappable; power
/// users can still jump to any stage via the list below.
struct RepairStatusSheet: View {
    let currentStatus: RepairStatus?
    let onSave: (RepairStatus) -> Void

    @Environment(\.dismiss) private var dismiss
    @State private var selection: RepairStatus
    @State private var userPickedStage = false

    init(currentStatus: RepairStatus?, onSave: @escaping (RepairStatus) -> Void) {
        self.currentStatus = currentStatus
        self.onSave = onSave
        _selection = State(initialValue: currentStatus ?? .diagnostic)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    header
                        .padding(.horizontal, 20)
                        .padding(.top, 8)
                        .padding(.bottom, 20)

                    if let next = nextStage {
                        nextStepCard(nextStage: next)
                            .padding(.horizontal, 20)
                            .padding(.bottom, 24)
                    }

                    sectionLabel(text: nextStage == nil ? "PICK A STAGE" : "OR JUMP TO ANOTHER STAGE")
                        .padding(.horizontal, 20)
                        .padding(.bottom, 12)

                    VStack(spacing: 0) {
                        ForEach(Array(RepairStatus.allCases.enumerated()), id: \.element) { index, status in
                            statusRow(
                                status: status,
                                isLast: index == RepairStatus.allCases.count - 1
                            )
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 28)
                }
            }
            .safeAreaInset(edge: .bottom) {
                if userPickedStage && selection != currentStatus {
                    CarlibButton(label: "Save update", variant: .primary) {
                        UINotificationFeedbackGenerator().notificationOccurred(.success)
                        onSave(selection)
                        dismiss()
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 8)
                    .padding(.bottom, 16)
                    .background(.ultraThinMaterial)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
            .animation(.spring(duration: 0.3), value: userPickedStage)
            .animation(.spring(duration: 0.3), value: selection)
            .background(Color.carlibScreenBg.ignoresSafeArea())
            .navigationTitle(Text(verbatim: "Update status"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(L10n.Common.cancel) { dismiss() }
                }
            }
        }
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
    }

    // MARK: - Header

    private var header: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(verbatim: "Where are you?")
                .font(.custom("Aeonik-Medium", size: 26))
                .foregroundStyle(.carlibDark)
            Text(verbatim: "Tap to advance — the driver gets notified instantly.")
                .font(CarlibFont.body())
                .foregroundStyle(.carlibSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func sectionLabel(text: String) -> some View {
        Text(verbatim: text)
            .font(CarlibFont.caption(.medium))
            .tracking(1.2)
            .foregroundStyle(.carlibSecondary)
    }

    // MARK: - Next step (primary CTA)

    private func nextStepCard(nextStage: RepairStatus) -> some View {
        Button {
            UINotificationFeedbackGenerator().notificationOccurred(.success)
            onSave(nextStage)
            dismiss()
        } label: {
            VStack(alignment: .leading, spacing: 14) {
                HStack(spacing: 8) {
                    RemixIcon.arrowRightCircleFill.view(size: 14, color: .brandYellow)
                    Text(verbatim: "NEXT STEP")
                        .font(CarlibFont.caption(.medium))
                        .tracking(1.2)
                        .foregroundStyle(.brandYellow)
                    Spacer(minLength: 0)
                }

                VStack(alignment: .leading, spacing: 6) {
                    Text(verbatim: "Move to \(nextStage.localizedName)")
                        .font(.custom("Aeonik-Medium", size: 20))
                        .foregroundStyle(.carlibDark)
                        .multilineTextAlignment(.leading)
                        .fixedSize(horizontal: false, vertical: true)
                    Text(verbatim: description(for: nextStage))
                        .font(CarlibFont.footnote())
                        .foregroundStyle(.carlibSecondary)
                        .multilineTextAlignment(.leading)
                        .fixedSize(horizontal: false, vertical: true)
                }

                HStack(spacing: 6) {
                    Text(verbatim: "Advance")
                        .font(CarlibFont.body(.medium))
                    RemixIcon.arrowRightLine.view(size: 16, color: .black)
                }
                .foregroundStyle(.black)
                .frame(maxWidth: .infinity)
                .frame(height: 48)
                .background(Color.brandYellow, in: Capsule())
            }
            .padding(16)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.tileSecondary, in: RoundedRectangle(cornerRadius: 18))
            .overlay {
                RoundedRectangle(cornerRadius: 18)
                    .strokeBorder(Color.brandYellow.opacity(0.35), lineWidth: 1)
            }
            .contentShape(RoundedRectangle(cornerRadius: 18))
        }
        .buttonStyle(.pressable(scale: 0.98, haptic: .medium))
    }

    // MARK: - Stage list (secondary)

    private func statusRow(status: RepairStatus, isLast: Bool) -> some View {
        let isSelected = selection == status
        let isCurrent = currentStatus == status

        return Button {
            if selection != status {
                UISelectionFeedbackGenerator().selectionChanged()
            }
            selection = status
            userPickedStage = true
        } label: {
            HStack(alignment: .center, spacing: 14) {
                VStack(spacing: 0) {
                    ZStack {
                        Circle()
                            .stroke(
                                isSelected ? Color.brandYellow : Color.carlibCardBorder,
                                lineWidth: 2
                            )
                            .frame(width: 26, height: 26)
                        if isSelected {
                            Circle()
                                .fill(Color.brandYellow)
                                .frame(width: 14, height: 14)
                        }
                    }

                    if !isLast {
                        Rectangle()
                            .fill(Color.carlibCardBorder)
                            .frame(width: 2)
                            .frame(minHeight: 20, maxHeight: .infinity)
                    }
                }
                .frame(width: 26)

                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 8) {
                        Text(verbatim: status.localizedName)
                            .font(CarlibFont.body(.medium))
                            .foregroundStyle(.carlibDark)
                        if isCurrent {
                            Text(verbatim: "Current")
                                .font(CarlibFont.caption(.medium))
                                .foregroundStyle(.carlibSecondary)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 3)
                                .background(Color.tileSecondary, in: Capsule())
                        }
                    }

                    Text(verbatim: description(for: status))
                        .font(CarlibFont.footnote())
                        .foregroundStyle(.carlibSecondary)
                        .fixedSize(horizontal: false, vertical: true)
                }

                Spacer(minLength: 8)

                RemixIcon.arrowRightSLine.view(
                    size: 18,
                    color: isSelected ? .brandYellow : .carlibLabel.opacity(0.5)
                )
            }
            .padding(.vertical, 10)
            .padding(.horizontal, 12)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(isSelected ? Color.brandYellow.opacity(0.08) : Color.clear)
            )
            .contentShape(RoundedRectangle(cornerRadius: 12))
        }
        .buttonStyle(.pressable(scale: 0.98, haptic: .light))
    }

    // MARK: - Logic

    private var nextStage: RepairStatus? {
        let all = RepairStatus.allCases
        guard let current = currentStatus else { return .diagnostic }
        guard let idx = all.firstIndex(of: current), idx < all.count - 1 else { return nil }
        return all[idx + 1]
    }

    private func description(for status: RepairStatus) -> String {
        switch status {
        case .diagnostic: "Assessing the damage and preparing the estimate."
        case .waitingParts: "Parts ordered — work resumes on arrival."
        case .repairing: "Bodywork and paint in progress."
        case .qualityCheck: "Final inspection before handover."
        case .readyForPickup: "Vehicle washed and ready for the driver."
        }
    }
}

#Preview("In progress") {
    Color.carlibScreenBg
        .ignoresSafeArea()
        .sheet(isPresented: .constant(true)) {
            RepairStatusSheet(currentStatus: .diagnostic) { _ in }
        }
}

#Preview("Last stage") {
    Color.carlibScreenBg
        .ignoresSafeArea()
        .sheet(isPresented: .constant(true)) {
            RepairStatusSheet(currentStatus: .readyForPickup) { _ in }
        }
}
