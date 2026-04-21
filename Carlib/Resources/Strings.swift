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
        static let shops = "Shops"
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
        static let delete = "Delete"
        static let done = "Done"
    }

    // MARK: - Driver Home — The File (editorial)

    enum DriverHome {
        static let appName = "Carlib"

        // Masthead
        static let masthead = "The File"
        static func fileNumber(_ n: Int) -> String { String(format: "N°%02d", n) }

        // Ready state (no active claim)
        static let readyKicker = "Ready"
        static let readyHeadline = "Something\nhappened?"
        static let readyBody = "Report your claim in a few minutes. We'll find the best body shop near you."
        static let readyCta = "Report an accident"
        static let readyEmergencyTitle = "In case of emergency"
        static let readyEmergency112 = "Emergency"
        static let readyEmergencyInsurer = "Insurer"
        static let readyEmergencyTow = "Tow truck"

        // Waiting state (submitted / matched)
        static let waitingKicker = "Waiting"
        static let waitingHeadline = "Your claim\nis being reviewed."
        static func waitingBody(_ elapsed: String) -> String { "We're looking for an available body shop — \(elapsed) elapsed." }
        static let waitingEta = "Response expected within 2h"
        static let waitingCta = "View claim"

        // Accepted state (garage found, booking pending or confirmed)
        static let acceptedKicker = "Accepted"
        static func acceptedHeadline(_ garage: String) -> String { "\(garage)\naccepted your file." }
        static let acceptedBody = "Your body shop has been assigned. Get ready to drop off your vehicle."
        static func acceptedEta(_ date: String) -> String { "Drop-off \(date)" }
        static let acceptedCta = "Prepare drop-off"

        // Repair state (vehicle at garage)
        static let repairKicker = "In repair"
        static func repairHeadline(_ vehicle: String) -> String { "Your \(vehicle) is\nin good hands." }
        static func repairBody(_ days: Int, _ garage: String) -> String {
            "\(garage) has been working on it for \(days) \(days == 1 ? "day" : "days")."
        }
        static func repairEta(_ date: String) -> String { "Ready \(date)" }
        static let repairCta = "Track progress"

        // Ready for pickup state
        static let readyForPickupKicker = "Ready for pickup"
        static func readyForPickupHeadline(_ vehicle: String) -> String { "Your \(vehicle) is\nready to pick up." }
        static let readyForPickupBody = "Your body shop has finished the work. You can come pick up your vehicle."
        static let readyForPickupCta = "Directions to the shop"

        // Shared secondary
        static let callGarage = "Call"
        static let directions = "Directions"
        static let secondaryDeclare = "Report a new accident"
        static let secondarySearchGarage = "Find a body shop"
        static let stageLabel = "Stage"
        static func stageProgress(_ current: Int, _ total: Int) -> String { "Stage \(current) of \(total)" }

        // Legacy aliases — keep other views compiling
        static func greeting(_ name: String) -> String { "Hello, \(name)" }
        static let subtitle = "How can we help you today?"
        static let heroTitle = readyCta
        static let heroSubtitle = readyBody
        static let sectionActive = "Your active claim"
        static let sectionQuickFind = "Find a garage"
        static let sectionQuickVehicle = "My vehicle"
        static let sectionVehicle = "My vehicle"
        static let sectionRecent = "Recent"
        static let emptyTitle = "No active claims"
        static let emptyDescription = "You have no active claims. Let's hope it stays that way!"
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
        static let confirmationCtaHome = "Back to home"
    }

    // MARK: - Driver Claims

    enum DriverClaims {
        static let title = "Claim history"
        static let emptyTitle = "No past claims"
        static let emptyDescription = "Archived claims will appear here once a repair is completed or cancelled."
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
        static let sectionHistory = "Claim history"
        static let historyRow = "Claim history"
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
        static let filterAvailable = "Requests"
        static let filterAccepted = "My Cases"
        static let emptyAvailableTitle = "No new requests"
        static let emptyAcceptedTitle = "No active cases"
        static let emptyAvailableDescription = "New requests from drivers in your area will appear here."
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
        static let emptyTitle = "Nothing scheduled"
        static let emptyDescription = "Add an appointment or block time off for this day."
        static let add = "Add"
        static let addDate = "Date"
        static let addStart = "Start"
        static let addEnd = "End"
        static let addTitle = "New appointment"

        // Slot kinds
        static let appointment = "Appointment"
        static let appointmentSubtitle = "Vehicle drop-off"
        static let blocked = "Blocked"
        static let blockedSubtitle = "Time unavailable"

        // Mode switcher
        static let modeCalendar = "Calendar"
        static let modeHours = "Hours"

        // Calendar hero
        static let bayBooked = "bay booked"
        static let baysBooked = "bays booked"
        static let dayClosed = "Closed today"
        static let dayClosedDescription = "Open this day in weekly hours to accept bookings."
        static let overbookedWarning = "Over capacity — you've booked more than this day allows."

        // Today / labels
        static let today = "Today"
        static let todayCapacity = "Today's capacity"

        // Actions (list)
        static let addAppointment = "Add appointment"
        static let blockTime = "Block time"

        // Actions (slot sheet)
        static let slotDetailsTitle = "Details"
        static let actionMarkArrived = "Mark as arrived"
        static let actionReschedule = "Reschedule"
        static let actionCancelAppt = "Cancel appointment"
        static let actionRemoveBlock = "Remove block"
        static let actionEditBlock = "Edit time"
        static let actionCall = "Call"
        static let actionMessage = "Message"
        static let actionOpenClaim = "Open claim"

        // Claim context on slots
        static let walkInTitle = "Walk-in appointment"
        static let walkInSubtitle = "No claim linked"
        static let customer = "Customer"
        static let vehicle = "Vehicle"
        static let accidentType = "Accident"
        static let claimDescription = "Description"
        static let claimStatus = "Claim status"

        // Block time sheet
        static let blockTimeTitle = "Block time"
        static let blockAllDay = "All day"
        static let blockReason = "Reason"
        static let blockReasonLunch = "Lunch break"
        static let blockReasonVacation = "Vacation"
        static let blockReasonTraining = "Staff training"
        static let blockReasonMaintenance = "Shop maintenance"
        static let blockReasonOther = "Other"

        // Weekly hours
        static let hoursTitle = "Weekly hours"
        static let hoursDescription = "Default opening hours for every week. Exceptions can be set on the calendar."
        static let closed = "Closed"
        static let bays = "bays"
        static let bay = "bay"
        static let editHoursTitle = "Edit hours"
        static let openTime = "Opens at"
        static let closeTime = "Closes at"
        static let capacity = "Daily capacity"
        static let capacityHint = "Max vehicles you can take that day."
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

    // MARK: - Driver Profile Edit

    enum DriverProfileEdit {
        static let title = "Edit Profile"
        static let sectionIdentity = "Personal info"
        static let sectionIdentitySubtitle = "How you appear to the body shops you work with."
        static let name = "Full name"
        static let namePlaceholder = "e.g. Sophie Durand"
        static let email = "Email"
        static let emailPlaceholder = "you@email.com"
        static let phone = "Phone"
        static let sectionAvatar = "Profile photo"
        static let sectionAvatarSubtitle = "Shops see this when you book an appointment."
        static let changePhoto = "Change photo"
        static let removePhoto = "Remove"
        static let save = "Save changes"
        static let edit = "Edit"
    }

    // MARK: - Splash

    enum Splash {
        static let tagline = "Repair starts here"
    }

    // MARK: - Welcome Carousel

    enum Welcome {
        static let skip = "Skip"
        static let next = "Next"
        static let getStarted = "Get Started"
        static let slide1Title = "Declare in minutes"
        static let slide1Subtitle = "Report your accident with guided steps, photos, and location — all from your phone."
        static let slide2Title = "Find a body shop"
        static let slide2Subtitle = "Browse nearby garages, compare ratings, and book an appointment in one tap."
        static let slide3Title = "Track your repair"
        static let slide3Subtitle = "Follow every step from drop-off to pickup with real-time status updates."
    }

    // MARK: - Auth

    enum Auth {
        static let welcomeTitle = "Welcome to Carlib"
        static let signInWithApple = "Sign in with Apple"
        static let signInWithEmail = "Sign in with email"
        static let createAccount = "Create an account"
        static let or = "or"
        static let termsDisclaimer = "By continuing, you agree to our Terms of Service and Privacy Policy"
    }

    // MARK: - Sign In

    enum SignIn {
        static let title = "Sign In"
        static let email = "Email"
        static let password = "Password"
        static let forgotPassword = "Forgot password?"
        static let signIn = "Sign In"
        static let noAccount = "Don't have an account?"
        static let errorInvalid = "Invalid email or password"
    }

    // MARK: - Sign Up

    enum SignUp {
        static let title = "Create Account"
        static let fullName = "Full Name"
        static let email = "Email"
        static let password = "Password"
        static let passwordHint = "8 characters minimum"
        static let createAccount = "Create Account"
        static let hasAccount = "Already have an account?"
    }

    // MARK: - Role Selection

    enum Role {
        static let title = "How will you use Carlib?"
        static let driverTitle = "I'm a driver"
        static let driverDescription = "Declare accidents, find garages, track repairs"
        static let garageTitle = "I'm a body shop"
        static let garageDescription = "Receive claims, manage planning, update repairs"
        static let continueButton = "Continue"
    }

    // MARK: - Forgot Password

    enum ForgotPassword {
        static let title = "Reset Password"
        static let subtitle = "Enter your email and we'll send a reset link"
        static let email = "Email"
        static let send = "Send Reset Link"
        static let success = "Check your email for a reset link"
    }

}
