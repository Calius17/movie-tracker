'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogIn, Sparkles } from 'lucide-react';

import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function AuthScreen({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const { signIn } = useMovieOrbitState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <main className='mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-10 sm:px-6 lg:px-8'>
      <div className='grid w-full gap-6 lg:grid-cols-[0.95fr,1.05fr]'>
        <Card className='border-white/10 bg-slate-950/90 text-white shadow-[0_20px_80px_rgba(0,0,0,0.45)]'>
          <CardContent className='space-y-5 p-6 sm:p-8'>
            <Badge className='rounded-full bg-white/10 text-white'>
              <Sparkles className='mr-1 h-3.5 w-3.5' />
              Movie Orbit access
            </Badge>
            <div className='space-y-3'>
              <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className='text-sm leading-7 text-slate-300'>
                {mode === 'login'
                  ? 'Sign in to keep your watchlist, premium picks, provider tools, and moderation access in one workspace.'
                  : 'Create a workspace account. Access is assigned to your account, not chosen from a public role picker.'}
              </p>
            </div>
            <div className='rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300'>
              <p className='font-medium text-white'>Assigned access</p>
              <p className='mt-2'>
                Your account determines which areas you can open. Access is
                assigned behind the scenes so the interface stays clean and
                focused.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/10 bg-slate-950/85 text-white shadow-[0_20px_80px_rgba(0,0,0,0.35)]'>
          <CardContent className='space-y-4 p-6 sm:p-8'>
            <div className='space-y-2'>
              <h2 className='text-2xl font-semibold'>
                {mode === 'login' ? 'Sign in' : 'Sign up'}
              </h2>
              <p className='text-sm text-slate-300'>
                This demo stores the session locally so you can move through the
                app like a SaaS product without exposing access controls in the
                UI.
              </p>
            </div>

            <label className='block space-y-2'>
              <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                Display name
              </span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder='Your name'
              />
            </label>

            <label className='block space-y-2'>
              <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                Email
              </span>
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder='name@domain.com'
              />
            </label>

            <Button
              type='button'
              variant='accent'
              className='w-full'
              onClick={() => {
                signIn(name, email);
                router.push('/');
              }}
            >
              <LogIn className='h-4 w-4' />
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>

            <p className='text-xs leading-6 text-slate-400'>
              For now this is a local session demo. Account access is inferred
              from the signed-in email so the UI stays clean while still
              supporting assigned access.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
