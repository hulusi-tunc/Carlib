import SwiftUI

/// Network-loaded placeholder image used during prototyping before real
/// photo assets exist on the backend.
///
/// - **garage** — contextual body-shop photo from loremflickr, deterministic
///   by seed so the same garage always shows the same image.
/// - **person** — real portrait from i.pravatar.cc (~70 photos), hashed off
///   the seed so the same user always gets the same face.
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
///
/// For claim damage photos, use `DummyImage.claimPhotoURL(photoId:...)` in an
/// `AsyncImage` so the tags stay centralized here.
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
        switch kind {
        case .garage:
            return Self.garageURL(seed: seed, pixelWidth: pixelWidth, pixelHeight: pixelHeight)
        case .person:
            return Self.personURL(seed: seed, pixelWidth: pixelWidth)
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

    // MARK: - Centralized URL builders

    /// Curated body-shop / mechanic photos from Unsplash. Rotated by seed so
    /// the same garage always renders the same frame. These IDs point
    /// directly at the Unsplash CDN so there's no redirect hop at load time.
    private static let garagePhotoIds: [String] = [
        "photo-1618312980096-873bd19759a0",
        "photo-1591278169757-deac26e49555",
        "photo-1605822167835-d32696aef686",
        "photo-1619642737579-a7474bee1044",
        "photo-1618312980084-67efa94d67b6",
        "photo-1610569762946-397458bd058a",
        "photo-1610569762813-6bfcb54ad25c",
        "photo-1596986952526-3be237187071",
        "photo-1727893119356-1702fe921cf9",
        "photo-1615906655593-ad0386982a0f",
        "photo-1727893294198-e85137574f5b",
        "photo-1676018366904-c083ed678e60",
        "photo-1487754180451-c456f719a1fc",
    ]

    /// Curated car-damage photos from Unsplash for claim attachments.
    private static let damagePhotoIds: [String] = [
        "photo-1597328290883-50c5787b7c7e",
        "photo-1673187139211-1e7ec3dd60ec",
        "photo-1673187139612-6bf684a74815",
        "photo-1745845979138-be64a85272a5",
        "photo-1484136540910-d66bb475348d",
        "photo-1687867451910-28941a460f35",
        "photo-1591497108596-436c1a1a5c8e",
        "photo-1613042964418-89c800809319",
        "photo-1683446748468-eba61cda9473",
        "photo-1684413770726-4ce2b66c3ab0",
    ]

    /// Body-shop image, deterministic by seed.
    static func garageURL(seed: String, pixelWidth: Int = 600, pixelHeight: Int = 400) -> URL? {
        unsplashURL(
            photoId: pickPhotoId(from: garagePhotoIds, seed: seed),
            width: pixelWidth,
            height: pixelHeight
        )
    }

    /// Damage photo for a claim, deterministic by photo id so the same
    /// attachment renders the same frame across cards, detail and lightbox.
    static func claimPhotoURL(photoId: UUID, pixelWidth: Int, pixelHeight: Int) -> URL? {
        unsplashURL(
            photoId: pickPhotoId(from: damagePhotoIds, seed: photoId.uuidString),
            width: pixelWidth,
            height: pixelHeight
        )
    }

    /// Portrait avatar. pravatar serves ~70 real photos indexed 1...70.
    static func personURL(seed: String, pixelWidth: Int = 200) -> URL? {
        let cleanSeed = seed
            .replacingOccurrences(of: "-", with: "")
            .replacingOccurrences(of: " ", with: "")
            .lowercased()
        let index = abs(cleanSeed.hashValue) % 70 + 1
        return URL(string: "https://i.pravatar.cc/\(pixelWidth)?img=\(index)")
    }

    private static func pickPhotoId(from pool: [String], seed: String) -> String {
        let cleaned = seed
            .replacingOccurrences(of: "-", with: "")
            .replacingOccurrences(of: " ", with: "")
            .lowercased()
        let index = abs(cleaned.hashValue) % pool.count
        return pool[index]
    }

    private static func unsplashURL(photoId: String, width: Int, height: Int) -> URL? {
        // `auto=format&fit=crop` lets Unsplash serve the best format + crop
        // to the exact aspect ratio we requested.
        URL(string: "https://images.unsplash.com/\(photoId)?w=\(width)&h=\(height)&q=80&auto=format&fit=crop")
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
