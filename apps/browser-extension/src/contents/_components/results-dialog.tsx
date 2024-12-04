import { compress } from '@evaluate/engine/dist/compress';
import { getRuntimeDefaultFileName } from '@evaluate/engine/runtimes';
import { Button } from '@evaluate/react/components/button';
import { Card, CardContent, CardHeader } from '@evaluate/react/components/card';
import { Label } from '@evaluate/react/components/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@evaluate/react/components/tabs';
import { Textarea } from '@evaluate/react/components/textarea';
import { cn } from '@evaluate/react/utilities/class-name';
import type { ExecuteResult, PartialRuntime } from '@evaluate/types';
import { ExternalLinkIcon, XIcon } from 'lucide-react';
import { useMemo } from 'react';
import { env } from '~env';
import { wrapCapture } from '~services/analytics';

export function ResultsCard(p: {
  code: string;
  results: (ExecuteResult & { runtime: PartialRuntime })[];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-black/60"
      onClick={(e) => e.target === e.currentTarget && p.onClose()}
      onKeyDown={(e) => e.key === 'Escape' && p.onClose()}
    >
      <Card className="relative max-h-[75vh] min-w-[500px] max-w-[600px] bg-background shadow-lg">
        <CardHeader>
          <a
            className="mr-auto inline-flex items-center gap-2"
            target="_blank"
            rel="noreferrer noopener"
            href={env.PLASMO_PUBLIC_WEBSITE_URL}
          >
            <img
              src={`${env.PLASMO_PUBLIC_WEBSITE_URL}/images/icon.png`}
              alt="Evaluate logo"
              width={36}
              height={36}
            />
            <span className="font-bold text-primary text-xl">Evaluate</span>
          </a>
        </CardHeader>

        <CardContent>
          <Tabs
            defaultValue={
              (p.results.find((r) => r.run?.code === 0) ?? p.results[0])
                ?.runtime.id
            }
          >
            <TabsList className="mb-2 w-full">
              {p.results.map((result) => (
                <TabsTrigger
                  key={result.runtime.id}
                  value={result.runtime.id}
                  onClick={wrapCapture(() => true)}
                >
                  {result.runtime.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {p.results.map((result) => (
              <TabsContent key={result.runtime.id} value={result.runtime.id}>
                <ResultContent
                  code={p.code}
                  runtime={result.runtime}
                  result={result}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>

        <Button
          variant="ghost"
          size="icon"
          onClick={wrapCapture(p.onClose)}
          className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none"
        >
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </Button>
      </Card>
    </div>
  );
}

function ResultContent(p: {
  code: string;
  runtime: PartialRuntime;
  result: ExecuteResult;
}) {
  const result = useMemo(() => {
    if (p.result.compile?.code) return p.result.compile;
    return p.result.run;
  }, [p.result]);

  const state = useMemo(() => {
    if (!p.code) return null;
    const fileName = getRuntimeDefaultFileName(p.runtime.id) ?? 'file.code';
    return compress({
      files: { [fileName]: p.code },
      entry: fileName,
      focused: fileName,
    });
  }, [p.runtime.id, p.code]);

  const changeRuntimeUrl = useMemo(() => {
    if (!state) return;
    return `${env.PLASMO_PUBLIC_WEBSITE_URL}/playgrounds#${state}`;
  }, [state]);

  const editCodeUrl = useMemo(() => {
    if (!state || !p.runtime) return;
    return `${env.PLASMO_PUBLIC_WEBSITE_URL}/playgrounds/${p.runtime.id}#${state}`;
  }, [state, p.runtime]);

  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor="output">Output</Label>
        <Textarea
          readOnly
          name="output"
          value={result.output}
          placeholder="The code ran successfully, but it didn't produce an output to the console."
          className={cn(
            'min-h-[40vh] w-full resize-none',
            result.code && 'border-2 border-destructive',
            result.output && 'font-mono',
          )}
        />
      </div>

      <div className="flex justify-end gap-2">
        {changeRuntimeUrl && (
          <Button asChild onClick={wrapCapture(() => true)}>
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={changeRuntimeUrl}
            >
              <span>Change Runtime&nbsp;</span>
              <ExternalLinkIcon size={16} />
            </a>
          </Button>
        )}

        {editCodeUrl && (
          <Button asChild onClick={wrapCapture(() => true)}>
            <a target="_blank" rel="noreferrer noopener" href={editCodeUrl}>
              <span>Edit Code&nbsp;</span>
              <ExternalLinkIcon size={16} />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
