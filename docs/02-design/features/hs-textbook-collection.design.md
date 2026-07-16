# Design — 반도체 고등학교 교과서 카테고리 + 파일럿 「반도체 기초」 자료원

> **Feature**: `hs-textbook-collection` · Plan: `docs/01-plan/features/hs-textbook-collection.plan.md`
> 확정안(2026-07-16 사용자 승인): **홈 그룹 섹션 · 파일럿 반도체 기초(렛유인) · 권별 feature 분할 · 저작권 daegu 원칙 일괄**
> 파일럿 모듈: 교과서 1번 모듈 **"반도체 개요"** (daegu 선례 — 목차 순서)

---

## 1. 아키텍처 확장 (코드 대조로 확정)

daegu 사이클이 닦은 확장 지점 재사용 + 이번에 신설하는 것 2가지(카테고리·공용 라우트):

| 확장 지점 | 현황 (코드 확인) | 조치 |
|---|---|---|
| `/sources/[source]` 인덱스 | `getOrderedSources()` 순회 자동 SSG | Source 등록만으로 인덱스 생성 — 무수정 |
| `SourceSection.group` 트랙 렌더 | `SourceSectionList` 완비 (NCS·daegu 사용 중) | 그대로 사용 (대단원 3개 = group) |
| `kind: 'textbook'` / `accent: 'school'` / `license: 'fair-use'` | daegu 사이클에서 **이미 추가됨** | 그대로 재사용 — types 확장 불필요 |
| **카테고리 개념** | **없음** (SOURCES flat) | **`SourceCategory` 신설** (§2.1) |
| 홈 `SourcePicker` | 4카드 flat grid + `PERSPECTIVE` id별 뱃지 + 카피 "네 가지 자료원…" | **카테고리 그룹 섹션 렌더로 개편** (§3) |
| 모듈 라우트/로더 | 소스별 디렉터리·로더 복제(daegu/ncs/osha) | **공용 `[source]/[module]` 라우트 + 통합 로더 신설** (§4) — 기존 3개 라우트 무수정 공존(Next.js 정적 세그먼트 우선) |
| cross-link 발견 | `src/content/sources/{id}/_links.json` glob 자동 | `hs-semicon-basics/_links.json` 생성만 |
| `extract:quotes` | 챕터·OSHA 전용 (교과서 비대상) | 무수정 — 회귀 0 확인만 |

## 2. 데이터 스키마

### 2.1 `types.ts` — 카테고리 신설

```ts
export type SourceCategory = 'hs-textbook';

export const SOURCE_CATEGORY_LABELS: Record<SourceCategory, string> = {
  'hs-textbook': '반도체 고등학교 교과서',
};

export interface Source {
  // ...기존 필드 무변
  /** 묶음 관리 단위 — 미지정이면 독립 자료원으로 개별 카드 렌더 */
  category?: SourceCategory;
}
```

- `kind`(자료 유형: 라벨 "교과서"·단위어 "단원")와 `category`(묶음)는 분리 유지 — 이유는 Plan §3.1.

### 2.2 `sources.ts` — order 재배정 + 신규 Source

**카테고리 내 표시 순서 = 학습 위계** (기초 → 공정 → …). `order`가 정렬 기준이므로 교과서 그룹에 order 4~12 대역 배정:

| order | source | 조치 |
|:-:|---|---|
| 1~3 | 책 · OSHA · NCS | 무변 |
| **4** | `hs-semicon-basics` 반도체 기초 | **신규** (공정기초의 선행편) |
| **5** | `daegu-hs-process` 반도체 공정기초 | **order 4→5 + `category` 태깅** (그 외 무변, URL 불변) |
| 6~12 | 후속 7권 (기초기술1·2, 포토에칭, 박막확산, 조립검사, 장비유지보수, 인프라일반) | 권별 사이클에서 등록 |

```ts
/**
 * 반도체고 교과서 「반도체 기초」 — 공정기초(daegu)의 선행편: 개념·산업·물성·소자.
 * 원자료 data/school-text/20260415_102949_반도체기초_렛유인_/ 전면 재작성(daegu 원칙 일괄).
 * 확장: src/content/sources/hs-semicon-basics/{module}.mdx + schoolTextMdx.tsx 로더 등록 +
 * sections에 목차 순서대로 추가 (완성 모듈만 — SSG notFound 방지).
 */
export const HS_SEMI_BASICS: Source = {
  id: 'hs-semicon-basics',
  kind: 'textbook',
  language: 'ko',
  title: '반도체 기초',
  subtitle: '반도체고 교과서 — 개념·산업·물성·소자, 공정기초의 선행편',
  attribution: '조우현·김준호',   // 표지 OCR 확인 — daegu와 동일 저자
  publisher: '렛유인',
  license: 'fair-use',
  order: 4,
  accent: 'school',
  category: 'hs-textbook',
  sections: [ /* §2.3 — 파일럿 1개부터, 확대 시 목차 순서대로 */ ],
};
export const SOURCES: Source[] = [EPI_BOOK, OSHA_SCS, NCS_SEMI, HS_SEMI_BASICS, DAEGU_HS];
```

### 2.3 섹션 전체 설계 (10모듈 — 원문 목차 재검증 완료 2026-07-16)

원문 재검증 결과: **3대단원 10중단원** (daegu와 동일 골격). 학습 목표 위치(md 라인 138/400/833/1129/1474/1916/2206/2513/2716/3728)와 대단원 마무리(1094/1876/3907), 정답부(3925~)로 교차 확인.

| # | id | title | group (대단원) | 원문 페이지 | readingTime | 파일럿 |
|:-:|---|---|---|:---:|:---:|:---:|
| 1 | `semicon-overview` | 반도체 개요 | 반도체 개념 | 5–20 | 11 | ✅ |
| 2 | `semicon-industry` | 반도체 산업 | 반도체 개념 | 21–46 | 14 | |
| 3 | `semicon-careers` | 반도체 직무 | 반도체 개념 | 47–62 | 10 | |
| 4 | `physical-properties` | 반도체 물리적 특성 | 반도체 특성 | 63–85 | 13 | |
| 5 | `semicon-fundamentals` | 반도체 기초 | 반도체 특성 | 86–108 | 13 | |
| 6 | `passive-components` | 수동소자 | 반도체 소자 | 109–122 | 9 | |
| 7 | `diode` | 다이오드 | 반도체 소자 | 122–143 | 13 | |
| 8 | `bjt` | BJT | 반도체 소자 | 143–155 | 9 | |
| 9 | `mosfet` | MOSFET | 반도체 소자 | 155–217 | 20 | |
| 10 | `cmos-image-sensor` | CMOS 이미지 센서 | 반도체 소자 | 217–240 | 12 | |

- href 규칙: `/sources/hs-semicon-basics/{id}/`. 파일럿 `semicon-overview` summary: "반도체란 무엇인가 — 도체와 부도체 사이, 시스템·메모리·센서로 나뉘는 반도체 제품의 큰 그림".
- 중단원 5 "반도체 기초"는 책 제목과 동명(원문 그대로 유지) — summary로 구분("반도체 정의와 캐리어 농도·운동 — 물성의 핵심").
- OCR 주의: 표지 "비도체"(→반도체) 등 오인식 확인됨. 각 모듈 재구성 시 해당 페이지 원문 직접 재확인.
- MOSFET 모듈(62쪽)이 최대 분량 — 확인문제·그림 비중이 높아 본문 밀도는 관리 가능, 1중단원=1모듈 원칙 유지.

## 3. 홈 `SourcePicker` — 카테고리 그룹 섹션 (확정 A안)

### 렌더 구조

```tsx
const sources = getOrderedSources();
const standalone = sources.filter((s) => !s.category);        // 책·OSHA·NCS
const textbooks = sources.filter((s) => s.category === 'hs-textbook');
```

```
자료원 선택 / 어느 자료부터 살펴볼까요?
[학술서]  [OSHA]      ← standalone 기존 카드 그대로 (sm:grid-cols-2)
[NCS]
┌─ 반도체 고등학교 교과서 ──────────────────┐  ← 카테고리 그룹 박스 (전체 폭)
│  GraduationCap 아이콘 + SOURCE_CATEGORY_LABELS 헤더        │
│  뱃지 "교과 — 학교에서 배우는 그대로" + 설명 한 줄          │
│  [반도체 기초] [반도체 공정기초] (…후속 권 확대)             │  ← 컴팩트 권 카드 grid sm:2
└──────────────────────────────────────────┘
```

- **그룹 박스**: `rounded-2xl border-2` + `SOURCE_ACCENT_BORDER['school']`(amber) — 기존 카드와 같은 시각 언어, 전체 폭.
- **컴팩트 권 카드**: 제목 + subtitle + "n개 단원 · 저자" 메타 + 호버 시 화살표. 아이콘·뱃지 생략(그룹 헤더가 대신) — 9권까지 늘어도 밀도 유지.
- **PERSPECTIVE 뱃지**: `daegu-hs-process` 항목 제거(개별 카드가 사라지므로), 그룹 헤더 뱃지 "교과 — 학교에서 배우는 그대로"로 승격. 나머지 3개(위험·안전·직무)는 무변.
- **카피 갱신**: "고교 교과서·학술서·OSHA·NCS, 네 가지 자료원이 각각 원리·위험·안전·직무를 맡아요." → "학술서·OSHA·NCS 세 자료원이 위험·안전·직무를, 반도체고 교과서 묶음이 학교 교과 과정을 맡아요. 같은 주제를 여러 출처로 비교하면서 깊이 있게 익혀보세요."
- 준비 중(미등록) 권의 자리표시 카드는 **넣지 않는다** — 빈 껍데기 회피, 권별 사이클 완료 시 자연 확대.
- `page.tsx`·`PlatformHero`의 `TOTAL_UNITS` 계산은 SOURCES 합산이라 자동 반영 — 무수정.

## 4. 라우팅 · 로더 — 공용 인프라 (확정 A안)

### 4.1 `src/lib/schoolTextMdx.tsx` (신규 — 통합 로더 레지스트리)

```tsx
import type { ComponentType } from 'react';

/**
 * 반도체고 교과서 카테고리 공용 MDX 로더 (source → module 2단 레지스트리).
 * daegu-hs-process는 전용 라우트+daeguMdx.tsx 유지 — 여기 등록 금지(라우트 충돌).
 * 새 권 추가: REGISTRY에 source 항목 + 모듈 로더, sources.ts sections 등록(완성 모듈만).
 */
const REGISTRY: Record<string, Record<string, () => Promise<{ default: ComponentType }>>> = {
  'hs-semicon-basics': {
    'semicon-overview': () => import('@/content/sources/hs-semicon-basics/semicon-overview.mdx'),
    // 확대 시 목차 순서대로 추가
  },
};

export function listSchoolTextSourceIds(): string[] {
  return Object.keys(REGISTRY);
}

export async function loadSchoolTextMdx(
  sourceId: string,
  moduleId: string,
): Promise<ComponentType | null> {
  const loader = REGISTRY[sourceId]?.[moduleId];
  if (!loader) return null;
  return (await loader()).default;
}
```

### 4.2 `src/app/sources/[source]/[module]/page.tsx` (신규 — 공용 모듈 라우트)

daegu `[module]/page.tsx`의 일반화. 핵심 규칙:

- `generateStaticParams`: `listSchoolTextSourceIds()` 소스들의 `sections` 순회 → `{ source, module }`. **REGISTRY가 라우팅 진실** — daegu·NCS·OSHA는 REGISTRY에 없으므로 params 미생성(기존 전용 정적 세그먼트 라우트와 출력 충돌 없음, Next.js 정적 세그먼트 우선은 이중 안전망).
- `generateMetadata`: `getSourceSection(source, module)` + `buildMetadata({ title: '{section.title} | {source.title}', path })`.
- 본문: idx 미발견 시 `notFound()`, `loadSchoolTextMdx(source, module)` → `SourceModuleArticle`(breadcrumb·이전/다음 내비·cross-link `RelatedFromOtherSources` 자동).
- **disclosure 공통 템플릿** (daegu 문구의 일반화, 함수로 생성):
  `반도체 고등학교 교과서 「{title}」({attribution} 지음, {publisher})의 내용을 고등학생 눈높이로 전면 재작성했습니다. 원문 문장·도판은 사용하지 않으며, 각 단원 하단에 원문 단원·페이지를 표기합니다.`

### 4.3 기존 라우트 정리 방침

- daegu 전용 라우트(`daegu-hs-process/[module]` + `daeguMdx.tsx`)는 **이번 사이클 무수정 유지**(코어 무수정 원칙). 공용 라우트로의 이관은 비목표 — 전 권 완주 후 별도 리팩터 사이클에서 판단.

## 5. 콘텐츠 재구성 계약 (MDX) — daegu §4 계약 전면 승계

전역 컴포넌트(`LayeredExplain`·`SourceQuote`·`Callout`·`Term`·GFM 표) 재사용. **원문 이미지 전면 미사용**(파일럿은 무이미지), 문장 전면 재작성, 수치·정의 보존, MDX 안전 규칙(리터럴 `<`·`{` 금지, `~`→`∼`, 유니코드 아래첨자, 각주 `<div>`, 인라인 블록 컴포넌트 금지) 그대로.

### 파일럿 "반도체 개요" (원문 5–20쪽) 구조 매핑

1. `<Callout type="info">` — 학습 목표 재작성("반도체의 개념과 반도체 제품의 종류에 대해 설명할 수 있다").
2. `<LayeredExplain>` — Hook("스마트폰 두뇌는 어떻게 돌 조각에서 나올까?") / Easy(도체·부도체 사이 스위치 비유) / Deep(전도도 기준 정의·에너지 밴드 예고 — 원문 문장 미사용).
3. 본문 섹션(원문 절 순서):
   - `## 1. 반도체란 무엇인가` — 정의, 도체/부도체/반도체 구분, 반도체 제품의 발전 방향(4004→최신 프로세서 비교는 데이터만 재배열).
   - `## 2. 반도체 제품의 종류` — 시스템(로직·아날로그·마이크로컴포넌트) / 메모리(DRAM·플래시) / 광학·센서. GFM 표 재구성.
4. `<Callout type="tip">` — "이 제품들이 어떻게 만들어지는지는 「반도체 공정기초」 공정 개요에서" (daegu `process-overview` 링크) + 책 챕터 연결.
5. 말미 출처: `<div className="text-xs …">출처: 「반도체 기초」(조우현·김준호 지음, 렛유인) Ⅰ단원 5–20쪽을 재구성</div>`.
6. 확인문제·핵심요약 원문 미사용(비목표).

## 6. cross-link 태깅 (`hs-semicon-basics/_links.json`)

이 권은 소자·물성 중심이라 통제 어휘(공정·유해인자 중심)와 겹침이 얕다. **최소 태깅 원칙**: 실제 본문에서 다루는 주제만, 어휘 신설은 비목표(추후 어휘 확장 사이클에서 device/industry 계열 topic 검토).

```json
{
  "$comment": "Cross-link tags for 반도체고 교과서 「반도체 기초」. 소자·물성 권이라 최소 태깅 — 어휘에 없는 모듈은 생략(링크 미노출이 정상).",
  "semicon-overview": { "topics": ["wafer-fab"] },
  "semicon-industry": { "topics": ["packaging"] },
  "mosfet": { "topics": ["wafer-fab"] }
}
```

- 확대 시 초안: `passive-components`(공정에서의 R·L·C 구현 절 확인 후 deposition 검토) — Do에서 본문 재구성 후 실제 언급 기준으로만 추가.
- 파일럿 실증: `semicon-overview`(wafer-fab) ↔ daegu `process-overview`·책 2·3·5장·NCS 다수 자동 연결. FR-6(최소 3건)은 semicon-overview·semicon-industry·mosfet 3모듈로 충족.
- **무태깅 모듈 실증 필요**: `_links.json`에 없는 모듈(diode 등)에서 `RelatedFromOtherSources`가 조용히 미렌더되는지 확대 1호에서 확인(§7).

## 7. 검증 계획

- `typecheck`(SourceCategory·filter 타입) + `lint` + `build` — `/sources/hs-semicon-basics/`(인덱스) + `/sources/hs-semicon-basics/semicon-overview/` SSG 확인.
- `build:cross-link` 통제 어휘 검증 통과 + `extract:quotes` 회귀 0(diff 없음).
- 렌더 실측: 홈 카테고리 그룹 박스(amber 보더·GraduationCap·뱃지·컴팩트 카드 2장: 반도체 기초 → 공정기초 순) · standalone 3카드 무변 · `/sources/hs-semicon-basics` 트랙 그룹(반도체 개념 1모듈) · 모듈 페이지 3단 레이어·disclosure·출처 footer · cross-link 연결(daegu·책) · 다크모드.
- **공용 라우트 충돌 검증**: 빌드 출력에서 `/sources/daegu-hs-process/*`가 기존 전용 라우트로만 생성되는지(중복 params 없음) 확인.
- 저작권 자가 점검: 원문 이미지 0 · `SourceQuote` 외 원문 문장 0 · 출처 표기 존재.
- daegu order 4→5 변경에 따른 회귀: `/sources` 인덱스·홈에서 순서만 바뀌고 URL·내용 무변 확인.

## 8. 구현 순서

1. `types.ts`(SourceCategory) → `sources.ts`(HS_SEMI_BASICS 신규 + daegu category·order) → `SourcePicker`(카테고리 그룹 렌더·카피·PERSPECTIVE) — 빌드 가능 상태
2. `schoolTextMdx.tsx` + `[source]/[module]/page.tsx` 공용 라우트
3. 파일럿 `semicon-overview.mdx` 재구성(원문 5–20쪽 정독 → 3단 레이어)
4. `_links.json` 태깅 → 검증 게이트(§7) + 렌더 실측
5. **확대**(같은 사이클): 목차 순서대로 `semicon-industry` → … → `cmos-image-sensor` (모듈 완성 시마다 sections·REGISTRY·_links 동시 갱신, 모듈 단위 빌드 검증)
