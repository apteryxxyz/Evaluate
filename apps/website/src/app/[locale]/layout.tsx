import { locales } from '@evaluate/translate';
import '@evaluate/ui/tailwind.css';
import { Inter } from 'next/font/google';
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
