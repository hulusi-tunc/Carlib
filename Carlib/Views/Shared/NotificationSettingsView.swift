import SwiftUI

/// Notification preferences — presented as a sheet from SettingsView and
/// styled with the app's tile cards instead of iOS List defaults.
struct NotificationSettingsView: View {
    @Environment(\.dismiss) private var dismiss

    @AppStorage("notif_push") private var pushEnabled = true
    @AppStorage("notif_status") private var statusUpdates = true
    @AppStorage("notif_booking") private var bookingReminders = true
    @AppStorage("notif_matches") private var newMatches = true

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                intro
                masterCard
                detailCard
            }
            .padding(.horizontal, 20)
            .padding(.top, 12)
            .padding(.bottom, 40)
        }
        .background(Color.carlibScreenBg)
        .navigationTitle(Text(verbatim: L10n.NotificationSettings.title))
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .confirmationAction) {
                Button(L10n.Common.done) { dismiss() }
                    .fontWeight(.medium)
                    .foregroundStyle(.carlibDark)
            }
        }
    }

    // MARK: - Intro

    private var intro: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(verbatim: L10n.NotificationSettings.title)
                .font(.custom("Aeonik-Medium", size: 22))
                .foregroundStyle(.carlibDark)
            Text(verbatim: "Choose which updates Carlib sends to your device.")
                .font(CarlibFont.footnote())
                .foregroundStyle(.carlibSecondary)
        }
    }

    // MARK: - Master toggle

    private var masterCard: some View {
        card {
            toggleRow(
                icon: .notificationLine,
                title: L10n.NotificationSettings.pushEnabled,
                isOn: $pushEnabled,
                enabled: true
            )
        }
    }

    // MARK: - Detail toggles

    private var detailCard: some View {
        card {
            VStack(spacing: 0) {
                toggleRow(
                    icon: .fileListLine,
                    title: L10n.NotificationSettings.statusUpdates,
                    isOn: $statusUpdates,
                    enabled: pushEnabled
                )
                divider
                toggleRow(
                    icon: .calendarEventLine,
                    title: L10n.NotificationSettings.bookingReminders,
                    isOn: $bookingReminders,
                    enabled: pushEnabled
                )
                divider
                toggleRow(
                    icon: .sparklingLine,
                    title: L10n.NotificationSettings.newMatches,
                    isOn: $newMatches,
                    enabled: pushEnabled
                )
            }
        }
    }

    // MARK: - Building blocks

    private var divider: some View {
        Divider().overlay(Color.carlibCardBorder).padding(.horizontal, 14)
    }

    @ViewBuilder
    private func card<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        VStack(spacing: 0) {
            content()
        }
        .background(Color.tileSecondary.opacity(0.5), in: RoundedRectangle(cornerRadius: 14))
    }

    private func toggleRow(
        icon: RemixIcon,
        title: String,
        isOn: Binding<Bool>,
        enabled: Bool
    ) -> some View {
        HStack(spacing: 12) {
            icon.view(size: 18, color: .brandYellow)
                .frame(width: 40, height: 40)
                .background(Color.brandYellow.opacity(0.12), in: Circle())

            Text(verbatim: title)
                .font(CarlibFont.body(.medium))
                .foregroundStyle(.carlibDark)

            Spacer()

            Toggle("", isOn: isOn)
                .labelsHidden()
                .tint(.brandYellow)
                .disabled(!enabled)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 12)
        .opacity(enabled ? 1.0 : 0.5)
    }
}

#Preview {
    NavigationStack {
        NotificationSettingsView()
    }
}
