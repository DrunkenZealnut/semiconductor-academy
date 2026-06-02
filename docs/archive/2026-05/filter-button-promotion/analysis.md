---
template: analysis
version: 1.0
description: PDCA Check — filter-button-promotion Gap analysis (Plan vs Implementation, micro-cycle #2)
variables:
  feature: filter-button-promotion
  date: 2026-05-31
  author: gap-detector
  project: semiconductor-academy
  matchRate: 99
---

# Gap Analysis: filter-button-promotion

**Analysis Date**: 2026-05-31
**PDCA Phase**: Check (Micro-cycle #2)
**Branch**: main
**Plan**: `docs/01-plan/features/filter-button-promotion.plan.md` (v0.1)
**Design**: N/A (Micro-cycle, skipped per Plan §8)
**Inherits**: `docs/archive/2026-05/quotes-source-filter-polish/` — FilterButton focus-visible 패턴 원형
**Cycle type**: Micro-cycle ≤45m box

> **Result**: **Match Rate 99% — Ship-ready ✅** · Critical 0 · Major 0 · Minor 1

---

## 0. Executive Summary

| 항목 | 결과 |
|------|------|
| **Match Rate** | **99%** ✅ |
| **Critical** | 0 |
| **Major** | 0 |
| **Minor** | 1 (Plan §2.1.2 "5 사용처" vs §4.1 "24 사용처" 본문 self-correction 흔적) |
| **시간 박스** | 30m / 45m (67% 사용, 33% 여유) |
| **Bonus 정책** | 없음 — Plan대로 정확히 실현. aria-pressed 자동 부여는 Plan FR-03 그대로 실현된 부수 가치 |
| **빌드 검증** | ✅ 78/78 static, /quotes 6.76 → 6.78 kB (+20 B, NFR ≤200 B의 10%) |
| **권고** | `/pdca report filter-button-promotion` 진행 — Pass to Report |

### 핵심 발견 Top 3

1. **FR 10/10 + NFR 6/6 + Risk 6/6 모두 해소** — Plan 미명시 fix 없이 깔끔한 scope adherence. Bonus 정책 없음 (직전 cycle과 동일한 절제).
2. **aria-pressed 자동 부여로 a11y 개선** — Plan FR-03 그대로 실현되었으며, Playwright snapshot이 `[pressed]` annotation 자동 출력으로 검증. 직전 cycle FilterButton에 부재했던 ARIA semantics 정착.
3. **micro-cycle 박스 검증 2회 연속** — Design skip + 30m 실측. Plan §8 design-skip 명시 허용이 박스 단축에 실효 기여.

---

## 1. FR Match Matrix (10 FR)

| FR | 요구사항 | 구현 위치 | 증거 | 상태 |
|----|---------|---------|------|----|
| FR-01 | `Chip.tsx` 신규 — `pressed` prop + `className` + standard button HTMLAttributes forwarded | `Chip.tsx:21-23` `interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' \| 'aria-pressed'>` | `pressed: boolean` 필수 + `...props` spread (L38) | ✅ |
| FR-02 | Chip 스타일 = 직전 cycle FilterButton과 100% 동일 | `Chip.tsx:31-35` `rounded-full border px-3 py-1` + brand-500 active / slate-300 inactive + focus-visible ring-brand-400 | 직전 archive FilterButton 클래스와 1:1 매칭, dark variant 포함 | ✅ |
| FR-03 | aria-pressed 자동 부여 | `Chip.tsx:29` `aria-pressed={pressed}` | Playwright snapshot에서 active chip만 `[pressed]` annotation 출력 (3개: 전체 117 / 전체 유형 / 전체 챕터) | ✅ |
| FR-04 | `type="button"` 기본값 | `Chip.tsx:28` 하드코딩, `Omit<..., 'type' \| ...>`로 외부 override 차단 | form submit 회피 보장 | ✅ |
| FR-05 | `className` override via cn merge | `Chip.tsx:25, 36` `cn(...base, className)` | merge order: base → className (override 가능) | ✅ |
| FR-06 | QuoteIndex 24 chip 사용처 치환 (Source 3 + Type 3 + Chapter 18) | `QuoteIndex.tsx:138, 145, 160, 166, 172, 181, 188` (7 JSX site, 2개가 `.map()`으로 다중 렌더) | grep 14 라인 매치 = 7 open + 7 close; 인스턴스 24 chip | ✅ |
| FR-07 | FilterButton helper 삭제 (+ cn import 제거) | QuoteIndex.tsx에서 `FilterButton` grep 0, `cn` import 0 | helper 24 라인 완전 삭제 | ✅ |
| FR-08 | typecheck + build 무경고 | `npx tsc --noEmit` pass / `npm run build` 78 pages pass | Do phase 기록 | ✅ |
| FR-09 | 브라우저 spot check + 회귀 + 스크린샷 | `docs/04-report/assets/filter-button-promotion-chip-focus.png` 존재 + Source=OSHA 5건 회귀 0 | 자산 파일 + Playwright snapshot | ✅ |
| FR-10 | Chip JSDoc (사용 예 + variant 확장 권고) | `Chip.tsx:4-20` 7-line JSDoc + `@example` 블록 + "introduce a `variant` prop in a separate cycle" 권고 | 별 cycle 분리 트리거 명문화 | ✅ |

**FR 결과: 10 / 10 = 100%**

---

## 2. NFR Match Matrix (6 NFR)

| NFR | 기준 | 실측 | 결과 |
|----|------|------|----|
| A11y | aria-pressed + focus-visible ring 직전 cycle 동등 이상 | aria-pressed: Playwright 자동 출력 (개선) / focus-visible: ring-2 brand-400 + offset-2 + dark offset 유지 | ✅ 개선 |
| 코드 품질 (LOC) | QuoteIndex −24, Chip +30, net 재사용 가능 | QuoteIndex.tsx −23 (helper 24 - import 1) / Chip.tsx +43 (Plan 45 ±2) / **재사용 가능** | ✅ |
| Bundle | /quotes ≤ +0.2 kB | 6.76 → 6.78 kB = **+20 B (NFR 200 B의 10%)** | ✅ |
| 회귀 | 직전 cycle FR/NFR 모두 유지 | Source=OSHA + "summary" → 5건 노출 / Tab → brand-400 ring 동등 | ✅ |
| 시간 | ≤ 45m | 30m (67% 사용, 33% 여유) | ✅ |
| Convention | Tag.tsx 패턴 일관 | `src/components/ui/` 위치 / `interface ChipProps extends Omit<...>` 패턴 / PascalCase / cn 사용 | ✅ |

**NFR 결과: 6 / 6 = 100%**

---

## 3. Plan §5 Risk Status (6 risks)

| Risk | 예상 영향 | 실측 결과 | 상태 |
|----|---------|---------|----|
| `active`→`pressed` rename 누락 | Medium | typecheck pass = 24 사용처 모두 정확히 rename | ✅ 해소 |
| aria-pressed 스크린리더 영향 | Low | 표준 ARIA. Playwright snapshot이 자연스럽게 annotation 노출 → 명료성 ↑ | ✅ 해소 (positive) |
| variant 부재 → ChemicalSearch 마이그레이션 시 design decision 추가 | Medium | 본 cycle scope = outlined만. JSDoc에 "별 cycle에서 variant 도입" 권고 명문화 (FR-10) | ✅ 의도된 trade-off |
| 직전 cycle chip 미세 스타일 손실 | Low | 직전 FilterButton은 모든 사용처 동일 클래스. 차이 0 | ✅ 해소 |
| 시간 박스 45m 초과 | Low | 30m 완료 = 33% 여유 | ✅ 해소 |
| ref forwarding 미지원 | Low | 현 사용처 0 → YAGNI 유지 | ✅ 의도된 trade-off |

**Risk 결과: 6 / 6 = 100%**

---

## 4. Browser 실측 분석 (Playwright MCP)

### 4.1 aria-pressed Snapshot 평가

| Chip | 상태 | snapshot annotation | 평가 |
|------|------|---------------------|------|
| "전체 117" | sourceFilter='all' (pressed=true) | `[pressed]` | ✅ 정확 |
| "전체 유형" | typeFilter='all' (pressed=true) | `[pressed]` | ✅ 정확 |
| "전체 챕터" | chapterFilter=null (pressed=true) | `[pressed]` | ✅ 정확 |
| 비활성 chip 21개 | pressed=false | annotation 없음 | ✅ 정확 (false 시 미표기 ARIA spec 부합) |

**결론**: WAI-ARIA `aria-pressed` semantics 완전 준수. 직전 cycle 대비 명확한 a11y 개선.

### 4.2 회귀 검증

- Source=OSHA + "summary" → 5건 노출 (직전 cycle 동일)
- Tab navigation → "📖 책 91" chip brand-400 ring 가시 (직전 cycle 동일)
- 스크린샷: `docs/04-report/assets/filter-button-promotion-chip-focus.png`

---

## 5. Bonus 평가

| 항목 | 평가 |
|------|------|
| **Bonus 폴리시** | 없음 — Plan대로 정확히 실현, scope 추가 0 |
| **부수 가치** | `aria-pressed` 자동 부여 = 직전 cycle FilterButton에 부재했던 a11y 패턴이 컴포넌트 단위로 캡슐화되어 **향후 모든 사용처에 자동 전파**. Plan FR-03으로 명시되었으나, 직전 cycle 대비 비교 시 부가 가치로 평가 가능 |
| **Scope adherence** | ChemicalSearch는 Plan §2.2대로 본 cycle 미진입. variant 시스템도 YAGNI 준수. Plan §1.1 "추출 + QuoteIndex 마이그레이션 한정" 정확 실현 |

**평가**: Bonus 정책 없음에도 Plan FR가 a11y 개선을 명시적으로 포함 → "검증된 Bonus pre-planning" 패턴. 직전 cycle minor gap(aria-pressed 부재)을 본 cycle Plan이 사전에 close.

---

## 6. Gaps by Severity

### Critical (Δ −15, count: 0)
없음.

### Major (Δ −5, count: 0)
없음.

### Minor (Δ −1, count: 1)

| ID | 설명 | 영향 |
|----|------|------|
| M-01 | Plan §2.1.2 본문이 "5 FilterButton 사용처"라 적었으나 §4.1 DoD에서 self-correct하여 "24 chip 사용처"로 정정. 실제 구현은 24 — DoD 기준 정확. Plan 본문 산정 오류는 self-correction으로 문서 내 정합성 확보됨 | Plan 본문 미세 incosistency, 구현 영향 0 |

---

## 7. Match Rate 계산

```
시작 점수           : 100
Critical (0 × −15) :   0
Major    (0 × −5)  :   0
Minor    (1 × −1)  :  −1
─────────────────────────
Match Rate         : 99%
```

**임계치**: ≥ 90% → **Pass to Report**
**Plan 예상**: ≥ 95% → **달성 (예상 초과 +4%p)**

### **최종 Match Rate: 99%** ✅

---

## 8. Recommendation: **Pass to Report**

`/pdca report filter-button-promotion` → `/pdca archive filter-button-promotion --summary`

### 후속 cycle 후보 (Plan §8 유효)

| 우선순위 | Cycle | 비고 |
|:---:|------|------|
| **a** | `filter-button-promotion-chemicals` | ChemicalSearch chip 마이그레이션. **본 cycle에서 Chip 추출 완료 → variant='solid' 1건만 design decision** (~30m 예상) |
| **b** | `chip-variant-system` | (a) cycle에서 자연 도출되면 통합 |
| **c** | `chip-group-roving-tabindex` | (선택) 키보드 좌우 화살표 a11y |

### Plan 문서 보정 (선택)

- Plan §2.1.2 "5 사용처" 표현이 §4.1 "24 사용처"와 불일치 (M-01). 향후 동일 패턴 Plan 작성 시 초기 산정에서 `.map()` 다중 렌더링 카운트 분명히 표기 권고

---

## 9. micro-cycle 회고 (두 번째 적용)

### 9.1 Design phase skip 효과

| 항목 | 직전 cycle (`quotes-source-filter-polish`) | 본 cycle (`filter-button-promotion`) |
|------|----------------------------------------|----------------------------------|
| Design 문서 | skip | skip |
| 실측 시간 | ~30m (NFR 45m의 67%) | 30m (NFR 45m의 67%) |
| Plan FR 수 | 약 10 | 10 |
| Match Rate | 99% | 99% |
| Plan §8 design-skip 명시 | ✅ | ✅ |

**검증 결과**: micro-cycle 2회 연속 박스 33% 여유 + Match Rate 99% 달성. **Plan §8의 design-skip 명시 허용이 박스 단축의 실효 메커니즘**. Plan 단계에서 FR/NFR/Risk + Architecture decisions를 상세히 작성하면 별도 Design 없이도 Do 진입 가능 패턴 확립.

### 9.2 micro-cycle 적용 기준 (관찰)

- ✅ Scope 단일 (1 컴포넌트 추출 + 1 파일 마이그레이션)
- ✅ 디자인 결정 0 (직전 cycle 토큰 100% 재사용)
- ✅ 신규 API/DB/외부 통합 0
- ✅ 회귀 위험이 spot check로 충분히 검증 가능
- ✅ Plan §6.2에 Architecture decisions 사전 명문화 (variant/ref/위치 등)

### 9.3 누적 학습

- 직전 cycle 패턴(focus-visible ring)이 본 cycle에서 **컴포넌트 단위로 캡슐화**되어 향후 cycle 비용 선결제
- 다음 ChemicalSearch cycle은 variant 1건만 design decision 추가 → micro-cycle 가능성 ↑
- "추출 즉시 다음 cycle 비용 선결제"는 Plan Executive Summary의 핵심 가치 주장이었고, 본 cycle 결과로 실증됨

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-31 | 초안. Match Rate 99% (Critical 0 / Major 0 / Minor 1). FR 10/10 + NFR 6/6 + Risk 6/6 모두 해소. micro-cycle 2회 연속 성공 검증 | gap-detector |
