# Archive Index — 2026-05

| Feature | Archived | Match Rate | Iter | 시간 | Note |
|---------|:--------:|:---:|:---:|:---:|------|
| [ch3-to-ch17-batch](./ch3-to-ch17-batch/) | 2026-05-29 | 96% | 0 | ~8.5h | 17 챕터 책 완주 milestone |
| [homepage-book-centric](./homepage-book-centric/) | 2026-05-29 | 97% | 0 | ~50m | 메인 책 정체성 IA 재편 (BookHero / BookTOCPreview / SpecialSection) |
| [source-quote-expansion](./source-quote-expansion/) | 2026-05-30 | 98% | 0 | ~1d | 학술 원본 인용 강화 — 17챕터 LayeredExplain quote + SourceQuote 28→74 + 의역 26개 책 원문 교체 + 열거 구조 46개 완결, placeholder 0건 |
| [source-quote-index](./source-quote-index/) | 2026-05-30 | 100% | 0 | ~2.5h | 인용 인덱스 페이지 — 91개 인용 자동 추출(scripts/extract-quotes.mjs) + /quotes fuse.js 검색 + Header 진입점, AC 9/9 |
| [multi-source-learning-platform](./multi-source-learning-platform/) | 2026-05-30 | 96% | 0 | ~3h | 다중 자료원 학습 플랫폼 재편 (Phase A+B) — Source 1급 객체 + OSHA SCS 5 Part(1A/1B/2/3/4) 통합, 4 컴포넌트 + 2 신규 라우트, 17 챕터 URL 100% 호환. Phase C(cross-link)는 별 cycle 분리 |
| [cross-link-system](./cross-link-system/) | 2026-05-30 | 100% | 0 | ~1.5h | 자료원 간 의미적 연결망 (Phase C) — Topic 23·Hazard 12 통제 어휘 + 책 17+OSHA 5 태깅 + 빌드 인덱스(80 bidirectional edges, DoD 4배) + RelatedFromOtherSources/ChemicalSourceHub. **Extensibility 5원칙** 코드 구현 + §11.3 test 실증 통과 (test-source add/remove, 코어 0줄 수정). 향후 SEMI·KOSHA 추가 onboarding 사전 검증 완료 |
| [quotes-source-filter](./quotes-source-filter/) | 2026-05-30 | 95% | 0 | ~1.5h | `/quotes` 통합 인용 인덱스 — 책 91 + OSHA 26 = **117 통합 검색**. discriminated union `QuoteItem` 재설계 + extract-quotes OSHA 4 패턴(Overview/LO/Summary/Definition selector 11개) + Source 필터 UI + Fuse keys 6개. cross-link-system FR-12 deferred polish 정식화 (Option B Integration). 0 selector miss, 신규 컴포넌트 0, Critical/Major 0 |
| [quotes-source-filter-polish](./quotes-source-filter-polish/) | 2026-05-30 | 99% | 0 | ~30m | **Micro-cycle 첫 적용**. 직전 cycle Minor 5건 중 3건 polish: FilterButton focus-visible ring(WCAG 2.1 AA) + OSHA_PART_META partTitle sources.ts 풀 텍스트 동기화 + Happy C 실측. **Bonus**: 검증 단계 Happy C 미작동 발견 → OSHA_KIND_DEFAULT_REF +5 lines minimal patch (Fuse "summary" 0→5 hits, 26 OSHA quote 100% sectionRef). Design skip 정당화. Playwright MCP 스크린샷 3장 검증. LOC +9 / Bundle +30B |
| [filter-button-promotion](./filter-button-promotion/) | 2026-05-31 | 99% | 0 | ~30m | **Micro-cycle #2**. FilterButton helper(QuoteIndex 비공개) → `src/components/ui/Chip.tsx` 전역 UI primitive 추출. **aria-pressed 자동 부여**(WAI-ARIA) + focus-visible ring 캡슐화 + JSDoc + variant 확장 권고. QuoteIndex 24 chip(Source 3 + Type 3 + Chapter 18) `<Chip>` 치환, FilterButton + cn import 완전 삭제. ChemicalSearch는 스타일 차이(solid)로 별 cycle 분리. Bonus 정책 없음(Plan대로 정확 실현). Playwright aria-pressed snapshot 검증. LOC net +20 / Bundle +20B. **micro-cycle 2회 연속 박스 33% 여유 + 99% 패턴 정착** |

---

## 기록 정책

- `--summary` 옵션 사용 시: `.bkit/state/pdca-status.json`에 가벼운 summary 보존 (phase·matchRate·시점·archivedTo)
- Plan/Design/Analysis/Report 문서는 `docs/archive/YYYY-MM/{feature}/` 폴더로 이동
- batch parent의 sub-batch들은 별도 archive 가능 (또는 활성 docs 유지)
