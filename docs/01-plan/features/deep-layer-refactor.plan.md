# deep 레이어 인용/요약 분리 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `LayeredExplain`의 Deep 레이어에서 원문 인용(`quote`)과 요약/재서술(`summary`)을 데이터 모델·UI로 분리하고, textbook 소스 106개를 `summary`로 이관한다.

**Architecture:** `deep` prop을 discriminated union `{quote,…} | {summary,…}`으로 바꾸고 컴포넌트가 종류별로 렌더한다. 콘텐츠 106개는 결정론적 코드모드로 `quote:`→`summary:` 개명 + `(재서술)` 마커 제거. `extract-quotes`는 `quote:`만 추출(요약 구조적 배제).

**Tech Stack:** Next.js 15 App Router, TypeScript, MDX, Node ESM 스크립트. 테스트 러너 없음 → 검증은 `typecheck`·`lint`·`build`·`quotes.json` 회귀·육안 확인.

**설계 문서:** `docs/02-design/features/deep-layer-refactor.design.md`
**브랜치:** `DrunkenZealnut/refactor-deep-layer` (이미 생성, `f265a56`에서 분기, spec 커밋 `8a7247e`)

---

## File Structure

| 파일 | 책임 | 변경 |
|------|------|------|
| `src/components/content/LayeredExplain.tsx` | Deep 레이어 렌더 (quote/summary 분기) | 수정 |
| `src/content/sources/**/*.mdx` (106) | textbook 재서술 콘텐츠 | 코드모드 수정 |
| `scripts/migrate-deep-summary.mjs` | 일회용 코드모드 | 생성 |
| `scripts/extract-quotes.mjs` | 인용 추출 (summary 배제 가드) | 수정 |

---

## Task 1: 컴포넌트 — union 타입 + summary 렌더 분기

**Files:**
- Modify: `src/components/content/LayeredExplain.tsx` (전체 교체, 현재 62줄)

- [ ] **Step 1: 컴포넌트를 union 타입 + 2분기 렌더로 교체**

`src/components/content/LayeredExplain.tsx` 전체를 아래로 교체:

```tsx
import { Sparkles, Lightbulb } from 'lucide-react';
import { Disclosure } from '@/components/ui/Disclosure';
import type { ReactNode } from 'react';

type DeepQuote = { quote: ReactNode; sourcePage?: number; sourceSection?: string };
type DeepSummary = { summary: ReactNode; sourceSection?: string };

interface LayeredExplainProps {
  hook: ReactNode;
  easy: {
    analogy: ReactNode;
    illustration?: ReactNode;
  };
  deep?: DeepQuote | DeepSummary;
}

export function LayeredExplain({ hook, easy, deep }: LayeredExplainProps) {
  return (
    <div className="not-prose my-6 space-y-3">
      {/* Layer 1: Hook */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-4 text-white shadow-md">
        <div className="flex items-start gap-2">
          <Sparkles aria-hidden className="mt-0.5 size-5 shrink-0" />
          <p className="text-lg font-semibold leading-snug">{hook}</p>
        </div>
      </div>

      {/* Layer 2: Easy */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
          <Lightbulb aria-hidden className="size-4" />
          쉽게 말하면
        </div>
        <div className="text-base leading-relaxed text-slate-800 dark:text-slate-100">
          {easy.analogy}
        </div>
        {easy.illustration && (
          <div className="mt-4 flex justify-center">{easy.illustration}</div>
        )}
      </div>

      {/* Layer 3a: Deep — 원문 인용(verbatim) */}
      {deep && 'quote' in deep && deep.quote && (
        <Disclosure
          title={`📖 학술 원본 보기${
            deep.sourcePage ? ` (p.${deep.sourcePage})` : ''
          }${deep.sourceSection ? ` — ${deep.sourceSection}` : ''}`}
        >
          <blockquote className="border-l-4 border-brand-400 pl-4 italic text-slate-700 dark:text-slate-300">
            {deep.quote}
          </blockquote>
          {deep.sourcePage && (
            <p className="mt-2 text-right text-xs text-slate-500 dark:text-slate-400">
              — 「반도체 산업의 유해인자」 p.{deep.sourcePage}
            </p>
          )}
        </Disclosure>
      )}

      {/* Layer 3b: Deep — 요약/재서술(paraphrase) */}
      {deep && 'summary' in deep && deep.summary && (
        <Disclosure
          title={`📘 자료 정리 보기${
            deep.sourceSection ? ` — ${deep.sourceSection}` : ''
          }`}
        >
          <div className="border-l-4 border-slate-300 pl-4 text-slate-700 dark:border-slate-600 dark:text-slate-300">
            {deep.summary}
          </div>
        </Disclosure>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 타입 검증**

Run: `npm run typecheck`
Expected: 에러 0 (통과)

- [ ] **Step 3: 커밋**

```bash
git add src/components/content/LayeredExplain.tsx
git commit -m "feat(deep-layer): LayeredExplain deep prop을 quote|summary union으로 분리

요약(summary)은 '📘 자료 정리 보기' non-italic 프레임으로 렌더, 원문
인용(quote)은 현행 '📖 학술 원본 보기' italic 유지.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: 코드모드 — textbook 106개 quote→summary 이관

**Files:**
- Create: `scripts/migrate-deep-summary.mjs`
- Modify: `src/content/sources/**/*.mdx` (재서술 106개, 코드모드가 자동 수정)

- [ ] **Step 1: 코드모드 스크립트 작성**

`scripts/migrate-deep-summary.mjs` 생성:

```js
// 일회용 코드모드: textbook 재서술 106개 파일의 deep.quote → deep.summary 개명 +
// sourceSection의 (재서술) 마커 제거. 재실행하면 대상 0개(idempotent).
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

// grep은 매치 0건일 때만 exit 1. exit 1은 "결과 없음"으로 허용하고, 그 외
// 상태(경로 오류·권한 등)는 실패로 전파해 조용한 오탐 종료를 막는다.
function grepFiles(pattern, path) {
  try {
    return execSync(`grep -rl ${pattern} ${path}`, { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch (e) {
    if (e.status === 1) return []; // 매치 없음
    throw e;
  }
}

// 치환 후 문자열과 실제 치환 건수를 함께 반환 (파일 전역 오치환 감지용).
function countAndReplace(str, re, repl) {
  const n = (str.match(re) || []).length;
  return [str.replace(re, repl), n];
}

const files = grepFiles("'재서술'", 'src/content/sources');

let changed = 0;
for (const f of files) {
  const orig = readFileSync(f, 'utf8');
  // 1) deep 블록의 인용 필드만: `\n  quote: (` → `\n  summary: (` (property-position)
  const [s1, nQuote] = countAndReplace(orig, /(\n[ \t]*)quote:([ \t]*\()/g, '$1summary:$2');
  // 2) sourceSection의 (재서술) 마커 제거 (접미형 + embedded형)
  const [s2, nSuffix] = countAndReplace(s1, / \(재서술\)'/g, "'");
  const [s3, nEmbed] = countAndReplace(s2, /, 재서술\)'/g, ")'");
  // 대상 파일은 정확히 quote 1건 + 마커 1건이어야 한다. 다르면 파일 전역
  // 오치환 가능성이므로 중단 (다른 필드·본문의 동일 문자열 변형 방지).
  if (nQuote !== 1 || nSuffix + nEmbed !== 1) {
    throw new Error(
      `${f}: 예상치 못한 치환 수 (quote=${nQuote}, marker=${nSuffix + nEmbed}). 중단.`
    );
  }
  if (s3 !== orig) {
    writeFileSync(f, s3, 'utf8');
    changed++;
  }
}
console.log(`scanned: ${files.length}, changed: ${changed}`);
```

- [ ] **Step 2: 실행 전 대상 스냅샷 확인**

Run:
```bash
echo "재서술 파일: $(grep -rl '재서술' src/content/sources | wc -l | tr -d ' ')"
echo "그중 quote: 포함: $(grep -rl '재서술' src/content/sources | xargs grep -l 'quote:' | wc -l | tr -d ' ')"
```
Expected: `재서술 파일: 106`, `그중 quote: 포함: 106`

- [ ] **Step 3: 코드모드 실행**

Run: `node scripts/migrate-deep-summary.mjs`
Expected: `scanned: 106, changed: 106`

- [ ] **Step 4: 결과 검증 (잔존 0 · summary 106 · idempotent)**

Run:
```bash
echo "재서술 잔존: $(grep -rl '재서술' src/content/sources | wc -l | tr -d ' ')"
echo "textbook quote: 잔존: $(grep -rl 'quote:' src/content/sources/daegu-hs-process src/content/sources/hs-assembly-inspection src/content/sources/hs-basic-tech-1 src/content/sources/hs-basic-tech-2 src/content/sources/hs-equipment-maintenance src/content/sources/hs-photo-etch src/content/sources/hs-semicon-basics src/content/sources/hs-semicon-infra src/content/sources/hs-thinfilm-diffusion 2>/dev/null | wc -l | tr -d ' ')"
echo "textbook summary: 파일: $(grep -rl 'summary:' src/content/sources/daegu-hs-process src/content/sources/hs-assembly-inspection src/content/sources/hs-basic-tech-1 src/content/sources/hs-basic-tech-2 src/content/sources/hs-equipment-maintenance src/content/sources/hs-photo-etch src/content/sources/hs-semicon-basics src/content/sources/hs-semicon-infra src/content/sources/hs-thinfilm-diffusion 2>/dev/null | wc -l | tr -d ' ')"
node scripts/migrate-deep-summary.mjs
```
Expected: `재서술 잔존: 0`, `textbook quote: 잔존: 0`, `textbook summary: 파일: 106`, 마지막 재실행 `scanned: 0, changed: 0` (idempotent)

- [ ] **Step 5: diff 스팟 체크 (한 파일 육안)**

Run: `git diff src/content/sources/hs-semicon-infra/safety-backend-chemical.mdx`
Expected: `quote: (` → `summary: (` 1곳, `sourceSection`의 `(재서술)` 마커(앞 공백 포함) 제거. 다른 변경 없음.

- [ ] **Step 6: 커밋 (콘텐츠 + 코드모드 스크립트)**

```bash
git add src/content/sources scripts/migrate-deep-summary.mjs
git commit -m "refactor(deep-layer): textbook 재서술 106개 deep.quote → deep.summary 이관

코드모드(scripts/migrate-deep-summary.mjs)로 quote:→summary: 개명 + (재서술)
마커 제거(접미 102·embedded 4). ncs-semi·chapters는 원문 인용이라 불변.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: extract-quotes — summary 배제 가드

**Files:**
- Modify: `scripts/extract-quotes.mjs` (`extractLayeredExplain` 함수, 현재 185번째 줄 인근)

- [ ] **Step 1: 명시적 가드 추가**

`scripts/extract-quotes.mjs`에서 아래 문자열을

```js
    const pageMatch = deepBody.match(/sourcePage\s*:\s*(\d+)/);
    const sectionMatch = deepBody.match(/sourceSection\s*:\s*['"]([^'"]+)['"]/);
    const quoteIdx = deepBody.indexOf('quote:');
```

다음으로 교체 (맨 앞에 가드 1줄 추가):

```js
    // summary(요약) 전용 블록 제외: deep 객체에 quote 속성(줄 시작 위치)이 없으면 skip.
    // 라인 스캐너 방침에 맞춘 property-position 가드 — 본문 산문의 'quote:' 오탐 방지.
    if (!/\n\s*quote\s*:/.test(deepBody)) continue;
    const pageMatch = deepBody.match(/sourcePage\s*:\s*(\d+)/);
    const sectionMatch = deepBody.match(/sourceSection\s*:\s*['"]([^'"]+)['"]/);
    const quoteIdx = deepBody.indexOf('quote:');
```

- [ ] **Step 2: 추출 재실행 + 회귀 확인**

Run:
```bash
npm run extract:quotes
node -e "console.log('quotes:', require('./src/data/quotes.json').length)"
```
Expected: `quotes: 214` (무회귀 — chapters·osha는 quote 유지)

- [ ] **Step 3: 커밋**

```bash
git add scripts/extract-quotes.mjs src/data/quotes.json
git commit -m "chore(deep-layer): extract-quotes에 summary 배제 가드 추가

deep.quote 없는(summary 전용) 블록은 인용 추출에서 조기 제외. quotes 214 무회귀.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: 전체 검증 게이트

**Files:** 없음 (검증만; 데이터 아티팩트 변경 시 커밋)

- [ ] **Step 1: 데이터 재생성**

Run: `npm run extract:quotes && npm run build:cross-link`
Expected: cross-link `unknown 0`, `exit 0` (검증 실패 없음), quotes 214

- [ ] **Step 2: 정적 검사**

Run: `npm run typecheck && npm run lint`
Expected: typecheck 0, lint 신규 경고 0 (기존 warning 2건만 — ExternalLink·img)

- [ ] **Step 3: 빌드**

Run: `npm run build`
Expected: 정적 export 성공(에러 0)

- [ ] **Step 4: 육안 확인 (dev)**

Run: `npm run dev` (포트 3016) 후 브라우저에서
- textbook 페이지 1개(예: `/sources/hs-semicon-infra/safety-backend-chemical/`) → Deep이 **"📘 자료 정리 보기"** non-italic 프로즈로 렌더, "학술 원본"·italic 인용 스타일 없음
- 챕터 페이지 1개(예: `/chapter/…`) → **"📖 학술 원본 보기 (p.N)"** italic 인용 그대로(무회귀)

Expected: 위 두 조건 충족

- [ ] **Step 5: 아티팩트 커밋 (변경 시)**

```bash
git add src/data/quotes.json src/data/cross-link.json
git commit -m "chore(deep-layer): 데이터 아티팩트 재생성 (검증 게이트)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
(변경 없으면 skip)

---

## Task 5: Push + PR (⚠️ 사용자 확인 후)

**Files:** 없음 (원격 작업 — outward-facing, 사용자 승인 필요)

- [ ] **Step 1: push**

Run: `git push -u origin DrunkenZealnut/refactor-deep-layer`

- [ ] **Step 2: PR 생성 (base = #24 브랜치, 스택)**

```bash
gh pr create --base DrunkenZealnut/safedata-injection --head DrunkenZealnut/refactor-deep-layer \
  --title "refactor(deep-layer): deep.quote 재서술 → deep.summary 분리" \
  --body "$(cat <<'EOF'
CodeRabbit PR #24 지적(deep.quote 재서술)을 별도 PR로 리팩터링.

- LayeredExplain deep prop을 {quote}|{summary} union으로 분리
- 요약은 "📘 자료 정리 보기" non-italic 프레임 (원문 인용은 현행 유지)
- textbook 106개 코드모드 이관 (quote→summary, (재서술) 마커 제거)
- extract-quotes summary 배제 가드
- 게이트: typecheck 0·lint 신규 0·quotes 214 무회귀·cross-link unknown 0·build 성공

설계: docs/02-design/features/deep-layer-refactor.design.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: #24 머지 후 base retarget**

`#24` 머지되면: `gh pr edit <PR#> --base main` 후 필요 시 `git rebase origin/main`.

---

## Self-Review (계획 검증)

- **Spec coverage**: §4.1 union→Task1 / §4.2 렌더→Task1 / §4.3 코드모드→Task2 / §4.4 가드→Task3 / §6 게이트→Task4 / §5 브랜치·PR→Task5. 전 항목 매핑됨.
- **Placeholder**: 모든 코드 스텝에 실제 코드·명령·기대출력 포함. TBD 없음.
- **Type 일관성**: `DeepQuote`/`DeepSummary`/`deep.quote`/`deep.summary` 명칭이 Task1 정의와 Task2·3 사용에서 일치. 코드모드 정규식 `quote:→summary:`가 컴포넌트 필드명과 정합.
- **엣지**: 재서술 파일당 `quote:` 1회·`sourcePage` 0회 확인됨(예외 없음). 마커 2형(102 접미·4 embedded) 모두 규칙화.
