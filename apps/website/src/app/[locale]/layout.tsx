import { locales } from '@evaluate/translate';
import { Inter } from 'next/font/google';
import { FooterBar } from '~/components/footer-bar';
import { HeaderBar } from '~/components/header-bar';
import { LayoutProps } from '~/types';
import { generateBaseMetadata } from './metadata';
import { HTMLProviders, MainProviders } from './providers';

import '@evaluate/react/tailwind.css';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import './layout.css';

const PageView = dynamic(
  async () => {
    const { PageView } = await import('~/components/page-view');
    return { default: PageView };
  },
  { ssr: false },
);

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
      <html
        key="html"
        lang={p.params.locale}
        className={`${inter.className} h-full`}
      >
        <head key="head">
          <meta name="evaluate-extension" content="disabled" />
          <meta name="darkreader-lock" />

          <Script
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5722227635911083"
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />

          <script
            data-name="BMC-Widget"
            data-cfasync="false"
            src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
            data-id="apteryx"
            data-description="Support me on Buy me a coffee!"
            data-message=""
            data-color="#2fc186"
            data-position="Right"
            data-x_margin="18"
            data-y_margin="18"
          />
          <style>
            {`#bmc-wbtn {
              height: 48px !important;
              width: 48px !important;
            }`}
          </style>

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

          <PageView />
        </head>

        <body key="body" className="flex h-full flex-col gap-8">
          <MainProviders locale={p.params.locale}>
            <HeaderBar />

            <main className="container flex flex-col flex-[1_0_auto] gap-6">
              {p.children}
            </main>

            <FooterBar className="flex-shrink-0" />
          </MainProviders>
        </body>
      </html>
    </HTMLProviders>
  );
}
