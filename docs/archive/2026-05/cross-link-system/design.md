---
template: design
version: 1.2
description: PDCA Design — 자료원 간 cross-link 시스템 (확장성 우선 설계, manifest-driven)
variables:
  feature: cross-link-system
  date: 2026-05-30
  author: DrunkenZealnut
  project: semiconductor-academy
  version: 0.1.0
---

# cross-link-system Design Document

> **Summary**: 책 ↔ OSHA ↔ 화학물질 양방향 cross-link 시스템을 **manifest-driven extensibility** 원칙으로 설계. 향후 자료원 추가(SEMI·KOSHA·논문 등)가 **코드 수정 최소화**로 가능하도록 (1) 자료원 자동 발견(`_links.json` glob 스캔) (2) 어휘 enum 단일 위치 확장 (3) UI 컴포넌트의 source 수 무관성 (4) 신규 chemical/topic graceful degradation을 핵심으로 한다.
>
> **Project**: semiconductor-academy
> **Version**: 0.1.0
> **Author**: DrunkenZealnut
> **Date**: 2026-05-30
> **Status**: Draft
> **Planning Doc**: [cross-link-system.plan.md](./plan.md)
> **상속점**: [multi-source-learning-platform archive](../multi-source-learning-platform/)

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

**확장성 5원칙** (사용자 추가 요구사항 직접 반영):

1. **Manifest-driven discovery** — 빌드 스크립트가 `src/content/sources/*/_links.json` glob으로 자료원을 자동 발견. 신규 자료원 추가 시 빌드 스크립트 수정 0건.
2. **Single source of truth for vocabulary** — Topic/Hazard enum은 `lib/cross-link/schema.ts` 단일 파일에 정의. 어휘 확장 PR은 한 곳만 수정.
3. **Source-count-agnostic UI** — `RelatedFromOtherSources`, `ChemicalSourceHub` 등 모든 컴포넌트가 자료원 수(2 → 5 → 20)에 무관하게 작동. 자료원 색상은 `Source.accent` 토큰 동적 매핑.
4. **Graceful degradation** — 알 수 없는 chemical은 stub으로 등록 (경고만, 빌드 실패 없음). 신규 topic이 enum에 없으면 명확한 에러 + 사용 가능 어휘 목록 제시.
5. **Schema versioning** — `cross-link.json`에 `version` 필드. 향후 schema breaking change 시 lookup.ts에서 호환성 처리 가능.

### 1.2 Design Principles

- **Data first** — schema/enum/JSON 확정 후 UI 작성
- **Build time first** — 정적 사이트, 런타임 fetch 0회 유지
- **Zero scope creep** — 직전 cycle Phase A+B에 영향 없음 (수정은 chapter/chemical/osha-part 페이지 3개 + 추가만)
- **YAGNI** — 자료원 추가 시 코드 변경 최소화하되, **과도한 추상화는 금지** (예: 자료원 추가가 1년에 1회 수준이라면 plugin system은 over-engineering)
- **Onboarding documentation** — "새 자료원 5단계 추가 가이드"를 본 문서에 명문화 → 미래의 PDCA cycle이 참조

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  BUILD TIME (확장성 핵심)                                       │
│                                                                 │
│  자료원 N개 (자동 발견):                                        │
│    src/content/sources/osha-scs/_links.json                     │
│    src/content/sources/{future-source}/_links.json   ← 자동 인식│
│    src/data/_book-links.json                         (책 전용)  │
│                                                                 │
│            ↓ glob 스캔                                          │
│                                                                 │
│    scripts/build-cross-link-index.mjs                           │
│      1. 자료원 manifest 로드 (src/data/sources.json)            │
│      2. _links.json 파일들 glob 스캔                            │
│      3. enum 검증 (schema-enum.json, 빌드/런타임 공유)          │
│      4. chemical ID 검증 (chemicals.json 기준)                  │
│      5. 양방향 인덱스 생성                                      │
│                                                                 │
│            ↓                                                    │
│                                                                 │
│    src/data/cross-link.json (산출물)                            │
│      { version, generatedAt, sources[], bySection, byTag }      │
│                                                                 │
│            ↓ Next.js bundle에 포함                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  RUNTIME (정적, 자료원 수 무관)                                 │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ lib/cross-link/lookup.ts                                │   │
│   │   lookupRelated(sourceId, sectionId): RelatedGroup[]    │   │
│   │   lookupByChemical(chemicalId): RelatedGroup[]          │   │
│   │   getSchemaVersion(): string                            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                            ↓                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ Pages                                                   │   │
│   │   /chapter/[slug]              <RelatedFromOther.../>   │   │
│   │   /sources/{source}/{section}  <RelatedFromOther.../>   │   │
│   │   /chemicals/[id]              <ChemicalSourceHub/>     │   │
│   │   /quotes                      <SourceFilter/> (옵션)   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                            ↓                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ Components (source-count-agnostic)                      │   │
│   │   <RelatedFromOtherSources/>  자료원별 그룹, accent 토큰│   │
│   │   <ChemicalSourceHub/>        모든 자료원 통합 허브     │   │
│   │   <RelatedItemCard/>          공유 태그 chip 표시       │   │
│   │   <SourceFilter/> (옵션)      getOrderedSources() 동적  │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow — 신규 자료원 onboarding 시나리오

향후 SEMI S2 표준을 자료원으로 추가하는 시나리오를 예시로:

```
사용자가 SEMI S2를 추가하고 싶다:

  1. src/lib/sources.ts에 1 entry 추가:
       SEMI_S2: { id: 'semi-s2', kind: 'standard', language: 'en', ... sections: [...] }
       SOURCES 배열에 push (또는 lib/sources.ts가 sources.json 동기화)

  2. src/data/sources.json에 메타 추가 (빌드 스크립트용):
       { "semi-s2": { sections: [...] } }

  3. src/content/sources/semi-s2/_links.json 작성:
       { "section-a": { topics: ["...","..."], hazards: [...], chemicals: [...] } }

  4. (콘텐츠 자체) MDX 작성 또는 외부 링크만 등록

  5. npm run build:
       - build-cross-link-index.mjs가 semi-s2/_links.json 자동 발견
       - enum 검증 통과 시 cross-link.json에 자동 편입
       - 기존 책·OSHA 페이지 하단 패널이 자동으로 SEMI 관련 항목 노출

  → 빌드 스크립트, lookup.ts, RelatedFromOtherSources 등
     **코어 코드는 한 줄도 수정하지 않음** (extensibility 달성)
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| `schema.ts` | (pure types) | Topic/Hazard enum, cross-link 타입 정의 |
| `build-cross-link-index.mjs` | `sources.json`, `_links.json` files, `schema-enum.json`, `chemicals.json` | 빌드 산출물 생성 |
| `schema-enum.json` | `schema.ts`에서 export 동기화 | `.mjs`-`.ts` 분리 우회 (Plan §6.2) |
| `lookup.ts` | `cross-link.json`, `lib/sources.ts` | 런타임 조회 |
| `RelatedFromOtherSources` | `lookup.ts`, `lib/sources.ts`, `Source.accent` | 본문 하단 패널 |
| `ChemicalSourceHub` | `lookup.ts`, `lib/sources.ts` | 화학물질 페이지 허브 |
| `RelatedItemCard` | (presentational) | 단일 항목 카드 |

---

## 3. Data Model

### 3.1 Vocabulary Schema (확장성 핵심)

```typescript
// src/lib/cross-link/schema.ts

/**
 * Topic 통제 어휘 — 주제축
 *
 * 확장 정책:
 * - 신규 topic 추가는 본 파일에 1줄 추가 + TOPIC_LABELS에 라벨 추가
 * - 어휘 확장 PR은 별 PDCA cycle 없이 micro-PR로 처리 가능
 * - 현재 21개 (Plan §6.2 ≤22 한도 내)
 */
export const TOPICS = [
  // foundation
  'ghs', 'sds-label', 'chemical-inventory',
  // process safety
  'cleanroom', 'wafer-fab', 'photolithography',
  'etching', 'diffusion', 'deposition',
  'ion-implantation', 'cmp', 'packaging',
  // hazard themes
  'gas-safety', 'liquid-chemicals', 'compressed-gas',
  'cryogenic', 'storage-compatibility',
  // controls
  'engineering-controls', 'ppe', 'emergency-response',
  // health
  'occupational-disease', 'exposure-monitoring', 'industrial-hygiene',
] as const;
export type Topic = (typeof TOPICS)[number];

export const TOPIC_LABELS: Record<Topic, string> = {
  'ghs': 'GHS',
  'sds-label': 'SDS·라벨',
  'chemical-inventory': '화학물질 목록·관리',
  'cleanroom': '클린룸',
  'wafer-fab': '웨이퍼 제조',
  'photolithography': '포토리소그래피',
  'etching': '식각',
  'diffusion': '확산',
  'deposition': '증착',
  'ion-implantation': '이온주입',
  'cmp': 'CMP',
  'packaging': '패키징',
  'gas-safety': '가스 안전',
  'liquid-chemicals': '액체 화학물질',
  'compressed-gas': '압축가스',
  'cryogenic': '극저온',
  'storage-compatibility': '저장·양립성',
  'engineering-controls': '엔지니어링 통제',
  'ppe': '개인보호장구',
  'emergency-response': '비상 대응',
  'occupational-disease': '직업병',
  'exposure-monitoring': '노출 모니터링',
  'industrial-hygiene': '산업위생',
};

/**
 * Hazard 통제 어휘 — 위험축 (현재 12개, Plan ≤12 한도)
 */
export const HAZARDS = [
  'flammable', 'pyrophoric', 'oxidizer',
  'corrosive', 'toxic', 'acute-toxic',
  'carcinogen', 'reproductive-toxin', 'sensitizer',
  'compressed-gas', 'cryogenic', 'reactive',
] as const;
export type Hazard = (typeof HAZARDS)[number];

export const HAZARD_LABELS_CL: Record<Hazard, string> = {
  flammable: '인화성',
  pyrophoric: '자연발화성',
  oxidizer: '산화성',
  corrosive: '부식성',
  toxic: '독성',
  'acute-toxic': '급성 독성',
  carcinogen: '발암성',
  'reproductive-toxin': '생식독성',
  sensitizer: '감작성',
  'compressed-gas': '압축가스',
  cryogenic: '극저온',
  reactive: '반응성',
};

/** Chemical ID 축 — lib/types.ts의 Chemical['id'] 재사용 */
export type ChemicalId = string;

/**
 * Section 단위 태그 (작성자가 _links.json에 작성하는 형식)
 */
export interface SectionLinks {
  topics?: Topic[];
  hazards?: Hazard[];
  chemicals?: ChemicalId[];
}

/** _links.json 파일 형식 — per source */
export interface SourceLinksFile {
  /** sectionId → SectionLinks */
  [sectionId: string]: SectionLinks;
}

/** 빌드 산출물 형식 (cross-link.json) */
export interface CrossLinkIndex {
  /** Schema version — breaking change 시 증가 */
  version: 1;
  generatedAt: string;  // ISO timestamp
  /** Index에 포함된 자료원 ID 목록 (인덱스 시점의 스냅샷) */
  sources: string[];
  /** 정방향: "{sourceId}::{sectionId}" → SectionLinks */
  bySection: Record<string, SectionLinks>;
  /** 역방향: topic → SectionRef[] */
  byTopic: Partial<Record<Topic, SectionRef[]>>;
  /** 역방향: hazard → SectionRef[] */
  byHazard: Partial<Record<Hazard, SectionRef[]>>;
  /** 역방향: chemicalId → SectionRef[] */
  byChemical: Record<ChemicalId, SectionRef[]>;
  /** chemicals.json에 없는 미등록 chemical ID (경고 추적) */
  unknownChemicals: ChemicalId[];
}

export interface SectionRef {
  sourceId: string;
  sectionId: string;
}

/** 패널 렌더링용 — 자료원별 그룹 */
export interface RelatedGroup {
  sourceId: string;
  items: RelatedItem[];
}

export interface RelatedItem {
  sourceId: string;
  sectionId: string;
  title: string;
  href: string;
  /** 공유 태그 — chip으로 표시 */
  sharedTopics: Topic[];
  sharedHazards: Hazard[];
  sharedChemicals: ChemicalId[];
  /** 정렬용: 공유 태그 총수 */
  shareScore: number;
}
```

### 3.2 Build-time / Runtime 분리 (확장성 enabler)

`.mjs` 빌드 스크립트가 `.ts` 직접 import 불가 문제(직전 cycle Design §9.3 결정 상속)를 다음으로 해결:

```
src/lib/cross-link/schema.ts        ← TypeScript 단일 진실
                ↓ (직접 미러링)
src/data/schema-enum.json           ← .mjs가 import하는 JSON

생성 옵션:
  A. 수동 미러링 (schema.ts 변경 시 schema-enum.json도 수정)
  B. 자동 생성: scripts/gen-schema-enum.mjs (schema.ts 파싱)

본 cycle 선택: A. 수동 미러링
  근거: enum 추가가 드물고(연 수회), 자동 생성 도구 의존성 추가 비용 > 이득.
        대신 schema.ts 헤더 주석에 "schema-enum.json 동기화 필수" 명시.
```

`schema-enum.json`:
```json
{
  "version": 1,
  "topics": ["ghs", "sds-label", "chemical-inventory", "..."],
  "hazards": ["flammable", "pyrophoric", "..."]
}
```

### 3.3 Entity Relationships

```
┌─────────────────────────────────────────────────────┐
│ Source registry (확장 가능)                          │
│   epi-semi-hazards (book)                           │
│   osha-scs (training-program)                       │
│   semi-s2 (standard)     ← future                   │
│   kosha-guide (guide)    ← future                   │
└─────────────────────────────────────────────────────┘
                ↓ 각 source는 sections[]
┌─────────────────────────────────────────────────────┐
│ SourceSection (chapters | parts | modules)          │
└─────────────────────────────────────────────────────┘
                ↓ section마다 _links.json에 태그
        ┌──────────┼──────────┐
        ↓          ↓          ↓
   Topic enum  Hazard enum  ChemicalId
   (≤22 통제) (≤12 통제)  (chemicals.json 30+)
                ↓
┌─────────────────────────────────────────────────────┐
│ Build-time inverse indexes                          │
│   byTopic, byHazard, byChemical → SectionRef[]      │
└─────────────────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────────────┐
│ Runtime lookup (source-count-agnostic)              │
│   lookupRelated, lookupByChemical                   │
└─────────────────────────────────────────────────────┘
```

### 3.4 태그 매트릭스 예시 (초기 셋)

`src/data/_book-links.json` (책 17 챕터):

```json
{
  "01-risks-of-new-tech": {
    "topics": ["industrial-hygiene"]
  },
  "02-semiconductor": {
    "topics": ["wafer-fab"]
  },
  "03-process-overview": {
    "topics": ["wafer-fab"]
  },
  "04-cleanroom": {
    "topics": ["cleanroom", "engineering-controls"]
  },
  "05-wafer": {
    "topics": ["wafer-fab"],
    "chemicals": ["isopropyl-alcohol"]
  },
  "06-cleaning": {
    "topics": ["liquid-chemicals"],
    "hazards": ["corrosive"],
    "chemicals": ["hydrofluoric-acid", "isopropyl-alcohol", "hydrogen-peroxide"]
  },
  "07-diffusion": {
    "topics": ["diffusion", "gas-safety"],
    "hazards": ["pyrophoric", "toxic", "acute-toxic"],
    "chemicals": ["arsine", "phosphine", "diborane"]
  },
  "08-photolithography": {
    "topics": ["photolithography", "liquid-chemicals"],
    "hazards": ["flammable"],
    "chemicals": ["pgmea"]
  },
  "09-etching": {
    "topics": ["etching", "gas-safety", "liquid-chemicals"],
    "hazards": ["corrosive", "toxic"],
    "chemicals": ["hydrofluoric-acid"]
  },
  "10-deposition": {
    "topics": ["deposition", "gas-safety"],
    "hazards": ["pyrophoric"]
  },
  "11-ion-implantation": {
    "topics": ["ion-implantation", "gas-safety"],
    "hazards": ["toxic", "acute-toxic"],
    "chemicals": ["arsine", "phosphine"]
  },
  "12-cmp": {
    "topics": ["cmp"]
  },
  "13-packaging": {
    "topics": ["packaging"]
  },
  "14-chemicals-usage": {
    "topics": ["chemical-inventory", "liquid-chemicals", "storage-compatibility"],
    "hazards": ["corrosive", "flammable", "toxic"],
    "chemicals": ["hydrofluoric-acid", "isopropyl-alcohol", "hydrogen-peroxide", "pgmea"]
  },
  "15-electromagnetic": {
    "topics": ["industrial-hygiene", "exposure-monitoring"]
  },
  "16-occupational-disease": {
    "topics": ["occupational-disease", "exposure-monitoring"],
    "hazards": ["carcinogen", "reproductive-toxin"],
    "chemicals": ["benzene"]
  },
  "17-industrial-health-view": {
    "topics": ["industrial-hygiene", "occupational-disease"]
  }
}
```

`src/content/sources/osha-scs/_links.json`:

```json
{
  "part-1a": {
    "topics": ["ghs", "sds-label"]
  },
  "part-1b": {
    "topics": ["chemical-inventory", "emergency-response", "ppe"],
    "hazards": ["corrosive", "toxic"]
  },
  "part-2": {
    "topics": ["liquid-chemicals", "gas-safety", "storage-compatibility", "ppe"],
    "hazards": ["flammable", "corrosive", "toxic", "oxidizer"],
    "chemicals": ["hydrofluoric-acid", "isopropyl-alcohol"]
  },
  "part-3": {
    "topics": ["gas-safety", "liquid-chemicals", "emergency-response"],
    "hazards": ["pyrophoric", "toxic", "acute-toxic", "corrosive"],
    "chemicals": ["arsine", "phosphine", "diborane", "hydrofluoric-acid"]
  },
  "part-4": {
    "topics": ["gas-safety", "compressed-gas", "cryogenic", "emergency-response", "engineering-controls"],
    "hazards": ["compressed-gas", "cryogenic"]
  }
}
```

**예상 cross-link 매트릭스 (책↔OSHA 양방향)**:

| 책 챕터 | 공유 축 | OSHA Part 매핑 |
|---------|---------|----------------|
| Ch.7 diffusion | gas-safety, pyrophoric, arsine·phosphine·diborane | Part 3 |
| Ch.9 etching | gas-safety, corrosive, HF | Part 2, Part 3 |
| Ch.11 ion-implantation | gas-safety, toxic, arsine·phosphine | Part 3 |
| Ch.14 chemicals-usage | chemical-inventory, storage, flammable·corrosive, HF·IPA | Part 1B, Part 2 |
| Ch.6 cleaning | liquid-chemicals, corrosive, HF·H2O2 | Part 2 |
| Ch.10 deposition | gas-safety, pyrophoric | Part 3 |
| Ch.16 occupational-disease | (직접 매핑 약함) | — |

**Definition of Done의 "양방향 링크 ≥ 20쌍" 충족 추정**: 6+ 챕터 × 2~3 OSHA Part 평균 = ~15~20쌍 책 ↔ OSHA + 화학물질 hub 7~10건 → 합계 25+쌍 (목표 초과)

---

## 4. API Specification

### 4.1 Build script CLI

```
node scripts/build-cross-link-index.mjs

Input (자동 발견):
  - src/data/sources.json
  - src/data/chemicals.json
  - src/data/schema-enum.json
  - src/data/_book-links.json
  - src/content/sources/*/_links.json  (glob)

Output:
  - src/data/cross-link.json
  - stderr: 통계 + 경고
      [build-cross-link] discovered 2 sources, scanned 22 sections
      [build-cross-link] tagged: topics 47, hazards 21, chemicals 15
      [build-cross-link] bidirectional links: 23 (book↔osha)
      [build-cross-link] unknown chemicals (warning, kept as stub): 0

Exit codes:
  0 — success (warnings 있어도)
  1 — error (enum 위반, section ID 중복, JSON 파싱 실패)
```

### 4.2 Runtime API (lookup.ts)

```typescript
// src/lib/cross-link/lookup.ts

/**
 * 특정 section과 cross-link된 다른 자료원의 항목 조회.
 *
 * @returns 자료원별 그룹 (source.order 정렬, 같은 source 자기 참조 제외)
 *          각 그룹의 items는 shareScore desc → section.order asc 정렬
 *          최대 항목 수: 그룹당 6 (Plan §6.2 가독성)
 */
export function lookupRelated(
  sourceId: string,
  sectionId: string,
  options?: { maxPerGroup?: number },
): RelatedGroup[];

/**
 * 특정 chemical을 다루는 모든 자료원의 섹션 조회.
 * /chemicals/[id] 페이지의 ChemicalSourceHub용.
 */
export function lookupByChemical(
  chemicalId: ChemicalId,
  options?: { maxPerGroup?: number },
): RelatedGroup[];

/** Schema version 노출 (디버그·툴링) */
export function getCrossLinkSchemaVersion(): number;

/** 미등록 chemical 목록 (개발 도구용) */
export function getUnknownChemicals(): ChemicalId[];
```

### 4.3 Onboarding workflow (확장성 핵심 명문화)

**향후 신규 자료원 N 추가 시 5단계**:

| Step | 작업 | 코드 변경 |
|:---:|------|-----------|
| 1 | `src/data/sources.json`에 N 메타 추가 (id, kind, language, sections[]) | data only |
| 2 | `src/lib/sources.ts`에 `N_SOURCE: Source` 1 entry + `SOURCES.push(N_SOURCE)` | 1 entry |
| 3 | (필요 시) `src/content/sources/{N-id}/*.mdx` 본문 + `[part]/page.tsx` 신규 라우트 | 콘텐츠/라우트 |
| 4 | `src/content/sources/{N-id}/_links.json` 작성 | data only |
| 5 | `npm run build` → 자동으로 `cross-link.json`에 편입, 모든 페이지 자동 노출 | **0건** |

코어 시스템(`build-cross-link-index.mjs`, `lookup.ts`, `RelatedFromOtherSources`)은 **한 줄도 수정 불필요**.

---

## 5. UI/UX Design

### 5.1 Mockup — 책 챕터 페이지 하단

```
... (기존 본문) ...
─────────────────────────────────────────────────────
🔗 같은 주제를 다른 자료에서도 보기
─────────────────────────────────────────────────────

🏛 OSHA Semiconductor Chemical Safety [EN]
   ┌─────────────────────────────────────────────┐
   │ Part 3 · Extremely Hazardous Chemicals       │
   │ [arsine] [phosphine] [diborane] [gas-safety] │
   │ • 24분 · Special Focus: Silane 등 9 카테고리 │
   └─────────────────────────────────────────────┘
   ┌─────────────────────────────────────────────┐
   │ Part 2 · Chemical Hazards, Controls          │
   │ [gas-safety]                                 │
   └─────────────────────────────────────────────┘

📚 추후 자료원이 추가되면 여기 자동으로 노출됩니다.
```

자료원 그룹이 0개이면 패널 자체를 숨김 (null 반환).

### 5.2 Mockup — 화학물질 페이지 (silane 예)

```
... (기존 silane 정보) ...
─────────────────────────────────────────────────────
🧪 이 물질을 다루는 자료
─────────────────────────────────────────────────────

🏛 OSHA Semiconductor Chemical Safety [EN]
   • Part 3 · Extremely Hazardous Chemicals  → Silane Special Focus
   • Part 4 · Hazardous Gas Systems          → Gas Control System

📖 반도체 산업의 유해인자 [KO]
   (silane이 책에 직접 등장하면 표시, 현재는 예상 0건이지만
    Ch.7 확산이 토픽·해저드 공유로 RelatedFromOtherSources에서 노출됨)
```

### 5.3 Component Tree

```
<ChapterPage>
  <ChapterHeader />
  <MdxBody />
  <ChapterFooterNav />
  <RelatedFromOtherSources             ← NEW
     sourceId="epi-semi-hazards"
     sectionId={chapter.id} />

<OshaPartPage>
  ...
  <RelatedFromOtherSources             ← NEW
     sourceId="osha-scs"
     sectionId={part.id} />

<ChemicalDetailPage>
  ...existing...
  <ChemicalSourceHub                   ← NEW
     chemicalId={chemical.id} />

<QuotesPage>
  ...
  <SourceFilter                        ← NEW (optional)
     sources={getOrderedSources()} />
```

### 5.4 Component Interface

```typescript
// RelatedFromOtherSources.tsx
interface RelatedFromOtherSourcesProps {
  sourceId: string;
  sectionId: string;
  /** 헤딩 텍스트 오버라이드 (기본: "같은 주제를 다른 자료에서도 보기") */
  heading?: string;
  /** 그룹당 최대 항목 수 (기본 6) */
  maxPerGroup?: number;
  /** 표시 항목 0건 시 렌더 여부 (기본 false → null 반환) */
  renderIfEmpty?: boolean;
}

// ChemicalSourceHub.tsx
interface ChemicalSourceHubProps {
  chemicalId: string;
  heading?: string;
}

// RelatedItemCard.tsx (RelatedFromOtherSources의 자식)
interface RelatedItemCardProps {
  item: RelatedItem;
  /** 자료원 accent 토큰 (book/osha/standard) — 색상 결정 */
  accent?: Source['accent'];
}

// SourceFilter.tsx (optional)
interface SourceFilterProps {
  sources: Source[];
  selected: string | 'all';
  onChange: (id: string | 'all') => void;
}
```

### 5.5 Source-agnostic 색상 매핑

```typescript
// RelatedItemCard 내부 (확장성 핵심)
const ACCENT_CARD: Record<NonNullable<Source['accent']>, string> = {
  book: 'border-brand-200 dark:border-brand-900',
  osha: 'border-emerald-200 dark:border-emerald-900',
  standard: 'border-slate-200 dark:border-slate-700',
};

// 신규 자료원이 'standard' accent로 추가되면 자동으로 회색 카드
// 'book'/'osha' 외의 자료원도 fallback으로 회색 처리됨
// 추후 색상 토큰 추가 시 ACCENT_CARD에만 1 entry 추가
```

---

## 6. Error Handling

| 상황 | 처리 |
|------|------|
| 빌드: 알 수 없는 Topic enum | exit 1, 메시지 + 사용 가능 어휘 출력 |
| 빌드: 알 수 없는 Hazard enum | exit 1, 동일 |
| 빌드: 알 수 없는 chemicalId | **경고만, 빌드 계속** + `unknownChemicals[]`에 기록 (graceful degradation) |
| 빌드: `_links.json` JSON 파싱 실패 | exit 1, 파일명·라인 표시 |
| 빌드: sectionId가 sources.json에 없음 | 경고 (typo 가능), 빌드 계속 |
| 런타임: `lookupRelated`에 없는 sourceId | 빈 배열 반환 (no throw) |
| 런타임: cross-link.json 없음 (빌드 누락) | Next build가 import 실패로 종결 |
| UI: 패널 항목 0건 | 컴포넌트 `null` 반환 (조용히 숨김) |
| UI: 미등록 chemical을 패널에 표시 | chip을 회색 + "신규" 라벨, 링크 없음 |

빌드 오류 메시지 포맷 예시:

```
[build-cross-link] ERROR: unknown topic "etching-safety" in osha-scs/part-2

  Did you mean one of these?
    - etching         (process safety)
    - gas-safety      (hazard theme)
    - storage-compatibility

  Available topics (21):
    ghs, sds-label, chemical-inventory, cleanroom, wafer-fab,
    photolithography, etching, diffusion, deposition, ...

  → Add to TOPICS in src/lib/cross-link/schema.ts + schema-enum.json,
    or use one of the existing values.

exit code: 1
```

---

## 7. Security Considerations

본 cycle도 정적 사이트 범위 내. 추가 분석:

- [x] **XSS**: 모든 cross-link 데이터는 빌드 타임 generated. 사용자 입력 없음
- [x] **외부 링크**: OSHA URL은 기존 cycle에서 `rel="noopener noreferrer"` 적용
- [x] **데이터 누출**: `_links.json`은 공개 메타데이터만 (저작권 콘텐츠 미포함)
- [x] **DoS**: 빌드 인덱스 ≤ 50KB로 한정 (NFR), runtime fetch 0회

---

## 8. Test Plan

### 8.1 Test Scope

| Type | Target | Tool |
|------|--------|------|
| Build verification | `npm run build` 통과 | Next.js |
| Build script self-test | enum 위반 / id 중복 → exit 1 | 수동 `_links.json` 변조 후 빌드 |
| Type safety | `npm run typecheck` 통과 | tsc |
| URL 회귀 | 기존 모든 라우트 + 신규 7 라우트 200 | 빌드 결과 spot check |
| 시각 회귀 | 챕터·OSHA Part·chemical 페이지 dark/light | 수동 로컬 빌드 |
| Schema 호환성 | `cross-link.json.version` 동기화 | 빌드 시 schema-enum 검증 |

### 8.2 Test Cases (Key)

- [ ] **Happy A**: `/chapter/diffusion-chapter/` 하단에 OSHA Part 3 카드 노출, `[arsine]` chip 표시
- [ ] **Happy B**: `/sources/osha-scs/part-3/` 하단에 책 Ch.7, Ch.11 카드 노출
- [ ] **Happy C**: `/chemicals/silane/`에 `ChemicalSourceHub`로 OSHA Part 3, Part 4 노출 (책에 silane 항목 없으면 OSHA만)
- [ ] **Happy D**: `/chemicals/hydrofluoric-acid/`에 책 Ch.6, Ch.9, Ch.14 + OSHA Part 2, Part 3 노출
- [ ] **Edge A**: Ch.13 packaging (예상 0~1 cross-link) — 0건이면 패널 숨김
- [ ] **Edge B**: 미등록 chemical을 `_links.json`에 추가 → 빌드 경고, UI 회색 chip + 링크 없음
- [ ] **Error A**: 잘못된 topic enum → 빌드 실패, 사용 가능 어휘 출력 확인
- [ ] **Regression A**: 17 챕터 + 30 chemical + 9 process + 7 source 라우트 모두 200
- [ ] **Extensibility test**: dummy 자료원 `src/content/sources/test-source/_links.json` 추가 → cross-link.json에 자동 편입 확인 (수동, optional)

### 8.3 Acceptance Criteria 양방향 링크 ≥ 20쌍

빌드 후 stderr에서 보고되는 `bidirectional links: N` 값으로 측정. N < 20이면 태그 추가 후 재빌드.

---

## 9. Clean Architecture

### 9.1 Layer Structure

| Layer | Responsibility | Location |
|-------|---------------|----------|
| **Presentation** | UI 컴포넌트, 페이지 통합 | `src/components/cross-link/`, `src/app/{chapter,sources/osha-scs,chemicals,quotes}` |
| **Application** | lookup 로직, 정렬·필터, 검색 필터 | `src/lib/cross-link/lookup.ts`, `src/lib/search.ts` extension |
| **Domain** | Topic/Hazard enum, 인덱스 타입, RelatedItem 모델 | `src/lib/cross-link/schema.ts` |
| **Infrastructure** | 빌드 스크립트, JSON 산출물, schema-enum 미러 | `scripts/build-cross-link-index.mjs`, `src/data/{cross-link,schema-enum,_book-links}.json` |

### 9.2 Dependency Rules

```
Presentation (components, pages)
    ↓
Application (lookup.ts)
    ↓
Domain (schema.ts pure types/enums)
    ↑
Infrastructure (scripts/build-*, data/*.json)
```

### 9.3 File Import Rules

| From | Can Import | Cannot Import |
|------|-----------|---------------|
| Components | `lib/cross-link/lookup`, `lib/sources`, `lib/types` | `scripts/*`, raw `cross-link.json` |
| `lookup.ts` | `cross-link/schema`, `data/cross-link.json`, `lib/sources` | components, app pages |
| `schema.ts` | (없음, pure) | 모두 |
| `build-cross-link-index.mjs` | (Node ESM) `data/*.json`, `data/schema-enum.json` | TS, components, lib (TS 직접 import 불가) |

### 9.4 This Feature's Layer Assignment

| Component | Layer | Location |
|-----------|-------|----------|
| `RelatedFromOtherSources`, `ChemicalSourceHub`, `RelatedItemCard`, `SourceFilter` | Presentation | `src/components/cross-link/` |
| `lookupRelated`, `lookupByChemical`, `getCrossLinkSchemaVersion` | Application | `src/lib/cross-link/lookup.ts` |
| `Topic`, `Hazard`, `SectionLinks`, `CrossLinkIndex`, `RelatedGroup`, `RelatedItem` | Domain | `src/lib/cross-link/schema.ts` |
| `build-cross-link-index.mjs` | Infrastructure | `scripts/` |
| `cross-link.json`, `schema-enum.json`, `_book-links.json`, `osha-scs/_links.json` | Infrastructure | `src/data/`, `src/content/sources/*/` |

---

## 10. Coding Convention Reference

### 10.1 Naming (기존 cycle 상속 + 본 cycle 추가)

| Target | Rule | Example |
|--------|------|---------|
| Topic enum | kebab-case, 1~3 단어 | `gas-safety`, `engineering-controls` |
| Hazard enum | kebab-case 단어 | `pyrophoric`, `compressed-gas` |
| `_links.json` 파일 위치 | `src/content/sources/{sourceId}/_links.json` (콘텐츠 자료원) 또는 `src/data/_book-links.json` (책 예외) | — |
| 컴포넌트 | PascalCase.tsx | `RelatedFromOtherSources.tsx` |
| Lib 폴더 | `lib/cross-link/` 하위 모듈로 응집 | — |
| Build artifact | kebab-case JSON | `cross-link.json`, `schema-enum.json` |

### 10.2 Import Order — 기존 룰 유지

### 10.3 ENV — 신규 0개

### 10.4 본 cycle 컨벤션

| Item | 규칙 |
|------|------|
| 어휘 확장 | `schema.ts` + `schema-enum.json` **둘 다** 수정 (헤더 주석으로 알림) |
| 같은 source 자기 참조 | lookup에서 자동 제외 |
| 패널 항목 수 | 자료원 그룹당 최대 6개 (props로 override 가능) |
| 정렬 | shareScore desc → source.order asc → section.order asc |
| 데이터 위치 | book만 `src/data/_book-links.json`, 그 외 자료원은 `src/content/sources/{id}/_links.json` |

---

## 11. Implementation Guide

### 11.1 File Structure (신규/수정만)

```
semiconductor-academy/
├── scripts/
│   └── build-cross-link-index.mjs            ← NEW
├── src/
│   ├── lib/
│   │   └── cross-link/                       ← NEW
│   │       ├── schema.ts                     ← Topic/Hazard enum + types
│   │       └── lookup.ts                     ← 런타임 API
│   ├── components/
│   │   └── cross-link/                       ← NEW
│   │       ├── RelatedFromOtherSources.tsx
│   │       ├── ChemicalSourceHub.tsx
│   │       ├── RelatedItemCard.tsx
│   │       └── SourceFilter.tsx              (optional)
│   ├── content/sources/osha-scs/
│   │   └── _links.json                       ← NEW
│   ├── data/
│   │   ├── schema-enum.json                  ← NEW (schema.ts 미러)
│   │   ├── _book-links.json                  ← NEW
│   │   └── cross-link.json                   ← NEW (빌드 산출물)
│   └── app/
│       ├── chapter/[slug]/page.tsx           ← EXTEND (패널 삽입)
│       ├── sources/osha-scs/[part]/page.tsx  ← EXTEND
│       ├── chemicals/[id]/page.tsx           ← EXTEND
│       └── quotes/page.tsx                   ← EXTEND (optional, source 필터)
└── package.json                              ← EXTEND (prebuild)
```

### 11.2 Implementation Order

추정 시간 합계: **약 2.5~3시간**

| 단계 | 작업 | 예상 |
|:---:|------|:---:|
| 1 | `lib/cross-link/schema.ts` (Topic/Hazard enum, 모든 타입) | 15m |
| 2 | `src/data/schema-enum.json` 미러 | 5m |
| 3 | `src/data/_book-links.json` 책 17 챕터 태그 매트릭스 작성 (Design §3.4 셋 적용) | 25m |
| 4 | `src/content/sources/osha-scs/_links.json` OSHA 5 Part 태그 | 10m |
| 5 | `scripts/build-cross-link-index.mjs` 빌드 스크립트 (glob 자동 발견, 양방향 인덱스, enum 검증) | 35m |
| 6 | `package.json` `prebuild`/`predev`에 `build:cross-link` 추가 — `extract-quotes` 다음 단계 | 5m |
| 7 | 1차 빌드 실행, `cross-link.json` 생성 + bidirectional links ≥ 20 확인 | 5m |
| 8 | `lib/cross-link/lookup.ts` (`lookupRelated`, `lookupByChemical`) | 20m |
| 9 | `components/cross-link/RelatedItemCard.tsx` (단일 카드, accent 토큰) | 15m |
| 10 | `components/cross-link/RelatedFromOtherSources.tsx` (자료원별 그룹) | 25m |
| 11 | `app/chapter/[slug]/page.tsx` 패널 삽입 | 5m |
| 12 | `app/sources/osha-scs/[part]/page.tsx` 패널 삽입 | 5m |
| 13 | `components/cross-link/ChemicalSourceHub.tsx` + `chemicals/[id]/page.tsx` 통합 | 20m |
| 14 | 빌드 + typecheck + 시각 확인 (silane, HF, Ch.7, OSHA Part 3) | 15m |
| 15 | (optional) `/quotes` source 필터 | 15m |
| 16 | gap-detector 준비 | — |

### 11.3 Extensibility Validation 단계

본 cycle 종료 전 다음 dummy test로 확장성 검증 (선택, ~10m):

```
1. src/content/sources/test-source/_links.json 생성 (1 section, gas-safety topic 1개)
2. src/data/sources.json에 test-source 더미 등록 (sections: [{id: 'sec-1', ...}])
3. npm run build → cross-link.json에 test-source가 편입되었는가 확인
4. 책 챕터 페이지가 test-source/sec-1 노출하는가 확인
5. test-source 제거 → 다시 빌드 → 깨끗히 제거되는가 확인
```

이 단계가 통과하면 향후 SEMI·KOSHA 등 추가 시 **코어 코드 무수정 onboarding** 보장.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-30 | 초안: 확장성 5원칙, manifest-driven 자료원 발견, schema-enum.json 미러, 5단계 onboarding 워크플로 명문화 | DrunkenZealnut |
