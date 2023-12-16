'use client';

import { Alert, AlertDescription, AlertTitle } from '@evaluate/ui/alert';
import { FileTerminalIcon } from 'lucide-react';
import { useTranslate } from '~/contexts/translate';

export default function LanguageNotFound() {
  const t = useTranslate();
  if (!t) return null;

  return (
    <Alert variant="destructive">
      <FileTerminalIcon />
      <AlertTitle>{t.evaluate.language.not_found()}</AlertTitle>
      <AlertDescription>
        {t.evaluate.language.not_found.description()}
      </AlertDescription>
    </Alert>
  );
}
