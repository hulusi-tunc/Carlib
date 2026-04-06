# Carlib -- Analyse Design Copilot Senior
## PRD v0.1 | Phase 0 -- Kickstart Design UX/UI

**Date**: Avril 2026  
**Auteur**: Designer Copilot (Senior Product Designer)  
**Source**: PRD Carlib v0.1 -- Digital Unicorn  
**Statut**: Analyse pre-kickoff -- a confronter lors des ateliers de cadrage

---

## Table des matieres

1. [Premieres Impressions](#1-premieres-impressions)
2. [Resume des Defis Design](#2-resume-des-defis-design)
3. [Modeles Mentaux Utilisateurs](#3-modeles-mentaux-utilisateurs)
4. [Decisions Design Cles](#4-decisions-design-cles)
5. [References Concurrentielles & Analogues](#5-references-concurrentielles--analogues)
6. [Architecture de l'Information](#6-architecture-de-linformation)
7. [Strategie de Contenu](#7-strategie-de-contenu)
8. [Principes de Design Proposes](#8-principes-de-design-proposes)
9. [Carte des Risques & Opportunites](#9-carte-des-risques--opportunites)
10. [Prochaines Etapes Recommandees](#10-prochaines-etapes-recommandees)

---

## 1. Premieres Impressions

### Ce qui est prometteur

**Le timing et le positionnement sont intelligents.** Le marche francais de la reparation automobile post-sinistre est encore largement analogique -- formulaires papier, appels telephoniques, zero visibilite. C'est exactement le type de marche ou une experience mobile bien executee peut creer une valeur disproportionnee par rapport a l'investissement. Le fait que le client ait une experience terrain dans le secteur carrosserie est un avantage massif : il comprend les deux cotes du marche et a deja un canal d'acquisition B2B (les garages).

**L'approche "Design avant Dev" est la bonne.** Commencer par un prototype cliquable et une landing page pour valider l'interet des garages avant d'investir dans le developpement est exactement la methodologie lean qui maximise les chances de succes. Le PRD le formalise clairement.

**Le scope MVP est raisonnable.** Les 10 user stories couvrent l'essentiel du parcours sans s'eparpiller. La decision d'exclure l'integration assurance du MVP est particulierement judicieuse -- c'est un gouffre de complexite qui n'est pas necessaire pour prouver la valeur.

**La double interface (conducteur + garage) est bien identifiee.** Le PRD reconnait explicitement le besoin de deux experiences distinctes partageant un design system commun. C'est un signal de maturite produit.

### Ce qui me preoccupe

**Le contexte emotionnel est sous-estime dans le PRD.** Le mot "rassurer" apparait, mais la profondeur de la detresse post-accident n'est pas suffisamment elaboree. Un conducteur qui vient d'avoir un accident est potentiellement en etat de choc, stresse, desoriente. L'application doit etre utilisable dans cet etat. C'est une contrainte de design extremement forte qui devrait infuser chaque decision.

**Les questions ouvertes sont nombreuses et structurantes.** Sur 8 questions listees en section 9, au moins 4 impactent directement le design de maniere fondamentale :
- L'attribution (auto vs. choix conducteur) change completement l'UX marketplace
- Le scope du portail garage (mobile vs. web/tablette) determine l'architecture d'interface
- L'implication ou non de l'assurance dans le MVP change le parcours de declaration
- Le modele de revenus impacte les ecrans de pricing/abonnement garage

**Le persona conducteur est trop monolithique.** Laurent, 38 ans, cadre -- c'est un archetype. Mais les conducteurs sinistres sont extraordinairement divers : jeunes conducteurs sans experience, seniors peu a l'aise avec le numerique, conducteurs professionnels, personnes ne parlant pas couramment francais. L'UX doit fonctionner pour le spectre complet, pas seulement pour le cadre tech-savvy.

**Le persona garage manque de granularite operationnelle.** Mohamed utiliserait l'app dans des conditions tres specifiques (mains sales, atelier bruyant, interruptions constantes). Le PRD ne mentionne pas ces contraintes physiques d'usage qui impactent directement les choix d'interface (taille des boutons, contraste, navigation one-handed).

**Le volume d'ecrans annonce (20+ conducteur, 15+ garage) pour la phase design est ambitieux.** A 6-8 semaines timeline totale incluant kickstart, UX, UI, landing et finalisation, la pression sera forte. Il faudra etre tres discipline sur le scope reel vs. les "nice-to-have" qui se glissent toujours en cours de route.

---

## 2. Resume des Defis Design

### Defi 1 -- Concevoir pour le stress post-accident

**Pourquoi c'est dur :** Le moment de premiere utilisation est le pire moment possible. Le conducteur est dans un contexte de stress aigu, potentiellement au bord de la route, avec les mains qui tremblent, possiblement blesse, dans des conditions meteo ou de luminosite defavorables. L'application doit etre utilisable dans cet etat sans aucune friction cognitive.

**Implications design :**
- Actions motrices larges (boutons pleine largeur, zones tactiles genereuses)
- Instructions ultra-courtes, une action par ecran
- Aucune decision complexe en debut de parcours
- Feedback visuel et haptique constant pour rassurer
- Possibilite de quitter et reprendre a tout moment (sauvegarde automatique)
- Mode "urgence" vs. mode "normal" pour la declaration post-accident vs. declaration differee

### Defi 2 -- Le probleme de la poule et de l'oeuf (cold start marketplace)

**Pourquoi c'est dur :** Une marketplace sans garages n'a aucune valeur pour les conducteurs. Des garages inscrits sans conducteurs se desabonnent. Le design doit resoudre ce probleme en rendant le produit utile pour les garages AVANT que les conducteurs n'arrivent en masse.

**Implications design :**
- La landing page doit convertir les garages avec une proposition de valeur standalone (pas seulement "recevez des clients")
- Le portail garage doit offrir de la valeur meme avec zero dossier entrant (gestion de planning, profil vitrine, outils de gestion)
- L'experience conducteur doit gracieusement gerer le cas "zero garage disponible" sans casser la confiance

### Defi 3 -- Deux audiences, une coherence

**Pourquoi c'est dur :** Le conducteur est grand public, utilise l'app dans un moment de crise, veut un parcours lineaire simple. Le garagiste est un professionnel, utilise l'outil quotidiennement, veut de l'efficacite et de la densite. Concevoir un design system qui sert les deux sans etre generique est un equilibre delicat.

**Implications design :**
- Design system avec des composants partages mais des patterns de navigation distincts
- Tonalite de contenu differente (rassurant/guide vs. professionnel/efficace)
- Complexite progressive cote garage vs. simplicite absolue cote conducteur
- Metriques de succes differentes (completion vs. throughput)

### Defi 4 -- La confiance dans un moment de vulnerabilite

**Pourquoi c'est dur :** Un conducteur sinistre confie son vehicule (souvent son 2e plus gros actif apres son logement) a un garage qu'il n'a jamais vu, via une application qu'il n'a jamais utilisee. La barriere de confiance est massive. Sans signaux de confiance robustes, le taux de conversion sera catastrophique.

**Implications design :**
- Photos reelles des garages (pas de stock photos)
- Systeme d'avis et de notation (meme s'il se construit progressivement)
- Transparence complete sur le processus (timeline visible, etapes claires)
- Communication directe possible avec le garage apres attribution
- Labels de qualite / certification visibles

### Defi 5 -- La transition online-to-offline

**Pourquoi c'est dur :** Le parcours ne se termine pas dans l'app. A un moment, le conducteur depose physiquement son vehicule au garage. Cette transition numerique-vers-physique est un point de rupture ou l'experience peut s'effondrer si elle n'est pas designee.

**Implications design :**
- Informations pratiques claires (adresse, itineraire, horaires, contact)
- Confirmation bilaterale au moment du depot
- Gestion des imprevus (garage ferme, vehicule non conforme au dossier)
- Continuite de l'experience apres le depot (suivi de reparation)

---

## 3. Modeles Mentaux Utilisateurs

### 3.1 Comment les conducteurs pensent aujourd'hui

**Le modele mental actuel est "parcours du combattant" :**

```
Accident → Panique → Constat amiable (papier) → Appel assurance → 
Attente expert → Recherche garage (bouche-a-oreille/Google) → 
Appels multiples → Depot vehicule → Silence radio → Relances → 
Recuperation vehicule
```

**Croyances et emotions associees :**
- "C'est toujours un calvaire administratif" -- resignation apprise
- "Je ne sais pas combien de temps ca va prendre" -- anxiete liee a l'incertitude
- "Est-ce que le garage fait du bon travail ?" -- mefiance par defaut
- "Mon assurance va-t-elle couvrir ?" -- inquietude financiere
- "Je n'ai plus de vehicule pour aller travailler" -- stress pratique du quotidien

**Le modele a proposer avec Carlib :**

```
Accident → Ouvrir Carlib → Declaration guidee (5 min) → 
Garages disponibles presentes → Choix et RDV → 
Depot vehicule → Suivi en temps reel → Vehicule pret → Recuperation
```

**Ce qu'on doit reshaper :**
- Remplacer la panique par un sentiment de controle : "je sais exactement quoi faire"
- Remplacer l'incertitude par la transparence : "je vois ou en est ma reparation"
- Remplacer la mefiance par la confiance qualifiee : "ce garage est note et certifie"
- Remplacer l'isolement par l'accompagnement : "l'app me guide a chaque etape"

**Ce qu'on doit conserver :**
- Le besoin de parler a un humain a certains moments (ne pas tout automatiser)
- Le reflexe "appeler l'assurance" -- ne pas lutter contre, l'integrer ou l'accompagner
- La valeur du bouche-a-oreille -- les avis dans l'app replicent ce mecanisme

### 3.2 Comment les garagistes pensent aujourd'hui

**Le modele mental actuel est "flux entrant non maitrise" :**

```
Telephone sonne → Client decrit le probleme (souvent mal) → 
"Amenez le vehicule je regarde" → Diagnostic → Devis → 
Attente accord assurance → Commande pieces → Reparation → 
Appel client → Vehicule pret
```

**Croyances et emotions associees :**
- "Je perds du temps avec des appels non qualifies" -- frustration d'efficacite
- "Les plannings, c'est dans ma tete" -- fierte artisanale mais fragilite operationnelle
- "Les outils numeriques ne sont pas faits pour nous" -- mefiance envers la tech
- "Encore un abonnement a un truc qu'on n'utilisera pas" -- fatigue des SaaS
- "Ce qui compte c'est le bouche-a-oreille" -- attachement au reseau local

**Le modele a proposer avec Carlib :**

```
Notification → Dossier complet consultable → Accepter/Refuser → 
Planning mis a jour automatiquement → Mise a jour statut en 1 clic → 
Client informe sans appel → Plus de dossiers entrants
```

**Ce qu'on doit reshaper :**
- Remplacer "les outils tech ne sont pas pour moi" par "c'est plus simple que de repondre au telephone"
- Remplacer la gestion mentale du planning par un outil visuel simple
- Remplacer les appels de suivi client par des notifications automatiques

**Ce qu'on doit conserver :**
- Le sens du controle : le garagiste decide quels dossiers il accepte
- La relation humaine : Carlib facilite la mise en relation, ne la remplace pas
- L'expertise terrain : l'app n'empiete pas sur le diagnostic technique

---

## 4. Decisions Design Cles

Voici les 10 decisions a trancher AVANT de commencer les wireframes, classees par impact.

### Decision 1 -- Modele d'attribution des dossiers

**Options :**
- **(A) Choix conducteur :** Le conducteur voit les garages disponibles et choisit activement. UX type "marketplace classique" (Doctolib, Airbnb).
- **(B) Attribution automatique :** Le systeme attribue au premier garage qui accepte. UX type "dispatch" (Uber, Waze Carpool).
- **(C) Hybride :** Le conducteur choisit parmi les garages qui ont pre-accepte le dossier.

**Recommandation :** Option A pour le MVP. Elle donne le controle au conducteur (confiance), genere plus d'engagement garage (motivation a soigner son profil), et est plus simple a implementer. L'option C est la vision long terme.

**Impact design :** Determine l'ensemble du flow de selection garage -- c'est l'ecran le plus critique de l'app conducteur.

### Decision 2 -- Declaration immediate vs. differee

**Question :** L'app est-elle concue pour etre utilisee SUR le lieu de l'accident (immediat) ou APRES, au calme chez soi (differe) ?

**Recommandation :** Designer pour les deux cas, avec un flow adaptatif. Le flow immediat est simplifie a l'extreme (photos + localisation minimum). Le flow differe permet de completer les details. La sauvegarde automatique est indispensable dans les deux cas.

**Impact design :** Architecture du parcours de declaration, contenu des ecrans, quantite d'information demandee.

### Decision 3 -- Portail garage : mobile-first ou web-first ?

**Question ouverte du PRD.** Le garagiste utilise-t-il l'outil sur son telephone dans l'atelier, sur une tablette au comptoir, ou sur un PC dans le bureau ?

**Recommandation :** Mobile-first pour la consultation et les actions rapides (accepter un dossier, changer un statut). Web responsive pour la gestion de planning et le profil complet. La realite terrain est que le garagiste a son telephone dans la poche, pas un PC devant lui quand il est sous une voiture.

**Impact design :** Layout, navigation, taille des elements interactifs, densite d'information.

### Decision 4 -- Role de l'assurance dans le MVP

**Question :** Le parcours conducteur mentionne-t-il l'assurance ? Le conducteur peut-il saisir ses infos d'assurance ? Le dossier est-il transmissible a l'assureur ?

**Recommandation :** MVP minimal sur l'assurance. Le conducteur saisit uniquement son numero de contrat et le nom de son assureur (champs optionnels). Aucune integration API. Cela pose les bases sans creer de dependance technique.

**Impact design :** Champs du formulaire de declaration, expectations setting dans le parcours.

### Decision 5 -- Monetisation et son impact sur l'interface garage

**Question :** Commission par dossier ? Abonnement mensuel ? Freemium avec upsell ?

**Recommandation :** Cette decision impacte des ecrans specifiques cote garage (pricing, limites, upsell). Pour la phase design, proposer un modele freemium par defaut (profil gratuit, dossiers limites, abonnement pour illimite). Designer les ecrans de maniere modulaire pour pivoter facilement.

**Impact design :** Dashboard garage, limitations visibles, ecrans de conversion.

### Decision 6 -- Systeme de notation et d'avis

**Question :** Les conducteurs notent-ils les garages apres reparation ? Les garages voient-ils leurs notes ?

**Recommandation :** Oui, c'est un levier de confiance essentiel. Designer le systeme de notation pour le MVP meme si les premiers avis seront rares. Prevoir un mecanisme d'affichage gracieux quand il y a peu d'avis (pas de "0/5 -- aucun avis" qui fait amateur).

**Impact design :** Fiche garage, ecran post-reparation, dashboard garage.

### Decision 7 -- Communication conducteur-garage dans l'app

**Question :** Chat integre ? Appel via l'app ? Redirection vers telephone/SMS ?

**Recommandation :** Pour le MVP, affichage du numero de telephone du garage + bouton d'appel direct. Le chat integre est un chantier de developpement massif pour peu de valeur ajoutee au lancement. Designer l'espace pour un futur chat sans l'implementer.

**Impact design :** Ecran de detail dossier, fiche garage, notifications.

### Decision 8 -- Onboarding et creation de compte

**Question :** Inscription obligatoire avant de declarer ? Connexion via email, telephone, ou social ?

**Recommandation :** Permettre de commencer la declaration SANS inscription (experience frictionless). Demander la creation de compte au moment de la confirmation de garage (quand la valeur est prouvee). Authentification par numero de telephone (SMS OTP) -- c'est le plus universel et le plus adapte au contexte mobile francais.

**Impact design :** Ordre des ecrans, moment du login wall, methode d'authentification.

### Decision 9 -- Gestion du vehicule sans mobilite

**Question :** Le vehicule est-il trop endommage pour rouler ? Le conducteur a-t-il besoin d'une depanneuse ? D'un vehicule de remplacement ?

**Recommandation :** Integrer une question "Votre vehicule peut-il rouler ?" dans la declaration. Si non, afficher les garages qui proposent un service d'enlevement. Le vehicule de remplacement est hors scope MVP mais le designer comme une option future.

**Impact design :** Branchement dans le flow de declaration, filtres garage, informations sur la fiche garage.

### Decision 10 -- Gestion des photos et documentation

**Question :** Combien de photos minimum ? Guide visuel pour la prise de photos ? Ajout de documents (constat, carte grise) ?

**Recommandation :** 4 photos guidees minimum (avant, arriere, cote gauche, cote droit du dommage) avec un overlay guide sur la camera. Ajout optionnel du constat et de la carte grise via photo. La qualite des photos est critique pour que le garagiste puisse evaluer le dossier a distance.

**Impact design :** Interface camera custom, galerie, upload, experience de capture guidee.

---

## 5. References Concurrentielles & Analogues

### 5.1 Concurrents directs (France / sinistre auto)

| Service | Ce qu'il fait bien | Ce qu'il fait mal | Lecon pour Carlib |
|---------|-------------------|-------------------|-------------------|
| **Idgarages.com** | Comparateur de garages avec devis en ligne. Bonne couverture nationale. | UX datee, pas de suivi de reparation, pas de logique sinistre specifique. | Carlib doit aller au-dela du simple comparateur -- le suivi en temps reel est le differentiel. |
| **Vroomly** | Interface moderne, estimation de prix, prise de RDV en ligne. | Generaliste (entretien + reparation), pas specifique sinistre. Pas de declaration integree. | La specialisation sinistre de Carlib est un avantage. S'inspirer de la clarte de leurs fiches garage. |
| **iCar Systems / Darva** | Solutions B2B pour la gestion de sinistres (cote assurance/expert). | Pas d'interface grand public. UX professionnelle complexe. | Confirme que le cote conducteur est un ocean bleu. Carlib doit eviter de tomber dans la complexite B2B. |
| **Mon Garage** (app assureurs) | Certains assureurs ont des apps avec localisation de garages agrees. | Limitees a leur propre reseau, UX basique, pas de choix reel pour le conducteur. | L'independance vis-a-vis des assureurs est un argument de vente pour les garages ET les conducteurs. |

### 5.2 Analogues marketplace/service (modeles d'interaction a etudier)

| Service | Pattern a emprunter | Pourquoi c'est pertinent |
|---------|---------------------|--------------------------|
| **Doctolib** | Prise de RDV avec calendrier de disponibilites, fiche praticien detaillee, avis patients. | Modele quasi identique : marketplace de services locaux avec prise de RDV. Doctolib a craque le code de l'adoption medecin/patient en France. Etudier leur onboarding B2B. |
| **Uber** | Suivi en temps reel avec etapes claires, notifications push a chaque changement d'etat, UX de crise (appel d'urgence). | Le suivi de reparation Carlib est l'equivalent du suivi de course Uber. Les conducteurs attendent ce niveau de transparence. |
| **Airbnb** | Fiches detaillees avec photos reelles, systeme de confiance (avis + verification), messaging integre. | La fiche garage Carlib doit atteindre ce niveau de confiance. Photos reelles, descriptions detaillees, signaux de verification. |
| **ManoMano / Angi (ex-Angie's List)** | Marketplace de services artisanaux, devis en ligne, notation des professionnels. | Meme problematique de confiance avec un artisan qu'on ne connait pas. Etudier comment ils construisent la confiance. |
| **Waze** | UX en contexte de conduite, information geographique en temps reel, interface minimaliste. | La composante "carte + garages a proximite" de Carlib doit etre aussi fluide que Waze. |
| **Luko / Alan** (insurtechs) | Onboarding assurance simplifie, declaration de sinistre mobile, UX rassurante dans un contexte administratif. | Luko a prouve qu'on peut rendre l'assurance simple et rassurant sur mobile. Etudier leur tone of voice. |
| **Too Good To Go** | Marketplace avec geolocalisation, flow transactionnel simple, adoption rapide des commercants. | Modele d'adoption commercant comparable. Etudier comment ils onboardent les restaurants. |

### 5.3 Patterns specifiques a benchmarker

- **Prise de photo guidee :** Vinted (photos produit), Tesla app (constat degats), apps d'assurance (Luko, Lemonade)
- **Calendrier de disponibilites :** Doctolib, Calendly, Treatwell
- **Suivi d'etapes en temps reel :** Uber, Deliveroo, Amazon (suivi livraison)
- **Fiche professionnelle locale :** Google Maps, PagesJaunes, Doctolib
- **Onboarding B2B d'une marketplace :** Doctolib, Deliveroo (cote restaurant), Uber (cote chauffeur)

---

## 6. Architecture de l'Information

### 6.1 Application Conducteur

```
CONDUCTEUR (Mobile App iOS/Android)
|
|-- [Tab] Accueil
|   |-- Etat du dossier en cours (si existant)
|   |-- Bouton principal : "Declarer un sinistre"
|   |-- Derniere activite / historique rapide
|
|-- [Tab] Mes Sinistres
|   |-- Liste des dossiers (en cours + passes)
|   |-- Detail dossier
|   |   |-- Resume du sinistre
|   |   |-- Garage attribue (fiche rapide)
|   |   |-- Timeline / suivi de statut
|   |   |-- Photos et documents
|   |   |-- Actions (appeler garage, annuler)
|   |
|-- [Tab] Garages (optionnel -- peut etre accessible uniquement via le parcours)
|   |-- Carte + liste
|   |-- Filtres (distance, disponibilite, specialite)
|   |-- Fiche garage
|   |   |-- Photos, description, specialites
|   |   |-- Horaires et disponibilites
|   |   |-- Avis et notes
|   |   |-- Bouton : "Choisir ce garage"
|
|-- [Tab] Profil
|   |-- Informations personnelles
|   |-- Mon vehicule (marque, modele, immatriculation)
|   |-- Mon assurance (nom, numero de contrat)
|   |-- Notifications (parametres)
|   |-- Aide / FAQ
|   |-- Conditions generales
|   |-- Deconnexion

--- PARCOURS DECLARATION (flow modal, pas une tab) ---

Declaration du sinistre (4 etapes max)
|
|-- Etape 1 : Type de sinistre
|   |-- Collision, stationnement, vandalisme, catastrophe naturelle, autre
|
|-- Etape 2 : Photos
|   |-- Prise de photo guidee (overlay)
|   |-- 4 photos minimum (zones de degats)
|   |-- Ajout optionnel (constat, carte grise)
|
|-- Etape 3 : Informations
|   |-- Vehicule (pre-rempli si profil complete)
|   |-- Date et lieu du sinistre
|   |-- Description courte (champ texte libre)
|   |-- Assurance (optionnel)
|   |-- "Votre vehicule peut-il rouler ?" (oui/non)
|
|-- Etape 4 : Selection garage + RDV
|   |-- Carte + liste des garages disponibles
|   |-- Selection d'un garage
|   |-- Choix du creneau
|   |-- Recapitulatif complet
|   |-- Confirmation
```

### 6.2 Portail Garage

```
GARAGE (Mobile-first + Web responsive)
|
|-- [Tab] Tableau de bord
|   |-- KPIs rapides (dossiers en cours, a venir, termines ce mois)
|   |-- Prochains RDV du jour
|   |-- Alertes / notifications non lues
|   |-- Nouveaux dossiers disponibles (badge)
|
|-- [Tab] Dossiers
|   |-- Sous-onglets : Disponibles | En cours | Termines
|   |-- Dossiers disponibles
|   |   |-- Liste filtree par proximite et type
|   |   |-- Apercu rapide (type sinistre, photos, distance)
|   |   |-- Detail dossier
|   |   |   |-- Photos du sinistre
|   |   |   |-- Infos vehicule
|   |   |   |-- Coordonnees conducteur
|   |   |   |-- Bouton : "Accepter" / "Refuser"
|   |-- Dossiers en cours
|   |   |-- Liste avec statut actuel
|   |   |-- Detail dossier
|   |   |   |-- Changement de statut (stepper)
|   |   |   |-- Historique des etapes
|   |   |   |-- Contacter le client
|   |-- Dossiers termines
|   |   |-- Historique
|   |   |-- Stats
|
|-- [Tab] Planning
|   |-- Vue semaine (par defaut)
|   |-- Vue mois
|   |-- Creneaux disponibles / bloques
|   |-- RDV confirmes avec info client
|   |-- Ajout / modification de disponibilites
|
|-- [Tab] Mon Garage (Profil)
|   |-- Informations generales
|   |-- Photos de l'atelier
|   |-- Specialites / types de reparation
|   |-- Zone d'intervention (rayon en km)
|   |-- Horaires d'ouverture
|   |-- Avis recus (lecture seule)
|   |-- Parametres de notification
|   |-- Abonnement / compte
|   |-- Aide / FAQ
```

### 6.3 Landing Page (vitrine B2B/B2C)

```
LANDING PAGE
|
|-- Hero : promesse + visuel prototype + CTA garage
|-- Probleme : 3 frictions illustrees
|-- Solution : ce que Carlib resout
|-- Comment ca marche : 3 etapes
|-- Benefices garages : proposition de valeur B2B
|-- Temoignages / social proof (si disponible)
|-- Formulaire : "Je suis un garage interesse"
|-- Footer : mentions legales, contact
```

---

## 7. Strategie de Contenu

### 7.1 Onboarding -- Conducteur

**Ecran 1 -- Accueil onboarding**
> **Un accident ? On s'occupe de tout.**
> Declarez votre sinistre, trouvez un garage et suivez votre reparation. Simplement.
> [Commencer]

**Ecran 2 -- Declaration**
> **Declarez en 5 minutes**
> Quelques photos, quelques infos, et votre dossier est pret.
> [Suivant]

**Ecran 3 -- Garage**
> **Le bon garage, pres de chez vous**
> Comparez les garages disponibles, consultez les avis et reservez en un clic.
> [Suivant]

**Ecran 4 -- Suivi**
> **Suivez votre reparation en direct**
> Recevez une notification a chaque etape. Plus besoin d'appeler.
> [C'est parti]

### 7.2 Onboarding -- Garage

**Ecran 1**
> **Bienvenue sur Carlib Pro**
> Recevez des dossiers sinistres qualifies, gerez votre planning et developpez votre activite.
> [Commencer la configuration]

**Ecran 2**
> **Completez votre profil**
> Un profil complet attire plus de conducteurs. Ajoutez vos photos, specialites et horaires.
> [Configurer mon garage]

**Ecran 3**
> **Indiquez vos disponibilites**
> Les conducteurs reservent sur vos creneaux libres. Vous gardez le controle.
> [Gerer mon planning]

### 7.3 Messages de statut -- Parcours sinistre (conducteur)

| Statut | Message push | Message dans l'app |
|--------|-------------|-------------------|
| Dossier envoye | "Votre dossier a ete envoye aux garages a proximite." | **Dossier envoye** -- Les garages de votre zone consultent votre dossier. Vous serez notifie des qu'un garage sera disponible. |
| Garage attribue | "Bonne nouvelle ! [Nom du garage] prend en charge votre vehicule." | **Garage confirme** -- [Nom du garage] a accepte votre dossier. Votre rendez-vous est prevu le [date] a [heure]. |
| Vehicule depose | "Votre vehicule est bien enregistre chez [Nom du garage]." | **Vehicule depose** -- Votre vehicule a ete receptionne. La reparation va commencer. |
| En reparation | "La reparation de votre vehicule a commence." | **En cours de reparation** -- [Nom du garage] travaille sur votre vehicule. Nous vous tiendrons informe de l'avancement. |
| Reparation terminee | "Votre vehicule est pret ! Vous pouvez le recuperer." | **Vehicule pret** -- La reparation est terminee. Contactez [Nom du garage] pour convenir du retrait. |

### 7.4 Messages de statut -- Portail garage

| Action | Message de confirmation |
|--------|----------------------|
| Dossier accepte | "Dossier #[ref] accepte. Le conducteur a ete notifie. Rendez-vous ajoute a votre planning." |
| Dossier refuse | "Dossier #[ref] refuse. Il reste disponible pour d'autres garages." |
| Statut mis a jour | "Statut mis a jour : [nouveau statut]. Le conducteur a ete informe automatiquement." |
| Nouveau dossier disponible | "[Notification push] Nouveau dossier sinistre a [X] km de votre garage. Consultez le dossier." |

### 7.5 Notifications push

**Conducteur :**
- Rappel de rendez-vous : "Rappel : votre rendez-vous chez [Garage] est demain a [heure]. [Voir l'itineraire]"
- Changement de statut : "Mise a jour : votre vehicule est maintenant [statut]. [Voir les details]"
- Avis post-reparation (J+2) : "Comment s'est passee votre experience chez [Garage] ? Votre avis compte. [Donner mon avis]"

**Garage :**
- Nouveau dossier : "Nouveau sinistre disponible ([type]) a [X] km. [Consulter]"
- Rappel RDV : "Rappel : reception du vehicule de [Prenom N.] demain a [heure]."
- Avis recu : "Un client a laisse un avis sur votre garage. [Consulter]"

### 7.6 Messages d'erreur

| Situation | Message |
|-----------|---------|
| Erreur reseau | "Connexion perdue. Verifiez votre connexion internet et reessayez. Vos donnees ont ete sauvegardees." |
| Photo non chargee | "La photo n'a pas pu etre envoyee. Verifiez votre connexion et reessayez." |
| Creneau plus disponible | "Ce creneau vient d'etre reserve. Choisissez un autre horaire disponible." |
| Aucun garage disponible | "Aucun garage disponible dans votre zone pour le moment. Nous vous prevenons des qu'un garage se libere." |
| Session expiree | "Votre session a expire. Reconnectez-vous pour continuer. Vos donnees ont ete sauvegardees." |
| Localisation non autorisee | "Activez la localisation pour trouver les garages pres de vous. [Activer] [Saisir une adresse manuellement]" |
| Champ obligatoire manquant | "Merci de renseigner [nom du champ] pour continuer." |
| Format de fichier non supporte | "Ce format de fichier n'est pas pris en charge. Utilisez une photo au format JPG ou PNG." |
| Taille de fichier trop grande | "Cette photo depasse la taille maximale (10 Mo). Essayez de la reprendre ou d'en choisir une plus legere." |

### 7.7 Etats vides

| Ecran | Message |
|-------|---------|
| Mes sinistres (aucun dossier) | "Aucun sinistre declare pour le moment. En cas d'accident, Carlib vous guide pas a pas. [Declarer un sinistre]" |
| Dossiers disponibles garage (aucun) | "Aucun dossier disponible dans votre zone pour le moment. Vous recevrez une notification des qu'un nouveau sinistre sera declare a proximite." |
| Dossiers en cours garage (aucun) | "Aucun dossier en cours. Consultez les dossiers disponibles pour prendre en charge un nouveau sinistre." |
| Planning (aucun RDV) | "Aucun rendez-vous prevu cette semaine. Vos disponibilites sont ouvertes -- les conducteurs peuvent reserver." |
| Avis garage (aucun avis) | "Pas encore d'avis. Les premiers avis apparaitront ici apres vos premieres reparations." |

### 7.8 Aide et FAQ (structure)

**FAQ Conducteur :**
1. Comment declarer un sinistre sur Carlib ?
2. Combien de temps prend une declaration ?
3. Comment choisir un garage ?
4. Puis-je annuler ou modifier ma declaration ?
5. Comment suivre l'avancement de ma reparation ?
6. Dois-je quand meme contacter mon assurance ?
7. Que faire si mon vehicule ne peut pas rouler ?
8. Mes donnees sont-elles protegees ?
9. Comment contacter le support Carlib ?

**FAQ Garage :**
1. Comment m'inscrire en tant que garage partenaire ?
2. Comment gerer mes disponibilites ?
3. Comment accepter ou refuser un dossier ?
4. Comment mettre a jour le statut d'une reparation ?
5. Combien coute l'utilisation de Carlib ?
6. Comment modifier les informations de mon garage ?
7. Comment fonctionne le systeme de notation ?
8. Comment contacter le support Carlib Pro ?

---

## 8. Principes de Design Proposes

### Principe 1 : "Calme dans la tempete"

> Dans un moment de stress, chaque ecran doit respirer. Une action claire, un message rassurant, zero ambiguite.

**Application concrete :**
- Maximum 1 action principale par ecran dans le flow de declaration
- Tons de couleur calmes et non agressifs (pas de rouge vif sauf urgence reelle)
- Micro-copy toujours tourno vers l'action suivante, jamais vers le probleme
- Espacement genereux, typographie lisible en exterieur (contraste fort)
- Progression visible a chaque etape (stepper)

### Principe 2 : "Zero temps perdu"

> Chaque interaction doit faire avancer l'utilisateur. Si un ecran ne fait pas progresser le dossier, il n'a pas sa place.

**Application concrete :**
- Pre-remplissage systematique (vehicule, assurance, localisation GPS)
- Sauvegarde automatique a chaque etape (pas de bouton "sauvegarder")
- Actions en 1 tap cote garage (accepter, refuser, changer statut)
- Zero double saisie entre conducteur et garage
- Les notifications sont des raccourcis (deep link vers l'action pertinente)

### Principe 3 : "Transparence totale"

> L'utilisateur ne doit jamais se demander "et maintenant ?". Le systeme communique son etat en permanence.

**Application concrete :**
- Timeline de suivi visible en permanence pour le conducteur
- Confirmation immediate apres chaque action (feedback haptique + visuel)
- Etats intermediaires explicites ("Votre dossier est consulte par 3 garages")
- Notifications proactives a chaque changement d'etat
- Pas de "black box" : le conducteur sait toujours ce qui se passe et pourquoi

### Principe 4 : "Confiance construite"

> La confiance ne se declare pas, elle se prouve. Chaque element de l'interface doit renforcer la credibilite de la plateforme et des garages.

**Application concrete :**
- Photos reelles obligatoires pour les profils garage
- Avis et notes visibles et non modifiables
- Informations verifiables (adresse, horaires, certifications)
- Langage professionnel mais accessible (pas de jargon technique non explique)
- Coherence visuelle entre l'app conducteur et le portail garage (meme "marque")

### Principe 5 : "Adapte au terrain"

> L'interface s'adapte au contexte reel d'utilisation : un conducteur au bord de la route et un garagiste les mains dans le cambouis n'ont pas les memes capacites d'interaction.

**Application concrete :**
- Zones tactiles surdimensionnees dans le flow de declaration (contexte stress)
- Contraste eleve pour lisibilite en exterieur (soleil) et en atelier (faible luminosite)
- Actions realisables d'une seule main (thumb zone)
- Interface garage resistant aux "tap accidentels" (confirmation sur les actions critiques)
- Fonctionnement en mode degrade (faible connectivite : sauvegarde locale, synchronisation ulterieure)

---

## 9. Carte des Risques & Opportunites

### 9.1 Risques Design

| Risque | Probabilite | Impact | Mitigation |
|--------|-------------|--------|------------|
| **UX trop complexe pour le contexte de stress** -- Trop d'etapes, trop de champs, trop de choix dans le flow de declaration | Moyenne | Critique | Tester le flow de declaration avec un chronometre. Objectif : < 5 min. Tester en conditions simulees de stress (debout, exterieur, bruit). |
| **Portail garage ignore par les artisans** -- Interface trop "tech", courbe d'apprentissage trop forte, pas de valeur immediate | Elevee | Critique | Concevoir le portail garage avec des garagistes (co-design). Premiere experience reussie en < 2 min. Proposer de la valeur immediate (profil en ligne, meme sans dossier). |
| **Cold start : ecrans vides decourageants** -- Les premiers utilisateurs voient "0 garage disponible" ou "0 dossier" | Elevee | Eleve | Designer des etats vides motivants (pas des culs-de-sac). Integrer du contenu educatif dans les ecrans vides. Lancer par zone geographique concentree. |
| **Prise de photos de mauvaise qualite** -- Photos floues, mal cadrees, insuffisantes pour evaluer les degats | Elevee | Eleve | Guide visuel de prise de photo (overlay camera). Verification qualite automatique. Possibilite d'ajouter des photos ulterieurement. |
| **Decrochage entre digital et physique** -- L'experience s'effondre au moment du depot vehicule au garage | Moyenne | Eleve | Designer le moment de transition (check-in digital, confirmation bilaterale). Informations pratiques ultra-claires (itineraire, contact, instructions). |
| **Confusion sur le role de Carlib vs. l'assurance** -- Les conducteurs pensent que Carlib remplace leur assurance | Moyenne | Moyen | Messaging clair des l'onboarding : "Carlib facilite la reparation, votre assurance reste votre interlocuteur pour le remboursement." |
| **Scope creep pendant la phase design** -- Les 20+ ecrans conducteur + 15+ ecrans garage depassent la capacite en 6-8 semaines | Elevee | Moyen | Prioriser strictement : flow critique d'abord (declaration + selection garage + suivi). Ecrans secondaires en wireframe, pas en hi-fi. |
| **Design system trop ambitieux pour le MVP** -- Vouloir un systeme complet retarde la livraison | Moyenne | Moyen | Design system "starter" : 15-20 composants maximum. Fondations solides (couleurs, typo, espacement, boutons, cards, inputs) + composants specifiques au besoin. |

### 9.2 Opportunites Design

| Opportunite | Impact potentiel | Effort | Recommandation |
|-------------|-----------------|--------|----------------|
| **"Moment wow" du suivi en temps reel** -- Si le suivi est aussi fluide qu'Uber pour une course, c'est un differentiel massif vs. le silence radio actuel | Tres eleve | Moyen | Investir du temps design sur la timeline de suivi. C'est l'ecran qui sera montre en demo, partage en bouche-a-oreille, et screenshot. |
| **Onboarding garage comme outil commercial** -- Le prototype cliquable DEVIENT l'outil de vente aupres des garages | Tres eleve | Faible | Designer le parcours garage complet et fluide dans le prototype. C'est le livrable le plus important pour le business a court terme. |
| **Prise de photo guidee comme facteur de differenciation** -- Aucun concurrent ne propose une capture guidee de qualite | Eleve | Moyen | Designer une experience camera native avec overlays et instructions. Si bien executee, cela peut devenir un element de marque. |
| **Historique vehicule comme retention long terme** -- Carlib devient le "carnet de sante" du vehicule au-dela du sinistre | Eleve | Faible (design) | Designer l'espace "Mon vehicule" avec une vision extensible (historique sinistres, entretiens futurs, documents). Planter la graine sans developper. |
| **Landing page comme generateur de leads B2B qualifie** -- Chaque garage inscrit via la landing est un lead chaud pour l'equipe commerciale | Eleve | Faible | Designer un formulaire d'inscription garage optimise pour la conversion. Chaque champ doit qualifier le lead (taille, specialite, zone). |
| **Mode "constat amiable digital"** -- Integrer la saisie du constat directement dans Carlib (hors MVP mais a anticiper en IA) | Eleve | Moyen (design) | Prevoir l'espace dans l'architecture pour un futur module de constat digital. Ne pas bloquer l'architecture. |
| **Notifications comme canal relationnel** -- Bien concu, le systeme de notifications cree une relation continue (pas juste transactionnelle) | Moyen | Faible | Designer la strategie de notifications au-dela du transactionnel : conseils, rappels entretien, communication garage. |

---

## 10. Prochaines Etapes Recommandees

### Phase 0 -- Kickstart (Semaines 1-2)

Voici le plan d'action priorise pour les 10 premiers jours du projet.

#### Semaine 1 : Cadrage et alignement

| Jour | Action | Livrable | Participants |
|------|--------|----------|-------------|
| J1 | **Atelier kickoff** : alignement vision, review du PRD, partage des maquettes Emergent, resolution des questions ouvertes prioritaires (#1 identite visuelle, #2 logique attribution, #3 scope portail) | Compte-rendu avec decisions documentees | Client + PM + UX |
| J2 | **Atelier personas** : enrichissement des personas a partir de l'experience terrain du client. Interview du client sur ses interactions reelles avec les garagistes et les conducteurs. | Personas enrichis avec verbatims reels, contextes d'usage, contraintes physiques | Client + UX |
| J3 | **Atelier parcours conducteur** : mapping du parcours complet de declaration a recuperation du vehicule. Identification des moments critiques et des points de decision. | User flow conducteur detaille (Figjam ou Miro) | PM + UX |
| J4 | **Atelier parcours garage** : mapping du parcours complet d'inscription a cloture de dossier. Focus sur le quotidien operationnel d'un garagiste. | User flow garage detaille | PM + UX |
| J5 | **Consolidation** : synthese des 4 ateliers, finalisation de l'IA, priorisation des ecrans a wireframer en premier. | Document de cadrage design consolide, IA validee | PM + UX |

#### Semaine 2 : Fondations design

| Jour | Action | Livrable | Participants |
|------|--------|----------|-------------|
| J6-J7 | **Wireframes flow critique conducteur** : declaration (4 etapes) + selection garage + confirmation RDV. Low-fi, focus sur le flow et l'information, pas le visuel. | Wireframes conducteur (flow critique) -- 10-12 ecrans | UX |
| J8-J9 | **Wireframes flow critique garage** : consultation dossier + acceptation + changement de statut. Low-fi. | Wireframes garage (flow critique) -- 8-10 ecrans | UX |
| J10 | **Review wireframes avec le client** : validation des flows, ajustements, decision go/no-go sur le passage en UI. | Wireframes valides ou annotationes pour iteration | Client + PM + UX |

#### Decisions a obtenir du client AVANT J3

1. Logique d'attribution : choix conducteur ou automatique ?
2. Scope portail garage : mobile uniquement ou aussi web ?
3. Identite visuelle : existe-t-il une charte ? Un logo ? Des couleurs validees ?
4. Zone geographique MVP : quelle ville/region pilote ?
5. Partage des maquettes Emergent existantes

#### Livrables complementaires a produire en parallele (PM)

- Backlog produit structure (MVP / V1 / V2) base sur le MoSCoW du PRD
- Benchmark visuel des 5 concurrents/analogues cites (captures d'ecran)
- Brief design system : choix du framework de reference (Material Design 3, Apple HIG, ou custom)

#### Indicateurs de succes Phase 0

- [ ] Toutes les questions ouvertes "rouge" du PRD (section 9) sont resolues
- [ ] Personas valides avec le client
- [ ] Parcours conducteur et garage mappes et valides
- [ ] Wireframes du flow critique testes en interne (walkthrough)
- [ ] Client capable de "jouer" le parcours conducteur sur les wireframes
- [ ] Decision prise sur le design system de reference
- [ ] Estimation effort UI affinee

---

## Annexe : Checklist pre-wireframe

Avant d'ouvrir Figma, verifier que ces elements sont documentes :

- [ ] Personas enrichis et valides
- [ ] User flows complets (conducteur + garage)
- [ ] Logique d'attribution tranchee
- [ ] Scope du portail garage defini (mobile/web/tablette)
- [ ] Inventaire de contenu (tous les textes et labels identifies)
- [ ] Etats a designer listes par ecran (defaut, vide, erreur, chargement)
- [ ] Maquettes Emergent du client revues et annotees
- [ ] Design system de reference choisi
- [ ] Contraintes techniques connues (si existantes)
- [ ] Metriques de succes definies par ecran cle

---

*Document genere par le Designer Copilot en Phase 0 pre-kickoff. A confronter avec le client et l'equipe lors des ateliers de cadrage. Ce document est un point de depart pour la discussion, pas un livrable final.*
