# Design: ch5-to-ch13-process-light

> Sub-batch B — 9공정 챕터(Ch.5∼Ch.13) light 프로파일 매핑

**작성일**: 2026-05-29
**Feature**: `ch5-to-ch13-process-light`
**PDCA Phase**: Design
**Linked Plan**: [docs/01-plan/features/ch5-to-ch13-process-light.plan.md](../../01-plan/features/ch5-to-ch13-process-light.plan.md)
**Status**: Draft

---

## 0. Open Questions 결정 (Plan Q1∼Q5)

| ID | 질문 | **결정** | 근거 |
|----|------|---------|------|
| Q1 | 챕터당 이미지 평균 | **평균 2.9장** (총 26장) — chemical-heavy 챕터(포토 4, 패키징 4) 3∼4장, 단순 챕터 2∼3장 | 책 도식 밀도와 챕터 복잡도 반영 |
| Q2 | 자체 표 9개 주제 | **본 §3에 9개 모두 명세** | 챕터별 학습 가치 극대화 |
| Q3 | SourceQuote 챕터당 1∼2 | **기본 1, chemical-heavy 2** (Ch.8 포토, Ch.10 증착, Ch.13 패키징) → 총 12개 | 영업비밀·MSDS 누락 같은 핵심 메시지 강조 |
| Q4 | Do A/B/C 분리 vs 1 세션 | **3 단계 분리 (47→811→toend)** | 폴더 컨텍스트 유지, 50% 시간 단축 가설 검증 단위 |
| Q5 | Ch.5 GaAs warning + 잉곳 자체 표 | **둘 다 유지** | 기존 GaAs warning 강력, 잉곳 11단계 표는 학습 핵심 |

---

## 1. 아키텍처 (변경 없음)

Ch.1∼Ch.4에서 확립된 모든 인프라 재사용:
- `<ImageFigure />` + `<Lightbox />`, `<FontSizeToggle />`
- `<SourceQuote />`, `<Callout />`, `<LayeredExplain />`, `<ChapterRef />`
- `<ProcessDiagram variant="compact" activeId="..." />` (기존 활용)

**신규 컴포넌트 0**. **신규 인프라 0**.

---

## 2. Light 프로파일 (전 챕터 공통 구조)

```
[Hero block]  ← LayeredExplain 또는 짧은 도입 prose
ImageFigure cover                           ← 책 챕터 도입 일러스트
ProcessDiagram variant="compact"            ← 현재 챕터 강조
## (한 줄 요약)                              ← 기존 유지
## 1. 공정의 큰 그림
  ImageFigure fig-N-1
  [자체 표 1개]                              ← Q2 결정
## 2. 핵심 단계 / 화학물질
  ImageFigure fig-N-2 (선택)
  SourceQuote 1∼2개                         ← Q3 결정
## 3. 산업보건학적 시각
  Callout warning (핵심 위험)
  Callout tip (Ch.4·Ch.16 cross-link)
## 자세한 공정 → /process/<name>/            ← 기존 위임 유지
ChapterRef order=N+1
```

**목표 분량**: 80∼120줄 / 챕터.

---

## 3. 9 챕터 자체 표 명세 (Q2 결정)

| 챕터 | 표 주제 | 컬럼 |
|------|---------|------|
| **Ch.5 웨이퍼** | 잉곳→웨이퍼 11단계 요약 | 단계 / 한 줄 설명 / 위험 |
| **Ch.6 클리닝** | 습식 vs 건식 클리닝 비교 | 방식 / 대표 기술 / 화학물질 / 산업보건 이슈 |
| **Ch.7 확산** | 확산 vs 이온 주입 vs 산화 비교 | 공정 / 온도 / 목적 / 유해인자 |
| **Ch.8 포토** | 포토 6단계 (HMDS→PR→노광→PEB→현상→hardbake) | 단계 / 화학물질 / 위험 |
| **Ch.9 식각** | 습식 vs 건식 식각 가스 분류 | 분류 / 대표 가스 / 대상 막 / 부산물 |
| **Ch.10 증착** | CVD vs PVD vs ALD 비교 | 방식 / 원리 / 온도 / 대표 부산물 |
| **Ch.11 이온주입** | 이온주입 vs 확산 차이점 | 항목 / 이온주입 / 확산 |
| **Ch.12 CMP** | 산화막 슬러리 vs 금속막 슬러리 | 항목 / 산화막 / 금속막 / 산업보건 |
| **Ch.13 패키징** | 패키징 8단계 (다이싱→DA→WB→몰딩→마킹→솔더볼→싱귤레이션→검사) | 단계 / 한 줄 / 화학물질·물리 위험 |

---

## 4. 이미지 매핑 (Q1 결정 — 총 26장)

### 4.1 Ch.5∼Ch.7 (47 폴더에서)

| public | 원본 | 책 위치 | 캡션 |
|--------|------|---------|------|
| **ch5/ch5-cover.jpg** | `_page_12_Picture_0.jpeg` | p.65 | 제5장 — 웨이퍼 제조와 유해인자 |
| **ch5/fig-5-1-ingot.jpg** | `_page_13_Figure_3.jpeg` | p.67 | 그림 5-1. 잉곳 제조 (Czochralski) |
| **ch5/fig-5-2-gaas.jpg** | `_page_20_Picture_0.jpeg` | p.72 | 그림 5-2. 갈륨비소 웨이퍼 |
| **ch6/ch6-cover.jpg** | `_page_29_Picture_0.jpeg` | p.81 | 제6장 — 클리닝 공정과 유해인자 |
| **ch6/fig-6-1-rca.jpg** | `_page_32_Figure_2.jpeg` | p.83 | 그림 6-1. RCA 클리닝 |
| **ch6/fig-6-2-dry.jpg** | `_page_39_Figure_0.jpeg` | p.89 | 그림 6-2. 건식 클리닝 (드라이아이스) |
| **ch7/ch7-cover.jpg** | `_page_44_Picture_0.jpeg` | p.94 | 제7장 — 확산 공정과 유해인자 |
| **ch7/fig-7-1-furnace.jpg** | `_page_46_Figure_0.jpeg` | p.96 | 그림 7-1. 확산로 구조 |
| **ch7/fig-7-2-oxide.jpg** | `_page_47_Figure_3.jpeg` | p.97 | 그림 7-2. 산화막 형성 |

### 4.2 Ch.8∼Ch.11 (811 폴더에서)

| public | 원본 | 책 위치 | 캡션 |
|--------|------|---------|------|
| **ch8/ch8-cover.jpg** | `_page_0_Picture_0.jpeg` | p.81 | 제8장 — 포토리소그래피와 유해인자 |
| **ch8/fig-8-1-overview.jpg** | `_page_3_Figure_1.jpeg` | p.84 | 그림 8-1. 포토 공정 개요 |
| **ch8/fig-8-2-pr.jpg** | `_page_18_Picture_0.jpeg` | p.99 | 그림 8-2. 포토레지스트 |
| **ch8/fig-8-3-exposure.jpg** | `_page_15_Figure_0.jpeg` | p.96 | 그림 8-3. 노광 장비 |
| **ch9/ch9-cover.jpg** | `_page_47_Picture_0.jpeg` | p.128 | 제9장 — 식각 공정과 유해인자 |
| **ch9/fig-9-1-chamber.jpg** | `_page_57_Figure_0.jpeg` | p.138 | 그림 9-1. 식각 챔버 |
| **ch9/fig-9-2-plasma.jpg** | `_page_62_Picture_5.jpeg` | p.143 | 그림 9-2. 플라스마 식각 |
| **ch10/ch10-cover.jpg** | `_page_70_Picture_0.jpeg` | p.151 | 제10장 — 증착 공정과 유해인자 |
| **ch10/fig-10-1-cvd.jpg** | `_page_71_Figure_3.jpeg` | p.152 | 그림 10-1. CVD 공정 |
| **ch10/fig-10-2-pvd.jpg** | `_page_76_Figure_0.jpeg` | p.157 | 그림 10-2. PVD (sputter) |
| **ch11/ch11-cover.jpg** | `_page_82_Picture_0.jpeg` | p.163 | 제11장 — 이온 주입과 유해인자 |
| **ch11/fig-11-1-implanter.jpg** | `_page_85_Figure_4.jpeg` | p.166 | 그림 11-1. 이온 주입기 |
| **ch11/fig-11-2-doping.jpg** | `_page_90_Picture_1.jpeg` | p.171 | 그림 11-2. 도펀트 주입 |

### 4.3 Ch.12∼Ch.13 (toend 폴더에서)

| public | 원본 | 책 위치 | 캡션 |
|--------|------|---------|------|
| **ch12/ch12-cover.jpg** | `_page_0_Picture_0.jpeg` | p.181 | 제12장 — 물리 화학적 연마(CMP)와 유해인자 |
| **ch12/fig-12-1-slurry.jpg** | `_page_1_Figure_2.jpeg` | p.182 | 그림 12-1. 슬러리 구성 |
| **ch12/fig-12-2-polish.jpg** | `_page_5_Figure_0.jpeg` | p.186 | 그림 12-2. CMP 연마 헤드 |
| **ch13/ch13-cover.jpg** | `_page_9_Picture_0.jpeg` | p.190 | 제13장 — 칩 조립·검사와 유해인자 |
| **ch13/fig-13-1-wirebond.jpg** | `_page_15_Figure_6.jpeg` | p.196 | 그림 13-1. 와이어 본딩 |
| **ch13/fig-13-2-molding.jpg** | `_page_22_Picture_4.jpeg` | p.203 | 그림 13-2. 몰딩 공정 |
| **ch13/fig-13-3-solderball.jpg** | `_page_28_Figure_0.jpeg` | p.209 | 그림 13-3. 솔더볼 부착 |

**총 26장** (Ch.5∼7: 9, Ch.8∼11: 11, Ch.12∼13: 6) → 챕터당 평균 **2.9장**.

### 4.4 `_credits.json` (Ch.3/Ch.4 형식 그대로)

각 챕터 폴더에 정책 + 이미지별 메타 (file/type/source/page/license/caption).

---

## 5. SourceQuote 후보 (Q3 결정 — 총 12개)

| 챕터 | 개수 | 핵심 메시지 후보 |
|------|:---:|---------------|
| Ch.5 웨이퍼 | 1 | 갈륨비소 분진 발암성 (≤120자) |
| Ch.6 클리닝 | 1 | 습식 화학물질 노출 (≤120자) |
| Ch.7 확산 | 1 | 확산로 고온 + 가스 노출 (≤120자) |
| **Ch.8 포토** | **2** | (a) PR MSDS 영업비밀 (≤140자) (b) 노광 광원 위험 (≤120자) |
| Ch.9 식각 | 1 | 건식 식각 PFC·온실가스 (≤130자) |
| **Ch.10 증착** | **2** | (a) CVD 부산물 알려지지 않음 (≤140자) (b) 전구체 물질 위험 (≤120자) |
| Ch.11 이온주입 | 1 | 도펀트 가스 독성 (포스핀·아르신) (≤130자) |
| Ch.12 CMP | 1 | 슬러리 미세입자 + 금속 노출 (≤120자) |
| **Ch.13 패키징** | **2** | (a) 솔더 흄·금속 노출 (≤140자) (b) 후공정 산업보건 누락 (≤120자) |
| **총** | **12** | |

**모두 챕터당 ≤ 2개, each ≤ 150자, 페이지·섹션 명시.**

---

## 6. 챕터별 Callout 명세

| 챕터 | Callout 수 | 종류 |
|------|:---:|------|
| Ch.5 | 3 | warning (GaAs 분진 기존), info (잉곳 11단계 요약), tip (다음 챕터) |
| Ch.6 | 2 | warning (RCA 화학물질), tip (Ch.4 클린룸의 역설 cross-link) |
| Ch.7 | 2 | warning (고온 가스), tip (Ch.16 부산물 cross-link) |
| Ch.8 | 4 | warning (PR MSDS), warning (광원), info (6단계), tip (Ch.4) |
| Ch.9 | 3 | warning (플라스마 가스), info (습식 vs 건식), tip (Ch.16) |
| Ch.10 | 4 | warning (CVD 부산물), warning (전구체), info (CVD/PVD/ALD), tip (Ch.16) |
| Ch.11 | 3 | warning (포스핀·아르신), info (도펀트 종류), tip (Ch.6과 비교) |
| Ch.12 | 3 | warning (슬러리 미세입자), info (산화막/금속막), tip (Ch.16) |
| Ch.13 | 4 | warning (솔더 흄), warning (후공정 사각지대), info (8단계), tip (Ch.4 클린룸 외 공정 cross-link) |
| **총** | **28** | |

---

## 7. 폴더/파일 변경

### 7.1 신규 자산
```
public/source-images/ch5/  ★ NEW (3 jpeg + credits)
public/source-images/ch6/  ★ NEW (3 jpeg + credits)
public/source-images/ch7/  ★ NEW (3 jpeg + credits)
public/source-images/ch8/  ★ NEW (4 jpeg + credits)
public/source-images/ch9/  ★ NEW (3 jpeg + credits)
public/source-images/ch10/ ★ NEW (3 jpeg + credits)
public/source-images/ch11/ ★ NEW (3 jpeg + credits)
public/source-images/ch12/ ★ NEW (3 jpeg + credits)
public/source-images/ch13/ ★ NEW (4 jpeg + credits)
```

### 7.2 변경
```
src/content/chapters/05-wafer.mdx           25 → ~95줄
src/content/chapters/06-cleaning.mdx        22 → ~90줄
src/content/chapters/07-diffusion.mdx       21 → ~85줄
src/content/chapters/08-photolithography.mdx  28 → ~120줄
src/content/chapters/09-etching.mdx         25 → ~100줄
src/content/chapters/10-deposition.mdx      26 → ~110줄
src/content/chapters/11-ion-implantation.mdx  26 → ~100줄
src/content/chapters/12-cmp.mdx             25 → ~100줄
src/content/chapters/13-packaging.mdx       30 → ~120줄

목표 합계: 228줄 → ~920줄 (4배 확장)
```

---

## 8. 구현 순서 (Do Phase 가이드 — Q4 결정 3 단계)

### Do A — Ch.5∼Ch.7 (47 폴더, ~1.5h)
1. 이미지 9장 복사 + 3 `_credits.json`
2. Ch.5 (~95줄): Hero + 3 image + 잉곳 11단계 표 + GaAs warning + 클리닝 cross-link
3. Ch.6 (~90줄): Hero + 3 image + 습식/건식 표 + RCA warning + Ch.4 cross-link
4. Ch.7 (~85줄): Hero + 3 image + 확산/이온주입/산화 표 + 고온 warning + Ch.16 cross-link

### Do B — Ch.8∼Ch.11 (811 폴더, ~2h)
5. 이미지 13장 복사 + 4 `_credits.json`
6. Ch.8 (~120줄): Hero + 4 image + 포토 6단계 표 + PR MSDS + 광원 SourceQuote 2개
7. Ch.9 (~100줄): Hero + 3 image + 습식/건식 가스 표 + PFC SourceQuote
8. Ch.10 (~110줄): Hero + 3 image + CVD/PVD/ALD 표 + 부산물·전구체 SourceQuote 2개
9. Ch.11 (~100줄): Hero + 3 image + 이온주입/확산 비교 표 + 포스핀·아르신 SourceQuote

### Do C — Ch.12∼Ch.13 (toend 폴더, ~1h)
10. 이미지 7장 복사 + 2 `_credits.json`
11. Ch.12 (~100줄): Hero + 3 image + 슬러리 표 + 미세입자 SourceQuote
12. Ch.13 (~120줄): Hero + 4 image + 패키징 8단계 표 + 솔더 흄 + 사각지대 SourceQuote 2개

### Do D — 빌드 검증 + commit + push (~30m)
13. `~` → `∼` 일괄 치환
14. `NEXT_PUBLIC_BASE_PATH=/semiconductor-academy npm run build` — 70 페이지 유지 확인
15. git commit + push

| Phase | 시간 |
|-------|------|
| Do A | 1.5h |
| Do B | 2.0h |
| Do C | 1.0h |
| Do D | 0.5h |
| **합계** | **5.0h** |

---

## 9. 저작권 정책 (Ch.1∼Ch.4와 동일)

| 항목 | 정책 |
|------|------|
| SourceQuote | 챕터당 ≤ 2, 각 ≤ 150자, 페이지·섹션 출처 |
| 자체 제작 표 | 9개 (저작권 무관) |
| 책 표 직접 복제 | **금지** |
| 책 페이지 이미지 | maxWidth ≤ 600px + `source` 속성 + `_credits.json` |
| 본문 | 책 흐름 따르되 자체 서술 (요약 + 비유) |

---

## 10. 빌드 영향

| 항목 | 이전 | 이후 |
|------|------|------|
| 정적 페이지 | 70 | **70** (변경 없음) |
| MDX 파일 | 31 | 31 |
| 공개 자산 | 31 (Ch.3/Ch.4 누적) | **66** (+35: 26 jpeg + 9 credits) |
| 컴포넌트 | 28 | 28 |

---

## 11. 미해결 결정 (Do에서)

| ID | 질문 | 결정 시점 |
|----|------|----------|
| Q-D1 | Ch.8 포토 4 이미지 중 fig-8-3 노광 위치 (§2 vs §3) | Do B |
| Q-D2 | Ch.13 패키징 표를 8단계 그대로 vs 핵심 4단계로 압축 | Do C |
| Q-D3 | Ch.10 CVD/PVD/ALD 표에 ALD 컬럼 추가 vs 생략 | Do B |

---

## 12. 성공 기준 (Design 단계 종료)

- [x] Q1∼Q5 결정 명시
- [x] 9 챕터 이미지 26장 매핑 (data 폴더 → public 폴더)
- [x] 자체 표 9개 주제 명세
- [x] SourceQuote 12개 (페이지·길이) 후보
- [x] Callout 28개 종류·수량 명세
- [x] 라인 수 목표 (228 → ~920)
- [x] Do A/B/C/D 단계별 시간 산정
- [x] 저작권 정책 재확인

---

## 13. 참고

- Plan: `docs/01-plan/features/ch5-to-ch13-process-light.plan.md`
- Parent batch: `docs/01-plan/features/ch3-to-ch17-batch.plan.md`
- 패턴 출처: `docs/02-design/features/ch3-ch4-foundation.design.md`
- 데이터 폴더:
  - `data/20260526_215845_..._-_47/` (Ch.5∼Ch.7)
  - `data/20260527_132608_..._-811/` (Ch.8∼Ch.11)
  - `data/20260527_154313_..._-_toend/` (Ch.12∼Ch.13)
