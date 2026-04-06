import SwiftUI

/// Notification preferences — persisted via @AppStorage.
struct NotificationSettingsView: View {
    @AppStorage("notif_push") private var pushEnabled = true
    @AppStorage("notif_status") private var statusUpdates = true
    @AppStorage("notif_booking") private var bookingReminders = true
    @AppStorage("notif_matches") private var newMatches = true

    var body: some View {
        List {
            Section {
                Toggle(L10n.NotificationSettings.pushEnabled, isOn: $pushEnabled)
            }

            Section {
                Toggle(L10n.NotificationSettings.statusUpdates, isOn: $statusUpdates)
                    .disabled(!pushEnabled)
                Toggle(L10n.NotificationSettings.bookingReminders, isOn: $bookingReminders)
                    .disabled(!pushEnabled)
                Toggle(L10n.NotificationSettings.newMatches, isOn: $newMatches)
                    .disabled(!pushEnabled)
            }
        }
        .navigationTitle(Text(verbatim: L10n.NotificationSettings.title))
        .navigationBarTitleDisplayMode(.inline)
        .tint(.carlibPrimaryBlue)
    }
}

#Preview {
    NavigationStack {
        NotificationSettingsView()
    }
}
