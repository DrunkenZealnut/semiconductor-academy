---
template: report
version: 1.0
description: PDCA Report — quotes-source-filter (책 + OSHA 통합 인용 인덱스)
variables:
  feature: quotes-source-filter
  date: 2026-05-30
  author: DrunkenZealnut
  project: semiconductor-academy
  matchRate: 95
  status: completed
---

# quotes-source-filter 완료 보고서

> **요약**: `/quotes` 인덱스를 책 91개 + OSHA 26개 통합 검색으로 확장. discriminated union `QuoteItem` 재설계, OSHA 4 패턴 추출(Overview/LO/Summary/Definition), source 필터 UI 추가. 신규 컴포넌트 0개, 기존 인프라 100% 재사용.

**분석일**: 2026-05-30  
**Feature**: `quotes-source-filter`  
**상위 기능**: `cross-link-system` FR-12 (deferred polish)  
**PDCA Phase**: Report (Check 95% Pass)  
**Branch**: main

---

## 1. 실행 개요

### 1.1 프로젝트 정보

| 항목 | 값 |
|------|---|
| **Feature** | quotes-source-filter — /quotes 통합 인용 인덱스 (책 + OSHA) |
| **시작** | 2026-05-30 23:30 KST |
| **완료** | 2026-05-31 01:00 KST |
| **소요 시간** | ~1.5시간 |
| **Match Rate** | 95% ✅ (≥90% Ship-ready) |
| **Branch** | main |
| **Iteration** | 0회 |
| **변경 파일** | 4 modified + 1 regenerated |

### 1.2 가치 전달 (4 관점)

| 관점 | 내용 |
|------|------|
| **Problem (문제)** | `/quotes` 인덱스는 책 91개만 제공하지만, 사이트가 다중 자료원으로 격상되었음에도 검색은 단일 자료원에 머물렀음. OSHA SCS 5 Part의 풍부한 정의·요약·학습 목표가 검색에서 빠짐. `quotes.json`에 `sourceId` 필드 부재로 source 필터 자체도 무의미. |
| **Solution (해결)** | `QuoteItem` discriminated union으로 재설계하고, `extract-quotes.mjs`에 OSHA 추출 분기 4개(Overview/LO/Summary/Definition selector) 추가. `/quotes` 검색을 책+OSHA 통합으로 확장. source 필터 UI 추가. 신규 인프라 0. |
| **Function/UX Effect (기능 효과)** | `/quotes` 책 91 + OSHA 26 = **117 통합 검색**. "silane" 검색 → 책 Ch.10 + OSHA Part 3 모두 노출. "flash point" → OSHA Part 2 정의만. Source 필터 [전체 117 / 📖 책 91 / 🏛 OSHA 26] 토글. OSHA quote 카드는 Part·sectionRef 메타 + /sources/osha-scs/{partId} 링크. 0 selector miss, 117 entries 100% 정합성. |
| **Core Value (핵심 가치)** | 인용 인덱스가 **사이트 정체성 "다중 자료원 학습 허브"** 와 정렬. cross-link-system과 시너지(같은 silane이 chapter에서는 RelatedFromOtherSources, /quotes에서는 통합 검색). 추가 자료원 onboarding 시 `extract-quotes.mjs` 함수 1개 + sourceId 1줄만 추가하면 자동 편입. **Extensibility-first 패턴** 인용 인덱스에도 확산. |

---

## 2. 구현 요약

### 2.1 파일 변경

| 파일 | 역할 | 변경 사항 |
|------|------|----------|
| `src/components/quote-index/QuoteCard.tsx` | **REWRITE** | QuoteItem discriminated union (BaseQuote + BookQuote + OshaQuote) 추가. BookQuoteCard/OshaQuoteCard 2개 helper 추가. sourceId 분기로 조건부 렌더. SourceBadge + partTitle chip + sectionRef 표시(OSHA만). 신규 export: QuoteCard (dispatcher만) |
| `src/components/quote-index/QuoteIndex.tsx` | **EXTEND** | Source 필터 UI 추가 (전체/책/OSHA). Fuse keys 확장: text/section/sectionRef/chapterTitle/partTitle/page. isBookSource 분기로 Type/Chapter 필터 자동 숨김 (Source=OSHA 시). |
| `src/app/quotes/page.tsx` | **EXTEND** | 헤더 제목 "인용 인덱스 — 책 + OSHA 통합" 변경. bookCount/oshaCount 동적 표시 (책 91 · OSHA 26). Footer attribution 양쪽 자료원 명시. |
| `scripts/extract-quotes.mjs` | **EXTEND** | OSHA_PART_META (5 entry) + OSHA_DEFINITION_SELECTORS (11 entry) 상수 추가. 4개 추출 함수: extractOshaCourseOverview / extractOshaLearningObjectives / extractOshaCourseSummary / extractOshaDefinitions. 모든 OSHA quote에 sourceId: 'osha-scs', language: 'en'. 기존 책 추출에 sourceId: 'epi-semi-hazards', language: 'ko' 부여. |
| `src/data/quotes.json` | **REGENERATED** | 책 91 + OSHA 26 = **117 entries**. 모든 entry에 sourceId/language. OSHA entry에 partId/partTitle/partHref/sectionRef 메타. |

### 2.2 핵심 패턴

**1) Discriminated Union (타입 안전)**
```typescript
interface BookQuote extends BaseQuote {
  sourceId: 'epi-semi-hazards';
  language: 'ko';
  type: 'layered-explain' | 'source-quote';
  chapter: number; // 책 전용
}

interface OshaQuote extends BaseQuote {
  sourceId: 'osha-scs';
  language: 'en';
  type: 'osha-section';
  kind: 'overview' | 'learning-objectives' | 'summary' | 'definition';
  partId: string; // OSHA 전용
  sectionRef?: string;
}
```

**2) OSHA Selector Array (명시성)**  
정의 추출 정책을 배열로 명문화. "자동 모든 ### 추출" 금지, 선정된 11개만 추출.
```javascript
const OSHA_DEFINITION_SELECTORS = [
  { partId: 'part-1a', heading: '## 4. Three Types of Hazards', sectionRef: '§4 Three Types of Hazards' },
  { partId: 'part-3',  heading: '## 5. Silane — Special Focus', sectionRef: '§5 Silane — Special Focus' },
  // ... 총 11 entry
];
```

**3) 조건부 렌더링 (UI 단순)**  
QuoteCard 단일 컴포넌트 유지, sourceId 분기로 메타 표시.
```typescript
function QuoteCard({ quote }: { quote: QuoteItem }) {
  if (quote.sourceId === 'epi-semi-hazards') return <BookQuoteCard quote={quote} />;
  if (quote.sourceId === 'osha-scs') return <OshaQuoteCard quote={quote} />;
}
```

**4) Source 필터 자동화**  
`getOrderedSources()` 함수로 sources.ts 단일 진실 참조. 자료원 추가 시 UI 자동 확장.

---

## 3. 검증 결과

### 3.1 빌드 및 타입 검증

| 검증 항목 | 결과 |
|----------|:---:|
| `npm run extract:quotes` | ✅ 117 quotes (책 91 + OSHA 26), **0 selector miss** |
| OSHA 추출 분포 | ✅ Overview 5 / LO 5 / Summary 5 / Definition 11 = 26 |
| `tsc --noEmit` | ✅ Pass (0 error) |
| `npm run build` | ✅ Pass (0 warning) |
| `/quotes` 페이지 크기 | 6.73 kB (quotes.json + UI) |
| Routes prerendered | ✅ 17 ch + 30 chem + 9 process + 7 source + /quotes |

### 3.2 기능 검증 (수동 spot-check)

| 시나리오 | 결과 |
|---------|:---:|
| "silane" 검색 | ✅ 책 Ch.5(실란)/Ch.7(도펀트)/Ch.10(적용) + OSHA Part 3 §5 |
| "실란" 검색 | ✅ 책만 (OSHA 영어, 0건) |
| "flash point" 검색 | ✅ OSHA Part 2 정의만 (책 0건) |
| "사전주의" 검색 | ✅ 책 Ch.1만 (OSHA 0건) |
| Source=OSHA 필터 | ✅ 26 quotes, Type/Chapter 필터 자동 숨김 |
| Source=책 필터 | ✅ 91 quotes, Type/Chapter 필터 작동 |
| 카드 링크 | ✅ 책 → `/chapter/{slug}`, OSHA → `/sources/osha-scs/part-{x}/` |
| Dark mode | ✅ 모든 칩/카드 `dark:` 클래스 일관 |

### 3.3 데이터 정합성

| 항목 | 결과 |
|------|:---:|
| sourceId 누락 | ✅ 0건 (117/117 = 100%) |
| language 누락 | ✅ 0건 (117/117) |
| partId(OSHA만) | ✅ 26건 모두 유효 (part-1a/1b/2/3/4) |
| sectionRef(Definition만) | ✅ 11건, 모두 의미 있는 텍스트 |
| text 길이(≤200자) | ✅ 최대 195자, 모두 word-boundary truncate |
| id 중복 | ✅ 0건 (117 unique) |

---

## 4. Gap Analysis 요약 (Check §95%)

### 4.1 FR 충족 현황

| ID | 요구사항 | 상태 |
|----|---------|:---:|
| FR-01 | QuoteItem 스키마: sourceId + language + OSHA 메타 | ✅ |
| FR-02 | 책 entry에 sourceId: 'epi-semi-hazards' + language: 'ko' | ✅ |
| FR-03 | OSHA 추출: 5 Part × 4 패턴, 총 26 entries | ✅ |
| FR-04 | QuoteCard: SourceBadge + OSHA 메타 표시 | ✅ |
| FR-05 | 링크: 책 → `/chapter/{slug}`, OSHA → `/sources/osha-scs/{partId}` | ✅ |
| FR-06 | QuoteIndex source 필터 (자료원 ≥2 시 노출) | ✅ |
| FR-07 | `/quotes` 헤더 카운트 동적 (책 91 · OSHA 26) | ✅ |
| FR-08 | Fuse keys 확장 (text/section/sectionRef/chapterTitle/partTitle/page) | ✅ |
| FR-09 | extract:quotes / typecheck / build 무경고 | ✅ |
| FR-10 | "silane" 검색 시 책 + OSHA 모두 노출 | ✅ |

**FR 충족**: **10/10 (100%)**

### 4.2 Minor Gap (5건, 비선택적 polish)

| ID | 항목 | 설명 | 우선순위 |
|----|------|------|:--------:|
| M1 | partTitle 텍스트 미세 불일치 | extract-quotes vs sources.ts (예: "Controls and Emergency" vs "Controls and Emergency Actions"). UI 의미 전달 O | P3 |
| M2 | Design §3.2 selector 변경 | Part 1A에 HF Special Hazard 추가, Part 2에서 제거 등. Design §11.2 step 9가 의도된 조정 허용 | P3 |
| M3 | QuoteCard 구조 분리 | Design 명시 "단일 컴포넌트"에서 BookQuoteCard/OshaQuoteCard 2개 helper로 분리. 외부 export는 QuoteCard 유지, 실질 위반 X | P3 |
| M4 | Fuse weight: sourceId 미포함 | Plan 명시 weight 0.05에서 미포함. Design 취합 결과 sourceId는 필터(검색 X) 처리. 올바른 결정 | P3 |
| M5 | FilterButton focus-visible ring | 키보드 A11y: `:focus-visible` ring 미정의. Tab 작동 O, 시각 포커스 미표시 | P3 |

**Match Rate: 95% (Critical 0 + Major 0 + Minor 5 × -1)**

---

## 5. 배운 점

### 5.1 잘된 점

**1) Discriminated Union의 효과**  
sourceId가 문자열 literal로 정의되니 TypeScript 타입 narrowing이 자동으로 작동. 런타임 분기 없이 컴파일 타임에 필드 검증 가능. (예: `quote.sourceId === 'epi-semi-hazards'` 후 quote.chapter 접근 자동 ok)

**2) Selector Array의 명시성**  
정의 추출을 "자동 스캔"이 아닌 "explicit selector"로 전환하자, **0 selector miss 달성**. OSHA MDX 구조가 일관되지 않아도 사전 정의된 11개만 안전하게 추출.

**3) Source 필터 UI 자동화**  
`getOrderedSources()` 단일 진실로 sources.ts 참조. 신규 자료원 추가 시 extract-quotes + sources.ts 2줄만 수정하면 `/quotes` 필터 자동 확장. **Extensibility-first 증명**.

**4) Word-boundary truncate의 자연스러움**  
OSHA quote text가 길 때 단순 N자 cut이 아니라 마지막 space 기준으로 truncate → "…" 부착. 문단 중간이 아닌 단어 끝에서 끊어져 읽기 자연스러움. (197자 → "…" 포함 200자 이하로 포장)

**5) 신규 인프라 0 유지**  
새 컴포넌트/라이브러리 추가 없이 기존 디자인 토큰(Chip, Card, Badge)과 routes만 재사용. Maintenance burden 0.

### 5.2 개선 기회

**1) OSHA Quote 텍스트 품질 기준**  
첫 번째 cycle이라 정의 선정이 주관적일 수 있음. 향후 "정의가 아닌 배경 설명" 후보들을 제외하는 체크리스트 추가 가능.

**2) Source 필터와 Type/Chapter 필터의 상호작용**  
현재 Source=OSHA 시 Type/Chapter를 숨김. 더 고급 사용자를 위해 "OSHA quote의 kind로 필터" 옵션도 고려 가능 (예: OSHA 정의만 보기).

**3) partTitle 동기화 자동화**  
extract-quotes.mjs의 OSHA_PART_META와 sources.ts가 현재 수동 미러. 글자 차이(예: "Actions" vs "Procedures")로 갭이 생김. TS에서 자동 export 후 .mjs에서 import 하면 해결 가능 (현재는 node/esm 호환성 등으로 미보류).

---

## 6. Polish & 제한 (선택 사항, 향후 cycle)

하단 4개는 ship-blocker가 아니며, 이후 cycle이나 dedicated polish로 처리 가능:

| ID | 항목 | 우선순위 | 예상 시간 |
|----|------|:--------:|:-------:|
| M1 | sources.ts ↔ extract-quotes partTitle 글자 정렬 | P3 | 10m |
| M5 | FilterButton focus-visible ring (`:focus-visible:ring-2 focus-visible:ring-brand-300`) | P3 | 5m |
| 문서 | Design v0.2 업데이트 (selector 변경 사항 반영) | P3 | 10m |
| 검증 | Happy C 명시 수행 (source=OSHA + "summary" → 5 결과 확인) | P3 | 5m |

---

## 7. 다음 단계

### 7.1 본 cycle 종료

- [ ] 본 보고서 사용자 검토
- [ ] `/pdca archive quotes-source-filter --summary` 권장  
  (98% 이상의 메트릭 보존 + 향후 multi-source 통계 추적)

### 7.2 선택: 후속 cycle

향후 필요 시:
- **A11y Polish**: M5 focus-visible ring 추가 (5m)
- **Design Sync**: Design v0.2 발행 (selector 실제 결과 반영)
- **Advanced Filtering**: OSHA quote를 kind별로도 필터 (overview/definition만 등)
- **Additional Sources**: KOSHA/SEMI 인용 추출 onboarding (extract-quotes 함수 1개 + sources.ts 1줄)

### 7.3 cross-link-system 연계

본 cycle은 `cross-link-system` FR-12 (deferred polish)의 정식화.  
→ cross-link-system archive에 "FR-12 Resolved as quotes-source-filter v1.0 (95% Match Rate)" 기록 권장.

---

## 8. 버전 이력

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-05-30 | 초기 완료 보고서 — 95% Match Rate, 117 quotes (책 91 + OSHA 26), 4 파일 수정 + 1 재생성, 0 iteration, 신규 인프라 0, Extensibility-first 패턴 확산 | DrunkenZealnut |

---

## 연관 문서

- **Plan**: [docs/01-plan/features/quotes-source-filter.plan.md](../../01-plan/features/quotes-source-filter.plan.md) — v0.2 Option B
- **Design**: [docs/02-design/features/quotes-source-filter.design.md](../../02-design/features/quotes-source-filter.design.md) — v0.1
- **Analysis**: [docs/03-analysis/quotes-source-filter.analysis.md](../../03-analysis/quotes-source-filter.analysis.md) — Match Rate 95%
- **Archive**: `/pdca archive quotes-source-filter --summary` 권장
