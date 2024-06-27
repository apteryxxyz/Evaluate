'use client';

import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

export default function HtmlPreview(p: { html?: string }) {
  const [sanitisedHtml, setSanitisedHtml] = useState<string>();
  const [shouldRender] = useState(true);

  useEffect(() => {
    if (p.html)
      setSanitisedHtml(
        DOMPurify.sanitize(p.html ?? '', {
          WHOLE_DOCUMENT: true,
        }),
      );
    // setShouldRender(false);
  }, [p.html]);

  return (
    <>
      {sanitisedHtml && shouldRender && (
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
