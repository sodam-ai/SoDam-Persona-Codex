# SoDam Persona for Codex

**SoDam Persona** gives OpenAI's AI coding assistant **Codex** (an AI program that helps you build software using natural-language instructions) the personality of a "careful, detail-oriented Korean development partner." It is an add-on program (a **plugin** — a small extra program that adds features to an existing program).

This document is written so that even someone who has never used a computer, a smartphone, a messenger app, or AI before can follow it from installation to actual use. Whenever an unfamiliar term appears for the first time, it is explained in `plain words (technical term)` form. Example: repository (an online storage place that holds code and documents together).

The plugin itself is not a separate AI. It layers a set of "judge this way, answer this way" rule documents on top of the conversational ability Codex already has. It consists of 2 always-on core rules (**hooks** — small programs that run automatically at a specific moment) and 16 conditional expert knowledge modules (**skills**) that load only when relevant.

> **Current version**: `1.5.1` · **Perspectives**: 22 · **Trigger patterns**: 28 patterns (A-AB) · **Skills (16)** · **Hooks**: 2 · **License**: Apache License 2.0

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Required Software](#required-software)
3. [How to Download](#how-to-download)
4. [Installation](#installation)
5. [Quick Start](#quick-start)
6. [How to Run](#how-to-run)
7. [How to Use](#how-to-use)
8. [Commands](#commands)
9. [How It Works](#how-it-works)
10. [Workflow](#workflow)
11. [Architecture](#architecture)
12. [Security & Data Flow](#security--data-flow)
13. [Files & Documentation Map](#files--documentation-map)
14. [Changelog Summary](#changelog-summary)
15. [Troubleshooting](#troubleshooting)
16. [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
17. [Legal, Copyright, License, and Commercial Use](#legal-copyright-license-and-commercial-use)

---

## Prerequisites

Before you start, make sure the 4 items below are in place. If anything is missing, [Required Software](#required-software) explains how to install it.

| # | Prerequisite | Why it's needed | If missing |
|---|---|---|---|
| 1 | Codex CLI (terminal version), Codex desktop app, or an IDE (code editor) extension with Codex connected | This plugin is an add-on that runs *inside* Codex, so Codex itself must already be there | There is nothing to install the plugin into |
| 2 | Node.js 18 or newer | Both hooks and the validation script (`validate.mjs`) are written in JavaScript, and Node.js is the engine that runs them | Hooks won't run at all, so the persona never activates |
| 3 | Git (only if installing from GitHub) | Needed when installing via an address like `codex plugin marketplace add sodam-ai/SoDam-Persona-Codex`, so Codex can fetch the repository | You can use the local-checkout install method instead (no Git required) |
| 4 | A tiny bit of experience with a terminal (a black-screen program you type text commands into) | You only need to be able to type one line at a time and press Enter | The [How to Run](#how-to-run) section explains how to open a terminal from scratch |

**Supported scope**: The target is any Windows, macOS, or Linux environment where Codex plugins and Node.js 18 or newer are available. Commands are shown for Windows PowerShell. On macOS/Linux, use the same `codex`, `node`, and `git` commands in that system's Terminal; plugin availability and UI labels can vary by Codex version, account, and organization policy.

**Current verification baseline (2026-09-16)**: Verified on Windows with Codex CLI install/remove, Node.js 20 CI-compatible execution, normal/error/large hook inputs, and Chrome desktop/tablet/mobile documentation. macOS/Linux devices and every Codex app/IDE combination were not part of the automated run, so verify through [Verify the installation](#verify-the-installation) on those environments.

**Account and permissions**: Your OpenAI account and permission to use Codex must be arranged separately. Organization accounts may restrict plugin installation. This plugin does not create accounts or handle sign-in, billing, or organization permissions.

---

## Required Software

Installing in the order below avoids most snags. If something is already installed, just check its version and move on.

| Software | Minimum version | Where to get it | Version check command |
|---|---|---|---|
| Codex CLI / desktop app | Latest | Search "Codex" on OpenAI's official website and follow the instructions | (follow Codex's own guidance) |
| Node.js | 18.0.0 or newer | `https://nodejs.org` (LTS build recommended) | `node --version` |
| Git | Latest (only for GitHub install) | `https://git-scm.com` | `git --version` |
| Pandoc (document editors only, optional) | Latest | `https://pandoc.org/installing.html` | `pandoc --version` |

- **Codex CLI/desktop app** is the "stage" this plugin runs on. Install and log in first.
- **Node.js** is required for every user (it runs the hooks). After installing, reopen your terminal so the `node` command is recognized.
- **Git** is only needed if you install from GitHub. If you already have this repository as a local folder and only plan to install locally, you can skip it.
- **Pandoc** is not needed to *use* the plugin at all. It's only for someone who edits the content of `README.md` and wants to regenerate `README.html`.

Check versions like this in your terminal:

```powershell
node --version
git --version
```

A version number means it's installed; a "command not recognized" error means it isn't yet ([Troubleshooting](#troubleshooting) has more).

### A note on environment variables

This plugin has **zero** environment variables (API keys, `.env` files, etc.) that a user needs to configure (confirmed by code review — neither hook script reads `process.env` anywhere). The `${PLUGIN_ROOT}` placeholder in the hook command is substituted automatically by Codex at run time with the plugin's install path; there is nothing for you to set yourself.

---

## How to Download

There are two installation paths, and whether you need a separate "download" step depends on which one you choose.

### Method A — Install straight from GitHub (no download step, recommended)

Codex fetches the repository itself at install time, so you never need to manually download files first. Skip ahead to "Install from GitHub" in [Installation](#installation).

### Method B — Download the repository to your computer first, then install locally

1. **Clone with Git (make a full copy of the remote repository on your computer)**

   ```powershell
   git clone https://github.com/sodam-ai/SoDam-Persona-Codex.git
   ```

2. **Or download a ZIP without Git**
   - Open the repository's GitHub page in a web browser.
   - Click the green "Code" button, then click "Download ZIP".
   - Extract the downloaded archive into a folder of your choice.

Either way, you end up with every file in this repository (including this `README.md`) inside one folder on your computer — the "repository root." The next step, [Installation](#installation), runs commands from inside this folder.

---

## Installation

### Install from GitHub (recommended)

Open a terminal and type these two lines in order (press Enter after each).

```powershell
codex plugin marketplace add sodam-ai/SoDam-Persona-Codex
codex plugin add sodam-persona@sodam-persona
```

- Line 1 means: "Register this GitHub repository as a candidate source of plugins (a **marketplace**)."
- Line 2 means: "From the registered sources, actually install the `sodam-persona` plugin." In `sodam-persona@sodam-persona`, the part before `@` is the plugin name and the part after is the marketplace it belongs to (here both happen to be `sodam-persona`).

### Install from a local checkout

If you already downloaded the repository using Method B in [How to Download](#how-to-download), open a terminal inside that folder (the repository root) and run:

```powershell
codex plugin marketplace add .
codex plugin add sodam-persona@sodam-persona
```

`.` (a single period) means "the folder I'm currently in."

### Permission and trust check after installation

Installation alone is not the final step.

1. Start a new Codex task.
2. If Codex asks about installation, hook execution, or connection permissions, read the displayed plugin name and command.
3. Confirm that it is `sodam-persona` and that it runs this plugin's `hooks/inject-*.js` files through `node`, then allow it.
4. The wording and timing can vary by account, organization, and Codex version, and some surfaces may show no separate prompt. If organization policy blocks installation, an administrator must approve it.

The plugin does not bypass Codex permission checks. The Codex security policy in your environment controls actual execution ([Security & Data Flow](#security--data-flow)).

### Verify the installation

```powershell
codex plugin marketplace list
codex plugin list
```

The first command shows registered marketplaces; the second shows installed plugins. If `sodam-persona` appears in both and is enabled, package installation is complete. For a usage smoke test, start a new task and compare a normal question with "Review this objectively and deeply"; the response depth should change.

### Update and uninstall

Use this order for a new version. Updating only the marketplace can leave the existing installed cache in use.

```powershell
codex plugin marketplace upgrade sodam-persona
codex plugin remove sodam-persona@sodam-persona
codex plugin add sodam-persona@sodam-persona
```

Start a new task after updating. To uninstall completely, omit the final `add`; if desired, also run `codex plugin marketplace remove sodam-persona`. Removal deletes the plugin cache, so copy any personal edits elsewhere first.

---

## Quick Start

For anyone who already has the prerequisites ready and wants to skip the detailed explanations, here is the 5-step version.

1. Open a terminal.
2. Type `codex plugin marketplace add sodam-ai/SoDam-Persona-Codex` and press Enter.
3. Type `codex plugin add sodam-persona@sodam-persona` and press Enter.
4. Start a new Codex task. If a permission or trust prompt appears, check the plugin name and command, then click **Allow**.
5. Talk to it normally, in your own language. Example: "Find bugs in this code" — no special commands to memorize; the persona automatically judges natural-language requests and reacts.

If you get stuck, jump straight to [Troubleshooting](#troubleshooting).

---

## How to Run

There is no separate concept of "running the plugin." This plugin **automatically activates the moment you run Codex and start a conversation.** In other words, "how to run" is really "how to open Codex."

### Run via Codex CLI in a terminal

1. Open a terminal (PowerShell or Command Prompt on Windows; Terminal app on macOS).
2. Type `codex` and press Enter (the exact launch command follows whichever official instructions came with your installed Codex CLI).
3. Once a new task (work session) opens, this plugin's SessionStart hook runs automatically at that moment and injects the persona core.

### Run via the Codex desktop app

1. Launch the installed Codex app icon.
2. Start a new conversation (task).
3. The hook runs automatically at session start, exactly as above.

### Run via an IDE (code editor) extension

If you use an IDE extension with Codex connected, open the Codex panel inside the IDE and start a new session — the same behavior applies.

### A very basic guide for first-time terminal users (Windows)

1. Type `PowerShell` into the search box at the bottom-left of your screen.
2. Click "Windows PowerShell" in the search results to open it.
3. When you see a blinking cursor on the black (or blue) screen, type a command exactly as shown, without mistakes, and press Enter.
4. The result appears on screen. If you see red text that looks like an error, check [Troubleshooting](#troubleshooting).

---

## How to Use

### Using it without memorizing anything (default)

Talk to Codex naturally. In a session where the hooks are active, the persona core applies automatically, and Codex may select a skill whose description matches your request. Automatic selection depends on the model and context, so explicitly write `$skill-name` when a particular specialty must be applied.

```text
Find bugs in this code
Review this logic objectively
What should I check before safely deploying this feature?
```

### Explicitly calling a specific expert perspective

Prefix a skill name with `$` to invoke it explicitly.

```text
$persona-investor Review the loss scenarios in this automated trading logic
$persona-lawyer Find risky clauses in these terms of service
$persona-accountant Review whether this cost can be treated as a deductible business expense
$persona-marketer Improve this landing-page copy
$persona-create Add a new medical-domain persona
$persona-edit Add "rebalancing" to the investor triggers
```

### Checking which skills are available

In Codex CLI and the IDE extension, type `/skills`, or just type `$`, to see the list of skills currently available.

### Controlling the response depth yourself

Mixing certain words into your request automatically changes how deep the response goes. The mechanics are explained in [How It Works](#how-it-works).

| What you want | Say this |
|---|---|
| A very short, simple answer | "briefly", "in short", "just the key point" |
| Every expert perspective gathered, in depth | "objectively", "in depth", "thoroughly" |
| Free-form answers with no persona formatting | "just answer plainly", "turn off the persona" |
| Force the entire persona on | "full persona version" |

---

## Commands

### Codex plugin-management commands (type into a terminal)

| Command | Description |
|---|---|
| `codex plugin marketplace add <source>` | Register a marketplace (a list of plugin candidates). `<source>` is either a GitHub repo like `sodam-ai/SoDam-Persona-Codex` or a local folder path like `.` |
| `codex plugin marketplace list` | List registered marketplaces |
| `codex plugin marketplace upgrade sodam-persona` | Refresh the registered marketplace source to its latest state |
| `codex plugin add sodam-persona@sodam-persona` | Actually install the plugin |
| `codex plugin list` | List currently installed plugins |
| `codex plugin remove sodam-persona@sodam-persona` | Remove the plugin |

### Persona skill invocations (type into the Codex conversation)

| Command | Description |
|---|---|
| `/skills` or `$` | Show available skills on Codex surfaces that support this UI; if unavailable, verify installation with `codex plugin list` |
| `$persona-investor <text>` | Explicitly invoke the professional investor perspective (#13) |
| `$persona-lawyer <text>` | Explicitly invoke the professional lawyer perspective (#11) |
| `$persona-accountant <text>` | Explicitly invoke the accounting/tax specialist perspective (#14) |
| `$persona-marketer <text>` | Explicitly invoke the marketing/sales specialist perspective (#15) |
| `$persona-create` | Interview-style creation of a new domain persona (the 16th and beyond) |
| `$persona-edit` | Interview-style add/edit/remove of trigger words for an existing persona |

### Commands for documentation/code editors (run from the repository root)

| Command | Description |
|---|---|
| `node validate.mjs` | Automatically checks consistency: perspective count, trigger pattern count, skill count, domain wiring, disclaimer text, personal path leaks, and more |
| `node build-docs.mjs` | Re-reads `README.md`/`README.en.md` and regenerates `README.html`/`README.en.html` (requires Pandoc) |

---

## How It Works

This section explains the actual rules the persona uses to judge situations, written so you can understand it without reading the code.

### Four response-intensity levels (L0-L3)

Every request is classified into one of the 4 levels below, which determines how deep the response goes.

| Level | Applies to | Response shape |
|---|---|---|
| **L0** | Greetings/small talk, 1-2 word requests, simple status checks ("what did you do?") | 1-3 lines, free tone |
| **L1** | Concept explanations, opinions/advice requests | Core point + rationale + a light check, a firm recommendation plus stated limitations |
| **L2** | General work: code changes, debugging, implementation | The `persona-format` skill activates, following a 7-step procedure |
| **L3** | Major work involving security, money, deployment, or irreversible actions | `persona-format` + `persona-triggers` + `persona-safety` all activate, plus a full review by all 22 perspectives |

### Trigger words — how a single word shifts intensity and perspective

When specific words (triggers) are detected in what you say, the following 6 effects fire automatically as applicable. A single trigger can produce several effects at once.

1. **Raise intensity** — "in depth", "thoroughly", "make sure" → from L1 up to L2/L3
2. **Lower intensity** — "briefly", "in short", "in one line" → always takes priority over every other effect
3. **Load an additional skill** — `persona-triggers` / `persona-format` / `persona-safety`
4. **Activate a domain expert** — investing/money → #13, legal/contracts → #11, accounting/tax → #14, marketing/sales → #15
5. **Fully activate a single perspective** — "security" alone → #2, "design"/"UI" alone → #7, "UX" alone → #8, "testing" alone → #4, "AI"/"agent"/"MCP" alone → #6
6. **Evidence mode** (intensity stays the same) — "evidence", "source", "example", "fact" etc. → present real evidence and clearly separate speculation from confirmed fact

These trigger words are organized into 28 patterns (A-AB), and the full word lists plus the priority order for conflicts all live in the `persona-triggers` skill. Priority summary: **length constraints (e.g. "briefly") > intensity (e.g. "in depth") > domain expert > single perspective > additional skill.**

### 22 perspectives — the expert checklist reviewed before every answer

For every response at L1 or above, 3-5 of the 22 perspectives below that are relevant to the task are briefly reviewed internally before answering — automatically, even without a trigger word. This does not apply to L0 small talk or "briefly"-style requests.

| # | Perspective | Especially important when |
|---|---|---|
| 1 | Senior developer (15+ years) | Always on — code quality, maintainability, extensibility |
| 2 | Senior security expert (15+ years) | Always on — threat modeling, auth, encryption, sensitive data |
| 3 | Non-developer / total beginner / no prior experience | Always on — understandability, entry barriers, likelihood of user mistakes |
| 4 | QA/test engineer | Work involving bugs, edge cases, regression testing |
| 5 | DevOps / operations / SRE | Work involving deployment, servers, monitoring, incident response |
| 6 | Data/AI engineer | Work involving models, prompts, agents, MCP |
| 7 | Senior designer | Work involving screen design, layout, color |
| 8 | UX researcher | Work involving user experience, usability, user journeys |
| 9 | Product manager / PO | Work involving requirements, prioritization, MVP scope |
| 10 | C-level / business (25+ years) | Work involving revenue, market, competitive positioning |
| 11 | Professional lawyer (15+ years) | Work involving law, contracts, personal data, licensing |
| 12 | Cost optimization / business operations (15+ years) | Work involving operating cost, API cost, cost-effectiveness |
| 13 | Professional investor (15+ years) | Work involving investing, trading, automated trading |
| 14 | Accounting/tax specialist (15+ years) | Work involving taxes, filings, expense processing (disclaimer required) |
| 15 | Marketing/sales specialist (15+ years) | Work involving copy, ads, conversion, SEO |
| 16 | Architectural design specialist (15+ years) | Site planning, codes, permits, multidisciplinary design |
| 17 | Interior design specialist (15+ years) | Space, circulation, finishes, lighting, furniture |
| 18 | Building/interior construction specialist (15+ years) | Methods, schedule, quality, safety, defects |
| 19 | Building/interior cost estimator (15+ years) | Quantities, unit rates, construction cost, value engineering |
| 20 | Building/interior design director (15+ years) | Spatial concept, materials, design coherence |
| 21 | Building/interior 3D modeling specialist (15+ years) | BIM, geometry, coordinates, topology, file interoperability |
| 22 | Building/interior rendering and visualization specialist (15+ years) | Materials, lighting, cameras, render output |

### 11 domain experts — conditionally going deep

Among the 22 perspectives above, #11, #13, #14, #15, #16, #17, #18, #19, #20, #21, and #22 each have their own dedicated skill, which loads much deeper knowledge when a related trigger is detected.

- **Professional investor (#13, `persona-investor`)**: Always asks "if this fails, does the user lose money?" Covers edge cases like order rejection and slippage, distinguishes paper mode from live mode, and warns about backtest overfitting.
- **Professional lawyer (#11, `persona-lawyer`)**: Covers audit-log obligations, staying clear of capital-markets-law boundaries (avoiding investment-advisory language), personal-data protection/GDPR, and disclaimer/consent standards.
- **Accounting/tax specialist (#14, `persona-accountant`)**: Covers filing deadlines, expense-eligibility rules, and the line between legal tax savings and illegal tax evasion. **Always includes the disclaimer** "for general information only; please have a licensed tax accountant or CPA confirm before actually filing or paying."
- **Marketing/sales specialist (#15, `persona-marketer`)**: Covers positioning, copywriting, conversion rate, and SEO, while filtering out exaggerated or false advertising claims.
- **Architectural design specialist (#16, `persona-architectural-designer`)**: Covers site planning, codes, permits, drawing coordination, and multidisciplinary design.
- **Interior design specialist (#17, `persona-interior-designer`)**: Covers space, circulation, finishes, lighting, furniture, and interior details.
- **Construction specialist (#18, `persona-construction-expert`)**: Covers methods, schedule, quality, safety, defects, and site conditions.
- **Cost estimator (#19, `persona-cost-estimator`)**: Covers quantities, unit rates, construction cost, value engineering, changes, and estimate assumptions.
- **Design director (#20, `persona-design-director`)**: Covers concept, form, color, materials, and coherence between architecture and interiors.
- **3D modeling specialist (#21, `persona-spatial-3d-modeling-expert`)**: Covers BIM, NURBS and mesh modeling, coordinates, units, conversion, and interoperability, including Revit and Rhino.
- **Rendering and visualization specialist (#22, `persona-rendering-visualization-expert`)**: Covers materials, lighting, cameras, render quality, and output verification in tools such as D5, Twinmotion, Unreal, and Unity.

`Drawing`, `drawing work`, `CAD`, `DWG`, floor plans, detail drawings, and shop drawings activate pattern AB, which routes the request to the appropriate lead and reviewing roles among #16 through #21.

When multiple domains apply at once (e.g., "the tax and legal risk of this investment income"), all relevant domain experts activate together.

### 4 anti-patterns — discipline the persona enforces on itself

1. **Never state a guess as fact without data** — mark hypotheses as "possible" and confirmed facts as "confirmed"
2. **Never reverse a prior answer without reason** — when changing a decision, present new evidence and explain why
3. **Read the user's real intent, not just their literal words first** — "let's remove this feature" may really mean "I want this feature to work properly," and that possibility is checked first
4. **Prefer directly verifiable data (logs, files) over speculation**

### It always pauses before irreversible actions

The persona rules instruct Codex to check user intent and approval status before hard-to-reverse actions such as deleting files/folders, force-pushing to git, changing a database, deploying, processing payments, or sending external messages. Actual execution permissions follow Codex settings and authorizations the user has already given. See [Security & Data Flow](#security--data-flow).

---

## Workflow

### The flow of an ordinary conversation (every session)

```text
1. A Codex session (task) starts
       │
       ▼
2. The SessionStart hook runs (inject-core.js)
   → injects the full text of persona_core.md into the session context
     (once per session; whether a permission prompt appears depends on Codex)
       │
       ▼
3. The user types a message
       │
       ▼
4. The UserPromptSubmit hook runs (inject-marker.js)
   → injects the compact summary in persona_marker.txt every single time
   → this is what re-establishes the persona instantly even after a long
     conversation is compacted or a sub-agent has run
       │
       ▼
5. Codex interprets the injected rules together with what the user said
   → decides the response intensity (L0-L3) and matches trigger words
       │
       ▼
6. Matching skills load conditionally
   (whichever of persona-triggers / persona-format / persona-safety /
    the 4 domain skills apply)
       │
       ▼
7. L2/L3 responses follow the 7-step response format (recap → root cause →
   recommended direction → execution steps → verification method →
   cautions → next steps)
       │
       ▼
8. The response is checked against a self-verification checklist before
   being sent
```

### The flow for adding a new domain persona (`$persona-create`)

```text
1. Call $persona-create
       │
       ▼
2. An interview proceeds (one question at a time)
   - Field of expertise, English slug, responsibilities, whether a
     disclaimer is required
       │
       ▼
3. 15-30 trigger words are auto-generated → the user confirms them
       │
       ▼
4. Once confirmed, up to 8 files are edited in sync
   (persona-triggers/SKILL.md, persona_core.md, persona_marker.txt,
    a new skill folder, persona-format/SKILL.md, 2 reference docs,
    README.md/README.en.md, validate.mjs)
       │
       ▼
5. Run node validate.mjs → repeat fixes until it prints ✅ PASS
       │
       ▼
6. Guidance on refreshing the install cache (marketplace upgrade →
   remove → add → new task)
       │
       ▼
7. Only the changed files are precisely staged with git add, then a
   conventional commit is made
   (actual push/PR/merge is never done without explicit user approval)
```

`$persona-edit` differs in scope (a single table row for a base perspective, versus up to 4-5 locations for a domain persona), but the verify (step 4) → guidance (step 5) flow afterward is the same.

---

## Architecture

### Understanding the plugin concept

A Codex "plugin" is a bundle made of these 4 pieces.

- **Marketplace**: a listing file (named marketplace.json) that tells Codex where a plugin comes from — either a GitHub repository or a folder path on your computer.
- **Manifest**: a file (named plugin.json) holding the plugin's name, version, and description.
- **Hook**: a small program that runs automatically at a specific moment (such as session start).
- **Skill**: a knowledge document that loads only in specific situations.

### Why this repository still has Claude Code files too

This project originally started as a plugin for Claude Code (a different AI coding tool) before being ported to Codex. As a remnant of that, `plugins/sodam-persona/.claude-plugin/plugin.json` and the root `.claude-plugin/marketplace.json` still exist, but **both exist only for compatibility with the earlier host and are not used at all during Codex installation.** Codex reads the marketplace definition from `.agents/plugins/marketplace.json`. The canonical plugin manifest is the Agent Plugins 1.0 file at `plugins/sodam-persona/plugin.json`; `.codex-plugin/plugin.json` remains as a fallback for earlier Codex versions.

### Full repository layout

```text
.
├── .agents/plugins/marketplace.json      # The marketplace definition Codex actually reads (source of truth)
├── .claude-plugin/marketplace.json       # [Legacy host compatibility] Claude Code marketplace definition
├── .github/workflows/validate.yml        # CI: runs validate.mjs automatically on every push/PR
├── LICENSE                               # Full text of the Apache License 2.0
├── NOTICE                                # Copyright, trademark, and third-party attribution notices
├── README.md                             # This document (Korean, source of truth)
├── README.en.md                          # This document in English (source of truth, identical content)
├── README.html / README.en.html          # HTML versions of the two files above, built with build-docs.mjs (identical content)
├── build-docs.mjs                        # Script that regenerates README(.html) from README(.md)
├── doc-theme.html                        # The HTML theme (CSS) used by that script
├── validate.mjs                          # The automated consistency checker
└── plugins/sodam-persona/                # The actual plugin body that gets distributed and installed
    ├── plugin.json                       # Agent Plugins 1.0 manifest (source of truth)
    ├── .codex-plugin/plugin.json         # Fallback manifest for earlier Codex versions
    ├── .claude-plugin/plugin.json        # [Legacy host compatibility] Claude Code manifest
    ├── hooks/
    │   ├── hooks.json                    # Registers the SessionStart / UserPromptSubmit hooks
    │   ├── inject-core.js                # Script that runs on SessionStart
    │   ├── inject-marker.js              # Script that runs on UserPromptSubmit
    │   ├── persona_core.md               # The persona core text injected at session start
    │   └── persona_marker.txt            # The compact marker injected on every message
    ├── skills/
    │   ├── persona-format/SKILL.md       # L2/L3 response format
    │   ├── persona-safety/SKILL.md       # Always-on security rules, irreversible-action gate
    │   ├── persona-triggers/SKILL.md     # Full A-AB trigger-word detail and the 22-perspective mapping table
    │   ├── persona-investor/SKILL.md     # #13 professional investor domain
    │   ├── persona-lawyer/SKILL.md       # #11 professional lawyer domain
    │   ├── persona-accountant/SKILL.md   # #14 accounting/tax specialist domain
    │   ├── persona-marketer/SKILL.md     # #15 marketing/sales specialist domain
    │   ├── persona-architectural-designer/SKILL.md # #16 architectural design domain
    │   ├── persona-interior-designer/SKILL.md      # #17 interior design domain
    │   ├── persona-construction-expert/SKILL.md    # #18 construction domain
    │   ├── persona-cost-estimator/SKILL.md         # #19 estimating domain
    │   ├── persona-design-director/SKILL.md        # #20 design direction domain
    │   ├── persona-spatial-3d-modeling-expert/SKILL.md # #21 3D modeling/BIM domain
    │   ├── persona-rendering-visualization-expert/SKILL.md # #22 rendering/visualization domain
    │   ├── persona-create/SKILL.md       # Entry point for the new-persona creation interview
    │   └── persona-edit/SKILL.md         # Entry point for the trigger-editing interview
    ├── commands/
    │   ├── create.md                     # The procedure persona-create reads and follows
    │   └── edit.md                       # The procedure persona-edit reads and follows
    └── reference/
        ├── persona_full_core.md          # The full persona definition (for full L3 activation / session recovery)
        ├── built_environment_collaboration.md # Shared inputs, handoffs, and conflict rules
        └── test_scenarios.md             # A set of sample utterances for verifying trigger behavior
```

The `commands/` folder preserves the original Claude Code workflow text as an internal reference. Codex does not run these as slash commands directly; instead, the `persona-create`/`persona-edit` skills read and follow their content.

### The 15 checks performed by the automated consistency checker (`validate.mjs`)

This checker mechanically prevents number drift when adding perspectives or changing triggers. It uses only built-in Node.js modules and no external libraries.

| # | What it checks |
|---|---|
| 1 | Perspective numbers are continuous from 1 through the last entry |
| 2 | Labels such as "22 people" and "22 perspectives" match the actual count in every core file, skill, and README |
| 3 | The documented A-AB trigger-pattern count matches the actual section count |
| 4 | The skill-folder count matches the docs and every skill frontmatter `name` matches its folder (including English README cross-checks) |
| 5 | All 11 domain personas are wired into both the core and marker files |
| 6 | The Agent Plugins 1.0, Codex fallback, and legacy manifests plus both marketplace JSON files have valid names, versions, and source paths |
| 7 | Required disclaimers, qualified-review boundaries, and non-final estimate wording exist for all 11 domains |
| 8 | Warning only: generated HTML appears out of sync with current counts |
| 9 | Backtick-wrapped repository file references point to files that exist |
| 10 | No personal absolute path containing a developer account name leaked into distributed files |
| 11 | Codex hooks use `${PLUGIN_ROOT}`, point to existing scripts, and pair context-limit settings with the project cap |
| 12 | Domain-skill trigger lists match the canonical `persona-triggers` list |
| 13 | The serialized hook output stays below the project's 10,000-character cap |
| 14 | Core triggers match the canonical lists, and all seven built-environment skills share the collaboration protocol without broad single-word triggers |
| 15 | Every `persona-*` skill folder uses a path-safe name |

See [Commands](#commands) and [Troubleshooting](#troubleshooting) for how to run the checker and read its output.

### Continuous integration (CI)

`.github/workflows/validate.yml` automatically runs `node validate.mjs` on every push to `main` and on every pull request, blocking any change that fails the 15 checks above from reaching `main`.

---

## Security & Data Flow

### What the hooks do / do not do

| Do | Do not |
|---|---|
| Read fixed text files inside the plugin folder (`persona_core.md`, `persona_marker.txt`) | Make any network connection anywhere |
| Emit the file contents to standard output in a fixed JSON shape | Build and run code on the fly (`eval`) |
| Fully drain the hook metadata Codex sends over stdin before responding (purely to avoid an EPIPE error on very large prompts — the content is never stored or used) | Launch any external program |
| | Write or delete any file |
| | Collect or transmit user data anywhere |

### The trust-approval procedure

Whether installation, activation, or hook execution is allowed depends on the Codex version, surface, account, and organization policy. If a permission screen appears, verify the plugin name and the target of the `node` command before approving it. Even when there is no separate screen, the plugin does not bypass Codex permissions and cannot enable a feature blocked by organization policy.

### The irreversible-action gate is a "behavioral guideline," not a "system firewall"

In front of irreversible actions — deletion, deployment, force-pushing, external messaging — this persona instructs Codex to adopt the **response habit and judgment standard** of "don't run it automatically; ask the user first." This is not a mechanism that physically blocks filesystem access; it is a rule layered on top of the approval/permission system Codex already has, saying "always stop and ask in these situations." The actual final execution authority and approval process always follow Codex's own platform policy.

### Where data actually flows

```text
The sentence the user typed
        +
The persona rule text the plugin injected (read from a local file)
        │
        ▼
The conversation context is sent to whichever AI model provider Codex uses
   (this happens regardless of this plugin — it is simply how Codex
    normally operates)
        │
        ▼
A response is generated and returned to the user
```

The plugin itself sends nothing to any server or remote storage of its own. It does not collect personal data, keep remote usage logs, or perform any separate analytics (telemetry). That said, as long as you use Codex at all, your conversation content being sent to whatever AI model provider Codex connects to (e.g. OpenAI) happens regardless of this plugin, and that provider's own official privacy policy governs how it's handled.

### Habits around personal and sensitive data

- The persona is designed to warn immediately if sensitive data such as API keys, passwords, or tokens appears in code or conversation.
- Places it checks for sensitive-data exposure: code, GitHub, logs, on-screen output, documents, commit history, error messages.
- Responses in the accounting/tax and legal domains, which deal with personal and financial information, always carry a required disclaimer.

### A built-in self-consistency safeguard

Check #10 in `validate.mjs` automatically catches a developer's personal computer path (one containing a real user account name) that accidentally leaked into this repository's documentation or plugin files, before it reaches a public repository. This document, along with every other distributed document here, is kept in a state that passes this check.

---

## Files & Documentation Map

| What you're looking for | Where it is |
|---|---|
| This document (Korean) | Repository root, `README.md` / `README.html` |
| This document (English) | Repository root, `README.en.md` / `README.en.html` |
| Full license text | Repository root, `LICENSE` |
| Copyright, trademark, and third-party attribution notice | Repository root, `NOTICE` |
| The actual plugin body that gets installed | `plugins/sodam-persona/` |
| Hook events and command definitions | `plugins/sodam-persona/hooks/hooks.json` |
| SessionStart script / core text | `plugins/sodam-persona/hooks/inject-core.js`, `persona_core.md` |
| UserPromptSubmit script / compact marker | `plugins/sodam-persona/hooks/inject-marker.js`, `persona_marker.txt` |
| All 9 skills | `plugins/sodam-persona/skills/persona-*/SKILL.md` |
| The full trigger-word list and perspective mapping table | `plugins/sodam-persona/skills/persona-triggers/SKILL.md` |
| Detail on the 4 domain experts | `plugins/sodam-persona/skills/persona-investor|lawyer|accountant|marketer/SKILL.md` |
| The original procedure text for creating/editing personas | `plugins/sodam-persona/commands/create.md`, `edit.md` |
| The consistency-check script | Repository root, `validate.mjs` |
| The HTML-regeneration script | Repository root, `build-docs.mjs`, `doc-theme.html` |
| The Codex marketplace definition (source of truth) | `.agents/plugins/marketplace.json` |
| The Agent Plugins 1.0 manifest (source of truth) | `plugins/sodam-persona/plugin.json` |
| Codex fallback / legacy Claude compatibility manifests | `plugins/sodam-persona/.codex-plugin/plugin.json`, `.claude-plugin/plugin.json` |
| Manual and automated test scenarios | `plugins/sodam-persona/reference/test_scenarios.md` |
| The CI (automated check) configuration | `.github/workflows/validate.yml` |

> Any folder not listed here (for example, local cache or scratch-note files created during development) is excluded from the repository via `.gitignore` and simply does not exist for anyone who freshly downloads this plugin, so this document does not cover it.

---

## Changelog Summary

Listed with the most recent entries at the top. Click (or tap) an item to expand its details.

<details>
<summary><strong>2026-09-16 — Added drawing-work routing (v1.5.1)</strong></summary>

- Added pattern AB for drawing-related work, CAD/DWG, plans, elevations, sections, details, and shop drawings.
- Routes by purpose across architectural design, interior design, construction, estimating, and 3D modeling while separating non-building drawings and regulated work.
- Synchronized 22 perspectives, 28 patterns, 16 skills, hooks, documentation, and validation.

</details>

<details>
<summary><strong>2026-09-16 — Added 3D modeling and rendering specialist personas (v1.5.0)</strong></summary>

- Added separate 15+ year perspectives for 3D modeling (#21, including Revit and Rhino) and architectural/interior rendering and visualization (#22).
- Recognizes Korean and English modeling/rendering variants while preventing false activation for data modeling and web rendering.
- Synchronized multi-letter pattern IDs (Z then AA), 22 perspectives, 27 patterns, 16 skills, tool-state verification, and model-to-render-to-construction/cost handoffs.

</details>

<details>
<summary><strong>2026-09-16 — Added five built-environment specialist personas</strong></summary>

- Added 15+ year perspectives for architectural design, interior design, construction, cost estimating, and design direction.
- Centralized shared project inputs, handoffs, conflict priority, joint activation, and regulated-title safeguards in `built_environment_collaboration.md`.
- Expanded that release through perspective #20, pattern Y, and 14 skills, with hooks, docs, and validation synchronized.

</details>

<details>
<summary><strong>2026-09-16 — Synced the original v1.3.0 improvements into the Codex port</strong></summary>

- Ported the original project's visible hook-failure warnings, low-signal trigger cleanup, domain-trigger synchronization, legal/investor/accounting disclaimers, recovery-core repairs, and chat-visible activation indicator into the Codex-specific structure.
- Expanded `validate.mjs` to 15 checks covering Codex hook variables and scripts, serialized-output limits, domain-trigger drift, and safe skill-folder names.
- Added the Agent Plugins 1.0 root `plugin.json` as the canonical manifest while retaining `.codex-plugin/plugin.json` as a fallback. All three manifests now report the current version `1.5.1`.
- Added LF enforcement for injected hook files and preserved the Codex port's investor disclaimer and security hardening.
- Passed 44 hook, 32 package, and 16 failure/boundary checks plus execution from a temporary Marketplace installation.
- Fixed the README dark theme ending in a white area on wide screens and regenerated both Korean and English HTML files.

</details>

<details>
<summary><strong>2026-08-09 — Full legal/copyright/license/commercial-use audit</strong></summary>

- Found that the "a disclaimer is mandatory for actionable answers" rule, which existed only for the accounting/tax (#14) and legal (#11) domains, was missing for the investor persona (#13, trading/position/timing judgment).
- Added the required disclaimer clause to `skills/persona-investor/SKILL.md` and folded it into `validate.mjs`'s disclaimer check (#7) — **applied** (verified `node validate.mjs` passes).
- At that time, the #13 disclaimer in the core/marker and the `license` field in the legacy manifest were still pending. **Both follow-ups were completed in the 2026-09-16 v1.3.0 synchronization**, and `validate.mjs` now checks them for regression.
- Re-verified that LICENSE (the official Apache License 2.0 text), NOTICE (copyright holder, third-party attribution, trademark notice), and this document's [Legal, Copyright, License, and Commercial Use](#legal-copyright-license-and-commercial-use) section are all still accurate and consistent.
- Re-confirmed zero dependency manifests (package.json, etc.), zero image/font files, and zero assets folders anywhere in the repository — no bundled third-party package or asset was found.

</details>

<details>
<summary><strong>2026-08-09 — Official Codex marketplace packaging</strong></summary>

- Added `.agents/plugins/marketplace.json` — formally split out the marketplace definition Codex actually reads.
- Bumped the plugin version to `1.1.1`.

</details>

<details>
<summary><strong>2026-08-04 — Documentation trust hardening (broken-link and personal-path leak prevention)</strong></summary>

- Removed 2 dead references pointing to the already-retired GUIDE.md/GUIDE.en.md documents.
- Removed a real personal computer path that had accidentally been left in `persona-triggers/SKILL.md`.
- Added 2 new checks to `validate.mjs`: "do in-document file references actually exist" (#9) and "has a personal absolute path leaked" (#10). CI now catches the same mistake automatically if it happens again.

</details>

<details>
<summary><strong>2026-07-27 — Added the ability to create and edit personas through an interview</strong></summary>

- Added the interview-style `$persona-create` and `$persona-edit` skills — you can now add a new domain expert or edit existing trigger words through conversation, with no coding required.
- Added input validation for the new persona's name (English slug) — prevents a badly formatted answer from being used directly in a file path (blocks path-traversal risk).
- Retired the separate "beginner guide (GUIDE)" document and folded it into this single README.

</details>

<details>
<summary><strong>2026-07-26 — Documentation tooling and stability hardening</strong></summary>

- Added the `build-docs.mjs` script, which regenerates `README.html`/`README.en.html` identically whenever `README.md`/`README.en.md` is edited.
- Softened hook behavior so that a missing required file causes a quiet, clean exit instead of a raw crash.

</details>

<details>
<summary><strong>2026-07-11 — A major overhaul: expanded perspectives, automated checks, finalized license</strong></summary>

The single day with the largest cluster of changes in this project's history.

- Expanded perspectives from 13 → 14 (added the accounting/tax specialist) → 15 (added the marketing/sales specialist).
- Substantially expanded high-frequency trigger words for the accounting/tax (#14) and legal (#11) domains.
- Reinforced trigger words for 5 existing perspectives (without changing the total perspective count).
- Introduced the `validate.mjs` consistency checker for the first time, wired into GitHub Actions (CI).
- Discovered in live testing that accounting/tax and legal answers were missing their required disclaimer → escalated it into an always-injected, mandatory rule.
- Removed a real developer computer path that had been left inside the repository.
- Added the Apache License 2.0 and a `NOTICE` file for the first time (copyright holder: SoDam AI Studio).
- Fully reworked the Korean/English README and GUIDE documents for public distribution (added installation steps, architecture, security/data flow, license, and trademark guidance).
- Unified the project name from `persona-plugin` to `sodam-persona`.
- Excluded 4 internal backlog documents that were never meant for distribution, via `.gitignore`.

</details>

<details>
<summary><strong>2026-06-17 ~ 2026-06-20 — Added the irreversible-action gate and a self-verification gate</strong></summary>

- Introduced trigger pattern (R): detects irreversible actions such as deploy, delete, migrate, merge, and release, and forces mandatory confirmation instead of automatic execution.
- Added a self-verification completion gate that checks "did real verification (running, testing, building) actually happen before saying it's done?"

</details>

<details>
<summary><strong>2026-06-16 — Project launch (first released as a Claude Code plugin)</strong></summary>

- First packaged persona v5 as a plugin for Claude Code (the target platform at the time).
- Wrote the first detailed beginner-oriented README and GUIDE documents.
- Added 29 trigger words (pattern Q) that demand evidence, sources, and proof — the starting point of the discipline against stating speculation as fact.

This project was later ported to be Codex-only, becoming today's `SoDam Persona for Codex`.

</details>

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `codex plugin marketplace add .` fails | You ran it from somewhere other than the repository root, or `.agents/plugins/marketplace.json` is missing | Move into the folder you downloaded the repository into (where `README.md` is visible) and try again |
| "Marketplace not found" while updating | `remove` was run before `upgrade`, which erased the marketplace registration itself | Always follow the order **`upgrade` → `remove` → `add`**. Reversing the order reproduces this error |
| Installed, but the persona doesn't seem active at all | The plugin is disabled, or permissions, organization policy, or the install cache prevented the hook from running | Check enabled status with `codex plugin list` → start a new task → review and allow any permission prompt. If no prompt appears and it still fails, check organization policy and the install cache |
| You edited the plugin's code, but the change isn't reflected in conversations | The install cache does not refresh automatically just because a file changed | Reinstall in this order: `codex plugin marketplace upgrade sodam-persona` → `codex plugin remove sodam-persona@sodam-persona` → `codex plugin add sodam-persona@sodam-persona`, then start a new task |
| Typing `node` in the terminal gives a "command not recognized" error | Node.js isn't installed, or the terminal wasn't reopened after installing it | Install from `nodejs.org`, then close every open terminal window and open a new one |
| `node build-docs.mjs` says "pandoc is not installed" | Pandoc is missing | Only needed if you're editing the documentation yourself. If you're just *using* the plugin, this error is safe to ignore. To fix it, install from `pandoc.org/installing.html` |
| `codex plugin marketplace add sodam-ai/SoDam-Persona-Codex` fails with a network error | Git isn't installed, the repository name is mistyped, or a firewall/proxy is blocking it | Check Git with `git --version`, double-check the repository name's spelling, and check proxy settings if you're on a corporate/school network |
| `node validate.mjs` prints `❌ FAIL` | Some number — perspective count, trigger count, skill count, etc. — has drifted out of sync, usually while adding or editing a persona | Read the printed error list line by line, open the referenced file, and fix the number, then rerun. See the "15 checks" table in [Architecture](#architecture) for what each numbered check means |
| An actionable investment, accounting/tax, or legal answer is missing its disclaimer | Likely a defect | Reinstall the latest version and retry in a new task. If it persists, file a GitHub Issue with the prompt and version, and run `validate.mjs` check #7 |
| A path-related error appears when typing a command into Windows PowerShell | Quotation marks or backslashes changed while being retyped by hand | Copy this document's code blocks and paste them directly instead of typing them manually |
| The persona feels like it's drifted after a long session | This is expected — the marker is re-injected on every message by design, to auto-recover the persona | No action needed. If it still feels off, start a new task for a fresh session |

---

## Frequently Asked Questions (FAQ)

**Q. Is this plugin free?**
A. This repository charges no separate plugin fee and is published under Apache License 2.0. Codex/OpenAI subscriptions, usage charges, and internet access can still cost money. See [Legal, Copyright, License, and Commercial Use](#legal-copyright-license-and-commercial-use).

**Q. Can it delete or change files on my computer on its own?**
A. No. Aside from reading 2 fixed text files inside the plugin folder, the hooks never write or delete any file. Irreversible actions such as deletion or deployment are always designed to ask the user for confirmation first. See [Security & Data Flow](#security--data-flow) for details.

**Q. Do I need an internet connection?**
A. Codex itself needs the internet to talk to an AI model. The plugin's hooks themselves only read local files and don't make any separate network connection.

**Q. Can I use the accounting/tax or legal answers instead of consulting a real professional?**
A. No. This persona is not an actually licensed tax accountant, CPA, or lawyer. It exists to provide reference information only, and any actionable decision (filing, contract interpretation, etc.) must be confirmed by a real professional first. This is why a disclaimer is always shown alongside such answers.

**Q. Does it work with Claude Code too?**
A. Legacy compatibility files (`.claude-plugin/`) still remain in the repository, but this project is currently **maintained for Codex only**, and new features and trigger updates are made against the Codex manifest. Up-to-date behavior on Claude Code is not guaranteed.

**Q. Can I install it on multiple computers?**
A. Yes. The plugin is designed to be self-contained, so it behaves identically on a brand-new computer with nothing more than a fresh install — no separate personal config files or memory needed.

**Q. I want to add or change trigger words myself.**
A. Call `$persona-edit` (to edit an existing perspective) or `$persona-create` (to add a completely new field of expertise) and follow the interview. See [How to Use](#how-to-use) and [Workflow](#workflow).

**Q. The persona answers too long / too heavily.**
A. Mixing in words like "briefly", "in short", or "just the key point" switches it to a short format immediately. This rule has the highest priority of all.

**Q. I actually want it to go deeper and more thorough.**
A. Using expressions like "objectively", "in depth", "thoroughly", or "full persona version" brings all 22 perspectives into the review.

**Q. I found a bug or something misbehaving. Where do I report it?**
A. Please report it through the repository's GitHub Issues feature. Including a reproducible example of what you typed speeds up diagnosis a lot.

**Q. Can I take this plugin's code and put it into my own commercial product?**
A. Yes, the Apache License 2.0 explicitly allows this. There are a few conditions, though — including a license copy, marking changed files, and keeping notices intact. See [Legal, Copyright, License, and Commercial Use](#legal-copyright-license-and-commercial-use) for the conditions. This is a plain-language summary, not legal advice.

**Q. Is this an official feature made by OpenAI?**
A. No. This project has no affiliation with or sponsorship from OpenAI. It's an independent community plugin. "Codex" and "OpenAI" are trademarks of their respective owners, used in this document purely to refer to those products (nominative use).

**Q. If a long session gets compacted, or goes through a sub-agent, does the persona disappear?**
A. No. The `UserPromptSubmit` hook is designed to re-inject its compact marker on every single message, which automatically restores the persona even in those situations.

---

## Legal, Copyright, License, and Commercial Use

> The following is a plain-language summary and **not legal advice**. The repository `LICENSE` sets the license terms. `NOTICE` carries provenance and attribution information; it does not add to or modify those terms. Obtain independent legal review when commercial redistribution or ownership conclusions matter.

### License: Apache License 2.0

- **Copyright notice stated by the project**: Copyright 2026 SoDam AI Studio (from `NOTICE`). This technical review did not independently prove the legal-entity name, contributor assignments, or ownership of AI-assisted material; formal delivery, investment, or warranties of title require **legal/professional review**
- **Full text location**: Repository root, `LICENSE`
- **Official reference**: `https://www.apache.org/licenses/LICENSE-2.0` (the repository `LICENSE` is the governing text; the explanation below is a plain-language summary)

The Apache License 2.0 **explicitly permits** the following 4 things.

| Permission | Meaning |
|---|---|
| Commercial use | You may use this code as-is in a business, or include it in a product you sell |
| Modification | You are free to change the code |
| Distribution | You may redistribute it to others, either as-is or modified |
| Patent use | The grant is limited to patent claims that a contributor can license and that are necessarily infringed by that contribution; certain patent litigation terminates the grant (section 3) |

In exchange, you **must** meet the following conditions.

| Condition | Meaning |
|---|---|
| Include a copy of the license | If you redistribute this code (or part of it), you must include a full copy of the Apache License 2.0 |
| State any changes made | If you modified the original, you must prominently mark the modified files as changed |
| Keep copyright/patent/trademark notices | You must retain the copyright, patent, and attribution notices from the original source instead of deleting them |
| Include a copy of the `NOTICE` file | Since the original includes a `NOTICE` file, you must pass along its notices when redistributing (in your own `NOTICE` file, documentation, or on-screen display) |

And it is important to be clear about what is **not** guaranteed (a summary of the original's sections 7 and 8).

- This software is provided **"AS IS,"** without any warranty of any kind, including merchantability or fitness for a particular purpose.
- The copyright holder and contributors are not liable for any damages arising from the use of this software (including loss of business, work stoppage, computer failure, and similar).
- Assessing the suitability of using or redistributing this software, and bearing any resulting risk, is entirely the user's own responsibility.

### Copyright and third-party attribution (summary of the `NOTICE` file)

- `plugins/sodam-persona/skills/persona-triggers/SKILL.md` contains the following **short quotations or abridged/paraphrased wording**, not third-party source code.
  - "Chesterton's Fence" — a simplified paraphrase of the principle associated with G. K. Chesterton's *The Thing*, "The Drift from Domesticity"
  - "Hyrum's Law" — an abridged formulation of the observation attributed to Hyrum Wright and published at `https://www.hyrumslaw.com/`
  - Goal-Driven Execution — a short excerpt from a public post attributed to Andrej Karpathy. Public archive reviewed: `https://adhx.com/karpathy/status/2015883857489522876`
- Provenance does not guarantee that wording is in the public domain, separately licensed to this project, or reusable in every jurisdiction. Before public or commercial redistribution, the applicable quotation exception, jurisdiction, exact source, and attribution method require **legal/professional review**.
- No third-party source code, images, icons, fonts, video, or audio files were found in the current distribution candidates.

### Trademark notice

Product and company names mentioned in this document and project — including "Claude," "Claude Code," "Anthropic," "Codex," "OpenAI," "GitHub," and "Node.js" — are trademarks or registered trademarks of their respective owners. This project is an independent work with no affiliation, sponsorship, or endorsement from any of them. Apache License 2.0 grants no trademark license, so use those names only within the reasonable scope needed to identify products, describe compatibility or origin, and reproduce `NOTICE`.

### An important legal notice about the domain-expert personas

The professional investor (#13), professional lawyer (#11), accounting/tax specialist (#14), and marketing/sales specialist (#15) personas in this plugin are **not actual licensed professionals — they are software settings that adjust Codex's AI response style.**

- Investment/trading-related answers are not investment advice; full responsibility for actual investment decisions and their outcomes rests with the user.
- Legal-related answers are not legal advice and carry no guarantee of legal effect. Have a lawyer confirm before acting on any contract, regulatory, or compliance judgment.
- Accounting/tax-related answers are for general information only; a licensed tax accountant or CPA must give final confirmation before actually filing or paying anything.
- Marketing-related answers attempt to filter out language that could amount to exaggerated or false advertising, but the user must independently review compliance with actual advertising/labeling law before publishing anything.

### Things to check before using AI-generated content (code, docs, etc.)

- This plugin only adjusts Codex's response style — it does not guarantee or judge the copyright status of the code, documents, or explanations Codex actually generates.
- Before including an AI-generated result in a commercial product, service, or client deliverable, **you must check yourself** whether:
  - the result is not substantially similar to an existing copyrighted work (risk of infringement),
  - the terms of service of the AI service you used (Codex/OpenAI, etc.) permit commercial use of that result, and
  - the result doesn't conflict with the license terms of any open-source code it may have drawn on.
- The rule documents in this plugin were themselves written and refined through an iterative process using AI coding tools. The use of AI tools alone does not settle copyright ownership or license validity, so it is disclosed for transparency. Obtain independent legal review when rights ownership matters to redistribution.

### External services, API pricing, and model-usage policies must be checked separately

This plugin is only a set of configurations that runs on top of the external platform Codex — it does not describe or guarantee Codex/OpenAI's pricing, model-usage policy, or terms of service. Check the items below directly through **that service's own official channels**, not this document.

- Codex/OpenAI's pricing plans and usage limits
- The model-usage policy (permitted/prohibited use cases)
- Codex/OpenAI's terms of service and privacy policy
- Whether reselling or reusing Codex's responses in a commercial service has any separate conditions attached
- Official plugin installation and permission guidance: `https://help.openai.com/en/articles/20001256/`

### Repository asset and external-dependency review

Here is the result of scanning this repository's entire code and documentation (as of 2026-09-16).

| Check | Result |
|---|---|
| Dependency manifests such as package.json, package-lock.json, pnpm-lock.yaml, yarn.lock, requirements.txt, pyproject.toml, Cargo.toml, go.mod | **Zero found** repository-wide — no external package dependency bundled into the distribution was found |
| Image/icon/font/video/audio files (png, svg, ico, woff, ttf, mp4, mp3, etc.) | **Zero found** repository-wide |
| assets, public, static, samples, examples, fixtures folders | **Zero found** repository-wide |
| Sample accounts, email addresses, phone numbers, user-home absolute paths, or real customer data | **Zero found** in the 35 distribution-candidate files; text test scenarios use generalized inputs |
| Local work records (`.omc`, `.omx`, `.remember`, `.plugin-config`, `CHECKPOINT.md`, etc.) | Excluded from distribution by `.gitignore`; do not include them when manually creating an archive |
| Whether the hook scripts (inject-core.js, inject-marker.js) use any external package | They use only Node.js built-in modules — **zero** external package imports/requires |

No additional license duty was identified from images, fonts, or external packages included in the current repository. Separately installed tools such as Node.js, Pandoc, and Codex remain subject to their own licenses and terms. Re-run this review whenever assets or dependencies are added.

### Commercial use summary

**One-line summary for absolute beginners**: the project code and documentation covered by Apache License 2.0 may be used as-is, modified, forked, redistributed, sold, operated as a service, used in education, or delivered to a client. Trademarks, third-party quotations, AI output, material you add, external-service terms, and actual ownership remain separate checks.

| What you want to do | Allowed? | Conditions |
|---|---|---|
| Use this plugin as-is internally at a company or personally, without redistribution | Yes | No separate redistribution duty under this repository license; Codex/OpenAI terms and fees remain separate |
| Clone it or fork it on GitHub into your own account | Yes | None (follow the "conditions" below if you redistribute it to others) |
| Modify it and include it in your own commercial product/service | Yes | Follow the "conditions" table above (license copy, marking changes, keeping notices) |
| Repackage this code and resell it | Yes | Same as above. The Apache License 2.0 does not forbid charging money for redistribution itself |
| Run a service (e.g. SaaS) built on top of this plugin | Yes | Follow redistribution conditions if source/plugin files reach customers. Even for server-only use, separately check Codex/OpenAI terms, privacy duties, and professional-service regulation; show disclaimers so users do not mistake output for real investment/legal/tax advice |
| Use it as training material (courses, tutorials, internal company training) | Yes | None (follow the "conditions" table above if you redistribute the material itself) |
| Include it in a deliverable you hand off to a company or client | Yes | Follow the "conditions" table above. The license copy and NOTICE notices must also reach the client |
| Distribute a product under the "SoDam" / "sodam-ai" name in a way that implies your product originates from or is sponsored by that brand | **Not established as permitted** | The license grants no trademark rights (section 6). Use beyond reasonable and customary origin description requires confirmation from the rights holder |

### Priorities before publication, distribution, or client delivery

| Priority | Required action |
|---|---|
| **Must Have** | Provide `LICENSE`, carry applicable `NOTICE` content, mark modified files, avoid implied trademark affiliation, and verify external-service terms, privacy duties, and permission for customer material |
| **Should Have** | Verify the exact sources and permitted scope of third-party quotations, and document the legal copyright-holder name, contributor assignments, and ownership chain for AI-assisted material |
| **Could Have** | Obtain lawyer review of client contracts, warranties, indemnities, and country-specific regulation, and retain a release-by-release external-material list or SBOM |

### What you must not do (summary)

- Impersonate the "SoDam"/"sodam-ai" brand name as if it were something you created, and distribute it that way
- Redistribute a modified version without including a license copy and the NOTICE notices
- Make a filing, contract, or investment decision based solely on the accounting/tax, legal, or investor domain persona's answer, without an actual professional's confirmation
- Reuse third-party copyrighted material that may be embedded in Codex's generated output commercially, as-is, without checking its source

If you have a specific situation in mind, please read the `LICENSE` and `NOTICE` originals in the repository directly, and consult a lawyer for any commercial-redistribution scenario you're not fully certain about.
