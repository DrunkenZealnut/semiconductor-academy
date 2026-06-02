---
template: plan
version: 1.2
description: PDCA Plan — QuoteIndex FilterButton helper를 @/components/ui/Chip 전역 컴포넌트로 승격
variables:
  feature: filter-button-promotion
  date: 2026-05-30
  author: DrunkenZealnut
  project: semiconductor-academy
  version: 0.1.0
---

# filter-button-promotion Planning Document

> **Summary**: 직전 cycle `quotes-source-filter-polish`에서 출시한 `FilterButton` helper(QuoteIndex 내부)를 `@/components/ui/Chip` 전역 컴포넌트로 추출. focus-visible ring + aria-pressed + 디자인 토큰을 컴포넌트 단위로 캡슐화하여 향후 어떤 페이지에서도 일관된 a11y/style의 토글형 필터 chip을 1줄로 사용 가능. **본 cycle은 QuoteIndex 마이그레이션 한정** — `/chemicals` 내 유사 chip은 스타일이 다르므로 별 cycle로 분리. ~45분 micro-cycle.
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
| **Problem** | 직전 cycle `quotes-source-filter-polish`에서 `FilterButton` helper에 focus-visible ring + brand-400/500 design tokens를 통합했지만, helper가 `QuoteIndex.tsx` 내부 비공개 함수로 남아 있어 재사용 불가. `/chemicals` ChemicalSearch.tsx의 카테고리/공정 chip(L149-163, L173-187)은 비슷한 토글 패턴이지만 인라인으로 작성되어 **focus-visible ring 부재(WCAG a11y debt)** 와 aria-pressed만 보유. 향후 다른 페이지에서 필터 chip이 필요할 때마다 인라인 중복 + a11y 누락 위험 반복. |
| **Solution** | `FilterButton` helper를 `src/components/ui/Chip.tsx`로 추출 + export. (a) `pressed` prop (= active) + `aria-pressed` 자동 부여 (b) `focus-visible:ring-2 ring-brand-400 + ring-offset` 캡슐화 (c) 디자인 토큰 (brand-500 active bg, slate-300 inactive border) 단일 정의 (d) `className` overrideable via `cn`. **본 cycle 마이그레이션 대상: `QuoteIndex.tsx`의 FilterButton 사용처만** (5 곳). `ChemicalSearch.tsx`는 outlined vs solid 스타일 차이 + lg:responsive 분기로 인해 별 cycle 분리. |
| **Function/UX Effect** | • `<Chip>` 컴포넌트로 5 호출 site (전체/책/OSHA/유형/챕터/필터 초기화)가 1줄로 단순화 • aria-pressed 자동 부여 → 스크린리더가 토글 상태 정확히 인지(`/quotes` chip을 키보드/스크린리더로 사용 시 active 상태 명시적 안내) • QuoteIndex.tsx LOC 감소 (`function FilterButton` 24 lines → import 1 line) • 디자인 토큰 캡슐화로 향후 chip 스타일 변경 시 단일 파일만 수정 |
| **Core Value** | UI primitive 컴포넌트의 점진적 추출 패턴 정착 — 기존 `Tag.tsx`(span)에 이은 두 번째 ui primitive(button). **"중복 발생 시 추출"** 원칙(반복되는 inline 스타일 ≥2 곳 = 추출 신호). 본 cycle은 1 곳 추출이지만, 추출 즉시 다음 cycle에서 ChemicalSearch 마이그레이션이 0 line design decision으로 가능 — **다음 cycle 비용 선결제**. 또한 직전 cycle의 a11y 패턴(focus-visible ring)을 컴포넌트 단위로 캡슐화하여 향후 사용자의 a11y 부재 패턴 차단. |

---

## 1. Overview

### 1.1 Purpose

직전 cycle `quotes-source-filter-polish` 다음 cycle 후보 b ("FilterButton을 `@/components/ui/Chip`으로 승격, 다른 페이지 재사용") 실행. 본 cycle은 **추출 + QuoteIndex 마이그레이션 한정** scope으로 micro-cycle 박스 유지. ChemicalSearch 마이그레이션은 스타일 분기가 추가 design decision이 필요해 별 cycle 분리.

### 1.2 Background

**현재 상태**:
- `src/components/quote-index/QuoteIndex.tsx:239-262` — `FilterButton` helper (24 lines), `cn` + `rounded-full border px-3 py-1` + active brand-500 bg + inactive border-slate-300 + focus-visible:ring-brand-400 + ring-offset-2
- `src/components/quote-index/QuoteIndex.tsx`에서 5 사용처: Source/Type/Chapter 필터 chip + 필터 초기화 등
- `src/components/ui/` 폴더 기존: `Card.tsx`, `Disclosure.tsx`, `Tag.tsx` — primitive 컴포넌트 위치
- `Tag.tsx`는 span 기반 (variant: critical/high/...). Chip은 button 기반 (interactive) — 역할 분리

**별 cycle 후보 (out of scope)**:
- `src/components/chemicals/ChemicalSearch.tsx:154-159, 178-183` — 카테고리/공정 chip 인라인
  - outlined가 아닌 solid 스타일 (border 없음, bg-slate-100 inactive)
  - `lg:rounded-md` + `lg:text-left` responsive (사이드바 레이아웃)
  - **focus-visible ring 없음 — a11y debt** (현재 cycle out of scope, 별 cycle에서 처리)
- `src/components/sources/SourcePicker.tsx` 등 (조사 결과 chip 스타일 아님)

### 1.3 Related Documents

- 직전 archive: `docs/archive/2026-05/quotes-source-filter-polish/` — FilterButton focus-visible 패턴 원형
- UI primitive 패턴 reference: `src/components/ui/Tag.tsx`, `src/components/ui/Card.tsx`

---

## 2. Scope

### 2.1 In Scope

#### 2.1.1 Chip 컴포넌트 신규 작성

- [ ] `src/components/ui/Chip.tsx` 신규
  - Props:
    - `pressed: boolean` (toggle 상태, aria-pressed 자동 부여)
    - `onClick: () => void` (필수)
    - `children: React.ReactNode`
    - `className?: string` (override 가능)
    - `as?: 'button'` (확장 여지, 기본 button)
    - `type?: 'button'` (기본 'button')
    - 기타 standard button HTMLAttributes (forwarded)
  - 스타일: 현 `FilterButton`과 100% 동일 (rounded-full + border + px-3 py-1 + focus-visible ring + active/inactive 분기)
  - aria-pressed: `pressed` prop에서 자동 부여
  - JSDoc: 사용 예 + variant 확장 여지 명시

#### 2.1.2 QuoteIndex 마이그레이션

- [ ] `QuoteIndex.tsx` 변경:
  - Line 1-9 imports에 `import { Chip } from '@/components/ui/Chip';` 추가
  - 5 FilterButton 사용처를 `<Chip pressed={...} onClick={...}>...` 로 치환
    - Source 필터 (전체/책/OSHA) 3 곳 — `active` prop → `pressed` prop으로 rename
    - Type 필터 (전체 유형/도입 인용/본문 인용) 3 곳
    - Chapter 필터 (전체 챕터 + 17 chapters) 1 + 17 곳
  - Line 239-262 `FilterButton` helper 삭제
  - **LOC delta**: −24 (helper 삭제) + 1 (import) ≈ −23

#### 2.1.3 검증

- [ ] `npm run extract:quotes`: 불필요 (코드만 변경)
- [ ] `npx tsc --noEmit`: 통과
- [ ] `npm run build`: 무경고
- [ ] 브라우저 spot check (Playwright dev:3016):
  - `/quotes` Tab navigation → Chip focus-visible ring 가시 (inactive + active 양쪽) — 직전 cycle 동등 동작
  - Source=OSHA + "summary" → 5건 노출 (회귀 없음)
  - 스크린샷 1장 (Tab 진입 후 Chip focus 캡처)

### 2.2 Out of Scope (별 cycle 분리)

| 항목 | 사유 |
|------|------|
| `ChemicalSearch.tsx` 카테고리/공정 chip 마이그레이션 | outlined vs solid 스타일 차이 + `lg:rounded-md lg:text-left` responsive 분기 → Chip variant 추가 또는 별도 컴포넌트 design decision 필요. 별 cycle `filter-button-promotion-chemicals`로 분리 |
| Chip variant 시스템 (`outlined`/`solid`/`ghost` 등) | 현재 사용처 1곳만으로는 YAGNI. 두 번째 사용처(ChemicalSearch 마이그레이션) cycle에서 자연스럽게 도출 |
| `ChipGroup` (role="group" + roving tabindex) | 현재 chip 그룹 a11y는 button + aria-pressed로 충분. 향후 키보드 좌우 화살표 네비게이션이 필요할 때 별 cycle |
| SourcePicker 등 다른 chip-like 컴포넌트 통합 | 조사 결과 chip 패턴 아님 (메뉴/선택) — 별 패턴 |
| Storybook/Component docs | UI primitive 문서화는 별 cycle |

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | `src/components/ui/Chip.tsx` 신규 — `pressed` prop + `onClick` + `className` + standard button HTMLAttributes forwarded | High | Pending |
| FR-02 | Chip 스타일 = 직전 cycle FilterButton과 100% 동일 (rounded-full border px-3 py-1 + active brand-500 + inactive slate-300 + focus-visible ring brand-400 + offset 2) | High | Pending |
| FR-03 | Chip은 `aria-pressed={pressed}` 자동 부여 (a11y 강화 — 현 FilterButton은 aria-pressed 없음) | High | Pending |
| FR-04 | Chip은 `type="button"` 기본값 (form 안에서 submit 회피) | Medium | Pending |
| FR-05 | Chip은 `className` prop으로 override 가능 (cn merge) | Medium | Pending |
| FR-06 | `QuoteIndex.tsx` 5 FilterButton 사용처(Source 3 + Type 3 + Chapter 18 + 필터 초기화)를 `<Chip>` 으로 치환 | High | Pending |
| FR-07 | `QuoteIndex.tsx` Line 239-262 `FilterButton` helper 삭제 | High | Pending |
| FR-08 | typecheck + build 무경고 통과 | High | Pending |
| FR-09 | 브라우저 spot check: `/quotes` Tab 포커스 + Source=OSHA + "summary" 회귀 없음 + 스크린샷 1장 | High | Pending |
| FR-10 | Chip JSDoc: 사용 예 + variant 확장 여지 명시 | Low | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement |
|----------|----------|-------------|
| A11y | aria-pressed 정확 + focus-visible ring 가시 (직전 cycle 수준 유지) | Playwright + 수동 |
| 코드 품질 | LOC 감소 (QuoteIndex.tsx −24 + Chip.tsx +30 = net +6, 하지만 재사용 가능) | git diff |
| Bundle | /quotes 페이지 크기 변화 ≤ 0.2 kB (단순 추출, 동일 코드) | build output |
| 회귀 | 직전 cycle FR/NFR 모두 유지 | spot check |
| 시간 | 총 작업 ≤ 45분 | time box |
| Convention | UI primitive 컴포넌트 컨벤션 (Tag.tsx 패턴 일관) | code review |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] `Chip` 컴포넌트 export — JSDoc 포함
- [ ] QuoteIndex.tsx 23 FilterButton 사용처(Source 3 + Type 3 + Chapter 18 + 필터 초기화 0) → 모두 `<Chip>` 치환
  - 정확히 세어보면: Source 3, Type 3, Chapter 18 (=1+17), 필터 초기화는 별도 단순 button (chip 아님 — out of scope)
  - 합계: **24 chip 사용처** (헤더 + 17 chapters)
- [ ] `FilterButton` helper 삭제
- [ ] aria-pressed 자동 부여 검증 (DOM inspector or Playwright)
- [ ] focus-visible ring 직전 cycle 동등 동작 (스크린샷 1장)
- [ ] gap-detector Match Rate ≥ 95%
- [ ] 총 작업 시간 ≤ 45m

### 4.2 Quality Criteria

- [ ] Chip JSDoc에 변형 시 별 cycle 분리 권고 명시 (현 cycle scope 명문화)
- [ ] QuoteIndex.tsx import order 컨벤션 (lib → components → utils) 유지
- [ ] 다크 모드 일관성 (focus-visible offset-slate-900 유지)
- [ ] 직전 cycle 패턴 (focus-visible ring + brand-400) 그대로 캡슐화 — 시각 변화 0

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| `active` prop → `pressed` prop rename으로 호출 site 5곳 모두 수정 누락 | Medium | Low | grep으로 `FilterButton` 호출 site 일괄 검색 후 일괄 치환. typecheck로 누락 자동 감지 |
| aria-pressed 추가가 기존 스크린리더 동작에 영향 (예: 토글 발화 변화) | Low | Low | aria-pressed는 표준 — 오히려 정확한 동작. 직전 cycle은 aria-pressed 부재가 minor a11y gap이었음 |
| Chip 스타일이 향후 다른 페이지에서 variant 필요 (ChemicalSearch solid 스타일) | Medium | High | 본 cycle은 outlined 단일 variant만. variant 시스템은 두 번째 사용처 cycle에서 자연 도출 — YAGNI 준수 |
| 직전 cycle 5 chip의 미세 스타일 (예: chapter chip이 다름)이 추출 시 손실 | Low | Low | 직전 cycle FilterButton은 모든 사용처에서 동일 클래스. 차이 없음 — 안전 |
| 작업 시간 45m 초과 | Low | Low | 시간 박스. 마이그레이션 5곳은 단순 치환 — 15m 예상 |
| Chip을 forwardRef 미지원 → 향후 라이브러리 통합 시 제약 | Low | Low | 현재 ref 필요 사용처 0 — 향후 cycle에서 추가 가능 (YAGNI) |

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
| Chip 위치 | `src/components/ui/Chip.tsx` | 기존 Tag/Card/Disclosure와 동일 폴더 — UI primitive 컨벤션 |
| Prop 이름 (`active` vs `pressed`) | **`pressed`** | aria-pressed semantics와 일치. WAI-ARIA Authoring Practices 권장 |
| variant 시스템 | **단일 variant (outlined)** | 본 cycle은 추출만. ChemicalSearch가 두 번째 사용처가 되면 그때 variant 도출 |
| ref forwarding | **미포함** | 현 사용처 0 (YAGNI). 향후 cycle에서 추가 |
| ChemicalSearch 마이그레이션 | **별 cycle** | 스타일 차이(solid vs outlined) + responsive 분기 → design decision 추가 필요, micro-cycle 박스 초과 위험 |
| 컴포넌트 이름 | **Chip** (Button 아님) | Material UI/MUI 컨벤션. Tag(non-interactive) vs Chip(interactive) 명확 |

### 6.3 Folder Structure (변화분)

```
src/
  components/
    ui/
      Card.tsx
      Chip.tsx                          ← NEW
      Disclosure.tsx
      Tag.tsx
    quote-index/
      QuoteIndex.tsx                    ← EDIT (FilterButton 삭제, Chip import + 5 사용처 치환)
```

---

## 7. Convention Prerequisites

기존 컨벤션 그대로:
- UI primitive 컴포넌트는 `@/components/ui/` (Tag.tsx 패턴)
- PascalCase 컴포넌트, camelCase props
- `cn`으로 className merge
- 디자인 토큰 100% 재사용 (brand-400/500, slate-300/700/800/900)
- 신규 ENV 0개

본 cycle 추가:
- 토글형 chip은 `pressed` prop + `aria-pressed` 자동 부여 (Button과 구분)
- Chip JSDoc에 variant 확장 권고 명시 (별 cycle 분리 트리거)
- 마이그레이션 시 grep으로 호출 site 일괄 검색 후 치환 (누락 방지)

---

## 8. Next Steps

1. [ ] 본 Plan 사용자 검토 및 승인
2. [ ] `/pdca design filter-button-promotion` (선택 — micro-cycle이므로 생략 가능, Plan 만으로 do 진입)
3. [ ] `/pdca do filter-button-promotion` — ~45m 구현
4. [ ] gap-detector → Match Rate ≥ 95%
5. [ ] `/pdca report` → `/pdca archive --summary`

### 후속 cycle 후보 (별 cycle)

| 우선순위 | Cycle | 범위 |
|:---:|-------|------|
| **a** | `filter-button-promotion-chemicals` | ChemicalSearch 카테고리/공정 chip을 Chip + variant='solid' 로 마이그레이션. focus-visible ring 자동 적용 + aria-pressed 통일. **본 cycle에서 Chip이 추출되었으므로 design decision = variant 추가 1건만** (~30m) |
| **b** | `chip-variant-system` | (선택) outlined/solid/ghost 3 variant + size sm/md 도입. ChemicalSearch 마이그레이션 cycle에서 자연 도출되면 통합 |
| **c** | `chip-group-roving-tabindex` | (선택) 키보드 좌우 화살표 네비게이션 추가 (chip 다수 그룹의 a11y) |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-30 | 초안: FilterButton helper → @/components/ui/Chip 추출 + QuoteIndex 5 사용처 마이그레이션. **본 cycle scope: QuoteIndex 한정** (ChemicalSearch는 스타일 차이로 별 cycle 분리). 10 FR + 6 NFR + 6 Risk. 45m micro-cycle, design skip 가능 | DrunkenZealnut |
