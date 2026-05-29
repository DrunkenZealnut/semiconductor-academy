# Analysis: ch14-to-ch17-reflection

> PDCA Check Phase — Sub-batch C, batch 마지막 사이클

**작성일**: 2026-05-29
**Feature**: `ch14-to-ch17-reflection`
**Parent**: `ch3-to-ch17-batch` (Sub-batch C, 마지막)
**PDCA Phase**: Check
**Linked**: [Plan](../01-plan/features/ch14-to-ch17-reflection.plan.md) · [Design](../02-design/features/ch14-to-ch17-reflection.design.md)

---

## 0. Executive Summary

| 항목 | 결과 |
|------|------|
| **Match Rate** | **95%** ✅ |
| **Blocker** | 0 |
| **Major Gap** | 0 |
| **Minor Gap** | 4 (라인 수 80%, 콘텐츠는 완비) |
| **저작권 안전성** | ✅ 완전 준수 (Ch.16 anonymization PASS) |
| **자체 표** | **9개** (목표 6 — 50% 초과 달성) |
| **빌드 검증** | ✅ 70/70 static export |
| **권고** | `/pdca report ch14-to-ch17-reflection` 진행 — **17 챕터 완주** |

### 핵심 발견 Top 3

1. **Match Rate 95%** — 자산 9/9 + credits 4/4 + 자체 표 9 (목표 6 초과) + Callout 16 + SourceQuote 7 모두 ≤ 150자 충족.
2. **Ch.16 anonymization PASS** — 회사명·인명·소송명 0건 grep 확인. Design Q2 정책 완전 준수.
3. **라인 수 80% 미달이 유일한 minor gap** — Ch.3/Ch.4(foundation)과 같은 보수적 추정 결과 패턴. 콘텐츠 밀도 완비.

### 주의: gap-detector 1차 오인
초기 gap-detector 보고에서 `_credits.json` 4개 누락으로 88%로 산정됐으나, **실제 파일 시스템 확인 결과 4 파일 모두 정상 존재** (Do 단계 커밋 `b9d0789`에 포함). False negative 정정 후 정확한 Match Rate = **95%**.

---

## 1. Per-Chapter 검증 매트릭스

| Ch | 구조 | 자산 (jpeg + credits) | 저작권 | 라인 (실제/목표) | 비고 |
|:--:|:----:|:-------:|:----:|:------:|------|
| 14 chemicals | ✅ | ✅ 2 jpeg + credits | ✅ 2 SQ (≤150자) | ⚠️ 113/150 (75%) | 자체표 3 (목표 2, +1 bonus 4중 장벽) |
| 15 EMF | ✅ | ✅ 2 jpeg + credits | ✅ 1 SQ | ⚠️ 101/130 (78%) | 자체표 2 (목표 1, +1 bonus 공정별 강도) |
| 16 disease | ✅ | ✅ 4 jpeg + credits | ✅ 2 SQ + **anonymized** | ⚠️ 127/170 (75%) | 자체표 2 (목표 2) |
| 17 view | ✅ | ✅ 1 jpeg + credits (fig-17-1 표 대체 Q-D3) | ✅ 2 SQ | ⚠️ 141/150 (94%) | 자체표 2 (회상 + 시간격차) |
| **합계** | **4/4** | **9 jpeg + 4 credits** | **7 SQ** | **482/600 (80%)** | **자체표 9 (목표 6, +3 bonus)** |

---

## 2. Ch.16 Anonymization Audit (Design Q2 정책)

| 검사 항목 | 결과 |
|---------|------|
| 회사명 (삼성, SK, 하이닉스, NSEC, IBM 등) | **0건 (PASS)** |
| 인명 (개인) | **0건 (PASS)** |
| 소송·판결·법원 명 | **0건 (PASS)** |
| 사용된 표현 | "국내 반도체 공장 코호트", "회사별 자체 조사", "1980∼1990s 미국 반도체 회사" |
| EGE 퇴출 사례 | 익명 ("미국 반도체 회사의 자체 조사", "업계 자율") |

→ **Design Q2 정책 (이름·기업명 비공개) 100% 준수**.

---

## 3. SourceQuote 길이 Audit

| Ch | 페이지 | 길이 | Status |
|:--:|:------:|:----:|:------:|
| 14 | 222 | ~95자 | ✅ |
| 14 | 235 | ~75자 | ✅ |
| 15 | 270 | ~85자 | ✅ |
| 16 | 286 | ~95자 | ✅ |
| 16 | 310 | ~95자 | ✅ |
| 17 | 330 | ~80자 | ✅ |
| 17 | 345 | ~75자 | ✅ |

**모두 ≤ 150자**. 7/7 ✅.

---

## 4. Cross-Chapter Narrative Arc — Ch.17 Closing

| 검증 항목 | 위치 | Status |
|---------|------|:------:|
| Ch.17 §1 "17 챕터 회상" 표 | `17-industrial-health-view.mdx:23-32` | ✅ Ch.1∼Ch.16 전부 참조 |
| Ch.17 §2 시간 격차 표 | `17-industrial-health-view.mdx:38-46` | ✅ Q-D3 자체 표로 대체 |
| Ch.17 closing Callout (Q-D2) | `17-industrial-health-view.mdx:116-127` | ✅ /chemicals + /process-overview + /about + Ch.1 4개 진입점 |
| Ch.14 → Ch.6∼13 cross-link | `14-chemicals-usage.mdx:51-60` | ✅ 8 ChapterRef |
| Ch.14 → Ch.16 결과 연결 | `14-chemicals-usage.mdx:86-89` | ✅ |
| Ch.15 → Ch.4 클린룸 역설 | `15-electromagnetic.mdx:94-96` | ✅ |
| Ch.16 → Ch.17 closing 예고 | `16-occupational-disease.mdx:120-123` | ✅ |

→ **17 챕터 사이트 narrative arc 완성**.

---

## 5. Q-D1∼Q-D3 Resolution (Design §11)

| ID | 질문 | Do에서 결정 |
|----|------|---------|
| Q-D1 | Ch.16 한국 사례 직접 인용 길이 | **회사·인명 모두 0 (가장 보수적)** — 카테고리 통계만 |
| Q-D2 | Ch.17 closing — About vs Ch.1 | **5개 진입점 통합** (chemicals + process-overview + about + Ch.1 + 5주체 표) |
| Q-D3 | Ch.17 fig-17-1 추가 vs 표 단독 | **자체 표 단독 채택** (시간 격차 4행) |

→ 3건 모두 implicit 해결, Report에 명시 권장.

---

## 6. 빌드 영향

| 항목 | Design 추정 | 실제 |
|------|-----------|------|
| 정적 페이지 | 70 → 70 | ✅ 70/70 |
| MDX 파일 | 31 | 31 |
| 공개 자산 | +13 (9 jpeg + 4 credits) | ✅ +13 |
| 빌드 결과 | Compiled 1427ms, 70/70 export | ✅ |

---

## 7. Match Rate 계산

```
Weighted score:
  - Structure (40%): 4/4 = 100% → 40
  - Assets (20%): 9/9 jpeg + 4/4 credits = 100% → 20
  - Copyright (25%): 7/7 SQ ≤150자 + Ch.16 anonymized + 자체표 9/6 = 100% → 25
  - Line count (15%): 482/600 = 80% → 12

Total = 40 + 20 + 25 + 12 = 97%

Conservative weighting (라인 수 minor penalty):
  → reported as 95%
```

---

## 8. Recommendation

### ✅ 권고: `/pdca report ch14-to-ch17-reflection`

- 95% ≥ 90% 임계 통과
- Blocker / Major Gap 0건
- Ch.16 anonymization 완전 준수
- 자체 표 50% 초과 달성 (9 vs 6)
- 빌드 70 페이지 정적 생성 성공
- 17 챕터 narrative arc closing 완료

### 🎓 17 챕터 사이트 완주

본 Check Phase 통과 = **「반도체 산업의 유해인자」 17 챕터 책 사이트 완성**. Sub-batch A(Ch.3∼4) +
B(Ch.5∼13) + **C(Ch.14∼17)** 모두 ≥ 90% Match Rate.

### Batch 전체 통계

| Sub | 챕터 | Match Rate | Iteration |
|:---:|------|:---:|:---:|
| A | 2 (Ch.3∼4) | 96% | 0 |
| B | 9 (Ch.5∼13) | 98% | 0 |
| **C** | **4 (Ch.14∼17)** | **95%** | **0** |
| **평균** | **15** | **96.3%** | **0** |

**6 PDCA 사이클 (Ch.1∼Ch.17) 평균 95.8%, 모두 0-iteration.**

---

## 9. 참고

- Plan: `docs/01-plan/features/ch14-to-ch17-reflection.plan.md`
- Design: `docs/02-design/features/ch14-to-ch17-reflection.design.md`
- Batch parent: `docs/01-plan/features/ch3-to-ch17-batch.plan.md`
- Implementation:
  - `src/content/chapters/{14..17}-*.mdx` (4 files, 482줄)
  - `public/source-images/ch{14..17}/` (4 folders, 9 jpeg + 4 credits)
- Commit: `b9d0789 feat(ch14-to-ch17-reflection): Ch.14~Ch.17 hazard + reflection 보강 (책 완주)`
