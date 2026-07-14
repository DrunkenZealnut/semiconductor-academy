# Gap 분석 — ncs-image-expansion (Check, Phase 0~2 중간 점검)

> **Feature**: `ncs-image-expansion` · **분석일**: 2026-07-14 · **분석 범위**: Phase 0~2 완료분
> Design: `docs/02-design/features/ncs-image-expansion.design.md` · Plan: `docs/01-plan/features/ncs-image-expansion.plan.md`
> **Match Rate: 100%** (완료 선언 범위 = Phase 0~2 기준. G-1 렌더 실측으로 close)

## 0. 분석 방법·범위 정의

Design §7 구현 순서는 5개 Phase(0 파일럿 → 1 기존 보강 → 2 개발 신규 19 → 3 재료 신규 13 → 4 marker+제조·장비)이며,
§200에서 "pdca analyze는 Phase 4 후 일괄"로 계획되어 있다. 본 분석은 사용자 요청에 따라 **현재까지 완료 선언된 Phase 0~2**에
대한 중간 Gap 점검이다. Phase 3~4는 "계획대로 미착수"이며 gap이 아니라 **구현 범위 밖(out-of-scope)**으로 분류한다.

이 feature는 코드가 아니라 콘텐츠·데이터·검증 파이프라인이 산출물이므로, 일반 코드 비교용 gap-detector 대신
Design 각 절의 요구사항을 실제 산출물과 정량 대조했다(Design §6.2 게이트는 Check 시점에 전수 실측).

## 1. 완료 범위 대조 (Phase 0~2)

| # | Design 항목 | 요구 | 실측 결과 | 판정 |
|---|---|---|---|---|
| 1 | §1.1 extract-figures.py | 후보 추출 스크립트 | `scripts/ncs/extract-figures.py` 존재, 개발 19 전부 후보 JSON 생성 | ✅ |
| 2 | §1.2 선별 3단계 | 스크립트 자동배제 → 에이전트 선정 → 메인루프 전수 재확인 | third_party/boilerplate 배제, 에이전트 3~6장 선정, **채택 69장 전부 Read로 육안 확인** | ✅ |
| 3 | §1.3 prepare-images.sh | sips 1200px·≤200KB·용량 리포트 | 스크립트 존재+실행, 200KB 초과 **0건**, 전체 12MB | ✅ |
| 4 | §1.4 ImageFigure 규격 | src/alt/caption/source 4-prop, alt 그림번호 금지 | validator 50모듈 PASS | ✅ |
| 5 | §1.5 푸터 v2 | 이미지≥1 모듈 v2 문구 | validator 푸터 검증 PASS | ✅ |
| 6 | §3.1 개발 19 id 매핑 | 19개 LM↔id 정확 매핑 | 19/19 sources.ts·ncsMdx·mdx 3파일 정합 | ✅ |
| 7 | §4 sources.ts 등록 | 학습흐름순 삽입·기존 상대순서 유지·group 순서 불변 | 30개 학습흐름순 삽입, 개발 group 위치 불변 | ✅ |
| 8 | §4 ncsMdx.tsx | 모듈당 로더 1줄 | 19줄 추가, 로더 맵 정합 | ✅ |
| 9 | §4 _links.json | 근거 기반 태깅·설계/시험 무태깅 관행 | 공정·패키지 10개만 태깅, 설계·검증·시험 9개 무태깅 | ✅ |
| 10 | §5 기존 30 보강 | 본문 보존·이미지+푸터만 변경 | Phase 1 완료(커밋 7313579, PR#8 머지), diff 삭제줄 footer만 | ✅ |
| 11 | §6.1 validator 확장 | ImageFigure·경로존재·alt/source 검사 | `validate-ncs-mdx.py` 존재+50모듈 PASS | ✅ |
| 12 | §6.2 빌드 게이트 | typecheck·lint·cross-link·quotes·build 회귀 0, SSG=등록 | 전부 통과, SSG 50 = 등록 50 | ✅ |
| 13 | §6.2 SSR | export HTML p/div 중첩 스캔 | 신규 9모듈 p>figure 중첩 **0건** | ✅ |
| 14 | §6.2 용량 | ≤40MB, 장당 ≤200KB | 12MB, 200KB 초과 0 | ✅ |
| 15 | §6.2 렌더 실측 | 각 Phase 대표 모듈 Lightbox·다크모드·모바일 | Phase 2 대표 모듈(heterogeneous-package, 5장) Playwright 실측 완료 | ✅ |

## 2. Gap 목록

### G-1 (Minor) — Phase 2 브라우저 렌더 실측 미완 → **CLOSED (2026-07-14)**
- **Design 근거**: §6.2 "렌더 실측 — 파일럿·각 Phase 대표 모듈 Lightbox·다크모드·모바일 폭 확인"
- **조치**: dev 서버(포트 3016) + Playwright로 heterogeneous-package(이미지 5장) 실측:
  - 이미지 5장 전부 figure + "이미지 확대" 버튼 + 출처 caption 렌더 확인
  - Lightbox 클릭 → 오버레이 모달에 도판 확대 + 닫기 버튼 정상 동작
  - 다크모드 전환 + 모바일 폭(375px)에서 텍스트 wrap·표·cross-link·이미지(흰 배경 도판) 정상, 가로 스크롤 없음
  - 콘솔 에러는 favicon.ico 404 1건뿐(사이트 전역 사안, 본 작업 무관)
- **결과**: Match Rate 97% → **100%**.

### 정보성 항목 (gap 아님)
- **Phase 2 미커밋**: Design §200 "각 Phase = 1 PR". 현재 사용자 커밋 지시 대기 중 — 절차상 정상, 결함 아님.
- **Phase 3~4 미착수**: 재료 신규 13, marker 변환 + 제조·장비 보강/신규. 계획대로 후속 진행 — 범위 밖.

## 3. 품질 특이사항 (Design 초과 달성)

Design §1.2 3차 "애매하면 제외"·§6.2 "저작권 전수 재확인" 원칙이 Phase 2에서 실제로 여러 정정을 유발:
- 원본 도판 내부 라벨 오류 제거(product-verification 그림 1-6 양쪽 "8인치")
- 캡션 오매칭 정정(memory-process 그림 1-14→1-15, lifetime HTOL 무제→그림 1-7, fanout 그림 3-23→3-24)
- 분리 도판 재합성(heterogeneous 그림 3-7, custom-layout 그림 4-2)
- 하단 잘린 출처 문구 crop 6건, OCR 오탈자 교정 다수

## 4. 결론

Phase 0~2 완료 선언 범위에 대해 Design 요구 15항목 **전부 충족**(G-1 렌더 실측 close).
**Match Rate 100%** — 90% 게이트 통과. Phase 3~4는 계획대로 후속 진행.

**다음 단계 권장**: (a) Phase 2 커밋(사용자 지시) → (b) Phase 3(재료 신규 13) 착수.
