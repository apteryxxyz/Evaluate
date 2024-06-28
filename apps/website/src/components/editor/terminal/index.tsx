'use client';

import type { PartialRuntime } from '@evaluate/engine/runtimes';
import { Button } from '@evaluate/react/components/button';
import { ScrollArea, ScrollBar } from '@evaluate/react/components/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@evaluate/react/components/tabs';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import {
  CodeIcon,
  FullscreenIcon,
  PackageCheckIcon,
  PlayIcon,
} from 'lucide-react';
import { useMonaco } from '../use-monaco';
import { HtmlPreview } from './html-preview';
import { useTerminal } from './use';

export function Terminal(p: { runtime: PartialRuntime }) {
  const monaco = useMonaco();
  const { result } = useTerminal();

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

  const hasPreview = p.runtime.id === 'php';

  return (
    <section className="h-full">
      <Tabs defaultValue="run" className="h-full">
        <ScrollArea className="flex items-center whitespace-nowrap">
          <TabsList className="h-10 w-full space-x-1 rounded-none border-b bg-transparent px-0.5">
            {(
              [
                [CodeIcon, 'run', 'Run'],
                [PackageCheckIcon, 'compile', 'Compile'],
                [FullscreenIcon, 'preview', 'Preview'],
              ] as const
            ).map(([Icon, value, label]) => (
              <TabsTrigger key={label} value={value} asChild>
                <Button
                  variant="secondary"
                  className="bg-card text-foreground/70 data-[state=active]:bg-muted data-[state=active]:text-foreground hover:text-foreground"
                >
                  <Icon className="size-4" />
                  <span>&nbsp;{label}</span>
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="run" className="relative mt-0 h-full">
          {doesRunHaveDisplayableOutput && (
            <MonacoEditor
              {...monaco}
              value={result.run.output}
              options={{
                minimap: { enabled: false },
                readOnly: true,
                domReadOnly: true,
                contextmenu: false,
              }}
            />
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
                    <PlayIcon size={14} className="inline" /> to execute it. The
                    results will be displayed here.
                  </>
                )}
              </span>
            </div>
          )}
        </TabsContent>

        <TabsContent value="compile" className="relative mt-0 h-full">
          {doesCompileHaveDisplayableOutput && (
            <MonacoEditor
              {...monaco}
              value={result.compile?.output}
              options={{
                minimap: { enabled: false },
                readOnly: true,
                domReadOnly: true,
                contextmenu: false,
              }}
            />
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
                This runtime does not support previewing code.
              </span>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
