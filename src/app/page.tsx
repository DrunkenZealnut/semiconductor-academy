import Link from 'next/link';
import { ArrowRight, Activity, Compass, Cpu, FlaskConical, Info } from 'lucide-react';
import { LearningPathSection } from '@/components/layout/LearningPathSection';
import { PlatformHero } from '@/components/layout/PlatformHero';
import { SpecialSection } from '@/components/layout/SpecialSection';
import { ProcessDiagram } from '@/components/process/ProcessDiagram';
import { SourcePicker } from '@/components/sources/SourcePicker';
import { SOURCES } from '@/lib/sources';
import { buildMetadata } from '@/lib/seo';

const TOTAL_UNITS = SOURCES.reduce((n, s) => n + s.sections.length, 0);

export const metadata = buildMetadata({
  description: `학술서·OSHA·NCS·고교 교과서 4개 자료원, ${TOTAL_UNITS}개 학습 단위로 배우는 반도체 — 공정 원리부터 유해인자·안전·직무까지 중·고등학생 눈높이로 풀어드려요.`,
});

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PlatformHero />

      <SourcePicker />

      <LearningPathSection />

      <SpecialSection
        tone="process"
        emoji="⚙"
        eyebrow="특별 섹션 · 반도체 공정"
        title="9단계 제조 공정 한눈에"
        description="책의 공정 챕터(Ch.5~13)를 인터랙티브 다이어그램으로 먼저 둘러보세요. 각 단계 카드를 누르면 해당 공정의 유해인자도 확인할 수 있어요."
        footerLinks={[
          { label: '공정 챕터 모아보기', href: '/chapters/#process', icon: Cpu },
          { label: '공정 개요 페이지', href: '/process-overview/', icon: Compass },
        ]}
      >
        <ProcessDiagram />
      </SpecialSection>

      <SpecialSection
        tone="hazard"
        emoji="⚠"
        eyebrow="특별 섹션 · 유해물질 · 직업병"
        title="화학물질부터 직업병까지"
        description="100여 가지 화학물질의 위험성과 반도체 산업에서 보고된 직업병 사례. 책의 Ch.14~16에서 다룬 학술 내용을 검색 가능한 형태로 제공합니다."
        footerLinks={[
          { label: '유해성 챕터 모아보기', href: '/chapters/#hazard', icon: FlaskConical },
        ]}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <HazardCard
            icon={FlaskConical}
            title="유해물질 사전"
            description="100여 가지 화학물질의 이름·위험성·쓰이는 공정을 검색할 수 있어요."
            href="/chemicals/"
          />
          <HazardCard
            icon={Activity}
            title="직업병 이야기"
            description="반도체 산업에서 보고된 직업병 사례와 우리가 알아야 할 것들."
            href="/occupational-disease/"
          />
        </div>
      </SpecialSection>

      <FooterLinks />
    </div>
  );
}

interface HazardCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
}

function HazardCard({ icon: Icon, title, description, href }: HazardCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-amber-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-amber-900 dark:bg-slate-900"
    >
      <Icon className="size-7 text-amber-700 dark:text-amber-300" />
      <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {description}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-700 transition group-hover:gap-2 dark:text-amber-300">
        보러 가기
        <ArrowRight className="size-3" />
      </span>
    </Link>
  );
}

function FooterLinks() {
  return (
    <section className="mt-16 border-t border-slate-200 pt-8 dark:border-slate-800">
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
        <li>
          <Link href="/start/" className="hover:text-brand-600">
            학습 시작 가이드
          </Link>
        </li>
        <li aria-hidden>·</li>
        <li>
          <Link href="/about/" className="hover:text-brand-600">
            사이트 소개
          </Link>
        </li>
        <li aria-hidden>·</li>
        <li>
          <Link href="/what-is-semiconductor/" className="hover:text-brand-600">
            반도체란 무엇일까?
          </Link>
        </li>
        <li className="basis-full" aria-hidden />
        <li className="inline-flex items-center gap-1 text-xs">
          <Info aria-hidden className="size-3" />
          4개 자료원으로 만든 학습 사이트 — 출처는 각 페이지와 사이트 소개에서 확인하세요
        </li>
      </ul>
    </section>
  );
}
