import type { ExecuteCodeOptions, ExecuteCodeResult } from '@evaluate/execute';
import { cn } from '@evaluate/ui';
import { Label } from '@evaluate/ui/label';
import { Textarea } from '@evaluate/ui/textarea';
import _isEqual from 'lodash/isEqual';
import { useMemo } from 'react';
import { type Control, useWatch } from 'react-hook-form';
import { useTranslate } from '~/contexts/translate';

export function ResultSection(p: {
  control: Control<Omit<ExecuteCodeOptions, 'language'>>;
  options?: Omit<ExecuteCodeOptions, 'language'>;
  result?: ExecuteCodeResult;
}) {
  const t = useTranslate();
  const files = useWatch({ control: p.control, name: 'files' });

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

  return (
    <div className="space-y-2">
      <Label>{t.evaluate.output()}</Label>

      <Textarea
        readOnly
        value={formattedOutput ?? ''}
        placeholder={
          p.result
            ? t.evaluate.output.no_output()
            : t.evaluate.output.press_run()
        }
        className={cn(
          failStep !== null && 'border-2 border-destructive',
          formattedOutput && 'font-mono',
          !_isEqual(p.options?.files, files) && 'text-muted-foreground',
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
  );
}
