'use client';

import { Compressed, compress, decompress } from '@evaluate/compress';
import {
  ExecuteCodeOptions,
  ExecuteCodeOptionsSchema,
  type ExecuteCodeResult,
  executeCode,
} from '@evaluate/execute';
import { type Language, resolveLanguageFileName } from '@evaluate/languages';
import { Button } from '@evaluate/react/components/button';
import { Form } from '@evaluate/react/components/form';
import { toast } from '@evaluate/react/components/sonner';
import { useCopyToClipboard } from '@evaluate/react/hooks/copy-to-clipboard';
import { useHotKeys } from '@evaluate/react/hooks/hot-keys';
import { useModifierKey } from '@evaluate/react/hooks/modifier-key';
import { cn } from '@evaluate/react/utilities/class-name';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinkIcon, Loader2Icon, PlayIcon, Share2Icon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAnalytics } from '~/contexts/analytics';
import { useTranslate } from '~/contexts/translate';
import { CommandLineInput } from './_components/command-line-input';
import { FileSystemInput } from './_components/file-system-input';
import { ResultSection } from './_components/result-section';
import LanguageLoading from './loading';

export default function LanguageContent(p: { language: Language }) {
  const t = useTranslate();
  const analytics = useAnalytics();

  // Load the initial data from the URL search params
  const searchParams = useSearchParams();
  const initialData = useMemo(() => {
    const data = searchParams.get('d') ?? searchParams.get('data');
    if (data) {
      try {
        return decompress(data as Compressed<ExecuteCodeOptions>);
      } catch {}
    }

    // Legacy support for old URLs
    const code = atob(searchParams.get('code') ?? '');
    const input = atob(searchParams.get('input') ?? '');
    const args = atob(searchParams.get('args') ?? '');

    const name = resolveLanguageFileName(p.language.short);
    return { files: [{ name, content: code }], input, args };
  }, [searchParams, p.language.short]);

  const executeCodeForm = useForm<Omit<ExecuteCodeOptions, 'language'>>({
    resolver: zodResolver(ExecuteCodeOptionsSchema.omit({ language: true })),
    defaultValues: initialData,
  });

  const [isExecuting, setIsExecuting] = useState(false);
  const [hasFormError, setHasFormError] = useState(false);
  const [options, setOptions] =
    useState<Omit<ExecuteCodeOptions, 'language'>>();
  const [result, setResult] = useState<ExecuteCodeResult>();

  const onSubmit = executeCodeForm.handleSubmit(
    async (options) => {
      if (isExecuting) return;
      setIsExecuting(true);

      const result = await executeCode({ ...options, language: p.language });

      setResult(result);
      setOptions(options);
      setIsExecuting(false);

      let output;
      if (result.run.success === false) output = result.run.output;
      else if (result.compile?.success === false)
        output = result.compile.output;
      else output = result.run.output;

      void analytics?.track('code executed', {
        platform: 'website',
        'language id': p.language.id,
        'was successful':
          result.run.success && (!result.compile || result.compile.success),
        'code length': options.files
          .map((f) => f.content.length)
          .reduce((a, b) => a + b, 0),
        'output length': output.length,
        'input provided': Boolean(options.input),
        'args provided': Boolean(options.args),
      });
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

  const [, copy] = useCopyToClipboard();
  const copyShareUrlToClipboard = useCallback(() => {
    const url = new URL(window.location.href);
    const data = compress(executeCodeForm.getValues());
    url.searchParams.set('d', data);

    copy(url.toString()).then((success) => {
      if (!success) toast.error(t.share.copy_url.failed());
      else toast(t.share.copy_url.success(), { icon: <LinkIcon size={16} /> });
    });
  }, [executeCodeForm, copy, t]);

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

          <div className="w-full flex justify-end gap-2">
            <Button
              type="button"
              size="icon"
              className="aspect-square"
              onClick={copyShareUrlToClipboard}
            >
              <Share2Icon size={16} />
              <span className="sr-only">{t.share.copy_url()}</span>
            </Button>

            <div className="w-full md:w-auto flex flex-col gap-1">
              <Button
                type="submit"
                className={cn(
                  'md:w-32 w-full',
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
