'use client';

import { Alert, AlertDescription, AlertTitle } from '@evaluate/ui/alert';
import { FileTerminalIcon } from 'lucide-react';
import { useTranslate } from '~/contexts/translate';

export default function NotFoundPage() {
  const t = useTranslate();

  return (
    <Alert variant="destructive">
      <FileTerminalIcon />
      <AlertTitle>{t.not_found()}</AlertTitle>
      <AlertDescription>{t.not_found.description()}</AlertDescription>
    </Alert>
  );
}
