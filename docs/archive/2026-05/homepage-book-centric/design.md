# Design: homepage-book-centric

> 메인 페이지 책 중심 재편 — 컴포넌트 인터페이스, IA, 시각 토큰, 구현 순서 명세

**작성일**: 2026-05-29
**Feature**: `homepage-book-centric`
**PDCA Phase**: Design
**Linked Plan**: [plan.md](./plan.md)
**Status**: Draft

---

## 0. Open Questions 결정

| ID | 질문 | **결정** | 근거 |
|----|------|---------|------|
| Q1 | 신규 컴포넌트 개수 | **3개** (`BookHero`, `BookTOCPreview`, `SpecialSection`) | Plan §6.2 그대로 — 책임 분리 명확 |
| Q2 | 카테고리 카드 → /chapters/ 진입 방식 | **앵커 방식** `/chapters/#{category}` + `chapters/page.tsx` 카테고리 섹션에 `id` 추가 | URL 단순, 필터 상태 관리 불필요, SEO/SSR 친화적 |
| Q3 | ChaptersHero 처리 | **폐기** (BookTOCPreview가 기능 흡수) | 1줄 배너에서 4 카테고리 카드로 진화 — 중복 노출 방지 |
| Q4 | 특별 섹션 시각 토큰 | **카테고리 컬러 토큰과 일치** — 공정=emerald, 유해=amber | `CHAPTER_CATEGORY_COLOR`(src/lib/types.ts)와 일관 — 사이트 전체 통일 |
| Q5 | Hero의 CTA 우선순위 | **Primary: "책 처음부터 읽기" → /chapter/01-risks-of-new-tech/** + Secondary: "책 차례 보기" → /chapters/ | 정독러 동선 최우선, 둘러보기 옵션 보존 |
| Q6 | 부수 페이지(/start, /about) 노출 | **메인 푸터급 작은 링크 영역** (별도 섹션, 강조 최소) | 기존 동선 보존 + 책 정체성 강조 |
| Q7 | ProcessDiagram 위치 변경 영향 | **공정 특별 섹션 안으로 이동** — 컴포넌트 자체는 변경 없음 | 책의 공정 챕터(Ch.5~13)와 시각적 묶음, 인터랙티브 발견성은 섹션 라벨 칩으로 보강 |
| Q8 | 화학물질 검색 컴포넌트(`ChemicalSearch`) 노출 | **유해 특별 섹션 내부에서는 카드/CTA만 노출** — 검색 UI는 /chemicals/에 유지 | 메인은 진입 동선만, 실제 검색은 전용 페이지에서 |

---

## 1. 아키텍처

### 1.1 변경 범위 요약

| 종류 | 파일 | 변경 정도 |
|------|------|----------|
| 전면 재작성 | `src/app/page.tsx` | 100% (현재 ~135줄 → 신규 ~80줄, 컴포넌트 분리) |
| 신규 | `src/components/layout/BookHero.tsx` | new |
| 신규 | `src/components/layout/BookTOCPreview.tsx` | new |
| 신규 | `src/components/layout/SpecialSection.tsx` | new |
| 작은 수정 | `src/app/chapters/page.tsx` | 카테고리 `<section>`에 `id={cat}` 추가 |
| 폐기 | `src/components/chapter/ChaptersHero.tsx` | delete (BookTOCPreview가 흡수) |

신규 인프라/패키지/라우트 **0개**.

### 1.2 의존 컴포넌트 (재사용)

- `lucide-react` 아이콘: `BookOpen`, `ArrowRight`, `Sparkles`, `Compass`, `FlaskConical`, `Activity`, `Cpu`
- `next/link` Link
- 기존 `ProcessDiagram` (변경 없음 — 위치만 이동)
- `getOrderedChapters`, `getChaptersByCategory` from `@/lib/chapters`
- `CHAPTER_CATEGORY_LABELS`, `CHAPTER_CATEGORY_COLOR` from `@/lib/types`
- `buildMetadata` from `@/lib/seo` (메인 metadata 갱신)

---

## 2. 컴포넌트 인터페이스

### 2.1 `BookHero`

**파일**: `src/components/layout/BookHero.tsx`
**유형**: 서버 컴포넌트 (정적 메타데이터 직접 포함)

```typescript
// no props — 책 정체성은 단일이므로 하드코딩
export function BookHero(): JSX.Element;
```

**시각 구성**:

```
┌──────────────────────────────────────────────────┐
│  [BookOpen icon · brand-100 box]                 │
│                                                  │
│  ✏️ "책 한 권을 풀어드립니다"  (eyebrow, brand)   │
│                                                  │
│  반도체 산업의 유해인자                          │  ← h1, 4xl/5xl, bold
│  쉽게 풀어드려요                                  │  ← brand-600 강조
│                                                  │
│  「반도체 산업의 유해인자」 (학술서) 를            │
│  중·고등학생과 일반인 눈높이로 다시 풀어 썼어요.  │  ← lg slate-600
│                                                  │
│  저자: 윤충식·김승원·박동욱·정지연·최상준·       │  ← sm slate-500 (1줄)
│       하권철·함승헌 (총 7인)                     │
│                                                  │
│  [📖 책 처음부터 읽기] [책 차례 보기 →]           │  ← Primary/Secondary CTA
│                                                  │
│  17챕터 · 약 2시간 · 일러스트와 비유로 풀이      │  ← xs slate-500 메타
└──────────────────────────────────────────────────┘
```

**Primary CTA**: `/chapter/01-risks-of-new-tech/` (Ch.1)
**Secondary CTA**: `/chapters/`

**Tailwind 톤**:
- 컨테이너: `text-center` + `mx-auto max-w-3xl`
- eyebrow: `text-sm font-semibold uppercase tracking-wide text-brand-600`
- h1: `mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100`
- 슬로건 강조: `text-brand-600`
- 저자 줄: `mt-3 text-sm text-slate-500 dark:text-slate-500`
- 메타 줄: `mt-6 text-xs text-slate-500 dark:text-slate-500`

---

### 2.2 `BookTOCPreview`

**파일**: `src/components/layout/BookTOCPreview.tsx`
**유형**: 서버 컴포넌트 (`getChaptersByCategory` 호출)

```typescript
export function BookTOCPreview(): JSX.Element;
```

**구성**:

```
┌────────────────────────────────────────────────────┐
│  책 차례                                  보기 → │  ← 섹션 헤더
│  17챕터 · 4 카테고리 · 약 2시간                    │
└────────────────────────────────────────────────────┘
┌──────────┬──────────┬──────────┬──────────┐
│ 🏛 도입    │ ⚙ 공정   │ ⚠ 유해성  │ 💭 성찰   │
│ Ch.1~4    │ Ch.5~13   │ Ch.14~16  │ Ch.17     │
│ 4 챕터    │ 9 챕터    │ 3 챕터    │ 1 챕터    │
│ 반도체와  │ 9단계      │ 화학물질· │ 산업보건학 │
│ 클린룸의  │ 제조 공정 │ 전자파·   │ 시각의    │
│ 기초       │            │ 직업병    │ 결론      │
│              [보기 →]    │            │           │
└──────────┴──────────┴──────────┴──────────┘
```

**카드 데이터** (내부 상수):

```typescript
const CATEGORY_PREVIEW: Record<ChapterCategory, {
  emoji: string;
  label: string;     // "도입" / "공정" / "유해성" / "성찰"
  desc: string;      // 1줄 설명
  rangeText: string; // "Ch.1~4" 등
}> = {
  foundation: { emoji: '🏛', label: '도입',   desc: '반도체와 클린룸의 기초',  rangeText: 'Ch.1~4'  },
  process:    { emoji: '⚙', label: '공정',   desc: '9단계 제조 공정의 흐름', rangeText: 'Ch.5~13' },
  hazard:     { emoji: '⚠', label: '유해성', desc: '화학물질·전자파·직업병', rangeText: 'Ch.14~16'},
  reflection: { emoji: '💭', label: '성찰',   desc: '산업보건학 시각의 결론', rangeText: 'Ch.17'   },
};
```

**카드 색상**: `CHAPTER_CATEGORY_COLOR[cat]` 재사용
- `border-blue-500` (foundation)
- `border-emerald-500` (process)
- `border-amber-500` (hazard)
- `border-purple-500` (reflection)
- 카드 좌측에 `border-l-4` 강조 (ChapterCard 패턴과 일관)

**카드 진입**: `<Link href={`/chapters/#${cat}`}>` — `/chapters/` 페이지의 해당 카테고리 섹션으로 앵커 이동

**그리드**: `grid gap-4 md:grid-cols-2 lg:grid-cols-4`

---

### 2.3 `SpecialSection`

**파일**: `src/components/layout/SpecialSection.tsx`
**유형**: 클라이언트 컴포넌트 불필요 → 서버 컴포넌트

```typescript
interface SpecialSectionProps {
  tone: 'process' | 'hazard';       // 토큰 키
  emoji: string;                      // 큰 이모지 (⚙, ⚠ 등)
  eyebrow: string;                    // "특별 섹션 · 반도체 공정" 라벨 텍스트
  title: string;                      // h2 본문 제목
  description: string;                // 1~2줄 설명
  children: React.ReactNode;          // 섹션 본문 (ProcessDiagram, 카드 등)
  footerLinks?: Array<{
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

export function SpecialSection(props: SpecialSectionProps): JSX.Element;
```

**시각 구성**:

```
┌════════════════════════════════════════════════════┐
║  ┌─[✨ 특별 섹션]─┐         ⚙ (큰 이모지)         ║   ← 둥근 상단 모서리 + 강한 border
║  └──────────────┘                                  ║
║                                                    ║
║  공정 — 9단계 제조 흐름                            ║   ← h2, 2xl bold
║                                                    ║
║  책의 공정 챕터(Ch.5~13)를 인터랙티브 다이어그램으로 ║   ← slate-600
║  먼저 둘러보세요.                                  ║
║                                                    ║
║  ─── [children: ProcessDiagram 등] ───            ║
║                                                    ║
║  📚 공정 챕터 모아보기 →                            ║   ← footerLinks
║  🔬 공정 개요 페이지 →                              ║
╚════════════════════════════════════════════════════╝
```

**Tone 토큰 매핑** (`CHAPTER_CATEGORY_COLOR` 재사용 + 확장):

| tone | 컨테이너 배경 | 테두리 | 액센트 | eyebrow 칩 |
|------|-------------|-------|-------|-----------|
| `process` | `bg-emerald-50 dark:bg-emerald-950/30` | `border-emerald-200 dark:border-emerald-900` | `text-emerald-700 dark:text-emerald-300` | `bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200` |
| `hazard`  | `bg-amber-50 dark:bg-amber-950/30`     | `border-amber-200 dark:border-amber-900`     | `text-amber-700 dark:text-amber-300`     | `bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200` |

**구조 (JSX 골격)**:

```tsx
<section className={cn(
  'mt-16 overflow-hidden rounded-3xl border-2 px-6 py-10 sm:px-10 sm:py-12',
  TONE_CONTAINER[tone],
)}>
  <header className="flex items-start justify-between gap-4">
    <div>
      <div className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide', TONE_CHIP[tone])}>
        <Sparkles className="size-3" /> {eyebrow}
      </div>
      <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </div>
    <span aria-hidden className="text-5xl sm:text-6xl">{emoji}</span>
  </header>
  <div className="mt-8">{children}</div>
  {footerLinks && footerLinks.length > 0 && (
    <footer className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t pt-6 text-sm font-semibold">
      {footerLinks.map((f) => (
        <Link key={f.href} href={f.href} className={cn('inline-flex items-center gap-1.5', TONE_ACCENT[tone])}>
          {f.icon && <f.icon className="size-4" />}
          {f.label}
          <ArrowRight className="size-3" />
        </Link>
      ))}
    </footer>
  )}
</section>
```

---

## 3. 메인 페이지 (`src/app/page.tsx`) 신규 구조

```tsx
import { BookHero } from '@/components/layout/BookHero';
import { BookTOCPreview } from '@/components/layout/BookTOCPreview';
import { SpecialSection } from '@/components/layout/SpecialSection';
import { ProcessDiagram } from '@/components/process/ProcessDiagram';
import { FlaskConical, Activity, Compass, Info, Cpu } from 'lucide-react';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: '반도체 산업의 유해인자, 쉽게 풀어드려요',
  description: '학술서 「반도체 산업의 유해인자」(윤충식 외 7인)를 중·고등학생과 일반인 눈높이로 다시 풀어 썼어요. 17챕터, 9공정 다이어그램, 화학물질 사전 제공.',
});

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

      {/* [1] BookHero — 책 정체성 */}
      <BookHero />

      {/* [2] 책 차례 4 카테고리 미리보기 */}
      <BookTOCPreview />

      {/* [3] ⚙ 특별 섹션 — 반도체 공정 */}
      <SpecialSection
        tone="process"
        emoji="⚙"
        eyebrow="특별 섹션 · 반도체 공정"
        title="9단계 제조 공정 한눈에"
        description="책의 공정 챕터(Ch.5~13)를 인터랙티브 다이어그램으로 먼저 둘러보세요. 각 단계 카드를 누르면 해당 공정의 유해인자도 확인할 수 있어요."
        footerLinks={[
          { label: '공정 챕터 모아보기', href: '/chapters/#process', icon: Cpu },
          { label: '공정 개요 페이지', href: '/process-overview/', icon: Compass },
        ]}
      >
        <ProcessDiagram />
      </SpecialSection>

      {/* [4] ⚠ 특별 섹션 — 유해물질 & 직업병 */}
      <SpecialSection
        tone="hazard"
        emoji="⚠"
        eyebrow="특별 섹션 · 유해물질 · 직업병"
        title="화학물질부터 직업병까지"
        description="100여 가지 화학물질의 위험성과 반도체 산업에서 보고된 직업병 사례. 책의 Ch.14~16에서 다룬 학술 내용을 검색 가능한 형태로 제공합니다."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <HazardCard
            icon={FlaskConical}
            title="유해물질 사전"
            description="100여 가지 화학물질의 이름·위험성·쓰이는 공정을 검색."
            href="/chemicals/"
          />
          <HazardCard
            icon={Activity}
            title="직업병 이야기"
            description="반도체 산업에서 보고된 직업병 사례와 우리가 알아야 할 것들."
            href="/occupational-disease/"
          />
        </div>
      </SpecialSection>

      {/* [5] 푸터급 작은 링크 */}
      <FooterLinks />
    </div>
  );
}
```

**내부 보조 컴포넌트** (이 파일 내부 정의, 외부 export 없음):

- `HazardCard({ icon, title, description, href })` — 유해 섹션 안의 카드 (작은 흰 배경 카드)
- `FooterLinks()` — `/start/`, `/about/`, 원서 출처 안내를 한 줄로 나열

```tsx
function FooterLinks() {
  return (
    <section className="mt-16 border-t border-slate-200 pt-8 dark:border-slate-800">
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
        <li><Link href="/start/" className="hover:text-brand-600">학습 시작 가이드</Link></li>
        <li aria-hidden>·</li>
        <li><Link href="/about/" className="hover:text-brand-600">사이트 소개</Link></li>
        <li aria-hidden>·</li>
        <li className="inline-flex items-center gap-1 text-xs">
          <Info className="size-3" />
          원서: 윤충식 외 6인 共著「반도체 산업의 유해인자」(에피스테메)
        </li>
      </ul>
    </section>
  );
}
```

---

## 4. `src/app/chapters/page.tsx` 작은 수정

**목적**: BookTOCPreview의 카테고리 카드가 `/chapters/#process` 같은 앵커로 진입할 수 있게 `<section>`에 `id` 추가.

**Before** (line 46):
```tsx
<section key={cat}>
```

**After**:
```tsx
<section key={cat} id={cat} className="scroll-mt-24">
```

- `scroll-mt-24`: 사이트 헤더 높이 보정 (앵커 점프 시 헤더 가림 방지)

---

## 5. 폐기 처리: `ChaptersHero.tsx`

**조치**: 파일 삭제 (`src/components/chapter/ChaptersHero.tsx`)
- `src/app/page.tsx`가 유일한 import 지점이며 신규 page.tsx에서는 사용 안 함 → 즉시 삭제 안전
- 다른 파일 영향 점검: `grep -r "ChaptersHero"` 결과 page.tsx 외 없음을 Do 단계에서 재확인

---

## 6. 반응형 와이어프레임

### 6.1 데스크톱 (≥ 1024px)

```
[ BookHero — 중앙 정렬, 큰 타이포 ]
[ BookTOCPreview — 4 카드 가로 1줄 (lg:grid-cols-4) ]
[ SpecialSection process — ProcessDiagram 풀폭 ]
[ SpecialSection hazard — 2 카드 좌우 분할 ]
[ FooterLinks — 1줄 점 구분 ]
```

### 6.2 태블릿 (768~1023px)

```
[ BookHero — 중앙 정렬 ]
[ BookTOCPreview — 2x2 그리드 (md:grid-cols-2) ]
[ SpecialSection process — ProcessDiagram (내부 반응형) ]
[ SpecialSection hazard — 2 카드 가로 (sm:grid-cols-2) ]
[ FooterLinks — 2줄 wrap ]
```

### 6.3 모바일 (< 768px)

```
[ BookHero — h1 4xl, CTA 세로 2단 ]
[ BookTOCPreview — 1열 4 카드 세로 ]
[ SpecialSection process — px-6 py-10, ProcessDiagram (모바일 변형) ]
[ SpecialSection hazard — 1열 2 카드 세로 ]
[ FooterLinks — 다중 줄 wrap ]
```

**모바일 키 포인트**:
- BookHero CTA: `flex-col sm:flex-row gap-3` (Plan §6.1과 동일 패턴)
- SpecialSection 헤더의 큰 이모지: 모바일에서는 `text-5xl`, sm:`text-6xl`
- BookTOCPreview 카드 패딩: 모바일 `p-4`, sm:`p-5`

---

## 7. 접근성 (a11y)

| 요소 | 처리 |
|------|------|
| BookHero 책 아이콘 | `aria-hidden` (장식) |
| BookTOCPreview 이모지 | `aria-hidden` + 카테고리 라벨 텍스트로 대체 의미 전달 |
| SpecialSection 큰 이모지 | `aria-hidden` (장식, 텍스트 라벨이 의미 전달) |
| 특별 섹션 라벨 칩 | 시각만으로 구별되지 않도록 텍스트 "특별 섹션 · X" 포함 |
| Sparkles 아이콘 | `aria-hidden` |
| 카드 링크 | 텍스트 자체가 의미를 가지므로 별도 aria-label 불필요 |
| 색상 대비 | emerald-50/amber-50 배경 + slate-900 텍스트 = WCAG AA 통과 |
| 다크 모드 | 모든 색상 토큰에 `dark:` variant 명시 |

---

## 8. SEO

- `metadata.title`: "반도체 산업의 유해인자, 쉽게 풀어드려요" — 원서명을 메인 타이틀에 포함
- `metadata.description`: 원서명·저자·17챕터·9공정·화학물질 사전 키워드 포함 → 검색 엔진이 사이트 정체성 파악
- BookHero 안에 `<h1>` 단일 사용 (사이트 메인 h1 = 원서명 메인 슬로건)
- BookTOCPreview, SpecialSection은 `<h2>` 사용 → 자연스러운 outline

---

## 9. 구현 순서 (Do Phase 가이드)

1. **`src/components/layout/SpecialSection.tsx` 생성** — tone 토큰 매핑 상수 + JSX
2. **`src/components/layout/BookHero.tsx` 생성** — 정적 메타데이터 직접 포함
3. **`src/components/layout/BookTOCPreview.tsx` 생성** — `CATEGORY_PREVIEW` 상수 + 카드 그리드
4. **`src/app/chapters/page.tsx` 수정** — `<section>` 에 `id={cat}` + `scroll-mt-24` 추가
5. **`src/app/page.tsx` 전면 재작성** — 신규 컴포넌트 조립, `HazardCard`/`FooterLinks` 내부 정의, metadata 갱신
6. **`src/components/chapter/ChaptersHero.tsx` 삭제** — grep 재확인 후 제거
7. **빌드/dev 서버로 시각 확인** — 데스크톱 + 모바일 (375px) 반응형
8. **Lighthouse 측정** — 성능 ≥ 90, 접근성 ≥ 90 확인

**예상 소요**: ~1시간

---

## 10. 수용 기준 매핑

| AC (Plan §7) | 구현 위치 |
|--------------|----------|
| AC1 첫 화면 원서명 노출 | `BookHero` h1 |
| AC2 책 차례 진입 동선 두 번째 섹션 | `BookTOCPreview` (page.tsx 2번째) |
| AC3 공정 특별 섹션 시각 구별 | `SpecialSection tone="process"` (emerald 배경+테두리) |
| AC4 유해 특별 섹션 시각 구별 | `SpecialSection tone="hazard"` (amber 배경+테두리) |
| AC5 "특별 섹션" 라벨 칩 | `SpecialSection` eyebrow + Sparkles 아이콘 |
| AC6 모바일 375px 반응형 | §6.3 |
| AC7 Lighthouse ≥ 90 | §9 step 8 |
| AC8 기존 라우트 회귀 없음 | `/start/, /about/, /chemicals/, /occupational-disease/, /process-overview/, /chapters/, /chapter/*, /process/*` 모두 유지 |
| AC9 저자 7인 표기 | `BookHero` 저자 줄 + `FooterLinks` 푸터 |

---

## 11. 리스크 재점검

| 리스크 | Do 단계 대응 |
|--------|-------------|
| `chapters/page.tsx` 앵커 추가 후 카테고리 섹션 스크롤 위치가 헤더에 가려짐 | `scroll-mt-24` 유틸 적용으로 보정 |
| `ChaptersHero` 삭제 후 import 잔재 | Do step 6 전에 `grep -r "ChaptersHero" src/` 재확인 |
| 신규 토큰(emerald/amber 배경)이 다크 모드에서 너무 진함 | `bg-emerald-950/30` 같이 alpha 사용하여 톤다운 |
| 큰 이모지가 모바일에서 콘텐츠를 밀어냄 | header를 `flex items-start justify-between` + 이모지를 작게 (text-5xl) |

---

## 12. 다음 단계

1. `/pdca do homepage-book-centric` — 구현 시작 (§9 순서)
2. 구현 완료 후 `/pdca analyze homepage-book-centric` — Gap 분석
3. Gap < 90% 시 `/pdca iterate homepage-book-centric`

---

**참조 문서**:
- Plan: `docs/01-plan/features/homepage-book-centric.plan.md`
- 기존 메인: `src/app/page.tsx`
- 컬러 토큰: `src/lib/types.ts` (CHAPTER_CATEGORY_COLOR)
- 책 차례: `src/app/chapters/page.tsx`
