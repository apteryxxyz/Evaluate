'use client';

import { Button } from '@evaluate/components/button';
import { TextCursorInputIcon, Trash2Icon } from 'lucide-react';
import { twMerge as cn } from 'tailwind-merge';
import type { File } from 'virtual-file-explorer-backend';
import { MaterialIcon } from '~/components/material-icon';
import { useIsMobile } from '~/hooks/is-mobile';
import { ExplorerItemName } from '../name';
import { useWatch } from '../use';
import {
  useClickable,
  useDeleteable,
  useDraggable,
  useNameable,
} from './hooks';

export namespace ExplorerFileItem {
  export interface Props {
    file: File;
    meta?: boolean;
  }
}

export function ExplorerFileItem({ file, meta }: ExplorerFileItem.Props) {
  useWatch(file, ['selected']);

  const isMobile = useIsMobile();
  const { draggableRef } = useDraggable(file);
  const { handleClick } = useClickable(file);
  const { naming, setNaming, handleRenameClick } = useNameable(file);
  const { handleDeleteClick } = useDeleteable(file);

  return (
    <Button
      ref={draggableRef}
      variant={file.selected ? 'secondary' : 'ghost'}
      className="group relative flex h-auto w-full justify-start rounded-none p-0"
      style={{ paddingLeft: `${6 + (file.ancestors.length - 1) * 6}px` }}
      onClick={handleClick}
      data-ignore-blur
    >
      <MaterialIcon type="file" name={file.name} naming={naming} />
      <ExplorerItemName item={file} naming={naming} setNaming={setNaming} />

      {!meta && (
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
            asChild
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
            asChild
          >
            <Trash2Icon size={16} />
            <span className="sr-only">Delete File</span>
          </Button>
        </div>
      )}
    </Button>
  );
}
