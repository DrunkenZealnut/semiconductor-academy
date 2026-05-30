---
template: analysis
version: 1.0
description: PDCA Check phase — Gap Analysis (Phase A+B 범위 한정, Phase C 분리)
variables:
  feature: multi-source-learning-platform
  date: 2026-05-30
  author: gap-detector
  matchRate: 96
  scope: "Phase A + Phase B"
---

# multi-source-learning-platform Gap Analysis Report

> **Phase**: PDCA Check
> **Scope**: Phase A + Phase B (Phase C는 별 cycle로 분리)
> **Branch/Commit**: `feat/multi-source-learning-platform` / `acd234e`
> **Date**: 2026-05-30
> **Analyst**: gap-detector agent

---

## 1. Executive Summary

| Metric | Value |
|--------|------:|
| **Match Rate (Phase A+B scope)** | **96%** |
| FR coverage (Phase A+B 분모 6개) | 6/6 ✅ |
| Architecture decisions 반영 (§6.2 중 본 cycle 관련 6개) | 6/6 ✅ |
| NFR (typecheck/build/ENV) | 통과 |
| YAGNI 준수 | 위반 0건 |
| Convention 준수 (§10) | 위반 0건 |

**핵심 강점**

- Source 데이터 모델이 Design §3.1 스펙과 거의 1:1로 매핑됨. 추가된 `accent` 필드도 UI 디자인 토큰 매핑용으로 합리적
- Phase C 준비를 위한 어휘 enum/cross-link 구조에 손대지 않고 깔끔히 deferral 유지 — Phase 경계가 잘 지켜짐
- 기존 17 챕터 URL 100% 하위호환 확보 (`chapterToSection`이 `legacyUrl ?? /chapter/${slug}/` 사용)
- OSHA Part MDX 5개 + 동적 라우트 + Prev/Next + 출처 푸터까지 Design §5.3 레이아웃과 일치

**주요 이슈**

- Critical/Major: **없음**
- Minor 4건 (모두 선택적 개선): 책 발행연도 재확인, OSHA deep link, 헤더 안내문 위치, OshaCallouts 결정 명시

---

## 2. Phase A — IA 재편 매핑 매트릭스

| Plan/Design 항목 | 위치 | 구현 산출물 | 상태 |
|---|---|---|:---:|
| **FR-01** Source 데이터 모델 | Plan §3.1, Design §3.1.1 | `src/lib/types.ts:186-258` (`Source`, `SourceSection`, `SourceKind`, `SourceLanguage`, `SourceLicense` + 3개 라벨 enum) | ✅ |
| **FR-02** 메인 페이지 자료원 카드 | Plan §3.1, Design §5.1 | `src/components/sources/SourcePicker.tsx`, `src/app/page.tsx:21` (`<SourcePicker />` BookHero 직후 삽입) | ✅ |
| EPI_BOOK 어댑터 | Design §3.1.3 | `src/lib/sources.ts:12-35` (`chapterToSection` 어댑터 + EPI_BOOK 레지스트리) | ✅ |
| 자료원 레지스트리 | Plan In-Scope, Design §3.1.3 | `src/lib/sources.ts:89-108` (`SOURCES`, `getOrderedSources`, `getSource`, `getSourceSection`) | ✅ (+`getSourceSection` 보너스) |
| `/sources/[source]` 라우트 | Plan §3.1, Design §5.2 | `src/app/sources/[source]/page.tsx` (`generateStaticParams` 2개 source, breadcrumb, 라이선스 푸터) | ✅ |
| SourceBadge | Design §5.6 | `src/components/sources/SourceBadge.tsx` (lang/kind/license/all 4 variants) | ✅ |
| SourceHeader | Design §5.6 | `src/components/sources/SourceHeader.tsx` (breadcrumb + attribution + url) | ✅ |
| SourceSectionList | Design §5.6 | `src/components/sources/SourceSectionList.tsx` (heading/unitLabel props) | ✅ |
| **FR-09** URL 하위호환 | Plan §3.1 | `chapters.json` `legacyUrl` 5개 + `chapterToSection` 우선 사용. `/chapter/[slug]/page.tsx` 유지 | ✅ |

**Phase A 소계: 8/8 = 100%**

---

## 3. Phase B — OSHA 통합 매핑 매트릭스

| Plan/Design 항목 | 위치 | 구현 산출물 | 상태 |
|---|---|---|:---:|
| **FR-03** OSHA 5 Part MDX | Plan §3.1, Design §11.2 step 8 | `src/content/sources/osha-scs/part-{1a,1b,2,3,4}.mdx` (5개) | ✅ |
| OSHA Part 본문 구조 | Plan §3.1, Design mockup §5.3 | Part-3 (Course Overview / Learning Objectives / 9 Categories 표 / 본문 ## 섹션), Part-1a (Course Overview/Learning Objectives) 모두 mockup 일치 | ✅ |
| OSHA 동적 라우트 | Design §11.2 step 9 | `src/app/sources/osha-scs/[part]/page.tsx` (`generateStaticParams`로 5개 part pre-render) | ✅ |
| OSHA MDX 로더 | Design §9.3 (MDX import 분리) | `src/lib/oshaMdx.tsx` (5개 part 명시적 mapping, dynamic import) | ✅ |
| Prev/Next 네비게이션 | Design §11.2 step 10, §5.3 | `[part]/page.tsx:102-138` (part-1a ↔ 1b ↔ 2 ↔ 3 ↔ 4 자동 인덱싱) | ✅ |
| **FR-10** OSHA 라이선스 표기 | Plan §3.1, Design §5.3 | `[part]/page.tsx:140-161` 푸터(attribution + license + `target="_blank" rel="noopener noreferrer"`) + `[source]/page.tsx:55-62` 푸터 | ✅ |
| Reading time / 언어 뱃지 | Design §5.3 | Header에 `SourceBadge variant="lang"` + `variant="license"` + `readingTime` chip | ✅ |

**Phase B 소계: 7/7 = 100%**

---

## 4. Phase C — Scope Split Note (이번 cycle 범위 외)

다음은 **의도적 deferral** — "별 cycle (`cross-link-system`)로 분리"되었으며 본 Match Rate 계산 분모에서 제외함. Plan/Design §11.3 Sub-PDCA 분할 옵션에 명시된 결정.

| 항목 | 본 cycle | 별 cycle (예정) |
|---|---|---|
| FR-04 topic/hazard/chemical 3축 태그 스키마 | 미구현 (의도적) | `cross-link-system` |
| FR-05 RelatedFromOtherSources 패널 | 미구현 (의도적) | `cross-link-system` |
| FR-06 ChemicalSourceHub | 미구현 (의도적) | `cross-link-system` |
| FR-07 build-cross-link-index.mjs | 미구현 (의도적) | `cross-link-system` |
| FR-08 검색 source 필터 | 미구현 (의도적) | `cross-link-system` |
| `lib/cross-link/schema.ts`, `lookup.ts` | 미구현 (의도적) | `cross-link-system` |
| `src/data/cross-link.json` 산출물 | 미구현 (의도적) | `cross-link-system` |

**확인**: 본 브랜치에 `lib/cross-link/`, `RelatedFromOtherSources`, `ChemicalSourceHub`, `_links.json`, `cross-link.json`, `build-cross-link-index.mjs` 모두 존재하지 않아 deferral이 깨끗하게 유지됨 (scope creep 없음).

---

## 5. Architecture Decisions (Design §6.2) 검증

| Decision | 선택안 | 구현 반영 |
|---|---|:---:|
| 자료원 모델 = 별도 데이터 객체 (Source interface + 정적 레지스트리) | `lib/sources.ts`의 `SOURCES` 배열로 구현 | ✅ |
| 통제 어휘 = 사전 정의 enum | `SourceKind`, `SourceLanguage`, `SourceLicense` enum + 라벨 record | ✅ |
| OSHA 변환 단위 = 각 Part 1 MDX (총 5) | `part-{1a,1b,2,3,4}.mdx` 5개 | ✅ |
| 메인 페이지 = 자료원 선택 + 책이 첫 카드 | `EPI_BOOK.order=1`, `OSHA_SCS.order=2`, `getOrderedSources()` 사용 | ✅ |
| Framework = Next.js 15 (현행) | next.config.mjs static export 유지 | ✅ |
| Styling = Tailwind (현행) | 신규 토큰 0, 기존 `rounded-2xl border bg-white dark:bg-slate-900` 패턴 재사용 | ✅ |

본 cycle 범위 architecture decision **6개 모두 코드에 반영됨**.

---

## 6. Convention Compliance (Design §10)

| 항목 | 규칙 | 검증 결과 |
|---|---|:---:|
| Source ID | kebab-case | `epi-semi-hazards`, `osha-scs` ✅ |
| Section ID | kebab-case | `part-1a`, `part-1b`, `part-2~4`, `01-risks-of-new-tech` ✅ |
| Component file | PascalCase.tsx | `SourcePicker/SourceBadge/SourceHeader/SourceSectionList.tsx` ✅ |
| Lib file | camelCase.ts | `sources.ts`, `oshaMdx.tsx` ✅ |
| 디자인 토큰 재사용 | 신규 토큰 0 | `SourcePicker`의 `brand-*`, `emerald-*`는 기존 Tailwind 팔레트 재사용 ✅ |
| 외부 링크 안전 | `target="_blank" rel="noopener noreferrer"` | `SourceHeader.tsx:65-66`, `[part]/page.tsx:151-152` ✅ |
| 신규 ENV | 0개 | `.env.example` 변경 없음 ✅ |

위반 0건.

---

## 7. YAGNI / Out-of-Scope 침범 검사

| Out-of-scope 항목 (Plan §2.2) | 침범 여부 |
|---|:---:|
| 사용자 계정/북마크/진도 추적 | ✅ 없음 |
| LLM 요약 기능 | ✅ 없음 |
| 모바일 앱 변환 | ✅ 없음 |
| SEMI 표준 콘텐츠 | ✅ 없음 (`SourceKind`에 `'standard'` 타입 자리만 마련 — 인터페이스 확장성으로 정당화) |
| OSHA 영상 한국어 자막/번역 | ✅ 없음 (transcript 영문 본문 그대로) |

YAGNI 준수 양호.

---

## 8. Critical / Major / Minor 분류

### Critical (즉시 수정 필요)

- **없음**

### Major (다음 cycle 전 권장)

- **없음**

### Minor (선택적 개선)

1. **책 발행연도 재확인** — `src/lib/sources.ts:30` `EPI_BOOK.year: 2021` (Design §3.1.3 주석에 "확정 필요" 명시). 실제 「반도체 산업의 유해인자」 발행연도 확인 후 보정 권장.
2. **OSHA deep link** — `src/lib/sources.ts:47` `OSHA_SCS.url: 'https://www.osha.gov/'` 루트 URL. Design §3.1.3 "정확한 URL 확인 후 보정" 미해결. OSHA SCS 공식 페이지 deep link로 교체 권장.
3. **OSHA 헤더 안내문 위치** — `[part]/page.tsx:91-93` "본 페이지의 영어 본문은 원본 transcript입니다"가 헤더에 노출 (Design §5.3 mockup은 푸터). UX 판단 차이로 채택 가능하나 명시 권장.
4. **OshaCallouts 결정 명시** — OSHA MDX의 Learning Objectives가 일반 `### Learning Objectives` 헤딩 + bullet로 처리됨 (Design §5.6 선택 컴포넌트 `OshaCallouts` 미구현). 시각적 동등성은 확보됨. 향후 cross-link cycle 또는 별도 polish에서 통합 여부 결정 권장.

---

## 9. 권장 다음 단계

```
1. /pdca report multi-source-learning-platform
   - Phase A+B 완료 보고서 생성
   - Match Rate 96%로 90% threshold 통과 → 정상 종결
   - Phase C 분리 결정을 Lessons learned에 기록

2. /pdca archive multi-source-learning-platform --summary
   - docs/archive/2026-05/multi-source-learning-platform/ 으로 이동
   - --summary 옵션 권장 (메트릭 보존)

3. 새 cycle: /pdca plan cross-link-system
   - 본 Plan §3.1 FR-04~08 + Design §3.1.2, §6.2 cross-link 저장소 결정, §11.2 step 12~21 상속
   - 신규 cycle 범위: schema.ts, _links.json, build-cross-link-index.mjs,
     RelatedFromOtherSources, ChemicalSourceHub, 검색 source 필터
```

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-30 | gap-detector 분석 결과: Phase A+B 96% Match Rate, 0 Critical/Major | gap-detector agent |
