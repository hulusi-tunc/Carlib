# Claude Project Starter Pack

A template repository with **123 skills**, **27 commands**, **8 agents**, and **2 MCP servers** pre-configured for Claude Code.

## What's Inside

```
.claude/
  settings.json        # All plugins enabled
  skills/              # 123 skills (bundled, works on any machine)
  commands/            # 27 slash commands
  agents/              # 8 designer agents (auto-activate)
.mcp.json              # Puppeteer + Chrome DevTools MCP servers
CLAUDE.md              # Project instructions for Claude
setup.sh               # One-time machine setup (installs plugins)
```

## Quick Start

### Option A: Use as GitHub Template
1. Click **"Use this template"** on GitHub
2. Clone your new repo
3. Start Claude Code in the project directory
4. Everything works automatically

### Option B: Clone directly
```bash
git clone https://github.com/hulusi-tunc/claude-project-starter.git my-new-project
cd my-new-project
rm -rf .git && git init  # Fresh git history
```

### Optional: Install Marketplace Plugins
```bash
./setup.sh
```
> Skills work without this step (they're bundled in `.claude/skills/`). The setup script adds marketplace plugin support for updates.

### Chrome DevTools MCP (one-time per machine)
```bash
npm install -g chrome-devtools-mcp
```

## Agents (Auto-Activate)

Just talk naturally -- Claude picks the right agent automatically.

| Agent | Role | Skills Loaded |
|-------|------|--------------|
| **designer-copilot** | Main design partner (5 modes: thinking, review, prototype, brainstorm, spec) | 22 |
| **design-researcher** | User research, personas, interviews, journeys | 10 |
| **ui-designer** | Colors, typography, grids, responsive, shadcn/ui | 11 |
| **ux-strategist** | Competitive analysis, principles, metrics, vision | 8 |
| **design-system-architect** | Components, tokens, theming, accessibility | 8 |
| **interaction-designer** | Micro-interactions, states, animations, gestures | 7 |
| **design-ops-lead** | Handoffs, sprints, critiques, workflows | 7 |
| **design-reviewer** | Heuristic evaluation, QA, accessibility review | 5 |

## Skills (123)

### Designer Skills (65)

| Plugin | Skills | Commands | Description |
|--------|--------|----------|-------------|
| design-research | 10 | 4 | Personas, empathy maps, journey maps, interviews |
| design-systems | 8 | 3 | Tokens, components, accessibility, theming |
| ux-strategy | 8 | 3 | Competitive analysis, principles, metrics |
| ui-design | 9 | 4 | Colors, typography, grids, responsive, dark mode |
| interaction-design | 7 | 3 | Animations, state machines, gestures, error handling |
| prototyping-testing | 8 | 4 | Wireframes, heuristics, A/B testing, user flows |
| design-ops | 7 | 3 | Handoffs, sprints, critiques, QA, workflows |
| designer-toolkit | 6 | 3 | Rationale, presentations, case studies, UX writing |
| frontend-design | 1 | — | Distinctive, production-grade UI code (Anthropic) |
| shadcn-ui | 1 | — | Radix UI + Tailwind + React Hook Form + Zod |

### Inclusive Design Skills (58)

| Plugin | Skills | Description |
|--------|--------|-------------|
| cognitive-accessibility | 11 | Cognitive load, plain language, wayfinding, memory, focus |
| inclusive-interaction | 10 | Keyboard nav, gestures, voice, touch targets, motion sensitivity |
| accessible-content | 10 | Alt text, headings, forms, links, tables, readable content |
| inclusive-personas | 9 | Disability personas, assistive tech scenarios, ability spectrum |
| adaptive-interfaces | 9 | Color independence, flexible typography, simplified views |
| accessibility-decisions | 9 | Compliance mapping, debt tracking, tradeoff analysis, handoff |

### How Skills Layer Together

Designer skills build the system. Inclusive skills extend it for accessibility:

| Design (build) | → | Inclusive (extend) |
|---------------|---|-------------------|
| gesture-patterns | → | gesture-alternatives |
| color-system | → | colour-independence |
| user-persona | → | disability-inclusive-personas |
| animation-principles | → | motion-sensitivity |
| component-spec | → | keyboard-navigation |
| typography-scale | → | flexible-typography |
| layout-grid | → | responsive-accessibility |
| ux-writing | → | plain-language-design |
| handoff-spec | → | accessibility handoff |
| feedback-patterns | → | multi-sensory feedback |

## MCP Servers

| Server | What it does |
|--------|-------------|
| **Puppeteer** | Navigate, click, type, screenshot, scrape any page |
| **Chrome DevTools** | Inspect DOM, debug CSS, console, network, accessibility |

Plus built-in: **WebSearch** and **WebFetch** (always available).

## How to Update This Template

Edit files locally and push:
```bash
cd claude-project-starter
# Make changes (add skills, update agents, etc.)
git add -A
git commit -m "what you changed"
git push
```

Next time you click "Use this template", it creates from the latest version.

## How to Update Projects Created From This Template

Projects created from the template are independent repos. They don't auto-update. To pull updates:

### First time (one-time setup)
```bash
cd my-existing-project
git remote add template https://github.com/hulusi-tunc/claude-project-starter.git
git fetch template
git merge template/main --allow-unrelated-histories
```

### After that
```bash
git fetch template
git merge template/main
```

### Quick reference

| Action | Command |
|--------|---------|
| **Update template** | Edit, commit, push from `claude-project-starter/` |
| **New project** | "Use this template" on GitHub (gets latest) |
| **Update old project** | `git fetch template && git merge template/main` |

## Credits
- Designer skills by [MC Dean](https://marieclairedean.substack.com/) via [Owl-Listener/designer-skills](https://github.com/Owl-Listener/designer-skills)
- Inclusive design skills by [MC Dean](https://marieclairedean.substack.com/) via [Owl-Listener/inclusive-design-skills](https://github.com/Owl-Listener/inclusive-design-skills)
- Frontend design skill by [Anthropic](https://github.com/anthropics/claude-plugins-official)
- shadcn-ui skill by [Giuseppe Trisciuoglio](https://github.com/giuseppe-trisciuoglio/developer-kit)
