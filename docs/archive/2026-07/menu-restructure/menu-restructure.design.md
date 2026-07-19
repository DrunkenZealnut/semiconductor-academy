# Design — 헤더 메뉴 재구성: 자료원 드롭다운 + 공정 + 유해물질사전 + 검색

> **Feature**: `menu-restructure` · **작성일**: 2026-07-19 · **Level**: Dynamic
> **Plan**: `./menu-restructure.plan.md`
> **범위**: 헤더 네비 4축 재구성 + 자료원 드롭다운 신규. URL·콘텐츠·홈 무수정.

---

## 1. 헤더 구성 (최종)

```text
데스크톱 (md:flex)
┌──────────────────────────────────────────────────────────────────────────┐
│ [📖 반도체 아카데미]   [자료원 ▾]  공정  유해물질 사전  검색   [Aa][🌙][⎋] │
└──────────────────────────────────────────────────────────────────────────┘
                          │
             ┌────────────▼──────────────────────────┐  ← SourcesDropdown 패널
             │ 반도체 산업의 유해인자                 │  /sources/epi-semi-hazards/
             │ OSHA Semiconductor Chemical Safety     │  /sources/osha-scs/
             │ NCS 반도체 학습모듈                    │  /sources/ncs-semi/
             │ ─── 반도체 고등학교 교과서 ───         │  (그룹 헤더, 비링크)
             │ 반도체 기초                            │  /sources/hs-semicon-basics/
             │ 반도체 공정기초                        │  /sources/daegu-hs-process/
             │ … (order 6~12, 총 9개)                 │
             │ ───────────────────────────────────── │
             │ 전체 자료원 보기 →                     │  /#sources
             └────────────────────────────────────────┘

모바일 (md:hidden, 햄버거 오픈)
  ▸ 자료원              ← Disclosure accordion (펼치면 12개, 그룹 구분)
  공정
  유해물질 사전
  검색
```

| 헤더 항목 | 타입 | href / 동작 |
|---|---|---|
| 자료원 ▾ | 드롭다운(데스크톱)/accordion(모바일) | `getOrderedSources()` 파생 12개 |
| 공정 | 링크 | `/process-overview/` |
| 유해물질 사전 | 링크 | `/chemicals/` |
| 검색 | 링크 | **MVP**: `/quotes/` (Plan §7 D2, S2) — 통합 `/search/`는 후속 |

- 우측 유틸(FontSizeToggle·ThemeToggle·LogoutButton) 위치·동작 **불변**.
- 로고 `[📖 반도체 아카데미]` → `/` **불변**.

---

## 2. 데이터 파생 (`src/lib/sources.ts` 재사용, 무수정)

헤더 드롭다운은 하드코딩 없이 레지스트리에서 파생 — 자료원 추가 시 자동 반영.

```ts
import { getOrderedSources } from '@/lib/sources';
import { SOURCE_CATEGORY_LABELS } from '@/lib/types';

const ordered = getOrderedSources();                              // order 1~12 정렬
const standalone = ordered.filter((s) => !s.category);           // 3개 (order 1~3)
const hsTextbooks = ordered.filter((s) => s.category === 'hs-textbook'); // 9개 (order 4~12)
const hsLabel = SOURCE_CATEGORY_LABELS['hs-textbook'];           // '반도체 고등학교 교과서'
// 각 항목 href: `/sources/${s.id}/`  (SourcePicker와 동일 패턴)
```

> `getOrderedSources()`는 서버·클라이언트 어디서든 동기 호출 가능한 순수 함수 → `'use client'` 컴포넌트에서 직접 import 안전(빌드 타임 정적 데이터).

---

## 3. SourcesDropdown (신규 — `src/components/layout/SourcesDropdown.tsx`)

데스크톱 헤더용 드롭다운. `'use client'`.

### 3.1 Props / State
```ts
'use client';
// props 없음 — 레지스트리 파생. 내부 상태:
const [open, setOpen] = useState(false);
const triggerRef = useRef<HTMLButtonElement>(null);
const panelRef = useRef<HTMLDivElement>(null);
```

### 3.2 마크업 골격
```tsx
<div className="relative">
  <button
    ref={triggerRef}
    type="button"
    aria-haspopup="menu"
    aria-expanded={open}
    onClick={() => setOpen((v) => !v)}
    className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
  >
    자료원
    <ChevronDown aria-hidden className={cn('size-4 transition-transform', open && 'rotate-180')} />
  </button>

  {open && (
    <div
      ref={panelRef}
      role="menu"
      className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900"
    >
      {/* 독립 자료원 3개 */}
      {standalone.map((s) => (
        <Link key={s.id} role="menuitem" href={`/sources/${s.id}/`} onClick={() => setOpen(false)}
          className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
          {s.title}
        </Link>
      ))}

      {/* 그룹: 반도체 고등학교 교과서 */}
      <div className="mt-1 border-t border-slate-100 px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-800">
        {hsLabel}
      </div>
      {hsTextbooks.map((s) => ( /* 동일 Link 패턴 */ ))}

      {/* 전체 보기 */}
      <div className="mt-1 border-t border-slate-100 pt-1 dark:border-slate-800">
        <Link role="menuitem" href="/#sources" onClick={() => setOpen(false)}
          className="block rounded-md px-3 py-2 text-sm font-medium text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800">
          전체 자료원 보기 →
        </Link>
      </div>
    </div>
  )}
</div>
```

### 3.3 접근성 / 상호작용 (a11y)
| 요구 | 구현 |
|---|---|
| 열림 상태 노출 | 트리거 `aria-expanded={open}`, `aria-haspopup="menu"` |
| 메뉴 시맨틱 | 패널 `role="menu"`, 항목 `role="menuitem"` |
| ESC 닫기 | `useEffect`: `keydown` Escape → `setOpen(false)` + 트리거로 포커스 복귀 |
| 외부 클릭 닫기 | `useEffect`: `mousedown`이 `panelRef`/`triggerRef` 밖이면 닫기 |
| 항목 선택 시 닫기 | 각 `Link onClick={() => setOpen(false)}` |
| 키보드 이동 | 기본 Tab 순회(항목이 `<a>`라 자연 포커스 가능). 화살표 이동은 비목표(과설계 회피) |
| 아이콘 장식 | `ChevronDown aria-hidden` |

```ts
useEffect(() => {
  if (!open) return;
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); } };
  const onClick = (e: MouseEvent) => {
    if (!panelRef.current?.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) setOpen(false);
  };
  document.addEventListener('keydown', onKey);
  document.addEventListener('mousedown', onClick);
  return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick); };
}, [open]);
```

---

## 4. Header.tsx 변경 (`src/components/layout/Header.tsx`)

### 4.1 navItems 축소 (드롭다운 제외한 정적 링크)
```ts
// 기존 7개 → 정적 링크 3개 (자료원은 SourcesDropdown이 전담)
const navItems = [
  { href: '/process-overview/', label: '공정' },
  { href: '/chemicals/',        label: '유해물질 사전' },
  { href: '/quotes/',           label: '검색' },   // MVP: 인용 검색 재사용 (라벨만 '검색')
];
```

### 4.2 데스크톱 nav
```tsx
<nav className="hidden items-center gap-1 md:flex" aria-label="주 메뉴">
  <SourcesDropdown />
  {navItems.map((item) => ( /* 기존 Link 스타일 유지 */ ))}
  <FontSizeToggle /><ThemeToggle /><LogoutButton />
</nav>
```
- import 추가: `SourcesDropdown`, `ChevronDown`(SourcesDropdown 내부).

### 4.3 모바일 메뉴 (햄버거 오픈 시)
- "자료원"은 `Disclosure`(`src/components/ui/Disclosure.tsx`) 재사용해 accordion으로:
```tsx
<ul className="space-y-1 px-4 py-3">
  <li>
    <Disclosure title="자료원">
      <ul className="space-y-1">
        {standalone.map(...)/* Link, onClick 닫기 */}
        <li className="px-1 pt-2 text-xs font-semibold text-slate-400">{hsLabel}</li>
        {hsTextbooks.map(...)}
        <li><Link href="/#sources" onClick={close}>전체 자료원 보기 →</Link></li>
      </ul>
    </Disclosure>
  </li>
  {navItems.map((item) => ( /* 공정·유해물질·검색 평면 Link */ ))}
</ul>
```
- 모바일 메뉴 항목 클릭 시 `setOpen(false)`(햄버거 닫기) 유지.
- 데이터 파생(§2)은 Header 상단에서 1회 계산 후 데스크톱/모바일 공유.

> **분리 판단**: 모바일 accordion은 Disclosure로 충분해 별도 컴포넌트 불요. 데스크톱 드롭다운만 `SourcesDropdown`으로 분리(포지셔닝·외부클릭 로직 캡슐화).

---

## 5. 검색 라우팅

| 단계 | 헤더 "검색" href | 작업 |
|---|---|---|
| **MVP (이번 사이클)** | `/quotes/` | 라벨만 "인용 검색" → "검색". 신규 코드 0. |
| 후속 (`unified-search`) | `/search/` | 인용+유해물질 통합 인덱스 페이지 신규 (별도 feature) |

- 본 Design은 MVP 기준. `/search/` 승격은 후속 Plan/Design에서 다룸(Plan §3.3 S1).

---

## 6. Footer 확인 (`src/components/layout/Footer.tsx`)

- 헤더에서 내려오는 **직업병·소개는 이미 Footer에 존재**(`/about/`·`/occupational-disease/`·`/what-is-semiconductor/`) → 변경 불요.
- 선택: "학습" 컬럼에 "책 차례"(`/chapters/`) 링크 1개 보강 여부 → Design 판단상 **자료원 드롭다운의 '반도체 산업의 유해인자'로 충분**하므로 미추가(YAGNI). 필요 시 Do에서 소품목 추가.

---

## 7. 반응형 / 스타일 토큰

| 브레이크포인트 | 자료원 | 나머지 |
|---|---|---|
| `md:` 이상 | SourcesDropdown (absolute 패널, `w-72`, `shadow-lg`) | 인라인 Link |
| `md:` 미만 | Disclosure accordion (햄버거 내부) | 세로 Link |

- 색/여백 토큰은 기존 Header Link 클래스(`text-slate-700`, `hover:bg-slate-100`, dark variant) 그대로 재사용 → 시각 일관성.
- 드롭다운 패널 폭 `w-72`(교과서 제목 최장 "반도체 장비 유지 보수" 수용), 넘칠 경우 `truncate` 없이 2줄 허용.

---

## 8. 삭제 / 이관 목록

| 대상 | 처리 |
|---|---|
| navItems `{ '/#sources', '자료원' }` | SourcesDropdown으로 대체 |
| navItems `{ '/chapters/', '책 차례' }` | 자료원 드롭다운 '반도체 산업의 유해인자'로 흡수 (링크 제거) |
| navItems `{ '/occupational-disease/', '직업병' }` | Footer 기존 링크로 이관 (헤더서 제거) |
| navItems `{ '/about/', '소개' }` | Footer 기존 링크로 이관 (헤더서 제거) |
| navItems `{ '/quotes/', '인용 검색' }` | 라벨 "검색"으로 변경, href 유지 |

---

## 9. 검증 계획

- [ ] `npm run typecheck` — SourcesDropdown 타입, `SOURCE_CATEGORY_LABELS` 참조.
- [ ] `npm run lint`.
- [ ] `npm run build` — 정적 export 성공(드롭다운 client 컴포넌트가 SSG 방해 없음).
- [ ] 수동: 데스크톱 드롭다운 열림/ESC/외부클릭 닫힘, 12개 링크 정확 이동.
- [ ] 수동: 모바일 햄버거 → 자료원 accordion 펼침 → 12개 이동.
- [ ] 수동: 검색/공정/유해물질 링크 이동, 직업병·소개 Footer 도달.
- [ ] a11y: 키보드 Tab 순회, `aria-expanded` 토글, 스크린리더 "자료원, 메뉴 팝업" 안내.

---

## 10. 구현 순서 (Do)

1. `feat/menu-restructure` 브랜치 생성.
2. `SourcesDropdown.tsx` 신규 — 데이터 파생 + 마크업 + a11y useEffect.
3. `Header.tsx` — navItems 3개로 축소, 데스크톱에 `<SourcesDropdown/>`, 모바일 Disclosure accordion, 데이터 파생 공유.
4. 검색 라벨 "검색"(href `/quotes/`) 반영.
5. `typecheck`/`lint`/`build` + 수동 검증(§9).
6. `/pdca analyze menu-restructure` → Gap.

---

## 11. Plan 미결(§7) 반영 상태

| ID | 항목 | Design 확정 |
|---|---|---|
| D1 | 자료원 나열 | A안 드롭다운(§3), category 그룹 |
| D2 | 검색 범위 | MVP=S2 `/quotes/`(§5), S1은 후속 feature |
| D3 | 기존 메뉴 | 책차례→드롭다운 흡수, 직업병·소개→Footer(§6·§8) |
| D4 | 드롭다운 트리거 | 데스크톱 click 토글(hover 비의존, a11y 우선), 모바일 accordion(§3.3·§4.3) |

> D1~D3은 사용자 무응답으로 Plan 추천안을 Design에서 확정. 이견 시 본 문서 수정 후 Do 진행.
