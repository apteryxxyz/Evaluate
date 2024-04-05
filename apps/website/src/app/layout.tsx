import { Header } from '~/components/header';
import { BodyProviders, HtmlProviders } from '../components/providers';
import type { LayoutProps } from '../types';
import { generateBaseMetadata } from './metadata';

export function generateMetadata() {
  return generateBaseMetadata('/');
}

import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import { Toaster } from '@evaluate/react/components/toast';
import '@evaluate/react/style.css';
import { Footer } from '~/components/footer';
import './layout.css';

export default function RootLayout(p: LayoutProps) {
  return (
    <HtmlProviders>
      <html key="html" lang="en" className="dark">
        <head key="head">
          <meta name="evaluate-extension" content="disabled" />
          <meta name="darkreader-lock" />
          <link rel="icon" type="image/png" href="/favicon.ico" />
        </head>

        <body
          key="body"
          className={`${inter.className} flex flex-col min-h-screen overflow-y-scroll`}
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
