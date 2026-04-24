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
        body: "Six guided photos at the scene come attached to every claim. You quote faster, argue less, and the insurer gets the same pack the driver sent you — no re-sending, no missing angles.",
      },
      shop: {
        titleLead: "Drivers book your open slots.",
        titleAside: "No phone tag. No negotiation. No double-booking.",
        body: "Open your drop-off calendar, and drivers claim the slot that works for both of you. Your planning stays on one screen — no SMS, no sticky notes, no callbacks to confirm.",
      },
    },
    howItWorks: {
      kicker: "How it works",
      heading: "Three steps. No friction. Zero re-entry.",
      step1: {
        title: "You get a qualified claim",
        body: "The driver files the claim from the app. You see the full dossier — photos, damage type, vehicle — right on your dashboard.",
      },
      step2: {
        title: "You accept in one tap",
        body: "The claim is assigned to you; the driver is notified automatically and books a drop-off slot in your open calendar.",
      },
      step3: {
        title: "You run the repair",
        body: "Diagnostic, parts, repair, quality check, ready — every status change is shared with the driver without a single phone call.",
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
  },
  fr: {
    nav: {
      problem: "Le problème",
      howItWorks: "Comment ça marche",
      shops: "Pour les garages",
      ctaFull: "Je suis un garage intéressé",
      ctaCompact: "Je suis intéressé",
    },
    hero: {
      driver: {
        kicker: "Pour les conducteurs",
        headlineL1: "De l'accident",
        headlineL2: "aux clés en main.",
        body: "Carlib transforme la prise en charge d'un sinistre en un parcours en cinq étapes que vous pouvez suivre depuis votre téléphone. Déclarer, associer, accepter, réparer, récupérer.",
        primaryCta: "Commencer",
        secondaryCta: "Voir comment ça marche",
      },
      shop: {
        kicker: "Pour les garages",
        headlineL1: "Remplissez l'atelier.",
        headlineL2: "Finis les appels à rallonge.",
        body: "Des dossiers qualifiés avec photos et infos véhicule arrivent sur votre tableau de bord. Les conducteurs réservent eux-mêmes leur créneau. Mise à jour du statut en un clic.",
        primaryCta: "Rejoindre en tant que garage",
        secondaryCta: "Voir comment ça marche",
      },
      toggle: { driver: "Conducteur", shop: "Garage" },
    },
    problem: {
      kicker: "Le problème",
      heading: "Le parcours sinistre est cassé. Pour tout le monde.",
      card1: {
        title: "Le sinistre paralyse le conducteur.",
        caption:
          "Formulaires papier, allers-retours avec l'assureur, appels à rallonge. Le temps passe — et la patience du conducteur aussi.",
      },
      card2: {
        title: "Pas de vrai choix.",
        caption:
          "L'assureur impose le garage. Aucune vue centralisée des carrossiers agréés disponibles à proximité — disponibilité, spécialité, localisation.",
      },
      card3: {
        title: "Les garages font de l'admin toute la journée.",
        caption:
          "Réception éparpillée, appels à qualifier, plannings papier. Les carrossiers passent la journée à trier des messages au lieu de réparer.",
      },
    },
    features: {
      heading: "Le pipeline le plus propre que vous aurez jamais à remplir.",
      intro:
        "Carlib vous livre des dossiers déjà qualifiés — avec photos, infos véhicule et créneau de dépôt réservé. Pas d'appels à rallonge, pas de devis à l'aveugle, pas de ressaisie sur un dossier perdu.",
      hero: {
        titleL1: "Voyez chaque dossier",
        titleL2: "avant d'accepter.",
        body: "Le conducteur déclare depuis l'app ; vous voyez le dossier complet dès qu'il arrive — photos, type de dommage, véhicule. Acceptez en un clic, et chaque changement de statut remonte automatiquement au conducteur.",
      },
      photo: {
        titleLead: "Les photos avant le devis.",
        titleAside:
          "Chiffrez sur des preuves réelles, pas une description au téléphone.",
        body: "Six photos guidées prises sur place sont attachées à chaque dossier. Vous chiffrez plus vite, discutez moins, et l'assureur reçoit le même dossier — pas de renvoi, pas d'angle manquant.",
      },
      shop: {
        titleLead: "Les conducteurs réservent vos créneaux.",
        titleAside:
          "Pas d'allers-retours. Pas de négociation. Pas de double-réservation.",
        body: "Ouvrez vos créneaux de dépôt, et les conducteurs prennent celui qui leur convient. Votre planning tient sur un seul écran — pas de SMS, pas de post-it, pas de rappel pour confirmer.",
      },
    },
    howItWorks: {
      kicker: "Comment ça marche",
      heading: "Trois étapes. Aucune friction. Zéro ressaisie.",
      step1: {
        title: "Vous recevez un dossier qualifié",
        body: "Le conducteur déclare son sinistre depuis l'app. Vous voyez le dossier complet — photos, type de dommage, véhicule — directement sur votre tableau de bord.",
      },
      step2: {
        title: "Vous acceptez en un clic",
        body: "Le dossier vous est attribué ; le conducteur est notifié automatiquement et réserve un créneau de dépôt dans votre planning.",
      },
      step3: {
        title: "Vous gérez la réparation",
        body: "Diagnostic, pièces, réparation, contrôle qualité, prêt — chaque changement de statut est partagé au conducteur sans un seul appel.",
      },
    },
    shopBenefits: {
      kicker: "Pour les garages",
      heading: "Une façon plus propre de remplir l'atelier.",
      item1: {
        title: "Dossiers entrants",
        body: "Des demandes qualifiées avec photos et infos véhicule arrivent directement sur votre tableau de bord.",
      },
      item2: {
        title: "Gérez votre semaine",
        body: "Créneaux de dépôt ouverts — les conducteurs réservent seuls. Pas d'appels à rallonge, pas d'allers-retours.",
      },
      item3: {
        title: "Statut en un clic",
        body: "Diagnostic, pièces, réparation, contrôle qualité, prêt — mettez à jour et le conducteur le voit instantanément.",
      },
    },
    signup: {
      kicker: "Rejoindre Carlib",
      heading: "Je suis un garage intéressé.",
      pitch:
        "Laissez-nous vos coordonnées et nous revenons vers vous sous 48 h pour vous présenter la plateforme et activer votre profil carrossier.",
      bullets: [
        "Dossiers qualifiés avec photos et infos véhicule",
        "Planning intégré, sans appels entrants à qualifier",
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
        emailPlaceholder: "vous@garage.fr",
        phone: "Téléphone",
        phonePlaceholder: "06 12 34 56 78",
      },
      submit: "Rejoindre Carlib",
      disclaimer:
        "Gratuit, sans engagement. Nous vous contactons sous 48 h.",
      errors: {
        missing: "Tous les champs sont requis.",
        invalidEmail: "Merci de saisir un e-mail valide.",
      },
      success: {
        heading: "Merci, c'est noté.",
        body: "Nous revenons vers vous sous 48 h avec une démo rapide et les prochaines étapes pour activer votre profil carrossier.",
      },
    },
    footer: {
      tagline:
        "Un parcours plus propre de l'accident à la récupération. Conçu pour les carrossiers français et les conducteurs qu'ils servent.",
      product: "Produit",
      company: "Société",
      links: {
        problem: "Le problème",
        howItWorks: "Comment ça marche",
        shops: "Pour les garages",
        join: "Rejoindre Carlib",
        terms: "Conditions",
        privacy: "Confidentialité",
        contact: "Contact",
      },
      rights: "Tous droits réservés.",
    },
  },
} as const;

export type Dictionary = (typeof translations)["en"];
