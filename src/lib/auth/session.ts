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
