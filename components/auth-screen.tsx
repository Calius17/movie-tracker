'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogIn, Sparkles } from 'lucide-react';

import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type AuthScreenProps = {
  mode: 'login' | 'signup';
  selectedPlan?: 'free' | 'ad_free' | null;
};

export function AuthScreen({ mode, selectedPlan = null }: AuthScreenProps) {
  const router = useRouter();
  const { signIn, registerUser } = useMovieOrbitState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasValidOnboardingPlan =
    selectedPlan === 'free' || selectedPlan === 'ad_free';
  const plan = selectedPlan === 'ad_free' ? 'ad_free' : 'free';

  function onSubmit() {
    if (mode === 'signup') {
      const result = registerUser({
        name,
        email,
        password,
        plan,
      });

      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }

      setErrorMessage(null);
      router.push('/dashboard');
      return;
    }

    const result = signIn(email, password);
    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }

    setErrorMessage(null);
    router.push('/dashboard');
  }

  return (
    <main className='mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-6 sm:px-6 lg:px-8'>
      <div className='grid w-full items-start gap-4 md:grid-cols-[0.85fr_1fr]'>
        <section className='space-y-4 rounded-[1.35rem] border border-white/10 bg-slate-950/80 p-5 text-white shadow-[0_16px_50px_rgba(0,0,0,0.3)] sm:p-6'>
          <div className='space-y-4'>
            <Badge className='rounded-full bg-white/10 text-white'>
              <Sparkles className='mr-1 h-3.5 w-3.5' />
              Movie Orbit access
            </Badge>
            <div className='space-y-2'>
              <h1 className='text-3xl font-semibold tracking-tight text-white'>
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className='text-sm leading-6 text-slate-300'>
                {mode === 'login'
                  ? 'Sign in to keep your watchlist, plans, provider tools, and moderation workspace in one account.'
                  : 'Create a workspace account. Access is assigned automatically.'}
              </p>
            </div>
            <div className='space-y-2 text-sm text-slate-300'>
              <p className='font-medium text-white'>Assigned access</p>
              <p>
                Your account determines which areas you can open while the
                interface stays focused and uncluttered.
              </p>
              <p className='text-slate-400'>
                {mode === 'signup'
                  ? 'Select your plan first, then complete signup.'
                  : 'Sign in with email and password to continue.'}
              </p>
            </div>
            {mode === 'login' ? (
              <div className='rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-slate-300'>
                Demo staff logins: admin@movieorbit.app / Admin123!,
                moderator@movieorbit.app / Moderator123!,
                provider@movieorbit.app / Provider123!
              </div>
            ) : null}
          </div>
        </section>

        <Card className='border-white/10 bg-slate-950/85 text-white shadow-[0_20px_80px_rgba(0,0,0,0.35)]'>
          <CardContent className='mx-auto w-full max-w-md space-y-4 p-5 sm:p-6'>
            <div className='space-y-2'>
              <h2 className='text-2xl font-semibold'>
                {mode === 'login' ? 'Sign in' : 'Sign up'}
              </h2>
              <p className='text-sm text-slate-300'>
                Local demo authentication with plans, role-based dashboards, and
                email/password login.
              </p>
            </div>

            {mode === 'signup' ? (
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
            ) : null}

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

            <label className='block space-y-2'>
              <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                Password
              </span>
              <Input
                type='password'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder='Minimum 6 characters'
              />
            </label>

            {mode === 'signup' ? (
              <label className='block space-y-2'>
                <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                  Selected plan
                </span>
                <div className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white'>
                  {plan === 'ad_free'
                    ? 'Ad-free plan ($7.99/month)'
                    : 'Free plan'}
                </div>
              </label>
            ) : null}

            {mode === 'signup' && !hasValidOnboardingPlan ? (
              <div className='rounded-2xl border border-amber-300/30 bg-amber-500/10 p-4 text-sm text-amber-100'>
                Choose a plan first, then return to signup.
                <div className='mt-3'>
                  <Link
                    href='/premium'
                    className='inline-flex h-10 items-center justify-center rounded-full border border-amber-200/30 bg-amber-500/20 px-4 text-xs font-medium text-amber-100 transition hover:bg-amber-500/30'
                  >
                    Go to plans
                  </Link>
                </div>
              </div>
            ) : null}

            {errorMessage ? (
              <p className='rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100'>
                {errorMessage}
              </p>
            ) : null}

            <Button
              type='button'
              variant='accent'
              className='px-6'
              disabled={mode === 'signup' && !hasValidOnboardingPlan}
              onClick={onSubmit}
            >
              <LogIn className='h-4 w-4' />
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>

            <p className='text-xs leading-6 text-slate-400'>
              Demo mode stores account records locally. Email and password are
              required for signup and login.
            </p>

            <p className='text-xs text-slate-500'>
              {mode === 'login'
                ? 'Need a new account? Choose a plan first on Plans, then sign up.'
                : 'Already have an account? Use Log in from the top navigation.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
