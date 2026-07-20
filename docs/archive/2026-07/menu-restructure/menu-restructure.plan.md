# Plan — 헤더 메뉴 재구성: 자료원 순차 나열 + 공정 + 유해물질사전 + 검색

> **Feature**: `menu-restructure`
> **작성일**: 2026-07-19 · **Level**: Dynamic · **Cycle 유형**: 헤더 IA·네비게이션 재구성 (콘텐츠 신규 없음)
> **상속**: `homepage-learning-hub`(홈 IA·자료원 승격) · `hs-textbook-collection`(자료원 12개 확장 완료 상태)
> **권장 브랜치**: `feat/menu-restructure` (Do 착수 시 생성)

---

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem (문제)** | 헤더 네비는 **7개 항목(자료원·책 차례·공정·유해물질 사전·인용 검색·직업병·소개)** 이 병렬로 나열돼 있어, ①"자료원"이 `/#sources` 홈 앵커 하나로만 존재해 **12개 자료원 각각으로 헤더에서 직접 진입할 수 없고**, ②"책 차례"가 12개 자료원 중 1개(책)를 특권적으로 노출해 멀티소스 위계와 어긋나며, ③"인용 검색"·유해물질 사전 내부 검색·통합 검색이 분산돼 "검색"의 진입점이 모호하다. |
| **Solution (해법)** | 헤더를 사용자 요구대로 **4개 축 — 자료원(드롭다운으로 order 순 12개 나열) · 공정 · 유해물질 사전 · 검색** 으로 압축한다. 자료원은 이미 존재하는 `category`(독립 3 + `hs-textbook` 묶음 9) 구조를 그대로 드롭다운 그룹으로 재사용하고, 책 차례·직업병·소개는 자료원 드롭다운/기존 Footer(이미 링크 보유)로 흡수한다. |
| **Function·UX Effect (기능·UX 효과)** | 헤더에서 12개 자료원 어디로든 1~2클릭 도달, 자료원 간 위계가 order 순으로 균질화(책 특권 제거), "검색"이 단일 진입점으로 명확해진다. 헤더 항목 수 7 → 4로 감소해 모바일·데스크톱 모두 여백 확보. |
| **Core Value (핵심 가치)** | `homepage-learning-hub`에서 홈을 "멀티소스 학습 허브"로 전환한 것과 **동일한 아이덴티티를 헤더(전 페이지 상단 고정)에도 관철** — 어느 페이지에 있든 12개 자료원·공정·유해물질·검색이라는 사이트의 4대 축으로 즉시 이동 가능한 일관된 네비게이션. |

---

## 1. 배경 / 현재 상태

### 1.1 현재 헤더 (`src/components/layout/Header.tsx`, 87줄)

```ts
const navItems = [
  { href: '/#sources',              label: '자료원' },       // 홈 앵커 (자료원 섹션 스크롤)
  { href: '/chapters/',             label: '책 차례' },      // 책 1종 전용
  { href: '/process-overview/',     label: '공정' },
  { href: '/chemicals/',            label: '유해물질 사전' },
  { href: '/quotes/',               label: '인용 검색' },
  { href: '/occupational-disease/', label: '직업병' },
  { href: '/about/',                label: '소개' },
];
```
- 데스크톱: `navItems` 나열 + FontSizeToggle·ThemeToggle·LogoutButton.
- 모바일: 햄버거 토글 → 동일 `navItems` 세로 나열.

### 1.2 자료원 인벤토리 (`src/lib/sources.ts`, `SOURCES` 12개)

| order | id | title | category | 랜딩 |
|---|---|---|---|---|
| 1 | `epi-semi-hazards` | 반도체 산업의 유해인자 (학술서) | — (독립) | `/sources/epi-semi-hazards/` |
| 2 | `osha-scs` | OSHA Semiconductor Chemical Safety | — (독립) | `/sources/osha-scs/` |
| 3 | `ncs-semi` | NCS 반도체 학습모듈 | — (독립) | `/sources/ncs-semi/` |
| 4 | `hs-semicon-basics` | 반도체 기초 | `hs-textbook` | `/sources/hs-semicon-basics/` |
| 5 | `daegu-hs-process` | 반도체 공정기초 | `hs-textbook` | `/sources/daegu-hs-process/` |
| 6 | `hs-basic-tech-1` | 반도체기초기술 1 | `hs-textbook` | `/sources/hs-basic-tech-1/` |
| 7 | `hs-basic-tech-2` | 반도체기초기술 2 | `hs-textbook` | `/sources/hs-basic-tech-2/` |
| 8 | `hs-photo-etch` | 반도체 포토·에칭 | `hs-textbook` | `/sources/hs-photo-etch/` |
| 9 | `hs-thinfilm-diffusion` | 반도체 박막·확산 | `hs-textbook` | `/sources/hs-thinfilm-diffusion/` |
| 10 | `hs-assembly-inspection` | 반도체 조립·검사 | `hs-textbook` | `/sources/hs-assembly-inspection/` |
| 11 | `hs-equipment-maintenance` | 반도체 장비 유지 보수 | `hs-textbook` | `/sources/hs-equipment-maintenance/` |
| 12 | `hs-semicon-infra` | 반도체 인프라 일반 | `hs-textbook` | `/sources/hs-semicon-infra/` |

- **핵심 재사용 자산**: `getOrderedSources()`(order 정렬), `SOURCE_CATEGORY_LABELS['hs-textbook'] = '반도체 고등학교 교과서'`, `/sources/${id}/` 통일 랜딩. → 헤더 드롭다운을 **하드코딩 없이** 이 레지스트리에서 파생 가능.
- 독립 3 + `hs-textbook` 묶음 9 구조는 이미 `SourcePicker`(홈)가 동일하게 그룹 렌더 중 → 헤더도 같은 위계 재사용 시 UI 일관성 확보.

### 1.3 검색 현황 (분산)

| 진입점 | 파일 | 범위 | 엔진 |
|---|---|---|---|
| 인용 검색 `/quotes/` | `QuoteIndex.tsx` | 자료원 본문 인용(quotes.json) | 자체 필터 |
| 유해물질 사전 `/chemicals/` 내부 | `ChemicalSearch.tsx` | 화학물질 30종 | `lib/search.ts` Fuse.js |
| 통합 검색 | **없음** | — | — |

- "검색"이라는 단일 개념이 두 페이지(인용·유해물질)로 쪼개져 있고, 자료원·공정을 가로지르는 통합 검색은 부재.

### 1.4 기존 메뉴의 대체 경로 (이미 존재)

- **직업병·소개**: `Footer.tsx`가 이미 `/about/`·`/occupational-disease/`·`/what-is-semiconductor/` 링크 보유 → 헤더에서 빼도 접근성 유지.
- **책 차례 `/chapters/`**: 자료원 #1(책)의 상세(`/sources/epi-semi-hazards/`)로 도달 가능 → 자료원 드롭다운에 흡수.

---

## 2. 목표 / 비목표

### 목표
- 헤더 네비를 **자료원 · 공정 · 유해물질 사전 · 검색** 4축으로 재구성.
- 자료원을 **드롭다운으로 order 순 12개 나열**, `category` 그룹(독립 3 + 반도체 고등학교 교과서 9)으로 위계화.
- 자료원 드롭다운은 `getOrderedSources()`/`SOURCE_CATEGORY_LABELS`에서 파생 — 자료원 추가 시 헤더 자동 반영(하드코딩 금지).
- "검색" 단일 진입점 확보 (권장: 통합 검색 신규, §3 참조).
- 책 차례·직업병·소개를 자료원 드롭다운/Footer로 이관, 접근성 손실 0.
- 데스크톱·모바일(햄버거) 양쪽 반응형 유지, 키보드·스크린리더 접근성(드롭다운 `aria-expanded`/포커스 트랩) 준수.

### 비목표 (이번 사이클 제외)
- URL·라우팅 구조 변경 (기존 모든 경로 유지 — SEO·북마크 보존).
- 자료원 상세/콘텐츠 페이지(`/sources/*`, `/process/*`, `/chemicals/*`) 수정.
- 사이트명·로고 교체 ("반도체 아카데미" 유지).
- 홈(`page.tsx`)·`SourcePicker` 수정 (헤더 전용 사이클).
- **통합 검색의 고급 기능**(형태소 분석·하이라이트·페이지네이션) — MVP 이후로 유보.

---

## 3. 설계 — 권장안 + 대안

### 3.1 헤더 최종 구조 (권장)

```text
[반도체 아카데미]   자료원 ▾   공정   유해물질 사전   검색      [글자크기][테마][로그아웃]
                    │
                    ├─ 1. 반도체 산업의 유해인자        → /sources/epi-semi-hazards/
                    ├─ 2. OSHA Semiconductor Chem…     → /sources/osha-scs/
                    ├─ 3. NCS 반도체 학습모듈           → /sources/ncs-semi/
                    ├─ ── 반도체 고등학교 교과서 ──      (그룹 헤더, 비링크)
                    │   ├─ 4. 반도체 기초              → /sources/hs-semicon-basics/
                    │   ├─ 5. 반도체 공정기초           → /sources/daegu-hs-process/
                    │   └─ … 12. 반도체 인프라 일반     → /sources/hs-semicon-infra/
                    └─ (하단) 전체 자료원 보기          → /#sources
```

| 헤더 항목 | href | 비고 |
|---|---|---|
| 자료원 ▾ | 드롭다운 | `getOrderedSources()` 파생, category 그룹 |
| 공정 | `/process-overview/` | 유지 |
| 유해물질 사전 | `/chemicals/` | 유지 |
| 검색 | `/search/`(신규) 또는 `/quotes/`(잠정) | §3.3 |

### 3.2 자료원 드롭다운 — 대안 비교

| 안 | 방식 | 장점 | 단점 | 판정 |
|---|---|---|---|---|
| **A (권장)** | 헤더 "자료원 ▾" 드롭다운, category 그룹 렌더 | 12개 직접 진입·헤더 간결·레지스트리 파생 | 드롭다운 a11y 구현 필요 | ✅ |
| B | 헤더엔 "자료원" 링크 1개 → `/sources` 인덱스 페이지에서 12개 카드 | 구현 최소·모바일 단순 | 자료원 진입 2클릭·신규 페이지 필요 | 대안 |
| C | 헤더에 12개 평면 나열 | 클릭 최소 | 가로 넘침·모바일 파손 | ❌ |

> 잠정 채택: **A안**. (사용자 확인 대기 항목 — §7 미결 D1)

### 3.3 "검색" 범위 — 대안 비교

| 안 | 내용 | 범위 | 규모 | 판정 |
|---|---|---|---|---|
| **S1 (권장)** | `/search/` 통합 검색 신규 — 인용(quotes)+유해물질(chemicals) 통합 인덱스 | 넓음 | 中 | ✅ 방향 |
| S2 | 헤더 "검색" → 기존 `/quotes/` 인용 검색 연결 (라벨만 변경) | 인용 한정 | 小 | MVP 대체 |
| S3 | 헤더 "검색" → `/chemicals/` 유해물질 검색 | 물질 한정 | 小 | 유해물질 사전과 중복 |

> **단계적 접근 권장**: MVP는 **S2(기존 quotes를 "검색"으로 노출)** 로 헤더 4축을 먼저 완성 → 후속 사이클에서 **S1(통합 검색 `/search/`)** 로 승격. 통합 검색은 별도 feature(`unified-search`)로 분리 가능. (사용자 확인 대기 — §7 미결 D2)

---

## 4. 구현 범위 (영향 파일)

| 파일 | 변경 | 규모 |
|---|---|---|
| `src/components/layout/Header.tsx` | navItems 4축 재구성 + 자료원 드롭다운 컴포넌트화 (데스크톱 hover/click, 모바일 accordion) | 중 |
| `src/components/layout/SourcesDropdown.tsx` (신규) | `getOrderedSources()`·`SOURCE_CATEGORY_LABELS` 파생, a11y(`aria-expanded`, ESC/포커스) | 중 |
| `src/app/search/page.tsx` (S1 채택 시 신규) | 통합 검색 UI — 후속 사이클 가능 | (유보) |
| `src/components/layout/Footer.tsx` | 직업병·소개 이미 존재, 필요 시 "책 차례" 보강 확인만 | 소 |
| `src/lib/sources.ts` | 변경 없음 (읽기 전용 재사용) | — |

- 신규 의존성: 없음 (드롭다운은 기존 `lucide-react`·Tailwind·`cn`으로 구현).

---

## 5. 수용 기준 (Acceptance Criteria)

- [ ] 헤더 데스크톱/모바일에 **자료원 · 공정 · 유해물질 사전 · 검색** 4축만 노출.
- [ ] "자료원 ▾" 클릭/호버 시 12개가 **order 순**으로, 독립 3 + `반도체 고등학교 교과서` 묶음 9 그룹으로 표시.
- [ ] 각 자료원 항목이 `/sources/{id}/`로 정확히 이동.
- [ ] 드롭다운이 하드코딩 아닌 `SOURCES` 레지스트리 파생 (자료원 13번째 추가 시 코드 수정 없이 반영).
- [ ] "검색" 클릭 시 검색 페이지 도달(MVP: `/quotes/`, S1 채택 시 `/search/`).
- [ ] 직업병·소개·책 차례가 Footer 또는 자료원 드롭다운으로 도달 가능(접근성 손실 0).
- [ ] 키보드(Tab/Enter/ESC)·스크린리더로 드롭다운 조작 가능, `aria-expanded` 반영.
- [ ] `npm run typecheck` · `npm run lint` · `npm run build` 통과.

---

## 6. 리스크 / 완화

| 리스크 | 영향 | 완화 |
|---|---|---|
| 드롭다운 12개 세로 길이 → 모바일 스크롤 과다 | 중 | category 그룹 접기(교과서 9개 accordion) 또는 그룹 헤더로 시각 분할 |
| 정적 export(`output: 'export'`)에서 드롭다운 클라이언트 상태 | 낮 | Header 이미 `'use client'` — `useState` 재사용, SSR 이슈 없음 |
| "책 차례" 제거로 기존 사용자 동선 단절 | 낮 | 자료원 #1(책) 드롭다운 + Footer 링크로 대체, 리다이렉트 불요(URL 유지) |
| 통합 검색(S1) 범위 과대 → 사이클 지연 | 중 | MVP를 S2로 분리, S1은 별도 feature로 후속 |
| basePath(`NEXT_PUBLIC_BASE_PATH`) 누락 링크 | 낮 | `next/link` 상대경로 사용(기존 패턴 준수), 하드 URL 금지 |

---

## 7. 미결 / 확인 필요 (Do 착수 전)

| ID | 항목 | 잠정 결정 | 확정 필요 |
|---|---|---|---|
| D1 | 자료원 나열 방식 | A안(드롭다운, category 그룹) | 사용자 확인 |
| D2 | "검색" 범위 | MVP=S2(기존 quotes), 후속=S1(통합 `/search/`) | 사용자 확인 |
| D3 | 기존 메뉴 처리 | 책 차례→자료원 흡수 / 직업병·소개→Footer(기존) | 사용자 확인 |
| D4 | 드롭다운 트리거 | 데스크톱 hover+click 병행, 모바일 accordion | Design에서 확정 |

> D1~D3은 §"AskUserQuestion" 응답 대기 중 잠정값. 응답 시 본 문서 반영 후 Design 진행.

---

## 8. 다음 단계

1. **미결 D1~D3 확정** (`/pdca plan` 재확인 또는 사용자 회신).
2. `/pdca design menu-restructure` — 드롭다운 컴포넌트 구조·a11y·반응형·검색 라우팅 상세 설계.
3. `/pdca do menu-restructure` — `feat/menu-restructure` 브랜치에서 구현.
4. `/pdca analyze` → Gap 분석 → 90%+ 시 `/pdca report`.

---

_본 Plan은 `homepage-learning-hub`(홈 IA 재구성)의 헤더 후속편이다. 홈은 자료원 승격을 완료했고, 본 사이클은 그 아이덴티티를 전역 헤더로 확장한다._
