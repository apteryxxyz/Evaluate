'use client';

import { Sheet, SheetBody } from '@evaluate/components/sheet';
import { useEventListener } from '@evaluate/hooks/event-listener';
import { Children, useState } from 'react';

export function MobileWrapper({ children }: React.PropsWithChildren) {
  const [explorer, editor, terminal] = Children.toArray(children);

  const [explorerOpen, setExplorerOpen] = useState(false);
  useEventListener('mobile-explorer-open-change' as never, setExplorerOpen);
  const [terminalOpen, setTerminalOpen] = useState(false);
  useEventListener('mobile-terminal-open-change' as never, setTerminalOpen);

  return (
    <>
      <Sheet open={explorerOpen} onOpenChange={setExplorerOpen}>
        <SheetBody
          side="right"
          className="border-l-0 bg-transparent [&>button]:hidden"
          onClick={() => setExplorerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            className="h-full rounded-xl border-2 bg-card"
          >
            {explorer}
          </div>
        </SheetBody>
      </Sheet>

      <div className="m-1.5 h-full rounded-lg border-2 bg-card">{editor}</div>

      <Sheet open={terminalOpen} onOpenChange={setTerminalOpen}>
        <SheetBody
          side="right"
          className="border-l-0 bg-transparent [&>button]:hidden"
          onClick={() => setTerminalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            className="h-full rounded-xl border-2 bg-card"
          >
            {terminal}
          </div>
        </SheetBody>
      </Sheet>
    </>
  );
}
