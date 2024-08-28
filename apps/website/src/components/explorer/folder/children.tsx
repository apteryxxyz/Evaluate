import type { Folder } from 'virtual-file-explorer-backend';
import { ExplorerFileItem } from '../file/item';
import { ExplorerFolderItem } from './item';

export function ExplorerFolderChildren({ folder }: { folder: Folder }) {
  return (
    <>
      {folder.children
        .sort()
        .filter((c) => !/::\w+::/.test(c.name))
        .map((c) => {
          if (c.type === 'folder') {
            return <ExplorerFolderItem key={c.path} folder={c} />;
          } else {
            return (
              <ExplorerFileItem
                // When a file is created (aka no name), use a random key, prevents React from reusing the component
                key={c.name ? c.path : String(Math.random())}
                file={c}
              />
            );
          }
        })}
    </>
  );
}
