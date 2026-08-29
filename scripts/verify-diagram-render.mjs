/**
 * 도해 렌더 심층 검증 — 브라우저가 있어야만 볼 수 있는 것만 본다.
 *
 * Design: docs/archive/2026-08/diagram-render-gate/diagram-render-gate.design.md §4
 *
 * `verify-diagram-placement.mjs`(C-1~C-19)와의 분업:
 *   정적 관문 = **토큰이 결정하는 것** (TONE × TEXT 대비 · svgBox 계약)
 *   이 스크립트 = **좌표가 결정하는 것** (무엇이 글자 밑에 오는지 · 실제 축소 배율 · 실제 넘침)
 * 중복이 아니다. G-9에서 잡은 결함 3건 중 겹침·실제 넘침은 좌표를 알아야 판정된다.
 *
 * 상시 관문이 아니다 — 서버와 자격 증명이 필요하고 SVG 92페이지 × 2뷰포트가 약 2.5분이다(자체검사 ⑫가 자식으로 본 검사를 한 번 더 도는 몫 약 46초 포함).
 * (자체검사 `--self-test`만은 서버·자격 증명 없이 돈다 — 약 50초. 대조군 15건 중 setContent로 도는
 *  14건은 0.3초고, 나머지 전부가 처분 대조군 ⑫의 자식 프로세스 몫이다.)
 * 사이클 종료 시점과 도해를 새로 추가했을 때 돌린다.
 *
 * 자격 증명: process.env.SITE_AUTH_ID · SITE_AUTH_PASSWORD만 읽는다.
 * `.env.local`을 직접 파싱하지 않는다 — 파일을 읽으면 값이 스크립트를 지나 로그에 새기 쉽다.
 * 셸에서 넘긴다:  set -a; . ./.env.local; set +a; npm run verify:render
 */
import { readFileSync, readdirSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync } from 'node:fs';
import path from 'node:path';

const BASE = process.env.RENDER_BASE ?? 'http://localhost:3016';
const VIEWPORTS = [
  [375, 760, '모바일'],
  [1440, 900, '데스크톱'],
];
/** 실효 글자 크기 하한. NodeGraph의 badge가 설계상 9px이라 그것이 바닥이다. */
const MIN_FONT_PX = 9;
const MIN_CONTRAST = 4.5;

/**
 * SVG를 그리는 컴포넌트 — 이름을 적지 않고 **소스에서 유도**한다.
 * `verify-diagram-placement.mjs`의 C-18도 같은 방식(`<svg` 포함 여부)으로 구한다.
 * 목록을 적어 두면 7번째 SVG 컴포넌트가 생겼을 때 이 스크립트가 그 페이지를 조용히 건너뛴다
 * — CLAUDE.md가 경계하는 수동 미러를 늘리는 일이다(G-5).
 */
const DIAGRAM_DIR = 'src/components/diagram';
/** 디렉터리에 파일로 있는 도해 12종. SVG 여부를 묻지 않는다. */
const ALL_COMPONENTS = (() => {
  // 읽기 실패는 `throw`가 아니라 `exit 2`다 — throw면 Node가 1을 내는데 계약상 1은 콘텐츠 위반이다.
  // 바로 아래 배럴에는 이 방어를 했으면서 여기 두 줄은 빠져 있었다(Check 곁가지 지적).
  try {
    return readdirSync(DIAGRAM_DIR)
      .filter((f) => f.endsWith('.tsx') && f !== 'DiagramFrame.tsx')
      .map((f) => f.replace(/\.tsx$/, ''));
  } catch {
    console.error(`❌ ${DIAGRAM_DIR}를 읽을 수 없다 — 경로 규약이 바뀌었다.`);
    process.exit(2);
  }
})();
if (ALL_COMPONENTS.length === 0) {
  console.error(`❌ ${DIAGRAM_DIR}에 도해 컴포넌트가 하나도 없다 — 경로 규약이 바뀌었다.`);
  process.exit(2);
}

/**
 * ★γ의 독립 출처 — 배럴(`index.ts`)이 **이름으로** 내보내는 도해.
 *
 * `readdirSync`와 같은 디렉터리를 보지만 **근거가 다르다.** 배럴은 이름과 경로를 따로
 * 적으므로(`export { LayerStack } from './LayerStack'`) 파일이 디렉터리 **밖으로** 나가도
 * 이름은 남는다 — 그때 `ALL_COMPONENTS`만 조용히 줄어든다. 그 어긋남이 γ다.
 * `DiagramFrame`·토큰·타입은 도해가 아니라 뺀다.
 */
const BARREL_COMPONENTS = (() => {
  const p = path.join(DIAGRAM_DIR, 'index.ts');
  // 읽기 실패는 `throw`가 아니라 `exit 2`다 — throw면 Node가 **1**을 내는데, 계약상
  // 1은 *콘텐츠 위반*이다. 정적 관문이 `readOrExit2()`로 같은 실수를 고쳤다(usage §2.1.1f).
  let src;
  try { src = readFileSync(p, 'utf8'); }
  catch { console.error(`❌ 도해 배럴 ${p}을 읽을 수 없다 — 경로 규약이 바뀌었다.`); process.exit(2); }
  const names = [...src.matchAll(/^export \{ (\w+) \} from/gm)].map((m) => m[1]);
  return names.filter((n) => n !== 'DiagramFrame');
})();
if (BARREL_COMPONENTS.length === 0) {
  console.error(`❌ ${DIAGRAM_DIR}/index.ts에서 도해 export를 하나도 읽지 못했다 — 배럴 형식이 바뀌었다.`);
  process.exit(2);
}
const SVG_COMPONENTS = readdirSync(DIAGRAM_DIR)
  .filter((f) => f.endsWith('.tsx') && f !== 'DiagramFrame.tsx')
  .filter((f) => readFileSync(path.join(DIAGRAM_DIR, f), 'utf8').includes('<svg'))
  .map((f) => f.replace(/\.tsx$/, ''));
if (SVG_COMPONENTS.length === 0) {
  console.error(`❌ ${DIAGRAM_DIR}에서 SVG 컴포넌트를 찾지 못했다 — 경로가 바뀌었다.`);
  process.exit(2);
}

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exit(2);
}


/**
 * ★**브라우저 없이 아는 것은 브라우저 앞에서 말한다.** γ·ε·α₀·σ는 파일시스템과 MDX만 보면
 * 판정되는데, 예전에는 본 검사 루프 **뒤**에 있어 92페이지 × 2뷰포트를 다 돈 **약 110초 뒤**에
 * 울었다. 사람이 원인을 찾기 어렵고, 무엇보다 **그 110초가 헛수고**다.
 *
 * | | 비교 | 잡는 것 |
 * |γ| 배럴 − 디렉터리 | 배럴은 아는데 파일이 없다(디렉터리 **밖으로** 옮겼다) |
 * |ε| 디렉터리 − 배럴 | 파일은 있는데 배럴이 안 내보낸다. **배럴 정규식이 놓친 경우도 여기 걸린다** |
 * |α₀| 유도 − MDX 사용 | SVG 도해로 보는데 **어느 MDX도 쓰지 않는다** |
 * |σ| URL 규칙 밖 | 도해가 있는 MDX인데 URL로 못 옮겼다 — 예전엔 경고 한 줄 뒤 `exit 0`이었다(F-2의 형제) |
 *
 * ε가 없으면 배럴 한 줄만 어긋나도 조용하다 — `export { A, type B } from` 처럼 쓰면
 * `^export \{ (\w+) \} from` 정규식이 놓치는데, 배럴은 δ의 기준선이자 `urls`의 상류였다.
 * 실측: 배럴에서 `NodeGraph`를 빼면 URL이 92 → 87로 조용히 줄었다.
 */
function scopeStatic({ svg, dir, barrel, pagesByKind, skipped }) {
  const out = [];
  for (const c of barrel) {
    if (!dir.includes(c)) out.push(`γ ${c} — 배럴이 내보내는데 ${DIAGRAM_DIR}에 파일이 없다 (밖으로 옮겼나)`);
  }
  for (const c of dir) {
    if (!barrel.includes(c)) {
      out.push(`ε ${c} — 파일은 있는데 배럴이 안 내보낸다 (도해가 아니면 디렉터리 밖에 두고, 맞으면 index.ts에 넣어라)`);
    }
  }
  for (const c of svg) {
    if ((pagesByKind?.get(c)?.size ?? 0) === 0) {
      out.push(`α₀ ${c} — 유도는 SVG 도해로 보는데 **어느 MDX도 쓰지 않는다** (만들고 아직 안 썼나 · 그래도 미검사다)`);
    }
  }
  for (const rel of skipped ?? []) {
    out.push(`σ ${rel} — 도해가 있는 MDX인데 URL 규칙이 없어 검사 목록에 못 넣었다`);
  }
  return out;
}

/**
 * ★범위 하한 — **네 방향**으로 본다. 순수 함수라 대조군이 브라우저 없이 부를 수 있다.
 *
 * `기대 − 관측`(α) 하나만 보면 **가장 중요한 경우를 놓친다.** 유도에서 빠진 컴포넌트는 URL
 * 수집에서도 빠져 관측에 안 나오고, 그러면 기대에도 관측에도 없어 **차집합이 공집합**이다.
 * 선행 사이클의 A-3(문턱을 한쪽 끝에서만 봤다)과 같은 병이다.
 *
 * | | 비교 | 잡는 것 |
 * |α| 유도 − 관측        | 유도는 SVG로 보는데 어디에서도 안 그려졌다 |
 * |β| 관측 − 디렉터리     | 그려졌는데 그런 컴포넌트 파일이 없다(`kind` 오타·유령) |
 * |γ| 배럴 − 디렉터리     | 배럴은 아는데 파일이 없다(디렉터리 **밖으로** 옮겼다) |
 * |δ| **페이지 단위 피복** | 이 종을 쓰는 페이지가 검사 목록에서 빠졌다 |
 *
 * **δ가 없으면 이 검사는 헛것이다.** 실측: `LayerStack`을 유도에서 빼면 92 → 56페이지로
 * 줄었는데 α는 조용했다 — 남은 페이지 8개에 `LayerStack`이 함께 있어 관측에는 나왔다.
 * **36페이지가 조용히 검사 밖이었다.**
 */
function scopeViolations({ svg, dir, observed, observedSvg, pagesByKind, urls }) {
  const out = [];
  const obs = new Set(observed);
  const urlSet = new Set(urls);
  for (const c of svg) {
    if (obs.has(c)) continue;
    // ★두 상황을 가른다. 판정은 같아도 **심각도가 다르다.**
    //   used=0  아직 아무 MDX도 안 쓴다 — 새로 만들고 안 쓰는 흔한 경우다.
    //   used>0  쓰는데 안 그려졌다 — 렌더가 죽었거나 URL 수집이 그 페이지를 놓쳤다.
    // 메시지를 안 가르면 뒤엣것이 앞엣것에 묻힌다.
    const used = pagesByKind?.get(c)?.size ?? 0;
    out.push(used === 0
      ? `α ${c} — 유도는 SVG 도해로 보는데 **어느 MDX도 쓰지 않는다** (만들고 아직 안 썼나 · 그래도 미검사다)`
      : `α ${c} — MDX ${used}곳이 쓰는데 ${urls.length}페이지 어디에서도 그려지지 않았다 (렌더가 죽었나)`);
  }
  for (const c of obs) {
    if (!dir.includes(c)) out.push(`β ${c} — 그려졌는데 ${DIAGRAM_DIR}에 그런 컴포넌트가 없다`);
  }
  for (const c of observedSvg) {
    const want = pagesByKind.get(c);
    if (!want) continue;                       // 배럴에 없는 종은 β가 말한다
    const missed = [...want].filter((u) => !urlSet.has(u));
    if (missed.length) {
      out.push(`δ ${c} — 글자 있는 SVG를 그리는데 이 종을 쓰는 페이지 ${missed.length}개가 검사 목록에 없다`
        + ` (예: ${missed.slice(0, 3).join(' ')})`);
    }
  }
  return out;
}

/** 도해를 가진 MDX를 URL로 옮긴다. chapters는 slug 매핑이 필요하다. */
function collectUrls() {
  const chapters = JSON.parse(readFileSync('src/data/chapters.json', 'utf8'));
  // ★`number`가 아니라 `id`로 잇는다. `chapters.json`에 `number` 필드는 **하나도 없어서**
  // 예전 매핑(`String(c.number).padStart(2,'0')`)은 빈 Map을 만들었고, **책 17장이 통째로
  // 렌더 관문 밖**이었다. 경고 한 줄은 났지만 종료 코드는 0이었다 — 이 사이클이 막으려는
  // 바로 그 모양이고, δ가 실물로 처음 잡아낸 것이다(Do §G-5b).
  const slugById = new Map();
  for (const c of chapters.chapters ?? chapters) {
    if (c.slug && c.id) slugById.set(c.id, c.slug);
  }
  if (slugById.size === 0) {
    console.error('❌ chapters.json에서 id→slug를 하나도 읽지 못했다 — 스키마가 바뀌었다.');
    process.exit(2);
  }
  const re = new RegExp(`<(${SVG_COMPONENTS.join('|')})[\\s/>]`);
  // ★δ의 기준선 — **배럴 이름으로** "이 종을 쓰는 페이지"를 전부 모은다.
  // `<svg` 유도와 **다른 출처**라 유도가 틀려도 이쪽은 안 틀린다.
  const reAny = new RegExp(`<(${BARREL_COMPONENTS.join('|')})[\\s/>]`, 'g');
  const usedInMdx = new Set();
  const pagesByKind = new Map(BARREL_COMPONENTS.map((c) => [c, new Set()]));
  const urls = new Set();
  const skipped = [];
  /** MDX 경로 → URL. 유도와 무관하게 **모든** MDX에 대해 구한다. */
  const toUrl = (rel) => {
    if (rel.startsWith('chapters/')) {
      const slug = slugById.get(rel.slice(9));
      return slug ? `/chapter/${slug}/` : null;
    }
    // `part-2.ko` 처럼 언어 미러는 별도 라우트가 아니다 — 본 라우트가 두 언어를 함께 렌더한다.
    if (rel.startsWith('sources/')) return `/sources/${rel.slice(8).replace(/\.ko$/, '')}/`;
    if (rel.startsWith('processes/')) return `/process/${rel.slice(10)}/`;
    return null;
  };
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (!e.name.endsWith('.mdx')) continue;
      const src = readFileSync(p, 'utf8');
      const kinds = [...new Set([...src.matchAll(reAny)].map((m) => m[1]))];
      const inScope = re.test(src);
      // ★`urls`를 배럴에서 **뗀다.** 예전에는 `kinds.length === 0`이면 여기서 나가는 바람에
      // 배럴 정규식이 놓친 종만 쓰는 MDX가 `urls`에서도 사라졌다 — 배럴이 δ의 기준선이자
      // `urls`의 상류라 **"두 독립 출처"가 실은 하나**였다. 실측: 배럴에서 `NodeGraph`를 빼면
      // URL이 92 → 87로 조용히 줄었고 δ는 그 종의 키가 없어 침묵했다.
      if (!kinds.length && !inScope) continue;
      const rel = p.replace(/^src\/content\//, '').replace(/\.mdx$/, '');
      const url = toUrl(rel);
      if (!url) { skipped.push(rel); continue; }
      for (const k of kinds) { usedInMdx.add(k); pagesByKind.get(k)?.add(url); }
      if (inScope) urls.add(url);
    }
  };
  walk('src/content');
  // ★ζ **표본** — 유도가 *비SVG*로 분류한 종마다 그 종을 쓰는 페이지 **하나**를 검사에 넣는다.
  //
  // δ는 그 종이 **글자 있는 SVG를 그리는 것을 본 적이 있어야** 운다. 그런데 비SVG 종이
  // SVG 종과 한 번도 같은 페이지에 안 나오면 **관측 자체가 생기지 않아** δ가 침묵한다.
  // `FlowSteps`(lucide 아이콘으로 SVG를 그린다)가 그 위험을 실물로 보여 줬다 — 지금은
  // 우연히 SVG 종과 겹치는 페이지가 있어 관측되지만, 겹치지 않는 종이 생기면 조용해진다.
  //
  // 배럴 종의 **모든** 페이지를 검사하면(248페이지) 유도를 아예 안 믿게 되지만 본 검사가
  // 113초 → 약 304초가 된다(실측 추정). **표본 하나면 관측이 생기고, 판정은 δ가 한다** —
  // 그 종이 정말 글자 있는 SVG를 그리면 δ가 나머지 페이지를 전부 지목한다. 비용은 최대 6페이지다.
  for (const c of BARREL_COMPONENTS) {
    if (SVG_COMPONENTS.includes(c)) continue;          // 유도가 이미 전량을 넣었다
    const pages = [...(pagesByKind.get(c) ?? [])].sort();
    if (pages.length && !pages.some((u) => urls.has(u))) urls.add(pages[0]);
  }
  // 범위를 조용히 줄이지 않는다 — 빠진 것이 있으면 말한다.
  return { urls: [...urls].sort(), usedInMdx, pagesByKind, skipped };
}

/** 페이지에서 계측한다. 브라우저 안에서 실행되는 코드다. */
function measureInPage(minFont, minContrast) {
  const cv = document.createElement('canvas');
  cv.width = 1; cv.height = 1;
  const c2d = cv.getContext('2d', { willReadFrequently: true });
  /** Tailwind v4는 oklch를 계산값으로 준다 — 정규식 파싱은 틀리므로 canvas로 sRGB를 읽는다. */
  const parse = (c) => {
    if (!c || c === 'none' || c === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
    c2d.clearRect(0, 0, 1, 1);
    c2d.fillStyle = '#010203';
    c2d.fillStyle = c;
    if (c2d.fillStyle === '#010203') return null;
    c2d.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = c2d.getImageData(0, 0, 1, 1).data;
    return { r, g, b, a: a / 255 };
  };
  const lin = (v) => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
  const lum = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const ratio = (x, y) => { const [hi, lo] = [lum(x), lum(y)].sort((a, b) => b - a); return (hi + 0.05) / (lo + 0.05); };

  const de = document.documentElement;
  const out = {
    pageOverflow: de.scrollWidth > de.clientWidth ? { sw: de.scrollWidth, cw: de.clientWidth } : null,
    small: [],
    lowContrast: [],
    markers: { missing: [], dup: [] },
    glyphHole: [],
    /** 판정할 수 없는 구조 — "통과"가 아니라 `exit 2`다. */
    unsupported: [],
    /** ★관측 — 이 페이지가 실제로 그린 도해 종류. 범위 하한 대조의 한쪽이다. */
    kinds: [],
    /**
     * ★그중 **이 관문이 판정할 것을 그린** 종 — 글자 있는 SVG다. δ의 대상.
     *
     * *"SVG를 그린다"* 와 *"이 관문이 판정할 것을 그린다"* 는 다른 문장이다.
     * `FlowSteps`는 `lucide-react` 아이콘 때문에 `<svg viewBox>`를 그리지만 그 안에 글자가
     * 없다 — `figures`로 세지도 않고 판정도 안 한다. 넓게 잡았더니 62페이지를 거짓으로
     * 지목했다(실측). `out.figures`와 **같은 기준**을 쓴다.
     */
    kindsSvg: [],
    figures: 0,
  };
  const pageBg = parse(getComputedStyle(document.body).backgroundColor) ?? { r: 255, g: 255, b: 255, a: 1 };
  // ★`figure svg[viewBox]`가 아니라 `figure[data-diagram]` 전부를 본다 — SVG를 안 그리는
  // 종도 세야 γ(둘 다 몰랐다)의 기준선과 견줄 수 있다.
  const figs = [...document.querySelectorAll('figure[data-diagram]')];
  out.kinds = [...new Set(figs.map((f) => f.getAttribute('data-diagram')).filter(Boolean))];
  // 판정 대상 여부를 **유도가 아니라 관측**으로 정한다 — 파일 내용(`<svg` 포함)이 아니라
  // 실제로 그려진 것으로 안다. 기준은 `figures`와 같다: viewBox가 있고 **그려지는 글자**가 있다.
  const NOT_PAINTED_SEL = 'defs, mask, pattern, clipPath, symbol, marker';
  out.kindsSvg = [...new Set(figs.filter((f) => [...f.querySelectorAll('svg[viewBox] text')]
    .some((t) => t.textContent.trim() && !t.closest(NOT_PAINTED_SEL)))
    .map((f) => f.getAttribute('data-diagram')).filter(Boolean))];

  document.querySelectorAll('figure svg[viewBox]').forEach((svg) => {
    const vb = svg.viewBox.baseVal;
    const rw = svg.getBoundingClientRect().width;
    if (!vb.width || !rw) return;
    const k = rw / vb.width;
    // 그려지지 않는 요소 — 배경 후보(rects)와 라벨(texts) **양쪽**에서 뺀다.
    const NOT_PAINTED = 'defs, mask, pattern, clipPath, symbol, marker';
    // ★**그려지는** 글자만 라벨이다. `defs`·`pattern`·`mask` 안의 텍스트는 화면에
    // 그려지지 않는다 — `<pattern>` 안의 `+`/`−` 글리프가 대표적이다.
    // 지난 사이클이 **배경 후보(`rects`)** 에서 이것을 걸러 106건 오탐을 고쳤는데
    // **글자 쪽(`texts`)은 그대로 뒀다.** 실제 앱에서 안 터진 것은 우연이다 —
    // 패턴 글리프는 타일 좌표 (4,12)이고 층 rect는 bodyX=16,y=16에서 시작해
    // 어느 rect에도 안 들어갔을 뿐이다. 대조군 ⑪이 이것을 고정한다.
    const texts = [...svg.querySelectorAll('text')]
      .filter((t) => t.textContent.trim() && !t.closest(NOT_PAINTED));
    // ★`<use>`가 `defs`/`symbol` 안의 `<text>`를 가리키면 **글자는 그려지는데** 위 필터가
    // 원본을 `NOT_PAINTED`로 빼 버려 세 판정을 통째로 빠져나간다. 인스턴스의 변환·상속
    // 스타일까지 풀어 재려면 별개 설계라, 이 검사기는 **재는 척하지 않고 판정 불가라고 말한다.**
    // 종료 코드 계약대로 `2`다 — "검사기가 자기 범위를 주장할 수 없음".
    // 지금 저장소에 `<use>`는 0건이다. 이 가드는 **누가 처음 쓰는 순간** 울리라고 있다.
    for (const u of svg.querySelectorAll('use')) {
      const href = u.getAttribute('href') ?? u.getAttribute('xlink:href') ?? '';
      if (!href.startsWith('#')) continue;
      const target = svg.ownerDocument.getElementById(href.slice(1));
      if (target && (target.tagName.toLowerCase() === 'text' || target.querySelector('text'))) {
        out.unsupported.push({ why: '<use>가 글자를 참조한다 — 인스턴스를 재지 못한다', ref: href.slice(0, 40) });
      }
    }
    if (!texts.length) return;
    out.figures += 1;
    const cap = (svg.closest('figure')?.querySelector('figcaption')?.innerText ?? '').replace(/\s+/g, ' ').slice(0, 34);
    const frameBg = parse(getComputedStyle(svg.closest('figure')).backgroundColor);
    const base = frameBg && frameBg.a > 0 ? over(frameBg, pageBg) : pageBg;
    // ★**그려지는** 도형만 배경 후보다. `defs`·`mask`·`pattern`·`clipPath`·`symbol` 안의
    // 도형은 화면에 칠해지지 않는다. 이것을 안 걸렀더니 `LayerStack`이 라벨 자리에 낸
    // 마스크 구멍(`fill="black"`)이 **가장 작은 포함 사각형**으로 뽑혀 배경이 검정이 됐고,
    // 멀쩡한 라벨 106건(53영역 × 2뷰포트)이 대비 1.44로 잡혔다.
    const rects = [...svg.querySelectorAll('rect, circle, ellipse')]
      .filter((r) => !r.closest(NOT_PAINTED));

    for (const t of texts) {
      const fs = parseFloat(getComputedStyle(t).fontSize) * k;
      if (fs < minFont) {
        out.small.push({ px: Math.round(fs * 10) / 10, sample: t.textContent.trim().slice(0, 18), cap });
      }
      // 좌표로 배경을 찾는다 — 이 스크립트의 존재 이유다.
      let bb; try { bb = t.getBBox(); } catch { continue; }
      const cx = bb.x + bb.width / 2;
      const cy = bb.y + bb.height / 2;
      let best = null;
      // 패턴 채움 rect도 **같은 순회에서** 모은다. 따로 훑으면 getBBox 호출이 두 배가 되고
      // (글자 × 사각형) 비용이라 3분짜리 검사가 10분을 넘겼다 — 실측.
      let topmost = null;
      for (const r of rects) {
        let box; try { box = r.getBBox(); } catch { continue; }
        if (cx < box.x || cx > box.x + box.width || cy < box.y || cy > box.y + box.height) continue;
        const area = box.width * box.height;
        if (!best || area < best.area) best = { el: r, area };
        topmost = r; // 문서 순서상 마지막 = 실제로 맨 위에 칠해진 것
      }
      let bg = base;
      if (best) {
        const f = parse(getComputedStyle(best.el).fill);
        if (f && f.a > 0) bg = over(f, base);
      }
      const fg = parse(getComputedStyle(t).fill);
      if (!fg) {
        // 색을 못 읽는 것은 '통과'가 아니다 — 정적 층(C-19)도 같은 상황을 위반으로 올린다.
        out.lowContrast.push({ ratio: null, sample: t.textContent.trim().slice(0, 18), onShape: !!best, cap });
        continue;
      }
      const r = ratio(over(fg, bg), bg);
      if (r < minContrast) {
        out.lowContrast.push({
          ratio: Math.round(r * 100) / 100,
          sample: t.textContent.trim().slice(0, 18),
          onShape: !!best,
          cap,
        });
      }

      // ★글리프 구멍 계약 (diagram-label-legibility D-4 후단).
      // 정적 C-20은 "마스크가 있고 glyphHole()을 거쳤다"까지만 본다 — **구멍이 라벨을
      // 실제로 덮는지**는 좌표라 여기서만 판정된다. 구멍 좌표를 0으로 만들어도 C-20은
      // 통과한다(Check A-2 실증) — 그 한 줄이 층 44건을 통째로 되돌린다.
      // ★`best`로 판정하면 **공허하다** — 바탕 rect와 패턴 rect는 기하가 같아 면적이 동률이고,
      // `area < best.area`가 엄격 비교라 **먼저 그려진 바탕 rect**가 이긴다. 그 rect의 fill은
      // 패턴이 아니라 클래스라 규칙을 통째로 건너뛴다. 구멍을 0으로 만든 회귀를 주입했더니
      // 이 규칙이 그대로 통과했다(Check A-2 재현 중 발견). **글자를 덮는 패턴 rect를 직접 찾는다.**
      // **맨 위 도형**이 패턴일 때만 본다. 글자 위를 덮는 마지막 도형이 불투명하면(예: `metal`
      // tone의 well) 그 아래 글리프는 이미 가려져 결함이 아니다. "맨 위 **패턴**"으로 골랐더니
      // `020-jfet`의 «소스»·«드레인»(회색 well 위, 완벽히 읽힘)이 거짓 경보가 됐다 — 실측.
      if (topmost && /^url\(#/.test(topmost.getAttribute('fill') ?? '')) {
        const pr = topmost;
          const mref = (pr.getAttribute('mask') ?? '').match(/^url\(#(.+)\)$/);
          const mask = mref ? svg.querySelector(`mask[id="${mref[1]}"]`) : null;
          if (!mask) {
            out.glyphHole.push({ sample: t.textContent.trim().slice(0, 18), why: '패턴 채움 위인데 마스크가 없다', cap });
          } else {
            // 구멍 = 마스크 안에서 검게 칠한 사각형(흰 바탕을 뚫는 것).
            const holes = [...mask.querySelectorAll('rect')].filter((h) => (h.getAttribute('fill') ?? '') === 'black');
            // 엄격 포함은 부동소수 기하에 너무 날카롭다 — 실측에서 **0.1 유닛** 모자라
            // 멀쩡한 라벨 둘이 잡혔다(`060-feol-1`·`015-laser-diode`, 여유 아래 −0.1).
            // 구멍 경계는 타일 경계이고, 그 다음 타일의 글리프는 타일 위에서 3 유닛쯤
            // 떨어져 시작한다(11px 글자의 baseline이 타일 안 y=12). 그보다 작은 초과는
            // 글리프에 닿을 수 없다. 여유를 **2 유닛**으로 두어 그 사이에 선을 긋는다.
            const SLACK = 2;
            let covered = false;
            for (const hr of holes) {
              let hb; try { hb = hr.getBBox(); } catch { continue; }
              if (bb.x >= hb.x - SLACK && bb.y >= hb.y - SLACK
                && bb.x + bb.width <= hb.x + hb.width + SLACK
                && bb.y + bb.height <= hb.y + hb.height + SLACK) { covered = true; break; }
            }
            if (!covered) {
              out.glyphHole.push({ sample: t.textContent.trim().slice(0, 18), why: '구멍이 글자를 덮지 않는다', cap });
            }
          }
      }
    }
  });

  // 마커 참조 정합 — 화살표가 사라지는 결함(en/ko 미러의 idPrefix 충돌)을 잡는다.
  const ids = [...document.querySelectorAll('marker[id]')].map((m) => m.id);
  const idSet = new Set(ids);
  out.markers.dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  const refs = [...document.querySelectorAll('[marker-end],[marker-start]')].flatMap((e) =>
    ['marker-end', 'marker-start'].map((a) => e.getAttribute(a)).filter(Boolean).map((v) => v.replace(/^url\(#|\)$/g, '')));
  out.markers.missing = [...new Set(refs)].filter((id) => !idSet.has(id));
  return out;
}


// ── 자체검사 (`render-gate-self-test`) ────────────────────────────────────────
//
// 왜 있나: 이 스크립트에는 대조군이 **0건**이었다. 지난 사이클이 배경 후보에서
// 그려지지 않는 도형을 걸러 **106건 오탐**을 고쳤는데 그것을 고정하는 검사를 남기지
// 못했다 — 한 줄을 지우면 그대로 돌아오고 아무도 모른다.
//
// 서버도 자격 증명도 필요 없다. `measureInPage`는 `.toString()`으로 직렬화돼
// `page.evaluate`에 들어가므로 `setContent`로 만든 도해에 그대로 먹인다.
// 색은 **`theme.css`에서 읽는다** — 값을 스크립트에 옮겨 적지 않는다(미러 금지).

function selfTestFixtures() {
  const theme = readFileSync('node_modules/tailwindcss/theme.css', 'utf8');
  const tok = (name) => {
    const m = theme.match(new RegExp(`--color-${name}:\\s*(oklch\\([^)]+\\))`));
    if (!m) fail(`theme.css에서 --color-${name}를 못 읽었다 — 팔레트 형식이 바뀌었다.`);
    return m[1];
  };
  const ink = tok('slate-800');
  const bg = tok('rose-100');
  // 문턱값 대조군용 — **양쪽**을 만든다. 한쪽만 보면 문턱이 고정되지 않는다:
  // 초판은 글자와 배경에 같은 토큰을 써서 비율이 정확히 1.00이었고, MIN_CONTRAST를
  // 1.05로 바꿔도 통과했다(Check A-3). 그 대조군은 4.5라는 선에 대해 아무것도 말하지 않는다.
  const near = tok('slate-400');  // rose-100 위에서 AA 미달이지만 1.0보다 훨씬 크다
  const over = tok('slate-600');  // rose-100 위에서 AA 통과

  // ★`<figure>`에 배경을 주지 않는다 — 실제 `DiagramFrame`은 `className="not-prose my-6"`뿐이라
  // 배경이 없고, 그러면 `frameBg.a === 0` → `base = pageBg` 갈래를 탄다.
  // 초판은 `style="background:#fff"`를 줘서 **11건 전부가 실제 도해가 절대 안 지나는 갈래**를
  // 지났다(Check B ⓐ). 값이 우연히 같아 결과가 안 갈렸을 뿐이다.
  const wrap = (svg, extra = '') => `<!doctype html><html><body style="background:#fff;margin:0">`
    + `${extra}<figure style="margin:0">${svg}<figcaption>대조군</figcaption></figure></body></html>`;

  const patDefs = (id) => `<pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse">`
    + `<text x="4" y="12" font-size="11" fill="${ink}">+</text></pattern>`;

  /** 정상 도해 — 여기서 무엇이든 나오면 아래 양성들이 전부 공허하다. */
  const clean = `<svg viewBox="0 0 200 100" width="200" height="100">`
    + `<rect x="0" y="0" width="200" height="100" fill="${bg}"/>`
    + `<text x="8" y="52" font-size="14" fill="${ink}">잘 보인다</text></svg>`;

  return [
    { name: '① 음성 — 정상 도해에 아무것도 내지 않는다', html: wrap(clean),
      only: [],
      ok: (o) => o.small.length === 0 && o.lowContrast.length === 0 && o.glyphHole.length === 0
        && o.markers.missing.length === 0 && o.markers.dup.length === 0 && !o.pageOverflow && o.figures === 1 },

    { name: '② 가로 넘침을 잡는다',
      html: wrap(clean, '<div style="width:3000px;height:1px"></div>'),
      only: ['overflow'],
      ok: (o) => !!o.pageOverflow },

    { name: '③ 글자 축소 — 하한 바로 아래를 잡는다 (8.8px)',
      // ★문턱 **바로 옆**이어야 문턱이 고정된다. 초판은 5px과 10px이라 하한을 6으로
      // 낮춰도 둘 다 유지됐다(Check A-7). viewBox 400 을 176px에 → ×0.44, 20px → 8.8px.
      html: wrap(`<svg viewBox="0 0 400 100" width="176" height="44">`
        + `<rect x="0" y="0" width="400" height="100" fill="${bg}"/>`
        + `<text x="10" y="50" font-size="20" fill="${ink}">작다</text></svg>`),
      only: ['small'],
      ok: (o) => o.small.length === 1 && o.small[0].px < MIN_FONT_PX },

    { name: '③b 글자 축소 — 하한 바로 위는 잡지 않는다 (9.6px)',
      // ×0.48 — 20px 글자가 9.6px. ③(8.8)과 함께 9라는 선을 양쪽에서 조인다.
      html: wrap(`<svg viewBox="0 0 400 100" width="192" height="48">`
        + `<rect x="0" y="0" width="400" height="100" fill="${bg}"/>`
        + `<text x="10" y="50" font-size="20" fill="${ink}">넉넉하다</text></svg>`),
      only: [],
      ok: (o) => o.small.length === 0 },

    { name: '④ 대비 — AA 미달을 잡는다 (토큰 색)',
      html: wrap(`<svg viewBox="0 0 200 100" width="200" height="100">`
        + `<rect x="0" y="0" width="200" height="100" fill="${bg}"/>`
        + `<text x="8" y="52" font-size="14" fill="${near}">묻힌다</text></svg>`),
      only: ['lowContrast'],
      ok: (o) => o.lowContrast.length === 1 && o.lowContrast[0].ratio < MIN_CONTRAST },

    { name: '④b 대비 — AA 통과는 잡지 않는다 (문턱의 반대쪽)',
      html: wrap(`<svg viewBox="0 0 200 100" width="200" height="100">`
        + `<rect x="0" y="0" width="200" height="100" fill="${bg}"/>`
        + `<text x="8" y="52" font-size="14" fill="${over}">잘 보인다</text></svg>`),
      ok: (o) => o.lowContrast.length === 0 },

    { name: '⑤ 글리프 구멍 — 마스크가 없으면 잡는다',
      html: wrap(`<svg viewBox="0 0 200 100" width="200" height="100"><defs>${patDefs('p5')}</defs>`
        + `<rect x="0" y="0" width="200" height="100" fill="${bg}"/>`
        + `<rect x="0" y="0" width="200" height="100" fill="url(#p5)"/>`
        + `<text x="8" y="52" font-size="14" fill="${ink}">패턴 위 글자</text></svg>`),
      only: ['glyphHole'],
      ok: (o) => o.glyphHole.some((g) => /마스크가 없다/.test(g.why)) },

    { name: '⑥ 글리프 구멍 — 구멍이 글자를 안 덮으면 잡는다',
      html: wrap(`<svg viewBox="0 0 200 100" width="200" height="100"><defs>${patDefs('p6')}`
        + `<mask id="m6"><rect x="0" y="0" width="200" height="100" fill="white"/>`
        + `<rect x="180" y="90" width="4" height="4" fill="black"/></mask></defs>`
        + `<rect x="0" y="0" width="200" height="100" fill="${bg}"/>`
        + `<rect x="0" y="0" width="200" height="100" fill="url(#p6)" mask="url(#m6)"/>`
        + `<text x="8" y="52" font-size="14" fill="${ink}">패턴 위 글자</text></svg>`),
      only: ['glyphHole'],
      ok: (o) => o.glyphHole.some((g) => /덮지 않는다/.test(g.why)) },

    { name: '⑦ 마커 미해결을 잡는다',
      html: wrap(`<svg viewBox="0 0 200 100" width="200" height="100">`
        + `<rect x="0" y="0" width="200" height="100" fill="${bg}"/>`
        + `<text x="8" y="52" font-size="14" fill="${ink}">가</text>`
        + `<path d="M 0 0 L 10 10" marker-end="url(#없는마커)"/></svg>`),
      only: ['markersMissing'],
      ok: (o) => o.markers.missing.length > 0 },

    { name: '⑧ 마커 중복을 잡는다',
      html: wrap(`<svg viewBox="0 0 200 100" width="200" height="100"><defs>`
        + `<marker id="dup1" viewBox="0 0 8 8"><path d="M0 0 L8 4 L0 8z"/></marker>`
        + `<marker id="dup1" viewBox="0 0 8 8"><path d="M0 0 L8 4 L0 8z"/></marker></defs>`
        + `<rect x="0" y="0" width="200" height="100" fill="${bg}"/>`
        + `<text x="8" y="52" font-size="14" fill="${ink}">가</text></svg>`),
      only: ['markersDup'],
      ok: (o) => o.markers.dup.length > 0 },

    { name: '⑬ <use>가 글자를 가리키면 판정 불가라고 말한다 (통과가 아니다)',
      // `<use>`가 `defs` 안의 글자를 그리면 화면에는 보이는데 `texts` 필터가 원본을
      // NOT_PAINTED로 빼 버려 세 판정을 통째로 빠져나간다. 재는 척하지 않고 2로 끝낸다.
      // 저장소에 `<use>`는 0건이다 — 이 대조군은 **누가 처음 쓸 때** 가드가 살아 있게 한다.
      html: wrap(`<svg viewBox="0 0 200 100" width="200" height="100">`
        + `<defs><text id="u13" x="8" y="52" font-size="14" fill="${ink}">숨은 라벨</text></defs>`
        + `<rect x="0" y="0" width="200" height="100" fill="${bg}"/>`
        + `<use href="#u13"/>`
        + `<text x="8" y="90" font-size="14" fill="${ink}">보이는 라벨</text></svg>`),
      only: ['unsupported'],
      ok: (o) => o.unsupported.length === 1 && /<use>/.test(o.unsupported[0].why) },

    { name: '⑨ 글자 없는 도해는 figures로 세지 않는다',
      html: wrap(`<svg viewBox="0 0 200 100" width="200" height="100">`
        + `<rect x="0" y="0" width="200" height="100" fill="${bg}"/></svg>`),
      only: [],
      ok: (o) => o.figures === 0 },

    { name: '⑩ 회귀 — 마스크 구멍을 배경으로 읽지 않는다 (106건 사건)',
      // 구멍(fill=black)이 글자를 포함하는 **가장 작은** 사각형이다.
      // NOT_PAINTED 필터를 지우면 배경이 검정이 되어 대비 1.44가 나온다.
      html: wrap(`<svg viewBox="0 0 200 100" width="200" height="100"><defs>${patDefs('p10')}`
        + `<mask id="m10"><rect x="0" y="0" width="200" height="100" fill="white"/>`
        + `<rect x="0" y="32" width="128" height="32" fill="black"/></mask></defs>`
        + `<rect x="0" y="0" width="200" height="100" fill="${bg}"/>`
        + `<rect x="0" y="0" width="200" height="100" fill="url(#p10)" mask="url(#m10)"/>`
        + `<text x="8" y="52" font-size="14" fill="${ink}">패턴 위 글자</text></svg>`),
      ok: (o) => o.lowContrast.length === 0 },

    { name: '⑪ 회귀 — pattern 안 글리프를 라벨로 판정하지 않는다',
      // ⑩과 같은 도해다. `texts`에 NOT_PAINTED 필터가 없으면 pattern 안 `+`가
      // 라벨로 잡혀 글리프 구멍이 뜬다 — Design §0.4에서 실제로 그랬다.
      html: wrap(`<svg viewBox="0 0 200 100" width="200" height="100"><defs>${patDefs('p11')}`
        + `<mask id="m11"><rect x="0" y="0" width="200" height="100" fill="white"/>`
        + `<rect x="0" y="32" width="128" height="32" fill="black"/></mask></defs>`
        + `<rect x="0" y="0" width="200" height="100" fill="${bg}"/>`
        + `<rect x="0" y="0" width="200" height="100" fill="url(#p11)" mask="url(#m11)"/>`
        + `<text x="8" y="52" font-size="14" fill="${ink}">패턴 위 글자</text></svg>`),
      ok: (o) => o.glyphHole.length === 0 },
  ];
}



/**
 * ★대조군이 **자기 판정만** 켜는지 본다.
 *
 * `ok:` 술어는 노리는 버킷 하나만 봤다 — 이를테면 ②는 `!!o.pageOverflow`뿐이라
 * 같은 fixture에서 `lowContrast`가 **잘못** 떠도 통과했다. 그러면 대조군은
 * *"잡는다"* 만 증명하고 *"그것만 잡는다"* 는 증명하지 않는다. **과잉 탐지가 안 보인다.**
 * 이 사이클이 문턱에서 배운 것(*"한쪽 끝만 보면 문턱이 고정되지 않는다"*)과 같은 병이다.
 *
 * `only`에 적은 버킷 **밖**이 하나라도 비어 있지 않으면 실패다. `only`가 없으면 전부 0이어야 한다.
 * `figures`는 버킷이 아니다 — 개수 자체가 판정이라 각 대조군의 `ok:`가 직접 본다.
 */
function offTarget(c, o) {
  const buckets = {
    small: o.small.length,
    lowContrast: o.lowContrast.length,
    glyphHole: o.glyphHole.length,
    markersMissing: o.markers.missing.length,
    markersDup: o.markers.dup.length,
    unsupported: o.unsupported.length,
    overflow: o.pageOverflow ? 1 : 0,
  };
  const allowed = new Set(c.only ?? []);
  return Object.entries(buckets)
    .filter(([k, n]) => n > 0 && !allowed.has(k))
    .map(([k, n]) => `${k}=${n}`);
}



/**
 * ★처분 대조군의 기계 — 스텁 서버 + **임시 cwd**에서 자식을 돌리고 종료 코드와 사유를 본다.
 *
 * **왜 임시 cwd인가.** `collectUrls()`는 cwd 기준으로 `src/content`를 훑는다. 콘텐츠가
 * 한둘뿐인 루트에서 돌리면 URL이 저절로 줄어 자식이 몇 초에 끝난다 — `RENDER_ONLY_URLS`
 * 같은 **범위 축소 인자를 만들지 않고** 같은 효과를 얻는다. 그런 인자는 이 사이클이 막으려는
 * 바로 그 위험이다. 정적 관문의 `selfTestExitCode()`가 쓰는 수단과 같다.
 *
 * **자식은 자체검사를 건너뛴다**(`DGM_RENDER_CHILD`) — 안 그러면 자식이 또 자식을 낳는다.
 * 이 함정은 이 저장소에서 네 번째다(`--all`·`--assert-only`·`--self-test`·여기).
 */
async function spawnChildAgainst({ name, html, mdx, tree, wantStatus = 2, wantReason, denyReason = [], repoBroken = false }) {
  const { createServer } = await import('node:http');
  // ★`spawnSync`를 쓰면 안 된다 — 부모의 이벤트 루프를 막아 스텁 서버가 요청을 못 받고
  // 자식이 "연결할 수 없다"로 죽는다(실측: 종료 코드는 2로 맞았지만 **이유가 달랐다**).
  const { spawn } = await import('node:child_process');
  // ★`html`이 문자열이면 어떤 경로든 같은 페이지를 준다(로그인도 200으로 통과시킨다).
  // 함수면 **경로별로 다른 페이지**를 준다 — 어떤 대조군은 그것이 있어야 성립한다.
  // ζ(표본)가 그렇다: 스텁이 모든 URL에 같은 HTML을 주면 비SVG 종이 **표본 없이도**
  // 다른 페이지에서 관측돼 버려, ζ를 지워도 대조군이 안 깨진다(실측).
  const server = createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(typeof html === 'function' ? html(req.url ?? '/') : html);
  });
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  const port = server.address().port;
  const root = mkdtempSync(path.join(process.env.TMPDIR ?? '/tmp', 'dgm-render-'));
  try {
    // ★`tree`가 있으면 **가짜 도해 트리**를 심고, 없으면 실제 저장소를 심링크로 잇는다.
    //
    // **왜 가짜인가.** 실제 트리를 잇는 자식은 저장소 상태를 **공유**한다. 그래서
    // (a) 정적 판정의 **배선**을 무력화해도 자식은 그냥 지나가고(무대조군)
    // (b) 저장소의 정적 범위가 깨지면 자식이 그 메시지로 죽어 **노린 사유와 어긋난다.**
    // 트리를 소유하면 상태를 마음대로 만들 수 있어 γ·ε·α₀·σ·β를 **직접 유발**한다.
    //
    // **왜 하나는 실제로 남기나.** 전부 가짜면 *"유도 규칙이 **실제** 컴포넌트에서 도는가"* 를
    // 아무도 안 본다 — 이 사이클이 고치는 병과 같은 모양이다. ⑳이 그 갈래다(Design D-4).
    mkdirSync(path.join(root, 'src'), { recursive: true });
    // `node_modules`만은 언제나 빌린다 — 검사 대상이 아니라 **실행 수단**(playwright-core)이다.
    symlinkSync(path.resolve('node_modules'), path.join(root, 'node_modules'));
    if (tree) {
      const dir = path.join(root, 'src', 'components', 'diagram');
      mkdirSync(dir, { recursive: true });
      mkdirSync(path.join(root, 'src', 'data'), { recursive: true });
      // 슬러그 맵일 뿐이라 가짜로 족하다. 비면 스키마 가드가 `exit 2`를 내므로 한 줄은 있어야 한다.
      writeFileSync(path.join(root, 'src', 'data', 'chapters.json'),
        JSON.stringify({ chapters: [{ id: '01-probe', slug: 'probe', order: 1 }] }));
      for (const [f, body] of Object.entries(tree.components)) writeFileSync(path.join(dir, f), body);
      writeFileSync(path.join(dir, 'index.ts'), tree.barrel);
    } else {
      for (const parts of [['src', 'components'], ['src', 'data']]) {
        symlinkSync(path.resolve(...parts), path.join(root, ...parts));
      }
    }
    for (const [rel, body] of Object.entries(mdx)) {
      const f = path.join(root, 'src', 'content', rel);
      mkdirSync(path.dirname(f), { recursive: true });
      writeFileSync(f, body);
    }
    const child = spawn(process.execPath, [path.resolve(process.argv[1])], {
      cwd: root,
      env: { ...process.env, DGM_RENDER_CHILD: '1', RENDER_BASE: `http://127.0.0.1:${port}`, SITE_AUTH_ID: 'x', SITE_AUTH_PASSWORD: 'x' },
    });
    let out = '';
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { out += d; });
    // ★제한 시간을 준다. `close`만 기다리면 자식이 안 끝날 때 **무기한** 매달리고,
    // 이 대조군은 **본 검사 앞**에서 도니까 관문이 실패도 못 알린 채 멈춘다.
    const LIMIT_MS = 180_000;
    let timedOut = false;
    const status = await new Promise((ok) => {
      const timer = setTimeout(() => { timedOut = true; child.kill('SIGKILL'); }, LIMIT_MS);
      child.on('close', (code) => { clearTimeout(timer); ok(code); });
    });
    // ★`wantReason`은 배열도 받는다 — 한 자식에 여러 판정을 겹쳐 실을 때 **전부** 요구하고,
    // 실패하면 **어느 사유가 빠졌는지** 이름으로 말한다. 하나만 맞아도 통과하면 공허하다.
    const reasons = Array.isArray(wantReason) ? wantReason : [wantReason];
    const missing = reasons.filter((re) => !re.test(out));
    // ★`denyReason` — **과잉 발화**를 잡는다. `wantReason`만 보면 대조군이 *"적어도 이것"*
    // 만 요구해 판정이 **더 시끄러워지는** 훼손을 통과시킨다. 판정 fixture는 `offTarget()`으로,
    // 순수 함수 대조군은 `got.length === want`로 이미 양쪽을 보는데 **처분 쪽에만 없었다.**
    const extra = denyReason.filter((re) => re.test(out));
    const pass = !timedOut && status === wantStatus && missing.length === 0 && extra.length === 0;
    console.log(`   ${pass ? '✅ 통과' : '❌ 실패'}  ${name}`);
    if (!pass) {
      if (timedOut) console.log(`      자식이 ${LIMIT_MS / 1000}초 안에 안 끝나 강제 종료했다 — 처분을 확인하지 못했다.`);
      else {
        console.log(`      종료 ${status} (기대 ${wantStatus})`
          + `${missing.length ? ` · 빠진 사유 ${missing.length}/${reasons.length}: ${missing.join(' ')}` : ''}`
          + `${extra.length ? ` · ★있으면 안 되는 사유: ${extra.join(' ')}` : ''}`);
        // ★저장소의 **정적** 범위가 깨져서 자식이 죽은 경우를 구분한다(Design D-5).
        // 실제 트리를 쓰는 대조군은 저장소가 망가지면 노린 사유에 못 닿는다 — 관문은
        // 여전히 실패지만(통과시키지 않는다) **진단이 이 대조군을 가리키면 안 된다.**
        // ★저장소가 **실제로** 깨졌을 때만 면책한다. 자식 출력만 보면 호출부를 훼손해도
        // 같은 문구가 나와 **거짓 면책**이 뜬다(gap-detector ⑤).
        if (!tree && repoBroken) {
          console.log('      ※ 저장소의 정적 범위 위반 때문이다 — 이 대조군의 잘못이 아니다. 위 범위 지적을 먼저 고쳐라.');
        }
        console.log(`      ${(out.match(/❌ [^\n]*/)?.[0] ?? out.slice(-90)).slice(0, 110)}`);
      }
    }
    return pass;
  } finally {
    rmSync(root, { recursive: true, force: true });
    server.close();
  }
}

/** 대조군 스텁 페이지 — 글자 있는 SVG를 종마다 하나씩 그린다. */
function stubFigures(kinds, extra = '') {
  const one = (k) => `<figure data-diagram="${k}"><svg viewBox="0 0 120 40" width="120" height="40">`
    + `<text x="6" y="24" font-size="14" fill="#111">${k}</text></svg></figure>`;
  // ★배경을 **반드시** 준다. 없으면 `getComputedStyle(body).backgroundColor`가
  // `rgba(0,0,0,0)`이라 `pageBg`가 **투명 검정**이 되고, `#111` 글자가 대비 1.1로 잡힌다.
  // 판정 fixture의 `wrap()`은 이미 `background:#fff`를 주고 있었다 — **한 곳에서 피한
  // 함정이 다른 곳에서 되살아났다.** 지금까지는 자식이 앞선 `exit 2`로 죽어 **가려져** 있었다
  // (시제품의 음성 케이스가 `exit 1 · {"대비":2}`로 죽어 드러났다).
  return `<!doctype html><html><body style="background:#fff;margin:0">${kinds.map(one).join('')}${extra}</body></html>`;
}


/** ★처분 대조군 3종 — 감지가 아니라 **종료 코드**를 본다. 전부 임시 cwd 자식이다. */
/**
 * ★**실제 트리의 정적 범위**를 자체검사 안에서 한 번 잰다.
 *
 * 실제 트리를 쓰는 자식(⑳)은 저장소의 정적 범위가 깨지면 노린 사유에 못 닿는다.
 * 그때 *"이 대조군의 잘못이 아니다"* 를 붙이는데, 예전에는 **자식 출력에 그 문구가 있는지**
 * 로 판단했다 — 호출부를 훼손해도 같은 문구가 나오므로 **거짓 면책**이 떴다
 * (gap-detector ⑤ 실측: 배선 감사 도는 내내 저장소는 멀쩡한데 그 문구가 붙었다).
 *
 * 지금은 **저장소를 직접 본다.** 파일시스템과 MDX만 읽으므로 브라우저도 서버도 필요 없다.
 */
function realTreeScopeViolations() {
  try {
    const { pagesByKind, skipped } = collectUrls();
    return scopeStatic({ svg: SVG_COMPONENTS, dir: ALL_COMPONENTS, barrel: BARREL_COMPONENTS, pagesByKind, skipped });
  } catch {
    return ['(저장소 정적 범위를 재지 못했다)'];
  }
}

async function selfTestDispositions() {
  console.log('★ 처분 대조군 (자식 프로세스 · 임시 cwd)');
  const repoScope = realTreeScopeViolations();
  if (repoScope.length) {
    console.log(`   ⚠ 저장소의 정적 범위가 ${repoScope.length}건 깨져 있다 — 실제 트리를 쓰는 대조군이 그 때문에 실패할 수 있다.`);
    for (const l of repoScope.slice(0, 3)) console.log(`     ${l}`);
  }
  // ★fixture MDX도 **손으로 적지 않는다.** 유도가 SVG로 보는 종을 전부 써야 α₀
  // ("어느 MDX도 쓰지 않는다")가 조용하다 — 안 그러면 자식이 브라우저를 띄우기도 전에
  // α₀로 죽어 **모든 처분 대조군이 같은 이유로 실패**한다(실측).
  // MDX는 정규식으로만 훑기 때문에 `<Name />` 한 줄이면 족하다.
  const MDX_LS = { 'sources/probe/a.mdx': `본문.\n\n${SVG_COMPONENTS.map((c) => `<${c} />`).join('\n')}\n` };
  // ★손으로 적지 않는다 — 7번째 SVG 종이 생기면 자식에서 α가 먼저 울어 **사유가 어긋나고**
  // 출력이 원인을 오도한다(Check 지적). 유도 결과를 그대로 쓴다.
  const SVG6 = SVG_COMPONENTS;
  // ★가드는 **자식이 하나라도 돌기 전에** 둔다. 뒤에 두면 ⑲가 먼저 돌아 실패하고,
  // 진짜 원인(SVG 종이 둘 미만)은 한참 뒤에야 나온다 — 조건이 못 갖춰졌으면
  // 대조군을 돌리기 전에 말한다. 이 파일의 다른 가드와 같은 자리다.
  if (SVG6.length < 2) fail(`SVG 도해 종이 ${SVG6.length}개다 — ⑳이 기대할 α 대상을 고를 수 없다(둘 이상 필요).`);

  // ★가짜 도해 트리 — 자식이 **소유**한다. `Alpha`가 유일한 SVG 종이고 `Extra`는 비SVG다.
  // 파일 내용은 정규식으로만 훑기 때문에 컴파일되지 않는다 — `<svg` 포함 여부만 뜻이 있다.
  const SVGC = 'export function X() { return <svg viewBox="0 0 1 1" />; }\n';
  const HTMLC = 'export function X() { return <div />; }\n';
  /** 정상 트리 — 유도 1종(Alpha) · 배럴 1종 · MDX 하나가 그것을 쓴다. */
  const CLEAN = {
    components: { 'Alpha.tsx': SVGC },
    barrel: "export { Alpha } from './Alpha';\n",
  };
  const CLEAN_MDX = { 'sources/probe/a.mdx': '본문.\n\n<Alpha />\n' };
  let ok = true;

  // ⑲ 글자 있는 SVG를 하나도 못 보면 exit 2 (선행 ⑫ — 기계만 바뀌었다)
  ok = await spawnChildAgainst({
    name: '⑲ 도해를 하나도 못 보면 exit 2 (처분)',
    html: '<!doctype html><html><body style="background:#fff">도해가 없다</body></html>',
    tree: CLEAN, mdx: CLEAN_MDX, wantReason: /하나도 보지 못했다/,
  }) && ok;

  // ⑳ 범위 하한 위반이면 exit 2 — 이 사이클이 만든 처분(A-2)
  //
  // ★★이 대조군만 **실제 트리**를 쓴다(Design D-4). 전부 가짜로 바꾸면 *"유도 규칙이
  // **실제** 컴포넌트에서 도는가"* 를 아무도 안 본다 — 이 사이클이 고치는 병과 같은 모양이다.
  // 대신 저장소의 정적 범위가 깨지면 이 대조군이 노린 사유에 못 닿는다(B-5). 그때
  // `spawnChildAgainst`가 *"이 대조군의 잘못이 아니다"* 를 덧붙인다(D-5).
  //
  // ★사유에 종 이름을 **박지 않는다.** 초판은 `/α LayerStack/`이었는데, 유도에서 그 종이
  // 빠지는 조작(G-5)을 하면 α가 다른 종으로 울어 **사유 불일치**로 실패했다 — 관문은
  // 빨개지지만 진단이 엉뚱해진다. C-6과 같은 수동 미러다. 유도 결과에서 고른다:
  // 첫째 종만 그리고, **둘째 종**이 α로 울 것을 기대한다.
  const [drawn, expectAlpha] = [SVG6[0], SVG6[1]];
  ok = await spawnChildAgainst({
    name: `⑳ 범위 하한 위반이면 exit 2 (A-2 처분 · α ${expectAlpha})`,
    repoBroken: repoScope.length > 0,
    html: stubFigures([drawn]),
    mdx: MDX_LS,
    wantReason: new RegExp(`검사 범위가 주장한 만큼이 아니다[\\s\\S]*α ${expectAlpha}`),
  }) && ok;

  // ㉒ ★δ **배선**이 살아 있는가 — Check가 찾은 구멍이다.
  // ⑱은 `scopeViolations()`를 **직접** 불러 δ를 증명하지만, 본 검사가 그 함수에 무엇을
  // 넘기는지는 한 줄도 실행하지 않는다. 실측: `pagesByKind`를 빈 Map으로, `observedSvg`를
  // 빈 Set으로 바꿔도 자체검사가 **통과**했다(종료 0). 선행 A-1과 같은 모양이다 —
  // *감지는 증명하고 배선은 증명 안 한다.*
  //
  // 시나리오는 **F-1의 실물**이다: 유도가 비SVG로 분류한 종(`FlowSteps`)이 실제로는
  // 글자 있는 SVG를 그린다. 그 종만 쓰는 MDX는 `urls`에 없으므로 δ가 울어야 한다.
  ok = await spawnChildAgainst({
    name: '㉒ 판정 대상인데 검사 목록에 없는 페이지가 있으면 exit 2 (δ 배선)',
    html: stubFigures(['Alpha', 'Extra']),
    // ★페이지를 **둘** 준다. ζ 표본이 하나를 가져가므로 하나만 주면 δ가 울 대상이 없어진다
    // — 실제로 ζ를 넣자 이 대조군이 깨졌다. **표본은 관측을 만들고 판정은 δ가 한다**는
    // 설계가 대조군에도 그대로 적용된다.
    tree: { components: { 'Alpha.tsx': SVGC, 'Extra.tsx': HTMLC },
             barrel: "export { Alpha } from './Alpha';\nexport { Extra } from './Extra';\n" },
    mdx: {
      ...CLEAN_MDX,                                     // urls에 들어간다(Alpha는 유도에 있다)
      'sources/probe/b.mdx': '본문.\n\n<Extra />\n',   // ζ 표본이 가져간다
      'sources/probe/c.mdx': '본문.\n\n<Extra />\n',   // 이것이 검사 목록 밖 → δ
    },
    wantReason: /δ Extra —[\s\S]*검사 목록에 없다/,
  }) && ok;

  // ㉔ ★정적 4종을 **한 자식에 겹쳐** 싣는다 — γ·ε·α₀·σ.
  //
  // **왜 겹치나.** 배선 감사는 인자를 **하나씩** 훼손한다. 네 사유를 **모두** 요구하면
  // `svg`(α₀ 사라짐)·`dir`/`barrel`(γ·ε 둘 다 상쇄)·`skipped`(σ 사라짐) 어느 것을
  // 건드려도 이 대조군 하나가 깨진다 — **자식 하나로 네 자리를 덮는다**(Design 0.1).
  //
  // 가짜 트리라 상태를 마음대로 만든다:
  //   Ghost   배럴에만 있고 파일이 없다        → γ
  //   Extra   파일만 있고 배럴에 없다          → ε
  //   Lonely  SVG인데 어느 MDX도 안 쓴다       → α₀
  //   topics/ URL 규칙 밖 경로에 도해가 있다    → σ
  // `sources/probe/a.mdx`가 정상 URL 하나를 만든다 — 없으면 `!urls.length` 가드가
  // 먼저 울어 σ 목록을 못 본다(시제품 P-1에서 겪었다).
  ok = await spawnChildAgainst({
    name: '㉔ 정적 범위 위반 4종을 브라우저 앞에서 잡는다 (γ·ε·α₀·σ 배선)',
    html: stubFigures(['Alpha']),
    tree: {
      components: { 'Alpha.tsx': SVGC, 'Extra.tsx': HTMLC, 'Lonely.tsx': SVGC },
      barrel: "export { Alpha } from './Alpha';\nexport { Ghost } from './Ghost';\nexport { Lonely } from './Lonely';\n",
    },
    mdx: { ...CLEAN_MDX, 'topics/x.mdx': '본문.\n\n<Alpha />\n' },
    wantReason: [
      /브라우저를 띄우기 전에 안다/,
      /γ Ghost —/,
      /ε Extra —/,
      /α₀ Lonely —/,
      /σ topics\/x —/,
    ],
    // ★`Alpha`는 두 MDX가 쓰므로 α₀가 **뜨면 안 된다.** 이것이 없으면 `pagesByKind`를
    // 비우는 훼손에서 α₀가 Alpha에도 뜨는데 위 다섯이 전부 맞아 **㉔이 통과한다**
    // (gap-detector ③ 실측). *"적어도 이 넷"* 이 아니라 *"정확히 이 넷"* 이어야 한다.
    denyReason: [/α₀ Alpha —/],
  }) && ok;

  // ㉕ ★β **배선**(선행 B-1) — 그려졌는데 그런 컴포넌트 파일이 없다.
  //
  // ⑯은 `scopeViolations()`를 **직접** 불러 β를 증명하지만, 본 검사가 그 함수에 `dir`을
  // 무엇으로 넘기는지는 한 줄도 실행하지 않았다. 실측: `dir: BARREL_COMPONENTS`로
  // 바꿔치기해도 자체검사가 **종료 0**이었다(감사 6/11 시점).
  //
  // 정적으로 깨끗한 가짜 트리에 스텁이 **없는 종**(`Nope`)을 그린다 → β가 울어야 한다.
  //
  // ★`dir`을 `barrel`로 바꿔치기하는 훼손은 **관측할 수 없다.** `scopeStatic`의 γ·ε가
  // `dir ≡ barrel`을 이미 보장하므로, 그 검사를 통과한 실행에서 둘은 같은 값이다.
  // **덮을 것이 없는 자리다.** 관측 가능한 훼손은 `dir: []` 같은 것이고, 그때는 β가
  // **과잉 발화**한다 — 그것은 이 대조군이 아니라 **음성 자식 ㉖**이 잡는다.
  ok = await spawnChildAgainst({
    name: '㉕ 그려졌는데 그런 컴포넌트가 없으면 exit 2 (β 배선 · 선행 B-1)',
    html: stubFigures(['Alpha', 'Nope']),
    tree: CLEAN, mdx: CLEAN_MDX,
    wantReason: [/검사 범위가 주장한 만큼이 아니다/, /β Nope —/],
  }) && ok;

  // ㉖ ★**음성 자식** — 정상 가짜 트리는 `exit 0`으로 끝난다.
  //
  // 처분 대조군이 전부 `exit 2`를 기대하면 **과잉 발화가 안 보인다.** 판정을 과하게
  // 켜는 훼손(예: `dir: []` → β가 관측된 종 전부에 대해 운다)은 다른 대조군을 통과시키고
  // 지나간다. *"잡는다"* 만 보고 *"안 잡을 것은 안 잡는다"* 를 안 보면 문턱이 고정되지
  // 않는다 — 선행 사이클이 대비·글자 크기에서 배운 것과 같다(양쪽에서 보기).
  ok = await spawnChildAgainst({
    name: '㉖ 음성 — 정상 트리는 exit 0 (과잉 발화를 잡는다)',
    html: stubFigures(['Alpha']),
    tree: CLEAN, mdx: CLEAN_MDX,
    wantStatus: 0,
    wantReason: [/전 항목 통과/],
  }) && ok;

  // ㉗ ★도해 MDX가 **전부** URL 규칙 밖이면 σ가 **이름을 대며** 운다.
  //
  // `scopeStatic`을 `!urls.length` 가드보다 **앞**에 둔 이유가 이것이다(Design P-1).
  // 뒤에 있으면 *"SVG 도해를 가진 페이지를 찾지 못했다 — 경로 규약이 바뀌었다"* 로
  // 뭉뚱그린다. 종료 코드는 둘 다 2지만 **진단이 다르다** — 앞엣것은 어느 파일인지 말한다.
  //
  // ㉔에는 정상 URL이 하나 있어(`sources/probe/a.mdx`) 이 순서가 관측되지 않았다.
  // 정상 URL을 **하나도** 두지 않아야 드러난다(FR-8 되돌림에서 알았다).
  ok = await spawnChildAgainst({
    name: '㉗ 도해가 전부 URL 규칙 밖이면 σ가 파일 이름을 댄다 (판정 순서)',
    html: stubFigures(['Alpha']),
    tree: CLEAN,
    mdx: { 'topics/x.mdx': '본문.\n\n<Alpha />\n' },   // 정상 URL이 없다
    wantReason: [/σ topics\/x —/],
  }) && ok;

  // ㉓ ★ζ(표본) — 비SVG로 분류된 종의 페이지가 **하나도** 검사되지 않으면 그 종이 글자 있는
  // SVG를 그리는지 **알 수 없다.** 표본이 관측을 만들고, 판정은 δ가 한다.
  //
  // ★스텁이 경로별로 달라야 성립한다. 모든 URL에 같은 HTML을 주면 `FlowSteps`가 표본 없이도
  // `a` 페이지에서 관측돼 δ가 울고, **ζ를 지워도 대조군이 안 깨진다**(실측으로 확인했다).
  ok = await spawnChildAgainst({
    name: '㉓ 비SVG 종의 페이지를 표본으로 검사한다 (ζ) — 없으면 그 종을 영영 못 본다',
    html: (u) => (u.includes('/probe-f/') ? stubFigures(['Extra']) : stubFigures(['Alpha'])),
    tree: { components: { 'Alpha.tsx': SVGC, 'Extra.tsx': HTMLC },
             barrel: "export { Alpha } from './Alpha';\nexport { Extra } from './Extra';\n" },
    mdx: {
      ...CLEAN_MDX,
      // Extra만 쓰는 페이지 둘. ζ가 하나를 표본으로 넣어 관측을 만들고, δ가 나머지를 짚는다.
      'sources/probe-f/x.mdx': '본문.\n\n<Extra />\n',
      'sources/probe-f/y.mdx': '본문.\n\n<Extra />\n',
    },
    wantReason: /δ Extra —[\s\S]*검사 목록에 없다/,
  }) && ok;

  // ㉑ 판정 불가 구조면 exit 2 — 선행 사이클이 남긴 E-5
  ok = await spawnChildAgainst({
    name: '㉑ 판정할 수 없는 구조면 exit 2 (E-5 처분)',
    // 범위는 온전하게 두고(6종 전부 그린다) `<use>`만 얹는다 — 범위 위반이 먼저 울면
    // 이 대조군이 **다른 이유로** 통과하게 된다.
    html: stubFigures(['Alpha'],
      '<figure data-diagram="Alpha"><svg viewBox="0 0 120 40" width="120" height="40">'
      + '<defs><text id="u" x="6" y="24" font-size="14" fill="#111">숨은 라벨</text></defs>'
      + '<use href="#u"/><text x="6" y="38" font-size="12" fill="#111">보이는</text></svg></figure>'),
    tree: CLEAN, mdx: CLEAN_MDX, wantReason: /판정할 수 없는 구조/,
  }) && ok;

  return ok;
}

/**
 * ★범위 하한 대조군 — `scopeViolations()`가 순수 함수라 **브라우저도 서버도 없이** 돈다.
 *
 * 판정이 본 검사 루프 뒤에 인라인으로 있었다면 `--self-test`가 한 줄도 실행하지 못했을 것이다.
 * 그 모양이 선행 사이클의 A-1(⑨가 카운터만 보고 처분을 안 봤다)이었다.
 */
function selfTestScope() {
  const base = {
    svg: ['LayerStack', 'NodeGraph'],
    dir: ['LayerStack', 'NodeGraph', 'FlowSteps'],
    observed: ['LayerStack', 'NodeGraph', 'FlowSteps'],
    observedSvg: ['LayerStack', 'NodeGraph'],
    pagesByKind: new Map([['LayerStack', new Set(['/a/'])], ['NodeGraph', new Set(['/b/'])], ['FlowSteps', new Set(['/c/'])]]),
    urls: ['/a/', '/b/'],
  };
  const cases = [
    { name: '⑭ 음성 — 정상 범위에 위반을 내지 않는다', v: base, want: 0 },
    { name: '⑮ α — MDX가 쓰는데 안 그려졌다 (심각한 쪽)',
      v: { ...base, observed: ['NodeGraph', 'FlowSteps'], observedSvg: ['NodeGraph'] },
      want: 1, why: /^α LayerStack — MDX 1곳이 쓰는데/ },
    { name: '⑮b α — 아무 MDX도 안 쓴다 (흔한 쪽) — 같은 판정, 다른 문장',
      v: { ...base, observed: ['NodeGraph', 'FlowSteps'], observedSvg: ['NodeGraph'],
           pagesByKind: new Map([...base.pagesByKind, ['LayerStack', new Set()]]) },
      want: 1, why: /^α LayerStack — .*어느 MDX도 쓰지 않는다/ },
    { name: '⑯ β — 그려졌는데 그런 컴포넌트 파일이 없다 (kind 오타)',
      v: { ...base, observed: [...base.observed, 'LayerStac'] }, want: 1, why: /^β LayerStac /},
    { name: '⑱ δ — 이 종의 페이지가 검사 목록에서 빠졌다 (α는 조용한 경우)',
      // ★LayerStack은 여전히 관측된다(다른 이유로 방문한 페이지에 함께 있다) — α가 안 운다.
      // 그런데 이 종을 쓰는 페이지 하나가 목록에 없다. 실물 사고와 같은 모양이다.
      v: { ...base, pagesByKind: new Map([...base.pagesByKind, ['LayerStack', new Set(['/a/', '/lost/'])]]) },
      want: 1, why: /^δ LayerStack/ },
  ];
  // ★정적 판정(브라우저 앞에서 돈다)도 같은 자리에서 본다.
  const sbase = {
    svg: ['LayerStack', 'NodeGraph'],
    dir: ['LayerStack', 'NodeGraph', 'FlowSteps'],
    barrel: ['LayerStack', 'NodeGraph', 'FlowSteps'],
    pagesByKind: new Map([['LayerStack', new Set(['/a/'])], ['NodeGraph', new Set(['/b/'])], ['FlowSteps', new Set(['/c/'])]]),
    skipped: [],
  };
  const scases = [
    { name: '⑰ 음성 — 정상 정적 범위에 위반을 내지 않는다', v: sbase, want: 0 },
    { name: '⑰b γ — 배럴은 아는데 파일이 없다 (디렉터리 밖으로)',
      v: { ...sbase, dir: ['NodeGraph', 'FlowSteps'], svg: ['NodeGraph'] }, want: 1, why: /^γ LayerStack/ },
    { name: '⑰c ε — 파일은 있는데 배럴이 안 내보낸다 (배럴 정규식이 놓친 경우도 여기다)',
      v: { ...sbase, barrel: ['NodeGraph', 'FlowSteps'] }, want: 1, why: /^ε LayerStack/ },
    { name: '⑰d α₀ — 유도는 SVG로 보는데 어느 MDX도 안 쓴다',
      v: { ...sbase, pagesByKind: new Map([...sbase.pagesByKind, ['LayerStack', new Set()]]) }, want: 1, why: /^α₀ LayerStack/ },
    { name: '⑰e σ — 도해가 있는 MDX인데 URL 규칙이 없다 (F-2의 형제)',
      v: { ...sbase, skipped: ['topics/foo'] }, want: 1, why: /^σ topics\/foo/ },
  ];

  let ok = true;
  console.log('★ 범위 하한 대조군 (순수 함수 · 브라우저 없음)');
  for (const c of scases) {
    const got = scopeStatic(c.v);
    const pass = got.length === c.want && (!c.why || c.why.test(got[0] ?? ''));
    console.log(`   ${pass ? '✅ 통과' : '❌ 실패'}  ${c.name}`);
    if (!pass) { ok = false; console.log(`      ${got.length}건 ${JSON.stringify(got).slice(0, 130)}`); }
  }
  for (const c of cases) {
    const got = scopeViolations(c.v);
    const pass = got.length === c.want && (!c.why || c.why.test(got[0] ?? ''));
    console.log(`   ${pass ? '✅ 통과' : '❌ 실패'}  ${c.name}`);
    if (!pass) { ok = false; console.log(`      ${got.length}건 ${JSON.stringify(got).slice(0, 130)}`); }
  }
  return ok;
}

async function runSelfTest(chromium) {
  // ★fixture를 **Chrome 기동 전에** 만든다. `selfTestFixtures()` 안의 `tok()`은 실패 시
  // `fail()` → `process.exit(2)`이고, exit은 `finally`를 실행하지 않는다 — try 안에서
  // 부르면 브라우저가 안 닫혀 **좀비 Chrome이 쌓인다.** 이 스크립트는 같은 함정을
  // `figures === 0` 자리에서 이미 피해 놨다(거기 주석 참고).
  const fixtures = selfTestFixtures();

  const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => null);
  if (!browser) fail('Chrome을 찾지 못했다 — 자체검사에도 브라우저가 필요하다.');
  // 본 검사와 같은 색 구성을 쓴다 — 기본값에 기대지 않는다(본 검사는 colorScheme을 명시한다).
  const ctx = await browser.newContext({ viewport: { width: 800, height: 600 }, colorScheme: 'light' });
  const page = await ctx.newPage();
  console.log('★ 렌더 판정 대조군 (setContent · 서버 없음)');
  let ok = true;
  try {
    for (const c of fixtures) {
      // ★대조군 하나가 **예외로** 죽어도 그것은 "통과"가 아니라 **실패**다.
      // 안 잡으면 예외가 여기서 밖으로 나가 호출자에 catch가 없으니 unhandled rejection이
      // 되고, Node는 **1**로 끝난다 — 종료 코드 계약상 1은 *콘텐츠 위반*이다.
      // 자체검사가 터진 것은 **검사기가 자기 범위를 주장할 수 없다**는 뜻이라 2여야 한다.
      // 실제로 겪었다: 되돌림이 `cap` 선언 앞에 코드를 넣어 TDZ가 나자 `page.evaluate`가
      // 통째로 터졌고 **`❌ 실패` 줄이 하나도 안 나왔다.** 조용한 것이 가장 나쁘다.
      let o = null;
      let boom = null;
      try {
        await page.setContent(c.html);
        o = await page.evaluate(
          ([src, mf, mc]) => new Function(`${src}; return measureInPage(${mf}, ${mc});`)(),
          [measureInPage.toString(), MIN_FONT_PX, MIN_CONTRAST],
        );
      } catch (e) {
        boom = e;
      }
      const only = boom ? null : offTarget(c, o);
      const pass = !boom && c.ok(o) && only.length === 0;
      console.log(`   ${pass ? '✅ 통과' : '❌ 실패'}  ${c.name}`);
      if (!pass) {
        ok = false;
        if (boom) console.log(`      대조군이 예외로 죽었다 — ${String(boom?.message ?? boom).split('\n')[0].slice(0, 110)}`);
        else {
          if (only.length) console.log(`      ★비대상 판정이 함께 떴다: ${only.join(' · ')} (기대: ${c.only?.join(' · ') || '전부 0'})`);
          console.log(`      ${JSON.stringify({ small: o.small.length, lowContrast: o.lowContrast.map((x) => x.ratio), glyphHole: o.glyphHole.map((g) => g.sample), markers: o.markers, overflow: !!o.pageOverflow, figures: o.figures })}`);
        }
      }
    }
  } finally {
    await browser.close();
  }
  if (!selfTestScope()) ok = false;
  if (!await selfTestDispositions()) ok = false;
  return ok;
}

// ── main ──────────────────────────────────────────────────────────────────────

// playwright를 먼저 연다 — `--self-test`는 서버도 자격 증명도 필요 없으므로
// 그 두 검사보다 **앞**에서 끝난다.
let chromium;
try {
  ({ chromium } = await import('playwright-core'));
} catch {
  fail('playwright-core가 없다. `npm i -D playwright-core` 후 다시 실행하라.\n'
    + '     (브라우저 바이너리는 내려받지 않는다 — 설치된 Chrome을 쓴다.)');
}

// `--self-test` — 판정 대조군만 돌리고 끝낸다. **본 검사를 건너뛴다.**
// 서버·자격 증명 없이 도는 것이 요점이다: 검사기 자신이 건강한지는 앱과 무관하게 물을 수 있어야 한다.
if (process.argv.slice(2).includes('--self-test')) {
  const ok = await runSelfTest(chromium);
  console.log(ok
    ? '\n✅ 자체검사 전 항목 통과 — ※ **본 검사는 돌지 않았다.**'
    : '\n❌ 자체검사 실패 — 판정 함수가 오류를 놓친다.');
  process.exit(ok ? 0 : 2);
}

const id = process.env.SITE_AUTH_ID;
const pw = process.env.SITE_AUTH_PASSWORD;
if (!id || !pw) {
  fail('SITE_AUTH_ID · SITE_AUTH_PASSWORD가 없다. 셸에서 넘겨라:\n'
    + '     set -a; . ./.env.local; set +a; npm run verify:render');
}

// 서버를 띄우지 않는다 — 포트·빌드 상태·predev 재실행이라는 부작용을 검사기가 만들면 안 된다.
try {
  // 타임아웃을 준다 — Node의 fetch는 기본 응답 타임아웃이 없어서 서버가 연결만 받고
  // 응답하지 않으면 여기서 무한히 매달린다. 그러면 아래 안내가 아예 나오지 않는다.
  const probe = await fetch(`${BASE}/login/`, { redirect: 'manual', signal: AbortSignal.timeout(5000) });
  if (probe.status >= 500) throw new Error(String(probe.status));
} catch {
  fail(`${BASE} 에 연결할 수 없다. 먼저 \`npm run dev\`(또는 \`npm run start\`)를 띄워라.`);
}

// 본 검사 앞에서 자체검사를 먼저 돌린다 — `verify:diagram`과 같은 계약이다.
// 검사기가 눈먼 채로 "전 항목 통과"를 내지 않게.
// ★자식은 자체검사를 건너뛴다 — 부모가 이미 돌렸고, 안 건너뛰면 자식이 또 자식을 낳아
// **무한 재귀**가 된다(실측: 10분 타임아웃). 정적 관문이 `--assert-only`로 같은 함정을
// 끊은 것과 같은 이유다. 이 변수는 ⑫ 대조군이 자식에 넘길 때만 켜진다.
if (!process.env.DGM_RENDER_CHILD && !await runSelfTest(chromium)) {
  console.error('\n❌ 자체검사 실패 — 판정 함수가 오류를 놓친다. 본 검사를 실행하지 않는다.');
  process.exit(2);
}
console.log('');

const { urls, usedInMdx, pagesByKind, skipped } = collectUrls();
// ★정적으로 아는 범위 위반은 **브라우저를 띄우기 전에** 말한다.
const pre = scopeStatic({ svg: SVG_COMPONENTS, dir: ALL_COMPONENTS, barrel: BARREL_COMPONENTS, pagesByKind, skipped });
if (pre.length) {
  console.error(`\n❌ 검사 범위가 주장한 만큼이 아니다 ${pre.length}건 — 브라우저를 띄우기 전에 안다.`);
  console.error(`   유도 ${SVG_COMPONENTS.length}종 / 배럴 ${BARREL_COMPONENTS.length}종 / 디렉터리 ${ALL_COMPONENTS.length}종 / 페이지 ${urls.length}`);
  for (const l of pre) console.error(`  ${l}`);
  process.exit(2);
}
if (!urls.length) fail('SVG 도해를 가진 페이지를 찾지 못했다 — 경로 규약이 바뀌었다.');
console.log(`SVG 도해 보유 페이지 ${urls.length}개 × 뷰포트 ${VIEWPORTS.length} — 하한 ${MIN_FONT_PX}px · 대비 ${MIN_CONTRAST}\n`);


// channel: 'chrome' — 설치된 Chrome을 찾는다. 경로를 박으면 macOS 밖에서 못 돈다(G-9 스크립트의 결함).
const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => null);
if (!browser) fail('Chrome을 띄우지 못했다. Google Chrome이 설치돼 있는지 확인하라.');

const findings = [];
/** 판정 불가 구조. findings와 **따로** 센다 — 이건 위반(1)이 아니라 범위 상실(2)이다. */
const unsupported = [];
/** ★관측 — 검사 중 실제로 그려진 도해 종류. 범위 하한 대조의 한쪽이다. */
const observed = new Set();
/** 그중 SVG를 그린 종. δ의 대상이다. */
const observedSvg = new Set();
for (const [w, h, vpName] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: 'light' });
  const res = await ctx.request.post(`${BASE}/api/login/`, { data: { id, password: pw } });
  if (!res.ok()) { await browser.close(); fail(`로그인 실패 (HTTP ${res.status()})`); }
  const page = await ctx.newPage();
  let figures = 0;

  for (const [i, url] of urls.entries()) {
    let m;
    try {
      const r = await page.goto(BASE + url, { waitUntil: 'networkidle' });
      if (!r || r.status() >= 400) { findings.push({ url, vpName, kind: 'HTTP', detail: `HTTP ${r?.status()}` }); continue; }
      await page.evaluate(() => document.querySelector('nextjs-portal')?.remove());
      await page.addStyleTag({ content: 'html,body,*{scroll-behavior:auto !important}' });
      // 함수를 문자열로 넘겨 페이지 안에서 실행한다. 매 페이지마다 주입한다 — 이동하면 사라진다.
      m = await page.evaluate(
        ([fnSrc, mf, mc]) => new Function(`return (${fnSrc})`)()(mf, mc),
        [measureInPage.toString(), MIN_FONT_PX, MIN_CONTRAST],
      );
    } catch (e) {
      findings.push({ url, vpName, kind: '오류', detail: String(e.message).slice(0, 70) });
      continue;
    }
    figures += m.figures;
    if (m.pageOverflow) findings.push({ url, vpName, kind: '가로 넘침', detail: `${m.pageOverflow.sw}/${m.pageOverflow.cw}` });
    for (const s of m.small) findings.push({ url, vpName, kind: '글자 축소', detail: `${s.px}px «${s.sample}» — ${s.cap}` });
    for (const c of m.lowContrast) {
      const what = c.ratio === null ? '글자색 해석 실패' : String(c.ratio);
      findings.push({ url, vpName, kind: '대비', detail: `${what} «${c.sample}»${c.onShape ? ' (도형 위)' : ' (프레임 위)'} — ${c.cap}` });
    }
    for (const g of m.glyphHole) findings.push({ url, vpName, kind: '글리프 구멍', detail: `${g.why} «${g.sample}» — ${g.cap}` });
    for (const x of m.markers.missing) findings.push({ url, vpName, kind: '마커 미해결', detail: x });
    for (const x of m.markers.dup) findings.push({ url, vpName, kind: '마커 중복', detail: x });
    for (const u of m.unsupported ?? []) unsupported.push({ url, vpName, ...u });
    for (const k of m.kinds ?? []) observed.add(k);
    for (const k of m.kindsSvg ?? []) observedSvg.add(k);
    if ((i + 1) % 25 === 0) process.stderr.write(`  …${vpName} ${i + 1}/${urls.length}\n`);
  }
  console.log(`${vpName} ${w}px — 글자 있는 SVG ${figures}개 검사`);
  await ctx.close();
  // ★findings가 비어도 '통과'가 아니다 — 아무 도해도 못 봤는데 통과를 내는 경로가 있었다.
  // 미들웨어(src/middleware.ts)가 미인증 요청을 /login으로 **리다이렉트**하고 page.goto는
  // 그것을 따라가 최종 200을 주므로 status>=400 망에 걸리지 않는다. /login에는 figure svg가
  // 없어 findings가 0이 되고 exit 0이 나온다. 세션 쿠키가 실리지 않는 어떤 이유로든 재현된다.
  if (figures === 0) {
    // 로그인 실패 경로(위)와 같게 브라우저를 먼저 닫는다 — fail()은 process.exit(2)라
    // 닫지 않으면 Chrome 프로세스가 남고, 실패를 반복 확인하는 동안 쌓인다.
    await browser.close();
    fail(`${vpName}에서 글자 있는 SVG를 하나도 보지 못했다 — 로그인이 유지되지 않았거나 렌더가 바뀌었다. '통과'로 처리하지 않는다.`);
  }
}
await browser.close();

// ═══ 범위 하한 — α·β·γ·δ ════════════════════════════════════════════════════
const scope = scopeViolations({
  // ★`barrel`은 넘기지 않는다 — γ를 `scopeStatic`으로 옮길 때 남은 **죽은 인자**였다.
  // 배선 감사의 미러 대조가 찾았다(Check C-2): 호출부에는 있는데 훼손 목록에 없어
  // **한 자리가 조용히 세어지지 않고 있었다.** 11/11이 실은 11/12였다.
  svg: SVG_COMPONENTS, dir: ALL_COMPONENTS,
  observed, observedSvg, pagesByKind, urls,
});
// `usedInMdx`는 유도와 같은 목록에서 만든 정규식으로 채워져 **유도와 함께 틀린다.**
// 판정에 쓰지 않고 배너에만 쓴다 — 대조에 넣으면 공허한 검사가 된다.

if (scope.length) {
  // ★범위 판정보다 **먼저** 페이지 오류를 보여 준다. 얇은 종(보유 MDX 2개)의 페이지가
  // 일시적으로 실패하면 α가 울면서 진짜 원인인 [오류]·[HTTP]를 삼킨다 — 운영자가
  // "유도가 틀렸다"고 읽게 된다(Check 지적).
  const broken = findings.filter((f) => f.kind === '오류' || f.kind === 'HTTP');
  if (broken.length) {
    console.error(`\n⚠ 페이지를 못 읽은 것이 ${broken.length}건 있다 — 아래 범위 위반의 원인일 수 있다.`);
    for (const f of broken.slice(0, 5)) console.error(`  [${f.kind}] ${f.vpName} ${f.url} — ${f.detail}`);
  }
  console.error(`\n❌ 검사 범위가 주장한 만큼이 아니다 ${scope.length}건 — '통과'로 처리하지 않는다.`);
  console.error(`   유도 ${SVG_COMPONENTS.length}종 / 관측 ${observed.size}종 / MDX ${usedInMdx.size}종`);
  for (const l of scope) console.error(`  ${l}`);
  await browser.close().catch(() => {});
  process.exit(2);
}

console.log(`범위: 유도 ${SVG_COMPONENTS.length}종 / 관측 ${observed.size}종(SVG ${observedSvg.size}종) / 배럴 ${BARREL_COMPONENTS.length}종 / 페이지 ${urls.length}`);

// ★판정 불가를 **먼저** 본다. 위반 0건이어도 "전 항목 통과"라고 말하면 안 된다 —
// 재지 못한 것을 재고 문제없다고 말하는 것이라, D-14가 막은 것과 같은 거짓말이다.
//
// ⚠ **이 처분에는 대조군이 없다.** 대조군 ⑬은 `measureInPage`가 `<use>`를 **감지하는지**만
// 보고, 그 뒤 여기서 `2`가 나오는지는 `--self-test` 경로가 한 줄도 실행하지 않는다.
// **⑨와 정확히 같은 모양이다** — 그때도 카운터만 보다가 가드를 통째로 지워도 통과했고,
// ⑫(스텁 서버 + 자식 프로세스)를 만들어 막았다. 같은 처방이면 자식 실행이 하나 더 붙어
// 자체검사가 약 50초 → 약 95초가 된다. 값이 커서 **아직 안 했다**(백로그 E-5).
// *처분은 감지와 다른 주장이다* — 이 주석은 그 사실을 잊지 않으려고 남긴다.
if (unsupported.length) {
  console.error(`\n❌ 판정할 수 없는 구조 ${unsupported.length}건 — '통과'로 처리하지 않는다.`);
  for (const u of unsupported.slice(0, 10)) console.error(`  ${u.vpName} ${u.url}\n      ${u.why} (${u.ref})`);
  process.exit(2);
}
const byKind = findings.reduce((a, f) => ((a[f.kind] = (a[f.kind] ?? 0) + 1), a), {});
if (findings.length === 0) {
  console.log('\n✅ 전 항목 통과 — 가로 넘침 0 · 글자 축소 0 · 대비 미달 0 · 글리프 구멍 0 · 마커 정합');
  process.exit(0);
}
console.log(`\n❌ ${findings.length}건  ${JSON.stringify(byKind)}\n`);
for (const f of findings) console.log(`  [${f.kind}] ${f.vpName} ${f.url}\n      ${f.detail}`);
process.exit(1);
