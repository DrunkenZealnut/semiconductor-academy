# Report: chapter-based-restructure

> 책 17챕터를 사이트 메인 IA로 재구성 — PDCA 완료 보고서

**작성일**: 2026-05-27
**Feature**: `chapter-based-restructure`
**PDCA Phase**: Completed
**Linked**:
- [Plan](../01-plan/features/chapter-based-restructure.plan.md)
- [Design](../02-design/features/chapter-based-restructure.design.md)
- [Analysis](../03-analysis/chapter-based-restructure.analysis.md)

---

## Executive Summary

### 1.1 프로젝트 개요

| 항목 | 값 |
|------|---|
| Feature | 책 17챕터의 사이트 IA 재구성 |
| 시작일 | 2026-05-27 |
| 완료일 | 2026-05-27 (단일 세션, 약 2시간) |
| 입력 데이터 | 4개 markdown 파일, **4,673줄** |
| 작업 결과 | 신규 34 파일 + 수정 8 파일 |

### 1.2 결과 요약

| 지표 | 목표 | 실제 |
|------|------|------|
| Match Rate (Design 대비) | ≥ 90% | **97%** ✅ |
| 챕터 페이지 | 17 | **17** ✅ |
| 챕터 목차 페이지 | 1 | **1** ✅ |
| 챕터 MDX 본문 | 17 | **17 (826줄)** ✅ |
| 정적 페이지 증가 | +17 | 41 → **58** ✅ |
| 기존 라우트 유지 | 12개 | **모두 유지** ✅ |
| 신규 컴포넌트 | 6 | **6 + ChaptersIndex 인라인** ✅ |
| Iteration 횟수 | ≤ 1 | **0** (1회만에 임계 통과) ✅ |

### 1.3 Value Delivered

| 관점 | 결과 |
|------|------|
| **Problem (문제)** | 사이트가 공정·사전 중심 IA였고, 책의 가장 강력한 도입(1장 새 기술의 위험성)과 결론(17장 산업보건학적 시각)이 사이트에 충분히 노출되지 않음. 책으로 학습하려는 사용자가 어디부터 읽어야 할지 막막. |
| **Solution (해결)** | **챕터 메인 + 공정·사전 병행** IA. 17챕터를 `/chapter/[N-slug]/` 동적 SSG로 추가하고, `/chapters/` 책 차례 페이지에서 4-tier 카테고리(기초/공정/유해성/성찰)로 그룹화. 기존 공정 다이어그램·물질 사전은 보조 채널로 유지 — 같은 콘텐츠를 **3가지 각도**(책·공정·물질)에서 접근. |
| **Function UX Effect (기능 효과)** | (1) 책 흐름대로 prev/next 학습 + "목차로" 네비 (2) 카테고리 색상 코딩(🏛 blue / ⚙ emerald / ⚠ amber / 💭 purple)으로 챕터 성격 즉각 인식 (3) **챕터 17 신규 본문** — 책 결론(사전주의 원칙 5가지 적용안 + 주체별 할 일) (4) 5~13장은 도입 + 공정 페이지 위임 — 정보 중복 없음 (5) 헤더 메뉴 "책 차례" 추가로 새 entry 강조 (6) 빌드 영향 미미 (~+3초) |
| **Core Value (핵심 가치)** | **책으로서의 사이트** — 단순 reference가 아니라 처음부터 끝까지 읽을 수 있는 디지털 도서. 학술서를 책 그대로의 흐름으로 학습하면서도 디지털 매체의 검색·탐색·시각화 이점은 모두 누림. 새 챕터 17(산업보건학적 시각)은 책의 결론이자 사이트의 결론으로, 사용자에게 사전주의 원칙의 구체적 실천 방안을 제시. |

---

## 2. PDCA 사이클 회고

### 2.1 단계별 결과

```
[Plan]✅ ──→ [Design]✅ ──→ [Do]✅ ──→ [Check]✅ 97% ──→ [Report]✅
   ~15min       ~15min       ~1.5h       ~5min          본 문서
```

| Phase | 소요 | 산출물 |
|-------|------|--------|
| Plan | ~15분 | plan.md (Executive Summary + 14 sections) + Q1~Q5 도출 |
| Design | ~15분 | design.md (13 sections, ~1100줄) + Q1~Q5 default 확정 |
| Do | ~1.5시간 | 34 신규 + 8 수정 (1 commit, c01d956) |
| Check | ~5분 | analysis.md, **Match Rate 97%** |
| Report | ~5분 | 본 문서 |

### 2.2 Match Rate

이전 feature(semiconductor-academy-site)는 81% → 95%로 1 iteration 필요했지만, 이번은 **첫 검증에서 97%**.

원인:
1. **Design 문서가 매우 구체적** — §1~§13 모두 파일 경로·라인 수준 명세
2. **Plan에서 Q1~Q5 미해결 결정을 미리 도출**, Design에서 명시적 default로 확정 → Do 단계 모호함 0
3. **데이터 모델·라우팅을 Design 단계에서 완전 정의** → 구조 deviation 최소화
4. **이전 feature 학습** — bkit MDX 패턴, Tailwind v4, App Router 익숙

### 2.3 핵심 의사결정 (Design Q1~Q5)

| Q | 결정 | 결과 |
|---|------|------|
| Q1 홈 entry | 별도 hero 섹션 (기존 3-card 유지) | ✅ ChaptersHero 다이어그램과 3-card 사이에 정확히 삽입 |
| Q2 진도 트래킹 | 이번 사이클 제외 (YAGNI) | ✅ 차기 사이클 후보로 보존 |
| Q3 5~13장 분량 | 도입 + `/process/*` 위임 | ✅ 9개 챕터 짧은 본문 + ProcessDiagram + 외부 링크 패턴 일관 |
| Q4 기존 URL | 유지 + canonical만 챕터로 | ⚠️ canonical 메타 적용 deferred (의도된 loose-end) |
| Q5 카테고리 시각화 | 색상 + 라벨 tag | ✅ 4 카테고리 색상 + emoji + 라벨 |

---

## 3. 구현 통계

### 3.1 코드 규모

| 영역 | 파일 수 | 라인 (대략) |
|------|--------|-----------|
| 챕터 MDX 본문 | 17 | **826줄** |
| Chapter 컴포넌트 | 6 (Card, Header, FooterNav, CategoryBadge, Ref, Hero) | ~350 |
| 라이브러리 (chapters.ts, chaptersMdx.tsx) | 2 | ~70 |
| 데이터 (chapters.json) | 1 | ~145 |
| 페이지 (chapters/, chapter/[slug]/) | 2 | ~140 |
| 타입 추가 (types.ts에 Chapter 모델) | - | ~50 |
| 기타 수정 (page.tsx, Header, mdx-components, sitemap) | 4 | ~50 |
| **합계 신규** | **34** | **~1,630줄** |

### 3.2 17챕터 분포

| 카테고리 | 챕터 # | 분량 정책 |
|---------|--------|---------|
| 🏛 기초 (foundation, blue) | 1~4 (위험성/반도체/공정/클린룸) | 풀 본문 |
| ⚙ 공정 (process, emerald) | 5~13 (웨이퍼/클리닝/확산/포토/식각/증착/이온주입/CMP/패키징) | 도입 + 위임 |
| ⚠ 유해성 (hazard, amber) | 14~16 (화학물질 사용/전자파/직업병) | 풀 본문 |
| 💭 성찰 (reflection, purple) | 17 (산업보건학적 시각) | **신규 풀 본문** |

### 3.3 SSG 정적 페이지

| 항목 | 이전 | 이후 | Δ |
|------|------|------|---|
| 정적 페이지 | 41 | **58** | +17 (챕터) +1 (목차, 정확히는 +18 - 1 = +17 순증) |
| MDX 파일 | 14 | **31** | +17 |
| JSON 데이터 | 3 | **4** | +chapters |
| 컴포넌트 | 19 | **25** | +6 (chapter/*) |

### 3.4 핵심 라우트

```
신규 (18):
  /chapters/                                목차
  /chapter/risks-of-new-tech/               Ch.1
  /chapter/semiconductor/                   Ch.2
  /chapter/process-overview-chapter/        Ch.3
  /chapter/cleanroom-chapter/               Ch.4
  /chapter/wafer/                           Ch.5
  /chapter/cleaning/                        Ch.6
  /chapter/diffusion/                       Ch.7
  /chapter/photolithography/                Ch.8
  /chapter/etching/                         Ch.9
  /chapter/deposition/                      Ch.10
  /chapter/ion-implantation/                Ch.11
  /chapter/cmp/                             Ch.12
  /chapter/packaging/                       Ch.13
  /chapter/chemicals-usage/                 Ch.14
  /chapter/electromagnetic-chapter/         Ch.15
  /chapter/occupational-disease-chapter/    Ch.16
  /chapter/industrial-health-view/          Ch.17 (신규 콘텐츠)

유지 (모두 200 OK):
  /, /start, /process-overview, /process/[slug] ×9,
  /chemicals, /chemicals/[id] ×31, /what-is-semiconductor,
  /risks-of-new-tech, /cleanroom, /electromagnetic,
  /occupational-disease, /about
```

---

## 4. 배포

### 4.1 GitHub Pages

| 항목 | 값 |
|------|---|
| Repo | https://github.com/DrunkenZealnut/semiconductor-academy |
| URL | https://drunkenzealnut.github.io/semiconductor-academy/ |
| Commit | c01d956 |
| 빌드 시간 | ~13초 (이전 ~12초) |
| Pages 응답 | 200 OK |

### 4.2 라이브 검증

| URL | HTTP |
|-----|------|
| `/chapters/` | 200 ✅ |
| `/chapter/risks-of-new-tech/` | 200 ✅ |
| `/chapter/wafer/` | 200 ✅ |
| `/chapter/industrial-health-view/` (Ch.17 신규) | 200 ✅ |

---

## 5. 잘 된 점 (Wins)

1. **첫 검증에서 97%** — Plan/Design 단계 정밀화로 Iteration 없이 임계 통과. 이전 feature(81% → 95%, Act-1 필요)와 대비.
2. **단일 commit으로 42 파일 안전 배포** — 빌드 실패 없이 한 번에 GitHub Actions 통과.
3. **3-entry IA 균형** — 책 차례 + 공정 다이어그램 + 물질 사전 세 가지 entry가 같은 데이터를 가리키되 다른 관점으로 접근. 학습자가 자신에게 맞는 진입 방식 선택 가능.
4. **챕터 17 신규 콘텐츠** — 책 결론을 사이트의 결론으로 매핑. 사전주의 원칙 5가지 + 주체별(시민/노동자/연구자/기업/국가) 실천 방안. 사이트의 reflection 메시지가 명확해짐.
5. **카테고리 4-tier 시각화** — 색상 + emoji + 라벨로 17챕터의 성격을 한눈에 인식 가능. 목차 페이지가 단순 링크 리스트가 아닌 학습 흐름 가이드.
6. **공정 5~13장 정보 중복 회피** — 도입 + ProcessDiagram + 외부 링크 패턴으로 챕터 페이지와 공정 페이지가 서로 보완. 본문 중복 0.
7. **기존 라우트 모두 유지** — 기존 사용자 북마크·외부 링크 모두 동작. URL 단절 없음.

---

## 6. 아쉬운 점 (Gaps)

1. **Legacy 5개 페이지 canonical 미설정** — Design §12 Q-D1에서 deferred한 항목이지만, SEO 관점에서는 두 URL(`/cleanroom/` ⟷ `/chapter/cleanroom-chapter/`)이 같은 콘텐츠로 색인될 수 있음. ~30분 작업으로 closure 가능.
2. **챕터 본문 분량 30~50%** — 책 4,673줄을 모두 옮기지 않고 핵심만 추출. 풀 본문 챕터(1, 2, 3, 4, 14, 15, 16, 17)도 800줄 평균에 비해 50줄 수준. 확장 가능.
3. **공정 5~13장 도입이 균일하지 않음** — 일부는 ChemicalCard 1~2개 포함, 일부는 0개. 균질화 필요.
4. **진도 트래킹 미구현** — Design §12 Q2에서 의도적으로 deferred. localStorage 기반 가벼운 표시도 학습 사이트에서는 가치 있음.
5. **모바일 챕터 카드** — 현재 grid-cols-2~4 반응형이지만, 모바일에서 1-col로 더 큰 카드가 가독성 향상 가능.

---

## 7. 학습 사항 (Lessons Learned)

1. **Plan의 미해결 결정(Open Questions)을 Design에서 명시 default로 확정**하면 Do 단계 모호함이 0이 되어 Match Rate가 한 번에 90%↑ 가능. 이번 feature는 Q1~Q5를 미리 도출한 효과로 97%.
2. **Design 문서에 파일 경로·라인 수준 명세** — gap-detector가 정확히 검증 가능. "src/components/chapter/ChapterCard.tsx" 같은 구체성이 매우 효과적.
3. **17개 같은 패턴 콘텐츠를 한 응답에 배치** — Phase B(4) + C(9) + D(3) + E(1) 모두 한 응답에서 가능. 컨텍스트 한계 내에서 충분.
4. **공정 챕터 5~13의 도입+위임 패턴** — 정보 중복 회피와 챕터 IA 유지의 균형. 풀 본문 강요는 YAGNI.
5. **카테고리 색상은 Tailwind 토큰 키로** — `CHAPTER_CATEGORY_COLOR[cat].border/bg/text/...` 객체 패턴이 카드·배지·헤더에서 일관되게 재사용됨.
6. **자동 훅이 디렉토리명을 feature로 잘못 추출** — 두 번째 feature에서도 같은 현상. `pdca-status.json` 수동 정리 필요. bkit 자체 이슈로 보고할 만함.

---

## 8. Future Work (차기 사이클 후보)

| 우선순위 | 항목 | 비고 |
|---------|------|------|
| **P1** | Legacy 5개 페이지 canonical → 챕터 URL | ~30분, SEO hint |
| **P1** | 챕터 본문 분량 확장 (현재 30~50% → 70~100%) | 책 원문 더 옮김 |
| **P2** | 챕터 진도 트래킹 (localStorage) | 학습자 경험 향상 |
| **P2** | 챕터 17 일러스트 | 책 결론 시각화 |
| **P2** | 챕터 내부 검색 (글로벌 검색) | Fuse.js 적용 |
| **P3** | 챕터 5~13 도입 균일화 | ChemicalCard 개수·구조 통일 |
| **P3** | 챕터 PDF export | 옵션 |
| **P3** | 다국어 (i18n) — 영어 우선 | 반도체 안전보건 글로벌 이슈 |

---

## 9. 인용 / Attribution

본 사이트는 다음 학술 자료를 교육 목적으로 재구성:

**「반도체 산업의 유해인자 (Hazards in Semiconductor Industry)」**
- 저자: 윤충식·김승원·박동욱·정지연·최상준·하권철·함승헌
- 출판: 에피스테메

본 사이클은 책 전체(약 333쪽, OCR markdown 4,673줄)를 17챕터로 매핑.
원본 도서의 저작권은 저자 및 출판사에 있으며, 정당한 인용 범위 내에서 재구성됨.

---

## 10. 다음 단계

```bash
# 본 사이클 아카이브 (통계 보존)
/pdca archive chapter-based-restructure --summary

# 또는 차기 사이클 (Future Work P1 항목)
/pdca plan canonical-meta-cleanup
/pdca plan chapter-content-expansion
```

---

**제출**: 2026-05-27
**책임자**: DrunkenZealnut (kcsvictory@gmail.com)
**최종 상태**: ✅ Completed (Match Rate 97% / Public Deploy / 58 SSG pages / 17 chapter routes live)
