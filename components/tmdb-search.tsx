'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Loader2, Search, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type MovieResult = {
  id: number;
  title: string;
  releaseDate: string;
  rating: number;
  posterPath: string | null;
  overview: string;
};

type TmdbSearchProps = {
  onAddMovie?: (movie: MovieResult) => void;
};

export function TmdbSearch({ onAddMovie }: TmdbSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/tmdb/search?q=${encodeURIComponent(query.trim())}`,
        );

        const payload = (await response.json()) as {
          results?: MovieResult[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? 'Search failed.');
        }

        setResults(payload.results ?? []);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Unexpected search error.';
        setError(message);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <section className='space-y-6'>
      <div className='mx-auto w-full max-w-3xl'>
        <div className='relative rounded-full border border-white/12 bg-white/[0.06] p-2 shadow-[0_10px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl'>
          <Search className='pointer-events-none absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search by title, universe, or director'
            className='h-12 rounded-full border-transparent bg-transparent pl-11 pr-4 text-sm text-white placeholder:text-slate-400 focus-visible:border-cyan-300/40 focus-visible:ring-cyan-300/20'
          />
        </div>

        <div className='mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500'>
          <span>Try</span>
          {['Dune', 'Severance', 'Oppenheimer', 'Interstellar'].map((item) => (
            <button
              key={item}
              type='button'
              onClick={() => setQuery(item)}
              className='rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300 transition hover:border-cyan-300/40 hover:text-white'
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className='flex items-center gap-2 text-sm text-slate-300'>
          <Loader2 className='h-4 w-4 animate-spin' />
          Searching TMDB...
        </p>
      ) : null}

      {error ? <p className='text-sm text-rose-300'>{error}</p> : null}

      {!isLoading && !error && query.trim() && results.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-5 py-6 text-sm text-slate-400'>
          No matches found. Try a more specific title.
        </div>
      ) : null}

      {results.length > 0 ? (
        <ul className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {results.map((movie) => (
            <li
              key={movie.id}
              className='group overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[0.03] transition hover:border-cyan-400/35 hover:bg-white/[0.05]'
            >
              <Link href={`/movie/${movie.id}`} className='block'>
                <div className='relative aspect-[4/5] overflow-hidden bg-slate-900'>
                  {movie.posterPath ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                      alt={movie.title}
                      className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                    />
                  ) : (
                    <div className='flex h-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800 text-sm text-slate-200'>
                      No poster
                    </div>
                  )}
                  <div className='absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent' />
                </div>
              </Link>

              <div className='space-y-3 p-4'>
                <div className='flex items-start justify-between gap-3'>
                  <h3 className='line-clamp-2 text-base font-medium text-white'>
                    {movie.title}
                  </h3>
                  <span className='inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-amber-200'>
                    <Star className='h-3.5 w-3.5 fill-current' />
                    {movie.rating.toFixed(1)}
                  </span>
                </div>
                <p className='text-xs text-slate-400'>
                  {movie.releaseDate || 'Unknown release date'}
                </p>
                <p className='line-clamp-3 text-sm leading-6 text-slate-300'>
                  {movie.overview || 'No overview available for this title.'}
                </p>
                <Button
                  type='button'
                  variant='accent'
                  className='px-4'
                  onClick={() => onAddMovie?.(movie)}
                >
                  Track
                  <ArrowRight className='h-4 w-4' />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
