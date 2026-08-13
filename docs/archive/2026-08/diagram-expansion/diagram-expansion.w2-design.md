# Design — 도해 확대 W2 (교과서 잔여 4권 + daegu)

> **Feature**: `diagram-expansion` 웨이브 2 · **작성일**: 2026-08-12 · **Level**: Dynamic
> **umbrella**: `docs/02-design/features/diagram-expansion.design.md` (§5.1이 W2 방침)
> **선행 웨이브**: W1(45모듈 · 109 인스턴스 · Match 91.7%) — 판정과 규약을 그대로 승계
> **배치표(기계 대조용)**: `diagram-expansion.w2-plan.json`
> **검증**: `node scripts/verify-diagram-placement.mjs --wave w2 --plan docs/02-design/features/diagram-expansion.w2-plan.json`

---

## 0. W1에서 승계하는 것 — 다시 정하지 않는다

| 항목 | 내용 |
|---|---|
| C-1 · C-2 계약 | 글자 크기 viewBox 절대 단위 · 표 병치 원칙(`altTable` 미사용) |
| 데이터 출처 | **그 모듈의 MDX 본문**. 모듈 간 값 이동 금지 (`usage.md` §2.1) |
| 본문 무수정 | 변경은 도해 JSX 삽입뿐. 문단 중간 삽입 금지(`<p>` 분할), 앞뒤 빈 줄 필수 |
| 유형 판정 | 개념형 = 구조·대조 1순위 / 장비·공정형 = 절차·계통 1순위 (`usage.md` §1) |
| 대체 규칙 | T3 미달 → 로그 눈금 무의미 · 연도 없으면 연표 아님 · 4항목 이상 계층화 · 포함 ≠ 적층 · 형상이 논지 아니면 인라인 SVG 금지 |
| 장비 일반화 특칙 | 장비 화면·버튼 배치를 그리지 않는다. 기능 분류·논리 흐름까지만 |

**W1의 실패에서 승계하는 절차 하나**: 배치표를 **JSON으로 함께 산출**하고 Do 종료 시 `verify-diagram-placement.mjs --plan`으로 **미이행을 기계 대조**한다. W1은 "미이행 0"을 손으로 세다 보조 7건을 놓쳤다.

---

## 1. W2 실측 (2026-08-12)

| 자료원 | 모듈 | 줄수 | 표 | ## | 유형 | 성격 |
|---|:--:|--:|:--:|:--:|---|---|
| `hs-basic-tech-2` | 15 | 3,043 | 58 | 83 | 개념형 | 전기·전자 심화 + 기계·제도 + 디지털·MCU |
| `hs-equipment-maintenance` | 14 | 2,636 | 71 | 81 | 장비·공정형 | **표 밀도 최고**(5.1/모듈) — 장비 설계·유지보수 |
| `hs-assembly-inspection` | 12 | 1,939 | 29 | 51 | 장비·공정형 | 후공정(조립·검사) |
| `hs-semicon-infra` | 10 | 1,526 | 10 | 30 | **특수** | **9모듈이 동일 3단 구조** — §2.4 참조 |
| `daegu-hs-process` | 10 | 2,912 | 33 | 55 | 장비·공정형 | **모듈당 291줄로 최대** · 주제가 W1과 겹쳐 재사용률 최고 |
| **합계** | **61** | **12,056** | **201** | **300** | | |

검산 — 15+14+12+10+10 = **61** ✓ (umbrella Plan §3 W2와 일치) / 3,043+2,636+1,939+1,526+2,912 = **12,056** ✓

### 1.1 W1과 다른 지점 셋

**① `TruthTable`이 드디어 쓰인다.** `digital-circuits`(397줄, 이 확대 전체 최대)에 **진리표가 9개**(AND·OR·NOT·NAND·NOR·XOR·3입력·반가산기·전가산기) 있다. W1은 12종 중 `TruthTable`을 한 번도 쓰지 않았는데, 이 모듈이 그 컴포넌트의 존재 이유다.

**② `hs-semicon-infra`가 구조적으로 특수하다.** 10모듈 중 **9모듈이 완전히 같은 3단 구조**다 — `## 1. 유해 요인 노출` → `## 2. 몸이 보내는 신호(건강 영향)` → `## 3. 어떻게 막나(작업 환경 관리)`. 이는 **같은 배정을 9번 반복**하면 된다는 뜻이고, 동시에 **9모듈이 시각적으로 똑같아 보일 위험**이 있다(§2.4).

**③ `daegu-hs-process`가 W1 판정을 가장 많이 재사용한다.** `etch`(습식/건식)·`oxidation`(건식/습식)·`thin-film`(PVD/CVD/ALD)·`photo`(7단계)·`doping`(확산/이온주입)이 `hs-photo-etch`·`hs-thinfilm-diffusion`에서 이미 판정한 주제다. 단 **관점이 다르다** — W1은 장비 기술자의 눈, daegu는 공정의 눈이라 같은 주제에 다른 도해가 붙는다(중복이 아니다).

---

## 2. Step 0 — 전수 배치 매핑 (61행)

표기 — **주**: 전수 커버리지 대상(미이행 0 필수) · **보조**: 확정 추가분 · **⚠**: 조건부(Do에서 MDX 근거 확인 후 채택/탈락, 분모 제외)

### 2.1 `hs-basic-tech-2` (15모듈) — 개념형

| 모듈 | 주 도해 | 근거 | 보조 |
|---|---|---|---|
| `digital-circuits` | **`TruthTable`** — 기본 논리 게이트(AND·OR·NOT) | §4 표4~6 | `TruthTable` 전가산기 표12 · `FlowSteps` 논리 회로 설계 5단계 §5 |
| `ac-circuits` | `CompareCards` 3열 — R·L·C가 교류에서 다르게 구는 법 | §3 표1 | `FlowSteps` 직류 전원 4단계 표2 · ⚠`CurvePlot` 정류 파형 §5 |
| `arduino-practice` | `TreeBranch` — 8개 실습의 입력→출력 계열 | §9 표4 | `FlowSteps` LED 5개 순차 점등 §7 |
| `microprocessor-basics` | `NodeGraph` — 마이크로컴퓨터 3대 부품(CPU·메모리·입출력 포트) | §4 표2 | `TreeBranch` 기억장치 RAM/ROM 계열 표3·표4 |
| `microprocessor-practice` | `FlowSteps` — 코드가 칩에 들어가기까지 4단계 | §1 표1 | `CompareCards` 실습 변형 대조 표2 |
| `electropneumatic-circuits` | `CompareCards` 3열 — a·b·c접점 | §2 표1 | `TreeBranch` 기본 논리 회로 7가지 표3 · `FlowSteps` 신호가 움직임이 되는 다섯 실행 단계 §7 (초안 순차 작동 설계) |
| `electrohydraulic-circuits` | `TreeBranch` — 밸브 세 갈래(유량·방향·압력) | §1~4 | `CompareCards` 중립 위치 형식(차단·바이패스·플로트) 표3 (초안 방향제어 호칭) · `TreeBranch` 논리 회로 표7 |
| `hydraulics-practice` | `TreeBranch` — 8개 실습의 회로 차이 계열 | §4 표1 | `FlowSteps` 실습 공통 절차 §1 |
| `pneumatics-practice` | `TreeBranch` — 세 실습이 쌓아 올리는 것 | §1 표1 | `CompareCards` 직접 조작 vs 파일럿 조작 §2 |
| `pneumatics-maintenance` | `TreeBranch` — 고장 증상 5가지와 원인 | §3 표1 | `FlowSteps` 공압 실린더 관리 3단계 §6 |
| `machine-tools` | `TreeBranch` — 선반의 네 기둥 (초안 `LabeledFigure` — §4.1 금지) | §2 | `CompareCards` 평형(영국식) vs 산형(미국식) 표2 · `FlowSteps` 다단축 가공 §5 |
| `equipment-manufacturing` | `TreeBranch` — 가공법 두 갈래(절삭·성형) | §2 표2 | `FlowSteps` 미세 가공 단계 표3 · `TreeBranch` 정밀 가공 도전 과제 표5 |
| `cad-drafting` | `CompareCards` — 손 제도 vs CAD | §1 표1 | `TreeBranch` 명령어 갈래 표2 |
| `special-projections` | `CompareCards` 3열 — 축측·사·투시 투상 | §5 표2 | `TreeBranch` 축측 투상 세 종류 표1 |
| `development-drawings` | `TreeBranch` — 전개법과 알맞은 입체 | §3 표1 | `CompareCards` 상관선의 모양 평면·곡면 (초안 `FlowSteps` — 작도 절차가 본문에 없음, §2.7) |

**소계**: 주 15 · 보조 20 · ⚠ 1

### 2.2 `hs-equipment-maintenance` (14모듈) — 장비·공정형

| 모듈 | 주 도해 | 근거 | 보조 |
|---|---|---|---|
| `industry-trend` | `TreeBranch` — 장비 개발 5단계와 직무 | §3 표2 | ⚠`ValueBars` 세계 기업 점유율 표1 |
| `maintenance-fundamentals` | `CompareCards` — 예방 보전 vs 사후 보전 | §3 표3 | `TreeBranch` 유지 보수 다섯 얼굴 표2 |
| `maintenance-setup` | `FlowSteps` — 셋업 6단계(반입→성능 검증) | §1 표1 | `FlowSteps` 검수 6단계 표2 |
| `maintenance-by-type` | `TreeBranch` — 장비 유형별 정비 5계열 | §1~5 | `CompareCards` 진공 펌프 종류 표1 · `TreeBranch` 광학 장비 진단 표4 |
| `design-concept-mechanical` | `FlowSteps` — 장비가 태어나는 네 단계 | §1 표1 | `NodeGraph` 팹 안의 자리(플레넘·이송·공정 모듈) §6~8 · `TreeBranch` 유틸리티 표9 |
| `design-electrical` | `NodeGraph` — CTC·TMC·PMC 제어 계층 | §2 표2 | `TreeBranch` 전원 설계 계열 표3 · `FlowSteps` 인터로크 보호 단계 표7 |
| `design-control-software` | `NodeGraph` — PC와 PLC가 나눠 맡는 일 | §1 표1 | `TreeBranch` 통신 네트워크·SECS/GEM 표4·표5 |
| `element-vacuum-gas` | **`ValueBars`** — 진공 세 단계와 펌프 (Torr 자릿수 차 큼) | §2 표2 | `TreeBranch` 공정 가스 세 얼굴 표3 · `NodeGraph` 유해 가스 마지막 방어선 §5 |
| `element-power` | `CompareCards` — 일반 전원 vs 제어 전원 | §1 표1 | `TreeBranch` 노이즈 종류와 제거 표2 |
| `element-plasma` | `NodeGraph` — RF 전력 시스템 (초안 `LayerStack` band — 플라스마는 에너지 축이 아님, §3) | §3 | `CompareCards` 왜 식각·증착에 플라스마를 쓰나 §2 |
| `element-pneumatic-thermal` | `FlowSteps` — 압축 공기가 만들어지는 3단계 | §3 표1 | `ValueBars` 공정별 온도 범위(상온~1200℃) 표3 · `CompareCards` 열 기술 방식 표4 |
| `process-wafer-photo` | `CompareCards` — 초크랄스키(CZ) vs 플로트존(FZ) | §1 표1 | `FlowSteps` 잉곳→웨이퍼 가공 5종 표2 |
| `process-etch-deposition` | `CompareCards` — 습식 vs 건식 에칭 | §1 표1 | `TreeBranch` 건식 챔버 다섯 계통 표2 · `CompareCards` 3열 APCVD/LPCVD/PECVD 표4 |
| `process-frontend-backend` | `FlowSteps` — 후공정 흐름(다이싱→본딩→몰딩→검사) | §6~8 | `NodeGraph` 이온 주입 장비 구성 표1 |

**소계**: 주 14 · 보조 19 · ⚠ 1

### 2.3 `hs-assembly-inspection` (12모듈) — 장비·공정형(후공정)

| 모듈 | 주 도해 | 근거 | 보조 |
|---|---|---|---|
| `packaging-overview` | `FlowSteps` — 조립 공정 8단계 지도 | §3 표2 | `TreeBranch` 패키지의 네 가지 일 표1 · `CompareCards` TSOP vs FBGA 표3 |
| `inspection-overview` | `CompareCards` — 웨이퍼 레벨 vs 패키지 레벨 검사 | §2 표1 | `FlowSteps` 프로브 테스트 단계 표2 · `TreeBranch` 패키지 테스트 종류 표5 |
| `sawing-process` | `TreeBranch` — 쏘잉 공정 여섯 요소 | §2 표1 | `CompareCards` 장비별 웨이퍼 크기·재질 표2 |
| `sawing-equipment` | `NodeGraph` — 쏘잉 머신 네 계통 | §3 표2 | `LayerStack` 테이프 마운터(웨이퍼·테이프·프레임) §2 |
| `sawing-operation` | `FlowSteps` — 준비 → 본 작업 → 종료 | §1~3 | `TreeBranch` 안전 수칙과 이유 표4 · `CompareCards` 절삭 방식 표3 |
| `sawing-practice` | `TreeBranch` — 실습과제와 점검 부위 계열 | §1~2 표2 | `Timeline` 점검 주기 표4 |
| `diebond-process` | `LayerStack` — 리드 프레임 위에 칩이 올라선 단면 | §2~3 | `CompareCards` 다이 본더가 하는 두 갈래 일 §4 (초안 장비를 나누는 기준) |
| `diebond-equipment` | `NodeGraph` — 서보·마운트·디스펜서·옵틱 구성 | §1~5 표1 | `FlowSteps` 리드 프레임의 여정(로더→언로더) §4 |
| `diebond-operation` | `FlowSteps` — 초기화 → 에폭시 셋팅 → 카세트 로딩 | §2~4 | `TreeBranch` 조작의 큰 그림 §1 |
| `diebond-practice` | `Timeline` — 점검 주기(매일·매월·매년) | §4 표2 | `TreeBranch` 유지보수 부위별 관리 표1 |
| `probe-test` | `NodeGraph` — 프로버의 세 축 | §2 표1 | `FlowSteps` 셋업→테스트 조작 논리 §3 |
| `particle-counter` | `FlowSteps` — 빛이 지나가는 길(광학계) | §3 | `CompareCards` 검출 방식 강점·약점 표2 · `TreeBranch` 측정 용어 표1 |

**소계**: 주 12 · 보조 16 · ⚠ 0

### 2.4 `hs-semicon-infra` (10모듈) — 특수: 9모듈 동일 구조

**구조가 같다는 것이 기회이자 위험이다.** 9모듈(`safety-photo`·`safety-etch`·`safety-diffusion`·`safety-deposition`·`safety-cmp`·`safety-ion-implant`·`safety-backend-chemical`·`safety-backend-test`·`safety-backend-mechanical`)이 **노출 → 건강 영향 → 관리** 3단으로 같다. 같은 배정을 9번 반복하면 **9모듈이 시각적으로 똑같아 보인다.**

**해법 — 같은 축을 쓰지만 그리는 대상을 모듈의 고유 내용으로 가른다.**

| 모듈 | 주 도해 | 근거 | 보조 |
|---|---|---|---|
| `safety-photo` | `TreeBranch` — 작업 단계별 노출 물질 | §1 표1 | `FlowSteps` 공정 단계별 노출 지점(HMDS→도포·노광→현상→PM) §3 (초안 관리 대책 위계 — 본문에 위계 서술 없음) |
| `safety-etch` | `CompareCards` — 습식이냐 기체냐(방식별 노출) | §1 표1 | `TreeBranch` 건강 영향 계열 §2 |
| `safety-diffusion` | `TreeBranch` — '멈췄을 때' 새어 나오는 위험 | §1 표1 | `FlowSteps` 정비 시 노출 차단 순서 §3 |
| `safety-deposition` | `TreeBranch` — 물질 구분(가스·전구체·부산물) | §1 표1 | `CompareCards` 밀폐 중 vs 열 때 §1 |
| `safety-cmp` | `TreeBranch` — 문을 여는 순간의 노출 | §1 표1 | `FlowSteps` 슬러리 취급 관리 §3 |
| `safety-ion-implant` | `TreeBranch` — 가스와 방사선 두 갈래 | §1 표1 | `CompareCards` 두 위험의 대책 차이 §3 |
| `safety-backend-chemical` | `TreeBranch` — 네 공정, 네 노출 순간 | §1 표1 | `FlowSteps` 화학물질 취급 공통 원칙(배기·냉각 뒤 개방) §1 (초안 노출 지점 — 주 TreeBranch와 겹쳐 대책으로 전환) |
| `safety-backend-test` | `TreeBranch` — 같은 '검사'인데 다른 위험 | §1 표1 | `CompareCards` 공정별 노출 대조 §1 |
| `safety-backend-mechanical` | **`FlowSteps`** — 후면 연마 → 절단 → 칩 접착 (표 없는 유일 모듈) | §1~3 | `TreeBranch` 공정별 유해 물질 §1~3 |
| `safety-management` | `CompareCards` — 클린룸과 방진복, 무엇을 지키나 | §1 표1 | **`ValueBars`** FED·ISO 등급별 입자수(자릿수 차 큼) 표2 · `FlowSteps` 보호구 착용 순서 §3 |

**소계**: 주 10 · 보조 11 · ⚠ 0

> **반복 억제 규칙**: 9모듈의 주 도해가 전부 `TreeBranch`가 되지 않도록 `safety-etch`는 `CompareCards`(방식 대조가 §1의 논지), `safety-backend-mechanical`은 `FlowSteps`(표가 없고 3공정 순서가 뼈대), `safety-management`은 `CompareCards`로 갈랐다. 결과 `TreeBranch` 7 · `CompareCards` 2 · `FlowSteps` 1.

### 2.5 `daegu-hs-process` (10모듈) — W1 재사용 최고

| 모듈 | 주 도해 | 근거 | 보조 |
|---|---|---|---|
| `process-overview` | `FlowSteps` — 8대 공정 | §1 표1 | `CompareCards` CZ vs FZ 표3 · `TreeBranch` 전공정 세 구간(FEOL·MOL·BEOL) §3 (초안 클린룸 관리) |
| `photo` | `FlowSteps` — 포토 공정 7단계 | §3 표1 | ⚠`ValueBars` 광원 파장 표2 · `TreeBranch` 광원의 세 계보(수은등·엑시머·EUV) §6 (초안 분해능 향상 기술 RET) |
| `etch` | `CompareCards` — 습식 vs 건식 식각 | §4 표2 | `TreeBranch` 막질별 식각 가스 표3 · `CompareCards` 3열 CCP·ICP·ECR 표4 |
| `thin-film` | `CompareCards` 3열 — PVD · CVD · ALD | §6 표3 | `TreeBranch` CVD 반응 다섯 유형 · `CompareCards` APCVD·LPCVD·PECVD (초안 `LayerStack` — 단면 서술 없음, §2.7) |
| `oxidation` | `CompareCards` — 건식산화 vs 습식산화 | §3 표2 | `CompareCards` LOCOS vs STI 표1 · `LayerStack` 산화막 성장 §3 |
| `doping` | `CompareCards` — 확산 vs 이온주입 | §1 표1 | `CompareCards` 3열 어닐링 방식 표2 · `CompareCards` 동종·이종에피 (초안 `LatticeDiagram` — 도펀트 원소 미명시, §2.7) |
| `metallization` | `TreeBranch` — 배선 재료와 자리 | §배선 재료 표3 | `FlowSteps` 구리 전해도금 3반응 (초안 `ValueBars` — 비저항 0.22자릿수, §2.7) · `LayerStack` 텅스텐 플러그 단면 §3 |
| `cmp` | `NodeGraph` — CMP 장비 구성 | §3 표2 | `TreeBranch` CMP 세 목적 (초안 `FlowSteps` — 순서 아님, §2.7) · `CompareCards` 막 종류별 슬러리 표3 |
| `cleaning` | `CompareCards` — 습식세정 vs 건식세정 | §4 표3 | `TreeBranch` 오염 종류와 문제 표1 · `TreeBranch` 세정 약액 계열 (초안 `FlowSteps` — 순서 아님, §2.7) |
| `equipment-parameters` | **`ValueBars`** — 진공 압력(Torr/Pa 자릿수 차) | §2 표3 | `NodeGraph` 공정 설비 챔버 구성 표1 · `TreeBranch` 플라즈마 반응 표6 |

**소계**: 주 10 · 보조 19 · ⚠ 1

### 2.6 W2 집계와 교차 검증

| 자료원 | 모듈 | 주 | 보조 | ⚠ | 계획 인스턴스 |
|---|:--:|:--:|:--:|:--:|:--:|
| `hs-basic-tech-2` | 15 | 15 | 20 | 1 | 35 |
| `hs-equipment-maintenance` | 14 | 14 | 19 | 1 | 33 |
| `hs-assembly-inspection` | 12 | 12 | 16 | 0 | 28 |
| `hs-semicon-infra` | 10 | 10 | 11 | 0 | 21 |
| `daegu-hs-process` | 10 | 10 | 19 | 1 | 29 |
| **합계** | **61** | **61** | **85** | **3** | **146** |

교차 검증 — 모듈 15+14+12+10+10 = **61** ✓ (umbrella Plan §3 W2와 일치) / 주 = 모듈 수 **61** ✓ (전수 커버리지) / 보조 20+19+16+11+19 = **85** ✓ / 인스턴스 35+33+28+21+29 = **146** ✓ = 61+85 ✓ / ⚠ 1+1+0+0+1 = **3**

> **초안 정정 (2026-08-12)**: 초안 §2.6은 보조 96 · 계획 157로 적었으나 **틀렸다.** 배치표를 JSON으로 옮겨 `verify-diagram-placement.mjs`의 대조 로직으로 기계 검산하니 실제는 **보조 85 · 계획 146**이었다 — 절별 소계를 손으로 세면서 부풀렸다. W1 Check에서 "보조 미이행 7건"을 놓친 것과 **같은 실패 유형(손으로 센 집계)**이며, 이번에는 배치표 JSON이 배정 단계에서 잡았다.

**밀도** 146 ÷ 61 = **2.39/모듈**. W1은 2.42, 기준선은 1.44다.

**컴포넌트 분포 (계획)**

| 컴포넌트 | 주 | 보조 | 계 | W1 실적 |
|---|:--:|:--:|:--:|:--:|
| `TreeBranch` | 24 | 26 | **50** | 26 |
| `CompareCards` | 13 | 26 | **39** | 25 |
| `FlowSteps` | 13 | 20 | **33** | 30 |
| `NodeGraph` | 8 | 4 | **12** | 6 |
| `LayerStack` | 2 | 2 | **4** | 15 |
| `ValueBars` | 1 | 3 | **4** | 2 |
| `TruthTable` | 0 | 2 | **2** | **0** |
| `Timeline` | 0 | 2 | **2** | 1 |
| `LatticeDiagram` | 0 | 0 | **0** | 5 |
| `CurvePlot` | 0 | 0 | **0** | 1 |
| `ScaleRuler` | 0 | 0 | **0** | 1 |
| `LabeledFigure` | 0 | 0 | **0** | 0 |
| **계** | **61** | **85** | **146** | 109 |

> **분포표 정정 (2026-08-12, Check)**: 이 표의 초판은 **§2.7 대체 5건 반영 전 배치표**로 계산돼 실측과 어긋났다(`TreeBranch` 48→50 · `CompareCards` 37→39 · `FlowSteps` 34→33 · `LayerStack` 5→4 · `ValueBars` 5→4 · `LatticeDiagram` 1→0). 합계 146은 맞았으나 구성이 틀렸다.
> **이 확대에서 손으로 옮긴 집계가 세 번 틀렸다** — W1 보조 미이행 7건 누락 · W2 §2.6 계획 157(실제 146) · 이 분포표. 그래서 `verify-diagram-placement.mjs`가 **구현에서 분포를 직접 출력**하도록 고쳤다(2026-08-12). 앞으로 문서에 적는 수치는 배치표가 아니라 그 출력을 옮긴다.

읽을 것:

- **`TruthTable` 2건 — 12종 중 마지막 미사용 컴포넌트가 쓰인다.** `digital-circuits`의 진리표 9개가 근거다.
- **`TreeBranch`가 48건으로 압도적 1위** — 분류 체계가 W2 다섯 자료원 전부의 뼈대다. 특히 `hs-semicon-infra` 9모듈의 "언제·무엇에 노출" 표가 전부 계층 구조다.
- **`NodeGraph` 6 → 12로 배증** — `hs-equipment-maintenance`의 제어 계층(CTC·TMC·PMC)·PLC 구조, 후공정 장비 구성이 계통도다.
- **`LayerStack` 15 → 5로 급감** — W2는 단면보다 계통·절차·분류가 중심이다. 단면이 남는 곳은 `daegu`의 공정 모듈(산화막·플러그·박막)과 `diebond-process`·`sawing-equipment`뿐.
- **`LabeledFigure` 0 유지** — `machine-tools` 선반 네 기둥이 후보였으나 `usage.md` §4.1을 적용해 `TreeBranch`로 배정했다(§3 참조).
- **`ScaleRuler` 0** — W2에 크기 감각이 논지인 대목이 없다.

---

### 2.7 Do 중 대체 기록 (`daegu-hs-process` 5건 · 2026-08-12)

배정을 바꿀 때는 근거를 남긴다(`usage.md` §1 대체 판정표). **배치표 JSON도 함께 갱신**해야 스크립트가 대체와 미이행을 구별한다 — 갱신하지 않으면 C-1이 미이행으로 잡는다(실제로 5건이 잡혔고, 그것이 이 절을 쓰게 된 계기다).

| 모듈 | 배정 → 실제 | 근거 |
|---|---|---|
| `thin-film` | `LayerStack` → `CompareCards` | §1~2에 **단면 서술이 없어** `LayerStack`의 데이터 근거가 없다. 표2(APCVD·LPCVD·PECVD)가 3열 대조로 성립한다 |
| `doping` | `LatticeDiagram` → `CompareCards` | MDX가 **도펀트 원소를 명시하지 않아** `center`를 근거 있게 고를 수 없다(`usage.md` §2.1 — 원문에 없는 값 금지). 표3(동종/이종에피)로 대체 |
| `metallization` | `ValueBars` → `FlowSteps` | 비저항 1.59~2.66 μΩ·cm = **1.67배(0.22 자릿수)**로 T3 미달. 표1(Cu 전해도금 해리→산화→환원)이 순서라 `FlowSteps`가 맞다 |
| `cmp` | `FlowSteps` → `TreeBranch` | 표3의 세정은 **막별 방식 나열이지 순서가 아니다.** 표1(CMP 세 목적)이 분류라 `TreeBranch`로 |
| `cleaning` | `FlowSteps` → `TreeBranch` | RCA 계열(SC-1·SC-2·SPM·DHF·FPM)은 **제거 대상별 분류이지 순서가 아니다** |

| `development-drawings` | `FlowSteps` → `CompareCards` | **Check에서 적발.** 초안 FlowSteps는 "보조선 긋기 → 교점 찾기 → 이어 그리기"였으나 §4에는 **보조평면·교점법이 없다** — 절차를 창작한 것이다(§2.1 위반). §4가 실제로 말하는 것은 "두 표면이 모두 평면이면 직선, 어느 한쪽이라도 곡면이면 곡선"이라 `CompareCards`로 교체 |

**⚠조건부 판정** — `photo` 광원 파장 `ValueBars` **탈락**: 436nm → 13.5nm = **32배(1.51 자릿수)**로 T3 미달. W1 `exposure-equipment`(2.26배)와 같은 판정이며, EUV가 포함돼 범위가 넓어졌어도 여전히 기준 미달이다. 대신 광원을 계보(수은등·엑시머 레이저·극자외선)로 묶어 `TreeBranch`로 그렸다.

---

## 3. 배정 판단 두 건 — 미리 기록

**① `element-plasma`에 band 모드를 쓰지 않는다.** 플라스마는 물질 상태이지 **에너지 축이 아니다.** `band-*` tone은 에너지 전용이라(`usage.md` §3) `LayerStack orientation="band"`는 부적합하다 — RF 전력 시스템의 계통을 `NodeGraph`로 그린다. W1에서 `etcher-structure` 플라스마 공간에 `band-gap`을 쓰려던 실수를 되풀이하지 않기 위해 배정 단계에서 못 박는다.

**② `machine-tools` 선반 네 기둥은 `LabeledFigure`가 아니다.** 주축대·왕복대·심압대·베드의 **공간 배치**를 그리려면 인라인 SVG가 필요하지만, 본문이 가르치는 것은 각 기둥이 **무엇을 맡는가**다 — `usage.md` §4.1의 판정 기준("형상 자체가 논지인가")에 따라 `TreeBranch`로 간다.

---

## 4. ⚠조건부 3건 — Do에서 판정

| 모듈 | 후보 | 예상 판정 | 근거 |
|---|---|---|---|
| `ac-circuits` | `CurvePlot` 정류 파형 | **채택 유력** | §5가 반파·전파 정류 파형 형상을 서술하면 성립. W1 `dc-circuits`와 같은 유형 |
| `industry-trend` | `ValueBars` 기업 점유율 | **탈락 유력** | 점유율은 % 합이 100이라 자릿수 차가 생기지 않는다(T3 미달). W1 시장규모와 같은 이유 |
| `photo` (daegu) | `ValueBars` 광원 파장 | **탈락 유력** | W1 `exposure-equipment`에서 436→193nm = 2.26배(0.35자릿수)로 이미 탈락. daegu 표2도 같은 범위일 것 |

---

## 5. 제작 순서와 배치

```
① hs-semicon-infra 10   — 9모듈 동일 구조. 반복 억제 규칙(§2.4)을 먼저 검증
      ↓ 게이트
② daegu-hs-process 10   — W1 재사용 최고. 모듈당 291줄로 최대
      ↓
③ hs-assembly-inspection 12 — 후공정 장비·공정형
      ↓
④ hs-basic-tech-2 15    — TruthTable 첫 사용(digital-circuits)
      ↓
⑤ hs-equipment-maintenance 14 — 표 밀도 최고
      ↓
⑥ ⚠조건부 3건 판정 → 문서 갱신 → 게이트 전수
```

**①을 먼저 두는 이유**: 9모듈이 같은 구조라 배정이 잘못되면 9배로 틀어진다. 가장 작은 자료원(10모듈·1,526줄)이면서 위험이 가장 집중된 곳이다.

---

## 6. 검증 (W1 게이트 승계 + 기계 대조)

| 게이트 | 조건 | 측정 |
|:--:|---|---|
| G-1 | `typecheck`·`lint` 무오류 | 명령 |
| G-2 | First Load JS 102kB · SSG 393 | `npm run build` |
| G-3 | 주 도해 **61/61** | 스크립트 C-1 |
| G-4 | 배치표 **미이행 0**(주·보조 모두) | **`--plan` 기계 대조** ← W1이 놓친 항목 |
| G-5 | 색 리터럴 0 · `idPrefix` 중복 0 | 스크립트 C-5·C-6 |
| G-6 | 본문 무수정 · 빈 줄 규약 | `git diff` 삭제 0 + 스크립트 C-4 |
| G-7 | 모듈 간 값 이동 0 | 스크립트 C-2 |
| G-8 | tone 유효성 · cross-link·quotes 회귀 0 | 스크립트 C-3 + 산출물 비교 |
| G-9 | **육안 확인** | 사람 — **W1분(45모듈)이 아직 미완이다** |
| G-10 | ⚠조건부 3건 근거 기록 | 문서 |
| G-11 | `usage.md` W2 실적용 갱신 | 문서 |

> **G-9 경고**: W1 109 인스턴스가 미확인인 상태에서 W2 157건을 더하면 미확인 분량이 **266건**이 된다. Design(umbrella) §4가 "45모듈을 다 그린 뒤 색 대비 문제를 발견하면 전량 재작업"이라 경고했고, W2 완주 시 그 규모가 **2.4배**가 된다.

## 7. 다음 단계

→ **§5 ①부터 Do 착수** (`hs-semicon-infra` 10모듈)
