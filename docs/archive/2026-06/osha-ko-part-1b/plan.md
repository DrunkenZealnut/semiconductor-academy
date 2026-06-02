# Plan — OSHA SCS Part 1B 한글 번역 확장

> **Feature**: `osha-ko-part-1b`
> **작성일**: 2026-06-02 · **Level**: Dynamic · **Cycle 유형**: 콘텐츠 확장 (파일럿 메커니즘 재사용)
> **상속**: `osha-bilingual-toggle` (영/한 토글 메커니즘 완성 — 로더·컴포넌트·page 통합 재사용)

---

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem (문제)** | OSHA SCS Part 1B "Communication, Controls & Emergency Procedures" 본문이 **영문 transcript**뿐이다. 파일럿(Part 1A)으로 영/한 토글은 검증됐으나, 정작 SDS·라벨·유해인자 관리 위계·응급처치 등 **실무 안전 핵심 내용**을 담은 1B는 여전히 한국어 독자가 읽을 수 없다. |
| **Solution (해법)** | 파일럿에서 완성한 토글 메커니즘을 **그대로 재사용**하여 `part-1b.ko.mdx` 한글 번역본(Claude 초벌 + 사람 검수)을 추가하고 `koLoaders`에 **1줄 등록**한다. 코드 변경은 1줄, 나머지는 전부 번역 콘텐츠. 파일럿이 설계한 **NFR-5 확장성**(코어 무수정 확장)을 실증한다. |
| **Function·UX Effect (기능·UX 효과)** | `/sources/osha-scs/part-1b`에서 `[한국어] [EN]` 토글이 **자동 노출**되어 본문 즉시 전환. 선택 언어는 `localStorage`(`osha-scs-lang`)로 Part 1A와 공유되어 일관 유지. SDS 16개 섹션 표·NFPA 색상 표·응급처치 표가 한글로 1:1 대응 렌더. |
| **Core Value (핵심 가치)** | 반도체 화학물질 안전의 **실무 지식(관리 위계·응급처치·폐기물)**을 모국어로 전달해 학습 진입장벽 제거. 동시에 "MDX 1개 + 로더 1줄 = 새 언어판" 확장 비용이 최소임을 증명해, 남은 Part 2/3/4 확장의 반복 템플릿을 확립. |

---

## 1. 배경 / 현재 상태

| 항목 | 현황 |
|------|------|
| 토글 메커니즘 | ✅ **완성** (`osha-bilingual-toggle` 사이클) — `LanguageToggle.tsx`, `(partId,lang)` 로더, `hasOshaScsKo` 가드, page.tsx 통합 모두 동작 |
| `koLoaders` 현황 | `src/lib/oshaMdx.tsx` — 현재 `'part-1a'`만 등록 (1b/2/3/4 미등록 → 영문 단독) |
| 번역 대상 | `src/content/sources/osha-scs/part-1b.mdx` — 영문 transcript, 약 229줄, 8개 섹션 + 개요/요약 |
| 1B 구조 | Course Overview·Learning Objectives → 1.유해물질 → 2.SDS(16섹션 표) → 3.라벨(GHS 분류, NFPA 색상 표) → 4.유해인자 관리 위계(제거~PPE 5단계) → 5.안전 취급 → 6.저장 → 7.응급처치(노출·가스·유출 표) → 8.폐기물 → Course Summary |
| 재사용 자산 | `Chip`(aria-pressed) · `SOURCE_LANGUAGE_LABELS` · `terms.json`(용어 대조) · 책 「반도체 산업의 유해인자」 용어 |
| 파일럿 검증 | Part 1A ko.mdx 영문 1:1 구조 + quotes.json diff 0 + 정적 export 5 part SSG 확인 완료 |

**확정 결정** (사용자 협의, 2026-06-02):
1. 범위: **Part 1B만** (2/3/4는 후속 사이클 — 단계적 검증)
2. 번역 생성: **Claude 초벌 번역 직접 작성** (Do 단계에서 산출, 이후 사람 검수)

---

## 2. 목표 / 비목표

### 목표
- `part-1b.ko.mdx`를 영문과 **헤딩·열거·표 1:1 구조**로 작성 (Claude 초벌 번역).
- `koLoaders`에 `'part-1b'` 등록 → 토글 자동 노출.
- 안전·법규 용어를 책/`terms.json`과 대조해 일관성 확보.
- 코드 코어(컴포넌트/page) **무수정** 확장 실증 (NFR-5).

### 비목표 (이번 사이클 제외)
- Part 2/3/4 한글 번역 (후속 사이클).
- 토글 컴포넌트·로더 시그니처·page 로직 변경 (이미 완성, 변경 불필요).
- 사이트 전역 i18n(헤더/푸터/UI 라벨) — OSHA 본문 한정.
- 한글 인용의 `quotes.json` 인덱싱 — **영문 기준 인덱스 유지** (파일럿 정책 계승).
- 번역 메모리/자동 번역 파이프라인 구축 — 수작업 번역 유지.

---

## 3. 기능 요구사항 (FR)

| ID | 요구사항 | 우선순위 |
|----|----------|:---:|
| FR-1 | `part-1b.ko.mdx`를 영문 `part-1b.mdx`와 헤딩 레벨·열거·표 구조 1:1로 작성 | P0 |
| FR-2 | SDS 16섹션 분류 표 / NFPA 색상 표 / 응급처치 노출 표를 한글로 정확 변환 (행·열 보존) | P0 |
| FR-3 | `oshaMdx.tsx` `koLoaders`에 `'part-1b'` 로더 1줄 등록 | P0 |
| FR-4 | 안전 지침·법규 수치(15분 세척, 1 pint/470mL 등)·GHS 1~5 분류는 **직역 우선**으로 의미 왜곡 0 | P0 |
| FR-5 | 전문 용어(SDS/GHS/NFPA/HMIS/PPE/관리 위계/EHS/cradle-to-grave)를 책·`terms.json`과 대조해 일관 표기 | P1 |
| FR-6 | `/sources/osha-scs/part-1b`에서 토글 자동 노출 + 본문 전환 동작 (page 무수정 확인) | P0 |

## 4. 비기능 요구사항 (NFR)

| ID | 요구사항 |
|----|----------|
| NFR-1 | 정적 export(`output: 'export'`) 호환 — 신규 서버 의존 0 (MDX 추가만) |
| NFR-2 | `npm run typecheck` + `npm run lint` + `npm run build` 무오류 |
| NFR-3 | `quotes.json`/`cross-link.json` 산출물 회귀 0 (`.ko.mdx`는 extract-quotes 스캔 대상 아님 — 파일럿 실증) |
| NFR-4 | **코어 무수정 확장 실증**: 컴포넌트(`LanguageToggle`)·page(`[part]/page.tsx`) 0줄 변경, 변경은 MDX 신규 + 로더 1줄뿐 (NFR-5 계승 검증) |
| NFR-5 | 번역 품질: 안전 핵심 문구 오역 0, 책 용어 일관, 한국어 가독성(중·고등학생 이해 가능) |
| NFR-6 | 다크모드·prose 스타일 영/한 동일 적용 (표 포함) |

---

## 5. 구현 범위 (파일)

| 구분 | 파일 | 작업 |
|------|------|------|
| 신규 | `src/content/sources/osha-scs/part-1b.ko.mdx` | 한글 번역본 (Claude 초벌, 영문 1:1, 표 3개 포함) |
| 수정 | `src/lib/oshaMdx.tsx` | `koLoaders`에 `'part-1b': () => import('.../part-1b.ko.mdx')` **1줄 추가** |

> 컴포넌트·page·타입·빌드 스크립트 **무변경**. 빌드 산출물(`quotes.json` 등) 직접 수정 금지.
> **변경 규모**: 코드 1줄 + MDX 콘텐츠 1파일 → 확장 비용 최소 실증.

---

## 6. 리스크

| ID | 리스크 | 대응 |
|----|--------|------|
| R-1 | 안전·법규 문구 오역 (예: GHS 1=최고위험 vs NFPA 0=무위험 역방향, 15분 세척, 470mL 기준) | 수치·방향성 **직역 우선**, 영문 병기 안내(koNotice 기존 문구), 사람 검수 필수 |
| R-2 | 전문 용어 비일관 (SDS를 "안전보건자료" vs "물질안전보건자료" 혼용 등) | 책 「반도체 산업의 유해인자」 + `terms.json` 대조, 첫 등장 시 영문 병기 |
| R-3 | 표(SDS 16섹션/NFPA 색상/응급처치) 행·열 깨짐 또는 MDX 파싱 오류 | 영문 표 구조 그대로 유지, 빌드 후 렌더 확인 (Playwright 선택) |
| R-4 | 1B 분량(229줄)이 1A보다 커 번들 증가 | 파일럿 측정 기반 영향 경미 예상, 비활성 본문 `hidden` (기존 패턴) |
| R-5 | `koLoaders` 등록 누락 시 토글 미노출 (조용한 실패) | FR-3 명시 + build 후 `/part-1b` 토글 노출 육안/Playwright 확인 |

---

## 7. 완료 정의 (DoD)

- [ ] `part-1b.ko.mdx` 영문과 헤딩/열거/표 1:1 대응 (섹션 8개 + 개요/요약 + 표 3개)
- [ ] `koLoaders`에 `'part-1b'` 등록 → `/sources/osha-scs/part-1b` 토글 자동 노출
- [ ] 컴포넌트·page **0줄 변경** 확인 (NFR-4 코어 무수정 실증)
- [ ] 안전·법규 수치/방향성 직역 정확성 (GHS·NFPA·세척 시간·유출 기준)
- [ ] typecheck + lint + build 무오류, quotes/cross-link 산출물 불변 (diff 0)
- [ ] Gap 분석 Match Rate ≥ 90%

---

## 8. 다음 단계

→ 이번 사이클은 **메커니즘이 파일럿에서 확정**되어 신규 설계 결정이 거의 없다. 두 경로 중 택1:
- **Design skip 정당화** → 곧바로 `/pdca do osha-ko-part-1b` (번역 작성 + 로더 1줄). 파일럿 design을 설계 근거로 계승. (권장 — 콘텐츠 확장 사이클)
- **간이 Design** → `/pdca design osha-ko-part-1b`로 번역 용어 매핑표(SDS/GHS/NFPA…)·표 변환 규칙만 경량 문서화 후 Do.

> 후속: 본 사이클 검증 후 `osha-ko-part-2` → `part-3` → `part-4` 순차 확장 (동일 템플릿 반복).
