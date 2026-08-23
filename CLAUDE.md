# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

반도체 산업의 유해인자를 중·고등학생·일반인이 이해할 수 있게 풀어주는 교육용 **웹사이트**.
학술서 「반도체 산업의 유해인자」(윤충식 외)와 OSHA Semiconductor Chemical Safety 자료를
비유·일러스트·인터랙티브 다이어그램으로 재구성한다. Next.js 15 App Router → **Vercel 배포**.
모든 동적 라우트를 `generateStaticParams`로 빌드 타임 전개해 사실상 전 페이지가 SSG로 생성되지만,
`output: 'export'`는 쓰지 않는다 — 로그인 게이트(`src/middleware.ts`)가 서버 런타임을 요구한다.

## 명령어

```bash
npm run dev         # 개발 서버 (포트 3016) — predev가 데이터 스크립트 먼저 실행
npm run build       # 프로덕션 빌드 (.next/) — prebuild가 데이터 스크립트 먼저 실행
npm run typecheck   # tsc --noEmit (data/, docs/ 제외)
npm run lint        # next lint (next/core-web-vitals + next/typescript)

npm run extract:quotes      # quotes.json 재생성 (MDX → 인용 추출)
npm run build:cross-link    # cross-link.json 재생성 (통제 어휘 검증 + 인덱스)

npm run verify:diagram      # 도해 관문 C-1~C-19 (5웨이브 · 도해 489건 전량) — 브라우저 없이, 밀리초
npm run verify:render       # 도해 렌더 심층 검증 (브라우저·서버·자격증명 필요, 약 3분)
```

테스트 러너는 없다. 검증은 `typecheck` + `lint` + 빌드 스크립트의 자체 검증 + **도해 관문**으로 한다.

**도해를 추가·수정하면 `npm run verify:diagram`을 돌린다.** C-1~C-19와 자체검사 대조군 54건이 들어 있고,
자체검사가 실패하면 본 검사를 실행하지 않고 `exit 2`로 끝낸다(검사기가 눈먼 채로 통과를 내지 않게).

**범위** — 전 자료원이 `WAVES`에 등록돼 있다(w0 `first-semiconductor` 140 · w1 109 · w2 146 · w3 60 · w4 34
= 도해 489건). 새 자료원을 만들고 등록하지 않으면 조용히 빠지지 않고 **`exit 2`** 다(D-10 시작 단언).
`C-18`(최소 폭 계약)·`C-19`(대비)는 컴포넌트·토큰 단위라 자료원과 무관하게 전량을 지킨다.

**정적 검사가 일부러 보지 않는 자리가 셋 있다** — `LabeledFigure`의 자식(저작자 인라인 SVG) · `viewBox` ·
`ScaleRuler.refs`. 각각의 이유와 "대신 무엇이 지키나"는
`docs/02-design/features/diagram-component-set.usage.md` §2.1.1d에 있다. 넷째를 만들려면 그 표에 줄을 더한다.

`verify:render`는 상시 관문이 아니다 — 브라우저가 있어야만 볼 수 있는 것(실제 축소 배율·**좌표로 결정되는
대비**·실제 가로 넘침·마커 참조)만 본다. 사이클 종료 시점과 도해를 새로 추가했을 때 돌린다. 자격 증명은
셸에서 넘긴다: `set -a; . ./.env.local; set +a; npm run verify:render`

## 데이터 생성 파이프라인 (가장 중요)

`predev`/`prebuild` 훅이 dev·build **이전에** 두 스크립트를 자동 실행한다. 둘 다 `src/data/*.json`
산출물을 만들며, 이 산출물은 **수동 편집 대상이 아니다** (스크립트로 재생성).

1. **`scripts/extract-quotes.mjs`** → `src/data/quotes.json`
   - 챕터 MDX(`LayeredExplain`, `SourceQuote`)와 OSHA MDX(Overview/Summary/Definitions)에서 인용 추출.
   - 라인 기반 스캐닝 (복잡한 regex 회피).

2. **`scripts/build-cross-link-index.mjs`** → `src/data/cross-link.json`
   - 통제 어휘(Topic/Hazard) **검증** 후 정·역방향 인덱스 생성.
   - 알 수 없는 topic/hazard → **exit 1** (Levenshtein 오타 제안 출력). 알 수 없는 chemical id → 경고만 (graceful).
   - 소스 발견은 manifest 기반: `src/data/_book-links.json`(책, 특수 케이스) + `src/content/sources/{id}/_links.json`(glob).

빌드 산출물(`quotes.json`, `cross-link.json`)을 직접 수정하지 말 것. 원본(MDX, `_links.json`)을 고치고 스크립트를 재실행한다.

## 두 개의 수동 미러 (동기화 필수)

`.mjs` 빌드 스크립트는 TypeScript를 import할 수 없어, 단일 진실을 **수동 미러**로 유지한다.
한쪽만 고치면 빌드 검증이 깨지거나 UI 불일치가 발생한다.

| 진실 원본 (TS) | 미러 (스크립트가 읽음) | 동기화 대상 |
|---|---|---|
| `src/lib/cross-link/schema.ts` (`TOPICS`/`HAZARDS`) | `src/data/schema-enum.json` | 통제 어휘 enum |
| `src/lib/sources.ts` (`OSHA_SCS.sections`) | `scripts/extract-quotes.mjs`의 `OSHA_PART_META` | OSHA part title/href |

어휘를 추가하면 `schema.ts` **와** `schema-enum.json` 양쪽을 함께 고치고 `npm run build:cross-link`로 검증.

## 콘텐츠 / 데이터 모델

- **타입의 단일 진실**: `src/lib/types.ts` — `Process`, `Chemical`, `Chapter`, `Source`, `SourceSection` 등 + 한국어 라벨/색상 토큰 매핑.
- **앱 데이터** (`src/data/*.json`): `chapters.json`(17장), `processes.json`(9공정), `chemicals.json`, `terms.json`. `src/lib/content.ts`·`chapters.ts`가 타입 단언 후 조회 헬퍼 제공.
- **MDX 본문**: `src/content/chapters/`(책 17장), `src/content/processes/`(공정), `src/content/sources/osha-scs/`(OSHA 5 part).
- **원본 학술 자료**: 루트 `data/` — PDF에서 추출한 원문/이미지. **수정 금지**, tsconfig에서도 제외. (앱 데이터인 `src/data/`와 혼동 주의.)

### Multi-source 모델
`src/lib/sources.ts`의 `SOURCES` 레지스트리(EPI 책 + OSHA SCS)가 자료원·섹션의 메타·URL·라이선스를 정의.
책 챕터는 `chapterToSection`으로 `SourceSection`에 매핑된다.

### Cross-link 시스템
자료원 간 연결을 통제 어휘(Topic/Hazard/Chemical) 공유로 계산. `src/lib/cross-link/lookup.ts`가
`cross-link.json`을 읽어 런타임 조회 (`lookupRelated`, `lookupByChemical`) — 자기 참조 제외, source.order 정렬,
shareScore 정렬, 그룹당 maxPerGroup 제한. UI는 `src/components/cross-link/`.

## 라우팅 (빌드 타임 전개 패턴)

모든 동적 라우트는 `generateStaticParams`로 빌드 타임에 전개된다 — 미들웨어를 제외하면 페이지 렌더에 서버 런타임이 필요 없다.

- `src/app/chapter/[slug]/`, `process/[slug]/`, `chemicals/[id]/`, `sources/[source]/`, `sources/osha-scs/[part]/`
- 단순 정적 페이지는 `page.mdx` 직접 사용 (about, cleanroom 등).
- **MDX 동적 렌더링**: 동적 라우트에서는 MDX를 직접 import할 수 없어 **로더 레지스트리**를 쓴다 — `src/lib/chaptersMdx.tsx`(`loadChapterMdx`), `oshaMdx.tsx`, `processMdx.tsx`. 새 MDX 추가 시 해당 레지스트리에 항목 등록 필요.
- MDX 커스텀 컴포넌트는 `mdx-components.tsx`의 `useMDXComponents`에 전역 등록 (`LayeredExplain`, `Term`, `Callout`, `SourceQuote`, `ProcessDiagram` 등).
- **자체 도해 세트** `src/components/diagram/` 12종(`LayerStack`·`CompareCards`·`FlowSteps`·`NodeGraph`·`TruthTable`·`ValueBars`·`TreeBranch`·`LatticeDiagram`·`CurvePlot`·`Timeline`·`ScaleRuler`·`LabeledFigure`) — 전부 **서버 컴포넌트**(JS 번들 무증가), 색은 `tokens.ts`에서만. 원문 이미지를 베끼지 않고 개념·수치만 근거로 그린다. 사용 규약: `docs/02-design/features/diagram-component-set.usage.md`

## 핵심 콘텐츠 패턴: 3단 레이어

모든 어려운 개념은 `LayeredExplain` 컴포넌트로 3단 구성: **Hook**(한 줄) → **Easy**(비유·일러스트) → **Deep**(원본 학술 표현, 접기/펼치기). 새 설명을 쓸 때 이 구조를 따른다.

## 배포 / 설정

- **Vercel**: main push 트리거. `output: 'export'`·`.github/workflows/deploy.yml`은 **없다** — 과거 GitHub Pages 배포 시절의 흔적이 문서에 남아 있었으나 2026-08-10에 정정했다.
- **미들웨어**: `src/middleware.ts`가 세션 쿠키로 전 경로를 보호한다(로그인 게이트). 이것이 정적 export를 쓸 수 없는 이유다. 로컬에서 페이지를 확인하려면 먼저 `/login`을 거쳐야 한다.
- **basePath**: `next.config.mjs`가 `NEXT_PUBLIC_BASE_PATH` env로 주입 (미설정 시 빈 문자열). 링크/asset 경로는 이 basePath를 가정해야 한다.
- **SEO**: `src/lib/seo.ts`의 `buildMetadata`로 페이지 메타 생성 (basePath·SITE_URL 반영). 각 동적 라우트는 `generateMetadata`에서 호출.
- `images: { unoptimized: true }`, `trailingSlash: true`.
- import 별칭: `@/*` → `src/*`.

## PDCA 워크플로우 (docs/)

이 저장소는 bkit PDCA 문서 규약을 따른다: `docs/01-plan/`, `docs/02-design/`, `docs/03-analysis/`,
`docs/04-report/`, 완료분은 `docs/archive/`. 기능 작업 시 Plan/Design 문서를 먼저 확인·작성한다.
