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
import { readFileSync, writeFileSync, copyFileSync, unlinkSync, existsSync, readdirSync } from 'node:fs';
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
 * ★★**시그널로는 이 감사를 멈출 수 없다 — `SIGKILL`뿐 아니라 `SIGINT`·`SIGTERM`도다.**
 * 아래에 핸들러를 달아 뒀지만 **본문이 도는 동안에는 돌지 않는다**: 이 스크립트에는
 * `await`가 **하나도 없고**(전 구간 동기) `selfTest()`가 `spawnSync`로 블로킹한다.
 * 시그널 핸들러는 JS 콜백이라 스택이 이벤트 루프로 풀린 뒤에야 도는데, 그때는 본문이 끝난 뒤다.
 *
 * 실측: `timeout 25 node scripts/audit-render-wiring.mjs`가 **5분 43초 살아 있었다.**
 * 25초에 간 `SIGTERM`이 무동작이었다.
 *
 * **이 사실을 숨기면 위험하다** — Ctrl-C가 안 먹는 것처럼 보이면 다음 손은 `kill -9`로 가고,
 * 그것은 핸들러를 아예 건너뛰어 **소스가 훼손된 채 남는다.**
 * 이 사이클의 Act에서 실제로 그랬다: 감사를 8초 만에 `kill -9` 했더니 첫 훼손
 * (`svg: SVG_COMPONENTS` → `svg: []`)이 남았고, 그 위에서 돌린 자체검사가 `35건 · exit 2`를 냈다.
 * **관문이 깨진 줄 알고 멀쩡한 코드를 고치러 갈 뻔했다.**
 *
 * 증거는 이미 만들어지고 있었다 — 원복하지 못한 실행의 **백업 파일이 남는다.**
 * 아무도 그것을 읽지 않았을 뿐이다. 이제 읽는다.
 *
 * **자동 원복은 하지 않는다.** 고아 백업과 현재 소스가 다르다는 것은 *"그 사이 누가 고쳤다"*
 * 일 수도 있다 — 되돌리면 정당한 편집을 지운다. **사실만 말하고 사람이 정한다.**
 */
const TMPDIR = process.env.TMPDIR ?? '/tmp';
try {
  const mine = path.basename(BACKUP);

  /**
   * ★★**살아 있는 감사의 백업은 고아가 아니다.**
   * 초판은 pid를 안 봤다 — 그래서 **동시에 도는 다른 감사의 백업을 고아로 보고,
   * 내용이 같으면 조용히 지웠다.** 그 백업은 그 감사의 유일한 안전망이다.
   * 지우고 나서 그쪽이 SIGKILL을 맞으면 **되돌릴 파일이 없다** —
   * 이 장치가 막으려던 바로 그 상황을 이 장치가 **더 나쁘게** 만든다.
   * (동시 실행 자체가 위험하지만, 위험을 줄이러 온 것이 위험을 키우면 안 된다.)
   */
  const alive = (pid) => {
    try { process.kill(pid, 0); return true; }
    catch (e) { return e.code === 'EPERM'; }   // 살아 있는데 내 것이 아니다
  };
  const orphans = readdirSync(TMPDIR)
    .filter((f) => /^dgm-audit-backup-\d+\.mjs$/.test(f) && f !== mine)
    .filter((f) => !alive(Number(f.match(/-(\d+)\.mjs$/)[1])));
  const differing = orphans.filter((f) => {
    try { return readFileSync(path.join(TMPDIR, f), 'utf8') !== src0; } catch { return false; }
  });
  if (differing.length) {
    console.error(`\n⚠ **원복하지 못하고 끝난 감사가 ${differing.length}건 있다.**`);
    console.error('   (SIGKILL은 시그널 핸들러를 건너뛴다 — 소스에 훼손이 남았을 수 있다.)');
    for (const f of differing) console.error(`   ${path.join(TMPDIR, f)}`);
    console.error(`\n   지금 소스가 옳은지 먼저 확인해라:  node ${TARGET} --self-test`);
    console.error('   훼손이 남았다면 위 백업으로 되돌리고, 정당한 편집이었다면 그 파일을 지워라.');
    console.error('   ※ 자동으로 되돌리지 않는다 — 정당한 편집을 지울 수 있다.\n');
  }
  // 내용이 같은 고아(= 죽은 pid의 것)는 무해하다 — 조용히 치운다.
  for (const f of orphans.filter((x) => !differing.includes(x))) {
    try { unlinkSync(path.join(TMPDIR, f)); } catch { /* 못 지워도 해가 없다 */ }
  }
} catch (e) {
  // ★`TMPDIR`을 못 읽어도 **감사를 막지는 않는다.** 이것은 편의 장치지 관문이 아니다.
  // 다만 조용히 넘기지 않는다 — 이 저장소의 규약이다.
  // 그리고 이 블록은 예외 핸들러(`uncaughtException`)보다 **먼저** 돌므로,
  // 안 잡으면 **종료 코드 계약 밖**(1)으로 죽는다. 계약상 1은 *콘텐츠 위반*이다.
  console.error(`⚠ 고아 백업을 확인하지 못했다(${e?.message ?? e}) — 감사는 계속한다.`);
}

/**
 * ★핸들러를 달아 두되 **본문 중에는 안 돈다**(위 주석 참고 — 전 구간 동기 + `spawnSync`).
 * 그래도 남겨 둔다 — Node의 기본 SIGINT 처분은 즉시 종료라 `finally`조차 안 도는데,
 * 핸들러가 있으면 그 즉사를 막아 감사가 **원복까지 완주**한다. 종료 코드는 관례대로 128+시그널로 낸다.
 *
 * **멈추고 싶으면 기다려라** — 끝날 때까지 두거나, 이미 죽였다면 소스를 먼저 확인한다:
 *   while pgrep -f audit-render-wiring; do sleep 5; done
 *   node scripts/verify-diagram-render.mjs --self-test
 */
/**
 * ★**언제나 쓴다.** 초판은 `restored` 플래그로 한 번만 쓰게 했는데, 감사 구간이 둘(배선·규칙)이
 * 되자 **두 번째 원복이 무동작**이 되어 소스가 훼손된 채 남았다(실측: `<svq`가 그대로 남고
 * 자체검사 exit 2). 플래그의 목적은 **시그널 핸들러의 재진입 방지**였지 정상 흐름의 반복 원복
 * 금지가 아니었다 — 같은 내용을 두 번 쓰는 것은 해가 없다.
 *
 * 재진입 방지는 `signalled`가 따로 진다.
 */
let signalled = false;
const restore = () => {
  // ★**쓰기가 성공한 뒤에만 백업을 지운다**(PR #41 리뷰 · 백로그 D-8).
  // 초판은 `writeFileSync` 실패를 조용히 삼킨 다음 `BACKUP`을 지웠다 —
  // **복구 자산이 필요한 바로 그 경우에 그것이 사라진다.** 훼손된 TARGET은 남고
  // 되돌릴 파일은 없다. 실패는 시끄럽게 알리고 백업은 남긴다.
  let wrote = false;
  try {
    writeFileSync(TARGET, src0);
    wrote = true;
  } catch (e) {
    console.error(`❌ 원본 복원에 실패했다: ${e?.message ?? e}`);
    console.error(`   백업을 남긴다 — 손으로 되돌려라: cp ${BACKUP} ${TARGET}`);
  }
  if (!wrote) return;
  try { if (existsSync(BACKUP)) unlinkSync(BACKUP); } catch { /* 백업은 없어도 된다 */ }
};
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(sig, () => {
    if (signalled) return;
    signalled = true;
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
  // ★**모든 호출 형태**를 본다. 초판은 `const|let|var X = scope…({` 만 찾아
  // `return scopeStatic({ … })` 를 놓쳤다 — 그리고 그 자리는 **Check에서 내가 만든 것**이다
  // (`realTreeScopeViolations()`, C-4 수정). **탐지기를 만든 사람이 탐지기의 사각에 코드를 놨다.**
  // 함수 선언(`function scopeStatic(`)은 호출이 아니므로 뺀다.
  // ★★초판은 `scopeX({` 만 봤다 — **인라인 객체 리터럴 형태**만 본 것이다. 그래서
  // `const got = scopeStatic(c.v);` · `const got = scopeViolations(c.v);` 꼴인 자체검사 호출 둘을 못 봤고,
  // `calls(3) === covered(3)`가 성립해 **가드가 자기 눈으로 초록을 냈다**(Check A-3).
  // **세는 대상을 형태로 정의하면 다른 형태는 세어지지 않는다.**
  // 이제 호출 형태를 가리지 않는다. 대신 주석 줄의 언급(``scopeViolations()`를 직접 불러…`)은
  // 뺀다 — 그것은 호출이 아니다.
  const srcLines = src.split('\n');
  const isCommentLine = (at) => /^\s*(\/\/|\*|\/\*)/.test(srcLines[src.slice(0, at).split('\n').length - 1] ?? '');
  const calls = [...src.matchAll(/\b(scope[A-Z][A-Za-z]*)\s*\(/g)]
    .map((m) => ({ fn: m[1], at: m.index }))
    .filter((c) => !/function\s+$/.test(src.slice(Math.max(0, c.at - 12), c.at)))
    .filter((c) => !isCommentLine(c.at));
  /**
   * 아는 호출부. `audited: false`는 **감사 대상이 아님을 명시**하는 자리다 —
   * 조용히 빠지는 것과 이유를 적고 빠지는 것은 다르다.
   */
  const SITES = [
    { fn: 'scopeStatic', head: 'const pre = scopeStatic({', audited: true },
    { fn: 'scopeViolations', head: 'const scope = scopeViolations({', audited: true },
    { fn: 'scopeStatic', head: 'return scopeStatic({', audited: false,
      why: '자체검사가 **저장소 상태**를 재는 자리다(D-5 면책 판단). 훼손하면 면책 문구만 흔들리고 본 검사 판정은 그대로라 감사의 대상이 아니다 — 대신 백로그 B-12로 남긴다.' },
    // ★자체검사가 판정 함수를 직접 부르는 자리 둘. 인자가 `c.v`(대조군 fixture) 하나라
    // **훼손할 인자 이름이 없다** — 감사의 기계(`from` → `to` 문자열 치환)가 걸 것이 없다.
    // 이 자리의 옳음은 감사가 아니라 **범위 하한 대조군 10건 자신**이 진다.
    { fn: 'scopeStatic', head: 'const got = scopeStatic(c.v);', audited: false,
      why: '자체검사가 대조군 fixture를 직접 먹이는 자리다. 인자가 c.v 하나라 훼손할 이름이 없고, 옳음은 범위 하한 대조군 10건이 진다.' },
    { fn: 'scopeViolations', head: 'const got = scopeViolations(c.v);', audited: false,
      why: '위와 같다 — 자체검사의 호출부다.' },
  ];
  const covered = SITES.filter((s) => src.includes(s.head));
  const missingSites = SITES.filter((s) => !src.includes(s.head));
  if (missingSites.length) die(`아는 호출부가 사라졌다: ${missingSites.map((s) => s.head).join(' · ')} — 이름이 바뀌었나.`);
  if (calls.length !== covered.length) {
    die(`판정 함수 호출이 ${calls.length}곳인데 아는 자리는 ${covered.length}곳이다 — 새 호출부가 생겼다. SITES에 더하고 감사 대상 여부를 적어라.`);
  }
  const skipped = covered.filter((s) => !s.audited);
  if (skipped.length) {
    for (const s of skipped) console.log(`   ⏭ 감사 밖: ${s.head} — ${s.why}`);
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


/**
 * ★**판정 규칙** 훼손. 호출부 인자(§CASES)와 **다른 종류**다 — 인자는 *"무엇을 넘기나"*,
 * 규칙은 *"무엇을 기준으로 가르나"* 다. 검사 범위 자체를 정하는 것은 후자다.
 *
 * 두 수를 **따로** 낸다. 한 수로 뭉개면 어느 쪽이 빈지 모른다.
 *
 * ★`guard: true`는 **대조군이 잡을 수 없는** 훼손이다 — 부모가 모듈 적재 시점에
 * 죽어 대조군이 하나도 돌지 않는다. 덮을 수 없는 것을 덮었다고 세면 수치가 거짓말을 한다.
 */
const KINDS_SVG = `  out.kindsSvg = [...new Set(figs.filter((f) => [...f.querySelectorAll('svg[viewBox] text')]
    .some((t) => t.textContent.trim() && !t.closest(NOT_PAINTED_SEL)))
    .map((f) => f.getAttribute('data-diagram')).filter(Boolean))];`;
const DERIV = `  .filter((f) => readFileSync(path.join(DIAGRAM_DIR, f), 'utf8').includes('<svg'))`;
const RULES = [
  ['유도', '필터 삭제', DERIV, '', ['㉘']],
  ['유도', '필터 반전', DERIV, DERIV.replace('=> readFileSync', '=> !readFileSync'), ['㉘']],
  // ★**부분 제외** — 규칙은 살아 있는데 한 종만 빠진다. 선행 G-5(LayerStack 하나만 제외)의
  // 모양이다. 이때 종료 코드도 δ 사유도 **안 갈리므로**(둘 다 exit 2 · δ Extra 그대로)
  // ㉘의 배너 요구 `유도 2종`이 **유일한 판별자**다.
  ['유도', '한 종만 제외', DERIV, DERIV + " .filter((f) => f !== 'Beta.tsx')", ['㉘']],
  ['유도', '리터럴 오타', DERIV, DERIV.replace("'<svg'", "'<svq'"), [], '부모의 시작 가드(SVG_COMPONENTS.length === 0)가 모듈 적재 때 exit 2 — 대조군이 하나도 돌지 않는다',
    /SVG 컴포넌트를 찾지 못했다/],
  // ★**상한** — 지금까지 규칙 훼손은 전부 *좁히는* 쪽이었다. `kindsSvg`를 `kinds`로 넓히면
  // 글자 없는 SVG(아이콘)까지 판정 대상이 되어 **거짓 지목**이 되살아난다(주석이 기록한 62페이지 사건).
  // 문턱은 양쪽에서 봐야 고정된다 — 이 저장소가 대비·글자 크기에서 배운 것과 같다.
  ['관측', '판정 대상을 넓힌다', KINDS_SVG, '  out.kindsSvg = out.kinds;', ['㉚']],
];

const selfTest = () => {
  const r = spawnSync(process.execPath, [TARGET, '--self-test'], { encoding: 'utf8', timeout: 600_000 });
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  /**
   * ★★**자식이 판정을 못 낸 것과 관문이 잡은 것은 다르다**(Check N-1).
   * 초판은 `r.status`만 보고 `r.signal`·`r.error`를 버렸다. 그런데 `Ctrl-C`는 포그라운드
   * **프로세스 그룹 전체**에 간다 — 부모는 핸들러가 있어 삼키지만(그 콜백은 영영 안 돈다),
   * **자식은 기본 처분으로 즉사한다.** 그러면 `status === null`이라 `status === 2`가 거짓이 되고,
   * 감사는 그 항목을 `❌ 안 잡힘` → `무대조군`으로 보고한다.
   *
   * **덮인 항목이 무대조군으로 뒤바뀐다 — 거짓 빨강이다.**
   * 이 사이클은 내내 *거짓 초록*을 쫓았는데, 같은 병의 반대편이 여기 있었다.
   * (600초 타임아웃도 같은 경로다: `r.signal === 'SIGTERM'`.)
   *
   * `die()`를 쓰지 않는다 — `process.exit`는 `finally`를 건너뛰어 **소스를 훼손된 채 남긴다.**
   * 던지면 `finally`의 `restore()`가 돌고, 그 뒤 `uncaughtException`이 한 번 더 원복한다.
   */
  if (r.error || r.signal) {
    throw new Error(
      `자체검사 자식이 판정을 내지 못했다 — ${r.signal ? `시그널 ${r.signal}` : (r.error?.message ?? '알 수 없음')}. `
      + `관문이 잡은 것이 **아니다**(status=${r.status}). 이 상태의 수치는 읽지 마라 — 덮인 항목이 무대조군으로 보인다.`,
    );
  }
  return {
    out,
    status: r.status,
    broke: out.split('\n')
      .filter((l) => l.includes('❌ 실패'))
      .map((l) => (l.match(/❌ 실패\s+(\S+)/) ?? [])[1] ?? '?'),
  };
};

/**
 * ★`RULES`도 **손 목록**이다. `CASES`가 겪은 것(항목을 지우면 분모가 스스로 준다)이
 * 그대로 있었다 — 선행 사이클의 교훈이 **배선 쪽에만** 적용돼 있었다.
 *
 * 규칙은 호출부처럼 유도할 대상이 없으므로, **최소 개수**와 **각 항목의 앵커 존재**를
 * 단언한다. 규칙을 줄이려면 이 수를 함께 줄여야 하고, 그러면 **줄였다는 사실이 diff에 남는다.**
 */
/**
 * ★**"손으로 적은 수를 지키려고 또 손으로 적은 수"가 아닌가 — 무한 후퇴인가?**
 * 아니다. 멈추는 자리가 있고, `CASES`가 그것을 보여준다:
 *
 *   `CASES` 행수 — **손으로 안 적는다.** 호출부 인자에서 **유도해** 대조한다
 *                  (`assertCasesMirrorCallSites`). 유도할 원천이 있기 때문이다.
 *   `RULES`  수 — 유도할 원천이 **없다.** 어떤 훼손을 걸지는 사람이 정하는 것이다.
 *                  그래서 손으로 적되, **유도값(`RULES.length`·`filter` 결과)과 `!==`로 대조**한다.
 *
 * **A-1의 병은 "손으로 적었다"가 아니라 "아무와도 대조되지 않았다"였다**(`5 < 4`가 거짓이라
 * 아무것도 안 물었다). 대조가 유도값과 이뤄지면 그 수를 지킬 또 다른 수는 필요 없다 —
 * `RULE_CLAIMS`가 틀리면 `RULES`를 세는 것만으로 드러난다. **거기서 후퇴가 멈춘다.**
 */
const RULE_CLAIMS = 4;   // 주장 행(대조군이 져야 하는 것)
const RULE_GUARDS = 1;   // 가드 행(대조군이 잡을 수 없는 것)

/**
 * ★**`<`가 아니라 `!==`다.** 초판은 `RULES_MIN = 4`에 `<` 비교였는데, 같은 반영에서
 * 규칙을 4행 → 5행으로 늘리면서 이 수를 안 올렸다. `5 < 4`가 거짓이라 **장치가 태어나면서
 * 한 칸 헐거웠고**, 한 행을 통째로 지워도 `3/3`으로 초록이었다(Check A-1).
 *
 * 하한만 두면 **늘리는 쪽이 공짜**가 되고, 공짜로 는 만큼 다시 줄일 수 있다.
 * 정확히 같기를 요구하면 **어느 방향이든 이 줄을 함께 고쳐야 하고, 그 diff가 근거로 남는다.**
 */
const RULES_MIN = RULE_CLAIMS + RULE_GUARDS;   // ★손으로 안 적는다 — 구성에서 유도한다(Check N-5)
if (RULES.length !== RULES_MIN) {
  die(`판정 규칙 훼손이 ${RULES.length}개인데 RULES_MIN은 ${RULES_MIN}이다 — 더하든 빼든 이 수를 함께 고쳐라(그 diff가 근거가 된다).`);
}
for (const [kind, why, from] of RULES) {
  if (!src0.includes(from)) die(`규칙 앵커가 사라졌다: ${kind}/${why} — 규칙이 바뀌었나.`);
}

/**
 * ★★`RULES_MIN`은 **총수만** 본다 — 그 아래 한 겹, **분모의 구성**은 무방비였다(Check G-1).
 * 두 훼손이 초록으로 지나간다:
 *
 *   ① 주장 행에 `guardWhy`를 붙인다 → `RULES.length`는 그대로라 `RULES_MIN`이 안 물고,
 *      출력이 `규칙 3/3 (+ 가드 2/2)`로 **조용히 준다.** A-1이 잡으려던 그 모양이다.
 *   ② `wantBroken`을 비운다 → `claimed`가 빈 배열이라 `ok`가 `status === 2` 하나로 결정된다.
 *      **부수 피해로 초록**이 되는 상태이고, 이 파일의 주석이 이미 경계한 것이다.
 *
 * **총수를 지키고 구성을 안 지키면 총수가 거짓말을 한다.**
 */
{
  const claims = RULES.filter((r) => !r[5]);
  const guards = RULES.filter((r) => r[5]);
  if (claims.length !== RULE_CLAIMS || guards.length !== RULE_GUARDS) {
    die(`규칙 구성이 주장 ${claims.length}/가드 ${guards.length}인데 선언은 ${RULE_CLAIMS}/${RULE_GUARDS}다 — 어느 행을 가드로 옮겼거나 그 반대다. 이 수를 함께 고쳐라.`);
  }
  /**
   * ★가드 행은 **`guardReason`을 반드시 갖는다**(Check N-2). 없으면 가드는 *아무* `exit 2`
   * 경로에서나 🛡를 낸다 — **관측 대신 자기 선언으로 통과한다.** 이 파일이 이미
   * `wantReason`으로 고친 병(*"종료 코드는 맞았지만 이유가 달랐다"*)의 가드판이다.
   * 주장 행의 `wantBroken`만 요구하고 이쪽을 안 본 것이 G-1의 **비대칭 잔재**였다.
   */
  for (const [kind, why, , , , guardWhy, guardReason] of guards) {
    if (!guardReason) {
      die(`규칙 '${kind}/${why}'가 가드 행인데 guardReason이 없다 — 아무 exit 2에서나 통과한다. 무엇을 관측해 가드라고 부르는지 정규식으로 적어라(이유: ${guardWhy}).`);
    }
  }
  for (const [kind, why, , , wantBroken] of claims) {
    if (!(wantBroken ?? []).length) {
      die(`규칙 '${kind}/${why}'가 주장 행인데 wantBroken이 비었다 — 부수 피해로 초록이 된다. 어느 대조군이 이것을 지는지 적어라(못 지면 가드로 옮기고 이유를 써라).`);
    }
  }
  for (const [fn, arg, , , , , wantBroken] of CASES) {
    if (!(wantBroken ?? []).length) {
      die(`배선 '${fn}.${arg}'의 wantBroken이 비었다 — 부수 피해로 초록이 된다.`);
    }
  }
}

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

// ═══ 판정 규칙 ═══════════════════════════════════════════════════════════════
console.log('\n★ 판정 규칙 감사 — 유도 규칙을 훼손한다');
let ruleCovered = 0;
let ruleGuard = 0;
const ruleMissed = [];
copyFileSync(TARGET, BACKUP);
try {
  for (const [kind, why, from, to, wantBroken, guardWhy, guardReason] of RULES) {
    if (!src0.includes(from)) { console.log(`⚠ 건너뜀  ${kind}/${why} — 규칙 앵커를 찾지 못했다`); ruleMissed.push(`${kind}/${why}(앵커)`); continue; }
    writeFileSync(TARGET, src0.replace(from, to));
    const { status, broke, out } = selfTest();
    if (guardWhy) {
      // ★사유를 **관측으로** 확인한다. 종료 2가 **다른 경로**로 나면 손으로 적은 사유를
      // 관측인 양 출력하게 된다 — 이 저장소가 `spawnChildAgainst`에서 이미 겪고
      // `wantReason`으로 고친 병("종료 코드는 맞았지만 이유가 달랐다")이다.
      const reasonOk = !guardReason || guardReason.test(out);
      const ok = status === 2 && broke.length === 0 && reasonOk;
      if (ok) ruleGuard += 1; else ruleMissed.push(`${kind}/${why}`);
      console.log(`${ok ? '🛡 가드   ' : '❌ 어긋남'}  ${kind.padEnd(6)} ${why.padEnd(14)} 종료 ${status} · 대조군 ${broke.length ? broke.join(' ') : '안 돎'}`
        + `${reasonOk ? ` — ${guardWhy}` : `  ← ★사유가 안 맞는다(${guardReason}) — 적어 둔 이유가 아니다`}`);
      continue;
    }
    const claimed = (wantBroken ?? []).filter((c) => !broke.includes(c));
    const ok = status === 2 && claimed.length === 0;
    if (ok) ruleCovered += 1; else ruleMissed.push(`${kind}/${why}${claimed.length ? `(주장 ${claimed.join(',')} 안 깨짐)` : ''}`);
    console.log(`${ok ? '✅ 잡힘  ' : '❌ 안 잡힘'}  ${kind.padEnd(6)} ${why.padEnd(14)} 종료 ${status} · ${broke.length ? broke.join(' ') : '(아무도 안 깨짐)'}`
      + `${claimed.length ? `  ← 주장 대조군 ${claimed.join(',')} 이 안 깨졌다` : ''}`);
  }
} finally {
  restore();
  const back = selfTest();
  if (back.status !== 0) { console.error(`\n❌❌ 원복 뒤 자체검사가 ${back.status}로 끝났다.`); process.exit(2); }
}
const ruleClaimable = RULES.filter((r) => !r[5]).length;
console.log(`\n덮인 규칙 **${ruleCovered}/${ruleClaimable}** (+ 가드 ${ruleGuard}/${RULES.length - ruleClaimable})`);
if (ruleMissed.length) console.log(`주장 없음: ${ruleMissed.join(' · ')}`);
if (missed.length || ruleMissed.length) {
  if (missed.length) console.log(`무대조군(배선): ${missed.join(' · ')}`);
  console.log('\n※ 이 스크립트는 관문이 아니다 — 실패해도 종료 코드 1이지 빌드를 막지 않는다.');
  process.exit(1);
}
console.log('✅ 호출부 전 인자와 판정 규칙이 대조군에 덮인다.');
// ★**무엇을 안 재는지도 말한다.** 이 감사는 **규칙이 옳게 동작하는가**(R1)만 잰다.
// *"실제 컴포넌트가 그 규칙에 옳게 분류되는가"*(R2)는 자체검사로 볼 수 없고
// **서버가 필요한 본 검사(δ)** 만 본다 — 부분 오분류가 그 예다.
// 덮지 않은 것을 말하지 않으면 이 수치가 "닫았다"로 읽힌다.
console.log('   ※ R1(규칙이 옳게 동작한다)만 잰다. R2(실제 컴포넌트가 옳게 분류된다)는 서버가 필요한 본 검사만 본다.');
