import { Button } from '@evaluate/components/button';
import { Label } from '@evaluate/components/label';
import { Textarea } from '@evaluate/components/textarea';
import type { ExecuteResult, PartialRuntime } from '@evaluate/shapes';
import { ExternalLinkIcon } from 'lucide-react';
import { useMemo } from 'react';
import { twMerge as cn } from 'tailwind-merge';
import { makeEditCodeUrl, makePickRuntimeUrl } from '~/helpers/make-url';

export function ResultDialog({
  code,
  runtime,
  result,
}: {
  code: string;
  runtime: PartialRuntime;
  result: ExecuteResult;
}) {
  const display = useMemo(() => {
    if (!result) return { code: undefined, output: undefined };
    if (result.compile?.code) return result.compile;
    return result.run;
  }, [result]);

  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor="output">Output</Label>
        <Textarea
          readOnly
          name="output"
          value={display.output}
          placeholder="The code ran successfully, but it didn't produce an output to the console."
          className={cn(
            'min-h-[40vh] w-full resize-none border-2',
            display.code && 'border-destructive',
            display.output && 'font-mono',
          )}
        />
      </div>

      <div className="flex justify-end gap-2">
        {code && (
          <Button variant="secondary" asChild>
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={makePickRuntimeUrl(code)}
            >
              <span>Change Runtime</span>
              <ExternalLinkIcon size={16} className="ml-1" />
            </a>
          </Button>
        )}

        {code && runtime && (
          <Button variant="secondary" asChild>
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={makeEditCodeUrl(runtime, code)}
            >
              <span>Edit Code</span>
              <ExternalLinkIcon size={16} className="ml-1" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
