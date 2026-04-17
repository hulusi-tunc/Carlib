import SwiftUI

/// Revolut-style onboarding with Instagram Stories interactions:
/// - Tap right side → next slide
/// - Tap left side → previous slide
/// - Long press → pause
/// - Auto-advances every 4 seconds
/// - Loops back to first after last
///
/// Visual: a large yellow splash graphic fills the screen, the headline sits
/// top-left, and two capsule buttons pin to the bottom. Works in both light
/// and dark mode — the splash PNG has alpha so it overlays either bg cleanly.
struct WelcomeCarouselView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var currentPage = 0
    @State private var storyProgress: CGFloat = 0
    @State private var isPaused = false
    @State private var showSignIn = false
    @State private var showSignUp = false
    @State private var timer: Timer?

    // Ambient splash animation — breathe scale + subtle rotational sway
    // to make the background feel alive. Honors Reduce Motion.
    @State private var splashScale: CGFloat = 1.10
    @State private var splashRotation: Double = -2

    // Per-slide hero illustration float — slow up/down bob so the foreground
    // artwork doesn't feel static against the breathing splash.
    @State private var heroFloat: CGFloat = -4

    private let slideDuration: TimeInterval = 4.0

    /// Per-slide content. Only slide 1 currently ships with illustrations —
    /// the rest will get their own hero assets in a later pass.
    private struct Slide {
        let headline: String
        let heroAsset: String?
        let inlineEmoji: String?  // small image beside the headline
    }

    private let slides: [Slide] = [
        Slide(
            headline: "Declare your accident in minutes",
            heroAsset: "WelcomeHero1",
            inlineEmoji: "WelcomeClipboard"
        ),
        Slide(headline: "Find a body shop nearby", heroAsset: nil, inlineEmoji: nil),
        Slide(headline: "Track repairs in real-time", heroAsset: nil, inlineEmoji: nil),
        Slide(headline: "Trusted by garages across France", heroAsset: nil, inlineEmoji: nil),
    ]

    private var slideCount: Int { slides.count }

    var body: some View {
        ZStack(alignment: .topLeading) {
            // Base screen background — adaptive.
            Color.carlibScreenBg.ignoresSafeArea()

            // Yellow splash graphic — sits behind content, full-bleed.
            // Slow breathing scale + subtle sway gives the page an ambient,
            // living feel without distracting from the content.
            Image("OnboardingSplash")
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .clipped()
                .scaleEffect(splashScale)
                .rotationEffect(.degrees(splashRotation))
                .ignoresSafeArea()
                .allowsHitTesting(false)
                .accessibilityHidden(true)
                .onAppear(perform: startSplashAnimation)

            VStack(alignment: .leading, spacing: 0) {
                // ── Stories progress bar ──
                progressBar
                    .padding(.horizontal, 24)
                    .padding(.top, 12)

                // ── Header: "Welcome to" + inline yellow Carlib wordmark ──
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

                // ── Headline — left-aligned, updates per slide ──
                // For slides with an inlineEmoji, we concatenate a trailing
                // Text(Image) into the headline so the image flows with the
                // last word and wraps naturally — giving us a true inline
                // glyph next to "minutes" rather than a sibling in an HStack.
                // The image's rendered size is determined by its asset scale
                // (2x → 32pt tall), which is set in Contents.json.
                headlineText
                    .font(.custom("Aeonik-Medium", size: 34))
                    .foregroundStyle(.carlibDark)
                    .lineLimit(nil)
                    .multilineTextAlignment(.leading)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 24)
                    .padding(.top, 12)

                // ── Hero illustration (slide-specific) ──
                // Fixed-height slot so the gesture layer below it gets the rest.
                // Only slide 1 currently has an asset; other slides render an
                // empty Spacer of the same height so the layout doesn't jump.
                Group {
                    if let hero = slides[currentPage].heroAsset {
                        Image(hero)
                            .resizable()
                            .scaledToFit()
                            .frame(maxWidth: .infinity)
                            .frame(height: 320)
                            .offset(y: heroFloat)
                            .accessibilityHidden(true)
                            .transition(.opacity)
                            .id(currentPage) // re-animate on slide change
                    } else {
                        Color.clear.frame(height: 320)
                    }
                }
                .frame(maxWidth: .infinity)
                .padding(.top, 28)
                .onAppear(perform: startHeroFloat)

                // ── Invisible gesture layer filling remaining space ──
                // Fills the middle so tap/long-press work on the splash area
                // without stealing taps from progress bars, header, or buttons.
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

                // ── Persistent auth buttons ──
                VStack(spacing: 12) {
                    Button {
                        stopTimer()
                        showSignUp = true
                    } label: {
                        Text(verbatim: L10n.Auth.createAccount)
                            .font(CarlibFont.body(.medium))
                            .foregroundStyle(colorScheme == .dark ? .black : .white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 54)
                            .background(Color.carlibDark, in: Capsule())
                    }

                    Button {
                        stopTimer()
                        showSignIn = true
                    } label: {
                        Text(verbatim: "Log in")
                            .font(CarlibFont.body(.medium))
                            .foregroundStyle(.carlibDark)
                            .frame(maxWidth: .infinity)
                            .frame(height: 54)
                            .background(Color.tileSecondary, in: Capsule())
                    }
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 24)
            }
        }
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

    // MARK: - Headline with Inline Emoji
    // Text concatenation lets the inline image behave as a glyph that wraps
    // with the last word of the headline. Two Text values joined with `+`
    // share their parent's `.font()`, `.foregroundStyle()`, and line layout.
    private var headlineText: Text {
        let slide = slides[currentPage]
        let base = Text(verbatim: slide.headline)
        if let emoji = slide.inlineEmoji {
            return base + Text(verbatim: " ") + Text(Image(emoji))
        }
        return base
    }

    // MARK: - Progress Bar
    // Single outer GeometryReader computes the total width, then each bar gets an
    // explicit width so the HStack layout is deterministic (nesting GeometryReader
    // inside a ForEach confuses HStack distribution).
    private var progressBar: some View {
        GeometryReader { geo in
            let spacing: CGFloat = 4
            let totalSpacing = spacing * CGFloat(slideCount - 1)
            let barWidth = max(0, (geo.size.width - totalSpacing) / CGFloat(slideCount))

            HStack(spacing: spacing) {
                ForEach(0..<slideCount, id: \.self) { i in
                    ZStack(alignment: .leading) {
                        Capsule()
                            .fill(Color.carlibDark.opacity(0.15))
                            .frame(width: barWidth, height: 3)
                        Capsule()
                            .fill(Color.carlibDark)
                            .frame(width: barWidth * fillFraction(for: i), height: 3)
                    }
                }
            }
        }
        .frame(height: 3)
    }

    // MARK: - Ambient Splash Animation

    /// Starts the slow breathing + sway on the splash background.
    /// - Scale oscillates 1.10 → 1.18 (subtle zoom)
    /// - Rotation oscillates -2° → +2° (gentle sway)
    /// - Duration 7s per half-cycle, 14s full cycle, eased both ways
    /// - Reduce Motion: holds a single mid-scale pose with no animation.
    private func startSplashAnimation() {
        if reduceMotion {
            splashScale = 1.14
            splashRotation = 0
            return
        }
        withAnimation(.easeInOut(duration: 7).repeatForever(autoreverses: true)) {
            splashScale = 1.18
            splashRotation = 2
        }
    }

    /// Slow float on the per-slide hero illustration — gentle bob up and
    /// down, 4s per half-cycle. Honors Reduce Motion.
    private func startHeroFloat() {
        if reduceMotion {
            heroFloat = 0
            return
        }
        withAnimation(.easeInOut(duration: 4).repeatForever(autoreverses: true)) {
            heroFloat = 4
        }
    }

    // MARK: - Stories Interactions

    private func goNext() {
        withAnimation(.easeInOut(duration: 0.25)) {
            if currentPage < slideCount - 1 {
                currentPage += 1
            } else {
                currentPage = 0 // loop
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

    private func pause() {
        isPaused = true
    }

    private func resume() {
        isPaused = false
    }

    // MARK: - Progress Bar Logic

    private func fillFraction(for index: Int) -> CGFloat {
        if index < currentPage {
            return 1
        } else if index == currentPage {
            return storyProgress
        } else {
            return 0
        }
    }

    private func startTimer() {
        storyProgress = 0
        isPaused = false
        timer = Timer.scheduledTimer(withTimeInterval: 0.03, repeats: true) { _ in
            Task { @MainActor in
                guard !isPaused else { return }

                storyProgress += 0.03 / slideDuration

                if storyProgress >= 1.0 {
                    goNext()
                }
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

#Preview("Light") {
    WelcomeCarouselView()
        .environment(AppState())
        .preferredColorScheme(.light)
}

#Preview("Dark") {
    WelcomeCarouselView()
        .environment(AppState())
        .preferredColorScheme(.dark)
}
