---
description: "인터뷰 방식으로 새 도메인 페르소나(현재 다음 번호 #32부터)를 생성 — 추천 트리거 단어 자동 제안, 관련 파일 전부 동기화, validate.mjs로 자동 검증"
---

# $persona-create — 새 페르소나 생성 (인터뷰 방식)

이 명령이 실행되면 아래 순서를 **하나씩, 인터뷰 형식으로** 진행한다. 한 번에 여러 질문을 던지지 말고, 답을 받은 뒤 다음 질문으로 넘어간다.

## 0단계. 사전 확인

- `plugins/sodam-persona/skills/persona-triggers/SKILL.md`를 읽어 `## B.` 섹션 표에서 현재 마지막 관점 번호(N)를 확인한다.
- 같은 파일에서 `## ([A-Z]+)\. ` 형태의 마지막 패턴 ID를 확인한다(현재 A~AK).
- 새 관점 번호 = N+1, 새 패턴 ID는 Excel 열 표기처럼 증가한다(Z 다음은 AA, AA 다음은 AB). 단순 문자 코드 증가를 사용하지 않는다.

## 1단계. 인터뷰 (한 번에 하나씩)

1. "새 페르소나가 다룰 전문 분야가 무엇인가요? (예: 의료·건강, 부동산, 교육 등 한글로)"
2. "영문 폴더/파일 이름에 쓸 짧은 영어 슬러그를 정해주세요 (예: doctor, realestate). 소문자·하이픈만."
   - **입력값 검증(필수)**: 답변이 `^[a-z][a-z0-9-]*$` 형식(소문자로 시작, 소문자·숫자·하이픈만, 공백·슬래시(`/`)·역슬래시·마침표 2개 연속(`..`)·특수문자 없음)이 아니면 파일 경로에 절대 사용하지 말고, "영문 소문자와 하이픈만 사용해주세요 (예: doctor)"라고 다시 요청한다. 이 슬러그는 곧바로 `plugins/sodam-persona/skills/persona-<슬러그>/` 폴더 경로에 쓰이므로, 검증 없이 그대로 사용하면 경로 조작(path traversal) 위험이 있다.
3. "이 페르소나가 답변할 때 챙겨야 할 책임 영역을 간단히 알려주세요 (몇 가지 항목이어도 됩니다)."
4. "이 도메인이 신고·계약·처방·진단처럼 '실행성 답변'을 다뤄서, #14(회계세무)·#11(법률)처럼 **면책 문구가 반드시 필요한 영역**인가요? (예/아니오)"

## 2단계. 추천 트리거 단어 생성

1~3단계 답변을 바탕으로, 기존 도메인 섹션(J 투자·K 법률·S 회계세무·T 마케팅·U~AD 건축/인테리어/3D·AE~AG 검색/리서치/아이디어·AH~AK 프로젝트관리, `persona-triggers/SKILL.md` 참고)과 같은 형식으로 **한국어 트리거 단어 15~30개를 직접 생성**해 보여준다. 사용자에게 "이대로 등록할까요? 추가/삭제하고 싶은 단어가 있나요?"라고 확인한다. 확정 전까지는 파일을 건드리지 않는다.

## 3단계. 파일 반영 (확정 후에만, 순서대로)

1. **`plugins/sodam-persona/skills/persona-triggers/SKILL.md`**
   - `## B.` 표에 새 행 추가: `| N+1 | <도메인명> (15년+) | <트리거 표현들> |`
   - 새 알파벳 섹션(예: `## U. "<도메인>" 도메인 패턴 → #N+1 <도메인> 페르소나 활성`) 추가 — J/K/S/T 섹션과 동일 구조(트리거 단어군 / 책임 영역 / PR 체크리스트 / 다른 관점과의 경계)
   - frontmatter `description`과 본문의 현재 `A~AK 37패턴` 표기를 `A~<새글자> <새패턴수>패턴`으로 갱신
   - "매칭 예시" 표에 새 도메인 예시 1줄 추가
2. **`plugins/sodam-persona/hooks/persona_core.md`**
   - "도메인 트리거 (조건부 활성)" 섹션에 새 도메인 소단원 추가 (트리거 단어·책임 영역, 기존 4개와 동일 형식)
   - 면책 필요 시 "[면책 강제]" 섹션에 새 도메인 추가
   - "31명 다관점 균형 검토"의 관점 목록 목록에 새 관점 이름 추가, 숫자를 N+1로 갱신
   - "파일 맵" 표의 도메인 스킬 목록에 `persona-<슬러그>` 추가
3. **`plugins/sodam-persona/hooks/persona_marker.txt`**
   - "도메인 (조건부)" 한 줄 문구에 새 도메인 트리거·활성 문구 추가 (persona_core.md와 동일 내용)
   - "persona-* 자동 활성" 목록에 `persona-<슬러그>` 추가
   - 면책 필요 시 "[도메인 면책 강제]" 항목에 새 도메인 추가
4. **`plugins/sodam-persona/skills/persona-<슬러그>/SKILL.md`** (신규 생성)
   - `persona-investor`/`persona-lawyer`/`persona-accountant`/`persona-marketer` 중 하나를 그대로 구조 참고: frontmatter(name=폴더명과 반드시 일치, description) → 정본 안내 → 트리거 단어군 → 필요 시 "⚠️ 필수 면책" 박스 → 책임 영역 → PR/작업 체크리스트 → 다른 관점과의 경계
5. **`plugins/sodam-persona/skills/persona-format/SKILL.md`**
   - "다관점 판단 (<현재 관점 수>)" 제목과 목록에 새 관점 추가, 숫자 갱신
6. **`plugins/sodam-persona/reference/persona_full_core.md`**, **`plugins/sodam-persona/reference/test_scenarios.md`**
   - 관점 수 숫자 표기 갱신 (validate.mjs가 이 두 파일도 검사 대상에 포함함)
7. **`README.md` / `README.en.md`** (2개 전부. 2026-07-27부로 GUIDE.md/GUIDE.en.md는 폐지되어 README에 통합됨)
   - 현행 관점 수 표기 등 전부 새 숫자로
   - 현행 트리거 패턴 수와 마지막 ID를 새 값으로
   - "스킬 7개"/"Skills (7)" → 새 개수로
   - 관점 목록·업데이트 내용 요약에 새 도메인 한 줄 추가
8. **`validate.mjs`**
   - `DOMAINS` 배열(현재 20개 도메인)에 `persona-<슬러그>` 추가 (이래야 5번 검사가 새 도메인도 배선 확인함)

## 3-1단계. 검증 전 마지막 훑기 (2026-07-27 실측 반영)

3단계 목록은 알려진 위치만 나열한 것이라, `persona-triggers/SKILL.md`의 개별 패턴 섹션(A/L/P/Q/I 등)이나 매칭 예시 표, `persona-format.md`/`persona-investor`/`persona-lawyer`의 안내 문구처럼 옛 관점 수("N명"·"N관점")가 산발적으로 더 남아있을 수 있다(실제 라이브 테스트에서 17건 누락 발견됨). `node validate.mjs`를 처음 돌리기 전에, 옛 숫자를 기준으로 프로젝트 전체를 한 번 더 검색해 남은 곳을 먼저 고친다:

```
grep -rn "옛N명\|옛N관점\|옛N개 관점\|옛N개 도메인 관점\|A~옛마지막글자\|Skills (옛스킬수)\|Skills(옛스킬수)" --include=*.md --include=*.json --include=*.txt .
```

## 4단계. 검증

`node validate.mjs`를 실행한다. `❌ FAIL`이 나오면 표시된 항목을 하나씩 고치고 다시 실행 — `✅ PASS`가 나올 때까지 반복한다. 실행 결과를 그대로 사용자에게 보여준다.

## 5단계. 마무리 안내

- 설치된 캐시에는 자동 반영되지 않는다는 점을 안내: `codex plugin marketplace upgrade sodam-persona` → `codex plugin remove sodam-persona` → `codex plugin add sodam-persona@sodam-persona` → 새 task 시작
- git 커밋은 바뀐 파일만 정확히 이름 지정해 add (`git add -A` 금지, 이 저장소 README.md §8의 기존 규칙), conventional commit 형식으로 작성
- 실제 push·PR 생성·merge는 사용자의 명시적 승인 없이는 실행하지 않는다
