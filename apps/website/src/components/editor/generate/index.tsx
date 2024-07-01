'use client';

import { Button } from '@evaluate/react/components/button';
import { Form, FormField } from '@evaluate/react/components/form';
import { Input } from '@evaluate/react/components/input';
import { toast } from '@evaluate/react/components/toast';
import { GenerateCodeOptions, type PartialRuntime } from '@evaluate/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, SparklesIcon, XIcon } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import analytics from '~/services/analytics';
import { trpc } from '~/services/trpc';
import { useGenerate } from './use';

type Editor = import('monaco-editor').editor.IStandaloneCodeEditor;

export function Generate(p: {
  runtime: PartialRuntime;
  editor: Editor | undefined;
}) {
  const [generate, { widgetRef, onClose }] = useGenerate(p.editor);

  // Form

  const form = useForm<GenerateCodeOptions>({
    resolver: zodResolver(GenerateCodeOptions),
    defaultValues: {},
  });
  const handleSubmit = useCallback<ReturnType<typeof form.handleSubmit>>(
    (e) => {
      form.setValue('file.name', p.editor?.getModel()?.uri.path!);
      form.setValue('file.content', p.editor?.getValue()!);
      form.setValue('file.line', p.editor?.getPosition()?.lineNumber!);

      return form.handleSubmit(
        function onValid(data) {
          mutate(data);
        },
        function onInvalid(errors) {
          for (const error of Object.values(errors)) toast.error(error.message);
        },
      )(e);
    },
    [form, p.editor],
  );

  // Mutation

  const { mutate, isPending } = trpc.ai.generateCode.useMutation({
    onSuccess({ success, response: code }) {
      analytics?.capture('code generated', {
        'runtime id': p.runtime.id,
        instructions: form.getValues().instructions,
        'was successful': success,
      });

      if (!success) toast.error('Failed to generate code');
      const selection = p.editor?.getSelection();
      const position = p.editor?.getPosition();
      form.reset();

      if (selection || position)
        p.editor?.executeEdits('generateCode', [
          {
            range: selection ?? {
              startLineNumber: position?.lineNumber ?? 0,
              startColumn: 1,
              endLineNumber: position?.lineNumber ?? 0,
              endColumn: 1,
            },
            text: code,
            forceMoveMarkers: true,
          },
        ]);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    const disposable = p.editor?.onDidChangeCursorPosition(onClose);
    return () => disposable?.dispose();
  }, [p.editor, onClose]);

  return (
    <div ref={widgetRef} className="!hidden">
      <div
        style={{ '--width': `${generate.width}px` }}
        className="w-[calc(var(--width)_-_16px)] px-0.5"
      >
        <Form {...form}>
          <form
            className="flex w-full gap-1"
            onSubmit={handleSubmit}
            aria-disabled={isPending}
          >
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <Input
                  size="sm"
                  variant={
                    form.formState.errors.instructions
                      ? 'destructive'
                      : 'default'
                  }
                  className="w-full"
                  placeholder="Generate code with a prompt"
                  {...field}
                />
              )}
            />

            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? (
                <Loader2Icon className="size-3 animate-spin" />
              ) : (
                <SparklesIcon className="size-3" />
              )}
              <span className="hidden sm:block">&nbsp;Generate</span>
            </Button>

            <Button
              className="aspect-square p-0"
              size="sm"
              variant="secondary"
              onClick={onClose}
            >
              <XIcon className="size-3" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
