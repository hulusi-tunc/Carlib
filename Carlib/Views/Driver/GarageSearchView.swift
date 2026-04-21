import SwiftUI
import MapKit

/// Small detent height — sized to fit search + carousel card + page dots.
private let kSmallDetentHeight: CGFloat = 300

/// Fixed card height so the carousel ScrollView doesn't inherit extra
/// vertical space from the panel.
private let kCarouselCardHeight: CGFloat = 118

/// Shops tab — full-screen map with a native iOS `.sheet` overlay.
///
/// Uses `.presentationDetents` for Apple-Maps-style snap physics and a native
/// drag indicator. At the small detent the map is interactive (`presentation
/// BackgroundInteraction`); at `.large` the sheet fully covers the screen —
/// including the TabView's tab bar, since that's standard iOS sheet behavior.
struct GarageSearchView: View {
    private let garages = MockData.garages

    @State private var selectedGarageId: UUID?
    @State private var selectedDetent: PresentationDetent = .height(kSmallDetentHeight)
    @State private var sheetPresented = true
    @State private var cameraPosition: MapCameraPosition = .region(
        MKCoordinateRegion(
            center: CLLocationCoordinate2D(latitude: 48.856, longitude: 2.370),
            span: MKCoordinateSpan(latitudeDelta: 0.035, longitudeDelta: 0.035)
        )
    )

    var body: some View {
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
        .toolbar(.hidden, for: .navigationBar)
        .sheet(isPresented: $sheetPresented) {
            ShopsSheetContent(
                garages: garages,
                selectedGarageId: $selectedGarageId,
                selectedDetent: $selectedDetent
            )
            .presentationDetents(
                [.height(kSmallDetentHeight), .large],
                selection: $selectedDetent
            )
            .presentationDragIndicator(.visible)
            .presentationBackgroundInteraction(
                .enabled(upThrough: .height(kSmallDetentHeight))
            )
            .presentationContentInteraction(.scrolls)
            .interactiveDismissDisabled()
        }
        .onAppear {
            sheetPresented = true
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
        selectedGarageId = garageId
        if selectedDetent == .large {
            withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                selectedDetent = .height(kSmallDetentHeight)
            }
        }
    }

    /// Custom map pin. Highlights when selected.
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

// MARK: - Sheet Content

private struct ShopsSheetContent: View {
    let garages: [Garage]
    @Binding var selectedGarageId: UUID?
    @Binding var selectedDetent: PresentationDetent

    @State private var searchText = ""
    @State private var navigationPath = NavigationPath()

    private var isExpanded: Bool { selectedDetent == .large }

    /// Filter garages by name or address. Selection always refers to an ID in
    /// the filtered list; if the selected garage falls out of the filter, the
    /// scroll position snaps to the first filtered result via `onChange`.
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
                searchField
                    .padding(.horizontal, 20)
                    .padding(.top, 6)
                    .padding(.bottom, 6)

                if isExpanded {
                    listView
                } else {
                    carouselView
                }
            }
            .background(Color.carlibScreenBg)
            .navigationDestination(for: UUID.self) { garageId in
                if let garage = garages.first(where: { $0.id == garageId }) {
                    GarageDetailView(garage: garage)
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
        .onChange(of: searchText) { _, _ in
            if let id = selectedGarageId,
               !filteredGarages.contains(where: { $0.id == id }) {
                selectedGarageId = filteredGarages.first?.id
            }
        }
        .onChange(of: navigationPath.count) { _, count in
            // When a detail view is pushed, expand the sheet so the pushed
            // view has full vertical space.
            if count > 0 && selectedDetent != .large {
                withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                    selectedDetent = .large
                }
            }
        }
    }

    // MARK: - Search field (custom, not native `.searchable`)

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

    // MARK: - Small detent: horizontal paging carousel

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
                    withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                        selectedDetent = .large
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

    /// Small dot row below the carousel so the user can see there are more
    /// cards to swipe through.
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

    // MARK: - Large detent: vertical list

    private var listView: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text(verbatim: "Body shops")
                    .font(CarlibFont.title2())
                    .foregroundStyle(.carlibDark)
                Spacer()
                Button {
                    withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                        selectedDetent = .height(kSmallDetentHeight)
                    }
                } label: {
                    HStack(spacing: 4) {
                        RemixIcon.mapPinLine.view(size: 14, color: .carlibLabel)
                        Text(verbatim: "Map")
                            .font(CarlibFont.caption(.medium))
                    }
                    .foregroundStyle(.carlibLabel)
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 4)
            .padding(.bottom, 6)

            Text(verbatim: "\(filteredGarages.count) shop\(filteredGarages.count == 1 ? "" : "s") found")
                .font(CarlibFont.footnote())
                .foregroundStyle(.carlibSecondary)
                .padding(.horizontal, 20)
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
                    .padding(.bottom, 40)
                }
            }
        }
    }

    // MARK: - Empty results

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

    // MARK: - Navigation helper

    /// Expands the sheet so the detail view has full vertical space, then
    /// pushes onto the nav stack.
    private func openDetail(garageId: UUID) {
        withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
            selectedDetent = .large
        }
        navigationPath.append(garageId)
    }
}

// MARK: - Carousel card (small detent)

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

// MARK: - List row (large detent)

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
    .environment(ClaimStore())
}
