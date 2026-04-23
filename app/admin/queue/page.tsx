'use client';

import Link from 'next/link';

import { PageShell } from '@/components/page-shell';
import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminQueuePage() {
  const { state, updateTicketStatus } = useMovieOrbitState();
  const isStaff = state.role === 'admin' || state.role === 'moderator';
  const tickets = state.tickets;

  if (!state.isAuthenticated || !isStaff) {
    return (
      <PageShell
        eyebrow='Staff'
        title='Staff access required.'
        description='Only admin and moderator accounts can view the moderation queue.'
      >
        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-6'>
            <p className='text-sm text-slate-300'>
              Use a staff account to continue.
            </p>
            <Link
              href='/dashboard'
              className='inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-slate-950 transition hover:bg-slate-100'
            >
              Back to dashboard
            </Link>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow='Staff'
      title='Moderation queue'
      description='Review and resolve flagged content in a dedicated queue workspace.'
    >
      <Card className='border-white/10 bg-slate-950/85 text-white'>
        <CardContent className='space-y-4 p-5'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Review queue</h2>
            <Badge variant='secondary'>{tickets.length}</Badge>
          </div>

          {tickets.length === 0 ? (
            <p className='rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300'>
              Flag a review from the watchlist page to populate the moderation queue.
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
                      <p className='font-semibold text-white'>{ticket.movieName}</p>
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
                      onClick={() => updateTicketStatus(ticket.id, 'in_progress')}
                    >
                      Mark working
                    </Button>
                    <Button
                      type='button'
                      size='sm'
                      variant='outline'
                      onClick={() => updateTicketStatus(ticket.id, 'resolved')}
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
    </PageShell>
  );
}
