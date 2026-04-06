# Carlib -- Analyse de Recherche UX Approfondie

**Projet :** Carlib -- Phase Design UX/UI (Phase 0)
**Version PRD analysee :** v0.1 -- Draft (Mars 2026)
**Date de l'analyse :** 6 avril 2026
**Auteur :** Design Researcher Agent -- Digital Unicorn

---

## Table des matieres

1. [Synthese executive](#1-synthese-executive)
2. [Analyse des Personas](#2-analyse-des-personas)
3. [Cartographie des Parcours Utilisateurs & Lacunes](#3-cartographie-des-parcours-utilisateurs--lacunes)
4. [Questions de Recherche Prioritaires](#4-questions-de-recherche-prioritaires)
5. [Jobs-to-Be-Done (JTBD)](#5-jobs-to-be-done-jtbd)
6. [Pain Points & Opportunites](#6-pain-points--opportunites)
7. [Recommandations pour la Phase 0 Kickstart](#7-recommandations-pour-la-phase-0-kickstart)
8. [Annexe -- Matrice de Risques Recherche](#8-annexe--matrice-de-risques-recherche)

---

## 1. Synthese executive

Le PRD Carlib v0.1 pose des fondations solides pour une marketplace mobile de mise en relation entre conducteurs sinistres et carrossiers en France. La vision produit est claire, le perimetre MoSCoW est bien structure, et les user stories couvrent les flux critiques.

Cependant, l'analyse revele des lacunes significatives qui, si elles ne sont pas comblees avant le design, risquent de produire une experience utilisateur basee sur des hypotheses non validees. Les personas manquent de profondeur comportementale et de diversite. Les parcours utilisateurs presentent des zones d'ombre majeures (gestion d'erreurs, cas limites, moments emotionnels critiques). La logique marketplace -- attribution automatique vs. selection conducteur -- reste ouverte et impacte l'ensemble de l'architecture UX.

Ce document identifie 47 points d'analyse repartis en 6 sections et propose un plan de recherche concret pour les 2 semaines de Phase 0.

---

## 2. Analyse des Personas

### 2.1 Persona #1 -- Laurent C. (Conducteur sinistre)

**Ce qui est bien defini :**
- Le contexte d'usage est clair : declaration post-accident depuis un telephone mobile
- Les 4 objectifs sont bien articules et sequentiels (declarer, trouver, planifier, suivre)
- Les frictions identifiees sont reelles et coherentes avec le marche

**Ce qui est insuffisant ou manquant :**

| Dimension | Constat | Impact |
|-----------|---------|--------|
| Etat emotionnel | Le PRD mentionne "stress post-accident" mais le persona ne le modelise pas. Laurent est presente comme un cadre rationnel de 38 ans, ce qui sous-estime la charge emotionnelle reelle du moment d'usage. | Le design risque d'etre fonctionnel mais pas suffisamment rassurant. L'etat de panique, de confusion ou de colere post-accident devrait etre le parametre central de ce persona. |
| Maturite numerique | Aucune indication sur le rapport de Laurent au numerique. Un cadre de 38 ans n'est pas un profil fragile, mais le PRD dit "l'application s'adresse a tous types de conducteurs." | Le persona actuel ne represente qu'un segment. Quid d'une conductrice de 65 ans ? D'un jeune conducteur de 19 ans sans experience des sinistres ? |
| Frequence d'usage | Aucune reflexion sur le fait qu'un sinistre est un evenement rare (typiquement 1 fois tous les 5-10 ans pour un conducteur moyen en France). | L'application sera utilisee dans un contexte de premiere utilisation quasi systematique. Cela change radicalement les exigences d'onboarding et de guidage. |
| Contexte de l'accident | Aucun detail sur les circonstances : accident sur autoroute vs. parking, nuit vs. jour, seul vs. avec passagers, accrochage mineur vs. accident grave. | Le parcours de declaration doit s'adapter a des contextes radicalement differents. Un accident grave avec blessures n'a pas les memes besoins qu'un retroviseur casse sur un parking. |
| Relation a l'assurance | Laurent est presente independamment de son assureur. Or, en France, le reflexe post-accident est d'appeler son assurance. | Le positionnement de Carlib par rapport au reflexe "j'appelle mon assurance" est un angle mort critique. |
| Historique vehicule | Aucune mention du type de vehicule, de son anciennete, de sa valeur sentimentale ou financiere. | Un proprietaire d'une voiture neuve a 40 000 EUR n'a pas les memes angoisses qu'un proprietaire d'un vehicule de 8 ans. |
| Situation familiale / dependance | Laurent est "cadre" mais on ne sait pas s'il depend de son vehicule au quotidien (trajets domicile-travail, enfants a l'ecole). | La dependance au vehicule amplifie l'urgence et l'anxiete. C'est un levier emotionnel et fonctionnel sous-exploite. |

**Hypotheses a valider :**
1. Les conducteurs sinistres sont prets a utiliser une application inconnue dans un moment de stress eleve.
2. La declaration via l'application sera percue comme complementaire (et non concurrente) a la declaration d'assurance classique.
3. Le conducteur est pret a choisir un garage qu'il ne connait pas, sur la base d'une fiche dans une application.
4. La prise de photos post-accident est faisable et acceptee dans le contexte emotionnel et physique du moment.

---

### 2.2 Persona #2 -- Mohamed D. (Gerant de carrosserie)

**Ce qui est bien defini :**
- Le profil artisan independant est pertinent pour le marche francais de la carrosserie
- Les 4 objectifs sont clairs et axes sur l'efficacite operationnelle
- Les frictions identifiees (gestion manuelle, appels non qualifies, planning) sont realistes

**Ce qui est insuffisant ou manquant :**

| Dimension | Constat | Impact |
|-----------|---------|--------|
| Journee type | Aucune description de la journee type de Mohamed. Quand consulte-t-il son telephone ? Entre deux reparations ? Le soir ? Deleguee-t-il a un employe ? | Le design du portail garage doit s'adapter a des sessions ultra-courtes et interruptibles, avec potentiellement des mains sales ou des gants. |
| Outils actuels | On sait que la gestion est "manuelle" mais sans details. Utilise-t-il un cahier, Excel, un logiciel de gestion garage (type Autodata, Solware), ou simplement son telephone ? | Si les garages utilisent deja un logiciel, Carlib doit se positionner en complement, pas en remplacement. Si c'est du papier, la courbe d'adoption sera differente. |
| Modele economique du garage | 3 employes, 12 ans d'experience, mais aucune donnee sur le volume de sinistres traites/mois, le CA, la dependance aux assurances pour le flux client. | Le volume de dossiers sinistres via Carlib doit etre mis en perspective avec le flux actuel du garage. Un garage qui traite 30 sinistres/mois ne reagira pas comme un garage qui en traite 5. |
| Rapport a la technologie | Aucune indication. Un artisan de 45 ans peut etre parfaitement a l'aise avec un smartphone ou reticent aux outils numeriques. | L'onboarding garage est critique. Si Mohamed n'est pas a l'aise, il delegue ou abandonne. |
| Reseau et bouche-a-oreille | Les garages fonctionnent souvent sur la reputation locale et le reseau. Comment Mohamed percoit-il une plateforme qui le met en concurrence avec d'autres garages ? | La logique marketplace peut etre percue comme une menace (mise en concurrence sur les prix) autant qu'une opportunite. |
| Relation assureurs | En France, beaucoup de garages sont "agrees assurance." Leur flux client depend directement des assureurs. | La proposition de valeur de Carlib change radicalement selon que le garage est agree ou non. Un garage non agree a beaucoup plus a gagner. |

**Hypotheses a valider :**
1. Les gerants de carrosserie sont prets a consulter une application pour recevoir des dossiers, plutot que leurs canaux habituels.
2. Le modele "premier arrive, premier servi" (ou selection conducteur) est acceptable pour les garages.
3. Les garages sont prets a mettre a jour en temps reel le statut de reparation (charge de travail additionnelle).
4. Le volume de dossiers genere par Carlib sera suffisant pour justifier le temps d'adoption.

---

### 2.3 Persona #3 -- Assurance (Vision future)

**Evaluation :**

Le PRD mentionne ce persona en une phrase sans aucune definition. C'est le choix le plus risque du document.

**Ce qui manque :**
- Aucune definition meme sommaire (qui chez l'assureur ? un gestionnaire de sinistres ? un directeur partenariats ? un systeme automatise ?)
- Aucune analyse de l'impact de l'absence d'assurance dans le MVP sur l'experience conducteur
- Aucune anticipation de la question inevitable du conducteur : "Est-ce que ca remplace ma declaration d'assurance ?"

**Pourquoi c'est critique meme pour le MVP :**
En France, la declaration de sinistre est une obligation legale (constat amiable, delai de 5 jours pour declarer a l'assureur). Un conducteur qui utilise Carlib pour "declarer" son sinistre pourrait croire, a tort, que cette declaration remplace ou satisfait son obligation legale. Le wording, le positionnement, et les ecrans d'information doivent etre extremement precis sur ce point des le MVP.

**Recommandation :** Meme sans integration assurance dans le MVP, il faut documenter :
- Le parcours parallele obligatoire du conducteur avec son assureur
- Le vocabulaire exact a utiliser (eviter "declaration de sinistre" qui a un sens legal)
- Les disclaimers necessaires

---

### 2.4 Personas manquants

Le PRD ne couvre pas les profils suivants, qui seront pourtant des utilisateurs reels :

| Persona manquant | Justification |
|-----------------|---------------|
| **Employe du garage** (vs. le gerant) | Mohamed gere le garage, mais qui met a jour les statuts au quotidien ? Un mecanicien avec un telephone pas forcement recent ? Un apprenti ? |
| **Conducteur non-responsable** | Dans un accident a deux vehicules, le tiers lese a des besoins differents (pas d'assurance a contacter de la meme maniere, sentiment d'injustice). |
| **Conducteur sans smartphone** | En France, 13% de la population n'a pas de smartphone (INSEE 2023). Dans un contexte d'accident, le conducteur peut avoir un telephone casse ou decharge. |
| **Accompagnant du conducteur** | En cas d'accident grave, c'est souvent un proche ou un tiers qui prend en charge les demarches pour le conducteur. |
| **Conducteur flottes / professionnel** | Les vehicules d'entreprise representent un volume significatif de sinistres. Le processus de decision est different (gestionnaire de flotte implique). |

---

## 3. Cartographie des Parcours Utilisateurs & Lacunes

### 3.1 Parcours Conducteur -- Cartographie complete et lacunes

```
PHASE 1           PHASE 2              PHASE 3              PHASE 4             PHASE 5
ACCIDENT           DECLARATION          SELECTION GARAGE     RESERVATION          SUIVI REPARATION
                                                             RENDEZ-VOUS

[Accident]         [Ouvre Carlib]       [Voit liste/carte]  [Choisit creneau]   [Recoit notifs]
    |                   |                    |                    |                    |
    v                   v                    v                    v                    v
[Securite]         [Type sinistre]      [Filtre distance]   [Confirme RDV]      [Attend]
    |                   |                    |                    |                    |
    v                   v                    v                    v                    v
[Constat           [Photos]             [Consulte fiche]    [Recoit recap]      [Recupere
 amiable]               |                    |                                    vehicule]
    |                   v                    v
    v              [Infos vehicule]     [Selectionne
[Appel                  |                garage]
 assurance]             v
                   [Localisation]
                        |
                        v
                   [Recapitulatif]
```

**Lacunes identifiees :**

| # | Phase | Lacune | Severite |
|---|-------|--------|----------|
| L1 | Pre-app (Phase 0) | **Comment le conducteur connait-il Carlib ?** Le PRD ne traite pas du tout le moment de decouverte. Un conducteur en etat de choc ne va pas chercher une application inconnue sur l'App Store. C'est le probleme de la poule et de l'oeuf : l'app est utile au moment du sinistre mais doit etre installee avant. | Critique |
| L2 | Phase 1 (Accident) | **Le constat amiable et l'appel d'assurance ne sont pas integres au parcours.** Le PRD traite le parcours Carlib comme s'il existait en isolation. En realite, le conducteur doit simultanement faire un constat, appeler les secours si besoin, contacter son assureur, et potentiellement utiliser Carlib. L'articulation entre ces actions paralleles est absente. | Critique |
| L3 | Phase 2 (Declaration) | **Quand exactement le conducteur utilise-t-il Carlib ?** Sur le lieu de l'accident (stress maximal, conditions physiques difficiles) ? Quelques heures apres chez lui ? Le lendemain ? Le parcours devrait s'adapter au timing. | Majeure |
| L4 | Phase 2 (Declaration) | **Prise de photos assistee : et si le vehicule n'est plus accessible ?** Accident grave, vehicule tracte, fourriere. Le PRD suppose que le conducteur peut photographier son vehicule au moment de la declaration. | Majeure |
| L5 | Phase 2 (Declaration) | **"Champs pre-remplis autant que possible" -- comment ?** Aucune indication sur la source des donnees pre-remplies. Carte grise scannee ? Connexion France Connect ? Historique profil ? | Moyenne |
| L6 | Phase 3 (Selection) | **Criteres de choix du garage insuffisants.** Le PRD mentionne distance et disponibilite. Mais un conducteur choisit aussi sur : avis/notes, specialite vehicule (ex: carrosserie allemande), prix indicatif, delai estime, vehicule de remplacement propose. | Majeure |
| L7 | Phase 3 (Selection) | **Attribution automatique vs. selection conducteur -- non tranchee.** C'est la question ouverte #2 du PRD et elle impacte fondamentalement l'architecture UX. Les deux modeles impliquent des parcours radicalement differents. | Critique |
| L8 | Phase 3 (Selection) | **Et si aucun garage n'est disponible ?** Zone rurale, periode de vacances, tous les garages de la zone refusent. Quel est le parcours de repli ? | Majeure |
| L9 | Phase 4 (Reservation) | **Le vehicule est-il roulable ?** Si oui, le conducteur l'amene. Si non, il faut une depanneuse. Ce cas n'est pas traite. | Majeure |
| L10 | Phase 4 (Reservation) | **Annulation et report de rendez-vous.** Aucune mention de la possibilite d'annuler ou reporter, ni cote conducteur ni cote garage. | Moyenne |
| L11 | Phase 5 (Suivi) | **4 statuts seulement (en attente / pris en charge / en reparation / termine).** C'est insuffisant pour un suivi reel. Il manque : "pieces en commande", "en attente d'accord assurance", "vehicule expertise", "pret a recuperer". | Moyenne |
| L12 | Phase 5 (Suivi) | **Fin du parcours non definie.** Que se passe-t-il apres "termine" ? Evaluation du garage ? Facture ? Archivage du dossier ? Recommandation a un proche ? | Moyenne |
| L13 | Transversal | **Communication conducteur-garage.** Le PRD mentionne "communiquer le statut sans appel" mais ne prevoit pas de messagerie. Le conducteur aura forcement des questions ("c'est quoi ce bruit que j'avais deja avant ?", "vous pouvez aussi regarder le pare-chocs ?"). | Majeure |
| L14 | Transversal | **Notifications push : et si le conducteur ne les a pas activees ?** Alternative email ? SMS ? Aucun canal de repli mentionne. | Moyenne |
| L15 | Transversal | **Multi-sinistres.** Un conducteur peut avoir deux sinistres en cours (vehicule personnel + vehicule conjoint). L'architecture du tableau de bord n'est pas evoquee. | Faible |

---

### 3.2 Parcours Garage -- Cartographie complete et lacunes

```
PHASE 1              PHASE 2              PHASE 3              PHASE 4             PHASE 5
INSCRIPTION          CONSULTATION         PRISE EN CHARGE      GESTION RDV         SUIVI & MAJ
                     SINISTRES                                 & PLANNING

[Cree profil]       [Voit dossiers]      [Accepte dossier]   [Gere planning]     [MAJ statut]
    |                   |                    |                    |                    |
    v                   v                    v                    v                    v
[Infos garage]      [Filtre zone/type]   [Dossier ajoute     [Cree/bloque        [Notif auto
 photos,                |                 au planning]         creneaux]            au client]
 specialites]           v                    |                    |
    |              [Ouvre dossier]           v                    v
    v                   |               [Confirme              [Synchro avec
[Definit zone           v                conducteur]            reservations]
 intervention]     [Decide accepter
    |                ou refuser]
    v
[Definit
 disponibilites]
```

**Lacunes identifiees :**

| # | Phase | Lacune | Severite |
|---|-------|--------|----------|
| G1 | Phase 1 (Inscription) | **Processus de verification du garage.** Comment Carlib verifie-t-il qu'un garage est reel, qualifie, assure professionnellement ? Le PRD ne mentionne aucun processus de validation. C'est critique pour la confiance des conducteurs. | Critique |
| G2 | Phase 1 (Inscription) | **Onboarding et formation.** Comment Mohamed apprend-il a utiliser la plateforme ? Un tutoriel suffit-il ? Faut-il un accompagnement humain ? | Majeure |
| G3 | Phase 2 (Consultation) | **Volume et qualite des dossiers.** Le garage voit "les sinistres disponibles dans sa zone." Mais au lancement, il n'y en aura probablement aucun. Comment gerer la periode de demarrage a vide ? | Critique |
| G4 | Phase 2 (Consultation) | **Informations suffisantes pour decider.** Le PRD dit "dossier complet accessible en un clic." Mais qu'est-ce qu'un dossier complet ? Photos, description, type de vehicule, estimation de gravite ? Le garage a besoin d'evaluer s'il peut traiter le sinistre et a quel cout avant d'accepter. | Majeure |
| G5 | Phase 3 (Prise en charge) | **Negociation du prix.** Aucune mention de devis, d'estimation, ou de negotiation entre garage et conducteur. En realite, le garage doit estimer le cout, souvent apres examen physique du vehicule. | Critique |
| G6 | Phase 3 (Prise en charge) | **Refus d'un dossier : consequences ?** Si un garage refuse, le dossier retourne-t-il au pool ? Le conducteur est-il notifie du refus ? Combien de refus avant escalade ? | Majeure |
| G7 | Phase 4 (Planning) | **Integration avec les outils existants.** Le planning Carlib est-il la seule source de verite du garage ou doit-il etre synchronise avec un agenda existant (Google Calendar, logiciel garage) ? | Majeure |
| G8 | Phase 5 (Suivi) | **Charge de travail supplementaire.** Mettre a jour un statut pour chaque vehicule, meme si c'est "un bouton simple," est un geste supplementaire dans une journee d'atelier deja chargee. Quel est le cout reel pour le garage ? | Majeure |
| G9 | Transversal | **Multi-utilisateurs par garage.** Mohamed a 3 employes. Peuvent-ils tous acceder au portail ? Avec quels niveaux de permission ? | Moyenne |
| G10 | Transversal | **Interface mobile vs. tablette vs. web.** La question ouverte #3 du PRD n'est pas tranchee. Un mecanicien dans un atelier utilisera probablement une tablette posee sur un etabli, pas un smartphone dans sa poche. | Majeure |
| G11 | Transversal | **Metriques et reporting.** Aucune mention de tableau de bord analytique pour le garage : nombre de dossiers traites, temps moyen de reparation, taux de satisfaction client. | Faible (MVP) |

---

## 4. Questions de Recherche Prioritaires

### 4.1 Questions critiques (bloquantes pour le design)

| # | Question de recherche | Methode recommandee | Cible |
|---|----------------------|---------------------|-------|
| RQ1 | **A quel moment exact du parcours post-accident un conducteur serait-il pret a utiliser une application comme Carlib ?** Sur place ? 1h apres ? Le lendemain ? | Entretiens semi-directifs avec des conducteurs ayant eu un sinistre recent | 8-12 conducteurs sinistres recents |
| RQ2 | **Comment le conducteur decouvre-t-il et installe-t-il Carlib avant l'accident ?** Quel est le declencheur d'installation ? | Entretiens exploratoires + test de concept | 8-12 conducteurs |
| RQ3 | **Comment les conducteurs sinistres vivent-ils le parcours actuel (sans Carlib) ?** Quelles sont les emotions, les actions, les frictions reelles a chaque etape ? | Entretiens narratifs retrospectifs (recall d'experience) | 8-12 conducteurs sinistres dans les 12 derniers mois |
| RQ4 | **Quel est le workflow actuel des carrossiers pour recevoir et traiter un dossier sinistre ?** Outils, etapes, temps passe, frustrations. | Observation terrain (contextual inquiry) + entretiens | 5-8 garages |
| RQ5 | **Les garages sont-ils prets a adopter un outil numerique supplementaire ?** Quels sont les freins et les conditions d'adoption ? | Entretiens + test de concept (maquettes) | 5-8 garages |
| RQ6 | **Comment les conducteurs percoivent-ils la relation Carlib vs. assurance ?** Est-ce que Carlib se substitue, complete, ou court-circuite l'assurance dans leur esprit ? | Test de concept avec scenarios | 8-12 conducteurs |
| RQ7 | **Attribution automatique vs. selection conducteur : quelle est la preference des deux cotes ?** | Exercice de preference + entretiens | Conducteurs + garages |

### 4.2 Questions importantes (impactent le design mais non bloquantes)

| # | Question de recherche | Methode recommandee |
|---|----------------------|---------------------|
| RQ8 | Quels criteres de choix les conducteurs utilisent-ils pour selectionner un garage ? Poids relatif de chaque critere (prix, proximite, avis, delai, specialite). | Enquete quantitative + exercice de tri |
| RQ9 | A quelle frequence et par quel canal les garages communiquent-ils aujourd'hui avec leurs clients sur l'avancement des reparations ? | Entretiens garages |
| RQ10 | Les conducteurs sont-ils prets a prendre des photos de leur vehicule accidente dans un contexte de stress ? Quelles conditions facilitent ou empechent ce geste ? | Entretiens + simulation de scenario |
| RQ11 | Quel niveau de detail de suivi les conducteurs attendent-ils reellement ? (4 statuts suffisent-ils ?) | Exercice de design participatif |
| RQ12 | Quel est le taux de sinistres ou le vehicule est non roulable ? Impact sur le parcours de prise de RDV. | Donnees secondaires (stats assurances) + entretiens |
| RQ13 | Comment les garages gerent-ils leur planning aujourd'hui ? Quel est le niveau de maturite numerique ? | Observation terrain |
| RQ14 | Quel serait un volume minimum de dossiers/mois pour qu'un garage considere la plateforme comme utile ? | Entretiens garages |

### 4.3 Hypotheses a valider

| ID | Hypothese | Risque si fausse |
|----|-----------|-----------------|
| H1 | Un conducteur sinistre est pret a faire confiance a une application inconnue pour choisir un garage. | L'ensemble de la proposition de valeur conducteur s'effondre. Carlib devra etre recommande par l'assurance ou un tiers de confiance. |
| H2 | La declaration via Carlib est percue comme un complement (pas un remplacement) a la declaration d'assurance. | Risque legal et de reputation si les conducteurs pensent avoir "declare" officiellement via Carlib. |
| H3 | Les garages sont prets a investir du temps pour maintenir un profil et un planning a jour sur la plateforme. | Le cote offre de la marketplace sera vide ou obsolete. |
| H4 | Le modele "premier garage qui accepte" est percu comme equitable par les deux parties. | Frustration cote garages (course a la rapidite) ou cote conducteurs (pas de choix). |
| H5 | La prise de photos sur le lieu de l'accident est faisable et suffisante pour que le garage evalue le sinistre. | Le garage devra de toute facon faire sa propre expertise avant engagement, rendant la declaration photo moins utile. |
| H6 | Les notifications push sont un canal suffisant pour tenir le conducteur informe. | Taux d'activation des notifications bas = experience de suivi degradee. |
| H7 | Le conducteur a son telephone fonctionnel et suffisamment charge apres un accident. | Necessite un parcours de rattrapage (declaration a posteriori depuis un autre appareil ou le lendemain). |
| H8 | Un parcours de declaration en 4 etapes maximum est suffisant pour collecter les informations necessaires au garage. | Soit les informations sont insuffisantes (garage frustre), soit des etapes supplementaires seront necessaires (promesse UX non tenue). |

---

## 5. Jobs-to-Be-Done (JTBD)

### 5.1 Conducteur sinistre -- Laurent C.

**Job principal :**
> Quand j'ai un accident de voiture, je veux faire reparer mon vehicule le plus vite possible et avec le moins de stress possible, pour pouvoir reprendre ma vie normale.

**Jobs fonctionnels :**

| # | Job fonctionnel | Force du besoin |
|---|----------------|-----------------|
| JF1 | Documenter les degats de mon vehicule de maniere structuree pour faciliter les demarches suivantes | Elevee |
| JF2 | Trouver un garage competent, disponible et proche, sans avoir a faire des recherches moi-meme | Elevee |
| JF3 | Planifier le depot de mon vehicule a un moment qui me convient, sans echange telephonique | Moyenne |
| JF4 | Savoir ou en est la reparation de mon vehicule sans avoir a appeler | Moyenne |
| JF5 | Coordonner les differents acteurs (assurance, garage, expert) sans etre au centre de toutes les communications | Elevee |

**Jobs emotionnels :**

| # | Job emotionnel | Moment cle |
|---|---------------|------------|
| JE1 | Me sentir pris en charge et guide dans un moment de vulnerabilite | Immediat post-accident |
| JE2 | Etre rassure sur le fait que je fais les bonnes demarches | Declaration |
| JE3 | Avoir confiance dans le garage qui va reparer mon vehicule | Selection garage |
| JE4 | Reduire l'anxiete liee a l'absence de mon vehicule | Pendant la reparation |
| JE5 | Retrouver un sentiment de controle sur la situation | Tout au long du parcours |

**Jobs sociaux :**

| # | Job social |
|---|-----------|
| JS1 | Pouvoir dire a mon entourage que "c'est gere" (signal de competence) |
| JS2 | Ne pas etre percu comme quelqu'un qui se fait avoir (choix du bon garage au bon prix) |
| JS3 | Pouvoir recommander la solution a un proche si elle fonctionne |

**Resultats attendus (Outcome Expectations) :**
- Minimiser le temps entre l'accident et la prise en charge du vehicule
- Minimiser le nombre d'interlocuteurs a contacter
- Minimiser les incertitudes sur les delais et les couts
- Maximiser la transparence sur l'etat d'avancement
- Minimiser l'effort mental requis pour gerer le dossier

---

### 5.2 Gerant de carrosserie -- Mohamed D.

**Job principal :**
> Quand un conducteur a besoin de reparation carrosserie, je veux recevoir des dossiers qualifies et les gerer efficacement, pour developper mon activite tout en gardant le controle de mon planning.

**Jobs fonctionnels :**

| # | Job fonctionnel | Force du besoin |
|---|----------------|-----------------|
| JF6 | Recevoir un flux regulier de dossiers sinistres qualifies (bonne zone, bon type de reparation) | Elevee |
| JF7 | Evaluer rapidement si un dossier est dans mes competences et ma capacite avant de m'engager | Elevee |
| JF8 | Gerer mon planning de reception vehicules sans double-saisie et sans erreur | Elevee |
| JF9 | Communiquer avec le client sans perdre de temps en appels telephoniques | Moyenne |
| JF10 | Construire ma reputation en ligne pour attirer plus de clients | Moyenne |

**Jobs emotionnels :**

| # | Job emotionnel |
|---|---------------|
| JE6 | Me sentir valorise en tant que professionnel (pas juste un prestataire interchangeable dans une marketplace) |
| JE7 | Garder le controle de mon activite et de mes conditions de travail |
| JE8 | Avoir confiance dans la qualite des informations recues pour eviter les mauvaises surprises |

**Jobs sociaux :**

| # | Job social |
|---|-----------|
| JS4 | Etre reconnu comme un garage fiable et professionnel dans ma zone |
| JS5 | Ne pas etre mis en concurrence uniquement sur le prix (course vers le bas) |

**Resultats attendus (Outcome Expectations) :**
- Maximiser le ratio dossiers pertinents / dossiers recus
- Minimiser le temps administratif par dossier
- Minimiser les no-shows et annulations de derniere minute
- Maximiser la previsibilite de la charge de travail
- Minimiser les echanges non productifs avec les clients

---

### 5.3 Assurance (Vision future)

**Job principal :**
> Quand un de nos assures declare un sinistre, je veux que le parcours de reparation soit fluide et tracable, pour reduire les couts de gestion et ameliorer la satisfaction client.

**Jobs fonctionnels (anticipes) :**

| # | Job fonctionnel |
|---|----------------|
| JF11 | Recevoir automatiquement les declarations de sinistres structurees |
| JF12 | Orienter l'assure vers un garage agree du reseau |
| JF13 | Suivre l'avancement de la reparation sans echange manuel |
| JF14 | Reduire les couts de gestion de sinistres (centre d'appels, courriers) |

*Note : Ces jobs sont extrapolees car le persona assurance n'est pas defini dans le PRD. Ils devront etre valides par des entretiens avec des acteurs du secteur assurance.*

---

## 6. Pain Points & Opportunites

### 6.1 Pain Points explicitement mentionnes dans le PRD

| # | Pain Point | Persona | Source PRD |
|---|-----------|---------|------------|
| PP1 | Processus stressant et peu guide post-accident | Conducteur | Persona #1, Section 2.2 |
| PP2 | Jongler entre assurance, garage et calendrier sans outil unifie | Conducteur | Persona #1 |
| PP3 | Aucune visibilite sur les delais et le statut du vehicule | Conducteur | Persona #1, Section 2.2 |
| PP4 | Aucune app ne guide le conducteur sinistre de maniere simple et rassurante | Conducteur | Section 2.2 |
| PP5 | Pas de solution centralisee pour identifier un garage disponible et qualifie a proximite | Conducteur | Section 2.2 |
| PP6 | Gestion manuelle des dossiers sans vue d'ensemble | Garage | Persona #2 |
| PP7 | Perte de temps en appels entrants non qualifies | Garage | Persona #2 |
| PP8 | Pas d'outil pour gerer le planning de reception | Garage | Persona #2 |
| PP9 | Communication assuree-carrossier-assureur repose sur telephone, papier, delais importants | Systeme | Section 2.1 |

### 6.2 Pain Points implicites (identifies par l'analyse des parcours)

| # | Pain Point | Persona | Source d'identification |
|---|-----------|---------|----------------------|
| PP10 | **Impossibilite de pre-installer l'app avant un accident** (evenement imprevisible). Le conducteur decouvre Carlib au pire moment. | Conducteur | Analyse parcours, Lacune L1 |
| PP11 | **Confusion entre declaration Carlib et declaration legale d'assurance.** Risque de non-conformite. | Conducteur | Analyse persona assurance |
| PP12 | **Vehicule non roulable : comment organiser le transport ?** Le parcours suppose un vehicule roulable amene au garage. | Conducteur | Analyse parcours, Lacune L9 |
| PP13 | **Evaluation a distance impossible pour le garage.** Des photos ne suffisent pas pour etablir un devis precis. | Garage | Analyse parcours, Lacune G5 |
| PP14 | **Periode de demarrage a vide.** Les garages s'inscrivent mais ne recoivent aucun dossier pendant des semaines/mois. | Garage | Analyse parcours, Lacune G3 |
| PP15 | **Double saisie si le garage utilise deja un logiciel.** Carlib vient s'ajouter aux outils existants plutot que les remplacer. | Garage | Analyse persona, Lacune G7 |
| PP16 | **Mise en concurrence perçue negativement.** Le modele marketplace peut etre vecu comme une pression sur les prix par les garages. | Garage | Analyse JTBD, JS5 |
| PP17 | **Charge de travail supplementaire pour les mises a jour de statut.** Les garages doivent faire un geste supplementaire pour informer le client. | Garage | Analyse parcours, Lacune G8 |
| PP18 | **Absence de mecanisme de confiance.** Pas d'avis, pas de certification, pas de garantie. Le conducteur choisit un garage "a l'aveugle." | Conducteur | Analyse parcours, Lacune L6 |
| PP19 | **Pas de canal de communication directe conducteur-garage.** Les questions non prevues par les statuts generent des appels telephoniques. | Les deux | Analyse parcours, Lacune L13 |
| PP20 | **Pas de gestion des cas degradés.** Aucun garage disponible, accident grave, telephone casse, pas de reseau. | Conducteur | Analyse parcours, Lacune L8 |

### 6.3 Matrice Opportunites

| Opportunite | Pain Points adresses | Impact utilisateur | Faisabilite MVP | Priorite |
|------------|---------------------|-------------------|----------------|----------|
| **Checklist post-accident intelligente** : Guider le conducteur sur toutes les actions a mener (constat, photos, appels) -- pas seulement les actions Carlib. Se positionner comme l'assistant global du sinistre, pas seulement la marketplace garage. | PP1, PP4, PP11 | Tres eleve | Elevee | P0 |
| **Parcours adaptatif selon le timing** : Declaration immediate (sur les lieux) vs. declaration differee (le soir chez soi). Deux variantes du meme parcours adaptees au contexte. | PP1, PP10, L3 | Eleve | Moyenne | P1 |
| **Profils garage verifies et enrichis** : Badges de verification, avis clients, specialites, photos atelier, taux de satisfaction. Construire la confiance. | PP18, PP5 | Tres eleve | Moyenne | P0 |
| **Estimation automatique de la gravite** : A partir des photos et du type de sinistre, donner une fourchette de complexite (leger / moyen / important) pour aligner les attentes conducteur-garage. | PP13, PP3 | Eleve | Faible (tech IA) | P2 |
| **Onboarding garage accompagne** : Pas d'auto-inscription froide. Appel de bienvenue, aide a la configuration du profil, premier mois d'accompagnement. | PP14, G2 | Eleve | Elevee | P0 |
| **Messagerie integree simple** : Chat ou messages pre-formates entre conducteur et garage pour les questions courantes. | PP19, PP7 | Moyen-Eleve | Moyenne | P1 |
| **Statuts de reparation enrichis et personnalisables** : Permettre au garage de definir ses propres etapes et d'ajouter des notes/photos d'avancement. | PP3, PP17 | Moyen | Moyenne | P1 |
| **Integration depannage/remorquage** : Partenariat avec un service de depanneuse pour les vehicules non roulables. | PP12 | Eleve | Faible (partenariat) | P2 |
| **Mode "installation preventive"** : Permettre a un conducteur de creer un profil vehicule avant tout sinistre (via assurance, via achat vehicule). Pre-remplir pour le jour J. | PP10, PP1 | Moyen | Moyenne | P1 |

---

## 7. Recommandations pour la Phase 0 Kickstart

### 7.1 Plan de recherche Phase 0 (2 semaines)

La Phase 0 est definie comme 2 semaines avec PM + UX. Voici un plan d'activites de recherche realiste pour cette duree.

#### Semaine 1 : Exploration et comprehension

| Jour | Activite | Livrable | Participants |
|------|---------|----------|-------------|
| J1 | **Atelier de cadrage #1 avec le client** : Approfondir la connaissance terrain du client (secteur carrosserie). Valider les hypotheses listees dans ce document. Clarifier les 8 questions ouvertes du PRD. | Compte-rendu d'atelier, hypotheses prioritaires | PM, UX, Client |
| J1-J2 | **Recherche secondaire** : Statistiques sinistralite automobile France (FFSA, France Assureurs). Analyse concurrentielle (Tractable, HelloCars, iCar, Darva). Etude du parcours legal de declaration de sinistre. | Rapport de contexte, benchmark concurrentiel | UX |
| J2-J3 | **Recrutement participants** : 6-8 conducteurs ayant eu un sinistre dans les 12 derniers mois. 4-5 garages carrossiers (via le reseau du client). | Panel recrute | UX + Client (reseau) |
| J3-J4 | **Entretiens conducteurs** (4-6 entretiens de 45 min) : Parcours retrospectif du dernier sinistre, emotions, frictions, outils utilises, rapport a l'assurance, criteres de choix garage. | Notes d'entretien structurees, verbatims cles | UX |
| J4-J5 | **Entretiens garages** (3-4 entretiens de 45 min, idealement sur site) : Workflow actuel de reception des sinistres, outils, planning, relation client, relation assureur, freins et motivations pour un outil numerique. | Notes d'entretien structurees, verbatims cles | UX |

#### Semaine 2 : Synthese et structuration

| Jour | Activite | Livrable | Participants |
|------|---------|----------|-------------|
| J6 | **Synthese des entretiens** : Diagramme d'affinite, extraction des themes, patterns et insights. | Carte d'affinite, insights cles | UX |
| J6-J7 | **Personas affines** : Enrichir les personas du PRD avec les donnees des entretiens. Ajouter les dimensions manquantes (emotionnel, contexte, maturite numerique). Creer 1-2 personas supplementaires si les entretiens revelent des segments distincts. | Personas v2 validees par les donnees | UX |
| J7 | **Journey maps detaillees** : Cartographier le parcours conducteur et le parcours garage avec emotions, pensees, actions, touchpoints, et pain points valides par la recherche. | 2 journey maps detaillees | UX |
| J7-J8 | **Atelier de cadrage #2 avec le client** : Presenter les findings recherche. Trancher les questions ouvertes (attribution, scope garage, zone MVP). Valider les personas et parcours. | Decisions documentees, parcours valides | PM, UX, Client |
| J8-J9 | **Empathy maps** : 1 par persona principal, basees sur les verbatims d'entretiens (Says / Thinks / Does / Feels). | 2-3 empathy maps | UX |
| J9-J10 | **Backlog structure et priorise** : Integrer les findings recherche dans le backlog produit. Revalider le MoSCoW a la lumiere des insights. Identifier les risques a adresser en Phase 1 (wireframes). | Backlog produit v1, matrice de risques UX | PM + UX |

### 7.2 Outils et templates recommandes

| Outil | Usage |
|-------|-------|
| **Script d'entretien semi-directif** | A preparer pour les entretiens conducteurs et garages (2 scripts distincts) |
| **Grille d'observation contextuelle** | Pour les visites en garage (si possible) |
| **Template persona enrichi** | Integrant : contexte situationnel, etat emotionnel, maturite numerique, citation reelle, objectifs fonctionnels/emotionnels/sociaux, anti-objectifs |
| **Template journey map** | Integrant : phases, actions, pensees, emotions (courbe), touchpoints, pain points, opportunites, questions ouvertes |
| **Matrice hypotheses/risques** | Pour prioriser les validations et suivre les decisions |
| **Figma / FigJam** | Pour la synthese collaborative (diagramme d'affinite, empathy maps) |

### 7.3 Criteres de succes de la Phase 0

La Phase 0 sera consideree comme reussie si, a son terme :

1. **Les 8 questions ouvertes du PRD ont une reponse documentee** (meme si la reponse est "nous testerons les deux options en Phase 1").
2. **Les personas sont enrichis par des donnees terrain** : au minimum 4 entretiens conducteurs et 3 entretiens garages ont ete conduits et synthetises.
3. **Les parcours conducteur et garage sont cartographies de bout en bout** avec les cas limites principaux identifies (vehicule non roulable, aucun garage disponible, annulation).
4. **Le positionnement vis-a-vis de l'assurance est clarifie** : vocabulaire valide, disclaimers definis, articulation avec le parcours legal documentee.
5. **Le modele d'attribution marketplace est tranche ou transforme en test A/B** pour la Phase 1.
6. **Le backlog produit integre les findings recherche** et les risques UX sont documentes.

### 7.4 Risques si la recherche n'est pas menee

| Risque | Probabilite | Impact | Consequence |
|--------|------------|--------|-------------|
| Designer un parcours de declaration deconnecte du vecu reel post-accident | Elevee | Critique | Rejet de l'app par les conducteurs au moment cle |
| Sous-estimer les freins d'adoption des garages | Elevee | Critique | Marketplace vide cote offre |
| Confusion declaration Carlib / declaration assurance | Moyenne | Critique | Risque legal et perte de confiance |
| Parcours concu pour un "happy path" uniquement | Elevee | Majeur | Experience degradee des que la realite s'ecarte du scenario ideal |
| Modele d'attribution non adapte aux attentes des deux parties | Moyenne | Majeur | Frustration et desengagement |

---

## 8. Annexe -- Matrice de Risques Recherche

### Carte de chaleur : Hypotheses par Impact x Incertitude

```
                        INCERTITUDE
                 Faible        Moyenne        Elevee
            +-------------+-------------+-------------+
            |             |             |             |
   Eleve    |     H8      |   H1, H4   |     H2      |
            |             |             |             |
I           +-------------+-------------+-------------+
M           |             |             |             |
P  Moyen    |     H6      |   H3, H5   |     H7      |
A           |             |             |             |
C           +-------------+-------------+-------------+
T           |             |             |             |
   Faible   |             |             |             |
            |             |             |             |
            +-------------+-------------+-------------+

Legende :
- H1 : Confiance conducteur dans une app inconnue
- H2 : Confusion declaration Carlib vs. assurance
- H3 : Adoption garage d'un outil supplementaire
- H4 : Modele d'attribution equitable
- H5 : Photos suffisantes pour evaluation garage
- H6 : Notifications push comme canal suffisant
- H7 : Telephone fonctionnel post-accident
- H8 : Declaration en 4 etapes suffisante

Zone rouge (coin superieur droit) = priorite de validation immediate
```

### Matrice de priorisation des activites de recherche

| Activite | Cout (temps) | Valeur (risque adresse) | Ratio | Priorite |
|----------|-------------|------------------------|-------|----------|
| Entretiens conducteurs sinistres recents | 3 jours | Tres elevee (H1, H2, RQ1-3, RQ6) | Excellent | Immediate |
| Entretiens garages (sur site si possible) | 2-3 jours | Tres elevee (H3, H4, H5, RQ4-5) | Excellent | Immediate |
| Recherche secondaire (stats, legal, concurrence) | 1-2 jours | Elevee (H2, contexte general) | Tres bon | Immediate |
| Test de concept avec maquettes Emergent | 1 jour | Elevee (H1, H8) | Tres bon | Semaine 2 |
| Enquete quantitative criteres choix garage | 2-3 jours | Moyenne (RQ8) | Bon | Phase 1 |
| Observation contextuelle en garage | 2 jours | Moyenne-Elevee (RQ4, RQ13) | Bon | Si faisable S1 |
| Diary study conducteurs | 2+ semaines | Moyenne (usage reel) | Moyen | Phase 1-2 |

---

*Fin du document d'analyse de recherche UX -- Carlib Phase 0*

*Ce document doit etre revu et discute lors de l'atelier de cadrage #1 avec le client. Les findings de la recherche terrain viendront enrichir et potentiellement contredire certaines des analyses presentees ici, ce qui est precisement l'objectif.*
