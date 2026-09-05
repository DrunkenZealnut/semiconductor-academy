/**
 * 문서 링크 관문 — 마크다운 링크·이미지와 **JSX/HTML의 `src=""`·`href=""`** 대상이 실재하는지 본다.
 *
 * ★속성까지 보는 이유는 실측이다 — 마크다운 `![]()`는 **4건**뿐이고 살아 있는 페이지의 이미지는
 * **여러 줄에 걸친 `<ImageFigure ... src="/..." />`** 꼴 **425건**이다. 앞의 넷만 보면서
 * *"이미지도 본다"* 고 적으면 **0.9%를 덮고** 닫았다고 말하는 것이 된다(Check 2차 G-1).
 * ★초판은 이 자리를 `<img src=`라 적었는데 **`src/content`에 그 꼴은 없다**(3차 A-1).
 * ★그 뒤로 *"저장소 전체로는 N건"* 을 두 번 적었고 **두 번 다 틀렸다**(적는 순간 그 문장이
 * 한 건을 더 만든다 — 6차 시점에 판독문 자신이 그랬다). **그래서 수를 안 적는다.**
 * *무엇을 보는지 자체를 틀리게 적었다.* 형태를 안 재고 적으면 근거가 근거가 아니다.
 *
 * ★**절대 경로를 `public/`으로 푸는 근거는 HTML 규칙이 아니라 컴포넌트 계약이다** —
 * `src/components/content/ImageFigure.tsx`가 `src.startsWith('/') ? basePath + src : src`로 쓴다.
 *
 * Design: docs/02-design/features/doc-link-gate.design.md
 *
 * ```bash
 * npm run verify:links
 * npm run verify:links -- --self-test   # 대조군만
 * ```
 *
 * ★**정규식이 아니라 파서로 판정한다.** 착수 실측: 사고 링크 후보를 정규식으로 찾으면 4건인데
 * 파서가 인정한 것은 **1건**이다(나머지 셋은 목적지에 공백이 있어 CommonMark상 링크가 아니다).
 * **거짓 경보 75%짜리 관문은 곧 무시된다.**
 *
 * ★**`remark-mdx`는 쓰지 않는다.** 실측: `.mdx`에서 링크 집합 차이가 **정확히 0**인데
 * `.md` 13개를 파싱 실패시킨다(`<br>`·`<ol>`·`<2026-05`). **얻는 것이 없고 잃는 것이 있다.**
 * `remark-gfm`은 쓴다 — `.md`에서 자동 링크 23건이 여기서만 보이고, 앱도 GitHub도 GFM이다.
 *
 * ★**allow 파일이 없다 — 일부러 없다.** 도해 관문에는 `diagram-check-allow.json`이 있는데
 * 여기 없는 이유는 **필요가 0으로 측정됐기 때문**이다: 문서가 링크를 *설명하는* 자리는
 * 거의 언제나 백틱 안이고, **파서가 코드 스팬을 건너뛴다.** 파일 후보 115건 중 모양(글로브·
 * 플레이스홀더) **0건**이었다. 필요가 생기면 그때 만들고 그 diff가 근거가 된다.
 * (진짜로 예시를 쓰려는 사람에게는 위반 메시지가 백틱을 권한다 — **우회로가 공짜다**.)
 *
 * **종료 코드는 계약이다** — `0` 통과 · `1` 콘텐츠 위반(대상이 없다) ·
 * `2` **검사기가 자기 범위를 주장할 수 없음** — *검사기가 판정을 못 하겠다고 말하는 모든 자리.*
 *
 * ★★**자리를 여기 열거하지 않는다.** 이 목록은 **세 번 낡았다**:
 *   두 번은 편집 배치의 뒤 항목이 죽어 **쓰기가 통째로 안 됐는데 ✅만 보고 넘어갔고**
 *   (→ 편집마다 즉시 쓰고 **다시 읽도록** 도구를 고쳤다),
 *   세 번째는 **쓰기는 성공했는데 손으로 센 열거가 불완전**했다 —
 *   *같은 배치가 만든 자리 둘*(`keys()`의 키 누락 · 죽은 해석기 키)을 빠뜨렸고,
 *   *"`fail()`이 가는 자리 전부"* 라 적어 놓고 절반은 `fail()`이 아니라 직접 `process.exit(2)`였다.
 *
 * **도구를 고쳐도 손 열거는 안 고쳐진다.** 이 파일은 이미 상한 목록에서
 * *"손으로 세는 수는 다음에도 틀린다 — 목록만 남기면 틀릴 수가 없다"* 로 한 번 강등했는데
 * **목록도 틀렸다.** 다음 강등은 하나뿐이다 — **유도하거나 지운다.** 지운다:
 *
 *   자리를 알고 싶으면 소스에게 물어라 —
 *   `rg 'fail\(|process\.exit\(2\)' scripts/verify-doc-links.mjs`
 *
 * 각 자리는 **자기 사유 문자열**을 들고 있고, 그것이 유일한 진실이다.
 *
 * ★**대조군을 만들 수 없는 자리들** — **세지 않는다, 열거만 한다:**
 *   · `dieOnCrash` 등록                · 무리 이름 가드
 *   · `!(kind in tally)`                · `!(node in byNode)`
 *   · `CONTROLS`/`seen` 불일치 단언     · 식별자 **유일성** 단언 · 식별자 **모양·무리** 단언
 *   · `runSelfTest`의 예외 catch → exit 2      · `--self-test` 실패 → exit 2
 *   · `fromTs()`의 **캐시**(*"한 번만 뜬다"*) — 지워도 결과가 같아 아무도 안 운다
 *   · `existsSync(bin)` 가드 — **행동상 잉여다**(지워도 `spawnSync`가 ENOENT로 같은 `fail` 경로로 간다)
 *   · ★**`!DLG_CHILD`로 조건 지어진 자리들** — **구조적으로 관측 불가**다.
 *     자식을 `DLG_CHILD` 없이 돌리면 자체검사가 **재귀**하기 때문이다. 지금 둘이다:
 *       — **본 검사 앞 게이트**(`!DLG_CHILD && !await runSelfTest()`): **가장 값진 무보증 자리**.
 *         그 배선이 죽으면 자체검사 실패가 본 검사를 못 막고 **대조군 전부가 장식**이 된다.
 *       — **죽은 해석기 키 검사**의 `!process.env.DLG_CHILD ||` 분지: 그것만 지우면
 *         `DLG_KEYCHECK`를 직접 넘기는 대조군들이 그대로 통과해 **아무도 안 운다**
 *         (판정은 덮였고 **배선**이 안 덮였다 — 이 저장소가 반복해 앓는 그 모양).
 *     ★**통제할 방법이 없다. 줄이려면 조건을 없애야 한다** — `okTree`가 기본으로 8종 라우트와
 *     가짜 TS를 소유하게 하면 조건이 사라지지만, 자식 전부가 `tsx`를 띄운다. 비용을 재고 정할 일이다.
 *
 * ★★**수를 안 적는다.** 넷 → 다섯 → 여섯 → 일곱으로 **다섯 번 틀렸고** 매번 *"이제 맞다"* 고 적었다.
 * **손으로 세는 수는 다음에도 틀린다 — 목록만 남기면 틀릴 수가 없다.**
 * 장치를 더하면 줄을 더한다, 수를 고치지 않는다.
 * ★선행 사이클(7차)이 *"수를 지우고 목록만 남겼다"* 고 **보고서에까지 적었는데 실제로는 안 들어갔다** —
 * 편집 배치의 뒤 항목이 예외로 죽어 **쓰기가 통째로 안 됐고, ✅만 보고 넘어갔다.**
 * *성공 메시지는 성공이 아니다.* 이번에 실제로 넣는다.
 *
 * 전부 **소스를 훼손해야** 관측되는데 이 관문에는 감사가 없다(위 D-4). 선행 사이클은 감사로
 * 그런 자리를 닫았다(*핸들러를 빼면 2→1 · 이름 가드를 무력화하면 2→0*). **여기서는 못 닫는다 —
 * 그래서 적는다.** 백로그 **F-12**(`docs/archive/2026-09/doc-link-gate/doc-link-gate.analysis.md` §6 — 4차 E:
 * 초판은 여기서 F-12를 인용했는데 **그 ID가 어디에도 없었다.** *"그래서 적는다"* 가 거짓 문장이었다).
 * 덮을 수 없는 것을 덮었다고 세면 수치가 거짓말을 한다.
 *
 * **안 보는 것**(성공 출력이 스스로 말한다) — 외부 URL(네트워크가 필요하다) ·
 * 인라인 코드의 경로 언급(대부분 아카이브 문서의 **정당한 역사 기술**이다) · 앵커의 실재 여부 ·
 * 참조 링크(`[a][b]`) · JSX 속성이 **표현식**인 것(`src={…}`) ·
 * `.mdx`에서 JSX 여는 태그 **바로 다음 줄**의 링크(HTML 블록에 삼켜진다) · `data/` · **대소문자**.
 * ★그 목록은 **출력에만 있으면 무대조군이다** — *정상 트리* 대조군이 사유 정규식으로 관측한다.
 *
 * ★**감사(`audit:wiring` 같은 것)를 만들지 않는다**(Design D-4). 감사가 답하는 질문은
 * *"판정이 본 검사에서 살아 있는가(배선)"* 인데, 이 관문은 **판정 호출이 `runMain()` 한 자리**뿐이라
 * 층이 얇다. 대신 그 사실을 여기 적는다 — 층이 두꺼워지면 그때 붙인다.
 * **안 만든 것을 안 적으면 "덮었다"로 읽힌다.**
 *
 * ★**자식은 임시 cwd에서 도는데 `import 'unified'`가 풀리는 것은 우연이 아니다.** Node ESM의
 * bare specifier 해석은 **불러오는 모듈의 URL**에서 위로 올라가지 cwd를 보지 않는다. 자식에게
 * 넘기는 경로가 저장소 안의 절대 경로라 `node_modules`를 저장소에서 찾는다. 임시 cwd는
 * `readJson`·`APP_DIR` 같은 **cwd 상대 접근에만** 작용한다 — 그것이 노린 바다.
 */
import { readdirSync, readFileSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import * as tsSpawn from 'node:child_process';

/** 관문 자신의 절대 경로 — `tsx`를 **cwd가 아니라 여기서** 푼다(자식은 임시 cwd에서 돈다). */
const SELF = fileURLToPath(import.meta.url);

/** ★파서를 못 얻으면 **판정을 흉내 내지 않고 죽는다**(exit 2). 전이 의존이 아니라
 *  `devDependencies`에 올려 두었지만, 그래도 없을 수 있다 — 그때 정규식으로 물러서면
 *  거짓 경보 75%짜리 관문이 조용히 대신 선다. */
let unified, remarkParse, remarkGfm, visit;
try {
  ({ unified } = await import('unified'));
  remarkParse = (await import('remark-parse')).default;
  remarkGfm = (await import('remark-gfm')).default;
  ({ visit } = await import('unist-util-visit'));
} catch (e) {
  console.error(`❌ 마크다운 파서를 불러오지 못했다 — ${e?.message ?? e}`);
  console.error('   (정규식으로 물러서지 않는다: 실측상 거짓 경보 75%다. npm i 를 먼저 하라.)');
  process.exit(2);
}

/** ★**소요도 스스로 찍는다**(Check G-3). 개수는 코드가 드는데 소요만 손 숫자로 두면
 *  `CLAUDE.md`가 두 정책을 동시에 주장하게 된다 — 선행 백로그 F-1이 그 모양이었다. */
const T0 = Date.now();

const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'data', '.bkit', 'coverage']);
const APP_DIR = 'src/app';
const PUBLIC_DIR = 'public';

/** 동적 라우트 해석기. ★**여기 없는 동적 라우트로 가는 링크는 `exit 2`다** —
 *  조용히 통과시키면 그 라우트는 영영 무검사다(렌더 관문의 δ와 같은 처분).
 *  지금 등록된 것이 하나뿐인 이유는 **실측상 링크가 그리로만 가기 때문**이다. */
const ROUTE_RESOLVERS = {
  // ★`?? p.id` 폴백을 두지 않는다(Check). 실측: `processes.json`에 `slug` 없는 항목이 **0개**라
  // 그 경로는 **한 번도 안 돈다.** 무근거 폴백은 3주 전 커밋(`02aafac`)이 지운 병이다 —
  // 없는 길을 열어 두면 그 길이 옳은지 아무도 모른 채 남는다. `slug`가 없어지면 여기서 운다.
  '/process/[slug]': () => keys('src/data/processes.json', 'slug'),
  // ── JSON에서 오는 둘 ────────────────────────────────────────
  '/chapter/[slug]': () => keys('src/data/chapters.json', 'slug'),
  '/chemicals/[id]': () => keys('src/data/chemicals.json', 'id'),
  // ── TypeScript에서 오는 다섯 ────────────────────────────────
  // ★`.mjs`는 TS를 못 읽는다 — `CLAUDE.md`가 명시한 **수동 미러**의 원인이다.
  // 그런데 `tsx`가 devDependency로 있고 **앱의 진짜 원천을 그대로 평가한다**(실측 0.35초).
  // → **미러를 새로 만들지 않는다.** 새 JSON 미러는 이 저장소의 *세 번째* 수동 미러가 됐을 것이다.
  '/sources/[source]': () => fromTs().sources,
  '/sources/[source]/[module]': () => fromTs().sourceModules,
  '/sources/osha-scs/[part]': () => fromTs().oshaParts,
  '/sources/ncs-semi/[module]': () => fromTs().ncsModules,
  '/sources/daegu-hs-process/[module]': () => fromTs().daeguModules,
};

/**
 * 앱의 TypeScript 원천에서 라우트 값을 받아 온다.
 *
 * ★**한 번만 뜬다** — 다섯 템플릿이 같은 결과를 공유한다(따로 부르면 `tsx`가 다섯 번 뜬다).
 * ★**필요할 때만 뜬다** — 해석기는 스캔된 `src/app`에 그 템플릿이 있을 때만 불린다.
 *   대부분의 대조군 트리에는 없으므로 **`tsx`가 아예 안 뜬다**(자식이 안 무거워진다).
 * ★**절대 경로로 부른다** — `npx`도 cwd 상대도 아니다. 자식은 **임시 cwd**에서 돌기 때문에
 *   cwd 상대로는 `tsx`를 못 찾는다. 관문 **자신의 위치**에서 `node_modules/.bin/tsx`를 푼다.
 *   (그러면 자식이 소유한 **가짜 TS**를 평가한다 — 대조군이 저장소 상태와 무관해진다.)
 * ★죽으면 **`exit 2`** — 라우트를 열거하지 못하면 검사기가 자기 범위를 주장할 수 없다.
 *   `sources.ts`에는 **의도된 `throw`** 가 있다(로더 미등록 시). 그때 관문이 죽는 것이 옳다.
 *
 * **선**: 이 관문은 라우트를 **열거**할 수 있는지만 본다 —
 * 앱 데이터의 **내용**(제목이 비었나 · 순서가 맞나)은 안 본다. 그것은 다른 관문의 일이다.
 */
let tsCache = null;
function fromTs() {
  if (tsCache) return tsCache;
  const { spawnSync } = tsSpawn;
  const bin = path.resolve(path.dirname(SELF), '..', 'node_modules', '.bin', 'tsx');
  if (!existsSync(bin)) fail(`tsx를 찾을 수 없다(${bin}) — 앱의 TS 원천에서 라우트를 열거할 수 없다.`);
  const r = spawnSync(bin, ['-e', TS_PROBE], { encoding: 'utf8', maxBuffer: 32e6, timeout: 60_000 });
  if (r.status !== 0) {
    // ★**던진 메시지를 고른다 — 스택 꼬리가 아니다**(대조군 D-22가 잡았다).
    // 마지막 세 줄만 취하면 `at [eval]:6:69` 같은 프레임만 남아 **왜 죽었는지가 사라진다.**
    const out = (r.stderr ?? '') + (r.stdout ?? '');
    const lines = out.split('\n').filter(Boolean);
    const detail = (lines.find((l) => /Error:/.test(l)) ?? lines.slice(-3).join(' | ')).trim();
    fail(`tsx가 앱의 라우트 원천을 열거하지 못했다(종료 ${r.status}) — ${detail.slice(0, 400)}`);
  }
  try { tsCache = JSON.parse(r.stdout.trim().split('\n').pop()); }
  catch (e) { fail(`tsx 출력이 JSON이 아니다 — ${e?.message ?? e}`); }
  return tsCache;
}

/** `tsx`에 먹이는 프로그램. **앱이 `generateStaticParams`에서 쓰는 것과 같은 함수**를 부른다. */
const TS_PROBE = `
import { getOrderedSources, getSource, OSHA_SCS, NCS_SEMI, DAEGU_HS } from './src/lib/sources.ts';
import { listSchoolTextSourceIds, hasModuleLoader } from './src/lib/schoolTextMdx.tsx';
// ★**앱의 가드를 그대로 가져온다**(Check 1차 G-1). 초판은 \`?? []\`로 삼키고 로더 검사를 안 해서
// *"앱이 쓰는 바로 그 함수를 부른다"* 가 **가장 큰 해석기에서 거짓**이었다 —
// 로더 없는 모듈을 유효 라우트로 인정해, **앱이 빌드 못 하는 URL에 링크를 걸어도 초록**이었다.
// 던지면 관문은 exit 2다: 라우트를 열거할 수 없으면 범위를 주장할 수 없다.
console.log(JSON.stringify({
  sources: getOrderedSources().map((s) => s.id),
  sourceModules: listSchoolTextSourceIds().flatMap((id) => {
    const src = getSource(id);
    if (!src) throw new Error(\`\${id}: REGISTRY에 있는데 sources.ts에 메타데이터가 없다\`);
    return src.sections.map((x) => {
      if (!hasModuleLoader(id, x.id)) throw new Error(\`\${id}/\${x.id}: sections에 있는데 로더가 없다\`);
      return id + '/' + x.id;
    });
  }),
  oshaParts: OSHA_SCS.sections.map((s) => s.id),
  ncsModules: NCS_SEMI.sections.map((s) => s.id),
  daeguModules: DAEGU_HS.sections.map((s) => s.id),
}));
`;

function readJson(p) {
  return JSON.parse(readFileSync(p, 'utf8'));
}

/**
 * JSON 배열에서 키 값을 뽑는다. ★**`.filter(Boolean)`을 쓰지 않는다** — 조용한 축소는
 * 세 줄 위에서 `?? p.id` 폴백을 거부한 것과 **같은 부류**다(한 주석 안에 두 정책이었다).
 * 앱은 그 항목에서 빌드가 깨지는데 관문만 조용히 줄이면, 그 링크에 **거짓 `exit 1`** 이 난다.
 */
function keys(file, prop) {
  const rows = readJson(file);
  const missing = rows.map((r, i) => (r?.[prop] ? null : i)).filter((i) => i !== null);
  if (missing.length) fail(`${file}의 항목 ${missing.join(',')}에 '${prop}'이 없다 — 라우트를 열거할 수 없다.`);
  return rows.map((r) => r[prop]);
}

// ───────────────────────────────────────────────────────────────
// 판정 — 순수 함수 셋. 대조군이 이것들을 **직접** 먹인다.
// ───────────────────────────────────────────────────────────────

/**
 * 링크를 갈래로 나눈다.
 * (`export`가 없는 이유 — 이 파일 밖에서 아무도 안 쓴다. 자체검사가 같은 파일 안에 있다.
 *  *"누군가 쓰겠지"* 로 표면을 넓히지 않는다. 필요해지면 그때 붙인다.)
 */
function classify(url) {
  if (url == null || url === '') return 'empty';
  if (url.startsWith('//')) return 'external';          // 프로토콜 상대
  if (/^[a-z][a-z0-9+.\-]*:/i.test(url)) return 'external';   // http: · mailto: · tel:
  if (url.startsWith('#')) return 'anchor';
  if (url.startsWith('/')) return 'route';
  return 'file';
}

/** 파일 링크를 **문서 기준 상대**로 푼다(CommonMark). `exists`를 주입받아 대조군이 싸진다. */
function resolveFile(fromFile, url, exists = existsSync) {
  const bare = url.split('#')[0].split('?')[0];
  if (!bare) return { ok: true, why: 'fragment-only' };
  let decoded = bare;
  try { decoded = decodeURIComponent(bare); } catch { /* 잘못된 인코딩은 원문 그대로 본다 */ }
  const target = path.resolve(path.dirname(fromFile), decoded.replace(/\/+$/, ''));
  return exists(target) ? { ok: true, target } : { ok: false, target };
}

/**
 * ★**이미지의 절대 경로는 라우트가 아니라 `public/` 자산이다**(Check G-1).
 * `![](/logo.png)`는 페이지가 아니라 `public/logo.png`를 가리킨다 — 라우트 집합과 대조하면
 * 있지도 않은 위반이 난다. 지금 저장소의 이미지 4건은 전부 상대 경로라 **잠복 자리**다.
 */
function resolvePublic(url, exists = existsSync) {
  const bare = url.split('#')[0].split('?')[0];
  let decoded = bare;
  try { decoded = decodeURIComponent(bare); } catch { /* 원문 그대로 */ }
  const target = path.resolve(PUBLIC_DIR, decoded.replace(/^\/+/, '').replace(/\/+$/, ''));
  return exists(target) ? { ok: true, target } : { ok: false, target };
}

/** 라우트를 푼다. 셋 중 하나다 — 있음 · 없음 · **주장할 수 없음**. */
function resolveRoute(url, routes, dynamicTemplates = []) {
  const bare = url.split('#')[0].split('?')[0];
  const norm = bare.replace(/\/+$/, '') || '/';
  if (routes.has(norm)) return { ok: true };
  const seg = norm.split('/').filter(Boolean);
  for (const t of dynamicTemplates) {
    const ts = t.split('/').filter(Boolean);
    if (ts.length !== seg.length) continue;
    if (ts.every((s, i) => (s.startsWith('[') ? true : s === seg[i]))) {
      return { ok: false, unclaimable: true, template: t };
    }
  }
  return { ok: false };
}

// ───────────────────────────────────────────────────────────────
// 유도 — 라우트와 대상 파일
// ───────────────────────────────────────────────────────────────

function walk(dir, keep) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (SKIP_DIRS.has(e.name)) return [];
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p, keep) : keep(p) ? [p] : [];
  });
}

/**
 * `src/app` 트리에서 라우트를 **유도한다** — 손으로 적지 않는다.
 * 손으로 적으면 페이지가 늘 때 조용히 빠지고, 그것이 이 저장소가 반복해 앓은 병이다.
 */
function deriveRoutes(appDir = APP_DIR) {
  if (!existsSync(appDir)) {
    fail(`${appDir}을 찾을 수 없다 — 저장소 루트에서 돌려라.`);
  }
  // ★`route.*`(라우트 핸들러)도 URL이다(Check G-1). 초판은 `page.*`만 봐서
  // `src/app/api/{login,logout}/route.ts` 둘이 **라우트 집합 밖**이었다 —
  // 그리로 링크를 걸면 **거짓 위반**(exit 1)이 났을 것이다. 상한이 이론이 아니라 실물이었다.
  const pages = walk(appDir, (p) => /(^|\/)(page|route)\.(tsx|mdx|jsx|js|ts)$/.test(p));
  if (!pages.length) fail(`${appDir}에서 page/route 파일을 하나도 못 찾았다 — 라우트를 주장할 수 없다.`);

  const routes = new Set();
  const dynamicTemplates = [];
  const expanded = [];
  /**
   * ★**해석기 키가 `src/app`에 실재하는지도 본다**(Check 2차 신규).
   * 지금까지는 트리 → 키 한 방향만 봤다. 앱이 `/chapter/[slug]`를 `/chapters/[slug]`로 바꾸면
   * 새 템플릿은 `exit 2`로 시끄럽지만 **옛 키는 영영 조용한 죽은 표면**이 된다.
   * 렌더 관문이 ε(*배럴은 아는데 파일이 없다*)로 닫아 둔 자리이고,
   * 키가 하나일 때는 눈에 보였는데 **일곱이 되면서 안 보이게 됐다.**
   */
  const usedKeys = new Set();
  for (const p of pages) {
    const rel = path.dirname(path.relative(appDir, p));
    const segs = rel === '.' ? [] : rel.split(path.sep).filter((s) => !/^\(.*\)$/.test(s));   // 라우트 그룹 제외
    const route = '/' + segs.join('/');
    const norm = route === '/' ? '/' : route.replace(/\/+$/, '');
    if (!segs.some((s) => s.includes('['))) { routes.add(norm); continue; }
    const resolver = ROUTE_RESOLVERS[norm];
    // ★**해석기가 없는 템플릿만** 담는다(*없는 슬러그도 exit 1* 대조군이 잡았다). 초판은 동적 템플릿을 전부 담아,
    // 이미 전개된 `/process/[slug]`로 가는 **죽은 슬러그**까지 *주장할 수 없음*(exit 2)으로 냈다.
    // 그것은 **판정할 수 있는 것을 판정 안 한 것**이다 — 순수 함수는 옳았고 **배선**이 틀렸다.
    if (!resolver) { dynamicTemplates.push(norm); continue; }
    usedKeys.add(norm);
    let values;
    try { values = resolver(); } catch (e) { fail(`동적 라우트 ${norm}의 해석기가 죽었다 — ${e?.message ?? e}`); }
    if (!values?.length) fail(`동적 라우트 ${norm}의 해석기가 아무것도 못 냈다 — 데이터가 비었나.`);
    // ★★**브래킷이 둘인 템플릿이 있다**(Check 1차 #1). 초판은 `replace`가 **비전역**이라
    // `/sources/[source]/[module]`에 `'src-a/mod-a'`를 먹이면 `/sources/src-a/mod-a/[module]`이
    // 나왔다 — **206건 전량이 쓰레기 문자열**이었다. 그러면 진짜 링크가 집합에 없어
    // **거짓 `exit 1`**("라우트가 src/app에 없다")이 난다. 지뢰(`exit 2`·정직)를
    // **거짓말로 바꾼 것**이라 시작보다 나쁘다. 대조군 D-17이 브래킷 **하나짜리** 템플릿을 써서
    // 이 자리를 못 봤다 — *fixture의 모양이 판별력을 정한다.*
    // ★수가 안 맞으면 **조용히 만들지 않고 죽는다** — 오전개를 표현 불가능하게 만든다.
    // ★**catch-all(`[...x]`)은 이제 등록할 수 없다** — 슬롯 하나에 값이 여러 조각이라
    // 이 단언이 `exit 2`를 낸다(실물 0건). 백로그 F-17이 *"거짓 위반(exit 1)"* 이라 적어 뒀는데
    // **성질이 바뀌었다**: 미등록이면 여전히 거짓 위반, 등록하면 `exit 2`다.
    const slots = norm.match(/\[[^\]]+\]/g) ?? [];
    for (const v of values) {
      const parts = String(v).split('/');
      // ★빈 세그먼트(`'a/'`)는 개수 단언을 통과하고 `/sources/a/`라는 **매칭 불가 라우트**를
      // 조용히 만든다(실물 0건 · 백로그). 한 줄이면 막히지만 대조군이 하나 더 는다 —
      // *필요를 재지 않고 장치를 만들지 않는다*(선행 D-3)에 따라 지금은 **적어만 둔다.**
      if (parts.length !== slots.length) {
        fail(`동적 라우트 ${norm}의 해석기가 세그먼트 ${slots.length}개를 기대하는 자리에 「${v}」를 냈다.`);
      }
      // ★**조립한다 — 치환하지 않는다.** `String.replace`의 두 번째 인자가 문자열이면
      // `$&`·`$'` 가 **치환 패턴으로 해석**되고, 값에 `[…]`가 들어가면 다음 회차가 그 안을 다시 친다.
      // 원래 치명 결함(비전역 replace)과 **같은 계열**이다 — *재서 막는 것이 아니라 못 쓰게 만든다.*
      let i = 0;
      const route = '/' + norm.split('/').filter(Boolean)
        .map((seg) => (seg.startsWith('[') ? parts[i++] : seg)).join('/');
      routes.add(route);
    }
    expanded.push(`${norm} → ${values.length}`);
  }
  // ★**가짜 트리에는 8개 라우트가 다 없다** — 그래서 자식은 기본으로 건너뛰고,
  // 이 검사를 겨누는 대조군만 `DLG_KEYCHECK`로 켠다. 부모(실제 저장소)는 언제나 본다.
  // *조건을 달면서 그 조건을 잴 수 없게 만들면 장치가 또 무대조군이 된다.*
  const dead = (!process.env.DLG_CHILD || process.env.DLG_KEYCHECK)
    ? Object.keys(ROUTE_RESOLVERS).filter((k) => !usedKeys.has(k)) : [];
  if (dead.length) {
    fail(`ROUTE_RESOLVERS에 있는데 ${appDir}에 없는 템플릿이 있다 — ${dead.join(' · ')}. `
      + '앱이 라우트를 옮겼거나 지웠다. 죽은 키는 조용하므로 여기서 운다.');
  }
  return { routes, dynamicTemplates, expanded };
}

function collectFiles(root = '.') {
  const files = walk(root, (p) => /\.mdx?$/.test(p)).map((f) => f.replace(/^\.\//, ''));
  if (!files.length) fail('검사할 .md/.mdx 파일을 하나도 못 찾았다 — 범위를 주장할 수 없다.');
  return files;
}

function fail(msg) {
  console.error(`❌ ${msg}`);
  console.error('   (검사기가 자기 범위를 주장할 수 없다 — 종료 코드는 2다.)');
  process.exit(2);
}

/**
 * 한 파일에서 **링크와 이미지**를 뽑는다. ★파서가 코드 스팬·코드 펜스를 **알아서** 건너뛴다.
 *
 * ★이미지(`![](…)`)도 본다(Check G-1). 초판은 `link` 노드만 봐서 `image` 4건이 **사각**이었다 —
 * 지금은 넷 다 대상이 살아 있어 조용하지만, 그것은 *잠복*이지 *없음*이 아니다.
 * 실측으로 확인하고 넣었다: 넣어도 **거짓 경보 0건**이다.
 */
const PROC = unified().use(remarkParse).use(remarkGfm);
/**
 * JSX·HTML 속성. **큰따옴표에 값이 있는 것만** 본다 — `src={표현식}`·홑따옴표·빈 값은 안 본다
 * (실측 0건. 마크다운 `[]()`는 위반인데 빈 속성값은 조용한 **비대칭**이라 적어 둔다).
 * ★`matchAll`을 쓴다 — 원본 정규식의 `lastIndex`를 건드리지 않아 **상태가 샐 자리가 없다.**
 * 초판은 `exec` 루프 + `lastIndex = 0`이었는데, 그 초기화는 **발화할 수 없는 가드**였다
 * (루프가 항상 `null`로 끝나 `lastIndex`가 스스로 0이 된다). 미래의 조기 탈출에만 위험했고,
 * `matchAll`은 그 부류를 통째로 없앤다 — **재는 대신 못 쓰게 만든다.**
 */
const ATTR = /\s(src|href)="([^"]+)"/g;
function refsIn(source) {
  const out = [];
  visit(PROC.parse(source), (n) => {
    const line = n.position?.start?.line ?? 0;
    if (n.type === 'link' || n.type === 'image') { out.push({ url: n.url, line, node: n.type }); return; }
    // ★**JSX·HTML 속성도 본다**(Check G-1). 초판은 마크다운 `![]()` 4건만 보면서
    // *"이미지도 본다"* 고 적었는데, 살아 있는 페이지의 이미지는
    // **여러 줄 `<ImageFigure … src="/…" />` 꼴 425건**이다(3차 A-1: 초판은 `<img src=`라 적었다).
    // **0.9%를 덮고 「본다」고 적은 것**이다 — 이 사이클이 고치려던 병의 한 겹 위였다.
    // 실측하고 넣었다 — **전부 해석되어 거짓 경보 0건**이다.
    // (`remark-mdx`를 안 쓰므로 `.mdx`의 JSX는 `html` 노드로 온다 — 그것이 여기서 이득이 된다.)
    if (n.type !== 'html') return;
    const v = n.value ?? '';
    // ★**줄 번호는 노드 시작이 아니라 그 속성이 있는 줄이다**(Check 3차 C-1).
    // 덮는 것의 70%가 `<ImageFigure\n  src="…"` 꼴 **다중행**이라, 노드 시작 줄을 그대로 쓰면
    // 위반 메시지가 **거짓 자리**를 가리킨다. 위반이 0건이라 아무도 못 봤을 뿐이다.
    // ★개행을 `m.index`까지 세면 안 된다 — 패턴의 `\s`가 그 개행을 **매치 안으로** 먹는다.
    //   `\s` **자신까지** 세야 한다(실측, 실제 파일: 옛 식 41 · 새 식 42 · **원문 42**).
    //   ★remark가 `html` 노드 값에서 **들여쓰기를 벗기므로**(`"<ImageFigure\nsrc=…"`) 그 `\s`가
    //   곧 개행이다. **원문만 보면** 들여쓰기가 있어 옛 식도 맞아 보이는데 파서가 주는 값은 다르다 —
    //   Check 4차가 원문으로 추론해 *"판별력 0"* 이라 했고, 되돌림 실측이 그것을 뒤집었다
    //   (옛 식으로 되돌리면 대조군 *다중행 JSX* 가 운다).
    for (const m of v.matchAll(ATTR)) {
      // ★`m.index + 1`이다 — `\s`는 **한 글자**라 그것까지만 세면 된다.
      // 매치 끝까지 세면 URL 값 안의 개행까지 세어 넘친다(`src="/a\nb.png"`).
      const off = (v.slice(0, m.index + 1).match(/\n/g) ?? []).length;
      out.push({ url: m[2], line: line + off, node: m[1] });
    }
  });
  return out;
}

// ───────────────────────────────────────────────────────────────
// 본 검사
// ───────────────────────────────────────────────────────────────

function runMain() {
  const files = collectFiles('.');
  const { routes, dynamicTemplates, expanded } = deriveRoutes();

  const tally = { file: 0, route: 0, public: 0, external: 0, anchor: 0, empty: 0 };
  const byNode = { link: 0, image: 0, src: 0, href: 0 };
  /** 절대 경로가 **라우트가 아니라 `public/` 자산**을 뜻하는 출처. */
  const ASSET = new Set(['image', 'src']);
  const violations = [];
  const unclaimable = [];

  for (const f of files) {
    let refs;
    try { refs = refsIn(readFileSync(f, 'utf8')); }
    catch (e) { fail(`${f}을 파싱하지 못했다 — ${e?.message ?? e}`); }
    for (const { url, line, node } of refs) {
      const kind = classify(url);
      // ★갈래를 늘리고 여기 안 더하면 `undefined + 1 = NaN`이 되어 **총계가 조용히 죽는다.**
      // ★★이 가드는 **모든 출처보다 위**에 있어야 한다(Check G-2). 초판은 이미지 분기가
      // 가드 **앞에서** `continue`해서, 새 갈래가 생기면 링크는 울고 이미지는 조용히 샜다.
      if (!(kind in tally)) fail(`분류가 모르는 갈래 '${kind}'를 냈다 — tally에도 더해라.`);
      if (!(node in byNode)) fail(`추출이 모르는 출처 '${node}'를 냈다 — byNode에도 더해라.`);
      // ★**해석된 갈래로 센다 — 분류한 갈래가 아니다**(Check 3차 §2).
      // `classify`는 `/`로 시작하면 전부 `route`인데, 자산 출처의 절대 경로는 실제로
      // `public/`으로 **해석**된다. 분류 어휘로만 찍으면 `route 449`가 되어 진짜 라우트(24)를
      // 425건의 자산이 가린다. 코드는 이미 위반을 `kind: 'public'`으로 기록하고 있었다 —
      // **한 축에 어휘가 둘인데 출력은 한쪽만 썼다.** 이제 라벨과 처분 경로가 같은 원천이다.
      const settled = kind === 'route' && ASSET.has(node) ? 'public' : kind;
      tally[settled] += 1;
      byNode[node] += 1;
      if (kind === 'file') {
        const r = resolveFile(f, url);
        if (!r.ok) violations.push({ f, line, url, kind, node });
      } else if (kind === 'route') {
        // ★**자산 출처는 `public/`으로, 그 밖은 라우트로 푼다.**
        // 그리고 라우트에서 못 찾으면 `public/`을 한 번 더 본다(Check G-3) —
        // 브라우저에게 `/sitemap.xml`은 유효한 URL이고, `public/`에 실재한다.
        // 한쪽만 닫고 다른 쪽을 안 적으면 그 비대칭이 곧 거짓 위반이 된다.
        // ★**처분을 `settled`에서 파생한다 — 같은 조건을 두 번 쓰지 않는다**(Check 4차 C).
        // 초판은 여기서 `ASSET.has(node)`를 **또** 썼다. 그러면 위 삼항을 뒤집어도 처분은
        // 그대로라 **라벨만 거짓이 되고 대조군 42건이 전부 초록**이었다. 이제 삼항을 건드리면
        // 처분이 함께 바뀌어 운다 — *재서 막는 것이 아니라 못 쓰게 만든다.*
        if (settled === 'public') {
          const r = resolvePublic(url);
          if (!r.ok) violations.push({ f, line, url, kind: 'public', node });
        } else {
          const r = resolveRoute(url, routes, dynamicTemplates);
          if (r.unclaimable) unclaimable.push({ f, line, url, template: r.template });
          else if (!r.ok && !resolvePublic(url).ok) violations.push({ f, line, url, kind, node });
        }
      } else if (kind === 'empty') {
        // ★빈 목적지는 **현재 페이지로 되돌아가는 링크**다 — 깨진 것으로 본다(Check G-4).
        // 초판은 `empty`를 총계에만 넣고 처분도 내역 출력도 안 해서, 하나라도 생기면
        // **「파일+라우트+외부+앵커 ≠ 총계」가 되고 아무도 안 울었다.**
        violations.push({ f, line, url, kind, node });
      }
    }
  }

  /**
   * ★**내역을 `tally`에서 유도한다 — 손으로 적지 않는다**(Check G-4).
   * 초판은 출력 문자열에 갈래를 손으로 나열해서 `empty`가 **총계에만 들어가고 내역에 없었다.**
   * 하나라도 생기면 「파일+라우트+외부+앵커 ≠ 총계」인데 아무도 안 울었다.
   * 이제 내역이 총계와 **같은 원천**에서 나오므로 그 어긋남이 표현 불가능하다 —
   * *재서 막는 것과 못 쓰게 막는 것은 다르다*(선행 N-2b).
   * (그래서 「내역 합 === 총계」 검사는 **안 둔다** — 같은 값을 두 번 세는 공허한 검사다.)
   */
  const total = Object.values(tally).reduce((a, b) => a + b, 0);
  const breakdown = Object.entries(tally).filter(([, n]) => n > 0).map(([k, n]) => `${k} ${n}`).join(' · ');
  const sources = Object.entries(byNode).filter(([, n]) => n > 0).map(([k, n]) => `${k} ${n}`).join(' · ');
  console.log(`문서 ${files.length}개 · 참조 ${total}건 — ${breakdown}`);
  console.log(`   출처: ${sources}`);
  if (expanded.length) console.log(`   동적 라우트: ${expanded.join(' · ')}`);
  // ★**해석기가 없는 템플릿을 말한다**(Check 3차 C-2). 관문이 그 목록을 손에 들고 있으면서
  // 안 말하면 성공 출력이 *"동적 라우트는 다 본다"* 로 읽힌다 — FR-4 위반이다.
  // 그리로 가는 링크가 생기면 `exit 2`이지, **지금 조용한 것이 「본다」는 뜻이 아니다.**
  if (dynamicTemplates.length) {
    console.log(`   미등록 템플릿 ${dynamicTemplates.length}종(링크가 걸리면 exit 2): ${dynamicTemplates.join(' · ')}`);
  }

  // ★**주장할 수 없는 것이 위반보다 먼저다.** 판정을 못 하는 자리를 통과로 세면 그 관문은 헛것이다.
  if (unclaimable.length) {
    console.error(`\n❌ 해석기가 없는 동적 라우트로 가는 링크가 ${unclaimable.length}건 있다.`);
    for (const u of unclaimable) console.error(`   ${u.f}:${u.line}  ${u.url}   (템플릿 ${u.template})`);
    console.error(`\n   scripts/verify-doc-links.mjs 의 ROUTE_RESOLVERS 에 '${unclaimable[0].template}' 해석기를 등록하라.`);
    console.error('   (조용히 통과시키면 그 라우트는 영영 무검사다.)');
    process.exit(2);
  }

  if (violations.length) {
    console.error(`\n❌ 링크 대상이 없다 — ${violations.length}건`);
    for (const v of violations) {
      console.error(`   ${v.f}:${v.line}  「${v.url}」${v.node === 'image' ? '  (이미지)' : ''}`);
      if (v.kind === 'empty') {
        console.error('      목적지가 비었다 — 현재 페이지로 되돌아가는 링크가 된다. 대상을 적거나 링크를 없애라.');
      } else if (v.kind === 'public') {
        console.error(`      이미지의 절대 경로는 ${PUBLIC_DIR}/ 자산을 가리킨다. 파일을 두거나 경로를 고쳐라.`);
      } else if (v.kind === 'file') {
        console.error('      ① 정말 링크라면 대상 경로를 고쳐라.');
        console.error('      ② 링크로 만들 의도가 아니었다면 `]`와 `(`를 떼어라. 셋 다 통한다 —');
        console.error('         순서를 바꾸거나(`1헨리[H]`) · 대괄호를 없애거나(`1H(헨리)`) · 사이에 공백(`1[H] (헨리)`).');
        console.error('         **대괄호 직후 여는 괄호**가 링크 문법이다 —');
        console.error('         docs/archive/2026-07/chapters-source-fidelity/design.md §7에 이미 적혀 있다.');
        console.error('      ③ 링크 **예시**를 적으려던 것이면 백틱으로 감싸라 — 파서가 코드 스팬을 건너뛴다.');
      } else {
        console.error('      라우트가 src/app 에 없다. 페이지를 옮겼으면 링크도 함께 고쳐라.');
      }
    }
    process.exit(1);
  }

  console.log('\n✅ 전 항목 통과 — 죽은 링크 없음.');
  // ★**안 보는 것을 말한다.** 안 적으면 이 수치가 "닫았다"로 읽힌다.
  // ★그리고 이 문구는 **무대조군이면 안 된다** — *정상 트리* 대조군이 사유 정규식으로 관측한다.
  // (번호로 인용하지 않는다 — 재번호를 세 번 하는 동안 인용이 낡았다. 이름은 안 낡는다.)
  console.log('   ※ 안 보는 것: 외부 URL(네트워크가 필요하다) · 앵커(#heading)의 실재 여부 ·');
  console.log('     참조 링크(`[a][b]`) · JSX 속성이 **표현식**인 것(`src={…}`) ·');
  console.log('     **홑따옴표** 속성과 빈 속성값 — 큰따옴표에 값이 있는 것만 본다 ·');
  console.log('     `.mdx`에서 JSX 여는 태그 바로 다음 줄의 링크(HTML 블록에 삼켜진다) ·');
  console.log('     `data/`(원문 자료 · 스캔 제외) · **대소문자**(macOS는 안 가린다 — GitHub에서는 깨질 수 있다) ·');
  console.log('     인라인 코드의 경로 언급(대부분 아카이브 문서의 **정당한 역사 기술**이다 —');
  console.log('     이름이 바뀌거나 지워진 파일을 그때의 이름으로 적은 것이라 고칠 대상이 아니다).');
  console.log('   ※ 보는 것: 마크다운 링크·이미지 + **JSX/HTML의 `src=""`·`href=""`**.');
  console.log('     `src`는 `public/` 자산으로, `href`·링크는 라우트로 푼다(못 찾으면 `public/`도 본다).');
  console.log('     라우트는 `page.*`와 `route.*` 둘 다에서 유도한다 — 동적 세그먼트는 **앱의 원천**에서 푼다.');
  console.log('   ※ 이 관문은 라우트를 **열거**할 수 있는지만 본다 — 앱 데이터의 **내용**은 안 본다.');
  console.log(`\n소요 ${((Date.now() - T0) / 1000).toFixed(2)}초`);
  return 0;
}

// ───────────────────────────────────────────────────────────────
// 자체검사
// ───────────────────────────────────────────────────────────────

/**
 * ★**짝을 키가 정한다**(선행 `render-gate-self-test-denominator` N-2b).
 * 선언과 집계를 따로 두고 손으로 짝지으면 오배선이 조용하다 — 그 자리를 없앤다.
 */
const CONTROLS = {
  판정: 29,   // 순수 함수와 파서에 직접 먹인다
  처분: 26,   // 자식 프로세스를 임시 cwd에서 돌린다
};
/**
 * 실행 집계 — **판정을 찍는 자리**에서만 올린다(배열 선언 길이가 아니다 · 선행 G-2).
 *
 * ★★**수를 따로 세지 않는다 — 이름 배열의 길이가 곧 수다**(Check 6차 B).
 * 초판은 `ran[g] += 1`과 `seenNames.push()`가 **따로 있는 두 문장**이라, push만 지우면
 * 집계는 그대로고 식별자 유일성·모양 단언이 통째로 눈이 멀었다(**exit 0**).
 * 그래서 헬퍼 하나로 묶었는데 — **여전히 두 문장이라 그대로 조용했다**(실측).
 * *묶는다고 하나가 되는 것이 아니다.* 이제 **원천이 하나**라 push를 지우면 수가 함께 줄어
 * `CONTROLS` 대조가 운다 — **재서 막는 것이 아니라 못 쓰게 만든다.**
 */
const seen = { 판정: [], 처분: [] };
function record(group, name) { seen[group].push(name); }
{
  const a = Object.keys(CONTROLS).join(','), b = Object.keys(seen).join(',');
  if (a !== b) { console.error(`❌ 무리 이름이 선언(${a})과 집계(${b})에서 다르다 — 한쪽만 고쳤다.`); process.exit(2); }
}

function judgeCases() {
  const has = (set) => (t) => set.has(t);
  const R = new Set(['/about', '/process/wafer']);
  const T = ['/sources/[source]/[module]'];
  return [
    // classify
    { name: 'J-01 외부 http는 external', ok: () => classify('https://x.com') === 'external' },
    { name: 'J-02 mailto도 external', ok: () => classify('mailto:a@b.c') === 'external' },
    { name: 'J-03 프로토콜 상대(//)도 external', ok: () => classify('//cdn.x/y') === 'external' },
    { name: 'J-04 #으로 시작하면 anchor', ok: () => classify('#헤딩') === 'anchor' },
    { name: 'J-05 /로 시작하면 route', ok: () => classify('/process/wafer/') === 'route' },
    { name: 'J-06 그밖은 file', ok: () => classify('./plan.md') === 'file' },
    { name: 'J-07 빈 문자열은 empty', ok: () => classify('') === 'empty' },
    // resolveFile
    { name: 'J-08 형제 파일이 있으면 통과', ok: () => resolveFile('docs/a/x.md', './y.md', has(new Set([path.resolve('docs/a/y.md')])))?.ok === true },
    { name: 'J-09 없으면 실패', ok: () => resolveFile('docs/a/x.md', './없다.md', has(new Set()))?.ok === false },
    { name: 'J-10 문서 기준 상대다 — 루트 기준이 아니다', ok: () => resolveFile('docs/a/x.md', '../b/y.md', has(new Set([path.resolve('docs/b/y.md')])))?.ok === true },
    { name: 'J-11 프래그먼트는 떼고 본다', ok: () => resolveFile('docs/a/x.md', './y.md#절', has(new Set([path.resolve('docs/a/y.md')])))?.ok === true },
    { name: 'J-12 퍼센트 인코딩을 푼다', ok: () => resolveFile('docs/a/x.md', './y%20z.md', has(new Set([path.resolve('docs/a/y z.md')])))?.ok === true },
    { name: 'J-13 뒤 슬래시(디렉터리)를 떼고 본다', ok: () => resolveFile('docs/a/x.md', '../b/', has(new Set([path.resolve('docs/b')])))?.ok === true },
    // resolveRoute
    { name: 'J-14 정적 라우트가 있으면 통과', ok: () => resolveRoute('/about/', R, T).ok === true },
    { name: 'J-15 없으면 실패', ok: () => resolveRoute('/없다/', R, T).ok === false },
    { name: 'J-16 뒤 슬래시 유무는 무관하다', ok: () => resolveRoute('/about', R, T).ok === true },
    { name: 'J-17 ★해석기 없는 동적 템플릿은 **주장할 수 없음**이다(실패가 아니다)', ok: () => { const r = resolveRoute('/sources/foo/bar/', R, T); return r.ok === false && r.unclaimable === true; } },
    // 파서 — ★Design C의 근거가 여기 있다
    { name: 'J-18 ★코드 스팬 안의 링크 예시는 링크가 아니다 (allow 파일이 필요 없는 이유)', ok: () => refsIn('예: `[a](b.md)` 처럼 적는다').length === 0 },
    { name: 'J-19 ★목적지에 공백이 있으면 링크가 아니다 (정규식이면 거짓 경보)', ok: () => refsIn('760[mmHg](수은주 높이)와 같다').length === 0 },
    { name: 'J-20 ★대괄호 직후 여는 괄호는 링크다 (사고 링크 회귀)', ok: () => { const l = refsIn('1[H](헨리)의 인덕턴스'); return l.length === 1 && l[0].url === '헨리'; } },
    // ★아래 넷이 Check가 지목한 무대조군을 덮는다.
    { name: 'J-21 ★gfm 자동 링크를 본다 (gfm을 빼면 관문이 **더 조용해지는 방향**으로 망가진다)',
      ok: () => { const l = refsIn('보라 https://x.com 을'); return l.length === 1 && l[0].url === 'https://x.com'; } },
    { name: 'J-22 ★이미지도 뽑는다 (초판은 link 노드만 봐서 image가 사각이었다)',
      ok: () => { const l = refsIn('![캡션](./shot.png)'); return l.length === 1 && l[0].node === 'image'; } },
    { name: 'J-23 ★이미지의 절대 경로는 public/ 자산이다 (라우트가 아니다)',
      ok: () => resolvePublic('/logo.png', (t) => t === path.resolve('public/logo.png')).ok === true },
    { name: 'J-24 빈 목적지는 empty다 — 조용히 지나가면 안 된다', ok: () => classify('') === 'empty' && classify(undefined) === 'empty' },
    { name: 'J-25 ★JSX/HTML의 src=""도 뽑는다 (살아 있는 페이지의 이미지가 이 꼴이다)',
      ok: () => { const l = refsIn('<img src="/a.png" alt="x" />'); return l.length === 1 && l[0].node === 'src' && l[0].url === '/a.png'; } },
    { name: 'J-26 src={표현식}은 안 뽑는다 — 따옴표 문자열만 본다 (상한을 대조군이 고정한다)',
      ok: () => refsIn('<img src={foo} alt="x" />').length === 0 },
    { name: 'J-27 ★다중행 JSX의 src를 뽑고 **줄 번호가 그 줄**이다 (덮는 것의 대부분이 이 꼴이다)',
      ok: () => { const l = refsIn('x\n\n<ImageFigure\n  src="/a.jpg"\n  alt="x"\n/>'); return l.length === 1 && l[0].url === '/a.jpg' && l[0].node === 'src' && l[0].line === 4; } },
    { name: 'J-28 ★홑따옴표·빈 값 속성은 안 뽑는다 — 상한을 대조군이 고정한다 (실측 0건)',
      ok: () => refsIn(`<img src='/a.png' alt="x" />`).length === 0 && refsIn('<img src="" alt="x" />').length === 0 },
    { name: 'J-29 ★href 속성도 뽑는다 (ATTR을 src만으로 줄여도 전에는 조용했다)',
      ok: () => { const l = refsIn('<a href="/about/">가기</a>'); return l.length === 1 && l[0].node === 'href' && l[0].url === '/about/'; } },
  ];
}

function selfTestJudge() {
  let ok = true;
  console.log('★ 판정 대조군 (순수 함수 · 파서)');
  for (const c of judgeCases()) {
    let pass = false, boom = null;
    // ★대조군마다 try를 둔다 — 하나가 던지면 나머지가 안 돌고, **조용한 것이 가장 나쁘다.**
    try { pass = c.ok() === true; } catch (e) { boom = e; }
    record('판정', c.name);
    console.log(`   ${pass ? '✅ 통과' : '❌ 실패'}  ${c.name}`);
    if (!pass) { ok = false; if (boom) console.log(`      예외 — ${String(boom?.message ?? boom).slice(0, 120)}`); }
  }
  return ok;
}

/** 처분 대조군 — 가짜 트리를 소유한 **임시 cwd**에서 자식을 돌리고 종료 코드와 사유를 본다. */
async function spawnChild({ name, tree, wantStatus, wantReason = [], denyReason = [], env = {} }) {
  const { spawnSync } = await import('node:child_process');
  const dir = mkdtempSync(path.join(os.tmpdir(), 'dlg-'));
  try {
    for (const [rel, body] of Object.entries(tree)) {
      const p = path.join(dir, rel);
      mkdirSync(path.dirname(p), { recursive: true });
      writeFileSync(p, body);
    }
    const r = spawnSync(process.execPath, [path.resolve('scripts/verify-doc-links.mjs')], {
      cwd: dir, encoding: 'utf8', env: { ...process.env, DLG_CHILD: '1', ...env }, timeout: 30_000,
    });
    const out = (r.stdout ?? '') + (r.stderr ?? '');
    const want = (Array.isArray(wantReason) ? wantReason : [wantReason]).filter(Boolean);
    const missing = want.filter((re) => !re.test(out));
    const extra = denyReason.filter((re) => re.test(out));
    const pass = r.status === wantStatus && !missing.length && !extra.length;
    record('처분', name);
    console.log(`   ${pass ? '✅ 통과' : '❌ 실패'}  ${name}`);
    if (!pass) {
      console.log(`      종료 ${r.status} (기대 ${wantStatus})`
        + (missing.length ? ` · 빠진 사유 ${missing.join(' ')}` : '')
        + (extra.length ? ` · ★있으면 안 되는 사유 ${extra.join(' ')}` : ''));
      console.log(`      ${out.split('\n').filter((l) => l.trim()).slice(-4).join(' | ').slice(0, 300)}`);
    }
    return pass;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const PAGE = 'export default function P(){return null}\n';
/**
 * ★**가짜 TS를 대조군이 소유한다**(Design E). `tsx`는 임시 cwd에서 이 파일들을 평가한다 —
 * 그래서 TS 기반 해석기의 대조군도 **실제 저장소와 무관**하다(이 관문이 지켜 온 성질이다).
 * JSX가 없는 `.tsx`는 그냥 TS라 문제없다(실측).
 */
/** 해석기 키 일곱 + process — **전부** 트리에 두는 조각(D-24·D-25용). */
const ALL_ROUTE_DIRS = {
  'src/app/chapter/[slug]/page.tsx': PAGE,
  'src/app/chemicals/[id]/page.tsx': PAGE,
  'src/app/sources/[source]/page.tsx': PAGE,
  'src/app/sources/[source]/[module]/page.tsx': PAGE,
  'src/app/sources/osha-scs/[part]/page.tsx': PAGE,
  'src/app/sources/ncs-semi/[module]/page.tsx': PAGE,
  'src/app/sources/daegu-hs-process/[module]/page.tsx': PAGE,
  'src/data/chapters.json': JSON.stringify([{ slug: 'ch-a' }]),
  'src/data/chemicals.json': JSON.stringify([{ id: 'cas-1' }]),
};

const FAKE_TS = (extra = {}) => ({
  'src/lib/sources.ts': `
export const OSHA_SCS = { sections: [{ id: 'part-1' }] };
export const NCS_SEMI = { sections: [{ id: 'ncs-a' }] };
export const DAEGU_HS = { sections: [{ id: 'dg-a' }] };
const ALL: Record<string, { sections: { id: string }[] }> = { 'src-a': { sections: [{ id: 'mod-a' }] } };
export function getOrderedSources() { return [{ id: 'src-a' }]; }
export function getSource(id: string) { return ALL[id]; }
`,
  'src/lib/schoolTextMdx.tsx': `export function listSchoolTextSourceIds(): string[] { return ['src-a']; }
export function hasModuleLoader(_id: string, _mod: string): boolean { return true; }
`,
  ...extra,
});
const okTree = (extra = {}) => ({
  'src/app/about/page.tsx': PAGE,
  'src/app/process/[slug]/page.tsx': PAGE,
  // ★**해석기 없는 템플릿을 정상 트리에 둔다**(Check 3차 C-2). 링크가 안 걸리면 `exit 0`이지만
  // 관문은 그것을 **말해야** 한다 — 안 말하면 *"동적 라우트는 다 본다"* 로 읽힌다.
  // D-01(정상 트리)의 사유 정규식이 그 줄을 관측하므로, 출력을 지우면 그 대조군이 운다.
  // ★**합성 템플릿이다 — 실제 라우트 이름을 빌리지 않는다**(Design D-0).
  // 초판은 `chapter/[slug]`를 "미등록 예시"로 썼는데, 그 템플릿에 해석기가 등록되는 순간
  // `미등록 템플릿` 줄이 안 찍혀 이 대조군이 **조용히 무너진다**(실측으로 먼저 확인했다).
  // `합성/[없는것]`은 `ROUTE_RESOLVERS`에 영영 안 들어가므로 **영구 표적**이다 —
  // *장치를 늘리면 옛 장치가 무력해진다*를 막는다.
  'src/app/합성/[없는것]/page.tsx': PAGE,
  // ★`SKIP_DIRS`의 `data/` 배선을 여기서 잰다(Check 4차 G). 성공 출력이 *"`data/` 제외"* 를
  // 주장하는데 지키는 자가 없었다 — `'data'`를 빼면 이 깨진 링크가 exit 1을 낸다.
  'data/원문.md': '# 원문\n\n[깨짐](./없다.md)\n',
  'src/data/processes.json': JSON.stringify([{ slug: 'wafer' }, { slug: 'etching' }]),
  'docs/a.md': '# a\n\n[about](/about/) · [wafer](/process/wafer/) · [형제](./b.md)\n',
  'docs/b.md': '# b\n',
  ...extra,
});

async function selfTestDisposition() {
  let ok = true;
  console.log('★ 처분 대조군 (자식 프로세스 · 임시 cwd)');
  const cases = [
    // ★`wantReason`이 **"안 보는 것" 문구를 관측한다**(Check G-1). 초판은 `/전 항목 통과/`만 봐서
    // FR-4의 유일한 이행 수단인 그 세 줄을 **통째로 지워도 조용했다.**
    { name: 'D-01 정상 트리는 exit 0 · 안 보는 것을 말한다 (과잉 발화도 잡는다)', tree: okTree(), wantStatus: 0,
      // ★목록의 **여러 줄**을 건다(Check 2차 G-6). 한 줄만 걸면 부분 침식이 조용하다.
      // ★출력 9줄을 **전부** 건다(Check 5차 3). 4차에서 새로 적은 홑따옴표 줄이 무대조군이었다 —
      // *"안 보는 것을 말한다"* 를 고치려고 적은 문장이 다시 무대조군이 되는 것이 이 사이클의 병이다.
      wantReason: [/전 항목 통과/, /안 보는 것/, /외부 URL/, /앵커/, /참조 링크/, /홑따옴표/,
        /JSX 여는 태그/, /data\//, /대소문자/, /인라인 코드의 경로 언급/,
        // ★`/보는 것:/`은 **공허했다**(Check 6차 A) — 「안 **보는 것:**」에 이미 걸린다.
        // 그래서 「※ 보는 것:」과 그 아래 두 줄을 각각 붙든다.
        /※ 보는 것:/, /자산으로/, /둘 다에서 유도한다/, /출처: link/, /동적 라우트: /, /열거/,
        /미등록 템플릿/, /소요 [\d.]+초/],
      denyReason: [/링크 대상이 없다/, /해석기가 없는/] },
    { name: 'D-02 죽은 파일 링크는 exit 1', wantStatus: 1, wantReason: [/링크 대상이 없다/, /없다\.md/],
      tree: okTree({ 'docs/a.md': '# a\n\n[깨짐](./없다.md)\n' }) },
    { name: 'D-03 죽은 라우트는 exit 1', wantStatus: 1, wantReason: [/링크 대상이 없다/, /src\/app 에 없다/],
      tree: okTree({ 'docs/a.md': '# a\n\n[없는쪽](/그런거없다/)\n' }) },
    { name: 'D-04 없는 슬러그도 exit 1 (동적 라우트가 실제로 전개된다)', wantStatus: 1, wantReason: [/없는슬러그/],
      tree: okTree({ 'docs/a.md': '# a\n\n[슬러그](/process/없는슬러그/)\n' }) },
    { name: 'D-05 ★해석기 없는 동적 라우트는 exit 2 (조용히 통과시키지 않는다)', wantStatus: 2,
      wantReason: [/해석기가 없는 동적 라우트/, /ROUTE_RESOLVERS/], denyReason: [/링크 대상이 없다/],
      // ★여기도 합성 템플릿이다(Design D-0) — 실제 이름을 쓰면 등록될 때 이 대조군이 죽는다.
      tree: okTree({ 'src/app/합성둘/[없는것]/page.tsx': PAGE, 'docs/a.md': '# a\n\n[합성](/합성둘/뭐든/)\n' }) },
    { name: 'D-06 검사할 문서가 하나도 없으면 exit 2', wantStatus: 2, wantReason: [/파일을 하나도 못 찾았다/],
      tree: { 'src/app/about/page.tsx': PAGE, 'src/data/processes.json': '[]' } },
    { name: 'D-07 해석기가 아무것도 못 내면 exit 2 (데이터가 비었다)', wantStatus: 2, wantReason: [/아무것도 못 냈다/],
      tree: okTree({ 'src/data/processes.json': '[]' }) },
    // ★아래 셋이 Check가 지목한 사각을 덮는다.
    { name: 'D-08 ★빈 목적지는 exit 1 (초판은 총계에만 넣고 처분도 내역도 없었다)', wantStatus: 1,
      wantReason: [/목적지가 비었다/, /empty 1/],
      tree: okTree({ 'docs/a.md': '# a\n\n[돌아오는링크]()\n' }) },
    { name: 'D-09 ★죽은 이미지도 exit 1 (초판은 link 노드만 봤다)', wantStatus: 1,
      wantReason: [/링크 대상이 없다/, /\(이미지\)/, /없는그림\.png/],
      tree: okTree({ 'docs/a.md': '# a\n\n![캡션](./없는그림.png)\n' }) },
    { name: 'D-10 ★route.* 라우트도 인정된다 (초판은 page.*만 봐서 거짓 위반이 났을 자리)', wantStatus: 0,
      wantReason: [/전 항목 통과/], denyReason: [/링크 대상이 없다/],
      tree: okTree({ 'src/app/api/login/route.ts': 'export function POST(){}\n',
        'docs/a.md': '# a\n\n[로그인](/api/login/)\n' }) },
    // ★아래 넷이 Check 2차가 지목한 **배선** 무대조군을 덮는다.
    // D-11까지는 이미지가 **상대 경로**라, resolvePublic 삼항을 뒤집어도 초록이었다 —
    // *"순수 함수는 옳고 배선이 무대조군"* 의 정확한 재발이었다.
    // ★`/public 1/`이 **내역 라벨**을 관측한다 — `settled` 삼항을 뒤집으면 `route 1`이 되어 운다.
    { name: 'D-11 ★절대 경로 이미지는 public/ 자산으로 푼다 (resolvePublic 배선 · 라벨)', wantStatus: 0,
      wantReason: [/전 항목 통과/, /public 1/], denyReason: [/링크 대상이 없다/, /route 1/],
      tree: okTree({ 'public/logo.png': 'x', 'docs/a.md': '# a\n\n![로고](/logo.png)\n' }) },
    { name: 'D-12 ★public/에 없는 절대 경로 이미지는 exit 1', wantStatus: 1,
      wantReason: [/링크 대상이 없다/, /public\//, /없다\.png/],
      tree: okTree({ 'docs/a.md': '# a\n\n![없음](/없다.png)\n' }) },
    { name: 'D-13 ★JSX src=""도 본다 (마크다운 ![]()는 몇 건, 이 꼴이 대부분)', wantStatus: 1,
      wantReason: [/링크 대상이 없다/, /없는이미지\.png/, /public\//],   // ★`/public\//`가 ASSET의 'src' 성분을 지킨다(D-13의 수법)
      tree: okTree({ 'docs/a.md': '# a\n\n<img src="/없는이미지.png" alt="x" />\n' }) },
    // ★해석기 일곱에 대조군을 붙인다(Design 위험 표). **등록만 하고 안 재면** 선행이 일곱 판독
    // 내내 짚은 그 자리다 — *장치를 세우면 그 장치가 무대조군이 된다.*
    { name: 'D-15 ★JSON 해석기(chapter)가 전개된다 — 오타 슬러그는 exit 1', wantStatus: 1,
      wantReason: [/링크 대상이 없다/, /없는장/],
      // ★긍정 경로도 잰다(Check 1차 #7) — 해석기가 엉뚱한 값을 내면 좋은 링크도 함께 죽는데,
      // 그러면 `없는장`만 보는 대조군은 그대로 초록이다.
      denyReason: [/해석기가 없는/, /ch-a/],
      tree: okTree({ 'src/app/chapter/[slug]/page.tsx': PAGE,
        'src/data/chapters.json': JSON.stringify([{ slug: 'ch-a' }]),
        'docs/a.md': '# a\n\n[좋다](/chapter/ch-a/) · [나쁘다](/chapter/없는장/)\n' }) },
    { name: 'D-16 ★JSON 해석기(chemicals)가 전개된다 — 오타 id는 exit 1', wantStatus: 1,
      wantReason: [/링크 대상이 없다/, /없는물질/], denyReason: [/해석기가 없는/, /cas-1/],
      tree: okTree({ 'src/app/chemicals/[id]/page.tsx': PAGE,
        'src/data/chemicals.json': JSON.stringify([{ id: 'cas-1' }]),
        'docs/a.md': '# a\n\n[좋다](/chemicals/cas-1/) · [나쁘다](/chemicals/없는물질/)\n' }) },
    { name: 'D-17 ★TS 원천(tsx)에서 전개된다 — 옳은 링크는 exit 0', wantStatus: 0,
      wantReason: [/전 항목 통과/, /sources\/\[source\] → 1/], denyReason: [/링크 대상이 없다/, /해석기가 없는/],
      tree: okTree(FAKE_TS({ 'src/app/sources/[source]/page.tsx': PAGE,
        'docs/a.md': '# a\n\n[자료원](/sources/src-a/)\n' })) },
    { name: 'D-18 ★TS 전개의 오타는 exit 1 (가짜 TS가 원천이다)', wantStatus: 1,
      wantReason: [/링크 대상이 없다/, /없는자료원/], denyReason: [/해석기가 없는/],
      tree: okTree(FAKE_TS({ 'src/app/sources/[source]/page.tsx': PAGE,
        'docs/a.md': '# a\n\n[없다](/sources/없는자료원/)\n' })) },
    { name: 'D-19 ★TS 원천이 던지면 exit 2 (조용히 빈 집합을 쓰지 않는다)', wantStatus: 2,
      wantReason: [/라우트 원천을 열거하지 못했다|해석기가 죽었다/], denyReason: [/링크 대상이 없다/],
      tree: okTree(FAKE_TS({ 'src/app/sources/[source]/page.tsx': PAGE,
        'src/lib/sources.ts': `export function getOrderedSources(): { id: string }[] { throw new Error('로더 미등록'); }
export function getSource() { return undefined; }
export const OSHA_SCS = { sections: [] }; export const NCS_SEMI = { sections: [] }; export const DAEGU_HS = { sections: [] };`,
        'docs/a.md': '# a\n\n[자료원](/sources/src-a/)\n' })) },
    // ★★**브래킷이 둘인 템플릿**을 겨눈다(Check 1차 #1). 초판은 이 자리가 없어
    // 206건이 쓰레기 문자열인데도 48건이 전원 초록이었다 — *fixture의 모양이 판별력을 정한다.*
    { name: 'D-20 ★브래킷 둘짜리 템플릿이 옳게 전개된다 (206건이 쓰레기였던 자리)', wantStatus: 0,
      wantReason: [/전 항목 통과/, /\[source\]\/\[module\] → 1/], denyReason: [/링크 대상이 없다/],
      tree: okTree(FAKE_TS({ 'src/app/sources/[source]/[module]/page.tsx': PAGE,
        'docs/a.md': '# a\n\n[모듈](/sources/src-a/mod-a/)\n' })) },
    { name: 'D-21 ★해석기가 세그먼트 수를 안 맞추면 exit 2 (조용한 오전개를 막는다)', wantStatus: 2,
      wantReason: [/세그먼트 2개를 기대하는 자리에/], denyReason: [/링크 대상이 없다/],
      tree: okTree(FAKE_TS({ 'src/app/sources/[source]/[module]/page.tsx': PAGE,
        'src/lib/schoolTextMdx.tsx': `export function listSchoolTextSourceIds(): string[] { return ['src-a']; }
export function hasModuleLoader(): boolean { return true; }
`,
        'src/lib/sources.ts': `
export const OSHA_SCS = { sections: [] }; export const NCS_SEMI = { sections: [] }; export const DAEGU_HS = { sections: [] };
export function getOrderedSources() { return [{ id: 'src-a' }]; }
export function getSource() { return { sections: [{ id: 'mod-a/여분' }] }; }
`,
        'docs/a.md': '# a\n\n[모듈](/sources/src-a/mod-a/)\n' })) },
    // ★앱의 가드가 **실제로 도는지** 잰다(되돌림 실측: 이 대조군이 없으면 가드를 빼도 조용했다).
    { name: 'D-22 ★로더 없는 모듈이면 exit 2 (앱의 가드를 그대로 진다)', wantStatus: 2,
      wantReason: [/열거하지 못했다/, /로더가 없다/], denyReason: [/링크 대상이 없다/],
      tree: okTree(FAKE_TS({ 'src/app/sources/[source]/[module]/page.tsx': PAGE,
        'src/lib/schoolTextMdx.tsx': `export function listSchoolTextSourceIds(): string[] { return ['src-a']; }
export function hasModuleLoader(): boolean { return false; }
`,
        'docs/a.md': '# a\n\n[모듈](/sources/src-a/mod-a/)\n' })) },
    // ★**해석기 셋을 한 자식으로 덮는다**(Check 2차 G-2). 초판은 D-20~22가 셋 다
    // `sourceModules` **한 해석기**를 겨눠서, `oshaParts`와 `ncsModules`를 **맞바꿔도**
    // 51건 전원 초록이었다 — D-20이 잡은 병(206건이 쓰레기인데 전원 초록)과 같은 모양이 셋 남아 있었다.
    { name: 'D-23 ★osha·ncs·daegu 해석기가 각각 자기 값을 낸다 (맞바꾸면 운다)', wantStatus: 0,
      wantReason: [/전 항목 통과/, /osha-scs\/\[part\] → 1/, /ncs-semi\/\[module\] → 2/, /daegu-hs-process\/\[module\] → 3/],
      denyReason: [/링크 대상이 없다/],
      tree: okTree(FAKE_TS({
        'src/app/sources/osha-scs/[part]/page.tsx': PAGE,
        'src/app/sources/ncs-semi/[module]/page.tsx': PAGE,
        'src/app/sources/daegu-hs-process/[module]/page.tsx': PAGE,
        // ★수를 1·2·3으로 다르게 준다 — 같으면 맞바꿔도 조용하다.
        'src/lib/sources.ts': `
export const OSHA_SCS = { sections: [{ id: 'o1' }] };
export const NCS_SEMI = { sections: [{ id: 'n1' }, { id: 'n2' }] };
export const DAEGU_HS = { sections: [{ id: 'd1' }, { id: 'd2' }, { id: 'd3' }] };
export function getOrderedSources() { return [{ id: 'src-a' }]; }
export function getSource() { return { sections: [{ id: 'mod-a' }] }; }
`,
        'docs/a.md': '# a\n\n[o](/sources/osha-scs/o1/) · [n](/sources/ncs-semi/n2/) · [d](/sources/daegu-hs-process/d3/)\n' })) },
    // ★해석기 키가 트리에 실재하는지 잰다 — **죽은 키는 조용하다**(렌더 관문의 ε와 같은 자리).
    { name: 'D-24 ★해석기 키가 전부 트리에 있으면 exit 0', wantStatus: 0, env: { DLG_KEYCHECK: '1' },
      wantReason: [/전 항목 통과/], denyReason: [/ROUTE_RESOLVERS에 있는데/],
      tree: okTree(FAKE_TS(ALL_ROUTE_DIRS)) },
    { name: 'D-25 ★해석기 키가 트리에 없으면 exit 2 (죽은 표면을 잡는다)', wantStatus: 2, env: { DLG_KEYCHECK: '1' },
      wantReason: [/ROUTE_RESOLVERS에 있는데/, /chapter\/\[slug\]/],
      tree: (() => { const t = okTree(FAKE_TS(ALL_ROUTE_DIRS)); delete t['src/app/chapter/[slug]/page.tsx']; return t; })() },
    // ★`keys()`의 누락 단언을 잰다 — 초판의 `.filter(Boolean)`은 **조용히 줄여서**
    // 그 항목의 링크에 거짓 `exit 1`을 냈다. 앱은 그 자리에서 빌드가 깨진다.
    { name: 'D-26 ★JSON 항목에 키가 없으면 exit 2 (조용히 줄이지 않는다)', wantStatus: 2,
      wantReason: [/'slug'이 없다/, /라우트를 열거할 수 없다/], denyReason: [/링크 대상이 없다/],
      tree: okTree({ 'src/app/chapter/[slug]/page.tsx': PAGE,
        'src/data/chapters.json': JSON.stringify([{ slug: 'ch-a' }, { title: '슬러그 없음' }]),
        'docs/a.md': '# a\n\n[좋다](/chapter/ch-a/)\n' }) },
    { name: 'D-14 ★링크의 절대 경로는 라우트에 없으면 public/도 본다 (비대칭 제거)', wantStatus: 0,
      wantReason: [/전 항목 통과/], denyReason: [/링크 대상이 없다/],
      tree: okTree({ 'public/sitemap.xml': '<x/>', 'docs/a.md': '# a\n\n[사이트맵](/sitemap.xml)\n' }) },
  ];
  for (const c of cases) if (!await spawnChild(c)) ok = false;
  return ok;
}

async function runSelfTest() {
  // (리셋을 두지 않는다 — `runSelfTest()`는 정확히 한 번만 불리므로 **발화할 수 없는 가드**다.
  //  이 파일이 `ATTR`의 `lastIndex = 0`을 같은 이유로 없앤 그 부류다. 두 번 불리게 되면
  //  `CONTROLS` 대조가 배로 세어 즉시 운다 — 조용히 넘어가지 않는다.)
  let ok = true;
  /** ★예외를 여기서 잡는다 — 안 잡으면 Node가 **1**로 끝나는데 계약상 1은 *콘텐츠 위반*이다. */
  try {
    if (!selfTestJudge()) ok = false;
    if (!await selfTestDisposition()) ok = false;
  } catch (e) {
    console.error(`❌ 자체검사가 예외로 죽었다 — ${e?.stack ?? e}`);
    console.error('   (검사기가 자기 범위를 주장할 수 없다 — 종료 코드는 2다.)');
    process.exit(2);
  }
  // ★**이름이 유일한지 본다**(Check 5차 4). `CONTROLS`는 **개수**만 재므로 같은 이름이 둘이어도
  // 43은 43이다 — 실제로 번호가 **세 번** 충돌했고(재번호 3회) 마지막엔 판정과 처분에 같은 번호가
  // 하나씩 있었다. 그래서 번호를 버리고 무리별 접두어(`J-01`·`D-01`)로 바꾸면서 이 단언을 얹는다.
  // (이 단언 자신은 대조군을 만들 수 없다 — 위 상한 목록의 *식별자 유일성 단언*이 그것이다.
  //  **서수로 가리키지 않는다** — 이 파일이 번호 인용으로 세 번 낡았고, 그 목록에서 방금 수를 지웠다.)
  // ★**식별자만** 본다 — 이름 전체를 비교하면 공허하다(Check 5차 실측: 접두어를 겹쳐도
  // 뒤 설명이 달라 통과했다. 실제 충돌이었던 `㉙ 홑따옴표` vs `㉙ 정상 트리`도 못 잡았을 것이다).
  // **인용에 쓰이는 것은 식별자이므로 유일해야 하는 것도 식별자다.**
  const ids = Object.values(seen).flat().map((n) => n.split(' ')[0]);
  if (new Set(ids).size !== ids.length) {
    const dup = [...new Set(ids.filter((n, i) => ids.indexOf(n) !== i))];
    console.error(`❌ 대조군 식별자가 겹친다 — ${dup.join(' · ')}`);
    console.error('   (개수만 재면 충돌이 조용하다. 식별자는 인용에 쓰이므로 겹치면 인용이 거짓이 된다.)');
    process.exit(2);
  }
  // ★**접두어가 무리와 맞는지도 본다**(Check 6차 G). 모양만 보면 `record('판정', 'D-30 …')`이
  // 개수·유일성·모양을 전부 통과한다 — 그러면 이름 인용이 다시 거짓이 된다.
  const PREFIX = { 판정: 'J', 처분: 'D' };
  const bad = Object.entries(seen).flatMap(([g, names]) =>
    names.map((n) => n.split(' ')[0])
      .filter((id) => !new RegExp(`^${PREFIX[g]}-\\d{2}$`).test(id))
      .map((id) => `${g}:${id}`));
  if (bad.length) {
    console.error(`❌ 대조군 식별자가 무리와 안 맞는다 — ${bad.join(' · ')}`);
    console.error(`   (${Object.entries(PREFIX).map(([g, p]) => `${g}=${p}-NN`).join(' · ')})`);
    process.exit(2);
  }
  const off = Object.entries(CONTROLS).filter(([g, want]) => seen[g].length !== want);
  if (off.length) {
    for (const [g, want] of off) console.error(`❌ 대조군 수가 선언과 다르다 — ${g} ${seen[g].length}건인데 선언은 ${want}이다.`);
    console.error('   대조군을 더하거나 뺐으면 이 수도 함께 고쳐라 — 그 diff가 근거가 된다.');
    process.exit(2);
  }
  console.log(`   대조군 ${Object.entries(seen).map(([g, v]) => `${g} ${v.length}`).join(' · ')} — 선언과 일치`);
  return ok;
}

// ───────────────────────────────────────────────────────────────

/** ★어디서 터지든 종료 코드는 2다 — Node 기본값 1은 계약상 *콘텐츠 위반*이라 거짓말이 된다. */
const dieOnCrash = (kind) => (e) => {
  console.error(`❌ 검사기가 ${kind}으로 죽었다 — ${e?.stack ?? e}`);
  console.error('   (검사기가 자기 범위를 주장할 수 없다 — 종료 코드는 2다.)');
  process.exit(2);
};
process.on('uncaughtException', dieOnCrash('예외'));
process.on('unhandledRejection', dieOnCrash('처리 안 된 거부'));

const argv = process.argv.slice(2);

if (argv.includes('--self-test')) {
  const ok = await runSelfTest();
  console.log(ok ? '\n✅ 자체검사 전 항목 통과 — ※ **본 검사는 돌지 않았다.**' : '\n❌ 자체검사 실패.');
  process.exit(ok ? 0 : 2);
}

/** ★자식은 자체검사를 건너뛴다 — 안 그러면 자식이 또 자식을 낳아 무한 재귀다. */
if (!process.env.DLG_CHILD && !await runSelfTest()) {
  console.error('\n❌ 자체검사 실패 — 판정 함수가 오류를 놓친다. 본 검사를 실행하지 않는다.');
  process.exit(2);
}
if (!process.env.DLG_CHILD) console.log('');

process.exit(runMain());
