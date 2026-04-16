'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  MoonStar,
  Sparkles,
  Star,
} from 'lucide-react';

import { useMovieOrbitState } from '@/components/movie-orbit-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function PremiumPage() {
  const {
    state,
    recommendations,
    recommendationsLoading,
    favoriteGenres,
    purchaseAdFreePlan,
    prepareSignupPlan,
  } = useMovieOrbitState();
  const router = useRouter();
  const [payment, setPayment] = useState({
    cardholder: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const isAdFree = state.plan === 'ad_free';

  function onCheckout() {
    const result = purchaseAdFreePlan(payment);
    setCheckoutMessage(result.message);

    if (result.ok) {
      setPayment({ cardholder: '', cardNumber: '', expiry: '', cvv: '' });
    }
  }

  function startSignupWithPlan(plan: 'free' | 'ad_free') {
    const result =
      plan === 'ad_free'
        ? prepareSignupPlan('ad_free', payment)
        : prepareSignupPlan('free');

    setCheckoutMessage(result.message);
    if (!result.ok) {
      return;
    }

    router.push(`/signup?plan=${plan}`);
  }

  if (!state.isAuthenticated) {
    return (
      <main className='mx-auto flex w-full max-w-[1120px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8'>
        <section className='space-y-3'>
          <Badge className='rounded-full border border-cyan-300/25 bg-cyan-500/10 text-cyan-100'>
            Plans
          </Badge>
          <h1 className='text-2xl font-semibold tracking-tight text-white sm:text-3xl'>
            Pick a plan, then create your account.
          </h1>
          <p className='max-w-2xl text-sm leading-7 text-slate-300'>
            New users start here. Choose Free or Ad-free, then continue to
            signup with email and password.
          </p>
        </section>

        <section className='grid gap-5 lg:grid-cols-2'>
          <Card className='h-full border-white/10 bg-slate-950/80 text-white shadow-[0_18px_60px_rgba(0,0,0,0.22)]'>
            <CardContent className='flex h-full flex-col space-y-4 p-5'>
              <div className='flex items-center justify-between'>
                <h2 className='text-base font-semibold'>Free plan</h2>
                <Badge variant='secondary'>$0</Badge>
              </div>
              <p className='text-sm leading-6 text-slate-300'>
                Start with browsing, watchlist tracking, and basic
                recommendations.
              </p>
              <ul className='space-y-2 text-sm text-slate-300'>
                <li>- Movie discovery and watchlist tracking</li>
                <li>- Basic personalized recommendations</li>
                <li>- Standard workspace experience</li>
              </ul>
              <Button
                type='button'
                variant='outline'
                className='mt-auto px-4'
                onClick={() => startSignupWithPlan('free')}
              >
                Continue with Free
              </Button>
            </CardContent>
          </Card>

          <Card className='h-full border-cyan-300/20 bg-slate-950/80 text-white shadow-[0_18px_60px_rgba(6,182,212,0.1)]'>
            <CardContent className='flex h-full flex-col space-y-4 p-5'>
              <div className='flex items-center justify-between'>
                <h2 className='text-base font-semibold'>Ad-free plan</h2>
                <Badge variant='warning'>$7.99 / month</Badge>
              </div>
              <p className='text-sm leading-6 text-slate-300'>
                Enter payment details below. Demo mode accepts random card
                numbers.
              </p>
              <label className='block space-y-2'>
                <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                  Cardholder
                </span>
                <Input
                  value={payment.cardholder}
                  onChange={(event) =>
                    setPayment((current) => ({
                      ...current,
                      cardholder: event.target.value,
                    }))
                  }
                  placeholder='Name on card'
                />
              </label>
              <label className='block space-y-2'>
                <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                  Card number
                </span>
                <Input
                  value={payment.cardNumber}
                  onChange={(event) =>
                    setPayment((current) => ({
                      ...current,
                      cardNumber: event.target.value,
                    }))
                  }
                  placeholder='Random digits are accepted in demo'
                />
              </label>
              <div className='grid gap-3 sm:grid-cols-2'>
                <Input
                  value={payment.expiry}
                  onChange={(event) =>
                    setPayment((current) => ({
                      ...current,
                      expiry: event.target.value,
                    }))
                  }
                  placeholder='MM/YY'
                />
                <Input
                  value={payment.cvv}
                  onChange={(event) =>
                    setPayment((current) => ({
                      ...current,
                      cvv: event.target.value,
                    }))
                  }
                  placeholder='CVV'
                />
              </div>
              <Button
                type='button'
                variant='accent'
                className='mt-auto px-4'
                onClick={() => startSignupWithPlan('ad_free')}
              >
                <CreditCard className='h-4 w-4' />
                Pay and continue to signup
              </Button>
              {checkoutMessage ? (
                <p className='text-sm text-slate-300'>{checkoutMessage}</p>
              ) : null}
            </CardContent>
          </Card>
        </section>

        <div className='flex items-center gap-3 text-sm text-slate-300'>
          <span>Already have an account?</span>
          <Link
            href='/login'
            className='inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white transition hover:bg-white/10'
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className='mx-auto flex w-full max-w-[1120px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8'>
      <section className='space-y-3'>
        <Badge className='rounded-full border border-cyan-300/25 bg-cyan-500/10 text-cyan-100'>
          Plans
        </Badge>
        <h1 className='text-2xl font-semibold tracking-tight text-white sm:text-3xl'>
          Choose a plan that matches your movie workflow.
        </h1>
        <p className='max-w-2xl text-sm leading-7 text-slate-300'>
          Free keeps core tracking available, while ad-free unlocks cleaner
          presentation and richer recommendation cues.
        </p>
      </section>

      <div className='grid gap-5 lg:grid-cols-[0.95fr,1.05fr]'>
        <Card className='overflow-hidden border-fuchsia-300/30 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-sky-500 text-white shadow-[0_24px_80px_rgba(124,58,237,0.22)]'>
          <CardContent className='space-y-4 p-5'>
            <div className='flex items-center justify-between'>
              <Badge className='rounded-full bg-white/10 text-white'>
                <MoonStar className='mr-1 h-3.5 w-3.5' />
                {isAdFree ? 'Ad-free active' : 'Upgrade available'}
              </Badge>
              <Sparkles className='h-6 w-6 text-white/90' />
            </div>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Cleaner viewing with optional ad-free access.
            </h2>
            <p className='text-sm leading-6 text-white/90'>
              Your current plan:{' '}
              <span className='font-semibold'>
                {isAdFree ? 'Ad-free' : 'Free'}
              </span>
              . Upgrade when you want a cleaner recommendation experience.
            </p>
            <div className='grid gap-3 sm:grid-cols-2'>
              <div className='rounded-2xl bg-white/10 p-4'>
                <p className='text-xs uppercase tracking-[0.18em] text-white/70'>
                  Free plan
                </p>
                <p className='mt-2 text-base font-semibold'>
                  Watchlist + browse
                </p>
              </div>
              <div className='rounded-2xl bg-white/10 p-4'>
                <p className='text-xs uppercase tracking-[0.18em] text-white/70'>
                  Ad-free plan
                </p>
                <p className='mt-2 text-base font-semibold'>
                  No ads + richer picks
                </p>
              </div>
            </div>
            <div className='rounded-2xl border border-white/20 bg-black/20 p-4 text-sm'>
              <p className='font-medium'>Recommended for active users</p>
              <p className='mt-1 text-white/85'>
                Genre signals tracked: {favoriteGenres.length}. Recommendation
                pool: {recommendations.length}.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className='space-y-4'>
          <Card className='border-white/10 bg-slate-950/85 text-white shadow-[0_16px_50px_rgba(0,0,0,0.2)]'>
            <CardContent className='space-y-4 p-5'>
              <div className='flex items-center justify-between'>
                <h2 className='text-base font-semibold'>Upgrade to ad-free</h2>
                <Badge variant={isAdFree ? 'success' : 'warning'}>
                  {isAdFree ? 'Active' : '$7.99 / month'}
                </Badge>
              </div>
              {isAdFree ? (
                <p className='rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-4 text-sm text-emerald-100'>
                  <CheckCircle2 className='mr-2 inline h-4 w-4' />
                  Your ad-free plan is active.
                </p>
              ) : (
                <>
                  <label className='block space-y-2'>
                    <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                      Cardholder
                    </span>
                    <Input
                      value={payment.cardholder}
                      onChange={(event) =>
                        setPayment((current) => ({
                          ...current,
                          cardholder: event.target.value,
                        }))
                      }
                      placeholder='Name on card'
                    />
                  </label>
                  <label className='block space-y-2'>
                    <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                      Card number
                    </span>
                    <Input
                      value={payment.cardNumber}
                      onChange={(event) =>
                        setPayment((current) => ({
                          ...current,
                          cardNumber: event.target.value,
                        }))
                      }
                      placeholder='4242 4242 4242 4242'
                    />
                  </label>
                  <div className='grid gap-3 sm:grid-cols-2'>
                    <label className='space-y-2'>
                      <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                        Expiry
                      </span>
                      <Input
                        value={payment.expiry}
                        onChange={(event) =>
                          setPayment((current) => ({
                            ...current,
                            expiry: event.target.value,
                          }))
                        }
                        placeholder='MM/YY'
                      />
                    </label>
                    <label className='space-y-2'>
                      <span className='text-xs uppercase tracking-[0.18em] text-slate-400'>
                        CVV
                      </span>
                      <Input
                        value={payment.cvv}
                        onChange={(event) =>
                          setPayment((current) => ({
                            ...current,
                            cvv: event.target.value,
                          }))
                        }
                        placeholder='123'
                      />
                    </label>
                  </div>
                  <Button
                    type='button'
                    variant='accent'
                    className='px-4'
                    onClick={onCheckout}
                  >
                    <CreditCard className='h-4 w-4' />
                    Pay and activate ad-free
                  </Button>
                </>
              )}
              {checkoutMessage ? (
                <p className='text-sm text-slate-300'>{checkoutMessage}</p>
              ) : null}
            </CardContent>
          </Card>

          <Card className='border-white/10 bg-slate-950/85 text-white shadow-[0_16px_50px_rgba(0,0,0,0.2)]'>
            <CardContent className='space-y-4 p-5'>
              <div className='flex items-center justify-between'>
                <h2 className='text-base font-semibold'>Recommended next</h2>
                <Badge variant='secondary'>
                  {recommendationsLoading ? 'Loading' : 'Ready'}
                </Badge>
              </div>
              {recommendationsLoading ? (
                <p className='text-sm text-slate-300'>
                  Loading plan recommendations...
                </p>
              ) : recommendations.length === 0 ? (
                <p className='rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300'>
                  Add and rate a few movies first to unlock personalized picks.
                </p>
              ) : (
                <div className='grid gap-2 sm:grid-cols-2'>
                  {recommendations.map((movie) => (
                    <div
                      key={movie.id}
                      className='group w-full overflow-hidden rounded-2xl border border-cyan-300/20 bg-gradient-to-b from-slate-900 to-slate-950 shadow-[0_14px_32px_rgba(8,145,178,0.14)] transition hover:-translate-y-0.5 hover:border-cyan-200/35 hover:shadow-[0_20px_42px_rgba(8,145,178,0.2)]'
                    >
                      <div className='aspect-[3/4] bg-slate-900'>
                        {movie.posterPath ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                            alt={movie.title}
                            className='h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]'
                          />
                        ) : null}
                      </div>
                      <div className='space-y-2 p-3.5'>
                        <div className='flex items-center justify-between gap-3'>
                          <p className='font-semibold text-white'>
                            {movie.title}
                          </p>
                          <Badge className='border-cyan-300/30 bg-cyan-500/10 text-cyan-100'>
                            <Star className='mr-1 h-3.5 w-3.5 fill-current' />
                            {movie.rating.toFixed(1)}
                          </Badge>
                        </div>
                        <p className='text-xs text-slate-400'>
                          {movie.releaseDate || 'Unknown release date'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
