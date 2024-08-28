'use client';

import { Button } from '@evaluate/react/components/button';
import { ScrollArea, ScrollBar } from '@evaluate/react/components/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@evaluate/react/components/tabs';
import type { PartialRuntime } from '@evaluate/types';
import {
  CodeIcon,
  FullscreenIcon,
  PackageCheckIcon,
  PlayIcon,
  Trash2Icon,
} from 'lucide-react';
import { ReadonlyEditor } from '../editor/readonly';
import { ContextMenuWrapper } from '../context-menu-wrapper';
import { HtmlPreview } from './html-preview';
import { useTerminal } from './use';

namespace Terminal {
  export interface Props {
    runtime: PartialRuntime;
  }
}
export function Terminal({ runtime }: Terminal.Props) {
  const { result, setResult } = useTerminal();

  const hasRun = result && 'run' in result;
  const hasRunTimedOut = hasRun && result.run?.signal === 'SIGKILL';
  const doesRunHaveDisplayableOutput =
    hasRun && result?.run?.output?.trim() !== '';
  const doesRunHaveAnEmptyOutput =
    !doesRunHaveDisplayableOutput && result?.run?.output !== undefined;

  const hasCompile = result && 'compile' in result;
  const hasCompileTimedOut = hasCompile && result.compile?.signal === 'SIGKILL';
  const doesCompileHaveDisplayableOutput =
    hasCompile && result?.compile?.output?.trim() !== '';

  const hasPreview = runtime.id === 'php';

  return (
    <ContextMenuWrapper>
      <section className="h-full">
        <Tabs defaultValue="run" className="h-full">
          <ScrollArea className="flex items-center whitespace-nowrap">
            <TabsList className="h-10 w-full space-x-1 rounded-none border-b bg-transparent px-0.5">
              {(
                [
                  [
                    CodeIcon, //
                    'run',
                    'Run',
                    doesRunHaveDisplayableOutput,
                  ],
                  [
                    PackageCheckIcon,
                    'compile',
                    'Compile',
                    doesCompileHaveDisplayableOutput,
                  ],
                  [
                    FullscreenIcon,
                    'preview',
                    'Preview',
                    hasPreview && doesRunHaveDisplayableOutput,
                  ],
                ] as const
              ).map(([Icon, value, label, indicator]) => (
                <TabsTrigger key={label} value={value} asChild>
                  <Button
                    variant="secondary"
                    className="relative bg-card text-foreground/70 hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground"
                  >
                    <Icon className="size-4" />
                    <span>&nbsp;{label}</span>
                    {indicator && (
                      <span className="-mt-1 -mr-1 absolute top-2 right-2 size-1.5 rounded-full bg-primary/50" />
                    )}
                  </Button>
                </TabsTrigger>
              ))}

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
            {doesRunHaveDisplayableOutput && (
              <ReadonlyEditor content={result.run.output} />
            )}

            {!doesRunHaveDisplayableOutput && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="max-w-64 text-balance text-center text-foreground/50 text-sm">
                  {hasRunTimedOut ? (
                    <>
                      Your code execution exceeded the allotted time and was
                      terminated. Consider optimising it for better performance.
                    </>
                  ) : doesRunHaveAnEmptyOutput ? (
                    <>
                      Your code executed successfully; however, it did not
                      generate any output for the console.
                    </>
                  ) : (
                    <>
                      Write your code and press{' '}
                      <PlayIcon size={14} className="inline" /> to execute it.
                      The results will be displayed here.
                    </>
                  )}
                </span>
              </div>
            )}
          </TabsContent>

          <TabsContent value="compile" className="relative mt-0 h-full">
            {doesCompileHaveDisplayableOutput && (
              <ReadonlyEditor content={result.compile?.output ?? ''} />
            )}

            {!doesCompileHaveDisplayableOutput && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="max-w-64 text-balance text-center text-foreground/50 text-sm">
                  {hasCompileTimedOut ? (
                    <>
                      Your code compilation exceeded the allotted time and was
                      terminated. Consider optimizing your code for faster
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
            {hasPreview && <HtmlPreview>{result?.run?.output}</HtmlPreview>}

            {!hasPreview && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="max-w-64 text-balance text-center text-foreground/50 text-sm">
                  This runtime does not have a way to display any preview.
                </span>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </ContextMenuWrapper>
  );
}
