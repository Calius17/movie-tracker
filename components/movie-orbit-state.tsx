'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { MovieResult } from '@/components/tmdb-search';

export type Role = 'user' | 'moderator' | 'admin' | 'provider';
export type PlanTier = 'free' | 'ad_free';
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
  email: string;
  role: Role;
  plan: PlanTier;
  watchlist: WatchlistItem[];
  providerLinks: ProviderLink[];
  tickets: ModerationTicket[];
};

type AccountRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  plan: PlanTier;
  createdAt: number;
};

type AccountData = Pick<
  DashboardState,
  'watchlist' | 'providerLinks' | 'tickets'
>;

type PaymentInput = {
  cardholder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

type SignupInput = {
  name: string;
  email: string;
  password: string;
  plan: PlanTier;
  payment?: PaymentInput;
};

const STORAGE_KEY = 'movie-orbit-dashboard-state';
const ACCOUNTS_KEY = 'movie-orbit-accounts';
const ACCOUNT_DATA_KEY = 'movie-orbit-account-data';
const PENDING_SIGNUP_PLAN_KEY = 'movie-orbit-pending-signup-plan';

const defaultState: DashboardState = {
  isAuthenticated: false,
  accountName: '',
  email: '',
  role: 'user',
  plan: 'free',
  watchlist: [],
  providerLinks: [],
  tickets: [],
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isAllowedRole(value: string): value is Role {
  return (
    value === 'user' ||
    value === 'moderator' ||
    value === 'admin' ||
    value === 'provider'
  );
}

function loadAccounts(): AccountRecord[] {
  if (typeof window === 'undefined') {
    return getDemoAccounts();
  }

  try {
    const rawState = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!rawState) {
      return getDemoAccounts();
    }

    const parsed = JSON.parse(rawState) as AccountRecord[];
    return parsed.map((account) => ({
      ...account,
      role: isAllowedRole(account.role) ? account.role : 'user',
      plan: account.plan === 'ad_free' ? 'ad_free' : 'free',
      email: normalizeEmail(account.email),
    }));
  } catch {
    return getDemoAccounts();
  }
}

function saveAccounts(accounts: AccountRecord[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function loadAccountDataMap(): Record<string, AccountData> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(ACCOUNT_DATA_KEY);
    if (!rawValue) {
      return {};
    }

    const parsed = JSON.parse(rawValue) as Record<string, Partial<AccountData>>;
    return Object.fromEntries(
      Object.entries(parsed).map(([email, data]) => [
        normalizeEmail(email),
        {
          watchlist: Array.isArray(data.watchlist) ? data.watchlist : [],
          providerLinks: Array.isArray(data.providerLinks)
            ? data.providerLinks
            : [],
          tickets: Array.isArray(data.tickets) ? data.tickets : [],
        },
      ]),
    );
  } catch {
    return {};
  }
}

function saveAccountDataMap(map: Record<string, AccountData>) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(ACCOUNT_DATA_KEY, JSON.stringify(map));
}

function getAccountData(email: string): AccountData {
  const normalizedEmail = normalizeEmail(email);
  const accountDataMap = loadAccountDataMap();

  return (
    accountDataMap[normalizedEmail] ?? {
      watchlist: [],
      providerLinks: [],
      tickets: [],
    }
  );
}

function persistAccountData(email: string, data: AccountData) {
  const normalizedEmail = normalizeEmail(email);
  const accountDataMap = loadAccountDataMap();
  accountDataMap[normalizedEmail] = data;
  saveAccountDataMap(accountDataMap);
}

function getDemoAccounts(): AccountRecord[] {
  const createdAt = Date.now();

  return [
    {
      id: 'demo-admin',
      name: 'Admin User',
      email: 'admin@movieorbit.app',
      password: 'Admin123!',
      role: 'admin',
      plan: 'ad_free',
      createdAt,
    },
    {
      id: 'demo-moderator',
      name: 'Moderator User',
      email: 'moderator@movieorbit.app',
      password: 'Moderator123!',
      role: 'moderator',
      plan: 'free',
      createdAt,
    },
    {
      id: 'demo-provider',
      name: 'Provider User',
      email: 'provider@movieorbit.app',
      password: 'Provider123!',
      role: 'provider',
      plan: 'free',
      createdAt,
    },
  ];
}

function savePendingSignupPlan(plan: PlanTier, paid: boolean) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    PENDING_SIGNUP_PLAN_KEY,
    JSON.stringify({ plan, paid }),
  );
}

function loadPendingSignupPlan(): { plan: PlanTier; paid: boolean } | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(PENDING_SIGNUP_PLAN_KEY);
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as {
      plan?: PlanTier;
      paid?: boolean;
    };

    if (!parsed.plan) {
      return null;
    }

    return {
      plan: parsed.plan === 'ad_free' ? 'ad_free' : 'free',
      paid: Boolean(parsed.paid),
    };
  } catch {
    return null;
  }
}

function clearPendingSignupPlan() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(PENDING_SIGNUP_PLAN_KEY);
}

function loadState(): DashboardState {
  if (typeof window === 'undefined') {
    return defaultState;
  }

  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY);
    if (!rawState) {
      return defaultState;
    }

    const parsed = JSON.parse(rawState) as Partial<DashboardState>;
    const accountData = parsed.email ? getAccountData(parsed.email) : null;
    return {
      ...defaultState,
      ...parsed,
      role: isAllowedRole(parsed.role ?? '') ? parsed.role! : 'user',
      plan: parsed.plan === 'ad_free' ? 'ad_free' : 'free',
      email: normalizeEmail(parsed.email ?? ''),
      watchlist: accountData?.watchlist ?? defaultState.watchlist,
      providerLinks: accountData?.providerLinks ?? defaultState.providerLinks,
      tickets: accountData?.tickets ?? defaultState.tickets,
    };
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

function useMovieOrbitStore() {
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

    const { watchlist, providerLinks, tickets, ...persistedState } = state;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));

    if (state.isAuthenticated && state.email) {
      persistAccountData(state.email, {
        watchlist,
        providerLinks,
        tickets,
      });
    }
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

  function prepareSignupPlan(plan: PlanTier, payment?: PaymentInput) {
    if (plan === 'ad_free') {
      const cardholder = payment?.cardholder.trim() ?? '';
      const cardNumber = payment?.cardNumber.trim() ?? '';
      const expiry = payment?.expiry.trim() ?? '';
      const cvv = payment?.cvv.trim() ?? '';

      if (!cardholder || !cardNumber || !expiry || !cvv) {
        return {
          ok: false,
          message: 'Fill payment details to continue with the ad-free plan.',
        };
      }
    }

    savePendingSignupPlan(plan, true);
    return {
      ok: true,
      message:
        plan === 'ad_free'
          ? 'Ad-free plan selected. Continue to signup.'
          : 'Free plan selected. Continue to signup.',
    };
  }

  function registerUser(input: SignupInput) {
    const name = input.name.trim();
    const email = normalizeEmail(input.email);
    const password = input.password.trim();
    const plan = input.plan;

    if (!name) {
      return { ok: false, message: 'Enter your display name.' };
    }

    if (!email.includes('@')) {
      return { ok: false, message: 'Enter a valid email address.' };
    }

    if (password.length < 6) {
      return { ok: false, message: 'Password must be at least 6 characters.' };
    }

    const pendingPlan = loadPendingSignupPlan();
    if (!pendingPlan) {
      return {
        ok: false,
        message: 'Choose a plan on the Plans page before signing up.',
      };
    }

    if (pendingPlan.plan !== plan) {
      return {
        ok: false,
        message:
          'Selected plan does not match your onboarding plan. Choose plan again.',
      };
    }

    if (plan === 'ad_free' && !pendingPlan.paid) {
      return {
        ok: false,
        message: 'Complete ad-free checkout first, then sign up.',
      };
    }

    const accounts = loadAccounts();
    const exists = accounts.some((account) => account.email === email);
    if (exists) {
      return {
        ok: false,
        message: 'This email already has an account. Please log in.',
      };
    }

    const nextAccount: AccountRecord = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role: 'user',
      plan,
      createdAt: Date.now(),
    };

    saveAccounts([nextAccount, ...accounts]);
    clearPendingSignupPlan();

    setState((current) => ({
      ...current,
      isAuthenticated: true,
      accountName: name,
      email,
      role: 'user',
      plan,
      ...getAccountData(email),
    }));

    return {
      ok: true,
      message:
        plan === 'ad_free'
          ? 'Account created and ad-free activated.'
          : 'Account created successfully.',
    };
  }

  function signIn(email: string, password: string) {
    const normalizedEmail = normalizeEmail(email);
    const trimmedPassword = password.trim();

    if (!normalizedEmail || !trimmedPassword) {
      return { ok: false, message: 'Enter email and password.' };
    }

    const accounts = loadAccounts();
    const account = accounts.find(
      (entry) =>
        entry.email === normalizedEmail && entry.password === trimmedPassword,
    );

    if (!account) {
      return {
        ok: false,
        message: 'Invalid email or password. Please try again.',
      };
    }

    setState((current) => ({
      ...current,
      isAuthenticated: true,
      accountName: account.name,
      email: account.email,
      role: account.role,
      plan: account.plan,
      ...getAccountData(account.email),
    }));

    return { ok: true, message: `Welcome back, ${account.name}.` };
  }

  function signOut() {
    if (state.email) {
      persistAccountData(state.email, {
        watchlist: state.watchlist,
        providerLinks: state.providerLinks,
        tickets: state.tickets,
      });
    }

    setState(defaultState);
  }

  function purchaseAdFreePlan(payment: PaymentInput) {
    if (!state.isAuthenticated) {
      return { ok: false, message: 'Log in before purchasing a plan.' };
    }

    const cardholder = payment.cardholder.trim();
    const cardNumber = payment.cardNumber.trim();
    const expiry = payment.expiry.trim();
    const cvv = payment.cvv.trim();

    if (!cardholder || !cardNumber || !expiry || !cvv) {
      return {
        ok: false,
        message: 'Enter payment details to continue.',
      };
    }

    setState((current) => ({
      ...current,
      plan: 'ad_free',
    }));

    const accounts = loadAccounts();
    const updatedAccounts = accounts.map((account) =>
      account.email === state.email
        ? { ...account, plan: 'ad_free' as const }
        : account,
    );
    saveAccounts(updatedAccounts);

    setNotification('Ad-free plan activated successfully.');
    return { ok: true, message: 'Payment successful. Ad-free is now active.' };
  }

  return {
    state,
    setState,
    setRole,
    prepareSignupPlan,
    registerUser,
    signIn,
    signOut,
    purchaseAdFreePlan,
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

type MovieOrbitStore = ReturnType<typeof useMovieOrbitStore>;

const MovieOrbitContext = createContext<MovieOrbitStore | null>(null);

export function MovieOrbitProvider({ children }: { children: ReactNode }) {
  const store = useMovieOrbitStore();

  return (
    <MovieOrbitContext.Provider value={store}>
      {children}
    </MovieOrbitContext.Provider>
  );
}

export function useMovieOrbitState() {
  const context = useContext(MovieOrbitContext);

  if (!context) {
    throw new Error(
      'useMovieOrbitState must be used inside MovieOrbitProvider.',
    );
  }

  return context;
}
