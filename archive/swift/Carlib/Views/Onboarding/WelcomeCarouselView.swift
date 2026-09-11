import SwiftUI

/// Instagram-Stories-style onboarding carousel:
/// - Tap right half → next slide
/// - Tap left half → previous slide
/// - Long-press → pause
/// - Auto-advances every 4s, loops after the last
///
/// Each slide has a full-bleed photo background with a white-to-transparent
/// gradient overlay at the top so the progress bars, "Welcome to Carlib"
/// header and headline remain legible in black. Two pinned buttons at the
/// bottom — Create account (primary) and Log in (secondary).
struct WelcomeCarouselView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var currentPage = 0
    @State private var storyProgress: CGFloat = 0
    @State private var isPaused = false
    @State private var showSignIn = false
    @State private var showSignUp = false
    @State private var timer: Timer?

    private let slideDuration: TimeInterval = 4.0

    private struct Slide {
        let headline: String
        let backgroundAsset: String
    }

    private let slides: [Slide] = [
        Slide(headline: "Declare your accident in minutes", backgroundAsset: "WelcomeBg1"),
        Slide(headline: "Find a garage nearby", backgroundAsset: "WelcomeBg2"),
        Slide(headline: "Track repairs in real-time", backgroundAsset: "WelcomeBg3"),
        Slide(headline: "Trusted by garages in France", backgroundAsset: "WelcomeBg4"),
    ]

    private var slideCount: Int { slides.count }

    var body: some View {
        ZStack(alignment: .topLeading) {
            // Photo — sized larger than the screen so it always bleeds past
            // the safe area on every edge (notch, bottom home indicator).
            // GeometryReader gives us the safe area insets so we can extend
            // the frame and offset it back into place.
            GeometryReader { proxy in
                let extraW = proxy.safeAreaInsets.leading + proxy.safeAreaInsets.trailing
                let extraH = proxy.safeAreaInsets.top + proxy.safeAreaInsets.bottom
                Image(slides[currentPage].backgroundAsset)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(
                        width: proxy.size.width + extraW,
                        height: proxy.size.height + extraH
                    )
                    .clipped()
                    .offset(
                        x: -proxy.safeAreaInsets.leading,
                        y: -proxy.safeAreaInsets.top
                    )
                    .transition(.opacity)
                    .id(currentPage)
                    .accessibilityHidden(true)
            }
            .ignoresSafeArea()

            // White → transparent gradient on the top so the progress
            // bars, kicker and headline stay legible in black over the photo.
            LinearGradient(
                stops: [
                    .init(color: .white, location: 0),
                    .init(color: .white.opacity(0), location: 0.386),
                ],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            .allowsHitTesting(false)

            // Content — sibling of the backgrounds, respects safe area
            // because it has no `.ignoresSafeArea()` of its own.
            VStack(alignment: .leading, spacing: 0) {
                progressBar
                    .padding(.horizontal, 24)
                    .padding(.top, 12)

                HStack(spacing: 6) {
                    Text(verbatim: "Welcome to")
                        .font(CarlibFont.footnote())
                        .foregroundStyle(.carlibSecondary)

                    Image("CarlibLogo")
                        .renderingMode(.original)
                        .resizable()
                        .scaledToFit()
                        .frame(height: 14)
                        .accessibilityLabel("Carlib")
                }
                .padding(.horizontal, 24)
                .padding(.top, 16)

                Text(verbatim: slides[currentPage].headline)
                    .font(CarlibFont.largeTitle(.medium))
                    .foregroundStyle(.black)
                    .lineLimit(nil)
                    .multilineTextAlignment(.leading)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 24)
                    .padding(.top, 12)
                    .id(currentPage)
                    .transition(.opacity)

                // Gesture layer fills the remaining space so tap/long-press
                // work over the photo without stealing from the progress
                // bars, header or CTAs.
                GeometryReader { geo in
                    HStack(spacing: 0) {
                        Color.clear
                            .contentShape(Rectangle())
                            .frame(width: geo.size.width / 2)
                            .onTapGesture { goBack() }

                        Color.clear
                            .contentShape(Rectangle())
                            .frame(width: geo.size.width / 2)
                            .onTapGesture { goNext() }
                    }
                }
                .simultaneousGesture(
                    LongPressGesture(minimumDuration: 0.2)
                        .onChanged { _ in pause() }
                        .onEnded { _ in resume() }
                )

                VStack(spacing: 12) {
                    CarlibButton(
                        label: "Create account",
                        variant: .primary
                    ) {
                        stopTimer()
                        showSignUp = true
                    }

                    CarlibButton(
                        label: "Log in",
                        variant: .secondary
                    ) {
                        stopTimer()
                        showSignIn = true
                    }
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 24)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        }
        .preferredColorScheme(.light)
        .onAppear { startTimer() }
        .onDisappear { stopTimer() }
        .sheet(isPresented: $showSignIn) {
            NavigationStack { SignInView() }
                .presentationDetents([.large])
        }
        .sheet(isPresented: $showSignUp) {
            NavigationStack { SignUpView() }
                .presentationDetents([.large])
        }
    }

    // MARK: - Progress Bar

    private var progressBar: some View {
        HStack(spacing: 4) {
            ForEach(0..<slideCount, id: \.self) { i in
                Capsule()
                    .fill(Color.black.opacity(0.15))
                    .frame(height: 3)
                    .overlay(alignment: .leading) {
                        Capsule()
                            .fill(Color.black)
                            .scaleEffect(x: fillFraction(for: i), y: 1, anchor: .leading)
                    }
            }
        }
    }

    // MARK: - Stories Interactions

    private func goNext() {
        withAnimation(.easeInOut(duration: 0.25)) {
            if currentPage < slideCount - 1 {
                currentPage += 1
            } else {
                currentPage = 0
            }
        }
        storyProgress = 0
        restartTimer()
    }

    private func goBack() {
        withAnimation(.easeInOut(duration: 0.25)) {
            if currentPage > 0 {
                currentPage -= 1
            }
        }
        storyProgress = 0
        restartTimer()
    }

    private func pause() { isPaused = true }
    private func resume() { isPaused = false }

    // MARK: - Progress Bar Logic

    private func fillFraction(for index: Int) -> CGFloat {
        if index < currentPage { return 1 }
        if index == currentPage { return storyProgress }
        return 0
    }

    private func startTimer() {
        storyProgress = 0
        isPaused = false
        timer = Timer.scheduledTimer(withTimeInterval: 0.03, repeats: true) { _ in
            Task { @MainActor in
                guard !isPaused else { return }
                storyProgress += 0.03 / slideDuration
                if storyProgress >= 1.0 { goNext() }
            }
        }
    }

    private func restartTimer() {
        stopTimer()
        startTimer()
    }

    private func stopTimer() {
        timer?.invalidate()
        timer = nil
    }
}

#Preview {
    WelcomeCarouselView()
        .environment(AppState())
}
