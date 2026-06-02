# Archive: quotes-source-filter-polish

> 직전 archived cycle `quotes-source-filter`(95%)의 Minor 5건 중 polish 3건 처리. FilterButton focus-visible ring 추가(WCAG 2.1 AA), OSHA_PART_META partTitle을 sources.ts와 풀 텍스트 동기화, Source=OSHA + "summary" Happy C 시나리오 실측. **Bonus**: 검증 중 Happy C 미작동 발견 → OSHA_KIND_DEFAULT_REF +5 lines minimal patch로 FR-07 진정 실현. 30분 micro-cycle, 99% Match Rate.

**Archived**: 2026-05-30
**Phase**: completed
**Match Rate**: 99% (FR 9/9, NFR 6/6, Risk 5/5 해소, Minor 1, Bonus +5)
**Iteration**: 0 (첫 통과)
**Duration**: **~30분** (Plan → Do → Check → Report, 45m 박스의 67%)
**Level**: Dynamic
**Cycle Type**: **Micro-cycle** (Design phase skipped per Plan §8)
**Branch**: main
**Inherits**: [quotes-source-filter archive](../quotes-source-filter/) (Minor 5건 중 3건 polish)

---

## 결과 요약

| 지표 | 결과 |
|------|:---:|
| Match Rate | 99% |
| FR coverage | 9/9 ✅ |
| NFR coverage | 6/6 ✅ |
| Plan §5 Risk 해소 | 5/5 ✅ |
| Browser 실측 (Playwright) | 3 screenshots ✅ |
| Convention Compliance | 100% |
| Critical / Major / Minor | 0 / 0 / 1 |
| Bonus 폴리시 | +5 (가치 인정) |
| LOC delta | +9 lines |
| Bundle delta | +30 bytes (한도 500B의 6%) |
| typecheck / build | 모두 통과 (무경고) |
| 기존 URL 회귀 | 0건 |

---

## 구현 산출물

### Code

| 종류 | 파일 | 비고 |
|------|------|------|
| EDIT | `src/components/quote-index/QuoteIndex.tsx:254` | FilterButton className에 `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900` 추가 (+1 line) |
| EDIT | `scripts/extract-quotes.mjs:11-16` | 헤더 주석 강화 (Single source of truth: src/lib/sources.ts 명시 + scripts→TS 경계 회피 이유) |
| EDIT | `scripts/extract-quotes.mjs:40-41` | OSHA_PART_META part-1b/part-2 partTitle 풀 텍스트 (sources.ts 100% 일치) |
| **BONUS** | `scripts/extract-quotes.mjs:268-298` | `OSHA_KIND_DEFAULT_REF` 신규 + makeOshaQuote 분기 (+5 lines). Overview/LO/Summary가 sectionRef 없으면 'Course Overview'/'Learning Objectives'/'Course Summary' 자동 부여 |

### Data

| 종류 | 파일 | 비고 |
|------|------|------|
| REGENERATED | `src/data/quotes.json` | 117 entries (불변). 26 OSHA entries 모두 풀 partTitle + 100% sectionRef 보유 (이전: 17/26 Definition만) |

### Verification Assets

| 파일 | 내용 |
|------|------|
| `assets/quotes-source-filter-polish-happy-c.png` | Source=OSHA + "summary" → 5 Part Course Summary 노출 (sectionRef 표시, 풀 partTitle Procedures/Actions 포함) |
| `assets/quotes-source-filter-polish-focus-visible.png` | Tab → Inactive FilterButton(흰 bg) brand-400 ring 식별 |
| `assets/quotes-source-filter-polish-focus-active.png` | Shift+Tab → Active FilterButton(brand-500 bg) ring-offset-2 흰 여백 분리 식별 (WCAG 2.1 AA SC 2.4.7 충족) |

### 합계

- 수정 파일: 2 (.tsx 1, .mjs 1)
- 재생성 데이터: 1 (.json)
- 신규 assets: 3 (.png)
- LOC delta: +9 (focus-visible 1 + header comments 6 + Bonus 5)
- 신규 ENV: 0
- 신규 디자인 토큰: 0

---

## 검증 결과 (실측값)

### 데이터 정합성 (FR-05)

```
✅ partTitle 5/5 sources.ts와 일치
   Part 1A · Introduction to GHS
   Part 1B · Communication, Controls, and Emergency Procedures   ← +Procedures
   Part 2 · Chemical Hazards, Controls, and Emergency Actions    ← +Actions
   Part 3 · Extremely Hazardous Chemicals
   Part 4 · Hazardous Gas Systems and Controls

✅ All 26 OSHA quotes have sectionRef:
   - Overview 5: "Course Overview"
   - Learning Objectives 5: "Learning Objectives"
   - Summary 5: "Course Summary"
   - Definition 11: selector ref (§5 Silane — Special Focus 등)
```

### Fuse 검색 시뮬레이션 (Bonus 폴리시 효과)

| Query | Before | After |
|-------|:--:|:--:|
| "summary" | 0 | **5** (5 OSHA summary) |
| "Course Summary" | 0 | **5** |
| "overview" | 0 | **5** (덤) |
| "learning" | 2 | **7** (덤) |

### Browser 실측 (Playwright MCP, dev:3016)

| 시나리오 | 결과 |
|---------|:---:|
| /quotes 헤더 "인용 인덱스 — 책 + OSHA 통합" 표시 | ✅ |
| Source=OSHA 클릭 → "26개 결과 (필터 적용 중)" | ✅ |
| Source=OSHA 시 Type/Chapter 필터 자동 숨김 | ✅ |
| "summary" 검색 → "5개 결과" | ✅ |
| 5 Part Course Summary 카드 노출, sectionRef + 풀 partTitle | ✅ |
| Tab navigation → Inactive chip brand-400 ring 식별 | ✅ |
| Shift+Tab → Active chip(brand-500 bg) ring 식별 | ✅ (ring-offset-2 흰 여백 분리) |
| WCAG 2.1 AA SC 2.4.7 Focus Visible 충족 | ✅ |

### 빌드/타입

```
✅ npm run extract:quotes: 117 quotes (불변), 0 selector miss
✅ npx tsc --noEmit: pass
✅ npm run build: pass (warning 0)
   /quotes 6.73 → 6.76 kB (+30 bytes, 한도 500B의 6%)
✅ 78/78 static pages prerendered
```

---

## Bonus Polish: `OSHA_KIND_DEFAULT_REF`

### 발견 경위

Plan FR-07 검증 단계에서 Fuse 시뮬레이션 결과:
- "summary" 검색: **0 hits** (예상 5)
- "Course Summary" (Plan §5 risk fallback): **0 hits**

근본 원인: Overview/LO/Summary entries에 `sectionRef`/`section` 메타 부재 → Fuse 검색 키 0 → 사용자가 검색으로 도달 불가.

### Minimal Patch (+5 lines)

```js
const OSHA_KIND_DEFAULT_REF = {
  overview: 'Course Overview',
  'learning-objectives': 'Learning Objectives',
  summary: 'Course Summary',
};
// makeOshaQuote 내부:
const finalRef = sectionRef ?? OSHA_KIND_DEFAULT_REF[kind];
```

### 가치 vs Scope Creep 균형

| 측면 | 평가 |
|------|------|
| Plan §2.1 명시 여부 | 미명시 → 엄밀하게는 Minor scope 일탈 (M1) |
| 검증 단계 발견 가치 | Plan FR-07이 처음부터 작동 안 함을 검증으로 발견 — micro-cycle 정신("polish 부채 0건") 부합 |
| 수정 규모 | +5 lines minimal patch |
| FR-07 진정 실현 | Fuse "summary" 0→5, "Course Summary" 0→5 |
| UI 일관성 | 26 OSHA 카드 모두 sectionRef 헤딩 표시 (이전 17/26) |
| Extensibility | Definition selector matrix와 통일된 메타 구조 → SEMI/KOSHA onboarding 재사용 |
| 부수효과 (ID slug 변경) | `summary::summary` → `summary::course-summary`. deeplink 없음, 영향 0 |

**판정**: Scope creep 위험 < 가치. M1로 −1 페널티 반영, Bonus +5 가치 인정.

---

## PDCA 타임라인

| Phase | 산출물 | 시간 |
|-------|--------|:---:|
| **Plan** | plan.md (Executive Summary + 9 FR + 6 NFR + 5 Risk + Out of scope 명시 + Time box 30~45m) | ~10m |
| **Design** | **SKIPPED** (Plan §8 micro-cycle 명시적 허용) | 0m |
| **Do** | 2 파일 수정 + quotes.json 재생성. 검증 단계 Happy C 미작동 발견 → Bonus +5 line 패치. Playwright 3 screenshots | ~30m |
| **Check** | analysis.md — gap-detector 99% (FR 9/9, NFR 6/6, Risk 5/5, Minor 1 Bonus +5) | ~5m |
| **Report** | report.md (16.7 KB, 329 lines) — Executive Summary + Bonus Polish 별도 섹션 + Lessons Learned 5건 | ~5m |
| **Archive** | 본 폴더 | ~5m |

**총 소요**: ~30분 (Plan box 30~45m의 67%) — design skip 효과 ~15m 절감

---

## 핵심 학습 (Lessons Learned)

1. **Micro-cycle 정신: 검증 단계 minimal fix 허용 정책** — Plan에 명시되지 않더라도 ≤5 lines 패치로 Plan FR 의도를 진정 실현할 수 있다면 in-scope 처리. 큰 변경은 별 cycle로 분리. **본 cycle이 첫 적용 사례** (Bonus OSHA_KIND_DEFAULT_REF).

2. **검증 단계의 진정한 가치 = "기대대로 작동한다"의 실증** — Plan/Design은 가정. 검증으로 가정 검정. Plan FR-07 "Source=OSHA + 'summary' → 5건 노출"이 처음부터 작동 안 한 사실을 검증으로만 발견. 단순 build pass는 의미 없음.

3. **데이터 메타 부재 = 사용자 도달 불가** — sectionRef 같은 검색 키 메타는 데이터 생성 시점에 일관되게 부여해야 함. 부재 시 사용자가 검색으로 도달 불가 — "데이터는 생성되었지만 발견되지 않는다" 안티 패턴.

4. **Design phase skip의 시간 효과** — micro-cycle 30~45m 박스에서 design 생략하고 Plan 직접 implementation 참조 → 30m 달성 (15m 절감 = 33% 박스 여유). **Plan이 충분히 구체적이면 design은 중복**. micro-cycle 기준: ≤45m + 5 FR 이하 + 단일 파일 영역.

5. **Playwright MCP의 A11y 검증 자동화 가치** — focus-visible ring처럼 시각적이며 행위 의존적인 요소는 사람 눈/손 대신 Playwright + screenshot로 검증. 스크린샷 3장이 FR-06/FR-07 동시 증거 자산이 되어 Report 신뢰도 ↑.

---

## 잔존 Polish (직전 cycle 5건 중 미처리 2건)

본 cycle out of scope:

| ID | 항목 | 처리 방안 |
|----|------|----------|
| M2 | Design §3.2 selector 변경 사항을 archive 안 design.md에 반영 | archive 정책상 archived 문서 사후 수정 불가 → archive README 명문화로 대체 (이미 완료) |
| M3 | Design §5.4 "단일 컴포넌트" 표기와 실제 BookQuoteCard/OshaQuoteCard helper 분리 | 컨벤션 위반 아닌 가독성 개선 — Report에 의도 명문화 (이미 완료) |

**잔존 0건** — polish 부채 모두 해소 또는 명문화.

---

## 다음 cycle 후보

| 우선순위 | Cycle | 범위 |
|:---:|-------|------|
| **a** | `quotes-osha-definition-expansion` | Part 1B 추가 정의 selector (현재 1개만), Part 3 Toxic Hydride Gases sub-definition 등 |
| **b** | `filter-button-promotion` | FilterButton helper를 `@/components/ui/Chip` 전역 컴포넌트로 승격 (다른 페이지에서도 동일 a11y/style 자동 적용) |
| **c** | `semi-s2-source` 또는 `kosha-guide-source` | 신규 자료원 onboarding — cross-link-system + quotes-source-filter 패턴 ROI 회수, 5단계 onboarding 워크플로 실증 |

---

## 회고: Micro-cycle 효과 검증

| 항목 | 목표 | 실측 | 평가 |
|------|:---:|:---:|------|
| 시간 박스 | ≤45m | 30m | ✅ 33% 여유 |
| FR 충족 | 9/9 | 9/9 | ✅ 100% |
| 부수효과 | minimum | LOC +9 / Bundle +30B | ✅ minimum |
| polish 부채 잔존 | 0 | 0 (M2/M3 명문화 처리) | ✅ |
| Design skip 정당성 | Plan이 충분히 구체적 | Plan FR/code path/검증 시나리오 모두 명시 | ✅ |
| 검증 단계 fix 정책 | scope 일탈 vs 가치 균형 판단 | Bonus +5 가치 인정, M1 −1 페널티 반영 | ✅ |

→ **Micro-cycle 패턴 정착 사례**. 향후 polish/bugfix cycle은 본 cycle을 reference로 채택.

---

## 참고

- Inherits: `docs/archive/2026-05/quotes-source-filter/` (직전 cycle, Minor 5건 중 3건 polish 정식화)
- 관련 archive:
  - `docs/archive/2026-05/cross-link-system/` — Single source of truth 패턴 원형 (schema-enum 미러)
  - `docs/archive/2026-05/multi-source-learning-platform/` — Source 모델 + OSHA SCS 5 Part 통합
- 원본 책: 「반도체 산업의 유해인자」 윤충식 외 6인 공저, 에피스테메
- OSHA 원본: U.S. OSHA Semiconductor Chemical Safety Part 1A/1B/2/3/4 (Public Domain — U.S. Gov Work)
- Archive 시점: 2026-05-30
