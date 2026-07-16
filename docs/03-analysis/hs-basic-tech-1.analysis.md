# Gap Analysis — hs-basic-tech-1

> **Feature**: `hs-basic-tech-1` · **분석일**: 2026-07-16 · **분석자**: gap-detector agent
> **기준**: `docs/02-design/features/hs-basic-tech-1.design.md` (§1~§7) + Plan FR-1~8 / NFR-1~5 / §9 확정 결정 4건 / §10 DoD
> **결과**: **Match Rate 94.8% (≈95%)** (✅ 26 · ⚠️ 3 · ❌ 0 / 29항목) — 임계치 90% 통과

---

## 1. Match Rate

| 판정 | 개수 | 가중 |
|:-:|:-:|:-:|
| ✅ 일치 | 26 | 26.0 |
| ⚠️ 부분 일치 (합리적 편차) | 3 | 1.5 |
| ❌ 불일치 | 0 | 0 |

**Match Rate = (26 + 3×0.5) / 29 = 94.8%**

## 2. 검증 요약 (설계 절별)

| 설계 절 | 검증 항목 수 | 결과 | 비고 |
|---|:-:|:-:|---|
| §1 아키텍처(REGISTRY) | 3 | 3✅ | 12모듈 로더 전부, id 정합, 코어 무수정(신규 파일 0개) |
| §2 Source 등록 | 4 | 4✅ | id·attribution·license·order·category·SOURCES 배열 전부 일치 |
| §3 섹션 12개 | 5 | 5✅ | id·title·readingTime·group·등록순서·href 규칙 전부 일치 |
| §3.1 챕터Ⅰ 재구성 순서 | 2 | 2✅ | 순환 배치 역산 순서 ①~⑨ 정확 반영, dc-circuits 경계 정확 |
| §4 콘텐츠 계약(12모듈 공통) | 6 | 6✅ | LayeredExplain·sourceSection 형식·학습목표 Callout·출처 footer·이미지 0·MDX 안전(`~` 예외 1건은 의도된 것) 전 12파일 |
| §4-1 FR-6 챕터Ⅰ 차별화 | 2 | 2✅ | 실습·측정 각도 확인, hs-semicon-basics 3건 SourceRef |
| §4-2 FR-8 단위계 | 2 | 1✅ 1⚠️ | pneumatics-basics 완전 일치. pneumatics-equipment는 최초 정의를 재사용해 반복 병기 생략(무해) |
| §5 FR-7 cross-link | 4 | 2✅ 2⚠️ | NCS 연결 8건(최소 2건 4배 초과). hydraulics 어휘 미태깅·sectional-views 타깃 편차는 설계상 "후보" 수준이라 무해 |

## 3. Gap 목록 — High/Medium 없음, Low 3건 (전부 무해/설계 문서 보강만으로 해소 가능)

| # | 항목 | 판단 |
|:-:|---|---|
| L-1 | `pneumatics-equipment`에서 kgf/cm² 반복 등장 시 SI 병기 생략 | 직전 모듈(pneumatics-basics)에서 이미 완전 정의됨 — **무조치** |
| L-2 | `hydraulics-equipment`가 `_links.json` 어휘 미태깅 | 설계 §5가 "후보"로만 제시, SourceRef로 대체 연결 — **무조치**, 설계 문서에 "SourceRef 전용" 주석 보강 권장 |
| L-3 | `sectional-views`→NCS 연결이 `equipment-board-design` 대신 `equipment-main-design` | 동일 장비 설계 트랙 내 편차, 무해 — **무조치** |

## 4. Positive Deviations (설계 초과 구현)

1. **NCS 상호 연결 4배 초과** — FR-7 최소 2건 목표 대비 실제 8건(전 모듈 SourceRef 실측)
2. **§3.1 최대 리스크(원문 페이지 순환 배치) 완전 해소** — `electronic-devices.mdx`에서 ①~⑨ 순서로 정확히 역산 재조립, Design 문서 계획대로 실행
3. **`measurement`(챕터Ⅱ)의 추가 NCS 연결** — 설계 매핑 범위 밖인데 `equipment-mechanical-assembly` 연결 추가
4. **자료원 내부 학습 흐름 SourceRef** — `dc-circuits`↔`electronic-devices`, `pneumatics-basics`→`pneumatics-equipment` 등 같은 책 모듈 간 순차 탐색 유도
5. **다층 Callout** — 계약 최소치(학습목표 info 1개) 외 warning(멀티테스터 검사·납땜/공구 안전수칙 등 원문 근거 기반)·tip 다수 배치
6. **공유압기술 서브에이전트의 자체 원문 대조 검증** — 최장 공통 부분열 탐색 스크립트로 근접 패러프레이즈를 사전 발견·재작성(Do 단계 기록, Design 계약을 실행 수준까지 검증)

## 5. 실행 검증 (Do 단계 게이트 — 세션 내 실측)

- ✅ `typecheck` 무오류 · `lint` 신규 경고 0
- ✅ `build` 성공 — `/sources/hs-basic-tech-1/*` 12모듈+인덱스 SSG, 기존 daegu·hs-semicon-basics 라우트 회귀 없음
- ✅ `build:cross-link` 통과(6 sources·100 sections, unknown 0)
- ✅ 렌더 스모크: 모듈 12/12, 인덱스 5트랙, 홈 3권 카드, cross-link(hs-semicon-basics·NCS) 렌더 확인, 다크모드

## 6. 총평

설계 §1~§7 전 절이 구현에 충실히 반영됐고 실질 Gap(High/Medium)은 0건이다. 12모듈 공통 구조(LayeredExplain·sourceSection 형식·학습목표 Callout·출처 footer·이미지 0·MDX 안전 규칙)가 12/12 완전 준수됐고, 이 권 특유 규칙(FR-6 챕터Ⅰ 차별화, FR-7 NCS 연결, §9-4 단위 병기, §3.1 원문 순환 배치 역산)이 전부 실증됐다. 남은 3건은 단위 표기 반복·선택적 어휘 태깅 수준의 저심각도 편차로 코드 수정 없이 무해하다. **Match Rate 94.8% ≥ 90% — Act(iterate) 불필요, Report 단계 진행 가능.**
