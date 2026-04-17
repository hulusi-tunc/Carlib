import SwiftUI

/// Network-loaded placeholder image used during prototyping before
/// real photo assets exist on the backend.
///
/// - **garage** — pulls a deterministic random image from picsum.photos keyed
///   on the supplied seed, so the same garage always shows the same image.
/// - **person** — pulls a deterministic avatar from i.pravatar.cc (~70 real
///   photos), hashed off the seed so the same user always gets the same face.
///
/// Usage:
/// ```swift
/// DummyImage(kind: .garage, seed: garage.id.uuidString)
///     .frame(width: 90, height: 90)
///     .clipShape(RoundedRectangle(cornerRadius: 12))
/// ```
///
/// Both endpoints support HTTPS (ATS-compliant). On failure or slow networks,
/// a neutral tile with a Remixicon glyph is shown as a placeholder.
struct DummyImage: View {
    enum Kind {
        case garage
        case person
    }

    let kind: Kind
    let seed: String
    var pixelWidth: Int = 600
    var pixelHeight: Int = 400

    var body: some View {
        AsyncImage(
            url: url,
            transaction: Transaction(animation: .easeOut(duration: 0.25))
        ) { phase in
            switch phase {
            case .success(let image):
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            case .empty, .failure:
                placeholder
            @unknown default:
                placeholder
            }
        }
        .clipped()
    }

    private var url: URL? {
        let cleanSeed = seed
            .replacingOccurrences(of: "-", with: "")
            .replacingOccurrences(of: " ", with: "")
            .lowercased()
        switch kind {
        case .garage:
            return URL(
                string: "https://picsum.photos/seed/\(cleanSeed)/\(pixelWidth)/\(pixelHeight)"
            )
        case .person:
            // pravatar has ~70 fixed avatars; pick one via seed hash.
            let index = abs(cleanSeed.hashValue) % 70 + 1
            return URL(string: "https://i.pravatar.cc/\(pixelWidth)?img=\(index)")
        }
    }

    private var placeholder: some View {
        Rectangle()
            .fill(Color.tileSecondary)
            .overlay {
                (kind == .garage ? RemixIcon.storeFill : RemixIcon.userFill)
                    .view(size: 22, color: .carlibLabel.opacity(0.6))
            }
    }
}

#Preview("Garage") {
    DummyImage(kind: .garage, seed: "garage-preview-1")
        .frame(width: 240, height: 160)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .padding()
        .background(Color.carlibScreenBg)
}

#Preview("Person") {
    DummyImage(kind: .person, seed: "sophie-durand")
        .frame(width: 64, height: 64)
        .clipShape(Circle())
        .padding()
        .background(Color.carlibScreenBg)
}
