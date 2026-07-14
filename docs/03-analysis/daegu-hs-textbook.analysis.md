# Gap Analysis — 대구반도체고 교과서 자료원 (파일럿)

> **Feature**: `daegu-hs-textbook` · **분석일**: 2026-07-14 · **분석**: gap-detector Agent
> Design: `docs/02-design/features/daegu-hs-textbook.design.md` · Plan: `docs/01-plan/features/daegu-hs-textbook.plan.md`
> 대상: 파일럿 — 신규 Source 인프라 + 모듈 1개(반도체 공정 개요)
>
> **상태 갱신 (2026-07-14)**: 본문은 파일럿(모듈 1개) 기준의 최초 Check 기록으로 보존한다. 이후 나머지
> 9개 모듈(공정설비·포토·식각·박막·금속배선·산화·도핑·CMP·세정)이 동일 방법론(3단 레이어 재구성 +
> 원문 페이지 재검증 + 저작권 원칙)으로 순차 완료되어 **10/10 모듈 전량**이 이번 PR에 포함됐다.
> 확대 구간도 typecheck·lint·build(10페이지 SSG)·`build:cross-link`(94섹션)·`extract:quotes`(회귀 0)를
> 전부 통과했으며, CodeRabbit 리뷰로 발견된 추가 갭(용어 표기 불일치·문서 범위 등)은 본 PR에서 수정
> 완료했다. 상세는 `docs/04-report/daegu-hs-textbook.report.md` 참조.

---

## Match Rate: **96%** ✅ (기준 90% 이상 — Act 불필요)

| 검증 항목 | 가중치 | 점수 | 근거 |
|---|:---:|:---:|---|
| ① 스키마 (Design §2.1–2.3) | 20% | 100% | Source·섹션 전 필드 일치, year 생략도 설계대로 |
| ② 라우팅·로더 (§3) | 15% | 100% | generateStaticParams·breadcrumb·footer·RelatedFromOtherSources·prev/next 일치 |
| ③ 콘텐츠 계약 (§4) | 25% | 90% | 구조·MDX 안전규칙·저작권 전부 충족, FZ 용어 오기 1건 감점 |
| ④ cross-link (§5) | 10% | 100% | `_links.json` 일치, 정·역방향 연결 빌드 산출물로 실증 |
| ⑤ FR-1∼7 / NFR-1∼5 | 20% | 92% | FZ 오기(FR-6) 외 전항 충족 |
| ⑥ 코어 무수정 (git diff) | 10% | 100% | additive 4파일 + 산출물 재생성만, 책·OSHA·NCS 변경 0 |

## Gap 목록 및 처리 현황

| # | 심각도 | 내용 | 처리 |
|:-:|:---:|---|---|
| 1 | medium | `process-overview.mdx` — FZ를 "플랫존"으로 오기(원문 교과서 자체의 표기 오류를 답습). 올바른 명칭: **플로트존(Float-Zone)** | ✅ **수정 완료** (2026-07-14, 2개소) — 원문 오류를 바로잡는 사례로 재구성 원칙(수치·용어 검증) 유효성 입증 |
| 2 | low | Design §5가 wafer-fab 연결 대상을 "책 3장"으로 예측했으나 실제 태그 공유는 책 2·3·5장 | ✅ Design 문서 문구 정정 완료 (구현 정상) |
| 3 | low | Design §6 검증계획에 stale "emerald" 표기 잔존 (§2.1은 amber로 정정됐었음) | ✅ Design §6 "amber"로 정정 완료 (구현은 처음부터 amber) |
| 4 | info | 신규 4파일 git untracked | 커밋 시 `git add` (커밋은 사용자 요청 시) |
| 5 | info | 기계 검증 — 에이전트는 미실행, 단 **메인 세션에서 typecheck·lint·build 기실행 통과** + Gap 수정 후 재빌드 통과(165페이지 SSG) | ✅ 해소 |
| 6 | info | info Callout 2개(설계는 1개) — "8이라는 숫자" 부연 추가 | 허용 범위, 조치 불필요 |

## 잘 된 점

- **스키마·라우팅·저작권 계약 완벽 일치** — DAEGU_HS 전 필드, footer·breadcrumb·prev/next 1:1 대응.
- **저작권 원칙 초과 준수** — SourceQuote·ImageFigure 0회(설계 "최소"보다 보수적), 원문 이미지 0, deep 레이어까지 전면 재작성, 출처 div에 페이지 범위 명시.
- **MDX 안전규칙 전부 준수** — 리터럴 `<`/`{` 없음, `∼` 사용, 화학식 유니코드 아래첨자.
- **콘텐츠 매핑 완전** — Design §4의 요구 소절(8대 공정·전/후공정·FEOL/MOL/BEOL·CZ/FZ·다듬기 4단계·클린룸 class·Lot·옐로룸) 전부 커버.
- **코어 무수정 확정** — git diff 실측으로 NFR-4 충족, 기존 3개 자료원 회귀 위험 0.

## 결론

Match Rate 96% ≥ 90% — **iterate 불필요, Report 진행 가능**. medium 갭 1건(FZ)은 분석 직후 수정·재빌드 검증 완료. 나머지 9개 모듈 확대 착수 가능한 상태.
