# Plan — 고교 안전 교과 단원 신설 + 기존 모듈 안전 연계 (safedata 주입)

> **Feature**: `safedata-injection`
> **작성일**: 2026-07-18 · **Level**: Dynamic · **Cycle 유형**: 카테고리 신규 권(안전 트랙) + 크로스링크 허브화(기존 모듈 안전 연계)
> **상속**: `hs-textbook-collection`(카테고리 인프라·권당 표준 패턴) · `daegu-hs-textbook`·`hs-photo-etch`·`hs-thinfilm-diffusion`(고교 3단 재작성·저작권·병렬 Do) · `cross-link-system`(통제 어휘) · `PRODUCT-DIRECTION.md`(정체성 C — 다리, OSHA 태깅 보강)
> **작업 브랜치**: `DrunkenZealnut/safedata-injection`
> **사용자 요청**: "highschool text safedata(osha, 반도체 유해인자) injection" → **"유해물질 사전이 아니라 고교 교과서 내용과 연계하여 보강"** (2026-07-18 명시)
> **확정 방향(§9)**: AskUserQuestion → **C안 "둘 다"** — 안전 단원 자료원 신설(A) + 기존 기술 모듈 안전 연계(B)

---

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem (문제)** | 고교 교과서 자료원이 **8권** 있으나 전부 공정·장비·소자 등 **기술 콘텐츠**이고, 정작 사이트 정체성인 **"안전·유해인자"를 정면으로 다루는 고교 교과 모듈이 0개**다. 안전 정보는 OSHA·「반도체 유해인자」에 있으나 **고교 교과 과정과 연계된 형태로 제공되지 않는다**. 마침 미등록 교과서 **「반도체 인프라 일반」(서울시교육청)** 의 4대단원 중 **"산업안전과 건강관리"**(원문 ~2,200줄)가 **공정별 유해요인→건강영향→작업환경관리** 구조로, 기존 기술 모듈·책·OSHA와 정확히 맞물리는 미개발 자산으로 남아 있다. |
| **Solution (해법)** | **(A) 안전 단원 자료원 신설**: 「반도체 인프라 일반」을 `hs-textbook` 카테고리에 신규 권(`hs-semicon-infra`)으로 등록하되, 이번 사이클은 **"산업안전과 건강관리" 트랙(Ⅳ)만** daegu 방식으로 완주 — 텍스트북 골격을 **OSHA(GHS·PPE·가스 안전) + 「반도체 유해인자」(직업병·노출)로 보강**해 3단 레이어 재작성. **(B) 기존 모듈 연계**: 각 공정 안전 모듈을 **허브**로 삼아 기존 기술 모듈(포토·에칭/박막·확산/장비 등)·책 챕터·OSHA·공정 페이지·화학물질과 `_links.json`으로 상호 cross-link. |
| **Function·UX Effect (기능·UX 효과)** | 홈 "반도체 고등학교 교과서" 그룹에 **9번째 교과서(안전)** 카드가 추가되고, `/sources/hs-semicon-infra/`에서 **[제조 환경·안전보건관리] + [공정별(확산·포토·식각·증착·이온주입·연마·세정) 안전]** 모듈을 탐색. 각 안전 모듈에서 같은 공정의 **기술 모듈·책·OSHA·공정 페이지·유해물질로 바로 이동**(양방향). |
| **Core Value (핵심 가치)** | "공정이 어떻게 동작하나(기술)"만 있던 고교 학습 축에 **"그 공정이 왜 위험하고 어떻게 안전한가(안전·건강)"** 축을 추가 — 반도체고 실제 안전보건 교과와 1:1. 나아가 안전 모듈이 **자료원을 잇는 다리의 중심 허브**가 되어 제품 북극성(크로스링크 그래프)을 직접 강화한다. |

---

## 1. 배경 / 현재 상태

### 1.1 원문 인벤토리 — 「반도체 인프라 일반」 (실측, 원문 수정 금지)

- **위치**: `data/school-text/20260415_143535_반도체인프라일반_서울시교육청_/` (메인 체크아웃 `/Users/zealnutkim/DEV/SemiconductorAcademy/`에 실존 · 워크트리엔 미추적 — `.gitignore`, cf. [[semiconductor-academy-data-layout]]).
- **발행/저작**: 서울시교육청 (교육청 인정 교과서). 원문 이미지 저작권상 **전면 미사용**(daegu 원칙 승계).
- **분량**: 마크다운 6,042줄, 4대단원(인프라 개요 / 전기설비 / 공조 / **산업안전과 건강관리**). OCR 오인식 존재 → **착수 시 목차 재검증 필수**.
- **이번 사이클 대상 = Ⅳ 산업안전과 건강관리 (원문 약 3842~6042줄, ~2,200줄)** — 확인된 내부 구조:

| 중단원 | 소단원 구조 (원문 확인) |
|--------|------------------------|
| **반도체 제조 환경** | 클린룸·클래스(FED/ISO)·방진복 착용 + 안전보건 관리체계(산업안전보건법·안전/보건관리자·위험성평가·작업환경측정) |
| **공정별 작업 안전 관리 — 웨이퍼 가공라인** | **확산·포토·식각·증착·이온주입·연마(CMP)·세정** 7개 공정 각각 → ① **유해 요인 노출 특성**(사용 물질·부산물·PM 작업) ② **건강 영향**(점막·피부 자극·화상·급성/만성 중독·천식·중추신경계·생식기계·후두암 등) ③ **작업 환경 관리**(호흡용 보호구·국소 배기·유해 위험 Tip) |

- 원문이 이미 **아르신 용혈성 빈혈, 포스핀 폐부종, TMAH 화상·전조증상 부재, HMDS/PR 노출** 등 구체 서술 → OSHA·책과 교차 검증·보강 최적.

### 1.2 기존 자료원 안전 커버리지 (실측 — "안전 모듈 0개" 근거)

- 고교 교과서 8권(`daegu-hs-process`, `hs-semicon-basics`, `hs-basic-tech-1/2`, `hs-photo-etch`, `hs-thinfilm-diffusion`, `hs-assembly-inspection`, `hs-equipment-maintenance`) — **전 권 기술 콘텐츠**, 전용 산업안전 모듈 없음.
- 기존 기술 모듈의 `_links.json`엔 안전 태그가 **부수적으로만** 존재(예: hs-photo-etch — `gas-safety`×3, `liquid-chemicals`×5, `ppe`×1). → 안전을 **정면 주제로 다루는 허브 부재**.
- 자료원 간 안전 다리(OSHA)도 불균형: `osha-scs/_links.json`에서 **part-1a·part-1b·part-4의 `chemicals` 태그 0건**(PRODUCT-DIRECTION 실측 약점). 안전 모듈의 물질·유해인자 태깅이 이 다리를 보강할 잠재력.

### 1.3 신규 권 등록 인프라 (hs-textbook-collection에서 완비 — 재사용)

| 요소 | 현황 | 이번 작업 |
|------|------|-----------|
| 카테고리 | `SourceCategory = 'hs-textbook'` (라벨 "반도체 고등학교 교과서") | `hs-semicon-infra` 추가 |
| 라우트 | 공용 `src/app/sources/[source]/[module]` | **신규 라우트 불필요** |
| 로더 | 통합 `src/lib/schoolTextMdx.tsx` REGISTRY | source+모듈 항목 등록 (⚠️ sections↔로더 짝 필수 — 누락 시 "본문 준비 중" 자리표시 배포/빌드 실패) |
| 크로스링크 | `build-cross-link`가 `_links.json` glob 자동 발견 | **스크립트 무수정** |

### 1.4 "보강(safedata)" 소스 매핑

| 안전 모듈 | OSHA 보강 | 「반도체 유해인자」 책 보강 |
|-----------|-----------|---------------------------|
| 제조 환경·관리 | part-1a(GHS)·part-1b(PPE·응급) | ch04 클린룸·ch17 산업보건 |
| 확산 | part-3(arsine·phosphine·diborane) | ch07 확산·ch16 직업병 |
| 포토 | part-2(HMDS·현상) | ch08 포토·ch14 화학물질 |
| 식각 | part-2·part-3(불소·염소) | ch09 식각 |
| 증착 | part-3·part-4(silane·WF₆) | ch10 증착 |
| 이온주입 | part-3(arsine·BF₃) | ch11 이온주입 |
| 연마(CMP) | part-2(슬러리) | ch12 CMP |
| 세정 | part-2(HF·황산·과산화수소) | ch06 세정 |

---

## 2. 목표 / 비목표

### 목표
- **안전 자료원 신설(A)**: `hs-semicon-infra` 등록 + "산업안전과 건강관리" 트랙 전 모듈 완주(daegu 방식, 3단 레이어, OSHA+책 보강, 출처 표기).
- **기존 모듈 연계(B)**: 각 공정 안전 모듈을 허브로, 기존 기술 모듈·책·OSHA·공정 페이지·화학물질과 양방향 cross-link(§1.4·§3.3).
- **다리 균형화(부수)**: 안전 모듈 `_links.json`의 물질·유해인자 태깅으로 OSHA part-1a/1b/4 편중 완화(edges 증가·unknownChemicals 0).
- **홈 UX**: "반도체 고등학교 교과서" 그룹에 안전 교과서 카드 노출.
- **로드맵**: 「반도체 인프라 일반」 나머지 3단원(개요·전기설비·공조) 후속 사이클 명시.

### 비목표 (이번 사이클 제외)
- **유해물질 사전(`chemicals.json`) 주입** — 사용자 명시 제외(초안 방향 폐기).
- **인프라 일반 나머지 3단원**(개요·전기설비·공조) — 안전 트랙 우선(§9), 후속 로드맵.
- **OSHA/책 원문 MDX 재작성** — 안전 모듈 신규 작성 + `_links.json` 태깅만.
- 신규 라우트·로더 파일·카테고리 신설 — 기존 인프라 재사용.

---

## 3. 정보구조(IA) 설계

### 3.1 자료원 등록 (A)
- `src/lib/sources.ts` `SOURCES`에 `hs-semicon-infra` 추가: `kind: 'textbook'`, `accent: 'school'`, `category: 'hs-textbook'`, `license: 'fair-use'`, attribution(서울시교육청). **등록 순서 = 교과서 목차 순서 = 이전/다음 내비**.
- 대단원 "산업안전과 건강관리" = `SourceSection.group`(트랙), 중단원 = 모듈. **완성 모듈만 sections 등록**.
- **의도적 목차 역순 파일럿**: 4대단원 중 **Ⅳ(안전)를 먼저** 완주 — 사용자 요청(안전 연계)이 이 단원에 집중되고 사이트 정체성과 직결하기 때문. 다른 3단원은 후속.

### 3.2 모듈 구성 (잠정 — Design에서 목차 재검증 후 확정)
| # | 모듈(slug 후보) | 내용 |
|---|-----------------|------|
| 1 | `safety-environment` | 제조 환경·클린룸·방진복 + 안전보건 관리체계(산안법·관리자·위험성평가) |
| 2 | `safety-diffusion` | 확산 공정 안전 (아르신·포스핀 급성중독·용혈성 빈혈) |
| 3 | `safety-photo` | 포토 공정 안전 (HMDS·PR·현상 TMAH) |
| 4 | `safety-etch` | 식각 공정 안전 (불소·염소·부식) |
| 5 | `safety-deposition` | 증착 공정 안전 (silane 자연발화·WF₆) |
| 6 | `safety-ion-implant` | 이온주입 공정 안전 (arsine·BF₃·비소) |
| 7 | `safety-cmp` | 연마(CMP) 공정 안전 (슬러리·미스트) |
| 8 | `safety-cleaning` | 세정 공정 안전 (HF·황산·과산화수소) |

> 분량 편차에 따라 얇은 공정 모듈은 병합 가능(예: 이온주입+CMP 또는 식각+증착) — Design 확정. 예상 **6~8 모듈**.

### 3.3 크로스링크 허브 설계 (B) — 안전 모듈 `_links.json` 태깅
각 공정 안전 모듈은 topics(`ppe`·`emergency-response`·`gas-safety`·`engineering-controls`·`occupational-disease` 등) + hazards + chemicals를 태깅 → 통제 어휘 공유로 자동 상호 연결:

| 안전 모듈 | 자동 연결되는 기존 노드 |
|-----------|------------------------|
| diffusion | hs-thinfilm-diffusion/diffusion-*, 책 ch07, osha part-3, process/diffusion, `arsine`·`phosphine`·`diborane`·`phosphorus-oxychloride` |
| photo | hs-photo-etch/photo-*, 책 ch08, process/photolithography, `hmds`·`tmah`·`pgmea` |
| etch | hs-photo-etch/etch-*, 책 ch09, process/etching, `fluorine`·`chlorine` |
| deposition | hs-thinfilm-diffusion/thinfilm-*, 책 ch10, `silane`·`dichlorosilane`·`tungsten-hexafluoride` |
| ion-implant | 책 ch11, `arsine`·`boron-trifluoride`·`arsenic` |
| cmp | 책 ch12, `silica-slurry`·`ceria-slurry` |
| cleaning | 책 ch06, process/cleaning, `hydrofluoric-acid`·`sulfuric-acid`·`hydrogen-peroxide`·`ammonia`·`ozone`·`isopropyl-alcohol` |
| environment | 책 ch04, osha part-1a/1b, `cleanroom`·`ppe`·`engineering-controls` |

---

## 4. 콘텐츠 재구성·보강 전략

### 4.1 골격 + 보강 (핵심)
- **골격**: 인프라 일반 안전 단원의 구조(공정별 유해요인→건강영향→작업환경관리)를 뼈대로.
- **보강(safedata)**: 각 공정에서 OSHA(GHS 신호어·PPE 규격·가스 캐비닛·국소배기·응급)와 책(직업병 기전·노출 기준·역학)을 교차 인용해 **깊이 추가**. 원문 직역 아님 — 수치·정의만 보존, 고교 눈높이 재작성.
- **3단 레이어**: Hook(한 줄 위험) → Easy(비유·증상 쉽게) → Deep(원문/규제 표현·수치, 접기).

### 4.2 안전 정보 정확성 (최우선 검증)
- 노출 증상·중독 기전·GHS 분류·PPE는 **OSHA·책·공신력 자료와 대조**(생명·안전 정보). Do에서 모듈별 근거 기록, Fable 교차 검증(cf. [[parallel-agent-quota-strategy]]).
- 교육용 한계 고지(실제 취급 시 정식 MSDS/안전관리자 지침 우선) 각 모듈 노출.

### 4.3 저작권
- 원문 문장·이미지 직접 사용 0, 수치·표준 분류만 보존, 출처(서울시교육청·OSHA Part·책 페이지) 표기. `license: 'fair-use'`.

---

## 5. 구현 범위(파일) · 단계

### 5.1 파일 목록
| 파일 | 작업 |
|------|------|
| `src/lib/sources.ts` | `hs-semicon-infra` SOURCES 항목(안전 트랙 sections) 추가 |
| `src/lib/schoolTextMdx.tsx` | `hs-semicon-infra` REGISTRY + 모듈 로더 등록 (sections와 짝 필수) |
| `src/content/sources/hs-semicon-infra/{module}.mdx` | 안전 모듈 6~8개 신규 (3단 레이어·보강) |
| `src/content/sources/hs-semicon-infra/_links.json` | 통제 어휘 태깅(허브 연계 B) |
| (재생성) `src/data/cross-link.json` | `npm run build:cross-link` 재빌드 (수동 편집 금지) |
| (선택) `osha-scs/_links.json` | part-1a/1b/4 물질 태그 보강(다리 균형화, 부수 목표) |

### 5.2 단계 (파일럿 우선)
1. **골격·등록**: SOURCES + 로더 + 파일럿 1모듈(`safety-diffusion` — 유해요인 밀도 최상) 작성 → 렌더·게이트 확인.
2. **안전 모듈 전량**: 나머지 모듈 병렬 작성(공정별 독립 → Sonnet 배치, 모듈별 원문 범위+OSHA/책 근거 스펙을 파일로 전달, Fable 검증).
3. **허브 연계(B)**: `_links.json` 태깅 → `build:cross-link` 재빌드, edges 증가·unknownChemicals 0 검증. 기존 모듈에서 안전 모듈로의 역방향 노출 확인.
4. **게이트**: `typecheck` 0 · `lint` 신규 0 · build SSG 통과 · cross-link 검증 · quotes 회귀 0 · 모듈 렌더 육안 확인.

---

## 6. 기능 요구사항 (FR)

| ID | 요구사항 |
|----|----------|
| FR-1 | `hs-semicon-infra`가 `hs-textbook` 카테고리 신규 권으로 등록되고 홈 교과서 그룹에 노출된다. |
| FR-2 | "산업안전과 건강관리" 트랙의 안전 모듈(6~8) 전량이 3단 레이어로 작성·렌더된다(로더↔sections 짝, 자리표시 0). |
| FR-3 | 각 공정 안전 모듈이 **유해요인·건강영향·작업환경관리**를 포함하고 OSHA+책으로 보강된다. |
| FR-4 | 안전 정보(노출 증상·GHS·PPE·중독 기전)가 근거와 대조돼 정확하다(모듈별 근거 기록). |
| FR-5 | 각 안전 모듈이 같은 공정의 **기존 기술 모듈·책 챕터·OSHA·공정 페이지·화학물질과 양방향 cross-link**된다(§3.3). |
| FR-6 | `build:cross-link`가 unknownChemicals 0으로 통과하고 edges가 증가한다. |
| FR-7 | 출처(서울시교육청·OSHA Part·책 페이지)와 교육용 한계 고지가 표기된다. |

## 7. 비기능 요구사항 (NFR)

| ID | 요구사항 |
|----|----------|
| NFR-1 | 톤은 고교생 눈높이(3단 레이어 정신), 기존 교과서 자료원과 일관. |
| NFR-2 | 저작권: 원문 문장·이미지 0, 수치·표준만 보존. |
| NFR-3 | 접근성(WCAG): 위험 정보는 색상 외 텍스트 병기, GHS 아이콘 alt. |
| NFR-4 | 게이트: typecheck 0 · lint 신규 0 · build SSG · quotes 회귀 0. |

## 8. 리스크

| ID | 리스크 | 완화 |
|----|--------|------|
| R-1 | **안전 정보 오류**(생명 직결) | OSHA·책·공신력 자료 대조 필수, Fable 교차 검증, 교육용 한계 고지 |
| R-2 | **저작권**(교과서·원문 근접) | 자체 재작성, 수치·분류만, 출처 표기, 이미지 0 |
| R-3 | **주제 중복**(기존 공정·기술 모듈과 겹침) | 각도 차별화 — 기술 모듈=원리, 안전 모듈=위험·건강·보호. cross-link로 상호 보완(경쟁 아님) |
| R-4 | 로더↔sections 불일치로 자리표시 배포/빌드 실패 | schoolTextMdx 주석 경고 준수, 완성 모듈만 등록, 렌더 육안 확인 |
| R-5 | OCR 목차 손상 | Design에서 원문 목차 재검증(대단원 경계·소단원 표제) |
| R-6 | 범위 과다(8모듈+보강+연계) | 파일럿 1모듈 후 병렬, 얇은 공정 병합 옵션(§3.2) |

## 9. 결정 사항

### 확정 (2026-07-18, 사용자)
- **C안 "둘 다"**: 안전 단원 자료원 신설(A) **+** 기존 기술 모듈 안전 연계(B). (유해물질 사전 주입 방향은 폐기.)

### Design 착수 전 확정 필요
| ID | 항목 | 잠정 |
|----|------|------|
| D-1 | source id | `hs-semicon-infra` (대안 `hs-infra`) |
| D-2 | 모듈 개수·병합 | 6~8, 얇은 공정 병합 여부(§3.2) — 목차 재검증 후 |
| D-3 | 안전 트랙 우선(역순 파일럿) 확정 | ✅ 잠정 채택(§3.1) |
| D-4 | OSHA part-1a/1b/4 태그 보강 포함 여부 | 부수 목표(선택) |

## 10. 완료 정의 (DoD)

- [ ] `hs-semicon-infra` 등록, 홈 교과서 그룹 노출(FR-1).
- [ ] 안전 모듈 6~8 전량 작성·렌더, 자리표시 0(FR-2·FR-3).
- [ ] 안전 정보 근거 대조 기록(FR-4).
- [ ] 안전↔기술 모듈·책·OSHA·공정·물질 양방향 cross-link(FR-5).
- [ ] cross-link 재빌드 unknownChemicals 0·edges 증가(FR-6).
- [ ] 출처·교육용 고지 표기(FR-7).
- [ ] 게이트 전부 통과.

## 11. 다음 단계

1. `/pdca design safedata-injection` — 원문 안전 단원 목차 재검증, 모듈 확정(D-1·D-2), `_links.json` 태깅 목록, 병렬 배치 설계.
2. `/pdca do safedata-injection` — 파일럿 `safety-diffusion` → 병렬 전 모듈 → 허브 연계 → 게이트.
3. **후속 로드맵**: 「반도체 인프라 일반」 나머지 3단원(개요·전기설비·공조) 권 완성 사이클, OSHA part-1a/1b/4 본문·태그 보강(별도).
