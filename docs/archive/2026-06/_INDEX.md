# Archive Index — 2026-06

| Feature | Archived | Match Rate | Iter | 시간 | Note |
|---------|:--------:|:---:|:---:|:---:|------|
| [osha-bilingual-toggle](./osha-bilingual-toggle/) | 2026-06-02 | 97% | 0 | ~5h | OSHA SCS 이중 언어(영/한) 인페이지 토글 — **Part 1A 파일럿**. `(partId, lang)` 로더 + `koLoaders`/`hasOshaScsKo` 레지스트리 + `LanguageToggle`(Chip 재사용·localStorage·RSC children 토글) + `part-1a.ko.mdx`(영문 1:1 구조). 같은 URL에서 본문만 교체(네트워크 0), 번역 없는 Part는 graceful fallback(토글 미노출). FR 8/8, NFR 6.5/7, 설계구조 14/14. Critical/Major 0, Minor 2(M-1 report 실측으로 해소 / M-2 주석 선택). 검증 실측: typecheck 0에러 + 정적 export 5 part SSG + **quotes.json diff 0** + cross-link.json generatedAt만 변경. **NFR-5 확장성**: 후속 Part는 `koLoaders` 1줄 추가로 토글 자동 노출(컴포넌트/페이지 코어 무수정). 신규 2 + 수정 2 |
| [osha-ko-part-1b](./osha-ko-part-1b/) | 2026-06-02 | 99% | 0 | ~50m | OSHA SCS **Part 1B 한글 번역 확장** (콘텐츠 확장, **Design skip**). 파일럿 토글 메커니즘 재사용 — 변경은 `part-1b.ko.mdx` 신규(영문 229줄 1:1, SDS 16섹션/NFPA 색상/응급처치 표 3개) + `koLoaders` **1줄**뿐. 영문↔한글 섹션 8+개요/요약 1:1(누락0/추가0/오역0), 안전·법규 수치 직역 정확(GHS 1=최고위험 vs NFPA 0=무위험 역방향, 15분 세척, 470mL 기준). FR 6/6, NFR 6/6. Critical/Major 0, Minor 2(P2-1 SDS 병기 순서 / P2-2 NFPA·HMIS 풀이 유익 추가). 검증: typecheck 0 + `/part-1b` SSG + **quotes.json diff 0** + 한글 렌더 실측. **NFR-4 코어 무수정 실증** — "MDX 1개 + 로더 1줄 = 새 언어판" 확장 비용 최소. ⚠️ Claude 초벌 번역(안전·법규 사람 검수 권장). 신규 1 + 수정 1줄 |

---

## 기록 정책

- `--summary` 옵션 사용 시: `.bkit/state/pdca-status.json`에 가벼운 summary 보존 (phase·matchRate·시점·archivedTo)
- Plan/Design/Analysis/Report 문서는 `docs/archive/YYYY-MM/{feature}/` 폴더로 이동
- batch parent의 sub-batch들은 별도 archive 가능 (또는 활성 docs 유지)

## 후속 백로그 (osha-bilingual-toggle 파생)

- ~~Part 1B 한글 번역~~ ✅ **완료** (`osha-ko-part-1b`, 99%) — NFR-5 확장성 실증("MDX 1개+로더 1줄")
- **Part 2~4 한글 번역 확장**: `part-{2,3,4}.ko.mdx` 작성 + `koLoaders` 각 1줄 등록 → 동일 템플릿 반복 (`osha-ko-part-2` 다음 순번)
- **RSC children 토글 패턴 재사용**: 향후 다른 영문 소스(NIST/IEC 등) 동일 패턴 적용 가능, localStorage key를 source-agnostic 일반화 시 글로벌 i18n 토글로 확장
- **한글 인용 인덱싱(선택)**: `quotes.json` lang 차원 추가 — 별도 사이클
- **번역 양식 통일(P2-1, deferred)**: ko.mdx 전반의 "한글(영문)" vs "영문(한글)" 병기 순서 일괄 정렬 — 후속 검수 사이클에서 처리
