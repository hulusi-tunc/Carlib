import SwiftUI

/// Garage schedule — weekly hours template + calendar with per-day slots.
struct GaragePlanningView: View {
    @Environment(ClaimStore.self) private var claimStore

    @State private var mode: Mode = .calendar
    @State private var selectedDate: Date = Calendar.current.startOfDay(for: .now)
    @State private var weekStart: Date = Date.currentWeekStart()
    @State private var hours: [DayHours] = DayHours.defaultWeek

    @State private var showAddSlot = false
    @State private var newSlotStart: Date = Calendar.current.date(bySettingHour: 9, minute: 0, second: 0, of: .now) ?? .now
    @State private var newSlotEnd: Date = Calendar.current.date(bySettingHour: 10, minute: 0, second: 0, of: .now) ?? .now

    @State private var editingHours: DayHours?
    @State private var selectedSlot: TimeSlot?

    @State private var showBlockTime = false
    @State private var blockAllDay = false
    @State private var blockStart: Date = Calendar.current.date(bySettingHour: 12, minute: 0, second: 0, of: .now) ?? .now
    @State private var blockEnd: Date = Calendar.current.date(bySettingHour: 13, minute: 0, second: 0, of: .now) ?? .now
    @State private var blockReason: BlockReason = .lunch

    // MARK: - Body

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: CarlibSpacing.lg) {
                    modeSwitcher
                        .padding(.horizontal, CarlibSpacing.screenHorizontal)
                        .padding(.top, CarlibSpacing.xs)

                    switch mode {
                    case .calendar: calendarContent
                    case .hours:    hoursContent
                    }
                }
                .padding(.bottom, CarlibSpacing.xxl)
            }
            .background(Color.carlibScreenBg)
            .navigationTitle(Text(verbatim: L10n.GaragePlanning.title))
            .toolbar {
                if mode == .calendar {
                    ToolbarItem(placement: .primaryAction) {
                        Button {
                            prepareNewSlot()
                            showAddSlot = true
                        } label: {
                            RemixIcon.addLine.view(size: 20, color: .brandYellow)
                        }
                        .buttonStyle(.pressable(scale: 0.92))
                    }
                }
            }
            .sheet(isPresented: $showAddSlot) { addSlotSheet }
            .sheet(isPresented: $showBlockTime) { blockTimeSheet }
            .sheet(item: $editingHours) { day in
                hoursEditorSheet(for: day)
            }
            .sheet(item: $selectedSlot) { slot in
                slotDetailSheet(for: slot)
            }
        }
    }

    // MARK: - Mode switcher

    private var modeSwitcher: some View {
        HStack(spacing: 4) {
            ForEach(Mode.allCases, id: \.self) { m in
                Button {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.85)) {
                        mode = m
                    }
                } label: {
                    Text(verbatim: m.label)
                        .font(CarlibFont.callout(.medium))
                        .foregroundStyle(mode == m ? .carlibDark : .carlibSecondary)
                        .frame(maxWidth: .infinity)
                        .frame(height: 40)
                        .background {
                            if mode == m {
                                Capsule().fill(Color.carlibScreenBg)
                                    .shadow(color: Color.black.opacity(0.06), radius: 6, x: 0, y: 2)
                            }
                        }
                }
                .buttonStyle(.pressable(scale: 0.97, haptic: .light))
            }
        }
        .padding(4)
        .background(Color.tileSecondary, in: Capsule())
    }

    // MARK: - Calendar content

    private var calendarContent: some View {
        VStack(spacing: CarlibSpacing.lg) {
            capacityHero
                .padding(.horizontal, CarlibSpacing.screenHorizontal)

            weekStrip

            slotsSection
                .padding(.horizontal, CarlibSpacing.screenHorizontal)
        }
    }

    private var capacityHero: some View {
        let day = hours(for: selectedDate)
        let total = day?.isOpen == true ? day?.bays ?? 0 : 0
        let booked = bookedSlotsCount(for: selectedDate)
        let progress = total > 0 ? min(Double(booked) / Double(total), 1.0) : 0
        let isClosed = day?.isOpen != true

        return CarlibCard(variant: .flat) {
            VStack(alignment: .leading, spacing: CarlibSpacing.md) {
                HStack(alignment: .firstTextBaseline) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(verbatim: selectedDate.isToday ? L10n.GaragePlanning.today : selectedDate.shortFormatted)
                            .font(CarlibFont.caption(.medium))
                            .textCase(.uppercase)
                            .tracking(0.8)
                            .foregroundStyle(.carlibLabel)
                        Text(verbatim: selectedDate.longFormatted)
                            .font(CarlibFont.title3(.medium))
                            .foregroundStyle(.carlibDark)
                    }
                    Spacer()
                    RemixIcon.calendarScheduleLine.view(size: 22, color: .carlibSecondary)
                }

                if isClosed {
                    VStack(alignment: .leading, spacing: CarlibSpacing.xs) {
                        Text(verbatim: L10n.GaragePlanning.dayClosed)
                            .font(CarlibFont.title2(.medium))
                            .foregroundStyle(.carlibDark)
                        Text(verbatim: L10n.GaragePlanning.dayClosedDescription)
                            .font(CarlibFont.footnote())
                            .foregroundStyle(.carlibSecondary)
                    }
                } else {
                    HStack(alignment: .firstTextBaseline, spacing: CarlibSpacing.xs) {
                        Text(verbatim: "\(booked)")
                            .font(CarlibFont.amount(.bold))
                            .foregroundStyle(booked > total ? Color.statusCancelled : .carlibDark)
                        Text(verbatim: "/ \(total)")
                            .font(CarlibFont.title2())
                            .foregroundStyle(.carlibSecondary)
                        Spacer()
                        Text(verbatim: booked == 1 ? L10n.GaragePlanning.bayBooked : L10n.GaragePlanning.baysBooked)
                            .font(CarlibFont.footnote())
                            .foregroundStyle(.carlibSecondary)
                    }

                    // Progress bar
                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                            Capsule().fill(Color.carlibCardBorder)
                            Capsule()
                                .fill(progress >= 1 ? Color.statusCancelled : .brandYellow)
                                .frame(width: geo.size.width * progress)
                                .animation(.spring(response: 0.4, dampingFraction: 0.85), value: progress)
                        }
                    }
                    .frame(height: 8)

                    if booked > total {
                        HStack(spacing: CarlibSpacing.xs) {
                            RemixIcon.alertLine.view(size: 14, color: .statusCancelled)
                            Text(verbatim: L10n.GaragePlanning.overbookedWarning)
                                .font(CarlibFont.footnote(.medium))
                                .foregroundStyle(.statusCancelled)
                        }
                        .padding(.horizontal, CarlibSpacing.sm)
                        .padding(.vertical, CarlibSpacing.xs)
                        .background(Color.statusCancelledBg, in: RoundedRectangle(cornerRadius: CarlibRadius.sm))
                    }
                }
            }
        }
    }

    private var weekStrip: some View {
        VStack(spacing: CarlibSpacing.sm) {
            HStack {
                Text(verbatim: weekLabel)
                    .font(CarlibFont.footnote(.medium))
                    .foregroundStyle(.carlibSecondary)
                Spacer()
                Button {
                    shiftWeek(by: -1)
                } label: {
                    RemixIcon.arrowLeftSLine.view(size: 20, color: .carlibDark)
                        .frame(width: 36, height: 36)
                        .background(Color.tileSecondary, in: Circle())
                }
                .buttonStyle(.pressable(scale: 0.9))

                Button {
                    shiftWeek(by: 1)
                } label: {
                    RemixIcon.arrowRightSLine.view(size: 20, color: .carlibDark)
                        .frame(width: 36, height: 36)
                        .background(Color.tileSecondary, in: Circle())
                }
                .buttonStyle(.pressable(scale: 0.9))
            }
            .padding(.horizontal, CarlibSpacing.screenHorizontal)

            HStack(spacing: CarlibSpacing.xs) {
                ForEach(weekDates, id: \.self) { date in
                    WeekDayCell(
                        date: date,
                        isSelected: Calendar.current.isDate(date, inSameDayAs: selectedDate),
                        density: density(for: date)
                    ) {
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.85)) {
                            selectedDate = Calendar.current.startOfDay(for: date)
                        }
                    }
                }
            }
            .padding(.horizontal, CarlibSpacing.screenHorizontal)
        }
    }

    private var slotsSection: some View {
        let slots = claimStore.slotsForDate(selectedDate)
            .sorted { $0.startTime < $1.startTime }
        let day = hours(for: selectedDate)
        let isClosed = day?.isOpen != true

        return VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
            HStack {
                Text(verbatim: "Slots")
                    .sectionHeaderStyle()
                Spacer()
                if !slots.isEmpty {
                    Text(verbatim: "\(slots.count)")
                        .font(CarlibFont.caption(.medium))
                        .foregroundStyle(.carlibSecondary)
                }
            }

            if slots.isEmpty {
                CarlibCard(variant: .flat) {
                    VStack(spacing: CarlibSpacing.sm) {
                        RemixIcon.timeLine.view(size: 32, color: .carlibSecondary)
                        Text(verbatim: L10n.GaragePlanning.emptyTitle)
                            .font(CarlibFont.body(.medium))
                            .foregroundStyle(.carlibDark)
                        Text(verbatim: L10n.GaragePlanning.emptyDescription)
                            .font(CarlibFont.footnote())
                            .foregroundStyle(.carlibSecondary)
                            .multilineTextAlignment(.center)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, CarlibSpacing.md)
                }
            } else {
                VStack(spacing: CarlibSpacing.xs) {
                    ForEach(slots) { slot in
                        SlotRow(slot: slot, claim: claim(for: slot)) {
                            selectedSlot = slot
                        }
                    }
                }
            }

            if !isClosed {
                VStack(spacing: CarlibSpacing.xs) {
                    CarlibButton(
                        label: L10n.GaragePlanning.addAppointment,
                        icon: .addLine,
                        variant: .secondary
                    ) {
                        prepareNewSlot()
                        showAddSlot = true
                    }
                    CarlibButton(
                        label: L10n.GaragePlanning.blockTime,
                        icon: .forbidLine,
                        variant: .secondary
                    ) {
                        prepareBlockTime()
                        showBlockTime = true
                    }
                }
                .padding(.top, CarlibSpacing.sm)
            }
        }
    }

    // MARK: - Hours content

    private var hoursContent: some View {
        VStack(alignment: .leading, spacing: CarlibSpacing.md) {
            VStack(alignment: .leading, spacing: CarlibSpacing.xs) {
                Text(verbatim: L10n.GaragePlanning.hoursTitle)
                    .font(CarlibFont.title2(.medium))
                    .foregroundStyle(.carlibDark)
                Text(verbatim: L10n.GaragePlanning.hoursDescription)
                    .font(CarlibFont.footnote())
                    .foregroundStyle(.carlibSecondary)
            }
            .padding(.horizontal, CarlibSpacing.screenHorizontal)

            VStack(spacing: CarlibSpacing.xs) {
                ForEach(hours.sorted(by: DayHours.weekOrder)) { day in
                    DayHoursRow(
                        day: day,
                        onToggle: { toggle(day: day) },
                        onTap: { editingHours = day }
                    )
                }
            }
            .padding(.horizontal, CarlibSpacing.screenHorizontal)
        }
    }

    // MARK: - Sheets

    private var addSlotSheet: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: CarlibSpacing.md) {
                    CarlibCard(variant: .flat) {
                        VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
                            Text(verbatim: L10n.GaragePlanning.addDate)
                                .font(CarlibFont.caption(.medium))
                                .foregroundStyle(.carlibLabel)
                            Text(verbatim: selectedDate.longFormatted)
                                .font(CarlibFont.body(.medium))
                                .foregroundStyle(.carlibDark)
                        }
                    }

                    CarlibCard(variant: .flat) {
                        VStack(spacing: 0) {
                            timeRow(
                                label: L10n.GaragePlanning.addStart,
                                selection: $newSlotStart
                            )
                            Divider().padding(.vertical, CarlibSpacing.sm)
                            timeRow(
                                label: L10n.GaragePlanning.addEnd,
                                selection: $newSlotEnd
                            )
                        }
                    }

                    CarlibButton(label: L10n.Common.save, variant: .primary) {
                        saveSlot()
                    }
                    .padding(.top, CarlibSpacing.xs)
                }
                .padding(CarlibSpacing.screenHorizontal)
            }
            .background(Color.carlibScreenBg)
            .navigationTitle(Text(verbatim: L10n.GaragePlanning.addTitle))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(L10n.Common.cancel) { showAddSlot = false }
                }
            }
        }
        .presentationDetents([.medium])
        .presentationDragIndicator(.visible)
    }

    private func hoursEditorSheet(for day: DayHours) -> some View {
        HoursEditor(
            day: day,
            onSave: { updated in
                if let idx = hours.firstIndex(where: { $0.id == updated.id }) {
                    hours[idx] = updated
                }
                editingHours = nil
            },
            onCancel: { editingHours = nil }
        )
    }

    private func timeRow(label: String, selection: Binding<Date>) -> some View {
        HStack {
            Text(verbatim: label)
                .font(CarlibFont.body())
                .foregroundStyle(.carlibDark)
            Spacer()
            DatePicker(
                "",
                selection: selection,
                displayedComponents: .hourAndMinute
            )
            .labelsHidden()
            .tint(.brandYellow)
        }
    }

    // MARK: - Helpers

    private var weekDates: [Date] {
        (0..<7).compactMap {
            Calendar.current.date(byAdding: .day, value: $0, to: weekStart)
        }
    }

    private var weekLabel: String {
        guard let end = Calendar.current.date(byAdding: .day, value: 6, to: weekStart) else {
            return ""
        }
        return "\(weekStart.shortFormatted) — \(end.shortFormatted)"
    }

    private func shiftWeek(by delta: Int) {
        guard let shifted = Calendar.current.date(byAdding: .weekOfYear, value: delta, to: weekStart) else { return }
        withAnimation(.spring(response: 0.35, dampingFraction: 0.85)) {
            weekStart = shifted
        }
    }

    private func hours(for date: Date) -> DayHours? {
        let weekday = Calendar.current.component(.weekday, from: date)
        return hours.first(where: { $0.weekday == weekday })
    }

    private func bookedSlotsCount(for date: Date) -> Int {
        claimStore.slotsForDate(date).filter { !$0.isBlocked }.count
    }

    private func claim(for slot: TimeSlot) -> Claim? {
        guard let claimId = slot.claimId else { return nil }
        return claimStore.claims.first { $0.id == claimId }
    }

    private func density(for date: Date) -> Density {
        guard let day = hours(for: date), day.isOpen else { return .closed }
        let total = day.bays
        let booked = claimStore.slotsForDate(date).count
        guard total > 0 else { return .open }
        let ratio = Double(booked) / Double(total)
        if ratio >= 1 { return .full }
        if ratio >= 0.5 { return .busy }
        if ratio > 0 { return .light }
        return .open
    }

    private func toggle(day: DayHours) {
        guard let idx = hours.firstIndex(where: { $0.id == day.id }) else { return }
        hours[idx].isOpen.toggle()
    }

    private func prepareNewSlot() {
        let cal = Calendar.current
        let start = cal.date(bySettingHour: 9, minute: 0, second: 0, of: selectedDate) ?? selectedDate
        let end = cal.date(bySettingHour: 10, minute: 0, second: 0, of: selectedDate) ?? selectedDate
        newSlotStart = start
        newSlotEnd = end
    }

    private func saveSlot() {
        let slot = TimeSlot(
            garageId: MockData.garages[0].id,
            date: selectedDate,
            startTime: newSlotStart,
            endTime: newSlotEnd,
            isAvailable: false,
            isBlocked: false
        )
        claimStore.addTimeSlot(slot)
        showAddSlot = false
    }

    private func prepareBlockTime() {
        let cal = Calendar.current
        blockAllDay = false
        blockReason = .lunch
        blockStart = cal.date(bySettingHour: 12, minute: 0, second: 0, of: selectedDate) ?? selectedDate
        blockEnd = cal.date(bySettingHour: 13, minute: 0, second: 0, of: selectedDate) ?? selectedDate
    }

    private func saveBlock() {
        let cal = Calendar.current
        let day = hours(for: selectedDate)
        let start: Date
        let end: Date
        if blockAllDay {
            let openHour = day?.openHour ?? 0
            let closeHour = day?.closeHour ?? 23
            start = cal.date(bySettingHour: openHour, minute: 0, second: 0, of: selectedDate) ?? selectedDate
            end = cal.date(bySettingHour: closeHour, minute: 0, second: 0, of: selectedDate) ?? selectedDate
        } else {
            start = blockStart
            end = blockEnd
        }
        let slot = TimeSlot(
            garageId: MockData.garages[0].id,
            date: selectedDate,
            startTime: start,
            endTime: end,
            isAvailable: false,
            isBlocked: true
        )
        claimStore.addTimeSlot(slot)
        showBlockTime = false
    }

    // MARK: - Slot detail sheet

    private func slotDetailSheet(for slot: TimeSlot) -> some View {
        SlotDetailSheet(
            slot: slot,
            claim: claim(for: slot),
            onMarkArrived: {
                // Non-destructive toggle for demo — marks as arrived visually.
                claimStore.setSlotBlocked(id: slot.id, blocked: false)
                selectedSlot = nil
            },
            onReschedule: {
                selectedSlot = nil
                newSlotStart = slot.startTime
                newSlotEnd = slot.endTime
                claimStore.removeTimeSlot(id: slot.id)
                showAddSlot = true
            },
            onCancel: {
                claimStore.removeTimeSlot(id: slot.id)
                selectedSlot = nil
            },
            onRemoveBlock: {
                claimStore.removeTimeSlot(id: slot.id)
                selectedSlot = nil
            },
            onDismiss: { selectedSlot = nil }
        )
    }

    // MARK: - Block time sheet

    private var blockTimeSheet: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: CarlibSpacing.md) {
                    CarlibCard(variant: .flat) {
                        VStack(alignment: .leading, spacing: CarlibSpacing.xs) {
                            Text(verbatim: L10n.GaragePlanning.addDate)
                                .font(CarlibFont.caption(.medium))
                                .foregroundStyle(.carlibLabel)
                            Text(verbatim: selectedDate.longFormatted)
                                .font(CarlibFont.body(.medium))
                                .foregroundStyle(.carlibDark)
                        }
                    }

                    CarlibCard(variant: .flat) {
                        VStack(spacing: 0) {
                            HStack {
                                Text(verbatim: L10n.GaragePlanning.blockAllDay)
                                    .font(CarlibFont.body())
                                    .foregroundStyle(.carlibDark)
                                Spacer()
                                Toggle("", isOn: $blockAllDay)
                                    .labelsHidden()
                                    .tint(.brandYellow)
                            }
                            if !blockAllDay {
                                Divider().padding(.vertical, CarlibSpacing.sm)
                                HStack {
                                    Text(verbatim: L10n.GaragePlanning.addStart)
                                        .font(CarlibFont.body())
                                        .foregroundStyle(.carlibDark)
                                    Spacer()
                                    DatePicker("", selection: $blockStart, displayedComponents: .hourAndMinute)
                                        .labelsHidden()
                                        .tint(.brandYellow)
                                }
                                Divider().padding(.vertical, CarlibSpacing.sm)
                                HStack {
                                    Text(verbatim: L10n.GaragePlanning.addEnd)
                                        .font(CarlibFont.body())
                                        .foregroundStyle(.carlibDark)
                                    Spacer()
                                    DatePicker("", selection: $blockEnd, displayedComponents: .hourAndMinute)
                                        .labelsHidden()
                                        .tint(.brandYellow)
                                }
                            }
                        }
                    }

                    CarlibCard(variant: .flat) {
                        VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
                            Text(verbatim: L10n.GaragePlanning.blockReason)
                                .font(CarlibFont.caption(.medium))
                                .foregroundStyle(.carlibLabel)

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: CarlibSpacing.xs) {
                                    ForEach(BlockReason.allCases, id: \.self) { reason in
                                        Button {
                                            blockReason = reason
                                        } label: {
                                            Text(verbatim: reason.label)
                                                .font(CarlibFont.footnote(.medium))
                                                .foregroundStyle(blockReason == reason ? .carlibScreenBg : .carlibDark)
                                                .padding(.horizontal, CarlibSpacing.sm)
                                                .padding(.vertical, CarlibSpacing.xs)
                                                .background(
                                                    Capsule().fill(blockReason == reason ? Color.carlibDark : Color.carlibCardBorder)
                                                )
                                        }
                                        .buttonStyle(.pressable(scale: 0.95, haptic: .light))
                                    }
                                }
                            }
                        }
                    }

                    CarlibButton(label: L10n.Common.save, variant: .primary) {
                        saveBlock()
                    }
                    .padding(.top, CarlibSpacing.xs)
                }
                .padding(CarlibSpacing.screenHorizontal)
            }
            .background(Color.carlibScreenBg)
            .navigationTitle(Text(verbatim: L10n.GaragePlanning.blockTimeTitle))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(L10n.Common.cancel) { showBlockTime = false }
                }
            }
        }
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
    }
}

// MARK: - BlockReason

enum BlockReason: CaseIterable, Hashable {
    case lunch, vacation, training, maintenance, other

    var label: String {
        switch self {
        case .lunch:       L10n.GaragePlanning.blockReasonLunch
        case .vacation:    L10n.GaragePlanning.blockReasonVacation
        case .training:    L10n.GaragePlanning.blockReasonTraining
        case .maintenance: L10n.GaragePlanning.blockReasonMaintenance
        case .other:       L10n.GaragePlanning.blockReasonOther
        }
    }
}

// MARK: - Mode

extension GaragePlanningView {
    enum Mode: CaseIterable {
        case calendar, hours

        var label: String {
            switch self {
            case .calendar: return L10n.GaragePlanning.modeCalendar
            case .hours:    return L10n.GaragePlanning.modeHours
            }
        }
    }

    enum Density {
        case closed, open, light, busy, full

        var color: Color {
            switch self {
            case .closed: return .carlibCardBorder
            case .open:   return .carlibSecondary.opacity(0.4)
            case .light:  return .statusCompleted
            case .busy:   return .statusMatched
            case .full:   return .statusCancelled
            }
        }
    }
}

// MARK: - DayHours

struct DayHours: Identifiable, Hashable {
    let weekday: Int  // 1=Sunday ... 7=Saturday (Calendar convention)
    var isOpen: Bool
    var openHour: Int
    var openMinute: Int
    var closeHour: Int
    var closeMinute: Int
    var bays: Int

    var id: Int { weekday }

    var fullName: String {
        Self.formatter.standaloneWeekdaySymbols[weekday - 1]
    }

    var shortName: String {
        Self.formatter.veryShortStandaloneWeekdaySymbols[weekday - 1]
    }

    private static let formatter: DateFormatter = {
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_US")
        return f
    }()

    var hoursLabel: String {
        String(format: "%02d:%02d – %02d:%02d", openHour, openMinute, closeHour, closeMinute)
    }

    /// Monday-first ordering for display.
    static func weekOrder(_ a: DayHours, _ b: DayHours) -> Bool {
        // Map: Mon(2)→0, Tue(3)→1, ..., Sat(7)→5, Sun(1)→6
        func rank(_ wd: Int) -> Int { (wd + 5) % 7 }
        return rank(a.weekday) < rank(b.weekday)
    }

    static let defaultWeek: [DayHours] = [
        DayHours(weekday: 2, isOpen: true,  openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0, bays: 5),  // Mon
        DayHours(weekday: 3, isOpen: true,  openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0, bays: 5),  // Tue
        DayHours(weekday: 4, isOpen: true,  openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0, bays: 5),  // Wed
        DayHours(weekday: 5, isOpen: true,  openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0, bays: 5),  // Thu
        DayHours(weekday: 6, isOpen: true,  openHour: 8, openMinute: 0, closeHour: 18, closeMinute: 0, bays: 4),  // Fri
        DayHours(weekday: 7, isOpen: true,  openHour: 9, openMinute: 0, closeHour: 13, closeMinute: 0, bays: 2),  // Sat
        DayHours(weekday: 1, isOpen: false, openHour: 0, openMinute: 0, closeHour: 0,  closeMinute: 0, bays: 0),  // Sun
    ]
}

// MARK: - WeekDayCell

private struct WeekDayCell: View {
    let date: Date
    let isSelected: Bool
    let density: GaragePlanningView.Density
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: CarlibSpacing.xs) {
                Text(verbatim: weekdayLetter)
                    .font(CarlibFont.caption(.medium))
                    .foregroundStyle(isSelected ? .carlibDark : .carlibSecondary)
                Text(verbatim: dayNumber)
                    .font(CarlibFont.title3(.medium))
                    .foregroundStyle(isSelected ? .carlibDark : .carlibDark)
                Circle()
                    .fill(density.color)
                    .frame(width: 6, height: 6)
            }
            .frame(maxWidth: .infinity)
            .frame(height: 72)
            .background {
                RoundedRectangle(cornerRadius: CarlibRadius.md)
                    .fill(isSelected ? Color.brandYellow : Color.tileSecondary)
            }
        }
        .buttonStyle(.pressable(scale: 0.94, haptic: .light))
    }

    private var weekdayLetter: String {
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_US")
        f.dateFormat = "EEEEE"  // single letter
        return f.string(from: date)
    }

    private var dayNumber: String {
        let f = DateFormatter()
        f.dateFormat = "d"
        return f.string(from: date)
    }
}

// MARK: - SlotRow

private struct SlotRow: View {
    let slot: TimeSlot
    let claim: Claim?
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            CarlibCard(variant: .flat) {
                HStack(spacing: CarlibSpacing.sm) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(verbatim: slot.startTime.timeFormatted)
                            .font(CarlibFont.body(.medium))
                            .foregroundStyle(.carlibDark)
                        Text(verbatim: slot.endTime.timeFormatted)
                            .font(CarlibFont.caption())
                            .foregroundStyle(.carlibSecondary)
                    }
                    .frame(width: 64, alignment: .leading)
                    .fixedSize(horizontal: true, vertical: false)

                    Rectangle()
                        .fill(slot.kind.color.opacity(0.6))
                        .frame(width: 3)
                        .frame(maxHeight: .infinity)
                        .cornerRadius(1.5)

                    HStack(spacing: CarlibSpacing.xs) {
                        slot.kind.icon.view(size: 14, color: slot.kind.color)
                        VStack(alignment: .leading, spacing: CarlibSpacing.xxs) {
                            Text(verbatim: primaryLabel)
                                .font(CarlibFont.body(.medium))
                                .foregroundStyle(.carlibDark)
                                .lineLimit(1)
                            Text(verbatim: secondaryLabel)
                                .font(CarlibFont.footnote())
                                .foregroundStyle(.carlibSecondary)
                                .lineLimit(1)
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)

                    RemixIcon.arrowRightSLine.view(size: 16, color: .carlibSecondary)
                }
            }
        }
        .buttonStyle(.pressable(scale: 0.98, haptic: .light))
    }

    private var primaryLabel: String {
        switch slot.kind {
        case .blocked:
            return slot.kind.label
        case .appointment:
            if let name = claim?.driverName, !name.isEmpty { return name }
            return L10n.GaragePlanning.walkInTitle
        }
    }

    private var secondaryLabel: String {
        switch slot.kind {
        case .blocked:
            return slot.kind.subtitle
        case .appointment:
            if let v = claim?.vehicleInfo {
                return "\(v.brand) \(v.model) · \(v.licensePlate)"
            }
            return L10n.GaragePlanning.walkInSubtitle
        }
    }
}

// MARK: - Slot kinds

extension TimeSlot {
    enum Kind {
        case appointment, blocked

        var label: String {
            switch self {
            case .appointment: L10n.GaragePlanning.appointment
            case .blocked:     L10n.GaragePlanning.blocked
            }
        }

        var subtitle: String {
            switch self {
            case .appointment: L10n.GaragePlanning.appointmentSubtitle
            case .blocked:     L10n.GaragePlanning.blockedSubtitle
            }
        }

        var color: Color {
            switch self {
            case .appointment: .statusInProgress
            case .blocked:     .statusCancelled
            }
        }

        var bgColor: Color {
            switch self {
            case .appointment: .statusInProgressBg
            case .blocked:     .statusCancelledBg
            }
        }

        var icon: RemixIcon {
            switch self {
            case .appointment: .carFill
            case .blocked:     .forbidLine
            }
        }
    }

    var kind: Kind {
        isBlocked ? .blocked : .appointment
    }
}

// MARK: - DayHoursRow

private struct DayHoursRow: View {
    let day: DayHours
    let onToggle: () -> Void
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            CarlibCard(variant: .flat) {
                HStack(spacing: CarlibSpacing.md) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(verbatim: day.fullName)
                            .font(CarlibFont.body(.medium))
                            .foregroundStyle(.carlibDark)
                        if day.isOpen {
                            HStack(spacing: CarlibSpacing.xs) {
                                Text(verbatim: day.hoursLabel)
                                    .font(CarlibFont.footnote())
                                    .foregroundStyle(.carlibSecondary)
                                Circle().fill(Color.carlibSecondary).frame(width: 3, height: 3)
                                Text(verbatim: "\(day.bays) \(day.bays == 1 ? L10n.GaragePlanning.bay : L10n.GaragePlanning.bays)")
                                    .font(CarlibFont.footnote())
                                    .foregroundStyle(.carlibSecondary)
                            }
                        } else {
                            Text(verbatim: L10n.GaragePlanning.closed)
                                .font(CarlibFont.footnote())
                                .foregroundStyle(.carlibSecondary)
                        }
                    }

                    Spacer()

                    Toggle("", isOn: Binding(
                        get: { day.isOpen },
                        set: { _ in onToggle() }
                    ))
                    .labelsHidden()
                    .tint(.brandYellow)

                    RemixIcon.arrowRightSLine.view(size: 18, color: .carlibSecondary)
                        .opacity(day.isOpen ? 1 : 0)
                }
            }
        }
        .buttonStyle(.pressable(scale: 0.98, haptic: .light))
        .disabled(!day.isOpen)
    }
}

// MARK: - HoursEditor

private struct HoursEditor: View {
    @State var day: DayHours
    let onSave: (DayHours) -> Void
    let onCancel: () -> Void

    @State private var openTime: Date = .now
    @State private var closeTime: Date = .now

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: CarlibSpacing.md) {
                    CarlibCard(variant: .flat) {
                        VStack(spacing: 0) {
                            timeRow(label: L10n.GaragePlanning.openTime, selection: $openTime)
                            Divider().padding(.vertical, CarlibSpacing.sm)
                            timeRow(label: L10n.GaragePlanning.closeTime, selection: $closeTime)
                        }
                    }

                    CarlibCard(variant: .flat) {
                        VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(verbatim: L10n.GaragePlanning.capacity)
                                        .font(CarlibFont.body(.medium))
                                        .foregroundStyle(.carlibDark)
                                    Text(verbatim: L10n.GaragePlanning.capacityHint)
                                        .font(CarlibFont.footnote())
                                        .foregroundStyle(.carlibSecondary)
                                }
                                Spacer()
                            }

                            HStack(spacing: CarlibSpacing.md) {
                                stepperButton(icon: .subtractLine, enabled: day.bays > 1) {
                                    day.bays = max(1, day.bays - 1)
                                }

                                Text(verbatim: "\(day.bays)")
                                    .font(CarlibFont.title2(.medium))
                                    .foregroundStyle(.carlibDark)
                                    .frame(minWidth: 48)

                                stepperButton(icon: .addLine, enabled: day.bays < 20) {
                                    day.bays = min(20, day.bays + 1)
                                }

                                Spacer()

                                Text(verbatim: day.bays == 1 ? L10n.GaragePlanning.bay : L10n.GaragePlanning.bays)
                                    .font(CarlibFont.footnote())
                                    .foregroundStyle(.carlibSecondary)
                            }
                        }
                    }

                    CarlibButton(label: L10n.Common.save, variant: .primary) {
                        commit()
                    }
                    .padding(.top, CarlibSpacing.xs)
                }
                .padding(CarlibSpacing.screenHorizontal)
            }
            .background(Color.carlibScreenBg)
            .navigationTitle(Text(verbatim: day.fullName))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(L10n.Common.cancel) { onCancel() }
                }
            }
            .onAppear {
                let cal = Calendar.current
                openTime = cal.date(bySettingHour: day.openHour, minute: day.openMinute, second: 0, of: .now) ?? .now
                closeTime = cal.date(bySettingHour: day.closeHour, minute: day.closeMinute, second: 0, of: .now) ?? .now
            }
        }
        .presentationDetents([.medium])
        .presentationDragIndicator(.visible)
    }

    private func timeRow(label: String, selection: Binding<Date>) -> some View {
        HStack {
            Text(verbatim: label)
                .font(CarlibFont.body())
                .foregroundStyle(.carlibDark)
            Spacer()
            DatePicker("", selection: selection, displayedComponents: .hourAndMinute)
                .labelsHidden()
                .tint(.brandYellow)
        }
    }

    private func stepperButton(icon: RemixIcon, enabled: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            icon.view(size: 18, color: enabled ? .carlibDark : .carlibSecondary)
                .frame(width: 40, height: 40)
                .background(Color.tileSecondary, in: Circle())
        }
        .buttonStyle(.pressable(scale: 0.9, haptic: .light))
        .disabled(!enabled)
        .opacity(enabled ? 1.0 : 0.5)
    }

    private func commit() {
        let cal = Calendar.current
        let openComps = cal.dateComponents([.hour, .minute], from: openTime)
        let closeComps = cal.dateComponents([.hour, .minute], from: closeTime)
        var updated = day
        updated.openHour = openComps.hour ?? 8
        updated.openMinute = openComps.minute ?? 0
        updated.closeHour = closeComps.hour ?? 18
        updated.closeMinute = closeComps.minute ?? 0
        onSave(updated)
    }
}

// MARK: - SlotDetailSheet

private struct SlotDetailSheet: View {
    let slot: TimeSlot
    let claim: Claim?
    let onMarkArrived: () -> Void
    let onReschedule: () -> Void
    let onCancel: () -> Void
    let onRemoveBlock: () -> Void
    let onDismiss: () -> Void

    @Environment(\.openURL) private var openURL

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: CarlibSpacing.md) {
                    hero
                    if slot.kind == .appointment, let claim {
                        quickContact(claim: claim)
                        claimDetails(claim: claim)
                    } else if slot.kind == .appointment {
                        walkInNotice
                    }
                    actions
                }
                .padding(CarlibSpacing.screenHorizontal)
                .padding(.bottom, CarlibSpacing.lg)
            }
            .background(Color.carlibScreenBg)
            .navigationTitle(Text(verbatim: L10n.GaragePlanning.slotDetailsTitle))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(L10n.Common.done) { onDismiss() }
                }
            }
        }
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
    }

    // MARK: - Hero

    private var hero: some View {
        CarlibCard(variant: .flat) {
            VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
                CarlibStatusBadge(
                    text: slot.kind.label,
                    color: slot.kind.color,
                    backgroundColor: slot.kind.bgColor,
                    icon: slot.kind.icon
                )

                Text(verbatim: "\(slot.startTime.timeFormatted) – \(slot.endTime.timeFormatted)")
                    .font(CarlibFont.title1(.medium))
                    .foregroundStyle(.carlibDark)

                Text(verbatim: slot.date.longFormatted)
                    .font(CarlibFont.footnote())
                    .foregroundStyle(.carlibSecondary)

                if slot.kind == .blocked {
                    Text(verbatim: slot.kind.subtitle)
                        .font(CarlibFont.body())
                        .foregroundStyle(.carlibSecondary)
                        .padding(.top, CarlibSpacing.xs)
                }
            }
        }
    }

    // MARK: - Quick contact

    private func quickContact(claim: Claim) -> some View {
        CarlibCard(variant: .flat) {
            VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
                HStack(spacing: CarlibSpacing.sm) {
                    avatarCircle(initials: initials(from: claim.driverName))

                    VStack(alignment: .leading, spacing: 2) {
                        Text(verbatim: claim.driverName ?? L10n.GaragePlanning.walkInTitle)
                            .font(CarlibFont.body(.medium))
                            .foregroundStyle(.carlibDark)
                        if let phone = claim.driverPhone {
                            Text(verbatim: phone)
                                .font(CarlibFont.footnote())
                                .foregroundStyle(.carlibSecondary)
                        }
                    }
                    Spacer()
                }

                if let phone = claim.driverPhone {
                    HStack(spacing: CarlibSpacing.xs) {
                        iconActionButton(icon: .phoneLine, label: L10n.GaragePlanning.actionCall) {
                            dial(phone)
                        }
                        iconActionButton(icon: .messageLine, label: L10n.GaragePlanning.actionMessage) {
                            text(phone)
                        }
                    }
                }
            }
        }
    }

    private func iconActionButton(icon: RemixIcon, label: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: CarlibSpacing.xs) {
                icon.view(size: 16, color: .carlibDark)
                Text(verbatim: label)
                    .font(CarlibFont.callout(.medium))
                    .foregroundStyle(.carlibDark)
            }
            .frame(maxWidth: .infinity)
            .frame(height: 44)
            .background(Color.tileSecondary, in: Capsule())
        }
        .buttonStyle(.pressable(scale: 0.97, haptic: .light))
    }

    // MARK: - Claim details

    private func claimDetails(claim: Claim) -> some View {
        CarlibCard(variant: .flat) {
            VStack(alignment: .leading, spacing: CarlibSpacing.md) {
                detailRow(label: L10n.GaragePlanning.vehicle, value: vehicleLabel(claim))
                if let type = claim.accidentType {
                    Divider()
                    detailRow(label: L10n.GaragePlanning.accidentType, value: type.localizedName)
                }
                if !claim.description.isEmpty {
                    Divider()
                    VStack(alignment: .leading, spacing: CarlibSpacing.xxs) {
                        Text(verbatim: L10n.GaragePlanning.claimDescription)
                            .font(CarlibFont.caption(.medium))
                            .foregroundStyle(.carlibLabel)
                        Text(verbatim: claim.description)
                            .font(CarlibFont.body())
                            .foregroundStyle(.carlibDark)
                    }
                }
                Divider()
                HStack {
                    Text(verbatim: L10n.GaragePlanning.claimStatus)
                        .font(CarlibFont.caption(.medium))
                        .foregroundStyle(.carlibLabel)
                    Spacer()
                    CarlibStatusBadge(claimStatus: claim.status)
                }
            }
        }
    }

    private func detailRow(label: String, value: String) -> some View {
        HStack(alignment: .firstTextBaseline) {
            Text(verbatim: label)
                .font(CarlibFont.caption(.medium))
                .foregroundStyle(.carlibLabel)
            Spacer()
            Text(verbatim: value)
                .font(CarlibFont.body(.medium))
                .foregroundStyle(.carlibDark)
                .multilineTextAlignment(.trailing)
        }
    }

    private var walkInNotice: some View {
        CarlibCard(variant: .flat) {
            HStack(spacing: CarlibSpacing.sm) {
                RemixIcon.informationLine.view(size: 18, color: .carlibSecondary)
                Text(verbatim: L10n.GaragePlanning.walkInSubtitle)
                    .font(CarlibFont.footnote())
                    .foregroundStyle(.carlibSecondary)
            }
        }
    }

    // MARK: - Actions

    @ViewBuilder
    private var actions: some View {
        switch slot.kind {
        case .appointment:
            VStack(spacing: CarlibSpacing.xs) {
                CarlibButton(
                    label: L10n.GaragePlanning.actionMarkArrived,
                    icon: .checkboxCircleFill,
                    variant: .primary
                ) { onMarkArrived() }

                CarlibButton(
                    label: L10n.GaragePlanning.actionReschedule,
                    icon: .calendarScheduleLine,
                    variant: .secondary
                ) { onReschedule() }

                CarlibButton(
                    label: L10n.GaragePlanning.actionCancelAppt,
                    icon: .closeCircleFill,
                    variant: .destructive
                ) { onCancel() }
            }
        case .blocked:
            VStack(spacing: CarlibSpacing.xs) {
                CarlibButton(
                    label: L10n.GaragePlanning.actionRemoveBlock,
                    icon: .checkboxCircleFill,
                    variant: .primary
                ) { onRemoveBlock() }
            }
        }
    }

    // MARK: - Helpers

    private func vehicleLabel(_ claim: Claim) -> String {
        guard let v = claim.vehicleInfo else { return "—" }
        return "\(v.brand) \(v.model)\n\(v.licensePlate)"
    }

    private func initials(from name: String?) -> String {
        guard let name, !name.isEmpty else { return "?" }
        let parts = name.split(separator: " ")
        let letters = parts.prefix(2).compactMap { $0.first }
        return String(letters).uppercased()
    }

    private func avatarCircle(initials: String) -> some View {
        Text(verbatim: initials)
            .font(CarlibFont.body(.medium))
            .foregroundStyle(.carlibDark)
            .frame(width: 44, height: 44)
            .background(Color.brandYellowLight, in: Circle())
    }

    private func dial(_ phone: String) {
        let digits = phone.filter { $0.isNumber || $0 == "+" }
        if let url = URL(string: "tel://\(digits)") {
            openURL(url)
        }
    }

    private func text(_ phone: String) {
        let digits = phone.filter { $0.isNumber || $0 == "+" }
        if let url = URL(string: "sms://\(digits)") {
            openURL(url)
        }
    }
}

// MARK: - Date helpers

private extension Date {
    var isToday: Bool {
        Calendar.current.isDateInToday(self)
    }

    static func currentWeekStart(using calendar: Calendar = .current) -> Date {
        let today = calendar.startOfDay(for: .now)
        let weekday = calendar.component(.weekday, from: today)
        // Shift so Monday is the start of the week.
        let daysFromMonday = (weekday + 5) % 7
        return calendar.date(byAdding: .day, value: -daysFromMonday, to: today) ?? today
    }
}

// MARK: - Preview

#Preview {
    GaragePlanningView()
        .environment(ClaimStore())
}
