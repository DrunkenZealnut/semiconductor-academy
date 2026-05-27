# Plan: chapter-based-restructure

> 책 전체 17개 챕터를 사이트의 메인 IA로 재구성. 기존 공정/사전 페이지는 보조 탐색 채널로 병행.

**작성일**: 2026-05-27
**Feature**: `chapter-based-restructure`
**PDCA Phase**: Plan
**Level**: Dynamic
**Status**: Draft

---

## Executive Summary

### 1.1 프로젝트 개요

| 항목 | 내용 |
|------|------|
| Feature | 책 전체 17개 챕터의 사이트 IA 재구성 |
| 시작일 | 2026-05-27 |
| 예상 완료 | 2026-05-28 (집중 작업 시 ~6~8시간) |
| 예상 공수 | 챕터 메타·라우팅 1h + MDX 17개 4~5h + 목차/진도 UI 1~2h + QA/배포 1h |

### 1.2 결과 요약 (목표 지표)

| 지표 | 목표 |
|------|------|
| 챕터 페이지 | **17개** (`/chapter/[N-slug]/`) |
| 챕터 목차 페이지 | **1개** (`/chapters/`) |
| 챕터 메타 데이터 | 1 JSON (`chapters.json`) |
| 챕터 MDX 본문 | 17개 (각 600~1500자) |
| prev/next nav | 17개 모두 |
| 기존 라우트 유지 | `/process/*`, `/chemicals/*` 그대로 |
| Match Rate 목표 | ≥ 90% |

### 1.3 Value Delivered (4-Perspective)

| 관점 | 내용 |
|------|------|
| **Problem (문제)** | 현재 사이트는 공정·사전 중심 IA라 책의 흐름(목차)으로 학습하고 싶은 사용자가 어디부터 읽어야 할지 막막. 첫 챕터(새 기술의 위험성)·마지막 챕터(산업보건학적 시각) 같은 책의 핵심 reflection이 사이트에 충분히 노출되지 않음. |
| **Solution (해결)** | **챕터 메인 + 공정·사전 병행** IA. `/chapters/`에서 책 목차처럼 17챕터 한눈에 보고, 차례대로 읽거나 관심 챕터로 점프. 동시에 `/process/*` 다이어그램과 `/chemicals/*` 검색은 탐색 entry로 유지 — 같은 콘텐츠를 3가지 각도(책·공정·물질)로 접근. |
| **Function UX Effect (기능 효과)** | (1) 책의 흐름대로 chapters → prev/next로 자연스러운 학습 (2) 학술적 무게가 큰 4·14·15·16·17장이 다른 챕터와 동등 시각 무게로 노출 (3) 챕터 진도 localStorage 트래킹 (옵션) (4) 검색·공정·책 세 가지 entry가 같은 데이터를 가리킴 — 학습자가 자신에게 맞는 진입 방식 선택 가능. |
| **Core Value (핵심 가치)** | **책으로서의 사이트** — 단순 reference가 아니라 처음부터 끝까지 읽을 수 있는 디지털 도서. "쉽게 풀어드린" 학술서를 책 그대로의 흐름으로 학습하면서도, 디지털 매체의 검색·탐색 이점은 모두 누림. |

---

## 2. 배경

### 2.1 현재 상태

- 사이트는 9공정 다이어그램과 24~31개 화학물질 사전 중심
- 일부 챕터는 `/cleanroom/`, `/electromagnetic/`, `/occupational-disease/` 같은 정적 페이지로 존재하지만 "책의 한 챕터"라는 메타데이터 없음
- 책 마무리 reflection 챕터(17장 "신공정/신기술/새 화학물질 사용… 산업보건학적 시각")는 미반영

### 2.2 새 데이터 (사용자 추가)

`data/` 폴더의 4개 markdown 파일에 책 전체 17개 챕터가 들어있음:

| 파일 | 라인 | 커버 챕터 |
|------|------|---------|
| `_-_13` | 690 | 머리말 + 1, 2장 |
| `_-_47` | 742 | 3, 4, 5, 6, 7장 |
| `_-811` | 1,445 | 8, 9, 10, 11장 |
| `_-_toend` | 1,796 | 12, 13, 14, 15, 16, 17장 |
| **총** | **4,673줄** | **17개 챕터 전체** |

### 2.3 왜 챕터 IA를 추가하나

- 책의 학술적 흐름이 사이트의 탐색 흐름과 분리됨 → 책을 읽는 사람과 사이트를 둘러보는 사람의 경험 격차
- 1장 "새 기술의 위험성"이 책에서 가장 강력한 도입부인데 사이트에서는 5번째 메뉴
- 17장 "산업보건학적 시각" reflection은 사이트의 "결론" 같은 핵심인데 미반영
- 챕터 IA를 메인으로 두면 책 그 자체로 학습 가능, 공정/사전은 보조 채널

---

## 3. 목표 & 비목표

### 3.1 목표

- [G1] 17개 챕터 페이지 모두 생성 (`/chapter/[N-slug]/`)
- [G2] `/chapters/` 목차 페이지 (책 표지처럼 + 챕터 카드)
- [G3] 각 챕터에 prev/next + "목차로" 네비게이션
- [G4] 챕터별 sourcePages (원본 페이지 범위), readingTime, summary 메타 포함
- [G5] 기존 `/process/*`, `/chemicals/*`, `/cleanroom/` 등 모두 유지
- [G6] 홈에서 챕터 IA를 4번째 entry point로 추가 (현재 3-card에 "책 차례 보기" 추가하거나 별도 섹션)
- [G7] 챕터 본문은 책 원문을 비유/일러스트로 풀되, 학술 정확성 유지 + 출처 명시

### 3.2 비목표 (이번 사이클 제외)

- 챕터 진도 트래킹 — 옵션, 가능하면 localStorage 기반 가벼운 표시만
- 챕터 내 검색 — 글로벌 검색은 차기 사이클
- 학습 인증서 / 진도율 게이미피케이션
- 챕터별 인쇄 / PDF export
- 책 표지 / 저자 사진 이미지 — 텍스트 위주
- 챕터 댓글 / 학습자 노트
- 챕터 5~13의 기존 `/process/*` 페이지 흡수 — 챕터에서 link로 안내, 흡수는 별도 결정

---

## 4. 17개 챕터 매핑

| # | 챕터명 | 슬러그 | 원본 페이지 | 기존 사이트 매핑 | 상태 |
|---|--------|--------|-----------|---------------|------|
| 1 | 새 기술, 새 공정, 새 화학물질 사용의 위험성 | `risks-of-new-tech` | 15~26 | `/risks-of-new-tech/` | **재구성 + 챕터 메타 추가** |
| 2 | 반도체의 이해 | `semiconductor` | 27~43 | `/what-is-semiconductor/` | 재구성 |
| 3 | 반도체 제조 공정의 전반적 이해 | `process-overview` | 45~54 | `/process-overview/` | 재구성 |
| 4 | 클린룸과 유해인자 | `cleanroom` | 55~65 | `/cleanroom/` | 재구성 |
| 5 | 웨이퍼 제조 공정과 유해인자 | `wafer` | 67~83 | `/process/wafer/` | **링크 안내** |
| 6 | 클리닝 공정과 유해인자 | `cleaning` | 85~99 | `/process/cleaning/` | 링크 안내 |
| 7 | 확산 공정과 유해인자 | `diffusion` | 101~110 | `/process/diffusion/` | 링크 안내 |
| 8 | 포토리소그래피 공정과 유해인자 | `photolithography` | 111~157 | `/process/photolithography/` | 링크 안내 |
| 9 | 식각 공정과 유해인자 | `etching` | 159~181 | `/process/etching/` | 링크 안내 |
| 10 | 증착 공정과 유해인자 | `deposition` | 183~193 | `/process/deposition/` | 링크 안내 |
| 11 | 이온 주입과 유해인자 | `ion-implantation` | 195~205 | `/process/ion-implantation/` | 링크 안내 |
| 12 | 물리 화학적 연마와 유해인자 | `cmp` | 207~215 | `/process/cmp/` | 링크 안내 |
| 13 | 칩 조립 및 검사 공정과 유해인자 | `packaging` | 217~261 | `/process/packaging/` | **링크 + 더 깊은 본문** |
| 14 | 반도체 공정에서의 화학물질 사용과 유해성 | `chemicals-usage` | 263~281 | `/chemicals/` (사전) + 신규 chapter 페이지 | **신규 (사전과 별도)** |
| 15 | 반도체 공정과 전자파 | `electromagnetic` | 283~303 | `/electromagnetic/` | 재구성 (확장) |
| 16 | 반도체 공정 주요 질병 위험 고찰 | `occupational-disease` | 305~317 | `/occupational-disease/` | 재구성 (확장) |
| 17 | 산업보건학적 시각에서 바라본 반도체 산업 | `industrial-health-view` | 319~끝 | **없음** | **신규** |

**5~13장(공정 챕터)의 접근**: 챕터 페이지는 짧은 도입(원본 페이지 인용 + 핵심 메시지)만 두고, "**자세한 내용 →**" 링크로 기존 `/process/[slug]/` 페이지로 보냄. 콘텐츠 중복 회피 + 양쪽 entry point 모두 동작.

---

## 5. 사용자 시나리오

| ID | 페르소나 | 시나리오 |
|----|---------|----------|
| US-1 | 책을 처음부터 읽고 싶은 시민 | `/chapters/` → 1장부터 읽기 시작 → prev/next로 17장까지 |
| US-2 | 17장만 보고 싶은 산업보건 연구자 | `/chapters/` → 17장 카드 클릭 → 사이트의 "결론" reflection 읽기 |
| US-3 | 자녀가 일하는 8장 포토리소그래피만 깊이 알고 싶은 가족 | `/chapters/8-photolithography/` → 챕터 본문 → "자세한 공정 →" 링크 → `/process/photolithography/` |
| US-4 | 벤젠이 어느 챕터에 나오는지 궁금한 NGO | `/chemicals/benzene/` → "이 공정에서 쓰여요" 카드 → `/process/photolithography/` → 챕터 8 |
| US-5 | 14장 화학물질 사용 표만 확인하고 싶은 노동자 | `/chapter/14-chemicals-usage/` → 표 7-3, 표 14-4 등 노출기준표 확인 |

---

## 6. 콘텐츠 재구성 전략

### 6.1 챕터 페이지 구조 (각 챕터 공통 레이아웃)

```
┌─────────────────────────────────────────────┐
│ < 책 차례로 돌아가기                          │
│                                             │
│ Chapter N                                   │
│ 새 기술, 새 공정, 새 화학물질 사용의 위험성    │ ← 큰 제목
│ 원본 p.15~26 · 약 8분 소요                  │ ← 메타
├─────────────────────────────────────────────┤
│ Hook 문장 (한 줄, 강조)                      │
├─────────────────────────────────────────────┤
│ 비유 + 일러스트                              │
├─────────────────────────────────────────────┤
│ 챕터 본문 (h2/h3 + 표 + Callout + Term...)  │
│                                             │
│ <ChemicalCard id="..." />                  │
│ <SourceQuote page={N}>...</SourceQuote>    │
├─────────────────────────────────────────────┤
│ 관련 자료 (옵션):                            │
│ - 공정 다이어그램 →                          │
│ - 유해물질 사전 검색 →                       │
├─────────────────────────────────────────────┤
│ ← 챕터 N-1     │  목차로  │     챕터 N+1 →  │
└─────────────────────────────────────────────┘
```

### 6.2 챕터별 콘텐츠 분량

| 챕터 | 분량 정책 |
|------|----------|
| 1, 2, 3, 4, 14, 15, 16, 17 (학술 reflection) | **풀 본문** (1500~3000자) |
| 5~13 (공정) | **도입부 + 링크** (300~600자) — 본문은 `/process/[slug]/`로 위임 |

### 6.3 비유 우선 원칙 (유지)

- 모든 어려운 개념에 비유 + 인라인 용어 툴팁
- 학술 원문은 `<SourceQuote>` 토글로 분리

---

## 7. 데이터 모델

### 7.1 `src/data/chapters.json` (신규)

```typescript
export interface Chapter {
  id: string;              // "1-risks-of-new-tech"
  order: number;           // 1~17
  slug: string;            // URL용 (e.g. "risks-of-new-tech")
  title: string;           // "새 기술, 새 공정, 새 화학물질 사용의 위험성"
  shortTitle?: string;     // 목차에서 짧게 (e.g. "새 기술의 위험성")
  subtitle?: string;       // 1줄 hook
  category: 'foundation' | 'process' | 'hazard' | 'reflection';
  sourcePages: [number, number];
  readingTime: number;     // 분
  hasFullBody: boolean;    // true면 풀 MDX, false면 도입 + 외부 링크
  externalLink?: string;   // hasFullBody=false일 때 (e.g. "/process/wafer/")
  relatedProcessIds?: ProcessId[];
  relatedChemicalIds?: string[];
}
```

### 7.2 `src/content/chapters/[N-slug].mdx` 파일

- 모든 챕터: `src/content/chapters/01-risks-of-new-tech.mdx` 등 (zero-padded for sort)
- 풀 본문 챕터(1, 2, 3, 4, 14, 15, 16, 17): MDX 풍부한 본문
- 공정 챕터(5~13): 짧은 도입 + 링크

### 7.3 라우팅 (Next.js App Router)

```
src/app/chapters/page.tsx                  /chapters/  (목차)
src/app/chapter/[slug]/page.tsx            /chapter/[slug]/  (동적 라우팅)
src/lib/chaptersMdx.tsx                    슬러그 → 동적 import 매핑
```

`generateStaticParams`로 17개 페이지 모두 SSG.

---

## 8. UI / 핵심 컴포넌트

| 컴포넌트 | 책임 |
|---------|------|
| `ChaptersIndex` | `/chapters/` 목차 — 17개 카드 grid + 카테고리별 그룹 |
| `ChapterPage` | 챕터 본문 페이지 wrapper (헤더 + 본문 + 푸터 nav) |
| `ChapterHeader` | order + title + subtitle + 메타(페이지/시간) |
| `ChapterNav` (확장) | 현재는 prev/next만, 챕터용으로는 "목차로" 추가 |
| `ChapterProgress` (옵션) | localStorage 기반 진도율 표시 |
| `ChapterCard` | 목차 페이지의 챕터 카드 |

홈 페이지에 4번째 entry 추가:
```
홈 3-card → 4-card 또는 별도 섹션:
- 학습 시작 가이드 (/start/) — 입문자
- 책 차례 보기 (/chapters/) — 책 흐름 ★ 신규
- 유해물질 사전 (/chemicals/)
- 직업병 이야기 (/occupational-disease/)
```

또는 4-card 대신 별도 hero 섹션: "📖 책처럼 차근차근 17챕터" CTA.

---

## 9. 기술 스택 (변경 없음)

- Next.js 15 App Router
- MDX (`@next/mdx`)
- Tailwind v4
- Fuse.js (검색)
- Vercel/GitHub Pages (정적 export)

새 의존성 없음.

---

## 10. 일정 / Phase 분리

| Phase | 작업 | 산출물 | 예상 시간 |
|-------|------|--------|---------|
| **A** | 데이터·라우팅 | `chapters.json`, `lib/chapters.ts`, `lib/chaptersMdx.tsx`, `/chapter/[slug]/page.tsx`, `/chapters/page.tsx`, 컴포넌트 | **1~1.5h** |
| **B** | 풀 본문 챕터 1~4 MDX | 4 MDX (책 도입부) | **1~1.5h** |
| **C** | 공정 챕터 5~13 짧은 도입 MDX | 9 MDX (각 300~600자 + 링크) | **1h** |
| **D** | 풀 본문 챕터 14~16 MDX | 3 MDX (책 후반 학술) | **1~1.5h** |
| **E** | 신규 챕터 17 MDX | 1 MDX (책 결론) | **30분** |
| **F** | 목차 UI + 홈 진입 + QA + 배포 | 챕터 카드 grid + 홈 entry + 빌드/배포 | **1h** |
| **합계** | | | **6~8h** |

---

## 11. 리스크 & 완화

| ID | 리스크 | 영향 | 완화 |
|----|-------|------|------|
| R1 | 17개 MDX 본문 작성에 시간 과다 | High | 5~13장은 짧은 도입(링크) 방식으로 분량 절반↓ |
| R2 | 책 원문 인용 분량 과다 → 저작권 우려 | Med | `<SourceQuote>` 토글로 짧게 인용, About 페이지에 출처 명시 강화 |
| R3 | 기존 `/process/*`와 `/chapter/N/` 정보 중복 | Med | 5~13장 챕터 페이지는 도입+링크만, 본문 중복 없음 |
| R4 | 홈 entry가 4개로 늘면 시각 무게 분산 | Low | 4-card 대신 2x2 grid 또는 책 hero 섹션으로 차별화 |
| R5 | 빌드 시간 증가 (17개 SSG 추가) | Low | 영향 미미 (현재 41 → 58 페이지) |

---

## 12. 성공 기준 (DoD)

- [ ] 17개 챕터 페이지 모두 200 OK 라이브
- [ ] `/chapters/` 목차 페이지 동작 + 카테고리별 그룹
- [ ] 모든 챕터에 prev/next + "목차로" nav
- [ ] 각 챕터에 sourcePages + readingTime 메타 표시
- [ ] 기존 `/process/*`, `/chemicals/*`, `/cleanroom/` 등 모든 라우트 동작
- [ ] 홈에 챕터 entry point 추가 (3-card → 4-card 또는 별도 섹션)
- [ ] 빌드 통과 + Lighthouse 영향 무
- [ ] GitHub Pages 자동 배포 성공
- [ ] Match Rate ≥ 90%

---

## 13. 미해결 결정 (Open Questions)

| ID | 질문 | 결정 시점 |
|----|------|----------|
| Q1 | 홈에 챕터 entry를 4-card로 추가 vs 별도 hero 섹션 | Design 단계 |
| Q2 | 챕터 진도 트래킹 (localStorage) 구현 여부 | Design 단계 |
| Q3 | 5~13장 챕터 페이지에서 본문 어디까지 노출? (도입만 vs 도입+요약+링크) | Phase C 진입 전 |
| Q4 | 기존 `/cleanroom/`, `/electromagnetic/`, `/occupational-disease/`, `/risks-of-new-tech/`, `/what-is-semiconductor/` URL 유지 vs `/chapter/[slug]/`로 redirect | Design 단계 |
| Q5 | 챕터 카테고리 분류 (foundation/process/hazard/reflection) — UI에서 어떻게 시각화? | Design 단계 |

---

## 14. 다음 단계

```bash
/pdca design chapter-based-restructure
```

→ Design 단계에서 챕터 IA·컴포넌트·라우팅·기존 URL 정책·홈 진입 디자인 확정.

---

**참고**
- 원본 자료: `data/` 4개 markdown (4,673줄)
- 출처: 윤충식 외, 「반도체 산업의 유해인자」, 에피스테메
