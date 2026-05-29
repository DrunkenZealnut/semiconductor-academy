# Design: reading-experience-ch1

> 폰트 조정 + Ch.1 본문 깊이 확장 — 컴포넌트·CSS·이미지 매핑 상세

**작성일**: 2026-05-29
**Feature**: `reading-experience-ch1`
**PDCA Phase**: Design
**Linked Plan**: [docs/01-plan/features/reading-experience-ch1.plan.md](../../01-plan/features/reading-experience-ch1.plan.md)
**Status**: Draft

---

## 0. Open Questions 결정 (Plan Q1~Q5)

| ID | 질문 | **결정** | 근거 |
|----|------|---------|------|
| Q1 | 폰트 토글 UI | **드롭다운 (Aa 아이콘)** | 3옵션 명시적, 모바일 friendly, 다크모드 토글과 일관 |
| Q2 | Lightbox | **자체 구현 (Dialog 기반)** | 패키지 의존성 회피, Tailwind와 통합 깔끔 |
| Q3 | 이미지 변환 | **jpeg 그대로 사용** | 이미 작은 사이즈, 변환 시간/복잡도 회피, Next Image unoptimized 그대로 |
| Q4 | 외부 이미지 | **Wikimedia Commons 2장** — 석면 광물 + DDT 살포 | CC-BY-SA, 가장 안정적 attribution |
| Q5 | Small 사이즈 | **16px** | 모바일 본문 최소 권장, 15는 너무 작음 |

---

## 1. 아키텍처

```
[기존 prose 컨테이너]
   ↓ 영향
[html.font-{sm|md|lg}] ← FontSizeToggle 클릭 → localStorage 저장
   ↓ CSS
[.font-md .prose { font-size: 18px }]
   ↓ 적용
모든 챕터·MDX 페이지의 .prose

[Ch.1 MDX 본문]
   ↓ 사용
<ImageFigure src="..." caption="..." source="..." />
   ↓ 클릭
<Lightbox> 자체 구현 — 다크 오버레이 + ESC 닫기
```

---

## 2. 폴더/파일 추가·변경

### 2.1 신규

```
src/components/layout/FontSizeToggle.tsx        ★ NEW
src/components/content/ImageFigure.tsx           ★ NEW
src/components/content/Lightbox.tsx              ★ NEW (ImageFigure 내부 사용)
public/source-images/ch1/                        ★ NEW 폴더
  ├── ch1-cover.jpg          (← _page_8_Figure_3.jpeg)
  ├── fig-1-1-risk-benefit.jpg   (← _page_10_Picture_0.jpeg)
  ├── fig-1-2-shield-saber.jpg   (← _page_13_Picture_1.jpeg)
  ├── fig-1-3-knowledge.jpg      (← _page_14_Figure_4.jpeg)
  ├── fig-1-4-research-history.jpg (← _page_15_Figure_3.jpeg)
  ├── wm-asbestos.jpg        (← Wikimedia)
  ├── wm-ddt-spraying.jpg    (← Wikimedia)
  └── _credits.json          (출처/라이선스 메타)
```

### 2.2 변경

```
src/styles/globals.css           — .font-sm/md/lg 클래스 추가
src/app/layout.tsx               — FOUC 방지 inline script + html에 기본 font-md
src/components/layout/Header.tsx — FontSizeToggle 통합
mdx-components.tsx               — ImageFigure 등록
src/content/chapters/01-risks-of-new-tech.mdx — 300줄+ 전면 재작성
src/app/about/page.mdx           — 이미지 출처·라이선스 정책 섹션 추가
```

---

## 3. 폰트 시스템 (Part A)

### 3.1 CSS — `src/styles/globals.css`

```css
/* font size classes — applied to <html> */
.font-sm .prose { font-size: 16px; line-height: 1.7; }
.font-md .prose { font-size: 18px; line-height: 1.75; }  /* default, 현재 prose-lg와 동일 */
.font-lg .prose { font-size: 21px; line-height: 1.8; }

/* Headings within prose scale proportionally */
.font-sm .prose h2 { font-size: 1.5em; }
.font-md .prose h2 { font-size: 1.5em; }
.font-lg .prose h2 { font-size: 1.5em; }
/* (em scale 유지하면 자동 비율 변환됨) */
```

> Tailwind `prose-lg` 클래스는 그대로 두고, 위 클래스가 font-size만 override.

### 3.2 `<html>` 기본 클래스 + FOUC 방지

`src/app/layout.tsx`:
```tsx
<html lang="ko" className="font-md" suppressHydrationWarning>
  <head>
    <script dangerouslySetInnerHTML={{ __html: `
      (function(){try{
        var s=localStorage.getItem('font-size')||'md';
        document.documentElement.classList.remove('font-sm','font-md','font-lg');
        document.documentElement.classList.add('font-'+s);
      }catch(e){}})();
    `}} />
  </head>
```

### 3.3 `<FontSizeToggle />` 컴포넌트

**Props**: 없음 (내부 상태만)

**구조**:
```tsx
'use client';

const SIZES = [
  { key: 'sm', label: '작게', px: 16 },
  { key: 'md', label: '보통', px: 18 },
  { key: 'lg', label: '크게', px: 21 },
] as const;

export function FontSizeToggle() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<'sm'|'md'|'lg'>('md');

  useEffect(() => {
    const stored = (localStorage.getItem('font-size') as 'sm'|'md'|'lg') ?? 'md';
    setCurrent(stored);
  }, []);

  const apply = (k: 'sm'|'md'|'lg') => {
    setCurrent(k);
    localStorage.setItem('font-size', k);
    const html = document.documentElement;
    html.classList.remove('font-sm', 'font-md', 'font-lg');
    html.classList.add('font-' + k);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button aria-label="글자 크기" onClick={() => setOpen(v => !v)} className="...">
        <span className="font-semibold">A<span className="text-xs">a</span></span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full mt-2 ...">
          {SIZES.map(s => (
            <button key={s.key} role="menuitem" onClick={() => apply(s.key)}
              className={current === s.key ? '... bg-brand-50' : '...'}>
              <span style={{ fontSize: s.px }}>{s.label}</span>
              <span className="text-xs text-slate-500">{s.px}px</span>
              {current === s.key && <Check className="size-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- 헤더에 ThemeToggle 옆에 배치
- 모바일에서도 동일 (햄버거 메뉴 안 또는 헤더 우측)

---

## 4. ImageFigure 컴포넌트 (Part B 기반)

### 4.1 `<ImageFigure />` Props

```typescript
interface ImageFigureProps {
  src: string;               // "/source-images/ch1/fig-1-2-shield-saber.jpg"
  alt: string;               // 접근성 alt
  caption?: string;          // 그림 1-2. 낡은 방패와 최신 광선검
  source?: string;           // 출처: 「반도체 산업의 유해인자」 p.20
  attribution?: string;      // CC-BY-SA 출처 (외부 이미지용)
  maxWidth?: number;         // 기본 600
}
```

### 4.2 시그니처

```tsx
'use client';

export function ImageFigure({ src, alt, caption, source, attribution, maxWidth = 600 }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <figure className="not-prose my-6 flex flex-col items-center">
      <button onClick={() => setOpen(true)} className="block rounded-lg overflow-hidden ring-1 ring-slate-200 hover:ring-brand-500">
        <img src={src} alt={alt} loading="lazy" style={{ maxWidth, width: '100%' }} />
      </button>
      {caption && (
        <figcaption className="mt-2 text-sm text-slate-600 dark:text-slate-400 text-center">
          {caption}
        </figcaption>
      )}
      {(source || attribution) && (
        <p className="mt-1 text-xs text-slate-500 italic">
          {source && <>출처: {source}</>}
          {attribution && <>{source ? ' · ' : ''}{attribution}</>}
        </p>
      )}
      {open && <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </figure>
  );
}
```

### 4.3 `<Lightbox />` 자체 구현

```tsx
'use client';

export function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
         onClick={onClose}>
      <button aria-label="닫기" onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30">
        <X className="size-5" />
      </button>
      <img src={src} alt={alt} className="max-h-[90vh] max-w-[90vw] object-contain" onClick={e => e.stopPropagation()} />
    </div>
  );
}
```

---

## 5. 이미지 자산 매핑

### 5.1 책 페이지 이미지 → public

| public 경로 | 원본 (data/) | 용도 |
|------------|------------|------|
| `/source-images/ch1/ch1-cover.jpg` | `_page_8_Figure_3.jpeg` | 1장 표지 |
| `/source-images/ch1/fig-1-1-risk-benefit.jpg` | `_page_10_Picture_0.jpeg` | 그림 1-1 이익과 위험 |
| `/source-images/ch1/fig-1-2-shield-saber.jpg` | `_page_13_Picture_1.jpeg` | 그림 1-2 낡은 방패 |
| `/source-images/ch1/fig-1-3-knowledge.jpg` | `_page_14_Figure_4.jpeg` | 그림 1-3 앎의 세계 |
| `/source-images/ch1/fig-1-4-research-history.jpg` | `_page_15_Figure_3.jpeg` | 그림 1-4 역학조사 역사 |

### 5.2 외부 이미지 (Wikimedia Commons)

| public 경로 | Wikimedia 소스 후보 | 라이선스 | 용도 |
|------------|-----------------|---------|------|
| `/source-images/ch1/wm-asbestos.jpg` | `Asbestos_with_muscovite.jpg` 또는 유사한 CC-BY-SA 이미지 | CC-BY-SA | 표 1-1 석면 항목 보조 |
| `/source-images/ch1/wm-ddt-spraying.jpg` | 미국 정부 1950년대 DDT 살포 사진 (Public Domain, USDA) | Public Domain | 표 1-1 DDT 항목 보조 |

> **Do 단계 진입 전**: WebFetch 또는 curl로 Wikimedia 페이지에서 이미지 URL 확인 후 다운로드. 실패 시 책 페이지 이미지만 사용하고 외부는 deferred로 기록.

### 5.3 `_credits.json` 구조

```json
[
  {
    "file": "ch1-cover.jpg",
    "type": "book-page",
    "source": "「반도체 산업의 유해인자」 표지 그림 (윤충식 외, 에피스테메)",
    "page": 9,
    "license": "Fair use (교육 목적 인용)"
  },
  {
    "file": "wm-asbestos.jpg",
    "type": "external",
    "source": "Wikimedia Commons",
    "url": "https://commons.wikimedia.org/wiki/File:...",
    "author": "...",
    "license": "CC-BY-SA 4.0"
  }
]
```

---

## 6. Ch.1 MDX 구조 (~300줄)

### 6.1 전체 흐름

```mdx
[Hero: LayeredExplain - Hook + Easy + Deep]

[ImageFigure ch1-cover.jpg]

## 1. 반도체 산업의 안전보건이 문제가 되는 이유

### 가. 역사적 경험에 따른 새 기술, 새 산업, 새 화학물질의 위험성
  [본문 도입 단락 — 책 흐름 재구성]

  [표 1-1]                              ← 책의 표 마크다운 재현
  | 도입 물질 | 효과 | 부작용 |
  | DDT | 말라리아 모기 퇴치 | 생태계 파괴 |
  | 농약 | 수확량 증가 | 동물·인간 악영향 |
  | 냉매 | 냉장고 가능 | 오존층 파괴 |
  | 석면 | 산업재 | 중피종/폐암/석면폐 |

  [ImageFigure fig-1-1-risk-benefit.jpg] ← 그림 1-1

  [ImageFigure wm-asbestos.jpg + wm-ddt-spraying.jpg]  ← 외부 보조 이미지

  [본문 단락 — 잠복기 설명]

  [SourceQuote page=10] ← 사전주의 원칙 핵심 1문단 인용

### 나. 반도체 산업의 위험성을 보는 시각
  [본문 — 4가지 특성]

  [ImageFigure fig-1-2-shield-saber.jpg] ← 그림 1-2

  [Callout warning] ← 핵심 강조

  [SourceQuote] ← 사전주의 원칙 1문단

## 2. 반도체 산업의 유해요인과 직업병에 대한 지식

### 가. 반도체 산업의 산업보건 지식의 한계
  [본문 — 경험론·앎의 세계]

  [ImageFigure fig-1-3-knowledge.jpg] ← 그림 1-3

  [표 1-2]
  | 구분 | 역사 | 접근성 | 집적기술 | 유해인자 정보 | 보건연구 | 위험성 |
  | 농업 | 긺 | 높음 | 낮음 | 알려짐 | 많음 | 알려짐 |
  | 전통 제조업 | 긺~중 | 높음~중 | 다양 | 알려짐 | 많음 | 알려짐 |
  | 서비스 | 중 | 높음 | 낮음 | 낮음 | 알려짐 | 알려짐 |
  | 반도체 | 짧음 | 낮음 | 매우 높음 | 잘 모름 | 제한적 | 모름 |

  [SourceQuote] ← 앎의 한계 1문단

### 나. 반도체 산업의 산업보건 위험성에 대한 인식
  [본문 — 1980년대 이후 인식 변화]

  [ImageFigure fig-1-4-research-history.jpg] ← 그림 1-4

  [표 1-3]
  | 분야 | 1992 | 1995 | 2000 | 2001 |
  | 제조업 전체(%) | 2.7 | 2.6 | 2.2 | 2.4 |
  | 전자부품(%) | 8.3 | 7.2 | 7.6 | 6.2 |
  | 반도체(%) | 8.7 | 9.3 | 7.7 | 8.5 |

  [본문 — 5가지 연구 범주]
  - 암 / 피부·안과 / 생식 / 근골격 / 스트레스

  [Callout] ← 명확히 입증된 질병 vs 증가 경향 질병

  [본문 — ITRS 2007 4가지 ESH 명제]

[ChapterRef order={2}] ← 다음 챕터
```

### 6.2 인용 정책 (R1 완화)

- **SourceQuote**는 **총 5개 이하**, 각 **150자 이내**
- 나머지 본문은 책 흐름을 따르되 **재구성** (직접 베끼지 않음)
- 표는 학술 표 fair use — 데이터 인용 정당함 (출처 표기 필수)

---

## 7. About 페이지 — 이미지 정책 섹션 추가

`src/app/about/page.mdx`에 추가:

```mdx
## 이미지 출처 및 라이선스

### 책 페이지 이미지
일부 챕터에 책 「반도체 산업의 유해인자」(윤충식 외, 에피스테메)의 표지·그림·표 이미지가
교육 목적의 정당한 인용 범위 내에서 사용되었습니다. 각 이미지에는 원본 페이지 번호가
표기되어 있습니다. 저작권은 원저자 및 출판사에 있습니다.

### 외부 이미지
일부 보조 이미지는 Wikimedia Commons의 Creative Commons 라이선스(CC-BY-SA) 또는
Public Domain 자료를 사용하였습니다. 각 이미지에는 출처와 저작자가 표기되어 있습니다.
```

---

## 8. 헤더 통합

`src/components/layout/Header.tsx`:
- 데스크톱 우측: `<FontSizeToggle />` `<ThemeToggle />` (순서)
- 모바일: ThemeToggle 옆에 FontSizeToggle 동일 위치

---

## 9. 구현 순서 (Do Phase 가이드)

| Step | 작업 | 시간 |
|------|------|------|
| 1 | `globals.css`에 .font-sm/md/lg 추가 + layout.tsx에 inline script + html className | 20m |
| 2 | `FontSizeToggle.tsx` + 헤더 통합 | 25m |
| 3 | `ImageFigure.tsx` + `Lightbox.tsx` + mdx-components 등록 | 30m |
| 4 | 이미지 자산 복사 (`cp data/.../jpeg → public/source-images/ch1/`) + 외부 다운로드 시도 + `_credits.json` | 30m |
| 5 | About 페이지 이미지 정책 섹션 추가 | 10m |
| 6 | Ch.1 MDX 재작성 (300줄, 표 3개, 그림 5~7장, SourceQuote 5개) | 60m |
| 7 | 빌드 검증 + git commit + push + Pages 배포 + live 200 확인 | 15m |
| **합계** | | **~3h** |

---

## 10. 빌드 영향

| 항목 | 이전 | 이후 |
|------|------|------|
| 정적 페이지 | 58 | 58 (라우트 변경 없음) |
| MDX 파일 | 31 | 31 (Ch.1만 분량 증가) |
| 공개 자산 | 5 | 12 (+7 이미지 + credits.json) |
| 컴포넌트 | 25 | 28 (+FontSizeToggle, ImageFigure, Lightbox) |

---

## 11. 미해결 결정 (Do에서 결정)

| ID | 질문 | 결정 시점 |
|----|------|----------|
| Q-D1 | Wikimedia 다운로드 실패 시 — 외부 이미지 생략 vs 다른 후보 시도 | Phase 4 |
| Q-D2 | Small 16px 적용 시 Tailwind prose 기본값과 충돌 — `!important` 필요 여부 | Phase 1 |
| Q-D3 | Lightbox 줌/팬 기능 — 이번 사이클 포함 vs 단순 표시 | Phase 3 |

---

## 12. 참고

- Plan: [`docs/01-plan/features/reading-experience-ch1.plan.md`](../../01-plan/features/reading-experience-ch1.plan.md)
- 원본 1장: `data/20260526_185841_..._-_13/*.md` (lines 248~395)
- 이미지: `data/20260526_185841_..._-_13/_page_*.jpeg`
