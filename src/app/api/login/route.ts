import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { COOKIE_NAME, MAX_AGE_SECONDS, createSessionToken } from '@/lib/auth/session';

// Route Handler는 기본 Node 런타임이라 Node crypto 사용 가능(Edge 제약은 src/middleware.ts만 해당)
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
