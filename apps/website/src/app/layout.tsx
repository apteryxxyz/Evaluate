import { Toaster } from '@evaluate/components/toast';
import { Inter } from 'next/font/google';
import { twMerge as cn } from 'tailwind-merge';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { BodyProviders, HtmlProviders } from '~/components/providers';
import type { LayoutProps } from '../types';
import { generateBaseMetadata } from './metadata';
import '../styles.css';

const inter = Inter({ subsets: ['latin'] });

export function generateMetadata() {
  return generateBaseMetadata('/');
}

export default function RootLayout(p: LayoutProps) {
  return (
    <HtmlProviders>
      <html key="html" lang="en" className="dark">
        <head key="head">
          <meta name="evaluate-extension" content="disabled" />
          <meta name="darkreader-lock" />
          <meta
            name="google-adsense-account"
            content="ca-pub-5722227635911083"
          />
          <meta name="theme-color" content="#2fc186" />
          <link rel="icon" type="image/png" href="/favicon.ico" />
        </head>

        <body
          key="body"
          className={cn(
            inter.className,
            'flex min-h-screen flex-col overflow-y-scroll',
          )}
        >
          <BodyProviders>
            <Header />
            <main className="flex-1">{p.children}</main>
            <Footer />
            <Toaster />
          </BodyProviders>
        </body>
      </html>
    </HtmlProviders>
  );
}
