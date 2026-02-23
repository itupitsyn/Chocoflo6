import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { AuthProtection } from '@/components/auth-protection';
import { TgProvider } from '@/components/tg-provider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils/cn';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Chocoflo6',
  description: 'Клубника в шоколаде Химки',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(geistSans.variable, geistMono.variable, 'min-w-[300px]')}>
        <TgProvider>
          <AuthProtection>{children}</AuthProtection>
          <Toaster />
        </TgProvider>
      </body>
    </html>
  );
}
