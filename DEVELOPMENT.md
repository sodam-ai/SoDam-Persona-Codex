# 개발·시험·배포 기준
## 정본과 보존
현재 체크아웃·branch·미커밋 변경·remote를 확인한 뒤 작업합니다. SoDam-Persona는 원본, SoDam-Persona-Codex는 Codex 포팅 저장소입니다. remote 이름만 믿지 말고 URL을 확인하세요. 자동 remote 변경·reset·강제 push·기존 변경 삭제는 하지 않습니다.

```powershell
git status --short
git branch --show-current
git remote -v
```

## 소스 검증
Node.js 20을 CI 기준으로 사용합니다. 외부 npm 의존성은 없습니다. Pandoc은 문서 재생성과 검사에만 필요합니다.

```powershell
node validate.mjs
node --test test-hooks.mjs test-validator.mjs test-supplemental.mjs test-diagnose.mjs test-evaluate.mjs test-docs.mjs
node build-docs.mjs
node check-docs.mjs
```

문서 검사는 보이는 본문과 한·영 제목 구조를 비교합니다. 번역 의미·접근성·실제 화면 검수는 별도입니다.

## 실제 응답 시험
아래 명령은 고정 예제 하나를 새 임시 Codex 대화에 보냅니다. 로그인된 Codex 사용량을 소비합니다. 개인 config는 로드하지 않고 후보 지침을 직접 제공하므로 설치 훅 통합 시험이 아닙니다. 전용 입력 시험이며 도면 수정 등 실무 기능을 수행하지 않습니다.

```powershell
node evaluate.mjs --list
node evaluate.mjs --execute --case R42-positive --out ./evaluation-results/run-01
```

270개 ID를 하나씩 실행할 수 있습니다. 동일 기록은 덮어쓰지 않습니다. 결과에는 시각·입력 해시·실제 응답·실행 상태·역할 선택 판정이 들어갑니다. CLI 오류·시간 초과·잘못된 JSON은 실패로 남깁니다. 역할 선택 통과는 답변 품질 통과가 아닙니다. reason·answer가 실제 전문 기준을 적용했는지 사람이 확인하고 별도 새 대화에서 일반 자연어의 관점 표시·JSON 예외·실제 설치 훅도 검증하세요. 원본 출력과 검수 의견을 구분합니다. 평가 기록은 개인 정보가 들어갈 수 있으므로 Git에 포함하지 않습니다.

## 설치 진단과 공개
Codex 0.160.1이 `create/edit` 원본 명령에서 생성하는 두 이식 스킬은 원본으로 재구성한 결과와 바이트 단위로 일치할 때만 인정합니다. 추가 디렉터리 전체를 무시하지 않으며, 변조되거나 알 수 없는 추가 파일은 계속 차단합니다. 다른 Codex 버전에서 생성 형식이 바뀌면 검증 후 진단기를 보완해야 합니다.

`node diagnose.mjs --json` 또는 `--home <실제 Codex 홈>`으로 CLI/Desktop을 각각 검사합니다. 버전·내용·등록 상태가 다른 캐시는 실행하지 않습니다. 지원하지 않는 캐시 구조는 미확인으로 실패 처리합니다. 바이트 해시는 줄바꿈 차이도 감지합니다. 자동 설치 경로 추정이나 config 수정은 하지 않습니다.

배포 전 버전 매니페스트·README·검증 결과·라이선스·비밀정보·변경 diff를 확인합니다. 기본 branch 직접 push 대신 검증된 작업 branch의 PR을 사용하고, 공개·Release·설치 업데이트는 별도 단계로 확인합니다. 이 프로젝트 수정만으로 이미 설치된 파일이나 기존 대화는 바뀌지 않습니다. CHECKPOINT.md와 개인 시험 결과를 배포하지 않습니다. 법률 해석과 확인되지 않은 권리는 법무/전문가 검토 필요로 남깁니다.

## 공유·판매 전 권리 확인

적법하게 적용되는 Apache 2.0 조건을 지키면 상업적 이용이 가능합니다. 실제 재배포 파일에도 [LICENSE](LICENSE)와 해당 [NOTICE](NOTICE)를 포함하고 수정 파일에는 변경 사실을 표시하세요. 외부 자료·AI 결과·공급자/계정 약관은 별도로 확인해야 합니다. 소유권·무침해를 보장하지 않습니다. 미확인 사항과 법무/전문가 검토 필요 항목은 [권리 점검 기록](LEGAL_REVIEW.md)을 확인하세요.

문서 재현 기준은 Pandoc 3.7.0.2입니다. CI도 공식 배포 파일의 SHA-256을 확인한 뒤 같은 버전을 설치합니다. 배포판 기본 Pandoc 3.1.3과 출력 차이가 확인되었으므로 HTML 본문 비교가 실패하면 버전을 먼저 대조하고 검사를 생략하지 마세요.
