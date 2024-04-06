'use client';

import type { Runtime } from '@evaluate/engine/runtimes';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@evaluate/react/components/resizable';
import { Sheet, SheetContent } from '@evaluate/react/components/sheet';
import { useEventListener } from '@evaluate/react/hooks/event-listener';
import { useMediaQuery } from '@evaluate/react/hooks/media-query';
import { useState } from 'react';
import { CodeEditor } from './_components/code-editor/code-editor';
import { FileExplorer } from './_components/file-explorer/file-explorer';
import { ResultDisplay } from './_components/result-display/result-display';
import { ExplorerProvider } from './_contexts/explorer/explorer';
import { ResultProvider } from './_contexts/result';

export default function EditorContent(p: { runtime: Runtime }) {
  const isDesktop = useMediaQuery('lg');
  const Explorer = isDesktop ? DesktopExplorerWrapper : MobileExplorerWrapper;

  return (
    <div
      style={{ '--bottom-spacing': isDesktop ? '6px' : '12px' }}
      className="m-1.5 mt-0 h-[calc(-3.5rem_+_100vh_-_var(--bottom-spacing))]"
    >
      <ExplorerProvider runtime={p.runtime}>
        <ResultProvider>
          <Explorer>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel minSize={15} defaultSize={65}>
                <CodeEditor runtime={p.runtime} />
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel minSize={15} defaultSize={35}>
                <ResultDisplay runtime={p.runtime} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </Explorer>
        </ResultProvider>
      </ExplorerProvider>
    </div>
  );
}

function DesktopExplorerWrapper(p: React.PropsWithChildren) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        minSize={10}
        defaultSize={15}
        collapsible={false}
        className="m-1.5 rounded-xl border-2 bg-card"
      >
        <FileExplorer />
      </ResizablePanel>

      <ResizableHandle className="bg-transparent" />

      <ResizablePanel
        defaultSize={85}
        minSize={10}
        className="m-1.5 rounded-xl border-2 bg-card"
      >
        {p.children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function MobileExplorerWrapper(p: React.PropsWithChildren) {
  const [open, setOpen] = useState(false);
  useEventListener(
    'file-explorer-open-change' as never, //
    () => setOpen((o) => !o),
  );

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="border-r-0 bg-transparent"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            className="h-full rounded-xl border-2 bg-card"
          >
            <FileExplorer />
          </div>
        </SheetContent>
      </Sheet>

      <div className="m-1.5 h-full rounded-xl border-2 bg-card">
        {p.children}
      </div>
    </>
  );
}
