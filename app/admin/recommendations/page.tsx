'use client';

import Link from 'next/link';
import { useState } from 'react';

import { PageShell } from '@/components/page-shell';
import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function AdminRecommendationsPage() {
  const {
    state,
    homeRecommendations,
    addHomeRecommendation,
    removeHomeRecommendation,
  } = useMovieOrbitState();
  const isStaff = state.role === 'admin' || state.role === 'moderator';
  const [titleInput, setTitleInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  function handleAddRecommendation() {
    const result = addHomeRecommendation(titleInput, noteInput);
    setMessage(result.message);

    if (result.ok) {
      setTitleInput('');
      setNoteInput('');
    }
  }

  if (!state.isAuthenticated || !isStaff) {
    return (
      <PageShell
        eyebrow='Staff'
        title='Staff access required.'
        description='Only admin and moderator accounts can manage homepage recommendations.'
      >
        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-6'>
            <p className='text-sm text-slate-300'>
              Use a staff account to continue.
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
      title='Homepage recommendations'
      description='Add and manage staff picks shown on the homepage.'
    >
      <Card className='border-white/10 bg-slate-950/85 text-white'>
        <CardContent className='space-y-4 p-5'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Add recommendation</h2>
            <Badge variant='accent'>Dedicated page</Badge>
          </div>

          <label className='block space-y-2'>
            <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
              Movie title
            </span>
            <Input
              value={titleInput}
              onChange={(event) => setTitleInput(event.target.value)}
              placeholder='Movie title to feature on home'
            />
          </label>

          <label className='block space-y-2'>
            <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
              Curation note
            </span>
            <Textarea
              value={noteInput}
              onChange={(event) => setNoteInput(event.target.value)}
              placeholder='Reason this title should appear on homepage.'
            />
          </label>

          <Button type='button' variant='accent' onClick={handleAddRecommendation}>
            Add homepage recommendation
          </Button>

          {message ? <p className='text-sm text-slate-300'>{message}</p> : null}

          {homeRecommendations.length === 0 ? (
            <p className='rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300'>
              No staff picks yet.
            </p>
          ) : (
            <div className='space-y-3'>
              {homeRecommendations.map((item) => (
                <div
                  key={item.id}
                  className='rounded-2xl border border-white/10 bg-white/5 p-4'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <p className='font-semibold text-white'>{item.title}</p>
                      <p className='text-xs text-slate-400'>
                        Added by {item.createdByName}
                      </p>
                    </div>
                    <Button
                      type='button'
                      size='sm'
                      variant='ghost'
                      onClick={() => removeHomeRecommendation(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                  {item.note ? (
                    <p className='mt-2 text-sm text-slate-300'>{item.note}</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
