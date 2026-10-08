# 1.11.2 local improvement verification

Date: 2026-10-09 (Korea time). Source candidate 1.11.2 is distinct from installed/public distributions. This does not guarantee error-free behavior for every future input.

## Changes and reasons
- Preserved 45 roles, 39 skills and two hooks while unifying common and activation authority. The validator rejects reintroduced obsolete authority or 37-perspective guidance.
- Replaced legal/investment wording substitution and blanket logging/OS protection mandates with conditional checks. Financial auditing and software audit responsibilities are distinguished. Legal interpretations require legal/professional review.
- Separated personal-preference examples from public defaults without revoking previously approved preferences.
- Diagnosis separates JSON registration, exact version, cache-file SHA-256 and installed-hook responses. Different cache code is not executed.
- Added actual response tests, bilingual beginner/development guidance, MD/HTML body and bilingual structure checks. Unit and document checks are connected to CI.

## Executed checks
```powershell
node validate.mjs
node --test test-hooks.mjs test-validator.mjs test-supplemental.mjs test-diagnose.mjs test-evaluate.mjs test-docs.mjs
node build-docs.mjs
node check-docs.mjs
```
Consistency PASS, unit/regression tests 47/47 PASS, Korean/English README HTML generation and body/heading/toggle checks PASS. Local Node.js was 26.7.0; CI declares Node.js 20. The updated remote GitHub CI has not been executed.

## Actual AI tests
Ran separate fresh Codex conversations with candidate instructions explicitly supplied. This differs from automatic installed-hook testing. Prompt hashes, start/end timestamps and actual responses were recorded privately; responses were read and reviewed. Automated scores and review opinions are separate.

| Case | Actual selection/format | Reviewed scope |
|---|---|---|
| R11-positive | #11 | Contract text/jurisdiction needed; redact private data; unverified/legal limits |
| R13-positive | #13 | Loss, overfitting, missing data and no future-return guarantee |
| R14-positive | #14 | Expense evidence, applicability, missing data and professional confirmation |
| R43-positive | #43/#17/#18/#19 | Construction, services, quantities, cost, schedule and qualification boundaries |
| R44-positive | #44/#33 | Spatial value and customer inquiry; effectiveness remains a hypothesis |
| R45-positive | #45/#1/#42 | Drawing CLI preservation/failure handling; implementation explicitly not executed |
| R42-positive | #42 | Drawing/unit/revision comparison; no completion claim without actual files |
| KO-R36-quoted | No specialist role | Translation only; no domain operation started |
| KO-R42-excluded | No specialist role | Wording only; no drawing review started |
| FORMAT-natural | First-line indicator PASS | CAD/BIM perspective matches the explanation |
| FORMAT-no-indicator | No indicator PASS | Explicit omission and one-sentence request honored |

Executed nine of 270 routing fixtures plus two separate formatting cases. This is response-level review of these 11 cases, not validation of all domain operations or professional correctness. Initial sandbox failures were preserved; after identifying app-server initialization permissions, separate runs reverified the cases.

## Diagnosis, security and review
- Separate CLI/Desktop home diagnoses detected installed 1.11.1 versus candidate 1.11.2 and did not report a matching installation.
- Scanned 92 public files for private keys, representative provider keys, credential-bearing DB URIs and long credential assignments: zero findings. This does not prove the absence of every secret or personal-data form. Private memory folders and complete historical Git objects were outside this scan.
- Code review found concurrent-result overwrite risk and false acceptance of body indicators/empty omitted-indicator responses. Both were corrected and rechecked with counterexamples.
- Preserved original branch, remotes and pre-existing uncommitted work. Settings, AGENTS.md, personal memory, models and installed files were not automatically changed.

## Unverified scope and delivery
The remaining 261 routing fixtures, automatic Desktop hooks, long conversations/compaction, multiple OSs/Node.js 20, external services and actual drawing/media work, overall visual/performance/legal suitability remain unverified. GitHub push, PR, Release and installation updates were not performed. Follow [Development](DEVELOPMENT.en.md) to assess verification scope before a separate delivery step.

## Additional final-candidate verification — 2026-10-09

This section records additional work after the earlier tests above. It updates the earlier 261 unexecuted routing cases without guaranteeing professional correctness or automatic Desktop application.

- `node validate.mjs`, `node --test test-hooks.mjs test-validator.mjs test-supplemental.mjs test-diagnose.mjs test-evaluate.mjs test-docs.mjs`, `node check-docs.mjs`: final 53/53 tests passed, zero failures or skips, on Windows / Node.js 26.7.0. Separate lint/type-check configurations are absent; those checks were not run.
- Fresh CLI conversations explicitly supplied candidate instructions for 270 routing and two formatting cases. The first full run passed all 272. After subsequent fixes, a full rerun passed 270 initially and encountered two CLI execution failures. Original failed records for `R05-quoted` and `KO-R28-quoted` were preserved; separate retries with identical input hashes passed. Causes of the initial execution failures remain unverified. After the final marketing wording change, six related cases passed. All 272 were not rerun after that final marketing change.
- Automated scoring checks role selection and output format. Some response bodies were manually reviewed, but professional correctness of every answer remains unverified. These runs do not establish actual drawing/media execution or automatic execution of installed hooks.
- Fixed diagnosis incorrectly rejecting two skills generated from command documents by Codex 0.160.1. Only two byte-exact reconstructions from the source are accepted; altered or unknown extra files still fail. Isolated installation, removal, reinstallation and installed-hook execution passed. Global installation was preserved; installed 1.11.1 versus candidate 1.11.2 remains a mismatch.
- Corrected standalone-product activation, forced financial collaboration, routing generic implementation to data/AI, and expanding marketing collaboration from context alone. Collaboration now depends on actual requested responsibilities. Tax deadlines and retention periods require official evidence applicable to jurisdiction, year and business type. Added regression counterexamples.
- Opened both README HTML files in existing Edge at 375/768/1280px to check horizontal overflow, internal anchors, the first disclosure toggle and console/page errors: six flows passed. Isolated document builds matched existing HTML SHA-256 values. Physical mobile devices, other browsers and visual inspection of every page section remain unverified.
- Twelve hook boundary checks covered empty/malformed JSON, approximately 11 MiB Unicode and 5 MiB input without echoing input text. Duplicate result records and invalid output paths failed while preserving existing files. CLI requests from an unauthenticated isolated home were blocked by authentication failure. Sustained load, memory performance and other-user permissions remain unverified.
- Scanned 95 current public-target files and reachable Git text history across 84 commits for representative secret patterns: zero findings. This does not guarantee absence of every personal-data/secret form or cover historical binaries and unreachable objects. Scanned public files had no risky extensions or files over 10 MiB. One already-planned deleted legacy manifest was recorded as absent.
- This project has no web login, DB, API server or payment implementation, so corresponding CRUD/server-log tests are not applicable. Full external Codex login UI, authorization policies, automatic Desktop hooks, long conversations, Linux/Node.js 20 and remote CI were not run or remain unverified.
- Final public-deployment judgment is deferred pending investigation of initial CLI failures and automatic Desktop application. This verification did not perform commit/push/PR/Release or global installation updates.
