import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_NAME, verifySessionToken } from '@/lib/auth/session';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const authenticated = await verifySessionToken(token);

  if (authenticated) return NextResponse.next();

  // nextUrl.pathname/search는 basePath가 이미 제거된 값 — redirect 파라미터는 이 값 그대로 저장해
  // 로그인 후 router.push(basePath 자동 반영)로 되돌아갈 수 있게 한다. 리다이렉트 대상 URL 자체는
  // fetch를 거치지 않는 raw HTTP redirect라 basePath를 직접 붙여야 한다.
  const loginUrl = new URL(`${request.nextUrl.basePath}/login`, request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|api/login|api/logout|og-default.svg).*)'],
};
