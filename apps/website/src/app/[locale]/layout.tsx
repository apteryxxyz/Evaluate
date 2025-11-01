import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { twMerge as cn } from 'tailwind-merge';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { BodyProviders, HtmlProviders } from '~/components/providers';
import say from '~/i18n';
import '../../style.css';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return say.locales.map((l) => ({ locale: l }));
}

export default async function RootLayout({
  params,
  children,
}: LayoutProps<'/[locale]'>) {
  const { locale = 'en' } = await params;
  try {
    await say.load(String(locale));
    say.activate(String(locale));
  } catch {
    notFound();
  }

  return (
    <HtmlProviders>
      <html
        key="html"
        lang={say.locale}
        dir={
          ['ar', 'fa', 'he', 'ur', 'ps'].includes(say.locale) ? 'rtl' : 'ltr'
        }
        className="dark"
      >
        <head key="head">
          <meta name="evaluate-extension" content="disabled" />
          <meta name="darkreader-lock" />
          <meta name="theme-color" content="#2fc186" />
          <link rel="icon" type="image/png" href="/favicon.ico" />
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5722227635911083"
            crossOrigin="anonymous"
          />
        </head>

        <body
          key="body"
          className={cn(
            inter.className,
            'flex min-h-screen flex-col overflow-y-scroll',
          )}
        >
          <BodyProviders {...say}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </BodyProviders>
        </body>
      </html>
    </HtmlProviders>
  );
}
