# Design — 「반도체기초기술1」(크리아트) 자료원 — 5대단원 12모듈

> **Feature**: `hs-basic-tech-1` · Plan: `docs/01-plan/features/hs-basic-tech-1.plan.md`
> 확정안: **5대단원 12중단원 전량 편입 · 파일럿 "전자 소자"(책 목차 순서) · 원문 단위+SI 병기** (사용자 승인 2026-07-16)

---

## 1. 아키텍처 확장 — 신규 인프라 없음

`hs-textbook-collection` 사이클이 만든 카테고리 공용 골격을 그대로 재사용한다. 이번 사이클에서 코드 신규 파일은 **0개** — `sources.ts`·`schoolTextMdx.tsx`에 항목만 추가하고, `src/app/sources/[source]/[module]/page.tsx`의 `sections↔REGISTRY` 빌드 타임 정합성 검증(§7 구현 순서 참고)도 이번 변경 범위에 포함된다.

| 확장 지점 | 현황 | 조치 |
|---|---|---|
| `SourceCategory 'hs-textbook'` | 이미 존재 | `HS_BASIC_TECH_1`에 태깅만 |
| 공용 라우트 `/sources/[source]/[module]` | 이미 존재, REGISTRY 기반 | `hs-basic-tech-1` 자료원 추가만 |
| `schoolTextMdx.tsx` REGISTRY | 2단 맵 구조 확정 | `hs-basic-tech-1: {12개 모듈}` 블록 추가 |
| 홈 `SourcePicker` 교과서 그룹 | 무수정 — `getOrderedSources()`가 SOURCES 배열만 읽음 | 무수정 (카드 3번째 자동 추가) |
| `SOURCE_KIND_UNIT_LABELS['textbook']` | '단원' 기존 | 무수정 |

## 2. Source 등록 (`sources.ts`)

```ts
/**
 * 반도체고 교과서 「반도체기초기술1」 — 반도체장비 기술자 양성 실무 5과목
 * (전자소자·기계가공·설계제도·공유압기술·C프로그래밍).
 * 원자료 data/school-text/20260413_171220_반도체기초기술1_크리아트_/ 전면 재작성
 * (daegu 저작권 원칙 일괄). ⚠️ 원문 물리 페이지 순환 배치 — 챕터Ⅰ만 §3 재구성
 * 순서를 따른다(챕터Ⅱ~Ⅴ는 원문 라인 순서 그대로).
 */
export const HS_BASIC_TECH_1: Source = {
  id: 'hs-basic-tech-1',
  kind: 'textbook',
  language: 'ko',
  title: '반도체기초기술 1',
  subtitle: '반도체고 교과서 — 전자소자부터 설계제도·공유압·C프로그래밍까지, 장비 기술의 기초',
  attribution: '정예원 외 4인',
  publisher: '크리아트출판사',
  license: 'fair-use',
  order: 6,
  accent: 'school',
  category: 'hs-textbook',
  sections: [ /* §3 표 순서대로 12개, 완성 모듈만 등록 */ ],
};
```

`SOURCES` 배열에 `HS_BASIC_TECH_1` 추가(`hs-semicon-basics`(4) → `daegu-hs-process`(5) → `hs-basic-tech-1`(6) 순).

## 3. 섹션 전체 설계 — 12모듈 (원문 라인 범위 확정, 재검증 완료)

| # | id | title | group | 원문 라인 범위 | readingTime | 비고 |
|:-:|---|---|---|---|:-:|---|
| 1 | `electronic-devices` | 전자 소자 | 전기·전자 기초 | **[4501~4666]+[1~206]**(순환 재구성) | 16 | 파일럿. R·L·C·다이오드·BJT/FET+납땜실습 |
| 2 | `dc-circuits` | 직류 회로 | 전기·전자 기초 | 207~655 | 11 | 직류/교류, 키르히호프 법칙 |
| 3 | `measurement` | 측정 기술 | 기계 가공 기술 | 656~986 | 10 | 버니어캘리퍼스·마이크로미터 |
| 4 | `milling` | 밀링 가공 | 기계 가공 기술 | 987~1683 | 13 | 밀링머신 규격·절삭공구·드릴 |
| 5 | `drafting-standards` | 제도의 규격과 통칙 | 반도체장비 설계 | 1684~2198 | 13 | KS 도면 규격·선의 종류 |
| 6 | `drawing-methods` | 기본 도법에 의한 도면 그리기 | 반도체장비 설계 | 2199~2320 | 9 | 정투상법 |
| 7 | `sectional-views` | 단면도 그리기 | 반도체장비 설계 | 2321~2409 | 8 | 단면도 종류·해칭 |
| 8 | `pneumatics-basics` | 공압 기술의 개요 | 반도체장비 공유압기술 | 2410~2667 | 12 | 압력 단위·보일/샤를 법칙 |
| 9 | `pneumatics-equipment` | 공압 발생장치와 조정기기 | 반도체장비 공유압기술 | 2668~3120 | 14 | 압축기·실린더 종류 |
| 10 | `hydraulics-equipment` | 유압 발생장치와 조정기기 | 반도체장비 공유압기술 | 3121~3366 | 10 | 유압시스템·제어밸브 |
| 11 | `c-basics` | C언어의 기초 | 프로그래밍 | 3367~3662 | 12 | 컴파일·변수·자료형 |
| 12 | `c-programming` | C프로그래밍 활용 | 프로그래밍 | 3663~4343 | 14 | 연산자·함수·실습예제 |

- href 규칙: `/sources/hs-basic-tech-1/{id}/`.
- **등록 순서 = 목차 순서 = 이전/다음 내비 순서** (daegu·반도체기초와 동일 원칙).
- 완성된 모듈만 `sections`에 등록(§7 구현 순서 참고 — 미등록 모듈은 REGISTRY에도 등록 금지).

## 3.1 챕터Ⅰ 재구성 순서 상세 (Plan §1.3 확정 내용 실행 지침화)

파일럿 모듈 "전자 소자"는 원문 물리 페이지가 순환 배치돼 있어 **아래 순서로 정독**한다(라인 번호는 원문 OCR 파일 기준):

```text
① 4501~4514행: 표지·학습안내·학습목표
② 4514~4570행: 가. 저항기 — 옴의 법칙, 색띠 저항 코드표
③ 4570~4620행: 나. 커패시터 — C=εA/l, 정전용량 읽는 법
④ 4620~4666행: 다. 인덕터 특성 1)~3) — 렌츠 법칙, 상호유도, 전자석
⑤ 1~10행:     인덕터 특성 4) 공진 (④에서 그대로 이어짐 — 검증됨)
⑥ 39~83행:    가. 반도체란 — 원자모형, 진성/불순물반도체, N형/P형, PN접합
⑦ 84~133행:   나. 다이오드 — 순방향/역방향 바이어스, 항복전압(애벌런치/제너), 종류·검사법
⑧ 134~174행:  다. 트랜지스터 — BJT 원리(이미터/베이스/컬렉터, 동작상태표), FET/JFET/MOSFET
⑨ 176~206행:  실습활동1 — 납땜하기(성취기준·안전유의사항·순서·평가표)
→ 207행 "2. 직류 회로" 시작 = 다음 모듈(#2 dc-circuits) 경계
```

이 순서는 Plan §1.3에서 인덕터 특성 리스트(파일 끝 1)~3) → 파일 시작 4))가 정확히 이어지는 것으로 실측 검증했다. 챕터Ⅱ~Ⅴ(§3 표 #3~12)는 원문 라인이 이미 정순이므로 별도 재배열 없이 순차 정독한다.

## 4. 콘텐츠 재구성 계약 (daegu·반도체기초 계약 승계)

전역 컴포넌트(`LayeredExplain`·`Callout`·`Term`·`SourceRef`·GFM 표) 재사용. 원문 이미지 전면 미사용, 문장 전면 재작성, MDX 안전 규칙(리터럴 `<`/`{` 금지, `~`→`∼`, 화학식·아래첨자 유니코드, 각주는 `<div>`) 동일 적용.

### 이 권 특유 규칙

1. **챕터Ⅰ 차별화 각도(FR-6)**: `hs-semicon-basics`의 `passive-components`(R·L·C)·`diode`·`bjt` 모듈은 "개념·물리적 원리" 각도로 이미 존재한다. 이 권의 `electronic-devices`는 **"실무자가 부품을 손에 들고 무엇을 하는가"** — 색띠 저항 읽기, 커패시터 표기 읽기, 멀티테스터로 다이오드 극성 검사, 납땜 실습·평가 기준 — 각도로 재구성한다. 개념 설명은 1~2문장 리마인더 수준으로 압축하고 Deep 레이어에서 `hs-semicon-basics` 해당 모듈로 `SourceRef` 연결.
2. **단위계(NFR/Plan §9-4)**: 원문의 옛 공학 단위(kgf/cm², mmHg, at 등, 챕터Ⅳ 중심)는 **원문 그대로 쓰되 괄호로 SI 환산값을 병기**한다 — 예: "1[at] = 735.5[mmHg] ≈ 98.07[kPa]". 계산식·법칙 자체(보일의 법칙 PV=일정 등)는 원문 그대로 보존.
3. **KS 표준 고유명사(챕터Ⅲ)**: "한국산업규격(KS B ISO 5457)" 등 표준 번호는 원문 그대로 인용 가능(사실 정보이지 원문 창작 표현이 아님 — 저작권 재작성 원칙과 무충돌).
4. **실습·평가표(챕터Ⅰ·Ⅱ)**: 원문의 실습 평가 기준표는 그대로 옮기지 않고, "이 실습에서 확인하는 것" 요약으로 재구성(daegu의 확인문제 미사용 원칙과 동일 정신).
5. **C코드 예제(챕터Ⅴ)**: 원문 예제 코드 자체(`printf`, 변수 선언 등)는 저작권 보호 대상이 아닌 범용 프로그래밍 관용구이므로 유사 예제로 재작성해 사용 가능 — 단 원문 예제의 특정 서술(문제 설명 문장)은 재작성한다.

## 5. cross-link 태깅 전략 (`hs-basic-tech-1/_links.json`)

기존 3권(daegu·반도체기초)과 달리 이 권은 **NCS 반도체장비 트랙과의 연결이 핵심 가치**(Plan Core Value). 최소 태깅 원칙(실제 본문 언급 기준)을 유지하되, 아래 모듈은 통제 어휘와 직접 연결 가능:

| 모듈 | topics 후보 | 비고 |
|---|---|---|
| `pneumatics-basics`/`pneumatics-equipment` | `gas-safety`, `engineering-controls` | 압축가스·밸브 제어 — `compressed-gas` hazard 태깅 검토 |
| `hydraulics-equipment` | `engineering-controls` | fab 장비 액추에이터 원리 |
| `drafting-standards` 등 챕터Ⅲ 전체 | (통제 어휘 무관 — 태깅 생략 가능) | 설계 제도는 화학/공정 어휘와 접점 없음, 무리한 태깅 금지 |

`SourceRef`로 직접 연결(어휘 태깅과 별개, 본문 tip Callout 활용):
- `electronic-devices` → `hs-semicon-basics` `passive-components`/`diode`/`bjt` (개념 심화)
- `drafting-standards`/`drawing-methods`/`sectional-views` → NCS `equipment-concept-design`·`equipment-main-design`·`equipment-board-design`
- `pneumatics-*`/`hydraulics-equipment` → NCS `vacuum-plasma-maintenance`·`chemical-gas-maintenance`
- `c-basics`/`c-programming` → NCS `equipment-system-software`·`firmware-development`

FR-7 목표(NCS 상호 연결 최소 2건)는 이 매핑으로 충분히 초과 달성.

## 6. 검증 계획

- `typecheck` + `lint` + `build` — `/sources/hs-basic-tech-1/`(인덱스, 5트랙) + 12모듈 SSG 확인.
- `build:cross-link` 통제 어휘 검증 통과, `quotes.json` 회귀 0.
- 렌더 실측: 홈 교과서 그룹 3번째 카드 · 인덱스 5트랙 그룹 · 파일럿 모듈(전자 소자) 3단 레이어·출처 footer·`hs-semicon-basics` 연결 · 다크모드.
- 저작권 자가 점검: 원문 이미지 0 · 원문 문장 재사용 0 · 출처 표기 존재 · 단위 병기 규칙 적용.
- 챕터Ⅰ 재구성 순서 자가 검증: `electronic-devices.mdx`가 §3.1 순서(①~⑨)를 따랐는지, `dc-circuits.mdx`가 207행부터 시작하는 내용인지 교차 확인.

## 7. 구현 순서

1. `sources.ts`(`HS_BASIC_TECH_1` 등록, sections는 완성분만) → `schoolTextMdx.tsx`(REGISTRY 항목) — 빌드 가능 상태 유지하며 모듈 단위로 점증
2. 파일럿 `electronic-devices.mdx` — §3.1 순서로 원문 정독 → 3단 레이어, `hs-semicon-basics` 차별화 각도 적용
3. 챕터Ⅰ 나머지(`dc-circuits`) → 챕터Ⅱ(`measurement`·`milling`) → 챕터Ⅲ(3모듈) → 챕터Ⅳ(3모듈) → 챕터Ⅴ(2모듈) — 목차 순서대로 확대, 모듈 완성마다 sections·REGISTRY·검증 동시 갱신
4. `_links.json` 태깅(§5) → 검증 게이트(§6) + 렌더 실측
