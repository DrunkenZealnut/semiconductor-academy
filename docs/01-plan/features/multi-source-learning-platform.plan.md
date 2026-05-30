---
template: plan
version: 1.2
description: PDCA Plan — 다중 자료원 학습 플랫폼 재편 (OSHA 통합 + 자료 간 연결 시스템)
variables:
  feature: multi-source-learning-platform
  date: 2026-05-30
  author: DrunkenZealnut
  project: semiconductor-academy
  version: 0.1.0
---

# multi-source-learning-platform Planning Document

> **Summary**: 단일 책 사이트(「반도체 산업의 유해인자」 17 챕터)를 **다중 자료원 학습 플랫폼**으로 재편하고, 첫 추가 자료로 OSHA Semiconductor Chemical Safety(Part 1a/1b/2/3/4)를 통합하며, 자료 간 cross-reference 시스템을 구축한다.
>
> **Project**: semiconductor-academy
> **Version**: 0.1.0
> **Author**: DrunkenZealnut
> **Date**: 2026-05-30
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 사이트가 책 한 권에 종속되어 확장성이 없다. OSHA·SEMI·산업안전보건공단 등 추가 자료를 넣을 자리가 없고, 자료 간 관계(같은 주제·같은 위험)도 표현할 수 없어 학습자 관점에서 한 주제를 여러 출처로 비교 학습하기 어렵다. |
| **Solution** | (1) `Source(자료원)` 1급 객체를 도입해 정보 아키텍처를 다중 자료원 구조로 재편, (2) OSHA Semiconductor Chemical Safety 5개 파트를 첫 새 자료원으로 통합(이미 markdown transcript 보유), (3) `topic`·`hazard`·`chemical` 태그 기반 cross-link 인덱스를 구축해 책 챕터 ↔ OSHA 모듈 ↔ 화학물질 페이지가 양방향으로 연결되도록 한다. |
| **Function/UX Effect** | 메인 페이지에서 **자료원 선택**(책/OSHA/...)을 첫 진입점으로 제시. 각 콘텐츠 하단에 **"이 주제를 다른 자료에서도 보기"** 패널 등장. 화학물질·위험인자 페이지가 **모든 자료원의 관련 섹션 허브**로 작동. 검색이 자료원·주제·위험 다축 필터링 지원. |
| **Core Value** | "**한 책의 디지털 사본**"에서 "**반도체 안전 학습 허브**"로 정체성 격상. 동일 주제(예: 실란 가스 위험)를 한국 학술서 시각 + OSHA 미국 산업 가이드 시각으로 **교차 학습** 가능하게 만든다. |

---

## 1. Overview

### 1.1 Purpose

현재 사이트는 「반도체 산업의 유해인자」(윤충식 외, 에피스테메) 한 권을 17 챕터로 디지털화한 결과물이다. 이를 **반도체 안전 학습의 허브 사이트**로 격상시키기 위해 자료원을 1급 객체로 도입하고, 첫 새 자료원으로 OSHA Semiconductor Chemical Safety 교육 모듈을 통합한다. 그 다음, 서로 다른 자료원의 콘텐츠를 주제·위험인자·화학물질 축으로 연결해 학습자가 한 주제를 여러 시각에서 접근할 수 있도록 한다.

### 1.2 Background

- **완성된 자산**: 17 챕터 MDX, 9 공정, 31 화학물질, 23 SourceQuote, 인용 인덱스 페이지가 이미 존재.
- **사이트 정체성 변화**: 직전 PDCA `homepage-book-centric`에서 "책 중심"으로 한 번 정렬했으나, 자료 추가 요구가 발생하면서 "다중 자료원"으로 한 단계 더 진화 필요.
- **OSHA 자료 준비 완료**: `data/osha/` 폴더에 PDF 5개 + markdown transcript 5개 (Part 1a, 1b, 2, 3, 4)가 이미 확보되어 있어 즉시 통합 가능.
- **확장 욕구**: 향후 SEMI 표준, KOSHA 가이드, 학술 논문 등 추가 자료원도 같은 방식으로 붙이고 싶다.

### 1.3 Related Documents

- 직전 Archive: `docs/archive/2026-05/homepage-book-centric/`, `docs/archive/2026-05/source-quote-index/`
- 책 사이트 완주 milestone: `docs/archive/2026-05/ch3-to-ch17-batch/`
- OSHA 원본: `data/osha/Semiconductor_Chemical_Safety_Part_*.pdf` + `data/osha/scs_part*_transcript.md`

---

## 2. Scope

### 2.1 In Scope

#### Phase A — 정보 아키텍처 재편 (필수, 선행)

- [ ] `Source(자료원)` 데이터 모델 정의 (id, kind, title, attribution, license, sections[])
- [ ] 기존 책 콘텐츠를 `Source { id: "epi-semi-hazards" }`로 식별자 부여 (URL은 호환 유지)
- [ ] 메인 페이지 자료원 선택 UI (책/OSHA/...) 추가
- [ ] `/sources/[source]` 자료원 인덱스 라우트 신설
- [ ] `lib/sources.ts` 자료원 레지스트리 구현

#### Phase B — OSHA 자료원 통합

- [ ] `data/osha/scs_part1a~part4_transcript.md`를 MDX 5개로 변환 (`src/content/sources/osha-scs/`)
- [ ] 각 Part의 학습 목표·주요 개념·체크리스트 구조화
- [ ] OSHA Part별 라우트: `/sources/osha-scs/part-1a` 등 5개
- [ ] OSHA 출처·라이선스(미국 정부 저작물 공개) 페이지에 명시
- [ ] 챕터 카드와 동일 디자인 시스템으로 OSHA 모듈 카드 표시

#### Phase C — Cross-linking 시스템

- [ ] `topic`/`hazard`/`chemical` 3축 태그 스키마 정의 (`lib/cross-link/schema.ts`)
- [ ] 책 17 챕터 + OSHA 5 Part에 태그 부여 (`_credits.json` 확장 또는 별도 `_links.json`)
- [ ] 각 콘텐츠 페이지 하단에 **"같은 주제·다른 자료" 패널** 컴포넌트 (`RelatedFromOtherSources`)
- [ ] 화학물질 페이지(`/chemicals/[id]`)에 OSHA 관련 Part 링크 추가
- [ ] 빌드 타임 인덱스 생성 스크립트 (`scripts/build-cross-link-index.mjs`)
- [ ] 인덱스 페이지 검색 확장: 자료원·태그 필터

### 2.2 Out of Scope

- 새로운 한국어 책(에피스테메 외) 추가 — 별도 PDCA로 분리
- OSHA 영상(mp3)의 한국어 자막/번역 — 본 Plan은 영문 transcript 기반 마크다운만 다룬다
- 사용자 계정/북마크/진도 추적 (Dynamic 수준 — 추후 별도 검토)
- 모바일 앱 변환
- SEMI 표준 통합 (구조만 일반화하고, 콘텐츠 자체는 별도 PDCA)
- 검색 결과를 LLM이 요약하는 기능

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | `Source` 데이터 모델 도입, 기존 책 콘텐츠가 한 source instance로 표현됨 | High | Pending |
| FR-02 | 메인 페이지에 자료원 카드(책/OSHA) 노출, 클릭 시 `/sources/[id]` 진입 | High | Pending |
| FR-03 | OSHA Part 1a/1b/2/3/4 5개 MDX 변환 및 라우팅, 본문에 학습목표·요점 구조 표시 | High | Pending |
| FR-04 | `topic`/`hazard`/`chemical` 태그 스키마 정의 및 17 챕터 + 5 OSHA Part에 부여 | High | Pending |
| FR-05 | 콘텐츠 페이지 하단에 "같은 주제·다른 자료" 패널 렌더링 (양방향) | High | Pending |
| FR-06 | 화학물질 페이지가 모든 source의 관련 섹션을 허브 형태로 모음 | Medium | Pending |
| FR-07 | 빌드 타임 cross-link 인덱스 JSON 생성, 런타임 fetch 0회 | Medium | Pending |
| FR-08 | 검색(fuse.js) 필터에 source 축 추가 (책만/OSHA만/전체) | Medium | Pending |
| FR-09 | 기존 책 URL(`/chapter/[slug]-chapter/`) 100% 하위 호환 유지 | High | Pending |
| FR-10 | OSHA 라이선스(미국 정부 저작물·공개) 출처 페이지에 명시 | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | OSHA 통합·cross-link 후에도 LCP 증가 ≤ 200ms | `npm run build` 후 `next-build` 분석, 로컬 lighthouse |
| Accessibility | "다른 자료에서 보기" 패널이 WCAG 2.1 AA (대비·키보드 포커스) 충족 | 수동 키보드 테스트 + axe 체크 |
| SEO | 새 라우트 `/sources/*` 사이트맵 포함, OG 태그 정상 | 빌드 후 `out/sitemap.xml` 점검 |
| Build | `npm run build` 무경고 / `npm run typecheck` 통과 | CI 또는 로컬 |
| License | OSHA 자료 출처·공개 라이선스 표기 누락 0건 | 빌드 후 grep `"OSHA"` 통과 |
| Bundle | 추가 산출물(`out/`) 증가 ≤ 30% (인덱스 JSON 제외) | `du -sh out/` 비교 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] Phase A: `Source` 모델 + `/sources/[source]` 라우트 + 메인 페이지 자료원 카드 동작
- [ ] Phase B: OSHA 5 Part MDX 변환 완료, 5개 라우트 빌드 성공, 출처 명시
- [ ] Phase C: cross-link 인덱스 빌드 스크립트 작동, 책 ↔ OSHA 양방향 링크 ≥ 20쌍
- [ ] 모든 기존 책 URL 200 응답 (회귀 없음)
- [ ] `npm run build` / `typecheck` / lint 통과
- [ ] gap-detector Match Rate ≥ 90%

### 4.2 Quality Criteria

- [ ] OSHA 5 Part 모두 학습 목표·핵심 개념·체크리스트 구조 일관성
- [ ] 화학물질 31개 중 OSHA가 다루는 물질(silane, ammonia, HF 등)에 자동 링크 ≥ 5건
- [ ] cross-link 패널이 "관련 자료 없음"인 페이지에서는 깔끔히 숨김
- [ ] 라이선스/출처 표기 일관성 (Fair use vs 미국 정부 공개 자료 구분)

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 정보 아키텍처 변경이 기존 17 챕터 URL을 깨뜨림 | High | Medium | URL은 그대로 유지하고 내부 식별자만 추가 (FR-09). 모든 기존 라우트에 회귀 테스트 |
| OSHA 영어 콘텐츠 vs 책 한국어 콘텐츠의 언어 차이로 UX 혼란 | Medium | High | 자료원 카드에 언어 뱃지(KO/EN) 명시. 검색 결과에도 언어 표기 |
| Cross-link 태그 부여가 17 챕터 × 5 OSHA에 수동 작업으로 시간 폭증 | High | Medium | 3축 태그 셋을 최소 어휘로 제한(topic ≤ 20개, hazard ≤ 15개, chemical = 기존 31개). LLM 보조 1차 라벨링 후 사람 검수 |
| OSHA 자료의 라이선스 오해 (공개지만 SEMI/공급사 figure 일부는 별도) | High | Medium | 1차 통합은 **transcript 텍스트만**. PDF figure는 제외하고 필요 시 별도 검토 |
| 메인 페이지의 책 중심 → 다중 자료원 전환이 직전 PDCA 결과를 약화 | Medium | Low | "책"이 여전히 첫 카드·기본 진입점으로 보이도록 정렬. "OSHA 추가됨" 배지로 신규성 부각 |
| 빌드 타임 인덱스 스크립트가 chapters extract-quotes와 충돌 | Medium | Medium | `npm scripts`를 `prebuild`에 직렬화. 인덱스도 `extract-quotes` 다음 단계로 추가 |
| Phase A 없이 Phase B 먼저 진행하려는 유혹 (OSHA만 빨리 넣기) | Medium | High | Plan에서 Phase A → B → C 순서 명시. 임시 라우트(`/osha`)로 우회하면 부채 발생 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure (`components/`, `lib/`, `types/`) | Static sites, portfolios, landing pages | ☐ |
| **Dynamic** | Feature-based modules, BaaS integration (bkend.ai) | Web apps with backend, SaaS MVPs, fullstack apps | ☑ |
| **Enterprise** | Strict layer separation, DI, microservices | High-traffic systems, complex architectures | ☐ |

> 사이트 자체는 정적 export(GitHub Pages)지만, 콘텐츠 모델·feature 분리 수준이 Dynamic에 해당. 백엔드 BaaS는 없음 (정적 데이터만).

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| 자료원 모델 | URL 분리만 / 별도 데이터 객체 / DB | **별도 데이터 객체 (`Source` interface + 정적 레지스트리)** | 정적 사이트, 자료원 수 한정(<20), DB 불필요 |
| Cross-link 저장소 | per-MDX frontmatter / 별도 `_links.json` / 빌드 인덱스 | **빌드 인덱스 (`scripts/build-cross-link-index.mjs` → `out/cross-link.json`)** | MDX 수정 최소화, 런타임 fetch 0회, GitHub Pages 정적 호스팅 적합 |
| 태그 어휘 통제 | 자유 태그 / 통제 어휘 / 계층 분류 | **통제 어휘 (topic·hazard·chemical 3축, 사전 정의 enum)** | 17×5 매트릭스에서 자유 태그는 정합성 깨짐 |
| OSHA 변환 단위 | 5 Part 통째 / 각 Part 1 MDX / 섹션 분할 | **각 Part 1 MDX (총 5)** | 원본 강의 단위 유지, 학습 단위 명확, 변환 비용 낮음 |
| 메인 페이지 진입점 | 책 그대로 / 자료원 선택 우선 / 토픽 우선 | **자료원 선택 + 책이 첫 카드** | 정체성 격상 + 직전 PDCA 결과(homepage-book-centric) 약화 최소화 |
| Framework | Next.js / React / Vue | **Next.js 15 (현행)** | 변경 없음 |
| Styling | Tailwind / CSS Modules / styled-components | **Tailwind (현행)** | 변경 없음 |
| Testing | Jest / Vitest / Playwright | **빌드 + tsc + 수동 회귀 (현행)** | 정적 사이트, 자동 테스트 없는 현 정책 유지 |

### 6.3 Clean Architecture Approach

```
Selected Level: Dynamic (콘텐츠 다축 확장 + feature 분리)

Folder Structure Preview (제안):
┌─────────────────────────────────────────────────────┐
│ src/                                                │
│   app/                                              │
│     page.tsx                  ← 메인: 자료원 선택   │
│     chapter/[slug]/...        ← 기존 (호환 유지)    │
│     sources/                  ← NEW                 │
│       [source]/page.tsx       ← 자료원 인덱스       │
│       osha-scs/[part]/page.tsx← OSHA Part 페이지    │
│     chemicals/[id]/...        ← 확장(타 source 링크)│
│   content/                                          │
│     chapters/...              ← 기존 17 MDX         │
│     processes/...             ← 기존                │
│     sources/                  ← NEW                 │
│       osha-scs/               ← OSHA 5 MDX          │
│   components/                                       │
│     RelatedFromOtherSources/  ← NEW                 │
│     SourcePicker/             ← NEW                 │
│   lib/                                              │
│     sources.ts                ← NEW (레지스트리)    │
│     cross-link/               ← NEW (스키마/조회)   │
│ scripts/                                            │
│   extract-quotes.mjs          ← 기존                │
│   build-cross-link-index.mjs  ← NEW                 │
└─────────────────────────────────────────────────────┘
```

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

- [x] `CLAUDE.md` 글로벌 지침 존재 (사용자 레벨)
- [ ] `docs/01-plan/conventions.md` (Phase 2) — 없음, 본 PDCA에서 추가 검토 필요
- [ ] `CONVENTIONS.md` — 없음
- [x] TypeScript 설정 (`tsconfig.json`)
- [ ] ESLint/Prettier 설정 — Next.js 기본만, 별도 룰 없음

### 7.2 Conventions to Define/Verify

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| **자료원 ID 명명** | 신규 | `kebab-case`, 예: `epi-semi-hazards`, `osha-scs`, `semi-s2` | High |
| **MDX 위치** | `src/content/chapters/`, `src/content/processes/` | 신규: `src/content/sources/{sourceId}/` (자료원 단위 폴더) | High |
| **Cross-link 태그 어휘** | 신규 | `topic` 사전 정의 enum (예: `cleanroom`, `etching-safety`, `ghs`), `hazard` enum, `chemical`는 기존 31개 ID 재사용 | High |
| **출처 표기** | `_credits.json` 챕터 단위 | 확장: source-level credit + section-level credit | Medium |
| **라이선스 뱃지** | "Fair use" 단일 | 추가: "U.S. Government Work" (OSHA용) | High |
| **Folder structure** | feature-light | `lib/cross-link/` 모듈 분리 | Medium |

### 7.3 Environment Variables Needed

| Variable | Purpose | Scope | To Be Created |
|----------|---------|-------|:-------------:|
| (없음) | 정적 사이트라 신규 ENV 불필요 | - | ☐ |

### 7.4 Pipeline Integration

본 프로젝트는 9-phase Pipeline을 따르지 않고 PDCA만 사용한다.

| Phase | Status | Document Location | Command |
|-------|:------:|-------------------|---------|
| Phase 1 (Schema) | N/A | - | - |
| Phase 2 (Convention) | 부분 적용 | 본 Plan §7에 포함 | - |

---

## 8. Next Steps

1. [ ] 본 Plan 사용자 검토 및 승인
2. [ ] `/pdca design multi-source-learning-platform` — Design 문서 작성 (자료원 모델 인터페이스, cross-link JSON 스키마, 컴포넌트 인터페이스, 라우트 정의)
3. [ ] (Design 후) Phase A → B → C 순차 구현 또는 sub-batch로 분리 PDCA
4. [ ] gap-detector로 Match Rate ≥ 90% 확인
5. [ ] `/pdca report` → archive

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-30 | 초안: 다중 자료원 재편 + OSHA 통합 + Cross-link 시스템 3단계 Plan | DrunkenZealnut |
