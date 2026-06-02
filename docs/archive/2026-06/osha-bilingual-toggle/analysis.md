# Gap Analysis — osha-bilingual-toggle

| 항목 | 값 |
|------|----|
| **분석 일자** | 2026-06-02 |
| **대상 Feature** | osha-bilingual-toggle (OSHA 자료 한/영 이중언어 토글) |
| **Phase** | Check (PDCA) |
| **Match Rate** | **97%** |
| **권고** | ✅ report 진행 (≥ 90% 통과) — iterate 불필요 |
| **분석 도구** | bkit:gap-detector |

---

## Executive Summary

Design의 4개 핵심 코드 블록(oshaMdx `(partId,lang)` 로더 / LanguageToggle / `[part]/page.tsx` 통합 / `.ko.mdx` 네이밍 규약)이 실제 구현과 거의 1:1로 일치한다. **FR 8/8, NFR 6.5/7, 설계구조 14/14** 충족. Blocker·Major Gap **0건**, Minor **2건**(모두 기능 결함이 아닌 빌드 증빙·주석 보강 항목). 프로젝트 제약 **6/6 준수**, 스코프 외 추가 구현 **0건**.

---

## 설계 항목 대조표 (요약)

| 분류 | 전체 | ✅ 구현 | 🟡 부분 | ❌ 미구현 | 가중 점수 |
|------|:---:|:---:|:---:|:---:|:---:|
| FR (기능 요구) | 8 | 8 | 0 | 0 | 8.0 |
| NFR (비기능 요구) | 7 | 6 | 1 | 0 | 6.5 |
| 설계 구조 (D) | 14 | 14 | 0 | 0 | 14.0 |
| **합계** | **29** | **28** | **1** | **0** | **28.5 / 29** |

### FR 전수 충족 ✅

| FR | 명세 | 구현 위치 | 상태 |
|----|------|----------|:---:|
| FR-1 | `.ko.mdx`가 영문본과 1:1 구조 | `part-1a.ko.mdx` | ✅ |
| FR-2 | `(partId, lang)` 시그니처 로더 | `oshaMdx.tsx` | ✅ |
| FR-3 | ko 부재 시 graceful fallback | `oshaMdx.tsx` `hasOshaScsKo` | ✅ |
| FR-4 | 빌드타임 양 언어 본문 렌더 | `[part]/page.tsx` (RSC) | ✅ |
| FR-5 | Chip `aria-pressed` 토글 | `LanguageToggle.tsx` | ✅ |
| FR-6 | localStorage 저장, 기본 ko | `LanguageToggle.tsx` | ✅ |
| FR-7 | ko 미보유 part는 토글 미노출 | `hasOshaScsKo` 가드 | ✅ |
| FR-8 | 헤더 고정 안내문구 → enNotice 이전 (텍스트 글자 단위 동일) | `[part]/page.tsx` | ✅ |

---

## Gap 리스트 (총 2건 — 전부 P2)

| ID | 우선순위 | Gap | 위치 | 권장 조치 |
|----|:---:|-----|------|-----------|
| M-1 | P2 | NFR-2/NFR-3 빌드·산출물 회귀 0 **실측 증빙 미첨부** | 검증 절차 | report 단계에서 `typecheck && lint && build` + `extract:quotes` 후 `git diff src/data/quotes.json`(=0) 캡처 |
| M-2 | P2 | `DEFAULT_LANG='ko'` **설계 근거 주석 부재** | `LanguageToggle.tsx:10` | "모국어 진입장벽 제거(Plan Core Value)" 1줄 주석 추가 (선택) |

> **P0/P1: 0건.** 두 Gap 모두 코드 결함이 아닌 문서·증빙 보강 항목.

### 핵심 Gap 3개 요약

1. **(M-1) 빌드/산출물 회귀 증빙 미동봉** — 정적 분석상 `extract-quotes.mjs`가 `${partId}.mdx`만 명시 join(L401)하고 `readdirSync`는 `CHAPTERS_DIR`(L430)에만 적용되어 `.ko.mdx`는 스캔 대상이 아님을 재확인. 회귀 리스크는 0이나, report에서 실측 diff 0을 첨부해 NFR-3 DoD를 닫아야 한다.
2. **(M-2) `DEFAULT_LANG` 근거 주석 부재** — 기본값 ko가 Plan Core Value(모국어 진입장벽 제거)에서 나왔으나 상수 정의부에 근거가 없어 후속 유지보수자의 오변경 위험. polish 수준.
3. **(부수 관찰) `src/data/cross-link.json` git status상 수정(M)** — 내용에 lang 필드가 전무하고 본 feature와 의미 연관 0. 직전 사이클 잔여 재생성/무관 변경 추정. report 단계에서 `npm run build:cross-link` 재실행 후 의도치 않은 diff 여부만 확인(M-1에 흡수).

---

## 프로젝트 제약 위반 — 0건

| 제약 | 판정 | 근거 |
|------|:---:|------|
| 정적 export (`output: 'export'`) | ✅ | 서버런타임/쿼리 의존 0, RSC 빌드타임 + 클라이언트 토글 |
| MDX 로더 레지스트리 패턴 | ✅ | `koLoaders` 등록, 직접 import 아님 |
| basePath | ✅ | 신규 라우트·asset 0 |
| 수동 미러 동기화 | ✅ | `OSHA_PART_META`·`schema-enum.json` 무변경 |
| 빌드 산출물 직접 수정 금지 | ✅ | `quotes.json` 스캔 대상 아님 → 회귀 0 |
| 3단 레이어 / 콘텐츠 규약 | ✅ | `.ko.mdx`가 영문 구조 1:1 유지 |

---

## 스코프 외 추가 구현 — 0건

Plan §5 파일 5개 + Design §9 구현 순서를 정확히 실현. bonus·범위 외 기능 0건. 조건부였던 `types.ts`/`sources.ts` 메타 추가는 Design이 "불필요"로 확정 → 미수정이 정답.

---

## Match Rate 계산

```
28.5 / 29 = 98.3%
→ 빌드 증빙 미첨부 반영하여 보수적 97% 표기
```

DoD "Match Rate ≥ 90%" 충족.

---

## 다음 단계 권장

**Match Rate 97% ≥ 90% → `/pdca report osha-bilingual-toggle`** (iterate 불필요).

### report 단계 보강 권장
1. `build` + `typecheck` + `lint` 로그 + **7 prerendered OSHA route 유지** 캡처
2. `extract:quotes` 후 `quotes.json` diff 0 증빙
3. `build:cross-link` 재실행 후 diff 확인 (cross-link.json 무관 변경 정리)
4. Playwright 접근성 실측 (QA 예정분 — `aria-pressed` 토글, localStorage 영속)
5. (선택) `DEFAULT_LANG` 근거 주석 추가 (M-2)

---

## 참조 파일

- **Design**: `docs/02-design/features/osha-bilingual-toggle.design.md`
- **Plan**: `docs/01-plan/features/osha-bilingual-toggle.plan.md`
- **구현**: `src/lib/oshaMdx.tsx`, `src/components/sources/LanguageToggle.tsx`, `src/app/sources/osha-scs/[part]/page.tsx`, `src/content/sources/osha-scs/part-1a.ko.mdx`
- **제약 검증 근거**: `scripts/extract-quotes.mjs` (L401 명시 join, L430 readdirSync=CHAPTERS_DIR)
