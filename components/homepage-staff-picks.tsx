'use client';

import { Sparkles } from 'lucide-react';

import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(new Date(timestamp));
}

export function HomepageStaffPicks() {
  const { homeRecommendations } = useMovieOrbitState();

  if (!homeRecommendations.length) {
    return null;
  }

  return (
    <section id='staff-picks' className='space-y-4'>
      <div className='flex items-end justify-between gap-3'>
        <div>
          <h2 className='text-xl font-semibold tracking-tight text-white sm:text-2xl'>
            Staff Picks
          </h2>
          <p className='mt-1 text-sm leading-6 text-slate-400'>
            Curated homepage recommendations added by admin and moderation
            staff.
          </p>
        </div>
        <Badge className='rounded-full border border-cyan-300/20 bg-cyan-500/10 text-cyan-100'>
          <Sparkles className='mr-1 h-3.5 w-3.5' />
          Curated
        </Badge>
      </div>

      <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
        {homeRecommendations.slice(0, 6).map((item) => (
          <Card
            key={item.id}
            className='border-white/10 bg-slate-950/80 text-white shadow-[0_14px_44px_rgba(0,0,0,0.22)]'
          >
            <CardContent className='space-y-3 p-4'>
              <div className='flex items-start justify-between gap-3'>
                <p className='font-semibold text-white'>{item.title}</p>
                <span className='text-xs text-slate-400'>
                  {formatDate(item.createdAt)}
                </span>
              </div>
              {item.note ? (
                <p className='text-sm leading-6 text-slate-300'>{item.note}</p>
              ) : (
                <p className='text-sm text-slate-400'>
                  Featured by staff for this week.
                </p>
              )}
              <p className='text-xs text-slate-500'>
                Added by {item.createdByName}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
