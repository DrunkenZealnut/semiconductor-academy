# Design — 메인페이지 재구성: 역할 진입 + 관점 카탈로그 통합

> **Feature**: `mainpage-restructure` · **작성일**: 2026-07-20 · **상위**: `docs/01-plan/features/mainpage-restructure.plan.md`
> **전제(진입 기준 §9-1)**: Plan은 진입 기준을 미확정 상태로 두었으나, 사용자가 `/pdca design`으로 진행함에 따라 **A안(학습자 유형별 역할 퀵-진입 + 관점 군집 하이브리드)** 을 확정 골격으로 채택한다. 이 전제가 틀리면 본 문서 전체가 재작업 대상 — 착수 전 확인 권장.
> **설계 방침**: 코드 대조 기반. 새 노출은 `SOURCES`에서 **파생**(자료원 추가 시 자동 반영). URL·콘텐츠·데이터 파이프라인 무수정.

---

## 1. 홈 구성 (최종)

| # | 섹션 | 컴포넌트 | 변경 |
|:-:|------|----------|------|
| 1 | 히어로 | `PlatformHero` | **수정** — 하드코딩 "4개 자료원" → 파생 수치 |
| 2 | 역할 퀵-진입 | `RoleQuickEntry` | **신규** — 목표별 pill → 관점 군집 앵커 스크롤 |
| 3 | 관점 카탈로그 | `PerspectiveCatalog` | **신규** — `SourcePicker`+`LearningPathSection` **흡수·통합** (`id="sources"` 승계) |
| 4 | 특별섹션·공정 | `SpecialSection`(process) | 유지 |
| 5 | 특별섹션·유해물질 | `SpecialSection`(hazard) | 유지 |
| 6 | 푸터 링크 | `FooterLinks`(page 내부) | 유지 |

- **핵심 변경**: 라우팅 역할이 겹치던 두 섹션(`SourcePicker` "어느 자료부터?" + `LearningPathSection` "이렇게 시작해")을 **관점축 카탈로그 1개로 통합**. 자료원 전체(11종)를 4관점으로 군집화해 전부 노출하면서 스크롤 길이는 축소.
- `#sources` 앵커는 `PlatformHero` CTA(`PlatformHero.tsx:34`)·`Header` 네비(`Header.tsx:12`)가 참조 → **`PerspectiveCatalog`가 `id="sources"`를 승계**(링크 무수정으로 보존).

---

## 2. 관점 축 = `accent` 필드 (설계 근거)

`Source.accent`(`'book' | 'osha' | 'standard' | 'school'`)가 4관점과 1:1 대응한다. `getOrderedSources()`를 accent로 군집화하면 자료원 추가 시 홈이 자동 반영된다(Plan FR-1·R-4).

| accent | 관점(라벨) | 앵커 id | 소속 자료원(2026-07-20) |
|--------|-----------|---------|------------------------|
| `school` | 원리 · 학교에서 배우는 그대로 | `cluster-principle` | 교과서 8종 |
| `book` | 위험 · 왜 위험한가 | `cluster-risk` | 학술서 1 |
| `osha` | 안전 · 어떻게 다루나 | `cluster-safety` | OSHA 1 |
| `standard` | 직무 · 현장에서 무슨 일을 | `cluster-job` | NCS 1 |

- 관점 라벨은 기존 `SourcePicker`의 `PERSPECTIVE`/`TEXTBOOK_PERSPECTIVE` 상수 문자열을 **재사용**(용어 일관성). 관점 단어(원리·위험·안전·직무)는 `PlatformHero` 히어로 카피와 통일.
- accent 미지정(`undefined`) 자료원은 `standard`로 폴백(기존 `SourcePicker` 로직과 동일).

---

## 3. `RoleQuickEntry` (신규 — `src/components/layout/RoleQuickEntry.tsx`)

**목적**: 첫 화면에서 "무엇을 하러 왔는가"(목표)를 관점 군집(§4) 앵커로 연결하는 얇은 스트립. **정적·서버 컴포넌트**(해시 앵커 링크, `'use client'`·개인화·상태 없음 → Plan R-2 해소).

```tsx
interface RoleEntry {
  goal: string;      // 사용자 목표 문구
  targetId: string;  // 관점 군집 앵커 id (§2)
  accent: NonNullable<Source['accent']>; // pill 색상 토큰
}

// 기본 매핑안 (문구는 확정 가능 — §9-1)
const ROLE_ENTRIES: RoleEntry[] = [
  { goal: '진로를 찾고 있어요',      targetId: 'cluster-job',       accent: 'standard' },
  { goal: '수업·발표에 쓸 자료',     targetId: 'cluster-principle', accent: 'school' },
  { goal: '안전하게 다루는 법',       targetId: 'cluster-safety',    accent: 'osha' },
  { goal: '왜 위험한지 알고 싶어요',  targetId: 'cluster-risk',      accent: 'book' },
];
```

- 렌더: 소제목("무엇부터 볼까요?") + pill 4개(가로 wrap). 각 pill = 순수 해시 앵커(`<Link href="#{targetId}">` 또는 `<a>` — 동일 페이지 해시라 기능 동일, 코드베이스 관행인 `next/link` 사용), accent 색은 `SOURCE_ACCENT_BORDER`(있으면) 또는 accent별 배경 토큰 재사용.
- 접근성: `<nav aria-label="목표별 바로가기">`, 각 앵커 대상 섹션에 `scroll-mt-20`(sticky Header 상쇄) + heading `id`.
- 4관점→4pill 1:1 매핑이라 관점 군집과 중복 우려 → **역할은 시스템 용어(원리/위험)가 아닌 사용자 목표 문구**로 재프레이밍해 차별화(§9-1에서 유지/축약 결정).

---

## 4. `PerspectiveCatalog` (신규 — `src/components/layout/PerspectiveCatalog.tsx`)

**목적**: `SourcePicker`(카드 렌더)와 `LearningPathSection`(관점 서사)을 하나로 통합. 4관점 그룹으로 자료원 전체를 노출하는 홈의 단일 카탈로그. **정적·서버 컴포넌트**.

**구조**:
```text
<section id="sources" aria-labelledby="catalog-heading" class="... scroll-mt-20">
  헤더: "무엇을 배울 수 있나요?" + "원리→위험→안전→직무, 네 관점으로 골라 보세요"
  for 관점 in [원리, 위험, 안전, 직무]:        // §2 순서(accent별 order 정렬)
    <div id={anchorId} class="scroll-mt-20">
      그룹 헤더: 관점 라벨 + 자료원 수 뱃지
      <ul> 소속 자료원 카드들 </ul>          // 원리=8장, 나머지=1장
```

- **자료원 카드**: 기존 `SourcePicker`의 standalone 카드 마크업(아이콘·accent 테두리·제목·subtitle·`{sections.length}개 섹션 · {attribution}`·"자료원 인덱스 열기" → `/sources/{id}/`)을 **그대로 재사용**. `SourceBadge`(lang) 유지.
- **원리 그룹(교과서 8종)**: 카드가 많으므로 `SourcePicker`의 교과서 그룹 컴팩트 카드 스타일(2열 grid) 재사용 → 8종 전부 1클릭 도달(Plan FR-2).
- **데이터 소스**: `getOrderedSources()` → accent로 group-by → §2 관점 순서로 렌더. 그룹 정의는 상수 배열(accent, label, anchorId)로 두어 순서·라벨 고정.
- **빈 그룹 방어**: 해당 accent 자료원이 0개면 그룹 미표시(현재는 4관점 모두 ≥1).

**props**: 없음(자체적으로 `getOrderedSources()` 조회) — 기존 `SourcePicker`와 동일 패턴.

---

## 5. `PlatformHero` 수정 (`src/components/layout/PlatformHero.tsx`)

- **유일 필수 수정 — 51행**:
  - before: `4개 자료원 · {TOTAL_UNITS}개 학습 단위 · 전부 무료`
  - after: `자료원 {SOURCE_COUNT}개 · {TOTAL_UNITS}개 학습 단위 · 전부 무료`
  - 추가: `const SOURCE_COUNT = SOURCES.length;` (이미 import된 `SOURCES` 사용, `TOTAL_UNITS`와 동일 파생 패턴)
- 헤드라인 "네 가지 관점으로 배워요"(19행)·본문 4관점 나열(25행)은 **유지**(관점=4는 사실). CTA "자료원 둘러보기" → `#sources`(통합 섹션) 그대로 동작.
- 회귀 방지: 홈에서 "N개 자료원" 형태 하드코딩 잔존 sweep(`grep -nE "[0-9]+개 자료원"`).

---

## 6. 삭제 / 대체 목록

| 파일 | 조치 | 근거 |
|------|------|------|
| `src/components/layout/LearningPathSection.tsx` | **삭제** | 홈 전용 사용(page.tsx만). 관점 서사는 `PerspectiveCatalog` 그룹 헤더로 흡수 |
| `src/components/sources/SourcePicker.tsx` | **삭제** | 홈 전용 사용. 카드 마크업·PERSPECTIVE 상수를 `PerspectiveCatalog`로 이전 |
| `src/app/page.tsx` | **수정** | import 교체(`RoleQuickEntry`·`PerspectiveCatalog`), 섹션 재배열 |

- `accent.ts`·`SourceBadge`·`SOURCE_CATEGORY_LABELS`·`SOURCE_KIND_UNIT_LABELS`는 `PerspectiveCatalog`가 계속 사용 → 유지.
- `types.ts:193` 주석("SourcePicker의 그룹 렌더")은 `PerspectiveCatalog`로 문구 갱신(무음 탈락 경고 유지).
- **삭제 전 확인**: Do 착수 시 `grep -rn "SourcePicker\|LearningPathSection" src/`로 잔여 참조 0 재확인(현재 page.tsx 외 없음).

---

## 7. 정적 export · 접근성 · 반응형

| 항목 | 설계 |
|------|------|
| 정적 export | 신규 컴포넌트 모두 서버 컴포넌트(순수 렌더·앵커). `'use client'` 불필요 |
| `#sources` 보존 | `PerspectiveCatalog`가 `id="sources"` 승계 → PlatformHero·Header 링크 무수정 |
| 앵커 스크롤 | 각 관점 그룹 `id` + `scroll-mt-20`(sticky Header 높이 상쇄) |
| 접근성 | `RoleQuickEntry` `<nav aria-label>`, 카탈로그 `aria-labelledby`, 그룹 heading 계층(h2→h3) |
| 다크·반응형 | 기존 카드 토큰·grid(`sm:grid-cols-2`) 재사용 → 기존 수준 유지 |
| accent 색 | `SOURCE_ACCENT_BORDER` 단일 소스 재사용(누락 시 typecheck 검출) |

---

## 8. 검증 계획

1. `npm run typecheck` · `npm run lint` · `npm run build` 무오류.
2. 빌드 후 SSG 페이지 수 = 변경 전과 동일(홈만 재구성, 라우트 불변).
3. 실측(라이트/다크·모바일):
   - 히어로 수치 "자료원 11개" 렌더(하드코딩 "4개" 소멸).
   - 관점 4그룹 렌더, **교과서 8종 전부 노출**.
   - RoleQuickEntry pill 클릭 → 해당 그룹으로 스크롤(Header에 안 가림).
   - PlatformHero "자료원 둘러보기"·Header "자료원" → `#sources` 정상 이동.
4. sweep: `grep -rnE "[0-9]+개 자료원" src/` = 파생값 외 0, `grep -rn "SourcePicker\|LearningPathSection" src/` = 0.
5. 책·OSHA·NCS 각 1클릭 접근 유지 확인(Plan FR-6).

---

## 9. 열린 결정 (Do 착수 전 확인)

1. **[핵심] 진입 기준(A안) 채택** — 본 문서 전제. 다른 안 원하면 재설계.
2. **카탈로그 통합 vs 분리** — 본 설계는 `SourcePicker`+`LearningPathSection`을 **1개로 통합**(권장: 중복·스크롤 최소). 대안: 관점 군집 + 전체 카탈로그 그리드 2섹션 유지(Plan A안 원문). → **통합안 권장**.
3. **RoleQuickEntry 유지/축약** — 4pill이 4관점 그룹과 1:1. 사용자 목표 문구로 차별화하나, 불필요 판단 시 생략(대안 B로 축소) 가능.
4. **역할 pill 문구·개수** — §3 기본 매핑안 확정 필요(Design 확정 사항).

## 10. 구현 순서 (Do)

1. **Do-1**: `PlatformHero` 수치 교정(독립·저위험, §5).
2. **Do-2**: `PerspectiveCatalog` 신규 — `SourcePicker` 카드·상수 이전 + accent 군집화(§4).
3. **Do-3**: `RoleQuickEntry` 신규 + 앵커 연결(§3).
4. **Do-4**: `page.tsx` 재배열, `LearningPathSection`·`SourcePicker` 삭제(§6).
5. **Do-5**: `types.ts` 주석 갱신 + 검증·sweep(§8).

→ 확인 후 `/pdca do mainpage-restructure` 또는 브랜치 `feat/mainpage-restructure`에서 구현 착수.
