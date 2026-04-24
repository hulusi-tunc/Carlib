/**
 * Carlib landing — copy dictionary. All user-visible strings live here,
 * keyed by feature area. To add a new translatable string:
 *   1) add the key + EN + FR here
 *   2) reference via `useT()` in the consuming component
 *
 * Strings buried deep in phone-mockup internals (e.g. claim-status
 * labels) are *not* yet in this dictionary — they stay in-source until
 * we port the second wave. The four sections of the PRD landing plan
 * (hero, problem, solution, how-it-works, shop benefits, signup) are
 * all covered.
 */

export type Locale = "en" | "fr";

export const translations = {
  en: {
    nav: {
      problem: "The problem",
      howItWorks: "How it works",
      shops: "For body shops",
      ctaFull: "I'm a body shop",
      ctaCompact: "I'm interested",
    },
    hero: {
      driver: {
        kicker: "For drivers",
        headlineL1: "From the accident",
        headlineL2: "to keys in your hand.",
        body: "Carlib turns a body-shop claim into a five-step flow you can follow from your phone. Declare, match, accept, repair, pick up.",
        primaryCta: "Get started",
        secondaryCta: "See how it works",
      },
      shop: {
        kicker: "For body shops",
        headlineL1: "Fill the bay.",
        headlineL2: "Skip the phone tag.",
        body: "Qualified claims with photos and vehicle info land on your dashboard. Drivers book their own drop-off slots. Status updates in one tap.",
        primaryCta: "Join as a body shop",
        secondaryCta: "See how it works",
      },
      toggle: { driver: "Driver", shop: "Body shop" },
    },
    problem: {
      kicker: "The problem",
      heading: "The claim journey is broken. For everyone.",
      card1: {
        title: "Claims stall the driver.",
        caption:
          "Paper forms, insurer back-and-forth, endless phone calls. Time slips — and so does the driver's patience.",
      },
      card2: {
        title: "No real choice.",
        caption:
          "The insurer picks the shop. No central place to compare certified body shops nearby — availability, specialty, location.",
      },
      card3: {
        title: "Shops run admin all day.",
        caption:
          "Scattered inbound, unqualified calls, paper schedules. Body shops spend the day sorting messages instead of fixing cars.",
      },
    },
    features: {
      heading: "The cleanest pipeline you'll ever fill.",
      intro:
        "Carlib hands you claims that are already qualified — with photos, vehicle info, and a booked drop-off slot. No phone tag, no cold quotes, no rework on files someone lost.",
      hero: {
        titleL1: "See every claim",
        titleL2: "before you say yes.",
        body: "Drivers declare from the app; you see the full dossier the moment it lands — photos, damage type, vehicle. Accept in one tap, and every status update you post flows back to the driver automatically.",
      },
      photo: {
        titleLead: "Photos before the estimate.",
        titleAside: "Quote from real evidence, not a phone description.",
        body: "Four guided photos at the scene come attached to every claim. You quote faster, argue less, and the insurer gets the same pack the driver sent you — no re-sending, no missing angles.",
      },
      shop: {
        titleLead: "Drivers book your open slots.",
        titleAside: "No phone tag. No negotiation. No double-booking.",
        body: "Open your drop-off calendar, and drivers claim the slot that works for both of you. Your planning stays on one screen — no SMS, no sticky notes, no callbacks to confirm.",
      },
    },
    howItWorks: {
      kicker: "How it works",
      headingL1: "Five steps from the bump",
      headingL2: "to the keys back in your hand.",
      intro:
        "Every stage of a body-shop claim, guided from your phone — no forms, no phone tag, no chasing an update.",
      stepPrefix: "Step",
      step1: {
        title: "Declare the accident.",
        body: "A guided four-step flow captures accident type, vehicle info, and damage photos. A couple of minutes from the side of the road — one tap to submit.",
      },
      step2: {
        title: "Match with a shop.",
        body: "Browse vetted body shops on the map. Filter by specialty and slot, then tap to send them your file — photos and vehicle info already attached.",
      },
      step3: {
        title: "Book a drop-off.",
        body: "Pick a slot that works on the shop's calendar. Instant confirmation, a reminder the day before, and directions to the shop.",
      },
      step4: {
        title: "Track the repair.",
        body: "Diagnostic, parts, repair, quality check — every update the shop makes lands as a push notification, with the photos they added along the way.",
      },
      step5: {
        title: "Pick up the keys.",
        body: "Ready-for-pickup push lands the moment QC signs off. Swing by the shop, sign the handover, drive home.",
      },
    },
    shopBenefits: {
      kicker: "For body shops",
      heading: "A cleaner way to fill the bay.",
      item1: {
        title: "Inbound claims",
        body: "Qualified requests with photos and vehicle info land directly on your dashboard.",
      },
      item2: {
        title: "Schedule your week",
        body: "Open drop-off slots — drivers book themselves. No phone tag, no back-and-forth.",
      },
      item3: {
        title: "Status in one tap",
        body: "Diagnostic, parts, repair, QC, ready — update the job and the driver sees it instantly.",
      },
    },
    signup: {
      kicker: "Join Carlib",
      heading: "I'm a body shop.",
      pitch:
        "Drop us your details and we'll get back within 48 hours to walk you through the platform and activate your shop profile.",
      bullets: [
        "Qualified claims with photos and vehicle info",
        "Built-in scheduling, no inbound calls to triage",
        "No exclusivity, no commitment",
      ],
      fields: {
        shopName: "Shop name",
        shopNamePlaceholder: "North Auto Body",
        contactName: "Your name",
        contactNamePlaceholder: "Sophie Martin",
        city: "City",
        cityPlaceholder: "Paris",
        email: "Email",
        emailPlaceholder: "you@shop.com",
        phone: "Phone",
        phonePlaceholder: "06 12 34 56 78",
      },
      submit: "Join Carlib",
      disclaimer: "Free, no commitment. We'll reach out within 48 hours.",
      errors: {
        missing: "All fields are required.",
        invalidEmail: "Please enter a valid email.",
      },
      success: {
        heading: "Got it — thanks.",
        body: "We'll be in touch within 48 hours with a quick demo and the next steps to activate your shop profile.",
      },
    },
    footer: {
      tagline:
        "A cleaner path from accident to pickup. Built for French body shops and the drivers they serve.",
      product: "Product",
      company: "Company",
      links: {
        problem: "The problem",
        howItWorks: "How it works",
        shops: "For body shops",
        join: "Join Carlib",
        terms: "Terms",
        privacy: "Privacy",
        contact: "Contact",
      },
      rights: "All rights reserved.",
    },
    mockup: {
      // Live claim timeline shown in the FeatureBento hero-card phone.
      claimSteps: [
        {
          pill: "Claim submitted",
          pillSub: "Looking for shops in Paris Est.",
        },
        {
          pill: "3 shops interested",
          pillSub: "Tap to compare ratings and slots.",
        },
        {
          pill: "Drop-off confirmed",
          pillSub: "Thursday 10:00 at North Auto Body.",
        },
        {
          pill: "Repair in progress",
          pillSub: "Bumper + paint match · 1 day ETA.",
        },
        {
          pill: "Ready for pickup",
          pillSub: "Your Peugeot is waiting at North Auto Body.",
        },
      ],
      timeline: ["Submitted", "Matched", "Accepted", "In repair", "Ready"],
      // Shop-side claim detail surfaced in the phone inside HeroCard.
      shopClaim: {
        tracking: "Tracking",
        description: "Description",
        photos: "Photos",
        vehicle: "Vehicle",
        location: "Location",
        collision: "Collision",
        refuse: "Refuse",
        acceptCase: "Accept Case",
        damageText:
          "Deep scratch on the passenger side, picked up in an underground car park. Drop-off possible tomorrow morning.",
        photoLabels: ["Front right wing", "Damage close-up", "Torn plate"],
      },
      // PhotoCard live-upload panel.
      photoPanel: {
        stepCaption: "Step 2 of 4 · Photos of the damage",
        uploadingTpl: "Uploading {label}…",
        attached: "All photos attached — ready to submit.",
        tileLabels: [
          "Damage · close",
          "Damage · wide",
          "Vehicle · front",
          "License plate",
          "Other car",
          "Scene",
        ],
      },
      // ShopCard planning mockup.
      shopPlanning: {
        today: "Today · Thursday, Apr 24",
        planning: "Planning",
        bookedTpl: "{n} / 4 booked",
        open: "Open",
        pickup: "Pickup",
        dropoff: "Drop-off",
        availableHint: "Available — drivers can book",
      },
      // PerspectiveHero perimeter cards (driver + shop sides).
      notif: {
        inRepair: "In repair",
        completed: "Completed",
        ready: "Ready",
        now: "now",
        driver: {
          parkingDamage: "Parking damage",
          bumperReplacement: "Bumper replacement",
          shopsInterested: "3 shops interested",
          tapToCompare: "Tap to compare slots",
          readyForPickup: "Ready for pickup",
          todayAfter4pm: "Today after 4:00pm",
          etaInRepair: "ETA · in repair",
          slotDay: "Thu 10 Apr",
          timelineSteps: ["Declare", "Match", "Accept", "Repair", "Ready"],
        },
        shop: {
          parkingDamage: "Parking damage",
          hoodFrontLight: "Hood + front light",
          timelineSteps: ["Accepted", "Drop-off", "Diagnose", "Repair", "Ready"],
          keysReceived: "Keys received",
          driverMarkedDropoff: "Driver marked drop-off",
          newThisWeek: "New · this week",
          settledThisWeek: "Settled this week",
        },
      },
    },
  },
  fr: {
    nav: {
      problem: "Le problème",
      howItWorks: "Comment ça marche",
      shops: "Pour les carrossiers",
      ctaFull: "Je suis un carrossier intéressé",
      ctaCompact: "Je suis intéressé",
    },
    hero: {
      driver: {
        kicker: "Pour les conducteurs",
        headlineL1: "Avec Carlib, votre réparation",
        headlineL2: "est entre de bonnes mains.",
        body: "Carlib guide votre sinistre en cinq étapes depuis votre téléphone : déclaration, mise en relation, prise en charge, réparation, récupération. Zéro ressaisie, zéro appel à rallonge.",
        primaryCta: "Commencer",
        secondaryCta: "Voir comment ça marche",
      },
      shop: {
        kicker: "Pour les carrossiers",
        headlineL1: "Remplissez l'atelier.",
        headlineL2: "Finis les appels à rallonge.",
        body: "Des dossiers qualifiés — photos, infos véhicule, créneau déjà réservé — arrivent sur votre tableau de bord. Le conducteur est tenu au courant à chaque mise à jour.",
        primaryCta: "Je rejoins Carlib",
        secondaryCta: "Voir comment ça marche",
      },
      toggle: { driver: "Conducteur", shop: "Carrossier" },
    },
    problem: {
      kicker: "Le problème",
      heading: "Le parcours sinistre est cassé. Pour tout le monde.",
      card1: {
        title: "Déclarer un sinistre, c'est un calvaire.",
        caption:
          "Formulaires papier, allers-retours avec l'assureur, appels qui s'enchaînent. Le temps passe — et le sang-froid du conducteur aussi.",
      },
      card2: {
        title: "Pas de vrai choix.",
        caption:
          "L'assureur impose le garage. Aucune vue centralisée des carrossiers agréés à proximité — disponibilités, spécialités, distance.",
      },
      card3: {
        title: "Les carrossiers croulent sous l'admin.",
        caption:
          "Réception éparpillée, appels à qualifier, plannings papier. Ils passent la journée à trier des messages au lieu de réparer.",
      },
    },
    features: {
      heading: "Un canal d'entrée enfin propre.",
      intro:
        "Chaque dossier vous arrive déjà qualifié — photos, infos véhicule, créneau de dépôt réservé. Plus d'appels à rallonge, plus de devis à l'aveugle, plus de ressaisie.",
      hero: {
        titleL1: "Voyez chaque dossier",
        titleL2: "avant d'accepter.",
        body: "Le conducteur déclare depuis l'application ; vous voyez le dossier complet dès qu'il arrive — photos, type de dommage, véhicule. Vous acceptez en un clic, et chaque changement de statut que vous publiez remonte automatiquement au conducteur.",
      },
      photo: {
        titleLead: "Les photos avant le devis.",
        titleAside:
          "Chiffrez sur des preuves, pas sur une description au téléphone.",
        body: "Quatre photos guidées, prises sur place, sont attachées à chaque dossier. Vous chiffrez plus vite, vous discutez moins, et l'assureur reçoit le même dossier — pas de renvoi, pas d'angle manquant.",
      },
      shop: {
        titleLead: "Vos créneaux, remplis par les conducteurs.",
        titleAside:
          "Plus d'allers-retours. Plus de négociation. Plus de double-réservation.",
        body: "Ouvrez vos créneaux de dépôt ; le conducteur prend celui qui lui convient. Votre planning reste sur un seul écran — pas de SMS, pas de post-it, pas de rappel pour confirmer.",
      },
    },
    howItWorks: {
      kicker: "Comment ça marche",
      headingL1: "Cinq étapes, de l'accrochage",
      headingL2: "aux clés en main.",
      intro:
        "Chaque étape du parcours sinistre, guidée depuis votre téléphone — pas de formulaires papier, pas d'appels à rallonge, pas de relances pour connaître le statut.",
      stepPrefix: "Étape",
      step1: {
        title: "Déclarez le sinistre.",
        body: "Un parcours guidé en quatre étapes capture le type d'accident, les infos véhicule et les photos du dommage. Quelques minutes au bord de la route, un clic pour envoyer.",
      },
      step2: {
        title: "Choisissez un carrossier.",
        body: "Comparez les carrossiers agréés sur la carte. Filtrez par spécialité, distance et disponibilité, puis envoyez-leur votre dossier en un clic — photos et infos véhicule déjà attachées.",
      },
      step3: {
        title: "Réservez le dépôt.",
        body: "Choisissez un créneau directement dans le planning du garage. Confirmation immédiate, rappel la veille, itinéraire inclus.",
      },
      step4: {
        title: "Suivez la réparation.",
        body: "Diagnostic, pièces, réparation, contrôle qualité — chaque mise à jour du garage arrive en notification, avec les photos ajoutées au passage. Plus besoin de rappeler pour demander où en est la voiture.",
      },
      step5: {
        title: "Récupérez les clés.",
        body: "Vous recevez la notification « prêt à récupérer » dès la validation du contrôle qualité. Vous passez signer la remise, et vous repartez au volant.",
      },
    },
    shopBenefits: {
      kicker: "Pour les carrossiers",
      heading: "Une façon plus propre de remplir l'atelier.",
      item1: {
        title: "Dossiers entrants qualifiés",
        body: "Des demandes complètes, avec photos et infos véhicule, atterrissent directement sur votre tableau de bord.",
      },
      item2: {
        title: "Un planning qui se remplit seul",
        body: "Ouvrez vos créneaux de dépôt ; les conducteurs réservent eux-mêmes. Plus d'appels à qualifier, plus d'allers-retours.",
      },
      item3: {
        title: "Statut en un clic",
        body: "Diagnostic, pièces, réparation, contrôle qualité, prêt — une mise à jour, et le conducteur la voit instantanément.",
      },
    },
    signup: {
      kicker: "Rejoindre Carlib",
      heading: "Je suis un carrossier intéressé.",
      pitch:
        "Laissez-nous vos coordonnées. On vous recontacte sous 48 h pour vous présenter la plateforme et activer votre profil.",
      bullets: [
        "Dossiers qualifiés, photos et infos véhicule incluses",
        "Planning intégré, sans appels entrants à filtrer",
        "Sans exclusivité, sans engagement",
      ],
      fields: {
        shopName: "Nom du garage",
        shopNamePlaceholder: "Carrosserie Dupont",
        contactName: "Votre nom",
        contactNamePlaceholder: "Sophie Martin",
        city: "Ville",
        cityPlaceholder: "Paris",
        email: "E-mail",
        emailPlaceholder: "vous@carrosserie.fr",
        phone: "Téléphone",
        phonePlaceholder: "06 12 34 56 78",
      },
      submit: "Je rejoins Carlib",
      disclaimer: "Gratuit, sans engagement. Réponse sous 48 h.",
      errors: {
        missing: "Tous les champs sont requis.",
        invalidEmail: "Merci de saisir une adresse e-mail valide.",
      },
      success: {
        heading: "Bien reçu, merci.",
        body: "On revient vers vous sous 48 h avec une démo rapide et les prochaines étapes pour activer votre profil carrossier.",
      },
    },
    footer: {
      tagline:
        "Un parcours plus propre, de l'accrochage à la récupération. Pensé pour les carrossiers français et les conducteurs qu'ils réparent.",
      product: "Produit",
      company: "Entreprise",
      links: {
        problem: "Le problème",
        howItWorks: "Comment ça marche",
        shops: "Pour les carrossiers",
        join: "Rejoindre Carlib",
        terms: "Mentions légales",
        privacy: "Confidentialité",
        contact: "Contact",
      },
      rights: "Tous droits réservés.",
    },
    mockup: {
      claimSteps: [
        {
          pill: "Dossier envoyé",
          pillSub: "Recherche de carrossiers à Paris Est.",
        },
        {
          pill: "3 carrossiers intéressés",
          pillSub: "Comparez notes et créneaux.",
        },
        {
          pill: "Dépôt confirmé",
          pillSub: "Jeudi 10 h 00 chez Carrosserie Martin.",
        },
        {
          pill: "Réparation en cours",
          pillSub: "Pare-chocs + raccord peinture · 1 jour estimé.",
        },
        {
          pill: "Prête à récupérer",
          pillSub: "Votre Peugeot vous attend chez Carrosserie Martin.",
        },
      ],
      timeline: ["Envoyé", "Associé", "Accepté", "En réparation", "Prêt"],
      shopClaim: {
        tracking: "Suivi",
        description: "Description",
        photos: "Photos",
        vehicle: "Véhicule",
        location: "Localisation",
        collision: "Collision",
        refuse: "Refuser",
        acceptCase: "Prendre en charge",
        damageText:
          "Rayure profonde côté passager, constatée sur parking souterrain. Dépôt possible dès demain matin.",
        photoLabels: ["Aile avant droite", "Détail dommage", "Plaque arrachée"],
      },
      photoPanel: {
        stepCaption: "Étape 2 sur 4 · Photos du dommage",
        uploadingTpl: "Envoi de « {label} »…",
        attached: "Photos attachées — prêt à envoyer.",
        tileLabels: [
          "Dommage · proche",
          "Dommage · large",
          "Véhicule · avant",
          "Plaque",
          "Autre véhicule",
          "Scène",
        ],
      },
      shopPlanning: {
        today: "Aujourd'hui · jeudi 24 avr.",
        planning: "Planning",
        bookedTpl: "{n} / 4 réservés",
        open: "Libre",
        pickup: "Récupération",
        dropoff: "Dépôt",
        availableHint: "Créneau libre — réservable par un conducteur",
      },
      notif: {
        inRepair: "En réparation",
        completed: "Terminé",
        ready: "Prêt",
        now: "à l'instant",
        driver: {
          parkingDamage: "Accrochage parking",
          bumperReplacement: "Remplacement pare-chocs",
          shopsInterested: "3 carrossiers intéressés",
          tapToCompare: "Appuyez pour comparer",
          readyForPickup: "Prête à récupérer",
          todayAfter4pm: "Aujourd'hui après 16 h",
          etaInRepair: "Rendu · en réparation",
          slotDay: "Jeu. 10 avr.",
          timelineSteps: [
            "Déclarer",
            "Associer",
            "Accepter",
            "Réparer",
            "Prêt",
          ],
        },
        shop: {
          parkingDamage: "Accrochage parking",
          hoodFrontLight: "Capot + feu avant",
          timelineSteps: [
            "Accepté",
            "Dépôt",
            "Diagnostic",
            "Réparation",
            "Prêt",
          ],
          keysReceived: "Clés récupérées",
          driverMarkedDropoff: "Le conducteur a confirmé le dépôt.",
          newThisWeek: "Nouveaux · cette semaine",
          settledThisWeek: "Réglés cette semaine",
        },
      },
    },
  },
} as const;

export type Dictionary = (typeof translations)["en"];
