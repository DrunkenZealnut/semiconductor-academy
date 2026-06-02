---
template: analysis
version: 1.0
description: PDCA Check — quotes-source-filter-polish Gap analysis (Plan vs Implementation, micro-cycle)
variables:
  feature: quotes-source-filter-polish
  date: 2026-05-30
  author: gap-detector
  project: semiconductor-academy
  matchRate: 99
---

# Gap Analysis: quotes-source-filter-polish

**Analysis Date**: 2026-05-30
**PDCA Phase**: Check (Micro-cycle)
**Branch**: main
**Plan**: `docs/01-plan/features/quotes-source-filter-polish.plan.md` (v0.1)
**Design**: N/A (Micro-cycle, skipped per Plan §8)
**Inherits**: `docs/archive/2026-05/quotes-source-filter/` (Match Rate 95%, Minor 5 → polish 3건)
**Cycle type**: Micro-cycle 30~45m box

> **Result**: **Match Rate 99% — Ship-ready ✅** · Critical 0 · Major 0 · Minor 1 · Bonus +5

---

## 1. FR Match Matrix (Plan §3.1)

| ID | 요구사항 | Status | Evidence |
|----|---------|:------:|----------|
| FR-01 | `FilterButton` className에 `focus-visible` ring 4 utility (outline-none + ring-2 brand-400 + ring-offset-2 + dark ring-offset) | ✅ Pass | `QuoteIndex.tsx:254` 4 utility 모두 1 line으로 추가. brand-400 ring, ring-offset-2, dark:ring-offset-slate-900 모두 포함 |
| FR-02 | part-1b partTitle → 'Part 1B · Communication, Controls, and Emergency Procedures' | ✅ Pass | `extract-quotes.mjs:40` "Procedures" 추가. quotes.json grep: 5 hits (5 part-1b card) |
| FR-03 | part-2 partTitle → 'Part 2 · Chemical Hazards, Controls, and Emergency Actions' | ✅ Pass | `extract-quotes.mjs:41` "Actions" 추가. grep: 5 hits (5 part-2 card). 총 Procedures+Actions = 10 hits |
| FR-04 | extract-quotes.mjs 헤더 주석 강화 (sources.ts 단일 진실 명시 + 풀 텍스트 미러 강조) | ✅ Pass | `extract-quotes.mjs:11-16` 6줄 주석: "Single source of truth: src/lib/sources.ts", scripts→TS 경계 회피 이유, cross-link-system 동일 패턴 명시, "변경 시 양쪽 동시 수정 + extract:quotes 검증" 운영 가이드 포함 |
| FR-05 | `npm run extract:quotes` + quotes.json 풀 텍스트 검증 | ✅ Pass | 117 quotes (불변), 0 selector miss. grep Procedures/Actions 10 hits. partTitle 5/5 sources.ts와 일치 |
| FR-06 | `/quotes` Tab navigation FilterButton 포커스 ring 가시성 | ✅ Pass | Playwright MCP 실측: brand-400 ring 명확. Inactive chip(흰 bg) + Active chip(brand-500 bg) 양쪽에서 ring-offset-2로 분리 식별 |
| FR-07 | Source=OSHA + "summary" 검색 → 5 Part Course Summary 노출 | ✅ Pass (Bonus 폴리시 덕에 실제 작동) | Fuse 시뮬레이션 "summary": 0→5 hits (모두 OSHA summary). 브라우저 실측 "5개 결과" — Part 1A/1B/2/3/4 Course Summary 카드, 각 sectionRef "Course Summary" 표시 |
| FR-08 | typecheck + build 무경고 | ✅ Pass | `npx tsc --noEmit` pass, `npm run build` pass (warning 0), /quotes 6.73→6.76 kB |
| FR-09 | 78 routes prerender 유지 | ✅ Pass | 78/78 static pages prerendered |

**FR 충족**: **9/9 (100%)**

---

## 2. NFR Match Matrix (Plan §3.2)

| Category | Criteria | 측정 결과 | Status |
|---------|---------|----------|:---:|
| A11y (Focus Visible) | WCAG 2.1 AA SC 2.4.7 충족 | Playwright 3 스크린샷 검증. brand-400 ring + 2px offset로 active/inactive 양쪽 시각 식별 | ✅ |
| Data Integrity | OSHA 26 quote 모두 풀 partTitle (sources.ts 1:1) | grep "Procedures" 5 + "Actions" 5 = 10. 5/5 일치 | ✅ |
| Build | 무경고 통과 | `npm run build` warning 0 | ✅ |
| Bundle | /quotes ≤ 0.5 kB 증가 | 6.73 → 6.76 kB = **+30 bytes** (한도의 6%) | ✅ |
| 회귀 | 직전 cycle FR-01~10 모두 유지 | 117 quotes 불변, BookQuoteCard 디자인 유지, Source 필터 작동 유지 | ✅ |
| 시간 | ≤ 45m | **실측 ~30m** (33% 여유) | ✅ |

**NFR 충족**: **6/6 (100%)**

---

## 3. Bonus 폴리시 평가: `OSHA_KIND_DEFAULT_REF`

### 3.1 개요

`extract-quotes.mjs:268-298` 영역에 Plan §2.1에 명시되지 않은 **+5 line 신규 코드**:

```js
const OSHA_KIND_DEFAULT_REF = {
  overview: 'Course Overview',
  'learning-objectives': 'Learning Objectives',
  summary: 'Course Summary',
};
function makeOshaQuote(partMeta, kind, rawText, sectionRef) {
  ...
  const finalRef = sectionRef ?? OSHA_KIND_DEFAULT_REF[kind];
  const slug = finalRef ? slugify(finalRef) : kind;
  ...
}
```

### 3.2 가치 vs Scope Creep 분석

| 차원 | 평가 |
|------|------|
| **발견 경위** | Plan FR-07 검증 중 발견. Fuse 시뮬레이션 결과 "summary" 0 hits — Plan §5 risk가 가정한 "Course Summary 검색" fallback도 0 hits |
| **근본 원인** | Overview/LO/Summary entries에 `sectionRef`/`section` 메타 부재 → Fuse 검색 키 0 → 사용자가 검색으로 도달 불가 |
| **수정 규모** | +5 lines (constant 3 entries + makeOshaQuote 분기 2 lines) |
| **Scope 영향** | Plan §2.1.3은 "검증"만 명시. 검증 실패하면 별 cycle 분리가 보수적 접근. 그러나 5 lines minimal patch로 FR-07 진정 실현 가능 |
| **가치 1: FR-07 진정 실현** | Fuse "summary": 0→5, "Course Summary": 0→5, "overview": 5 (덤), "learning": 7 (덤) |
| **가치 2: UI 일관성** | 26 OSHA quote 모두 sectionRef 보유 → 카드 헤더 항상 sectionRef heading 표시 |
| **가치 3: Extensibility** | Definition selector matrix와 통일된 메타데이터 구조. 향후 SEMI/KOSHA onboarding 시 동일 패턴 재사용 |
| **부수효과 (ID 변경)** | `osha-scs::part-1a::summary::summary` → `osha-scs::part-1a::summary::course-summary`. **deeplink 없음, 영향 0** |
| **위험** | 없음. JSDoc 4 line 주석으로 의도 명시됨 |

### 3.3 판정: **Bonus +5 가치 인정**

- Plan FR-07이 처음부터 작동 안 했고, 검증 단계에서 문제를 발견했을 때 minimal patch로 해결한 것은 micro-cycle 정신("polish 부채 0건 유지")에 부합
- Scope creep 위험은 낮음: ① 변경 규모 5 lines ② Definition entries 영향 0 ③ deeplink 영향 0 ④ 헤더 주석으로 의도 명시
- **권고**: Report 단계에서 Bonus 폴리시를 별도 섹션으로 명문화

---

## 4. Browser 실측 분석 (Playwright MCP, dev:3016)

| 스크린샷 | 검증 항목 | 결과 |
|---------|---------|------|
| `quotes-source-filter-polish-happy-c.png` | Source=OSHA + "summary" → 5 결과 | ✅ 5 Part Course Summary 카드 노출. sectionRef "Course Summary" 표시. 풀 partTitle ("Procedures"/"Actions" 포함) chip 노출. EN badge + partHref 정확. **FR-07 + FR-02/03 + Bonus 폴리시 동시 검증** |
| `quotes-source-filter-polish-focus-visible.png` | Inactive FilterButton(흰 bg) Tab 포커스 | ✅ brand-400 ring + 2px offset 명확히 식별. **FR-06 inactive 검증** |
| `quotes-source-filter-polish-focus-active.png` | Active FilterButton(brand-500 bg) Tab 포커스 | ✅ ring-offset-2의 흰 여백이 ring과 active bg를 분리 → WCAG 2.1 AA Focus Visible 충족. Plan §5 risk("focus-visible ring이 active 상태에서 흐릿함") 해소 확인. **FR-06 active 검증** |

**스크린샷 3장 모두 docs/04-report/assets/ 저장 — Report 단계 자산 준비 완료**

---

## 5. Plan §5 Risk 해소 검증

| Risk | 예상 영향 | 실측 결과 | Status |
|------|----------|----------|:---:|
| partTitle 풀 텍스트가 chip width 초과 | Low/Medium | flex-wrap 컨테이너로 자연 흡수, 줄바꿈 없음 | ✅ Resolved |
| focus-visible ring이 active bg에서 흐릿함 | Medium/Low | ring-offset 2px 분리로 active 카드도 ring 명확 | ✅ Resolved |
| Tailwind safelist 누락 | Low/Low | JIT가 자동 감지 — build 무경고 | ✅ Resolved |
| Happy C 결과 정확히 5건이 아님 | Low/Low | "summary" 검색 5건 정확. Bonus 폴리시 덕에 의도대로 작동 | ✅ Resolved |
| 작업 시간 45m 초과 | Low/Low | 실측 ~30m | ✅ Resolved |

**Risk 5/5 모두 해소**

---

## 6. Gaps by Severity

### Critical (Δ −15 each)
없음.

### Major (Δ −5 each)
없음.

### Minor (Δ −1 each)

| # | 항목 | 위치 | 설명 |
|---|------|------|------|
| M1 | Bonus 폴리시(`OSHA_KIND_DEFAULT_REF`)가 Plan §2.1에 명시되지 않은 신규 코드 | `extract-quotes.mjs:268-298` | Scope creep 위험은 §3 분석으로 무력화됐으나, 엄밀한 Plan-Do 매칭 관점에서 "Plan에 없던 코드 +5 lines" 추가 = Minor gap. Report에 별도 섹션으로 명문화 권고 |

**Severity 합계**: Critical 0, Major 0, Minor 1, Bonus +5 (FR-07 진정 실현 +3, UI 일관성 +1, Extensibility +1)

---

## 7. Match Rate 계산

| 영역 | 비중 | 점수 |
|------|:--:|:--:|
| FR-01~09 (9 of 9) | 40% | 40/40 |
| NFR 6/6 | 15% | 15/15 |
| Browser 실측 (스크린샷 3장) | 15% | 15/15 |
| Risk 해소 5/5 | 10% | 10/10 |
| 데이터 정합성 (partTitle 5/5, sectionRef 26/26) | 10% | 10/10 |
| Scope adherence (Plan vs Do) | 10% | 9/10 (M1 −1) |
| **합계** | 100% | **99/100** |

가중치 시작 100 → Critical −15×0 + Major −5×0 + Minor −1×1 = **99**
Bonus +5는 가치 인정하되 cap 100을 넘지 않도록 보수적으로 **99** 유지.

### **최종 Match Rate: 99%** ✅ (≥ 90% Ship-ready)

---

## 8. Recommendation: **Pass to Report**

Match Rate 99%. 90% 임계 초과. Iterate 불요.

**다음 명령**: `/pdca report quotes-source-filter-polish`

### Report 단계 권고 사항

1. **Bonus 폴리시 별도 섹션 명문화** — `OSHA_KIND_DEFAULT_REF` 발견 경위 + 가치 + 부수효과 0 검증을 Report "Bonus Polish" 섹션에 기록
2. **Plan-Do 매칭 정책 정립** — micro-cycle 검증 단계 중 5 lines 이하 minimal fix는 in-scope 허용. 큰 변경은 별 cycle로 분리
3. **스크린샷 3장 Report에 첨부** — `docs/04-report/assets/quotes-source-filter-polish-{happy-c,focus-visible,focus-active}.png`
4. **Plan §8 Next Steps 갱신** — design 단계 skip 명시적 허용이 30m 달성에 기여한 것 회고

### 후속 cycle 후보 (별 cycle 분리)

- `quotes-osha-definition-expansion` (Part 1B definition 추가 — 본 cycle은 polish 한정으로 out of scope 유지)
- `filter-button-promotion` (FilterButton을 `@/components/ui/Chip`으로 승격, 다른 페이지 재사용 — 본 cycle out of scope)

---

## 9. 회고: Micro-cycle 효과

| 항목 | 결과 |
|------|------|
| Design phase skip 허용 (Plan §8) | 시간 ~15m 절감 → 30m 달성에 기여 |
| 30~45m 시간 박스 | 30m 실측 — 박스 33% 여유 |
| 검증 단계에서 발견한 문제의 minimal fix | Bonus 폴리시 +5 lines, FR-07 진정 실현 |
| 누적 polish 부채 | 직전 cycle 5건 중 3건 처리 → 잔존 2건(M2 selector 변경 명문화, M3 단일 컴포넌트 vs 분리 표기). Critical 아니므로 다음 polish cycle 또는 docs 단계에서 처리 |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-30 | 초안: micro-cycle gap analysis. FR 9/9, NFR 6/6, Bonus 폴리시 +5 가치 인정, Minor 1 (Plan 미명시 코드), Match Rate 99%, Pass to Report 권고 | gap-detector |
