# 반도체 아카데미 (Semiconductor Academy)

> 반도체 산업과 유해인자를 누구나 이해할 수 있게 풀어주는 학습 사이트

원본 학술 자료 「반도체 산업의 유해인자」(윤충식 외)를 바탕으로, 중·고등학생과 일반인이
이해할 수 있도록 비유·일러스트·인터랙티브 다이어그램으로 재구성한 정적 웹사이트.

## 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# 타입 체크
npm run typecheck

# 프로덕션 빌드 (정적 사이트 export)
npm run build
```

개발 서버는 http://localhost:3000 에서 실행됩니다.

## 기술 스택

- **Next.js 15** (App Router, SSG / static export)
- **TypeScript 5**
- **Tailwind CSS v4**
- **MDX** (`@next/mdx`) — 챕터 본문
- **Fuse.js** — 유해물질 사전 검색
- **Lucide** — 아이콘
- **Vercel** — 배포 (예정)

## 폴더 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx            # 홈 (인터랙티브 다이어그램)
│   ├── what-is-semiconductor/page.mdx
│   ├── process-overview/   # 공정 한눈에 보기
│   ├── process/[slug]/     # 공정 상세 (동적 라우팅)
│   ├── chemicals/          # 유해물질 사전 + 상세
│   └── ...
├── components/
│   ├── layout/             # Header, Footer, ThemeToggle
│   ├── content/            # LayeredExplain, Term, Callout, ...
│   ├── process/            # ProcessDiagram (인터랙티브)
│   ├── chemicals/          # ChemicalCard, ChemicalSearch
│   └── ui/                 # 기본 프리미티브
├── content/                # MDX 챕터 본문 (확장 예정)
├── data/                   # 정적 데이터 (JSON)
│   ├── processes.json      # 9개 공정 메타
│   ├── chemicals.json      # 유해물질 사전
│   └── terms.json          # 용어 사전
├── lib/                    # 헬퍼 (content, search, seo, types)
└── styles/                 # globals.css

data/                       # 원본 학술 자료 (수정 금지)
docs/                       # PDCA 문서 (plan / design / report)
```

## PDCA 문서

- [Plan](docs/01-plan/features/semiconductor-academy-site.plan.md)
- [Design](docs/02-design/features/semiconductor-academy-site.design.md)

## 핵심 컨셉: 3단 레이어

모든 어려운 개념은 3단 레이어로 풀어요:

```
1. Hook    — 한 줄 요약 ("반도체는 전기가 반만 흐르는 물질이에요")
2. Easy    — 비유와 일러스트 ("수도꼭지 같아요")
3. Deep    — 원본 학술 표현 (접기/펼치기)
```

## 라이선스

- 사이트 코드: MIT (예정)
- 콘텐츠: 원본 도서의 정당한 인용 범위 내 재구성

## 출처

「반도체 산업의 유해인자 (Hazards in Semiconductor Industry)」, 윤충식·김승원·박동욱·정지연·최상준·하권철·함승헌, 에피스테메.
