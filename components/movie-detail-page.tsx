'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Clock3,
  Eye,
  Heart,
  Loader2,
  Play,
  Plus,
  Star,
  Trash2,
} from 'lucide-react';

import { MovieRail } from '@/components/movie-gallery';
import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { TmdbMovie } from '@/lib/tmdb-server';

type MovieDetail = TmdbMovie & {
  releaseDate: string;
  rating: number;
  posterPath: string | null;
  backdropPath: string | null;
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
};

const formatRuntime = (runtime: number) => {
  if (!runtime) {
    return 'Runtime unknown';
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
};

const formatYear = (date: string) =>
  date ? new Date(date).getFullYear() : 'TBA';

const formatVoteAverage = (voteAverage?: number | null) =>
  typeof voteAverage === 'number' ? voteAverage.toFixed(1) : 'N/A';

export function MovieDetailPage({ movieId }: { movieId: number }) {
  const {
    state,
    addMovieToWatchlist,
    updateWatchlistItem,
    removeWatchlistItem,
  } = useMovieOrbitState();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [related, setRelated] = useState<TmdbMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const watchlistItem = useMemo(
    () => state.watchlist.find((item) => item.id === movieId) ?? null,
    [movieId, state.watchlist],
  );

  useEffect(() => {
    let ignore = false;

    async function loadMovie() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/tmdb/movie/${movieId}`);
        const payload = (await response.json()) as Partial<MovieDetail> & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? 'Unable to load movie details.');
        }

        if (!ignore) {
          setMovie(payload as MovieDetail);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unexpected error.',
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMovie();

    return () => {
      ignore = true;
    };
  }, [movieId]);

  useEffect(() => {
    let ignore = false;

    async function loadRelated() {
      if (!movie?.genres?.length) {
        setRelated([]);
        return;
      }

      try {
        setRelatedLoading(true);
        const genreIds = movie.genres
          .slice(0, 3)
          .map((genre) => genre.id)
          .join(',');
        const response = await fetch(`/api/tmdb/discover?genres=${genreIds}`);
        const payload = (await response.json()) as {
          results?: TmdbMovie[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? 'Unable to load related movies.');
        }

        if (!ignore) {
          setRelated(
            (payload.results ?? []).filter((item) => item.id !== movie.id),
          );
        }
      } catch {
        if (!ignore) {
          setRelated([]);
        }
      } finally {
        if (!ignore) {
          setRelatedLoading(false);
        }
      }
    }

    loadRelated();

    return () => {
      ignore = true;
    };
  }, [movie]);

  const openInWatchlist = Boolean(watchlistItem);
  const posterImage = movie?.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : null;
  const backdropImage = movie?.backdropPath
    ? `https://image.tmdb.org/t/p/w1280${movie.backdropPath}`
    : posterImage;

  if (loading) {
    return (
      <main className='mx-auto flex w-full max-w-none flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-10 2xl:px-14'>
        <div className='flex items-center gap-3 text-slate-300'>
          <Loader2 className='h-5 w-5 animate-spin' />
          Loading movie details...
        </div>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className='mx-auto flex w-full max-w-none flex-1 px-4 py-16 sm:px-6 lg:px-10 2xl:px-14'>
        <Card className='border-white/10 bg-white/5 text-white'>
          <CardContent className='space-y-4 p-6'>
            <p className='text-lg font-semibold'>Movie details unavailable</p>
            <p className='text-sm text-slate-300'>
              {error ?? 'No data found for this movie.'}
            </p>
            <Link
              href='/'
              className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10'
            >
              <ArrowLeft className='h-4 w-4' />
              Back home
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className='mx-auto flex w-full max-w-none flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-10 2xl:px-14'>
      <section className='relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 text-white shadow-[0_28px_90px_rgba(0,0,0,0.35)]'>
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(2,6,23,0.98) 0%, rgba(2,6,23,0.78) 36%, rgba(2,6,23,0.52) 60%, rgba(2,6,23,0.92) 100%), url(${backdropImage ?? ''})`,
          }}
        />
        <div className='relative grid gap-6 p-5 sm:p-8 xl:grid-cols-[minmax(0,1.1fr),minmax(300px,0.9fr)] xl:p-10'>
          <div className='space-y-5'>
            <Link
              href='/'
              className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10'
            >
              <ArrowLeft className='h-4 w-4' />
              Back to home
            </Link>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge className='rounded-full bg-white/10 text-white'>
                Movie detail
              </Badge>
              <Badge className='rounded-full bg-white/10 text-white'>
                Rate and track
              </Badge>
              <Badge className='rounded-full bg-white/10 text-white'>
                TMDB
              </Badge>
            </div>
            <div className='space-y-3'>
              <h1 className='max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl xl:text-6xl'>
                {movie.title}
              </h1>
              <p className='max-w-2xl text-sm leading-7 text-slate-300 sm:text-base'>
                {movie.tagline || movie.overview}
              </p>
            </div>
            <div className='flex flex-wrap gap-2 text-xs text-slate-300'>
              <span className='rounded-full border border-white/15 bg-white/5 px-3 py-1'>
                {formatYear(movie.releaseDate)}
              </span>
              <span className='rounded-full border border-white/15 bg-white/5 px-3 py-1 inline-flex items-center gap-1'>
                <Clock3 className='h-3.5 w-3.5' />
                {formatRuntime(movie.runtime)}
              </span>
              <span className='rounded-full border border-white/15 bg-white/5 px-3 py-1 inline-flex items-center gap-1'>
                <Star className='h-3.5 w-3.5 fill-current text-amber-300' />
                {formatVoteAverage(movie.rating)} / 10
              </span>
            </div>
            <div className='flex flex-wrap gap-3'>
              <Button
                type='button'
                variant='accent'
                onClick={() => addMovieToWatchlist(movie)}
              >
                {openInWatchlist ? (
                  <>
                    <Heart className='h-4 w-4' />
                    Already tracked
                  </>
                ) : (
                  <>
                    <Plus className='h-4 w-4' />
                    Add to watchlist
                  </>
                )}
              </Button>
              <Button
                type='button'
                variant='outline'
                className='border-white/20 bg-white/5 text-white hover:bg-white/10'
                onClick={() =>
                  window.open(
                    `https://www.themoviedb.org/movie/${movie.id}`,
                    '_blank',
                  )
                }
              >
                <Play className='h-4 w-4' />
                Open on TMDB
              </Button>
            </div>
          </div>

          <div className='flex items-end justify-center xl:justify-end'>
            <div className='w-full max-w-[320px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20 shadow-2xl backdrop-blur-md sm:max-w-sm'>
              <div
                className='aspect-[2/3] bg-cover bg-center'
                style={{
                  backgroundImage: `url(${posterImage ?? backdropImage ?? ''})`,
                }}
              />
              <div className='space-y-3 p-4'>
                <p className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                  Poster
                </p>
                <p className='text-lg font-semibold'>{movie.title}</p>
                <p className='text-sm leading-6 text-slate-300'>
                  {movie.overview}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='grid gap-6 xl:grid-cols-[minmax(0,0.9fr),minmax(0,1.1fr)]'>
        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-5'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>Your tracking</h2>
              <Badge variant={openInWatchlist ? 'success' : 'secondary'}>
                {openInWatchlist ? 'In watchlist' : 'Not tracked'}
              </Badge>
            </div>

            {watchlistItem ? (
              <div className='space-y-3'>
                <Select
                  value={watchlistItem.status}
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
                  value={watchlistItem.ratingDraft}
                  onChange={(event) =>
                    updateWatchlistItem(movie.id, {
                      ratingDraft: Number(event.target.value),
                    })
                  }
                />
                <Textarea
                  value={watchlistItem.review}
                  onChange={(event) =>
                    updateWatchlistItem(movie.id, {
                      review: event.target.value,
                    })
                  }
                  placeholder='Write a review, note, or spoiler-free impression.'
                />
                <div className='flex flex-wrap gap-2'>
                  <Button
                    type='button'
                    variant='secondary'
                    onClick={() =>
                      updateWatchlistItem(movie.id, { status: 'watched' })
                    }
                  >
                    <Eye className='h-4 w-4' />
                    Mark watched
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => removeWatchlistItem(movie.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className='space-y-3 rounded-3xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-slate-300'>
                <p>
                  Add this movie to start rating, reviewing, and tracking it
                  across your watchlist.
                </p>
                <Button
                  type='button'
                  onClick={() => addMovieToWatchlist(movie)}
                >
                  <Plus className='h-4 w-4' />
                  Add to watchlist
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-5'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>Details</h2>
              <Badge variant='secondary'>{movie.genres.length} genres</Badge>
            </div>
            <div className='flex flex-wrap gap-2'>
              {movie.genres.map((genre) => (
                <Badge key={genre.id} variant='accent' className='rounded-full'>
                  {genre.name}
                </Badge>
              ))}
            </div>
            <div className='grid gap-3 sm:grid-cols-2'>
              <div className='rounded-2xl bg-white/5 p-4'>
                <p className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                  Runtime
                </p>
                <p className='mt-2 text-2xl font-semibold'>
                  {formatRuntime(movie.runtime)}
                </p>
              </div>
              <div className='rounded-2xl bg-white/5 p-4'>
                <p className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                  Release
                </p>
                <p className='mt-2 text-2xl font-semibold'>
                  {formatYear(movie.releaseDate)}
                </p>
              </div>
            </div>
            <p className='text-sm leading-7 text-slate-300'>{movie.overview}</p>
          </CardContent>
        </Card>
      </section>

      <section className='space-y-4'>
        <div className='flex items-end justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-semibold tracking-tight text-white sm:text-3xl'>
              Related picks
            </h2>
            <p className='mt-1 text-sm text-slate-400'>
              More movies from the same genres.
            </p>
          </div>
          <Badge variant='secondary'>{related.length}</Badge>
        </div>
        {relatedLoading ? (
          <div className='rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300'>
            Loading related picks...
          </div>
        ) : related.length === 0 ? (
          <div className='rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-300'>
            No related titles found yet.
          </div>
        ) : (
          <MovieRail movies={related.slice(0, 8)} />
        )}
      </section>
    </main>
  );
}
