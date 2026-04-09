'use client';

import Link from 'next/link';
import { MoonStar, Sparkles, Star } from 'lucide-react';

import { PageShell } from '@/components/page-shell';
import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function PremiumPage() {
  const { state, recommendations, recommendationsLoading, favoriteGenres } =
    useMovieOrbitState();

  if (!state.isAuthenticated) {
    return (
      <PageShell
        eyebrow='Premium'
        title='Premium access unlocks personalized picks.'
        description='Sign in with a premium account to see richer recommendations and an ad-free presentation.'
      >
        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-6'>
            <p className='text-sm leading-7 text-slate-300'>
              This section is reserved for authenticated premium users.
            </p>
            <div className='flex flex-wrap gap-3'>
              <Link
                href='/login'
                className='inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm text-white transition hover:bg-white/10'
              >
                Log in
              </Link>
              <Link
                href='/signup'
                className='inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-slate-950 transition hover:bg-slate-100'
              >
                Create account
              </Link>
            </div>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  if (state.role !== 'premium') {
    return (
      <PageShell
        eyebrow='Premium'
        title='Upgrade to premium to unlock this area.'
        description='Premium screens stay hidden unless the logged-in account has the correct access level.'
      >
        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-6'>
            <p className='text-sm leading-7 text-slate-300'>
              Switch to a premium account in your profile session to view this
              page.
            </p>
            <Link
              href='/login'
              className='inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-slate-950 transition hover:bg-slate-100'
            >
              Go to login
            </Link>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow='Premium'
      title='Premium recommendations, without the clutter.'
      description='A focused page for advanced recommendations and an ad-free style of presentation.'
    >
      <div className='grid gap-6 xl:grid-cols-[0.85fr,1.15fr]'>
        <Card className='overflow-hidden border-white/70 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-sky-500 text-white shadow-[0_24px_80px_rgba(124,58,237,0.22)]'>
          <CardContent className='space-y-5 p-6'>
            <div className='flex items-center justify-between'>
              <Badge className='rounded-full bg-white/10 text-white'>
                <MoonStar className='mr-1 h-3.5 w-3.5' />
                Ad-free mode
              </Badge>
              <Sparkles className='h-8 w-8 text-white/90' />
            </div>
            <h2 className='text-3xl font-semibold tracking-tight'>
              Premium unlocks richer metadata signals.
            </h2>
            <p className='text-sm leading-7 text-white/85'>
              The premium view keeps the interface clean while showing
              genre-based picks, ratings, and the signals used to recommend the
              next movie.
            </p>
            <div className='grid gap-3 sm:grid-cols-2'>
              <div className='rounded-2xl bg-white/10 p-4'>
                <p className='text-xs uppercase tracking-[0.18em] text-white/60'>
                  Genres tracked
                </p>
                <p className='mt-2 text-3xl font-semibold'>
                  {favoriteGenres.length}
                </p>
              </div>
              <div className='rounded-2xl bg-white/10 p-4'>
                <p className='text-xs uppercase tracking-[0.18em] text-white/60'>
                  Recommendations
                </p>
                <p className='mt-2 text-3xl font-semibold'>
                  {recommendations.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-5'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>Recommended next</h2>
              <Badge variant='secondary'>
                {recommendationsLoading ? 'Loading' : 'Ready'}
              </Badge>
            </div>
            {recommendationsLoading ? (
              <p className='text-sm text-slate-300'>Loading premium picks...</p>
            ) : recommendations.length === 0 ? (
              <p className='rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300'>
                Add and rate a few movies first to unlock personalized premium
                picks.
              </p>
            ) : (
              <div className='grid gap-4 md:grid-cols-2'>
                {recommendations.map((movie) => (
                  <div
                    key={movie.id}
                    className='overflow-hidden rounded-3xl border border-white/10 bg-white/5'
                  >
                    <div className='aspect-[3/4] bg-slate-900'>
                      {movie.posterPath ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                          alt={movie.title}
                          className='h-full w-full object-cover'
                        />
                      ) : null}
                    </div>
                    <div className='space-y-2 p-4'>
                      <div className='flex items-center justify-between gap-3'>
                        <p className='font-semibold text-white'>
                          {movie.title}
                        </p>
                        <Badge variant='outline'>
                          <Star className='mr-1 h-3.5 w-3.5 fill-current' />
                          {movie.rating.toFixed(1)}
                        </Badge>
                      </div>
                      <p className='text-xs text-slate-400'>
                        {movie.releaseDate || 'Unknown release date'}
                      </p>
                      <p className='line-clamp-3 text-xs leading-5 text-slate-300'>
                        {movie.overview}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
