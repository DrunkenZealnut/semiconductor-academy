# Report: reading-experience-ch1

> 폰트 크기 조정 + Ch.1 본문 깊이 확장 + 책 페이지 이미지 — PDCA 완료 보고서

**작성일**: 2026-05-29
**Feature**: `reading-experience-ch1`
**PDCA Phase**: Completed
**Linked**:
- [Plan](../01-plan/features/reading-experience-ch1.plan.md)
- [Design](../02-design/features/reading-experience-ch1.design.md)
- [Analysis](../03-analysis/reading-experience-ch1.analysis.md)

---

## Executive Summary

### 1.1 프로젝트 개요

| 항목 | 값 |
|------|---|
| Feature | 폰트 크기 조정 (사이트 전체) + Ch.1 본문 깊이 확장 + 책 페이지 이미지 |
| 시작/완료 | 2026-05-29 (단일 세션, ~3시간) |
| Part A 범위 | 사이트 전체 (폰트 시스템) |
| Part B 범위 | **Ch.1만** (다른 챕터로 확산할 템플릿 확립) |

### 1.2 결과 요약

| 지표 | 목표 | 실제 |
|------|------|------|
| Match Rate | ≥ 90% | **94%** ✅ |
| 폰트 단계 | 3 (작게/보통/크게) | **3** ✅ |
| Ch.1 분량 | ~300줄 | **248줄** (밀도 높음) ⚠️ |
| 표 재현 | 1-1, 1-2, 1-3 | **3개 모두** ✅ |
| 책 페이지 이미지 | 5장 | **5장** ✅ |
| 외부 Wikimedia 이미지 | 2장 | 0 (의도된 deferral) ❌ |
| SourceQuote | 3~5개 | **3개** ✅ |
| Iteration | ≤ 1 | **0** (첫 검증 임계 통과) ✅ |

### 1.3 Value Delivered

| 관점 | 결과 |
|------|------|
| **Problem (문제)** | 챕터 본문이 책 원문의 30~40% 요약만 — "비유" 중심이라 학술 깊이 부족. 글꼴이 작아 장시간 학술 콘텐츠 읽기 피로함. 책의 표·그림이 사이트에 거의 미반영. |
| **Solution (해결)** | **Part A**: 헤더에 `Aa` 드롭다운 → 3단계(16/18/21px) 즉시 적용 + localStorage 저장. **Part B**: Ch.1을 책의 절·세부절(1-가/나, 2-가/나) 구조 그대로 재구성. 표 3개 마크다운 재현, 책 페이지 그림 5장을 `<ImageFigure>` + Lightbox로 확대 가능, 핵심 단락 3개 `<SourceQuote>` 학술 인용. Callout 5개로 핵심 강조. |
| **Function UX Effect (기능 효과)** | (1) 폰트 토글 즉시 prose 본문에 반영 + 다음 방문 시 유지 (FOUC 방지) (2) Ch.1이 책처럼 읽힘 — 4가지 특성 / 5가지 연구 범주 / ITRS 4가지 명제 모두 포함 (3) ImageFigure 클릭 → Lightbox 확대 (ESC + 외부 클릭 닫기) (4) 각 이미지·표에 원본 페이지 출처 명시 (5) About 페이지에 이미지 정책 섹션 추가 |
| **Core Value (핵심 가치)** | **학술 도서의 디지털 독서 경험** — 단순 요약 사이트가 아니라 책 자체를 디지털로 읽음. 시각 부담은 사용자가 조정, 깊이는 사이트가 보장. Ch.1 패턴(절·표·그림·SourceQuote·ImageFigure)이 검증되어 **나머지 16챕터에 그대로 확산할 수 있는 템플릿**이 됨. |

---

## 2. PDCA 사이클 회고

### 2.1 단계별 결과

```
[Plan]✅ ──→ [Design]✅ ──→ [Do]✅ ──→ [Check]✅ 94% ──→ [Report]✅
   ~15min       ~30min       ~2.5h       ~10min          본 문서
```

| Phase | 산출물 |
|-------|--------|
| Plan | plan.md (14 sections + Q1~Q5 + 저작권 정책 R1·R2) |
| Design | design.md (11 sections + Q1~Q5 default 확정 + 컴포넌트 시그니처) |
| Do | 20 파일 변경 (1 commit, 3106883) |
| Check | analysis.md, **Match Rate 94%**, 첫 검증 임계 통과 |
| Report | 본 문서 |

### 2.2 핵심 의사결정 (Design Q1~Q5)

| Q | 결정 | 결과 |
|---|------|------|
| Q1 UI | 드롭다운 (Aa 아이콘) | ✅ 모바일 friendly, 다크모드 토글과 일관 |
| Q2 Lightbox | 자체 구현 (Dialog 기반) | ✅ 의존성 회피, Tailwind 통합 깔끔 |
| Q3 이미지 변환 | jpeg 그대로 | ✅ 작은 사이즈 그대로, 변환 시간 회피 |
| Q4 외부 이미지 | Wikimedia 2장 | ❌ deferred (Plan/Design 사전 승인) |
| Q5 Small | 16px (모바일 권장) | ✅ |

### 2.3 첫 검증에서 94% — 사이클 성숙도

| 사이클 | 첫 Match Rate | Iteration |
|--------|:------------:|:---------:|
| semiconductor-academy-site (1) | 81% | 1회 필요 |
| chapter-based-restructure (2) | 97% | 0회 |
| **reading-experience-ch1 (3)** | **94%** | **0회** |

Plan/Design 정밀화 패턴이 안정화. 매 사이클 첫 검증부터 임계 통과 가능.

---

## 3. 구현 통계

### 3.1 코드 규모

| 영역 | 신규 파일 | 변경 파일 |
|------|---------|---------|
| 컴포넌트 | 3 (FontSizeToggle, ImageFigure, Lightbox) | 2 (Header, mdx-components) |
| MDX 챕터 | - | 1 (01-risks-of-new-tech.mdx, ~50→248줄) |
| 페이지 | - | 2 (layout.tsx, about/page.mdx) |
| 스타일 | - | 1 (globals.css) |
| 자산 (public) | **6** (5 jpeg + _credits.json) | - |
| PDCA 문서 | 4 (plan/design/analysis/report) | - |
| **합계** | **13 신규** | **6 변경** |

### 3.2 Ch.1 콘텐츠 밀도

| 요소 | 개수 |
|------|:---:|
| 절 (1, 2) | 2 |
| 세부절 (가, 나) | 4 |
| 표 (1-1, 1-2, 1-3) | 3 |
| ImageFigure (책 페이지) | 5 |
| SourceQuote (≤150자 인용) | 3 |
| Callout | 5 |
| 라인 수 | 248 |

### 3.3 빌드 영향

| 항목 | 이전 | 이후 |
|------|------|------|
| 정적 페이지 | 58 | 58 (변경 없음) |
| MDX 파일 | 31 | 31 (Ch.1만 분량 증가) |
| 컴포넌트 | 25 | **28** (+3) |
| 공개 자산 | 5 | **11** (+6) |

---

## 4. 배포

### 4.1 GitHub Pages

| 항목 | 값 |
|------|---|
| URL | https://drunkenzealnut.github.io/semiconductor-academy/chapter/risks-of-new-tech/ |
| Commit | 3106883 |
| 빌드 시간 | ~13초 |
| 응답 | 200 OK |

### 4.2 라이브 검증

- Ch.1: 200 ✅
- 이미지 ch1-cover.jpg: 200 ✅
- 이미지 fig-1-2 (낡은 방패): 200 ✅

---

## 5. 잘 된 점 (Wins)

1. **첫 검증에서 94%** — Iteration 없이 임계 통과. 3 사이클 연속 안정적 성숙.
2. **Ch.1 사용자 경험 질적 도약** — 책 흐름·표·그림이 모두 사이트로 옮겨와 단순 요약 사이트에서 "디지털 도서"로 진화.
3. **재사용 가능한 컴포넌트 3개** — FontSizeToggle/ImageFigure/Lightbox 모두 Ch.1 외 다른 챕터·페이지에서 그대로 활용 가능.
4. **폰트 시스템의 깔끔한 통합** — FOUC 방지 inline script가 기존 theme detection 스크립트와 자연스럽게 통합. 별도 라이브러리 0.
5. **저작권 정책 명시화** — About 페이지에 "이미지 출처 및 라이선스" 섹션 추가, `_credits.json`으로 이미지별 메타 분리. 학술 fair use 범위 내 명확.
6. **이미지 자산 패턴 확립** — `public/source-images/ch{N}/` + `_credits.json` 구조가 다른 챕터로 확산하기 쉬운 표준.

---

## 6. 아쉬운 점 (Gaps)

1. **외부 Wikimedia 이미지 2장 누락** — Design Q-D1에서 사전 승인된 deferral. 차기 사이클(다른 챕터 확산 시) 함께 처리 권장.
2. **Ch.1 248줄 (목표 300줄)** — ">200줄 reasonable" 기준 통과지만, 책의 일부 단락(역사적 사례 사이의 연결)은 더 풍부히 옮길 수 있음.
3. **나머지 16챕터 미적용** — Ch.1 패턴이 검증됐지만 Ch.2~17은 그대로. 확산 작업 별도 사이클 필요.
4. **모바일 폰트 토글 위치** — 헤더 우측이 햄버거 메뉴와 가깝게 위치. 사용성은 OK이나 약간 빽빽함.
5. **표의 모바일 가독성** — 표 1-2는 7컬럼이라 모바일에서 가로 스크롤 발생. 모바일 전용 카드 변환 고려 가능.

---

## 7. 학습 사항 (Lessons Learned)

1. **Plan 단계의 저작권 정책 명시(R1, R2)가 Do 단계 안전성을 보장** — 본문 인용 ≤150자, 표는 fair use, 이미지 출처 명시 등 사전 정의된 가드레일로 Do 단계 결정 단순화.
2. **FOUC 방지 inline script 패턴** — theme + font-size를 한 스크립트에서 처리. 두 번째 스크립트 추가하지 않고 기존 코드에 5줄 추가.
3. **Wikimedia 이미지 다운로드는 사이클 외부에서** — 안정적 URL + 라이선스 메타 캡처가 시간 소모. 사이클 흐름에서 deferred 처리하는 게 효율적.
4. **콘텐츠 밀도 ≠ 라인 수** — Ch.1 248줄이지만 표 3개·그림 5장·Callout 5개·인용 3개로 시각 밀도 매우 높음. 라인 수 목표는 desired indicator일 뿐.
5. **자동 훅이 또 디렉토리명을 feature로 추출** — 3 사이클 연속 동일 현상. bkit 자체 이슈로 보고 가치 있음.
6. **Lightbox는 ESC + 외부 클릭 + body scroll lock + image stopProp 4가지가 핵심** — 작은 컴포넌트지만 모든 인터랙션 케이스 커버해야 사용자 경험 완성.

---

## 8. Future Work (차기 사이클 후보)

| 우선순위 | 항목 | 비고 |
|---------|------|------|
| **P1** | Ch.2~17에 동일 패턴 확산 | Ch.1 템플릿 + 각 챕터의 책 페이지 이미지 + 표 |
| **P1** | Wikimedia 외부 이미지 2장 (Ch.1 보강) | 라이선스 검증 + 다운로드 |
| **P2** | 표 모바일 카드 변환 | 7컬럼 표가 모바일에서 잘리는 문제 |
| **P2** | 폰트 토글 키보드 단축키 | Cmd+/- 등 |
| **P2** | 챕터 진도 트래킹 (localStorage) | chapter-based-restructure에서 deferred한 항목 |
| **P3** | 책 표지 일러스트 | 홈/about 페이지 보강 |
| **P3** | 챕터 인쇄·PDF export | 옵션 |

---

## 9. 인용 / Attribution

본 사이클은 책 **「반도체 산업의 유해인자」**(윤충식 외, 에피스테메) 1장(p.15~26)을 사이트로 옮김.

- 본문: 짧은 발췌 SourceQuote 3개(각 ~150자 이내) + 자체 재구성
- 표 1-1, 1-2, 1-3: 학술 표 fair use, 출처 명시
- 그림 1-1, 1-2, 1-3, 1-4 + 표지 일러스트: 작은 크기(600px 이내) + 출처 명시
- About 페이지에 라이선스 정책 명시

---

## 10. 다음 단계

```bash
# 본 사이클 아카이브 (통계 보존)
/pdca archive reading-experience-ch1 --summary

# 또는 차기 사이클 (Ch.2 확산)
/pdca plan ch2-deep-content
```

---

**제출**: 2026-05-29
**책임자**: DrunkenZealnut (kcsvictory@gmail.com)
**최종 상태**: ✅ Completed (Match Rate 94% / Ch.1 라이브 / 폰트 토글 사이트 전체 적용)
