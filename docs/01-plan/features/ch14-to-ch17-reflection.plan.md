# Plan: ch14-to-ch17-reflection

> Sub-batch C of ch3-to-ch17-batch — Ch.14∼Ch.17 hazard + reflection 보강 (책 완주)

**작성일**: 2026-05-29
**Feature**: `ch14-to-ch17-reflection`
**Parent batch**: `ch3-to-ch17-batch` (Sub-batch C, 마지막)
**PDCA Phase**: Plan
**Status**: Draft

---

## Executive Summary

### 1.1 프로젝트 개요

| 항목 | 값 |
|------|---|
| Feature | Ch.14∼Ch.17 4 챕터 보강 (화학물질·전자파·질병·산업보건 시각) |
| Parent | `ch3-to-ch17-batch` Sub-batch C (15 챕터 중 마지막 4) |
| 참조 패턴 | A(Ch.3∼4, foundation), B(Ch.5∼13, light) — 두 패턴의 **하이브리드 (medium)** |
| 시작/예상 완료 | 2026-05-29 / ~3시간 |

### 1.2 결과 요약 목표

| 지표 | 목표 |
|------|------|
| Match Rate | ≥ 90% |
| 챕터당 분량 | 130∼170줄 (현재 61∼104줄, 1.5∼2배 확장) |
| 책 페이지 이미지 | 4 챕터 × 2∼3장 = 총 10∼12장 |
| 자체 제작 표 | 4 챕터 × 1∼2개 = 총 6∼8개 |
| SourceQuote | 챕터당 1∼2개 (≤ 150자), 총 6∼8개 |
| Callout | 챕터당 3∼5개, 총 14∼20개 |
| 신규 컴포넌트 / 인프라 | **0 / 0** |

### 1.3 Value Delivered

| 관점 | 결과 |
|------|------|
| **Problem (문제)** | Ch.14∼Ch.17은 책의 **결론부** — 9공정을 거쳐 산업보건적 종합·반성을 담는 가장 중요한 챕터들. 그런데 현재는 61∼104줄 요약 수준. 책의 핵심 메시지(영업비밀 35%, ELF 자기장 작업장 기준 부재, 한국 반도체 암 역학조사, 무어/황의 법칙이 만든 산업보건 시간 격차)가 사이트에 명시적으로 드러나지 않음. 책 도식(영업비밀 통계, 노출기준 비교, 한국 암 사례, 역학조사 결과)도 누락. |
| **Solution (해결)** | Ch.1∼Ch.13에서 확립한 인프라 + Sub-batch A 깊이 패턴 + Sub-batch B 묶음 효율의 **하이브리드 medium profile** 적용. 챕터당 이미지 2∼3 + 자체 표 1∼2 + SourceQuote 1∼2 + Callout 3∼5. Ch.16(질병)·Ch.17(반성)은 책의 narrative arc 정점이므로 약간 더 두텁게(~170줄), Ch.14(화학)·Ch.15(전자파)는 medium(~150줄). **신규 인프라 0**. |
| **Function UX Effect (기능 효과)** | (1) Ch.14 — 영업비밀 35% 통계 + 공정별 화학물질 분류 표 + MSDS 한계 명시 (2) Ch.15 — ELF 자기장 직업적/일반 노출기준 비교 표 + 작업장 기준 부재 메시지 (3) Ch.16 — 생식독성·암 역학조사 요약 + 영국/미국/**한국** 3국 비교 표 + "통계적 유의성 = 인과관계 아님" 균형 (4) Ch.17 — **무어/황의 법칙 → 산업보건 시간 격차** narrative closure + 책 7저자의 7가지 산업보건학적 시각 정리. **17 챕터 사이트 narrative arc 완성**. |
| **Core Value (핵심 가치)** | **17 챕터 사이트 완성** — Sub-batch A(2.5h, 2 챕터) + B(3h, 9 챕터) + **C(~3h, 4 챕터)** = 총 8.5h로 17 챕터 책 사이트 완성. 당초 22.5h 추정 대비 **62% 단축** 실증. 본 batch가 **AI 시대 도서 기반 콘텐츠 사이트 제작 방법론** 자체의 검증 — Plan→Design→Do→Check→Report 7 사이클 동안 인프라 재사용 + 묶음 효율 + 패턴 안정화의 누적 효과로 챕터당 시간 3h → 0.33h 가속, 동시에 Match Rate 94→98% 상승. |

---

## 2. 배경 (Why)

### 2.1 현재 상태

| 챕터 | 파일 | 현재 줄 수 |
|------|------|:----------:|
| Ch.14 화학물질 사용과 유해성 | `14-chemicals-usage.mdx` | 83 |
| Ch.15 반도체 공정과 전자파 | `15-electromagnetic.mdx` | 61 |
| Ch.16 주요 질병 위험 고찰 | `16-occupational-disease.mdx` | 85 |
| Ch.17 산업보건학적 시각 | `17-industrial-health-view.mdx` | 104 |
| **합계** | | **333** |

→ **목표**: 챕터 총 ~600줄 (Ch.14=150, Ch.15=130, Ch.16=170, Ch.17=150).

### 2.2 책의 narrative arc 정점

| 챕터 | 역할 |
|------|------|
| Ch.14 화학물질 | 1∼13장의 화학물질을 **종합** + 영업비밀·MSDS 한계 |
| Ch.15 전자파 | 화학물질 외 **물리적 인자** (반도체 산업 특유) |
| Ch.16 질병 | **결과** — 생식독성·암 역학 연구 (한국/영국/미국) |
| Ch.17 산업보건 시각 | 책의 **결론** — 7저자 + 7가지 시각 + narrative closure |

→ 결론부의 **무게감**을 부여하려면 medium profile이 적절.

### 2.3 데이터 자산 매핑

| 챕터 | 데이터 폴더 | 책 페이지 (추정) |
|------|------------|---------------|
| Ch.14 화학물질 | `-_toend` | p.219∼240 (page 55∼70 area) |
| Ch.15 전자파 | `-_toend` | p.245∼280 (page 73∼95 area) |
| Ch.16 질병 | `-_toend` | p.281∼324 (page 95∼115 area) |
| Ch.17 시각 | `-_toend` | p.325∼370 (page 119+ area) |

---

## 3. 요구사항 (Requirements)

### 3.1 기능 요구사항 (Functional)

| ID | 항목 | 우선순위 |
|----|------|:--------:|
| F1 | 4 챕터 모두 medium profile 적용 (Hero + 2∼3 ImageFigure + 1∼2 자체 표 + 1∼2 SourceQuote + 3∼5 Callout + ChapterRef) | P0 |
| F2 | 데이터 폴더에서 핵심 도식 추출 → `public/source-images/ch{14..17}/` | P0 |
| F3 | 각 폴더 `_credits.json` | P0 |
| F4 | Ch.14: 영업비밀 통계 + 공정별 화학물질 분류 자체 표 | P0 |
| F5 | Ch.15: ELF 자기장 노출기준 비교 자체 표 | P0 |
| F6 | Ch.16: 영국/미국/한국 역학조사 비교 자체 표 + 생식독성/암 요약 표 | P0 |
| F7 | Ch.17: 무어/황의 법칙 → 산업보건 시간 격차 자체 표 또는 도식 | P0 |
| F8 | Ch.17 closing narrative: Ch.1 "짧은 역사·빠른 변화" 위험과 연결 | P0 |
| F9 | 17 챕터 narrative arc 완성 (Ch.17이 책 전체 마무리) | P1 |

### 3.2 비기능 요구사항 (Non-Functional)

| ID | 항목 |
|----|------|
| N1 | 빌드 정상 — 70 페이지 유지 |
| N2 | 저작권 안전 — SourceQuote ≤ 2/챕터 (each ≤ 150자), 자체 표 ≥ 1/챕터, 책 표 직접 복제 금지 |
| N3 | 책 이미지 maxWidth ≤ 600px + 출처 명시 |
| N4 | `~` → `∼` 치환 |
| N5 | 신규 컴포넌트 / 인프라 0개 |
| N6 | Ch.16 한국 사례 — 직접 인용은 매우 신중히 (개인정보·법적 민감성) |

### 3.3 저작권 정책 (Ch.1∼Ch.13과 동일)

| 항목 | 정책 |
|------|------|
| SourceQuote | 챕터당 ≤ 2, 각 ≤ 150자, 페이지·섹션 출처 |
| 자체 제작 표 | 4 챕터 × 1∼2 = 총 6∼8개 (저작권 무관) |
| 책 표 직접 복제 | **금지** — 자체 재구성 |
| 책 이미지 | maxWidth ≤ 600px + `source` 속성 + `_credits.json` |
| 본문 | 책 흐름 따르되 자체 서술 |
| **Ch.16 한국 사례** | **이름·기업명 직접 인용 금지**, 책의 통계·결론만 요약 |

---

## 4. 산출물 (Deliverables)

| 카테고리 | 항목 | 수량 |
|---------|------|:----:|
| 자산 폴더 | `public/source-images/ch{14..17}/` | 4개 신규 |
| 책 이미지 | jpeg 복사 | 10∼12장 |
| Credits | `_credits.json` | 4개 |
| MDX 재작성 | `src/content/chapters/{14..17}-*.mdx` | 4개 |
| 자체 표 | markdown table | 6∼8개 |
| SourceQuote | `<SourceQuote>` | 6∼8개 |
| Callout | `<Callout>` | 14∼20개 |
| 문서 | analysis + report | 2개 |

---

## 5. 범위 (Scope)

### 5.1 In Scope
- Ch.14∼Ch.17 4 챕터 MDX medium 확장
- 챕터별 책 이미지 2∼3장 + `_credits.json`
- 챕터별 자체 표 1∼2개
- 챕터별 SourceQuote 1∼2개 + Callout 3∼5개
- Ch.17 = 17 챕터 사이트의 narrative closure
- 빌드 검증 + commit + push

### 5.2 Out of Scope
- 공정 페이지(`/process/*`) 수정
- 화학물질 페이지(`/chemicals/*`) 수정
- 신규 컴포넌트
- 책 한국 사례의 이름·기업명 직접 인용
- ChemicalCard 깊은 통합 (해당 페이지에 위임)

---

## 6. 마일스톤 (Milestones)

| Phase | 작업 | 예상 시간 |
|------|------|:----:|
| Plan | 본 문서 | 25m |
| Design | 챕터별 이미지 매핑 + 자체 표 명세 + SourceQuote 후보 | 25m |
| Do A | Ch.14∼Ch.15 (이미지 5∼6 + MDX 2) | 1h |
| Do B | Ch.16∼Ch.17 (이미지 5∼6 + MDX 2) | 1h |
| Do C | 빌드 + commit + push | 20m |
| Check + Report | analysis + report | 30m |
| **합계** | | **~3.5h** |

---

## 7. Open Questions

| ID | 질문 | 결정 시점 | 후보 |
|----|------|----------|------|
| Q1 | 챕터당 이미지 2 vs 3 (총 8 vs 12장) | Design | 평균 2.5 (Ch.16 3장, 나머지 2∼3장) |
| Q2 | Ch.16 한국 역학조사 — 표 직접 재구성 vs 책 표 참조 | Design | **자체 표 (영국/미국/한국 3국 비교)** 권장 |
| Q3 | Ch.17 closing — 단일 Callout vs LayeredExplain 회상 | Design | LayeredExplain Hero + 별도 closing Callout |
| Q4 | Ch.14 영업비밀 35% 통계 — 표 vs 인용문 vs Callout | Design | **자체 표 (Ch.8 PR MSDS 재참조 + 종합)** |
| Q5 | Sub-batch C 책 마무리 후 README/About 업데이트 여부 | Report 단계 | **포함** (책 완주 자축 + 다음 단계 안내) |

---

## 8. 리스크 (Risks)

| ID | 리스크 | 영향 | 대응 |
|----|-------|------|------|
| R1 | Ch.16 한국 사례 — 개인정보·법적 민감성 | 큰 문제 | 이름·기업명 직접 인용 금지, 통계·결론만 |
| R2 | Ch.17 narrative closure 어색함 | UX 저하 | LayeredExplain Hero에 책 7저자·17 챕터 회상 명시 |
| R3 | Ch.14 화학물질 표 = Ch.4∼Ch.13 화학물질과 중복 | 가치 저하 | 종합 관점 (영업비밀 vs 공개)로 차별화 |
| R4 | Ch.15 전자파 = 다른 챕터와 결이 다름 | 흐름 단절 | "화학물질 외 물리적 인자" 명시화로 위치 부여 |
| R5 | medium profile 시간 budget 초과 | 3h → 4h+ | Ch.14/Ch.15 light 수준(~140), Ch.16/Ch.17만 깊이(~170) |

---

## 9. 의존성 (Dependencies)

| 항목 | 상태 |
|------|------|
| Ch.1∼Ch.13 인프라 + 패턴 학습 | ✅ 완료 |
| 데이터 폴더 `-_toend` 후반부 (page 55+) | ✅ 활용 가능 |
| Ch.16 한국 사례 정책 (이름 비공개) | 본 Plan에서 결정 |

---

## 10. 성공 기준 (Success Criteria)

- [x] Plan 문서 작성 완료
- [ ] Design 문서에서 Q1∼Q5 결정 + 4 챕터 이미지 매핑 확정
- [ ] Do — 4 챕터 MDX 재작성 + 이미지 10∼12장 + `_credits.json` 4개
- [ ] Build → 70 페이지 유지
- [ ] Match Rate ≥ 90%
- [ ] 저작권 audit 통과 (한국 사례 익명 처리 포함)
- [ ] **17 챕터 사이트 narrative arc 완성** — Ch.17 closing이 Ch.1 "짧은 역사·빠른 변화"와 닫힘 (책 완주)

---

## 11. 참고

- Parent batch: `docs/01-plan/features/ch3-to-ch17-batch.plan.md`
- 패턴 출처: `docs/04-report/ch3-ch4-foundation.report.md` (foundation 깊이) + `docs/04-report/ch5-to-ch13-process-light.report.md` (light 묶음)
- 원본: `data/20260527_154313_..._-_toend/` (Ch.12∼Ch.17 후반부)
- 책: 「반도체 산업의 유해인자」 윤충식 외 저, 에피스테메
- **이 사이클이 ch3-to-ch17-batch 완주 + 17 챕터 사이트 완성**
