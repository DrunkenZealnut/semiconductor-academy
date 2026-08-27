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
 * (자체검사 `--self-test`만은 서버·자격 증명 없이 약 0.3초에 돈다.)
 * 사이클 종료 시점과 도해를 새로 추가했을 때 돌린다.
 *
 * 자격 증명: process.env.SITE_AUTH_ID · SITE_AUTH_PASSWORD만 읽는다.
 * `.env.local`을 직접 파싱하지 않는다 — 파일을 읽으면 값이 스크립트를 지나 로그에 새기 쉽다.
 * 셸에서 넘긴다:  set -a; . ./.env.local; set +a; npm run verify:render
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
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

/** 도해를 가진 MDX를 URL로 옮긴다. chapters는 slug 매핑이 필요하다. */
function collectUrls() {
  const chapters = JSON.parse(readFileSync('src/data/chapters.json', 'utf8'));
  const slugByNum = new Map();
  for (const c of chapters.chapters ?? chapters) {
    if (c.slug && c.number != null) slugByNum.set(String(c.number).padStart(2, '0'), c.slug);
  }
  const re = new RegExp(`<(${SVG_COMPONENTS.join('|')})[\\s/>]`);
  const urls = new Set();
  const skipped = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (!e.name.endsWith('.mdx')) continue;
      if (!re.test(readFileSync(p, 'utf8'))) continue;
      const rel = p.replace(/^src\/content\//, '').replace(/\.mdx$/, '');
      if (rel.startsWith('chapters/')) {
        const slug = slugByNum.get(rel.slice(9, 11));
        if (slug) urls.add(`/chapter/${slug}/`);
        else skipped.push(rel);
      } else if (rel.startsWith('sources/')) {
        // `part-2.ko` 처럼 언어 미러는 별도 라우트가 아니다 — 본 라우트가 두 언어를 함께 렌더한다.
        urls.add(`/sources/${rel.slice(8).replace(/\.ko$/, '')}/`);
      } else if (rel.startsWith('processes/')) {
        urls.add(`/process/${rel.slice(10)}/`);
      } else {
        skipped.push(rel);
      }
    }
  };
  walk('src/content');
  // 범위를 조용히 줄이지 않는다 — 빠진 것이 있으면 말한다.
  if (skipped.length) console.log(`⚠ URL 규칙이 없어 건너뛴 ${skipped.length}개: ${skipped.slice(0, 5).join(', ')}`);
  return [...urls].sort();
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
    figures: 0,
  };
  const pageBg = parse(getComputedStyle(document.body).backgroundColor) ?? { r: 255, g: 255, b: 255, a: 1 };

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
      ok: (o) => o.small.length === 0 && o.lowContrast.length === 0 && o.glyphHole.length === 0
        && o.markers.missing.length === 0 && o.markers.dup.length === 0 && !o.pageOverflow && o.figures === 1 },

    { name: '② 가로 넘침을 잡는다',
      html: wrap(clean, '<div style="width:3000px;height:1px"></div>'),
      ok: (o) => !!o.pageOverflow },

    { name: '③ 글자 축소 — 하한 바로 아래를 잡는다 (8.8px)',
      // ★문턱 **바로 옆**이어야 문턱이 고정된다. 초판은 5px과 10px이라 하한을 6으로
      // 낮춰도 둘 다 유지됐다(Check A-7). viewBox 400 을 176px에 → ×0.44, 20px → 8.8px.
      html: wrap(`<svg viewBox="0 0 400 100" width="176" height="44">`
        + `<rect x="0" y="0" width="400" height="100" fill="${bg}"/>`
        + `<text x="10" y="50" font-size="20" fill="${ink}">작다</text></svg>`),
      ok: (o) => o.small.length === 1 && o.small[0].px < MIN_FONT_PX },

    { name: '③b 글자 축소 — 하한 바로 위는 잡지 않는다 (9.6px)',
      // ×0.48 — 20px 글자가 9.6px. ③(8.8)과 함께 9라는 선을 양쪽에서 조인다.
      html: wrap(`<svg viewBox="0 0 400 100" width="192" height="48">`
        + `<rect x="0" y="0" width="400" height="100" fill="${bg}"/>`
        + `<text x="10" y="50" font-size="20" fill="${ink}">넉넉하다</text></svg>`),
      ok: (o) => o.small.length === 0 },

    { name: '④ 대비 — AA 미달을 잡는다 (토큰 색)',
      html: wrap(`<svg viewBox="0 0 200 100" width="200" height="100">`
        + `<rect x="0" y="0" width="200" height="100" fill="${bg}"/>`
        + `<text x="8" y="52" font-size="14" fill="${near}">묻힌다</text></svg>`),
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
      ok: (o) => o.glyphHole.some((g) => /마스크가 없다/.test(g.why)) },

    { name: '⑥ 글리프 구멍 — 구멍이 글자를 안 덮으면 잡는다',
      html: wrap(`<svg viewBox="0 0 200 100" width="200" height="100"><defs>${patDefs('p6')}`
        + `<mask id="m6"><rect x="0" y="0" width="200" height="100" fill="white"/>`
        + `<rect x="180" y="90" width="4" height="4" fill="black"/></mask></defs>`
        + `<rect x="0" y="0" width="200" height="100" fill="${bg}"/>`
        + `<rect x="0" y="0" width="200" height="100" fill="url(#p6)" mask="url(#m6)"/>`
        + `<text x="8" y="52" font-size="14" fill="${ink}">패턴 위 글자</text></svg>`),
      ok: (o) => o.glyphHole.some((g) => /덮지 않는다/.test(g.why)) },

    { name: '⑦ 마커 미해결을 잡는다',
      html: wrap(`<svg viewBox="0 0 200 100" width="200" height="100">`
        + `<rect x="0" y="0" width="200" height="100" fill="${bg}"/>`
        + `<text x="8" y="52" font-size="14" fill="${ink}">가</text>`
        + `<path d="M 0 0 L 10 10" marker-end="url(#없는마커)"/></svg>`),
      ok: (o) => o.markers.missing.length > 0 },

    { name: '⑧ 마커 중복을 잡는다',
      html: wrap(`<svg viewBox="0 0 200 100" width="200" height="100"><defs>`
        + `<marker id="dup1" viewBox="0 0 8 8"><path d="M0 0 L8 4 L0 8z"/></marker>`
        + `<marker id="dup1" viewBox="0 0 8 8"><path d="M0 0 L8 4 L0 8z"/></marker></defs>`
        + `<rect x="0" y="0" width="200" height="100" fill="${bg}"/>`
        + `<text x="8" y="52" font-size="14" fill="${ink}">가</text></svg>`),
      ok: (o) => o.markers.dup.length > 0 },

    { name: '⑨ 글자 없는 도해는 figures로 세지 않는다',
      html: wrap(`<svg viewBox="0 0 200 100" width="200" height="100">`
        + `<rect x="0" y="0" width="200" height="100" fill="${bg}"/></svg>`),
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
 * A-1 — `figures === 0`의 **처분**을 확인한다 (Check 지적).
 *
 * 대조군 ⑨는 `measureInPage`의 **카운터**가 0이 되는 것까지만 본다. 그 뒤 본 검사 루프가
 * `exit 2`를 내는지는 **`--self-test` 경로가 한 줄도 실행하지 않는다** — 가드를 통째로
 * 지워도 11/11이 통과했다(실측). *"감지는 증명하고 처분은 증명 안 한다"* — 정적 관문이
 * 종료 코드 대조군을 만들며 배운 것과 같은 구분이다(usage §2.1.1f).
 *
 * 도해가 하나도 없는 응답만 주는 최소 서버를 세우고 자식으로 본 검사를 돌린다.
 */
async function selfTestFiguresDisposition() {
  const { createServer } = await import('node:http');
  // ★`spawnSync`를 쓰면 안 된다 — 부모의 이벤트 루프를 막아 아래 스텁 서버가 요청을
  // 받지 못하고, 자식이 "연결할 수 없다"로 죽는다(실측). 비동기 spawn으로 기다린다.
  const { spawn } = await import('node:child_process');
  const server = createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    // 어떤 경로든 도해 없는 페이지를 준다 — 로그인도 200으로 통과시킨다.
    res.end('<!doctype html><html><body><p>도해가 없다</p></body></html>');
  });
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  const port = server.address().port;
  try {
    const child = spawn(process.execPath, [path.resolve(process.argv[1])], {
      env: { ...process.env, DGM_RENDER_CHILD: '1', RENDER_BASE: `http://127.0.0.1:${port}`, SITE_AUTH_ID: 'x', SITE_AUTH_PASSWORD: 'x' },
    });
    let out = '';
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { out += d; });
    const status = await new Promise((ok) => child.on('close', ok));
    const r = { status };
    const pass = status === 2 && /하나도 보지 못했다/.test(out);
    console.log(`   ${pass ? '✅ 통과' : '❌ 실패'}  ⑫ 도해를 하나도 못 보면 exit 2 (처분)`);
    if (!pass) console.log(`      종료 ${r.status} (기대 2) · ${(out.match(/❌ [^\n]*|✅ [^\n]*/)?.[0] ?? '').slice(0, 90)}`);
    return pass;
  } finally {
    server.close();
  }
}

async function runSelfTest(chromium) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => null);
  if (!browser) fail('Chrome을 찾지 못했다 — 자체검사에도 브라우저가 필요하다.');
  const ctx = await browser.newContext({ viewport: [800, 600] && { width: 800, height: 600 } });
  const page = await ctx.newPage();
  console.log('★ 렌더 판정 대조군 (setContent · 서버 없음)');
  let ok = true;
  try {
    for (const c of selfTestFixtures()) {
      await page.setContent(c.html);
      const o = await page.evaluate(
        ([src, mf, mc]) => new Function(`${src}; return measureInPage(${mf}, ${mc});`)(),
        [measureInPage.toString(), MIN_FONT_PX, MIN_CONTRAST],
      );
      const pass = c.ok(o);
      console.log(`   ${pass ? '✅ 통과' : '❌ 실패'}  ${c.name}`);
      if (!pass) {
        ok = false;
        console.log(`      ${JSON.stringify({ small: o.small.length, lowContrast: o.lowContrast.map((x) => x.ratio), glyphHole: o.glyphHole.map((g) => g.sample), markers: o.markers, overflow: !!o.pageOverflow, figures: o.figures })}`);
      }
    }
  } finally {
    await browser.close();
  }
  if (!await selfTestFiguresDisposition()) ok = false;
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

const urls = collectUrls();
if (!urls.length) fail('SVG 도해를 가진 페이지를 찾지 못했다 — 경로 규약이 바뀌었다.');
console.log(`SVG 도해 보유 페이지 ${urls.length}개 × 뷰포트 ${VIEWPORTS.length} — 하한 ${MIN_FONT_PX}px · 대비 ${MIN_CONTRAST}\n`);

// channel: 'chrome' — 설치된 Chrome을 찾는다. 경로를 박으면 macOS 밖에서 못 돈다(G-9 스크립트의 결함).
const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => null);
if (!browser) fail('Chrome을 띄우지 못했다. Google Chrome이 설치돼 있는지 확인하라.');

const findings = [];
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

const byKind = findings.reduce((a, f) => ((a[f.kind] = (a[f.kind] ?? 0) + 1), a), {});
if (findings.length === 0) {
  console.log('\n✅ 전 항목 통과 — 가로 넘침 0 · 글자 축소 0 · 대비 미달 0 · 글리프 구멍 0 · 마커 정합');
  process.exit(0);
}
console.log(`\n❌ ${findings.length}건  ${JSON.stringify(byKind)}\n`);
for (const f of findings) console.log(`  [${f.kind}] ${f.vpName} ${f.url}\n      ${f.detail}`);
process.exit(1);
