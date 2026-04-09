'use client';

import Link from 'next/link';
import { Film } from 'lucide-react';

import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Button } from '@/components/ui/button';

const navigation = [
  { href: '/browse', label: 'Browse' },
  { href: '/watchlist', label: 'My List' },
];

export function Navbar() {
  const { state, signOut } = useMovieOrbitState();

  return (
    <header className='sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 text-white backdrop-blur-xl'>
      <nav className='grid w-full grid-cols-[auto,1fr,auto] items-center gap-2 px-3 py-3 sm:px-4 lg:px-6 xl:px-8'>
        <Link
          href='/'
          className='col-start-1 flex items-center gap-3 justify-self-start text-white transition hover:opacity-90'
        >
          <span className='flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/25 sm:h-10 sm:w-10'>
            <Film className='h-5 w-5' />
          </span>
          <span className='text-base font-semibold tracking-tight sm:text-lg'>
            Movie Orbit
          </span>
        </Link>

        <div className='col-start-2 hidden min-w-0 items-center justify-center gap-2 overflow-x-auto px-3 text-sm lg:flex'>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-200 transition hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white'
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className='col-start-3 flex items-center gap-2 justify-self-end'>
          {state.isAuthenticated ? (
            <Button type='button' size='sm' variant='outline' onClick={signOut}>
              Sign out
            </Button>
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
    </header>
  );
}
