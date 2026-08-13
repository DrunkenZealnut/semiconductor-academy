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
 * 상시 관문이 아니다 — 서버와 자격 증명이 필요하고 SVG 92페이지 × 2뷰포트가 약 3분이다.
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
    figures: 0,
  };
  const pageBg = parse(getComputedStyle(document.body).backgroundColor) ?? { r: 255, g: 255, b: 255, a: 1 };

  document.querySelectorAll('figure svg[viewBox]').forEach((svg) => {
    const vb = svg.viewBox.baseVal;
    const rw = svg.getBoundingClientRect().width;
    if (!vb.width || !rw) return;
    const k = rw / vb.width;
    const texts = [...svg.querySelectorAll('text')].filter((t) => t.textContent.trim());
    if (!texts.length) return;
    out.figures += 1;
    const cap = (svg.closest('figure')?.querySelector('figcaption')?.innerText ?? '').replace(/\s+/g, ' ').slice(0, 34);
    const frameBg = parse(getComputedStyle(svg.closest('figure')).backgroundColor);
    const base = frameBg && frameBg.a > 0 ? over(frameBg, pageBg) : pageBg;
    const rects = [...svg.querySelectorAll('rect, circle, ellipse')];

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
      for (const r of rects) {
        let box; try { box = r.getBBox(); } catch { continue; }
        if (cx < box.x || cx > box.x + box.width || cy < box.y || cy > box.y + box.height) continue;
        const area = box.width * box.height;
        if (!best || area < best.area) best = { el: r, area };
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

// ── main ──────────────────────────────────────────────────────────────────────
const id = process.env.SITE_AUTH_ID;
const pw = process.env.SITE_AUTH_PASSWORD;
if (!id || !pw) {
  fail('SITE_AUTH_ID · SITE_AUTH_PASSWORD가 없다. 셸에서 넘겨라:\n'
    + '     set -a; . ./.env.local; set +a; npm run verify:render');
}

let chromium;
try {
  ({ chromium } = await import('playwright-core'));
} catch {
  fail('playwright-core가 없다. `npm i -D playwright-core` 후 다시 실행하라.\n'
    + '     (브라우저 바이너리는 내려받지 않는다 — 설치된 Chrome을 쓴다.)');
}

// 서버를 띄우지 않는다 — 포트·빌드 상태·predev 재실행이라는 부작용을 검사기가 만들면 안 된다.
try {
  const probe = await fetch(`${BASE}/login/`, { redirect: 'manual' });
  if (probe.status >= 500) throw new Error(String(probe.status));
} catch {
  fail(`${BASE} 에 연결할 수 없다. 먼저 \`npm run dev\`(또는 \`npm run start\`)를 띄워라.`);
}

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
  if (figures === 0) fail(`${vpName}에서 글자 있는 SVG를 하나도 보지 못했다 — 로그인이 유지되지 않았거나 렌더가 바뀌었다. '통과'로 처리하지 않는다.`);
}
await browser.close();

const byKind = findings.reduce((a, f) => ((a[f.kind] = (a[f.kind] ?? 0) + 1), a), {});
if (findings.length === 0) {
  console.log('\n✅ 전 항목 통과 — 가로 넘침 0 · 글자 축소 0 · 대비 미달 0 · 마커 정합');
  process.exit(0);
}
console.log(`\n❌ ${findings.length}건  ${JSON.stringify(byKind)}\n`);
for (const f of findings) console.log(`  [${f.kind}] ${f.vpName} ${f.url}\n      ${f.detail}`);
process.exit(1);
