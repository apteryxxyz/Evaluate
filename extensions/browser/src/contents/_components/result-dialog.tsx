import { ExecuteCodeResult, Language } from '@evaluate/execute';
import { CodeEditor } from '@evaluate/react/components/code-editor';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@evaluate/react/components/dialog';
import { Label } from '@evaluate/react/components/label';
import { useUpdateEffect } from '@evaluate/react/hooks/update-effect';
import { cn } from '@evaluate/react/utilities/class-name';
import { useMemo, useState } from 'react';
import { useTranslate } from '~contexts/translate';

export function ResultDialog(p: {
  dialogRef: React.RefObject<HTMLDivElement>;
  language?: Language;
  result?: ExecuteCodeResult;
}) {
  const t = useTranslate();

  const [open, setOpen] = useState(false);
  useUpdateEffect(() => setOpen(true), [p.result]);

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent container={p.dialogRef.current!}>
        <DialogHeader>
          {/* TODO: Replace this with env link */}
          <a
            className="inline-flex items-center gap-2 mr-auto"
            target="_blank"
            rel="noreferrer noopener"
            href="https://evaluate.run"
          >
            <img
              src="https://evaluate.run/icon.png"
              alt="Evaluate logo"
              width={36}
              height={36}
            />
            <span className="text-primary font-bold text-xl">Evaluate</span>
          </a>
        </DialogHeader>

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
          </div>

          {failStep && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {failStep === 'compile'
                ? t.evaluate.output.compile_error()
                : t.evaluate.output.runtime_error()}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
