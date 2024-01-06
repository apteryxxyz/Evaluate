import { compress } from '@evaluate/compress';
import { ExecuteCodeResult, Language } from '@evaluate/execute';
import { Button } from '@evaluate/react/components/button';
import { CodeEditor } from '@evaluate/react/components/code-editor';
import { Dialog, DialogContent } from '@evaluate/react/components/dialog';
import { Label } from '@evaluate/react/components/label';
import { cn } from '@evaluate/react/utilities/class-name';
import { ExternalLinkIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslate } from '~contexts/translate';
import { absoluteUrl } from '~utilities/url-helpers';
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

  const linkUrl = useMemo(() => {
    const url = new URL(absoluteUrl(p.language?.id ?? '/'));
    const data = compress({ files: [{ content: p.code ?? '' }] });
    url.searchParams.set('d', data);
    url.searchParams.set('utm_source', 'browser');
    url.searchParams.set('utm_medium', 'extension');
    url.searchParams.set('utm_campaign', 'result_open');
    return url.toString();
  }, [p.language, p.code]);

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

            <CodeEditor
              readOnly
              name="output"
              code={formattedOutput ?? ''}
              setCode={() => {}}
              placeholder={
                p.result
                  ? t.evaluate.output.no_output()
                  : t.evaluate.output.press_run()
              }
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

          <div className="flex justify-end">
            <Button asChild>
              <a target="_blank" rel="noreferrer noopener" href={linkUrl}>
                {/* TODO: Not happy with the label "Open", figure something out later */}
                <span>Open&nbsp;</span>
                <ExternalLinkIcon size={16} />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
