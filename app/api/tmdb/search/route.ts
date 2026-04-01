import { NextRequest, NextResponse } from 'next/server';

type TmdbMovie = {
  id: number;
  title: string;
  release_date?: string;
  vote_average?: number;
  poster_path?: string | null;
  overview?: string;
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim();
  const tmdbApiKey = process.env.TMDB_API_KEY;

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  if (!tmdbApiKey) {
    return NextResponse.json(
      { error: 'TMDB_API_KEY is not configured.' },
      { status: 500 },
    );
  }

  const url = new URL('https://api.themoviedb.org/3/search/movie');
  url.searchParams.set('api_key', tmdbApiKey);
  url.searchParams.set('query', query);
  url.searchParams.set('include_adult', 'false');
  url.searchParams.set('language', 'en-US');
  url.searchParams.set('page', '1');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch data from TMDB.' },
      { status: response.status },
    );
  }

  const data = (await response.json()) as { results?: TmdbMovie[] };

  const results = (data.results ?? []).slice(0, 10).map((movie) => ({
    id: movie.id,
    title: movie.title,
    releaseDate: movie.release_date ?? '',
    rating: movie.vote_average ?? 0,
    posterPath: movie.poster_path ?? null,
    overview: movie.overview ?? '',
  }));

  return NextResponse.json({ results });
}
