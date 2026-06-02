# Plan — OSHA SCS 이중 언어(영/한) 인페이지 토글

> **Feature**: `osha-bilingual-toggle`
> **작성일**: 2026-06-02 · **Level**: Dynamic · **Cycle 유형**: 표준 (파일럿 → 확장)
> **상속**: `multi-source-learning-platform` (OSHA SCS 5 Part 통합) · `cross-link-system` (Extensibility-first 5원칙)

---

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem (문제)** | OSHA SCS 5 Part 본문이 **영문 transcript**뿐이라, 중·고등학생·일반인 독자가 원본 학습 자료에 접근하기 어렵다. 사이트의 다른 자료(책)는 한글인데 OSHA만 언어 장벽이 있다. |
| **Solution (해법)** | 영문 원문은 보존하면서 **한글 번역본**(AI 초벌 + 사람 검수)을 짝으로 추가하고, **같은 URL에서 EN ↔ 한국어를 즉시 전환**하는 인페이지 토글을 제공. 이번 사이클은 **Part 1A 파일럿**으로 메커니즘을 검증한 뒤 나머지 4 Part로 확장. |
| **Function·UX Effect (기능·UX 효과)** | `/sources/osha-scs/part-1a`에서 `[EN] [한국어]` 토글 버튼 클릭 시 페이지 이동 없이 본문만 교체. 선택 언어는 `localStorage`로 기억되어 재방문·다른 Part에서도 유지. 번역본 없는 Part는 자동으로 영문만 노출(graceful degradation). |
| **Core Value (핵심 가치)** | "원본의 권위 + 모국어 이해" 동시 충족. 영문 원문 신뢰성을 유지하면서 한글로 학습 진입 장벽을 제거. 확장 가능한 i18n 토글 패턴을 자산화해 향후 영문 소스 전반에 재사용. |

---

## 1. 배경 / 현재 상태

| 항목 | 현황 |
|------|------|
| OSHA 콘텐츠 | `src/content/sources/osha-scs/part-{1a,1b,2,3,4}.mdx` — **전부 영문 transcript** |
| Source 메타 | `src/lib/sources.ts` `OSHA_SCS.language = 'en'`, 5 section |
| 라우트 | `src/app/sources/osha-scs/[part]/page.tsx` — `loadOshaScsPartMdx(part)`로 단일 MDX 로드 |
| 로더 | `src/lib/oshaMdx.tsx` — `partId → MDX` 맵 (언어 개념 없음) |
| 현재 안내 문구 | 페이지에 "본 페이지의 영어 본문은 원본 transcript입니다" 고정 표기 |
| 재사용 자산 | `SourceLanguage`(`ko`/`en`)·`SOURCE_LANGUAGE_LABELS` 존재 / `Chip.tsx`(aria-pressed 토글 패턴) 존재 |
| 데이터 파이프라인 | `extract-quotes.mjs`가 **영문 MDX**에서 OSHA 인용 26개 추출 → `quotes.json` |

**확정 결정** (사용자 협의, 2026-06-02):
1. 한글 본문: **AI 초벌 번역 + 사람 검수**
2. 전환 UX: **인페이지 토글 버튼 (같은 URL, localStorage 기억)**
3. 범위: **Part 1A 파일럿 먼저** (검증 후 나머지 4 Part는 후속 사이클)

---

## 2. 목표 / 비목표

### 목표
- Part 1A의 한글 번역본을 영문과 짝으로 추가.
- 같은 URL에서 EN ↔ 한국어 본문을 즉시 전환하는 토글 UI.
- 언어 선택의 localStorage 영속화.
- 번역본 부재 Part에 대한 안전한 fallback(영문 단독 노출).
- 토글/로더 메커니즘을 5 Part·향후 소스로 확장 가능하게 설계.

### 비목표 (이번 사이클 제외)
- Part 1B/2/3/4 한글 번역 (후속 사이클).
- 사이트 전역 i18n(헤더/푸터/UI 라벨 다국어화) — OSHA 본문 한정.
- 한글 인용의 `quotes.json` 인덱싱 — 파일럿은 **영문 기준 인덱스 유지**.
- 책(EPI_BOOK) 영문화 등 역방향 번역.
- URL 라우팅 분리(`/ko`)·SEO hreflang — 토글 방식 채택으로 비대상.

---

## 3. 기능 요구사항 (FR)

| ID | 요구사항 | 우선순위 |
|----|----------|:---:|
| FR-1 | `part-1a` 한글 번역 MDX를 영문과 동일 구조(헤딩·열거·표)로 작성 | P0 |
| FR-2 | `oshaMdx` 로더를 `(partId, lang)` 시그니처로 확장, 언어별 로더 맵 보유 | P0 |
| FR-3 | 한글 로더 부재 시 영문으로 graceful fallback (에러 없이) | P0 |
| FR-4 | `[part]/page.tsx`가 영/한 두 본문을 모두 빌드 타임 렌더 → 클라이언트 토글에 전달 | P0 |
| FR-5 | `LanguageToggle` 클라이언트 컴포넌트: `[EN] [한국어]` 버튼, aria-pressed, 활성 본문만 표시 | P0 |
| FR-6 | 선택 언어를 `localStorage`에 저장하고 마운트 시 복원 (기본값 한국어) | P1 |
| FR-7 | 번역본 있는 Part만 토글 노출, 없으면 토글 숨김 + 영문 단독 | P0 |
| FR-8 | 헤더 안내 문구를 선택 언어에 맞게 조건부 표기(영문/한글 출처 안내) | P2 |

## 4. 비기능 요구사항 (NFR)

| ID | 요구사항 |
|----|----------|
| NFR-1 | 정적 export(`output: 'export'`) 호환 — 서버 런타임/쿼리 의존 금지 |
| NFR-2 | `npm run typecheck` + `npm run lint` + `npm run build` 무오류 |
| NFR-3 | `quotes.json`/`cross-link.json` 산출물 회귀 0 (영문 기준 인덱스 유지) |
| NFR-4 | 접근성: 토글 버튼 키보드 조작·focus-visible·aria-pressed (Chip 패턴 준수) |
| NFR-5 | 확장성: 5 Part / 신규 소스 추가 시 컴포넌트 코어 수정 없이 MDX+로더 등록만으로 동작 |
| NFR-6 | 다크모드 일관 + prose 스타일 영/한 동일 적용 |
| NFR-7 | 번들 증가 최소화 (Part 1A 두 언어 본문 추가분 한정) |

---

## 5. 구현 범위 (파일)

| 구분 | 파일 | 작업 |
|------|------|------|
| 신규 | `src/content/sources/osha-scs/part-1a.ko.mdx` | 한글 번역본 (AI 초벌 + 검수) |
| 신규 | `src/components/sources/LanguageToggle.tsx` | 클라이언트 토글 (Chip 재사용) |
| 수정 | `src/lib/oshaMdx.tsx` | `(partId, lang)` 로더 + 한글 맵 + fallback + `hasOshaScsKo(partId)` 헬퍼 |
| 수정 | `src/app/sources/osha-scs/[part]/page.tsx` | 영/한 본문 로드 → LanguageToggle 통합, 안내 문구 조건부 |
| (조건) | `src/lib/types.ts` / `sources.ts` | section별 번역 가용성 메타 필요 시 (설계에서 판단) |

> 빌드 산출물(`quotes.json` 등)은 직접 수정 금지. 파이프라인 변경 없음.

---

## 6. 리스크

| ID | 리스크 | 대응 |
|----|--------|------|
| R-1 | RSC에서 MDX `ComponentType`를 클라이언트로 직접 전달 불가 | 서버에서 두 본문을 JSX로 렌더, 클라이언트 토글은 **show/hide 제어**(children 패턴) |
| R-2 | 두 언어 동시 DOM 렌더로 본문 2배 → 번들/DOM 증가 | 파일럿 1 Part 한정으로 영향 측정, 비활성 본문 `hidden` 처리 |
| R-3 | AI 번역 품질(전문 용어·안전 문구 오역) | 사람 검수 단계 필수, 책 용어집/`terms.json` 대조, 안전 지침은 직역 우선 |
| R-4 | localStorage 접근(SSR/정적) 시 hydration 불일치 | `useEffect` 마운트 후 복원, 초기 렌더는 기본 언어 고정 |
| R-5 | 번역본 없는 Part에서 토글 노출되어 빈 화면 | FR-7 가용성 검사로 토글 자체 미노출 |

---

## 7. 완료 정의 (DoD)

- [ ] Part 1A에서 `[EN] [한국어]` 토글로 본문 즉시 전환 동작
- [ ] 선택 언어 localStorage 영속 (재방문·새로고침 유지)
- [ ] 한글 번역 헤딩/열거 구조가 영문과 1:1 대응
- [ ] 번역본 없는 4 Part는 영문 단독, 토글 미노출 (회귀 없음)
- [ ] typecheck + lint + build 무오류, quotes/cross-link 산출물 불변
- [ ] 접근성: 키보드·aria-pressed·focus-visible 검증 (Playwright 스냅샷)
- [ ] Gap 분석 Match Rate ≥ 90%

---

## 8. 다음 단계

→ `/pdca design osha-bilingual-toggle` — RSC children 토글 패턴 / 로더 시그니처 / MDX 네이밍 규약 / 확장 경로(5 Part) 확정
