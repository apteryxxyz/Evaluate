'use client';

import { useTranslate } from '~/contexts/translate';

export default function ErrorPage() {
  const t = useTranslate();
  if (!t) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <h2 className="text-8xl font-bold">500</h2>
      <h3 className="text-4xl font-bold text-primary-gradient">
        {t.internal_error()}
      </h3>
      <p className="text-md text-center text-muted-foreground">
        {t.internal_error.description()}
      </p>
    </div>
  );
}
