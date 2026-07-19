# Design — 「반도체 인프라 일반」 산업안전 트랙 자료원 + 크로스링크 허브

> **Feature**: `safedata-injection` · **작성일**: 2026-07-18 · **Level**: Dynamic
> **Plan**: `docs/01-plan/features/safedata-injection.plan.md` (C안 — 안전 단원 신설 + 기존 모듈 연계)
> **상속**: `hs-textbook-collection`(카테고리 인프라) · `hs-assembly-inspection`(후공정 태깅 선례·본문 실증 원칙) · `hs-thinfilm-diffusion`·`hs-photo-etch`(권당 표준·병렬 Do)

---

## 0. 목차 재검증 결과 (Plan §3.2 잠정안 정정 — 중요)

원문 안전 단원(`data/school-text/…반도체인프라일반…/…md` 3842~6042줄, ~2,200줄) 헤딩 전수 스캔 결과:

| Plan 잠정 | 재검증 실제 |
|-----------|-------------|
| 7공정(확산·포토·식각·증착·이온주입·CMP·**세정**) | **세정 모듈 없음** — 원문 도입부는 세정을 열거하나 본문은 미수록 |
| 전공정만 | **후공정(조립·검사) 전체 포함** — 후면연마·웨이퍼절단·칩접착·몰드·마킹·도금·솔더볼·열적테스트(TDBI)·X선검사 |
| 6~8 모듈 | **전공정 6 + 후공정 9 + 안전보건/제조환경 = 실질 15 공정 콘텐츠 → 10 모듈로 그룹화** |

원문 공정별 반복 구조(확인): **① 유해 요인 노출 특성(사용 물질·부산물·PM) → ② 건강 영향(자극·화상·급성/만성 중독·천식·중추신경·생식·후두암·백혈병 등) → ③ 작업 환경 관리(호흡보호구·국소배기·유해위험 Tip)**. 원저작 인용 자료: 안전보건공단 「반도체 사업장 현장실습생 건강관리 길잡이」(임대성, 2023), 삼성반도체 뉴스룸.

---

## 1. 아키텍처 확장 — 신규 인프라 없음

`hs-textbook-collection`이 완비한 공용 인프라 재사용. **신규 라우트·로더 파일·카테고리·컴포넌트 0**.

| 요소 | 처리 |
|------|------|
| 카테고리 | 기존 `SourceCategory='hs-textbook'` 재사용 |
| 라우트 | 공용 `src/app/sources/[source]/[module]` (신규 없음) |
| 로더 | `src/lib/schoolTextMdx.tsx` REGISTRY에 `hs-semicon-infra` + 모듈 등록 (⚠️ sections↔로더 짝 필수) |
| 관점 뱃지 | hs 교과서는 `SourcePicker`의 그룹 공용 뱃지(`TEXTBOOK_PERSPECTIVE`) 사용 → **개별 PERSPECTIVE 항목 불필요** |
| 빌드 스크립트 | `build-cross-link` glob 자동 발견(무수정) · `extract-quotes`는 교과서 비대상(daegu 선례, 무수정) → **quotes 회귀 0** |

---

## 2. Source 등록 (`src/lib/sources.ts`)

```ts
{
  id: 'hs-semicon-infra',
  kind: 'textbook',
  language: 'ko',
  title: '반도체 인프라 일반',
  subtitle:
    '반도체고 교과서 — 산업안전과 건강관리: 공정별 유해요인·건강영향·작업환경관리 (전·후공정 전체)',
  attribution: '서울시교육청 인정',
  publisher: '서울특별시교육청',
  license: 'fair-use',
  order: 12,               // hs-equipment-maintenance(11) 다음, Do에서 실측 확인
  accent: 'school',
  category: 'hs-textbook',
  sections: [ /* §3, 완성 모듈만 등록 */ ],
}
```

- **범위 주기**: 이번 사이클은 4대단원 중 **Ⅳ 산업안전과 건강관리만** 완주. 나머지 3단원(개요·전기설비·공조)은 후속 사이클 → subtitle이 안전 범위를 명시(오도 방지). 후속 완성 시 subtitle 확대.
- **저작권**: 서울시교육청 인정 교과서. 원문 이미지·문장 직접 사용 0, 출처 표기.

---

## 3. 섹션 전체 설계 — 10 모듈 (3 그룹)

> slug·title·summary는 Do에서 원문 대조 후 미세 조정 가능. **원문 라인**은 재검증 기준 오프셋(파일 절대 라인).

### 그룹 A — 안전보건 기초 (1)
| # | slug | title | 원문 | 내용·보강 | RT |
|---|------|-------|------|-----------|----|
| 1 | `safety-management` | 안전보건 관리와 제조 환경 | 3861~4006 | 클린룸·클래스(FED/ISO)·방진복 착용 + 안전보건 관리체계(산안법·안전/보건관리자·위험성평가·작업환경측정). 보강: OSHA part-1a/1b, 책 ch04·ch17 | 10 |

### 그룹 B — 전공정 안전 (6)
| # | slug | title | 원문 | 핵심 유해인자·건강영향 | 보강 | RT |
|---|------|-------|------|------------------------|------|----|
| 2 | `safety-diffusion` | 확산 공정 안전 | 4037~4172 | arsine·phosphine·diborane 급성중독, **용혈성 빈혈**·폐부종, PM작업 노출 | OSHA part-3, 책 ch07·ch16 | 9 |
| 3 | `safety-photo` | 포토 공정 안전 | 4172~4258 | HMDS·PR·현상(TMAH), 천식·중추신경·생식독성·급/만성중독 | OSHA part-2, 책 ch08·ch14 | 9 |
| 4 | `safety-etch` | 식각 공정 안전 | 4258~4360 | 습식(HF 부식·화상)·건식(플라즈마·중추신경), 벤젠·백혈병 | OSHA part-2·3, 책 ch09 | 8 |
| 5 | `safety-deposition` | 증착 공정 안전 | 4360~4430 | silane 자연발화·급성중독·질식 | OSHA part-3·4, 책 ch10 | 7 |
| 6 | `safety-ion-implant` | 이온 주입 공정 안전 | 4430~4536 | 비소(arsenic)·BF₃·**전리 방사선**(선량계·개인노출선량) | OSHA part-3, 책 ch11 | 8 |
| 7 | `safety-cmp` | 연마(CMP) 공정 안전 | 4536~4612 | 슬러리·미스트, 점막·피부 자극·화상 | OSHA part-2, 책 ch12 | 6 |

### 그룹 C — 후공정(조립·검사) 안전 (3)
| # | slug | title | 원문 | 공정·유해인자 | 보강 | RT |
|---|------|-------|------|---------------|------|----|
| 8 | `safety-backend-mechanical` | 후공정 안전 ① — 후면연마·절단·칩접착 | 4612~4820 | 후면연마·웨이퍼절단(다이싱)·칩접착(epoxy 천식·고온화상) | 책 ch13, hs-assembly-inspection | 9 |
| 9 | `safety-backend-chemical` | 후공정 안전 ② — 몰드·마킹·도금·솔더볼 | 4820~5074 | 몰드(EMC→벤젠·삼산화안티몬)·마킹(VOC)·도금(도금액 화상)·솔더볼(납·플럭스) | 책 ch13·ch14·ch16 | 10 |
| 10 | `safety-backend-test` | 후공정 안전 ③ — 열적테스트·X선검사 | 5074~5170 | TDBI(VOC 톨루엔·n-헥산)·X선(전리방사선·방사선안전관리) | 책 ch13·ch16 | 6 |

- 합 ~10 모듈, RT 합 ~82분. **후공정 3모듈 경계(M8/M9/M10)는 Do에서 분량 실측 후 병합/재분배 허용**(얇으면 M9+M10 병합 → 9모듈).

---

## 4. 콘텐츠 재구성·보강 계약

### 4.1 시리즈 표준 계약 (승계)
- 3단 레이어(Hook→Easy→Deep), 원문 직역 아님·이미지 0·수치/정의만 보존, 페이지 내 출처(서울시교육청·OSHA Part·책 페이지).
- 각 공정 모듈은 원문 3부 구조(**유해요인 → 건강영향 → 작업환경관리**)를 뼈대로.

### 4.2 이 권 특유 규칙
1. **안전 정확성 최우선(생명 직결)**: 노출 증상·중독 기전·GHS·PPE·노출기준은 OSHA·책·공신력 자료 대조. Do에서 **모듈별 근거 기록** 필수. Fable 교차 검증(cf. [[parallel-agent-quota-strategy]]).
2. **보강 = 깊이 추가**: 텍스트북 골격에 OSHA(GHS 신호어·가스 캐비닛·국소배기·응급)·책(직업병 기전·역학) 교차 인용으로 Deep 레이어 강화.
3. **교육용 한계 고지**: 각 모듈에 "실제 취급 시 정식 MSDS·안전관리자 지침 우선" 고지(Callout).
4. **기술 모듈과 각도 분리**: 기술 모듈=원리·구조, 안전 모듈=위험·건강·보호. 중복 아닌 상호 보완(cross-link).

---

## 5. cross-link 태깅 전략 (`src/content/sources/hs-semicon-infra/_links.json`)

**원칙**: hs-assembly-inspection 선례 — **본문 실증분만 태깅**(모듈 MDX가 실제 서술한 물질·유해인자·주제). 안전 단원은 물질·증상을 명시 서술하므로 태깅 밀도 높음. 통제 어휘는 기존 `schema-enum.json` 재사용(신규 어휘 원칙적 회피).

> **아래 표는 설계 예시(illustrative)** — 실제 태깅은 Do 단계에서 원문 대조로 확정한 `_links.json`이 권위. 본문 실증 원칙에 따라 예시와 물질 목록이 갈릴 수 있다(예: diffusion은 원문 사용물질 10종으로 확대, backend-chemical은 무연 솔더라 `lead` 제외).

| 모듈 | topics | hazards | chemicals | 자동 연계 노드 |
|------|--------|---------|-----------|----------------|
| safety-management | ppe, engineering-controls, industrial-hygiene, cleanroom, exposure-monitoring | — | — | 책 ch04·ch17, osha part-1a/1b, hs-photo-etch/fab-cleanroom, hs-assembly-inspection/particle-counter |
| safety-diffusion | gas-safety, ppe, engineering-controls, emergency-response, occupational-disease | pyrophoric, toxic, acute-toxic | arsine, phosphine, diborane | 책 ch07, osha part-3, process/diffusion, hs-thinfilm-diffusion/diffusion-* |
| safety-photo | ppe, engineering-controls, liquid-chemicals, occupational-disease | corrosive, sensitizer, reproductive-toxin | hmds, pgmea, tmah | 책 ch08, process/photolithography, hs-photo-etch/photo-* |
| safety-etch | gas-safety, liquid-chemicals, ppe, engineering-controls | corrosive, toxic, carcinogen | hydrofluoric-acid, fluorine, chlorine | 책 ch09, process/etching, hs-photo-etch/etch-* |
| safety-deposition | gas-safety, ppe, engineering-controls | pyrophoric, flammable, toxic | silane, dichlorosilane, tungsten-hexafluoride | 책 ch10, osha part-3/4, hs-thinfilm-diffusion/thinfilm-* |
| safety-ion-implant | gas-safety, ppe, engineering-controls, exposure-monitoring | toxic, acute-toxic, carcinogen | arsine, boron-trifluoride, arsenic | 책 ch11, osha part-3 |
| safety-cmp | liquid-chemicals, ppe, engineering-controls | corrosive, sensitizer | silica-slurry, ceria-slurry | 책 ch12, process/cmp |
| safety-backend-mechanical | packaging, ppe, engineering-controls | sensitizer | epoxy-resin | 책 ch13, hs-assembly-inspection/sawing-*·diebond-* |
| safety-backend-chemical | packaging, ppe, engineering-controls, liquid-chemicals | carcinogen, sensitizer, corrosive | benzene, antimony-trioxide, epoxy-resin, solder-flux, lead | 책 ch13, hs-assembly-inspection/packaging-overview |
| safety-backend-test | packaging, exposure-monitoring, engineering-controls | carcinogen | benzene | 책 ch13·ch16, hs-assembly-inspection/probe-test·inspection-overview |

- **양방향 연계(B)**: 통제 어휘 공유로 `lookupRelated`가 자동 역방향 생성 — 기존 diffusion/photo/etch 기술 모듈·책 챕터·OSHA에서 안전 모듈이 "관련 자료"로 노출됨(무수정).
- **다리 균형화(부수, D-4)**: 선택 시 `osha-scs/_links.json` part-1a/1b/4에 위 물질 태그 추가 → part 편중 완화.

---

## 6. 검증 계획 (게이트)

| 항목 | 기준 |
|------|------|
| `npm run typecheck` | 0 |
| `npm run lint` | 신규 0 (기존 ExternalLink 경고 제외) |
| `npm run build:cross-link` | 통과 · **unknownChemicals 0** · edges 증가 · sources 12 |
| `npm run build` | SSG 전 모듈 생성, "본문 준비 중" 자리표시 0 |
| quotes | 회귀 0 (214 유지) |
| 렌더 | 10 모듈 육안 확인, 홈 교과서 그룹 9번째 카드, 이전/다음 내비, cross-link 양방향 |
| 안전 정확성 | 모듈별 근거 기록, Fable 검증 통과 |

---

## 7. 구현 순서 (병렬 배치)

1. **골격·등록·파일럿**: SOURCES + schoolTextMdx 등록 + 파일럿 **`safety-diffusion`**(유해인자 밀도 최상, arsine 용혈성빈혈) 1모듈 직접 작성 → typecheck·build·렌더·cross-link 게이트 통과 확인 (계약 검증).
2. **병렬 Do** (Sonnet 배치, 모듈별 원문 라인+OSHA/책 근거 스펙을 파일로 전달):
   - 배치 A: safety-management + safety-cmp (독립·경량)
   - 배치 B: safety-photo + safety-etch (포토·에칭 계열)
   - 배치 C: safety-deposition + safety-ion-implant (가스·방사선)
   - 배치 D: safety-backend-mechanical + safety-backend-chemical + safety-backend-test (후공정)
3. **허브 연계**: `_links.json` 전 모듈 태깅 → `build:cross-link` 재빌드 → edges·unknownChemicals·역방향 노출 검증.
4. **(선택) 다리 균형화**: OSHA part-1a/1b/4 태그 보강.
5. **게이트 전수 + Fable 안전 검증** → `/pdca analyze`.

---

## 8. 결정 사항

### 확정
- source id **`hs-semicon-infra`** (D-1)
- 모듈 **10개**(전공정 6 + 후공정 3 + 안전보건 1), 후공정 경계 Do 조정 허용 (D-2)
- 안전 트랙 우선(4대단원 중 Ⅳ만) — subtitle 범위 명시 (D-3)

### Do 확정 필요
| ID | 항목 | 잠정 |
|----|------|------|
| D-4 | OSHA part-1a/1b/4 물질 태그 보강 포함 | 선택(부수 목표) — 포함 권장 |
| D-5 | 전리방사선 통제 어휘 | 신규 `radiation` 토픽 추가(schema.ts+schema-enum.json 미러 동기) vs **기존 `exposure-monitoring`+`occupational-disease` 재사용**(기본, 미러 churn 회피) |
| D-6 | 후공정 M9/M10 병합 여부 | 분량 실측 후 (얇으면 9모듈) |
| D-7 | order 실측 | 12 (레지스트리 max+1 확인) |
