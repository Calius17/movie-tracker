'use client';

import Link from 'next/link';
import { BarChart3, Crown, ShieldCheck, Star, UserCircle2 } from 'lucide-react';

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
  } = useMovieOrbitState();
  const isStaff = state.role === 'admin' || state.role === 'moderator';

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
        </div>
      </div>
    </PageShell>
  );
}
