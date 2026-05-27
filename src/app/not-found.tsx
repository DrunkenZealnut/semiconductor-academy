import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
        페이지를 찾을 수 없어요
      </h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        주소를 다시 확인해 주세요.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-brand-600 px-6 py-3 font-semibold text-white"
      >
        홈으로
      </Link>
    </div>
  );
}
