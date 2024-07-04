'use client';

import { Button } from '@evaluate/react/components/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@evaluate/react/components/context-menu';
import { useCallback, useState } from 'react';
import { FileIcon } from './file-icon';
import type { File } from './file-system';
import { FileExplorerItemName } from './item-name';

export function FileExplorerFileItem(p: { file: File; isMeta?: boolean }) {
  const [isRenaming, setIsRenaming] = useState(!p.file.name);

  const onClick = useCallback(() => {
    p.file.setSelected(true);
    p.file.setOpened(true);
  }, [p.file]);

  return (
    <FileExplorerFileItemWrapper {...p} setIsRenaming={setIsRenaming}>
      <Button
        variant={p.file.isSelected ? 'secondary' : 'ghost'}
        className="h-auto w-full justify-start rounded-none p-0"
        style={{ paddingLeft: `${12 + (p.file.countParents() - 1) * 6}px` }}
        onClick={onClick}
        data-ignore-blur
      >
        <FileIcon
          fileName={p.file.name ?? ''}
          isRenaming={isRenaming}
          isMeta={p.isMeta}
        />
        <FileExplorerItemName
          item={p.file}
          isRenaming={isRenaming}
          setIsRenaming={setIsRenaming}
        />
      </Button>
    </FileExplorerFileItemWrapper>
  );
}

function FileExplorerFileItemWrapper(
  p: React.PropsWithChildren<{
    file: File;
    setIsRenaming: React.Dispatch<React.SetStateAction<boolean>>;
    isMeta?: boolean;
  }>,
) {
  if (p.isMeta) return p.children;

  const onRenameClick = useCallback(() => {
    p.setIsRenaming(true);
  }, [p.setIsRenaming]);

  const onDeleteClick = useCallback(() => {
    p.file.deleteSelf();
  }, [p.file]);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{p.children}</ContextMenuTrigger>

      <ContextMenuContent>
        {[
          { label: 'Rename File', onClick: onRenameClick },
          { label: 'Delete File', onClick: onDeleteClick },
        ].map((p) => (
          <ContextMenuItem key={p.label} asChild>
            <Button
              variant="ghost"
              className="h-auto w-full cursor-pointer justify-start p-1 px-6 font-normal focus-visible:ring-0"
              onClick={p.onClick}
            >
              {p.label}
            </Button>
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}
