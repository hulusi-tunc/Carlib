# Carlib -- Design Operations & Delivery Analysis

**Document version:** 1.0
**Date:** 2026-04-06
**Source:** PRD Carlib v0.1 (Draft, Mars 2026)
**Analyst role:** Design Operations Lead
**Agency:** Digital Unicorn

---

## Table of Contents

1. [Executive Assessment](#1-executive-assessment)
2. [Roadmap Feasibility Analysis](#2-roadmap-feasibility-analysis)
3. [Phase Dependency Map](#3-phase-dependency-map)
4. [Team & Resource Assessment](#4-team--resource-assessment)
5. [Deliverable Checklist](#5-deliverable-checklist)
6. [Risk Register](#6-risk-register)
7. [Sprint Planning Suggestion](#7-sprint-planning-suggestion)
8. [Dev Handoff Considerations](#8-dev-handoff-considerations)
9. [Recommendations](#9-recommendations)

---

## 1. Executive Assessment

The PRD describes a Phase 0 (design-only) engagement to produce a validated prototype, design system, and landing page for Carlib -- a mobile-first marketplace connecting accident-involved drivers with body shops in France. The stated timeline is 6-8 weeks across 5 phases with a 3-person core team (PM + UX + UI).

**Overall verdict: The timeline is tight but achievable -- with conditions.** The 6-week target is realistic only if (a) all 8 open questions are resolved by end of Phase 0, (b) the client is available for weekly validation checkpoints, and (c) scope is strictly held to Must-have items. Slippage to 8 weeks is likely. Slippage beyond 8 weeks is a real risk if open questions stall or scope creep occurs.

---

## 2. Roadmap Feasibility Analysis

### 2.1 Effort Estimation Cross-Check

The PRD provides complexity ratings (S/M/L/XL) with day ranges. Summing all Must-have items:

| Deliverable | PRD Complexity | Estimated Days |
|---|---|---|
| Ateliers de cadrage + MVP definition | M | 3-5 |
| Personas + parcours cibles | M | 3-5 |
| Parcours conducteur -- declaration guidee | L | 5-8 |
| Parcours conducteur -- selection garage | L | 5-8 |
| Parcours conducteur -- reservation RDV | M | 3-5 |
| Parcours conducteur -- suivi reparation | M | 3-5 |
| Portail garage -- consultation sinistres | L | 5-8 |
| Portail garage -- gestion dossier | L | 5-8 |
| Portail garage -- planning/dispos | M | 3-5 |
| Logique marketplace | M | 3-5 |
| Maquettes HiFi conducteur (20+ ecrans) | XL | 8+ |
| Maquettes HiFi garage (15+ ecrans) | L | 5-8 |
| Design system | M | 3-5 |
| Prototype cliquable complet | M | 3-5 |
| Landing page vitrine | M | 3-5 |
| **TOTAL (Must only)** | | **57-90 person-days** |

At 5 working days/week, that is **11.4 to 18 person-weeks** of effort. With a 3-person team working 6-8 weeks, you have 18-24 person-weeks of capacity. This means:

- **Best case (57 days / 18 person-weeks):** Comfortable. Buffer exists for Should-haves and iterations.
- **Worst case (90 days / 18 person-weeks):** The entire 6-week capacity is consumed with zero buffer. You must extend to 8 weeks.
- **Realistic case (~72 days / 24 person-weeks at 8 weeks):** Achievable with tight management and minimal rework.

### 2.2 Key Feasibility Concerns

1. **35+ screens total** (20+ driver + 15+ garage): At high-fidelity, this is substantial. Each screen requires normal state, empty state, error state, and loading state per the DoD -- effectively 4x the screen count for edge cases. That is 140+ screen variants.
2. **Serial bottleneck on UI phase:** UX wireframes must be validated before UI starts. Any delay in Phase 1 directly compresses Phase 2.
3. **Landing page is underestimated at M (3-5 days):** If it requires custom illustration, copywriting, responsive design, and a functional form, this could easily be 5-7 days.
4. **Prototype assembly time is underestimated:** Linking 35+ screens with transitions, micro-interactions, and two complete user flows (driver + garage) in Figma takes more than 3 days.

### 2.3 Verdict

| Scenario | Timeline | Probability |
|---|---|---|
| Everything goes perfectly, fast client feedback | 6 weeks | 15% |
| Normal pace, minor delays, 1 round of rework | 7-8 weeks | 55% |
| Open questions stall, scope creep, slow feedback | 9-10 weeks | 25% |
| Major blockers (no brand identity, pivot) | 10+ weeks | 5% |

**Recommendation:** Plan for 8 weeks internally. Communicate 6-8 weeks externally. Build a 1-week buffer into Phase 2 (UI) as that is the highest-risk phase for rework.

---

## 3. Phase Dependency Map

### 3.1 Sequential Dependencies (Critical Path)

```
Phase 0 (Kickstart)
    |
    |-- Personas validated ---------> Phase 1 (UX) BLOCKED until personas done
    |-- MVP scope confirmed --------> Phase 1 (UX) BLOCKED until scope locked
    |-- Open questions resolved ----> Phase 1/2 BLOCKED on attribution logic,
    |                                  garage platform scope, brand identity
    |
Phase 1 (UX)
    |
    |-- Driver wireframes ----------> Phase 2 (UI) driver HiFi BLOCKED
    |-- Garage wireframes ----------> Phase 2 (UI) garage HiFi BLOCKED
    |-- Marketplace logic ----------> Phase 2 (UI) flow logic BLOCKED
    |
Phase 2 (UI)
    |
    |-- Design system --------------> Phase 3 (Landing) uses design system
    |-- HiFi screens ---------------> Phase 4 prototype assembly
    |
Phase 3 (Landing)
    |
    |-- Landing page ---------------> Phase 4 review (can run parallel to late Phase 2)
    |
Phase 4 (Finalization)
    |-- Depends on ALL above being substantially complete
```

### 3.2 What Blocks What -- Critical Blockers

| Blocker | Blocks | Severity |
|---|---|---|
| Open Q#1: Brand identity / logo | ALL of Phase 2 (UI), Phase 3 (Landing) | **CRITICAL** -- Must resolve in Phase 0 |
| Open Q#2: Attribution logic (auto vs manual) | UX wireframes for marketplace flow, garage flow | **HIGH** -- Must resolve by end of Week 2 |
| Open Q#3: Garage portal platform (mobile vs web) | Entire garage UX/UI scope and screen count | **HIGH** -- Changes effort estimate significantly |
| Open Q#7: Client Emergent mockups not shared | Phase 0 workshops, UX reference baseline | **HIGH** -- Needed before kickoff |
| Open Q#8: Kickoff date not set | Everything | **CRITICAL** -- Timeline cannot start |
| Client validation of wireframes | Phase 2 start | **HIGH** -- Must have formal sign-off gate |

### 3.3 Parallelization Opportunities

| Parallel Track A | Parallel Track B | When |
|---|---|---|
| UX driver flow wireframes | UX garage flow wireframes | Phase 1 (if 2 UX resources or one fast designer) |
| UI driver HiFi screens | Design system foundation | Early Phase 2 |
| UI garage HiFi screens | Prototype linking (driver done screens) | Mid-Late Phase 2 |
| Landing page design | Final HiFi iterations on app | Phase 3 overlapping late Phase 2 |
| Client review of prototype | Dev brief / budget estimation | Phase 4 |

**Key insight:** Phase 3 (Landing) can start 3-5 days before Phase 2 finishes, since the design system will be established by mid-Phase 2. This is the primary parallelization to exploit.

---

## 4. Team & Resource Assessment

### 4.1 Current Team (per PRD)

| Role | Allocation | Phases |
|---|---|---|
| PM (Lead) | Full-time | All phases |
| UX Designer | Full-time | Phase 0, 1, 2, 4 |
| UI Designer | Full-time | Phase 2, 3, 4 |

### 4.2 Assessment: Is PM + UX + UI Sufficient?

**Short answer: Barely, with risks.**

**Strengths of this team size:**
- Lean decision-making, fast alignment
- Low communication overhead
- Appropriate for a design-only phase (no dev)

**Gaps and risks:**

| Gap | Impact | Mitigation |
|---|---|---|
| **No dedicated copywriter/UX writer** | App is entirely in French, insurance/automotive terminology matters. "Zero faute" is a DoD criterion. Bad copy undermines the "reassuring" brand promise. | PM or UX handles copy; budget 2 days for professional proofreading at end. |
| **UI designer idle during Phase 0-1 (3-5 weeks)** | Paying for a resource not contributing. Or alternatively, UI joins late and has a compressed timeline. | Start UI on design system foundations, moodboard exploration, and component library setup during Phase 1. Do NOT leave UI idle. |
| **No QA / design review resource** | The DoD requires empty states, error states, accessibility checks, French proofreading. Who does this? | PM must own QA checklist. Schedule a formal internal design review before each client checkpoint. |
| **Single point of failure on UX** | If the UX designer is unavailable for even 3 days during Phase 1, the critical path slips by 3+ days. | Cross-train PM on Figma basics. Ensure UX documents decisions in real-time (not just in their head). |
| **No motion/interaction designer** | Prototype "transitions fluides" require interaction design expertise. | UI designer handles this, but allocate specific time for it -- do not treat it as an afterthought. |
| **Client-side PM not identified** | PRD says "Secondary PM: A completer." Without a client-side decision-maker with authority, approvals will stall. | Escalate immediately. Identify and confirm the client decision-maker before kickoff. |

### 4.3 Recommended Team Adjustments

1. **Must have:** Confirm client-side PM / decision-maker with authority to approve deliverables within 48 hours of presentation.
2. **Should have:** A French-language copywriter or UX writer for 3-5 days during Phase 2 to finalize all screen labels, error messages, and landing page copy.
3. **Nice to have:** A second UX/UI generalist for 2 weeks during Phase 2 peak to parallelize driver and garage HiFi production.

---

## 5. Deliverable Checklist

### 5.1 Phase 0 -- Kickstart (Weeks 1-2)

- [ ] Kickoff meeting conducted with client
- [ ] Client Emergent (AI) mockups received and inventoried
- [ ] Workshop #1: Vision alignment & MVP scope confirmation
- [ ] Workshop #2: Persona validation (Laurent C. driver, Mohamed D. garage)
- [ ] Workshop #3: User journey mapping (driver flow + garage flow)
- [ ] Open questions #1-#8 resolved or escalation path defined
- [ ] Attribution logic decided (auto-assign vs driver-selects)
- [ ] Garage portal platform decided (mobile-only vs mobile + web/tablet)
- [ ] Brand identity direction confirmed (logo, colors, fonts baseline)
- [ ] Insurance involvement in MVP scope confirmed (in or out)
- [ ] Geographic scope for MVP confirmed
- [ ] Revenue model confirmed (impacts screen design)
- [ ] Backlog MVP / V1 / evolutions structured (Should-have)
- [ ] Budget projection framework for future dev (Should-have)
- [ ] Phase 0 sign-off document (client approval to proceed)

### 5.2 Phase 1 -- UX (Weeks 3-5)

- [ ] Information architecture for driver app
- [ ] Information architecture for garage portal
- [ ] Wireframes -- Driver: Onboarding / account creation
- [ ] Wireframes -- Driver: Home / dashboard
- [ ] Wireframes -- Driver: Sinistre declaration Step 1 (type selection)
- [ ] Wireframes -- Driver: Sinistre declaration Step 2 (photo capture)
- [ ] Wireframes -- Driver: Sinistre declaration Step 3 (vehicle info)
- [ ] Wireframes -- Driver: Sinistre declaration Step 4 (location)
- [ ] Wireframes -- Driver: Declaration summary / confirmation
- [ ] Wireframes -- Driver: Garage list view (with filters)
- [ ] Wireframes -- Driver: Garage map view
- [ ] Wireframes -- Driver: Garage detail card
- [ ] Wireframes -- Driver: Booking calendar / slot selection
- [ ] Wireframes -- Driver: Booking confirmation
- [ ] Wireframes -- Driver: Repair status tracking (4 states)
- [ ] Wireframes -- Driver: Notifications / activity feed
- [ ] Wireframes -- Driver: Profile / settings
- [ ] Wireframes -- Driver: Sinistre history
- [ ] Wireframes -- Garage: Onboarding / profile setup
- [ ] Wireframes -- Garage: Dashboard / overview
- [ ] Wireframes -- Garage: Available sinistres list (filtered)
- [ ] Wireframes -- Garage: Sinistre detail / dossier view
- [ ] Wireframes -- Garage: Accept / decline flow
- [ ] Wireframes -- Garage: Calendar / availability management
- [ ] Wireframes -- Garage: Active dossiers management
- [ ] Wireframes -- Garage: Status update flow
- [ ] Wireframes -- Garage: Profile editing
- [ ] Wireframes -- Garage: Settings / notifications
- [ ] Marketplace logic flow diagram (attribution rules, state machine)
- [ ] User flow diagram -- complete driver journey (end-to-end)
- [ ] User flow diagram -- complete garage journey (end-to-end)
- [ ] Wireframe review session with client (formal)
- [ ] Client sign-off on wireframes (gate to Phase 2)

### 5.3 Phase 2 -- UI (Weeks 5-7)

- [ ] Design system -- Color palette (primary, secondary, semantic, neutral)
- [ ] Design system -- Typography scale (headings, body, captions, labels)
- [ ] Design system -- Spacing & grid system (8pt grid)
- [ ] Design system -- Icon set (sinistre, car, garage, calendar, status, nav)
- [ ] Design system -- Button variants (primary, secondary, ghost, disabled, loading)
- [ ] Design system -- Input fields (text, select, date picker, photo upload)
- [ ] Design system -- Cards (garage card, sinistre card, status card)
- [ ] Design system -- Navigation (tab bar, headers, back navigation)
- [ ] Design system -- Status indicators (badges, progress bars, step indicators)
- [ ] Design system -- Notification / toast components
- [ ] Design system -- Modal / bottom sheet components
- [ ] Design system -- Empty state templates
- [ ] Design system -- Error state templates
- [ ] Design system -- Loading state templates (skeleton screens)
- [ ] HiFi screens -- Driver app (20+ screens, normal states)
- [ ] HiFi screens -- Driver app empty states (all key screens)
- [ ] HiFi screens -- Driver app error states (all key screens)
- [ ] HiFi screens -- Driver app loading states (all key screens)
- [ ] HiFi screens -- Garage portal (15+ screens, normal states)
- [ ] HiFi screens -- Garage portal empty states (all key screens)
- [ ] HiFi screens -- Garage portal error states (all key screens)
- [ ] HiFi screens -- Garage portal loading states (all key screens)
- [ ] Prototype -- Driver complete flow (clickable, linked)
- [ ] Prototype -- Garage complete flow (clickable, linked)
- [ ] Prototype -- Transitions and micro-interactions
- [ ] Prototype tested on real mobile device (iOS)
- [ ] Prototype tested on real mobile device (Android considerations noted)
- [ ] Accessibility check (contrast ratios, touch targets, font sizes)
- [ ] French copy finalized -- all labels, CTAs, error messages, empty states
- [ ] French copy proofread -- zero typos (DoD requirement)
- [ ] Internal design review (team QA before client presentation)
- [ ] Client review session -- HiFi + prototype walkthrough
- [ ] Client sign-off on HiFi designs (gate to Phase 3)

### 5.4 Phase 3 -- Landing Page (Week 7-8)

- [ ] Landing page -- Hero section (value proposition, CTA, prototype visual)
- [ ] Landing page -- Problem section (3 pain points illustrated)
- [ ] Landing page -- Solution section (Carlib value proposition)
- [ ] Landing page -- "How it works" section (3-step illustration)
- [ ] Landing page -- Garage benefits section
- [ ] Landing page -- Garage sign-up form (functional)
- [ ] Landing page -- Footer (legal, contact)
- [ ] Landing page -- Responsive design (mobile + desktop)
- [ ] Landing page -- SEO basics (meta tags, headings, alt text)
- [ ] Landing page -- CTA above the fold verified
- [ ] Landing page -- Client review and sign-off

### 5.5 Phase 4 -- Finalization (Week 8)

- [ ] Client iteration round #1 incorporated
- [ ] Client iteration round #2 incorporated (if needed)
- [ ] Figma files organized and named per convention
- [ ] Figma pages structured (Cover, Design System, Driver App, Garage Portal, Landing, Prototype)
- [ ] All components properly named and organized in Figma library
- [ ] Dev brief document drafted
- [ ] Development budget estimation completed
- [ ] Final prototype validated on mobile device by client
- [ ] All DoD criteria verified (see Section 8 of PRD)
- [ ] Final delivery package assembled
- [ ] Project retrospective conducted
- [ ] Handoff meeting with client (and future dev team if known)

**Total deliverable count: ~95+ discrete items across all phases.**

---

## 6. Risk Register

| # | Risk | Likelihood | Impact | Phase Affected | Mitigation | Owner |
|---|---|---|---|---|---|---|
| R01 | **Brand identity not defined before UI starts** (Open Q#1) | High | Critical | Phase 2 blocked entirely | Resolve in Phase 0 workshop. If client has no brand, allocate 2-3 days for brand exploration as part of Phase 2. Communicate timeline impact immediately. | PM |
| R02 | **Client availability / slow feedback cycles** | High | High | All phases | Establish a 48-hour SLA for feedback at kickoff. Schedule fixed weekly review slots. Escalate to client stakeholder if SLA is breached twice. | PM |
| R03 | **Attribution logic undecided** (Open Q#2) stalls marketplace UX | High | High | Phase 1 | Design both variants at wireframe level (low cost). Force decision before HiFi. | UX + PM |
| R04 | **Garage portal scope unclear** (Open Q#3: mobile vs web/tablet) | High | High | Phase 1-2 | If web/tablet is added, screen count could increase 30-50%. Advocate for mobile-only MVP to protect timeline. | PM |
| R05 | **Scope creep on "Should-have" items** | Medium | High | Phase 1-2 | Strict MoSCoW enforcement. Any new request goes to backlog unless it replaces an existing Must-have. PM gates all additions. | PM |
| R06 | **Emergent mockups not shared by client** (Open Q#7) | Medium | Medium | Phase 0 | Cannot properly calibrate workshops without reference material. Follow up daily until received. Set a hard deadline: if not received by Day 3 of Phase 0, proceed without them. | PM |
| R07 | **Single UX designer bottleneck** | Medium | High | Phase 1 | UX must maintain a sustainable pace. PM should shield UX from ad-hoc requests. If UX falls behind by >2 days, consider bringing in a second UX resource for 1 week. | PM |
| R08 | **Screen count underestimated** (35+ screens x 4 states = 140+ variants) | Medium | Medium | Phase 2 | Prioritize which screens need full state coverage vs. which can use templated states from the design system. Not every screen needs a unique empty state. | UX + UI |
| R09 | **Prototype complexity underestimated** | Medium | Medium | Phase 2 | Begin prototype linking as soon as first HiFi screens are complete -- do not batch at end. Incremental assembly reduces risk. | UI |
| R10 | **French copy quality issues** | Medium | Low-Medium | Phase 2-3 | DoD requires zero typos. Budget 1-2 days for professional proofreading. Use a native French speaker for review. | PM |
| R11 | **Client pivot on core features mid-project** | Low | Critical | Any phase | Change request process defined at kickoff. Any pivot resets the phase timeline. Document in writing. | PM |
| R12 | **Insurance scope ambiguity creeps into MVP** (Open Q#4) | Medium | Medium | Phase 1 | PRD clearly states insurance is out of MVP scope. Hold that line. If client pushes, document impact to timeline (+2-3 weeks). | PM |
| R13 | **Revenue model impacts screens** (Open Q#6) | Medium | Medium | Phase 2 | If pricing/billing screens are needed, that is 3-5 additional screens not currently scoped. Force decision in Phase 0. | PM |
| R14 | **No client-side PM confirmed** | High | High | All phases | "Secondary PM: A completer." This is a red flag. Without a single client decision-maker, every approval becomes a committee decision. Escalate at kickoff. | PM |
| R15 | **Landing page form "functional" requirement** | Low | Medium | Phase 3 | "Functional" form implies backend/integration work. Clarify: is this a design deliverable or a coded page? If coded, it is out of scope for a design phase. | PM |

### Risk Heat Map Summary

- **Critical risks (address before kickoff):** R01, R02, R14
- **High risks (address in Phase 0):** R03, R04, R07
- **Medium risks (monitor weekly):** R05, R06, R08, R09, R12, R13
- **Low risks (standard mitigations):** R10, R11, R15

---

## 7. Sprint Planning Suggestion

Given the agency context (not a product team doing continuous delivery), I recommend **1-week sprints** for velocity tracking and client alignment, organized within each phase.

### Phase 0 -- Kickstart (2 weeks)

#### Sprint 0.1 (Week 1)
| Task | Owner | Days | Notes |
|---|---|---|---|
| Kickoff meeting + align on process | PM | 0.5 | Establish feedback SLA, meeting cadence |
| Receive & inventory Emergent mockups | PM | 0.5 | Blocker if not received |
| Workshop #1: Vision, MVP scope, MoSCoW review | PM + UX | 1 | Client required |
| Resolve Open Q#1 (brand identity direction) | PM | 0.5 | Needs client input |
| Resolve Open Q#2 (attribution logic) | PM + UX | 0.5 | Decision or design-both strategy |
| Resolve Open Q#3 (garage platform scope) | PM | 0.5 | Push for mobile-only MVP |
| Begin persona refinement | UX | 1.5 | Based on workshop outputs |

**Sprint 0.1 Goal:** All blocking open questions have a resolution path. Emergent mockups received.

#### Sprint 0.2 (Week 2)
| Task | Owner | Days | Notes |
|---|---|---|---|
| Workshop #2: Persona validation | PM + UX | 1 | Client required |
| Workshop #3: Journey mapping (driver + garage) | PM + UX | 1 | Client required |
| Finalize personas documentation | UX | 1 | |
| Define parcours cibles (target user flows) | UX | 1.5 | |
| Structure MVP backlog | PM | 1 | Should-have item, do if time allows |
| Phase 0 sign-off document | PM | 0.5 | Client approval gate |
| **UI Designer (parallel):** Moodboard exploration | UI | 3 | Begin visual direction work |
| **UI Designer (parallel):** Design system skeleton | UI | 2 | Color, type, grid exploration |

**Sprint 0.2 Goal:** Personas and journeys validated. Client sign-off to proceed to Phase 1. UI designer has a head start on visual direction.

---

### Phase 1 -- UX (2-3 weeks)

#### Sprint 1.1 (Week 3)
| Task | Owner | Days | Notes |
|---|---|---|---|
| Information architecture (driver + garage) | UX | 1.5 | Screen inventory, navigation model |
| Wireframes: Driver declaration flow (4 steps + summary) | UX | 3 | Core flow, highest priority |
| Wireframes: Driver home / dashboard | UX | 0.5 | |
| **UI (parallel):** Finalize moodboard, present to client | UI | 1 | Async client review |
| **UI (parallel):** Design system foundations (tokens) | UI | 2 | Colors, type, spacing, grid |
| **UI (parallel):** Core component design (buttons, inputs) | UI | 2 | |

**Sprint 1.1 Goal:** Driver declaration flow wireframed. Design system foundations in progress.

#### Sprint 1.2 (Week 4)
| Task | Owner | Days | Notes |
|---|---|---|---|
| Wireframes: Driver garage selection (list, map, detail) | UX | 2 | |
| Wireframes: Driver booking + confirmation | UX | 1.5 | |
| Wireframes: Driver status tracking + notifications | UX | 1.5 | |
| Marketplace logic flow diagram | UX + PM | 1 | State machine for dossier lifecycle |
| **UI (parallel):** Component library expansion | UI | 3 | Cards, nav, modals, status indicators |
| **UI (parallel):** Empty/error/loading state templates | UI | 2 | Reusable across all screens |

**Sprint 1.2 Goal:** All driver wireframes complete. Design system component library 70% done.

#### Sprint 1.3 (Week 5)
| Task | Owner | Days | Notes |
|---|---|---|---|
| Wireframes: Garage onboarding + profile | UX | 1.5 | |
| Wireframes: Garage dashboard + sinistres list | UX | 2 | |
| Wireframes: Garage accept/decline + dossier mgmt | UX | 1.5 | |
| Wireframes: Garage calendar + status updates | UX | 1.5 | |
| End-to-end flow diagrams (driver + garage) | UX | 0.5 | |
| **Client wireframe review session** | PM + UX | 1 | GATE: Must approve before Phase 2 HiFi |
| **UI (parallel):** Begin HiFi on approved driver screens | UI | 2 | Start with declaration flow |

**Sprint 1.3 Goal:** All wireframes complete and reviewed. Client sign-off. UI begins HiFi immediately on approved screens.

---

### Phase 2 -- UI (2-3 weeks)

#### Sprint 2.1 (Week 6)
| Task | Owner | Days | Notes |
|---|---|---|---|
| HiFi: Driver declaration flow (5+ screens) | UI | 3 | All states |
| HiFi: Driver home + dashboard | UI | 1 | |
| HiFi: Driver garage selection screens | UI | 2 | List, map, detail card |
| UX: Support UI with flow clarifications | UX | 1 | On-call |
| UX: French copy -- driver screens | UX/PM | 2 | Labels, CTAs, error messages |
| Begin prototype linking (declaration flow) | UI | 1 | Incremental assembly |

**Sprint 2.1 Goal:** Driver app HiFi 60% complete. Prototype assembly begun.

#### Sprint 2.2 (Week 7)
| Task | Owner | Days | Notes |
|---|---|---|---|
| HiFi: Driver booking + confirmation | UI | 1.5 | |
| HiFi: Driver status tracking + notifications | UI | 1.5 | |
| HiFi: Garage portal -- all screens (15+ screens) | UI | 4 | Leverages design system heavily |
| HiFi: Edge case states (empty, error, loading) | UI | 2 | Use templates from design system |
| UX: French copy -- garage screens | UX/PM | 1.5 | |
| Prototype: Link garage flow | UI | 1 | |
| Accessibility check | UX | 1 | Contrast, touch targets, font sizes |

**Sprint 2.2 Goal:** All HiFi screens complete. Prototype 80% linked.

#### Sprint 2.3 (Week 8 - first half)
| Task | Owner | Days | Notes |
|---|---|---|---|
| Prototype: Final linking + transitions | UI | 1.5 | |
| Prototype: Test on real devices (iOS + Android ref) | UI + UX | 0.5 | |
| French copy proofreading | PM (external) | 1 | Professional proofreader |
| Internal design review / QA pass | All | 0.5 | Full checklist walkthrough |
| Client review session -- HiFi + prototype | PM + UI + UX | 1 | Major milestone |

**Sprint 2.3 Goal:** Complete HiFi and prototype delivered to client. Feedback collected.

---

### Phase 3 -- Landing Page (overlaps Week 8)

#### Sprint 3.1 (Week 8 - second half / Week 9 if needed)
| Task | Owner | Days | Notes |
|---|---|---|---|
| Landing page wireframe / layout | UX | 0.5 | Quick given design system exists |
| Landing page HiFi design (all sections) | UI | 2.5 | Hero, problem, solution, how it works, benefits, form, footer |
| Landing page responsive variants | UI | 1 | Mobile + desktop |
| Landing page copy (French) | PM | 1 | Value proposition, benefits, CTAs |
| Landing page client review | PM | 0.5 | |

**Sprint 3.1 Goal:** Landing page designed and approved.

---

### Phase 4 -- Finalization (final week)

#### Sprint 4.1 (Week 9)
| Task | Owner | Days | Notes |
|---|---|---|---|
| Client feedback incorporation (round 1) | UI + UX | 2 | |
| Client feedback incorporation (round 2 if needed) | UI + UX | 1 | |
| Figma file cleanup and organization | UI | 1 | Naming, pages, structure |
| Design system documentation | UI + UX | 0.5 | Component usage guidelines |
| Dev brief document | PM + UX | 1 | Feature specs, flow descriptions |
| Development budget estimation | PM | 1 | Based on screen count, complexity |
| Final mobile device test | UI | 0.5 | |
| DoD checklist verification | PM | 0.5 | All criteria met |
| Final delivery + handoff meeting | All | 0.5 | |
| Project retrospective | All | 0.5 | |

**Sprint 4.1 Goal:** All deliverables finalized, DoD met, project closed.

---

## 8. Dev Handoff Considerations

Phase 4 ends the design engagement. If development follows, the handoff package must be comprehensive enough for a dev team that was not present during design. Here is what to prepare.

### 8.1 Figma File Organization

```
Carlib Figma Project
|
|-- Cover Page (project info, version, status, contacts)
|-- Design System
|   |-- Colors (tokens with names + hex values)
|   |-- Typography (scale, weights, line heights)
|   |-- Spacing & Grid (8pt grid, margins, gutters)
|   |-- Icons (named, exportable, SVG-ready)
|   |-- Components (auto-layout, variants, states)
|
|-- Driver App
|   |-- Onboarding
|   |-- Home / Dashboard
|   |-- Declaration Flow
|   |-- Garage Selection
|   |-- Booking
|   |-- Status Tracking
|   |-- Profile / Settings
|   |-- Edge States (empty, error, loading)
|
|-- Garage Portal
|   |-- Onboarding / Profile
|   |-- Dashboard
|   |-- Sinistres Management
|   |-- Calendar / Availability
|   |-- Dossier Management
|   |-- Edge States
|
|-- Landing Page
|   |-- Desktop
|   |-- Mobile
|
|-- Prototype (linked flows)
|   |-- Driver Complete Flow
|   |-- Garage Complete Flow
|
|-- Archive (deprecated screens, exploration)
```

### 8.2 Dev Brief Document Contents

The dev brief should include:

1. **Product overview** -- What Carlib is, target users, value proposition
2. **Scope definition** -- What is MVP, what is V1, what is out of scope
3. **Screen inventory** -- Complete list of every screen with ID, name, and Figma link
4. **User flows** -- Step-by-step flow diagrams for driver and garage journeys
5. **State machine** -- Dossier lifecycle states (en attente / attribue / en cours / termine) and transition rules
6. **Marketplace logic** -- Attribution rules, visibility rules, notification triggers
7. **Data model hints** -- What data each screen displays and where it likely comes from (user input, API, system)
8. **Notification inventory** -- Every push notification with trigger, content template, and recipient
9. **Interaction specifications** -- Transitions, animations, gestures (swipe, pull-to-refresh, etc.)
10. **Responsive / platform notes** -- iOS vs Android considerations, any platform-specific behaviors
11. **Accessibility requirements** -- Minimum contrast ratios, touch target sizes, font minimums
12. **Asset export** -- Icons, illustrations, images exported in required formats (SVG, PNG @1x/@2x/@3x)
13. **Open items for dev** -- Questions that design could not resolve and that need technical input

### 8.3 Design Tokens for Engineering

Export or document the following tokens in a format engineers can consume (JSON, CSS variables, or design token file):

- Color tokens (primary-500, secondary-300, error, success, warning, neutral scale)
- Typography tokens (font-family, font-size scale, line-height, letter-spacing)
- Spacing tokens (4, 8, 12, 16, 24, 32, 48, 64)
- Border radius tokens
- Shadow/elevation tokens
- Breakpoints (if landing page is responsive)

### 8.4 Handoff Checklist

- [ ] All Figma frames use auto-layout (critical for dev interpretation)
- [ ] All components have clear naming (e.g., `Button/Primary/Default`, `Button/Primary/Disabled`)
- [ ] All colors reference design system tokens (no hardcoded hex values on individual frames)
- [ ] All text uses typography styles from the design system
- [ ] Spacing is consistent and uses the 8pt grid
- [ ] Icons are components, named, and exportable as SVG
- [ ] Prototype links are functional and tested
- [ ] Dev mode enabled in Figma (if using Figma Dev Mode)
- [ ] Screen IDs match between Figma, dev brief, and flow diagrams
- [ ] Redlines / annotations added for complex interactions not obvious from static screens
- [ ] Edge states (empty, error, loading) are clearly labeled and grouped near their parent screens
- [ ] Asset export completed (icons, illustrations at required resolutions)

---

## 9. Recommendations

### 9.1 Top 5 Process Priorities (Do These Before Kickoff)

1. **Resolve the brand identity question immediately.** Open Q#1 is the single biggest risk to the timeline. If the client has no logo, no color palette, and no brand direction, Phase 2 cannot start on time. Options: (a) client provides brand assets, (b) allocate 3-5 days in early Phase 2 for brand exploration and add it to scope, (c) use a temporary visual direction and refine later. Choose one at kickoff. Do not leave it ambiguous.

2. **Confirm the client-side decision-maker and approval SLA.** "Secondary PM: A completer" is a project management red flag. Every approval that takes longer than 48 hours compresses the timeline by the same amount. Establish: who approves, how fast, and what happens if the SLA is missed (the team proceeds with the current direction).

3. **Lock down garage portal scope.** If the garage portal needs to work on web/tablet in addition to mobile, this is a 30-50% increase in design effort. The PRD says 15+ garage screens -- that assumes one platform. Two platforms could mean 25+ screens. Advocate strongly for mobile-only MVP.

4. **Get the Emergent mockups before the kickoff meeting.** The team needs to review them, identify what is usable and what needs to be redesigned, and prepare workshop talking points. Receiving them during the kickoff is too late.

5. **Define the change request process.** Any new feature request or scope change after Phase 0 sign-off must go through a formal process: document the request, estimate the impact on timeline and effort, get written client approval for the trade-off (add this, remove that, or extend timeline).

### 9.2 Process Improvements

6. **Start UI work during Phase 1, not after.** The PRD shows UI starting in Phase 2 only. This wastes 3-5 weeks of UI designer capacity and creates a compressed crunch in Phase 2. Instead, have the UI designer work on design system foundations, moodboard, and component library during Phase 1 while UX does wireframes. By the time wireframes are approved, the design system is ready and HiFi production can begin immediately.

7. **Implement incremental prototype assembly.** Do not wait until all 35+ HiFi screens are done to build the prototype. Link screens as they are completed. This spreads the effort, catches navigation issues early, and avoids a rushed prototype at the end.

8. **Add formal sign-off gates between phases.** The PRD mentions client validation in the DoD but does not formalize approval gates. Add explicit sign-off checkpoints:
   - End of Phase 0: Scope & personas approved (written)
   - End of Phase 1: Wireframes approved (written)
   - End of Phase 2: HiFi & prototype approved (written)
   - End of Phase 3: Landing page approved (written)
   - End of Phase 4: Final delivery accepted (written)

9. **Create a shared decision log.** With 8 open questions and many design decisions to make, decisions must be recorded in a shared, timestamped log (Notion, Confluence, or even a Google Doc). Include: what was decided, when, by whom, and the rationale. This prevents re-litigation of past decisions and protects the team.

10. **Budget for two client feedback rounds, not unlimited iteration.** Phase 4 says "iterations client" without specifying how many. Define upfront: 2 rounds of revision included. Additional rounds are a scope extension. This protects the timeline from an endless feedback loop.

### 9.3 Planning Calendar Overview (8-Week View)

```
Week  1  |████████████████| Phase 0 - Kickstart
Week  2  |████████████████| Phase 0 - Kickstart + UI moodboard
Week  3  |████████████████| Phase 1 - UX wireframes (driver) + UI design system
Week  4  |████████████████| Phase 1 - UX wireframes (driver+garage) + UI components
Week  5  |████████████████| Phase 1 - UX wireframes (garage) + client review + UI begins HiFi
Week  6  |████████████████| Phase 2 - UI HiFi (driver) + prototype assembly
Week  7  |████████████████| Phase 2 - UI HiFi (garage) + prototype + QA
Week  8  |████████░░░░████| Phase 2 finish + Phase 3 Landing + Phase 4 Finalization
          ^                  ^
          Buffer zone        Delivery
```

**Critical milestones:**
- **Week 2 end:** Phase 0 sign-off. All open questions resolved.
- **Week 5 mid:** Client wireframe review and approval gate.
- **Week 7 end:** Client HiFi + prototype review.
- **Week 8 end:** Final delivery.

---

## Summary

The Carlib design phase is a well-scoped engagement with a clear vision. The 6-8 week timeline is achievable at the 8-week end, provided the five conditions above are met. The team of 3 is sufficient but has no margin for error -- any absence, stalled approval, or scope addition will push the timeline.

The three highest-priority actions before kickoff are:

1. Resolve brand identity (Open Q#1)
2. Confirm client decision-maker and approval SLA (Open Q#8 + Secondary PM)
3. Receive Emergent mockups (Open Q#7)

Everything else can be managed within the sprint structure proposed above.

---

*Analysis prepared by the Design Operations Lead agent. Based on PRD Carlib v0.1 (Draft, Mars 2026) by Digital Unicorn.*
