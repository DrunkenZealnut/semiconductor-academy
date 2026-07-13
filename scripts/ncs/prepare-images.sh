#!/bin/zsh
# NCS 선정 도판을 리사이즈·압축해 public/source-images/ncs/{module-id}/로 복사한다.
# 사용: scripts/ncs/prepare-images.sh <module-id> <원본-이미지-디렉터리> <파일명>...
# 규격: 최대변 1200px, jpeg 품질 70(200KB 초과 시 55 재시도) — design §1.3
set -euo pipefail

module_id="$1"; src_dir="$2"; shift 2
dest="public/source-images/ncs/${module_id}"
mkdir -p "$dest"
budget_kb=200

for name in "$@"; do
  in="${src_dir}/${name}"
  out="${dest}/${name}"
  if [[ ! -f "$in" ]]; then
    echo "ERROR: 원본 없음 — $in" >&2; exit 1
  fi
  sips -Z 1200 -s format jpeg -s formatOptions 70 "$in" --out "$out" >/dev/null
  kb=$(( $(stat -f %z "$out") / 1024 ))
  if (( kb > budget_kb )); then
    sips -Z 1200 -s format jpeg -s formatOptions 55 "$in" --out "$out" >/dev/null
    kb=$(( $(stat -f %z "$out") / 1024 ))
  fi
  if (( kb > budget_kb )); then
    echo "WARN: ${name} ${kb}KB — 예산(${budget_kb}KB) 초과, 제외 검토 필요" >&2
  fi
  echo "  ${name} → ${kb}KB"
done

echo "-- ${module_id}: $(du -sh "$dest" | cut -f1) / 전체 ncs: $(du -sh public/source-images/ncs | cut -f1)"
