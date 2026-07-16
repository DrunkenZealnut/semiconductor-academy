'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

// fetch()는 Next.js 라우터를 거치지 않아 basePath가 자동 반영되지 않음(router.push는 자동 반영되므로 수동 처리 안 함)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${basePath}/api/logout/`, { method: 'POST' });
      if (!res.ok) return; // 실패 시 쿠키가 남아있을 수 있어 로그아웃된 것처럼 이동하지 않음
    } catch {
      return; // 네트워크 오류 — 동일하게 이동하지 않음
    }
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
