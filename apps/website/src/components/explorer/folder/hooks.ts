import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { File, Folder } from 'virtual-file-explorer-backend';

export function useDraggable(folder: Folder) {
  const [, draggableRef] = useDrag(
    () => ({ type: 'folder', item: folder }),
    [folder],
  );
  return {
    draggableRef: draggableRef as unknown as React.RefCallback<unknown>,
  };
}

export function useDropzone(folder: Folder) {
  const [props, dropzoneRef] = useDrop(
    () => ({
      accept: ['file', 'folder'],
      canDrop: (i: File | Folder) => i !== folder,
      drop: (i: File | Folder, m) => m.didDrop() || (i.parent = folder),
      collect: (m) => ({ isOver: m.isOver({ shallow: true }) }),
    }),
    [folder],
  );
  return {
    ...props,
    dropzoneRef: dropzoneRef as unknown as React.RefCallback<unknown>,
  };
}

export function useClickable(folder: Folder) {
  const handleClick = useCallback(
    (ev: React.MouseEvent | string) => {
      if (typeof ev === 'object' && folder.name === '::root::') {
        const target = ev.target as HTMLElement;
        if (target.getAttribute('data-radix-scroll-area-viewport') === '')
          folder.selected = true;
      } else {
        folder.selected = true;
        folder.expanded = !folder.expanded;
      }
    },
    [folder],
  );
  return { handleClick };
}

export function useNameable(folder: Folder) {
  const [naming, setNaming] = useState(!folder.name);
  const handleRenameClick = useCallback(() => setNaming(true), []);
  return { naming, setNaming, handleRenameClick };
}

export function useDeleteable(folder: Folder) {
  const handleDeleteClick = useCallback(() => (folder.parent = null), [folder]);
  return { handleDeleteClick };
}

function createChild<C extends File | Folder>(
  this: { root: Folder<true> | null },
  Constructor: new () => C,
  parent?: Folder,
) {
  if (!parent) {
    const found = this.root?.lineage.find((f) => f.selected) || this.root!;
    parent = found?.type === 'file' ? found.parent! : found;
  }
  const item = new Constructor();
  item.parent = parent;
  if (item.type === 'file') {
    item.selected = true;
    item.opened = true;
    item.focused = true;
  } else {
    item.selected = true;
  }
}

export function useChildren(folder: Folder) {
  const handleNewFileClick = useCallback(
    () => createChild.call(folder, File),
    [folder],
  );
  const handleNewFolderClick = useCallback(
    () => createChild.call(folder, Folder),
    [folder],
  );
  return {
    handleNewFileClick,
    handleNewFolderClick,
  };
}

// NOTE: Unused
export function useUploadable(folder: Folder) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleUploadClick = useCallback(() => inputRef.current?.click(), []);
  useEffect(() => {
    const onUpload = () => {
      if (!inputRef.current?.files) return;
      for (const file of Array.from(inputRef.current.files)) {
        const reader = new FileReader();
        reader.onload = () => {
          const child = new File();
          child.name = file.name;
          child.content = reader.result as string;
          child.parent = folder;
        };
        reader.readAsText(file);
      }
    };

    inputRef.current?.addEventListener('change', onUpload);
    return () => inputRef.current?.removeEventListener('change', onUpload);
  }, [folder]);
  return { handleUploadClick, inputRef };
}

export function useDownloadable(folder: Folder) {
  const handleDownloadClick = useCallback(() => {
    const zip = folder.descendants.reduce(
      (z, f) => (f.type === 'file' && z.file(f.path, f.content ?? '')) || z,
      new JSZip(),
    );

    const name = folder.name === '::root::' ? 'evaluate' : folder.name;
    return zip
      .generateAsync({ type: 'blob' })
      .then((b) => FileSaver.saveAs(b, name));
  }, [folder]);

  return { handleDownloadClick };
}
