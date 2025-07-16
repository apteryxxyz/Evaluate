import { toast } from '@evaluate/components/toast';
import type { ExecuteResult, PartialRuntime } from '@evaluate/shapes';
import { useEffect, useState } from 'react';
import { onMessage } from 'webext-bridge/content-script';
import { makePickRuntimeUrl } from '~/helpers/make-url';
import { ExecutionDialog } from './dialog';

export function Execution({ dialogPortal }: { dialogPortal: HTMLElement }) {
  const [code, setCode] = useState('');
  const [runtimes, setRuntimes] = useState<PartialRuntime[]>([]);
  const [results, setResults] = useState<ExecuteResult[]>([]);

  useEffect(() => {
    let lastToastId: string | number;

    const removeUnknownRuntimeListener = onMessage(
      'unknownRuntime',
      ({ data: { code } }) => {
        const pickUrl = makePickRuntimeUrl(code);
        toast.error('Could not determine runtime', {
          description:
            'Evaluate was unable to determine a runtime for the selected text.',
          action: {
            label: 'Pick a Runtime',
            onClick: () => window.open(pickUrl, '_blank'),
          },
        });
      },
    );

    const removeExecutionStartedListener = onMessage(
      'executionStarted',
      ({ data: { runtimeNameOrCount } }) => {
        const description =
          typeof runtimeNameOrCount === 'number'
            ? // Number is always greater than 1
              `Running in ${runtimeNameOrCount} runtimes for the best results.`
            : `Running in ${runtimeNameOrCount}.`;
        const toastId = toast.loading(
          'Executing code, this may take a few seconds...',
          { description },
        );
        lastToastId = toastId;
        setTimeout(() => toast.dismiss(toastId), 15000);
      },
    );

    const removeExecutionFailedListener = onMessage(
      'executionFailed',
      ({ data: { errorMessage } }) => {
        toast.dismiss(lastToastId);
        toast.error('Execution could not be completed', {
          description: errorMessage,
        });
      },
    );

    const removeExecutionFinishedListener = onMessage(
      'executionFinished',
      ({ data: { code, runtimes, results } }) => {
        toast.dismiss(lastToastId);
        setCode(code);
        setRuntimes(runtimes);
        setResults(results);
      },
    );

    return () => {
      removeUnknownRuntimeListener();
      removeExecutionStartedListener();
      removeExecutionFailedListener();
      removeExecutionFinishedListener();
    };
  }, []);

  return (
    <ExecutionDialog
      portal={dialogPortal}
      code={code}
      runtimes={runtimes}
      results={results}
      setResults={setResults}
    />
  );
}
