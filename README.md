# Movie Orbit

Online Movie Tracking and Site Recommendation System built with Next.js App Router, Tailwind CSS, Supabase, and TMDB.

## Live Website

Production: https://movie-tracker-calius-projects.vercel.app

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS 4
- Supabase (Postgres and Auth)
- TMDB API
- lucide-react icons

## Implemented Baseline

- Netflix/IMDB-inspired multi-page UI with a responsive landing page and dedicated routes
- Browse page for live TMDB search and instant watchlist tracking
- Watchlist page for status, rating, and review management
- Premium page for advanced recommendation views
- Provider page for streaming availability links
- Admin page for moderation and review tickets
- Real-time TMDB movie search via API route at /api/tmdb/search
- Movie detail and recommendation routes at /api/tmdb/movie/[id] and /api/tmdb/discover
- Supabase client setup in [lib/supabase/client.ts](lib/supabase/client.ts)
- SQL schema for:
  - profiles (id, email, role, created_at)
  - watchlist (id, user_id, tmdb_id, status, rating, review)
  - tickets (id, user_id, movie_name, status)
- Watchlist controls for watched, watching, and plan-to-watch states
- Premium recommendation mode driven by movie metadata and genres
- Provider link management for streaming availability
- Admin moderation queue for review reports and ticket handling

## Environment Variables

Create a .env.local file with:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
TMDB_API_KEY=
TMDB_BEARER_TOKEN=

You can use .env.example as a template.

TMDB configuration notes:

- You can use either TMDB_API_KEY (v3 API key) or TMDB_BEARER_TOKEN (v4 read access token).
- Keep TMDB credentials server-side only in .env.local.
- After editing .env.local, restart the dev server.

## Run Locally

1. Install dependencies:
   npm install
2. Start development server:
   npm run dev
3. Open:
   http://localhost:3000

## Database Setup (Supabase)

1. Open Supabase SQL Editor.
2. Run the SQL in supabase/schema.sql.
3. Verify tables are created under public schema.

## UI Behavior

1. Use the top navigation or landing cards to move between pages.
2. Search TMDB titles on Browse and press "Track this movie" to add them to your watchlist.
3. Update status, rating, and review on the Watchlist page.
4. Review genre-based suggestions on the Premium page.
5. Add streaming links on the Provider page.
6. Flag a review to move it into the Admin moderation queue.

## Notes

- Role values in profiles are constrained to: normal, premium, provider, admin.
- Watchlist status values are: watched, watching, plan_to_watch.
- Ticket status values are: open, in_progress, resolved, closed.
