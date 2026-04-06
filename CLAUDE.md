# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product

Carlib is a mobile-first marketplace app for automobile accident claim (sinistre) declaration in France. Two-sided platform:
- **Drivers (conducteurs):** Declare accidents, find nearby garages, book drop-off slots, track repairs in real-time
- **Body shops (carrossiers):** Consult available claims, accept cases, manage planning/availability, update repair status
- **Landing page:** B2B sales tool for garage partner acquisition (desktop-first exception)

Current phase: **UX/UI Design** (Phase 0). No development yet. PRD v0.1 (March 2026) by Digital Unicorn.

## Tech Stack

- **Platform:** iOS only (iPhone, Portrait)
- **IDE:** Xcode
- **Framework:** SwiftUI (App lifecycle)
- **Language:** Swift
- **Dependencies:** None — zero external packages
- **Localization:** French only (all UI labels, content in assurance/carrosserie vocabulary)

## Project Structure

```
docs/
  PRD_Carlib_v0.1_4.pdf          # Source PRD (Digital Unicorn)
  analysis/                       # 8 specialist analysis files (4,686 lines)
    01_research_analysis.md       # Personas, journeys, JTBD, research gaps
    02_strategy_analysis.md       # Business context, MVP scope, marketplace dynamics
    03_interaction_analysis.md    # States, gestures, notifications, error handling
    04_ui_analysis.md             # Visual identity, color, typography, screen inventory
    05_design_system_analysis.md  # 88 components, tokens, status system architecture
    06_prd_review.md              # PRD quality review (rated 3.2/5)
    07_ops_delivery_analysis.md   # Roadmap feasibility, sprints, risk register
    08_design_copilot_analysis.md # Holistic IA, content strategy, design principles
.claude/
  agents/                         # 8 auto-activating design agents
  skills/                         # 123 skills (designer + inclusive design)
  commands/                       # 27 slash commands
  settings.json                   # Plugin configuration
.mcp.json                         # Puppeteer + Chrome DevTools MCP servers
```

## Key Design Context

### Unresolved Blockers (must resolve before wireframing)
1. **Attribution model** — Auto-assign (first garage accepts) vs. driver selects. Forks the entire UX.
2. **Brand identity** — No logo, colors, or typography defined. Blocks all UI/token work.
3. **Product identity** — PRD oscillates between "claim declaration tool" and "marketplace." Must clarify.

### Client Preferences
- **Yellow** as primary brand color direction (we can suggest alternatives alongside)
- Yellow requires careful accessibility work — poor contrast on white backgrounds

### Design Constraints
- **Post-accident stress context:** 48pt minimum touch targets, calm color palette, avoid red (echoes danger), stress-tolerant interaction patterns
- **Dark mode from day one:** Accidents happen at night
- **French language:** ~20% more horizontal space than English, diacritic support, French punctuation rules (espaces insecables before : ; ! ?)
- **Doctolib** identified as the closest UX paradigm French users already trust — strong analogous reference
- **Landing page is B2B/desktop-first** (exception to mobile-first rule) — it's a garage recruitment sales tool

### Scale
- 50 unique screens (10 shared, 22 driver, 17 garage, 1 landing)
- 80-100 Figma artboards with empty/error/loading states
- 88 UI components (78 Must-have)
- 3 interconnected status systems: Claim (9 states), Booking (7 states), Repair (5 states)

## Agents (8)

Auto-activate based on task context. Available in `.claude/agents/`:

| Agent | When to use |
|-------|------------|
| **designer-copilot** | Primary design partner — thinking, review, prototype, brainstorm, spec |
| **design-researcher** | Personas, interviews, journeys, empathy maps, usability testing |
| **ui-designer** | Colors, typography, grids, layout, responsive, visual hierarchy |
| **ux-strategist** | Strategy, competitive analysis, metrics, stakeholder alignment |
| **design-system-architect** | Components, tokens, theming, accessibility audits |
| **interaction-designer** | Micro-interactions, state machines, animations, gestures, error UX |
| **design-ops-lead** | Handoffs, sprint planning, critiques, QA checklists, workflows |
| **design-reviewer** | Heuristic evaluation, accessibility review, quality checks |

## MCP Servers

Configured in `.mcp.json`:
- **Puppeteer** — Navigate, click, screenshot, scrape pages
- **Chrome DevTools** — Inspect DOM, debug CSS, accessibility auditing

## Project Conventions

- All design outputs in French (assurance/carrosserie domain vocabulary)
- Accessibility: WCAG 2.1 AA minimum + RGAA 4.1 (French standard)
- Use design tokens over raw values — three-tier architecture (Global > Alias > Component)
- Design for keyboard, screen reader (VoiceOver/TalkBack), and reduced motion from the start
- Skills in `.claude/skills/` load automatically; commands available as slash commands from `.claude/commands/`
- Run `./setup.sh` on a new machine to install marketplace plugins (skills are bundled and work without it)
