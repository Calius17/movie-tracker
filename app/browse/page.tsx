'use client';

import Link from 'next/link';
import { Film, Sparkles } from 'lucide-react';

import { TmdbSearch } from '@/components/tmdb-search';
import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function BrowsePage() {
  const {
    addMovieToWatchlist,
    recommendations,
    recommendationsLoading,
    averageRating,
  } = useMovieOrbitState();

  const featuredMovie = recommendations[0] ?? null;
  const featuredBackdrop = featuredMovie?.posterPath
    ? `https://image.tmdb.org/t/p/w780${featuredMovie.posterPath}`
    : null;

  return (
    <main className='mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-10 px-6 py-8 sm:px-10 lg:px-14'>
      <section className='relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/75 shadow-[0_30px_120px_rgba(0,0,0,0.45)]'>
        {featuredBackdrop ? (
          <div
            className='absolute inset-0 bg-cover bg-center opacity-45'
            style={{ backgroundImage: `url(${featuredBackdrop})` }}
          />
        ) : null}
        <div className='absolute inset-0 bg-[linear-gradient(110deg,rgba(2,6,23,0.96)_18%,rgba(2,6,23,0.75)_52%,rgba(2,6,23,0.9)_100%)]' />

        <div className='relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.2fr,0.8fr] lg:items-end'>
          <div className='space-y-4'>
            <Badge className='rounded-full border border-white/15 bg-white/10 text-white'>
              <Sparkles className='mr-1 h-3.5 w-3.5 text-cyan-300' />
              Featured discovery
            </Badge>
            <h1 className='max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl'>
              {featuredMovie?.title ?? 'Discover your next favorite movie.'}
            </h1>
            <p className='max-w-2xl text-sm leading-7 text-slate-300 sm:text-base'>
              {featuredMovie?.overview ??
                'Browse a curated cinematic feed with a clean, minimal interface inspired by premium streaming platforms.'}
            </p>
            <div className='flex flex-wrap items-center gap-3 text-sm text-slate-300'>
              <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1'>
                Score {averageRating.toFixed(1)}
              </span>
              <span className='rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100'>
                Active discovery
              </span>
            </div>
          </div>

          <Card className='border-white/10 bg-black/25 text-white backdrop-blur-xl'>
            <CardContent className='space-y-4 p-5'>
              <p className='text-xs uppercase tracking-[0.2em] text-slate-300'>
                Personal picks
              </p>
              <p className='text-3xl font-semibold text-white'>
                {recommendationsLoading ? '...' : recommendations.length}
              </p>
              <p className='text-sm leading-6 text-slate-300'>
                Recommendations update as you track and rate more movies.
              </p>
              <Link
                href='/watchlist'
                className='inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15'
              >
                Open watchlist
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-medium tracking-wide text-slate-100'>
            Discovery picks
          </h2>
          <span className='text-xs uppercase tracking-[0.18em] text-cyan-300'>
            scroll
          </span>
        </div>

        {recommendations.length === 0 ? (
          <div className='rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-6 text-sm text-slate-400'>
            Add titles to your watchlist to unlock personalized poster picks.
          </div>
        ) : (
          <div className='flex gap-4 overflow-x-auto pb-1'>
            {recommendations.map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className='group w-[145px] shrink-0 space-y-2'
              >
                <div className='relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition group-hover:border-cyan-300/35'>
                  {movie.posterPath ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                      alt={movie.title}
                      className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                    />
                  ) : (
                    <div className='flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 text-xs text-slate-300'>
                      No poster
                    </div>
                  )}
                </div>
                <p className='line-clamp-2 text-sm font-medium text-slate-100'>
                  {movie.title}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className='space-y-4'>
        <div className='flex items-center gap-2 text-slate-200'>
          <Film className='h-4 w-4 text-cyan-300' />
          <h2 className='text-lg font-medium'>Search the catalog</h2>
        </div>
        <TmdbSearch onAddMovie={addMovieToWatchlist} />
      </section>
    </main>
  );
}
