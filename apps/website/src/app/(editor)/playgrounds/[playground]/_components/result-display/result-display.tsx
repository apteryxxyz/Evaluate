import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@evaluate/react/components/resizable';
import { Editor } from '@monaco-editor/react';
import { PlayIcon } from 'lucide-react';
import { useResult } from '../../_contexts/result';
import { useMonaco } from '../../_hooks/use-monaco';
import HtmlPreview from './html-preview';
import type { Runtime } from '@evaluate/engine/runtimes';

export function ResultDisplay(p: { runtime: Runtime }) {
  const monaco = useMonaco();
  const [result] = useResult();

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
  const panelCount = 1 + (hasCompile ? 1 : 0) + (hasPreview && true ? 1 : 0);

  return (
    <section className="h-full">
      <ResizablePanelGroup direction="horizontal">
        {/* Run */}
        <ResizablePanel defaultSize={100 / panelCount} className="relative">
          {doesRunHaveDisplayableOutput && (
            <Editor
              onMount={() => monaco?.editor.syncTheme()}
              theme={monaco?.editor.theme}
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
                    Your code took too long to run and was killed. Try
                    optimising it to run faster.
                  </>
                ) : doesRunHaveAnEmptyOutput ? (
                  <>
                    Your code ran successfully, but it didn't produce any output
                    to the console.
                  </>
                ) : (
                  <>
                    Write your code, then press{' '}
                    <PlayIcon size={14} className="inline" /> to run it, the
                    output will appear here.
                  </>
                )}
              </span>
            </div>
          )}
        </ResizablePanel>

        {/* Compile */}
        {hasCompile && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={100 / panelCount} className="relative">
              {doesCompileHaveDisplayableOutput && (
                <Editor
                  onMount={() => monaco?.editor.syncTheme()}
                  theme={monaco?.editor.theme}
                  value={result.compile?.output}
                  options={{
                    minimap: { enabled: false },
                    readOnly: true,
                    domReadOnly: true,
                    contextmenu: false,
                  }}
                />
              )}

              {hasCompileTimedOut && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="max-w-64 text-balance text-center text-foreground/50 text-sm">
                    Your code took too long to compile and was killed. Try
                    optimising it to compile faster.
                  </span>
                </div>
              )}
            </ResizablePanel>
          </>
        )}

        {/* Preview */}
        {hasPreview && hasRun && (
          <>
            <ResizableHandle />
            <ResizablePanel
              className="flex items-center justify-center"
              defaultSize={100 / panelCount}
            >
              <HtmlPreview html={result?.run?.output} />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </section>
  );
}

/*
  const monaco = useMonaco();

  const [result] = useResult();

  const hasRun = result && 'run' in result;
  const hasRunTimedOut = hasRun && result.run?.signal === 'SIGKILL';
  const hasRunGotDisplayableOutput = result?.run?.output?.trim() !== '';
  const hasRunGotEmptyOutput =
    !hasRunGotDisplayableOutput && result?.run?.output !== undefined;

  const hasCompile = result && 'compile' in result;
  const hasCompileTimedOut = hasCompile && result.compile?.signal === 'SIGKILL';
  const hasCompileGotDisplayableOutput = result?.compile?.output?.trim() !== '';

  // const hasRun = result && 'run' in result;
  // const hasRunTimedOut = hasRun && result.run?.signal === 'SIGKILL';
  // const hasRunGotOutput = result?.run?.output?.trim() !== '';
  // const hasRunGotEmptyOutput =
  //   hasRunGotOutput && result?.run?.output !== undefined;

  // const hasCompile = result && 'compile' in result;
  // const hasCompileTimedOut = hasCompile && result.compile?.signal === 'SIGKILL';
  // const hasCompileGotOutput = result?.compile?.output?.trim() !== '';

  const hasPreview = p.runtime.id === 'php';
  const panelCount = 1 + (hasCompile ? 1 : 0) + (hasPreview && hasRun ? 1 : 0);

  return (
    <section className="h-full">
      <ResizablePanelGroup direction="horizontal">
        {/* Run *
        <ResizablePanel defaultSize={100 / panelCount}>
          {hasRunGotDisplayableOutput && (
            <Editor
              onMount={() => monaco?.editor.syncTheme()}
              className="h-auto"
              theme={monaco?.editor.theme}
              value={result?.run?.output}
              options={{
                minimap: { enabled: false },
                readOnly: true,
                domReadOnly: true,
                contextmenu: false,
              }}
            />
          )}

          {!hasRunGotDisplayableOutput && (
            <div className="flex h-full items-center justify-center">
              <span className="text-foreground/50 text-center text-balance text-sm max-w-64">
                {hasRunTimedOut ? (
                  <>
                    Your code took too long to run and was killed. Try
                    optimising it to run faster.
                  </>
                ) : hasRunGotEmptyOutput ? (
                  <>
                    Your code ran successfully, but it didn't produce any output
                    to the console.
                  </>
                ) : (
                  <>
                    Write your code, then press{' '}
                    <PlayIcon size={14} className="inline" /> to run it, the
                    output will appear here.
                  </>
                )}
              </span>
            </div>
          )}
        </ResizablePanel>

        {/* Compile *
        {hasCompile &
          (hasCompileGotDisplayableOutput || hasCompileTimedOut) && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={100 / panelCount}>
                {hasCompileGotDisplayableOutput && (
                  <Editor
                    onMount={() => monaco?.editor.syncTheme()}
                    theme={monaco?.editor.theme}
                    value={result.compile?.output}
                    options={{
                      minimap: { enabled: false },
                      readOnly: true,
                      domReadOnly: true,
                      contextmenu: false,
                    }}
                  />
                )}

                {!hasCompileGotDisplayableOutput && hasCompileTimedOut && (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-foreground/50 text-center text-balance text-sm max-w-64">
                      Your code took too long to compile and was killed. Try
                      optimising it to compile faster.
                    </span>
                  </div>
                )}
              </ResizablePanel>
            </>
          )}

        {/* Preview *
        {hasPreview && hasRun && (
          <>
            <ResizableHandle />
            <ResizablePanel
              className="flex items-center justify-center"
              defaultSize={100 / panelCount}
            >
              <HtmlPreview html={result?.run?.output} />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </section>
  );
}
*/
