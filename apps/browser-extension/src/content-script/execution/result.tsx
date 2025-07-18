import { Button } from '@evaluate/components/button';
import { Label } from '@evaluate/components/label';
import { Textarea } from '@evaluate/components/textarea';
import type { ExecuteResult, PartialRuntime } from '@evaluate/shapes';
import { ExternalLinkIcon } from 'lucide-react';
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
  let output = result.output;
  if (result.compile?.expired)
    output =
      'Your code compilation exceeded the allotted time and was terminated. Consider optimising your code for faster compilation.';
  else if (result.run.expired)
    output =
      'Your code execution exceeded the allotted time and was terminated. Consider optimising it for better performance.';

  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor="output">Output</Label>
        <Textarea
          readOnly
          name="output"
          value={output}
          placeholder="Your code executed successfully; however, it did not generate any output for the console."
          className={cn(
            'min-h-[40vh] w-full resize-none border-2',
            !result.success && 'border-destructive',
            result.output && 'font-mono',
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
