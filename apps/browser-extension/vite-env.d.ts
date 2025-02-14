/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string | undefined>> {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
