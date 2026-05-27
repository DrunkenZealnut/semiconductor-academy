import Link from 'next/link';
import { ArrowRight, Compass, FlaskConical, Activity } from 'lucide-react';
import { ProcessDiagram } from '@/components/process/ProcessDiagram';
import { ChaptersHero } from '@/components/chapter/ChaptersHero';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: '반도체 산업과 유해인자, 쉽게 배우기',
  description:
    '반도체는 어떻게 만들고, 그 안에 어떤 위험이 있을까요? 중·고등학생부터 일반인까지, 비유와 일러스트로 풀어드려요.',
});

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Hero */}
      <section className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          반도체 아카데미
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100">
          어려운 반도체 이야기,
          <br />
          <span className="text-brand-600">쉽게 풀어드려요</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          반도체는 어떻게 만들고, 그 안에 어떤 위험이 숨어있을까요?
          <br />
          학술 자료를 비유와 일러스트로 다시 풀어 누구나 이해할 수 있게 만들었어요.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/what-is-semiconductor/"
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-brand-700 hover:shadow-lg"
          >
            반도체란 무엇일까?
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/process-overview/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            제조 공정 둘러보기
          </Link>
        </div>
      </section>

      {/* Process Diagram */}
      <section className="mt-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              반도체 제조 9단계
            </h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              각 단계를 클릭하면 자세히 알 수 있어요.
            </p>
          </div>
        </div>
        <ProcessDiagram />
      </section>

      {/* 책 차례 진입 - 책처럼 차근차근 */}
      <ChaptersHero />

      {/* Three pillars */}
      <section className="mt-20 grid gap-6 md:grid-cols-3">
        <FeatureCard
          icon={Compass}
          title="학습 시작 가이드"
          description="처음이라면 여기서부터. 약 40분 안에 반도체 산업의 큰 그림을 잡을 수 있어요."
          href="/start/"
          color="text-cyan-600"
        />
        <FeatureCard
          icon={FlaskConical}
          title="유해물질 사전"
          description="100여 가지 화학물질의 이름·위험성·쓰이는 공정을 검색할 수 있어요."
          href="/chemicals/"
          color="text-purple-600"
        />
        <FeatureCard
          icon={Activity}
          title="직업병 이야기"
          description="반도체 산업에서 보고된 직업병 사례와 우리가 알아야 할 것들."
          href="/occupational-disease/"
          color="text-red-600"
        />
      </section>

      {/* CTA — 톤다운된 단색 (다이어그램이 메인이라 secondary 톤) */}
      <section className="mt-20 rounded-3xl border border-slate-200 bg-slate-50 px-8 py-10 text-center dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          처음 오셨다면?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
          반도체가 무엇인지부터 차근차근 시작해 보세요. 비유와 그림으로 풀어드려요.
        </p>
        <Link
          href="/what-is-semiconductor/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700 hover:shadow-md"
        >
          처음부터 시작하기
          <ArrowRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  color: string;
}

function FeatureCard({ icon: Icon, title, description, href, color }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
    >
      <Icon className={`size-8 ${color}`} />
      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
        자세히 보기
        <ArrowRight className="size-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
