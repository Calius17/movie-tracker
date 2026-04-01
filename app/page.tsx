import { TmdbSearch } from '@/components/tmdb-search';

export default function Home() {
  return (
    <main className='mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8'>
      <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7'>
        <p className='text-sm font-semibold uppercase tracking-[0.14em] text-sky-700'>
          University Project Starter
        </p>
        <h1 className='mt-2 text-3xl font-bold tracking-tight sm:text-4xl'>
          Online Movie Tracking and Site Recommendation System
        </h1>
        <p className='mt-3 max-w-3xl text-sm text-slate-600 sm:text-base'>
          Users can search movies, build watchlists, and receive personalized
          recommendations. This base includes TMDB real-time search, Supabase
          client wiring, and SQL tables for profiles, watchlist, and support
          tickets.
        </p>
      </section>

      <TmdbSearch />
    </main>
  );
}
