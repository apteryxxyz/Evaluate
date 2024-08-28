'use client';

import { Button } from '@evaluate/react/components/button';
import { ScrollArea, ScrollBar } from '@evaluate/react/components/scroll-area';
import { cn } from '@evaluate/react/utilities/class-name';
import type { PartialRuntime } from '@evaluate/types';
import { FilesIcon, TerminalIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { ContextMenuWrapper } from '../context-menu-wrapper';
import { ExecuteBar } from './execute-bar';
import { useEditor } from './hooks';
import { OpenedFiles } from './opened-files';

export function Editor({ runtime }: { runtime: PartialRuntime }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const { file, handlers, setContainer } = useEditor();
  useEffect(() => setContainer(editorRef.current!), [setContainer]);

  return (
    <section className="h-full">
      <div className="flex flex-col items-center gap-1 border-b px-0.5 lg:h-10 lg:flex-row">
        <div className="flex w-full gap-1 lg:overflow-hidden">
          <ScrollArea className="flex w-full whitespace-nowrap">
            <OpenedFiles />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <Button
            variant="secondary"
            className="ml-auto aspect-square p-0 lg:hidden"
            onClick={() =>
              dispatchEvent(new CustomEvent('mobile-explorer-open-change'))
            }
          >
            <FilesIcon size={16} strokeWidth={2} />
          </Button>
        </div>

        <div className="flex w-full gap-1 lg:w-auto">
          <ExecuteBar runtime={runtime} />

          <Button
            variant="secondary"
            className="ml-auto aspect-square p-0 lg:hidden"
            onClick={() =>
              dispatchEvent(new CustomEvent('mobile-terminal-open-change'))
            }
          >
            <TerminalIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div className="relative h-full w-full">
        <ContextMenuWrapper
          items={[
            {
              label: 'Execute Code',
              shortcut: 'Ctrl+Enter',
              action: handlers.execute,
            },
            null,
            { label: 'Copy', action: handlers.copy },
            { label: 'Paste', action: handlers.paste },
            { label: 'Cut', action: handlers.cut },
          ]}
        >
          <div
            className={cn('h-full [&>*]:h-full', !file && 'hidden')}
            ref={editorRef}
          />
        </ContextMenuWrapper>
      </div>
    </section>
  );
}
