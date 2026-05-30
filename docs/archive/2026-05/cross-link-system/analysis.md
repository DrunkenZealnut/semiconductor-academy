---
template: analysis
version: 1.0
description: PDCA Check — cross-link-system (Extensibility-first 검증, FR-12 deferred)
variables:
  feature: cross-link-system
  date: 2026-05-30
  author: gap-detector
  matchRate: 100
  scope: "11 in-scope FR (FR-12 deferred)"
---

# cross-link-system Gap Analysis Report

> **Phase**: PDCA Check
> **Scope**: In-scope FR (FR-12 의도적 deferred)
> **Branch**: `feat/cross-link-system`
> **Date**: 2026-05-30
> **Analyst**: gap-detector agent

---

## 1. Executive Summary

**Match Rate: 100% (11/11 in-scope FR)** — FR-12 `/quotes` source 필터는 Plan §3.1에서 Low priority + 의도적 deferred로 명시되어 분모에서 제외. In-scope 11개 FR 모두 코드에 1:1 매핑되며 Design §1.1 Extensibility 5원칙도 코드·아티팩트에 정확히 반영.

| Category | Score | Status |
|----------|:-----:|:------:|
| FR 매핑 (in-scope 11개) | 100% | ✅ |
| Architecture Decisions (§6.2) | 100% | ✅ |
| Extensibility 5원칙 | 100% | ✅ |
| Convention/YAGNI 준수 | 100% | ✅ |
| **Overall** | **100%** | **✅** |

**Extensibility 5원칙 검증 한 줄 요약**:
Manifest-driven discovery · schema-enum 미러 · source-count-agnostic UI · graceful chemical degradation · schema versioning 모두 코드에 1:1 반영되었고, Design §11.3 extensibility test 실증 통과 (test-source add → 3 sources 자동 발견 → remove → 2 sources 자동 정리, **코어 코드 0줄 수정**).

---

## 2. FR 매핑 매트릭스 (FR-01 ~ FR-12)

| FR | 요구사항 | 구현 위치 | 검증 |
|:---:|---------|---------|:---:|
| FR-01 | Topic/Hazard enum + 타입 | `src/lib/cross-link/schema.ts` (TOPICS 23개, HAZARDS 12개, 모든 인덱스 타입) | ✅ |
| FR-02 | 책 17 챕터 ≥1축 태그 | `src/data/_book-links.json` — 17개 챕터 키 모두 존재, 각 ≥1축 | ✅ |
| FR-03 | OSHA 5 Part ≥1축 태그 | `src/content/sources/osha-scs/_links.json` — part-1a/1b/2/3/4 모두 ≥1축 | ✅ |
| FR-04 | 빌드 스크립트 + prebuild 훅 | `scripts/build-cross-link-index.mjs` + `package.json:prebuild`/`predev`에 `extract:quotes && build:cross-link` 순서 | ✅ |
| FR-05 | enum 위반 빌드 실패 + 어휘 출력 | `build-cross-link-index.mjs:178-247` (errors 누적 → exit 1 + Available topics/hazards 출력 + Levenshtein suggest) | ✅ |
| FR-06 | lookup API | `src/lib/cross-link/lookup.ts` — `lookupRelated`, `lookupByChemical`, `getCrossLinkSchemaVersion`, `getUnknownChemicals` 4개 export | ✅ |
| FR-07 | RelatedFromOtherSources (그룹화·0건 숨김·공유태그) | `RelatedFromOtherSources.tsx:25` `if (groups.length === 0) return null` + 그룹별 SourceBadge + RelatedItemCard chip | ✅ |
| FR-08 | 책↔OSHA 양방향 패널 | `chapter/[slug]/page.tsx:50` + `sources/osha-scs/[part]/page.tsx:103` 양방향 삽입 | ✅ |
| FR-09 | ChemicalSourceHub + chemicals 통합 | `ChemicalSourceHub.tsx` + `chemicals/[id]/page.tsx:116` | ✅ |
| FR-10 | 런타임 fetch 0회 | `lookup.ts:13` `import crossLinkData from '@/data/cross-link.json'` (정적 import only) | ✅ |
| FR-11 | 양방향 링크 ≥20쌍 | 빌드 로그 `bidirectional tag-edges: 80` (DoD 4배 초과) | ✅ |
| **FR-12** | `/quotes` source 필터 | **Deferred** — Plan §3.1 Low priority, Do progress.step15 의도적 보류. 별 cycle/polish로 분리 | ⏭️ |

**in-scope 11/11 = 100%**

---

## 3. Extensibility 검증 (Design §1.1 5원칙 × §11.3 실증)

| 원칙 | 코드 반영 | 실증 |
|------|----------|------|
| 1. **Manifest-driven discovery** | `build-cross-link-index.mjs:134-146` `readdirSync(OTHER_SOURCES_DIR)` glob | test-source add → 자동 발견, remove → 자동 제거 |
| 2. **Single source of truth** | `schema.ts` ↔ `schema-enum.json` 양방향 미러 + 헤더 주석 경고 + 빌드 시 version 일치 검증(`build:107-112`) | 어휘 확장은 두 파일만 수정 |
| 3. **Source-count-agnostic UI** | `lookup.ts` `getOrderedSources()` 동적, `RelatedItemCard:18-25` accent fallback to `standard` | 2→3 sources 변화 시 컴포넌트 무수정 |
| 4. **Graceful degradation** | `build-cross-link-index.mjs:207-215` unknown chemical 경고+stub 유지, `RelatedItemCard:60` 미등록 chip muted+회색 | unknown chemicals 0건 (clean), 회로 동작 |
| 5. **Schema versioning** | `schema.ts:137` `CROSS_LINK_SCHEMA_VERSION = 1`, `cross-link.json.version: 1`, `lookup.ts:30` mismatch warning | version drift 자동 감지 |

### §11.3 Extensibility Test 실증 결과

```
✓ test-source 추가  → 3 sources (자동 발견), 85 edges
✓ test-source 제거  → 2 sources (자동 정리), 80 edges
✓ 코어 코드 변경    → 0줄 (build script, lookup, 컴포넌트 모두 무수정)
```

**향후 SEMI·KOSHA 추가 경로 사전 검증 완료** — Design §4.3의 5단계 onboarding 워크플로가 실증됨.

---

## 4. Architecture Decisions 검증 (Design §6.2)

| Decision | 선택 | 코드 검증 |
|----------|------|----------|
| 태그 위치 = 별도 `_links.json` | OK | `_book-links.json`, `osha-scs/_links.json` 분리 |
| JSON으로 빌드/런타임 공유 (.mjs ↔ .ts 우회) | OK | `schema-enum.json` 미러 + .mjs는 JSON만 import |
| 인덱스 구조 `bySection` + `byTopic/Hazard/Chemical` | OK | `cross-link.json`에 4축 모두 존재, lookup.ts O(1) 양방향 조회 |
| 통합 패널 컴포넌트 (per-source 아님) | OK | `RelatedFromOtherSources` 1개로 그룹화 처리 |
| `ChemicalSourceHub` 별도 컴포넌트 | OK | 신규 컴포넌트 + 화학물질 페이지 통합 |
| enum 위반 → exit 1 | OK | `build:237-248` 검증 |
| chemical 미존재 → 경고만 | OK | `build:209-211` `unknownChemicals.add` (no error) |

**8/8 architecture decisions 모두 코드에 반영**.

---

## 5. Convention / YAGNI 준수

- **kebab-case enum/source ID**: 모든 TOPICS/HAZARDS/section ID 일관
- **PascalCase 컴포넌트**: `RelatedFromOtherSources`, `ChemicalSourceHub`, `RelatedItemCard`
- **디자인 토큰 재사용**: `border-brand-*`, `border-emerald-*`, `dark:bg-slate-900/40` 등 기존 토큰만 사용 (신규 토큰 0)
- **YAGNI**: Plugin system·LLM 자동 태깅·자료원 추가 등 Plan §2.2 out-of-scope 침범 없음. accent fallback도 `Record + ACCENT_FALLBACK = ACCENT_CARD.standard` 1줄 fallback으로 단순 처리 (과도한 추상화 회피)
- **신규 ENV 0개**: package.json·env 변경 없음

위반 0건.

---

## 6. 빌드 통계 검증

| 항목 | 보고값 | 검증 |
|------|--------|:---:|
| sources | 2 | `cross-link.json.sources: ["epi-semi-hazards","osha-scs"]` ✅ |
| sections | 22 | 17 (book) + 5 (OSHA) = 22 ✅ |
| topics (cumulative) | 46 | 빌드 로그 ✅ |
| hazards (cumulative) | 30 | 빌드 로그 ✅ |
| chemicals (cumulative) | 59 | 빌드 로그 ✅ |
| bidirectional tag-edges | 80 | DoD ≥20 대비 4배 초과 ✅ |
| unknown chemicals | 0 | `"unknownChemicals": []` ✅ |

---

## 7. Critical / Major / Minor 이슈

### Critical (즉시 수정 필요)
- **없음**

### Major (다음 cycle 전 권장)
- **없음**

### Minor (선택적 개선)

1. **M1 (informational)** — Design §3.1 주석은 "현재 21개 Topic"이지만 실제 `schema.ts`는 23개 (cleanroom 등 추가 시점에 늘어남). Plan §6.2 ≤22 한도와의 정합성: Plan Risk Mitigation에서 "본 cycle 내 어휘 확장 1회 허용" 명시했으므로 정책 위반 아님. Design 헤더 주석을 23개로 업데이트하면 추적성↑. (action: optional doc touch-up)

---

## 8. 권장 다음 단계

Match Rate 100% (in-scope) 달성 → DoD 모두 충족.

```
1. /pdca report cross-link-system
   - Lessons Learned 포함 권장:
     · Extensibility-first 설계의 ROI (Phase split → 독립 cycle → manifest 패턴 정착)
     · schema.ts ↔ schema-enum.json 수동 미러의 비용/이득
     · bidirectional tag-edges 80 (DoD 4배) 달성 요인 = 3축 동시 사용

2. /pdca archive cross-link-system --summary
   - 메트릭 보존 (다음 cycle이 본 archive를 상속점으로 참조)

3. 다음 cycle 후보 (우선순위 순):
   a. quotes-source-filter (FR-12 polish, 30~45m)
   b. semi-s2-source 또는 kosha-guide-source (manifest-driven 경로 실전 활용)
   c. Topic/Hazard 어휘 확장 micro-PR
```

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-30 | gap-detector 분석: 100% (in-scope 11 FR), Extensibility 5원칙 + §11.3 test 실증 통과, Critical/Major 0 | gap-detector agent |
