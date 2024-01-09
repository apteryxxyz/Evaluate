import type { Options } from 'tsup';
export declare function defineConfig(options: Options): {
  skipNodeModulesBundle: true;
  outExtension: ({
    format: f,
  }: {
    options: import('tsup').NormalizedOptions;
    format: import('tsup').Format;
    pkgType?: string | undefined;
  }) => {
    js: string;
  };
  platform: 'node';
  format: ('cjs' | 'esm')[];
  target: 'es2022';
  clean: true;
  splitting: true;
  bundle: true;
  treeshake: true;
  keepNames: true;
  minifySyntax: true;
  dts: true;
} & Options;
export declare function runCommand(command: string): Promise<unknown>;
export declare function beforeExit<T>(action: T): () => unknown;
export declare function readFile(filePath: string): Promise<string>;
export declare function writeFile(
  filePath: string,
  content: string,
): Promise<void>;
export declare function listDirectory(directoryPath: string): Promise<string[]>;
export declare function injectVersion(directoryPath?: string): Promise<void>;
export declare function addExports(
  fromDirectory: string,
  toDirectory?: string,
): Promise<void>;
