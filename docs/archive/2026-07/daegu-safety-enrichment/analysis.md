# Gap Analysis — 공정기초 교과서 안전 콘텐츠 보강

> **Feature**: `daegu-safety-enrichment` · **분석일**: 2026-07-15 · **분석**: gap-detector Agent + 메인 세션 검증 게이트
> Plan: `docs/01-plan/features/daegu-safety-enrichment.plan.md` (Design 의도적 skip — 콘텐츠 확장 사이클, Plan 단독 기준)
> 문체·MDX 계약: `docs/02-design/features/daegu-hs-textbook.design.md` §4 준용
> 대상: daegu-hs-process 10개 단원 안전 Callout 29개 + `SourceRef` 신설 + `_links.json` hazards/chemicals 태깅

---

## Match Rate: **96%** ✅ (기준 90% 이상 — Act 불필요)

| 검증 항목 | 가중치 | 점수 | 근거 |
|---|:---:|:---:|---|
| ① FR-1 안전 Callout 삽입 | 30% | 98% | 10/10 단원 전부 2∼5개 범위(계 29개), "팩트→통제→더보기" 구조 일관. 일부 문장 밀도 상한 근접(Minor) |
| ② FR-2 SourceRef 신설 | 15% | 100% | ChapterRef의 정확한 범용화(동일 null 가드·칩 스타일·basePath), mdx-components 전역 등록, 참조 섹션 전부 실재 |
| ③ FR-3 통제 어휘 태깅 | 15% | 100% | hazards 10종 전부 `HAZARDS` enum 소속, chemicals 23종 전부 `chemicals.json` 실재, 신규 어휘 0 |
| ④ FR-4 단원↔자료 매핑 | 15% | 80% | 1차 책 챕터 링크 10/10 정확. 보조 OSHA/부챕터 링크 4건 차이(Minor) |
| ⑤ FR-5 R-1 사실 검증 (최중요) | 25% | 97% | 10개 단원 23개 팩트 원문 grep 전건 일치, **사실 오류 0건**. 표현 특정 과다 1건(Minor) |

## 검증 게이트 (메인 세션 실측)

| 게이트 | 결과 |
|---|---|
| `npm run build:cross-link` | ✅ 4자료원 94섹션, topics 211 · hazards 129 · chemicals 101, 양방향 엣지 651, unknown 어휘 0 |
| `npm run typecheck` | ✅ 0 에러 |
| `npm run lint` | ✅ 이번 변경 관련 경고 0 (기존 warning 2건은 무관 파일) |
| `npm run build` (정적 export) | ✅ 성공 |
| `quotes.json` 회귀 | ✅ diff 0 (완전 무변화) |
| `cross-link.json` | +417/−37 — 태그 보강이 인덱스에 반영 (산출물 재생성) |

## FR-1 — 단원별 안전 Callout 실측

| 단원 | warning | ChapterRef | SourceRef |
|---|:---:|---|---|
| process-overview | 3 | 3·4·5 | — |
| equipment-parameters | 3 | 3·14·15 | part-4 |
| photo | 3 | 8 | part-2 |
| etch | 3 | 9 | part-2·3 |
| thin-film | 3 | 10 | part-3 |
| metallization | 2 | 10 | part-3·2 |
| oxidation | 3 | 7 | part-3 |
| doping | 3 | 7·11 | part-3 |
| cmp | 3 | 12 | part-2 |
| cleaning | 3 | 6 | part-2 |
| **계** | **29** | | |

전 단원 2∼5개 범위 준수 (metallization 2개 = 하한 경계, 유효).

## FR-5 — 사실 대조 상세 (23건 전건 일치)

핵심 수치·물질 원문 grep 대조 — Plan 요구(최소 5단원)를 초과해 10개 단원 전수 수행:

| 단원 | 대조 팩트 | 원문 증거 |
|---|---|---|
| process-overview | 셀룰로스 마스크 투과율 98.87∼100% / 클린룸 공기 재순환 | 04-cleanroom.mdx:412,417 / :76 |
| equipment-parameters | 3cm 거리 최대 860μT / IARC 2001 극저주파 2B군 / 정비 엔지니어 오퍼레이터 5배 | 15-electromagnetic.mdx:409,434 / :178 / :496 |
| photo | 감광제 48제품 238건 중 49% 영업비밀 / 벤젠 1A / TVOC 0.1∼0.2→40∼50ppm(최대 350) / 폐기함 주변 최대 1,300ppm | 08-photolithography.mdx:395,508 / :585 / :654 / :657 |
| etch | 13.56MHz TLV 4.9mW/cm² / HF 뼈 침투·글루콘산칼슘 | 09-etching.mdx:525 / :213 |
| thin-film | 실란 TNT 9배 폭발 / IDLH 아르신 3·포스핀 50·디보란 1ppm | osha part-3.ko.mdx:110 / 10-deposition.mdx:415 |
| metallization | WF₆ 가용성 텅스텐 TWA 1mg/m³ | 10-deposition.mdx:314 |
| oxidation | 수소 LEL 25% 경보·차단 | osha part-3.ko.mdx:138 |
| doping | 아르신 국내 노출기준 0.005ppm / NIOSH 발암물질 분류 / 디보란 38℃ 초과 자연발화 / 비소 운전 1.6·정비 7.7·최고 218.6µg/m³ | 07-diffusion.mdx:240,275 / :242 / osha part-3.ko.mdx:39 / 11-ion-implantation.mdx:186 |
| cmp | 실리카 분진 진폐증 / IPA 인화점 11.7℃ | 12-cmp.mdx:271 / osha part-2.ko.mdx:53 |
| cleaning | 황산 눈 접촉 실명 / 피라냐 98% 황산 | osha part-2.ko.mdx:205 / chemicals.json sulfuric-acid |

## Gap 목록 및 처리 현황

| # | 심각도 | 내용 | 처리 |
|:-:|:---:|---|---|
| 1 | low | FR-4 보조 링크 차이: process-overview에 Part 1A 부재, equipment-parameters에 Part 1B 누락, thin-film·metallization에 Part 4 누락, metallization에 ch14 미링크(대신 타당한 part-2 추가) | ✅ **수정 완료** (2026-07-15, 4건) — process-overview→Part 1A(GHS 분류·라벨), equipment-parameters→Part 1B(통제·비상 대응), thin-film→Part 4(유해가스 시스템), metallization→ch14. metallization의 Part 4는 배기 부산물 소주제 부재로 미적용(part-2·3으로 충분). 수정 후 재빌드 통과(174페이지 SSG) |
| 2 | low | process-overview:122 HF "최대 24시간까지" — 원문(09-etching:214)은 "몇 시간 뒤". 방향 동일·오류 아니나 R-1 발췌근거 원칙상 과한 특정 | ✅ **수정 완료** (2026-07-15) — "통증 같은 증상이 몇 시간 뒤에야 나타날 수 있는"으로 원문 표현에 정합 |
| 3 | low | 일부 Callout 문장 밀도 상한(6문장) 근접 (equipment-parameters 2,000PSI callout) | 가독성 무해 수준, 조치 불필요 |
| 4 | info | 신규 2파일 git untracked (plan.md, SourceRef.tsx) | 커밋 시 `git add` (커밋은 사용자 요청 시) |

**Critical 0 · Major 0 · Minor(low) 3 · info 1**

## 비목표 위반 검사 — 위반 없음

| 비목표 | 결과 |
|---|:---:|
| 교과서 본문(공정 원리 서술) 미수정 | ✅ warning Callout 순수 추가 블록만, 본문·표·LayeredExplain 유지 |
| 새 통제 어휘(Topic/Hazard) 미추가 | ✅ schema.ts·schema-enum.json 변경 0, 전 태그 기존 어휘 |
| 책·OSHA MDX 미수정 | ✅ git 변경 목록에 ch*.mdx·osha-scs/*.mdx 없음 |

## MDX 안전 규칙 — 전항 통과

- 블록 컴포넌트(Callout) 앞뒤 빈 줄 전 개소 준수
- 산문 내 리터럴 `<`·`{` 0건 (전부 JSX 태그/표현식)
- ASCII `~` 0건 (전부 `∼`)
- 화학식 유니코드 아래첨자 (H₂O₂·WF₆·SiH₄·B₂H₆·NH₄OH 등)
- Callout 내부 블록 중첩 없음 (인라인 ChapterRef/SourceRef/Term만)

## 잘 된 점

- **사실 검증 완벽** — 교육 콘텐츠 최대 리스크(R-1)에 대해 23개 팩트 전건 원문 verbatim 일치, 수치·물질명·기관명 오류 0.
- **SourceRef가 ChapterRef 관례의 정확한 범용화** — null 가드·칩 스타일 클래스 문자열까지 동일, 후속 자료원에도 재사용 가능한 인프라 확보.
- **통제 어휘 100% 적합** — hazards 10종·chemicals 23종 전부 기존 어휘로 해결, cross-link 엣지 651로 강화 (비목표 "새 어휘 금지" 동시 충족).
- **"팩트→통제→더보기" 3단 구조 일관** — warning Callout 29개 전부 동일 서사 순서, 해요체·서술형 제목 관례 유지.

## 결론

Match Rate 96% ≥ 90% — **iterate 불필요, Report 진행 가능**. 분석 직후 Minor #1(보조 링크 4건 보강)·#2(HF 표현 원문 정합) 수정 완료, 재빌드(174페이지 SSG)·quotes diff 0 재확인. FR-4는 수정 반영으로 매핑표 대비 실질 잔차 해소. 잔여는 조치 불필요 항목뿐. 후속: `/pdca report daegu-safety-enrichment`.
