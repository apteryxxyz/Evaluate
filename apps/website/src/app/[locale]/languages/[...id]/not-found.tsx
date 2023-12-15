'use client';

import { Alert, AlertDescription, AlertTitle } from '@evaluate/ui/alert';
import { FileTerminalIcon } from 'lucide-react';
import { useTranslate } from '~/contexts/translate';

export default function NotFound() {
  const t = useTranslate();

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
