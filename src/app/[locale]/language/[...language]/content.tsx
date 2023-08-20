'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import { executeServerAction } from 'next-sa/client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { executeCode } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslate } from '@/contexts/translate';
import type { ExecuteCodeResult, Language } from '@/services/piston';
import { cn } from '@/utilities/class-name';

interface ContentProps {
  language: Language;
}

const evaluateSchema = z.object({
  code: z.string().min(1).max(10000),
  input: z.string().max(10000).optional(),
  args: z.string().max(10000).optional(),
});

export default function Content(p: ContentProps) {
  const t = useTranslate();
  const searchParams = useSearchParams();
  const autoRun = searchParams.get('run') === 'true';

  const evaluateForm = useForm<z.infer<typeof evaluateSchema>>({
    resolver: zodResolver(evaluateSchema),
    defaultValues: {
      code: searchParams.get('code')?.toString(),
      input: searchParams.get('input')?.toString(),
      args: searchParams.get('args')?.toString(),
    },
  });

  const [isExecuting, setExecuting] = useState(false);
  const [result, setResult] = useState<ExecuteCodeResult | null>(null);
  const output = useMemo(() => {
    if (!result) return null;
    if (result.compile?.success === false) return result.compile.output;
    if (result.run.success === false) return result.run.output;
    return result.run.output;
  }, [result]);
  const failStep = useMemo(() => {
    if (result?.compile?.success === false) return 'compile';
    if (result?.run.success === false) return 'run';
    return null;
  }, [result]);

  const onSubmit = evaluateForm.handleSubmit(async (data) => {
    if (isExecuting) return;
    setExecuting(true);

    const result = await executeServerAction(executeCode, {
      language: p.language,
      files: [{ content: data.code }],
      input: data.input,
      args: data.args,
    });

    setResult(result);
    setExecuting(false);
  });

  useEffect(() => {
    if (autoRun) void onSubmit();
  }, []);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">{p.language.name}</h1>
        <h2 className="text-lg font-medium">
          {t.languages.version(p.language)}
        </h2>
      </div>

      <Form {...evaluateForm}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <FormField
            control={evaluateForm.control}
            name="code"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor={field.name}>{t.evaluate.code()}</FormLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder={t.evaluate.code.description()}
                  className="w-full"
                />
              </FormItem>
            )}
          />

          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={evaluateForm.control}
              name="input"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor={field.name}>
                    {t.evaluate.input()}
                  </FormLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder={t.evaluate.input.description()}
                    className="w-full"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={evaluateForm.control}
              name="args"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor={field.name}>
                    {t.evaluate.args()}
                  </FormLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder={t.evaluate.args.description()}
                    className="w-full"
                  />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="ml-auto" disabled={isExecuting}>
            {isExecuting ? (
              <>
                <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />
                {t.evaluate.run.ing()}
              </>
            ) : (
              <>
                <PlayIcon className="mr-1 h-4 w-4" />
                {t.evaluate.run()}
              </>
            )}
          </Button>
        </form>
      </Form>

      <FormItem>
        <Label>{t.evaluate.output()}</Label>
        <Textarea
          readOnly
          value={output ?? ''}
          placeholder={t.evaluate.output.press_run()}
          className={cn(failStep !== null && 'border-2 border-destructive')}
        />

        {failStep && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {failStep === 'compile'
              ? t.evaluate.output.compile_error()
              : t.evaluate.output.runtime_error()}
          </p>
        )}
      </FormItem>
    </>
  );
}
