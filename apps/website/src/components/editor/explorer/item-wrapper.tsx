import type { File, Folder } from './file-system';
import { FileExplorerFileItem } from './file-item';
import { FileExplorerFolderItem } from './folder-item';

export function FileExplorerItemWrapper(p: { item: Folder | File }) {
  if (p.item.type === 'folder')
    return <FileExplorerFolderItem folder={p.item} />;
  if (p.item.type === 'file') return <FileExplorerFileItem file={p.item} />;
  return null;
}
