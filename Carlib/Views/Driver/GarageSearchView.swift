import SwiftUI
import MapKit

/// Garage search — list/map view with search and real MapKit map.
struct GarageSearchView: View {
    @State private var searchText = ""
    @State private var viewMode: ViewMode = .list
    @State private var cameraPosition: MapCameraPosition = .region(
        MKCoordinateRegion(
            center: CLLocationCoordinate2D(latitude: 48.856, longitude: 2.370),
            span: MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05)
        )
    )

    enum ViewMode: CaseIterable {
        case list, map

        var localizedName: String {
            switch self {
            case .list: L10n.GarageSearch.modeList
            case .map: L10n.GarageSearch.modeMap
            }
        }
    }

    private var filteredGarages: [Garage] {
        if searchText.isEmpty {
            return MockData.garages
        }
        return MockData.garages.filter {
            $0.name.localizedCaseInsensitiveContains(searchText)
            || $0.address.localizedCaseInsensitiveContains(searchText)
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            Picker(L10n.GarageSearch.modeLabel, selection: $viewMode) {
                ForEach(ViewMode.allCases, id: \.self) { mode in
                    Text(mode.localizedName)
                }
            }
            .pickerStyle(.segmented)
            .padding(.horizontal, CarlibSpacing.screenHorizontal)
            .padding(.vertical, CarlibSpacing.sm)

            switch viewMode {
            case .list:
                ScrollView {
                    VStack(spacing: CarlibSpacing.sm) {
                        ForEach(filteredGarages) { garage in
                            NavigationLink(value: garage.id) {
                                GarageCardView(
                                    garage: garage,
                                    variant: .full,
                                    distance: MockData.distance(for: garage.id)
                                )
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.horizontal, CarlibSpacing.screenHorizontal)
                }

            case .map:
                Map(position: $cameraPosition) {
                    ForEach(filteredGarages) { garage in
                        Annotation(garage.name, coordinate: garage.location) {
                            NavigationLink(value: garage.id) {
                                VStack(spacing: 2) {
                                    Image(systemName: "wrench.and.screwdriver.fill")
                                        .font(.caption)
                                        .foregroundStyle(.white)
                                        .padding(8)
                                        .background(.carlibPrimaryBlue, in: Circle())

                                    Text(garage.name)
                                        .font(CarlibFont.caption(.medium))
                                        .foregroundStyle(.white)
                                        .fixedSize()
                                }
                            }
                        }
                    }
                }
                .mapStyle(.standard(elevation: .flat))
            }
        }
        .searchable(text: $searchText, prompt: Text(verbatim: L10n.GarageSearch.placeholder))
        .navigationTitle(Text(verbatim: L10n.GarageSearch.title))
        .navigationDestination(for: UUID.self) { garageId in
            if let garage = MockData.garages.first(where: { $0.id == garageId }) {
                GarageDetailView(garage: garage)
            }
        }
    }
}

#Preview {
    NavigationStack {
        GarageSearchView()
    }
    .environment(ClaimStore())
}
