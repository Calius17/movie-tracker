'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';

import { PageShell } from '@/components/page-shell';
import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

function formatRuntime(runtime: number) {
  if (!runtime) return 'Runtime unknown';
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}

export default function WatchlistPage() {
  const {
    state,
    updateWatchlistItem,
    removeWatchlistItem,
    flagReview,
    watchedCount,
    watchingCount,
    planCount,
    averageRating,
  } = useMovieOrbitState();

  if (!state.isAuthenticated) {
    return (
      <PageShell
        eyebrow='Watchlist'
        title='Sign in to keep your watchlist synced.'
        description='Your tracked movies, ratings, and reviews live behind your account instead of exposed as a public toggle.'
      >
        <div className='grid gap-4 lg:grid-cols-[0.95fr,1.05fr]'>
          <Card className='border-white/10 bg-slate-950/85 text-white'>
            <CardContent className='space-y-3 p-5 sm:p-6'>
              <p className='text-sm leading-6 text-slate-300'>
                Sign in or create an account to save watchlist items and keep
                your viewing progress across sessions.
              </p>
              <div className='flex flex-wrap gap-3'>
                <Link
                  href='/login'
                  className='inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white transition hover:bg-white/10'
                >
                  Log in
                </Link>
                <Link
                  href='/signup'
                  className='inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-medium text-slate-950 transition hover:bg-slate-100'
                >
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className='border-white/10 bg-slate-950/85 text-white'>
            <CardContent className='space-y-3 p-5 sm:p-6'>
              <p className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                Clean sync
              </p>
              <p className='text-sm leading-6 text-slate-300'>
                Your watch history, ratings, and notes stay private and synced
                to your profile.
              </p>
              <p className='text-sm text-slate-400'>
                No oversized panels, no clutter, just a focused account flow.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow='Watchlist'
      title='Your tracked movies, in a clean card layout.'
      description='Update statuses, ratings, and reviews without cramming everything into a single endless dashboard.'
    >
      <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr),280px]'>
        <section className='space-y-4'>
          <div className='grid gap-3 sm:grid-cols-3'>
            {[
              { label: 'Watched', value: watchedCount },
              { label: 'Watching', value: watchingCount },
              { label: 'Plan to watch', value: planCount },
            ].map((item) => (
              <Card
                key={item.label}
                className='border-white/10 bg-slate-950/85 text-white'
              >
                <CardContent className='p-4'>
                  <p className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                    {item.label}
                  </p>
                  <p className='mt-2 text-3xl font-semibold'>{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {state.watchlist.length === 0 ? (
            <Card className='border-white/10 bg-slate-950/85 text-white'>
              <CardContent className='p-6 text-sm text-slate-300'>
                Your watchlist is empty. Go to Browse and save a movie to start
                tracking.
              </CardContent>
            </Card>
          ) : (
            <div className='grid gap-4 md:grid-cols-2 2xl:grid-cols-3'>
              {state.watchlist.map((movie) => (
                <Card
                  key={movie.id}
                  className='overflow-hidden border-white/10 bg-slate-950/85 text-white'
                >
                  <div className='aspect-[16/10] bg-slate-900'>
                    {movie.posterPath ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                        alt={movie.title}
                        className='h-full w-full object-cover'
                      />
                    ) : null}
                  </div>
                  <CardContent className='space-y-4 p-4'>
                    <div>
                      <h2 className='text-lg font-semibold leading-tight'>
                        {movie.title}
                      </h2>
                      <p className='text-xs text-slate-400'>
                        {movie.releaseDate || 'Unknown release date'} ·{' '}
                        {formatRuntime(movie.runtime)}
                      </p>
                    </div>
                    <Badge variant='accent'>
                      {movie.status.replaceAll('_', ' ')}
                    </Badge>
                    <div className='space-y-3'>
                      <Select
                        value={movie.status}
                        onChange={(event) =>
                          updateWatchlistItem(movie.id, {
                            status: event.target.value as
                              | 'watched'
                              | 'watching'
                              | 'plan_to_watch',
                          })
                        }
                      >
                        <option value='plan_to_watch'>Plan to watch</option>
                        <option value='watching'>Watching</option>
                        <option value='watched'>Watched</option>
                      </Select>
                      <Input
                        type='number'
                        min='0'
                        max='10'
                        step='0.5'
                        value={movie.ratingDraft}
                        onChange={(event) =>
                          updateWatchlistItem(movie.id, {
                            ratingDraft: Number(event.target.value),
                          })
                        }
                      />
                      <Textarea
                        value={movie.review}
                        onChange={(event) =>
                          updateWatchlistItem(movie.id, {
                            review: event.target.value,
                          })
                        }
                        placeholder='Write a quick review or reminder.'
                      />
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {state.role === 'user' ? (
                        <Link
                          href={`/party?movieId=${movie.id}`}
                          className='inline-flex h-10 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-500/10 px-4 text-sm text-cyan-100 transition hover:bg-cyan-500/15'
                        >
                          Start party
                        </Link>
                      ) : null}
                      <Button
                        type='button'
                        variant='secondary'
                        onClick={() => flagReview(movie)}
                      >
                        Flag review
                      </Button>
                      <Button
                        type='button'
                        variant='ghost'
                        onClick={() => removeWatchlistItem(movie.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <aside className='space-y-4'>
          <Card className='overflow-hidden border-slate-950/10 bg-slate-950 text-white'>
            <CardContent className='space-y-3 p-5'>
              <p className='text-xs uppercase tracking-[0.18em] text-white/60'>
                Rating average
              </p>
              <p className='text-4xl font-semibold'>
                {averageRating.toFixed(1)}
              </p>
              <p className='text-sm text-slate-300'>
                Use the cards on the left to keep your progress current.
              </p>
            </CardContent>
          </Card>

          <Card className='border-white/10 bg-slate-950/85 text-white'>
            <CardContent className='space-y-3 p-5 text-sm text-slate-300'>
              <p className='font-medium text-white'>Watchlist workflow</p>
              <p>1. Search a movie on Browse.</p>
              <p>2. Track it and move status as you watch.</p>
              <p>3. Add a review and flag it if needed.</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}
