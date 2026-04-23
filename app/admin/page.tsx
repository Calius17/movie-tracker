'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Flag, ShieldCheck, Users } from 'lucide-react';

import { PageShell } from '@/components/page-shell';
import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function AdminPage() {
  const {
    state,
    updateTicketStatus,
    openTickets,
    homeRecommendations,
    addHomeRecommendation,
    removeHomeRecommendation,
  } = useMovieOrbitState();
  const tickets = state.tickets;
  const isStaff = state.role === 'admin' || state.role === 'moderator';
  const [titleInput, setTitleInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  function handleAddRecommendation() {
    const result = addHomeRecommendation(titleInput, noteInput);
    setMessage(result.message);

    if (result.ok) {
      setTitleInput('');
      setNoteInput('');
    }
  }

  if (!state.isAuthenticated) {
    return (
      <PageShell
        eyebrow='Staff'
        title='Staff dashboard is restricted.'
        description='Moderation tools stay behind authenticated admin or moderator accounts.'
      >
        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-6'>
            <p className='text-sm leading-7 text-slate-300'>
              Sign in with an admin or moderator account to manage reports and
              moderation.
            </p>
            <div className='flex flex-wrap gap-3'>
              <Link
                href='/login'
                className='inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm text-white transition hover:bg-white/10'
              >
                Log in
              </Link>
              <Link
                href='/signup'
                className='inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-slate-950 transition hover:bg-slate-100'
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  if (!isStaff) {
    return (
      <PageShell
        eyebrow='Staff'
        title='Staff access required.'
        description='Only accounts with admin or moderator access can open this moderation workspace.'
      >
        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-6'>
            <p className='text-sm leading-7 text-slate-300'>
              Switch to an admin or moderator account in your profile session to
              continue.
            </p>
            <Link
              href='/login'
              className='inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-slate-950 transition hover:bg-slate-100'
            >
              Go to login
            </Link>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow='Staff'
      title='Moderation and safety operations in one place.'
      description='A clean staff dashboard for admin and moderators, separate from customer flows.'
    >
      <div className='grid gap-6 xl:grid-cols-[0.75fr,1.25fr]'>
        <div
          id='staff-overview'
          className='grid gap-4 sm:grid-cols-2 xl:grid-cols-1'
        >
          {[
            { label: 'Open reports', value: openTickets, icon: Flag },
            { label: 'Current role', value: state.role, icon: Users },
            {
              label: 'Homepage picks',
              value: homeRecommendations.length,
              icon: ShieldCheck,
            },
          ].map((item) => (
            <Card
              key={item.label}
              className='border-white/10 bg-slate-950/85 text-white'
            >
              <CardContent className='space-y-2 p-5'>
                <div className='flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-400'>
                  <span>{item.label}</span>
                  <item.icon className='h-4 w-4' />
                </div>
                <p className='text-3xl font-semibold'>{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='space-y-4'>
          <Card
            id='homepage-recommendations'
            className='border-white/10 bg-slate-950/85 text-white'
          >
            <CardContent className='space-y-4 p-5'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold'>
                  Homepage recommendations
                </h2>
                <Badge variant='accent'>Staff curated</Badge>
              </div>

              <label className='block space-y-2'>
                <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                  Movie title
                </span>
                <Input
                  value={titleInput}
                  onChange={(event) => setTitleInput(event.target.value)}
                  placeholder='Movie title to feature on home'
                />
              </label>

              <label className='block space-y-2'>
                <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                  Curation note
                </span>
                <Textarea
                  value={noteInput}
                  onChange={(event) => setNoteInput(event.target.value)}
                  placeholder='Reason this title should appear on homepage.'
                />
              </label>

              <Button
                type='button'
                variant='accent'
                onClick={handleAddRecommendation}
              >
                Add homepage recommendation
              </Button>

              {message ? (
                <p className='text-sm text-slate-300'>{message}</p>
              ) : null}

              {homeRecommendations.length === 0 ? (
                <p className='rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300'>
                  No staff picks yet. Add one above to publish on the homepage.
                </p>
              ) : (
                <div className='space-y-3'>
                  {homeRecommendations.map((item) => (
                    <div
                      key={item.id}
                      className='rounded-2xl border border-white/10 bg-white/5 p-4'
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <p className='font-semibold text-white'>
                            {item.title}
                          </p>
                          <p className='text-xs text-slate-400'>
                            Added by {item.createdByName}
                          </p>
                        </div>
                        <Button
                          type='button'
                          size='sm'
                          variant='ghost'
                          onClick={() => removeHomeRecommendation(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                      {item.note ? (
                        <p className='mt-2 text-sm text-slate-300'>
                          {item.note}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card
            id='moderation-queue'
            className='border-white/10 bg-slate-950/85 text-white'
          >
            <CardContent className='space-y-4 p-5'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold'>Review queue</h2>
                <Badge variant='secondary'>{tickets.length}</Badge>
              </div>
              {tickets.length === 0 ? (
                <p className='rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300'>
                  Flag a review from the watchlist page to populate the
                  moderation queue.
                </p>
              ) : (
                <div className='space-y-3'>
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className='rounded-3xl border border-white/10 bg-white/5 p-4'
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <p className='font-semibold text-white'>
                            {ticket.movieName}
                          </p>
                          <p className='text-sm text-slate-400'>
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
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
