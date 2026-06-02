---
template: plan
version: 1.2
description: PDCA Plan — /quotes 통합 인용 인덱스 (책 + OSHA), source 필터 + OSHA 인용 추출
variables:
  feature: quotes-source-filter
  date: 2026-05-30
  author: DrunkenZealnut
  project: semiconductor-academy
  version: 0.1.0
---

# quotes-source-filter Planning Document

> **Summary**: 직전 cycle `cross-link-system`의 FR-12(deferred) polish를 **Option B (통합)** 으로 정식화. 현재 91개 책 인용에 더해 OSHA SCS 5 Part에서 **핵심 인용**(Course Overview/Learning Objectives/Course Summary/주요 정의)을 ~25개 추가 추출하고, `/quotes` 검색을 책+OSHA 통합 인덱스로 확장. source 필터 UI 추가. 데이터 모델(`sourceId`)을 확장 가능하게 설계.
>
> **Project**: semiconductor-academy
> **Version**: 0.1.0
> **Author**: DrunkenZealnut
> **Date**: 2026-05-30
> **Status**: Draft (Option B 채택)

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | `/quotes` 인덱스는 책 91개만 제공 → 사이트가 다중 자료원으로 격상되었음에도 인용 검색은 단일 자료원에 머묾. OSHA SCS 5 Part에 풍부한 정의·요약·학습 목표가 있는데 검색·인용 인덱스에서 빠져 있음. quotes.json 스키마에 `sourceId` 없어서 단순 source 필터 추가도 무의미 (OSHA 0건). |
| **Solution** | (1) `quotes.json` 스키마에 `sourceId`·`language` 필드 추가 (2) `extract-quotes.mjs`를 책 + OSHA 모두 처리하도록 확장 (분기 처리) (3) OSHA 인용 추출 정책 정의: 각 Part의 Course Overview / Learning Objectives / Course Summary / 핵심 정의(예: Flash Point, HF Special Hazard) → Part별 ~5개, 총 ~25개 (4) `QuoteCard`에 `SourceBadge` + 영어 본문 자연스러운 표기 (5) `QuoteIndex`에 source 필터 추가 (책·OSHA·전체) (6) Fuse 인덱스에 sourceId·language 키 추가. |
| **Function/UX Effect** | • `/quotes`가 책 91 + OSHA ~25 = ~116 인용을 통합 검색 • source 필터 [전체 / 📖 책 KO / 🏛 OSHA EN] • 각 QuoteCard에 source 뱃지 + 언어 chip • OSHA quote는 원문 영어로 표시 + section ref(예: "Part 3 §5 Silane") • 키워드 "silane" 검색 시 책 Ch.10 + OSHA Part 3 §5 모두 노출. |
| **Core Value** | 인용 인덱스가 사이트 정체성과 정렬 — "다중 자료원 학습 허브"의 약속을 검색 가능 단위까지 실현. cross-link 시스템과 시너지(같은 silane이 chapter 페이지에서는 RelatedFromOtherSources, /quotes에서는 통합 검색으로 노출). 추가 자료원 onboarding 시 `extract-quotes.mjs`에 분기 1개만 추가하면 자동 편입(Extensibility 원칙 인용 인덱스에도 적용). |

---

## 1. Overview

### 1.1 Purpose

직전 cycle `cross-link-system`의 FR-12 polish를 사용자가 **Option B (통합)** 으로 선택했다. 단순 source 필터 추가가 아니라 OSHA 인용 추출까지 포함하여 `/quotes`를 진짜 다중 자료원 인덱스로 만든다. 본 cycle의 자료원 추출 패턴을 향후 KOSHA·SEMI 등으로 일반화할 수 있도록 extract-quotes.mjs 구조도 함께 정리.

### 1.2 Background

**현재 상태**:
- `src/data/quotes.json`: 91 entries (LE 17 + SQ 74), 모두 책 챕터, `sourceId` 필드 없음
- `scripts/extract-quotes.mjs`: `src/content/chapters/*.mdx`에서만 추출
- `/quotes` 헤더는 "책 원문 인용 인덱스"라 명시 (책 전용 표기)
- `cross-link-system` 완료 → silane이 책 Ch.10 + OSHA Part 3 양쪽에 cross-link되지만 `/quotes` 검색은 책만

**OSHA 구조 (검수 완료)**:
- 5 Parts: 1a(9 ##), 1b(10 ##), 2(14 ##), 3(13 ##), 4(9 ##) = 총 55 ## 헤딩
- 모든 Part에 `## Course Overview` + `### Learning Objectives` + `## Course Summary`
- 풍부한 정의들 (예: Part 2 "### Flash Point: minimum temperature at which..." 형태)
- 영어 본문, U.S. Government Work · Public Domain

### 1.3 Related Documents

- 직전 archive: `docs/archive/2026-05/cross-link-system/` — FR-12 deferred 명시
- 인용 인덱스 archive: `docs/archive/2026-05/source-quote-index/`
- 책 인용 강화 archive: `docs/archive/2026-05/source-quote-expansion/`
- Multi-source archive: `docs/archive/2026-05/multi-source-learning-platform/` — Source 모델

---

## 2. Scope

### 2.1 In Scope

#### 2.1.1 데이터 스키마 확장

- [ ] `QuoteItem` 인터페이스에 `sourceId: string`, `language: 'ko' | 'en'` 필드 추가
- [ ] OSHA 인용용 추가 필드: `sectionId?: string`(예: `part-3`), `partTitle?: string`, `sectionRef?: string` (예: "§5 Silane")
- [ ] `chapter` 필드는 책 quote만 사용 (OSHA quote에서는 optional)

#### 2.1.2 extract-quotes.mjs 확장

- [ ] 책 추출 로직 그대로 유지 (모든 entry에 `sourceId: 'epi-semi-hazards'`, `language: 'ko'` 부여)
- [ ] **OSHA 추출 로직 신규**: `src/content/sources/osha-scs/part-*.mdx`에서 다음 패턴 추출
  - `## Course Overview` 직후 첫 단락 → 1 quote per Part (총 5)
  - `### Learning Objectives` 직후 목록을 한 quote로 묶음 (총 5)
  - `## Course Summary` 직후 본문 → 1 quote per Part (총 5)
  - **핵심 정의 패턴** (`### 명사` + 짧은 정의 1~3문장): Part 2 Flash Point, Part 3 Silane Special Focus 등 (Part별 1~3개, 총 ~10)
- [ ] 총 OSHA quote 예상 25~30개, 모두 `sourceId: 'osha-scs'`, `language: 'en'`, `sectionId: 'part-{x}'`

#### 2.1.3 UI Source-awareness

- [ ] `QuoteCard.tsx`에 `<SourceBadge variant="lang"/>` 표시 (📖 KO / 🏛 EN)
- [ ] OSHA quote 카드: `chapter` 대신 `partTitle + sectionRef` 표시 (예: "OSHA SCS · Part 3 § Silane")
- [ ] OSHA quote 링크: `/sources/osha-scs/{partId}` (cross-link cycle 라우트 재사용)
- [ ] `/quotes` 헤더 텍스트 update: "책 + OSHA 인용 통합 인덱스"로 변경, 책·OSHA 카운트 표시

#### 2.1.4 검색·필터 통합

- [ ] `QuoteIndex.tsx`에 source 필터 추가 (전체 / 📖 책 / 🏛 OSHA)
- [ ] Fuse keys에 `sourceId` (weight 0.05), `partTitle` (weight 0.1) 추가
- [ ] 자료원 ≥2일 때 source 필터 표시 (조건부 렌더)
- [ ] 카운트 표시 update: 책 91 + OSHA ~25 = ~116 (실제 값)

#### 2.1.5 빌드 검증

- [ ] `npm run extract:quotes` 통과: 책 91 + OSHA 25+ 출력
- [ ] `npm run typecheck` 통과
- [ ] `npm run build` 무경고
- [ ] /quotes 페이지 spot check: "silane" 검색 → 책 Ch.10 + OSHA Part 3 모두 노출

### 2.2 Out of Scope (별 cycle로 분리)

- KOSHA·SEMI 등 추가 자료원 인용 추출 — 본 cycle의 OSHA 분기 패턴을 따라 향후 별 cycle
- OSHA 인용의 한국어 번역
- 인용 인덱스에 cross-link 패널 추가 (책+OSHA 인용 자체가 통합되므로 별도 cross-link 불필요)
- 모바일 앱
- 사용자 계정/북마크

### 2.3 OSHA 인용 추출 정책 (구체)

각 Part에서 추출할 quote 후보 (실제는 Do 단계에서 추출 결과 보고 미세 조정):

| Part | 후보 quotes | 예상 개수 |
|:----:|------------|:---:|
| 1A · Intro to GHS | Course Overview + Learning Objectives + Course Summary + Flash Point 정의 + Three Types of Hazards 정의 + Pyrophoric 정의 | 5~6 |
| 1B · Communication, Controls, Emergency | Course Overview + LO + Summary + SDS 16 sections 정의 + Emergency response 핵심 | 5 |
| 2 · Chemical Hazards | Course Overview + LO + Summary + Flash Point 정의 + Pyrophoric Substances 정의 + HF Special Hazard | 6 |
| 3 · Extremely Hazardous | Course Overview + LO + Summary + Silane Special Focus + Toxic Hydride Gases 정의 | 5 |
| 4 · Hazardous Gas Systems | Course Overview + LO + Summary + Cryogenic 정의 + Common Gas Controls | 5 |
| **총** | | **~26** |

**추출 단위 원칙**:
- 1 quote = 1 self-contained 문단 (≤ 200자 본문, 메타 별도)
- Course Summary는 핵심 1~3문장만 (전체 ## Course Summary 본문이 길면 첫 단락 또는 핵심 bullet)
- Learning Objectives는 bullets 묶어 1 quote (~3 bullets)
- 정의는 `### 명사` 헤딩 + 다음 1~2문장만

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | `QuoteItem` 스키마에 `sourceId`, `language` 추가 + OSHA 메타(`sectionId`, `partTitle`, `sectionRef`) | High | Pending |
| FR-02 | `extract-quotes.mjs` 책 추출 분기 유지 + 모든 entry에 `sourceId: 'epi-semi-hazards'`, `language: 'ko'` | High | Pending |
| FR-03 | `extract-quotes.mjs` OSHA 추출 신규: Part 5개에서 Course Overview/LO/Summary/핵심 정의 추출 (총 25+) | High | Pending |
| FR-04 | QuoteCard에 SourceBadge(variant="lang") + OSHA quote 메타 표시 (Part title + section ref) | High | Pending |
| FR-05 | QuoteCard 링크: 책 → `/chapter/{slug}`, OSHA → `/sources/osha-scs/{partId}` | High | Pending |
| FR-06 | QuoteIndex source 필터 (전체/책/OSHA), 자료원 ≥2 시 노출 | High | Pending |
| FR-07 | `/quotes` 헤더 update: "책 + OSHA 통합 인덱스", 카운트 동적 (책 91 + OSHA N) | Medium | Pending |
| FR-08 | Fuse 인덱스에 `sourceId`/`partTitle` 키 추가 (weight 낮음) | Medium | Pending |
| FR-09 | 빌드/typecheck/extract:quotes 무경고 통과 | High | Pending |
| FR-10 | "silane" 검색 시 책 Ch.10 + OSHA Part 3 모두 노출 (수동 확인) | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement |
|----------|----------|-------------|
| Performance | `/quotes` LCP 증가 ≤ 100ms | 로컬 spot check |
| Bundle | `quotes.json` 크기 증가 ≤ 35% (책 91 + OSHA ~25 = ~28% 증가 예상) | `du -sh` |
| Build | 무경고 통과 | CI/local |
| URL 회귀 | 17 chapter + 30 chemical + 9 process + 7 source + /quotes 모두 200 | 빌드 spot check |
| 데이터 정합성 | sourceId 누락 0건, sectionId(OSHA만) 유효 5 part ID 한정 | extract:quotes 검증 |
| 검색 정확성 | 책·OSHA quote 모두 검색되며 source 필터 작동 | 수동 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] `quotes.json` 책 91 entries + OSHA 25~30 entries, 모두 `sourceId` 부여
- [ ] OSHA quote 메타 (`partTitle`, `sectionRef`) 일관성 있게 부여
- [ ] QuoteCard UI에서 책/OSHA quote 시각적으로 구분 + 정확한 링크
- [ ] source 필터 [전체 / 📖 책 / 🏛 OSHA] 작동
- [ ] `/quotes` 헤더 카운트 동적 (예: "책 91 · OSHA 26")
- [ ] "silane" / "flash point" 검색 결과 시각 확인
- [ ] gap-detector Match Rate ≥ 90%

### 4.2 Quality Criteria

- [ ] OSHA quote 본문이 너무 길지 않음 (~200자 목표)
- [ ] OSHA quote가 self-contained (한 문장만으로도 의미 있음)
- [ ] 다크 모드 일관성, source 뱃지 가독성
- [ ] 추가 자료원 onboarding 시 extract-quotes.mjs 분기 1개 추가만으로 작동

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| OSHA 인용 추출 정책의 주관성 (어디까지가 "인용"?) | High | High | Plan §2.3에서 카테고리·개수 사전 합의. Do 단계에서 실제 추출 결과 확인 후 미세 조정. 초기 ~25개 ±5 허용 |
| 추출 정규식·파서가 OSHA MDX 구조에 안 맞음 | Medium | Medium | 책 추출이 line-based 정규식인 만큼, OSHA용 별도 함수로 격리 작성. 단순 패턴 우선 |
| OSHA quote 본문 길이 폭증 (Course Overview가 길어서) | Medium | Medium | 첫 단락만 / 최대 N자 cutoff. 필요 시 truncate `...` |
| 영어 quote가 한국어 UI에서 부자연스러움 | Medium | Low | EN 뱃지 + 명확한 source ref 표시. OSHA quote는 영어 원문임을 명시 |
| 책 91 + OSHA 25 = 116개로 검색 결과가 너무 많음 | Low | Low | 기존 필터(type/chapter) + 신규 source 필터로 슬라이싱 가능 |
| OSHA section ID가 cross-link sources.ts와 불일치 | High | Medium | `osha-scs` sources.ts의 sections 배열을 단일 진실로 참조. partId 하드코드 금지 |
| OSHA quote 메타에 추가 필드가 늘어 UI 카드 디자인 복잡해짐 | Medium | Medium | QuoteCard에 conditional rendering. 책 quote는 기존 모양 유지 |
| OSHA quote 추가로 LayeredExplain 카운트 의미 혼란 | Low | Medium | type 필터에 OSHA quote를 명시적으로 'osha-section' 같은 type으로 처리하거나, type을 source-agnostic으로 변경 |
| 작업 시간 1.5~2h 초과 (실제 3h 가능성) | Medium | Medium | extract-quotes OSHA 분기가 핵심 시간 소요. 정책 단순화로 시간 박스 |

---

## 6. Architecture Considerations

### 6.1 Project Level

| Level | 선택 |
|-------|:---:|
| Starter | ☐ |
| **Dynamic** | ☑ (변경 없음) |
| Enterprise | ☐ |

### 6.2 Key Architectural Decisions

| Decision | 선택 | 근거 |
|----------|------|------|
| OSHA 추출 위치 | **`extract-quotes.mjs` 내 분기 함수** | 단일 빌드 스크립트 유지, 새 자료원 onboarding 패턴 정착 |
| OSHA quote 식별자 (`id` 필드) | `osha-scs::{partId}::{kind}::{index}` (예: `osha-scs::part-3::definition::silane-special-focus`) | 책 quote id 패턴과 분리, 중복 방지 |
| QuoteCard 분기 | **conditional rendering** (sourceId 별 메타 표시) | 컴포넌트 1개 유지, 분기 로직만 |
| Source 필터 UI | 칩 버튼 3개 (전체 / 📖 / 🏛) | 기존 type 필터와 동일 스타일 |
| type 필드 처리 | OSHA는 `'osha-section'` 신규 type (책의 `'layered-explain'`/`'source-quote'`와 별도) | 책 필터와 OSHA 필터를 type 차원에서도 분리 가능 |
| 영어 quote 텍스트 처리 | **원문 그대로 (truncate ≤ 200자)** | 저작권·정합성. 의역·번역 금지 |
| sources 메타 참조 | `src/lib/sources.ts`의 `OSHA_SCS.sections` 단일 진실 | partId 하드코드 금지, 향후 추가 자료원도 동일 패턴 |

### 6.3 Folder Structure (변화분)

```
src/
  data/quotes.json                  ← EXTEND (책 91 + OSHA ~25)
  components/quote-index/
    QuoteCard.tsx                   ← EXTEND (source 뱃지 + conditional 메타)
    QuoteIndex.tsx                  ← EXTEND (source 필터, Fuse 키 추가)
  app/quotes/page.tsx               ← EXTEND (헤더·카운트 update)
scripts/
  extract-quotes.mjs                ← EXTEND (OSHA 추출 분기 함수 추가)
```

---

## 7. Convention Prerequisites

기존 컨벤션 그대로:
- 디자인 토큰 100% 재사용 (SourceBadge 그대로)
- 컴포넌트 PascalCase, lib camelCase
- 신규 ENV 0개
- `quotes.json` 직접 편집 금지 (extract-quotes.mjs 단일 진실)

본 cycle 추가:
- OSHA quote 본문은 영어 원문 그대로, 의역 금지 (cross-link-system OSHA MDX와 동일 정책)
- 신규 자료원 인용 추가 시 `extract-quotes.mjs`에 함수 1개 추가 + sourceId 부여
- OSHA quote 본문 ≤ 200자 목표 (truncate 시 `…` 사용)

---

## 8. Next Steps

1. [ ] 본 Plan 사용자 검토 및 승인
2. [ ] (선택) 새 branch `feat/quotes-source-filter` 생성
3. [ ] `/pdca design quotes-source-filter` — Design (정확한 추출 패턴 정규식, QuoteItem 타입 다이어그램, OSHA quote 매트릭스 sample)
4. [ ] `/pdca do quotes-source-filter` — 2~2.5h 구현
5. [ ] gap-detector → Match Rate ≥ 90%
6. [ ] `/pdca report` → archive

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-30 | 초안: Option A (Minimal polish) | DrunkenZealnut |
| 0.2 | 2026-05-30 | **Option B 채택**: OSHA 인용 추출 통합, 작업 시간 1.5~2.5h, 책+OSHA 통합 검색 + source 필터 | DrunkenZealnut |
