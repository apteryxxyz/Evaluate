import '@/styles/tailwind.css';
import '@/styles/reset.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import type { LayoutProps } from '@/types';

const inter = Inter({ subsets: ['latin'] });

export default function Layout(p: LayoutProps) {
  return (
    <html lang="en" className={inter.className}>
      <body key="body" className="flex flex-col">
        <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur"></header>

        <main className="container flex-1 gap-6 py-10">{p.children}</main>

        <footer className="flex flex-shrink-0 flex-col items-center justify-center pb-8 text-foreground/30">
          <p>
            <Link href="/policies/privacy-policy">Privacy Policy</Link>
            <span className="mx-2">|</span>
            <Link href="/policies/terms-of-service">Terms of Service</Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
