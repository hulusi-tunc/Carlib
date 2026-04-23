import SwiftUI

/// Unified settings screen reachable from both Driver and Garage profiles.
/// Matches the tile-card visual language used by the profile pages instead
/// of the default iOS List style — keeps rows big, high-contrast, and easy
/// to scan.
struct SettingsView: View {
    @Environment(AppState.self) private var appState
    @AppStorage("app_theme") private var selectedTheme: String = AppTheme.light.rawValue

    @State private var showChangePassword = false
    @State private var showDeleteConfirm = false
    @State private var showLanguage = false
    @State private var showNotifications = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                appearanceSection
                languageSection
                accountSection
                notificationsSection
                dangerSection
            }
            .padding(.horizontal, 20)
            .padding(.top, 12)
            .padding(.bottom, 40)
        }
        .background(Color.carlibScreenBg)
        .navigationTitle(Text(verbatim: L10n.Settings.title))
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            #if DEBUG
            switch DebugScreenshotFlags.sheet {
            case "language": showLanguage = true
            case "password": showChangePassword = true
            case "notifications": showNotifications = true
            case "delete": showDeleteConfirm = true
            default: break
            }
            #endif
        }
        .sheet(isPresented: $showChangePassword) {
            NavigationStack { ChangePasswordView() }
        }
        .sheet(isPresented: $showLanguage) {
            NavigationStack { LanguagePickerView() }
        }
        .sheet(isPresented: $showNotifications) {
            NavigationStack { NotificationSettingsView() }
        }
        .alert(
            Text(verbatim: L10n.Settings.deleteAccountConfirmTitle),
            isPresented: $showDeleteConfirm
        ) {
            Button(L10n.Common.cancel, role: .cancel) { }
            Button(L10n.Settings.deleteAccount, role: .destructive) {
                appState.signOut()
            }
        } message: {
            Text(verbatim: L10n.Settings.deleteAccountConfirmMessage)
        }
    }

    // MARK: - Appearance (segmented picker — always visible)

    private var appearanceSection: some View {
        section(title: L10n.Settings.sectionAppearance) {
            HStack(spacing: 8) {
                ForEach(AppTheme.allCases, id: \.rawValue) { theme in
                    themeChip(theme)
                }
            }
        }
    }

    private func themeChip(_ theme: AppTheme) -> some View {
        let isSelected = selectedTheme == theme.rawValue
        return Button {
            selectedTheme = theme.rawValue
            UISelectionFeedbackGenerator().selectionChanged()
        } label: {
            VStack(spacing: 8) {
                theme.icon.view(
                    size: 22,
                    color: isSelected ? .black : .carlibDark
                )
                Text(verbatim: theme.label)
                    .font(CarlibFont.footnote(.medium))
                    .foregroundStyle(isSelected ? .black : .carlibDark)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(
                isSelected ? Color.brandYellow : Color.tileSecondary.opacity(0.5),
                in: RoundedRectangle(cornerRadius: 14)
            )
        }
        .buttonStyle(.pressable(scale: 0.97, haptic: .light))
    }

    // MARK: - Language

    private var languageSection: some View {
        section(title: L10n.Settings.sectionLanguage) {
            tileRow(
                icon: .translate2,
                title: L10n.Profile.languageCurrent,
                trailing: .chevron
            ) {
                showLanguage = true
            }
        }
    }

    // MARK: - Account

    private var accountSection: some View {
        section(title: L10n.Settings.sectionAccount) {
            VStack(spacing: 10) {
                tileRow(
                    icon: .lockLine,
                    title: L10n.Settings.changePassword,
                    trailing: .chevron
                ) {
                    showChangePassword = true
                }
            }
        }
    }

    // MARK: - Notifications

    private var notificationsSection: some View {
        section(title: L10n.Settings.sectionNotifications) {
            tileRow(
                icon: .notificationLine,
                title: L10n.Settings.notificationPreferences,
                trailing: .chevron
            ) {
                showNotifications = true
            }
        }
    }

    // MARK: - Danger zone

    private var dangerSection: some View {
        Button(role: .destructive) {
            showDeleteConfirm = true
        } label: {
            HStack(spacing: 12) {
                RemixIcon.deleteBinLine.view(size: 18, color: .destructiveRed)
                    .frame(width: 44, height: 44)
                    .background(Color.destructiveRed.opacity(0.1), in: Circle())
                Text(verbatim: L10n.Settings.deleteAccount)
                    .font(CarlibFont.body(.medium))
                    .foregroundStyle(.destructiveRed)
                Spacer()
            }
            .padding(14)
            .background(Color.tileSecondary.opacity(0.5), in: RoundedRectangle(cornerRadius: 14))
        }
        .buttonStyle(.plain)
    }

    // MARK: - Section + row helpers

    @ViewBuilder
    private func section<Content: View>(
        title: String,
        footer: String? = nil,
        @ViewBuilder content: () -> Content
    ) -> some View {
        VStack(alignment: .leading, spacing: 9) {
            Text(verbatim: title)
                .font(CarlibFont.title3())
                .foregroundStyle(.carlibDark)
            content()
            if let footer {
                Text(verbatim: footer)
                    .font(CarlibFont.footnote())
                    .foregroundStyle(.carlibSecondary)
                    .padding(.top, 2)
            }
        }
    }

    enum TrailingElement {
        case chevron
        case chevronDown
        case text(String)
        case none
    }

    private func tileRow(
        icon: RemixIcon,
        title: String,
        trailing: TrailingElement,
        action: (() -> Void)?
    ) -> some View {
        Group {
            if let action {
                Button(action: action) {
                    tileRowContent(icon: icon, title: title, trailing: trailing)
                }
                .buttonStyle(.pressable(scale: 0.98, haptic: .light))
            } else {
                tileRowContent(icon: icon, title: title, trailing: trailing)
            }
        }
    }

    private func tileRowContent(
        icon: RemixIcon,
        title: String,
        trailing: TrailingElement
    ) -> some View {
        HStack(spacing: 12) {
            icon.view(size: 20, color: .brandYellow)
                .frame(width: 44, height: 44)
                .background(Color.brandYellow.opacity(0.12), in: Circle())

            Text(verbatim: title)
                .font(CarlibFont.body(.medium))
                .foregroundStyle(.carlibDark)

            Spacer()

            switch trailing {
            case .chevron:
                RemixIcon.arrowRightLine.view(size: 16, color: .carlibSecondary)
            case .chevronDown:
                RemixIcon.arrowDownSLine.view(size: 16, color: .carlibSecondary)
            case .text(let value):
                Text(verbatim: value)
                    .font(CarlibFont.body())
                    .foregroundStyle(.carlibSecondary)
            case .none:
                EmptyView()
            }
        }
        .padding(14)
        .background(Color.tileSecondary.opacity(0.5), in: RoundedRectangle(cornerRadius: 14))
        .contentShape(Rectangle())
    }
}

#Preview {
    NavigationStack {
        SettingsView()
            .environment(AppState())
    }
}
