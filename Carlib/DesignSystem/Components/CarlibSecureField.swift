import SwiftUI

/// Dark-themed password field with show/hide toggle.
struct CarlibSecureField: View {
    let label: String
    let placeholder: String
    @Binding var text: String
    var hint: String?
    var error: String?

    @State private var isRevealed = false
    @FocusState private var isFocused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(verbatim: label)
                .font(CarlibFont.callout(.medium))
                .foregroundStyle(.carlibSecondary)

            HStack(spacing: 0) {
                Group {
                    if isRevealed {
                        TextField(placeholder, text: $text)
                    } else {
                        SecureField(placeholder, text: $text)
                    }
                }
                .font(CarlibFont.body())
                .textContentType(.password)
                .autocorrectionDisabled()
                .textInputAutocapitalization(.never)
                .focused($isFocused)

                Button {
                    isRevealed.toggle()
                } label: {
                    (isRevealed ? RemixIcon.eyeOffLine : RemixIcon.eyeLine)
                        .view(size: 18, color: .carlibSecondary)
                }
            }
            .padding(.horizontal, 16)
            .frame(height: 52)
            .background(Color.tileSecondary, in: RoundedRectangle(cornerRadius: 12))

            if let error {
                Text(verbatim: error)
                    .font(CarlibFont.caption())
                    .foregroundStyle(.destructiveRed)
            } else if let hint {
                Text(verbatim: hint)
                    .font(CarlibFont.caption())
                    .foregroundStyle(.carlibLabel)
            }
        }
    }

}

#Preview {
    CarlibSecureField(label: "Password", placeholder: "••••••••", text: .constant(""), hint: "8+ characters")
        .padding()
        .background(Color.carlibScreenBg)
}
