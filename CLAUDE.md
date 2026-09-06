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

npm run verify:diagram      # 도해 관문 C-1~C-20 (5웨이브 · 도해 489건 전량) — 브라우저 없이, 약 1.7초
npm run verify:render       # 도해 렌더 심층 검증 (브라우저·서버·자격증명 필요, 약 1.8분)
npm run verify:render -- --self-test   # 렌더 대조군만 (Chrome만 필요 · 약 25초) — 개수는 실행이 스스로 말한다
npm run audit:wiring        # 렌더 관문 **배선 감사** — 관문이 아니라 관문을 재는 자 (약 7~8분 · 실행이 소요를 찍는다)

npm run verify:links        # 문서 링크 관문 — 링크·이미지·JSX 속성 대상 실재 (개수도 소요도 실행이 찍는다)
npm run verify:links:self   # 문서 링크 대조군만
```

테스트 러너는 없다. 검증은 `typecheck` + `lint` + 빌드 스크립트의 자체 검증 + **도해 관문** + **문서 링크 관문**으로 한다.

**문서를 옮기거나 링크를 고치면 `npm run verify:links`를 돌린다.** `.md`·`.mdx` 전량에서
마크다운 **링크·이미지**와 **JSX/HTML의 `src=""`·`href=""`** 를 뽑아 대상이 실재하는지 본다
(자산 출처의 절대 경로는 라우트가 아니라 `public/` 자산이다 — 그쪽이 대부분이다). 종료 코드는 도해 관문과 같은 계약이다 — `1`은 **대상이 없다**, `2`는 **검사기가 자기 범위를
주장할 수 없음**이다. ★**자리를 여기 열거하지 않는다** — 그 목록이 **세 번 낡았고**, 두 번은
*"고쳤다"* 고 적힌 뒤였다. 소스에게 물어라: `rg 'fail\(|process\.exit\(2\)' scripts/verify-doc-links.mjs`.
각 자리가 **자기 사유 문자열**을 들고 있고 그것이 유일한 진실이다.

**★판정은 정규식이 아니라 파서(`remark-parse` + `remark-gfm`)가 한다.** 착수 실측에서 정규식은
사고 링크 후보를 넷 올렸는데 파서가 인정한 것은 하나였다 — 나머지는 목적지에 공백이 있어
CommonMark상 링크가 아니다. **거짓 경보투성이 관문은 곧 무시된다.** `remark-mdx`는 안 쓴다 —
`.mdx`에서 링크 집합 차이가 **0**인데 `.md` 여럿을 파싱 실패시킨다. 그 대신 `.mdx`의 JSX가
`html` 노드로 와서 **`src=""`·`href=""` 속성을 볼 수 있게 된다** — 살아 있는 페이지의 이미지는
여러 줄 `<ImageFigure … src="/…" />` 꼴이고, 절대 경로를 `public/`으로 푸는 근거는
`src/components/content/ImageFigure.tsx`의 계약이다.

**★allow 파일이 없다 — 일부러 없다.** 도해 관문에는 `diagram-check-allow.json`이 있는데 여기 없는
이유는 **필요가 0으로 측정됐기** 때문이다: 문서가 링크를 *설명하는* 자리는 거의 언제나 백틱 안이고
**파서가 코드 스팬을 건너뛴다.** 진짜로 예시를 쓰려면 백틱으로 감싼다 — **우회로가 공짜다.**
필요가 생기면 그때 만들고 그 diff가 근거가 된다.

**라우트는 `src/app`에서 유도한다** — `page.*`와 `route.*` 둘 다에서, 동적 세그먼트는 **해석기 등록제**로
푼다(등록된 것은 실행이 찍는다). **해석기가 없는 동적 라우트로 가는 링크는 조용히 통과시키지
않고 `exit 2`다** — 렌더 관문의 δ와 같은 처분이다. 새 동적 라우트에 링크를 걸면 관문이 먼저 운다.

**★해석기는 앱의 원천에서 푼다 — 미러를 만들지 않는다.** JSON에서 오는 것과 **`tsx`로
`src/lib/sources.ts`를 그대로 평가**해서 오는 것이 있다(각각 몇인지는 실행이 찍는다). `.mjs`가 TS를 못 읽는다는 이유로
**세 번째 수동 미러**를 만드는 대신, 앱이 `generateStaticParams`에서 쓰는 **바로 그 함수**를 부른다.
`tsx`는 관문 자신의 위치에서 푼 절대 경로로, **한 번만·필요할 때만** 뜬다(그 템플릿이 트리에 없으면
아예 안 뜬다 — 대조군이 안 무거워진다). 열거에 실패하면 `exit 2`다.
**선**: 이 관문은 라우트를 **열거**할 수 있는지만 본다 — 앱 데이터의 **내용**은 안 본다.

**★대조군의 "미등록 예시"는 합성 템플릿이다**(`합성/[없는것]`). 실제 라우트 이름을 빌리면
그 템플릿이 등록되는 순간 그 대조군이 **조용히 무너진다** — 실측으로 확인하고 바꿨다.
*장치를 세우면 그 장치가 무대조군이 되고, **장치를 늘리면 옛 장치가 무력해진다.***

**안 보는 것과 미등록 동적 템플릿은 성공 출력이 스스로 말한다** — 여기 옮겨 적지 않는다.
대조군 하나가 사유 정규식으로 **그 출력**을 관측한다(문서를 관측하는 것이 아니다 —
목록을 두 곳에 두면 한 곳만 고치게 되고, 지키는 자 없는 자리에 "지킨다"고 적히게 된다).

**도해를 추가·수정하면 `npm run verify:diagram`을 돌린다.** C-1~C-20과 자체검사 대조군 69건이 들어 있고,
자체검사가 실패하면 본 검사를 실행하지 않고 `exit 2`로 끝낸다(검사기가 눈먼 채로 통과를 내지 않게).

**종료 코드는 계약이다** — `0` 통과 · `1` **콘텐츠 위반** · `2` **검사기가 자기 범위를 주장할 수 없음**
(`theme.css`·`tokens.ts`·`globals.css`를 못 읽음 · 콘텐츠 루트 부재 · 미등록 자료원 · **등록된 자료원의
디렉터리 부재** · `idPrefix` 전역 중복 · 자체검사 실패). `--all` 부모는 `2`를 중단 신호로 보고 즉시
멈춘다. 대조군 **8건**이 자식 프로세스로 이 처분을 종료 코드와 사유 문자열까지 확인한다.
`--assert-only`는 시작 단언만 돌리고 끝낸다 — **본 검사를 건너뛰므로 관문 대용으로 쓰지 않는다.**

**범위** — 전 자료원이 `WAVES`에 등록돼 있다(w0 `first-semiconductor` · w1 · w2 · w3 · w4 — 총계는 위
명령어 표에 있고 실행이 웨이브별로 찍는다). 새 자료원을 만들고 등록하지 않으면 조용히 빠지지 않고 **`exit 2`** 다(D-10 시작 단언).
`C-18`(최소 폭 계약)·`C-19`(대비)는 컴포넌트·토큰 단위라 자료원과 무관하게 전량을 지킨다.

**정적 검사가 일부러 보지 않는 자리가 셋 있다** — `LabeledFigure`의 자식(저작자 인라인 SVG) · `viewBox` ·
`ScaleRuler.refs`. 각각의 이유와 "대신 무엇이 지키나"는
`docs/02-design/features/diagram-component-set.usage.md` §2.1.1d에 있다. 넷째를 만들려면 그 표에 줄을 더한다.

**`verify:render`도 자체검사를 갖는다** — 대조군이 세 무리다: **판정**(`page.setContent()`로
만든 도해에 판정 함수를 그대로 먹인다) · **범위**(순수 함수 `scopeStatic()`·`scopeViolations()`) · **처분**(자식
프로세스를 임시 cwd에서 돌려 종료 코드와 사유를 본다 — **대부분은 가짜 도해 트리를 소유**해
저장소 상태와 무관하고, **⑳·㉛ 둘만 실제 트리**를 써서 *"유도 규칙이 실제 컴포넌트에서 도는가"*(R2)를 지킨다).

**★무리별 개수는 여기 안 적는다** — `--self-test`가 **스스로 단언하고 출력한다**
(`대조군 판정 N · 범위 N · 처분 N — 선언과 일치`). 어긋나면 `exit 2`이고, **무리 사이의 이동**까지
잡는다(**판정 하나가 줄고 처분 하나가 늘면 총계는 그대로다**). 문서가 수를 되풀이하면 **또 표류한다** —
실제로 `35→36`이 됐을 때 두 사이클 동안 그랬다. **판정을 순수 함수로 뽑으면 대조군이 싸지지만
그 함수를 부르는 자리(배선)가 무대조군이 된다** — 처분 무리가 그 자리를 덮고, `npm run audit:wiring`이
호출부 인자와 **판정 규칙**을 하나씩 훼손해 몇이 덮이는지 **두 수로 따로** 센다 —
현재 **배선 12/12 · 규칙 5/5(+가드 7/7)**. 가드는 *대조군이 잡을 수 없는* 훼손이다(부모가 모듈
적재 때 죽는다) — **덮을 수 없는 것을 덮었다고 세면 수치가 거짓말을 한다.**
**서버도 자격 증명도 필요 없어** `--self-test`만 따로 돌릴 수 있다. 본 검사 앞에서 먼저 돌고 실패하면
본 검사를 실행하지 않는다(`exit 2`). **대조군을 하나 더하는 비용은 자체검사 한 번이 아니라
`자체검사 한 번 × 감사 항목 수`다** — 감사가 항목마다 자체검사를 통째로 다시 돌리기 때문이다.

**소요·개수는 위 명령어 표에만 적는다** — 수치를 두 곳에 적으면 한 곳만 고치게 된다.
**예외는 기계가 대조하는 수뿐이다**(바로 위의 배선·규칙 수치가 그렇다 — 감사가 이 줄을 읽어
자기 실측과 대조하고, 어긋나면 `exit 2`다). 사람만 지키는 수는 여기 두 번 적지 않는다.
실제로 이 절이 표와 다른 값을 갖고 두 사이클을 살아남았다(`아홉 중 여덟`).

**검사 범위에는 하한이 있다** — 도해가 `data-diagram`으로 자기 종류를 DOM에 남기고, 관문이 **파일시스템
유도(기대)** 와 **실제 렌더(관측)** 를 **네 방향**으로 대조한다: α(유도에 있는데 안 그려졌다) · β(그려졌는데
파일이 없다) · γ(배럴은 아는데 파일이 없다) · **δ(이 종을 쓰는 페이지가 검사 목록에서 빠졌다)**.
어긋나면 `exit 2`. 여기에 **브라우저를 띄우기 전에** 아는 넷이 더 붙는다 — ε(파일은 있는데 배럴이
안 내보낸다) · α₀(유도는 SVG로 보는데 어느 MDX도 안 쓴다) · σ(도해가 있는 MDX인데 URL 규칙이 없다) ·
**η(두 유도가 어긋난다** — `'<svg'`가 고른 것과 `<text`가 고른 것이 다르면 그 종을 δ의 대상으로 볼지
검사기가 모른다. **실제 컴포넌트의 분류를 서버 없이 주장하는 자리**이고, 유도 규칙이 실제 종 하나만
놓쳐도 여기서 운다. 다만 두 신호가 **함께** 사라지면 조용하다 — 그 잔여는 관측만 본다**)**. 여기에 **ζ(표본)** — 비SVG로 분류된 종마다 페이지 하나를 검사에 넣어 **관측을 만든다**(없으면 δ가 그 종을 영영 못 본다 · 비용 +1페이지).
**δ가 없으면 헛것이다** — `LayerStack`을 유도에서 빼면 92→56페이지로 줄어드는데
α·β·γ는 조용했다(남은 페이지에 함께 있어 관측에는 나온다). 실측 근거는
`docs/archive/2026-08/render-gate-scope-floor/`.

**★감사(`audit:wiring`)는 도중에 볼 수 없다.** 그 파일(`scripts/verify-diagram-render.mjs`)을
훼손·원복하며 돌기 때문에, **감사가 도는 동안 그 파일에 대해 아무것도 돌리지 않는다** — 그 사이의
관문 결과는 소스가 아니라 **순간**을 잰다. 그리고 **감사는 죽이지 않는다**: 전 구간이 동기라
`SIGINT`·`SIGTERM`도 본문 중에는 안 먹고(`timeout`도 마찬가지다), `kill -9`는 원복을 건너뛰어
**소스가 훼손된 채 남는다.** 끝났는지는 파일이 아니라 프로세스로 묻는다:

```bash
while pgrep -f audit-render-wiring; do sleep 5; done
node scripts/verify-diagram-render.mjs --self-test   # 소스가 온전한지 먼저
```

감사 시작에 **고아 백업 감지**가 있다 — 원복 못 하고 끝난 실행이 있으면 알려 준다(자동 원복은 하지 않는다).

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
