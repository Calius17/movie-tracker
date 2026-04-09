import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type TmdbDiscoverMovie = {
  id: number;
  title: string;
  release_date?: string;
  vote_average?: number;
  poster_path?: string | null;
  overview?: string;
};

function getTmdbAuth() {
  const apiKey =
    process.env.TMDB_API_KEY ?? process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const bearerToken =
    process.env.TMDB_BEARER_TOKEN ?? process.env.TMDB_API_READ_ACCESS_TOKEN;
  return { apiKey, bearerToken };
}

export async function GET(request: NextRequest) {
  const genreIds = request.nextUrl.searchParams.get('genres') ?? '';
  const withGenres = genreIds
    .split(',')
    .map((genreId) => genreId.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(',');

  const { apiKey, bearerToken } = getTmdbAuth();
  if (!apiKey && !bearerToken) {
    return NextResponse.json(
      { error: 'TMDB credentials are missing.' },
      { status: 500 },
    );
  }

  const url = new URL('https://api.themoviedb.org/3/discover/movie');
  if (apiKey) {
    url.searchParams.set('api_key', apiKey);
  }
  if (withGenres) {
    url.searchParams.set('with_genres', withGenres);
  }
  url.searchParams.set('sort_by', 'popularity.desc');
  url.searchParams.set('vote_count.gte', '200');
  url.searchParams.set('language', 'en-US');
  url.searchParams.set('page', '1');

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const tmdbError = (await response.json().catch(() => null)) as {
      status_message?: string;
    } | null;
    return NextResponse.json(
      {
        error: tmdbError?.status_message ?? 'Failed to fetch recommendations.',
      },
      { status: response.status },
    );
  }

  const data = (await response.json()) as { results?: TmdbDiscoverMovie[] };
  const results = (data.results ?? []).slice(0, 8).map((movie) => ({
    id: movie.id,
    title: movie.title,
    releaseDate: movie.release_date ?? '',
    rating: movie.vote_average ?? 0,
    posterPath: movie.poster_path ?? null,
    overview: movie.overview ?? '',
  }));

  return NextResponse.json({ results });
}
