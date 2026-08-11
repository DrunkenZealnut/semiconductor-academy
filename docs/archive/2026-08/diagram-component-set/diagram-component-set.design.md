# Design — 자체 도해 컴포넌트 세트

> **Feature**: `diagram-component-set`
> **작성일**: 2026-08-09 · **Level**: Dynamic
> **Plan**: `docs/01-plan/features/diagram-component-set.plan.md`
> **선례**: `first-semiconductor-primer`(파일럿 게이트·배치 확대 방식) · `deep-layer-refactor`(콘텐츠 컴포넌트 규약)

---

## 0. Plan 대비 변경 1건 (승인 완료)

| # | Plan 기재 | Design 조사 결과 | 조치 |
|:--:|---|---|---|
| **V-1** | 도해 컴포넌트 **8종**으로 97모듈 커버 (Plan §3) | Step 0 전수 배치 중 **8종으로 주 도해가 성립하지 않는 22모듈**이 드러났다. 원인은 5개 정보 패턴이 8종에 없기 때문 — 분류 트리(7모듈)·특성 곡선(5)·기능 블록도(5)·원자 결합 격자(4)·연표(4). Plan R-2가 예측한 상황이나 규모가 예상보다 컸고, `LabeledFigure`로 22개를 개별 처리하면 **Phase 2에서 탈락시킨 B안(전용 SVG)으로 회귀**한다 | **12종으로 확대** (2026-08-09 사용자 승인). `CircuitSchematic`을 **`NodeGraph`로 일반화**해 회로도와 블록도를 하나로 흡수(13모듈)하고, **`TreeBranch`·`CurvePlot`·`LatticeDiagram`·`Timeline`** 4종 추가. `LatticeDiagram`은 003~006 네 모듈이 거의 같은 구조라 1회 제작으로 전부 커버된다 |
| **V-2** | 1차 **4종** + 파일럿 4모듈 (Plan §5.2) | 초판 §5.3·§5.4가 파일럿 019·029에 **아직 만들지 않은 `NodeGraph`를 요구**했다(2차 예정). 또 Plan이 019에 지정했던 `CompareCards`가 Design에서 빠져 **파일럿이 최다 사용 컴포넌트 2위(26회)를 한 번도 검증하지 않는** 상태였다 | `NodeGraph`를 **1차로 승격**해 1차 5종, 파일럿을 **5모듈**로 확대(`063-thin-film` 추가 — `CompareCards` 검증). 1차 5종이 주 도해 73%를 커버한다 |

> V-2는 `design-validator` 검증(2026-08-09) H-3·H-4 지적을 반영한 것이다. 같은 검증에서 나온 나머지 수정은 해당 절에 직접 반영했다 — §1.2 `col-3` 누락(H-1)·§1.3 집계 오류(H-2)·§2 `idPrefix`(M-7)·§7 수치 정정(M-1·M-2).

### Do 단계 정정 2건 (2026-08-09, 구현 중 발견)

| # | Design 기재 | 구현 결과 | 조치 |
|:--:|---|---|---|
| **V-3** | SVG를 렌더하는 도해는 `idPrefix` **필수** (§2.1) | 실제로 전역 `id`를 만드는 것은 `<defs>`를 쓰는 **`LayerStack`(pattern)·`NodeGraph`(marker) 2종뿐**이다. `LatticeDiagram`·`ScaleRuler`·`CurvePlot`·`LabeledFigure`는 SVG를 렌더하지만 전역 id를 만들지 않아 `idPrefix`가 미사용 인자로 남았다(lint 경고) | 필수 조건을 "SVG를 쓰는 도해"에서 **"전역 `id`를 만드는 도해"**로 좁혔다. 4종은 `DiagramCommon`으로 내렸다. `LabeledFigure`는 저작자가 인라인 SVG에서 직접 고유 id를 쓴다 |
| **V-4** | `col-8`(신뢰성) 주 도해 = `CurvePlot` **욕조 곡선** (§1.2 트랙 8) | 모듈 원문에 **욕조 곡선 서술이 없다**. 다루는 것은 FIT 단위·가속 시험·전수/표본 검사다. §2.3 규약("형상 서술이 원문에 없으면 `CurvePlot`을 배정하지 않는다")에 정면으로 걸린다 | `col-8` 주 도해를 **`CompareCards`**(전수 검사 vs 표본 검사)로 교체. `CurvePlot`의 실사용처는 형상 서술이 확실한 **017 I_D–V_D**(보조)로 옮겼다 — 원서가 축·파라미터·곡선 다발을 명시한다 |

> V-4는 §2.3 규약이 실제로 작동한 사례다. 규약이 없었다면 원문에 없는 곡선을 창작할 뻔했다.

| # | Design 기재 | 구현 결과 | 조치 |
|:--:|---|---|---|
| **V-5** | 자수 측정은 §5.1과 동일한 정규식 체인 — `<[^>]+>`로 태그 제거 (§7·baseline) | 이 정규식이 **도해 JSX 블록을 통째로 삼킨다**. `<LayerStack … />`처럼 내부에 `>`가 없으면 블록 전체가 한 태그로 매칭돼 사라지고, 내부에 `<strong>`·`<>` 같은 중첩 태그가 있으면 **거기서 끊겨 나머지 텍스트가 남는다**. 그래서 같은 작업인데 011은 ±0, 018은 +141로 잡혔다 — **측정이 도해 내부 JSX 구성에 좌우된다** | 도해 컴포넌트 블록을 **줄 단위로 통째 제거**한 뒤 세도록 검증 로직을 고쳤다(`<Xxx`로 시작하는 줄부터 `/>`로 끝나는 줄까지). 이 기준에서 도해는 자수에 전혀 산입되지 않으므로, 표를 도해로 옮기면 **감소만** 나타난다 |

> V-5의 실측 결과 **도해를 제외하고 세어도 적용 32모듈 전부가 §5.1 하한 이상**이다(최대 감소 −141, 002). 즉 §7이 마련한 "baseline 산입" 보정은 아직 한 번도 필요하지 않았다. 보정 규칙은 하한 근접 6모듈(`030` +25 등)에 도해를 넣을 때를 대비해 유지한다.

### Check 이후 정정 1건 (2026-08-10, Gap-2 해소)

| # | Design 기재 | Check 결과 | 조치 |
|:--:|---|---|---|
| **V-6** | §1.2 배치표가 025·050에 `Timeline`, 087에 `ValueBars`, col-4·col-6에 `CompareCards`를 지정 | 구현 중 **원문 근거가 없어 다른 컴포넌트를 썼는데 배치표를 정정하지 않았다** — §8.2가 요구한 대조 미수행. `gap-detector`가 주 도해 11모듈 불일치로 적발 | 12건 중 **7건은 배치표대로 채우고**(014 `LayerStack`·065·079 `CompareCards`·070·071·073·074 `FlowSteps`), **5건은 배치표를 실제에 맞춰 정정**했다: 025·050은 원서에 연도·세대 데이터가 없어 `Timeline` 불가, 087은 High-k 유전율 수치가 없어 `ValueBars` 불가, col-4·col-6은 대조가 아니라 계층이라 `TreeBranch`가 적합 |

> 정정 후 **배치표 미이행 0건**. 계획 131 대비 실제 140 인스턴스로, 계획에 없던 9건은 초과 적용분이다.

---

## 1. Step 0 — 배치 전수 매핑 (97모듈)

### 1.1 판정 방법

97모듈 전량에서 `hook`·`##` 섹션 제목·표 헤더·흐름 화살표 수·진리표 행수를 기계 추출한 뒤(`scripts` 미등록, 1회성 조사), 모듈마다 **주 도해(P)** 1개와 **보조(S)** 0~1개를 배정했다. 배정 기준은 "**이 그림이 없으면 무엇을 못 읽는가**"(Plan R-4) 한 줄이 쓰이는가이며, 쓰이지 않으면 장식으로 보고 배정하지 않았다.

### 1.2 트랙별 배치표

#### 트랙 1 — 반도체의 기초 (10모듈)

| 모듈 | 주 도해 | 보조 | 이 그림이 없으면 못 읽는 것 |
|---|---|---|---|
| 001 | `ValueBars`(로그·구간) | | 반도체 저항률 구간이 **13자리**에 걸친다는 폭 (본문 서술 그대로) |
| 002 | `TreeBranch` | | 재료축·불순물축 2중 분류의 가지 관계 |
| 003 | `LatticeDiagram` | | 실리콘의 손 4개가 이웃과 맞잡아 결정이 되는 그림 |
| 004 | `LatticeDiagram`(3연) | `CompareCards` | 단결정·다결정·비정질의 **배열 차이** — 글로는 구분 불가 |
| 005 | `LatticeDiagram` | | 인의 다섯 번째 손이 남아 자유전자가 되는 순간 |
| 006 | `LatticeDiagram` | | 붕소의 부족한 손 = 빈자리(정공) |
| 007 | `LayerStack`(밴드) | | 전도띠·금지대역·충만띠 3층과 물질별 폭 차이 |
| 008 | `LayerStack`(밴드) | | 도너·억셉터 준위가 금지대역 **어디에** 놓이는가 |
| 009 | `TreeBranch` | | III-V·II-VI 족 조합의 계통 |
| col-1 | `CompareCards` | | 산화물/유기물 반도체 대비 |

#### 트랙 2 — 반도체 소자 (14모듈)

| 모듈 | 주 도해 | 보조 | 이 그림이 없으면 못 읽는 것 |
|---|---|---|---|
| 010 | `CompareCards` | | 확산저항 vs 폴리실리콘 저항 |
| 011 | `LayerStack` | `CurvePlot` | MOS 용량 단면 + C-V가 전압에 따라 두 얼굴인 것 |
| 012 | `LayerStack` | | pn 접합의 고갈층이 순·역방향에서 넓어지고 좁아지는 것 |
| 013 | `LayerStack` | | 수광면을 왜 얇게 하는가 — 두께가 요점 |
| 014 | `LayerStack` | `ValueBars` | 재결합 위치 + 금지대역 폭 ↔ 색 |
| 015 | `LayerStack` | | 굴절률 다른 3층이 빛을 가두는 구조 |
| 016 | `TreeBranch` | | 캐리어·게이트·극성 3축 분류 |
| 017 ★ | `LayerStack` | `CurvePlot` | **게이트 전압이 없던 채널을 만드는** 단면 + I_D–V_D 곡선 다발 |
| 018 | `CompareCards` | `LayerStack` | 017 대비 전 극성 반전 |
| 019 ★ | `LayerStack` | `NodeGraph` | 웰로 두 소자를 한 기판에 담는 법 + 상보 회로 |
| 020 | `LayerStack` | | 게이트가 pn 접합인 구조 |
| 021 | `LayerStack` | | 금속을 반도체에 직접 붙인 쇼트키 게이트 |
| 022 | `LayerStack` | `CurvePlot` | npn 3층 + 출력 특성 |
| col-2 | `Timeline` | | 1947 벨연구소 전후 사건 순서 |

#### 트랙 3 — 집적회로·로직 (12모듈)

| 모듈 | 주 도해 | 보조 | 이 그림이 없으면 못 읽는 것 |
|---|---|---|---|
| 023 | `CompareCards` | | 조립 방식 vs 일괄 제조 |
| 024 | `TreeBranch` | | 구조·재료·신호 3축 분류 |
| 025 | `ValueBars` | | 길이 0.7배 → 면적 0.49배 (V-6 — 원문에 연도별 데이터가 없어 `Timeline` 불가) |
| 026 | `TreeBranch` | | 메모리·마이콤·ASIC·시스템IC 4갈래 |
| 027 | `TruthTable` | | AND·OR·NOT 기본 연산 |
| 028 | `TruthTable` | `NodeGraph` | 입력→출력 반전 + CMOS 구성 |
| 029 ★ | `TruthTable` | `NodeGraph` | **병렬이면 OR**임을 회로와 표로 동시에 |
| 030 | `TruthTable` | `NodeGraph` | 직렬이면 AND |
| 031 | `TruthTable` | `NodeGraph` | 반가산·전가산의 자리올림 전달 |
| 032 | `TruthTable` | | 빌림의 전파 |
| 033 | `TruthTable` | | 출력이 셋인 비교 |
| col-3 | `ValueBars` | `Timeline` | ENIAC 30톤·진공관 17,468개·150kW의 규모 감각 |

#### 트랙 4 — 메모리·기능별 IC (15모듈)

| 모듈 | 주 도해 | 보조 | 이 그림이 없으면 못 읽는 것 |
|---|---|---|---|
| 034 | `CompareCards` | | CISC/RISC 설계 철학 |
| 035 | `NodeGraph` | | MCU 한 칩 안 블록 구성 |
| 036 | `NodeGraph` | | DSP 신호 경로 |
| 037 | `CompareCards` | | GA/SCA/ECA 3종 |
| 038 | `CompareCards` | | ASIC vs PLD |
| 039 | `NodeGraph` | | 기판 위 칩들이 한 칩으로 들어가는 통합 |
| 040 | `FlowSteps` | `LayerStack` | 전하를 물통 나르듯 옮기는 이송 |
| 041 | `TruthTable` | `CurvePlot`(타이밍) | 클럭 순간에만 값이 갈리는 것 |
| 042 | `NodeGraph` | `TreeBranch` | 격자+주변회로 얼개 / 분류 2축 |
| 043 | `NodeGraph` | | 1T1C 셀과 워드·비트선 |
| 044 | `NodeGraph` | | 6T 셀의 교차 결합 |
| 045 | `CompareCards` | `NodeGraph` | NAND형·NOR형 셀 배열 차이 |
| 046 | `LayerStack` | | 게이트가 2층이고 전자가 갇히는 방 |
| 047 | `ValueBars` | `CompareCards` | SLC 2단계 → QLC 16단계로 **레벨이 배가**되는 것 (§3 표가 수치. V_TH는 정성값이라 곡선 불가) |
| col-4 | `TreeBranch` | | 소자 구조축·회로 특성축의 파라미터 계층 (V-6 — 계층 구조라 `TreeBranch`가 적합) |

#### 트랙 5 — IC 설계 (6모듈)

| 모듈 | 주 도해 | 보조 | 이 그림이 없으면 못 읽는 것 |
|---|---|---|---|
| 048 | `FlowSteps` | | 시장조사→고객평가 전 과정(화살표 15개 서술) |
| 049 | `FlowSteps`(하향) | `NodeGraph` | 위에서 아래로 내려가는 4계층 + 되돌아가는 피드백 |
| 050 | `ScaleRuler` | | 32nm의 크기 감각 (V-6 — 원서가 밝힌 노드가 32nm 하나뿐이라 `Timeline` 불가) |
| 051 | `LayerStack` | | 아래에서 위로 정해 나가는 단면 설계 변수 |
| 052 | `TreeBranch` | `FlowSteps` | 공정 유형 분류 + 순서 결정 |
| col-5 | `TreeBranch` | | IDM·파운드리·팹리스·팹라이트의 갈라짐 |

#### 트랙 6 — 웨이퍼 (7모듈)

| 모듈 | 주 도해 | 보조 | 이 그림이 없으면 못 읽는 것 |
|---|---|---|---|
| 053 | `CompareCards` | | 실리콘(silicon)·실리콘(silicone)·석영·수정의 혼동 정리 (물성표는 이종 단위라 막대 불가) |
| 054 | `FlowSteps` | | 돌→금속→기체 증류→고체 3공정 |
| 055 | `LabeledFigure` | | **CZ 인상** — 도가니·씨앗·회전·인상. 전용 도해 |
| 056 | `FlowSteps` | | 봉 다듬기→절단→연마 |
| 057 | `LayerStack` | | 게터링이 **표면이냐 벌크냐** — 위치가 논지 |
| 058 | `LayerStack` | | 에피층을 얹는 것과 BOX를 묻는 것의 차이 |
| col-6 | `TreeBranch` | | 특성 요구 항목의 계층 (V-6 — 대조가 아니라 열거) |

#### 트랙 7 — 전공정 (13모듈)

| 모듈 | 주 도해 | 보조 | 이 그림이 없으면 못 읽는 것 |
|---|---|---|---|
| 059 ★ | `FlowSteps` | | **전공정 80% / 후공정**의 전체 지도 |
| 060 | `FlowSteps` | `LayerStack` | 8단계와 그 결과 단면 |
| 061 | `FlowSteps` | `LayerStack` | 셀프 얼라인 — 게이트가 자가 되는 순서 |
| 062 | `FlowSteps` | `LayerStack` | 다마신: 파고→채우고→깎는다 |
| 063 | `CompareCards` | `LayerStack` | 열산화·CVD·스퍼터링 3방법 |
| 064 | `FlowSteps` | | 도포→노광→현상 |
| 065 | `CompareCards` | `LayerStack` | 이방성/등방성 **단면 모양** 차이 |
| 066 | `CompareCards` | `LayerStack` | 열확산과 이온주입의 농도 프로파일 |
| 067 | `ValueBars` | `CompareCards` | 목적별 온도대 |
| 068 | `LayerStack`(전/후) | | 평탄화 전후 — before/after가 논지 |
| 069 | `CompareCards` | | 용액별 제거 대상 |
| 070 | `FlowSteps` | | 프로브 검사와 리던던시 |
| col-7 | `ValueBars` | | 클래스별 청정도 자릿수 |

#### 트랙 8 — 후공정 (9모듈)

| 모듈 | 주 도해 | 보조 | 이 그림이 없으면 못 읽는 것 |
|---|---|---|---|
| 071 | `FlowSteps` | `ScaleRuler` | 0.775→0.3mm 박화 후 절단 |
| 072 | `FlowSteps` | | 리드프레임에 붙이기 |
| 073 | `FlowSteps` | | 와이어 본딩 4단계 동작 |
| 074 | `FlowSteps` | `CompareCards` | 트랜스퍼 몰딩 순서 |
| 075 | `FlowSteps` | | 버 제거→도금→표기→성형 |
| 076 | `TreeBranch` | | 스루홀/표면실장 분류 |
| 077 | `FlowSteps` | | 검사가 세 번인 이유 |
| 078 | `ScaleRuler` | `ValueBars` | 지름 1.5배 → 면적 2.25배 |
| col-8 | `CompareCards` | | 전수 검사와 표본 검사의 갈림 (V-4 — 원문에 욕조 곡선 서술 없음) |

#### 트랙 9 — 최첨단 기술 (11모듈)

| 모듈 | 주 도해 | 보조 | 이 그림이 없으면 못 읽는 것 |
|---|---|---|---|
| 079 | `CompareCards` | `LatticeDiagram` | 인장/압축이 격자에 주는 변화 |
| 080 | `LabeledFigure` | | **FinFET 입체** — 게이트가 세 면을 감싸는 구조. 전용 도해 |
| 081 | `FlowSteps` | | 액침·더블 패터닝 순서 |
| 082 | `ValueBars` | `ScaleRuler` | 193nm → 13.5nm 파장 도약 |
| 083 | `CompareCards` | | ML2 vs 나노 임프린트 |
| 084 | `CompareCards`(다열) | | 4후보 × 6지표 비교 |
| 085 | `LayerStack` | `CompareCards` | MTJ 두 자성층의 방향 |
| 086 | `CompareCards` | | PRAM/ReRAM 물리량 |
| 087 | `LayerStack` | `CompareCards` | High-k 적층 + 절연막·전극 동시 교체 (V-6 — 원서가 High-k의 유전율 수치를 제시하지 않아 `ValueBars` 불가) |
| 088 | `ValueBars`(양방향) | `CompareCards` | 한쪽은 올리고 한쪽은 내리는 **반대 방향** |
| col-9 | `CompareCards` | | More Moore / More than Moore |

### 1.3 커버율·컴포넌트별 사용 집계

§1.2 표를 기계 파싱해 계수한 값이다(손 계산이 아니다 — 초판의 손 집계는 6개 항목이 틀렸고 design-validator H-2가 잡아냈다).

| 컴포넌트 | 주 도해 | 보조 | 합 | 제작 순서 |
|---|:--:|:--:|:--:|:--:|
| `LayerStack` | 19 | 9 | **28** | 1차 |
| `CompareCards` | 21 | 5 | **26** | 1차 |
| `FlowSteps` | 18 | 1 | **19** | 1차 |
| `NodeGraph` | 6 | 9 | **15** | **1차** (V-2) |
| `ValueBars` | 8 | 5 | 13 | 2차 |
| `TreeBranch` | 10 | 1 | 11 | 2차 |
| `TruthTable` | 8 | 1 | 9 | 1차 |
| `LatticeDiagram` | 4 | 3 | 7 | 2차 |
| `CurvePlot` | 0 | 4 | 4 | 2차 |
| `ScaleRuler` | 2 | 2 | 4 | 2차 |
| `Timeline` | 1 | 1 | 2 | 2차 |
| `LabeledFigure` | 2 | 0 | 2 | 2차 |
| **합계** | **97** | **43** | **140** | |

`CurvePlot`은 V-4 이후 **주 도해 0**이다 — 항상 다른 도해의 보조로만 쓰인다. 원서가 곡선을 독립된 설명 수단으로 쓰지 않고 구조 설명에 딸린 특성으로만 다루기 때문이며, 커버율에는 영향이 없다(주 도해 합 97 유지).

**커버율 97/97 = 100%** — 배치표 행 수 97, 주 도해 없는 모듈 0, 모듈 중복 0 (파싱 검증). 주 도해 합이 배치표 행 수와 일치하므로 계수 정합이 성립한다. Plan DoD의 Design 완료 조건 충족.

1차 5종(`LayerStack`·`CompareCards`·`FlowSteps`·`NodeGraph`·`TruthTable`)이 주 도해 **71/97 = 73%**를 커버한다.

---

## 2. 컴포넌트 스펙 (12종)

### 2.0 배치 경로와 등록 (Plan FR-1·FR-3)

```
src/components/diagram/
  tokens.ts        공통 색·치수 토큰
  types.ts         공통 props 타입 (DiagramCommon)
  LayerStack.tsx  CompareCards.tsx  FlowSteps.tsx  NodeGraph.tsx  TruthTable.tsx   ← 1차
  ValueBars.tsx   TreeBranch.tsx    LatticeDiagram.tsx  CurvePlot.tsx
  Timeline.tsx    ScaleRuler.tsx    LabeledFigure.tsx                              ← 2차
  index.ts         12종 배럴 export
```

`mdx-components.tsx`의 `useMDXComponents`에 **12종 전부 전역 등록**한다. MDX에서 대문자 컴포넌트는 등록 없이는 렌더되지 않는다 — 등록 누락은 빌드가 아니라 **런타임 공백**으로 나타나므로 파일럿 게이트 G-1에서 눈으로 확인한다.

### 2.1 공통 props

전부 **서버 컴포넌트**. `'use client'` 없음.

```ts
interface DiagramCommon {
  caption?: string;      // 도해 제목 (<title>에도 사용)
  note?: string;         // 도해 아래 보조 설명
  altTable?: ReactNode;  // <details>에 넣을 동일 정보 표. 생략 시 caption+desc만
  idPrefix: string;      // 필수 — SVG 내부 id 네임스페이스
}
```

**`idPrefix`가 필수인 이유**: `<pattern>`·`<clipPath>`·`<marker>`는 문서 전역 `id`로 참조된다(`fill="url(#…)"`). §3.1이 p/n 구분에 채움 패턴을 의무화하고 §5에서 **한 페이지에 도해 2개 이상**이 오므로, 같은 컴포넌트가 두 번 렌더되면 두 번째가 첫 번째의 패턴을 참조한다. 서버 컴포넌트라 `useId()`를 쓸 수 없어(훅은 클라이언트 전용) **저작자가 MDX에서 지정**한다. 규약: `idPrefix="017-nmos"`처럼 모듈 슬러그를 쓰고, 한 모듈에 같은 종이 둘이면 `-1`·`-2`를 붙인다.

### 2.2 컴포넌트별 props

| # | 컴포넌트 | props (공통 props 외) |
|:--:|---|---|
| 1 | `LayerStack` | `layers: {id, label, tone, height?, wells?: {label, tone, side?}[]}[]`, `orientation?: 'vertical'\|'band'` ✅ **구현 완료**(diagram-set-finishing), `annotations?: {at: LayerId \| \`${LayerId}/${LayerId}\`, text}[]` — `at`은 **층 `id` 또는 두 층 경계**(`'gate/oxide'`) |
| 2 | `FlowSteps` | `steps: Step[]`(`Step = {id, label, sub?, tone?}`), `loop?: {from: StepId, to: StepId, label}`, `branch?: {at: StepId, label, steps: Step[]}[]` — 분기 자식도 `Step`, 최상위 `steps`와 **중복 기재 금지**, `orientation?: 'auto'\|'row'\|'column'` |
| 3 | `CompareCards` | `columns: {title, tone?}[]`, `rows: {aspect, values: ReactNode[]}[]`, `emphasis?: number[]` |
| 4 | `TruthTable` | `inputs: string[]`, `outputs: string[]`, `rows: (0\|1)[][]`, `highlight?: 0\|1\|null`(강조할 출력값. 함수형에서 단순화 — 서버 컴포넌트 간 함수 전달을 피한다) — **0/1만** 담는다. 정성값 표(`'0 (GND에 연결)'` 등)는 `NodeGraph` 라벨이나 `CompareCards`로 보낸다 |
| 5 | `ValueBars` | `rows: {label, value?, range?: [min,max], note?, tone?: Tone}[]`(`value`·`range` 택일), `unit`, `scale?: 'linear'\|'log'`, `direction?: 'up'\|'down'\|'diverging'` — `range`는 001 저항률 구간·067 온도대처럼 **구간이 논지**인 배정에 필수 |
| 6 | `ScaleRuler` | `marks: {label, meters}[]`, `refs?: {label, meters}[]` (일상 기준 병기) |
| 7 | `NodeGraph` | `nodes: {id, label, kind?: 'block'\|'device'\|'io'(기본 block), at: [col,row](필수 — 자동 배선을 하지 않으므로 좌표가 반드시 필요)}[]`, `edges: {from, to, label?, style?}[]`, `grid?: [cols,rows]` |
| 8 | `TreeBranch` | `root: string`, `branches: {label, note?, children?: (string\|{label, note?, children?})[]}[]`, `depth?: 2\|3` |
| 9 | `CurvePlot` | `axes: {x: {label, ticks?}, y: {label, ticks?}}`, `curves: {label, points: [number,number][], emphasis?: boolean}[]`(색 대신 강조 여부 — 곡선은 tone 팔레트가 아니라 강조/보통 2단만 쓴다), `markers?: {at, label}[]` |
| 10 | `LatticeDiagram` | `center?: 'Si'\|'P'\|'B'\|'As'\|'Ga'`(기본 `'Si'`), `arrangement?: 'crystal'\|'poly'\|'amorphous'`, `highlight?: 'free-electron'\|'hole'\|null` |
| 11 | `Timeline` | `events: {year, label, note?}[]`, `emphasis?: number[]` — ~~`span?`~~ **삭제**(diagram-set-finishing): 사용처 2곳이 전부 이벤트 목록만 쓰고, 세로 목록 렌더에는 시간 축 자체가 없어 현행 모델과 맞지 않는다 |
| 12 | `LabeledFigure` | `children: ReactNode`(인라인 SVG), `labels?: {x, y, text, pointTo?: [x,y], anchor?}[]`, `viewBox?`, `desc?`(생략 시 labels 텍스트 나열) |

> ✏️ **2026-08-11 `diagram-set-finishing` G-7 정정**: 위 표 7행을 **구현에 맞춰** 고쳤다(`TruthTable.highlight`·`NodeGraph.kind/at`·`CurvePlot.emphasis`·`LabeledFigure`·`ValueBars.tone`·`TreeBranch.note`·`LatticeDiagram.center`). 구현이 설계보다 나은 판단을 한 곳은 그 근거를 괄호에 남겼다. 이로써 **시그니처만 있고 미구현인 prop 0건**이 된다.

### 2.3 `CurvePlot` 데이터 출처 규약

원서에 곡선 **좌표**는 없다. 있는 것은 "포화한다"·"문턱을 넘으면 급증한다" 같은 **형상 서술**뿐이다. 따라서:

- `points`는 **정성적 형상만** 표현한다 — 단조 증가·포화·문턱·욕조 곡선 등. 원문에 없는 눈금 수치를 축에 찍지 않는다.
- `axes.ticks`는 **생략을 기본**으로 하고, 원문이 명시한 값(예: 문턱 전압 기호 `V_TH`)만 마커로 표기한다.
- 형상 서술이 원문에 없으면 `CurvePlot`을 배정하지 않는다. 이 규약 때문에 047은 초판의 `CurvePlot`에서 `ValueBars`로 바뀌었다(V_TH가 "높음/중간/낮음"의 정성값이라 곡선 형상이 원문에 없음).

### 2.4 `NodeGraph` 표현 한계 (Plan §11 확정 항목)

회로도와 블록도를 하나로 흡수하되 **자동 배선은 하지 않는다**. `at: [col,row]` 격자 좌표를 저작자가 지정하고 `edges`는 직교 경로(L자)로만 잇는다. 곡선 배선·소자 기호 자동 배치·교차 회피는 범위 밖 — 필요하면 `LabeledFigure`로 내려간다. 트랜지스터·저항·커패시터 기호는 `kind: 'device'` + `label`의 접두어(`nmos:`·`pmos:`·`R:`·`C:`)로 최소 세트만 지원한다.

---

## 3. `tokens.ts` — 색·치수 체계

### 3.1 재료 톤 (반도체 도해 관용색 기반)

| tone | 의미 | light | dark |
|---|---|---|---|
| `silicon-p` | p형 실리콘 | `fill-rose-100` | `dark:fill-rose-950` |
| `silicon-n` | n형 실리콘 | `fill-sky-100` | `dark:fill-sky-950` |
| `silicon-p-heavy` | p⁺ | `fill-rose-300` | `dark:fill-rose-800` |
| `silicon-n-heavy` | n⁺ | `fill-sky-300` | `dark:fill-sky-800` |
| `oxide` | 절연막 SiO₂ | `fill-amber-100` | `dark:fill-amber-950` |
| `metal` | 금속 전극·배선 | `fill-zinc-400` | `dark:fill-zinc-500` |
| `poly` | 폴리실리콘 게이트 | `fill-violet-200` | `dark:fill-violet-900` |
| `resist` | 감광제 | `fill-emerald-200` | `dark:fill-emerald-900` |
| `substrate` | 기판 벌크 | `fill-slate-200` | `dark:fill-slate-700` |
| `accent` | 강조(전류·채널) | `fill-brand-500` | 동일 |

**색만으로 구분하지 않는다** — 모든 영역에 라벨 텍스트를 병기하고, p/n은 채움 패턴(`+`/`−` 기호 반복)을 함께 넣어 색각 이상에서도 구분된다.

### 3.2 치수

`viewBox` 기준 폭 **640**, 층 높이 **40**, 선 굵기 **1.5**, 모서리 반경 **4**, 여백 **16**. 전 컴포넌트가 이 값을 참조해 나란히 놓았을 때 굵기·글자가 어긋나지 않게 한다.

**글자 크기** — ✏️ **2026-08-11 계약 확정** (`diagram-set-finishing` C-1): **viewBox 절대 단위를 쓴다.** 본문 글자 토글(`globals.css`의 `.font-sm/md/lg .prose`, `FontSizeToggle`)과 **연동하지 않는다**.

> 초판은 `0.8em` 같은 상대 단위를 지시했으나 구현이 절대값을 택했고, 그 판단이 기록되지 않은 것이 Gap의 실체였다. 확정 근거: SVG 내부에서 `em`은 부모의 **CSS px**를 참조하는데 `viewBox`는 **사용자 좌표계**다. 둘을 섞으면 도해가 스케일로 작아져도 글자는 그대로여서 375px에서 라벨이 도형을 넘친다. 접근성은 ⓐ 브라우저 확대(SVG는 벡터라 무손실) ⓑ 표 병치·`altTable`의 텍스트 대안으로 확보한다.

**긴 라벨**: SVG `<text>`는 자동 줄바꿈이 없다. 라벨은 **12자 이내**를 원칙으로 하고, 넘치면 저작자가 `label`에 `\n`을 넣어 `<tspan>`으로 분할한다(컴포넌트가 `\n` 기준으로 나눈다). "게이트 절연막 SiO₂"처럼 불가피하게 긴 라벨은 층 밖 지시선(`annotations`)으로 뺀다.

---

## 4. 접근성 · 다크모드 · 반응형 규약

- **접근성**: 루트 `<svg role="img" aria-label>` + `<title>`·`<desc>` (✏️ 2026-08-11: `aria-labelledby`는 6종 전부에 내부 id를 요구해 V-3의 `idPrefix` 2종 축소와 충돌한다 → `aria-label` 유지, `<desc>`는 데이터에서 자동 생성). 그리고 도해 아래 `<details><summary>표로 보기</summary>`에 **동일 정보의 표**를 넣는다(`altTable`). 도해 안 글자는 `<text>`로 넣어 선택·검색 가능. `altTable`이 렌더하는 `<table>`은 `mdx-components.tsx`의 마크다운 `table` 래핑(`overflow-x-auto`)을 타지 않으므로 **컴포넌트가 직접 같은 래퍼를 붙인다**.
- **다크모드**: Tailwind `dark:` 유틸만 사용. SVG에 하드코딩 색 금지 — 위반 시 다크에서 대비가 깨진다.
- **반응형**: `viewBox` + `w-full h-auto`. `FlowSteps`는 `orientation: 'auto'`에서 `sm:` 미만이면 세로 배치. 넓은 도해(`CompareCards` 다열, `NodeGraph`)는 `overflow-x-auto` 컨테이너로 감싸 **본문이 가로 스크롤되지 않게** 한다.
  > ⚠️ 이는 Plan NFR-5("모바일 375px에서 가로 스크롤 없음 — 전 도해")의 **완화**다. 도해 자체는 자기 컨테이너 안에서 스크롤될 수 있고, 금지되는 것은 **페이지 본문의 가로 스크롤**이다. 640 폭 단면도를 375px에 욱여넣으면 라벨이 읽히지 않으므로 이 편이 낫다고 판단했다. G-1이 "본문 가로 스크롤 0"을 측정한다.
- **MDX 배치**: 도해는 블록 요소다. 앞뒤에 **빈 줄**을 넣어 `<p>` 안에 들어가지 않게 한다(이 저장소에서 이미 겪은 hydration 함정).

---

## 5. 파일럿 5모듈 도해 초안 (V-2)

1차 5종을 **모두 한 번씩** 검증하도록 모듈을 골랐다. 초판은 4모듈이었으나 `CompareCards`(26회, 2위)가 빠져 있었고 `NodeGraph`는 만들기 전에 요구됐다.

| 모듈 | 검증하는 컴포넌트 | 목적 |
|---|---|---|
| `017-nmos` | `LayerStack` | 단면 적층의 표준 — 이 자료원 도해의 얼굴 |
| `059-front-back-end` | `FlowSteps` | 가장 긴 순서 + 분기 |
| `019-cmos` | `LayerStack` + `NodeGraph` | **한 페이지 2도해**의 시각 충돌 + `idPrefix` 충돌 회피 실검증 |
| `029-or-gate` | `TruthTable` + `NodeGraph` | 기존 표를 **도해로 대체**하는 첫 사례 |
| `063-thin-film` | `CompareCards` + `LayerStack` | 3열 대조 + 보조 도해 병치 |

### 5.1 `017-nmos` — `LayerStack`

```mdx
<LayerStack
  idPrefix="017-nmos"
  caption="n채널 MOS 트랜지스터 단면"
  layers={[
    { id: 'gate',      label: '게이트 전극',   tone: 'poly',      height: 28 },
    { id: 'oxide',     label: '절연막 SiO₂',  tone: 'oxide',     height: 14 },
    { id: 'substrate', label: 'p형 실리콘 기판', tone: 'silicon-p', height: 72,
      wells: [
        { label: 'n⁺ 소스',   tone: 'silicon-n-heavy', side: 'left' },
        { label: 'n⁺ 드레인', tone: 'silicon-n-heavy', side: 'right' },
      ] },
  ]}
  annotations={[
    { at: 'oxide/substrate', text: '전압을 걸면 여기에 채널이 생긴다' },
  ]}
  altTable={<>{/* 기존 §1 "위치 / 구성" 표를 그대로 */}</>}
/>
```

### 5.2 `059-front-back-end` — `FlowSteps`

```mdx
<FlowSteps
  idPrefix="059-flow"
  caption="IC 제조 전체 흐름"
  steps={[
    { id: 'front', label: '전 공정', sub: '웨이퍼에 소자를 그린다 (80%)', tone: 'accent' },
    { id: 'back',  label: '후 공정', sub: '자르고 포장한다' },
  ]}
  branch={[
    { at: 'front', label: '전 공정 안에서', steps: [
      { id: 'feol', label: 'FEOL', sub: '소자 형성' },
      { id: 'beol', label: 'BEOL', sub: '배선 형성' },
    ] },
  ]}
/>
```

최상위 `steps`는 두 토막만 담고 FEOL·BEOL은 `branch` 자식으로만 둔다 — 초판 예시는 둘 다에 넣어 중복이었다(design-validator L-1).

### 5.3 `019-cmos` — `LayerStack` + `NodeGraph`

한 페이지에 도해 2개가 오는 첫 사례. **단면(구조) → 회로(동작)** 순서로 배치하고 사이에 `##` 섹션 경계를 두어 시각 충돌을 피한다. `idPrefix`는 `"019-well"`·`"019-inverter"`로 나눠 SVG `id` 충돌을 실제로 회피하는지 확인한다(§2.1).

### 5.4 `029-or-gate` — `TruthTable` + `NodeGraph`

기존 표를 **도해로 대체**하는 첫 사례. 입력 A·B → 출력 Y 표는 `TruthTable`로 승격하고, "중간 노드 X" 표는 값이 `'0 (GND에 연결)'`처럼 정성 서술이라 `TruthTable`에 담기지 않으므로 `NodeGraph`의 노드 라벨로 흡수한다.

### 5.5 `063-thin-film` — `CompareCards` + `LayerStack`

열산화·CVD·스퍼터링 3열 대조가 주 도해. 보조로 세 방법이 만드는 막의 단면을 `LayerStack`으로 병치해, **3열 카드와 단면도가 같은 페이지에서 시각적으로 충돌하지 않는지** 본다.

---

## 6. Design §5.2 재정의 문안 (Plan FR-9)

`first-semiconductor-primer.design.md` §5.2를 아래로 교체한다. 기존 규칙("텍스트로 구조 불성립 + 기존 컴포넌트로 표현 가능일 때만")은 도해 인프라가 없던 시점의 억제책이었고, 인프라가 생긴 지금은 **무엇을 어느 층위로 그릴지**를 정하는 규칙이 필요하다.

> **자체 도해 3단 판정**
>
> | 층 | 조건 | 컴포넌트 | 판정 |
> |:--:|---|---|---|
> | **T1 정밀 도해** | 텍스트·표로 구조가 **성립하지 않는다** (단면·격자·회로·곡선) | `LayerStack`·`LatticeDiagram`·`NodeGraph`·`CurvePlot`·`LabeledFigure` | **반드시 제작** |
> | **T2 패턴 도해** | 정보 구조가 **반복 패턴**이며 통일된 시각 언어로 읽는 편이 빠르다 (순서·대조·분류·진리표·연표) | `FlowSteps`·`CompareCards`·`TreeBranch`·`TruthTable`·`Timeline` | 해당 패턴이면 제작 |
> | **T3 시각 강화** | 표의 **수치를 감각으로** 바꾼다 (자릿수 차·크기) | `ValueBars`·`ScaleRuler` | 자릿수 차 ≥2 또는 크기 감각이 논지일 때만 |
> | — | 위 셋 중 어디에도 해당하지 않음 | — | **제작 금지** (장식) |
>
> 원문 이미지 336개 전면 미사용 원칙은 유지된다. 도해는 개념·수치만 근거로 새로 그린다.

---

## 7. 분량 기준 정합 (§5.1과의 충돌 처리)

**발견된 문제**: 표를 도해로 대체하면 본문 자수가 줄어 §5.1 하한(항목 1,200자)을 밑돌 수 있다.

**실측 하위 5모듈** (공백·마크업 제외, §5.1 측정 기준):

| 모듈 | 자수 | 하한 여유 | 표 구성 |
|---|---:|---:|---|
| `030-and-gate` | **1,225** | **+25** | 진리표 1 · 대조표 1(OR/AND 스위치 배치) · 상태표 1 |
| `024-ic-classification` | 1,327 | +127 | 분류표 2 |
| `033-comparator` | 1,347 | +147 | 진리표 2 |
| `031-adder` | 1,358 | +158 | 진리표 2 |
| `028-not-gate` | 1,360 | +160 | 진리표 1 · 상태표 1 |

`030`이 전 88항목의 **최솟값**이며, 진리표를 `TruthTable`로 승격하면 곧바로 하한을 깬다. 나머지 4개는 여유 130~160으로 표 1개 승격까지는 견디나 2개는 위험하다.

> 초판은 "030 진리표 3개"라고 적었으나 실제로는 **진리표 1개 + 대조표 1 + 상태표 1**이다(design-validator M-1). 대조표는 §1.2에서 030에 `CompareCards`를 배정하지 않았으므로 **표로 남긴다** — 세 표를 모두 도해로 바꾸지 않는다는 뜻이며, 이것이 하한 방어에도 유리하다.

**방침**: §5.1 측정 기준에 예외를 추가한다 — **도해로 대체된 표는 원래 자수를 그대로 산입**한다. 대부분은 **표를 지우지 않고 도해와 병치**하고(89모듈), 실제로 대체한 경우에만 `altTable`에 같은 표를 남기므로 어느 쪽이든 정보량이 줄지 않는다. (✏️ 2026-08-11 `diagram-set-finishing` C-2 — 초판은 근거를 `altTable`로만 적었다.)

**재현성 확보**: "원래 자수"가 파일 밖 기억에만 있으면 §5.1이 재계산 불가능해진다(design-validator M-4). Do 착수 **전에** 97모듈 자수를 측정해 `docs/02-design/features/diagram-component-set.baseline.md`에 표로 고정하고, 이후 판정은 `현재 자수 + baseline 대비 도해 대체분`으로 한다. 측정 방법은 §5.1 문단과 동일(공백·JSX·마크다운 기호 제외).

**RT 표기**: 도해는 읽기 시간을 늘리지 않고 오히려 줄인다(표 해독 → 한눈에). 기존 RT 값을 유지하고 재산정하지 않는다.

---

## 8. 검증 계획

### 8.1 파일럿 게이트 (Plan §5.2 G-1~G-5 + Design 신설 G-6·G-7)

| # | 조건 | 측정 |
|:--:|---|---|
| G-1 | **5모듈** 렌더 정상 — 라이트·다크·375px에서 **본문 가로 스크롤 0** | 실제 확인 |
| G-2 | First Load JS·모듈 라우트 무증가 (102kB / 1.72kB·125kB — 근거: 선행 analysis §1 NFR-6) | `npm run build` 대조 |
| G-3 | 하나의 시각 언어 — 색·선 굵기·라벨 위치 일관 | 5모듈 나란히 대조 |
| G-4 | `aria-label` + `altTable` 동작, `mdx-components.tsx` 12종 등록 확인 | 마크업·렌더 확인 |
| G-5 | `typecheck`·`lint`·`build` 무오류, SSG 379페이지 | 명령 실행 |
| **G-6** | **도해 대체 후 §5.1 자수 하한 유지** — 파일럿 `029`와 **최위험 `030`**(1,225자)을 함께 측정 | baseline 대조 |
| **G-7** | 한 페이지 2도해에서 **SVG `id` 충돌 없음** — 019의 패턴·마커가 각자 참조 | 렌더된 DOM 확인 |

### 8.2 전수 적용 후 검증

- 97모듈 × 주 도해 ≥1 실재 확인 (스크립트로 컴포넌트 사용 여부 grep)
- 배치표(§1.2)와 실제 MDX 대조 — 어긋나면 배치표를 정정하거나 MDX를 고친다
- 기존 12자료원 MDX 무수정 (`git diff --stat`으로 확인)

---

## 9. 완료 정의 (Design)

- [x] Step 0 배치 전수 매핑 — 97/97 커버율 100% (기계 파싱 검증)
- [x] 12종 props 시그니처 확정 (공통 `idPrefix` 포함)
- [x] `tokens.ts` 색·치수 체계 확정
- [x] `NodeGraph` 표현 한계 · `CurvePlot` 데이터 출처 규약 명문화
- [x] 파일럿 5모듈 도해 초안 — 1차 5종 전부 검증
- [x] §5.2 재정의 문안
- [x] RT·분량 기준 정합 방침 + baseline 아티팩트 지정
- [x] `design-validator` 검증 반영 (High 4 · Medium 9 · Low 9)
- [x] Do 착수 전: `diagram-component-set.baseline.md` 생성 (97모듈 자수 고정)
- [x] Do ⓪~⑤ 완료 — 12종 구현 · 97/97 주 도해 적용 · 문서 갱신

## 10. 다음 단계

→ **`/pdca do diagram-component-set`**

Do 순서:

| # | 작업 |
|:--:|---|
| ⓪ | `diagram-component-set.baseline.md` — 97모듈 자수 고정 (§7 재현성) |
| ① | `tokens.ts`·`types.ts` + **1차 5종** (`LayerStack`·`CompareCards`·`FlowSteps`·`NodeGraph`·`TruthTable`) + `mdx-components.tsx` 등록 |
| ② | **파일럿 5모듈**(017·059·019·029·063) 적용 + 게이트 **G-1~G-7** |
| ③ | 2차 7종 (`ValueBars`·`TreeBranch`·`LatticeDiagram`·`CurvePlot`·`Timeline`·`ScaleRuler`·`LabeledFigure`) |
| ④ | 트랙 단위 전수 적용 — 트랙 2(14)·7(13) 우선, 이후 나머지 |
| ⑤ | 선행 사이클 Design §5.2 재정의 반영 · §5.1 자수 예외 규정 추가 · 컴포넌트 사용 규약 문서화 (Plan FR-9) |
