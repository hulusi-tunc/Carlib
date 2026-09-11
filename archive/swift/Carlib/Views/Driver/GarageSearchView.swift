import SwiftUI
import MapKit

/// Collapsed panel height — sized to fit drag handle + search + header +
/// carousel card + page indicator dots with minimal slack.
private let kCollapsedPanelHeight: CGFloat = 300

/// Fixed card height so the carousel ScrollView doesn't inherit extra
/// vertical space from the panel.
private let kCarouselCardHeight: CGFloat = 118

/// Shops tab — full-screen map with an in-view bottom drawer.
///
/// The drawer is a custom floating panel (not a `.sheet`) so it sits ABOVE
/// the TabView's tab bar at the collapsed detent — a native sheet always
/// anchors to the screen bottom and would cover the tab bar.
///
/// Collapsed: a Liquid-Glass floating card hovering over the map, leaving
/// the tab bar visible and tappable.
/// Expanded: a full-screen opaque surface that hides the tab bar.
struct GarageSearchView: View {
    private let garages = MockData.garages

    @State private var selectedGarageId: UUID?
    @State private var panelState: PanelState = .collapsed
    /// Live translation from the drag handle. Lets the panel follow the
    /// finger during a drag (not just snap on release) — which is what
    /// gives the native-sheet feel.
    @State private var dragOffset: CGFloat = 0
    @State private var cameraPosition: MapCameraPosition = .region(
        MKCoordinateRegion(
            center: CLLocationCoordinate2D(latitude: 48.856, longitude: 2.370),
            span: MKCoordinateSpan(latitudeDelta: 0.035, longitudeDelta: 0.035)
        )
    )

    var body: some View {
        GeometryReader { proxy in
            let expandedHeight = proxy.size.height
                + proxy.safeAreaInsets.top
                + proxy.safeAreaInsets.bottom

            let restingHeight: CGFloat = panelState == .expanded
                ? expandedHeight
                : kCollapsedPanelHeight
            let liveHeight = min(
                expandedHeight,
                max(kCollapsedPanelHeight, restingHeight - dragOffset)
            )

            // Content flips to the list view as soon as the user has dragged
            // past the midpoint — so during a drag-up the carousel transforms
            // into the full list mid-gesture, not only after release.
            let contentMidpoint = (kCollapsedPanelHeight + expandedHeight) / 2
            let isContentExpanded = liveHeight > contentMidpoint

            ZStack(alignment: .bottom) {
                Map(position: $cameraPosition) {
                    ForEach(garages) { garage in
                        Annotation(garage.name, coordinate: garage.location, anchor: .bottom) {
                            Button {
                                focus(garageId: garage.id)
                            } label: {
                                pinLabel(for: garage)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
                .mapStyle(.standard(elevation: .flat))
                .mapControlVisibility(.hidden)
                .ignoresSafeArea()

                ShopsBottomPanel(
                    garages: garages,
                    selectedGarageId: $selectedGarageId,
                    panelState: $panelState,
                    dragOffset: $dragOffset,
                    collapsedHeight: kCollapsedPanelHeight,
                    expandedHeight: expandedHeight,
                    isContentExpanded: isContentExpanded,
                    topSafeInset: proxy.safeAreaInsets.top,
                    bottomSafeInset: proxy.safeAreaInsets.bottom
                )
                .frame(height: liveHeight)
                .padding(.horizontal, panelState == .expanded ? 0 : 12)
                .padding(.bottom, panelState == .expanded ? 0 : 10)
                .ignoresSafeArea(edges: panelState == .expanded ? [.top, .bottom] : [])
            }
        }
        .toolbar(.hidden, for: .navigationBar)
        .toolbar(panelState == .expanded ? .hidden : .visible, for: .tabBar)
        .onAppear {
            if selectedGarageId == nil {
                selectedGarageId = garages.first?.id
            }
        }
        .onChange(of: selectedGarageId) { _, newId in
            guard let id = newId, let garage = garages.first(where: { $0.id == id }) else { return }
            withAnimation(.easeInOut(duration: 0.4)) {
                cameraPosition = .region(
                    MKCoordinateRegion(
                        center: garage.location,
                        span: MKCoordinateSpan(latitudeDelta: 0.012, longitudeDelta: 0.012)
                    )
                )
            }
        }
    }

    private func focus(garageId: UUID) {
        withAnimation(.spring(response: 0.38, dampingFraction: 0.84)) {
            selectedGarageId = garageId
            if panelState == .expanded {
                panelState = .collapsed
            }
        }
    }

    private func pinLabel(for garage: Garage) -> some View {
        let isSelected = garage.id == selectedGarageId
        return ZStack {
            Circle()
                .fill(isSelected ? Color.brandYellow : Color.carlibScreenBg)
                .frame(width: isSelected ? 44 : 34, height: isSelected ? 44 : 34)
                .overlay {
                    Circle()
                        .strokeBorder(
                            isSelected ? Color.clear : Color.brandYellow,
                            lineWidth: 2
                        )
                }
            RemixIcon.toolsFill.view(
                size: isSelected ? 18 : 14,
                color: isSelected ? .black : .brandYellow
            )
        }
        .shadow(color: .black.opacity(0.35), radius: 6, y: 2)
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: isSelected)
    }
}

enum PanelState {
    case collapsed
    case expanded
}

// MARK: - Panel Surface
//
// Collapsed: iOS 26 Liquid Glass floating card over the map, matching the
// Apple Maps / Weather / Music panels. Expanded: opaque full-screen surface.
private struct PanelSurface: ViewModifier {
    let isExpanded: Bool

    func body(content: Content) -> some View {
        if isExpanded {
            content
                .background(Color.carlibScreenBg)
        } else {
            content
                .glassEffect(
                    .regular,
                    in: .rect(cornerRadius: 24, style: .continuous)
                )
                .shadow(color: .black.opacity(0.20), radius: 18, y: 4)
        }
    }
}

// MARK: - Bottom Panel

private struct ShopsBottomPanel: View {
    @Environment(ClaimStore.self) private var claimStore

    let garages: [Garage]
    @Binding var selectedGarageId: UUID?
    @Binding var panelState: PanelState
    @Binding var dragOffset: CGFloat
    let collapsedHeight: CGFloat
    let expandedHeight: CGFloat
    /// Whether the visible content should be the list. Driven by live drag
    /// height (not `panelState`), so the content flips mid-gesture.
    let isContentExpanded: Bool
    var topSafeInset: CGFloat = 0
    var bottomSafeInset: CGFloat = 0

    @State private var searchText = ""
    @State private var navigationPath = NavigationPath()

    private var isExpanded: Bool { isContentExpanded }
    private var isSurfaceExpanded: Bool { panelState == .expanded }

    private var filteredGarages: [Garage] {
        guard !searchText.isEmpty else { return garages }
        let query = searchText.trimmingCharacters(in: .whitespaces)
        return garages.filter {
            $0.name.localizedCaseInsensitiveContains(query)
            || $0.address.localizedCaseInsensitiveContains(query)
        }
    }

    var body: some View {
        NavigationStack(path: $navigationPath) {
            VStack(spacing: 0) {
                if isExpanded {
                    navBar
                } else {
                    dragHandle
                }

                searchField
                    .padding(.horizontal, 20)
                    .padding(.top, 4)
                    .padding(.bottom, 6)

                if isExpanded {
                    listView
                } else {
                    carouselView
                }
            }
            .padding(.top, isExpanded ? topSafeInset : 0)
            .navigationDestination(for: UUID.self) { garageId in
                if let garage = garages.first(where: { $0.id == garageId }) {
                    GarageDetailView(garage: garage)
                        .environment(claimStore)
                } else {
                    ContentUnavailableView {
                        Label {
                            Text(verbatim: "Shop not found")
                        } icon: {
                            RemixIcon.storeLine.view(size: 48, color: .carlibSecondary)
                        }
                    } description: {
                        Text(verbatim: "This body shop is no longer available.")
                    }
                    .background(Color.carlibScreenBg)
                }
            }
            .toolbar(.hidden, for: .navigationBar)
        }
        .tint(.carlibDark)
        // Surface (glass vs opaque) follows the *settled* state, not the
        // live drag — we don't want the glass effect popping on/off mid-drag.
        .modifier(PanelSurface(isExpanded: isSurfaceExpanded))
        .onChange(of: searchText) { _, _ in
            if let id = selectedGarageId,
               !filteredGarages.contains(where: { $0.id == id }) {
                selectedGarageId = filteredGarages.first?.id
            }
        }
        .onChange(of: navigationPath.count) { _, count in
            if count > 0 && panelState != .expanded {
                withAnimation(.spring(response: 0.38, dampingFraction: 0.84)) {
                    panelState = .expanded
                }
            }
        }
    }

    // MARK: - Nav bar (expanded state)
    //
    // Matches the app's standard pushed-screen header: a circular chevron
    // back button on the left and a centered, semibold title. No hairline.
    private var navBar: some View {
        ZStack {
            Text(verbatim: "Body shops")
                .font(CarlibFont.title3())
                .foregroundStyle(.carlibDark)

            HStack {
                Button {
                    withAnimation(.spring(response: 0.38, dampingFraction: 0.84)) {
                        panelState = .collapsed
                    }
                } label: {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundStyle(.carlibDark)
                        .frame(width: 36, height: 36)
                        .background(Color.tileSecondary, in: Circle())
                }
                .buttonStyle(.pressable(scale: 0.94, haptic: .light))

                Spacer()
            }
        }
        .frame(height: 44)
        .padding(.horizontal, 16)
    }

    // MARK: - Drag handle (system-style grabber)

    private var dragHandle: some View {
        VStack(spacing: 0) {
            Capsule()
                .fill(Color.carlibLabel.opacity(0.45))
                .frame(width: 36, height: 5)
                .padding(.top, 8)
                .padding(.bottom, 8)
        }
        .frame(maxWidth: .infinity)
        .contentShape(Rectangle())
        .onTapGesture {
            guard navigationPath.isEmpty else { return }
            withAnimation(.spring(response: 0.38, dampingFraction: 0.84)) {
                panelState = isExpanded ? .collapsed : .expanded
            }
        }
        .gesture(
            DragGesture(minimumDistance: 0, coordinateSpace: .local)
                .onChanged { value in
                    guard navigationPath.isEmpty else { return }
                    dragOffset = value.translation.height
                }
                .onEnded { value in
                    guard navigationPath.isEmpty else { return }
                    let translation = value.translation.height
                    let velocity = value.velocity.height
                    let shouldCollapse: Bool
                    if velocity > 500 {
                        shouldCollapse = true
                    } else if velocity < -500 {
                        shouldCollapse = false
                    } else if isExpanded {
                        shouldCollapse = translation > (expandedHeight - collapsedHeight) / 2
                    } else {
                        shouldCollapse = translation > -(expandedHeight - collapsedHeight) / 2
                    }

                    withAnimation(.spring(response: 0.38, dampingFraction: 0.84)) {
                        panelState = shouldCollapse ? .collapsed : .expanded
                        dragOffset = 0
                    }
                }
        )
    }

    // MARK: - Search field

    private var searchField: some View {
        HStack(spacing: 10) {
            RemixIcon.searchLine.view(size: 16, color: .carlibLabel)
            TextField(text: $searchText) {
                Text(verbatim: "Search shops")
                    .foregroundStyle(.carlibLabel)
            }
            .font(CarlibFont.body())
            .foregroundStyle(.carlibDark)
            .textInputAutocapitalization(.never)
            .autocorrectionDisabled()
            .submitLabel(.search)

            if !searchText.isEmpty {
                Button {
                    searchText = ""
                } label: {
                    RemixIcon.closeCircleFill.view(size: 16, color: .carlibLabel)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 14)
        .frame(height: 44)
        .background(Color.tileSecondary.opacity(0.6), in: Capsule())
    }

    // MARK: - Collapsed: horizontal paging carousel

    private var carouselView: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(verbatim: "\(filteredGarages.count) shop\(filteredGarages.count == 1 ? "" : "s") nearby")
                    .font(CarlibFont.caption(.medium))
                    .tracking(1.2)
                    .textCase(.uppercase)
                    .foregroundStyle(.carlibLabel)
                Spacer()
                Button {
                    withAnimation(.spring(response: 0.38, dampingFraction: 0.84)) {
                        panelState = .expanded
                    }
                } label: {
                    HStack(spacing: 4) {
                        Text(verbatim: "List")
                            .font(CarlibFont.caption(.medium))
                        RemixIcon.arrowUpSLine.view(size: 12, color: .carlibLabel)
                    }
                    .foregroundStyle(.carlibLabel)
                }
            }
            .padding(.horizontal, 20)

            if filteredGarages.isEmpty {
                emptyResults
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    LazyHStack(spacing: 12) {
                        ForEach(filteredGarages) { garage in
                            Button {
                                openDetail(garageId: garage.id)
                            } label: {
                                CarouselGarageCard(garage: garage)
                            }
                            .buttonStyle(.plain)
                            .containerRelativeFrame(.horizontal)
                            .id(garage.id)
                        }
                    }
                    .scrollTargetLayout()
                }
                .frame(height: kCarouselCardHeight)
                .scrollTargetBehavior(.viewAligned)
                .scrollPosition(id: $selectedGarageId)
                .contentMargins(.horizontal, 20, for: .scrollContent)

                pageDots
            }
        }
    }

    @ViewBuilder
    private var pageDots: some View {
        if filteredGarages.count > 1 {
            HStack(spacing: 6) {
                ForEach(filteredGarages) { garage in
                    let isActive = garage.id == selectedGarageId
                    Capsule()
                        .fill(isActive ? Color.carlibDark : Color.carlibLabel.opacity(0.3))
                        .frame(width: isActive ? 16 : 6, height: 6)
                        .animation(.easeInOut(duration: 0.2), value: selectedGarageId)
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.top, 6)
            .padding(.bottom, 14)
        }
    }

    // MARK: - Expanded: vertical list

    private var listView: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(verbatim: "\(filteredGarages.count) shop\(filteredGarages.count == 1 ? "" : "s") found")
                .font(CarlibFont.footnote())
                .foregroundStyle(.carlibSecondary)
                .padding(.horizontal, 20)
                .padding(.top, 10)
                .padding(.bottom, 12)

            if filteredGarages.isEmpty {
                emptyResults
                    .padding(.top, 40)
                Spacer()
            } else {
                ScrollView {
                    LazyVStack(spacing: 10) {
                        ForEach(filteredGarages) { garage in
                            Button {
                                selectedGarageId = garage.id
                                openDetail(garageId: garage.id)
                            } label: {
                                ListGarageRow(
                                    garage: garage,
                                    isSelected: garage.id == selectedGarageId
                                )
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 24 + bottomSafeInset)
                }
            }
        }
    }

    private var emptyResults: some View {
        VStack(spacing: 10) {
            RemixIcon.searchEyeLine.view(size: 28, color: .carlibLabel)
            Text(verbatim: "No shops match")
                .font(CarlibFont.body(.medium))
                .foregroundStyle(.carlibDark)
            Text(verbatim: "Try a different name or neighbourhood.")
                .font(CarlibFont.footnote())
                .foregroundStyle(.carlibSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 24)
    }

    private func openDetail(garageId: UUID) {
        withAnimation(.spring(response: 0.38, dampingFraction: 0.84)) {
            panelState = .expanded
        }
        navigationPath.append(garageId)
    }
}

// MARK: - Carousel card (collapsed state)

private struct CarouselGarageCard: View {
    let garage: Garage

    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            DummyImage(
                kind: .garage,
                seed: garage.id.uuidString,
                pixelWidth: 300,
                pixelHeight: 300
            )
            .frame(width: 90, height: 90)
            .clipShape(RoundedRectangle(cornerRadius: 12))

            VStack(alignment: .leading, spacing: 6) {
                Text(verbatim: garage.name)
                    .font(CarlibFont.body(.medium))
                    .foregroundStyle(.carlibDark)
                    .lineLimit(1)

                HStack(spacing: 6) {
                    RemixIcon.mapPinLine.view(size: 12, color: .carlibSecondary)
                    Text(verbatim: String(format: "%.1f km", MockData.distance(for: garage.id)))
                        .font(CarlibFont.footnote())
                        .foregroundStyle(.carlibSecondary)
                }

                HStack(spacing: 6) {
                    Circle()
                        .fill(garage.isAvailable ? Color.statusCompleted : Color.statusCancelled)
                        .frame(width: 6, height: 6)
                    Text(verbatim: garage.isAvailable ? "Available" : "Unavailable")
                        .font(CarlibFont.footnote())
                        .foregroundStyle(.carlibSecondary)
                }

                Spacer(minLength: 0)

                Text(verbatim: garage.address.components(separatedBy: ",").last?.trimmingCharacters(in: .whitespaces) ?? "")
                    .font(CarlibFont.footnote())
                    .foregroundStyle(.carlibLabel)
                    .lineLimit(1)
            }
            .frame(maxHeight: .infinity, alignment: .top)

            Spacer(minLength: 0)

            RemixIcon.arrowRightSLine.view(size: 18, color: .carlibLabel)
        }
        .padding(14)
        .frame(height: 118)
        .background(Color.tileSecondary.opacity(0.6), in: RoundedRectangle(cornerRadius: 16))
        .overlay {
            RoundedRectangle(cornerRadius: 16)
                .strokeBorder(Color.carlibCardBorder, lineWidth: 1)
        }
    }
}

// MARK: - List row (expanded state)

private struct ListGarageRow: View {
    let garage: Garage
    let isSelected: Bool

    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            DummyImage(
                kind: .garage,
                seed: garage.id.uuidString,
                pixelWidth: 240,
                pixelHeight: 240
            )
            .frame(width: 72, height: 72)
            .clipShape(RoundedRectangle(cornerRadius: 12))

            VStack(alignment: .leading, spacing: 4) {
                Text(verbatim: garage.name)
                    .font(CarlibFont.body(.medium))
                    .foregroundStyle(.carlibDark)
                    .lineLimit(1)

                HStack(spacing: 6) {
                    RemixIcon.mapPinLine.view(size: 11, color: .carlibSecondary)
                    Text(verbatim: String(format: "%.1f km", MockData.distance(for: garage.id)))
                        .font(CarlibFont.footnote())
                        .foregroundStyle(.carlibSecondary)
                }

                Text(verbatim: garage.address)
                    .font(CarlibFont.footnote())
                    .foregroundStyle(.carlibSecondary)
                    .lineLimit(1)

                HStack(spacing: 6) {
                    Circle()
                        .fill(garage.isAvailable ? Color.statusCompleted : Color.statusCancelled)
                        .frame(width: 6, height: 6)
                    Text(verbatim: garage.isAvailable ? "Available" : "Unavailable")
                        .font(CarlibFont.footnote())
                        .foregroundStyle(.carlibSecondary)
                }
            }

            Spacer(minLength: 0)
        }
        .padding(12)
        .background(
            isSelected
                ? Color.brandYellow.opacity(0.12)
                : Color.tileSecondary.opacity(0.6),
            in: RoundedRectangle(cornerRadius: 14)
        )
        .overlay {
            RoundedRectangle(cornerRadius: 14)
                .strokeBorder(
                    isSelected ? Color.brandYellow : Color.carlibCardBorder,
                    lineWidth: isSelected ? 1.5 : 1
                )
        }
    }
}

#Preview {
    NavigationStack {
        GarageSearchView()
    }
    .environment(AppState())
    .environment(ClaimStore())
}
