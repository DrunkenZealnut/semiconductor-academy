#!/usr/bin/env python3
"""NCS 원본 md(marker 변환본)에서 도판 후보를 추출한다.

사용: python3 scripts/ncs/extract-figures.py <원본.md> <module-id> --out <디렉터리>

출력: {out}/{module-id}.json — [{file, page, caption, context, flags[]}]
flags:
  third_party     — 제3자 출처 표기 징후 (저작권 제외 후보)
  self_attributed — NCS 자체 저작 표기(집필진 제작·교육부 자기 인용) — 사용 가능
  boilerplate     — 표지·NCS 활용 안내 구간 (page <= 8)
  photo           — 실사 사진(파일명 Picture) — 개념도 대비 보수 취급
설계: docs/02-design/features/ncs-image-expansion.design.md §1.1
(출처 표기가 있어도 저작 주체가 집필진·교육부·직업능력개발원·산업인력공단이면 국가 저작 — 사용 가능)
"""
import json
import re
import sys
from pathlib import Path

ATTRIB_PAT = re.compile(r"출처|자료\s*[::]|제공|Source\s*:|ⓒ|©")
SELF_PAT = re.compile(r"집필진|교육부|한국직업능력개발원|한국산업인력공단|산업인력공단")
IMG_PAT = re.compile(r"!\[[^\]]*\]\(([^)]+\.jpe?g)\)", re.I)
CAPTION_PAT = re.compile(r"[\[〈<]\s*그림[^\]〉>]*[\]〉>]\s*\S.*")
PAGE_PAT = re.compile(r"<!--\s*page:\s*(\d+)\s*-->")
BOILERPLATE_MAX_PAGE = 8
CONTEXT_SPAN = 3


def extract(md_path: Path, module_id: str) -> list[dict]:
    lines = md_path.read_text(encoding="utf-8").split("\n")
    page = 0
    out = []
    for i, ln in enumerate(lines):
        pm = PAGE_PAT.search(ln)
        if pm:
            page = int(pm.group(1))
            continue
        im = IMG_PAT.search(ln)
        if not im:
            continue
        lo, hi = max(0, i - CONTEXT_SPAN), min(len(lines), i + CONTEXT_SPAN + 1)
        context = [l.strip() for l in lines[lo:hi] if l.strip() and not IMG_PAT.search(l)]
        caption = next((c.group(0) for l in context if (c := CAPTION_PAT.search(l))), "")
        flags = []
        if page <= BOILERPLATE_MAX_PAGE:
            flags.append("boilerplate")
        attributed = [l for l in [caption, *context] if ATTRIB_PAT.search(l)]
        if attributed:
            if all(SELF_PAT.search(l) for l in attributed):
                flags.append("self_attributed")
            else:
                flags.append("third_party")
        if "Picture" in im.group(1):
            flags.append("photo")
        out.append({
            "file": im.group(1),
            "page": page,
            "line": i + 1,
            "caption": caption,
            "context": context,
            "flags": flags,
        })
    return out


def main() -> None:
    if len(sys.argv) < 5 or sys.argv[3] != "--out":
        sys.exit(__doc__)
    md_path, module_id, out_dir = Path(sys.argv[1]), sys.argv[2], Path(sys.argv[4])
    out_dir.mkdir(parents=True, exist_ok=True)
    figures = extract(md_path, module_id)
    clean = [f for f in figures if not f["flags"]]
    out_file = out_dir / f"{module_id}.json"
    out_file.write_text(
        json.dumps({"module": module_id, "source": str(md_path), "figures": figures},
                   ensure_ascii=False, indent=1),
        encoding="utf-8",
    )
    print(f"{module_id}: 도판 {len(figures)}건 (무플래그 {len(clean)}건, "
          f"third_party {sum(1 for f in figures if 'third_party' in f['flags'])}건, "
          f"boilerplate {sum(1 for f in figures if 'boilerplate' in f['flags'])}건, "
          f"photo {sum(1 for f in figures if 'photo' in f['flags'])}건) → {out_file}")


if __name__ == "__main__":
    main()
