---
template: plan
version: 1.2
description: PDCA Plan — 자료원 간 cross-link 시스템 (책 ↔ OSHA ↔ 화학물질 양방향 연결)
variables:
  feature: cross-link-system
  date: 2026-05-30
  author: DrunkenZealnut
  project: semiconductor-academy
  version: 0.1.0
---

# cross-link-system Planning Document

> **Summary**: 직전 cycle `multi-source-learning-platform` Phase A+B에서 다중 자료원 구조를 만든 위에, **자료원 간 양방향 cross-link 시스템**을 구축한다. `topic`·`hazard`·`chemical` 3축 통제 어휘로 책 17 챕터와 OSHA 5 Part를 태깅하고, 빌드 타임 인덱스를 생성해 각 페이지 하단에 "같은 주제·다른 자료" 패널을 노출. 화학물질 페이지가 모든 자료원의 관련 섹션 허브로 작동하도록 한다.
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
| **Problem** | 책 17 챕터와 OSHA 5 Part가 동일한 주제(예: 실란, 가스 안전, 부식성)를 다루지만 서로 연결되어 있지 않다. 학습자가 한 자료를 읽으면서 같은 주제를 다른 시각(한국 학술 vs 미국 OSHA)으로 비교할 진입점이 없다. 화학물질 페이지도 책 챕터만 참조할 뿐 OSHA 섹션을 모른다. |
| **Solution** | (1) `topic`·`hazard`·`chemical` 3축 통제 어휘 enum 정의 (2) 책 17 챕터 + OSHA 5 Part에 태그 부여 (`_book-links.json`, OSHA `_links.json`) (3) 빌드 타임 스크립트(`build-cross-link-index.mjs`)가 양방향 인덱스(`cross-link.json`) 생성 (4) `RelatedFromOtherSources` 패널을 챕터·Part 페이지 하단에 추가 (5) `ChemicalSourceHub`로 화학물질 페이지를 자료원 허브로 확장 (6) `/quotes` 검색에 source 필터 추가. |
| **Function/UX Effect** | • 책 챕터 하단: "같은 주제를 다른 자료에서도 보기" → OSHA Part 링크 (역도 동일) • 화학물질 silane 페이지: 책 Ch.7 + OSHA Part 3 §5 + Part 4 §6 모두 노출 • 검색이 "책만 / OSHA만 / 전체" 필터 지원 • 관련 항목 0건일 때 패널 자동 숨김. |
| **Core Value** | "정체성 격상의 **2단계 완료**" — 1단계(자료원 도입) + **2단계(자료 간 의미적 연결)**로 단일 책 사이트가 진정한 **반도체 안전 학습 허브**로 완성. 향후 SEMI 표준 등 추가 자료원도 동일 태그 어휘만 부여하면 자동으로 cross-link 망에 편입. |

---

## 1. Overview

### 1.1 Purpose

직전 PDCA cycle `multi-source-learning-platform` Phase A+B는 자료원 카드와 OSHA 5 Part 페이지를 노출했지만, **자료 간 관계 표현은 부재**한 상태이다. 본 cycle은 그 위에 의미적 연결망(cross-link)을 구축해, 학습자가 한 자료에서 다른 자료로 자연스럽게 이동할 수 있게 한다.

### 1.2 Background

- **직전 cycle 완료 상태**: Match Rate 96%, Phase A+B만 ship, Phase C는 의도적으로 별 cycle로 분리 (이번 cycle이 그 Phase C)
- **사용 가능한 자산**: 17 챕터 메타(`chapters.json`), 30 화학물질(`chemicals.json`), 9 공정 ID, OSHA 5 Part MDX, `Source` 데이터 모델
- **사용자 요청 원문**: "추가한 이후 교육자료들간 연결이 가능하도록 시스템 구축"
- **상속점 (`multi-source-learning-platform` archive)**:
  - Plan §3.1 FR-04 ~ FR-08
  - Design §3.1.2 Cross-link Schema (Topic 22개, Hazard 12개 enum)
  - Design §6.2 cross-link 저장소 = 빌드 인덱스 (`.mjs` ↔ `.ts` 분리 결정)
  - Design §11.2 step 12 ~ 21

### 1.3 Related Documents

- 직전 Archive: `docs/archive/2026-05/multi-source-learning-platform/`
  - `plan.md` §3.1 FR-04~08, §6.3 cross-link 분리 결정
  - `design.md` §3.1.2 Cross-link Schema, §6.2 architecture decisions, §11.2 step 12~21
  - `analysis.md` Phase C scope split 검증
  - `report.md` Lessons learned (Phase split의 가치)
- 기존 코드:
  - `src/lib/sources.ts` (SOURCES 레지스트리)
  - `src/lib/types.ts` (`Source`, `SourceSection` 타입)
  - `src/data/chapters.json`, `src/data/chemicals.json`
  - `src/content/sources/osha-scs/part-*.mdx` (5개)

---

## 2. Scope

### 2.1 In Scope

#### 2.1.1 통제 어휘 + 태깅

- [ ] `src/lib/cross-link/schema.ts` — `Topic` (≤22) + `Hazard` (≤12) enum + 인덱스 타입 정의
- [ ] `src/data/_book-links.json` — 책 17 챕터 태그 매트릭스 (topic/hazard/chemical 3축)
- [ ] `src/content/sources/osha-scs/_links.json` — OSHA 5 Part 태그 매트릭스
- [ ] 알 수 없는 enum/chemical ID 검출 시 빌드 실패

#### 2.1.2 빌드 인덱스

- [ ] `scripts/build-cross-link-index.mjs` — 양방향 인덱스 생성 스크립트
- [ ] `src/data/cross-link.json` — 빌드 산출물 (`bySection` + `byTopic` + `byHazard` + `byChemical` 4축)
- [ ] `package.json`의 `prebuild`/`predev`에 `extract-quotes` 다음 단계로 추가
- [ ] enum 위반·중복 ID 등 정합성 검증

#### 2.1.3 런타임 조회

- [ ] `src/lib/cross-link/lookup.ts` — `lookupRelated(sourceId, sectionId)` + `lookupByChemical(id)` API
- [ ] 같은 source 내 항목은 자동 제외 (제목·노이즈 방지)
- [ ] 결과 정렬: source.order → section.order

#### 2.1.4 UI 컴포넌트

- [ ] `src/components/cross-link/RelatedFromOtherSources.tsx` — 본문 하단 패널 (자료원별 그룹화, 항목 0건 시 null 반환)
- [ ] `src/components/cross-link/ChemicalSourceHub.tsx` — 화학물질 페이지의 자료원 허브 섹션
- [ ] Tag chip 표시(공유 topic/hazard 강조)
- [ ] 디자인 토큰 기존 카드 패턴 재사용 (신규 토큰 0)

#### 2.1.5 페이지 통합

- [ ] 책 챕터 페이지(`/chapter/[slug]/page.tsx`) 하단에 `<RelatedFromOtherSources />` 삽입
- [ ] OSHA Part 페이지(`/sources/osha-scs/[part]/page.tsx`) 하단에 `<RelatedFromOtherSources />` 삽입
- [ ] 화학물질 페이지(`/chemicals/[id]/page.tsx`)에 `<ChemicalSourceHub />` 추가

#### 2.1.6 검색 확장 (Optional, 시간 여유 시)

- [ ] `/quotes` 검색 UI에 source 필터 (책만 / OSHA만 / 전체) 추가
- [ ] 검색 결과 항목에 source 뱃지 노출

### 2.2 Out of Scope

- 자료원 추가 (SEMI 표준, KOSHA 등) — 별 cycle
- 태그 어휘 확장 PR (Topic > 22개, Hazard > 12개) — 본 cycle은 enum 고정
- LLM 기반 자동 태깅 — 본 cycle은 직접 + 검증
- 검색 결과 LLM 요약
- 모바일 앱
- 사용자 계정/북마크/진도 추적
- OSHA PDF figure 통합

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | `Topic`/`Hazard` enum + cross-link 타입 (`schema.ts`) | High | Pending |
| FR-02 | 책 17 챕터 태그 매트릭스 (`_book-links.json`) — 각 챕터 ≥ 1축 태그 | High | Pending |
| FR-03 | OSHA 5 Part 태그 매트릭스 (`_links.json`) — 각 Part ≥ 1축 태그 | High | Pending |
| FR-04 | `build-cross-link-index.mjs` 빌드 스크립트 + `prebuild` 훅 등록 | High | Pending |
| FR-05 | enum 위반/중복 ID → 빌드 실패 (exit 1 + 사용 가능 enum 출력) | High | Pending |
| FR-06 | `lib/cross-link/lookup.ts` API — `lookupRelated`, `lookupByChemical` | High | Pending |
| FR-07 | `RelatedFromOtherSources` 컴포넌트 — 자료원별 그룹, 0건 시 숨김, 공유 태그 표시 | High | Pending |
| FR-08 | 책 챕터 + OSHA Part 페이지 하단에 패널 노출 (양방향) | High | Pending |
| FR-09 | `ChemicalSourceHub` 컴포넌트 + 화학물질 페이지 통합 | High | Pending |
| FR-10 | 인덱스 = 빌드 산출물만, 런타임 fetch 0회 | High | Pending |
| FR-11 | 책 ↔ OSHA 양방향 링크 ≥ 20쌍 (Plan Definition of Done 상속) | Medium | Pending |
| FR-12 | `/quotes` source 필터 (책/OSHA/전체) | Low | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | 패널 추가 후에도 LCP 증가 ≤ 100ms (chapter 페이지 기준) | 로컬 lighthouse spot check |
| Bundle | `cross-link.json` ≤ 50KB (gzip 후 측정), runtime JS 추가분 ≤ 5KB | `du -sh out/`, build 분석 |
| Build | `npm run build` 무경고, `npm run typecheck` 통과 | CI 또는 로컬 |
| A11y | 패널 키보드 포커스 + dark mode 대비 ≥ WCAG AA | 수동 키보드 테스트 |
| 정합성 | 알 수 없는 enum/chemical 0건 (빌드 통과 ≡ 정합성 확인) | 빌드 스크립트 자체 검증 |
| URL 회귀 | 기존 17 챕터 + 30 chemical + 9 process + 7 신규 source 라우트 모두 200 | 빌드 결과 spot check |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] `Topic`/`Hazard` enum + 인덱스 타입 + 통제 어휘 위반 빌드 실패 동작
- [ ] 책 17 챕터 + OSHA 5 Part 모두 ≥ 1축 태그 부여
- [ ] 빌드 스크립트 작성 + `prebuild` 훅 등록, `cross-link.json` 생성 확인
- [ ] `RelatedFromOtherSources` 챕터/Part 페이지 양방향 표시 (적어도 silane·HF·arsine 등 7개 cross-link 시각 확인)
- [ ] `ChemicalSourceHub` 화학물질 페이지에 통합, silane 페이지에서 책 + OSHA 동시 노출
- [ ] 양방향 링크 총 ≥ 20쌍
- [ ] `npm run build` + `typecheck` 통과
- [ ] gap-detector Match Rate ≥ 90%

### 4.2 Quality Criteria

- [ ] 공유 태그가 컴포넌트에 시각적으로 표시 (chip 또는 라벨)
- [ ] 관련 항목 0건인 페이지는 패널이 깔끔히 숨김 (빈 박스 노출 없음)
- [ ] 다크모드 일관성 + 디자인 토큰 100% 기존 재사용
- [ ] 책 ↔ OSHA 양방향 (책에서 OSHA로 가는 링크 + OSHA에서 책으로 가는 링크) 양쪽 모두 작동

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 17 챕터 × 5 OSHA × 3축 = 약 66건 수동 태깅 인지 부담 | High | High | 통제 어휘 작게 유지(Topic≤22, Hazard≤12, Chemical=30 기존 ID), 1차 빠른 패스 → 빌드 통과 → 검수 순서 |
| `.mjs` 빌드 스크립트가 `.ts` 데이터 import 불가 | Medium | High | 직전 cycle Design §9.3 결정 적용: `sources.json`/`_book-links.json`/`_links.json` 모두 **JSON으로** 두기 (TS 우회) |
| 패널이 너무 많아져 페이지 가독성 떨어짐 | Medium | Medium | 패널 1개당 표시 최대 6개 (모든 자료원 통합), 공유 태그 수가 많은 순으로 정렬, 0건 시 null |
| 통제 어휘가 부족해 매핑이 부자연스러움 | Medium | Medium | 1차 enum은 OSHA 5 Part 섹션 헤딩에서 추출 + 책 17 챕터 키워드로 보강. 부족하면 본 cycle 안에서 enum 1회 확장 허용 |
| ChemicalId가 chemicals.json에 없는 신규 물질 (예: TMAH) | Low | Medium | 빌드 스크립트에서 경고만 출력, 빌드는 계속 (Design §4.1 정책) |
| 인덱스 정렬·중복 처리 버그 | Medium | Medium | `lib/cross-link/lookup.ts`에 같은 source 내 항목 제외 + 정렬 로직 단위 명시 |
| `predev`/`prebuild`에서 extract-quotes와 빌드 인덱스 순서 잘못 | Medium | Low | `extract-quotes` → `build-cross-link` 순으로 `&&`로 연결 |
| Phase A+B와 동일 브랜치에서 작업 vs 새 브랜치 | Low | High | 새 브랜치 `feat/cross-link-system` 권장 (Phase A+B는 이미 commit `acd234e`로 안정). 사용자 결정 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | 선택 |
|-------|:---:|
| Starter | ☐ |
| **Dynamic** | ☑ (기존 유지) |
| Enterprise | ☐ |

직전 cycle과 동일.

### 6.2 Key Architectural Decisions

| Decision | 옵션 | 선택 | 근거 |
|----------|------|------|------|
| 태그 데이터 위치 | per-MDX frontmatter / 별도 `_links.json` / DB | **별도 `_links.json`** | MDX 수정 최소화, 빌드 스크립트가 단일 위치에서 읽음 |
| 빌드/런타임 데이터 공유 | TS import / JSON | **JSON** | `.mjs`가 `.ts` import 불가 (직전 cycle Design §9.3 결정 적용) |
| 인덱스 구조 | per-section nested / flat by-tag inverted | **두 가지 동시** (`bySection` + `byTopic`/`Hazard`/`Chemical`) | O(1) 양방향 조회. JSON 크기 작음 (≤ 50KB 예상) |
| 패널 컴포넌트 | per-source / 통합 | **통합 (`RelatedFromOtherSources`)** | 자료원 그룹화 헤더로 충분, 컴포넌트 1개 유지 |
| Chemical 페이지 통합 | 기존 컴포넌트 확장 / 신규 hub | **신규 `ChemicalSourceHub`** | 화학물질은 cross-link의 hub 역할 → 별도 컴포넌트로 책임 분리 |
| Enum 위반 처리 | 경고 / 에러 | **에러 (exit 1)** | 정합성 = 빌드 통과로 보장. 직전 cycle Design §6.1 결정 상속 |
| Chemical 미존재 처리 | 경고 / 에러 | **경고만** | 향후 화학물질 추가 PR 차단 방지 (직전 cycle Design §4.1) |
| 검색 source 필터 위치 | header search / `/quotes` 페이지 | **`/quotes` 페이지** | 검색 컨텍스트는 인용 인덱스가 적합, header는 단순 navigate 유지 |

### 6.3 Folder Structure Preview

```
src/
  data/
    sources.json            (기존)
    _book-links.json        ← NEW (책 17 챕터 태그)
    cross-link.json         ← NEW (빌드 산출물)
  content/sources/osha-scs/
    _links.json             ← NEW (OSHA 5 Part 태그)
    part-*.mdx              (기존)
  lib/
    cross-link/             ← NEW
      schema.ts             ← Topic/Hazard enum, 타입
      lookup.ts             ← 런타임 조회 API
  components/
    cross-link/             ← NEW
      RelatedFromOtherSources.tsx
      ChemicalSourceHub.tsx
  app/
    chapter/[slug]/page.tsx ← EXTEND (패널 삽입)
    sources/osha-scs/[part]/page.tsx ← EXTEND
    chemicals/[id]/page.tsx ← EXTEND
    quotes/page.tsx         ← EXTEND (source 필터, optional)
scripts/
  extract-quotes.mjs        (기존)
  build-cross-link-index.mjs ← NEW
package.json                ← EXTEND (prebuild에 build:cross-link 추가)
```

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

기존 cycle에서 정립한 컨벤션 그대로 적용:

- 컴포넌트 PascalCase, lib camelCase, kebab-case ID
- 디자인 토큰 100% 기존 재사용 (신규 Tailwind 토큰 0)
- 외부 링크 `target="_blank" rel="noopener noreferrer"`
- 정적 사이트 ENV 0개

### 7.2 Conventions to Define/Verify

| Category | 적용 |
|----------|------|
| `_links.json` 위치 | `src/content/sources/{sourceId}/_links.json` (OSHA) 또는 `src/data/_book-links.json` (책 챕터, MDX 외부) |
| Topic enum 명명 | `kebab-case`, 1~3 단어 (`gas-safety`, `engineering-controls`) |
| 태그 부여 가이드 | 1 section ≥ 1축 (topic 또는 hazard 또는 chemical 중 최소 하나) |
| 어휘 확장 정책 | 본 cycle 내 enum 확장 1회 허용. 그 이후는 별 PR |
| 같은 source 내 자기 참조 | 항상 제외 (lookup 단계) |
| 패널 항목 최대 수 | 6개 (가독성) |

### 7.3 Environment Variables Needed

신규 ENV 0개 (정적 사이트).

### 7.4 Pipeline Integration

직전 cycle처럼 9-phase Pipeline 미사용. PDCA만.

---

## 8. Next Steps

1. [ ] 본 Plan 사용자 검토 및 승인
2. [ ] (선택) 새 branch `feat/cross-link-system` 생성 — 기존 `feat/multi-source-learning-platform`을 main에 머지한 뒤 분기 권장
3. [ ] `/pdca design cross-link-system` — Design 문서 작성 (Topic/Hazard enum 후보, 매트릭스 예시, 빌드 스크립트 의사 코드, 컴포넌트 인터페이스)
4. [ ] `/pdca do cross-link-system` — 구현 (예상 2~3h)
5. [ ] gap-detector → Match Rate ≥ 90% 확인
6. [ ] `/pdca report` → `/pdca archive --summary`

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-30 | 초안: 직전 cycle Phase C 분리분을 자체 cycle로 정식화 | DrunkenZealnut |
