'use client';

import { useEffect, useState } from 'react';
import { Loader2, Search, Star } from 'lucide-react';

type MovieResult = {
  id: number;
  title: string;
  releaseDate: string;
  rating: number;
  posterPath: string | null;
  overview: string;
};

export function TmdbSearch() {
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

    const timer = setTimeout(async () => {
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
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <section className='w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
      <div className='relative'>
        <Search className='pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500' />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='Search movies by title (real-time TMDB)...'
          className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none ring-0 transition focus:border-sky-500 focus:bg-white'
        />
      </div>

      <div className='mt-4 min-h-10'>
        {isLoading && (
          <p className='flex items-center gap-2 text-sm text-slate-600'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Searching TMDB...
          </p>
        )}

        {error && <p className='text-sm text-rose-600'>{error}</p>}

        {!isLoading && !error && query.trim() && results.length === 0 && (
          <p className='text-sm text-slate-600'>No matches found.</p>
        )}

        <ul className='mt-2 grid gap-3 sm:grid-cols-2'>
          {results.map((movie) => (
            <li
              key={movie.id}
              className='flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3'
            >
              <div className='h-20 w-14 shrink-0 overflow-hidden rounded-md bg-slate-200'>
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
                <p className='truncate font-medium text-slate-900'>
                  {movie.title}
                </p>
                <p className='text-xs text-slate-500'>
                  {movie.releaseDate || 'Unknown release date'}
                </p>
                <p className='mt-1 flex items-center gap-1 text-xs text-amber-700'>
                  <Star className='h-3.5 w-3.5 fill-current' />
                  {movie.rating.toFixed(1)} / 10
                </p>
                {movie.overview ? (
                  <p className='mt-1 line-clamp-2 text-xs text-slate-600'>
                    {movie.overview}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
