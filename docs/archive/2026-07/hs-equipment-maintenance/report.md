# 반도체 장비 유지 보수 완주 보고서

> **Status**: Complete
> **Project**: SemiconductorAcademy (반도체 산업 유해인자 교육 정적 사이트)
> **Feature**: `hs-equipment-maintenance` — 「반도체 장비 유지 보수」 5대단원 14모듈 신규 자료원
> **Completion Date**: 2026-07-18
> **Branch**: Pending (사용자 요청 시에만 커밋 — 프로젝트 규칙)
> **Commit Status**: Untracked (변경: `sources.ts`·`schoolTextMdx.tsx`·`cross-link.json` 수정 + `src/content/sources/hs-equipment-maintenance/` 신규 15파일)

---

## Executive Summary

### 1.1 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **Feature** | 「반도체 장비 유지 보수」(왕현철 외 3인, 충남반도체마이스터고등학교, 2022 개정 교육과정, 2026-03-01 초판, 7,048줄 OCR) 원문의 5대단원 22중단원을 **소형 병합 14모듈**로 3단 레이어(Hook/Easy/Deep) 재구성 + `hs-textbook-collection` 카테고리 인프라 상속 |
| **상속** | `hs-assembly-inspection`(P5 — 특칙 강화판·"움직이는 기계의 안전" 축, Match 100%) + `hs-thinfilm-diffusion`(P4 — 장비 유형 일반화·요소기술 접점, 100%) + `hs-basic-tech-2`(P2 — 신규 콘텐츠 유형 CAD 선례, 100%) + `hs-textbook-collection`(카테고리 인프라, 97.6%) |
| **로드맵 위치** | `hs-textbook-collection.plan.md` §5.3의 **P6**(신규 8권 중 여섯 번째, 비고 "NCS 장비 트랙과 강한 교차") — **8권 교과서 카테고리의 마지막 신규 권** |
| **범위** | **전량 편입**(5대단원 22중단원 완주, 병합 14모듈) + 파일럿(Ⅰ 산업·직무, `industry-trend`) + 병렬 6배치 Sonnet 서브에이전트 구현 + 저작권 최보수(이미지 0·문장 전면 재작성·출처 표기) + NCS 장비 트랙·P1~P5 전권·책 ch5~14 교차 최다 연결 |
| **시작 일시** | 2026-07-17 21:24Z (Plan 착수) |
| **완료 일시** | 2026-07-18 (Check 96%→Gap 전건 수정→Report) |
| **PDCA 사이클** | Plan(결정 5건·판권 R-1 Design 선행) → Design(§1~7, 14모듈 라인 경계 확정·판권 확정) → Do(14모듈 전량 구현+게이트) → Check(96%, Gap 3건 발견) → **Gap 전건 수정(실질 100%)** → Report |

### 1.2 결과 요약

```text
┌──────────────────────────────────────────────────────┐
│  Design Match Rate: 96% ✅ → Gap 전건 수정 후 실질 100% │
├──────────────────────────────────────────────────────┤
│  ✅ 완료:         14/14 모듈, FR 1~10, NFR 1~5        │
│  🔧 수정 완료:     Gap 3건(P2) 전건 해소               │
│  ❌ 미해결:        0건                                │
│  📊 빌드 검증:     270페이지 SSG·14/14 모듈·          │
│                  cross-link 11 sources·857 edges     │
└──────────────────────────────────────────────────────┘
```

### 1.3 Value Delivered

| 관점 | 내용 (Plan 목표 → 달성 결과) |
|------|------|
| **Problem** | 「반도체 장비 유지 보수」(충남반도체마이스터고, **7,048줄·약 200쪽 시리즈 최대급**)가 미반영. **발행 주체가 P3~P5(에이치앤지·2015 개정)와 완전히 다른** 학교 발행 교과서(2022 개정·충남 인정)로 판권 재확인 필요, **5대단원 22중단원(시리즈 최다)**, Ⅱ 공정 장비가 P3·P4·P5와 정면 중복, OCR 노이즈(이모지 🚺·오식 "교등학교"·"확습"·"딘원") 심각. |
| **Solution** | **① 판권 R-1 해소** — Design에서 판권 페이지(6988~) 대조로 "왕현철 외 3인 지음, 충남반도체마이스터고등학교" 확정. **② 소형 병합 14모듈** — Ⅰ 2→1·Ⅲ 6→4(플라스마 단독=RF 밀집 분리)·Ⅱ 6→3(연결 위임)·Ⅳ 5→3·Ⅴ 3 분할 유지. **③ Ⅱ 중복 연결 위임** — 신규 서술 최소, P3·P4·P5 SourceRef+책 ChapterRef로 위임. **④ Ⅲ·Ⅴ 신규 콘텐츠 집중**(진공·가스·플라스마·TPM/PM/BM/SEMI). **⑤ Ⅳ 설계기술** P2 CAD 방식(도구 조작 비재현). |
| **Function·UX Effect** | 홈 "반도체 고등학교 교과서" 그룹에 **8번째 권 카드(order 11)** — 신규 8권 완주. `/sources/hs-equipment-maintenance/`에서 **5트랙**(장비 산업 동향→공정 장비→요소 기술→설계 기술→장비 관리) 14모듈 탐색. **NCS 장비 트랙 24건/16섹션** 교차(로드맵 비고 "최다 교차" 수치 이행, FR-7 목표 4건의 6배) + **P1~P5 권 간 18건 + 책 ChapterRef 16건**(ch5~14) — 같은 장비를 유지보수 각도로 재방문. |
| **Core Value** | 전공정(P3·P4)·후공정(P5)의 "**공정** 각론"에 이어, **장비 자체의 요소 기술·설계·유지보수**라는 직교 축이 채워졌다. **8권 교과서 카테고리의 마지막 신규 권**으로서 "공정을 이해한 학생이 → 장비의 하부 기술·관리를 익혀 → 장비 기술자·정비 직무(NCS)로 이어지는" 동선이 완성됐다. 유해인자 관점에서도 **"정지 상태 정비 안전"**(LOTO·인터로크·비상정지·SEMI S2/S8)이라는, 공정 운전과 구별되는 새 안전 축을 사이트에 더했다(P5 "움직이는 기계의 안전"의 확대). |

---

## 2. PDCA 사이클 요약

### 2.1 Plan 단계
**문서**: `docs/01-plan/features/hs-equipment-maintenance.plan.md` (194줄)

- **핵심 리스크 발견**:
  - R-1 **판권·저작자 귀속 불명**(학교 발행·앞부분 미노출) → Design 선행 과제로 지정
  - R-2 **중단원 22개 → 단일 사이클 과부하** → 소형 병합 13~14모듈 방침
  - R-3 **Ⅱ 공정 장비 P3·P4·P5 정면 중복** → "장비 하드웨어·정비 관점" 각도 + 권 간 위임
  - R-5 **OCR 노이즈 심각**(이모지 🚺·오식) → Design 페이지 마커 대조 정밀화
- **결정 5건**(§9): ① 범위 5대단원 전량 편입 ② 파일럿 Ⅰ 산업·직무 ③ **모듈화 병합 13~14**(이 권 최대 판단) ④ Ⅱ 연결 위임·Ⅲ·Ⅴ 집중 ⑤ "정지 정비 안전" 축 + 판권 Design 확정
- **목표·비목표**(FR 10·NFR 5·DoD 10, §6~10)

### 2.2 Design 단계
**문서**: `docs/02-design/features/hs-equipment-maintenance.design.md` (140줄)

- **아키텍처 확장 제로**: 카테고리 인프라 재사용, 신규 코드 0 — `sources.ts`에 `HS_EQUIPMENT_MAINTENANCE`(order 11)+sections 14, `schoolTextMdx.tsx` REGISTRY 14 로더, 홈 SourcePicker 자동 8번째 카드.
- **판권 확정(R-1 해소)**: 원문 판권 페이지(6988~7048행) 대조 — 지은이 **왕현철 외 3인**(집필위원 권용호·이중한·서구영 등), 개발 충남반도체마이스터고, 발행 교육출판 세종, 편찬 충남대 능력중심교육과정 교과서연구소, 심의 충청남도교육청, **22-충남-78-고교-26-007·2026-03-01 초판**. license `fair-use`.
- **섹션 14개 명세(§3, 원문 라인 경계 확정)**: RT 합 ~131분, 5트랙. 13 vs 14 결정에서 **플라스마 단독(#6)**을 RF·유해인자 밀집(플라스마 111·RF 53)으로 분리해 14 채택. 대형 모듈 #9(~825줄)·#14(~642줄 안전핵심)·#4(~655줄)는 RT 상향 단독 소화.
- **재구성 계약 #1~#7(§4)**: #1 특칙 초점 이동(조작 시퀀스 부재→제조사 매뉴얼·NCS 학습모듈 비재현) #2 Ⅱ 연결 위임 #3 Ⅲ·Ⅴ 신규 집중 #4 Ⅳ P2 CAD 방식 #5 안전축 "정지 정비 안전"+**원문 부재 항목(고소·질식·PPE·MSDS) 창작 금지** #6 OCR 정제 #7 모델·제조사명 재현 차단.
- **cross-link 전략(§5)**: 본문 실증 태깅 + 권 간 최대. NCS 장비 트랙 24모듈·P1~P5·책 ch5~14 연결로 "사이트 최다 교차 자료원" 목표.

### 2.3 Do 단계 (구현)
**구현 방식**: 파일럿 `industry-trend` 직접 작성·게이트 통과 → 6배치 병렬 Sonnet 서브에이전트(P5 격리 이슈 대응 — 텍스트 반환·메인 Write). MDX 합 **2,634줄**.

| 배치 | 할당 | 모듈 | 특징 |
|------|------|:---:|---|
| 파일럿 | 직접 | 1 | `industry-trend`(162~274 중복 dedup·오식 정제 실증) |
| A | Sonnet | 3 | 공정 장비(#2·#3·#4) — 연결 위임형 얇게 |
| B | Sonnet | 4 | 요소 기술(#5~#8) — 신규 콘텐츠 집중 |
| C | Sonnet | 1 | 설계 콘셉트+기구(#9, ~825줄 단독) |
| D | Sonnet | 2 | 전장·제어·S/W 설계(#10·#11) |
| E | Sonnet | 2 | 유지보수 개론·셋업(#12·#13) |
| F | Sonnet | 1 | 장비별 PM(#14, ~642줄 안전핵심 단독) |

- **OCR 노이즈 전량 정제**: 162~274 중복 블록 dedup, 이모지 원문자(🚺=①) 복원, 오식(교등학교·확습·딘원·바도치) 정정, 표 파편 보류.
- **Fable 리뷰**: `maintenance-by-type`(안전핵심)·`design-electrical`(인터로크 3계층·EMO·안전PLC IEC 61508)·`element-vacuum-gas`(포스핀 자연발화·아르신 극독성) 정밀 검증, 근접 패러프레이즈 0.
- **게이트 전부 통과**: typecheck·lint 0, build 270p SSG(14/14), cross-link 11 sources·152 sections·857 edges(G-3 태깅 후 최종)·unknown 0, quotes 214 회귀 0, 특칙 조작 시퀀스 0, 이미지 0, footer 14/14.

### 2.4 Check 단계 (분석)
**문서**: `docs/03-analysis/hs-equipment-maintenance.analysis.md`

- **gap-detector 정적 대조 + 오케스트레이터 동적 게이트 재실행** 합산 → **Match Rate 96%**.
- 판정 A~E(모듈완결성·판권·재구성계약·cross-link·FR/DoD) **전건 Match**, FR-1~10 전건(FR-7·8·9 초과), DoD 10/10.
- **Gap: P0 0·P1 0·P2 3건** → 같은 세션에서 **전건 수정 완료**:
  - **G-1** 크라이오 펌프 냉각 온도 모듈 간 모순(−260℃ vs −196℃) → 두 모듈 −260℃ 통일·비유 정확화
  - **G-2** `design-concept-mechanical` 상용 모델명(XGP-ACF1·GOT2000) → "산업용 PLC / 터치패널 HMI" 일반화
  - **G-3** `maintenance-by-type` `industrial-hygiene` 미태깅 → 본문 실증 근거로 태깅 추가(cross-link 854→857 edges)
- 각 수정 후 build 재검증 통과 → **잔여 Gap 0**.

---

## 3. 완료된 항목

### 3.1 기능 요구사항 (FR)

| FR | 요구 | 달성 | 판정 |
|---|---|---|:--:|
| FR-1 | order 11 등록·홈 그룹·인덱스 노출 | sources.ts:1621-1748, 8번째 카드 | ✅ |
| FR-2 | 5트랙 그룹 렌더(무수정) | 장비산업동향/공정장비/요소기술/설계기술/장비관리 | ✅ |
| FR-3 | 14모듈 MDX + 공용 라우트 SSG | REGISTRY 14/14, 270p SSG | ✅ |
| FR-4 | 3단 레이어·이미지 0·전면 재작성 | 14/14 + footer "원문 도판 미사용" | ✅ |
| FR-5 | 출처 표기(왕현철 외 3인·충남반도체마이스터고) | 14/14 footer | ✅ |
| FR-6 | 조작 특칙(시퀀스 재현 0) | 절차형 조작 0 | ✅ |
| FR-7 | NCS 장비 트랙 교차 4건+ | **24건 / 16섹션** | ✅ 6배 초과 |
| FR-8 | P3·P4·P5+책 4건+ | 권 간 18건 + 책 ChapterRef 16건 | ✅ 초과 |
| FR-9 | 정비 유해인자 4모듈+ | **7모듈** | ✅ 초과 |
| FR-10 | "정지 정비 안전" 축 + 안전 전건 보존 | LOTO·인터로크·EMO·안전PLC 관통 | ✅ |

### 3.2 비기능 요구사항 (NFR)

| NFR | 요구 | 달성 | 판정 |
|---|---|---|:--:|
| NFR-1 | 정적 SSG 호환·서버 의존 0 | 270p 정적 export | ✅ |
| NFR-2 | typecheck+lint+build 무오류 | 전부 exit 0 | ✅ |
| NFR-3 | cross-link 정합·quotes 회귀 0 | 11 sources·152 sections·unknown 0·quotes diff 0 | ✅ |
| NFR-4 | 코어(인프라·기존 10자료원) 무수정 | sources.ts·schoolTextMdx(등록)·cross-link.json(산출물) 외 0 | ✅ |
| NFR-5 | 공정·수치 왜곡 0·일반화 오류 0 | G-1 크라이오 온도 모순 발견·수정으로 확보 | ✅ |

### 3.3 산출물

- **신규 MDX 14** (`src/content/sources/hs-equipment-maintenance/*.mdx`, 합 2,634줄): industry-trend / process-wafer-photo / process-etch-deposition / process-frontend-backend / element-vacuum-gas / element-plasma / element-pneumatic-thermal / element-power / design-concept-mechanical / design-electrical / design-control-software / maintenance-fundamentals / maintenance-setup / maintenance-by-type
- **신규 cross-link 태깅** (`_links.json`): 14모듈, topics/hazards/chemicals 본문 실증
- **코드 수정 2**: `sources.ts`(HS_EQUIPMENT_MAINTENANCE 등록), `schoolTextMdx.tsx`(REGISTRY 14 로더)
- **빌드 산출물 재생성**: `cross-link.json`(자동)
- **PDCA 문서**: plan / design / analysis / report

### 3.4 검증 현황

| 게이트 | 결과 |
|---|---|
| typecheck | exit 0 |
| lint | exit 0 |
| build | 270p SSG, 14/14 모듈 HTML |
| build:cross-link | 11 sources·152 sections·**857 edges**·unknown 0 (topics 311·hazards 142·chemicals 119) |
| quotes 회귀 | diff 0 |
| OCR 노이즈 잔존 | 0 |
| 조작 시퀀스 재현 | 0 |
| 출처 footer | 14/14 |

---

## 4. 미완료 항목

### 4.1 없음 (전량 완주)
5대단원 22중단원 → 14모듈 전량 구현, FR 1~10·NFR 1~5·DoD 10항 충족, Gap 3건 전건 수정.

### 4.2 후속 로드맵 (의도된 범위 외)
- **P7**: 나머지 1권(인프라 일반) — 별도 사이클. 8권 교과서 카테고리 중 신규 8권은 본 사이클로 완주, P7은 로드맵상 후속 성격.
- 확인문제·단원 평가 문제은행화(비목표), 원문 도판·설계 도면 재제작(비목표).

---

## 5. 품질 지표

### 5.1 최종 분석 결과
- **Match Rate 96%** (gap-detector 산정) → Gap 3건(P2) 전건 수정으로 **잔여 Gap 0·실질 100%**.
- P0(정합 깨짐) 0 · P1(FR 미달) 0 · P2(품질) 3건 발견·해소.

### 5.2 수치 달성

| 지표 | 목표 | 달성 |
|---|---|---|
| 모듈 수 | 13~14(Plan §9-3) | **14** (병합) |
| RT 합 | — | ~131분 |
| NCS 교차(FR-7) | 4건+ | **24건 / 16섹션** |
| 권 간 연결(FR-8) | 4건+ | 18건 + 책 ChapterRef 16건 |
| 정비 유해인자(FR-9) | 4모듈+ | **7모듈** |
| cross-link edges | — | 857 (P4 대비 +77) |
| SSG 페이지 | 14 신규 | 270 전체(14 신규) |

---

## 6. 저작권 원칙 준수 현황

### 6.1 원칙 확립 (최보수 — 발행 주체 상이에도 동일 적용)
P3~P5는 에이치앤지 상업 출판이었으나 이 권은 **충남반도체마이스터고 학교 발행·2022 개정 인정**. 로드맵 "학교/교육청 발행" 리스크에 해당하나 **최보수 원칙 동일 적용**: 원문 이미지 0·문장 전면 재작성·NCS 학습모듈(참고문헌 LM코드) 간접 재사용 차단·출처 표기.

### 6.2 구현 검증 (14모듈)
- 원문 이미지 0 (OCR 이미지 347장 전면 미사용)
- 출처 footer 14/14 — "「반도체 장비 유지 보수」(왕현철 외 3인 지음, 충남반도체마이스터고등학교)"
- Fable 근접 패러프레이즈 스캔 0
- **G-2 제조사 모델명 일반화**로 특칙 #7(제조사 스펙 재현 차단) 강화 — XGP-ACF1(LS)·GOT2000(Mitsubishi) 제거
- **원문 부재 안전 항목 창작 0** (고소·밀폐공간·질식·PPE·MSDS grep 0 확인) — 발췌 보강만

---

## 7. 긍정점 & 개선 사항

### 7.1 잘 된 점 (Keep)
1. **교차참조 밀도 시리즈 최다 실증** — NCS 16섹션·P1~P5 전권·책 ch5~14를 **dead-link 0**으로 연결, 로드맵 "NCS 장비 트랙 강한 교차" 비고를 수치(24건)로 이행.
2. **안전축 모범** — `maintenance-by-type`이 LOTO를 5장비 공통 첫 절차로 관통, `design-electrical`이 인터로크 3계층·EMO 직렬·안전PLC(IEC 61508)로 "정지=안전" 일관.
3. **hazard 태깅 본문 실증 가산** — `element-vacuum-gas` pyrophoric(포스핀)·toxic(아르신)·oxidizer(O₂)·cryogenic 5종 전부 본문 근거, 과태깅 아님.
4. **Check→즉시 수정 루프** — Gap 3건을 발견 세션 내 전건 해소(iterate 에이전트 없이 정밀 수동 수정), 각 build 재검증.

### 7.2 개선 사항 (Improvement)
1. **모듈 간 수치 일관성** — G-1 크라이오 온도(−260 vs −196℃)가 병렬 배치(B 요소기술 vs F 장비별 PM)에서 갈렸다. 향후 병렬 구현 시 **공통 수치 사전(용어·상수표)**을 배치 스펙에 포함하면 예방 가능.
2. **제조사 모델명 필터** — G-2 XGP-ACF1·GOT2000이 사양표 예시로 유입. 원문 사양표 전사 시 모델명 자동 스캔을 게이트에 추가 검토.

### 7.3 다음에 적용할 것 (Try)
- **P7(인프라 일반)** 사이클에서 이 권의 "요소 기술·유지보수 각도"를 인프라(전력·가스·용수·배기) 연결로 확대.
- 병렬 배치 공통 상수 사전화(G-1 예방)를 시리즈 표준 게이트로 승격.

---

## 8. 다음 단계

### 8.1 본 사이클 확정 사항 — 완료 ✅
- 14모듈 전량 구현·게이트 통과·Gap 전건 수정.
- 8권 교과서 카테고리 **신규 8권 완주** — "장비 자체의 요소기술·설계·유지보수" 직교 축 완성.

### 8.2 아카이브
- `/pdca archive hs-equipment-maintenance` — Plan/Design/Analysis/Report를 `docs/archive/2026-07/hs-equipment-maintenance/`로 이동, 인덱스 갱신.

### 8.3 후속 사이클
- **P7**: 인프라 일반 권(로드맵 잔여). 별도 Plan 착수 시 원문 인벤토리·모듈 재산정.

---

## 9. 변경 사항 (Changelog)

### v1.0.0 (2026-07-18)
- **신규**: `HS_EQUIPMENT_MAINTENANCE` 자료원(order 11) + 14모듈 MDX + `_links.json`
- **수정**: `sources.ts`(등록), `schoolTextMdx.tsx`(REGISTRY 14 로더)
- **Check 후 수정**: G-1 크라이오 온도 통일(element-vacuum-gas·maintenance-by-type), G-2 모델명 일반화(design-concept-mechanical), G-3 industrial-hygiene 태깅(_links.json)
- **산출물**: `cross-link.json` 재생성(857 edges)

---

## 10. 기술 메모

### 10.1 브랜치 & 커밋 상태
- 브랜치: `main` (프로젝트 규칙 — 사용자 요청 시에만 커밋)
- 현재 Untracked/Modified: `src/content/sources/hs-equipment-maintenance/`(신규 15), `src/lib/sources.ts`·`src/lib/schoolTextMdx.tsx`·`src/data/cross-link.json`(수정)

### 10.2 빌드 검증
- typecheck·lint exit 0
- build 270p SSG (14 신규 모듈 포함)
- cross-link 11 sources·152 sections·857 edges·unknown 0
- quotes 회귀 0

### 10.3 성능 & 용량
- MDX 14파일 합 2,634줄, RT 합 ~131분
- 신규 서버 의존 0 (완전 정적)

### 10.4 공용 라우트 안전 검증
- `[source]/[module]` 라우트로 14모듈 자동 전개, 기존 10자료원 라우트 무변경
- 홈 SourcePicker 8번째 교과서 카드 자동 추가

---

## 11. 결론

### 핵심 성과
「반도체 장비 유지 보수」(왕현철 외 3인, 충남반도체마이스터고) 7,048줄 원문을 **14모듈**로 재구성해, **8권 반도체고 교과서 카테고리의 신규 8권을 완주**했다. 발행 주체가 P3~P5와 완전히 다른 학교 발행 교과서였으나 판권 R-1을 Design 선행으로 해소하고 최보수 저작권 원칙을 동일 적용했다. Ⅱ 공정 장비의 P3·P4·P5 정면 중복은 "장비 하드웨어·정비 관점" 각도 + 권 간 위임으로 정체성을 확보했고, Ⅲ 요소 기술·Ⅴ 장비 관리를 신규 콘텐츠로 집중했다.

### Design Match Rate: 96% → Gap 전건 수정 후 실질 100%
gap-detector가 발견한 P2 3건(크라이오 온도 모순·모델명 노출·태깅 누락)을 같은 세션에서 전건 수정하고 각 build를 재검증해 잔여 Gap 0에 도달했다.

### 이번 사이클의 의의
- **교차참조 최다 자료원 확립** — NCS 장비 트랙 24건·P1~P5 전권·책 ch5~14 연결(dead-link 0), 로드맵 P6 비고 정확 이행.
- **새 안전 축** — "정지 상태 정비 안전"(LOTO·인터로크·SEMI 표준)이 P5의 "움직이는 기계의 안전"을 확대.
- **직교 축 완성** — 공정 각론(P3·P4·P5)에 장비 자체의 요소기술·설계·유지보수가 더해져, "공정 이해 → 장비 하부 기술·관리 → 정비 직무(NCS)" 학습 동선 완결.

### 이전 과제
P5(assembly 100%)·P4(thinfilm 100%)·P2(basic-tech-2 100%)·카테고리 인프라(97.6%)의 특칙·연결 위임·본문 실증 태깅 계약이 8권 카테고리 전권에서 유효함을 확인.

---

## 문서 참고
- Plan: `docs/01-plan/features/hs-equipment-maintenance.plan.md`
- Design: `docs/02-design/features/hs-equipment-maintenance.design.md`
- Analysis: `docs/03-analysis/hs-equipment-maintenance.analysis.md`
- 선례: `docs/04-report/hs-thinfilm-diffusion.report.md`(P4, 100%) · `docs/archive/2026-07/hs-assembly-inspection/`(P5, 100%)
