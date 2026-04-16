import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { MovieOrbitProvider } from '@/components/movie-orbit-state';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Movie Orbit',
  description: 'Online movie tracking and streaming recommendation platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className='min-h-full flex flex-col bg-background text-foreground'
      >
        <MovieOrbitProvider>
          <Navbar />
          <div className='flex-1'>{children}</div>
          <footer className='m-[2px] rounded-[1.5rem] border border-white/10 bg-slate-950/70 text-slate-300 backdrop-blur'>
            <div className='mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-6 lg:px-8'>
              <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
                <div className='space-y-3'>
                  <p className='text-sm font-semibold text-white'>
                    Movie Orbit
                  </p>
                  <p className='text-sm leading-6 text-slate-400'>
                    A streamlined movie tracking platform designed for
                    discovery, planning, and professional-quality
                    recommendations.
                  </p>
                </div>

                <div className='space-y-3'>
                  <p className='text-sm font-semibold uppercase tracking-[0.14em] text-slate-200'>
                    Product
                  </p>
                  <div className='space-y-2 text-sm'>
                    <Link
                      href='/browse'
                      className='block text-slate-400 transition hover:text-white'
                    >
                      Browse Movies
                    </Link>
                    <Link
                      href='/watchlist'
                      className='block text-slate-400 transition hover:text-white'
                    >
                      Watchlist
                    </Link>
                    <Link
                      href='/premium'
                      className='block text-slate-400 transition hover:text-white'
                    >
                      Plans
                    </Link>
                    <Link
                      href='/dashboard'
                      className='block text-slate-400 transition hover:text-white'
                    >
                      Dashboard
                    </Link>
                  </div>
                </div>

                <div className='space-y-3'>
                  <p className='text-sm font-semibold uppercase tracking-[0.14em] text-slate-200'>
                    Account
                  </p>
                  <div className='space-y-2 text-sm'>
                    <Link
                      href='/login'
                      className='block text-slate-400 transition hover:text-white'
                    >
                      Log in
                    </Link>
                    <Link
                      href='/signup'
                      className='block text-slate-400 transition hover:text-white'
                    >
                      Sign up
                    </Link>
                    <Link
                      href='/provider'
                      className='block text-slate-400 transition hover:text-white'
                    >
                      Provider Portal
                    </Link>
                    <Link
                      href='/admin'
                      className='block text-slate-400 transition hover:text-white'
                    >
                      Staff Workspace
                    </Link>
                  </div>
                </div>

                <div className='space-y-3'>
                  <p className='text-sm font-semibold uppercase tracking-[0.14em] text-slate-200'>
                    Legal
                  </p>
                  <div className='space-y-2 text-sm'>
                    <p className='text-slate-400'>Privacy & cookies</p>
                    <p className='text-slate-400'>Terms of service</p>
                    <p className='text-slate-400'>
                      Support: help@movieorbit.app
                    </p>
                  </div>
                </div>
              </div>

              <div className='mt-6 flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between'>
                <p>Copyright {currentYear} by Tanvin Adnan Turag</p>
              </div>
            </div>
          </footer>
        </MovieOrbitProvider>
      </body>
    </html>
  );
}
