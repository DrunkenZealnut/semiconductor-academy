# Plan — OSHA SCS Part 2 한글 번역 확장

> **Feature**: `osha-ko-part-2`
> **작성일**: 2026-06-02 · **Level**: Dynamic · **Cycle 유형**: 콘텐츠 확장 (파일럿 메커니즘 재사용)
> **상속**: `osha-bilingual-toggle`(토글 메커니즘) · `osha-ko-part-1b`(번역 템플릿·용어 일관)

---

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem (문제)** | OSHA SCS Part 2 "Chemical Hazards, Controls, and Emergency Actions"는 인화·가연·자연발화·산화·부식·독성 화학물질의 **위험 분류와 비상 대응 실무**를 담은 핵심 강의이나 영문 transcript뿐이다. Part 1A/1B는 한글화됐는데 정작 분량·표가 가장 많은 2가 언어 장벽에 남아 있다. |
| **Solution (해법)** | 파일럿·1B에서 검증한 토글 메커니즘과 번역 템플릿을 **그대로 재사용**하여 `part-2.ko.mdx`(Claude 초벌 + 사람 검수)를 추가하고 `koLoaders`에 **1줄 등록**한다. 표 8개(폭발한계·노출한계·5×5 적합성 매트릭스 포함)를 행·열 보존 변환한다. |
| **Function·UX Effect (기능·UX 효과)** | `/sources/osha-scs/part-2`에서 `[한국어] [EN]` 토글 **자동 노출**, 본문 즉시 전환. localStorage(`osha-scs-lang`) Part 1A/1B와 공유. 적합성 매트릭스·노출한계(PEL/TLV/STEL/IDLH)·HF 응급처치가 한글로 1:1 렌더. |
| **Core Value (핵심 가치)** | 화재·폭발·독성 비상 대응 실무 지식을 모국어로 전달해 진입장벽 제거. OSHA 5 Part 중 3개 한글화로 핵심 본문 커버리지 확대. "MDX 1개 + 로더 1줄" 템플릿의 **표-집약 콘텐츠 적용** 실증. |

---

## 1. 배경 / 현재 상태

| 항목 | 현황 |
|------|------|
| 토글 메커니즘 | ✅ 완성 (`osha-bilingual-toggle`) — 변경 불필요 |
| `koLoaders` 현황 | `oshaMdx.tsx` — `part-1a`·`part-1b` 등록 (part-2/3/4 미등록 → 영문 단독) |
| 번역 대상 | `src/content/sources/osha-scs/part-2.mdx` — 영문, 약 325줄, 12개 섹션 + 개요/요약 |
| Part 2 제목 | `Part 2 · Chemical Hazards, Controls, and Emergency Actions` (sources.ts) |
| 2 구조 | 화재 삼각형 → 인화 액체/가스/고체 → 가연성 → 자연발화성 → 화재 비상조치 → 산화제 → 부식성(산·염기) → 독성(노출한계) → 저장·적합성 → PPE |
| **표 8개** | ①폭발한계 정의 ②가스별 LEL/UEL ③화재 비상조치 ④부식성 화학물질 ⑤노출한계(PEL/TLV/TWA/Ceiling/STEL/IDLH) ⑥독성 노출경로 대응 ⑦유형별 저장 ⑧**5×5 적합성 매트릭스** |
| 번역 자산 | `part-1a.ko.mdx`·`part-1b.ko.mdx`(용어·톤) · `terms.json` · 책 「반도체 산업의 유해인자」 |

**확정 결정** (사용자 협의 계승, 2026-06-02):
1. 범위: **Part 2만** (3/4는 후속 사이클)
2. 번역 생성: **Claude 초벌 번역 직접 작성** (이후 사람 검수)

---

## 2. 목표 / 비목표

### 목표
- `part-2.ko.mdx`를 영문과 헤딩·열거·**표 8개** 1:1 구조로 작성.
- `koLoaders`에 `'part-2'` 등록 → 토글 자동 노출.
- 화재·폭발·독성 안전 수치·방향성 직역 정확성 확보.
- 용어를 1A/1B·`terms.json`·책과 일관 유지.
- 코어(컴포넌트/page) 무수정 확장 실증 계승.

### 비목표 (이번 사이클 제외)
- Part 3/4 한글 번역 (후속 사이클).
- 토글 컴포넌트·로더 시그니처·page 로직 변경.
- 사이트 전역 i18n, 한글 인용 `quotes.json` 인덱싱 (영문 기준 유지).
- 1A/1B 기존 번역 양식 일괄 정렬(P2-1 deferred) — 별도 검수 사이클.

---

## 3. 기능 요구사항 (FR)

| ID | 요구사항 | 우선순위 |
|----|----------|:---:|
| FR-1 | `part-2.ko.mdx`를 영문과 헤딩·열거·표 구조 1:1 (12섹션 + 개요/요약) | P0 |
| FR-2 | 표 8개 행·열·셀 정확 변환 (특히 **5×5 적합성 매트릭스 OK/NO** 셀 위치 보존) | P0 |
| FR-3 | `koLoaders`에 `'part-2'` 로더 1줄 등록 | P0 |
| FR-4 | 안전 수치·방향성 직역 왜곡 0 — flash point 53°F(11.7°C)·pyrophoric 130°F(54°C)·LEL/UEL %(메탄5/15·수소4/74·아세틸렌2/100)·HF 5분 세척·STEL 15분·TWA 8시간 | P0 |
| FR-5 | 전문 용어 1A/1B 일관 + 영문 병기 (LEL/UEL/PEL/TLV/TWA/STEL/IDLH/PPE/HF/Class D) | P1 |
| FR-6 | `/sources/osha-scs/part-2` 토글 자동 노출 + 본문 전환 (page 무수정 확인) | P0 |

## 4. 비기능 요구사항 (NFR)

| ID | 요구사항 |
|----|----------|
| NFR-1 | 정적 export 호환 — 신규 서버 의존 0 (MDX 추가만) |
| NFR-2 | `typecheck` + `lint` + `build` 무오류 |
| NFR-3 | `quotes.json`/`cross-link.json` 산출물 회귀 0 (`.ko.mdx` 스캔 비대상) |
| NFR-4 | 코어 무수정: 컴포넌트·page 0줄, 변경은 MDX 신규 + 로더 1줄뿐 |
| NFR-5 | 번역 품질: 화재·폭발·독성 안전 문구 오역 0, 용어 일관, 중·고등학생 가독성 |
| NFR-6 | 다크모드·prose 영/한 동일 적용 (표 8개 포함) |

---

## 5. 구현 범위 (파일)

| 구분 | 파일 | 작업 |
|------|------|------|
| 신규 | `src/content/sources/osha-scs/part-2.ko.mdx` | 한글 번역본 (Claude 초벌, 영문 1:1, 표 8개) |
| 수정 | `src/lib/oshaMdx.tsx` | `koLoaders`에 `'part-2'` 1줄 추가 |

> 컴포넌트·page·타입·빌드 스크립트 무변경. 빌드 산출물 직접 수정 금지.

---

## 6. 리스크

| ID | 리스크 | 대응 |
|----|--------|------|
| R-1 | **5×5 적합성 매트릭스**(Flammable/Oxidizer/Acid/Base/Toxic OK·NO) 셀 위치 오정렬 → 안전 오정보 | 영문 매트릭스 행·열 순서 그대로 유지, 헤더 한글화하되 OK/NO 셀 1:1 대조, 빌드 후 렌더 확인 |
| R-2 | 안전 수치 오역 (flash point/pyrophoric 온도 °F↔°C, LEL/UEL %, HF 5분, STEL 15분/TWA 8시간) | 수치·단위 **직역 우선**, 영문 병기, 사람 검수 필수 |
| R-3 | 노출한계 약어(PEL/TLV/TWA/Ceiling/STEL/IDLH) 한글 풀이 비일관 | 첫 등장 영문 병기 + 표준 용어, IDLH "생명·건강 즉시 위험" 등 의미 보존 |
| R-4 | 표 8개 중 MDX 파싱 깨짐 (정렬 `:---:` 포함 매트릭스) | 영문 표 구조 그대로 복제, 빌드 검증 |
| R-5 | `koLoaders` 등록 누락 → 토글 미노출 | FR-3 명시 + build 후 `/part-2` 토글 노출 확인 |
| R-6 | 분량 증가(325줄, 표 8개)로 번들 증가 | 비활성 본문 `hidden`(기존 패턴), 영향 경미 예상 |

---

## 7. 완료 정의 (DoD)

- [ ] `part-2.ko.mdx` 영문과 헤딩/열거/표 1:1 (12섹션 + 개요/요약 + 표 8개)
- [ ] **5×5 적합성 매트릭스** OK/NO 셀 위치 영문과 완전 일치
- [ ] `koLoaders`에 `'part-2'` 등록 → `/sources/osha-scs/part-2` 토글 자동 노출
- [ ] 컴포넌트·page 0줄 변경 (NFR-4 코어 무수정)
- [ ] 안전 수치/단위/방향성 직역 정확 (온도·LEL/UEL·노출한계·HF 세척)
- [ ] typecheck + lint + build 무오류, quotes/cross-link diff 0
- [ ] Gap 분석 Match Rate ≥ 90%

---

## 8. 다음 단계

→ 메커니즘 확정 사이클이므로 **Design skip** 권장 → 곧바로 `/pdca do osha-ko-part-2` (번역 작성 + 로더 1줄). 1B와 동일 흐름.
> 후속: 본 사이클 후 `osha-ko-part-3` → `part-4`로 OSHA 5 Part 한글화 완주.
