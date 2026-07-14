import type { Metadata } from 'next';

const SITE_NAME = '반도체 아카데미';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drunkenzealnut.github.io';
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const DEFAULT_DESCRIPTION =
  '학술서·OSHA·NCS·고교 교과서 4개 자료원으로 배우는 반도체 — 공정 원리부터 유해인자·안전·직무까지, 중·고등학생 눈높이로 풀어드려요.';

interface SeoInput {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
}

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  ogImage = '/og-default.svg',
}: SeoInput = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${BASE_PATH}${path}`;
  const ogUrl = `${SITE_URL}${BASE_PATH}${ogImage}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(`${SITE_URL}${BASE_PATH}` || SITE_URL),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
      locale: 'ko_KR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogUrl],
    },
    alternates: { canonical: url },
  };
}
