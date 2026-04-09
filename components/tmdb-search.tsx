'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Loader2, Search, Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <Card className='overflow-hidden border-white/10 bg-slate-950/85 text-white shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl'>
      <CardHeader className='gap-4 border-b border-white/10 bg-[linear-gradient(180deg,rgba(34,211,238,0.10),rgba(2,6,23,0))]'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <Badge variant='accent' className='mb-3'>
              Live TMDB
            </Badge>
            <CardTitle className='text-2xl'>
              Search, track, and save movies
            </CardTitle>
            <CardDescription className='mt-1 max-w-2xl text-sm text-slate-300'>
              Search directly against TMDB, then add titles to your watchlist
              with one click.
            </CardDescription>
          </div>
          <div className='hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 md:flex'>
            <Star className='h-4 w-4 fill-amber-400 text-amber-400' />
            Real-time discovery
          </div>
        </div>

        <div className='relative'>
          <Search className='pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400' />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search movies by title or franchise'
            className='h-12 rounded-2xl border-white/10 bg-white/5 pl-10 text-sm text-white placeholder:text-slate-400'
          />
        </div>
      </CardHeader>

      <CardContent className='p-5 sm:p-6'>
        <div className='mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-400'>
          <span>Try:</span>
          {['Dune', 'Oppenheimer', 'Spider-Man', 'Interstellar'].map((item) => (
            <button
              key={item}
              type='button'
              onClick={() => setQuery(item)}
              className='rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-500/10 hover:text-white'
            >
              {item}
            </button>
          ))}
        </div>

        {isLoading && (
          <p className='flex items-center gap-2 text-sm text-slate-300'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Searching TMDB...
          </p>
        )}

        {error && <p className='text-sm text-rose-300'>{error}</p>}

        {!isLoading && !error && query.trim() && results.length === 0 && (
          <div className='rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-300'>
            No matches found. Try a different title or a more specific search.
          </div>
        )}

        {results.length > 0 && (
          <ul className='mt-2 grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {results.map((movie) => (
              <li
                key={movie.id}
                className='group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/10'
              >
                <Link href={`/movie/${movie.id}`} className='block'>
                  <div className='relative aspect-[3/4] overflow-hidden bg-slate-900'>
                    {movie.posterPath ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                        alt={movie.title}
                        className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                      />
                    ) : (
                      <div className='flex h-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-700 to-sky-600 text-sm font-medium text-white'>
                        No poster
                      </div>
                    )}
                    <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/55 to-transparent p-4 text-white'>
                      <p className='text-xs uppercase tracking-[0.2em] text-sky-100'>
                        TMDB result
                      </p>
                      <h3 className='mt-1 line-clamp-2 text-lg font-semibold'>
                        {movie.title}
                      </h3>
                    </div>
                  </div>
                </Link>
                <div className='space-y-4 p-4'>
                  <div className='flex items-center justify-between gap-3 text-xs text-slate-300'>
                    <span>{movie.releaseDate || 'Unknown release date'}</span>
                    <span className='inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-amber-200'>
                      <Star className='h-3.5 w-3.5 fill-current' />
                      {movie.rating.toFixed(1)} / 10
                    </span>
                  </div>
                  <p className='line-clamp-3 text-sm leading-6 text-slate-300'>
                    {movie.overview || 'No overview available for this title.'}
                  </p>
                  <Button
                    type='button'
                    variant='accent'
                    className='w-full'
                    onClick={() => onAddMovie?.(movie)}
                  >
                    Track this movie
                    <ArrowRight className='h-4 w-4' />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
