#!/usr/bin/env node
/**
 * 배치표(plan JSON)를 **Design 문서에서 생성**한다.
 *
 * 왜: 이 확대에서 손으로 옮긴 집계가 네 번 틀렸다.
 *   ① W1 보조 미이행 7건 누락(주 도해만 셈)
 *   ② W2 §2.6 계획 157 (실제 146)
 *   ③ W2 분포표가 대체 반영 전 값
 *   ④ Do 단계 표 추출 슬라이스가 표를 조용히 잘라 도해 5건이 항목 누락
 * 넷 다 **중간 산출물을 검산 없이 신뢰한 것**이 원인이다. 배치표를 손으로 쓰는 한
 * 같은 실패가 다섯 번째로 나온다. 그래서 Design의 §2 매핑 표를 유일 진실로 삼고
 * 배치표를 파생물로 만든다.
 *
 * 부수 효과: 컴포넌트마다 **subject**(무엇을 그리는가)가 함께 들어와,
 * `verify-diagram-placement.mjs`의 C-1이 타입뿐 아니라 **주제**까지 대조할 수 있다
 * (W2 Check의 G-4 0.5점 사유 해소).
 *
 * 사용법
 *   node scripts/build-diagram-plan.mjs w1   # → diagram-expansion.w1-plan.json
 *   node scripts/build-diagram-plan.mjs w2
 *   node scripts/build-diagram-plan.mjs w2 --check   # 기존 파일과 대조만(쓰지 않음)
 *
 * Design 표 형식 가정: `| \`module\` | 주 도해 | 근거 | 보조 |`
 *   주 셀   — "`Component` — subject" 또는 "**`Component`** subject"
 *   보조 셀 — "`Component` subject · `Component` subject" (⚠ 접두어는 조건부 → 제외)
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

/**
 * 전수 커버리지를 요구하지 않는 웨이브. W4는 이미 도판 425장이 있는 구간의 **선별** 보완이라
 * 도해가 0개인 모듈이 정상이다(w4-design §3.3). 검사기가 `_coverage`를 읽어 판정을 바꾼다.
 */
const SELECTIVE = new Set(['w4']);

const COMPONENTS = [
  'LayerStack', 'CompareCards', 'FlowSteps', 'NodeGraph', 'TruthTable', 'ValueBars',
  'TreeBranch', 'LatticeDiagram', 'CurvePlot', 'Timeline', 'ScaleRuler', 'LabeledFigure',
];

const DESIGN = {
  w1: 'docs/02-design/features/diagram-expansion.design.md',
  w2: 'docs/02-design/features/diagram-expansion.w2-design.md',
  w3: 'docs/02-design/features/diagram-expansion.w3-design.md',
  w4: 'docs/02-design/features/diagram-expansion.w4-design.md',
};
const OUT = {
  w1: 'docs/02-design/features/diagram-expansion.w1-plan.json',
  w2: 'docs/02-design/features/diagram-expansion.w2-plan.json',
  w3: 'docs/02-design/features/diagram-expansion.w3-plan.json',
  w4: 'docs/02-design/features/diagram-expansion.w4-plan.json',
};

/** 셀에서 컴포넌트와 subject를 뽑는다. ⚠(조건부)는 건너뛴다. */
function parseCell(cell, { primary }) {
  const out = [];
  // ` · ` 로 나뉜 항목들. 주 셀은 하나만 있다고 본다.
  const parts = primary ? [cell] : cell.split(' · ');
  for (const raw of parts) {
    let part = raw.trim();
    if (!part || part === '—') continue;
    if (part.startsWith('⚠')) continue; // 조건부는 배치표에 넣지 않는다
    // **괄호를 먼저 지운다.** Design 규약은 초안·탈락 근거를 괄호에 넣으므로
    // (`(초안 \`LabeledFigure\` — §4.1)`, `(\`FlowSteps\` 8단계 **탈락**)`) 괄호를 남기면
    // 탈락시킨 컴포넌트가 배정으로 되살아난다 — W4 배치 B에서 실제로 2건 되살아났다.
    // 반대로 '탈락'이라는 낱말만 보고 셀 전체를 버리면 **정당한 배정도 함께 죽는다**
    // (`02-semiconductor`가 그렇게 사라졌다). 괄호 제거가 두 경우를 모두 해결한다.
    part = part.replace(/\((?:[^()]|\([^()]*\))*\)/g, '').trim();
    if (!part || part === '—' || part.startsWith('—')) continue;
    // 코드 스팬 안에서 컴포넌트명을 찾는다. `LayerStack orientation="band"` 처럼
    // 스팬이 컴포넌트명보다 넓은 경우가 있으므로 스팬 전체를 소비한다.
    const spanRe = new RegExp(String.raw`\x60([^\x60]*\b(?:${COMPONENTS.join('|')})\b[^\x60]*)\x60`);
    const sm = part.match(spanRe);
    if (!sm) continue;
    const cm = [sm[0], sm[1].match(new RegExp(`\\b(?:${COMPONENTS.join('|')})\\b`))[0]];
    // subject: 컴포넌트 코드 스팬 뒤 텍스트에서 마크업·꾸밈 제거
    let subject = part.slice(part.indexOf(sm[0]) + sm[0].length)
      .replace(/^\s*(?:`[^`]*`)?\s*/, '')      // orientation="band" 같은 부속 코드 스팬
      .replace(/^[—\-–:]\s*/, '')
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .trim();
    // 괄호 주석·섹션 표기는 subject에서 뺀다 (대조 키워드를 좁힌다)
    subject = subject.replace(/\((?:[^()]|\([^()]*\))*\)/g, '').replace(/\s*§[\d.~]+\s*/g, ' ')
      .replace(/\s*표\d+(?:·표\d+)*\s*/g, ' ').replace(/\s+/g, ' ').trim();
    out.push({ component: cm[1], subject });
  }
  return out;
}

const wave = process.argv[2];
const checkOnly = process.argv.includes('--check');
if (!DESIGN[wave]) {
  console.error(`사용법: node scripts/build-diagram-plan.mjs <${Object.keys(DESIGN).join('|')}> [--check]`);
  process.exit(2);
}

const md = readFileSync(DESIGN[wave], 'utf8');
// §2 전체를 훑는다(§2.1 ~ 다음 `## ` 절 직전).
// 집계 절의 하드코딩(2.5/2.6)에 의존하던 것을 없앴다 — 웨이브마다 절 수가 달라 깨졌다.
// 매핑 표가 없는 절은 행을 내놓지 않으므로 §2 전체를 봐도 안전하다.
const startKey = '### 2.1';
if (!md.includes(startKey)) {
  console.error(`❌ ${DESIGN[wave]}에서 §2.1을 찾지 못했다`);
  process.exit(2);
}
const from = md.indexOf(startKey);
const nextTop = md.slice(from).search(/\n## [^#]/);
const body = nextTop < 0 ? md.slice(from) : md.slice(from, from + nextTop);

const plan = {};
/**
 * 매핑 표는 **4열**이다: 모듈 | 주 도해 | 근거 | 보조.
 *
 * 고정 정규식(`\|(.+?)\|(.+?)\|(.+?)\|`)으로 파싱하면 두 가지로 조용히 틀린다 —
 * 5열 이상이면 마지막 그룹이 나머지 열을 `|`째로 흡수해 **비고 열의 코드 스팬이 보조
 * 배정으로 읽히고**, 3열이면 행 자체가 매치되지 않아 **말없이 건너뛴다**.
 * §2에는 3열 표(§2.4 탈락·채택 판정 기록)가 섞여 있어 후자가 실제로 일어난다 —
 * 지금은 그것이 우연히 맞는 동작이지만, 열 수가 하나 늘면 조용히 틀린다.
 *
 * 그래서 열 수를 **먼저 검증**하고, 기대와 다르면 세어서 보고한다.
 */
const MAPPING_COLS = 4;
const rowStart = /^\|\s*`([a-z0-9][a-z0-9.-]*)`\s*\|/;
let rowsSeen = 0;
let skipped = 0;
for (const line of body.split('\n')) {
  const head = line.match(rowStart);
  if (!head) continue;
  // `| a | b | c |` → ['a','b','c']. 앞뒤 빈 칸을 버린다.
  const cols = line.replace(/^\|/, '').replace(/\|\s*$/, '').split('|');
  if (cols.length !== MAPPING_COLS) { skipped += 1; continue; }
  const [, mainCell, , auxCell] = cols;
  const entries = [...parseCell(mainCell, { primary: true }), ...parseCell(auxCell, { primary: false })];
  if (!entries.length) continue;
  const mod = head[1];
  // 같은 모듈이 여러 절의 표에 나오면 **덮어쓰지 않고 병합**한다.
  // 덮어쓰면 먼저 읽은 배정이 조용히 사라진다 — 이 스크립트가 막으려는 바로 그 유형이다.
  const acc = plan[mod] ?? (plan[mod] = []);
  for (const e of entries) {
    if (acc.some((x) => x.component === e.component && x.subject === e.subject)) continue;
    acc.push(e);
  }
  rowsSeen += 1;
}
const modCount = Object.keys(plan).length;

if (skipped) console.log(`ℹ 4열이 아닌 행 ${skipped}건은 건너뛰었다 (§2.4 판정 기록 등 3열 표)`);
if (rowsSeen !== modCount) console.log(`ℹ 표 행 ${rowsSeen} → 모듈 ${modCount} (같은 모듈이 여러 표에 등장해 병합됨)`);
console.log(`${DESIGN[wave]} → 모듈 ${modCount} · 배정 ${Object.values(plan).reduce((a, v) => a + v.length, 0)}`);
const noSubject = Object.entries(plan).flatMap(([k, v]) => v.filter((e) => !e.subject).map((e) => `${k}::${e.component}`));
if (noSubject.length) console.log(`⚠ subject 없는 배정 ${noSubject.length}건: ${noSubject.slice(0, 6).join(', ')}`);

if (checkOnly) {
  const cur = existsSync(OUT[wave]) ? JSON.parse(readFileSync(OUT[wave], 'utf8')) : {};
  const curMods = Object.keys(cur).filter((k) => !k.startsWith('_'));
  const diff = [];
  for (const k of new Set([...curMods, ...Object.keys(plan)])) {
    const a = (cur[k] ?? []).map((x) => (typeof x === 'string' ? x : x.component)).sort().join(',');
    const b = (plan[k] ?? []).map((x) => x.component).sort().join(',');
    if (a !== b) diff.push(`${k}: 현재[${a}] vs Design[${b}]`);
  }
  console.log(diff.length ? `\n❌ Design과 배치표 불일치 ${diff.length}건\n  ${diff.join('\n  ')}` : '\n✅ Design과 배치표 일치');
  process.exit(diff.length ? 1 : 0);
}

const prev = existsSync(OUT[wave]) ? JSON.parse(readFileSync(OUT[wave], 'utf8')) : {};
const doc = {
  _coverage: SELECTIVE.has(wave) ? 'selective' : 'full',
  _comment: `Design ${DESIGN[wave]} §2에서 자동 생성 — 손으로 편집하지 않는다. 배정을 바꿀 때는 Design을 고치고 이 스크립트를 재실행한다(node scripts/build-diagram-plan.mjs ${wave}).`,
  _substitutions: prev._substitutions,
  ...plan,
};
if (!doc._substitutions) delete doc._substitutions;
writeFileSync(OUT[wave], `${JSON.stringify(doc, null, 2)}\n`);
console.log(`✅ ${OUT[wave]} 생성`);
