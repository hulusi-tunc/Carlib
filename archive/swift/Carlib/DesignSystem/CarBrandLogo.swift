import SwiftUI

/// Maps vehicle brand names to their logo images from the asset catalog.
/// Falls back to a car Remix Icon if no logo is found.
struct CarBrandLogo: View {
    let brand: String
    var size: CGFloat = 32

    var body: some View {
        if let assetName = assetName(for: brand) {
            Image(assetName)
                .resizable()
                .scaledToFit()
                .frame(width: size, height: size)
        } else {
            // Fallback: Remix car icon
            RemixIcon.carLine.view(size: size * 0.6, color: .carlibSecondary)
                .frame(width: size, height: size)
        }
    }

    private func assetName(for brand: String) -> String? {
        let normalized = brand.lowercased().trimmingCharacters(in: .whitespaces)

        let mapping: [String: String] = [
            "peugeot": "peugeot",
            "renault": "renault",
            "volkswagen": "volkswagen",
            "vw": "volkswagen",
            "citroen": "citroen",
            "citroën": "citroen",
            "bmw": "bmw",
            "mercedes": "mercedes_benz",
            "mercedes-benz": "mercedes_benz",
            "mercedes benz": "mercedes_benz",
            "toyota": "toyota",
            "ford": "ford",
            "fiat": "fiat",
            "opel": "opel",
            "audi": "audi",
            "dacia": "dacia",
            "tesla": "tesla",
            "hyundai": "hyundai",
            "kia": "kia",
            "nissan": "nissan",
            "seat": "seat",
            "skoda": "skoda",
            "škoda": "skoda",
        ]

        return mapping[normalized]
    }
}

#Preview {
    VStack(spacing: 16) {
        CarBrandLogo(brand: "Peugeot", size: 48)
        CarBrandLogo(brand: "Renault", size: 48)
        CarBrandLogo(brand: "Volkswagen", size: 48)
        CarBrandLogo(brand: "Unknown Brand", size: 48)
    }
    .padding()
    .background(Color.carlibScreenBg)
}
