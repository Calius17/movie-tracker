import Link from 'next/link';
import { ArrowRight, Play, TrendingUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const featured = [
  {
    title: 'Dune: Part Two',
    genre: 'Sci-Fi epic',
    year: '2024',
    accent: 'from-amber-500 via-orange-500 to-rose-500',
  },
  {
    title: 'Oppenheimer',
    genre: 'Biography / Drama',
    year: '2023',
    accent: 'from-slate-700 via-slate-900 to-sky-800',
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    genre: 'Animation / Adventure',
    year: '2023',
    accent: 'from-fuchsia-600 via-pink-500 to-cyan-500',
  },
];

export function HeroCarousel() {
  return (
    <section className='grid gap-4 lg:grid-cols-[1.25fr,0.75fr]'>
      <Card className='overflow-hidden border-slate-900/10 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]'>
        <div className='relative min-h-[360px] overflow-hidden p-6 sm:p-8'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.24),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(217,70,239,0.18),transparent_28%)]' />
          <div className='relative flex h-full flex-col justify-between gap-10'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge className='rounded-full bg-white/10 text-white'>
                <TrendingUp className='mr-1 h-3.5 w-3.5' />
                Trending now
              </Badge>
              <Badge className='rounded-full bg-white/10 text-white'>
                Netflix-style layout
              </Badge>
            </div>

            <div className='max-w-2xl space-y-4'>
              <h2 className='text-4xl font-semibold tracking-tight sm:text-5xl'>
                Discover, save, and organize movies with a cleaner streaming-app
                feel.
              </h2>
              <p className='max-w-xl text-sm leading-7 text-slate-300 sm:text-base'>
                A more cinematic layout with dedicated pages for browsing,
                watchlists, premium recommendations, and admin moderation.
              </p>
              <div className='flex flex-wrap gap-3'>
                <Link
                  href='/browse'
                  className='inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-6 text-sm font-medium text-white shadow-lg shadow-sky-500/30 transition hover:opacity-95'
                >
                  Browse TMDB
                  <ArrowRight className='h-4 w-4' />
                </Link>
                <Link
                  href='/watchlist'
                  className='inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-medium text-white transition hover:bg-white/10'
                >
                  <Play className='h-4 w-4' />
                  Open watchlist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className='grid gap-4 sm:grid-cols-3 lg:grid-cols-1'>
        {featured.map((item) => (
          <Card
            key={item.title}
            className={`overflow-hidden border-white/70 bg-gradient-to-br ${item.accent} text-white shadow-[0_20px_50px_rgba(15,23,42,0.20)]`}
          >
            <div className='flex h-full min-h-[114px] flex-col justify-between p-5'>
              <div>
                <p className='text-xs uppercase tracking-[0.18em] text-white/80'>
                  Featured
                </p>
                <h3 className='mt-2 text-lg font-semibold'>{item.title}</h3>
                <p className='mt-1 text-sm text-white/80'>{item.genre}</p>
              </div>
              <div className='flex items-center justify-between text-xs text-white/80'>
                <span>{item.year}</span>
                <span className='inline-flex items-center gap-1'>
                  <Play className='h-3.5 w-3.5' />
                  watch later
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
