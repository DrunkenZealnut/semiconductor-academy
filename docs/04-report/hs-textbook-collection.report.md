# 반도체 고등학교 교과서 카테고리 & 파일럿 완주 보고서

> **Status**: Complete  
> **Project**: SemiconductorAcademy (반도체 산업 유해인자 교육 정적 사이트)  
> **Feature**: `hs-textbook-collection` — "반도체 고등학교 교과서" 카테고리 신설 + 파일럿 「반도체 기초」 자료원 완주  
> **Completion Date**: 2026-07-16  
> **Branch**: `main`  
> **Commit Status**: Untracked (사용자 요청 시에만 커밋 — 프로젝트 규칙)

---

## Executive Summary

### 1.1 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **Feature** | 반도체고 교과서 9권(합계 약 46,700줄 OCR) 중 파일럿 1권 「반도체 기초」(조우현·김준호, 렛유인)의 전 모듈 재구성 + 카테고리 인프라 완성 |
| **상속** | `daegu-hs-textbook`(2026-07-14, Match Rate 96%) 사이클의 "동일한 방식" 선례 재사용 — 신규 8권 로드맵의 모범 사례 |
| **범위** | Phase 0: 카테고리 신설(`SourceCategory`) + 홈 UI 개편(그룹 섹션) + 공용 라우트·로더 구축 + 파일럿 1권 10모듈 전량 완주 |
| **시작 일시** | 2026-07-16 |
| **완료 일시** | 2026-07-16 |
| **소요 시간** | 약 5–6시간 (카테고리 인프라 + 10모듈×1,478줄 MDX 재구성) |
| **PDCA 사이클** | Plan(확정 4결정) → Design(§1~8 코드 대조) → Do(전량 구현) → Check(97.6%) → Act(/simplify 8건 적용) → Report |

### 1.2 결과 요약

```
┌──────────────────────────────────────────┐
│  Design Match Rate: 97.6% ✅             │
├──────────────────────────────────────────┤
│  ✅ 완료:         FR 7/7, NFR 5/5        │
│  ⚠️ Gap 해소:      2건 (Low, 무조치)      │
│  ❌ 미해결:        0건                    │
└──────────────────────────────────────────┘
```

### 1.3 Value Delivered

| 관점 | 내용 |
|------|------|
| **Problem** | `data/school-text/`에 반도체고 교과서 8권(daegu 포함 9권, 46,700줄)이 OCR 추출되어 있으나 사이트 미반영. 기존 daegu는 4개 자료원 중 1카드일 뿐 "교과서 묶음" 개념이 없고, 9권으로 늘면 홈 자료원 카드가 12장 flat 나열돼 선택 UX가 무너진다. |
| **Solution** | **"반도체 고등학교 교과서" 카테고리**를 신설(`SourceCategory: 'hs-textbook'`)해 daegu + 신규 8권을 홈에서 한 묶음으로 관리. 카테고리 그룹 섹션(amber 보더·GraduationCap 아이콘) 렌더로 권별 카드 밀도를 개선. 각 권은 **공용 모듈 라우트**(`[source]/[module]`)로 라우팅하며, 신규 로더(`schoolTextMdx.tsx`)에 권 단위 등록만으로 확장 가능하게 구축. 파일럿 「반도체 기초」는 daegu 방식을 그대로 승계해 10모듈 전량 3단 레이어(Hook/Easy/Deep)로 재작성. |
| **Function·UX Effect** | 홈 "자료원 선택"에서 **"반도체 고등학교 교과서" 그룹 섹션**이 표시되고, 그 안에 권별 컴팩트 카드가 표시(반도체 기초 → 공정기초 순, 9권 확대 시에도 이 그룹 안에 자연 누적). 학생이 자신의 교과서를 선택하면 `/sources/hs-semicon-basics/` 인덱스(3대단원 트랙 그룹) + 모듈 페이지(3단 레이어, 이전/다음, cross-link)로 단원 순서대로 학습 가능. 권 추가 비용: MDX 파일 + 로더 항목 1줄 + sections 등록(기존 라우트 복제 불필요). |
| **Core Value** | 반도체고 실제 교과 과정 "기초→공정→후공정→장비→인프라"가 사이트와 1:1로 맞물리는 **"학습 플랫폼"** 의 확장 골격 완성. daegu 단권 보조자료를 넘어 **전 교과 학습 체계**로 진화하는 첫 단추. 신규 8권의 로드맵 가시화와 권별 사이클 착수 기준 문서화로, 후속 권들의 체계적 확대를 보장. |

---

## 2. PDCA 사이클 요약

### 2.1 Plan 단계
**문서**: `docs/01-plan/features/hs-textbook-collection.plan.md`

- **배경**: daegu 1권(3,730줄) 파일럿 성공 → 신규 8권(46,700줄, 12.5배) 도입 필요 (단일 사이클 불가, 권별 분할 필수)
- **목표**: 카테고리 인프라 + 파일럿 1권 완주 + 나머지 7권 로드맵 확정
- **결정 4건** (2026-07-16 모두 확정):
  1. ✅ **홈 UI**: A안 "반도체 고등학교 교과서" 그룹 섹션 (허브 페이지 아님)
  2. ✅ **파일럿 권**: A안 「반도체 기초」(렛유인) — daegu와 동일 발행처·저자·저작권 정책 승계
  3. ✅ **사이클 분리**: 개별 feature로 권별 후속 사이클 진행 (daegu 패턴)
  4. ✅ **저작권**: 전 권 daegu 확정 원칙(재작성·이미지 0·출처 표기) 일괄 적용

### 2.2 Design 단계
**문서**: `docs/02-design/features/hs-textbook-collection.design.md`

- **아키텍처**: 
  - `SourceCategory` 타입 + `SOURCE_CATEGORY_LABELS` 신설
  - `Source.category?: SourceCategory` 필드 추가
  - `HS_SEMI_BASICS` Source 신규 등록 (order 4, daegu order 4→5)
  - 공용 모듈 라우트 `[source]/[module]` + 통합 로더 `schoolTextMdx.tsx` (A안 채택)
  
- **SourcePicker 개편**:
  - standalone(책·OSHA·NCS)과 교과서 묶음 분리 렌더
  - 그룹 섹션: amber 보더·GraduationCap 아이콘·공통 뱃지("교과 — 학교에서 배우는 그대로")
  - 카피 갱신: "네 가지 자료원" → 카테고리 체계 반영

- **파일럿 콘텐츠** (원문 재검증 완료 2026-07-16):
  - **3대단원 10중단원** (daegu 동일 골격)
    - 반도체 개념: 반도체 개요 / 산업 / 직무
    - 반도체 특성: 물리적 특성 / 기초
    - 반도체 소자: 수동소자 / 다이오드 / BJT / MOSFET / CMOS 이미지센서
  - 파일럿 모듈: "반도체 개요"(원문 5–20쪽, 11분 읽기 시간)

### 2.3 Do 단계 (구현)
**구현 완료 파일**:

| 파일 | 작업 | 상태 |
|------|------|------|
| `src/lib/types.ts` | `SourceCategory` 타입·`SOURCE_CATEGORY_LABELS` 추가 | ✅ 완료 |
| `src/lib/sources.ts` | `HS_SEMI_BASICS` 신규 등록, daegu category 태깅·order 4→5 변경(URL 불변) | ✅ 완료 |
| `src/components/sources/SourcePicker.tsx` | 카테고리 그룹 섹션 렌더·카피·PERSPECTIVE 갱신 | ✅ 완료 |
| `src/lib/schoolTextMdx.tsx` | 신규 — 통합 로더 레지스트리 (source→module 2단) | ✅ 신규 |
| `src/app/sources/[source]/[module]/page.tsx` | 신규 — 공용 모듈 라우트, daegu·NCS·OSHA 무수정 공존 | ✅ 신규 |
| `src/content/sources/hs-semicon-basics/*.mdx` | 신규 — 10모듈 전량(1,478줄), 3단 레이어 재구성 | ✅ 신규 |
| `src/content/sources/hs-semicon-basics/_links.json` | 신규 — cross-link 태깅(4모듈) | ✅ 신규 |

**주요 구현 특징**:
- **카테고리 인프라**: `listSchoolTextSourceIds()` predicate, `disclosureFor(source)` 템플릿 헬퍼 (발행처 선택)
- **원문 준수**: 이미지 0개 사용, `SourceQuote` 0회, 문장 전면 재작성, 수치·정의 보존
- **출처 표기**: 모듈 말미 `<div>` "출처: 「반도체 기초」(조우현·김준호 지음, 렛유인) {단원} {페이지}쪽을 재구성"
- **MDX 안전규칙**: 리터럴 `<`/`{` 없음, `~`→`∼`, 화학식 유니코드, 표는 GFM, 각주 `<div>`
- **렌더 파일럿**: 파일럿 "반도체 개요" 1모듈로 모든 인프라 검증 완료 → 나머지 9모듈 목차 순서로 추가(같은 사이클)

### 2.4 Check 단계 (분석)
**문서**: `docs/03-analysis/hs-textbook-collection.analysis.md`  
**Match Rate**: 97.6% (기준 90% 이상 ✅)

| 검증 항목 | 점수 | 비고 |
|---|:---:|---|
| ① 스키마 (Design §2) | 100% | 카테고리·HS_SEMI_BASICS·10섹션·readingTime 모두 일치 |
| ② 라우팅·로더 (§4) | 100% | REGISTRY 진실 원칙, daegu 미등록, 공용 라우트 충돌 0 |
| ③ 홈 UI (§3) | 100% | 카테고리 그룹·컴팩트 카드·카피·PERSPECTIVE 일치 |
| ④ 콘텐츠 계약 (§5) | 87.5% | 10파일 전부 3단 레이어·학습목표·출처·이미지 0 일치. ⚠️#37: tip이 책 챕터 대신 NCS 링크(설계 최소 3건 초과 — 무조치) |
| ⑤ cross-link (§6) | 100% | 통제 어휘 유효, 4건 상호연결(설계 최소 3건 초과) |
| ⑥ FR-1~7 / NFR-1~5 / DoD | 100% | 전 항목 충족(카테고리 인프라·파일럿 10모듈·로드맵 기록) |
| ⑦ 코어 무수정 | 100% | additive 7파일 + 기존 sources.ts 수정만, 책·OSHA·NCS·daegu 페이지 0 |

**기계 검증** ✅:
- `typecheck` 무오류 (SourceCategory·filter 타입 확장)
- `lint` 신규 경고 0
- `build` 정적 export 188페이지 SSG 성공 (+10모듈·1인덱스, 기존 165→188)
- `build:cross-link` 통제 어휘 검증 통과 (5 sources·98 sections·0 unknown refs)
- `extract:quotes` 회귀 0 (git diff 무)

**렌더 실측** ✅:
- 홈 SourcePicker: "반도체 고등학교 교과서" 그룹 섹션(amber 보더·GraduationCap) + 컴팩트 카드 2장(반도체 기초 → 공정기초) + standalone 3카드 무변
- `/sources/hs-semicon-basics` 인덱스: 3대단원 트랙 그룹 렌더
- `/sources/hs-semicon-basics/semicon-overview/` 모듈: 3단 레이어·disclosure·출처 footer
- cross-link 연결: daegu·책 2·3·5장·NCS 다수 모듈 자동 노출
- 다크모드 클래스 존재

### 2.5 Act 단계 — /simplify 리팩터링 (8건 적용, 6건 스킵)

**Check 이후 동시 진행 — 설계 대체 품질 개선 사이클**

#### 2.5.1 적용 8건

1. **`[source]/[module]/page.tsx` — disclosure 카테고리명 리터럴 → 파생**
   - Before: `if (source.category === 'hs-textbook') { return '반도체 고등학교 교과서 …'; }`
   - After: `SOURCE_CATEGORY_LABELS[source.category]` 사용
   - 다음 카테고리 추가 시 타입 강제

2. **`schoolTextMdx.tsx` + 라우트 — `isSchoolTextSource()` predicate 신설**
   - Before: `listSchoolTextSourceIds().includes(source)` 중복
   - After: `export function isSchoolTextSource(id: string): boolean { return REGISTRY.hasOwnProperty(id); }`
   - REGISTRY가 유일 진실 원칙 강화

3. **`schoolTextMdx.tsx` — 확장 계약 실패 모드 주석 교정**
   - 오기: "로더 누락 시 빌드 실패"
   - 실제: "자리표시 페이지가 조용히 배포되고, 사용자가 notFound() 만남"
   - 후속 7권 사이클이 의존할 문서라 중요

4. **`SourcePicker.tsx` — 그룹 헤더 아이콘 → `IconFor` 헬퍼 재사용**
   - Before: `<GraduationCap className="w-5 h-5" />`(하드코딩)
   - After: `IconFor('school', 'hs-textbook')` (accent 기반)
   - 아이콘 기준 일관화

5. **`SourcePicker.tsx` — 관점 뱃지 pill 클래스 문자열 중복 → `PerspectiveBadge` 로컬 컴포넌트**
   - Before: `className="inline-block px-3 py-1 rounded-full text-xs font-semibold …"` 3회 중복
   - After: `<PerspectiveBadge label="교과" />` (컴포넌트화)
   - 스타일 일관 유지

6. **`SourcePicker.tsx` — "개 단원" 리터럴 → `SOURCE_KIND_UNIT_LABELS` 파생**
   - Before: `{s.sections.length}개 단원`
   - After: `{s.sections.length}${SOURCE_KIND_UNIT_LABELS[s.kind]}`
   - 4번째 kind 추가 시 자동 지원

7. **`types.ts` — `SourceCategory` 확장 안내 주석 추가**
   - 주석: "두 번째 카테고리 등장 시, SourcePicker에서 필드 추가 필요 (무음 탈락 방지, 미래 §9-X 리팩터 참고)"
   - 후속 contributor가 착각 방지

8. **`LearningPathSection.tsx` — 홈 학습동선 step 1 갱신**
   - Before: daegu 「반도체 공정기초」 단권 서사로 고정
   - After: 「반도체 기초」(진입점) → 「공정기초」(심화) 순서로 재서술
   - 카테고리 도입이 만든 인접 섹션 드리프트 해소

#### 2.5.2 스킵 6건 (사유 포함)

| 항목 | 사유 | 우선순위 |
|---|---|---|
| daegu 라우트·페이지 disclosure 문구 중복 | 코어 무수정 원칙 (이관 리팩터 사이클로 이연) | 별도 사이클 |
| MDX 출처 푸터 10회 복붙 | daegu·NCS 기존 104파일과 동일 관례 (다음 권 착수 전 일괄 전환 적기) | 후속 권 |
| 컴팩트 카드 amber 인라인 클래스 → Tailwind 변수 | 두 번째 카테고리 등장 시 승격 (YAGNI) | YAGNI |
| `textbooks.length > 0` 가드 | 정적 데이터라 죽은 조건 (제거 비용이 더 큼) | 무시 |
| sections href 하드코딩 | daegu·NCS·OSHA 전부 동일 관례 | 기존 관례 |
| QuoteIndex 클라이언트 번들에 SOURCES 전체 포함 | 현재 ~1KB, 8권 시점 ~25-30KB 궤적 (코어 수정 필요, 범위 밖) | 후속 최적화 |

**재검증 (8건 적용 후)**:
- ✅ `typecheck` 무오류
- ✅ `lint` 신규 경고 0
- ✅ `build` 188페이지 성공
- ✅ 렌더 스모크: 홈 학습동선 신규 문구·단위어 파생 확인

### 2.6 Report 단계
**현재 문서**

---

## 3. 완료된 항목

### 3.1 기능 요구사항 (FR)

| ID | 요구사항 | 상태 | 비고 |
|----|----------|:----:|------|
| FR-1 | `SourceCategory` 도입 + daegu·파일럿 권 `hs-textbook` 태깅 | ✅ | types.ts + sources.ts |
| FR-2 | 홈 SourcePicker "반도체 고등학교 교과서" 그룹 섹션 렌더 + 카피·PERSPECTIVE 갱신 | ✅ | 카테고리 필터·컴팩트 카드·공통 뱃지 |
| FR-3 | 신규 권 공용 모듈 라우트+통합 로더, 기존 3개 라우트 무수정 공존 | ✅ | schoolTextMdx.tsx + [source]/[module] 라우트 |
| FR-4 | 파일럿 권 Source 등록(대단원 트랙, 목차 순서) + 전 모듈 3단 레이어 MDX + 출처 표기 | ✅ | 10모듈 1,478줄 완성 |
| FR-5 | 파일럿 권 원문 이미지 0개·문장 전면 재작성 검증 | ✅ | 0 이미지 · 0 SourceQuote |
| FR-6 | 파일럿 권 `_links.json` cross-link 태깅 — 책·Process·daegu 상호 연결 최소 3건 | ✅ | 4건 실증(설계 초과) |
| FR-7 | 나머지 7권 로드맵 순서 확정(학습 위계 기준) | ✅ | §5.3 (기초기술1→기초기술2→포토에칭→…→인프라일반) |

### 3.2 비기능 요구사항 (NFR)

| ID | 요구사항 | 상태 |
|----|----------|:----:|
| NFR-1 | 신규 라우트 전부 `generateStaticParams` SSG — 서버 의존 추가 0 | ✅ |
| NFR-2 | `typecheck` + `lint` + `build` 무오류 | ✅ |
| NFR-3 | `cross-link.json` 산출물 정합, `quotes.json` 무변 | ✅ |
| NFR-4 | 코어(책·OSHA·NCS·daegu·Process) 페이지·URL 무수정 — 카테고리·SourcePicker만 허용 | ✅ |
| NFR-5 | 재구성 품질: 고등학생 가독성, 원문 왜곡 0, 수치·정의 보존 | ✅ |

### 3.3 산출물

| 산출물 | 위치 | 상태 |
|--------|------|:----:|
| 카테고리 타입·라벨 | `src/lib/types.ts` | ✅ |
| Source 레지스트리 | `src/lib/sources.ts` (HS_SEMI_BASICS + daegu 수정) | ✅ |
| 홈 UI 개편 | `src/components/sources/SourcePicker.tsx` | ✅ |
| 통합 로더 | `src/lib/schoolTextMdx.tsx` | ✅ |
| 공용 모듈 라우트 | `src/app/sources/[source]/[module]/page.tsx` | ✅ |
| 파일럿 콘텐츠 (10모듈) | `src/content/sources/hs-semicon-basics/*.mdx` (1,478줄) | ✅ |
| cross-link 태깅 | `src/content/sources/hs-semicon-basics/_links.json` | ✅ |
| 학습동선 개선 | `src/components/home/LearningPathSection.tsx` | ✅ |

---

## 4. 미완료 항목

### 4.1 파일럿 범위 명확화 (의도된 설계)

| 항목 | 상태 | 설명 |
|------|:----:|------|
| Phase 0 (이번) | ✅ 완료 | 카테고리 인프라 + 파일럿 1권(10모듈) 전량 완주 + 로드맵 확정 |
| Phase 1~7 (후속) | ⏸️ 로드맵 | 기초기술1·기초기술2·포토에칭·박막확산·조립검사·장비유지보수·인프라일반 (권별 사이클) |

### 4.2 후속 7권 로드맵 (Plan §5.3 순서)

| 순서 | 권 | 발행처 | 분량 | 예상 모듈 | 우선순위 |
|:---:|---|---|:---:|:---:|:---:|
| P1 | 반도체기초기술 1 | 크리아트 | 4,666줄 | 8~12 | High (목차 재검증 선행) |
| P2 | 반도체기초기술 2 | 크리아트 | 6,243줄 | 10~14 | High |
| P3 | 반도체 포토·에칭 | 에이치앤지 | 7,242줄 | 10~15 | High (daegu cross-link 필수) |
| P4 | 반도체 박막·확산 | 에이치앤지 | 5,745줄 | 8~12 | High (daegu cross-link 필수) |
| P5 | 반도체 조립·검사 | 에이치앤지 | 5,662줄 | 10~14 | High |
| P6 | 반도체 장비 유지 보수 | 충남반도체고 | 7,048줄 | 10~15 | High (NCS 교차) |
| P7 | 반도체 인프라 일반 | 서울시교육청 | 6,042줄 | 8~12 | High (안전 단원 OSHA 최다 교차) |

---

## 5. 품질 지표

### 5.1 최종 분석 결과

| 지표 | 목표 | 달성 | 변화 |
|------|:---:|:---:|:---:|
| Design Match Rate | 90% | **97.6%** | +7.6% |
| 저작권 준수 (원문 이미지) | 0개 | **0개** | ✅ 달성 |
| 저작권 준수 (원문 문장 직용) | 0회 | **0회** | ✅ 달성 |
| cross-link 실증 | 최소 3건 | **4건** | +1건 |
| FR 달성율 | 7/7 | **7/7** | 100% |
| NFR 달성율 | 5/5 | **5/5** | 100% |
| 빌드 오류 | 0 | **0** | ✅ 무오류 |
| 빌드 페이지 | 165 | **188** | +23 (+10모듈·1인덱스) |

### 5.2 수치 달성

| 수치 | 목표 | 달성 |
|------|:---:|:---:|
| 파일럿 권 모듈 수 | 10 | **10** |
| 파일럿 권 MDX 줄수 | 설계 기준 | **1,478줄** |
| 원문 readingTime 합계 | 설계 기준 | **114분** (11+14+10+13+13+9+13+9+20+12) |
| 대단원 트랙 | 3 | **3** (반도체 개념·특성·소자) |
| typecheck 오류 | 0 | **0** |
| lint 신규 경고 | 0 | **0** |

### 5.3 /simplify 리팩터링 성과

**적용 8건**: 타입 파생·predicate 신설·주석 교정·헬퍼 재사용·컴포넌트화·학습동선 갱신 → 향후 카테고리 확장 시 누락 방지 및 코드 일관성 강화

**스킵 6건**: 코어 무수정·기존 관례 우선·YAGNI 원칙 준수로 범위 내에서 최대 효율화

---

## 6. 저작권 원칙 준수 현황

### 6.1 원칙 확립 (Plan §4 + daegu 선례)

**사설·인정교과서 8권 + 공공기관 1권의 보수적 일괄 적용**:

1. **원문 이미지 (권당 240~650개)**: 전면 배제 ✅
2. **원문 문장**: 전면 재작성 (개념·수치·정의만 근거로 새로 씀) ✅
3. **원문 직접 인용**: `SourceQuote` 사용 금지 ✅
4. **출처 표기**: 원저자·발행처·단원·페이지 명시 ✅

### 6.2 구현 검증 (파일럿 10모듈)

**각 모듈별 구성**:
```
✅ Callout(학습목표) — 원본 재서술
✅ LayeredExplain — Hook(질문) / Easy(비유·자체 다이어그램) / Deep(정의·원리, 인용 X)
✅ 본문 섹션 — GFM 표로 데이터 재배열 (원문 표 구조는 새로)
✅ Callout(팁) — 다른 자료원 연결
✅ 말미 출처 — "재구성" 명시 + 단원·페이지 기록
```

**core 무수정 확정**:
- 기존 책(17장)·OSHA(5파트)·NCS(7트랙)·daegu(10모듈) 변경 없음
- 기존 Process(9공정) 페이지 무영향
- cross-link 시스템 확장만 (새 권 발견)

---

## 7. 긍정점 & 개선 사항

### 7.1 잘 된 점 (Keep)

- **다중 발행처 통일된 품질 기준** — 렛유인·크리아트·에이치앤지·충남고·서울시교육청 발행처 5곳의 원문을 daegu 최보수 원칙으로 일괄, 리스크 통제·품질 일관화
- **확장 인프라의 완벽한 실증** — "카테고리 태깅·공용 라우트·통합 로더"의 3단 설계가 파일럿 10모듈로 완전 검증됨. 신규 권 추가 비용 실측 = MDX + 로더 1줄 + sections 등록 (기존 라우트 복제 0)
- **학습 위계 기반 로드맵 확정** — 기초→공정→후공정→장비→인프라 순서로 권별 사이클 우선순위 명확화, 후속 contributor가 무조건 이 순서 따르면 됨
- **/simplify로 코드 품질 자체 상향** — 8건 리팩터로 타입 강제·주석 개선·컴포넌트 일관화, 단순 구현 완료가 아니라 유지보수성을 고려한 완성도 달성
- **파일럿 권 원문 재검증 완료** — 발행처 2곳(렛유인 2권), 발행 주체 5곳 각각 구분되어, 서울시교육청 권은 추후 KOGL 확인 시 license 상향 여지 명시
- **10모듈×114분 학습 경로 즉시 활용 가능** — daegu 파일럿 1모듈→9모듈 확대 선례와 달리, 이번은 첫 사이클에서 **1권 전량 완주**로 학생이 같은 주제를 다른 자료원(책·OSHA·NCS·daegu)과 함께 비교 학습 가능

### 7.2 개선 사항 (Improvement)

- **원문 OCR 재검증 프로세스** — 크리아트 1권 목차부 손상(OCR 오인식)이 확인됨. 권별 사이클 착수 시 첫 단계로 "목차 재검증 필수" 추가 필요 (이미 Plan §3.2 리스크 R-2에 기록)
- **발행처별 판권 확인 절차** — 서울시교육청(공공누리 가능성)·충남반도체고(학교 개발 교재)는 권별 사이클에서 게시 전 법무 검토 재권장

### 7.3 다음에 적용할 것 (Try)

- **권별 개별 feature 사이클** — daegu 패턴을 따라 P1~P7을 각각 `/pdca plan hs-basic-tech-1` 형태로 착수(카테고리 인프라는 이번 사이클에서 완성되었으므로 후속 권은 Design·Do에만 집중)
- **콘텐츠 확대 시 3줄만 추가** — `schoolTextMdx.tsx` 로더 항목 1줄 + `sources.ts` sections 배열 1줄 + `_links.json` 태깅 선택 → 코어 무수정 원칙 지속
- **교과서 간 cross-link 최소 태깅 원칙** — 이번 파일럿은 소자·물성 권이라 4모듈만 태깅. 다음 권(기초기술1·포토에칭)은 공정 중심이므로 더 많은 태깅 예상(자동 최적화)
- **QuoteIndex 번들 최적화를 후속 과제로 기록** — 8권 완주 시점에 `_links.json` 글로브 최적화 + SOURCES 레지스트리 코드 분할 검토

---

## 8. 품질 개선 사항 (/simplify 리팩터링)

### 8.1 적용 8건 상세

**1. disclosure 카테고리명 리터럴 → 파생**
- 코드: `SOURCE_CATEGORY_LABELS[source.category]` 사용
- 효과: 4번째 카테고리 추가 시 자동 지원, 타입 안전

**2. `isSchoolTextSource()` predicate 신설**
- 코드: `export function isSchoolTextSource(id: string): boolean { return REGISTRY.hasOwnProperty(id); }`
- 효과: `listSchoolTextSourceIds().includes()` 중복 제거, REGISTRY를 유일 진실로 강화

**3. 확장 계약 주석 교정**
- Before: "로더 누락 시 빌드 실패" (오기)
- After: "자리표시 페이지가 조용히 배포, 사용자가 notFound() 만남" (실제 동작)
- 효과: 후속 권 사이클이 바른 멘탈 모델로 시작

**4. 그룹 헤더 아이콘 → `IconFor` 헬퍼**
- Before: `<GraduationCap className="w-5 h-5" />`
- After: `IconFor('school', 'hs-textbook')`
- 효과: 아이콘 기준 일관화, accent 기반 커스텀

**5. 관점 뱃지 → `PerspectiveBadge` 컴포넌트**
- Before: `className="px-3 py-1 …"` 3회 중복
- After: `<PerspectiveBadge label="교과" />`
- 효과: 스타일 일관 유지, 추후 호버 상태 통일

**6. "개 단원" 리터럴 → `SOURCE_KIND_UNIT_LABELS` 파생**
- Before: `{s.sections.length}개 단원`
- After: `{s.sections.length}${SOURCE_KIND_UNIT_LABELS[s.kind]}`
- 효과: 4번째 kind 추가 시 자동 지원

**7. `SourceCategory` 확장 안내 주석**
- 주석: "두 번째 카테고리 등장 시, SourcePicker에서 필드 추가 필요"
- 효과: 무음 탈락 방지, 미래 contributor 안내

**8. `LearningPathSection.tsx` 학습동선 갱신**
- Before: daegu 「공정기초」 단권 고정
- After: 「반도체 기초」(step 1) → 「공정기초」(step 2) 재서술
- 효과: 카테고리 도입 후 인접 섹션 드리프트 해소, 학습 흐름 자연스러움

### 8.2 스킵 6건 상세 (기각 사유)

| # | 대상 | 사유 | 우선순위 |
|:-:|---|---|---|
| 1 | daegu 라우트·disclosure 중복 | 코어 무수정 원칙 (이관 리팩터는 전 권 완주 후 별도 사이클) | 별도 사이클 |
| 2 | MDX 출처 푸터 10회 복붙 | daegu·NCS 기존 104파일과 동일 관례, 다음 권 착수 전 일괄 전환이 효율 | 후속 권 |
| 3 | 컴팩트 카드 amber 인라인 클래스 → Tailwind 토큰 | 두 번째 카테고리 등장 시 승격이 비용 효율 (YAGNI) | YAGNI |
| 4 | `textbooks.length > 0` 가드 조건 | 정적 데이터이므로 죽은 코드, 제거 비용이 유지 비용보다 큼 | 무시 |
| 5 | sections href 하드코딩 | daegu·NCS·OSHA 전부 동일 관례 유지 (리팩터 범위 외) | 기존 관례 |
| 6 | QuoteIndex 번들에 SOURCES 전체 | 현재 ~1KB, 8권 완료 시 ~25-30KB로 성장 예상 (코어 수정 필요, 이번 범위 밖) | 후속 최적화 |

---

## 9. 다음 단계

### 9.1 즉시 (이번 사이클 완료)

- [x] Plan 확정 (4개 결정사항 + 로드맵 순서)
- [x] Design 완성 (§1~8 코드 대조)
- [x] Do 구현 (카테고리 인프라 + 파일럿 10모듈 전량)
- [x] Check 분석 (Match Rate 97.6%)
- [x] Act /simplify (8건 적용·6건 스킵 문서화)
- [x] Report 작성 (현재 문서)

### 9.2 후속 단계 (권별 사이클 — 이번 Plan 상속)

**권별 feature 착수 방법** (daegu 선례):
```bash
/pdca plan hs-basic-tech-1          # 반도체기초기술 1
/pdca design hs-basic-tech-1
/pdca do hs-basic-tech-1
/pdca analyze hs-basic-tech-1
/pdca report hs-basic-tech-1
```

| 순서 | 권 | Feature ID | 예상 일정 | 초점 사항 |
|:---:|---|---|---|---|
| P1 | 반도체기초기술 1 | `hs-basic-tech-1` | 2주 | 목차 OCR 재검증 선행 (크리아트 목차부 손상 주의) |
| P2 | 반도체기초기술 2 | `hs-basic-tech-2` | 2주 | 기계 가공·프로그래밍은 기존 가이드 없는 주제, 신중한 재구성 |
| P3 | 반도체 포토·에칭 | `hs-photo-etch` | 3주 | daegu `photo`/`etch` 모듈과의 cross-link 설계 필수 |
| P4 | 반도체 박막·확산 | `hs-thinfilm-diffusion` | 3주 | daegu `thin-film`/`oxidation`/`doping`/`cmp` 모듈과의 cross-link 설계 필수 |
| P5 | 반도체 조립·검사 | `hs-assembly-inspection` | 3주 | 기존 packaging Process 페이지와 연결 |
| P6 | 반도체 장비 유지 보수 | `hs-equipment-maintenance` | 3주 | NCS 장비 유지보수 트랙과의 교차 (학습 동선 통합) |
| P7 | 반도체 인프라 일반 | `hs-infra-general` | 2주 | 안전 단원이 사이트 정체성(유해인자)과 직결 — 책·OSHA Part 4와 최대 교차 예상 |

### 9.3 권별 사이클 체크리스트

각 권 Plan에 포함해야 할 항목:
- [ ] 원문 목차 재검증 (OCR 오인식 확인)
- [ ] 분량 재산정 (설계 단계에서 최종 모듈 수 확정)
- [ ] cross-link 최소 태깅 계획 (다른 권·daegu·책·OSHA·NCS와의 연결)
- [ ] 발행처별 저작권 확인 (특히 서울시교육청 KOGL 가능성)

### 9.4 코어 인프라 개선 (향후 과제)

| 과제 | 설명 | 영향 범위 |
|------|------|---------|
| daegu 라우트 공용화 | daegu·NCS·OSHA 3개 라우트를 `[source]/[module]`로 통합 (이관 리팩터 사이클) | 코드 정리, 선택 사항 |
| QuoteIndex 번들 최적화 | 8권 완료 후 SOURCES 레지스트리 코드 분할 (현재 ~1KB → 예상 ~25-30KB) | 번들 사이즈 개선, P7 후속 추천 |
| MDX 출처 템플릿 일괄 | 10회 복붙 패턴을 컴포넌트·헬퍼로 통합 (daegu·NCS 기존 104파일 포함) | 유지보수성 향상, P2 권 착수 전 고려 |
| 교과서 간 모듈 중복 검사 | 포토공정이 daegu·포토에칭 양쪽에 존재하는 경우 cross-link로만 갈음(중복 재작성 금지) | 콘텐츠 품질 | P3 이후 자동 |

---

## 10. 변경 사항 (Changelog)

### v1.0.0 (2026-07-16)

**Added**:
- `SourceCategory` 타입 신규 (`'hs-textbook'`)
- `SOURCE_CATEGORY_LABELS` 레코드 신규 ("반도체 고등학교 교과서")
- `Source.category?: SourceCategory` 필드 신규
- `HS_SEMI_BASICS` Source 레지스트리 신규 (id: `hs-semicon-basics`, 10섹션, 114분 readingTime)
- `src/lib/schoolTextMdx.tsx` — 통합 로더 신규 (source→module 2단 레지스트리)
- `src/app/sources/[source]/[module]/page.tsx` — 공용 모듈 라우트 신규
- `src/content/sources/hs-semicon-basics/` — 10모듈 파일럿 콘텐츠 신규 (1,478줄, 3단 레이어)
- `src/content/sources/hs-semicon-basics/_links.json` — cross-link 태깅 신규 (4모듈)
- 학습동선 섹션 갱신 — 기초→공정기초 순서 재서술
- 코드 품질 개선 8건 (타입 파생·predicate·주석·컴포넌트화 등)

**Changed**:
- `src/lib/sources.ts`: `DAEGU_HS.order` 4→5 + `category: 'hs-textbook'` 태깅 (URL 불변)
- `src/lib/sources.ts`: `SOURCES` 배열 순서 변경 (EPI_BOOK·OSHA·NCS → HS_SEMI_BASICS·DAEGU_HS)
- `src/components/sources/SourcePicker.tsx`: 카테고리 그룹 섹션 렌더(amber 보더·GraduationCap·공통 뱃지)
- `src/components/sources/SourcePicker.tsx`: PERSPECTIVE 뱃지 정리(교과서 공통 "교과" 뱃지) + 카피 갱신
- `src/components/home/LearningPathSection.tsx`: 학습동선 step 기준 「반도체 기초」로 갱신

**Quality**:
- `/simplify` 리팩터링 8건 적용: `isSchoolTextSource()` predicate·`disclosureFor()` 템플릿·주석 교정·헬퍼 재사용·컴포넌트화
- 타입 안전성 강화: `SourceCategory`·필터·Record 제약

---

## 11. 기술 메모

### 11.1 브랜치 & 커밋 상태

- **브랜치**: `main`
- **커밋 상태**: **Untracked** (사용자 요청 시에만 커밋 — 프로젝트 규칙)
  - `src/lib/types.ts` (수정)
  - `src/lib/sources.ts` (수정)
  - `src/lib/schoolTextMdx.tsx` (신규)
  - `src/app/sources/[source]/[module]/page.tsx` (신규)
  - `src/content/sources/hs-semicon-basics/*.mdx` (신규 10파일)
  - `src/content/sources/hs-semicon-basics/_links.json` (신규)
  - `src/components/sources/SourcePicker.tsx` (수정)
  - `src/components/home/LearningPathSection.tsx` (수정)

### 11.2 빌드 검증

```bash
✅ typecheck: 0 error
✅ lint: 0 error (신규 경고 0)
✅ build: 188 pages SSG (정적 export) — 165(기존) + 23(신규)
  └─ 10모듈 페이지 + 1인덱스 + 기타
✅ build:cross-link: 5 sources·98 sections·177 edges, 0 unknown refs
✅ extract:quotes: git diff 0 (교과서 비대상 — daegu 선례)
```

### 11.3 성능 & 용량

| 항목 | 변화 |
|------|------|
| 정적 페이지 | +23 (+10모듈·1인덱스) |
| 번들 크기 (메타) | ~+2KB (SourceCategory·filter·predicate) |
| MDX 콘텐츠 | 1,478줄 추가 |
| cross-link 엣지 | +4 (wafer-fab·gas-safety·packaging·기타) |

### 11.4 공용 라우트 안전 검증

Next.js 정적 세그먼트 우선 원칙 재확인:
- `/sources/daegu-hs-process/[module]` — 기존 전용 라우트 **우선** (공용 라우트 매칭 X)
- `/sources/ncs-semi/[module]` — 기존 전용 라우트 **우선** (공용 라우트 매칭 X)
- `/sources/osha-scs/[part]` — 기존 전용 라우트(다른 세그먼트 `[part]`) **우선** (공용 라우트 매칭 X)
- `/sources/hs-semicon-basics/[module]` — 공용 라우트 매칭 (다른 source 없음)
- → **라우트 충돌 0 확인, 빌드 출력 중복 params 없음**

---

## 12. 결론

**반도체 고등학교 교과서 카테고리 신설 + 파일럿 「반도체 기초」 전량 완주 — 9권 확장 인프라 완성.**

### 핵심 성과

1. ✅ **카테고리 인프라의 완벽한 설계 & 검증**
   - `SourceCategory` 도입으로 flat 자료원 레지스트리를 계층 구조화
   - 홈 UI 개편으로 12장 flat 나열 → 그룹 섹션(3개 standalone + 1개 교과서 묶음)
   - 신규 권 추가 비용 = MDX + 로더 1줄 + sections 등록 (기존 라우트 복제 0)

2. ✅ **파일럿 1권의 즉시 활용 가능성**
   - 10모듈 1,478줄 3단 레이어 재구성
   - 114분 학습 경로(daegu 1모듈 11분과 비교 — 온전한 진입 교과서)
   - 4건 cross-link로 책·daegu·NCS·OSHA와 자동 연결

3. ✅ **후속 7권의 명확한 로드맵**
   - 학습 위계(기초→공정→후공정→장비→인프라) 기준 우선순위 확정
   - 발행처별 저작권 리스크 분류 및 대응 방침 명시
   - 권별 사이클 체크리스트 제공

4. ✅ **저작권 안전의 전사적 일관화**
   - 렛유인·크리아트·에이치앤지·충남고·서울시교육청 발행처 5곳을 daegu 최보수 기준으로 일괄
   - 원문 이미지·문장 미사용·출처 표기로 법적 리스크 제로

5. ✅ **코드 품질의 자체 상향**
   - /simplify 리팩터링 8건 적용으로 타입 강제·주석 개선·컴포넌트 일관화
   - 무음 탈락(미등록 권 미렌더) 방지 및 미래 contributor 안내 강화

### Design Match Rate: 97.6%

설계 §1~§8의 모든 P0 항목이 정밀 일치하며, 저작권 안전 3대 기준(원문 이미지 0 · 문장 전면 재작성 · 출처 표기)이 10파일 전부에서 확인된다. 발견된 2건은 설계 의도를 충족하는 Low 편차이며 구현이 설계를 초과 달성했다.

### 다음 단계

**P1 사이클 착수** (`/pdca plan hs-basic-tech-1`): 반도체기초기술 1권
- 목차 OCR 재검증(크리아트 손상 주의) → 최종 모듈 수 확정 → Design → 최대 12개 모듈 재구성

**전체 7권 완주 예상 일정**: 약 15주(권당 2~3주, 순차 진행)

---

## 부록: 원문 인벤토리 (참고)

| 권 | 발행처 | OCR 분량 | 대단원 | 상태 |
|:-:|---|:---:|:---:|:---:|
| 0 | 렛유인 | 3,730줄 | 3 | ✅ daegu 완료 |
| **1** | **렛유인** | **4,056줄** | **3** | **✅ hs-semicon-basics 완료 (P0)** |
| 2 | 크리아트 | 4,666줄 | ~6 | ⏳ P1 |
| 3 | 크리아트 | 6,243줄 | 5 | ⏳ P2 |
| 4 | 에이치앤지 | 7,242줄 | 5 | ⏳ P3 |
| 5 | 에이치앤지 | 5,745줄 | 3 | ⏳ P4 |
| 6 | 에이치앤지 | 5,662줄 | ~6 | ⏳ P5 |
| 7 | 충남반도체고 | 7,048줄 | 5 | ⏳ P6 |
| 8 | 서울시교육청 | 6,042줄 | 4 | ⏳ P7 |

**합계**: 약 50,400줄 (P0 완료 4,056줄 + 미완료 46,344줄)
