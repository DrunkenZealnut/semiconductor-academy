# Design: semiconductor-academy-site

> 반도체 산업 유해인자 교육 웹사이트 — 컴포넌트·데이터모델·라우팅·MDX 스키마 상세 설계

**작성일**: 2026-05-27
**Feature**: `semiconductor-academy-site`
**PDCA Phase**: Design
**Linked Plan**: [docs/01-plan/features/semiconductor-academy-site.plan.md](../../01-plan/features/semiconductor-academy-site.plan.md)
**Status**: Updated (Act-1 amendment 2026-05-27)

> **Amendment 2026-05-27**: Tailwind v4의 `@theme` in CSS 패턴, App Router co-location MDX 패턴 등 구현 단계에서 채택한 정식 관행을 반영. 일부 sub-component(ProcessStep, ProcessTooltip, ChemicalFilter)는 부모 컴포넌트 내부에 인라인하는 것이 단순성·응집도 면에서 우수해 그렇게 채택. 자세한 변경 사항은 §16 Amendment Log 참조.

---

## 1. 아키텍처 개요

### 1.1 시스템 다이어그램

```
┌──────────────────────────────────────────────────────────┐
│                    Browser (정적 사이트)                  │
│   ┌────────────────────────────────────────────────────┐ │
│   │  Next.js 15 App Router (SSG / Static Export)       │ │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │ │
│   │  │  Pages   │  │   MDX    │  │ React Components │  │ │
│   │  │ (RSC)    │  │ Content  │  │ (Client Islands) │  │ │
│   │  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │ │
│   │       │             │                 │            │ │
│   │       └─────────────┼─────────────────┘            │ │
│   │                     ▼                              │ │
│   │           ┌──────────────────┐                     │ │
│   │           │  Static Data     │ ← content/*.mdx     │ │
│   │           │  (JSON + MDX)    │ ← data/*.json       │ │
│   │           └──────────────────┘                     │ │
│   └────────────────────────────────────────────────────┘ │
│                            ↑                             │
└────────────────────────────┼─────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │  Vercel CDN     │
                    │  (Static Hosting)│
                    └─────────────────┘
```

### 1.2 핵심 원칙

| 원칙 | 적용 |
|------|------|
| **Static First** | 모든 페이지는 빌드 타임 정적 생성 (SSG). 백엔드 없음. |
| **Server Components 우선** | 콘텐츠 페이지는 RSC. 인터랙티브 부분만 `'use client'` Island. |
| **콘텐츠와 코드 분리** | 챕터 본문은 MDX, 화학물질·공정 메타는 JSON, UI는 React. |
| **점진적 강화** | JS 없이도 본문 읽기 가능 → JS 로드 후 인터랙티브 활성화. |
| **접근성 우선** | 모든 인터랙티브 컴포넌트는 키보드 + 스크린 리더 지원. |

---

## 2. 폴더 구조

```
SemiconductorAcademy/
├── data/                                      # 원본 자료 (수정 금지)
│   └── 20260526_...반도체산업의유해인자_.../
├── docs/                                      # PDCA 문서
│   ├── 01-plan/features/
│   ├── 02-design/features/
│   ├── 03-analysis/
│   └── 04-report/
├── src/
│   ├── app/                                   # Next.js App Router
│   │   ├── layout.tsx                         # 루트 레이아웃 (헤더/푸터/사이드바)
│   │   ├── page.tsx                           # 홈 (인터랙티브 다이어그램)
│   │   ├── start/page.tsx
│   │   ├── what-is-semiconductor/page.mdx
│   │   ├── risks-of-new-tech/page.mdx
│   │   ├── cleanroom/page.mdx
│   │   ├── electromagnetic/page.mdx
│   │   ├── occupational-disease/page.mdx
│   │   ├── about/page.mdx
│   │   ├── process-overview/page.tsx
│   │   ├── process/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx                   # 공정 페이지 동적 라우팅
│   │   │       └── generateStaticParams.ts
│   │   └── chemicals/
│   │       ├── page.tsx                       # 사전 (검색 UI, Client Island)
│   │       └── [id]/page.tsx                  # 물질 상세
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx                    # 챕터 목차 (모바일 토글)
│   │   │   └── ThemeToggle.tsx                # 다크모드
│   │   ├── content/
│   │   │   ├── LayeredExplain.tsx             # 3단 레이어 (요약/비유/원본)
│   │   │   ├── Term.tsx                       # 인라인 용어 툴팁
│   │   │   ├── Callout.tsx                    # 경고/팁/사례 박스
│   │   │   ├── SourceQuote.tsx                # 원본 인용 토글
│   │   │   └── ChapterNav.tsx                 # 이전/다음 챕터
│   │   ├── process/
│   │   │   ├── ProcessDiagram.tsx             # ★ 핵심 인터랙티브 (8공정)
│   │   │   ├── ProcessStep.tsx                # 개별 공정 박스
│   │   │   ├── ProcessTooltip.tsx
│   │   │   └── ProcessDetailCard.tsx
│   │   ├── chemicals/
│   │   │   ├── ChemicalCard.tsx
│   │   │   ├── ChemicalSearch.tsx             # ★ Fuse.js 검색 (Client)
│   │   │   ├── ChemicalFilter.tsx             # 카테고리/공정 필터
│   │   │   └── HazardBadge.tsx                # 발암성 1군 등 배지
│   │   └── ui/                                # 기본 UI 프리미티브
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Disclosure.tsx                 # 접기/펼치기
│   │       ├── Dialog.tsx
│   │       └── Tag.tsx
│   ├── content/                               # MDX 챕터 본문
│   │   ├── chapters/
│   │   │   ├── what-is-semiconductor.mdx
│   │   │   ├── risks-of-new-tech.mdx
│   │   │   ├── cleanroom.mdx
│   │   │   ├── electromagnetic.mdx
│   │   │   └── occupational-disease.mdx
│   │   ├── processes/                         # 8공정 본문
│   │   │   ├── wafer.mdx
│   │   │   ├── cleaning.mdx
│   │   │   ├── diffusion.mdx
│   │   │   ├── photolithography.mdx
│   │   │   ├── etching.mdx
│   │   │   ├── deposition.mdx
│   │   │   ├── ion-implantation.mdx
│   │   │   ├── cmp.mdx
│   │   │   └── packaging.mdx
│   │   └── _shared/
│   │       └── analogies.mdx                  # 자주 쓰는 비유 모음
│   ├── data/                                  # 정적 데이터 (JSON)
│   │   ├── chemicals.json                     # 유해물질 사전
│   │   ├── processes.json                     # 공정 메타데이터
│   │   ├── terms.json                         # 용어 사전
│   │   └── sources.json                       # 원본 인용 매핑
│   ├── lib/
│   │   ├── content.ts                         # MDX 파일 로더
│   │   ├── search.ts                          # Fuse.js 설정
│   │   ├── types.ts                           # 공통 타입
│   │   └── seo.ts                             # OG 메타 헬퍼
│   ├── styles/
│   │   ├── globals.css                        # Tailwind + 커스텀 토큰
│   │   └── mdx.css                            # MDX 본문 스타일
│   └── illustrations/                         # SVG 일러스트
│       ├── conductor-insulator.svg
│       ├── faucet-analogy.svg
│       └── ...
├── public/
│   ├── images/
│   │   └── source/                            # 원본 페이지 이미지 (옵션)
│   ├── favicon.ico
│   └── robots.txt
├── scripts/
│   └── extract-chemicals.ts                   # 원본 markdown → chemicals.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 3. 데이터 모델

### 3.1 TypeScript 타입 (`src/lib/types.ts`)

```typescript
// 공정 ID — 9개 (웨이퍼 제조 포함)
export type ProcessId =
  | 'wafer'
  | 'cleaning'
  | 'diffusion'
  | 'photolithography'
  | 'etching'
  | 'deposition'
  | 'ion-implantation'
  | 'cmp'
  | 'packaging';

// 유해물질 분류
export type ChemicalCategory =
  | 'solvent'        // 유기용제
  | 'acid'           // 산
  | 'base'           // 염기
  | 'gas'            // 가스
  | 'metal'          // 금속
  | 'photoresist'    // 포토레지스트
  | 'slurry'         // 슬러리
  | 'dopant'         // 도펀트
  | 'byproduct';     // 부산물

// 유해성 분류
export type HazardType =
  | 'carcinogen-1'        // 발암성 1군 (IARC)
  | 'carcinogen-2a'       // 발암성 2A군
  | 'reproductive-toxin'  // 생식독성
  | 'mutagen'             // 변이원성
  | 'corrosive'           // 부식성
  | 'acute-toxic'         // 급성 독성
  | 'sensitizer';         // 감작성

export interface Chemical {
  id: string;                  // "benzene"
  nameKo: string;              // "벤젠"
  nameEn: string;              // "Benzene"
  formula?: string;            // "C₆H₆"
  casNo?: string;              // "71-43-2"
  category: ChemicalCategory;
  usedIn: ProcessId[];         // ['cleaning', 'photolithography']
  hazards: HazardType[];
  hazardSummary: string;       // 1-2줄 요약
  easyExplain: string;         // 비유 기반 쉬운 설명
  detailMd?: string;           // 상세 markdown (옵션)
  sourceRef: {                 // 원본 인용
    page: number;
    section: string;
  };
}

export interface Process {
  id: ProcessId;
  order: number;               // 1~9 (다이어그램 순서)
  nameKo: string;              // "포토리소그래피"
  nameEn: string;              // "Photolithography"
  slug: string;                // URL 슬러그
  oneLine: string;             // 한 줄 요약
  analogy: string;             // 핵심 비유 ("사진 인화 같은 거예요")
  iconName: string;            // Lucide icon name
  color: string;               // Tailwind color token
  steps: ProcessStep[];        // 세부 단계
  chemicals: string[];         // Chemical.id 리스트
  hazardKeywords: string[];    // 다이어그램 툴팁에 표시할 핵심 위험
}

export interface ProcessStep {
  id: string;
  nameKo: string;
  description: string;
  duration?: string;           // 옵션
}

export interface Term {
  id: string;
  termKo: string;              // "포토레지스트"
  termEn?: string;             // "Photoresist"
  shortDef: string;            // 툴팁용 1줄 정의
  fullDef?: string;            // 상세 페이지용
  relatedTerms?: string[];
}

// MDX frontmatter
export interface ChapterFrontmatter {
  title: string;
  slug: string;
  order: number;
  category: 'intro' | 'foundation' | 'process' | 'hazard' | 'disease';
  readingTime: number;         // 분 단위
  description: string;
  sourceChapter: string;       // 원본 챕터 명
  sourcePages: [number, number]; // 원본 페이지 범위
  relatedProcesses?: ProcessId[];
  relatedChemicals?: string[];
}
```

### 3.2 데이터 파일 예시

**`src/data/chemicals.json`** (발췌)
```json
[
  {
    "id": "benzene",
    "nameKo": "벤젠",
    "nameEn": "Benzene",
    "formula": "C₆H₆",
    "casNo": "71-43-2",
    "category": "solvent",
    "usedIn": ["cleaning", "photolithography"],
    "hazards": ["carcinogen-1", "reproductive-toxin"],
    "hazardSummary": "발암성 1군 물질로, 백혈병을 일으킬 수 있어요.",
    "easyExplain": "휘발유 냄새가 나는 무색 액체예요. 한때 흔히 쓰였지만 백혈병 원인으로 밝혀져 지금은 엄격히 관리해요.",
    "sourceRef": { "page": 142, "section": "포토리소그래피 공정의 유해인자" }
  },
  {
    "id": "arsine",
    "nameKo": "아르신",
    "nameEn": "Arsine",
    "formula": "AsH₃",
    "casNo": "7784-42-1",
    "category": "gas",
    "usedIn": ["ion-implantation", "diffusion"],
    "hazards": ["acute-toxic", "carcinogen-1"],
    "hazardSummary": "극도로 독성이 강한 가스. 극소량으로도 치명적.",
    "easyExplain": "마늘 냄새가 살짝 나는 가스인데, 들이마시면 매우 위험해요. 반도체 만들 때 실리콘에 비소를 넣는 데 써요.",
    "sourceRef": { "page": 199, "section": "이온 주입 공정의 유해인자" }
  }
]
```

**`src/data/processes.json`** (발췌)
```json
[
  {
    "id": "photolithography",
    "order": 4,
    "nameKo": "포토리소그래피",
    "nameEn": "Photolithography",
    "slug": "photolithography",
    "oneLine": "빛으로 회로를 그려넣는 공정이에요",
    "analogy": "사진을 인화하는 것과 비슷해요. 빛에 반응하는 약품(포토레지스트)을 웨이퍼에 바르고, 회로 무늬가 그려진 필름(마스크)으로 빛을 쏘면 회로가 새겨져요.",
    "iconName": "Camera",
    "color": "purple",
    "steps": [
      { "id": "clean", "nameKo": "클리닝", "description": "표면을 깨끗이 씻어요" },
      { "id": "treat", "nameKo": "표면 처리", "description": "PR이 잘 붙도록 준비해요" },
      { "id": "coat", "nameKo": "PR 코팅", "description": "포토레지스트를 얇게 발라요" },
      { "id": "soft-bake", "nameKo": "소프트 베이크", "description": "살짝 구워 굳혀요" },
      { "id": "expose", "nameKo": "노광", "description": "마스크로 빛을 쏘아요" },
      { "id": "post-bake", "nameKo": "노광 후 경화", "description": "한 번 더 구워요" },
      { "id": "develop", "nameKo": "현상", "description": "회로 무늬가 드러나요" },
      { "id": "hard-bake", "nameKo": "하드 베이크", "description": "단단하게 굳혀요" }
    ],
    "chemicals": ["benzene", "pgmea", "tmah", "hmds"],
    "hazardKeywords": ["유기용제 노출", "광화학 부산물", "PR 분진"]
  }
]
```

---

## 4. 라우팅 설계

### 4.1 페이지 매트릭스

| URL | 파일 | 렌더링 | 콘텐츠 출처 |
|-----|------|--------|------------|
| `/` | `app/page.tsx` | RSC + Island | 자체 컴포넌트 (홈 다이어그램) |
| `/start` | `app/start/page.tsx` | RSC | 자체 컴포넌트 |
| `/what-is-semiconductor` | `app/what-is-semiconductor/page.mdx` | RSC | MDX |
| `/risks-of-new-tech` | `app/risks-of-new-tech/page.mdx` | RSC | MDX |
| `/cleanroom` | `app/cleanroom/page.mdx` | RSC | MDX |
| `/process-overview` | `app/process-overview/page.tsx` | RSC + Island | 자체 + processes.json |
| `/process/[slug]` | `app/process/[slug]/page.tsx` | SSG | `content/processes/*.mdx` |
| `/chemicals` | `app/chemicals/page.tsx` | RSC + Island | chemicals.json + 클라이언트 검색 |
| `/chemicals/[id]` | `app/chemicals/[id]/page.tsx` | SSG | chemicals.json |
| `/electromagnetic` | `app/electromagnetic/page.mdx` | RSC | MDX |
| `/occupational-disease` | `app/occupational-disease/page.mdx` | RSC | MDX |
| `/about` | `app/about/page.mdx` | RSC | MDX |

### 4.2 동적 라우팅 — `generateStaticParams`

**`app/process/[slug]/page.tsx`**
```typescript
import { processes } from '@/data/processes.json';

export function generateStaticParams() {
  return processes.map((p) => ({ slug: p.slug }));
}

export default async function ProcessPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const process = processes.find((p) => p.slug === slug);
  if (!process) notFound();

  const Mdx = (await import(`@/content/processes/${slug}.mdx`)).default;
  return (
    <ProcessLayout process={process}>
      <Mdx components={mdxComponents} />
    </ProcessLayout>
  );
}
```

---

## 5. 핵심 컴포넌트 상세

### 5.1 `<ProcessDiagram />` — 인터랙티브 8공정 다이어그램 (P0)

**위치**: 홈 + `/process-overview` + 각 공정 페이지 상단 (현재 공정 강조)

**Props**
```typescript
interface ProcessDiagramProps {
  activeId?: ProcessId;      // 현재 강조할 공정 (옵션)
  variant?: 'full' | 'compact';
  onSelect?: (id: ProcessId) => void;
}
```

**동작**
- **데스크톱**: 각 공정 박스를 호버 → 툴팁(공정명·한줄요약·핵심 유해인자 3개)
- **모바일**: 탭 → 하단 시트(bottom sheet)로 동일 정보 표시
- **클릭**: `/process/[slug]` 로 이동
- **키보드**: Tab으로 순환, Enter로 진입, Esc로 툴팁 닫기

**구조 (SVG + React)**
```
[웨이퍼] → [클리닝] → [확산] → [포토] → [식각] → [증착] → [이온주입] → [CMP] → [패키징]
   |          |         |        |        |         |          |          |        |
   클릭 시 해당 공정 페이지로 이동, 호버 시 툴팁
```

**접근성**: `role="navigation"`, 각 공정 박스는 `<a>` 태그, ARIA labels.

### 5.2 `<ChemicalSearch />` — 유해물질 사전 검색 (P0)

**위치**: `/chemicals`

**기능**
- 클라이언트 사이드 검색 (Fuse.js)
- 검색 필드: `nameKo`, `nameEn`, `formula`, `casNo`
- 필터: 분류(카테고리), 사용 공정, 유해성 타입
- URL 쿼리 동기화 (`?q=벤젠&category=solvent`)

**Fuse.js 설정**
```typescript
import Fuse from 'fuse.js';
import chemicals from '@/data/chemicals.json';

export const chemicalFuse = new Fuse(chemicals, {
  keys: [
    { name: 'nameKo', weight: 0.4 },
    { name: 'nameEn', weight: 0.3 },
    { name: 'formula', weight: 0.15 },
    { name: 'casNo', weight: 0.15 },
  ],
  threshold: 0.3,
  ignoreLocation: true,
});
```

**UI 레이아웃**
```
┌─────────────────────────────────────────────┐
│  [🔍 검색...]              [필터 ▼]         │
├──────────┬──────────────────────────────────┤
│ 필터     │  ┌─────┐ ┌─────┐ ┌─────┐         │
│ ── 분류  │  │ 벤젠 │ │ 톨루엔│ │ 아르신│ ... │
│ □ 용제   │  │     │ │     │ │     │         │
│ □ 가스   │  │ 🚨 1군│ │ 🚨 1군│ │ ☠ 독성│   │
│ □ 산     │  └─────┘ └─────┘ └─────┘         │
│ ── 공정  │                                  │
│ □ 클리닝 │  검색 결과: 23건                │
│ □ 식각   │                                  │
└──────────┴──────────────────────────────────┘
```

### 5.3 `<LayeredExplain />` — 3단 레이어 설명 컴포넌트 (P0)

**위치**: 각 챕터 핵심 개념 부분

**구조**
```tsx
<LayeredExplain
  hook="반도체는 전기가 반만 흐르는 물질이에요"
  easy={{
    analogy: "수도꼭지 같아요. 평소엔 잠겨있다가, 열면 흘러요.",
    illustration: <FaucetSvg />,
  }}
  deep={{
    quote: "반도체(semiconductor)는 도체와 부도체의 중간 정도의 전기적 특성을 가진 물질로...",
    sourceRef: { page: 28, section: "2장 반도체의 이해" },
  }}
/>
```

**렌더링**
```
┌─ Hook ──────────────────────────────────────┐
│ 💡 반도체는 전기가 반만 흐르는 물질이에요    │
└─────────────────────────────────────────────┘
┌─ Easy (기본 펼침) ──────────────────────────┐
│ 수도꼭지 같아요. 평소엔 잠겨있다가...        │
│ [수도꼭지 일러스트]                          │
└─────────────────────────────────────────────┘
┌─ Deep (접힘, 클릭 시 펼침) ────────────────┐
│ ▶ 학술 원문 보기 (p.28)                     │
└─────────────────────────────────────────────┘
```

### 5.4 `<Term />` — 인라인 용어 툴팁

**용도**: MDX 본문에서 어려운 용어에 호버/탭 시 짧은 정의 표시

```mdx
<Term id="photoresist">포토레지스트</Term>는 빛에 반응하는 물질이에요.
```

- `terms.json` 에서 `id`로 조회 → 툴팁/팝오버 렌더
- 모바일: 탭 → 팝오버, ESC/외부 클릭으로 닫기
- 접근성: `aria-describedby` 연결

---

## 6. MDX 구성

### 6.1 MDX 컴포넌트 매핑 (`src/app/layout.tsx` 또는 `mdx-components.tsx`)

```typescript
// src/mdx-components.tsx
import type { MDXComponents } from 'mdx/types';
import { LayeredExplain } from '@/components/content/LayeredExplain';
import { Term } from '@/components/content/Term';
import { Callout } from '@/components/content/Callout';
import { SourceQuote } from '@/components/content/SourceQuote';
import { ProcessDiagram } from '@/components/process/ProcessDiagram';
import { ChemicalCard } from '@/components/chemicals/ChemicalCard';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    LayeredExplain,
    Term,
    Callout,
    SourceQuote,
    ProcessDiagram,
    ChemicalCard,
    h1: (props) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
    h2: (props) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
    a: (props) => <a className="text-blue-600 hover:underline" {...props} />,
  };
}
```

### 6.2 MDX 챕터 예시 (`src/content/processes/photolithography.mdx`)

```mdx
---
title: 포토리소그래피 공정
slug: photolithography
order: 4
category: process
readingTime: 8
description: 빛으로 회로를 그려넣는 반도체의 핵심 공정
sourceChapter: 포토리소그래피 공정과 유해인자
sourcePages: [112, 157]
relatedProcesses: [cleaning, etching]
relatedChemicals: [benzene, pgmea, tmah, hmds]
---

# 포토리소그래피 공정

<LayeredExplain
  hook="빛으로 회로를 그려넣는 공정이에요"
  easy={{
    analogy: "사진을 인화하는 것과 비슷해요. 필름에 그려진 그림을 종이에 옮기는 것처럼, 마스크에 그려진 회로를 웨이퍼에 옮겨요.",
  }}
  deep={{
    sourcePage: 112,
  }}
/>

## 어떻게 하는 거예요?

8단계로 나뉘어요:

1. **클리닝** — 표면을 씻어요
2. **표면 처리** — <Term id="photoresist">포토레지스트</Term>가 잘 붙도록 준비
3. ...

## 어떤 위험이 있나요?

<Callout type="warning">
  포토리소그래피는 반도체 공정 중에서 가장 많은 종류의 화학물질을 써요.
</Callout>

<ChemicalCard id="benzene" />
<ChemicalCard id="pgmea" />
```

---

## 7. 디자인 토큰

### 7.1 Tailwind 설정 (`tailwind.config.ts`)

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand
        brand: {
          50:  '#eff6ff',
          500: '#3b82f6',  // Primary blue
          900: '#1e3a8a',
        },
        // Hazard semantic
        hazard: {
          critical: '#dc2626',  // 발암성 1군
          high:     '#f59e0b',  // 발암성 2A군
          moderate: '#eab308',  // 일반 독성
          low:      '#84cc16',
        },
        // Process colors (9공정)
        process: {
          wafer:           '#64748b',
          cleaning:        '#06b6d4',
          diffusion:       '#f97316',
          photolithography:'#a855f7',
          etching:         '#ef4444',
          deposition:      '#22c55e',
          'ion-implantation': '#eab308',
          cmp:             '#3b82f6',
          packaging:       '#ec4899',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '72ch',
            'h2': { scrollMarginTop: '6rem' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
```

### 7.2 Layout 그리드

| 영역 | 데스크톱 | 모바일 |
|------|---------|--------|
| Header | 고정 64px | 고정 56px |
| Sidebar | 좌 280px | 햄버거 메뉴 (오버레이) |
| Content | 중앙 max-w-3xl (768px) | full width, 16px padding |
| TOC | 우 240px (sticky) | 본문 상단 토글 |
| Footer | 하단 자동 | 하단 자동 |

---

## 8. 라이브러리 & 의존성

| 패키지 | 버전 | 용도 |
|--------|------|------|
| next | ^15 | App Router, SSG |
| react | ^19 | UI |
| typescript | ^5 | 타입 |
| tailwindcss | ^4 | 스타일 |
| @tailwindcss/typography | latest | MDX prose 스타일 |
| @next/mdx | ^15 | MDX 통합 |
| @mdx-js/loader | latest | MDX 로더 |
| @mdx-js/react | latest | MDX React 컴포넌트 |
| remark-gfm | latest | GFM 지원 (table 등) |
| rehype-slug | latest | 헤딩 ID 자동 부여 |
| rehype-autolink-headings | latest | 헤딩 앵커 |
| fuse.js | ^7 | 클라이언트 검색 |
| lucide-react | latest | 아이콘 |
| clsx + tailwind-merge | latest | 클래스 유틸 |
| zod | ^3 | 데이터 검증 (빌드 타임) |

**개발 도구**
- eslint, prettier, @next/eslint-plugin-next
- vitest (단위 테스트), @testing-library/react
- playwright (E2E, 옵션)

---

## 9. SEO & 메타데이터

### 9.1 페이지별 메타

```typescript
// src/lib/seo.ts
export function buildMetadata(input: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}): Metadata {
  return {
    title: `${input.title} | 반도체 아카데미`,
    description: input.description,
    openGraph: {
      title: input.title,
      description: input.description,
      url: `https://semiconductor-academy.kr${input.path}`,
      images: input.ogImage ? [input.ogImage] : ['/og-default.png'],
    },
    twitter: { card: 'summary_large_image' },
  };
}
```

### 9.2 정적 자산

- `public/sitemap.xml` (`next-sitemap`로 생성)
- `public/robots.txt`
- `public/og-default.png` (1200×630)
- 각 챕터 OG 이미지는 빌드 타임 생성 (옵션, satori 사용)

---

## 10. 빌드 & 배포

### 10.1 `next.config.mjs`
```javascript
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
});

export default withMDX({
  output: 'export',                     // 완전 정적 export
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: { unoptimized: true },
});
```

### 10.2 배포

- **Vercel** 프로젝트 연결 → 메인 브랜치 푸시 시 자동 배포
- 프리뷰 URL: PR마다 자동 생성
- 환경변수: 없음 (정적 사이트)
- 도메인 (옵션): `semiconductor-academy.kr`

---

## 11. 접근성 (a11y)

| 항목 | 적용 |
|------|------|
| Color contrast | 본문 ≥ 4.5:1, 큰 텍스트 ≥ 3:1 |
| Keyboard nav | 모든 인터랙티브 요소 Tab 순환, focus ring 명확 |
| Screen reader | semantic HTML, ARIA 라벨, alt text |
| Reduced motion | `prefers-reduced-motion` 존중 (애니메이션 끄기) |
| Skip link | 헤더에 "본문 바로가기" |
| 폰트 크기 | 사용자 브라우저 설정 존중 (rem 단위) |

---

## 12. 테스트 전략

| 레벨 | 도구 | 대상 |
|------|------|------|
| Unit | Vitest | `lib/*` (search, content loader), 데이터 검증 (zod) |
| Component | RTL | `ChemicalSearch`, `ProcessDiagram`, `LayeredExplain` |
| E2E (옵션) | Playwright | 핵심 사용자 흐름 (검색→상세→공정 이동) |
| Visual (옵션) | Vercel Visual Regression | 홈/공정 페이지 스냅샷 |
| 빌드 검증 | `next build && next export` | 모든 페이지 정적 생성 확인 |
| Lighthouse | Vercel Speed Insights | 자동 측정, 목표 ≥ 90 |

---

## 13. 구현 순서 (Phase Breakdown)

다음 Do 단계에서 진행할 구현 순서:

1. **Phase A — 골격 (W4 초)**
   - Next.js 15 프로젝트 init, Tailwind 설정
   - 폴더 구조 생성, TS 타입 정의 (`lib/types.ts`)
   - 루트 layout, header, footer, sidebar
   - 기본 라우팅 (홈 + 5개 정적 페이지)

2. **Phase B — 데이터 (W4 중)**
   - `chemicals.json` 시드 데이터 (30~50건) + zod 스키마
   - `processes.json` 9개 공정 메타
   - `terms.json` 핵심 용어 30~50건
   - `lib/content.ts` 로더, `lib/search.ts` Fuse 설정

3. **Phase C — 콘텐츠 (W4 말~W5)**
   - MDX 컴포넌트 (`LayeredExplain`, `Term`, `Callout`, `SourceQuote`)
   - 챕터 본문 5개 MDX 작성 (introduction 챕터들)
   - 공정 본문 9개 MDX 작성

4. **Phase D — 인터랙션 (W5)**
   - `ProcessDiagram` 인터랙티브 SVG (★ 핵심)
   - `ChemicalSearch` Fuse.js 통합 (★ 핵심)
   - `ChemicalCard`, `ChemicalFilter`

5. **Phase E — 폴리싱 (W6)**
   - 일러스트 SVG 추가
   - 다크모드, 반응형 모바일 최적화
   - SEO 메타, OG 이미지
   - 접근성 audit

6. **Phase F — QA & 배포 (W7)**
   - Lighthouse, WCAG audit
   - 빌드 + Vercel 배포
   - Gap 분석 → 90% 목표

**다음 단계**
```bash
/pdca do semiconductor-academy-site
```

---

## 14. 미해결 결정 (Open Questions)

| ID | 질문 | 결정 시점 |
|----|------|----------|
| Q1 | 원본 페이지 이미지(`_page_*.jpeg`)를 직접 사용할지, 자체 SVG로 재제작할지 | Phase C 진입 전 |
| Q2 | OG 이미지 자동 생성(satori) 도입할지 | Phase E |
| Q3 | 다국어(i18n) 라우팅 구조만 미리 깔지 (`/ko/*`) | Phase A 직전 |
| Q4 | 도메인 구입 여부 | Phase F |

---

## 15. 참고

- Plan 문서: [`docs/01-plan/features/semiconductor-academy-site.plan.md`](../../01-plan/features/semiconductor-academy-site.plan.md)
- 원본 자료: `data/20260526_185841_반도체산업의유해인자_에피스테메_-_13/*.md`
- Next.js 15 docs: https://nextjs.org/docs
- Tailwind v4 docs: https://tailwindcss.com/docs

---

## 16. Amendment Log

### 2026-05-27 (Act-1 iteration)

**Structural deviations adopted as official pattern**:

1. **MDX chapter co-location**: 챕터 본문은 `src/content/chapters/*.mdx` 가 아니라 **App Router co-location** (`src/app/{route}/page.mdx`)을 사용. Next.js 15 정석.
2. **Tailwind v4 `@theme` in CSS**: 별도 `tailwind.config.ts` 없이 `src/styles/globals.css`의 `@theme` 블록으로 토큰 정의. v4 정식 관행.
3. **`src/styles/mdx.css` 미사용**: `@tailwindcss/typography`의 `prose` 클래스로 충분. 별도 파일 불필요.
4. **Sub-component inlining**: `ProcessStep`, `ProcessTooltip`, `ProcessDetailCard`, `ChemicalFilter`는 부모 컴포넌트 내부에 인라인. 재사용 필요성 발생 시 분리.

**Optional MDX bodies for processes**:

- 9개 공정 모두 MDX 본문이 필수는 아님. 위험성·복잡성이 높은 공정 위주로 점진적 추가.
- `src/lib/processMdx.tsx`의 매핑에 등록된 공정만 추가 MDX 본문이 렌더링됨.
- 현재 등록된 공정: photolithography, etching, ion-implantation (Act-1 추가)

**Removed items**:

- `src/components/ui/Button.tsx`, `Dialog.tsx`: 현재 미소비. 필요 시 추가.
- `src/illustrations/*.svg`: Phase E(폴리싱)로 이연. icon + 텍스트로 우선 동작.
- `scripts/extract-chemicals.ts`: 수동 작성으로 대체. `npm run extract:chemicals` 스크립트 제거.
- `src/data/sources.json`: `Chemical.sourceRef`로 인라인. 중복 데이터 회피.

**Added items**:

- `src/lib/processMdx.tsx`: 공정 슬러그 → MDX 컴포넌트 동적 로더.
- `public/sitemap.xml`: 수동 작성 sitemap.
- `public/og-default.svg`: OG 기본 이미지 (PNG 변환은 Phase E에서).
- `ChapterNav` 컴포넌트 + mdx-components 등록.
