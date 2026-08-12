# Design — 도해 세트 마감

> **Feature**: `diagram-set-finishing`
> **작성일**: 2026-08-11 · **Level**: Dynamic
> **Plan**: `docs/archive/2026-08/diagram-set-finishing/diagram-set-finishing.plan.md`
> **선행 사이클**: `diagram-component-set`(2026-08-10, 93.6%) — 이 사이클이 닫는 미완 6건의 출처

---

## 0. 확정된 계약 2건 (2026-08-11 사용자 결정)

Plan §3이 선택지로 남긴 두 항목을 확정한다. **이 사이클의 존재 이유**이며, 도해를 213모듈로 확대하기 전에 고정해야 하는 값이다.

| # | 계약 | 결정 | 근거 |
|:--:|---|---|---|
| **C-1** | 도해 글자 크기 | **viewBox 절대 단위 확정** — 본문 `FontSizeToggle`과 연동하지 않는다 | SVG 내부에서 `em`은 부모의 **CSS px**를 참조하는데 viewBox는 **사용자 좌표계**다. 둘을 섞으면 도해가 스케일로 작아져도 글자는 그대로여서 375px에서 라벨이 도형을 넘친다. 접근성은 ⓐ 브라우저 확대(SVG는 벡터라 깨지지 않음) ⓑ 표 병치·`altTable`의 텍스트 대안으로 확보한다 |
| **C-2** | `altTable` 방침 | **표 병치를 대안 이행으로 명문화** — FR-8을 "표 병치 **또는** `altTable`"로 재정의 | 현재 89모듈이 표를 지우지 않고 도해와 병치해 **정보 손실이 0**이다. 131개에 `altTable`을 채우고 본문 표를 지우면 자수가 줄어 하한 근접 6모듈(`030` 여유 +25)이 §5.1 보정에 걸린다. 이미 작동하는 방식을 규칙으로 승격하는 편이 정직하다 |

> C-1·C-2는 **코드 변경을 요구하지 않는다.** 둘 다 "이미 그렇게 하고 있으나 문서가 다르게 적혀 있던" 항목이라, 이 사이클의 절반은 **문서를 실제에 맞추는 일**이다.

---

## 1. 처리 대상 6건 — 확정 스펙

| # | 항목 | 조치 | 코드 변경 |
|:--:|---|---|:--:|
| F-1 | `LayerStack.orientation('band')` | **구현** + 밴드 전용 tone 3종 신설 (§2) | ✅ |
| F-2 | `Timeline.span` | **시그니처 삭제** (§3) | ✅ |
| F-3 | 글자 크기 | C-1 확정 → Design §3.2 정정 | 문서만 |
| F-4 | `altTable` | C-2 확정 → FR-8 재정의 + 선행 §5.1 근거 문장 정정 | 문서만 |
| F-5 | tokens 우회 2건 | `TONE` 참조로 교체 (§4) | ✅ |
| F-6 | `<desc>` 0건 | 데이터에서 **자동 생성** (§5) | ✅ |

---

## 2. F-1 — `LayerStack` band 모드

### 2.1 왜 필요한가

007·008이 에너지 띠를 그리는데 **재료 단면과 같은 렌더**를 쓴다. 문제는 표현이 아니라 **의미**다.

| | 재료 단면 (`vertical`) | 에너지 띠 (`band`) |
|---|---|---|
| 세로축 | 물리적 위치 (위=표면) | **에너지** (위=높음) |
| 층 두께 | 실제 막 두께 | 띠의 **에너지 폭** |
| 층 사이 | 계면 | **금지대역** — 전자가 존재할 수 없는 영역 |

현재 007은 전도띠에 `silicon-n`, 충만띠에 `silicon-p`, 금지대역에 `oxide` tone을 빌려 쓴다. **전도띠는 n형 실리콘이 아니고 금지대역은 절연막이 아니다.** 채움 패턴(`+`/`−`)까지 함께 나와 독자가 도핑 도해로 오독할 여지가 있다.

### 2.2 렌더 스펙

`orientation="band"`일 때 `vertical`과 달라지는 것:

| 요소 | vertical | band |
|---|---|---|
| 모서리 | `rx=4` (둥근) | **`rx=0`** — 물리적 덩어리가 아님을 형태로 구분 |
| 좌측 축 | 없음 | **에너지 축** 화살표 `↑ E` (본체 왼쪽 여백에) |
| 금지대역 층 | 일반 층과 동일 | **채우지 않고**(`fill-transparent`) **점선 테두리** — "존재할 수 없는 영역"을 빈 공간으로. (초안은 "상·하 경계만"이었으나 rect 한 개의 `strokeDasharray`로 4변을 점선 처리했다 — 층 경계가 좌우로도 열려 보여 의도에 더 맞는다) |
| 채움 패턴 | tone에 `mark`가 있으면 적용 | **적용하지 않음** (도핑 오독 방지) |
| 층 라벨 | 층 안 좌측 | 동일 |

`orientation`의 기본값은 `'vertical'`이므로 **기존 27개 사용처는 무변경**이다.

### 2.3 밴드 전용 tone 3종

`tokens.ts`의 `TONE`에 추가한다. 재료 tone과 **색 계열을 겹치지 않게** 골랐다.

| tone | 의미 | light | dark | mark |
|---|---|---|---|:--:|
| `band-conduction` | 전도띠 | `fill-teal-50` | `dark:fill-teal-950` | 없음 |
| `band-gap` | 금지대역 | `fill-transparent` | 동일 | 없음 |
| `band-valence` | 충만띠 | `fill-indigo-50` | `dark:fill-indigo-950` | 없음 |

`mark`가 없으므로 §3.1의 채움 패턴이 적용되지 않는다 — p/n 도핑과 시각적으로 갈린다.

### 2.4 007·008 교정안

```mdx
// 007 — 3층
{ id: 'cond', label: '전도띠 — …', tone: 'band-conduction' }
{ id: 'gap',  label: '금지대역 — …', tone: 'band-gap' }
{ id: 'val',  label: '충만띠 — …', tone: 'band-valence' }
orientation="band"

// 008 — 5층. 도너·억셉터 준위는 '띠'가 아니라 '준위'(선에 가까움)라
//        accent 유지가 맞다 — 띠 사이에 놓인 디딤돌임을 강조한다.
{ id: 'cond',     tone: 'band-conduction' }
{ id: 'donor',    tone: 'accent' }        // 유지
{ id: 'gap',      tone: 'band-gap' }
{ id: 'acceptor', tone: 'accent' }        // 유지
{ id: 'val',      tone: 'band-valence' }
```

---

## 3. F-2 — `Timeline.span` 삭제

Design §2.2(선행)에 시그니처만 있고 구현이 없다. **사용처를 실측하니 `Timeline`은 col-2·col-3 두 곳뿐이고 둘 다 이벤트 목록만 쓴다.**

`span`(시간 축 범위)은 이벤트를 축 위에 비례 배치할 때 필요한데, 현재 구현은 **세로 목록**이라(한국어 설명이 길어 가로 축에 얹으면 겹친다 — 선행 사이클 결정) 축 자체가 없다. 즉 `span`은 현행 렌더 모델과 맞지 않는다.

→ **선행 Design §2.2 표에서 `span?` 항목을 삭제**한다. 구현하지 않는다.

---

## 4. F-5 — tokens 우회 2건

| 위치 | 현재 | 조치 |
|---|---|---|
| `NodeGraph.tsx:33` `KIND_FILL` 3종 | `block`/`device`/`io`별 fill을 컴포넌트 안에 정의 | `tokens.ts`로 옮겨 **`NODE_KIND` 상수**로 공개. `TONE`과 별개 축(노드 종류 ≠ 재료)이라 병합하지 않고 같은 파일에 나란히 둔다 |
| `LatticeDiagram.tsx:136` | `'fill-slate-200 dark:fill-slate-700'` 문자열 직접 기입 (= `TONE.substrate.fill`과 동일) | `TONE.substrate.fill` 참조로 교체 |

`LatticeDiagram:97`의 이웃 원자 fill도 같은 문자열이므로 함께 정리한다.

---

## 5. F-6 — `<desc>` 자동 생성

**저작자에게 부담을 주지 않는다.** `desc`를 prop으로 받으면 131개 도해에 일일이 써야 하고 누락이 생긴다. 대신 **각 컴포넌트가 자기 데이터에서 한 문장을 만든다.**

| 컴포넌트 | `<desc>` 생성 규칙 | 예 |
|---|---|---|
| `LayerStack` | `위에서 아래로 {층 라벨을 ' · '로}. {wells 있으면 "…에 N개 영역"}` | "위에서 아래로 게이트 전극 · 절연막 SiO₂ · p형 실리콘 기판. 기판에 n⁺ 소스·n⁺ 드레인" |
| `NodeGraph` | `{노드 수}개 요소가 {엣지 수}개 연결선으로 이어진 구조도. {io 노드 라벨}` | "6개 요소가 6개 연결선으로 이어진 구조도. 입력 A, 출력 Y" |
| `LatticeDiagram` | `{center} 원자와 이웃 실리콘 4개의 결합. {highlight 설명}` | "P 원자와 이웃 실리콘 4개의 결합. 다섯 번째 손의 전자가 남는다" |
| `CurvePlot` | `가로축 {x}, 세로축 {y}. 곡선 {n}개` | "가로축 드레인 전압 V_D, 세로축 드레인 전류 I_D. 곡선 4개" |
| `ScaleRuler` | `로그 눈금 위 {marks 라벨}. 참조 {refs 라벨}` | "로그 눈금 위 300mm, 450mm. 참조 A4 짧은 변 210mm" |
| `LabeledFigure` | 저작자 `desc` prop **선택 제공**, 없으면 `{labels 텍스트}` 나열 | — |

`<svg role="img" aria-labelledby="{id}-t {id}-d">` + `<title id="{id}-t">` + `<desc id="{id}-d">`로 연결한다. 이때 `aria-labelledby`가 id를 요구하므로 **6종 전부 내부 id가 필요**해진다 — 선행 V-3에서 `idPrefix`를 2종으로 좁혔던 것과 충돌한다.

**해법**: `aria-labelledby` 대신 **`aria-label`을 유지**하고 `<desc>`는 보조 설명으로만 둔다. 스크린리더는 `aria-label`을 우선 읽으므로 접근성 손실이 없고, `idPrefix` 규약도 지켜진다.

```tsx
<svg role="img" aria-label={caption ?? 기본문구}>
  <title>{caption ?? 기본문구}</title>
  <desc>{buildDesc(props)}</desc>
  …
```

---

## 6. 문서 정정 목록 (F-3·F-4)

| 대상 | 정정 |
|---|---|
| 선행 Design §3.2 | "SVG `<text>`는 `0.8em` 같은 상대 단위" → **viewBox 절대 단위 확정 + 이유**(C-1 근거) |
| 선행 Design §2.2 | `Timeline.span?` 항목 삭제 · `LayerStack.orientation` 구현 완료 표시 |
| 선행 Plan FR-8 | "도해별 표 대체 텍스트 제공" → **"표 병치 또는 `altTable` 중 하나로 텍스트 대안 제공"** |
| 아카이브 `first-semiconductor-primer.design.md` §5.1 | 자수 예외 근거를 "`altTable`에 동일 정보가 남으므로" → **"표를 지우지 않고 병치하므로"** |
| `usage.md` §2.3 | 표 병치를 **원칙**으로 올리고 `altTable`은 표를 실제로 대체할 때만 쓰는 것으로 재서술 |
| `usage.md` §3 | 글자 크기 계약(C-1) 추가 |

---

## 7. 검증 계획

| # | 조건 | 측정 |
|:--:|---|---|
| G-1 | `typecheck`·`lint` 무오류 | 명령 |
| G-2 | First Load JS **102kB 무증가** · SSG **393 유지** | `npm run build` |
| G-3 | 기존 `LayerStack` 27개 사용처 렌더 무변경 (`orientation` 기본값 `vertical`) | 빌드 HTML에서 `rx="4"` 유지 확인 |
| G-4 | 007·008에 `band-*` tone 적용, 채움 패턴 미적용 | 빌드 HTML grep |
| G-5 | SVG 6종에 `<desc>` 존재 | 빌드 HTML grep |
| G-6 | 97모듈 자수 §5.1 범위 유지 | baseline 대조 |
| G-7 | Design §2.2 props 표 ↔ 구현 **100% 일치** (시그니처만 있는 prop 0건) | 수동 대조 |

## 8. 완료 정의 (Design)

- [x] C-1·C-2 계약 확정
- [x] band 모드 렌더 스펙 + 밴드 tone 3종
- [x] `Timeline.span` 처리 방침 (삭제)
- [x] tokens 우회 정리 방식
- [x] `<desc>` 자동 생성 규칙 + `aria-labelledby` 대신 `aria-label` 유지 근거
- [x] 문서 정정 6건 목록
- [ ] 사용자 승인 → Do 착수

## 9. 다음 단계

→ **`/pdca do diagram-set-finishing`**

Do 순서: ① `tokens.ts`에 밴드 tone 3종 + `NODE_KIND` 이관 → ② `LayerStack` band 모드 구현 → ③ 007·008 교정 → ④ `<desc>` 6종 → ⑤ `Timeline.span` 삭제 + tokens 우회 정리 → ⑥ 문서 정정 6건 → ⑦ 게이트 G-1~G-7.
