'use client';

import Link from 'next/link';
import { Fragment, useState } from 'react';
import { Menu, X, BookOpen } from 'lucide-react';
import { getGroupedSources } from '@/lib/sources';
import { Disclosure } from '@/components/ui/Disclosure';
import { ThemeToggle } from './ThemeToggle';
import { FontSizeToggle } from './FontSizeToggle';
import { LogoutButton } from './LogoutButton';
import { SourcesDropdown } from './SourcesDropdown';

const navItems = [
  { href: '/process-overview/', label: '공정' },
  { href: '/chemicals/', label: '유해물질 사전' },
  { href: '/quotes/', label: '검색' },
];

const { standalone: standaloneSources, groups: sourceGroups } = getGroupedSources();

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
          <BookOpen className="size-6 text-brand-600" />
          <span>반도체 아카데미</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="주 메뉴">
          <SourcesDropdown />
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              {item.label}
            </Link>
          ))}
          <FontSizeToggle />
          <ThemeToggle />
          <LogoutButton />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <FontSizeToggle />
          <ThemeToggle />
          <LogoutButton />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={open}
            className="rounded-md p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="모바일 메뉴"
          className="border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-950"
        >
          <ul className="space-y-1 px-4 py-3">
            <li>
              <Disclosure title="자료원">
                <ul className="space-y-1">
                  {standaloneSources.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/sources/${s.id}/`}
                        onClick={close}
                        className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        {s.title}
                      </Link>
                    </li>
                  ))}
                  {sourceGroups.map((g) => (
                    <Fragment key={g.category}>
                      <li className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {g.label}
                      </li>
                      {g.sources.map((s) => (
                        <li key={s.id}>
                          <Link
                            href={`/sources/${s.id}/`}
                            onClick={close}
                            className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            {s.title}
                          </Link>
                        </li>
                      ))}
                    </Fragment>
                  ))}
                  <li>
                    <Link
                      href="/#sources"
                      onClick={close}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      전체 자료원 보기 →
                    </Link>
                  </li>
                </ul>
              </Disclosure>
            </li>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
