import { compress } from '@evaluate/compress';
import { Button } from '@evaluate/react/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from '@evaluate/react/components/dialog';
import { ExternalLinkIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslate } from '~contexts/translate';
import { absoluteUrl } from '~utilities/url-helpers';
import { wrapCapture } from '~utilities/wrap-capture';
import { DialogHeader } from './dialog-header';

export function LanguageDialog(p: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogRef: React.RefObject<HTMLDivElement>;
  code?: string;
}) {
  const t = useTranslate();

  const linkUrl = useMemo(() => {
    const url = new URL(absoluteUrl());
    const data = compress({ files: [{ content: p.code ?? '' }] });
    url.searchParams.set('d', data);
    url.searchParams.set('utm_source', 'browser_extension');
    url.searchParams.set('utm_content', 'language_not_detected');
    return url.toString();
  }, [p.code]);

  if (!t) return null;
  return (
    <Dialog open={p.open} onOpenChange={p.onOpenChange}>
      <DialogContent container={p.dialogRef.current!}>
        <DialogHeader />

        <div className="space-y-2">
          <h1 className="text-lg font-bold">{t.language.not_detected()}</h1>
          <p className="text-sm">{t.language.not_detected.description()}</p>
        </div>

        <DialogFooter>
          <Button onClick={() => p.onOpenChange(false)} variant="secondary">
            {t.language.not_detected.cancel()}
          </Button>
          <Button asChild onClick={wrapCapture(() => true)}>
            <a target="_blank" rel="noreferrer noopener" href={linkUrl}>
              <span>{t.language.not_detected.confirm()}&nbsp;</span>
              <ExternalLinkIcon size={16} />
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
