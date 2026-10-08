---
description: "v6 등록부로 대상 역할을 확인하고 활성 의도·제외 조건·책임을 안전하게 수정한다."
---
# 기존 페르소나 편집
변경 사항: 폐지된 B 표 대신 v6 정본과 등록부를 사용.

1. `reference/operating_contract.md`와 `persona-registry.json`을 읽어 실제 역할을 확인한다. 대상·추가/수정/제거·변경 목적을 확인하고 이미 승인된 정보는 다시 묻지 않는다.
2. `reference/persona_full_core.md`, `reference/domain_routing.md`, 해당 스킬과 협업 문서에서 영향을 추적한다. 기본 역할은 공통 라우팅, 전문 역할은 전용 스킬의 활성 의도·제외 조건을 편집한다. 단어의 등장만으로 활성하지 않는다.
3. 변경 줄과 영향 범위를 확인한 후 승인된 범위의 소스만 수정한다. 기존 역할 ID·기능·면책·안전 규칙을 임의로 삭제하지 않는다. 내용상 충돌이 있으면 사용자 지시와 공통 정본을 우선한다.
4. 상세 내용은 reference와 스킬에 유지하고 훅 주입량은 12000 상한으로 검증한다. 훅에 전체 목록을 중복 삽입하지 않는다.
5. `node validate.mjs`, `node --test test-hooks.mjs test-validator.mjs`, `node build-docs.mjs`를 실행하고 정상·제외·경계·실패 발화의 동작을 회귀 시험한다. 누락된 시험은 미실행으로 표시한다.
6. 소스 변경과 설치 반영·실제 실행 결과를 분리하여 보고한다. 캐시는 자동 반영되지 않는다. 기존 수정본을 보존하고 공식 설치 경로를 사용한다. push·공개는 별도 사용자 지시를 따른다.

역할을 추가·편집할 때 reference/role_activation_contract.md, reference/routing_cases.json의 해당 계약과 시험도 함께 갱신한다. 시험 기대값은 실행 전에 고정하고 관측 결과에 맞춰 몰래 변경하지 않는다.
