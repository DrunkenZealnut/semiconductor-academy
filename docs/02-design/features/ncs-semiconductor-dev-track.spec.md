# NCS 반도체개발·재료 트랙 재구성 스펙 (서브에이전트 작업 지시서)

> **Feature**: `ncs-semiconductor` 확장 — 반도체개발 트랙 8개 + 반도체재료 트랙 4개 모듈
> **작성일**: 2026-07-12 · 상위 문서: `docs/01-plan/features/ncs-semiconductor.plan.md`, `docs/02-design/features/ncs-semiconductor.design.md`
> 이 문서는 병렬 재구성 서브에이전트가 Read하는 **단일 작업 스펙**이다. 각 에이전트는 자기 모듈 1개만 담당한다.

---

## 0. 임무 요약

NCS 학습모듈 원문(마크다운, `data/ncs/반도체개발/…`)을 읽고, **고등학생·일반인 눈높이의 3단 레이어 MDX** 1개를 `src/content/sources/ncs-semi/{모듈id}.mdx`에 작성한다. 원문 직역·복붙 금지 — "쉽게 다시 쓰기"다. 단, 인용(SourceQuote·deep.quote)과 수치·표·화학식은 원문 그대로 정확해야 한다.

**필수 선행 Read 2개**:
1. 이 스펙 전체
2. 완성 예시 템플릿: `src/content/sources/ncs-semi/quality-control.mdx` (구조·문체·컴포넌트 사용법의 기준)

그다음 자기 모듈의 원문을 Read한다(§1 배정표). 원문이 길면 나눠 읽되 **전체를 훑은 뒤** 쓰기 시작한다.

## 1. 모듈 배정표

| 모듈 id (파일명) | 모듈명 | LM 코드 | 원문 경로 (`data/ncs/반도체개발/` 하위) |
|---|---|---|---|
| `product-planning` | 반도체 제품 기획 | LM1903060101_23v6 | `LM1903060101_23v6_반도체_제품_기획/LM1903060101_23v6_반도체_제품_기획.md` |
| `architecture-design` | 반도체 아키텍처 설계 | LM1903060102_23v5 | `LM1903060102_23v5_반도체_아키텍처_설계/LM1903060102_23v5_반도체_아키텍처_설계.md` |
| `digital-circuit-design` | 디지털 회로 설계 | LM1903060104_23v5 | `LM1903060104_23v5_디지털_회로_설계_수정요청/LM1903060104_23v5_디지털_회로_설계_수정요청.md` |
| `package-product-design` | 패키지 제품설계 | LM1903060107 | `LM1903060107_패키지_제품설계/LM1903060107_패키지_제품설계.md` |
| `firmware-development` | 반도체 펌웨어 개발 | LM1903060114_23v2 | `LM1903060114_23v2_반도체_펌웨어_개발/LM1903060114_23v2_반도체_펌웨어_개발.md` |
| `system-process-development` | 시스템 반도체 제조 공정 개발 | LM1903060116_23v7 | `LM1903060116_23v7_시스템_반도체_제조_공정_개발/LM1903060116_23v7_시스템_반도체_제조_공정_개발.md` |
| `flip-package-development` | 플립 패키지 개발 | LM1903060122_23v4 | `LM1903060122_23v4_플립_패키지_개발/LM1903060122_23v4_플립_패키지_개발.md` |
| `custom-layout-verification` | 커스텀 레이아웃 검증 | LM1903060132_23v5 | `LM1903060132_23v5_커스텀_레이아웃_검증/LM1903060132_23v5_커스텀_레이아웃_검증.md` |

경로 루트: `/Users/zealnutkim/DEV/SemiconductorAcademy/`. 출력: `src/content/sources/ncs-semi/{모듈id}.mdx`.

### 1-b. 재료 트랙 배정표 (2차 배치)

| 모듈 id (파일명) | 모듈명 | LM 코드 | 원문 경로 (`data/ncs/반도체재료/` 하위) |
|---|---|---|---|
| `material-safety` | 반도체 재료 안전관리 | LM1903060411_23v3 | `LM1903060411_23v3_반도체_재료_안전관리/LM1903060411_23v3_반도체_재료_안전관리.md` |
| `cmp-materials` | 반도체용 CMP 재료 제조 | LM1903060415_20v1 | `LM1903060415_20v1_반도체용_CMP_재료_제조/LM1903060415_20v1_반도체용_CMP_재료_제조.md` |
| `cleaning-materials` | 반도체용 세정 공정 재료 제조 | LM1903060425_23v3 | `LM1903060425_23v3_반도체용_세정_공정_재료_제조/LM1903060425_23v3_반도체용_세정_공정_재료_제조.md` |
| `flipchip-materials` | 반도체용 플립칩 재료 제조 | LM1903060414_20v1 | `LM1903060414_20v1_반도체용_플립칩_재료_제조/LM1903060414_20v1_반도체용_플립칩_재료_제조.md` |

**재료 트랙 추가 지침**: 이 트랙은 사이트의 책 「반도체 산업의 유해인자」와 주제가 가장 가깝다(화학물질·안전). ① 화학물질명·화학식·농도 수치는 원문 그대로 정확하게. ② `Term`(msds, cmp, etching 등)·`ChapterRef`(6 클리닝, 12 CMP, 14 화학물질 등) 연결 기회가 개발 트랙보다 많다 — 자연스러운 곳에 적극 활용하되 남용 금지. ③ 안전 내용은 `Callout type="warning"`으로 살린다. ④ 완료 보고에 `suggested-hazards`를 추가한다(§8).

## 2. 원문 구조 이해 (읽기 요령)

- 앞부분 ~10페이지는 NCS 소개 보일러플레이트(학습모듈이란 무엇인가 등) — **학습내용 아님, 건너뛴다**.
- 본체: `학습모듈 개요(목표)` → `학습 1·2·3…` 각각 `필요 지식`(이론) → `수행 내용`(실습 절차) → `교수·학습 방법` → `평가`.
- 재구성 소재는 **개요(목표) + 각 학습의 "필요 지식"** 이 중심. `수행 내용`은 직무 감각을 살리는 수준으로만 요약. `교수·학습 방법`·`평가`·`활용 서식`은 제외.
- OCR 변환 자료라 표·수식이 깨진 곳이 있다. **깨져서 확신이 없는 내용은 쓰지 않는다** (추측 복원 금지).

## 3. 출력 MDX 구조 (템플릿 준수)

`quality-control.mdx`와 동일한 뼈대. 분량 **170∼200줄** (본문 h2 3∼4개).

```
<LayeredExplain hook="…" easy={{ analogy: (<p>…</p>) }} deep={{ sourceSection: 'NCS 학습모듈 — {모듈명}: 학습모듈의 목표', quote: (<>…</>) }} />

## 한 줄 요약

## 1. {큰 주제 1}          ← 학습 단위를 고등학생 논리로 재편성 (원문 목차 그대로 아님)
### 가. …
### 나. …

## 2. {큰 주제 2}
…

## 이 일을 하는 사람은      ← 직무·진로 연결 (필수)

<Callout type="tip" title="함께 보면 좋아요">…</Callout>

---

<div className="text-xs italic text-slate-500">
출처: NCS 학습모듈 「{모듈명}」({LM 코드}) · 교육부·한국산업인력공단. 고등학생 눈높이로 재구성했으며 원문 도표·사진은 싣지 않았습니다.
</div>
```

세부 규칙:
- **LayeredExplain**: `hook`은 호기심 유발 질문 한 줄. `easy.analogy`는 생활 비유 1문단(`<p>` 1개). `deep.quote`는 원문 "학습모듈의 목표(개요)"에서 핵심 문장을 **원문 그대로** 인용(`<strong>` 강조 가능) + `<p className="mt-2">핵심 용어: …</p>`로 원문 핵심 용어 나열.
- **SourceQuote**: 본문 h2마다 0∼2개, 모듈 전체 2∼4개. `section` 속성은 `"NCS 학습모듈 — {모듈명}: {학습 위치}"` 형식. 내용은 원문 문장 **그대로**(어미 포함, 150자 내외 발췌·중략 시 왜곡 금지). 내부는 `<p>…</p>`.
- **Callout**: `type` = `info`(개념 보충) · `tip`(흥미·연결) · `warning`(안전·주의) 중 택, `title` 필수. 모듈당 2∼3개.
- **표**: 원문에 좋은 표가 있으면 마크다운 표로 1∼2개 재현(수치 원문 그대로). 표 바로 아래에 한 줄 출처: `<div className="text-xs italic text-slate-500">출처: NCS 학습모듈 {모듈명} — {위치}</div>`.
- **강조**: 핵심 용어 첫 등장 시 `**볼드**` + 영문 병기(예: **관리도(Control Chart)**).

## 4. 사용 가능 컴포넌트 (이외 금지)

`LayeredExplain`, `SourceQuote`, `Callout`, `Term`, `ChapterRef`. (전역 등록되어 import 불필요. `ProcessDiagram`·`ImageFigure`·`ChemicalCard`는 이번 모듈에서 사용 금지.)

- **`<Term id="…">표시텍스트</Term>`** — id는 아래 15개만 존재. 이외 id 사용 금지(빌드는 통과해도 UI 깨짐):
  `semiconductor, wafer, photoresist, cleanroom, ingot, doping, plasma, mask, etching, deposition, cmp, precautionary-principle, msds, iarc-1, emf`
  자연스럽게 등장할 때 1∼4회만. 억지로 끼워 넣지 않는다.
- **`<ChapterRef order={N} />`** — 책 「반도체 산업의 유해인자」 챕터 참조. 관련 있을 때만:
  1 새기술·새공정 위험성 / 2 반도체의 이해 / 3 제조 공정 전반 / 4 클린룸 / 5 웨이퍼 제조 / 6 클리닝 / 7 확산 / 8 포토리소그래피 / 9 식각 / 10 증착 / 11 이온 주입 / 12 CMP / 13 칩 조립·검사 / 14 화학물질 / 15 전자파 / 16 주요 질병 / 17 산업보건학 시각
  개발 트랙은 공정 트랙보다 책과 거리가 있으므로 **무리한 연결 금지** — "함께 보면 좋아요"에 1∼2개 정도(예: 설계 모듈이면 2장·3장, 패키지 모듈이면 13장).

## 5. 문체 (템플릿과 동일)

- 존댓말 요체("~해요"). 어려운 개념은 반드시 생활 비유 먼저, 용어는 나중.
- 문단은 3∼5문장. 원문 특유의 "~할 수 있다"(수행준거체)는 본문에서 풀어 쓴다(인용 안에서는 원문 유지).
- 직무 관점 유지: "현장에서 누가 왜 이 일을 하는가"가 이 자료원의 정체성. 이론 요약집으로 만들지 않는다.
- 과장·공포 조장 금지, 사실 왜곡 금지. 원문에 없는 수치·사례를 지어내지 않는다.

## 6. Hydration 함정 (필수 준수 — 과거 19곳 수정 이력)

1. 여러 줄 각주·출처는 `<p>`가 아니라 **`<div className="text-xs …">`** 로 감싼다 (`<p>`-in-`<p>` 방지). 한 줄이면 `<p>` 무방하나 출처는 통일해서 `<div>` 사용.
2. `SourceQuote`·`Callout` 등 **블록 컴포넌트는 반드시 앞뒤 빈 줄을 둔 독립 줄**에 배치. 문단 텍스트와 같은 줄 금지.
3. 표는 일반 마크다운으로만 — 래핑은 전역 처리되므로 개별 div로 감싸지 않는다.

## 7. 저작권 (필수)

- 원문 도표·사진·삽화 **사용 금지** (이미지 0). 표의 "데이터"는 텍스트 재구성 가능.
- 인용은 SourceQuote/deep.quote 안에서만 원문 그대로. 본문은 완전 재서술.
- 하단 출처 표기는 §3 형식 그대로 (LM 코드 포함).

## 8. 완료 보고 (에이전트 최종 출력)

최종 텍스트로 다음만 반환 (파일 내용 전체를 붙이지 말 것):

```
DONE {모듈id}
lines: {작성한 줄 수}
sections: {h2 제목 목록}
quotes: {SourceQuote 개수(LayeredExplain deep 제외)}
key-numbers: {본문·표에 쓴 원문 수치 3~6개 — 검증용, "값 (원문 위치)" 형식}
suggested-topics: {아래 통제 어휘 중 이 모듈 내용과 실제로 맞는 것 0~3개, 없으면 none}
  허용 topic: ghs, sds-label, chemical-inventory, cleanroom, wafer-fab, photolithography, etching, diffusion, deposition, ion-implantation, cmp, packaging, gas-safety, liquid-chemicals, compressed-gas, cryogenic, storage-compatibility, engineering-controls, ppe, emergency-response, occupational-disease, exposure-monitoring, industrial-hygiene
suggested-hazards: {재료 트랙만. 모듈이 실질적으로 다루는 위험 분류 0~3개, 없으면 none}
  허용 hazard: flammable, pyrophoric, oxidizer, corrosive, toxic, acute-toxic, carcinogen, reproductive-toxin, sensitizer, compressed-gas, cryogenic, reactive
notes: {OCR 손상으로 뺀 내용·특이사항 1~2줄, 없으면 none}
```
