import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Play, Star } from 'lucide-react';

import type { TmdbMovie } from '@/lib/tmdb-server';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

type MovieRailItem = TmdbMovie & {
  releaseDate?: string;
  rating?: number;
  posterPath?: string | null;
  backdropPath?: string | null;
};

const tmdbImage = (path: string | null, size: string) =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

function yearFromDate(date: string) {
  return date ? new Date(date).getFullYear().toString() : 'TBA';
}

function voteAverageLabel(voteAverage?: number | null) {
  return typeof voteAverage === 'number' ? voteAverage.toFixed(1) : 'N/A';
}

type MovieRailProps = {
  title?: string;
  subtitle?: string;
  movies: MovieRailItem[];
  href?: string;
};

function resolveMovieImage(movie: MovieRailItem) {
  return (
    tmdbImage(movie.backdrop_path ?? movie.backdropPath ?? null, 'w780') ??
    tmdbImage(movie.poster_path ?? movie.posterPath ?? null, 'w342')
  );
}

function resolveMovieVote(movie: MovieRailItem) {
  return voteAverageLabel(movie.vote_average ?? movie.rating ?? null);
}

function resolveMovieYear(movie: MovieRailItem) {
  return yearFromDate(movie.release_date ?? movie.releaseDate ?? '');
}

export function MovieRail({ title, subtitle, movies, href }: MovieRailProps) {
  return (
    <section className='space-y-4'>
      {title || subtitle || href ? (
        <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4'>
          <div>
            {title ? (
              <h2 className='text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl'>
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className='mt-1 max-w-2xl text-sm leading-6 text-slate-400'>
                {subtitle}
              </p>
            ) : null}
          </div>
          {href ? (
            <Link
              href={href}
              className='inline-flex items-center gap-2 text-sm text-sky-300 transition hover:text-sky-200'
            >
              View more
              <ChevronRight className='h-4 w-4' />
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className='pb-1'>
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {movies.map((movie) => {
            const artwork = resolveMovieImage(movie);
            return (
              <Card
                key={movie.id}
                className='group overflow-hidden border-white/10 bg-white/5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:bg-white/10'
              >
                <Link href={`/movie/${movie.id}`} className='block'>
                  <div className='relative aspect-[2/3] overflow-hidden bg-slate-900'>
                    {artwork ? (
                      <Image
                        src={artwork}
                        alt={movie.title}
                        fill
                        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                        unoptimized
                        className='object-cover transition duration-500 group-hover:scale-105'
                      />
                    ) : (
                      <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950' />
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-transparent' />
                    <div className='absolute inset-x-0 bottom-0 space-y-2 p-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]'>
                      <div className='flex items-center gap-2'>
                        <Badge className='rounded-full border border-white/10 bg-black/65 text-white shadow-sm backdrop-blur'>
                          <Star className='mr-1 h-3.5 w-3.5 fill-current' />
                          {resolveMovieVote(movie)}
                        </Badge>
                        <span className='rounded-full bg-black/45 px-2 py-1 text-xs text-white/90 backdrop-blur'>
                          {resolveMovieYear(movie)}
                        </span>
                      </div>
                      <h3 className='line-clamp-2 text-base font-semibold leading-snug'>
                        {movie.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SpotlightHero({ movie }: { movie: TmdbMovie | null }) {
  const backdrop = tmdbImage(movie?.backdrop_path ?? null, 'w1280');
  const poster = tmdbImage(movie?.poster_path ?? null, 'w500');
  const artwork = backdrop ?? poster;

  return (
    <Card className='overflow-hidden border-white/10 bg-slate-950 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]'>
      <div className='relative min-h-[440px] overflow-hidden sm:min-h-[500px] xl:min-h-[560px]'>
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(2,6,23,0.98) 0%, rgba(2,6,23,0.84) 30%, rgba(2,6,23,0.5) 60%, rgba(2,6,23,0.92) 100%), url(${backdrop ?? poster ?? ''})`,
          }}
        />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(217,70,239,0.16),transparent_28%)]' />
        <div className='relative grid min-h-[440px] gap-6 p-4 sm:min-h-[500px] sm:p-8 xl:grid-cols-[1.2fr,0.8fr] xl:p-10'>
          <div className='flex flex-col justify-end space-y-5 xl:pr-8'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge className='rounded-full bg-white/10 text-white'>
                Trending spotlight
              </Badge>
              <Badge className='rounded-full bg-white/10 text-white'>
                Curated banner art
              </Badge>
            </div>
            <div className='space-y-4'>
              <p className='text-xs uppercase tracking-[0.3em] text-sky-300'>
                Movie Orbit
              </p>
              <h1 className='max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl xl:text-6xl'>
                {movie?.title ?? 'Discover the next movie worth tracking.'}
              </h1>
              <p className='max-w-2xl text-sm leading-7 text-slate-300 sm:text-base'>
                {movie?.overview ??
                  'Spotlight titles, trending recommendations, and a cleaner browsing experience with actual movie banner imagery.'}
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              <Link
                href='/browse'
                className='inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-6 text-sm font-medium text-white shadow-lg shadow-sky-500/30 transition hover:opacity-95'
              >
                Browse TMDB
                <ChevronRight className='h-4 w-4' />
              </Link>
              <Link
                href='/watchlist'
                className='inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-medium text-white transition hover:bg-white/10'
              >
                <Play className='h-4 w-4' />
                Open watchlist
              </Link>
            </div>
            <div className='flex flex-wrap gap-2 text-xs text-slate-300'>
              <span className='rounded-full border border-white/15 bg-white/5 px-3 py-1'>
                {movie?.release_date ? yearFromDate(movie.release_date) : 'TBA'}
              </span>
              <span className='rounded-full border border-white/15 bg-white/5 px-3 py-1'>
                TMDB powered
              </span>
              <span className='rounded-full border border-white/15 bg-white/5 px-3 py-1'>
                Responsive media UI
              </span>
            </div>
          </div>

          <div className='flex items-end justify-center xl:justify-end'>
            <div className='w-full max-w-[260px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20 shadow-2xl backdrop-blur-md sm:max-w-sm'>
              <div className='relative aspect-[2/3] overflow-hidden bg-slate-900'>
                {artwork ? (
                  <Image
                    src={artwork}
                    alt={movie?.title ?? 'Featured recommendation'}
                    fill
                    sizes='260px'
                    unoptimized
                    className='object-cover'
                  />
                ) : (
                  <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950' />
                )}
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent' />
              </div>
              <div className='space-y-3 p-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]'>
                <div className='flex items-center justify-between text-sm text-white/85'>
                  <span>Featured recommendation</span>
                  <span className='inline-flex items-center gap-1 text-amber-200'>
                    <Star className='h-4 w-4 fill-current' />
                    {voteAverageLabel(movie?.vote_average)}
                  </span>
                </div>
                <p className='text-lg font-semibold'>
                  {movie?.title ?? 'Spotlight title'}
                </p>
                <p className='line-clamp-3 text-sm leading-6 text-slate-300'>
                  {movie?.overview ??
                    'This area will showcase the current trending movie with banner art and quick context.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
