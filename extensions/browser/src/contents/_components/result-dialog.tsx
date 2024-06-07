import { compress } from '@evaluate/engine/dist/compress';
import type { ExecuteResult } from '@evaluate/engine/execute';
import type { PartialRuntime } from '@evaluate/engine/runtimes';
import { Button } from '@evaluate/react/components/button';
import { Dialog, DialogContent } from '@evaluate/react/components/dialog';
import { Label } from '@evaluate/react/components/label';
import { Textarea } from '@evaluate/react/components/textarea';
import { cn } from '@evaluate/react/utilities/class-name';
import { ExternalLinkIcon } from 'lucide-react';
import { useMemo } from 'react';
import { env } from '~env';
import { wrapCapture } from '~utilities/wrap-capture';
import { DialogHeader } from './dialog-header';

export function ResultDialog(p: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogRef: React.RefObject<HTMLDivElement>;
  runtime?: PartialRuntime;
  code?: string;
  result?: ExecuteResult;
}) {
  const resultKey = p.result?.compile?.code ? 'compile' : 'run';
  const realResult = p.result?.[resultKey];

  const changeRuntimeUrl = useMemo(() => {
    if (!p.code) return;
    const state = compress({
      files: { 'file.code': p.code },
      entry: 'file.code',
    });
    return `${env.PLASMO_PUBLIC_WEBSITE_URL}/playgrounds#${state}`;
  }, [p.code]);

  const editCodeUrl = useMemo(() => {
    if (!p.code || !p.runtime) return;
    const state = compress({
      files: { 'file.code': p.code },
      entry: 'file.code',
    });
    return `${env.PLASMO_PUBLIC_WEBSITE_URL}/playgrounds/${p.runtime?.id}#${state}`;
  }, [p.code, p.runtime]);

  return (
    <Dialog open={p.open} onOpenChange={p.onOpenChange}>
      <DialogContent container={p.dialogRef.current!}>
        <DialogHeader />

        <div className="space-y-2">
          {p.runtime && (
            <div className="flex gap-2 text-sm">
              <span className="font-bold">Runtime:</span>
              <span>
                {p.runtime.name} (v{p.runtime.versions.at(-1)})
              </span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="output">Output</Label>

            <div className="relative">
              <Textarea
                readOnly
                name="output"
                value={realResult?.output ?? ''}
                placeholder="The code ran successfully, but it didn't produce any output to the console."
                className={cn(
                  'h-[10vh]',

                  realResult?.code && 'border-2 border-destructive',
                  realResult?.output && 'font-mono',
                )}
              />
            </div>

            {!!realResult?.code && (
              <p className="font-medium text-[0.8rem] text-destructive">
                {resultKey === 'compile'
                  ? 'Compilation failed.'
                  : 'Execution failed.'}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            {changeRuntimeUrl && (
              <Button asChild onClick={wrapCapture(() => true)}>
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href={changeRuntimeUrl}
                >
                  <span>Change Runtime&nbsp;</span>
                  <ExternalLinkIcon size={16} />
                </a>
              </Button>
            )}

            {editCodeUrl && (
              <Button asChild onClick={wrapCapture(() => true)}>
                <a target="_blank" rel="noreferrer noopener" href={editCodeUrl}>
                  <span>Edit Code&nbsp;</span>
                  <ExternalLinkIcon size={16} />
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
