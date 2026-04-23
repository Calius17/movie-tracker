# Movie Orbit

Movie Orbit is a clean, role-aware movie tracking and recommendation web app built with Next.js.
It combines TMDB-powered discovery with watchlist management, plan onboarding, and staff workflows.

## Live URL

Primary production URL:
https://movie-tracker-calius-projects.vercel.app/

## Highlights

- Modern Next.js App Router project with TypeScript and Tailwind CSS 4
- TMDB-powered browse, search, discover, and movie detail experiences
- Personal watchlist with status, rating, and notes
- Plan flow with Free and Ad-free onboarding
- Role-aware pages for user dashboard and staff moderation
- Local demo auth and per-account persisted state (isolated by user email)

## App Routes

- / (home)
- /browse
- /movie/[id]
- /watchlist
- /premium
- /dashboard
- /admin
- /login
- /signup
- /api/tmdb/search
- /api/tmdb/discover
- /api/tmdb/movie/[id]

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React
- TMDB API

Note:
Supabase client and SQL schema scaffolding are included in the repository, while the current user flow runs in local demo mode via browser storage.

## Environment Variables

Copy .env.example to .env.local and set values:

- NEXT_PUBLIC_SUPABASE_URL=
- NEXT_PUBLIC_SUPABASE_ANON_KEY=
- TMDB_API_KEY=
- NEXT_PUBLIC_TMDB_API_KEY=
- TMDB_BEARER_TOKEN=
- TMDB_API_READ_ACCESS_TOKEN=

TMDB setup:

- Use either TMDB_API_KEY or TMDB_BEARER_TOKEN/TMDB_API_READ_ACCESS_TOKEN.
- Keep sensitive keys in .env.local.
- Restart dev server after changing environment variables.

## Local Development

1. Install dependencies.

```bash
npm install
```

2. Run development server.

```bash
npm run dev
```

3. Open http://localhost:3000

## Quality Checks

```bash
npm run lint
npm run build
```

Both commands should pass before deployment.

## Demo Staff Accounts

- admin@movieorbit.app / Admin123!
- moderator@movieorbit.app / Moderator123!

## Repository Structure

- app/: routes and API handlers
- components/: reusable UI and state logic
- lib/: utility modules (TMDB, Supabase client)
- supabase/: SQL schema scaffold

## License

This project is currently maintained as a private repository.
