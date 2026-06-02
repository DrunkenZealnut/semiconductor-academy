# Design — OSHA SCS 이중 언어(영/한) 인페이지 토글

> **Feature**: `osha-bilingual-toggle` · **작성일**: 2026-06-02
> **Plan**: `docs/01-plan/features/osha-bilingual-toggle.plan.md`
> **상속 패턴**: cross-link-system Extensibility 5원칙 (manifest-driven / schema-enum 미러 / source-agnostic UI / graceful degradation / versioning)

---

## 1. 설계 개요

영문 OSHA MDX는 그대로 두고, **언어별 MDX를 짝(pair)으로 추가**한다. 라우트는 단일 URL을 유지하되, 서버 컴포넌트가 **두 언어 본문을 모두 빌드 타임에 렌더**해 클라이언트 토글 컴포넌트에 `ReactNode`로 전달한다. 클라이언트는 `useState`로 활성 언어를 결정하고 비활성 본문을 `hidden` 처리한다.

```
[part]/page.tsx (Server)
  ├─ loadOshaScsPartMdx('part-1a', 'en') → <EnBody/>
  ├─ loadOshaScsPartMdx('part-1a', 'ko') → <KoBody/>  (없으면 null)
  └─ <LanguageToggle en={<EnBody/>} ko={<KoBody/>}>   ← 'use client'
        ├─ [EN][한국어] Chip 버튼 (ko 있을 때만)
        ├─ <div hidden={lang!=='en'}>{en}</div>
        └─ <div hidden={lang!=='ko'}>{ko}</div>
```

**핵심 근거**: 정적 export(`output: 'export'`)에서는 런타임 서버가 없으므로, 두 본문을 모두 직렬화된 RSC payload로 내려보내고 전환은 100% 클라이언트에서 처리한다. 쿼리스트링/동적 라우트 추가 없이 단일 prerendered HTML로 양 언어를 담는다.

---

## 2. MDX 네이밍 규약

| 언어 | 파일 | 비고 |
|------|------|------|
| 영문(기본) | `src/content/sources/osha-scs/part-1a.mdx` | **기존 유지** (= 사실상 `.en`) |
| 한글 | `src/content/sources/osha-scs/part-1a.ko.mdx` | **신규** |

- 규약: `{partId}.mdx` = 영문 원문, `{partId}.ko.mdx` = 한글 번역. 향후 `.ja.mdx` 등 확장 시 동일 패턴.
- 한글 MDX는 영문과 **헤딩 레벨·열거·표 구조를 1:1 대응**(FR-1). 동일 `useMDXComponents` 컴포넌트(`SourceQuote`, `Callout` 등) 사용 가능.
- 번역 원칙(R-3 대응): 안전 지침·법규 문구는 직역 우선, 전문 용어는 `terms.json`/책 용어와 대조.

---

## 3. 로더 설계 — `src/lib/oshaMdx.tsx`

```ts
import type { ComponentType } from 'react';
import type { SourceLanguage } from '@/lib/types';

const enLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  'part-1a': () => import('@/content/sources/osha-scs/part-1a.mdx'),
  'part-1b': () => import('@/content/sources/osha-scs/part-1b.mdx'),
  'part-2':  () => import('@/content/sources/osha-scs/part-2.mdx'),
  'part-3':  () => import('@/content/sources/osha-scs/part-3.mdx'),
  'part-4':  () => import('@/content/sources/osha-scs/part-4.mdx'),
};

// 한글 번역이 준비된 Part만 등록 (확장: ko.mdx 추가 후 한 줄 등록)
const koLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  'part-1a': () => import('@/content/sources/osha-scs/part-1a.ko.mdx'),
};

/** 한글 번역 가용 여부 — 토글 노출 판단 (FR-7) */
export function hasOshaScsKo(partId: string): boolean {
  return partId in koLoaders;
}

/** lang 기본 'en'. ko 요청 시 미존재면 null (호출부에서 en fallback) (FR-2/FR-3) */
export async function loadOshaScsPartMdx(
  partId: string,
  lang: SourceLanguage = 'en',
): Promise<ComponentType | null> {
  const registry = lang === 'ko' ? koLoaders : enLoaders;
  const loader = registry[partId];
  if (!loader) return null;
  return (await loader()).default;
}
```

- **시그니처 호환**: `lang` 기본값 `'en'` → 기존 호출(`loadOshaScsPartMdx(part)`) 무변경.
- **graceful degradation**: `koLoaders`에 없는 Part는 `null` → page.tsx에서 토글 미노출.
- **확장 경로(NFR-5)**: 후속 사이클에서 `part-1b.ko.mdx` 작성 후 `koLoaders`에 1줄 추가 = 끝. 컴포넌트/페이지 코어 무수정.

---

## 4. 컴포넌트 — `src/components/sources/LanguageToggle.tsx` (신규, 'use client')

```tsx
'use client';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Chip } from '@/components/ui/Chip';
import { SOURCE_LANGUAGE_LABELS } from '@/lib/types';
import type { SourceLanguage } from '@/lib/types';

const STORAGE_KEY = 'osha-scs-lang';
const DEFAULT_LANG: SourceLanguage = 'ko';

interface LanguageToggleProps {
  en: ReactNode;
  ko: ReactNode | null;   // null이면 토글 미노출, en 단독
  enNotice: ReactNode;
  koNotice: ReactNode;
}

export function LanguageToggle({ en, ko, enNotice, koNotice }: LanguageToggleProps) {
  // ko 없으면 항상 en (FR-7)
  const [lang, setLang] = useState<SourceLanguage>(ko ? DEFAULT_LANG : 'en');

  useEffect(() => {
    if (!ko) return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'ko') setLang(saved);
  }, [ko]);

  function choose(next: SourceLanguage) {
    setLang(next);
    window.localStorage.setItem(STORAGE_KEY, next);  // FR-6
  }

  return (
    <>
      {ko ? (
        <div role="group" aria-label="본문 언어 선택" className="mb-6 flex items-center gap-2">
          <Chip pressed={lang === 'ko'} onClick={() => choose('ko')} aria-label="한국어 번역 보기">
            한국어
          </Chip>
          <Chip pressed={lang === 'en'} onClick={() => choose('en')} aria-label="View English original">
            {SOURCE_LANGUAGE_LABELS.en}
          </Chip>
        </div>
      ) : null}

      <p className="mb-6 text-xs text-slate-500 dark:text-slate-500">
        {lang === 'ko' && ko ? koNotice : enNotice}
      </p>

      {/* 두 본문 모두 DOM 존재, 비활성은 hidden (FR-4/FR-5) */}
      <div hidden={lang !== 'en'}>{en}</div>
      {ko ? <div hidden={lang !== 'ko'}>{ko}</div> : null}
    </>
  );
}
```

**설계 포인트**
- `Chip` 재사용으로 aria-pressed·focus-visible·다크모드 캡슐화 상속 (NFR-4/6, filter-button-promotion 자산).
- **Hydration 안전(R-4)**: 초기 렌더는 `ko ? DEFAULT_LANG : 'en'` 정적값 → SSR/CSR 일치. localStorage 복원은 `useEffect`(마운트 후)로만.
- **본문 prose 스타일**: 기존 `<div className="prose ...">`를 page.tsx에 두고 그 내부에 `<LanguageToggle>` 배치 → 영/한 동일 prose 적용.

---

## 5. 라우트 통합 — `src/app/sources/osha-scs/[part]/page.tsx`

변경 지점:
```tsx
import { LanguageToggle } from '@/components/sources/LanguageToggle';
import { loadOshaScsPartMdx, hasOshaScsKo } from '@/lib/oshaMdx';

// ...
const EnBody = await loadOshaScsPartMdx(part, 'en');
const KoBody = hasOshaScsKo(part) ? await loadOshaScsPartMdx(part, 'ko') : null;

const enNotice = 'OSHA · 미국 노동부 산업안전보건청 · 본 페이지의 영어 본문은 원본 transcript입니다.';
const koNotice = 'OSHA 원본(영문)을 한국어로 옮긴 번역본입니다. 안전·법규 문구는 원문(EN)을 함께 확인하세요.';
```

본문 영역 교체:
```tsx
<div className="prose prose-lg max-w-none dark:prose-invert prose-h2:mt-10 prose-h3:mt-6">
  {EnBody ? (
    <LanguageToggle
      en={<EnBody />}
      ko={KoBody ? <KoBody /> : null}
      enNotice={enNotice}
      koNotice={koNotice}
    />
  ) : (
    <p className="text-slate-600 dark:text-slate-400">본문 준비 중입니다.</p>
  )}
</div>
```

- 기존 헤더의 고정 안내 문구(현재 `[part]/page.tsx` **L92–94**, `<header>` 내부 `<p className="mt-3 text-xs ...">OSHA · 미국 노동부 산업안전보건청 · 본 페이지의 영어 본문은 원본 transcript입니다.</p>`)는 **삭제**하고 LanguageToggle 내부 조건부 표기(`enNotice`)로 이전(FR-8). `enNotice` 텍스트는 이 L92–94 문구와 글자 단위 동일 → 영문 선택 시 표기 회귀 0.
- `SourceBadge variant="lang"`는 Source 레벨 메타(`OSHA_SCS.language='en'`)라 유지 (자료원 원어 표시). 본문 토글과 역할 구분.

---

## 6. 데이터 파이프라인 영향 (NFR-3) — ✅ 검증 완료

| 스크립트 | 영향 | 처리 |
|----------|------|------|
| `extract-quotes.mjs` | OSHA 순회는 **디렉토리 글롭이 아님**. `OSHA_PART_META` 배열을 순회하며 `join(OSHA_DIR, \`${partMeta.partId}.mdx\`)`로 **명시적 파일명**만 읽음 (L401, L452) | **변경·가드 불필요** — `.ko.mdx`는 `OSHA_PART_META`에 partId로 등록되지 않는 한 절대 읽히지 않음. quotes.json 회귀 리스크 = 0 (설계 단계 확정) |
| `build-cross-link-index.mjs` | `_links.json` 기반, 본문 무관 | 영향 없음 |

> **검증 결과 (코드 대조)**: `readdirSync`는 `CHAPTERS_DIR`(L430)에만 사용되고 `OSHA_DIR`에는 쓰이지 않는다. OSHA는 `OSHA_PART_META`의 5개 partId를 순회해 `${partId}.mdx`만 명시적으로 join하므로, `.ko.mdx` 파일이 추가돼도 스캔 대상에 포함되지 않는다. → **Plan §5의 "스킵 가드 확인/추가"는 불필요로 확정**. quotes.json 26 OSHA 인용 불변 보장.

---

## 7. 데이터 흐름

```
빌드 타임 (정적 export)
  page.tsx(server) ─ import en MDX ─┐
                  ─ import ko MDX ──┤→ RSC 렌더 → HTML+RSC payload (양 언어 포함)
                                    └→ LanguageToggle(client)에 ReactNode 직렬화 전달

런타임 (브라우저)
  hydrate → useState(ko?'ko':'en')
  useEffect → localStorage['osha-scs-lang'] 복원
  Chip onClick → setLang + localStorage 저장 → hidden 토글 (본문 즉시 교체, 네트워크 0)
```

---

## 8. 엣지 케이스

| # | 상황 | 처리 |
|---|------|------|
| E-1 | ko 번역 없는 Part(1b/2/3/4) | `KoBody=null` → 토글 미노출, en 단독, enNotice 표기 |
| E-2 | localStorage에 `'ko'` 저장됐는데 해당 Part는 ko 없음 | `ko` 없으면 `useEffect` early-return → en 고정 (E-1과 동일) |
| E-3 | JS 비활성/hydration 전 | 기본 본문(ko 우선) DOM에 존재해 노출 (no-JS에서도 읽힘) |
| E-4 | en MDX 로드 실패 | 기존 "본문 준비 중" fallback 유지 |
| E-5 | 다른 Part로 이동 | localStorage 공유 키로 언어 선호 유지 (단 해당 Part ko 없으면 en) |

---

## 9. 구현 순서 (Do 체크리스트)

1. `oshaMdx.tsx`: `enLoaders`/`koLoaders` 분리 + `loadOshaScsPartMdx(partId, lang)` + `hasOshaScsKo` (FR-2/3/7)
2. `LanguageToggle.tsx` 신규 작성 (FR-4/5/6, Chip 재사용)
3. `part-1a.ko.mdx` 번역 작성 (FR-1, AI 초벌 → 용어 검수)
4. `[part]/page.tsx` 통합 + 헤더 L92–94 고정 안내문구 **삭제** → `enNotice`/`koNotice` 조건부 이전 (FR-8)
5. ~~extract-quotes 스킵 가드~~ → **불필요 확정**(§6). `npm run extract:quotes` 후 quotes.json diff 0만 확인 (NFR-3)
6. `npm run typecheck && npm run lint && npm run build` (NFR-2)
7. Playwright: 토글 클릭 본문 교체 + aria-pressed + localStorage 영속 검증 (NFR-4, DoD)

---

## 10. 테스트 / 검증 전략

| 항목 | 방법 |
|------|------|
| 토글 전환 | Playwright: `한국어`/`EN` Chip 클릭 → 본문 텍스트 스냅샷 차이 |
| 영속성 | localStorage 설정 후 reload → 언어 유지 |
| 접근성 | aria-pressed 토글, Tab focus-visible ring, role="group" |
| Fallback | part-1b 진입 → 토글 미노출 + en 본문 확인 |
| 산출물 회귀 | `quotes.json` diff 0 (OSHA 26 인용 불변) |
| 빌드 | typecheck/lint/build 무오류, 7 prerendered route 유지 |

---

## 11. 확장 경로 (후속 사이클)

1. `part-1b.ko.mdx` ~ `part-4.ko.mdx` 번역 작성
2. `koLoaders`에 각 1줄 등록
3. → 토글 자동 노출. **컴포넌트·page·타입 무수정** (NFR-5 실증 대상)

(선택) 향후 한글 인용 인덱싱이 필요해지면 extract-quotes에 lang 차원 추가 — 별도 사이클.

---

## 12. 설계 검증 (코드베이스 대조, 2026-06-02)

설계 가정을 실제 코드와 대조해 Do 단계 리스크를 사전 제거.

| # | 검증 항목 | 코드 근거 | 결과 |
|---|-----------|-----------|------|
| V-1 | `Chip`이 `pressed` + `onClick`/`aria-label`/`children`을 받는가 | `src/components/ui/Chip.tsx` — `pressed: boolean` 필수, 나머지 `ButtonHTMLAttributes` 스프레드 | ✅ 설계대로 사용 가능 |
| V-2 | `SourceLanguage`·`SOURCE_LANGUAGE_LABELS` 존재 | `src/lib/types.ts` L191/L247 — `'ko'\|'en'`, `{ ko:'KO', en:'EN' }` | ✅ `SOURCE_LANGUAGE_LABELS.en='EN'` → `[EN]` 라벨 일치 |
| V-3 | `oshaMdx.tsx` 시그니처 확장 안전성 | `loadOshaScsPartMdx(partId)` 단일, `oshaScsMdxLoaders`는 비공개 로컬 상수 (외부 import 0) | ✅ `enLoaders` rename + `koLoaders` 추가 안전 |
| V-4 | 헤더 안내문구 삭제 지점 | `[part]/page.tsx` L92–94 `<p>...원본 transcript...</p>` (header 내부, prose div 밖) | ✅ 삭제 후 `enNotice`로 이전 (텍스트 동일) |
| V-5 | extract-quotes의 `.ko.mdx` 처리 | `OSHA_PART_META` 배열 순회 + `${partId}.mdx` 명시 join (L401/L452), `readdirSync`는 `CHAPTERS_DIR`만 | ✅✅ 글롭 아님 → **스킵 가드 불필요**, quotes.json 회귀 0 |

> 사소: 한국어 Chip은 라벨 상수(`KO`) 대신 가독성을 위해 전체 단어 `"한국어"`를 하드코딩(의도적). EN만 `SOURCE_LANGUAGE_LABELS.en` 사용 — 일관성보다 명료성 우선.

---

## 13. 다음 단계

→ `/pdca do osha-bilingual-toggle` — §9 구현 순서대로 진행
