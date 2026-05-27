# Design: chapter-based-restructure

> 책 17개 챕터를 사이트 메인 IA로 — 컴포넌트·라우팅·데이터 모델·URL 정책 상세 설계

**작성일**: 2026-05-27
**Feature**: `chapter-based-restructure`
**PDCA Phase**: Design
**Linked Plan**: [docs/01-plan/features/chapter-based-restructure.plan.md](../../01-plan/features/chapter-based-restructure.plan.md)
**Status**: Draft

---

## 0. Open Questions 결정 사항

Plan의 미해결 결정 5개를 본 Design에서 확정:

| ID | 질문 | **결정** | 근거 |
|----|------|---------|------|
| Q1 | 홈 entry — 4-card vs hero 섹션 | **별도 hero 섹션 추가** (3-card 유지) | 책 모드를 새 entry로 강조. 기존 카드 그대로 두고 그 위에 책 hero. |
| Q2 | 진도 트래킹 (localStorage) | **이번 사이클 제외** (YAGNI) | 핵심 IA부터 만들고 차기 사이클에 트래킹 추가. 17챕터 완성이 우선. |
| Q3 | 5~13장 분량 | **짧은 도입(300~500자) + 공정 페이지 임베드 안내** | 본문 중복 회피, 공정 페이지가 진짜 데이터 소스 |
| Q4 | 기존 URL 정책 | **기존 URL 유지 + 챕터 URL 신규 추가** + 챕터 URL이 canonical | static export에서 redirect 복잡. 두 URL 모두 동작, canonical만 챕터로. 챕터 페이지가 메인 entry. |
| Q5 | 카테고리 시각화 | **색상 + 라벨 tag** | foundation=blue, process=green, hazard=amber, reflection=purple |

---

## 1. 아키텍처 개요

### 1.1 IA 변화

```
이전 (공정·사전 중심):
/                              홈
/process-overview/             ────┐
/process/[slug]/  (9개)        ────┤── 공정 entry
/chemicals/                    ────┤── 사전 entry
/chemicals/[id]/  (31개)       ────┘
/cleanroom/, /risks/, etc.     일반 챕터 (5개)


이후 (책 중심 + 공정·사전 병행):
/                              홈 (책 hero + 기존 3-card)
/chapters/                     ────┐
/chapter/[N-slug]/  (17개)     ────┤── 책 entry ★ NEW
/process-overview/             ────┐
/process/[slug]/  (9개)        ────┤── 공정 entry (유지)
/chemicals/                    ────┤── 사전 entry (유지)
/chemicals/[id]/  (31개)       ────┘
/cleanroom/, /risks/, etc.     유지 (챕터 URL과 병행, canonical은 챕터로)
```

### 1.2 콘텐츠 흐름

```
data/*.md (원본)
     ↓
src/content/chapters/01-risks-of-new-tech.mdx
src/content/chapters/02-semiconductor.mdx
...                                              ┐
src/content/chapters/17-industrial-health.mdx    │ 17개 MDX
                                                  │
src/data/chapters.json (메타데이터)               │
                                                  ▼
src/lib/chaptersMdx.tsx (slug → import 매핑)
                                                  ▼
src/app/chapter/[slug]/page.tsx (동적 라우팅)
src/app/chapters/page.tsx (목차)
```

---

## 2. 폴더 구조 추가/변경

```
src/
├── app/
│   ├── chapters/
│   │   └── page.tsx                    ★ NEW: 책 차례 페이지
│   ├── chapter/
│   │   └── [slug]/
│   │       └── page.tsx                ★ NEW: 동적 챕터 라우팅
│   ├── what-is-semiconductor/page.mdx  유지 (canonical=/chapter/02-...)
│   ├── risks-of-new-tech/page.mdx      유지
│   ├── cleanroom/page.mdx              유지
│   ├── electromagnetic/page.mdx        유지
│   ├── occupational-disease/page.mdx   유지
│   ├── (process, chemicals 등 유지)
│
├── content/
│   ├── chapters/                       ★ NEW
│   │   ├── 01-risks-of-new-tech.mdx
│   │   ├── 02-semiconductor.mdx
│   │   ├── 03-process-overview.mdx
│   │   ├── 04-cleanroom.mdx
│   │   ├── 05-wafer.mdx                (짧은 도입 + /process/wafer/ 링크)
│   │   ├── 06-cleaning.mdx
│   │   ├── 07-diffusion.mdx
│   │   ├── 08-photolithography.mdx
│   │   ├── 09-etching.mdx
│   │   ├── 10-deposition.mdx
│   │   ├── 11-ion-implantation.mdx
│   │   ├── 12-cmp.mdx
│   │   ├── 13-packaging.mdx
│   │   ├── 14-chemicals-usage.mdx
│   │   ├── 15-electromagnetic.mdx
│   │   ├── 16-occupational-disease.mdx
│   │   └── 17-industrial-health-view.mdx
│   └── processes/                      유지 (기존 6개 MDX)
│
├── data/
│   ├── chapters.json                   ★ NEW
│   ├── processes.json                  유지
│   ├── chemicals.json                  유지
│   └── terms.json                      유지
│
├── lib/
│   ├── chapters.ts                     ★ NEW: 챕터 데이터 로더
│   ├── chaptersMdx.tsx                 ★ NEW: 슬러그→MDX 동적 import
│   ├── (기존 content.ts, processMdx.tsx 등 유지)
│
└── components/
    ├── chapter/                        ★ NEW
    │   ├── ChapterCard.tsx             (목차 카드)
    │   ├── ChapterHeader.tsx           (페이지 헤더)
    │   ├── ChapterFooterNav.tsx        (prev/next + 목차로)
    │   ├── ChapterCategoryBadge.tsx    (foundation/process/hazard/reflection)
    │   └── ChaptersHero.tsx            (홈 책 hero 섹션)
    └── content/ChapterNav.tsx          유지 (단순 prev/next, MDX용)
```

---

## 3. 데이터 모델

### 3.1 TypeScript 타입 (`src/lib/types.ts` 확장)

```typescript
export type ChapterCategory =
  | 'foundation'   // 1~3장: 도입/이론
  | 'process'      // 4~13장: 공정
  | 'hazard'       // 14~16장: 화학물질·전자파·직업병
  | 'reflection';  // 17장: 산업보건학적 시각

export interface Chapter {
  id: string;                      // "01-risks-of-new-tech"
  order: number;                   // 1~17
  slug: string;                    // URL용 ("risks-of-new-tech")
  title: string;                   // "새 기술, 새 공정, 새 화학물질 사용의 위험성"
  shortTitle?: string;             // 목차에서 짧게 ("새 기술의 위험성")
  subtitle?: string;               // 1줄 hook
  category: ChapterCategory;
  sourcePages: [number, number];   // 원본 페이지 범위
  readingTime: number;             // 분
  hasFullBody: boolean;            // true=풀 MDX / false=도입+링크
  externalLink?: string;           // hasFullBody=false일 때 (e.g. "/process/wafer/")
  relatedProcessIds?: ProcessId[];
  relatedChemicalIds?: string[];
  legacyUrl?: string;              // 이전 URL (e.g. "/cleanroom/")
}

export const CATEGORY_LABELS: Record<ChapterCategory, string> = {
  foundation: '기초',
  process: '공정',
  hazard: '유해성',
  reflection: '성찰',
};

export const CATEGORY_COLOR: Record<ChapterCategory, string> = {
  foundation: 'blue',
  process: 'emerald',
  hazard: 'amber',
  reflection: 'purple',
};
```

### 3.2 `src/data/chapters.json` (전체 17개)

```json
[
  {
    "id": "01-risks-of-new-tech",
    "order": 1,
    "slug": "risks-of-new-tech",
    "title": "새 기술, 새 공정, 새 화학물질 사용의 위험성",
    "shortTitle": "새 기술의 위험성",
    "subtitle": "DDT, 석면이 알려준 교훈 — 반도체에도 같은 시각이 필요해요",
    "category": "foundation",
    "sourcePages": [15, 26],
    "readingTime": 7,
    "hasFullBody": true,
    "legacyUrl": "/risks-of-new-tech/"
  },
  {
    "id": "02-semiconductor",
    "order": 2,
    "slug": "semiconductor",
    "title": "반도체의 이해",
    "shortTitle": "반도체란?",
    "subtitle": "도체와 부도체 사이, 전기를 반만 흐르게 하는 신기한 물질",
    "category": "foundation",
    "sourcePages": [27, 43],
    "readingTime": 8,
    "hasFullBody": true,
    "legacyUrl": "/what-is-semiconductor/"
  },
  {
    "id": "03-process-overview",
    "order": 3,
    "slug": "process-overview-chapter",
    "title": "반도체 제조 공정의 전반적 이해",
    "shortTitle": "제조 공정 개요",
    "subtitle": "모래에서 칩까지 — 9단계 큰 그림",
    "category": "foundation",
    "sourcePages": [45, 54],
    "readingTime": 6,
    "hasFullBody": true,
    "relatedProcessIds": ["wafer", "cleaning", "diffusion", "photolithography", "etching", "deposition", "ion-implantation", "cmp", "packaging"]
  },
  {
    "id": "04-cleanroom",
    "order": 4,
    "slug": "cleanroom",
    "title": "클린룸과 유해인자",
    "shortTitle": "클린룸",
    "subtitle": "수술실보다 1만 배 깨끗한 공간, 그 안의 역설",
    "category": "foundation",
    "sourcePages": [55, 65],
    "readingTime": 6,
    "hasFullBody": true,
    "legacyUrl": "/cleanroom/"
  },
  {
    "id": "05-wafer",
    "order": 5,
    "slug": "wafer",
    "title": "웨이퍼 제조 공정과 유해인자",
    "shortTitle": "웨이퍼 제조",
    "subtitle": "모래에서 반도체의 도화지를 만드는 11단계",
    "category": "process",
    "sourcePages": [67, 83],
    "readingTime": 8,
    "hasFullBody": false,
    "externalLink": "/process/wafer/",
    "relatedProcessIds": ["wafer"]
  },
  { "id": "06-cleaning", "order": 6, "slug": "cleaning",
    "title": "클리닝 공정과 유해인자", "shortTitle": "클리닝",
    "subtitle": "수술 전 손 씻기보다 1만 배 정밀한 세정",
    "category": "process", "sourcePages": [85, 99], "readingTime": 7,
    "hasFullBody": false, "externalLink": "/process/cleaning/",
    "relatedProcessIds": ["cleaning"] },
  { "id": "07-diffusion", "order": 7, "slug": "diffusion",
    "title": "확산 공정과 유해인자", "shortTitle": "확산",
    "subtitle": "잉크가 물에 퍼지듯 — 1000℃에서 원자가 스며들어요",
    "category": "process", "sourcePages": [101, 110], "readingTime": 5,
    "hasFullBody": false, "externalLink": "/process/diffusion/",
    "relatedProcessIds": ["diffusion"] },
  { "id": "08-photolithography", "order": 8, "slug": "photolithography",
    "title": "포토리소그래피 공정과 유해인자", "shortTitle": "포토리소그래피",
    "subtitle": "사진 인화처럼 빛으로 회로를 그리는 핵심 공정",
    "category": "process", "sourcePages": [111, 157], "readingTime": 12,
    "hasFullBody": false, "externalLink": "/process/photolithography/",
    "relatedProcessIds": ["photolithography"] },
  { "id": "09-etching", "order": 9, "slug": "etching",
    "title": "식각 공정과 유해인자", "shortTitle": "식각",
    "subtitle": "조각가의 정처럼 — 불산과 플라스마로 깎아내요",
    "category": "process", "sourcePages": [159, 181], "readingTime": 8,
    "hasFullBody": false, "externalLink": "/process/etching/",
    "relatedProcessIds": ["etching"] },
  { "id": "10-deposition", "order": 10, "slug": "deposition",
    "title": "증착 공정과 유해인자", "shortTitle": "증착",
    "subtitle": "원자 한 층씩 — 페인트칠하듯 박막을 입혀요",
    "category": "process", "sourcePages": [183, 193], "readingTime": 6,
    "hasFullBody": false, "externalLink": "/process/deposition/",
    "relatedProcessIds": ["deposition"] },
  { "id": "11-ion-implantation", "order": 11, "slug": "ion-implantation",
    "title": "이온 주입 공정과 유해인자", "shortTitle": "이온 주입",
    "subtitle": "총알처럼 — 이온을 가속해 실리콘에 박아넣어요",
    "category": "process", "sourcePages": [195, 205], "readingTime": 6,
    "hasFullBody": false, "externalLink": "/process/ion-implantation/",
    "relatedProcessIds": ["ion-implantation"] },
  { "id": "12-cmp", "order": 12, "slug": "cmp",
    "title": "물리 화학적 연마와 유해인자", "shortTitle": "CMP",
    "subtitle": "원자 단위 사포질 — 거울처럼 평평하게",
    "category": "process", "sourcePages": [207, 215], "readingTime": 5,
    "hasFullBody": false, "externalLink": "/process/cmp/",
    "relatedProcessIds": ["cmp"] },
  { "id": "13-packaging", "order": 13, "slug": "packaging",
    "title": "칩 조립 및 검사 공정과 유해인자", "shortTitle": "패키징",
    "subtitle": "검은 칩에 옷을 입히는 마지막 단계 — 8공정",
    "category": "process", "sourcePages": [217, 261], "readingTime": 10,
    "hasFullBody": false, "externalLink": "/process/packaging/",
    "relatedProcessIds": ["packaging"] },
  { "id": "14-chemicals-usage", "order": 14, "slug": "chemicals-usage",
    "title": "반도체 공정에서의 화학물질 사용과 유해성", "shortTitle": "화학물질 사용",
    "subtitle": "표 14-4가 말하는 것 — 어디에 무엇을 얼마나 쓰나",
    "category": "hazard", "sourcePages": [263, 281], "readingTime": 9,
    "hasFullBody": true },
  { "id": "15-electromagnetic", "order": 15, "slug": "electromagnetic-chapter",
    "title": "반도체 공정과 전자파", "shortTitle": "전자파",
    "subtitle": "보이지 않는 ELF-MF — 거리의 제곱에 반비례하는 위험",
    "category": "hazard", "sourcePages": [283, 303], "readingTime": 8,
    "hasFullBody": true, "legacyUrl": "/electromagnetic/" },
  { "id": "16-occupational-disease", "order": 16, "slug": "occupational-disease-chapter",
    "title": "반도체 공정 주요 질병 위험 고찰", "shortTitle": "직업병 고찰",
    "subtitle": "생식독성 입증·림프종·백혈병의 그림자",
    "category": "hazard", "sourcePages": [305, 317], "readingTime": 10,
    "hasFullBody": true, "legacyUrl": "/occupational-disease/" },
  { "id": "17-industrial-health-view", "order": 17, "slug": "industrial-health-view",
    "title": "산업보건학적 시각에서 바라본 반도체 산업", "shortTitle": "산업보건학적 시각",
    "subtitle": "신공정·신기술·새 화학물질 — 책의 결론",
    "category": "reflection", "sourcePages": [319, 333], "readingTime": 10,
    "hasFullBody": true }
]
```

---

## 4. 라우팅 설계

### 4.1 새 라우트

| URL | 파일 | 렌더링 | 콘텐츠 |
|-----|------|--------|--------|
| `/chapters/` | `app/chapters/page.tsx` | RSC | `ChaptersIndex` 컴포넌트 + `chapters.json` |
| `/chapter/[slug]/` | `app/chapter/[slug]/page.tsx` | SSG (×17) | `chapters.json` + 슬러그별 MDX |

### 4.2 기존 라우트 유지 (canonical 변경)

| URL | 새 canonical | 이유 |
|-----|------------|------|
| `/risks-of-new-tech/` | `/chapter/risks-of-new-tech/` | 챕터가 메인 |
| `/what-is-semiconductor/` | `/chapter/semiconductor/` | (slug 통일) |
| `/cleanroom/` | `/chapter/cleanroom/` | |
| `/electromagnetic/` | `/chapter/electromagnetic-chapter/` | (사이트 내 /electromagnetic/ 보존) |
| `/occupational-disease/` | `/chapter/occupational-disease-chapter/` | |

> 기존 페이지의 `buildMetadata`에 새 canonical URL 설정. 검색엔진에 챕터 URL을 메인으로 알림. 사용자는 어느 URL이든 동일 콘텐츠 접근 가능.

### 4.3 동적 라우팅 — `generateStaticParams`

**`app/chapter/[slug]/page.tsx`**
```typescript
import { chapters } from '@/lib/chapters';

export function generateStaticParams() {
  return chapters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const chapter = chapters.find((c) => c.slug === slug);
  return buildMetadata({
    title: `Chapter ${chapter.order}. ${chapter.title}`,
    description: chapter.subtitle ?? '',
    path: `/chapter/${slug}/`,
  });
}

export default async function ChapterPage({ params }) {
  const { slug } = await params;
  const chapter = chapters.find((c) => c.slug === slug);
  if (!chapter) notFound();

  const MdxBody = await loadChapterMdx(chapter.id);
  // ...
}
```

---

## 5. 핵심 컴포넌트

### 5.1 `<ChaptersIndex />` — 책 차례 페이지

**위치**: `/chapters/`

**구조**:
```
┌─────────────────────────────────────────────┐
│ 책처럼 차근차근                              │
│ 반도체 산업의 유해인자 — 17챕터              │ ← Hero
│ 약 2시간이면 한 권 다 읽을 수 있어요          │
├─────────────────────────────────────────────┤
│ 🏛 기초 (1~4장)                              │ ← 카테고리 그룹
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│ │ 1장   │ │ 2장  │ │ 3장   │ │ 4장   │       │
│ │ 새 기술│ │ 반도체│ │ 공정   │ │ 클린룸│      │
│ │ 7분   │ │ 8분  │ │ 6분   │ │ 6분   │       │
│ └──────┘ └──────┘ └──────┘ └──────┘         │
├─────────────────────────────────────────────┤
│ ⚙ 공정 (5~13장)                              │
│ ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐         │
│ │5││6 ││7 ││8 ││9 ││10││11││12││13│         │
│ └──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘         │
├─────────────────────────────────────────────┤
│ ⚠ 유해성 (14~16장)                            │
├─────────────────────────────────────────────┤
│ 💭 성찰 (17장)                                │
│ ┌────────────────────────┐                   │
│ │ 17장 산업보건학적 시각  │                   │
│ └────────────────────────┘                   │
└─────────────────────────────────────────────┘
```

### 5.2 `<ChapterCard />` — 카드 컴포넌트

**Props**: `{ chapter: Chapter, variant?: 'compact' | 'full' }`

**구조**:
- order 큰 숫자 (1, 2, ..., 17) 좌상단
- shortTitle 굵게
- subtitle 한 줄 (compact는 숨김)
- 메타: `📖 p.{start}~{end} · ⏱ {readingTime}분`
- 카테고리 색상 보더-왼쪽 (border-l-4)

### 5.3 `<ChapterHeader />` — 챕터 페이지 상단

```
< 책 차례로

[카테고리 뱃지: 기초]
Chapter 1
새 기술, 새 공정, 새 화학물질 사용의 위험성
DDT, 석면이 알려준 교훈 — 반도체에도 같은 시각이 필요해요
📖 p.15~26 · ⏱ 약 7분
```

### 5.4 `<ChapterFooterNav />` — 챕터 푸터 네비

```
┌──────────┐         ┌──────┐         ┌──────────┐
│ ← 챕터 0  │         │ 목차로│         │ 챕터 2 → │
│ (없음)    │         └──────┘         │ 반도체    │
└──────────┘                            └──────────┘
```

### 5.5 `<ChapterCategoryBadge />`

```tsx
<span className="bg-blue-100 text-blue-700">기초</span>     foundation
<span className="bg-emerald-100 text-emerald-700">공정</span>  process
<span className="bg-amber-100 text-amber-700">유해성</span>    hazard
<span className="bg-purple-100 text-purple-700">성찰</span>    reflection
```

### 5.6 `<ChaptersHero />` — 홈에 추가될 책 hero 섹션

홈 페이지 다이어그램 아래, 3-card 위에 위치:

```
┌──────────────────────────────────────────────────┐
│      📖  책처럼 차근차근                          │
│                                                  │
│   17챕터 · 약 2시간 · 비유와 일러스트로 풀어드려요  │
│                                                  │
│        [ 책 차례 보기 → ]                         │
└──────────────────────────────────────────────────┘
```

---

## 6. MDX 컴포넌트 추가

`mdx-components.tsx`에 `ChapterRef` 추가 — 챕터 간 상호 참조용:

```tsx
import { ChapterRef } from '@/components/chapter/ChapterRef';

return {
  ...existing,
  ChapterRef,  // <ChapterRef order={8} /> → "Chapter 8. 포토리소그래피 →"
  // (Term, Callout, SourceQuote, HazardBadge, ProcessDiagram, ChemicalCard, LayeredExplain 등 모두 유지)
};
```

---

## 7. 챕터 본문 작성 규칙

### 7.1 풀 본문 챕터 (1, 2, 3, 4, 14, 15, 16, 17)

**구성 패턴**:
1. **Hook** — LayeredExplain의 hook 한 줄
2. **Easy** — 비유 + 일러스트 (또는 코드/표)
3. **Deep** (옵션) — `<SourceQuote>` 원문 인용
4. **본문 섹션** — h2/h3로 분절, 표·Callout·인용 적극 활용
5. **관련 자료** — `<ChapterRef>` 또는 외부 링크
6. **챕터 nav** — 자동 푸터에서 처리

### 7.2 도입+링크 챕터 (5~13)

**구성 패턴**:
1. Hook — 공정의 의미 한 줄
2. 책에서 인용한 핵심 1~2 문단
3. `<ProcessDiagram activeId="wafer" variant="compact" />`
4. "자세한 공정 →" 큰 버튼으로 `/process/wafer/`로 이동
5. (옵션) 위험 키워드 미리보기 칩

---

## 8. 홈 페이지 변경

**현재 구조**:
```
Hero
9공정 다이어그램
3-card (학습 시작 가이드 / 사전 / 직업병)
CTA "처음 오셨다면?"
```

**변경 후**:
```
Hero
9공정 다이어그램
ChaptersHero (📖 책 차례 보기) ★ NEW
3-card (유지)
CTA (유지)
```

---

## 9. SEO

- 챕터 페이지: `<title>Chapter N. 챕터명 | 반도체 아카데미</title>`
- 챕터 페이지 description: subtitle 사용
- 기존 페이지(`/cleanroom/`, `/risks-of-new-tech/`, etc.): `alternates: { canonical: '/chapter/[slug]/' }` 추가
- sitemap.xml에 17개 챕터 URL + `/chapters/` 추가

---

## 10. 구현 순서 (Do Phase 가이드)

### Phase A — 데이터·라우팅 (1~1.5h)

1. `src/lib/types.ts` — Chapter, ChapterCategory, CATEGORY_LABELS, CATEGORY_COLOR 추가
2. `src/data/chapters.json` — 17개 메타 작성
3. `src/lib/chapters.ts` — 로더 (getChapterBySlug, getOrderedChapters, etc.)
4. `src/lib/chaptersMdx.tsx` — 슬러그→MDX 동적 import (모든 17개 등록, 본문은 placeholder)
5. `src/app/chapter/[slug]/page.tsx` — 동적 페이지 (generateStaticParams, 메타데이터, MDX 렌더)
6. `src/app/chapters/page.tsx` — 목차 페이지 wrapper
7. `src/components/chapter/*.tsx` — 5개 컴포넌트 (Card, Header, FooterNav, CategoryBadge, ChaptersHero)
8. `src/content/chapters/*.mdx` — 17개 placeholder MDX (제목 + "준비 중")

### Phase B — 풀 본문 챕터 1~4 (1~1.5h)

- `01-risks-of-new-tech.mdx`, `02-semiconductor.mdx`, `03-process-overview.mdx`, `04-cleanroom.mdx`
- 책 원문에서 추출 + 비유 + Callout + SourceQuote

### Phase C — 공정 챕터 5~13 도입+링크 (1h)

- 9개 MDX, 각 300~500자 + ProcessDiagram + 외부 링크

### Phase D — 풀 본문 챕터 14~16 (1~1.5h)

- 14: 표 14-4, 표 14-5 등 학술 표 본문화
- 15: 전자파 노출 기준표
- 16: 직업병 사례 (영국/미국/한국)

### Phase E — 신규 챕터 17 (30분)

- `17-industrial-health-view.mdx` — 책 결론 reflection

### Phase F — 목차/홈/QA/배포 (1h)

- ChaptersHero 홈에 삽입
- `/chapters/` 페이지 카테고리 그룹 완성
- 기존 페이지에 canonical 메타 추가
- sitemap.xml 업데이트
- 빌드 + push + Pages 배포

---

## 11. 빌드 영향

| 항목 | 이전 | 이후 |
|------|------|------|
| 정적 페이지 수 | 41 | **58** (+17 챕터) |
| MDX 파일 수 | 14 | **31** (+17 챕터) |
| JSON 데이터 | 3 | **4** (+chapters) |
| 빌드 시간 | ~12초 | ~15초 (예상) |

---

## 12. 미해결 결정 (Open Questions for Do)

| ID | 질문 | 결정 시점 |
|----|------|----------|
| Q-D1 | 기존 페이지의 canonical 메타 추가 — 모든 5개 페이지 동시 vs 한 번에 1개씩 | Do Phase A |
| Q-D2 | ChaptersHero의 정확한 위치 (다이어그램 아래 vs 3-card 위 vs 3-card 사이) | Phase F |
| Q-D3 | `/chapters/` 목차에서 진도 표시 자리 잡기 (차기 사이클에서 채울 수 있도록) | Phase A |

---

## 13. 참고

- Plan: [`docs/01-plan/features/chapter-based-restructure.plan.md`](../../01-plan/features/chapter-based-restructure.plan.md)
- 원본 자료: `data/` 4개 markdown
- Next.js 15 App Router: https://nextjs.org/docs/app
