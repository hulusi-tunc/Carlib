import SwiftUI

/// Dark-themed text field with label, placeholder, and error state.
struct CarlibTextField: View {
    let label: String
    let placeholder: String
    @Binding var text: String
    var keyboardType: UIKeyboardType = .default
    var contentType: UITextContentType?
    var error: String?

    @FocusState private var isFocused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(verbatim: label)
                .font(CarlibFont.callout(.medium))
                .foregroundStyle(.carlibSecondary)

            TextField(placeholder, text: $text)
                .font(CarlibFont.body())
                .keyboardType(keyboardType)
                .textContentType(contentType)
                .autocorrectionDisabled()
                .textInputAutocapitalization(keyboardType == .emailAddress ? .never : .words)
                .focused($isFocused)
                .padding(.horizontal, 16)
                .frame(height: 52)
                .background(Color.tileSecondary, in: RoundedRectangle(cornerRadius: 12))

            if let error {
                Text(verbatim: error)
                    .font(CarlibFont.caption())
                    .foregroundStyle(.destructiveRed)
            }
        }
    }

}

#Preview {
    VStack(spacing: 20) {
        CarlibTextField(label: "Email", placeholder: "you@example.com", text: .constant(""))
        CarlibTextField(label: "Email", placeholder: "", text: .constant("bad"), error: "Invalid email")
    }
    .padding()
    .background(Color.carlibScreenBg)
}
