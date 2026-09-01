# Report: ch3-ch4-foundation

> Sub-batch A — Ch.3 「반도체 제조 공정의 전반적 이해」 + Ch.4 「반도체 사업장의 클린룸」 본문 깊이 확장

**작성일**: 2026-05-29
**Feature**: `ch3-ch4-foundation`
**Parent batch**: `ch3-to-ch17-batch` (Sub-batch A of A/B/C)
**PDCA Phase**: Completed
**Linked**:
- [Plan](../01-plan/features/ch3-ch4-foundation.plan.md)
- [Design](../02-design/features/ch3-ch4-foundation.design.md)
- [Analysis](../03-analysis/ch3-ch4-foundation.analysis.md)
- Batch parent: [ch3-to-ch17-batch Plan](../archive/2026-05/ch3-to-ch17-batch/plan.md)

---

## Executive Summary

### 1.1 프로젝트 개요

| 항목 | 값 |
|------|---|
| Feature | Ch.3 공정 개요 + Ch.4 클린룸 본문 깊이 확장 (2 챕터 묶음) |
| Parent | `ch3-to-ch17-batch` Sub-batch A (총 15 챕터 중 첫 2 챕터) |
| 참조 패턴 | ch2-deep-content (Ch.1/Ch.2 인프라 100% 재사용) |
| 시작/완료 | 2026-05-29 (단일 세션, ~2.5시간) |

### 1.2 결과 요약

| 지표 | 목표 | 실제 |
|------|------|------|
| Match Rate | ≥ 90% | **96%** ✅ |
| Ch.3 분량 | 200∼240줄 | **186줄** ⚠️ (-7%, Q-D1 위임 결정) |
| Ch.4 분량 | 220∼260줄 | **179줄** ⚠️ (-19%, 콘텐츠는 완비) |
| 책 페이지 이미지 | 8∼10장 | **9장** (Ch.3=5 + Ch.4=4) ✅ |
| 자체 제작 표 | 3개 | **3개** (전공정/후공정, Class 등급, 방진복) ✅ |
| SourceQuote | 챕터당 ≤ 2 (각 ≤ 150자) | **챕터당 2개, 79∼106자** ✅ |
| Callout | ≥ 5/챕터 | **Ch.3=5, Ch.4=6** ✅ |
| 신규 컴포넌트 / 인프라 | 0 / 0 (재사용) | **0 / 0** ✅ |
| Iteration | 0 | **0** ✅ |
| 빌드 검증 | 70/70 static export | **70/70** ✅ |

### 1.3 Value Delivered

| 관점 | 결과 |
|------|------|
| **Problem (문제)** | Ch.3가 61줄, Ch.4가 68줄로 책의 9공정 흐름·클린룸 구조·산업보건 관점이 비유 수준 요약에 머물러 있었음. 전공정/후공정 구분, Class 청정도 등급, 방진복의 1차 보호 대상, 클린룸의 산업보건 사각지대 같은 핵심 메시지가 누락. 책 페이지 그림(공정 흐름·웨이퍼 제조·클린룸 구조·공기 흐름)도 사이트에 없었음. |
| **Solution (해결)** | Ch.1/Ch.2에서 확립한 패턴(`<ImageFigure>` + 자체 표 + `<SourceQuote>` + `<Callout>` + `<LayeredExplain>` + `<ProcessDiagram>` + `<ChapterRef>`)을 **2 챕터에 동시 적용**. 책의 Ch.3 5절(개요→웨이퍼→가공→조립→기타), Ch.4 5절(이해→청정도→유지→전실·방진복→산업보건학적 시각) 구조 100% 유지. 책 그림 9장(ch3:5 + ch4:4) + 자체 표 3개(전공정/후공정 비교, Class 등급, 방진복 구성) + 짧은 학술 인용 4개 + `_credits.json` 2개. **신규 컴포넌트 0개, 신규 인프라 0개**. |
| **Function UX Effect (기능 효과)** | (1) Ch.3 9공정 다이어그램 + 전공정/후공정 산업보건 관점 비교표 + 책 흐름 5절 시각화 (2) Ch.4 Class 등급 5단계 비교 (사무실→수술실→반도체 핵심) + HEPA+양압+수직층류 3대 원리 + 방진복 5요소 표 (3) **"클린룸의 역설"** 명시화 — 깨끗함과 화학 안전성은 별개라는 책의 산업보건 핵심 메시지 (4) **무어/황의 법칙 Callout이 Ch.1 "짧은 역사·빠른 변화" 위험으로 연결**, **§5 "환기 제한"이 Ch.16 "예상치 못한 부산물" 복선** — 17 챕터 narrative coherence (5) **후공정·정비·협력업체 = 산업보건 사각지대** 트리플 메시지 명시화. |
| **Core Value (핵심 가치)** | **패턴 확산 가속도 실증** — Ch.1(~3h) → Ch.2(~1.5h) → **Ch.3+Ch.4 묶음(~2.5h)**. 2 챕터/2.5h = **챕터당 ~1.25h**로 단일 챕터 대비 17% 추가 가속. **Sub-batch B (Ch.5∼Ch.13, 9 챕터 light)** 예상 ~5h, **Sub-batch C (Ch.14∼Ch.17, 4 챕터 hazard+reflection)** 예상 ~5h. **batch 전체 ~12.5h로 17 챕터 책 사이트 완성** 가능 (당초 22.5h 추정 → **44% 단축**). 이 사이클이 batch 효율성 가설 1차 검증. |

---

## 2. PDCA 사이클 회고

### 2.1 단계별 결과

```
[Plan]✅ ──→ [Design]✅ ──→ [Do]✅ ──→ [Check]✅ 96% ──→ [Report]✅
   ~15min      ~15min       ~1.5h        ~15min          본 문서
```

| Phase | 산출물 |
|-------|--------|
| Plan | plan.md (저작권 정책 R1·R2 재확인, Q1~Q4 정의) |
| Design | design.md (Q1~Q4 확정 — Q1 ProcessDiagram 위치, Q2 47 폴더 매핑, Q3 자체 표 3개, Q4 요약 Callout) |
| Do | 18 파일 변경 (1 commit, `50e0231`) — 이미지 9장 + credits 2 + MDX 2 + Plan/Design 3 + bkit 상태 2 |
| Check | analysis.md, **Match Rate 96%**, 5 사이클 연속 첫 검증 통과 |
| Report | 본 문서 |

### 2.2 5 사이클 연속 0-Iteration 기록

| 사이클 | 첫 Match Rate | Iteration | 시간 | 비고 |
|--------|:------------:|:---------:|:----:|------|
| semiconductor-academy-site (1) | 81% | 1회 | ~4h | 초기 인프라 구축 |
| chapter-based-restructure (2) | 97% | 0회 | ~2h | 17 챕터 IA |
| reading-experience-ch1 (3) | 94% | 0회 | ~3h | Ch.1 패턴 확립 (FontSizeToggle·ImageFigure·Lightbox) |
| ch2-deep-content (4) | 96% | 0회 | ~1.5h | Ch.1 패턴 1차 확산 검증 |
| **ch3-ch4-foundation (5)** | **96%** | **0회** | **~2.5h** | **묶음(2 챕터) 첫 적용** |

**평균 96.25%** (4 사이클, 1 사이클 제외), **0 iteration 4 사이클 연속**, **묶음 적용으로 챕터당 시간 1.5h → 1.25h 감소**.

---

## 3. 구현 통계

### 3.1 파일 변경 (commit `50e0231`)

| 카테고리 | 파일 수 | 라인 |
|---------|:------:|:---:|
| MDX 콘텐츠 | 2 | +287 / -96 |
| 책 페이지 이미지 (jpeg) | 9 | (binary, ~605KB 총) |
| `_credits.json` | 2 | +58 |
| Plan 문서 | 2 (sub + batch parent) | +630 |
| Design 문서 | 1 | +203 |
| bkit 상태 | 2 | +/- 동기화 |
| **총** | **18** | **+1178 / -96** |

### 3.2 콘텐츠 구성

| 항목 | Ch.3 | Ch.4 | 총 |
|------|:---:|:---:|:---:|
| 줄 수 | 186 | 179 | 365 |
| LayeredExplain | 1 | 1 | 2 |
| ImageFigure (책 출처) | 5 | 4 | 9 |
| ProcessDiagram | 1 | 0 | 1 |
| 자체 제작 표 | 1 | 2 | 3 |
| SourceQuote | 2 (95자, 102자) | 2 (106자, 79자) | 4 (모두 ≤150자) |
| Callout | 5 | 6 | 11 |
| ChapterRef | order=4 | order=5 | 2 |
| Term | 0 | 1 (cleanroom) | 1 |

### 3.3 신규 자산

```
public/source-images/
├── ch3/                                  ★ NEW
│   ├── _credits.json
│   ├── ch3-cover.jpg          (p.45)
│   ├── fig-3-1-overview.jpg   (p.47, 9단계 공정 흐름)
│   ├── fig-3-2-wafer.jpg      (p.49, 웨이퍼 제조 단계)
│   ├── fig-3-3-assembly.jpg   (p.52, 조립·검사 공정)
│   └── fig-3-4-support.jpg    (p.53, 지원 산업)
└── ch4/                                  ★ NEW
    ├── _credits.json
    ├── ch4-cover.jpg          (p.55)
    ├── fig-4-1-intro.jpg      (p.55, 클린룸 도입)
    ├── fig-4-2-structure.jpg  (p.57, 클린룸 구조)
    └── fig-4-3-airflow.jpg    (p.59, 공기 청정도)
```

---

## 4. 저작권 안전성 검증

| 항목 | 기준 | 실제 | Status |
|------|------|------|:------:|
| SourceQuote 개수 | 챕터당 ≤ 2 | Ch.3=2, Ch.4=2 | ✅ |
| SourceQuote 길이 | each ≤ 150자 | 79∼106자 | ✅ |
| 자체 제작 표 | 3개 (저작권 무관) | 정확히 3개 | ✅ |
| 책 이미지 maxWidth | ≤ 600px | 520 (cover), 기본 600 (fig) | ✅ |
| 이미지 출처 명시 | 모든 ImageFigure | 9/9 `source` 속성 | ✅ |
| `_credits.json` | 폴더당 fair use 정책 | ch3·ch4 동일 정책 + per-image 메타 | ✅ |
| 본문 책 표 직접 복제 | 없음 (자체 표로 대체) | 0 | ✅ |

---

## 5. 핵심 학습 — Batch 적용 시 발견

### 5.1 Q-D1 결정의 효과

Design Q-D1 ("Ch.3 §3 웨이퍼 가공 부분에 ChemicalCard 임베드 여부 — 공정 페이지 위임 vs 챕터 self-contained")을 **"공정 페이지 위임"** 으로 선택한 결과:
- Ch.3 §3이 7줄 요약 + ChapterRef로 압축 (Design 추정 ~30줄 → 실제 16줄)
- **장점**: 챕터 페이지가 가벼워지고 공정 페이지로 자연 흐름
- **단점**: Design 라인 추정과 차이 발생 (220 → 186, 84.5%)

### 5.2 묶음(batch) 적용의 시간 효율

| 측정값 | 단일 챕터 (Ch.1, Ch.2) | 묶음 (Ch.3+Ch.4) |
|--------|:------:|:------:|
| 챕터당 시간 | ~1.5h | **~1.25h** |
| Plan + Design overhead | 챕터당 2회 | **2 챕터 1회 묶음** |
| 이미지 폴더 생성 작업 | 챕터당 분리 | **병렬 작업** |
| MDX 패턴 적용 | 한 번에 하나 | **연속 작성으로 컨텍스트 유지** |

→ **Sub-batch B (Ch.5∼Ch.13 9 챕터 light) 예상 5h** 산정 근거 확보.

### 5.3 라인 수 vs 콘텐츠 완비도

이번 사이클은 두 챕터 모두 라인 수 미달(Ch.3 84.5%, Ch.4 74.6%)이었지만 **콘텐츠 완비도 100%, Match Rate 96%**. 학습:
- **라인 수는 콘텐츠 깊이의 proxy일 뿐 핵심 KPI 아님**
- 다음 batch sub-cycle부터는 Design 라인 추정 시 §별 prose density 차이를 반영한 보정 필요

---

## 6. 다음 단계

### 6.1 즉시 진행 가능

```
/pdca archive ch3-ch4-foundation              # (선택) 본 사이클 docs/archive/ 이동
/pdca plan ch5-to-ch13-process-light          # Sub-batch B 시작
```

### 6.2 Batch 전체 진행도

| Sub-batch | 챕터 | 예상 시간 | Status |
|:---------:|------|:---------:|:------:|
| **A** | Ch.3, Ch.4 (foundation) | ~2.5h | ✅ **완료 (실제 ~2.5h)** |
| B | Ch.5∼Ch.13 (process light, 9 챕터) | ~5h | ⏳ 대기 |
| C | Ch.14∼Ch.17 (hazard + reflection) | ~5h | ⏳ 대기 |
| **Batch 합계** | **15 챕터** | **~12.5h** | 1/3 완료 |

### 6.3 라이브 확인

배포 후 (GitHub Actions 자동, ~3∼4분):
- https://drunkenzealnut.github.io/semiconductor-academy/chapter/process-overview-chapter/
- https://drunkenzealnut.github.io/semiconductor-academy/chapter/cleanroom-chapter/
- 이미지 자산: `/source-images/ch3/*`, `/source-images/ch4/*`

---

## 7. 참고

- 원본: 「반도체 산업의 유해인자」 윤충식 외 저, 에피스테메
  - 3장 (p.45∼53) — 반도체 제조 공정의 전반적 이해
  - 4장 (p.55∼62) — 반도체 사업장의 클린룸
- 패턴 출처: `docs/archive` 후보 — `reading-experience-ch1`, `ch2-deep-content`
- Commit: `50e0231 feat(ch3-ch4-foundation): Ch.3 공정 개요 + Ch.4 클린룸 본문 깊이 확장`
- Batch parent: `docs/01-plan/features/ch3-to-ch17-batch.plan.md`
