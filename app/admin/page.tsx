'use client';

import Link from 'next/link';
import { Flag, ShieldCheck, Users } from 'lucide-react';

import { PageShell } from '@/components/page-shell';
import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminPage() {
  const { state, updateTicketStatus, openTickets } = useMovieOrbitState();
  const tickets = state.tickets;

  if (!state.isAuthenticated) {
    return (
      <PageShell
        eyebrow='Admin'
        title='Admin access is restricted.'
        description='Moderation tools stay behind authenticated admin accounts.'
      >
        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-6'>
            <p className='text-sm leading-7 text-slate-300'>
              Sign in with an admin account to manage reports and moderation.
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

  if (state.role !== 'admin') {
    return (
      <PageShell
        eyebrow='Admin'
        title='Admin access required.'
        description='Only accounts with admin access can open this moderation workspace.'
      >
        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-6'>
            <p className='text-sm leading-7 text-slate-300'>
              Switch to an admin account in your profile session to continue.
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
      eyebrow='Admin'
      title='Moderation, reports, and platform insight in one place.'
      description='Separate from the user flows so moderation work feels intentional instead of buried in a long scroll.'
    >
      <div className='grid gap-6 xl:grid-cols-[0.75fr,1.25fr]'>
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-1'>
          {[
            { label: 'Open reports', value: openTickets, icon: Flag },
            { label: 'Roles', value: '4', icon: Users },
            { label: 'Moderation focus', value: 'Reviews', icon: ShieldCheck },
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

        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-5'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>Review queue</h2>
              <Badge variant='secondary'>{tickets.length}</Badge>
            </div>
            {tickets.length === 0 ? (
              <p className='rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300'>
                Flag a review from the watchlist page to populate the moderation
                queue.
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
                        <p className='text-sm text-slate-400'>{ticket.issue}</p>
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
    </PageShell>
  );
}
