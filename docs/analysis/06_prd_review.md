# PRD Design Quality Review -- Carlib v0.1

**Reviewer:** Design Quality Reviewer (Senior)  
**Document:** PRD Carlib -- Phase Design UX/UI, v0.1 Draft  
**Author:** Digital Unicorn  
**Date of Review:** 2026-04-06  
**PRD Date:** Mars 2026  

---

## 1. PRD Completeness

### Well-Covered Areas

| Section | Assessment |
|---------|------------|
| **Executive Summary** | Strong. Clearly articulates the dual-sided marketplace vision, the validation-first strategy, and the business rationale for a design-before-dev approach. |
| **Context & Problem Statement (S2)** | Excellent. Five user frictions are crisply enumerated for both sides of the marketplace (driver and body shop). The opportunity framing is honest about the "validate before building" stage. |
| **Personas (S3)** | Good foundation. Two well-structured personas with realistic goals, frictions, and demographic context. The tertiary persona (insurance) is wisely flagged as out-of-MVP-scope but architecturally relevant. |
| **Functional Scope -- MoSCoW (S4.1)** | Very good. 19 line items with priority, complexity estimates, status, and epic groupings. The "Won't" items (dev, API insurance) set clear boundaries. |
| **User Journeys (S6)** | Adequate. Both the driver and body-shop flows are documented step-by-step with enough detail to begin wireframing. |
| **Roadmap (S7)** | Clear phasing with realistic durations (6-8 weeks total). Dependencies between phases are implicit but logical. |
| **Definition of Done (S8)** | Present and structured by category -- rare for a v0.1 PRD, and a positive sign. |
| **Open Questions (S9)** | Transparent. Eight questions are logged with owners and statuses. This is a sign of a healthy process. |

### Missing or Thin Areas

| Gap | Severity | Impact on Design |
|-----|----------|-----------------|
| **No information architecture (IA) or sitemap** | High | Designers will make incompatible structural assumptions about navigation, tab hierarchy, and screen depth without a shared IA skeleton. |
| **No error/edge-case catalogue** | High | The DoD mentions "empty states, error, loading" but the PRD provides zero specification of what errors exist (GPS denied, camera denied, network offline, no garages nearby, garage rejects after acceptance, overlapping bookings). Each of these requires a distinct UX pattern. |
| **No notification strategy** | Medium | Push notifications are mentioned in US04 and S6, but there is no map of which events trigger notifications for which persona, via which channel (push, in-app, SMS, email), and whether notifications are opt-in or mandatory. This is a design-critical decision. |
| **No authentication / account model** | High | The PRD never specifies how users sign up, log in, or recover accounts. Phone-based OTP? Email + password? Social login? This shapes every first-run screen. |
| **No data model or field inventory** | Medium | The "dossier sinistre" is referenced throughout, but its fields are never enumerated. What exactly is in a claim file? Vehicle registration, insurance number, photos, GPS coordinates, counter-party info, constat amiable fields? Designers cannot build forms without knowing the data. |
| **No content strategy or tone guidelines** | Medium | The PRD says "entierement en francais" and "rassurante" but provides no microcopy direction, no voice & tone chart, and no guidance on how to address a stressed post-accident user versus a busy workshop manager. |
| **No competitive/comparable analysis** | Low | The PRD claims "aucune application grand public" exists, but provides no evidence. Even brief references to adjacent apps (Mon Garage, iCrash, Luko, Euro Assurance) would calibrate design expectations. |
| **No accessibility requirements** | High | The DoD says "accessibilite verifiee" but the PRD sets no accessibility target (WCAA 2.1 AA? RGAA 4.1?). Without a declared standard, "verified" is unverifiable. |
| **No offline/degraded-network strategy** | Medium | A post-accident user may have poor connectivity. The PRD is silent on whether the claim flow works offline or requires constant connectivity. This has major UX architecture implications. |
| **No legal / GDPR / consent requirements** | Medium | Photo capture, geolocation, personal data, vehicle data -- all require explicit consent flows and privacy notices under RGPD. None are mentioned. |

---

## 2. User Story Quality

### Overall Assessment: 7/10 -- Functional but Inconsistent

The PRD contains 10 user stories (US01-US10). They follow standard "En tant que... je veux... pour..." structure (though the "pour/afin de" benefit clause is omitted in all 10, weakening traceability to user goals).

### Story-by-Story Evaluation

| ID | Story | Acceptance Criteria Quality | Issues |
|----|-------|---------------------------|--------|
| **US01** | Declare claim in guided steps | Partially testable. "4 etapes max" is testable. "Infos pre-remplissables" is vague -- pre-filled from what source? "Progression visible" is testable. | Missing: what happens if the user abandons mid-flow? Is draft saved? What are the 4 steps exactly? |
| **US02** | View nearby garages | Good. "Liste + carte" is testable. "Filtres (distance, disponibilite)" is testable. "Fiche garage" is testable but field list is missing. | Missing: What if zero garages are found? What is the default sort? What distance radius? |
| **US03** | Select garage and book slot | Partially testable. "Calendrier des disponibilites" is testable. "Confirmation en temps reel" is vague -- what is "real-time"? "Recapitulatif envoye" -- via what channel? | Missing: cancellation/rescheduling policy. What if the last slot is taken between selection and confirmation? |
| **US04** | Track repair status | Good. Four explicit statuses. "Notifications push a chaque changement" is testable. | Missing: Can the driver contact the garage from this screen? What if status regresses (e.g., from "en reparation" back to "en attente")? |
| **US05** | Body shop views and accepts claims | Good structure. "Bouton accepter/refuser" is testable. "Dossier complet accessible en un clic" is testable. | Missing: What does "refuse" trigger? Can a garage un-accept? What qualifies a claim for a given garage's zone? |
| **US06** | Manage availability/planning | Good. "Vue semaine" is testable. "Ajout/blocage de creneaux" is testable. "Synchronisation" is vague -- sync with what external system? | Missing: granularity of slots (15min? 30min? 1h?). Recurring availability patterns? |
| **US07** | Update repair status | Simple and testable. "Bouton de changement de statut simple" and "message automatique" are clear. | Missing: Can the garage add notes/photos to the status update? What prevents accidental status changes? |
| **US08** | Body shop profile management | Adequate. Fields listed (nom, photos, specialites, zone, disponibilites). "Modifications en autonomie" is testable. | Missing: Is there a profile review/approval process? Photo requirements? Maximum specialities? |
| **US09** | Automatic claim transmission to garage | Good. "Transmission sans ressaisie" is testable. "Accuse de reception visible" is testable. | Missing: timing (immediate on acceptance? on booking?). What data is transmitted? Privacy implications? |
| **US10** | Landing page conversion | Well-defined. "Hero clair", "3 etapes", "benefices garages", "formulaire visible" are all testable layout requirements. | Missing: success metric (conversion target?). What happens after form submission? Confirmation page? Email follow-up? |

### Systemic Issues with User Stories

1. **No benefit clause ("afin de...")**: Every story omits the reason/benefit, making it harder to evaluate whether the acceptance criteria actually deliver the intended value.
2. **No negative/edge-case stories**: There are zero stories covering failure states -- what happens when a claim is rejected, when a garage cancels, when a driver has no network, when photos fail to upload.
3. **Missing cross-persona stories**: No story covers the handoff moment between personas (e.g., "When a garage accepts my claim, I (driver) receive confirmation within X seconds").
4. **No onboarding/authentication stories**: The entire sign-up/login/profile-creation flow is absent from the story set.
5. **No settings/preferences stories**: Notification preferences, language, account deletion -- none are represented.

---

## 3. Scope Clarity

### MVP Boundary: Partially Clear

**What is clear:**
- This is a "Phase 0 -- Design" engagement, not a development phase.
- The deliverables are Figma files, a clickable prototype, and a landing page.
- Development is explicitly out of scope ("Won't").
- Insurance integration is explicitly deferred to V2.

**What is ambiguous (scope creep risks):**

| Ambiguity | Scope Creep Risk | Recommendation |
|-----------|-----------------|----------------|
| **"20+ ecrans conducteur" and "15+ ecrans garage"** | High. "20+" is open-ended. It could mean 20 or 45. Scope should specify an exact screen list, not a minimum. | Produce an exhaustive screen inventory during Phase 0 kickstart and freeze it before UI begins. |
| **"Logique marketplace -- visibilite multi-garages, attribution, etats"** | High. The attribution model (Question #2) is unresolved. Designing "both options" doubles the work. | Block UI phase until attribution model is decided. This is a true blocker. |
| **"Design system simple et scalable"** | Medium. "Simple" and "scalable" are subjective. How many components? Dark mode? Does it cover web + mobile? | Define a component inventory ceiling (e.g., max 30 components) and declare what platforms the design system covers. |
| **"Prototype cliquable complet"** | Medium. "Complet" is dangerous. Does it mean every screen is linked, or only the happy path? Does it include error states, empty states? | Define "complet" as "all happy-path flows for both personas, plus 3 key error states." |
| **Landing page scope** | Low. Landing page requirements (S5.0) are well-scoped. | Confirm whether the landing page is designed only or also developed (HTML/CSS). |
| **Wireframes are "Should" not "Must"** | Medium. Skipping wireframes and going straight to hi-fi is risky for a v0.1 product with unresolved questions. | Elevate wireframes to "Must" for at least the driver claim flow -- the most complex and novel interaction. |

### Terminology Inconsistency Creating Confusion

The document uses "MVP" to mean two different things:
1. The design-phase MVP (what gets designed now -- Phase 0).
2. The future development MVP (what gets built in Phase 1+).

This dual usage could cause stakeholder confusion. Recommend using "Design Scope" for the current phase and reserving "MVP" for the development build.

---

## 4. Definition of Done Evaluation

### Structure: Good (8.1 General + 8.2 Category-specific)

### Strengths
- Empty states, error states, and loading states are explicitly required -- this is above average for a design PRD.
- "Prototype teste sur mobile reel" is an excellent criterion that many teams skip.
- "Zero faute" on French translations shows attention to detail.
- Brief developpement with budget estimation ensures design-to-dev handoff is scoped.

### Gaps and Weaknesses

| Missing Criterion | Why It Matters |
|-------------------|----------------|
| **No accessibility standard declared** | "Accessibilite verifiee" against what standard? WCAG 2.1 AA? RGAA? Without a declared level, this criterion is untestable and will be interpreted subjectively. |
| **No contrast ratio / touch target minimums** | Mobile-first app needs explicit minimum touch targets (44x44pt per Apple HIG, 48x48dp per Material) and contrast ratios (4.5:1 for body text). |
| **No responsive breakpoints defined** | Question #3 asks whether the garage portal is mobile-only or also web/tablet. The DoD cannot be evaluated until this is answered. |
| **No usability testing criterion** | The prototype is "validated by the client" but never tested with actual users. For a marketplace solving a stress-context problem (post-accident), at least guerrilla usability testing should be in the DoD. |
| **No annotation/specification criterion** | Figma files need developer-ready annotations (spacing values, interaction specs, redlines). "Fichiers organises et nommes" is not sufficient for handoff. |
| **No versioning or iteration cap** | How many rounds of client revision are included? Without this, "valide et approuve par le client" becomes an infinite loop. |
| **No performance perception criterion** | Loading states are mentioned, but there is no guidance on perceived performance (skeleton screens vs. spinners, progressive loading). |

### Recommendation
Add a DoD addendum during Phase 0 kickstart that includes: declared accessibility level, touch target minimums, max revision rounds, and a usability testing gate.

---

## 5. Open Questions Severity Rating

Each of the 8 open questions is rated for its impact on the design phase specifically.

| # | Question | Design Impact | Blocker? | Rationale |
|---|----------|--------------|----------|-----------|
| **1** | Brand identity / logo | **CRITICAL** | Yes -- blocks UI phase | Every high-fidelity screen depends on color palette, typography, and logo. Without a confirmed brand identity, UI work is speculative. This must be resolved before Phase 2 (UI) begins. Can proceed through Phase 1 (UX/wireframes) without it. |
| **2** | Attribution logic (auto vs. driver-selected) | **CRITICAL** | Yes -- blocks UX phase | This is the single most consequential UX decision in the entire product. Auto-attribution produces a fundamentally different flow (driver submits and waits) versus active selection (driver browses, compares, and chooses). The entire garage-selection screen, the claim lifecycle, the notification model, and the marketplace dynamics change. Cannot begin wireframing the core flow without this decision. |
| **3** | Garage portal: mobile-only vs. web/tablet | **HIGH** | Partial blocker | If the portal must also work on tablet/desktop, the design system needs responsive patterns, the screen count increases by 30-50%, and the timeline extends. This must be answered before estimating effort for Phase 2. UX wireframes can begin mobile-first and adapt later, but UI cannot. |
| **4** | Insurance involvement in MVP | **MEDIUM** | No | The PRD already defers insurance integration to V2. However, if the client changes their mind and wants even a light insurance touchpoint (e.g., "enter your insurance reference number"), this adds 2-3 screens to the driver flow. Recommend confirming the hard exclusion in writing. |
| **5** | Geographic scope (national/regional/city) | **LOW for design** | No | Geographic scope affects business strategy and marketing copy, but the UX patterns (search radius, map zoom level, "no results" thresholds) are essentially the same regardless of launch geography. Minor impact on landing page copy. |
| **6** | Revenue model | **MEDIUM** | No, but affects specific screens | If the model is commission-per-claim, the garage sees pricing on claim cards. If it is a subscription, there is a subscription management screen. If freemium, there are feature gates and upsell modals. This does not block core flow design but will add 2-5 screens once decided. Recommend designing the core flows first and layering monetization UI once the model is confirmed. |
| **7** | Client's Emergent mockups sharing | **HIGH** | Yes -- blocks Phase 0 kickstart | The entire PRD references these AI-generated mockups as the starting point. If they are never shared, the design team starts from zero with no client visual reference, increasing misalignment risk. This is a process blocker, not a design blocker per se. |
| **8** | Kickoff date | **ADMINISTRATIVE** | Process blocker only | Not a design question, but delays here cascade through the entire 6-8 week timeline. |

### Summary: 2 true design blockers (#1, #2), 2 high-impact items (#3, #7), 2 medium (#4, #6), 2 low/administrative (#5, #8).

**Recommendation:** Do not begin Phase 1 (UX) until Question #2 is resolved. Do not begin Phase 2 (UI) until Question #1 is resolved. Escalate Question #7 immediately -- it is a prerequisite for the kickoff.

---

## 6. Consistency Check

### Contradictions and Misalignments Found

| # | Location A | Location B | Contradiction | Severity |
|---|-----------|-----------|--------------|----------|
| **C1** | S5.1: "Rassurant & grand public" | S4.1: Landing page is listed as a "Must" deliverable | The landing page targets garages (B2B), not the general public. The design principles focus entirely on the driver (B2C) persona. There are no design principles guiding the B2B tone of the landing page or the garage portal experience. | Medium |
| **C2** | S6.2: "Creation et gestion: informations garage" | US08: "Acceder a un profil complet" | S6.2 implies garage profile *creation* is in scope (onboarding a new garage). US08 only covers *updating* an existing profile. Is garage onboarding/registration in the design scope? This is never explicitly stated as a user story. | High |
| **C3** | S6.3: "Attribution au premier garage acceptant -- ou selection active par le conducteur" | US02 + US03: Driver *selects* a garage and *books* a slot | The user stories assume the driver-selects model. The marketplace logic section says it could be either model. If auto-attribution is chosen, US02 and US03 need complete rewriting. | High |
| **C4** | S4.1: "Wireframes fonctionnels" rated as "Should" | S7.1: Phase 1 deliverables include "Wireframes fonctionnels conducteur + garage" | The roadmap treats wireframes as a Phase 1 deliverable (implying they will be done), but the MoSCoW table rates them as "Should" (implying they might be cut). Which is it? | Medium |
| **C5** | S8.1: "Etats vides (no data, erreur reseau, chargement) designes pour chaque ecran principal" | S4.2: Zero user stories cover error or empty states | The DoD requires error states to be designed, but no user story defines what those error states are or their acceptance criteria. Designers have no requirements to work from. | Medium |
| **C6** | S3: "A l'onboarding, chaque utilisateur configure son profil et ses preferences selon son role" | Entire PRD: No onboarding flow is documented anywhere | Section 3 references an onboarding experience, but no user story, journey map, or screen inventory covers it. This is a phantom feature -- mentioned but never specified. | High |

---

## 7. Missing Flows

The following user flows are implied by the PRD but have no documentation, no user stories, and no acceptance criteria.

### Critical Missing Flows

| Flow | Where Implied | Impact if Undesigned |
|------|--------------|---------------------|
| **Account creation / sign-up** (both personas) | S3: "chaque utilisateur configure son profil" | Cannot test the prototype without knowing how users enter the system. This is literally the first screen every user sees. |
| **Login / authentication** | Nowhere -- completely absent | Security model, session management, biometric unlock, password recovery -- all unspecified. |
| **Driver onboarding** (first-time experience) | S3: "configure son profil et ses preferences" | Post-registration, what does the driver set up? Vehicle info? Insurance details? Notification preferences? |
| **Garage onboarding / registration** | S6.2: "Creation... informations garage" | How does a body shop go from "interested" (landing page form) to "active on the platform"? Is there a verification/approval step? |
| **Claim cancellation / modification** | Implied by any transactional flow | What happens if a driver started a claim by mistake? Or needs to add photos later? |
| **Booking cancellation / rescheduling** | US03 covers booking, but not un-booking | Drivers cancel appointments. This is inevitable. What is the policy? What screens are needed? |
| **Garage rejection after acceptance** | US05 covers accept/refuse, but not post-acceptance withdrawal | A garage may accept a claim and then realize they cannot handle it. What happens? |

### Important Missing Flows

| Flow | Where Implied | Impact if Undesigned |
|------|--------------|---------------------|
| **Notification center / history** | US04: "notifications push" | Where do past notifications live? Is there an in-app notification feed? |
| **Settings / preferences** | S3: "preferences selon son role" | Notification toggles, language, account deletion (RGPD right), contact info updates. |
| **Help / support / FAQ** | Nowhere | A post-accident user in distress needs a way to get help. No support channel is defined. |
| **Rating / review system** | Nowhere -- but standard for marketplaces | The PRD never mentions whether drivers can rate garages or vice versa. This is a marketplace trust mechanism that should be consciously included or excluded. |
| **Multi-vehicle management** | Nowhere | Can a driver have multiple vehicles? Multiple active claims? This affects the home screen architecture. |
| **Garage dashboard / analytics** | Nowhere | Body shops will want to see how many claims they received, accepted, completed. Even a simple dashboard is expected. |
| **Constat amiable (accident report) integration** | S2.2 implies the claim replaces or supplements the traditional report | Is Carlib a replacement for the paper constat amiable, or a complement? This is legally significant in France and architecturally significant for the form design. |

### Recommendation
At minimum, the following flows must be designed before the prototype can be considered "complet" (per the DoD): account creation, login, driver onboarding, garage onboarding, claim cancellation, and booking cancellation. These should be added as user stories during the Phase 0 kickstart.

---

## 8. Overall Quality Rating

### Rating: 3.2 / 5 -- Solid Foundation with Structural Gaps

| Criterion | Score (1-5) | Weight | Weighted |
|-----------|------------|--------|----------|
| Vision clarity | 4.5 | 15% | 0.675 |
| Problem articulation | 4.0 | 10% | 0.400 |
| Persona quality | 3.5 | 10% | 0.350 |
| Functional scope definition | 3.5 | 15% | 0.525 |
| User story quality | 3.0 | 15% | 0.450 |
| Journey/flow completeness | 2.5 | 15% | 0.375 |
| DoD rigor | 3.0 | 10% | 0.300 |
| Internal consistency | 2.5 | 10% | 0.250 |
| **Weighted Total** | | **100%** | **3.325** |

### Summary Assessment

**Strengths.** This PRD does several things well for a v0.1 draft. The vision is compelling and clearly articulated. The two-sided marketplace framing is honest about its complexity. The MoSCoW table is detailed and actionable. The inclusion of a Definition of Done and an open questions log shows process maturity. The decision to validate through design before committing to development is strategically sound.

**Weaknesses.** The PRD falls short on the operational detail that designers need to do their work. The core marketplace mechanic (attribution model) is unresolved and creates a fork in the UX that cannot be wireframed without a decision. Six high-impact user flows are implied but never specified -- most critically, the entire onboarding and authentication experience. The user stories lack benefit clauses, edge cases, and cross-persona handoff moments. The internal consistency issues (especially C3 and C6) suggest the document was assembled quickly without a cross-reference pass.

**Verdict.** This PRD is adequate as a *kickoff input document* but insufficient as a *design specification*. It should not be handed to designers as-is and treated as a requirements baseline. It needs one round of structured revision -- ideally during the Phase 0 kickstart workshops -- to resolve the two critical blockers (Questions #1 and #2), add the missing flows, tighten the user stories, and reconcile the internal contradictions.

### Priority Actions Before Design Begins

1. **Resolve Question #2 (attribution model)** -- This is the single highest-impact decision. Schedule a dedicated 60-minute workshop with the client.
2. **Add missing user stories** -- Onboarding, authentication, cancellation, settings. Aim for 16-18 total stories to cover the actual scope.
3. **Produce a screen inventory** -- Replace "20+ ecrans" with an exact numbered list of screens per flow. This becomes the scope contract.
4. **Reconcile contradictions C3 and C6** -- Update user stories to match the marketplace logic section, and document the onboarding flow that Section 3 references.
5. **Declare an accessibility standard** -- Add "WCAG 2.1 AA" (or RGAA 4.1 for French regulatory alignment) to the DoD.
6. **Define the data model for a claim file** -- Enumerate every field in a "dossier sinistre." Designers cannot build forms without a field list.
7. **Resolve Question #1 (brand identity)** -- Must be done before Phase 2 (UI) begins, but can proceed in parallel with Phase 1 (UX).

---

*Review conducted on 2026-04-06. Based on PRD Carlib v0.1 -- Draft, Mars 2026, by Digital Unicorn.*
