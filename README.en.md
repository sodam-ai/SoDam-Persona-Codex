# SoDam Persona for Codex

**SoDam Persona** gives OpenAI's AI coding assistant **Codex** (an AI program that helps you build software using natural-language instructions) the personality of a "careful, detail-oriented Korean development partner." It is an add-on program (a **plugin** — a small extra program that adds features to an existing program).

This document is written so that even someone who has never used a computer, a smartphone, a messenger app, or AI before can follow it from installation to actual use. Whenever an unfamiliar term appears for the first time, it is explained in `plain words (technical term)` form. Example: repository (an online storage place that holds code and documents together).

The plugin itself is not a separate AI. It layers a set of "judge this way, answer this way" rule documents on top of the conversational ability Codex already has. It contains 2 **hooks** (small programs configured to run when Codex dispatches their events) and 31 conditional expert knowledge modules (**skills**) to load when relevant. Verify actual automatic execution in your installed environment; installation, permissions, and host behavior can affect it.

> **Version in this working branch**: `1.10.2` · **Perspectives**: 37 · **Trigger patterns**: 43 patterns (A-AQ) · **Skills**: 31 · **Hooks**: 2 · **License**: Apache License 2.0

> **Check before installing**: The default GitHub install and ZIP download fetch the default branch. As of 2026-09-23, it differs from this v1.10.2 working branch (`codex/fix-codex-global-hooks-v1.10.2`). Do not assume the default install supplies v1.10.2. Use the testing instructions below. A working branch is not an official release.

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

**v1.10.2 verification record (2026-09-23, Windows)**: In the working branch, the consistency checker, 22 hook/validator automated tests, official plugin-structure validator, installation and direct hook execution in an isolated temporary environment, Korean/English HTML regeneration, and Chrome rendering/console checks passed. This does not prove that an existing personal installation was updated or that Codex automatically invoked the hook on an ordinary prompt.

**Unverified scope**: The existing personal installation was v1.10.1 at the last check. Automatic v1.10.2 hook invocation on an ordinary prompt, macOS/Linux devices, and every Codex app/IDE combination remain unverified. CI and browser checks apply only to the tested commit and environment. Run [Verify the installation](#verify-the-installation) on each environment.

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

### Install the v1.10.2 working branch (for testing)

Use these commands only in a **separate test environment** without this marketplace already registered. Codex CLI help confirms the `--ref` option.

```powershell
codex plugin marketplace add sodam-ai/SoDam-Persona-Codex --ref codex/fix-codex-global-hooks-v1.10.2
codex plugin add sodam-persona@sodam-persona
```

If `sodam-persona` is already registered, do not register a duplicate; check `codex plugin marketplace list`. To test without removing an existing installation, use a separate Codex environment. Alternatively, clone with `git clone --branch codex/fix-codex-global-hooks-v1.10.2 https://github.com/sodam-ai/SoDam-Persona-Codex.git` and use the local-install route in an environment without a conflicting registration.

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

### How to request architectural or interior work for the first time

In architecture and interiors, “technical design,” “concept design,” “modeling,” “rendering,” and “construction” produce different deliverables. Copy the closest starter sentence from the table below.

> “15+ years” in this document describes the expert viewpoint assigned to the AI persona. It does not claim that the user has 15 years of experience, and the plugin never assumes expert knowledge of design, construction, estimating, Revit, Rhino, or any other application.

| What you want to do | Starter sentence | Lead role and verification boundary |
|---|---|---|
| Site planning, code, permits, design documents | “Explain the possible building layout and code checks for this site in beginner-friendly terms.” | #16 architectural planning leads. A qualified local professional must confirm actual code, structure, fire safety, and permits |
| Interior circulation, finishes, ceilings, furniture details | “Review the interior circulation and finish plan in this floor plan.” | #17 interior technical design leads. Site conditions and qualified professionals confirm dimensions, performance, services, and construction details |
| Methods, sequence, quality, defects | “In what order should this interior be built, and what must be inspected?” | #18 construction leads. Site measurement, safety planning, and specialist-trade approvals are required |
| Quantities, unit rates, cost, value engineering | “What quantity and unit-rate information is needed to estimate this drawing?” | #19 estimating leads. It does not state a final price without location, date, brand, tax, transport, and disposal assumptions |
| Integrate the whole architectural and interior direction | “Unify the exterior and interior design language and material rules.” | #20 design direction leads, with #23 and #24 reviewing |
| Revit, Rhino, BIM, or 3D geometry | “Check units, coordinates, and geometry loss when moving this Revit model to Rhino.” | #21 3D modeling leads. It first checks software versions and the user’s proficiency in each application |
| Materials, lighting, cameras, render quality | “How should I set materials, lighting, and cameras for this interior scene in D5?” | #22 rendering/visualization leads. A render is not an approval drawing or construction standard |
| Architectural concept, massing, facade | “Propose three massing and facade options suited to this site.” | #23 architectural concept design leads; #16 reviews code and permit effects |
| Interior atmosphere, materials, color, furniture | “Propose three mood and material-palette options for this cafe interior.” | #24 interior concept design leads; #17 reviews detail, performance, and building-services effects |
| You do not yet know the drawing type | “Tell me what can be checked from the attached drawing and what drawing is needed next.” | Drawing router AB identifies the type and purpose, then chooses one lead and reviewers among #16-#24 |

Provide as many of these items as you can in the first request.

1. Project type and use: home, cafe, office, exhibition, and so on
2. Current stage: idea, schematic design, detailed design, estimating, construction, or closeout
3. Location: country, city, and regulatory jurisdiction
4. Source material: site data, dimensions, photos, drawings, models, title block, latest file version
5. Desired deliverable: explanation, checklist, options, drawing review, modeling sequence, render settings, and so on
6. Software and version: Revit, Rhino, 3ds Max, Blender, SketchUp, Cinema 4D, D5, Twinmotion, Unreal, Unity, and so on
7. Your proficiency in each application: first use, beginner, intermediate, or production use
8. Budget, schedule, site constraints, and conditions that remain unknown

When information is missing, the persona should separate confirmed facts from assumptions and ask for the missing inputs first. Images, 3D models, and renders support decisions; they do not replace permit documents, structural calculations, fire-safety design, fabrication/shop drawings, construction drawings, or a final estimate.

### How to request image or video work for the first time

Image and video work has separate ideation, production, editing, and review stages. A bare “image” or “video” prompt triggers one clarification; state the intended result to route directly.

| Goal | Example request | Lead |
|---|---|---|
| Generate, composite, or retouch an image | “Preserve the source render, composite this image, and upscale it to 4K” | #32; #22 joins for 3D scene settings |
| Plan a video concept, storyboard, and shots | “Create a 30-second storyboard and camera path for this cafe walkthrough” | #33; #21+#22 join for 3D model/render work |
| Edit cuts, captions, audio, color, and output | “Edit this as a vertical short, then check captions, loudness, and export settings” | #34 |
| Review actual quality, provenance, and rights | “Inspect the actual image/video and document commercial-use evidence for music, fonts, and models” | #35; #11 joins for legal interpretation |

Provide the purpose, platform, aspect ratio, image size or video duration/FPS, source files, protected elements, software and version, proficiency in that specific software, deadline, and rights status when known. Architectural/interior 3D experience does not imply expert proficiency in every image or video tool. Successful generation/export and actual visual/audio review remain separate states.

### How to request generative-AI tool or platform work for the first time

Local tools such as ComfyUI and hosted services such as Midjourney, Higgsfield, and Runway have different inputs and risks. A product name alone triggers one clarification. State the action and expected result to route directly.

| Work | Example request | Routing and checks |
|---|---|---|
| Install or repair a local tool | “Help me diagnose this ComfyUI CUDA error without changing unrelated workflows.” | #36 checks the exact install, Python, GPU, CUDA, VRAM, logs, and rollback path |
| Build or edit a workflow | “Create a new ComfyUI workflow for this image while preserving the current graph.” | #36 inventories nodes, models, versions, inputs, outputs, and recovery points before editing |
| Operate a hosted platform | “Tell me how to create and download this shot in Higgsfield, including the credit cost.” | #37 verifies the current interface, plan, credits, upload/download path, and policy evidence |
| Compare tools or platforms | “Compare ComfyUI, Midjourney, Higgsfield, and Runway for this deliverable.” | #36 and #37 compare control, hardware, privacy, cost, rights, reproducibility, and export limits using current evidence |
| Produce and review media | “Generate the image, inspect the real output, and check whether it is safe to deliver.” | #32 or #33 leads the creative output; #35 reviews the actual file and evidence; #36 or #37 operates the environment |

State the operating system, GPU and VRAM if relevant, tool or platform, version or plan, current state, exact error, input files, expected output, budget or credit limit, rights status, and your proficiency with that specific tool. Fifteen years of digital-content, CG, or automation experience does not mean fifteen years with a newer individual product.

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
| `$persona-architectural-designer <text>` | Architectural planning, code, permits, and drawings (#16) |
| `$persona-interior-designer <text>` | Interior circulation, finishes, lighting, and details (#17) |
| `$persona-construction-expert <text>` | Construction methods, schedule, quality, safety, and defects (#18) |
| `$persona-cost-estimator <text>` | Quantities, unit rates, construction cost, and value engineering (#19) |
| `$persona-design-director <text>` | Architecture/interior integration, consistency, and approval criteria (#20) |
| `$persona-spatial-3d-modeling-expert <text>` | Revit, Rhino, BIM, geometry, coordinates, and file conversion (#21) |
| `$persona-rendering-visualization-expert <text>` | Materials, lighting, cameras, D5, Twinmotion, Unreal, and Unity (#22) |
| `$persona-architectural-design-expert <text>` | Architectural concepts, massing, form, facades, and exterior materials (#23) |
| `$persona-interior-design-expert <text>` | Interior atmosphere, color, materials, lighting, and furniture composition (#24) |
| `$persona-source-verification-expert <text>` | External search, primary sources, recency, and source-reliability verification (#25) |
| `$persona-research-analyst <text>` | Research design, comparison, synthesis, and uncertainty analysis (#26) |
| `$persona-ideation-strategist <text>` | Idea generation, evaluation, selection, and experiment design (#27) |
| `$persona-project-manager <text>` | Scope, schedule, budget, resources, risks, dependencies, and delivery (#28) |
| `$persona-product-owner <text>` | User value, product goals, roadmap, backlog, and priorities (#29) |
| `$persona-pmo-governance-expert <text>` | Standards, stage gates, reporting, portfolio, and change control (#30) |
| `$persona-project-analyst-coordinator <text>` | Meetings, decisions, actions, requirements, and status-data traceability (#31) |
| `$persona-image-production-expert <text>` | Image generation, retouching, compositing, background removal, and upscaling perspective (#32) |
| `$persona-video-production-director <text>` | Video concept, storyboard, shots, camera movement, and generation perspective (#33) |
| `$persona-video-post-production-expert <text>` | Editing, captions, audio, grading, and encoding perspective (#34) |
| `$persona-media-quality-rights-reviewer <text>` | Image/video quality, provenance, consent, and license-review perspective (#35) |
| `$persona-generative-ai-workflow-engineer <text>` | Local ComfyUI-style tools, workflows, nodes, models, CUDA/VRAM, APIs, and recovery (#36) |
| `$persona-generative-ai-platform-operator <text>` | Hosted Midjourney/Higgsfield/Runway-style features, accounts, credits, uploads, and outputs (#37) |
| `$persona-create` | Add a domain persona through an interview. Under the current numbering, the next perspective starts at #38 |
| `$persona-edit` | Interview-style add/edit/remove of trigger words for an existing persona |

### Commands for documentation/code editors (run from the repository root)

| Command | Description |
|---|---|
| `node validate.mjs` | Automatically checks consistency: perspective count, trigger pattern count, skill count, domain wiring, disclaimer text, personal path leaks, and more |
| `node --test test-hooks.mjs` | Tests both hooks with normal, empty, malformed, 2 MiB, missing-source, and blank-source inputs |
| `node --test test-validator.mjs` | Proves the validator rejects registry, version, wiring, size, personal-path, and unsafe-folder errors |
| `node diagnose.mjs` | Read-only diagnosis of source/installed versions, enabled state, both hooks, and repository consistency |
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
| **L3** | Major work involving security, money, deployment, or irreversible actions | `persona-format` + `persona-triggers` + `persona-safety` all activate, plus a full review by all 37 perspectives |

### Trigger words — how a single word shifts intensity and perspective

When specific words (triggers) are detected in what you say, the following 6 effects fire automatically as applicable. A single trigger can produce several effects at once.

1. **Raise intensity** — "in depth", "thoroughly", "make sure" → from L1 up to L2/L3
2. **Lower intensity** — "briefly", "in short", "in one line" → always takes priority over every other effect
3. **Load an additional skill** — `persona-triggers` / `persona-format` / `persona-safety`
4. **Activate a domain expert** — legal → #11, investing → #13, accounting/tax → #14, marketing → #15, architecture/interiors/construction/cost/design/3D/rendering → #16-#24, source search/verification → #25, research/analysis → #26, ideation/concept strategy → #27, project delivery → #28, product value/backlog → #29, PMO/governance → #30, and project analysis/operations → #31, image production/editing → #32, video production/direction → #33, video editing/post-production → #34, and media quality/rights review → #35, local generative-AI workflows → #36, and hosted generative-AI platforms → #37
5. **Fully activate a single perspective** — "security" alone → #2, "design"/"UI" alone → #7, "UX" alone → #8, "testing" alone → #4, "AI"/"agent"/"MCP" alone → #6
6. **Evidence mode** (intensity stays the same) — "evidence", "source", "example", "fact" etc. → present real evidence and clearly separate speculation from confirmed fact

These trigger words are organized into 43 patterns (A-AQ), and the full word lists plus the priority order for conflicts all live in the `persona-triggers` skill. Priority summary: **length constraints (e.g. "briefly") > intensity (e.g. "in depth") > domain expert > single perspective > additional skill.**

### 37 perspectives — the expert checklist reviewed before every answer

For every response at L1 or above, 3-5 of the 37 perspectives below that are relevant to the task are briefly reviewed internally before answering — automatically, even without a trigger word. This does not apply to L0 small talk or "briefly"-style requests.

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
| 9 | Planning and requirements router | Classifying requests, shaping initial requirements and MVP scope, and routing to the responsible specialist |
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
| 20 | Building/interior design director (15+ years) | Cross-discipline integration, design consistency, approval criteria |
| 21 | Building/interior 3D modeling specialist (15+ years) | BIM, geometry, coordinates, topology, file interoperability |
| 22 | Building/interior rendering and visualization specialist (15+ years) | Materials, lighting, cameras, render output |
| 23 | Architectural concept design specialist (15+ years) | Architectural concepts, massing, form, facades, exterior materials |
| 24 | Interior concept design specialist (15+ years) | Interior concepts, atmosphere, color, materials, lighting, furniture composition |
| 25 | Source search and verification specialist (15+ years) | External sources, primary documents, recency, and source reliability |
| 26 | Research and analysis specialist (15+ years) | Research questions, comparison criteria, synthesis, and uncertainty |
| 27 | Ideation and concept strategy specialist (15+ years) | Generating alternatives, evaluating them, and designing tests |
| 28 | Project manager (15+ years) | Integrating scope, schedule, budget, resources, risks, dependencies, and delivery |
| 29 | Product manager and product owner (15+ years) | Deciding user value, product goals, roadmap, backlog, and priorities |
| 30 | PMO and project governance specialist (15+ years) | Designing standards, stage gates, status reporting, portfolio, and change control |
| 31 | Project analyst and operations coordinator (15+ years) | Tracking meetings, decisions, actions, requirements, status data, and handoffs |
| 32 | Image production and editing specialist (15+ years) | Image generation, retouching, compositing, background removal, upscaling, and output |
| 33 | Video production and direction specialist (15+ years) | Video concept, storyboard, shots, cameras, capture, AI generation, and continuity |
| 34 | Video editing and post-production specialist (15+ years) | Cuts, captions, audio, grading, compositing, encoding, and deliverables |
| 35 | Media quality and rights reviewer (15+ years) | Technical quality, AI errors, continuity, provenance, consent, and licensing |
| 36 | Generative-AI local workflow engineer (15+ year foundation) | ComfyUI-style installation, nodes, models, CUDA/VRAM, APIs, preservation, and recovery |
| 37 | Generative-AI platform operator (15+ year foundation) | Hosted Midjourney/Higgsfield/Runway-style features, accounts, credits, uploads, and outputs |

### 26 domain experts — conditionally going deep

Among the 37 perspectives above, #11 and #13 through #37 each have their own dedicated skill, which loads much deeper knowledge when a related trigger is detected.

- **Professional investor (#13, `persona-investor`)**: Always asks "if this fails, does the user lose money?" Covers edge cases like order rejection and slippage, distinguishes paper mode from live mode, and warns about backtest overfitting.
- **Professional lawyer (#11, `persona-lawyer`)**: Covers audit-log obligations, staying clear of capital-markets-law boundaries (avoiding investment-advisory language), personal-data protection/GDPR, and disclaimer/consent standards.
- **Accounting/tax specialist (#14, `persona-accountant`)**: Covers filing deadlines, expense-eligibility rules, and the line between legal tax savings and illegal tax evasion. **Always includes the disclaimer** "for general information only; please have a licensed tax accountant or CPA confirm before actually filing or paying."
- **Marketing/sales specialist (#15, `persona-marketer`)**: Covers positioning, copywriting, conversion rate, and SEO, while filtering out exaggerated or false advertising claims.
- **Architectural design specialist (#16, `persona-architectural-designer`)**: Covers site planning, codes, permits, drawing coordination, and multidisciplinary design.
- **Interior design specialist (#17, `persona-interior-designer`)**: Covers space, circulation, finishes, lighting, furniture, and interior details.
- **Construction specialist (#18, `persona-construction-expert`)**: Covers methods, schedule, quality, safety, defects, and site conditions.
- **Cost estimator (#19, `persona-cost-estimator`)**: Covers quantities, unit rates, construction cost, value engineering, changes, and estimate assumptions.
- **Design director (#20, `persona-design-director`)**: Integrates the design language, consistency, and approval criteria across architecture and interiors.
- **Architectural concept design specialist (#23, `persona-architectural-design-expert`)**: Covers site context, massing, form, facades, elevations, exterior materials, and 3D validation criteria.
- **Interior concept design specialist (#24, `persona-interior-design-expert`)**: Covers interior concepts, atmosphere, color, materials, lighting, furniture composition, and 3D validation criteria.
- **3D modeling specialist (#21, `persona-spatial-3d-modeling-expert`)**: Covers BIM, NURBS and mesh modeling, coordinates, units, conversion, and interoperability, including Revit and Rhino.
- **Rendering and visualization specialist (#22, `persona-rendering-visualization-expert`)**: Covers materials, lighting, cameras, render quality, and output verification in tools such as D5, Twinmotion, Unreal, and Unity.
- **Source search and verification specialist (#25, `persona-source-verification-expert`)**: Prefers official and primary sources, checks publication date, version, conflicting evidence, and reliability, and marks unavailable material as unverified instead of inventing a citation.
- **Research and analysis specialist (#26, `persona-research-analyst`)**: Defines the research question and scope, normalizes comparison criteria, and separates facts, source claims, interpretation, hypotheses, and information gaps.
- **Ideation and concept strategy specialist (#27, `persona-ideation-strategist`)**: Generates alternatives, evaluates them against goals, cost, risk, and feasibility, and proposes small experiments and stop criteria.
- **Project manager (#28, `persona-project-manager`)**: Integrates scope, schedule, budget, resources, risks, issues, dependencies, changes, and delivery while separating plan, actuals, and forecast.
- **Product manager and product owner (#29, `persona-product-owner`)**: Owns user problems, product goals, roadmap, backlog, priorities, user stories, and acceptance criteria.
- **PMO and project governance specialist (#30, `persona-pmo-governance-expert`)**: Designs project standards, stage gates, exceptions, reporting metrics, portfolio control, change control, and auditability.
- **Project analyst and operations coordinator (#31, `persona-project-analyst-coordinator`)**: Tracks meetings, decisions, actions, requirements, status data, documents, and handoffs by source and approval state.
- **Image production and editing specialist (#32, `persona-image-production-expert`)**: Handles AI image generation, photo/render retouching, compositing, background removal, upscaling, and visual inspection of the actual result.
- **Video production and direction specialist (#33, `persona-video-production-director`)**: Designs purpose, concept, storyboard, shots, camera movement, capture or AI generation, and scene continuity.
- **Video editing and post-production specialist (#34, `persona-video-post-production-expert`)**: Handles cuts, captions, audio, grading, compositing, encoding, master files, and platform deliverables.
- **Media quality and rights reviewer (#35, `persona-media-quality-rights-reviewer`)**: Reviews actual file quality, AI errors, playback, sync, continuity, provenance, consent, and licenses, and hands legal interpretation to #11.
- **Generative-AI local workflow engineer (#36, `persona-generative-ai-workflow-engineer`)**: Owns installation, servers, workflows, nodes, models, CUDA/VRAM, APIs, preservation, and recovery for ComfyUI-style local tools.
- **Generative-AI platform operator (#37, `persona-generative-ai-platform-operator`)**: Owns current features, accounts, plans, credits, uploads, downloads, and verification dates for Midjourney/Higgsfield/Runway-style hosted services.

`Drawing`, `drawing work`, `CAD`, `DWG`, floor plans, detail drawings, and shop drawings activate pattern AB, which routes the request to the appropriate lead and reviewing roles among #16 through #24.

When multiple domains apply at once (e.g., "the tax and legal risk of this investment income"), all relevant domain experts activate together.

Search, research, and ideation combine according to the work stage. A simple external-source lookup uses #25; a comparison and synthesis request uses #25+#26; an evidence-based request that continues through actionable ideas uses #25+#26+#27. File, code, UI, database, or SEO search, a casual “good idea” remark, and merely naming an IDE do not activate these personas.

Project-management requests are split by accountability. #28 leads execution and delivery, #29 product value and backlog, #30 organizational standards and portfolio governance, and #31 records and operational traceability. The abbreviations `PM`, `PO`, `PMO`, and `PA` alone do not activate them. Plan, actuals, forecast, and unknown status stay separate, and missing completion percentages, dates, or owners are never invented.

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
    whichever of the 26 domain skills apply)
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

### Recommended workflow for architectural and interior work

```text
1. Check inputs
   Confirm use, location, stage, dimensions, source files, latest version,
   budget, schedule, and software
       │
       ▼
2. Choose one lead
   Technical design #16/#17 · construction #18 · estimating #19
   integration #20 · 3D #21 · rendering #22
   architectural concept #23 · interior concept #24
       │
       ▼
3. Develop options and decision criteria
   Concept work normally provides 2-3 options, pros/cons, selection criteria,
   and limits
       │
       ▼
4. Cross-check technical effects
   Separate code, structure, egress, fire safety, accessibility, services,
   material performance, buildability, and budget effects
       │
       ▼
5. Validate through modeling and visualization
   Check units, coordinates, geometry, materials, lighting, cameras, and
   outputs for distortion of the design intent
       │
       ▼
6. Hand off to construction and estimating
   Record drawings, specifications, quantities, rates, schedule, inspections,
   changes, and unresolved assumptions
       │
       ▼
7. Obtain final professional approval
   Qualified professionals and accountable project leads approve permits,
   structure, fire safety, electrical/mechanical services, safety, contracts,
   and final construction cost
```

The default is one lead persona and no more than two reviewing personas per request. Additional professionals may be included when code or safety requires them. If “design” alone does not identify architecture, interiors, or cross-discipline integration, the persona asks once; when the field is clear, #23 or #24 leads immediately.

A deliverable from one stage is never treated automatically as the approved deliverable for the next. Each handoff must re-check the required dimensions, performance, attributes, approvals, and price basis: mood board to finish schedule, render to construction drawing, 3D model to BIM deliverable, or preliminary estimate to contract price.

### Recommended workflow for image and video work

```text
1. Confirm purpose, platform, audience, and completion criteria
   → 2. Check source files, provenance, rights, software, and proficiency
   → 3. Set size, aspect ratio, duration, FPS, codec, and audio specifications
   → 4. Use #32 for images or #33 for video planning/production
   → 5. Use #34 for video post-production
   → 6. Use #35 to inspect the actual picture, playback, sound, and rights evidence
   → 7. Preserve master/distribution files, settings, sources, and approvals
```

A generation or export log alone is not completion evidence. Inspect images at full and delivery size; play the video or inspect representative frames, audio, and metadata. Label anything unavailable for inspection as `unreviewed`, and any unsupported rights claim as `unverified`.

### Recommended workflow for generative-AI tools and platforms

```text
1. Define the deliverable, quality target, budget, deadline, and rights constraints
2. Confirm whether the environment is local/self-hosted (#36) or hosted (#37)
3. Record the exact version, plan, hardware, nodes/models, source files, and protected elements
4. Back up or use Save As before changing an existing workflow or project
5. Verify availability, compatibility, privacy, current features, credits, and policy evidence
6. Run the smallest reversible test and capture logs, queue state, settings, and costs
7. Generate the intended result; do not equate installation, loading, or queue success with generation
8. Inspect the actual image/video and delivery metadata (#35), then correct quality or rights issues
9. Report confirmed facts, assumptions, unverified items, changed assets, cost, and rollback steps
```

Report these states separately: tool/access confirmed, model/node/workflow prepared, service reachable, content loaded, job queued or generated, output file present, actual result inspected, and rights/security/cost approval confirmed. Never paste API keys, session cookies, access tokens, billing details, or private source files into prompts or public workflow JSON.

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
4. Once confirmed, every affected file is edited in sync
   (persona-triggers/SKILL.md, persona_core.md, persona_marker.txt,
    a new skill folder, persona-format/SKILL.md, 2 reference docs,
    README.md/README.en.md, validate.mjs — the exact file count depends on the change)
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

`$persona-edit` changes only the required scope: one row for a base perspective, or the trigger/core/marker/dedicated skill/docs/validator locations affected by a domain persona. It then runs the same consistency check and explains how to refresh the installed cache.

---

## Architecture

### Understanding the plugin concept

A Codex "plugin" is a bundle made of these 4 pieces.

- **Marketplace**: a listing file (named marketplace.json) that tells Codex where a plugin comes from — either a GitHub repository or a folder path on your computer.
- **Manifest**: a file (named plugin.json) holding the plugin's name, version, and description.
- **Hook**: a small program that runs automatically at a specific moment (such as session start).
- **Skill**: a knowledge document that loads only in specific situations.

### Why this repository still has Claude Code files too

This project originally started as a plugin for Claude Code (a different AI coding tool) before being ported to Codex. As a remnant of that, `plugins/sodam-persona/.claude-plugin/plugin.json` and the root `.claude-plugin/marketplace.json` still exist, but **both exist only for compatibility with the earlier host and are not used at all during Codex installation.** Codex reads the marketplace definition from `.agents/plugins/marketplace.json` and the plugin manifest from `plugins/sodam-persona/.codex-plugin/plugin.json`. The Agent Plugins 1.0 format is preserved at `plugins/sodam-persona/compat/plugin.portable.json`. Keeping another manifest at the plugin root can cause current Codex versions to skip default hook discovery.

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
├── test-hooks.mjs                         # Hook execution, boundary, and recovery tests
├── test-validator.mjs                     # Validator failure-detection regression tests
├── diagnose.mjs                           # Source/install/hook/consistency diagnosis
├── plugins/sodam-persona/persona-registry.json # Structured source of truth for roles, patterns, domains, version, and hook cap
└── plugins/sodam-persona/                # The actual plugin body that gets distributed and installed
    ├── .codex-plugin/plugin.json         # Codex manifest (source of truth)
    ├── compat/plugin.portable.json       # Preserved Agent Plugins 1.0 format
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
    │   ├── persona-triggers/SKILL.md     # Full A-AQ trigger-word detail and the 37-perspective mapping table
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
    │   ├── persona-architectural-design-expert/SKILL.md # #23 architectural concept design domain
    │   ├── persona-interior-design-expert/SKILL.md # #24 interior concept design domain
    │   ├── persona-source-verification-expert/SKILL.md # #25 source search and verification domain
    │   ├── persona-research-analyst/SKILL.md # #26 research and analysis domain
    │   ├── persona-ideation-strategist/SKILL.md # #27 ideation and concept strategy domain
    │   ├── persona-project-manager/SKILL.md # #28 project delivery domain
    │   ├── persona-product-owner/SKILL.md # #29 product value and backlog domain
    │   ├── persona-pmo-governance-expert/SKILL.md # #30 PMO and governance domain
    │   ├── persona-project-analyst-coordinator/SKILL.md # #31 project analysis and operations domain
    │   ├── persona-image-production-expert/SKILL.md # #32 image production and editing domain
    │   ├── persona-video-production-director/SKILL.md # #33 video planning and direction domain
    │   ├── persona-video-post-production-expert/SKILL.md # #34 video post-production domain
    │   ├── persona-media-quality-rights-reviewer/SKILL.md # #35 media quality and rights review domain
    │   ├── persona-generative-ai-workflow-engineer/SKILL.md # #36 local generative-AI workflow domain
    │   ├── persona-generative-ai-platform-operator/SKILL.md # #37 hosted generative-AI platform domain
    │   ├── persona-create/SKILL.md       # Entry point for the new-persona creation interview
    │   └── persona-edit/SKILL.md         # Entry point for the trigger-editing interview
    ├── commands/
    │   ├── create.md                     # The procedure persona-create reads and follows
    │   └── edit.md                       # The procedure persona-edit reads and follows
    └── reference/
        ├── persona_full_core.md          # The full persona definition (for full L3 activation / session recovery)
        ├── built_environment_collaboration.md
        ├── media_production_collaboration.md # Shared inputs, handoffs, and conflict rules
        ├── generative_ai_tools_collaboration.md # Local/hosted generative-AI state, safety, cost, and handoffs
        └── test_scenarios.md             # A set of sample utterances for verifying trigger behavior
```

The `commands/` folder preserves the original Claude Code workflow text as an internal reference. Codex does not run these as slash commands directly; instead, the `persona-create`/`persona-edit` skills read and follow their content.

### The 15 checks performed by the automated consistency checker (`validate.mjs`)

This checker mechanically prevents number drift when adding perspectives or changing triggers. It uses only built-in Node.js modules and no external libraries.

| # | What it checks |
|---|---|
| 1 | Perspective numbers are continuous from 1 through the last entry |
| 2 | Labels such as "35 people" and "37 perspectives" match the actual count in every core file, skill, and README |
| 3 | The documented A-AQ trigger-pattern count matches the actual section count |
| 4 | The skill-folder count, README intro, and file map agree, and every skill frontmatter `name` matches its folder (including English README cross-checks) |
| 5 | All 26 domain personas are wired into the core and marker, while both READMEs agree on domain counts, explicit invocations, and major-section structure |
| 6 | The canonical Codex, preserved Agent Plugins 1.0, and legacy manifests plus both marketplace JSON files have valid names, versions, and source paths |
| 7 | Required disclaimers, qualified-review boundaries, and non-final estimate wording exist for all 26 domains |
| 8 | Warning only: generated HTML appears out of sync with current counts |
| 9 | Backtick-wrapped repository file references point to files that exist |
| 10 | No personal absolute path containing a developer account name leaked into distributed files |
| 11 | Codex hooks use `${PLUGIN_ROOT}`, point to existing scripts, and pair context-limit settings with the project cap |
| 12 | Domain-skill trigger lists match the canonical `persona-triggers` list |
| 13 | The serialized hook output stays below the project's 12,000-character cap |
| 14 | Core triggers match the canonical lists, and all nine built-environment skills share the collaboration protocol while avoiding broad single-word triggers and overlapping design roles |
| 15 | Every `persona-*` skill folder uses a path-safe name |

See [Commands](#commands) and [Troubleshooting](#troubleshooting) for how to run the checker and read its output.

### Continuous integration (CI)

`.github/workflows/validate.yml` is configured to run the consistency checker and both regression suites for pushes to `main` and pull requests. Whether a failed CI run blocks a merge depends on GitHub branch-protection settings.

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
| All 31 skills | `plugins/sodam-persona/skills/persona-*/SKILL.md` |
| The full trigger-word list and perspective mapping table | `plugins/sodam-persona/skills/persona-triggers/SKILL.md` |
| Details for all 26 domain experts | The 26 domain-specific `persona-*` folders under `plugins/sodam-persona/skills/` |
| The original procedure text for creating/editing personas | `plugins/sodam-persona/commands/create.md`, `edit.md` |
| The consistency-check script | Repository root, `validate.mjs` |
| The HTML-regeneration script | Repository root, `build-docs.mjs`, `doc-theme.html` |
| The Codex marketplace definition (source of truth) | `.agents/plugins/marketplace.json` |
| The Codex manifest (source of truth) | `plugins/sodam-persona/.codex-plugin/plugin.json` |
| Preserved Agent Plugins 1.0 / legacy Claude compatibility manifests | `plugins/sodam-persona/compat/plugin.portable.json`, `.claude-plugin/plugin.json` |
| Manual and automated test scenarios | `plugins/sodam-persona/reference/test_scenarios.md` |
| The CI (automated check) configuration | `.github/workflows/validate.yml` |

> Any folder not listed here (for example, local cache or scratch-note files created during development) is excluded from the repository via `.gitignore` and simply does not exist for anyone who freshly downloads this plugin, so this document does not cover it.

---

## Changelog Summary

Listed with the most recent entries at the top. Click (or tap) an item to expand its details.

<details open>
<summary><strong>2026-09-23 — Codex hook discovery and Windows execution compatibility (v1.10.2)</strong></summary>

- Made `.codex-plugin/plugin.json` the Codex manifest and preserved the Agent Plugins 1.0 file under `compat/`.
- Added Windows commands and a 30-second timeout to both hooks, with checks in the consistency validator.
- Installation, trust approval, and automatic injection during an ordinary prompt still require separate verification.

</details>
<details>
<summary><strong>2026-09-17 — Execution stability, diagnosis, and registry hardening (v1.10.1)</strong></summary>

- Added real hook-execution tests and validator failure-detection tests, then connected both to CI.
- Connected `persona-registry.json` as the structured source of truth for perspectives, patterns, domains, version, and the hook cap.
- Reduced serialized SessionStart output from 14,153 characters to below 12,000 and fixed the enforced cap at 12,000.
- Added `node diagnose.mjs` to report source/installed version drift, enabled state, hook execution, and repository consistency in one read-only command.
- In the final pre-release review, the committed HEAD was extracted into a separate directory and passed the full tests, documentation build, and plugin-structure validation again. The documentation was also corrected so that remote CI and browser visual checks that were not actually run are no longer described as completed.
- Rechecked the Apache License 2.0 text, third-party wording in NOTICE, external assets, dependencies, and sensitive data, then clarified that the project license does not guarantee rights in third-party material or external AI output.

</details>

<details>
<summary><strong>2026-09-16 — Added generative-AI tool and platform personas (v1.10.0)</strong></summary>

- Added a local/self-hosted generative-AI workflow engineer (#36) and a hosted generative-AI platform operator (#37).
- Separated local runtime, node, model, CUDA/VRAM, API, queue, and recovery work from hosted feature, account, plan, credit, upload/download, and policy work.
- Added regression checks against bare product-name activation, inflated years of product experience, secret exposure, current-feature guessing, and treating install/queue success as inspected media.

</details>

<details>
<summary><strong>2026-09-16 — Split image and video production responsibilities (v1.9.0)</strong></summary>

- Added image production/editing (#32), video production/direction (#33), video editing/post-production (#34), and media quality/rights review (#35).
- Separated 3D render setup (#22), still-image finishing (#32), walkthrough direction (#33), video output (#34), and actual quality/rights review (#35).
- Added regression protection against bare image/video/render false positives, assumed software expertise, and treating successful generation/export as actual review.

</details>

<details>
<summary><strong>2026-09-16 — Split project-management responsibilities (v1.8.0)</strong></summary>

- Added separate project manager (#28), product manager/product owner (#29), PMO/project governance (#30), and project analyst/operations coordinator (#31) personas.
- Narrowed #9 to lightweight planning and requirements routing, while AH-AK separate delivery, product, governance, and operations accountability.
- Added regression checks against bare PM/PO/PMO/PA abbreviations, Project Architect confusion, and invented completion percentages, schedules, or owners.

</details>

<details>
<summary><strong>2026-09-16 — Added search, research, and ideation personas (v1.7.0)</strong></summary>

- Added separate source search and verification (#25), research and analysis (#26), and ideation and concept strategy (#27) personas.
- Connected AE-AG triggers so simple search uses #25, comparison research uses #25+#26, and evidence-based ideation uses #25+#26+#27.
- Added false-positive exclusions for file, code, UI, database, and SEO search, casual praise, and IDE mentions, plus regression checks for the complete perspective, trigger-pattern, and skill counts at that release.

</details>

<details>
<summary><strong>2026-09-16 — Split architectural and interior design personas (v1.6.0)</strong></summary>

- Added separate architectural concept design (#23) and interior concept design (#24) personas.
- Narrowed #20 design director to cross-discipline integration, consistency, and approval criteria, while moving field-specific design triggers into AC and AD.
- Synchronized the boundaries among technical design (#16/#17), concept design (#23/#24), direction (#20), modeling, and rendering (#21/#22), including proficiency calibration and regression checks.
- Expanded beginner examples, the production handoff workflow, all 13 domain commands, troubleshooting, and FAQ to match the v1.6.0 structure.

</details>

<details>
<summary><strong>2026-09-16 — Added built-environment user proficiency calibration (v1.5.2)</strong></summary>

- Clarified that `15+ years` describes each persona's review depth, not the user's proficiency.
- Kept the user's architectural/interior 3D visualization industry experience separate from beginner-level design, construction, and estimating knowledge; proficiency is assessed per application, including Revit and Rhino.
- Added regression checks so design and construction guidance starts with plain-language context and visualization experience is never generalized to expert-level use of every 3D tool.

</details>

<details>
<summary><strong>2026-09-16 — Added drawing-work routing (v1.5.1)</strong></summary>

- Added pattern AB for drawing-related work, CAD/DWG, plans, elevations, sections, details, and shop drawings.
- Routes by purpose across architectural design, interior design, construction, estimating, and 3D modeling while separating non-building drawings and regulated work.
- Synchronized all perspectives, 28 patterns, 16 skills, hooks, documentation, and validation.

</details>

<details>
<summary><strong>2026-09-16 — Added 3D modeling and rendering specialist personas (v1.5.0)</strong></summary>

- Added separate 15+ year perspectives for 3D modeling (#21, including Revit and Rhino) and architectural/interior rendering and visualization (#22).
- Recognizes Korean and English modeling/rendering variants while preventing false activation for data modeling and web rendering.
- Synchronized multi-letter pattern IDs (Z then AA), all perspectives, 27 patterns, 16 skills, tool-state verification, and model-to-render-to-construction/cost handoffs.

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
- Added the Agent Plugins 1.0 root `plugin.json` as the canonical manifest while retaining `.codex-plugin/plugin.json` as a fallback. All three manifests reported version `1.5.1` at that release.
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
| You asked for architectural concept design, but only #20 appears or the new persona is missing | An install cache older than v1.6.0 is active, or the word “design” did not identify a field | Reinstall in the order above and start a new task; say “architectural massing and facade design” or explicitly invoke $persona-architectural-design-expert |
| An interior mood-board request is handled only as technical or general design | The installed copy is old, or the prompt did not identify interior atmosphere, materials, or color | In a new task, ask for “interior mood and material palette,” or explicitly invoke $persona-interior-design-expert |
| #25-#27 do not appear for a search, research, or ideation request | The installation cache predates v1.7.0, or the task intent is too vague | Reinstall the latest version, start a new task, and state the purpose as “verify official primary sources,” “compare and analyze cases,” or “propose evidence-based alternatives,” or invoke the relevant skill directly |
| Image/video work only activates general design or rendering roles | The install cache predates v1.9.0, or the prompt only says image/video without an action | Reinstall and ask for image compositing, walkthrough storyboards, video editing, or quality/license review, or invoke #32-#35 |
| ComfyUI or another local generative-AI tool is installed, but #36 does not appear | The install cache predates v1.10.0, or the request only names a product without an action | Reinstall the latest plugin and ask for installation, workflow editing, node/model diagnosis, CUDA/VRAM repair, API/queue work, or explicitly invoke `$persona-generative-ai-workflow-engineer` |
| Midjourney, Higgsfield, or Runway advice is outdated or #37 does not appear | The feature, plan, credits, or policy changed, or the request only names a platform | Ask for current official verification and provide the observed screen or URL when available; invoke `$persona-generative-ai-platform-operator` if needed |
| A server responds or a job is queued, but there is no verified output | Reachability, loading, queueing, generation, file existence, and actual inspection were collapsed into one state | Report each state separately, open the actual output, and run #35 quality/rights review before completion |
| Generation/export succeeds, but the output is broken or will not play | A completion message was mistaken for actual visual/audio review | View the image and play the video through while checking sync, captions, and loudness before marking it complete |
| A project-management request only uses #9, or #28-#31 do not appear | The installation cache predates v1.8.0, or the request only used an ambiguous abbreviation | Reinstall the latest version and state the accountability as “manage project schedule and risk,” “prioritize the product backlog,” “design PMO approvals,” or “track action items,” or invoke the relevant skill directly |
| PM, PO, or PA is interpreted as the wrong role | These abbreviations vary by organization and industry and are excluded from automatic activation | Write the full role, such as Project Manager, Product Owner, Project Analyst, or Project Architect, plus the expected result |
| Search output has no primary-source link or verification date | Internet/browser tools are unavailable, or the primary source is blocked | Require an explicit “search unavailable/source unverified” label, then provide the URL, PDF, or source yourself, or rerun in an environment with search access |
| “Review this drawing” does not produce the review you expected | Drawing type, project stage, purpose, or source format is missing, so router AB cannot choose a lead | Provide the type (plan/detail/shop drawing), purpose (technical design/concept/construction/estimate/BIM), format (DWG/PDF/RVT), and latest version |
| Revit, Rhino, D5, or another application is not controlled automatically | The persona provides judgment, procedures, and review criteria; it is not itself a remote-control integration for those applications | Ask for steps, settings, export formats, or a QA checklist. Actual control requires the user or a separate tool integration with permission |
| Typing `node` in the terminal gives a "command not recognized" error | Node.js isn't installed, or the terminal wasn't reopened after installing it | Install from `nodejs.org`, then close every open terminal window and open a new one |
| `node build-docs.mjs` says "pandoc is not installed" | Pandoc is missing | Only needed if you're editing the documentation yourself. If you're just *using* the plugin, this error is safe to ignore. To fix it, install from `pandoc.org/installing.html` |
| `codex plugin marketplace add sodam-ai/SoDam-Persona-Codex` fails with a network error | Git isn't installed, the repository name is mistyped, or a firewall/proxy is blocking it | Check Git with `git --version`, double-check the repository name's spelling, and check proxy settings if you're on a corporate/school network |
| `node validate.mjs` prints `❌ FAIL` | Some number — perspective count, trigger count, skill count, etc. — has drifted out of sync, usually while adding or editing a persona | Read the printed error list line by line, open the referenced file, and fix the number, then rerun. See the "15 checks" table in [Architecture](#architecture) for what each numbered check means |
| An actionable investment, accounting/tax, or legal answer is missing its disclaimer | Likely a defect | Reinstall the latest version and retry in a new task. If it persists, file a GitHub Issue with the prompt and version, and run `validate.mjs` check #7 |
| A path-related error appears when typing a command into Windows PowerShell | Quotation marks or backslashes changed while being retyped by hand | Copy this document's code blocks and paste them directly instead of typing them manually |
| The persona feels like it has drifted after a long session | The hook may not have run in that environment, or its marker may not have been followed | Check `codex plugin list`, reproduce in a new task, then report `node diagnose.mjs` results and the prompt in an Issue |

---

## Frequently Asked Questions (FAQ)

**Q. Is this plugin free?**
A. This repository charges no separate plugin fee and is published under Apache License 2.0. Codex/OpenAI subscriptions, usage charges, and internet access can still cost money. See [Legal, Copyright, License, and Commercial Use](#legal-copyright-license-and-commercial-use).

**Q. Can it delete or change files on my computer on its own?**
A. No. Aside from reading 2 fixed text files inside the plugin folder, the hooks never write or delete any file. Irreversible actions such as deletion or deployment are always designed to ask the user for confirmation first. See [Security & Data Flow](#security--data-flow) for details.

**Q. Do I need an internet connection?**
A. Codex itself needs the internet to talk to an AI model. The plugin's hooks themselves only read local files and don't make any separate network connection.

**Q. Can I use the accounting/tax or legal answers instead of consulting a real professional?**
A. No. This persona is not an actually licensed tax accountant, CPA, or lawyer. It provides reference information only; consult a real professional before an actionable decision (filing, contract interpretation, etc.). The rules require a disclaimer, but users should check whether it appears in each actual answer.

**Q. Does it work with Claude Code too?**
A. Legacy compatibility files (`.claude-plugin/`) still remain in the repository, but this project is currently **maintained for Codex only**, and new features and trigger updates are made against the Codex manifest. Up-to-date behavior on Claude Code is not guaranteed.

**Q. Can I install it on multiple computers?**
A. You can install it on multiple computers, but behavior may differ with Codex version, account permissions, Node.js, organization policy, and installed plugin version. Run [Verify the installation](#verify-the-installation) on each computer.

**Q. What is the difference among image production (#32), video direction (#33), video post-production (#34), and media review (#35)?**
A. #32 creates and finishes still images. #33 designs the message, storyboard, shots, camera movement, and source generation. #34 edits cuts, captions, audio, color, and deliverables. #35 reviews actual quality and evidence for provenance, consent, and licenses. #22 owns 3D render-scene settings.

**Q. Is an image or video complete as soon as a file is generated?**
A. No. Inspect the actual image and play the video. Anything not inspected is unreviewed. If provenance, consent, music, font, or model licensing is unclear, public, advertising, sales, or client-delivery use cannot be confirmed.

**Q. What is the difference between #36 and #37?**
A. #36 owns local or self-hosted runtimes such as ComfyUI: installation, Python, GPU/CUDA/VRAM, models, nodes, workflow JSON, APIs, queues, logs, preservation, and recovery. #37 owns hosted platforms such as Midjourney, Higgsfield, and Runway: current features, accounts, plans, credits, uploads, downloads, cost, and policy evidence. #32-#35 still own creative production, editing, actual quality, provenance, consent, and license review.

**Q. Does a paid plan automatically allow commercial use of generated output?**
A. No. A paid plan alone does not prove commercial permission. Check the current service terms, plan-specific rights, input-asset licenses, model or checkpoint license, third-party music/font rights, consent and publicity rights, trademarks, and client contract. Record the source and verification date instead of guessing.

**Q. What is the difference among the project manager (#28), product owner (#29), PMO (#30), and project analysis/operations (#31)?**
A. #28 integrates schedule, budget, resources, and risks to deliver the project. #29 decides user value and product-backlog priorities. #30 governs standards, approvals, and the portfolio across projects. #31 keeps meetings, decisions, actions, requirements, and status data traceable. Using the full role name and expected output is safer than a bare abbreviation.

**Q. What is the difference between search (#25), research (#26), and ideation (#27)?**
A. #25 finds credible material and checks the primary source, date, and version. #26 defines research questions and comparison criteria, then derives conclusions and information gaps from multiple sources. #27 creates alternatives and designs evaluation and experiments. For evidence-based ideas, all three work in sequence. If search tools are unavailable, the plugin states the limitation instead of inventing sources.

**Q. Does experience in 3D visualization make me an expert in design, construction, and estimating?**
A. No. Visualization-industry experience is used only as background for discussing form, materials, light, and camera intent. Technical design, construction, and estimating are explained from beginner level, and proficiency is checked separately for Revit, Rhino, 3ds Max, Blender, SketchUp, and every other application.

**Q. What is the difference between architectural technical design (#16) and architectural concept design (#23)?**
A. #16 handles site planning, code, permits, areas, egress, and design documents. #23 handles concepts, massing, form, facades, and exterior materials. They review each other on a real project, but one role leads each request. The same distinction applies to interiors: #17 leads technical design, while #24 leads atmosphere, materials, color, and furniture composition.

**Q. Can I use a render or mood board directly as a construction standard?**
A. No. Renders and mood boards communicate intent and atmosphere. Construction also needs dimensions, exact material/product identification, performance, joints and fixings, building-services coordination, specifications, approved drawings, and site verification.

**Q. Must I be an expert in Revit, Rhino, 3ds Max, Blender, SketchUp, Cinema 4D, D5, Twinmotion, Unreal, and Unity?**
A. No. The plugin never infers user proficiency from an application name. For a first-time application, ask for installation, screen location, and click-by-click steps. For a familiar application, ask for coordinates, units, attributes, conversion, and quality checks.

**Q. I want to add or change trigger words myself.**
A. Call `$persona-edit` (to edit an existing perspective) or `$persona-create` (to add a completely new field of expertise) and follow the interview. See [How to Use](#how-to-use) and [Workflow](#workflow).

**Q. The persona answers too long / too heavily.**
A. Mixing in words like "briefly", "in short", or "just the key point" switches it to a short format immediately. This rule has the highest priority of all.

**Q. I actually want it to go deeper and more thorough.**
A. Using expressions like "objectively", "in depth", "thoroughly", or "full persona version" brings all 37 perspectives into the review.

**Q. I found a bug or something misbehaving. Where do I report it?**
A. Please report it through the repository's GitHub Issues feature. Including a reproducible example of what you typed speeds up diagnosis a lot.

**Q. Can I take this plugin's code and put it into my own commercial product?**
A. Yes, the Apache License 2.0 explicitly allows this. There are a few conditions, though — including a license copy, marking changed files, and keeping notices intact. See [Legal, Copyright, License, and Commercial Use](#legal-copyright-license-and-commercial-use) for the conditions. This is a plain-language summary, not legal advice.

**Q. Is this an official feature made by OpenAI?**
A. No. This project has no affiliation with or sponsorship from OpenAI. It's an independent community plugin. "Codex" and "OpenAI" are trademarks of their respective owners, used in this document purely to refer to those products (nominative use).

**Q. If a long session gets compacted, or goes through a sub-agent, does the persona disappear?**
A. The `UserPromptSubmit` hook is designed to re-inject its marker when that event is delivered. Delivery through compaction, sub-agents, and every Codex environment is unverified, so automatic recovery cannot be guaranteed. Check it in a new task.

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
| Include relevant `NOTICE` attributions | Because the original contains a `NOTICE`, section 4(d) of Apache License 2.0 requires readable attribution notices relevant to the part distributed (`NOTICE`, documentation, or a display). Check the original text and what applies |

And it is important to be clear about what is **not** guaranteed (a summary of the original's sections 7 and 8).

- This software is provided **"AS IS,"** without any warranty of any kind, including merchantability or fitness for a particular purpose.
- Section 8 limits liability except where applicable law requires otherwise or a separate written agreement applies. It is not a guarantee that liability is impossible in every jurisdiction and situation.
- Assessing the suitability of using or redistributing this software, and bearing any resulting risk, is entirely the user's own responsibility.

### What Apache License 2.0 actually covers

**One-line beginner summary**: Even though this repository states Apache License 2.0, that license applies only to rights that SoDam AI Studio and each contributor can lawfully grant. It does not automatically clear someone else's writing, trademarks, images, customer material, or AI-service output.

| Material | Current verified status | What to do before public or commercial use |
|---|---|---|
| Code, documentation, prompts, and rules written for this project | Apache License 2.0 is stated. The legal identity of the copyright holder, contributor transfers, and the chain of title for AI-assisted material were not independently proven | Keep `LICENSE` and relevant `NOTICE` attribution, and mark modified files prominently. Client delivery that requires a rights warranty needs **legal/professional review** |
| Three third-party wordings remaining in `persona-triggers` | Provenance is identified, but separate permission, a license, or the applicability of a quotation exception in each jurisdiction was not verified | Before public or commercial redistribution, record a lawful basis such as permission, an applicable license, or a quotation exception. If that basis is unclear, **legal/professional review is required** |
| Product, company, and trademark names | Only text needed to describe compatibility and provenance is present; no logo file is bundled | Do not imply affiliation, sponsorship, or official approval, and use the names only as reasonably needed to identify the products or sources |
| Inputs and outputs from external AI services such as Codex | This project's Apache License 2.0 cannot guarantee ownership or commercial-use rights in those materials | Check rights and consent for the input, output similarity and infringement risk, and the latest terms and policies for the applicable account type |
| Customer files, internal documents, and personal data supplied by the user | No real material of this kind is currently stored in the repository, but users may provide it after installation | Confirm authority to upload and process it, confidentiality duties, a lawful privacy basis, and customer consent first |

Listing a source in `NOTICE` is **attribution**, not a new permission to use third-party material. Also, under Section 5 of Apache License 2.0, a contribution intentionally submitted for inclusion in the project may be treated as submitted under the same license unless it is clearly designated otherwise or covered by a separate agreement. Contributors must submit only material they are authorized to provide.

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
- Whether reselling or reusing Codex's responses in a commercial service has any separate conditions attached
- Terms for individual services: `https://openai.com/policies/terms-of-use/`
- Services agreement for businesses, developers, and API use: `https://openai.com/policies/services-agreement/`
- Usage policies: `https://openai.com/policies/usage-policies/`
- Privacy policy: `https://openai.com/policies/privacy-policy/`
- Official plugin installation and permission guidance: `https://help.openai.com/en/articles/20001256/`

These links and policies can change, so check them again at the actual time of use, distribution, or client delivery.

### Repository asset and external-dependency review

Here is the result of scanning this repository's entire code and documentation (as of 2026-09-23, based on all 64 Git-tracked files).

| Check | Result |
|---|---|
| Dependency manifests such as package.json, package-lock.json, pnpm-lock.yaml, yarn.lock, requirements.txt, pyproject.toml, Cargo.toml, go.mod | **Zero found** repository-wide — no external package dependency bundled into the distribution was found |
| Image/icon/font/video/audio files (png, svg, ico, woff, ttf, mp4, mp3, etc.) | **Zero found** repository-wide |
| assets, public, static, samples, examples, fixtures folders | **Zero found** repository-wide |
| Sample accounts, email addresses, phone numbers, real user-home paths, or real customer data | **Zero real-data items found** in the 64 Git-tracked files. One generalized fake Windows user-path string exists only in a negative validator test that must fail in order to pass |
| Local work records (`.omc`, `.omx`, `.remember`, `.plugin-config`, `CHECKPOINT.md`, etc.) | Excluded from distribution by `.gitignore`; do not include them when manually creating an archive |
| Whether the hook scripts (inject-core.js, inject-marker.js) use any external package | They use only Node.js built-in modules — **zero** external package imports/requires |

No additional license duty was identified from images, fonts, or external packages included in the current repository. Separately installed tools such as Node.js, Pandoc, and Codex remain subject to their own licenses and terms. Re-run this review whenever assets or dependencies are added.

### Commercial use summary

**One-line summary for absolute beginners**: the project code and documentation covered by Apache License 2.0 may be used as-is, modified, forked, redistributed, sold, operated as a service, used in education, or delivered to a client. Trademarks, third-party quotations, AI output, material you add, external-service terms, and actual ownership remain separate checks.

**Current publication/delivery status**: Three third-party passages in `plugins/sodam-persona/skills/persona-triggers/SKILL.md` have attributed sources, but permission, license coverage, or an applicable quotation exception has not been verified. Do not describe public redistribution, resale, or client delivery of the repository containing these passages as rights-cleared. Confirm and record the rights basis or obtain legal/professional review before deciding. This is an unresolved third-party-rights issue, not an additional condition on Apache License 2.0.

| What you want to do | Allowed under Apache 2.0? | Conditions and separate checks |
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
| **Must Have** | Provide `LICENSE`, carry applicable `NOTICE` content, mark modified files, avoid implied trademark affiliation, and verify external-service terms, privacy duties, and permission for customer material. Before public redistribution, resale, or client delivery, also confirm and record a rights basis for the three third-party passages or obtain legal/professional review |
| **Should Have** | Record the exact sources and applicable scope of third-party quotations, and document the legal copyright-holder name, contributor assignments, and ownership chain for AI-assisted material |
| **Could Have** | Obtain lawyer review of client contracts, warranties, indemnities, and country-specific regulation, and retain a release-by-release external-material list or SBOM |

### What you must not do (summary)

- Impersonate the "SoDam"/"sodam-ai" brand name as if it were something you created, and distribute it that way
- Redistribute a modified version without including a license copy and the NOTICE notices
- Make a filing, contract, or investment decision based solely on the accounting/tax, legal, or investor domain persona's answer, without an actual professional's confirmation
- Reuse third-party copyrighted material that may be embedded in Codex's generated output commercially, as-is, without checking its source

If you have a specific situation in mind, please read the `LICENSE` and `NOTICE` originals in the repository directly, and consult a lawyer for any commercial-redistribution scenario you're not fully certain about.
