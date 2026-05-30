# Archive: cross-link-system

> 자료원 간 의미적 연결망 구축 — Extensibility-first 5원칙으로 향후 자료원 추가가 코어 코드 0줄 수정으로 가능한 시스템 완성.

**Archived**: 2026-05-30
**Phase**: completed
**Match Rate**: 100% (in-scope 11 FR, FR-12 deferred)
**Iteration**: 0 (첫 통과)
**Duration**: ~1.5시간 (Plan → Report)
**Level**: Dynamic
**Branch**: `feat/cross-link-system`
**Inherits**: [multi-source-learning-platform archive](../multi-source-learning-platform/) (Phase A+B 96%)

---

## 결과 요약

| 지표 | 결과 |
|------|:---:|
| Design Match Rate | 100% (in-scope) |
| FR coverage | 11/11 ✅ (FR-12 deferred to polish) |
| Architecture decisions 반영 | 8/8 ✅ |
| Extensibility 5원칙 | 5/5 ✅ + §11.3 test passed |
| Convention Compliance | 100% |
| Critical / Major / Minor | 0 / 0 / 1 |
| typecheck / build | 모두 통과 (무경고) |
| 기존 URL 회귀 | 0건 |

---

## 구현 산출물

### Schema + Data

| 종류 | 파일 | 비고 |
|------|------|------|
| 신규 | `src/lib/cross-link/schema.ts` | Topic 23개, Hazard 12개 enum + 모든 인덱스 타입 + `CROSS_LINK_SCHEMA_VERSION` |
| 신규 | `src/data/schema-enum.json` | 빌드 스크립트용 미러 (`.mjs ↔ .ts` 우회) |
| 신규 | `src/data/_book-links.json` | 책 17 챕터 3축 태깅 매트릭스 |
| 신규 | `src/content/sources/osha-scs/_links.json` | OSHA 5 Part 3축 태깅 |
| 신규 (빌드 산출물) | `src/data/cross-link.json` | bySection + byTopic + byHazard + byChemical + unknownChemicals |

### Build

| 종류 | 파일 | 비고 |
|------|------|------|
| 신규 | `scripts/build-cross-link-index.mjs` | Glob 자동 발견 + enum 검증 (Levenshtein suggest) + 양방향 인덱스 |
| 수정 | `package.json` | `prebuild`/`predev`에 `build:cross-link` 추가 (extract-quotes 다음) |

### Runtime

| 종류 | 파일 | 비고 |
|------|------|------|
| 신규 | `src/lib/cross-link/lookup.ts` | `lookupRelated` + `lookupByChemical` + `getCrossLinkSchemaVersion` + `getUnknownChemicals`, 같은 source 자기 참조 제외 + shareScore 정렬 |

### UI Components

| 종류 | 파일 | 비고 |
|------|------|------|
| 신규 | `src/components/cross-link/RelatedItemCard.tsx` | 단일 카드, accent 토큰 동적, 공유 태그 chip (topic/hazard/chemical 3색) |
| 신규 | `src/components/cross-link/RelatedFromOtherSources.tsx` | 자료원별 그룹 패널, 0건 시 `null` 반환 |
| 신규 | `src/components/cross-link/ChemicalSourceHub.tsx` | 화학물질 페이지의 자료원 통합 허브 |

### Page Integration

| 종류 | 파일 | 비고 |
|------|------|------|
| 수정 | `src/app/chapter/[slug]/page.tsx` | `<RelatedFromOtherSources sourceId="epi-semi-hazards" ... />` 삽입 |
| 수정 | `src/app/sources/osha-scs/[part]/page.tsx` | `<RelatedFromOtherSources sourceId="osha-scs" ... />` 삽입 |
| 수정 | `src/app/chemicals/[id]/page.tsx` | `<ChemicalSourceHub chemicalId={...} />` 삽입 |

### 합계

- 신규: 11 파일 / 수정: 4 파일
- 신규 lib: 2 (schema, lookup)
- 신규 components: 3
- 신규 data: 4 (schema-enum, _book-links, OSHA _links, cross-link 산출물)
- 신규 script: 1

---

## 빌드 통계 (검증값)

```
[build-cross-link] discovered 2 source(s): epi-semi-hazards, osha-scs
[build-cross-link] scanned 22 section(s)
[build-cross-link] tagged: topics 46, hazards 30, chemicals 59
[build-cross-link] bidirectional tag-edges (book ↔ other): 80
```

- 양방향 tag-edges: **80** (DoD ≥20 대비 **4배 초과**)
- Unknown chemicals: **0** (chemicals.json 매핑 완벽)
- Enum 위반: 0
- 신규 ENV: 0개

---

## Extensibility 5원칙 — 코드 위치 + 검증

| 원칙 | 코드 위치 | 검증 |
|------|-----------|------|
| 1. Manifest-driven discovery | `build-cross-link-index.mjs:134-146` `readdirSync` glob | test-source add/remove 실증 |
| 2. Single source of truth | `schema.ts` ↔ `schema-enum.json` 미러 + 빌드 version 일치 검증 | 어휘 확장은 두 파일만 수정 |
| 3. Source-count-agnostic UI | `lookup.ts` `getOrderedSources()` 동적 + `RelatedItemCard` accent fallback | 자료원 수 변화에 무관 |
| 4. Graceful degradation | `build:207-215` unknown chemical stub + 경고, `RelatedItemCard:60` muted chip | 회로 동작 검증 |
| 5. Schema versioning | `schema.ts:137` `CROSS_LINK_SCHEMA_VERSION = 1`, `lookup.ts:30` mismatch warning | drift 자동 감지 |

### §11.3 Extensibility Test 실증 결과

```
✓ test-source 추가  → 3 sources (자동 발견), 85 edges
✓ test-source 제거  → 2 sources (자동 정리), 80 edges
✓ 코어 코드 변경    → 0줄 (build script, lookup, 컴포넌트 모두 무수정)
```

→ **향후 SEMI·KOSHA 등 자료원 추가 onboarding 경로 사전 검증 완료**.

---

## PDCA 타임라인

| Phase | 산출물 |
|-------|--------|
| **Plan** | plan.md — 3축 통제 어휘, 12 FR (FR-12 deferred 명시), 양방향 ≥20 목표, 사용자 추가 요구 "확장성"을 작업 범위에 반영 |
| **Design** | design.md — 사용자 추가 요구를 **Extensibility-first 5원칙**으로 직접 변환, 5단계 onboarding 워크플로 명문화 (§4.3) |
| **Do** | 5 Group 분할 (Schema+Data → Build → Runtime+Components → Page Integration → Verification), §11.3 Extensibility test 실증 통과 |
| **Check** | analysis.md — gap-detector 100% (in-scope), Extensibility 5원칙 모두 검증, Critical/Major 0 |
| **Report** | report.md (19,677 bytes) — Executive Summary 3개 표 + Lessons Learned 5가지 |
| **Archive** | 본 폴더 |

---

## 핵심 학습 (Lessons Learned)

1. **Extensibility-first 설계의 ROI** — 사용자가 Design 단계에서 명시한 "향후 자료 추가 감안" 요구가 5원칙으로 구체화되어 코드에 직접 반영. test-source 실증으로 ROI 검증. 향후 SEMI·KOSHA 추가 시 발생할 비용을 본 cycle 1.5h에 사전 지불.

2. **Phase split (sub-PDCA) 패턴 정착** — 직전 cycle `multi-source-learning-platform`에서 Phase C 분리한 결정이 본 cycle로 자연스럽게 연결. cycle 단위가 작아져 (1.5h, Match Rate 100%) 검증 주기 단축. 큰 작업의 정석 패턴.

3. **schema.ts ↔ schema-enum.json 수동 미러의 비용/이득** — `.mjs`가 `.ts` import 불가 문제를 자동 생성 도구 대신 수동 미러로 우회. enum 변경 빈도(연 수회) 대비 자동화 비용 > 이득. **YAGNI 모범 적용**. 단, build 단계에서 version 일치 검증 추가로 drift 방지.

4. **3축 동시 사용의 효과** — bidirectional tag-edges 80건은 topic+hazard+chemical 3축 동시 사용 결과 (DoD ≥20의 4배). 단일 축으로는 ~20건 예상. **매트릭스 풍부도 = 사용자 가치**(다양한 진입점).

5. **Manifest-driven discovery 실증 가치** — test-source add/remove를 cycle 안에서 직접 실행. "확장성을 설계했다"가 아니라 "확장성이 실제로 작동한다"를 검증. 향후 PDCA에서도 핵심 설계 결정은 dummy test로 실증할 것.

---

## Minor 1건 (선택적, 후속 처리 가능)

**M1 (informational)** — `Design §3.1` 주석은 "현재 21개 Topic"이지만 실제 `schema.ts`는 23개. Plan §6.2 ≤22 한도와의 정합성: Plan Risk Mitigation에서 "본 cycle 내 어휘 확장 1회 허용" 명시했으므로 정책 위반 아님. Design 헤더 주석을 23개로 update하면 추적성↑. (action: optional doc touch-up)

---

## 다음 cycle 후보

본 archive를 상속점으로 활용 가능한 cycle:

| 우선순위 | Cycle | 범위 |
|:---:|-------|------|
| **a** | `quotes-source-filter` | FR-12 polish (30~45m) — `/quotes` 검색에 source 필터 추가 |
| **b** | `semi-s2-source` 또는 `kosha-guide-source` | manifest-driven 경로 실전 활용 (확장성 ROI 회수, 5단계 onboarding 워크플로 실증) |
| **c** | Topic/Hazard 어휘 확장 micro-PR | schema.ts + schema-enum.json만 수정 |

---

## 신규 시스템 검증 가능한 경로

- `/chapter/diffusion-chapter/` 하단 → 🏛 OSHA Part 3 카드 (공유: gas-safety, pyrophoric, arsine·phosphine·diborane)
- `/sources/osha-scs/part-3/` 하단 → 📖 책 Ch.7, Ch.10, Ch.11 카드
- `/chemicals/silane/` → 📖 책 Ch.10 + 🏛 OSHA Part 3·Part 4
- `/chemicals/hydrofluoric-acid/` → 📖 책 Ch.6·Ch.9·Ch.14 + 🏛 OSHA Part 2·Part 3
- `/chapter/risks-of-new-tech/` → cross-link 0건 (industrial-hygiene만, OSHA 매핑 없음) → 패널 숨김 동작 확인 가능

---

## 참고

- Inherits: `docs/archive/2026-05/multi-source-learning-platform/` (직전 cycle Phase A+B, Source 모델 + OSHA 5 Part 통합)
- 원본 책: 「반도체 산업의 유해인자」 윤충식 외 6인 공저, 에피스테메
- OSHA 원본: U.S. OSHA Semiconductor Chemical Safety Part 1A/1B/2/3/4
- Archive 시점: 2026-05-30
