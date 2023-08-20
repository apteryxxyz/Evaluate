import '@/styles/reset.css';
import '@/styles/tailwind.css';
import { Inter } from 'next/font/google';
// import { locales } from 'translations';
import { HeaderBar } from '@/components/header-bar';
import { getTranslate } from '@/translations/determine-locale';
import type { LayoutProps } from '@/types';
import { generateBaseMetadata } from './metadata';
import { HTMLProviders, MainProviders } from './providers';

const inter = Inter({ subsets: ['latin'] });

// TODO: https://github.com/vercel/next.js/issues/49408
// export function generateStaticParams() {
//   return locales.map((locale) => ({ locale }));
// }

export function generateMetadata(p: LayoutProps) {
  const t = getTranslate(p.params.locale);
  return generateBaseMetadata(t, `/${p.params.locale}`, {});
}

export default function Layout(p: LayoutProps) {
  return (
    <HTMLProviders>
      <html key="html" lang={p.params.locale} className={inter.className}>
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
