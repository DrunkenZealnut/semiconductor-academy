# Gap Analysis — `mainpage-restructure` (Check)

> **Feature**: `mainpage-restructure` · **분석일**: 2026-07-20 · **분석 주체**: `bkit:gap-detector`(독립 검증)
> **대조**: `docs/02-design/features/mainpage-restructure.design.md` ↔ 구현 8개 파일
> **상위**: Plan `docs/01-plan/features/mainpage-restructure.plan.md`(FR-1~6, NFR-1~5)

---

## Match Rate: **98% → 100%(G-1 해소 후)**

- **측정치 98%** (19.5 / 20 항목) — P0·하드 요구 전량 충족. 유일 감점은 문서-코드 문면 불일치 1건(G-1).
- **해소 후 100%** — G-1(설계 문언 `<a>` vs 구현 `<Link>`)을 gap-detector 권장안 ②(설계 문언을 코드에 정렬)로 처리. 설계 §3을 "해시 앵커 링크(`<Link>`/`<a>` 동일)"로 갱신 완료.

## 항목별 판정

| # | 항목 | 설계 기대 | 구현 실제 | 판정 |
|:-:|------|-----------|-----------|:----:|
| 1a | accent 군집화 | `getOrderedSources()` → accent group-by | `filter((s)=>(s.accent??'standard')===accent)` (PerspectiveCatalog.tsx:112) | ✅ |
| 1b | 관점 라벨·앵커 id | school/book/osha/standard → cluster-principle/risk/safety/job | `PERSPECTIVE_META`(:29-34) §2 표와 완전 일치 | ✅ |
| 1c | `id="sources"` 승계 | 통합 섹션 승계 | `<section id="sources">`(:91) | ✅ |
| 1d | 그룹 `scroll-mt-20` | 앵커 상쇄 | 그룹 div(:116)·섹션(:93) | ✅ |
| 1e | 빈 그룹 방어 | `items.length===0` return null | :113 | ✅ |
| 1f | `Record<Accent>` 누락 검출 | typecheck가 accent 누락 catch | PERSPECTIVE_META·ACCENT_ICON 모두 Record<Accent> | ✅ |
| 2a | 해시 앵커 + no 'use client' | 순수 해시 앵커, 서버 컴포넌트 | 'use client' 없음 ✅ / `<Link href="#...">`(:41) — **G-1(문면), 해소** | ✅ |
| 2b | 4목표 → 4관점 1:1 | 4 pill → 4 cluster | ROLE_ENTRIES 4개, 1:1(:16-21) | ✅ |
| 2c | `<nav aria-label>` | landmark | `aria-label="목표별 바로가기"`(:34) | ✅ |
| 3 | PlatformHero 파생 수치 | `4개`→`SOURCE_COUNT` | :5 선언 + :52 렌더 | ✅ |
| 4a | page.tsx 섹션 순서 | Hero→Role→Catalog→Special×2→Footer | :20,22,24,26,40,66 | ✅ |
| 4b | SourcePicker/LearningPath 제거 | import·사용 0 | 제거 완료(주석 1건만) | ✅ |
| 4c | metadata "네 갈래 자료원" | 파생 서술 | :14 | ✅ |
| 5 | FR-1 하드코딩 0 | `grep "[0-9]+개 자료원" src/`=0 | **0건** | ✅ |
| 6 | FR-6 책·OSHA·NCS 1클릭 | `/sources/{id}/` | SourceCard href(:43) | ✅ |
| 7 | NFR-2 코드 정합 | import·타입 무오류 | 참조 심볼 실존, deleted 참조 0 | ✅ |
| 8a | types.ts 주석 갱신 | SourcePicker→PerspectiveCatalog | types.ts:194 | ✅ |
| 8b | accent.ts 주석 갱신 | SourcePicker→PerspectiveCatalog | accent.ts:4 | ✅ |
| — | 삭제 파일 부재 | SourcePicker/LearningPath 없음 | 부재 확인 | ✅ |
| — | 데이터 정합 | school=8·나머지 각1 = 11 | 카탈로그 4그룹 전부 ≥1 | ✅ |

## Gap 목록

**G-1 (⚠️ 경미 · 해소 완료)** — `RoleQuickEntry.tsx:41` 설계 문언 `<a>` vs 구현 `<Link>`. 동일 페이지 해시 앵커라 basePath 무관·기능 동일, `'use client'` 없어 서버 컴포넌트 요건 충족. **처리**: 설계 §3 문언을 "해시 앵커 링크(`<Link>`/`<a>`)"로 갱신 → 문서-코드 정렬(코드 무변경).

## 관찰 사항 (Gap 아님)

- **§4 교과서 전용 컴팩트 카드 미분화**: 전 그룹 균일 `SourceCard`+`sm:grid-cols-2`. FR-2(8종 1클릭)는 충족 — 시각 밀도 제안의 미채택일 뿐 기능 갭 아님. (개선 여지: Report 후 별도 검토 가능)
- **단위 라벨 충실도 향상**: 설계 "N개 섹션" → 구현 `SOURCE_KIND_UNIT_LABELS[kind]`(챕터/Part/단원 등 정확 표기).
- **`PERSPECTIVE_ORDER` 평문 배열**: 렌더 순서는 자동 편입 안 되나, Record<Accent>가 신규 accent를 typecheck로 강제 검출 → 개발자가 ORDER 누락 인지.

## 범위 확장 3곳 정당성 (설계 미기재, 구현 반영)

| 위치 | 상태 | 판정 |
|------|------|:----:|
| `seo.ts:7` DEFAULT_DESCRIPTION | "네 갈래 자료원"(수치 없음) | 정당 |
| `page.tsx:14` metadata | "네 갈래 자료원 … {TOTAL_UNITS}개"(파생) | 정당 |
| `Footer.tsx:11`·`page.tsx:123` 푸터 | "여러 자료원"(수치 없음) | 정당 |

설계 §5는 PlatformHero 1곳만 명시했으나, 구현은 **FR-1("하드코딩 0")을 홈 전 표면으로 확장** 적용. "네 갈래"는 **관점/accent 4종(book·osha·standard·school)** 범주 수라 자료원(인스턴스)이 늘어도 노후화하지 않음 — 설계 §5의 "관점=4는 사실, 유지" 결정과 정합. **정당한 확장.**

> 향후 점검(이번 스코프 밖): `Footer.tsx:35-36` 원본 크레딧이 11자료원 중 대표 4작만 나열 — 수치가 아닌 출처 표기라 FR-1 위반은 아니나, 자료원 증가 시 대표성 드리프트 여지.

## 결론 / 후속

- Match Rate **98%(측정) → 100%(G-1 해소)**, ≥90% → 설계·구현 정합 양호. **iterate 불필요.**
- 검증 상태: `typecheck` ✅ · `lint` ✅(기존 경고 2건) · `build` exit 0 ✅ · 홈 SSG 렌더 실측(4앵커·11자료원·8교과서·pill 4개·하드코딩 0) ✅
- **다음**: `/pdca report mainpage-restructure` (완료 보고).
