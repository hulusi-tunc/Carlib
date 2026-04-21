import SwiftUI

/// Driver profile edit — mirrors the garage edit pattern but scoped down to
/// what drivers actually change: name, email, phone, and avatar. Vehicles
/// are edited in a separate flow (`MyGarageView`), so they're out of scope
/// here on purpose.
struct DriverProfileEditView: View {
    @Environment(\.dismiss) private var dismiss

    @State private var name: String
    @State private var email: String
    @State private var dialCode: String
    @State private var phone: String
    @State private var avatarSeed: String

    init(
        name: String,
        email: String,
        dialCode: String = "+33",
        phone: String = "",
        avatarSeed: String = "sophie-durand"
    ) {
        _name = State(initialValue: name)
        _email = State(initialValue: email)
        _dialCode = State(initialValue: dialCode)
        _phone = State(initialValue: phone)
        _avatarSeed = State(initialValue: avatarSeed)
    }

    private var country: CountryDialCode {
        CountryDialCode.from(dialCode: dialCode)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    avatarCard
                    identityCard
                }
                .padding(.horizontal, 20)
                .padding(.top, 12)
                .padding(.bottom, 40)
            }
            .background(Color.carlibScreenBg)
            .navigationTitle(Text(verbatim: L10n.DriverProfileEdit.title))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(L10n.Common.cancel) { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button(L10n.DriverProfileEdit.save) {
                        dismiss()
                    }
                    .fontWeight(.medium)
                }
            }
        }
    }

    // MARK: - Avatar

    private var avatarCard: some View {
        editCard(
            title: L10n.DriverProfileEdit.sectionAvatar,
            subtitle: L10n.DriverProfileEdit.sectionAvatarSubtitle
        ) {
            HStack(spacing: 16) {
                ZStack(alignment: .bottomTrailing) {
                    DummyImage(
                        kind: .person,
                        seed: avatarSeed,
                        pixelWidth: 240,
                        pixelHeight: 240
                    )
                    .frame(width: 84, height: 84)
                    .clipShape(Circle())
                    .overlay {
                        Circle().strokeBorder(Color.carlibCardBorder, lineWidth: 1)
                    }

                    Circle()
                        .fill(Color.brandYellow)
                        .frame(width: 28, height: 28)
                        .overlay {
                            RemixIcon.cameraLine.view(size: 14, color: .black)
                        }
                        .overlay {
                            Circle().strokeBorder(Color.carlibScreenBg, lineWidth: 2)
                        }
                }

                VStack(alignment: .leading, spacing: 8) {
                    Button {
                        avatarSeed = UUID().uuidString
                    } label: {
                        HStack(spacing: 6) {
                            RemixIcon.refreshLine.view(size: 14, color: .carlibDark)
                            Text(verbatim: L10n.DriverProfileEdit.changePhoto)
                                .font(CarlibFont.footnote(.medium))
                                .foregroundStyle(.carlibDark)
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(Color.tileSecondary, in: Capsule())
                    }
                    .buttonStyle(.pressable(scale: 0.95, haptic: .light))

                    Button {
                        avatarSeed = "default-avatar"
                    } label: {
                        HStack(spacing: 6) {
                            RemixIcon.deleteBinLine.view(size: 14, color: .destructiveRed)
                            Text(verbatim: L10n.DriverProfileEdit.removePhoto)
                                .font(CarlibFont.footnote(.medium))
                                .foregroundStyle(.destructiveRed)
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(Color.destructiveRed.opacity(0.08), in: Capsule())
                    }
                    .buttonStyle(.pressable(scale: 0.95, haptic: .light))
                }

                Spacer()
            }
        }
    }

    // MARK: - Identity

    private var identityCard: some View {
        editCard(
            title: L10n.DriverProfileEdit.sectionIdentity,
            subtitle: L10n.DriverProfileEdit.sectionIdentitySubtitle
        ) {
            VStack(spacing: 12) {
                labeledField(
                    label: L10n.DriverProfileEdit.name,
                    text: $name,
                    placeholder: L10n.DriverProfileEdit.namePlaceholder
                )
                labeledField(
                    label: L10n.DriverProfileEdit.email,
                    text: $email,
                    placeholder: L10n.DriverProfileEdit.emailPlaceholder,
                    keyboard: .emailAddress
                )
                phoneField
            }
        }
    }

    private var phoneField: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(verbatim: L10n.DriverProfileEdit.phone.uppercased())
                .font(.custom("Aeonik-Medium", size: 11))
                .tracking(0.8)
                .foregroundStyle(.carlibSecondary)

            HStack(spacing: 8) {
                countryMenu

                TextField("6 12 34 56 78", text: $phone)
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
                .textInputAutocapitalization(keyboard == .emailAddress ? .never : .words)
                .autocorrectionDisabled(keyboard == .emailAddress)
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

#Preview {
    DriverProfileEditView(
        name: "Sophie Durand",
        email: "sophie.durand@email.com",
        dialCode: "+33",
        phone: "6 12 34 56 78"
    )
}
