# Legal and rights review record

Reviewed: 2026-10-09. Scope: current SoDam-Persona-Codex working tree. Reference only; legal effect is not guaranteed. The user remains responsible and should consult counsel. This is not legal advice or a rights warranty.

## Verified facts

- During the earlier rights review of the D: source, the branch was main with pre-existing changes. That documentation review ended without committing or pushing. The subsequently authorized delivery uses a separate branch from current remote main and includes indicator guidance, regression checks, and documentation.
- Before editing, 79 distribution candidates (existing tracked files and non-ignored untracked files) were inspected. Imports in two JS and six MJS files use Node built-ins; no external npm package imports were found.
- No package.json, lockfiles, requirements.txt, pyproject.toml, Cargo.toml, go.mod, or assets/public/docs directories were found in the candidates. Dependency license scanners were not run because no project dependency inventory exists. Recheck if dependencies are added.
- Candidates are text files. No bundled images, icons, font files, video, audio, model weights, or sample account files were found. HTML references system font names and does not bundle font files.
- Node.js and the documentation converter Pandoc are separately installed tools. GitHub Actions checkout/setup-node are external execution tools. Their source and binaries are not bundled here. Bundling them into another product requires reviewing their licenses and transitive dependencies separately.
- LICENSE contains sections 1–9 and the appendix of Apache License, Version 2.0, and states Copyright 2026 SoDam AI Studio. Official guidance identifies the English text as authoritative. LICENSE was not changed.
- The three historical third-party passages were not found in current persona-triggers. NOTICE provenance was retained; present-inclusion wording was corrected to historical attribution.
- Product and brand names and public provenance links exist. They do not establish permission to distribute logos or imply official affiliation; trademark clearance is not guaranteed.
- No private-key headers, common provider token patterns, or password-bearing database URL patterns were found in distribution candidates. Pattern scanning cannot exclude every form of personal or confidential information. .remember, internal records, excluded local folders, and complete Git history remain unverified. Do not distribute a ZIP of the entire working folder; recheck the exact candidate list.

## Beginner use boundaries

Where lawfully applied, Apache 2.0 permits use, modification, copying, forks, sale, service operation, education, and client delivery. Public forks and handing files to clients are redistribution: provide LICENSE, applicable NOTICE attribution, retained original notices, and prominent change notices in modified files. Charging money itself is not prohibited. Trademark permission, external content rights, and non-infringement of AI output are separate matters.

Do not add others' material without permission, publish customer documents/personal data/keys, falsely claim affiliation or professional credentials, remove required notices, or warrant unverified rights. This list explains separate rights and contractual risks; it adds no new license restriction.

## Checks and priorities

- Must Have: verify exact distribution files and modification notices, LICENSE/NOTICE inclusion, provenance/similarity/commercial rights of AI-generated material, customer-data authority, and API account pricing/terms/model policies at actual use time. Keep separate evidence for added fonts, images, icons, and templates.
- Should Have: retain per-release file and third-party inventories, contributor submission authority, and excluded-file and Git-history secret reviews.
- Could Have: separately agree on client delivery, warranty, support, and indemnity terms. Under Apache 2.0 section 9, assume additional obligations only on your own behalf and responsibility, not on behalf of original contributors.

## Legal/professional review required

The legal rights holder behind SoDam AI Studio, contributor assignments, and title chains for AI-assisted material remain unverified. Professional qualifications and jurisdictional regulation, privacy processing, client non-infringement warranties, and lawfulness of restored historical quotations need case-specific review. Account-specific external API/model/service compliance was not established by this static audit. Disclaimers do not eliminate unlawful conduct or contractual liability.

## Evidence and rechecks

[Official Apache text](https://www.apache.org/licenses/LICENSE-2.0), [LICENSE](LICENSE), [NOTICE](NOTICE), [English README](README.en.md), [Korean review](LEGAL_REVIEW.md).

Modification notice: 2026-10-09 added rights review and distribution boundaries.
