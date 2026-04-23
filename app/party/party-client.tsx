'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Copy, Plus, Users } from 'lucide-react';

import { PageShell } from '@/components/page-shell';
import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type PartyFormState = {
  movieId: string;
  movieTitle: string;
  scheduledAt: string;
  notes: string;
  code: string;
};

function formatDateTime(value: string) {
  if (!value) {
    return 'Time not set';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function PartyPageClient({
  initialMovieId,
}: {
  initialMovieId: string;
}) {
  const {
    state,
    watchParties,
    createWatchParty,
    joinWatchParty,
    updateWatchPartyStatus,
    leaveWatchParty,
  } = useMovieOrbitState();
  const [form, setForm] = useState<PartyFormState>({
    movieId: initialMovieId,
    movieTitle: '',
    scheduledAt: '',
    notes: '',
    code: '',
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  const userParties = useMemo(
    () =>
      watchParties.filter(
        (party) =>
          party.hostEmail === state.email ||
          party.guests.some((guest) => guest.email === state.email),
      ),
    [watchParties, state.email],
  );

  const selectedMovie = state.watchlist.find(
    (item) => String(item.id) === (form.movieId || initialMovieId),
  );

  if (!state.isAuthenticated || state.role !== 'user') {
    return (
      <PageShell
        eyebrow='Watch Party'
        title='Watch party is available for user accounts.'
        description='Sign in with a user account to create rooms, join by code, and share movie nights.'
      >
        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-6'>
            <p className='text-sm leading-7 text-slate-300'>
              This feature is reserved for regular users so the experience stays
              simple and focused.
            </p>
            <div className='flex flex-wrap gap-3'>
              <Link
                href='/login'
                className='inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white transition hover:bg-white/10'
              >
                Log in
              </Link>
              <Link
                href='/signup'
                className='inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-medium text-slate-950 transition hover:bg-slate-100'
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  const availableMovies = state.watchlist;

  function handleCreateParty() {
    const activeMovie = state.watchlist.find(
      (item) => String(item.id) === (form.movieId || initialMovieId),
    );

    const result = createWatchParty({
      movieId: activeMovie ? activeMovie.id : null,
      movieTitle: form.movieTitle || activeMovie?.title || '',
      posterPath: activeMovie?.posterPath ?? null,
      scheduledAt: form.scheduledAt,
      notes: form.notes,
    });

    setFeedback(result.message);
    if (result.ok) {
      setForm({
        movieId: '',
        movieTitle: '',
        scheduledAt: '',
        notes: '',
        code: '',
      });
    }
  }

  function handleJoinParty() {
    const result = joinWatchParty(form.code);
    setFeedback(result.message);
    if (result.ok) {
      setForm((current) => ({ ...current, code: '' }));
    }
  }

  return (
    <PageShell
      eyebrow='Watch Party'
      title='Create or join a movie night room.'
      description='Keep it compact: pick a movie, share a code, and manage the room from a single clean page.'
    >
      <div className='grid gap-6 xl:grid-cols-[0.95fr,1.05fr]'>
        <div className='space-y-4'>
          <Card className='border-white/10 bg-slate-950/85 text-white'>
            <CardContent className='space-y-4 p-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-semibold'>Create a room</p>
                  <p className='text-xs text-slate-400'>
                    Starts with your watchlist or a custom title.
                  </p>
                </div>
                <Badge variant='accent'>
                  <Plus className='mr-1 h-3.5 w-3.5' />
                  New room
                </Badge>
              </div>

              <label className='block space-y-2'>
                <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                  Pick a movie
                </span>
                <Select
                  value={form.movieId}
                  onChange={(event) => {
                    const nextMovieId = event.target.value;
                    const nextSelectedMovie = state.watchlist.find(
                      (item) => String(item.id) === nextMovieId,
                    );

                    setForm((current) => ({
                      ...current,
                      movieId: nextMovieId,
                      movieTitle:
                        nextSelectedMovie?.title ?? current.movieTitle,
                    }));
                  }}
                >
                  <option value=''>Choose from watchlist</option>
                  {availableMovies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title}
                    </option>
                  ))}
                </Select>
              </label>

              <label className='block space-y-2'>
                <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                  Movie title
                </span>
                <Input
                  value={form.movieTitle || selectedMovie?.title || ''}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      movieTitle: event.target.value,
                    }))
                  }
                  placeholder='Evening movie title'
                />
              </label>

              <label className='block space-y-2'>
                <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                  Start time
                </span>
                <Input
                  type='datetime-local'
                  value={form.scheduledAt}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      scheduledAt: event.target.value,
                    }))
                  }
                />
              </label>

              <label className='block space-y-2'>
                <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                  Notes
                </span>
                <Textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  placeholder='Snack plan, start time, or any room rules.'
                />
              </label>

              <Button
                type='button'
                variant='accent'
                onClick={handleCreateParty}
              >
                Create watch party
              </Button>
            </CardContent>
          </Card>

          <Card className='border-white/10 bg-slate-950/85 text-white'>
            <CardContent className='space-y-4 p-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-semibold'>Join with code</p>
                  <p className='text-xs text-slate-400'>
                    Enter a code from a friend or another account.
                  </p>
                </div>
                <Users className='h-4 w-4 text-cyan-300' />
              </div>

              <Input
                value={form.code}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    code: event.target.value,
                  }))
                }
                placeholder='Enter party code'
              />

              <Button type='button' variant='outline' onClick={handleJoinParty}>
                Join party
              </Button>

              {feedback ? (
                <p className='text-sm text-slate-300'>{feedback}</p>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className='space-y-4'>
          <Card className='border-white/10 bg-slate-950/85 text-white'>
            <CardContent className='space-y-3 p-5'>
              <p className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                Your rooms
              </p>
              {userParties.length === 0 ? (
                <p className='rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300'>
                  No watch parties yet. Create one from the form on the left.
                </p>
              ) : (
                <div className='space-y-3'>
                  {userParties.map((party) => {
                    const isHost = party.hostEmail === state.email;
                    const isGuest = party.guests.some(
                      (guest) => guest.email === state.email,
                    );

                    return (
                      <div
                        key={party.id}
                        className='rounded-2xl border border-white/10 bg-white/5 p-4'
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div>
                            <p className='font-semibold text-white'>
                              {party.movieTitle}
                            </p>
                            <p className='text-xs text-slate-400'>
                              {formatDateTime(party.scheduledAt)}
                            </p>
                          </div>
                          <Badge
                            variant={
                              party.status === 'live'
                                ? 'success'
                                : party.status === 'ended'
                                  ? 'secondary'
                                  : 'accent'
                            }
                          >
                            {party.status}
                          </Badge>
                        </div>

                        <div className='mt-3 flex flex-wrap gap-2 text-xs text-slate-300'>
                          <span>Code: {party.code}</span>
                          <span>Host: {party.hostName}</span>
                          <span>Guests: {party.guests.length}</span>
                        </div>

                        {party.notes ? (
                          <p className='mt-3 text-sm leading-6 text-slate-300'>
                            {party.notes}
                          </p>
                        ) : null}

                        <div className='mt-4 flex flex-wrap gap-2'>
                          <Button
                            type='button'
                            size='sm'
                            variant='secondary'
                            onClick={() =>
                              navigator.clipboard?.writeText(party.code)
                            }
                          >
                            <Copy className='h-4 w-4' />
                            Copy code
                          </Button>

                          {isHost ? (
                            <Button
                              type='button'
                              size='sm'
                              variant='outline'
                              onClick={() =>
                                updateWatchPartyStatus(
                                  party.id,
                                  party.status === 'live' ? 'ended' : 'live',
                                )
                              }
                            >
                              {party.status === 'live' ? 'End room' : 'Go live'}
                            </Button>
                          ) : null}

                          {isGuest && !isHost ? (
                            <Button
                              type='button'
                              size='sm'
                              variant='ghost'
                              onClick={() => leaveWatchParty(party.id)}
                            >
                              Leave room
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
