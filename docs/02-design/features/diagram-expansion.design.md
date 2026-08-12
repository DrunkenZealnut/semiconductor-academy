# Design — 도해 세트 타 자료원 확대 (umbrella)

> **Feature**: `diagram-expansion`
> **작성일**: 2026-08-11 · **Level**: Dynamic
> **Plan**: `docs/01-plan/features/diagram-expansion.plan.md`
> **상속**: `diagram-component-set`(12종·T1/T2/T3 판정) · `diagram-set-finishing`(C-1·C-2 계약) · `diagram-component-set.usage.md`(사용 규약)

---

## 0. 확정된 결정 (2026-08-11 사용자 선택)

| # | 항목 | 결정 | 이 Design에 미치는 영향 |
|:--:|---|---|---|
| **D-2** | 129모듈 커버리지 | **전수 129/129** — 모듈마다 주 도해 1개 이상 | §2 배치 매핑이 **45행 전량**을 채워야 한다. 배정이 어려운 모듈을 빼지 않고, 대신 **T2/T3까지 동원**해 근거를 남긴다 |
| **D-3** | W1 파일럿 범위 | **4권 45모듈** — `hs-basic-tech-1`(12)·`hs-semicon-basics`(10)·`hs-photo-etch`(15)·`hs-thinfilm-diffusion`(8) | 개념형 2권 + 장비·공정형 2권이라 **두 유형의 판정을 한 사이클에 확정**한다(§3). W2 61모듈이 이 판정을 재사용 |
| **D-1** | W4(도판 보유 101모듈) | **로드맵 유지 + W3 후 재판단** | 이 Design은 **W1 상세 + W2·W3 방침 + W4 위치·선별 방향**까지만 다룬다. W4 배치 매핑은 하지 않는다 |
| **D-4** | `osha-scs` 처리 | **W3에서 실물 확인 후 결정** (오케스트레이터 판단으로 이연) | 영문·`LayeredExplain` 0·목록 60/모듈이라 12종 어느 것도 바로 맞지 않는다. **지금 결정하면 실물 없이 판정하는 것**이 되어 선행 사이클의 "원문 근거 없는 배정" 실패를 반복한다. §5.3에 판단 기준만 적는다 |

---

## 1. 이 확대가 기준선과 다른 점

`first-semiconductor`(기준선)는 **MDX를 쓰면서 동시에 도해를 넣었다.** 이 확대는 **이미 완성된 MDX에 도해를 추가**한다. 이 차이가 두 규약을 바꾼다.

### 1.1 데이터 출처 = MDX 본문 (신설 규약)

`usage.md` §2.1은 "원문에 없는 값을 만들지 않는다"고 못 박고, 기준선에서 이 규칙이 **9건을 되돌렸다**. 그때 "원문"은 스캔본이었다.

이 확대에서 **"원문"은 해당 모듈의 MDX 본문**이다. MDX는 각 자료원 사이클에서 이미 원문 검증(수치 대조·출처 표기·CodeRabbit 리뷰)을 거쳤으므로, **MDX에 적힌 값만 쓰면 원문 근거가 자동으로 보장**된다.

| | 기준선 | 이 확대 |
|---|---|---|
| 데이터 출처 | 원문 스캔본 (줄 번호로 인용) | **해당 모듈 MDX의 `##` 섹션·표** |
| 창작 위험 | 높음 — 원문에 없는 값을 상식으로 채움 | **낮음** — MDX에 없으면 쓰지 않는다. 판정이 기계적이다 |
| 금지 | 원문 미기재 값 | **MDX 미기재 값 + 타 모듈에서 값 끌어오기** |

> **가장 중요한 금지 사항**: 기준선에서 가장 위험했던 2건(`001` 저항률·`087` High-k)이 **다른 표에서 값을 끌어온** 경우였다. 이 확대는 45모듈을 병렬로 다루므로 **모듈 간 값 이동**이 같은 함정이다. 도해의 모든 수치·라벨은 **그 모듈 MDX 안에** 있어야 한다.

### 1.2 본문 텍스트 무수정 → 자수 ±0

C-2(표 병치 원칙)에 따라 **본문 표를 지우지 않는다.** 따라서:

- 자수가 줄지 않는다 → **자료원별 `baseline.md`가 필요 없다**(현재 `first-semiconductor` 것 하나뿐).
- `altTable`은 W1에서 **쓰지 않는다** — 표를 대체하지 않으므로.
- 변경은 **도해 JSX 블록 삽입뿐**이다. 이것이 검증을 단순하게 만든다(§6 G-6).

---

## 2. W1 Step 0 — 전수 배치 매핑 (45행)

각 행의 판정 기준은 한 줄이다: **이 그림이 없으면 무엇을 못 읽는가.**

표기 — **주**: 모듈의 주 도해(전수 커버리지 대상, 미이행 0건 필수) · **보조**: 확정 추가분 · **⚠조건부**: Do에서 MDX 근거를 확인한 뒤 채택/탈락(탈락 시 근거 기록, 미이행으로 세지 않음)

### 2.1 `hs-semicon-basics` (10모듈) — 개념형·소자 물리

| 모듈 | 주 도해 | 근거 섹션 | 보조 |
|---|---|---|---|
| `physical-properties` | **`LayerStack orientation="band"`** — 도체·반도체·부도체를 가르는 에너지 밴드 | §4 (표3·표4) | `LatticeDiagram` 실리콘 결정 §3 · `CompareCards` 캐리어 표1 |
| `semicon-fundamentals` | `LatticeDiagram` — 도핑된 실리콘의 남는 손/빈자리 | §2 | `CompareCards` n형/p형 표1 · ⚠`ValueBars` 이동도 표2 |
| `diode` | `LayerStack` — PN 접합 단면과 공핍층 | §1 | `CompareCards` 순/역방향 표1 · `CompareCards` 쇼트키/옴 표2 |
| `mosfet` | `LayerStack` (`idPrefix` 필수) — MOSFET 단면(게이트·산화막·채널·소스/드레인) | §2 | `CompareCards` nMOS/pMOS 표2 · `TreeBranch` 단채널 효과별 대책 표3 |
| `bjt` | `LayerStack` — npn 3층 적층과 3단자 | §1 (표1) | `TreeBranch` E-B×C-B 바이어스 2×2 동작 영역 (초안 `CompareCards` — 4열 압착 회피) |
| `cmos-image-sensor` | `LayerStack` — CIS 세 개의 층 | §3 | `CompareCards` CCD/CIS 표1 · `FlowSteps` 화소 구조 세대 진화 표2 |
| `passive-components` | `CompareCards` 3열 — 저항기·축전기·인덕터 | §2~4 | — |
| `semicon-overview` | `TreeBranch` — 물질·소자·제품 층위 | §1 (표1) | `ValueBars` 4004 vs 카비레이크 표4(자릿수 차 큼) · `CompareCards` DRAM/플래시 표6 |
| `semicon-industry` | `FlowSteps` — 밸류체인(설계→제조→후공정) | §2 (표2) | ⚠`ValueBars` 시장 규모 표1 · `TreeBranch` 재료·장비 분류 표4 |
| `semicon-careers` | `TreeBranch` — 직무 계열 분류(제조·설계·인프라) | §1~3 (표1) | — |

**소계**: 주 10 · 보조 13 · ⚠조건부 2

> `semicon-fundamentals`의 이동도(표2)를 ⚠로 둔 이유: Si·Ge 값의 **자릿수 차가 2 미만**이면 `usage.md` §1의 T3 조건("자릿수 차 2 이상")에 미달해 표가 낫다. MDX 실측 후 판단한다.

### 2.2 `hs-basic-tech-1` (12모듈) — 전기·전자 기초 + 기계·제도

| 모듈 | 주 도해 | 근거 섹션 | 보조 |
|---|---|---|---|
| `c-basics` | `FlowSteps` — 소스 코드가 실행 파일이 되기까지 | §4 | `TreeBranch` 언어 분류 표1·표2 |
| `c-programming` | `TreeBranch` — 제어문 3계열(반복 `for`/`while`/`do~while` · 조건 `if`/`switch` · 탈출 `break`) | §5 (표6) | — (코드 블록 중심 모듈. 표 5개는 병치 유지) |
| `dc-circuits` | `CompareCards` 3열 — 직류·교류·맥류 | §2 (표1) | `NodeGraph` 키르히호프 전류 법칙(KCL) 접합점 §4 (초안 폐회로 = KVL — 접합점이 그리기 쉬워 KCL 채택) · ⚠`CurvePlot` 3전류 파형 §2 |
| `drafting-standards` | `FlowSteps` — A0→A4 접기 순서 (초안 `ScaleRuler` — T3 미달) | §2 (표1) | `TreeBranch` 도면 요소 필수·선택 · `TreeBranch` 선의 모양과 용도 표4 |
| `drawing-methods` | `CompareCards` — 제1각법 vs 제3각법(눈·물체·투상면 순서) | §3 | `FlowSteps` 투상면 확장 1→2→3→6개면 (초안 `LabeledFigure` — §4.1) |
| `electronic-devices` | `LatticeDiagram` — 원자에서 시작하는 반도체(도핑) | §4 (표2) | `FlowSteps` 저항 색띠 읽는 순서 (초안 `LabeledFigure` — §4.1) · `LayerStack` 다이오드 접합 §5 |
| `hydraulics-equipment` | `NodeGraph` — 유압 시스템 구성(탱크→펌프→밸브→액추에이터) | §1~5 | `TreeBranch` 밸브 분류(압력·방향·유량) 표1 |
| `measurement` | `FlowSteps` — 버니어캘리퍼스 눈금 읽기 4단계 (초안 `LabeledFigure` — §4.1) | §3 | `TreeBranch` 측정 오차 6종 표2 · `CompareCards` 측정/검사 §1 |
| `milling` | `CompareCards` — 상향 절삭 vs 하향 절삭 | §6 | `FlowSteps` 드릴 설치→탭 순서 §7 · `CompareCards` 밀링 3종 표1 |
| `pneumatics-basics` | `CompareCards` 3열 — 공압·유압·전기 | §2 (표1) | `CompareCards` 파스칼 원리 면적비·힘비 (초안 `LabeledFigure` — §4.1) · ⚠`CurvePlot` 보일·샤를 법칙 §6 |
| `pneumatics-equipment` | `FlowSteps` — 압축기→정화기기→액추에이터→밸브 | §1~4 | `TreeBranch` 정화기기 역할 표2 |
| `sectional-views` | `TreeBranch` — 단면도 5종을 가르는 기준 (초안 `CompareCards` — 5열 압착 회피) | §2 (표1) | `CompareCards` 해칭 vs 스머징 (초안 `LabeledFigure` — §4.1) |

**소계**: 주 12 · 보조 14 · ⚠조건부 2

> `c-programming`이 이 권에서 도해 값이 가장 낮다 — 코드 블록과 연산자 표가 본문의 뼈대다. 전수 커버리지 결정(D-2)에 따라 주 도해를 넣되 **제어문 분류**라는 가장 구조적인 부분만 잡고, 나머지 표 5개는 손대지 않는다. 이 판정을 기록해 두는 것이 중요하다 — 다음 저작자가 "왜 여기는 하나뿐인가"를 묻지 않게.

### 2.3 `hs-photo-etch` (15모듈) — 장비·공정형

| 모듈 | 주 도해 | 근거 섹션 | 보조 |
|---|---|---|---|
| `process-overview` | `ScaleRuler` — Å·nm·μm 반도체의 자 | §5 (표4) | `FlowSteps` 전공정→후공정 표3 · `TreeBranch` 장치산업 6성격 표1 |
| `fab-cleanroom` | `TreeBranch` — 라인 구조 포함 관계 (초안 `LayerStack` — 포함 ≠ 적층) | §2 | `FlowSteps` 공기 순환 loop §1 · `FlowSteps` 청정실 복장 순서 표1 |
| `photo-process` | `FlowSteps` — 도포→노광→현상→검사(+베이크 4회) | §1~6 | `LayerStack` 감광액 도포 단면 §2 · `TreeBranch` 불량 항목 표4 |
| `photomask` | `LayerStack` — 마스크 원판 + 페리클 단면 | §1~2 | `FlowSteps` 마스크 제작 공정 표1 · `CompareCards` 바이너리/PSM 표2 |
| `exposure-equipment` | `FlowSteps` — 노광 장비 4세대 순서 (초안 `Timeline` — 본문에 연도 없음) | §2 (표1) | ⚠`ValueBars` 광원 파장 표2 · `CompareCards` 스테퍼/스캐너 표3 |
| `stepper-structure` | `NodeGraph` — 본체·제어 랙·챔버 계통 | §2 | `FlowSteps` 광원→웨이퍼 광학계 경로 (초안 `LabeledFigure` — §4.1) |
| `stepper-operation` | `FlowSteps` — 정렬 → 포커스·레벨링 → 노광량 (초안 `LabeledFigure` — §4.1) | §1~2 | — |
| `track-equipment` | `FlowSteps` — 웨이퍼 반송 흐름(블록별) | §2 (표1) | `LayerStack` 코터 유닛 막 형성 §3 |
| `track-operation` | `FlowSteps` — 기동→진행→정지 순서 | §1 | `TreeBranch` 기동 전 충족돼야 하는 공급 조건 §1 (초안 알람 계열 §6) |
| `etch-process` | `CompareCards` — 습식 에칭 vs 건식 에칭 | §2~3 (표2·표5) | `TreeBranch` 막별 에칭 가스 표6 · `FlowSteps` 건식 식각이 진행되는 다섯 걸음 §3 (초안 공정 확인 절차 표8 — 기구가 더 근본이라 판단) |
| `etch-equipment` | `NodeGraph` — 5계통(반송·진공·가스·전기·온도) | §1~5 (표4) | `ValueBars` 진공 영역별 압력 범위 표3(자릿수 차 큼) · `CompareCards` 챔버 배열·전원 방식 표5·표6 |
| `etcher-structure` | `FlowSteps` — 웨이퍼의 여정 ①~⑤ | §2~6 | `LayerStack` 전극 유닛(RF·척) §5 |
| `etcher-maintenance` | `Timeline` — PM 주기(Daily→Weekly→Monthly→Annual) | §1 (표1) | `TreeBranch` 장비 경고 표시 표4 |
| `photo-practice` | `TreeBranch` — 3 실습 분류 | §1 (표1) | `FlowSteps` 신너 필터 교환 절차 §2 |
| `etch-practice` | `TreeBranch` — 7 실습 3계열(**조망 1 · 조작 1 · 분해·조립 5**) | §1 (본문이 3계열을 명시) | `CompareCards` Step by Step vs Full Auto §2 |

**소계**: 주 15 · 보조 19 · ⚠조건부 1

> `etch-practice`·`photo-practice`·`*-practice` 계열은 **실습 목록형**이라 도해 배정이 가장 불확실했다. `etch-practice` 본문이 7실습을 "조망 / 조작 / 분해·조립"으로 **직접 분류해 놓았다**(§1 끝 문단) — 창작이 아니라 본문 구조를 그대로 그리는 것이라 `TreeBranch`가 정확하다. 다른 `*-practice` 3개도 같은 문형인지 Do에서 확인한다.

### 2.4 `hs-thinfilm-diffusion` (8모듈) — 장비·공정형

| 모듈 | 주 도해 | 근거 섹션 | 보조 |
|---|---|---|---|
| `diffusion-process` | `LayerStack` — 산화막이 자라는 단면 | §2 | `TreeBranch` 산화막 6역할 표1 · `CompareCards` 산화 속도 5변수 표2 |
| `diffusion-equipment` | `FlowSteps` — 웨이퍼 자동화 여덟 걸음 | §3 (표3) | `NodeGraph` 본체부·제어부 §2 |
| `diffusion-maintenance` | `FlowSteps` — T-BAWL: 웨이퍼가 보트에 오르기까지 | §2 (표2) | `FlowSteps` DIAG→EVALUATION→RUN §3 |
| `diffusion-practice` | `TreeBranch` — 6 실습 분류 | §1 (표1) | `FlowSteps` 아웃터 튜브 반출 절차 §3 |
| `thinfilm-process` | `TreeBranch` — 쌓는 방법 4가지 | §2 (표2) | `CompareCards` 재료 3종·목적 2종 표1 · `LayerStack` 층덮임 §5 |
| `thinfilm-equipment` | `NodeGraph` — 로봇 팔 하나가 지휘하는 클러스터 | §1 (표1) | `LayerStack` 챔버 내부 §3 · ⚠`ValueBars` 허용 누출률 표3 |
| `thinfilm-maintenance` | `FlowSteps` — 벤트 → 리크 체크 | §3~4 | `CompareCards` 조작 화면 3종 표1 |
| `thinfilm-practice` | `TreeBranch` — 7 실습 분류 | §1 (표1) | `FlowSteps` 리크 체크 절차 §3 (초안 MFC 교체 절차 — 리크 체크가 실습 본체) |

**소계**: 주 8 · 보조 10 · ⚠조건부 1

### 2.5 W1 집계와 교차 검증

| 자료원 | 모듈 | 주 | 보조 | ⚠조건부 | 계획 인스턴스(주+보조) |
|---|:--:|:--:|:--:|:--:|:--:|
| `hs-semicon-basics` | 10 | 10 | 13 | 2 | 23 |
| `hs-basic-tech-1` | 12 | 12 | 14 | 2 | 26 |
| `hs-photo-etch` | 15 | 15 | 19 | 1 | 34 |
| `hs-thinfilm-diffusion` | 8 | 8 | 10 | 1 | 18 |
| **합계** | **45** | **45** | **56** | **6** | **101** |

교차 검증 — 모듈: 10+12+15+8 = **45** ✓ (Plan §3 W1과 일치) / 주 = 모듈 수 **45** ✓ (전수 커버리지 D-2) / 보조: 13+14+19+10 = **56** ✓ / 계획 인스턴스: 23+26+34+18 = **101** ✓ = 45+56 ✓ / ⚠조건부 2+2+1+1 = **6** (분모 제외)

**밀도**: 101 ÷ 45 = **2.24/모듈**. 기준선은 140 ÷ 97 = 1.44/모듈이다. 1.56배 높은 이유는 ⓐ 이 4권이 모듈당 평균 168줄로 기준선(135줄)보다 길고 ⓑ 표 밀도가 2.9/모듈 대 1.6으로 **1.8배**여서 대조·분류 소재가 많기 때문이다.

**컴포넌트 분포 (계획)**

| 컴포넌트 | 주 | 보조 | 계 | 기준선(97모듈) |
|---|:--:|:--:|:--:|:--:|
| `CompareCards` | 7 | 18 | **25** | 26 |
| `FlowSteps` | 10 | 10 | **20** | 19 |
| `TreeBranch` | 8 | 12 | **20** | 11 |
| `LayerStack` | 8 | 6 | **14** | 28 |
| `LabeledFigure` | 2 | 5 | **7** | 2 |
| `NodeGraph` | 4 | 2 | **6** | 15 |
| `LatticeDiagram` | 2 | 1 | **3** | 7 |
| `ScaleRuler` | 2 | 0 | **2** | 4 |
| `Timeline` | 2 | 0 | **2** | 2 |
| `ValueBars` | 0 | 2 | **2** | 13 |
| `CurvePlot` | 0 | 0 | **0** | 4 |
| `TruthTable` | 0 | 0 | **0** | 9 |
| **계** | **45** | **56** | **101** | **140** |

읽을 것:

- **주 도해 1위는 `FlowSteps` 10건** — 장비·공정형 2권이 절차 중심이기 때문이다. `TreeBranch`·`LayerStack`이 8건으로 공동 2위다.
- **`TreeBranch`가 기준선의 2배**(11 → 20) — 교과서·수험서가 내용을 **분류 체계**로 서술하고, `*-practice` 4모듈이 실습 목록을 계열로 묶는다. 이것이 이 확대에서 가장 뚜렷한 성격 차이다.
- **`TruthTable`·`CurvePlot` 0건** — 이 4권에 진리표가 없고, 곡선은 MDX가 형상을 서술하지 않는다(⚠조건부 2건만 후보). **12종 중 2종이 W1에서 미사용**인 것은 정상이다 — 전수 커버리지가 12종 전량 사용을 뜻하지는 않는다.
- **`ValueBars` 2건**뿐 — 기준선 13건에서 급감했다. T3 조건(자릿수 차 2 이상)이 실제로 억제 기능을 한다. 입문서는 자릿수 비교가 논지였으나 교과서·장비 문서는 규격값 나열이라 표가 낫다.
- **`LayerStack` 비중 반감**(28 → 14) — 이 4권은 단면보다 **장비 계통·절차**가 중심이다. `NodeGraph`도 15 → 6으로 줄었는데, 회로도가 `hs-semicon-basics`에 거의 없기 때문이다.
- **`LabeledFigure` 2 → 7로 증가** — 눈금(버니어캘리퍼스)·투상법·해칭·광학계 경로처럼 12종에 전용 컴포넌트가 없는 도형이 기계·제도 단원에 모여 있다. `usage.md` §4가 경고한 "남용 시 전용 SVG 회귀"에 **가장 근접한 지표**라 Check에서 다시 본다.

---

## 3. 자료원 유형별 판정 (FR-2)

W1이 두 유형을 동시에 확정하는 것이 D-3의 목적이다.

| | **개념형** (`hs-semicon-basics`·`hs-basic-tech-1`) | **장비·공정형** (`hs-photo-etch`·`hs-thinfilm-diffusion`) |
|---|---|---|
| 주 도해 1순위 | **구조** — `LayerStack`(단면)·`LatticeDiagram`(격자)·`LayerStack band`(밴드) | **절차·계통** — `FlowSteps`(순서)·`NodeGraph`(계통) |
| 주 도해 2순위 | `CompareCards`(2~3열 대조) | `TreeBranch`(장비·실습·불량 분류) |
| 표 활용 | 대조표 → `CompareCards`, 분류표 → `TreeBranch` | 절차표 → `FlowSteps`, 주기표 → `Timeline` |
| 흔한 함정 | 물리량 표를 `ValueBars`로 올리려 함 → **T3 조건(자릿수 차 2 이상) 미달이면 표 유지** | 장비 모델명·화면 시퀀스를 도해로 재현 → **선행 사이클의 장비 일반화 특칙 위반**. 도해는 계통·절차 수준만 |
| `idPrefix` | `LayerStack` 2개 이상인 모듈(`mosfet`·`electronic-devices`) | `LayerStack`·`NodeGraph` 동시 사용 모듈(`etch-equipment` 등) |

> **장비 일반화 특칙 승계**: `hs-photo-etch`·`hs-thinfilm-diffusion` 사이클은 원문이 상용 장비 매뉴얼형(니콘 NSR·TEL α-8·P-5000)이라 **터치 메뉴·설정 화면 재현을 금지**하고 원리 수준으로 추상화했다. 도해도 같은 제약을 받는다 — **장비 화면·버튼 배치를 그리지 않는다.** `diffusion-maintenance`의 조정단말기(§1)·`thinfilm-maintenance`의 조작 화면(§1)이 이 규칙에 걸리는 지점이라, 그 모듈의 도해는 **논리 흐름**(벤트→리크 체크)만 그린다.

---

## 4. 파일럿 게이트 (5모듈)

45모듈을 한 번에 돌리지 않는다. 다음 5모듈을 먼저 완성해 **판정·렌더·규약을 검증**한 뒤 확대한다. 선정 기준은 "여기서 실패하면 나머지 40개가 다 틀어지는 것".

| # | 모듈 | 검증 대상 | 실패 시 파급 |
|:--:|---|---|---|
| 1 | `physical-properties` | **`LayerStack orientation="band"`의 타 자료원 첫 적용** — `diagram-set-finishing`이 만든 band 모드가 007·008 밖에서 처음 쓰인다 | 밴드 tone·에너지 축이 다른 맥락에서 깨지면 W2·W3의 밴드 도해 전부 |
| 2 | `mosfet` | `LayerStack` 2개 + `idPrefix` 규약 · 개념형 주 도해 패턴 | `idPrefix` 충돌은 한 페이지 2도해 전부 |
| 3 | `photo-process` | 장비·공정형 주 도해 패턴(`FlowSteps` 다단계) · 장비 일반화 특칙 준수 | 장비·공정형 23모듈 |
| 4 | `etch-practice` | **실습 목록형 `TreeBranch` 판정** — 가장 불확실한 배정 | `*-practice` 4모듈(etch·photo·diffusion·thinfilm) |
| 5 | `process-overview` | **T3 조건부 판정** — `ScaleRuler`가 실제로 성립하는가 | T3 배정 전부(`ScaleRuler` 2·`ValueBars` 1·⚠6) |

**파일럿 통과 조건**: §6 게이트 G-1~G-5 전부 + 5모듈 육안 확인(라이트·다크·375px).

> 육안 확인은 로그인 게이트 뒤라 사람 몫이다. **선행 두 사이클이 이 항목을 미완으로 넘겼다**(`_INDEX.md` 백로그). W1은 파일럿 5모듈만이라도 실물을 보고 넘어간다 — 45모듈을 다 그린 뒤에 색 대비 문제를 발견하면 전량 재작업이다.

---

## 5. W2·W3 방침 / W4 위치

### 5.1 W2 (61모듈) — W1 판정 재사용

| 자료원 | 모듈 | 유형 | W1 재사용 |
|---|:--:|---|---|
| `hs-basic-tech-2` | 15 | 개념형(장비 설계·공유압·프로그래밍) | `hs-basic-tech-1` 판정 직접 승계 |
| `hs-equipment-maintenance` | 14 | 장비·공정형 | `hs-photo-etch` 판정 승계 |
| `hs-assembly-inspection` | 12 | 장비·공정형(후공정) | 같음 |
| `hs-semicon-infra` | 10 | 개념형(표 1.0/모듈 — **최저**) | 표가 적어 `FlowSteps`·`TreeBranch` 편중 예상 |
| `daegu-hs-process` | 10 | 장비·공정형 | 주제가 `hs-photo-etch`·`hs-thinfilm-diffusion`과 겹쳐 **재사용률 최고** |

### 5.2 W3 (23모듈) — 구조 이질

`cert-equip-maintenance`(13, 표 5.3/모듈 = **전 자료원 최고**)는 `CompareCards`·`TreeBranch` 편중이 예상된다. 수험서라 **시험 포인트 Callout 50개**가 이미 있어 도해와의 지면 경합을 Design에서 확인해야 한다.

### 5.3 `osha-scs` 판단 기준 (D-4 이연)

지금 결정하지 않는 이유는 §0에 적었다. W3 Design에서 다음 순서로 판단한다.

1. 10모듈의 `##` 섹션(110개, 11.0/모듈)과 목록(600개)을 전수 훑어 **12종에 매핑되는 것**을 센다.
2. 매핑률이 낮으면 — 표본에서 확인된 **화재 3요소(삼각형)** 같은 도형은 12종에 없다 — 선택지는 셋이다:
   - **적용 모듈 축소 허용**(전수 예외) — 이 경우 `_INDEX.md`에 예외 근거를 남긴다
   - `LabeledFigure`로 처리 — 단 `usage.md` §4가 "남용하면 전용 SVG 방식으로 회귀"라 경고한다
   - **13번째 컴포넌트 승격 검토** — `usage.md` §4 기준(같은 패턴 3모듈 이상 반복)에 걸리는지가 관문
3. 영문 본문이므로 도해 라벨 언어를 정한다(본문 영문 + 라벨 한국어 혼용 여부).

### 5.4 W4 (101모듈) — 위치와 선별 방향만

**배치 매핑을 하지 않는다**(D-1). W3 종료 시 재판단할 때 쓸 선별 기준의 **방향**만 적는다.

원문 도판 425장이 이미 하는 일 — 장비 사진·실물 형상·원문 그래프 — 은 12종이 대신할 필요가 없다. 도판이 **못 하는 것**이 후보다:

| 도판이 못 하는 것 | 후보 컴포넌트 |
|---|---|
| 개념 대조(2~3열로 나란히) | `CompareCards` |
| 자릿수 차 큰 수치 비교 | `ValueBars` (T3 조건 충족 시) |
| 분류 체계 | `TreeBranch` |
| 논리 구조·진리표 | `NodeGraph`·`TruthTable` |
| 여러 도판에 흩어진 절차의 **통합 흐름** | `FlowSteps` |

---

## 6. 검증 계획 — DoD 1:1 매트릭스 (선행 교훈 적용)

`diagram-set-finishing`은 **DoD 7항목 중 1항목이 검증 매트릭스에 없어** Match Rate 97.3%가 미이행을 가리지 못했고 Report 단계에서야 발견됐다. W1은 **DoD 각 항목을 게이트로 1:1 대응**시킨다.

| 게이트 | DoD 대응 | 조건 | 측정 방법 |
|:--:|:--:|---|---|
| **G-1** | DoD-1 | `typecheck`·`lint` 무오류 | 명령 (기존 `Lightbox.tsx` 경고 1건은 무관) |
| **G-2** | DoD-2 | First Load JS **102kB 무증가** · SSG **393 유지** | `npm run build` |
| **G-3** | DoD-3 | **주 도해 45/45** — 45모듈 전부에 주 도해 1개 이상 (미이행 **0건**) | 빌드 HTML에서 모듈별 도해 컴포넌트 존재 확인 |
| **G-4** | DoD-4 | 계획 인스턴스 **101건 이상** (§2.5). 초과는 허용, ⚠조건부 6건은 분모 제외 | MDX grep 집계 |
| **G-5** | DoD-5 | 하드코딩 색 **0** · `idPrefix` 충돌 **0** | grep (`fill-`·`stroke-` 리터럴) · 한 페이지 다도해 모듈 확인 |
| **G-6** | DoD-6 | **본문 텍스트 무수정** — 변경이 도해 JSX 블록 삽입뿐 | `git diff`에서 도해 블록 외 본문 줄 변경 **0** |
| **G-7** | DoD-7 | 도해의 모든 수치·라벨이 **그 모듈 MDX 안에** 존재 (§1.1 — 모듈 간 값 이동 0) | 표본 전수 대조 |
| **G-8** | DoD-8 | cross-link·quotes 회귀 0 | 산출물 비교 (`generatedAt` 제외) |
| **G-9** | DoD-9 | 파일럿 5모듈 **육안 확인 완료** (라이트·다크·375px) | 사람 |
| **G-10** | DoD-10 | ⚠조건부 6건의 **채택/탈락 근거 기록** | 문서 확인 |
| **G-11** | DoD-11 | `usage.md` 실적용 기록 갱신 (현재 "97모듈"만) | 문서 확인 |
| **G-12** | DoD-12 | **Gap 판정 스크립트 양성 대조군** — 의도적으로 틀린 입력에 스크립트가 실패를 내는지 먼저 확인 | 스크립트 자체 테스트 |

**G-12가 이 사이클의 특별 항목이다.** 3사이클에 걸쳐 미해결인 백로그이고, 직전 사이클에서 자기 검증 스크립트가 "불일치 0"을 냈으나 실제 7행이 틀렸다. **판정 스크립트를 쓰기 전에 스크립트를 검증한다.**

---

## 7. 제작 순서와 병렬 계획

```
① 파일럿 5모듈 (§4) → G-1~G-5 + G-9 육안 확인
      ↓ 통과
② 자료원 4배치 병렬 — 남은 40모듈
      A: hs-semicon-basics 잔여 8      (개념형)
      B: hs-basic-tech-1 잔여 12       (개념형 — 최다)
      C: hs-photo-etch 잔여 13         (장비·공정형 — 최다)
      D: hs-thinfilm-diffusion 잔여 7  (장비·공정형)
      ↓
③ ⚠조건부 6건 판정 (MDX 근거 확인 → 채택/탈락 + 근거 기록)
      ↓
④ 문서 갱신 — usage.md 실적용 · _INDEX.md 백로그
      ↓
⑤ 게이트 G-1~G-12 전수
```

**배치 스펙은 파일로 넘긴다** — 배치별로 담당 모듈·주/보조 배정·근거 섹션을 §2 표에서 잘라 스펙 파일로 만든다. 프롬프트에 인라인하지 않는 이유는 45행 배정이 길어 누락·변형이 생기기 때문이다.

> 병렬 실행 방식(서브에이전트 사용 여부)은 Do 착수 시 사용자와 정한다. 이 Design은 **배치 경계와 스펙 전달 방식**만 고정한다.

---

## 8. 완료 정의 (Design)

- [x] D-1·D-2·D-3 사용자 결정 반영 · D-4 이연 근거 기록 (§0)
- [x] 기준선과 다른 점 2건 규약화 — 데이터 출처 = MDX 본문 · 본문 무수정 → 자수 ±0 (§1)
- [x] **W1 Step 0 전수 배치 매핑 45행** — 주 45 · 보조 56 · ⚠조건부 6 (계획 101), 교차 검증 완료 (§2)
- [x] 자료원 유형별 판정 2종 + 장비 일반화 특칙 승계 (§3)
- [x] 파일럿 5모듈 선정과 실패 파급 (§4)
- [x] W2·W3 방침 · `osha-scs` 판단 기준 · W4 선별 방향 (§5)
- [x] **DoD 1:1 검증 매트릭스 G-1~G-12** — 선행 사이클 교훈 적용 (§6)
- [x] 제작 순서·병렬 배치 경계 (§7)
- [ ] 사용자 승인 → Do 착수

## 9. 다음 단계

→ **`/pdca do diagram-expansion`**

Do 착수 시 정할 것: 병렬 실행 방식(서브에이전트 사용 여부·모델), 파일럿 5모듈의 육안 확인 시점(G-9는 사람 몫이라 진행을 막는 지점이 될 수 있다).
