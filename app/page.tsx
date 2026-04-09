import { Flame } from 'lucide-react';

import { MovieRail, SpotlightHero } from '@/components/movie-gallery';
import { getHomeCollections } from '@/lib/tmdb-server';

export default async function Home() {
  const collections = await getHomeCollections();

  return (
    <main className='mx-auto flex w-full max-w-none flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10 2xl:px-14'>
      <section className='flex flex-wrap items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-200 backdrop-blur'>
        <span className='inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-sky-300'>
          <Flame className='h-3.5 w-3.5' />
          Trending now
        </span>
        <span className='text-slate-300'>
          Professional movie tracking with TMDB banners, separate pages, and a
          responsive media layout.
        </span>
      </section>

      <SpotlightHero movie={collections.spotlight} />

      <section className='space-y-8'>
        <MovieRail
          title='Trending Now'
          subtitle='The most active titles right now, shown in a responsive shelf for desktop and mobile.'
          movies={collections.trending}
          href='/browse'
        />
        <MovieRail
          title='Now Playing'
          subtitle='Current releases that make the homepage feel alive and curated.'
          movies={collections.nowPlaying}
          href='/browse'
        />
        <MovieRail
          title='Recommended Picks'
          subtitle='A clean recommendation rail powered by TMDB popular titles and your viewing patterns.'
          movies={collections.recommended}
          href='/premium'
        />
        <MovieRail
          title='Upcoming'
          subtitle='What is coming soon, with banner imagery and quick release context.'
          movies={collections.upcoming}
          href='/browse'
        />
      </section>
    </main>
  );
}
