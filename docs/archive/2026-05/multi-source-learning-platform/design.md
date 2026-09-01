---
template: design
version: 1.2
description: PDCA Design — 다중 자료원 학습 플랫폼 (Source 모델 + OSHA 통합 + Cross-link 시스템)
variables:
  feature: multi-source-learning-platform
  date: 2026-05-30
  author: DrunkenZealnut
  project: semiconductor-academy
  version: 0.1.0
---

# multi-source-learning-platform Design Document

> **Summary**: `Source` 1급 객체 도입 → OSHA SCS Part 1a/1b/2/3/4 통합 → `topic`/`hazard`/`chemical` 3축 cross-link 시스템 구축. 정적 사이트(Next.js export, GitHub Pages) 제약 안에서 빌드 타임 인덱스 + 통제 어휘 enum + URL 100% 하위호환을 핵심 원칙으로 한다.
>
> **Project**: semiconductor-academy
> **Version**: 0.1.0
> **Author**: DrunkenZealnut
> **Date**: 2026-05-30
> **Status**: Draft
> **Planning Doc**: [multi-source-learning-platform.plan.md](./plan.md)

### Pipeline References

| Phase | Document | Status |
|-------|----------|--------|
| Phase 1 | Schema Definition | N/A (정적 사이트, DB 없음) |
| Phase 2 | Coding Conventions | Plan §7 통합 |
| Phase 3 | Mockup | 본 문서 §5 통합 |
| Phase 4 | API Spec | N/A (백엔드 없음) |

---

## 1. Overview

### 1.1 Design Goals

1. **확장 가능한 자료원 모델** — 책 1권 + OSHA 5 Part로 검증하되, 향후 KOSHA·SEMI·논문 등을 동일 인터페이스로 붙일 수 있어야 한다
2. **빌드 타임 cross-link 인덱스** — 정적 사이트(GitHub Pages)에서 런타임 fetch 0회, 모든 양방향 링크는 빌드 시 사전 계산
3. **URL 100% 하위호환** — 17 챕터 기존 경로(`/chapter/[slug]-chapter/`, `/risks-of-new-tech/` 등) 완전 유지
4. **언어 인식 UX** — 한국어(책) vs 영어(OSHA) 자료를 카드·검색·cross-link 패널에서 명시
5. **통제 어휘** — `topic`/`hazard`/`chemical` 태그를 사전 정의 enum으로 제한해 정합성 확보
6. **기존 디자인 시스템 재사용** — 신규 디자인 토큰 0, 기존 카드/SourceQuote/CalloutTone 패턴 그대로 활용

### 1.2 Design Principles

- **데이터 우선** — 데이터 모델을 먼저 확정한 뒤 UI를 붙인다 (`Source` → `SourceSection` → cross-link)
- **빌드 타임 우선** — 런타임 JS 부담 최소화. `scripts/build-cross-link-index.mjs`로 사전 계산
- **하위호환 우선** — 새 라우트는 추가만, 기존 라우트는 변경 없음
- **YAGNI** — 사용자 계정·진도 추적·LLM 요약 등 Plan §2.2의 out-of-scope 엄격 적용
- **점진적 노출** — Phase A 완료 시점에도 사이트가 사용자에게는 동일하게 보임(메인 카드만 추가). 큰 변화는 Phase C 완료 시 한꺼번에

---

## 2. Architecture

### 2.1 Component Diagram (정적 사이트)

```
┌──────────────────────────────────────────────────────────────┐
│  Build Time                                                  │
│  ┌──────────────┐  ┌──────────────────────────────────────┐  │
│  │ Source MDX   │→ │ scripts/build-cross-link-index.mjs   │  │
│  │ (chapters,   │  │   - load _credits.json + _links.json │  │
│  │  osha-scs)   │  │   - resolve topic/hazard/chemical    │  │
│  └──────────────┘  │   - emit src/data/cross-link.json    │  │
│                    └──────────────────────────────────────┘  │
│         ↓                       ↓                            │
│  ┌──────────────┐       ┌──────────────────┐                 │
│  │ next build   │ ←──── │ cross-link.json  │                 │
│  └──────────────┘       └──────────────────┘                 │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  Runtime (Browser, static)                                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Pages                                                   │ │
│  │  /                          ← SourcePicker (신규)        │ │
│  │  /sources/[source]          ← Source Index (신규)        │ │
│  │  /sources/osha-scs/[part]   ← OSHA Part Page (신규)      │ │
│  │  /chapter/[slug]-chapter/   ← 기존 + 하단 패널 추가      │ │
│  │  /chemicals/[id]/           ← 기존 + 자료원별 링크 허브  │ │
│  │  /quotes                    ← 기존 + source 필터 추가    │ │
│  └─────────────────────────────────────────────────────────┘ │
│                              ↓                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Shared Components                                       │ │
│  │  <SourcePicker />            <RelatedFromOtherSources/> │ │
│  │  <SourceBadge lang="KO"/>    <CrossLinkPanel />         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                              ↓                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ lib/                                                    │ │
│  │  sources.ts    cross-link/{schema,lookup}.ts            │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
[작성 시점]
  Author writes _links.json next to MDX
  e.g. src/content/sources/osha-scs/_links.json:
    { "part-3": { "topics": ["toxic-gas","silane-safety"],
                  "hazards": ["pyrophoric","acute-toxic"],
                  "chemicals": ["silane","arsine","phosphine","diborane"] } }

[빌드 시점]
  npm run extract:quotes      (기존)
    ↓
  npm run build:cross-link    (신규, prebuild에 추가)
    ↓ reads sources registry + all _links.json
    ↓ resolves bidirectional index
    ↓ writes src/data/cross-link.json
  npm run build               (Next.js)

[런타임]
  Page renders → import cross-link.json (정적 chunk)
              → lookupRelated(sourceId, sectionId)
              → returns { byTopic[], byHazard[], byChemical[] }
              → <RelatedFromOtherSources items={...} />
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| `lib/sources.ts` | `lib/types.ts` (확장), JSON 레지스트리 | 자료원 단일 진실 |
| `scripts/build-cross-link-index.mjs` | `src/data/{chapters,chemicals}.json` + `_links.json` 파일들 | 양방향 인덱스 사전 계산 |
| `lib/cross-link/lookup.ts` | `src/data/cross-link.json` | 페이지 런타임 조회 |
| `<RelatedFromOtherSources/>` | `lib/cross-link/lookup.ts`, `lib/sources.ts` | UI 렌더 |
| `<SourcePicker/>` | `lib/sources.ts` | 메인 페이지 카드 |
| `OSHA Part MDX` | `src/components/mdx/*` (기존), 신규 `OshaCallouts` (선택) | 5 파트 콘텐츠 |
| 검색 (`searchQuotes`, 확장) | `lib/sources.ts` | source 필터 |

---

## 3. Data Model

### 3.1 Entity Definitions

#### 3.1.1 Source (자료원) — 신규

```typescript
// src/lib/types.ts (확장)

export type SourceKind = 'book' | 'training-program' | 'standard' | 'guide' | 'paper';
export type SourceLanguage = 'ko' | 'en';
export type SourceLicense =
  | 'fair-use'              // 학술서 인용 (기존 책)
  | 'us-gov-public-domain'  // OSHA 자료
  | 'cc-by'
  | 'cc-by-sa'
  | 'public-domain';

export interface SourceSection {
  /** kebab-case, 자료원 내부 고유 (e.g., "part-3", "ch-07-diffusion") */
  id: string;
  /** URL 경로 (기존 호환 또는 신규) */
  href: string;
  /** 표시 제목 (KO 또는 EN, 원본 언어 그대로) */
  title: string;
  /** 한 줄 요약 (한국어, 카드용) */
  summary?: string;
  /** 학습 시간(분) — chapter readingTime와 동일 의미 */
  readingTime?: number;
}

export interface Source {
  /** kebab-case 글로벌 고유 (e.g., "epi-semi-hazards", "osha-scs") */
  id: string;
  kind: SourceKind;
  language: SourceLanguage;
  /** 표시 제목 (자료원 자체) */
  title: string;
  /** 부제·한 줄 설명 */
  subtitle?: string;
  /** 저자/기관 */
  attribution: string;
  /** 발행처 */
  publisher?: string;
  /** 발행 연도 */
  year?: number;
  license: SourceLicense;
  /** 출처 URL (OSHA 공식 페이지 등) */
  url?: string;
  /** 메인 페이지·인덱스에서 보일 순서 (작을수록 먼저) */
  order: number;
  /** 자료원의 섹션 목록 (chapter / part / module) */
  sections: SourceSection[];
}
```

#### 3.1.2 Cross-link Schema — 신규

```typescript
// src/lib/cross-link/schema.ts

/** 통제 어휘: topic (사이트 전역 주제축). 사전 정의 enum. */
export type Topic =
  // foundation
  | 'ghs' | 'sds-label' | 'chemical-inventory'
  // process safety
  | 'cleanroom' | 'wafer-fab' | 'photolithography'
  | 'etching' | 'diffusion' | 'deposition'
  | 'ion-implantation' | 'cmp' | 'packaging'
  // hazard themes
  | 'gas-safety' | 'liquid-chemicals' | 'compressed-gas'
  | 'cryogenic' | 'storage-compatibility'
  // controls
  | 'engineering-controls' | 'ppe' | 'emergency-response'
  // health
  | 'occupational-disease' | 'exposure-monitoring' | 'industrial-hygiene';

/** 통제 어휘: hazard (위험 분류축) */
export type Hazard =
  | 'flammable' | 'pyrophoric' | 'oxidizer'
  | 'corrosive' | 'toxic' | 'acute-toxic'
  | 'carcinogen' | 'reproductive-toxin' | 'sensitizer'
  | 'compressed-gas' | 'cryogenic' | 'reactive';

/** chemical 축은 lib/types.ts의 Chemical['id']와 동일 ID 재사용 (예: "silane", "arsine") */
export type ChemicalId = string;

/** _links.json 작성 단위 — section 단위 태그 부여 */
export interface SectionLinks {
  topics?: Topic[];
  hazards?: Hazard[];
  chemicals?: ChemicalId[];
}

/** _links.json 파일 형식 (per Source) */
export interface SourceLinksFile {
  /** sectionId → tags */
  [sectionId: string]: SectionLinks;
}

/** 빌드 산출물 형식 (src/data/cross-link.json) */
export interface CrossLinkIndex {
  /** 정방향: source/section → 태그들 */
  bySection: Record<string, SectionLinks>;
  /** 역방향: topic → [{sourceId, sectionId}, ...] */
  byTopic: Record<Topic, SectionRef[]>;
  byHazard: Record<Hazard, SectionRef[]>;
  byChemical: Record<ChemicalId, SectionRef[]>;
}

export interface SectionRef {
  sourceId: string;
  sectionId: string;
}
```

#### 3.1.3 기존 데이터 모델과의 관계

```typescript
// 기존 Chapter (lib/types.ts) → Source 매핑
// chapters.json은 변경하지 않음. SourceSection으로 변환하는 어댑터만 추가:

// src/lib/sources.ts
import { chapters } from './chapters';
import { CHAPTER_CATEGORY_LABELS } from './types';
import type { Source, SourceSection } from './types';

function chapterToSection(c: Chapter): SourceSection {
  return {
    id: c.id,                                   // "01-risks-of-new-tech"
    href: c.legacyUrl ?? `/chapter/${c.slug}/`, // 호환 유지
    title: c.title,
    summary: c.subtitle,
    readingTime: c.readingTime,
  };
}

export const EPI_BOOK: Source = {
  id: 'epi-semi-hazards',
  kind: 'book',
  language: 'ko',
  title: '반도체 산업의 유해인자',
  attribution: '윤충식·김승원·박동욱·정지연·최상준·하권철·함승헌',
  publisher: '에피스테메',
  year: 2021,                       // 책 실제 발행연도로 확정 필요
  license: 'fair-use',
  order: 1,
  sections: chapters.map(chapterToSection),
};

export const OSHA_SCS: Source = {
  id: 'osha-scs',
  kind: 'training-program',
  language: 'en',
  title: 'Semiconductor Chemical Safety',
  subtitle: 'OSHA training program (Parts 1a–4)',
  attribution: 'U.S. OSHA (Occupational Safety and Health Administration)',
  publisher: 'United States Department of Labor',
  year: 2024,
  license: 'us-gov-public-domain',
  url: 'https://www.osha.gov/',     // 정확한 URL 확인 후 보정
  order: 2,
  sections: [
    { id: 'part-1a', href: '/sources/osha-scs/part-1a/', title: 'Part 1A · Introduction to GHS', readingTime: 22 },
    { id: 'part-1b', href: '/sources/osha-scs/part-1b/', title: 'Part 1B · Communication, Controls, Emergency', readingTime: 24 },
    { id: 'part-2',  href: '/sources/osha-scs/part-2/',  title: 'Part 2 · Chemical Hazards, Controls, Emergency', readingTime: 33 },
    { id: 'part-3',  href: '/sources/osha-scs/part-3/',  title: 'Part 3 · Extremely Hazardous Chemicals', readingTime: 24 },
    { id: 'part-4',  href: '/sources/osha-scs/part-4/',  title: 'Part 4 · Hazardous Gas Systems and Controls', readingTime: 26 },
  ],
};

export const SOURCES: Source[] = [EPI_BOOK, OSHA_SCS];
export function getSource(id: string): Source | undefined { return SOURCES.find((s) => s.id === id); }
```

### 3.2 Entity Relationships

```
                    ┌────────────────┐
                    │     Source     │ 1 (n=2: book, osha)
                    │   (registry)   │
                    └────────────────┘
                            │ 1
                            │
                            ▼ N
                    ┌────────────────┐
                    │  SourceSection │ (book: 17, osha: 5 = 22)
                    └────────────────┘
                            │
            ┌───────────────┼────────────────┐
            ▼               ▼                ▼
       Topic (≤22)    Hazard (≤12)    Chemical (31 existing)
            │               │                │
            └───────────────┴────────────────┘
                            │
                            ▼
                ┌────────────────────────┐
                │   CrossLinkIndex JSON  │ (build-time)
                │   bySection + byTag    │
                └────────────────────────┘
                            │
                            ▼
                ┌────────────────────────┐
                │    Runtime lookup      │
                │  lookupRelated(...)    │
                └────────────────────────┘
```

### 3.3 Cross-link 태그 부여 (초기 셋, 예시)

| Source | Section | Topics | Hazards | Chemicals |
|--------|---------|--------|---------|-----------|
| epi-book | 04-cleanroom | `cleanroom`, `engineering-controls` | — | — |
| epi-book | 07-diffusion | `diffusion`, `gas-safety` | `pyrophoric`, `toxic` | `arsine`, `phosphine`, `diborane` |
| epi-book | 14-chemicals-usage | `chemical-inventory`, `liquid-chemicals` | `corrosive`, `flammable` | `hydrofluoric-acid`, `isopropyl-alcohol` |
| epi-book | 16-occupational-disease | `occupational-disease`, `exposure-monitoring` | `carcinogen` | `benzene` |
| osha-scs | part-1a | `ghs`, `sds-label` | — | — |
| osha-scs | part-1b | `chemical-inventory`, `emergency-response`, `ppe` | — | — |
| osha-scs | part-2 | `liquid-chemicals`, `gas-safety`, `storage-compatibility` | `flammable`, `corrosive`, `toxic`, `oxidizer` | — |
| osha-scs | part-3 | `gas-safety` | `pyrophoric`, `toxic`, `acute-toxic` | `silane`, `arsine`, `phosphine`, `diborane`, `hydrofluoric-acid` |
| osha-scs | part-4 | `gas-safety`, `compressed-gas`, `cryogenic`, `emergency-response` | `compressed-gas`, `cryogenic` | — |

> 책 17 챕터 × OSHA 5 Part 매트릭스의 전체 태깅은 Do 단계에서 LLM 1차 라벨링 + 사람 검수. 본 표는 검증용 minimum set.

### 3.4 Database Schema

N/A — 정적 사이트, DB 없음. 모든 데이터는 JSON/MDX 파일.

---

## 4. API Specification

N/A — 백엔드 API 없음. 모든 라우트는 Next.js static export.

다만 **빌드 스크립트 인터페이스**를 API로 본다면:

### 4.1 build-cross-link-index.mjs 스펙

**입력:**
- `src/data/chapters.json` (기존)
- `src/data/chemicals.json` (기존)
- `src/lib/sources.ts` (신규, SOURCES 레지스트리)
- `src/content/sources/{sourceId}/_links.json` (신규, source당 1개)
- `src/data/_book-links.json` (신규, 기존 chapter들의 link 데이터)

**처리:**
1. SOURCES 레지스트리 로드, 각 source의 sections 수집
2. 각 source의 `_links.json` 또는 fallback (`_book-links.json`) 읽기
3. 통제 어휘 유효성 검사 (Topic/Hazard enum 위반 → 빌드 실패)
4. `bySection`, `byTopic`, `byHazard`, `byChemical` 4개 인덱스 빌드
5. ChemicalId가 `chemicals.json`에 존재하지 않으면 경고만(예: 신규 물질)

**출력:**
- `src/data/cross-link.json` (CrossLinkIndex 직렬화)
- stderr 통계: `22 sections / N tags / X warnings`

**실패 조건:**
- 알 수 없는 Topic/Hazard → 종료 코드 1
- SourceSection id 중복 → 종료 코드 1
- 빈 결과(모든 section 태그 없음) → 경고만, 종료 코드 0

---

## 5. UI/UX Design

### 5.1 Screen Layout — 메인 페이지 (Home)

```
┌──────────────────────────────────────────────────────┐
│  Header (변경 없음)                                   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  BookHero (기존, 살짝 축소)                          │
│                                                      │
├──────────────────────────────────────────────────────┤
│  ★ NEW: SourcePicker (자료원 카드 그리드)            │
│  ┌──────────────────┐  ┌──────────────────┐          │
│  │ 📖 책 [KO]       │  │ 🏛 OSHA [EN] NEW │          │
│  │ 반도체 산업의… │  │ Semiconductor… │          │
│  │ 17 챕터 · 윤충식… │  │ 5 모듈 · OSHA    │          │
│  └──────────────────┘  └──────────────────┘          │
├──────────────────────────────────────────────────────┤
│  BookTOCPreview (기존)                               │
├──────────────────────────────────────────────────────┤
│  SpecialSection · 공정 (기존)                        │
├──────────────────────────────────────────────────────┤
│  SpecialSection · 유해물질·직업병 (기존)             │
├──────────────────────────────────────────────────────┤
│  FooterLinks (기존)                                  │
└──────────────────────────────────────────────────────┘
```

### 5.2 Screen Layout — Source Index (`/sources/[source]`)

```
┌──────────────────────────────────────────────────────┐
│  Header                                              │
├──────────────────────────────────────────────────────┤
│  [breadcrumb] 홈 / 자료원 / OSHA SCS                 │
├──────────────────────────────────────────────────────┤
│  Source Header                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │ 🏛 Semiconductor Chemical Safety  [EN][공개]   │  │
│  │ OSHA · 미국 노동부                             │  │
│  │ 라이선스: U.S. Government Work (공개)          │  │
│  │ 원문: https://www.osha.gov/...                 │  │
│  └────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────┤
│  Sections (5 카드)                                   │
│  ┌───────────────────────────┐                       │
│  │ Part 1A · Introduction…   │                       │
│  │ 22 min · GHS 기초          │                       │
│  └───────────────────────────┘                       │
│  ... (Part 1B, 2, 3, 4)                              │
└──────────────────────────────────────────────────────┘
```

### 5.3 Screen Layout — OSHA Part Page (`/sources/osha-scs/[part]`)

```
┌──────────────────────────────────────────────────────┐
│  Header                                              │
├──────────────────────────────────────────────────────┤
│  [breadcrumb] 홈 / OSHA SCS / Part 3                 │
├──────────────────────────────────────────────────────┤
│  Title: Part 3 · Extremely Hazardous Chemicals  [EN] │
│  학습 시간: 24분 · OSHA training program             │
│  ─────────────────────────────────────────────────   │
│  Learning Objectives (callout)                       │
│  · Identify nine extremely hazardous categories      │
│  · Recall emergency response for each                │
│  ─────────────────────────────────────────────────   │
│  ## Course Overview                                  │
│  ## Nine Extremely Hazardous Chemical Categories     │
│  ## 1. Toxic Hydride Gases                           │
│  (transcript 본문, MDX)                              │
│  ## 5. Silane — Special Focus                        │
│  ...                                                 │
├──────────────────────────────────────────────────────┤
│  ★ RelatedFromOtherSources (NEW)                     │
│  ┌──────────────────────────────────────────────┐    │
│  │ 같은 주제를 다른 자료에서도 보기             │    │
│  │ 📖 책 Ch.7 확산 — `arsine` `phosphine` 공유   │    │
│  │ 📖 책 Ch.14 화학물질 사용 — `silane` 공유     │    │
│  │ 🧪 화학물질 silane — 통합 페이지             │    │
│  └──────────────────────────────────────────────┘    │
├──────────────────────────────────────────────────────┤
│  Prev/Next: Part 2 ← → Part 4                        │
├──────────────────────────────────────────────────────┤
│  Source attribution footer                           │
│  · U.S. OSHA · Public Domain                         │
│  · 본 페이지의 영어 본문은 원본 transcript          │
└──────────────────────────────────────────────────────┘
```

### 5.4 Screen Layout — 기존 페이지 추가분

**Chapter 페이지** (예: `/chapter/diffusion-chapter/`)

```
... (기존 본문) ...
─────────────────────────────────────────
★ RelatedFromOtherSources 컴포넌트 추가
"같은 주제를 다른 자료에서도 보기"
  🏛 OSHA Part 3 — silane, arsine, phosphine 공유
  🏛 OSHA Part 4 — 압축가스 시스템
─────────────────────────────────────────
(기존 푸터)
```

**Chemical 페이지** (`/chemicals/silane/`)

```
... (기존 화학물질 정보) ...
─────────────────────────────────────────
★ "이 물질을 다루는 자료" 섹션 (확장 또는 신규)
  📖 책 Ch.7 확산 — 도펀트 가스로서의 실란
  🏛 OSHA Part 3 §5 Silane — Special Focus
  🏛 OSHA Part 4 §6 Hazardous Gas Control System
─────────────────────────────────────────
```

### 5.5 User Flow

```
신규 사용자 (OSHA 관심):
  Home → SourcePicker → "OSHA 카드" 클릭
       → /sources/osha-scs (5 모듈 인덱스)
       → Part 3 클릭 → 본문 학습
       → 하단 "같은 주제 다른 자료" → 책 Ch.7 확산
       → 책 챕터 본문 (한국어로 같은 주제)

기존 사용자 (책 읽던 중):
  /chapter/diffusion-chapter (기존 흐름 그대로)
  → 본문 하단 "같은 주제 다른 자료" → OSHA Part 3
  → 영어 자료지만 같은 가스 다루는 부분 확인

화학물질 검색 사용자:
  Header 검색 → silane
  → /chemicals/silane → 책+OSHA 자료원 통합 허브
  → 양쪽 모두 진입 가능
```

### 5.6 Component List

| Component | Location | Responsibility | New/Reuse |
|-----------|----------|----------------|-----------|
| `SourcePicker` | `src/components/sources/SourcePicker.tsx` | 메인 페이지 자료원 카드 그리드 | NEW |
| `SourceBadge` | `src/components/sources/SourceBadge.tsx` | 언어·라이선스 인라인 뱃지 | NEW |
| `SourceHeader` | `src/components/sources/SourceHeader.tsx` | source index 페이지 상단 | NEW |
| `SourceSectionList` | `src/components/sources/SourceSectionList.tsx` | section 카드 그리드 | NEW |
| `RelatedFromOtherSources` | `src/components/cross-link/RelatedFromOtherSources.tsx` | 본문 하단 cross-link 패널 | NEW |
| `ChemicalSourceHub` | `src/components/cross-link/ChemicalSourceHub.tsx` | 화학물질 페이지의 source 통합 섹션 | NEW |
| `OshaCallouts` (선택) | `src/components/mdx/OshaCallouts.tsx` | OSHA "Learning Objectives" 등 OSHA 전용 callout | NEW (선택) |
| `BookHero`, `BookTOCPreview`, `SpecialSection` | 기존 | 변경 없음 | REUSE |
| `Callout`, `SourceQuote`, `ChapterCard` | 기존 | OSHA 페이지에서도 재사용 | REUSE |
| `Header` 검색 박스 | `src/components/layout/Header.tsx` | source 필터 옵션 추가 (Phase C) | EXTEND |

---

## 6. Error Handling

### 6.1 Error 시나리오

| 상황 | 대응 |
|------|------|
| 알 수 없는 `sourceId` 진입 (`/sources/foo`) | Next.js 404 페이지 (기존 `not-found.tsx`) |
| 알 수 없는 OSHA `part` (`/sources/osha-scs/part-99`) | Next.js 404 |
| 빌드 시 알 수 없는 Topic/Hazard enum 위반 | 빌드 스크립트 종료 코드 1, 에러 메시지로 위반 태그 표시 |
| 빌드 시 알 수 없는 ChemicalId | stderr 경고만, 빌드는 계속 (신규 물질 등록 전 단계 허용) |
| `RelatedFromOtherSources`에서 관련 항목 0건 | 컴포넌트가 `null` 반환 (조용히 숨김) |
| Cross-link JSON 누락 (build:cross-link 실패) | Next build가 import 실패로 종료 |

### 6.2 빌드 스크립트 메시지 포맷

```
[build-cross-link] reading 2 sources, 22 sections
[build-cross-link] warning: section "epi-book/12-cmp" has no links
[build-cross-link] error: unknown topic "etching-safety" in osha-scs/part-2
[build-cross-link] expected one of: ghs, sds-label, ... (22 topics)
exit code: 1
```

---

## 7. Security Considerations

정적 사이트 + 사용자 입력 없음 → OWASP Top 10 대부분 N/A.

- [x] **XSS 방지**: 모든 MDX는 빌드 타임 처리, runtime user input 없음
- [x] **저작권/라이선스**: 자료원별 license 필드 강제. UI에 명시 (PLAN §3.1.10 OSHA 공개)
- [x] **외부 링크 안전**: source.url → `target="_blank" rel="noopener noreferrer"`
- [x] **이미지 출처**: OSHA Part 콘텐츠는 1차에 transcript 텍스트만, figure는 별도 검토 후 추가
- [ ] **잠재적 라이선스 함정**: OSHA 자료 안에 인용된 SEMI 표준·공급사 자료 figure는 별도 라이선스 → 1차 통합에서 제외 (Plan Risk #4)

---

## 8. Test Plan

본 프로젝트는 정적 사이트 + 자동 테스트 미도입 정책 (현행).

### 8.1 Test Scope

| Type | Target | Tool |
|------|--------|------|
| Build verification | `npm run build` 무경고 | Next.js |
| Type safety | `npm run typecheck` 통과 | tsc |
| Cross-link 인덱스 정합성 | enum 위반 / id 중복 빌드 종료 | `build-cross-link-index.mjs` 자체 검증 |
| URL 하위호환 회귀 | 17 챕터 + 9 공정 + 31 화학물질 페이지 200 | 수동 spot check + 빌드 산출물 grep |
| 시각 회귀 | 메인·챕터·OSHA Part 페이지 | 수동 로컬 빌드 + 다크모드 확인 |

### 8.2 Test Cases (Key)

- [ ] **Happy path A**: `/sources/osha-scs/part-3` 200, 본문 모든 ## 섹션 렌더링, 하단 패널에 책 Ch.7·Ch.14 링크 표시
- [ ] **Happy path B**: `/chemicals/silane` → 책 Ch.7 + OSHA Part 3 + Part 4 모두 노출
- [ ] **Happy path C**: `/quotes` 검색에 source 필터(책/OSHA/전체) 작동
- [ ] **Regression A**: `/risks-of-new-tech/` 등 legacyUrl 17개 모두 200
- [ ] **Regression B**: `/chapter/diffusion-chapter/` 본문 변경 없음, 하단 패널만 추가
- [ ] **Error A**: `/sources/foo` → 404
- [ ] **Error B**: 잘못된 topic enum으로 `_links.json` 수정 후 빌드 → 에러로 실패
- [ ] **Edge A**: 태그 0개 section (예: 책 Ch.1) → `RelatedFromOtherSources` 숨김
- [ ] **A11y**: 메인 페이지 SourcePicker 카드 키보드 포커스 링 + dark mode 대비 ≥ AA
- [ ] **i18n 표기**: OSHA 카드/페이지에 `[EN]` 뱃지 표시, 책에 `[KO]` 표시

---

## 9. Clean Architecture

### 9.1 Layer Structure

| Layer | Responsibility | Location |
|-------|---------------|----------|
| **Presentation** | UI components, pages, MDX | `src/app/`, `src/components/`, `src/content/` |
| **Application** | Cross-link lookup, search 확장 | `src/lib/cross-link/lookup.ts`, `src/lib/search.ts` 확장 |
| **Domain** | Source/Section/Topic/Hazard 타입, 통제 어휘 enum | `src/lib/types.ts`, `src/lib/cross-link/schema.ts` |
| **Infrastructure** | 빌드 스크립트, 정적 JSON 산출물 | `scripts/build-cross-link-index.mjs`, `src/data/cross-link.json` |

### 9.2 Dependency Rules

```
Presentation (components, pages)
    ↓ (depends on)
Application (lib/cross-link/lookup, lib/sources)
    ↓
Domain (types, schema enums)
    ↑ (consumed by, no dependency)
Infrastructure (scripts/build-*, src/data/*.json)
```

### 9.3 File Import Rules

| From | Can Import | Cannot Import |
|------|-----------|---------------|
| `src/components/*` | `lib/*`, `lib/cross-link/*`, `lib/types` | `scripts/*` |
| `src/lib/cross-link/lookup.ts` | `lib/types`, `lib/cross-link/schema`, `data/cross-link.json` | `src/components/*`, `src/app/*` |
| `src/lib/cross-link/schema.ts` | (없음, pure enums) | 모두 |
| `scripts/build-cross-link-index.mjs` | (Node-only) `src/data/*.json`, `src/lib/sources.*` (JSON 형태 또는 별도 ESM 빌드) | `src/components/*`, `src/app/*` |

> **빌드 스크립트는 TS를 직접 import 불가** (Node ESM + .mjs). 해결: `lib/sources.ts`의 SOURCES 레지스트리는 **JSON 데이터를 import해서 만드는 구조**로 유지하거나, `lib/sources.config.json`을 별도로 두고 양쪽에서 read.

### 9.4 This Feature's Layer Assignment

| Component | Layer | Location |
|-----------|-------|----------|
| `SourcePicker`, `RelatedFromOtherSources`, `ChemicalSourceHub`, `SourceBadge`, `SourceHeader` | Presentation | `src/components/{sources,cross-link}/` |
| OSHA Part MDX files | Presentation | `src/content/sources/osha-scs/part-*.mdx` |
| `/sources/[source]/page.tsx`, `/sources/osha-scs/[part]/page.tsx` | Presentation | `src/app/sources/...` |
| `lookupRelated()`, `getSectionTags()` | Application | `src/lib/cross-link/lookup.ts` |
| Search 확장 (source 필터) | Application | `src/lib/search.ts` (또는 `src/app/quotes/QuoteIndex.tsx`) |
| `Source`, `SourceSection`, `Topic`, `Hazard`, `CrossLinkIndex` | Domain | `src/lib/types.ts`, `src/lib/cross-link/schema.ts` |
| `build-cross-link-index.mjs` | Infrastructure | `scripts/` |
| `src/data/cross-link.json` | Infrastructure | `src/data/` |
| `lib/sources.config.json` (빌드/런타임 공유) | Infrastructure | `src/data/sources.json` (제안) |

---

## 10. Coding Convention Reference

### 10.1 Naming Conventions (기존 + 확장)

| Target | Rule | Example |
|--------|------|---------|
| Source ID | kebab-case | `epi-semi-hazards`, `osha-scs` |
| Section ID | kebab-case | `part-1a`, `01-risks-of-new-tech` (책: 기존 chapter.id 재사용) |
| Topic enum | kebab-case 단어 | `gas-safety`, `engineering-controls` |
| Hazard enum | kebab-case 단어 | `pyrophoric`, `compressed-gas` |
| Chemical ID | 기존 `chemicals.json` ID 그대로 | `silane`, `hydrofluoric-acid` |
| Component file | PascalCase.tsx | `SourcePicker.tsx`, `RelatedFromOtherSources.tsx` |
| Lib file | camelCase.ts | `sources.ts`, `lookup.ts`, `schema.ts` |
| Build script | kebab-case.mjs | `build-cross-link-index.mjs` |

### 10.2 Import Order — 기존 룰 유지

### 10.3 Environment Variables

신규 ENV 0개 (정적 사이트).

### 10.4 This Feature's Conventions

| Item | Convention Applied |
|------|-------------------|
| Cross-link tag vocabulary | 통제 어휘만 (자유 태그 금지). 신규 추가는 `schema.ts` enum 확장 PR 필요 |
| OSHA 본문 MDX | 영어 원문 그대로. 자체 의역 금지 (저작권·정합성). Callout은 한국어 메타로 추가 가능 |
| 출처 표기 | 모든 source는 `attribution`, `license` 필수. 페이지 푸터에 라이선스 뱃지 |
| `_links.json` 위치 | `src/content/sources/{sourceId}/_links.json` 또는 책의 경우 `src/data/_book-links.json` |
| 컴포넌트 디자인 토큰 | 기존 카드(`rounded-2xl border bg-white ... dark:bg-slate-900`) 재사용. 신규 토큰 0 |

---

## 11. Implementation Guide

### 11.1 File Structure (변화분만)

```
semiconductor-academy/
├── data/
│   └── osha/                              # 기존 (입력 원본)
│       └── scs_part*_transcript.md
├── scripts/
│   ├── extract-quotes.mjs                 # 기존
│   └── build-cross-link-index.mjs         # NEW
├── src/
│   ├── app/
│   │   ├── page.tsx                       # EXTEND: SourcePicker 추가
│   │   ├── sources/                       # NEW
│   │   │   ├── [source]/
│   │   │   │   └── page.tsx               # NEW: source index
│   │   │   └── osha-scs/
│   │   │       └── [part]/
│   │   │           └── page.tsx           # NEW: OSHA Part 동적 라우트
│   │   ├── chapter/[slug]/page.tsx        # EXTEND: 본문 하단 패널
│   │   └── chemicals/[id]/page.tsx        # EXTEND: source 허브 섹션
│   ├── content/
│   │   └── sources/                       # NEW
│   │       └── osha-scs/
│   │           ├── _links.json            # NEW: OSHA Part 태그
│   │           ├── part-1a.mdx            # NEW
│   │           ├── part-1b.mdx            # NEW
│   │           ├── part-2.mdx             # NEW
│   │           ├── part-3.mdx             # NEW
│   │           └── part-4.mdx             # NEW
│   ├── components/
│   │   ├── sources/                       # NEW
│   │   │   ├── SourcePicker.tsx
│   │   │   ├── SourceBadge.tsx
│   │   │   ├── SourceHeader.tsx
│   │   │   └── SourceSectionList.tsx
│   │   └── cross-link/                    # NEW
│   │       ├── RelatedFromOtherSources.tsx
│   │       └── ChemicalSourceHub.tsx
│   ├── lib/
│   │   ├── types.ts                       # EXTEND: Source* 타입 추가
│   │   ├── sources.ts                     # NEW: 레지스트리
│   │   └── cross-link/                    # NEW
│   │       ├── schema.ts                  # Topic/Hazard enum, types
│   │       └── lookup.ts                  # 런타임 조회
│   └── data/
│       ├── sources.json                   # NEW: 빌드/런타임 공유 메타
│       ├── _book-links.json               # NEW: 책 17 챕터 태그
│       └── cross-link.json                # NEW (빌드 산출물, git ignore 선택)
├── package.json                           # EXTEND: prebuild에 build:cross-link 추가
└── docs/02-design/features/multi-source-learning-platform.design.md  # (본 문서)
```

### 11.2 Implementation Order

#### Phase A — IA 재편 (1–1.5h)

1. [ ] `lib/types.ts`에 `Source`, `SourceSection`, `SourceKind`, `SourceLanguage`, `SourceLicense` 타입 추가
2. [ ] `src/data/sources.json` 작성 (EPI_BOOK + OSHA_SCS 메타, sections는 ID/href만)
3. [ ] `lib/sources.ts` 작성 (chapters → sections 어댑터 포함)
4. [ ] `src/components/sources/{SourcePicker,SourceBadge,SourceHeader,SourceSectionList}.tsx` 신규
5. [ ] `src/app/sources/[source]/page.tsx` (generateStaticParams로 2개 source pre-render)
6. [ ] `src/app/page.tsx`에 `<SourcePicker />` 삽입 (BookHero 바로 아래)
7. [ ] 빌드 & 시각 확인 (OSHA Part 페이지는 아직 없으므로 404 정상)

#### Phase B — OSHA 통합 (2–2.5h)

8. [ ] `src/content/sources/osha-scs/part-{1a,1b,2,3,4}.mdx` 5개 작성
   - `data/osha/scs_part*_transcript.md` 본문 → MDX로 wrap
   - 상단에 `<Callout tone="info">Learning Objectives</Callout>` 추가
   - 영어 본문은 그대로, 한국어 메타·breadcrumb·라이선스만 추가
9. [ ] `src/app/sources/osha-scs/[part]/page.tsx` 동적 라우트 (5개 generateStaticParams)
10. [ ] Prev/Next 네비게이션 (part-1a ↔ part-1b ↔ part-2 ↔ part-3 ↔ part-4)
11. [ ] 빌드 & 5개 페이지 200 확인

#### Phase C — Cross-link 시스템 (2–3h)

12. [ ] `lib/cross-link/schema.ts` (Topic/Hazard enum, types)
13. [ ] `src/content/sources/osha-scs/_links.json` (OSHA 5 Part 태그)
14. [ ] `src/data/_book-links.json` (책 17 챕터 태그, 1차 LLM 보조 + 사람 검수)
15. [ ] `scripts/build-cross-link-index.mjs` 작성 + `package.json` `prebuild`/`predev`에 추가
16. [ ] `lib/cross-link/lookup.ts` (`lookupRelated(sourceId, sectionId): SectionRef[]`)
17. [ ] `src/components/cross-link/RelatedFromOtherSources.tsx`
18. [ ] OSHA Part 페이지 + Chapter 페이지 하단에 `<RelatedFromOtherSources />` 추가
19. [ ] `src/components/cross-link/ChemicalSourceHub.tsx` 작성, `/chemicals/[id]` 페이지에 통합
20. [ ] `/quotes` 검색에 source 필터 추가 (Phase C 마지막, 선택적)
21. [ ] 빌드 & 모든 cross-link 양방향 확인 (책 ↔ OSHA ↔ Chemical 트라이앵글 ≥ 20쌍)

#### 마무리

22. [ ] `npm run typecheck` 통과
23. [ ] `npm run build` 무경고
24. [ ] Plan §4.1 Definition of Done 체크리스트 확인
25. [ ] `/pdca analyze multi-source-learning-platform` (Gap analysis)

### 11.3 Sub-PDCA 분할 옵션

본 작업이 6–7h로 크기 때문에 Plan의 Phase A/B/C를 sub-PDCA로 쪼개도 됨:

| Sub-PDCA | 범위 | 예상 시간 | 권장 시점 |
|----------|------|----------|----------|
| `multi-source-ia-phase-a` | Phase A (IA 재편) | 1–1.5h | A 단독 ship 가능 |
| `osha-scs-integration` | Phase B (OSHA 5 MDX) | 2–2.5h | A 완료 후 |
| `cross-link-system` | Phase C (양방향 인덱스) | 2–3h | B 완료 후 |

> **권장**: Phase A는 사용자 가시 변화가 크지 않으므로 B와 통합. 다만 C는 작업량·리스크 모두 크므로 별 sub-PDCA로 분리하는 것이 안전.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-30 | 초안: Source 모델 + OSHA 5 Part 통합 + Cross-link 인덱스 시스템 설계 | DrunkenZealnut |
