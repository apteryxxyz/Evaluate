'use client';

import { getIconFromExtension } from '@evaluate/engine/runtimes';
import { Button } from '@evaluate/react/components/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@evaluate/react/components/context-menu';
import { FileIcon, ScanIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { File } from '../../_contexts/explorer/file-system';
import { FileExplorerItemName } from './item-name';

export function FileExplorerFileItem(p: { file: File; isMeta?: boolean }) {
  const [isRenaming, setIsRenaming] = useState(!p.file.name);
  const icon = useMemo(
    () => getIconFromExtension(`.${p.file.extension}`),
    [p.file],
  );

  return (
    <FileExplorerFileItemWrapper {...p} setIsRenaming={setIsRenaming}>
      <Button
        variant={p.file.isSelected ? 'secondary' : 'ghost'}
        className="h-auto w-full justify-start rounded-none p-0"
        style={{ paddingLeft: `${12 + (p.file.countParents() - 1) * 6}px` }}
        onClick={() => {
          p.file.setSelected(true);
          p.file.setOpened(true);
        }}
        data-ignore-blur
      >
        <div className="mr-1 flex items-center justify-center">
          {p.isMeta ? (
            <ScanIcon className="size-4" />
          ) : !icon ? (
            <FileIcon className="size-4" />
          ) : (
            <img
              src={makeIconUrl(icon)}
              alt={p.file.extension}
              className="size-4"
            />
          )}
        </div>
        <FileExplorerItemName
          item={p.file}
          isRenaming={isRenaming}
          setIsRenaming={setIsRenaming}
        />
      </Button>
    </FileExplorerFileItemWrapper>
  );
}

function makeIconUrl(icon: string) {
  return `https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/940f2ea7a6fcdc0221ab9a8fc9454cc585de11f0/icons/${icon}.svg`;
}

function FileExplorerFileItemWrapper(
  p: React.PropsWithChildren<{
    file: File;
    setIsRenaming: React.Dispatch<React.SetStateAction<boolean>>;
    isMeta?: boolean;
  }>,
) {
  if (p.isMeta) return p.children;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{p.children}</ContextMenuTrigger>

      <ContextMenuContent>
        {[
          { label: 'Rename File', onClick: () => p.setIsRenaming(true) },
          { label: 'Delete File', onClick: () => p.file.deleteSelf() },
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
