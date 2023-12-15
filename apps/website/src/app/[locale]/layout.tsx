import { locales } from '@evaluate/translate';
import '@evaluate/ui/tailwind.css';
import { Inter } from 'next/font/google';
import { GoogleAnalytics } from '~/components/google-analytics';
import { LayoutProps } from '~/types';
import { NavigationBar } from './_components/navigation-bar/navigation-bar';
import { generateBaseMetadata } from './metadata';
import { HTMLProviders, MainProviders } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata(p: LayoutProps) {
  return generateBaseMetadata([p.params.locale, '/']);
}

export default function RootLayout(p: LayoutProps) {
  return (
    <HTMLProviders>
      <html lang={p.params.locale} className={inter.className}>
        <head key="head">
          <GoogleAnalytics />

          <meta name="darkreader-lock" />

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

        <body className="flex pb-8 flex-col gap-8">
          <MainProviders locale={p.params.locale as 'en'}>
            <NavigationBar />

            <main className="container flex flex-col flex-1 gap-6">
              {p.children}
            </main>
          </MainProviders>
        </body>
      </html>
    </HTMLProviders>
  );
}
