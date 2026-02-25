import './globals.css';
import { BottomNav } from '@/components/BottomNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CRM Lite MVP',
  description: 'Mobile-first classroom CRM built with Next.js + Supabase'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen max-w-4xl pb-24 md:px-6 md:pb-8">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
