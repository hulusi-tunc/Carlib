import SwiftUI

/// Booking sheet — select a date and time slot at a garage.
struct BookingFlowView: View {
    let garage: Garage
    @Environment(ClaimStore.self) private var claimStore
    @Environment(\.dismiss) private var dismiss

    @State private var selectedDate = Date()
    @State private var selectedSlotId: UUID?
    @State private var showSuccess = false

    private var slotsForDate: [TimeSlot] {
        claimStore.slotsForDate(selectedDate, garageId: garage.id)
            .filter { $0.isAvailable && !$0.isBlocked }
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Date picker
                VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
                    Text(verbatim: "SELECT DATE")
                        .sectionHeaderStyle()

                    DatePicker(
                        L10n.Booking.selectDate,
                        selection: $selectedDate,
                        in: Date()...,
                        displayedComponents: .date
                    )
                    .datePickerStyle(.graphical)
                    .tint(.carlibPrimaryBlue)
                }
                .padding(.horizontal, CarlibSpacing.screenHorizontal)

                Divider().overlay(Color.carlibCardBorder)

                // Time slots
                VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
                    Text(verbatim: "AVAILABLE SLOTS")
                        .sectionHeaderStyle()
                        .padding(.horizontal, CarlibSpacing.screenHorizontal)
                        .padding(.top, CarlibSpacing.md)

                    if slotsForDate.isEmpty {
                        Text(verbatim: L10n.Booking.noSlots)
                            .font(CarlibFont.body())
                            .foregroundStyle(.carlibSecondary)
                            .frame(maxWidth: .infinity, alignment: .center)
                            .padding(.vertical, CarlibSpacing.xxl)
                    } else {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: CarlibSpacing.sm) {
                                ForEach(slotsForDate) { slot in
                                    Button {
                                        selectedSlotId = slot.id
                                    } label: {
                                        VStack(spacing: 4) {
                                            Text(slot.startTime.timeFormatted)
                                                .font(CarlibFont.body(.medium))
                                            Text("— \(slot.endTime.timeFormatted)")
                                                .font(CarlibFont.caption())
                                                .foregroundStyle(.carlibSecondary)
                                        }
                                        .padding(.horizontal, CarlibSpacing.md)
                                        .padding(.vertical, CarlibSpacing.sm)
                                        .background(
                                            selectedSlotId == slot.id ? Color.carlibPrimaryBlue : Color.tileSecondary,
                                            in: RoundedRectangle(cornerRadius: CarlibRadius.md)
                                        )
                                        .foregroundStyle(selectedSlotId == slot.id ? .white : .carlibDark)
                                    }
                                    .buttonStyle(.plain)
                                }
                            }
                            .padding(.horizontal, CarlibSpacing.screenHorizontal)
                        }
                    }
                }

                Spacer()

                // Confirm button
                CarlibButton(
                    label: L10n.Booking.confirm,
                    icon: .calendarEventLine,
                    variant: .primary,
                    isDisabled: selectedSlotId == nil
                ) {
                    guard let slotId = selectedSlotId else { return }
                    let booking = Booking(garageId: garage.id, slotId: slotId)
                    claimStore.addBooking(booking)
                    showSuccess = true
                }
                .padding(.horizontal, CarlibSpacing.screenHorizontal)
                .padding(.bottom, CarlibSpacing.xxl)
            }
            .navigationTitle(Text(verbatim: L10n.Booking.titleAt(garage.name)))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(L10n.Common.cancel) { dismiss() }
                }
            }
            .alert(
                L10n.Booking.successTitle,
                isPresented: $showSuccess
            ) {
                Button("OK") { dismiss() }
            } message: {
                Text(verbatim: L10n.Booking.successMessage)
            }
        }
    }
}

#Preview {
    BookingFlowView(garage: MockData.garages[0])
        .environment(ClaimStore())
}
