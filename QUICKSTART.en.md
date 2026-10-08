# Quick Start
The plugin adds judgment rules to Codex; it is not a separate AI. Codex and Node.js are required. Do not put API keys in this project.

## 1. Check installation
Run each command separately in PowerShell (the window where you type commands).

```powershell
node --version
codex --version
codex plugin list --json
```

If not installed, read the detailed README prerequisites first. GitHub commands install the public default branch, which may differ from this local candidate.

```powershell
codex plugin marketplace add sodam-ai/SoDam-Persona-Codex
codex plugin add sodam-persona@sodam-persona
```

## 2. Check in a new conversation
Open a new empty Codex conversation and enter this exact prompt.

```text
도면과 BIM 모델의 치수·단위·개정 불일치를 어떤 순서로 검토할지 설명해줘. 파일은 수정하지 마.
```

Check that the first-line perspective indicator and explanation concern CAD/BIM consistency. The indicator alone does not mean files were inspected. In another fresh conversation, test:

```text
ComfyUI라는 이름은 인용만 했어. 설치나 워크플로우 작업은 제외하고 이 단어의 표기만 알려줘.
```

The response must not start ComfyUI specialist work or installation. Omitting the indicator is correct when the user requires JSON-only output.

## 3. Diagnose from the project folder
Run these commands in PowerShell opened at the project folder.

```powershell
node diagnose.mjs --json
node diagnose.mjs --home "$env:USERPROFILE/.codex_runtime" --json
```

The first checks the CLI home; the second explicitly specifies the Desktop home used on this PC. Verify the actual path in other environments. If `ok: false`, inspect version, cache, permissions and registration. Automatic hook execution and actual response quality remain separate unverified states.

## 4. If something fails
Do not delete or forcibly overwrite existing folders, settings or models. Record the error category, version and failed stage; do not publish API keys, tokens or private conversations. See README and LEGAL_REVIEW.en.md for recovery and licensing conditions.

## Rights before sharing or selling

Commercial use is permitted where Apache 2.0 lawfully applies, subject to its conditions. Include [LICENSE](LICENSE) and applicable [NOTICE](NOTICE) in actual redistributed files; mark changed files prominently. Check external material, AI outputs and provider/account terms separately. No warranty of ownership or non-infringement is made. See [legal review](LEGAL_REVIEW.en.md) for unverified facts and legal/professional review needs.
