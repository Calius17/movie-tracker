'use client';

import { useEffect, useMemo, useState } from 'react';

import type { MovieResult } from '@/components/tmdb-search';

type Role = 'normal' | 'premium' | 'provider' | 'admin';
type WatchStatus = 'watched' | 'watching' | 'plan_to_watch';
type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

type DetailedMovie = MovieResult & {
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
};

export type WatchlistItem = DetailedMovie & {
  status: WatchStatus;
  ratingDraft: number;
  review: string;
  note: string;
  addedAt: number;
};

export type ProviderLink = {
  id: string;
  movieName: string;
  platform: string;
  url: string;
  notes: string;
};

export type ModerationTicket = {
  id: string;
  movieName: string;
  issue: string;
  status: TicketStatus;
  createdAt: number;
};

type DashboardState = {
  isAuthenticated: boolean;
  accountName: string;
  role: Role;
  watchlist: WatchlistItem[];
  providerLinks: ProviderLink[];
  tickets: ModerationTicket[];
};

const STORAGE_KEY = 'movie-orbit-dashboard-state';

const defaultState: DashboardState = {
  isAuthenticated: false,
  accountName: '',
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

function inferRoleFromEmail(email: string): Role {
  const normalizedEmail = email.toLowerCase();

  if (normalizedEmail.includes('admin')) {
    return 'admin';
  }

  if (normalizedEmail.includes('provider')) {
    return 'provider';
  }

  if (normalizedEmail.includes('premium')) {
    return 'premium';
  }

  return 'normal';
}

async function fetchMovieDetails(movieId: number) {
  const response = await fetch(`/api/tmdb/movie/${movieId}`);
  const payload = (await response.json()) as Partial<DetailedMovie> & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error ?? 'Could not load movie details.');
  }

  return payload;
}

export function useMovieOrbitState() {
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
      const payload = await fetchMovieDetails(movie.id);

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

  function setRole(role: Role) {
    setState((current) => ({
      ...current,
      role,
    }));
  }

  function signIn(accountName: string, email: string) {
    setState((current) => ({
      ...current,
      isAuthenticated: true,
      accountName: accountName.trim() || 'Movie Orbit User',
      role: inferRoleFromEmail(email),
    }));
  }

  function signOut() {
    setState((current) => ({
      ...defaultState,
      watchlist: current.watchlist,
      providerLinks: current.providerLinks,
      tickets: current.tickets,
    }));
  }

  return {
    state,
    setState,
    setRole,
    signIn,
    signOut,
    mounted,
    notification,
    setNotification,
    recommendations,
    recommendationsLoading,
    providerDraft,
    setProviderDraft,
    favoriteGenres,
    watchedCount,
    watchingCount,
    planCount,
    averageRating,
    openTickets,
    addMovieToWatchlist,
    updateWatchlistItem,
    removeWatchlistItem,
    submitProviderLink,
    flagReview,
    updateTicketStatus,
  };
}
