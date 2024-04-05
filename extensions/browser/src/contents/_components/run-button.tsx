import { type ExecuteResult, executeCode } from '@evaluate/engine/dist/execute';
import type { PartialRuntime } from '@evaluate/engine/runtimes';
import { Button } from '@evaluate/react/components/button';
import { cn } from '@evaluate/react/utilities/class-name';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useRuntimes } from '~contents/_contexts/runtimes';
import analytics from '~services/analytics';
import { getRuntimeFromElement } from '~utilities/get-runtime-from-element';
import { wrapCapture } from '~utilities/wrap-capture';
import { ChooseDialog } from './choose-dialog';
import { ResultDialog } from './result-dialog';

export function RunButton(p: {
  preElement: HTMLPreElement;
  dialogRef: React.RefObject<HTMLDivElement>;
}) {
  let { runtimes, fetchRuntimes } = useRuntimes();

  const [result, setResult] = useState<ExecuteResult>();
  const [runtime, setRuntime] = useState<PartialRuntime>();
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isChooseOpen, setIsChooseOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const onClick = useCallback(async () => {
    if (isFetching) return;
    setIsFetching(true);

    if (!runtimes) runtimes = await fetchRuntimes();
    const runtime = await getRuntimeFromElement(runtimes, p.preElement);
    if (!runtime) {
      setIsFetching(false);
      setIsChooseOpen(true);
      return;
    }

    const code = p.preElement.textContent ?? '';
    const result = await executeCode({
      runtime: runtime.id,
      files: { 'file.code': code },
      entry: 'file.code',
    });

    setRuntime(runtime);
    setResult(result);
    setIsResultOpen(true);
    setIsFetching(false);

    analytics?.capture('code executed', {
      'runtime id': runtime.id,
      'was successful':
        result.run.code === 0 && (!result.compile || result.compile.code === 0),
    });
  }, [isFetching, runtimes, fetchRuntimes, p.preElement]);

  return (
    <>
      <Button
        size="icon"
        className={cn('aspect-square rounded-full m-2 w-7 h-7')}
        onClick={wrapCapture(onClick)}
        disabled={isFetching}
      >
        {isFetching ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <PlayIcon className="size-4" />
        )}
        <span className="sr-only">Execute Code</span>
      </Button>

      <ResultDialog
        open={isResultOpen}
        onOpenChange={setIsResultOpen}
        dialogRef={p.dialogRef}
        runtime={runtime}
        code={p.preElement.textContent ?? ''}
        result={result}
      />

      <ChooseDialog
        open={isChooseOpen}
        onOpenChange={setIsChooseOpen}
        dialogRef={p.dialogRef}
        code={p.preElement.textContent ?? ''}
      />
    </>
  );
}
