export type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
};

export type TmdbCollection = {
  title: string;
  href: string;
  movies: TmdbMovie[];
};

type TmdbResponse = {
  results?: TmdbMovie[];
};

function getTmdbCredentials() {
  const apiKey =
    process.env.TMDB_API_KEY ?? process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const bearerToken =
    process.env.TMDB_BEARER_TOKEN ?? process.env.TMDB_API_READ_ACCESS_TOKEN;

  return { apiKey, bearerToken };
}

async function fetchTmdb(
  path: string,
  searchParams: Record<string, string> = {},
) {
  const { apiKey, bearerToken } = getTmdbCredentials();

  if (!apiKey && !bearerToken) {
    return [] as TmdbMovie[];
  }

  const url = new URL(`https://api.themoviedb.org/3/${path}`);
  if (apiKey) {
    url.searchParams.set('api_key', apiKey);
  }

  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return [] as TmdbMovie[];
  }

  const payload = (await response.json()) as TmdbResponse;
  return (payload.results ?? []).filter((movie) => movie.title);
}

export async function getHomeCollections() {
  const [trending, nowPlaying, topRated, upcoming, popular] = await Promise.all(
    [
      fetchTmdb('trending/movie/week'),
      fetchTmdb('movie/now_playing', { language: 'en-US', page: '1' }),
      fetchTmdb('movie/top_rated', { language: 'en-US', page: '1' }),
      fetchTmdb('movie/upcoming', { language: 'en-US', page: '1' }),
      fetchTmdb('movie/popular', { language: 'en-US', page: '1' }),
    ],
  );

  return {
    spotlight:
      trending[0] ??
      nowPlaying[0] ??
      topRated[0] ??
      upcoming[0] ??
      popular[0] ??
      null,
    trending: trending.length ? trending.slice(0, 12) : popular.slice(0, 12),
    nowPlaying: nowPlaying.length
      ? nowPlaying.slice(0, 12)
      : popular.slice(0, 12),
    topRated: topRated.length ? topRated.slice(0, 12) : popular.slice(0, 12),
    upcoming: upcoming.length ? upcoming.slice(0, 12) : popular.slice(0, 12),
    recommended: popular.length ? popular.slice(0, 10) : topRated.slice(0, 10),
  };
}
