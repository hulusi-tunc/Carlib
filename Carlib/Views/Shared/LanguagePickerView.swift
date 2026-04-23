import SwiftUI

/// Language picker — presented as a sheet from SettingsView. Writing to the
/// `app_language` @AppStorage key flips every `L10n.*` lookup for the next
/// render pass. `CarlibApp` uses the same key as an `.id()` so the whole
/// view hierarchy rebuilds with the new copy.
struct LanguagePickerView: View {
    @Environment(\.dismiss) private var dismiss
    @AppStorage("app_language") private var selectedLanguage: String = AppLanguage.en.rawValue

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                intro
                list
            }
            .padding(.horizontal, 20)
            .padding(.top, 12)
            .padding(.bottom, 40)
        }
        .background(Color.carlibScreenBg)
        .navigationTitle(Text(verbatim: L10n.Settings.sectionLanguage))
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .confirmationAction) {
                Button(L10n.Common.done) { dismiss() }
                    .fontWeight(.medium)
                    .foregroundStyle(.carlibDark)
            }
        }
    }

    private var intro: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(verbatim: L10n.Settings.sectionLanguage)
                .font(CarlibFont.title2())
                .foregroundStyle(.carlibDark)
            Text(verbatim: L10n.Settings.languageNote)
                .font(CarlibFont.footnote())
                .foregroundStyle(.carlibSecondary)
        }
    }

    private var list: some View {
        VStack(spacing: 10) {
            ForEach(AppLanguage.allCases) { lang in
                languageRow(lang)
            }
        }
    }

    private func languageRow(_ lang: AppLanguage) -> some View {
        let isSelected = selectedLanguage == lang.rawValue
        return Button {
            guard !isSelected else { return }
            selectedLanguage = lang.rawValue
            UISelectionFeedbackGenerator().selectionChanged()
        } label: {
            HStack(spacing: 12) {
                Text(verbatim: lang.flag)
                    .font(.system(size: 24))
                    .frame(width: 40, height: 40)
                    .background(Color.tileSecondary, in: Circle())

                Text(verbatim: lang.displayName)
                    .font(CarlibFont.body(.medium))
                    .foregroundStyle(.carlibDark)

                Spacer()

                if isSelected {
                    RemixIcon.checkLine.view(size: 20, color: .black)
                        .frame(width: 28, height: 28)
                        .background(Color.brandYellow, in: Circle())
                }
            }
            .padding(14)
            .background(
                isSelected ? Color.brandYellow.opacity(0.12) : Color.tileSecondary.opacity(0.5),
                in: RoundedRectangle(cornerRadius: 14)
            )
        }
        .buttonStyle(.pressable(scale: 0.98, haptic: .light))
    }
}

#Preview {
    NavigationStack {
        LanguagePickerView()
    }
}
