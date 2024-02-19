import { compress } from '@evaluate/compress';
import { ExecuteCodeResult } from '@evaluate/execute';
import type { Language } from '@evaluate/languages';
import { Button } from '@evaluate/react/components/button';
import { NumberedEditor } from '@evaluate/react/components/code-editor/numbered-editor';
import { Dialog, DialogContent } from '@evaluate/react/components/dialog';
import { Label } from '@evaluate/react/components/label';
import { cn } from '@evaluate/react/utilities/class-name';
import { ExternalLinkIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslate } from '~contexts/translate';
import { absoluteUrl } from '~utilities/url-helpers';
import { wrapCapture } from '~utilities/wrap-capture';
import { DialogHeader } from './dialog-header';

export function ResultDialog(p: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogRef: React.RefObject<HTMLDivElement>;
  language?: Language;
  code?: string;
  result?: ExecuteCodeResult;
}) {
  const t = useTranslate();

  const editCodeUrl = useMemo(() => {
    const url = new URL(absoluteUrl(`/languages/${p.language?.id ?? ''}`));
    const data = compress({ files: [{ content: p.code ?? '' }] });
    url.searchParams.set('d', data);
    url.searchParams.set('utm_source', 'browser_extension');
    url.searchParams.set('utm_content', 'edit_code');
    return url.toString();
  }, [p.language, p.code]);

  const pickLanguageUrl = useMemo(() => {
    const url = new URL(absoluteUrl());
    const data = compress({ files: [{ content: p.code ?? '' }] });
    url.searchParams.set('d', data);
    url.searchParams.set('utm_source', 'browser_extension');
    url.searchParams.set('utm_content', 'change_language');
    return url.toString();
  }, [p.code]);

  const formattedOutput = useMemo(() => {
    switch (true) {
      case p.result?.compile?.success === false:
        return p.result.compile.output;
      case p.result?.run.success === false:
        return p.result.run.output;
      default:
        return p.result?.run.output;
    }
  }, [p.result]);

  const failStep = useMemo(() => {
    switch (true) {
      case p.result?.compile?.success === false:
        return 'compile';
      case p.result?.run.success === false:
        return 'run';
      default:
        return null;
    }
  }, [p.result]);

  if (!t) return null;
  return (
    <Dialog open={p.open} onOpenChange={p.onOpenChange}>
      {/* Needs a max height */}
      <DialogContent container={p.dialogRef.current!} className="max-w-5xl">
        <DialogHeader />

        <div className="space-y-2">
          {p.language && (
            <div className="flex gap-2">
              <span className="text-sm font-medium">
                {t.evaluate.language()}:
              </span>

              <span className="text-sm">
                {p.language.name} ({p.language.version})
              </span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="output">{t.evaluate.output()}</Label>

            <NumberedEditor
              readOnly
              name="output"
              code={formattedOutput ?? ''}
              onCodeChange={() => {}}
              placeholder={t.evaluate.output.no_output()}
              className={cn(
                failStep !== null && 'border-2 border-destructive',
                formattedOutput && 'font-mono',
              )}
            />

            {failStep && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {failStep === 'compile'
                  ? t.evaluate.output.compile_error()
                  : t.evaluate.output.runtime_error()}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button asChild onClick={wrapCapture(() => true)}>
              <a
                target="_blank"
                rel="noreferrer noopener"
                href={pickLanguageUrl}
              >
                <span>{t.language.not_detected.confirm()}&nbsp;</span>
                <ExternalLinkIcon size={16} />
              </a>
            </Button>
            <Button asChild onClick={wrapCapture(() => true)}>
              <a target="_blank" rel="noreferrer noopener" href={editCodeUrl}>
                <span>{t.evaluate.code.edit()}&nbsp;</span>
                <ExternalLinkIcon size={16} />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
