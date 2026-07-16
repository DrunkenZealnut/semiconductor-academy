# Plan — 사이트 로그인 게이트 (저작권 보호)

> **Feature**: `site-login-gate`
> **작성일**: 2026-07-16 · **Level**: Dynamic
> **Status**: 기술 방향 확정 (A안 — Middleware 서버 인증, 사용자 확정 2026-07-16) · Design: [`site-login-gate.design.md`](../../02-design/features/site-login-gate.design.md)

---

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem (문제)** | 사이트가 완전 공개 상태라 「반도체 산업의 유해인자」 원저작물을 재구성한 콘텐츠를 저작권 허가 없이 누구나 열람·수집(크롤링)할 수 있다. 저작권 리스크를 낮출 접근 제한 장치가 없다. |
| **Solution (해법)** | 사이트 진입 시 로그인을 요구하고, `.env.local`에 정의한 고정 아이디·비밀번호 1쌍으로만 통과시키는 게이트를 추가한다. 다중 사용자·회원가입 없이 단일 공유 자격 증명으로 접근을 제한한다. |
| **Function·UX Effect (기능·UX 효과)** | 미인증 사용자는 모든 페이지에서 로그인 화면으로 리다이렉트되고, 로그인 성공 시 일정 기간 재로그인 없이 이용 가능. 검색엔진 크롤러도 로그인을 통과할 수 없어 콘텐츠가 자동으로 색인에서 배제되는 부수 효과도 있다. |
| **Core Value (핵심 가치)** | 원저작물 재구성 콘텐츠의 무단 접근·수집 위험을 낮춰 저작권 리스크를 완화하고, 정식 이용 허락 절차가 마련되기 전까지 콘텐츠를 안전하게 비공개로 운용할 최소한의 장치를 확보한다. |

---

## 1. 배경 및 기술 방향

### 1.1 현재 상태

| 항목 | 현황 |
|------|------|
| `next.config.mjs` | `output: 'export'` 설정 — 완전 정적 export, 서버 런타임 없음 (Middleware·API Route 동작 불가) |
| 실제 배포처 | Vercel. CLAUDE.md의 "GitHub Pages 배포" 기술은 구버전 — `deploy.yml` 삭제됨, PR마다 Vercel Preview가 자동 생성됨 |
| 인증 관련 기존 코드 | 없음 (`middleware.ts` 없음). `.env*`는 `.gitignore`에 이미 등록되어 있으나 실제 파일은 없음 |
| 정적 라우트 | `generateStaticParams` 사용 파일 7개 (chapter/process/chemicals/sources 등 동적 라우트) |

### 1.2 기술 방향 결정 — 인증 구현 방식 (⚠️ 확인 필요)

`output: 'export'`가 켜진 상태에서는 Middleware·API Route가 전혀 동작하지 않아 "서버에서 ID/PW를 검증하는 로그인"이 원천적으로 불가능하다. 세 가지 방식을 검토했다.

| 방식 | 설명 | 보안 수준 | 비용/제약 |
|------|------|:---:|------|
| **A. Middleware 서버 인증 (권장)** | `output: 'export'` 제거 → Vercel의 Next.js 서버 기능 사용. Middleware가 모든 요청의 쿠키를 검사하고, `.env.local`의 ID/PW는 서버에서만 대조 | 높음 — 자격 증명이 브라우저에 노출되지 않음 | 정적 export를 포기해 GitHub Pages 등 순수 정적 호스팅으로는 재배포 불가 (단, 실배포가 이미 Vercel이라 실질 영향은 적음) |
| B. 클라이언트 JS 게이트 | `output: 'export'` 유지. 브라우저 JS가 입력된 비밀번호를 대조한 뒤 콘텐츠를 표시 | 낮음 — 비밀번호가 빌드된 JS 번들에 그대로 포함되어 개발자도구로 누구나 확인 가능 | 배포 방식 100% 유지, 구현 간단 |
| C. Vercel Deployment Protection | 코드 변경 없이 Vercel 프로젝트 설정에서 비밀번호 보호를 켠다 | 매우 높음 — 에지에서 완전 차단 | Vercel Pro 이상 유료 플랜이 필요할 수 있고, 아이디 없이 단일 비밀번호만 지원해 "`.env.local`에 고정 아이디·비밀번호" 요청과 형태가 다름 |

**방식 A(Middleware 서버 인증)로 확정됐다(사용자 확정 2026-07-16).** 사용자 요청("고정된 아이디와 비밀번호를 `.env.local`로 적용")과 동기("저작권 문제")를 볼 때 실질적인 보호가 필요하다는 판단과 일치한다. 세부 설계는 [`site-login-gate.design.md`](../../02-design/features/site-login-gate.design.md) 참고.

---

## 2. 목표 (Goals) & 비목표 (Non-Goals)

### 2.1 목표

- [G1] 사이트의 모든 페이지는 로그인 전 접근 시 `/login`으로 리다이렉트
- [G2] `.env.local`에 정의된 고정 아이디·비밀번호 1쌍으로만 로그인 성공
- [G3] 로그인 성공 시 쿠키 기반 세션으로 일정 기간(예: 30일) 재로그인 없이 이용
- [G4] 로그아웃 기능 제공
- [G5] `output: 'export'` 제거에 따른 기존 정적 라우트·SEO·basePath 동작 회귀 없음 확인
- [G6] Vercel Production/Preview 환경변수 설정 절차 문서화 (`.env.local`은 로컬 전용이라 별도 등록 필요)

### 2.2 비목표 (이번 사이클 제외)

- 다중 사용자 계정, 회원가입, 비밀번호 재설정, OAuth/소셜 로그인
- 세분화된 권한(role-based access) — 전체 사이트 단일 게이트만 지원
- Brute-force 방어(rate limiting, 계정 잠금) — 후속 검토 항목으로만 기록
- GitHub Pages 등 순수 정적 호스팅 재지원
- robots.txt·메타 noindex 등 별도 크롤러 차단 정책 변경 (로그인 게이트가 크롤러도 자동 차단하므로 이번 사이클에서는 불필요로 판단)

---

## 3. 기능 요구사항 (FR)

| ID | 요구사항 | 우선순위 |
|----|----------|:---:|
| FR-1 | 미인증 상태로 임의 경로 접근 시 `/login`으로 리다이렉트 (정적 자산·`/login` 자체는 예외) | P0 |
| FR-2 | `/login`에서 아이디·비밀번호 입력 폼 제공, 제출 시 서버(Middleware 또는 Route Handler)에서 `.env.local` 값과 대조 | P0 |
| FR-3 | 인증 성공 시 httpOnly 쿠키 발급 — 원문 비밀번호는 쿠키에 저장하지 않음 | P0 |
| FR-4 | 인증 실패 시 에러 메시지 표시, 어느 필드가 틀렸는지는 노출하지 않음 | P1 |
| FR-5 | 로그아웃 시 쿠키 삭제 후 `/login`으로 이동 | P1 |
| FR-6 | 세션 만료(예: 30일) 후 재접근 시 자동으로 `/login` 리다이렉트 | P1 |

### 3.1 비기능 요구사항 (NFR)

| ID | 요구사항 |
|----|----------|
| NFR-1 | 자격 증명은 서버 측에서만 검증 — 클라이언트 번들에 ID/PW 원문 노출 0 |
| NFR-2 | 쿠키는 `httpOnly` + `secure` + `sameSite=lax` 설정. `secure`는 Production/Preview에서 항상 `true`, localhost 개발 환경(HTTP)에 한해서만 `false` 허용 |
| NFR-3 | Middleware는 Edge 런타임 호환 코드로 작성 (Node 전용 `crypto` 모듈 직접 사용 금지, Web Crypto API 사용) |
| NFR-4 | `.env.local`은 절대 커밋하지 않음 (`.gitignore` 기존 규칙으로 이미 보장) — 대신 `.env.local.example`로 필요한 키만 문서화 |
| NFR-5 | `output: 'export'` 제거 후에도 기존 7개 동적 라우트(`generateStaticParams`) 정상 렌더 |
| NFR-6 | `typecheck` + `lint` + `build` 무오류 |
| NFR-7 | 기존 `predev`/`prebuild` 데이터 파이프라인(quotes.json, cross-link.json) 회귀 없음 |

---

## 4. 구현 범위 (파일)

| 구분 | 파일 | 작업 |
|------|------|------|
| 수정 | `next.config.mjs` | `output: 'export'` 제거 (Middleware 사용을 위해 필수) |
| 신규 | `src/middleware.ts` | 모든 요청에서 인증 쿠키 검사, 미인증 시 `/login` 리다이렉트 |
| 신규 | `src/app/login/page.tsx` | 로그인 폼 UI |
| 신규 | `src/app/api/login/route.ts` | ID/PW 검증 후 세션 쿠키 발급 |
| 신규 | `src/app/api/logout/route.ts` | 쿠키 삭제 |
| 신규 | `.env.local` | `SITE_AUTH_ID`, `SITE_AUTH_PASSWORD` 등 (gitignore 처리, 로컬에서 직접 생성 — 실제 값은 Claude가 임의 생성하지 않고 사용자가 지정) |
| 신규 | `.env.local.example` | 커밋용 예시 파일 — 실제 값 없이 필요한 키만 명시 |
| 수정 | `README.md` 또는 본 문서 | Vercel Production/Preview 환경변수 설정 절차 안내 |

> 콘텐츠(`src/content/`), 데이터 파이프라인 스크립트(`scripts/*.mjs`)는 무변경.

---

## 5. 리스크

| ID | 리스크 | 대응 |
|----|--------|------|
| R-1 | `output: 'export'` 제거로 인한 회귀 (basePath, `images.unoptimized`, 정적 라우트 렌더) | 제거 후 전체 라우트 빌드·수동 점검. 기존 basePath 로직은 유지(현재 프로덕션에서도 빈 문자열로 추정되어 영향 적음) |
| R-2 | `.env.local`은 로컬 전용이라 Vercel 프로덕션에는 자동 반영되지 않음 → 배포 후에도 무방비 노출 가능 | Vercel 대시보드(또는 `vercel env add`)에 동일 키를 Production/Preview 환경에 별도 등록하는 절차를 DoD에 명시 |
| R-3 | Middleware Edge 런타임에서 Node 전용 API 미지원 | Web Crypto API(`crypto.subtle`)로 쿠키 서명/검증 구현 |
| R-4 | Middleware matcher가 정적 자산(`/_next`, 파비콘, OG 이미지 등)까지 막으면 메타 미리보기·빌드가 깨질 수 있음 | matcher에서 `_next/static`, `_next/image`, 파비콘 등 예외 처리 |
| R-5 | 비밀번호 무차별 대입 공격에 무방비 (rate limiting 없음) | MVP 범위에서는 수용, 후속 개선 항목으로 별도 기록 |
| R-6 | CLAUDE.md가 여전히 "완전 정적 SSG / GitHub Pages"로 기술 중 — 이번 변경으로 문서와 실제가 더 어긋남 | 이번 사이클 완료 후 CLAUDE.md 배포/아키텍처 절 갱신을 별도 후속 작업으로 제안 |

---

## 6. 완료 정의 (DoD)

- [ ] 미인증 상태에서 임의 페이지 접근 시 `/login`으로 리다이렉트 확인
- [ ] `.env.local`의 `SITE_AUTH_ID`/`SITE_AUTH_PASSWORD`와 일치할 때만 로그인 성공
- [ ] 로그인 성공 후 새로고침·재방문 시 세션 만료 전까지 재로그인 불필요
- [ ] 로그아웃 후 즉시 `/login`으로 리다이렉트되고 재인증 요구
- [ ] Vercel Production 환경변수 설정 절차 문서화 및 실제 등록 완료
- [ ] `typecheck` + `lint` + `build` 무오류
- [ ] 기존 동적 라우트(챕터/공정/화학물질/자료원) 회귀 없이 정상 렌더
- [ ] Gap 분석 Match Rate ≥ 90%

---

## 7. 다음 단계

1. ~~기술 방향(§1.2, 방식 A) 최종 확인~~ — 완료(A안 확정, 2026-07-16)
2. ~~`/pdca design site-login-gate`로 쿠키 서명 방식, matcher 패턴 등 세부 설계~~ — 완료, [`site-login-gate.design.md`](../../02-design/features/site-login-gate.design.md)
3. `/pdca do site-login-gate`로 구현
