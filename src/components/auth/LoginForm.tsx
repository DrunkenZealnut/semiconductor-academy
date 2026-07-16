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
