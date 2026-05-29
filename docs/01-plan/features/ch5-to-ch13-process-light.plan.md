# Plan: ch5-to-ch13-process-light

> Sub-batch B of ch3-to-ch17-batch — 9공정 챕터(Ch.5∼Ch.13) light 보강

**작성일**: 2026-05-29
**Feature**: `ch5-to-ch13-process-light`
**Parent batch**: `ch3-to-ch17-batch` (Sub-batch B of A/B/C)
**PDCA Phase**: Plan
**Status**: Draft

---

## Executive Summary

### 1.1 프로젝트 개요

| 항목 | 값 |
|------|---|
| Feature | Ch.5∼Ch.13 9공정 챕터 light 보강 (웨이퍼/클리닝/확산/포토/식각/증착/이온주입/CMP/패키징) |
| Parent | `ch3-to-ch17-batch` Sub-batch B |
| 참조 패턴 | `ch3-ch4-foundation` (묶음 적용 + Ch.1∼Ch.4 인프라 재사용) |
| 시작/예상 완료 | 2026-05-29 / 단일 또는 2 세션 (~5시간) |

### 1.2 결과 요약 목표

| 지표 | 목표 |
|------|------|
| Match Rate | ≥ 90% |
| 챕터당 분량 | 80∼120줄 (현재 21∼30줄, 3∼5배 확장) |
| 책 페이지 이미지 | 9 챕터 × 2∼3장 = 총 18∼27장 |
| 자체 제작 표 | 9 챕터 × 1개 = 총 9개 |
| SourceQuote | 챕터당 ≤ 2 (각 ≤ 150자), 총 9∼18개 |
| Callout | 챕터당 2∼4개, 총 20∼36개 |
| 신규 컴포넌트 / 인프라 | **0 / 0** (재사용) |

### 1.3 Value Delivered

| 관점 | 결과 |
|------|------|
| **Problem (문제)** | Ch.5∼Ch.13이 현재 21∼30줄짜리 "관문" 챕터 — 책의 9공정 핵심 메시지(웨이퍼 제조법, RCA 클리닝, 확산 vs 이온주입, PR 화학물질, 식각 가스, CVD/PVD, 갈륨비소 분진 같은 산업보건 위험)가 사이트에 본격적으로 드러나지 않음. 책 그림(공정 챔버·다이어그램·세부 절차)이 모두 누락. 챕터 페이지가 너무 비어 있어 공정 페이지(/process/*)로 이동하기 전에 챕터 자체로는 학습 가치 부족. |
| **Solution (해결)** | Ch.1∼Ch.4에서 확립한 인프라(`<ImageFigure>`, `<SourceQuote>`, `<Callout>`, `<LayeredExplain>`, `<ChapterRef>`)를 **9 챕터에 한 묶음으로 적용** — Sub-batch A의 묶음 효율을 한 단계 확대. "Light 프로파일"로 챕터당 이미지 2∼3장 + 자체 표 1개 + SourceQuote 1∼2개 + Callout 2∼4개 + ChapterRef. 깊은 내용(공정 절차 11단계, 모든 화학물질 리스트)은 기존 `/process/<name>/` 페이지에 위임 — 챕터는 "공정의 윤곽 + 핵심 산업보건 메시지" 담당. **신규 컴포넌트 0, 신규 인프라 0**. |
| **Function UX Effect (기능 효과)** | (1) 9 챕터 모두 책의 절(節) 구조 반영 + 책 도식 시각화 (2) 챕터별 핵심 산업보건 메시지 1∼2개 (예: Ch.5 갈륨비소 분진, Ch.8 PR MSDS 영업비밀, Ch.10 CVD 부산물, Ch.13 와이어 본딩 솔더 흄) 명시화 (3) 챕터 → 공정 페이지로 자연스러운 두 단계 깊이 (관문 → 상세) (4) **9공정 모두 Ch.4 "클린룸의 역설"·Ch.16 "예상치 못한 부산물" 메시지로 cross-link** — 17 챕터 narrative coherence 완성. |
| **Core Value (핵심 가치)** | **Batch 확산 가속 검증 2단계** — Ch.1(3h) → Ch.2(1.5h) → Ch.3+Ch.4 묶음(2.5h, 챕터당 1.25h) → **Ch.5∼Ch.13 9 챕터 묶음(5h 목표, 챕터당 ~33분)**. 묶음 규모 확대(2 → 9)와 light profile 결합으로 챕터당 시간 50% 추가 감소 목표. 성공 시 Sub-batch C (Ch.14∼Ch.17, 4 챕터 hazard)는 ~5h, **17 챕터 사이트 전체 완성 ~14h 시점 도달**. 이 사이클이 **batch 확장성 가설 핵심 검증**. |

---

## 2. 배경 (Why)

### 2.1 현재 상태

| 챕터 | 파일 | 현재 줄 수 | 위임된 공정 페이지 |
|------|------|:----------:|------|
| Ch.5 웨이퍼 | `05-wafer.mdx` | 25 | `/process/wafer/` |
| Ch.6 클리닝 | `06-cleaning.mdx` | 22 | `/process/cleaning/` |
| Ch.7 확산 | `07-diffusion.mdx` | 21 | `/process/diffusion/` |
| Ch.8 포토 | `08-photolithography.mdx` | 28 | `/process/photolithography/` |
| Ch.9 식각 | `09-etching.mdx` | 25 | `/process/etching/` |
| Ch.10 증착 | `10-deposition.mdx` | 26 | `/process/deposition/` |
| Ch.11 이온주입 | `11-ion-implantation.mdx` | 26 | `/process/ion-implantation/` |
| Ch.12 CMP | `12-cmp.mdx` | 25 | `/process/cmp/` |
| Ch.13 패키징 | `13-packaging.mdx` | 30 | `/process/packaging/` |
| **합계** | | **228** | 9 페이지 |

→ **목표**: 챕터 총 ~900줄 (chapter당 100±20).

### 2.2 데이터 자산 매핑 (data 폴더)

| 챕터 | 데이터 폴더 | 책 페이지 (추정) |
|------|------------|---------------|
| Ch.5 웨이퍼 | `-_47` | 약 p.65∼78 (잉곳·웨이퍼·GaAs) |
| Ch.6 클리닝 | `-_47` | 약 p.78∼84 (RCA, 드라이아이스) |
| Ch.7 확산 | `-_47` | 약 p.84∼92 (확산로) |
| Ch.8 포토 | `-811` (= page 81∼) | p.81∼102 (PR, MSDS, 노광) |
| Ch.9 식각 | `-811` | p.102∼120 (습식/건식, 가스) |
| Ch.10 증착 | `-811` | p.120∼137 (CVD/PVD) |
| Ch.11 이온주입 | `-811` | p.137∼152 (이온 주입기) |
| Ch.12 CMP | `-_toend` | p.152∼165 (슬러리, 연마) |
| Ch.13 패키징 | `-_toend` | p.165∼190 (다이싱∼몰딩∼마킹) |

---

## 3. 요구사항 (Requirements)

### 3.1 기능 요구사항 (Functional)

| ID | 항목 | 우선순위 |
|----|------|:--------:|
| F1 | 9 챕터 모두 light profile 적용 (Hero + 2∼3 ImageFigure + 1 자체 표 + 1∼2 SourceQuote + 2∼4 Callout + ChapterRef) | P0 |
| F2 | 데이터 폴더에서 챕터별 핵심 도식 추출 → `public/source-images/ch{N}/` | P0 |
| F3 | 각 폴더 `_credits.json` (Ch.3/Ch.4 패턴) | P0 |
| F4 | 챕터별 자체 제작 표 1개 (예: 공정 단계 / 비교 / 화학물질 분류) | P1 |
| F5 | 책 핵심 산업보건 메시지 SourceQuote 1∼2개 | P0 |
| F6 | 챕터 ↔ 공정 페이지 cross-link 보강 (관문 역할 유지) | P1 |
| F7 | Cross-chapter ChapterRef + Ch.4·Ch.16 narrative 연결 | P1 |

### 3.2 비기능 요구사항 (Non-Functional)

| ID | 항목 |
|----|------|
| N1 | 빌드 정상 (NEXT_PUBLIC_BASE_PATH=/semiconductor-academy npm run build) — 70 페이지 유지 |
| N2 | 저작권 안전 — SourceQuote ≤ 2/챕터 (each ≤ 150자), 자체 표 ≥ 1/챕터, 책 표 직접 복제 금지 |
| N3 | 책 이미지 maxWidth ≤ 600px (cover 520px) + 출처 명시 |
| N4 | `~` → `∼` (U+223C) GFM strikethrough 회피 (Ch.3/Ch.4 패턴) |
| N5 | 신규 컴포넌트 / 인프라 0개 |

### 3.3 저작권 정책 (Ch.1∼Ch.4와 동일)

| 항목 | 정책 |
|------|------|
| SourceQuote | 챕터당 ≤ 2, 각 ≤ 150자, 페이지·섹션 명시 |
| 자체 제작 표 | 9 챕터 × 1 = 총 9개 (저작권 무관) |
| 책 표 직접 복제 | **금지** — 항상 자체 재구성으로 대체 |
| 책 이미지 | maxWidth ≤ 600px + `source` 속성 + `_credits.json` |
| 본문 | 책 절 구조 따르되 자체 서술 (요약 + 비유) |

---

## 4. 산출물 (Deliverables)

| 카테고리 | 항목 | 수량 |
|---------|------|:----:|
| 자산 폴더 | `public/source-images/ch{5..13}/` | 9개 신규 |
| 책 이미지 | jpeg 복사 | 18∼27장 |
| Credits | `_credits.json` | 9개 |
| MDX 재작성 | `src/content/chapters/{05..13}-*.mdx` | 9개 |
| 자체 표 | markdown table | 9개 |
| SourceQuote | `<SourceQuote>` | 9∼18개 |
| Callout | `<Callout>` | 20∼36개 |
| 문서 | analysis + report | 2개 (Check/Report phase) |

---

## 5. 범위 (Scope)

### 5.1 In Scope
- Ch.5∼Ch.13 9 챕터 MDX 본문 light 확장
- 챕터별 책 이미지 2∼3장 + `_credits.json`
- 챕터별 자체 표 1개
- 챕터별 SourceQuote 1∼2개 + Callout 2∼4개
- Cross-chapter narrative 보강 (Ch.4 클린룸·Ch.16 부산물)
- 빌드 검증 + commit + push

### 5.2 Out of Scope
- 공정 페이지(`/process/<name>/`) 수정 — 별도 사이클
- 신규 컴포넌트 추가
- ChemicalCard 깊은 통합 (해당 공정 페이지에 위임)
- 책 표의 직접 복제 (저작권 위반)
- Ch.14∼Ch.17 (Sub-batch C에서)

---

## 6. 마일스톤 (Milestones)

| Phase | 작업 | 예상 시간 |
|------|------|:----:|
| Plan | 본 문서 | 30m |
| Design | 챕터별 이미지 매핑 + 자체 표 명세 + SourceQuote 후보 | 30m |
| Do A | Ch.5∼Ch.7 (3 챕터, 47 폴더) | 1.5h |
| Do B | Ch.8∼Ch.11 (4 챕터, 811 폴더) | 2h |
| Do C | Ch.12∼Ch.13 (2 챕터, toend 폴더) | 1h |
| Check + Report | analysis + report | 30m |
| **합계** | | **~6h** (목표 5h, 1h 버퍼) |

---

## 7. Open Questions

| ID | 질문 | 결정 시점 | 후보 |
|----|------|----------|------|
| Q1 | 챕터당 이미지 평균 2 vs 3 (총 18 vs 27장) | Design | 평균 2.5장 (포토/패키징 등 복잡 챕터 3장, 단순 챕터 2장) |
| Q2 | 자체 표 주제 9개 전체 명세 | Design | 챕터별 1개 — 예: Ch.5 잉곳 11단계, Ch.6 RCA 3단계, Ch.8 포토 6단계, Ch.13 패키징 8단계 |
| Q3 | SourceQuote 챕터당 1 vs 2 | Design | 기본 1개 (산업보건 핵심), 포토·패키징·CMP 등 chemical-heavy 챕터 2개 |
| Q4 | Do 단계를 A/B/C 3 세션 분리 vs 1 세션 9 챕터 일괄 | Design | **1 세션 9 챕터** (묶음 효율 최대화), 단 세션 분리 시 폴더별 batch |
| Q5 | Ch.5의 GaAs warning vs Ch.5 자체 표 위주 | Design | 둘 다 — GaAs Callout warning 유지 + 잉곳 11단계 자체 표 신규 |

---

## 8. 리스크 (Risks)

| ID | 리스크 | 영향 | 대응 |
|----|-------|------|------|
| R1 | 9 챕터 일괄 묶음 시 컨텍스트 과부하 | 품질 저하 | 폴더별 (47→811→toend) 3 단계로 do 분할 |
| R2 | 챕터당 30분 시간 budget 초과 | 5h → 7h+ | light profile 엄수 — 깊은 내용은 공정 페이지 위임 유지 |
| R3 | 데이터 폴더 이미지 식별 어려움 (페이지 표시 없음) | 잘못된 매핑 | Design 단계에서 markdown 본문 인근 jpeg 파일명 순서로 매핑 |
| R4 | Ch.5∼Ch.7 47 폴더 이미지가 Ch.4와 겹쳐 재사용 | 자산 중복 | Ch.4에서 사용한 page 0∼5는 제외, page 10+ 위주 |
| R5 | 저작권 한도 초과 (SourceQuote 길이) | 사용 위반 | 각 ≤ 150자 카운트 검증 (Check phase) |

---

## 9. 의존성 (Dependencies)

| 항목 | 상태 |
|------|------|
| Ch.1∼Ch.4 인프라 (ImageFigure, SourceQuote, Callout, LayeredExplain, ChapterRef) | ✅ 완료 |
| `/process/<name>/` 9 공정 페이지 | ✅ 기존 활용 |
| 데이터 폴더 3개 (47, 811, toend) 책 본문 + 이미지 | ✅ 활용 가능 |
| 책 정보 + 저작권 정책 (About page) | ✅ 완료 |

---

## 10. 성공 기준 (Success Criteria)

- [x] Plan 문서 작성 완료
- [ ] Design 문서에서 Q1∼Q5 결정 + 9 챕터 이미지 매핑 확정
- [ ] Do — 9 챕터 MDX 재작성 + 이미지 18∼27장 복사 + `_credits.json` 9개
- [ ] Build → 70+ 페이지 정적 export 성공
- [ ] Match Rate ≥ 90%
- [ ] 저작권 audit 통과 (SourceQuote ≤ 150자, 자체 표 ≥ 1/챕터)
- [ ] Commit + push + 라이브 9 챕터 200 OK

---

## 11. 참고

- Parent batch: `docs/01-plan/features/ch3-to-ch17-batch.plan.md`
- 패턴 출처: `docs/01-plan/features/ch3-ch4-foundation.plan.md` + `docs/02-design/features/ch3-ch4-foundation.design.md`
- Ch.4 Report 학습: `docs/04-report/ch3-ch4-foundation.report.md` (묶음 효율 1.25h/챕터 실증)
- 원본:
  - `data/20260526_215845_..._-_47/` (Ch.5∼Ch.7)
  - `data/20260527_132608_..._-811/` (Ch.8∼Ch.11)
  - `data/20260527_154313_..._-_toend/` (Ch.12∼Ch.13)
- 책: 「반도체 산업의 유해인자」 윤충식 외 저, 에피스테메
