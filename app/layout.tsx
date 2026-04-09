import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';

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
      <body className='min-h-full flex flex-col bg-background text-foreground'>
        <Navbar />
        <div className='flex-1'>{children}</div>
        <footer className='border-t border-white/10 bg-slate-950/80 px-4 py-4 text-center text-sm text-slate-300 backdrop-blur sm:px-6 lg:px-8'>
          Copyright {currentYear} by Tanvin Adnan Turag
        </footer>
      </body>
    </html>
  );
}
