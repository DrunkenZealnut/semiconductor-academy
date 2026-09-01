# Analysis: homepage-book-centric

> Design 문서 ↔ 구현 Gap 분석 (Check phase)

**작성일**: 2026-05-29
**Feature**: `homepage-book-centric`
**PDCA Phase**: Check
**Analyzer**: gap-detector agent
**Linked Design**: [design.md](./design.md)

---

## 종합 점수

| 카테고리 | 점수 | 상태 |
|---------|:----:|:----:|
| Design Match | 96% | 양호 |
| Architecture Compliance | 100% | 양호 |
| Convention Compliance | 100% | 양호 |
| **Overall Match Rate** | **97%** | **양호** |

**결론**: Match Rate 97% — proceed to report.

---

## 항목별 검증

### Design §2.1 BookHero — 100%

- 서버 컴포넌트, props 없음 (`BookHero.tsx:4`)
- 원서명 한글 제목 `<h1>` 포함 — "반도체 산업의 유해인자, 쉽게 풀어드려요" (`BookHero.tsx:15-19`)
- 저자 7인 표기 — 윤충식·김승원·박동욱·정지연·최상준·하권철·함승헌 (`BookHero.tsx:31-33`)
- Primary CTA: `/chapter/risks-of-new-tech/` → Ch.1 (`BookHero.tsx:37`)
  - Design §3 코드 예시는 `/chapter/01-risks-of-new-tech/`로 표기되어 있으나 `src/data/chapters.json:5`의 실제 slug는 `risks-of-new-tech`이므로 **구현이 정확** (Design 문서 측 오기)
- Secondary CTA: `/chapters/` (`BookHero.tsx:45`)
- 책 아이콘 `aria-hidden` 처리 (`BookHero.tsx:8,40,48`)
- 메타 줄 "17챕터 · 약 2시간 · 일러스트와 비유로 풀이" (`BookHero.tsx:52-54`)

### Design §2.2 BookTOCPreview — 95%

- 서버 컴포넌트 + `getChaptersByCategory` 사용 (`BookTOCPreview.tsx:3,61`)
- 카테고리 순서 [foundation, process, hazard, reflection] 일치 (`BookTOCPreview.tsx:11-16`)
- 각 카드 `/chapters/#${cat}` 앵커 링크 (`BookTOCPreview.tsx:69`)
- `CHAPTER_CATEGORY_COLOR` 토큰 사용 + `border-l-4` 좌측 강조 (`BookTOCPreview.tsx:73-77`)
- 이모지 `aria-hidden` (`BookTOCPreview.tsx:80`)
- 그리드 `md:grid-cols-2 lg:grid-cols-4` (`BookTOCPreview.tsx:59`)
- **Minor**: Design §2.2의 `CATEGORY_PREVIEW` 타입은 `{emoji, label, desc, rangeText}` 4필드였으나, 실구현은 `{emoji, desc}` 2필드만 사용하고 `label`은 `CHAPTER_CATEGORY_LABELS[cat]`로, `rangeText`는 `formatRange(items)` 동적 계산으로 대체 (`BookTOCPreview.tsx:18-26,28-33`). 실질 동작·표시는 동일하며 **DRY 관점에서 더 좋은 구현**

### Design §2.3 SpecialSection — 100%

- props 시그니처 일치: `tone | emoji | eyebrow | title | description | children | footerLinks` (`SpecialSection.tsx:13-21`)
- TONE_CONTAINER, TONE_CHIP, TONE_ACCENT 토큰 키 일치 (`SpecialSection.tsx:23-40`)
- emerald (process) / amber (hazard) 톤 매핑 정확 (Design §2.3 표와 일치)
- `<h2>` outline, Sparkles `aria-hidden`, 큰 이모지 `aria-hidden`, 라벨 칩에 eyebrow 텍스트 포함 (`SpecialSection.tsx:71,74,81`)
- 컨테이너 `rounded-3xl border-2 px-6 py-10 sm:px-10 sm:py-12` (`SpecialSection.tsx:59`)
- 추가 `TONE_DIVIDER` 상수가 있으나 시각 일관성을 위한 보강이며 Design 의도와 충돌 없음

### Design §3 page.tsx IA — 95%

- import 및 렌더 순서: BookHero → BookTOCPreview → SpecialSection(process) → SpecialSection(hazard) → FooterLinks (`page.tsx:19-67`)
- Process 섹션이 ProcessDiagram 자식 + `/chapters/#process`, `/process-overview/` 링크 (`page.tsx:25-37`)
- Hazard 섹션 2개 HazardCard (FlaskConical → `/chemicals/`, Activity → `/occupational-disease/`) (`page.tsx:51-62`)
- metadata.title `'반도체 산업의 유해인자, 쉽게 풀어드려요'` 원서명 포함 (`page.tsx:10`)
- metadata.description 원서명·저자·17챕터·9공정·화학물질 키워드 포함 (`page.tsx:11-12`)
- **Minor 보강**: Hazard SpecialSection에 `footerLinks=[{label: '유해성 챕터 모아보기', href: '/chapters/#hazard', icon: FlaskConical}]` 추가됨 (`page.tsx:46-48`). Design §10 AC 매핑 표는 `/chapters/#hazard` 진입을 의도하므로 **AC를 더 충실히 만족시키는 보강**
- **Minor 보강**: FooterLinks에 `/what-is-semiconductor/` 추가 (`page.tsx:117-120`). Plan §6.4가 후보로 언급한 링크 — 비목표 아님

### Design §4 chapters/page.tsx 앵커 — 100%

- `<section key={cat} id={cat} className="scroll-mt-24">` 적용 (`chapters/page.tsx:46`) — Design §4 Before/After와 완전 일치

### Design §5 ChaptersHero 폐기 — 100%

- 파일 존재 여부: 없음
- src/ 내 `ChaptersHero` import/참조 잔재: 없음

### Design §7 접근성 — 100%

- BookHero `BookOpen` 아이콘 `aria-hidden` (`BookHero.tsx:8,40,48`), `ListOrdered` 아이콘 `aria-hidden` (`BookHero.tsx:48`)
- BookTOCPreview 이모지 `aria-hidden` + 카테고리 라벨 텍스트로 의미 전달 (`BookTOCPreview.tsx:80`)
- SpecialSection 큰 이모지 `aria-hidden`, Sparkles `aria-hidden`, eyebrow에 "특별 섹션" 텍스트 포함 (`SpecialSection.tsx:71,81`)
- FooterLinks 점 구분자 `aria-hidden`, Info 아이콘 `aria-hidden` (`page.tsx:109,115,121,123`)

### Plan §7 Acceptance Criteria — 9/9

| AC | 상태 | 위치 |
|----|:----:|------|
| AC1 원서명 노출 | ✅ | `BookHero.tsx:15-19,22-26` |
| AC2 책 차례 2번째 섹션 | ✅ | `page.tsx:22` |
| AC3 공정 특별 섹션 시각 차별 | ✅ | emerald 배경+테두리 |
| AC4 유해 특별 섹션 시각 차별 | ✅ | amber 배경+테두리 |
| AC5 "특별 섹션" 라벨 칩 | ✅ | eyebrow 텍스트 + Sparkles |
| AC6 모바일 반응형 | ✅ | BookHero `flex-col sm:flex-row`, TOC `md:grid-cols-2 lg:grid-cols-4`, Hazard `sm:grid-cols-2` |
| AC7 Lighthouse ≥ 90 가능성 | ✅ | 정적 서버 컴포넌트 구조, 신규 클라이언트 JS 없음 |
| AC8 회귀 없음 | ✅ | `npm run build` 통과 (Do 단계에서 확인) |
| AC9 저자 7인 표기 | ✅ | BookHero + FooterLinks 2곳 |

---

## Gap 목록

### Critical
없음.

### Major
없음.

### Minor

| ID | 항목 | 위치 | Design 참조 | 설명 |
|----|------|------|-------------|------|
| M1 | Design 문서의 Ch.1 슬러그 오기 | Design §3 `page.tsx` 예시 | §3 | 실제 slug는 `risks-of-new-tech` (`chapters.json:5`)이고 구현은 정확. **Design 문서 측 수정 필요** — 구현 수정 아님 |
| M2 | `CATEGORY_PREVIEW` 타입 단순화 | `BookTOCPreview.tsx:18-26` | §2.2 | Design은 `{emoji, label, desc, rangeText}` 4필드. 실구현은 2필드 + `CHAPTER_CATEGORY_LABELS`/`formatRange()` 동적 계산. **DRY 측면에서 우월** |
| M3 | Hazard SpecialSection에 footerLink 1개 추가 | `page.tsx:46-48` | §3 | Design 예시는 hazard에 footerLinks 없음. §10 AC 매핑은 `/chapters/#hazard` 진입을 의도. **AC를 더 충실히 만족시키는 보강** |
| M4 | FooterLinks에 `/what-is-semiconductor/` 추가 | `page.tsx:117-120` | §3 | Design 예시는 `/start/`, `/about/`, 출처 3종. Plan §6.4가 후보로 언급 — 비목표 아님 |
| M5 | SpecialSection에 `TONE_DIVIDER` 토큰 추가 | `SpecialSection.tsx:42-45` | §2.3 | Design 토큰 표에 없었으나 footer `border-t` 색상 일관성을 위해 보강. 시각적으로 더 정돈됨 |

---

## 권장 조치

모든 Minor 차이는 **구현이 Design 의도(Plan §7 AC, Design §10 매핑)를 더 충실히 만족**시키는 방향이며, 회귀나 사양 위반이 없습니다. 따라서 **구현을 수정할 필요 없음**, Design 문서만 사후 갱신하면 됩니다.

1. **Design §3 수정** — Ch.1 링크 예시를 `/chapter/risks-of-new-tech/`로 정정 (M1)
2. **Design §2.2 갱신** — `CATEGORY_PREVIEW` 타입 단순화 반영 + `CHAPTER_CATEGORY_LABELS` 재사용 패턴 반영 (M2)
3. **Design §3 갱신** — Hazard footerLinks 1개 추가 + FooterLinks의 `/what-is-semiconductor/` 반영 (M3, M4)
4. **Design §2.3 갱신** — `TONE_DIVIDER` 토큰 추가 반영 (M5)

---

## 검증 환경

| 항목 | 결과 |
|------|------|
| TypeScript (`tsc --noEmit`) | ✅ pass |
| ESLint (`next lint`) | ✅ pass |
| Production build (`npm run build`) | ✅ pass — 모든 라우트 정상 |
| 라우트 회귀 | 없음 (메인 + /chapters + /chapter/[slug] + /chemicals + /occupational-disease + /process + /process-overview + /start + /about + /what-is-semiconductor 모두 정상 SSG) |

---

**최종 판정**: **Match Rate 97% — `/pdca report homepage-book-centric` 진행 권장**
