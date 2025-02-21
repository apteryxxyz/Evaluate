'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@evaluate/components/accordion';
import { Button } from '@evaluate/components/button';
import { TextCursorInputIcon, Trash2Icon } from 'lucide-react';
import { twMerge as cn } from 'tailwind-merge';
import type { Folder } from 'virtual-file-explorer-backend';
import { MaterialIcon } from '~/components/material-icon';
import { useIsMobile } from '~/hooks/use-is-mobile';
import { ExplorerItemName } from '../name';
import { useWatch } from '../use';
import { ExplorerFolderChildren } from './children';
import {
  useClickable,
  useDeleteable,
  useDraggable,
  useDropzone,
  useNameable,
} from './hooks';

namespace ExplorerFolderItem {
  export interface Props {
    folder: Folder<false>;
  }
}

export function ExplorerFolderItem({ folder }: ExplorerFolderItem.Props) {
  useWatch(folder, ['children', 'expanded', 'selected']);

  const isMobile = useIsMobile();
  const { draggableRef } = useDraggable(folder);
  const { isOver, dropzoneRef } = useDropzone(folder);
  const { handleClick } = useClickable(folder);
  const { naming, setNaming, handleRenameClick } = useNameable(folder);
  const { handleDeleteClick } = useDeleteable(folder);

  return (
    <Accordion
      ref={dropzoneRef}
      className={cn(isOver && 'bg-border')}
      type="single"
      collapsible
      value={folder.expanded ? 'open' : ''}
      onValueChange={handleClick}
    >
      <AccordionItem value="open" className="border-b-0">
        <AccordionTrigger className="h-auto w-full p-0 hover:no-underline">
          <Button
            ref={draggableRef}
            variant={folder.selected ? 'secondary' : 'ghost'}
            className="group relative h-auto w-full justify-start rounded-none p-0"
            style={{
              paddingLeft: `${6 + (folder.ancestors.length - 1) * 6}px`,
            }}
            data-ignore-blur
          >
            <MaterialIcon
              type="folder"
              expanded={folder.expanded}
              name={folder.name}
            />
            <ExplorerItemName
              item={folder}
              naming={naming}
              setNaming={setNaming}
            />

            <div
              className={cn(
                'absolute top-[20%] right-0 pr-1.5',
                isMobile ? 'block' : 'hidden group-hover:block',
              )}
            >
              <Button
                type="button"
                size="icon"
                variant={null}
                className="h-auto w-auto p-0"
                onClick={handleRenameClick}
              >
                <TextCursorInputIcon size={16} />
                <span className="sr-only">Rename File</span>
              </Button>

              <Button
                type="button"
                size="icon"
                variant={null}
                className="h-auto w-auto p-0"
                onClick={handleDeleteClick}
              >
                <Trash2Icon size={16} />
                <span className="sr-only">Delete File</span>
              </Button>
            </div>
          </Button>
        </AccordionTrigger>

        <AccordionContent className="flex flex-col pb-0">
          <ExplorerFolderChildren folder={folder} />

          {/* The accordion glitches when there is nothing in its content */}
          <span className="h-[0.09px]" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
