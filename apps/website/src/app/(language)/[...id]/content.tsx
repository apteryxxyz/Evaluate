'use client';

import {
  ExecuteCodeOptions,
  ExecuteCodeOptionsSchema,
  type ExecuteCodeResult,
  type Language,
  executeCode,
  getLanguageFileName,
} from '@evaluate/execute';
import { Button } from '@evaluate/react/components/button';
import { Form } from '@evaluate/react/components/form';
import { useHotKeys } from '@evaluate/react/hooks/hot-keys';
import { useModifierKey } from '@evaluate/react/hooks/modifier-key';
import { cn } from '@evaluate/react/utilities/class-name';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslate } from '~/contexts/translate';
import { CommandLineInput } from './_components/command-line-input';
import { FileSystemInput } from './_components/file-system-input';
import { ResultSection } from './_components/result-section';
import LanguageLoading from './loading';

export default function LanguageContent(p: { language: Language }) {
  const t = useTranslate();

  const searchParams = useSearchParams();
  const name = getLanguageFileName(p.language.short);
  const code = atob(searchParams.get('code') ?? '');
  const input = atob(searchParams.get('input') ?? '');
  const args = atob(searchParams.get('args') ?? '');

  const executeCodeForm = useForm<Omit<ExecuteCodeOptions, 'language'>>({
    resolver: zodResolver(ExecuteCodeOptionsSchema.omit({ language: true })),
    defaultValues: { files: [{ name, content: code }], input, args },
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

  useHotKeys(
    ['ctrl+enter', 'meta+enter'], //
    () => onSubmit(),
    [onSubmit],
    { enableOnFormTags: true },
  );

  if (!t) return <LanguageLoading />;

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
                  <Loader2Icon size={16} className="animate-spin" />
                  <span>&nbsp;{t.evaluate.run.ing()}</span>
                </>
              ) : (
                <>
                  <PlayIcon size={16} />
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
