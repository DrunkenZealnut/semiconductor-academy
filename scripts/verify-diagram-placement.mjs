#!/usr/bin/env node
/**
 * 도해 배치 판정 스크립트 — `diagram-expansion` 웨이브 검증용.
 *
 * 배경: `first-semiconductor-primer`·`diagram-component-set`·`diagram-set-finishing`
 * 세 사이클에서 자기 검증이 반복해 틀렸다. 특히 `diagram-set-finishing`의 props 대조
 * 스크립트는 "불일치 0"을 냈으나 실제로 7행이 어긋나 있었다(optional prop만 얕게 훑고
 * 제외 목록이 과도했다). 그때 남긴 백로그가 **"Gap 판정 스크립트에 양성 대조군"**이고,
 * 이 파일이 그 이행이다.
 *
 * 핵심 규칙: **통과를 못 하는 스크립트여야 통과의 의미가 있다.**
 * 매 검사 전에 `--self-test`가 의도적으로 틀린 입력을 주입해 검출되는지 먼저 확인한다.
 * 자기 검사에 실패하면 본 검사를 아예 실행하지 않고 비정상 종료한다.
 *
 * 검사 항목
 *   C-1  배치표 대조    — 모듈별 배정(주+보조) vs 실제. 미이행이 있으면 실패
 *   C-2  값 출처        — 도해의 수치가 그 모듈 MDX 본문에 있는가 (모듈 간 값 이동 0)
 *   C-3  tone 유효성    — tokens.ts의 Tone 목록에 없는 이름을 쓰지 않았는가
 *   C-4  빈 줄 규약     — 도해 블록 앞뒤에 빈 줄이 있는가 (usage.md §2.4)
 *   C-5  idPrefix       — LayerStack·NodeGraph에 부여됐고 전역 중복이 없는가
 *   C-6  색 리터럴      — MDX에 fill-·stroke- 색 클래스 하드코딩이 없는가 (usage.md §3)
 *   C-7  수량 일치      — caption/root의 수량 표현("여덟 실습"·"8대 공정")이 실제 항목 수와 같은가
 *   C-8  용어 출처      — label/title의 명사가 본문에 있는가 (수치가 아닌 **용어** 유입 차단)
 *   C-9  참조 정합      — NodeGraph edges의 from/to가 선언된 node id를 가리키는가
 *   C-10 미러 정합      — {X}.ko.mdx와 {X}.mdx의 컴포넌트 순서가 같고 idPrefix가 겹치지 않는가
 *                        (표를 잘린 상태로 읽어 도해를 만드는 사고를 잡는다 — W2에서 5건 발생)
 *   C-16 계산값 서술    — caption/note/sub의 크기 비율·자릿수 주장("다섯 자릿수 차"·"열 배")이
 *                        그 모듈 본문에 있는가. 한국어 수사는 아라비아 숫자로 환산해 대조한다
 *                        (W4 Check에서 손으로 3건 발견 — 기존 검사는 아라비아 숫자만 보거나
 *                        낱말 단위로만 대조해 놓쳤다. usage.md §2.1.1c)
 *
 * 사용법
 *   node scripts/verify-diagram-placement.mjs                 # 자기 검사 + 전체 검사
 *   node scripts/verify-diagram-placement.mjs --self-test     # 자기 검사만
 *   node scripts/verify-diagram-placement.mjs --wave w1       # 특정 웨이브만
 *
 * 배치표는 `--plan` 으로 JSON을 주거나, 없으면 C-1을 건너뛰고 그 사실을 보고한다
 * (조용히 통과시키지 않는다 — 침묵이 성공으로 읽히는 것을 막는다).
 */

import { readFileSync, existsSync, readdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const COMPONENTS = [
  'LayerStack', 'CompareCards', 'FlowSteps', 'NodeGraph', 'TruthTable', 'ValueBars',
  'TreeBranch', 'LatticeDiagram', 'CurvePlot', 'Timeline', 'ScaleRuler', 'LabeledFigure',
];

/** idPrefix가 필수인 2종 — 문서 전역 id(<pattern>·<marker>)를 만든다. usage.md §2.2 */
const NEEDS_ID_PREFIX = ['LayerStack', 'NodeGraph'];

const WAVES = {
  w1: ['hs-semicon-basics', 'hs-basic-tech-1', 'hs-photo-etch', 'hs-thinfilm-diffusion'],
  w2: ['hs-basic-tech-2', 'hs-equipment-maintenance', 'hs-assembly-inspection',
       'hs-semicon-infra', 'daegu-hs-process'],
  w3: ['cert-equip-maintenance', 'osha-scs'],
  // W4는 책 챕터가 `src/content/chapters/`에 있다 — `/`가 있으면 경로로 그대로 쓴다.
  w4: ['ncs-semi', 'chapters@src/content/chapters'],
};

const SRC = 'src/content/sources';
const ALLOW_PATH = 'docs/02-design/features/diagram-check-allow.json';
const UNITS = 'eV|nm|℃|%|mm|cc|Å|배|V|W|kHz|MHz|Torr|mTorr|Pa|kPa|rpm|mmHg';

/**
 * C-14용 — 컴포넌트별 허용 prop/필드를 `.tsx`의 interface에서 읽는다.
 * 하드코딩하지 않는 이유는 tone 목록과 같다: 미러가 부패한다.
 *
 * 이 검사가 필요한 이유: **MDX는 `tsc`가 검사하지 않는다.** 존재하지 않는 prop을 넣으면
 * 오류 없이 조용히 무시된다. W1에서 `Annotation`에 없는 `id`를, W4 배치 A에서 `Timeline`
 * 이벤트에 없는 `tone`을 넣었고 둘 다 손으로 잡았다 — typecheck는 둘 다 통과했다.
 */
function readPropFields() {
  const dir = 'src/components/diagram';
  const common = new Set();
  const typesFile = join(dir, 'types.ts');
  if (existsSync(typesFile)) {
    const src = readFileSync(typesFile, 'utf8');
    for (const m of src.matchAll(/^\s*(\w+)\??:/gm)) common.add(m[1]);
  }
  const out = {};
  for (const c of COMPONENTS) {
    const f = join(dir, `${c}.tsx`);
    if (!existsSync(f)) continue;
    const src = readFileSync(f, 'utf8');
    // 타입 정의는 `export function` 위에 모여 있다. 그 구역 전체에서 필드명을 뽑으면
    // 인라인 객체 타입(`loop?: { from: string; to: string }`)도 함께 들어온다.
    const cut = src.indexOf('export function');
    const head = cut > 0 ? src.slice(0, cut) : src;
    const fields = new Set(common);
    for (const m of head.matchAll(/(?:^|[{;,])\s*(\w+)\??:/gm)) fields.add(m[1]);
    out[c] = fields;
  }
  return out;
}

/** tokens.ts에서 Tone 목록을 읽는다 — 하드코딩하지 않는다(미러 부패 방지). */
function readTones() {
  const t = readFileSync('src/components/diagram/tokens.ts', 'utf8');
  const block = t.match(/export type Tone =([\s\S]*?);/);
  if (!block) throw new Error('tokens.ts에서 Tone 목록을 찾지 못했다');
  return [...block[1].matchAll(/'([a-z-]+)'/g)].map((m) => m[1]);
}

/** 표기 차이를 흡수한다: 본문 `0.7[V]` ↔ 도해 `0.7V`, 열 제목에 단위가 있는 `841×1189`. */
// 대소문자를 접는다. `osha-scs` en 파일은 본문이 "Containment"인데 edge 라벨은 "containment"처럼
// 문장 위치에 따라 첫 글자가 달라진다 — 접지 않으면 영문 콘텐츠에서 C-8·C-2가 오탐을 낸다.
// 한국어에는 영향이 없다.
const normalize = (s) => s.replace(/[[\]\s,]/g, '').toLowerCase();

/** MDX를 도해 블록과 본문으로 가른다. */
function split(text) {
  const lines = text.split('\n');
  const open = new RegExp(`^<(${COMPONENTS.join('|')})\\b`);
  const blocks = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (!open.test(lines[i])) continue;
    let j = i;
    while (j < lines.length && lines[j].trim() !== '/>') j += 1;
    blocks.push({ start: i, end: j, text: lines.slice(i, j + 1).join('\n') });
    i = j;
  }
  const inBlock = new Set();
  for (const b of blocks) for (let k = b.start; k <= b.end; k += 1) inBlock.add(k);
  const body = lines.filter((_, k) => !inBlock.has(k)).join('\n');
  return { lines, blocks, body };
}

/** 도해 블록에서 사람이 읽는 문자열만 뽑는다 — 레이아웃 파라미터는 콘텐츠가 아니다. */
function contentStrings(blockText) {
  let s = blockText;
  for (const pat of [
    /height:\s*\d+/g, /emphasis=\{\[[^\]]*\]\}/g, /meters:\s*[\d.]+e-?\d+/g,
    /\bat:\s*\[\d+,\s*\d+\]/g, /value:\s*\d+/g, /idPrefix="[^"]*"/g,
  ]) s = s.replace(pat, '');
  return [...s.matchAll(/"([^"]*)"|'([^']*)'/g)].map((m) => m[1] ?? m[2]).join(' ');
}

/** 한글·아라비아 수사 → 숫자. caption의 "여덟 실습"·"8대 공정"을 읽는다. */
const KO_NUM = { 하나: 1, 둘: 2, 셋: 3, 넷: 4, 다섯: 5, 여섯: 6, 일곱: 7, 여덟: 8, 아홉: 9, 두: 2, 세: 3, 네: 4 };
const COUNT_UNIT = '단계|가지|개|종|계통|요소|실습|공정|얼굴|갈래|겹|기둥|축|범주|유형|방법|잣대|급수';
// `osha-scs` en 파일은 caption이 영문이다. 영문 수사를 안 보면 그 파일에서 C-7이 무력해진다 —
// W3 배치 B 직전에 발견했다. 검사가 한 언어만 보는 것은 그 언어 밖에서 "통과"를 뜻하지 않는다.
const EN_NUM = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
  seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
};
const EN_UNIT = 'steps?|types?|categories|kinds?|factors?|methods?|sections?|elements?'
  + '|levels?|phases?|stages?|components?|hazards?|ways?|routes?|classes|groups?|rules?';

function claimedCounts(text) {
  const out = new Set();
  for (const m of text.matchAll(new RegExp(String.raw`(\d+)\s*(?:${COUNT_UNIT})`, 'g'))) out.add(Number(m[1]));
  for (const [k, v] of Object.entries(KO_NUM)) {
    if (new RegExp(String.raw`${k}\s*(?:${COUNT_UNIT})`).test(text)) out.add(v);
  }
  const low = text.toLowerCase();
  for (const m of low.matchAll(new RegExp(String.raw`(\d+)\s+(?:${EN_UNIT})\b`, 'g'))) out.add(Number(m[1]));
  for (const [k, v] of Object.entries(EN_NUM)) {
    if (new RegExp(String.raw`\b${k}\s+(?:${EN_UNIT})\b`).test(low)) out.add(v);
  }
  return out;
}

/**
 * C-16용 — 배수 한국어 수사. KO_NUM을 재사용하고 거기 없는 '한'(1)·'열'(10)만 추가한다.
 * COUNT_UNIT에 '배'·'자릿수'가 없어 C-7 claimedCounts에는 영향이 없다.
 * '열' + 한 자리 수사로 11~19(열한~열아홉)도 구성한다 — 진공도 같은 공정 수치는 10자릿수를
 * 넘나들어 실제로 나온다(daegu-hs-process/equipment-parameters 등, W2에서 발견).
 * 길이 내림차순으로 정렬해야 한다 — 정렬하지 않으면 '열두'에서 '열'만 먼저 매치되고
 * '두'가 잘려 나간다(정규식 대안은 앞에서부터 시도해 첫 성공을 취한다).
 */
const KO_MULT = { ...KO_NUM, 한: 1, 열: 10 };
for (const [k, v] of Object.entries(KO_NUM)) {
  if (v >= 1 && v <= 9) KO_MULT[`열${k}`] = 10 + v;
}
const KO_MULT_ALT = Object.keys(KO_MULT).sort((a, b) => b.length - a.length).join('|');

/** C-16용 — 크기 비율·자릿수 주장의 단위. */
const RATIO_UNIT = '배|자릿수';
const RATIO_PATTERNS = [
  // 아라비아 숫자: 5배 · 5.75자릿수 · 76,000배 · 43만 배 · 1/5배(축소 분수)
  new RegExp(String.raw`(?:\d+\s*\/\s*)?[\d,]+(?:\.\d+)?\s*(?:만|억|천)?\s*(?:${RATIO_UNIT})`, 'g'),
  // 한국어 수사: 한 배 ~ 열아홉 자릿수. 앞에 한글이 오면(예 '열두'의 '두') 매치하지 않는다 —
  // 그러지 않으면 매 위치마다 가장 먼저 맞는 알터너티브를 쓰는 정규식 특성상 부분 매치가 생긴다.
  new RegExp(String.raw`(?<![가-힣])(?:${KO_MULT_ALT})\s*(?:${RATIO_UNIT})`, 'g'),
  // 분수: 3분의 1 · 100만 분의 1
  new RegExp(String.raw`[\d,]+(?:만|억|천)?\s*분의\s*[\d,]+`, 'g'),
  // 퍼센트 차: 12퍼센트 차이 · 12% 차
  new RegExp(String.raw`[\d.]+\s*(?:%|퍼센트)\s*차이?\b`, 'g'),
];

/** caption·note(top-level)="…"와 note·sub(항목별): '…'에서 원문 그대로 뽑는다(레이블 토큰화 없음). */
function ratioClaimTexts(blk) {
  const out = [];
  for (const m of blk.matchAll(/\b(?:caption|note)="([^"]*)"/g)) out.push(m[1]);
  for (const m of blk.matchAll(/\b(?:note|sub):\s*'([^']*)'/g)) out.push(m[1]);
  return out;
}

/** 한 문자열에서 크기 비율·자릿수 주장을 전부 뽑는다. '절반'은 수사가 없어 따로 추가한다. */
function ratioClaims(text) {
  const out = new Set();
  for (const re of RATIO_PATTERNS) {
    for (const m of text.matchAll(re)) out.add(m[0].trim());
  }
  if (text.includes('절반')) out.add('절반');
  return out;
}

/**
 * 주장이 본문에 있는가. C-12(부연 출처)처럼 낱말 단위로 닻을 찾지 않는다 — '자릿수'·'배'는
 * 본문에 흔해 낱말 단위 대조는 무의미하다(usage.md §2.1.1c). 주장 전체를 통째로 대조하고,
 * 한국어 수사 주장("다섯 자릿수")은 아라비아 등가형("5자릿수")도 함께 확인한다 — 본문은
 * 대개 숫자로 쓰지 수사로 풀어 쓰지 않는다("43만 배" 같은 예외는 등가형이 원문 그대로라
 * 첫 대조에서 이미 걸린다).
 */
function claimAnchored(claim, normBody) {
  if (normBody.includes(normalize(claim))) return true;
  const m = claim.match(new RegExp(`^(${KO_MULT_ALT})\\s*(${RATIO_UNIT})$`));
  if (m && KO_MULT[m[1]] !== undefined) {
    return normBody.includes(normalize(`${KO_MULT[m[1]]}${m[2]}`));
  }
  return false;
}

/** 최상위 배열 요소 수. 중첩(children)은 세지 않는다. */
function topLevelCount(blk, key) {
  const m = blk.match(new RegExp(String.raw`${key}=\{\[`));
  if (!m) return 0;
  let depth = 1, n = 0;
  for (const c of blk.slice(m.index + m[0].length)) {
    if (c === '[') depth += 1;
    else if (c === ']') { depth -= 1; if (depth === 0) break; }
    else if (c === '{' && depth === 1) n += 1;
  }
  return n;
}

/**
 * 도해가 열거하는 항목 수.
 * TreeBranch는 caption의 수량이 보통 **잎(children)** 을 가리키므로 잎 수와 가지 수를 모두 후보로 준다.
 * FlowSteps는 branch의 하위 steps도 후보에 넣는다(분기가 본 목록일 수 있다).
 */
function enumeratedCounts(blk) {
  const cands = new Set();
  const br = topLevelCount(blk, 'branches');
  if (br) {
    cands.add(br);
    const leaves = (blk.match(/\{\s*label:/g) ?? []).length - br;
    if (leaves > 0) cands.add(leaves);
  }
  for (const k of ['steps', 'columns', 'layers', 'events', 'marks', 'nodes']) {
    const n = topLevelCount(blk, k);
    if (n) cands.add(n);
  }
  // branch 안의 steps 개수도 후보
  for (const m of blk.matchAll(/steps:\s*\[/g)) {
    let depth = 1, n = 0;
    for (const c of blk.slice(m.index + m[0].length)) {
      if (c === '[') depth += 1;
      else if (c === ']') { depth -= 1; if (depth === 0) break; }
      else if (c === '{' && depth === 1) n += 1;
    }
    if (n) cands.add(n);
  }
  return cands;
}

/** 흔한 조사·어미를 떼어 본문 대조가 가능한 형태로 만든다. */
const PARTICLE = /(?:으로부터|에서부터|으로서|이라는|라는|으로|에서|까지|부터|처럼|보다|마다|만큼|와의|과의|의|를|을|이|가|은|는|에|로|와|과|도|만|랑|께|여|들)$/;
function stripParticle(w) {
  const s = w.replace(PARTICLE, '');
  return s.length >= 2 ? s : w;
}

/**
 * C-8 대조용 용어 토큰. label/title/name 같은 **내용 필드**에서만 뽑는다.
 * caption은 대상이 아니다 — caption은 독자를 위해 새로 쓰는 산문이므로 본문에 없는 표현이 정상이다.
 * 여기서 잡으려는 것은 "본문에 없는 절차·부품 이름을 도해가 만들어 넣는" 경우다(H11 보조선·교점, H14 요구 파악).
 */
const C8_SKIP = new Set([
  '단계', '방법', '종류', '구조', '기능', '역할', '특징', '방식', '경우', '위치', '상태', '결과',
  '사용', '가능', '필요', '확인', '적용', '진행', '발생', '이용', '동작', '작업', '공정', '장비',
  '전체', '내부', '외부', '상부', '하부', '이상', '이하', '이후', '이전', '기타', '이때', '먼저',
]);
/**
 * 라벨 단위 판정. 한 라벨의 토큰이 **하나도** 본문에 없을 때만 위반으로 본다.
 * 왜 토큰 단위가 아닌가: 라벨은 활용된 서술어를 쓴다("결합을 쪼갠다"). 토큰마다 대조하면
 * 어미 변화가 전부 오탐이 되어 검사가 무력해진다. 반면 **창작한 절차**는 본문에 닻이
 * 하나도 없고(H11 "보조선 긋기 → 교점 찾기"), 의역은 닻이 최소 하나 남는다. 그 차이를 본다.
 */
/** 본문에 닻이 있는가. 단위 접미사만 다른 경우(본문 `594×841` ↔ 도해 `594×841mm`)도 인정한다. */
function hasAnchor(toks, normBody) {
  return toks.some((w) => {
    if (normBody.includes(normalize(w))) return true;
    const bare = w.replace(new RegExp(`(?:${UNITS})$`), '');
    return bare !== w && bare.length >= 2 && normBody.includes(normalize(bare));
  });
}

function orphanLabels(blk, fields = 'label|title|name') {
  const out = [];
  for (const m of blk.matchAll(new RegExp(String.raw`(?:${fields}):\s*'([^']*)'`, 'g'))) {
    // `§2 참조` 같은 상호참조는 내용 주장이 아니다 — 검사 대상에서 뺀다.
    if (/^§[\d.~·\s]+참조$/.test(m[1].trim())) continue;
    // 활용된 서술어는 본문과 글자가 맞을 수 없으므로 대조 대상에서 뺀다("쪼갠다"·"식힌다"·"재는 것").
    // 남는 것이 **명사 닻**이다. 명사 닻이 없는 라벨은 C-8이 판단할 근거가 없으므로 건너뛴다.
    const toks = m[1].split(/[\s·,()\/→~\-–—:+]+/)
      .map((w) => w.replace(/[?!.①-⑳]+$/, '').replace(/^[①-⑳\s]+/, ''))
      .filter((w) => w.length >= 2 && !/^[\d.,%]+$/.test(w) && !C8_SKIP.has(w))
      .map((w) => (/[가-힣]/.test(w) ? stripParticle(w) : w))
      .filter((w) => !/[가-힣]/.test(w) || !/(?:다|것|서|고|며|면|자|듯|채|김|짐|힘)$/.test(w));
    if (toks.length) out.push({ label: m[1], toks });
  }
  return out;
}

/** 배치표 subject에서 대조 키워드를 뽑는다(C-1 주제 대조용). */
const SUBJ_SKIP = new Set(['도해', '단면', '구성', '분류', '순서', '흐름', '비교', '표', '및', '와', '과', 'vs']);
function subjectKeywords(subject) {
  return [...new Set(subject.split(/[\s·,()\/→~\-–—:+]+/)
    .map((w) => (/[가-힣]/.test(w) ? stripParticle(w) : w))
    .filter((w) => w.length >= 2 && !SUBJ_SKIP.has(w) && !/^[\d.,%]+$/.test(w)))];
}

/**
 * C-1 배치표 대조. 컴포넌트 타입만 맞추면 **다른 주제의 같은 컴포넌트**가 통과한다
 * (W2 Check의 G-4 0.5점 사유). 그래서 subject 키워드까지 본다.
 * 점수 기반 배정을 쓰는 이유: 같은 컴포넌트가 여럿일 때 앞선 배정이 뒤 배정의 도해를
 * 먼저 집어가면 멀쩡한 도해가 불일치로 잡힌다(thin-film CompareCards 2개가 그 사례).
 */
/**
 * C-10 미러 정합 — `{X}` ↔ `{X}.ko` 쌍.
 * 이 검사가 있는 이유: `osha-scs`는 en/ko 1:1 병렬 번역이라 도해를 양쪽에 넣기로 결정했고
 * (W3 Design §0.3), 그 결정이 "한쪽만 고침 · 라벨 번역 누락 · idPrefix 공유"라는 새 위험을
 * 만들었다. 위험을 만든 결정과 그것을 막는 검사를 같이 확정한다.
 */
function checkMirrors(shapes) {
  const issues = [];
  let pairs = 0;
  for (const [mod, shape] of shapes) {
    if (!mod.endsWith('.ko')) continue;
    const base = mod.slice(0, -3);
    const en = shapes.get(base);
    if (!en) { issues.push({ mod, check: 'C-10', detail: `짝이 되는 "${base}"가 없다` }); continue; }
    pairs += 1;
    if (en.used.join(',') !== shape.used.join(',')) {
      issues.push({ mod, check: 'C-10', detail: `미러 불일치 — en[${en.used.join(',')}] vs ko[${shape.used.join(',')}]` });
    }
    const dup = shape.prefixes.filter((x) => en.prefixes.includes(x));
    if (dup.length) {
      issues.push({ mod, check: 'C-10', detail: `idPrefix "${dup.join(', ')}"를 en과 공유한다 (토글 시 전역 id 충돌)` });
    }
  }
  return { issues, pairs };
}

function matchPlan(planEntries, used, blockTexts) {
  const issues = [];
  const want = planEntries.map((e) => (typeof e === 'string' ? { component: e, subject: '' } : e));
  const avail = used.map((k, i) => ({ kind: k, text: normalize(blockTexts[i] ?? ''), taken: false }));
  const pairs = [];
  want.forEach((w, wi) => {
    const kws = subjectKeywords(w.subject ?? '');
    avail.forEach((a, ai) => {
      if (a.kind !== w.component) return;
      const score = kws.filter((k) => a.text.includes(normalize(k))).length;
      if (score > 0) pairs.push({ wi, ai, score });
    });
  });
  pairs.sort((a, b) => b.score - a.score);
  const matched = new Set();
  for (const { wi, ai } of pairs) {
    if (matched.has(wi) || avail[ai].taken) continue;
    matched.add(wi); avail[ai].taken = true;
  }
  const missing = [];
  want.forEach((w, wi) => {
    if (matched.has(wi)) return;
    const free = avail.findIndex((a) => a.kind === w.component && !a.taken);
    if (free < 0) { missing.push(w.component + (w.subject ? ` (${w.subject})` : '')); return; }
    avail[free].taken = true;
    if (subjectKeywords(w.subject ?? '').length) {
      issues.push({ check: 'C-1', detail: `${w.component} 주제 불일치 — 배치표는 "${w.subject}"인데 도해에 그 말이 없다` });
    }
  });
  if (missing.length) issues.push({ check: 'C-1', detail: `배정 미이행: ${missing.join(', ')}` });
  return issues;
}

function checkModule(path, tones) {
  const text = readFileSync(path, 'utf8');
  const { lines, blocks, body } = split(text);
  const normBody = normalize(body);
  const issues = [];

  const used = [];
  for (const b of blocks) {
    const kind = b.text.match(new RegExp(`^<(${COMPONENTS.join('|')})`))[1];
    used.push(kind);

    // C-2 값 출처
    const txt = contentStrings(b.text);
    const nums = new Set(
      [...txt.matchAll(new RegExp(String.raw`\d[\d,]*(?:\.\d+)?\s*(?:${UNITS})?`, 'g'))]
        .map((m) => m[0].trim()).filter((n) => n.length > 1),
    );
    for (const n of nums) {
      if (normBody.includes(normalize(n))) continue;
      const bare = normalize(n.replace(new RegExp(`(?:${UNITS})$`), ''));
      if (bare && normBody.includes(bare)) continue;
      issues.push({ check: 'C-2', detail: `본문에 없는 수치 "${n}" (${kind})` });
    }

    // C-3 tone 유효성
    for (const m of b.text.matchAll(/tone:\s*'([^']+)'/g)) {
      if (!tones.includes(m[1])) issues.push({ check: 'C-3', detail: `없는 tone "${m[1]}"` });
    }

    // C-4 빈 줄 규약
    if (b.start > 0 && lines[b.start - 1].trim() !== '') {
      issues.push({ check: 'C-4', detail: `${kind} 앞에 빈 줄 없음 (L${b.start + 1})` });
    }
    if (b.end + 1 < lines.length && lines[b.end + 1].trim() !== '') {
      issues.push({ check: 'C-4', detail: `${kind} 뒤에 빈 줄 없음 (L${b.end + 2})` });
    }

    // C-15 표 무손상 — 블록 앞뒤가 모두 표 행이면 표를 둘로 갈랐다.
    // C-4(앞뒤 빈 줄)를 지켜도 표는 갈라진다 — 빈 줄이 곧 표의 끝이기 때문이다.
    // W4 배치 B에서 조사 출력이 `rows[:13]`으로 잘린 것을 전부라고 믿고 19행 표 중간에
    // 삽입했다. W2의 조용한 잘림 5건과 같은 뿌리다.
    {
      let a = b.start - 1;
      while (a >= 0 && lines[a].trim() === '') a -= 1;
      let z = b.end + 1;
      while (z < lines.length && lines[z].trim() === '') z += 1;
      // 뒤가 **새 표의 헤더**(다음 줄이 구분선)면 두 표 사이에 놓인 것이라 정상이다.
      const nextIsHeader = z + 1 < lines.length && /^\|[\s:|-]+\|/.test(lines[z + 1] ?? '');
      if (a >= 0 && z < lines.length && lines[a].startsWith('|') && lines[z].startsWith('|') && !nextIsHeader) {
        issues.push({ check: 'C-15', detail: `${kind}가 표를 둘로 갈랐다 (L${b.start + 1}) — 앞 "${lines[a].trim().slice(0, 24)}" 뒤 "${lines[z].trim().slice(0, 24)}"` });
      }
    }

    // C-5 idPrefix
    if (NEEDS_ID_PREFIX.includes(kind) && !/idPrefix="/.test(b.text)) {
      issues.push({ check: 'C-5', detail: `${kind}에 idPrefix 없음` });
    }

    // C-7 수량 일치 — caption/root가 "여덟 실습"이라 적었으면 실제로 여덟이어야 한다
    const capText = [...b.text.matchAll(/caption="([^"]*)"|root="([^"]*)"/g)]
      .map((m) => m[1] ?? m[2]).join(' ');
    const claimed = claimedCounts(capText);
    if (claimed.size) {
      const actual = enumeratedCounts(b.text);
      if (actual.size && ![...claimed].some((c) => actual.has(c))) {
        issues.push({
          check: 'C-7',
          detail: `${kind} 수량 불일치 — caption "${capText.slice(0, 40)}"은 ${[...claimed].join('/')}을 말하나 항목은 ${[...actual].join('/')}`,
        });
      }
    }

    // C-11 막대 값 출처 — ValueBars의 value는 **콘텐츠**다.
    // C-2는 문자열 리터럴만 보므로 숫자 필드를 놓친다. usage.md가 `value`를 '레이아웃
    // 파라미터'로 분류해 제외한 것이 그 구멍이었고, W2의 element-pneumatic-thermal
    // "중온 공정 400℃"가 정확히 그 틈으로 통과했다(C-8 라벨 검사가 뒤늦게 잡았다).
    if (kind === 'ValueBars') {
      const nums = [
        ...[...b.text.matchAll(/value:\s*(-?[\d.]+)/g)].map((m) => m[1]),
        ...[...b.text.matchAll(/range:\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)/g)].flatMap((m) => [m[1], m[2]]),
      ];
      for (const n of nums) {
        // 천 단위 쉼표 표기도 본문 형태로 인정한다(1500 ↔ 1,500).
        const comma = Number(n).toLocaleString('en-US');
        if (normBody.includes(normalize(n)) || normBody.includes(normalize(comma))) continue;
        issues.push({ check: 'C-11', detail: `본문에 없는 막대 값 "${n}" (${kind})` });
      }
    }

    // C-14 prop 계약 — 인터페이스에 없는 키는 렌더에서 조용히 버려진다.
    const allowed = PROP_FIELDS[kind];
    if (allowed) {
      for (const m of b.text.matchAll(/(?:^\s*|[{,]\s*)([A-Za-z_]\w*):\s*(?:'|"|-?\d|\[|\{|true|false)/gm)) {
        if (!allowed.has(m[1])) issues.push({ check: 'C-14', detail: `${kind}에 없는 prop "${m[1]}"` });
      }
      for (const m of b.text.matchAll(/^\s{2}(\w+)=/gm)) {
        if (!allowed.has(m[1])) issues.push({ check: 'C-14', detail: `${kind}에 없는 prop "${m[1]}"` });
      }
    }

    // C-9 참조 정합 — 노드를 지우면 edges가 유령 참조를 남긴다.
    // 이 검사를 넣은 이유: W2 Act에서 창작 노드 2개를 지웠을 때 edges가 그대로 남았고,
    // 스크립트가 아니라 **손으로 grep해서** 찾았다. 손으로 잡은 결함군은 반드시 다시 나온다.
    if (/nodes=\{/.test(b.text)) {
      const ids = new Set([...b.text.matchAll(/\{\s*id:\s*'([^']+)'/g)].map((m) => m[1]));
      for (const m of b.text.matchAll(/\b(from|to):\s*'([^']+)'/g)) {
        if (!ids.has(m[2])) issues.push({ check: 'C-9', detail: `edges가 없는 노드 "${m[2]}"를 가리킨다 (${kind})` });
      }
    }

    // C-8 용어 출처 — 본문에 닻이 하나도 없는 라벨은 도해가 만들어 넣은 것이다
    for (const { label, toks } of orphanLabels(b.text)) {
      if (hasAnchor(toks, normBody)) continue;
      issues.push({ check: 'C-8', detail: `본문에 없는 라벨 "${label}" (${kind}) — 어느 낱말도 본문에 없다` });
    }

    // C-12 부연 출처 — note/sub는 본문 문장을 풀어 쓰는 자리다. C-8은 label/title/name만 봤고
    // 그 사이로 `industry-trend`의 "모듈 평가와 연동 테스트"(본문은 "성능·신뢰성·안전성을
    // 시험해 품질을 확인한다")가 통과했다. 라벨과 달리 부연은 본문을 풀어 쓰므로 닻이 남는다 —
    // 315 인스턴스에서 오탐 0이었다. 그래서 C-8과 달리 예외 목록이 필요하지 않다.
    for (const { label, toks } of orphanLabels(b.text, 'note|sub')) {
      if (hasAnchor(toks, normBody)) continue;
      issues.push({ check: 'C-12', detail: `본문에 닻이 없는 부연 "${label}" (${kind})` });
    }

    // C-16 계산값 서술 — caption/note/sub의 크기 비율·자릿수 주장이 본문에 없으면 창작이다.
    // C-2는 아라비아 숫자만 보고, C-12는 낱말 단위로 닻을 찾아 '자릿수'·'배' 같은 흔한 낱말에
    // 걸린다 — 그 틈으로 "다섯 자릿수 차"(실제 log10(9000/0.016)=5.75, 본문 무기재)가
    // W4에서 손으로 잡힐 때까지 세 검사를 통과했다. 여기서는 수사를 숫자로 환산해
    // 주장 전체("5자릿수" 등)를 통째로 대조한다.
    for (const t of ratioClaimTexts(b.text)) {
      for (const claim of ratioClaims(t)) {
        if (claim === '절반') {
          if (!normBody.includes(normalize('절반'))) {
            issues.push({ check: 'C-16', detail: `본문에 없는 비율 주장 "${claim}" (${kind})` });
          }
          continue;
        }
        if (!claimAnchored(claim, normBody)) {
          issues.push({ check: 'C-16', detail: `본문에 없는 비율 주장 "${claim}" (${kind})` });
        }
      }
    }
  }

  // C-13 문단 무손상 — 문장 중간에 빈 줄이 끼면 한 문단이 두 <p>로 쪼개진다.
  // C-4는 블록 앞뒤 빈 줄만 보고, G-6(자수)은 삽입만 있으면 통과한다. 그 사이로
  // 이 결함이 세 웨이브 중 두 번 통과했다(W1 cmos-image-sensor · W3 industrial-safety).
  // 두 번째는 내가 첫 번째를 "고친" 직후 같은 파일에서 냈고, gap-detector가 잡았다.
  const inBlock = (i) => blocks.some((b) => i >= b.start && i <= b.end);
  // 볼드 수식(`**I = V / R [A]**`)·인라인 코드로 끝나는 줄도 문장 끝으로 본다.
  const PROSE_END = /(?:[.!?:;>|})"'\]—…]|\*\*|`)$/;
  let fence = false;
  for (let i = 1; i < lines.length - 1; i += 1) {
    if (lines[i].trimStart().startsWith('```')) { fence = !fence; continue; }
    if (fence) continue;
    if (lines[i].trim() !== '' || inBlock(i)) continue;
    const prev = lines[i - 1];
    let k = i + 1;
    while (k < lines.length && lines[k].trim() === '') k += 1;
    const next = lines[k] ?? '';
    if (!prev.trim() || inBlock(i - 1) || inBlock(k)) continue;
    // 산문이 아닌 줄 뒤의 빈 줄은 정상이다 — 제목·목록·표·인용·JSX·구분선.
    if (/^(?:#{1,6}\s|\s*[-*+]\s|\s*\d+\.\s|\||>|---|<|\s*\/>|\s*\}|\s*\]|:|```)/.test(prev)) continue;
    // 수식·흐름 줄은 자기 문단이다 — `선택비 S(A/B) = …`, `(공정) → TM → … → Loadlock`.
    if (/[=→÷≈≥≤±]/.test(prev)) continue;
    // 앞 줄이 문장으로 끝나지 않았고 뒤 줄이 산문이면 문단이 쪼개진 것이다.
    if (PROSE_END.test(prev.trim())) continue;
    if (!/^[가-힣A-Za-z(]/.test(next.trim())) continue;
    issues.push({ check: 'C-13', detail: `문단 중간 빈 줄 (L${i + 1}) — "${prev.trim().slice(-24)}" 뒤` });
  }

  // C-6 색 리터럴 (도해 블록 안에서만 — 본문 산문의 tailwind 클래스는 대상이 아니다)
  for (const b of blocks) {
    for (const m of b.text.matchAll(/(?:fill|stroke)-[a-z]+-\d{2,3}/g)) {
      issues.push({ check: 'C-6', detail: `색 리터럴 "${m[0]}" — tokens.ts를 경유할 것` });
    }
  }

  return {
    used,
    issues,
    blockTexts: blocks.map((b) => b.text),
    idPrefixes: [...text.matchAll(/idPrefix="([^"]+)"/g)].map((m) => m[1]),
  };
}

/**
 * 양성 대조군 — 의도적으로 틀린 입력에 각 검사가 실제로 실패를 내는지 확인한다.
 * 하나라도 놓치면 본 검사를 실행하지 않는다.
 */
function selfTest(tones) {
  // C-1 주제 대조 — 타입은 맞고 주제만 다른 입력에 반드시 걸려야 한다.
  const planCases = [
    {
      name: 'C-1 주제 불일치',
      plan: [{ component: 'TreeBranch', subject: '알람 계열' }],
      used: ['TreeBranch'],
      texts: ["<TreeBranch root='공급 조건' caption='기동 전 충족돼야 하는 것들' />"],
      expect: '주제 불일치',
    },
    {
      name: 'C-1 배정 미이행',
      plan: [{ component: 'NodeGraph', subject: 'RF 전력 계통' }],
      used: ['CompareCards'],
      texts: ['<CompareCards caption="RF 전력 계통" />'],
      expect: '배정 미이행',
    },
    {
      name: 'C-1 음성 대조군 (주제 일치)',
      plan: [{ component: 'TreeBranch', subject: '알람 계열' }],
      used: ['TreeBranch'],
      texts: ["<TreeBranch root='알람' caption='알람 계열 세 갈래' />"],
      expect: null,
    },
  ];
  // C-10 미러 정합 대조군 — W3 Design §4가 약속한 2건 + 음성.
  const mirrorCases = [
    {
      name: 'C-10 ko에 컴포넌트 누락',
      shapes: new Map([
        ['part-9', { used: ['TreeBranch', 'CompareCards'], prefixes: ['a'] }],
        ['part-9.ko', { used: ['TreeBranch'], prefixes: ['b'] }],
      ]),
      expect: '미러 불일치',
    },
    {
      name: 'C-10 idPrefix 공유',
      shapes: new Map([
        ['part-9', { used: ['NodeGraph'], prefixes: ['same'] }],
        ['part-9.ko', { used: ['NodeGraph'], prefixes: ['same'] }],
      ]),
      expect: 'idPrefix',
    },
    {
      name: 'C-10 음성 대조군 (정상 미러)',
      shapes: new Map([
        ['part-9', { used: ['NodeGraph', 'TreeBranch'], prefixes: ['en-x'] }],
        ['part-9.ko', { used: ['NodeGraph', 'TreeBranch'], prefixes: ['ko-x'] }],
      ]),
      expect: null,
    },
  ];
  let mirrorOk = true;
  for (const c of mirrorCases) {
    const { issues: got } = checkMirrors(c.shapes);
    const hit = c.expect === null ? got.length === 0 : got.some((i) => i.detail.includes(c.expect));
    console.log(`   ${hit ? '✅ 통과' : '❌ 실패'}  ${c.name}`);
    if (!hit) mirrorOk = false;
  }
  if (!mirrorOk) return false;

  let planOk = true;
  for (const c of planCases) {
    const got = matchPlan(c.plan, c.used, c.texts);
    const hit = c.expect === null ? got.length === 0 : got.some((i) => i.detail.includes(c.expect));
    console.log(`   ${hit ? '✅ 통과' : '❌ 실패'}  ${c.name}`);
    if (!hit) planOk = false;
  }
  if (!planOk) return false;

  const cases = [
    {
      name: 'C-2 타 모듈 값 이동',
      mdx: '본문에는 100 만 있다.\n\n<CompareCards\n  caption="x"\n  rows={[{ aspect: "a", values: ["436nm"] }]}\n/>\n',
      expect: 'C-2',
    },
    {
      name: 'C-3 없는 tone',
      mdx: '본문.\n\n<LayerStack\n  idPrefix="t"\n  layers={[{ id: "a", label: "a", tone: \'nitride\' }]}\n/>\n',
      expect: 'C-3',
    },
    {
      name: 'C-4 뒤 빈 줄 누락',
      mdx: '본문.\n\n<TreeBranch\n  root="a"\n/>\n바로 이어지는 문단.\n',
      expect: 'C-4',
    },
    {
      name: 'C-5 idPrefix 누락',
      mdx: '본문.\n\n<NodeGraph\n  nodes={[]}\n/>\n',
      expect: 'C-5',
    },
    {
      name: 'C-7 수량 불일치',
      mdx: '본문.\n\n<FlowSteps\n  caption="여덟 단계로 진행"\n  steps={[{ id: \'a\' }, { id: \'b\' }]}\n/>\n',
      expect: 'C-7',
    },
    {
      name: 'C-7 영문 수량 불일치',
      mdx: 'Body text.\n\n<FlowSteps\n  caption="Five steps to control"\n  steps={[{ id: \'a\' }, { id: \'b\' }]}\n/>\n',
      expect: 'C-7',
    },
    {
      name: 'C-15 표 가름',
      mdx: '| 가 | 나 |\n|---|---|\n| 1 | 2 |\n\n<TreeBranch\n  root="a"\n/>\n\n| 3 | 4 |\n',
      expect: 'C-15',
    },
    {
      name: 'C-14 없는 prop',
      mdx: "본문.\n\n<Timeline\n  events={[{ year: '1986', label: '선폭', tone: 'accent' }]}\n/>\n",
      expect: 'C-14',
    },
    {
      name: 'C-13 문단 쪼갬',
      mdx: '앞 문장이 이어지는데\n\n중간에서 끊겼다.\n\n<TreeBranch\n  root="a"\n/>\n',
      expect: 'C-13',
    },
    {
      name: 'C-12 창작 부연',
      mdx: "본문은 성능·신뢰성·안전성을 시험한다고 적었다.\n\n<TreeBranch\n  root='개발'\n  branches={[{ label: '검증', note: '모듈 평가와 연동 테스트' }]}\n/>\n",
      expect: 'C-12',
    },
    {
      name: 'C-11 창작 막대 값',
      mdx: '본문에는 25 와 1200 만 있다.\n\n<ValueBars\n  unit="℃"\n  rows={[{ label: \'상온\', value: 25 }, { label: \'중온\', value: 400 }]}\n/>\n',
      expect: 'C-11',
    },
    {
      name: 'C-9 유령 참조',
      mdx: "본문.\n\n<NodeGraph\n  idPrefix=\"t\"\n  nodes={[{ id: 'a', label: '가' }]}\n  edges={[{ from: 'a', to: 'ghost' }]}\n/>\n",
      expect: 'C-9',
    },
    {
      name: 'C-8 창작 라벨',
      mdx: "본문은 평면과 곡면만 말한다.\n\n<FlowSteps\n  steps={[{ id: 'a', label: '보조선 긋기' }]}\n/>\n",
      expect: 'C-8',
    },
    {
      name: 'C-6 색 리터럴',
      mdx: '본문.\n\n<LayerStack\n  idPrefix="t"\n  note="fill-rose-100 을 직접 씀"\n/>\n',
      expect: 'C-6',
    },
    {
      name: 'C-16 본문에 없는 자릿수 주장(한국어 수사)',
      mdx: '본문에는 0.016과 9000이 있다.\n\n<ValueBars\n  caption="아르신과 이산화탄소는 다섯 자릿수 차다"\n  unit="mg/m³"\n  rows={[{ label: \'a\', value: 0.016 }, { label: \'b\', value: 9000 }]}\n/>\n',
      expect: 'C-16',
    },
    {
      name: 'C-16 본문에 없는 배수 주장(아라비아 숫자)',
      mdx: '본문에는 60과 5가 있다.\n\n<TreeBranch\n  root="비교"\n  note="a는 b보다 12배 크다"\n/>\n',
      expect: 'C-16',
    },
  ];

  const tmp = join(process.env.TMPDIR ?? '/tmp', `dgm-selftest-${process.pid}.mdx`);
  let ok = true;
  console.log('★ 양성 대조군 (의도적 오류 주입)');
  for (const c of cases) {
    writeFileSync(tmp, c.mdx);
    const { issues } = checkModule(tmp, tones);
    const caught = issues.some((i) => i.check === c.expect);
    console.log(`   ${caught ? '✅ 검출' : '❌ 놓침'}  ${c.name}`);
    if (!caught) ok = false;
  }
  unlinkSync(tmp);

  // 음성 대조군 — 정상 입력에 거짓 경보를 내지 않는가
  writeFileSync(tmp, '본문에 436nm 가 있다.\n\n<LayerStack\n  idPrefix="ok"\n  layers={[{ id: "a", label: "436nm", tone: \'oxide\' }]}\n/>\n');
  const clean = checkModule(tmp, tones).issues;
  console.log(`   ${clean.length === 0 ? '✅ 통과' : '❌ 거짓 경보'}  음성 대조군 (정상 입력)`);
  if (clean.length) { ok = false; console.log(`      ${JSON.stringify(clean)}`); }
  unlinkSync(tmp);

  // C-16 음성 대조군 — 비율 주장이 본문에 그대로 있으면 거짓 경보를 내지 않는가
  writeFileSync(tmp, '본문에 100배 차이가 있다고 적혀 있다.\n\n<ValueBars\n  caption="100배 차이"\n  unit="V"\n  rows={[{ label: \'a\', value: 1 }, { label: \'b\', value: 100 }]}\n/>\n');
  const cleanRatio = checkModule(tmp, tones).issues;
  console.log(`   ${cleanRatio.length === 0 ? '✅ 통과' : '❌ 거짓 경보'}  C-16 음성 대조군 (본문에 있는 배수 주장)`);
  if (cleanRatio.length) { ok = false; console.log(`      ${JSON.stringify(cleanRatio)}`); }
  unlinkSync(tmp);
  return ok;
}

// ── main ──────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const waveArg = (argv.find((a) => a.startsWith('--wave')) ?? '').split('=')[1]
  ?? (argv.includes('--wave') ? argv[argv.indexOf('--wave') + 1] : null);
const planArg = (argv.find((a) => a.startsWith('--plan')) ?? '').split('=')[1]
  ?? (argv.includes('--plan') ? argv[argv.indexOf('--plan') + 1] : null);

const tones = readTones();
const PROP_FIELDS = readPropFields();
console.log(`tokens.ts Tone ${tones.length}종 로드\n`);

if (!selfTest(tones)) {
  console.error('\n❌ 자기 검사 실패 — 스크립트가 오류를 놓친다. 본 검사를 실행하지 않는다.');
  process.exit(2);
}
console.log('');
if (argv.includes('--self-test')) process.exit(0);

// 위치 인자(`w1`)도 받는다. 이유: `--wave w1`을 잊고 `w1`만 주면 예전에는 **조용히 전 웨이브**를
// 훑어 W3 미착수 모듈이 위반으로 쏟아졌다. 범위가 말없이 바뀌는 것이 이 사이클의 대표 실패다.
const positional = argv.find((a) => WAVES[a]);
const wave = waveArg || positional || '';
const bogus = argv.find((a) => !a.startsWith('--') && !WAVES[a] && !existsSync(a));
if (bogus) {
  console.error(`❌ 알 수 없는 인자 "${bogus}" — 웨이브는 ${Object.keys(WAVES).join('·')} 중 하나`);
  process.exit(2);
}
const sources = wave ? WAVES[wave] : Object.values(WAVES).flat();
console.log(wave ? `범위: ${wave} (${sources.length}개 자료원)` : `범위: 전 웨이브 (${sources.length}개 자료원)`);
if (waveArg && !WAVES[waveArg]) {
  console.error(`❌ 알 수 없는 웨이브 "${waveArg}" — ${Object.keys(WAVES).join('·')} 중 하나`);
  process.exit(2);
}

const plan = planArg && existsSync(planArg) ? JSON.parse(readFileSync(planArg, 'utf8')) : null;
/**
 * 검토 완료 예외 (C-1 주제 · C-7 수량 · C-8 용어 · C-11 막대 값 · C-16 비율 주장 공용).
 * 키 형식: "모듈::검사::식별자"  값: **이유 문장**.
 * 등재에는 반드시 이유가 붙는다 — 이유 없이 넣으면 검사가 무력해진다.
 * C-1·C-8은 이 프로젝트의 요구사항(3단 레이어 Easy — 평이한 말로 다시 쓰기) 때문에
 * 구조적으로 오탐이 생긴다. C-16은 축 정의를 설명하는 상투구("로그 축 — 한 칸이 열 배")처럼
 * 데이터 간 비교가 아닌 경우에만 등재한다(ValueBars.tsx가 scale="log"일 때 같은 취지의
 * 문구를 자동 렌더한다 — 확인된 사실. §102행). 그래서 '실패'가 아니라 '검토 대기'로 두고
 * 한 번 사람이 판정한다.
 */
const ALLOW = existsSync(ALLOW_PATH) ? JSON.parse(readFileSync(ALLOW_PATH, 'utf8')) : {};
const selective = plan?._coverage === 'selective';
if (!plan) console.log('⚠ 배치표(--plan)가 없어 C-1(미이행 대조)을 건너뛴다.\n');
if (selective) console.log('범위 판정: 선별(selective) — 배치표에 없는 모듈의 도해 0개는 정상\n');

let total = 0;
let mainTotal = 0;
let c7Reviewed = 0;
const allIssues = [];
const prefixSeen = new Map();
/** C-10용 — 모듈별 컴포넌트 순서와 idPrefix. 미러 비교는 파일 쌍 단위라 루프 밖에서 한다. */
const modShape = new Map();
/** 컴포넌트별 주/보조 집계 — 문서에 적을 수치의 단일 출처. */
const compTally = Object.fromEntries(COMPONENTS.map((c) => [c, { main: 0, aux: 0, total: 0 }]));

for (const src of sources) {
  // `이름@경로` 형식이면 그 경로를 쓴다(W4 `chapters@src/content/chapters`).
  const [srcName, srcPath] = src.includes('@') ? src.split('@') : [src, join(SRC, src)];
  const dir = srcPath;
  if (!existsSync(dir)) { console.log(`⚠ 없는 자료원: ${srcName}`); continue; }
  const files = readdirSync(dir).filter((f) => f.endsWith('.mdx')).sort();
  let sub = 0;
  for (const f of files) {
    const mod = f.replace(/\.mdx$/, '');
    const { used, issues, idPrefixes, blockTexts } = checkModule(join(dir, f), tones);
    sub += used.length;
    used.forEach((k, i) => {
      compTally[k].total += 1;
      if (i === 0) { compTally[k].main += 1; mainTotal += 1; } else compTally[k].aux += 1;
    });
    for (const p of idPrefixes) {
      if (prefixSeen.has(p)) issues.push({ check: 'C-5', detail: `idPrefix "${p}" 중복 (${prefixSeen.get(p)})` });
      else prefixSeen.set(p, mod);
    }
    // 선별 웨이브(W4)는 도해 0개인 모듈이 정상이다 — 배치표에 있는 모듈만 본다.
    if (used.length === 0 && !selective) {
      issues.push({ check: 'C-1', detail: '주 도해 없음 (전수 커버리지 위반)' });
    }
    if (plan?.[mod]) {
      issues.push(...matchPlan(plan[mod], used, blockTexts));
    }
    const reviewed = [];
    for (let k = issues.length - 1; k >= 0; k -= 1) {
      const { check, detail } = issues[k];
      if (!['C-1', 'C-7', 'C-8', 'C-11', 'C-16'].includes(check)) continue;
      const q = detail.match(/"([^"]+)"/);
      const keys = [`${srcName}/${mod}::${check}::${q ? q[1] : ''}`, `${srcName}/${mod}::${detail.split(' ')[0]}`];
      if (keys.some((key) => ALLOW[key])) reviewed.push(issues.splice(k, 1)[0]);
    }
    if (reviewed.length) c7Reviewed += reviewed.length;
    modShape.set(mod, { used: [...used], prefixes: [...idPrefixes] });
    for (const i of issues) allIssues.push({ mod, ...i });
  }
  console.log(`  ${srcName.padEnd(26)} 모듈 ${String(files.length).padStart(2)}  인스턴스 ${String(sub).padStart(3)}`);
  total += sub;
}

// C-10 미러 정합 — `{X}` ↔ `{X}.ko` 쌍.
// 이 검사가 있는 이유: osha-scs는 en/ko 1:1 병렬 번역이라 도해를 양쪽에 넣기로 결정했고(W3 Design §0.3),
// 그 결정이 "한쪽만 고침"이라는 새 위험을 만들었다. 결정과 함께 막는다.
const { issues: mirrorIssues, pairs: mirrorPairs } = checkMirrors(modShape);
allIssues.push(...mirrorIssues);

console.log(`\n총 인스턴스 ${total} · idPrefix ${prefixSeen.size}개(중복 0 기대)`);
if (mirrorPairs) console.log(`미러 쌍 ${mirrorPairs}개 대조 (C-10)`);
if (c7Reviewed) console.log(`검토 완료 예외 ${c7Reviewed}건 (근거: ${ALLOW_PATH})`);

// 컴포넌트 분포를 **구현에서** 출력한다.
// 이유: 이 확대에서 손으로 옮긴 집계가 세 번 틀렸다(W1 보조 미이행 7건 누락 · W2 §2.6 계획 157
// vs 실제 146 · W2 분포표가 대체 반영 전 값). 문서에 적는 수치는 배치표가 아니라 이 출력을 옮긴다.
console.log('\n컴포넌트 분포 (구현 실측 — 문서에 적을 값)');
const order = Object.entries(compTally).sort((a, b) => b[1].total - a[1].total);
for (const [k, v] of order) {
  if (!v.total) continue;
  console.log(`  ${k.padEnd(16)} 주 ${String(v.main).padStart(2)} · 보조 ${String(v.aux).padStart(2)} · 계 ${String(v.total).padStart(3)}`);
}
const unused = COMPONENTS.filter((c) => !compTally[c]?.total);
if (unused.length) console.log(`  미사용: ${unused.join(' · ')}`);
console.log(`  ${'계'.padEnd(16)} 주 ${mainTotal} · 보조 ${total - mainTotal} · 계 ${total}`);
const byCheck = allIssues.reduce((a, i) => ((a[i.check] = (a[i.check] ?? 0) + 1), a), {});
if (allIssues.length === 0) {
  console.log('\n✅ 전 항목 통과');
  process.exit(0);
}
console.log(`\n❌ 위반 ${allIssues.length}건  ${JSON.stringify(byCheck)}\n`);
for (const i of allIssues) console.log(`  [${i.check}] ${i.mod}: ${i.detail}`);
process.exit(1);
