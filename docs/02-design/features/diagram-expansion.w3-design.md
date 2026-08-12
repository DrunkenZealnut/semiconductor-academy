# Design — 도해 세트 타 자료원 확대 W3 (수험서 + OSHA)

> **Feature**: `diagram-expansion` W3
> **작성일**: 2026-08-12 · **Level**: Dynamic
> **Umbrella**: `docs/02-design/features/diagram-expansion.design.md`
> **상속**: W1·W2 판정(`usage.md` 실적용 ②③) · 검사기 C-1~C-9 · 배치표 생성기
> **선행 미완**: **G-9 육안 확인 255 인스턴스** — 관문으로 권고했으나 사용자 판단으로 W3 착수. W3 완주 시 회수 대상 약 313

---

## 0. D-4 결정 — `osha-scs` 처리

umbrella Design은 이 결정을 **"실물 확인 후"로 이연**했다. "지금 결정하면 실물 없이 판정하는 것이 되어 선행 사이클의 '원문 근거 없는 배정' 실패를 반복한다"는 이유였다. 실물을 확인한 결과 **그 이연이 옳았다 — 전제가 틀렸다.**

### 0.1 틀린 전제

umbrella Plan §R-3과 Design §5.3은 `osha-scs`를 이렇게 적었다: *"영문·`LayeredExplain` 0·목록 60/모듈이라 12종 어느 것도 바로 맞지 않는다."*

세 지표는 사실이다. 그런데 **집계 지표만 보고 내용을 보지 않았다.** 절 제목을 읽으면 정반대다.

| 파트 | 절 | 실측 표 | 도해 적합성 |
|---|---|---|---|
| `part-1b` | §4 **Hierarchy of Hazard Control** | (목록) | 안전공학의 **표준 위계 도해** 그 자체 |
| `part-2` | §11 Chemical Storage and Compatibility | **6열×5행 상호 적합성 행렬** | `TruthTable`의 정확한 용례 |
| `part-2` | §1 Fire Triangle | 2열×3행 | 3요소 상호 의존 → `NodeGraph` |
| `part-3` | Nine Extremely Hazardous Chemical Categories | **4열×9행** | `TreeBranch` 교과서적 사례 |
| `part-4` | §6 Hazardous Gas Control System — Step-by-Step | **3열×12행** (Step/Component/Function) | 계통도 → `NodeGraph` |

**안전 교육 자료는 본질적으로 분류적·절차적이다.** 교과서보다 오히려 도해 적합성이 높다. "목록 60/모듈"은 도해가 안 맞는다는 증거가 아니라 **구조화된 정보가 많다**는 증거였다.

> 이 오판은 W1·W2에서 반복된 실패와 같은 형태다 — **중간 산출물(집계 지표)을 원자료 대신 신뢰했다.** 다만 이번에는 D-4를 이연해 뒀기 때문에 잘못된 배정이 실행되지 않았다. **이연이 안전장치로 작동한 첫 사례다.**

### 0.2 실제 장애물 — en/ko 이중화

진짜 제약은 다른 곳에 있었다. `osha-scs`는 **10모듈이 아니다.**

```text
5 파트 × 2 언어 = 10 파일
part-1a.mdx (264줄)  ↔  part-1a.ko.mdx (264줄)
part-1b.mdx (228줄)  ↔  part-1b.ko.mdx (228줄)
part-2.mdx  (324줄)  ↔  part-2.ko.mdx  (325줄)
part-3.mdx  (234줄)  ↔  part-3.ko.mdx  (234줄)
part-4.mdx  (181줄)  ↔  part-4.ko.mdx  (181줄)
```

`src/lib/oshaMdx.tsx`가 `enLoaders`/`koLoaders` 두 레지스트리로 language 토글을 제공한다. `.ko`는 **문장 단위 1:1 병렬 번역**이고 설명판이 아니다(학습 목표 4개가 en과 ko에서 같은 순서·같은 개수).

### 0.3 결정 — 양쪽 모두에 넣는다 (D-4 확정)

| 안 | 판정 | 이유 |
|---|:--:|---|
| **(a) en·ko 양쪽** | **채택** | 토글이 같은 도해를 언어만 바꿔 보여 준다. **설계는 1회, 인스턴스는 2배** — 주제·컴포넌트·구조가 같고 라벨 텍스트만 번역된다 |
| (b) ko만 | 탈락 | `.ko`가 1:1 번역이므로 한쪽에만 도해가 있으면 **병렬이 깨진다.** 토글을 누른 독자가 도해를 잃는다 |
| (c) 제외 | 탈락 | §0.1대로 가장 도해적인 콘텐츠를 버리는 셈 |
| (d) `LabeledFigure` | 탈락 | `usage.md` §4.1 금지 — W1에서 7건 전량 대체한 판정을 뒤집을 근거가 없다 |

**이 결정이 만드는 새 위험**: 두 파일이 어긋날 수 있다(한쪽만 고치기·라벨 번역 누락). §4에서 **C-10 미러 정합** 검사로 막는다. 위험을 만든 결정과 그것을 막는 검사를 같은 문서에서 확정한다.

---

## 1. W3가 W1·W2와 다른 점

두 자료원이 서로 다르고, 둘 다 W1·W2와 다르다.

| | `cert-equip-maintenance` (13모듈) | `osha-scs` (5파트 × 2언어) |
|---|---|---|
| 성격 | **수험서** — 표 밀도 최고 | **표준 교육자료** — 영문 + 병렬 번역 |
| 규모 | 185~277줄 · `##` 4~6 | 181~325줄 · `##` 9~14 |
| 표 | **총 68개** (모듈당 5.2) | 총 20개 (파트당 4.0) |
| 목록 | 0~10 (거의 없음) | **43~91** (매우 많음) |
| `LayeredExplain` | 모듈당 1 | **0** |
| 특이점 | 주제가 W1·W2와 **대폭 중복**(etch·photo·deposition·diffusion·assembly·pneumatics·automation) | **en/ko 미러** · 6열 적합성 행렬 · 12행 계통표 |

### 1.1 주제 중복은 판정 재사용이지 값 재사용이 아니다

`cert-equip-maintenance`의 13모듈 중 8개가 W1·W2에 같은 주제 모듈이 있다. **컴포넌트 판정은 재사용한다**(습식vs건식 → `CompareCards`, 챔버 계통 → `NodeGraph`). 그러나 **값·라벨은 절대 옮기지 않는다** — umbrella §1.1의 MDX-as-source 규약이 그대로 적용되고, 이 확대에서 가장 위험했던 사고가 정확히 **모듈 간 값 이동**이었다.

> 수험서는 같은 공정을 **시험 대비 관점**으로 다시 쓴 것이라 수치·용어가 교과서와 미묘하게 다르다. "이미 아는 내용"이라는 느낌이 값을 옮기게 만드는 가장 강한 유혹이다. C-2·C-8이 파일 단위로 대조하므로 옮기면 걸린다.

### 1.2 6열 표는 `CompareCards`로 그릴 수 없다

`usage.md` §3이 `CompareCards`를 **2~3열**로 제한한다(375px에서 압착). W3에는 6열 표가 둘 있다.

- `deposition-process` §1 — 6열×5행 (유형/압력/에너지원/대표막/강점/약점) → **`TreeBranch`** (5유형을 가지로, 속성은 note로)
- `part-2` §11 — 6열×5행 (물질종 × 물질종 적합성) → **어느 컴포넌트도 안 된다.** 표로 남긴다

> **§1.2 정정 (배치 B 실측)**: 위 줄은 처음 "`TruthTable`(행렬이므로 열 제한이 다르게 적용된다)"이라고 썼다. **틀렸다.** `TruthTable.tsx`는 `inputs`/`outputs` 헤더와 0/1 비트 칸만 렌더하고 **행 라벨 개념이 없다**. 적합성 행렬은 행 식별자(어느 물질종의 행인가)가 없으면 뜻을 잃는다.
>
> 이 오판은 §0.1의 `osha-scs` 전제 오판과 **같은 형태**다 — **컴포넌트 구현을 읽지 않고 설명만 보고 판단했다.** 12종에는 **행렬 프리미티브가 없고**, 5×5 적합성 행렬이 그것을 처음 요구한 콘텐츠다. `usage.md` §4의 규율대로 반복되기 전에는 새 컴포넌트를 만들지 않고 **표를 그대로 둔다** — 행렬은 표가 가장 잘하는 표현이다.
>
> 대체: §11의 다른 표(2열×11행 Storage Rules by Type)를 캐비닛 4종으로 묶는 `TreeBranch`. "어느 캐비닛에 넣나"가 독자에게 더 실용적이다.

---

## 2. 배치 매핑

표기 — **주**: 모듈의 주 도해(전수 커버리지 대상) · **보조**: 확정 추가분 · **⚠조건부**: Do에서 본문 근거 확인 후 채택/탈락

근거 칸의 `(N열×M행)`은 **실측한 표 모양**이다. W1·W2의 계획 이탈 11건이 **절 제목만 보고 배정한 탓**이었으므로, 이번 Design은 표 모양을 근거로 적는다.

### 2.1 `cert-equip-maintenance` (13모듈) — 수험서·표 밀도 최고

| 모듈 | 주 도해 | 근거 | 보조 |
|---|---|---|---|
| `assembly-process` | `FlowSteps` — 조립 공정 여섯 단계와 무엇이 바뀌나 | §1 (3열×6행) | `CompareCards` 와이어 본딩 세 방식 (4열×3행) · `TreeBranch` 백그라인딩·쏘잉 하위 공정 (2열×3행) |
| `automation-plc` | `TreeBranch` — 자동화를 이루는 다섯 요소 | §1 (2열×5행) | `CompareCards` 릴레이 제어반 vs PLC (3열×4행) · `TreeBranch` 센서 네 종의 검출 원리 (3열×4행) |
| `chemical-facility` | `TreeBranch` — 가스를 다섯 갈래로 나누면 | §2 (4열×5행) | `ValueBars` 대표 가스 허용농도 TLV (2열×10행 — 자릿수 차 큼) · `TreeBranch` 화학물질 여섯 갈래 (4열×6행) |
| `clean-cmp-process` | `TreeBranch` — 어디를 깎느냐로 나뉘는 CMP | §5 (3열×5행) | `CompareCards` 건조기 세 종 (4열×3행) · `NodeGraph` CMP 장비 구성 요소 (2열×4행) |
| `deposition-process` | `TreeBranch` — CVD 다섯 유형 (§1.2 — 6열이라 CompareCards 불가) | §1 (6열×5행) | `CompareCards` CVD vs ALD (3열×4행) · `TreeBranch` 막마다 다른 임무 (2열×5행) |
| `diffusion-process` | `CompareCards` — 확산 vs 이온주입 | §3 (3열×5행) | `CompareCards` 퍼니스 어닐링 vs RTA (3열×4행) · `TreeBranch` 막 종류별 원료와 주 용도 (3열×3행) |
| `electrical-facility` | `FlowSteps` — 전기가 팹까지 오는 길 | §1 (2열×5행) | `CompareCards` 전압 등급 직류·교류 (3열×3행) · `TreeBranch` 전기적 장애와 대응 (3열×3행) |
| `environment-management` | `FlowSteps` — 폐수 처리 단계 | §4 (3열×5행) | `TreeBranch` 팹이 남기는 흔적 대기·수질·폐기물 (3열×4행) |
| `etch-process` | `CompareCards` — 습식 식각 vs 건식 식각 | §1 (3열×7행) | `NodeGraph` 챔버를 지키는 장치 계통 (2열×7행) · `TreeBranch` 막질마다 다른 가스 (4열×3행) |
| `industrial-safety` | `TreeBranch` — 화재 급수별 원인 물질과 소화 방법 | §5 (3열×4행) | `TreeBranch` 산업위생의 세 잣대 (2열×3행) · `FlowSteps` 화재를 처음 본 사람의 순서 §5 (⚠조건부 → **채택**) |
| `intro` | `FlowSteps` — 반도체 8대 공정 | §6 (3열×8행) | `CompareCards` 넣는 불순물과 전류를 만드는 주체 (4열×3행) · `TreeBranch` 반도체가 하는 일곱 가지 역할 (3열×7행) |
| `photo-process` | `FlowSteps` — 사진공정 네 단계와 담당 장비 | §1 (3열×4행) | `CompareCards` 감광제 종류별 남는 부분 (3열×2행) · `CompareCards` 노광 방식 세 종 (4열×3행) |
| `pneumatics-hydraulics` | `CompareCards` — 공압식 vs 유압식 | §1 (3열×6행) | `TreeBranch` 제어밸브 세 분류 (3열×3행) · `TreeBranch` 논리 밸브의 출력 조건 (3열×3행) |

**소계**: 주 13 · 보조 25 *(생성기 출력)*

> **⚠조건부 판정 (G-10)** — `industrial-safety` §5 `FlowSteps`를 **채택**했다. 근거: 본문이
> "처음 본 사람은 큰 소리로 알리고 초기 진화와 동시에 통제실(FMS Room)에 신고하며, 자체
> 진화가 안 되면 지체 없이 대피해요"로 **행동 순서를 명시**하고, Callout 시험 포인트 제목이
> 그대로 "화재 대응의 순서"다. 순서가 본문에 있으므로 `FlowSteps`가 창작이 아니다.

### 2.2 `osha-scs` (5파트 × 2언어 = 10파일) — 미러 배치

**같은 배정을 en·ko 양쪽에 넣는다**(§0.3). 라벨은 각 파일의 언어로 쓴다 — `part-2`는 영문 라벨, `part-2.ko`는 한글 라벨. 구조·컴포넌트·항목 수는 동일하다.

| 모듈 | 주 도해 | 근거 | 보조 |
|---|---|---|---|
| `part-1a` | `TreeBranch` — 세 가지 유해 유형 / Three types of hazards | §4~7 | `CompareCards` pH로 가르는 산과 염기 / pH scale acid and base (3열×3행) |
| `part-1a.ko` | `TreeBranch` — 세 가지 유해 유형 / Three types of hazards | §4~7 (미러) | `CompareCards` pH로 가르는 산과 염기 / pH scale acid and base (3열×3행) |
| `part-1b` | `FlowSteps` — 유해성 통제 위계 / Hierarchy of Hazard Control | §4 (목록) | `TreeBranch` SDS 범주별 항 구성 / SDS sections by category (2열×4행) |
| `part-1b.ko` | `FlowSteps` — 유해성 통제 위계 / Hierarchy of Hazard Control | §4 (미러) | `TreeBranch` SDS 범주별 항 구성 / SDS sections by category (2열×4행) |
| `part-2` | `TreeBranch` — 유형별 보관 캐비닛 / Storage rules by cabinet (초안 `TruthTable` — 행 라벨이 없어 행렬 표현 불가, §1.2 정정) | §11 (2열×11행) | `NodeGraph` 화재 삼각형 / Fire Triangle §1 · `CompareCards` 인화성 가스 LEL·UEL / flammable gases (4열×3행) |
| `part-2.ko` | `TreeBranch` — 유형별 보관 캐비닛 / Storage rules by cabinet | §11 (미러) | `NodeGraph` 화재 삼각형 / Fire Triangle §1 · `CompareCards` 인화성 가스 LEL·UEL / flammable gases (4열×3행) |
| `part-3` | `TreeBranch` — 아홉 가지 극위험 범주 / Nine hazardous categories | 표 (4열×9행) | `FlowSteps` 비상 대응 순서 / Emergency Response |
| `part-3.ko` | `TreeBranch` — 아홉 가지 극위험 범주 / Nine hazardous categories | 표 (미러) | `FlowSteps` 비상 대응 순서 / Emergency Response |
| `part-4` | `NodeGraph` — 유해가스 통제 시스템 / Hazardous Gas Control System (§1.2 — 12행이라 FlowSteps 부적합) | §6 (3열×12행) | `TreeBranch` 가스 분류 / Gas Categorization §4 |
| `part-4.ko` | `NodeGraph` — 유해가스 통제 시스템 / Hazardous Gas Control System | §6 (미러) | `TreeBranch` 가스 분류 / Gas Categorization §4 |

**소계**: 주 10 · 보조 12 (5파트 × 2언어)

### 2.3 집계 (계획값 — 실측은 검사기 출력을 옮긴다)

| 자료원 | 파일 | 주 | 보조 | 계 |
|---|:--:|:--:|:--:|:--:|
| `cert-equip-maintenance` | 13 | 13 | 24 | 37 |
| `osha-scs` | 10 | 10 | 12 | 22 |
| **계** | **23** | **23** | **36** | **59** |

`node scripts/build-diagram-plan.mjs w3` 출력 — **모듈 23 · 배정 59**. ⚠조건부 1건(`industrial-safety` §5)은 생성기가 자동 제외한다(셀의 `⚠` 접두어로 판별). Do에서 본문 근거를 확인한 뒤 채택/탈락하고 근거를 기록한다.

**컴포넌트 분포 (계획값 — 생성기 출력)**

| 컴포넌트 | 배정 | 비중 |
|---|:--:|:--:|
| `TreeBranch` | 25 | 42.4% |
| `CompareCards` | 16 | 27.1% |
| `FlowSteps` | 9 | 15.3% |
| `NodeGraph` | 6 | 10.2% |
| `TruthTable` | 2 | 3.4% |
| `ValueBars` | 1 | 1.7% |

`TreeBranch` 42.4%는 W2(34.2%)보다 높다. **수험서가 분류표로 쓰여 있기 때문**이고(68표 중 다수가 "분류/정의/대표/특성" 형태), 이 편중은 자료원의 성질이다. 다만 W2보다 심하므로 Do에서 각 `TreeBranch`가 **실제로 포함 관계를 그리는지** 확인한다 — 순서를 `TreeBranch`로 그리면 `FlowSteps`가 맞는 자리를 잘못 채우는 것이다.

> **이 표를 처음 쓸 때 손으로 세서 60이라 적었고 틀렸다**(보조 25 → 실제 24). 이 확대에서 손으로 옮긴 집계가 틀린 **여섯 번째** 사례다 — 같은 문서 §2.3에 "손으로 세지 않는다"고 써 놓고 그랬다. 규칙을 아는 것과 지키는 것은 다르고, 그래서 검산을 사람이 아닌 스크립트에 맡긴다.

### 2.4 실측 분포 (Do 완료 — 검사기 출력)

`node scripts/verify-diagram-placement.mjs w3 --plan docs/02-design/features/diagram-expansion.w3-plan.json`

| 컴포넌트 | 주 | 보조 | 계 |
|---|:--:|:--:|:--:|
| `TreeBranch` | 13 | 14 | **27** |
| `CompareCards` | 5 | 11 | **16** |
| `FlowSteps` | 3 | 7 | **10** |
| `NodeGraph` | 2 | 4 | **6** |
| `ValueBars` | 0 | 1 | 1 |
| **계** | **23** | **37** | **60** |

미사용 7종: `LayerStack` · `TruthTable` · `LatticeDiagram` · `CurvePlot` · `Timeline` · `ScaleRuler` · `LabeledFigure`

계획 59 → 실측 **60**. 차이 1건은 `industrial-safety` ⚠조건부 채택분이며 Design §2.1에 근거를 기록했고 배치표에도 반영해 **생성기 `--check` 일치**를 유지한다.

> `TreeBranch` 45.0%(27/60)로 계획 예상(42.4%)보다 조금 더 높다. 예상대로 수험서·안전 자료가 분류 중심이기 때문이다. Do 중 각 `TreeBranch`가 **포함 관계**를 그리는지 확인했고, 순서인 것은 `FlowSteps`로 돌렸다(`assembly-process` 6단계 · `electrical-facility` 전력 경로 · `environment-management` 폐수 5단계 · `part-1b` 통제 위계 · `part-3` 비상 대응).
>
> `TruthTable`이 미사용으로 남았다 — 계획은 `part-2` 적합성 행렬에 쓸 생각이었으나 §1.2 정정대로 **불가**했다. 세 웨이브를 합쳐도 `TruthTable`은 W2의 `digital-circuits` 2건이 유일하다.

---

## 3. W3에 적용되는 규약

W1·W2에서 확정된 것은 전부 그대로다(`usage.md` §2.1~§2.5, §4.1). W3 고유 규약만 적는다.

### 3.1 미러 규약 (`osha-scs`)

1. `X.mdx`와 `X.ko.mdx`의 **컴포넌트 순서가 같아야 한다**. 한쪽만 추가·삭제하지 않는다.
2. 라벨·caption·note는 **그 파일의 언어**로 쓴다. en 파일에 한글을 섞지 않고, ko 파일에 영문 용어를 넣을 때는 본문이 쓰는 형태를 따른다(본문이 `국제조화시스템(GHS)`이면 그 형태).
3. `idPrefix`는 **파일마다 달라야 한다** — `part-2`와 `part-2.ko`가 같은 prefix를 쓰면 토글 시 전역 id가 충돌한다. `osha-part2-compat` / `osha-part2-ko-compat` 형태로 구분한다.
4. 수치는 각 파일 본문에서 확인한다. **번역본의 수치가 원문과 다를 수 있다**(단위 표기·소수점). C-2가 파일 단위로 대조하므로 en 라벨을 ko에 복사하면 걸린다.

### 3.2 수험서 규약 (`cert-equip-maintenance`)

1. **W1·W2의 같은 주제 모듈에서 값을 옮기지 않는다**(§1.1). 판정만 재사용한다.
2. 표 밀도가 높아 도해를 넣고 싶은 자리가 많다. **모듈당 주 1 + 보조 최대 2**로 제한한다 — W2에서 보조가 주보다 많아진 자료원(`TreeBranch` 50건)이 편중을 만들었다.
3. 6열 이상 표는 `CompareCards`로 그리지 않는다(§1.2).

---

## 4. 신설 검사 — C-10 미러 정합

§0.3의 결정이 만든 위험을 막는다. 다른 검사와 같은 규율을 따른다: **양성 대조군을 붙이고, 자기검사 실패 시 본 검사를 실행하지 않는다.**

```text
C-10  미러 정합 — {X}.ko.mdx와 {X}.mdx의 컴포넌트 순서가 같은가
                  + idPrefix가 서로 다른가(전역 id 충돌 방지)
```

대조군 2건:
- **양성 ①** — ko에 컴포넌트가 하나 적은 입력 → 검출되어야 한다
- **양성 ②** — en·ko가 같은 `idPrefix`를 쓰는 입력 → 검출되어야 한다

> C-9(참조 정합)를 넣은 이유와 같다 — **손으로 잡을 수 있는 결함군은 반드시 다시 나온다.** 미러 어긋남은 눈으로 두 파일을 비교해야 보이는 종류라 특히 놓치기 쉽다.

---

## 5. 게이트 (DoD와 1:1)

| # | 게이트 | 측정 방법 |
|:--:|---|---|
| G-1 | `typecheck` 0 · `lint` 신규 경고 0 | `npm run typecheck` · `npm run lint` |
| G-2 | First Load JS 102kB 무증가 · SSG 393 → 393 | `npm run build` |
| G-3 | 주 도해 23/23 (전수 커버리지) | C-1 "주 도해 없음" 0건 |
| G-4 | 배치표 미이행 0 · **주제 일치** | C-1 · 생성기 `--check` 일치 |
| G-5 | 색 리터럴 0 · `idPrefix` 중복 0 | C-6 · C-5 |
| G-6 | 본문 무수정(deletions 0) · 빈 줄 규약 | `git diff --shortstat` · C-4 |
| G-7 | 값·용어 출처 — **모듈 간 값 이동 0** | C-2 · C-8 |
| G-8 | tone 유효성 · 데이터 산출물 회귀 0 | C-3 · `cross-link.json`은 `generatedAt`만 |
| G-9 | **육안 확인** | 사람 — W1·W2 누적 255 + W3 분 |
| G-10 | 수량 일치 · 참조 정합 | C-7 · C-9 |
| G-11 | `usage.md` W3 실적용 기록 | 실적용 ④ + W3 고유 규약 |
| G-12 | 검사기 대조군 유지 + **C-10 신설분 포함** | 자기검사 전항 통과 |
| **G-13** | **미러 정합** — `osha-scs` 5쌍 | **C-10 0건** |

G-13이 W3 신설 게이트다. G-9는 W1·W2와 동일하게 **사람 몫**으로 남는다.

---

## 6. 구현 순서

| 배치 | 대상 | 이유 |
|:--:|---|---|
| **A** | `cert-equip-maintenance` 13모듈 | 표 근거가 가장 명확해 판정 위험이 낮다. W1·W2 판정 재사용 |
| **B** | `osha-scs` en 5파트 | 새 유형(영문·행렬·계통표). 미러 없이 먼저 확정 |
| **C** | `osha-scs` ko 5파트 | B를 미러링. **C-10을 이 배치 직후 실행** |

C-10은 배치 B에서는 en만 있어 의미가 없다. **배치 C 완료 시점이 C-10의 첫 유효 실행**이다.
