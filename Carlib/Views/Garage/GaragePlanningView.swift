import SwiftUI

/// Garage planning — calendar with slot creation that actually saves.
struct GaragePlanningView: View {
    @Environment(ClaimStore.self) private var claimStore
    @State private var selectedDate = Date()
    @State private var showAddSheet = false
    @State private var newSlotStart = Date()
    @State private var newSlotEnd = Date()

    private var slotsForSelectedDate: [TimeSlot] {
        claimStore.slotsForDate(selectedDate)
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                DatePicker(
                    L10n.GaragePlanning.week,
                    selection: $selectedDate,
                    displayedComponents: .date
                )
                .datePickerStyle(.graphical)
                .tint(.brandYellow)
                .padding(.horizontal, CarlibSpacing.screenHorizontal)

                Divider()

                if slotsForSelectedDate.isEmpty {
                    ContentUnavailableView(
                        L10n.GaragePlanning.emptyTitle,
                        systemImage: "clock",
                        description: Text(verbatim: L10n.GaragePlanning.emptyDescription)
                    )
                } else {
                    ScrollView {
                        VStack(spacing: CarlibSpacing.sm) {
                            ForEach(slotsForSelectedDate) { slot in
                                CarlibCard(variant: .flat) {
                                    HStack {
                                        VStack(alignment: .leading, spacing: 2) {
                                            Text("\(slot.startTime.timeFormatted) — \(slot.endTime.timeFormatted)")
                                                .font(CarlibFont.bodyMedium(.semibold))

                                            if slot.isBlocked {
                                                Text(verbatim: L10n.GaragePlanning.slotBlocked)
                                                    .font(CarlibFont.caption())
                                                    .foregroundStyle(.statusCancelled)
                                            } else if slot.isAvailable {
                                                Text(verbatim: L10n.GaragePlanning.slotAvailable)
                                                    .font(CarlibFont.caption())
                                                    .foregroundStyle(.statusCompleted)
                                            } else {
                                                Text(verbatim: L10n.GaragePlanning.slotBooked)
                                                    .font(CarlibFont.caption())
                                                    .foregroundStyle(.statusInProgress)
                                            }
                                        }

                                        Spacer()

                                        Circle()
                                            .fill(slotColor(slot))
                                            .frame(width: 12, height: 12)
                                    }
                                }
                            }
                        }
                        .padding(.horizontal, CarlibSpacing.screenHorizontal)
                        .padding(.top, CarlibSpacing.sm)
                    }
                }
            }
            .navigationTitle(Text(verbatim: L10n.GaragePlanning.title))
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        newSlotStart = selectedDate
                        newSlotEnd = selectedDate
                        showAddSheet = true
                    } label: {
                        Label {
                            Text(verbatim: L10n.GaragePlanning.add)
                        } icon: {
                            Image(systemName: "plus")
                        }
                    }
                }
            }
            .sheet(isPresented: $showAddSheet) {
                addSlotSheet
            }
        }
    }

    private func slotColor(_ slot: TimeSlot) -> Color {
        if slot.isBlocked { return .statusCancelled }
        if slot.isAvailable { return .statusCompleted }
        return .statusInProgress
    }

    private var addSlotSheet: some View {
        NavigationStack {
            Form {
                DatePicker(L10n.GaragePlanning.addDate, selection: $selectedDate, displayedComponents: .date)
                DatePicker(L10n.GaragePlanning.addStart, selection: $newSlotStart, displayedComponents: .hourAndMinute)
                DatePicker(L10n.GaragePlanning.addEnd, selection: $newSlotEnd, displayedComponents: .hourAndMinute)
            }
            .navigationTitle(Text(verbatim: L10n.GaragePlanning.addTitle))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(L10n.Common.cancel) { showAddSheet = false }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button(L10n.Common.save) {
                        let slot = TimeSlot(
                            garageId: MockData.garages[0].id,
                            date: selectedDate,
                            startTime: newSlotStart,
                            endTime: newSlotEnd,
                            isAvailable: true,
                            isBlocked: false
                        )
                        claimStore.addTimeSlot(slot)
                        showAddSheet = false
                    }
                    .fontWeight(.semibold)
                }
            }
        }
        .presentationDetents([.medium])
    }
}

#Preview {
    GaragePlanningView()
        .environment(ClaimStore())
}
