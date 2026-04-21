import SwiftUI

/// Fullscreen photo viewer used from claim cards and detail views.
/// Swipe between photos, pinch intentionally left out for v1 to keep
/// the gesture surface simple — swipe-down to dismiss is inherited
/// from the `.fullScreenCover` presentation.
struct PhotoLightboxView: View {
    let photos: [PhotoAttachment]
    @State private var currentIndex: Int
    @Environment(\.dismiss) private var dismiss

    init(photos: [PhotoAttachment], initialIndex: Int) {
        self.photos = photos
        _currentIndex = State(initialValue: max(0, min(initialIndex, photos.count - 1)))
    }

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            TabView(selection: $currentIndex) {
                ForEach(Array(photos.enumerated()), id: \.element.id) { index, photo in
                    photoView(for: photo)
                        .tag(index)
                }
            }
            .tabViewStyle(.page(indexDisplayMode: photos.count > 1 ? .automatic : .never))
            .indexViewStyle(.page(backgroundDisplayMode: .always))
            .ignoresSafeArea()
        }
        .overlay(alignment: .top) {
            HStack {
                if photos.count > 1 {
                    Text(verbatim: "\(currentIndex + 1) / \(photos.count)")
                        .font(CarlibFont.footnote(.medium))
                        .foregroundStyle(.white)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(.black.opacity(0.45), in: Capsule())
                }

                Spacer()

                Button {
                    dismiss()
                } label: {
                    RemixIcon.closeLine.view(size: 22, color: .white)
                        .frame(width: 40, height: 40)
                        .background(.black.opacity(0.45), in: Circle())
                }
                .buttonStyle(.pressable(scale: 0.9, haptic: .light))
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
        }
        .overlay(alignment: .bottom) {
            if currentIndex < photos.count, !photos[currentIndex].caption.isEmpty {
                Text(verbatim: photos[currentIndex].caption)
                    .font(CarlibFont.body(.medium))
                    .foregroundStyle(.white)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 12)
                    .background(.black.opacity(0.5), in: Capsule())
                    .padding(.horizontal, 24)
                    .padding(.bottom, 40)
            }
        }
        .statusBarHidden(true)
    }

    @ViewBuilder
    private func photoView(for photo: PhotoAttachment) -> some View {
        if let data = photo.imageData, let image = UIImage(data: data) {
            Image(uiImage: image)
                .resizable()
                .aspectRatio(contentMode: .fit)
        } else {
            AsyncImage(
                url: URL(string: "https://picsum.photos/seed/\(photo.id.uuidString)/1200/1200"),
                transaction: Transaction(animation: .easeOut(duration: 0.25))
            ) { phase in
                switch phase {
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                case .empty:
                    ProgressView()
                        .tint(.white)
                case .failure:
                    VStack(spacing: 8) {
                        RemixIcon.imageLine.view(size: 48, color: .white.opacity(0.4))
                        Text(verbatim: "Image unavailable")
                            .font(CarlibFont.footnote())
                            .foregroundStyle(.white.opacity(0.6))
                    }
                @unknown default:
                    Color.black
                }
            }
        }
    }
}

#Preview {
    PhotoLightboxView(
        photos: [
            PhotoAttachment(caption: "Passenger side"),
            PhotoAttachment(caption: "Rear bumper detail"),
            PhotoAttachment(caption: "Front wing"),
        ],
        initialIndex: 0
    )
}
