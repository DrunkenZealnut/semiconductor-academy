#!/usr/bin/env python3
"""NCS 모듈 MDX 구조 검증 — 저장소 루트에서 실행.

사용: python3 scripts/ncs/validate-ncs-mdx.py src/content/sources/ncs-semi/*.mdx

스펙: docs/02-design/features/ncs-semiconductor-dev-track.spec.md (구조)
    + docs/02-design/features/ncs-image-expansion.design.md §6.1 (ImageFigure 확장)
"""
import re
import sys
from pathlib import Path

ALLOWED_TERMS = {
    "semiconductor", "wafer", "photoresist", "cleanroom", "ingot", "doping",
    "plasma", "mask", "etching", "deposition", "cmp", "precautionary-principle",
    "msds", "iarc-1", "emf",
}
FORBIDDEN_COMPONENTS = ["ProcessDiagram", "ChemicalCard", "<img", "![", "LanguageToggle"]
BLOCK_COMPONENTS = ["SourceQuote", "Callout", "LayeredExplain", "ImageFigure"]
FOOTER_V1 = "원문 도표·사진은 싣지 않았습니다"
FOOTER_V2 = "원문 도판 일부를 출처 표기와 함께 실었습니다"
IMAGEFIGURE_PAT = re.compile(r"<ImageFigure\b(.*?)/>", re.S)
PROP_PAT = re.compile(r'(\w+)="([^"]*)"')
MAX_FIGURES = 6


def validate(path):
    src = open(path, encoding="utf-8").read()
    lines = src.split("\n")
    errors, warns = [], []

    if not src.lstrip().startswith("<LayeredExplain"):
        errors.append("LayeredExplain으로 시작하지 않음")
    if "출처: NCS 학습모듈 「" not in src:
        errors.append("하단 출처 표기 없음")
    if "교육부·한국산업인력공단" not in src:
        errors.append("출처 기관 표기 없음")
    if not re.search(r"\(LM\d{10}", src):
        errors.append("LM 코드 없음")

    for comp in FORBIDDEN_COMPONENTS:
        if comp in src:
            errors.append(f"금지 요소 사용: {comp}")

    for tid in re.findall(r'<Term id="([^"]+)"', src):
        if tid not in ALLOWED_TERMS:
            errors.append(f"존재하지 않는 Term id: {tid}")

    for order in re.findall(r"<ChapterRef order=\{(\d+)\}", src):
        if not 1 <= int(order) <= 17:
            errors.append(f"ChapterRef order 범위 밖: {order}")

    # ImageFigure — 도판 규격 (design §1.4)
    figures = IMAGEFIGURE_PAT.findall(src)
    if len(figures) > MAX_FIGURES:
        errors.append(f"ImageFigure {len(figures)}개 — 모듈당 최대 {MAX_FIGURES}")
    for raw in figures:
        props = dict(PROP_PAT.findall(raw))
        fsrc, alt, source = props.get("src", ""), props.get("alt", ""), props.get("source", "")
        if not fsrc.startswith("/source-images/ncs/"):
            errors.append(f"ImageFigure src 경로 규약 위반: {fsrc}")
        elif not Path("public" + fsrc).is_file():
            errors.append(f"ImageFigure 이미지 파일 없음: public{fsrc}")
        if not alt:
            errors.append(f"ImageFigure alt 누락: {fsrc}")
        elif re.search(r"그림\s*\d", alt):
            errors.append(f"ImageFigure alt에 그림 번호 — 내용 서술로: {alt}")
        elif len(alt) < 8:
            warns.append(f"ImageFigure alt가 짧음({len(alt)}자): {alt}")
        if "NCS 학습모듈" not in source:
            errors.append(f"ImageFigure source에 NCS 출처 표기 없음: {fsrc}")

    # 푸터 버전 정합 (이미지 유무와 문구 일치)
    if figures and FOOTER_V1 in src:
        errors.append("이미지 포함 모듈에 푸터 v1 잔존 — v2로 교체 필요")
    if figures and FOOTER_V2 not in src:
        errors.append("이미지 포함 모듈에 푸터 v2 문구 없음")
    if not figures and FOOTER_V1 not in src and FOOTER_V2 not in src:
        errors.append("푸터 도판 문구(v1/v2) 없음")

    # hydration 1: 여러 줄 출처 각주가 <p>로 감싸였는지 (출처 각주는 div 통일)
    for i, ln in enumerate(lines, 1):
        if re.search(r'<p className="text-xs[^"]*"\s*>?\s*출처', ln):
            errors.append(f"L{i}: 출처 각주가 <p> — <div>로 교체 필요")

    # hydration 2: 블록 컴포넌트가 본문 텍스트와 같은 줄
    for i, ln in enumerate(lines, 1):
        stripped = ln.strip()
        for comp in BLOCK_COMPONENTS:
            idx = stripped.find(f"<{comp}")
            if idx > 0:
                before = stripped[:idx].strip()
                if before and not before.startswith("<"):
                    errors.append(f"L{i}: 블록 컴포넌트 {comp}가 텍스트와 같은 줄")
        if stripped.startswith("<SourceQuote") or stripped.startswith("<Callout"):
            if i >= 2 and lines[i - 2].strip() != "":
                warns.append(f"L{i}: {stripped.split()[0]} 앞에 빈 줄 없음")

    n_lines = len(lines)
    if not 150 <= n_lines <= 260:
        warns.append(f"분량 {n_lines}줄 (목표 170∼215 + 도판)")

    h2 = re.findall(r"^## (.+)$", src, re.M)
    sq = len(re.findall(r"<SourceQuote", src))
    print(f"=== {Path(path).name} ({n_lines}줄, h2={len(h2)}, SourceQuote={sq}, "
          f"ImageFigure={len(figures)})")
    for e in errors:
        print(f"  ERROR: {e}")
    for w in warns:
        print(f"  warn:  {w}")
    if not errors and not warns:
        print("  OK")
    return len(errors)


if __name__ == "__main__":
    total = sum(validate(p) for p in sys.argv[1:])
    sys.exit(1 if total else 0)
