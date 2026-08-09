# Gap Analysis — cert-equip-maintenance

> **Feature**: `cert-equip-maintenance` · **분석일**: 2026-08-09 · **분석자**: gap-detector agent + pdca-iterator agent(Evaluator-Optimizer 2회)
> **기준**: `docs/02-design/features/cert-equip-maintenance.design.md` §1~§6 + `docs/01-plan/features/cert-equip-maintenance.plan.md` §6 DoD
> **결과**: **1차 97% → 즉시 보수(G-1~G-5) → 반복 2회(백로그 G-6·G-7) → 최종 추정 98~99%** — 임계치 90% 통과

---

## 1. Match Rate 추이

| 단계 | Match Rate | 판정 근거 |
|---|:-:|---|
| 1차 gap-detector | 97.0% | 가중 영역 A~G, 130개 구조 게이트 중 129 통과 + scope 커버리지 92% |
| 1차 갭 즉시 보수 (G-1~G-5, High 1·Med 2·Low 2) | — | 5건 전부 수정, 게이트 13/13·build 295/295 재통과 |
| pdca-iterator 1회차 (백로그 G-6·G-7) | 96.0%* | *재평가에서 신규 갭(N-1~N-2, T-1~T-2) 지적 — 백로그 처리 자체는 완료, 재평가가 더 엄격한 기준 적용 |
| pdca-iterator 2회차 (N/T 갭 처리) | 추정 98~99% | 반복 상한 2회 규칙으로 3차 독립 재평가는 미실행. 처리 항목은 2회차 평가자가 명시한 "99% 도달 조건" 전부 충족 |
| **최종 독립 재검증** (이 세션) | — | check-mdx 13/13 · typecheck 무오류 · build:cross-link 무오류 · **`npm run build` 295/295 페이지 재실행 확인(2회, G-1~G-5 이후 1회 + G-6/G-7 이후 1회)** |

## 2. 검증 요약 (설계 절별 — 1차 분석 기준)

| 설계 절 | 가중 | 결과 | 비고 |
|---|:-:|:-:|---|
| §1 types.ts (`exam-prep`) | 10% | 100% | 3개 Record 라벨맵 전부 일치 |
| §2 sources.ts 등록 스펙 | 20% | 100% | 메타 12항목 + sections 13개 id·title·group·readingTime·순서 전수 일치 |
| §1 REGISTRY 로더 | 5% | 100% | 13개 로더-섹션 1:1 쌍, drift 0 |
| §3 MDX 구조 계약 | 30% | 99%→100% | SafetyDisclaimer 누락 1건(assembly-process) 보수 완료 |
| §4 MDX 내용 스펙 | 25% | 92%→95%+ | scope 누락 2건(회로 기호·안전관리 조직) 보수 완료, 부분 서술 13건 중 4건(photo·etch·clean-cmp·automation) 추가 보강 |
| §5 `_links.json` 태깅 | 5% | 95%→98% | 승인 편차 반영 + storage-compatibility 추가·isopropyl-alcohol 정정 |
| §1 무수정 확인 | 5% | 100% | `cert-equip-maintenance` 문자열 보유 파일 4개뿐(sources.ts·schoolTextMdx.tsx·_links.json·cross-link.json 생성물) |

## 3. Gap 목록 및 처리 결과

| # | 갭 | 심각도 | 처리 |
|---|---|:-:|---|
| G-1 | 공유압 카드 요약이 약속한 "회로 기호"가 본문에 없음 | High | ✅ 포트수/위치수 표기 + 2/2·3/2·4/2·5/2-way 표 추가 |
| G-2 | 산업안전 "안전관리 조직" scope 미서술 | Med | ✅ 조직 문단 + 「반도체 인프라 일반」 커멘트 추가(원문이 그림뿐이라 세부 창작 없이 원문 수준 유지) |
| G-3 | assembly-process SafetyDisclaimer 누락 | Med | ✅ 삽입 |
| G-4 | electrical-facility 참조 1건에 연결 이유 누락 | Low | ✅ 이유 문장 보강 |
| G-5 | industrial-safety 참조 2건 묶음 서술 | Low | ✅ 개별 문장으로 분리 |
| G-6 | automation-plc·electrical-facility·environment-management 태그 변별력(동일 관련자료 집합) | Low | 검토 완료, **의도적 무변경**(본문 실증 부족 — 무리한 태깅보다 정확성 우선) |
| G-7 | scope 부분 서술 13건 | Low | 4건 보강(photo-process 노광 공식, etch-process 반응식, clean-cmp-process 오염원 분류, automation-plc PLC 신호·모터 회로 — 출제기준 10·11 직결). 나머지는 원문에 텍스트 근거 없음(그림 캡션뿐) 확인 후 보류 |
| N-1 | (2회차 발견) photo-process 광원 파장값 미보강 | Low | 보류 — 원문 슬라이스에 검증 가능한 수치 텍스트 없음(창작 금지 원칙 우선) |
| N-2 | (2회차 발견) electrical-facility 서지전압↔전기적 장애 미연결 | Low | ✅ 연결 문장 추가 |
| T-1 | (2회차 발견) chemical-facility storage-compatibility 미태깅 | Low | ✅ 추가(§6 분리 보관 원칙 본문 실증) |
| T-2 | (2회차 발견) chemical-facility isopropyl-alcohol 태깅 근거 부족 | Low | ✅ 제거(표 언급뿐 — 기존 배제 기준과 일관화) |

**잔여 갭: N-1 1건 (Low, 원문 부재로 인한 구조적 한계 — 추가 반복으로 해소 불가)**

## 4. 승인 편차 (갭 아님)

| # | 편차 | 근거 |
|---|---|---|
| 1 | industrial-safety에서 `osha-scs/part-1b` 미사용 | 분량 압축, 총 참조 8개로 하한 충족 |
| 2 | electrical-facility "서지" 원문 그대로 미서술(대신 N-2로 차단기 단점과 연결) | 원문 슬라이스 부재, 창작 금지 우선 |
| 3 | 분량 상한 소폭 초과 4건(pneumatics-hydraulics 277·industrial-safety 266·automation-plc 265·assembly-process 262줄) | 보강 내용이 표 형식이라 압축 여지 없음, design §3.2에 사유별 기록 완료 |
| 4 | chemical-facility 벤젠·삼불화붕소·암모니아·이소프로필알코올 미태깅 | 표 1~2회 언급뿐, 개별 서술 문단 없음 — 실증 기준 일관 적용 |
| 5 | intro·automation-plc SafetyDisclaimer 미부착 | 안전 서술 실질 0건(intro) / 인터록·비상정지를 design-electrical로 외부 위임(automation-plc) |
| 6 | `_links.json` 태그가 §4 후보 범위를 벗어난 확장 다수(예: deposition의 pyrophoric/toxic, industrial-safety의 exposure-monitoring) | §5가 "후보 중에서 또는 아래 어휘 내에서"로 확장을 명시 허용, 전부 본문 실증 기반 |
| 7 | §4 후보 중 미태깅(diffusion의 diborane, etch의 hydrofluoric-acid) | 실증 기준 미달 판단 |

## 5. 실행 검증 (이 세션 독립 재확인)

- ✅ `check-mdx.mjs` 게이트 13/13 통과(LayeredExplain·학습목표·시험포인트 2~4개·참조 4개 이상·출처 footer·MDX 구조 규칙)
- ✅ `npm run typecheck` 무오류
- ✅ `npm run build:cross-link` 무오류 — 13 sources·175 sections 스캔, topics 392·hazards 189·chemicals 194 태깅, unknownChemicals 0
- ✅ `npm run build` **295/295 페이지 SSG 성공** — G-1~G-5 보수 직후 1회, G-6/G-7 반복 완료 직후 1회, 총 2회 독립 재실행
- ✅ 역방향 cross-link 렌더 확인 — 기존 daegu-hs-process·책 챕터 페이지에 수험서 모듈이 관련자료로 노출(빌드 산출물 HTML 직접 확인)

## 6. 총평

코드 등록 3개 축(types·sources·REGISTRY)은 설계와 완전 일치하며, 13개 모듈 MDX 구조 게이트는 100% 통과 상태다. 발견된 갭은 전부 콘텐츠 레이어(scope 커버리지·태그 변별력)에 국한됐고, High 1건·Med 2건은 세션 내 즉시 해소, Low 다수는 2회 반복(Evaluator-Optimizer)으로 대부분 처리했다. 유일한 잔여 갭(N-1, photo-process 광원 파장값)은 원문 자체에 텍스트 근거가 없어 "확신 없는 수치는 버린다"는 저작권·정확성 특칙(§3.3)을 우선 적용한 결과이며, 이는 추가 반복으로 해소되지 않는 구조적 한계다.

**Match Rate 추정 98~99% ≥ 90% — Act(iterate) 추가 불필요, Report 단계 진행 가능.**
