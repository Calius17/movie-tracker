'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Flag, ShieldCheck, Users } from 'lucide-react';

import { PageShell } from '@/components/page-shell';
import {
  type Role,
  useMovieOrbitState,
} from '@/components/movie-orbit-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminOverviewPage() {
  const {
    state,
    openTickets,
    homeRecommendations,
    managedAccounts,
    updateAccountRole,
  } = useMovieOrbitState();
  const isAdmin = state.role === 'admin';
  const [roleDrafts, setRoleDrafts] = useState<Record<string, Role>>({});
  const [roleMessage, setRoleMessage] = useState<string | null>(null);

  const accountsForRoleManagement = managedAccounts.filter(
    (account) => account.email !== state.email,
  );

  function handleRoleUpdate(email: string, currentRole: Role) {
    const selectedRole = roleDrafts[email] ?? currentRole;
    const result = updateAccountRole(email, selectedRole);
    setRoleMessage(result.message);

    if (result.ok) {
      setRoleDrafts((current) => {
        const next = { ...current };
        delete next[email];
        return next;
      });
    }
  }

  if (!state.isAuthenticated) {
    return (
      <PageShell
        eyebrow='Staff'
        title='Staff dashboard is restricted.'
        description='Log in with an admin account.'
      >
        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-6'>
            <p className='text-sm text-slate-300'>
              Sign in to view admin operations.
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

  if (!isAdmin) {
    return (
      <PageShell
        eyebrow='Admin'
        title='Admin access required.'
        description='Only admin accounts can view staff operations overview.'
      >
        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-6'>
            <p className='text-sm text-slate-300'>
              Switch to an admin account to continue.
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
      title='Staff operations overview'
      description='A focused summary of moderation workload and homepage curation status.'
    >
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {[
          { label: 'Open reports', value: openTickets, icon: Flag },
          {
            label: 'Homepage picks',
            value: homeRecommendations.length,
            icon: ShieldCheck,
          },
          { label: 'Current role', value: state.role, icon: Users },
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

      <div className='mt-5 flex flex-wrap gap-3'>
        <Badge variant='secondary'>Dedicated page</Badge>
        <Link
          href='/admin/queue'
          className='inline-flex h-10 items-center justify-center rounded-full border border-amber-300/30 bg-amber-500/10 px-4 text-sm text-amber-100 transition hover:bg-amber-500/20'
        >
          Open moderation queue
        </Link>
        <Link
          href='/admin/recommendations'
          className='inline-flex h-10 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-500/10 px-4 text-sm text-cyan-100 transition hover:bg-cyan-500/15'
        >
          Manage homepage recommendations
        </Link>
      </div>

      <Card
        id='role-management'
        className='mt-6 border-white/10 bg-slate-950/85 text-white'
      >
        <CardContent className='space-y-4 p-5'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Role management</h2>
            <Badge variant='accent'>Admin only</Badge>
          </div>

          <p className='text-sm text-slate-300'>
            Promote users to moderator, adjust staff roles, or move accounts
            back to user.
          </p>

          {roleMessage ? (
            <p className='rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200'>
              {roleMessage}
            </p>
          ) : null}

          {accountsForRoleManagement.length === 0 ? (
            <p className='rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300'>
              No additional accounts available for role updates.
            </p>
          ) : (
            <div className='space-y-3'>
              {accountsForRoleManagement.map((account) => {
                const selectedRole = roleDrafts[account.email] ?? account.role;

                return (
                  <div
                    key={account.id}
                    className='rounded-2xl border border-white/10 bg-white/5 p-4'
                  >
                    <div className='flex flex-wrap items-center justify-between gap-3'>
                      <div>
                        <p className='font-semibold text-white'>{account.name}</p>
                        <p className='text-xs text-slate-400'>{account.email}</p>
                      </div>
                      <Badge variant='secondary'>Current: {account.role}</Badge>
                    </div>

                    <div className='mt-3 flex flex-wrap items-center gap-3'>
                      <label className='text-xs uppercase tracking-[0.16em] text-slate-400'>
                        New role
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(event) =>
                          setRoleDrafts((current) => ({
                            ...current,
                            [account.email]: event.target.value as Role,
                          }))
                        }
                        className='h-10 min-w-[180px] rounded-xl border border-white/15 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-cyan-300/60'
                      >
                        <option value='user'>User</option>
                        <option value='moderator'>Moderator</option>
                        <option value='admin'>Admin</option>
                      </select>
                      <Button
                        type='button'
                        size='sm'
                        variant='accent'
                        onClick={() => handleRoleUpdate(account.email, account.role)}
                        disabled={selectedRole === account.role}
                      >
                        Update role
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
