# Design — 대구반도체고 교과서 「반도체 공정기초」 자료원 (파일럿)

> **Feature**: `daegu-hs-textbook` · Plan: `docs/01-plan/features/daegu-hs-textbook.plan.md`
> 확정안: **A안(신규 Source) · 3트랙 10모듈 · 책 목차 순서 · 전면 재작성 + 원저자·발행처 표기** (사용자 승인 2026-07-14)
> 파일럿: 교과서 1번 모듈 **"반도체 공정 개요"**

---

## 1. 아키텍처 확장 (코드 대조로 확정)

NCS 사이클이 닦아놓은 확장 지점을 그대로 재사용 — 신규 인프라 최소:

| 확장 지점 | 현황 (코드 확인) | 조치 |
|---|---|---|
| `/sources/[source]` 인덱스 | `getOrderedSources()` 순회로 **자동 SSG** | Source 등록만으로 인덱스 생성, 라우트 무수정 |
| `SourceSection.group` | NCS 사이클에서 **이미 추가됨** + `SourceSectionList` 트랙 그룹 렌더 완비 | 그대로 사용 (대단원 3개 = group) |
| cross-link 발견 | `src/content/sources/{id}/_links.json` glob 자동 발견 | `daegu-hs-process/_links.json` 생성만 |
| `extract:quotes` | 챕터·OSHA 디렉토리만 스캔 (`CHAPTERS_DIR`/`OSHA_DIR`) | 대구 MDX 스캔 대상 아님 — 회귀 0 확인만 |
| `SourceKind` | `'book'`(학술서)·`'standard'` 등 5종 — **교과서 없음** | **`'textbook'` 신규** (§2.1) |
| `accent` | `'book' \| 'osha' \| 'standard'` 3종 전부 사용 중 | **`'school'` 신규** (§2.1) — 4번째 카드 시각 구분 |
| `SourceLicense` | `fair-use`(학술 인용) 기존 | **재사용** — 최소 인용+전면 재작성 성격에 부합, 신규 값 불필요 |

## 2. 데이터 스키마

### 2.1 `types.ts` 변경

```ts
export type SourceKind = 'book' | 'training-program' | 'standard' | 'guide' | 'paper'
  | 'textbook';                                        // 신규

export const SOURCE_KIND_LABELS: Record<SourceKind, string> = {
  // ...기존
  textbook: '교과서',                                   // 신규
};

export interface Source {
  // ...기존
  accent?: 'book' | 'osha' | 'standard' | 'school';    // 'school' 신규
}
```

- `accent: 'school'` 추가에 따라 `SourcePicker.tsx`의 `ACCENT_RING`/`ACCENT_ICON`(typed Record — typecheck가 누락 강제)과 `IconFor`에 항목 추가: **GraduationCap 아이콘 · amber 계열**(emerald는 OSHA가 사용 중 — 코드 대조로 정정. amber는 포토 공정 옐로룸 연상). 기존 3개 자료원 카드 렌더 무영향(추가만).
- `[source]/page.tsx`의 `UNIT_LABEL_BY_KIND`에 `textbook: '단원'` 1줄 추가(Record<string,string>, fallback 있어 하위호환).

### 2.2 `DAEGU_HS` Source (`sources.ts`)

```ts
export const DAEGU_HS: Source = {
  id: 'daegu-hs-process',
  kind: 'textbook',
  language: 'ko',
  title: '반도체 공정기초',
  subtitle: '대구반도체고 교과서 — 공정 원리를 단원 순서 그대로',
  attribution: '조우현·김준호',
  publisher: '렛유인',
  // year: 판권 OCR 손상으로 미상 — 확인 전까지 생략
  license: 'fair-use',
  order: 4,
  accent: 'school',
  sections: [ /* §2.3 — 파일럿 1개부터, 확대 시 목차 순서대로 추가 */ ],
};
export const SOURCES: Source[] = [EPI_BOOK, OSHA_SCS, NCS_SEMI, DAEGU_HS];
```

### 2.3 섹션 전체 설계 (10모듈 — 등록 순서 = 교과서 목차 순서)

| # | id | title | group (대단원) | 원문 페이지 | 파일럿 |
|:-:|---|---|---|:---:|:---:|
| 1 | `process-overview` | 반도체 공정 개요 | 반도체 공정 개념 | 7–18 | ✅ |
| 2 | `equipment-parameters` | 공정 설비와 파라미터 | 반도체 공정 개념 | 21–43 | |
| 3 | `photo` | 포토 공정 | 반도체 공정 Ⅰ | 49–74 | |
| 4 | `etch` | 식각 공정 | 반도체 공정 Ⅰ | 77–98 | |
| 5 | `thin-film` | 박막 공정 | 반도체 공정 Ⅰ | 101–126 | |
| 6 | `metallization` | 금속 배선 공정 | 반도체 공정 Ⅰ | 129–143 | |
| 7 | `oxidation` | 산화 공정 | 반도체 공정 Ⅱ | 147–156 | |
| 8 | `doping` | 도핑 공정 | 반도체 공정 Ⅱ | 159–178 | |
| 9 | `cmp` | CMP 공정 | 반도체 공정 Ⅱ | 179–192 | |
| 10 | `cleaning` | 세정 공정 | 반도체 공정 Ⅱ | 195–206 | |

- href 규칙: `/sources/daegu-hs-process/{id}/`. 파일럿 `process-overview`의 `readingTime` 추정 8분, `summary`: "8대 공정과 전공정·후공정, 웨이퍼 제작, 클린룸 — 반도체 공정의 큰 그림".
- OCR 주의: 원문 md에서 대단원 3 제목이 "반도체 공정 표"로 오인식되어 있음(실제 "반도체 공정 Ⅱ"). 재구성 시 원문 페이지 직접 재확인.

## 3. 라우팅 · 로더

### 3.1 `daeguMdx.tsx` (신규 — ncsMdx 패턴 복제)
```ts
const loaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  'process-overview': () => import('@/content/sources/daegu-hs-process/process-overview.mdx'),
  // 확대 시 목차 순서대로 추가
};
export async function loadDaeguModuleMdx(moduleId: string): Promise<ComponentType | null> { ... }
```

### 3.2 `/sources/daegu-hs-process/[module]/page.tsx` (신규 — NCS `[module]` 복제)
- `NCS_SEMI` → `DAEGU_HS`, `loadNcsModuleMdx` → `loadDaeguModuleMdx`, breadcrumb "반도체 공정기초".
- `generateStaticParams` = `DAEGU_HS.sections.map(s => ({ module: s.id }))` — 이전/다음 내비는 섹션 등록 순서(= 목차 순서) 그대로.
- footer 안내문(대구 전용): "대구반도체고 교과서 「반도체 공정기초」(조우현·김준호 지음, 렛유인)의 내용을 고등학생 눈높이로 **전면 재작성**했습니다. 원문 문장·도판은 사용하지 않으며, 각 단원 하단에 원문 단원·페이지를 표기합니다."
- `RelatedFromOtherSources sourceId="daegu-hs-process"`로 cross-link 노출.

## 4. 콘텐츠 재구성 계약 (MDX)

전역 등록 컴포넌트 재사용: `LayeredExplain`·`SourceQuote`·`Callout`·`Term`·표(GFM). **원문 이미지 244개 전면 미사용**, 필요 도식은 자체 제작(이번 파일럿은 무이미지).

### 구조 (모듈당 — 교과서 단원 구조를 3단 레이어로 매핑)
1. `<LayeredExplain>` 1개 — Hook(단원이 답하는 질문) / Easy(비유) / Deep(핵심 정의·수치 — **원문 문장 재사용 금지**, 개념만 근거로 새로 씀).
2. `<Callout type="info">` — 교과서의 "학습 목표"를 재작성해 단원 도입에 배치.
3. 본문 섹션 — 교과서 소절 순서를 따르되 문장 전면 재작성. 파일럿(공정 개요) 매핑:
   - `## 1. 8대 공정` — Photo/Etch/CVD/Metal/Diffusion/Implant/CMP/Clean + 전공정·후공정, FEOL/MOL/BEOL.
   - `## 2. 웨이퍼 공정` — CZ/FZ 성장법(녹는점 1,420℃ 등 수치 보존), Edge Rounding→Lapping→Etching→Polishing.
   - `## 3. 클린룸` — class 정의(1ft³당 0.5μm 이상 입자 수), 필터·하향 기류, Lot(웨이퍼 25매), 옐로룸.
4. 수치·분류표는 GFM 표로 재구성(표 형식 자체도 원문 복제가 아닌 재배열).
5. `<Callout type="tip">` — 책·NCS·기존 Process 연결 안내(예: "클린룸의 유해인자는 책 4장에서").
6. 말미 출처 표기: `<div className="text-xs …">출처: 「반도체 공정기초」(조우현·김준호 지음, 렛유인) 1단원 ○–○쪽을 재구성</div>`.
7. 교과서의 "확인문제"·"핵심요약" 원문은 미사용(비목표) — 필요 시 자체 문구로 대체.

### MDX 안전 규칙 (기존 사이클 교훈 그대로)
- 리터럴 `<`·`{` 금지, `~`→`∼`, 화학식 유니코드 아래첨자(NH₄OH·CH₃COOH·HNO₃ 등), 표는 GFM.
- 각주·출처는 `<div>`(hydration), 인라인 블록 컴포넌트 금지(앞뒤 빈 줄).

### 저작권 계약 (전면 재작성 원칙의 구체화)
- **문장 단위**: 원문 문장의 어순·구문을 그대로 따르지 않는다. 개념→이해→재서술 순서로 작성.
- **인용 최소화**: `SourceQuote`는 정의 1–2문장 수준만, 그 외 본문은 인용 없이 재작성.
- **이미지 0**, 확인문제 원문 0, 표는 데이터만 취해 재배열.

## 5. cross-link 태깅 (`daegu-hs-process/_links.json`)

```json
{
  "$comment": "Cross-link tags for 대구반도체고 교과서. Section IDs match sources.ts DAEGU_HS.sections.",
  "process-overview": { "topics": ["wafer-fab", "cleanroom"] }
}
```

확대 시 초안(통제 어휘 검증 통과 확인 완료 — 전부 기존 TOPICS):
`equipment-parameters`→wafer-fab·engineering-controls / `photo`→photolithography / `etch`→etching / `thin-film`→deposition / `metallization`→deposition·wafer-fab / `oxidation`→diffusion·wafer-fab / `doping`→diffusion·ion-implantation / `cmp`→cmp / `cleaning`→liquid-chemicals

→ 파일럿 실증: `process-overview`(wafer-fab·cleanroom) ↔ 책 2·3·5장(wafer-fab 태그 공유)·4장(cleanroom)·NCS 다수 모듈 자동 연결. 책 3장은 본문 tip Callout의 `ChapterRef`로도 직접 연결.

## 6. 검증 계획

- `typecheck`(kind·accent 확장) + `lint` + `build`(정적 export, `/sources/daegu-hs-process/*` SSG 1+1페이지).
- `build:cross-link` 통제 어휘 검증 통과, `extract:quotes` 회귀 0(대구 디렉토리 스캔 대상 아님).
- 렌더 실측: 홈 SourcePicker 4번째 카드(GraduationCap·amber) · `/sources/daegu-hs-process` 트랙 그룹(공정 개념 트랙 1모듈) · 모듈 페이지 3단 레이어·출처 footer · cross-link 연결 · 다크모드.
- 저작권 자가 점검: 원문 이미지 0 · `SourceQuote` 외 원문 문장 0 · 출처 표기 존재.

## 7. 구현 순서

1. `types.ts`(kind·accent) → `SourcePicker`(ACCENT 2 Record+IconFor) → `[source]/page.tsx`(UNIT_LABEL 1줄) → `sources.ts`(DAEGU_HS) — 빌드 가능 상태
2. `daeguMdx.tsx` + `[module]/page.tsx` 라우트
3. 파일럿 `process-overview.mdx` 재구성(원문 7–18쪽 정독 → 3단 레이어)
4. `_links.json` 태깅 → 검증 게이트(§6) + 렌더 실측
