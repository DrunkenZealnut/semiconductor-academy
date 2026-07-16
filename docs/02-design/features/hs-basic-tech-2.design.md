# Design — 「반도체기초기술2」(크리아트) 자료원 — 5대단원 15모듈

> **Feature**: `hs-basic-tech-2` · Plan: `docs/01-plan/features/hs-basic-tech-2.plan.md`
> 확정안(Plan §9 승계·승인): **15중단원 전량 편입 · 파일럿 "교류 회로"(책 목차 순서) · CAD 개념·워크플로우 중심 · 반복 실습 압축+안전 예외 보존 · 원문 단위+SI 병기**

---

## 1. 아키텍처 확장 — 신규 인프라 없음

`hs-textbook-collection`이 만들고 `hs-basic-tech-1`이 실증한 카테고리 공용 골격을 그대로 재사용한다. 코드 신규 파일 **0개** — `sources.ts`·`schoolTextMdx.tsx`에 항목만 추가한다. 공용 라우트 `src/app/sources/[source]/[module]/page.tsx`의 `sections↔REGISTRY` 정합성 검증(sections에 있는데 로더 없으면 fail-fast)은 기존 그대로 동작한다.

| 확장 지점 | 현황 | 조치 |
|---|---|---|
| `SourceCategory 'hs-textbook'` | 이미 존재 | `HS_BASIC_TECH_2`에 태깅만 |
| 공용 라우트 `/sources/[source]/[module]` | 이미 존재, REGISTRY 기반 | `hs-basic-tech-2` 자료원 추가만 |
| `schoolTextMdx.tsx` REGISTRY | 2단 맵 구조 확정(book1이 2번째 항목으로 실증) | `'hs-basic-tech-2': {15개 모듈}` 블록 추가 |
| 홈 `SourcePicker` 교과서 그룹 | 무수정 — `getOrderedSources()`가 SOURCES 배열만 읽음 | 무수정 (카드 4번째 자동 추가) |
| `SOURCE_KIND_UNIT_LABELS['textbook']` | '단원' 기존 | 무수정 |

## 2. Source 등록 (`sources.ts`)

```ts
/**
 * 반도체고 교과서 「반도체기초기술2」 — 「반도체기초기술1」의 응용편
 * (교류·디지털 회로, 장비 제조·선반, 투상도·CAD, 공유압 회로·유지보수·실습,
 * 마이크로프로세서·아두이노). 원자료
 * data/school-text/20260414_071612_반도체기초기술2_크리아트_/ 전면 재작성
 * (daegu 저작권 원칙 일괄). 원문 페이지 배치 정순 — book1식 순환 역산 불필요.
 * 실습 반복 구간은 "대표 상세 + 변형 표" 압축, 안전 유의사항은 전건 보존(§4).
 */
export const HS_BASIC_TECH_2: Source = {
  id: 'hs-basic-tech-2',
  kind: 'textbook',
  language: 'ko',
  title: '반도체기초기술 2',
  subtitle: '반도체고 교과서 — 교류·디지털 회로부터 CAD·공유압 실습·아두이노까지, 장비 기술의 응용',
  attribution: '정예원 외 4인',
  publisher: '크리아트출판사',
  license: 'fair-use',
  order: 7,
  accent: 'school',
  category: 'hs-textbook',
  sections: [ /* §3 표 순서대로 15개, 완성 모듈만 등록 */ ],
};
```

`SOURCES` 배열에 `HS_BASIC_TECH_1`(6) 다음으로 `HS_BASIC_TECH_2`(7) 추가.

## 3. 섹션 전체 설계 — 15모듈 (원문 라인 범위 확정, 재검증 완료)

원문 페이지가 정순이므로(Plan §1.3) **모든 모듈이 라인 순서 그대로**다 — book1의 §3.1식 순환 재구성 지침이 필요 없다. 라인 경계는 대단원 표제·러닝 헤더·학습목표 블록으로 실측 확정했다(경계 ±수 행의 러닝 헤더·장식 이미지는 무시).

| # | id | title | group | 원문 라인 범위 | readingTime | 비고 |
|:-:|---|---|---|---|:-:|---|
| 1 | `ac-circuits` | 교류 회로 | 전기·전자 기초 | 65~398 | 13 | **파일럿**. 주파수·주기, 순시값/최댓값/실횻값, 리액턴스·임피던스, 정류 회로, 정전압 전원 회로 조립 실습 |
| 2 | `digital-circuits` | 디지털 회로 | 전기·전자 기초 | 399~832 | 14 | 진법 변환·보수, 불 대수, 논리 게이트(AND/OR/NOT/NAND/NOR/EX-OR), 반가산기·전가산기, 회로 제작 실습 |
| 3 | `equipment-manufacturing` | 반도체 장비 제조 | 기계 가공 기술 | 833~996 | 9 | 절삭(선삭·밀링·연삭)/비절삭(주조·단조) 가공법, 반도체 부품 가공 단계·기술·도전 과제 |
| 4 | `machine-tools` | 범용 공작 기계 | 기계 가공 기술 | 997~1258 | 11 | 선반의 개요·주요부·크기 표시, 바이트 설치, 다단축 가공 실습 |
| 5 | `special-projections` | 특수 투상도 그리기 | 반도체장비 설계 | 1259~1346 | 8 | 등각·사투상·투시 투상도 |
| 6 | `development-drawings` | 전개도 그리기 | 반도체장비 설계 | 1347~1424 | 8 | 평행선 전개도법, 상관체·상관선 |
| 7 | `cad-drafting` | 컴퓨터를 이용한 제도 | 반도체장비 설계 | 1425~2206 | 13 | CAD 개념·특징, 2D 제도 워크플로우, 3D 형상 모델링 — **개념 중심 압축**(§4-2) |
| 8 | `electropneumatic-circuits` | 전기공압 회로 구성하기 | 반도체장비 공유압기술 | 2207~2731 | 14 | a/b/c접점, AND·OR·NOT·자기유지·인터록·온/오프딜레이 회로, 변위 단계 선도, 순차 작동 회로 |
| 9 | `pneumatics-maintenance` | 공압 장비의 유지·보수 | 반도체장비 공유압기술 | 2732~2950 | 11 | 압축기 운전·고장 원인과 대책·윤활, 필터 교환, 실린더 점검 |
| 10 | `pneumatics-practice` | 공압 실습 과제 | 반도체장비 공유압기술 | 2951~3234 | 10 | 실습 3건(속도 제어·편측/양측 전자밸브) — **대표 상세+변형 표 압축**(§4-3) |
| 11 | `electrohydraulic-circuits` | 전기유압 회로 구성하기 | 반도체장비 공유압기술 | 3235~3828 | 14 | 유량제어·중간정지·로킹·감압·시퀀스·카운터밸런스 밸브, 어큐뮬레이터, 전기 시퀀스 기초 |
| 12 | `hydraulics-practice` | 유압 실습 과제 | 반도체장비 공유압기술 | 3829~4576 | 12 | 실습 8건(미터인/아웃·감압·시간지연·카운터 등) — **대표 상세+변형 표 압축**(§4-3) |
| 13 | `microprocessor-basics` | 마이크로프로세서 기초 | 프로그래밍 | 4577~5126 | 13 | 마이크로프로세서 구조·역사, ATmega8535 핀·레지스터·인터럽트 — 레지스터 비트 명세는 개념 수준으로 압축 |
| 14 | `microprocessor-practice` | 마이크로프로세서 실습 | 프로그래밍 | 5127~5308 | 9 | ISP 연결, LED 점등 C 프로그램 실습 |
| 15 | `arduino-practice` | 아두이노 실습 | 프로그래밍 | 5309~6154 | 14 | 아두이노 보드·IDE·기본 명령어, 실습 8건(LED·초음파·LCD·센서·모터·블루투스) — **대표 상세+변형 표 압축**(§4-3) |

- 6155~6243행(참고문헌·집필/검토/심의위원·판권)은 재구성 대상 아님 — 출처 메타로만 사용.
- href 규칙: `/sources/hs-basic-tech-2/{id}/`. readingTime 합계 173분.
- **등록 순서 = 목차 순서 = 이전/다음 내비 순서**. 완성된 모듈만 `sections`+REGISTRY에 동시 등록(미완성 모듈 등록 금지 — SSG notFound 빌드 실패).
- 슬러그는 book1 계열 명명 승계: `pneumatics-*`/`hydraulics-*` 가족 유지, book1 `dc-circuits`↔book2 `ac-circuits` 대칭.

## 4. 콘텐츠 재구성 계약 (daegu·book1 계약 승계)

전역 컴포넌트(`LayeredExplain`·`Callout`·`Term`·`SourceRef`·GFM 표) 재사용. 원문 이미지 전면 미사용, 문장 전면 재작성, MDX 안전 규칙(리터럴 `<`/`{` 금지 — 단 펜스 코드블록 내부는 예외, `~`→`∼`, 각주는 `<div>`) 동일 적용. 모듈 말미 출처 footer:

```text
출처: 반도체고 교과서 「반도체기초기술2」(정예원 외 4인 지음, 크리아트출판사) {단원}
'{중단원명}'을 근거로 전면 재작성했습니다. 원문 문장·도판은 사용하지 않았습니다.
```

### 이 권 특유 규칙

1. **book1 "기초→응용" 차별화 각도(FR-6)**: book1 대응 모듈이 이미 다룬 기초 개념(옴의 법칙, R·L·C, C 문법 등)은 1~2문장 리마인더로 압축하고 Deep 레이어 `SourceRef`로 연결한다. 이 권 본문은 **응용·구성·운용** 각도에 집중 — "직류를 배웠으니 교류에서 무엇이 달라지는가", "부품을 배웠으니 게이트·회로로 어떻게 조합하는가", "C 문법을 배웠으니 실제 하드웨어(MCU·아두이노)를 어떻게 움직이는가".
2. **CAD 파트 재구성 원칙(FR-9, R-2)**: 원문의 AutoCAD 메뉴·아이콘·명령어 단계별 나열(NEW/OPEN/SAVE/LINE/OFFSET…)을 재현하지 않는다. 재구성 축은 ① 손 제도 대비 CAD의 본질적 차이(정확성·수정·재사용), ② 소프트웨어 불문 공통 개념(좌표계, 객체 스냅, 도면층, 2D 제도→3D 모델링 워크플로우), ③ 반도체 장비 설계 실무에서 CAD가 쓰이는 맥락. 특정 제품 UI 종속 서술·화면 캡처 대체 서술 금지. "AutoCAD"는 대표 사례로 1회 언급 가능(고유명사 사실 정보).
3. **반복 실습 압축(FR-8, R-1)**: 압축 대상 모듈 #10(실습 3건)·#12(실습 8건)·#15(실습 8건). 규칙 — **대표 실습 1~2건은 상세 재구성**(실습 목표→회로/코드 원리→절차 핵심→"이 실습에서 확인하는 것"), **나머지는 변형 비교 GFM 표**(실습명·제어 대상·회로/코드 차이·핵심 학습 포인트). 실습 선정 기준: 해당 모듈 원리를 가장 넓게 덮는 것(예: #12는 미터인/미터아웃 속도 제어, #15는 초음파 센서 제어).
4. **안전 유의사항 예외 보존(FR-8 후단)**: 원문 각 실습의 "다. 안전 및 유의 사항"은 압축 대상에서 제외한다. **대표 실습은 개별 `Callout(warn)`**, 변형 표로 압축된 실습들의 안전 항목은 **모듈당 통합 `Callout(warn)`("실습 공통 안전 수칙")으로 전건 보존** — 중복 항목은 1회 통합, 특정 실습 고유 항목은 실습명을 붙여 명시, **항목 누락 0**. 단, 원문 안전 항목이 전 실습 공통 수칙뿐이고 실습 고유 항목이 없는 모듈(예: 아두이노 실습)은 통합 Callout 단독으로 충분하다(개별 Callout은 동일 문구 중복만 만들므로 생략 허용 — 2026-07-17 Check 단계 명문화). 사이트 정체성(유해인자·안전 교육)과 직결되므로 왜곡·요약 생략 금지(NFR-5).
5. **단위계(Plan §9-5)**: 원문 옛 공학 단위(kgf/cm², mmHg, at 등 — Ⅳ장 중심)는 원문 그대로 쓰되 괄호로 SI 환산값 병기(book1 규칙 그대로, 예: "1[at] = 735.5[mmHg] ≈ 98.07[kPa]"). 전기 단위(Hz, V, A, Ω)·논리 표기는 현행 그대로.
6. **코드 예제(Ⅴ장)**: C/아두이노 예제 코드는 범용 프로그래밍 관용구로 유사 예제 재작성 사용 가능(book1 규칙). 코드는 반드시 펜스 코드블록 안에만 배치(`#include <avr/io.h>` 등의 `<`가 JSX와 충돌하지 않도록). 원문 실습의 문제 설명 문장은 재작성.
7. **레지스터 명세 압축(#13)**: ATmega8535 레지스터 비트 단위 명세(SREG·MCUCR·TIMSK·TIFR 비트별 표)는 전량 재현하지 않고 "레지스터로 하드웨어를 제어한다는 개념 + 대표 1개(SREG) 구조" 수준으로 압축 — 특정 단종 칩의 데이터시트 세부는 학습 가치 대비 밀도 과잉.

## 5. cross-link 태깅 전략 (`hs-basic-tech-2/_links.json`)

최소 태깅 원칙(실제 본문 내용 기준) 유지 — book1과 동일하게 **압축공기를 직접 다루는 공압 모듈만 태깅**, 유압(액체)·전기·기계·설계·프로그래밍 모듈은 통제 어휘 비대상(태깅 생략, `$comment`에 사유 명시).

| 모듈 | topics | hazards |
|---|---|---|
| `electropneumatic-circuits` | `gas-safety`, `engineering-controls` | `compressed-gas` |
| `pneumatics-maintenance` | `gas-safety`, `engineering-controls` | `compressed-gas` |
| `pneumatics-practice` | `gas-safety` | `compressed-gas` |

`SourceRef` 직접 연결(어휘 태깅과 별개, Deep 레이어·tip Callout 활용) — **book1 연결(FR-6)**:

| book2 모듈 | → book1 `SourceRef` 대상 |
|---|---|
| `ac-circuits` | `dc-circuits`(직류→교류), `electronic-devices`(R·L·C 리액턴스) |
| `digital-circuits` | `electronic-devices`(다이오드·트랜지스터가 게이트의 재료) |
| `equipment-manufacturing` / `machine-tools` | `milling`(밀링↔선반 병렬), `measurement`(가공 후 측정) |
| `special-projections` / `development-drawings` | `drawing-methods`(정투상→특수투상), `sectional-views` |
| `cad-drafting` | `drafting-standards`(KS 규격을 CAD로 구현) |
| `electropneumatic-circuits` / `pneumatics-*` | `pneumatics-basics`, `pneumatics-equipment`(이론→회로·운용) |
| `electrohydraulic-circuits` / `hydraulics-practice` | `hydraulics-equipment` |
| `microprocessor-*` / `arduino-practice` | `c-basics`, `c-programming`(C 문법→하드웨어 제어) |

**NCS 연결(FR-7, 최소 3건 — 설계상 6건+)**: `cad-drafting` → `equipment-concept-design`·`equipment-main-design` / `pneumatics-maintenance` → `vacuum-plasma-maintenance`·`chemical-gas-maintenance` / `machine-tools` → `equipment-mechanical-assembly` / `microprocessor-basics`·`arduino-practice` → `equipment-board-design`·`firmware-development`·`equipment-system-software`.

## 6. 검증 계획

- `typecheck` + `lint` + `build` — `/sources/hs-basic-tech-2/`(인덱스, 5트랙) + 15모듈 SSG 확인, 기존 4권·책·OSHA·NCS 회귀 없음.
- `build:cross-link` 통제 어휘 검증 통과(7 sources 예상), `quotes.json` 회귀 0(교과서는 인용 인덱스 비대상).
- 렌더 실측: 홈 교과서 그룹 4번째 카드 · 인덱스 5트랙 그룹 · 파일럿 모듈(교류 회로) 3단 레이어·출처 footer·book1 `SourceRef` 동작 · 다크모드.
- 저작권 자가 점검: 원문 이미지 0 · 원문 문장 재사용 0(근접 패러프레이즈 검사 — book1 선례의 최장 공통 부분열 대조 포함) · 출처 표기 15/15 · 단위 병기 규칙 적용(Ⅳ장).
- 압축 품질 점검: #10·#12·#15 변형 표가 원문 실습 전건을 누락 없이 커버하는지, **안전 유의 항목 누락 0**인지 원문 대조.
- CAD 모듈 점검: 특정 소프트웨어 명령어 단계 나열이 없는지(§4-2 위반 스캔).

## 7. 구현 순서

1. `sources.ts`(`HS_BASIC_TECH_2` 등록, sections는 완성분만) → `schoolTextMdx.tsx`(REGISTRY 항목) — 빌드 가능 상태 유지하며 모듈 단위 점증
2. 파일럿 `ac-circuits.mdx`(65~398행 정독 → 3단 레이어, book1 `dc-circuits` 연결·응용 각도 적용) → **검증 게이트**(빌드+렌더+저작권 자가 점검)
3. 게이트 통과 후 나머지 14모듈 — book1 선례대로 병렬 서브에이전트(공통 스펙 파일 기반), 대단원 단위 배치: Ⅰ잔여(#2) · Ⅱ(#3~4) · Ⅲ(#5~7) · Ⅳ전반(#8~10) · Ⅳ후반(#11~12) · Ⅴ(#13~15) — Ⅳ장(2,370줄)은 2팀 분할, 압축 규칙(§4-3·4)은 스펙 파일에 명문화해 전 팀 공유
4. `_links.json` 태깅(§5) → `npm run build:cross-link` → 검증 게이트(§6) 전체 실행 + 렌더 실측
