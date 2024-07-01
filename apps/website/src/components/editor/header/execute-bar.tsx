'use client';

import { executeCode } from '@evaluate/engine/execute';
import { Button } from '@evaluate/react/components/button';
import { Form } from '@evaluate/react/components/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@evaluate/react/components/select';
import { toast } from '@evaluate/react/components/toast';
import { useMediaQuery } from '@evaluate/react/hooks/media-query';
import { cn } from '@evaluate/react/utilities/class-name';
import { ExecuteOptions, type PartialRuntime } from '@evaluate/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import analytics from '~/services/analytics';
import type { File } from '../explorer/file-system';
import { useExplorer, useWatchExplorer } from '../explorer/use';
import { useTerminal } from '../terminal/use';

export function ExecuteBar(p: { runtime: PartialRuntime }) {
  const { setResult } = useTerminal();
  const explorer = useExplorer();
  useWatchExplorer(explorer);
  const files = explorer.descendants //
    .filter((f): f is File => f.type === 'file');
  const entryFile = explorer.findEntryFile();

  // Form

  const form = useForm<ExecuteOptions>({
    resolver: zodResolver(ExecuteOptions),
    defaultValues: {},
  });
  const handleSubmit = useCallback<ReturnType<typeof form.handleSubmit>>(
    (e) => {
      form.setValue('runtime', p.runtime.id);
      const map = Object.fromEntries(files.map((f) => [f.path, f.content]));
      form.setValue('files', map);
      form.setValue('entry', entryFile?.path!);
      form.setValue('args', explorer.args.content);
      form.setValue('input', explorer.input.content);

      return form.handleSubmit(
        function onValid(data) {
          mutate(data);
        },
        function onInvalid(errors) {
          console.log({ errors, map });

          for (const error of Object.values(errors)) {
            if (typeof error.message === 'object')
              onInvalid({ '': error.message } as never);
            else toast.error(error.message);
          }
        },
      )(e);
    },
    [form, p.runtime, entryFile, explorer.args, explorer.input, files],
  );

  // Mutation

  const { mutate, isPending } = useMutation({
    mutationKey: ['executeCode'],
    mutationFn: executeCode,
    onSuccess(result) {
      setResult(result);
      dispatchEvent(new CustomEvent('mobile-terminal-open-change'));
      analytics?.capture('code executed', {
        'runtime id': p.runtime.id,
        'was successful':
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
      <form
        className="flex w-full gap-1"
        onSubmit={handleSubmit}
        aria-disabled={isPending}
      >
        <Select
          value={entryFile?.id}
          onValueChange={(id) => explorer.findFile(id)?.setEntry(true)}
          disabled={isPending || files.length === 0}
        >
          <SelectTrigger className="w-full lg:w-[200px]">
            <SelectValue placeholder="Select an entry file..." />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Entry File</SelectLabel>
              {files.map((file) => (
                <SelectItem key={file.id} value={file.id}>
                  {file.path}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          type="submit"
          disabled={isPending}
          className={cn(!useMediaQuery('xs') && 'aspect-square p-0')}
        >
          {isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <PlayIcon className="size-4" />
          )}
          <span className="sr-only">Execute</span>
          <span className="hidden xs:block">&nbsp;{p.runtime.name}</span>
          <span className="sr-only">Code</span>
        </Button>
      </form>
    </Form>
  );
}
