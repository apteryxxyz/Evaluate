'use client';

import { useTranslate } from '~/contexts/translate';

export default function LanguageNotFound() {
  const t = useTranslate();
  if (!t) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <h2 className="text-8xl font-bold">404</h2>
      <h3 className="text-4xl font-bold text-primary-gradient">
        {t.not_found()}
      </h3>
      <p className="text-md text-center text-muted-foreground">
        {t.not_found.description()}
      </p>
    </div>
  );
}
