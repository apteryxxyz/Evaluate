'use client';

import {
  ExecuteCodeOptions,
  ExecuteCodeOptionsSchema,
  type ExecuteCodeResult,
  type Language,
  executeCode,
} from '@evaluate/execute';
import { cn } from '@evaluate/ui';
import { Button } from '@evaluate/ui/button';
import { Form } from '@evaluate/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHotkeys } from '@mantine/hooks';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslate } from '~/contexts/translate';
import { CommandLineInput } from './_components/command-line-input';
import { FileSystemInput } from './_components/file-system-input';
import { ResultSection } from './_components/result-section';
import { useModifierKey } from './_hooks/use-modifier-key';

export default function Content(p: { language: Language }) {
  const t = useTranslate();

  const searchParams = useSearchParams();
  const code = atob(searchParams.get('code') ?? '');
  const input = atob(searchParams.get('input') ?? '');
  const args = atob(searchParams.get('args') ?? '');

  const executeCodeForm = useForm<Omit<ExecuteCodeOptions, 'language'>>({
    resolver: zodResolver(ExecuteCodeOptionsSchema.omit({ language: true })),
    defaultValues: { files: [{ content: code }], input, args },
  });

  const [isExecuting, setIsExecuting] = useState(false);
  const [hasFormError, setHasFormError] = useState(false);
  const [options, setOptions] =
    useState<Omit<ExecuteCodeOptions, 'language'>>();
  const [result, setResult] = useState<ExecuteCodeResult>();

  const onSubmit = executeCodeForm.handleSubmit(
    (options) => {
      if (isExecuting) return;
      setIsExecuting(true);

      return executeCode({ ...options, language: p.language })
        .then((result) => {
          setResult(result);
          setOptions(options);
        })
        .finally(() => setIsExecuting(false));
    },
    () => {
      setHasFormError(true);
      setTimeout(() => setHasFormError(false), 1000);
    },
  );

  useHotkeys(
    [
      ['ctrl+enter', () => onSubmit()],
      ['meta+enter', () => onSubmit()],
    ],
    [],
    true,
  );

  return (
    <>
      <div>
        <h1 className="inline text-2xl font-bold">{p.language.name} </h1>
        <h2 className="inline font-medium text-muted-foreground text-md">
          ({t.languages.version({ language_version: p.language.version })})
        </h2>
      </div>

      <Form {...executeCodeForm}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <FileSystemInput {...executeCodeForm} {...p} />
          <CommandLineInput {...executeCodeForm} />

          <div className="w-full flex flex-col gap-1">
            <Button
              type="submit"
              className={cn(
                'w-full md:w-32 md:ml-auto',
                hasFormError &&
                  'bg-destructive text-destructive-foreground hover:bg-destructive',
              )}
              disabled={isExecuting}
            >
              {isExecuting ? (
                <>
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                  <span>&nbsp;{t.evaluate.run.ing()}</span>
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4" />
                  <span>&nbsp;{t.evaluate.run()}</span>
                </>
              )}
            </Button>

            <span className="text-muted-foreground/50 text-xs text-center ml-auto">
              {/* TODO: Hide this on mobile */}({useModifierKey()}+enter)
            </span>
          </div>
        </form>
      </Form>

      <ResultSection
        control={executeCodeForm.control}
        options={options}
        result={result}
      />
    </>
  );
}
