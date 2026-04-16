'use client';

import Link from 'next/link';
import { Link2, PlusCircle } from 'lucide-react';

import { PageShell } from '@/components/page-shell';
import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ProviderPage() {
  const { state, providerDraft, setProviderDraft, submitProviderLink } =
    useMovieOrbitState();

  if (!state.isAuthenticated) {
    return (
      <PageShell
        eyebrow='Provider'
        title='Sign in to manage streaming availability.'
        description='Provider tools are available to authenticated partner accounts only.'
      >
        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-6'>
            <p className='text-sm leading-7 text-slate-300'>
              Log in with a provider account to save streaming links and notes.
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

  if (state.role !== 'provider') {
    return (
      <PageShell
        eyebrow='Provider'
        title='Provider access required.'
        description='Only accounts with provider access can edit availability links.'
      >
        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='space-y-4 p-6'>
            <p className='text-sm leading-7 text-slate-300'>
              Switch to a provider account in your profile session to continue.
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

  return (
    <PageShell
      eyebrow='Provider'
      title='Manage where each movie can be watched.'
      description='A dedicated provider screen for streaming availability links, link notes, and a cleaner workflow for content partners.'
    >
      <div className='grid gap-6 xl:grid-cols-[0.9fr,1.1fr]'>
        <Card className='border-white/10 bg-slate-950/85 text-white'>
          <CardContent className='mx-auto w-full max-w-md space-y-4 p-5'>
            <div className='flex items-center gap-2'>
              <Badge variant='accent'>
                <PlusCircle className='mr-1 h-3.5 w-3.5' />
                Add link
              </Badge>
            </div>
            <Input
              value={providerDraft.movieName}
              onChange={(event) =>
                setProviderDraft((current) => ({
                  ...current,
                  movieName: event.target.value,
                }))
              }
              placeholder='Movie name'
            />
            <Input
              value={providerDraft.platform}
              onChange={(event) =>
                setProviderDraft((current) => ({
                  ...current,
                  platform: event.target.value,
                }))
              }
              placeholder='Platform name'
            />
            <Input
              value={providerDraft.url}
              onChange={(event) =>
                setProviderDraft((current) => ({
                  ...current,
                  url: event.target.value,
                }))
              }
              placeholder='Streaming URL'
            />
            <Textarea
              value={providerDraft.notes}
              onChange={(event) =>
                setProviderDraft((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              placeholder='Notes about region, availability, or pricing'
            />
            <Button type='button' className='px-5' onClick={submitProviderLink}>
              Save link
            </Button>
          </CardContent>
        </Card>

        <div className='space-y-4'>
          {state.providerLinks.length === 0 ? (
            <Card className='border-white/10 bg-slate-950/85 text-white'>
              <CardContent className='p-6 text-sm text-slate-300'>
                No availability links yet. Use the form to save a movie
                destination.
              </CardContent>
            </Card>
          ) : (
            state.providerLinks.map((link) => (
              <Card
                key={link.id}
                className='border-white/10 bg-slate-950/85 text-white'
              >
                <CardContent className='space-y-3 p-5'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <p className='font-semibold text-white'>
                        {link.movieName}
                      </p>
                      <p className='text-sm text-slate-400'>{link.platform}</p>
                    </div>
                    <Link2 className='h-4 w-4 text-slate-400' />
                  </div>
                  <p className='break-all text-sm text-cyan-300'>{link.url}</p>
                  {link.notes ? (
                    <p className='text-sm text-slate-300'>{link.notes}</p>
                  ) : null}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </PageShell>
  );
}
