# Product Direction — 반도체 아카데미

> CEO 회고 리뷰 산출물 (2026-05-31). 창립 플랜 `docs/01-plan/features/semiconductor-academy-site.plan.md` 의 사후 점검에서 확정된 제품 정체성과 그에 따른 범위 결정. 이 문서가 자료원·사전·분석 관련 의사결정의 상위 기준.

## 확정 정체성 (Identity C)

**한국어 학술서 ↔ 영문 OSHA 규제자료를, 비전공자 눈높이에서, 공유 유해인자·물질로 잇는 다리.**

- 북극성 = **크로스링크 그래프** (자료원 간 다리). 책은 여러 자료원 중 하나.
- 차별화 = 아무도 안 하는 쐐기: KO 학술 ↔ EN 규제 자료를 layperson 레벨로 연결.
- "다 모으는 아그리게이터(B)"가 아니라 **좁은 쐐기**. "한 권만 푸는 사이트(A)"도 아님.
- 아키텍처(크로스링크 시스템, Source 모델, OSHA 통합)는 이미 이 방향에 투표 완료.

## 왜 C인가 (회고 근거)

- 인프라는 플랫폼급(manifest 소스 발견, 통제어휘, 빌드 인덱스)인데 콘텐츠·검증·메시징은 단일 책 수준에 머물러 있었음 → 인프라가 콘텐츠를 앞지른 상태.
- 비싼 크로스링크 인프라는 매몰비용 → C는 그걸 살리고 콘텐츠가 따라가게 함.
- "알 권리의 민주화"(창립 전제)는 어느 한 자료원보다 **다리**가 더 잘 섬김.

## 다리 품질 베이스라인 (2026-05-31 실측)

- 태깅 섹션: 22 (책 17 + OSHA 5) — 양 자료원 전 섹션 커버.
- **교차 물질 12종**(silane, HF, arsine, phosphine, diborane, dichlorosilane, chlorine, fluorine, BF₃, WF₆, IPA, 황산) = 쐐기의 척추. 사전이 12/12 전부 커버, unknownChemicals 0.
- 공유 topic 5 · 공유 hazard 5.
- **약점**: OSHA 태깅 불균형 — part-1a(chem 0/haz 0), part-1b(chem 0), part-4(chem 0). 다리가 part-2·part-3에 집중.

## 범위 결정 (이 정체성이 확정한 것)

| 항목 | 결정 |
|------|------|
| 유해물질 사전 | 창립 플랜 "100건+" **폐기**. 목표 = 교차 물질 + 각 자료원 핵심 물질 완비. 현재 충족, 기회 점증. |
| OSHA 범위 | 5파트 유지. 본문 완성도보다 **크로스링크 태그 밀도 우선** (part-1a/1b/4 보강). |
| 언어 | 전면 i18n 안 함. UI·설명 KO 유지, OSHA 원문 EN 그대로. |
| 분석 | **필수로 승격 → 구현 완료**. 호스팅을 Vercel로 전환하며 **Vercel Analytics**(섹션·챕터·파트 조회, SPA route 자동 추적) + **Speed Insights**(실사용자 Core Web Vitals) 네이티브 통합. GoatCounter 폐기. |
| 라이선스 | 자료원별 명시 (Source.license). About 페이지 반영 점검. |
| 메시징 | About·홈 카피를 "한 권을 쉽게" → "두 권위 자료를 잇는"으로. |

## NOT in scope (의식적으로 쳐낸 것)

- 전면 이중언어 i18n (KO 우선 유지)
- 무한 자료원 아그리게이션 (쐐기 흐림)
- AI 챗봇 / 퀴즈 (창립 플랜대로 차기 사이클)
- 회원 / 로그인 (정적 사이트 유지)

## 창립 플랜 대비 DoD 정정

- ❌→재정의: "사전 100건+" → "교차 물질 커버리지" (현재 충족)
- ✅ 원복: "Vercel 배포" → **호스팅 Vercel 전환 결정** (창립 플랜대로 복귀). `basePath`는 env 기반이라 Vercel에선 루트 서빙, `output: export` 유지로 무변경 배포 가능.
- ⚠️ 미실현: 타이포 Pretendard + JetBrains Mono (현재 미적용)
- ❓ 미검증: Lighthouse ≥90, WCAG 2.1 AA (실측 필요)

## 다음 한 수 우선순위 (회고 권고)

1. ✅ **분석 도입** — Vercel Analytics + Speed Insights 통합 완료 (Vercel 배포 후 데이터 수집 시작).
2. **Vercel 배포 실행** — `vercel login → link → --prod` (계정 인증 필요, 사용자 작업). 후 NEXT_PUBLIC_SITE_URL을 Vercel 도메인으로 설정.
3. **OSHA 태깅 보강** — part-1a/1b/4의 hazard·chemical 태그 채워 다리 균형화.
4. **검증 루프** — WCAG 실측 (성능은 Speed Insights RUM이 부분 커버). 
5. (점증) 메시징·라이선스 카피 갱신.
