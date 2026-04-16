'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Bell, Film, X } from 'lucide-react';

import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const {
    state,
    signOut,
    notifications,
    unreadNotificationCount,
    dismissNotification,
    clearNotifications,
    markNotificationsSeen,
  } = useMovieOrbitState();
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const isStaff = state.role === 'admin' || state.role === 'moderator';
  const navigation = [
    { href: '/browse', label: 'Browse' },
    { href: '/watchlist', label: 'My List' },
    { href: '/premium', label: 'Plans' },
    ...(state.isAuthenticated
      ? [{ href: '/dashboard', label: 'Dashboard' }]
      : []),
    ...(isStaff ? [{ href: '/admin', label: 'Staff' }] : []),
  ];

  function isActiveLink(href: string) {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function toggleNotifications() {
    const nextOpen = !notificationsOpen;
    setNotificationsOpen(nextOpen);

    if (nextOpen) {
      markNotificationsSeen();
    }
  }

  return (
    <header className='sticky top-3 z-30 mx-auto w-[calc(100%-1rem)] max-w-[1120px] rounded-full border border-white/10 bg-white/[0.06] text-white shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-3xl saturate-150'>
      <nav className='mx-auto flex w-full items-center justify-between gap-3 px-4 py-2 sm:px-5 lg:px-6'>
        <Link href='/' className='flex items-center gap-2.5 text-white'>
          <span className='flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-sm sm:h-10 sm:w-10'>
            <Film className='h-5 w-5' />
          </span>
          <div className='leading-tight'>
            <p className='text-sm font-semibold tracking-tight sm:text-base'>
              Movie Orbit
            </p>
            <p className='text-[11px] text-slate-300/80'>
              Streaming intelligence
            </p>
          </div>
        </Link>

        <div className='hidden items-center gap-1 rounded-full border border-white/10 bg-black/10 p-1 md:flex'>
          {navigation.map((item) => {
            const active = isActiveLink(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-sm transition',
                  active
                    ? 'bg-white/15 text-white'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className='flex items-center gap-2'>
          {state.isAuthenticated ? (
            <>
              <div className='relative'>
                <Button
                  type='button'
                  size='icon'
                  variant='ghost'
                  onClick={toggleNotifications}
                  aria-label='Open notifications'
                >
                  <Bell className='h-4 w-4' />
                </Button>
                {unreadNotificationCount > 0 ? (
                  <span className='absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-400 px-1 text-[10px] font-semibold text-slate-950'>
                    {unreadNotificationCount > 9
                      ? '9+'
                      : unreadNotificationCount}
                  </span>
                ) : null}

                {notificationsOpen ? (
                  <div className='absolute right-0 top-12 z-40 w-80 rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur'>
                    <div className='mb-2 flex items-center justify-between'>
                      <p className='text-sm font-semibold text-white'>
                        Notifications
                      </p>
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
                      <p className='rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300'>
                        No notifications right now.
                      </p>
                    ) : (
                      <div className='space-y-2'>
                        {notifications.slice(0, 4).map((item) => (
                          <div
                            key={item.id}
                            className='rounded-xl border border-white/10 bg-white/5 p-3'
                          >
                            <div className='mb-1 flex items-start justify-between gap-2'>
                              <p className='text-xs font-semibold text-white'>
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
                              onClick={() => setNotificationsOpen(false)}
                              className='mt-2 inline-flex text-xs text-cyan-200 transition hover:text-cyan-100'
                            >
                              {item.actionLabel}
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              <div className='hidden rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-200 lg:block'>
                {state.accountName} ·{' '}
                {state.plan === 'ad_free' ? 'Ad-free' : 'Free'}
              </div>
              <Button type='button' size='sm' variant='ghost' onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link
                href='/login'
                className='rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 sm:px-4'
              >
                Log in
              </Link>
              <Link
                href='/signup'
                className='rounded-full bg-white px-3 py-2 text-sm text-slate-950 transition hover:bg-slate-100 sm:px-4'
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className='mx-auto w-full max-w-[1120px] px-4 pb-3 sm:px-5 md:hidden'>
        <div className='flex gap-2 overflow-x-auto rounded-full border border-white/10 bg-black/10 p-1'>
          {navigation.map((item) => {
            const active = isActiveLink(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'shrink-0 rounded-full px-3.5 py-1.5 text-sm transition',
                  active
                    ? 'bg-white/15 text-white'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
