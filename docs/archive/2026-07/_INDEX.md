# Archive Index — 2026-07

| Feature | Archived | Match Rate | Iter | 시간 | Note |
|---------|:--------:|:---:|:---:|:---:|------|
| [chapters-source-fidelity](./chapters-source-fidelity/) | 2026-07-11 | 96% | 0 | 3 세션(쿼터 3회) | 책 「반도체 산업의 유해인자」 **ch1∼16 학습 페이지 원문 충실 전면 재작성**(ch17은 원문 미추출로 제외). 본문 3,797→7,735줄(2.04배), 책 인용 91→**187**개(SourceQuote 74→170). 파일럿 ch12로 콘텐츠 계약(quotes 추출 스크립트 의존 구조) 검증 → Design을 자기완결 작업 스펙으로 문서화 → **Sonnet 서브에이전트 15 병렬 + Fable 검증** 체제로 완주. 페이지 인용을 책 목차·마커 기준 전면 교정, **이미지 캡션-실물 불일치 전수 정리**(원문 그림 18장 신규·무관 이미지 6장 삭제·`_credits.json` 전량 동기화), `chapters.json` readingTime 14건 재산정. **QA 라운드**: Playwright 렌더 실측(hydration 각주 p-중첩 19곳 div 전환 / 모바일 표 overflow-x 래퍼 / 인라인 ChemicalCard 4건 분리) + 원문 대조 감사 5챕터(ch2 97%·ch7 97%·ch8 96%·ch14 96%, Critical 창작 5건 수정). 게이트 전부 통과(typecheck·lint·정적 build·quotes·cross-link 회귀 0). Critical/Major 0(QA 후), 사람 검수 대기 Minor 3(NH₄OH/FeCl₂/SOP 핀 간격). ⚠️ Claude 초벌(안전·보건 수치 원서 검수 권장). Branch `feat/chapters-source-fidelity`, 커밋 3(feat+fix+archive) |
| [ncs-image-expansion](./ncs-image-expansion/) | 2026-07-14 | 97% | 0 | 1 세션 | NCS 반도체 학습모듈 **미커버 54모듈 확장 + 원문 도판 삽입 파이프라인** — 기존 30모듈(이미지 0장) 보강 + 신규 54모듈 작성으로 **최종 84모듈**(개발30·제조13·재료22·장비19) 완성. **이미지 파이프라인 신설**: 후보 추출(`extract-figures.py`, self_attributed/third_party/boilerplate/photo 자동 분류) → `prepare-images.sh`(sips 리사이즈·압축) → `ImageFigure` 삽입 → **저작권 3중 방어**(스크립트 플래그 → 병렬 에이전트 육안 확인 → 메인 루프 원문 직접 대조)로 ALPS CAD 도면·ANSYS 워터마크·IBM 특허 인용·네이버지식백과·카탈로그 실사 등 플래그 누락 다수를 실제 적발·배제. **병렬 에이전트 32기**(제조 13 + 장비 19, Sonnet)로 4차 배치 완주, 도판 **144장** 신규 삽입(제조 66 + 장비 78). `optical-equipment-maintenance`는 원문 도판 38건 전량이 제3자 매뉴얼 출처로 판정되어 0장·푸터 v1 유지가 정당한 예외. Gap 분석 97%(9항목 가중), 게이트 전부 통과(validate 84파일 0 ERROR·cross-link 84섹션 엣지455·typecheck·lint·build 163페이지·SSR 중첩0·용량 30MB/40MB). Branch `feat/ncs-semiconductor`(이어감), 커밋 미완료(archive 후 예정) |
| [daegu-safety-enrichment](./daegu-safety-enrichment/) | 2026-07-15 | 96% | 0 | 1 세션 | 대구반도체고 「반도체 공정기초」(daegu-hs-process) **10개 단원 전부에 소주제 앵커 안전 콘텐츠 보강** — 유해인자 책(1∼17장)·OSHA SCS(Part 1A∼4)에서 발췌 근거(파일:라인)와 함께 추출한 안전 팩트로 `Callout type="warning"` **29개** 삽입("팩트→통제→더보기" 3단 서사, 해요체). **`SourceRef` 신설**(ChapterRef의 자료원 범용판 인라인 칩, 실사용 20개, mdx-components 전역 등록) + `_links.json` hazards 10종·chemicals 23종 태깅으로 cross-link 엣지 **651**(신규 통제 어휘 0). **R-1 사실 검증: 10단원 23개 팩트 원문 grep 전건 일치·사실 오류 0**(아르신 0.005ppm·실란 TNT 9배·860μT·IPA 인화점 11.7℃ 등). Check 96%(Design skip — daegu-hs-textbook §4 계약 준용) 후 Minor 2건 반영(보조 링크 4건: Part 1A·1B·4·ch14 / HF "24시간"→원문 "몇 시간" 정합). 게이트 전부 통과(cross-link unknown 0·typecheck·lint·build 174p SSG·quotes diff 0), 비목표 위반 0(교과서 본문·책·OSHA 무수정). ⚠️ 안전 수치·표현 사람 검수 권장. Branch `main`, 커밋 미완료(archive 후 사용자 요청 시) |
| [hs-assembly-inspection](./hs-assembly-inspection/) | 2026-07-17 | 100% | 0 | 1 세션(~3.5h) | 에이치앤지 「반도체 조립·검사」(김경원 외 3인, 충북교육청 인정 15-충북-63-고교-19-004 — P3·P4와 같은 시리즈 3권째, 5,662줄 OCR) **6대단원 12중단원 전량 3단 레이어 재구성** — 사이트 **10번째 자료원**(MDX 1,937줄·RT 123분·order 10), **첫 후공정 권**. 당일 완결(11:10→14:40Z), **Match Rate 100%**(raw 98.6% → Low-1 diebond 모델명 4회=상이 4종 각 1회 맥락 종결)·iterate 0. 파일럿 packaging-overview 게이트 후 **5배치 병렬 Sonnet 전원 1차 성공** — 단, 서브에이전트 파일 쓰기가 격리/지연 반영되는 환경 이슈를 산출물 실존 게이트로 적발, **텍스트 반환 방식 전환**으로 전량 회수. 실습과제 **13/13**(파티클 4건 — 원문 제목 이미지 손실 2건 발굴, 설계 1차 추정 2건보다 구현이 정확). 특칙 강화판 승계: 조작 시퀀스 0건·모델명 사례 수준·원문 이미지 0·footer 12/12. **"움직이는 기계의 안전" 학습 축 신설**(회전·협착·절단·레이저, 78건/9모듈) — P6·P7 재사용 권장. 연결: 로드맵 P5 비고(packaging Process 연결)를 **packaging 태깅+책 ch13 ChapterRef 5건**으로 이행 + NCS 4종(package-assembly-development 등) + P3 fab-cleanroom 권 간 + daegu(FR-10 초과). 게이트 전부 통과(typecheck·lint 0, build 12/12 SSG, cross-link 10 sources·138 sections·**800 edges**·unknown 0, quotes 214 회귀 0). **PR [#22](https://github.com/DrunkenZealnut/semiconductor-academy/pull/22) 머지 완료**(merge commit 4f24afd, 2026-07-17T20:30Z, base main; 커밋 4). CodeRabbit 리뷰 13건 검증 → 안전 Critical 3·문서 정합 3·경미 4 반영(fix 1772d59), 오탐/시리즈 패턴 3건(basePath·deep.quote·모델명) 반박(PR 코멘트). 재리뷰 추가 지적 0 |
| [hs-equipment-maintenance](./hs-equipment-maintenance/) | 2026-07-18 | 96% | 0 | 1 세션 | 「반도체 장비 유지 보수」(왕현철 외 3인, 충남반도체마이스터고 — **2022 개정·충남 인정 22-충남-78-고교-26-007**, P3~P5 에이치앤지와 다른 시리즈, 7,048줄 OCR **시리즈 최대급**) **5대단원 22중단원 → 병합 14모듈 재구성** — 사이트 **11번째 자료원**(MDX 2,634줄·RT ~131분·order 11), **8권 교과서 카테고리 신규 8권 완주**. Match 96% → **Gap 3건(P2) 전건 수정 → 실질 100%**·iterate 0. 파일럿 industry-trend 게이트 후 **6배치 병렬 Sonnet**(A 공정3·B 요소4·C 설계콘셉트기구·D 전장제어SW·E 관리개론셋업·F 장비별PM). 판권 R-1 Design 선행 해소(판권 페이지 6988~ 대조). Ⅱ 공정장비 P3·P4·P5 정면 중복 → **"장비 하드웨어·정비 관점"+권 간 위임**, Ⅲ 요소기술·Ⅴ 관리 신규 집중, Ⅳ 설계 P2 CAD 방식. **"정지 상태 정비 안전" 학습축 신설**(LOTO·인터로크·EMO·안전PLC IEC61508·SEMI S2/S8) — P5 "움직이는 기계의 안전" 확대. 연결 **시리즈 최다**: NCS 장비 트랙 24건/16섹션(FR-7 6배·로드맵 비고 이행)+P1~P5 권 간 18+책 ch5~14 ChapterRef 16(dead-link 0). Gap 수정: G-1 크라이오 온도 −260℃ 통일·G-2 모델명 일반화·G-3 industrial-hygiene 태깅. 게이트 전부 통과(typecheck·lint 0, build 270p SSG 14/14, cross-link 11 sources·152 sections·**857 edges**·unknown 0, quotes 214 회귀 0). ⚠️ 안전 수치·표현 사람 검수 권장. Branch `main`, 커밋 미완료(archive 후 사용자 요청 시) |
| [menu-restructure](./menu-restructure/) | 2026-07-19 | 98% | 0 | 1 세션 | 헤더 네비 **7개 항목 → 4개 축(자료원 드롭다운·공정·유해물질 사전·검색)** 재구성. 자료원 12개(독립 3 + 반도체 고등학교 교과서 9)를 `getOrderedSources()` 파생 드롭다운(데스크톱)/`Disclosure` accordion(모바일)으로 order 순 노출 — **하드코딩 없이 자료원 추가 시 자동 반영**. `SourcesDropdown.tsx` 신규(a11y: `aria-haspopup`·`aria-expanded`·`role=menu/menuitem`, ESC+포커스복귀, 외부클릭 닫힘). 책 차례·직업병·소개는 자료원 드롭다운/기존 Footer로 이관(접근성 손실 0). 검색은 MVP `/quotes/` 재사용(통합 `/search/`는 후속 feature로 유보). Match 98%(Gap 0건) 후 **`/simplify` 4관점 병렬 리뷰**로 `sources.ts`에 `getGroupedSources()` 셀렉터 신설 — Header·SourcesDropdown·(기존)SourcePicker 3곳에 복제돼 있던 category 그룹핑 로직을 도메인 레이어로 통합, `'hs-textbook'` 하드코딩 제거로 향후 category 추가 시 무음 탈락 위험 해소(화면 동작 불변, 순수 리팩터링). 신규 의존성 0. 게이트 전부 통과(typecheck·lint 0, build 정적 export 281페이지). Branch `DrunkenZealnut/menu-재구성`, 커밋 미완료(archive 후 사용자 요청 시) |

---

## 기록 정책

- `--summary` 옵션 사용 시: `.bkit/state/pdca-status.json`에 가벼운 summary 보존 (phase·matchRate·시점·archivedTo)
- Plan/Design/Analysis/Report 문서는 `docs/archive/YYYY-MM/{feature}/` 폴더로 이동

## 후속 백로그 (chapters-source-fidelity 파생)

- **ch17 재작성**: 원문 추출본이 제목+소개 문단에서 끊겨 이번 범위 제외 → 원본 PDF에서 17장(p.319∼333) 재추출 후 동일 스펙 적용. 구 페이지 표기(p.13∼16)·`~` 2건도 그때 정리
- **사람 검수 3건**: ch5 NH₄OH 교정 / ch13 FeCl₂ 표기 / ch13 SOP 핀 간격 — 원서 대조
- **나머지 10개 챕터 원문 대조 감사**: 이번엔 5개만 표본 감사. "위험 요약"·Callout에 원문 밖 상식이 스며드는 패턴을 나머지도 점검 권장
- **`/process/*` 공정 페이지 심화**: 챕터가 자세해지며 공정 페이지(51∼106줄)가 상대적으로 얇아진 역전 상태 → 심화 또는 링크 문구 조정
- **`fig-8-2-pr.jpg` 리네임**: 파일명이 실제 내용(ASML 노광 장비)과 불일치(동작 무관)

## 후속 백로그 (ncs-image-expansion 파생)

- **firmware-development·flip-package-development 0장 사유 확인**: Phase 1(기존 보강) 당시 이 두 모듈만 이미지가 채택되지 않은 채 넘어감 — 원문 도판 재검토 후 보강 또는 optical처럼 "전량 부적격" 예외로 확정
- **합본 모듈 출처 구분자 통일**: `equipment-board-design`·`equipment-utility-software`는 `·`, `equipment-prototype-evaluation`·`equipment-quality-control`은 `, `로 LM 코드 구분자가 혼용됨 — 표기 통일 권장
- **사람 검수 목록 저작권 최종 판단**: `optical-equipment-maintenance`(0장 확정) 외 `etch-equipment`의 Picture 실사 3장(원문 출처 무표기, 관행상 수용) — 원저작권 소명 재검토 권장
- **커밋·PR**: 이번 사이클 변경분(84모듈 mdx·이미지 345장·레지스트리 3파일)이 아직 커밋되지 않음 — Phase별 PR 관행에 따라 Phase 4(제조+장비) 1건으로 커밋 필요

## 후속 백로그 (daegu-safety-enrichment 파생)

- **안전 서술 사람 검수**: Claude가 책·OSHA에서 발췌·재작성한 안전 Callout 29개 — 수치·표현의 전문가 검수 권장 (osha-ko 시리즈 선례)
- **커밋·PR**: 이번 사이클 변경분(MDX 10 + SourceRef.tsx + mdx-components.tsx + _links.json + 산출물)이 아직 커밋되지 않음 — 사용자 요청 시 진행
- **NCS 84모듈 안전 보강 검토**: 동일 SourceRef/Callout 패턴을 NCS 자료원에도 적용 가능 — 필요 시 별도 사이클

## 후속 백로그 (hs-assembly-inspection 파생)

- **커밋·PR**: PR [#22](https://github.com/DrunkenZealnut/semiconductor-academy/pull/22) **머지 완료**(merge commit 4f24afd). CodeRabbit 리뷰 13건 반영·반박 완료(fix 1772d59)

## 후속 백로그 (hs-equipment-maintenance 파생)

- **커밋·PR**: 이번 사이클 변경분(MDX 14 + `_links.json` 신규 + `sources.ts`·`schoolTextMdx.tsx`·`cross-link.json` 수정)을 PR #23으로 반영 — CodeRabbit 리뷰 대응 커밋 포함
- **안전 서술 사람 검수**: "정지 상태 정비 안전" Callout·크라이오 극저온/RF/유해가스 라인 정비 안전 수치의 전문가 검수 권장(시리즈 선례)
- **병렬 배치 공통 상수 사전화**: G-1(크라이오 온도 −260℃ vs −196℃ 배치 간 불일치)은 병렬 배치 B/F가 공통 상수를 각자 서술해 발생 — 배치 스펙에 **공통 수치 사전(용어·상수표)** 포함을 시리즈 표준 게이트로 승격 권장
- **P7(인프라 일반)**: 로드맵 잔여 1권 — 별도 Plan 착수 시 원문 인벤토리·모듈 재산정. 이 권의 "요소 기술·유지보수 각도"를 인프라(전력·가스·용수·배기)로 확대 가능
- **P6·P7 권별 후속 사이클**: `hs-textbook-collection.plan.md` §5.3 로드맵의 남은 2권 — 시리즈 계약(장비 일반화 특칙 강화판·실습과제 단위 재구성·권 간 연결) 5권 연속 유효, 재사용 권장
- **"움직이는 기계의 안전" 축 확대**: P5에서 신설한 회전·협착·절단·레이저 물리 위험 프레임을 P6(유지보수 = 기계 정지 상태 안전)·P7(일반 근로자 안전)에 맥락 적응 확대 + 로드맵 문서에 "후공정 보정 가이드" 명시 권장
- **설계 문서 경미 주석 4건**: Check에서 확인된 계약 위반 아닌 설계 지연(§3 particle 실습 2→4건 등) — `archive/2026-07/hs-assembly-inspection/design.md`에 실측값 주석 반영은 선택
- **동적 게이트 grep multiline**: `UDC 300(:87-88, 줄바꿈 분리)` 같은 케이스가 단일라인 grep에 미검출 — 향후 게이트에서 multiline 또는 수동 원문 대조 강제 권장
