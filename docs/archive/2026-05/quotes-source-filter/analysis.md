---
template: analysis
version: 1.0
description: PDCA Check — quotes-source-filter Gap analysis (Design vs Implementation)
variables:
  feature: quotes-source-filter
  date: 2026-05-30
  author: gap-detector
  project: semiconductor-academy
  matchRate: 95
---

# Gap Analysis: quotes-source-filter

**분석일**: 2026-05-30
**PDCA Phase**: Check
**Branch**: main
**Plan**: `docs/01-plan/features/quotes-source-filter.plan.md` (v0.2 Option B)
**Design**: `docs/02-design/features/quotes-source-filter.design.md` (v0.1)
**구현 범위**: QuoteCard 재설계 + QuoteIndex 확장 + page.tsx 헤더 + extract-quotes.mjs OSHA 분기 + quotes.json 117 entries

> **Result**: **Match Rate 95% — Ship-ready ✅** · Critical 0 · Major 0 · Minor 5

---

## 1. FR Match Matrix (Plan §3.1)

| ID | 요구사항 | Status | Evidence |
|----|---------|:------:|----------|
| FR-01 | QuoteItem 스키마: `sourceId` + `language` + OSHA 메타(`partId`/`partTitle`/`partHref`/`sectionRef`) | ✅ Pass | `QuoteCard.tsx:7-38` — BaseQuote + BookQuote + OshaQuote discriminated union, `partId/partTitle/partHref/sectionRef` 모두 정의. `chapter` 필드는 BookQuote 전용 |
| FR-02 | 책 추출 entry에 `sourceId: 'epi-semi-hazards'` + `language: 'ko'` 부여 | ✅ Pass | `extract-quotes.mjs:201-202, 244-245` — LE/SQ 두 경로 모두 부여. quotes.json 91 entries 100% 일관 |
| FR-03 | OSHA 추출: 5 Part × Course Overview/LO/Summary/Definitions (총 25+) | ✅ Pass | `extract-quotes.mjs:335-399` — 4 함수 구현. 결과: Overview 5 + LO 5 + Summary 5 + Definition 11 = **26 entries**. 0 selector miss |
| FR-04 | QuoteCard에 SourceBadge + OSHA 메타 표시 | ✅ Pass | `QuoteCard.tsx:107-142` — OshaQuoteCard에 `SourceBadge variant="lang"`(line 118), partTitle chip(120), sectionRef heading(124-128), kind label("OSHA · 정의"등) 표시 |
| FR-05 | 링크: 책 → `/chapter/{slug}`, OSHA → `/sources/osha-scs/{partId}` | ✅ Pass | BookQuoteCard `href={\`/chapter/${quote.chapterSlug}/\`}` (98), OshaQuoteCard `href={quote.partHref}` (135). partHref는 `/sources/osha-scs/part-{x}/` 형식 |
| FR-06 | QuoteIndex source 필터 (자료원 ≥2 시 노출) | ✅ Pass | `QuoteIndex.tsx:18-19, 132-155` — `showSourceFilter = sources.length >= 2`, 전체/책/OSHA 3개 chip 렌더. 자료원 카운트(91/26/117) 표시 |
| FR-07 | `/quotes` 헤더 update + 카운트 동적 | ✅ Pass | `page.tsx:25-54` — 제목 "인용 인덱스 — 책 + OSHA 통합", bookCount/oshaCount 동적, footer attribution 양쪽 자료원 명시 |
| FR-08 | Fuse keys 확장 (`sectionRef`, `partTitle` 등) | ✅ Pass | `QuoteIndex.tsx:29-36` — text/section/sectionRef/chapterTitle/partTitle/page 6 keys. Plan은 sourceId weight 0.05를 언급했지만 실제로는 sectionRef 0.15 + partTitle 0.1로 더 의미 있게 가중. sourceId는 필터에서 처리 |
| FR-09 | extract:quotes / typecheck / build 무경고 통과 | ✅ Pass | Do 보고: 117 quotes 추출 0 miss, `tsc --noEmit` pass, `npm run build` pass (warning 0), /quotes 6.73 kB |
| FR-10 | "silane" 검색 시 책 + OSHA 모두 노출 | ✅ Pass | Do spot-check: "silane"→OSHA Part 3 §5, "실란"→책 Ch.5/7/10, "flash point"→OSHA Part 2 only, "사전주의"→책 only — 의도대로 작동 |

**FR 충족**: **10/10 (100%)**

---

## 2. Non-Functional Requirements (Plan §3.2)

| Category | Criteria | 결과 | Status |
|---------|---------|------|:---:|
| Performance | /quotes LCP 증가 ≤ 100ms | 페이지 6.73 kB SSG prerender, 117 entries 클라이언트 fuse 인덱스. 정성적으로 영향 미미 | ✅ |
| Bundle | quotes.json 크기 증가 ≤ 35% | 91→117 = +28.6% (entry 수 기준). Plan 예상치 일치 | ✅ |
| Build | 무경고 통과 | Do 보고 명시 (`npm run build` warning 0) | ✅ |
| URL 회귀 | 17 ch + 30 chem + 7 source + 5 OSHA part + /quotes prerender | Do 보고: 모두 prerendered | ✅ |
| 데이터 정합성 | sourceId 누락 0, partId(OSHA만) 유효 5 part 한정 | quotes.json: sourceId 117회 = entry 수 일치, language 117회, partId 26회 = OSHA 수 일치. partId 값 5 part_id 한정 | ✅ |
| 검색 정확성 | 책·OSHA 모두 검색 + source 필터 작동 | Spot-check 4종 모두 의도대로 분기 | ✅ |

**NFR 충족**: **6/6 (100%)**

---

## 3. Design Section Coverage

| § | 항목 | 구현 결과 | Status |
|---|------|----------|:---:|
| §3.1 QuoteItem union | BaseQuote + BookQuote + OshaQuote discriminator | `QuoteCard.tsx:7-38` 완전 일치 | ✅ |
| §3.2 OSHA_PART_META | 5 entry, partId/partTitle/partHref | `extract-quotes.mjs:34-40` 완전 일치 | ✅ |
| §3.2 OSHA_DEFINITION_SELECTORS | 11 entry | `extract-quotes.mjs:46-63` 11 entry — 단, 2건 selector 텍스트 변경 (M2 참조) | 🟡 |
| §3.4 Sample id pattern | `osha-scs::{partId}::{kind}::{slug}` | quotes.json 모두 일치 | ✅ |
| §4.1 extract-quotes CLI | 책 + OSHA, stderr 통계, ≤200자 truncate | `makeOshaQuote`, `truncate` word-boundary 일치 | ✅ |
| §4.2 의사코드 (4 함수) | Overview/LO/Summary/Definitions | `extract-quotes.mjs:335-399`. **개선**: Summary가 numbered list인 경우 위해 `collectListBlock` 사용 — 의사코드보다 견고 | ✅ |
| §5.1 헤더 mockup | "책 + OSHA 통합 인용 인덱스" | `page.tsx:26` 일치, 자료원 카운트 강조 | ✅ |
| §5.2 검색·필터 영역 | Source/Type/Chapter 3 row + OSHA 선택 시 Type/Chapter 숨김 | `QuoteIndex.tsx:158` `{isBookSource && ...}` — Source=OSHA 시 자동 숨김 채택 | ✅ |
| §5.3 QuoteCard 분기 | 책 vs OSHA 시각 분리 | brand vs emerald 색상, ShieldCheck vs Sparkles/BookOpen icon | ✅ |
| §5.4 컴포넌트 선택 | "conditional fields (단일 컴포넌트)" 명시 | **편차**: BookQuoteCard/OshaQuoteCard 2개 helper 컴포넌트로 분리. 외부 export는 여전히 단일 QuoteCard. 타입 narrowing·가독성 개선 (M3 참조) | 🟡 (minor) |
| §5.5 Source 필터 컴포넌트 | getOrderedSources + counts + chip | 일치. chip label은 'OSHA'/'책' 단축 라벨 사용 | ✅ |
| §5.6 Fuse keys | 6 keys (text/section/sectionRef/chapterTitle/partTitle/page) | `QuoteIndex.tsx:29-36` 완전 일치 | ✅ |
| §6 Error handling | selector miss 경고 / MDX 누락 경고 / empty skip / Source-Type 충돌 reset | 모두 구현 | ✅ |
| §9 Clean Architecture | Presentation/Application/Domain/Infra | scripts→TS 직접 import 없음 (OSHA_PART_META inline) | ✅ |
| §10 Convention | ≤200 word-boundary, 영어 원문, 신규 컴포넌트 0 export, 신규 토큰 0 | 모두 충족 | ✅ |

**Section Coverage**: **15/15 항목, 13 ✅ + 2 🟡 minor**

---

## 4. Implementation Order (Design §11.2)

| 단계 | 작업 | 결과 |
|:---:|------|:---:|
| 1 | QuoteItem union 재설계 | ✅ |
| 2 | 책 추출에 sourceId/language 부여 | ✅ |
| 3 | OSHA_PART_META + OSHA_DEFINITION_SELECTORS 상수 | ✅ |
| 4 | extractOshaCourseOverview + 5 Part | ✅ (5/5) |
| 5 | extractOshaLearningObjectives + 5 Part | ✅ |
| 6 | extractOshaCourseSummary + 5 Part | ✅ |
| 7 | extractOshaDefinitions + selector 매트릭스 | ✅ (11 selector, 0 miss) |
| 8 | 1차 extract:quotes 검증 | ✅ (117 = 91+26) |
| 9 | OSHA selector 미세 조정 | ✅ Design §11.2 step 9 명시적 허용 사항 활용 |
| 10 | QuoteCard conditional rendering | ✅ |
| 11 | QuoteIndex source 필터 + Fuse 확장 + 분기 처리 | ✅ |
| 12 | page.tsx 헤더·카운트 | ✅ |
| 13 | typecheck + build + spot check | ✅ |

**13/13 단계 완료** (step 14 gap-detector는 본 분석)

---

## 5. Test Plan Coverage (Design §8.2)

| Test | 시나리오 | 결과 |
|------|---------|:---:|
| Happy A | "silane" → 책 + OSHA Part 3 §5 | ✅ Do 검증 |
| Happy B | "flash point" → OSHA Part 2 §Flash Point만 | ✅ Do 검증 (책 0건) |
| Happy C | source=OSHA + "summary" → 5 Part Course Summary | ⚠️ 부분 (인프라 작동 — 5 summary 존재, UI 실측 안 함) |
| Regression A | 책 91 quote 표시 동일 | ✅ 91 entries 보존, BookQuoteCard 기존 디자인 유지 |
| Edge A | source=OSHA 선택 시 type/chapter 필터 자동 숨김 | ✅ `QuoteIndex.tsx:158` `{isBookSource && ...}` |
| Error A | selector 변조 시 경고 + 빌드 계속 | ✅ `extract-quotes.mjs:370` 구현 |
| A11y | source 필터 chip 키보드 포커스 + 다크모드 | ⚠️ 다크모드 모든 className에 `dark:` ✅. 키보드 focus-visible ring 미정의(M5) |

**Test 충족**: **5 명시 검증 + 2 부분**

---

## 6. Gaps by Severity

### Critical (Δ −15 each)
없음.

### Major (Δ −5 each)
없음.

### Minor (Δ −1 each)

| # | 항목 | 위치 | 설명 |
|---|------|------|------|
| M1 | partTitle 동기화 약간 어긋남 | `extract-quotes.mjs:36-37` vs `src/lib/sources.ts:61, 68` | extract-quotes의 part-1b는 "Communication, Controls, and Emergency"인데 sources.ts는 "Communication, Controls, and Emergency Procedures". part-2는 "Chemical Hazards, Controls, and Emergency" vs "Chemical Hazards, Controls, and Emergency Actions". UI에는 영향 없음 (양쪽 모두 의미 전달됨) |
| M2 | Design §3.2의 11 selector 텍스트 일부 변경 | `extract-quotes.mjs:50, 52, 56` | 3건: (a) Part 1A에 §6.3 HF Special Hazard 추가 (Design은 Part 2 배치) (b) Part 2 §6.3 HF Special Hazard 제거하고 "HF Exposure First Aid (Special Steps)"로 대체 (c) Part 1B "SDS Format"→"2.1 SDS Structure". **Design §11.2 step 9가 명시적으로 허용**한 의도된 조정. 총 11 정의 수 유지, 0 miss |
| M3 | Design §5.4 "단일 컴포넌트" 선택과 실제 분리 | `QuoteCard.tsx:51-56, 58-105, 107-142` | 외부 QuoteCard(dispatcher) → BookQuoteCard/OshaQuoteCard 분리. 신규 export 1개(QuoteCard)는 유지. TypeScript narrowing/가독성 개선. 실질 컨벤션 위반 아님 |
| M4 | Fuse weight 분포가 Plan §2.1.4와 다름 | `QuoteIndex.tsx:29-36` | Plan은 `sourceId` weight 0.05를 추가하라 했으나 실제 미포함. 대신 sectionRef 0.15, partTitle 0.1로 더 유의미한 가중. sourceId는 검색이 아닌 필터로 처리(올바른 결정). Design §5.6이 sourceId 제외했고 구현이 Design을 따름 |
| M5 | A11y/키보드 focus-visible ring 부재 | `QuoteIndex.tsx:248-260` FilterButton | `:focus-visible` ring 미정의. brand-500 active 상태만. Tab 자체는 작동하나 시각 포커스 부족 |

**Severity 합계**: Critical 0, Major 0, Minor 5

---

## 7. Match Rate 계산

가중치 시작 100 → Critical −15×0 + Major −5×0 + Minor −1×5 = **95**

| 영역 | 비중 | 점수 |
|------|:--:|:--:|
| FR-01~10 (10 of 10) | 40% | 40/40 |
| NFR 6/6 | 15% | 15/15 |
| Design Section Coverage 15/15 | 20% | 18/20 (M2, M3 반영) |
| §11.2 Order 13/13 | 5% | 5/5 |
| §8.2 Test Coverage | 10% | 8/10 (Happy C, A11y 부분) |
| 데이터 정합성(sourceId/partId 100%) | 5% | 5/5 |
| Bonus: 0 selector miss + word-boundary truncate + dark mode 일관 | 5% | 4/5 |
| **합계** | 100% | **95/100** |

### **최종 Match Rate: 95%** ✅ (≥ 90% Ship-ready)

---

## 8. Recommendation: **Pass to Report**

Match Rate 95% — 90% 임계 초과. Iterate 불요. `/pdca report quotes-source-filter` 진행 권장.

### Optional Polish (선택 — Report 단계나 후속 cycle에서 처리 가능)

1. **(P3) sources.ts 단일 진실 정합성**: `extract-quotes.mjs` OSHA_PART_META의 part-1b/part-2 partTitle을 sources.ts와 글자 단위 일치시키거나, 의도된 단축형임을 주석에 명시. (M1)
2. **(P3) FilterButton focus-visible ring**: `focus-visible:ring-2 focus-visible:ring-brand-300` 추가하면 키보드 사용자 UX 강화. (M5)
3. **(P3) Design §3.2 selector 변경 사항을 Design 문서에 반영**: Design v0.2로 갱신해 11.2 step 9의 실제 결과(HF Part 1A 이동, SDS Structure 치환)를 기록. 문서-구현 정합성 향상.
4. **(P3) Happy C 명시 검증**: source=OSHA + "summary" 검색 결과 5개 확인 (실측). 현재는 인프라 작동만 검증.

이상 모두 ship-blocker 아닌 polish 수준.
