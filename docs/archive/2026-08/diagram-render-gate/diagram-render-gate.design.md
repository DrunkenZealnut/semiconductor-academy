# 도해 렌더 계약 관문 — Design

> **Status**: Design
> **Plan**: `docs/01-plan/features/diagram-render-gate.plan.md`
> **Feature**: `diagram-render-gate`
> **선행**: `diagram-expansion` §4.6 · `verify-diagram-placement.mjs` C-1~C-17 + 자체검사 25
> **확정 상속**: D-1 관문 성격=둘 다 · D-2 강제 지점=npm 스크립트 · D-4 임계값=AA 4.5 · D-5 `playwright-core` devDep

---

## 0. Plan 정정 2건

Design 착수 시 Plan의 사실 하나가 틀렸고, 그것이 핵심 결정을 뒤집었다.

### 0.1 `badge`는 "사용 0건"이 아니라 14건이다

Plan §3은 `NodeGraph`의 badge를 "콘텐츠에서 사용 0건"이라 적었다. **틀렸다.** `badge`는 prop이 아니라 노드 라벨의 접두어를 정규식으로 뽑는 파생값이다.

```js
const DEVICE_PREFIX = /^(nmos|pmos|R|C|D):\s*/;
const m = DEVICE_PREFIX.exec(n.label);
const badge = m?.[1];
```

MDX에서 `badge:`로 세면 0이 나오지만, `label: 'R: 저항'` 형태로 **14건** 쓰이고 전부 `kind: 'device'`다(`019-cmos`·`028-not-gate`·`043-dram`·`044-sram` 등). G-9 브라우저 측정이 잡은 `TEXT_MUTED` "R" 4.01이 정확히 이것이었다 — 그때 이미 실물을 봤는데 Plan에서 계수를 틀렸다.

**실제 대비는 통과한다**: `TEXT_MUTED` on `NODE_KIND.device`(violet-100 / violet-950) = 라이트 6.36 · 다크 5.79.

### 0.2 그래서 D-3(발생 기반)이 뒤집힌다

`io` 조합(3.84)은 **지금 발생하지 않는다**. 발생 기반으로 조합을 고르면 이 조합은 검사에서 빠지고, 저작자가 `{ label: 'R: 접점', kind: 'io' }`를 쓰는 순간 **조용히 깨진다.** 컴포넌트를 한 줄도 안 고쳐도 콘텐츠만으로 깨진다.

> **콘텐츠가 결정하는 조합은 '발생'이 아니라 '가능성'으로 봐야 한다.** 발생 기반 검사는 콘텐츠가 바뀌는 순간 무효가 되고, 그 무효화는 아무 신호도 내지 않는다.

이것이 §1 D-9다. Plan §2.2의 D-3은 정정 표시를 달아 두었다.

---

## 1. 결정

### D-8 · C-18은 식 비교가 아니라 **`svgBox()` 헬퍼 사용 검사**로 한다

Plan §7이 "`minWidth: DIM.width` vs `viewBox={\`0 0 ${DIM.width} …\`}` 식 비교는 오탐·누락 둘 다 낸다"를 위험으로 올렸다. 비교를 정교하게 만드는 대신 **비교가 필요 없게** 만든다.

```ts
// tokens.ts
/**
 * SVG 도해의 크기 계약을 한 곳에서 만든다. viewBox와 minWidth가 **같은 인자에서** 나오므로
 * 둘이 어긋나는 상태를 만들 수 없다 — 검사기는 이 헬퍼를 썼는지만 본다(C-18).
 * `fixed`는 좌표계보다 좁게 그려야 하는 도해용(LatticeDiagram — viewBox를 잘라 쓴다).
 */
export function svgBox(viewBox: string, opts?: { fixed?: boolean }) {
  const w = Number(viewBox.trim().split(/\s+/)[2]);
  const width = Number.isFinite(w) && w > 0 ? w : DIM.width;
  return {
    viewBox,
    style: opts?.fixed ? { width, minWidth: width } : { minWidth: width },
  };
}
```

적용:

```tsx
<svg {...svgBox(`0 0 ${DIM.width} ${totalH}`)} className="h-auto w-full" role="img" …>
```

이 방식의 값은 `diagram-set-finishing`의 `<desc>` 자동 생성과 같다 — **저작자 입력 0 · 누락 구조적 불가.** 거기서는 prop으로 받으면 131개에 일일이 써야 하고 누락이 생긴다는 이유로 자동 생성을 택했다. 여기서도 같은 논리다: 6곳에서 각자 맞추게 하면 어긋날 수 있고, 한 곳에서 만들면 어긋날 수 없다.

부수 효과로 **CodeRabbit이 지적한 유한·양수 가드가 한 곳으로 모인다**(지금은 `LabeledFigure`에만 있다).

**C-18 판정** — SVG를 그리는 컴포넌트(`<svg` 를 포함하는 `src/components/diagram/*.tsx`)마다:

| 충족해야 하는 상태 | **어길 때** 나오는 실패 문구 |
|---|---|
| `<svg` 태그에 `{...svgBox(` 스프레드가 있다 | `{Name}: svgBox()를 쓰지 않는다 — viewBox와 minWidth가 어긋날 수 있다` |
| `<svg` 여는 태그에 `viewBox=`가 없다(스프레드와 중복 금지) | `{Name}: viewBox를 svgBox() 밖에서 또 넘긴다` |
| `<svg` 여는 태그에 `style=`이 없다 | `{Name}: style을 svgBox() 밖에서 또 넘긴다 — minWidth를 덮어쓴다` |
| 파일 어디에도 `minWidth`를 직접 쓰지 않는다 | `{Name}: minWidth를 손으로 쓴다 — svgBox()로 옮겨라` |
| `DiagramFrame`에 `scrollable`을 넘긴다 | `{Name}: scrollable을 넘기지 않아 좁은 화면에서 프레임을 넘친다` |

**다섯 조건 모두 문자열 존재/부재**라 정규식 오탐 여지가 낮다. 식을 해석하지 않는다.

> 왼쪽 열은 **충족 상태**이고 오른쪽은 그것을 어길 때의 문구다 — 구현(`checkSvgBoxContractIn`)은 예컨대 `viewBox=`가 **있을 때** 위반을 올린다. 표만 읽고 판정 방향을 거꾸로 이해하지 않도록 헤더를 고쳤다(2026-08-13).

> **2026-08-13 Do 정정 2건.**
> ① 초판은 조건이 **넷**이었다. `style=` 중복 조건을 Do에서 더했다 — JSX는 뒤에 오는 명시 속성이 이기므로(§7 위험) `style={{ maxWidth: … }}`를 뒤에 주면 `svgBox()`의 `minWidth`가 **통째로 사라진다**. `minWidth` 문자열 검사만으로는 이 경우를 못 잡는다.
> ② `viewBox` 중복 검사를 **`<svg` 여는 태그 범위로 한정**했다. 초판 구현은 `viewBox="0 0 8 8"`(NodeGraph의 `<marker>`)를 리터럴로 지우고 검사했는데, 그것은 **마커 좌표가 바뀌면 오탐하는 새 미러**다(G-5 위반). JSX라 `{...}` 안에 `>`가 들어갈 수 있어 중괄호 깊이를 세며 태그 끝을 찾는다(`svgOpenTags`).

### D-9 · C-19의 조합은 **가능성 기반**, 단 **토큰이 결정하는 것만**

두 축으로 나눈다.

| 무엇이 조합을 결정하나 | 예 | 누가 검사하나 |
|---|---|---|
| **토큰** — 컴포넌트가 `TONE`/`NODE_KIND`/`TEXT`를 조합해 그린다 | `LayerStack` 층 라벨(`TEXT`)이 층 채움(`TONE`) 위에 | **C-19 (정적 관문)** |
| **좌표** — 무엇이 글자 밑에 오는지가 위치로 결정된다 | `NodeGraph` 간선 라벨이 노드를 지나가는지 · `LabeledFigure`의 저작자 라벨 | **브라우저 심층 검증** |

C-19가 검사하는 **닫힌 집합**:

| # | 배경 | 글자 | 근거 (컴포넌트 구조) |
|:--:|---|---|---|
| ① | `TONE[*]` 13종 | `TEXT` | `LayerStack` 층 라벨(L196·L239) · `LatticeDiagram` 원자 라벨(L125·L159)이 채움 위에 놓인다 |
| ② | `NODE_KIND[*]` 3종 | `TEXT` | `NodeGraph` 노드 라벨(L169)이 노드 채움 위에 |
| ③ | 프레임 배경 — `globals.css`의 `body`(라이트 `white` / 다크 `#0a0a0a`) | `TEXT`·`TEXT_MUTED` | 나머지 전부 — 주석·축 이름·눈금·간선 라벨 |

= 13×2 + 3×2 + 2×2 = **36 조합**(실측 출력과 일치). `TONE[*] × TEXT_MUTED`(26)는 **제외**한다 — 근거:

- `LayerStack`의 `TEXT_MUTED` 2곳은 층 밖이다 — 밴드 에너지 축의 `E`(`x = DIM.pad + 14`, 화살촉 옆)와 층 오른쪽 주석 열(`x = x2 + 6`)
- `LatticeDiagram`의 `TEXT_MUTED` 1곳(L169)은 격자 아래 설명문(`y = height − 8`, `LABEL_H`로 자리를 확보한 그 문장)
- `ScaleRuler`·`CurvePlot`의 `TEXT_MUTED`는 눈금·축 이름·참조점으로 채움이 없는 영역(`CurvePlot`의 곡선은 `fill="none"`)

> **★2026-08-13 Check 정정 — 이 제외의 근거가 한 번 틀렸다(H-1).**
> 초판은 "`LayerStack`의 `TEXT_MUTED` **3곳**이 전부 층 밖"이라 적었다. 셋째는 `<defs>` 안
> `<pattern>`의 마크 글리프(`+`/`−`)였고 **`x={4} y={12}`를 좌상단 축 라벨로 잘못 읽었다** —
> 그것은 16×16 패턴 타일 안의 좌표이고, 패턴은 층 rect 위에 같은 기하로 덮인다(L179–188).
> 즉 배경이 tone 채움이었다. 실측 미달 3건: `silicon-p-heavy` 라이트 **3.94** · 다크 **3.01** ·
> `silicon-n-heavy` 다크 **2.86**. 8건 5모듈에서 실제로 렌더되고 있었다.
> 마크는 "색만으로 구분하지 않는다"를 이행하는 **색각 이상 대비 장치**라 읽히지 않으면 그 장치가
> 무력해진다 → 글리프를 `TEXT`로 옮겼다(6.86~14.28).
>
> **손으로 읽어 틀린 판단을 기계 규칙으로 바꿨다** — `checkPatternTextClass()`가
> `<pattern>` 안 글자가 `TEXT_MUTED`인지 본다. 개수만 보는 D-12 스냅샷은 이것을 못 잡았다
> (개수는 3 그대로였다). 대조군(양성·음성)도 함께 붙였다.

### D-10 · 좌표가 결정하는 대비는 정적 관문에서 **배제**하고 브라우저에 맡긴다

`LabeledFigure`를 과대근사하면 규모가 이렇다 (실측):

| 모듈 | 라벨 | 서로 다른 `fill-*` | 과대근사 조합 |
|---|:--:|:--:|:--:|
| `080-finfet` | 4 | 6 | 24 |
| `055-cz-growth` | 5 | 8 | 40 |

그중 `TEXT_MUTED`와 4.5 미달인 채움이 **8종**이다(`brand-500` 라이트 2.06 · 다크 1.40 · `slate-500` 라이트 1.59 · `slate-400` 다크 1.00 등). 즉 최대 **64건의 검토 대기**가 2모듈에서 나오고 대부분 거짓이다 — 위쪽 라벨은 아래쪽 웨이퍼 채움 위에 없다.

> **저작자 인라인 SVG는 `tokens.ts`를 우회한다.** 두 모듈이 `fill-sky-100`·`fill-violet-200`·`fill-amber-200/70`·`fill-brand-500`·`fill-brand-500/30` 등을 MDX에 직접 쓴다.
> **★2026-08-13 Check 정정**: 초판은 "C-6이 통과하는 이유는 hex가 아니라 Tailwind 클래스라서"라고 적었다. **거꾸로다** — C-6은 `/(?:fill|stroke)-[a-z]+-\d{2,3}/`로 hex가 아니라 **Tailwind 클래스만** 본다. 통과하는 진짜 이유는 그 2모듈이 `first-semiconductor`이고 이 자료원이 `WAVES`에 **없어서** C-1~C-17 범위 자체에 안 들어간다는 것이다(§8 백로그).

브라우저 계측기는 이 문제를 이미 푼다 — G-9의 `measure-contrast.mjs`는 글자 bbox 중심을 포함하는 **가장 작은 rect**를 찾아 그 채움을 배경으로 삼았다. 좌표를 실제로 알기 때문이다. 그래서 경계를 이렇게 그린다:

**정적 관문은 토큰이 결정하는 것을, 브라우저는 좌표가 결정하는 것을 본다.** 이것이 D-1("둘 다")의 실질이다 — 두 층은 중복이 아니라 분업이다.

### D-11 · 예외 키는 가짜 자료원 접두어를 쓴다

기존 형식은 `{자료원}/{모듈}::{검사}::{식별자}`인데 C-18·C-19는 컴포넌트·토큰 단위라 자료원이 없다. 검사기의 조회는 단순 객체 키 조회(`ALLOW[key]`)라 형식이 자유롭다. 첫 칸이 네임스페이스로 읽히도록 다음을 쓴다.

```
_component/LayerStack::C-18::scrollable
_token/TONE.metal::C-19::TEXT@dark
```

`_`로 시작하면 `diagram-check-allow.json`의 기존 주석 키(`_c1`·`_c7` 등)와 정렬이 맞고, 자료원 이름과 절대 충돌하지 않는다.

### D-12 · `TEXT_MUTED` 사용처 스냅샷을 트립와이어로 둔다

D-9의 제외(`TONE × TEXT_MUTED`)는 **지금의 컴포넌트 구조**에 기댄다. 누가 `TEXT_MUTED`를 층 안에 쓰면 그 전제가 깨지는데 아무 신호도 안 난다. 그래서 C-19에 사용처 수 스냅샷을 붙인다.

| 컴포넌트 | 현재 `TEXT_MUTED` 사용처 |
|---|:--:|
| `LayerStack` | 2 |
| `CurvePlot` | 4 |
| `NodeGraph` | 1 |
| `ScaleRuler` | 2 |
| `LatticeDiagram` | 1 |
| `LabeledFigure` | 1 |
| **계** | **11** |

> 초판은 `LayerStack` 3 · `NodeGraph` 2 · 계 13이었다. Do·Check에서 둘을 `TEXT`로 옮겼다 —
> badge(노드 안)와 `<pattern>` 마크 글리프(층 채움 위). **둘 다 채움 위에 있었다.**
> 그래서 계는 13 − 2 = **11**이다. 이 표를 처음 갱신할 때 12로 적었다 — 또 손으로 셌다.
> 검사기 출력(`grep -c 'className={TEXT_MUTED}'`)이 단일 출처다.

수가 달라지면 실패하고, 문구가 "새 `TEXT_MUTED` 사용처가 생겼다 — 채움 위에 놓이는지 확인하고 스냅샷을 갱신하라"가 된다. 스냅샷은 사람의 판정을 **강제**하는 장치다. `diagram-check-allow.json`이 "이유를 적게 강제"하는 것과 같은 성격이다.

### D-13 · Plan D-6·D-7 처방

| Plan 결정 | Design 처방 |
|---|---|
| **D-6** `TEXT` on `metal`(다크) 4.40 | **`metal`을 `zinc-400 dark:zinc-600`으로** 제안한다(지금 `zinc-400 dark:zinc-500`). tone 13종 중 유일하게 다크가 라이트보다 밝은 것은 '금속 광택' 의도로 보이나, 한 단계만 내리면 4.5를 넘고 여전히 다른 tone(대부분 900/950번대)보다 밝아 금속성이 유지된다. **Do에서 실물을 보고 확정**한다 — G-9로 남긴다 |
| **D-7** 브라우저 스윕 범위 | **SVG 92페이지 × {375, 1440}** 로 시작한다(≈3분. 초판은 94라 적었는데 `part-2.ko`·`part-4.ko`가 본 라우트로 접혀 92다). D-10이 브라우저에 좌표 판정을 맡기므로 `LabeledFigure` 2모듈은 반드시 포함된다. 253모듈로 넓히는 것은 HTML 계열 대비가 범위 밖(Plan §8)이라 이득이 적다. `next start`에서 재측정해 3분이 크게 줄면 재고 |

---

## 2. C-19 구현 설계

### 2.1 색 해석 파이프라인 (하드코딩 미러 0 — G-5)

```
tokens.ts        TONE[*].fill · NODE_KIND[*] · TEXT · TEXT_MUTED · CARD  ← 클래스 문자열
   ↓ 클래스에서 light/dark 갈래 추출 ('fill-teal-50 dark:fill-teal-950')
theme.css        --color-{family}-{shade}: oklch(...)   ← Tailwind v4 팔레트 288색
globals.css      --color-brand-{shade}: #rrggbb          ← 프로젝트 색
   ↓ oklch → oklab → 선형 sRGB (색역 클램프)  /  hex → 선형 sRGB
   ↓ alpha 합성 (brand-500/20 처럼 투명도 있는 채움을 프레임 배경 위에 올린다)
WCAG 상대휘도 → 대비비
```

세 파일 모두 **읽는다**. 값을 스크립트에 옮겨 적지 않는다 — CLAUDE.md가 관리하는 수동 미러 2개를 늘리지 않는다는 것이 G-5다.

`theme.css`를 못 읽으면 **`exit 2`** 로 끝낸다. 색을 못 읽는 것은 '통과'가 아니다(Plan §7).

### 2.2 대조군 (FR-3)

| 종류 | 내용 | 기대 |
|---|---|---|
| **음성 ×12** | G-9 브라우저 실측 12쌍(§Plan 1.2) | 계산값이 실측과 ±0.1 안 |
| 양성 ① | `TONE`에 `fill-slate-400 dark:fill-slate-400` 주입 | `TEXT` 다크 조합 미달 검출 |
| 양성 ② | `TEXT_MUTED`를 `slate-200 dark:slate-800`으로 | 프레임 조합 미달 검출 |
| 양성 ③ | `TEXT_MUTED` 사용처를 1곳 추가 | 스냅샷 불일치 검출 (D-12) |
| 양성 ④ | 한 컴포넌트에서 `{...svgBox(` 제거 | C-18 검출 |
| 양성 ⑤ | 한 컴포넌트에서 `scrollable` 제거 | C-18 검출 |
| 양성 ⑥ | `minWidth`를 손으로 쓴 코드 추가 | C-18 검출 |
| 양성 ⑦ | `<svg`에 `style={{ maxWidth }}` 추가 | C-18 검출 (Do에서 추가한 조건) |
| 양성 ⑧ | `<svg`에 `viewBox="0 0 1 1"` 추가 | C-18 검출 · 마커의 viewBox는 오탐하지 않음 |

음성 12쌍을 대조군에 **고정**하는 이유: 정적 계산이 브라우저와 갈리는 것이 이 설계의 최대 위험인데, 갈리면 자체검사가 먼저 깨진다. 계산식을 손대면 대조군 12개가 즉시 반응한다.

자체검사 총계 **25 → 38**(실측).

> **2026-08-13 Do 실증 — 대조군이 무효해지는 것을 대조군이 잡았다.**
> 조합 집합에서 ③(`NODE_KIND × TEXT_MUTED`)을 빼자 양성 ②("`TEXT_MUTED`를 옛 `slate-500`으로 되돌림")가 **아무것도 검출하지 못했다** — `slate-500`은 남은 조합(프레임 배경)에서 4.76으로 통과한다. **본 검사는 그대로 통과하는데 자체검사가 먼저 실패했다.** 프레임 조합을 실제로 건드리는 값(`slate-200 dark:slate-800`)으로 교체했다.
>
> 교훈: **검사 범위를 줄이면 대조군도 함께 다시 봐야 한다.** 범위를 넓힐 때 대조군을 더하는 것은 자연스럽지만, 줄일 때 기존 대조군이 무효해지는 것은 눈에 띄지 않는다.

---

## 3. npm 스크립트 (FR-4·FR-5)

```json
"verify:diagram": "node scripts/verify-diagram-placement.mjs --all",
"verify:render":  "node scripts/verify-diagram-render.mjs"
```

`--all`을 새로 만든다 — 지금은 `--wave`·`--plan`을 손으로 넘겨야 하고, 그래서 아카이브 작업 중 **`--plan` 없이 돌려 W4가 전수 판정으로 오판된 일이 있었다**(그 자리에서 발견해 고쳤다). `--all`은 4웨이브를 각자의 배치표와 함께 돌고 하나라도 실패하면 non-zero.

`verify:render`는 **서버를 띄우지 않는다.** 이미 떠 있으면 붙고, 없으면 다음처럼 끝낸다.

```
❌ localhost:3016 에 연결할 수 없다. 먼저 `npm run dev`(또는 `npm run start`)를 띄워라.
```

자동 기동을 안 하는 이유: 포트·빌드 상태·`predev` 재실행이라는 부작용을 검사기가 만들면 안 된다.

자격 증명(G-7): `process.env.SITE_AUTH_ID`·`SITE_AUTH_PASSWORD`만 읽는다. 값을 로그·인자·에러 메시지에 넣지 않는다. 미설정 시 `.env.local`을 직접 파싱하지 않고 **안내만** 한다 — 파일을 읽으면 값이 스크립트 메모리를 지나 로그에 새기 쉽다.

---

## 4. 브라우저 심층 검증 구조 (FR-5)

G-9 스크립트 6개를 하나로 합친다. `scripts/verify-diagram-render.mjs`

| 계측 | G-9 출처 | 판정 |
|---|---|---|
| 실효 글자 크기 | `measure-text.mjs`·`sweep.mjs` | `렌더 폭 / viewBox 폭` 배율 × `font-size` ≥ 9px |
| 페이지 가로 넘침 | `sweep.mjs` | `documentElement.scrollWidth > clientWidth` 0건 |
| **좌표 기반 대비** | `measure-contrast.mjs` | 글자 bbox 중심을 포함하는 최소 rect의 채움을 배경으로 → ≥ 4.5 (**D-10의 몫**) |
| 마커 참조 정합 | `check-markers.mjs` | `marker-end`가 가리키는 id가 존재하고 중복 0 |

`playwright-core`는 `channel: 'chrome'`으로 설치된 Chrome을 쓴다(하드코딩 경로 금지 — G-9 스크립트는 macOS 경로를 박아 뒀다). 브라우저 바이너리는 내려받지 않는다.

`nextjs-portal`(dev 오버레이) 제거와 `scroll-behavior: auto` 주입은 유지한다 — 둘 다 G-9에서 계측을 막았던 실제 장애물이다.

---

## 5. 게이트 매핑 (Plan §5 ↔ Design)

| 게이트 | 이 Design의 어디가 충족하나 |
|:--:|---|
| G-1 typecheck·lint | `svgBox` 도입이 6컴포넌트를 건드리므로 재실측 |
| G-2 C-1~C-19 통과 | `npm run verify:diagram` (§3) |
| G-3 대조군 27+ | §2.2 — **38**(실측) |
| G-4 **2건 검출** | Do에서 실측 검출 확인(`TONE.metal` 4.40 · `NODE_KIND.io` 3.84). 그 뒤 둘을 고쳐 지금은 0건이다 — 검출 사실은 이 Design §0.3과 코드 주석(`tokens.ts` `metal` · `NodeGraph` badge)에 남긴다 |
| G-5 하드코딩 미러 0 | §2.1 — 세 파일을 읽는다 |
| G-6 브라우저 = G-9 결과 | §4 |
| G-7 자격 증명 미노출 | §3 — `.env.local` 직접 파싱 금지 |
| G-8 번들·SSG | `svgBox`는 서버 컴포넌트 안의 순수 함수라 무증가 예상, 재실측 |
| G-9 육안 | D-13의 `metal` 다크 1종만 |

---

## 6. 구현 순서

```text
① svgBox() 신설 + 6컴포넌트 적용        → typecheck·build 확인 (D-8)
② C-19 색 파이프라인 + 음성 12쌍         → 계산이 실측을 재현하는지 먼저 (§2.2)
③ C-19 조합 집합 ①~④ + 스냅샷           → metal·io 2건 검출 확인 (G-4)
④ C-18 네 조건 + 양성 대조군 ④⑤
⑤ --all · npm 스크립트 2종
⑥ verify-diagram-render.mjs 이관
⑦ D-13 metal 판정 (실물 → 수정 또는 예외)
⑧ 문서 (usage.md §3.1 · CLAUDE.md)
```

②를 ③보다 먼저 두는 이유: 계산이 실측을 재현하지 못하면 ③ 이후가 전부 무의미하다. **판정기를 먼저 검증하고 그 다음에 판정한다** — `diagram-expansion`이 "양성 대조군 없이는 검사기를 믿을 수 없다"로 배운 순서다.

①을 맨 앞에 두는 이유: C-18이 `svgBox` 사용을 검사하므로 헬퍼가 없으면 검사를 쓸 수 없다.

---

## 7. 위험

| 위험 | 대비 |
|---|---|
| **`svgBox` 스프레드가 `className`·`role` 순서에 영향** | JSX 스프레드는 뒤에 오는 명시 속성이 이긴다. `{...svgBox()}`를 **맨 앞**에 두고 `viewBox`·`style`을 뒤에서 다시 주지 않는다(C-18 2·3번째 조건이 이것을 검사한다) |
| **`TONE × TEXT_MUTED` 제외가 언젠가 틀린다** | D-12 스냅샷이 사용처 수 변화를 잡는다. 다만 **같은 개수로 위치만 옮기면 못 잡는다** — 이 한계를 `usage.md`에 적는다 |
| **저작자 인라인 SVG가 tokens를 우회한다** | D-10에서 브라우저 몫으로 넘긴다. 다만 `LabeledFigure`가 2모듈뿐이라 브라우저 스윕을 안 돌리면 검사되지 않는다 → 후속 백로그: **C-6을 Tailwind 색 클래스까지 확장**할지 |
| **`metal` 수정이 시각 언어를 깬다** | Plan D-6 그대로 — 실물 확인 후. `zinc-600`이 다른 tone보다 여전히 밝은지가 판정 기준 |
| **`--all`이 배치표 경로를 다시 하드코딩한다** | `build-diagram-plan.mjs`의 `OUT` 상수를 재사용하도록 import하거나, 검사기가 웨이브명에서 경로를 유도한다. 세 번째 미러를 만들지 않는다 |

---

## 8. 범위 밖 (Plan §8에 추가)

- **`TEXT_MUTED` 위치 이동 검출** — D-12 스냅샷은 개수만 본다
- ~~C-6을 Tailwind 색 클래스까지 확장~~ → **전제가 틀렸다.** C-6은 애초에 hex를 보지 않고 `/(?:fill|stroke)-[a-z]+-\d{2,3}/`로 **Tailwind 클래스만** 본다. `LabeledFigure`의 인라인 SVG가 통과하는 진짜 이유는 그 2모듈이 `first-semiconductor`이고 이 자료원이 `WAVES`에 **없어서** C-1~C-17 범위 밖이라는 것이다.
- **`WAVES`에 `first-semiconductor` 편입** (신설 백로그) — 브라우저 스윕이 모으는 SVG 92페이지 중 **60페이지**가 이 자료원이다. `CLAUDE.md`는 "도해를 추가·수정하면 `verify:diagram`"이라 적었지만 그 60모듈은 C-1~C-17 관문 밖이다(C-18·C-19는 컴포넌트·토큰 단위라 무관하다). 기준선 사이클은 임시 스크립트로 검사했고 그 스크립트는 남지 않았다
