'use client';

import { FileTerminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslate } from '@/contexts/translate';

export default function NotFound() {
  const t = useTranslate();

  return (
    <Alert variant="destructive">
      <FileTerminal />
      <AlertTitle>{t.evaluate.language.not_found()}</AlertTitle>
      <AlertDescription>
        {t.evaluate.language.not_found.description()}
      </AlertDescription>
    </Alert>
  );
}
