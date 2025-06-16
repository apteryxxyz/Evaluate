'use client';

import { Button } from '@evaluate/components/button';
import { Form } from '@evaluate/components/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@evaluate/components/select';
import { toast } from '@evaluate/components/toast';
import { executeCode } from '@evaluate/engine/execute';
import { useEventListener } from '@evaluate/hooks/event-listener';
import { ExecuteOptions, type PartialRuntime } from '@evaluate/shapes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { File } from 'virtual-file-explorer-backend';
import { useExplorer, useWatch } from '~/components/explorer/use';
import { useTerminal } from '~/components/terminal/use';
import posthog from '~/services/posthog';

export function ExecuteBar({ runtime }: { runtime: PartialRuntime }) {
  const explorer = useExplorer();
  const files = explorer.descendants //
    .filter((f): f is File => f.type === 'file' && !/::\w+::/.test(f.name));

  const [entry, setEntry] = useState<File>();
  const handleEntryChange = useCallback(
    (path: string) => {
      setEntry((prevEntry) => {
        if (prevEntry) Reflect.set(prevEntry, 'entry', false);
        const newEntry = files.find((f) => f.path === path);
        Reflect.set(newEntry ?? {}, 'entry', true);
        return newEntry;
      });
    },
    [files],
  );
  // If the entry file is deleted (aka removed from parent), reset the entry state
  useWatch(
    entry || null,
    ['parent'],
    () => !entry?.parent && setEntry(undefined),
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!entry) setEntry(files.find((f) => Reflect.get(f, 'entry')));
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Form

  const form = useForm({
    resolver: zodResolver(ExecuteOptions),
    defaultValues: {},
  });
  const handleSubmit = useCallback<ReturnType<typeof form.handleSubmit>>(
    (e) => {
      form.setValue('runtime', runtime.id);
      form.setValue('entry', entry?.path!);

      const map = Object.fromEntries(files.map((f) => [f.path, f.content]));
      form.setValue('files', map);

      const args = explorer.children //
        .find((c): c is File => c.name === '::args::');
      if (args) form.setValue('args', args.content);
      const input = explorer.children //
        .find((c): c is File => c.name === '::input::');
      if (input) form.setValue('input', input.content);

      return form.handleSubmit(
        function onValid(data) {
          mutate(data);
        },
        function onInvalid(errors) {
          for (const error of Object.values(errors)) {
            if (typeof error.message === 'object')
              onInvalid({ '': error.message } as never);
            else toast.error(error.message);
          }
        },
      )(e);
    },
    [explorer, files, form, runtime, entry],
  );
  useEventListener('execute-code' as never, handleSubmit);

  // Mutation

  const { setResult } = useTerminal();
  const { mutate, isPending } = useMutation({
    mutationKey: ['executeCode'],
    mutationFn: executeCode,
    onSuccess(result) {
      setResult(result);
      dispatchEvent(new CustomEvent('mobile-terminal-open-change'));

      const [codeLength, codeLines] = files.reduce(
        ([length, lines], file) => [
          length + file.content.length,
          lines + file.content.split('\n').length,
        ],
        [0, 0],
      );
      posthog?.capture('executed_code', {
        runtime_id: runtime.id,
        code_length: codeLength,
        code_lines: codeLines,
        compile_successful: result.compile ? result.compile.code === 0 : null,
        execution_successful:
          result.run.code === 0 &&
          (!result.compile || result.compile.code === 0),
      });
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <Form {...form}>
      <form className="flex w-full gap-1" onSubmit={handleSubmit}>
        <Select value={entry?.path ?? ''} onValueChange={handleEntryChange}>
          <SelectTrigger className="w-full lg:w-[200px]">
            <SelectValue placeholder="Select an entry file..." />
          </SelectTrigger>

          <SelectContent>
            {files.map(
              (f) =>
                f.path && (
                  <SelectItem key={f.path} value={f.path}>
                    {f.path}
                  </SelectItem>
                ),
            )}
            {files.length === 0 && (
              <SelectItem value="null" disabled>
                No files found
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        <Button
          type="submit"
          className="aspect-square p-0 sm:aspect-auto sm:px-4 sm:py-2"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <PlayIcon className="size-4" />
          )}
          <span className="sr-only">Execute</span>
          <span className="hidden sm:block">&nbsp;{runtime.name}</span>
          <span className="sr-only">Code</span>
        </Button>
      </form>
    </Form>
  );
}
