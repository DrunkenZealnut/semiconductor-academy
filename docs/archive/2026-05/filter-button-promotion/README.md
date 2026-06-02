# Archive: filter-button-promotion

> 직전 archived cycle `quotes-source-filter-polish`의 `FilterButton` helper(QuoteIndex 비공개)를 `src/components/ui/Chip.tsx` 전역 UI primitive로 추출. `pressed` prop + **aria-pressed 자동 부여** (WAI-ARIA) + focus-visible ring 캡슐화 + JSDoc + variant 확장 권고. QuoteIndex 24 chip 사용처(Source 3 + Type 3 + Chapter 18) 모두 `<Chip>` 치환, `FilterButton` helper + `cn` import 완전 삭제. ChemicalSearch 마이그레이션은 스타일 차이(solid vs outlined)로 별 cycle 분리. **30분 micro-cycle #2, 99% Match Rate, Bonus 정책 없음.**

**Archived**: 2026-05-31
**Phase**: completed
**Match Rate**: 99% (FR 10/10, NFR 6/6, Risk 6/6 해소, Minor 1)
**Iteration**: 0 (첫 통과)
**Duration**: **~30분** (Plan → Do → Check → Report, 45m 박스의 67%)
**Level**: Dynamic
**Cycle Type**: **Micro-cycle #2** (Design phase skipped per Plan §8)
**Branch**: main
**Inherits**: [quotes-source-filter-polish archive](../quotes-source-filter-polish/) (FilterButton focus-visible 패턴 원형)

---

## 결과 요약

| 지표 | 결과 |
|------|:---:|
| Match Rate | 99% |
| FR coverage | 10/10 ✅ |
| NFR coverage | 6/6 ✅ |
| Plan §5 Risk 해소 | 6/6 ✅ |
| Browser 실측 (Playwright) | aria-pressed snapshot + focus-visible 검증 ✅ |
| Convention Compliance | 100% (Tag.tsx 패턴 일관) |
| Critical / Major / Minor | 0 / 0 / 1 |
| Bonus 폴리시 | 없음 (Plan대로 정확 실현, scope adherence 100%) |
| LOC delta | net +20 lines (QuoteIndex −23 / Chip +43, 재사용 가능) |
| Bundle delta | +20 bytes (한도 200B의 10%) |
| typecheck / build | 모두 통과 (무경고) |
| 기존 URL 회귀 | 0건 |

---

## 구현 산출물

### UI Primitive (NEW)

| 종류 | 파일 | 비고 |
|------|------|------|
| NEW | `src/components/ui/Chip.tsx` | `pressed: boolean` prop + `aria-pressed={pressed}` 자동 + focus-visible ring 캡슐화 + className override via cn + ButtonHTMLAttributes forwarded + JSDoc + variant 확장 권고. 43 lines |

### Migration (EDIT)

| 종류 | 파일 | 비고 |
|------|------|------|
| EDIT | `src/components/quote-index/QuoteIndex.tsx` | Chip import 추가 + cn import 제거 + 24 chip 사용처 `active`→`pressed` rename + `FilterButton` helper 24 lines 삭제. net −23 lines |

### Verification Asset

| 파일 | 내용 |
|------|------|
| `assets/filter-button-promotion-chip-focus.png` | Tab → "📖 책 91" chip에 brand-400 ring 가시. 직전 cycle 동등 동작 검증 |

### 합계

- 신규 파일: 1 (Chip.tsx)
- 수정 파일: 1 (QuoteIndex.tsx)
- 신규 assets: 1 (.png)
- LOC delta: net +20 (재사용 가능 UI primitive로 정리)
- 신규 ENV / 디자인 토큰: 0

---

## 검증 결과 (실측값)

### 빌드/타입

```
✅ npx tsc --noEmit: pass
✅ npm run build: pass (warning 0)
   /quotes 6.76 → 6.78 kB (+20 bytes, NFR ≤200B의 10%)
✅ 78/78 static pages prerendered
```

### Browser 실측 (Playwright MCP, dev:3016)

| 시나리오 | 결과 |
|---------|:---:|
| /quotes 페이지 로드 + 헤더 정상 | ✅ |
| `[전체 117] [pressed]` (sourceFilter='all') | ✅ aria-pressed 자동 |
| `[전체 유형] [pressed]` (typeFilter='all') | ✅ aria-pressed 자동 |
| `[전체 챕터] [pressed]` (chapterFilter=null) | ✅ aria-pressed 자동 |
| 비활성 chip 21개: pressed annotation 미표기 | ✅ ARIA spec 부합 |
| Source=OSHA 클릭 → "26개 결과" → "summary" → "5개 결과" | ✅ 회귀 0 |
| Tab → "📖 책 91" chip brand-400 ring 가시 | ✅ 직전 cycle 동등 |
| WCAG 2.1 AA SC 2.4.7 Focus Visible | ✅ 충족 |

---

## Chip 컴포넌트 설계 결정 (Plan §6.2)

| Decision | 선택 | 근거 |
|----------|------|------|
| 위치 | `src/components/ui/Chip.tsx` | Tag/Card/Disclosure와 동일 폴더 (UI primitive 컨벤션) |
| Prop 이름 | **`pressed`** (active 아님) | aria-pressed semantics와 일치, WAI-ARIA Authoring Practices 권장 |
| variant 시스템 | **단일 (outlined)** | YAGNI — ChemicalSearch cycle에서 자연 도출 (다음 cycle 비용 선결제) |
| ref forwarding | 미포함 | 현 사용처 0 (YAGNI) |
| ChemicalSearch 마이그레이션 | **별 cycle** | 스타일 차이(solid vs outlined) + responsive 분기 → design decision 추가 필요, micro-cycle 박스 초과 위험 |
| 이름 (Chip vs Button) | **Chip** | Material UI/MUI 컨벤션. Tag(non-interactive) vs Chip(interactive) 명확 |

---

## PDCA 타임라인

| Phase | 산출물 | 시간 |
|-------|--------|:---:|
| **Plan** | plan.md (Executive Summary + 10 FR + 6 NFR + 6 Risk + Out of scope 명시 + Time box ≤45m) | ~10m |
| **Design** | **SKIPPED** (Plan §8 micro-cycle 명시적 허용) | 0m |
| **Do** | 1 NEW (Chip.tsx) + 1 EDIT (QuoteIndex.tsx) + Playwright 1 screenshot. typecheck/build pass | ~15m |
| **Check** | analysis.md — gap-detector 99% (FR 10/10, NFR 6/6, Risk 6/6, Minor 1) | ~3m |
| **Report** | report.md (14.5 KB, 283 lines) — Executive Summary + Lessons Learned 5건 + micro-cycle 회고 | ~2m |
| **Archive** | 본 폴더 | ~5m |

**총 소요**: ~30분 (Plan box 45m의 67%) — design skip 효과 약 15m 절감

---

## 핵심 학습 (Lessons Learned)

1. **UI primitive 추출은 다음 cycle 비용 선결제** — Chip 추출 완료로 ChemicalSearch 마이그레이션 cycle은 variant='solid' 1건만 design decision 필요 → ~30m micro-cycle 가능. Plan Executive Summary의 핵심 가치 주장이 본 cycle 결과로 실증됨.

2. **aria-pressed 같은 a11y 기본은 컴포넌트 단위 캡슐화** — helper 함수가 아니라 export 컴포넌트로 만들 때 a11y attribute를 prop에 묶으면 모든 사용처에서 자동 적용. 직전 cycle FilterButton의 minor gap(aria-pressed 부재)을 본 cycle Plan FR가 사전에 close.

3. **micro-cycle 적용 기준 정착** (2회 연속 검증):
   - Scope 단일 (1 컴포넌트 추출 + 1 파일 마이그레이션)
   - 디자인 결정 0 (직전 cycle 토큰 100% 재사용)
   - 신규 API/DB/외부 통합 0
   - 회귀 위험이 spot check로 충분히 검증 가능
   - Plan §6.2 Architecture decisions 사전 명문화
   → Design phase skip 정당화

4. **Plan §2.1.2 "5 사용처" 표기 함정** — `.map()` 다중 렌더링을 "1 사용처(JSX site)"로 셀지 "N 인스턴스(인스턴스 카운트)"로 셀지 사전 합의 필요. 향후 Plan에 "JSX site (N 인스턴스)" 형식 권장.

5. **Playwright snapshot이 a11y 검증 자산** — aria-pressed annotation을 자동 출력 → 별도 수동 inspector 필요 없음. CI/CD a11y regression 검증 자동화 가능.

---

## micro-cycle 2회 연속 성공 검증

| 항목 | micro #1 (`quotes-source-filter-polish`) | micro #2 (`filter-button-promotion`) |
|------|----------------------------------------|----------------------------------|
| Design phase | skip | skip |
| 실측 시간 | ~30m | ~30m |
| Match Rate | 99% | 99% |
| Bonus 폴리시 | 1건 (Happy C +5 lines) | 없음 (Plan대로 정확) |
| Plan §8 design-skip 명시 | ✅ | ✅ |
| 박스 여유 | 33% | 33% |

→ **Plan §8 design-skip 명시 허용이 박스 단축의 실효 메커니즘**. micro-cycle 패턴 정착.

---

## Polish / Limitations

### 본 cycle 잔존 Minor (doc-only)

| ID | 항목 | 처리 방안 |
|----|------|----------|
| M-01 | Plan §2.1.2 "5 사용처" 표기 vs §4.1 "24 사용처" 본문 self-correction 흔적 | 구현 영향 0. 향후 Plan 작성 시 "JSX site (N 인스턴스)" 표기 권장 (Lessons Learned #4) |

### 직전 cycle 잔존 polish (out of scope, archive README 명문화 완료)

- `quotes-source-filter` cycle M2 / M3 (이미 archive README에 명문화)

**잔존 0건** (모두 명문화 또는 후속 cycle 분리).

---

## 다음 cycle 후보

| 우선순위 | Cycle | 범위 | 비고 |
|:---:|------|------|------|
| **a** | `filter-button-promotion-chemicals` | ChemicalSearch 카테고리/공정 chip을 Chip + variant='solid' 추가로 마이그레이션 | Chip 추출 완료 → design decision 1건만, ~30m micro-cycle |
| **b** | `chip-variant-system` | outlined/solid/ghost variant 시스템 도입 | (a)에서 자연 도출되면 통합 |
| **c** | `chip-group-roving-tabindex` | 키보드 좌우 화살표 네비게이션 (chip 그룹 a11y) | (선택) |
| **d** | `semi-s2-source` / `kosha-guide-source` | 신규 자료원 onboarding (cross-link + quotes-source-filter 패턴 ROI 회수) | 큰 cycle |

---

## 참고

- Inherits: `docs/archive/2026-05/quotes-source-filter-polish/` (직전 cycle, FilterButton focus-visible 패턴 원형)
- 관련 archive:
  - `docs/archive/2026-05/quotes-source-filter/` — Source 필터 UI 원형
  - `docs/archive/2026-05/cross-link-system/` — Single source of truth 패턴 (manifest-driven discovery)
- 기존 UI primitive: `src/components/ui/Tag.tsx` (span, non-interactive), `src/components/ui/Card.tsx`, `src/components/ui/Disclosure.tsx`
- Archive 시점: 2026-05-31
