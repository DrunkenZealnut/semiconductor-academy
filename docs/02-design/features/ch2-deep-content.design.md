# Design: ch2-deep-content

> Ch.2 「반도체의 이해」 — 이미지 매핑 + MDX 본문 구조 상세

**작성일**: 2026-05-29
**Feature**: `ch2-deep-content`
**PDCA Phase**: Design
**Linked Plan**: [docs/01-plan/features/ch2-deep-content.plan.md](../../01-plan/features/ch2-deep-content.plan.md)
**Status**: Draft

---

## 0. Open Questions 결정 (Plan Q1~Q3)

| ID | 질문 | **결정** | 근거 |
|----|------|---------|------|
| Q1 | P2 이미지 2장 포함 vs P1 5장만 | **P1 + P2 = 7장 모두 포함** | 작업 부담 적음(파일 복사뿐), 다이오드·집적회로 IC가 §5 발전사 narrative에 직접 기여 |
| Q2 | 책에 없는 도체/부도체/반도체 비교 표 추가 | **추가** | 학습 가치 높음, 자체 제작 표라 저작권 무관, 도체/부도체/반도체 차이를 한눈에 |
| Q3 | "반도체의 역사" — list vs 표 | **표** | 연도·발견자·의의 3컬럼 표가 시각적으로 정돈됨, 사이트의 다른 챕터(연도 표 사용 패턴)와 일관 |

---

## 1. 아키텍처 (변경 없음)

Ch.1에서 확립된 모든 컴포넌트·CSS·인프라 재사용:

- `<ImageFigure />` + `<Lightbox />` — 이미지 + 출처 + 확대
- `<FontSizeToggle />` — 전 사이트에 적용됨
- `<SourceQuote />`, `<Callout />`, `<LayeredExplain />`, `<Term />`, `<ChapterRef />` — MDX 컴포넌트
- `.font-sm/md/lg .prose` — CSS

**신규 컴포넌트 0**. **신규 라이브러리 0**. 콘텐츠와 자산만 추가.

---

## 2. 폴더/파일 추가·변경

### 2.1 신규 자산

```
public/source-images/ch2/                ★ NEW 폴더
  ├── ch2-cover.jpg          (← _page_19_Figure_3.jpeg)
  ├── fig-2-1-current.jpg    (← _page_20_Picture_3.jpeg)
  ├── fig-2-2-bands.jpg      (← _page_22_Figure_0.jpeg)
  ├── fig-2-3-intrinsic.jpg  (← _page_27_Figure_0.jpeg)
  ├── fig-2-4-mosfet.jpg     (← _page_28_Figure_0.jpeg)
  ├── fig-2-5-diode.jpg      (← _page_30_Figure_4.jpeg)
  ├── fig-2-6-transistor.jpg (← _page_31_Figure_0.jpeg)
  ├── fig-2-7-ic.jpg         (← _page_33_Figure_5.jpeg)
  └── _credits.json          (출처 메타)
```

### 2.2 변경

```
src/content/chapters/02-semiconductor.mdx  65줄 → ~240줄 전면 재작성
```

About 페이지 정책 섹션은 Ch.1에서 이미 추가되어 있어 변경 불필요.

---

## 3. 이미지 자산 매핑

### 3.1 책 페이지 이미지 → public

| public 경로 | 원본 (data/) | 책 위치 | 캡션 |
|------------|------------|--------|------|
| `/source-images/ch2/ch2-cover.jpg` | `_page_19_Figure_3.jpeg` | 2장 도입 일러스트 | 제2장 — 반도체의 이해 |
| `/source-images/ch2/fig-2-1-current.jpg` | `_page_20_Picture_3.jpeg` | 그림 2-1 | 전류와 전자의 흐름 개념도 |
| `/source-images/ch2/fig-2-2-bands.jpg` | `_page_22_Figure_0.jpeg` | p.23 도식 | 도체·부도체·반도체의 에너지 밴드 구조 |
| `/source-images/ch2/fig-2-3-intrinsic.jpg` | `_page_27_Figure_0.jpeg` | p.34 도식 | 진성/불순물 반도체의 구분 |
| `/source-images/ch2/fig-2-4-mosfet.jpg` | `_page_28_Figure_0.jpeg` | p.35 도식 | MOS 트랜지스터의 구조 |
| `/source-images/ch2/fig-2-5-diode.jpg` | `_page_30_Figure_4.jpeg` | p.39 도식 | 다이오드의 동작 원리 |
| `/source-images/ch2/fig-2-6-transistor.jpg` | `_page_31_Figure_0.jpeg` | p.40 도식 | NPN/PNP 트랜지스터 단면 |
| `/source-images/ch2/fig-2-7-ic.jpg` | `_page_33_Figure_5.jpeg` | p.41 사진 | 집적회로 IC 실물 |

### 3.2 `_credits.json` 구조 (Ch.1 형식 그대로)

```json
{
  "chapter": 2,
  "policy": "본 폴더의 이미지는 학술 인용 fair use 범위 내에서 사용됩니다. ...",
  "images": [
    {
      "file": "ch2-cover.jpg",
      "type": "book-page",
      "source": "「반도체 산업의 유해인자」 2장 도입 일러스트",
      "page": 20,
      "license": "Fair use (교육 목적 학술 인용)"
    },
    // ... 8개 항목
  ]
}
```

> **주의**: 이미지 캡션은 책에 있는 그림 번호를 추정해 작성. 실제 책의 그림 번호와 다를 수 있으니, "그림 2-N. 일반적 묘사" 형태로 작성해 안전하게.

---

## 4. Ch.2 MDX 구조 (~240줄)

### 4.1 전체 흐름

```mdx
[LayeredExplain Hero]
  Hook: "반도체는 전기가 '반'만 흐르는 신기한 물질이에요"
  Easy: 수도꼭지 비유 + 컴퓨터/스마트폰 연결
  Deep: sourcePage 28, section "2장 반도체의 이해"

[ImageFigure ch2-cover.jpg]

## 1. 반도체의 기초 — 도체, 부도체, 반도체
  본문: 전기 흐름 = 전자 흐름 = 전류 (Term 툴팁)
  [ImageFigure fig-2-1-current.jpg] 전류와 전자 흐름
  [표] 도체/부도체/반도체 비교 (자체 제작 — Q2)
    | 종류 | 예 | 자유전자 | 전기 |
  [Callout type=tip] 꼬마전구 실험 비유
  [ImageFigure fig-2-2-bands.jpg] 에너지 밴드 구조

## 2. 반도체의 분류
### 가. 유기 반도체와 무기 반도체
  본문: 실리콘·게르마늄(무기) vs 펜타센·폴리아세틸렌(유기)
  [Callout type=info] 유기 반도체의 가능성 (OLED 등)

### 나. 진성 반도체와 불순물 반도체
  본문: 도핑의 의의 + n형/p형
  [ImageFigure fig-2-3-intrinsic.jpg] 진성/불순물 구분
  [표] n형/p형 도펀트
    | 타입 | 도펀트 | 원소족 | 결과 |
  [SourceQuote page=33] 도핑의 의미 (~120자)

## 3. 모스트랜지스터 (MOSFET)
  본문: Metal-Oxide-Semiconductor FET — 반도체의 기본 스위치
  [ImageFigure fig-2-4-mosfet.jpg] MOS 구조
  [Callout type=tip] 수도꼭지 비유 확장 (gate = 손잡이)
  [SourceQuote page=35] 모스트랜지스터의 역할 (~140자)

## 4. 전자소자와 반도체
  본문: 전자소자 = 능동/수동, 반도체가 능동 소자의 핵심

## 5. 집적회로의 발전
### 가. 다이오드
  본문: pn 접합, 한 방향 전류
  [ImageFigure fig-2-5-diode.jpg]

### 나. 트랜지스터
  본문: 1947년 벨연구소, 진공관 대체
  [ImageFigure fig-2-6-transistor.jpg] NPN/PNP 단면
  [표 2-3] 트랜지스터 동작 상태 (책의 표 그대로)
    | 베이스-이미터 | 베이스-컬렉터 | 동작 |
  [Callout type=warning] 활성·차단·포화·역활성 4가지 동작

### 다. 집적회로 (IC)
  본문: 1958년 잭 킬비, 무어의 법칙
  [ImageFigure fig-2-7-ic.jpg]
  [Callout type=info] 무어의 법칙 + 황의 법칙
  [SourceQuote page=41] 집적회로의 의의 (~130자)

## 6. 반도체의 역사
  [표] 반도체 역사 연표 (Q3 결정 — 표)
    | 연도 | 사건 | 주요 인물 |
    | 1947 | 트랜지스터 발명 | 벨연구소 |
    | 1958 | 집적회로 | 잭 킬비 |
    | 1971 | 4004 마이크로프로세서 | 인텔 |
    | 1980s | VLSI | - |
    | 2020s | 3nm 공정 | TSMC, 삼성 |

[ChapterRef order={3}] 다음 챕터
```

### 4.2 자체 제작 표 (저작권 무관)

#### §1 도체/부도체/반도체 비교 표

| 종류 | 예 | 자유전자 | 전기 |
|------|---|--------|------|
| 도체 | 구리, 금, 알루미늄 | 매우 많음 | 잘 흐름 |
| 부도체 | 고무, 유리, 플라스틱 | 거의 없음 | 안 흐름 |
| 반도체 | 실리콘, 게르마늄 | 조건에 따라 | 제어 가능 |

#### §2 도펀트 비교 표

| 타입 | 도펀트 | 원소족 | 결과 |
|------|-------|------|------|
| n형 | 인(P), 비소(As), 안티몬(Sb) | 5족 | 전자 풍부 |
| p형 | 붕소(B) | 3족 | 양공(hole) 풍부 |

#### §6 반도체 역사 연표 (Q3)

| 연도 | 사건 | 인물·기관 |
|:---:|------|---------|
| 1947 | 트랜지스터 발명 | 벨연구소 (Bardeen, Brattain, Shockley) |
| 1958 | 집적회로(IC) 발명 | 잭 킬비 (Texas Instruments) |
| 1965 | 무어의 법칙 제시 | 고든 무어 (Intel) |
| 1971 | 4004 마이크로프로세서 | Intel |
| 1980s | VLSI 시대 진입 | - |
| 2000s | 황의 법칙 ("무어보다 빠르게") | 황창규 (삼성) |
| 2020s | 3nm 공정 양산 | TSMC, 삼성 |

### 4.3 책의 표 (학술 fair use)

#### 표 2-3 트랜지스터 동작 상태 (책 그대로, p.33)

| 베이스-이미터 접합 | 베이스-컬렉터 접합 | 동작 상태 |
|---|---|---|
| 순방향 | 역방향 | 활성 (Active) |
| 역방향 | 역방향 | 차단 (Cut-off) |
| 순방향 | 순방향 | 포화 (Saturation) |
| 역방향 | 순방향 | 역활성 (Inverted) |

<p className="text-xs italic text-slate-500">출처: 「반도체 산업의 유해인자」 표 2-3 (p.33)</p>

---

## 5. 저작권 정책 (Ch.1과 동일)

| 항목 | 정책 |
|------|------|
| SourceQuote | **최대 3개**, 각 **≤ 150자** 직접 인용, 페이지·섹션 출처 명시 |
| 책의 표 | 표 2-3만 학술 fair use 인용, 출처 명시 |
| 자체 제작 표 | 도체/부도체 비교 + 도펀트 + 반도체 역사 연표 — 저작권 무관 |
| 책 페이지 이미지 | maxWidth 600px, 출처 명시, `_credits.json`에 메타 |
| 본문 | 책 흐름·구조 따르되 자체 서술 (직접 베끼기 금지) |

---

## 6. 구현 순서 (Do Phase 가이드)

| Step | 작업 | 시간 |
|------|------|------|
| 1 | 책 이미지 8장 복사 (cp data/.../jpeg → public/source-images/ch2/) | 10m |
| 2 | `_credits.json` 작성 (8개 항목) | 10m |
| 3 | Ch.2 MDX 재작성 — Hero, §1~§6, 자체 제작 표 3개, 책 표 1개, ImageFigure 8개, SourceQuote 3개, Callout 5개 | 60m |
| 4 | 빌드 검증 + git commit + push + Pages 배포 + 라이브 200 확인 | 15m |
| **합계** | | **~1.5h** |

---

## 7. 빌드 영향

| 항목 | 이전 | 이후 |
|------|------|------|
| 정적 페이지 | 58 | 58 (라우트 변경 없음) |
| MDX 파일 | 31 | 31 (Ch.2만 분량 증가) |
| 공개 자산 | 11 (ch1=6 + 기타) | **20** (+ch2=9) |
| 컴포넌트 | 28 | 28 (변경 없음) |

---

## 8. 미해결 결정 (Do에서 결정)

| ID | 질문 | 결정 시점 |
|----|------|----------|
| Q-D1 | 이미지 추정이 틀린 경우 (그림 내용이 예상과 다름) | Phase 3 (Do MDX 작성 시 — 캡션 일반화) |

---

## 9. 참고

- Plan: [`docs/01-plan/features/ch2-deep-content.plan.md`](../../01-plan/features/ch2-deep-content.plan.md)
- Ch.1 패턴: `docs/02-design/features/reading-experience-ch1.design.md`
- 원본: `data/20260526_185841_..._-_13/*.md` (2장 부분, lines ~384~610)
