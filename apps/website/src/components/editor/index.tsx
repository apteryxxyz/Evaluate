'use client';

import { Button } from '@evaluate/react/components/button';
import { ScrollArea, ScrollBar } from '@evaluate/react/components/scroll-area';
import { useEventListener } from '@evaluate/react/hooks/event-listener';
import { cn } from '@evaluate/react/utilities/class-name';
import type { PartialRuntime } from '@evaluate/types';
import { FilesIcon, Share2Icon, TerminalIcon } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { ContextMenuWrapper } from '../context-menu-wrapper';
import { ExecuteBar } from './execute-bar';
import { useEditor } from './hooks';
import { OpenedFiles } from './opened-files';

export function Editor({ runtime }: { runtime: PartialRuntime }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const { file, handlers, setContainer } = useEditor();
  useEffect(() => setContainer(editorRef.current!), [setContainer]);

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const setEditorHeight = useCallback(() => {
    if (!sectionRef.current || !headerRef.current) return;
    const editorHeight =
      sectionRef.current.clientHeight - headerRef.current.clientHeight - 25;
    if (editorRef.current) editorRef.current.style.height = `${editorHeight}px`;
  }, []);
  useEventListener('resize', setEditorHeight);
  useEffect(setEditorHeight, []);

  return (
    <section ref={sectionRef} className="h-full">
      <div
        ref={headerRef}
        className="flex flex-col items-center gap-1 border-b px-0.5 lg:h-10 lg:flex-row"
      >
        <div className="flex w-full gap-1 lg:overflow-hidden">
          <ScrollArea className="flex w-full whitespace-nowrap">
            <OpenedFiles />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <Button
            variant="secondary"
            className="ml-auto aspect-square p-0"
            onClick={handlers.share}
          >
            <Share2Icon size={16} strokeWidth={2} />
          </Button>

          <Button
            variant="secondary"
            className="aspect-square p-0 lg:hidden"
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
            {
              label: 'Share URL',
              shortcut: 'Ctrl+S',
              action: handlers.share,
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
