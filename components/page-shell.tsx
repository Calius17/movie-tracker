import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
};

export function PageShell({
  eyebrow,
  title,
  description,
  action,
  children,
}: PageShellProps) {
  return (
    <main className='mx-auto flex w-full max-w-none flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10 2xl:px-14'>
      <Card className='overflow-hidden border-white/10 bg-slate-950/80 text-white shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl'>
        <CardContent className='grid gap-6 p-6 lg:grid-cols-[minmax(0,1.1fr),minmax(280px,0.9fr)] lg:items-center lg:p-8'>
          <div className='space-y-4'>
            <Badge variant='accent' className='rounded-full px-3 py-1'>
              {eyebrow}
            </Badge>
            <div className='space-y-2'>
              <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
                {title}
              </h1>
              <p className='max-w-2xl text-sm leading-6 text-slate-300 sm:text-base'>
                {description}
              </p>
            </div>
          </div>
          {action ? <div className='lg:justify-self-end'>{action}</div> : null}
        </CardContent>
      </Card>
      {children}
    </main>
  );
}
