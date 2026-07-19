# Design-Implementation Gap Analysis — menu-restructure

> **Feature**: `menu-restructure` · **분석일**: 2026-07-19 · **Phase**: Check
> **Agent**: bkit:gap-detector
> **설계(진실)**: `docs/02-design/features/menu-restructure.design.md`
> **구현**: `src/components/layout/SourcesDropdown.tsx`(신규) · `src/components/layout/Header.tsx`(수정)

## 분석 개요
- 대상: 헤더 메뉴 재구성 (자료원 드롭다운 + 공정 + 유해물질 사전 + 검색)
- 재사용: `src/lib/sources.ts`(`getOrderedSources`), `src/lib/types.ts`(`SOURCE_CATEGORY_LABELS`), `src/components/ui/Disclosure.tsx`

## Overall Scores

| Category | Score | Status |
|----------|:-----:|:------:|
| Design Match | 98% | ✅ |
| Architecture Compliance | 100% | ✅ |
| Convention Compliance | 100% | ✅ |
| **Overall** | **98%** | ✅ |

## 섹션별 대조 (Design §)

| Design 섹션 | 검증 항목 | 판정 | 근거 (구현 위치) |
|---|---|:--:|---|
| §1 헤더 구성 | 데스크톱 4축(자료원 드롭다운·공정·유해물질 사전·검색) | Match | Header.tsx:38-52 `<SourcesDropdown/>` + navItems 3 |
| §1 | 우측 유틸(Font·Theme·Logout) 불변 | Match | Header.tsx:49-51 |
| §1 | 로고 `반도체 아카데미`→`/` 불변 | Match | Header.tsx:33-36 |
| §2 데이터 파생 | `getOrderedSources()`+`filter(!category)`/`filter(===hs-textbook)` → 3+9 | Match | Header.tsx:21-24, Dropdown:10-13 |
| §2 | 하드코딩 없음, `SOURCE_CATEGORY_LABELS` 파생 | Match | 레지스트리 파생 (sources.ts:1865 순수함수) |
| §2 | href `/sources/${id}/` | Match | Dropdown:75, Header.tsx:84,98 |
| §3 a11y | `aria-haspopup="menu"`·`aria-expanded` | Match | Dropdown:52-53 |
| §3 | `role="menu"`/`menuitem` | Match | Dropdown:67,74,89,100 |
| §3 | ESC 닫기 + 트리거 포커스 복귀 | Match | Dropdown:25-30 |
| §3 | 외부클릭(mousedown) 닫기 | Match | Dropdown:31-36 |
| §3 | 항목 클릭 시 닫기 | Match | Dropdown:76,91,102 `onClick={close}` |
| §3 | ChevronDown `aria-hidden`+`rotate-180` | Match | Dropdown:58-61 |
| §4 Header | navItems 3개(공정·유해물질 사전·검색) | Match | Header.tsx:15-19 |
| §4 | 모바일 `Disclosure` accordion: 3+헤더+9+전체보기 | Match | Header.tsx:78-117 |
| §4 | 모바일 항목 클릭 시 햄버거 닫기 | Match | Header.tsx:85,99,109 `onClick={close}` |
| §5 검색 라우팅 | 헤더 "검색" href=`/quotes/` (MVP S2) | Match | Header.tsx:18 |
| §8 삭제/이관 | 책 차례·직업병·소개 navItems 제거 | Match | Header.tsx:15-19 (3개만 잔존) |

## Differences Found

### 🔴 Missing (Design O, 구현 X)
없음.

### 🟡 Added (Design X, 구현 O) — 모두 경미·긍정적
| 항목 | 위치 | 설명 |
|---|---|---|
| `aria-label="자료원 목록"` (패널) | Dropdown:68 | 설계 마크업엔 없으나 §3.3 스크린리더 의도 강화. 개선. |
| item hover 텍스트색(`hover:text-slate-900` 등) | Dropdown:15-16 | §7 "기존 Header Link 클래스 재사용" 의도와 일치. |

### 🔵 Changed (Design ≠ 구현) — 비기능·스타일 한정
| 항목 | Design | 구현 | 영향 |
|---|---|---|---|
| 모바일 교과서 그룹 헤더 클래스 | §4.3 예시 `px-1 pt-2 text-xs font-semibold` | `px-3 pb-1 pt-2 uppercase tracking-wide`(데스크톱과 통일) | 없음(시각 일관성 향상) |

## Match Rate: 98% — 90% 기준 통과 ✅

- 핵심 검증 관점 6개(§1·§2·§3·§4·§5·§8) **전부 Match**.
- 누락(Missing) 0건, 기능적 불일치 0건.
- 발견된 차이는 모두 a11y/스타일 미세 개선(추가 2, 변경 1)으로 설계 의도에 부합하거나 상회.
- 정적 검증: `typecheck` ✅ · `lint` ✅(신규 파일 경고 0) · `build`(정적 export) ✅.

## 권장 조치
- **즉시 조치 필요: 없음.** 90% 기준을 크게 상회.
- **문서 후행 반영(선택, 동기화 100%용)**:
  1. `SourcesDropdown` 패널 `aria-label="자료원 목록"` → Design §3.2/§3.3 명시.
  2. 드롭다운 item hover 텍스트색 → §3.2/§7 반영.
  3. 모바일 교과서 그룹 헤더 스타일 통일 → §4.3 예시 갱신.
- **다음 단계**: `/pdca report menu-restructure`.

---

_Match Rate 98% ≥ 90% → iterate 불필요, report 단계 진행 가능._
