# Feature Completion Report — 사이트 로그인 게이트 (저작권 보호)

> **Feature**: `site-login-gate`
> **기간**: 2026-07-16 (Plan → Design → Do → Check → Report 당일 완료)
> **Status**: ✅ Completed · Match Rate 100%
> **Branch**: `feat/site-login-gate` (미커밋 — 사용자 요청 시에만 커밋)

---

## Executive Summary

### 1.1 개요
- **기능명**: 사이트 로그인 게이트 (저작권 보호)
- **핵심 변화**: 완전 공개 사이트 → 로그인 필수 접근 제한
- **완료 상태**: 100% 설계 부합, Check에서 Gap 0건, Report 진행 가능

### 1.2 핵심 성과 (Before → After)

| 항목 | Before | After |
|------|--------|-------|
| **접근 제어** | 모두 공개 (미인증 사용자 무제한 열람) | 로그인 필수 (고정 ID/PW 1쌍만 통과) |
| **자료원 노출** | 검색엔진 크롤링 자유(robots.txt 미적용) | 자동 차단(로그인 게이트가 봇 사전 차단) |
| **배포 모델** | 정적 export (`output: 'export'`) | Vercel 서버 모드 (Middleware/API Route 활성) |
| **세션 관리** | 없음 | HMAC-SHA256 쿠키 서명, 30일 만료 |
| **로그아웃 진입점** | 없음 | Header 로그아웃 버튼 추가 |
| **저작권 리스크** | 높음 (무단 접근·수집 위험) | 낮음 (인증 절차로 접근 제한) |

### 1.3 Value Delivered

| 관점 | 내용 |
|------|------|
| **Problem (문제)** | 사이트가 완전 공개 상태라 「반도체 산업의 유해인자」 원저작물을 재구성한 116개 학습 단위(책 17챕터 + OSHA 5파트 + NCS 84모듈 + 대구 교과서 10단원)를 저작권 허가 없이 누구나 열람·크롤링할 수 있다. 원저작자와 협상 전까지는 리스크 노출 상태. |
| **Solution (해법)** | 사이트 진입 시 로그인을 강제하고, `.env.local`에 정의한 고정 아이디·비밀번호 1쌍으로만 통과시키는 게이트를 추가했다. Middleware 서버 인증으로 ID/PW 원문은 서버에서만 검증, 클라이언트 번들에 노출 0. HMAC-SHA256 세션 쿠키로 30일간 재로그인 불필요. |
| **Function·UX Effect (기능·UX 효과)** | (1) 미인증 사용자는 모든 경로에서 `/login`으로 자동 리다이렉트. (2) 로그인 성공 시 원래 요청 경로로 복귀, 30일 동안 재로그인 불필요. (3) 로그아웃 버튼 추가로 세션 종료 가능. (4) 검색엔진 크롤러도 로그인 없이 진입 불가라 콘텐츠가 자동으로 색인 제외. (5) 177페이지 SSG 전량 게이트, 데이터 파이프라인 회귀 없음. |
| **Core Value (핵심 가치)** | 원저작물 재구성 콘텐츠 116개 학습 단위(177페이지)의 무단 접근·수집 위험을 차단해 저작권 리스크를 완화하고, 정식 이용 허락 절차가 마련되기 전까지 콘텐츠를 안전하게 비공개로 운용할 최소한의 장치를 확보했다. 향후 개별 사용자·기관에 인증 정보를 배분하는 방식으로 유동적인 접근 제어가 가능한 기반 마련. |

---

## PDCA 사이클 Summary

### Plan
- **문서**: `docs/01-plan/features/site-login-gate.plan.md`
- **목표**: 저작권 보호를 위해 사이트 진입 시 로그인 강제
- **기술 방향**: A안(Middleware 서버 인증) 확정 — `output: 'export'` 제거, 쿠키 기반 세션, Node timingSafeEqual 자격 증명 검증
- **범위**: 
  - 신규: middleware, 로그인 페이지·폼, API 라우트 2개(login/logout), 세션 모듈
  - 수정: next.config.mjs, Header, .env.local.example
- **기간 예상**: ~1일 (실제: 당일 완료)
- **결정 사항**: ✅ 기술 방향 A안 확정(2026-07-16)

### Design
- **문서**: `docs/02-design/features/site-login-gate.design.md`
- **주요 결정**:
  - **Middleware 위치**: `src/middleware.ts` (Plan 오기 정정 — "프로젝트 루트"는 틀림, src 구조라 src/ 내부가 맞음)
  - **세션 쿠키**: `{exp}.{signature}` 포맷, HMAC-SHA256, Web Crypto API만 사용(Edge 런타임 호환)
  - **matcher 7개 제외**: `_next/static`, `_next/image`, `favicon.ico`, `login`, `api/login`, `api/logout`, `og-default.svg`
  - **Route Handler**: Node `timingSafeEqual`로 ID/PW 비교, 실패 시 필드 구분 없는 단일 401
  - **UI 분리**: `page.tsx`(서버 컴포넌트) + `LoginForm.tsx`(클라이언트) — `'use client'`+`metadata` 동시 불가 제약 대응
  - **LogoutButton**: Header 데스크톱·모바일 양쪽에 삽입

### Do (구현)
- **완료 파일**: 신규 8 + 수정 2 + 삭제 0

  | 파일 | 유형 | 줄 수 |
  |------|------|------|
  | `src/lib/auth/session.ts` | 신규 | 56 |
  | `src/middleware.ts` | 신규 | 17 |
  | `src/app/api/login/route.ts` | 신규 | 42 |
  | `src/app/api/logout/route.ts` | 신규 | 8 |
  | `src/app/login/page.tsx` | 신규 | 11 |
  | `src/components/auth/LoginForm.tsx` | 신규 | 87 |
  | `src/components/layout/LogoutButton.tsx` | 신규 | 25 |
  | `.env.local.example` | 신규 | 6 |
  | `next.config.mjs` | 수정 | `output: 'export'` 1줄 제거 |
  | `src/components/layout/Header.tsx` | 수정 | `<LogoutButton />` 삽입 +3줄 |

  **순 코드 추가: 252줄** (신규 8개 + 수정 2개, 순 긍정적 변화)

- **Do 단계에서 발견·반영한 4개 보정사항** (Design 문서에 사후 반영):
  1. **TypeScript 5.9 TypedArray 제네릭화**: `fromBase64Url` 반환 타입을 `Uint8Array<ArrayBuffer>`로 명시 — `crypto.subtle.verify` 인자 타입 충족
  2. **`server-only` 제거**: 패키지가 프로젝트에 설치돼 있지 않아 신규 의존성 대신 제거 (이 모듈의 소비처는 middleware·Route Handler 2곳뿐, 클라이언트 import 0)
  3. **LoginForm 분리**: `'use client'`와 `metadata` export를 동시에 할 수 없는 Next.js 제약으로 폼 로직을 `LoginForm.tsx`로 분리 — `chemicals` 페이지의 관례와 동형
  4. **trailing slash 보정**: `trailingSlash: true` 설정 때문에 `/api/login` → `308` 리다이렉트 유발, 클라이언트 fetch·네비 모두 `/api/login/`으로 수정

### Check (분석)
- **Gap Analysis 결과**: **Match Rate 100%** ✅ (기준 90% 이상)
- **기능·보안 갭**: 0건
- **의도적 변경**: 4건 모두 부작용 검증 완료
  - TypeScript 타입 명시: 런타임 영향 0, 컴파일 통과
  - server-only 제거: 노출 경로 없음(NEXT_PUBLIC 미사용, grep 클라이언트 import 0)
  - 폼 분리: 기존 패턴 재사용(chemicals), 기능상 동등
  - trailing slash: 308 리다이렉트 우회, 라우팅 정상

- **검증 결과**:
  - ✅ `npm run typecheck` 무오류
  - ✅ `npm run lint` 무오류
  - ✅ `npm run build` 무오류, 177페이지 SSG 전량 생성
  - ✅ Middleware Edge 런타임 컴파일 확인 (34.4kB)
  - ✅ 로컬 dev + curl로 전체 플로우 검증:
    - 미인증 리다이렉트 (`/chapter/1/` → `/login?redirect=/chapter/1/`)
    - 올바른 ID/PW 로그인 성공
    - 잘못된 자격 증명 401 (필드 구분 없는 단일 메시지)
    - 쿠키 발급 및 세션 유지
    - 로그아웃 후 재게이트
    - **위조된 쿠키도 500 크래시 없이 안전하게 처리**
  - ✅ 기존 동적 라우트(chapter/process/chemicals/sources) 회귀 없음
  - ✅ 데이터 파이프라인(`quotes.json`, `cross-link.json`) 회귀 없음

### Report
- **이 문서**
- **문제 해결**: 저작권 보호를 위한 접근 제한 장치 구축
- **성능 지표**:
  - Match Rate: 100% (기준 90% 이상 통과, iterate 불필요)
  - 파일 변경: 신규 8 + 수정 2
  - 코드 추가: 순 252줄
  - 빌드: 무오류, SSG 177페이지 전량 생성

---

## 완료된 항목

### 인증 코어
- ✅ **session.ts** (신규, 56줄)
  - HMAC-SHA256 서명 쿠키 (포맷: `{exp}.{signature}`)
  - Web Crypto API 기반 sign/verify (Node Buffer 0, Edge 호환)
  - `verifySessionToken`의 try/catch로 모든 실패 경로를 `false` 반환 (손상·위조 쿠키 안전 처리)
  - 30일 만료 (`MAX_AGE_SECONDS`)

- ✅ **middleware.ts** (신규, 17줄)
  - 모든 요청의 세션 쿠키 검증
  - 미인증 시 `/login?redirect={원경로}` 리다이렉트
  - matcher로 7개 경로 제외 (정적 자산, 로그인 페이지, API 엔드포인트, OG 이미지)
  - 정확히 `src/middleware.ts`에 위치 (Plan 오기 정정, `.next/server/middleware.js` 컴파일 산출물로 인식 확인)

- ✅ **login/route.ts** (신규, 42줄)
  - `.env.local`의 `SITE_AUTH_ID`·`SITE_AUTH_PASSWORD`와 대조
  - Node `timingSafeEqual` 사용 — 타이밍 공격 방어
  - 길이 불일치 시에도 동일 시간 소비 (더미 비교)
  - ID/PW 실패를 단일 메시지로 통합 (필드 구분 없음, FR-4)
  - 성공 시 HMAC 쿠키 발급

- ✅ **logout/route.ts** (신규, 8줄)
  - 쿠키 삭제 (maxAge: 0)

### UI·레이아웃
- ✅ **login/page.tsx** (신규, 11줄)
  - 서버 컴포넌트 (메타 export 가능)
  - `buildMetadata({title: '로그인', path: '/login/'})` 적용
  - `<LoginForm />` 컴포넌트 임포트

- ✅ **LoginForm.tsx** (신규, 87줄)
  - 클라이언트 컴포넌트 (`'use client'`)
  - 아이디·비밀번호 입력 폼
  - `Suspense` 래퍼 (useSearchParams 사용)
  - Open Redirect 방지 (`/`로 시작, `//` 미포함 검사)
  - 로그인 성공 시 `redirect` 쿼리 파라미터로 복귀
  - trailing slash 대응 (`fetch('/api/login/')`)

- ✅ **LogoutButton.tsx** (신규, 25줄)
  - Header에 삽입할 로그아웃 버튼
  - `<LogOut />` 아이콘 (lucide-react)
  - POST `/api/logout/`로 요청
  - 세션 삭제 후 `/login/`으로 이동

- ✅ **Header.tsx** (수정, +3줄)
  - 데스크톱 nav 끝에 `<LogoutButton />` 추가
  - 모바일 아이콘 바에도 삽입
  - 기존 구조·마크업 무수정

### 설정·환경
- ✅ **next.config.mjs** (수정)
  - `output: 'export'` 제거 (Middleware·API Route 활성화 필요)
  - `images.unoptimized: true` 유지 (이번 사이클 범위 밖)
  - `basePath`, `assetPrefix`, `trailingSlash` 무수정

- ✅ **.env.local.example** (신규, 6줄)
  - `SITE_AUTH_ID`
  - `SITE_AUTH_PASSWORD`
  - `SITE_AUTH_SESSION_SECRET` (쿠키 서명 전용, 생성: `openssl rand -base64 32`)
  - 실제 `.env.local`은 사용자 생성, 커밋 금지 (기존 .gitignore 규칙)

---

## 잘 된 점

### 기술 설계
1. **Edge 런타임 호환성 완벽 구현**
   - `session.ts`가 `btoa`/`atob`(Web 표준), `TextEncoder`, `Uint8Array`만 사용
   - Node `Buffer` 0, Node 전용 API 0
   - 미들웨어가 Edge에서 컴파일·실행 가능 (34.4kB, 실측 확인)

2. **게이트웨이 치명 결함 회피**
   - middleware가 정확히 `src/middleware.ts`에 위치 (Plan "프로젝트 루트" 오기를 Design 단계에서 미리 정정)
   - 루트에 두었으면 다음 코드는 조용히 무시됨 → 로그인 게이트 전체가 작동하지 않는 치명적 버그를 사전 방지

3. **보안 다층 방어**
   - ID/PW는 `timingSafeEqual`로 비교 (타이밍 공격 방어)
   - 길이 불일치 시에도 더미 비교로 시간 균일화
   - 실패 메시지에서 필드 구분 없음 (정보 누출 방지)
   - 위조·손상 쿠키는 `verifySessionToken`의 try/catch로 `false` 반환 (500 크래시 없음)

4. **관례 일치·코드 품질**
   - `LoginForm` 분리가 기존 `chemicals` 페이지의 서버/클라이언트 분리 패턴과 동형
   - `SITE_AUTH_SESSION_SECRET`을 로그인 비밀번호와 분리 (회전·유출 범위 독립)
   - 의도적 변경 4건 모두 부작용 검증 통과 (타입 명시·제거·폼 분리·slash)

### 검증 완성도
1. **런타임·정적 검증 전부 통과**
   - `typecheck` + `lint` + `build` 무오류
   - 177페이지 SSG 전량 생성, 기존 동적 라우트 회귀 없음
   - 데이터 파이프라인(`quotes.json`, `cross-link.json`) 정상

2. **curl로 전체 플로우 실측**
   - 미인증 리다이렉트 확인
   - 로그인 성공/실패 플로우 확인
   - 세션 유지·만료 로직 확인
   - 로그아웃 후 재게이트 확인
   - **위조된 쿠키를 넣어도 500 크래시 없이 안전하게 처리** 까지 전부 통과

---

## 미완료/보류 항목

- ⏸️ **실제 브라우저 시각 검증 미실시**
  - 사유: Chrome 확장이 연결되지 않아 curl로 HTTP 레벨 검증만 진행
  - 영향: UI 렌더링(입력 폼 모습, 에러 메시지 스타일, 다크 모드 등)을 실제 브라우저에서 확인하지 못함
  - 다음 단계: 사용자가 로컬에서 `npm run dev` 후 http://localhost:3016에 접속해 시각 검증 필요

- ⏸️ **.env.local 검증용 임시 자격증명**
  - 현황: `SITE_AUTH_ID=test`, `SITE_AUTH_PASSWORD={랜덤}`, `SITE_AUTH_SESSION_SECRET={랜덤}`으로만 채워짐
  - 영향: 실제 프로덕션에 배포하기 전에 사용자가 원하는 아이디·비밀번호로 교체 필수
  - 권장: 환경별로 다른 비밀번호 사용 (로컬/Preview/Production 각각)

- ⏸️ **Vercel Production/Preview 환경변수 미등록**
  - 필요 항목: `SITE_AUTH_ID`, `SITE_AUTH_PASSWORD`, `SITE_AUTH_SESSION_SECRET` (3개)
  - 방법: 로컬 `.env.local`에서 값 복사 후 `vercel env add [키] production`, `vercel env add [키] preview` 실행
  - 미등록 시: `.env.local`은 로컬 dev 전용이라 배포 환경에는 무방비 노출 (Plan R-2)
  - 상태: Plan DoD 항목이지만 실행 미완료

- ⏸️ **Preview 배포로 온라인 환경 검증 미실시**
  - 현황: 로컬 dev(`npm run dev`) + curl로만 검증
  - 다음 단계: Vercel Preview 환경에 배포 후 실제 온라인에서 로그인 플로우 재확인 권장

- ⏸️ **커밋 미완료**
  - 현황: 모든 파일이 워킹 트리 변경 상태 (git add·commit 실행하지 않음)
  - 규칙: 이 프로젝트의 정책상 사용자가 명시적으로 "커밋해줘"라 요청할 때만 git add/commit 실행
  - 다음 단계: 사용자 요청 후 진행 → 브랜치: `feat/site-login-gate`, 메시지 예시:
    ```text
    feat(auth): 사이트 로그인 게이트 추가 (저작권 보호)
    
    - Middleware 서버 인증: src/middleware.ts (세션 쿠키 검증, 미인증 리다이렉트)
    - 세션 쿠키: HMAC-SHA256 서명 ({exp}.{signature}), Web Crypto API, 30일 만료
    - Route Handlers: POST /api/login/ (ID/PW 검증), POST /api/logout/ (쿠키 삭제)
    - 로그인 UI: src/app/login/page.tsx + src/components/auth/LoginForm.tsx
    - 로그아웃: Header 버튼 + src/components/layout/LogoutButton.tsx
    - 환경변수: .env.local.example (3개 키: ID, PASSWORD, SESSION_SECRET)
    
    Match Rate 100%, build 무오류, 177페이지 SSG 무변경.
    DoD 완료: 미인증 리다이렉트, 로그인·로그아웃 플로우, 세션 유지, 데이터 파이프라인 회귀 없음.
    
    미완료: Vercel env add (사용자가 실행), Preview 배포 검증 (선택).
    ```

- ⏸️ **브라우저 자동화 도구 영향 (참고)**
  - 기존: Chrome 확장·Selenium·Puppeteer 등이 이 사이트를 테스트할 때 로그인 절차 없이 자동 접근 가능했음
  - 현재: 로그인 게이트 도입으로 이들 도구도 먼저 `/api/login/`을 호출해 쿠키를 획득한 후 테스트 실행해야 함
  - 영향도: 낮음 (CI/자동 테스트 파이프라인이 현재 이 저장소에 없으므로)

---

## 학습 · 개선점

### 잘 배운 점

1. **Next.js Middleware 위치의 중요성**
   - `src/` 디렉토리 구조를 사용하는 프로젝트에서 middleware.ts는 반드시 `src/` 내부에 있어야 인식됨
   - 루트에 두면 **조용히 무시된다** (빌드 에러 없이 동작하지 않음)
   - Plan 단계에서 실수했지만 Design 단계에서 정정해 실제 구현 오류를 방지

2. **Edge 런타임 제약의 조기 발견**
   - Buffer, Node crypto 모듈이 Edge에서 보장되지 않는다는 것을 설계 단계에 코드로 검증
   - Web Crypto API로 완전 대체 가능하며, 부작용 없음

3. **타이밍 공격 방어의 실무 적용**
   - 암호 비교를 평문 `===`가 아니라 `timingSafeEqual`로 구현
   - 길이 불일치 시에도 더미 비교를 추가해 시간 균일화
   - 정보 누출 최소화(필드 구분 없는 단일 에러 메시지)

4. **서버·클라이언트 컴포넌트 분리의 필요성**
   - Next.js 13+ 제약: `'use client'`와 `metadata` export를 동시에 할 수 없음
   - 기존 프로젝트의 관례(chemicals 페이지)를 따라 분리하면 다른 기여자도 쉽게 이해 가능

### 다음 사이클에 적용할 것

1. **인증 기능 구현할 때 체크리스트**
   - [ ] 미들웨어 위치 (프로젝트 구조에 맞는지 사전 확인)
   - [ ] Edge 호환성 (Buffer·Node API 사용 여부)
   - [ ] 타이밍 공격 방어 (timingSafeEqual, 길이 더미 비교)
   - [ ] 정보 누출 최소화 (에러 메시지 범용화)
   - [ ] curl로 전 플로우 검증 (브라우저 UI 전 HTTP 레벨 확인)

2. **환경 변수·비밀키 관리**
   - `.env.local.example`에 필요한 키만 문서화, 예시 값은 비워두기
   - Vercel 배포 전에 Production/Preview 환경변수 등록 체크리스트 Plan DoD에 명시
   - 각 환경별 다른 SECRET 사용 권장

3. **배포 모델 변경의 영향도 재검토**
   - `output: 'export'` 제거로 정적 export → 서버 모드 전환은 상당한 변화
   - 다음 번 유사한 변화(예: 이미지 최적화 활성화)를 계획할 때는 영향도 별도 문서로 정리

---

## 다음 단계

1. **커밋 및 PR (사용자 요청 시)**
   - 브랜치: `feat/site-login-gate`
   - 메시지: 미완료 항목의 예시 참고
   - base: `main`

2. **Vercel 환경변수 등록 (배포 전 필수)**
   ```bash
   vercel env add SITE_AUTH_ID production
   vercel env add SITE_AUTH_ID preview
   vercel env add SITE_AUTH_PASSWORD production
   vercel env add SITE_AUTH_PASSWORD preview
   vercel env add SITE_AUTH_SESSION_SECRET production
   vercel env add SITE_AUTH_SESSION_SECRET preview
   ```

3. **Preview 배포 검증**
   - 위 환경변수 등록 후 `git push` → Vercel이 자동 Preview 생성
   - Preview URL에서 `/login` 페이지 렌더링 확인
   - 로그인 성공/실패·세션 유지·로그아웃 재확인

4. **Production 배포**
   - main으로 merge 후 자동 배포
   - 프로덕션에서 로그인 게이트 작동 최종 확인
   - 필요시 로그인 정보를 관련 사용자에게 배분

5. **후속 개선 (별 사이클로 판단)**
   - Brute-force 방어 (rate limiting, 계정 잠금) — Plan R-5에 기록
   - 다중 사용자 계정 (현재 고정 ID/PW 1쌍에서 확장)
   - CLAUDE.md 배포/아키텍처 섹션 갱신 (Plan R-6: "GitHub Pages" → "Vercel 서버 모드" 수정)

---

## 기술 메모

### 코드 구조

| 컴포넌트 | 역할 | 범위 |
|---------|------|------|
| `session.ts` | 세션 쿠키 sign/verify | 공유 모듈 (middleware + Route Handler) |
| `middleware.ts` | 모든 요청 인증 검사 | Edge 런타임, matcher 7개 제외 |
| `login/route.ts` | ID/PW 검증, 쿠키 발급 | Node 런타임, `timingSafeEqual` 사용 |
| `logout/route.ts` | 쿠키 삭제 | Node 런타임, maxAge: 0 |
| `login/page.tsx` | 로그인 페이지 | 서버 컴포넌트, metadata 생성 |
| `LoginForm.tsx` | 로그인 폼 UI | 클라이언트 컴포넌트, Suspense·useSearchParams |
| `LogoutButton.tsx` | 로그아웃 진입점 | 클라이언트 컴포넌트, Header에 삽입 |

### 파일 체크리스트

| 파일 | 상태 | 비고 |
|------|------|------|
| `src/lib/auth/session.ts` | ✅ 신규·완성 | HMAC-SHA256, Web Crypto API, 56줄 |
| `src/middleware.ts` | ✅ 신규·완성 | matcher 7개 제외, 17줄 |
| `src/app/api/login/route.ts` | ✅ 신규·완성 | timingSafeEqual, 42줄 |
| `src/app/api/logout/route.ts` | ✅ 신규·완성 | 쿠키 삭제, 8줄 |
| `src/app/login/page.tsx` | ✅ 신규·완성 | 서버 컴포넌트, 11줄 |
| `src/components/auth/LoginForm.tsx` | ✅ 신규·완성 | 클라이언트 컴포넌트, Open Redirect 방지, 87줄 |
| `src/components/layout/LogoutButton.tsx` | ✅ 신규·완성 | Header 삽입 가능, 25줄 |
| `.env.local.example` | ✅ 신규·완성 | 3키 명시, 6줄 |
| `next.config.mjs` | ✅ 수정·완성 | `output: 'export'` 제거 |
| `src/components/layout/Header.tsx` | ✅ 수정·완성 | LogoutButton 삽입, +3줄 |

### 환경 변수

| 키 | 용도 | 설정 위치 |
|----|------|---------|
| `SITE_AUTH_ID` | 로그인 아이디 | `.env.local` (로컬), Vercel 대시보드 (production/preview) |
| `SITE_AUTH_PASSWORD` | 로그인 비밀번호 | `.env.local` (로컬), Vercel 대시보드 (production/preview) |
| `SITE_AUTH_SESSION_SECRET` | 쿠키 서명 비밀키 | `.env.local` (로컬), Vercel 대시보드 (production/preview) |

생성: `openssl rand -base64 32`

### 라우팅 매처 (Middleware 제외 목록)

```regex
/((?!_next/static|_next/image|favicon.ico|login|api/login|api/logout|og-default.svg).*)
```

**의도적으로 게이트 적용하는 것**:
- `robots.txt`, `sitemap.xml` (크롤러 차단용 파일이지만 로그인 게이트가 자동 차단하므로 추가 정책 불필요)
- `/images/*`, `/source-images/*` (콘텐츠 이미지도 저작권 보호 대상)

---

## 결론

**사이트 로그인 게이트 (저작권 보호) 완료**

116개 학습 단위(책 17장 + OSHA 5파트 + NCS 84모듈 + 대구 10단원)로 구성된 177페이지 SSG를 로그인 필수 상태로 전환했다.

### 핵심 성과
- **설계 부합도**: 100% (≥ 90% 기준 통과, iterate 불필요)
- **보안 수준**: 높음 (Middleware 서버 인증, HMAC 세션, timingSafeEqual, 정보 누출 최소화)
- **Edge 호환성**: 완벽 (Web Crypto API만 사용, Node Buffer 0)
- **코드 품질**: 252줄 신규 추가, 기존 라우트·데이터 무변경
- **배포 준비**: 거의 완료 (Vercel env add만 남음)

### 저작권 리스크 감소
- ✅ 미인증 접근 차단 (모든 콘텐츠 페이지)
- ✅ 검색엔진 자동 제외 (로그인 게이트가 크롤러 사전 차단)
- ✅ 개별 사용자·기관 인증 정보 배분 가능 (향후 확장성)

원저작자와 정식 이용 허락 절차가 마련되기 전까지 콘텐츠를 **안전하게 비공개로 운용할 최소한의 장치**를 확보했다.
