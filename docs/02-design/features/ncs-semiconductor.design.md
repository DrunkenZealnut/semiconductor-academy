# Design — NCS 반도체 학습모듈 자료원 (파일럿)

> **Feature**: `ncs-semiconductor` · Plan: `docs/01-plan/features/ncs-semiconductor.plan.md`
> 권장안 확정: **파일럿(제조 3개) · 1자료원+4트랙 · 3단 레이어 재구성** (사용자 승인 2026-07-12)

---

## 1. 아키텍처 확장 (코드 대조로 확정)

기존 multi-source 아키텍처가 **확장 지점을 이미 갖추고 있음** — 신규 인프라 최소:

| 확장 지점 | 현황 | 조치 |
|---|---|---|
| `SourceKind` | `'standard'` **이미 존재** | 그대로 사용 |
| `accent: 'standard'` | SourcePicker `ACCENT_RING/ACCENT_ICON/IconFor`에 **완전 정의**(Library 아이콘·slate) | 그대로 사용 → 홈 카드 자동 렌더, UI 변경 0 |
| SourcePicker | `getOrderedSources()` 순회 + `s.accent ?? 'standard'` fallback | Source 추가만으로 홈 노출 |
| cross-link 발견 | `src/content/sources/{id}/_links.json` **glob 자동 발견** | `ncs-semi/_links.json` 생성 → 스크립트가 sources.ts 안 읽어도 인식 |
| 통제 어휘 | TOPICS 23개(photolithography·cleanroom·ppe·exposure-monitoring 등) | Photo→photolithography로 책 8장·OSHA 자동 연결 |
| `SourceLicense` | NCS 값 없음 | **신규 값 1개 추가** |
| `SourceSection` | group 필드 없음 | **`group?: string` optional 추가** (graceful — 책·OSHA는 group 없음) |

## 2. 데이터 스키마

### 2.1 `types.ts` 변경
```ts
export type SourceLicense =
  | 'fair-use' | 'us-gov-public-domain' | 'cc-by' | 'cc-by-sa' | 'public-domain'
  | 'ncs-open';                                    // 신규

export const SOURCE_LICENSE_LABELS: Record<SourceLicense, string> = {
  // ...기존
  'ncs-open': 'NCS 학습모듈 · 교육 목적 공개(출처 명시)',   // 신규
};

export interface SourceSection {
  // ...기존
  group?: string;   // 신규: 세분류 트랙명(예: "반도체제조"). 없으면 그룹 없이 flat 렌더.
}
```

### 2.2 `NCS_SEMI` Source (`sources.ts`)
```ts
export const NCS_SEMI: Source = {
  id: 'ncs-semi',
  kind: 'standard',
  language: 'ko',
  title: 'NCS 반도체 학습모듈',
  subtitle: '국가직무능력표준 — 현장 직무로 배우는 반도체',
  attribution: '교육부 · 한국산업인력공단',
  publisher: 'NCS 국가직무능력표준',
  year: 2024,
  license: 'ncs-open',
  url: 'https://www.ncs.go.kr/',
  order: 3,
  accent: 'standard',
  sections: [ /* 파일럿 3개 (group: '반도체제조'), 확대 시 추가 */ ],
};
export const SOURCES: Source[] = [EPI_BOOK, OSHA_SCS, NCS_SEMI];
```

### 2.3 파일럿 섹션 (제조 트랙)
| id | title | group | href | readingTime |
|---|---|---|---|:---:|
| `photo-equipment` | Photo(노광) 장비 운영 | 반도체제조 | `/sources/ncs-semi/photo-equipment/` | 12 |
| `quality-control` | 반도체 품질관리 | 반도체제조 | `/sources/ncs-semi/quality-control/` | 10 |
| `productivity` | 반도체 생산성 향상 | 반도체제조 | `/sources/ncs-semi/productivity/` | 9 |

## 3. 라우팅 · 로더

### 3.1 `ncsMdx.tsx` (신규, oshaMdx 단순화 — 언어 단일)
```ts
const loaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  'photo-equipment': () => import('@/content/sources/ncs-semi/photo-equipment.mdx'),
  'quality-control': () => import('@/content/sources/ncs-semi/quality-control.mdx'),
  'productivity':    () => import('@/content/sources/ncs-semi/productivity.mdx'),
};
export async function loadNcsModuleMdx(moduleId: string): Promise<ComponentType | null> { ... }
```

### 3.2 `/sources/ncs-semi/[module]/page.tsx` (신규)
- OSHA `[part]/page.tsx` 복제 후 **단순화**: LanguageToggle 제거(한글 단일), `NCS_SEMI` 참조, breadcrumb "NCS 반도체 학습모듈", 이전/다음 = 같은 트랙 내 인접 섹션, footer 출처.
- `generateStaticParams` = `NCS_SEMI.sections.map(s => ({ module: s.id }))`.
- `RelatedFromOtherSources sourceId="ncs-semi"`로 cross-link 노출.

### 3.3 `SourceSectionList.tsx` 그룹 렌더 (확장)
- `sections`를 `group`으로 묶어 세분류 헤더(h3) + 그룹별 그리드. `group` 없는 섹션(책·OSHA)은 기존처럼 flat. → **하위호환 graceful**.

## 4. 콘텐츠 재구성 계약 (MDX)

기존 챕터 MDX와 동일 컴포넌트(전역 등록): `LayeredExplain`·`SourceQuote`·`Callout`·`Term`·`ChapterRef`(→ 필요 시 SourceRef)·표(GFM). **ImageFigure 미사용**(저작권).

### 구조 (모듈당)
1. `<LayeredExplain>` 1개 — Hook(이 모듈이 답하는 질문) / Easy(비유) / Deep(NCS 원문 핵심 정의·수치 인용, `sourcePage` 대신 학습 단위 라벨).
2. `## 한 줄 요약` — 직무 관점 3줄.
3. 학습 단위별 섹션 — `## 1. …` `### 가. …`, 필요 지식(이론)을 비유+원문 인용으로, 수행 내용(실습)은 **고등학생에게 필요한 만큼만 요약**.
4. 원문 표(노광 광원 파장 g/i/KrF/ArF/EUV 등) GFM 재현.
5. `<Callout type="tip">` 로 책·OSHA 연결(예: "책 8장 포토리소그래피와 함께 보기").
6. 말미 `<div className="text-xs …">출처: NCS 학습모듈 {코드} {명칭} · 교육부·한국산업인력공단</div>`.

### MDX 안전 규칙 (챕터 사이클 교훈 계승)
- 리터럴 `<`·`{` 금지, `~`→`∼`, 화학식 유니코드 아래첨자, 표는 GFM.
- **각주는 `<div>`** (여러 줄 `<p>` 금지 — hydration), **인라인 블록 컴포넌트 금지**(앞뒤 빈 줄).
- 표 넓으면 `mdx-components.tsx`의 table 래퍼가 전역 처리(기존).

### 재구성 원칙 (원문 직역 아님)
- NCS 원문(직무훈련) → 고등학생 눈높이. Easy는 비유, Deep은 원문 근거.
- 방대한 실습 절차·평가는 핵심만. 진로 관점("현장에서 왜/어떻게") 유지.
- 원문 이미지 0개. 수치·용어·표는 정확.

## 5. cross-link 태깅 (`ncs-semi/_links.json`)
```json
{
  "photo-equipment": { "topics": ["photolithography", "cleanroom", "ppe"] },
  "quality-control": { "topics": ["exposure-monitoring", "wafer-fab"] },
  "productivity":    { "topics": ["wafer-fab"] }
}
```
→ `build:cross-link`가 자동 발견·검증(unknown → exit 1). Photo↔책 8장(photolithography)·OSHA 연결 실증.

## 6. 검증 계획
- `typecheck`(타입 확장) + `lint` + `build`(정적 export, `/sources/ncs-semi/*` SSG).
- `build:cross-link` 통제어휘 검증 통과 + 홈/인덱스에 NCS 카드·트랙 렌더.
- `extract:quotes` 회귀 0 (NCS MDX는 챕터 스캔 대상 아님 — 확인).
- Playwright: 홈 SourcePicker 3번째 카드(Library/slate) · `/sources/ncs-semi` 트랙 그룹 · 모듈 페이지 3단 레이어 · cross-link · 다크모드 · SSR 무결성.

## 7. 구현 순서
1. types.ts 확장 → sources.ts NCS_SEMI → ncsMdx.tsx → 라우트 (인프라, 빌드 가능 상태)
2. 파일럿 3개 MDX 재구성 (원문 정독 → 3단 레이어)
3. SourceSectionList 그룹 렌더 + _links.json 태깅
4. 검증 게이트 + 렌더 실측
