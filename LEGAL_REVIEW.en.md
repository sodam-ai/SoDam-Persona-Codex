# Legal and rights review record

Reviewed: 2026-10-09. Scope: current SoDam-Persona-Codex working tree. Reference only; legal effect is not guaranteed. The user remains responsible and should consult counsel. This is not legal advice or a rights warranty.

## Verified facts

- Current source: the user-designated SoDam-Persona-Codex checkout, branch main, with pre-existing tracked changes, additions and a deleted legacy manifest. This review does not commit, push, release, change remotes, or update installed plugins. Earlier distribution descriptions are not evidence of current delivery.
- Inspected 95 existing distribution candidates: tracked files plus non-ignored untracked files. All are text files; none exceeds 1 MiB. There are two JS and thirteen MJS files. Imports refer to Node built-ins (including fs/path without a node: prefix) or local project modules; no external npm import was found.
- No package/dependency manifests or lockfiles, or assets/public/docs directories, were found in these candidates. Dependency license scanning is not run: there is no project package inventory to scan. No bundled images, icons, fonts, video, audio, model weights or sample-account files were found. HTML names system fonts but does not distribute font files or fetch a web font.
- Node.js, Codex, Git and Pandoc are separately installed tools. CI invokes checkout/setup-node and installs Pandoc externally. No corresponding vendor binary/source bundle is in these candidates. Their terms, account policies and transitive dependencies must be reviewed separately if bundled, modified or used in a customer product.
- The current Apache License is Version 2.0, January 2004. Sections 1–9 in LICENSE match the official downloaded text after whitespace normalization; the appendix states Copyright 2026 SoDam AI Studio. LICENSE was preserved. The stated holder and year are project notices, not independently verified title evidence.
- Existing NOTICE was preserved. It records three historical quotations/paraphrases; those passages are not present in current persona-triggers. Attribution alone is not permission. Restoring or distributing historical versions requires separate review.
- Product names and public provenance links exist; no logo asset was found. Trademark permission or affiliation is not established. Test fixtures mention hypothetical roles, tools and situations; their wording is not evidence of actual customers, professional credentials or cleared third-party rights.
- Candidate scans found no private-key headers, common provider tokens or password-bearing database URLs. All checked relative Markdown links resolve. These results do not exclude every kind of personal/confidential material, rights infringement or unseen binaries. Ignored local records and Git history were not rescanned in this review. Keep CHECKPOINT.md, private evaluations and local settings out of distribution; never publish the entire working folder without reviewing its contents.

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

## Pre-delivery conditions

- Must Have: include LICENSE and applicable NOTICE attribution in the actual plugin/archive/client package, not merely in the repository. Modified files require prominent change notices under section 4(b); this review does not certify every pre-existing changed file as compliant. Check that condition per file before delivery.
- AI assistance may have contributed code, instructions or documents. Check provenance, similarity, input authority and commercial-use conditions before final use. Apache licensing alone does not establish copyright ownership or warrant non-infringement of outputs.
- No extra restriction has been added to Apache 2.0. Additional customer warranties, support or indemnity are separate contractual decisions; assess section 9 and obtain legal/professional review when material.
- API pricing, model policies, service terms and added media/font/icon licenses must be checked for the actual provider, account, version and use date. No provider-wide commercial clearance is asserted.

Modification notice: 2026-10-09 refreshed the actual candidate inventory, license comparison and delivery limits.
