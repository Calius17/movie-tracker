import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type TmdbGenre = {
  id: number;
  name: string;
};

type TmdbMovieDetails = {
  id: number;
  title: string;
  release_date?: string;
  vote_average?: number;
  backdrop_path?: string | null;
  poster_path?: string | null;
  overview?: string;
  runtime?: number;
  genres?: TmdbGenre[];
  tagline?: string;
};

function getTmdbAuth() {
  const apiKey =
    process.env.TMDB_API_KEY ?? process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const bearerToken =
    process.env.TMDB_BEARER_TOKEN ?? process.env.TMDB_API_READ_ACCESS_TOKEN;

  return { apiKey, bearerToken };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const movieId = Number(id);
  if (!Number.isFinite(movieId)) {
    return NextResponse.json({ error: 'Invalid movie id.' }, { status: 400 });
  }

  const { apiKey, bearerToken } = getTmdbAuth();
  if (!apiKey && !bearerToken) {
    return NextResponse.json(
      {
        error:
          'TMDB credentials are missing. Set TMDB_API_KEY or TMDB_BEARER_TOKEN.',
      },
      { status: 500 },
    );
  }

  const url = new URL(`https://api.themoviedb.org/3/movie/${movieId}`);
  if (apiKey) {
    url.searchParams.set('api_key', apiKey);
  }
  url.searchParams.set('language', 'en-US');

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
      { error: tmdbError?.status_message ?? 'Failed to fetch movie details.' },
      { status: response.status },
    );
  }

  const movie = (await response.json()) as TmdbMovieDetails;
  return NextResponse.json({
    id: movie.id,
    title: movie.title,
    releaseDate: movie.release_date ?? '',
    rating: movie.vote_average ?? 0,
    backdropPath: movie.backdrop_path ?? null,
    posterPath: movie.poster_path ?? null,
    overview: movie.overview ?? '',
    runtime: movie.runtime ?? 0,
    genres: movie.genres ?? [],
    tagline: movie.tagline ?? '',
  });
}
