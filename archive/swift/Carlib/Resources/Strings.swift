import Foundation

// MARK: - App language

/// The set of languages the app ships with. Stored as the raw value in
/// `UserDefaults` under `app_language`.
enum AppLanguage: String, CaseIterable, Identifiable {
    case en
    case fr

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .en: return "English"
        case .fr: return "Français"
        }
    }

    var flag: String {
        switch self {
        case .en: return "🇬🇧"
        case .fr: return "🇫🇷"
        }
    }

    static var current: AppLanguage {
        let raw = UserDefaults.standard.string(forKey: "app_language") ?? AppLanguage.en.rawValue
        return AppLanguage(rawValue: raw) ?? .en
    }
}

/// Tiny helper — pick English or French based on the currently selected
/// language. Keeps the call sites short and readable.
@inline(__always)
private func tr(_ en: String, _ fr: String) -> String {
    AppLanguage.current == .fr ? fr : en
}

// MARK: - Centralized strings (EN + FR)

/// All user-facing copy. French translations aim for idiomatic automotive /
/// insurance vocabulary — "carrossier" rather than a literal "body shop",
/// "sinistre" rather than "claim" in insurance contexts, "dépose" for the
/// drop-off step, etc.
enum L10n {

    // MARK: - App

    enum App {
        static var name: String { "Carlib" }
    }

    // MARK: - Onboarding

    enum Onboarding {
        static var welcomeTitle: String { tr("Welcome to Carlib", "Bienvenue sur Carlib") }
        static var welcomeSubtitle: String {
            tr(
                "The simple way to manage your car accident claim",
                "La façon la plus simple de gérer votre sinistre auto"
            )
        }
        static var roleDriver: String { tr("I'm a driver", "Je suis automobiliste") }
        static var roleGarage: String { tr("I'm a body shop", "Je suis carrossier") }
    }

    // MARK: - Tabs (Driver)

    enum DriverTab {
        static var home: String { tr("Home", "Accueil") }
        static var shops: String { tr("Shops", "Carrossiers") }
        static var profile: String { tr("Profile", "Profil") }
    }

    // MARK: - Tabs (Garage)

    enum GarageTab {
        static var dashboard: String { tr("Dashboard", "Tableau de bord") }
        static var claims: String { tr("Claims", "Sinistres") }
        static var planning: String { tr("Schedule", "Planning") }
        static var profile: String { tr("Profile", "Profil") }
    }

    // MARK: - Common

    enum Common {
        static var seeAll: String { tr("See All", "Tout voir") }
        static var cancel: String { tr("Cancel", "Annuler") }
        static var save: String { tr("Save", "Enregistrer") }
        static var delete: String { tr("Delete", "Supprimer") }
        static var done: String { tr("Done", "OK") }
    }

    // MARK: - Driver Home — The File (editorial)

    enum DriverHome {
        static var appName: String { "Carlib" }

        // Masthead
        static var masthead: String { tr("The File", "Mon dossier") }
        static func fileNumber(_ n: Int) -> String { String(format: "N°%02d", n) }

        // Ready state (no active claim)
        static var readyKicker: String { tr("Ready", "Prêt") }
        static var readyHeadline: String { tr("Something\nhappened?", "Un petit\nsouci ?") }
        static var readyBody: String {
            tr(
                "Report your claim in a few minutes. We'll find the best body shop near you.",
                "Déclarez votre sinistre en quelques minutes. Nous trouvons le meilleur carrossier près de chez vous."
            )
        }
        static var readyCta: String { tr("Report an accident", "Déclarer un sinistre") }
        static var readyEmergencyTitle: String { tr("In case of emergency", "En cas d'urgence") }
        static var readyEmergency112: String { tr("Emergency", "Urgences") }
        static var readyEmergencyInsurer: String { tr("Insurer", "Assureur") }
        static var readyEmergencyTow: String { tr("Tow truck", "Dépanneuse") }

        // Waiting state (submitted / matched)
        static var waitingKicker: String { tr("Waiting", "En recherche") }
        static var waitingHeadline: String { tr("Your claim\nis being reviewed.", "Votre dossier\nest en cours d'étude.") }
        static func waitingBody(_ elapsed: String) -> String {
            tr(
                "We're looking for an available body shop — \(elapsed) elapsed.",
                "Nous cherchons un carrossier disponible — \(elapsed) écoulé."
            )
        }
        static var waitingEta: String { tr("Response expected within 2h", "Réponse attendue sous 2 h") }
        static var waitingCta: String { tr("View claim", "Voir le dossier") }

        // Accepted state (garage found, booking pending or confirmed)
        static var acceptedKicker: String { tr("Accepted", "Accepté") }
        static func acceptedHeadline(_ garage: String) -> String {
            tr("\(garage)\naccepted your file.", "\(garage)\na accepté votre dossier.")
        }
        static var acceptedBody: String {
            tr(
                "Your body shop has been assigned. Get ready to drop off your vehicle.",
                "Votre carrossier est désigné. Préparez la dépose de votre véhicule."
            )
        }
        static func acceptedEta(_ date: String) -> String {
            tr("Drop-off \(date)", "Dépose le \(date)")
        }
        static var acceptedCta: String { tr("Prepare drop-off", "Préparer la dépose") }

        // Repair state (vehicle at garage)
        static var repairKicker: String { tr("In repair", "En réparation") }
        static func repairHeadline(_ vehicle: String) -> String {
            tr("Your \(vehicle) is\nin good hands.", "Votre \(vehicle)\nest entre de bonnes mains.")
        }
        static func repairBody(_ days: Int, _ garage: String) -> String {
            if AppLanguage.current == .fr {
                let label = days == 1 ? "jour" : "jours"
                return "\(garage) y travaille depuis \(days) \(label)."
            } else {
                let label = days == 1 ? "day" : "days"
                return "\(garage) has been working on it for \(days) \(label)."
            }
        }
        static func repairEta(_ date: String) -> String {
            tr("Ready \(date)", "Prêt le \(date)")
        }
        static var repairCta: String { tr("Track progress", "Suivre la réparation") }

        // Ready for pickup state
        static var readyForPickupKicker: String { tr("Ready for pickup", "Prêt à récupérer") }
        static func readyForPickupHeadline(_ vehicle: String) -> String {
            tr("Your \(vehicle) is\nready to pick up.", "Votre \(vehicle)\nvous attend.")
        }
        static var readyForPickupBody: String {
            tr(
                "Your body shop has finished the work. You can come pick up your vehicle.",
                "Votre carrossier a terminé. Vous pouvez venir récupérer votre véhicule."
            )
        }
        static var readyForPickupCta: String { tr("Directions to the shop", "Itinéraire vers le carrossier") }

        // Shared secondary
        static var callGarage: String { tr("Call", "Appeler") }
        static var directions: String { tr("Directions", "Itinéraire") }
        static var secondaryDeclare: String { tr("Report a new accident", "Déclarer un nouveau sinistre") }
        static var secondarySearchGarage: String { tr("Find a body shop", "Trouver un carrossier") }
        static var stageLabel: String { tr("Stage", "Étape") }
        static func stageProgress(_ current: Int, _ total: Int) -> String {
            tr("Stage \(current) of \(total)", "Étape \(current) sur \(total)")
        }

        // Empty ("all clear") state
        static var emptyFileKicker: String { tr("All clear", "Tout va bien") }
        static var emptyFileHeadline: String { tr("Nothing on file right now.", "Aucun dossier en cours.") }

        // Shared CTAs & labels on the file card
        static var viewClaim: String { tr("View claim", "Voir le dossier") }
        static var comePickUp: String { tr("Come pick it up", "Venir le récupérer") }
        static func distanceAway(_ km: Double) -> String {
            if AppLanguage.current == .fr {
                return String(format: "À %.1f km", km)
            } else {
                return String(format: "%.1f km away", km)
            }
        }
        static func readyBy(_ date: String) -> String {
            tr("Ready \(date)", "Prêt le \(date)")
        }

        // Report Damage CTA (section 2)
        static var reportCtaTitle: String { tr("Report damage", "Déclarer des dommages") }
        static var reportCtaBody: String {
            tr(
                "Declare in a few minutes\nand find a garage nearby",
                "Déclarez en quelques minutes\net trouvez un carrossier proche"
            )
        }

        // Shortcuts (section 3)
        static var shortcutMyGarageTitle: String { tr("My Garage", "Mon garage") }
        static func shortcutMyGarageCars(_ count: Int) -> String {
            if AppLanguage.current == .fr {
                return count == 1 ? "1 véhicule" : "\(count) véhicules"
            } else {
                return count == 1 ? "1 car" : "\(count) cars"
            }
        }
        static var shortcutFindShopTitle: String { tr("Find Body Shop", "Trouver un carrossier") }
        static var shortcutFindShopSubtitle: String { tr("Near you", "Près de chez vous") }

        // Recent files (section 4)
        static var recentFilesTitle: String { tr("Recent Files", "Dossiers récents") }
        static var recentFilesSeeAll: String { tr("See all files", "Tous les dossiers") }
        static var recentStatusCompleted: String { tr("Completed", "Terminé") }
        static var recentStatusCancelled: String { tr("Cancelled", "Annulé") }
        static var recentFallbackTitle: String { tr("Claim", "Sinistre") }

        // Legacy aliases — keep other views compiling
        static func greeting(_ name: String) -> String {
            tr("Hello, \(name)", "Bonjour, \(name)")
        }
        static var subtitle: String { tr("How can we help you today?", "Comment pouvons-nous vous aider ?") }
        static var heroTitle: String { readyCta }
        static var heroSubtitle: String { readyBody }
        static var sectionActive: String { tr("Your active claim", "Votre dossier en cours") }
        static var sectionQuickFind: String { tr("Find a garage", "Trouver un carrossier") }
        static var sectionQuickVehicle: String { tr("My vehicle", "Mon véhicule") }
        static var sectionVehicle: String { tr("My vehicle", "Mon véhicule") }
        static var sectionRecent: String { tr("Recent", "Récents") }
        static var emptyTitle: String { tr("No active claims", "Aucun dossier en cours") }
        static var emptyDescription: String {
            tr(
                "You have no active claims. Let's hope it stays that way!",
                "Aucun sinistre en cours. Pourvu que ça dure !"
            )
        }
        static var greeting: String { tr("Hello", "Bonjour") }
        static var title: String { tr("Had an accident?", "Un accident ?") }
        static var ctaDeclare: String { tr("Report an Accident", "Déclarer un sinistre") }
        static var sectionGarages: String { tr("Nearby Body Shops", "Carrossiers à proximité") }
        static var sectionHelp: String { tr("Help", "Aide") }
        static var helpFaq: String { tr("FAQ", "FAQ") }
        static var helpContact: String { tr("Contact Us", "Nous contacter") }
        static var helpHowItWorks: String { tr("How It Works", "Comment ça marche") }
    }

    // MARK: - Declaration

    enum Declaration {
        static var title: String { tr("Report", "Déclaration") }
        static var back: String { tr("Back", "Retour") }
        static var next: String { tr("Next", "Suivant") }
        static var submit: String { tr("Submit", "Envoyer") }

        static func stepProgress(_ current: Int, _ total: Int) -> String {
            tr("Step \(current) of \(total)", "Étape \(current) sur \(total)")
        }

        static var step1Title: String { tr("Accident Type", "Type de sinistre") }
        static var step1Subtitle: String { tr("Select the type of incident", "Sélectionnez la nature du sinistre") }
        static var step2Title: String { tr("Vehicle Photos", "Photos du véhicule") }
        static var step2Subtitle: String {
            tr("Take photos of the damage for your file", "Prenez des photos des dommages pour votre dossier")
        }
        static var step3Title: String { tr("Vehicle Info", "Informations véhicule") }
        static var step3Subtitle: String {
            tr("Enter your vehicle details", "Renseignez les informations de votre véhicule")
        }
        static var step4Title: String { tr("Summary", "Récapitulatif") }
        static var step4Subtitle: String {
            tr("Review the information before submitting", "Vérifiez les informations avant d'envoyer")
        }

        // Photos
        static var photosAdd: String { tr("Add Photo", "Ajouter une photo") }
        static var photosHint: String {
            tr(
                "Take at least 4 photos: front, rear, left side, right side",
                "Au moins 4 photos : avant, arrière, côté gauche, côté droit"
            )
        }

        // Vehicle fields
        static var vehiclePlate: String { tr("License Plate", "Immatriculation") }
        static var vehicleBrand: String { tr("Brand", "Marque") }
        static var vehicleModel: String { tr("Model", "Modèle") }
        static var vehicleYear: String { tr("Year", "Année") }
        static var vehicleColor: String { tr("Color", "Couleur") }

        // Summary
        static var summaryType: String { tr("Accident Type", "Type de sinistre") }
        static var summaryPhotos: String { tr("Photos", "Photos") }
        static var summaryPlate: String { tr("Plate", "Immatriculation") }
        static var summaryVehicle: String { tr("Vehicle", "Véhicule") }
        static var summaryDisclaimer: String {
            tr(
                "By submitting, you confirm the accuracy of this information.",
                "En envoyant, vous certifiez l'exactitude des informations fournies."
            )
        }

        // Confirmation
        static var confirmationTitle: String { tr("Claim Submitted", "Sinistre déclaré") }
        static var confirmationSubtitle: String {
            tr(
                "Your claim has been recorded. We're searching for available body shops.",
                "Votre dossier est enregistré. Nous recherchons un carrossier disponible."
            )
        }
        static var confirmationReference: String { tr("Reference", "Référence") }
        static var confirmationCtaHome: String { tr("Back to home", "Retour à l'accueil") }
    }

    // MARK: - Driver Claims

    enum DriverClaims {
        static var title: String { tr("Claim history", "Historique des dossiers") }
        static var emptyTitle: String { tr("No past claims", "Aucun dossier archivé") }
        static var emptyDescription: String {
            tr(
                "Archived claims will appear here once a repair is completed or cancelled.",
                "Vos dossiers clôturés ou annulés apparaîtront ici."
            )
        }
    }

    // MARK: - Claim Detail

    enum ClaimDetail {
        static var title: String { tr("Claim Details", "Détails du dossier") }
        static var sectionTimeline: String { tr("Timeline", "Suivi") }
        static var sectionVehicle: String { tr("Vehicle", "Véhicule") }
        static var sectionPhotos: String { tr("Photos", "Photos") }
        static var sectionGarage: String { tr("Assigned Body Shop", "Carrossier désigné") }
        static var actionContact: String { tr("Contact Body Shop", "Contacter le carrossier") }
        static var actionCancel: String { tr("Cancel Claim", "Annuler le dossier") }
        static var cancelTitle: String { tr("Cancel Claim", "Annuler le dossier") }
        static var cancelConfirm: String { tr("Confirm Cancellation", "Confirmer l'annulation") }
        static var cancelMessage: String { tr("This action cannot be undone.", "Cette action est définitive.") }
    }

    // MARK: - Garage Search

    enum GarageSearch {
        static var title: String { tr("Find a Body Shop", "Trouver un carrossier") }
        static var placeholder: String { tr("Search body shops...", "Rechercher un carrossier...") }
        static var modeLabel: String { tr("View Mode", "Affichage") }
        static var modeList: String { tr("List", "Liste") }
        static var modeMap: String { tr("Map", "Carte") }
        static var mapPlaceholder: String { tr("Map coming soon", "Carte bientôt disponible") }
    }

    // MARK: - Garage Detail

    enum GarageDetail {
        static func coverage(_ km: Int) -> String {
            tr("\(km) km radius", "Rayon de \(km) km")
        }
        static var sectionSpecialties: String { tr("Specialties", "Spécialités") }
        static var sectionSlots: String { tr("Available Slots", "Créneaux disponibles") }
        static var ctaBook: String { tr("Book Appointment", "Prendre rendez-vous") }
    }

    // MARK: - Garage Card

    enum GarageCard {
        static var available: String { tr("Available", "Disponible") }
        static var unavailable: String { tr("Unavailable", "Indisponible") }
    }

    // MARK: - Profile (Shared)

    enum Profile {
        static var title: String { tr("Profile", "Profil") }
        static var sectionVehicle: String { tr("My Vehicle", "Mon véhicule") }
        static var addVehicle: String { tr("Add Vehicle", "Ajouter un véhicule") }
        static var sectionHistory: String { tr("Claim history", "Historique des dossiers") }
        static var historyRow: String { tr("Claim history", "Historique des dossiers") }
        static var sectionNotifications: String { tr("Notifications", "Notifications") }
        static var preferences: String { tr("Preferences", "Préférences") }
        static var sectionLanguage: String { tr("Language", "Langue") }
        /// Displayed on the Settings row — shows the currently active language's
        /// own name (English / Français), not the key for the row itself.
        static var languageCurrent: String { AppLanguage.current.displayName }
        static var sectionAppearance: String { tr("Appearance", "Apparence") }
        static var appearanceSystem: String { tr("System", "Système") }
        static var appearanceDark: String { tr("Dark", "Sombre") }
        static var appearanceLight: String { tr("Light", "Clair") }
        static var logout: String { tr("Log Out", "Se déconnecter") }
    }

    // MARK: - Garage Dashboard

    enum GarageDashboard {
        static var title: String { tr("Dashboard", "Tableau de bord") }
        static var kpiNew: String { tr("New Claims", "Nouveaux sinistres") }
        static var kpiInProgress: String { tr("In Progress", "En cours") }
        static var kpiTodayAppointments: String { tr("Today's Appointments", "Rendez-vous du jour") }
        static var kpiCompletedThisMonth: String { tr("Completed This Month", "Terminés ce mois") }
        static var sectionPending: String { tr("Pending Claims", "Sinistres en attente") }
        static var sectionToday: String { tr("Today", "Aujourd'hui") }
        static var todayEmpty: String { tr("No appointments today", "Aucun rendez-vous aujourd'hui") }
    }

    // MARK: - Profile About

    enum ProfileAbout {
        static var section: String { tr("About", "À propos") }
        static var terms: String { tr("Terms of Service", "Conditions d'utilisation") }
        static var privacy: String { tr("Privacy Policy", "Politique de confidentialité") }
        static var version: String { tr("Version", "Version") }
    }

    // MARK: - Settings

    enum Settings {
        static var title: String { tr("Settings", "Paramètres") }
        static var profileRowTitle: String { tr("Settings", "Paramètres") }
        static var profileRowSubtitle: String {
            tr("Appearance, language, password", "Apparence, langue, mot de passe")
        }

        static var sectionAccount: String { tr("Account", "Compte") }
        static var changePassword: String { tr("Change password", "Changer le mot de passe") }
        static var deleteAccount: String { tr("Delete account", "Supprimer le compte") }
        static var deleteAccountConfirmTitle: String {
            tr("Delete your account?", "Supprimer votre compte ?")
        }
        static var deleteAccountConfirmMessage: String {
            tr(
                "This will permanently remove your profile and claim history. This action can't be undone.",
                "Votre profil et l'historique de vos sinistres seront définitivement effacés. Cette action est irréversible."
            )
        }

        static var sectionNotifications: String { tr("Notifications", "Notifications") }
        static var notificationPreferences: String { tr("Push & status updates", "Push et suivi des dossiers") }

        static var sectionLanguage: String { tr("Language", "Langue") }
        static var languageNote: String {
            tr(
                "Pick the language Carlib uses throughout the app.",
                "Choisissez la langue utilisée dans toute l'application."
            )
        }

        static var sectionAppearance: String { tr("Appearance", "Apparence") }
    }

    // MARK: - Change Password

    enum ChangePassword {
        static var title: String { tr("Change password", "Changer le mot de passe") }
        static var current: String { tr("Current password", "Mot de passe actuel") }
        static var new: String { tr("New password", "Nouveau mot de passe") }
        static var confirm: String { tr("Confirm new password", "Confirmer le nouveau mot de passe") }
        static var hint: String { tr("8 characters minimum", "8 caractères minimum") }
        static var save: String { tr("Update password", "Mettre à jour") }
        static var errorMismatch: String { tr("Passwords don't match", "Les mots de passe ne correspondent pas") }
        static var errorTooShort: String {
            tr("New password must be at least 8 characters", "Le mot de passe doit contenir au moins 8 caractères")
        }
        static var errorCurrentWrong: String {
            tr("Current password is incorrect", "Le mot de passe actuel est incorrect")
        }
        static var successTitle: String { tr("Password updated", "Mot de passe mis à jour") }
        static var successBody: String {
            tr(
                "You'll use your new password next time you sign in.",
                "Utilisez votre nouveau mot de passe à la prochaine connexion."
            )
        }
    }

    // MARK: - Garage Claims

    enum GarageClaims {
        static var title: String { tr("Claims", "Sinistres") }
        static var filter: String { tr("Filter", "Filtrer") }
        static var filterAvailable: String { tr("Requests", "Demandes") }
        static var filterAccepted: String { tr("My Cases", "Mes dossiers") }
        static var emptyAvailableTitle: String { tr("No new requests", "Aucune nouvelle demande") }
        static var emptyAcceptedTitle: String { tr("No active cases", "Aucun dossier en cours") }
        static var emptyAvailableDescription: String {
            tr(
                "New requests from drivers in your area will appear here.",
                "Les nouvelles demandes d'automobilistes de votre zone apparaîtront ici."
            )
        }
        static var emptyAcceptedDescription: String {
            tr("Cases you've accepted will appear here.", "Les dossiers que vous avez acceptés apparaîtront ici.")
        }
    }

    // MARK: - Garage Claim Detail

    enum GarageClaimDetail {
        static var title: String { tr("Case", "Dossier") }
        static var sectionDescription: String { tr("Description", "Description") }
        static var sectionLocation: String { tr("Location", "Localisation") }
        static var actionAccept: String { tr("Accept Case", "Accepter le dossier") }
        static var actionRefuse: String { tr("Decline", "Refuser") }
        static var actionUpdateStatus: String { tr("Update Status", "Mettre à jour l'état") }
        static var acceptTitle: String { tr("Accept this case?", "Accepter ce dossier ?") }
        static var acceptConfirm: String { tr("Accept", "Accepter") }
        static var acceptMessage: String {
            tr("You will be responsible for this claim.", "Vous serez en charge de ce dossier.")
        }
        static var statusTitle: String { tr("Update Status", "Mettre à jour l'état") }
    }

    // MARK: - Garage Planning

    enum GaragePlanning {
        static var title: String { tr("Schedule", "Planning") }
        static var week: String { tr("Week", "Semaine") }
        static var emptyTitle: String { tr("Nothing scheduled", "Rien de prévu") }
        static var emptyDescription: String {
            tr(
                "Add an appointment or block time off for this day.",
                "Ajoutez un rendez-vous ou bloquez du temps pour ce jour."
            )
        }
        static var add: String { tr("Add", "Ajouter") }
        static var addDate: String { tr("Date", "Date") }
        static var addStart: String { tr("Start", "Début") }
        static var addEnd: String { tr("End", "Fin") }
        static var addTitle: String { tr("New appointment", "Nouveau rendez-vous") }

        // Slot kinds
        static var appointment: String { tr("Appointment", "Rendez-vous") }
        static var appointmentSubtitle: String { tr("Vehicle drop-off", "Dépose du véhicule") }
        static var blocked: String { tr("Blocked", "Bloqué") }
        static var blockedSubtitle: String { tr("Time unavailable", "Créneau indisponible") }

        // Mode switcher
        static var modeCalendar: String { tr("Calendar", "Calendrier") }
        static var modeHours: String { tr("Hours", "Horaires") }

        // Calendar hero
        static var bayBooked: String { tr("bay booked", "place réservée") }
        static var baysBooked: String { tr("bays booked", "places réservées") }
        static var dayClosed: String { tr("Closed today", "Fermé aujourd'hui") }
        static var dayClosedDescription: String {
            tr(
                "Open this day in weekly hours to accept bookings.",
                "Ouvrez ce jour dans les horaires hebdomadaires pour accepter des rendez-vous."
            )
        }
        static var overbookedWarning: String {
            tr(
                "Over capacity — you've booked more than this day allows.",
                "Sur-réservation — vous avez dépassé la capacité du jour."
            )
        }

        // Today / labels
        static var today: String { tr("Today", "Aujourd'hui") }
        static var todayCapacity: String { tr("Today's capacity", "Capacité du jour") }

        // Actions (list)
        static var addAppointment: String { tr("Add appointment", "Ajouter un rendez-vous") }
        static var blockTime: String { tr("Block time", "Bloquer du temps") }

        // Actions (slot sheet)
        static var slotDetailsTitle: String { tr("Details", "Détails") }
        static var actionMarkArrived: String { tr("Mark as arrived", "Marquer comme arrivé") }
        static var actionReschedule: String { tr("Reschedule", "Reprogrammer") }
        static var actionCancelAppt: String { tr("Cancel appointment", "Annuler le rendez-vous") }
        static var actionRemoveBlock: String { tr("Remove block", "Retirer le blocage") }
        static var actionEditBlock: String { tr("Edit time", "Modifier l'horaire") }
        static var actionCall: String { tr("Call", "Appeler") }
        static var actionMessage: String { tr("Message", "Message") }
        static var actionOpenClaim: String { tr("Open claim", "Ouvrir le dossier") }

        // Claim context on slots
        static var walkInTitle: String { tr("Walk-in appointment", "Rendez-vous sans dossier") }
        static var walkInSubtitle: String { tr("No claim linked", "Aucun dossier associé") }
        static var customer: String { tr("Customer", "Client") }
        static var vehicle: String { tr("Vehicle", "Véhicule") }
        static var accidentType: String { tr("Accident", "Sinistre") }
        static var claimDescription: String { tr("Description", "Description") }
        static var claimStatus: String { tr("Claim status", "État du dossier") }

        // Block time sheet
        static var blockTimeTitle: String { tr("Block time", "Bloquer du temps") }
        static var blockAllDay: String { tr("All day", "Toute la journée") }
        static var blockReason: String { tr("Reason", "Motif") }
        static var blockReasonLunch: String { tr("Lunch break", "Pause déjeuner") }
        static var blockReasonVacation: String { tr("Vacation", "Congés") }
        static var blockReasonTraining: String { tr("Staff training", "Formation") }
        static var blockReasonMaintenance: String { tr("Shop maintenance", "Entretien atelier") }
        static var blockReasonOther: String { tr("Other", "Autre") }

        // Weekly hours
        static var hoursTitle: String { tr("Weekly hours", "Horaires de la semaine") }
        static var hoursDescription: String {
            tr(
                "Default opening hours for every week. Exceptions can be set on the calendar.",
                "Horaires d'ouverture par défaut. Les exceptions se règlent depuis le calendrier."
            )
        }
        static var closed: String { tr("Closed", "Fermé") }
        static var bays: String { tr("bays", "places") }
        static var bay: String { tr("bay", "place") }
        static var editHoursTitle: String { tr("Edit hours", "Modifier les horaires") }
        static var openTime: String { tr("Opens at", "Ouverture à") }
        static var closeTime: String { tr("Closes at", "Fermeture à") }
        static var capacity: String { tr("Daily capacity", "Capacité quotidienne") }
        static var capacityHint: String {
            tr("Max vehicles you can take that day.", "Nombre maximum de véhicules pris en charge ce jour-là.")
        }
    }

    // MARK: - Garage Profile

    enum GarageProfile {
        static var title: String { tr("My Shop", "Mon atelier") }
        static var sectionInfo: String { tr("Information", "Informations") }
        static var name: String { tr("Shop Name", "Nom de l'atelier") }
        static var address: String { tr("Address", "Adresse") }
        static var phone: String { tr("Phone", "Téléphone") }
        static var sectionSpecialties: String { tr("Specialties", "Spécialités") }
        static var sectionZone: String { tr("Service Area", "Zone d'intervention") }
        static var coverage: String { tr("Coverage Radius", "Rayon d'intervention") }
        static var sectionPhotos: String { tr("Photos", "Photos") }
        static var addPhotos: String { tr("Add Photos", "Ajouter des photos") }
        static var sectionStats: String { tr("Statistics", "Statistiques") }
        static var statsCompleted: String { tr("Repairs Completed", "Réparations réalisées") }
    }

    // MARK: - Claim Status

    enum ClaimStatusLabel {
        static var draft: String { tr("Draft", "Brouillon") }
        static var submitted: String { tr("Submitted", "Envoyé") }
        static var matched: String { tr("Searching", "En recherche") }
        static var accepted: String { tr("Accepted", "Accepté") }
        static var inProgress: String { tr("In Progress", "En cours") }
        static var repairing: String { tr("Repairing", "Réparation") }
        static var completed: String { tr("Completed", "Terminé") }
        static var cancelled: String { tr("Cancelled", "Annulé") }
        static var expired: String { tr("Expired", "Expiré") }
    }

    // MARK: - Booking Status

    enum BookingStatusLabel {
        static var pending: String { tr("Pending", "En attente") }
        static var confirmed: String { tr("Confirmed", "Confirmé") }
        static var arrived: String { tr("Arrived at Shop", "Arrivé à l'atelier") }
        static var droppedOff: String { tr("Vehicle Dropped Off", "Véhicule déposé") }
        static var rescheduled: String { tr("Rescheduled", "Reprogrammé") }
        static var cancelledByDriver: String { tr("Cancelled by Driver", "Annulé par le client") }
        static var cancelledByGarage: String { tr("Cancelled by Shop", "Annulé par l'atelier") }
    }

    // MARK: - Repair Status

    enum RepairStatusLabel {
        static var diagnostic: String { tr("Diagnostic", "Diagnostic") }
        static var waitingParts: String { tr("Waiting for Parts", "Attente de pièces") }
        static var repairing: String { tr("Repairing", "Réparation en cours") }
        static var qualityCheck: String { tr("Quality Check", "Contrôle qualité") }
        static var ready: String { tr("Ready for Pickup", "Prêt à récupérer") }
    }

    // MARK: - Specialty

    enum Specialty {
        static var bodywork: String { tr("Bodywork", "Carrosserie") }
        static var painting: String { tr("Painting", "Peinture") }
        static var mechanics: String { tr("Mechanics", "Mécanique") }
        static var windshield: String { tr("Windshield", "Pare-brise") }
        static var detailing: String { tr("Detailing", "Esthétique auto") }
    }

    // MARK: - Accident Type

    enum AccidentTypeLabel {
        static var collision: String { tr("Collision", "Collision") }
        static var parking: String { tr("Parking", "Accrochage parking") }
        static var vandalism: String { tr("Vandalism", "Vandalisme") }
        static var weather: String { tr("Weather", "Intempéries") }
        static var other: String { tr("Other", "Autre") }
    }

    // MARK: - Vehicle Detail

    enum VehicleDetail {
        static var title: String { tr("My Vehicle", "Mon véhicule") }
        static var plate: String { tr("License Plate", "Immatriculation") }
        static var brand: String { tr("Brand", "Marque") }
        static var model: String { tr("Model", "Modèle") }
        static var year: String { tr("Year", "Année") }
        static var color: String { tr("Color", "Couleur") }
    }

    // MARK: - Booking

    enum Booking {
        static var title: String { tr("Book Appointment", "Prendre rendez-vous") }
        static func titleAt(_ name: String) -> String {
            tr("Book at \(name)", "Rendez-vous chez \(name)")
        }
        static var selectDate: String { tr("Select Date", "Choisir une date") }
        static var selectSlot: String { tr("Available Slots", "Créneaux disponibles") }
        static var noSlots: String {
            tr("No slots available for this date", "Aucun créneau disponible pour cette date")
        }
        static var confirm: String { tr("Confirm Booking", "Confirmer le rendez-vous") }
        static var successTitle: String { tr("Booking Confirmed", "Rendez-vous confirmé") }
        static var successMessage: String { tr("Your appointment has been booked.", "Votre rendez-vous est enregistré.") }
    }

    // MARK: - Notification Settings

    enum NotificationSettings {
        static var title: String { tr("Notifications", "Notifications") }
        static var pushEnabled: String { tr("Push Notifications", "Notifications push") }
        static var statusUpdates: String { tr("Claim Status Updates", "Suivi du dossier") }
        static var bookingReminders: String { tr("Booking Reminders", "Rappels de rendez-vous") }
        static var newMatches: String { tr("New Garage Matches", "Nouveaux carrossiers proposés") }
    }

    // MARK: - Garage Profile Edit

    enum GarageProfileEdit {
        static var title: String { tr("Edit Profile", "Modifier le profil") }
        static var name: String { tr("Shop Name", "Nom de l'atelier") }
        static var address: String { tr("Address", "Adresse") }
        static var phone: String { tr("Phone", "Téléphone") }
        static var coverageRadius: String { tr("Coverage Radius (km)", "Rayon d'intervention (km)") }
        static var specialties: String { tr("Specialties", "Spécialités") }
        static var save: String { tr("Save Changes", "Enregistrer") }
    }

    // MARK: - Driver Profile Edit

    enum DriverProfileEdit {
        static var title: String { tr("Edit Profile", "Modifier le profil") }
        static var sectionIdentity: String { tr("Personal info", "Informations personnelles") }
        static var sectionIdentitySubtitle: String {
            tr(
                "How you appear to the body shops you work with.",
                "Ce que les carrossiers verront de vous."
            )
        }
        static var name: String { tr("Full name", "Nom complet") }
        static var namePlaceholder: String { tr("e.g. Sophie Durand", "ex. Sophie Durand") }
        static var email: String { tr("Email", "E-mail") }
        static var emailPlaceholder: String { tr("you@email.com", "vous@exemple.com") }
        static var phone: String { tr("Phone", "Téléphone") }
        static var sectionAvatar: String { tr("Profile photo", "Photo de profil") }
        static var sectionAvatarSubtitle: String {
            tr(
                "Shops see this when you book an appointment.",
                "Les carrossiers la voient lors de la prise de rendez-vous."
            )
        }
        static var changePhoto: String { tr("Change photo", "Changer de photo") }
        static var removePhoto: String { tr("Remove", "Retirer") }
        static var save: String { tr("Save changes", "Enregistrer") }
        static var edit: String { tr("Edit", "Modifier") }
    }

    // MARK: - Splash

    enum Splash {
        static var tagline: String { tr("Repair starts here", "La réparation commence ici") }
    }

    // MARK: - Welcome Carousel

    enum Welcome {
        static var skip: String { tr("Skip", "Passer") }
        static var next: String { tr("Next", "Suivant") }
        static var getStarted: String { tr("Get Started", "Commencer") }
        static var slide1Title: String { tr("Declare in minutes", "Déclarez en quelques minutes") }
        static var slide1Subtitle: String {
            tr(
                "Report your accident with guided steps, photos, and location — all from your phone.",
                "Déclarez votre sinistre pas à pas, avec photos et localisation, depuis votre mobile."
            )
        }
        static var slide2Title: String { tr("Find a body shop", "Trouvez un carrossier") }
        static var slide2Subtitle: String {
            tr(
                "Browse nearby garages, compare ratings, and book an appointment in one tap.",
                "Parcourez les carrossiers proches et prenez rendez-vous en un geste."
            )
        }
        static var slide3Title: String { tr("Track your repair", "Suivez la réparation") }
        static var slide3Subtitle: String {
            tr(
                "Follow every step from drop-off to pickup with real-time status updates.",
                "De la dépose à la récupération, suivez chaque étape en temps réel."
            )
        }
    }

    // MARK: - Auth

    enum Auth {
        static var welcomeTitle: String { tr("Welcome to Carlib", "Bienvenue sur Carlib") }
        static var signInWithApple: String { tr("Sign in with Apple", "Se connecter avec Apple") }
        static var signInWithEmail: String { tr("Sign in with email", "Se connecter par e-mail") }
        static var createAccount: String { tr("Create an account", "Créer un compte") }
        static var or: String { tr("or", "ou") }
        static var termsDisclaimer: String {
            tr(
                "By continuing, you agree to our Terms of Service and Privacy Policy",
                "En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité"
            )
        }
    }

    // MARK: - Sign In

    enum SignIn {
        static var title: String { tr("Sign In", "Connexion") }
        static var email: String { tr("Email", "E-mail") }
        static var password: String { tr("Password", "Mot de passe") }
        static var forgotPassword: String { tr("Forgot password?", "Mot de passe oublié ?") }
        static var signIn: String { tr("Sign In", "Se connecter") }
        static var noAccount: String { tr("Don't have an account?", "Pas encore de compte ?") }
        static var errorInvalid: String { tr("Invalid email or password", "E-mail ou mot de passe incorrect") }
    }

    // MARK: - Sign Up

    enum SignUp {
        static var title: String { tr("Create Account", "Créer un compte") }
        static var fullName: String { tr("Full Name", "Nom complet") }
        static var email: String { tr("Email", "E-mail") }
        static var password: String { tr("Password", "Mot de passe") }
        static var passwordHint: String { tr("8 characters minimum", "8 caractères minimum") }
        static var createAccount: String { tr("Create Account", "Créer le compte") }
        static var hasAccount: String { tr("Already have an account?", "Déjà inscrit ?") }
    }

    // MARK: - Role Selection

    enum Role {
        static var title: String { tr("How will you use Carlib?", "Comment utilisez-vous Carlib ?") }
        static var driverTitle: String { tr("I'm a driver", "Je suis automobiliste") }
        static var driverDescription: String {
            tr(
                "Declare accidents, find garages, track repairs",
                "Déclarer, trouver un carrossier, suivre la réparation"
            )
        }
        static var garageTitle: String { tr("I'm a body shop", "Je suis carrossier") }
        static var garageDescription: String {
            tr(
                "Receive claims, manage planning, update repairs",
                "Recevoir des dossiers, gérer le planning, suivre les réparations"
            )
        }
        static var continueButton: String { tr("Continue", "Continuer") }
    }

    // MARK: - Forgot Password

    enum ForgotPassword {
        static var title: String { tr("Reset Password", "Réinitialiser le mot de passe") }
        static var subtitle: String {
            tr(
                "Enter your email and we'll send a reset link",
                "Indiquez votre e-mail, nous vous enverrons un lien de réinitialisation"
            )
        }
        static var email: String { tr("Email", "E-mail") }
        static var send: String { tr("Send Reset Link", "Envoyer le lien") }
        static var success: String {
            tr("Check your email for a reset link", "Consultez votre e-mail pour réinitialiser votre mot de passe")
        }
    }

}
