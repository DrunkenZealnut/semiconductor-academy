---
template: design
version: 1.2
description: PDCA Design — /quotes 통합 인덱스 (책 + OSHA), extract-quotes OSHA 분기 + QuoteItem union + source 필터
variables:
  feature: quotes-source-filter
  date: 2026-05-30
  author: DrunkenZealnut
  project: semiconductor-academy
  version: 0.1.0
---

# quotes-source-filter Design Document

> **Summary**: `QuoteItem`을 discriminated union(book | osha)으로 재설계하고, `extract-quotes.mjs`에 OSHA Markdown 추출 함수를 추가한다. OSHA Part별로 4 패턴(Course Overview / Learning Objectives / Course Summary / 핵심 정의 selector)을 추출해 ~26 quotes 생성. QuoteCard는 conditional rendering, QuoteIndex는 source 필터 + Fuse keys 확장. 신규 컴포넌트 0개, 기존 디자인 토큰 100% 재사용.
>
> **Project**: semiconductor-academy
> **Version**: 0.1.0
> **Author**: DrunkenZealnut
> **Date**: 2026-05-30
> **Status**: Draft
> **Planning Doc**: [quotes-source-filter.plan.md](../../01-plan/features/quotes-source-filter.plan.md) (v0.2 Option B)

### Pipeline References

| Phase | Document | Status |
|-------|----------|--------|
| Phase 1 (Schema) | N/A | — |
| Phase 2 (Convention) | §10 통합 | — |
| Phase 3 (Mockup) | §5 통합 | — |
| Phase 4 (API) | N/A | — |

---

## 1. Overview

### 1.1 Design Goals

1. **Source-agnostic 데이터 모델** — `QuoteItem`을 discriminated union으로 재설계, 향후 KOSHA·SEMI 등도 동일 패턴으로 추가
2. **OSHA 추출 정책의 명시성** — 4 패턴(Overview/LO/Summary/Definition) selector 배열로 명문화. 주관성을 코드 수준에서 통제
3. **UI 분기 최소화** — QuoteCard 1 컴포넌트에서 conditional rendering, 신규 컴포넌트 0개
4. **검색 통합** — Fuse 단일 인덱스에 책+OSHA 모두 포함, source 필터로 슬라이싱
5. **확장 패턴 정착** — 신규 자료원 추가 시 extract-quotes에 함수 1개 추가 + sources hard-code 1줄 추가만으로 자동 편입

### 1.2 Design Principles

- **Data-first** — `QuoteItem` union 확정 → extract 알고리즘 → UI 분기
- **Discriminated union over optional fields** — sourceId discriminator로 TypeScript narrowing
- **Selector explicitness** — OSHA 정의 추출은 selector 배열로 사전 정의(주관 명시), 자동 모든 ### 추출 금지
- **YAGNI 준수** — type 필터 통합·재설계 등 over-engineering 회피. 책 type 2개 + OSHA kind 4개 분리 보존
- **Build-time first** — 모든 quote는 빌드 시점 생성, 런타임 fetch 0회

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  BUILD TIME (extract-quotes.mjs 확장)                       │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ chapters/    │  │ osha-scs/    │  │ OSHA_PART_META   │   │
│  │ *.mdx (17)   │  │ part-*.mdx(5)│  │ (.mjs 내 hard-   │   │
│  │              │  │              │  │  code, 5 entry)  │   │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘   │
│         ↓                 ↓                   ↓             │
│   extractBookQuotes  extractOshaQuotes  + OSHA_DEF_SELECTORS│
│   (기존 LE+SQ)       (Overview/LO/      (Part 1a·2·3·4    │
│                       Summary/Definition) 정의 selector)    │
│         ↓                 ↓                                 │
│         └───────┬─────────┘                                 │
│                 ↓                                           │
│        모든 quote에 sourceId+language 부여                  │
│                 ↓                                           │
│         src/data/quotes.json (116±5 entries)                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  RUNTIME                                                    │
│   /quotes/page.tsx                                          │
│      ↓                                                      │
│   QuoteIndex.tsx                                            │
│      ┌────────────────────────────────┐                     │
│      │ Source filter [all/book/osha]  │ ← getOrderedSources │
│      │ + 기존 type filter             │                     │
│      │ + 기존 chapter filter           │                     │
│      │ + Fuse(text/section/...)       │                     │
│      └────────────────────────────────┘                     │
│      ↓                                                      │
│   QuoteCard.tsx (conditional rendering by quote.sourceId)   │
│      ┌──────────────┐    ┌──────────────────────┐           │
│      │ 책 quote     │    │ OSHA quote           │           │
│      │ Ch.X chip    │    │ Part·SectionRef chip │           │
│      │ → /chapter/  │    │ → /sources/osha-scs/ │           │
│      └──────────────┘    └──────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
신규 자료원 onboarding 시나리오:

1. lib/sources.ts에 새 source entry 추가 (cross-link cycle과 동일)
2. (해당 자료원에서 quote 추출 원하면) extract-quotes.mjs에:
   - 자료원별 함수 작성 (예: extractKoshaQuotes)
   - 자료원 메타 hard-code (5 entry 미만이면 inline, 그 이상이면 별도 미러)
3. npm run extract:quotes → quotes.json에 자동 편입
4. QuoteCard에 sourceId 분기 추가 (필요 시)
5. UI는 source 필터 옵션이 동적으로 늘어남 (getOrderedSources)

→ 코어 변경: extract-quotes 함수 1개 + QuoteCard 분기 1개. 단순.
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| `extract-quotes.mjs` | `chapters/*.mdx`, `sources/osha-scs/*.mdx`, `chapters.json`, OSHA_PART_META(inline) | quote 산출 |
| `QuoteItem` 타입 | (pure types) | 데이터 형식 |
| `QuoteCard` | `QuoteItem`, `Source` (sourceId resolve), `SourceBadge` | 카드 렌더 |
| `QuoteIndex` | `QuoteItem[]`, `getOrderedSources()`, Fuse | 검색/필터 |
| `/quotes/page.tsx` | `quotes.json`, `QuoteIndex` | 페이지 |

---

## 3. Data Model

### 3.1 QuoteItem (Discriminated Union)

```typescript
// src/components/quote-index/QuoteCard.tsx (재설계)

interface BaseQuote {
  id: string;
  sourceId: string;
  language: 'ko' | 'en';
  text: string;
  snippet: string;
}

/** 책(에피스테메) 인용 — 기존 필드 보존 + discriminator 추가 */
export interface BookQuote extends BaseQuote {
  sourceId: 'epi-semi-hazards';
  language: 'ko';
  type: 'layered-explain' | 'source-quote';
  /** 책 quote 전용 메타 */
  chapter: number;
  chapterTitle: string;
  chapterShortTitle: string;
  chapterSlug: string;
  page: number | null;
  section: string | null;
}

/** OSHA SCS 인용 */
export interface OshaQuote extends BaseQuote {
  sourceId: 'osha-scs';
  language: 'en';
  /** OSHA quote 종류 — UI 라벨용 (책 type과는 별도 enum) */
  kind: 'overview' | 'learning-objectives' | 'summary' | 'definition';
  /** 'osha-section' 단일 값 — 책 type 필터와 호환을 위해 분리 */
  type: 'osha-section';
  /** OSHA quote 전용 메타 */
  partId: string;            // 'part-1a' | 'part-1b' | 'part-2' | 'part-3' | 'part-4'
  partTitle: string;         // 'Part 1A · Introduction to GHS'
  partHref: string;          // '/sources/osha-scs/part-1a/'
  /** Definition일 때 ### 헤딩 텍스트 (예: '§5 Silane — Special Focus') */
  sectionRef?: string;
}

export type QuoteItem = BookQuote | OshaQuote;
```

### 3.2 OSHA Part 메타 + Definition Selector (extract-quotes.mjs 내 hard-code)

```javascript
// scripts/extract-quotes.mjs (신규 추가)

/**
 * OSHA SCS Part 메타.
 * ⚠️ src/lib/sources.ts OSHA_SCS.sections 와 동기화 필요.
 *    부분(.ts) → 빌드(.mjs) 양방향 데이터는 cross-link-system Design §3.2와 동일 패턴
 *    (수동 미러). 5 entry라 자동화 비용 > 이득.
 */
const OSHA_PART_META = [
  { partId: 'part-1a', partTitle: 'Part 1A · Introduction to GHS',                          partHref: '/sources/osha-scs/part-1a/' },
  { partId: 'part-1b', partTitle: 'Part 1B · Communication, Controls, and Emergency',       partHref: '/sources/osha-scs/part-1b/' },
  { partId: 'part-2',  partTitle: 'Part 2 · Chemical Hazards, Controls, and Emergency',     partHref: '/sources/osha-scs/part-2/' },
  { partId: 'part-3',  partTitle: 'Part 3 · Extremely Hazardous Chemicals',                 partHref: '/sources/osha-scs/part-3/' },
  { partId: 'part-4',  partTitle: 'Part 4 · Hazardous Gas Systems and Controls',            partHref: '/sources/osha-scs/part-4/' },
];

/**
 * 핵심 정의 추출 selector 배열.
 * 각 entry는 특정 Part의 한 ### 또는 ## 헤딩과 그 다음 단락을 정의 quote로 추출한다.
 * Plan §2.3에서 합의한 11개 정의 후보.
 */
const OSHA_DEFINITION_SELECTORS = [
  // Part 1A
  { partId: 'part-1a', heading: '## 4. Three Types of Hazards',           sectionRef: '§4 Three Types of Hazards' },
  { partId: 'part-1a', heading: '### 5.4 Pyrophoric Substances',          sectionRef: '§5.4 Pyrophoric Substances' },
  // Part 1B (정의 후보 — 정확한 헤딩명은 Do 단계에서 확인)
  { partId: 'part-1b', heading: '### SDS Format',                         sectionRef: 'SDS Format' },
  // Part 2
  { partId: 'part-2',  heading: '### Flash Point',                        sectionRef: 'Flash Point' },
  { partId: 'part-2',  heading: '## 6. Pyrophoric Chemicals',             sectionRef: '§6 Pyrophoric Chemicals' },
  { partId: 'part-2',  heading: '### 6.3 Hydrofluoric Acid (HF) — Special Hazard', sectionRef: '§6.3 HF Special Hazard' },
  // Part 3
  { partId: 'part-3',  heading: '## 5. Silane — Special Focus',           sectionRef: '§5 Silane — Special Focus' },
  { partId: 'part-3',  heading: '## 1. Toxic Hydride Gases',              sectionRef: '§1 Toxic Hydride Gases' },
  // Part 4
  { partId: 'part-4',  heading: '## 2. Cryogenic Cylinders (Dewars)',     sectionRef: '§2 Cryogenic Cylinders' },
  { partId: 'part-4',  heading: '## 5. Common Gas Controls',              sectionRef: '§5 Common Gas Controls' },
];
```

**예상 quote 수 분포**:

| Pattern | 추출 갯수 | Sample |
|---------|:---:|--------|
| Overview | 5 (1/Part) | Part 1A: "Introduction to the GHS for semiconductor employees…" |
| Learning Objectives | 5 (1/Part) | Part 1A: "Identify what is included in the GHS; Recognize hazardous chemicals…" |
| Summary | 5 (1/Part) | Part 3 Summary 핵심 |
| Definition | ~10 (Selector) | Part 3 Silane Special Focus 등 |
| **합계** | **~25** | |

(±5 허용 — 실제는 Do에서 미세 조정)

### 3.3 Entity Relationships

```
┌─────────────────────────┐
│ Source (lib/sources.ts) │
│  - epi-semi-hazards     │
│  - osha-scs             │
└────────────┬────────────┘
             │ 1
             │
             ▼ N
       ┌──────────┐
       │ Section  │ (chapter / part)
       └─────┬────┘
             │ 1
             │
             ▼ M
       ┌──────────┐
       │ QuoteItem│ (BookQuote | OshaQuote)
       └──────────┘
            ↑
            │ Fuse index keys:
            │ text, section/partTitle, chapterTitle, page, sectionRef, sourceId
            ↑
       ┌──────────┐
       │QuoteIndex│ ← filters (source, type, chapter, query)
       └──────────┘
```

### 3.4 Sample OSHA Quote (Part 3 Silane Special Focus)

```json
{
  "id": "osha-scs::part-3::definition::silane-special-focus",
  "sourceId": "osha-scs",
  "language": "en",
  "type": "osha-section",
  "kind": "definition",
  "partId": "part-3",
  "partTitle": "Part 3 · Extremely Hazardous Chemicals",
  "partHref": "/sources/osha-scs/part-3/",
  "sectionRef": "§5 Silane — Special Focus",
  "text": "Silane is a colorless, flammable, pyrophoric gas with a sharp repulsive odor. Used widely in semiconductor manufacturing for deposition of silicon-based films...",
  "snippet": "Silane is a colorless, flammable, pyrophoric gas with a sharp repulsive odor. Used widely in semiconductor manufacturing for…"
}
```

---

## 4. API Specification

N/A — 정적 사이트. 다만 빌드 스크립트의 동작 명세:

### 4.1 extract-quotes.mjs CLI (확장)

**Input** (자동):
- `src/content/chapters/*.mdx` (기존)
- `src/content/sources/osha-scs/part-*.mdx` (신규)
- `src/data/chapters.json` (기존)
- OSHA_PART_META + OSHA_DEFINITION_SELECTORS (inline)

**Process**:
1. 책 추출 (기존 `extractLayeredExplain`, `extractSourceQuotes`) — 각 결과에 `sourceId: 'epi-semi-hazards'`, `language: 'ko'` 자동 부여
2. OSHA 추출 (신규 함수 4개):
   - `extractOshaCourseOverview(src, part)` — `## Course Overview` 다음 단락 1 quote
   - `extractOshaLearningObjectives(src, part)` — `### Learning Objectives` 다음 bullets 묶어 1 quote
   - `extractOshaCourseSummary(src, part)` — `## Course Summary` 다음 단락 1 quote
   - `extractOshaDefinitions(src, part, selectors)` — 매칭 selector의 다음 단락 추출
3. 모든 OSHA quote는 `sourceId: 'osha-scs'`, `language: 'en'`
4. text는 ≤ 200자 truncate, snippet은 ≤ 140자

**Output**:
- `src/data/quotes.json` (116±5 entries)
- stderr: 책별·OSHA Part별 추출 통계

**Error Handling**:
- selector 매칭 0건 → 경고만 (selector 갱신 알림), 빌드 계속
- OSHA MDX 파일 누락 → 경고만, 책 추출은 계속
- text 빈 결과 → 그 quote skip

### 4.2 OSHA 추출 알고리즘 (의사코드)

```javascript
// Course Overview pattern
function extractOshaCourseOverview(src, partMeta) {
  // line-based scan
  const lines = src.split('\n');
  const headingIdx = lines.findIndex(l => /^## Course Overview\s*$/.test(l));
  if (headingIdx === -1) return null;
  // collect non-empty lines after heading until next blank or next ##/###
  const buf = [];
  for (let i = headingIdx + 1; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l === '') {
      if (buf.length > 0) break;
      continue;
    }
    if (l.startsWith('## ') || l.startsWith('### ')) break;
    buf.push(l);
  }
  const text = buf.join(' ').trim();
  if (!text) return null;
  return makeOshaQuote(partMeta, 'overview', text, null);
}

// Learning Objectives pattern (bullets 묶기)
function extractOshaLearningObjectives(src, partMeta) {
  const lines = src.split('\n');
  const headingIdx = lines.findIndex(l => /^### Learning Objectives\s*$/.test(l));
  if (headingIdx === -1) return null;
  const bullets = [];
  let pre = ''; // "After completing this course..."
  for (let i = headingIdx + 1; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l === '' && bullets.length > 0 && /^[-*]\s/.test(lines[i - 1]?.trim() ?? '') === false) {
      // post-bullets blank
      if (bullets.length > 0) break;
      continue;
    }
    if (l.startsWith('## ') || l.startsWith('### ')) break;
    if (l.startsWith('- ') || l.startsWith('* ')) {
      bullets.push(l.replace(/^[-*]\s/, ''));
    } else if (l && bullets.length === 0) {
      pre = pre ? `${pre} ${l}` : l;
    }
  }
  const text = bullets.length > 0
    ? `${pre ? pre + ' ' : ''}${bullets.join('; ')}`
    : pre;
  if (!text) return null;
  return makeOshaQuote(partMeta, 'learning-objectives', text, null);
}

// Course Summary pattern (Overview와 동일 로직, 헤딩만 다름)
function extractOshaCourseSummary(src, partMeta) {
  // ... same as Overview but with /^## Course Summary\s*$/
}

// Definition pattern (selector array)
function extractOshaDefinitions(src, partMeta, selectors) {
  const results = [];
  const lines = src.split('\n');
  for (const sel of selectors) {
    if (sel.partId !== partMeta.partId) continue;
    const headingIdx = lines.findIndex(l => l.trim() === sel.heading);
    if (headingIdx === -1) {
      console.warn(`[extract-quotes] OSHA selector miss: ${sel.partId} / ${sel.heading}`);
      continue;
    }
    const buf = [];
    for (let i = headingIdx + 1; i < lines.length; i++) {
      const l = lines[i].trim();
      if (l === '' && buf.length > 0) break;
      if (l.startsWith('## ') || l.startsWith('### ')) break;
      if (l === '') continue;
      buf.push(l);
    }
    const text = buf.join(' ').trim();
    if (!text) continue;
    results.push(makeOshaQuote(partMeta, 'definition', text, sel.sectionRef));
  }
  return results;
}

// Helper
function makeOshaQuote(partMeta, kind, rawText, sectionRef) {
  const text = truncate(rawText, 200);
  const slug = sectionRef
    ? slugify(sectionRef)
    : kind;
  return {
    id: `osha-scs::${partMeta.partId}::${kind}::${slug}`,
    sourceId: 'osha-scs',
    language: 'en',
    type: 'osha-section',
    kind,
    partId: partMeta.partId,
    partTitle: partMeta.partTitle,
    partHref: partMeta.partHref,
    sectionRef: sectionRef ?? undefined,
    text,
    snippet: makeSnippet(text, 140),
  };
}

function truncate(text, maxLen) {
  if (text.length <= maxLen) return text;
  // word-boundary truncate
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > maxLen * 0.7 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…';
}
```

---

## 5. UI/UX Design

### 5.1 /quotes 헤더 (mockup)

```
┌─────────────────────────────────────────────────────────────┐
│ Source Quote Index                                          │
│                                                             │
│ 책 + OSHA 통합 인용 인덱스                                  │
│                                                             │
│ 학술서 「반도체 산업의 유해인자」 책 인용 91개 +            │
│ OSHA Semiconductor Chemical Safety 5 Part에서 추출한        │
│ 핵심 인용 25개. 키워드(예: silane, flash point),            │
│ 자료원·챕터·유형으로 검색할 수 있어요.                       │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 검색·필터 영역 (QuoteIndex)

```
┌─────────────────────────────────────────────────────────────┐
│ 🔎 [silane                                          ] [X]   │
│                                                             │
│ Source: [전체 116] [📖 책 91] [🏛 OSHA 25]                  │
│ Type:   [전체] [도입 인용] [본문 인용]                       │
│ Chapter: [전체] [1] [2] ... [17]                            │
└─────────────────────────────────────────────────────────────┘
```

**핵심 변경**:
- Source 필터 row 신규 (자료원 ≥ 2 일 때만 표시 — 현재는 항상 표시)
- 각 source 옵션에 카운트 표시
- 기존 Type 필터는 책 quote 한정 작동 — Source 필터로 OSHA 선택 시 Type 필터는 자동 숨김 또는 disabled
- 기존 Chapter 필터도 동일 — Source 필터로 OSHA 선택 시 자동 숨김

### 5.3 QuoteCard (책 vs OSHA)

```
┌─────────── 책 quote ──────────────┐  ┌────────── OSHA quote ─────────────┐
│ [✨ 도입 인용] [Ch.7 확산] [p.95]   │  │ [🏛 OSHA] [EN] [Part 3 · 정의]     │
│                                   │  │                                    │
│ 6.3.1 도펀트 가스                 │  │ §5 Silane — Special Focus          │
│                                   │  │                                    │
│ │ 확산 공정에서 사용되는           │  │ │ Silane is a colorless, flammable,│
│ │ AsH3, PH3 등 도펀트 가스는…     │  │ │ pyrophoric gas with a sharp…    │
│                                   │  │                                    │
│ 📖 챕터에서 보기 →                │  │ 🏛 OSHA Part 3에서 보기 →          │
└───────────────────────────────────┘  └────────────────────────────────────┘
```

### 5.4 컴포넌트 인터페이스

```typescript
// QuoteCard 분기 로직 (key)
function QuoteCard({ quote }: { quote: QuoteItem }) {
  if (quote.sourceId === 'epi-semi-hazards') {
    // 기존 책 카드 (Ch chip, page chip, /chapter/ 링크)
    return <BookQuoteCard quote={quote} />;
  }
  if (quote.sourceId === 'osha-scs') {
    // OSHA 카드 (Part·kind chip, sectionRef, /sources/osha-scs/{partId}/ 링크)
    return <OshaQuoteCard quote={quote} />;
  }
  return null; // 미래 자료원
}
```

또는 conditional fields로 단일 컴포넌트 유지:
```typescript
function QuoteCard({ quote }: { quote: QuoteItem }) {
  const isOsha = quote.sourceId === 'osha-scs';
  const Icon = isOsha ? ShieldCheck : (quote.type === 'layered-explain' ? Sparkles : BookOpen);
  // ...meta chips conditional...
  const href = isOsha ? quote.partHref : `/chapter/${quote.chapterSlug}/`;
  // ...
}
```

선택: **conditional fields (단일 컴포넌트)** — 새 컴포넌트 0개, 분기 로직만 추가.

### 5.5 Source 필터 컴포넌트

```typescript
// QuoteIndex.tsx 내부
import { getOrderedSources } from '@/lib/sources';

const sources = useMemo(() => getOrderedSources(), []);
const counts = useMemo(() => {
  const m: Record<string, number> = { all: quotes.length };
  for (const s of sources) m[s.id] = quotes.filter((q) => q.sourceId === s.id).length;
  return m;
}, [quotes, sources]);

const showSourceFilter = sources.length >= 2;
const [sourceFilter, setSourceFilter] = useState<string>('all');
```

UI는 기존 type 필터 chip 스타일 재사용:
```tsx
{showSourceFilter && (
  <FilterRow label="Source">
    <Chip active={sourceFilter === 'all'} onClick={() => setSourceFilter('all')}>
      전체 {counts.all}
    </Chip>
    {sources.map((s) => (
      <Chip key={s.id} active={sourceFilter === s.id} onClick={() => setSourceFilter(s.id)}>
        {s.accent === 'book' ? '📖' : '🏛'} {s.title} {counts[s.id]}
      </Chip>
    ))}
  </FilterRow>
)}
```

### 5.6 Fuse Keys 갱신

```typescript
new Fuse(quotes, {
  keys: [
    { name: 'text', weight: 0.45 },
    { name: 'section', weight: 0.15 },         // 책 quote
    { name: 'sectionRef', weight: 0.15 },      // OSHA quote
    { name: 'chapterTitle', weight: 0.1 },     // 책
    { name: 'partTitle', weight: 0.1 },        // OSHA
    { name: 'page', weight: 0.05 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
});
```

---

## 6. Error Handling

| 상황 | 대응 |
|------|------|
| OSHA selector 헤딩 매칭 실패 | stderr 경고: `[extract-quotes] OSHA selector miss: part-3 / ### Foo`. 빌드 계속 |
| OSHA MDX 파일 누락 | stderr 경고, 책 추출은 계속 |
| OSHA quote text 빈 결과 | 해당 quote skip (push 안 함) |
| Fuse 검색 매치 0건 | 기존 UI 그대로 ("결과 없음" 메시지) |
| 런타임 sourceId가 예상 외 값 | QuoteCard에서 `return null` (방어적) |
| Source 필터 + Type 필터 충돌 (OSHA 선택 + Type=layered-explain) | Source가 OSHA일 때 Type 필터 자동 'all'로 리셋 |

---

## 7. Security Considerations

정적 사이트 + 사용자 입력 없음:

- [x] XSS — 모든 quote text는 빌드 타임 + plain text strip
- [x] 외부 링크 — OSHA quote는 내부 `/sources/osha-scs/` 라우트만, target 변경 없음
- [x] 저작권 — OSHA 본문 영어 원문 그대로(≤ 200자 인용은 Fair use + Public Domain), 의역 금지

---

## 8. Test Plan

### 8.1 Test Scope

| Type | Target | Tool |
|------|--------|------|
| Build | `npm run extract:quotes`, `npm run build` 통과 | local |
| Type safety | `tsc --noEmit` | tsc |
| 수동 회귀 | 책 91 quote 기존 표시 동일 | 빌드 후 spot check |
| 추출 정확성 | OSHA 25±5 quote 추출, selector miss 0~1건 허용 | stderr 로그 |
| 검색 통합 | "silane" → 책 + OSHA, "flash point" → OSHA만, "사전주의" → 책만 | 수동 |
| Source 필터 | 책/OSHA/전체 토글 시 카운트·표시 정확 | 수동 |

### 8.2 Test Cases (Key)

- [ ] **Happy A**: "silane" 검색 → 책 Ch.10 deposition + OSHA Part 3 §5 모두 노출
- [ ] **Happy B**: "flash point" 검색 → OSHA Part 2 §Flash Point 노출, 책 0건
- [ ] **Happy C**: source=OSHA 필터 + "summary" → 5 Part Course Summary
- [ ] **Regression A**: 기존 책 91 quote 표시 동일 (텍스트, 메타, 링크)
- [ ] **Edge A**: source=OSHA 선택 시 type/chapter 필터 자동 숨김 또는 disabled
- [ ] **Error A**: selector 변조 후 extract → 경고 로그, 빌드 계속
- [ ] **A11y**: source 필터 chip 키보드 포커스 + 다크모드 대비

---

## 9. Clean Architecture

### 9.1 Layer Structure

| Layer | Responsibility | Location |
|-------|---------------|----------|
| Presentation | QuoteCard, QuoteIndex, page.tsx | `src/components/quote-index/`, `src/app/quotes/` |
| Application | Fuse 검색·필터 (QuoteIndex 내부 hooks) | 동일 |
| Domain | QuoteItem union, BookQuote, OshaQuote | `src/components/quote-index/QuoteCard.tsx` (export) |
| Infrastructure | extract-quotes.mjs, quotes.json | `scripts/`, `src/data/` |

### 9.2 Dependency Rules

```
page.tsx
  ↓
QuoteIndex (lib/sources, Fuse)
  ↓
QuoteCard (lib/sources, lib/types Source) ← QuoteItem types
  ↑                                          ↑
  └─────── imports types ──────────────────┘
```

### 9.3 File Import Rules

| From | Can Import | Cannot |
|------|-----------|--------|
| QuoteIndex | QuoteCard, types, lib/sources, lib/cn, Fuse | scripts |
| QuoteCard | lib/sources, lib/cn, components/sources/SourceBadge, lucide | scripts |
| extract-quotes.mjs | Node fs/path/url, raw .mdx | TS 직접 import 불가 (OSHA_PART_META inline) |

### 9.4 This Feature's Layer Assignment

| Component | Layer | Location |
|-----------|-------|----------|
| QuoteItem, BookQuote, OshaQuote types | Domain | QuoteCard.tsx 상단 export |
| QuoteCard 분기 로직 | Presentation | QuoteCard.tsx |
| Source 필터 UI | Presentation | QuoteIndex.tsx |
| Fuse keys 확장 | Application | QuoteIndex.tsx 내부 |
| OSHA 추출 함수 | Infrastructure | extract-quotes.mjs |

---

## 10. Coding Convention Reference

### 10.1 Naming

| Target | Rule | Example |
|--------|------|---------|
| QuoteItem 변형 | PascalCase | `BookQuote`, `OshaQuote` |
| OSHA kind enum | kebab-case 'overview', 'learning-objectives', 'summary', 'definition' | union string literal |
| OSHA Part ID | kebab-case (sources.ts와 일치) | 'part-1a', 'part-3' |
| OSHA quote id | `osha-scs::{partId}::{kind}::{slug}` | `osha-scs::part-3::definition::silane-special-focus` |
| 선택자 헤딩 | exact match string | `'## 5. Silane — Special Focus'` |

### 10.2 Import Order — 기존 룰

### 10.3 ENV — 신규 0개

### 10.4 본 cycle 컨벤션

| Item | 규칙 |
|------|------|
| OSHA quote text 길이 | ≤ 200자 (word-boundary truncate, `…` 부착) |
| OSHA quote text 의역 | 금지 (영어 원문 그대로) |
| OSHA_PART_META 동기화 | extract-quotes.mjs 헤더 주석에 `lib/sources.ts 동기화 필수` 명시 |
| OSHA selector 작성 | 정확한 헤딩 텍스트 1:1 매칭 (정규식 회피, 부분 매칭 회피) |
| Conditional rendering | 단일 컴포넌트 + sourceId discriminator (신규 컴포넌트 0) |
| 디자인 토큰 | 기존 chip/카드 패턴 재사용 (신규 토큰 0) |

---

## 11. Implementation Guide

### 11.1 File Structure (변화분)

```
src/
  components/quote-index/
    QuoteCard.tsx                ← REWRITE (union 타입 + 분기 + SourceBadge)
    QuoteIndex.tsx               ← EXTEND (source 필터 + Fuse keys)
  app/quotes/page.tsx            ← EXTEND (헤더·카운트)
  data/quotes.json               ← REGENERATE (책 91 + OSHA ~25)
scripts/
  extract-quotes.mjs             ← EXTEND (OSHA 추출 4 함수 + meta + selectors)
```

신규 파일 0개, 모두 기존 파일 수정/재생성.

### 11.2 Implementation Order

총 추정 시간: **2~2.5시간**

| 단계 | 작업 | 예상 |
|:---:|------|:---:|
| 1 | `QuoteCard.tsx` 상단 QuoteItem union 타입 재설계 | 15m |
| 2 | `extract-quotes.mjs` 책 추출 결과에 sourceId/language 부여 (기존 동작 유지) | 10m |
| 3 | `extract-quotes.mjs` OSHA_PART_META + OSHA_DEFINITION_SELECTORS 상수 추가 | 5m |
| 4 | `extractOshaCourseOverview` 함수 작성 + 5 Part 적용 | 15m |
| 5 | `extractOshaLearningObjectives` 함수 + 5 Part 적용 | 15m |
| 6 | `extractOshaCourseSummary` 함수 + 5 Part 적용 | 10m |
| 7 | `extractOshaDefinitions` 함수 + selector 매트릭스 적용 | 25m |
| 8 | 1차 `npm run extract:quotes` 실행 + 결과 검증 (책 91 + OSHA 25±5) | 15m |
| 9 | OSHA selector 미세 조정 (selector miss 있으면) + 2차 실행 | 10m |
| 10 | `QuoteCard.tsx` conditional rendering 구현 (책 카드 + OSHA 카드) | 20m |
| 11 | `QuoteIndex.tsx` source 필터 UI + Fuse keys 확장 + Type/Chapter 필터 분기 처리 | 25m |
| 12 | `app/quotes/page.tsx` 헤더 update (카운트 동적, 설명 갱신) | 10m |
| 13 | typecheck + build + 시각 spot check (silane/flash point/사전주의 검색) | 15m |
| 14 | gap-detector 준비 | — |

### 11.3 검증 시나리오

본 cycle 종료 전 다음 수동 시나리오:

```
1. "silane" 검색 → 책 Ch.10 deposition (LE/SQ) + OSHA Part 3 §5 noticed
2. "flash point" 검색 → OSHA Part 2 §Flash Point만 (책 0건)
3. "사전주의" 검색 → 책 Ch.1 LE만 (OSHA 0건)
4. Source=OSHA 필터 → 25 quotes 노출, type/chapter 필터 숨김
5. Source=책 → 91 quotes, type/chapter 필터 작동
6. 카드 클릭: 책 → /chapter/{slug}, OSHA → /sources/osha-scs/{partId}
```

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-30 | 초안: QuoteItem union + extract-quotes OSHA 4 패턴 분기 (Overview/LO/Summary/Definition selector) + Source 필터 UI + Fuse keys 확장 | DrunkenZealnut |
