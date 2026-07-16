# Gap Analysis — hs-textbook-collection

> **Feature**: `hs-textbook-collection` · **분석일**: 2026-07-16 · **분석자**: gap-detector agent
> **기준**: `docs/02-design/features/hs-textbook-collection.design.md` (§1~§8) + Plan FR-1~7 / NFR-1~5 / §10 DoD
> **결과**: **Match Rate 97.6%** (✅ 39 · ⚠️ 2 · ❌ 0 / 41항목) — 임계치 90% 통과

---

## 1. Match Rate

| 판정 | 개수 | 가중 |
|:-:|:-:|:-:|
| ✅ 일치 | 39 | 39.0 |
| ⚠️ 부분 일치 (합리적 편차) | 2 | 1.0 |
| ❌ 불일치 | 0 | 0 |

**Match Rate = (39 + 2×0.5) / 41 = 97.6%**

## 2. 검증 요약 (설계 절별)

| 설계 절 | 검증 항목 수 | 결과 | 비고 |
|---|:-:|:-:|---|
| §1 아키텍처 확장 | 4 | 4✅ | 기존 3라우트(daegu/ncs/osha) 무수정 공존 확인 |
| §2 데이터 스키마 | 11 | 10✅ 1⚠️ | HS_SEMI_BASICS 전 필드·10섹션 순서·readingTime 10개 문자 단위 일치. ⚠️#15: semicon-fundamentals summary가 설계 예시 문구와 상이(책제목 동명 구분 의도는 충족, 더 구체적) |
| §3 SourcePicker | 7 | 7✅ | 그룹 박스·컴팩트 카드·PERSPECTIVE 정리·카피 갱신 전부 일치 |
| §4 라우팅·로더 | 7 | 7✅ | REGISTRY 진실 원칙, daegu 미등록, disclosure 템플릿 일치 |
| §5 콘텐츠 계약 | 8 | 7✅ 1⚠️ | 10파일 전부: LayeredExplain(hook/easy/deep+sourceSection)·학습목표 Callout·출처 div·원문 이미지 0·리터럴 `~` 0. ⚠️#37: 파일럿 tip이 "책 챕터" 대신 NCS 링크(+별도 warning Callout이 OSHA Part 4 연결) |
| §6 cross-link | 4 | 4✅ | 통제 어휘 전부 유효, 상호연결 4건(설계 최소 3건 초과) |

## 3. Gap 목록 — High/Medium 없음, Low 2건 (무조치)

| 심각도 | 항목 | 판단 |
|:-:|---|---|
| Low | §2.3 semicon-fundamentals summary 문구 상이 | 설계의 문구는 예시 성격, 구현이 더 구체적 — **무조치** |
| Low | §5 파일럿 tip의 "책 챕터" 연결이 NCS·OSHA 연결로 대체 | 연결 총량은 설계 초과(daegu+NCS+OSHA) — **무조치**, 책 챕터 직접 연결은 후속 권 사이클에서 자연 보강 |

## 4. Positive Deviations (설계 초과 구현)

1. **파일럿 1모듈 계획 → 같은 사이클에서 전 10모듈 완주** (§8 step 5 확대까지 완료)
2. **cross-link 실증 3건 → 4건** — semicon-industry(gas-safety+화학물질 4종), semicon-fundamentals 신규 태깅. 본문 언급 실측(21회·32회) 근거
3. **`resolveModule` 공용 헬퍼** — generateMetadata에도 REGISTRY 가드 적용, daegu 이중 메타 생성 원천 차단
4. **`disclosureFor` publisher-optional 분기** — 발행처 미상 권(충남반도체고 등) 대비
5. **10개 섹션 summary 전권 작성** (설계는 1개만 확정)
6. **가스 감지 센서 warning Callout → OSHA Part 4 연결** — 사이트 정체성(유해인자) 강화

## 5. 실행 검증 (Do 사이클 게이트 — 세션 내 실측, §7 검증 계획 대응)

정적 대조로 확인 불가한 항목은 Do 단계에서 실행으로 검증 완료:

- ✅ `typecheck` 무오류 · `lint` 신규 경고 0(기존 2건뿐)
- ✅ `build` 188페이지 SSG 성공 — `/sources/hs-semicon-basics/*` 10+1페이지, 공용 라우트가 daegu 경로를 생성하지 않음(출력 충돌 0)
- ✅ `build:cross-link` 통제 어휘 검증 통과(5 sources·98 sections), `quotes.json` 회귀 0(git diff 없음)
- ✅ 렌더 스모크: 모듈 10/10(학습목표·disclosure·출처), 인덱스 3트랙 그룹, 홈 카테고리 그룹+2권 카드+공통 뱃지, 다크모드 클래스 존재

## 6. 총평

설계 §1~§6의 모든 P0 항목이 정밀 일치하며(readingTime·페이지 범위·카피·disclosure까지 문자 단위 일치), 저작권 안전 3대 기준(원문 이미지 0 · 문장 전면 재작성 체계 · 출처 표기)이 10파일 전부에서 확인된다. 발견된 2건은 설계 의도를 충족하는 Low 편차이고 구현이 설계를 초과 달성했다. **Match Rate 97.6% ≥ 90% — Act(iterate) 불필요, Report 단계 진행 가능.**
