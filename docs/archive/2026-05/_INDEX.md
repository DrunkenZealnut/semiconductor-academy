# Archive Index — 2026-05

| Feature | Archived | Match Rate | Iter | 시간 | Note |
|---------|:--------:|:---:|:---:|:---:|------|
| [ch3-to-ch17-batch](./ch3-to-ch17-batch/) | 2026-05-29 | 96% | 0 | ~8.5h | 17 챕터 책 완주 milestone |
| [homepage-book-centric](./homepage-book-centric/) | 2026-05-29 | 97% | 0 | ~50m | 메인 책 정체성 IA 재편 (BookHero / BookTOCPreview / SpecialSection) |
| [source-quote-expansion](./source-quote-expansion/) | 2026-05-30 | 98% | 0 | ~1d | 학술 원본 인용 강화 — 17챕터 LayeredExplain quote + SourceQuote 28→74 + 의역 26개 책 원문 교체 + 열거 구조 46개 완결, placeholder 0건 |
| [source-quote-index](./source-quote-index/) | 2026-05-30 | 100% | 0 | ~2.5h | 인용 인덱스 페이지 — 91개 인용 자동 추출(scripts/extract-quotes.mjs) + /quotes fuse.js 검색 + Header 진입점, AC 9/9 |
| [multi-source-learning-platform](./multi-source-learning-platform/) | 2026-05-30 | 96% | 0 | ~3h | 다중 자료원 학습 플랫폼 재편 (Phase A+B) — Source 1급 객체 + OSHA SCS 5 Part(1A/1B/2/3/4) 통합, 4 컴포넌트 + 2 신규 라우트, 17 챕터 URL 100% 호환. Phase C(cross-link)는 별 cycle 분리 |

---

## 기록 정책

- `--summary` 옵션 사용 시: `.bkit/state/pdca-status.json`에 가벼운 summary 보존 (phase·matchRate·시점·archivedTo)
- Plan/Design/Analysis/Report 문서는 `docs/archive/YYYY-MM/{feature}/` 폴더로 이동
- batch parent의 sub-batch들은 별도 archive 가능 (또는 활성 docs 유지)
