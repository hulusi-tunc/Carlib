import SwiftUI

/// Garage profile edit — chip pickers and visual sliders instead of a
/// generic form. Shop owners rarely edit this, so the first time they do
/// it should feel guided and quick.
struct GarageProfileEditView: View {
    @Environment(\.dismiss) private var dismiss

    @State private var name: String
    @State private var address: String
    @State private var dialCode: String
    @State private var phone: String
    @State private var coverageRadius: Double
    @State private var selectedSpecialties: Set<RepairSpecialty>

    init(garage: Garage) {
        _name = State(initialValue: garage.name)
        _address = State(initialValue: garage.address)
        _dialCode = State(initialValue: garage.dialCode)
        _phone = State(initialValue: garage.phone)
        _coverageRadius = State(initialValue: garage.coverageRadiusKm)
        _selectedSpecialties = State(initialValue: Set(garage.specialties))
    }

    private var country: CountryDialCode {
        CountryDialCode.from(dialCode: dialCode)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    basicInfoCard
                    specialtiesCard
                    coverageCard
                    photosCard
                }
                .padding(.horizontal, 20)
                .padding(.top, 12)
                .padding(.bottom, 40)
            }
            .background(Color.carlibScreenBg)
            .navigationTitle(Text(verbatim: L10n.GarageProfileEdit.title))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(L10n.Common.cancel) { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button(L10n.GarageProfileEdit.save) {
                        // In-memory only for MVP — no persistence yet.
                        dismiss()
                    }
                    .fontWeight(.medium)
                }
            }
        }
    }

    // MARK: - Basic info

    private var basicInfoCard: some View {
        editCard(title: "Business info") {
            VStack(spacing: 12) {
                labeledField(label: "Shop name", text: $name, placeholder: "e.g. Carrosserie Dupont")
                labeledField(label: "Address", text: $address, placeholder: "Street, ZIP city")
                phoneField
            }
        }
    }

    private var phoneField: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(verbatim: "PHONE")
                .font(.custom("Aeonik-Medium", size: 11))
                .tracking(0.8)
                .foregroundStyle(.carlibSecondary)

            HStack(spacing: 8) {
                countryMenu

                TextField("1 43 55 12 34", text: $phone)
                    .keyboardType(.phonePad)
                    .textContentType(.telephoneNumber)
                    .font(CarlibFont.body())
                    .padding(.horizontal, 14)
                    .frame(height: 48)
                    .frame(maxWidth: .infinity)
                    .background(Color.carlibScreenBg, in: RoundedRectangle(cornerRadius: 12))
                    .overlay {
                        RoundedRectangle(cornerRadius: 12)
                            .strokeBorder(Color.carlibCardBorder, lineWidth: 1)
                    }
            }
        }
    }

    private var countryMenu: some View {
        Menu {
            Picker("Country", selection: $dialCode) {
                ForEach(CountryDialCode.all) { option in
                    HStack {
                        Text(verbatim: "\(option.flag)  \(option.name)")
                        Spacer()
                        Text(verbatim: option.dialCode)
                            .foregroundStyle(.secondary)
                    }
                    .tag(option.dialCode)
                }
            }
        } label: {
            HStack(spacing: 6) {
                Text(verbatim: country.flag)
                    .font(.system(size: 20))
                Text(verbatim: country.dialCode)
                    .font(CarlibFont.body(.medium))
                    .foregroundStyle(.carlibDark)
                RemixIcon.arrowDownSLine.view(size: 14, color: .carlibSecondary)
            }
            .padding(.horizontal, 12)
            .frame(height: 48)
            .background(Color.carlibScreenBg, in: RoundedRectangle(cornerRadius: 12))
            .overlay {
                RoundedRectangle(cornerRadius: 12)
                    .strokeBorder(Color.carlibCardBorder, lineWidth: 1)
            }
        }
        .buttonStyle(.plain)
        .onChange(of: dialCode) { _, _ in
            UISelectionFeedbackGenerator().selectionChanged()
        }
    }

    private func labeledField(
        label: String,
        text: Binding<String>,
        placeholder: String,
        keyboard: UIKeyboardType = .default
    ) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(verbatim: label.uppercased())
                .font(.custom("Aeonik-Medium", size: 11))
                .tracking(0.8)
                .foregroundStyle(.carlibSecondary)

            TextField(placeholder, text: text)
                .keyboardType(keyboard)
                .font(CarlibFont.body())
                .padding(.horizontal, 14)
                .padding(.vertical, 14)
                .background(Color.carlibScreenBg, in: RoundedRectangle(cornerRadius: 12))
                .overlay {
                    RoundedRectangle(cornerRadius: 12)
                        .strokeBorder(Color.carlibCardBorder, lineWidth: 1)
                }
        }
    }

    // MARK: - Specialties (chip picker)

    private var specialtiesCard: some View {
        editCard(title: "Specialties", subtitle: "Tap to toggle — these show on your listing.") {
            WrappingHStackEdit(spacing: 8, lineSpacing: 8) {
                ForEach(RepairSpecialty.allCases, id: \.self) { specialty in
                    let isOn = selectedSpecialties.contains(specialty)
                    Button {
                        if isOn {
                            selectedSpecialties.remove(specialty)
                        } else {
                            selectedSpecialties.insert(specialty)
                        }
                    } label: {
                        HStack(spacing: 6) {
                            if isOn {
                                RemixIcon.checkLine.view(size: 14, color: .carlibDark)
                            }
                            Text(verbatim: specialty.localizedName)
                                .font(CarlibFont.footnote(.medium))
                                .foregroundStyle(.carlibDark)
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(
                            isOn ? Color.brandYellow.opacity(0.2) : Color.tileSecondary,
                            in: Capsule()
                        )
                        .overlay {
                            Capsule()
                                .strokeBorder(
                                    isOn ? Color.brandYellow.opacity(0.5) : Color.carlibCardBorder,
                                    lineWidth: 1
                                )
                        }
                    }
                    .buttonStyle(.pressable(scale: 0.95, haptic: .light))
                }
            }
        }
    }

    // MARK: - Coverage

    private var coverageCard: some View {
        editCard(
            title: "Service area",
            subtitle: "How far you're willing to take jobs from."
        ) {
            VStack(spacing: 12) {
                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Text(verbatim: "\(Int(coverageRadius))")
                        .font(.custom("Aeonik-Medium", size: 36))
                        .foregroundStyle(.carlibDark)
                    Text(verbatim: "km radius")
                        .font(CarlibFont.callout())
                        .foregroundStyle(.carlibSecondary)
                    Spacer()
                }

                Slider(value: $coverageRadius, in: 5...50, step: 5)
                    .tint(.brandYellow)

                HStack {
                    Text(verbatim: "5 km")
                        .font(CarlibFont.caption())
                        .foregroundStyle(.carlibSecondary)
                    Spacer()
                    Text(verbatim: "50 km")
                        .font(CarlibFont.caption())
                        .foregroundStyle(.carlibSecondary)
                }
            }
        }
    }

    // MARK: - Photos

    private var photosCard: some View {
        editCard(
            title: "Photos",
            subtitle: "Shops with 3+ photos get 40% more leads."
        ) {
            LazyVGrid(columns: [GridItem(.flexible(), spacing: 10),
                                GridItem(.flexible(), spacing: 10),
                                GridItem(.flexible(), spacing: 10)], spacing: 10) {
                // "Add" tile
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.brandYellow.opacity(0.1))
                    .overlay {
                        RoundedRectangle(cornerRadius: 12)
                            .strokeBorder(
                                style: StrokeStyle(lineWidth: 1.5, dash: [6])
                            )
                            .foregroundStyle(Color.brandYellow.opacity(0.5))
                    }
                    .overlay {
                        VStack(spacing: 6) {
                            RemixIcon.addLine.view(size: 22, color: .brandYellow)
                            Text(verbatim: "Add")
                                .font(CarlibFont.caption(.medium))
                                .foregroundStyle(.carlibDark)
                        }
                    }
                    .aspectRatio(1, contentMode: .fit)

                // Placeholder slots
                ForEach(0..<2, id: \.self) { _ in
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.tileSecondary)
                        .overlay {
                            RemixIcon.imageLine.view(size: 22, color: .carlibSecondary)
                        }
                        .aspectRatio(1, contentMode: .fit)
                }
            }
        }
    }

    // MARK: - Card wrapper

    @ViewBuilder
    private func editCard<Content: View>(
        title: String,
        subtitle: String? = nil,
        @ViewBuilder content: () -> Content
    ) -> some View {
        VStack(alignment: .leading, spacing: 14) {
            VStack(alignment: .leading, spacing: 4) {
                Text(verbatim: title)
                    .font(.custom("Aeonik-Medium", size: 17))
                    .foregroundStyle(.carlibDark)
                if let subtitle {
                    Text(verbatim: subtitle)
                        .font(CarlibFont.footnote())
                        .foregroundStyle(.carlibSecondary)
                }
            }
            content()
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.tileSecondary.opacity(0.5), in: RoundedRectangle(cornerRadius: 16))
        .overlay {
            RoundedRectangle(cornerRadius: 16)
                .strokeBorder(Color.carlibCardBorder, lineWidth: 1)
        }
    }
}

// MARK: - Wrapping HStack (local to edit view)

private struct WrappingHStackEdit: Layout {
    var spacing: CGFloat = 8
    var lineSpacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let maxWidth = proposal.width ?? .infinity
        var x: CGFloat = 0
        var y: CGFloat = 0
        var rowHeight: CGFloat = 0
        var maxRowWidth: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > maxWidth, x > 0 {
                y += rowHeight + lineSpacing
                x = 0
                rowHeight = 0
            }
            rowHeight = max(rowHeight, size.height)
            x += size.width + spacing
            maxRowWidth = max(maxRowWidth, x)
        }
        return CGSize(width: maxRowWidth, height: y + rowHeight)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x: CGFloat = bounds.minX
        var y: CGFloat = bounds.minY
        var rowHeight: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > bounds.maxX, x > bounds.minX {
                y += rowHeight + lineSpacing
                x = bounds.minX
                rowHeight = 0
            }
            subview.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(size))
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
    }
}

#Preview {
    GarageProfileEditView(garage: MockData.garages[0])
}
