'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// fetch()는 Next.js 라우터를 거치지 않아 basePath가 자동 반영되지 않음(router.push는 자동 반영되므로 수동 처리 안 함)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// 문자열 prefix 검사(startsWith('/'))만으로는 `/\evil.com` 같은 입력이 통과한다 —
// 브라우저가 백슬래시를 슬래시로 정규화해 protocol-relative(외부 origin) URL이 되기 때문.
// new URL로 실제 파싱해 same-origin만 허용하고, pathname+search만 사용한다.
function getSafeRedirectTarget(path: string | null): string {
  if (!path) return '/';
  try {
    const url = new URL(path, window.location.origin);
    if (url.origin !== window.location.origin) return '/';
    return `${url.pathname}${url.search}`;
  } catch {
    return '/';
  }
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

    try {
      const res = await fetch(`${basePath}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });

      if (!res.ok) {
        setError(true);
        return;
      }

      const target = getSafeRedirectTarget(searchParams.get('redirect'));
      router.push(target);
      router.refresh(); // 로그인 직후 이동할 페이지의 RSC 캐시를 무효화
    } catch {
      // 네트워크 예외 — pending은 finally에서 항상 해제
      setError(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-4 px-4 py-16">
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">로그인</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">아이디와 비밀번호를 입력해 주세요.</p>

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
