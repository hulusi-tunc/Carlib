import SwiftUI
import PhotosUI
import CoreLocation

/// Guided accident declaration — 4 steps.
struct DeclarationFlowView: View {
    @Environment(ClaimStore.self) private var claimStore
    @State private var currentStep = 1
    @State private var selectedType: AccidentType?
    @State private var licensePlate = ""
    @State private var brand = ""
    @State private var model = ""
    @State private var year = ""
    @State private var color = ""
    @State private var showConfirmation = false

    // Photo state
    @State private var selectedPhotos: [PhotosPickerItem] = []
    @State private var photoImages: [UIImage] = []

    private let totalSteps = 4

    var body: some View {
        VStack(spacing: 0) {
                ProgressView(value: Double(currentStep), total: Double(totalSteps))
                    .tint(.brandYellow)
                    .padding(.horizontal, CarlibSpacing.screenHorizontal)
                    .padding(.top, CarlibSpacing.sm)

                Text(verbatim: L10n.Declaration.stepProgress(currentStep, totalSteps))
                    .font(CarlibFont.caption(.medium))
                    .foregroundStyle(.secondary)
                    .padding(.top, CarlibSpacing.xxs)

                ScrollView {
                    Group {
                        switch currentStep {
                        case 1: stepTypeView
                        case 2: stepPhotosView
                        case 3: stepVehicleView
                        case 4: stepSummaryView
                        default: EmptyView()
                        }
                    }
                    .padding(.top, CarlibSpacing.xl)
                    .padding(.horizontal, CarlibSpacing.screenHorizontal)
                }
                .animation(.easeInOut(duration: 0.25), value: currentStep)

                HStack(spacing: CarlibSpacing.md) {
                    if currentStep > 1 {
                        CarlibButton(label: L10n.Declaration.back, variant: .secondary) {
                            currentStep -= 1
                        }
                    }
                    Spacer()
                    CarlibButton(
                        label: currentStep < totalSteps ? L10n.Declaration.next : L10n.Declaration.submit,
                        variant: .primary
                    ) {
                        if currentStep < totalSteps {
                            currentStep += 1
                        } else {
                            submitClaim()
                        }
                    }
                }
                .padding(CarlibSpacing.screenHorizontal)
            }
            .navigationTitle(Text(verbatim: L10n.Declaration.title))
            .navigationBarTitleDisplayMode(.inline)
            .fullScreenCover(isPresented: $showConfirmation) {
                DeclarationConfirmationView()
            }
    }

    private func submitClaim() {
        let photos = photoImages.map { image in
            PhotoAttachment(imageData: image.jpegData(compressionQuality: 0.7), caption: "")
        }
        let vehicleInfo = VehicleInfo(
            licensePlate: licensePlate,
            brand: brand,
            model: model,
            year: Int(year),
            color: color
        )
        let claim = Claim(
            status: .submitted,
            accidentType: selectedType,
            description: selectedType?.localizedName ?? "",
            photos: photos,
            vehicleInfo: vehicleInfo,
            createdAt: .now,
            updatedAt: .now
        )
        claimStore.addClaim(claim)
        showConfirmation = true
    }

    // MARK: - Step 1: Type

    private var stepTypeView: some View {
        VStack(alignment: .leading, spacing: CarlibSpacing.lg) {
            Text(verbatim: L10n.Declaration.step1Title)
                .font(CarlibFont.headingMedium())
            Text(verbatim: L10n.Declaration.step1Subtitle)
                .font(CarlibFont.bodyMedium())
                .foregroundStyle(.secondary)

            LazyVGrid(columns: [.init(), .init()], spacing: CarlibSpacing.sm) {
                ForEach(AccidentType.allCases, id: \.self) { type in
                    Button {
                        selectedType = type
                    } label: {
                        VStack(spacing: CarlibSpacing.xs) {
                            Image(systemName: type.iconName)
                                .font(.title2)
                            Text(type.localizedName)
                                .font(CarlibFont.bodySmall(.medium))
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 100)
                        .background(
                            selectedType == type ? Color.brandYellowLight : Color.tileSecondary,
                            in: RoundedRectangle(cornerRadius: CarlibRadius.md)
                        )
                        .overlay {
                            RoundedRectangle(cornerRadius: CarlibRadius.md)
                                .strokeBorder(
                                    selectedType == type ? Color.brandYellow : .clear,
                                    lineWidth: 2
                                )
                        }
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    // MARK: - Step 2: Photos

    private var stepPhotosView: some View {
        VStack(alignment: .leading, spacing: CarlibSpacing.lg) {
            Text(verbatim: L10n.Declaration.step2Title)
                .font(CarlibFont.headingMedium())
            Text(verbatim: L10n.Declaration.step2Subtitle)
                .font(CarlibFont.bodyMedium())
                .foregroundStyle(.secondary)

            LazyVGrid(columns: [.init(), .init()], spacing: CarlibSpacing.sm) {
                // Photo picker button
                PhotosPicker(
                    selection: $selectedPhotos,
                    maxSelectionCount: 8,
                    matching: .images
                ) {
                    VStack(spacing: CarlibSpacing.xs) {
                        Image(systemName: "camera.fill")
                            .font(.title)
                            .foregroundStyle(.brandYellow)
                        Text(verbatim: L10n.Declaration.photosAdd)
                            .font(CarlibFont.caption(.medium))
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 120)
                    .background {
                        RoundedRectangle(cornerRadius: CarlibRadius.md)
                            .strokeBorder(style: StrokeStyle(lineWidth: 2, dash: [8]))
                            .foregroundStyle(Color.carlibCardBorder)
                    }
                }

                // Display selected photos or placeholders
                ForEach(0..<3, id: \.self) { index in
                    if index < photoImages.count {
                        Image(uiImage: photoImages[index])
                            .resizable()
                            .scaledToFill()
                            .frame(height: 120)
                            .clipShape(RoundedRectangle(cornerRadius: CarlibRadius.md))
                    } else {
                        RoundedRectangle(cornerRadius: CarlibRadius.md)
                            .fill(Color.tileSecondary)
                            .frame(height: 120)
                            .overlay {
                                Image(systemName: "photo")
                                    .font(.title2)
                                    .foregroundStyle(.carlibSecondary)
                            }
                    }
                }
            }
            .onChange(of: selectedPhotos) { _, newItems in
                Task {
                    photoImages.removeAll()
                    for item in newItems {
                        if let data = try? await item.loadTransferable(type: Data.self),
                           let image = UIImage(data: data) {
                            photoImages.append(image)
                        }
                    }
                }
            }

            Text(verbatim: L10n.Declaration.photosHint)
                .font(CarlibFont.caption())
                .foregroundStyle(.secondary)
        }
    }

    // MARK: - Step 3: Vehicle

    private var stepVehicleView: some View {
        VStack(alignment: .leading, spacing: CarlibSpacing.lg) {
            Text(verbatim: L10n.Declaration.step3Title)
                .font(CarlibFont.headingMedium())
            Text(verbatim: L10n.Declaration.step3Subtitle)
                .font(CarlibFont.bodyMedium())
                .foregroundStyle(.secondary)

            VStack(spacing: CarlibSpacing.md) {
                fieldRow(label: L10n.Declaration.vehiclePlate, placeholder: "AA-123-BB", text: $licensePlate)
                fieldRow(label: L10n.Declaration.vehicleBrand, placeholder: "Renault", text: $brand)
                fieldRow(label: L10n.Declaration.vehicleModel, placeholder: "Clio V", text: $model)
                fieldRow(label: L10n.Declaration.vehicleYear, placeholder: "2021", text: $year)
                fieldRow(label: L10n.Declaration.vehicleColor, placeholder: "Gris Platine", text: $color)
            }
        }
    }

    private func fieldRow(label: String, placeholder: String, text: Binding<String>) -> some View {
        VStack(alignment: .leading, spacing: CarlibSpacing.xxs) {
            Text(verbatim: label)
                .font(CarlibFont.caption(.medium))
                .foregroundStyle(.secondary)
            TextField(placeholder, text: text)
                .font(CarlibFont.bodyLarge())
                .padding(CarlibSpacing.sm)
                .background(Color.tileSecondary, in: RoundedRectangle(cornerRadius: CarlibRadius.sm))
        }
    }

    // MARK: - Step 4: Summary

    private var stepSummaryView: some View {
        VStack(alignment: .leading, spacing: CarlibSpacing.lg) {
            Text(verbatim: L10n.Declaration.step4Title)
                .font(CarlibFont.headingMedium())
            Text(verbatim: L10n.Declaration.step4Subtitle)
                .font(CarlibFont.bodyMedium())
                .foregroundStyle(.secondary)

            CarlibCard(variant: .flat) {
                VStack(alignment: .leading, spacing: CarlibSpacing.sm) {
                    summaryRow(label: L10n.Declaration.summaryType, value: selectedType?.localizedName ?? "—")
                    Divider()
                    summaryRow(label: L10n.Declaration.summaryPhotos, value: "\(photoImages.count)")
                    Divider()
                    summaryRow(label: L10n.Declaration.summaryPlate, value: licensePlate.isEmpty ? "—" : licensePlate)
                    Divider()
                    summaryRow(label: L10n.Declaration.summaryVehicle, value: brand.isEmpty ? "—" : "\(brand) \(model)")
                }
            }

            Text(verbatim: L10n.Declaration.summaryDisclaimer)
                .font(CarlibFont.caption())
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .frame(maxWidth: .infinity)
        }
    }

    private func summaryRow(label: String, value: String) -> some View {
        HStack {
            Text(verbatim: label)
                .font(CarlibFont.bodySmall())
                .foregroundStyle(.secondary)
            Spacer()
            Text(value)
                .font(CarlibFont.bodySmall(.semibold))
        }
    }
}

#Preview {
    DeclarationFlowView()
        .environment(ClaimStore())
}
