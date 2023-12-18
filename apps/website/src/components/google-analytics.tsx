'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

export function triggerPageView(url: string) {
  const measurementId = process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID;
  if (measurementId) window.gtag('config', measurementId, { page_path: url });
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
        id="google-tag-manager"
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
          const page_path = window.location.pathname;
          gtag('config', '${measurementId}', { page_path });
          `,
        }}
      />
    </>
  );
}
