import { ExecuteOptions, executeCode } from '@evaluate/engine/execute';
import type { Runtime } from '@evaluate/engine/runtimes';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import _ from 'lodash';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import analytics from '~/services/analytics';
import { combineIssueMessages } from '~/utilities/zod-issues';
import {
  useExplorer,
  useWatchExplorer,
} from '../../_contexts/explorer/explorer';
import type { File } from '../../_contexts/explorer/file-system';
import { useResult } from '../../_contexts/result';

export function ExecuteBar(p: { runtime: Runtime }) {
  const explorer = useExplorer();
  useWatchExplorer(explorer);
  const files = explorer.descendants //
    .filter((f): f is File => f.type === 'file');

  const entryFile = explorer.findEntryFile();
  const entryFileSelectRef = useRef<HTMLButtonElement>(null);

  const form = useForm<ExecuteOptions>({
    resolver: zodResolver(ExecuteOptions),
    values: {
      runtime: p.runtime.id,
      files: Object.fromEntries(files.map((f) => [f.path, f.content])),
      entry: entryFile?.path!,
      args: explorer.args.content,
      input: explorer.input.content,
    },
  });

  const [, setResult] = useResult();
  const { mutate, isPending } = useMutation({
    mutationKey: ['execute'],
    mutationFn: (data: ExecuteOptions) => {
      return executeCode(data);
    },
  });

  type Valid = Parameters<typeof form.handleSubmit>[0];
  const onValid = useCallback<Valid>(
    (data) => {
      return mutate(data, {
        onSuccess: (result) => {
          setResult(result);
          analytics?.capture('code executed', {
            'runtime id': p.runtime.id,
            'was successful':
              result.run.code === 0 &&
              (!result.compile || result.compile.code === 0),
          });
        },
      });
    },
    [p.runtime.id, mutate, setResult],
  );

  type Invalid = Exclude<Parameters<typeof form.handleSubmit>[1], undefined>;
  const onInvalid = useCallback<Invalid>((error) => {
    const message = combineIssueMessages(Object.values(error));
    toast.error(message);

    // Add a red border to the entry popover if the error is related to the entry file
    if (error.entry && !error.files) {
      entryFileSelectRef.current?.style.setProperty('border', '1px solid red');
      setTimeout(() => {
        entryFileSelectRef.current?.style.removeProperty('border');
      }, 1000);
    }
  }, []);

  return (
    <Form {...form}>
      <form
        className="flex w-full"
        onSubmit={form.handleSubmit(onValid, onInvalid)}
      >
        <Select
          value={entryFile?.id}
          onValueChange={(id) => explorer.findFile(id)?.setEntry(true)}
          disabled={isPending || files.length === 0}
        >
          <SelectTrigger
            ref={entryFileSelectRef}
            className="w-full min-w-[200px]"
          >
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

        <Button type="submit" disabled={isPending}>
          <span className="sr-only">Execute Code</span>
          <span>{p.runtime.name}</span>
          {isPending ? (
            <Loader2Icon className="ml-1 size-4 animate-spin" />
          ) : (
            <PlayIcon className="ml-1 size-4" />
          )}
        </Button>
      </form>
    </Form>
  );
}
