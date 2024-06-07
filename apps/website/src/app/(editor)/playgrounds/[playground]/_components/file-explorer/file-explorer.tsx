'use client';

import { Button } from '@evaluate/react/components/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@evaluate/react/components/context-menu';
import { Scrollable } from '@evaluate/react/components/scrollable';
import { FilePlusIcon, FolderPlusIcon } from 'lucide-react';
import {
  useExplorer,
  useWatchExplorer,
} from '../../_contexts/explorer/explorer';
import { FileExplorerFileItem } from './file-item';
import { FileExplorerItemWrapper } from './item-wrapper';

export function FileExplorer() {
  const explorer = useExplorer();
  useWatchExplorer(explorer);

  return (
    <section className="relative h-full w-full">
      <div className="flex h-10 items-center gap-2 border-b px-4 py-2">
        <span className="mr-auto font-medium text-sm">Explorer</span>

        <Button
          size="icon"
          variant="ghost"
          className="h-auto w-auto rounded-full"
          onClick={() => explorer.findSelectedFolder().createChild('file')}
          title="New File"
        >
          <FilePlusIcon className="size-4" />
          <span className="sr-only">New File</span>
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="h-auto w-auto rounded-full"
          onClick={() => explorer.findSelectedFolder().createChild('folder')}
          title="New Folder"
        >
          <FolderPlusIcon className="size-4" />
          <span className="sr-only">New Folder</span>
        </Button>
      </div>

      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Scrollable
            className="relative h-full w-full py-1"
            onClick={(e) => {
              if (
                e.target instanceof Element &&
                e.target.getAttribute('data-radix-scroll-area-viewport') === ''
              )
                explorer.setSelected(true);
            }}
            onKeyDown={(e) => e.key === 'Esc' && explorer.setSelected(true)}
          >
            <div className="mb-1 border-b">
              <FileExplorerFileItem file={explorer.args} isMeta />
              <FileExplorerFileItem file={explorer.input} isMeta />
            </div>

            {explorer.sortChildren().map((child) => (
              <FileExplorerItemWrapper key={child.path} item={child} />
            ))}

            {explorer.children.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="max-w-64 text-balance text-center text-foreground/50 text-sm">
                  This is the file explorer, create a new file to get started.
                </span>
              </div>
            )}
          </Scrollable>
        </ContextMenuTrigger>

        <ContextMenuContent className="p-1">
          {[
            {
              label: 'New File',
              onClick: () => explorer.findSelectedFolder().createChild('file'),
            },
            {
              label: 'New Folder',
              onClick: () =>
                explorer.findSelectedFolder().createChild('folder'),
            },
          ].map((p, i) =>
            p ? (
              <ContextMenuItem key={p.label} asChild>
                <Button
                  variant="ghost"
                  className="h-auto w-full cursor-pointer justify-start p-1 px-6 font-normal focus-visible:ring-0"
                  onClick={p.onClick}
                >
                  {p.label}
                </Button>
              </ContextMenuItem>
            ) : (
              <ContextMenuSeparator key={i} />
            ),
          )}
        </ContextMenuContent>
      </ContextMenu>
    </section>
  );
}
