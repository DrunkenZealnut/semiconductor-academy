# Design — 「반도체 장비 유지 보수」(충남반도체마이스터고) 자료원 — 5대단원 14모듈

> **Feature**: `hs-equipment-maintenance` · **작성일**: 2026-07-18 · **기준**: `docs/01-plan/features/hs-equipment-maintenance.plan.md` §1~11
> **Plan 결정 반영**: 병합 **14모듈**(§9-3 잠정 확정 13~14 중 14 채택) · Ⅱ 연결 위임(§9-4) · 판권 확정(§9-5, 아래 §2) · 파일럿 Ⅰ(§9-2)

원문 구조 정밀 매핑 완료(7,048줄 전수 스캔): 대단원 순서 정상(Ⅰ→Ⅴ), 22중단원, Ⅳ 설계기술 5중단원 복원, 본문 162~6053행·말미 비본문 6055행~.

---

## 1. 아키텍처 확장 — 신규 인프라 없음

`hs-textbook-collection` 카테고리 인프라 그대로 재사용. 신규 파일: MDX 14 + `_links.json` 1. 코드 수정 2파일(`sources.ts`·`schoolTextMdx.tsx`)뿐.

- `sources.ts`에 `HS_EQUIPMENT_MAINTENANCE` 등록(order 11) + sections 14.
- `schoolTextMdx.tsx` REGISTRY에 14모듈 로더.
- 공용 `[module]` 라우트·SourcePicker·기존 10자료원 무수정.

---

## 2. Source 등록 (`sources.ts`) — 판권 확정

원문 판권 페이지(6988~7048행) 대조로 **R-1 해소**:

| 항목 | 값 |
|---|---|
| Source id | `hs-equipment-maintenance` |
| URL | `/sources/hs-equipment-maintenance/` |
| title | 반도체 장비 유지 보수 |
| attribution | 왕현철 외 3인 |
| publisher | 충남반도체마이스터고등학교 |
| license | `fair-use` |
| order | 11 · accent `school` · category `hs-textbook` |

- **지은이**: 왕현철 외 3인(집필위원: 권용호·이중한·서구영·임해문·양원준 등). **개발**: 충남반도체마이스터고등학교. **발행·공급**: 교육출판 세종. **편찬**: 충남대 능력중심교육과정 교과서연구소. **심의**: 충청남도교육청.
- **인정**: 교육부장관 위임 충청남도교육감 2026-02-13 인정(22-충남-78-고교-26-007), 2022 개정 교육과정, **2026-03-01 초판**.
- 출처 표기 문구: **"「반도체 장비 유지 보수」(왕현철 외 3인 지음, 충남반도체마이스터고등학교)"**.
- 저작권: P3~P5와 발행 주체가 다르나(학교 발행·2022 개정) **최보수 원칙 동일 적용** — 원문 이미지 0·문장 전면 재작성·NCS 학습모듈(참고문헌 LM코드) 간접 재사용 차단.

---

## 3. 섹션 전체 설계 — 14모듈 (원문 라인 경계 확정)

트랙(group) 5개 — 대단원 순서. RT 합 ~131분.

| # | slug | 대단원·중단원 | 원문 라인 | 줄수 | RT | group |
|---|------|------|:---:|:---:|:---:|------|
| 1 | `industry-trend` | Ⅰ.01 산업 이해 + 02 장비 직무 | 162–658 | ~497(중복 dedup 후 ~380) | 8 | 장비 산업 동향 |
| 2 | `process-wafer-photo` | Ⅱ.01 웨이퍼 제조 + 02 포토 장비 | 660–1055 | ~396 | 8 | 공정 장비 |
| 3 | `process-etch-deposition` | Ⅱ.03 에칭 + 04 증착 장비 | 1056–1500 | ~445 | 9 | 공정 장비 |
| 4 | `process-frontend-backend` | Ⅱ.05 전공정(이온주입·열산화·CMP·세정·측정) + 06 후공정(다이싱·본딩·패키징·검사) | 1501–2155 | ~655 | 10 | 공정 장비 |
| 5 | `element-vacuum-gas` | Ⅲ.01 진공 + 02 가스 공급 | 2157–2506 | ~350 | 9 | 요소 기술 |
| 6 | `element-plasma` | Ⅲ.03 플라스마 | 2507–2613 | ~107 | 6 | 요소 기술 |
| 7 | `element-pneumatic-thermal` | Ⅲ.04 공압 + 05 온도 제어 | 2614–2954 | ~341 | 9 | 요소 기술 |
| 8 | `element-power` | Ⅲ.06 전원 공급 | 2955–3197 | ~243 | 7 | 요소 기술 |
| 9 | `design-concept-mechanical` | Ⅳ.01 콘셉트 + 02 기구 설계 | 3199–4023 | ~825 | 15 | 설계 기술 |
| 10 | `design-electrical` | Ⅳ.03 전장 설계 | 4024–4322 | ~299 | 9 | 설계 기술 |
| 11 | `design-control-software` | Ⅳ.04 장비 제어 + 05 S/W 설계 | 4323–4955 | ~633 | 12 | 설계 기술 |
| 12 | `maintenance-fundamentals` | Ⅴ.01 유지보수 개론(PM/BM·TPM·SEMI) | 4957–5251 | ~295 | 9 | 장비 관리 |
| 13 | `maintenance-setup` | Ⅴ.02 장비 셋업(절차·검수·운영중 정비) | 5252–5411 | ~160 | 6 | 장비 관리 |
| 14 | `maintenance-by-type` | Ⅴ.03 주요 장비별 유지보수(진공·광학·열·검사·이송) | 5412–6053 | ~642 | 14 | 장비 관리 |

- **13 vs 14 결정**: Ⅲ 요소기술을 4묶음(진공+가스 / 플라스마 단독 / 공압+온도 / 전원)으로 → 14모듈. **플라스마 단독(#6)** 은 RF·유해인자 밀집(플라스마 111·RF 53)으로 분리가 타당. Plan 범위(13~14) 내.
- **대형 모듈**: #9(~825줄, Ⅳ.02 기구설계 523줄 포함)·#14(~642줄, 안전보건 핵심)·#4(~655줄). P4 Ⅲ.2(1,330줄) 선례 범위 내 — RT 상향으로 단독 소화, 분할 안 함.
- **말미 비본문 제외**: 6055행부터(정답·색인·참고문헌·판권·체크리스트) 재구성 대상 아님. #14 끝을 6053행으로 확정.

---

## 4. 콘텐츠 재구성 계약 (시리즈 계약 승계 + 이 권 특유 규칙)

### 공통 원칙 (변경 없음)
3단 레이어(Hook→Easy→Deep), 원문 이미지 0, 문장 전면 재작성, 조건·수치 보존, 출처 표기 14/14, 안전 유의사항 전건 보존.

### 이 권 특유 규칙 (#1~#7)

1. **특칙 초점 이동 — 조작 시퀀스 거의 없음**: 원문 전수 스캔 결과 "버튼→화면" 절차형 조작 매뉴얼 서술은 **사실상 부재**(함수키 0건, 버튼/화면/터치 17건은 전부 Ⅳ.04 HMI **설계 스펙** 또는 Ⅴ 점검 단계명). → P3~P5의 "조작 시퀀스 재현 금지" 특칙은 **저부담 유지**하되, 초점을 **제조사 매뉴얼·설계 스펙 간접 재사용 차단 + NCS 학습모듈 문장 비재현**으로 이동. Ⅳ.04 HMI/터치패널은 "조작 지문"이 아니라 "설계 관점"이므로 개념 서술 허용.

2. **Ⅱ 공정 장비 연결 위임(얇게)** — Plan §9-4: #2~#4는 포토·에칭·증착·후공정이 P3·P4·P5·책 공정 챕터와 정면 중복. **신규 서술 최소**, 각 장비를 "장비 하드웨어·정비 관점"으로만 얇게 서술하고 개념은 **권 간 SourceRef + 책 ChapterRef로 위임**(§5). 특히 #4의 후공정(다이싱·본딩·패키징·검사)은 P5(`hs-assembly-inspection`)와 최대 중복 → 링크 우선.

3. **Ⅲ 요소기술·Ⅴ 관리 집중(신규 콘텐츠)**: 진공·가스·플라스마·공압·온도·전원(#5~#8)과 유지보수 이론·셋업·장비별 PM(#12~#14)은 사이트 신규 내용. 서술 자원 집중, TPM·SEMI 표준(S2/S8)·PM/BM을 3단 레이어로 신규 재구성.

4. **Ⅳ 설계기술 = 신규 유형(P2 선례)**: 콘셉트·기구·전장·제어·S/W 설계(#9~#11)는 P2 `hs-basic-tech-2`(CAD) 방식 — 개념·워크플로 중심, 도구/HMI 조작 비재현. 전장 설계(#10)의 인터로크·비상정지(EMO)·안전PLC(27건 밀집)는 **안전 설계 관점**으로 부각.

5. **안전 축 — "정지 상태 정비 안전"(Plan FR-10) + 갭 보강**: LOTO(Ⅴ.03, 4건 실존)·인터로크/비상정지(Ⅳ.03, 27건)·감전(4건)·방사선(SEMI S2)·중량물(SEMI S8)을 학습 축으로. **원문 부재 항목**(고소작업·밀폐공간 질식·낙하·PPE·MSDS = 0건)은 **창작 금지** — 대신 책 ch·OSHA 발췌 근거로 보강 가능한 것만 `Callout`/`ChapterRef`로 연결(daegu-safety-enrichment 방식), 나머지는 무리하게 넣지 않음.

6. **OCR 노이즈 대응**: ① 162–274행 **중복 블록**(Ⅰ division 2회 인쇄) → dedup, 275행부터 유니크. ② 원문자 이모지(🚺=① 112회+, 🔁🛐🖪 등) → 정상 번호/불릿 복원. ③ 오식("교등학교"→고등학교, "확습 목표"→학습목표, "바도치"→반도체, "딘원 평기"→단원 평가) 정정. ④ 표 파편·캡션 쓰레기(2197–2204 등)는 재구성 보류. ⑤ 페이지 헤더/푸터 평문 삽입(781·1629 등) 제거.

7. **모델·제조사명**: 원문 모델명 언급이 P3~P5보다 적음. 특정 제조사 스펙·매뉴얼 수치는 "이 유형 장비의 대표 값" 문맥으로만, 제조사 매뉴얼 재현 차단(특칙 이중 방어).

---

## 5. cross-link 태깅 전략 (`hs-equipment-maintenance/_links.json`)

**본문 실증 기준 태깅 + 권 간 연결 최대**(로드맵 비고 "NCS 장비 트랙과 강한 교차" 실증). topics는 각 장비의 공정 대응으로 책 챕터·P3~P5·NCS 장비 자동 상호 연결.

| 모듈 | topics | hazards | 권 간·책·NCS 연결(SourceRef/ChapterRef) |
|---|---|---|---|
| industry-trend | — | — | NCS `equipment-*` 직무 개요 |
| process-wafer-photo | `wafer-fab`, `photolithography` | — | 책 ch5·ch8 + **P3** `hs-photo-etch` + NCS `photo-equipment` |
| process-etch-deposition | `etching`, `deposition` | — | 책 ch9·ch10 + **P3·P4** + NCS `etch-equipment`·`thinfilm-diffusion-equipment` |
| process-frontend-backend | `ion-implantation`, `cmp`, `packaging` | — | 책 ch11·ch12·ch6·ch13 + **P5** `hs-assembly-inspection` + NCS `packaging-front/back-equipment`·`metrology-equipment`·`clean-cmp-equipment` |
| element-vacuum-gas | `gas-safety`, `compressed-gas`, `engineering-controls` | `compressed-gas`, `toxic` | 책 ch14 + NCS `equipment-utility-software` |
| element-plasma | `engineering-controls` | — | 책 ch9(플라스마 식각) + P3 |
| element-pneumatic-thermal | `compressed-gas`, `engineering-controls` | `compressed-gas` | P2 `hs-basic-tech-2`(공압) 권 간 |
| element-power | `engineering-controls` | — | P1 `hs-basic-tech-1`(전기) 권 간 |
| design-electrical | `engineering-controls` | — | NCS `equipment-electrical-design`·`equipment-safety`(인터로크·안전PLC) |
| design-control-software | — | — | NCS `equipment-system-software`·`equipment-utility-software` |
| maintenance-by-type | `engineering-controls`, `ppe`, `industrial-hygiene` | `compressed-gas`, `cryogenic` | NCS **`optical-equipment-maintenance`·`equipment-safety`·`equipment-quality-control`** + 책 ch(정비 유해인자) |

- `maintenance-fundamentals`·`maintenance-setup`·`design-concept-mechanical`은 본문 실증 시 `engineering-controls`/`industrial-hygiene` 추가(Do에서 확정).
- chemicals: 원문 화학물질 직접 서술 희박 — 가스(CF₄·SF₆ 등 식각 가스 언급)는 topic 연결로 충분, **본문 실증분만 태깅**(과태깅 금지, 시리즈 원칙).
- 기대 효과: `equipment-maintenance`가 NCS 장비 트랙 24모듈·P1~P5 전권·책 ch5~14와 연결되는 **사이트 최다 교차 자료원**.

---

## 6. 검증 계획 (시리즈 게이트 승계)

- typecheck·lint·build 무오류, 14/14 SSG.
- cross-link: 11 sources·~152 sections 정합·unknown 0, quotes 회귀 0.
- 특칙: 조작 시퀀스 스캔(버튼·F키·터치 연쇄) — 원문부터 저밀도이나 재현 0 확인.
- OCR 정제: 중복 블록·이모지·오식 잔존 스캔(🚺·"확습"·"딘원" 0).
- 저작권: 원문 이미지 0·근접 패러프레이즈 스캔·NCS 학습모듈 문장 비재현·출처 14/14.
- 연결: NCS 장비 트랙 4건+·P1~P5 권 간·책 ch ChapterRef 실측(로드맵 비고 이행).
- 안전: LOTO·인터로크·SEMI 표준 학습 축 명시, 원문 부재 항목 창작 0.
- 렌더 실측: 홈 8번째 교과서 카드·5트랙·3단 레이어·hydration 중첩 0.

---

## 7. 구현 순서 (시리즈 표준)

1. **파일럿**: #1 `industry-trend` 직접 작성(162–274 중복 dedup·오식 정제 실증) → 게이트 통과 확인(로더·라우트·렌더·태깅).
2. **병렬 확대(Sonnet 서브에이전트 + 텍스트 반환 방식 — P5 환경 이슈 대응)**: 배치별 공통 스펙 파일 기반, 메인이 직접 Write. 배치안(대형 단독):
   - A: #2·#3·#4 (공정 장비 3 — 연결 위임형, 얇게)
   - B: #5·#6·#7·#8 (요소 기술 4 — 신규 콘텐츠 집중)
   - C: #9 (설계 콘셉트+기구, ~825줄 단독)
   - D: #10·#11 (전장·제어·S/W 설계)
   - E: #12·#13 (유지보수 개론·셋업)
   - F: #14 (장비별 PM, ~642줄 안전보건 핵심 단독)
3. 전건 Fable 리뷰(원문 대조·근접 패러프레이즈·안전 사실), cross-link·quotes 게이트, 렌더 스모크.
4. → `/pdca analyze hs-equipment-maintenance`(Check).
