# Analysis: ch5-to-ch13-process-light

> PDCA Check Phase — Design vs Implementation Gap 분석

**작성일**: 2026-05-29
**Feature**: `ch5-to-ch13-process-light`
**Parent**: `ch3-to-ch17-batch` (Sub-batch B)
**PDCA Phase**: Check
**Linked**: [Plan](../01-plan/features/ch5-to-ch13-process-light.plan.md) · [Design](../02-design/features/ch5-to-ch13-process-light.design.md)

---

## 0. Executive Summary

| 항목 | 결과 |
|------|------|
| **Match Rate** | **98%** ✅ (역대 최고) |
| **Blocker** | 0 |
| **Major Gap** | 0 |
| **Minor Gap** | 0 |
| **저작권 안전성** | ✅ 완전 준수 (SourceQuote 12개 모두 67∼89자, ≤150 한도) |
| **빌드 검증** | ✅ 70/70 static export 성공 |
| **권고** | `/pdca report ch5-to-ch13-process-light` 진행 |

### 핵심 발견 Top 3

1. **Match Rate 98%** — 9 챕터 × 구조/자산/저작권/라인 4축 = 36 항목 모두 통과. 자산 26/26 + credits 9/9, 자체표 9/9, SourceQuote 12/12 (Design 사양 100% 충족).
2. **Q-D1∼Q-D3 모두 implicit 해결** — Do 단계에서 세 미해결 결정(fig-8-3 위치, Ch.13 표 단계 수, Ch.10 ALD 컬럼)이 자연스럽게 해결됨. Report에 명시 권장.
3. **라인 수 +5% 초과** — 9 챕터 합계 967/920 (3 챕터 -1∼+9, 6 챕터 +7∼+11). Ch.3/Ch.4 가 −7∼−19% 미달이었던 것과 대조 — Design 추정 정확도 향상.

---

## 1. Per-Chapter 검증 매트릭스

| Ch | 구조 | 자산 | 저작권 | 라인 (실제/목표) | 비고 |
|:--:|:----:|:----:|:----:|:------:|------|
| 5 wafer | ✅ | ✅ 3/3 | ✅ 1 SQ (78자) | ✅ 102/95 (+7%) | 잉곳 11단계 표, GaAs warning |
| 6 cleaning | ✅ | ✅ 3/3 | ✅ 1 SQ (67자) | ✅ 90/90 (0%) | 습/건 비교 표, Ch.4 cross-link |
| 7 diffusion | ✅ | ✅ 3/3 | ✅ 1 SQ (76자) | ✅ 94/85 (+11%) | 확산/이온/산화 표, Ch.16 cross-link |
| 8 photo | ✅ | ✅ 4/4 | ✅ 2 SQ (84/83자) | ✅ 127/120 (+6%) | 포토 6단계 표, EUV |
| 9 etching | ✅ | ✅ 3/3 | ✅ 1 SQ (89자) | ✅ 104/100 (+4%) | 습/건 가스 표, PFC |
| 10 deposition | ✅ | ✅ 3/3 | ✅ 2 SQ (87/73자) | ✅ 117/110 (+6%) | CVD/PVD/ALD 표 |
| 11 ion-impl | ✅ | ✅ 3/3 | ✅ 1 SQ (89자) | ✅ 111/100 (+11%) | 이온주입/확산 비교 |
| 12 CMP | ✅ | ✅ 3/3 | ✅ 1 SQ (80자) | ✅ 99/100 (−1%) | 산화막/금속막 슬러리 |
| 13 packaging | ✅ | ✅ 4/4 | ✅ 2 SQ (85/80자) | ✅ 123/120 (+3%) | 8단계 표, OSAT 사각지대 |
| **합계** | **9/9** | **26/26** | **12 SQ** | **967/920 (+5%)** | **gap 0** |

---

## 2. 저작권 Audit

| 항목 | 기준 | 실제 | Status |
|------|------|------|:------:|
| SourceQuote 챕터당 개수 | ≤ 2 | Ch.8/10/13 = 2, 나머지 = 1 (총 12) | ✅ |
| SourceQuote 길이 | each ≤ 150자 | **67∼89자** (범위 안전) | ✅ |
| 자체 제작 표 | 9개 | 정확히 9개 | ✅ |
| 책 표 직접 복제 | 없음 | 0 | ✅ |
| 책 이미지 maxWidth | ≤ 600px (cover 520) | 모두 준수 | ✅ |
| 이미지 출처 명시 | 모든 ImageFigure | 26/26 `source` 속성 | ✅ |
| `_credits.json` fair use | 9 폴더 | 9/9 정책 + per-image | ✅ |

---

## 3. Cross-Chapter Coherence

| 참조 | 위치 | Status |
|------|------|:------:|
| Ch.6 → Ch.4 (클린룸의 역설) | `06-cleaning.mdx:79` | ✅ |
| Ch.7 → Ch.16 (부산물) | `07-diffusion.mdx:82` | ✅ |
| Ch.8 → Ch.4 + Ch.16 | `08-photolithography.mdx:115` | ✅ |
| Ch.9 → Ch.16 | `09-etching.mdx:92` | ✅ |
| Ch.10 → Ch.1 (무어/황) + Ch.16 | `10-deposition.mdx:102, 104` | ✅ |
| Ch.11 → Ch.3 (협력업체) + Ch.7 | `11-ion-implantation.mdx:100, 50` | ✅ |
| Ch.12 → Ch.16 | `12-cmp.mdx:87` | ✅ |
| Ch.13 → Ch.3 + Ch.4 | `13-packaging.mdx:106, 111` | ✅ |
| ChapterRef 다음 챕터 | 9/9 모두 정확 (Ch.6→13→14) | ✅ |

---

## 4. Open Questions Resolution (Design §11)

Design에서 Do로 미룬 세 가지가 모두 자연스럽게 해결됨:

| ID | 질문 | 해결 |
|----|------|------|
| **Q-D1** | Ch.8 fig-8-3 노광 위치 (§2 vs §3) | **§3 "노광"에 배치** (`08-photolithography.mdx:80-85`) — 의미적으로 정확 |
| **Q-D2** | Ch.13 패키징 표 8단계 vs 4단계 | **8단계 완전 채택** (`13-packaging.mdx:32-41`) — 라인 수 목표 + 책 구조 부합 |
| **Q-D3** | Ch.10 ALD 컬럼 추가 vs 생략 | **row 기반 채택** (`10-deposition.mdx:39-43`) — CVD/PVD/ALD 3 row 비교 |

→ **Report에 명시 권장**.

---

## 5. Gap List

### Blocker / Major / Minor — 모두 0건

### Extras (Design 외, 모두 긍정)
- Ch.10 → Ch.1 무어/황의 법칙 cross-link 추가 (Design은 Ch.16만 요구)
- Ch.11 → Ch.7 비교 표 추가 (이온주입 vs 확산)
- 라인 수 9 챕터 중 6 챕터 +3∼+11% 초과 (Ch.3/Ch.4의 보수적 미달 학습 반영)

---

## 6. 빌드 영향

| 항목 | Design 추정 | 실제 |
|------|-----------|------|
| 정적 페이지 | 70 → 70 | ✅ 70/70 |
| MDX 파일 | 31 | 31 |
| 공개 자산 | +35 (26 jpeg + 9 credits) | ✅ +35 |
| 빌드 결과 | — | ✅ Compiled 854ms, 70/70 export |

---

## 7. Match Rate 계산

```
Items: 36 (9 챕터 × 4축: 구조/자산/저작권/라인)
  + 별도 평가:
    - SourceQuote 길이 audit: ✅
    - Cross-chapter coherence: ✅
    - Open Question resolution: 3/3
    - 빌드: ✅

Total ✅: 36 + 4 = 40
Total ⚠️: 0
Total ❌: 0

Match Rate = 40 / 41 (1 = "Q-D1∼Q-D3 명시 권장" 미세 penalty)
           = 97.6% → reported as 98%
```

---

## 8. Recommendation

### ✅ 권고 다음 단계: `/pdca report ch5-to-ch13-process-light`

- **98% ≥ 90% 임계 압도 통과** (역대 최고)
- Blocker / Major / Minor Gap 0건
- 저작권 정책 완전 준수
- 빌드 70 페이지 정적 생성 성공
- 9 챕터 모두 ship-ready

### 다음 사이클 권고
- `/pdca report` → 완료 보고서
- `commit push` → 라이브
- `/pdca plan ch14-to-ch17-reflection` → **Sub-batch C** (Ch.14∼Ch.17, 4 챕터 hazard + reflection)

---

## 9. 참고

- Plan: `docs/01-plan/features/ch5-to-ch13-process-light.plan.md`
- Design: `docs/02-design/features/ch5-to-ch13-process-light.design.md`
- Batch parent: `docs/01-plan/features/ch3-to-ch17-batch.plan.md`
- Implementation:
  - `src/content/chapters/{05..13}-*.mdx` (9 files, 967 줄)
  - `public/source-images/ch{5..13}/` (9 folders, 26 jpeg + 9 credits)
- Commit: `3913a90 feat(ch5-to-ch13-process-light): Ch.5~Ch.13 9공정 챕터 light 보강`
