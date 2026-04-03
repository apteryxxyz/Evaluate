import type { File } from './file';
import type { Folder } from './folder';

export class Children<
  Of extends Folder | File = Folder | File,
> extends Array<Of> {
  public remove(...items: Of[]) {
    for (const item of items) {
      if (typeof item === 'function') {
        for (const i of this.filter(item)) this.remove(i);
      } else {
        const index = this.indexOf(item);
        if (index !== -1) this.splice(index, 1);
      }
    }
  }

  public where(
    predicate: Parameters<Array<Of>['filter']>[0],
    callback: Parameters<Array<Of>['map']>[0],
  ) {
    return this.filter(predicate).map(callback);
  }

  public override sort() {
    return super.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });
  }
}
