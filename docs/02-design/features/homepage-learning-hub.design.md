# Design — 메인페이지 멀티소스 학습 허브 재구성

> **Feature**: `homepage-learning-hub` · Plan: `docs/01-plan/features/homepage-learning-hub.plan.md`
> 확정안: **A안(학습 허브 재구성) · BookTOCPreview 제거 · 관점 축(원리→위험→안전→직무) · 네비 "자료원" 1항목** (사용자 승인 2026-07-14)
> 작업 브랜치: `feat/homepage-learning-hub` (Do 착수 시 생성)

---

## 1. 홈 구성 (최종)

```text
1. PlatformHero          (신규 — BookHero 대체)
2. SourcePicker          (유지 — id="sources" 부여, 문구 갱신, 관점 뱃지 추가)
3. LearningPathSection   (신규 — 관점 축 4경로)
4. SpecialSection(공정)   (유지 — 무수정)
5. SpecialSection(유해물질) (유지 — 무수정)
6. FooterLinks           (유지 — 4자료원 출처 표기로 갱신)
```

- `BookHero.tsx`·`BookTOCPreview.tsx`는 **사용처가 홈뿐임을 확인**(grep) → 컴포넌트 파일 **삭제**.
- 콘텐츠 페이지·라우트·데이터 산출물 무수정. 신규 라우트 0 (자료원 진입은 홈 앵커).

## 2. PlatformHero (신규 — `src/components/layout/PlatformHero.tsx`)

BookHero의 마크업 골격(중앙 정렬, 아이콘 박스, eyebrow, h1, 서브, CTA 2, 하단 지표)을 재사용하되 내용 교체:

| 요소 | 내용 |
|---|---|
| 아이콘 | `Layers` (4개 자료원 층위 상징) · brand 톤 유지 |
| eyebrow | "반도체 멀티소스 학습 플랫폼" |
| h1 | "반도체, 원리부터 직무까지" + 강조줄(brand) "네 가지 관점으로 배워요" |
| 서브 | "고교 교과서(원리) · 학술서(위험) · OSHA(안전) · NCS(직무) — 같은 반도체를 네 방향에서 비추면 전체가 보여요. 비유와 일러스트로 누구나 따라올 수 있습니다." |
| CTA(primary) | "자료원 둘러보기" → `#sources` 앵커 (아이콘 Library) |
| CTA(secondary) | "학습 시작 가이드" → `/start/` (아이콘 Compass) |
| 하단 지표 | "4개 자료원 · {N}개 학습 단위 · 전부 무료" — **N은 하드코딩 금지**, `SOURCES.reduce((n, s) => n + s.sections.length, 0)`로 파생(현재 116, 자료원 확장 시 자동 갱신 — Plan R-3 대응) |

- props 없음(자체 완결). 카피 톤은 기존 해요체 유지.
- 헤드라인 채택 근거: 후보 ①"반도체, 네 가지 관점으로 배우다"(문어체 — 사이트 톤과 이질) ②"반도체 학습의 모든 길이 여기에"(실체 없이 추상적) ③채택안(원리→직무 스펙트럼이 콘텐츠 실체를 그대로 서술 + 강조줄로 4관점 명시).

## 3. SourcePicker 갱신 (`src/components/sources/SourcePicker.tsx`)

1. `<section>`에 `id="sources"` + `scroll-mt-20`(sticky Header 높이 보정) 추가 — 히어로 CTA·Header 네비의 앵커 목적지.
2. 소개 문구 교체:
   - 헤딩 "어느 자료부터 살펴볼까요?" — 유지.
   - 설명: "국내 학술서와 OSHA 교육 프로그램 등…" → "고교 교과서·학술서·OSHA·NCS, 네 가지 자료원이 각각 원리·위험·안전·직무를 맡아요. 같은 주제를 여러 출처로 비교하며 깊이 있게 익혀보세요."
3. **관점 뱃지**: 카드 상단(SourceBadge lang 옆)에 관점 라벨 렌더. 소비자가 이 컴포넌트뿐이므로 로컬 상수:

```ts
const PERSPECTIVE: Record<string, string> = {
  'epi-semi-hazards': '위험 — 왜 위험한가',
  'osha-scs': '안전 — 어떻게 다루나',
  'ncs-semi': '직무 — 현장에서 무슨 일을',
  'daegu-hs-process': '원리 — 어떻게 동작하나',
};
```
   - 미등록 id는 뱃지 미표시(graceful). 카드 순서는 `Source.order` 그대로(코어 데이터 무수정).

## 4. LearningPathSection (신규 — `src/components/layout/LearningPathSection.tsx`)

관점 축 4단계를 **순서 있는 학습 동선**(1→4 흐름)으로 렌더. props 없음, 자체 상수:

| # | 관점 | 질문형 타이틀 | 목적지 | 테두리 색 |
|:-:|---|---|---|---|
| 1 | 원리 | "공정이 어떻게 돌아갈까?" | `/sources/daegu-hs-process/` | `SOURCE_ACCENT_BORDER.school` |
| 2 | 위험 | "무엇이 왜 위험할까?" | `/chapters/` | `SOURCE_ACCENT_BORDER.book` |
| 3 | 안전 | "어떻게 안전하게 다룰까?" | `/sources/osha-scs/` | `SOURCE_ACCENT_BORDER.osha` |
| 4 | 직무 | "현장에선 무슨 일을 할까?" | `/sources/ncs-semi/` | `SOURCE_ACCENT_BORDER.standard` |

- 각 카드: 단계 번호 + 질문 타이틀 + 한 줄 설명 + 자료원명(작게). `sm:grid-cols-2 lg:grid-cols-4`, 데스크톱에서 단계 사이 화살표(ChevronRight, `lg` 이상만).
- 색은 `@/components/sources/accent`의 `SOURCE_ACCENT_BORDER` **재사용**(simplify 사이클 산출물 — 새 색 정의 0).
- 섹션 헤딩: "이렇게 시작해 보세요" + 부제 "순서대로 읽으면 원리→위험→안전→직무로 이어지는 한 바퀴가 완성돼요. 물론 아무 데서나 시작해도 좋아요."

## 5. 전역 메타·네비·푸터

### 5.1 `src/lib/seo.ts`
```ts
const DEFAULT_DESCRIPTION =
  '학술서·OSHA·NCS·고교 교과서 4개 자료원으로 배우는 반도체 — 공정 원리부터 유해인자·안전·직무까지, 중·고등학생 눈높이로 풀어드려요.';
```

### 5.2 홈 metadata (`page.tsx`)
- `title` 인자 **제거** → 홈 타이틀 = SITE_NAME("반도체 아카데미") 단독(플랫폼 아이덴티티, R-2 대응: URL 불변이라 리스크 낮음).
- `description` = 새 DEFAULT_DESCRIPTION과 동일 취지의 홈 전용 문구(4자료원·수치 포함).

### 5.3 `Header.tsx`
- `navItems` 맨 앞에 `{ href: '/#sources', label: '자료원' }` 추가. 나머지 항목·구조 무수정.

### 5.4 `Footer.tsx` (전역) — Plan 범위 내 추가 발견(코드 대조)
- 소개문: "반도체 산업과 유해인자를 …" → "공정 원리부터 유해인자·안전·직무까지, 4개 자료원으로 배우는 반도체 학습 사이트."
- 하단 출처: 원서 1종 → 4개 자료원 표기: "원본 자료: 「반도체 산업의 유해인자」(윤충식 외) · OSHA Semiconductor Chemical Safety · NCS 반도체 학습모듈 · 「반도체 공정기초」(조우현·김준호, 렛유인)". "교육 목적 재구성" 고지 유지.

### 5.5 홈 `FooterLinks` (page.tsx 내부)
- 링크 3종 유지, 하단 원서 표기 1줄 → "4개 자료원으로 만든 학습 사이트 — 출처는 각 페이지와 사이트 소개에서" 로 교체(상세 표기는 전역 Footer·about가 전담, 중복 제거).

## 6. 삭제 목록

| 파일 | 근거 |
|---|---|
| `src/components/layout/BookHero.tsx` | 사용처 홈뿐(grep 확인), PlatformHero로 대체 |
| `src/components/layout/BookTOCPreview.tsx` | 사용처 홈뿐, §9-2 확정(홈에서 제거, /chapters/ 전담) |

## 7. 검증 계획

- `typecheck` + `lint` + `build` 무오류, **174페이지 SSG 전량 유지**(라우트 증감 0 — Plan의 "216페이지"는 오기, 실측 174).
- 콘텐츠 페이지 diff 0 (`git diff --stat`으로 홈·레이아웃·메타 외 무변경 확인).
- 잔여 문구 sweep: `grep -rn "책 한 권\|유해인자를 누구나" src/components/layout src/app/page.tsx src/lib/seo.ts` → 0건.
- 렌더 실측: 라이트/다크 · 모바일(375px)/데스크톱 · `#sources` 앵커 스크롤(Header 보정) · 네비 "자료원" 동작 · LearningPath 4카드 색 구분 · 책 콘텐츠 1클릭 접근(Header "책 차례" + 자료원 카드).

## 8. 구현 순서

1. `PlatformHero.tsx` + `LearningPathSection.tsx` 신규 (독립 컴포넌트 — 빌드 영향 0)
2. `page.tsx` 재배열(히어로 교체·TOC 제거·LearningPath 삽입) + metadata 갱신
3. `SourcePicker`(id·문구·뱃지) → `Header`(네비) → `seo.ts` → `Footer.tsx`·`FooterLinks`
4. `BookHero.tsx`·`BookTOCPreview.tsx` 삭제 → 검증 게이트(§7) + 렌더 실측
