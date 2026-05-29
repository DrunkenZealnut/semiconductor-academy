# Plan: ch3-to-ch17-batch

> 챕터 3~17 (15 챕터) — Ch.1/Ch.2 패턴 확산 batch 사이클 (3 sub-batch 분할)

**작성일**: 2026-05-29
**Feature**: `ch3-to-ch17-batch`
**PDCA Phase**: Plan
**Level**: Dynamic
**Status**: Draft

---

## Executive Summary

### 1.1 프로젝트 개요

| 항목 | 내용 |
|------|------|
| Feature | Ch.3~Ch.17 (15 챕터) 책 페이지 이미지 + 표 보강 — batch |
| 참조 패턴 | Ch.1 (`reading-experience-ch1`) + Ch.2 (`ch2-deep-content`) |
| 분할 전략 | **3 sub-batch** (foundation 2 / process 9 / hazard+reflection 4) |
| 예상 완료 | **~9시간** (sub-batch 별 진행, 동일 세션 분할 가능) |

### 1.2 결과 요약 (목표 지표)

| 지표 | 목표 |
|------|------|
| 챕터 수 | **15** (Ch.3~17) |
| 신규 자산 | 책 페이지 이미지 30~40장 + 15개 `_credits.json` |
| 자체 제작 표 | **15~25개** (챕터당 1~2개) |
| SourceQuote | **15~30개** (챕터당 1~2개, 각 ≤150자) |
| 신규 컴포넌트 | **0** (Ch.1 인프라 100% 재사용) |
| Iteration | 0~1회 sub-batch 당 |
| Match Rate | sub-batch 별 ≥ 90% |

### 1.3 Value Delivered (4-Perspective)

| 관점 | 내용 |
|------|------|
| **Problem (문제)** | Ch.1, Ch.2는 책 이미지 + 표 + SourceQuote로 풍부해졌지만 **Ch.3~17은 여전히 텍스트 위주**. 사이트 전체에 균질하지 않은 학습 경험 — 도입부(1~2장)만 깊고 나머지는 빈약. 책 전체를 "디지털 도서"로 만들겠다는 목표가 일부에만 적용됨. |
| **Solution (해결)** | Ch.1/Ch.2 패턴을 **15 챕터 모두에 확산**. 3 sub-batch로 분할: ① **foundation(ch3, ch4)** — 풀 본문 깊이 확장 ② **process(ch5~ch13)** — 가벼운 보강(이미지 1~2장 + 자체 표 1개씩, 본문은 도입+위임 형태 유지) ③ **hazard+reflection(ch14~ch17)** — 이미 풀 본문, ImageFigure + 표 + SourceQuote 보강. Ch.1 인프라(ImageFigure/Lightbox/FontSizeToggle/SourceQuote/Callout) 그대로 재사용. |
| **Function UX Effect (기능 효과)** | (1) 사이트 17챕터 **시각 밀도 균질화** (2) Process 9 챕터는 가볍게 보강해 정보 중복 회피 (3) Hazard 4 챕터는 책의 핵심 표(표 14-4, 14-5, 15-4, 16-4 등) 추가 (4) 모든 챕터 끝에 `<ChapterRef order={N+1} />` 유지 — 책 흐름 보존 (5) 책 페이지 이미지 30~40장 추가로 **사이트 전체 시각 풍성함 5배 증가** |
| **Core Value (핵심 가치)** | **"디지털 도서" 비전 완성** — Ch.1/Ch.2가 보여준 학술 도서의 디지털 독서 경험이 책 전체에 적용. 사이트가 단순 reference에서 **"책 그 자체"** 로 완성됨. 17챕터 모두 표·그림·인용·비유의 일관된 경험. Future Work P1 "Ch.3~17 동일 패턴 확산"의 본격 실행. |

---

## 2. 15 챕터 분류 및 작업 정의

### 2.1 카테고리별 분류

| 카테고리 | 챕터 | 수 | 현재 분량 | 작업 강도 |
|---------|------|---|---------|---------|
| **Foundation** | ch3 (제조 공정 개요), ch4 (클린룸) | 2 | 61, 68줄 | **풀 깊이 확장** (Ch.1 수준) |
| **Process** | ch5~ch13 (웨이퍼/클리닝/확산/포토/식각/증착/이온주입/CMP/패키징) | 9 | 21~30줄 | **가벼운 보강** (이미지 + 표 1개) |
| **Hazard** | ch14 (화학물질 사용), ch15 (전자파), ch16 (직업병) | 3 | 83, 61, 85줄 | **중간 보강** (이미지 + 표 + SourceQuote) |
| **Reflection** | ch17 (산업보건학적 시각) | 1 | 104줄 | **가벼운 보강** (이미지 + 표 1개) |

### 2.2 챕터별 목표 (압축)

| Ch | 제목 | 현재 | 목표 라인 | ImageFigure | 자체 표 | SourceQuote |
|---|-------|:---:|:---:|:---:|:---:|:---:|
| 3 | 제조 공정 개요 | 61 | 200~240 | 4~5 | 1 (전공정 vs 후공정) | 2 |
| 4 | 클린룸 | 68 | 220~260 | 4~5 | 1 (Class 등급) | 2 |
| 5 | 웨이퍼 | 25 | 50~70 | 1~2 | 1 (11단계) | 1 |
| 6 | 클리닝 | 22 | 50~70 | 1~2 | 1 (RCA 조성) | 1 |
| 7 | 확산 | 21 | 50~70 | 1~2 | 1 (도펀트 표) | 1 |
| 8 | 포토리소그래피 | 28 | 60~80 | 2 | 1 (8단계) | 1 |
| 9 | 식각 | 25 | 50~70 | 1~2 | 1 (습/건 비교) | 1 |
| 10 | 증착 | 26 | 50~70 | 1~2 | 1 (CVD/PVD/ALD) | 1 |
| 11 | 이온 주입 | 26 | 50~70 | 1~2 | 1 (도펀트 가스) | 1 |
| 12 | CMP | 25 | 50~70 | 1~2 | 1 (슬러리) | 1 |
| 13 | 패키징 | 30 | 70~90 | 2 | 1 (8단계 표) | 1 |
| 14 | 화학물질 사용 | 83 | 200~240 | 3~4 | 1 (책 표 14-4 보강) | 2 |
| 15 | 전자파 | 61 | 180~220 | 3~4 | 1 (책 표 15-4) | 2 |
| 16 | 직업병 | 85 | 220~260 | 3~4 | 1 (책 표 16-4) | 2 |
| 17 | 산업보건학적 시각 | 104 | 130~160 | 2 | 1 (요약) | 1 |

**총계**: ImageFigure ~40장, 자체 표 ~15개, SourceQuote ~20개

---

## 3. 목표 & 비목표

### 3.1 목표

#### 공통

- [G1] 15 챕터 모두 Ch.1 인프라(ImageFigure/Callout/SourceQuote) 적용
- [G2] 각 챕터 끝에 `<ChapterRef order={N+1} />` 유지 (책 흐름)
- [G3] 각 챕터 폴더에 `_credits.json` 메타 작성
- [G4] About 페이지 정책 그대로 적용 (Ch.1에서 추가됨)

#### Sub-batch A (foundation, ch3+ch4)

- [G-A1] Ch.3 본문 60→200줄 확장, ImageFigure 4~5장, 자체 표 1개, SourceQuote 2개
- [G-A2] Ch.4 본문 68→220줄 확장, 동일 패턴

#### Sub-batch B (process, ch5~ch13)

- [G-B1] 9 챕터 각 본문 25→55줄 (도입+위임 형태 유지)
- [G-B2] 각 챕터 ImageFigure 1~2장, 자체 표 1개, SourceQuote 1개
- [G-B3] `/process/[slug]/` 외부 링크 유지

#### Sub-batch C (hazard+reflection, ch14~ch17)

- [G-C1] Ch.14, 15, 16 풀 본문 보강 (200~260줄)
- [G-C2] Ch.17 가벼운 보강 (130~160줄)
- [G-C3] 책의 핵심 표(14-4, 14-5, 15-4, 16-4) 학술 fair use 인용

### 3.2 비목표

- 새 컴포넌트 추가 (Ch.1 인프라 100% 재사용)
- 외부 Wikimedia 이미지 (모든 챕터 deferred — 별도 사이클)
- 챕터 라우팅 변경
- 폰트 시스템 변경
- 책의 표 그대로 옮기기 (학술 표 1~2개씩 fair use, 나머지는 자체 재구성)

---

## 4. 콘텐츠 재구성 전략 (Ch.1/Ch.2 패턴)

### 4.1 모든 챕터 공통 구조

```
[LayeredExplain Hero — 비유 유지]
[ImageFigure 표지 이미지]

## 절 N (책 흐름 유지)
  본문 (자체 서술) + Term 툴팁 + Callout
  [ImageFigure 그림 N]
  [표] (자체 제작 또는 책 fair use)
  [SourceQuote] (≤150자, 핵심 단락)

## ...

[ChapterRef order={N+1}]
```

### 4.2 Process 챕터(5~13) 특수 정책

```
[LayeredExplain hook]
[ImageFigure 공정 표지 이미지 — 1장]
[ProcessDiagram activeId variant=compact]

## 한 줄 요약 (책 인용)
## 핵심 위험 / 자체 표
[ImageFigure 공정 도식 — 1장]
[ChemicalCard 임베드 — 기존]

## 자세한 공정 →
[/process/[slug]/ 링크 — 기존 위임 패턴 유지]

[ChapterRef order={N+1}]
```

> **공정 챕터는 본문 확장 자제** — 깊은 내용은 `/process/*` 페이지가 담당. 챕터 페이지는 책의 흐름 entry point 역할.

### 4.3 저작권 정책 (Ch.1/Ch.2 동일)

- **SourceQuote**: 챕터당 최대 2~3개, 각 ≤ 150자, 페이지·섹션 출처 명시
- **책의 표**: 학술 fair use, 챕터당 최대 1~2개, 출처 명시
- **자체 제작 표**: 저작권 무관, 자유롭게 추가
- **책 페이지 이미지**: maxWidth 600px, 출처 명시, `_credits.json` 메타
- **본문**: 책 흐름·구조 따르되 **자체 서술**, 직접 베끼기 금지

---

## 5. 기술 변경 (최소)

| 항목 | 변경 |
|------|------|
| 신규 컴포넌트 | **0** |
| 신규 라이브러리 | **0** |
| 신규 자산 | `public/source-images/ch{3..17}/` 폴더 × 15 + 30~40 jpeg + 15 `_credits.json` |
| MDX 변경 | `src/content/chapters/0[3-9]*.mdx` + `1[0-7]*.mdx` (총 15 파일) |
| 라우팅 | 변경 없음 |
| 빌드 | 정적 페이지 58개 유지 |

---

## 6. Phase 분리 (~9시간 total)

### Sub-batch A — Foundation (ch3 + ch4)

| Phase | 작업 | 시간 |
|-------|------|------|
| A1 | Ch.3, Ch.4 이미지 8~10장 복사 + 2 credits.json | 30m |
| A2 | Ch.3 MDX 깊이 확장 (200줄) | 50m |
| A3 | Ch.4 MDX 깊이 확장 (220줄) | 50m |
| A4 | 빌드/배포/검증 | 10m |
| **소계** | | **~2.5h** |

### Sub-batch B — Process (ch5~ch13, 9 챕터)

| Phase | 작업 | 시간 |
|-------|------|------|
| B1 | 9 챕터 이미지 9~18장 복사 + 9 credits.json | 40m |
| B2 | 9 챕터 MDX 가벼운 보강 (각 ~10분) | 1.5h |
| B3 | 빌드/배포/검증 | 10m |
| **소계** | | **~2.5h** |

### Sub-batch C — Hazard + Reflection (ch14~ch17, 4 챕터)

| Phase | 작업 | 시간 |
|-------|------|------|
| C1 | 4 챕터 이미지 12~16장 복사 + 4 credits.json | 30m |
| C2 | Ch.14, 15, 16 풀 보강 (각 50분) | 2.5h |
| C3 | Ch.17 가벼운 보강 | 20m |
| C4 | 빌드/배포/검증 | 10m |
| **소계** | | **~4h** |

**총 ~9h** — 한 세션에 모두 처리하기엔 큼. **3 PDCA 사이클로 분할 진행** 권장:

- 본 plan = **batch 전략 정의 문서**
- 실제 실행은 sub-batch별 별도 sub-feature 또는 본 plan의 Do phase 3 단계 분할
- 각 sub-batch 완료 시 commit + push로 안전 분리

---

## 7. 리스크 & 완화

| ID | 리스크 | 영향 | 완화 |
|----|-------|------|------|
| R1 | 책 본문 인용 과다 | High | 챕터당 SourceQuote ≤2~3개, 각 ≤150자, Ch.1/Ch.2 패턴 일관 적용 |
| R2 | 책 이미지 저작권 | High | maxWidth 600px + 출처 명시 + 각 `_credits.json` |
| R3 | 9 process 챕터의 본문 확장 유혹 | Med | 도입+위임 형태 명시적 유지. `/process/*` 가 진짜 데이터 |
| R4 | 한 세션 컨텍스트 한계 | High | **3 sub-batch 분할 실행** — 각 sub-batch ~3h 단위 |
| R5 | 책 이미지 그림 번호 추정 오류 | Med | Ch.1/Ch.2와 동일 — 캡션은 "일반적 묘사" 형태 |
| R6 | Process 챕터의 본문 중복 (공정 페이지와) | Med | 공정 챕터는 책 흐름 entry만, 깊은 내용은 외부 링크 |

---

## 8. 성공 기준 (DoD)

### Sub-batch A 완료 시

- [ ] Ch.3, Ch.4 본문 200~260줄
- [ ] 각 4~5 ImageFigure, 1 자체 표, 2 SourceQuote
- [ ] Match Rate ≥ 90%

### Sub-batch B 완료 시

- [ ] 9 process 챕터 본문 50~80줄
- [ ] 각 1~2 ImageFigure, 1 자체 표
- [ ] `/process/*` 외부 링크 유지
- [ ] Match Rate ≥ 90%

### Sub-batch C 완료 시

- [ ] Ch.14~17 본문 보강 완료
- [ ] 책의 핵심 표 fair use 인용
- [ ] Match Rate ≥ 90%

### 전체 완료 시

- [ ] 15 챕터 모두 ImageFigure + 자체 표 보강
- [ ] 사이트 전체 시각 밀도 균질화
- [ ] 빌드 + Pages 배포 + 모든 챕터 라우트 200 OK

---

## 9. 미해결 결정 (Design에서 확정)

| ID | 질문 | 결정 시점 |
|----|------|----------|
| Q1 | 3 sub-batch를 본 사이클의 3 Do phase로 처리 vs 3 별도 feature로 분리 | Design |
| Q2 | 각 process 챕터(5~13) 자체 표 통일성 (현재 다 다름) | Design |
| Q3 | 책의 표(14-4, 15-4, 16-4) 그대로 옮길지 vs 발췌 | Design |
| Q4 | Hazard 챕터(14~16) SourceQuote 분량 (Ch.1 기준 ≤150자 vs 학술 특성상 ≤200자) | Design |

---

## 10. 다음 단계

```bash
/pdca design ch3-to-ch17-batch
```

→ Design에서 Q1~Q4 결정 + 챕터별 상세 이미지 매핑.

또는 sub-batch별 즉시 실행:

```bash
# Sub-batch A만 먼저
/pdca plan ch3-ch4-foundation
```

---

**참고**
- Ch.1 패턴: `reading-experience-ch1` (94%, 248줄, 5 ImageFigure)
- Ch.2 패턴: `ch2-deep-content` (96%, 266줄, 8 ImageFigure)
- 원본 자료: `data/` 4개 markdown + 페이지 이미지 200여 장
