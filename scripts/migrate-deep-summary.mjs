// 일회용 코드모드: textbook 재서술 106개 파일의 deep.quote → deep.summary 개명 +
// sourceSection의 (재서술) 마커 제거. 재실행하면 대상 0개(idempotent).
// (이미 106개 전부에 적용·검증 완료 — 212줄 변경 = 106×2. 이 스크립트는 이력 기록.)
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
