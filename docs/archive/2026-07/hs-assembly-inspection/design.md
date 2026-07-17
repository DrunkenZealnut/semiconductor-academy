# Design — 「반도체 조립·검사」(에이치앤지) 자료원 — 6대단원 12모듈

> **Feature**: `hs-assembly-inspection` · Plan: `docs/01-plan/features/hs-assembly-inspection.plan.md`
> 확정안(Plan §9 승계·승인): **12중단원 전량 편입 · 파일럿 "반도체 조립 개요" · 형식 12모듈 유지(병합·분할 없음) · 실습과제 단위 재구성 · "장비 기술자의 눈" + 후공정 보정(움직이는 기계의 안전)**

---

## 1. 아키텍처 확장 — 신규 인프라 없음

카테고리 공용 골격(5권째 실증) 그대로. 코드 신규 파일 **0개**.

| 확장 지점 | 조치 |
|---|---|
| `sources.ts` | `HS_ASSEMBLY_INSPECTION`(order 10) 등록만 |
| `schoolTextMdx.tsx` REGISTRY | `'hs-assembly-inspection': {12개 모듈}` 블록 추가 |
| 홈 `SourcePicker` | 무수정(교과서 그룹 7번째 카드 자동) |

## 2. Source 등록 (`sources.ts`)

```ts
/**
 * 반도체고 교과서 「반도체 조립·검사」 — 후공정(패키징) 조립·검사 공정과
 * 쏘잉·다이 본딩·프로브 테스트·파티클 카운터 장비의 구조·조작·유지보수
 * (2015 개정 교육과정, 충청북도교육청 인정 15-충북-63-고교-19-004 —
 * P3 「포토·에칭」(-002)·P4 「박막·확산」(-003)과 같은 시리즈 3권째). 원자료
 * data/school-text/20260415_182247_반도체조립검사_에이치앤지_/ 전면 재작성.
 * ⚠️ 조작 서술 노골("조작버튼 F3 Enter"·AC 전원 시퀀스) — "장비 일반화
 * 특칙"(Design §4) 적용, 버튼·화면 조작 시퀀스 재현 금지.
 */
export const HS_ASSEMBLY_INSPECTION: Source = {
  id: 'hs-assembly-inspection',
  kind: 'textbook',
  language: 'ko',
  title: '반도체 조립·검사',
  subtitle:
    '반도체고 교과서 — 패키징 조립 공정부터 쏘잉·다이 본딩 장비, 프로브 테스트·파티클 카운터 검사까지',
  attribution: '김경원 외 3인',
  publisher: '에이치앤지',
  license: 'fair-use',
  order: 10,
  accent: 'school',
  category: 'hs-textbook',
  sections: [ /* §3 표 순서대로 12개, 완성 모듈만 등록 */ ],
};
```

## 3. 섹션 전체 설계 — 12모듈

원문 정순(페이지 1~256 단조). 전 경계 페이지 마커 대조 확정(2026-07-17). **5352행 이후(찾아보기 ×2·참고문헌·판권) 재구성 비대상.** 실습과제 워크시트가 조작·유지보수 절 말미마다 붙는 편성(§4-2)이라 실습 전용 모듈은 없다.

| # | id | title | group | 원문 라인 | RT | 비고 |
|:-:|---|---|---|---|:-:|---|
| 1 | `packaging-overview` | 반도체 조립 개요 | 조립 개요 | 63~358 | 11 | **파일럿**. 패키지 구조·4대 기능(전력·신호·방열·보호)·8공정 흐름(백그라인딩→쏘잉→다이 본딩→…→솔더 볼→싱귤레이션)·TSOP/FBGA·발전 트렌드 — 책 ch13·packaging Process 연결 실증 |
| 2 | `sawing-process` | 쏘잉 공정 및 장비 개요 | 쏘잉 장비 | 359~442 | 6 | 시리즈 최소 모듈(~84줄) — 개요로 독립 유지 |
| 3 | `sawing-equipment` | 쏘잉 장비의 구조 및 기능 | 쏘잉 장비 | 443~654 | 9 | **특칙** — 테이프 마운터·쏘잉 머신(스핀들·척 테이블·절삭수·비전 정렬)의 보편 구조. DAD640은 사례 |
| 4 | `sawing-operation` | 쏘잉 장비의 조작 | 쏘잉 장비 | 655~1190 | 11 | **특칙** — 준비/본 작업·자동 절삭의 논리. 말미 실습과제 2건 포함 |
| 5 | `sawing-practice` | 쏘잉 장비의 모듈 실습 및 유지·보수 | 쏘잉 장비 | 1191~2271 | 13 | **특칙+압축** — 실습과제 2건+PM 점검(스핀들 카본 브러시·Z축 청소·그리스 도포·점검 주기표). 대형(~1,081줄) 단독 배치 |
| 6 | `diebond-process` | 다이 본딩 공정 및 장비 개요 | 다이 본딩 장비 | 2272~2346 | 6 | 다이 어태치 공정 개념 |
| 7 | `diebond-equipment` | 다이 본딩 장비의 구조 및 기능 | 다이 본딩 장비 | 2347~2521 | 9 | **특칙** — 다이 본더(픽업·본딩 헤드·이젝터·비전)+에폭시 디스펜서의 보편 구조. SL9002/SL9022·CM-700은 사례. `epoxy-resin` 실증 |
| 8 | `diebond-operation` | 다이 본딩 장비의 조작 | 다이 본딩 장비 | 2522~2993 | 11 | **특칙** — 말미 실습과제 1건 포함 |
| 9 | `diebond-practice` | 다이 본딩 장비의 모듈 실습 및 유지·보수 | 다이 본딩 장비 | 2994~3286 | 9 | **특칙+압축** — 실습과제 1건(에폭시 디스펜서 노즐 분해·조립)+PM 점검표 |
| 10 | `inspection-overview` | 반도체 검사 개요 | 검사 개요 | 3287~3603 | 11 | 검사의 분류·프로브 테스트 공정(EDS)·패키지 테스트 공정 — NCS 테스트 트랙 연결 축 |
| 11 | `probe-test` | 프로브 테스트 장비 | 프로브 테스트 장비 | 3604~4785 | 15 | **특칙** — 소단원 4개(개요 p166/구조 p167/조작 p177/유지·보수 p211)를 한 모듈에서 소화. 실습과제 3건(프로브 셋업 등). 단일 모듈 최대(~1,182줄) 단독 배치 |
| 12 | `particle-counter` | 파티클 카운터 장비 | 파티클 카운터 장비 | 4786~5351 | 12 | **특칙** — 레이저 산란 검출 원리·광학계(레이저 25회 집중). 실습과제 2건. `cleanroom` 축 — P3 fab-cleanroom 권 간 연결 |

- RT 합계 **123분**. href `/sources/hs-assembly-inspection/{id}/`. 등록 순서 = 목차 순서.
- 내부 소단원 경계(참고): #11은 3629/3646/3797/4491, #12는 4806/4897/4937/5022. Ⅲ 내부는 2310/2347/2522/2994.

## 4. 콘텐츠 재구성 계약 (시리즈 계약 승계)

전역 컴포넌트·MDX 안전 규칙·footer 템플릿("「반도체 조립·검사」(김경원 외 3인 지음, 에이치앤지) {대단원} '{중단원명}'…") 시리즈 동일. 화학식 유니코드 대상은 이 권에 사실상 없음(가스 무등장).

### 이 권 특유 규칙

1. **장비 일반화 특칙**(#3~#12): 버튼·터치·화면 조작 시퀀스 재현 금지 — "조작버튼 F3 Enter를 누른다"·AC 전원 온/오프 절차·GPIO 보드 테스트 포인트 지정 류는 "장비 조작부에서 해당 기능을 실행한다" 수준으로 추상화. 모델명(DAD640·SL9002/SL9022·CM-700·UDC 300)은 대표 사례로 모듈당 2~3회 이내. **장비 유형 4종의 일반화 축**: 쏘잉 머신(고속 회전 블레이드 절삭 — 스핀들·척 테이블·절삭수·비전), 다이 본더(픽업↔본딩 헤드·이젝터·디스펜서), 프로버(니들 카드·척 정렬·테스터 연동), 파티클 카운터(레이저 산란 광학계). 공정 조건·수치(블레이드 회전수·본딩 온도 등)는 "이 유형 장비의 대표 조건" 문맥으로 보존.
2. **실습과제 원위치 재구성**(P4 방식 보정): 실습 전용 중단원이 없고 워크시트(실습목표/기기/재료/안전·유의/방법/평가)가 조작·유지보수 절 말미마다 붙는다 — 1차 스캔 11건(#4 ×2 · #5 ×2 · #8 ×1 · #9 ×1 · #11 ×3 · #12 ×2, **전수는 담당 배치가 확정·보고**). 실습과제는 **원문 위치 그대로 해당 모듈 안에** 실습과제 단위로 재구성(대표 상세+변형 압축), 같은 트랙 조작↔실습·유지보수 모듈은 SourceRef 상호 연결. 안전 유의사항 전건 보존(대표 개별+통합 warning Callout — 시리즈 확정 조항).
3. **"장비 기술자의 눈" + 후공정 보정**: 전공정(P3·P4 — 챔버 속 화학·플라스마)과 달리 후공정 장비는 **기계 동작이 눈에 보인다**(회전·이송·픽업·접촉). "움직이는 기계의 안전"(회전체 협착·절단·레이저)을 Ⅱ~Ⅵ를 관통하는 학습 축으로. 공정 원리(패키징 개념)는 #1과 책 ch13 참조로 압축, 장비 모듈 본문은 "어떻게 구현·운용·유지되는가".
4. **유해인자 연결 우선**: 에폭시(감작성 — 다이 본딩 접착제 26회 집중)·몰딩/EMC·솔더 볼 대목에서 **ChapterRef(order 13)** 로 안내, 위험 상세는 책 ch13이 담당. 물리 위험(블레이드·레이저) 안전 수칙은 본문 전건 보존.
5. **packaging Process 연결(로드맵 비고 이행 수단)**: Process 페이지는 cross-link 소스가 아니므로 ⑴ `packaging` topic 태깅 → 책 ch13(externalLink `/process/packaging/`)·NCS 패키지 계열 자동 연결 ⑵ #1·다이 본딩·쏘잉 모듈의 ChapterRef(13) 직접 연결로 이행. `/process/` 마크다운 직접 링크는 선례 없음 — 도입하지 않는다.
6. **OCR 오식 대응**: "다이 본당"→본딩, "파태티클"→파티클, "응어 정리"→용어 정리, "조랍"→조립, "Singlation"→Singulation 교정. SL9002(200mm) vs SL9022/CM-700(300mm) 모델 혼재는 원문 문맥 대조 후 서술, 애매 수치 보류(시리즈 원칙).

## 5. cross-link 태깅 전략 (`hs-assembly-inspection/_links.json`)

본문 실증 기준(Do 확정) — 후보표. `packaging` 태그로 책 ch13(13-packaging)·NCS 패키지 계열(package-assembly-development·wirebond-package-development 등 6+)·hs-semicon-basics(semicon-industry)와 자동 상호 연결(byTopic 실측 16건).

| 모듈 | topics 후보 | chemicals 후보 |
|---|---|---|
| `packaging-overview` | `packaging` | (에폭시 1회 — 실증 미달 제외) |
| `sawing-process` | `packaging` | |
| `sawing-equipment` | `packaging`, `engineering-controls` | |
| `sawing-operation` | `packaging`, `engineering-controls` | |
| `sawing-practice` | `packaging`, `engineering-controls` | |
| `diebond-process` | `packaging` | |
| `diebond-equipment` | `packaging` | `epoxy-resin` (2428~2440 집중) |
| `diebond-operation` | `packaging` | `epoxy-resin` (2682~2963) |
| `diebond-practice` | `packaging` | `epoxy-resin` (3001~3188) |
| `inspection-overview` | `packaging` | |
| `probe-test` | `packaging`, `engineering-controls` | |
| `particle-counter` | `cleanroom`, `engineering-controls` | |

솔더는 납 성분 미언급(공정 서술만) — chemicals 태깅 제외.

**직접 연결 매핑**:

| 이 권 모듈 | 연결 대상 | 수단 |
|---|---|---|
| `packaging-overview` | 책 ch13(칩 조립·검사 유해인자 — packaging Process 관문) + ncs `package-assembly-development` + daegu `process-overview`(전→후공정 위치 잡기) | ChapterRef(order 13) + SourceRef ×2 |
| `sawing-equipment`/`sawing-operation` | 책 ch13(절삭 분진·물리 위험) | ChapterRef(order 13) |
| `diebond-equipment`/`diebond-operation` | 책 ch13(에폭시 감작성) | ChapterRef(order 13) |
| `inspection-overview` | ncs `wafer-level-test`(EDS) + `package-level-test` | SourceRef ×2 |
| `probe-test` | ncs `wafer-level-test` + 같은 소스 `inspection-overview` | SourceRef |
| `particle-counter` | `hs-photo-etch` `fab-cleanroom`(클린룸 오염 관리 — 권 간) + ncs `metrology-equipment` | SourceRef ×2 |
| 실습 포함 모듈(#4↔#5, #8↔#9) | 같은 트랙 조작↔실습·유지보수 상호 | SourceRef |

→ FR-7(ChapterRef 3건+ ∧ packaging Process 이행) 충족, FR-10(NCS 4 + P3 1 = 5건+) 초과.

## 6. 검증 계획

- `typecheck`+`lint`+`build` — 인덱스 6트랙(1모듈 트랙 4개 포함) + 12모듈 SSG, 기존 9자료원 회귀 0.
- `build:cross-link`(10 sources 예상)·`quotes.json` 회귀 0.
- 렌더 실측: 홈 7번째 교과서 카드·파일럿 3단 레이어·ChapterRef(13)·권 간 SourceRef(P3 fab-cleanroom)·1모듈 트랙 렌더.
- 저작권: 원문 이미지 0·근접 패러프레이즈 스캔·출처 표기 12/12.
- **조작 시퀀스 스캔**: "버튼"·"F3"·"Enter"·"터치"·"누른다" 연쇄 패턴 부재 확인(#3~#12) + 모델명 빈도(모듈당 ≤3).
- 실습 커버리지: 실습과제 전수(1차 11건, 담당 배치 보고 기준) 누락 0·안전 항목 누락 0·조작↔실습 상호 참조 정합.

## 7. 구현 순서

1. `sources.ts`·`schoolTextMdx.tsx` 등록(파일럿부터 점증)
2. 파일럿 `packaging-overview.mdx`(63~358행 — 책 ch13·packaging Process·NCS 연결 실증) → **검증 게이트**
3. 잔여 11모듈 병렬 서브에이전트 **5배치**(공통 스펙 파일, 시리즈 표준):
   - A: `sawing-process`+`sawing-equipment`+`sawing-operation`(359~1190 연속 — 실습과제 2건 전수 보고)
   - B: `sawing-practice`(1191~2271) **단독** — 대형, 실습과제 전수 보고
   - C: `diebond-process`+`diebond-equipment`+`diebond-operation`+`diebond-practice`(2272~3286 연속 — 실습과제 2건 전수 보고, epoxy-resin 실증 보고)
   - D: `inspection-overview`+`probe-test`(3287~4785 — probe-test 대형, 실습과제 3건 전수 보고)
   - E: `particle-counter`(4786~5351) 단독 — 실습과제 2건 전수 보고, 레이저 안전 보존
4. `_links.json`(본문 실증) → 전체 게이트(§6) + 렌더 실측
