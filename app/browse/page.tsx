'use client';

import { Clapperboard, Sparkles, Star, TrendingUp } from 'lucide-react';

import { PageShell } from '@/components/page-shell';
import { TmdbSearch } from '@/components/tmdb-search';
import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function BrowsePage() {
  const {
    addMovieToWatchlist,
    recommendations,
    recommendationsLoading,
    watchedCount,
    watchingCount,
    planCount,
    averageRating,
  } = useMovieOrbitState();

  return (
    <PageShell
      eyebrow='Browse'
      title='Find movies in a more cinematic discovery flow.'
      description='Search TMDB in real time, track titles immediately, and preview personalized suggestions in a dedicated browse screen.'
    >
      <div className='grid gap-6 xl:grid-cols-[1.15fr,0.85fr]'>
        <div className='space-y-6'>
          <TmdbSearch onAddMovie={addMovieToWatchlist} />

          <Card className='border-white/10 bg-slate-950/85 text-white'>
            <CardContent className='grid gap-4 p-5 sm:grid-cols-3'>
              {[
                { label: 'Watching', value: watchingCount, icon: Clapperboard },
                { label: 'Watched', value: watchedCount, icon: Star },
                { label: 'Plan to watch', value: planCount, icon: TrendingUp },
              ].map((item) => (
                <div
                  key={item.label}
                  className='rounded-2xl border border-white/10 bg-white/5 p-4'
                >
                  <div className='flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-400'>
                    <span>{item.label}</span>
                    <item.icon className='h-4 w-4' />
                  </div>
                  <p className='mt-3 text-3xl font-semibold'>{item.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card className='overflow-hidden border-white/70 bg-slate-950 text-white'>
            <CardContent className='space-y-4 p-5'>
              <Badge className='rounded-full bg-white/10 text-white'>
                <Sparkles className='mr-1 h-3.5 w-3.5' />
                Live discovery
              </Badge>
              <div>
                <p className='text-sm uppercase tracking-[0.18em] text-white/60'>
                  Average rating
                </p>
                <p className='mt-2 text-4xl font-semibold'>
                  {averageRating.toFixed(1)}
                </p>
              </div>
              <p className='text-sm leading-6 text-slate-300'>
                Add movies from search and the browse page will keep your recent
                watchlist context visible on the right.
              </p>
            </CardContent>
          </Card>

          <Card className='border-white/10 bg-slate-950/85 text-white'>
            <CardContent className='space-y-4 p-5'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold'>Personal picks</h2>
                <Badge variant='secondary'>{recommendations.length}</Badge>
              </div>
              {recommendationsLoading ? (
                <p className='text-sm text-slate-300'>
                  Loading recommendations...
                </p>
              ) : recommendations.length === 0 ? (
                <p className='rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300'>
                  Search and save a few titles first to unlock TMDB-powered
                  recommendations.
                </p>
              ) : (
                <div className='space-y-3'>
                  {recommendations.slice(0, 4).map((movie) => (
                    <div
                      key={movie.id}
                      className='flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3'
                    >
                      <div className='h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-900'>
                        {movie.posterPath ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`https://image.tmdb.org/t/p/w154${movie.posterPath}`}
                            alt={movie.title}
                            className='h-full w-full object-cover'
                          />
                        ) : null}
                      </div>
                      <div className='min-w-0'>
                        <p className='truncate font-medium text-white'>
                          {movie.title}
                        </p>
                        <p className='text-xs text-slate-400'>
                          {movie.releaseDate || 'Unknown release'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
