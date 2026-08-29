/**
 * 렌더 관문 **배선 감사** — 관문이 아니라 **관문을 재는 자**다.
 *
 * `verify:render`의 범위 판정은 순수 함수(`scopeStatic`·`scopeViolations`)에 있고,
 * 대조군 여럿이 그 함수를 **직접** 부른다. 그래서 판정 자체는 잘 고정돼 있다.
 * 그런데 **그 함수를 부르는 자리**는 아무도 안 본다 — 인자를 바꿔치기해도 대조군은
 * 자기 손으로 만든 입력을 쓰므로 아무 일도 안 일어난다.
 *
 * *"대조군이 있다"* 와 *"그 판정이 본 검사에서 살아 있다"* 는 다른 주장이다.
 *
 * 이 스크립트는 호출부 인자를 **하나씩** 훼손하고 `--self-test`가 잡는지 센다.
 * 착수 시점 실측은 **6/11**이었다(`render-gate-control-claims` Plan §1).
 *
 * ```bash
 * npm run audit:wiring
 * ```
 *
 * ★**소스를 고쳤다가 되돌린다.** `finally`에서 원복하고, 원복 뒤 자체검사를 한 번 더
 * 돌려 `exit 0`을 확인한다. 확인이 실패하면 크게 운다 — 감사가 저장소를 망가뜨린 채
 * 끝나는 것이 이 스크립트가 낼 수 있는 가장 나쁜 결과다.
 *
 * 관문이 아니므로 `verify:*`에 넣지 않는다. 배선을 건드리는 작업(판정을 순수 함수로
 * 뽑기 · 호출부 인자 바꾸기) 뒤에 돌린다.
 */
import { readFileSync, writeFileSync, copyFileSync, unlinkSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const TARGET = 'scripts/verify-diagram-render.mjs';
// ★백업 이름에 pid를 넣는다 — 고정 이름이면 **동시 실행이 서로 덮어쓴다.**
const BACKUP = path.join(process.env.TMPDIR ?? '/tmp', `dgm-audit-backup-${process.pid}.mjs`);

function die(msg) {
  console.error(`❌ ${msg}`);
  process.exit(2);
}

if (!existsSync(TARGET)) die(`${TARGET}을 찾을 수 없다 — 저장소 루트에서 돌려라.`);

const src0 = readFileSync(TARGET, 'utf8');

/**
 * ★`Ctrl-C`에도 원복한다. Node의 기본 SIGINT 처분은 즉시 종료라 `finally`가 **안 돈다** —
 * 소스를 고쳤다가 되돌리는 도구가 훼손된 채 남는 것이 최악이다(gap-detector 지적).
 * 종료 코드는 관례대로 128+시그널로 낸다.
 */
let restored = false;
const restore = () => {
  if (restored) return;
  restored = true;
  try { writeFileSync(TARGET, src0); } catch { /* 원본을 메모리에 들고 있으니 이것이 최선이다 */ }
  try { if (existsSync(BACKUP)) unlinkSync(BACKUP); } catch { /* 백업은 없어도 된다 */ }
};
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(sig, () => {
    console.error(`\n⚠ ${sig} — 원복하고 끝낸다.`);
    restore();
    process.exit(sig === 'SIGINT' ? 130 : 143);
  });
}
process.on('uncaughtException', (e) => { restore(); console.error(`❌ ${e?.message ?? e}`); process.exit(2); });

/**
 * 훼손 목록. `from`은 **호출부 전체**를 잡아 인자 하나만 바꾼다 —
 * 함수 정의가 아니라 **부르는 자리**를 겨눠야 배선을 재는 것이 된다.
 */
function callSites(src) {
  const grab = (head) => {
    const i = src.indexOf(head);
    if (i < 0) return null;
    const j = src.indexOf('});', i);
    const k = src.indexOf(';', i);
    return src.slice(i, (j >= 0 && j < k) || k < 0 ? j + 3 : k + 1);
  };
  const stat = grab('const pre = scopeStatic({');
  const obs = grab('const scope = scopeViolations({');
  if (!stat) die('scopeStatic 호출부를 찾지 못했다 — 이름이 바뀌었나.');
  if (!obs) die('scopeViolations 호출부를 찾지 못했다 — 이름이 바뀌었나.');
  return { stat, obs };
}

const { stat, obs } = callSites(src0);

/**
 * [함수, 인자, 무엇의 배선, 원문 조각, 바꿀 조각, **이 자리를 주장하는 대조군**]
 *
 * ★마지막 칸이 없으면 감사는 *"아무 대조군이든 반응한다"* 만 재고 *"이 자리를 주장한
 * 대조군이 반응한다"* 는 못 잰다. 실측으로 확인했다(gap-detector ③): `pagesByKind`를
 * 비우면 ⑲㉑㉒㉓㉕㉖⑳이 **부수적으로** 깨지는데 정작 α₀를 주장하는 ㉔은 통과했다.
 * 그래도 감사는 `✅ 잡힘 … α₀ 근거`라고 적었다 — **거짓 초록이다.**
 */
const CASES = [
  ['scopeStatic', 'svg', 'α₀', stat, 'svg: SVG_COMPONENTS', 'svg: []', ['㉔']],
  ['scopeStatic', 'dir', 'γ·ε', stat, 'dir: ALL_COMPONENTS', 'dir: BARREL_COMPONENTS', ['㉔']],
  ['scopeStatic', 'barrel', 'γ·ε 반대쪽', stat, 'barrel: BARREL_COMPONENTS', 'barrel: ALL_COMPONENTS', ['㉔']],
  // ★이 자리를 **주장하는** 대조군은 ㉔(α₀)인데, 실측하니 ㉔은 통과하고 다른 것들이
  // 부수적으로 깨졌다(gap-detector ③). `wantBroken`을 비워 두면 감사가 거짓 초록을 낸다.
  // ㉔에 `denyReason`을 주어 **과잉 발화**(α₀가 하나 더 뜨는 것)를 잡게 했다.
  ['scopeStatic', 'pagesByKind', 'α₀ 근거', stat, 'pagesByKind,', 'pagesByKind: new Map(),', ['㉔']],
  ['scopeStatic', 'skipped', 'σ', stat, 'skipped }', 'skipped: [] }', ['㉔', '㉗']],
  ['scopeViolations', 'svg', 'α', obs, 'svg: SVG_COMPONENTS', 'svg: []', ['⑳']],
  // ★`dir → BARREL_COMPONENTS`는 **도달 불가**라 훼손으로 쓰지 않는다. `scopeStatic`의
  // γ·ε가 `dir ≡ barrel`을 보장하므로 그 검사를 통과한 실행에서 둘은 같은 값이고,
  // 바꿔치기해도 **관측되는 차이가 없다.** 덮을 것이 없는 자리를 무대조군으로 세면
  // 감사 수치가 거짓말을 한다. 관측 가능한 훼손은 `dir: []` — β가 **과잉 발화**한다.
  ['scopeViolations', 'dir', 'β', obs, 'dir: ALL_COMPONENTS', 'dir: []', ['㉖']],
  ['scopeViolations', 'observed', '관측', obs, 'observed, observedSvg', 'observed: new Set(), observedSvg', ['㉕']],
  ['scopeViolations', 'observedSvg', 'δ 대상', obs, 'observedSvg,', 'observedSvg: new Set(),', ['㉒', '㉓']],
  ['scopeViolations', 'pagesByKind', 'δ 기준선', obs, 'pagesByKind, urls', 'pagesByKind: new Map(), urls', ['㉒', '㉓']],
  ['scopeViolations', 'urls', 'δ 비교', obs, 'pagesByKind, urls,',
    'pagesByKind, urls: [...new Set([...pagesByKind.values()].flatMap((v) => [...v]))],', ['㉒', '㉓']],
];

/**
 * ★`CASES`는 **호출부의 미러**다. 손으로 적은 목록이라 항목을 지우면 분모가 **스스로 줄어**
 * `10/10 ✅`가 나온다(실측). 이 저장소가 세운 규약대로 — **미러가 나쁜 게 아니라
 * 대조되지 않는 미러가 나쁘다** — 호출부에서 인자 이름을 **유도해 대조**한다.
 *
 * 그리고 판정 함수를 부르는 자리가 **셋째로** 생기면 이 스크립트는 그것을 모른다.
 * 그것도 여기서 잡는다.
 */
function assertCasesMirrorCallSites(src, cases) {
  // 판정 함수를 부르는 자리 전부 — 아는 둘 말고 더 있으면 운다.
  const heads = [...src.matchAll(/(?:const|let|var)\s+\w+\s*=\s*(scope[A-Za-z]*)\s*\(\{/g)].map((m) => m[1]);
  const known = new Set(['scopeStatic', 'scopeViolations']);
  const unknown = [...new Set(heads)].filter((h) => !known.has(h));
  if (unknown.length) {
    die(`판정 함수를 부르는 자리가 더 있다: ${unknown.join(' · ')} — 감사가 그 배선을 모른다. CASES에 더하라.`);
  }
  // 호출부의 인자 이름을 유도한다. `key: value`와 축약(`key,` / `key }`) 둘 다 본다.
  const argsOf = (site) => {
    const inner = site.slice(site.indexOf('{') + 1, site.lastIndexOf('}'));
    const named = [...inner.matchAll(/(?:^|[{,\s])([a-zA-Z_]\w*)\s*:/g)].map((m) => m[1]);
    const short = [...inner.matchAll(/(?:^|[,{])\s*([a-zA-Z_]\w*)\s*(?=[,}]|$)/gm)].map((m) => m[1]);
    return [...new Set([...named, ...short])];
  };
  const want = { scopeStatic: argsOf(stat), scopeViolations: argsOf(obs) };
  const have = new Set(cases.map(([fn, arg]) => `${fn}.${arg}`));
  const missing = [];
  for (const [fn, args] of Object.entries(want)) {
    for (const a of args) if (!have.has(`${fn}.${a}`)) missing.push(`${fn}.${a}`);
  }
  if (missing.length) {
    die(`호출부에 있는데 훼손이 없는 인자: ${missing.join(' · ')} — 분모가 조용히 줄었다. CASES에 더하라.`);
  }
  const extra = [...have].filter((k) => {
    const [fn, a] = k.split('.');
    return !want[fn]?.includes(a);
  });
  if (extra.length) die(`CASES에 있는데 호출부에 없는 인자: ${extra.join(' · ')} — 인자 이름이 바뀌었나.`);
  console.log(`   호출부 인자 ${Object.values(want).flat().length}개 · CASES ${cases.length}개 — 대조 일치\n`);
}

assertCasesMirrorCallSites(src0, CASES);

const selfTest = () => {
  const r = spawnSync(process.execPath, [TARGET, '--self-test'], { encoding: 'utf8', timeout: 600_000 });
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  return {
    status: r.status,
    broke: out.split('\n')
      .filter((l) => l.includes('❌ 실패'))
      .map((l) => (l.match(/❌ 실패\s+(\S+)/) ?? [])[1] ?? '?'),
  };
};

console.log('★ 렌더 관문 배선 감사 — 호출부 인자를 하나씩 훼손한다\n');
copyFileSync(TARGET, BACKUP);
let covered = 0;
const missed = [];
try {
  for (const [fn, arg, what, site, from, to, wantBroken] of CASES) {
    if (!site.includes(from)) {
      console.log(`⚠ 건너뜀  ${fn}.${arg} — 호출부에서 "${from}"을 찾지 못했다(인자 이름이 바뀌었나)`);
      missed.push(`${fn}.${arg}(앵커 없음)`);
      continue;
    }
    writeFileSync(TARGET, src0.replace(site, site.replace(from, to)));
    const { status, broke } = selfTest();
    // ★"이 자리를 주장한 대조군"이 실제로 깨져야 덮인 것이다. 종료 코드만 보면
    // 부수 피해로 초록이 된다.
    const claimed = (wantBroken ?? []).filter((c) => !broke.includes(c));
    const ok = status === 2 && claimed.length === 0;
    if (ok) covered += 1; else missed.push(`${fn}.${arg}${claimed.length ? `(주장 ${claimed.join(',')} 안 깨짐)` : ''}`);
    console.log(`${ok ? '✅ 잡힘  ' : '❌ 안 잡힘'}  ${fn.padEnd(16)} ${arg.padEnd(12)} ${String(what).padEnd(12)} `
      + `종료 ${status} · ${broke.length ? broke.join(' ') : '(아무도 안 깨짐)'}`
      + `${claimed.length ? `  ← 주장 대조군 ${claimed.join(',')} 이 안 깨졌다` : ''}`);
  }
} finally {
  restore();
  // ★원복을 **믿지 않고 확인한다.** 감사가 저장소를 망가뜨린 채 끝나면 최악이다.
  if (readFileSync(TARGET, 'utf8') !== src0) {
    console.error('\n❌❌ 원복이 어긋났다 — 파일 내용이 시작과 다르다. `git diff`로 확인하라.');
    process.exit(2);
  }
  const back = selfTest();
  if (back.status !== 0) {
    console.error(`\n❌❌ 원복 뒤 자체검사가 ${back.status}로 끝났다 — 저장소가 망가진 채 남았을 수 있다.`);
    process.exit(2);
  }
}

console.log(`\n덮인 배선 **${covered}/${CASES.length}**`);
if (missed.length) {
  console.log(`무대조군: ${missed.join(' · ')}`);
  console.log('\n※ 이 스크립트는 관문이 아니다 — 실패해도 종료 코드 1이지 빌드를 막지 않는다.');
  process.exit(1);
}
console.log('✅ 호출부 전 인자가 대조군에 덮인다.');
