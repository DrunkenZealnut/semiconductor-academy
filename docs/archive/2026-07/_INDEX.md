# Archive Index — 2026-07

| Feature | Archived | Match Rate | Iter | 시간 | Note |
|---------|:--------:|:---:|:---:|:---:|------|
| [chapters-source-fidelity](./chapters-source-fidelity/) | 2026-07-11 | 96% | 0 | 3 세션(쿼터 3회) | 책 「반도체 산업의 유해인자」 **ch1∼16 학습 페이지 원문 충실 전면 재작성**(ch17은 원문 미추출로 제외). 본문 3,797→7,735줄(2.04배), 책 인용 91→**187**개(SourceQuote 74→170). 파일럿 ch12로 콘텐츠 계약(quotes 추출 스크립트 의존 구조) 검증 → Design을 자기완결 작업 스펙으로 문서화 → **Sonnet 서브에이전트 15 병렬 + Fable 검증** 체제로 완주. 페이지 인용을 책 목차·마커 기준 전면 교정, **이미지 캡션-실물 불일치 전수 정리**(원문 그림 18장 신규·무관 이미지 6장 삭제·`_credits.json` 전량 동기화), `chapters.json` readingTime 14건 재산정. **QA 라운드**: Playwright 렌더 실측(hydration 각주 p-중첩 19곳 div 전환 / 모바일 표 overflow-x 래퍼 / 인라인 ChemicalCard 4건 분리) + 원문 대조 감사 5챕터(ch2 97%·ch7 97%·ch8 96%·ch14 96%, Critical 창작 5건 수정). 게이트 전부 통과(typecheck·lint·정적 build·quotes·cross-link 회귀 0). Critical/Major 0(QA 후), 사람 검수 대기 Minor 3(NH₄OH/FeCl₂/SOP 핀 간격). ⚠️ Claude 초벌(안전·보건 수치 원서 검수 권장). Branch `feat/chapters-source-fidelity`, 커밋 3(feat+fix+archive) |
| [ncs-image-expansion](./ncs-image-expansion/) | 2026-07-14 | 97% | 0 | 1 세션 | NCS 반도체 학습모듈 **미커버 54모듈 확장 + 원문 도판 삽입 파이프라인** — 기존 30모듈(이미지 0장) 보강 + 신규 54모듈 작성으로 **최종 84모듈**(개발30·제조13·재료22·장비19) 완성. **이미지 파이프라인 신설**: 후보 추출(`extract-figures.py`, self_attributed/third_party/boilerplate/photo 자동 분류) → `prepare-images.sh`(sips 리사이즈·압축) → `ImageFigure` 삽입 → **저작권 3중 방어**(스크립트 플래그 → 병렬 에이전트 육안 확인 → 메인 루프 원문 직접 대조)로 ALPS CAD 도면·ANSYS 워터마크·IBM 특허 인용·네이버지식백과·카탈로그 실사 등 플래그 누락 다수를 실제 적발·배제. **병렬 에이전트 32기**(제조 13 + 장비 19, Sonnet)로 4차 배치 완주, 도판 **144장** 신규 삽입(제조 66 + 장비 78). `optical-equipment-maintenance`는 원문 도판 38건 전량이 제3자 매뉴얼 출처로 판정되어 0장·푸터 v1 유지가 정당한 예외. Gap 분석 97%(9항목 가중), 게이트 전부 통과(validate 84파일 0 ERROR·cross-link 84섹션 엣지455·typecheck·lint·build 163페이지·SSR 중첩0·용량 30MB/40MB). Branch `feat/ncs-semiconductor`(이어감), 커밋 미완료(archive 후 예정) |

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
