'use client';

import DOMPurify from 'dompurify';
import { Children, useEffect, useState } from 'react';

export function HtmlPreview({ children }: React.PropsWithChildren) {
  const [sanitisedHtml, setSanitisedHtml] = useState<string>();

  useEffect(() => {
    if (!children) return;

    try {
      const html = Children.map(children, String)?.join('') ?? '';
      const sanitized = DOMPurify.sanitize(html, { WHOLE_DOCUMENT: true });
      setSanitisedHtml(sanitized);
    } catch (error) {
      console.error('Error sanitizing HTML:', error);
      setSanitisedHtml('');
    }
  }, [children]);

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
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <span className="max-w-64 text-balance text-center text-foreground/50 text-sm">
            Nothing to render here.
          </span>
        </div>
      )}
    </>
  );
}
