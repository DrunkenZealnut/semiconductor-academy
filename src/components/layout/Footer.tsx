import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-50 py-10 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">반도체 아카데미</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              반도체 산업과 유해인자를 누구나 이해할 수 있게 풀어드리는 학습 사이트.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">학습</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link href="/what-is-semiconductor/" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">반도체란?</Link></li>
              <li><Link href="/process-overview/" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">공정 한눈에</Link></li>
              <li><Link href="/chemicals/" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">유해물질 사전</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">자료</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link href="/about/" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">소개 & 출처</Link></li>
              <li><Link href="/occupational-disease/" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">직업병 사례</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800">
          <p>
            원본: 윤충식 외, 「반도체 산업의 유해인자 (Hazards in Semiconductor Industry)」.
          </p>
          <p className="mt-1">
            본 사이트는 교육 목적의 재구성 자료입니다. 정확한 정보는 원본 자료를 참고하세요.
          </p>
        </div>
      </div>
    </footer>
  );
}
