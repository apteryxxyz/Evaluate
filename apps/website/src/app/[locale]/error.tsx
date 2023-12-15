'use client';

import { Alert, AlertDescription, AlertTitle } from '@evaluate/ui/alert';
import { FileTerminalIcon } from 'lucide-react';
import { useTranslate } from '~/contexts/translate';

export default function ErrorPage() {
  const t = useTranslate();

  return (
    <Alert variant="destructive">
      <FileTerminalIcon />
      <AlertTitle>{t.internal_error()}</AlertTitle>
      <AlertDescription>{t.internal_error.description()}</AlertDescription>
    </Alert>
  );
}
