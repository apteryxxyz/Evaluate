'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@evaluate/react/components/accordion';
import { Button } from '@evaluate/react/components/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@evaluate/react/components/context-menu';
import { FolderIcon, FolderOpenIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { Folder } from './file-system';
import { FileExplorerItemName } from './item-name';
import { FileExplorerItemWrapper } from './item-wrapper';

export function FileExplorerFolderItem(p: { folder: Folder }) {
  const [isRenaming, setIsRenaming] = useState(!p.folder.name);

  const onClick = useCallback(() => {
    p.folder.setOpened(!p.folder.isOpened);
    p.folder.setSelected(true);
  }, [p.folder]);

  const onNewFileClick = useCallback(() => {
    p.folder.createChild('file');
  }, [p.folder]);

  const onNewFolderClick = useCallback(() => {
    p.folder.createChild('folder');
  }, [p.folder]);

  const onRenameClick = useCallback(() => {
    setIsRenaming(true);
  }, []);

  const onDeleteClick = useCallback(() => {
    p.folder.deleteSelf();
  }, [p.folder]);

  return (
    <Accordion
      type="single"
      collapsible
      value={p.folder.isOpened ? 'open' : ''}
      onValueChange={onClick}
    >
      <AccordionItem value="open" className="border-b-0">
        <AccordionTrigger className="h-auto w-full p-0 hover:no-underline">
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <Button
                variant={p.folder.isSelected ? 'secondary' : 'ghost'}
                className="h-auto w-full justify-start rounded-none p-0"
                style={{
                  paddingLeft: `${12 + (p.folder.countParents() - 1) * 6}px`,
                }}
                data-ignore-blur
              >
                <div className="mr-1 flex items-center justify-center">
                  <FolderIcon
                    size={16}
                    strokeWidth={1.5}
                    style={{ display: p.folder.isOpened ? 'none' : 'block' }}
                  />
                  <FolderOpenIcon
                    size={16}
                    strokeWidth={1.5}
                    style={{ display: p.folder.isOpened ? 'block' : 'none' }}
                  />
                </div>
                <FileExplorerItemName
                  item={p.folder}
                  isRenaming={isRenaming}
                  setIsRenaming={setIsRenaming}
                />
              </Button>
            </ContextMenuTrigger>

            <ContextMenuContent className="p-1">
              {[
                { label: 'New File', onClick: onNewFileClick },
                { label: 'New Folder', onClick: onNewFolderClick },
                '---' as const,
                { label: 'Rename Folder', onClick: onRenameClick },
                { label: 'Delete Folder', onClick: onDeleteClick },
              ].map((p, i) =>
                p === '---' ? (
                  <ContextMenuSeparator key={i} />
                ) : (
                  <ContextMenuItem key={i} asChild>
                    <Button
                      variant="ghost"
                      className="h-auto w-full cursor-pointer justify-start p-1 px-6 font-normal focus-visible:ring-0"
                      onClick={p.onClick}
                    >
                      {p.label}
                    </Button>
                  </ContextMenuItem>
                ),
              )}
            </ContextMenuContent>
          </ContextMenu>
        </AccordionTrigger>

        <AccordionContent className="flex flex-col pb-0">
          {p.folder.sortChildren().map((child) => (
            <FileExplorerItemWrapper key={child.path} item={child} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
