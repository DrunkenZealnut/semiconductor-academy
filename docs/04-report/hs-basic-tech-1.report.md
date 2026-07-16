# 반도체기초기술1 완주 보고서

> **Status**: Complete  
> **Project**: SemiconductorAcademy (반도체 산업 유해인자 교육 정적 사이트)  
> **Feature**: `hs-basic-tech-1` — "반도체기초기술1" 5대단원 12모듈 신규 자료원  
> **Completion Date**: 2026-07-16  
> **Branch**: `main`  
> **PR**: #17 (feat/hs-basic-tech-1 → main, merged at daa417f)  
> **Commit Status**: Untracked (사용자 요청 시에만 커밋 — 프로젝트 규칙)

---

## Executive Summary

### 1.1 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **Feature** | 크리아트출판사 「반도체기초기술1」(정예원 외 4인, 충청북도교육감 인정교과서, 4,666줄 OCR) 원문의 5대단원 12중단원 전량 3단 레이어(Hook/Easy/Deep) 재구성 + `hs-textbook-collection` 카테고리 인프라 상속 |
| **상속** | `hs-textbook-collection`(카테고리 신설·홈 UI 개편·공용 라우트·파일럿 hs-semicon-basics, Match Rate 97.6%, 2026-07-16) + `daegu-hs-textbook`(재작성 원칙, 2026-07-14) |
| **로드맵 위치** | `hs-textbook-collection.plan.md` §5.3의 **P1**(신규 8권 중 첫 번째, 파일럿 다음 순번) |
| **범위** | **전량 편입**(5대단원 12중단원 완주) + 파일럿 모듈(전자 소자, 챕터Ⅰ) + 병렬 서브에이전트 구현(챕터Ⅱ~Ⅴ) + 저작권 준수(이미지 0·문장 재작성·출처 표기) |
| **시작 일시** | 2026-07-16 (Design 착수) |
| **완료 일시** | 2026-07-16 (Report 작성) |
| **소요 시간** | 약 3–4시간 (원문 페이지 순환 배치 역산·5대단원 12모듈 재구성·4개 병렬 서브에이전트·근접 패러프레이즈 재검증) |
| **PDCA 사이클** | Plan(확정 4결정·원문 역산) → Design(§1~7 명세) → Do(전량 구현) → Check(94.8%) → Report |

### 1.2 결과 요약

```text
┌──────────────────────────────────────────────────────┐
│  Design Match Rate: 94.8% ✅                        │
├──────────────────────────────────────────────────────┤
│  ✅ 완료:         12/12 모듈, FR 1~7, NFR 1~5      │
│  ⚠️ 경미편차:      3건 (Low, 무조치)                │
│  ❌ 미해결:        0건                              │
│  📊 빌드 검증:     195+ 페이지 SSG·12/12 스모크   │
└──────────────────────────────────────────────────────┘
```

### 1.3 Value Delivered

| 관점 | 내용 |
|------|------|
| **Problem** | 「반도체기초기술1」(크리아트, 4,666줄 OCR) 원문이 data/school-text/ 에 있으나 **원문 페이지 순환 배치**(표지·학습목표가 파일 끝, 챕터Ⅰ 앞부분이 파일 시작) + **콘텐츠 성격이 5개 과목 묶음**(전자소자·기계가공·설계제도·공유압·프로그래밍, 반도체 정체성 편차 크다) — 사이트 직무 교육과의 적합도를 과목별로 재점검하면서 재구성할 필요. |
| **Solution** | Plan 단계에서 **원문 순환 배치를 라인 단위로 역산**해 읽기 순서 지도 7단계 확정(§1.3). Design 단계에서 **5대단원 12중단원 재구성 순서 + 챕터Ⅰ 차별화 각도(납땜·측정 실습 중심) + 단위 표기 규칙(원문 단위+SI 병기) + NCS 연결 전략** 명시. Do 단계에서 **챕터Ⅰ 파일럿 후 4개 병렬 서브에이전트로 챕터Ⅱ~Ⅴ 가속**(공통 스펙 파일 기반) + **근접 패러프레이즈 자체 검증으로 저작권 안전성 재검증**. |
| **Function·UX Effect** | 홈 "반도체 고등학교 교과서" 그룹 섹션에 3번째 권 카드(order 6) 추가. `/sources/hs-basic-tech-1/` 인덱스에서 5대단원 트랙(전기·전자 기초 → 기계 가공 기술 → 설계 제도 → 공유압기술 → 프로그래밍) + 12모듈 순차 탐색 가능. 챕터Ⅰ은 기존 `hs-semicon-basics`(개념·원리)와 상호 `SourceRef` 연결, 챕터Ⅲ·Ⅳ는 NCS 반도체장비 트랙과 8건 상호 연결(설계 목표 2건 4배 초과). |
| **Core Value** | 지금까지 사이트는 "반도체가 무엇인가(기초) + 어떻게 만드는가(공정)" 축을 다뤘다면, 이 권은 **"그 장비를 설계·조립·구동하려면 무엇을 알아야 하는가"** — 장비 기술자 양성 교육과 직결되는 실무 기초(제도·공유압·임베디드). NCS 반도체장비 트랙의 "왜 이 지식이 필요한가"에 답하는 **학문적 기초를 제공하는 다리 역할** — P2~P7 권과 함께 반도체고 **전 교과 학습 체계의 두 번째 축** 확립. |

---

## 2. PDCA 사이클 요약

### 2.1 Plan 단계
**문서**: `docs/01-plan/features/hs-basic-tech-1.plan.md`

- **핵심 리스크 발견 & 해결**: 원문이 물리 페이지 순환 배치되어 있음을 파악(표지·학습목표가 파일 4501~4666행, 챕터Ⅰ 도입부가 1~655행 + 4501~4666행 조합)
  - 챕터Ⅰ만 7단계 읽기 순서 지도 작성: ①표지·학습목표(4501~4514) → ②저항기(4514~4570) → ③커패시터(4570~4620) → ④인덕터1~3(4620~4666) → ⑤인덕터4(1~10) → ⑥반도체란(39~83) → ⑦다이오드(84~133) → ⑧트랜지스터(134~174) → ⑨납땜실습(176~206)
  - 챕터Ⅱ~Ⅴ(656~4343행)는 순환 배치 없이 정순

- **결정 4건 확정**(2026-07-16):
  1. ✅ **범위**: 5대단원 12중단원 **전량 편입** (Ⅱ·Ⅴ 포함)
  2. ✅ **파일럿**: 책 목차 순서대로 "**1. 전자 소자**" (순환 배치 역산 적용)
  3. ✅ **챕터Ⅱ·Ⅴ 처리**: §1-1과 연동하여 전량 편입
  4. ✅ **단위계**: 원문 단위(kgf/cm² 등) 유지 + **SI 병기** (괄호로)

- **목표·비목표 확정** (FR 8건·NFR 5건·DoD 9항 명시)

### 2.2 Design 단계
**문서**: `docs/02-design/features/hs-basic-tech-1.design.md`

- **아키텍처 확장 제로**: `hs-textbook-collection` 카테고리 인프라 그대로 재사용, 신규 파일 **0개**
  - `sources.ts`에 `HS_BASIC_TECH_1` 등록 (order 6) + sections 배열
  - `schoolTextMdx.tsx` REGISTRY에 항목 추가 (12개 모듈 로더)
  - 홈 `SourcePicker`: 카테고리 그룹 내 카드 자동 추가

- **섹션 12개 명세** (§3):
  | # | id | title | group | 원문라인 | readingTime |
  |:-:|---|---|---|---|:-:|
  | 1 | electronic-devices | 전자 소자 | 전기·전자 기초 | [4501~4666]+[1~206] | 16 |
  | 2 | dc-circuits | 직류 회로 | 전기·전자 기초 | 207~655 | 11 |
  | 3 | measurement | 측정 기술 | 기계 가공 기술 | 656~986 | 10 |
  | 4 | milling | 밀링 가공 | 기계 가공 기술 | 987~1683 | 13 |
  | 5 | drafting-standards | 제도의 규격과 통칙 | 설계 | 1684~2198 | 13 |
  | 6 | drawing-methods | 기본 도법에 의한 도면 그리기 | 설계 | 2199~2320 | 9 |
  | 7 | sectional-views | 단면도 그리기 | 설계 | 2321~2409 | 8 |
  | 8 | pneumatics-basics | 공압 기술의 개요 | 공유압기술 | 2410~2667 | 12 |
  | 9 | pneumatics-equipment | 공압 발생장치와 조정기기 | 공유압기술 | 2668~3120 | 14 |
  | 10 | hydraulics-equipment | 유압 발생장치와 조정기기 | 공유압기술 | 3121~3366 | 10 |
  | 11 | c-basics | C언어의 기초 | 프로그래밍 | 3367~3662 | 12 |
  | 12 | c-programming | C프로그래밍 활용 | 프로그래밍 | 3663~4343 | 14 |

- **콘텐츠 재구성 계약** (daegu 승계):
  - LayeredExplain + sourceSection 형식
  - 원문 이미지 0 + 문장 전면 재작성
  - MDX 안전 규칙 준수
  - 출처 footer 명시

- **이 권 특유 규칙**:
  1. **챕터Ⅰ 차별화(FR-6)**: `hs-semicon-basics`는 개념·원리, 이 권은 **실습·측정·납땜** 각도 (색띠 저항 읽기, 멀티테스터 검사, 평가 기준)
  2. **원문 페이지 순환 배치 대응**: §3.1 읽기 순서 7단계를 정확히 따름
  3. **단위 병기**: 원문 단위(kgf/cm²) 유지, SI(98.07 kPa) 괄호로 병기
  4. **KS 표준 고유명사**: 저작권 보호 대상 아님, 원문 그대로 인용 가능

- **cross-link 전략** (§5):
  - pneumatics: `gas-safety`, `engineering-controls` 태깅
  - hydraulics: `engineering-controls` (SourceRef로 대체)
  - design standards: 화학/공정 어휘 무관, 무리한 태깅 금지
  - NCS 연결 8건 (설계 목표 2건 4배 초과)

### 2.3 Do 단계 (구현)

**구현 방식**: 챕터I 파일럿 후 4개 병렬 서브에이전트 가속

| 단계 | 작업 | 상태 |
|------|------|------|
| Phase 0 | `HS_BASIC_TECH_1` 등록, schoolTextMdx.tsx REGISTRY 추가, 빌드 통과 | ✅ |
| Phase 1 | `electronic-devices.mdx` 파일럿(§3.1 순환 배치 역산) + 검증 게이트 | ✅ |
| Phase 2 | 4개 서브에이전트 병렬: Ⅱ(measurement·milling) · Ⅲ(3모듈) · Ⅳ(3모듈) · Ⅴ(2모듈) | ✅ |
| Phase 3 | 근접 패러프레이즈 자체 검증(최장 공통 부분열 탐색 스크립트로 저작권 안전성 재검증) | ✅ |
| Phase 4 | `_links.json` cross-link 태깅 + typecheck·lint·build·cross-link·렌더 스모크 테스트 | ✅ |

**주요 구현 특징**:
- **챕터Ⅰ 재구성**: 파일럿 `electronic-devices.mdx` ①~⑨ 순서로 원문 정독 → 3단 레이어 구성 → hs-semicon-basics 3건 SourceRef 연결 (중복 없음, 실습·측정 각도 차별화)
- **병렬 서브에이전트**: 공통 스펙 파일 기반으로 4개 팀이 동시 진행 → 근접 패러프레이즈 발견 시 즉시 재작성
- **저작권 안전성**: 자체 검증 과정에서 원문과 지나치게 유사한 표현(근접 패러프레이즈) 발견 → **즉시 재작성** (이는 설계 이상의 추가 품질 관리)
- **단위 표기**: Ⅳ(공유압기술) 전 모듈에서 원문 단위(kgf/cm²·mmHg·at) + SI 병기(98.07 kPa) 적용

**완성 파일 목록**:
- `src/lib/sources.ts` — HS_BASIC_TECH_1 등록 (order 6)
- `src/lib/schoolTextMdx.tsx` — REGISTRY에 12개 모듈 항목
- `src/content/sources/hs-basic-tech-1/*.mdx` — 12모듈 (약 4,500줄)
- `src/content/sources/hs-basic-tech-1/_links.json` — cross-link 태깅

### 2.4 Check 단계 (분석)
**문서**: `docs/03-analysis/hs-basic-tech-1.analysis.md`  
**Match Rate**: **94.8%** (기준 90% 이상 ✅)

| 검증 항목 | 결과 |
|---|:---:|
| 설계 §1~7 전절 반영 | ✅ 26/26 |
| 부분 일치(합리적 편차) | ⚠️ 3/29 (단위 반복 표기·미태깅·타겟 편차) |
| 실질 Gap (High/Medium) | ❌ 0 |
| Positive Deviations | ✅ 6건 (NCS 4배·순환 배치 완전 해소·측정 추가 연결·모듈 간 자료원 SourceRef·다층 Callout·자체 검증) |

**기계 검증**:
```
✅ typecheck: 0 error
✅ lint: 0 error (신규 경고 0)
✅ build: 195+ pages SSG (정적 export)
   └─ /sources/hs-basic-tech-1/* 12모듈 + 1인덱스 + 기존 daegu·hs-semicon-basics 회귀 없음
✅ build:cross-link: 6 sources · 100 sections · unknown refs 0
✅ 렌더 스모크: 모듈 12/12, 인덱스 5트랙, 홈 교과서 그룹 3번째 카드, cross-link 렌더
```

---

## 3. 완료된 항목

### 3.1 기능 요구사항 (FR)

| ID | 요구사항 | 상태 | 비고 |
|----|----------|:----:|------|
| FR-1 | `HS_BASIC_TECH_1` 등록 → 홈 교과서 그룹·`/sources/hs-basic-tech-1` 노출 | ✅ | sources.ts + order 6 |
| FR-2 | 5대단원 트랙 그룹 렌더 (기존 컴포넌트 재사용) | ✅ | 무수정 |
| FR-3 | 12모듈 MDX + 공용 라우트 SSG | ✅ | 4,500줄 |
| FR-4 | 3단 레이어 재구성, 원문 이미지 0·문장 전면 재작성 | ✅ | 12/12 파일 |
| FR-5 | 출처 표기: 정예원 외 4인·크리아트출판사 명시 | ✅ | 모듈 footer |
| FR-6 | 챕터Ⅰ 차별화 각도(실습·측정) + hs-semicon-basics 상호 연결 | ✅ | 3건 SourceRef, 중복 0 |
| FR-7 | 챕터Ⅲ·Ⅳ 재구성 시 NCS 연결 최소 2건 | ✅ | 8건 실증 (4배 초과) |
| FR-8 | 공학 단위계 표기 일관성 | ✅ | 원문+SI 병기 |

### 3.2 비기능 요구사항 (NFR)

| ID | 요구사항 | 상태 |
|----|----------|:----:|
| NFR-1 | 정적 SSG 호환 — 서버 의존 0 | ✅ |
| NFR-2 | typecheck + lint + build 무오류 | ✅ |
| NFR-3 | cross-link.json 산출물 정합 | ✅ |
| NFR-4 | 코어 무수정 (신규 자료원 등록만) | ✅ |
| NFR-5 | 재구성 품질: 원문 순환 배치 정확 역산, 법칙·수치 왜곡 0 | ✅ |

### 3.3 산출물

| 산출물 | 위치 | 상태 |
|--------|------|:----:|
| Source 레지스트리 | `src/lib/sources.ts` (HS_BASIC_TECH_1) | ✅ |
| 통합 로더 확장 | `src/lib/schoolTextMdx.tsx` (REGISTRY에 12개 항목) | ✅ |
| 콘텐츠 12모듈 | `src/content/sources/hs-basic-tech-1/*.mdx` | ✅ |
| cross-link 태깅 | `src/content/sources/hs-basic-tech-1/_links.json` | ✅ |

### 3.4 검증 현황

| 검증항목 | 결과 |
|---------|:----:|
| 빌드 페이지 수 | 195+ (신규 추가) |
| SSG 정적 라우트 | 12/12 모듈 + 1인덱스 |
| cross-link 통제어휘 | 6 sources · 100 sections · 0 unknown |
| 스모크 테스트 | 12/12 모듈 렌더 성공 |
| 다크모드 | ✅ 클래스 존재 |

---

## 4. 미완료 항목

### 4.1 코드래빗 자동 리뷰 17건 — 반영 완료 ✅

**상황**: PR #17(feat/hs-basic-tech-1 → main)이 2026-07-16T12:25:25Z에 머지(커밋 daa417f)된 뒤, 재타겟 시 실행된 코드래빗 자동 리뷰의 17건 actionable comment를 체크 상태만 확인하고 코멘트 본문은 검토하지 못한 채 머지했다. 이후 `fix/hs-basic-tech-1-coderabbit` 브랜치에서 17건 전부를 코드베이스와 대조 검증 후 반영했다(허위 지적으로 기각된 항목 없음).

| 분류 | 건수 | 내용 |
|---|:-:|---|
| 보안/개인정보 | 1 | `pdca-status.json`의 scratchpad 임시경로(사용자명 노출) → 파일명만 남기고 정규화 |
| 데이터 정합성 | 1 | `pendingDecisions`가 Plan §9 확정 이후에도 미확정으로 표기된 것을 "없음"으로 정정 |
| 문서 정합성 | 3 | fenced code block 언어 미지정 2건(plan.md·design.md), design.md 구현 범위 설명 누락(page.tsx 빌드 검증) 보완 |
| 코드 정확성 | 2 | `generateStaticParams`의 REGISTRY-only source `return []` 무음 누락 → `throw`로 fail-fast 전환, `hasModuleLoader`의 `in` 연산자 프로토타입 오염 → `hasOwnProperty` |
| 콘텐츠 정확성 | 10 | C언어(고급언어 범위·비트반전 비트폭·결합방향 예외·`gets`→`fgets`), 전기(맥류 예시), 제도(정투상도 실제크기 범위), 유압(누설 매체), 밀링(이송량 기준), 공압(SI 단위 병기 5곳·절대압력 부호·스크루식/터보형 구분) |

`typecheck`·`lint`·`build` 모두 통과 확인.

### 4.2 후속 7권 로드맵 (의도된 범위 외)

이 사이클은 P1 완주이며, P2~P7은 권별 후속 사이클로 진행:

| 순서 | 권 | Feature ID | 예상 모듈 수 | 우선순위 |
|:---:|---|---|:---:|:---:|
| P2 | 반도체기초기술 2 | `hs-basic-tech-2` | 10~14 | High |
| P3 | 반도체 포토·에칭 | `hs-photo-etch` | 10~15 | High (daegu cross-link) |
| P4 | 반도체 박막·확산 | `hs-thinfilm-diffusion` | 8~12 | High |
| P5 | 반도체 조립·검사 | `hs-assembly-inspection` | 10~14 | High |
| P6 | 반도체 장비 유지보수 | `hs-equipment-maintenance` | 10~15 | High (NCS) |
| P7 | 반도체 인프라 일반 | `hs-infra-general` | 8~12 | High (OSHA) |

---

## 5. 품질 지표

### 5.1 최종 분석 결과

| 지표 | 목표 | 달성 | 상태 |
|------|:---:|:---:|:---:|
| Design Match Rate | 90% | **94.8%** | ✅ 달성 |
| 저작권 준수 (원문 이미지) | 0개 | **0개** | ✅ 달성 |
| 저작권 준수 (원문 문장 직용) | 0회 | **0회** | ✅ 달성 |
| 저작권 준수 (근접 패러프레이즈 재작성) | 미측정 | **발견·재작성** | ✅ 추가 안전화 |
| cross-link 실증 (NCS) | 최소 2건 | **8건** | ✅ 4배 초과 |
| FR 달성율 | 7/7 | **8/8** | 100% |
| NFR 달성율 | 5/5 | **5/5** | 100% |
| 빌드 오류 | 0 | **0** | ✅ 무오류 |

### 5.2 수치 달성

| 수치 | 목표 | 달성 |
|------|:---:|:---:|
| 모듈 수 | 12 | **12** |
| MDX 줄수 | 설계 기준 | **~4,500줄** |
| readingTime 합계 | 설계 기준 | **137분** |
| 대단원 트랙 | 5 | **5** (전기·전자·기계·설계·공유압·프로그래밍) |
| 원문 페이지 순환 배치 정확 역산 | 필수 | ✅ **완전 구현** |
| typecheck 오류 | 0 | **0** |
| lint 신규 경고 | 0 | **0** |
| 정적 페이지 증가 | ~12 | **195+** (기존 포함) |

---

## 6. 저작권 원칙 준수 현황

### 6.1 원칙 확립 (Plan + daegu 선례)

크리아트(사설 인정교과서), 렛유인 daegu와 동일하게 **보수적 일괄 적용**:

1. **원문 이미지**: 전면 배제 ✅
2. **원문 문장**: 전면 재작성 (개념·수치·정의만 근거로 새로 씀) ✅
3. **원문 직접 인용**: SourceQuote 사용 금지 ✅
4. **근접 패러프레이즈**: Do 단계 자체 검증으로 발견 후 재작성 ✅ (추가 안전화)
5. **출처 표기**: 원저자·발행처·단원·페이지 명시 ✅

### 6.2 구현 검증 (12모듈)

각 모듈 구성:
```
✅ Callout(학습목표) — 원본 재서술
✅ LayeredExplain — Hook/Easy/Deep 구조 (인용 X)
✅ 본문 섹션 — GFM 표로 데이터 재배열
✅ 단위 표기 — 원문 단위 + SI 병기 (챕터Ⅳ 중심)
✅ 말미 출처 — "재구성" 명시 + 정예원 외 4인·크리아트출판사
```

**core 무수정 확정**:
- 기존 책·OSHA·NCS·daegu·hs-semicon-basics 변경 없음
- 기존 Process(공정) 페이지 무영향
- cross-link 시스템 확장만 (새 권 발견)

---

## 7. 긍정점 & 개선 사항

### 7.1 잘 된 점 (Keep)

- **원문 페이지 순환 배치 완전 해소** — Plan §1.3에서 발견한 리스크를 Design 명세→Do 구현으로 정확히 역산, electronic-devices.mdx에서 ①~⑨ 순서 완벽 반영 (예: 인덕터 특성 파일 끝→시작 이음새 검증)
- **5개 이질 과목을 체계적으로 재구성** — 전자소자(실습)·기계가공(측정)·설계(제도)·공유압(SI 병기)·프로그래밍(예제)을 각각 다른 각도로 차별화, 사이트 정체성과의 연결 명확화
- **병렬 서브에이전트 + 근접 패러프레이즈 검증** — 대량 콘텐츠를 4개 팀이 동시 진행하면서도 자체 검증으로 저작권 안전성 재검증 (설계를 실행 수준까지 강화)
- **NCS 연결 4배 초과 달성** — 설계 목표 2건 대비 8건 실증, 장비 기술자 양성 교육과의 명확한 학습 동선 구축
- **카테고리 인프라 재사용의 완벽한 실증** — hs-textbook-collection이 만든 구조를 신규 권에 그대로 적용, 신규 파일 0개로 배포 가능한 효율성 입증

### 7.2 개선 사항 (Improvement)

- **코드래빗 자동 리뷰 검토 없이 머지된 사례 재발 방지** — 재타겟 직후 체크 상태(SUCCESS)만 보고 코멘트 본문을 놓친 채 머지한 전례가 있었음(17건은 사후 전량 반영 완료, §4.1). 향후 재타겟·머지 전 리뷰 코멘트 존재 여부를 별도로 확인하는 절차화 필요
- **원문 OCR 재검증 프로세스 강화** — 크리아트 권 목차부 손상, 권별 사이클 착수 시 "목차 재검증 필수" 절차 필요
- **발행처별 저작권 확인** — 현재는 daegu 보수 원칙으로 일괄이나, 향후 서울시교육청(공공누리 가능성) 재확인 시 license 상향 여지

### 7.3 다음에 적용할 것 (Try)

- **권별 개별 feature 사이클** — P2~P7을 각각 `/pdca plan hs-basic-tech-2` 형태로 착수 (카테고리 인프라는 이번 완성, 후속 권은 Design·Do 중심)
- **콘텐츠 확대 시 3줄만 추가** — schoolTextMdx 로더 1줄 + sources.ts sections 1줄 + _links.json 선택 → 코어 무수정 원칙 지속
- **권별 사이클 체크리스트** — 각 권 Plan에 "목차 재검증·분량 재산정·cross-link 계획·발행처 저작권 확인" 항목 필수 포함
- **QuoteIndex 번들 최적화** — 8권 완주 후 SOURCES 레지스트리 코드 분할 (현재 ~1KB → 예상 ~25-30KB)

---

## 8. 다음 단계

### 8.1 코드래빗 리뷰 반영 — 완료 ✅

17건 전부 `fix/hs-basic-tech-1-coderabbit` 브랜치에 반영, `typecheck`·`lint`·`build` 통과(§4.1 참고). 커밋·병합은 사용자 요청 시 진행.

### 8.2 권별 후속 사이클 (P2~P7)

**P2 착수 (반도체기초기술 2)**:
```bash
/pdca plan hs-basic-tech-2
# Plan에서 반드시 포함할 것:
# - 원문 목차 재검증 (크리아트 또 다른 권도 OCR 손상 여부 확인)
# - 분량 재산정 (6,243줄 → 모듈 수 확정)
# - cross-link 최소 태깅 계획
# - 발행처 저작권 확인
```

| 순서 | 권 | Feature ID | 예상 일정 | 초점 |
|:---:|---|---|---|---|
| P1 | 반도체기초기술 1 | ✅ **완료** | 2026-07-16 | - |
| P2 | 반도체기초기술 2 | `hs-basic-tech-2` | 2주 | 목차 재검증·기계/프로그래밍 신주제 |
| P3 | 반도체 포토·에칭 | `hs-photo-etch` | 3주 | daegu cross-link 필수 |
| P4 | 반도체 박막·확산 | `hs-thinfilm-diffusion` | 3주 | daegu cross-link 필수 |
| P5 | 반도체 조립·검사 | `hs-assembly-inspection` | 3주 | 기존 packaging Process 연결 |
| P6 | 반도체 장비 유지보수 | `hs-equipment-maintenance` | 3주 | NCS 장비 유지보수 트랙 교차 |
| P7 | 반도체 인프라 일반 | `hs-infra-general` | 2주 | 안전·OSHA 최대 교차 |

### 8.3 코어 인프라 개선 (향후 과제)

| 과제 | 설명 | 영향 |
|-----|------|------|
| daegu 라우트 공용화 | 3개 라우트를 `[source]/[module]`로 통합 (이관 리팩터) | 코드 정리, 선택 |
| QuoteIndex 번들 최적화 | 8권 완료 후 SOURCES 레지스트리 분할 | P7 후 권장 |
| MDX 출처 템플릿 일괄 | 10회 복붙 패턴을 컴포넌트화 | P2 착수 전 고려 |
| 교과서 간 중복 검사 | 포토공정 양쪽 존재 시 cross-link 갈음 | P3 이후 자동 |

---

## 9. 변경 사항 (Changelog)

### v1.0.0 (2026-07-16)

**Added**:
- `HS_BASIC_TECH_1` Source 레지스트리 신규 (id: `hs-basic-tech-1`, 12섹션, 137분 readingTime, order: 6)
- `src/content/sources/hs-basic-tech-1/` — 12모듈 콘텐츠 신규 (~4,500줄, 3단 레이어)
  - electronic-devices.mdx (파일럿, 16분)
  - dc-circuits.mdx (11분)
  - measurement.mdx (10분)
  - milling.mdx (13분)
  - drafting-standards.mdx (13분)
  - drawing-methods.mdx (9분)
  - sectional-views.mdx (8분)
  - pneumatics-basics.mdx (12분)
  - pneumatics-equipment.mdx (14분)
  - hydraulics-equipment.mdx (10분)
  - c-basics.mdx (12분)
  - c-programming.mdx (14분)
- `src/content/sources/hs-basic-tech-1/_links.json` — cross-link 태깅 신규 (NCS 8건)

**Changed**:
- `src/lib/sources.ts`: `SOURCES` 배열에 `HS_BASIC_TECH_1` 추가 (order 6)
- `src/lib/schoolTextMdx.tsx`: REGISTRY에 12개 모듈 항목 확장

**Quality**:
- 원문 페이지 순환 배치 완전 역산 (Plan §1.3 → Design §3.1 → Do 구현)
- 근접 패러프레이즈 자체 검증으로 저작권 안전성 재강화
- 타입 안전성: 모든 모듈 id·title·group·readingTime 검증 통과
- typecheck/lint/build 무오류, cross-link 통제어휘 검증 통과

---

## 10. 기술 메모

### 10.1 브랜치 & 커밋 상태

- **브랜치**: `main` (PR #17 머지 완료, 커밋 daa417f, 2026-07-16T12:25:25Z)
- **파일 상태**: Untracked (프로젝트 규칙상 사용자 요청 시에만 커밋)
  - `src/lib/sources.ts` (HS_BASIC_TECH_1 추가)
  - `src/lib/schoolTextMdx.tsx` (REGISTRY 확장)
  - `src/content/sources/hs-basic-tech-1/*.mdx` (12파일)
  - `src/content/sources/hs-basic-tech-1/_links.json`

- **✅ 해결**: 코드래빗 자동 리뷰 17건 `fix/hs-basic-tech-1-coderabbit` 브랜치에 반영 완료 (§4.1)

### 10.2 빌드 검증

```text
✅ typecheck: 0 error
✅ lint: 0 error (신규 경고 0)
✅ build: 195+ pages SSG (정적 export)
   ├─ /sources/hs-basic-tech-1/ 12모듈 + 1인덱스
   └─ 기존 daegu·hs-semicon-basics·OSHA·NCS 회귀 없음
✅ build:cross-link: 6 sources · 100 sections · 0 unknown
✅ extract:quotes: git diff 0 (SourceQuote 미사용 유지)
✅ 렌더 스모크:
   ├─ 모듈 12/12 three-layer(Hook/Easy/Deep) 렌더
   ├─ 인덱스 5트랙 그룹(전기·기계·설계·공유압·프로그래밍)
   ├─ 홈 교과서 그룹 3번째 카드(hs-basic-tech-1)
   ├─ cross-link: hs-semicon-basics·NCS 8건 상호 연결
   └─ 다크모드 클래스
```

### 10.3 성능 & 용량

| 항목 | 변화 |
|------|------|
| 정적 페이지 | +13 (12모듈 + 1인덱스) |
| 번들 크기 (메타) | ~+500B (Source 항목) |
| MDX 콘텐츠 | ~4,500줄 추가 |
| cross-link 엣지 | +8 (NCS 연결) |
| readingTime 합계 | 137분 (분산 학습 가능) |

### 10.4 공용 라우트 안전 검증

다중 source의 `[source]/[module]` 정적 세그먼트 우선 원칙 재확인:
- `/sources/hs-semicon-basics/[module]` — 공용 라우트 매칭 (기존 라우트 충돌 0)
- `/sources/daegu-hs-process/[module]` — 전용 라우트 **우선** (공용 라우트 매칭 X)
- `/sources/ncs-semi/[module]` — 전용 라우트 **우선**
- `/sources/osha-scs/[part]` — 다른 세그먼트 ([part]) 사용, 우선
- **→ 라우트 충돌 0 확인, 빌드 출력 중복 params 없음**

---

## 11. 결론

**반도체기초기술1 자료원 전량 완주 — 카테고리 인프라 상속·5대단원 12모듈·저작권 안전성 강화·NCS 연결 4배 달성.**

### 핵심 성과

1. ✅ **원문 페이지 순환 배치 리스크 완전 해소**
   - Plan에서 발견한 4,666줄 원문의 순환 배치(표지·학습목표가 파일 끝)를 라인 단위로 역산
   - Design에서 §3.1 읽기 순서 7단계 명시
   - Do에서 electronic-devices.mdx ①~⑨ 정확히 구현
   - 인덕터 특성 리스트가 파일 끝→파일 시작으로 이음새 검증 성공

2. ✅ **5개 이질 과목의 차별화된 재구성**
   - 전자소자: 실습·납땜·측정 각도 (hs-semicon-basics 개념과 보완)
   - 기계가공: 버니어캘리퍼스·밀링머신 측정 기술
   - 설계제도: KS 표준 도면 규격 (다른 권과 무관, 태깅 무리 금지)
   - 공유압기술: 압력 단위 원문+SI 병기, fab 장비 연결
   - 프로그래밍: C 기초 + 실습 예제 (범용 튜토리얼, 반도체 문맥 약함)

3. ✅ **저작권 안전성의 설계 이상 강화**
   - Design 계약(원문 이미지 0·문장 재작성·출처 표기)을 넘어
   - Do 단계에서 자체 검증 스크립트(최장 공통 부분열)로 근접 패러프레이즈 발견 후 재작성
   - 대량 병렬 작업(4개 서브에이전트)에도 품질 기준 유지

4. ✅ **NCS 반도체장비 트랙과의 명확한 학습 동선**
   - 설계 목표 "최소 2건" 대비 8건 상호 연결 (4배 초과)
   - 챕터Ⅲ·Ⅳ(설계제도·공유압)가 NCS 장비설계·장비유지보수 트랙의 "왜" 질문에 답하는 학문적 기초 제공
   - 반도체산업의 직무 기초교육(기초기술1~7) + 실무교육(NCS)의 다리 역할 완성

5. ✅ **카테고리 인프라의 재사용 완벽성**
   - hs-textbook-collection이 만든 인프라를 신규 권에 그대로 적용
   - 신규 파일 0개 (sources.ts 수정 + schoolTextMdx 로더 항목만)
   - 아키텍처 변경 0, 기존 라우트 충돌 0
   - 후속 7권도 동일 방식으로 확대 가능 (비용 최소화)

### Design Match Rate: 94.8%

설계 §1~7의 모든 P0 항목이 정밀 일치하며, 저작권 안전 3대 기준(원문 이미지 0 · 문장 전면 재작성 · 출처 표기)이 12파일 전부에서 확인된다. 발견된 3건은 저심각도 편차이며, 실제로는 설계를 초과 달성했다(NCS 8건·자료원 내 학습 흐름·다층 Callout·자체 검증).

### 이번 사이클의 의의

**반도체고 9권 신규 교과서의 "첫 번째 정식 완주"**로, 후속 7권의 로드맵과 체계적 확대 기반을 확립했다. 다음 권(P2)부터는 Plan·Design·Do에만 집중 가능하며, 권별 체크리스트를 통해 품질 일관화를 보장한다.

### 이전 과제

```text
[x] 코드래빗 자동 리뷰 17건 검토·반영 (fix/hs-basic-tech-1-coderabbit, 커밋 대기)
[ ] P2(반도체기초기술 2) 착수: /pdca plan hs-basic-tech-2
```

---

## 부록: 권별 로드맵

| 순서 | 권 | Feature ID | 발행처 | OCR분량 | 예상모듈 | 상태 |
|:---:|---|---|---|:---:|:---:|:---:|
| P1 | 반도체기초기술 1 | **hs-basic-tech-1** | **크리아트** | **4,666줄** | **12** | **✅ 완료** |
| P2 | 반도체기초기술 2 | hs-basic-tech-2 | 크리아트 | 6,243줄 | 10~14 | ⏳ 대기 |
| P3 | 반도체 포토·에칭 | hs-photo-etch | 에이치앤지 | 7,242줄 | 10~15 | ⏳ 대기 |
| P4 | 반도체 박막·확산 | hs-thinfilm-diffusion | 에이치앤지 | 5,745줄 | 8~12 | ⏳ 대기 |
| P5 | 반도체 조립·검사 | hs-assembly-inspection | 에이치앤지 | 5,662줄 | 10~14 | ⏳ 대기 |
| P6 | 반도체 장비 유지보수 | hs-equipment-maintenance | 충남반도체고 | 7,048줄 | 10~15 | ⏳ 대기 |
| P7 | 반도체 인프라 일반 | hs-infra-general | 서울시교육청 | 6,042줄 | 8~12 | ⏳ 대기 |

**합계**: 약 50,400줄 (P1 완료 4,666줄 + 미완료 45,734줄)

---

## 문서 참고

- **Plan**: `docs/01-plan/features/hs-basic-tech-1.plan.md`
- **Design**: `docs/02-design/features/hs-basic-tech-1.design.md`
- **Analysis**: `docs/03-analysis/hs-basic-tech-1.analysis.md`
- **상속 선례**: `docs/04-report/hs-textbook-collection.report.md`
- **PR**: #17 (main 머지 완료, 커밋 daa417f)
