import { Inter } from 'next/font/google';
import { GoogleAnalytics } from '~/components/google-analytics';
import { LayoutProps } from '~/types';
import { HeaderBar } from '../components/header-bar/header-bar';
import { generateBaseMetadata } from './metadata';
import { HTMLProviders, MainProviders } from './providers';

import '@evaluate/react/tailwind.css';
import './layout.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export function generateMetadata() {
  return generateBaseMetadata('/');
}

export default function RootLayout(p: LayoutProps) {
  return (
    <HTMLProviders>
      <html key="html" lang="en" className={inter.className}>
        <head key="head">
          <GoogleAnalytics />

          <meta name="darkreader-lock" />
          <meta
            name="google-adsense-account"
            content="ca-pub-5722227635911083"
          />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
        </head>

        <body key="body" className="flex pb-8 flex-col gap-8">
          <MainProviders>
            <HeaderBar />

            <main className="container flex flex-col flex-1 gap-6">
              {p.children}
            </main>
          </MainProviders>
        </body>
      </html>
    </HTMLProviders>
  );
}
