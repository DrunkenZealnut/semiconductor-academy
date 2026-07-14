# Gap 분석 — ncs-image-expansion (Check, 최종 — Phase 0~4 전체)

> **Feature**: `ncs-image-expansion` · **분석일**: 2026-07-14 · **분석**: gap-detector (Design 3종 vs 구현 전수·샘플 대조)
> **기준 문서**: `docs/01-plan/features/ncs-image-expansion.plan.md` · `docs/02-design/features/ncs-image-expansion.design.md` · `ncs-semiconductor-dev-track.spec.md §1-d`
> 이력: Phase 0~2 중간 점검(2026-07-14 오전, Match 100% — 당시 범위 한정)을 본 최종 분석이 대체한다.

## 1. Match Rate: **97%** ✅ (게이트 90% 통과)

| # | 검사 항목 | 가중치 | 점수 | 근거 |
|---|---|:---:|:---:|---|
| 1 | §3 신규 54 id 매핑 (MDX+sources+loader, 철자 대조) | 20 | 100 | 54/54 정확 일치 (개발19·재료13·제조7·장비15) |
| 2 | §4 등록 규약 (href·group 4종·기존 30 상대 순서) | 12 | 100 | href 전량 규격, 기존 30 순서 main 대비 diff 0 |
| 3 | §1.4 삽입 규격 샘플링 (src·alt·caption·source·합본 2-LM·수량) | 15 | 98 | 샘플 전부 준수, 합본 4모듈 2-LM 병기 확인 |
| 4 | §1.5 푸터 v2/v1 정합 | 8 | 100 | 이미지 78모듈 v2 / 무이미지 6모듈 v1, 검증기 0 error |
| 5 | ImageFigure src ↔ 실파일 전수 | 12 | 100 | jpeg 345개 실측, 누락 0 |
| 6 | §5 보강 계약 (10모듈 + optical 예외) | 10 | 85 | Phase 4 제조 6/6·장비 3/4 정상. 단 firmware·flip(기존 개발) 0장 미문서화 |
| 7 | §6.1 검증기 구현 완전성 | 8 | 100 | 요구 5항목 전부 코드 구현, 84파일 0 ERROR |
| 8 | NFR 용량 (≤40MB, 장당 ≤200KB) | 8 | 100 | 실측 30MB, 200KB 초과 0건 |
| 9 | Plan DoD 각 항목 | 7 | 88 | 대체로 충족, "29/30" 표기 부정확 + 미체크 박스 3개 |

**가중합 97.36 → 97%**. 구조적 누락(미등록·미생성·로더 누락) 0건, 설계 외 추가 기능 0건.

## 2. Gap 목록

| 항목 | 기대 | 실제 | 심각도 | 조치 |
|---|---|---|:---:|---|
| 기존 개발 모듈 보강 누락 | 기존 30 보강(optical만 예외) | 0장 기존 모듈 3개: optical + **firmware-development** + **flip-package-development** (실질 27/30) | Med | plan DoD 정정(반영 완료), firmware·flip 사유는 후속 확인 |
| 신규 모듈 도판 미포함 | FR-3 신규 도판 3~6장 | 신규 0장 3모듈: analog-device-design·analog-system-design·equipment-system-software (순수 설계/SW 성격, 후보 전량 부적격) | Low~Med | 예외로 문서화(반영 완료) |
| 도판 수량 하한 불일치 | design §1.4 "3~6장" | 검증기 §6.1은 "1~6개" — 1~2장 모듈 다수 존재 | Low | §1.4를 §6.1 기준으로 통일(반영 완료) |
| 저작권 애매 실사 잔존 | Picture 보수 취급 + 검수 목록 | etch-equipment Picture 실사 등 검수 목록 미기재 | Low | plan 검수 목록에 추가(반영 완료) |
| 합본 출처 구분자 혼용 | 표기 일관성 | board·utility `·` vs prototype·quality `, ` | Low | 표시상 차이만, 후속 통일 선택 |

## 3. 정상 확인 요약

- 신규 54모듈 3중 등록(철자 일치) → 최종 **84모듈** = plan 목표 정합
- 기존 30모듈 상대 순서 무결(본문 대체 흔적 없음 — §5 계약 준수 정황)
- 합본 4모듈(0314·15/0316·17/0318·19/0320·21) 전부 두 LM 병기
- validate-ncs-mdx.py 84파일 전수 PASS · cross-link 84섹션(topics 187·hazards 99·엣지 455) · build 163페이지 · SSR 중첩 0 · 30MB/40MB

## 4. 판정

**Check ≥ 90% → Report 진행 가능.** 권장 조치 5건 중 4건(문서 갱신)은 본 분석 직후 Act로 반영 완료. 잔여:
① firmware·flip 0장 사유 확인 — 도판 보강 또는 예외 확정 (후속 사이클)
② 합본 출처 구분자 통일 (선택)
③ 사람 검수 목록의 저작권 최종 판단 (사람 작업)
