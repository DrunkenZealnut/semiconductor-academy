# Plan: source-quote-index

> 인용 인덱스 페이지 — 17챕터에 흩어진 91개 책 원문 인용을 한 페이지에서 검색·탐색

**작성일**: 2026-05-30
**Feature**: `source-quote-index`
**PDCA Phase**: Plan
**Level**: Dynamic
**Status**: Draft
**Parent**: `source-quote-expansion` (선행 작업)

---

## Executive Summary

### 1.1 프로젝트 개요

| 항목 | 내용 |
|------|------|
| Feature | 인용 인덱스 페이지 — 17챕터 SourceQuote + LayeredExplain quote 통합 검색·탐색 도구 |
| 시작일 | 2026-05-30 |
| 예상 완료 | 2026-05-30 (2~3시간) |
| 선행 작업 | `source-quote-expansion` (98% 완료, archived) |

### 1.2 결과 요약 (목표 지표)

| 지표 | 목표 |
|------|------|
| 인용 수집 자동화 | 빌드 타임 `scripts/extract-quotes.mjs` |
| 수집 대상 | 17챕터 mdx 모든 `SourceQuote` + `LayeredExplain.deep.quote` |
| 예상 인용 총수 | **91개** (LayeredExplain 17 + SourceQuote 74) |
| 검색 방식 | fuse.js 클라이언트 fuzzy search (이미 설치됨) |
| 검색 가능 필드 | 페이지(p.X), 섹션 제목, 본문 키워드, 챕터 |
| 새 페이지 경로 | `/quotes` |
| 신규 컴포넌트 | 1~2개 (QuoteIndex, QuoteCard) |
| Match Rate | ≥ 90% |

### 1.3 Value Delivered (4-Perspective)

| 관점 | 내용 |
|------|------|
| **Problem (문제)** | 17챕터에 91개의 책 원문 인용이 풍부하게 흩어져 있지만, 학습자가 "p.13 사전주의 원칙은 어디?" 또는 "비소 노출 관련 인용은 다 어디?" 같은 횡단 탐색이 불가능. 매번 챕터 페이지를 개별 방문해 Ctrl+F로 찾아야 함. |
| **Solution (해결)** | (1) 빌드 타임 스크립트가 17챕터 mdx를 정규식 파싱해 인용을 JSON으로 추출, (2) `/quotes` 페이지에서 fuse.js로 클라이언트 검색, (3) 페이지/섹션/키워드/챕터 4축 검색, (4) 각 인용 카드에서 원래 챕터로 직접 점프, (5) "책 p.X" 보고 어느 챕터에서 인용했는지 역추적 가능. |
| **Function UX Effect (기능 효과)** | (1) "사전주의 원칙" 검색 → Ch.1 + Ch.17 두 곳 동시 발견, (2) "p.13" 검색 → 해당 페이지의 모든 인용 한눈에, (3) "비소" 검색 → Ch.5/7/11/14 횡단 결과, (4) 각 카드 클릭 → 해당 챕터 + 섹션으로 jumpto, (5) 모바일에서도 사용 가능한 깔끔한 카드 UI. |
| **Core Value (핵심 가치)** | **"흩어진 91개 책 원문 → 검색 가능한 통합 도구"**. source-quote-expansion이 인용 콘텐츠를 만들었다면, source-quote-index는 그 콘텐츠의 **활용도를 극대화**하는 도구. 학술서 한 권을 학습 자료로 만든 사이트의 정체성을 한 단계 완성. |

---

## 2. 기술 설계

### 2.1 데이터 흐름

```
17 챕터 mdx 파일
  ↓ (빌드 전 실행)
scripts/extract-quotes.mjs (정규식 파싱)
  ↓
src/data/quotes.json (자동 생성)
  ↓ (Next.js 빌드 시 import)
/quotes 페이지 (fuse.js 검색)
  ↓ (사용자 클릭)
챕터 페이지 (해시 anchor)
```

### 2.2 추출 스크립트 (`scripts/extract-quotes.mjs`)

#### 입력
- `src/content/chapters/*.mdx` 17개 파일

#### 추출 대상

**A. LayeredExplain.deep**
```
<LayeredExplain
  ...
  deep={{
    sourcePage: 13,
    sourceSection: '1장 - 사전주의 원칙',
    quote: (
      <>
        <p>본문 텍스트...</p>
      </>
    ),
  }}
/>
```

**B. SourceQuote**
```
<SourceQuote page={11} section="1장 - 산업보건학적 시각의 4가지 특성">
  본문 텍스트...
</SourceQuote>
```

#### 출력 (`src/data/quotes.json`)

```json
[
  {
    "id": "ch01-layered-explain",
    "chapter": 1,
    "chapterTitle": "Chapter 1. 새 기술의 위험성",
    "chapterSlug": "risks-of-new-tech",
    "type": "layered-explain",
    "page": 13,
    "section": "1장 - 사전주의 원칙",
    "text": "이럴 경우 회사나 작업자는... (HTML 태그 제거된 plain text)",
    "snippet": "이럴 경우 회사나 작업자는 최대한 유해인자..."
  },
  {
    "id": "ch01-source-quote-1",
    "chapter": 1,
    "chapterSlug": "risks-of-new-tech",
    "type": "source-quote",
    "page": 10,
    "section": "1장 가. 역사적 경험에 따른 새 기술의 위험성",
    "text": "새로운 기술이나 새로운 물질이 인류 사회에 도입될 때는...",
    "snippet": "새로운 기술이나 새로운 물질이 인류 사회에..."
  }
  // ... 91개
]
```

### 2.3 페이지 컴포넌트

#### `src/app/quotes/page.tsx`
- 서버 컴포넌트가 `quotes.json` 로드
- 클라이언트 컴포넌트 `QuoteIndex`에 props로 전달

#### `src/components/quote-index/QuoteIndex.tsx` (NEW, 'use client')
- fuse.js 검색 (필드: text, section, chapterTitle, page)
- 검색창 + 필터 (챕터 선택, 페이지 범위)
- 결과 리스트 → `QuoteCard`

#### `src/components/quote-index/QuoteCard.tsx` (NEW)
- 챕터 배지 + 페이지 + 섹션
- snippet (3줄 미리보기)
- "📖 챕터로 가기" 링크 → `/chapter/{slug}/#section-anchor` (가능하면)

### 2.4 빌드 통합

#### `package.json`
```json
"scripts": {
  "extract:quotes": "node scripts/extract-quotes.mjs",
  "prebuild": "npm run extract:quotes",
  "predev": "npm run extract:quotes"
}
```

빌드/개발 서버 시작 전에 자동 실행 → `src/data/quotes.json` 항상 최신.

### 2.5 의존성

| 패키지 | 상태 | 용도 |
|--------|:--:|------|
| fuse.js | ✅ 설치됨 | 클라이언트 fuzzy search |
| @types/node | ✅ 설치됨 | 스크립트 타입 |
| (Node 내장) | — | fs, path, glob 패턴 |

신규 의존성 추가 없음.

---

## 3. 단계별 실행 계획

### Phase A — 추출 스크립트 (40분)

1. `scripts/extract-quotes.mjs` 작성
2. 정규식 + plain text 변환 로직
3. 17챕터 파싱 → `src/data/quotes.json` 생성
4. 수동 검증: 91개 인용 모두 포함됐는지

### Phase B — 페이지 + 컴포넌트 (60분)

1. `src/app/quotes/page.tsx` (서버 컴포넌트, quotes.json 로드)
2. `src/components/quote-index/QuoteIndex.tsx` (검색·필터 UI)
3. `src/components/quote-index/QuoteCard.tsx` (개별 인용 카드)
4. 챕터 링크 + 페이지 번호 표시

### Phase C — 빌드 통합 + 네비게이션 (30분)

1. `package.json`에 `prebuild`, `predev` 훅 추가
2. 사이트 Header/Footer에 `/quotes` 링크 추가
3. 홈 페이지에서 "인용 검색" 진입점 표시
4. 빌드 + 시각 확인

### Phase D — 검증 (15분)

1. `/quotes` 페이지 진입 → 91개 카드 표시
2. "사전주의 원칙" 검색 → Ch.1 + Ch.17 결과
3. "p.13" 검색 → 해당 페이지 인용들
4. 카드 클릭 → 챕터 페이지 이동
5. 모바일 뷰포트 점검

---

## 4. 성공 기준 (Acceptance Criteria)

| 번호 | 기준 | 측정 방법 |
|------|------|---------|
| AC-1 | `/quotes` 페이지가 정상 빌드/표시 | 빌드 통과 + 페이지 접속 |
| AC-2 | quotes.json에 ≥ 88개 인용 (91개 목표, fuzzy 허용) | `cat src/data/quotes.json \| jq length` |
| AC-3 | LayeredExplain 17개 + SourceQuote ≥ 70개 추출 | 타입별 카운트 |
| AC-4 | fuse.js 검색이 키워드/페이지/섹션에서 동작 | 수동 테스트 |
| AC-5 | 각 카드에서 원래 챕터로 링크 동작 | 클릭 테스트 |
| AC-6 | 빌드 통합 (`prebuild` 자동 실행) | npm run build 시 추출 실행 |
| AC-7 | Header 또는 Footer에 `/quotes` 진입점 | 시각 확인 |
| AC-8 | 모바일 뷰포트에서 깨짐 없음 | 반응형 점검 |
| AC-9 | TypeScript 타입 안전성 (QuoteItem 인터페이스) | typecheck 통과 |

---

## 5. 위험 요소 & 대응

| 위험 | 대응 |
|------|------|
| MDX의 JSX 안에 있는 quote 추출이 정규식으로 깨끗하지 않을 수 있음 | 가능한 한 단순 정규식 + 필요 시 mdast/remark 파서 도입 검토 |
| HTML 태그 제거 후 텍스트 가독성 | `<strong>`, `<p>` 등 변환 규칙 명시 (strong → 그대로 단어 유지) |
| 챕터 페이지의 anchor가 인용 위치까지 정확히 jumpto 안 될 수 있음 | 1차로 챕터 페이지 진입까지만 보장. anchor는 best-effort. |
| 91개 카드 한 페이지에 띄우면 초기 로딩 무거움 | 모든 카드는 가벼움 (page/section/snippet만). 91 × ~200 bytes = 18KB JSON. 부담 없음. |
| 빌드 prebuild 훅이 다른 환경에서 안 도는 경우 | manual `npm run extract:quotes` 명령도 유지 |

---

## 6. 다음 단계

- 이 Plan 승인 시 → 즉시 Phase A 시작 (Design 생략, Plan이 상세)
- Phase A 완료 시 → quotes.json 결과 사용자 확인
- Phase B~D 진행

---

**작성자**: Claude (bkit:pdca plan)
**예상 시간**: 2~3시간
**선행 작업**: `source-quote-expansion` (archived, 98%)
