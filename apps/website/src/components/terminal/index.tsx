'use client';

import { Button } from '@evaluate/components/button';
import { ScrollArea, ScrollBar } from '@evaluate/components/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@evaluate/components/tabs';
import type { Runtime } from '@evaluate/runtimes';
import {
  CodeIcon,
  FullscreenIcon,
  PackageCheckIcon,
  PlayIcon,
  Trash2Icon,
} from 'lucide-react';
import { ReadonlyEditor } from '../editor/readonly';
import { HtmlPreview } from './html-preview';
import { useTerminal } from './use';

export namespace Terminal {
  export interface Props {
    runtime: Runtime;
  }
}
export function Terminal({ runtime }: Terminal.Props) {
  const { result, setResult } = useTerminal();

  return (
    <section className="h-full">
      <Tabs defaultValue="run" className="h-full gap-0">
        <ScrollArea className="flex items-center whitespace-nowrap rounded-full">
          <TabsList className="h-10 w-full space-x-1 rounded-none border-b-2 bg-transparent px-0.5">
            <TabsTrigger value="run" asChild>
              <Button
                variant="secondary"
                className="relative bg-card text-foreground/70 hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground"
              >
                <CodeIcon className="size-4" />
                <span>&nbsp;Run</span>
                {result?.run.output && (
                  <span className="-mt-1 -mr-1 absolute top-2 right-2 size-1.5 rounded-full bg-primary/50" />
                )}
              </Button>
            </TabsTrigger>

            <TabsTrigger value="compile" asChild>
              <Button
                variant="secondary"
                className="relative bg-card text-foreground/70 hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground"
              >
                <PackageCheckIcon className="size-4" />
                <span>&nbsp;Compile</span>
                {result?.compile?.output && (
                  <span className="-mt-1 -mr-1 absolute top-2 right-2 size-1.5 rounded-full bg-primary/50" />
                )}
              </Button>
            </TabsTrigger>

            <TabsTrigger value="preview" asChild>
              <Button
                variant="secondary"
                className="relative bg-card text-foreground/70 hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground"
              >
                <FullscreenIcon className="size-4" />
                <span>&nbsp;Preview</span>
              </Button>
            </TabsTrigger>

            <Button
              variant="secondary"
              size="icon"
              onClick={() => setResult(undefined)}
              className="ml-auto bg-card text-foreground/70 hover:text-foreground"
              disabled={!result}
            >
              <Trash2Icon className="size-4" />
              <span className="sr-only">Clear</span>
            </Button>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="run" className="relative mt-0 h-full">
          {result?.run.output && <ReadonlyEditor content={result.run.output} />}

          {!result?.run.output && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="max-w-64 text-balance text-center text-foreground/50 text-sm">
                {result?.run.expired ? (
                  <>
                    Your code execution exceeded the allotted time and was
                    terminated. Consider optimising it for better performance.
                  </>
                ) : result?.run.output?.trim() === '' ? (
                  <>
                    Your code executed successfully; however, it did not
                    generate any output for the console.
                  </>
                ) : (
                  <>
                    Write your code and press{' '}
                    <PlayIcon size={16} className="inline" /> to execute it. The
                    results will be displayed here.
                  </>
                )}
              </span>
            </div>
          )}
        </TabsContent>

        <TabsContent value="compile" className="relative mt-0 h-full">
          {result?.compile?.output && (
            <ReadonlyEditor content={result.compile.output} />
          )}

          {!result?.compile?.output && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="max-w-64 text-balance text-center text-foreground/50 text-sm">
                {result?.compile?.expired ? (
                  <>
                    Your code compilation exceeded the allotted time and was
                    terminated. Consider optimising your code for faster
                    compilation.
                  </>
                ) : (
                  <>
                    <strong>If</strong> this runtime requires compilation, the
                    output will be displayed here.
                  </>
                )}
              </span>
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="relative mt-0 h-full">
          {runtime.id === 'php' && (
            <HtmlPreview>{result?.run?.output}</HtmlPreview>
          )}

          {!(runtime.id === 'php') && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="max-w-64 text-balance text-center text-foreground/50 text-sm">
                This runtime does not have a way to display any preview.
              </span>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
