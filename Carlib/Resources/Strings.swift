import Foundation

// MARK: - Centralized English strings

/// All user-facing strings in English (primary language).
/// Single source of truth — no hardcoded strings in views.
enum L10n {

    // MARK: - App

    enum App {
        static let name = "Carlib"
    }

    // MARK: - Onboarding

    enum Onboarding {
        static let welcomeTitle = "Welcome to Carlib"
        static let welcomeSubtitle = "The simple way to manage your car accident claim"
        static let roleDriver = "I'm a driver"
        static let roleGarage = "I'm a body shop"
    }

    // MARK: - Tabs (Driver)

    enum DriverTab {
        static let home = "Home"
        static let declare = "Report"
        static let claims = "My Claims"
        static let profile = "Profile"
    }

    // MARK: - Tabs (Garage)

    enum GarageTab {
        static let dashboard = "Dashboard"
        static let claims = "Claims"
        static let planning = "Schedule"
        static let profile = "Profile"
    }

    // MARK: - Common

    enum Common {
        static let seeAll = "See All"
        static let cancel = "Cancel"
        static let save = "Save"
    }

    // MARK: - Driver Home

    enum DriverHome {
        static let appName = "Carlib"
        static func greeting(_ name: String) -> String { "Hello, \(name)" }
        static let subtitle = "How can we help you today?"
        static let heroTitle = "Report damage"
        static let heroSubtitle = "Declare in a few minutes and find a garage nearby"
        static let sectionActive = "Your active claim"
        static let sectionQuickFind = "Find a garage"
        static let sectionQuickVehicle = "My vehicle"
        static let sectionVehicle = "My vehicle"
        static let sectionRecent = "Recent"
        static let emptyTitle = "No active claims"
        static let emptyDescription = "You have no active claims. Let's hope it stays that way!"
        // Legacy — keep other views working
        static let greeting = "Hello"
        static let title = "Had an accident?"
        static let ctaDeclare = "Report an Accident"
        static let sectionGarages = "Nearby Body Shops"
        static let sectionHelp = "Help"
        static let helpFaq = "FAQ"
        static let helpContact = "Contact Us"
        static let helpHowItWorks = "How It Works"
    }

    // MARK: - Declaration

    enum Declaration {
        static let title = "Report"
        static let back = "Back"
        static let next = "Next"
        static let submit = "Submit"

        static func stepProgress(_ current: Int, _ total: Int) -> String {
            "Step \(current) of \(total)"
        }

        static let step1Title = "Accident Type"
        static let step1Subtitle = "Select the type of incident"
        static let step2Title = "Vehicle Photos"
        static let step2Subtitle = "Take photos of the damage for your file"
        static let step3Title = "Vehicle Info"
        static let step3Subtitle = "Enter your vehicle details"
        static let step4Title = "Summary"
        static let step4Subtitle = "Review the information before submitting"

        // Photos
        static let photosAdd = "Add Photo"
        static let photosHint = "Take at least 4 photos: front, rear, left side, right side"

        // Vehicle fields
        static let vehiclePlate = "License Plate"
        static let vehicleBrand = "Brand"
        static let vehicleModel = "Model"
        static let vehicleYear = "Year"
        static let vehicleColor = "Color"

        // Summary
        static let summaryType = "Accident Type"
        static let summaryPhotos = "Photos"
        static let summaryPlate = "Plate"
        static let summaryVehicle = "Vehicle"
        static let summaryDisclaimer = "By submitting, you confirm the accuracy of this information."

        // Confirmation
        static let confirmationTitle = "Claim Submitted"
        static let confirmationSubtitle = "Your claim has been recorded. We're searching for available body shops."
        static let confirmationReference = "Reference"
        static let confirmationCtaClaims = "View My Claims"
        static let confirmationCtaHome = "Back to Home"
    }

    // MARK: - Driver Claims

    enum DriverClaims {
        static let title = "My Claims"
        static let filter = "Filter"
        static let filterActive = "Active"
        static let filterPast = "Completed"
        static let emptyTitle = "No Claims"
        static let emptyDescription = "Your accident claims will appear here."
    }

    // MARK: - Claim Detail

    enum ClaimDetail {
        static let title = "Claim Details"
        static let sectionTimeline = "Timeline"
        static let sectionVehicle = "Vehicle"
        static let sectionPhotos = "Photos"
        static let sectionGarage = "Assigned Body Shop"
        static let actionContact = "Contact Body Shop"
        static let actionCancel = "Cancel Claim"
        static let cancelTitle = "Cancel Claim"
        static let cancelConfirm = "Confirm Cancellation"
        static let cancelMessage = "This action cannot be undone."
    }

    // MARK: - Garage Search

    enum GarageSearch {
        static let title = "Find a Body Shop"
        static let placeholder = "Search body shops..."
        static let modeLabel = "View Mode"
        static let modeList = "List"
        static let modeMap = "Map"
        static let mapPlaceholder = "Map coming soon"
    }

    // MARK: - Garage Detail

    enum GarageDetail {
        static let reviews = "reviews"
        static func coverage(_ km: Int) -> String {
            "\(km) km radius"
        }
        static let sectionSpecialties = "Specialties"
        static let sectionSlots = "Available Slots"
        static let ctaBook = "Book Appointment"
    }

    // MARK: - Garage Card

    enum GarageCard {
        static let available = "Available"
        static let unavailable = "Unavailable"
    }

    // MARK: - Profile (Shared)

    enum Profile {
        static let title = "Profile"
        static let sectionVehicle = "My Vehicle"
        static let addVehicle = "Add Vehicle"
        static let sectionNotifications = "Notifications"
        static let preferences = "Preferences"
        static let sectionLanguage = "Language"
        static let languageCurrent = "English"
        static let sectionAppearance = "Appearance"
        static let appearanceSystem = "System"
        static let appearanceDark = "Dark"
        static let appearanceLight = "Light"
        static let logout = "Log Out"
    }

    // MARK: - Garage Dashboard

    enum GarageDashboard {
        static let title = "Dashboard"
        static let kpiNew = "New Claims"
        static let kpiInProgress = "In Progress"
        static let kpiTodayAppointments = "Today's Appointments"
        static let kpiCompletedThisMonth = "Completed This Month"
        static let sectionPending = "Pending Claims"
        static let sectionToday = "Today"
        static let todayEmpty = "No appointments today"
    }

    // MARK: - Profile About

    enum ProfileAbout {
        static let section = "About"
        static let terms = "Terms of Service"
        static let privacy = "Privacy Policy"
        static let version = "Version"
    }

    // MARK: - Garage Claims

    enum GarageClaims {
        static let title = "Claims"
        static let filter = "Filter"
        static let filterAvailable = "Available"
        static let filterAccepted = "My Cases"
        static let emptyAvailableTitle = "No claims available"
        static let emptyAcceptedTitle = "No active cases"
        static let emptyAvailableDescription = "Claims in your area will appear here."
        static let emptyAcceptedDescription = "Cases you've accepted will appear here."
    }

    // MARK: - Garage Claim Detail

    enum GarageClaimDetail {
        static let title = "Case"
        static let sectionDescription = "Description"
        static let sectionLocation = "Location"
        static let actionAccept = "Accept Case"
        static let actionRefuse = "Decline"
        static let actionUpdateStatus = "Update Status"
        static let acceptTitle = "Accept this case?"
        static let acceptConfirm = "Accept"
        static let acceptMessage = "You will be responsible for this claim."
        static let statusTitle = "Update Status"
    }

    // MARK: - Garage Planning

    enum GaragePlanning {
        static let title = "Schedule"
        static let week = "Week"
        static let emptyTitle = "No time slots"
        static let emptyDescription = "Add your availability to receive vehicles."
        static let add = "Add"
        static let slotBlocked = "Blocked"
        static let slotAvailable = "Available"
        static let slotBooked = "Booked"
        static let addDate = "Date"
        static let addStart = "Start Time"
        static let addEnd = "End Time"
        static let addTitle = "New Time Slot"
    }

    // MARK: - Garage Profile

    enum GarageProfile {
        static let title = "My Shop"
        static let sectionInfo = "Information"
        static let name = "Shop Name"
        static let address = "Address"
        static let phone = "Phone"
        static let sectionSpecialties = "Specialties"
        static let sectionZone = "Service Area"
        static let coverage = "Coverage Radius"
        static let sectionPhotos = "Photos"
        static let addPhotos = "Add Photos"
        static let sectionStats = "Statistics"
        static let statsCompleted = "Repairs Completed"
        static let statsRating = "Average Rating"
    }

    // MARK: - Claim Status

    enum ClaimStatusLabel {
        static let draft = "Draft"
        static let submitted = "Submitted"
        static let matched = "Searching"
        static let accepted = "Accepted"
        static let inProgress = "In Progress"
        static let repairing = "Repairing"
        static let completed = "Completed"
        static let cancelled = "Cancelled"
        static let expired = "Expired"
    }

    // MARK: - Booking Status

    enum BookingStatusLabel {
        static let pending = "Pending"
        static let confirmed = "Confirmed"
        static let arrived = "Arrived at Shop"
        static let droppedOff = "Vehicle Dropped Off"
        static let rescheduled = "Rescheduled"
        static let cancelledByDriver = "Cancelled by Driver"
        static let cancelledByGarage = "Cancelled by Shop"
    }

    // MARK: - Repair Status

    enum RepairStatusLabel {
        static let diagnostic = "Diagnostic"
        static let waitingParts = "Waiting for Parts"
        static let repairing = "Repairing"
        static let qualityCheck = "Quality Check"
        static let ready = "Ready for Pickup"
    }

    // MARK: - Specialty

    enum Specialty {
        static let bodywork = "Bodywork"
        static let painting = "Painting"
        static let mechanics = "Mechanics"
        static let windshield = "Windshield"
        static let detailing = "Detailing"
    }

    // MARK: - Accident Type

    enum AccidentTypeLabel {
        static let collision = "Collision"
        static let parking = "Parking"
        static let vandalism = "Vandalism"
        static let weather = "Weather"
        static let other = "Other"
    }

    // MARK: - Vehicle Detail

    enum VehicleDetail {
        static let title = "My Vehicle"
        static let plate = "License Plate"
        static let brand = "Brand"
        static let model = "Model"
        static let year = "Year"
        static let color = "Color"
    }

    // MARK: - Booking

    enum Booking {
        static let title = "Book Appointment"
        static func titleAt(_ name: String) -> String { "Book at \(name)" }
        static let selectDate = "Select Date"
        static let selectSlot = "Available Slots"
        static let noSlots = "No slots available for this date"
        static let confirm = "Confirm Booking"
        static let successTitle = "Booking Confirmed"
        static let successMessage = "Your appointment has been booked."
    }

    // MARK: - Notification Settings

    enum NotificationSettings {
        static let title = "Notifications"
        static let pushEnabled = "Push Notifications"
        static let statusUpdates = "Claim Status Updates"
        static let bookingReminders = "Booking Reminders"
        static let newMatches = "New Garage Matches"
    }

    // MARK: - Garage Profile Edit

    enum GarageProfileEdit {
        static let title = "Edit Profile"
        static let name = "Shop Name"
        static let address = "Address"
        static let phone = "Phone"
        static let coverageRadius = "Coverage Radius (km)"
        static let specialties = "Specialties"
        static let save = "Save Changes"
    }

}
