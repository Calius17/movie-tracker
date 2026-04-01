# Movie Orbit

Online Movie Tracking and Site Recommendation System built with Next.js App Router, Tailwind CSS, Supabase, and TMDB.

## Tech Stack
- Next.js 16 (App Router, TypeScript)
- Tailwind CSS 4
- Supabase (Postgres and Auth)
- TMDB API
- lucide-react icons

## Implemented Baseline
- Navbar and responsive homepage shell
- Real-time TMDB movie search via API route at /api/tmdb/search
- Supabase client setup in lib/supabase/client.ts
- SQL schema for:
  - profiles (id, email, role, created_at)
  - watchlist (id, user_id, tmdb_id, status, rating, review)
  - tickets (id, user_id, movie_name, status)

## Environment Variables
Create a .env.local file with:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
TMDB_API_KEY=

You can use .env.example as a template.

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

## Notes
- Role values in profiles are constrained to: normal, premium, provider, admin.
- Watchlist status values are: watched, watching, plan_to_watch.
- Ticket status values are: open, in_progress, resolved, closed.
