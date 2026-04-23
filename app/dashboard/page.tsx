'use client';

import Link from 'next/link';
import {
  BellRing,
  ClipboardList,
  Clapperboard,
  BarChart3,
  Crown,
  ShieldCheck,
  Star,
  UserCircle2,
  Users,
  X,
} from 'lucide-react';

import { PageShell } from '@/components/page-shell';
import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const {
    state,
    watchedCount,
    watchingCount,
    planCount,
    averageRating,
    recommendations,
    watchParties,
    notifications,
    dismissNotification,
    clearNotifications,
    homeRecommendations,
    openTickets,
  } = useMovieOrbitState();
  const isStaff = state.role === 'admin' || state.role === 'moderator';
  const isAdmin = state.role === 'admin';
  const activePartyCount = watchParties.filter(
    (party) => party.hostEmail === state.email && party.status !== 'ended',
  ).length;

  if (!state.isAuthenticated) {
    return (
      <PageShell
        eyebrow='Dashboard'
        title='Sign in to access your dashboard.'
        description='Your personal movie tracking dashboard is available once you log in.'
      >
        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-6'>
            <p className='text-sm leading-7 text-slate-300'>
              Log in to view your stats, plans, and quick actions.
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

  return (
    <PageShell
      eyebrow='Dashboard'
      title={`Welcome, ${state.accountName}`}
      description='A clean control center for your movie activity, plan status, and quick navigation.'
    >
      {isStaff ? (
        <div className='grid gap-6 xl:grid-cols-[1.1fr,0.9fr]'>
          <div className='space-y-4'>
            <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
              {[
                {
                  label: 'Open reports',
                  value: openTickets,
                  icon: ClipboardList,
                },
                {
                  label: 'Homepage picks',
                  value: homeRecommendations.length,
                  icon: Clapperboard,
                },
                { label: 'Staff role', value: state.role, icon: Users },
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
                  <h2 className='text-lg font-semibold'>Quick actions</h2>
                  <Badge variant='secondary'>Staff workflow</Badge>
                </div>
                <div className='grid gap-3 sm:grid-cols-2'>
                  <Link
                    href='/admin/recommendations'
                    className='rounded-2xl border border-cyan-300/25 bg-cyan-500/10 p-4 text-sm text-cyan-100 transition hover:bg-cyan-500/15'
                  >
                    Manage homepage recommendations
                  </Link>
                  <Link
                    href='/admin/queue'
                    className='rounded-2xl border border-amber-300/30 bg-amber-500/10 p-4 text-sm text-amber-100 transition hover:bg-amber-500/20'
                  >
                    Open moderation queue
                  </Link>
                  {isAdmin ? (
                    <Link
                      href='/admin/overview'
                      className='rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 transition hover:bg-white/10'
                    >
                      View staff operations overview
                    </Link>
                  ) : null}
                  {isAdmin ? (
                    <Link
                      href='/admin/overview#role-management'
                      className='rounded-2xl border border-emerald-300/25 bg-emerald-500/10 p-4 text-sm text-emerald-100 transition hover:bg-emerald-500/15'
                    >
                      Manage user and staff roles
                    </Link>
                  ) : null}
                  <Link
                    href='/#staff-picks'
                    className='rounded-2xl border border-indigo-300/25 bg-indigo-500/10 p-4 text-sm text-indigo-100 transition hover:bg-indigo-500/15'
                  >
                    Preview homepage staff picks
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-4'>
            <Card className='overflow-hidden border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white'>
              <CardContent className='space-y-3 p-5'>
                <p className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                  Account overview
                </p>
                <p className='text-xl font-semibold'>{state.email}</p>
                <p className='text-sm text-slate-300'>
                  Role:{' '}
                  <span className='font-medium text-white'>{state.role}</span>
                </p>
                <p className='text-sm text-slate-300'>
                  Plan:{' '}
                  <span className='font-medium text-white'>
                    {state.plan === 'ad_free' ? 'Ad-free' : 'Free'}
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card className='border-white/10 bg-slate-950/85 text-white'>
              <CardContent className='space-y-3 p-5'>
                <div className='flex items-center justify-between'>
                  <p className='font-semibold'>Recommendation status</p>
                  <ShieldCheck className='h-4 w-4 text-cyan-300' />
                </div>
                <p className='text-sm text-slate-300'>
                  Active picks available: {recommendations.length}
                </p>
                <p className='text-xs text-slate-400'>
                  Staff picks can be managed in the Staff workspace.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className='grid gap-6 xl:grid-cols-[1.15fr,0.85fr]'>
          <div className='space-y-4'>
            <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
              {[
                { label: 'Watching', value: watchingCount, icon: Star },
                { label: 'Watched', value: watchedCount, icon: BarChart3 },
                { label: 'Plan to watch', value: planCount, icon: UserCircle2 },
                {
                  label: 'Avg rating',
                  value: averageRating.toFixed(1),
                  icon: Crown,
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

            <Card className='border-white/10 bg-slate-950/85 text-white'>
              <CardContent className='space-y-4 p-5'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-lg font-semibold'>Quick actions</h2>
                  <Badge variant='secondary'>Professional flow</Badge>
                </div>
                <div className='grid gap-3 sm:grid-cols-2'>
                  <Link
                    href='/browse'
                    className='rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 transition hover:bg-white/10'
                  >
                    Browse movies and add to watchlist
                  </Link>
                  <Link
                    href='/watchlist'
                    className='rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 transition hover:bg-white/10'
                  >
                    Update ratings and reviews
                  </Link>
                  <Link
                    href='/premium'
                    className='rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 transition hover:bg-white/10'
                  >
                    Manage plan and ad-free access
                  </Link>
                  <Link
                    href='/party'
                    className='rounded-2xl border border-cyan-300/20 bg-cyan-500/10 p-4 text-sm text-cyan-100 transition hover:bg-cyan-500/15'
                  >
                    Start or join a watch party
                  </Link>
                  {isStaff ? (
                    <Link
                      href='/admin'
                      className='rounded-2xl border border-amber-300/30 bg-amber-500/10 p-4 text-sm text-amber-100 transition hover:bg-amber-500/20'
                    >
                      Open staff dashboard
                    </Link>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-4'>
            <Card className='overflow-hidden border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white'>
              <CardContent className='space-y-3 p-5'>
                <p className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                  Account overview
                </p>
                <p className='text-xl font-semibold'>{state.email}</p>
                <p className='text-sm text-slate-300'>
                  Role:{' '}
                  <span className='font-medium text-white'>{state.role}</span>
                </p>
                <p className='text-sm text-slate-300'>
                  Plan:{' '}
                  <span className='font-medium text-white'>
                    {state.plan === 'ad_free' ? 'Ad-free' : 'Free'}
                  </span>
                </p>
                <p className='text-sm text-slate-300'>
                  Watch parties:{' '}
                  <span className='font-medium text-white'>
                    {activePartyCount}
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card className='border-white/10 bg-slate-950/85 text-white'>
              <CardContent className='space-y-3 p-5'>
                <div className='flex items-center justify-between'>
                  <p className='font-semibold'>Recommendation status</p>
                  <ShieldCheck className='h-4 w-4 text-cyan-300' />
                </div>
                <p className='text-sm text-slate-300'>
                  Active picks available: {recommendations.length}
                </p>
                <p className='text-xs text-slate-400'>
                  Your recommendation quality improves as you rate more titles.
                </p>
              </CardContent>
            </Card>

            <Card className='border-white/10 bg-slate-950/85 text-white'>
              <CardContent className='space-y-3 p-5'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <p className='font-semibold'>Notifications</p>
                    <BellRing className='h-4 w-4 text-cyan-300' />
                  </div>
                  {notifications.length > 0 ? (
                    <button
                      type='button'
                      onClick={clearNotifications}
                      className='text-xs text-slate-300 transition hover:text-white'
                    >
                      Clear all
                    </button>
                  ) : null}
                </div>

                {notifications.length === 0 ? (
                  <p className='rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300'>
                    You are all caught up.
                  </p>
                ) : (
                  <div className='space-y-2'>
                    {notifications.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className='rounded-2xl border border-white/10 bg-white/5 p-3'
                      >
                        <div className='mb-1 flex items-start justify-between gap-2'>
                          <p className='text-sm font-medium text-white'>
                            {item.title}
                          </p>
                          <button
                            type='button'
                            onClick={() => dismissNotification(item.id)}
                            className='text-slate-400 transition hover:text-white'
                            aria-label='Dismiss notification'
                          >
                            <X className='h-3.5 w-3.5' />
                          </button>
                        </div>
                        <p className='text-xs leading-5 text-slate-300'>
                          {item.message}
                        </p>
                        <Link
                          href={item.actionHref}
                          className='mt-2 inline-flex h-8 items-center justify-center rounded-full border border-white/15 bg-white/5 px-3 text-xs text-slate-100 transition hover:bg-white/10'
                        >
                          {item.actionLabel}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </PageShell>
  );
}
