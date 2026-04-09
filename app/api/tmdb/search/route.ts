import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
  const tmdbApiKey =
    process.env.TMDB_API_KEY ?? process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const tmdbBearerToken =
    process.env.TMDB_BEARER_TOKEN ?? process.env.TMDB_API_READ_ACCESS_TOKEN;

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  if (!tmdbApiKey && !tmdbBearerToken) {
    return NextResponse.json(
      {
        error:
          'TMDB credentials are missing. Set TMDB_API_KEY or TMDB_BEARER_TOKEN in .env.local and restart the dev server.',
      },
      { status: 500 },
    );
  }

  const url = new URL('https://api.themoviedb.org/3/search/movie');
  if (tmdbApiKey) {
    url.searchParams.set('api_key', tmdbApiKey);
  }
  url.searchParams.set('query', query);
  url.searchParams.set('include_adult', 'false');
  url.searchParams.set('language', 'en-US');
  url.searchParams.set('page', '1');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(tmdbBearerToken
        ? { Authorization: `Bearer ${tmdbBearerToken}` }
        : {}),
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const tmdbError = (await response.json().catch(() => null)) as {
      status_message?: string;
    } | null;

    return NextResponse.json(
      {
        error:
          tmdbError?.status_message ??
          'Failed to fetch data from TMDB. Verify your TMDB key/token.',
      },
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
