import '@/styles/reset.css';
import '@/styles/tailwind.css';
import { Inter } from 'next/font/google';
import { locales } from 'translations';
import { GoogleAnalytics } from '@/components/google-analytics';
import { HeaderBar } from '@/components/header-bar';
import { getTranslate } from '@/translations/determine-locale';
import type { LayoutProps } from '@/types';
import { generateBaseMetadata } from './metadata';
import { HTMLProviders, MainProviders } from './providers';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata(p: LayoutProps) {
  const t = getTranslate(p.params.locale);
  return generateBaseMetadata(t, `/${p.params.locale}`, {});
}

export default function Layout(p: LayoutProps) {
  return (
    <HTMLProviders>
      <html key="html" lang={p.params.locale} className={inter.className}>
        <head key="head">
          <GoogleAnalytics />

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

        <body key="body" className="py-8 flex flex-col gap-8">
          <MainProviders locale={p.params.locale}>
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
