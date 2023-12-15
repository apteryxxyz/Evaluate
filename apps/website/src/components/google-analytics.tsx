import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';
import { removeLocale } from '~/utilities/url-helpers';

export function triggerPageView(url: string) {
  const measurementId = process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID;
  if (measurementId)
    window.gtag('config', measurementId, { page_path: removeLocale(url) });
}

export function emitEvent(name: string, params: Record<string, unknown>) {
  window.gtag('event', name, params);
}

export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID;
  if (!measurementId || process.env.NODE_ENV !== 'production') return null;

  const pathname = usePathname();
  useEffect(() => triggerPageView(pathname), [pathname]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />

      <Script
        id="google-analytics"
        strategy="afterInteractive"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}

          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
          `,
        }}
      />
    </>
  );
}
