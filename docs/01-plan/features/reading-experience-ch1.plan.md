# Plan: reading-experience-ch1

> 글꼴 크기 조정 + 챕터 1장 본격 재구성(원문 깊이 + 이미지) — 챕터별 확장 패턴의 첫 데모

**작성일**: 2026-05-29
**Feature**: `reading-experience-ch1`
**PDCA Phase**: Plan
**Level**: Dynamic
**Status**: Draft

---

## Executive Summary

### 1.1 프로젝트 개요

| 항목 | 내용 |
|------|------|
| Feature | 폰트 크기 조정 + Ch.1 본문 깊이 확장 + 페이지 이미지 + 외부 이미지 + 원문 보기 |
| 시작일 | 2026-05-29 |
| 예상 완료 | 2026-05-29 (당일, ~3시간) |
| 적용 범위 | Part A: 사이트 전체 (폰트 조정) / Part B: 챕터 1만 (패턴 확립 후 다른 챕터 확산) |

### 1.2 결과 요약 (목표 지표)

| 지표 | 목표 |
|------|------|
| 폰트 크기 단계 | **3단계** (작게/보통/크게), localStorage 저장 |
| 폰트 조정 위치 | 챕터 페이지 + 사이트 전체 prose 텍스트 |
| Ch.1 분량 | 현재 ~50줄 → **~300줄** 이상 (책의 1장 핵심 내용 95% 커버) |
| 추가 이미지 | 책 페이지 6장 (1장 관련) + 외부 CC 이미지 2~3장 |
| 원문 보기 | 본문 인라인 + `<SourceQuote>` 토글 확대 |
| 표 보존 | 표 1-1, 표 1-2, 표 1-3 모두 마크다운으로 재현 |

### 1.3 Value Delivered (4-Perspective)

| 관점 | 내용 |
|------|------|
| **Problem (문제)** | 현재 챕터 본문은 책 내용의 30~40%만 요약. "비유와 일러스트" 중심이라 학술적 깊이가 부족하고 책의 원문 흐름을 따라가기 어려움. 또 글꼴이 작아 학술 콘텐츠 읽기에 피로함. |
| **Solution (해결)** | **Part A**: 헤더에 폰트 크기 조정 버튼(작게/보통/크게) + localStorage 저장 — 사용자가 자기 화면·시력에 맞춰 조정. **Part B**: Ch.1을 책 원문 흐름 그대로 재구성 — 절(1, 2)·세부절(가, 나) 구조 유지, 책의 표 3개·그림 6장 모두 포함, 핵심 문단은 `<SourceQuote>` 학술 인용, 비유는 별도 박스로 분리. 외부 CC 이미지(DDT 모기, 석면 등)로 시각적 풍성함 보강. |
| **Function UX Effect (기능 효과)** | (1) **폰트 크기 3단계**(15px / 18px / 21px) prose 본문에 즉각 반영 (2) **사용자 선호 저장** — localStorage로 다음 방문 시 유지 (3) Ch.1이 책처럼 읽힘 — 절·표·그림 흐름 (4) **이미지 갤러리** 컴포넌트 — Figma처럼 클릭 시 확대 (5) **원문 보기 토글** 더 큰 인용 박스 — 짧은 1~2문장이 아닌 풍부한 단락 인용 |
| **Core Value (핵심 가치)** | **학술 도서의 디지털 독서 경험** — 단순 요약 사이트가 아니라 책 그 자체를 디지털로 읽는 경험. 시각·인지 부담은 사용자가 조정하고, 깊이는 사이트가 보장. Ch.1 패턴이 검증되면 16개 다른 챕터로 확산할 수 있는 템플릿이 됨. |

---

## 2. 배경

### 2.1 현재 한계

- 챕터 본문이 **책 원문의 30~40%만** 반영 (요약 위주)
- "비유" 중심 재구성이라 학술 깊이가 부족 — Ch.17(신규) 같은 깊은 본문이 예외
- 폰트가 작아 학술 콘텐츠 장시간 읽기 어려움
- 책의 표(표 1-1, 1-2, 1-3)와 그림이 사이트에 거의 미반영

### 2.2 사용자가 가진 자료

- `data/` 폴더에 책 OCR markdown 4,673줄 + 페이지 이미지 200여 장
- **Ch.1 관련**: markdown 248~395줄 + 페이지 이미지 6장 핵심 (도입, 그림 1-1, 1-2, 1-3, 1-4)

### 2.3 저작권 정책

- 본 사이트는 학술 인용 fair use 범위 내 재구성 (About 페이지 명시)
- **이미지 정책**:
  - 책 페이지 이미지(그림 1-1, 1-2, 1-3, 1-4): 학습 자료 fair use, 출처 표기 필수, 작은 크기(max-width 600px)로 표시
  - 외부 이미지: **Wikimedia Commons / Public Domain만** 사용 (CC-BY-SA 등)
- **본문 정책**:
  - 짧은 단락 인용은 `<SourceQuote>`로 명확히 인용 표기
  - 표 데이터는 학술 표 fair use (출처 표기)
  - 핵심 문장만 직접 인용, 나머지는 요약·재구성·비유

---

## 3. 목표 & 비목표

### 3.1 목표

#### Part A — 폰트 크기 조정

- [G-A1] 헤더에 폰트 크기 조정 버튼 추가 (드롭다운 또는 `Aa` 아이콘 + 3개 옵션)
- [G-A2] 3단계 옵션: **Small (15px) / Medium (18px, 현재 기본) / Large (21px)**
- [G-A3] `localStorage`에 사용자 선택 저장
- [G-A4] 모든 챕터 페이지 + 정적 페이지의 prose 영역에 적용
- [G-A5] 다크모드 토글과 일관된 위치·디자인

#### Part B — Ch.1 본격 재구성

- [G-B1] Ch.1 분량 ~50줄 → **300줄 이상**으로 확장
- [G-B2] 책의 1장 절 구조 유지: `1. 반도체 산업의 안전보건이 문제가 되는 이유`, `2. 반도체 산업의 유해요인과 직업병에 대한 지식`
- [G-B3] 세부절 `가.`, `나.` 모두 반영
- [G-B4] **표 3개** 모두 마크다운으로 재현:
  - 표 1-1: 역사적으로 새로 도입된 물질과 부작용 (DDT, 농약, 냉매, 석면)
  - 표 1-2: 산업보건 측면에서 반도체와 다른 산업 비교
  - 표 1-3: 미국 노동통계국 산재 비율 통계 (1992~2001)
- [G-B5] **책 그림 6장 이미지** 추가:
  - `_page_8_Figure_3.jpeg` (1장 표지 그림)
  - `_page_10_Picture_0.jpeg` (그림 1-1: 새 물질의 이익과 위험)
  - `_page_13_Picture_1.jpeg` (그림 1-2: 낡은 방패와 광선검 — 비유)
  - `_page_14_Figure_4.jpeg` (그림 1-3: 앎의 세계)
  - `_page_15_Figure_3.jpeg` (그림 1-4: 반도체 연구 역학조사의 역사)
- [G-B6] **외부 CC 이미지 2~3장**: 석면 광물, DDT 분무 작업 등 (Wikimedia Commons)
- [G-B7] 새 `<ImageFigure>` MDX 컴포넌트 — 출처·캡션·확대 가능
- [G-B8] 핵심 단락 5개 이상을 `<SourceQuote>`로 학술 인용

#### 공통

- [G-C1] 새 컴포넌트 `<FontSizeToggle />` (헤더 통합)
- [G-C2] 새 컴포넌트 `<ImageFigure />` (MDX 등록)
- [G-C3] Ch.1 패턴을 다른 챕터로 확산할 수 있는 템플릿으로 문서화

### 3.2 비목표 (이번 사이클 제외)

- Ch.2~17은 그대로 유지 (Ch.1만 변경)
- 폰트 종류 선택 (Pretendard 고정)
- 행간/자간 조정 (폰트 크기만)
- 챕터별 진도 트래킹 (별도 사이클)
- 책 페이지 이미지 200여 장 전체 사용 (Ch.1 관련 6장만)
- AI 생성 일러스트
- 챕터 ePub/PDF export

---

## 4. 사용자 시나리오

| ID | 페르소나 | 시나리오 |
|----|---------|----------|
| US-1 | 시력이 안 좋은 50대 노동자 | 헤더의 `Aa` 클릭 → "크게" 선택 → 본문 글자가 21px로 확대 → 편하게 읽음. 다음 방문 시 자동 유지. |
| US-2 | 책을 정독하고 싶은 산업보건 학생 | Ch.1 진입 → 책 1장 그대로 흐름 → 표 1-1로 DDT/석면 등 역사 비교 → 그림 1-2 "낡은 방패와 광선검" 클릭 확대 → 핵심 인용 5개 박스로 확인 |
| US-3 | 첫 진입 일반인 | Ch.1 진입 → 비유 박스로 가볍게 시작 → 표·그림 보며 학술 깊이도 자연스럽게 따라감 |
| US-4 | 모바일에서 읽는 학생 | 폰트를 크게로 설정 → 모바일에서도 21px로 시원하게 → 그림은 탭하면 확대 |

---

## 5. 콘텐츠 재구성 전략 (Ch.1)

### 5.1 Ch.1 구조 (책 원문 따름)

```
[Hero / LayeredExplain]
  Hook + Easy + Deep

[책 1장 표지 그림 — _page_8_Figure_3.jpeg]

## 1. 반도체 산업의 안전보건이 문제가 되는 이유

### 가. 역사적 경험에 따른 새 기술, 새 산업, 새 화학물질의 위험성
  - 본문 단락 (재구성 + 짧은 직접 인용 1~2개 SourceQuote)
  - 표 1-1 (DDT, 농약, 냉매, 석면)
  - 그림 1-1 ImageFigure (그림 1-1: 이익과 위험의 고려)
  - 외부 CC 이미지: 석면 광물 사진 (Wikimedia)
  - 외부 CC 이미지: DDT 분무 작업 (Wikimedia)
  - 핵심 메시지 Callout

### 나. 반도체 산업의 위험성을 보는 시각
  - 4가지 특성 (역사 짧음, 정보 제한, 빠른 변화, 영업비밀)
  - 표 1-2 (다른 산업과 비교)
  - 그림 1-2 ImageFigure (낡은 방패와 광선검)
  - SourceQuote (사전주의 원칙 강조 단락)

## 2. 반도체 산업의 유해요인과 직업병에 대한 지식

### 가. 반도체 산업의 산업보건 지식의 한계
  - 본문 + 비유
  - 그림 1-3 ImageFigure (앎의 세계)
  - SourceQuote (앎의 한계 핵심 단락)

### 나. 반도체 산업의 산업보건 위험성에 대한 인식
  - 1980년대 이후 미국 인식 변화
  - 표 1-3 (미국 노동통계국 산재 비율)
  - 그림 1-4 ImageFigure (반도체 연구 역학조사의 역사)
  - 연구 범주 5가지 (암, 피부/안과, 생식, 근골격, 스트레스)
  - 입증된 질병 + 증가 경향 질병
  - ITRS 2007 ESH 4가지 명제

## 다음 챕터로
<ChapterRef order={2} />
```

### 5.2 글꼴 크기 조정 — 변환 매핑

| 사이즈 | prose font-size | localStorage 키 | 키보드 단축키 (옵션) |
|--------|-----------------|----------------|-------------------|
| Small  | 15px | `font-size=sm` | - |
| **Medium** (기본) | 18px | `font-size=md` | - |
| Large  | 21px | `font-size=lg` | - |

CSS:
```css
.prose-small { font-size: 15px; }
.prose-medium { font-size: 18px; }
.prose-large { font-size: 21px; }
```

`<html>`에 클래스 추가, 모든 `.prose` 영역이 상속.

---

## 6. 기술 설계 (Plan 수준)

### 6.1 새 컴포넌트

| 컴포넌트 | 위치 | 책임 |
|---------|------|------|
| `<FontSizeToggle />` | `src/components/layout/FontSizeToggle.tsx` | 헤더에 Aa 아이콘 + 드롭다운, localStorage |
| `<ImageFigure />` | `src/components/content/ImageFigure.tsx` | `src/source/path.png` + caption + 확대 lightbox |
| `<SourceQuote />` (확장) | 기존 — 더 큰 인용 박스 variant 추가 | longer quotes |

### 6.2 이미지 자산 처리

- `public/source-images/ch1/` 폴더 생성
- 책 페이지 이미지 6장 복사 (jpeg → public)
- 외부 이미지 2~3장 다운로드 → 동일 폴더 (라이선스 메타 별도 파일에)
- `public/source-images/ch1/_credits.json` — 이미지별 출처/라이선스 메타

### 6.3 라우팅 변경

- 없음 — Ch.1 페이지는 기존 `/chapter/risks-of-new-tech/`

### 6.4 글꼴 적용 방법

`src/app/layout.tsx`에서 inline script로 초기 클래스 적용 (FOUC 방지):
```html
<script>
  var s = localStorage.getItem('font-size') ?? 'md';
  document.documentElement.classList.add('font-' + s);
</script>
```

CSS: `globals.css`에 `.font-sm .prose { font-size: 15px; } .font-md .prose { font-size: 18px; } .font-lg .prose { font-size: 21px; }`

---

## 7. Phase 분리 (~3h)

| Phase | 작업 | 시간 |
|-------|------|------|
| **A** | 폰트 조정 (CSS + FontSizeToggle + layout 통합) | 45m |
| **B** | ImageFigure 컴포넌트 + lightbox + mdx 등록 | 30m |
| **C** | Ch.1 이미지 자산 처리 (책 6장 + 외부 다운로드 + credits.json) | 30m |
| **D** | Ch.1 본문 재구성 (300줄, 표 3개, 그림 6장, SourceQuote 5개) | 60m |
| **E** | 빌드 + 배포 + 검증 | 15m |

---

## 8. 리스크 & 완화

| ID | 리스크 | 영향 | 완화 |
|----|-------|------|------|
| R1 | 책 본문 직접 인용 분량이 fair use 한계 초과 | High | 단락 단위 인용 최대 5개, 각 100~150자 이내, 출처 명확 표기 |
| R2 | 책 페이지 이미지 게시 저작권 | High | 작은 크기(<600px), 학술 인용 표기, About 페이지에 정책 명시. 사용자 자체 OCR 자료라 자기 데이터 인용 |
| R3 | Wikimedia 이미지 라이선스 위반 | Med | CC-BY-SA만 사용, attribution 메타 같이 표시 |
| R4 | 폰트 크기 변경 시 layout shift | Med | rem 단위 사용, prose 영역만 변경, 헤더·푸터는 고정 |
| R5 | FOUC (초기 폰트 깜빡임) | Low | inline script 사용 |
| R6 | localStorage 비활성 환경 | Low | default 'md' fallback |

---

## 9. 성공 기준 (DoD)

- [ ] 헤더에서 폰트 크기 3단계 전환 동작 + localStorage 저장 + 새로고침 후 유지
- [ ] Ch.1 페이지 분량 300줄 이상, 책 원문 흐름 95% 커버
- [ ] 표 1-1, 1-2, 1-3 모두 렌더
- [ ] 책 그림 5장 + 외부 CC 이미지 2장 이상 표시
- [ ] 이미지 클릭 시 확대 (lightbox) 동작
- [ ] 각 이미지마다 출처·캡션 명시
- [ ] About 페이지에 이미지 라이선스 정책 추가
- [ ] 빌드 + GitHub Pages 배포 + 라이브 200 OK
- [ ] Match Rate ≥ 90%

---

## 10. 미해결 결정 (Design에서 확정)

| ID | 질문 | 결정 시점 |
|----|------|----------|
| Q1 | 폰트 토글 UI: 드롭다운 vs A−/A+ 버튼 한 쌍 | Design |
| Q2 | ImageFigure 확대 — lightbox 패키지 vs 자체 구현 | Design |
| Q3 | 책 페이지 이미지 jpeg → webp 변환 여부 | Design |
| Q4 | 외부 이미지: Wikimedia 어느 것 (석면/DDT/오존층/공장) | Design |
| Q5 | 폰트 'Small'을 15px vs 16px (모바일 가독성 고려) | Design |

---

## 11. 다음 단계

```bash
/pdca design reading-experience-ch1
```

→ Design 단계에서 컴포넌트 시그니처·CSS·이미지 자산 매핑·SourceQuote 변형 확정.

---

**참고**
- 원본: 「반도체 산업의 유해인자」 1장 (사용자 OCR markdown, `data/20260526_185841_..._-_13/`)
- 외부 이미지 후보: Wikimedia Commons (CC-BY-SA)
- 폰트: Pretendard (변경 없음)
