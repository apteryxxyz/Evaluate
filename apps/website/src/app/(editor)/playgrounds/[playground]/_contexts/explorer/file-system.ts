import {
  type Compressed,
  compress,
  decompress,
} from '@evaluate/engine/compress';
import type { ExecuteOptions } from '@evaluate/engine/execute';
import { EventEmitter } from 'eventemitter3';
import { Mixin, hasMixin } from 'ts-mixer';

export class WithRoot {
  /**
   * Find the root of the file structure.
   * @returns The root of the file structure.
   */
  public findRoot(): Root {
    if (this instanceof Root) {
      return this;
    } else if (hasMixin(this, WithParent)) {
      if (this.parent instanceof Root) return this.parent;
      return this.parent.findRoot();
    } else {
      throw new Error('Root not found');
    }
  }
}

export class WithChildren {
  public readonly children: (Folder | File)[] = [];
  public get descendants(): (Folder | File)[] {
    const result: (Folder | File)[] = [...this.children];
    for (const child of this.children)
      if (child instanceof Folder) result.push(...child.descendants);
    return result;
  }

  public createChild(type: 'file', name?: string, emit?: boolean): File;
  public createChild(type: 'folder', name?: string, emit?: boolean): Folder;
  public createChild(type: 'file' | 'folder', name?: string, emit = true) {
    const child = new (type === 'folder' ? Folder : File)();

    Reflect.set(child, 'parent', this);
    if (name) child.setName(name, false);
    if (hasMixin(this, WithParent) && child.parent instanceof Folder)
      child.setOpened(true, false);
    child.setSelected(true, false);

    this.children.push(child);

    if (emit && hasMixin(this, WithRoot))
      this.findRoot().emitter.emit('change');
    return child;
  }

  public deleteChild(id?: string, emit = true) {
    const index = this.children.findIndex((child) => child.id === id);
    if (index === -1) return false;

    this.children.splice(index, 1);
    if (emit && hasMixin(this, WithRoot))
      this.findRoot().emitter.emit('change');
    return true;
  }

  public sortChildren() {
    return this.children.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;
      return (a.name ?? '').localeCompare(b.name ?? '');
    });
  }
}

export class WithParent {
  public readonly id = Math.random().toString(36).slice(2);
  public readonly parent: Root | Folder = null!;

  /**
   * Count the number of parents of this file or folder.
   * @returns The number of parents of the file or folder.
   */
  public countParents(): number {
    if (this.parent instanceof Root) return 0;
    return 1 + this.parent.countParents();
  }

  public deleteSelf() {
    return this.parent.deleteChild(this.id);
  }
}

export class WithName {
  public readonly name: string | undefined = undefined;
  /**
   * Set the name of this file or folder.
   * @param name - The new name of the file or folder.
   */
  public setName(name: string, emit = true) {
    if (hasMixin(this, WithParent)) {
      const existing = this.parent.children.find((c) => c.name === name);
      if (existing) throw new Error('A child with that name already exists');
    }

    if (!this.name && hasMixin(this, WithOpened)) this.setOpened(true);
    Reflect.set(this, 'name', name);
    if (hasMixin(this, WithChildren)) this.sortChildren();
    if (emit && hasMixin(this, WithRoot))
      this.findRoot().emitter.emit('change');
  }
}

export class WithContent {
  public readonly content = '';

  /**
   * Set the content of the file.
   * @param content - The content of the file.
   */
  public setContent(content: string, emit = true) {
    Reflect.set(this, 'content', content);
    if (emit && hasMixin(this, WithRoot))
      this.findRoot().emitter.emit('change');
  }
}

export class WithEntry {
  public readonly isEntry = false;

  /**
   * Set the entry state of the file.
   * @param isEntry - The entry state of the file.
   */
  public setEntry(isEntry: boolean, emit = true) {
    if (this.isEntry === isEntry) return;

    if (this instanceof File) {
      const root = this.findRoot();
      const entryFile = root.descendants //
        .find((d): d is File => d.type === 'file' && d.isEntry);
      if (entryFile) Reflect.set(entryFile, 'isEntry', false);
    }

    Reflect.set(this, 'isEntry', isEntry);
    if (emit && hasMixin(this, WithRoot))
      this.findRoot().emitter.emit('change');
  }
}

export class WithSelected {
  public readonly isSelected = false;

  /**
   * Set the selected state of the file or folder.
   * @param isSelected - The selected state of the file or folder.
   */
  public setSelected(isSelected: boolean, emit = true) {
    if (this.isSelected === isSelected) return;

    if (hasMixin(this, WithRoot)) {
      const root = this.findRoot();
      const child = root.descendants
        // The root can be selected
        .concat(root as unknown as Folder, root.args, root.input)
        .find((child) => child.isSelected);
      if (child) Reflect.set(child, 'isSelected', false);
    }

    Reflect.set(this, 'isSelected', isSelected);
    if (emit && hasMixin(this, WithRoot))
      this.findRoot().emitter.emit('change');
  }
}

export class WithOpened {
  public readonly isOpened = false;

  /**
   * Set the opened state of the file.
   * @param isOpened - The opened state of the file.
   */
  public setOpened(isOpened: boolean, emit = true) {
    if (this.isOpened === isOpened) return;

    if (this instanceof File) {
      const root = this.findRoot();
      const openedFile = root.descendants
        .concat(root.args, root.input) //
        .find((d): d is File => d.type === 'file' && d.isOpened);
      if (openedFile) Reflect.set(openedFile, 'isOpened', false);
    }

    Reflect.set(this, 'isOpened', isOpened);
    if (hasMixin(this, WithTabOpened)) this.setTabOpened(isOpened, emit);
    if (emit && hasMixin(this, WithRoot))
      this.findRoot().emitter.emit('change');
  }
}

export class WithTabOpened {
  public readonly isTabOpened = false;

  public setTabOpened(isTabOpened: boolean, emit = true) {
    if (this.isTabOpened === isTabOpened) return;
    Reflect.set(this, 'isTabOpened', isTabOpened);
    if (emit && hasMixin(this, WithRoot))
      this.findRoot().emitter.emit('change');
  }
}

//

export class Root extends Mixin(
  WithRoot,
  WithChildren,
  WithSelected,
  WithOpened,
) {
  public readonly type = 'root';
  public readonly emitter = new EventEmitter();
  public get path() {
    return '';
  }

  public input = new File();
  public args = new File();
  public constructor() {
    super();

    Reflect.set(this.input, 'parent', this);
    Reflect.set(this.args, 'parent', this);
    this.input.setName('STD Input', false);
    this.args.setName('CLI Arguments', false);
  }

  public get hash() {
    if (this.children.length === 0 && !this.input.content && !this.args.content)
      return undefined;
    return compress(this.toJSON());
  }

  public set hash(hash: string | undefined) {
    if (!hash) {
      this.children.length = 0;
      this.input.setContent('', false);
      this.args.setContent('', false);
      this.emitter.emit('change');
      return;
    }

    const data = decompress(hash as Compressed<ExecuteOptions>);
    if (data.args) this.args.setContent(data.args, false);
    if (data.input) this.input.setContent(data.input, false);
    this.setStructure(data.files);
    this.findFile(data.entry)?.setEntry(true);
  }

  public findSelectedFolder(): Root | Folder {
    const selected = this.descendants.find((c) => c.isSelected);
    if (selected instanceof Folder) return selected;
    if (selected instanceof File) return selected.parent;
    return this;
  }

  public findOpenedFile() {
    if (this.input.isOpened) return this.input;
    if (this.args.isOpened) return this.args;
    return this.descendants //
      .find((c): c is File => c.type === 'file' && c.isOpened);
  }

  public findTabOpenedFiles() {
    return this.descendants //
      .filter((c): c is File => c.type === 'file' && c.isTabOpened);
  }

  public findEntryFile() {
    return this.descendants //
      .find((c): c is File => c.type === 'file' && c.isEntry);
  }

  public findFile(pathOrId: string) {
    if (this.input.id === pathOrId) return this.input;
    if (this.args.id === pathOrId) return this.args;

    return this.descendants.find(
      (c): c is File =>
        c.type === 'file' && (c.id === pathOrId || c.path === pathOrId),
    );
  }

  public isEmpty() {
    return (
      this.children.length === 0 && !this.input.content && !this.args.content
    );
  }

  public clear() {
    this.children.length = 0;
    this.input.setContent('', false);
    this.args.setContent('', false);
    this.emitter.emit('change');
  }

  public setStructure(files: Record<string, string>) {
    for (const [path, content] of Object.entries(files)) {
      let parent = this as unknown as Folder;

      for (const name of path.split('/').slice(0, -1)) {
        const child = this.children.find((c) => c.name === name);

        if (child instanceof File) {
          throw new Error('Invalid state');
        } else if (child instanceof Folder) {
          parent = child;
        } else {
          parent = parent.createChild('folder', name);
        }
      }

      if (!path.endsWith('/')) {
        const name = path.split('/').pop()!;
        const file = parent.createChild('file', name);
        file.setContent(content, false);
      }
    }

    if (hasMixin(this, WithRoot)) this.emitter.emit('change');
  }

  public toJSON() {
    return {
      entry: this.findEntryFile()?.path,
      files: Object.fromEntries(
        this.descendants
          .filter((c): c is File => c.type === 'file')
          .map((f) => [f.path, f.content]),
      ),
      args: this.args.content || undefined,
      input: this.input.content || undefined,
    };
  }

  public fromJSON(data: Omit<ExecuteOptions, 'runtime'>) {
    this.clear();
    this.setStructure(data.files);
    this.args.setContent(data.args || '', false);
    this.input.setContent(data.input || '', false);
    this.findFile(data.entry!)?.setEntry(true);
  }

  public toHash() {
    return compress(this.toJSON());
  }

  public fromHash(hash: string) {
    let data: ExecuteOptions | undefined = undefined;
    try {
      data = decompress(hash as Compressed<ExecuteOptions>);
    } catch {
      this.clear();
    }
    if (data) this.fromJSON(data);
  }
}

export class Folder extends Mixin(
  WithRoot,
  WithParent,
  WithChildren,
  WithName,
  WithSelected,
  WithOpened,
) {
  public readonly type = 'folder';
  public get path(): string {
    return `${this.parent.path}${this.name}/`;
  }
}

export class File extends Mixin(
  WithRoot,
  WithParent,
  WithEntry,
  WithName,
  WithContent,
  WithSelected,
  WithOpened,
  WithTabOpened,
) {
  public readonly type = 'file';
  public get path() {
    return `${this.parent.path}${this.name}`;
  }
  public get extension() {
    return this.name?.split('.').pop();
  }
}
