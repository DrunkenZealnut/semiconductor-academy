import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

type SpecialTone = 'process' | 'hazard';

interface FooterLink {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SpecialSectionProps {
  tone: SpecialTone;
  emoji: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footerLinks?: FooterLink[];
}

const TONE_CONTAINER: Record<SpecialTone, string> = {
  process:
    'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900',
  hazard:
    'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900',
};

const TONE_CHIP: Record<SpecialTone, string> = {
  process:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200',
  hazard:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200',
};

const TONE_ACCENT: Record<SpecialTone, string> = {
  process: 'text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200',
  hazard: 'text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200',
};

const TONE_DIVIDER: Record<SpecialTone, string> = {
  process: 'border-emerald-200 dark:border-emerald-900',
  hazard: 'border-amber-200 dark:border-amber-900',
};

export function SpecialSection({
  tone,
  emoji,
  eyebrow,
  title,
  description,
  children,
  footerLinks,
}: SpecialSectionProps) {
  return (
    <section
      className={cn(
        'mt-16 overflow-hidden rounded-3xl border-2 px-6 py-10 sm:px-10 sm:py-12',
        TONE_CONTAINER[tone],
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
              TONE_CHIP[tone],
            )}
          >
            <Sparkles aria-hidden className="size-3" />
            {eyebrow}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>
        <span aria-hidden className="shrink-0 text-5xl sm:text-6xl">
          {emoji}
        </span>
      </header>

      <div className="mt-8">{children}</div>

      {footerLinks && footerLinks.length > 0 && (
        <footer
          className={cn(
            'mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t pt-6 text-sm font-semibold',
            TONE_DIVIDER[tone],
          )}
        >
          {footerLinks.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={cn('inline-flex items-center gap-1.5', TONE_ACCENT[tone])}
            >
              {f.icon && <f.icon className="size-4" />}
              {f.label}
              <ArrowRight className="size-3" />
            </Link>
          ))}
        </footer>
      )}
    </section>
  );
}
