# Design — 사이트 로그인 게이트 (Middleware 서버 인증)

> **Feature**: `site-login-gate` · Plan: [`docs/01-plan/features/site-login-gate.plan.md`](../../01-plan/features/site-login-gate.plan.md)
> 확정안: **A안(Middleware 서버 인증) 확정** — `output: 'export'` 제거, 쿠키 세션(HMAC-SHA256, Web Crypto API) (사용자 확정 2026-07-16)
> 작업 브랜치: `feat/site-login-gate` (Do 착수 시 생성)

---

## 0. Plan 대비 추가/변경 사항

Plan §4 구현 범위를 Design 단계에서 구체화하며 아래 3가지가 추가·정정됐다.

| 항목 | Plan | Design 확정 | 이유 |
|---|---|---|---|
| **middleware.ts 위치** | "프로젝트 루트" | **`src/middleware.ts`** | 이 프로젝트는 `src/` 디렉토리 구조를 쓴다. Next.js는 `src/`가 있으면 `middleware.ts`를 반드시 그 안에 둬야 인식한다 — 루트에 두면 **조용히 무시되어 로그인 게이트 전체가 작동하지 않는다.** Plan 문서의 실수를 여기서 정정. |
| **`src/lib/auth/session.ts` 신규** | 명시 없음 | 세션 토큰 서명·검증 공유 모듈 | Middleware(Edge)와 Route Handler(Node) 양쪽에서 동일 로직이 필요 — 중복 방지 |
| **`Header.tsx` 수정 + `LogoutButton.tsx` 신규** | 명시 없음 | 로그아웃 진입점 UI 추가 | FR-5(로그아웃)를 만족하려면 어딘가에 트리거 버튼이 있어야 함 |
| **`.env.local`에 `SITE_AUTH_SESSION_SECRET` 추가** | "`SITE_AUTH_ID`, `SITE_AUTH_PASSWORD` 등" | 3번째 키로 명시 | 쿠키 서명 전용 비밀키 — 로그인 비밀번호와 분리(회전·유출 범위 독립) |

---

## 1. 아키텍처 개요

```
[Browser] ──(임의 경로 요청)──▶ [Vercel Edge: src/middleware.ts]
    │ 쿠키 없음/서명 무효/만료                    │ 서명 유효 + 미만료
    ▼                                            ▼
NextResponse.redirect(/login?redirect=원경로)   NextResponse.next() — 페이지 통과

[Browser] ──POST /api/login {id,password}──▶ [Route Handler, Node 런타임]
    │ 자격 증명 불일치                              │ 일치
    ▼                                              ▼
401 { error: 'invalid_credentials' }      Set-Cookie(auth_session, HMAC 서명) + 200

[Browser] ──POST /api/logout──▶ [Route Handler] ──Set-Cookie(maxAge=0)──▶ 클라이언트가 /login 이동
```

핵심 원칙(Plan NFR-1 대응): **미들웨어는 세션 쿠키의 서명만 검증한다. ID/PW 원문은 미들웨어를 절대 거치지 않는다** — 자격 증명 대조는 오직 `/api/login`(Node 런타임)에서만 일어난다.

쿠키 서명·검증은 Web Crypto API(`crypto.subtle`)만 사용해 Edge(미들웨어)·Node(Route Handler) 양쪽에서 동일 모듈을 그대로 공유한다(Plan NFR-3). `Buffer`는 Edge 런타임에서 보장되지 않으므로 base64url 인코딩도 `btoa`/`atob`(둘 다 Web 표준, Node 18+에서도 전역 제공)만 사용한다.

---

## 2. 세션 쿠키 설계

### 2.1 토큰 포맷

```
{exp}.{signature}
```

- `exp`: 세션 만료 unix ms 타임스탬프 (평문)
- `signature`: `HMAC-SHA256(exp, SITE_AUTH_SESSION_SECRET)`의 base64url 인코딩

payload를 암호화하지 않고 평문으로 두는 이유: 서명이 있으면 위조가 불가능하므로 굳이 감출 필요가 없다(만료 시각 자체는 민감정보가 아님). 별도 JWT 라이브러리(`jose` 등) 대신 HMAC 서명 하나만 직접 구현한 이유: payload가 만료 시각 하나뿐이라 라이브러리 도입이 과함(YAGNI) + Web Crypto 네이티브라 번들 크기 영향 0.

### 2.2 공유 모듈 — `src/lib/auth/session.ts` (신규)

```ts
export const COOKIE_NAME = 'auth_session';
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30일 (Plan G3)

function getSecret(): string {
  const secret = process.env.SITE_AUTH_SESSION_SECRET;
  if (!secret) throw new Error('SITE_AUTH_SESSION_SECRET is not set');
  return secret;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

// Edge 런타임엔 Buffer가 없을 수 있어 btoa/atob(Web 표준)만 사용
function toBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), '=');
  const binary = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function createSessionToken(): Promise<string> {
  const exp = Date.now() + MAX_AGE_SECONDS * 1000;
  const key = await importKey(getSecret());
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(String(exp)));
  return `${exp}.${toBase64Url(sig)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  try {
    if (!token) return false;
    const [expStr, sig] = token.split('.');
    if (!expStr || !sig) return false;
    const exp = Number(expStr);
    if (!Number.isFinite(exp) || Date.now() > exp) return false;
    const key = await importKey(getSecret());
    return await crypto.subtle.verify('HMAC', key, fromBase64Url(sig), new TextEncoder().encode(expStr));
  } catch {
    // 손상/위조된 쿠키 값(atob 디코딩 실패 등) — 미인증으로 처리, 절대 예외를 던지지 않음
    return false;
  }
}
```

> `verifySessionToken`은 공격자가 임의로 조작한 쿠키 값을 그대로 받는 함수라 **모든 실패 경로를 `false` 반환으로 흡수**해야 한다(try/catch 필수) — 그렇지 않으면 잘못된 쿠키 하나가 미들웨어에서 처리되지 않은 예외를 던져 500 에러를 유발할 수 있다.
>
> **Do 단계 보정 2건(구현 완료, 아래 코드에 반영됨)**: ① `import 'server-only'` 제거 — 패키지가 프로젝트에 설치돼 있지 않아 신규 의존성 추가 대신 제거(이 모듈의 소비자는 middleware.ts·Route Handler 2곳뿐이라 기능상 문제 없음). ② `fromBase64Url` 반환 타입을 `Uint8Array<ArrayBuffer>`로 명시 — TypeScript 5.9의 TypedArray 제네릭화로 `crypto.subtle.verify` 인자 타입 에러가 나서 추가.

### 2.3 쿠키 옵션

| 옵션 | 값 | 이유 |
|---|---|---|
| `httpOnly` | `true` | JS에서 쿠키 접근 차단(NFR-1 — XSS로 세션 탈취 방지) |
| `secure` | `process.env.NODE_ENV === 'production'` | 로컬 `http://localhost:3016` 개발 환경에서도 로그인 테스트 가능하도록 |
| `sameSite` | `'lax'` | 일반 내비게이션엔 쿠키 유지, 크로스사이트 POST(로그아웃 CSRF 등)엔 쿠키 미포함 — 별도 CSRF 토큰 불필요 |
| `path` | `'/'` | 전체 사이트 적용 |
| `maxAge` | `2592000`(30일) | Plan G3 |

---

## 3. Middleware — `src/middleware.ts` (신규)

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_NAME, verifySessionToken } from '@/lib/auth/session';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const authenticated = await verifySessionToken(token);

  if (authenticated) return NextResponse.next();

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|login|api/login|api/logout|og-default.svg).*)',
  ],
};
```

### 3.1 matcher 제외 목록 근거 (Plan R-4 대응)

| 제외 경로 | 이유 |
|---|---|
| `_next/static`, `_next/image` | Next 내부 정적 자산·이미지 최적화 엔드포인트 |
| `login` | 로그인 페이지 자체 — 제외하지 않으면 무한 리다이렉트 |
| `api/login`, `api/logout` | 인증 처리 API — 로그인 전에도 호출 가능해야 함 |
| `favicon.ico` | 현재 프로젝트엔 파비콘 파일이 없지만(확인 완료), 추후 추가될 때를 대비한 무해한 방어적 처리 |
| `og-default.svg` | 카카오톡·슬랙·트위터 등 링크 미리보기 봇은 세션 쿠키가 없음 — 제외하지 않으면 OG 이미지가 항상 리다이렉트돼 미리보기가 깨짐. 페이지별 `ogImage` 오버라이드는 현재 없음(전수 확인) |

**의도적으로 제외하지 않는 것**: `robots.txt`, `sitemap.xml`, `/images/*`, `/source-images/*`. Plan 비목표("크롤러 차단 정책 변경 불필요")와 일치하고, 콘텐츠 이미지도 저작권 보호 대상이라 게이트를 그대로 적용하는 게 맞다.

basePath는 현재 프로덕션에서 빈 문자열로 확인됐다(`.github/workflows/` 비어 있음 → GH Pages용 주입 워크플로 없음). matcher 경로 변환 이슈 없음. 추후 basePath 도입 시 재검토 필요(Plan R-1).

---

## 4. Route Handlers

### 4.1 `src/app/api/login/route.ts` (신규)

```ts
import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { COOKIE_NAME, MAX_AGE_SECONDS, createSessionToken } from '@/lib/auth/session';

// Route Handler는 기본 Node 런타임이라 Node crypto 사용 가능(Edge 제약은 middleware.ts만 해당 — NFR-3)
function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    timingSafeEqual(aBuf, aBuf); // 길이가 달라도 동일한 시간이 걸리도록 해 타이밍 누출 최소화
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

export async function POST(request: Request) {
  const validId = process.env.SITE_AUTH_ID;
  const validPassword = process.env.SITE_AUTH_PASSWORD;
  if (!validId || !validPassword) {
    return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const id = typeof body?.id === 'string' ? body.id : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!safeEqual(id, validId) || !safeEqual(password, validPassword)) {
    // FR-4: 어느 필드가 틀렸는지 노출하지 않음 — 항상 동일 에러
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
  return response;
}
```

### 4.2 `src/app/api/logout/route.ts` (신규)

```ts
import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth/session';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return response;
}
```

---

## 5. 로그인 UI

### 5.1 `src/app/login/page.tsx` (신규) + `src/components/auth/LoginForm.tsx` (신규)

- Root Layout(Header/Footer)을 그대로 사용 — 로그인 전용 레이아웃은 새로 만들지 않는다. Header 내비 링크가 보이긴 하지만, 클릭해도 다시 `/login`으로 리다이렉트될 뿐이라 기능적 문제는 없다(비목표 범위 밖 UX 다듬기는 후속 과제로 남김).
- `redirect` 쿼리 파라미터를 읽어야 하므로 `useSearchParams`가 필요 — 이 프로젝트의 기존 패턴(`ChemicalSearch.tsx`)을 그대로 따라 바깥은 `Suspense`, 내부에 실제 폼 로직을 둔다.
- Open Redirect 방지: `redirect` 값이 `/`로 시작하고 `//`(프로토콜 상대 URL)로 시작하지 않을 때만 사용, 그 외엔 `/`로 폴백.
- **Do 단계 보정**: `page.tsx`는 `'use client'`이면서 동시에 `metadata`를 export할 수 없는 Next.js 제약 때문에, 폼 로직을 `src/components/auth/LoginForm.tsx`(클라이언트)로 분리하고 `page.tsx`는 서버 컴포넌트로 남긴다 — `chemicals/page.tsx` + `ChemicalSearch.tsx` 분리와 동일한 패턴.
- **Do 단계 보정**: `trailingSlash: true` 설정 때문에 `fetch('/api/login')`(슬래시 없음)은 308 리다이렉트를 유발한다 — 아래 코드는 `/api/login/`으로 수정된 최종본이다.

```tsx
'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function isSafeRedirect(path: string | null): path is string {
  return !!path && path.startsWith('/') && !path.startsWith('//');
}

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(false);

    const res = await fetch('/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password }),
    });

    if (!res.ok) {
      setPending(false);
      setError(true);
      return;
    }

    const target = searchParams.get('redirect');
    router.push(isSafeRedirect(target) ? target : '/');
    router.refresh(); // 로그인 직후 이동할 페이지의 RSC 캐시를 무효화
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-4 px-4 py-16">
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">로그인</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        아이디와 비밀번호를 입력해 주세요.
      </p>

      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="아이디"
        aria-label="아이디"
        autoComplete="username"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        aria-label="비밀번호"
        autoComplete="current-password"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900"
      />

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          아이디 또는 비밀번호가 올바르지 않아요.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {pending ? '확인 중...' : '로그인'}
      </button>
    </form>
  );
}

export function LoginForm() {
  return (
    <Suspense>
      <LoginFormInner />
    </Suspense>
  );
}
```

`src/app/login/page.tsx`(서버 컴포넌트, 실제 파일):

```tsx
import { LoginForm } from '@/components/auth/LoginForm';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({ title: '로그인', path: '/login/' });

export default function LoginPage() {
  return <LoginForm />;
}
```

`noindex`까지는 비목표(Plan 비목표: robots 정책 변경 없음)라 기본 메타만 부여.

### 5.2 로그아웃 진입점 — `src/components/layout/LogoutButton.tsx` (신규)

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout/', { method: 'POST' }); // trailingSlash:true — 슬래시 없으면 308
    router.push('/login/');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      aria-label="로그아웃"
      className="rounded-md p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      <LogOut className="size-5" />
    </button>
  );
}
```

### 5.3 `src/components/layout/Header.tsx` 수정

기존 `FontSizeToggle`/`ThemeToggle` 바로 옆(데스크톱 nav 끝, 모바일 아이콘 바)에 `<LogoutButton />` 추가 — 두 곳(24번째 줄 부근 데스크톱 `<nav>`, 45번째 줄 부근 모바일 `<div>`) 모두에 삽입. 그 외 구조·마크업 변경 없음.

---

## 6. `next.config.mjs` 변경

```diff
 const nextConfig = {
-  output: 'export',
   pageExtensions: ['ts', 'tsx', 'mdx'],
   images: { unoptimized: true },
   reactStrictMode: true,
   trailingSlash: true,
   basePath: basePath || undefined,
   assetPrefix: basePath || undefined,
   ...
 };
```

- `images.unoptimized: true`는 **그대로 유지**한다 — `output: 'export'` 제거로 Vercel의 실시간 이미지 최적화를 켤 수도 있지만, 이번 사이클 범위 밖(Plan 비목표에 없음)이라 회귀 위험을 늘리지 않기 위해 손대지 않는다. 이미지 최적화 전환은 별도 후속 과제로 남긴다.
- `basePath`/`assetPrefix`/`trailingSlash` 로직은 `output: 'export'` 여부와 무관하게 표준 Next.js 서버 모드에서도 동일하게 동작 — 무수정.

---

## 7. 환경 변수

### 7.1 `.env.local.example` (신규, 커밋 대상)

```dotenv
# 로그인 게이트 — 고정 ID/PW 1쌍
SITE_AUTH_ID=
SITE_AUTH_PASSWORD=

# 쿠키 서명 전용 비밀키 — 로그인 비밀번호와 별개. 생성: openssl rand -base64 32
SITE_AUTH_SESSION_SECRET=
```

`.env.local`(실제 값 포함, 커밋 금지 — 기존 `.gitignore` 규칙으로 이미 보장)은 사용자가 로컬에서 직접 생성한다. Claude가 임의로 자격 증명 값을 생성하지 않는다.

### 7.2 Vercel Production/Preview 등록 (Plan G6/DoD)

```bash
vercel env add SITE_AUTH_ID production
vercel env add SITE_AUTH_ID preview
vercel env add SITE_AUTH_PASSWORD production
vercel env add SITE_AUTH_PASSWORD preview
vercel env add SITE_AUTH_SESSION_SECRET production
vercel env add SITE_AUTH_SESSION_SECRET preview
```

`SITE_AUTH_SESSION_SECRET`은 production/preview에 서로 다른 값을 써도 무방하다(오히려 권장 — 세션 격리). ID/PW는 두 환경에서 동일하게 유지.

---

## 8. 검증 계획

| 항목 | 방법 |
|---|---|
| 미인증 리다이렉트 | 시크릿 창으로 임의 페이지(`/chapter/1/`, `/chemicals/` 등) 직접 접근 → `/login?redirect=...`로 이동 확인 |
| 로그인 성공 플로우 | 올바른 ID/PW 제출 → 원래 요청 경로로 복귀 확인 |
| 로그인 실패 플로우 | 잘못된 ID/PW 제출 → 필드 구분 없는 에러 메시지만 표시(FR-4) |
| 세션 유지 | 로그인 후 새로고침·재방문 시 30일 내 재로그인 불필요 |
| 로그아웃 | Header 로그아웃 버튼 → 즉시 `/login`, 이후 아무 페이지 재접근 시 다시 게이트 |
| OG 미리보기 | 카카오톡 링크 디버거 또는 `curl -I https://.../og-default.svg`로 200 확인(리다이렉트 아님) |
| 정적 라우트 회귀 (NFR-5) | `npm run build` 전체 통과 + `chapter/[slug]`, `process/[slug]`, `chemicals/[id]`, `sources/[source]`, `sources/osha-scs/[part]` 등 기존 동적 라우트 페이지 수 유지 확인 |
| 데이터 파이프라인 회귀 (NFR-7) | `predev`/`prebuild` 훅으로 `quotes.json`/`cross-link.json`이 기존과 동일하게 재생성되는지 확인 |
| 품질 게이트 (NFR-6) | `npm run typecheck` + `npm run lint` + `npm run build` 무오류 |
| Edge 런타임 호환 (NFR-3) | 로컬에서 `next build` 시 미들웨어가 Edge 런타임으로 컴파일되는지 로그 확인(Node 전용 API 사용 시 빌드 경고/에러 발생) |

---

## 9. 구현 순서

1. `.env.local`(로컬, 사용자 직접 생성) + `.env.local.example`
2. `src/lib/auth/session.ts` — 공유 크립토 모듈
3. `next.config.mjs`에서 `output: 'export'` 제거
4. `src/middleware.ts`
5. `src/app/api/login/route.ts`, `src/app/api/logout/route.ts`
6. `src/app/login/page.tsx`
7. `src/components/layout/LogoutButton.tsx` 신규 + `Header.tsx` 삽입
8. `npm run typecheck && npm run lint && npm run build` 통과 확인 → Vercel 환경변수 등록(§7.2) → Preview 배포에서 §8 전 항목 수동 검증
