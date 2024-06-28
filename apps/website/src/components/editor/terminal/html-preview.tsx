'use client';

import DOMPurify from 'dompurify';
import { Children, useEffect, useState } from 'react';

export function HtmlPreview(p: React.PropsWithChildren) {
  const [sanitisedHtml, setSanitisedHtml] = useState<string>();

  useEffect(() => {
    if (!p.children) return;
    const html = String(Children.only(p.children) ?? '');
    setSanitisedHtml(DOMPurify.sanitize(html, { WHOLE_DOCUMENT: true }));
  });

  return (
    <>
      {sanitisedHtml && (
        <iframe
          title="HTML Preview"
          src={`data:text/html;charset=utf-8,${encodeURIComponent(
            sanitisedHtml,
          )}`}
          className="h-full w-full"
          style={{ border: 'none' }}
          sandbox="allow-scripts"
        />
      )}

      {!sanitisedHtml && (
        <div className="flex h-full items-center justify-center">
          <span className="max-w-64 text-balance text-center text-foreground/50 text-sm">
            Nothing to render here.
          </span>
        </div>
      )}
    </>
  );
}
