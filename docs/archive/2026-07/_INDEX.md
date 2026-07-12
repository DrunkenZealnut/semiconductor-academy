# Archive Index — 2026-07

| Feature | Archived | Match Rate | Iter | 시간 | Note |
|---------|:--------:|:---:|:---:|:---:|------|
| [chapters-source-fidelity](./chapters-source-fidelity/) | 2026-07-11 | 96% | 0 | 3 세션(쿼터 3회) | 책 「반도체 산업의 유해인자」 **ch1∼16 학습 페이지 원문 충실 전면 재작성**(ch17은 원문 미추출로 제외). 본문 3,797→7,735줄(2.04배), 책 인용 91→**187**개(SourceQuote 74→170). 파일럿 ch12로 콘텐츠 계약(quotes 추출 스크립트 의존 구조) 검증 → Design을 자기완결 작업 스펙으로 문서화 → **Sonnet 서브에이전트 15 병렬 + Fable 검증** 체제로 완주. 페이지 인용을 책 목차·마커 기준 전면 교정, **이미지 캡션-실물 불일치 전수 정리**(원문 그림 18장 신규·무관 이미지 6장 삭제·`_credits.json` 전량 동기화), `chapters.json` readingTime 14건 재산정. **QA 라운드**: Playwright 렌더 실측(hydration 각주 p-중첩 19곳 div 전환 / 모바일 표 overflow-x 래퍼 / 인라인 ChemicalCard 4건 분리) + 원문 대조 감사 5챕터(ch2 97%·ch7 97%·ch8 96%·ch14 96%, Critical 창작 5건 수정). 게이트 전부 통과(typecheck·lint·정적 build·quotes·cross-link 회귀 0). Critical/Major 0(QA 후), 사람 검수 대기 Minor 3(NH₄OH/FeCl₂/SOP 핀 간격). ⚠️ Claude 초벌(안전·보건 수치 원서 검수 권장). Branch `feat/chapters-source-fidelity`, 커밋 3(feat+fix+archive) |

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
