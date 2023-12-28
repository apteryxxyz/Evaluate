'use client';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@evaluate/react/components/alert';
import { FileTerminalIcon } from 'lucide-react';
import { useTranslate } from '~/contexts/translate';

export default function LanguageNotFound() {
  const t = useTranslate();
  if (!t) return null;

  return (
    <Alert variant="destructive">
      <FileTerminalIcon />
      <AlertTitle>{t.not_found()}</AlertTitle>
      <AlertDescription>{t.not_found.description()}</AlertDescription>
    </Alert>
  );
}
