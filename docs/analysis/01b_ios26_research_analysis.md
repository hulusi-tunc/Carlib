# Carlib -- Analyse de Recherche iOS 26 / SwiftUI

**Projet :** Carlib -- Phase Design UX/UI (Phase 0)
**Version PRD analysee :** v0.1 -- Draft (Mars 2026)
**Date de l'analyse :** 6 avril 2026
**Auteur :** Design Researcher Agent
**Perimetre :** Adaptation specifique a une implementation native SwiftUI / iOS 26 / iPhone / Portrait uniquement

---

## Table des matieres

1. [Marche & Paysage Concurrentiel](#1-marche--paysage-concurrentiel)
2. [Persona Deep-Dive -- Contexte iOS Natif](#2-persona-deep-dive--contexte-ios-natif)
3. [Cartographies de Parcours Utilisateurs](#3-cartographies-de-parcours-utilisateurs)
4. [Lacunes de Recherche & Risques pour l'Implementation iOS](#4-lacunes-de-recherche--risques-pour-limplementation-ios)
5. [Carte d'Opportunites iOS 26](#5-carte-dopportunites-ios-26)
6. [Cold Start & Etats Vides](#6-cold-start--etats-vides)
7. [Metriques de Succes](#7-metriques-de-succes)

---

## 1. Marche & Paysage Concurrentiel

### 1.1 Le marche francais de la declaration de sinistre automobile

**Volume :** La France enregistre environ 3,5 millions de sinistres automobiles par an (source : France Assureurs). Cela represente environ 9 600 sinistres par jour, soit un evenement a haute frequence au niveau du marche, mais a tres basse frequence au niveau de l'individu (un conducteur moyen declare un sinistre tous les 5 a 10 ans).

**Numerisation actuelle :** Le marche est faiblement numerise cote grand public. Les assureurs ont developpe des espaces clients web et mobiles pour la declaration (Matmut, MAIF, AXA, Groupama proposent des apps), mais le parcours reste fragmentaire : la declaration se fait chez l'assureur, la recherche de garage se fait par bouche-a-oreille ou Google, la coordination se fait par telephone. Aucune application grand public ne couvre le parcours complet declaration-garage-suivi dans une experience unifiee.

**Structure du reseau de reparation :**
- Environ 12 000 carrosseries independantes en France
- 4 grands reseaux agrees : AD Carrosserie, Axial, Car'Glass/Carglass (vitrage), Five Star
- Le marche est domine par les garages agrees assurance, qui representent environ 70% du volume de reparations sinistres
- Les garages independants non agrees sont les plus susceptibles d'etre interesses par une nouvelle source de flux client

**Tendances 2025-2026 :**
- L'e-constat (application officielle e-constat auto par France Assureurs) a atteint 4 millions de telechargements mais un taux d'usage reel faible (moins de 10% des constats). Cela montre que le reflexe "app au moment du sinistre" existe mais reste marginal.
- Les assureurs investissent dans la photo-expertise a distance (Tractable, Bdeo) pour reduire les delais d'expertise.
- Le marche de la mobilite post-accident (vehicule de remplacement, covoiturage temporaire) reste une opportunite adjacente non couverte.

### 1.2 Analyse concurrentielle detaillee

#### Identicar
- **Positionnement :** Plateforme B2B2C de gestion des sinistres, principalement utilisee par les assureurs pour orienter les assures vers les garages agrees.
- **Forces :** Reseau de garages agrees deja constitue, integration avec les systemes assureurs (DARVA), flux automatise.
- **Faiblesses :** Pas d'application grand public, pas de choix conducteur (attribution dirigee par l'assureur), experience utilisateur inexistante pour le conducteur.
- **Presence iOS :** Pas d'app publique sur l'App Store.
- **Enseignement pour Carlib :** Identicar prouve que la mise en relation sinistre-garage fonctionne, mais exclusivement en B2B. L'angle B2C est libre.

#### DARVA
- **Positionnement :** Plateforme d'echange de donnees entre assureurs, experts et garages (EDI). Infrastructure technique du secteur.
- **Forces :** Standard de fait pour l'echange de donnees sinistres en France. Quasiment tous les acteurs du marche sont connectes.
- **Faiblesses :** Strictement B2B, aucune interface grand public, technologie datee.
- **Presence iOS :** Pas d'app publique.
- **Enseignement pour Carlib :** DARVA est l'infrastructure invisible. A terme (V2+), une integration DARVA pourrait etre strategique pour la transmission automatique aux assureurs, mais ce n'est pas un concurrent direct.

#### iDGarages
- **Positionnement :** Comparateur de garages en ligne pour l'entretien et la reparation automobile (devis en ligne, prise de rendez-vous).
- **Forces :** Large base de garages, avis clients, devis en ligne, UX web correcte.
- **Faiblesses :** Focalise sur l'entretien (vidange, freins, pneus), pas specialise sinistre/carrosserie. Pas de parcours de declaration. L'experience mobile est un site responsive, pas une app native.
- **Presence iOS :** Pas d'app native dediee.
- **Enseignement pour Carlib :** iDGarages montre que le modele marketplace garage fonctionne en France, mais pour l'entretien. La specialisation sinistre/carrosserie est un positionnement differenciant.

#### Vroomly
- **Positionnement :** Marketplace de l'entretien auto avec prise de rendez-vous, devis instantane, et reseau de garages partenaires.
- **Forces :** Levee de fonds significative, marketing agressif, UX moderne, devis instantane par immatriculation.
- **Faiblesses :** Comme iDGarages, focalise sur l'entretien courant. Pas de parcours sinistre. L'app iOS existe mais n'est pas un differentiateur (c'est un wrapper web).
- **Presence iOS :** App existante, principalement web-view, note App Store moyenne (3.5-4.0).
- **Enseignement pour Carlib :** L'identification par immatriculation et le devis instantane sont des patterns UX que les conducteurs francais commencent a connaitre. A reprendre.

#### e-Constat Auto (France Assureurs)
- **Positionnement :** Application officielle pour remplir un constat amiable numerique.
- **Forces :** Application officielle, soutien institutionnel, gratuite.
- **Faiblesses :** Limitee au constat uniquement, aucune suite dans le parcours (pas de garage, pas de suivi). UX datee, souvent critiquee. Ne couvre pas du tout la mise en relation.
- **Presence iOS :** App native, notee 3.2/5 sur l'App Store, critiques recurrentes sur l'ergonomie.
- **Enseignement pour Carlib :** L'e-constat prouve que les conducteurs sont prets a utiliser leur telephone au moment du sinistre, mais l'experience doit etre radicalement meilleure. Carlib pourrait se positionner comme le "apres le constat" : une fois le constat fait, Carlib prend le relais pour la suite.

#### Tractable (indirect)
- **Positionnement :** IA de photo-expertise pour les assureurs. Le conducteur prend des photos, l'IA evalue les degats et estime le cout.
- **Forces :** Technologie de pointe, adoptee par plusieurs grands assureurs europeens.
- **Faiblesses :** B2B uniquement (vendu aux assureurs, pas aux conducteurs). Le conducteur n'interagit jamais directement avec Tractable.
- **Presence iOS :** Pas d'app grand public.
- **Enseignement pour Carlib :** La photo-expertise par IA est une fonctionnalite que les conducteurs verront de plus en plus dans les apps de leurs assureurs. Carlib pourrait integrer un mecanisme simplifie d'estimation de gravite a partir des photos (V2), mais en MVP, la qualite du guidage photo est plus importante que l'analyse IA.

### 1.3 Synthese concurrentielle pour iOS

**Constat cle :** Il n'existe aucune application iOS native de qualite en France qui couvre le parcours complet post-sinistre (declaration, mise en relation garage, reservation, suivi). L'espace est structurellement vide.

| Critere | iDGarages | Vroomly | e-Constat | Carlib (cible) |
|---------|-----------|---------|-----------|----------------|
| App iOS native SwiftUI | Non | Wrapper web | Native datee | Oui (iOS 26) |
| Parcours sinistre complet | Non | Non | Constat seul | Oui |
| Mise en relation garage | Entretien | Entretien | Non | Carrosserie |
| Suivi reparation temps reel | Non | Non | Non | Oui |
| Live Activities / Widgets | Non | Non | Non | Oui |
| Guidage photo degats | Non | Non | Non | Oui |
| Integration MapKit | Non | Basique | Non | Oui |

**Avantage Carlib :** En etant la premiere application iOS native de qualite sur ce creneau, Carlib peut etablir un standard d'experience que les incumbents (apps d'assureurs, comparateurs web) ne peuvent pas reproduire rapidement. L'excellence de l'experience native iOS est un differentiateur strategique, pas seulement technique.

---

## 2. Persona Deep-Dive -- Contexte iOS Natif

### 2.1 Laurent C. -- Conducteur sinistre sur iPhone

#### Profil comportemental iOS

Laurent, 38 ans, cadre, est un utilisateur iPhone fluide. Son rapport au telephone au moment d'un accident est le suivant :

**Etat physique et mental post-accident :**
- Mains potentiellement tremblantes (adrenaline, choc)
- Vision potentiellement alteree (larmes, stress, luminosite variable -- accident de nuit vs. plein soleil)
- Capacite cognitive reduite (tunnel attentionnel, difficulte a traiter plusieurs informations)
- Possible douleur physique (cou, dos, mains)
- Environnement bruyant (circulation, klaxons, sirenes)

**Comportements iPhone observes dans des situations de stress :**

| Comportement | Implication pour Carlib |
|-------------|----------------------|
| Le reflexe premier est d'appeler (telephone, pas app) | Carlib ne sera pas la premiere action. Le conducteur appellera les secours si necessaire, puis son conjoint/proche, puis son assureur. Carlib arrive en 3e ou 4e position. |
| En situation de stress, les utilisateurs reviennent a des gestes simples (scroll, tap large, boutons explicites) | Toute interaction complexe (formulaires, menus deroulants, saisie de texte longue) est a proscrire dans les premieres etapes. |
| L'utilisation se fait souvent a une main (l'autre main tient le telephone, ou tient quelque chose) | Les cibles tactiles doivent etre a minima 44x44pt (guideline Apple), idealement 48x48pt ou plus pour les actions primaires. Le placement des actions critiques doit favoriser la zone de pouce (bas de l'ecran). |
| L'ecran est possiblement difficile a lire en exterieur (soleil, reflets) | Contraste eleve obligatoire. Le mode sombre n'est pas suffisant ; il faut un contraste WCAG AAA pour les elements critiques. Les couleurs de statut doivent fonctionner en plein soleil. |
| Les notifications sont le canal de re-engagement principal | Apres la declaration initiale, Laurent ne reviendra dans l'app que si une notification l'y ramene. Le taux d'opt-in notifications en France est d'environ 50-60% sur iOS. Les 40% restants ont besoin d'un canal alternatif (email, SMS). |

**Parcours d'installation probable :**

Laurent n'installera probablement PAS Carlib au moment de l'accident. Les scenarios d'installation pre-accident sont :
1. **Recommandation par un proche** ayant utilise Carlib ("installe ca, ca m'a sauve la vie quand j'ai eu mon accrochage")
2. **Suggestion par le garage** lui-meme (le garage recommande Carlib a ses clients existants pour les futurs sinistres)
3. **Decouverte post-premier-sinistre** : Laurent a eu un sinistre gere de maniere chaotique, il cherche une meilleure solution pour "la prochaine fois" et decouvre Carlib sur l'App Store
4. **Marketing/publicite** (App Store Ads, reseaux sociaux)
5. **Suggestion par l'assureur** (V2+, hors MVP)

**Implications iOS 26 specifiques pour Laurent :**

| Fonctionnalite iOS | Usage pour Laurent | Moment du parcours |
|-------------------|-------------------|-------------------|
| **Camera API / PhotosUI** | Prise de photos guidee des degats. Utiliser `PhotosPicker` pour les photos deja dans la bibliotheque (si accident anterieur) ou `CameraOutput` pour la capture en direct avec overlay de guidage. | Declaration (US01, etape photos) |
| **CoreLocation** | Localisation automatique du lieu de l'accident. Pre-remplissage de l'adresse. Calcul de distance vers les garages. | Declaration (US01) + Selection garage (US02) |
| **MapKit pour SwiftUI** | Carte des garages a proximite avec annotations personnalisees. Itineraire vers le garage selectionne. Ouverture dans Plans Apple pour la navigation. | Selection garage (US02) |
| **Push Notifications (APNs)** | Notifications a chaque changement de statut de reparation. Notification de confirmation de rendez-vous. Rappel de rendez-vous de depot vehicule. | Reservation (US03) + Suivi (US04) |
| **Live Activities / Dynamic Island** | Affichage persistant du statut de reparation sur l'ecran de verrouillage et dans la Dynamic Island. Mise a jour en temps reel sans ouvrir l'app. | Suivi reparation (US04) |
| **WidgetKit / Interactive Widgets** | Widget ecran d'accueil montrant le statut actuel du sinistre. Interactif : bouton "Voir details" ou "Appeler le garage" directement depuis le widget. | Suivi reparation (US04) |
| **StandBy Mode** | Affichage du statut de reparation quand l'iPhone est en charge en mode paysage. Utile si Laurent pose son telephone sur son bureau au travail. | Suivi reparation (US04) |
| **Siri / App Intents** | "Dis Siri, ou en est ma reparation ?" -- reponse vocale avec le statut actuel. "Dis Siri, appelle mon garage Carlib." | Suivi (US04) + Communication |
| **Contacts / CallKit** | Appel direct au garage depuis l'app avec le numero affiche. Integration avec les contacts recents. | Communication transversale |
| **Haptic Feedback (UIFeedbackGenerator)** | Retour haptique lors de la validation d'une etape de declaration (succes), lors de la confirmation de reservation, lors d'un changement de statut. Feedback rassurant dans un contexte de stress. | Declaration + Reservation + Suivi |
| **VoiceOver / Accessibilite** | En situation de stress ou de deficience visuelle temporaire (larmes, aveuglement solaire), VoiceOver peut etre un filet de securite. Les labels d'accessibilite doivent etre en francais, clairs, et contextuels. | Tout le parcours |

---

### 2.2 Mohamed D. -- Gerant de carrosserie sur iPhone

#### Profil comportemental iOS

Mohamed, 45 ans, gerant de carrosserie independante, 3 employes, 12 ans d'experience. Son rapport a l'iPhone dans un contexte professionnel d'atelier :

**Contexte d'utilisation quotidien :**
- Mohamed consulte son telephone par intermittence, entre deux reparations, pendant les pauses, ou en fin de journee
- Ses mains sont souvent sales (graisse, peinture, poussiere) ou gantees
- Il porte potentiellement des gants fins de protection pour certaines operations
- Son telephone est souvent pose sur un etabli, un comptoir, ou dans une poche de combinaison
- L'environnement de l'atelier est bruyant (compresseur, ponceuse, ventilation de la cabine de peinture)
- La luminosite est variable (atelier sombre vs. exterieur lumineux)
- Les sessions sont courtes (30 secondes a 2 minutes) et frequemment interrompues

**Modele d'usage iPhone :**

| Moment de la journee | Type d'usage | Duree | Contexte |
|---------------------|-------------|-------|----------|
| 7h30-8h00 (avant ouverture) | Consultation des nouveaux dossiers, planification de la journee | 5-10 min | Bureau, mains propres, calme |
| 10h00-10h15 (pause) | Verification rapide des notifications, reponse a un client | 2-3 min | Atelier, mains possiblement sales |
| 12h00-13h00 (dejeuner) | Session plus longue : gestion du planning, mise a jour des statuts | 10-15 min | Bureau ou exterieur, mains propres |
| 15h00-15h30 | Verification rapide | 1-2 min | Atelier |
| 18h00-18h30 (fermeture) | Bilan de journee, mises a jour de statut, consultation lendemain | 5-10 min | Bureau, mains propres |
| Soir (20h-21h) | Consultation occasionnelle depuis le domicile | 5 min | Canape, detendu |

**Implications iOS 26 specifiques pour Mohamed :**

| Fonctionnalite iOS | Usage pour Mohamed | Moment du parcours |
|-------------------|-------------------|-------------------|
| **Push Notifications avec actions** | Notification "Nouveau sinistre dans votre zone" avec boutons d'action directe : "Voir le dossier" / "Ignorer". Sans ouvrir l'app. | Consultation sinistres (US05) |
| **Interactive Widgets** | Widget sur l'ecran d'accueil montrant le nombre de dossiers en attente, le prochain rendez-vous du jour. Bouton pour marquer un statut comme "termine" directement depuis le widget. | Gestion quotidienne (US06, US07) |
| **Haptic Feedback** | Confirmation tactile lors de l'acceptation d'un dossier ou du changement de statut. Important quand l'ecran n'est pas facilement lisible (mains sales, soleil). | US05, US07 |
| **Large Touch Targets** | Les boutons d'action critique (accepter/refuser, changer statut) doivent etre grands (60x60pt minimum) pour une utilisation avec des doigts epais ou des gants fins. | Tout le portail |
| **Badge App Icon** | Le badge sur l'icone de l'app indiquant le nombre de nouveaux dossiers/messages. Signal visuel sans ouvrir l'app. | Consultation (US05) |
| **Siri Shortcuts** | "Dis Siri, combien de rendez-vous aujourd'hui ?" -- reponse rapide sans toucher le telephone. | Planning (US06) |
| **Calendar Integration (EventKit)** | Synchronisation optionnelle des rendez-vous de depot vehicule avec l'app Calendrier iOS. Mohamed utilise probablement deja Calendrier pour ses rendez-vous personnels. | Planning (US06) |
| **Quick Actions (3D Touch / Haptic Touch)** | Appui long sur l'icone Carlib : "Nouveau dossiers", "Planning du jour", "Mettre a jour un statut". Raccourcis contextuels sans navigation. | Acces rapide transversal |
| **Camera API** | Prise de photos de la reception du vehicule, des etapes de reparation, du vehicule repare. Documentation visuelle du travail. | Prise en charge (US05) + MAJ statut (US07) |
| **Share Sheet** | Partage du recapitulatif de reparation avec le conducteur via iMessage, WhatsApp, ou email. Utilisation du systeme de partage natif iOS. | Fin de reparation |

#### Risque d'adoption specifique iOS

Mohamed n'est pas necessairement un utilisateur iPhone. En France, la repartition iOS/Android est d'environ 30% iOS / 70% Android (source : StatCounter France 2025). Le choix iOS-only du projet signifie que Carlib exclut structurellement environ 70% des gerants de garage potentiels.

**Implications :**
- La strategie de recrutement des garages doit identifier les gerants utilisant un iPhone, ou les garages ou au moins un employe/gerant possede un iPhone
- Si le garage fonctionne avec une seule personne ayant acces a un iPhone, cette personne devient le point de contact unique avec Carlib
- Ce choix iOS-only est acceptable pour un MVP de validation de concept, mais devra etre reconsidere pour le scale (V2)
- Alternative a considerer : un portail web responsive pour les garages en complement de l'app iOS (question ouverte #3 du PRD)

---

### 2.3 Comparaison des modeles d'usage iOS

| Dimension | Laurent (Conducteur) | Mohamed (Garage) |
|-----------|---------------------|-----------------|
| Frequence d'usage | Tres rare (1 fois tous les 5-10 ans) | Quotidien (si actif sur Carlib) |
| Duree de session | Variable : 5-15 min (declaration), 1 min (check statut) | 1-2 min (check rapide), 10-15 min (gestion planning) |
| Contexte d'usage | Exterieur (accident), domicile (suivi) | Atelier (mains sales), bureau (gestion) |
| Etat emotionnel | Stress eleve -> anxiete modere -> soulagement | Neutre -> pression (volume) -> satisfaction |
| Canal principal de re-engagement | Push notification | Push notification + Badge + Widget |
| Tolerance a la complexite | Tres faible (stress) | Moderee (professionnel habitue aux outils) |
| Attente de rapidite | Immediate (chaque seconde compte emotionnellement) | Rapide mais tolerant (30 sec pour une action est acceptable) |
| Mode d'interaction prefere | Tap + scroll, une main | Tap + scroll, potentiellement deux mains ou doigts epais |

---

## 3. Cartographies de Parcours Utilisateurs

### 3.1 Parcours Laurent -- Conducteur sinistre (avec points d'integration iOS 26)

```
PHASE 0             PHASE 1             PHASE 2              PHASE 3              PHASE 4              PHASE 5
PRE-INSTALLATION    ACCIDENT            DECLARATION          SELECTION GARAGE     RESERVATION          SUIVI REPARATION
                    (hors app)          (dans app)           (dans app)           (dans app)           (dans app + hors app)

[Decouverte         [Accident]          [Ouvre Carlib]       [Carte + Liste       [Selectionne         [Recoit notif
 Carlib]                |                    |                garages]              creneau]             push statut]
    |                   v                    v                    |                    |                    |
    v               [Securite /          [Etape 1:                v                    v                    v
[Installation        constat /            Type de             [Filtre par          [Confirme            [Voit Live
 App Store]          appel urgence]       sinistre]            distance,            rendez-vous]         Activity sur
    |                   |                    |                 dispo, avis]             |                 lock screen]
    v                   v                    v                    |                    v                    |
[Onboarding         [Appel               [Etape 2:               v               [Recoit recap         v
 rapide :            assurance]           Photos guidees      [Consulte fiche      par notif +          [Consulte
 vehicule,               |                avec overlay         garage detail]       dans app]            widget sur
 permis,                 v                 camera]                 |                    |                 ecran accueil]
 immatriculation]   [Se rappelle              |                   v                    v                    |
    |                "j'ai Carlib"]           v               [Selectionne          [Rappel RDV              v
    v                   |               [Etape 3:              garage]              veille par           [Statut change:
[Profil pre-            v                Infos vehicule           |                 notif]                notif push
 rempli pret]      [Ouvre Carlib]        pre-remplies         [Transmission            |                 + Live Activity
                        |                par profil]           dossier auto         [Depose                update]
                        v                    |                 -> notif garage]      vehicule]               |
                   [Ecran d'accueil          v                                                              v
                    contextuel :         [Etape 4:                                                     [Reparation
                    "Declarer un          Localisation                                                  terminee :
                    sinistre"]            auto via                                                       notif +
                                          CoreLocation]                                                 Live Activity
                                              |                                                         "TERMINE"]
                                              v                                                             |
                                         [Recapitulatif                                                     v
                                          + Envoi]                                                     [Recuperation
                                                                                                        vehicule]
                                                                                                            |
                                                                                                            v
                                                                                                       [Evaluation
                                                                                                        garage
                                                                                                        in-app]
```

#### Points d'integration iOS 26 par phase

**Phase 0 -- Pre-installation :**
- **App Clips :** Possibilite de creer un App Clip accessible via NFC (tag dans les garages partenaires) ou QR code, permettant une declaration rapide sans installation complete. Le conducteur peut commencer sa declaration via App Clip puis etre invite a installer l'app complete.
- **App Store Optimization (ASO) :** Mots-cles francais : "sinistre auto", "accident voiture", "carrossier", "reparation vehicule", "constat". Captures d'ecran en francais montrant le parcours de declaration.
- **App Intents / Spotlight :** Une fois installee, l'app est indexable par Spotlight. "Declarer un sinistre" apparait dans les suggestions Spotlight.

**Phase 1 -- Accident (hors app) :**
- Aucune interaction Carlib a ce stade. Le conducteur gere la securite, le constat, l'appel aux urgences/assurance.
- L'app pourrait afficher une **notification locale programmee** si le conducteur a active la localisation et qu'un impact brusque est detecte (via CoreMotion -- attention : risque de faux positifs, ethique, vie privee). **Recommandation : ne pas implementer en MVP.** Trop intrusif et techniquement fragile.

**Phase 2 -- Declaration :**
- **PhotosUI / Camera :** Capture guidee avec overlay montrant les angles a photographier (face avant, arriere, cote gauche, cote droit, detail du dommage). Utiliser `CameraOutput` pour le live preview avec guides visuels. Proposer aussi `PhotosPicker` pour ajouter des photos deja prises (si le conducteur a photographie les degats avant d'ouvrir Carlib).
- **CoreLocation :** `CLLocationManager.requestWhenInUseAuthorization()` pour localiser le lieu de l'accident. Reverse geocoding pour afficher l'adresse. Pre-remplissage.
- **Haptic Feedback :** `UINotificationFeedbackGenerator.notificationOccurred(.success)` a chaque etape validee. Rassure le conducteur sans bruit (important si l'environnement est deja bruyant).
- **SwiftUI Navigation :** Utiliser `NavigationStack` avec un indicateur de progression en 4 etapes (ProgressView ou custom stepper). La navigation doit etre lineaire avec possibilite de retour. Pas de TabView a ce stade -- le conducteur est dans un tunnel de declaration.
- **Accessibilite :** `accessibilityLabel` et `accessibilityHint` en francais sur chaque element. Dynamic Type supporte pour les textes. Contraste minimum AAA pour les textes critiques.

**Phase 3 -- Selection garage :**
- **MapKit pour SwiftUI :** `Map` view avec annotations personnalisees pour chaque garage. Clustering automatique si beaucoup de garages. `MKRoute` pour afficher la distance/temps de trajet. Bouton "Ouvrir dans Plans" pour la navigation vers le garage.
- **SwiftUI List avec filtres :** Liste scrollable avec filtres (distance, disponibilite, specialite, note). Utiliser `.searchable()` modifier pour la recherche textuelle. `.refreshable()` pour le pull-to-refresh.
- **Transition carte/liste :** Segmented control ou toggle entre vue carte et vue liste. Animation fluide avec `matchedGeometryEffect` si la fiche garage s'ouvre depuis la carte ou la liste.

**Phase 4 -- Reservation :**
- **EventKit :** Proposer d'ajouter le rendez-vous de depot au calendrier iOS du conducteur. `EKEventEditViewController` ou creation directe avec confirmation.
- **Push Notification :** Notification de confirmation immediate. Notification de rappel la veille du rendez-vous.
- **Haptic Feedback :** Feedback fort (`UIImpactFeedbackGenerator(.heavy)`) lors de la confirmation definitive de reservation. Moment de soulagement pour le conducteur.

**Phase 5 -- Suivi reparation :**
- **Live Activities (ActivityKit) :** L'activite en direct demarre des que le vehicule est depose. Affiche sur l'ecran de verrouillage et la Dynamic Island : nom du garage, statut actuel ("En attente" / "Pris en charge" / "En reparation" / "Termine"), estimation de duree. Mise a jour via push notifications ActivityKit.
- **WidgetKit :** Widget Small (systeme d'icone + statut textuel), Widget Medium (statut + nom garage + prochaine etape estimee). Interactive Widget : bouton "Appeler le garage" directement depuis le widget.
- **StandBy Mode :** L'activite en direct s'affiche en StandBy quand le telephone est en charge horizontal. Laurent pose son telephone sur son bureau et voit le statut sans interaction.
- **Push Notifications :** Chaque changement de statut genere une notification avec son, badge, et contenu riche (image du vehicule si le garage ajoute une photo d'avancement).
- **Siri / App Intents :** `AppIntent` pour "Ou en est ma reparation" -- Siri repond vocalement avec le statut actuel et le nom du garage.

---

### 3.2 Parcours Mohamed -- Gerant de carrosserie (avec points d'integration iOS 26)

```
PHASE 0              PHASE 1              PHASE 2              PHASE 3              PHASE 4
INSCRIPTION          CONSULTATION         PRISE EN CHARGE      GESTION PLANNING     MAJ STATUT
                     SINISTRES

[Telecharge          [Recoit notif        [Ouvre dossier       [Voit planning       [Bouton
 Carlib]              "Nouveau sinistre    complet :             semaine]             changement
    |                  dans votre zone"]    photos, type,           |                 statut :
    v                      |                vehicule,              v                  1 tap]
[Onboarding              v                 localisation]      [Ajoute/bloque            |
 guide :            [Ouvre l'app               |                creneaux]               v
 profil garage,      ou tap sur la             v                    |               [Notif auto
 photos atelier,     notification]        [Decide               [Synchro avec        envoyee au
 specialites,            |                 accepter              reservations          conducteur]
 zone                    v                 ou refuser]           entrantes]               |
 d'intervention]    [Liste des                 |                    |                    v
    |                 sinistres                 v                    v               [Photo
    v                 filtree par          [Accepte :           [Widget :             d'avancement
[Definit              zone et type]        notif auto           "3 RDV                optionnelle
 disponibilites          |                 au conducteur,       aujourd'hui"]         jointe]
 planning :              v                 dossier ajoute
 calendrier          [Badge app :          au planning]
 semaine]             "3 nouveaux"]
    |
    v
[Profil
 publie]
```

#### Points d'integration iOS 26 par phase

**Phase 0 -- Inscription :**
- **Camera API :** Prise de photos de l'atelier, de la cabine de peinture, de l'equipe. Photos professionnelles du garage. Guidage avec overlay ("Prenez une photo de votre espace de reception").
- **CoreLocation :** Localisation automatique du garage pour definir l'adresse et la zone d'intervention. Carte `MapKit` pour definir/ajuster le rayon d'intervention.
- **Onboarding progressif :** Ne pas demander toutes les informations d'un coup. Profil minimum (nom, adresse, 1 photo, specialites) puis enrichissement ulterieur. Utiliser `@AppStorage` pour persister l'etat d'avancement de l'onboarding.

**Phase 1 -- Consultation sinistres :**
- **Push Notifications avec actions :** Notification riche : "Nouveau sinistre a 2.3 km -- Audi A3, accrochage lateral". Actions directes : "Voir le dossier" / "Pas interesse". L'action "Pas interesse" evite d'ouvrir l'app.
- **Badge App Icon :** Nombre de dossiers non consultes affiche sur l'icone.
- **Widget :** Widget Medium affichant le nombre de nouveaux sinistres et le prochain rendez-vous du jour. Tap sur le widget ouvre directement la liste des sinistres.

**Phase 2 -- Prise en charge :**
- **Haptic Feedback :** Confirmation forte lors de l'acceptation d'un dossier. Le geste d'acceptation doit etre delibere (swipe + confirmation, pas un simple tap accidentel).
- **Confirmation modale :** Utiliser `.confirmationDialog()` ou `.alert()` en SwiftUI pour eviter les acceptations accidentelles.

**Phase 3 -- Gestion planning :**
- **EventKit integration :** Possibilite de synchroniser les rendez-vous Carlib avec le calendrier iOS. Lecture des disponibilites existantes pour eviter les conflits.
- **SwiftUI Calendar-style view :** Vue semaine avec les creneaux disponibles/bloques. Les creneaux reserves via Carlib sont visuellement distincts. Interaction par tap pour bloquer/debloquer un creneau.
- **Interactive Widget :** Widget Large montrant le planning du jour avec les rendez-vous. Aucune interaction requise -- simple consultation visuelle rapide.

**Phase 4 -- Mise a jour statut :**
- **Interface minimale :** Un seul ecran avec le dossier en cours, un selecteur de statut (segmented control ou menu deroulant), et un bouton "Valider". L'action entiere doit prendre moins de 10 secondes.
- **Camera API optionnelle :** Possibilite d'ajouter une photo d'avancement (le vehicule en cours de reparation). Le conducteur recoit la photo dans la notification.
- **Siri Shortcuts :** "Dis Siri, mets a jour le statut de la reparation du dossier 42." Integration avec les raccourcis pour les actions repetitives.

---

### 3.3 Courbes emotionnelles avec touchpoints iOS

#### Laurent -- Courbe emotionnelle

```
Emotion
  ^
  |
5 |                                                                              *
  |                                                                           (Vehicule
4 |                                                            *               recupere)
  |                                                        (RDV confirme,
3 |                                    *                    rappel notif)
  |                                (Trouve garage
2 |        *                        sur la carte,
  |    (Ouvre Carlib,               bon avis)
1 |     ecran rassurant)
  |
0 |---------------------------------------------------------------------->  Temps
  |
-1|  *
  |(Accident,
-2| stress, peur)
  |
-3|
  +-------------------------------------------------------->
        t0      t+10min    t+1h     t+2h    t+1j     t+3j    t+7j
```

**Touchpoints iOS cles par moment emotionnel :**
- **t0 (point le plus bas) :** L'app ne peut rien faire ici. Le conducteur ne pense pas a Carlib.
- **t+10min (leger remontre) :** Si le conducteur a Carlib installe, l'ecran d'accueil doit etre extremement clair. Un seul bouton principal : "Declarer un sinistre". Aucun bruit visuel.
- **t+1h (declaration) :** Chaque etape validee = feedback haptique + animation de progression. Le sentiment de "ca avance" est crucial.
- **t+2h (selection garage) :** La carte MapKit avec les garages proches genere un soulagement ("il y a des options pres de chez moi"). Les avis et photos du garage construisent la confiance.
- **t+1j (RDV confirme) :** La notification de confirmation avec ajout au calendrier est un moment de soulagement fort. Live Activity demarre.
- **t+3j-7j (suivi) :** La Live Activity sur l'ecran de verrouillage maintient le sentiment de controle. Chaque notification de changement de statut reduit l'anxiete.
- **t+7j+ (recuperation) :** Notification "Votre vehicule est pret !" avec confettis ou animation celebratoire dans l'app. Demande d'evaluation.

---

## 4. Lacunes de Recherche & Risques pour l'Implementation iOS

### 4.1 Lacunes du PRD par rapport a une implementation iOS native

| # | Lacune | Impact iOS | Severite | Recommandation |
|---|--------|-----------|----------|----------------|
| iOS-L1 | **Aucune mention d'architecture technique.** Le PRD est un document de design UX/UI, ce qui est normal, mais pour une implementation iOS native, les choix architecturaux (MVVM, data flow, persistence) impactent directement l'UX (offline, performance, transitions). | Les decisions d'architecture SwiftUI (NavigationStack vs. NavigationPath, @Observable vs. @StateObject, SwiftData vs. UserDefaults) doivent etre prises en amont du design detaille. | Majeure | Definir l'architecture app (MVVM + SwiftData + Swift Concurrency) en parallele du design Phase 1. |
| iOS-L2 | **Aucune strategie de backend/API.** Le PRD mentionne "transmission automatique" (US09) et "notifications push" (US04, US07) mais ne definit pas l'infrastructure sous-jacente. | Sans backend, il n'y a pas de notifications push, pas de Live Activities mises a jour a distance, pas de synchronisation temps reel. La contrainte "zero dependance externe" s'applique-t-elle aussi au backend ? | Critique | Clarifier immediatement : le "zero dependance externe" concerne-t-il uniquement les packages Swift ou aussi les services backend (Firebase, Supabase, serveur custom) ? |
| iOS-L3 | **Pas de strategie offline/degradee.** Le conducteur peut ne pas avoir de reseau au moment de l'accident (zone blanche, tunnel, parking souterrain). | En SwiftUI, il faut implementer une strategie de cache local (SwiftData), de queue d'envoi differe, et d'indicateurs visuels de l'etat de connectivite. | Majeure | Designer un mode "brouillon local" pour la declaration, avec synchronisation automatique quand le reseau revient. |
| iOS-L4 | **Pas de specification pour les etats d'erreur.** Le PRD mentionne la necessaire representation des etats vides, erreurs, et chargement (DoD section 8), mais ne les detaille pas. | En SwiftUI, chaque ecran a au minimum 5 etats : loading, loaded, empty, error, et offline. Le design doit les prevoir tous. | Majeure | Definir un systeme d'etats standard pour l'app : `ContentUnavailableView` pour les etats vides, `ProgressView` pour le chargement, vues d'erreur personnalisees avec retry. |
| iOS-L5 | **Pas de specification de la navigation globale.** Le PRD montre 10 user stories mais pas comment elles s'articulent dans l'app. TabView ? NavigationStack ? Sidebar ? | Le choix de la structure de navigation SwiftUI (TabView avec 3-4 onglets vs. single NavigationStack) est une decision fondamentale qui impacte tout le design. | Critique | Definir la structure de navigation : Tab 1 = Mes sinistres (declaration + suivi), Tab 2 = Garages (carte + liste), Tab 3 = Profil. Pour le garage : Tab 1 = Dossiers, Tab 2 = Planning, Tab 3 = Profil. |
| iOS-L6 | **Le PRD mentionne "iOS & Android" (section 3)** mais le CLAUDE.md specifie "iOS 26 only". | Contradiction. Si le PRD a ete ecrit avant le choix iOS-only, certains designs prevus pour Android (Material Design patterns) ne sont pas pertinents. | Moyenne | Confirmer le choix iOS-only et adapter toute la reflexion UX aux conventions Apple (Human Interface Guidelines iOS 26). |
| iOS-L7 | **Aucune mention du modele de donnees local.** Quelles donnees persistent sur l'appareil ? Le profil vehicule ? L'historique des sinistres ? Les photos ? | SwiftData (ou @AppStorage pour les preferences) doit etre planifie. Le stockage local des photos peut consommer beaucoup d'espace. | Moyenne | Definir la politique de stockage : photos compressees et uploadees puis supprimees localement, profil vehicule en SwiftData, preferences en @AppStorage. |
| iOS-L8 | **Pas de reflexion sur le partage app conducteur / portail garage.** Le PRD parle d'une "double interface coherente" mais est-ce une seule app avec un role switcher ou deux apps separees ? | En SwiftUI, une seule app avec un `@AppStorage("userRole")` et un branchement conditionnel dans le `@main` App est possible, mais complexifie la maintenance. Deux targets dans le meme projet Xcode est une alternative. | Majeure | Recommandation : une seule app avec choix du role a l'onboarding. Plus simple pour le MVP. Le design system est partage, seuls les onglets TabView changent selon le role. |
| iOS-L9 | **Pas de strategie d'authentification.** Comment le conducteur et le garage se connectent-ils ? Email/password ? Apple Sign In ? Pas de login ? | "Sign in with Apple" est requis par Apple si l'app propose un login tiers. C'est aussi le plus fluide pour les utilisateurs iOS. | Majeure | Implementer "Sign in with Apple" comme methode principale + email/password en secondaire. Pour le MVP, un onboarding sans compte (donnees locales) avec creation de compte optionnelle pourrait reduire la friction. |
| iOS-L10 | **Pas de specification de la localisation/internationalisation.** Le PRD dit "entierement en francais" mais ne precise pas si les textes sont hardcodes ou dans des fichiers Localizable. | En SwiftUI, les String Catalogs (.xcstrings) facilitent la localisation. Meme en francais uniquement, utiliser `LocalizedStringKey` des le depart permet une future localisation sans refactoring. | Faible (MVP) | Utiliser les String Catalogs (.xcstrings) et `LocalizedStringKey` des le debut, meme avec le francais comme seule langue. |

### 4.2 Risques specifiques iOS

| # | Risque | Probabilite | Impact | Mitigation |
|---|--------|------------|--------|------------|
| R1 | **Le choix iOS-only exclut 70% du marche francais.** La part de marche iOS en France est d'environ 30%. | Certaine | Eleve pour le scale, faible pour la validation MVP | Acceptable en MVP pour valider le concept. Planifier le portage Android ou le developpement web responsif pour V2. Pour les garages, considerer un portail web en complement. |
| R2 | **iOS 26 est tres recent (WWDC juin 2025, release septembre 2025).** Exiger iOS 26 minimum exclut les utilisateurs qui n'ont pas mis a jour leur iPhone. | Elevee (en avril 2026, environ 70-80% des iPhones compatibles sont a jour) | Moyen | Evaluer si iOS 25 (iOS 18) comme target minimum est viable. Les fonctionnalites iOS 26 specifiques (nouvelles APIs) peuvent etre conditionnees avec `if #available(iOS 26, *)`. |
| R3 | **La contrainte "zero dependance externe" limite les fonctionnalites.** Pas de Firebase (notifications, analytics, auth, base de donnees temps reel), pas de SDKs d'analytics, pas de Kingfisher (images), pas d'Alamofire (reseau). | Certaine | Moyen | Les frameworks natifs couvrent la plupart des besoins : URLSession (reseau), SwiftData (persistence), APNs direct (notifications), AsyncImage (images). Mais cela necessite plus de code custom et de tests. |
| R4 | **Les Live Activities ont des limitations techniques.** Mise a jour maximale 1x par heure via push, contenu limite, fin automatique apres 8h sans mise a jour (12h sur lock screen). | Certaine | Moyen | Pour le suivi de reparation (qui dure des jours), la Live Activity devra etre renouvelee periodiquement ou utilisee uniquement pour les transitions de statut (pas comme affichage permanent). Un Widget est plus adapte pour le suivi long-terme. |
| R5 | **Le guidage photo camera necessite un overlay custom.** Les APIs camera standard ne fournissent pas d'overlay de guidage natif. | Certaine | Faible | Creer un `CameraView` custom en SwiftUI avec des overlays semi-transparents indiquant les angles de prise de vue. Utiliser `AVCaptureSession` si `CameraOutput` ne suffit pas. |
| R6 | **Les permissions iOS (camera, localisation, notifications) peuvent etre refusees.** Le conducteur peut refuser l'acces a la camera, a la localisation, ou aux notifications. | Elevee | Eleve | Designer un parcours complet pour chaque cas de refus de permission. Camera refusee : permettre l'upload depuis la galerie (PhotosPicker). Localisation refusee : saisie manuelle de l'adresse. Notifications refusees : suivi uniquement dans l'app + email. |
| R7 | **La performance de MapKit avec de nombreuses annotations.** Si la zone couvre des centaines de garages, la carte peut devenir lente. | Faible (au lancement) | Faible | Utiliser le clustering natif MapKit. Limiter le nombre d'annotations affichees simultanement. Charger par zone visible. |

---

## 5. Carte d'Opportunites iOS 26

### 5.1 Mapping User Stories vers fonctionnalites iOS 26

| User Story | Fonctionnalite iOS 26 | Priorite MVP | Effort | Impact UX |
|-----------|----------------------|-------------|--------|-----------|
| **US01** -- Declaration sinistre (4 etapes) | `PhotosUI` / `CameraOutput` pour la capture photo guidee | P0 | Moyen | Tres eleve |
| **US01** -- Declaration sinistre | `CoreLocation` pour la localisation automatique du lieu d'accident | P0 | Faible | Eleve |
| **US01** -- Declaration sinistre | `NavigationStack` avec `ProgressView` stepper (4 etapes) | P0 | Faible | Eleve |
| **US01** -- Declaration sinistre | Haptic feedback a chaque validation d'etape | P0 | Tres faible | Moyen |
| **US02** -- Liste garages a proximite | `MapKit` SwiftUI (`Map`, `Annotation`, `MKRoute`) | P0 | Moyen | Tres eleve |
| **US02** -- Liste garages a proximite | `.searchable()` modifier pour la recherche/filtre | P0 | Faible | Eleve |
| **US02** -- Liste garages a proximite | `AsyncImage` pour les photos de garage | P0 | Faible | Moyen |
| **US03** -- Reservation creneau | `EventKit` pour ajout au calendrier iOS | P1 | Faible | Moyen |
| **US03** -- Reservation creneau | Push notification de confirmation + rappel | P0 | Moyen (necessite backend APNs) | Eleve |
| **US04** -- Suivi reparation temps reel | **Live Activities (ActivityKit)** -- Dynamic Island + Lock Screen | P0 | Eleve | Tres eleve -- differenciateur |
| **US04** -- Suivi reparation temps reel | **WidgetKit** -- Widget Small + Medium sur ecran d'accueil | P1 | Moyen | Eleve |
| **US04** -- Suivi reparation temps reel | **StandBy Mode** (via Live Activity) | P1 | Tres faible (automatique si Live Activity) | Moyen |
| **US04** -- Suivi reparation temps reel | `App Intents` pour Siri ("Ou en est ma reparation ?") | P2 | Moyen | Moyen |
| **US05** -- Consultation sinistres (garage) | Push notifications avec actions (voir / ignorer) | P0 | Moyen | Eleve |
| **US05** -- Consultation sinistres (garage) | Badge app icon pour dossiers non lus | P0 | Tres faible | Moyen |
| **US06** -- Planning garage | Vue calendrier SwiftUI custom | P0 | Eleve | Eleve |
| **US06** -- Planning garage | `EventKit` synchronisation optionnelle | P2 | Moyen | Faible |
| **US07** -- MAJ statut | Interface minimale (1 tap + confirmation) | P0 | Faible | Tres eleve |
| **US07** -- MAJ statut | Push notification automatique au conducteur | P0 | Moyen | Tres eleve |
| **US08** -- Profil garage | Camera API pour photos atelier | P0 | Faible | Moyen |
| **US08** -- Profil garage | MapKit pour zone d'intervention | P1 | Faible | Moyen |
| **US09** -- Transmission auto | Confirmation in-app + push notification garage | P0 | Moyen | Eleve |
| **US10** -- Landing page | Hors scope iOS natif (page web) | -- | -- | -- |

### 5.2 Fonctionnalites iOS 26 differenciantes (par rapport a la concurrence)

Les fonctionnalites suivantes n'existent dans aucune app concurrente en France et constituent un avantage competitif natif :

**Tier 1 -- Differenciateurs majeurs (MVP) :**

1. **Live Activities pour le suivi de reparation**
   - Aucun concurrent ne propose un suivi de reparation en temps reel sur l'ecran de verrouillage
   - Le conducteur voit "En reparation -- Garage Mohamed D. -- Jour 3" sans deverrouiller son telephone
   - La Dynamic Island montre une icone de progression compacte en permanence
   - C'est le meilleur usage des Live Activities pour une app de service : un processus long-duree avec des changements d'etat discrets
   - **SwiftUI :** Definir un `ActivityAttributes` struct avec les proprietes statiques (nom garage, type sinistre) et dynamiques (statut, date estimee de fin)

2. **Guidage photo camera avec overlay**
   - L'app e-Constat ne guide pas la prise de photos
   - Carlib peut afficher un overlay semi-transparent montrant exactement quel angle photographier
   - Sequence : "Photo 1/5 : Vue d'ensemble avant" -> "Photo 2/5 : Vue d'ensemble arriere" -> "Photo 3/5 : Detail du dommage principal" -> etc.
   - **SwiftUI :** `ZStack` avec la preview camera en fond et les guides en overlay

3. **Carte MapKit native avec garages**
   - Les concurrents (iDGarages, Vroomly) utilisent des Google Maps embeddees dans un webview
   - Carlib peut utiliser MapKit natif SwiftUI avec les derniers styles de carte, le clustering, et les annotations personnalisees
   - L'itineraire vers le garage et le temps de trajet sont calcules nativement
   - L'ouverture dans Plans Apple pour la navigation est un geste fluide
   - **SwiftUI :** `Map(position: $position) { ForEach(garages) { Annotation } }` avec `MKDirections` pour les itineraires

**Tier 2 -- Differenciateurs moyens (Post-MVP) :**

4. **Interactive Widgets**
   - Widget conducteur : statut de reparation + bouton "Appeler le garage"
   - Widget garage : nombre de dossiers en attente + prochain rendez-vous
   - Les widgets interactifs iOS 17+ permettent des actions sans ouvrir l'app
   - **SwiftUI :** `Button` et `Toggle` dans les vues Widget avec `AppIntent` pour l'action

5. **App Intents / Siri**
   - "Dis Siri, ou en est ma reparation ?" -- reponse vocale en francais
   - "Dis Siri, combien de nouveaux dossiers ?" (pour Mohamed)
   - Raccourcis Siri configurables par l'utilisateur
   - **SwiftUI :** `AppIntent` protocol avec `@Parameter` pour les entites (sinistre, garage)

6. **StandBy Mode**
   - Le statut de reparation s'affiche en grand quand le telephone est en charge horizontal
   - Ideal pour Laurent au bureau ou Mohamed au comptoir du garage
   - Gratuit si les Live Activities sont implementees (StandBy affiche les Live Activities automatiquement)

**Tier 3 -- Opportunites exploratoires (V2+) :**

7. **App Clips**
   - Un garage partenaire affiche un QR code ou un tag NFC dans sa vitrine
   - Un conducteur sans Carlib scanne le code et accede a un App Clip permettant de declarer rapidement un sinistre ou de consulter le profil du garage
   - Passerelle vers l'installation complete

8. **SharePlay / Activity Sharing**
   - Un conducteur partage le suivi de reparation avec un proche (conjoint, parent)
   - Le proche voit le meme statut en temps reel dans sa propre app Carlib
   - Utile quand le conducteur n'est pas le proprietaire du vehicule

9. **CoreMotion / CarPlay (tres speculatif)**
   - Detection d'impact via l'accelerometre (comme la detection de crash d'Apple)
   - Absolument pas recommande en MVP : complexite extreme, faux positifs, questions ethiques et legales

---

## 6. Cold Start & Etats Vides

### 6.1 Le probleme de la poule et de l'oeuf

Le cold start est le risque existentiel n1 de Carlib. C'est une marketplace bilaterale : sans garages, les conducteurs ne trouvent aucune offre ; sans conducteurs, les garages ne recoivent aucun dossier.

**Specifites iOS du cold start :**
- Sur iOS, un utilisateur qui ouvre une app vide la supprime dans les 24-48 heures
- Le taux de retention J1 moyen sur iOS en France est de 25-30% (source : AppsFlyer). Pour une app de niche/service, il descend a 15-20%
- Un conducteur qui installe Carlib en "preparation" (avant un sinistre) n'aura AUCUNE raison de revenir pendant des mois/annees. L'app sera supprimee par iOS (offloading automatique) ou par l'utilisateur
- Un garage qui s'inscrit et ne recoit aucun dossier pendant 2 semaines desinstallera l'app

### 6.2 Strategie de resolution du cold start

**Phase 1 : Demarrer par l'offre (garages)**

Le client dispose deja d'une experience terrain dans le secteur carrosserie et a initie une demarche commerciale aupres des garages (mentionne dans le PRD). C'est le bon levier.

Objectif : 20-30 garages partenaires dans une zone geographique concentree (une ville ou une agglomeration) AVANT le lancement conducteur.

Actions :
1. Onboarding personnalise de chaque garage (pas d'auto-inscription froide)
2. Le garage recoit l'app avec son profil pre-rempli (photos prises par l'equipe Carlib lors de la visite)
3. Engagement moral : "Vous recevrez vos premiers dossiers dans les 2 semaines suivant le lancement"
4. Les garages deviennent le premier canal d'acquisition conducteur (voir ci-dessous)

**Phase 2 : Les garages comme canal d'acquisition conducteur**

C'est la strategie la plus efficace pour une app iOS de niche :
1. Chaque garage partenaire recoit du materiel physique : sticker vitrine avec QR code App Store, cartes de visite avec lien Carlib, affichette salle d'attente
2. Le garage recommande Carlib a ses clients existants : "La prochaine fois que vous avez un accrochage, utilisez Carlib pour nous contacter directement"
3. Le garage partage le lien Carlib sur ses reseaux sociaux et sa fiche Google
4. **App Clips integration :** Un tag NFC ou QR code dans la vitrine du garage permet a n'importe quel passant de decouvrir le garage et Carlib sans installer l'app

**Phase 3 : Gerer le vide initial pour les conducteurs (dans l'app)**

Meme avec la strategie ci-dessus, les premiers conducteurs qui installent Carlib verront une carte avec peu de garages et n'auront probablement pas de sinistre en cours. L'app doit gerer cet etat.

### 6.3 Design des etats vides en SwiftUI

Chaque ecran de l'app a un etat vide specifique qui doit etre designe et implemente :

**Ecran "Mes sinistres" (conducteur, aucun sinistre en cours) :**
```
ContentUnavailableView {
    Label("Aucun sinistre en cours", systemImage: "car.fill")
} description: {
    Text("Preparez-vous pour le jour J en completant votre profil vehicule.")
} actions: {
    Button("Completer mon profil") { ... }
}
```
- Utiliser `ContentUnavailableView` natif iOS 17+ pour un etat vide conforme aux conventions Apple
- Proposer une action : completer le profil vehicule (immatriculation, marque, modele, photos du vehicule en bon etat)
- Afficher un message rassurant, pas anxiogene : "Votre vehicule est en securite" plutot que "Rien ici pour l'instant"

**Ecran "Carte des garages" (conducteur, peu de garages) :**
- Meme avec 3 garages sur la carte, l'ecran ne doit pas paraitre vide
- Ajuster le zoom de la carte pour que les garages disponibles remplissent visuellement la vue
- Ajouter un bandeau : "De nouveaux garages rejoignent Carlib chaque semaine"
- Si aucun garage dans un rayon de 30 km : proposer d'elargir la zone ou d'etre notifie quand un garage s'inscrit a proximite

**Ecran "Dossiers disponibles" (garage, aucun sinistre) :**
```
ContentUnavailableView {
    Label("Aucun nouveau dossier", systemImage: "doc.text.magnifyingglass")
} description: {
    Text("Les sinistres de votre zone apparaitront ici. Verifiez que votre zone d'intervention est bien configuree.")
} actions: {
    Button("Verifier ma zone") { ... }
    Button("Inviter un conducteur") { ... }
}
```
- Proposer au garage d'inviter ses propres clients (lien de partage)
- Afficher des statistiques de la zone : "12 garages actifs dans votre zone, 0 sinistre cette semaine" -> transparence totale
- Ne pas simuler de faux dossiers. La confiance se construit sur la transparence.

**Ecran "Planning" (garage, aucun rendez-vous) :**
- Afficher la semaine avec les creneaux definis mais vides
- Message positif : "Votre planning est configure et pret. Les rendez-vous apparaitront ici."
- Le planning ne doit pas etre vide visuellement meme sans rendez-vous -- les creneaux disponibles sont une information utile

### 6.4 Retention pre-sinistre pour les conducteurs

Le defi unique de Carlib : l'app est utile au moment du sinistre, mais le sinistre est imprevisible et rare. Comment retenir le conducteur entre l'installation et le (potentiel futur) sinistre ?

**Strategies de retention iOS sans denaturer l'app :**

| Strategie | Description | Effort | Risque |
|-----------|------------|--------|--------|
| **Profil vehicule enrichi** | Permettre au conducteur d'enregistrer son vehicule (immatriculation, photos, assureur, numero de contrat). Pre-remplissage pour le jour J. Valeur immediate : "vos infos sont pretes." | Faible | Faible |
| **Checklist "Que faire en cas d'accident"** | Contenu educatif statique. Une page consultable hors ligne. Positionne Carlib comme l'assistant sinistre, pas juste la marketplace. | Tres faible | Aucun |
| **Widget "Infos vehicule"** | Un widget ecran d'accueil avec la plaque, le numero de contrat d'assurance, le numero d'assistance. Utile en cas d'accident meme sans ouvrir Carlib. Maintient la presence de Carlib sur l'ecran d'accueil. | Moyen | Faible |
| **Notifications proactives limitees** | 1 notification par mois maximum : "Rappel : votre profil vehicule est a jour" ou "Nouveau garage partenaire pres de chez vous". Pas de spam. | Faible | Moyen (desinstallation si trop frequent) |
| **Carnet d'entretien (V2)** | Elargir le scope au-dela du sinistre : historique des entretiens, rappels de controle technique, kilometrage. Transforme Carlib en compagnon vehicule. | Eleve | Dilution du positionnement sinistre |

**Recommandation MVP :** Se concentrer sur le profil vehicule enrichi et la checklist. Ce sont deux features a effort minimal qui donnent une raison de garder l'app installee sans denaturer la proposition de valeur.

---

## 7. Metriques de Succes

### 7.1 KPIs App Store

| Metrique | Cible MVP (6 mois) | Cible V1 (12 mois) | Methode de mesure |
|---------|-------------------|--------------------|--------------------|
| Note App Store | >= 4.5/5 | >= 4.5/5 | App Store Connect |
| Nombre d'avis | >= 50 | >= 200 | App Store Connect |
| Taux de conversion App Store (impressions -> installations) | >= 5% | >= 8% | App Store Connect Analytics |
| Taille de l'app | < 30 Mo | < 50 Mo | Xcode |
| Crash rate | < 0.1% | < 0.05% | Xcode Organizer / MetricKit |
| Temps de lancement | < 1.5 secondes | < 1 seconde | MetricKit |

### 7.2 KPIs Engagement Conducteur

| Metrique | Cible MVP | Cible V1 | Notes |
|---------|-----------|----------|-------|
| **Taux de completion de declaration** (% de declarations commencees qui sont finalisees) | >= 70% | >= 85% | Indicateur cle de la qualite du parcours de declaration. Si < 50%, le parcours est trop complexe. |
| **Temps moyen de declaration** | < 8 minutes | < 5 minutes | Du premier tap a l'envoi du recapitulatif. Inclut la prise de photos. |
| **Taux de selection garage** (% de declarations qui aboutissent a un choix de garage) | >= 60% | >= 75% | Depend de la disponibilite de garages dans la zone. |
| **Taux de reservation** (% de selections qui aboutissent a un RDV) | >= 80% | >= 90% | Si le conducteur choisit un garage mais ne reserve pas, c'est un probleme de parcours de reservation. |
| **Taux d'opt-in notifications push** | >= 60% | >= 70% | Critique pour le suivi de reparation. La demande de permission doit etre contextualisee (pas au premier lancement). |
| **Taux d'adoption Live Activity** (% de suivis actifs avec Live Activity visible) | >= 40% | >= 60% | Mesure la visibilite du suivi hors-app. Necessite iOS 16.1+ et opt-in Live Activities. |
| **Taux d'evaluation post-reparation** | >= 30% | >= 50% | Les avis alimentent la confiance pour les futurs conducteurs. |
| **NPS conducteur** | >= 40 | >= 50 | Mesure via enquete in-app post-reparation. |

### 7.3 KPIs Engagement Garage

| Metrique | Cible MVP | Cible V1 | Notes |
|---------|-----------|----------|-------|
| **Nombre de garages actifs** (ayant accepte au moins 1 dossier dans les 30 derniers jours) | >= 15 | >= 50 | "Actif" = pas seulement inscrit, mais ayant reellement traite un dossier. |
| **Taux d'acceptation de dossiers** (% de dossiers vus qui sont acceptes) | >= 40% | >= 50% | Si < 20%, les dossiers ne sont pas pertinents pour les garages (mauvais matching zone/specialite). |
| **Temps de reponse moyen** (entre la reception du dossier et l'acceptation/refus) | < 4 heures | < 2 heures | Pendant les heures ouvrables. Les dossiers recus la nuit sont traites le matin. |
| **Taux de mise a jour de statut** (% de dossiers avec au moins 1 MAJ de statut apres acceptation) | >= 70% | >= 90% | Si le garage n'update pas, le conducteur n'a pas de suivi. C'est un echec fonctionnel. |
| **Taux de retention garage J30** | >= 60% | >= 75% | % de garages encore actifs 30 jours apres l'inscription. |
| **Volume de dossiers par garage par mois** | >= 2 | >= 5 | En dessous de 1, le garage ne percoit pas la valeur. |
| **NPS garage** | >= 30 | >= 40 | Mesure via enquete in-app trimestrielle. |

### 7.4 KPIs Marketplace

| Metrique | Cible MVP | Cible V1 | Notes |
|---------|-----------|----------|-------|
| **Taux de matching** (% de declarations qui trouvent au moins 1 garage dans la zone) | >= 70% | >= 90% | Depend directement de la couverture geographique. |
| **Liquidity ratio** (nombre moyen de garages disponibles par sinistre) | >= 2 | >= 3 | Le conducteur doit avoir un choix reel, pas un seul garage par defaut. |
| **Temps total sinistre-reparation** (de la declaration a la recuperation du vehicule) | Mesure baseline | -20% vs. baseline | Comparer avec le parcours traditionnel (telephone, bouche a oreille). |
| **Taux d'abandon par phase** | Mesure par phase | Optimiser la phase avec le plus haut abandon | Funnel : Declaration -> Selection -> Reservation -> Depot -> Reparation -> Recuperation. |

### 7.5 KPIs Techniques iOS

| Metrique | Cible | Methode |
|---------|-------|---------|
| **Crash-free sessions** | >= 99.9% | MetricKit / Xcode Organizer |
| **Hang rate** (duree > 250ms sur le main thread) | < 1% des sessions | MetricKit `MXHangDiagnostic` |
| **Memory footprint** | < 100 Mo en pointe | MetricKit `MXMemoryMetric` |
| **Disk writes** | < 50 Mo par session | MetricKit `MXDiskWriteMetric` |
| **Battery impact** (surtout pour les Live Activities et la localisation) | "Low" dans Battery Usage de Reglages | MetricKit `MXCPUMetric` + tests terrain |
| **Taux de success des push notifications** | >= 95% de delivrabilite | Backend APNs logs |
| **Temps de chargement de la carte MapKit** | < 2 secondes | Instrumentation custom |
| **Taux de permission accordee (camera)** | >= 85% | Analytics custom |
| **Taux de permission accordee (localisation)** | >= 80% | Analytics custom |
| **Taux de permission accordee (notifications)** | >= 60% | Analytics custom |

### 7.6 Framework de mesure sans SDK externe

La contrainte "zero dependance externe" signifie que les analytics classiques (Firebase Analytics, Mixpanel, Amplitude) ne sont pas disponibles en tant que packages Swift. Alternatives :

1. **MetricKit :** Framework Apple natif pour les metriques de performance (crash, hang, memory, battery). Aucune dependance. Fournit des rapports quotidiens.
2. **OSLog + os_signpost :** Instrumentation custom pour mesurer les durees d'operations et les evenements utilisateur. Visible dans Instruments.
3. **App Store Connect Analytics :** Metriques d'acquisition, de retention, et de sessions. Aucun SDK requis.
4. **Custom analytics endpoint :** Envoyer les evenements cles (declaration commencee, declaration terminee, garage selectionne, etc.) a un endpoint backend simple. Implemente avec `URLSession` natif.
5. **TelemetryDeck :** Si la contrainte "zero dependance" est assouplie, TelemetryDeck est un SDK analytics leger (~50 Ko), respectueux de la vie privee (conforme RGPD), et concu pour SwiftUI. C'est le compromis le plus raisonnable si un SDK minimal est acceptable.

**Recommandation :** Utiliser MetricKit + App Store Connect pour les metriques systeme, et implementer un systeme d'analytics custom minimal (10-15 evenements cles) envoyes a un endpoint backend.

---

## Annexe A -- Tableau de synthese des decisions a prendre

| # | Decision | Options | Impact sur le design iOS | Urgence |
|---|----------|---------|------------------------|---------|
| D1 | Architecture app : une app avec role switcher ou deux apps ? | (A) Une app, choix du role a l'onboarding. (B) Deux targets Xcode, deux apps App Store. | Structure de navigation, maintenance, taille de l'app | Phase 0 |
| D2 | Backend / API : quel service pour les donnees, la synchro, les push ? | (A) Serveur custom. (B) Supabase. (C) CloudKit. (D) Firebase (rompt "zero dep"). | Push notifications, Live Activities, synchro temps reel | Phase 0 |
| D3 | iOS minimum : 26 strict ou 25 (iOS 18) minimum ? | (A) iOS 26 uniquement. (B) iOS 18+ avec features iOS 26 conditionnelles. | Couverture utilisateurs, APIs disponibles | Phase 0 |
| D4 | Attribution marketplace : auto-assign ou choix conducteur ? | (A) Premier garage acceptant. (B) Le conducteur choisit parmi les garages. (C) Hybride. | Parcours de selection garage entier, notifications | Phase 0 |
| D5 | Authentification : quel systeme ? | (A) Sign in with Apple + email. (B) Pas de compte (local uniquement). (C) Numero de telephone + OTP. | Onboarding, persistance des donnees, multi-device | Phase 1 |
| D6 | Portail garage complementaire web ? | (A) App iOS uniquement. (B) App iOS + portail web minimal. | Adoption garage (part de marche Android), effort dev | Phase 1 |
| D7 | Scope du design system : tokens et composants partages comment ? | (A) Design system Figma + implementation SwiftUI manuelle. (B) Design system Figma + generation partielle. | Coherence, maintenabilite, velocite | Phase 1 |
| D8 | Strategie de tests : comment valider l'UX avant dev ? | (A) Prototype Figma clickable. (B) Prototype SwiftUI fonctionnel (#Preview). (C) Les deux. | Fidelite des retours utilisateurs, effort | Phase 2 |

---

## Annexe B -- Checklist de conformite Human Interface Guidelines iOS 26

Pour chaque ecran designe, verifier :

- [ ] Respect des Safe Areas (pas de contenu sous la Dynamic Island ou le Home Indicator)
- [ ] Touch targets >= 44x44pt pour tous les elements interactifs
- [ ] Support de Dynamic Type (tailles de texte accessibilite)
- [ ] Support de VoiceOver (labels en francais, hints, traits)
- [ ] Contraste WCAG AA minimum (4.5:1 pour le texte, 3:1 pour les elements graphiques)
- [ ] Comportement en mode sombre (si supporte -- recommande)
- [ ] Animations respectant `UIAccessibility.isReduceMotionEnabled`
- [ ] Navigation coherente (NavigationStack avec back button natif, pas de navigation custom)
- [ ] Utilisation des composants systeme quand possible (Button, Toggle, Picker, DatePicker, ProgressView)
- [ ] Feedback haptique pour les actions significatives
- [ ] Confirmation pour les actions destructives ou irreversibles
- [ ] Gestion de la permission refusee pour camera, localisation, notifications
- [ ] Etat de chargement (ProgressView) pour toute operation reseau
- [ ] Etat d'erreur avec bouton de retry pour toute operation reseau
- [ ] Etat vide (ContentUnavailableView) pour toute liste potentiellement vide
- [ ] Support du mode portrait uniquement (layout adapte, pas de rotation)
- [ ] Textes en francais, sans faute, adaptes au contexte assurance/carrosserie
- [ ] Aucune utilisation de termes techniques iOS visibles par l'utilisateur
- [ ] Pull-to-refresh (`.refreshable()`) sur les listes qui affichent des donnees dynamiques

---

## Annexe C -- Glossaire iOS pour l'equipe design

| Terme iOS | Definition | Pertinence Carlib |
|-----------|-----------|-------------------|
| **Live Activity** | Vue persistante sur l'ecran de verrouillage et la Dynamic Island, montrant l'etat en temps reel d'une tache en cours. | Suivi de reparation (US04) |
| **Dynamic Island** | Zone interactive en haut de l'ecran (iPhone 14 Pro+) qui s'anime pour afficher des Live Activities. | Suivi de reparation (US04) |
| **WidgetKit** | Framework pour creer des widgets sur l'ecran d'accueil, l'ecran de verrouillage, et en StandBy. | Suivi (conducteur) + Dashboard (garage) |
| **Interactive Widget** | Widget qui contient des elements interactifs (boutons, toggles) executables sans ouvrir l'app. | Changement rapide de statut (garage) |
| **StandBy Mode** | Mode d'affichage plein ecran quand l'iPhone est en charge en position horizontale. | Suivi de reparation passif |
| **App Clip** | Mini-application (< 15 Mo) accessible sans installation via QR code, NFC, ou lien. | Decouverte garage, declaration rapide |
| **App Intents** | Framework permettant de definir des actions executables par Siri, les Raccourcis, et le systeme. | Commandes vocales Siri |
| **PhotosPicker** | Composant SwiftUI pour selectionner des photos depuis la bibliotheque sans permission Photos complete. | Upload de photos existantes |
| **NavigationStack** | Conteneur de navigation SwiftUI pour les piles d'ecrans (push/pop). | Navigation principale de l'app |
| **ContentUnavailableView** | Vue standard iOS pour les etats vides. | Ecrans sans donnees |
| **SwiftData** | Framework de persistence de donnees natif Apple, remplacement de Core Data. | Stockage local du profil, des sinistres en brouillon |
| **MapKit SwiftUI** | Composant Map natif pour afficher des cartes avec annotations. | Carte des garages (US02) |
| **APNs** | Apple Push Notification service. Systeme de notifications push d'Apple. | Toutes les notifications de l'app |
| **MetricKit** | Framework de collecte de metriques de performance (crash, hang, memory). | Monitoring technique sans SDK tiers |
| **CoreLocation** | Framework de localisation (GPS, Wi-Fi, cellular). | Localisation de l'accident, proximite des garages |
| **EventKit** | Framework d'acces au calendrier et aux rappels iOS. | Ajout de RDV au calendrier |
| **Haptic Feedback** | Retour tactile (vibrations subtiles) via le Taptic Engine de l'iPhone. | Confirmations, validations d'etape |
| **Dynamic Type** | Systeme de tailles de texte adaptatives definies par l'utilisateur dans les Reglages iOS. | Accessibilite typographique |
| **VoiceOver** | Lecteur d'ecran integre a iOS pour les utilisateurs malvoyants ou aveugles. | Accessibilite |

---

*Document genere le 6 avril 2026. A mettre a jour apres les ateliers de cadrage Phase 0 et les entretiens utilisateurs.*
