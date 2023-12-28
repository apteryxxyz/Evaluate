'use client';

import type { ExecuteCodeOptions } from '@evaluate/execute';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@evaluate/react/components/accordion';
import {
  FormField,
  FormItem,
  FormLabel,
} from '@evaluate/react/components/form';
import { Textarea } from '@evaluate/react/components/textarea';
import { cn } from '@evaluate/react/utilities/class-name';
import type { Control } from 'react-hook-form';
import { useTranslate } from '~/contexts/translate';

export function CommandLineInput(p: {
  control: Control<Omit<ExecuteCodeOptions, 'language'>>;
}) {
  const t = useTranslate();

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="x">
        <AccordionTrigger>{t.evaluate.extra_options()}</AccordionTrigger>
        <AccordionContent className="flex flex-col md:flex-row gap-4 p-2">
          <FormField
            control={p.control}
            name="input"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor={field.name}>{t.evaluate.input()}</FormLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder={t.evaluate.input.description()}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  className={cn('w-full', field.value && 'font-mono')}
                />
              </FormItem>
            )}
          />

          <FormField
            control={p.control}
            name="args"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor={field.name}>{t.evaluate.args()}</FormLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder={t.evaluate.args.description()}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  className={cn('w-full', field.value && 'font-mono')}
                />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
