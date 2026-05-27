import type { Metadata } from 'next';

const SITE_NAME = '반도체 아카데미';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drunkenzealnut.github.io';
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const DEFAULT_DESCRIPTION =
  '반도체 산업과 유해인자를 누구나 이해할 수 있게 풀어드려요. 중·고등학생부터 일반인까지, 비유와 일러스트로 배우는 반도체 안전보건.';

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
