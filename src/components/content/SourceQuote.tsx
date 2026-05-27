import { Disclosure } from '@/components/ui/Disclosure';
import type { ReactNode } from 'react';

interface SourceQuoteProps {
  page?: number;
  section?: string;
  children: ReactNode;
}

export function SourceQuote({ page, section, children }: SourceQuoteProps) {
  const label = `📖 원본 보기${page ? ` (p.${page})` : ''}${section ? ` — ${section}` : ''}`;
  return (
    <Disclosure title={label} className="my-4">
      <div className="prose prose-sm max-w-none text-slate-700 dark:prose-invert dark:text-slate-300">
        {children}
      </div>
    </Disclosure>
  );
}
