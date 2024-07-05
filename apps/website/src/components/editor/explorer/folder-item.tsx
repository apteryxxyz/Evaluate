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
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { FolderIcon, FolderOpenIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
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

  const inputRef = useRef<HTMLInputElement>(null);
  const onUploadClick = useCallback(() => {
    inputRef.current?.click();
  }, []);
  useEffect(() => {
    const onUpload = () => {
      if (!inputRef.current?.files) return;
      for (const file of Array.from(inputRef.current.files)) {
        const reader = new FileReader();
        reader.onload = () => {
          p.folder
            .createChild('file', file.name)
            .setContent(reader.result as string);
        };
        reader.readAsText(file);
      }
      inputRef.current.value = '';
    };

    inputRef.current?.addEventListener('change', onUpload);
    return () => inputRef.current?.removeEventListener('change', onUpload);
  }, [p.folder]);

  const onDownloadClick = useCallback(() => {
    const zip = new JSZip();

    for (const child of p.folder.descendants)
      if (child.type === 'folder') zip.folder(child.path);
      else zip.file(child.path, child.content ?? '');

    zip
      .generateAsync({ type: 'blob' })
      .then((b) => FileSaver.saveAs(b, `${p.folder.name}.zip`));
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
                  <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    multiple
                  />

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
                null,
                { label: 'Rename Folder', onClick: onRenameClick },
                { label: 'Delete Folder', onClick: onDeleteClick },
                null,
                { label: 'Upload File', onClick: onUploadClick },
                { label: 'Download Folder', onClick: onDownloadClick },
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
