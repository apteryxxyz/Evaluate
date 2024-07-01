'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@evaluate/react/components/resizable';
import { Sheet, SheetContent } from '@evaluate/react/components/sheet';
import { useEventListener } from '@evaluate/react/hooks/event-listener';
import { useMediaQuery } from '@evaluate/react/hooks/media-query';
import type { Runtime } from '@evaluate/types';
import React, { useState } from 'react';
import { Editor } from '~/components/editor';
import { Explorer } from '~/components/editor/explorer';
import { ExplorerProvider } from '~/components/editor/explorer/use';
import { Terminal } from '~/components/editor/terminal';
import { TerminalProvider } from '~/components/editor/terminal/use';

export default function EditorContent(p: { runtime: Runtime }) {
  const isDesktop = useMediaQuery('lg');
  const Wrapper = isDesktop ? DesktopWrapper : MobileWrapper;

  return (
    <div
      style={{ '--bottom-spacing': isDesktop ? '6px' : '12px' }}
      className="m-1.5 mt-0 h-[calc(-3.5rem_+_100vh_-_var(--bottom-spacing))]"
    >
      <ExplorerProvider runtime={p.runtime}>
        <TerminalProvider>
          <Wrapper>
            <Explorer />
            <Editor runtime={p.runtime} />
            <Terminal runtime={p.runtime} />
          </Wrapper>
        </TerminalProvider>
      </ExplorerProvider>
    </div>
  );
}

function DesktopWrapper(p: React.PropsWithChildren) {
  const [explorer, editor, terminal] = React.Children.toArray(p.children);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        defaultSize={15}
        minSize={10}
        collapsible={false}
        className="m-1.5 rounded-xl border-2 bg-card"
      >
        {explorer}
      </ResizablePanel>

      <ResizableHandle className="bg-transparent" />

      <ResizablePanel
        defaultSize={55}
        minSize={35}
        collapsible={false}
        className="m-1.5 rounded-xl border-2 bg-card"
      >
        {editor}
      </ResizablePanel>

      <ResizableHandle className="bg-transparent" />

      <ResizablePanel
        defaultSize={30}
        minSize={10}
        collapsible={false}
        className="m-1.5 rounded-xl border-2 bg-card"
      >
        {terminal}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function MobileWrapper(p: React.PropsWithChildren) {
  const [explorer, editor, terminal] = React.Children.toArray(p.children);

  const [explorerOpen, setExplorerOpen] = useState(false);
  useEventListener('mobile-explorer-open-change' as never, setExplorerOpen);
  const [terminalOpen, setTerminalOpen] = useState(false);
  useEventListener('mobile-terminal-open-change' as never, setTerminalOpen);

  return (
    <>
      <Sheet open={explorerOpen} onOpenChange={setExplorerOpen}>
        <SheetContent
          side="right"
          className="border-l-0 bg-transparent"
          onClick={() => setExplorerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            className="h-full rounded-xl border-2 bg-card"
          >
            {explorer}
          </div>
        </SheetContent>
      </Sheet>

      <div className="m-1.5 h-full rounded-xl border-2 bg-card">{editor}</div>

      <Sheet open={terminalOpen} onOpenChange={setTerminalOpen}>
        <SheetContent
          side="right"
          className="border-l-0 bg-transparent"
          onClick={() => setExplorerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            className="h-full rounded-xl border-2 bg-card"
          >
            {terminal}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
