'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Clapperboard,
  Film,
  Flag,
  Heart,
  Link2,
  Loader2,
  MessageSquareWarning,
  MoonStar,
  PencilLine,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Trash2,
} from 'lucide-react';

import { TmdbSearch, type MovieResult } from '@/components/tmdb-search';
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
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Role = 'normal' | 'premium' | 'provider' | 'admin';
type WatchStatus = 'watched' | 'watching' | 'plan_to_watch';
type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

type DetailedMovie = MovieResult & {
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
};

type WatchlistItem = DetailedMovie & {
  status: WatchStatus;
  ratingDraft: number;
  review: string;
  note: string;
  addedAt: number;
};

type ProviderLink = {
  id: string;
  movieName: string;
  platform: string;
  url: string;
  notes: string;
};

type ModerationTicket = {
  id: string;
  movieName: string;
  issue: string;
  status: TicketStatus;
  createdAt: number;
};

type DashboardState = {
  role: Role;
  watchlist: WatchlistItem[];
  providerLinks: ProviderLink[];
  tickets: ModerationTicket[];
};

const STORAGE_KEY = 'movie-orbit-dashboard-state';

const ROLE_COPY: Record<
  Role,
  {
    title: string;
    subtitle: string;
    gradient: string;
    badge: string;
  }
> = {
  normal: {
    title: 'Normal user mode',
    subtitle:
      'Search movies, track your watchlist, and get lightweight recommendations.',
    gradient: 'from-sky-500 via-cyan-500 to-teal-400',
    badge: 'Basic recommendations',
  },
  premium: {
    title: 'Premium mode',
    subtitle:
      'Unlock metadata-based recommendations and a cleaner, ad-free experience.',
    gradient: 'from-violet-600 via-fuchsia-500 to-sky-500',
    badge: 'Advanced recommendations',
  },
  provider: {
    title: 'Provider tools',
    subtitle:
      'Manage streaming availability links and keep movie access up to date.',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    badge: 'Availability links',
  },
  admin: {
    title: 'Admin control room',
    subtitle:
      'Moderate reviews, review tickets, and watch the platform statistics move.',
    gradient: 'from-rose-500 via-orange-500 to-amber-400',
    badge: 'Moderation and stats',
  },
};

const defaultState: DashboardState = {
  role: 'normal',
  watchlist: [],
  providerLinks: [],
  tickets: [],
};

function loadState(): DashboardState {
  if (typeof window === 'undefined') {
    return defaultState;
  }

  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY);
    if (!rawState) {
      return defaultState;
    }

    return { ...defaultState, ...(JSON.parse(rawState) as DashboardState) };
  } catch {
    return defaultState;
  }
}

function buildGenreIds(movies: WatchlistItem[]) {
  const counts = new Map<number, number>();

  movies.forEach((movie) => {
    movie.genres.forEach((genre) => {
      counts.set(
        genre.id,
        (counts.get(genre.id) ?? 0) +
          (movie.ratingDraft >= 7 || movie.status === 'watched' ? 2 : 1),
      );
    });
  });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([id]) => id)
    .slice(0, 3);
}

function formatRuntime(runtime: number) {
  if (!runtime) {
    return 'Runtime unknown';
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}

function uniqueKey(movieId: number) {
  return `movie-${movieId}`;
}

export function MovieDashboard() {
  const [state, setState] = useState<DashboardState>(defaultState);
  const [mounted, setMounted] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<MovieResult[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [providerDraft, setProviderDraft] = useState({
    movieName: '',
    platform: '',
    url: '',
    notes: '',
  });

  useEffect(() => {
    setState(loadState());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [mounted, state]);

  const favoriteGenres = useMemo(
    () => buildGenreIds(state.watchlist),
    [state.watchlist],
  );
  const watchedCount = state.watchlist.filter(
    (item) => item.status === 'watched',
  ).length;
  const watchingCount = state.watchlist.filter(
    (item) => item.status === 'watching',
  ).length;
  const planCount = state.watchlist.filter(
    (item) => item.status === 'plan_to_watch',
  ).length;
  const averageRating = useMemo(() => {
    if (!state.watchlist.length) {
      return 0;
    }

    const total = state.watchlist.reduce(
      (sum, movie) => sum + movie.ratingDraft,
      0,
    );
    return total / state.watchlist.length;
  }, [state.watchlist]);
  const openTickets = state.tickets.filter(
    (ticket) => ticket.status === 'open',
  ).length;
  const genreKey = useMemo(() => favoriteGenres.join(','), [favoriteGenres]);

  useEffect(() => {
    let ignore = false;

    async function loadRecommendations() {
      if (!genreKey) {
        setRecommendations([]);
        return;
      }

      try {
        setRecommendationsLoading(true);
        const response = await fetch(`/api/tmdb/discover?genres=${genreKey}`);
        const payload = (await response.json()) as {
          results?: MovieResult[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? 'Failed to load recommendations.');
        }

        if (!ignore) {
          setRecommendations(payload.results ?? []);
        }
      } catch {
        if (!ignore) {
          setRecommendations([]);
        }
      } finally {
        if (!ignore) {
          setRecommendationsLoading(false);
        }
      }
    }

    loadRecommendations();

    return () => {
      ignore = true;
    };
  }, [genreKey]);

  async function addMovieToWatchlist(movie: MovieResult) {
    const exists = state.watchlist.some((item) => item.id === movie.id);
    if (exists) {
      setNotification(`${movie.title} is already in your watchlist.`);
      return;
    }

    try {
      setNotification(`Loading details for ${movie.title}...`);
      const response = await fetch(`/api/tmdb/movie/${movie.id}`);
      const payload = (await response.json()) as Partial<DetailedMovie> & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? 'Could not load movie details.');
      }

      const detailedMovie: WatchlistItem = {
        id: movie.id,
        title: movie.title,
        releaseDate: movie.releaseDate,
        rating: movie.rating,
        posterPath: movie.posterPath,
        overview: movie.overview,
        runtime: payload.runtime ?? 0,
        genres: payload.genres ?? [],
        tagline: payload.tagline ?? '',
        status: 'plan_to_watch',
        ratingDraft: 0,
        review: '',
        note: '',
        addedAt: Date.now(),
      };

      setState((current) => ({
        ...current,
        watchlist: [detailedMovie, ...current.watchlist],
      }));
      setNotification(`${movie.title} was added to your watchlist.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unexpected error.';
      setNotification(message);
    }
  }

  function updateWatchlistItem(id: number, patch: Partial<WatchlistItem>) {
    setState((current) => ({
      ...current,
      watchlist: current.watchlist.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  }

  function removeWatchlistItem(id: number) {
    setState((current) => ({
      ...current,
      watchlist: current.watchlist.filter((item) => item.id !== id),
    }));
  }

  function submitProviderLink() {
    if (
      !providerDraft.movieName ||
      !providerDraft.platform ||
      !providerDraft.url
    ) {
      setNotification('Fill movie, platform, and URL before saving the link.');
      return;
    }

    setState((current) => ({
      ...current,
      providerLinks: [
        {
          id: crypto.randomUUID(),
          movieName: providerDraft.movieName,
          platform: providerDraft.platform,
          url: providerDraft.url,
          notes: providerDraft.notes,
        },
        ...current.providerLinks,
      ],
    }));

    setProviderDraft({ movieName: '', platform: '', url: '', notes: '' });
    setNotification('Availability link saved.');
  }

  function flagReview(item: WatchlistItem) {
    if (!item.review.trim()) {
      setNotification('Add a review before flagging it for moderation.');
      return;
    }

    const exists = state.tickets.some(
      (ticket) =>
        ticket.movieName === item.title &&
        ticket.issue === 'Review flagged for moderation',
    );

    if (exists) {
      setNotification('This review is already in the moderation queue.');
      return;
    }

    setState((current) => ({
      ...current,
      tickets: [
        {
          id: crypto.randomUUID(),
          movieName: item.title,
          issue: 'Review flagged for moderation',
          status: 'open',
          createdAt: Date.now(),
        },
        ...current.tickets,
      ],
    }));

    setNotification(`Review for ${item.title} moved to moderation.`);
  }

  function updateTicketStatus(id: string, status: TicketStatus) {
    setState((current) => ({
      ...current,
      tickets: current.tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, status } : ticket,
      ),
    }));
  }

  const roleContent = ROLE_COPY[state.role];
  const premiumMode = state.role === 'premium';

  return (
    <main className='relative mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8'>
      <div className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute -left-24 top-12 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl' />
        <div className='absolute right-0 top-44 h-96 w-96 rounded-full bg-fuchsia-200/35 blur-3xl' />
        <div className='absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl' />
      </div>

      <section className='overflow-hidden rounded-[2rem] border border-white/60 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.20)]'>
        <div className='grid gap-8 p-6 lg:grid-cols-[1.3fr,0.7fr] lg:p-8'>
          <div className='space-y-6'>
            <Badge variant='accent' className='bg-white/15 text-white'>
              <Sparkles className='mr-1 h-3.5 w-3.5' />
              Movie Orbit Dashboard
            </Badge>
            <div className='space-y-3'>
              <h1 className='max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl'>
                Track movies, curate your watchlist, and surface smarter
                recommendations.
              </h1>
              <p className='max-w-2xl text-base leading-7 text-slate-300 sm:text-lg'>
                The UI is now role-aware, watchlist-driven, and ready for your
                Supabase schema. Normal users get tracking and recommendations,
                premium users unlock metadata-based suggestions, providers
                manage streaming links, and admins can moderate reports.
              </p>
            </div>

            <div className='flex flex-wrap gap-3'>
              {(
                [
                  { role: 'normal', icon: Clapperboard },
                  { role: 'premium', icon: Heart },
                  { role: 'provider', icon: Link2 },
                  { role: 'admin', icon: Shield },
                ] as const
              ).map(({ role, icon: Icon }) => (
                <Button
                  key={role}
                  type='button'
                  variant={state.role === role ? 'accent' : 'outline'}
                  className='border-white/20 bg-white/5 text-white hover:bg-white/10'
                  onClick={() => setState((current) => ({ ...current, role }))}
                >
                  <Icon className='h-4 w-4' />
                  {role}
                </Button>
              ))}
            </div>

            <div className='grid gap-3 sm:grid-cols-5'>
              {[
                { label: 'Tracked', value: state.watchlist.length, icon: Film },
                { label: 'Watched', value: watchedCount, icon: Star },
                { label: 'Watching', value: watchingCount, icon: TrendingUp },
                {
                  label: 'Plan to watch',
                  value: planCount,
                  icon: Clapperboard,
                },
                { label: 'Open tickets', value: openTickets, icon: Flag },
              ].map((item) => (
                <Card
                  key={item.label}
                  className='border-white/10 bg-white/10 text-white backdrop-blur'
                >
                  <CardContent className='p-4'>
                    <div className='flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-300'>
                      <span>{item.label}</span>
                      <item.icon className='h-4 w-4' />
                    </div>
                    <p className='mt-3 text-3xl font-semibold'>{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className='space-y-4 rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl'>
            <p className='text-sm uppercase tracking-[0.18em] text-slate-300'>
              Current role
            </p>
            <div
              className={`rounded-3xl bg-gradient-to-br ${roleContent.gradient} p-5 text-slate-950 shadow-lg`}
            >
              <Badge
                variant='secondary'
                className='mb-4 bg-white/80 text-slate-900'
              >
                {roleContent.badge}
              </Badge>
              <h2 className='text-2xl font-semibold'>{roleContent.title}</h2>
              <p className='mt-2 text-sm leading-6 text-slate-950/75'>
                {roleContent.subtitle}
              </p>
            </div>

            <div className='grid grid-cols-2 gap-3 text-sm'>
              <Card className='border-white/10 bg-white/10 text-white'>
                <CardContent className='p-4'>
                  <p className='text-slate-300'>Average rating</p>
                  <p className='mt-2 text-2xl font-semibold'>
                    {averageRating.toFixed(1)}
                  </p>
                </CardContent>
              </Card>
              <Card className='border-white/10 bg-white/10 text-white'>
                <CardContent className='p-4'>
                  <p className='text-slate-300'>Genres used</p>
                  <p className='mt-2 text-2xl font-semibold'>
                    {favoriteGenres.length}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <div className='grid gap-8 xl:grid-cols-[1.35fr,0.85fr]'>
        <div className='space-y-8'>
          <TmdbSearch onAddMovie={addMovieToWatchlist} />

          <Card className='border-white/70 bg-white/85'>
            <CardHeader className='flex-row items-start justify-between gap-4'>
              <div>
                <CardTitle>Your watchlist</CardTitle>
                <CardDescription>
                  Move movies through watched, watching, and plan to watch.
                </CardDescription>
              </div>
              <Badge variant='secondary'>{state.watchlist.length} items</Badge>
            </CardHeader>
            <CardContent className='space-y-4'>
              {state.watchlist.length === 0 ? (
                <div className='rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-sm text-slate-600'>
                  Search a title above and press Track this movie to start
                  building your watchlist.
                </div>
              ) : (
                state.watchlist.map((movie) => (
                  <div
                    key={uniqueKey(movie.id)}
                    className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'
                  >
                    <div className='grid gap-4 p-4 sm:grid-cols-[120px,1fr]'>
                      <div className='overflow-hidden rounded-2xl bg-slate-100'>
                        {movie.posterPath ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                            alt={movie.title}
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <div className='flex h-full min-h-44 items-center justify-center bg-gradient-to-br from-slate-900 to-sky-700 text-white'>
                            <Film className='h-10 w-10 opacity-80' />
                          </div>
                        )}
                      </div>
                      <div className='space-y-4'>
                        <div className='flex flex-wrap items-start justify-between gap-3'>
                          <div>
                            <h3 className='text-xl font-semibold text-slate-950'>
                              {movie.title}
                            </h3>
                            <p className='text-sm text-slate-500'>
                              {movie.releaseDate || 'Unknown release date'} ·{' '}
                              {formatRuntime(movie.runtime)}
                            </p>
                          </div>
                          <div className='flex flex-wrap gap-2'>
                            <Badge variant='accent'>
                              {movie.status.replaceAll('_', ' ')}
                            </Badge>
                            <Badge variant='outline'>
                              {movie.genres
                                .slice(0, 2)
                                .map((genre) => genre.name)
                                .join(' · ') || 'Genre unknown'}
                            </Badge>
                          </div>
                        </div>

                        {movie.tagline ? (
                          <p className='text-sm italic text-slate-500'>
                            “{movie.tagline}”
                          </p>
                        ) : null}
                        <p className='line-clamp-2 text-sm leading-6 text-slate-600'>
                          {movie.overview}
                        </p>

                        <div className='grid gap-3 md:grid-cols-[1fr,120px]'>
                          <div className='space-y-2'>
                            <label className='text-xs font-medium uppercase tracking-[0.16em] text-slate-500'>
                              Review notes
                            </label>
                            <Textarea
                              value={movie.review}
                              onChange={(event) =>
                                updateWatchlistItem(movie.id, {
                                  review: event.target.value,
                                })
                              }
                              placeholder='Write a quick reaction, spoiler note, or favorite scene.'
                              className='min-h-28'
                            />
                          </div>
                          <div className='space-y-2'>
                            <label className='text-xs font-medium uppercase tracking-[0.16em] text-slate-500'>
                              Rating
                            </label>
                            <Input
                              type='number'
                              min='0'
                              max='10'
                              step='0.5'
                              value={movie.ratingDraft}
                              onChange={(event) =>
                                updateWatchlistItem(movie.id, {
                                  ratingDraft: Number(event.target.value),
                                })
                              }
                            />
                            <label className='mt-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-500'>
                              Status
                            </label>
                            <Select
                              value={movie.status}
                              onChange={(event) =>
                                updateWatchlistItem(movie.id, {
                                  status: event.target.value as WatchStatus,
                                })
                              }
                            >
                              <option value='plan_to_watch'>
                                Plan to watch
                              </option>
                              <option value='watching'>Watching</option>
                              <option value='watched'>Watched</option>
                            </Select>
                          </div>
                        </div>

                        <div className='flex flex-wrap gap-2'>
                          <Button
                            type='button'
                            variant='secondary'
                            onClick={() => flagReview(movie)}
                          >
                            <MessageSquareWarning className='h-4 w-4' />
                            Flag review
                          </Button>
                          <Button
                            type='button'
                            variant='ghost'
                            onClick={() => removeWatchlistItem(movie.id)}
                          >
                            <Trash2 className='h-4 w-4' />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className='border-white/70 bg-white/85'>
            <CardHeader className='flex-row items-start justify-between gap-4'>
              <div>
                <CardTitle>
                  {premiumMode
                    ? 'Premium recommendations'
                    : 'Basic recommendations'}
                </CardTitle>
                <CardDescription>
                  {premiumMode
                    ? 'Metadata-based picks derived from your watched genres.'
                    : 'Lightweight genre-based suggestions based on what you already like.'}
                </CardDescription>
              </div>
              <Badge variant='accent'>
                <TrendingUp className='mr-1 h-3.5 w-3.5' />
                {recommendations.length} picks
              </Badge>
            </CardHeader>
            <CardContent>
              {recommendationsLoading ? (
                <p className='flex items-center gap-2 text-sm text-slate-600'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Finding matches from TMDB...
                </p>
              ) : recommendations.length === 0 ? (
                <div className='rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-sm text-slate-600'>
                  Add at least one movie and mark a rating to unlock
                  personalized recommendations.
                </div>
              ) : (
                <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
                  {recommendations.map((movie) => (
                    <div
                      key={movie.id}
                      className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'
                    >
                      <div className='aspect-[3/4] bg-slate-100'>
                        {movie.posterPath ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                            alt={movie.title}
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <div className='flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-sky-700 text-white'>
                            <Film className='h-8 w-8 opacity-80' />
                          </div>
                        )}
                      </div>
                      <div className='space-y-2 p-4'>
                        <div className='flex items-start justify-between gap-3'>
                          <p className='font-semibold text-slate-950'>
                            {movie.title}
                          </p>
                          <Badge variant='outline'>
                            {movie.rating.toFixed(1)}
                          </Badge>
                        </div>
                        <p className='line-clamp-3 text-xs leading-5 text-slate-600'>
                          {movie.overview ||
                            'Suggested because it matches your current taste signals.'}
                        </p>
                        <Button
                          type='button'
                          variant='ghost'
                          className='w-full justify-between px-3'
                        >
                          Open TMDB logic
                          <ArrowRight className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className='space-y-8'>
          {premiumMode ? (
            <Card className='overflow-hidden border-white/70 bg-white/85'>
              <div className='bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 p-5 text-white'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-xs uppercase tracking-[0.18em] text-white/80'>
                      Premium mode
                    </p>
                    <h3 className='mt-2 text-2xl font-semibold'>
                      Ad-free UI active
                    </h3>
                  </div>
                  <MoonStar className='h-10 w-10 opacity-90' />
                </div>
                <p className='mt-3 text-sm text-white/85'>
                  The ad card disappears for premium users and the
                  recommendation engine uses richer signals.
                </p>
              </div>
              <CardContent className='space-y-3 p-5'>
                <div className='flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm'>
                  <span>Metadata inputs</span>
                  <span className='font-semibold'>
                    {favoriteGenres.length} genres
                  </span>
                </div>
                <div className='flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm'>
                  <span>Ad surfaces</span>
                  <span className='font-semibold'>Hidden</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className='overflow-hidden border-white/70 bg-white/85'>
              <div className='bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 p-5 text-white'>
                <p className='text-xs uppercase tracking-[0.18em] text-slate-300'>
                  Upsell area
                </p>
                <h3 className='mt-2 text-2xl font-semibold'>
                  Upgrade for premium recommendations
                </h3>
                <p className='mt-2 text-sm text-slate-300'>
                  Unlock deeper metadata-based recommendations and remove
                  promotional surfaces.
                </p>
              </div>
              <CardContent className='space-y-3 p-5'>
                <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600'>
                  Premium users see richer recommendation logic and a cleaner
                  interface.
                </div>
                <Button type='button' variant='accent' className='w-full'>
                  View premium plan
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className='border-white/70 bg-white/85'>
            <CardHeader>
              <CardTitle>Provider links</CardTitle>
              <CardDescription>
                Keep platform availability links organized for each movie.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <Input
                  value={providerDraft.movieName}
                  onChange={(event) =>
                    setProviderDraft((current) => ({
                      ...current,
                      movieName: event.target.value,
                    }))
                  }
                  placeholder='Movie name'
                />
                <Input
                  value={providerDraft.platform}
                  onChange={(event) =>
                    setProviderDraft((current) => ({
                      ...current,
                      platform: event.target.value,
                    }))
                  }
                  placeholder='Platform name'
                />
                <Input
                  value={providerDraft.url}
                  onChange={(event) =>
                    setProviderDraft((current) => ({
                      ...current,
                      url: event.target.value,
                    }))
                  }
                  placeholder='Streaming or booking URL'
                />
                <Textarea
                  value={providerDraft.notes}
                  onChange={(event) =>
                    setProviderDraft((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  placeholder='Notes about availability, region, or pricing'
                />
                <Button
                  type='button'
                  variant='accent'
                  className='w-full'
                  onClick={submitProviderLink}
                >
                  Save availability link
                </Button>
              </div>

              <div className='space-y-3'>
                {state.providerLinks.length === 0 ? (
                  <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600'>
                    No links added yet. Save a movie URL here to manage
                    availability.
                  </div>
                ) : (
                  state.providerLinks.map((link) => (
                    <div
                      key={link.id}
                      className='rounded-2xl border border-slate-200 bg-white p-4'
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <p className='font-semibold text-slate-950'>
                            {link.movieName}
                          </p>
                          <p className='text-xs text-slate-500'>
                            {link.platform}
                          </p>
                        </div>
                        <Link2 className='h-4 w-4 text-slate-400' />
                      </div>
                      <p className='mt-2 break-all text-xs text-sky-700'>
                        {link.url}
                      </p>
                      {link.notes ? (
                        <p className='mt-2 text-xs text-slate-500'>
                          {link.notes}
                        </p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className='border-white/70 bg-white/85'>
            <CardHeader>
              <CardTitle>Admin moderation</CardTitle>
              <CardDescription>
                Review tickets and handle reported movie reviews.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-3'>
                <div className='rounded-2xl bg-slate-50 p-4'>
                  <p className='text-xs uppercase tracking-[0.18em] text-slate-500'>
                    Users
                  </p>
                  <p className='mt-2 text-2xl font-semibold'>4 roles</p>
                </div>
                <div className='rounded-2xl bg-slate-50 p-4'>
                  <p className='text-xs uppercase tracking-[0.18em] text-slate-500'>
                    Reports
                  </p>
                  <p className='mt-2 text-2xl font-semibold'>
                    {state.tickets.length}
                  </p>
                </div>
              </div>

              <div className='space-y-3'>
                {state.tickets.length === 0 ? (
                  <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600'>
                    Flag a review from the watchlist to send it here.
                  </div>
                ) : (
                  state.tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className='rounded-2xl border border-slate-200 bg-white p-4'
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <p className='font-semibold text-slate-950'>
                            {ticket.movieName}
                          </p>
                          <p className='text-xs text-slate-500'>
                            {ticket.issue}
                          </p>
                        </div>
                        <Badge
                          variant={
                            ticket.status === 'resolved'
                              ? 'success'
                              : ticket.status === 'open'
                                ? 'warning'
                                : 'secondary'
                          }
                        >
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className='mt-3 flex flex-wrap gap-2'>
                        <Button
                          type='button'
                          size='sm'
                          variant='secondary'
                          onClick={() =>
                            updateTicketStatus(ticket.id, 'in_progress')
                          }
                        >
                          <PencilLine className='h-3.5 w-3.5' />
                          Mark working
                        </Button>
                        <Button
                          type='button'
                          size='sm'
                          variant='outline'
                          onClick={() =>
                            updateTicketStatus(ticket.id, 'resolved')
                          }
                        >
                          <Shield className='h-3.5 w-3.5' />
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {notification ? (
        <div className='fixed bottom-5 left-1/2 z-20 w-[min(92vw,520px)] -translate-x-1/2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm shadow-lg'>
          {notification}
        </div>
      ) : null}
    </main>
  );
}
