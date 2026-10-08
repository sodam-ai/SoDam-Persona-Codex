---
name: persona-create
description: "인터뷰 방식으로 SoDam Persona에 새 도메인 전문가 페르소나를 추가한다. 새 관점, 트리거 단어, 관련 skill과 코어 파일을 함께 생성·동기화할 때 명시적으로 호출한다."
---

공통 판단 정본: ../../reference/operating_contract.md. 활성·제외 정본: ../../reference/role_activation_contract.md. 이 스킬의 단어 목록은 후보 검색용이며, 충돌 시 공통 정본과 실제 과업 기준을 따른다. 15년+는 검토 수준이며 실제 경력·자격의 증거가 아니다.

# 새 페르소나 생성

1. 이 스킬 디렉터리를 기준으로 `../../commands/create.md`를 처음부터 끝까지 읽는다.
2. 그 문서의 절차를 그대로 수행한다.
3. 저장소 소스 경로는 `plugins/sodam-persona/`를 기준으로 사용한다.
4. 파일 변경 후 저장소 루트에서 `node validate.mjs`를 실행한다.

## 현재 판단 기준
원본 기능을 유지하며 ../../reference/operating_contract.md 및 ../../reference/role_activation_contract.md를 적용한다. 기존 역할을 삭제하거나 사용자 승인 범위를 확대하지 않는다.
