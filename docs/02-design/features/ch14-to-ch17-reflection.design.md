# Design: ch14-to-ch17-reflection

> Sub-batch C — Ch.14∼Ch.17 medium hybrid 매핑 (책 완주)

**작성일**: 2026-05-29
**Feature**: `ch14-to-ch17-reflection`
**PDCA Phase**: Design
**Linked Plan**: [docs/01-plan/features/ch14-to-ch17-reflection.plan.md](../../01-plan/features/ch14-to-ch17-reflection.plan.md)
**Status**: Draft

---

## 0. Open Questions 결정 (Plan Q1∼Q5)

| ID | 질문 | **결정** | 근거 |
|----|------|---------|------|
| Q1 | 챕터당 이미지 평균 | **평균 2.5 (총 10장)** — Ch.14/15/17은 2장, Ch.16은 4장 | Ch.16 narrative arc 정점 |
| Q2 | Ch.16 한국 역학조사 처리 | **자체 표 (영국/미국/한국 3국 비교) + 한국 유의 결과 요약 표** | 학습 가치 최대, 이름·기업명 제외 |
| Q3 | Ch.17 closing 방식 | **LayeredExplain Hero(회상) + closing Callout (책 7저자·17 챕터 마무리)** | narrative arc 명시 |
| Q4 | Ch.14 영업비밀 35% | **자체 표 (Ch.8 PR MSDS 종합 + 공정별 영업비밀 비중)** | 책의 핵심 통계 시각화 |
| Q5 | Report 단계 README/About 업데이트 | **Sub-batch C Report에서 함께 처리** (책 완주 자축 메시지) | 17 챕터 완성 milestone 명시 |

---

## 1. 아키텍처 (변경 없음)

Ch.1∼Ch.13에서 확립된 모든 인프라 재사용:
- `<ImageFigure />` + `<Lightbox />`, `<FontSizeToggle />`
- `<SourceQuote />`, `<Callout />`, `<LayeredExplain />`, `<ChapterRef />`
- `<Term />` (필요 시)

**신규 컴포넌트 0**. **신규 인프라 0**.

---

## 2. Medium Hybrid 프로파일

```
LayeredExplain Hero (Ch.17은 회상 톤)
ImageFigure cover
## 한 줄 요약
## 1. <핵심 개념 1>
  ImageFigure fig-N-1
  [자체 표 1개]
  Callout warning 또는 info
## 2. <핵심 개념 2> 또는 사례
  ImageFigure fig-N-2 (선택)
  SourceQuote (≤150자)
  [자체 표 2개] (Ch.14, Ch.16만)
## 3. 산업보건학적 시각 / 책의 메시지
  Callout warning + tip
[Ch.17 only] Closing Callout (17 챕터 마무리)
ChapterRef order=N+1 (Ch.17은 / about 또는 / 으로)
```

**목표 분량**: Ch.14=150, Ch.15=130, Ch.16=170, Ch.17=150 (총 ~600줄, 평균 150).

---

## 3. 4 챕터 자체 표 명세 (Q2, Q4 결정)

### 3.1 Ch.14 — 표 ① 영업비밀 비공개 통계 (Q4)

| 정보원 | 조사 대상 | 영업비밀 비중 | 학술적 의미 |
|--------|---------|:------:|------|
| 책 8장 (PR MSDS) | 48개 PR 제품 | 35종 중 다수 비공개 | 작업자 노출 물질 파악 불가 |
| 책 14장 (종합) | 모든 공정 | 영업비밀 비중 높음 | 노출 평가의 구조적 장벽 |
| MSDS 제도 | 법적 의무 | 영업비밀 예외 인정 | 알 권리 vs 영업비밀 갈등 |

### 3.2 Ch.14 — 표 ② 공정별 사용 화학물질 분류

| 공정 | 대표 화학물질 | 위험 유형 |
|------|------------|---------|
| 클리닝 (Ch.6) | HF, HCl, H₂SO₄, NH₄OH, H₂O₂ | 강산·강염기, 화상 |
| 확산 (Ch.7) | AsH₃, PH₃, B₂H₆ | 극독성 가스 (ppm 한계) |
| 포토 (Ch.8) | PR, TMAH, HMDS | 영업비밀 다수 |
| 식각 (Ch.9) | HF, Cl₂, PFC (CF₄·SF₆) | 산, 가스, 온실가스 |
| 증착 (Ch.10) | SiH₄, WF₆, Cu/W 전구체 | 자연발화, 알려지지 않은 부산물 |
| 이온주입 (Ch.11) | AsH₃, PH₃, BF₃ | 극독성 + X선 |
| CMP (Ch.12) | 슬러리(나노입자), H₂O₂ | 나노 흡입, 금속 |
| 패키징 (Ch.13) | Pb·Sn, 에폭시, 플럭스 | 흄, 피부 알레르기 |

### 3.3 Ch.15 — 표 ① ELF 자기장 노출기준 비교

| 기관/국가 | 직업적 노출기준 (μT, 50/60Hz) | 일반인 노출기준 | 비고 |
|----------|:--------:|:--------:|------|
| ICNIRP (2010) | 1,000 (1 mT) | 200 (0.2 mT) | 국제 비이온화 방사선 위원회 |
| ACGIH | 1,000 (TLV) | — | 미국 산업위생사 협회 |
| 한국 (산업안전보건법) | **없음 (반도체 작업장 기준 부재)** | — | **작업장 ELF 자기장 노출기준 없음** |
| WHO/IARC (2002) | — | "Possibly carcinogenic" 2B | 어린이 백혈병 약한 연관성 |

### 3.4 Ch.16 — 표 ① 영국·미국·한국 역학조사 3국 비교 (Q2)

| 국가 | 시기 | 조사 대상 | 주요 발견 | 한계 |
|------|:----:|---------|---------|------|
| **영국** | 1990s∼2000s | 반도체 1∼2 공장 | 자연 유산·기형 위험 시사 | 표본 크기 제한 |
| **미국** | 1980s∼1990s | 반도체 여러 공장 | 생식독성 결과 혼재 | 회사별 자체 조사 |
| **한국** | 2007∼ | 국내 반도체 공장 | 일부 암 종 유의 결과 보고 | 인과관계 vs 통계 유의성 논쟁 |

*직접 인용 없이 책 통계·결론만 요약*

### 3.5 Ch.16 — 표 ② 한국 보고 유의 암 종 요약 (저작권 안전 압축)

| 카테고리 | 유의 결과 보고 사례 |
|---------|------------------|
| 혈액암 | 백혈병, 림프종 일부 유의 |
| 고형암 | 위암·갑상선암 등 일부 유의 |
| 생식독성 | 자연 유산률 일부 유의 |
| 해석 | "통계적 유의성 ≠ 인과관계" 균형 필요 |

*책의 결론을 카테고리 수준으로 요약, 회사·이름 비공개*

### 3.6 Ch.17 — 표 ① 무어/황의 법칙 → 산업보건 시간 격차

| 항목 | 반도체 산업 | 산업보건 연구 | 격차 |
|------|---------|---------|------|
| 신물질 도입 | 18∼24개월 | 평가 완료까지 5∼10년 | **2.5∼5배** |
| 신장비 도입 | 1∼2년 | 부산물 측정 평가 수년 | **2∼5배** |
| 신공정 도입 | 분기∼반기 | 코호트 연구 10년+ | **20배+** |
| 결과 | 제품은 빠르게 변화 | 위험 평가가 못 따라잡음 | **산업보건 사각지대** |

→ Ch.1의 "짧은 역사·빠른 변화" 위험과 narrative closure.

---

## 4. 이미지 매핑 (Q1 결정 — 총 10장)

### 4.1 Ch.14 (toend 폴더, page 55∼67) — 2장

| public | 원본 | 책 위치 | 캡션 |
|--------|------|---------|------|
| **ch14/ch14-cover.jpg** | `_page_55_Picture_0.jpeg` | p.219 | 제14장 — 반도체 공정에서의 화학물질 사용 |
| **ch14/fig-14-1-msds.jpg** | `_page_58_Figure_0.jpeg` | p.222 | 그림 14-1. 화학물질 영업비밀 비중 |

### 4.2 Ch.15 (toend 폴더, page 73∼95) — 2장

| public | 원본 | 책 위치 | 캡션 |
|--------|------|---------|------|
| **ch15/ch15-cover.jpg** | `_page_73_Figure_3.jpeg` | p.245 | 제15장 — 반도체 공정과 전자파 |
| **ch15/fig-15-1-elf.jpg** | `_page_90_Figure_0.jpeg` | p.265 | 그림 15-1. ELF 자기장 노출 분포 |

### 4.3 Ch.16 (toend 폴더, page 95∼109) — 4장

| public | 원본 | 책 위치 | 캡션 |
|--------|------|---------|------|
| **ch16/ch16-cover.jpg** | `_page_95_Picture_0.jpeg` | p.281 | 제16장 — 반도체 공정 주요 질병 위험 고찰 |
| **ch16/fig-16-1-repro.jpg** | `_page_95_Figure_2.jpeg` | p.281 | 그림 16-1. 생식독성 위험 |
| **ch16/fig-16-2-cancer.jpg** | `_page_109_Picture_0.jpeg` | p.297 | 그림 16-2. 암 위험 역학 연구 |
| **ch16/fig-16-3-cohort.jpg** | `_page_91_Figure_0.jpeg` | p.275 | 그림 16-3. 코호트 연구 도식 |

### 4.4 Ch.17 (toend 폴더, page 119+) — 2장

| public | 원본 | 책 위치 | 캡션 |
|--------|------|---------|------|
| **ch17/ch17-cover.jpg** | `_page_119_Picture_2.jpeg` | p.325 | 제17장 — 산업보건학적 시각에서 바라본 반도체 산업 |
| **ch17/fig-17-1-gap.jpg** | (자체 SVG 또는 도식 대체) | — | 그림 17-1. 산업보건 시간 격차 (자체 표 대체) |

**Ch.17 fig-17-1는 자체 표(§3.6)로 대체** — 이미지 1장.

→ **총 9 이미지 + Ch.17 자체 표 1개 시각화** = **실제 이미지 9장 (10 중 1 표로 대체)**.

### 4.5 `_credits.json` (Ch.3∼Ch.13과 동일 형식)

각 챕터 폴더에 정책 + 이미지별 메타.

---

## 5. SourceQuote 후보 (Q1∼Q5 결정 — 총 7개)

| 챕터 | 개수 | 핵심 메시지 (≤150자) |
|------|:---:|------|
| Ch.14 | 2 | (a) 영업비밀 35% 비중 (~120자) (b) 공정별 화학물질 다양성 (~110자) |
| Ch.15 | 1 | 작업장 ELF 자기장 노출기준 부재 (~120자) |
| Ch.16 | 2 | (a) 한국 역학조사 결과 (~120자) (b) 통계 유의 vs 인과관계 (~110자) |
| Ch.17 | 2 | (a) 책 7저자의 산업보건 시각 (~130자) (b) 신물질·신기술 시간 격차 closing (~140자) |
| **총** | **7** | 모두 챕터당 ≤ 2, each ≤ 150자 |

---

## 6. 챕터별 Callout 명세

| 챕터 | Callout 수 | 종류 |
|------|:---:|------|
| Ch.14 | 4 | warning (영업비밀), info (공정별 분류), tip (Ch.6∼Ch.13 cross-link), tip (Ch.16 결과 연결) |
| Ch.15 | 3 | warning (작업장 기준 부재), info (ELF vs 고주파 구분), tip (Ch.4 클린룸 환경 연결) |
| Ch.16 | 5 | warning (생식독성), warning (암 결과), info (3국 비교), info (인과 vs 통계), tip (Ch.17 closing) |
| Ch.17 | 4 | info (책 7저자 회상), info (17 챕터 narrative arc), **closing tip** (다음 행동·About 안내), warning (시간 격차 지속) |
| **총** | **16** | |

---

## 7. 폴더/파일 변경

### 7.1 신규 자산
```
public/source-images/ch14/  ★ NEW (2 jpeg + credits)
public/source-images/ch15/  ★ NEW (2 jpeg + credits)
public/source-images/ch16/  ★ NEW (4 jpeg + credits)
public/source-images/ch17/  ★ NEW (1 jpeg + credits)
```
**총 9 jpeg + 4 credits.json**.

### 7.2 변경
```
src/content/chapters/14-chemicals-usage.mdx       83 → ~150줄
src/content/chapters/15-electromagnetic.mdx       61 → ~130줄
src/content/chapters/16-occupational-disease.mdx  85 → ~170줄
src/content/chapters/17-industrial-health-view.mdx  104 → ~150줄

목표 합계: 333줄 → ~600줄 (1.8배 확장)
```

---

## 8. 구현 순서 (Do Phase — Q4 결정)

### Do A — Ch.14∼Ch.15 (~1h)
1. 이미지 4장 복사 + 2 `_credits.json`
2. Ch.14 (~150줄): Hero + 2 image + 영업비밀 표 + 공정별 화학물질 표 + 2 SourceQuote + 4 Callout
3. Ch.15 (~130줄): Hero + 2 image + ELF 기준 비교 표 + 1 SourceQuote + 3 Callout

### Do B — Ch.16∼Ch.17 (~1.5h)
4. 이미지 5장 복사 + 2 `_credits.json`
5. Ch.16 (~170줄): Hero + 4 image + 3국 비교 표 + 한국 유의 결과 표 + 2 SourceQuote + 5 Callout
6. Ch.17 (~150줄): LayeredExplain 회상 Hero + 1 image + 시간격차 표 + 2 SourceQuote + 4 Callout (closing 포함)

### Do C — 빌드 + commit + push (~20m)
7. `~` → `∼` 일괄 치환
8. `NEXT_PUBLIC_BASE_PATH=/semiconductor-academy npm run build` — 70 페이지 유지
9. git commit + push

| Phase | 시간 |
|-------|------|
| Do A | 1.0h |
| Do B | 1.5h |
| Do C | 0.3h |
| **합계** | **~2.8h** |

---

## 9. 저작권 정책 (Ch.1∼Ch.13과 동일 + Ch.16 강화)

| 항목 | 정책 |
|------|------|
| SourceQuote | 챕터당 ≤ 2, 각 ≤ 150자 |
| 자체 제작 표 | 6개 (Ch.14×2, Ch.15×1, Ch.16×2, Ch.17×1) |
| 책 표 직접 복제 | **금지** |
| 책 페이지 이미지 | maxWidth ≤ 600px + `source` + credits |
| **Ch.16 한국 사례** | **이름·기업명·소송명 비공개**, 카테고리 통계만 |
| 본문 | 책 흐름 따르되 자체 서술 |

---

## 10. 빌드 영향

| 항목 | 이전 | 이후 |
|------|------|------|
| 정적 페이지 | 70 | **70** |
| MDX 파일 | 31 | 31 |
| 공개 자산 | 66 (A+B 누적) | **79** (+13: 9 jpeg + 4 credits) |
| 컴포넌트 | 28 | 28 |

---

## 11. 미해결 결정 (Do에서)

| ID | 질문 | 결정 시점 |
|----|------|----------|
| Q-D1 | Ch.16 한국 사례 직접 인용 길이 (요약 ≤ 50자 vs ≤ 100자) | Do B |
| Q-D2 | Ch.17 closing Callout — 사용자 행동 권장 (About 방문 vs 챕터 1 복습) | Do B |
| Q-D3 | Ch.17 fig-17-1 — page_119_Figure_3 추가 vs 자체 표 단독 | Do B |

---

## 12. 성공 기준 (Design 단계 종료)

- [x] Q1∼Q5 결정 명시
- [x] 4 챕터 이미지 9장 매핑
- [x] 자체 표 6개 명세 (Q2, Q4 포함)
- [x] SourceQuote 7개 후보 (페이지·길이)
- [x] Callout 16개 종류·수량
- [x] Ch.16 한국 사례 저작권 정책 강화
- [x] Ch.17 narrative closure 설계

---

## 13. 참고

- Plan: `docs/01-plan/features/ch14-to-ch17-reflection.plan.md`
- Parent batch: `docs/01-plan/features/ch3-to-ch17-batch.plan.md`
- 패턴 출처: A(`ch3-ch4-foundation.design.md` 깊이) + B(`ch5-to-ch13-process-light.design.md` 묶음)
- 데이터: `data/20260527_154313_..._-_toend/` 후반부 (page 55∼119+)
