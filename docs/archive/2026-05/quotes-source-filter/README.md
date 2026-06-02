# Archive: quotes-source-filter

> `/quotes` 인용 인덱스를 책 91 + OSHA 26 = 117 통합 검색으로 확장. discriminated union 재설계, OSHA 4 패턴 추출(Overview/LO/Summary/Definition selector), source 필터 UI 추가. 신규 컴포넌트·신규 디자인 토큰 0개로 인용 인덱스를 "다중 자료원 학습 허브" 정체성에 정렬.

**Archived**: 2026-05-30
**Phase**: completed
**Match Rate**: 95% (10/10 FR, 6/6 NFR, Minor 5)
**Iteration**: 0 (첫 통과)
**Duration**: ~1.5시간 (Plan revised → Report)
**Level**: Dynamic
**Branch**: main
**Inherits**: [cross-link-system archive](../cross-link-system/) (FR-12 deferred polish 정식화 → Option B Integration 채택)

---

## 결과 요약

| 지표 | 결과 |
|------|:---:|
| Design Match Rate | 95% |
| FR coverage | 10/10 ✅ |
| NFR coverage | 6/6 ✅ |
| Implementation Order (§11.2) | 13/13 ✅ |
| Convention Compliance | 100% |
| Critical / Major / Minor | 0 / 0 / 5 (모두 polish) |
| typecheck / build | 모두 통과 (무경고) |
| OSHA selector miss | 0건 |
| 데이터 정합성 (sourceId/language/partId) | 100% |
| 기존 URL 회귀 | 0건 |

---

## 구현 산출물

### Data + Schema

| 종류 | 파일 | 비고 |
|------|------|------|
| 재생성 | `src/data/quotes.json` | 91 → 117 entries (책 91 + OSHA 26) |
| 타입 (export) | `src/components/quote-index/QuoteCard.tsx` | `QuoteItem = BookQuote \| OshaQuote` discriminated union 신규 export |

### Build

| 종류 | 파일 | 비고 |
|------|------|------|
| 확장 | `scripts/extract-quotes.mjs` | OSHA_PART_META (5 entry) + OSHA_DEFINITION_SELECTORS (11 entry) + 4 추출 함수(Overview/LO/Summary/Definitions) + markdown stripper + word-boundary truncate + 책 추출에 sourceId/language 부여 |

### Runtime UI

| 종류 | 파일 | 비고 |
|------|------|------|
| 재작성 | `src/components/quote-index/QuoteCard.tsx` | Union 타입 + dispatcher + BookQuoteCard/OshaQuoteCard helper. 외부 export는 단일 QuoteCard. SourceBadge + partTitle chip + sectionRef + emerald 색상 분리 |
| 확장 | `src/components/quote-index/QuoteIndex.tsx` | Source 필터 row (getOrderedSources) + Fuse keys 6개로 확장(text/section/sectionRef/chapterTitle/partTitle/page) + isBookSource 분기로 Type/Chapter 필터 자동 숨김 |
| 확장 | `src/app/quotes/page.tsx` | 헤더 "인용 인덱스 — 책 + OSHA 통합" + 카운트 동적 (책 91 · OSHA 26) + footer attribution 양쪽 자료원 명시 |

### 합계

- 신규 파일: 0
- 수정 파일: 3 (.tsx) + 1 (.mjs)
- 재생성 데이터: 1 (.json)
- 신규 컴포넌트 export: 0
- 신규 디자인 토큰: 0
- 신규 ENV: 0

---

## 추출 통계 (검증값)

```
📖 「반도체 산업의 유해인자」 추출
  17 chapters → LE=17, SQ=74, total=91

🏛 OSHA Semiconductor Chemical Safety 추출
  part-1a: total=6 (O1 L1 S1 D3)
  part-1b: total=4 (O1 L1 S1 D1)
  part-2:  total=6 (O1 L1 S1 D3)
  part-3:  total=5 (O1 L1 S1 D2)
  part-4:  total=5 (O1 L1 S1 D2)
  Overview=5, LO=5, Summary=5, Definition=11 = total 26

✅ Extracted 117 quotes
   책: 91, OSHA: 26
   selector miss: 0
   sourceId/language/partId 누락: 0
   text length (OSHA): min 76 / med 193 / max 200
```

---

## OSHA Definition Selector 매트릭스 (실제)

11개 정의 selector (Design §3.2의 11개 유지하되 3건 실제 헤딩에 맞춰 조정 — Design §11.2 step 9가 허용):

| Part | 헤딩 | sectionRef |
|------|------|------------|
| 1A | `## 4. Three Types of Hazards` | §4 Three Types of Hazards |
| 1A | `### 5.4 Pyrophoric Substances` | §5.4 Pyrophoric Substances |
| 1A | `### 6.3 Hydrofluoric Acid (HF) — Special Hazard` | §6.3 HF Special Hazard *(Design은 Part 2 배치, 실제는 Part 1A 소속)* |
| 1B | `### 2.1 SDS Structure` | §2.1 SDS Structure *(Design 'SDS Format' → 실제 헤딩 치환)* |
| 2 | `### Flash Point` | Flash Point |
| 2 | `## 6. Pyrophoric Chemicals` | §6 Pyrophoric Chemicals |
| 2 | `### HF Exposure First Aid (Special Steps)` | HF Exposure First Aid *(HF 정의가 Part 1A로 이동된 자리 보충)* |
| 3 | `## 5. Silane — Special Focus` | §5 Silane — Special Focus |
| 3 | `## 1. Toxic Hydride Gases` | §1 Toxic Hydride Gases |
| 4 | `## 2. Cryogenic Cylinders (Dewars)` | §2 Cryogenic Cylinders |
| 4 | `## 5. Common Gas Controls` | §5 Common Gas Controls |

---

## PDCA 타임라인

| Phase | 산출물 |
|-------|--------|
| **Plan** | plan.md — v0.1 (Option A Minimal source 필터만) → v0.2 (Option B Integration, OSHA 인용 추출 포함). 10 FR, 6 NFR, 1.5~2.5h 박스 |
| **Design** | design.md — QuoteItem discriminated union + extract-quotes 4 패턴 의사코드 + selector 매트릭스 11개 + Fuse keys 6개 + UI 5.1~5.6 mockup + §11.2 13단계 implementation order |
| **Do** | 1.5h 구현 — 4 파일 수정 + quotes.json 재생성. 1차 실행에서 0 selector miss (Design §11.2 step 9 미세 조정 활용으로 1회 통과) |
| **Check** | analysis.md — gap-detector 95% (FR 10/10, NFR 6/6, Critical/Major 0, Minor 5 polish) |
| **Report** | report.md (13,272 bytes) — Executive Summary 2개 표 + Implementation Summary + Verification Results + Lessons Learned + Polish 4건 |
| **Archive** | 본 폴더 |

---

## 핵심 학습 (Lessons Learned)

1. **Selector array > auto-discovery for content extraction** — OSHA Markdown의 모든 `###` 자동 추출 대신 11개 selector를 명시 배열로 작성. 주관성을 코드 수준에서 통제. 의도하지 않은 quote 0건. 다음 자료원(KOSHA/SEMI) 인용 추출 시 같은 패턴.

2. **Discriminated union으로 데이터·UI·스크립트 일관성 확보** — `sourceId` discriminator를 데이터 생성(extract-quotes), 타입(QuoteItem), UI 분기(BookQuoteCard/OshaQuoteCard) 3계층 모두에서 같은 패턴 적용. TypeScript narrowing 덕에 helper 분리해도 외부 API는 단일 QuoteCard 유지. **확장 시 비용 = 새 union variant 추가 + helper 1개**.

3. **Source 필터는 incompatible secondary 필터를 자동 숨김** — Source=OSHA 선택 시 Type/Chapter 필터를 disable 대신 자동 숨김 채택. UI 노이즈 감소 + 인지 부하 ↓. Disabled 상태는 "왜 안 되지?" 질문 유발, 숨김은 명확. (Design §6 "Source=OSHA + Type=layered-explain 충돌" 처리 패턴)

4. **word-boundary truncate + markdown strip** — `**bold**` 같은 마크다운 strip 후 word-boundary cutoff (lastSpace > 70% maxLen일 때 자르고 `…` 부착)로 OSHA quote 본문이 자연스럽게 절단. 200자 cap 내 평균 193자, 최단 76자, 모두 의미 보존. 의역 0건.

5. **Design §11.2 step 9 ("OSHA selector 미세 조정")의 가치** — Design은 11 selector를 명시했지만 실제 MDX 검수에서 3건이 다른 Part에 있거나 헤딩명 차이. step 9가 명시한 "1차 실행 후 조정 25m 박스"가 1회 통과를 가능케 함. **Design에 "실측 단계" 명시 자체가 가드레일**. 0 miss로 통과.

---

## Polish 4건 (선택, 후속 cycle 가능)

| ID | 항목 | 행동 옵션 |
|----|------|----------|
| M1 | `extract-quotes.mjs` OSHA_PART_META의 part-1b/part-2 `partTitle`이 `sources.ts`와 미세 단축형 차이 | 글자 단위 일치 또는 주석으로 의도 명시 |
| M5 | `FilterButton` `:focus-visible` ring 미정의 (Tab 자체는 작동) | `focus-visible:ring-2 focus-visible:ring-brand-300` 추가 |
| (doc) | Design v0.2로 갱신해 §3.2 selector 변경 사항(HF Part 1A 이동, SDS Structure 치환) 반영 | 문서-구현 정합성 향상 |
| (test) | source=OSHA + "summary" 검색 결과 5개 실측 검증 | 브라우저 spot-check 또는 unit test |

이상 모두 ship-blocker 아닌 polish. 후속 a11y/문서 micro-PR로 처리 가능.

---

## 다음 cycle 후보

| 우선순위 | Cycle | 범위 |
|:---:|-------|------|
| **a** | `quotes-source-filter-polish` | M1+M5+Design v0.2 갱신 (30m) — selector 동기화·A11y ring·문서 sync |
| **b** | `semi-s2-source` 또는 `kosha-guide-source` | 신규 자료원 추가 — extract-quotes에 함수 1개 + sourceId 1줄로 자동 편입 검증 (cross-link-system + 본 cycle 패턴 ROI 회수) |
| **c** | OSHA Definition selector 확장 | Part 1B 추가 정의 selector (현재 1개만), Part 3 Toxic Hydride Gases sub-definition 등 |

---

## 신규 검증 가능한 경로

- `/quotes` → 책 91 + OSHA 26 chip, Source 필터 [전체 117 / 📖 책 91 / 🏛 OSHA 26]
- `/quotes?q=silane` (검색창에 입력) → OSHA Part 3 §5 Silane Special Focus 노출
- `/quotes?q=실란` → 책 Ch.5/7/10 deposition·diffusion·CVD 관련 quote
- `/quotes?q=flash%20point` → OSHA Part 2 Flash Point 정의 1건 (책 0건)
- `/quotes?q=사전주의` → 책 Ch.1/17 LayeredExplain (OSHA 0건)
- Source=OSHA 선택 → Type/Chapter 필터 자동 숨김, OSHA 카드 클릭 → `/sources/osha-scs/{partId}` 이동

---

## 참고

- Inherits: `docs/archive/2026-05/cross-link-system/` (직전 cycle, FR-12 deferred 명시 → 본 cycle Option B로 정식화)
- 관련 archive:
  - `docs/archive/2026-05/source-quote-index/` — `/quotes` 인덱스 초기 구축
  - `docs/archive/2026-05/source-quote-expansion/` — 책 quote 91개 데이터 강화
  - `docs/archive/2026-05/multi-source-learning-platform/` — Source 1급 객체 + OSHA SCS 5 Part 통합
- 원본 책: 「반도체 산업의 유해인자」 윤충식 외 6인 공저, 에피스테메
- OSHA 원본: U.S. OSHA Semiconductor Chemical Safety Part 1A/1B/2/3/4 (Public Domain — U.S. Gov Work)
- Archive 시점: 2026-05-30
