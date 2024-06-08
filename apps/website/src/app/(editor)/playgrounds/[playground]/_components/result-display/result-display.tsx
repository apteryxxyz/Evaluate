import type { Runtime } from '@evaluate/engine/runtimes';
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

  // TODO: On mobile the editor and preview are too thin, in future use some sort of tabbed interface
  return (
    <section className="h-full">
      <ResizablePanelGroup direction="horizontal">
        {/* Run */}
        <ResizablePanel defaultSize={100 / panelCount} className="relative">
          {doesRunHaveDisplayableOutput && (
            <>
              <div className="border-b pl-1 text-sm">
                <span>Run Output</span>
              </div>
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
            </>
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
                <>
                  <div className="border-b pl-1 text-sm">
                    <span>Compile Output</span>
                  </div>
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
                </>
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
              className="flex flex-col"
              defaultSize={100 / panelCount}
            >
              <div className="border-b pl-1 text-sm">
                <span>Preview</span>
              </div>
              <HtmlPreview html={result?.run?.output} />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </section>
  );
}
