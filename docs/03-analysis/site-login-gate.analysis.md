# Gap Analysis — 사이트 로그인 게이트 (저작권 보호)

> **Feature**: `site-login-gate` · **분석일**: 2026-07-16 · **분석**: gap-detector Agent
> Design: `docs/02-design/features/site-login-gate.design.md` · Plan: `docs/01-plan/features/site-login-gate.plan.md`
> 범위: **파일 코드 대 설계 정합성**(typecheck/lint/build·curl 런타임 검증은 메인 세션에서 기실행)

---

## Match Rate: **100%** ✅ (기준 90% 이상 — Act 불필요)

*가중치는 기능·보안 핵심도 순. 의도적 변경 4건(a~d)은 감점 대상이 아니라 "Design 문서 갱신 필요"로 별도 분류(분석 직후 Design 문서에 반영 완료).*

| 검증 항목 | 가중치 | 점수 | 근거 |
|---|:---:|:---:|---|
| §2.2 session.ts 크립토 코어 | 20% | 100% | 포맷 `{exp}.{sig}`·HMAC-SHA256 sign/verify 전부 Web Crypto, Buffer 0. `verifySessionToken`의 try/catch가 모든 실패 경로에서 false 반환 |
| §2.3 쿠키 옵션 | 10% | 100% | httpOnly·secure=NODE_ENV==='production'·sameSite='lax'·path='/'·maxAge=MAX_AGE_SECONDS 5항목 일치 |
| §3 middleware(위치+matcher) | 18% | 100% | **`src/middleware.ts`에 위치**(루트 부재 확인 — Plan 오기 정정 반영). matcher 7개 제외 목록 §3.1과 동일. `.next/server/middleware.js` 컴파일 산출물로 실제 인식 확인 |
| §4.1 login route(FR-4·timingSafe) | 15% | 100% | `node:crypto` timingSafeEqual + 길이불일치 더미비교, id/password 실패를 단일 401(`invalid_credentials`)로 통합(FR-4) |
| §4.2 logout route | 5% | 100% | 쿠키 삭제(maxAge:0) 로직 설계와 일치 |
| §5.1 login UI + metadata | 10% | 100% | `buildMetadata({title:'로그인',path:'/login/'})` 등 설계 의도와 일치. Suspense·isSafeRedirect·폼 로직 동일 |
| §5.2/5.3 LogoutButton + Header | 8% | 100% | Header 데스크톱 nav·모바일 아이콘 바 양쪽에 삽입 |
| §6 next.config.mjs | 6% | 100% | `output:'export'` 제거, 나머지 설정(images.unoptimized 등) 유지 |
| §7.1 .env.local.example | 3% | 100% | 3키(ID/PW/SESSION_SECRET) 구성 일치 |
| Plan FR/NFR 충족 | 5% | 100% | FR-1~6·NFR-1~7 구조적 충족 |

---

## Design 문서 갱신 필요 (의도적 변경 4건 — 감점 아님, 분석 후 즉시 반영 완료)

Do 단계에서 발견된 정당한 수정. 코드가 옳고 Design 문서가 뒤따라야 했던 항목 — **이 분석 직후 Design 문서에 반영 완료**.

| # | 변경 | 이유 | 부작용 검증 |
|:-:|---|---|---|
| a | `fromBase64Url` 반환 타입 `Uint8Array<ArrayBuffer>` 명시 | TypeScript 5.9 TypedArray 제네릭화 대응 | `crypto.subtle.verify` 인자 타입 통과, 런타임 영향 0 |
| b | `import 'server-only'` 제거 | 패키지 미설치 — 신규 의존성 대신 제거 | 소비처가 middleware·Route Handler 2곳뿐(grep으로 클라 import 0 확인), 시크릿도 `NEXT_PUBLIC_` 미접두라 유출 경로 없음 |
| c | 로그인 폼을 `page.tsx` 인라인 대신 `LoginForm.tsx`로 분리 | `'use client'` + `metadata` export 동시 불가 | 기존 `chemicals/page.tsx` + `ChemicalSearch.tsx` 관례와 동형 |
| d | `fetch('/api/login')`→`/api/login/`, logout·`router.push`도 동일 | `trailingSlash:true`라 슬래시 없으면 308 리다이렉트 | 슬래시 부착으로 우회, 클라 내비까지 일관 적용 |

---

## Gap 목록 및 처리 현황

기능·보안 갭 0건. 문서 동기화/관찰 항목만 존재.

| # | 심각도 | 내용 | 처리 |
|:-:|:---:|---|---|
| 1 | doc | 의도적 변경 a~d가 Design 문서에 미반영 | ✅ **수정 완료** — Design §2.2·§5.1·§5.2에 반영, 코드 블록 최종본으로 교체 |
| 2 | observe | login route가 `SITE_AUTH_SESSION_SECRET` 미설정 시 `createSessionToken()`에서 미포착 예외→500(ID/PW만 사전 검사) | Design과 동일 구조(설계도 미검사) → 구현 갭 아님. env 3키 등록이 DoD 항목이라 실무 위험 낮음. 후속 견고화 후보로만 기록 |
| 3 | observe | `next.config.mjs`의 "GitHub Pages용 basePath" 주석 잔존 | Plan R-6이 이미 인지한 범위 밖 사항(CLAUDE.md 갱신은 별도 후속) — 이번 기능 갭 아님 |

---

## 잘 된 점

- **Edge 호환 크립토**: `session.ts`가 `btoa`/`atob`·`TextEncoder`·`Uint8Array`만 사용, Buffer 0(NFR-3 충족). `verifySessionToken`의 try/catch가 위조·손상 쿠키의 모든 실패 경로를 `false`로 흡수해 미들웨어 500을 원천 차단.
- **치명 결함 회피**: middleware가 정확히 `src/middleware.ts`(Plan의 "프로젝트 루트" 오기를 Design 단계에서 미리 정정)에 위치 — 컴파일 산출물로 실제 인식까지 확인.
- **타이밍·정보 노출 방어**: `timingSafeEqual` + 길이 불일치 시 더미 비교로 시간 균일화, ID/PW 실패를 단일 메시지로 통합(FR-4).
- **의도적 변경 4건 전부 무해**: 타입 명시·server-only 제거·폼 분리·trailing slash 모두 부작용 검증 통과, 특히 (b)는 grep으로 클라이언트 import 0을 확정.
- **관례 일치**: `LoginForm` 분리가 `chemicals` 페이지의 서버/클라이언트 분리 패턴과 동형. 시크릿(`SITE_AUTH_SESSION_SECRET`)을 로그인 비밀번호와 분리해 회전·유출 범위 독립.
- **런타임 검증(메인 세션 기실행)**: 미인증 리다이렉트·로그인 성공/실패·쿠키 발급/삭제·로그아웃 후 재게이트·위조 쿠키 안전 처리까지 curl로 실측, 전부 통과. `typecheck`·`lint`·`build` 무오류, 177페이지 정상 생성(기존 동적 라우트 회귀 없음).

---

## 결론

Match Rate **100%** ≥ 90% — **iterate 불필요, Report 진행 가능**. 파일 대 설계 비교에서 기능·보안 갭 0건. 유일한 실행 항목이던 "Design 문서를 의도적 변경에 맞춰 갱신"은 이 분석 직후 완료했다. observe 2건(SESSION_SECRET 미검사·주석 잔존)은 설계와 동일 구조이거나 범위 밖이라 후속 판단으로 남긴다.
