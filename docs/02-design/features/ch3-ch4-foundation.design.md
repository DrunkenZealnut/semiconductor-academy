# Design: ch3-ch4-foundation

> Sub-batch A — Ch.3/Ch.4 이미지 매핑 + MDX 구조 명세

**작성일**: 2026-05-29
**Feature**: `ch3-ch4-foundation`
**PDCA Phase**: Design
**Linked Plan**: [docs/01-plan/features/ch3-ch4-foundation.plan.md](../../01-plan/features/ch3-ch4-foundation.plan.md)
**Status**: Draft

---

## 0. Open Questions 결정 (Plan Q1~Q4)

| ID | 질문 | **결정** | 근거 |
|----|------|---------|------|
| Q1 | Ch.3 ProcessDiagram 위치 | **Hero + 표지 이미지 직후, §1 시작 전** | Ch.1/Ch.2의 표지 → 본문 흐름과 일관, ProcessDiagram이 §1 "공정 개요"의 메인 시각 자료 |
| Q2 | Ch.4 47 폴더 이미지 매핑 | **§4.2의 4장 매핑 확정** (page_0 표지/도입, page_2 구조, page_5 청정도) | data 폴더 직접 확인 — 책 4장 영역에 있는 jpeg 4개 사용 |
| Q3 | 자체 표 3개 vs 2개 | **3개** (Ch.3 전공정/후공정, Ch.4 Class 등급, Ch.4 방진복 구성) | 학습 가치 큼, 저작권 무관 |
| Q4 | 마무리 요약 Callout | **Ch.2 패턴 그대로 — 두 챕터 모두 끝에 요약 Callout** | Ch.2에서 narrative closure 효과 검증됨 |

---

## 1. 아키텍처 (변경 없음)

Ch.1/Ch.2에서 확립된 모든 인프라 재사용:
- `<ImageFigure />` + `<Lightbox />`, `<FontSizeToggle />`
- `<SourceQuote />`, `<Callout />`, `<LayeredExplain />`, `<Term />`, `<ChapterRef />`
- `<ProcessDiagram />` (Ch.3에 재사용 — variant="compact" 또는 기본)

**신규 컴포넌트 0**. **신규 인프라 0**.

---

## 2. 폴더/파일 추가·변경

### 2.1 신규 자산

```
public/source-images/ch3/                ★ NEW 폴더
  ├── ch3-cover.jpg          (← _page_36_Picture_0.jpeg, 1장 폴더)
  ├── fig-3-1-overview.jpg   (← _page_38_Figure_0.jpeg)
  ├── fig-3-2-wafer.jpg      (← _page_40_Figure_3.jpeg)
  ├── fig-3-3-assembly.jpg   (← _page_43_Picture_0.jpeg)
  ├── fig-3-4-support.jpg    (← _page_44_Figure_0.jpeg)
  └── _credits.json

public/source-images/ch4/                ★ NEW 폴더
  ├── ch4-cover.jpg          (← _page_0_Picture_0.jpeg, 47 폴더)
  ├── fig-4-1-intro.jpg      (← _page_0_Figure_3.jpeg, 4장 도입 일러스트)
  ├── fig-4-2-structure.jpg  (← _page_2_Figure_0.jpeg, 클린룸 구조)
  ├── fig-4-3-airflow.jpg    (← _page_5_Figure_0.jpeg, 공기 흐름·청정도 도식)
  └── _credits.json
```

### 2.2 변경

```
src/content/chapters/03-process-overview.mdx    61줄 → ~220줄 전면 재작성
src/content/chapters/04-cleanroom.mdx           68줄 → ~240줄 전면 재작성
```

---

## 3. 이미지 자산 매핑

### 3.1 Ch.3 (5장) — 1장 폴더에서

| public | 원본 (data) | 책 위치 | 캡션 |
|--------|-----------|--------|------|
| `ch3-cover.jpg` | `_page_36_Picture_0.jpeg` | p.45 | 제3장 — 반도체 제조 공정의 전반적 이해 |
| `fig-3-1-overview.jpg` | `_page_38_Figure_0.jpeg` | p.47 | 그림 3-1. 9단계 반도체 제조 공정 흐름 |
| `fig-3-2-wafer.jpg` | `_page_40_Figure_3.jpeg` | p.49 | 그림 3-2. 실리콘 웨이퍼 제조 단계 |
| `fig-3-3-assembly.jpg` | `_page_43_Picture_0.jpeg` | p.52 | 그림 3-3. 칩 조립 및 검사 공정 |
| `fig-3-4-support.jpg` | `_page_44_Figure_0.jpeg` | p.53 | 그림 3-4. 반도체 공장 지원 산업 |

### 3.2 Ch.4 (4장) — 47 폴더에서

| public | 원본 (data) | 책 위치 | 캡션 |
|--------|-----------|--------|------|
| `ch4-cover.jpg` | `_page_0_Picture_0.jpeg` | p.55 | 제4장 표지 |
| `fig-4-1-intro.jpg` | `_page_0_Figure_3.jpeg` | p.55 | 그림 4-1. 클린룸 도입 일러스트 |
| `fig-4-2-structure.jpg` | `_page_2_Figure_0.jpeg` | p.57 | 그림 4-2. 클린룸의 구조 |
| `fig-4-3-airflow.jpg` | `_page_5_Figure_0.jpeg` | p.59 | 그림 4-3. 공기 청정도 관리 도식 |

### 3.3 `_credits.json` (Ch.1/Ch.2 형식 그대로)

각 폴더에 정책 + 이미지별 메타 (file/type/source/page/license).

---

## 4. Ch.3 MDX 구조 (~220줄)

```
LayeredExplain Hero (모래에서 칩까지 비유)
ImageFigure ch3-cover
ProcessDiagram                       ← Q1 결정: 인터랙티브 9공정

## 1. 반도체 제조 공정 개요
  본문: 9공정 큰 그림 + 전공정/후공정 분리
  ImageFigure fig-3-1-overview
  [자체 표] 전공정 vs 후공정 비교 ← Q3 결정
  Callout: 무어/황의 법칙 (Ch.1, Ch.2와 연결)
  SourceQuote: 공정 개요 핵심 (~120자)

## 2. 실리콘 웨이퍼 제조
  본문: 잉곳 → 슬라이싱 → 폴리싱
  ImageFigure fig-3-2-wafer

## 3. 웨이퍼 가공
  본문: 전공정 12 단계 요약 (포토/식각/증착 등) — 깊이는 /process/* 위임

## 4. 칩 조립 및 검사
  본문: 후공정 (다이싱/본딩/몰딩/마킹/솔더볼/검사)
  ImageFigure fig-3-3-assembly

## 5. 기타 공정
### 가. 클린룸 외 공정
### 나. 반도체 공장 지원 산업 — 협력업체 누락 issue
  ImageFigure fig-3-4-support
  SourceQuote: 후공정·협력업체 사각지대 (~140자)

Callout 요약 (Q4)
ChapterRef order=4
```

### 4.1 자체 제작 표 — 전공정 vs 후공정

| 단계 | 공정 | 환경 | 주체 | 산업보건 이슈 |
|------|------|------|------|------------|
| **전공정 (Front-End)** | 1~12 (웨이퍼 가공) | 클린룸 | 대기업 자체 | 자동화, 정비/세정 노출 |
| **후공정 (Back-End)** | 13 (패키징) | 일반 공장 | 다수 OSAT 협력업체 | **자료 누락, 사각지대** |

---

## 5. Ch.4 MDX 구조 (~240줄)

```
LayeredExplain Hero (수술실보다 1만 배 비유 — 기존 유지)
ImageFigure ch4-cover

## 1. 반도체 사업장 클린룸의 이해
  본문: 회로 폭 = 머리카락 1만분의 1 → 먼지 한 톨도 안 됨
  ImageFigure fig-4-1-intro
  Callout: 클린룸의 역할

## 2. 클린룸의 공기 청정도 관리
  본문: HEPA 필터 + 양압 + 수직층류
  [자체 표] Class 등급 비교 ← Q3 결정
  ImageFigure fig-4-2-structure
  ImageFigure fig-4-3-airflow
  SourceQuote: 청정도 관리 핵심 (~120자)

## 3. 반도체 사업장의 클린룸 유지
  본문: 정기 측정, HEPA 교체, 환기 제한과 그 부작용

## 4. 반도체 산업의 전실과 방진복
  본문: 전실(에어샤워) + 방진복 (피부 각질·머리카락 차단)
  [자체 표] 방진복 구성 요소 ← Q3 결정

## 5. 클린룸에 대한 산업보건학적 시각
  본문: 클린룸의 역설 — 깨끗함과 화학 노출은 별개
  Callout warning: 누적 노출 (8~12시간 폐쇄 공간)
  SourceQuote: 클린룸의 역설 (~140자)

Callout 요약 (Q4)
ChapterRef order=5
```

### 5.1 자체 제작 표 — Class 등급 비교

| Class | 0.5μm 먼지 (ft³당) | 비교 환경 | 적용 영역 |
|:---:|:---:|------|------|
| 100,000 | 10만 개 | 일반 사무실 | 부속 시설 |
| 10,000 | 1만 개 | 일반 병원 | 패키징 일부 |
| 1,000 | 1,000 개 | 수술실 | 반도체 일반 영역 |
| 100 | 100 개 | 첨단 수술실 | 반도체 식각·증착 |
| **1** | **1 개** | **— (불가)** | **반도체 포토 등 핵심** |

### 5.2 자체 제작 표 — 방진복 구성 요소

| 부위 | 항목 | 차단 대상 |
|------|------|---------|
| 상의 | 일체형 후드 + 소매 잠금 | 머리카락·피부 각질 |
| 마스크/고글 | N95 또는 입자 마스크 + 보호안경 | 호흡 입자·눈 |
| 장갑 | 라텍스/니트릴 이중 | 손 |
| 신발 | 부츠형 슈커버 | 발·신발 분진 |
| 진입 전 | 에어샤워 (전실) | 외부에서 묻혀온 입자 |

---

## 6. 저작권 정책 (Ch.1/Ch.2와 동일)

| 항목 | 정책 |
|------|------|
| SourceQuote | 챕터당 2개, 각 ≤ 150자, 페이지·섹션 출처 |
| 자체 제작 표 | 3개 (저작권 무관) |
| 책 페이지 이미지 | maxWidth 600px + 출처 명시 + `_credits.json` |
| 본문 | 책 흐름 따르되 자체 서술 |

---

## 7. 구현 순서 (Do Phase 가이드)

| Phase | 작업 | 시간 |
|------|------|------|
| A | 이미지 9장 복사 (Ch.3 5 + Ch.4 4) + 2 `_credits.json` | 30m |
| B | Ch.3 MDX 재작성 — Hero + ProcessDiagram + §1~§5, 자체 표 1개 + ImageFigure 5장 + SourceQuote 2개 + Callout 5개 + 요약 | 50m |
| C | Ch.4 MDX 재작성 — Hero + §1~§5, 자체 표 2개 + ImageFigure 4장 + SourceQuote 2개 + Callout 5개 + 요약 | 50m |
| D | 빌드 검증 + commit + push + Pages 배포 + 라이브 200 확인 | 10m |
| **합계** | | **~2.5h** |

---

## 8. 빌드 영향

| 항목 | 이전 | 이후 |
|------|------|------|
| 정적 페이지 | 58 | 58 |
| MDX 파일 | 31 | 31 |
| 공개 자산 | 20 | **31** (+11: 9 jpeg + 2 credits) |
| 컴포넌트 | 28 | 28 |

---

## 9. 미해결 결정 (Do에서)

| ID | 질문 | 결정 시점 |
|----|------|----------|
| Q-D1 | Ch.3 §3 웨이퍼 가공 부분에 ChemicalCard 임베드 여부 (공정 페이지 위임 vs 챕터 self-contained) | Phase B |

---

## 10. 참고

- Plan: `docs/01-plan/features/ch3-ch4-foundation.plan.md`
- Parent batch: `docs/01-plan/features/ch3-to-ch17-batch.plan.md`
- Ch.1, Ch.2 패턴: 각각의 design.md
- 원본: `data/20260526_185841_..._-_13/*.md` (Ch.3) + `data/20260526_215845_..._-_47/*.md` (Ch.4)
