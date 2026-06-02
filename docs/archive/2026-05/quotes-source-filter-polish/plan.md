---
template: plan
version: 1.2
description: PDCA Plan — quotes-source-filter Minor gaps 5건 중 3건 폴리시 (A11y + 데이터 정합성 + 검증)
variables:
  feature: quotes-source-filter-polish
  date: 2026-05-30
  author: DrunkenZealnut
  project: semiconductor-academy
  version: 0.1.0
---

# quotes-source-filter-polish Planning Document

> **Summary**: 직전 archived cycle `quotes-source-filter` (Match Rate 95%, Minor 5건)에서 ship-blocker 아니라 별 cycle로 분리한 polish 3건 처리. (1) `FilterButton` `focus-visible` ring 추가(A11y), (2) `extract-quotes.mjs` OSHA_PART_META의 part-1b/part-2 partTitle을 `sources.ts`와 글자 단위 일치 + 단일 진실 원칙 강화, (3) Source=OSHA + "summary" 시나리오 검증 시간 30~45분 micro-PR.
>
> **Project**: semiconductor-academy
> **Version**: 0.1.0
> **Author**: DrunkenZealnut
> **Date**: 2026-05-30
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 직전 cycle `quotes-source-filter`(95%)의 Minor 5건 중 3건이 사용자 가치(A11y) 또는 시스템 정합성(단일 진실)에 영향. ① `FilterButton`에 `:focus-visible` ring 부재로 키보드 사용자에게 활성 포커스가 시각적으로 약함 ② `extract-quotes.mjs` OSHA_PART_META의 part-1b("…Emergency")는 sources.ts("…Emergency Procedures")와, part-2("…Emergency")는 sources.ts("…Emergency Actions")와 단어 누락 — Design §6.3 risk("OSHA section ID가 cross-link sources.ts와 불일치")의 약화된 형태 ③ Design §8.2 Happy C(`source=OSHA + summary` 검색) 실측 미수행. |
| **Solution** | (1) `FilterButton` className에 `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900` 추가 (2) `extract-quotes.mjs` OSHA_PART_META의 part-1b/part-2 partTitle을 `sources.ts` 풀 텍스트와 일치시키되, UI carousel 영향 0(이미 두 단어 추가는 chip이 약간 길어질 뿐) — 또는 sources.ts 단일 진실에서 자동 import 패턴 도입 검토(단, scripts→TS import는 cross-link cycle과 동일 이유로 회피, 수동 미러+주석 명시 채택) (3) `npm run dev` 후 `/quotes` 진입 → Source=OSHA + "summary" 입력 → 5건 노출 확인 + 결과 스크린샷 docs 첨부. |
| **Function/UX Effect** | • 키보드 Tab 사용자가 FilterButton 포커스를 시각적으로 명확히 확인(`brand-400` ring 2px + offset 2px) → WCAG 2.1 AA Focus Visible 충족 • `extract-quotes.mjs` partTitle이 sources.ts와 동일 → OSHA quote 카드 chip ("Part 1B · Communication, Controls, and Emergency Procedures") UI에서 풀 명칭 노출, 사용자가 자료원 페이지(`/sources/osha-scs/part-1b/`) 헤더와 동일한 라벨로 일관성 인지 • Happy C 검증으로 Test Coverage 95→100% |
| **Core Value** | A11y polish는 cumulative — 본 cycle은 인용 인덱스만 다루지만 `FilterButton` 패턴이 향후 자료원·태그 필터 등 다른 곳에서 재사용될 때 자동 전파. 데이터 정합성(M1) 처리는 cross-link-system Extensibility 5원칙 중 "Single source of truth" 원칙의 인용 인덱스 적용 — 자료원 메타가 한 곳에서만 변경되도록 패턴 강화. 30~45m 박스로 누적 polish 부채 0건 유지 (cycle 마다 polish 부채를 다음 cycle로 미루지 않는 정책 정립). |

---

## 1. Overview

### 1.1 Purpose

직전 cycle `quotes-source-filter`가 95% Match Rate로 archive되면서 5건의 Minor gap이 polish 항목으로 분류되었다. 이 중 3건은 ship-blocker는 아니지만 측정 가능한 사용자 가치(A11y) 또는 시스템 정합성(단일 진실)에 직접 영향. 30~45분 micro-cycle로 누적 polish 부채 0건 유지.

### 1.2 Background

**직전 cycle 결과** (`docs/archive/2026-05/quotes-source-filter/`):
- Match Rate 95%, Critical/Major 0, Minor 5
- README §Polish 4건 정의: M1, M5, (doc), (test)
- 본 cycle 범위: **M1 + M5 + Happy C 실측** (3건)
- 제외: (doc) Design v0.2 갱신은 archive 안 design.md를 수정해야 하는데 archive README에 이미 변경 사항이 명문화됨 → 중복

**현재 코드 상태** (확인):
- `scripts/extract-quotes.mjs:36-37` part-1b/part-2 partTitle이 sources.ts와 두 단어(Procedures/Actions) 누락
- `src/components/quote-index/QuoteIndex.tsx:248-261` FilterButton에 focus-visible 스타일 0
- Happy C 시나리오는 OSHA summary 5건 추출 확인되었으나 UI 토글 + 검색 결과는 미실측

### 1.3 Related Documents

- 직전 archive: `docs/archive/2026-05/quotes-source-filter/` — Minor 5건 원본
- 정합성 패턴 참조: `docs/archive/2026-05/cross-link-system/` — Single source of truth 원칙
- 직접 수정 대상: `scripts/extract-quotes.mjs`, `src/components/quote-index/QuoteIndex.tsx`

---

## 2. Scope

### 2.1 In Scope

#### 2.1.1 A11y — FilterButton focus-visible ring (M5)

- [ ] `QuoteIndex.tsx:248-261` `FilterButton` className에 다음 추가:
  - `focus-visible:outline-none`
  - `focus-visible:ring-2 focus-visible:ring-brand-400`
  - `focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900`
- [ ] active/inactive 양쪽에서 ring 가시성 확인 (active 시 brand-500 배경 + ring brand-400 → 충분한 대비)
- [ ] Keyboard Tab navigation 직접 테스트 (Tab 키로 모든 chip 순회)

#### 2.1.2 데이터 정합성 — partTitle 단일 진실 (M1)

선택지 평가 (Plan §6.2 참조):

**Option A — 수동 미러 + 주석 강화 (채택)**
- `extract-quotes.mjs` OSHA_PART_META의 part-1b/part-2 partTitle을 sources.ts와 글자 단위 일치:
  - part-1b: `'Part 1B · Communication, Controls, and Emergency'` → `'Part 1B · Communication, Controls, and Emergency Procedures'`
  - part-2: `'Part 2 · Chemical Hazards, Controls, and Emergency'` → `'Part 2 · Chemical Hazards, Controls, and Emergency Actions'`
- 헤더 주석 강화: "⚠️ OSHA_PART_META must stay in sync with src/lib/sources.ts OSHA_SCS.sections — 5 entry 풀 텍스트 일치(partTitle), partHref도 동일 패턴."
- `npm run extract:quotes` 후 quotes.json에서 partTitle 풀 텍스트 검증

**Option B — 자동 동기화 (자동 build)** — 회피
- scripts→TS direct import는 cross-link cycle에서도 회피 (`.mjs`/`.ts` 경계)
- sources.ts에서 별도 JSON mirror 생성 후 import — 5 entry에 비해 비용 과다 (YAGNI)

#### 2.1.3 검증 — Happy C 시나리오 실측 (test)

- [ ] `npm run dev` 후 브라우저 `/quotes` 진입
- [ ] Source 필터에서 [🏛 OSHA 26] 선택 → Type/Chapter 필터 숨김 확인
- [ ] 검색창에 "summary" 입력
- [ ] 결과: 5 Part Course Summary 5건 노출 확인 (Part 1A/1B/2/3/4)
- [ ] 스크린샷 첨부 → docs/04-report/quotes-source-filter-polish.report.md에 포함
- [ ] (선택) playwright MCP로 자동화 spot check

#### 2.1.4 빌드 검증

- [ ] `npm run extract:quotes` 통과 (117 quotes 유지, partTitle 풀 텍스트로 변경)
- [ ] `npm run typecheck` 통과
- [ ] `npm run build` 무경고
- [ ] /quotes 페이지 spot check (FilterButton Tab 포커스, OSHA 카드 partTitle 풀 텍스트)

### 2.2 Out of Scope

- **(doc) Design v0.2 갱신**: archive 안 design.md를 사후 수정하는 것은 archive 정책 위반. 변경 사항은 이미 archive README §11.2 + §OSHA Definition Selector 매트릭스에 명문화됨 → 중복 정보 회피.
- **OSHA Definition selector 확장** (Part 1B 추가 정의 등): 본 cycle은 polish 한정. 별 cycle `quotes-osha-definition-expansion` (선택)
- **FilterButton 전역 추출**: 본 cycle은 QuoteIndex 내부 helper 한정. 향후 다른 페이지에서 재사용 필요 시 별 cycle에서 `@/components/ui/Chip` 등으로 승격
- 신규 자료원 (SEMI/KOSHA) onboarding
- 모바일 앱

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | `FilterButton` className에 `focus-visible` ring 4 utility 추가 (outline-none + ring-2 brand-400 + ring-offset-2 + dark ring-offset) | High | Pending |
| FR-02 | `extract-quotes.mjs` OSHA_PART_META의 part-1b partTitle을 'Part 1B · Communication, Controls, and Emergency Procedures'로 변경 | High | Pending |
| FR-03 | `extract-quotes.mjs` OSHA_PART_META의 part-2 partTitle을 'Part 2 · Chemical Hazards, Controls, and Emergency Actions'로 변경 | High | Pending |
| FR-04 | `extract-quotes.mjs` 헤더 주석 강화: sources.ts 단일 진실 명시 + 풀 텍스트 미러 강조 | Medium | Pending |
| FR-05 | `npm run extract:quotes` 실행 후 quotes.json에서 part-1b/part-2 풀 텍스트 검증 | High | Pending |
| FR-06 | `/quotes` 브라우저 spot check: Tab navigation 시 FilterButton 포커스 ring 가시성 확인 | High | Pending |
| FR-07 | `/quotes` 브라우저 spot check: Source=OSHA + "summary" 검색 → Part 1A/1B/2/3/4 Course Summary 5건 노출 확인 | High | Pending |
| FR-08 | typecheck / build 무경고 통과 | High | Pending |
| FR-09 | 17 chapter + 30 chemical + 9 process + 7 source + /quotes 모두 prerender 유지 | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement |
|----------|----------|-------------|
| A11y (Focus Visible) | WCAG 2.1 AA Success Criterion 2.4.7 충족 | 수동 키보드 테스트 + 명도 대비 시각 확인 |
| Data Integrity | quotes.json의 OSHA quote 26건 모두 partTitle 풀 텍스트 (sources.ts와 1:1) | grep + diff 검증 |
| Build | 무경고 통과 | local |
| Bundle | /quotes 페이지 크기 변화 ≤ 0.5 kB (CSS utility 4개 추가만) | build output |
| 회귀 | 직전 cycle FR-01~10 모두 유지 | spot check |
| 시간 | 총 작업 ≤ 45분 (FR-01 5m + FR-02~05 10m + FR-06~07 15m + FR-08~09 빌드/검증 10m) | time box |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] `FilterButton` Tab 포커스 시 brand-400 ring 명확히 표시 (light/dark 모드)
- [ ] `quotes.json`의 OSHA 26 quote 모두 sources.ts와 동일한 풀 partTitle
- [ ] Happy C 시나리오 실측 5건 노출 + 스크린샷 1장
- [ ] gap-detector Match Rate ≥ 95% (직전 cycle 수준 유지 또는 상회)
- [ ] 총 작업 시간 ≤ 45m

### 4.2 Quality Criteria

- [ ] focus-visible ring 색상이 brand-500 배경 위에서도 식별 가능 (active chip)
- [ ] partTitle 풀 텍스트가 OSHA 카드 chip에서 truncate 없이 노출 (chip width 확인)
- [ ] 다크 모드 일관성 (ring-offset-slate-900 적용)
- [ ] `extract-quotes.mjs` 헤더 주석이 다음 자료원 추가 onboarding 시 한 번 더 정합성을 상기시킴

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| partTitle 풀 텍스트가 OSHA 카드 chip width를 초과해 줄바꿈 발생 | Low | Medium | chip은 이미 `flex-wrap` 컨테이너 — 줄바꿈 자연 흡수. 시각 확인 |
| focus-visible ring이 active(brand-500 bg) 상태에서 흐릿함 | Medium | Low | brand-400 ring + ring-offset 2px로 분리 확보. 시각 확인 시 대비 ≥3:1 |
| Tailwind safelist 누락 (focus-visible variants) | Low | Low | Tailwind v3+ JIT가 utility 자동 감지. config 수정 불요 |
| Happy C 실측 시 검색 결과가 정확히 5건이 아닐 경우(예: 6건) | Low | Low | quotes.json의 OSHA summary 5건이 확정 — Fuse fuzzy로 6+건 나오면 검색어 정확화("Course Summary") |
| 작업 시간 45m 초과 | Low | Low | 시간 박스. Happy C가 길어지면 텍스트 검증만으로 대체 |

---

## 6. Architecture Considerations

### 6.1 Project Level

| Level | 선택 |
|-------|:---:|
| Starter | ☐ |
| **Dynamic** | ☑ (변경 없음) |
| Enterprise | ☐ |

### 6.2 Key Architectural Decisions

| Decision | 선택 | 근거 |
|----------|------|------|
| partTitle 정합성 처리 방식 | **수동 미러 + 주석 강화 (Option A)** | scripts→TS 경계 회피 + 5 entry라 YAGNI. cross-link cycle과 동일 패턴 (schema-enum.json 미러) |
| focus-visible color | brand-400 (active brand-500 위에서도 식별) | 디자인 토큰 재사용, 신규 색상 0 |
| Ring offset | 2px + dark ring-offset-slate-900 | 표준 Tailwind a11y 패턴 |
| Happy C 검증 방법 | 브라우저 spot check + 스크린샷 | 시간 박스 우선. playwright 자동화는 추후 |
| FilterButton 컴포넌트 위치 | QuoteIndex 내부 helper 유지 | 본 cycle은 polish — 추출/재사용은 별 cycle |

### 6.3 Folder Structure (변화분)

```
src/
  components/quote-index/
    QuoteIndex.tsx                ← EDIT (FilterButton className에 focus-visible 4 utility 추가)
scripts/
  extract-quotes.mjs              ← EDIT (OSHA_PART_META part-1b/part-2 partTitle + 주석)
src/data/
  quotes.json                     ← REGENERATE (partTitle 풀 텍스트로 업데이트)
docs/04-report/
  quotes-source-filter-polish.report.md  ← NEW (Happy C 실측 스크린샷 포함)
```

---

## 7. Convention Prerequisites

기존 컨벤션 그대로:
- 디자인 토큰 100% 재사용 (brand-400 ring, slate-900 ring-offset 모두 기존)
- 컴포넌트 PascalCase, lib camelCase
- 신규 ENV 0개
- `quotes.json` 직접 편집 금지 (extract-quotes.mjs 단일 진실)
- archive 안 문서는 read-only — 변경 사항은 새 cycle의 polish report에 기록

본 cycle 추가:
- focus-visible utility는 Tailwind 표준 패턴 사용 (`focus-visible:ring-N`)
- partTitle 동기화는 sources.ts를 단일 진실로 간주 — 헤더 주석에 명시
- micro-cycle은 45m 박스 — 박스 초과 시 신규 cycle로 분리

---

## 8. Next Steps

1. [ ] 본 Plan 사용자 검토 및 승인
2. [ ] `/pdca design quotes-source-filter-polish` (선택 — micro-cycle이므로 생략하고 바로 do 가능)
3. [ ] `/pdca do quotes-source-filter-polish` — 30~45m 구현
4. [ ] gap-detector → Match Rate ≥ 95%
5. [ ] `/pdca report` (스크린샷 포함) → archive

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-30 | 초안: quotes-source-filter archive Minor 5건 중 polish 3건 (M5 focus-visible + M1 partTitle 동기화 + Happy C 실측). 30~45m 박스. (doc) Design v0.2 갱신은 archive 정책 위반으로 out of scope | DrunkenZealnut |
