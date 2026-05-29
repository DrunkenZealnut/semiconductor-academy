# Plan: ch3-ch4-foundation

> Sub-batch A — Ch.3 제조 공정 개요 + Ch.4 클린룸 풀 깊이 확장

**작성일**: 2026-05-29
**Feature**: `ch3-ch4-foundation`
**PDCA Phase**: Plan
**Level**: Dynamic
**Status**: Draft
**Parent**: `ch3-to-ch17-batch` (Sub-batch A)

---

## Executive Summary

### 1.1 프로젝트 개요

| 항목 | 내용 |
|------|------|
| Feature | Ch.3 (제조 공정 개요) + Ch.4 (클린룸) 풀 깊이 확장 |
| 참조 패턴 | Ch.1 (94%) + Ch.2 (96%) — 동일 패턴 그대로 |
| 시작일 | 2026-05-29 |
| 예상 완료 | 2026-05-29 (당일, ~2.5시간) |
| Parent batch | `ch3-to-ch17-batch` — Sub-batch A (3 sub-batch 중 첫 번째) |

### 1.2 결과 요약 (목표 지표)

| 지표 | 목표 |
|------|------|
| Ch.3 분량 | 61줄 → **200~240줄** |
| Ch.4 분량 | 68줄 → **220~260줄** |
| 책 페이지 이미지 | **8~10장** (Ch.3 4~5장 + Ch.4 4~5장) |
| 자체 제작 표 | **2~3개** (Ch.3 전공정/후공정, Ch.4 클래스 등급) |
| 책 표 (fair use) | 0~1개 (책에 따라) |
| SourceQuote | **4개** (각 ≤150자, Ch.3 2개 + Ch.4 2개) |
| 신규 컴포넌트 | **0** |
| Match Rate | ≥ 90% |

### 1.3 Value Delivered (4-Perspective)

| 관점 | 내용 |
|------|------|
| **Problem (문제)** | Ch.3, Ch.4는 책의 도입부(foundation) 챕터인데도 현재 61, 68줄짜리 요약. 책의 9공정 다이어그램, 클린룸 공기 흐름 도식, Class 등급표 등이 사이트에 없어 학술 깊이가 낮음. Ch.1, Ch.2 수준의 풍부함이 부재. |
| **Solution (해결)** | Ch.1/Ch.2 패턴 그대로 적용. Ch.3은 책의 절(웨이퍼 제조 → 가공 → 조립/검사 → 기타 공정) 구조 유지하면서 ProcessDiagram 임베드 + 책 페이지 그림 4~5장 + 자체 제작 전공정/후공정 비교 표. Ch.4는 책의 절(클린룸 이해 → 공기 청정도 → 클린룸 유지 → 전실·방진복 → 산업보건학적 시각) 구조 유지하면서 Class 등급 표 + 책 도식 4~5장. 각 챕터 SourceQuote 2개 + Callout 4~5개. |
| **Function UX Effect (기능 효과)** | (1) Ch.3에 ProcessDiagram + 책의 공정 도식 결합 — 사이트의 9공정 카드와 책의 학술 표현 둘 다 노출 (2) Ch.4에 Class 1/100/1000/100000 등급 비교 표 + 클린룸 공기 흐름 도식 (3) "**클린룸의 역설**" 핵심 메시지를 책의 표현으로 SourceQuote (4) 두 챕터가 1, 2장의 연속성을 살려 사이트의 도입부(ch1~ch4) 4 챕터를 일관된 깊이로 통일 |
| **Core Value (핵심 가치)** | **사이트 도입부 완성** — Ch.1(위험성) + Ch.2(반도체란) + Ch.3(제조 공정) + Ch.4(클린룸)가 모두 같은 깊이로 통일되면 사용자가 책 도입부 4 챕터를 자연스럽게 정독할 수 있음. 학습 entry experience의 일관성 확보. Sub-batch A 완료 시 17챕터 중 4 챕터가 풀 깊이로 완성. |

---

## 2. 작업 정의

### 2.1 Ch.3 — 반도체 제조 공정의 전반적 이해

#### 책의 구조 (p.45~54)

| 절 | 제목 |
|----|------|
| 1 | 반도체 제조 공정 개요 |
| 2 | 실리콘 웨이퍼 제조 |
| 3 | 웨이퍼 가공 |
| 4 | 칩 조립 및 검사 |
| 5 | 기타 공정 (가. 클린룸 외 공정, 나. 반도체 공장 지원 산업) |

#### 작업 목표

- 본문 61 → 200~240줄
- ImageFigure **4~5장** (책 도입 일러스트 + 9공정 도식 + 가공 도식 + 조립 도식 + 후공정/지원 산업)
- 자체 표 **1개**: 전공정 vs 후공정 비교 (현재 ch3에 부분 있음, 확장)
- 자체 표 **1개** (옵션): 협력업체 산업 분야
- SourceQuote **2개**: 공정 개요 + 후공정 사각지대
- Callout **4~5개**
- ProcessDiagram 임베드 유지

#### 책 페이지 이미지 후보 (1장 폴더에서)

| public 경로 | 원본 | 추정 내용 |
|------------|------|---------|
| `ch3-cover.jpg` | `_page_36_Picture_0.jpeg` | 3장 도입 |
| `fig-3-1-overview.jpg` | `_page_38_Figure_0.jpeg` | 9공정 흐름도 |
| `fig-3-2-wafer.jpg` | `_page_40_Figure_3.jpeg` | 실리콘 웨이퍼 제조 |
| `fig-3-3-assembly.jpg` | `_page_43_Picture_0.jpeg` | 칩 조립 |
| `fig-3-4-support.jpg` | `_page_44_Figure_0.jpeg` | 지원 산업 |

### 2.2 Ch.4 — 클린룸과 유해인자

#### 책의 구조 (p.55~65)

| 절 | 제목 |
|----|------|
| 1 | 반도체 사업장 클린룸의 이해 |
| 2 | 클린룸의 공기 청정도 관리 |
| 3 | 반도체 사업장의 클린룸 유지 |
| 4 | 반도체 산업의 전실과 방진복 |
| 5 | 클린룸에 대한 산업보건학적 시각 |

#### 작업 목표

- 본문 68 → 220~260줄
- ImageFigure **4~5장** (클린룸 표지 + 공기 흐름 + 청정도 등급 도식 + 전실 + 방진복)
- 자체 표 **1~2개**: Class 등급 비교 (현재 부분 있음, 강화), 방진복 구성 요소
- SourceQuote **2개**: 클린룸의 역설 + 작업자 누적 노출
- Callout **4~5개**: 의도된 역설, 방진복, 화학물질 노출 등

#### 책 페이지 이미지 후보 (47 폴더에서)

| public 경로 | 원본 (47 폴더) | 추정 내용 |
|------------|---------------|---------|
| `ch4-cover.jpg` | `_page_0_Figure_3.jpeg` (또는 _page_0_Picture_0) | 4장 도입 |
| `fig-4-1-cleanroom.jpg` | TBD (확인 필요) | 클린룸 구조 도식 |
| `fig-4-2-airflow.jpg` | TBD | 수직층류 공기 흐름 |
| `fig-4-3-class.jpg` | TBD | Class 등급별 입자 수 |
| `fig-4-4-suit.jpg` | TBD | 방진복 구성 |

> **Phase A에서 확인 후 매핑 확정** (Q-D2).

---

## 3. 목표 & 비목표

### 3.1 목표

- [G1] Ch.3 본문 61 → 200~240줄
- [G2] Ch.4 본문 68 → 220~260줄
- [G3] 두 챕터 모두 책의 5개 절 구조 유지
- [G4] 책 페이지 이미지 8~10장 (각 챕터 4~5장)
- [G5] 자체 제작 표 2~3개
- [G6] SourceQuote 4개 (Ch.3 2개 + Ch.4 2개, 각 ≤150자)
- [G7] 각 챕터 끝에 `<ChapterRef />` 유지
- [G8] Match Rate ≥ 90%

### 3.2 비목표

- 새 컴포넌트 추가 (Ch.1 인프라 100% 재사용)
- 외부 Wikimedia 이미지 (deferred)
- Sub-batch B (process), Sub-batch C (hazard+reflection) — 별도 사이클
- 책의 표 그대로 옮기기 (자체 제작 표로 대체)

---

## 4. 콘텐츠 재구성 전략 (Ch.1/Ch.2 패턴 그대로)

### 4.1 공통 구조

```
[LayeredExplain Hero — 기존 비유 유지]
[ImageFigure 표지]

## 1. 절 1 — 책 흐름 유지
  본문 (자체 서술 + Term 툴팁)
  [ImageFigure 그림]
  [표] 자체 제작
  [Callout] 핵심 강조

## 2. ...
  [SourceQuote] (≤150자)

...

[ChapterRef order={N+1}]
```

### 4.2 저작권 정책 (Ch.1/Ch.2 동일)

- SourceQuote: 챕터당 2개, 각 ≤150자, 출처 명시
- 책 표: 그대로 인용 안 함 (자체 제작 표로 대체)
- 책 페이지 이미지: maxWidth 600px, `_credits.json` 메타
- 본문: 책 흐름·구조 따르되 **자체 서술**

---

## 5. 기술 변경 (최소)

| 항목 | 변경 |
|------|------|
| 신규 컴포넌트 | **0** |
| 신규 자산 | `public/source-images/ch3/` + `ch4/` 폴더 + 8~10 jpeg + 2 `_credits.json` |
| MDX 변경 | `src/content/chapters/03-process-overview.mdx` + `04-cleanroom.mdx` |
| 라우팅 | 변경 없음 |

---

## 6. Phase 분리 (~2.5h)

| Phase | 작업 | 시간 |
|-------|------|------|
| A | Ch.3, Ch.4 이미지 8~10장 복사 + 2 `_credits.json` (Ch.4 이미지 추정 확정 포함) | 30m |
| B | Ch.3 MDX 깊이 확장 (200~240줄) | 50m |
| C | Ch.4 MDX 깊이 확장 (220~260줄) | 50m |
| D | 빌드 검증 + commit + push + 배포 + 라이브 200 확인 | 10m |
| **합계** | | **~2.5h** |

---

## 7. 리스크 & 완화

| ID | 리스크 | 영향 | 완화 |
|----|-------|------|------|
| R1 | 책 본문 인용 fair use 한계 | High | SourceQuote ≤2개/챕터, 각 ≤150자, Ch.1/Ch.2 정책 그대로 |
| R2 | 책 이미지 저작권 | High | maxWidth 600px + 출처 명시 + `_credits.json` |
| R3 | Ch.4 이미지 추정 (47 폴더 정확 매핑) | Med | Phase A에서 직접 확인 후 결정, 불확실 시 캡션 일반화 |
| R4 | Ch.3에 ProcessDiagram + 책 도식 중복 | Med | ProcessDiagram = 인터랙티브 / 책 도식 = 정적 학습용 — 역할 분리 |

---

## 8. 성공 기준 (DoD)

- [ ] Ch.3 본문 200~240줄, Ch.4 본문 220~260줄
- [ ] 5개 절 구조 유지 (두 챕터 모두)
- [ ] 책 페이지 이미지 8~10장 + 2 `_credits.json`
- [ ] 자체 표 2~3개
- [ ] SourceQuote 4개 (각 ≤150자)
- [ ] Callout 8~10개 (전체)
- [ ] 빌드 + Pages 배포 + 라이브 200 OK
- [ ] Match Rate ≥ 90%

---

## 9. 미해결 결정 (Design에서 확정)

| ID | 질문 | 결정 시점 |
|----|------|----------|
| Q1 | Ch.3에 ProcessDiagram 위치 (Hero 직후 vs §1 끝) | Design |
| Q2 | Ch.4 이미지 추정 — 47 폴더 어느 jpeg을 클린룸 구조/흐름/등급/방진복에 매핑 | Phase A (직접 확인) |
| Q3 | 자체 표 형식 — Ch.3 전공정/후공정 + Ch.4 Class 등급 + 방진복 (3개) vs 2개로 통합 | Design |
| Q4 | 두 챕터 모두 마무리 요약 Callout 포함 여부 | Design |

---

## 10. 다음 단계

```bash
/pdca design ch3-ch4-foundation
```

→ Design에서 Q1~Q4 확정 + Ch.4 이미지 매핑 (Phase A 전 가설 설정).

---

**참고**
- Parent batch plan: `docs/01-plan/features/ch3-to-ch17-batch.plan.md`
- Ch.1 패턴: `reading-experience-ch1`
- Ch.2 패턴: `ch2-deep-content`
- 원본 자료: `data/20260526_185841_..._-_13/*.md` (Ch.3) + `data/20260526_215845_..._-_47/*.md` (Ch.4)
