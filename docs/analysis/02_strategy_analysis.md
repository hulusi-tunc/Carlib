# Carlib -- Strategic Analysis

**Document:** UX Strategy Analysis -- PRD Carlib v0.1  
**Date:** 2026-04-06  
**Source:** PRD_Carlib_v0.1_4.pdf (Digital Unicorn, March 2026)  
**Author:** UX Strategist Agent  
**Status:** Strategic review -- pre-design phase

---

## 1. Business Context Assessment

### 1.1 Market Opportunity

The PRD identifies a genuinely under-digitized vertical. Auto body repair in France remains dominated by phone calls, paper forms, and fragmented coordination between drivers, insurers, and body shops. This is accurate: the French "sinistre automobile" workflow is notoriously analog compared to other consumer verticals that have already been disrupted by mobile-first platforms (healthcare booking, real estate, food delivery).

**Strengths of the opportunity:**
- High emotional urgency (post-accident stress) creates strong willingness to adopt a solution that reduces friction.
- Recurring need with meaningful frequency: approximately 3.5 million auto claims are filed annually in France (source: FFA -- Federation Francaise de l'Assurance).
- The client brings domain expertise from the body shop sector, which is a critical advantage for supply-side onboarding.
- No dominant incumbent occupies this exact niche as a consumer-facing marketplace.

**Weaknesses and concerns:**
- The PRD conflates two different value propositions without resolving which one Carlib truly is: (a) a claim declaration tool, or (b) a driver-to-garage marketplace. These have fundamentally different competitive landscapes, regulatory implications, and go-to-market strategies. This ambiguity is the single biggest strategic concern in the document.
- Insurance companies are the gatekeepers. In France, most policyholders with comprehensive coverage ("tous risques") are steered toward "agreee" (approved) garages by their insurer. The PRD defers insurance integration to V2, but this is not a deferrable question -- it determines whether Carlib can realistically operate at all for a large share of drivers.
- Existing players, while not identical, are adjacent: Identicar, Darva (B2B claims platform used by insurers), and insurer-native apps (Maif, Matmut, AXA) already handle parts of this workflow. The PRD contains zero competitive analysis.

### 1.2 Positioning Gap

The PRD positions Carlib as a "marketplace" but describes a workflow that is closer to an assisted claim declaration tool with garage referral. This distinction matters enormously:

| Dimension | Claim Declaration Tool | Marketplace |
|---|---|---|
| Primary user need | "Help me handle this paperwork" | "Help me find the best garage" |
| Revenue driver | SaaS/per-claim fee to garages | Commission on matched jobs |
| Competitive moat | Workflow simplicity | Network density (supply) |
| Insurance dependency | Very high | Moderate (can work outside insurer network) |

**Recommendation:** Before any design work begins, the team must make a clear strategic choice about which of these two models Carlib is building. The MVP scope, the UX, and the go-to-market strategy are materially different for each.

---

## 2. Product Vision Clarity

### 2.1 What Is Well Articulated

- The user pain points are crisply described and ring true to real-world experience.
- The personas are solid for a Phase 0 document: Laurent (driver) and Mohamed (body shop owner) represent the right archetypes.
- The desire for a "reassuring, guided" post-accident experience is the right north star for the driver-side UX.
- The phased approach (design first, validate with garages, then develop) is pragmatic and appropriate for a bootstrapped marketplace.

### 2.2 Contradictions and Ambiguities

**Ambiguity 1 -- Claim declaration vs. marketplace identity.** As noted above, the executive summary says Carlib is "une application de declaration de sinistre automobile, positionnee comme une plateforme de mise en relation." These are two different products stitched together in one sentence. The design team will not be able to create a coherent information architecture until this is resolved.

**Ambiguity 2 -- The role of insurance.** The PRD states that insurance integration is "hors perimetre MVP" (out of MVP scope) but simultaneously describes a workflow that, for the majority of French drivers, cannot function without insurance involvement. When a driver has an accident in France, the standard process is: (1) fill out a "constat amiable" (European accident statement), (2) contact the insurer, (3) the insurer assigns or recommends a body shop. Carlib's proposed flow bypasses step 2 and 3 entirely. This works only for drivers who pay out of pocket or have very flexible policies -- a minority of the market.

**Ambiguity 3 -- Attribution logic.** Question #2 in the PRD ("automatic first-to-accept vs. driver selection") is not a minor UX detail. It fundamentally changes the marketplace dynamics:
- First-to-accept creates a speed race that favors larger garages with staff monitoring the app.
- Driver selection creates a comparison-shopping model that requires ratings, reviews, and richer garage profiles.
These are architecturally different systems. This must be resolved before wireframing begins.

**Ambiguity 4 -- Long-term vision vs. MVP tension.** The executive summary mentions "ecosystem around the vehicle (history, maintenance, garage relationship)" as a long-term vision. This is not referenced again and risks creating scope creep if not explicitly fenced off.

---

## 3. MVP Scope Analysis

### 3.1 MoSCoW Assessment

The PRD lists 14 Must-Have items, 3 Should-Have items, and 2 Won't-Have items. For a Phase 0 design project, this is concerning:

**The Must list is overloaded.**

Every single feature is marked as Must-Have except wireframes, backlog structuring, and budget projection. This defeats the purpose of MoSCoW prioritization. If everything is a Must, nothing is prioritized.

Specific concerns:

| Item | Current Priority | Recommended Priority | Rationale |
|---|---|---|---|
| Landing page vitrine | Must | Should | Not needed for design validation with garages; a clickable prototype is more convincing than a marketing page at this stage |
| Design system simple et scalable | Must | Should | A design system is important but premature for Phase 0. Design patterns will emerge from the UX work; formalizing them into a system before screens are validated risks rework |
| Maquettes haute fidelite -- portail garage (15+ ecrans) | Must | Must (but reduce scope) | 15+ screens is ambitious. The garage portal could be validated with 8-10 core screens |
| Maquettes haute fidelite -- app conducteur (20+ ecrans) | Must | Must (but reduce scope) | 20+ screens suggests feature creep. A focused declaration-to-booking flow should require 12-15 screens |
| Logique marketplace -- visibilite multi-garages, attribution, etats | Must | Must (but depends on resolving attribution question first) | Cannot design this without answering open question #2 |
| Wireframes fonctionnels intermediaires | Should | Must | Wireframes before hi-fi maquettes is standard UX practice and reduces costly rework. Skipping them to save time is a false economy |

### 3.2 Complexity Estimates

The complexity estimates are reasonable for a design-only phase but aggregate to a substantial workload:

- Must items alone: approximately 50-70 design-days (summing the ranges)
- Timeline stated: 6-8 weeks with a team of PM + UX + UI

This is tight but feasible IF the scope is genuinely controlled. The risk is that the 8 open questions, if not resolved quickly, will consume workshop time and push the timeline.

### 3.3 What Is Missing from the MVP

Several elements critical to marketplace design are absent:

- **Onboarding flow for garages**: How does a body shop sign up, verify credentials, and set up their profile? This is a core acquisition funnel, not a V2 feature.
- **Notification system design**: The PRD mentions push notifications at every status change. The notification strategy (frequency, channels, opt-in/out) needs UX attention.
- **Empty states and cold-start screens**: What does the driver see when there are zero garages in their area? What does the garage see when there are zero claims? These are the most common MVP states and the most important to design well.
- **Error and edge case flows**: What happens if no garage accepts a claim? What if a garage accepts but then cancels? What if the driver wants to change garages?
- **Rating/review system**: If the driver selects the garage (vs. first-to-accept), they need trust signals. Even a minimal version matters.
- **Account creation and authentication**: No mention of how users sign up, log in, or recover access.

---

## 4. Marketplace Dynamics

### 4.1 Two-Sided Marketplace Logic

Carlib is a classic two-sided marketplace. The PRD acknowledges this but does not address the well-known strategic challenges:

**The Chicken-and-Egg Problem:**
- Drivers will not use the app if there are no garages nearby.
- Garages will not invest time in onboarding if there are no incoming claims.
- This is the #1 killer of marketplace startups.

**The PRD's implicit strategy** is sound but under-articulated: use the design phase to create a compelling prototype, then use the prototype to recruit the first garages (supply side first), then launch to drivers. This is the correct sequencing for a supply-constrained marketplace.

### 4.2 Which Side to Prioritize

**Supply side (garages) must come first.** The reasoning:

1. The client has existing relationships in the body shop sector -- this is the unfair advantage. Exploit it.
2. Garages have a recurring need for new customers and are commercially motivated. Drivers have an intermittent need (only when an accident occurs).
3. A small number of garages (10-20 in a pilot zone) creates enough coverage for drivers. But even one driver with zero nearby garages is a dead experience.
4. The landing page with garage recruitment form correctly targets this, but it should be the #1 priority, not one of fourteen Must items.

### 4.3 Marketplace Design Risks

**Risk: Disintermediation.** Once a driver finds a good garage through Carlib, they may contact the garage directly for future needs, bypassing the platform. Mitigation: Carlib must provide ongoing value beyond initial matchmaking (status tracking, appointment management, vehicle history).

**Risk: Supply quality.** The PRD does not address garage verification, quality control, or what happens when a driver has a bad experience. For a marketplace built on trust (high-value, high-anxiety transactions), quality assurance is not optional.

**Risk: Geographic density.** A marketplace with thin geographic coverage creates a terrible first-use experience. The PRD wisely flags zone geographique as an open question, but the answer has major design implications. A city-pilot launch (e.g., Lyon or Marseille metro area) is more viable than a national launch.

---

## 5. Open Questions Impact Assessment

The PRD lists 8 open questions. I assess each for its impact on the design phase:

| # | Question | Blocker Level | Impact Assessment |
|---|---|---|---|
| 1 | Visual identity / brand charter | **HARD BLOCKER for UI phase** | UX wireframes can proceed without it, but hi-fi maquettes cannot. Must be resolved before Phase 2. Not a blocker for Phase 0-1. |
| 2 | Attribution logic (auto vs. driver choice) | **HARD BLOCKER for UX phase** | This determines the entire marketplace information architecture. Cannot begin wireframing the core flow without this decision. Must be resolved in kickoff workshops. |
| 3 | Garage portal: mobile only vs. web/tablet | **MEDIUM BLOCKER** | Affects screen count, interaction patterns, and design system scope. Body shops will likely use tablets in-shop. Recommend mobile + tablet responsive as minimum. |
| 4 | Insurance involvement in MVP | **HARD BLOCKER for product viability** | This is not an open question -- it is a business model question. If Carlib operates outside the insurance flow, the addressable market shrinks to out-of-pocket repairs, minor cosmetic damage, and non-insured incidents. This must be answered before design begins. |
| 5 | Geographic scope for MVP | **MEDIUM BLOCKER** | Affects go-to-market but not core UX design. Design can proceed with the assumption of a single metro area. |
| 6 | Revenue model | **SOFT BLOCKER** | Impacts certain screens (pricing display, subscription management for garages) but the core UX flow can be designed model-agnostically for now. Must be resolved before development. |
| 7 | Emergent AI maquettes from client | **SOFT BLOCKER** | Useful reference material but the PRD correctly states these should not be treated as validated designs. Absence slows kickoff but does not block it. |
| 8 | Kickoff date | **PROCESS BLOCKER** | Scheduling -- not a design question. |

**Summary: Questions #2 and #4 are absolute blockers.** No UX work should begin on the marketplace flow until the attribution logic and insurance role are decided. Question #1 blocks UI but not UX. The rest can be resolved in parallel with early design work.

---

## 6. Risk Assessment

### 6.1 Product Risks

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| Insurance bypass makes the product irrelevant for majority of drivers | Critical | High | Resolve question #4 immediately. Consider a minimal insurance notification feature even in MVP (e.g., generate a pre-filled claim document the driver can send to their insurer). |
| Zero marketplace liquidity at launch | Critical | High | Launch with a geographic pilot. Pre-recruit 15-20 garages before any driver acquisition. Design the empty-state experience carefully. |
| Scope creep during design phase | High | High | The 14 Must items and 35+ screens are ambitious. Ruthlessly cut to a single, complete end-to-end flow before expanding. |
| Disintermediation after first transaction | High | Medium | Build ongoing value into the platform: repair tracking, vehicle history, next-service reminders. |
| Garage adoption friction (too complex) | High | Medium | The garage interface must be extremely simple. Body shop owners are not digital natives. Design for the least tech-savvy user in the garage. |
| Regulatory risk (insurance brokering without license) | Medium | Low-Medium | If Carlib touches insurance claims directly, it may fall under insurance intermediary regulations (ORIAS registration in France). Legal review needed. |

### 6.2 UX Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Post-accident context ignored in UX | High | The driver is stressed, possibly injured, standing roadside. The first flow must be usable with one hand, in poor lighting, under stress. Consider: large tap targets, minimal text input, voice-assisted options, offline capability for photo capture. |
| Garage portal treated as secondary | High | Body shops are the paying customers in most marketplace models. Their UX deserves equal rigor. The PRD allocates 15+ screens (vs. 20+ for drivers) -- this ratio should be balanced based on actual flow complexity, not assumed priority. |
| Over-designed for Day 100, under-designed for Day 1 | High | The first user experience with zero data (no ratings, no repair history, few garages) is the real MVP test. Design for the cold-start state first, the populated state second. |
| French-language UX nuances | Medium | All screens must use correct insurance/auto repair terminology ("constat amiable," "expert automobile," "franchise," "vehicule de remplacement"). Mistranslations or generic terms will erode trust with both drivers and professionals. |
| Accessibility overlooked | Medium | The DoD mentions accessibility verification but no specific standards (WCAG level, RGAA compliance). France has legal accessibility requirements for digital services (loi du 11 fevrier 2005). Define the target compliance level now. |

---

## 7. Success Metrics

The PRD defines no success metrics whatsoever. This is a significant gap. The following metrics framework should be established before design begins:

### 7.1 Phase 0 Success Metrics (Design Phase)

| Metric | Target | Measurement |
|---|---|---|
| Garage interest rate | 30%+ of garages shown the prototype express interest in signing up | Track via landing page form submissions and demo meetings |
| Prototype usability score | SUS score >= 75 (good) on clickable prototype | Run 5-8 moderated usability tests with representative users |
| Task completion rate (driver flow) | 90%+ complete declaration-to-booking in prototype test | Usability testing |
| Task completion rate (garage flow) | 90%+ complete claim-acceptance-to-status-update in prototype test | Usability testing |
| Time to complete declaration | Target under 4 minutes for the full driver declaration flow | Measure during usability tests |
| Stakeholder alignment score | All 8 open questions resolved before Phase 2 starts | Track in project management |

### 7.2 MVP Launch Metrics (Post-Development -- Define Now, Measure Later)

| Category | Metric | Rationale |
|---|---|---|
| Supply health | Number of active garages (logged in within 7 days) | Marketplace viability |
| Supply health | Average garage response time to new claims | Quality of experience for drivers |
| Supply health | Garage acceptance rate (claims accepted / claims seen) | Signal of lead quality |
| Demand health | Number of claims submitted per week | Growth signal |
| Demand health | Driver-to-booking conversion rate | Funnel health |
| Marketplace efficiency | Match rate (claims that result in a garage booking) | Core value metric |
| Marketplace efficiency | Time from claim submission to garage confirmation | Speed of the marketplace |
| Retention | Driver return rate (second claim or referral) | Long-term value -- though frequency is naturally low |
| Retention | Garage monthly active usage | Supply-side stickiness |
| Satisfaction | NPS from drivers after repair completion | Overall experience quality |
| Satisfaction | NPS from garages after first month | Supply-side satisfaction |

### 7.3 North Star Metric Recommendation

**"Completed Repairs"** -- the number of claims that go from declaration through garage matching to repair completion. This single metric captures marketplace health end-to-end and aligns both sides of the platform.

---

## 8. Strategic Recommendations

### Priority 1 -- Resolve the Three Blockers Before Design Begins

These must be answered in the kickoff workshops, not deferred:

1. **Decide the attribution model.** Recommendation: Start with driver-selects-garage for the MVP. It is simpler to implement, gives drivers a sense of control (important in a stressful context), and produces richer engagement data. First-to-accept can be offered as a "let Carlib choose for me" shortcut.

2. **Define the insurance relationship for MVP.** Recommendation: Do not try to replace or integrate with insurance workflows in V1. Instead, position Carlib as a tool for situations where the driver manages the process themselves: minor damage, cosmetic repairs, out-of-pocket repairs, or drivers who simply want to find and compare garages before involving their insurer. This narrows the market but creates a viable beachhead. Add a "generate a claim summary PDF" feature so drivers can share their Carlib documentation with their insurer manually.

3. **Confirm the garage portal form factor.** Recommendation: Design for mobile-first but ensure the garage portal works on tablet. Many body shops will use a tablet mounted in the reception area. A responsive web app for the garage side (not native mobile) may be more practical for V1.

### Priority 2 -- Narrow the MVP Scope

- **Cut the screen count.** Target 12-15 driver screens and 10-12 garage screens for high-fidelity maquettes. Every additional screen is design debt if the underlying decisions have not been validated.
- **Promote wireframes to Must.** Intermediate wireframes are not a nice-to-have. They are the mechanism for validating flow logic before investing in high-fidelity design. Skipping them risks expensive rework.
- **Defer the design system.** Document the visual patterns as they emerge, but do not formalize a design system until the screens are validated. A premature design system is a constraint, not an asset.
- **Deprioritize the landing page.** The landing page is a marketing tool. It can be built quickly after the prototype is complete, reusing assets from the maquettes. It should not compete for design attention with the core product.

### Priority 3 -- Design for the Cold Start

The most critical screens to get right are the ones that appear when the marketplace has minimal data:

- Driver opens the app for the first time: What do they see?
- Driver submits a claim but there are only 2 garages in range: How is this presented without looking empty?
- Garage signs up but has received zero claims in 3 days: How do they stay engaged?
- Driver is standing on the roadside in the rain: Can they complete the critical first step (photos + basic info) in under 2 minutes?

These cold-start and edge-case states should be designed first, not last.

### Priority 4 -- Build the Garage Recruitment Toolkit

Since the immediate commercial goal is to sign up garage partners using the prototype, the design deliverables should explicitly include:

- A 2-minute garage-side demo flow optimized for in-person sales meetings.
- A clear "what's in it for me" value proposition screen within the garage portal.
- Mock data showing what a healthy garage dashboard looks like (incoming claims, booking calendar, revenue tracking).

### Priority 5 -- Establish a Competitive Positioning Framework

The PRD contains no competitive analysis. Before design, the team should map:

| Competitor | What They Do | Carlib Differentiation |
|---|---|---|
| Insurer native apps (AXA, Maif, Matmut, etc.) | Claim declaration for their own policyholders | Carlib is insurer-agnostic and garage-centric |
| Identicar / Allianz Repair | Insurer-driven garage networks | Carlib puts the driver in control of garage choice |
| Darva | B2B claims processing platform | Carlib is consumer-facing, not B2B infrastructure |
| Google Maps / Pages Jaunes | Garage discovery (unstructured) | Carlib offers integrated claim-to-repair workflow |
| Vroomly / iDGarages | Garage comparison for maintenance | Carlib focuses on accident repair, not routine maintenance |

This mapping will sharpen the product's positioning and messaging for both drivers and garages.

### Priority 6 -- Plan for Regulatory and Legal Review

Two items need legal attention before development (not before design, but flagged now):

- **Insurance intermediary regulations:** If Carlib facilitates any part of the insurance claim process, ORIAS registration as a "courtier" or "mandataire" may be required.
- **Personal data handling:** Accident reports contain sensitive personal data (photos of damage, location data, personal identification). RGPD/GDPR compliance must be designed into the product architecture, not bolted on later. A data flow diagram should be part of the UX deliverables.

### Priority 7 -- Define the Pilot Launch Strategy in Parallel with Design

While the design team works on screens, the business team should:

- Select a pilot city/metro area (recommendation: a mid-sized metro like Lyon, Toulouse, or Bordeaux -- large enough for density, small enough for manageable garage recruitment).
- Begin outreach to 20-30 garages in the pilot zone.
- Set a target: 15 signed garage letters of intent before development begins.
- Use the prototype in sales meetings starting Week 5 of the design phase.

---

## Summary of Critical Findings

| Finding | Severity | Action Required |
|---|---|---|
| Product identity is ambiguous (claim tool vs. marketplace) | Critical | Strategic alignment session before kickoff |
| Insurance role in MVP is unresolved and potentially market-defining | Critical | Business decision required before design |
| Attribution model is undefined but determines core UX architecture | Critical | Decide in kickoff workshop |
| MoSCoW prioritization is ineffective (14 of 19 items are Must) | High | Re-prioritize with genuine tradeoffs |
| No success metrics defined | High | Establish metrics framework before design |
| No competitive analysis | High | Conduct competitive mapping before positioning |
| Cold-start and empty states not addressed | High | Design these states first, not last |
| Wireframes wrongly classified as Should | Medium | Promote to Must |
| Regulatory implications not assessed | Medium | Schedule legal review |

---

*This analysis is based solely on PRD Carlib v0.1 (March 2026) as produced by Digital Unicorn. It is intended to inform the design kickoff and should be reviewed with the full project team before decisions are finalized.*
