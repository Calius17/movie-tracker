import Link from 'next/link';
import { Film, Sparkles } from 'lucide-react';

export function Navbar() {
  return (
    <header className='sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur'>
      <nav className='mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8'>
        <Link
          href='/'
          className='flex items-center gap-2 text-slate-900 transition hover:text-sky-700'
        >
          <Film className='h-5 w-5' />
          <span className='text-lg font-semibold tracking-tight'>
            Movie Orbit
          </span>
        </Link>

        <div className='flex items-center gap-3 text-sm'>
          <span className='hidden text-slate-600 sm:inline'>
            Online Movie Tracker
          </span>
          <span className='inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 font-medium text-sky-800'>
            <Sparkles className='h-4 w-4' />
            Recommendations
          </span>
        </div>
      </nav>
    </header>
  );
}
