# 쉬운 시작 안내
플러그인은 별도 AI가 아니라 Codex에 판단 규칙을 제공하는 부가 기능입니다. Codex와 Node.js가 필요합니다. API 키를 이 프로젝트에 넣지 마세요.

## 1. 설치 상태 확인
PowerShell(명령어를 입력하는 창)에서 아래 명령을 한 줄씩 실행합니다.

```powershell
node --version
codex --version
codex plugin list --json
```

아직 설치하지 않았다면 상세 조건을 README에서 확인하고 실행합니다. GitHub 명령은 공개 기본 브랜치를 설치하며 이 로컬 후보와 다를 수 있습니다.

```powershell
codex plugin marketplace add sodam-ai/SoDam-Persona-Codex
codex plugin add sodam-persona@sodam-persona
```

## 2. 새 대화에서 확인
Codex에서 새 빈 대화를 열고 다음 문장을 그대로 입력합니다.

```text
도면과 BIM 모델의 치수·단위·개정 불일치를 어떤 순서로 검토할지 설명해줘. 파일은 수정하지 마.
```

응답 첫 줄의 실제 관점 표시와 설명 내용이 CAD·BIM 정합성에 맞는지 확인합니다. 표시가 있다는 사실만으로 파일을 검토했다고 판단하지 마세요. 이어서 별도 새 대화에서 아래 문장도 시험합니다.

```text
ComfyUI라는 이름은 인용만 했어. 설치나 워크플로우 작업은 제외하고 이 단어의 표기만 알려줘.
```

ComfyUI 전문 작업을 시작하거나 설치하지 않아야 합니다. JSON만 출력하라는 요청에서는 관점 표시를 생략하는 것이 정상입니다.

## 3. 프로젝트 폴더에서 진단
프로젝트 폴더를 연 PowerShell에서 실행합니다.

```powershell
node diagnose.mjs --json
node diagnose.mjs --home "$env:USERPROFILE/.codex_runtime" --json
```

첫 명령은 CLI 홈, 두 번째는 이 PC의 Desktop 홈을 지정하는 예시입니다. 홈이 다른 환경이면 실제 경로를 확인하세요. `ok: false`이면 버전·캐시·권한·등록 상태를 확인합니다. 자동 훅 실행과 실제 답변 품질은 별도 미검증으로 표시됩니다.

## 4. 오류가 나면
기존 폴더·설정·모델을 삭제하거나 강제 덮어쓰기하지 마세요. 오류 종류·버전·어떤 단계에서 실패했는지만 기록하고 API 키·토큰·개인 대화는 공개하지 마세요. 자세한 복구·라이선스 조건은 README와 LEGAL_REVIEW.md를 확인하세요.

## 공유·판매 전 권리 확인

적법하게 적용되는 Apache 2.0 조건을 지키면 상업적 이용이 가능합니다. 실제 재배포 파일에도 [LICENSE](LICENSE)와 해당 [NOTICE](NOTICE)를 포함하고 수정 파일에는 변경 사실을 표시하세요. 외부 자료·AI 결과·공급자/계정 약관은 별도로 확인해야 합니다. 소유권·무침해를 보장하지 않습니다. 미확인 사항과 법무/전문가 검토 필요 항목은 [권리 점검 기록](LEGAL_REVIEW.md)을 확인하세요.
