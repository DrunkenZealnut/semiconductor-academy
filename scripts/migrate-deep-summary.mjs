// 일회용 코드모드: textbook 재서술 106개 파일의 deep.quote → deep.summary 개명 +
// sourceSection의 (재서술) 마커 제거. 재실행하면 대상 0개(idempotent).
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

// `|| true` — grep은 매치 0건일 때 exit 1이라, 재실행(idempotent) 시 throw 방지.
const files = execSync("grep -rl '재서술' src/content/sources || true", { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean);

let changed = 0;
for (const f of files) {
  const orig = readFileSync(f, 'utf8');
  let s = orig;
  // 1) deep 블록의 인용 필드만: `quote: (` → `summary: (`  (콜론+여는괄호로 한정)
  s = s.replace(/(\n[ \t]*)quote:([ \t]*\()/g, '$1summary:$2');
  // 2) sourceSection의 (재서술) 마커 제거
  s = s.replace(/ \(재서술\)'/g, "'"); // 접미형 (102)
  s = s.replace(/, 재서술\)'/g, ")'"); // embedded형 (4)
  if (s !== orig) {
    writeFileSync(f, s, 'utf8');
    changed++;
  }
}
console.log(`scanned: ${files.length}, changed: ${changed}`);
