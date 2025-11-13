## Coding Ninjas — Coding Ninjas

Next.js (App Router) + TypeScript implementation of the Coding Ninjas Chitkara digital portfolio. The experience mirrors the reference portfolio layout, adds a react-three-fiber shuriken hero, expands the About story with Vaelkrith content, and bakes in SEO, analytics, and accessibility best practices.

### Highlights

- App Router architecture with reusable UI system (`SectionTitle`, `CTAButton`, `Card`, `ProjectCard`, `Timeline`, `Shuriken3D`)
- Portfolio-inspired hero featuring a lazy-loaded 3D shuriken with mobile SVG fallback
- Vaelkrith About content plus mission, timeline, achievements, projects, and leadership spotlights
- Contact pipeline with server validation (`/api/contact`), careers hub, sample blog + RSS feed
- Global motion defaults (Framer Motion), Lenis smooth scrolling (respects reduced motion), guided tour overlay
- Growth stack: sitemap/robots, JSON-LD (Organization + Events), dynamic OG image endpoint, Lighthouse CI, GA4-ready cookie consent

### Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 3.4 with custom tokens
- Framer Motion, react-three-fiber/drei, Lenis
- Zod, SWR, gray-matter, remark, Feed
- Jest + Testing Library, Husky + lint-staged, Lighthouse CI

---

### Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to explore the site locally.

### Environment

Copy `.env.example` to `.env.local` and provide real values when available:

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://your-production-url
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster-url>
MONGODB_DB=coding_ninjas
```

`NEXT_PUBLIC_SITE_URL` powers SEO helpers (sitemap, RSS, OG images). Analytics is gated behind cookie consent and only initialises when `NEXT_PUBLIC_GA_ID` is present.

High score storage for the Ninja Runner game uses MongoDB via the `MONGODB_URI` and `MONGODB_DB` settings. The API endpoint lives at `/api/highscore` and stores the single highest score per game (default `game=NinjaRunner`).

### Scripts

| Command          | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `npm run dev`    | Start local dev server                                   |
| `npm run build`  | Create production build                                  |
| `npm run start`  | Serve the production build                               |
| `npm run lint`   | ESLint (Core Web Vitals rules)                           |
| `npm run test`   | Jest + Testing Library smoke tests                       |
| `npm run format` | Format with Prettier                                     |
| `npm run lhci`   | Runs Lighthouse CI (requires `npm run build` beforehand) |

Husky installs automatically via `npm install` and triggers `lint-staged` on commits.

### Content & Structure

- Hero, mission, projects, and join content live in reusable components under `src/components/home/`
- About timeline, achievements, leadership, and events data: `src/data/club.ts`
- Blog posts: markdown in `src/content/blog/`. Add new posts, run `npm run build` to refresh sitemap/RSS.
- RSS feed: `/rss.xml` route builds from markdown content.

### SEO & Growth

- `app/sitemap.ts` and `app/robots.txt/route.ts` are generated per build
- JSON-LD for Organization and Events injected globally via `app/layout.tsx`
- Dynamic OG cards: `/api/og?title=Custom+Title`
- Analytics helper in `src/lib/analytics.ts` handles GA initialisation on consent

### 3D Shuriken Notes

`Shuriken3D` lives at `src/components/visuals/Shuriken3D.tsx`. Swap the generated geometry with a custom GLTF/OBJ when available, keeping the lazy-loaded dynamic import in the hero (`dynamic(() => import(...), { ssr: false })`).

### Accessibility & Performance

- Skip-to-content, focus states, keyboard-friendly navigation, prefers-reduced-motion support
- Lenis disabled for users that prefer reduced motion
- Lighthouse thresholds enforced (≥ 90 Performance, ≥ 95 Accessibility). Update `lighthouserc.js` if targets change.

### Deployment

1. `npm run build`
2. `npm run start` to smoke-test the production bundle locally
3. Configure Vercel (recommended) or target of choice. Ensure env vars are set and `NEXT_PUBLIC_SITE_URL` matches the deployed domain.
4. After deployment run `npm run lhci` against the deployed URL and record the report links in the PR.

### Maintenance Checklist

- Update timeline, achievements, and leadership data in `src/data/club.ts`
- Add blog posts in `src/content/blog/` to keep the feed fresh
- Document Lighthouse scores in PRs / README as requested
- Keep dependencies patched (`npm audit fix` if needed) and rerun tests before merging
